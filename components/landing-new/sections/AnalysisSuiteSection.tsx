"use client";

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { RewriteUI } from '@/components/landing-new/shared/RewriteUI';
import { JobCardUI } from '@/components/landing-new/shared/JobCardUI';
import { Sparkles, Wand2, Briefcase, Zap, TrendingUp, Scissors, ChevronRight, Target, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const suggestions = [
    {
        icon: TrendingUp,
        text: 'Add measurable outcomes',
        description: 'Include metrics like percentages or dollars',
        color: 'text-emerald-500',
        bg: 'bg-emerald-50',
        border: 'border-emerald-100'
    },
    {
        icon: Zap,
        text: 'Use stronger action verbs',
        description: 'Replace "responsible for" with "spearheaded"',
        color: 'text-blue-500',
        bg: 'bg-blue-50',
        border: 'border-blue-100'
    },
    {
        icon: Scissors,
        text: 'Shorten summary to 2 lines',
        description: 'Recruiters spend 6 seconds on average',
        color: 'text-rose-500',
        bg: 'bg-rose-50',
        border: 'border-rose-100'
    }
];

export function AnalysisSuiteSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.fromTo(containerRef.current,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 85%',
                    toggleActions: "play none none none"
                },
            }
        );
    }, { scope: sectionRef });

    return (
        <section
            ref={sectionRef}
            id="analysis-suite"
            className="relative overflow-hidden py-16 lg:py-0 lg:h-screen lg:min-h-[850px] lg:max-h-[1000px] flex items-center"
        >
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-400/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-purple-400/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                {/* Header - More Compact */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-3">
                        <Sparkles className="w-4 h-4 text-blue-600 fill-blue-600" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Unified AI Suite</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl text-slate-900 mb-3 font-display font-bold">
                        The Complete <span className="gradient-text">Analysis Suite</span>
                    </h2>
                    <p className="text-base text-slate-600 max-w-2xl mx-auto font-medium">
                        Decoding, optimizing, and aligning your resume in one single viewport.
                    </p>
                </div>

                <div ref={containerRef} className="w-full">
                    {/* 3-Column Bento Grid Optimized for single viewport */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">

                        {/* 1. Job Match Engine */}
                        <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-6 lg:p-8 border border-slate-100 shadow-xl shadow-blue-500/5 relative overflow-hidden flex flex-col justify-between">
                            <div className="absolute top-0 left-0 w-24 h-24 bg-blue-50/50 rounded-br-full pointer-events-none" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                                        <Briefcase className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 font-display">Job Match</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Alignment Engine</p>
                                    </div>
                                </div>

                                <div className="bg-slate-50 border border-black/[0.03] rounded-2xl p-5 mb-6">
                                    <JobCardUI
                                        title="Frontend Developer"
                                        company="TechFlow"
                                        location="Remote"
                                        tags={['React', 'TypeScript', 'Node.js']}
                                        match={87}
                                    />
                                    <div className="mt-6 pt-4 border-t border-slate-200/50 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Target className="w-4 h-4 text-blue-500" />
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Strength</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="h-1.5 w-20 bg-slate-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 rounded-full" style={{ width: '87%' }} />
                                            </div>
                                            <span className="text-xs font-black text-blue-600 font-display">87%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-white/50 border border-slate-100 rounded-xl">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        <p className="text-[11px] font-bold text-slate-600">Requirement mapping</p>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-white/50 border border-slate-100 rounded-xl">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        <p className="text-[11px] font-bold text-slate-600">Skill gap scores</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Precision Rewriter */}
                        <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-6 lg:p-8 border border-slate-100 shadow-xl shadow-purple-500/5 relative overflow-hidden flex flex-col justify-between">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50/50 rounded-bl-full pointer-events-none" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center border border-purple-100">
                                        <Wand2 className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 font-display">Precision Rewriter</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Content Engine</p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h4 className="text-sm font-bold text-slate-900 mb-2 font-display">Impact-First Optimization</h4>
                                    <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                                        Transforming tasks into achievements using recruiter-approved patterns.
                                    </p>
                                </div>

                                <div className="bg-slate-50/50 border border-black/[0.03] rounded-2xl p-5 mb-6">
                                    <RewriteUI
                                        before="Helped with code reviews."
                                        after="Optimized code quality by leading 20+ weekly code reviews, reducing bug reports by 15%."
                                    />
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {["Strong Verbs", "Quantified"].map((tag, i) => (
                                        <span key={i} className="px-3 py-1 bg-purple-50 text-purple-600 text-[9px] font-black uppercase tracking-wider rounded-full border border-purple-100">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 3. Actionable Suggestions */}
                        <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-6 lg:p-8 border border-slate-100 shadow-xl shadow-emerald-500/5 relative overflow-hidden flex flex-col justify-between">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/50 rounded-bl-full pointer-events-none" />

                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                                            <Zap className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 font-display">Priority Insights</h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Insight Engine</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {suggestions.map((suggestion, index) => (
                                            <div
                                                key={index}
                                                className={`flex items-start gap-3 p-4 rounded-xl border ${suggestion.border} ${suggestion.bg} transition-all hover:translate-x-1 group cursor-default`}
                                            >
                                                <div className={`w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm border ${suggestion.border}`}>
                                                    <suggestion.icon className={`w-4 h-4 ${suggestion.color}`} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-slate-900 text-[11px]">{suggestion.text}</p>
                                                    <p className="text-[9px] text-slate-500 mt-0.5 leading-tight font-medium">{suggestion.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-slate-100">
                                    <div className="flex items-center justify-between p-4 bg-emerald-600 rounded-2xl text-white shadow-lg shadow-emerald-200">
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="w-3 h-3" />
                                            <span className="text-[9px] font-black uppercase tracking-widest">Success Odds</span>
                                        </div>
                                        <span className="text-base font-black font-display">+340%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
