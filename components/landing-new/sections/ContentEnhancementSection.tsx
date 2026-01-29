import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FeatureCard } from '@/components/landing-new/shared/FeatureCard';
import { RewriteUI } from '@/components/landing-new/shared/RewriteUI';
import { Button } from '@/components/ui/button';
import { Sparkles, Wand2, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function ContentEnhancementSection() {
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
    <section ref={sectionRef} className="section-padding bg-white/50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-micro text-accent-blue mb-3 block">AI Enhancement</span>
          <h2 className="text-h2 text-text-primary mb-4">
            Smart <span className="text-accent-blue">Content Enhancement</span>
          </h2>
          <p className="text-body text-text-secondary max-w-2xl mx-auto">
            Turn passive responsibilities into measurable achievements with AI-powered suggestions.
          </p>
        </div>

        <div ref={contentRef}>
          <FeatureCard className="p-6 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left: Features */}
              <div>
                <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6 text-accent-blue" />
                </div>
                <h3 className="text-2xl font-semibold text-text-primary mb-4">
                  Transform Your Bullets
                </h3>
                <p className="text-body text-text-secondary mb-6">
                  Our AI suggests stronger verbs, clearer metrics, and tighter phrasing to make your resume stand out.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent-light flex items-center justify-center flex-shrink-0">
                      <Wand2 className="w-4 h-4 text-accent-blue" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">Stronger action verbs</p>
                      <p className="text-xs text-text-secondary">Replace weak verbs with powerful alternatives</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent-light flex items-center justify-center flex-shrink-0">
                      <Wand2 className="w-4 h-4 text-accent-blue" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">Clearer metrics</p>
                      <p className="text-xs text-text-secondary">Add quantifiable results to achievements</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent-light flex items-center justify-center flex-shrink-0">
                      <Wand2 className="w-4 h-4 text-accent-blue" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">Buzzword removal</p>
                      <p className="text-xs text-text-secondary">Eliminate clichés and overused phrases</p>
                    </div>
                  </div>
                </div>

                <Button className="bg-accent-blue hover:bg-accent-blue/90 text-white rounded-lg px-6 py-2.5 text-sm font-medium btn-hover">
                  Try a Rewrite
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              {/* Right: Rewrite Demo */}
              <div className="bg-blue-50/50 rounded-2xl p-6">
                <RewriteUI
                  before="Responsible for coding features."
                  after="Shipped 12 customer-facing features in 6 months, reducing churn by 9%."
                />
                <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-100">
                  <p className="text-xs text-green-700">
                    <span className="font-semibold">Impact increased by 340%</span> — Measurable results get 3x more interviews
                  </p>
                </div>
              </div>
            </div>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}
