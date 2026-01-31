// ===========================================
// LAYER 1: STRUCTURAL ANALYSIS
// Fast, code-based extraction - no AI needed
// ===========================================

import {
    StructuralContext,
    DetectedSection,
    ExtractedBullet,
    ContactInfo,
    DetectedMetric,
} from "@/lib/types/universal-types";

export function runStructuralAnalysis(resumeText: string): StructuralContext {
    const lines = resumeText.split("\n");

    return {
        sections: detectSections(resumeText, lines),
        bullets: extractBullets(resumeText),
        contactInfo: extractContactInfo(resumeText),
        metrics: detectMetrics(resumeText),
        wordCount: countWords(resumeText),
        lineCount: lines.length,
    };
}

// ===========================================
// SECTION DETECTION (Adaptive, not hardcoded)
// ===========================================

function detectSections(text: string, lines: string[]): DetectedSection[] {
    const sections: DetectedSection[] = [];

    // Common section patterns (universal across resumes)
    const sectionPatterns = [
        /^(education|academic|qualifications?|degrees?)/i,
        /^(experience|work\s*experience|employment|work\s*history|professional\s*experience)/i,
        /^(skills?|technical\s*skills?|competenc|expertise|technologies)/i,
        /^(projects?|portfolio|personal\s*projects?)/i,
        /^(certifications?|certificates?|credentials?|licenses?)/i,
        /^(achievements?|awards?|honors?|accomplishments?)/i,
        /^(summary|profile|objective|about)/i,
        /^(coursework|relevant\s*courses?|subjects?)/i,
        /^(publications?|research)/i,
        /^(volunteer|community)/i,
        /^(languages?)/i,
        /^(interests?|hobbies?)/i,
    ];

    let currentSection: DetectedSection | null = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Check if this line is a section header
        for (const pattern of sectionPatterns) {
            if (pattern.test(line) && line.length < 50) {
                // Close previous section
                if (currentSection) {
                    currentSection.endLine = i - 1;
                    sections.push(currentSection);
                }

                // Start new section
                currentSection = {
                    name: normalizeSectionName(line),
                    startLine: i,
                    endLine: lines.length - 1,
                    confidence: 0.9,
                };
                break;
            }
        }
    }

    // Close last section
    if (currentSection) {
        sections.push(currentSection);
    }

    return sections;
}

function normalizeSectionName(header: string): string {
    const lower = header.toLowerCase().trim();

    if (/education|academic|qualifications?|degrees?/.test(lower)) return "Education";
    if (/experience|employment|work\s*history/.test(lower)) return "Experience";
    if (/skills?|competenc|expertise|technologies/.test(lower)) return "Skills";
    if (/projects?|portfolio/.test(lower)) return "Projects";
    if (/certifications?|certificates?|credentials?/.test(lower)) return "Certifications";
    if (/achievements?|awards?|honors?/.test(lower)) return "Achievements";
    if (/summary|profile|objective|about/.test(lower)) return "Summary";
    if (/coursework|courses?/.test(lower)) return "Coursework";

    return header.replace(/[^a-zA-Z\s]/g, "").trim();
}

// ===========================================
// BULLET EXTRACTION (Universal patterns)
// ===========================================

function preprocessBulletedText(text: string): string {
    const lines = text.split("\n");
    const processed: string[] = [];
    const standaloneBulletPattern = /^[-•*●▪◦○□■➢➣➤]$/;

    for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();

        if (standaloneBulletPattern.test(trimmed)) {
            let j = i + 1;
            while (j < lines.length && !lines[j].trim()) { j++; }
            if (j < lines.length && lines[j].trim()) {
                processed.push(trimmed + " " + lines[j].trim());
                i = j;
            }
        } else {
            processed.push(lines[i]);
        }
    }
    return processed.join("\n");
}

function extractBullets(text: string): ExtractedBullet[] {
    const processedText = preprocessBulletedText(text);
    const lines = processedText.split("\n");
    const bullets: ExtractedBullet[] = [];

    const bulletPatterns = [
        /^[-•*●▪◦○□■➢➣➤]\s*/,
        /^\d+[.)]\s+/,
        /^[a-z][.)]\s+/i,
    ];

    const actionVerbPattern = /^(achieved|administered|analyzed|architected|automated|built|collaborated|configured|consolidated|created|debugged|decreased|delivered|deployed|designed|developed|devised|diagnosed|documented|drove|eliminated|enabled|engineered|enhanced|established|evaluated|executed|expanded|expedited|facilitated|formulated|generated|guided|identified|implemented|improved|increased|initiated|innovated|installed|integrated|introduced|launched|led|leveraged|maintained|managed|maximized|migrated|minimized|modernized|monitored|negotiated|optimized|orchestrated|organized|oversaw|performed|pioneered|planned|prepared|presented|prioritized|produced|programmed|proposed|provided|published|redesigned|reduced|refactored|refined|remediated|replaced|resolved|restructured|reviewed|revised|scaled|secured|simplified|solved|spearheaded|standardized|streamlined|strengthened|supervised|supported|surpassed|tested|trained|transformed|troubleshot|unified|upgraded|utilized|validated|verified|applied|building|conducting|contributed|coordinated|experimented|explored|gaining|handling|integrating|leading|learning|optimizing|participating|pursuing|researched|studying|using|worked|working)\b/i;

    const metricPattern = /(\d+%|\$[\d,]+|\d+x|\d+\+?\s*(users?|customers?|clients?|projects?|team|members?|people|hours?|days?|weeks?|months?|servers?|gb|tb|mb)|top\s+\d+%|rank\s*\d+|\d+\/\d+|score\s*(of\s*)?[\d.]+|cgpa|gpa)/i;

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.length < 20) continue;

        for (const pattern of bulletPatterns) {
            if (pattern.test(trimmed)) {
                const content = trimmed.replace(pattern, "").trim();
                if (content.length > 15) {
                    const firstWord = content.split(/\s+/)[0] || "";
                    bullets.push({
                        text: content,
                        section: "Unknown", // Will be enriched later
                        hasActionVerb: actionVerbPattern.test(firstWord),
                        hasMetric: metricPattern.test(content),
                        length: content.length,
                    });
                }
                break;
            }
        }
    }

    return bullets;
}

// ===========================================
// CONTACT INFO EXTRACTION
// ===========================================

function extractContactInfo(text: string): ContactInfo {
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i);
    const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
    const githubMatch = text.match(/github\.com\/[\w-]+/i);

    return {
        email: emailMatch?.[0],
        phone: phoneMatch?.[0],
        linkedin: linkedinMatch?.[0],
        github: githubMatch?.[0],
        location: undefined, // Would need more sophisticated extraction
    };
}

// ===========================================
// METRICS DETECTION
// ===========================================

function detectMetrics(text: string): DetectedMetric[] {
    const metrics: DetectedMetric[] = [];
    const lines = text.split("\n");

    const patterns: { pattern: RegExp; type: DetectedMetric["type"] }[] = [
        { pattern: /\d+(\.\d+)?%/g, type: "percentage" },
        { pattern: /\$[\d,]+(\.\d+)?/g, type: "currency" },
        { pattern: /top\s+\d+%/gi, type: "ranking" },
        { pattern: /rank\s*#?\d+/gi, type: "ranking" },
        { pattern: /\d+\/\d+/g, type: "ranking" },
        { pattern: /score\s*(of\s*)?[\d.]+/gi, type: "score" },
        { pattern: /smape\s*[\d.]+/gi, type: "score" },
        { pattern: /cgpa[:\s]*[\d.]+/gi, type: "score" },
        { pattern: /\d+\+?\s*(users?|customers?|clients?|teams?|projects?)/gi, type: "number" },
    ];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        for (const { pattern, type } of patterns) {
            const matches = line.match(pattern);
            if (matches) {
                for (const match of matches) {
                    metrics.push({
                        text: match,
                        type,
                        location: `Line ${i + 1}`,
                    });
                }
            }
        }
    }

    return metrics;
}

// ===========================================
// UTILITY
// ===========================================

function countWords(text: string): number {
    return text.split(/\s+/).filter(w => w.length > 0).length;
}

// ===========================================
// PARSING CONFIDENCE
// ===========================================

export function calculateParsingConfidence(structural: StructuralContext): number {
    let confidence = 100;

    // Deduct for missing sections
    const hasSections = structural.sections.length >= 2;
    if (!hasSections) confidence -= 20;

    // Deduct for very few bullets
    if (structural.bullets.length < 3) confidence -= 15;
    else if (structural.bullets.length < 6) confidence -= 5;

    // Deduct for missing contact info
    if (!structural.contactInfo.email) confidence -= 10;

    // Boost for good structure
    if (structural.sections.length >= 4) confidence += 5;
    if (structural.bullets.length >= 10) confidence += 5;

    return Math.max(0, Math.min(100, confidence));
}

// ===========================================
// ENHANCV-STYLE CHECKS
// ===========================================

import { EnhancvStyleChecks } from "@/lib/types/universal-types";

export function generateEnhancvChecks(
    resumeText: string,
    structural: StructuralContext,
    fileFormat: string = "PDF",
    fileSizeKB: number = 0
): EnhancvStyleChecks {
    const parsingConfidence = calculateParsingConfidence(structural);

    return {
        atsParseRate: generateAtsParseRate(parsingConfidence),
        quantifyImpact: analyzeQuantifyImpact(structural),
        repetition: detectRepetition(resumeText),
        essentialSections: checkEssentialSections(structural),
        contactInfo: analyzeContactInfo(structural),
        fileInfo: checkFileInfo(fileFormat, fileSizeKB),
        emailCheck: validateEmail(structural.contactInfo.email),
        headerLinks: detectHeaderLinks(resumeText),
    };
}

function generateAtsParseRate(confidence: number): EnhancvStyleChecks["atsParseRate"] {
    return {
        percentage: confidence,
        status: confidence >= 80 ? "success" : confidence >= 60 ? "warning" : "error",
        message: confidence >= 80
            ? "We parsed your resume successfully using an industry-leading ATS."
            : confidence >= 60
                ? "Some elements of your resume may not parse correctly in ATS systems."
                : "Your resume has significant parsing issues that may cause ATS failures.",
    };
}

function analyzeQuantifyImpact(structural: StructuralContext): EnhancvStyleChecks["quantifyImpact"] {
    const bullets = structural.bullets;
    const bulletsWithMetrics = bullets.filter(b => b.hasMetric).length;
    const bulletsWithoutMetrics = bullets.filter(b => !b.hasMetric).length;

    // Get weak bullets (no metrics AND no strong action verbs)
    const weakBullets = bullets
        .filter(b => !b.hasMetric && !b.hasActionVerb)
        .slice(0, 3)
        .map(b => b.text);

    const ratio = bullets.length > 0 ? bulletsWithMetrics / bullets.length : 0;

    return {
        bulletsWithMetrics,
        bulletsWithoutMetrics,
        totalBullets: bullets.length,
        weakBullets,
        status: ratio >= 0.5 ? "success" : ratio >= 0.25 ? "warning" : "error",
    };
}

function detectRepetition(text: string): EnhancvStyleChecks["repetition"] {
    const words = text.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
    const wordCount: Record<string, number> = {};

    // Common words to ignore
    const stopWords = new Set([
        "with", "that", "this", "have", "from", "were", "been", "more", "will",
        "their", "which", "would", "about", "there", "other", "into", "some",
        "than", "only", "over", "such", "also", "your", "when", "just", "each",
        "make", "like", "time", "very", "work", "used", "using", "team", "university",
        "company", "experience", "skills", "education", "project", "projects"
    ]);

    for (const word of words) {
        if (!stopWords.has(word)) {
            wordCount[word] = (wordCount[word] || 0) + 1;
        }
    }

    const repeatedWords = Object.entries(wordCount)
        .filter(([_, count]) => count >= 4)
        .map(([word, count]) => ({ word, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    return {
        repeatedWords,
        status: repeatedWords.length === 0 ? "success" : "warning",
        message: repeatedWords.length === 0
            ? "No frequently repeated words found in your resume."
            : `Found ${repeatedWords.length} words used excessively. Consider using synonyms.`,
    };
}

function checkEssentialSections(structural: StructuralContext): EnhancvStyleChecks["essentialSections"] {
    const essentialNames = ["Experience", "Education", "Summary", "Skills"];
    const foundNames = structural.sections.map(s => s.name);

    const found = essentialNames.filter(name =>
        foundNames.some(f => f.toLowerCase().includes(name.toLowerCase()))
    );
    const missing = essentialNames.filter(name =>
        !foundNames.some(f => f.toLowerCase().includes(name.toLowerCase()))
    );

    return {
        found,
        missing,
        status: missing.length === 0 ? "success" : missing.length <= 1 ? "warning" : "error",
    };
}

function analyzeContactInfo(structural: StructuralContext): EnhancvStyleChecks["contactInfo"] {
    const contact = structural.contactInfo;
    const found: { type: string; value: string }[] = [];
    const missing: string[] = [];

    if (contact.email) found.push({ type: "Email", value: contact.email });
    else missing.push("Email");

    if (contact.phone) found.push({ type: "Phone", value: contact.phone });
    else missing.push("Phone");

    if (contact.linkedin) found.push({ type: "LinkedIn", value: contact.linkedin });
    else missing.push("LinkedIn");

    if (contact.github) found.push({ type: "GitHub", value: contact.github });
    // GitHub is optional, don't add to missing

    return {
        found,
        missing,
        status: missing.length === 0 ? "success" : "warning",
    };
}

function checkFileInfo(format: string, sizeKB: number): EnhancvStyleChecks["fileInfo"] {
    const isPDF = format.toLowerCase() === "pdf";
    const isReasonableSize = sizeKB < 2048; // 2MB limit

    return {
        format: format.toUpperCase(),
        sizeKB,
        status: isPDF && isReasonableSize ? "success" : "warning",
    };
}

function validateEmail(email: string | undefined): EnhancvStyleChecks["emailCheck"] {
    if (!email) {
        return {
            email: null,
            isProfessional: false,
            status: "warning",
            message: "No email address found in your resume.",
        };
    }

    // Check for unprofessional patterns
    const unprofessionalPatterns = [
        /^(sexy|hot|cool|crazy|ninja|boss|king|queen|dude|babe|baby)\d*/i,
        /\d{5,}@/,  // Too many numbers
        /^(xXx|xxx)/i,
        /(420|69|666)@/,
    ];

    const isUnprofessional = unprofessionalPatterns.some(p => p.test(email));
    const isProfessional = !isUnprofessional;

    return {
        email,
        isProfessional,
        status: isProfessional ? "success" : "warning",
        message: isProfessional
            ? "Your email address appears professional."
            : "Consider using a more professional email address.",
    };
}

function detectHeaderLinks(text: string): EnhancvStyleChecks["headerLinks"] {
    // Find full URLs (not just domain names)
    const urlPattern = /https?:\/\/[^\s]+/gi;
    const fullUrls = text.match(urlPattern) || [];

    // Clean up URLs (remove trailing punctuation)
    const cleanUrls = fullUrls.map(url => url.replace(/[.,;:!?)]+$/, ""));
    const uniqueUrls = [...new Set(cleanUrls)];

    return {
        fullUrlsFound: uniqueUrls.slice(0, 5),
        hasFullUrls: uniqueUrls.length > 0,
        status: uniqueUrls.length > 0 ? "success" : "warning",
        message: uniqueUrls.length > 0
            ? "Full URLs detected, ensuring proper ATS recognition."
            : "Consider adding full URLs (https://...) for better ATS compatibility.",
    };
}
