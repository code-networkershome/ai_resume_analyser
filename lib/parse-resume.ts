import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export interface ParsingInsights {
    fileName: string;
    fileType: "pdf" | "docx" | "other";
    multiColumnDetected: boolean;
    tablesDetected: boolean;
    iconsOrImagesDetected: boolean;
    headerFooterRisk: boolean;
    nonStandardBulletSymbols: string[];
    nonStandardDateFormats: string[];
    sectionHeadersRecognized: boolean;
    atsParseFailureRiskScore: number; // 0-100 (higher = more risk)
}

function detectStructureFromText(text: string): Omit<ParsingInsights, "fileName" | "fileType"> {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

    let multiColumnDetected = false;
    let tablesDetected = false;
    let iconsOrImagesDetected = false;
    let headerFooterRisk = false;
    const nonStandardBulletSymbols: string[] = [];
    const nonStandardDateFormats: string[] = [];

    const sectionHeaderPatterns = [
        /^(experience|work experience|professional experience)\b/i,
        /^(skills|technical skills|technologies)\b/i,
        /^(education|academic)\b/i,
        /^(projects|personal projects|academic projects)\b/i,
        /^(summary|profile|objective|about)\b/i,
    ];

    let recognizedHeaders = 0;

    const nonStandardBulletRegex = /^[^\w\s\d\-•*●▪◦○□■]/;
    const dateRegex = /\b\d{1,2}[-/]\d{1,2}[-/]\d{2}\b/; // e.g. 01-02-24
    const isoLikeRegex = /\b\d{4}-\d{2}-\d{2}\b/;

    lines.forEach((line, index) => {
        // Very rough multi-column heuristic: many lines with multiple groups of 3+ spaces
        const multiSpaceGroups = (line.match(/\s{3,}/g) || []).length;
        if (multiSpaceGroups >= 2) {
            multiColumnDetected = true;
        }

        // Table-like patterns: repeated separators
        if (/(\||\t|,{2,})/.test(line)) {
            tablesDetected = true;
        }

        // Icon/image placeholders
        if (/[■□▪●○◇◆▶️⭐★✓✔✗✘]/.test(line)) {
            iconsOrImagesDetected = true;
        }

        // Header/footer risk: same short line repeated at top/bottom
        if (index < 3 || index > lines.length - 4) {
            if (line.length < 40 && /page \d+|confidential|resume|curriculum vitae/i.test(line)) {
                headerFooterRisk = true;
            }
        }

        // Non-standard bullets
        const firstChar = line[0];
        if (nonStandardBulletRegex.test(firstChar)) {
            if (!nonStandardBulletSymbols.includes(firstChar)) {
                nonStandardBulletSymbols.push(firstChar);
            }
        }

        // Non-standard short date formats
        if (dateRegex.test(line) && !isoLikeRegex.test(line)) {
            nonStandardDateFormats.push(line);
        }

        if (sectionHeaderPatterns.some((re) => re.test(line))) {
            recognizedHeaders++;
        }
    });

    const sectionHeadersRecognized = recognizedHeaders >= 2;

    // Simple risk scoring
    let atsParseFailureRiskScore = 0;
    if (multiColumnDetected) atsParseFailureRiskScore += 25;
    if (tablesDetected) atsParseFailureRiskScore += 20;
    if (iconsOrImagesDetected) atsParseFailureRiskScore += 10;
    if (headerFooterRisk) atsParseFailureRiskScore += 15;
    if (nonStandardBulletSymbols.length > 0) atsParseFailureRiskScore += 10;
    if (nonStandardDateFormats.length > 0) atsParseFailureRiskScore += 10;
    if (!sectionHeadersRecognized) atsParseFailureRiskScore += 10;

    atsParseFailureRiskScore = Math.min(100, atsParseFailureRiskScore);

    return {
        multiColumnDetected,
        tablesDetected,
        iconsOrImagesDetected,
        headerFooterRisk,
        nonStandardBulletSymbols,
        nonStandardDateFormats,
        sectionHeadersRecognized,
        atsParseFailureRiskScore,
    };
}

export async function extractResumeFromFile(file: File): Promise<{
    text: string;
    insights: ParsingInsights;
}> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileName = file.name || "resume";
    const lowerName = fileName.toLowerCase();

    let fileType: ParsingInsights["fileType"] = "other";
    let text = "";

    if (lowerName.endsWith(".pdf")) {
        fileType = "pdf";
        const result = await pdfParse(buffer);
        text = result.text || "";
    } else if (lowerName.endsWith(".docx")) {
        fileType = "docx";
        const result = await mammoth.extractRawText({ buffer });
        text = result.value || "";
    } else {
        // Fallback: try to interpret as UTF-8 text
        text = buffer.toString("utf-8");
    }

    const structure = detectStructureFromText(text);

    return {
        text,
        insights: {
            fileName,
            fileType,
            ...structure,
        },
    };
}

