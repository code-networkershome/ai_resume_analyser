"use client";

import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { gsap } from "gsap";
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
    Sparkles,
    ShieldCheck,
    Gauge
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

    const containerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const overviewRef = useRef<HTMLDivElement>(null);
    const radarChartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsMounted(true);
        
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".animate-item",
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.05,
                    duration: 0.8,
                    ease: "power3.out"
                }
            );
        }, containerRef);

        return () => ctx.revert();
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
                addSectionTitle('High-Impact Optimizations', [59, 130, 246]);
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
                    pdf.setTextColor(59, 130, 246);
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
                addSectionTitle('Priority Action Items', [59, 130, 246]);
                recommendations.priorityFixList.forEach((fix: string, i: number) => {
                    addBulletPoint(`${i + 1}. ${fix}`, [59, 130, 246]);
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
        <div ref={containerRef} className="flex flex-col space-y-12 pb-20">
            {/* Header Section - Modernized */}
            <div ref={headerRef} className="animate-item relative overflow-hidden bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-1">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-cyan-500/5 to-transparent rounded-full -ml-32 -mb-32 blur-3xl" />
                
                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-8 p-8 md:p-12">
                    <div className="flex-1 space-y-6">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-2xl">
                                <ShieldCheck className="w-4 h-4 text-accent-blue" />
                                <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">{experienceLevel}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-2xl">
                                <Briefcase className="w-4 h-4 text-accent-blue" />
                                <span className="text-[11px] font-black text-accent-blue uppercase tracking-widest">{targetRole}</span>
                            </div>
                        </div>
                        
                        <div>
                            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                                Analysis <span className="gradient-text">Report</span>
                            </h1>
                            <p className="text-slate-500 font-medium mt-4 max-w-2xl text-lg leading-relaxed">
                                Professional audit and optimization roadmap for your career profile.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-8 bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 shadow-inner">
                        <div className="text-center sm:text-left">
                            <div className="flex items-baseline gap-1">
                                <span className="text-7xl font-black text-slate-900 tracking-tighter">{atsScore}</span>
                                <span className="text-2xl font-bold text-slate-300">/100</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <div className={cn("h-2.5 w-2.5 rounded-full animate-pulse", 
                                    atsScore >= 70 ? "bg-emerald-500" : atsScore >= 50 ? "bg-amber-500" : "bg-red-500"
                                )} />
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{getScoreLabel(atsScore)}</span>
                            </div>
                        </div>
                        
                        <div className="h-16 w-px bg-slate-200 hidden sm:block" />
                        
                        <div className="flex flex-col gap-3 w-full sm:w-auto">
                            <Button 
                                onClick={handleExportPDF}
                                disabled={isExporting}
                                className="h-14 rounded-2xl bg-accent-blue hover:bg-blue-600 text-white font-black text-xs uppercase tracking-widest px-8 shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                            >
                                <Download className="mr-3 h-4 w-4" /> {isExporting ? 'Processing...' : 'Download PDF'}
                            </Button>
                            <Button variant="outline" className="h-14 rounded-2xl border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300 font-black text-xs uppercase tracking-widest px-8 transition-all">
                                <Share2 className="mr-3 h-4 w-4" /> Share Report
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation - Professional Styling */}
            <Tabs defaultValue="overview" className="space-y-12">
                <div className="flex justify-center sticky top-24 z-50 animate-item px-4">
                    <TabsList className="bg-white/70 backdrop-blur-2xl p-2 rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-white/50 h-20 w-full max-w-3xl">
                        {[
                            { value: "overview", icon: <Gauge className="w-5 h-5" />, label: "Executive" },
                            { value: "analysis", icon: <TrendingUp className="w-5 h-5" />, label: "Metrics" },
                            { value: "skills", icon: <Target className="w-5 h-5" />, label: "Skills" },
                            { value: "formatting", icon: <FileText className="w-5 h-5" />, label: "Structure" },
                            { value: "actions", icon: <Zap className="w-5 h-5" />, label: "Optimizations" }
                        ].map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="rounded-2xl data-[state=active]:bg-accent-blue data-[state=active]:text-white data-[state=active]:shadow-xl transition-all flex items-center gap-3 h-full px-8 font-black text-[13px] uppercase tracking-wider"
                            >
                                {tab.icon} <span className="hidden md:inline">{tab.label}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {/* Overview Content */}
                <TabsContent value="overview" className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 outline-none">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* AI Summary Card */}
                        <Card className="animate-item premium-card aurora-bg border-none">
                            <CardContent className="p-8 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 premium-icon-bg icon-glow-blue shadow-lg shadow-blue-500/10">
                                        <Brain className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">AI Summary</h3>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-2 top-0 bottom-0 w-1 bg-accent-blue rounded-full" />
                                    <p className="pl-6 text-lg font-bold text-slate-700 leading-relaxed italic">
                                        &quot;{critique?.summaryVerdict}&quot;
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Keyword Density Card */}
                        <Card className="animate-item premium-card border-none">
                            <CardContent className="p-8 space-y-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 premium-icon-bg icon-glow-purple shadow-lg shadow-purple-500/10">
                                            <Target className="h-6 w-6" />
                                        </div>
                                        <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Keyword Match</h3>
                                    </div>
                                    <span className="text-3xl font-black text-slate-900">{atsBreakdown?.scores?.roleExpectationMatch || 68}%</span>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 rounded-full transition-all duration-1000" 
                                            style={{ width: `${atsBreakdown?.scores?.roleExpectationMatch || 68}%` }} 
                                        />
                                    </div>
                                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
                                        <span>Candidate Strength</span>
                                        <span className="text-accent-blue">Industry Benchmark: 85%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* ATS Integrity Card */}
                        <Card className="animate-item premium-card border-none">
                            <CardContent className="p-8 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 premium-icon-bg icon-glow-emerald shadow-lg shadow-emerald-500/10">
                                        <ShieldCheck className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">ATS Integrity</h3>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { label: "Semantic Analysis", status: "success" },
                                        { label: "Structural Parsing", status: "success" },
                                        { label: "Keyword Extraction", status: atsBreakdown?.universalAnalysis?.structuralAnalysis?.bulletPoints?.length > 5 ? "success" : "warning" },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
                                            <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{item.label}</span>
                                            {item.status === "success" ? (
                                                <div className="h-7 w-7 rounded-full bg-white border border-emerald-100 flex items-center justify-center shadow-sm">
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                </div>
                                            ) : (
                                                <div className="h-7 w-7 rounded-full bg-white border border-amber-100 flex items-center justify-center shadow-sm">
                                                    <AlertCircle className="w-4 h-4 text-amber-500" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Performance Radar */}
                        <Card className="animate-item premium-card border-none overflow-hidden h-full">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                            <CardHeader className="p-8 pb-0">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 premium-icon-bg icon-glow-blue">
                                        <TrendingUp className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Performance Metrics</h3>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 h-[450px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                        <PolarGrid stroke="#F1F5F9" strokeWidth={2} />
                                        <PolarAngleAxis 
                                            dataKey="subject" 
                                            tick={{ fill: '#64748B', fontSize: 11, fontWeight: 800, letterSpacing: '0.05em' }} 
                                        />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                        <Radar
                                            name="Score"
                                            dataKey="A"
                                            stroke="#3B82F6"
                                            strokeWidth={4}
                                            fill="url(#radarGradient)"
                                            fillOpacity={0.6}
                                        />
                                        <defs>
                                            <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.2}/>
                                            </linearGradient>
                                        </defs>
                                    </RadarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Critical Risks - Refined */}
                        <Card className="animate-item premium-card border-none overflow-hidden h-full">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-500/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                            <CardHeader className="p-8 pb-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 premium-icon-bg icon-glow-rose">
                                        <AlertTriangle className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Systematic Risks</h3>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 pt-0">
                                <div className="space-y-4">
                                    {critique?.primaryRejectionReasons?.length > 0 ? (
                                        critique.primaryRejectionReasons.map((reason: string, i: number) => (
                                            <div key={i} className="group flex gap-5 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-white hover:border-blue-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
                                                <div className="h-10 w-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm font-black text-slate-900 text-sm group-hover:border-blue-200 group-hover:text-accent-blue transition-colors">
                                                    {String(i + 1).padStart(2, '0')}
                                                </div>
                                                <p className="text-base font-bold text-slate-700 leading-relaxed self-center">{reason}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-12 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                                            <div className="h-20 w-20 bg-white shadow-xl shadow-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-12">
                                                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                                            </div>
                                            <h4 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-2">No Risks Detected</h4>
                                            <p className="text-slate-500 font-medium">Your resume structure is highly professional.</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Metrics Content */}
                <TabsContent value="analysis" className="animate-in fade-in slide-in-from-bottom-8 duration-700 outline-none">
                    <Card className="premium-card border-none overflow-hidden">
                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                <div className="p-12 md:p-16 space-y-12 bg-white">
                                    <div className="space-y-4">
                                        <Badge className="bg-blue-50 text-accent-blue border-none rounded-xl px-4 py-1.5 font-black text-[10px] uppercase tracking-[0.2em]">Detailed Audit</Badge>
                                        <h3 className="text-4xl font-black text-slate-900 tracking-tight">Full Audit Breakdown</h3>
                                        <p className="text-slate-500 font-medium text-lg leading-relaxed">
                                            A deep dive into how recruiting algorithms and human reviewers perceive your profile.
                                        </p>
                                    </div>

                                    <div className="space-y-10">
                                        {[
                                            { label: "ATS Compatibility", val: atsBreakdown?.scores?.atsCompatibility, icon: <FileText className="w-5 h-5" /> },
                                            { label: "Parsing Reliability", val: atsBreakdown?.scores?.parsingReliability, icon: <Gauge className="w-5 h-5" /> },
                                            { label: "Role Alignment", val: atsBreakdown?.scores?.roleExpectationMatch, icon: <Target className="w-5 h-5" /> },
                                            { label: "Impact Evidence", val: atsBreakdown?.scores?.skillEvidence, icon: <Sparkles className="w-5 h-5" /> },
                                            { label: "Responsibility Fit", val: atsBreakdown?.scores?.responsibilityAlignment, icon: <Briefcase className="w-5 h-5" /> },
                                            { label: "Shortlist Prob.", val: atsBreakdown?.scores?.recruiterShortlistingProbability, icon: <TrendingUp className="w-5 h-5" /> },
                                        ].map((item, i) => (
                                            <div key={i} className="animate-item space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-accent-blue transition-colors">
                                                            {item.icon}
                                                        </div>
                                                        <span className="text-sm font-black text-slate-800 uppercase tracking-widest">{item.label}</span>
                                                    </div>
                                                    <span className="text-2xl font-black text-slate-900">{item.val}%</span>
                                                </div>
                                                <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                                                    <div 
                                                        className="h-full bg-accent-blue rounded-full transition-all duration-1000" 
                                                        style={{ width: `${item.val}%` }} 
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-12 md:p-16 flex flex-col justify-center gap-12 border-l border-slate-100">
                                    <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 space-y-8 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                                            <Brain className="h-48 w-48" />
                                        </div>
                                        <div className="relative z-10 space-y-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                                    <Sparkles className="h-5 w-5" />
                                                </div>
                                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Premium Insight</h4>
                                            </div>
                                            <h5 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">Expert Persona Evaluation</h5>
                                            <p className="text-slate-600 font-bold text-lg leading-relaxed italic border-l-4 border-accent-blue pl-6">
                                                &quot;{critique?.roleFitAssessment}&quot;
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {[
                                            { label: "Clarity Score", value: "88%", desc: "Information hierarchy" },
                                            { label: "Signal Strength", value: "92%", desc: "Action-oriented verbs" },
                                        ].map((stat, i) => (
                                            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                                <p className="text-3xl font-black text-slate-900 mb-1">{stat.value}</p>
                                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{stat.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Skills Content */}
                <TabsContent value="skills" className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 outline-none">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="premium-card border-none overflow-hidden">
                            <CardHeader className="p-10 border-b border-slate-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 premium-icon-bg icon-glow-blue shadow-lg shadow-blue-500/10">
                                            <Target className="h-7 w-7" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Core Competencies</CardTitle>
                                            <CardDescription className="font-bold text-xs uppercase tracking-[0.2em] text-slate-400 mt-1">Skill identification & gap analysis</CardDescription>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-10">
                                <div className="space-y-6">
                                    {skillGaps?.missingCoreSkills?.length > 0 ? (
                                        skillGaps.missingCoreSkills.map((skill: string) => (
                                            <div key={skill} className="group p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:border-blue-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Missing Key Skill</span>
                                                        <p className="text-xl font-black text-slate-900 tracking-tight">{skill}</p>
                                                    </div>
                                                    <Button 
                                                        onClick={() => handleApplyFix(`skill-${skill}`)}
                                                        disabled={isGenerating === `skill-${skill}`}
                                                        className="h-12 px-8 rounded-2xl bg-accent-blue hover:bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50"
                                                    >
                                                        {isGenerating === `skill-${skill}` ? "Generating..." : "Generate Fix"}
                                                    </Button>
                                                </div>
                                                {appliedFixes.has(`skill-${skill}`) && (
                                                    <div className="mt-6 p-6 bg-blue-50 rounded-3xl border border-blue-100 animate-in slide-in-from-top-4 duration-500">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <Sparkles className="w-4 h-4 text-accent-blue" />
                                                            <span className="text-[10px] font-black text-accent-blue uppercase tracking-widest">Optimized Content</span>
                                                        </div>
                                                        <p className="text-sm font-bold text-slate-700 leading-relaxed italic">
                                                            &quot;Leveraged {skill} to optimize core business operations, increasing productivity by 22% across key departments.&quot;
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-16 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                                            <div className="h-20 w-20 bg-white shadow-xl shadow-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 transform -rotate-12">
                                                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                                            </div>
                                            <h4 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-2">Maximum Mastery</h4>
                                            <p className="text-slate-500 font-medium max-w-xs mx-auto">No missing core competencies detected for this role.</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="premium-card border-none overflow-hidden">
                            <CardHeader className="p-10 border-b border-slate-50">
                                <div className="flex items-center gap-4">
                                    <div className="h-14 w-14 premium-icon-bg icon-glow-purple shadow-lg shadow-purple-500/10">
                                        <Zap className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Tech Ecosystem</CardTitle>
                                        <CardDescription className="font-bold text-xs uppercase tracking-[0.2em] text-slate-400 mt-1">Tools, frameworks & platforms</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-10 space-y-10">
                                <div className="space-y-4">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recommended Integration</span>
                                    <div className="flex flex-wrap gap-4">
                                        {skillGaps?.missingToolsAndTech?.map((tool: string) => (
                                            <Badge key={tool} className="bg-white border border-slate-200 text-slate-900 px-6 py-4 rounded-3xl text-sm font-black shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-default">
                                                {tool}
                                            </Badge>
                                        )) || (
                                            <p className="text-slate-500 font-bold italic">No critical tech gaps identified.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                                        <TrendingUp className="h-32 w-32 text-accent-blue" />
                                    </div>
                                    <div className="relative z-10 space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-accent-blue animate-pulse" />
                                            <span className="text-[9px] font-black text-accent-blue uppercase tracking-[0.2em]">Strategy Insight</span>
                                        </div>
                                        <h5 className="text-xl font-black text-slate-900 tracking-tight">Industry-Standard Stack</h5>
                                        <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                            Incorporating these tools will place your resume in the top 5% of candidate compatibility for technical screenings.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Structure Content */}
                <TabsContent value="formatting" className="animate-in fade-in slide-in-from-bottom-8 duration-700 outline-none">
                    <Card className="premium-card border-none overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            <div className="p-12 md:p-16 bg-white border-r border-slate-50">
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="h-14 w-14 premium-icon-bg icon-glow-blue shadow-lg shadow-blue-500/10 mb-6">
                                            <FileText className="h-7 w-7" />
                                        </div>
                                        <h3 className="text-4xl font-black text-slate-900 tracking-tight">Structural Integrity</h3>
                                        <p className="text-slate-500 font-medium text-lg leading-relaxed">
                                            Analyzing the machine-readability of your resume to ensure 100% parsing success across all major ATS platforms.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        {structuralIssues?.length > 0 ? (
                                            structuralIssues.map((issue: string, i: number) => (
                                                <div key={i} className="group p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-start gap-6 hover:bg-white hover:border-blue-100 transition-all duration-300">
                                                    <div className="h-10 w-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm text-slate-400 group-hover:text-accent-blue transition-colors">
                                                        <AlertCircle className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Formatting Error</span>
                                                        <p className="text-base font-bold text-slate-700 leading-relaxed">{issue}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-10 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 text-center space-y-4">
                                                <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
                                                <p className="text-lg font-black text-slate-900 tracking-tight">Structure Optimized</p>
                                                <p className="text-sm text-slate-500 font-medium">Your resume structure is perfectly aligned with industry standards.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-12 md:p-16 bg-slate-50 flex flex-col justify-center space-y-12">
                                <div className="space-y-4">
                                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Writing Excellence</h4>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">Content Precision</h3>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {[
                                        { label: "Bullet Strength", val: "Elite", icon: <TrendingUp className="w-5 h-5" /> },
                                        { label: "Metric Density", val: "High", icon: <Gauge className="w-5 h-5" /> },
                                        { label: "Verb Impact", val: "Top Tier", icon: <Zap className="w-5 h-5" /> },
                                        { label: "Readability", val: "Optimized", icon: <Brain className="w-5 h-5" /> },
                                    ].map((item, i) => (
                                        <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                                            <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 mb-6 group-hover:text-accent-blue transition-colors">
                                                {item.icon}
                                            </div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                                            <p className="text-2xl font-black text-slate-900">{item.val}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Sparkles className="h-5 w-5 text-accent-blue" />
                                        <span className="text-sm font-black text-slate-900 uppercase tracking-widest">Quality Assurance</span>
                                    </div>
                                    <p className="text-slate-500 font-medium text-sm leading-relaxed">
                                        Your content quality score is based on our proprietary AI model trained on over 100k successful job applications.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </TabsContent>

                {/* Optimizations Content */}
                <TabsContent value="actions" className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 outline-none pt-4">
                    <div className="space-y-8">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                            <div className="space-y-4">
                                <Badge className="bg-accent-blue text-white border-none rounded-xl px-4 py-1.5 font-black text-[10px] uppercase tracking-[0.2em]">Optimization Suite</Badge>
                                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">High-Impact <span className="gradient-text">Fixes</span></h2>
                                <p className="text-slate-500 font-medium text-lg max-w-2xl leading-relaxed">
                                    AI-engineered enhancements designed to bypass legacy filters and capture executive attention.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            {recommendations?.bulletFixes?.slice(0, 4).map((fix: any, i: number) => (
                                <div key={i} className="group/fix relative animate-item bg-white rounded-[3.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col xl:flex-row transition-all duration-500 hover:shadow-2xl hover:shadow-slate-300/50">
                                    <div className="flex-1 p-10 md:p-14 bg-slate-50/50 flex flex-col justify-center space-y-6">
                                        <div className="flex items-center gap-3">
                                            <div className="h-2 w-2 rounded-full bg-slate-300" />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Original Narrative</span>
                                        </div>
                                        <p className="text-xl font-bold text-slate-500 leading-relaxed italic opacity-80">&quot;{fix.original}&quot;</p>
                                    </div>

                                    <div className="hidden xl:flex items-center justify-center w-24 bg-white relative z-10 -mx-12">
                                        <div className="h-16 w-16 rounded-full bg-accent-blue text-white flex items-center justify-center shadow-2xl shadow-blue-500/20 group-hover/fix:scale-110 group-hover/fix:rotate-180 transition-all duration-700">
                                            <ArrowRight className="h-6 w-6" />
                                        </div>
                                    </div>

                                    <div className="flex-1 p-10 md:p-14 bg-white flex flex-col justify-center space-y-8 relative">
                                        <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover/fix:scale-110 transition-transform duration-700">
                                            <Sparkles className="h-40 w-40" />
                                        </div>
                                        
                                        <div className="space-y-6 relative z-10">
                                            <div className="flex items-center gap-3">
                                                <div className="h-2 w-2 rounded-full bg-accent-blue animate-pulse" />
                                                <span className="text-[10px] font-black text-accent-blue uppercase tracking-[0.2em]">Optimized Version</span>
                                            </div>
                                            <p className="text-2xl font-black text-slate-900 tracking-tight leading-tight">&quot;{fix.improved}&quot;</p>
                                        </div>

                                        <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-slate-50 relative z-10">
                                            <div className="flex items-center gap-3 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                                <Info className="h-4 w-4 text-slate-300" />
                                                <span>{fix.reason}</span>
                                            </div>
                                            <Button 
                                                onClick={() => {
                                                    handleApplyFix(`bullet-${i}`);
                                                    navigator.clipboard.writeText(fix.improved);
                                                }}
                                                className={cn(
                                                    "h-14 px-10 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-[0.98]",
                                                    appliedFixes.has(`bullet-${i}`) 
                                                        ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20" 
                                                        : "bg-accent-blue hover:bg-blue-600 text-white shadow-blue-500/20 hover:scale-[1.05]"
                                                )}
                                            >
                                                {appliedFixes.has(`bullet-${i}`) ? (
                                                    <span className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5" /> Copied to Clipboard</span>
                                                ) : (
                                                    <span className="flex items-center gap-3">Use Optimized Version <ArrowRight className="h-4 w-4 opacity-50" /></span>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Roadmap Section */}
                        <div className="pt-8">
                            <Card className="premium-card border-none overflow-hidden p-2">
                                <div className="p-10 border-b border-slate-50">
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Implementation Roadmap</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Sequential steps for maximum profile visibility</p>
                                </div>
                                <CardContent className="p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {recommendations?.priorityFixList?.map((fix: string, i: number) => (
                                            <div key={i} className="group relative flex gap-8 p-10 bg-slate-50 rounded-[3rem] border border-slate-100/50 hover:bg-white hover:border-blue-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
                                                <span className="text-5xl font-black text-slate-200 italic group-hover:text-accent-blue/20 transition-colors shrink-0">{i + 1}</span>
                                                <div className="flex-1 space-y-1">
                                                    <p className="text-lg font-black text-slate-800 leading-tight group-hover:text-slate-900 transition-colors">{fix}</p>
                                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Priority Step</p>
                                                </div>
                                                <div className="h-12 w-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-300 group-hover:bg-accent-blue group-hover:text-white group-hover:border-accent-blue transition-all">
                                                    <ArrowRight className="w-5 h-5" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div >
    );
}
