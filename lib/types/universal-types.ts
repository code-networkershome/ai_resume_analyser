// ===========================================
// UNIVERSAL RESUME INTELLIGENCE - TYPE DEFINITIONS
// ===========================================

export interface UniversalResumeAnalysis {
    verdict: VerdictResult;
    scores: MultiDimensionalScores;
    parsing: ParsingTransparency;
    assertions: Assertion[];
    alignment: AlignmentResult;
    roleReasoning: RoleReasoningResult;
    impactAnalysis: ImpactAnalysisResult;
    issues: Issue[];
    roadmap: FixAction[];
    jdAlignment?: JDAlignmentResult;
    seniorityAnalysis: SeniorityAnalysisResult;
    suggestions: SuggestionsResult;
}

// 1. Executive Verdict
export interface VerdictResult {
    summary: string;
    competitivenessLevel: number;
    tone: "encouraging" | "neutral" | "constructive";
    contextFactors: string[];
}

// 2. Multi-Dimensional Scores
export interface Score {
    value: number;
    confidence: number;
    factors: string[];
    interpretation: string;
}

export interface MultiDimensionalScores {
    atsReadability: Score;
    roleAlignment: Score;
    evidenceStrength: Score;
    claritySignaling: Score;
    composite: Score;
}

// 3. Parsing Transparency
export interface Ambiguity {
    type: string;
    description: string;
    location: string;
    severity: "low" | "medium" | "high";
}

export interface ParsingTransparency {
    overallConfidence: number;
    structuralAmbiguities: Ambiguity[];
    layoutType: "standard" | "multi-column" | "design-heavy" | "unknown";
    languageDetected: string;
    warnings: string[];
}

// 4. Evidence-Backed Assertions
export interface Assertion {
    claim: string;
    evidence: string;
    location: string;
    confidence: number;
    sourceType: "explicit" | "implicit";
}

// 5. Skill & Role Alignment
export interface AlignmentItem {
    skill: string;
    evidence: string;
    location: string;
    confidence: number;
}

export interface AlignmentGap {
    expected: string;
    status: "missing" | "weak" | "unclear";
    importance: "high" | "medium" | "low";
    suggestion: string;
}

export interface AlignmentResult {
    explicit: AlignmentItem[];
    implicit: AlignmentItem[];
    gaps: AlignmentGap[];
}

// 6. Resume-to-Role Reasoning
export interface ReasoningItem {
    expectation: string;
    assessment: string;
    evidence: string;
    confidence: number;
}

export interface RoleReasoningResult {
    expectationsMet: ReasoningItem[];
    expectationsDiffer: ReasoningItem[];
    mismatchType: "scope" | "depth" | "signaling" | null;
}

// 7. Impact Analysis
export interface ScopeItem {
    indicator: string;
    evidence: string;
    significance: "high" | "medium" | "low";
}

export interface MetricsUsage {
    count: number;
    quality: "strong" | "moderate" | "weak" | "none";
    examples: string[];
}

export interface ImpactAnalysisResult {
    outcomeClarity: Score;
    scopeIndicators: ScopeItem[];
    metricsUsage: MetricsUsage;
}

// 8. Severity-Calibrated Issues
export interface Issue {
    id: string;
    description: string;
    severity: "info" | "improvement" | "high-impact";
    affectedScores: string[];
    confidence: number;
    context: string;
}

// 9. Fix Priority Roadmap
export interface FixAction {
    priority: number;
    action: string;
    expectedGain: string;
    affectedScores: string[];
    evidence: string;
}

// 10. JD Alignment
export interface JDRequirement {
    requirement: string;
    matchType: "explicit" | "implicit" | "missing";
    evidence: string;
    confidence: number;
}

export interface JDAlignmentResult {
    requirements: JDRequirement[];
    coverageScore: number;
    unmatchedRequirements: string[];
}

// 11. Seniority Analysis
export interface SeniorityAnalysisResult {
    inferredLevel: string;
    signals: string[];
    mismatchWithSelected: boolean;
    explanation: string;
}

// 12. AI-Assisted Suggestions
export interface BulletRewrite {
    original: string;
    improved: string;
    reason: string;
    location: string;
}

export interface SuggestionsResult {
    bulletRewrites: BulletRewrite[];
    summaryDraft?: string;
    generalAdvice: string[];
}

// Input Context
export interface AnalysisContext {
    resumeText: string;
    targetRole: string;
    experienceLevel: string;
    jobTitle?: string;
    jobDescription?: string;
}

// Structural Analysis Output
export interface StructuralContext {
    sections: DetectedSection[];
    bullets: ExtractedBullet[];
    contactInfo: ContactInfo;
    metrics: DetectedMetric[];
    wordCount: number;
    lineCount: number;
}

export interface DetectedSection {
    name: string;
    startLine: number;
    endLine: number;
    confidence: number;
}

export interface ExtractedBullet {
    text: string;
    section: string;
    hasActionVerb: boolean;
    hasMetric: boolean;
    length: number;
}

export interface ContactInfo {
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
    location?: string;
}

export interface DetectedMetric {
    text: string;
    type: "percentage" | "number" | "currency" | "ranking" | "score" | "other";
    location: string;
}
