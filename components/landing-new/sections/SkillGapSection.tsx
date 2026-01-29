import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FeatureCard } from '@/components/landing-new/shared/FeatureCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, AlertCircle, BookOpen, Lightbulb, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const missingSkills = [
  { name: 'GraphQL', priority: 'high' },
  { name: 'CI/CD', priority: 'medium' },
  { name: 'Performance Budgeting', priority: 'medium' },
];

export function SkillGapSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current?.children || [],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-micro text-accent-blue mb-3 block">Skill Analysis</span>
          <h2 className="text-h2 text-text-primary mb-4">
            Close Your <span className="text-accent-blue">Skill Gaps</span>
          </h2>
          <p className="text-body text-text-secondary max-w-2xl mx-auto">
            Compare your profile to any job description and get actionable steps to close the gaps.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Card */}
          <FeatureCard className="p-6 lg:p-8">
            <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6 text-accent-blue" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-3">
              Skill Gap Analysis
            </h3>
            <p className="text-sm text-text-secondary mb-6">
              Compare your profile to any job description. Get a prioritized list of gaps.
            </p>
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-secondary">Skills matched</span>
                <span className="font-semibold text-text-primary">12/15</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '80%' }} />
              </div>
              <p className="text-xs text-text-secondary mt-2">3 skills need attention</p>
            </div>
          </FeatureCard>

          {/* Middle Card */}
          <FeatureCard className="p-6 lg:p-8">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-6">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-4">
              Missing Skills
            </h3>
            <div className="space-y-3">
              {missingSkills.map((skill, index) => (
                <div key={skill.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-accent-light text-accent-blue text-xs font-medium flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="font-medium text-text-primary text-sm">{skill.name}</span>
                  </div>
                  <Badge className={`rounded-full text-xs ${
                    skill.priority === 'high' 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-amber-100 text-amber-600'
                  }`}>
                    {skill.priority}
                  </Badge>
                </div>
              ))}
            </div>
            <p className="text-xs text-text-secondary mt-4">
              Add 1–2 projects or rephrase existing work to cover these skills.
            </p>
          </FeatureCard>

          {/* Right Card */}
          <FeatureCard className="p-6 lg:p-8">
            <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center mb-6">
              <Lightbulb className="w-6 h-6 text-accent-blue" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-3">
              Action Plan
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              Generate a step-by-step plan: courses, project ideas, and bullet rewrites.
            </p>
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <BookOpen className="w-4 h-4 text-accent-blue" />
                <span>Courses</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <TrendingUp className="w-4 h-4 text-accent-blue" />
                <span>Projects</span>
              </div>
            </div>
            <Button variant="outline" className="rounded-lg text-sm w-full">
              Generate Action Plan
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}
