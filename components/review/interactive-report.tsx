"use client";

import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
} from "recharts";
import {
    AlertCircle,
    CheckCircle2,
    XCircle,
    Info,
    TrendingUp,
    AlertTriangle,
    Target,
    Zap,
    FileText,
    Brain,
    Lightbulb,
    ArrowRight,
    Download,
    Share2,
    Briefcase,
    Sparkles
} from "lucide-react";
import { cn, getScoreColor, getScoreBgColor, getScoreLabel } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface InteractiveReportProps {
    review: any;
}

export function InteractiveReport({ review }: InteractiveReportProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [appliedFixes, setAppliedFixes] = useState<Set<string>>(new Set());
    const [isGenerating, setIsGenerating] = useState<string | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    // Refs for each section
    const headerRef = useRef<HTMLDivElement>(null);
    const overviewRef = useRef<HTMLDivElement>(null);
    const analysisRef = useRef<HTMLDivElement>(null);
    const skillsRef = useRef<HTMLDivElement>(null);
    const formattingRef = useRef<HTMLDivElement>(null);
    const actionsRef = useRef<HTMLDivElement>(null);
    const radarChartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    const {
        atsScore,
        aiCritique: critique,
        skillGaps,
        atsBreakdown,
        responsibilityAnalysis,
        recommendations,
        targetRole,
        experienceLevel,
        structuralIssues,
        contentIssues,
    } = review;

    const radarData = [
        { subject: "ATS", A: atsBreakdown?.scores?.atsCompatibility || 0, fullMark: 100 },
        { subject: "Parsing", A: atsBreakdown?.scores?.parsingReliability || 0, fullMark: 100 },
        { subject: "Alignment", A: atsBreakdown?.scores?.responsibilityAlignment || 0, fullMark: 100 },
        { subject: "Role", A: atsBreakdown?.scores?.roleExpectationMatch || 0, fullMark: 100 },
        { subject: "Skills", A: atsBreakdown?.scores?.skillEvidence || 0, fullMark: 100 },
        { subject: "Shortlist", A: atsBreakdown?.scores?.recruiterShortlistingProbability || 0, fullMark: 100 },
    ];

    const handleApplyFix = (id: string) => {
        setIsGenerating(id);
        setTimeout(() => {
            setAppliedFixes(prev => new Set(prev).add(id));
            setIsGenerating(null);
        }, 1500);
    };

    const handleExportPDF = async () => {
        setIsExporting(true);

        try {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 15;
            const contentWidth = pageWidth - (margin * 2);
            let yPos = margin;

            const addNewPageIfNeeded = (requiredHeight: number) => {
                if (yPos + requiredHeight > pageHeight - margin) {
                    pdf.addPage();
                    yPos = margin;
                    return true;
                }
                return false;
            };

            const addSectionTitle = (title: string, color: [number, number, number] = [59, 130, 246]) => {
                addNewPageIfNeeded(15);
                pdf.setFillColor(...color);
                pdf.rect(margin, yPos, contentWidth, 10, 'F');
                pdf.setTextColor(255, 255, 255);
                pdf.setFontSize(12);
                pdf.setFont('helvetica', 'bold');
                pdf.text(title.toUpperCase(), margin + 4, yPos + 7);
                pdf.setTextColor(0, 0, 0);
                yPos += 15;
            };

            const addSubheading = (text: string) => {
                addNewPageIfNeeded(10);
                pdf.setFontSize(11);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(51, 65, 85);
                pdf.text(text, margin, yPos);
                yPos += 7;
            };

            const addText = (text: string, indent: number = 0) => {
                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'normal');
                pdf.setTextColor(71, 85, 105);
                const lines = pdf.splitTextToSize(text, contentWidth - indent);
                for (const line of lines) {
                    addNewPageIfNeeded(6);
                    pdf.text(line, margin + indent, yPos);
                    yPos += 5;
                }
                yPos += 2;
            };

            const addBulletPoint = (text: string, bulletColor: [number, number, number] = [59, 130, 246]) => {
                pdf.setFillColor(...bulletColor);
                pdf.circle(margin + 3, yPos - 1.5, 1.5, 'F');
                addNewPageIfNeeded(6);
                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'normal');
                pdf.setTextColor(71, 85, 105);
                const lines = pdf.splitTextToSize(text, contentWidth - 10);
                for (let i = 0; i < lines.length; i++) {
                    if (i > 0) addNewPageIfNeeded(5);
                    pdf.text(lines[i], margin + 8, yPos);
                    yPos += 5;
                }
                yPos += 1;
            };

            const addScoreBar = (label: string, score: number) => {
                addNewPageIfNeeded(12);
                pdf.setFontSize(9);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(100, 116, 139);
                pdf.text(label, margin, yPos);
                pdf.text(`${score}%`, margin + contentWidth - 10, yPos);
                yPos += 4;
                // Background bar
                pdf.setFillColor(241, 245, 249);
                pdf.roundedRect(margin, yPos, contentWidth, 4, 2, 2, 'F');
                // Score bar
                const scoreColor: [number, number, number] = score >= 70 ? [34, 197, 94] : score >= 50 ? [234, 179, 8] : [239, 68, 68];
                pdf.setFillColor(...scoreColor);
                pdf.roundedRect(margin, yPos, (contentWidth * score) / 100, 4, 2, 2, 'F');
                yPos += 10;
            };

            // ============ HEADER ============
            pdf.setFillColor(59, 130, 246);
            pdf.rect(0, 0, pageWidth, 40, 'F');
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(22);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Resume Analysis Report', margin, 20);
            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'normal');
            pdf.text(`Target Role: ${targetRole} | Experience: ${experienceLevel}`, margin, 30);

            // Score circle
            const scoreColor = atsScore >= 70 ? [34, 197, 94] : atsScore >= 50 ? [234, 179, 8] : [239, 68, 68];
            pdf.setFillColor(255, 255, 255);
            pdf.circle(pageWidth - 30, 22, 15, 'F');
            pdf.setTextColor(...scoreColor as [number, number, number]);
            pdf.setFontSize(18);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`${atsScore}`, pageWidth - 35, 25);
            pdf.setFontSize(8);
            pdf.text('/100', pageWidth - 26, 25);

            yPos = 50;
            pdf.setTextColor(0, 0, 0);

            // ============ SUMMARY VERDICT ============
            addSectionTitle('Executive Summary');
            addText(critique?.summaryVerdict || 'No summary available.');
            yPos += 5;

            // ============ SCORES OVERVIEW ============
            addSectionTitle('Performance Scores', [16, 185, 129]);
            addScoreBar('ATS Compatibility', atsBreakdown?.scores?.atsCompatibility || 0);
            addScoreBar('Parsing Reliability', atsBreakdown?.scores?.parsingReliability || 0);
            addScoreBar('Role Expectation Match', atsBreakdown?.scores?.roleExpectationMatch || 0);
            addScoreBar('Skill Evidence', atsBreakdown?.scores?.skillEvidence || 0);
            addScoreBar('Responsibility Alignment', atsBreakdown?.scores?.responsibilityAlignment || 0);
            addScoreBar('Shortlisting Probability', atsBreakdown?.scores?.recruiterShortlistingProbability || 0);
            yPos += 5;

            // ============ RADAR CHART (CAPTURED AS IMAGE) ============
            if (radarChartRef.current) {
                try {
                    addNewPageIfNeeded(80);
                    addSectionTitle('Performance Radar', [59, 130, 246]);

                    const canvas = await html2canvas(radarChartRef.current, {
                        scale: 2,
                        useCORS: true,
                        allowTaint: true,
                        backgroundColor: '#ffffff',
                        logging: false,
                    });

                    const imgData = canvas.toDataURL('image/png');
                    const imgWidth = contentWidth * 0.7;
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;
                    const xOffset = margin + (contentWidth - imgWidth) / 2;

                    pdf.addImage(imgData, 'PNG', xOffset, yPos, imgWidth, Math.min(imgHeight, 70));
                    yPos += Math.min(imgHeight, 70) + 10;
                } catch (chartError) {
                    console.error('Failed to capture radar chart:', chartError);
                }
            }

            // ============ REJECTION RISKS ============
            if (critique?.primaryRejectionReasons?.length > 0) {
                addSectionTitle('Critical Rejection Risks', [239, 68, 68]);
                critique.primaryRejectionReasons.forEach((reason: string, i: number) => {
                    addBulletPoint(`${i + 1}. ${reason}`, [239, 68, 68]);
                });
                yPos += 5;
            }

            // ============ ROLE FIT ASSESSMENT ============
            if (critique?.roleFitAssessment) {
                addSectionTitle('Role Fit Assessment', [139, 92, 246]);
                addText(critique.roleFitAssessment);
                yPos += 5;
            }

            // ============ SKILLS ANALYSIS ============
            addSectionTitle('Skills Analysis', [234, 179, 8]);

            if (skillGaps?.missingCoreSkills?.length > 0) {
                addSubheading('Missing Core Skills:');
                skillGaps.missingCoreSkills.forEach((skill: string) => {
                    addBulletPoint(skill, [239, 68, 68]);
                });
                yPos += 3;
            }

            if (skillGaps?.missingToolsAndTech?.length > 0) {
                addSubheading('Recommended Tools & Technologies:');
                skillGaps.missingToolsAndTech.forEach((tool: string) => {
                    addBulletPoint(tool, [234, 179, 8]);
                });
                yPos += 3;
            }

            // ============ RESPONSIBILITY GAPS ============
            if (responsibilityAnalysis?.unmatchedResponsibilities?.length > 0) {
                addSectionTitle('Responsibility Gaps', [244, 63, 94]);
                responsibilityAnalysis.unmatchedResponsibilities.forEach((item: string) => {
                    addBulletPoint(item, [244, 63, 94]);
                });
                yPos += 5;
            }

            // ============ STRUCTURAL ISSUES ============
            if (structuralIssues?.length > 0) {
                addSectionTitle('Structural Issues (ATS Failures)', [239, 68, 68]);
                structuralIssues.forEach((issue: string) => {
                    addBulletPoint(issue, [239, 68, 68]);
                });
                yPos += 5;
            }

            // ============ CONTENT IMPROVEMENTS ============
            if (contentIssues?.length > 0) {
                addSectionTitle('Content Improvements', [59, 130, 246]);
                contentIssues.forEach((issue: string) => {
                    addBulletPoint(issue, [59, 130, 246]);
                });
                yPos += 5;
            }

            // ============ RECOMMENDED FIXES ============
            if (recommendations?.bulletFixes?.length > 0) {
                addSectionTitle('High-Impact Optimizations', [16, 185, 129]);
                recommendations.bulletFixes.slice(0, 6).forEach((fix: any, i: number) => {
                    addNewPageIfNeeded(30);
                    addSubheading(`Fix ${i + 1}:`);

                    pdf.setFontSize(9);
                    pdf.setFont('helvetica', 'bold');
                    pdf.setTextColor(239, 68, 68);
                    pdf.text('ORIGINAL:', margin + 4, yPos);
                    yPos += 5;
                    pdf.setFont('helvetica', 'italic');
                    pdf.setTextColor(100, 116, 139);
                    const origLines = pdf.splitTextToSize(`"${fix.original}"`, contentWidth - 8);
                    origLines.forEach((line: string) => {
                        addNewPageIfNeeded(5);
                        pdf.text(line, margin + 4, yPos);
                        yPos += 4;
                    });
                    yPos += 3;

                    pdf.setFont('helvetica', 'bold');
                    pdf.setTextColor(16, 185, 129);
                    pdf.text('IMPROVED:', margin + 4, yPos);
                    yPos += 5;
                    pdf.setFont('helvetica', 'normal');
                    pdf.setTextColor(30, 41, 59);
                    const impLines = pdf.splitTextToSize(`"${fix.improved}"`, contentWidth - 8);
                    impLines.forEach((line: string) => {
                        addNewPageIfNeeded(5);
                        pdf.text(line, margin + 4, yPos);
                        yPos += 4;
                    });
                    yPos += 3;

                    pdf.setFontSize(8);
                    pdf.setFont('helvetica', 'italic');
                    pdf.setTextColor(100, 116, 139);
                    pdf.text(`Reason: ${fix.reason}`, margin + 4, yPos);
                    yPos += 8;
                });
            }

            // ============ PRIORITY ROADMAP ============
            if (recommendations?.priorityFixList?.length > 0) {
                addSectionTitle('Priority Action Items', [139, 92, 246]);
                recommendations.priorityFixList.forEach((fix: string, i: number) => {
                    addBulletPoint(`${i + 1}. ${fix}`, [139, 92, 246]);
                });
            }

            // ============ FOOTER ============
            const totalPages = pdf.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.setFontSize(8);
                pdf.setTextColor(148, 163, 184);
                pdf.text(`Generated on ${new Date().toLocaleDateString()} | Page ${i} of ${totalPages}`, margin, pageHeight - 8);
                pdf.text('Resume Analysis Report', pageWidth - margin - 40, pageHeight - 8);
            }

            // Generate filename with date
            const date = new Date().toISOString().split('T')[0];
            pdf.save(`resume-analysis-${targetRole.toLowerCase().replace(/\s+/g, '-')}-${date}.pdf`);

        } catch (error) {
            console.error('PDF Export Error:', error);
            alert('Failed to export PDF. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="flex flex-col space-y-8 pb-20">
            {/* Header Section */}
            <div ref={headerRef} className="bg-white p-1 rounded-[2.5rem] shadow-2xl shadow-blue-500/5 border border-blue-50">
                <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-6 p-6">
                    <div className="flex-1 space-y-4 px-2">
                        <div className="flex flex-wrap items-center gap-3">
                            <Badge className="bg-accent-blue/10 text-accent-blue rounded-lg px-3 py-1 text-[10px] font-bold uppercase tracking-widest border-none">
                                {experienceLevel}
                            </Badge>
                            <Badge className="bg-emerald-50 text-emerald-600 rounded-lg px-3 py-1 text-[10px] font-bold uppercase tracking-widest border-none flex items-center gap-1.5">
                                <Briefcase className="w-3 h-3" /> {targetRole}
                            </Badge>
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-text-primary tracking-tight leading-tight">Analysis Report</h1>
                            <p className="text-text-secondary font-medium mt-2 max-w-xl italic leading-relaxed text-sm">
                                &quot;{critique?.summaryVerdict}&quot;
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                        <div className="text-center min-w-[100px]">
                            <div className="text-5xl font-black font-mono tracking-tighter" style={{ color: getScoreColor(atsScore) }}>
                                {atsScore}
                                <span className="text-xl opacity-30 ml-0.5">/100</span>
                            </div>
                            <div className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mt-1 pr-1">{getScoreLabel(atsScore)}</div>
                        </div>
                        <div className="hidden md:block h-16 w-[1px] bg-gray-200" />
                        <div className="flex flex-col gap-2">
                            <Button variant="outline" className="h-10 rounded-xl border-gray-200 text-text-secondary hover:text-accent-blue hover:bg-blue-50 font-bold text-xs">
                                <Share2 className="mr-2 h-4 w-4" /> Share
                            </Button>
                            <Button
                                onClick={handleExportPDF}
                                disabled={isExporting}
                                className="h-10 rounded-xl bg-accent-blue hover:bg-accent-blue/90 text-white font-bold text-xs shadow-lg shadow-accent-blue/20 disabled:opacity-50"
                            >
                                <Download className="mr-2 h-4 w-4" /> {isExporting ? 'Exporting...' : 'Export PDF'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-8">
                <div className="flex justify-center -mt-4 relative z-10">
                    <TabsList className="bg-white/80 backdrop-blur-xl p-1.5 rounded-3xl shadow-xl shadow-blue-500/10 border border-white/50 h-16 w-full max-w-2xl">
                        {[
                            { value: "overview", icon: <TrendingUp className="w-4 h-4" />, label: "Overview" },
                            { value: "analysis", icon: <Brain className="w-4 h-4" />, label: "Scoring" },
                            { value: "skills", icon: <Target className="w-4 h-4" />, label: "Skills" },
                            { value: "formatting", icon: <FileText className="w-4 h-4" />, label: "Format" },
                            { value: "actions", icon: <Zap className="w-4 h-4" />, label: "Fixes" }
                        ].map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="rounded-2xl data-[state=active]:bg-accent-blue data-[state=active]:text-white data-[state=active]:shadow-lg transition-all flex items-center gap-2.5 h-full px-6 font-bold text-[13px]"
                            >
                                {tab.icon} {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div ref={overviewRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
                        <Card className="premium-card p-5">
                            <CardHeader className="pb-4 p-0">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="h-10 w-10 premium-icon-bg icon-glow-blue">
                                        <Brain className="h-5 w-5" />
                                    </div>
                                    <CardTitle className="text-sm font-black text-text-primary">AI Verdict</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <p className="text-sm font-bold text-text-primary leading-relaxed bg-gradient-to-r from-blue-50/50 to-purple-50/50 p-4 rounded-xl border-l-4 border-accent-blue">
                                    {critique?.summaryVerdict}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="premium-card p-5">
                            <CardHeader className="pb-4 p-0">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="h-10 w-10 premium-icon-bg icon-glow-purple">
                                        <Target className="h-5 w-5" />
                                    </div>
                                    <CardTitle className="text-sm font-black text-text-primary">Keyword Match</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 p-0">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[11px] font-bold uppercase">
                                        <span className="text-text-secondary">Current Match</span>
                                        <span className="text-accent-blue font-black">{atsBreakdown?.scores?.roleExpectationMatch || 68}%</span>
                                    </div>
                                    <div className="h-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${atsBreakdown?.scores?.roleExpectationMatch || 68}%` }} />
                                    </div>
                                    <div className="flex justify-between text-[10px] font-bold uppercase text-emerald-600">
                                        <span>Target Range</span>
                                        <span>85%+</span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {radarData.slice(0, 4).map((d, i) => (
                                        <Badge key={i} variant="secondary" className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 text-[10px] text-text-primary font-bold border border-blue-100/50 rounded-xl px-3 py-1">
                                            {d.subject}: {d.A}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="premium-card p-5">
                            <CardHeader className="pb-4 p-0">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="h-10 w-10 premium-icon-bg icon-glow-emerald">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <CardTitle className="text-sm font-black text-text-primary">ATS Parsing</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3 p-0">
                                {[
                                    { label: "Headings Detected", status: "success" },
                                    { label: "Contact Info Parsed", status: "success" },
                                    { label: "Bullet Structure", status: atsBreakdown?.universalAnalysis?.structuralAnalysis?.bulletPoints?.length > 5 ? "success" : "warning" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-50/50 to-gray-50/30 border border-gray-100">
                                        <span className="text-[11px] font-bold text-text-secondary uppercase tracking-tight">{item.label}</span>
                                        {item.status === "success" ? (
                                            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-emerald-100 to-cyan-100 flex items-center justify-center">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                            </div>
                                        ) : (
                                            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                                                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                                            </div>
                                        )}

                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div ref={radarChartRef}>
                            <Card className="premium-card p-5">
                                <CardHeader className="pb-4 p-0">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 premium-icon-bg icon-glow-blue">
                                            <TrendingUp className="h-5 w-5" />
                                        </div>
                                        <h3 className="font-black text-text-primary">Performance Radar</h3>
                                    </div>
                                </CardHeader>

                                <CardContent className="h-[320px] pt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                            <PolarGrid stroke="#E2E8F0" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 11, fontWeight: 700 }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                            <Radar
                                                name="Score"
                                                dataKey="A"
                                                stroke="#3B82F6"
                                                strokeWidth={3}
                                                fill="#3B82F6"
                                                fillOpacity={0.15}
                                            />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="premium-card p-5">
                            <CardHeader className="pb-4 p-0">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 premium-icon-bg icon-glow-rose">
                                        <AlertTriangle className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-black text-text-primary text-lg">Key Insights</h3>
                                </div>
                            </CardHeader>

                            <CardContent className="p-0">
                                <div className="space-y-4 px-2">
                                    {critique?.primaryRejectionReasons?.length > 0 ? (
                                        critique.primaryRejectionReasons.map((reason: string, i: number) => (
                                            <div key={i} className="flex gap-4 p-4 bg-red-50/50 rounded-2xl border border-red-100/50 hover:bg-red-50 transition-colors">
                                                <div className="h-8 w-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 text-sm font-black">
                                                    {i + 1}
                                                </div>
                                                <p className="text-sm font-bold text-text-primary leading-snug self-center">{reason}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-6 bg-emerald-50/50 rounded-2xl border border-dashed border-emerald-200 text-center">
                                            <div className="h-10 w-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <CheckCircle2 className="h-5 w-5" />
                                            </div>
                                            <p className="text-sm font-black text-emerald-700 uppercase tracking-wide">No Critical Risks</p>
                                            <p className="text-xs text-emerald-600 mt-1">Your resume has no major red flags</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>

                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="analysis" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div ref={analysisRef}>
                        <Card className="premium-card overflow-hidden">
                            <div className="p-8 border-b border-gray-50 bg-gradient-to-r from-blue-50/30 to-purple-50/30">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="h-12 w-12 premium-icon-bg icon-glow-blue">
                                        <Brain className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-text-primary">Comprehensive Score Analysis</h3>
                                        <p className="text-sm text-text-secondary font-medium">AI-powered evaluation of your professional profile</p>
                                    </div>
                                </div>
                            </div>

                            <CardContent className="p-10">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                    {/* All 6 scores */}
                                    <div className="space-y-8">
                                        {[
                                            {
                                                label: "ATS Compatibility",
                                                val: atsBreakdown?.scores?.atsCompatibility,
                                                reason: atsBreakdown?.universalAnalysis?.scores?.atsReadability?.interpretation || "Measures how well ATS systems can parse your resume"
                                            },
                                            {
                                                label: "Parsing Reliability",
                                                val: atsBreakdown?.scores?.parsingReliability,
                                                reason: "Confidence level in text extraction accuracy"
                                            },
                                            {
                                                label: "Role Expectation Match",
                                                val: atsBreakdown?.scores?.roleExpectationMatch,
                                                reason: atsBreakdown?.universalAnalysis?.scores?.roleAlignment?.interpretation || "Alignment with target role requirements"
                                            },
                                            {
                                                label: "Skill Evidence",
                                                val: atsBreakdown?.scores?.skillEvidence,
                                                reason: atsBreakdown?.universalAnalysis?.scores?.evidenceStrength?.interpretation || "Strength of demonstrated skills and impact"
                                            },
                                            {
                                                label: "Responsibility Alignment",
                                                val: atsBreakdown?.scores?.responsibilityAlignment,
                                                reason: "Match between your experience and role responsibilities"
                                            },
                                            {
                                                label: "Shortlisting Probability",
                                                val: atsBreakdown?.scores?.recruiterShortlistingProbability,
                                                reason: atsBreakdown?.universalAnalysis?.scores?.composite?.interpretation || "Overall competitiveness score"
                                            },
                                        ].map((item, i) => (
                                            <div key={i} className="p-4 rounded-xl bg-gradient-to-r from-gray-50/50 to-white border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                                                <div className="flex justify-between items-end mb-3">
                                                    <span className="text-xs font-black text-text-secondary uppercase tracking-widest">{item.label}</span>
                                                    <span className={`text-2xl font-black font-mono ${item.val >= 70 ? 'text-emerald-600' : item.val >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{item.val}%</span>
                                                </div>
                                                <div className="h-3 bg-gradient-to-r from-gray-100 to-gray-50 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-1000 ${item.val >= 70 ? 'bg-gradient-to-r from-emerald-500 to-cyan-500' : item.val >= 50 ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-red-500 to-rose-500'}`}
                                                        style={{ width: `${item.val}%` }}
                                                    />
                                                </div>
                                                <p className="text-xs text-text-secondary mt-2 leading-relaxed">{item.reason}</p>
                                            </div>
                                        ))}
                                    </div>


                                    {/* AI Insight Card */}
                                    <div className="space-y-6">
                                        <div className="bg-gradient-to-br from-accent-blue to-blue-700 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-500/20 group">
                                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                                <Brain className="h-40 w-40" />
                                            </div>
                                            <div className="relative z-10 space-y-4">
                                                <Badge className="bg-white/20 text-white border-none rounded-xl px-4 py-1.5 font-black text-[11px] uppercase tracking-widest">AI INSIGHT</Badge>
                                                <h4 className="text-2xl font-black tracking-tight">Role Fit Assessment</h4>
                                                <p className="text-blue-50 text-sm leading-relaxed font-bold">
                                                    {critique?.roleFitAssessment}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Score Factors - Premium Styled */}
                                        <div className="premium-card p-6">
                                            <div className="flex items-center gap-3 mb-5">
                                                <div className="h-10 w-10 premium-icon-bg icon-glow-purple">
                                                    <TrendingUp className="h-5 w-5" />
                                                </div>
                                                <h5 className="text-sm font-black text-text-primary uppercase tracking-wide">Score Insights</h5>
                                            </div>
                                            <div className="space-y-3">
                                                {atsBreakdown?.universalAnalysis?.scores?.composite?.factors?.length > 0 ? (
                                                    atsBreakdown.universalAnalysis.scores.composite.factors.map((factor: string, i: number) => (
                                                        <div key={i} className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl border border-blue-100/50 hover:border-blue-200 transition-all">
                                                            <div className="h-5 w-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-black shrink-0 mt-0.5">
                                                                {i + 1}
                                                            </div>
                                                            <span className="text-sm font-medium text-text-primary leading-relaxed">{factor}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <>
                                                        <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-emerald-50/50 to-cyan-50/50 rounded-xl border border-emerald-100/50">
                                                            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                                                            <span className="text-sm font-medium text-text-primary">ATS: {atsBreakdown?.scores?.atsCompatibility}% - Resume structure optimized</span>
                                                        </div>
                                                        <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl border border-blue-100/50">
                                                            <Target className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                                                            <span className="text-sm font-medium text-text-primary">Role Alignment: {atsBreakdown?.scores?.roleExpectationMatch}%</span>
                                                        </div>
                                                        <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-xl border border-purple-100/50">
                                                            <Zap className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                                                            <span className="text-sm font-medium text-text-primary">Evidence: {atsBreakdown?.scores?.skillEvidence}% - Impact demonstrated</span>
                                                        </div>
                                                        <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-amber-50/50 to-orange-50/50 rounded-xl border border-amber-100/50">
                                                            <Lightbulb className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                                                            <span className="text-sm font-medium text-text-primary">Clarity: {atsBreakdown?.universalAnalysis?.scores?.claritySignaling?.value || 75}%</span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </CardContent>

                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="skills" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div ref={skillsRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="premium-card p-6">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-14 w-14 premium-icon-bg icon-glow-rose">
                                    <Target className="h-7 w-7" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-black">Skill Analysis</CardTitle>
                                    <CardDescription className="font-bold text-xs uppercase tracking-wider text-text-secondary mt-1">Core competencies review</CardDescription>
                                </div>
                            </div>

                            <CardContent className="p-0 space-y-4">
                                {skillGaps?.missingCoreSkills?.map((skill: string) => (
                                    <div key={skill} className="space-y-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-red-200 transition-all group/skill">
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-sm font-black text-text-primary tracking-tight">{skill}</span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 px-4 rounded-xl bg-white border-gray-200 text-accent-blue font-black text-[10px] uppercase tracking-widest hover:bg-accent-blue hover:text-white hover:border-accent-blue transition-all"
                                                onClick={() => handleApplyFix(`skill-${skill}`)}
                                                disabled={isGenerating === `skill-${skill}`}
                                            >
                                                {isGenerating === `skill-${skill}` ? "Working..." : "AI Generate Fix"}
                                            </Button>
                                        </div>
                                        {appliedFixes.has(`skill-${skill}`) && (
                                            <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex gap-3 animate-in slide-in-from-top-2 duration-300">
                                                <Zap className="h-4 w-4 shrink-0" />
                                                <p>Suggestion: <span className="italic font-black text-emerald-800">&quot;Utilized {skill} to drive technical decision-making, resulting in 15% efficiency gain.&quot;</span></p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {(!skillGaps?.missingCoreSkills || skillGaps.missingCoreSkills.length === 0) && (
                                    <div className="space-y-6">
                                        <div className="relative p-6 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl overflow-hidden shadow-lg shadow-teal-500/20">
                                            <div className="absolute top-0 right-0 opacity-10">
                                                <Target className="w-32 h-32 -mr-8 -mt-8 text-white" />
                                            </div>
                                            <div className="relative z-10 flex items-center gap-4">
                                                <div className="h-12 w-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                                                    <CheckCircle2 className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-black text-white uppercase tracking-wide">No Critical Gaps</h4>
                                                    <p className="text-teal-100 text-sm font-medium">Your profile matches all core role requirements</p>
                                                </div>
                                            </div>
                                        </div>

                                        {atsBreakdown?.universalAnalysis?.alignment?.explicit?.length > 0 && (
                                            <div className="p-5 bg-gradient-to-br from-emerald-50 to-white rounded-2xl border border-emerald-100/50 hover:shadow-lg hover:shadow-emerald-500/5 transition-all">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center">
                                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                                    </div>
                                                    <p className="text-xs font-black text-emerald-800 uppercase tracking-widest">Verified Mastery</p>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {atsBreakdown.universalAnalysis.alignment.explicit.slice(0, 8).map((item: any, i: number) => (
                                                        <Badge key={i} className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border-none px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-sm">
                                                            {item.skill}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {atsBreakdown?.universalAnalysis?.alignment?.implicit?.length > 0 && (
                                            <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100/50">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <Brain className="h-3.5 w-3.5 text-blue-600" />
                                                    </div>
                                                    <p className="text-xs font-black text-blue-800 uppercase tracking-widest">Implicitly Demonstrated</p>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {atsBreakdown.universalAnalysis.alignment.implicit.slice(0, 6).map((item: any, i: number) => (
                                                        <Badge key={i} className="bg-white text-blue-700 border-blue-200 px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-sm">
                                                            {item.skill}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                            </CardContent>
                        </Card>

                        <Card className="premium-card p-6">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-14 w-14 premium-icon-bg icon-glow-amber">
                                    <Zap className="h-7 w-7" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-black">Technology Stack</CardTitle>
                                    <CardDescription className="font-bold text-xs uppercase tracking-wider text-text-secondary mt-1">Tools & frameworks analysis</CardDescription>
                                </div>
                            </div>
                            <CardContent className="p-0">
                                {skillGaps?.missingToolsAndTech?.length > 0 ? (
                                    <div>
                                        <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-3">Recommended to Add:</p>
                                        <div className="flex flex-wrap gap-3">
                                            {skillGaps.missingToolsAndTech.map((tool: string) => (
                                                <Badge key={tool} className="bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 hover:from-amber-100 hover:to-orange-100 border border-amber-200 px-4 py-2 rounded-2xl font-black text-[12px] transition-all">
                                                    {tool}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="relative p-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl overflow-hidden shadow-lg shadow-amber-500/20">
                                            <div className="absolute top-0 right-0 opacity-10">
                                                <Zap className="w-32 h-32 -mr-8 -mt-8 text-white" />
                                            </div>
                                            <div className="relative z-10 flex items-center gap-4">
                                                <div className="h-12 w-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                                                    <CheckCircle2 className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-black text-white uppercase tracking-wide">Strong Tech Coverage</h4>
                                                    <p className="text-amber-100 text-sm font-medium">Your technology skills align well with role requirements</p>
                                                </div>
                                            </div>
                                        </div>
                                        {atsBreakdown?.universalAnalysis?.alignment?.explicit?.filter((s: any) => s.skill?.toLowerCase().includes('python') || s.skill?.toLowerCase().includes('react') || s.skill?.toLowerCase().includes('java') || s.skill?.toLowerCase().includes('node'))?.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {atsBreakdown.universalAnalysis.alignment.explicit.slice(0, 6).map((item: any, i: number) => (
                                                    <Badge key={i} className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-xl text-xs font-bold">
                                                        ✓ {item.skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>


                        <Card className="md:col-span-2 premium-card p-6">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-14 w-14 premium-icon-bg icon-glow-blue">
                                    <Briefcase className="h-7 w-7" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-black">Role Alignment</CardTitle>
                                    <CardDescription className="font-bold text-xs uppercase tracking-wider text-text-secondary mt-1">Experience vs. expectations analysis</CardDescription>
                                </div>
                            </div>

                            <CardContent className="p-0">
                                <div className="space-y-6">
                                    {/* Expectations Met */}
                                    {responsibilityAnalysis?.expectationsMet?.length > 0 && (
                                        <div>
                                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3">✓ Expectations Met</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {responsibilityAnalysis.expectationsMet.slice(0, 4).map((item: any, i: number) => (
                                                    <div key={i} className="flex gap-3 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                                                        <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                                                        <div>
                                                            <span className="text-sm font-bold text-emerald-800">{item.expectation}</span>
                                                            {item.evidence && (
                                                                <p className="text-xs text-emerald-600 mt-1">{item.evidence}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {/* Expectations Differ */}
                                    {responsibilityAnalysis?.expectationsDiffer?.length > 0 && (
                                        <div>
                                            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-3">⚡ Areas to Strengthen</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {responsibilityAnalysis.expectationsDiffer.map((item: any, i: number) => (
                                                    <div key={i} className="flex gap-3 p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                                                        <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                                                        <div>
                                                            <span className="text-sm font-bold text-amber-800">{item.expectation}</span>
                                                            {item.assessment && (
                                                                <p className="text-xs text-amber-600 mt-1">{item.assessment}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {/* Show nothing found message if both empty */}
                                    {(!responsibilityAnalysis?.expectationsMet || responsibilityAnalysis.expectationsMet.length === 0) &&
                                        (!responsibilityAnalysis?.expectationsDiffer || responsibilityAnalysis.expectationsDiffer.length === 0) && (
                                            <div className="p-8 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                                <p className="text-sm font-bold text-gray-500">Role responsibility analysis pending</p>
                                            </div>
                                        )}
                                </div>
                            </CardContent>

                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="formatting" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div ref={formattingRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="premium-card p-6">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-14 w-14 premium-icon-bg icon-glow-rose">
                                    <AlertTriangle className="h-7 w-7" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-black">Format & Structure</CardTitle>
                                    <CardDescription className="font-bold text-xs uppercase tracking-wider text-text-secondary mt-1">ATS parsing analysis</CardDescription>
                                </div>
                            </div>

                            <CardContent className="p-0">
                                {structuralIssues?.length > 0 ? (
                                    <div className="space-y-4">
                                        {structuralIssues.map((issue: string, i: number) => (
                                            <div key={i} className="p-5 text-sm font-bold text-text-primary flex items-start gap-4 bg-gray-50/50 rounded-2xl border border-gray-100 justify-between">
                                                <div className="flex gap-4">
                                                    <div className="h-2 w-2 rounded-full bg-red-500 mt-2 shrink-0 shadow-sm shadow-red-500/50" />
                                                    <p className="leading-relaxed">{issue}</p>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 rounded-xl border-gray-200 text-accent-blue bg-white hover:bg-accent-blue hover:text-white hover:border-accent-blue text-[10px] font-black uppercase tracking-widest shrink-0 transition-all"
                                                    onClick={() => handleApplyFix(`issue-${i}`)}
                                                    disabled={isGenerating === `issue-${i}` || appliedFixes.has(`issue-${i}`)}
                                                >
                                                    {isGenerating === `issue-${i}` ? "..." : appliedFixes.has(`issue-${i}`) ? "Resolved" : "AI Fix"}
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Success Header with Gradient */}
                                        <div className="relative p-6 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl overflow-hidden">
                                            <div className="absolute top-0 right-0 opacity-10">
                                                <CheckCircle2 className="w-32 h-32 -mr-8 -mt-8" />
                                            </div>
                                            <div className="relative z-10 flex items-center gap-4">
                                                <div className="h-14 w-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                                                    <CheckCircle2 className="h-7 w-7 text-white" />
                                                </div>
                                                <div className="text-white">
                                                    <h4 className="text-lg font-black uppercase tracking-wide">Perfect Structure</h4>
                                                    <p className="text-emerald-100 text-sm font-medium">Your resume is fully ATS-optimized</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Structure Checklist */}
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { label: "Standard Sections", icon: "✓" },
                                                { label: "Clean Formatting", icon: "✓" },
                                                { label: "No Tables/Graphics", icon: "✓" },
                                                { label: "Proper Headings", icon: "✓" },
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-50/50 to-cyan-50/50 rounded-xl border border-emerald-100">
                                                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-white text-xs font-black">
                                                        {item.icon}
                                                    </div>
                                                    <span className="text-sm font-bold text-emerald-700">{item.label}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* ATS Compatibility Score */}
                                        <div className="p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl border border-blue-100/50">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-black text-text-secondary uppercase tracking-wider">ATS Compatibility</span>
                                                <span className="text-lg font-black text-emerald-600">{atsBreakdown?.scores?.atsCompatibility || 95}%</span>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" style={{ width: `${atsBreakdown?.scores?.atsCompatibility || 95}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </CardContent>
                        </Card>

                        <Card className="premium-card p-6">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-14 w-14 premium-icon-bg icon-glow-purple">
                                    <Lightbulb className="h-7 w-7" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-black">Content Quality</CardTitle>
                                    <CardDescription className="font-bold text-xs uppercase tracking-wider text-text-secondary mt-1">Writing & impact analysis</CardDescription>
                                </div>
                            </div>
                            <CardContent className="p-0">
                                <div className="space-y-4">
                                    {contentIssues?.length > 0 ? (
                                        contentIssues.map((issue: string, i: number) => (
                                            <div key={i} className="p-5 text-sm font-bold text-text-primary flex gap-4 bg-gradient-to-r from-blue-50/30 to-purple-50/30 rounded-2xl border border-blue-100/50 hover:border-blue-200 transition-all">
                                                <div className="h-2 w-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mt-2 shrink-0" />
                                                <p className="leading-relaxed">{issue}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="relative p-6 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl overflow-hidden text-white shadow-lg shadow-purple-500/20">
                                                <div className="absolute top-0 right-0 opacity-10">
                                                    <Sparkles className="w-32 h-32 -mr-8 -mt-8" />
                                                </div>
                                                <div className="relative z-10">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="h-10 w-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                                                            <CheckCircle2 className="h-5 w-5 text-white" />
                                                        </div>
                                                        <h4 className="text-lg font-black uppercase tracking-wide">Strong Content Quality</h4>
                                                    </div>
                                                    <p className="text-purple-100 text-sm font-medium pl-[52px]">Your resume content uses active language and quantifiable metrics.</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="group p-5 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100/50 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                                            <FileText className="h-5 w-5" />
                                                        </div>
                                                        <span className="text-xs font-black text-blue-300 uppercase tracking-wider">Count</span>
                                                    </div>
                                                    <p className="text-3xl font-black text-slate-800 mb-1">{atsBreakdown?.universalAnalysis?.structuralAnalysis?.bulletPoints?.length || 0}</p>
                                                    <p className="text-xs font-bold text-text-secondary uppercase tracking-tight">Bullet Points Detected</p>
                                                </div>

                                                <div className="group p-5 bg-gradient-to-br from-purple-50 to-white rounded-2xl border border-purple-100/50 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                                                            <TrendingUp className="h-5 w-5" />
                                                        </div>
                                                        <span className="text-xs font-black text-purple-300 uppercase tracking-wider">Impact</span>
                                                    </div>
                                                    <div className="flex items-baseline gap-1 mb-1">
                                                        <p className="text-3xl font-black text-slate-800">{atsBreakdown?.universalAnalysis?.structuralAnalysis?.metricsDetected?.length || 0}</p>
                                                        <span className="text-xs font-bold text-purple-500 uppercase">Metrics</span>
                                                    </div>
                                                    <p className="text-xs font-bold text-text-secondary uppercase tracking-tight">Quantifiable Achievements</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </TabsContent>

                <TabsContent value="actions" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-4">
                    <div ref={actionsRef}>
                        <Card className="premium-card overflow-hidden">
                            <div className="p-8 border-b border-gray-50 bg-gradient-to-r from-emerald-50/30 to-cyan-50/30">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="h-12 w-12 premium-icon-bg icon-glow-emerald">
                                        <Zap className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-2xl font-black text-text-primary">High-Impact Optimizations</h3>
                                </div>
                                <p className="text-sm text-text-secondary font-bold max-w-2xl leading-relaxed ml-16">
                                    AI-refined bullet points designed to trigger ATS keyword matches and impress recruiters.
                                </p>
                            </div>

                            <CardContent className="p-8 space-y-8">
                                {recommendations?.bulletFixes?.slice(0, 4).map((fix: any, i: number) => (
                                    <div key={i} className="flex flex-col md:flex-row gap-0 rounded-[2rem] bg-white border border-gray-100 overflow-hidden shadow-lg shadow-gray-200/50 group/opt hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
                                        <div className="flex-1 p-8 space-y-4 bg-gray-50/50 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                                                <FileText className="h-40 w-40 -mr-10 -mt-10 rotate-12" />
                                            </div>
                                            <div className="relative z-10">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 rounded-lg text-red-600 border border-red-100/50 mb-2">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Original</span>
                                                </div>
                                                <p className="text-xs font-bold text-text-secondary leading-relaxed italic opacity-80">&quot;{fix.original}&quot;</p>
                                            </div>
                                        </div>

                                        <div className="hidden md:flex items-center justify-center w-12 bg-white relative z-20">
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center group-hover/opt:scale-110 group-hover/opt:rotate-180 transition-all duration-500">
                                                <ArrowRight className="h-4 w-4" />
                                            </div>
                                        </div>

                                        <div className="flex-1 p-8 space-y-6 bg-gradient-to-br from-white to-blue-50/30 relative">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-500" />
                                            <div>
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-lg text-emerald-600 border border-emerald-100/50 mb-3">
                                                    <Sparkles className="h-3 w-3" />
                                                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Optimized</span>
                                                </div>
                                                <p className="text-sm font-black text-text-primary leading-relaxed drop-shadow-sm">&quot;{fix.improved}&quot;</p>
                                            </div>

                                            <div className="pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-gray-100/50">
                                                <div className="flex items-center gap-2 text-[10px] font-black text-blue-600/80 uppercase tracking-widest">
                                                    <Info className="h-3.5 w-3.5" />
                                                    <span>{fix.reason}</span>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className={cn(
                                                        "h-10 rounded-xl px-6 font-black text-[10px] uppercase tracking-widest transition-all shadow-md hover:shadow-lg border-0",
                                                        appliedFixes.has(`bullet-${i}`)
                                                            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/20"
                                                            : "bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-slate-900/10 hover:scale-105"
                                                    )}
                                                    onClick={() => {
                                                        handleApplyFix(`bullet-${i}`);
                                                        navigator.clipboard.writeText(fix.improved);
                                                    }}
                                                >
                                                    {appliedFixes.has(`bullet-${i}`) ? (
                                                        <span className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5" /> Copied</span>
                                                    ) : (
                                                        <span className="flex items-center gap-2">Copy <span className="opacity-50">|</span> Use This</span>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="shadow-2xl shadow-blue-500/5 border-none bg-white overflow-hidden p-2">
                            <div className="p-8 border-b border-gray-50">
                                <h3 className="text-xl font-black text-text-primary">Priority Roadmap</h3>
                                <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mt-2">Next steps for maximum impact</p>
                            </div>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {recommendations?.priorityFixList?.map((fix: string, i: number) => (
                                        <div key={i} className="flex gap-6 p-6 items-center bg-gray-50/50 rounded-2xl hover:bg-white border border-transparent hover:border-blue-100 transition-all group/road">
                                            <div className="font-black font-mono text-3xl text-gray-200 italic group-hover/road:text-accent-blue transition-colors">{i + 1}</div>
                                            <div className="flex-1 text-sm font-bold text-text-primary leading-tight">{fix}</div>
                                            <Button variant="ghost" className="h-8 w-8 rounded-full p-0 text-gray-300 hover:text-accent-blue transition-colors">
                                                <ArrowRight className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div >
    );
}
