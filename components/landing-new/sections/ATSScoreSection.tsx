import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FeatureCard } from '@/components/landing-new/shared/FeatureCard';
import { ScoreRing } from '@/components/landing-new/shared/ScoreRing';
import { MetricBar } from '@/components/landing-new/shared/MetricBar';
import { Badge } from '@/components/ui/badge';
import { Layout, FileText, Zap, CheckCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function ATSScoreSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
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
    <section
      ref={sectionRef}
      id="ats-check"
      className="section-padding"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-micro text-accent-blue mb-3 block">ATS Check</span>
          <h2 className="text-h2 text-text-primary mb-4">
            Check Your Resume <span className="text-accent-blue">ATS Score</span>
          </h2>
          <p className="text-body text-text-secondary max-w-2xl mx-auto">
            See how well your resume performs against Applicant Tracking Systems used by 99% of Fortune 500 companies.
          </p>
        </div>

        <div ref={cardRef}>
          <FeatureCard className="p-6 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left: Score & Metrics */}
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <ScoreRing score={82} label="Great" size={160} />
                <div className="flex-1 space-y-4 w-full">
                  <MetricBar label="Formatting" value={88} />
                  <MetricBar label="Keyword Density" value={76} />
                  <MetricBar label="Section Structure" value={92} />
                </div>
              </div>

              {/* Right: Suggestions */}
              <div className="bg-blue-50/50 rounded-2xl p-6">
                <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent-blue" />
                  Improvement Suggestions
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-white rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        Add measurable outcomes
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        Include numbers and percentages
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white rounded-xl">
                    <FileText className="w-5 h-5 text-accent-blue flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        Improve contact block
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        Add LinkedIn and portfolio links
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white rounded-xl">
                    <Layout className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        Use stronger action verbs
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        Replace passive language
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-blue-100 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="rounded-full text-xs bg-green-100 text-green-600">
                    ATS Optimized
                  </Badge>
                  <Badge variant="secondary" className="rounded-full text-xs bg-blue-100 text-accent-blue">
                    Readable
                  </Badge>
                </div>
              </div>
            </div>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}
