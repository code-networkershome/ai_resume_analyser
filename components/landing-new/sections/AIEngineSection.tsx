import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { Cpu, Upload, ArrowRight } from 'lucide-react';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

export function AIEngineSection() {
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
    <section ref={sectionRef} className="section-padding bg-gradient-to-b from-blue-900 to-blue-800">
      <div className="max-w-4xl mx-auto">
        <div ref={contentRef} className="text-center">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-8">
            <Cpu className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-h2 text-white mb-4">
            Powered by an <span className="text-blue-300">Advanced AI Engine</span>
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8 leading-relaxed">
            We use modern language models paired with ATS heuristics to give you fast,
            private, and actionable feedback—without sending your data to third parties.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <Link href="/dashboard">
              <Button className="bg-white text-blue-800 hover:bg-blue-50 rounded-lg px-6 py-3 text-sm font-semibold btn-hover">
                <Upload className="w-4 h-4 mr-2" />
                Check My Resume
              </Button>
            </Link>
            <Button
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 rounded-lg px-6 py-3 text-sm font-semibold"
            >
              See How It Works
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">GPT-4o</div>
              <div className="text-sm text-blue-200 mt-1">Language Model</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <div className="text-3xl font-bold text-white">&lt;2s</div>
              <div className="text-sm text-blue-200 mt-1">Response Time</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <div className="text-3xl font-bold text-white">256-bit</div>
              <div className="text-sm text-blue-200 mt-1">Encryption</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
