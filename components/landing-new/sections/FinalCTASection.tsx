import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FeatureCard } from '@/components/landing-new/shared/FeatureCard';
import { Button } from '@/components/ui/button';
import { Upload, ArrowRight, Check } from 'lucide-react';
import { Footer } from '@/components/landing-new/footer';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

export function FinalCTASection() {
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
    <section ref={sectionRef} id="pricing" className="pt-16 pb-0">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 mb-16">
        <div ref={cardRef}>
          <FeatureCard className="p-8 lg:p-12 text-center">
            <h2 className="text-h2 text-text-primary mb-4">
              Ready to Get Your Resume <span className="text-accent-blue">Scored?</span>
            </h2>
            <p className="text-body text-text-secondary mb-8 max-w-lg mx-auto">
              Upload now. Get actionable feedback in seconds and start landing more interviews.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <Link href="/dashboard">
                <Button className="bg-accent-blue hover:bg-accent-blue/90 text-white rounded-lg px-8 py-3 text-sm font-semibold btn-hover flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Check My Resume
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Check className="w-4 h-4 text-green-500" />
                <span>Free basic scan</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Check className="w-4 h-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Check className="w-4 h-4 text-green-500" />
                <span>Private & secure</span>
              </div>
            </div>
          </FeatureCard>
        </div>
      </div >

      <Footer />
    </section >
  );
}
