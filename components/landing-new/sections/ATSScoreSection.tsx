"use client";

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { FeatureCard } from '@/components/landing-new/shared/FeatureCard';
import { ScoreRing } from '@/components/landing-new/shared/ScoreRing';
import { MetricBar } from '@/components/landing-new/shared/MetricBar';
import { Badge } from '@/components/ui/badge';
import { Layout, FileText, Zap, CheckCircle, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function ATSScoreSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      cardRef.current,
      { scale: 0.95, opacity: 0, y: 50 },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 1,
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
      id="ats-check"
      className="section-padding relative overflow-hidden"
    >
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Performance Check</span>
          </div>
          <h2 className="text-headline text-slate-900 mb-6">
            Get Your <span className="gradient-text">ATS Performance</span> Score
          </h2>
          <p className="text-body-lg text-slate-600 max-w-2xl mx-auto">
            Our AI identifies patterns that Applicant Tracking Systems look for,
            ensuring your resume never gets filtered out before a human sees it.
          </p>
        </div>

        <div ref={cardRef}>
          <div className="premium-card p-1">
            <div className="bg-white rounded-[2rem] p-8 lg:p-12 overflow-hidden relative">
              {/* Visual Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-full pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Left: Score & Metrics */}
                <div className="lg:col-span-7 flex flex-col md:flex-row items-center gap-12">
                  <ScoreRing score={92} label="Excellent" size={200} />
                  <div className="flex-1 space-y-6 w-full">
                    <MetricBar label="ATS Compatibility" value={98} />
                    <MetricBar label="Keyword Relevance" value={86} />
                    <MetricBar label="Layout Score" value={94} />
                  </div>
                </div>

                {/* Right: Insights */}
                <div className="lg:col-span-5 bg-slate-50/50 rounded-3xl p-8 border border-slate-100/50 backdrop-blur-sm">
                  <h3 className="font-bold text-lg text-slate-900 mb-6 flex items-center gap-2.5">
                    <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                    Smart Improvements
                  </h3>
                  <div className="space-y-4">
                    {[
                      { icon: CheckCircle, color: "icon-glow-emerald", title: "Add Quantifiable Metrics", desc: "Results shown in percentages perform 40% better." },
                      { icon: FileText, color: "icon-glow-blue", title: "Refine Contact Header", desc: "Missing LinkedIn profile reduces response rates." },
                      { icon: Layout, color: "icon-glow-purple", title: "Enhance Skill Stack", desc: "Staggered skill lists improve scan readability." }
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100/50 transition-all hover:translate-x-1">
                        <div className={`w-10 h-10 premium-icon-bg ${item.color} shrink-0`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap gap-2">
                    <Badge className="rounded-full bg-green-50 text-green-700 border-green-100 shadow-none hover:bg-green-50">
                      ATS Optimized
                    </Badge>
                    <Badge className="rounded-full bg-blue-50 text-blue-700 border-blue-100 shadow-none hover:bg-blue-50">
                      98% Compatibility
                    </Badge>
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
