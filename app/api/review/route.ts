import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { runAtsChecks } from "@/lib/ats-checker";
import {
    generateCritiquePrompt,
    generateSkillGapPrompt,
    validateCritiqueResponse,
    validateSkillGapResponse,
    generateResponsibilityAlignmentPrompt,
    generateFixSuggestionsPrompt,
    validateResponsibilityAlignmentResponse,
    validateFixSuggestionsResponse,
} from "@/lib/prompts";
import { getChatCompletion } from "@/lib/openai";
import { countWords } from "@/lib/utils";

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
            parsingInsights,
        } = body;

        if (!resumeText || !targetRole || !experienceLevel) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const startTime = Date.now();

        // 1. Run Manual ATS Checks (deterministic)
        const atsResult = runAtsChecks(resumeText, targetRole, experienceLevel, {
            jobTitle,
            jobDescription,
            parsingInsights,
        });

        // 2. Run AI Critique
        const critiquePrompt = generateCritiquePrompt(
            resumeText,
            targetRole,
            experienceLevel
        );
        const aiCritiqueRaw = await getChatCompletion(critiquePrompt);
        const aiCritique = validateCritiqueResponse(aiCritiqueRaw);

        // 3. Run AI Skill Gap Analysis
        const skillGapPrompt = generateSkillGapPrompt(
            resumeText,
            targetRole,
            experienceLevel
        );
        const aiSkillGapRaw = await getChatCompletion(skillGapPrompt);
        const aiSkillGap = validateSkillGapResponse(aiSkillGapRaw);

        // 4. Responsibility Alignment (JD-aware if provided)
        const responsibilityPrompt = generateResponsibilityAlignmentPrompt(
            resumeText,
            targetRole,
            experienceLevel,
            jobTitle,
            jobDescription
        );
        const responsibilityRaw = await getChatCompletion(responsibilityPrompt);
        const responsibilityAnalysis =
            validateResponsibilityAlignmentResponse(responsibilityRaw);

        // 5. AI Fix Suggestions (local rewrites)
        const fixesPrompt = generateFixSuggestionsPrompt(
            resumeText,
            targetRole,
            experienceLevel
        );
        const fixesRaw = await getChatCompletion(fixesPrompt);
        const fixes = validateFixSuggestionsResponse(fixesRaw);

        const duration = Date.now() - startTime;

        // 4. Save to Database (Schema Aligned)
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
                atsScore: atsResult.atsScore,
                structuralIssues: atsResult.hardFailures as any,
                contentIssues: atsResult.warnings as any,
                aiCritique: aiCritique as any,
                skillGaps: aiSkillGap as any,
                finalVerdict: aiCritique.summaryVerdict,
                atsBreakdown: {
                    scores: {
                        ...atsResult.scores,
                        responsibilityAlignment: responsibilityAnalysis.responsibilityCoverageScore,
                    },
                    parsing: atsResult.parsing,
                    sections: atsResult.sections,
                    keywords: atsResult.keywords,
                    bullets: atsResult.bullets,
                    career: atsResult.career,
                    verdict: atsResult.verdict,
                    rejectionReasons: atsResult.rejectionReasons,
                } as any,
                responsibilityAnalysis: responsibilityAnalysis as any,
                recommendations: fixes as any,
                processingTimeMs: duration,
            },
        });

        // 5. Update Usage (Upsert to support new users)
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
