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
        <div className="min-h-screen bg-gradient-to-b from-[#F0F7FF] to-white py-12 px-6">
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-light rounded-full mb-4 shadow-sm shadow-blue-500/5">
                        <span className="w-2 h-2 bg-accent-blue rounded-full animate-pulse"></span>
                        <span className="text-xs font-bold text-accent-blue uppercase tracking-widest">AI Analyst</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-text-primary">
                        Scan <span className="text-accent-blue">Resume</span>
                    </h1>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto font-medium">Upload your resume and define your target role for a detailed AI-driven breakdown.</p>
                </div>

                <div className="space-y-8">
                    <Card className="shadow-2xl shadow-blue-500/10 border-none bg-white/80 backdrop-blur-xl overflow-hidden rounded-[2.5rem]">
                        <form onSubmit={onSubmit}>
                            <CardHeader className="bg-white/50 border-b border-gray-50/50 p-8 md:p-10">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="space-y-1">
                                        <CardTitle className="text-2xl font-black text-text-primary flex items-center gap-3">
                                            <div className="h-10 w-10 bg-accent-blue/10 rounded-xl flex items-center justify-center">
                                                <FileText className="w-5 h-5 text-accent-blue" />
                                            </div>
                                            Configuration
                                        </CardTitle>
                                        <CardDescription className="font-medium ml-13 italic">Provide context for the AI analyst to tailor your results.</CardDescription>
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-4 flex-1 max-w-2xl">
                                        <div className="flex-1 space-y-2">
                                            <Label htmlFor="targetRole" className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] ml-1">Target Role</Label>
                                            <select
                                                id="targetRole"
                                                className="flex h-12 w-full rounded-2xl border border-blue-50 bg-blue-50/30 px-4 py-2 text-sm font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/20 transition-all appearance-none cursor-pointer"
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
                                        <div className="flex-1 space-y-2">
                                            <Label htmlFor="experienceLevel" className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] ml-1">Experience Level</Label>
                                            <select
                                                id="experienceLevel"
                                                className="flex h-12 w-full rounded-2xl border border-blue-50 bg-blue-50/30 px-4 py-2 text-sm font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/20 transition-all appearance-none cursor-pointer"
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
                                    <div className="mt-6 animate-in fade-in zoom-in-95 duration-300">
                                        <input
                                            type="text"
                                            className="flex h-12 w-full rounded-2xl border border-blue-100 bg-white px-6 py-2 text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-accent-blue/20"
                                            placeholder="Enter your specific job title (e.g. Lead Product Designer)"
                                            value={formData.jobTitle}
                                            onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                                        />
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent className="p-8 md:p-10">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <Label className="text-xs font-black text-text-secondary uppercase tracking-[0.2em]">Resume Content</Label>
                                            <span className="text-[10px] bg-accent-blue text-white px-2 py-0.5 rounded-md font-bold">REQUIRED</span>
                                        </div>

                                        <div className={cn(
                                            "border-4 border-dashed rounded-[2rem] p-10 transition-all relative group h-48 flex items-center justify-center",
                                            fileName ? "border-green-200 bg-green-50/20" : "border-blue-50 bg-blue-50/10 hover:bg-blue-50/30 hover:border-accent-blue/20"
                                        )}>
                                            <input
                                                type="file"
                                                accept=".pdf,.docx"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div className="flex flex-col items-center gap-4">
                                                <div className={cn(
                                                    "h-16 w-16 rounded-3xl flex items-center justify-center transition-all duration-500 group-hover:rotate-6 shadow-xl",
                                                    fileName ? "bg-green-500 text-white shadow-green-500/20" : "bg-white text-accent-blue shadow-blue-500/10"
                                                )}>
                                                    {isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : (fileName ? <CheckCircle2 className="h-8 w-8" /> : <Upload className="h-8 w-8" />)}
                                                </div>
                                                <div className="text-center">
                                                    <p className="font-bold text-text-primary text-sm tracking-tight">{fileName || "Drop your profile here"}</p>
                                                    <p className="text-[10px] text-text-secondary font-medium uppercase tracking-widest mt-1">PDF or DOCX • Max 5MB</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="relative">
                                                <Textarea
                                                    placeholder="...or paste raw resume text here"
                                                    className="min-h-[300px] rounded-[2rem] border-blue-50 bg-gray-50/30 p-8 font-mono text-[11px] leading-relaxed focus:ring-4 focus:ring-accent-blue/10 focus:border-accent-blue/30 transition-all shadow-inner"
                                                    value={formData.resumeText}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, resumeText: e.target.value }))}
                                                />
                                                {!formData.resumeText && (
                                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                                                        <FileText className="w-20 h-20 text-accent-blue" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <Label className="text-xs font-black text-text-secondary uppercase tracking-[0.2em]">Job Description</Label>
                                            <span className="text-[10px] bg-gray-100 text-text-secondary px-2 py-0.5 rounded-md font-bold">OPTIONAL</span>
                                        </div>

                                        <div className="p-6 bg-accent-blue rounded-[2.5rem] text-white relative overflow-hidden group mb-8">
                                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                                <Zap className="h-24 w-24" />
                                            </div>
                                            <div className="relative z-10 space-y-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 bg-white/20 rounded-lg flex items-center justify-center">
                                                        <Zap className="h-4 w-4" />
                                                    </div>
                                                    <h4 className="font-black italic text-base">Match Analysis Boost</h4>
                                                </div>
                                                <p className="text-blue-50 text-[11px] font-bold leading-relaxed uppercase tracking-wider">
                                                    Pasting the specific job description increases ATS scoring precision by 40%
                                                </p>
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <Textarea
                                                placeholder="Paste the target job description for a tailored analysis..."
                                                className="min-h-[448px] rounded-[2rem] border-blue-50 bg-gray-50/30 p-8 text-sm font-medium leading-relaxed focus:ring-4 focus:ring-accent-blue/10 focus:border-accent-blue/30 transition-all shadow-inner"
                                                value={formData.jobDescription}
                                                onChange={(e) => setFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
                                            />
                                            {!formData.jobDescription && (
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                                                    <Target className="w-20 h-20 text-accent-blue" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 pt-8 border-t border-gray-50 flex items-center justify-between gap-6">
                                    <div className="hidden md:flex items-center gap-3 text-text-secondary">
                                        <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                                            <Info className="w-4 h-4 text-accent-blue" />
                                        </div>
                                        <p className="text-xs font-bold uppercase tracking-tighter italic">Your data is encrypted & processed by private AI models</p>
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="h-16 flex-1 md:flex-none md:w-[320px] bg-accent-blue hover:bg-accent-blue/90 text-white rounded-[1.5rem] text-lg font-black transition-all shadow-2xl shadow-blue-500/20 group"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-3 h-6 w-6 animate-spin" /> RUNNING AI ENGINE
                                            </>
                                        ) : (
                                            <div className="flex items-center justify-center gap-3">
                                                ANALYZE PROFILE
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </form>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { title: "ATS Check", icon: <CheckCircle2 className="w-4 h-4" />, desc: "See how corporate systems parse your data." },
                            { title: "Skill Gaps", icon: <Zap className="w-4 h-4" />, desc: "Find missing keywords compared to global standards." },
                            { title: "Content Score", icon: <FileText className="w-4 h-4" />, desc: "Verify if your bullet points are outcome-focused." }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-6 rounded-[2rem] border border-blue-50 shadow-sm flex items-start gap-4 hover:shadow-lg transition-all duration-300 group">
                                <div className="h-10 w-10 rounded-2xl bg-blue-50 text-accent-blue flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-text-primary uppercase tracking-widest">{item.title}</h4>
                                    <p className="text-[11px] text-text-secondary font-medium mt-1 leading-normal">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
