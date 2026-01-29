import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Award, LayoutDashboard, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const visualsRef = useRef<HTMLDivElement>(null);
  const { status } = useSession();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate content on load
      gsap.fromTo(
        contentRef.current?.children || [],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power2.out' }
      );

      // Animate visuals
      gsap.fromTo(
        visualsRef.current?.children || [],
        { y: 40, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, stagger: 0.15, duration: 1, ease: 'power2.out', delay: 0.3 }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="min-h-screen pt-24 pb-16 px-6 lg:px-12 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[80vh]">
          {/* Left Content */}
          <div ref={contentRef} className="space-y-6">
            {/* Label */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-light rounded-full">
              <span className="w-2 h-2 bg-accent-blue rounded-full animate-pulse"></span>
              <span className="text-xs font-medium text-accent-blue uppercase tracking-wider">
                AI Resume Analyser
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-h1 text-text-primary">
              Get 3x Interviews with Our{' '}
              <span className="relative">
                <span className="relative z-10">AI based</span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-accent-light -z-0"></span>
              </span>{' '}
              <span className="text-accent-blue">Resume Analyser</span>
            </h1>

            {/* Subheadline */}
            <p className="text-body text-text-secondary max-w-lg">
              Elevate your interview chances with deep AI analysis that identifies gaps,
              optimizes keywords, and ensures ATS compatibility in seconds.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {status === 'authenticated' ? (
                <>
                  <Link href="/dashboard">
                    <Button
                      className="bg-accent-blue hover:bg-accent-blue/90 text-white rounded-xl px-8 py-6 text-base font-bold btn-hover flex items-center gap-3 shadow-xl shadow-blue-500/20"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Link href="/review">
                    <Button
                      variant="outline"
                      className="border-blue-200 text-accent-blue hover:bg-blue-50 rounded-xl px-8 py-6 text-base font-bold flex items-center gap-3"
                    >
                      <PlusCircle className="w-5 h-5" />
                      New Analysis
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href="/dashboard">
                  <Button
                    className="bg-accent-blue hover:bg-accent-blue/90 text-white rounded-xl px-8 py-6 text-base font-bold btn-hover flex items-center gap-2 shadow-xl shadow-blue-500/20"
                  >
                    Analyse My Resume
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              )}
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <div className="badge-trust">
                <Award className="w-4 h-4 text-amber-500" />
                <span className="text-text-primary">#1 Product of the Day</span>
              </div>
              <div className="badge-trust">
                <Star className="w-4 h-4 text-green-500 fill-green-500" />
                <span className="text-text-primary">Trust Pilot Excellent 4.8</span>
              </div>
            </div>
          </div>

          {/* Right Visuals - Floating Resume Cards */}
          <div ref={visualsRef} className="relative h-[500px] lg:h-[600px] hidden lg:block">
            {/* Main Resume Card */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 bg-white rounded-2xl shadow-card-hover p-6 animate-float z-20">
              {/* Resume Header */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-blue to-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                  JD
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">John Doe</h3>
                  <p className="text-xs text-text-secondary">Senior Developer</p>
                </div>
              </div>

              {/* Resume Content */}
              <div className="space-y-3">
                <div className="h-2 bg-gray-100 rounded w-3/4"></div>
                <div className="h-2 bg-gray-100 rounded w-full"></div>
                <div className="h-2 bg-gray-100 rounded w-5/6"></div>

                <div className="pt-3">
                  <div className="text-xs font-semibold text-text-primary mb-2">Experience</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                        <span className="text-xs text-accent-blue">G</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded w-32"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                        <span className="text-xs text-purple-600">M</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded w-28"></div>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="text-xs font-semibold text-text-primary mb-2">Skills</div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-1 bg-accent-light text-accent-blue text-xs rounded">React</span>
                    <span className="px-2 py-1 bg-accent-light text-accent-blue text-xs rounded">TypeScript</span>
                    <span className="px-2 py-1 bg-accent-light text-accent-blue text-xs rounded">Node.js</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Score Card - Top Right */}
            <div className="absolute top-8 right-4 w-40 bg-white rounded-xl shadow-card p-4 animate-float-delayed z-30">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-blue">85%</div>
                <div className="text-xs text-text-secondary mt-1">Resume Strength</div>
                <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-accent-blue to-green-400 w-[85%]"></div>
                </div>
              </div>
            </div>

            {/* ATS Score Card - Bottom Left */}
            <div className="absolute bottom-16 left-0 w-44 bg-white rounded-xl shadow-card p-4 animate-float z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-lg">✓</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-text-primary">ATS Ready</div>
                  <div className="text-xs text-text-secondary">98% Compatible</div>
                </div>
              </div>
            </div>

            {/* Keyword Match Card - Top Left */}
            <div className="absolute top-16 left-4 w-36 bg-white rounded-xl shadow-card p-3 z-10">
              <div className="text-xs font-semibold text-text-primary mb-2">Keywords</div>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 bg-green-100 text-green-600 text-[10px] rounded">React ✓</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-600 text-[10px] rounded">AWS ✓</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-600 text-[10px] rounded">+3</span>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-accent-light rounded-full opacity-50 blur-2xl"></div>
            <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-blue-200 rounded-full opacity-30 blur-3xl"></div>
          </div>
        </div>

        {/* Trust Logos */}
        <div className="mt-16 pt-8 border-t border-blue-100">
          <p className="text-center text-sm text-text-secondary mb-6">
            Trusted by professionals from great companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16 opacity-60">
            <span className="text-lg font-bold text-text-primary">Google</span>
            <span className="text-lg font-bold text-text-primary">Meta</span>
            <span className="text-lg font-bold text-text-primary">Amazon</span>
            <span className="text-lg font-bold text-text-primary">Netflix</span>
            <span className="text-lg font-bold text-text-primary">Microsoft</span>
            <span className="text-lg font-bold text-text-primary">Apple</span>
          </div>
        </div>
      </div>
    </section>
  );
}
