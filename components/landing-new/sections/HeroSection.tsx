import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, Sparkles, Zap, Star, TrendingUp, LayoutDashboard, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const visualsRef = useRef<HTMLDivElement>(null);
  const { status } = useSession();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Content entrance animation
      gsap.fromTo(
        contentRef.current?.querySelectorAll('.animate-item') || [],
        { y: 60, opacity: 0, rotateX: 15 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          stagger: 0.12,
          duration: 1,
          ease: 'power3.out'
        }
      );

      // Visuals entrance with stagger
      gsap.fromTo(
        visualsRef.current?.querySelectorAll('.visual-item') || [],
        { scale: 0.8, opacity: 0, y: 40 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 1.2,
          ease: 'back.out(1.7)',
          delay: 0.3
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen pt-24 pb-16 px-6 lg:px-12 overflow-hidden aurora-bg"
    >
      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-400/15 rounded-full blur-3xl animate-float-reverse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-400/10 rounded-full blur-3xl animate-float-slow" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[85vh]">
          {/* Left Content */}
          <div ref={contentRef} className="space-y-8" style={{ perspective: '1000px' }}>
            {/* Badge */}
            <div className="animate-item">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI-Powered Resume Analyser
                </span>
                <span className="px-2 py-0.5 text-xs bg-blue-500 text-white rounded-full">NEW</span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="animate-item text-display text-slate-900 leading-tight">
              Get <span className="gradient-text">3x Interviews</span> with Our{' '}
              <span className="relative inline-block">
                <span className="relative z-10">AI-Powered</span>
                <span className="absolute -bottom-2 left-0 right-0 h-4 bg-gradient-to-r from-blue-200 via-cyan-200 to-purple-200 -z-0 rounded-full opacity-60"></span>
              </span>{' '}
              Resume Analyser
            </h1>

            {/* Subheadline */}
            <p className="animate-item text-body-lg text-slate-600 max-w-lg leading-relaxed">
              Transform your resume with AI that understands what recruiters want.
              Get real-time ATS scoring, keyword optimization, and smart content suggestions.
            </p>

            {/* CTA Buttons */}
            <div className="animate-item flex flex-wrap items-center gap-4">
              {status === 'authenticated' ? (
                <>
                  <Link href="/dashboard">
                    <Button className="btn-primary h-14 px-10 rounded-2xl flex items-center gap-2 text-base shadow-2xl shadow-blue-500/20">
                      <LayoutDashboard className="w-5 h-5" />
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Link href="/review">
                    <Button variant="outline" className="h-14 px-10 rounded-2xl border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-base flex items-center gap-2">
                      <PlusCircle className="w-5 h-5" />
                      New Analysis
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href="/review">
                  <Button className="btn-primary h-14 px-10 rounded-2xl flex items-center gap-2 text-base shadow-2xl shadow-blue-500/20">
                    Build Your Resume
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              )}
              <Link href="#how-it-works">
                <button className="px-6 py-3 h-14 rounded-xl font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all flex items-center gap-2 group">
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  See How It Works
                </button>
              </Link>
            </div>

            {/* Stats Row */}
            <div className="animate-item flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/60 border border-slate-200/50 backdrop-blur-sm shadow-sm transition-all hover:shadow-md hover:bg-white/80">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <Star className="w-5 h-5 text-white fill-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">#1 Product</div>
                  <div className="text-xs text-slate-500">of the Day</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/60 border border-slate-200/50 backdrop-blur-sm shadow-sm transition-all hover:shadow-md hover:bg-white/80">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
                  <Zap className="w-5 h-5 text-white fill-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">4.9 Rating</div>
                  <div className="text-xs text-slate-500">2,000+ Reviews</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visuals - 3D Floating Cards */}
          <div ref={visualsRef} className="relative h-[550px] lg:h-[650px] hidden lg:block">
            {/* Main Resume Card - Center */}
            <div className="visual-item absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 glass-card rounded-3xl p-6 animate-float z-20 transition-all hover:shadow-2xl hover:shadow-blue-500/10">
              {/* Resume Header */}
              <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-200/50">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  JD
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">John Doe</h3>
                  <p className="text-sm text-slate-500">Senior Full Stack Developer</p>
                </div>
              </div>

              {/* Resume Content */}
              <div className="space-y-4">
                <div>
                  <div className="h-2.5 bg-slate-100 rounded-full w-full mb-2"></div>
                  <div className="h-2.5 bg-slate-100 rounded-full w-4/5"></div>
                </div>

                <div className="pt-3">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Experience</div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
                        <span className="text-white text-xs font-bold">G</span>
                      </div>
                      <div className="flex-1">
                        <div className="h-2 bg-slate-100 rounded-full w-3/4 mb-1"></div>
                        <div className="h-1.5 bg-slate-50 rounded-full w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Skills</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 text-xs font-medium rounded-full">React</span>
                    <span className="px-3 py-1.5 bg-gradient-to-r from-cyan-50 to-cyan-100 text-cyan-600 text-xs font-medium rounded-full">TypeScript</span>
                    <span className="px-3 py-1.5 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-600 text-xs font-medium rounded-full">Node.js</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Score Card - Top Right */}
            <div className="visual-item absolute top-8 right-4 glass-card rounded-2xl p-5 animate-float-reverse z-30 shadow-2xl shadow-blue-500/10">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="text-4xl font-bold gradient-text">92%</div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div className="text-sm font-medium text-slate-600 mt-1">Resume Score</div>
                <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden w-32 border border-slate-200/50 p-[1px]">
                  <div className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-green-400 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>

            {/* ATS Badge - Bottom Left */}
            <div className="visual-item absolute bottom-24 left-0 glass-card rounded-2xl p-4 animate-float-slow z-10 shadow-2xl shadow-emerald-500/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">ATS Ready</div>
                  <div className="text-xs text-slate-500">98% Compatible</div>
                </div>
              </div>
            </div>

            {/* Keywords Card - Top Left */}
            <div className="visual-item absolute top-16 left-4 glass-card rounded-xl p-4 z-10 shadow-lg shadow-blue-500/5">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Keywords Matched</div>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 bg-green-100 text-green-600 text-[10px] font-medium rounded-full flex items-center gap-1">
                  React <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </span>
                <span className="px-2.5 py-1 bg-green-100 text-green-600 text-[10px] font-medium rounded-full flex items-center gap-1">
                  AWS <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </span>
              </div>
            </div>

            {/* Decorative Glow */}
            <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/3 left-1/4 w-40 h-40 bg-purple-400/15 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Trust Logos */}
        <div className="mt-8 pt-8 border-t border-slate-200/50">
          <p className="text-center text-sm text-slate-500 mb-6 font-medium">
            Trusted by professionals hiring at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16 opacity-40 hover:opacity-100 transition-opacity">
            {['Google', 'Meta', 'Amazon', 'Netflix', 'Microsoft', 'Apple'].map((company, i) => (
              <span
                key={company}
                className="text-lg font-bold text-slate-300 hover:text-slate-600 transition-colors cursor-default"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
