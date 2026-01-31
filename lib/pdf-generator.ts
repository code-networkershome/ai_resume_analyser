import { logToDebug } from "./logger";
import { UniversalResumeAnalysis } from "./types/universal-types";

// Dynamic import to handle potential module loading issues
let Api2Pdf: any = null;
let a2p: any = null;

try {
  Api2Pdf = require("api2pdf").default;
  if (Api2Pdf && process.env.API2PDF_KEY) {
    a2p = new Api2Pdf(process.env.API2PDF_KEY);
    logToDebug("✅ Api2Pdf initialized successfully");
  } else {
    logToDebug("⚠️ Api2Pdf not available - missing API2PDF_KEY");
  }
} catch (error: any) {
  logToDebug("❌ Failed to load Api2Pdf:", error.message);
  logToDebug("⚠️ PDF generation will be skipped");
}

export async function generateReportPDF(analysis: UniversalResumeAnalysis, targetRole: string): Promise<Buffer> {
    logToDebug(`[pdf-generator] 🚀 RESTORING 1:1 MIRROR PDF (18+ SECTIONS) FOR ${targetRole}...`);

    // Check if Api2Pdf is available
    if (!a2p) {
        logToDebug("❌ Api2Pdf not available - cannot generate PDF");
        throw new Error("PDF generation service not available");
    }

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
        <style>
            :root {
                --accent-blue: #3b82f6;
                --slate-900: #0f172a;
                --slate-700: #334155;
                --slate-600: #475569;
                --slate-500: #64748b;
                --slate-400: #94a3b8;
                --slate-100: #f1f5f9;
                --slate-50: #f8fafc;
                --emerald-500: #10b981;
                --amber-500: #f59e0b;
                --red-500: #ef4444;
            }
            
            * { margin: 0; padding: 0; box-sizing: border-box; -webkit-print-color-adjust: exact !important; }
            body { 
                font-family: 'Inter', sans-serif; 
                background: white; 
                color: var(--slate-900); 
                line-height: 1.5;
                padding: 40px;
            }

            @page { margin: 0; size: A4; }
            
            .section { margin-bottom: 32px; break-inside: avoid; }
            
            .premium-card {
                background: white;
                border: 1px solid #e2e8f0;
                border-radius: 20px;
                padding: 24px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            }

            .gradient-header {
                background: var(--slate-900);
                color: white;
                padding: 48px;
                border-radius: 40px;
                margin-bottom: 40px;
                position: relative;
                overflow: hidden;
            }

            .section-header {
                display: flex;
                align-items: center;
                gap: 16px;
                margin-bottom: 20px;
            }

            .icon-box {
                width: 44px;
                height: 44px;
                background: var(--slate-100);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--accent-blue);
                font-size: 20px;
                flex-shrink: 0;
            }

            .title-main { font-size: 24px; font-weight: 800; color: var(--slate-900); }
            .subtitle { font-size: 13px; color: var(--slate-500); font-weight: 500; }

            .badge {
                display: inline-flex;
                align-items: center;
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 10px;
                font-weight: 800;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                background: var(--slate-100);
                color: var(--slate-600);
            }

            .progress-bar {
                height: 8px;
                background: var(--slate-100);
                border-radius: 4px;
                overflow: hidden;
                margin: 8px 0;
            }

            .progress-fill {
                height: 100%;
                background: var(--accent-blue);
                border-radius: 4px;
            }

            .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
            .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }

            .score-circle {
                width: 120px;
                height: 120px;
                border-radius: 60px;
                border: 8px solid var(--slate-100);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: white;
            }

            .metric-card {
                padding: 16px;
                background: var(--slate-50);
                border-radius: 16px;
                border: 1px solid var(--slate-100);
            }

            .text-sm { font-size: 12px; color: var(--slate-500); }
            .text-md { font-size: 14px; color: var(--slate-600); }
            .font-bold { font-weight: 700; }
            .font-black { font-weight: 900; }

            .check-item {
                display: flex;
                gap: 10px;
                margin-bottom: 8px;
                font-size: 13px;
                color: var(--slate-700);
            }

            .bullet-point {
                padding: 16px;
                background: var(--slate-50);
                border-radius: 14px;
                border-left: 4px solid var(--accent-blue);
                margin-bottom: 12px;
            }
        </style>
    </head>
    <body>
        <!-- HEADER -->
        <div class="gradient-header">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="display: flex; gap: 8px; margin-bottom: 16px;">
                        <span class="badge" style="background: rgba(255,255,255,0.1); color: white;">${analysis.seniorityAnalysis?.inferredLevel || "PROFESSIONAL"}</span>
                        <span class="badge" style="background: #3b82f6; color: white;">${targetRole}</span>
                    </div>
                    <h1 style="font-size: 48px; font-weight: 900; line-height: 1;">Analysis <span style="color: #60a5fa;">Report</span></h1>
                    <p style="margin-top: 12px; opacity: 0.8; font-weight: 500;">Professional audit and optimization roadmap for your career profile.</p>
                </div>
                <div class="score-circle">
                    <span style="font-size: 40px; font-weight: 900; color: var(--slate-900); line-height: 1;">${analysis.scores?.composite?.value || 0}</span>
                    <span style="font-size: 14px; font-weight: 700; color: var(--slate-400);">/100</span>
                </div>
            </div>
        </div>

        <!-- 1. Executive Summary -->
        <div class="section">
            <div class="section-header">
                <div class="icon-box">🧠</div>
                <div>
                    <div class="title-main">Executive Summary</div>
                    <div class="subtitle">AI-powered analysis verdict</div>
                </div>
            </div>
            <div class="premium-card" style="border-left: 6px solid var(--accent-blue);">
                <p style="font-size: 18px; font-weight: 600; color: var(--slate-700); font-style: italic;">
                    "${analysis.verdict?.summary || "No summary available"}"
                </p>
            </div>
        </div>

        <!-- 2. Performance Metrics -->
        <div class="section">
            <div class="section-header">
                <div class="icon-box">📈</div>
                <div>
                    <div class="title-main">Performance Metrics</div>
                    <div class="subtitle">Detailed audit breakdown</div>
                </div>
            </div>
            <div class="premium-card">
                <div class="grid">
                    ${[
            { label: "ATS Compatibility", val: analysis.scores?.atsReadability?.value, tip: "Resume format and structure" },
            { label: "Role Alignment", val: analysis.scores?.roleAlignment?.value, tip: "Match with requirements" },
            { label: "Impact Evidence", val: analysis.scores?.evidenceStrength?.value, tip: "Quantifiable achievements" },
            { label: "Clarity Signaling", val: analysis.scores?.claritySignaling?.value, tip: "Messaging precision" }
        ].map(item => `
                        <div class="metric-card">
                            <div style="display: flex; justify-content: space-between; align-items: baseline;">
                                <span class="text-md font-bold">${item.label}</span>
                                <span class="font-black" style="color: var(--accent-blue); font-size: 18px;">${item.val}%</span>
                            </div>
                            <div class="progress-bar"><div class="progress-fill" style="width: ${item.val}%"></div></div>
                            <span class="text-sm">${item.tip}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>

        <!-- 3. ATS Essentials (Enhancv) -->
        ${analysis.enhancvChecks ? `
        <div class="section">
            <div class="section-header">
                <div class="icon-box">🛡️</div>
                <div>
                    <div class="title-main">ATS Essentials</div>
                    <div class="subtitle">Resume compatibility checks</div>
                </div>
            </div>
            <div class="grid-3">
                <div class="premium-card" style="padding: 20px;">
                    <div class="text-sm font-bold">ATS Parse Rate</div>
                    <div style="font-size: 24px; font-weight: 900; margin: 8px 0;">${analysis.enhancvChecks.atsParseRate.percentage}%</div>
                    <div class="text-sm">✓ ${analysis.enhancvChecks.atsParseRate.message}</div>
                </div>
                <div class="premium-card" style="padding: 20px;">
                    <div class="text-sm font-bold">Quantified Bullets</div>
                    <div style="font-size: 24px; font-weight: 900; margin: 8px 0;">${analysis.enhancvChecks.quantifyImpact.bulletsWithMetrics}/${analysis.enhancvChecks.quantifyImpact.totalBullets}</div>
                    <div class="text-sm">Metrics found in bullets</div>
                </div>
                <div class="premium-card" style="padding: 20px;">
                    <div class="text-sm font-bold">Word Variety</div>
                    <div style="font-size: 14px; font-weight: 700; margin: 8px 0; color: ${analysis.enhancvChecks.repetition.status === 'success' ? 'var(--emerald-500)' : 'var(--amber-500)'}">
                        ${analysis.enhancvChecks.repetition.message}
                    </div>
                    <div class="text-sm">Repetition audit</div>
                </div>
            </div>
        </div>
        ` : ''}

        <!-- 4. Keyword Analysis -->
        ${analysis.keywordAnalysis ? `
        <div class="section">
            <div class="section-header">
                <div class="icon-box">📊</div>
                <div>
                    <div class="title-main">Keyword Density</div>
                    <div class="subtitle">Role keyword match relevance: ${analysis.keywordAnalysis.roleRelevanceScore}%</div>
                </div>
            </div>
            <div class="premium-card">
                <p class="text-md" style="margin-bottom: 16px;">${analysis.keywordAnalysis.explanation}</p>
                <div class="grid">
                    ${analysis.keywordAnalysis.topKeywords.slice(0, 4).map(kw => `
                        <div class="metric-card">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span class="font-bold"># ${kw.word}</span>
                                <span class="badge">${kw.totalCount}x</span>
                            </div>
                            <p style="font-size: 11px; color: var(--slate-500); margin-top: 4px;">${(kw.explanation || "").split('.')[0]}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        ` : ''}

        <!-- 5. Career Path Projection -->
        ${analysis.careerPath ? `
        <div class="section">
            <div class="section-header">
                <div class="icon-box">🗺️</div>
                <div>
                    <div class="title-main">Career Projection</div>
                    <div class="subtitle">AI-predicted trajectory</div>
                </div>
            </div>
            <div class="premium-card">
                <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px dashed #e2e8f0;">
                    <span class="text-sm font-bold uppercase" style="color: var(--accent-blue);">Current Status</span>
                    <div class="title-main" style="font-size: 20px;">${analysis.careerPath.currentLevel}</div>
                    <p class="text-md" style="margin-top: 4px;">${analysis.careerPath.currentLevelExplanation}</p>
                </div>
                <div class="grid">
                    ${analysis.careerPath.projectedRoles.slice(0, 2).map(role => `
                        <div class="metric-card" style="border-top: 4px solid var(--accent-blue);">
                            <div style="display: flex; justify-content: space-between;">
                                <span class="font-bold">${role.role}</span>
                                <span class="font-black" style="color: var(--accent-blue);">${role.readiness}%</span>
                            </div>
                            <div class="text-sm">${role.timeframe}</div>
                            <p style="font-size: 11px; margin-top: 8px;">${(role.explanation || "").split('.')[0]}.</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        ` : ''}

        <!-- 6. Hidden Skills & Network -->
        <div class="grid" style="grid-template-columns: 1.2fr 0.8fr;">
            <!-- Hidden Skills -->
            ${analysis.hiddenSkills ? `
            <div class="section">
                <div class="section-header">
                    <div class="icon-box">👁️</div>
                    <div>
                        <div class="title-main">Hidden Skills</div>
                        <div class="subtitle">Contextually inferred</div>
                    </div>
                </div>
                <div class="premium-card">
                    ${analysis.hiddenSkills.skills.slice(0, 3).map(sk => `
                        <div class="check-item" style="margin-bottom: 12px;">
                            <div style="color: var(--emerald-500);">✦</div>
                            <div>
                                <div class="font-bold">${sk.skill} (${sk.confidence}%)</div>
                                <div class="text-sm">${(sk.explanation || "").split('.')[0]}.</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}

            <!-- Tone Analysis -->
            ${analysis.toneAnalysis ? `
            <div class="section">
                <div class="section-header">
                    <div class="icon-box">🎙️</div>
                    <div>
                        <div class="title-main">Tone Analysis</div>
                        <div class="subtitle">Score: ${analysis.toneAnalysis.score}/100</div>
                    </div>
                </div>
                <div class="premium-card">
                    <div class="title-main" style="font-size: 18px; color: var(--accent-blue);">${analysis.toneAnalysis.overallTone}</div>
                    <p class="text-sm" style="margin: 8px 0;">${(analysis.toneAnalysis.overallExplanation || "").split('.')[0]}.</p>
                    <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                        <span class="badge">Confidence: ${analysis.toneAnalysis.dimensions.confidence.score}</span>
                        <span class="badge">Action: ${analysis.toneAnalysis.dimensions.actionOrientation.score}</span>
                    </div>
                </div>
            </div>
            ` : ''}
        </div>

        <!-- 7. Learning Roadmap -->
        ${analysis.learningRoadmap ? `
        <div class="section">
            <div class="section-header">
                <div class="icon-box">🎓</div>
                <div>
                    <div class="title-main">Skills Gap Roadmap</div>
                    <div class="subtitle">Personalized learning path (${analysis.learningRoadmap.estimatedTime})</div>
                </div>
            </div>
            <div class="premium-card">
                <div class="grid">
                    ${analysis.learningRoadmap.gaps.slice(0, 4).map(gap => `
                        <div class="metric-card">
                            <div style="display: flex; justify-content: space-between;">
                                <span class="font-bold">${gap.skill}</span>
                                <span class="badge" style="background: ${gap.priority === 'critical' ? '#fee2e2' : '#f1f5f9'}; color: ${gap.priority === 'critical' ? '#b91c1c' : '#475569'};">${gap.priority}</span>
                            </div>
                            <div class="text-sm" style="margin: 4px 0;">${gap.currentLevel} → ${gap.targetLevel}</div>
                            <p style="font-size: 11px; margin-top: 4px;">${(gap.explanation || "").split('.')[0]}.</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        ` : ''}

        <!-- 8. High-Impact Fixes -->
        <div class="section">
            <div class="section-header">
                <div class="icon-box">✨</div>
                <div>
                    <div class="title-main">Optimization Roadmap</div>
                    <div class="subtitle">AI-prioritized action items</div>
                </div>
            </div>
            <div class="premium-card">
                <div class="grid">
                    ${analysis.roadmap.slice(0, 6).map((fix, i) => `
                        <div class="check-item">
                            <div style="width: 24px; height: 24px; background: var(--slate-100); border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 900; color: var(--accent-blue); font-size: 12px; flex-shrink: 0;">${i + 1}</div>
                            <div class="text-md font-bold">${fix.action}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>

        <div style="text-align: center; margin-top: 40px; color: var(--slate-400); font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;">
            End of Intelligence Report • Generated by AI Resume Analyser
        </div>
    </body>
    </html>
    `;

    try {
        const options = {
            fileName: `Resume_Report_${targetRole.replace(/\s+/g, '_')}.pdf`,
            inline: true
        };
        const result: any = await a2p.chromeHtmlToPdf(html, options);
        if (!result.Success) {
            throw new Error(`Api2Pdf Error: ${JSON.stringify(result)}`);
        }
        const response = await fetch(result.FileUrl);
        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
    } catch (error: any) {
        logToDebug(`[pdf-generator] ❌ CRITICAL PDF ERROR: ${error.message}`);
        // Return a basic buffer or throw
        throw error;
    }
}
