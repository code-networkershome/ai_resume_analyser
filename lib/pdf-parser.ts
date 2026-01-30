/**
 * ===========================================
 * PDF PARSER - Structured PDF Extraction with pdfjs-dist
 * ===========================================
 * 
 * This module extracts structured data from PDFs including:
 * - Text with coordinates (for layout analysis)
 * - Link annotations (real URLs for LinkedIn/GitHub)
 * - Section detection
 * - Bullet extraction
 * 
 * CRITICAL: This is the foundation of accurate parsing.
 * PDF annotations are the highest confidence source (0.90-0.99).
 */

import path from "path";
import { pathToFileURL } from "url";
import * as pdfjsLib from "pdfjs-dist";

// Polyfill for Promise.withResolvers (Required for pdfjs-dist v4+ in Node < 22)
if (typeof Promise.withResolvers === "undefined") {
    if (typeof window === "undefined") {
        // @ts-ignore
        Promise.withResolvers = function () {
            let resolve, reject;
            const promise = new Promise((res, rej) => {
                resolve = res;
                reject = rej;
            });
            return { promise, resolve, reject };
        };
    }
}
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
    CONFIDENCE_LEVELS,
} from "./document-model";
import { ACTION_VERBS } from "./constants";

// Configure worker for Node.js environment
// In Next.js API routes, we need to handle this carefully
if (typeof window === "undefined") {
    // Server-side: Configure worker for Node.js
    // Convert Windows path to file:// URL for ESM loader
    const workerPath = path.join(process.cwd(), "node_modules/pdfjs-dist/build/pdf.worker.min.mjs");
    pdfjsLib.GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).href;
}

// ===========================================
// SECTION PATTERNS
// ===========================================

const SECTION_PATTERNS: Array<{ type: SectionType; patterns: RegExp[] }> = [
    {
        type: "experience",
        patterns: [
            /^(work\s+)?experience$/i,
            /^professional\s+experience$/i,
            /^employment(\s+history)?$/i,
            /^work\s+history$/i,
            /^career\s+history$/i,
        ],
    },
    {
        type: "education",
        patterns: [
            /^education$/i,
            /^academic(\s+background)?$/i,
            /^qualifications$/i,
            /^degrees?$/i,
            /^scholastic$/i,
        ],
    },
    {
        type: "skills",
        patterns: [
            /^(technical\s+)?skills$/i,
            /^technologies$/i,
            /^competenc(ies|e)$/i,
            /^expertise$/i,
            /^tools(\s+&\s+technologies)?$/i,
            /^tech\s+stack$/i,
        ],
    },
    {
        type: "projects",
        patterns: [
            /^projects?$/i,
            /^(personal|academic|side)\s+projects?$/i,
            /^portfolio$/i,
            /^course\s+projects?$/i,
        ],
    },
    {
        type: "summary",
        patterns: [
            /^(professional\s+)?summary$/i,
            /^profile$/i,
            /^objective$/i,
            /^about(\s+me)?$/i,
            /^overview$/i,
        ],
    },
    {
        type: "certifications",
        patterns: [
            /^certifications?$/i,
            /^certificates?$/i,
            /^credentials?$/i,
            /^licenses?$/i,
            /^training$/i,
        ],
    },
    {
        type: "achievements",
        patterns: [
            /^achievements?$/i,
            /^awards?$/i,
            /^honors?$/i,
            /^accomplishments?$/i,
            /^recognitions?$/i,
        ],
    },
    {
        type: "coursework",
        patterns: [
            /^(relevant\s+)?coursework$/i,
            /^courses?$/i,
            /^subjects?$/i,
            /^academic\s+details$/i,
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
    /\d+%/,                                          // percentages
    /\$[\d,]+[KMB]?/i,                               // dollar amounts
    /\d+x\b/,                                        // multipliers
    /\d+\+?\s*(users?|customers?|clients?)/i,        // user counts
    /\d+\+?\s*(projects?|applications?|systems?)/i,  // project counts
    /\d+\+?\s*(team|members?|people|engineers?)/i,   // team size
    /\d+\+?\s*(hours?|days?|weeks?|months?)/i,       // time savings
    /\d+\+?\s*(servers?|instances?|nodes?)/i,        // infrastructure
    /\d+\s*(ms|seconds?|minutes?)/i,                 // performance
    /\d+\s*(gb|tb|mb|kb)/i,                          // data volumes
    /reduced\s+.*\s+by\s+\d+/i,                      // reduction
    /increased\s+.*\s+by\s+\d+/i,                    // increase
    /improved\s+.*\s+by\s+\d+/i,                     // improvement
];

// ===========================================
// MAIN PDF PARSER
// ===========================================

export async function parsePDF(buffer: Buffer, fileName: string): Promise<DocumentModel> {
    const uint8Array = new Uint8Array(buffer);
    const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
    const pdfDoc = await loadingTask.promise;
    const numPages = pdfDoc.numPages;

    const textItems: TextItem[] = [];
    const links: Link[] = [];
    const emails: Email[] = [];
    const phones: Phone[] = [];
    let fullText = "";

    // Extract from each page
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);

        // Extract text with positions
        const textContent = await page.getTextContent();
        const pageText: string[] = [];

        for (const item of textContent.items) {
            if ("str" in item && item.str.trim()) {
                const transform = item.transform;
                textItems.push({
                    text: item.str,
                    x: transform[4],
                    y: transform[5],
                    width: item.width || 0,
                    height: item.height || Math.abs(transform[0]),
                    fontSize: Math.abs(transform[0]),
                    fontName: item.fontName || "",
                    page: pageNum,
                });
                pageText.push(item.str);
            }
        }

        fullText += pageText.join(" ") + "\n";

        // Extract link annotations (HIGHEST CONFIDENCE SOURCE)
        try {
            const annotations = await page.getAnnotations();
            for (const annot of annotations) {
                if (annot.subtype === "Link" && annot.url) {
                    const link = classifyLink(annot.url, "", pageNum, "pdf_annotation");
                    links.push(link);

                    // Also extract emails from mailto: links
                    if (annot.url.startsWith("mailto:")) {
                        const email = annot.url.replace("mailto:", "").split("?")[0];
                        if (isValidEmail(email)) {
                            emails.push({
                                address: email,
                                page: pageNum,
                                confidence: 0.95,
                                source: "pdf_annotation",
                            });
                        }
                    }
                }
            }
        } catch (e) {
            // Some PDFs may not have annotations - continue without them
            console.warn(`Could not extract annotations from page ${pageNum}:`, e);
        }
    }

    // Extract emails and phones from text (lower confidence than annotations)
    const textEmails = extractEmailsFromText(fullText);
    const textPhones = extractPhonesFromText(fullText);

    // Merge, preferring annotation sources
    for (const email of textEmails) {
        if (!emails.some(e => e.address === email.address)) {
            emails.push(email);
        }
    }
    for (const phone of textPhones) {
        if (!phones.some(p => p.normalized === phone.normalized)) {
            phones.push(phone);
        }
    }

    // Extract links from text (lower confidence than annotations)
    const textLinks = extractLinksFromText(fullText);
    for (const link of textLinks) {
        // Only add if not already found via annotation
        if (!links.some(l => l.type === link.type && l.url === link.url)) {
            links.push(link);
        }
    }

    // Detect layout characteristics
    const multiColumnDetected = detectMultiColumn(textItems);
    const tablesDetected = detectTablesStructural(textItems);
    const iconsOrImagesDetected = detectIcons(fullText);
    const headerFooterRisk = detectHeaderFooter(textItems, numPages);

    // Build sections
    const sections = buildSections(textItems, fullText);

    // Extract all bullets
    const bullets = extractBullets(sections, fullText);

    // Extract skills
    const skills = extractSkills(sections, fullText);

    // Detect language
    const detectedLanguage = detectLanguage(fullText);

    // Calculate layout confidence
    const layoutConfidence = calculateLayoutConfidence({
        multiColumnDetected,
        tablesDetected,
        hasAnnotations: links.some(l => l.source === "pdf_annotation"),
        sectionConfidence: sections.reduce((acc, s) => acc + s.confidence, 0) / Math.max(sections.length, 1),
    });

    const metadata: DocumentMetadata = {
        sourceType: "pdf",
        fileName,
        pageCount: numPages,
        wordCount: countWords(fullText),
        layoutConfidence,
        multiColumnDetected,
        tablesDetected,
        iconsOrImagesDetected,
        headerFooterRisk,
        detectedLanguage,
        parseTimestamp: new Date().toISOString(),
    };

    return {
        metadata,
        textItems,
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
// LINK CLASSIFICATION
// ===========================================

function classifyLink(
    url: string,
    visibleText: string,
    page: number,
    source: Link["source"]
): Link {
    const lowerUrl = url.toLowerCase();
    let type: Link["type"] = "other";

    if (lowerUrl.includes("linkedin.com")) {
        type = "linkedin";
    } else if (lowerUrl.includes("github.com")) {
        type = "github";
    } else if (lowerUrl.startsWith("mailto:")) {
        type = "email";
    } else if (lowerUrl.startsWith("tel:")) {
        type = "phone";
    } else if (/\.(com|io|dev|me|org|net|co)/.test(lowerUrl)) {
        type = "portfolio";
    }

    // Confidence based on source (monotonic ordering)
    let confidence: number;
    switch (source) {
        case "pdf_annotation":
        case "docx_relationship":
            confidence = 0.95;
            break;
        case "text_pattern":
            confidence = 0.85;
            break;
        case "label_only":
            confidence = 0.45;
            break;
        case "heuristic":
        default:
            confidence = 0.30;
    }

    return {
        type,
        url: url.startsWith("mailto:") || url.startsWith("tel:") ? null : url,
        visibleText: visibleText || url,
        page,
        confidence,
        status: "valid",
        source,
    };
}

// ===========================================
// TEXT-BASED EXTRACTION (Lower Confidence)
// ===========================================

function extractLinksFromText(text: string): Link[] {
    const links: Link[] = [];

    // LinkedIn URL pattern
    const linkedinPattern = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+\/?/gi;
    const linkedinMatches = text.match(linkedinPattern) || [];
    for (const match of linkedinMatches) {
        links.push({
            type: "linkedin",
            url: match.startsWith("http") ? match : `https://${match}`,
            visibleText: match,
            page: 1, // Can't determine page from text
            confidence: 0.85,
            status: "valid",
            source: "text_pattern",
        });
    }

    // Check for LinkedIn label without URL
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

    // GitHub URL pattern
    const githubPattern = /(?:https?:\/\/)?(?:www\.)?github\.com\/[\w-]+\/?/gi;
    const githubMatches = text.match(githubPattern) || [];
    for (const match of githubMatches) {
        links.push({
            type: "github",
            url: match.startsWith("http") ? match : `https://${match}`,
            visibleText: match,
            page: 1,
            confidence: 0.85,
            status: "valid",
            source: "text_pattern",
        });
    }

    // Check for GitHub label without URL
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
            confidence: 0.85,
            source: "text_pattern" as const,
        }));
}

function extractPhonesFromText(text: string): Phone[] {
    // Various phone number patterns
    const phonePatterns = [
        /\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
        /\(\d{3}\)\s*\d{3}[-.\s]?\d{4}/g,
        /\d{10}/g,
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
                    confidence: 0.80,
                    source: "text_pattern",
                });
            }
        }
    }

    return phones;
}

// ===========================================
// LAYOUT DETECTION
// ===========================================

function detectMultiColumn(textItems: TextItem[]): boolean {
    if (textItems.length < 20) return false;

    // Group text items by Y position (same line)
    const lineGroups = new Map<number, TextItem[]>();
    for (const item of textItems) {
        const yBucket = Math.round(item.y / 10) * 10; // Group by 10px
        if (!lineGroups.has(yBucket)) {
            lineGroups.set(yBucket, []);
        }
        lineGroups.get(yBucket)!.push(item);
    }

    // Check for lines with large horizontal gaps (columns)
    let multiColumnLines = 0;
    for (const [, items] of lineGroups) {
        if (items.length < 2) continue;

        // Sort by X position
        items.sort((a, b) => a.x - b.x);

        for (let i = 1; i < items.length; i++) {
            const gap = items[i].x - (items[i - 1].x + items[i - 1].width);
            if (gap > 100) { // Large gap suggests columns
                multiColumnLines++;
                break;
            }
        }
    }

    // If more than 20% of lines have column gaps, consider it multi-column
    return multiColumnLines > lineGroups.size * 0.2;
}

function detectTablesStructural(textItems: TextItem[]): boolean {
    // ONLY detect tables from grid-like text alignment
    // NEVER from pipes, spacing, or separators (per mandatory correction)

    if (textItems.length < 20) return false;

    // Look for grid-like patterns: multiple X positions repeated across Y positions
    const xPositions = new Map<number, number>();
    for (const item of textItems) {
        const xBucket = Math.round(item.x / 5) * 5;
        xPositions.set(xBucket, (xPositions.get(xBucket) || 0) + 1);
    }

    // Count X positions that appear many times (column alignment)
    const commonXPositions = [...xPositions.values()].filter(count => count > 5).length;

    // If we have 3+ common X positions, likely a table
    return commonXPositions >= 3;
}

function detectIcons(text: string): boolean {
    // Check for icon placeholders and special characters
    const iconPattern = /[■□▪●○◇◆▶️⭐★✓✔✗✘📧📞💼🎓]/;
    return iconPattern.test(text);
}

function detectHeaderFooter(textItems: TextItem[], pageCount: number): boolean {
    if (textItems.length === 0) return false;

    // Find Y boundaries
    const yValues = textItems.map(t => t.y);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    const range = maxY - minY;

    // Check text near top and bottom
    const topItems = textItems.filter(t => t.y < minY + range * 0.1);
    const bottomItems = textItems.filter(t => t.y > maxY - range * 0.1);

    const headerFooterPatterns = /page\s+\d+|confidential|resume|curriculum\s+vitae/i;

    const topText = topItems.map(t => t.text).join(" ");
    const bottomText = bottomItems.map(t => t.text).join(" ");

    return headerFooterPatterns.test(topText) || headerFooterPatterns.test(bottomText);
}

// ===========================================
// SECTION BUILDING
// ===========================================

function buildSections(textItems: TextItem[], fullText: string): Section[] {
    const sections: Section[] = [];
    const lines = fullText.split(/\r?\n/).filter(l => l.trim());

    let currentSection: Section | null = null;
    let currentContent: string[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const sectionMatch = matchSectionHeader(line);

        if (sectionMatch) {
            // Save previous section
            if (currentSection) {
                currentSection.rawContent = currentContent.join("\n");
                sections.push(currentSection);
            }

            // Start new section
            currentSection = {
                name: line,
                type: sectionMatch,
                startPage: 1, // Would need textItems correlation for accuracy
                endPage: 1,
                bullets: [],
                rawContent: "",
                confidence: 0.85,
                startY: 0,
            };
            currentContent = [];
        } else if (currentSection) {
            currentContent.push(line);
        }
    }

    // Save last section
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

function extractBullets(sections: Section[], fullText: string): Bullet[] {
    const allBullets: Bullet[] = [];
    const actionVerbsSet = new Set(ACTION_VERBS.map(v => v.toLowerCase()));

    for (const section of sections) {
        const lines = section.rawContent.split(/\r?\n/);

        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.length < 15) continue; // Too short to be meaningful

            const isBullet = BULLET_MARKERS.test(trimmed) ||
                NUMBERED_LIST.test(trimmed) ||
                LETTERED_LIST.test(trimmed);

            if (isBullet) {
                // Clean the bullet text
                const cleanText = trimmed
                    .replace(BULLET_MARKERS, "")
                    .replace(NUMBERED_LIST, "")
                    .replace(LETTERED_LIST, "")
                    .trim();

                if (cleanText.length < 10) continue;

                // Check for action verb
                const firstWord = cleanText.split(/\s+/)[0]?.toLowerCase() || "";
                const startsWithActionVerb = actionVerbsSet.has(firstWord);

                // Check for metrics
                const hasMetric = METRIC_PATTERNS.some(p => p.test(cleanText));
                const metricValues = extractMetricValues(cleanText);

                allBullets.push({
                    text: cleanText,
                    rawText: trimmed,
                    page: section.startPage,
                    sectionName: section.name,
                    confidence: 0.85,
                    startsWithActionVerb,
                    actionVerb: startsWithActionVerb ? firstWord : null,
                    actionVerbLemma: startsWithActionVerb ? getLemma(firstWord) : null,
                    hasMetric,
                    metricValues,
                    length: cleanText.length,
                });

                // Add bullet to section
                section.bullets.push(allBullets[allBullets.length - 1]);
            }
        }
    }

    return allBullets;
}

function extractMetricValues(text: string): string[] {
    const values: string[] = [];

    for (const pattern of METRIC_PATTERNS) {
        const matches = text.match(pattern);
        if (matches) {
            values.push(...matches);
        }
    }

    return [...new Set(values)]; // Dedupe
}

// ===========================================
// SKILL EXTRACTION
// ===========================================

function extractSkills(sections: Section[], fullText: string): Skill[] {
    const skills: Skill[] = [];

    // Find skills section
    const skillsSection = sections.find(s => s.type === "skills");
    if (skillsSection) {
        // Split by common delimiters
        const skillText = skillsSection.rawContent;
        const rawSkills = skillText.split(/[,;•\|\n]+/).map(s => s.trim()).filter(Boolean);

        for (const skillName of rawSkills) {
            if (skillName.length > 2 && skillName.length < 50) {
                skills.push({
                    name: skillName,
                    normalizedName: skillName.toLowerCase(),
                    category: categorizeSkill(skillName),
                    sourceSection: skillsSection.name,
                    confidence: 0.85,
                });
            }
        }
    }

    return skills;
}

function categorizeSkill(skill: string): Skill["category"] {
    const lower = skill.toLowerCase();

    // Common frameworks
    if (/react|vue|angular|next|express|django|flask|spring|rails/i.test(lower)) {
        return "framework";
    }

    // Platforms
    if (/aws|azure|gcp|kubernetes|docker|linux|windows/i.test(lower)) {
        return "platform";
    }

    // Languages
    if (/python|javascript|typescript|java|c\+\+|rust|go|ruby|php/i.test(lower)) {
        return "language";
    }

    // Tools
    if (/git|jira|jenkins|terraform|ansible|prometheus|grafana/i.test(lower)) {
        return "tool";
    }

    // Soft skills
    if (/communication|leadership|teamwork|problem.solving|agile/i.test(lower)) {
        return "soft";
    }

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
    // Simple lemmatization for common verb endings
    const lower = word.toLowerCase();

    if (lower.endsWith("ed")) return lower.slice(0, -2);
    if (lower.endsWith("ing")) return lower.slice(0, -3);
    if (lower.endsWith("s") && !lower.endsWith("ss")) return lower.slice(0, -1);

    return lower;
}

function detectLanguage(text: string): string {
    // Simple heuristic: check for common English words
    const englishMarkers = /\b(the|and|for|with|this|that|from|have|been|will|experience|skills|education|work)\b/gi;
    const matches = text.match(englishMarkers) || [];

    // If we find many English words, assume English
    const wordCount = countWords(text);
    const englishRatio = matches.length / Math.max(wordCount, 1);

    if (englishRatio > 0.05) return "en";
    return "unknown";
}

function calculateLayoutConfidence(params: {
    multiColumnDetected: boolean;
    tablesDetected: boolean;
    hasAnnotations: boolean;
    sectionConfidence: number;
}): number {
    let confidence = 0.85; // Base confidence for PDF

    if (params.hasAnnotations) confidence += 0.05;
    if (params.multiColumnDetected) confidence -= 0.15;
    if (params.tablesDetected) confidence -= 0.10;

    // Factor in section detection
    confidence = (confidence + params.sectionConfidence) / 2;

    return Math.max(0.3, Math.min(0.99, confidence));
}
