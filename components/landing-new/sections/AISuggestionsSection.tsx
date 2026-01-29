import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FeatureCard } from '@/components/landing-new/shared/FeatureCard';
import { Sparkles, TrendingUp, Zap, Scissors, XCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const suggestions = [
  {
    icon: TrendingUp,
    text: 'Add measurable outcomes',
    description: 'Include metrics like percentages, dollars, or time saved',
  },
  {
    icon: Zap,
    text: 'Use stronger action verbs',
    description: 'Replace "responsible for" with "spearheaded" or "delivered"',
  },
  {
    icon: Scissors,
    text: 'Shorten summary to 2 lines',
    description: 'Recruiters spend 6 seconds on average',
  },
  {
    icon: XCircle,
    text: 'Remove buzzwords',
    description: 'Eliminate "synergy", "think outside the box", etc.',
  },
];

export function AISuggestionsSection() {
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
          <span className="text-micro text-accent-blue mb-3 block">AI Suggestions</span>
          <h2 className="text-h2 text-text-primary mb-4">
            Get <span className="text-accent-blue">Smart Recommendations</span>
          </h2>
          <p className="text-body text-text-secondary max-w-2xl mx-auto">
            Our AI analyzes your resume and provides specific, actionable suggestions to improve it.
          </p>
        </div>

        <div ref={contentRef}>
          <FeatureCard className="p-6 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left: Suggestions List */}
              <div>
                <h3 className="text-xl font-semibold text-text-primary mb-6">
                  Improvement Suggestions
                </h3>
                <div className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-xl bg-blue-50/50 hover:bg-blue-50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-accent-light flex items-center justify-center flex-shrink-0">
                        <suggestion.icon className="w-5 h-5 text-accent-blue" />
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{suggestion.text}</p>
                        <p className="text-sm text-text-secondary mt-0.5">{suggestion.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Preview */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <span className="text-micro text-text-secondary mb-4 block">Preview</span>
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-text-secondary line-through">"Led a team..."</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Sparkles className="w-4 h-4 text-accent-blue" />
                      <p className="text-sm text-text-primary">"Led a team of 6 engineers to deliver..."</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-text-secondary line-through">"Improved performance..."</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Sparkles className="w-4 h-4 text-accent-blue" />
                      <p className="text-sm text-text-primary">"Cut API latency by 34% through..."</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-text-secondary line-through">"Responsible for coding..."</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Sparkles className="w-4 h-4 text-accent-blue" />
                      <p className="text-sm text-text-primary">"Shipped 12 features in 6 months..."</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Improvements made</span>
                  <span className="text-accent-blue font-semibold">12</span>
                </div>
              </div>
            </div>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}
