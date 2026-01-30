import type { AnalysisResult, InterpretationResult, CalibratedMessage, Severity } from "./document-model";
import { CALIBRATION_FORMULA } from "./document-model";

/**
 * INTERPRETER LAYER
 * Transforms raw "engine truth" into user-friendly, calibrated feedback.
 */

export function interpretAnalysis(raw: AnalysisResult): InterpretationResult {
    // 1. Calibrate scores using the standard formula [35, 92] range
    const calibratedScores = {
        atsReliability: CALIBRATION_FORMULA(raw.scores.atsCompatibility),
        contentQuality: CALIBRATION_FORMULA(raw.scores.contentQuality),
        roleAlignment: CALIBRATION_FORMULA(raw.scores.roleAlignment),
        overallStrength: CALIBRATION_FORMULA(raw.overallScore),
    };

    // 2. Map Verdicts (Softer language)
    let userVerdict = "";
    if (raw.verdict === "PASS") {
        userVerdict = "Strong Foundation! Your resume aligns well with standard industry expectations.";
    } else if (raw.verdict === "WEAK PASS") {
        userVerdict = "Good Progress. A few targeted optimizations will help you stand out to recruiters.";
    } else {
        userVerdict = "Action Recommended. Your resume has clear opportunities for structural and content improvements.";
    }

    // 3. Transform Issues into Supportive Improvements
    const improvements: CalibratedMessage[] = raw.issues.map(issue => {
        let severity: Severity = "info";
        let title = "";
        let explanation = issue.message;

        if (issue.type === "hard_failure") {
            severity = "critical";
            title = "High Impact Optimization";
        } else if (issue.type === "warning") {
            severity = "warning";
            title = "Recommended Improvement";
        } else {
            severity = "info";
            title = "Pro Tip";
        }

        // Language Softening
        if (issue.category === "keywords") {
            title = "Role Alignment";
            explanation = explanation.replace("Critical keyword gap", "Expand your specialized vocabulary")
                .replace("Low keyword alignment", "Strengthen alignment with role-specific terms");
        } else if (issue.category === "content") {
            title = "Impact & Results";
        } else if (issue.category === "contact") {
            title = "Recruiter Accessibility";
        }

        return {
            title,
            explanation,
            severity,
            category: issue.category,
            evidence: issue.evidence,
        };
    });

    // 4. Generate Positive Highlights
    const highlights: string[] = [];
    if (raw.scores.parsingReliability > 80) highlights.push("Modern, ATS-friendly document structure");
    if (raw.bullets.metricsRate > 0.4) highlights.push("Strong emphasis on measurable results and impact");
    if (raw.bullets.actionVerbRate > 0.8) highlights.push("Highly proactive and achievement-oriented tone");
    if (raw.contacts.linkedin.status === "found") highlights.push("LinkedIn presence is clearly optimized for recruiters");
    if (raw.sections.found.length >= 4) highlights.push("Comprehensive coverage of core professional sections");

    // 5. Context-aware Parsing Status
    let parsingContext: InterpretationResult["parsingContext"] = {
        status: "stable",
        message: "Your resume structure was reliably analyzed by our system.",
    };

    if (raw.scores.parsingReliability < 60) {
        parsingContext = {
            status: "critical",
            message: "Complex layout detected. Some sections may need structural simplifying for maximum ATS compatibility.",
        };
    } else if (raw.scores.parsingReliability < 85) {
        parsingContext = {
            status: "warning",
            message: "Standard parsing active. Consider a single-column layout for 100% reliability.",
        };
    }

    return {
        overallStrength: calibratedScores.overallStrength,
        userVerdict,
        calibratedScores,
        highlights,
        improvements,
        parsingContext,
    };
}
