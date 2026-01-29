"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SUPPORTED_ROLES, EXPERIENCE_LEVELS } from "@/lib/constants";
import { toast } from "sonner";
import {
    Loader2,
    Upload,
    FileText,
    CheckCircle2,
    ArrowRight,
    Zap,
    Info,
    Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AuroraBackground } from "@/components/shared/AuroraBackground";

export default function ReviewPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);
    const [formData, setFormData] = React.useState({
        resumeText: "",
        targetRole: "",
        experienceLevel: "",
        jobTitle: "",
        jobDescription: "",
        parsingInsights: null as any | null,
    });
    const [fileName, setFileName] = React.useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);

        const form = new FormData();
        form.append("file", file);

        setIsLoading(true);
        try {
            const resp = await fetch("/api/parse-resume", {
                method: "POST",
                body: form,
            });

            const data = await resp.json();
            if (!resp.ok) {
                throw new Error(data.error || "Failed to parse resume file");
            }

            setFormData((prev) => ({
                ...prev,
                resumeText: data.resumeText || "",
                parsingInsights: data.parsingInsights || null,
            }));
            toast.success("Resume text extracted");
        } catch (error: any) {
            toast.error(error.message || "Failed to parse file");
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.resumeText || !formData.targetRole || !formData.experienceLevel || (formData.targetRole === "Other" && !formData.jobTitle)) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setIsLoading(true);
        try {
            const resp = await fetch("/api/review", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resumeText: formData.resumeText,
                    targetRole: formData.targetRole === "Other" ? formData.jobTitle : formData.targetRole,
                    experienceLevel: formData.experienceLevel,
                    jobTitle: formData.jobTitle,
                    jobDescription: formData.jobDescription,
                    parsingInsights: formData.parsingInsights,
                }),
            });

            const data = await resp.json();

            if (!resp.ok) {
                throw new Error(data.error || "Failed to process review");
            }

            toast.success("Analysis Complete");
            router.push(`/review/${data.reviewId}`);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuroraBackground className="py-12 px-6">
            <div className="max-w-7xl mx-auto space-y-12 relative z-10">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-4 shadow-sm">
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">AI Analyst</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 font-display">
                        Scan Your Resume
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                        Upload your profile and define your target role for a detailed AI-driven breakdown.
                    </p>
                </div>

                <div className="space-y-8">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-[3rem] transform -rotate-1 opacity-50 pointer-events-none" />
                        <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl shadow-blue-900/5 relative z-10 transition-shadow hover:shadow-blue-900/10">
                            <form onSubmit={onSubmit}>
                                <div className="bg-slate-50/50 border-b border-slate-100 p-8">
                                    <div className="max-w-4xl mx-auto">
                                        {/* Compact Header Inputs */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                            <div className="space-y-1">
                                                <h2 className="text-xl font-black text-slate-900 font-display">Configuration</h2>
                                                <p className="text-sm text-slate-500 font-medium">Analysis settings</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <Label htmlFor="targetRole" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Target Role</Label>
                                                    <select
                                                        id="targetRole"
                                                        className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 shadow-sm transition-all cursor-pointer"
                                                        value={formData.targetRole}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, targetRole: e.target.value }))}
                                                    >
                                                        <option value="">Select Role</option>
                                                        {SUPPORTED_ROLES.map((role) => (
                                                            <option key={role} value={role}>{role}</option>
                                                        ))}
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1">
                                                    <Label htmlFor="experienceLevel" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Experience</Label>
                                                    <select
                                                        id="experienceLevel"
                                                        className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 shadow-sm transition-all cursor-pointer"
                                                        value={formData.experienceLevel}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, experienceLevel: e.target.value }))}
                                                    >
                                                        <option value="">Select Level</option>
                                                        {EXPERIENCE_LEVELS.map((level) => (
                                                            <option key={level.value} value={level.value}>{level.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        {formData.targetRole === "Other" && (
                                            <div className="mt-4 animate-in fade-in zoom-in-95 duration-300">
                                                <input
                                                    type="text"
                                                    className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 shadow-sm"
                                                    placeholder="Enter specific job title..."
                                                    value={formData.jobTitle}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-8 max-w-6xl mx-auto">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                        {/* Left Column: Resume Section */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100 text-blue-600">
                                                        <FileText className="h-4 w-4" />
                                                    </div>
                                                    <Label className="text-sm font-bold text-slate-900">Resume Content</Label>
                                                </div>
                                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">REQUIRED</span>
                                            </div>

                                            <div className={cn(
                                                "border-2 border-dashed rounded-[1.5rem] p-6 transition-all relative group h-40 flex items-center justify-center overflow-hidden",
                                                fileName ? "border-emerald-200 bg-emerald-50/20" : "border-slate-200 bg-slate-50/30 hover:bg-white hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5"
                                            )}>
                                                <input
                                                    type="file"
                                                    accept=".pdf,.docx"
                                                    onChange={handleFileChange}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                />
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className={cn(
                                                        "h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm",
                                                        fileName ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-white text-blue-600 shadow-blue-500/5 border border-slate-100"
                                                    )}>
                                                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (fileName ? <CheckCircle2 className="h-5 w-5" /> : <Upload className="h-5 w-5" />)}
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="font-bold text-slate-900 text-xs">{fileName || "Drop your profile or click to upload"}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">PDF or DOCX • Max 5MB</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="relative">
                                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                                    <div className="w-full border-t border-slate-100"></div>
                                                </div>
                                                <div className="relative flex justify-center">
                                                    <span className="bg-white px-2 text-[10px] font-medium text-slate-400 uppercase tracking-wider">Or paste text</span>
                                                </div>
                                            </div>

                                            <div className="relative overflow-hidden rounded-xl border border-slate-200 shadow-sm group focus-within:ring-2 focus-within:ring-blue-500/5 focus-within:border-blue-400 transition-all">
                                                <Textarea
                                                    placeholder="Paste raw resume text here if you don't have a file..."
                                                    className="min-h-[140px] border-none bg-white p-4 font-jakarta text-xs font-medium leading-relaxed focus:ring-0 resize-y"
                                                    value={formData.resumeText}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, resumeText: e.target.value }))}
                                                />
                                            </div>
                                        </div>

                                        {/* Right Column: Job Description Section */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100 text-indigo-600">
                                                        <Target className="h-4 w-4" />
                                                    </div>
                                                    <Label className="text-sm font-bold text-slate-900">Job Description</Label>
                                                </div>
                                                <div className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 flex items-center gap-1">
                                                    <Zap className="w-3 h-3 text-blue-600" />
                                                    <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wide">Match Boost</span>
                                                </div>
                                            </div>

                                            {/* Compact Tip */}
                                            <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100/50 flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                                                    <Zap className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-semibold text-blue-900 leading-tight">
                                                        Increases precision by <span className="text-blue-600 font-bold">40%</span>.
                                                    </p>
                                                    <p className="text-[10px] text-blue-700/70 leading-tight">
                                                        We&apos;ll prioritize skills found in the JD.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="relative overflow-hidden rounded-xl border border-slate-200 shadow-sm group focus-within:ring-2 focus-within:ring-blue-500/5 focus-within:border-blue-400 transition-all">
                                                <Textarea
                                                    placeholder="Paste the target job description here..."
                                                    className="h-full min-h-[268px] border-none bg-white p-4 text-xs font-medium leading-relaxed focus:ring-0 resize-y"
                                                    value={formData.jobDescription}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex flex-col items-center justify-center gap-4">
                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="h-12 w-full md:w-96 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-base font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="h-5 w-5 animate-spin" /> RUNNING AI ENGINE
                                                </>
                                            ) : (
                                                <>
                                                    ANALYZE PROFILE
                                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </Button>
                                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                                            Encrypted & processed by private AI
                                        </p>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
                    {[
                        { title: "ATS Check", icon: <CheckCircle2 className="w-5 h-5" />, desc: "See how corporate systems parse your data." },
                        { title: "Skill Gaps", icon: <Zap className="w-5 h-5" />, desc: "Find missing keywords compared to global standards." },
                        { title: "Content Score", icon: <FileText className="w-5 h-5" />, desc: "Verify if your bullet points are outcome-focused." }
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-start gap-5 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none -mr-10 -mt-10" />
                            <div className="h-14 w-14 rounded-2xl bg-slate-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 border border-slate-100 relative z-10 shadow-sm">
                                {item.icon}
                            </div>
                            <div className="pt-1 relative z-10">
                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest font-display mb-2">{item.title}</h4>
                                <p className="text-[13px] text-slate-500 font-medium leading-relaxed group-hover:text-slate-600 transition-colors">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </AuroraBackground >
    );
}
