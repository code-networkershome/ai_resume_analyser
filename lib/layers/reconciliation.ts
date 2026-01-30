// ===========================================
// LAYER 4: CONTRADICTION RECONCILIATION
// Ensure logical consistency before output
// ===========================================

import {
    MultiDimensionalScores,
    Issue,
    VerdictResult,
    FixAction,
} from "@/lib/types/universal-types";
import { AIInferenceResult } from "./ai-inference";

export interface ReconciliationInput {
    scores: MultiDimensionalScores;
    aiResult: AIInferenceResult;
    parsingConfidence: number;
}

export interface ReconciliationOutput {
    scores: MultiDimensionalScores;
    issues: Issue[];
    verdict: VerdictResult;
    roadmap: FixAction[];
}

export function reconcileAndGenerateVerdict(input: ReconciliationInput): ReconciliationOutput {
    const { scores, aiResult, parsingConfidence } = input;

    // Step 1: Reconcile contradictions
    const reconciledScores = reconcileScores(scores, aiResult);
    const reconciledIssues = reconcileIssues(aiResult.issues, reconciledScores);

    // Step 2: Generate verdict
    const verdict = generateVerdict(reconciledScores, reconciledIssues, parsingConfidence);

    // Step 3: Generate prioritized roadmap
    const roadmap = generateRoadmap(reconciledIssues, aiResult, reconciledScores);

    return {
        scores: reconciledScores,
        issues: reconciledIssues,
        verdict,
        roadmap,
    };
}

// ===========================================
// RECONCILIATION LOGIC
// ===========================================

function reconcileScores(
    scores: MultiDimensionalScores,
    aiResult: AIInferenceResult
): MultiDimensionalScores {
    // Ensure no score contradicts high-impact issues
    const highImpactCount = aiResult.issues.filter(i => i.severity === "high-impact").length;

    if (highImpactCount >= 3 && scores.composite.value > 70) {
        // Reduce composite if many high-impact issues
        return {
            ...scores,
            composite: {
                ...scores.composite,
                value: Math.min(scores.composite.value, 65),
                factors: [...scores.composite.factors, "Adjusted for high-impact issues"],
            },
        };
    }

    // Ensure good alignment doesn't contradict low evidence
    if (scores.roleAlignment.value > 80 && scores.evidenceStrength.value < 40) {
        return {
            ...scores,
            roleAlignment: {
                ...scores.roleAlignment,
                value: Math.min(scores.roleAlignment.value, scores.evidenceStrength.value + 25),
                interpretation: "Alignment strong but evidence could be stronger",
            },
        };
    }

    return scores;
}

function reconcileIssues(
    issues: Issue[],
    scores: MultiDimensionalScores
): Issue[] {
    return issues.map(issue => {
        // Don't mark as high-impact if overall score is good
        if (issue.severity === "high-impact" && scores.composite.value > 75) {
            return {
                ...issue,
                severity: "improvement" as const,
                context: issue.context + " (adjusted given overall strength)",
            };
        }

        // Don't mark as info if score is low
        if (issue.severity === "info" && scores.composite.value < 45) {
            return {
                ...issue,
                severity: "improvement" as const,
            };
        }

        return issue;
    });
}

// ===========================================
// VERDICT GENERATION
// ===========================================

function generateVerdict(
    scores: MultiDimensionalScores,
    issues: Issue[],
    parsingConfidence: number
): VerdictResult {
    const composite = scores.composite.value;
    const highImpact = issues.filter(i => i.severity === "high-impact").length;
    const improvements = issues.filter(i => i.severity === "improvement").length;

    // Determine tone
    let tone: VerdictResult["tone"] = "neutral";
    if (composite >= 70 && highImpact === 0) {
        tone = "encouraging";
    } else if (composite < 45 || highImpact >= 3) {
        tone = "constructive";
    }

    // Build context factors
    const contextFactors: string[] = [];
    if (scores.roleAlignment.value >= 70) contextFactors.push("strong-role-fit");
    if (scores.evidenceStrength.value >= 70) contextFactors.push("well-evidenced");
    if (scores.atsReadability.value < 50) contextFactors.push("ats-concerns");
    if (highImpact > 0) contextFactors.push("has-blockers");
    if (parsingConfidence < 70) contextFactors.push("parsing-uncertainty");

    // Generate dynamic summary
    const summary = generateDynamicSummary(scores, issues, tone);

    return {
        summary,
        competitivenessLevel: composite,
        tone,
        contextFactors,
    };
}

function generateDynamicSummary(
    scores: MultiDimensionalScores,
    issues: Issue[],
    tone: VerdictResult["tone"]
): string {
    const composite = scores.composite.value;
    const highImpact = issues.filter(i => i.severity === "high-impact").length;

    // Strong resumes
    if (composite >= 75 && highImpact === 0) {
        if (scores.evidenceStrength.value >= 75) {
            return "Competitive resume with strong evidence and clear impact demonstration";
        }
        return "Strong foundation with solid role alignment";
    }

    // Good resumes with gaps
    if (composite >= 60) {
        const weakest = findWeakestScore(scores);
        return `Solid resume with opportunity to strengthen ${weakest.toLowerCase()}`;
    }

    // Moderate resumes
    if (composite >= 45) {
        if (scores.roleAlignment.value < 50) {
            return "Foundation present but role alignment needs strengthening";
        }
        if (scores.evidenceStrength.value < 50) {
            return "Good structure but impact evidence under-communicated";
        }
        return "Moderate competitiveness with several improvement opportunities";
    }

    // Needs work
    return "Significant gaps identified - focused improvements recommended";
}

function findWeakestScore(scores: MultiDimensionalScores): string {
    const scoreMap = {
        "ATS Readability": scores.atsReadability.value,
        "Role Alignment": scores.roleAlignment.value,
        "Evidence Strength": scores.evidenceStrength.value,
        "Clarity & Signaling": scores.claritySignaling.value,
    };

    let weakest = "Evidence Strength";
    let lowestValue = 100;

    for (const [name, value] of Object.entries(scoreMap)) {
        if (value < lowestValue) {
            lowestValue = value;
            weakest = name;
        }
    }

    return weakest;
}

// ===========================================
// ROADMAP GENERATION
// ===========================================

function generateRoadmap(
    issues: Issue[],
    aiResult: AIInferenceResult,
    scores: MultiDimensionalScores
): FixAction[] {
    const roadmap: FixAction[] = [];
    let priority = 1;

    // High-impact issues first
    for (const issue of issues.filter(i => i.severity === "high-impact")) {
        roadmap.push({
            priority: priority++,
            action: issue.description,
            expectedGain: "High impact on recruiter perception",
            affectedScores: issue.affectedScores,
            evidence: issue.context,
        });
    }

    // Add bullet rewrites
    for (const rewrite of aiResult.bulletRewrites.slice(0, 3)) {
        roadmap.push({
            priority: priority++,
            action: `Improve bullet: "${rewrite.original.substring(0, 50)}..."`,
            expectedGain: rewrite.reason,
            affectedScores: ["evidenceStrength", "claritySignaling"],
            evidence: rewrite.location,
        });
    }

    // Add from alignment gaps
    for (const gap of aiResult.alignment.gaps.filter(g => g.importance === "high").slice(0, 2)) {
        roadmap.push({
            priority: priority++,
            action: gap.suggestion,
            expectedGain: `Address gap: ${gap.expected}`,
            affectedScores: ["roleAlignment"],
            evidence: `Currently: ${gap.status}`,
        });
    }

    // Improvement issues
    for (const issue of issues.filter(i => i.severity === "improvement").slice(0, 3)) {
        if (priority <= 7) {
            roadmap.push({
                priority: priority++,
                action: issue.description,
                expectedGain: "Moderate improvement",
                affectedScores: issue.affectedScores,
                evidence: issue.context,
            });
        }
    }

    return roadmap.slice(0, 7);
}
