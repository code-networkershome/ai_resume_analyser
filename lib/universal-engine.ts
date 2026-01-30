// ===========================================
// UNIVERSAL RESUME INTELLIGENCE ENGINE
// Main orchestration layer
// ===========================================

import {
    UniversalResumeAnalysis,
    AnalysisContext,
    ParsingTransparency,
} from "@/lib/types/universal-types";

import { runStructuralAnalysis, calculateParsingConfidence } from "./layers/structural-analysis";
import { runAIInference } from "./layers/ai-inference";
import { synthesizeScores } from "./layers/score-synthesis";
import { reconcileAndGenerateVerdict } from "./layers/reconciliation";

export async function analyzeResumeUniversal(
    resumeText: string,
    targetRole: string,
    experienceLevel: string,
    jobTitle?: string,
    jobDescription?: string
): Promise<UniversalResumeAnalysis> {
    const context: AnalysisContext = {
        resumeText,
        targetRole,
        experienceLevel,
        jobTitle,
        jobDescription,
    };

    // ===========================================
    // LAYER 1: Structural Analysis (Fast, code-based)
    // ===========================================
    const structural = runStructuralAnalysis(resumeText);
    const parsingConfidence = calculateParsingConfidence(structural);

    // Build parsing transparency
    const parsing: ParsingTransparency = {
        overallConfidence: parsingConfidence,
        structuralAmbiguities: [],
        layoutType: detectLayoutType(structural),
        languageDetected: detectLanguage(resumeText),
        warnings: generateParsingWarnings(structural, parsingConfidence),
    };

    // ===========================================
    // LAYER 2: AI Inference (LLM-powered)
    // ===========================================
    const aiResult = await runAIInference(context, structural);

    // ===========================================
    // LAYER 3: Score Synthesis
    // ===========================================
    const scores = synthesizeScores({
        structural,
        aiResult,
        parsingConfidence,
        experienceLevel,
    });

    // ===========================================
    // LAYER 4: Reconciliation & Verdict
    // ===========================================
    const reconciled = reconcileAndGenerateVerdict({
        scores,
        aiResult,
        parsingConfidence,
    });

    // ===========================================
    // FINAL ASSEMBLY
    // ===========================================
    return {
        verdict: reconciled.verdict,
        scores: reconciled.scores,
        parsing,
        assertions: aiResult.assertions,
        alignment: aiResult.alignment,
        roleReasoning: aiResult.roleReasoning,
        impactAnalysis: aiResult.impactAnalysis,
        issues: reconciled.issues,
        roadmap: reconciled.roadmap,
        jdAlignment: jobDescription ? buildJDAlignment(aiResult, jobDescription) : undefined,
        seniorityAnalysis: aiResult.seniorityAnalysis,
        suggestions: {
            bulletRewrites: aiResult.bulletRewrites,
            generalAdvice: generateGeneralAdvice(reconciled.scores, aiResult),
        },
    };
}

// ===========================================
// HELPER FUNCTIONS
// ===========================================

function detectLayoutType(structural: any): ParsingTransparency["layoutType"] {
    // Simple heuristics
    if (structural.sections.length >= 3 && structural.bullets.length >= 5) {
        return "standard";
    }
    if (structural.sections.length < 2) {
        return "design-heavy";
    }
    return "unknown";
}

function detectLanguage(text: string): string {
    // Simple detection - can be enhanced with library
    const englishWords = ["the", "and", "is", "in", "to", "of", "for", "with"];
    const lowered = text.toLowerCase();
    let englishCount = 0;

    for (const word of englishWords) {
        if (lowered.includes(` ${word} `)) englishCount++;
    }

    return englishCount >= 4 ? "English" : "Unknown";
}

function generateParsingWarnings(structural: any, confidence: number): string[] {
    const warnings: string[] = [];

    if (confidence < 70) {
        warnings.push("Resume structure may affect analysis accuracy");
    }
    if (structural.sections.length < 2) {
        warnings.push("Section headers may not be clearly identifiable");
    }
    if (structural.bullets.length < 3) {
        warnings.push("Limited bullet points detected");
    }
    if (!structural.contactInfo.email) {
        warnings.push("Email not detected - ensure contact info is visible");
    }

    return warnings;
}

function buildJDAlignment(aiResult: any, jd: string): any {
    // Extract from AI reasoning if available
    const requirements = aiResult.roleReasoning.expectationsMet
        .concat(aiResult.roleReasoning.expectationsDiffer)
        .map((r: any) => ({
            requirement: r.expectation,
            matchType: r.confidence > 70 ? "explicit" : r.confidence > 50 ? "implicit" : "missing",
            evidence: r.evidence,
            confidence: r.confidence,
        }));

    const covered = requirements.filter((r: any) => r.matchType !== "missing").length;
    const total = requirements.length || 1;

    return {
        requirements,
        coverageScore: Math.round((covered / total) * 100),
        unmatchedRequirements: aiResult.alignment.gaps.map((g: any) => g.expected),
    };
}

function generateGeneralAdvice(scores: any, aiResult: any): string[] {
    const advice: string[] = [];

    if (scores.evidenceStrength.value < 60) {
        advice.push("Add more quantified achievements and specific outcomes to strengthen impact evidence");
    }
    if (scores.roleAlignment.value < 60) {
        advice.push("Emphasize skills and experiences most relevant to your target role");
    }
    if (scores.atsReadability.value < 60) {
        advice.push("Use clear section headers and consistent bullet formatting for better ATS parsing");
    }
    if (aiResult.seniorityAnalysis.mismatchWithSelected) {
        advice.push(`Resume signals ${aiResult.seniorityAnalysis.inferredLevel} level - adjust language if targeting different seniority`);
    }

    return advice.slice(0, 4);
}

// ===========================================
// LEGACY COMPATIBILITY WRAPPER
// Maps new format to existing frontend expectations
// ===========================================

export function convertToLegacyFormat(analysis: UniversalResumeAnalysis): any {
    return {
        atsScore: analysis.scores.composite.value,
        verdict: analysis.verdict.competitivenessLevel >= 70 ? "PASS"
            : analysis.verdict.competitivenessLevel >= 50 ? "WEAK PASS"
                : "REJECT",
        atsBreakdown: {
            scores: {
                atsCompatibility: analysis.scores.atsReadability.value,
                parsingReliability: analysis.parsing.overallConfidence,
                roleExpectationMatch: analysis.scores.roleAlignment.value,
                skillEvidence: analysis.scores.evidenceStrength.value,
                responsibilityAlignment: analysis.scores.roleAlignment.value,
                recruiterShortlistingProbability: analysis.scores.composite.value,
            },
        },
        critique: {
            summaryVerdict: `${analysis.verdict.competitivenessLevel >= 70 ? "PASS" : analysis.verdict.competitivenessLevel >= 50 ? "WEAK PASS" : "REJECT"}: ${analysis.verdict.summary}`,
            primaryRejectionReasons: analysis.issues
                .filter(i => i.severity === "high-impact")
                .map(i => i.description)
                .slice(0, 3),
            roleFitAssessment: analysis.seniorityAnalysis.explanation,
        },
        skillGaps: {
            missingCoreSkills: analysis.alignment.gaps
                .filter(g => g.importance === "high")
                .map(g => g.expected),
            missingToolsAndTech: analysis.alignment.gaps
                .filter(g => g.importance === "medium")
                .map(g => g.expected),
        },
        responsibilityAnalysis: {
            unmatchedResponsibilities: analysis.roleReasoning.expectationsDiffer
                .map(e => e.expectation),
        },
        recommendations: {
            bulletFixes: analysis.suggestions.bulletRewrites,
            priorityFixList: analysis.roadmap.map(r => r.action),
        },
        structuralIssues: analysis.issues
            .filter(i => i.affectedScores.includes("atsReadability"))
            .map(i => i.description),
        contentIssues: analysis.issues
            .filter(i => !i.affectedScores.includes("atsReadability"))
            .map(i => i.description),
        // NEW: Include full universal analysis for enhanced frontend
        universalAnalysis: analysis,
    };
}
