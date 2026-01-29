"use client";

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { FeatureCard } from '@/components/landing-new/shared/FeatureCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, AlertCircle, BookOpen, Lightbulb, ArrowRight, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const missingSkills = [
  { name: 'GraphQL', priority: 'high' },
  { name: 'CI/CD', priority: 'medium' },
  { name: 'System Design', priority: 'medium' },
];

export function SkillGapSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (cardsRef.current) {
      gsap.fromTo(
        cardsRef.current.children,
        { y: 60, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.15,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: "play none none none"
          },
        }
      );
    }
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="section-padding relative overflow-hidden bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Career Trajectory</span>
          </div>
          <h2 className="text-headline text-slate-900 mb-6">
            Close Your <span className="gradient-text">Skill Gaps</span> Today
          </h2>
          <p className="text-body-lg text-slate-600 max-w-2xl mx-auto">
            Actionable insights that map your current profile against the demands of the
            top tech companies, giving you a clear roadmap to your next role.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="premium-card p-10 flex flex-col h-full bg-white">
            <div className="w-14 h-14 premium-icon-bg icon-glow-blue mb-8">
              <TrendingUp className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 font-display">
              Gap Roadmap
            </h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              Prioritized analysis of what's missing between your profile and the job description.
            </p>
            <div className="pt-6 border-t border-slate-50 space-y-4 mt-auto">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">Match Accuracy</span>
                  <span className="text-blue-600">80%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                  <div className="h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.2)]" style={{ width: '80%' }} />
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span>3 critical skills identified</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="premium-card p-10 flex flex-col h-full bg-white">
            <div className="w-14 h-14 premium-icon-bg icon-glow-rose mb-8">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-6 font-display">
              Critical Needs
            </h3>
            <div className="space-y-3 flex-grow">
              {missingSkills.map((skill, index) => (
                <div key={skill.name} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 transition-all hover:translate-x-1 group">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-white shadow-sm text-slate-600 text-[10px] font-black flex items-center justify-center group-hover:bg-rose-50 group-hover:text-rose-600 transition-colors">
                      0{index + 1}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{skill.name}</span>
                  </div>
                  <Badge className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${skill.priority === 'high'
                    ? 'bg-rose-50 text-rose-600 border-rose-100'
                    : 'bg-amber-50 text-amber-600 border-amber-100'
                    } shadow-none`}>
                    {skill.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3 */}
          <div className="premium-card p-10 flex flex-col h-full bg-white">
            <div className="w-14 h-14 premium-icon-bg icon-glow-purple mb-8">
              <Lightbulb className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 font-display">
              Smart Suggestions
            </h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              Receive personalized project ideas and course recommendations to pad your experience.
            </p>
            <div className="flex flex-wrap gap-4 pt-6 border-t border-slate-50 mt-auto">
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-500">
                <BookOpen className="w-4 h-4 text-purple-500" />
                <span>Tutorial Mapping</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-500">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Project Hooks</span>
              </div>
            </div>
            <Button className="mt-8 btn-primary w-full h-12 text-sm font-bold shadow-lg shadow-blue-500/20">
              Generate Growth Plan
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
