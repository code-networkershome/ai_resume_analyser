"use client";

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Button } from '@/components/ui/button';
import { Upload, ArrowRight, Check, Sparkles, Zap } from 'lucide-react';
import { Footer } from '@/components/landing-new/footer';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function FinalCTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(cardRef.current, {
      scale: 0.9,
      opacity: 0,
      y: 50,
      duration: 1.2,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 90%',
        toggleActions: "play none none none"
      },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="cta" className="relative pt-24 pb-0 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-blue-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-48 right-1/4 w-72 h-72 bg-indigo-400/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-12 mb-24">
        <div ref={cardRef}>
          <div className="premium-card p-1 shadow-2xl shadow-blue-500/10">
            <div className="bg-white rounded-[2rem] p-10 lg:p-16 text-center relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-blue-50/50 rounded-br-full pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-tl-full pointer-events-none" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-8 animate-bounce">
                  <Sparkles className="w-4 h-4 text-blue-600 fill-blue-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Start Your Journey</span>
                </div>

                <h2 className="text-display-sm md:text-display text-slate-900 mb-6 font-display">
                  Ready to Get Your <br /><span className="gradient-text">Resume Interview-Ready?</span>
                </h2>
                <p className="text-body-lg text-slate-600 mb-10 max-w-xl mx-auto leading-relaxed">
                  Join 20,000+ professionals who have optimized their resumes for the modern ATS landscape. Get your score in under 30 seconds.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                  <Link href="/review" className="w-full sm:w-auto">
                    <Button className="btn-primary h-14 px-10 text-base font-bold w-full rounded-2xl shadow-xl shadow-blue-500/25">
                      <Zap className="w-5 h-5 mr-2 fill-white" />
                      Analyse My Resume
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 pt-10 border-t border-slate-50">
                  {[
                    "Free initial analysis",
                    "No credit card required",
                    "Encrypted & Secure"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                        <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                      </div>
                      <span className="text-xs font-bold text-slate-500 tracking-tight">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    </section >
  );
}
