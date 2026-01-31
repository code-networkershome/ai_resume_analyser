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
  KeywordAnalysisResult,
  SkillsGraphResult,
  CareerPathResult,
  LearningRoadmapResult,
  ToneAnalysisResult,
  HiddenSkillsResult,
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
  // NEW FEATURES
  keywordAnalysis?: KeywordAnalysisResult;
  skillsGraph?: SkillsGraphResult;
  careerPath?: CareerPathResult;
  learningRoadmap?: LearningRoadmapResult;
  toneAnalysis?: ToneAnalysisResult;
  hiddenSkills?: HiddenSkillsResult;
}

const isDev = process.env.NODE_ENV === "development";

export async function runAIInference(
  context: AnalysisContext,
  structural: StructuralContext
): Promise<AIInferenceResult> {
  const prompt = buildUniversalAnalysisPrompt(context, structural);

  try {
    if (isDev) console.log("[AI-Inference] Starting AI analysis...");
    const response = await getChatCompletion(prompt);
    if (isDev) console.log("[AI-Inference] Got response, parsing...");
    const result = parseAIResponse(response);
    if (isDev) console.log("[AI-Inference] Issues count:", result.issues.length);
    return result;
  } catch (error: any) {
    console.error("[AI Inference Error]:", error?.message || error);
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
    .slice(0, 10)
    .map((b, i) => `${i + 1}. ${b.text.substring(0, 120)}`)
    .join("\n");

  const truncatedResume = context.resumeText.substring(0, 3500);

  return `Analyze this resume for ${context.targetRole} (${context.experienceLevel}).

RESUME:
${truncatedResume}

KEY BULLETS:
${bulletsSummary}

IMPORTANT: For a FRESHER/Entry-level role, be fair in scoring - they won't have production experience.
Provide DETAILED 2-3 sentence explanations for every suggestion, not single-line answers.

Return ONLY valid JSON:
{
  "assertions": [{"claim":"string","evidence":"string","location":"string","confidence":70-95,"sourceType":"explicit|implicit"}],
  "alignment": {
    "explicit": [{"skill":"string","evidence":"2-3 sentence explanation","location":"string","confidence":70-95}],
    "implicit": [{"skill":"string","evidence":"2-3 sentence explanation","location":"string","confidence":70-85}],
    "gaps": [{"expected":"string","status":"missing|weak","importance":"high|medium|low","suggestion":"2-3 sentence actionable advice"}]
  },
  "roleReasoning": {
    "expectationsMet": [{"expectation":"string","assessment":"2-3 sentences","evidence":"specific examples","confidence":70-95}],
    "expectationsDiffer": [{"expectation":"string","assessment":"2-3 sentences","evidence":"what's missing","confidence":60-80}],
    "mismatchType": "none|depth|experience"
  },
  "impactAnalysis": {
    "outcomeClarity": {"value":40-80,"confidence":70,"factors":["string"],"interpretation":"2-3 sentences"},
    "scopeIndicators": [{"indicator":"string","evidence":"string","significance":"high|medium|low"}],
    "metricsUsage": {"count":number,"quality":"strong|moderate|weak","examples":["string"]}
  },
  "seniorityAnalysis": {
    "inferredLevel": "Fresher|Entry-level|Junior|Mid-level",
    "signals": ["string"],
    "mismatchWithSelected": false,
    "explanation": "2-3 sentence explanation"
  },
  "bulletRewrites": [{"original":"string","improved":"significantly improved version with metrics","reason":"2-3 sentence explanation of why this is better","location":"string"}],
  "issues": [{"id":"issue-1","description":"string","severity":"critical|high-impact|improvement|minor","affectedScores":["string"],"confidence":70-90,"context":"2-3 sentence explanation with actionable advice"}],
  "careerPath": {
    "currentLevel": "Entry-level/Fresher",
    "currentLevelExplanation": "2-3 sentence explanation based on resume signals",
    "projectedRoles": [{"role":"string","readiness":60-90,"timeframe":"string","requirements":["string"],"explanation":"2-3 sentences"}],
    "alternativePaths": [{"path":"string","reason":"why this path suits their skills"}],
    "summary": "2-3 sentence career advice"
  },
  "toneAnalysis": {
    "overallTone": "confident|neutral|passive",
    "score": 50-85,
    "dimensions": {
      "confidence": {"score":40-80,"examples":["phrases"],"explanation":"2-3 sentences"},
      "actionOrientation": {"score":40-80,"examples":["phrases"],"explanation":"2-3 sentences"}
    },
    "weakPhrases": [{"phrase":"string","issue":"string","suggestion":"improved version"}],
    "overallExplanation": "2-3 sentence tone analysis"
  },
  "hiddenSkills": {
    "skills": [{"skill":"string","inferredFrom":"specific evidence","confidence":65-85,"category":"technical|soft","explanation":"2-3 sentences on why this skill is valuable"}],
    "summary": "2-3 sentence summary"
  },
  "keywordAnalysis": {
    "topKeywords": [{"word":"string","totalCount":number,"sections":["string"],"explanation":"2-3 sentences on relevance"}],
    "roleRelevanceScore": 60-85,
    "explanation": "2-3 sentence keyword strategy advice"
  },
  "rawConfidence": 75
}

SCORING GUIDE FOR FRESHERS:
- Role Alignment: 50-70% is normal for freshers (they lack industry experience)
- Impact Evidence: 40-60% is expected (academic projects have less metrics)
- Be encouraging but honest about areas to improve`;
}


// ===========================================
// PARSE AI RESPONSE
// ===========================================

function parseAIResponse(response: any): AIInferenceResult {
  // Dev-only debug logging
  if (isDev) {
    console.log("[AI-Parse] Response structure:", Object.keys(response || {}));
  }

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
    // NEW FEATURES - Pass through AI response (already structured)
    keywordAnalysis: response.keywordAnalysis || undefined,
    skillsGraph: response.skillsGraph || undefined,
    careerPath: response.careerPath || undefined,
    learningRoadmap: response.learningRoadmap || undefined,
    toneAnalysis: response.toneAnalysis || undefined,
    hiddenSkills: response.hiddenSkills || undefined,
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
