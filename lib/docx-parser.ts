/**
 * ===========================================
 * DOCX PARSER - Structured DOCX Extraction
 * ===========================================
 * 
 * This module extracts structured data from DOCX files.
 * 
 * IMPORTANT: DOCX parsing has LOWER confidence (0.6) than PDF
 * because mammoth's text extraction loses structural information.
 * 
 * Per mandatory correction: DOCX documents use layoutConfidence: 0.6
 */

import mammoth from "mammoth";
import type {
    DocumentModel,
    TextItem,
    Link,
    Email,
    Phone,
    Section,
    SectionType,
    Bullet,
    Skill,
    DocumentMetadata,
} from "./document-model";
import { ACTION_VERBS } from "./constants";

// ===========================================
// SECTION PATTERNS (shared with PDF parser)
// ===========================================

const SECTION_PATTERNS: Array<{ type: SectionType; patterns: RegExp[] }> = [
    {
        type: "experience",
        patterns: [
            /^(work\s+)?experience$/i,
            /^professional\s+experience$/i,
            /^employment(\s+history)?$/i,
            /^work\s+history$/i,
        ],
    },
    {
        type: "education",
        patterns: [
            /^education$/i,
            /^academic(\s+background)?$/i,
            /^qualifications$/i,
        ],
    },
    {
        type: "skills",
        patterns: [
            /^(technical\s+)?skills$/i,
            /^technologies$/i,
            /^competenc(ies|e)$/i,
        ],
    },
    {
        type: "projects",
        patterns: [
            /^projects?$/i,
            /^(personal|academic)\s+projects?$/i,
        ],
    },
    {
        type: "summary",
        patterns: [
            /^(professional\s+)?summary$/i,
            /^profile$/i,
            /^objective$/i,
        ],
    },
    {
        type: "certifications",
        patterns: [
            /^certifications?$/i,
            /^certificates?$/i,
        ],
    },
    {
        type: "achievements",
        patterns: [
            /^achievements?$/i,
            /^awards?$/i,
        ],
    },
    {
        type: "coursework",
        patterns: [
            /^(relevant\s+)?coursework$/i,
            /^courses?$/i,
        ],
    },
];

// ===========================================
// BULLET PATTERNS
// ===========================================

const BULLET_MARKERS = /^[\s]*[•\-\*●▪◦○□■➢➣➤►▶→]/;
const NUMBERED_LIST = /^[\s]*\d+[.)]\s+/;
const LETTERED_LIST = /^[\s]*[a-z][.)]\s+/i;

// ===========================================
// METRICS PATTERNS
// ===========================================

const METRIC_PATTERNS = [
    /\d+%/,
    /\$[\d,]+[KMB]?/i,
    /\d+x\b/,
    /\d+\+?\s*(users?|customers?|clients?)/i,
    /\d+\+?\s*(projects?|applications?|systems?)/i,
    /\d+\+?\s*(team|members?|people|engineers?)/i,
    /reduced\s+.*\s+by\s+\d+/i,
    /increased\s+.*\s+by\s+\d+/i,
];

// ===========================================
// MAIN DOCX PARSER
// ===========================================

export async function parseDOCX(buffer: Buffer, fileName: string): Promise<DocumentModel> {
    // Extract raw text using mammoth
    const result = await mammoth.extractRawText({ buffer });
    const fullText = result.value || "";

    // DOCX loses most structural information
    // Per mandatory correction: confidence is lowered to 0.6
    const textItems: TextItem[] = []; // Cannot extract positions from DOCX text fallback

    // Extract links from text (lower confidence)
    const links = extractLinksFromText(fullText);
    const emails = extractEmailsFromText(fullText);
    const phones = extractPhonesFromText(fullText);

    // Build sections from text
    const sections = buildSectionsFromText(fullText);

    // Extract bullets
    const bullets = extractBulletsFromSections(sections);

    // Extract skills
    const skills = extractSkillsFromSections(sections);

    // Detect language
    const detectedLanguage = detectLanguage(fullText);

    // DOCX has lower confidence due to text-only extraction
    const metadata: DocumentMetadata = {
        sourceType: "docx",
        fileName,
        pageCount: 1, // Cannot determine pages from text
        wordCount: countWords(fullText),
        layoutConfidence: 0.6, // LOWERED per mandatory correction
        multiColumnDetected: false, // Cannot detect from text
        tablesDetected: false, // Never detect from text per mandatory correction
        iconsOrImagesDetected: false,
        headerFooterRisk: false,
        detectedLanguage,
        parseTimestamp: new Date().toISOString(),
    };

    return {
        metadata,
        textItems, // Empty for DOCX
        sections,
        bullets,
        links,
        emails,
        phones,
        skills,
        rawText: fullText, // DEBUG ONLY
    };
}

// ===========================================
// LINK EXTRACTION
// ===========================================

function extractLinksFromText(text: string): Link[] {
    const links: Link[] = [];

    // LinkedIn
    const linkedinPattern = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+\/?/gi;
    const linkedinMatches = text.match(linkedinPattern) || [];
    for (const match of linkedinMatches) {
        links.push({
            type: "linkedin",
            url: match.startsWith("http") ? match : `https://${match}`,
            visibleText: match,
            page: 1,
            confidence: 0.80, // Lower than PDF annotation
            status: "valid",
            source: "text_pattern",
        });
    }

    if (linkedinMatches.length === 0 && /\blinkedin\b/i.test(text)) {
        links.push({
            type: "linkedin",
            url: null,
            visibleText: "LinkedIn",
            page: 1,
            confidence: 0.45,
            status: "label_only",
            source: "label_only",
        });
    }

    // GitHub
    const githubPattern = /(?:https?:\/\/)?(?:www\.)?github\.com\/[\w-]+\/?/gi;
    const githubMatches = text.match(githubPattern) || [];
    for (const match of githubMatches) {
        links.push({
            type: "github",
            url: match.startsWith("http") ? match : `https://${match}`,
            visibleText: match,
            page: 1,
            confidence: 0.80,
            status: "valid",
            source: "text_pattern",
        });
    }

    if (githubMatches.length === 0 && /\bgithub\b/i.test(text)) {
        links.push({
            type: "github",
            url: null,
            visibleText: "GitHub",
            page: 1,
            confidence: 0.45,
            status: "label_only",
            source: "label_only",
        });
    }

    return links;
}

function extractEmailsFromText(text: string): Email[] {
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const matches = text.match(emailPattern) || [];

    return matches
        .filter(isValidEmail)
        .map(address => ({
            address,
            page: 1,
            confidence: 0.80,
            source: "text_pattern" as const,
        }));
}

function extractPhonesFromText(text: string): Phone[] {
    const phonePatterns = [
        /\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
        /\(\d{3}\)\s*\d{3}[-.\s]?\d{4}/g,
    ];

    const phones: Phone[] = [];
    const seen = new Set<string>();

    for (const pattern of phonePatterns) {
        const matches = text.match(pattern) || [];
        for (const match of matches) {
            const normalized = normalizePhone(match);
            if (normalized && !seen.has(normalized)) {
                seen.add(normalized);
                phones.push({
                    number: match,
                    normalized,
                    page: 1,
                    confidence: 0.75,
                    source: "text_pattern",
                });
            }
        }
    }

    return phones;
}

// ===========================================
// SECTION BUILDING
// ===========================================

function buildSectionsFromText(fullText: string): Section[] {
    const sections: Section[] = [];
    const lines = fullText.split(/\r?\n/).filter(l => l.trim());

    let currentSection: Section | null = null;
    let currentContent: string[] = [];

    for (const line of lines) {
        const trimmed = line.trim();
        const sectionMatch = matchSectionHeader(trimmed);

        if (sectionMatch) {
            if (currentSection) {
                currentSection.rawContent = currentContent.join("\n");
                sections.push(currentSection);
            }

            currentSection = {
                name: trimmed,
                type: sectionMatch,
                startPage: 1,
                endPage: 1,
                bullets: [],
                rawContent: "",
                confidence: 0.75, // Lower than PDF
                startY: 0,
            };
            currentContent = [];
        } else if (currentSection) {
            currentContent.push(trimmed);
        }
    }

    if (currentSection) {
        currentSection.rawContent = currentContent.join("\n");
        sections.push(currentSection);
    }

    return sections;
}

function matchSectionHeader(line: string): SectionType | null {
    const cleanLine = line.replace(/[:\-–—]/g, "").trim();

    for (const { type, patterns } of SECTION_PATTERNS) {
        for (const pattern of patterns) {
            if (pattern.test(cleanLine)) {
                return type;
            }
        }
    }

    return null;
}

// ===========================================
// BULLET EXTRACTION
// ===========================================

function extractBulletsFromSections(sections: Section[]): Bullet[] {
    const allBullets: Bullet[] = [];
    const actionVerbsSet = new Set(ACTION_VERBS.map(v => v.toLowerCase()));

    for (const section of sections) {
        const lines = section.rawContent.split(/\r?\n/);

        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.length < 15) continue;

            const isBullet = BULLET_MARKERS.test(trimmed) ||
                NUMBERED_LIST.test(trimmed) ||
                LETTERED_LIST.test(trimmed);

            if (isBullet) {
                const cleanText = trimmed
                    .replace(BULLET_MARKERS, "")
                    .replace(NUMBERED_LIST, "")
                    .replace(LETTERED_LIST, "")
                    .trim();

                if (cleanText.length < 10) continue;

                const firstWord = cleanText.split(/\s+/)[0]?.toLowerCase() || "";
                const startsWithActionVerb = actionVerbsSet.has(firstWord);
                const hasMetric = METRIC_PATTERNS.some(p => p.test(cleanText));

                const bullet: Bullet = {
                    text: cleanText,
                    rawText: trimmed,
                    page: 1,
                    sectionName: section.name,
                    confidence: 0.75, // Lower for DOCX
                    startsWithActionVerb,
                    actionVerb: startsWithActionVerb ? firstWord : null,
                    actionVerbLemma: startsWithActionVerb ? getLemma(firstWord) : null,
                    hasMetric,
                    metricValues: extractMetricValues(cleanText),
                    length: cleanText.length,
                };

                allBullets.push(bullet);
                section.bullets.push(bullet);
            }
        }
    }

    return allBullets;
}

function extractMetricValues(text: string): string[] {
    const values: string[] = [];
    for (const pattern of METRIC_PATTERNS) {
        const matches = text.match(pattern);
        if (matches) values.push(...matches);
    }
    return [...new Set(values)];
}

// ===========================================
// SKILL EXTRACTION
// ===========================================

function extractSkillsFromSections(sections: Section[]): Skill[] {
    const skills: Skill[] = [];

    const skillsSection = sections.find(s => s.type === "skills");
    if (skillsSection) {
        const rawSkills = skillsSection.rawContent
            .split(/[,;•\|\n]+/)
            .map(s => s.trim())
            .filter(s => s.length > 2 && s.length < 50);

        for (const skillName of rawSkills) {
            skills.push({
                name: skillName,
                normalizedName: skillName.toLowerCase(),
                category: categorizeSkill(skillName),
                sourceSection: skillsSection.name,
                confidence: 0.75,
            });
        }
    }

    return skills;
}

function categorizeSkill(skill: string): Skill["category"] {
    const lower = skill.toLowerCase();

    if (/react|vue|angular|next|express|django|flask|spring/i.test(lower)) return "framework";
    if (/aws|azure|gcp|kubernetes|docker|linux/i.test(lower)) return "platform";
    if (/python|javascript|typescript|java|c\+\+|rust|go/i.test(lower)) return "language";
    if (/git|jira|jenkins|terraform|ansible/i.test(lower)) return "tool";
    if (/communication|leadership|teamwork/i.test(lower)) return "soft";

    return "technical";
}

// ===========================================
// HELPERS
// ===========================================

function isValidEmail(email: string): boolean {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

function normalizePhone(phone: string): string {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15) return "";
    return digits;
}

function countWords(text: string): number {
    return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

function getLemma(word: string): string {
    const lower = word.toLowerCase();
    if (lower.endsWith("ed")) return lower.slice(0, -2);
    if (lower.endsWith("ing")) return lower.slice(0, -3);
    if (lower.endsWith("s") && !lower.endsWith("ss")) return lower.slice(0, -1);
    return lower;
}

function detectLanguage(text: string): string {
    const englishMarkers = /\b(the|and|for|with|this|that|from|have|experience|skills|education|work)\b/gi;
    const matches = text.match(englishMarkers) || [];
    const wordCount = countWords(text);
    const ratio = matches.length / Math.max(wordCount, 1);

    return ratio > 0.05 ? "en" : "unknown";
}
