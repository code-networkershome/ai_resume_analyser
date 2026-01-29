"use client";

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Target, Search, Sparkles, TrendingUp, FileCheck, ShieldCheck, BarChart3, CheckCircle, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const features = [
    {
        icon: Target,
        title: 'ATS Score Check',
        desc: 'Get an instant compatibility score with major ATS systems like Greenhouse, Lever, and Workday.',
        stat: '98%',
        unit: 'Accuracy',
        color: 'from-blue-500 to-cyan-500',
        bgColor: 'from-blue-50 to-cyan-50'
    },
    {
        icon: Search,
        title: 'Smart Keywords',
        desc: 'AI analyzes job descriptions and highlights missing skills you need to add.',
        stat: '3x',
        unit: 'More Matches',
        color: 'from-purple-500 to-pink-500',
        bgColor: 'from-purple-50 to-pink-50'
    },
    {
        icon: Sparkles,
        title: 'AI Enhancement',
        desc: 'Transform weak bullets into powerful achievements with quantifiable results.',
        stat: '340%',
        unit: 'Impact Boost',
        color: 'from-amber-500 to-orange-500',
        bgColor: 'from-amber-50 to-orange-50'
    },
    {
        icon: TrendingUp,
        title: 'Skill Gap Analysis',
        desc: 'Compare your profile to any job and get actionable steps to close gaps.',
        stat: '15+',
        unit: 'Skills Tracked',
        color: 'from-emerald-500 to-teal-500',
        bgColor: 'from-emerald-50 to-teal-50'
    },
    {
        icon: FileCheck,
        title: 'Format Validation',
        desc: 'Ensure your resume structure is machine-readable with proper headers and fonts.',
        stat: '100%',
        unit: 'ATS Ready',
        color: 'from-indigo-500 to-blue-500',
        bgColor: 'from-indigo-50 to-blue-50'
    },
    {
        icon: ShieldCheck,
        title: 'Privacy First',
        desc: 'Your data stays private with 256-bit encryption. No third-party sharing.',
        stat: '256-bit',
        unit: 'Encrypted',
        color: 'from-rose-500 to-red-500',
        bgColor: 'from-rose-50 to-red-50'
    }
];

export function FeaturesSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.fromTo(".feature-header",
            { y: 40, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 85%",
                }
            }
        );

        if (gridRef.current) {
            gsap.fromTo(gridRef.current.children,
                { y: 60, opacity: 0, scale: 0.95 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: gridRef.current,
                        start: "top 80%",
                    }
                }
            );
        }
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} id="features" className="section-padding relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="feature-header text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/5 border border-blue-200/50 mb-6">
                        <BarChart3 className="w-4 h-4 text-blue-500" />
                        <span className="text-[10px] font-black uppercase tracking-[2px] text-blue-600">Powerful Features</span>
                    </div>
                    <h2 className="text-headline text-slate-900 mb-6 font-display leading-tight">
                        Everything You Need to <br />
                        <span className="gradient-text">Land Interviews</span>
                    </h2>
                    <p className="text-body-lg text-slate-500 max-w-2xl mx-auto font-medium">
                        Our AI-powered platform gives you the tools to create a resume that gets past
                        ATS and impresses human recruiters.
                    </p>
                </div>

                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <div key={i} className="feature-card group relative bg-white rounded-[2rem] p-8 border border-slate-100 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2">
                            {/* Gradient Background on Hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            <div className="relative z-10">
                                {/* Icon & Stat */}
                                <div className="flex items-start justify-between mb-8">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                                        <feature.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-black gradient-text font-display">{feature.stat}</div>
                                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{feature.unit}</div>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-3 font-display group-hover:text-blue-600 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-slate-500 leading-relaxed font-medium mb-6">
                                    {feature.desc}
                                </p>
                            </div>

                            {/* Decorative Corner */}
                            <div className={`absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br ${feature.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
