"use client";

import React, { useState, useEffect, useRef } from "react";
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
    Gauge,
    Copy,
    Mail,
    Phone,
    Linkedin,
    Github,
    Link,
    Hash,
    RefreshCw,
    FileCheck,
    Type,
    // NEW FEATURE ICONS
    BookOpen,
    Network,
    Route,
    GraduationCap,
    Flame,
    Eye,
    MessageSquare,
    BarChart3
} from "lucide-react";
import { cn, getScoreColor, getScoreBgColor, getScoreLabel } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface InteractiveReportProps {
    review: any;
}

export function InteractiveReport({ review }: InteractiveReportProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [appliedFixes, setAppliedFixes] = useState<Set<string>>(new Set());
    const [isGenerating, setIsGenerating] = useState<string | null>(null);
    const [isExporting, setIsExporting] = useState(false);

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

    // CRITICAL FIX: universalAnalysis is stored inside atsBreakdown, not at top level
    const universalAnalysis = atsBreakdown?.universalAnalysis || review?.universalAnalysis;

    // Extract Enhancv-style checks
    const enhancvChecks = atsBreakdown?.enhancvChecks || universalAnalysis?.enhancvChecks;

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
            // Add print styles dynamically
            const printStyles = document.createElement('style');
            printStyles.id = 'print-styles';
            printStyles.innerHTML = `
                @media print {
                    /* Hide non-essential elements */
                    nav, footer, .no-print, button, .export-buttons {
                        display: none !important;
                    }
                    
                    /* Page settings */
                    @page {
                        margin: 0.5in 0.6in;
                        size: A4;
                    }
                    
                    /* CRITICAL: Preserve ALL colors and backgrounds */
                    *, *::before, *::after {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                    
                    /* Reset body for print */
                    body, html {
                        width: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important;
                    }
                    
                    /* Preserve gradients and backgrounds */
                    [class*="bg-gradient"], [class*="from-"], [class*="to-"] {
                        background-image: inherit !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    
                    /* Preserve colored backgrounds */
                    [class*="bg-blue"], [class*="bg-green"], [class*="bg-red"], 
                    [class*="bg-orange"], [class*="bg-purple"], [class*="bg-cyan"],
                    [class*="bg-slate"], [class*="bg-emerald"], [class*="bg-amber"] {
                        background-color: inherit !important;
                        -webkit-print-color-adjust: exact !important;
                    }
                    
                    /* Preserve text colors */
                    [class*="text-blue"], [class*="text-green"], [class*="text-red"],
                    [class*="text-orange"], [class*="text-purple"], [class*="text-cyan"],
                    [class*="text-slate"], [class*="text-emerald"], [class*="text-amber"] {
                        color: inherit !important;
                    }
                    
                    /* Preserve borders */
                    [class*="border"] {
                        border-color: inherit !important;
                    }
                    
                    /* Card styling for print */
                    .premium-card, [class*="rounded"] {
                        box-shadow: 0 1px 3px rgba(0,0,0,0.12) !important;
                        border: 1px solid #e2e8f0 !important;
                        border-radius: 12px !important;
                        overflow: hidden !important;
                        background: white !important;
                    }
                    
                    /* Score circle preservation */
                    .score-ring, [class*="ring"] {
                        stroke: inherit !important;
                        -webkit-print-color-adjust: exact !important;
                    }
                    
                    /* Badge styling */
                    [class*="badge"], [class*="chip"] {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    
                    /* Spacing adjustments */
                    section {
                        margin-bottom: 1.5rem !important;
                    }
                    
                    .mb-16, .mb-12 {
                        margin-bottom: 1.5rem !important;
                    }
                    
                    .mb-10, .mb-8 {
                        margin-bottom: 1rem !important;
                    }
                    
                    .gap-6, .gap-8 {
                        gap: 1rem !important;
                    }
                    
                    .p-8, .p-6 {
                        padding: 1.25rem !important;
                    }
                    
                    /* Typography improvements */
                    h1 { font-size: 1.75rem !important; }
                    h2 { font-size: 1.35rem !important; }
                    h3 { font-size: 1.1rem !important; }
                    p, li { font-size: 0.9rem !important; }
                    
                    /* Page break control */
                    .premium-card, .card {
                        break-inside: avoid;
                        page-break-inside: avoid;
                    }
                    
                    h2, h3 {
                        break-after: avoid;
                        page-break-after: avoid;
                    }
                    
                    /* Grid layout preservation */
                    .grid {
                        display: grid !important;
                    }
                    
                    .grid-cols-2 {
                        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                    }
                    
                    .grid-cols-3 {
                        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
                    }
                    
                    /* Flex layout preservation */
                    .flex {
                        display: flex !important;
                    }
                    
                    .flex-col {
                        flex-direction: column !important;
                    }
                    
                    /* Icon visibility */
                    svg {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    
                    /* Score bar colors */
                    [style*="background"] {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    
                    /* Rounded corners */
                    .rounded-xl {
                        border-radius: 12px !important;
                    }
                    
                    .rounded-2xl, .rounded-3xl {
                        border-radius: 16px !important;
                    }
                    
                    .rounded-full {
                        border-radius: 9999px !important;
                    }
                    
                    /* Text selection for copy */
                    * {
                        user-select: text !important;
                        -webkit-user-select: text !important;
                    }
                    
                    /* Report header special treatment */
                    .animate-item:first-child {
                        border-radius: 16px !important;
                    }
                }
            `;
            document.head.appendChild(printStyles);

            // Wait for styles to apply
            await new Promise(resolve => setTimeout(resolve, 100));

            // Trigger print dialog
            window.print();

            // Clean up print styles after print dialog
            setTimeout(() => {
                const styleEl = document.getElementById('print-styles');
                if (styleEl) styleEl.remove();
            }, 1000);

        } catch (error) {
            console.error('PDF Export Error:', error);
            alert('Failed to export PDF. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    // Section Header Component for consistency
    const SectionHeader = ({ icon, title, subtitle, iconColor = "blue" }: { icon: React.ReactNode, title: string, subtitle?: string, iconColor?: string }) => (
        <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-accent-blue">
                {icon}
            </div>
            <div>
                <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
                {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
            </div>
        </div>
    );

    return (
        <div ref={containerRef} className="flex flex-col pb-20">
            {/* Header Section - Sticky */}
            <div ref={headerRef} className="animate-item relative overflow-hidden bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-1 mb-16">
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

            {/* ===== SECTION 1: Executive Summary ===== */}
            <section className="animate-item mb-16">
                <SectionHeader icon={<Brain className="h-7 w-7" />} title="Executive Summary" subtitle="AI-powered analysis verdict" iconColor="blue" />
                <Card className="premium-card border-none">
                    <CardContent className="p-10">
                        <div className="relative">
                            <div className="absolute -left-2 top-0 bottom-0 w-1 bg-accent-blue rounded-full" />
                            <p className="pl-8 text-xl md:text-2xl font-bold text-slate-700 leading-relaxed italic">
                                &quot;{critique?.summaryVerdict}&quot;
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* ===== SECTION 2: Performance Metrics ===== */}
            <section className="animate-item mb-16">
                <SectionHeader icon={<TrendingUp className="h-7 w-7" />} title="Performance Metrics" subtitle="Detailed audit breakdown" iconColor="blue" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Scores */}
                    <Card className="premium-card border-none">
                        <CardContent className="p-6 space-y-4">
                            {[
                                { label: "ATS Compatibility", val: atsBreakdown?.scores?.atsCompatibility, icon: <FileText className="w-4 h-4" />, tip: "Resume format and structure readability" },
                                { label: "Parsing Reliability", val: atsBreakdown?.scores?.parsingReliability, icon: <Gauge className="w-4 h-4" />, tip: "How accurately ATS extracts your info" },
                                { label: "Role Alignment", val: atsBreakdown?.scores?.roleExpectationMatch, icon: <Target className="w-4 h-4" />, tip: "Match between your experience and role requirements" },
                                { label: "Impact Evidence", val: atsBreakdown?.scores?.skillEvidence, icon: <Sparkles className="w-4 h-4" />, tip: "Strength of quantifiable achievements" },
                                { label: "Responsibility Fit", val: atsBreakdown?.scores?.responsibilityAlignment, icon: <Briefcase className="w-4 h-4" />, tip: "Alignment with expected job duties" },
                                { label: "Shortlist Probability", val: atsBreakdown?.scores?.recruiterShortlistingProbability, icon: <TrendingUp className="w-4 h-4" />, tip: "Likelihood of passing initial screening" },
                            ].map((item, i) => (
                                <div key={i} className="py-3 border-b border-slate-50 last:border-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <span className="text-sm font-bold text-slate-700">{item.label}</span>
                                                <p className="text-xs text-slate-400">{item.tip}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-accent-blue rounded-full transition-all duration-1000"
                                                    style={{ width: `${item.val}%` }}
                                                />
                                            </div>
                                            <span className="text-lg font-black text-slate-900 w-12 text-right">{item.val}%</span>
                                        </div>
                                    </div>
                                    {item.val < 70 && (
                                        <p className="text-xs text-slate-500 ml-11 bg-slate-50 px-2 py-1 rounded-md inline-block">
                                            💡 {item.val < 50 ? "Needs significant improvement" : "Room for improvement"}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Radar Chart */}
                    <Card ref={radarChartRef} className="premium-card border-none">
                        <CardHeader className="p-6 pb-0">
                            <h3 className="text-lg font-bold text-slate-900">Performance Radar</h3>
                        </CardHeader>
                        <CardContent className="p-6 h-[380px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                    <PolarGrid stroke="#E2E8F0" strokeWidth={1} />
                                    <PolarAngleAxis
                                        dataKey="subject"
                                        tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }}
                                    />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar
                                        name="Score"
                                        dataKey="A"
                                        stroke="#3B82F6"
                                        strokeWidth={2}
                                        fill="#3B82F6"
                                        fillOpacity={0.15}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* ===== ATS ESSENTIALS - Clean Professional Design ===== */}
            {enhancvChecks && (
                <section className="animate-item mb-16">
                    <SectionHeader icon={<FileCheck className="h-7 w-7" />} title="ATS Essentials" subtitle="Resume compatibility checks" iconColor="blue" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* ATS Parse Rate */}
                        <Card className="premium-card border-none">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                                            <Gauge className="h-5 w-5 text-slate-600" />
                                        </div>
                                        <span className="font-bold text-slate-900">ATS Parse Rate</span>
                                    </div>
                                    <span className="text-2xl font-black text-slate-900">{enhancvChecks.atsParseRate?.percentage || 0}%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {enhancvChecks.atsParseRate?.status === "success" ? (
                                        <CheckCircle2 className="h-4 w-4 text-accent-blue" />
                                    ) : (
                                        <AlertTriangle className="h-4 w-4 text-slate-400" />
                                    )}
                                    <span className="text-sm text-slate-500">{enhancvChecks.atsParseRate?.message}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quantify Impact */}
                        <Card className="premium-card border-none">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                                            <Hash className="h-5 w-5 text-slate-600" />
                                        </div>
                                        <span className="font-bold text-slate-900">Quantified Bullets</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xl font-black text-slate-900">{enhancvChecks.quantifyImpact?.bulletsWithMetrics || 0}</span>
                                        <span className="text-slate-400">/{enhancvChecks.quantifyImpact?.totalBullets || 0}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {enhancvChecks.quantifyImpact?.status === "success" ? (
                                        <CheckCircle2 className="h-4 w-4 text-accent-blue" />
                                    ) : (
                                        <AlertTriangle className="h-4 w-4 text-slate-400" />
                                    )}
                                    <span className="text-sm text-slate-500">
                                        {enhancvChecks.quantifyImpact?.status === "success" ? "Good metric coverage" : "Add more quantifiable results"}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Repetition */}
                        <Card className="premium-card border-none">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                                            <RefreshCw className="h-5 w-5 text-slate-600" />
                                        </div>
                                        <span className="font-bold text-slate-900">Word Variety</span>
                                    </div>
                                    {enhancvChecks.repetition?.status === "success" ? (
                                        <CheckCircle2 className="h-5 w-5 text-accent-blue" />
                                    ) : (
                                        <AlertTriangle className="h-5 w-5 text-slate-400" />
                                    )}
                                </div>
                                <p className="text-sm text-slate-500">{enhancvChecks.repetition?.message}</p>
                                {enhancvChecks.repetition?.repeatedWords?.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                        {enhancvChecks.repetition.repeatedWords.slice(0, 3).map((item: { word: string; count: number }, i: number) => (
                                            <span key={i} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                                                {item.word} ({item.count}x)
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Essential Sections */}
                        <Card className="premium-card border-none">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                                        <FileText className="h-5 w-5 text-slate-600" />
                                    </div>
                                    <span className="font-bold text-slate-900">Essential Sections</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex flex-wrap gap-1.5">
                                        {enhancvChecks.essentialSections?.found?.map((section: string, i: number) => (
                                            <span key={i} className="text-xs px-2 py-1 bg-blue-50 text-accent-blue rounded-md flex items-center gap-1">
                                                <CheckCircle2 className="h-3 w-3" /> {section}
                                            </span>
                                        ))}
                                    </div>
                                    {enhancvChecks.essentialSections?.missing?.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {enhancvChecks.essentialSections.missing.map((section: string, i: number) => (
                                                <span key={i} className="text-xs px-2 py-1 bg-slate-100 text-slate-500 rounded-md flex items-center gap-1">
                                                    <XCircle className="h-3 w-3" /> {section}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card className="premium-card border-none">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                                        <Mail className="h-5 w-5 text-slate-600" />
                                    </div>
                                    <span className="font-bold text-slate-900">Contact Details</span>
                                </div>
                                <div className="space-y-2">
                                    {enhancvChecks.contactInfo?.found?.map((item: { type: string; value: string }, i: number) => (
                                        <div key={i} className="flex items-center gap-2 text-sm">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-accent-blue shrink-0" />
                                            <span className="text-slate-600 truncate">{item.type}</span>
                                        </div>
                                    ))}
                                    {enhancvChecks.contactInfo?.missing?.map((item: string, i: number) => (
                                        <div key={i} className="flex items-center gap-2 text-sm">
                                            <XCircle className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                                            <span className="text-slate-400">{item} missing</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Professional Email & Links */}
                        <Card className="premium-card border-none">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                                        <Link className="h-5 w-5 text-slate-600" />
                                    </div>
                                    <span className="font-bold text-slate-900">Email & URLs</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        {enhancvChecks.emailCheck?.status === "success" ? (
                                            <CheckCircle2 className="h-3.5 w-3.5 text-accent-blue shrink-0" />
                                        ) : (
                                            <AlertTriangle className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                        )}
                                        <span className="text-slate-600">{enhancvChecks.emailCheck?.isProfessional ? "Professional email" : "Review email address"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        {enhancvChecks.headerLinks?.hasFullUrls ? (
                                            <CheckCircle2 className="h-3.5 w-3.5 text-accent-blue shrink-0" />
                                        ) : (
                                            <AlertTriangle className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                        )}
                                        <span className="text-slate-600">{enhancvChecks.headerLinks?.hasFullUrls ? "Full URLs detected" : "Add full URLs for ATS"}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            )}

            {/* ===== SECTION 14: Keyword Analysis ===== */}
            {universalAnalysis?.keywordAnalysis && (
                <section className="animate-item mb-16">
                    <SectionHeader icon={<BarChart3 className="h-7 w-7" />} title="Keyword Density Analysis" subtitle="How well your resume matches ATS keywords" iconColor="blue" />
                    <Card className="premium-card border-none">
                        <CardContent className="p-6">
                            {/* Role Relevance Score */}
                            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-accent-blue uppercase tracking-wide mb-1">Role Keyword Relevance</p>
                                        <p className="text-sm text-slate-600">{universalAnalysis.keywordAnalysis.explanation}</p>
                                    </div>
                                    <div className="text-3xl font-bold text-accent-blue">{universalAnalysis.keywordAnalysis.roleRelevanceScore}%</div>
                                </div>
                            </div>

                            {/* Top Keywords */}
                            {universalAnalysis.keywordAnalysis.topKeywords?.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-sm font-semibold text-slate-700 mb-4">Top Keywords Detected</p>
                                    <div className="space-y-3">
                                        {universalAnalysis.keywordAnalysis.topKeywords.map((kw: any, i: number) => (
                                            <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <Hash className="h-4 w-4 text-accent-blue" />
                                                        <span className="font-bold text-slate-900">{kw.word}</span>
                                                    </div>
                                                    <Badge variant="outline" className="bg-blue-50 text-blue-700">{kw.totalCount}x</Badge>
                                                </div>
                                                <p className="text-sm text-slate-600 mb-2">{kw.explanation}</p>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <span>Found in:</span>
                                                    <div className="flex gap-1">
                                                        {kw.sections?.map((s: string, j: number) => (
                                                            <Badge key={j} variant="secondary" className="text-xs">{s}</Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </section>
            )}

            {/* ===== SECTION 3: Critical Risks ===== */}
            {critique?.primaryRejectionReasons?.length > 0 && (
                <section className="animate-item mb-16">
                    <SectionHeader icon={<AlertTriangle className="h-7 w-7" />} title="Critical Rejection Risks" subtitle="Areas requiring attention" iconColor="blue" />
                    <Card className="premium-card border-none">
                        <CardContent className="p-6">
                            <div className="space-y-3">
                                {critique.primaryRejectionReasons.map((reason: string, i: number) => (
                                    <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="h-7 w-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 text-sm font-bold text-slate-500">
                                            {i + 1}
                                        </div>
                                        <p className="text-sm font-medium text-slate-700 leading-relaxed self-center">{reason}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </section>
            )}

            {/* ===== SECTION 4: Role Fit Assessment ===== */}
            {critique?.roleFitAssessment && (
                <section className="animate-item mb-16">
                    <SectionHeader icon={<Target className="h-7 w-7" />} title="Role Fit Assessment" subtitle="Expert evaluation" iconColor="blue" />

                    {/* Main Assessment Quote */}
                    <Card className="premium-card border-none mb-6">
                        <CardContent className="p-6">
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                <p className="text-base font-medium text-slate-700 leading-relaxed border-l-2 border-accent-blue pl-4">
                                    &quot;{critique.roleFitAssessment}&quot;
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Expectations Met vs Differ */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Expectations Met */}
                        <Card className="premium-card border-none">
                            <CardHeader className="p-6 border-b border-slate-50">
                                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-accent-blue" />
                                    Expectations Met
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                {universalAnalysis?.roleReasoning?.expectationsMet?.length > 0 ? (
                                    <div className="space-y-3">
                                        {universalAnalysis.roleReasoning.expectationsMet.slice(0, 4).map((exp: any, i: number) => (
                                            <div key={i} className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                                <p className="text-sm font-bold text-slate-800">{exp.expectation}</p>
                                                <p className="text-xs text-slate-500 mt-1">{exp.assessment}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500">No specific expectations identified</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Expectations That Differ */}
                        <Card className="premium-card border-none">
                            <CardHeader className="p-6 border-b border-slate-50">
                                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-slate-400" />
                                    Areas to Strengthen
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                {universalAnalysis?.roleReasoning?.expectationsDiffer?.length > 0 ? (
                                    <div className="space-y-3">
                                        {universalAnalysis.roleReasoning.expectationsDiffer.slice(0, 4).map((exp: any, i: number) => (
                                            <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                <p className="text-sm font-bold text-slate-800">{exp.expectation}</p>
                                                <p className="text-xs text-slate-500 mt-1">{exp.assessment}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <CheckCircle2 className="h-8 w-8 text-accent-blue mx-auto mb-2" />
                                        <p className="text-sm text-slate-500">No significant gaps identified</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </section>
            )}

            {/* ===== SECTION 9: Career Path Projection ===== */}
            {universalAnalysis?.careerPath && (
                <section className="animate-item mb-16">
                    <SectionHeader icon={<Route className="h-7 w-7" />} title="Career Path Projection" subtitle="Your trajectory and next roles" iconColor="blue" />
                    <Card className="premium-card border-none">
                        <CardContent className="p-6">
                            {/* Current Level */}
                            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <p className="text-xs font-semibold text-accent-blue uppercase tracking-wide mb-2">Current Level</p>
                                <p className="text-xl font-bold text-slate-900">{universalAnalysis.careerPath.currentLevel}</p>
                                <p className="text-sm text-slate-600 mt-2">{universalAnalysis.careerPath.currentLevelExplanation}</p>
                            </div>

                            {/* Projected Roles */}
                            <p className="text-sm font-semibold text-slate-700 mb-4">Projected Next Roles</p>
                            <div className="space-y-4 mb-6">
                                {universalAnalysis.careerPath.projectedRoles?.map((role: any, i: number) => (
                                    <div key={i} className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                                    <Briefcase className="h-5 w-5 text-accent-blue" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{role.role}</p>
                                                    <p className="text-xs text-slate-500">{role.timeframe}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-accent-blue">{role.readiness}%</div>
                                                <p className="text-xs text-slate-500">Readiness</p>
                                            </div>
                                        </div>
                                        <Progress value={role.readiness} className="h-2 mb-3" />
                                        <p className="text-sm text-slate-600 mb-3">{role.explanation}</p>
                                        {role.requirements?.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {role.requirements.map((req: string, j: number) => (
                                                    <Badge key={j} variant="outline" className="bg-white text-xs">{req}</Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Alternative Paths */}
                            {universalAnalysis.careerPath.alternativePaths?.length > 0 && (
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-xs font-semibold text-accent-blue uppercase tracking-wide mb-3">Alternative Career Paths</p>
                                    <div className="space-y-2">
                                        {universalAnalysis.careerPath.alternativePaths.map((alt: any, i: number) => (
                                            <div key={i} className="flex gap-2">
                                                <ArrowRight className="h-4 w-4 text-accent-blue mt-0.5 shrink-0" />
                                                <div>
                                                    <span className="text-sm font-medium text-slate-900">{alt.path}</span>
                                                    <span className="text-sm text-slate-500"> — {alt.reason}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {universalAnalysis.careerPath.summary && (
                                <p className="mt-4 text-sm text-slate-600 p-4 bg-slate-50 rounded-xl border-l-4 border-accent-blue">{universalAnalysis.careerPath.summary}</p>
                            )}
                        </CardContent>
                    </Card>
                </section>
            )}

            {/* ===== SECTION 5: Skills Analysis ===== */}
            <section className="animate-item mb-16">
                <SectionHeader icon={<Zap className="h-7 w-7" />} title="Skills Analysis" subtitle="Core competencies & tech ecosystem" iconColor="blue" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Detected Skills (Explicit) */}
                    <Card className="premium-card border-none">
                        <CardHeader className="p-6 border-b border-slate-50">
                            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-accent-blue" />
                                Detected Skills
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {universalAnalysis?.alignment?.explicit?.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {universalAnalysis.alignment.explicit.slice(0, 12).map((skill: any, i: number) => (
                                        <Badge key={i} className="bg-blue-50 border border-blue-100 text-accent-blue px-3 py-1.5 rounded-lg text-sm font-medium">
                                            {skill.skill}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500">No explicit skills detected</p>
                            )}
                            {universalAnalysis?.alignment?.implicit?.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-xs font-medium text-slate-500 mb-2">Implicit Skills (inferred from experience)</p>
                                    <div className="flex flex-wrap gap-2">
                                        {universalAnalysis.alignment.implicit.slice(0, 6).map((skill: any, i: number) => (
                                            <Badge key={i} className="bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-sm font-medium">
                                                {skill.skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Missing Core Skills */}
                    <Card className="premium-card border-none">
                        <CardHeader className="p-6 border-b border-slate-50">
                            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <XCircle className="h-5 w-5 text-slate-400" />
                                Skill Gaps
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {skillGaps?.missingCoreSkills?.length > 0 ? (
                                <div className="space-y-2">
                                    {skillGaps.missingCoreSkills.map((skill: string, i: number) => (
                                        <div key={skill} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                            <XCircle className="w-4 h-4 text-slate-400 shrink-0" />
                                            <span className="text-sm font-medium text-slate-700">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-100">
                                    <CheckCircle2 className="h-8 w-8 text-accent-blue mx-auto mb-2" />
                                    <p className="text-sm font-bold text-slate-900">No missing core skills</p>
                                    <p className="text-xs text-slate-500">All key competencies covered</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Tech Ecosystem */}
                    <Card className="premium-card border-none lg:col-span-2">
                        <CardHeader className="p-6 border-b border-slate-50">
                            <CardTitle className="text-lg font-bold text-slate-900">Recommended Tools & Tech</CardTitle>
                            <p className="text-sm text-slate-500 mt-1">Consider adding experience with these technologies to strengthen your profile</p>
                        </CardHeader>
                        <CardContent className="p-6">
                            {skillGaps?.missingToolsAndTech?.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {skillGaps.missingToolsAndTech.map((tool: string) => (
                                        <Badge key={tool} className="bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                                            {tool}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500">No critical tech gaps identified.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* ===== SECTION 11: Hidden Skills Detection ===== */}
            {universalAnalysis?.hiddenSkills?.skills?.length > 0 && (
                <section className="animate-item mb-16">
                    <SectionHeader icon={<Eye className="h-7 w-7" />} title="Hidden Skills Detected" subtitle="Skills implied by your experience" iconColor="blue" />
                    <Card className="premium-card border-none">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                {universalAnalysis.hiddenSkills.skills.map((skill: any, i: number) => (
                                    <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Sparkles className="h-5 w-5 text-accent-blue" />
                                                <span className="font-bold text-slate-900">{skill.skill}</span>
                                            </div>
                                            <Badge variant="outline" className={cn("text-xs", skill.confidence >= 80 ? "bg-blue-50 text-accent-blue" : "bg-slate-50 text-slate-600")}>
                                                {skill.confidence}% confident
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-slate-500 mb-2">Category: <span className="capitalize font-medium">{skill.category}</span></p>
                                        <p className="text-sm text-slate-600 mb-2">{skill.explanation}</p>
                                        <div className="text-xs text-blue-700 bg-white/50 p-2 rounded-lg border border-blue-100">
                                            <span className="font-semibold">Inferred from:</span> {skill.inferredFrom}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {universalAnalysis.hiddenSkills.summary && (
                                <p className="text-sm text-slate-600 p-4 bg-blue-50 rounded-xl border-l-4 border-accent-blue">{universalAnalysis.hiddenSkills.summary}</p>
                            )}
                        </CardContent>
                    </Card>
                </section>
            )}

            {/* ===== SECTION 12: Skills Network ===== */}
            {universalAnalysis?.skillsGraph && (
                <section className="animate-item mb-16">
                    <SectionHeader icon={<Network className="h-7 w-7" />} title="Skills Network" subtitle="How your skills connect" iconColor="blue" />
                    <Card className="premium-card border-none">
                        <CardContent className="p-6">
                            {/* Skill Clusters */}
                            {universalAnalysis.skillsGraph.clusters?.length > 0 && (
                                <div className="mb-6">
                                    <p className="text-sm font-semibold text-slate-700 mb-4">Skill Clusters</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {universalAnalysis.skillsGraph.clusters.map((cluster: any, i: number) => (
                                            <div key={i} className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                                <p className="font-bold text-slate-900 mb-2">{cluster.name}</p>
                                                <p className="text-xs text-slate-600 mb-3">{cluster.description}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {cluster.skills.map((skill: string, j: number) => (
                                                        <Badge key={j} className="bg-blue-100 text-blue-700 border-blue-200">{skill}</Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Transferable Skills */}
                            {universalAnalysis.skillsGraph.transferableSkills?.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-sm font-semibold text-slate-700 mb-4">Transferable Skills</p>
                                    <div className="space-y-3">
                                        {universalAnalysis.skillsGraph.transferableSkills.map((ts: any, i: number) => (
                                            <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Zap className="h-5 w-5 text-blue-600" />
                                                    <span className="font-bold text-slate-900">{ts.skill}</span>
                                                </div>
                                                <p className="text-sm text-slate-600 mb-2">{ts.explanation}</p>
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span className="text-slate-500">Applicable to:</span>
                                                    <div className="flex flex-wrap gap-1">
                                                        {ts.targetRoles?.map((role: string, j: number) => (
                                                            <Badge key={j} variant="outline" className="text-xs">{role}</Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {universalAnalysis.skillsGraph.summary && (
                                <p className="text-sm text-slate-600 p-4 bg-blue-50 rounded-xl border-l-4 border-accent-blue">{universalAnalysis.skillsGraph.summary}</p>
                            )}
                        </CardContent>
                    </Card>
                </section>
            )}

            {/* ===== SECTION 10: Tone & Voice Analysis ===== */}
            {universalAnalysis?.toneAnalysis && (
                <section className="animate-item mb-16">
                    <SectionHeader icon={<MessageSquare className="h-7 w-7" />} title="Tone & Voice Analysis" subtitle="How your resume sounds to recruiters" iconColor="blue" />
                    <Card className="premium-card border-none">
                        <CardContent className="p-6">
                            {/* Overall Tone */}
                            <div className="flex items-center justify-between mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <div>
                                    <p className="text-xs font-semibold text-accent-blue uppercase tracking-wide mb-1">Overall Tone</p>
                                    <p className="text-2xl font-bold text-slate-900 capitalize">{universalAnalysis.toneAnalysis.overallTone}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-accent-blue">{universalAnalysis.toneAnalysis.score}/100</div>
                                    <p className="text-xs text-slate-500">Tone Score</p>
                                </div>
                            </div>

                            {/* Tone Dimensions */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {Object.entries(universalAnalysis.toneAnalysis.dimensions || {}).map(([key, dim]: [string, any]) => (
                                    <div key={key} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm font-semibold text-slate-700 capitalize">{key}</p>
                                            <span className={cn("text-lg font-bold", dim.score >= 70 ? "text-accent-blue" : dim.score >= 50 ? "text-slate-600" : "text-slate-400")}>{dim.score}</span>
                                        </div>
                                        <Progress value={dim.score} className="h-2 mb-3" />
                                        <p className="text-xs text-slate-600">{dim.explanation}</p>
                                        {dim.examples?.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-1">
                                                {dim.examples.slice(0, 2).map((ex: string, i: number) => (
                                                    <Badge key={i} variant="secondary" className="text-xs bg-white">&quot;{ex}&quot;</Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Weak Phrases */}
                            {universalAnalysis.toneAnalysis.weakPhrases?.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-sm font-semibold text-slate-700 mb-3">Phrases to Improve</p>
                                    <div className="space-y-3">
                                        {universalAnalysis.toneAnalysis.weakPhrases.map((phrase: any, i: number) => (
                                            <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                                <div className="flex items-start gap-3">
                                                    <AlertTriangle className="h-5 w-5 text-slate-400 mt-0.5 shrink-0" />
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-slate-800">&quot;{phrase.phrase}&quot;</p>
                                                        <p className="text-xs text-slate-500 mt-1">{phrase.issue}</p>
                                                        <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
                                                            <p className="text-xs text-accent-blue"><span className="font-semibold">Try:</span> {phrase.suggestion}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {universalAnalysis.toneAnalysis.overallExplanation && (
                                <p className="text-sm text-slate-600 p-4 bg-blue-50 rounded-xl border-l-4 border-accent-blue">{universalAnalysis.toneAnalysis.overallExplanation}</p>
                            )}
                        </CardContent>
                    </Card>
                </section>
            )}

            {/* ===== SECTION 6: Structural Integrity ===== */}
            <section className="animate-item mb-16">
                <SectionHeader icon={<FileText className="h-7 w-7" />} title="Structural Integrity" subtitle="Format analysis" iconColor="blue" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Structural Issues */}
                    <Card className="premium-card border-none">
                        <CardHeader className="p-6 border-b border-slate-50">
                            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-slate-400" />
                                Formatting Issues
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {structuralIssues?.length > 0 ? (
                                <div className="space-y-2">
                                    {structuralIssues.map((issue: string, i: number) => (
                                        <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                            <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                            <p className="text-sm font-medium text-slate-700 leading-relaxed">{issue}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-100">
                                    <CheckCircle2 className="h-8 w-8 text-accent-blue mx-auto mb-2" />
                                    <p className="text-sm font-bold text-slate-900">Structure optimized</p>
                                    <p className="text-xs text-slate-500">Format aligned with standards</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Content Quality - Dynamic */}
                    <Card className="premium-card border-none">
                        <CardHeader className="p-6 border-b border-slate-50">
                            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-accent-blue" />
                                Content Quality
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    {
                                        label: "Bullet Strength",
                                        val: enhancvChecks?.quantifyImpact?.status === "success" ? "Strong" : enhancvChecks?.quantifyImpact?.status === "warning" ? "Moderate" : "Weak",
                                        icon: <TrendingUp className="w-4 h-4" />,
                                        status: enhancvChecks?.quantifyImpact?.status
                                    },
                                    {
                                        label: "Metric Density",
                                        val: `${enhancvChecks?.quantifyImpact?.bulletsWithMetrics || 0}/${enhancvChecks?.quantifyImpact?.totalBullets || 0}`,
                                        icon: <Gauge className="w-4 h-4" />,
                                        status: enhancvChecks?.quantifyImpact?.status
                                    },
                                    {
                                        label: "Word Variety",
                                        val: enhancvChecks?.repetition?.status === "success" ? "High" : "Low",
                                        icon: <Zap className="w-4 h-4" />,
                                        status: enhancvChecks?.repetition?.status
                                    },
                                    {
                                        label: "ATS Parse Rate",
                                        val: `${enhancvChecks?.atsParseRate?.percentage || 0}%`,
                                        icon: <Brain className="w-4 h-4" />,
                                        status: enhancvChecks?.atsParseRate?.status
                                    },
                                ].map((item, i) => (
                                    <div key={i} className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-center">
                                        <div className={cn(
                                            "h-8 w-8 rounded-lg flex items-center justify-center mx-auto mb-2",
                                            item.status === "success" ? "bg-blue-50 text-accent-blue" : "bg-white text-slate-400"
                                        )}>
                                            {item.icon}
                                        </div>
                                        <p className="text-xs font-medium text-slate-500 mb-1">{item.label}</p>
                                        <p className={cn(
                                            "text-sm font-bold",
                                            item.status === "success" ? "text-accent-blue" : "text-slate-900"
                                        )}>{item.val}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Content Issues */}
                    {contentIssues?.length > 0 && (
                        <Card className="premium-card border-none lg:col-span-2">
                            <CardHeader className="p-6 border-b border-slate-50">
                                <CardTitle className="text-lg font-bold text-slate-900">Content Improvements</CardTitle>
                                <p className="text-sm text-slate-500 mt-1">Additional content-related suggestions</p>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {contentIssues.map((issue: string, i: number) => (
                                        <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                            <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                            <p className="text-sm font-medium text-slate-700 leading-relaxed">{issue}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </section>

            {/* ===== SECTION 7: High-Impact Optimizations ===== */}
            {recommendations?.bulletFixes?.length > 0 && (
                <section className="animate-item mb-16">
                    <SectionHeader icon={<Sparkles className="h-7 w-7" />} title="High-Impact Optimizations" subtitle="Suggested improvements" iconColor="blue" />
                    <div className="space-y-4">
                        {recommendations.bulletFixes.slice(0, 6).map((fix: any, i: number) => (
                            <Card key={i} className="premium-card border-none">
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Original */}
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <p className="text-xs font-medium text-slate-500 uppercase mb-2">Original</p>
                                            <p className="text-sm text-slate-600 italic">&quot;{fix.original}&quot;</p>
                                        </div>

                                        {/* Optimized */}
                                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-xs font-medium text-accent-blue uppercase">Optimized</p>
                                                <Button
                                                    onClick={() => {
                                                        handleApplyFix(`bullet-${i}`);
                                                        navigator.clipboard.writeText(fix.improved);
                                                    }}
                                                    size="sm"
                                                    className={cn(
                                                        "h-7 px-3 rounded-lg text-xs font-semibold",
                                                        appliedFixes.has(`bullet-${i}`)
                                                            ? "bg-accent-blue text-white"
                                                            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                                                    )}
                                                >
                                                    {appliedFixes.has(`bullet-${i}`) ? (
                                                        <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Copied</span>
                                                    ) : (
                                                        <span className="flex items-center gap-1"><Copy className="h-3 w-3" /> Copy</span>
                                                    )}
                                                </Button>
                                            </div>
                                            <p className="text-sm font-medium text-slate-900">&quot;{fix.improved}&quot;</p>
                                            {fix.reason && (
                                                <p className="text-xs text-slate-500 mt-2">{fix.reason}</p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            {/* ===== SECTION 13: Learning Roadmap ===== */}
            {universalAnalysis?.learningRoadmap?.gaps?.length > 0 && (
                <section className="animate-item mb-16">
                    <SectionHeader icon={<GraduationCap className="h-7 w-7" />} title="Skills Gap Roadmap" subtitle="Personalized learning path" iconColor="blue" />
                    <Card className="premium-card border-none">
                        <CardContent className="p-6">
                            {/* Estimated Time */}
                            {universalAnalysis.learningRoadmap.estimatedTime && (
                                <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <p className="text-xs font-semibold text-accent-blue uppercase tracking-wide mb-1">Estimated Time to Close Gaps</p>
                                    <p className="text-xl font-bold text-slate-900">{universalAnalysis.learningRoadmap.estimatedTime}</p>
                                </div>
                            )}

                            {/* Skill Gaps */}
                            <div className="space-y-4 mb-6">
                                {universalAnalysis.learningRoadmap.gaps.map((gap: any, i: number) => (
                                    <div key={i} className={cn("p-5 rounded-xl border", gap.priority === "critical" ? "bg-slate-50 border-accent-blue/30" : "bg-slate-50 border-slate-200")}>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", gap.priority === "critical" ? "bg-blue-50" : "bg-slate-100")}>
                                                    {gap.priority === "critical" ? <Flame className="h-4 w-4 text-accent-blue" /> : <BookOpen className="h-4 w-4 text-slate-400" />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{gap.skill}</p>
                                                    <p className="text-xs text-slate-500">{gap.currentLevel} → {gap.targetLevel}</p>
                                                </div>
                                            </div>
                                            <Badge className={cn("text-xs capitalize", gap.priority === "critical" ? "bg-blue-100 text-accent-blue" : "bg-slate-100 text-slate-600")}>
                                                {gap.priority}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-4">{gap.explanation}</p>

                                        {/* Recommended Courses */}
                                        {gap.courses?.length > 0 && (
                                            <div>
                                                <p className="text-xs font-semibold text-slate-500 mb-2">Recommended Courses</p>
                                                <div className="space-y-2">
                                                    {gap.courses.map((course: any, j: number) => (
                                                        <a key={j} href={course.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                                                            <div className="flex items-center gap-3">
                                                                <GraduationCap className="h-4 w-4 text-accent-blue" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-slate-900">{course.name}</p>
                                                                    <p className="text-xs text-slate-500">{course.platform} • {course.duration}</p>
                                                                </div>
                                                            </div>
                                                            <ArrowRight className="h-4 w-4 text-slate-400" />
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Milestones */}
                            {universalAnalysis.learningRoadmap.milestones?.length > 0 && (
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-sm font-semibold text-slate-700 mb-3">Milestones</p>
                                    <div className="space-y-3">
                                        {universalAnalysis.learningRoadmap.milestones.map((ms: any, i: number) => (
                                            <div key={i} className="flex gap-3">
                                                <div className="h-6 w-6 rounded-full bg-blue-100 text-accent-blue flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">{ms.milestone}</p>
                                                    <p className="text-xs text-slate-500">{ms.timeframe} • Skills: {ms.skills?.join(", ")}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {universalAnalysis.learningRoadmap.summary && (
                                <p className="mt-4 text-sm text-slate-600 p-4 bg-blue-50 rounded-xl border-l-4 border-accent-blue">{universalAnalysis.learningRoadmap.summary}</p>
                            )}
                        </CardContent>
                    </Card>
                </section>
            )}

            {/* ===== SECTION 3: Critical Risks ===== */}
            {critique?.primaryRejectionReasons?.length > 0 && (
                <section className="animate-item mb-16">
                    <SectionHeader icon={<AlertTriangle className="h-7 w-7" />} title="Critical Rejection Risks" subtitle="Areas requiring attention" iconColor="blue" />
                    <Card className="premium-card border-none">
                        <CardContent className="p-6">
                            <div className="space-y-3">
                                {critique.primaryRejectionReasons.map((reason: string, i: number) => (
                                    <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="h-7 w-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 text-sm font-bold text-slate-500">
                                            {i + 1}
                                        </div>
                                        <p className="text-sm font-medium text-slate-700 leading-relaxed self-center">{reason}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </section>
            )}

            {/* ===== SECTION 4: Role Fit Assessment ===== */}
            {critique?.roleFitAssessment && (
                <section className="animate-item mb-16">
                    <SectionHeader icon={<Target className="h-7 w-7" />} title="Role Fit Assessment" subtitle="Expert evaluation" iconColor="blue" />

                    {/* Main Assessment Quote */}
                    <Card className="premium-card border-none mb-6">
                        <CardContent className="p-6">
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                <p className="text-base font-medium text-slate-700 leading-relaxed border-l-2 border-accent-blue pl-4">
                                    &quot;{critique.roleFitAssessment}&quot;
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Expectations Met vs Differ */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Expectations Met */}
                        <Card className="premium-card border-none">
                            <CardHeader className="p-6 border-b border-slate-50">
                                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-accent-blue" />
                                    Expectations Met
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                {universalAnalysis?.roleReasoning?.expectationsMet?.length > 0 ? (
                                    <div className="space-y-3">
                                        {universalAnalysis.roleReasoning.expectationsMet.slice(0, 4).map((exp: any, i: number) => (
                                            <div key={i} className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                                <p className="text-sm font-bold text-slate-800">{exp.expectation}</p>
                                                <p className="text-xs text-slate-500 mt-1">{exp.assessment}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500">No specific expectations identified</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Expectations That Differ */}
                        <Card className="premium-card border-none">
                            <CardHeader className="p-6 border-b border-slate-50">
                                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-slate-400" />
                                    Areas to Strengthen
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                {universalAnalysis?.roleReasoning?.expectationsDiffer?.length > 0 ? (
                                    <div className="space-y-3">
                                        {universalAnalysis.roleReasoning.expectationsDiffer.slice(0, 4).map((exp: any, i: number) => (
                                            <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                <p className="text-sm font-bold text-slate-800">{exp.expectation}</p>
                                                <p className="text-xs text-slate-500 mt-1">{exp.assessment}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <CheckCircle2 className="h-8 w-8 text-accent-blue mx-auto mb-2" />
                                        <p className="text-sm text-slate-500">No significant gaps identified</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </section>
            )}

            {/* ===== SECTION 9: Career Path Projection ===== */}
            {universalAnalysis?.careerPath && (
                <section className="animate-item mb-16">
                    <SectionHeader icon={<Route className="h-7 w-7" />} title="Career Path Projection" subtitle="Your trajectory and next roles" iconColor="blue" />
                    <Card className="premium-card border-none">
                        <CardContent className="p-6">
                            {/* Current Level */}
                            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <p className="text-xs font-semibold text-accent-blue uppercase tracking-wide mb-2">Current Level</p>
                                <p className="text-xl font-bold text-slate-900">{universalAnalysis.careerPath.currentLevel}</p>
                                <p className="text-sm text-slate-600 mt-2">{universalAnalysis.careerPath.currentLevelExplanation}</p>
                            </div>

                            {/* Projected Roles */}
                            <p className="text-sm font-semibold text-slate-700 mb-4">Projected Next Roles</p>
                            <div className="space-y-4 mb-6">
                                {universalAnalysis.careerPath.projectedRoles?.map((role: any, i: number) => (
                                    <div key={i} className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                                    <Briefcase className="h-5 w-5 text-accent-blue" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{role.role}</p>
                                                    <p className="text-xs text-slate-500">{role.timeframe}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-accent-blue">{role.readiness}%</div>
                                                <p className="text-xs text-slate-500">Readiness</p>
                                            </div>
                                        </div>
                                        <Progress value={role.readiness} className="h-2 mb-3" />
                                        <p className="text-sm text-slate-600 mb-3">{role.explanation}</p>
                                        {role.requirements?.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {role.requirements.map((req: string, j: number) => (
                                                    <Badge key={j} variant="outline" className="bg-white text-xs">{req}</Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Alternative Paths */}
                            {universalAnalysis.careerPath.alternativePaths?.length > 0 && (
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-xs font-semibold text-accent-blue uppercase tracking-wide mb-3">Alternative Career Paths</p>
                                    <div className="space-y-2">
                                        {universalAnalysis.careerPath.alternativePaths.map((alt: any, i: number) => (
                                            <div key={i} className="flex gap-2">
                                                <ArrowRight className="h-4 w-4 text-accent-blue mt-0.5 shrink-0" />
                                                <div>
                                                    <span className="text-sm font-medium text-slate-900">{alt.path}</span>
                                                    <span className="text-sm text-slate-500"> — {alt.reason}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {universalAnalysis.careerPath.summary && (
                                <p className="mt-4 text-sm text-slate-600 p-4 bg-slate-50 rounded-xl border-l-4 border-accent-blue">{universalAnalysis.careerPath.summary}</p>
                            )}
                        </CardContent>
                    </Card>
                </section>
            )}

            {/* ===== SECTION 5: Skills Analysis ===== */}
            <section className="animate-item mb-16">
                <SectionHeader icon={<Zap className="h-7 w-7" />} title="Skills Analysis" subtitle="Core competencies & tech ecosystem" iconColor="blue" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Detected Skills (Explicit) */}
                    <Card className="premium-card border-none">
                        <CardHeader className="p-6 border-b border-slate-50">
                            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-accent-blue" />
                                Detected Skills
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {universalAnalysis?.alignment?.explicit?.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {universalAnalysis.alignment.explicit.slice(0, 12).map((skill: any, i: number) => (
                                        <Badge key={i} className="bg-blue-50 border border-blue-100 text-accent-blue px-3 py-1.5 rounded-lg text-sm font-medium">
                                            {skill.skill}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500">No explicit skills detected</p>
                            )}
                            {universalAnalysis?.alignment?.implicit?.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-xs font-medium text-slate-500 mb-2">Implicit Skills (inferred from experience)</p>
                                    <div className="flex flex-wrap gap-2">
                                        {universalAnalysis.alignment.implicit.slice(0, 6).map((skill: any, i: number) => (
                                            <Badge key={i} className="bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-sm font-medium">
                                                {skill.skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Missing Core Skills */}
                    <Card className="premium-card border-none">
                        <CardHeader className="p-6 border-b border-slate-50">
                            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <XCircle className="h-5 w-5 text-slate-400" />
                                Skill Gaps
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {skillGaps?.missingCoreSkills?.length > 0 ? (
                                <div className="space-y-2">
                                    {skillGaps.missingCoreSkills.map((skill: string, i: number) => (
                                        <div key={skill} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                            <XCircle className="w-4 h-4 text-slate-400 shrink-0" />
                                            <span className="text-sm font-medium text-slate-700">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-100">
                                    <CheckCircle2 className="h-8 w-8 text-accent-blue mx-auto mb-2" />
                                    <p className="text-sm font-bold text-slate-900">No missing core skills</p>
                                    <p className="text-xs text-slate-500">All key competencies covered</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Tech Ecosystem */}
                    <Card className="premium-card border-none lg:col-span-2">
                        <CardHeader className="p-6 border-b border-slate-50">
                            <CardTitle className="text-lg font-bold text-slate-900">Recommended Tools & Tech</CardTitle>
                            <p className="text-sm text-slate-500 mt-1">Consider adding experience with these technologies to strengthen your profile</p>
                        </CardHeader>
                        <CardContent className="p-6">
                            {skillGaps?.missingToolsAndTech?.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {skillGaps.missingToolsAndTech.map((tool: string) => (
                                        <Badge key={tool} className="bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                                            {tool}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500">No critical tech gaps identified.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* ===== SECTION 11: Hidden Skills Detection ===== */}
            {universalAnalysis?.hiddenSkills?.skills?.length > 0 && (
                <section className="animate-item mb-16">
                    <SectionHeader icon={<Eye className="h-7 w-7" />} title="Hidden Skills Detected" subtitle="Skills implied by your experience" iconColor="blue" />
                    <Card className="premium-card border-none">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                {universalAnalysis.hiddenSkills.skills.map((skill: any, i: number) => (
                                    <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Sparkles className="h-5 w-5 text-accent-blue" />
                                                <span className="font-bold text-slate-900">{skill.skill}</span>
                                            </div>
                                            <Badge variant="outline" className={cn("text-xs", skill.confidence >= 80 ? "bg-blue-50 text-accent-blue" : "bg-slate-50 text-slate-600")}>
                                                {skill.confidence}% confident
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-slate-500 mb-2">Category: <span className="capitalize font-medium">{skill.category}</span></p>
                                        <p className="text-sm text-slate-600 mb-2">{skill.explanation}</p>
                                        <div className="text-xs text-blue-700 bg-white/50 p-2 rounded-lg border border-blue-100">
                                            <span className="font-semibold">Inferred from:</span> {skill.inferredFrom}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {universalAnalysis.hiddenSkills.summary && (
                                <p className="text-sm text-slate-600 p-4 bg-blue-50 rounded-xl border-l-4 border-accent-blue">{universalAnalysis.hiddenSkills.summary}</p>
                            )}
                        </CardContent>
                    </Card>
                </section>
            )}

            {/* ===== SECTION 12: Skills Network ===== */}
            {universalAnalysis?.skillsGraph && (
                <section className="animate-item mb-16">
                    <SectionHeader icon={<Network className="h-7 w-7" />} title="Skills Network" subtitle="How your skills connect" iconColor="blue" />
                    <Card className="premium-card border-none">
                        <CardContent className="p-6">
                            {/* Skill Clusters */}
                            {universalAnalysis.skillsGraph.clusters?.length > 0 && (
                                <div className="mb-6">
                                    <p className="text-sm font-semibold text-slate-700 mb-4">Skill Clusters</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {universalAnalysis.skillsGraph.clusters.map((cluster: any, i: number) => (
                                            <div key={i} className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                                <p className="font-bold text-slate-900 mb-2">{cluster.name}</p>
                                                <p className="text-xs text-slate-600 mb-3">{cluster.description}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {cluster.skills.map((skill: string, j: number) => (
                                                        <Badge key={j} className="bg-blue-100 text-blue-700 border-blue-200">{skill}</Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Transferable Skills */}
                            {universalAnalysis.skillsGraph.transferableSkills?.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-sm font-semibold text-slate-700 mb-4">Transferable Skills</p>
                                    <div className="space-y-3">
                                        {universalAnalysis.skillsGraph.transferableSkills.map((ts: any, i: number) => (
                                            <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Zap className="h-5 w-5 text-blue-600" />
                                                    <span className="font-bold text-slate-900">{ts.skill}</span>
                                                </div>
                                                <p className="text-sm text-slate-600 mb-2">{ts.explanation}</p>
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span className="text-slate-500">Applicable to:</span>
                                                    <div className="flex flex-wrap gap-1">
                                                        {ts.targetRoles?.map((role: string, j: number) => (
                                                            <Badge key={j} variant="outline" className="text-xs">{role}</Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {universalAnalysis.skillsGraph.summary && (
                                <p className="text-sm text-slate-600 p-4 bg-blue-50 rounded-xl border-l-4 border-accent-blue">{universalAnalysis.skillsGraph.summary}</p>
                            )}
                        </CardContent>
                    </Card>
                </section>
            )}

            {/* ===== SECTION 10: Tone & Voice Analysis ===== */}
            {universalAnalysis?.toneAnalysis && (
                <section className="animate-item mb-16">
                    <SectionHeader icon={<MessageSquare className="h-7 w-7" />} title="Tone & Voice Analysis" subtitle="How your resume sounds to recruiters" iconColor="blue" />
                    <Card className="premium-card border-none">
                        <CardContent className="p-6">
                            {/* Overall Tone */}
                            <div className="flex items-center justify-between mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <div>
                                    <p className="text-xs font-semibold text-accent-blue uppercase tracking-wide mb-1">Overall Tone</p>
                                    <p className="text-2xl font-bold text-slate-900 capitalize">{universalAnalysis.toneAnalysis.overallTone}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-accent-blue">{universalAnalysis.toneAnalysis.score}/100</div>
                                    <p className="text-xs text-slate-500">Tone Score</p>
                                </div>
                            </div>

                            {/* Tone Dimensions */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {Object.entries(universalAnalysis.toneAnalysis.dimensions || {}).map(([key, dim]: [string, any]) => (
                                    <div key={key} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm font-semibold text-slate-700 capitalize">{key}</p>
                                            <span className={cn("text-lg font-bold", dim.score >= 70 ? "text-accent-blue" : dim.score >= 50 ? "text-slate-600" : "text-slate-400")}>{dim.score}</span>
                                        </div>
                                        <Progress value={dim.score} className="h-2 mb-3" />
                                        <p className="text-xs text-slate-600">{dim.explanation}</p>
                                        {dim.examples?.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-1">
                                                {dim.examples.slice(0, 2).map((ex: string, i: number) => (
                                                    <Badge key={i} variant="secondary" className="text-xs bg-white">&quot;{ex}&quot;</Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Weak Phrases */}
                            {universalAnalysis.toneAnalysis.weakPhrases?.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-sm font-semibold text-slate-700 mb-3">Phrases to Improve</p>
                                    <div className="space-y-3">
                                        {universalAnalysis.toneAnalysis.weakPhrases.map((phrase: any, i: number) => (
                                            <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                                <div className="flex items-start gap-3">
                                                    <AlertTriangle className="h-5 w-5 text-slate-400 mt-0.5 shrink-0" />
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-slate-800">&quot;{phrase.phrase}&quot;</p>
                                                        <p className="text-xs text-slate-500 mt-1">{phrase.issue}</p>
                                                        <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
                                                            <p className="text-xs text-accent-blue"><span className="font-semibold">Try:</span> {phrase.suggestion}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {universalAnalysis.toneAnalysis.overallExplanation && (
                                <p className="text-sm text-slate-600 p-4 bg-blue-50 rounded-xl border-l-4 border-accent-blue">{universalAnalysis.toneAnalysis.overallExplanation}</p>
                            )}
                        </CardContent>
                    </Card>
                </section>
            )}

            {/* ===== SECTION 6: Structural Integrity ===== */}
            <section className="animate-item mb-16">
                <SectionHeader icon={<FileText className="h-7 w-7" />} title="Structural Integrity" subtitle="Format analysis" iconColor="blue" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Structural Issues */}
                    <Card className="premium-card border-none">
                        <CardHeader className="p-6 border-b border-slate-50">
                            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-slate-400" />
                                Formatting Issues
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {structuralIssues?.length > 0 ? (
                                <div className="space-y-2">
                                    {structuralIssues.map((issue: string, i: number) => (
                                        <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                            <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                            <p className="text-sm font-medium text-slate-700 leading-relaxed">{issue}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-100">
                                    <CheckCircle2 className="h-8 w-8 text-accent-blue mx-auto mb-2" />
                                    <p className="text-sm font-bold text-slate-900">Structure optimized</p>
                                    <p className="text-xs text-slate-500">Format aligned with standards</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Content Quality - Dynamic */}
                    <Card className="premium-card border-none">
                        <CardHeader className="p-6 border-b border-slate-50">
                            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-accent-blue" />
                                Content Quality
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    {
                                        label: "Bullet Strength",
                                        val: enhancvChecks?.quantifyImpact?.status === "success" ? "Strong" : enhancvChecks?.quantifyImpact?.status === "warning" ? "Moderate" : "Weak",
                                        icon: <TrendingUp className="w-4 h-4" />,
                                        status: enhancvChecks?.quantifyImpact?.status
                                    },
                                    {
                                        label: "Metric Density",
                                        val: `${enhancvChecks?.quantifyImpact?.bulletsWithMetrics || 0}/${enhancvChecks?.quantifyImpact?.totalBullets || 0}`,
                                        icon: <Gauge className="w-4 h-4" />,
                                        status: enhancvChecks?.quantifyImpact?.status
                                    },
                                    {
                                        label: "Word Variety",
                                        val: enhancvChecks?.repetition?.status === "success" ? "High" : "Low",
                                        icon: <Zap className="w-4 h-4" />,
                                        status: enhancvChecks?.repetition?.status
                                    },
                                    {
                                        label: "ATS Parse Rate",
                                        val: `${enhancvChecks?.atsParseRate?.percentage || 0}%`,
                                        icon: <Brain className="w-4 h-4" />,
                                        status: enhancvChecks?.atsParseRate?.status
                                    },
                                ].map((item, i) => (
                                    <div key={i} className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-center">
                                        <div className={cn(
                                            "h-8 w-8 rounded-lg flex items-center justify-center mx-auto mb-2",
                                            item.status === "success" ? "bg-blue-50 text-accent-blue" : "bg-white text-slate-400"
                                        )}>
                                            {item.icon}
                                        </div>
                                        <p className="text-xs font-medium text-slate-500 mb-1">{item.label}</p>
                                        <p className={cn(
                                            "text-sm font-bold",
                                            item.status === "success" ? "text-accent-blue" : "text-slate-900"
                                        )}>{item.val}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Content Issues */}
                    {contentIssues?.length > 0 && (
                        <Card className="premium-card border-none lg:col-span-2">
                            <CardHeader className="p-6 border-b border-slate-50">
                                <CardTitle className="text-lg font-bold text-slate-900">Content Improvements</CardTitle>
                                <p className="text-sm text-slate-500 mt-1">Additional content-related suggestions</p>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {contentIssues.map((issue: string, i: number) => (
                                        <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                            <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                            <p className="text-sm font-medium text-slate-700 leading-relaxed">{issue}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </section>

            {/* ===== SECTION 7: High-Impact Optimizations ===== */}
            {recommendations?.bulletFixes?.length > 0 && (
                <section className="animate-item mb-16">
                    <SectionHeader icon={<Sparkles className="h-7 w-7" />} title="High-Impact Optimizations" subtitle="Suggested improvements" iconColor="blue" />
                    <div className="space-y-4">
                        {recommendations.bulletFixes.slice(0, 6).map((fix: any, i: number) => (
                            <Card key={i} className="premium-card border-none">
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Original */}
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <p className="text-xs font-medium text-slate-500 uppercase mb-2">Original</p>
                                            <p className="text-sm text-slate-600 italic">&quot;{fix.original}&quot;</p>
                                        </div>

                                        {/* Optimized */}
                                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-xs font-medium text-accent-blue uppercase">Optimized</p>
                                                <Button
                                                    onClick={() => {
                                                        handleApplyFix(`bullet-${i}`);
                                                        navigator.clipboard.writeText(fix.improved);
                                                    }}
                                                    size="sm"
                                                    className={cn(
                                                        "h-7 px-3 rounded-lg text-xs font-semibold",
                                                        appliedFixes.has(`bullet-${i}`)
                                                            ? "bg-accent-blue text-white"
                                                            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                                                    )}
                                                >
                                                    {appliedFixes.has(`bullet-${i}`) ? (
                                                        <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Copied</span>
                                                    ) : (
                                                        <span className="flex items-center gap-1"><Copy className="h-3 w-3" /> Copy</span>
                                                    )}
                                                </Button>
                                            </div>
                                            <p className="text-sm font-medium text-slate-900">&quot;{fix.improved}&quot;</p>
                                            {fix.reason && (
                                                <p className="text-xs text-slate-500 mt-2">{fix.reason}</p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            {/* ===== SECTION 13: Learning Roadmap ===== */}
            {universalAnalysis?.learningRoadmap?.gaps?.length > 0 && (
                <section className="animate-item mb-16">
                    <SectionHeader icon={<GraduationCap className="h-7 w-7" />} title="Skills Gap Roadmap" subtitle="Personalized learning path" iconColor="blue" />
                    <Card className="premium-card border-none">
                        <CardContent className="p-6">
                            {/* Estimated Time */}
                            {universalAnalysis.learningRoadmap.estimatedTime && (
                                <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <p className="text-xs font-semibold text-accent-blue uppercase tracking-wide mb-1">Estimated Time to Close Gaps</p>
                                    <p className="text-xl font-bold text-slate-900">{universalAnalysis.learningRoadmap.estimatedTime}</p>
                                </div>
                            )}

                            {/* Skill Gaps */}
                            <div className="space-y-4 mb-6">
                                {universalAnalysis.learningRoadmap.gaps.map((gap: any, i: number) => (
                                    <div key={i} className={cn("p-5 rounded-xl border", gap.priority === "critical" ? "bg-slate-50 border-accent-blue/30" : "bg-slate-50 border-slate-200")}>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", gap.priority === "critical" ? "bg-blue-50" : "bg-slate-100")}>
                                                    {gap.priority === "critical" ? <Flame className="h-4 w-4 text-accent-blue" /> : <BookOpen className="h-4 w-4 text-slate-400" />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{gap.skill}</p>
                                                    <p className="text-xs text-slate-500">{gap.currentLevel} → {gap.targetLevel}</p>
                                                </div>
                                            </div>
                                            <Badge className={cn("text-xs capitalize", gap.priority === "critical" ? "bg-blue-100 text-accent-blue" : "bg-slate-100 text-slate-600")}>
                                                {gap.priority}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-4">{gap.explanation}</p>

                                        {/* Recommended Courses */}
                                        {gap.courses?.length > 0 && (
                                            <div>
                                                <p className="text-xs font-semibold text-slate-500 mb-2">Recommended Courses</p>
                                                <div className="space-y-2">
                                                    {gap.courses.map((course: any, j: number) => (
                                                        <a key={j} href={course.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                                                            <div className="flex items-center gap-3">
                                                                <GraduationCap className="h-4 w-4 text-accent-blue" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-slate-900">{course.name}</p>
                                                                    <p className="text-xs text-slate-500">{course.platform} • {course.duration}</p>
                                                                </div>
                                                            </div>
                                                            <ArrowRight className="h-4 w-4 text-slate-400" />
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Milestones */}
                            {universalAnalysis.learningRoadmap.milestones?.length > 0 && (
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-sm font-semibold text-slate-700 mb-3">Milestones</p>
                                    <div className="space-y-3">
                                        {universalAnalysis.learningRoadmap.milestones.map((ms: any, i: number) => (
                                            <div key={i} className="flex gap-3">
                                                <div className="h-6 w-6 rounded-full bg-blue-100 text-accent-blue flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">{ms.milestone}</p>
                                                    <p className="text-xs text-slate-500">{ms.timeframe} • Skills: {ms.skills?.join(", ")}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {universalAnalysis.learningRoadmap.summary && (
                                <p className="mt-4 text-sm text-slate-600 p-4 bg-blue-50 rounded-xl border-l-4 border-accent-blue">{universalAnalysis.learningRoadmap.summary}</p>
                            )}
                        </CardContent>
                    </Card>
                </section>
            )}

            {/* ===== SECTION 8: Implementation Roadmap ===== */}
            {recommendations?.priorityFixList?.length > 0 && (
                <section className="animate-item mb-16">
                    <SectionHeader icon={<ArrowRight className="h-7 w-7" />} title="Implementation Roadmap" subtitle="Priority action items" iconColor="blue" />
                    <Card className="premium-card border-none">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {recommendations.priorityFixList.map((fix: string, i: number) => (
                                    <div key={i} className="flex gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="h-6 w-6 rounded-lg bg-accent-blue text-white flex items-center justify-center text-xs font-bold shrink-0">
                                            {i + 1}
                                        </div>
                                        <p className="text-sm font-medium text-slate-700 leading-relaxed">{fix}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </section>
            )}
        </div>
    );
}
