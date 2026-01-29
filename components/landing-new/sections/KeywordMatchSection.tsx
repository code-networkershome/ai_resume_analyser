"use client";

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Search, Target, Cpu, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function KeywordMatchSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Entrance animation for header
    gsap.fromTo(".section-header",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 95%",
          toggleActions: "play none none none"
        }
      }
    );

    // Staggered cards
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.children,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        }
      );
    }
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="keywords" className="section-padding bg-white relative overflow-hidden">
      {/* Background Gradient Orbs - Amplified for Fidelity */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-400/10 rounded-full blur-[100px] animate-float-reverse" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="section-header text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/5 border border-blue-200/50 mb-6">
            <Search className="w-4 h-4 text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-[2px] text-blue-600">Keyword Intelligence</span>
          </div>
          <h2 className="text-headline text-slate-900 mb-6 font-display leading-tight">
            Smart <span className="gradient-text">Keyword Context</span> <br /> Matching
          </h2>
          <p className="text-body-lg text-slate-500 max-w-2xl mx-auto font-medium">
            We don't just count words. Our AI understands the context of your experience
            and compares it against specific job requirements.
          </p>
        </div>

        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Gap Analysis */}
          <div className="keyword-card group bg-white rounded-[2.5rem] p-10 border border-slate-100 flex flex-col h-full transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 h-full flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform mb-8">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 font-display group-hover:text-blue-600 transition-colors">Gap Analysis</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow font-medium">
                Identify hidden gaps between your current resume and the roles you're targeting.
              </p>
              <div className="space-y-4 pt-6 border-t border-slate-50 mt-auto">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <Cpu className="w-4 h-4 text-blue-500" />
                  </div>
                  <span className="text-xs font-black text-slate-700 tracking-wide">Technical Proficiencies</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="text-xs font-black text-slate-700 tracking-wide">Domain Expertise</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Density Insights */}
          <div className="keyword-card group bg-white rounded-[2.5rem] p-10 border border-slate-100 flex flex-col h-full transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 h-full flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform mb-8">
                <Search className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 font-display group-hover:text-purple-600 transition-colors">Density Insights</h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {['REACT', 'TYPESCRIPT', 'NODE.JS', 'AWS', 'GRAPHQL'].map((tag) => (
                  <span key={tag} className="px-3 py-1.5 rounded-lg bg-white border border-slate-100 text-[9px] font-black text-slate-400 tracking-widest transition-all hover:border-purple-200 hover:text-purple-600">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="p-5 bg-purple-50 rounded-2xl border border-purple-100/50 mb-8 flex gap-3 group/tip hover:bg-white transition-colors">
                <span className="text-lg">💡</span>
                <p className="text-[11px] text-purple-600 font-bold leading-relaxed">
                  Pro tip: Increase "React" mentions in your professional summary.
                </p>
              </div>
              <div className="mt-auto pt-6 border-t border-slate-50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Matching Density</span>
                  <span className="text-xs font-black text-purple-600 font-display">68%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-[1px]">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000" style={{ width: '68%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: ATS Compatibility */}
          <div className="keyword-card group bg-white rounded-[2.5rem] p-10 border border-slate-100 flex flex-col h-full transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 h-full flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform mb-8">
                <Cpu className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 font-display group-hover:text-emerald-600 transition-colors">Digital Parser</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
                See exactly how ATS bots parse your information—from contact fields to work history.
              </p>
              <div className="space-y-4 mt-auto pt-6 border-t border-slate-50">
                {[
                  { label: 'Semantic Headings', status: 'DETECTED', color: 'bg-emerald-500' },
                  { label: 'Cloud Formatting', status: 'ENHANCED', color: 'bg-blue-500' }
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white transiton-colors group/item">
                    <span className="text-[11px] font-bold text-slate-600 group-hover/item:text-slate-900 transition-colors">{item.label}</span>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.status}</span>
                      <div className={`w-2 h-2 rounded-full ${item.color} shadow-sm animate-pulse`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
