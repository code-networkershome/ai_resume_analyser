/**
 * ===========================================
 * DOCUMENT MODEL - Core Types for Structured Resume Parsing
 * ===========================================
 * 
 * This is the CANONICAL data model. ALL backend analysis operates on 
 * DocumentModel, NEVER raw text.
 * 
 * CRITICAL RULES:
 * 1. rawText is DEBUG ONLY - any logic touching it outside debugging is a BUG
 * 2. Every detection MUST have confidence and evidence
 * 3. Confidence values are MONOTONIC by source quality
 * 4. No warning is allowed without evidence
 * 5. No extreme scores (0 or 100) - always calibrate to [35, 92] range
 * 6. Deterministic-first - AI only for explanations, not scoring
 */

// ===========================================
// CONFIDENCE ORDERING (MONOTONIC - DO NOT VIOLATE)
// ===========================================
// Source                              | Confidence Range
// ------------------------------------|------------------
// PDF annotations / DOCX relationships| 0.90 - 0.99
// Explicit URL text                   | 0.80 - 0.89
// Label-only text                     | 0.40 - 0.60
// Heuristic inference                 | 0.20 - 0.40

export const CONFIDENCE_THRESHOLD = 0.6;

// Score calibration constants
export const SCORE_RANGE = { min: 35, max: 92 } as const;
export const CALIBRATION_FORMULA = (raw: number) => {
    // Map [0, 100] to [35, 92] with confidence adjustment
    const calibrated = (raw * 0.57) + 35; // 0->35, 100->92
    return Math.round(Math.max(SCORE_RANGE.min, Math.min(SCORE_RANGE.max, calibrated)));
};

export const CONFIDENCE_LEVELS = {
    PDF_ANNOTATION: { min: 0.90, max: 0.99 },
    EXPLICIT_URL: { min: 0.80, max: 0.89 },
    LABEL_ONLY: { min: 0.40, max: 0.60 },
    HEURISTIC: { min: 0.20, max: 0.40 },
} as const;

// ===========================================
// PRIMITIVE TYPES
// ===========================================

export interface TextItem {
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize: number;
    fontName: string;
    page: number;
}

export type LinkType = "linkedin" | "github" | "portfolio" | "email" | "phone" | "other";
export type LinkStatus = "valid" | "label_only" | "missing";

export interface Link {
    type: LinkType;
    url: string | null;
    visibleText: string;
    page: number;
    confidence: number;
    status: LinkStatus;
    source: "pdf_annotation" | "docx_relationship" | "text_pattern" | "label_only" | "heuristic";
}

export interface Email {
    address: string;
    page: number;
    confidence: number;
    source: "pdf_annotation" | "text_pattern";
}

export interface Phone {
    number: string;
    normalized: string; // E.164 format if possible
    page: number;
    confidence: number;
    source: "pdf_annotation" | "text_pattern";
}

// ===========================================
// BULLET POINTS
// ===========================================

export interface Bullet {
    /** The cleaned text content of the bullet */
    text: string;
    /** The original raw text before cleaning */
    rawText: string;
    /** Page number where the bullet was found */
    page: number;
    /** Section this bullet belongs to */
    sectionName: string;
    /** Confidence that this is actually a bullet point */
    confidence: number;
    /** Whether bullet starts with an action verb */
    startsWithActionVerb: boolean;
    /** The detected action verb, if any */
    actionVerb: string | null;
    /** The lemma form of the action verb for matching */
    actionVerbLemma: string | null;
    /** Whether the bullet contains quantifiable metrics */
    hasMetric: boolean;
    /** Extracted metric values (e.g., "40%", "$1M", "5 engineers") */
    metricValues: string[];
    /** Character length of the bullet */
    length: number;
}

// ===========================================
// SECTIONS
// ===========================================

export type SectionType =
    | "experience"
    | "education"
    | "skills"
    | "projects"
    | "summary"
    | "certifications"
    | "achievements"
    | "coursework"
    | "contact"
    | "other";

export interface Section {
    /** Display name of the section (as found in resume) */
    name: string;
    /** Normalized section type for analysis */
    type: SectionType;
    /** Starting page */
    startPage: number;
    /** Ending page */
    endPage: number;
    /** Bullet points in this section */
    bullets: Bullet[];
    /** Raw content of the section (for fallback analysis only) */
    rawContent: string;
    /** Confidence that this section was correctly identified */
    confidence: number;
    /** Start Y position on page (for ordering) */
    startY: number;
}

// ===========================================
// SKILLS
// ===========================================

export type SkillCategory = "technical" | "soft" | "tool" | "language" | "framework" | "platform" | "other";

export interface Skill {
    /** Original skill name as found */
    name: string;
    /** Normalized/lowercase version for matching */
    normalizedName: string;
    /** Category of the skill */
    category: SkillCategory;
    /** Which section the skill was found in */
    sourceSection: string;
    /** Confidence of extraction */
    confidence: number;
}

// ===========================================
// DOCUMENT METADATA
// ===========================================

export interface DocumentMetadata {
    /** Source file type */
    sourceType: "pdf" | "docx";
    /** Original file name */
    fileName: string;
    /** Number of pages */
    pageCount: number;
    /** Total word count */
    wordCount: number;
    /** 
     * Layout confidence score.
     * - PDF with clear structure: 0.85-0.99
     * - DOCX text fallback: 0.6 (lowered per mandatory correction)
     */
    layoutConfidence: number;
    /** 
     * Multi-column layout detected.
     * Detected from text item positions, NOT from spacing.
     */
    multiColumnDetected: boolean;
    /** 
     * Tables detected.
     * ONLY from PDF grid alignment or DOCX table objects.
     * NEVER from pipes, spacing, or separators.
     */
    tablesDetected: boolean;
    /** Icons or images that may cause parsing issues */
    iconsOrImagesDetected: boolean;
    /** Header/footer content that ATS may ignore */
    headerFooterRisk: boolean;
    /** 
     * Detected language of the resume.
     * If not "en", lower global confidence and suppress keyword penalties.
     */
    detectedLanguage: string;
    /** ISO timestamp of parsing */
    parseTimestamp: string;
}

// ===========================================
// EVIDENCE & DETECTION
// ===========================================

/**
 * Evidence attached to every detection/warning.
 * NO warning is allowed without evidence.
 */
export interface Evidence {
    /** The text that was matched/found */
    text: string;
    /** Page number */
    page: number;
    /** Confidence of this specific evidence */
    confidence: number;
    /** Where this evidence came from */
    source: string;
}

export type DetectionStatus = "found" | "missing" | "partial" | "uncertain";

/**
 * Generic detection result with confidence and evidence.
 */
export interface Detection<T = string> {
    /** The detected value */
    value: T;
    /** Status of the detection */
    status: DetectionStatus;
    /** Confidence score (0-1) */
    confidence: number;
    /** Evidence supporting this detection */
    evidence: Evidence[];
}

// ===========================================
// MAIN DOCUMENT MODEL
// ===========================================

export interface DocumentModel {
    /** Metadata about the document */
    metadata: DocumentMetadata;

    /** All extracted text items with positions (for layout analysis) */
    textItems: TextItem[];

    /** Detected sections in order */
    sections: Section[];

    /** All bullet points (also accessible via sections) */
    bullets: Bullet[];

    /** Detected links (LinkedIn, GitHub, portfolio, etc.) */
    links: Link[];

    /** Detected email addresses */
    emails: Email[];

    /** Detected phone numbers */
    phones: Phone[];

    /** Extracted skills */
    skills: Skill[];

    /**
     * ⚠️ DEBUG ONLY - DO NOT USE FOR ANALYSIS
     * 
     * The raw text is preserved ONLY for debugging and fallback purposes.
     * Any logic that touches rawText for scoring/detection is a BUG.
     * 
     * @deprecated Use structured fields (sections, bullets, skills) instead
     */
    rawText: string;
}

// ===========================================
// ANALYSIS RESULT TYPES
// ===========================================

export type IssueType = "hard_failure" | "warning" | "suggestion";

export interface Issue {
    /** Type of issue */
    type: IssueType;
    /** Category of the issue */
    category: "ats" | "content" | "formatting" | "contact" | "keywords";
    /** Human-readable message */
    message: string;
    /** Confidence that this issue is accurate */
    confidence: number;
    /** Evidence supporting this issue */
    evidence: Evidence[];
    /** Priority for fixes (1 = highest) */
    priority: number;
}

export type Verdict = "PASS" | "WEAK PASS" | "REJECT";

export interface AnalysisScores {
    /** ATS compatibility score (0-100) */
    atsCompatibility: number;
    /** How reliably the resume was parsed (0-100) */
    parsingReliability: number;
    /** Alignment with target role (0-100) */
    roleAlignment: number;
    /** Quality of content/bullets (0-100) */
    contentQuality: number;
    /** Overall strength (0-100) */
    overallStrength: number;
}

export interface ContactDetections {
    linkedin: Detection<string>;
    github: Detection<string>;
    email: Detection<string>;
    phone: Detection<string>;
    portfolio: Detection<string>;
}

export interface SectionAnalysis {
    found: string[];
    missing: string[];
    confidence: number;
    orderingIssues: string[];
    weakSections: string[];
}

export interface KeywordAnalysis {
    /** Match rate (0-1) */
    matchRate: number;
    /** Keywords found with evidence */
    found: Array<{
        keyword: string;
        confidence: number;
        evidence: Evidence;
        /** Section where found (Skills weighted higher than Experience) */
        sourceSection: string;
    }>;
    /** Keywords not found */
    missing: string[];
    /** Total keywords checked */
    totalChecked: number;
}

export interface BulletAnalysis {
    /** Total bullet points found */
    total: number;
    /** Bullets starting with action verbs */
    withActionVerbs: number;
    /** Bullets containing metrics */
    withMetrics: number;
    /** Rate of action verbs (0-1) */
    actionVerbRate: number;
    /** Rate of metrics (0-1) */
    metricsRate: number;
    /** Bullets that are too short (<30 chars) */
    tooShort: number;
    /** Bullets that are too long (>200 chars) */
    tooLong: number;
    /** Average bullet length */
    averageLength: number;
}

/**
 * Complete analysis result from the deterministic engine.
 */
export interface AnalysisResult {
    /** Overall score (0-100) */
    overallScore: number;
    /** Final verdict */
    verdict: Verdict;
    /** Component scores */
    scores: AnalysisScores;
    /** Contact information detections */
    contacts: ContactDetections;
    /** Section analysis */
    sections: SectionAnalysis;
    /** Keyword analysis */
    keywords: KeywordAnalysis;
    /** Bullet analysis */
    bullets: BulletAnalysis;
    /** All issues found (confidence-gated) */
    issues: Issue[];
    /** Processing metadata */
    processingTimeMs: number;
}

// ===========================================
// INTERPRETATION RESULT (USER-FACING)
// ===========================================

export type Severity = "critical" | "warning" | "info" | "success";

export interface CalibratedMessage {
    title: string;
    explanation: string;
    severity: Severity;
    category: Issue["category"];
    evidence?: Evidence[];
}

export interface InterpretationResult {
    /** Calibrated overall strength (user-friendly) */
    overallStrength: number;
    /** Softer, supportive verdict */
    userVerdict: string;
    /** Calibrated component scores (never 0% or 100%) */
    calibratedScores: {
        atsReliability: number;
        contentQuality: number;
        roleAlignment: number;
        overallStrength: number;
    };
    /** Key highlights (positive findings) */
    highlights: string[];
    /** Prioritized, supportive improvement messages */
    improvements: CalibratedMessage[];
    /** Context-aware status (e.g., "Standard PDF Detected", "Low Parsing Confidence") */
    parsingContext: {
        status: "stable" | "warning" | "critical";
        message: string;
    };
}

// ===========================================
// HELPER TYPE GUARDS
// ===========================================

export function isHighConfidence(detection: Detection): boolean {
    return detection.confidence >= CONFIDENCE_THRESHOLD;
}

export function shouldShowWarning(issue: Issue): boolean {
    return issue.confidence >= CONFIDENCE_THRESHOLD;
}

export function isEnglishDocument(doc: DocumentModel): boolean {
    return doc.metadata.detectedLanguage === "en" ||
        doc.metadata.detectedLanguage === "en-US" ||
        doc.metadata.detectedLanguage === "en-GB";
}
