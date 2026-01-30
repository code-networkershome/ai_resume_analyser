import {
    ROLE_KEYWORDS,
    ACTION_VERBS,
} from "@/lib/constants";
import { countWords } from "@/lib/utils";

// ===========================================
// TYPES
// ===========================================

export interface ATSResult {
    atsScore: number;
    hardFailures: string[];
    warnings: string[];
    verdict: "PASS" | "WEAK PASS" | "REJECT";
    scores: {
        atsCompatibility: number;
        parsingReliability: number;
        roleExpectationMatch: number;
        responsibilityAlignment: number;
        skillEvidence: number;
        recruiterShortlistingProbability: number;
        overallStrength: number;
    };
    rejectionReasons: {
        ats: string[];
        recruiter: string[];
        topBlockingIssues: string[];
    };
    parsing: {
        multiColumnDetected: boolean;
        tablesDetected: boolean;
        iconsOrImagesDetected: boolean;
        headerFooterRisk: boolean;
        nonStandardBulletSymbols: string[];
        nonStandardDateFormats: string[];
        sectionHeadersRecognized: boolean;
        atsParseFailureRiskScore: number;
    };
    sections: {
        found: string[];
        missing: string[];
        orderingIssues: string[];
        weakSections: string[];
        roleSpecificMissing: string[];
    };
    keywords: {
        matchRate: number;
        keywordsFound: string[];
        keywordsMissing: string[];
        criticalMissing: string[];
        overused: string[];
    };
    bullets: {
        bulletCount: number;
        actionVerbRate: number;
        metricsRate: number;
        weakBulletCount: number;
    };
    career: {
        issues: string[];
        credibilityRiskScore: number;
    };
    details: {
        wordCount: number;
    };
}

interface ATSCheckContext {
    resumeText: string;
    targetRole: string;
    experienceLevel: string;
    jobTitle?: string;
    jobDescription?: string;
    parsingInsights?: {
        multiColumnDetected: boolean;
        tablesDetected: boolean;
        iconsOrImagesDetected: boolean;
        headerFooterRisk: boolean;
        nonStandardBulletSymbols: string[];
        nonStandardDateFormats: string[];
        sectionHeadersRecognized: boolean;
        atsParseFailureRiskScore: number;
    } | null;
    normalizedText: string;
    lines: string[];
    bullets: string[];
}

// ===========================================
// MAIN ATS CHECKER
// ===========================================

export function runAtsChecks(
    resumeText: string,
    targetRole: string,
    experienceLevel: string,
    extras?: {
        jobTitle?: string;
        jobDescription?: string;
        parsingInsights?: ATSResult["parsing"];
    }
): ATSResult {
    const hardFailures: string[] = [];
    const warnings: string[] = [];
    let score = 100;

    // Prepare context
    const normalizedText = resumeText.toLowerCase();
    const lines = resumeText.split("\n").filter((line) => line.trim());
    const bullets = extractBullets(resumeText);

    const context: ATSCheckContext = {
        resumeText,
        targetRole,
        experienceLevel,
        jobTitle: extras?.jobTitle,
        jobDescription: extras?.jobDescription,
        parsingInsights: extras?.parsingInsights || null,
        normalizedText,
        lines,
        bullets,
    };

    // Run all checks
    const lengthResult = checkResumeLength(context);
    score += lengthResult.scoreAdjustment;
    hardFailures.push(...lengthResult.hardFailures);
    warnings.push(...lengthResult.warnings);

    const sectionResult = checkSectionPresence(context);
    score += sectionResult.scoreAdjustment;
    hardFailures.push(...sectionResult.hardFailures);
    warnings.push(...sectionResult.warnings);

    const keywordResult = checkKeywordAlignment(context);
    score += keywordResult.scoreAdjustment;
    hardFailures.push(...keywordResult.hardFailures);
    warnings.push(...keywordResult.warnings);

    const bulletResult = checkBulletQuality(context);
    score += bulletResult.scoreAdjustment;
    hardFailures.push(...bulletResult.hardFailures);
    warnings.push(...bulletResult.warnings);

    const actionVerbResult = checkActionVerbs(context);
    score += actionVerbResult.scoreAdjustment;
    warnings.push(...actionVerbResult.warnings);

    const metricsResult = checkImpactMetrics(context);
    score += metricsResult.scoreAdjustment;
    warnings.push(...metricsResult.warnings);

    const contactResult = checkContactInfo(context);
    score += contactResult.scoreAdjustment;
    warnings.push(...contactResult.warnings);

    // Parsing/formatting risks
    const parsingInsights = context.parsingInsights || {
        multiColumnDetected: false,
        tablesDetected: false,
        iconsOrImagesDetected: false,
        headerFooterRisk: false,
        nonStandardBulletSymbols: [] as string[],
        nonStandardDateFormats: [] as string[],
        sectionHeadersRecognized: sectionResult.found.length > 0,
        atsParseFailureRiskScore: 0,
    };

    // Basic additional penalties for structural risks
    if (parsingInsights.multiColumnDetected) {
        warnings.push("Multi-column layout detected. Some ATS systems may misread content.");
        score -= 5;
    }
    if (parsingInsights.tablesDetected) {
        warnings.push("Tables detected. Important information in tables can be lost in ATS parsing.");
        score -= 5;
    }
    if (parsingInsights.headerFooterRisk) {
        warnings.push("Header/footer style content detected. ATS often ignores these regions.");
        score -= 5;
    }

    // Career credibility heuristics (very lightweight placeholder)
    const careerIssues: string[] = [];
    if (countWords(resumeText) > 1000 && bullets.length < 10) {
        careerIssues.push("Very long resume with few bullet points. Signals low clarity and weak prioritization.");
        score -= 5;
    }

    const atsScoreClamped = Math.max(0, Math.min(100, score));

    // Derive component scores heuristically
    const atsCompatibility = Math.max(
        0,
        atsScoreClamped - (parsingInsights.atsParseFailureRiskScore || 0) * 0.2
    );
    const parsingReliability = Math.max(
        0,
        100 - (parsingInsights.atsParseFailureRiskScore || 0)
    );
    const roleExpectationMatch = Math.max(0, keywordResult.matchRate * 100);
    const responsibilityAlignment = 0; // filled by AI responsibility engine later
    const skillEvidence = Math.max(
        0,
        ((actionVerbResult.rate || 0) * 0.4 +
            (metricsResult.rate || 0) * 0.6) * 100
    );
    const recruiterShortlistingProbability = Math.max(
        0,
        Math.min(
            100,
            (atsCompatibility * 0.4 +
                roleExpectationMatch * 0.3 +
                skillEvidence * 0.3) /
            1
        )
    );
    const overallStrength = atsScoreClamped;

    let verdict: ATSResult["verdict"] = "PASS";
    if (atsScoreClamped < 60 || hardFailures.length >= 3) {
        verdict = "REJECT";
    } else if (atsScoreClamped < 80 || hardFailures.length > 0) {
        verdict = "WEAK PASS";
    }

    const rejectionReasons = {
        ats: [...hardFailures],
        recruiter: [
            ...careerIssues,
            ...warnings.filter((w) =>
                /metrics|bullets|keyword|experience|skills/i.test(w)
            ),
        ],
        topBlockingIssues: [...hardFailures].slice(0, 5),
    };

    return {
        atsScore: atsScoreClamped,
        hardFailures,
        warnings,
        verdict,
        scores: {
            atsCompatibility,
            parsingReliability,
            roleExpectationMatch,
            responsibilityAlignment,
            skillEvidence,
            recruiterShortlistingProbability,
            overallStrength,
        },
        rejectionReasons,
        parsing: parsingInsights,
        sections: {
            found: sectionResult.found,
            missing: sectionResult.missing,
            orderingIssues: [],
            weakSections: [],
            roleSpecificMissing: [],
        },
        keywords: {
            matchRate: keywordResult.matchRate,
            keywordsFound: keywordResult.found,
            keywordsMissing: keywordResult.missing,
            criticalMissing:
                keywordResult.matchRate < 0.4 ? keywordResult.missing.slice(0, 10) : [],
            overused: [],
        },
        bullets: {
            bulletCount: bullets.length,
            actionVerbRate: actionVerbResult.rate,
            metricsRate: metricsResult.rate,
            weakBulletCount:
                bullets.length - Math.round((actionVerbResult.rate || 0) * bullets.length),
        },
        career: {
            issues: careerIssues,
            credibilityRiskScore: careerIssues.length > 0 ? 40 : 0,
        },
        details: {
            wordCount: countWords(resumeText),
        },
    };
}

// ===========================================
// INDIVIDUAL CHECKS
// ===========================================

interface CheckResult {
    scoreAdjustment: number;
    hardFailures: string[];
    warnings: string[];
}

function checkResumeLength(context: ATSCheckContext): CheckResult {
    const { resumeText, experienceLevel } = context;
    const hardFailures: string[] = [];
    const warnings: string[] = [];
    let scoreAdjustment = 0;

    const wordCount = countWords(resumeText);

    // Define ideal ranges by experience level
    const ranges: Record<string, [number, number]> = {
        Fresher: [200, 500],
        "1-3 Years": [300, 600],
        "3-6 Years": [400, 800],
        "6+ Years": [500, 1000],
        Switcher: [300, 600],
    };

    const [minWords, maxWords] = ranges[experienceLevel] || [300, 700];

    if (wordCount < 150) {
        hardFailures.push(
            `Resume critically short (${wordCount} words). Minimum 150 words expected for any role.`
        );
        scoreAdjustment -= 30;
    } else if (wordCount < minWords * 0.7) {
        hardFailures.push(
            `Resume too short for ${experienceLevel} level (${wordCount} words). Expected at least ${Math.round(minWords * 0.7)} words.`
        );
        scoreAdjustment -= 20;
    } else if (wordCount < minWords) {
        warnings.push(
            `Resume slightly short (${wordCount} words). Consider adding more detail. Ideal: ${minWords}-${maxWords} words.`
        );
        scoreAdjustment -= 5;
    }

    if (wordCount > maxWords * 1.5) {
        hardFailures.push(
            `Resume too long (${wordCount} words). Recruiters spend 7 seconds scanning. Maximum ${Math.round(maxWords * 1.5)} words recommended.`
        );
        scoreAdjustment -= 15;
    } else if (wordCount > maxWords) {
        warnings.push(
            `Resume slightly long (${wordCount} words). Consider trimming to ${maxWords} words for better scanability.`
        );
        scoreAdjustment -= 5;
    }

    return { scoreAdjustment, hardFailures, warnings };
}

function checkSectionPresence(context: ATSCheckContext): CheckResult & {
    found: string[];
    missing: string[];
} {
    const { normalizedText } = context;
    const hardFailures: string[] = [];
    const warnings: string[] = [];
    let scoreAdjustment = 0;

    // Required sections with variations
    const requiredSections = [
        {
            name: "Experience",
            patterns: [
                "experience",
                "work experience",
                "professional experience",
                "employment",
                "work history",
            ],
        },
        {
            name: "Education",
            patterns: ["education", "academic", "qualifications", "degrees", "scholastic"],
        },
        {
            name: "Skills",
            patterns: [
                "skills",
                "technical skills",
                "technologies",
                "competencies",
                "expertise",
                "tools",
            ],
        },
    ];

    // Optional but recommended sections
    const optionalSections = [
        {
            name: "Summary",
            patterns: ["summary", "profile", "objective", "about"],
        },
        {
            name: "Projects",
            patterns: ["projects", "portfolio", "personal projects", "academic projects", "course projects"],
        },
        {
            name: "Coursework",
            patterns: ["coursework", "relevant courses", "subjects", "academic details"],
        },
        {
            name: "Certifications",
            patterns: ["certifications", "certificates", "credentials", "licenses", "training"],
        },
        {
            name: "Achievements",
            patterns: ["achievements", "awards", "honors", "accomplishments", "ranks", "competitions"],
        },
    ];

    const found: string[] = [];
    const missing: string[] = [];

    // Check required sections
    for (const section of requiredSections) {
        const hasSection = section.patterns.some((pattern) =>
            new RegExp(`\\b${pattern}\\b`, "i").test(normalizedText)
        );
        if (hasSection) {
            found.push(section.name);
        } else {
            missing.push(section.name);
            hardFailures.push(`Missing required section: ${section.name}`);
            scoreAdjustment -= 15;
        }
    }

    // Check optional sections
    for (const section of optionalSections) {
        const hasSection = section.patterns.some((pattern) =>
            new RegExp(`\\b${pattern}\\b`, "i").test(normalizedText)
        );
        if (hasSection) {
            found.push(section.name);
        } else {
            if (section.name === "Summary") {
                warnings.push(
                    "Consider adding a professional summary/profile section at the top"
                );
                scoreAdjustment -= 3;
            }
        }
    }

    return { scoreAdjustment, hardFailures, warnings, found, missing };
}

function checkKeywordAlignment(context: ATSCheckContext): CheckResult & {
    matchRate: number;
    found: string[];
    missing: string[];
} {
    const { normalizedText, targetRole } = context;
    const hardFailures: string[] = [];
    const warnings: string[] = [];
    let scoreAdjustment = 0;

    const roleKeywords = ROLE_KEYWORDS[targetRole] || [];

    if (roleKeywords.length === 0) {
        return {
            scoreAdjustment: 0,
            hardFailures: [],
            warnings: [],
            matchRate: 0,
            found: [],
            missing: [],
        };
    }

    const found: string[] = [];
    const missing: string[] = [];

    for (const keyword of roleKeywords) {
        if (new RegExp(`\\b${keyword}\\b`, "i").test(normalizedText)) {
            found.push(keyword);
        } else {
            missing.push(keyword);
        }
    }

    const matchRate = found.length / roleKeywords.length;

    if (matchRate < 0.2) {
        hardFailures.push(
            `Critical keyword gap: Only ${Math.round(matchRate * 100)}% of ${targetRole} keywords found. Resume may not pass ATS filtering.`
        );
        scoreAdjustment -= 30;
    } else if (matchRate < 0.4) {
        hardFailures.push(
            `Low keyword alignment (${Math.round(matchRate * 100)}%). Missing core ${targetRole} terminology.`
        );
        scoreAdjustment -= 20;
    } else if (matchRate < 0.6) {
        warnings.push(
            `Keyword coverage at ${Math.round(matchRate * 100)}%. Consider adding: ${missing.slice(0, 5).join(", ")}`
        );
        scoreAdjustment -= 10;
    } else if (matchRate < 0.8) {
        warnings.push(
            `Good keyword coverage (${Math.round(matchRate * 100)}%). Could strengthen with: ${missing.slice(0, 3).join(", ")}`
        );
        scoreAdjustment -= 5;
    }

    return { scoreAdjustment, hardFailures, warnings, matchRate, found, missing };
}

function checkBulletQuality(context: ATSCheckContext): CheckResult {
    const { bullets } = context;
    const hardFailures: string[] = [];
    const warnings: string[] = [];
    let scoreAdjustment = 0;

    if (bullets.length === 0) {
        hardFailures.push(
            "No bullet points found in resume. Use bullet points to highlight achievements and responsibilities."
        );
        scoreAdjustment -= 20;
        return { scoreAdjustment, hardFailures, warnings };
    }

    if (bullets.length < 5) {
        warnings.push(
            `Only ${bullets.length} bullet points found. Consider adding more to highlight your experience.`
        );
        scoreAdjustment -= 5;
    }

    // Check bullet length
    const longBullets = bullets.filter((b) => b.length > 200);
    const shortBullets = bullets.filter((b) => b.length < 30);

    if (longBullets.length > bullets.length * 0.3) {
        warnings.push(
            `${longBullets.length} bullet points are too long (>200 chars). Keep bullets concise and scannable.`
        );
        scoreAdjustment -= 5;
    }

    if (shortBullets.length > bullets.length * 0.3) {
        warnings.push(
            `${shortBullets.length} bullet points are too short (<30 chars). Add more detail about impact and context.`
        );
        scoreAdjustment -= 5;
    }

    return { scoreAdjustment, hardFailures, warnings };
}

function checkActionVerbs(context: ATSCheckContext): CheckResult & {
    rate: number;
} {
    const { bullets } = context;
    const warnings: string[] = [];
    let scoreAdjustment = 0;

    if (bullets.length === 0) {
        return { scoreAdjustment: 0, hardFailures: [], warnings: [], rate: 0 };
    }

    let bulletsWithActionVerbs = 0;

    for (const bullet of bullets) {
        const firstWord = bullet.trim().split(/\s+/)[0]?.toLowerCase();
        if (firstWord && ACTION_VERBS.includes(firstWord)) {
            bulletsWithActionVerbs++;
        }
    }

    const rate = bulletsWithActionVerbs / bullets.length;

    if (rate < 0.5) {
        warnings.push(
            `Only ${Math.round(rate * 100)}% of bullets start with action verbs. Use strong verbs like: Led, Developed, Implemented, Reduced.`
        );
        scoreAdjustment -= 10;
    } else if (rate < 0.7) {
        warnings.push(
            `${Math.round(rate * 100)}% of bullets use action verbs. Aim for 80%+.`
        );
        scoreAdjustment -= 5;
    }

    return { scoreAdjustment, hardFailures: [], warnings, rate };
}

function checkImpactMetrics(context: ATSCheckContext): CheckResult & {
    rate: number;
} {
    const { bullets } = context;
    const warnings: string[] = [];
    let scoreAdjustment = 0;

    if (bullets.length === 0) {
        return { scoreAdjustment: 0, hardFailures: [], warnings: [], rate: 0 };
    }

    // Patterns for quantified achievements
    const metricsPatterns = [
        /\d+%/, // percentages
        /\$[\d,]+/, // dollar amounts
        /\d+x/, // multipliers
        /\d+\+?\s*(users?|customers?|clients?)/i, // user counts
        /\d+\+?\s*(projects?|applications?|systems?)/i, // project counts
        /\d+\+?\s*(team|members?|people|engineers?|developers?)/i, // team size
        /\d+\+?\s*(hours?|days?|weeks?|months?)/i, // time savings
        /\d+\+?\s*(servers?|instances?|nodes?)/i, // infrastructure scale
        /reduced\s+.*\s+by\s+\d+/i, // reduction metrics
        /increased\s+.*\s+by\s+\d+/i, // increase metrics
        /improved\s+.*\s+by\s+\d+/i, // improvement metrics
        /\d+\s*(ms|seconds?|minutes?)/i, // performance metrics
        /\d+\s*(gb|tb|mb)/i, // data volumes
        // NEW: Competition and ranking metrics
        /top\s+\d+%/i, // "Top 3%"
        /rank\s*\d+/i, // "Rank 221"
        /\d+\/\d+/, // "221/7000"
        /\d+[\d,]*\+?\s*teams?/i, // "7000+ teams"
        /\d+[\d,]*\s*selected/i, // "3,000 selected"
        // NEW: Score and accuracy metrics
        /score\s*(of\s*)?[\d.]+/i, // "score of 45.29" or "score 95"
        /accuracy\s*(of\s*)?[\d.]+/i, // "accuracy 95%"
        /f1[\s-]*score/i, // "F1 score" or "F1-score"
        /smape\s*[\d.]+/i, // "SMAPE 45.29"
        /precision|recall|auc|roc/i, // ML metrics
        // NEW: Academic metrics
        /cgpa[:\s]*[\d.]+/i, // "CGPA: 8.84"
        /gpa[:\s]*[\d.]+/i, // "GPA 3.9"
    ];

    let bulletsWithMetrics = 0;

    for (const bullet of bullets) {
        const hasMetric = metricsPatterns.some((pattern) => pattern.test(bullet));
        if (hasMetric) {
            bulletsWithMetrics++;
        }
    }

    const rate = bulletsWithMetrics / bullets.length;

    if (rate < 0.3) {
        warnings.push(
            `Only ${Math.round(rate * 100)}% of bullets contain quantified impact. Add metrics like: "Reduced load time by 40%", "Managed team of 5 engineers".`
        );
        scoreAdjustment -= 15;
    } else if (rate < 0.5) {
        warnings.push(
            `${Math.round(rate * 100)}% of bullets show quantified impact. Recruiters prefer measurable achievements.`
        );
        scoreAdjustment -= 10;
    } else if (rate < 0.7) {
        warnings.push(
            `Good metrics coverage (${Math.round(rate * 100)}%). Consider quantifying more achievements.`
        );
        scoreAdjustment -= 5;
    }

    return { scoreAdjustment, hardFailures: [], warnings, rate };
}

function checkContactInfo(context: ATSCheckContext): CheckResult {
    const { normalizedText } = context;
    const warnings: string[] = [];
    let scoreAdjustment = 0;

    // Check for email
    const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i.test(
        context.resumeText
    );
    if (!hasEmail) {
        warnings.push("No email address detected. Ensure contact information is clearly visible.");
        scoreAdjustment -= 5;
    }

    // Check for LinkedIn
    const hasLinkedIn = /linkedin\.com/i.test(context.resumeText);
    if (!hasLinkedIn) {
        warnings.push(
            "Consider adding your LinkedIn profile URL for professional visibility."
        );
    }

    // Check for GitHub (for tech roles)
    const hasGitHub = /github\.com/i.test(context.resumeText);
    if (!hasGitHub) {
        warnings.push(
            "Consider adding your GitHub profile to showcase your code and projects."
        );
    }

    return { scoreAdjustment, hardFailures: [], warnings };
}

// ===========================================
// HELPER FUNCTIONS
// ===========================================

/**
 * Pre-process text to handle PDF extraction artifacts where bullet symbols
 * appear on their own line, separate from the content.
 */
function preprocessBulletedText(text: string): string {
    const lines = text.split("\n");
    const processed: string[] = [];
    const standaloneBulletPattern = /^[-•*●▪◦○□■➢➣➤]$/;

    for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();

        // Check if this line is JUST a bullet symbol
        if (standaloneBulletPattern.test(trimmed)) {
            // Look for next non-empty line to join with
            let j = i + 1;
            while (j < lines.length && !lines[j].trim()) {
                j++;
            }
            if (j < lines.length && lines[j].trim()) {
                processed.push(trimmed + " " + lines[j].trim());
                i = j; // Skip the consumed line
            }
        } else {
            processed.push(lines[i]);
        }
    }
    return processed.join("\n");
}

function extractBullets(text: string): string[] {
    // Pre-process to handle standalone bullet symbols
    const processedText = preprocessBulletedText(text);
    const lines = processedText.split("\n");
    const bullets: string[] = [];

    // Pattern to match lines starting with bullet symbols
    const bulletStartPatterns = [
        /^[-•*●▪◦○□■➢➣➤]\s*/,      // Common bullet symbols
        /^\d+[.)]\s+/,              // Numbered lists: "1. " or "1) "
        /^[a-z][.)]\s+/i,           // Lettered lists: "a. " or "a) "
    ];

    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.length === 0) continue;

        // Check if line starts with a bullet pattern
        for (const pattern of bulletStartPatterns) {
            if (pattern.test(trimmed)) {
                const content = trimmed.replace(pattern, "").trim();
                // Only include if content is substantial
                if (content.length > 15) {
                    bullets.push(content);
                }
                break;
            }
        }
    }

    return bullets;
}

