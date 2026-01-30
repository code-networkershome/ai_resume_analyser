import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { countWords } from "@/lib/utils";
import { analyzeResumeUniversal, convertToLegacyFormat } from "@/lib/universal-engine";

export async function POST(req: NextRequest) {
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

        if (!resumeText || !targetRole || !experienceLevel) {
            return NextResponse.json(
                { error: "Missing required fields" },
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

        return NextResponse.json({ reviewId: review.id });
    } catch (error: any) {
        console.error("Review API Error:", error);
        return NextResponse.json(
            { error: error?.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
