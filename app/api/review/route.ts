import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { countWords } from "@/lib/utils";
import { analyzeResumeUniversal, convertToLegacyFormat } from "@/lib/universal-engine";
import { sendReportEmail } from "@/lib/email";
import { generateReportPDF } from "@/lib/pdf-generator";
import { logAudit } from "@/lib/audit";
import { logToDebug } from "@/lib/logger";

// Configure max duration for Vercel/Next.js (60 seconds for Hobby, 300 for Pro)
export const maxDuration = 300;

export async function POST(req: NextRequest) {
    logToDebug("🚩 [Review API] STARTING ANALYSIS REQUEST");
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userId = session.user.id;

        const body = await req.json();
        const {
            resumeText,
            targetRole,
            experienceLevel,
            jobTitle,
            jobDescription,
        } = body;

        // 1. Strict Input Validation (Security & Cost Control)
        if (!resumeText || !targetRole || !experienceLevel) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Limit resume text to ~10,000 words (approx 50k chars) to prevent token exhaustion DoS
        if (resumeText.length > 50000) {
            return NextResponse.json(
                { error: "Resume text is too long (max 50,000 characters)" },
                { status: 400 }
            );
        }

        // Limit target role length to prevent injection weirdness
        if (targetRole.length > 200) {
            return NextResponse.json(
                { error: "Target role must be under 200 characters" },
                { status: 400 }
            );
        }

        const startTime = Date.now();

        // ===========================================
        // UNIVERSAL RESUME INTELLIGENCE ENGINE
        // ===========================================
        const universalAnalysis = await analyzeResumeUniversal(
            resumeText,
            targetRole,
            experienceLevel,
            jobTitle,
            jobDescription
        );

        // Convert to legacy format for backward compatibility
        const legacyResult = convertToLegacyFormat(universalAnalysis);

        const duration = Date.now() - startTime;

        // Save to Database
        try {
            const resume = await prisma.resume.create({
                data: {
                    userId: userId,
                    rawText: resumeText,
                    wordCount: countWords(resumeText),
                },
            });

            const review = await prisma.review.create({
                data: {
                    resumeId: resume.id,
                    targetRole,
                    experienceLevel,
                    atsScore: universalAnalysis.scores.composite.value,
                    structuralIssues: universalAnalysis.issues
                        .filter(i => i.affectedScores.includes("atsReadability"))
                        .map(i => i.description) as any,
                    contentIssues: universalAnalysis.issues
                        .filter(i => !i.affectedScores.includes("atsReadability"))
                        .map(i => i.description) as any,
                    aiCritique: {
                        summaryVerdict: universalAnalysis.verdict.summary,
                        primaryRejectionReasons: universalAnalysis.issues
                            .filter(i => i.severity === "high-impact")
                            .map(i => i.description),
                        roleFitAssessment: universalAnalysis.seniorityAnalysis.explanation,
                    } as any,
                    skillGaps: {
                        missingCoreSkills: universalAnalysis.alignment.gaps
                            .filter(g => g.importance === "high")
                            .map(g => g.expected),
                        missingToolsAndTech: universalAnalysis.alignment.gaps
                            .filter(g => g.importance === "medium")
                            .map(g => g.expected),
                    } as any,
                    finalVerdict: `${universalAnalysis.verdict.competitivenessLevel >= 70 ? "PASS" : universalAnalysis.verdict.competitivenessLevel >= 50 ? "WEAK PASS" : "REJECT"}: ${universalAnalysis.verdict.summary}`,
                    atsBreakdown: {
                        scores: {
                            atsCompatibility: universalAnalysis.scores.atsReadability.value,
                            parsingReliability: universalAnalysis.parsing.overallConfidence,
                            roleExpectationMatch: universalAnalysis.scores.roleAlignment.value,
                            skillEvidence: universalAnalysis.scores.evidenceStrength.value,
                            responsibilityAlignment: universalAnalysis.scores.roleAlignment.value,
                            recruiterShortlistingProbability: universalAnalysis.scores.composite.value,
                        },
                        parsing: {
                            confidence: universalAnalysis.parsing.overallConfidence,
                            warnings: universalAnalysis.parsing.warnings,
                        },
                        verdict: {
                            summary: universalAnalysis.verdict.summary,
                            tone: universalAnalysis.verdict.tone,
                            competitivenessLevel: universalAnalysis.verdict.competitivenessLevel,
                        },
                        // Include full universal analysis
                        universalAnalysis: universalAnalysis,
                        // Include Enhancv-style checks
                        enhancvChecks: universalAnalysis.enhancvChecks,
                    } as any,
                    responsibilityAnalysis: {
                        expectationsMet: universalAnalysis.roleReasoning.expectationsMet,
                        expectationsDiffer: universalAnalysis.roleReasoning.expectationsDiffer,
                        responsibilityCoverageScore: universalAnalysis.scores.roleAlignment.value,
                    } as any,
                    recommendations: {
                        bulletFixes: universalAnalysis.suggestions.bulletRewrites,
                        priorityFixList: universalAnalysis.roadmap.map(r => r.action),
                        generalAdvice: universalAnalysis.suggestions.generalAdvice,
                    } as any,
                    processingTimeMs: duration,
                },
            });

            // Update Usage
            await prisma.usage.upsert({
                where: { userId: userId },
                create: {
                    userId: userId,
                    reviewCount: 1,
                    lastReview: new Date(),
                },
                update: {
                    reviewCount: { increment: 1 },
                    lastReview: new Date(),
                },
            });

            // Send email with report link (async, don't block response)
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
            const reportUrl = `${appUrl}/review/${review.id}`;

            // Get user email from session
            const userEmail = session.user.email;
            const userName = session.user.name || undefined;

            console.log(`[Review API] Attempting to send report email...`);

            if (userEmail && process.env.RESEND_API_KEY) {
                console.log(`[Review API] Sending report email to ${userEmail}...`);

                // CRITICAL FIX: Await to ensure delivery in serverless environment
                try {
                    logToDebug("🚀 STARTING PDF GENERATION with Api2Pdf...");
                    const pdfBuffer = await generateReportPDF(universalAnalysis, targetRole);
                    logToDebug(`✅ PDF GENERATED SUCCESSFULLY. Buffer size: ${pdfBuffer.length} bytes`);

                    logToDebug(`📧 SENDING EMAIL via Resend to: ${userEmail}`);
                    const result = await sendReportEmail({
                        userEmail,
                        userName,
                        targetRole,
                        experienceLevel,
                        atsScore: universalAnalysis.scores.composite.value,
                        summaryVerdict: universalAnalysis.verdict.summary || 'Your resume analysis is complete.',
                        reportUrl,
                        keyIssues: universalAnalysis.issues
                            .filter((i: any) => i.severity === 'high-impact')
                            .slice(0, 5)
                            .map((i: any) => i.description) || [],
                        topPriorities: universalAnalysis.roadmap?.slice(0, 5).map((r: any) => r.action) || [],
                        pdfBuffer, // Attach the PDF!
                    });

                    if (result.success) {
                        logToDebug(`✨ EMAIL SENT SUCCESSFULLY! ID: ${result.id}`);
                    } else {
                        logToDebug(`❌ EMAIL FAILED:`, result.error);
                    }
                } catch (emailError: any) {
                    logToDebug(`🛑 FAILURE in PDF/Email Flow:`, { message: emailError.message, stack: emailError.stack });
                    // Don't fail the entire API call for email/PDF issues - send email without PDF
                    try {
                        logToDebug(`📧 SENDING EMAIL WITHOUT PDF to: ${userEmail}`);
                        const result = await sendReportEmail({
                            userEmail,
                            userName,
                            targetRole,
                            experienceLevel,
                            atsScore: universalAnalysis.scores.composite.value,
                            summaryVerdict: universalAnalysis.verdict.summary || 'Your resume analysis is complete.',
                            reportUrl,
                            keyIssues: universalAnalysis.issues
                                .filter((i: any) => i.severity === 'high-impact')
                                .slice(0, 5)
                                .map((i: any) => i.description) || [],
                            topPriorities: universalAnalysis.roadmap?.slice(0, 5).map((r: any) => r.action) || [],
                        });

                        if (result.success) {
                            logToDebug(`✨ EMAIL (NO PDF) SENT SUCCESSFULLY! ID: ${result.id}`);
                        } else {
                            logToDebug(`❌ EMAIL (NO PDF) FAILED:`, result.error);
                        }
                    } catch (fallbackError: any) {
                        logToDebug(`🛑 COMPLETE EMAIL FAILURE:`, { message: fallbackError.message });
                    }
                }
            } else {
                logToDebug("⚠️ Skipping email - missing RESEND_API_KEY or user email");
            }

            // Log Audit - Success
            await logAudit({
                action: "RESUME_ANALYSIS",
                userId: userId,
                details: {
                    resumeId: resume.id,
                    reviewId: review.id,
                    score: universalAnalysis.scores.composite.value,
                    processingTime: Date.now() - startTime
                }
            });

            return NextResponse.json({
                success: true,
                data: review,
                resumeId: resume.id,
                reviewId: review.id,
            });

        } catch (dbError: any) {
            console.error("Database error saving review:", dbError);
            await logAudit({
                action: "API_ERROR",
                userId: userId,
                details: { error: "DB Save Failed", message: String(dbError), path: "/api/review" }
            });
            return NextResponse.json(
                { error: "Failed to save analysis results" },
                { status: 500 }
            );
        }
    } catch (error: any) {
        console.error("Critical API error:", error);
        await logAudit({
            action: "API_ERROR",
            userId: "unknown",
            details: { error: "Critical API Error", message: String(error), path: "/api/review" }
        });
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
