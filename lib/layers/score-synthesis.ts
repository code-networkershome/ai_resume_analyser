// ===========================================
// LAYER 3: SCORE SYNTHESIS
// Compute multi-dimensional scores with confidence weighting
// ===========================================

import {
    MultiDimensionalScores,
    Score,
    StructuralContext,
} from "@/lib/types/universal-types";
import { AIInferenceResult } from "./ai-inference";

export interface ScoringInput {
    structural: StructuralContext;
    aiResult: AIInferenceResult;
    parsingConfidence: number;
    experienceLevel: string;
}

export function synthesizeScores(input: ScoringInput): MultiDimensionalScores {
    const { structural, aiResult, parsingConfidence, experienceLevel } = input;

    // 1. ATS Readability Score
    const atsReadability = computeATSReadability(structural, parsingConfidence);

    // 2. Role Alignment Score
    const roleAlignment = computeRoleAlignment(aiResult);

    // 3. Evidence Strength Score
    const evidenceStrength = computeEvidenceStrength(structural, aiResult);

    // 4. Clarity & Signaling Score
    const claritySignaling = computeClaritySignaling(structural, aiResult);

    // 5. Composite Score (weighted average)
    const composite = computeComposite(
        atsReadability,
        roleAlignment,
        evidenceStrength,
        claritySignaling,
        experienceLevel
    );

    return {
        atsReadability,
        roleAlignment,
        evidenceStrength,
        claritySignaling,
        composite,
    };
}

// ===========================================
// INDIVIDUAL SCORE COMPUTATIONS
// ===========================================

function computeATSReadability(
    structural: StructuralContext,
    parsingConfidence: number
): Score {
    let value = 50;
    const factors: string[] = [];

    // Section structure
    if (structural.sections.length >= 3) {
        value += 15;
        factors.push("Clear section structure detected");
    } else if (structural.sections.length >= 1) {
        value += 5;
        factors.push("Partial section structure");
    } else {
        factors.push("Section headers unclear");
    }

    // Contact info
    if (structural.contactInfo.email) {
        value += 10;
        factors.push("Email present");
    }
    if (structural.contactInfo.linkedin) {
        value += 5;
        factors.push("LinkedIn present");
    }
    if (structural.contactInfo.github) {
        value += 5;
        factors.push("GitHub present");
    }

    // Bullet quality
    const bulletRatio = structural.bullets.length / Math.max(structural.lineCount, 1);
    if (bulletRatio > 0.1 && bulletRatio < 0.5) {
        value += 10;
        factors.push("Good bullet density");
    }

    // Adjust by parsing confidence
    value = value * (parsingConfidence / 100);

    // Clamp
    value = Math.max(20, Math.min(95, value));

    return {
        value: Math.round(value),
        confidence: parsingConfidence,
        factors,
        interpretation: value >= 70
            ? "ATS-friendly structure detected"
            : value >= 50
                ? "Moderate ATS readability - some improvements possible"
                : "Structure may cause ATS parsing issues",
    };
}

function computeRoleAlignment(aiResult: AIInferenceResult): Score {
    const explicit = aiResult.alignment.explicit.length;
    const implicit = aiResult.alignment.implicit.length;
    const gaps = aiResult.alignment.gaps.length;
    const met = aiResult.roleReasoning.expectationsMet.length;
    const differ = aiResult.roleReasoning.expectationsDiffer.length;

    const factors: string[] = [];
    let value = 50;

    // Explicit skills boost
    if (explicit >= 5) {
        value += 20;
        factors.push(`${explicit} explicit skill alignments`);
    } else if (explicit >= 2) {
        value += 10;
        factors.push(`${explicit} explicit skill alignments`);
    }

    // Implicit skills boost
    if (implicit >= 3) {
        value += 15;
        factors.push(`${implicit} implicit skill demonstrations`);
    }

    // Gaps penalty
    const highGaps = aiResult.alignment.gaps.filter(g => g.importance === "high").length;
    if (highGaps > 0) {
        value -= highGaps * 8;
        factors.push(`${highGaps} high-importance gaps`);
    }

    // Expectations balance
    const expectationRatio = met / Math.max(met + differ, 1);
    value += (expectationRatio - 0.5) * 20;
    factors.push(`${Math.round(expectationRatio * 100)}% expectations met`);

    // Confidence weighting
    const avgConfidence = aiResult.rawConfidence;
    value = value * (avgConfidence / 100);

    value = Math.max(15, Math.min(95, value));

    return {
        value: Math.round(value),
        confidence: avgConfidence,
        factors,
        interpretation: value >= 70
            ? "Strong role alignment demonstrated"
            : value >= 50
                ? "Moderate alignment - some areas could be strengthened"
                : "Significant alignment gaps detected",
    };
}

function computeEvidenceStrength(
    structural: StructuralContext,
    aiResult: AIInferenceResult
): Score {
    const factors: string[] = [];
    let value = 40;

    // Metrics usage
    const metricsCount = structural.metrics.length;
    if (metricsCount >= 5) {
        value += 25;
        factors.push(`${metricsCount} quantified metrics found`);
    } else if (metricsCount >= 2) {
        value += 15;
        factors.push(`${metricsCount} metrics found`);
    } else {
        factors.push("Few quantified metrics");
    }

    // Action verbs
    const actionVerbRate = structural.bullets.filter(b => b.hasActionVerb).length /
        Math.max(structural.bullets.length, 1);
    if (actionVerbRate >= 0.7) {
        value += 15;
        factors.push(`${Math.round(actionVerbRate * 100)}% bullets have action verbs`);
    } else if (actionVerbRate >= 0.4) {
        value += 8;
        factors.push(`${Math.round(actionVerbRate * 100)}% bullets have action verbs`);
    }

    // Scope indicators from AI
    const scopeCount = aiResult.impactAnalysis.scopeIndicators.length;
    if (scopeCount >= 3) {
        value += 15;
        factors.push(`${scopeCount} scope/ownership indicators`);
    }

    // AI outcome clarity
    const outcomeValue = aiResult.impactAnalysis.outcomeClarity.value;
    value = (value + outcomeValue) / 2;

    value = Math.max(15, Math.min(95, value));

    return {
        value: Math.round(value),
        confidence: aiResult.rawConfidence,
        factors,
        interpretation: value >= 70
            ? "Strong evidence of impact and outcomes"
            : value >= 50
                ? "Some impact evidence - consider adding more specifics"
                : "Impact and outcomes under-communicated",
    };
}

function computeClaritySignaling(
    structural: StructuralContext,
    aiResult: AIInferenceResult
): Score {
    const factors: string[] = [];
    let value = 50;

    // Bullet count and quality
    if (structural.bullets.length >= 10) {
        value += 15;
        factors.push("Good bullet coverage");
    } else if (structural.bullets.length >= 5) {
        value += 8;
        factors.push("Moderate bullet coverage");
    }

    // Assertions confidence
    const highConfidenceAssertions = aiResult.assertions.filter(a => a.confidence >= 80).length;
    if (highConfidenceAssertions >= 3) {
        value += 15;
        factors.push(`${highConfidenceAssertions} high-confidence claims`);
    }

    // Issue severity distribution
    const highImpactIssues = aiResult.issues.filter(i => i.severity === "high-impact").length;
    if (highImpactIssues === 0) {
        value += 10;
        factors.push("No high-impact issues");
    } else {
        value -= highImpactIssues * 5;
        factors.push(`${highImpactIssues} high-impact issues`);
    }

    value = Math.max(15, Math.min(95, value));

    return {
        value: Math.round(value),
        confidence: aiResult.rawConfidence,
        factors,
        interpretation: value >= 70
            ? "Clear and effective signaling"
            : value >= 50
                ? "Signaling could be improved"
                : "Key signals unclear or missing",
    };
}

function computeComposite(
    ats: Score,
    role: Score,
    evidence: Score,
    clarity: Score,
    experienceLevel: string
): Score {
    // Weight based on experience level
    let weights = { ats: 0.2, role: 0.3, evidence: 0.3, clarity: 0.2 };

    if (experienceLevel === "Fresher") {
        weights = { ats: 0.25, role: 0.25, evidence: 0.25, clarity: 0.25 };
    } else if (experienceLevel === "6+ Years") {
        weights = { ats: 0.15, role: 0.35, evidence: 0.35, clarity: 0.15 };
    }

    const value =
        ats.value * weights.ats +
        role.value * weights.role +
        evidence.value * weights.evidence +
        clarity.value * weights.clarity;

    const confidence = (ats.confidence + role.confidence + evidence.confidence + clarity.confidence) / 4;

    const factors = [
        `ATS: ${ats.value}`,
        `Role Alignment: ${role.value}`,
        `Evidence: ${evidence.value}`,
        `Clarity: ${clarity.value}`,
    ];

    return {
        value: Math.round(value),
        confidence: Math.round(confidence),
        factors,
        interpretation: value >= 75
            ? "Competitive resume with strong fundamentals"
            : value >= 60
                ? "Solid foundation with room for improvement"
                : value >= 45
                    ? "Several areas need attention"
                    : "Significant improvements recommended",
    };
}
