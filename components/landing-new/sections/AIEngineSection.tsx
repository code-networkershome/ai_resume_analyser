"use client";

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Button } from '@/components/ui/button';
import { Cpu, Upload, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function AIEngineSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(contentRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 95%',
          toggleActions: "play none none none"
        },
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="section-padding relative overflow-hidden bg-white">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-400/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div ref={contentRef} className="text-center">
          {/* Icon Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-blue-50 border border-blue-100 mb-10 shadow-sm backdrop-blur-xl">
            <Cpu className="w-5 h-5 text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-[2px] text-blue-600">Enterprise AI Engine</span>
          </div>

          <h2 className="text-display-sm md:text-display text-slate-900 mb-8 font-display">
            Fast, Private, and <br /><span className="gradient-text">Actionable Intelligence</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            We utilize proprietary ATS parsing heuristics combined with state-of-the-art
            language models to deliver expert-level feedback in milliseconds.
          </p>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { label: "Language Model", value: "GPT-4o Premium", icon: Sparkles, color: "icon-glow-amber" },
              { label: "Processing Speed", value: "< 2 Seconds", icon: Zap, color: "icon-glow-blue" },
              { label: "Privacy Focus", value: "Fully Encrypted", icon: ShieldCheck, color: "icon-glow-emerald" }
            ].map((stat, i) => (
              <div key={i} className="p-10 rounded-[2rem] bg-white border border-slate-100 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-500/5 transition-all group">
                <div className={`w-14 h-14 premium-icon-bg ${stat.color} mb-8 mx-auto group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-7 h-7 fill-current" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-2 font-display">{stat.value}</div>
                <div className="text-[10px] font-black uppercase tracking-[2px] text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
