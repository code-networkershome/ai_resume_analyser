import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FeatureCard } from '@/components/landing-new/shared/FeatureCard';
import { JobCardUI } from '@/components/landing-new/shared/JobCardUI';
import { Button } from '@/components/ui/button';
import { Briefcase, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function JobOptimizationSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
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
          <span className="text-micro text-accent-blue mb-3 block">Job Matching</span>
          <h2 className="text-h2 text-text-primary mb-4">
            Job-Specific <span className="text-accent-blue">Match Analysis</span>
          </h2>
          <p className="text-body text-text-secondary max-w-2xl mx-auto">
            Paste a job description and see which requirements you meet—and where to strengthen your story.
          </p>
        </div>

        <div ref={contentRef}>
          <FeatureCard className="p-6 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left: Features */}
              <div>
                <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center mb-6">
                  <Briefcase className="w-6 h-6 text-accent-blue" />
                </div>
                <h3 className="text-2xl font-semibold text-text-primary mb-4">
                  Check Compatibility for Any Job
                </h3>
                <p className="text-body text-text-secondary mb-6">
                  Our AI analyzes job descriptions and highlights which requirements you meet—and provides
                  specific suggestions to improve your match.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent-blue" />
                    <span className="text-sm text-text-secondary">Automatic requirement matching</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent-blue" />
                    <span className="text-sm text-text-secondary">Gap analysis with priority scores</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent-blue" />
                    <span className="text-sm text-text-secondary">Tailored improvement suggestions</span>
                  </div>
                </div>

                <Button className="bg-accent-blue hover:bg-accent-blue/90 text-white rounded-lg px-6 py-2.5 text-sm font-medium btn-hover">
                  Check Job Match
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              {/* Right: Job Card Demo */}
              <JobCardUI
                title="Senior Frontend Engineer"
                company="TechCorp Inc."
                location="San Francisco, CA"
                tags={['React', 'TypeScript', 'Design Systems']}
                match={78}
              />
            </div>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}
