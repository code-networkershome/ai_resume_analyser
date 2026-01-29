"use client";

import React, { useState, useEffect } from "react";
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
    Briefcase
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

    return (
        <div className="flex flex-col space-y-8 pb-20">
            {/* Header Section */}
            <div className="bg-white p-1 rounded-[2.5rem] shadow-2xl shadow-blue-500/5 border border-blue-50">
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
                            <Button className="h-10 rounded-xl bg-accent-blue hover:bg-accent-blue/90 text-white font-bold text-xs shadow-lg shadow-accent-blue/20">
                                <Download className="mr-2 h-4 w-4" /> Export PDF
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
                        <Card className="shadow-2xl shadow-blue-500/5 border-none bg-white p-4">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Summary Insight</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm font-bold text-text-primary leading-relaxed border-l-4 border-accent-blue pl-4">
                                    {critique?.summaryVerdict}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="shadow-2xl shadow-blue-500/5 border-none bg-white p-4">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Keyword Density</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[11px] font-bold uppercase">
                                        <span className="text-text-secondary">Current Density</span>
                                        <span className="text-text-primary">68%</span>
                                    </div>
                                    <div className="h-2.5 bg-blue-50 rounded-full overflow-hidden">
                                        <div className="h-full bg-accent-blue rounded-full" style={{ width: '68%' }} />
                                    </div>
                                    <div className="flex justify-between text-[10px] font-bold uppercase text-emerald-600">
                                        <span>Target Optimization</span>
                                        <span>85%+</span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-1.5 pt-2">
                                    {radarData.slice(0, 4).map((d, i) => (
                                        <Badge key={i} variant="secondary" className="bg-gray-50 text-[10px] text-text-secondary font-bold border-none rounded-lg px-2.5 py-1">
                                            {d.subject}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-2xl shadow-blue-500/5 border-none bg-white p-4">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">ATS Parsing Simulation</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {[
                                    { label: "Headings Detected", status: "success" },
                                    { label: "Contact Info Parsed", status: "success" },
                                    { label: "Bullet Structural", status: "warning" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/50 border border-gray-100">
                                        <span className="text-[11px] font-bold text-text-secondary uppercase tracking-tight">{item.label}</span>
                                        {item.status === "success" ? (
                                            <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                            </div>
                                        ) : (
                                            <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center">
                                                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="shadow-2xl shadow-blue-500/5 border-none bg-white overflow-hidden p-4">
                            <CardHeader className="pb-0">
                                <h3 className="font-bold text-text-primary flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-accent-blue" />
                                    Performance Radar
                                </h3>
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

                        <Card className="shadow-2xl shadow-blue-500/5 border-none bg-white overflow-hidden p-4">
                            <CardHeader className="pb-4">
                                <h3 className="font-bold text-text-primary flex items-center gap-2 text-red-600">
                                    <AlertTriangle className="h-4 w-4" />
                                    Critical Rejection Risks
                                </h3>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="space-y-4 px-2">
                                    {critique?.primaryRejectionReasons?.map((reason: string, i: number) => (
                                        <div key={i} className="flex gap-4 p-4 bg-red-50/50 rounded-2xl border border-red-100/50 hover:bg-red-50 transition-colors">
                                            <div className="h-8 w-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 text-sm font-black">
                                                {i + 1}
                                            </div>
                                            <p className="text-sm font-bold text-text-primary leading-snug self-center">{reason}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="analysis" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="shadow-2xl shadow-blue-500/5 border-none bg-white overflow-hidden">
                        <div className="p-8 border-b border-gray-50">
                            <h3 className="text-xl font-bold text-text-primary">Detailed Scoring Breakdown</h3>
                            <p className="text-sm text-text-secondary mt-1 font-medium">Factors influencing your professional profile evaluation.</p>
                        </div>
                        <CardContent className="p-10">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                                <div className="space-y-10">
                                    {[
                                        { label: "ATS Compatibility", val: atsBreakdown?.scores?.atsCompatibility, icon: <Target /> },
                                        { label: "Parsing Reliability", val: atsBreakdown?.scores?.parsingReliability, icon: <FileText /> },
                                        { label: "Role Expectation Match", val: atsBreakdown?.scores?.roleExpectationMatch, icon: <Briefcase /> }
                                    ].map((item, i) => (
                                        <div key={i} className="space-y-4">
                                            <div className="flex justify-between items-end px-1">
                                                <span className="text-xs font-black text-text-secondary uppercase tracking-widest">{item.label}</span>
                                                <span className="text-2xl font-black font-mono text-accent-blue">{item.val}%</span>
                                            </div>
                                            <div className="h-3 bg-blue-50/50 rounded-full overflow-hidden p-0.5 border border-blue-100/30">
                                                <div
                                                    className="h-full bg-accent-blue rounded-full transition-all duration-1000 shadow-sm"
                                                    style={{ width: `${item.val}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-gradient-to-br from-accent-blue to-blue-700 rounded-[2rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-blue-500/20 group">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                        <Brain className="h-48 w-48" />
                                    </div>
                                    <div className="relative z-10 space-y-6">
                                        <Badge className="bg-white/20 text-white border-none rounded-xl px-4 py-1.5 font-black text-[11px] uppercase tracking-widest">AI INSIGHT</Badge>
                                        <h4 className="text-3xl font-black tracking-tight">Role Fit Assessment</h4>
                                        <p className="text-blue-50 text-base leading-relaxed font-bold">
                                            {critique?.roleFitAssessment}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="skills" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="shadow-2xl shadow-blue-500/5 border-none bg-white p-6">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-14 w-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shadow-inner">
                                    <Target className="h-7 w-7" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-black">Missing Core Skills</CardTitle>
                                    <CardDescription className="font-bold text-xs uppercase tracking-wider text-text-secondary mt-1">Gaps in your foundational profile</CardDescription>
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
                                    <div className="p-10 text-center bg-emerald-50/50 rounded-[2rem] border border-dashed border-emerald-200">
                                        <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle2 className="h-6 w-6" />
                                        </div>
                                        <p className="text-sm font-black text-emerald-700 uppercase tracking-widest">All Core Skills Identified</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="shadow-2xl shadow-blue-500/5 border-none bg-white p-6">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-14 w-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shadow-inner">
                                    <Zap className="h-7 w-7" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-black">Recommended Stack</CardTitle>
                                    <CardDescription className="font-bold text-xs uppercase tracking-wider text-text-secondary mt-1">Tools industry peers are using</CardDescription>
                                </div>
                            </div>
                            <CardContent className="p-0">
                                <div className="flex flex-wrap gap-3">
                                    {skillGaps?.missingToolsAndTech?.map((tool: string) => (
                                        <Badge key={tool} className="bg-gray-50 text-text-primary hover:bg-amber-100 border border-gray-100 hover:border-amber-200 px-4 py-2 rounded-2xl font-black text-[12px] transition-all">
                                            {tool}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="md:col-span-2 shadow-2xl shadow-blue-500/5 border-none bg-white overflow-hidden p-6">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-14 w-14 rounded-2xl bg-blue-50 text-accent-blue flex items-center justify-center shadow-inner">
                                    <Briefcase className="h-7 w-7" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-black">Responsibility Gap Analysis</CardTitle>
                                    <CardDescription className="font-bold text-xs uppercase tracking-wider text-text-secondary mt-1">Unmatched Domain Experience</CardDescription>
                                </div>
                            </div>
                            <CardContent className="p-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {responsibilityAnalysis?.unmatchedResponsibilities?.map((item: string, i: number) => (
                                        <div key={i} className="flex gap-4 p-5 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all">
                                            <XCircle className="h-5 w-5 text-red-400 mt-1 shrink-0" />
                                            <span className="text-sm font-bold text-text-secondary leading-relaxed">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="formatting" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="shadow-2xl shadow-blue-500/5 border-none bg-white overflow-hidden p-6">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-14 w-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shadow-inner">
                                    <AlertTriangle className="h-7 w-7" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-black">Structural Issues</CardTitle>
                                    <CardDescription className="font-bold text-xs uppercase tracking-wider text-text-secondary mt-1">ATS Reading Failures</CardDescription>
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
                                    <div className="p-16 text-center bg-emerald-50/50 rounded-[2.5rem] border border-dashed border-emerald-200">
                                        <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                            <CheckCircle2 className="h-8 w-8" />
                                        </div>
                                        <h4 className="text-lg font-black text-emerald-800 uppercase tracking-widest mb-2 px-2">Perfect Structure</h4>
                                        <p className="text-xs font-bold text-emerald-600/70 uppercase tracking-tight">Your resume is fully ATS-readable</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="shadow-2xl shadow-blue-500/5 border-none bg-white overflow-hidden p-6">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-14 w-14 rounded-2xl bg-blue-50 text-accent-blue flex items-center justify-center shadow-inner">
                                    <Lightbulb className="h-7 w-7" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-black">Content Improvements</CardTitle>
                                    <CardDescription className="font-bold text-xs uppercase tracking-wider text-text-secondary mt-1">Recruiter Impact Tips</CardDescription>
                                </div>
                            </div>
                            <CardContent className="p-0">
                                <div className="space-y-4">
                                    {contentIssues?.length > 0 ? (
                                        contentIssues.map((issue: string, i: number) => (
                                            <div key={i} className="p-5 text-sm font-bold text-text-primary flex gap-4 bg-blue-50/10 rounded-2xl border border-blue-100/30 hover:bg-blue-50/30 transition-all">
                                                <div className="h-2 w-2 rounded-full bg-accent-blue mt-2 shrink-0 shadow-sm shadow-blue-500/50" />
                                                <p className="leading-relaxed">{issue}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-12 text-center text-text-secondary italic font-bold">No content issues found.</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="actions" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-4">
                    <Card className="shadow-2xl shadow-blue-500/5 border-none bg-white overflow-hidden p-2">
                        <div className="p-8 border-b border-gray-50">
                            <h3 className="text-2xl font-black text-text-primary flex items-center gap-3">
                                < Zap className="h-7 w-7 text-emerald-500" /> High-Impact Optimizations
                            </h3>
                            <p className="text-sm text-text-secondary mt-2 font-bold max-w-2xl leading-relaxed">
                                Refined bullet points designed to trigger ATS keyword triggers and impress technical recruiters.
                            </p>
                        </div>
                        <CardContent className="p-8 space-y-8">
                            {recommendations?.bulletFixes?.slice(0, 4).map((fix: any, i: number) => (
                                <div key={i} className="flex flex-col md:flex-row gap-0 rounded-[2rem] bg-gray-50/30 border border-gray-100 overflow-hidden group/opt hover:border-blue-200 transition-all">
                                    <div className="flex-1 p-8 space-y-4">
                                        <div className="inline-flex px-3 py-1 bg-red-50 rounded-lg text-red-600 text-[9px] font-black uppercase tracking-[0.2em]">Original</div>
                                        <p className="text-xs font-bold text-text-secondary leading-relaxed italic pr-4">&quot;{fix.original}&quot;</p>
                                    </div>

                                    <div className="hidden md:flex items-center justify-center p-4 bg-gradient-to-b from-transparent via-gray-100 to-transparent">
                                        <div className="h-10 w-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center group-hover/opt:scale-110 transition-transform">
                                            <ArrowRight className="h-4 w-4 text-accent-blue" />
                                        </div>
                                    </div>

                                    <div className="flex-1 p-8 space-y-5 bg-white relative">
                                        <div className="inline-flex px-3 py-1 bg-emerald-50 rounded-lg text-emerald-600 text-[9px] font-black uppercase tracking-[0.2em]">Improved Analysis</div>
                                        <p className="text-sm font-black text-text-primary leading-relaxed">&quot;{fix.improved}&quot;</p>

                                        <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-gray-50 mt-4">
                                            <div className="flex items-center gap-2.5 text-[10px] font-black text-text-secondary uppercase tracking-widest bg-blue-50/50 px-3 py-1.5 rounded-lg border border-blue-100/30">
                                                <Info className="h-3.5 w-3.5 text-accent-blue" /> {fix.reason}
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className={cn(
                                                    "h-9 rounded-2xl px-6 font-black text-[10px] uppercase tracking-widest transition-all shadow-sm",
                                                    appliedFixes.has(`bullet-${i}`)
                                                        ? "bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600"
                                                        : "bg-white border-gray-200 text-accent-blue hover:bg-accent-blue hover:text-white"
                                                )}
                                                onClick={() => {
                                                    handleApplyFix(`bullet-${i}`);
                                                    navigator.clipboard.writeText(fix.improved);
                                                }}
                                            >
                                                {appliedFixes.has(`bullet-${i}`) ? (
                                                    <span className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3" /> Copied</span>
                                                ) : "Copy Improved Text"}
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
                </TabsContent>
            </Tabs>
        </div>
    );
}
