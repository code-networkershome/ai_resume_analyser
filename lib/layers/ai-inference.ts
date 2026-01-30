// ===========================================
// LAYER 2: AI INFERENCE ENGINE
// LLM-powered analysis - adaptive, no hardcoding
// ===========================================

import { getChatCompletion } from "@/lib/openai";
import {
    AnalysisContext,
    StructuralContext,
    Assertion,
    AlignmentResult,
    RoleReasoningResult,
    ImpactAnalysisResult,
    SeniorityAnalysisResult,
    BulletRewrite,
    Issue,
} from "@/lib/types/universal-types";

export interface AIInferenceResult {
    assertions: Assertion[];
    alignment: AlignmentResult;
    roleReasoning: RoleReasoningResult;
    impactAnalysis: ImpactAnalysisResult;
    seniorityAnalysis: SeniorityAnalysisResult;
    bulletRewrites: BulletRewrite[];
    issues: Issue[];
    rawConfidence: number;
}

export async function runAIInference(
    context: AnalysisContext,
    structural: StructuralContext
): Promise<AIInferenceResult> {
    const prompt = buildUniversalAnalysisPrompt(context, structural);

    try {
        const response = await getChatCompletion(prompt);
        return parseAIResponse(response);
    } catch (error) {
        console.error("AI Inference Error:", error);
        return getDefaultInferenceResult();
    }
}

// ===========================================
// UNIVERSAL ANALYSIS PROMPT
// ===========================================

function buildUniversalAnalysisPrompt(
    context: AnalysisContext,
    structural: StructuralContext
): string {
    const bulletsSummary = structural.bullets
        .slice(0, 15)
        .map((b, i) => `${i + 1}. ${b.text}`)
        .join("\n");

    const sectionsSummary = structural.sections
        .map(s => s.name)
        .join(", ");

    const jdBlock = context.jobDescription
        ? `\nJOB DESCRIPTION PROVIDED:\n"""\n${context.jobDescription}\n"""\n`
        : "";

    return `You are a senior hiring intelligence system analyzing a resume.

CONTEXT:
- Target Role: ${context.targetRole}
- Experience Level: ${context.experienceLevel}
- Detected Sections: ${sectionsSummary || "Unable to detect clear sections"}
- Total Bullets Found: ${structural.bullets.length}
- Bullets with Action Verbs: ${structural.bullets.filter(b => b.hasActionVerb).length}
- Bullets with Metrics: ${structural.bullets.filter(b => b.hasMetric).length}
${jdBlock}

RESUME TEXT:
"""
${context.resumeText}
"""

KEY BULLETS EXTRACTED:
${bulletsSummary}

YOUR TASK:
Perform a comprehensive, evidence-based analysis. You must:
1. Extract skills (explicit AND implicit)
2. Assess role alignment without using hardcoded keyword lists
3. Evaluate impact and evidence strength
4. Infer seniority level from language/responsibilities
5. Identify issues with calibrated severity
6. Suggest bullet rewrites

CRITICAL RULES:
- Every claim needs evidence from the resume
- Severity depends on context, not fixed rules
- No generic advice - be specific
- Confidence-aware: if uncertain, say so
- Adapt to ANY role/industry - do not assume tech-only

OUTPUT FORMAT (valid JSON only):
{
  "assertions": [
    {
      "claim": "Candidate has ML experience",
      "evidence": "Built ML pipeline using PyTorch in Project X",
      "location": "Projects section",
      "confidence": 85,
      "sourceType": "explicit"
    }
  ],
  "alignment": {
    "explicit": [
      {
        "skill": "Python",
        "evidence": "Listed in Skills section",
        "location": "Skills",
        "confidence": 95
      }
    ],
    "implicit": [
      {
        "skill": "Data Analysis",
        "evidence": "Performed EDA in multiple projects",
        "location": "Experience",
        "confidence": 80
      }
    ],
    "gaps": [
      {
        "expected": "Production ML deployment experience",
        "status": "weak",
        "importance": "medium",
        "suggestion": "Add details about model deployment or serving infrastructure"
      }
    ]
  },
  "roleReasoning": {
    "expectationsMet": [
      {
        "expectation": "ML framework proficiency",
        "assessment": "Demonstrates PyTorch and TensorFlow experience",
        "evidence": "Listed in Skills, used in Projects",
        "confidence": 90
      }
    ],
    "expectationsDiffer": [
      {
        "expectation": "Production-scale deployment",
        "assessment": "Projects are academic/personal scale",
        "evidence": "No production metrics or scale indicators",
        "confidence": 70
      }
    ],
    "mismatchType": "depth"
  },
  "impactAnalysis": {
    "outcomeClarity": {
      "value": 65,
      "confidence": 80,
      "factors": ["Some metrics present", "Outcomes unclear in 40% of bullets"],
      "interpretation": "Moderate outcome clarity - consider quantifying more achievements"
    },
    "scopeIndicators": [
      {
        "indicator": "Competition ranking",
        "evidence": "Top 3% in Amazon ML Challenge",
        "significance": "high"
      }
    ],
    "metricsUsage": {
      "count": 4,
      "quality": "moderate",
      "examples": ["Top 3%", "SMAPE 45.29%", "CGPA 8.84"]
    }
  },
  "seniorityAnalysis": {
    "inferredLevel": "Entry-level/Fresher",
    "signals": ["Academic projects", "No full-time work", "Internship experience"],
    "mismatchWithSelected": false,
    "explanation": "Resume signals align with Fresher level - appropriate coursework and internship depth"
  },
  "bulletRewrites": [
    {
      "original": "Currently building an AI-powered SEO automation tool",
      "improved": "Leading development of an AI-powered SEO automation tool, leveraging OpenAI APIs and Supabase to optimize content visibility for 10+ client websites",
      "reason": "Added specificity, metrics, and impact",
      "location": "Experience - AI Intern"
    }
  ],
  "issues": [
    {
      "id": "issue-1",
      "description": "Summary/objective section missing",
      "severity": "improvement",
      "affectedScores": ["claritySignaling"],
      "confidence": 90,
      "context": "For entry-level candidates, a clear objective helps recruiters understand career direction"
    }
  ],
  "rawConfidence": 82
}`;
}

// ===========================================
// PARSE AI RESPONSE
// ===========================================

function parseAIResponse(response: any): AIInferenceResult {
    return {
        assertions: Array.isArray(response.assertions)
            ? response.assertions.map(normalizeAssertion)
            : [],
        alignment: normalizeAlignment(response.alignment),
        roleReasoning: normalizeRoleReasoning(response.roleReasoning),
        impactAnalysis: normalizeImpactAnalysis(response.impactAnalysis),
        seniorityAnalysis: normalizeSeniorityAnalysis(response.seniorityAnalysis),
        bulletRewrites: Array.isArray(response.bulletRewrites)
            ? response.bulletRewrites.map(normalizeBulletRewrite)
            : [],
        issues: Array.isArray(response.issues)
            ? response.issues.map(normalizeIssue)
            : [],
        rawConfidence: typeof response.rawConfidence === "number"
            ? response.rawConfidence
            : 70,
    };
}

function normalizeAssertion(a: any): Assertion {
    return {
        claim: String(a.claim || ""),
        evidence: String(a.evidence || ""),
        location: String(a.location || "Unknown"),
        confidence: Number(a.confidence) || 70,
        sourceType: a.sourceType === "implicit" ? "implicit" : "explicit",
    };
}

function normalizeAlignment(a: any): AlignmentResult {
    return {
        explicit: Array.isArray(a?.explicit) ? a.explicit : [],
        implicit: Array.isArray(a?.implicit) ? a.implicit : [],
        gaps: Array.isArray(a?.gaps) ? a.gaps : [],
    };
}

function normalizeRoleReasoning(r: any): RoleReasoningResult {
    return {
        expectationsMet: Array.isArray(r?.expectationsMet) ? r.expectationsMet : [],
        expectationsDiffer: Array.isArray(r?.expectationsDiffer) ? r.expectationsDiffer : [],
        mismatchType: r?.mismatchType || null,
    };
}

function normalizeImpactAnalysis(i: any): ImpactAnalysisResult {
    return {
        outcomeClarity: i?.outcomeClarity || { value: 50, confidence: 50, factors: [], interpretation: "" },
        scopeIndicators: Array.isArray(i?.scopeIndicators) ? i.scopeIndicators : [],
        metricsUsage: i?.metricsUsage || { count: 0, quality: "none", examples: [] },
    };
}

function normalizeSeniorityAnalysis(s: any): SeniorityAnalysisResult {
    return {
        inferredLevel: String(s?.inferredLevel || "Unknown"),
        signals: Array.isArray(s?.signals) ? s.signals : [],
        mismatchWithSelected: Boolean(s?.mismatchWithSelected),
        explanation: String(s?.explanation || ""),
    };
}

function normalizeBulletRewrite(b: any): BulletRewrite {
    return {
        original: String(b.original || ""),
        improved: String(b.improved || ""),
        reason: String(b.reason || ""),
        location: String(b.location || ""),
    };
}

function normalizeIssue(i: any): Issue {
    return {
        id: String(i.id || `issue-${Date.now()}`),
        description: String(i.description || ""),
        severity: ["info", "improvement", "high-impact"].includes(i.severity) ? i.severity : "improvement",
        affectedScores: Array.isArray(i.affectedScores) ? i.affectedScores : [],
        confidence: Number(i.confidence) || 70,
        context: String(i.context || ""),
    };
}

function getDefaultInferenceResult(): AIInferenceResult {
    return {
        assertions: [],
        alignment: { explicit: [], implicit: [], gaps: [] },
        roleReasoning: { expectationsMet: [], expectationsDiffer: [], mismatchType: null },
        impactAnalysis: {
            outcomeClarity: { value: 50, confidence: 30, factors: ["AI analysis unavailable"], interpretation: "Unable to analyze" },
            scopeIndicators: [],
            metricsUsage: { count: 0, quality: "none", examples: [] },
        },
        seniorityAnalysis: {
            inferredLevel: "Unknown",
            signals: [],
            mismatchWithSelected: false,
            explanation: "AI analysis unavailable",
        },
        bulletRewrites: [],
        issues: [{
            id: "ai-error",
            description: "AI analysis encountered an error",
            severity: "info",
            affectedScores: [],
            confidence: 100,
            context: "Please try again or check your API configuration",
        }],
        rawConfidence: 30,
    };
}
