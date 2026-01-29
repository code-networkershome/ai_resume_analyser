import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FeatureCard } from '@/components/landing-new/shared/FeatureCard';
import { Badge } from '@/components/ui/badge';
import { Target, Search, Code2, Database, Cloud, Cpu } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const keywords = ['React', 'TypeScript', 'Node.js', 'AWS', 'GraphQL'];

export function KeywordMatchSection() {
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
    <section ref={sectionRef} id="features" className="section-padding">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-micro text-accent-blue mb-3 block">Features</span>
          <h2 className="text-h2 text-text-primary mb-4">
            Smart <span className="text-accent-blue">Keyword Matching</span>
          </h2>
          <p className="text-body text-text-secondary max-w-2xl mx-auto">
            We compare your resume to the job description and surface missing skills—so you know exactly what to add.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Card */}
          <FeatureCard className="p-6 lg:p-8">
            <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center mb-6">
              <Target className="w-6 h-6 text-accent-blue" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-3">
              Keyword Matching
            </h3>
            <p className="text-sm text-text-secondary mb-6">
              We compare your resume to the job description and surface missing skills—so you know exactly what to add.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Code2 className="w-4 h-4 text-accent-blue" />
                <span>Technical skills</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Database className="w-4 h-4 text-accent-blue" />
                <span>Soft skills</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Cloud className="w-4 h-4 text-accent-blue" />
                <span>Industry terms</span>
              </div>
            </div>
          </FeatureCard>

          {/* Middle Card */}
          <FeatureCard className="p-6 lg:p-8">
            <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center mb-6">
              <Search className="w-6 h-6 text-accent-blue" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-3">
              Keyword Density Analysis
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {keywords.map((keyword) => (
                <Badge key={keyword} variant="secondary" className="rounded-full px-3 py-1 text-xs bg-accent-light text-accent-blue">
                  <Cpu className="w-3 h-3 mr-1" />
                  {keyword}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-text-secondary mb-4">
              Add 2–3 more mentions naturally in experience bullets.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">Current Density</span>
                <span className="font-medium text-text-primary">68%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-accent-blue rounded-full" style={{ width: '68%' }} />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">Target</span>
                <span className="font-medium text-green-500">85%</span>
              </div>
            </div>
          </FeatureCard>

          {/* Right Card */}
          <FeatureCard className="p-6 lg:p-8">
            <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center mb-6">
              <Search className="w-6 h-6 text-accent-blue" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-3">
              ATS Parsing Simulation
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              See what an ATS actually reads: headings, contact fields, and bullet structure.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-text-secondary">Headings detected</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-text-secondary">Contact parsed</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-text-secondary">Bullets readable</span>
              </div>
            </div>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}
