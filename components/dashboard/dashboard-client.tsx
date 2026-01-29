"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    FileText,
    TrendingUp,
    Shield,
    Zap,
    PlusCircle,
    Search,
    ArrowRight
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { ScoreChart } from "./score-chart";

import { AuroraBackground } from "@/components/shared/AuroraBackground";

export function DashboardClient({
    usage,
    reviews
}: {
    usage: any,
    reviews: any[]
}) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    const avgScore = reviews.length > 0
        ? Math.round(reviews.reduce((acc, r) => acc + r.atsScore, 0) / reviews.length)
        : 0;

    const lastScore = reviews.length > 0 ? reviews[0].atsScore : 0;
    const scoreTrend = reviews.length > 1 ? lastScore - reviews[1].atsScore : 0;

    return (
        <AuroraBackground className="pb-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 space-y-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-blue-100 rounded-full shadow-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Dashboard</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 font-display">Welcome Back</h1>
                        <p className="text-slate-500 font-medium text-lg">Track your resume performance and improvement over time.</p>
                    </div>
                    <Link href="/review">
                        <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full h-14 px-8 font-bold transition-all shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 flex items-center gap-2 group">
                            <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                            New Analysis
                        </Button>
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Analyzed"
                        value={usage?.reviewCount || 0}
                        icon={<FileText className="h-5 w-5" />}
                        description="Successful parses"
                        color="blue"
                    />
                    <StatCard
                        title="Average Score"
                        value={`${avgScore}`}
                        icon={<TrendingUp className="h-5 w-5" />}
                        description="Targeting 80+"
                        color="indigo"
                    />
                    <StatCard
                        title="Last Score"
                        value={`${lastScore}`}
                        icon={<Zap className="h-5 w-5" />}
                        description={scoreTrend >= 0 ? `+${scoreTrend} points` : `${scoreTrend} points`}
                        color={scoreTrend >= 0 ? "emerald" : "orange"}
                        trend={scoreTrend >= 0 ? "up" : "down"}
                    />
                    <StatCard
                        title="Usage Limit"
                        value="Unlimited"
                        icon={<Shield className="h-5 w-5" />}
                        description="Free beta access"
                        color="slate"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Chart Area */}
                    <Card className="lg:col-span-2 shadow-2xl shadow-blue-500/5 border-none overflow-hidden bg-white">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-text-primary">Score Progression</h3>
                                <p className="text-xs text-text-secondary">Overview of your ATS scores</p>
                            </div>
                            <Badge variant="outline" className="bg-blue-50 text-accent-blue border-blue-100">Last 7 Days</Badge>
                        </div>
                        <div className="p-6">
                            <ScoreChart data={reviews} />
                        </div>
                    </Card>

                    {/* Quick Tips or Usage */}
                    {/* Quick Tips or Usage */}
                    <Card className="shadow-2xl shadow-blue-500/5 border border-slate-100 overflow-hidden bg-white/80 backdrop-blur-md relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-full pointer-events-none" />

                        <CardHeader className="relative z-10 pb-2">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                                    <Zap className="h-5 w-5 text-blue-600" />
                                </div>
                                <CardTitle className="text-xl font-bold tracking-tight text-slate-900 font-display">Improve Your Score</CardTitle>
                            </div>
                            <CardDescription className="text-slate-500 font-medium">AI-powered suggestions to hit the 90+ mark.</CardDescription>
                        </CardHeader>
                        <CardContent className="relative z-10 space-y-6 pt-2">
                            <ul className="space-y-3">
                                {[
                                    "Quantify your impact using metrics.",
                                    "Use active, powerful verbs.",
                                    "Tailor keywords for each role.",
                                ].map((tip, i) => (
                                    <li key={i} className="flex gap-3 items-start text-sm font-medium text-slate-700">
                                        <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-[10px] font-black mt-0.5">
                                            {i + 1}
                                        </div>
                                        <span className="leading-relaxed">{tip}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="pt-2">
                                <Link href="/review">
                                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl h-12 transition-all font-bold shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-95">
                                        Start New Scan
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Resume Table */}
                <Card className="shadow-2xl shadow-blue-500/5 border-none overflow-hidden bg-white">
                    <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <h3 className="font-bold text-text-primary">Recent Analyses</h3>
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                            <Input
                                type="search"
                                placeholder="Filter by role..."
                                className="pl-10 h-10 rounded-xl border-gray-100 focus:ring-accent-blue/20 focus:border-accent-blue"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {reviews.length === 0 ? (
                            <div className="p-20 text-center space-y-4">
                                <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                                    <FileText className="h-8 w-8 text-accent-blue" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-primary">No scans yet</h3>
                                    <p className="text-sm text-text-secondary">Upload your first resume to see reports here.</p>
                                </div>
                                <Button asChild className="bg-accent-blue rounded-xl">
                                    <Link href="/review">Analyze Now</Link>
                                </Button>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader className="bg-gray-50/50">
                                    <TableRow className="border-none">
                                        <TableHead className="font-bold text-text-primary px-6 h-12">Target Role</TableHead>
                                        <TableHead className="font-bold text-text-primary h-12">ATS Score</TableHead>
                                        <TableHead className="font-bold text-text-primary h-12">Level</TableHead>
                                        <TableHead className="font-bold text-text-primary h-12">Processed</TableHead>
                                        <TableHead className="font-bold text-text-primary text-right px-6 h-12">Report</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reviews.map((review) => (
                                        <TableRow key={review.id} className="group hover:bg-blue-50/30 transition-colors border-gray-50">
                                            <TableCell className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-text-primary group-hover:text-accent-blue transition-colors">{review.targetRole}</span>
                                                    <span className="text-xs text-text-secondary">{review.fileName || "Resume.pdf"}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={cn("h-full transition-all duration-1000",
                                                                review.atsScore >= 80 ? "bg-emerald-500" : review.atsScore >= 50 ? "bg-amber-500" : "bg-red-500"
                                                            )}
                                                            style={{ width: `${review.atsScore}%` }}
                                                        />
                                                    </div>
                                                    <span className={cn("font-mono font-bold text-xs",
                                                        review.atsScore >= 80 ? "text-emerald-600" : review.atsScore >= 50 ? "text-amber-600" : "text-red-600"
                                                    )}>
                                                        {review.atsScore}%
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize bg-white border-gray-100 text-text-secondary font-medium">
                                                    {review.experienceLevel}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-text-secondary text-sm">
                                                {formatDate(review.createdAt)}
                                            </TableCell>
                                            <TableCell className="text-right px-6">
                                                <Link href={`/review/${review.id}`}>
                                                    <Button variant="ghost" size="sm" className="h-9 px-4 rounded-lg bg-gray-50 text-accent-blue hover:bg-accent-blue hover:text-white transition-all font-bold">
                                                        View <ArrowRight className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </Card>
            </div>
        </AuroraBackground>
    );
}

function StatCard({
    title, value, icon, description, color, trend
}: {
    title: string, value: string | number, icon: React.ReactNode, description: string, color: string, trend?: "up" | "down"
}) {
    const colors: Record<string, string> = {
        blue: "bg-blue-50 text-blue-600",
        indigo: "bg-indigo-50 text-indigo-600",
        emerald: "bg-emerald-50 text-emerald-600",
        orange: "bg-orange-50 text-orange-600",
        slate: "bg-slate-50 text-slate-600"
    };

    return (
        <Card className="p-6 shadow-sm hover:shadow-md border border-slate-100 transition-all bg-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-slate-50 to-transparent rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
            <div className="flex justify-between items-start relative z-10">
                <div className="space-y-4 w-full">
                    <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100/50 group-hover:scale-110 transition-transform duration-300", colors[color] || colors.blue)}>
                        {icon}
                    </div>
                    <div>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
                        <h3 className="text-3xl font-black text-slate-900 font-display tracking-tight">{value}</h3>
                    </div>
                    <p className="text-xs font-bold text-slate-500 flex items-center gap-2">
                        {trend === "up" && <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />}
                        {description}
                    </p>
                </div>
            </div>
        </Card>
    );
}
