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
    enhancvChecks?: EnhancvStyleChecks;
    // NEW FEATURES
    keywordAnalysis?: KeywordAnalysisResult;
    skillsGraph?: SkillsGraphResult;
    careerPath?: CareerPathResult;
    learningRoadmap?: LearningRoadmapResult;
    toneAnalysis?: ToneAnalysisResult;
    hiddenSkills?: HiddenSkillsResult;
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

// ===========================================
// ENHANCV-STYLE CHECKS
// ===========================================

export interface EnhancvStyleChecks {
    atsParseRate: {
        percentage: number;
        status: "success" | "warning" | "error";
        message: string;
    };
    quantifyImpact: {
        bulletsWithMetrics: number;
        bulletsWithoutMetrics: number;
        totalBullets: number;
        weakBullets: string[];
        status: "success" | "warning" | "error";
    };
    repetition: {
        repeatedWords: { word: string; count: number }[];
        status: "success" | "warning";
        message: string;
    };
    essentialSections: {
        found: string[];
        missing: string[];
        status: "success" | "warning" | "error";
    };
    contactInfo: {
        found: { type: string; value: string }[];
        missing: string[];
        status: "success" | "warning";
    };
    fileInfo: {
        format: string;
        sizeKB: number;
        status: "success" | "warning";
    };
    emailCheck: {
        email: string | null;
        isProfessional: boolean;
        status: "success" | "warning";
        message: string;
    };
    headerLinks: {
        fullUrlsFound: string[];
        hasFullUrls: boolean;
        status: "success" | "warning";
        message: string;
    };
}

// ===========================================
// NEW FEATURE #5: KEYWORD DENSITY HEATMAP
// ===========================================
export interface KeywordAnalysisResult {
    sections: {
        name: string;
        keywords: { word: string; count: number; relevance: "high" | "medium" | "low" }[];
    }[];
    topKeywords: { word: string; totalCount: number; sections: string[]; explanation: string }[];
    roleRelevanceScore: number;
    explanation: string;
}

// ===========================================
// NEW FEATURE #6: SKILLS GRAPH NETWORK
// ===========================================
export interface SkillsGraphResult {
    nodes: {
        id: string;
        skill: string;
        category: "technical" | "soft" | "domain" | "tool";
        proficiency: "expert" | "proficient" | "familiar";
        explanation: string;
    }[];
    edges: { source: string; target: string; relationship: string }[];
    clusters: { name: string; skills: string[]; description: string }[];
    transferableSkills: { skill: string; targetRoles: string[]; explanation: string }[];
    summary: string;
}

// ===========================================
// NEW FEATURE #8: CAREER PATH PROJECTION
// ===========================================
export interface CareerPathResult {
    currentLevel: string;
    currentLevelExplanation: string;
    projectedRoles: {
        role: string;
        readiness: number;
        timeframe: string;
        requirements: string[];
        explanation: string;
    }[];
    alternativePaths: { path: string; reason: string }[];
    summary: string;
}

// ===========================================
// NEW FEATURE #9: SKILLS GAP ROADMAP
// ===========================================
export interface LearningRoadmapResult {
    gaps: {
        skill: string;
        priority: "critical" | "important" | "nice-to-have";
        currentLevel: string;
        targetLevel: string;
        courses: { name: string; platform: string; url: string; duration: string }[];
        explanation: string;
    }[];
    estimatedTime: string;
    milestones: { milestone: string; skills: string[]; timeframe: string }[];
    summary: string;
}

// ===========================================
// NEW FEATURE #12: TONE & VOICE ANALYSIS
// ===========================================
export interface ToneAnalysisResult {
    overallTone: "confident" | "neutral" | "passive" | "aggressive";
    score: number;
    dimensions: {
        confidence: { score: number; examples: string[]; explanation: string };
        clarity: { score: number; examples: string[]; explanation: string };
        professionalism: { score: number; examples: string[]; explanation: string };
        actionOrientation: { score: number; examples: string[]; explanation: string };
    };
    weakPhrases: { phrase: string; issue: string; suggestion: string }[];
    overallExplanation: string;
}

// ===========================================
// NEW FEATURE #15: HIDDEN SKILLS DETECTION
// ===========================================
export interface HiddenSkillsResult {
    skills: {
        skill: string;
        inferredFrom: string;
        confidence: number;
        category: string;
        explanation: string;
    }[];
    summary: string;
}

