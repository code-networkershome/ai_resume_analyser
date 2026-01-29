"use client";

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Quote, Star, TrendingUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const testimonials = [
  // ... (same testimonials array content)
  {
    quote: '"ResumeAI helped me understand exactly what ATS systems were seeing. My score went from 62 to 91, and I started getting callbacks within days."',
    name: 'Michael Chen',
    role: 'Software Engineer at Google',
    avatar: 'MC',
    stat: 'ATS: 62 → 91',
    color: 'text-emerald-500'
  },
  {
    quote: '"The keyword matching feature was a game-changer. I could see exactly which skills to highlight for each job application."',
    name: 'Sarah Williams',
    role: 'Product Manager at Meta',
    avatar: 'SW',
    stat: '3 callbacks in 1 week',
    color: 'text-blue-500'
  },
  {
    quote: '"Finally understood what recruiters actually see. The AI suggestions transformed my resume from generic to compelling."',
    name: 'David Park',
    role: 'Tech Lead at Netflix',
    avatar: 'DP',
    stat: '4x interview rate',
    color: 'text-purple-500'
  }
];

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(".testimonial-header",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 95%",
          toggleActions: "play none none none"
        }
      }
    );

    if (containerRef.current) {
      gsap.fromTo(containerRef.current.children,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        }
      );
    }
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="testimonials" className="section-padding relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="testimonial-header text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Success Stories</span>
          </div>
          <h2 className="text-display text-slate-900 mb-6 font-display">
            Hired <span className="gradient-text">Faster</span>
          </h2>
          <p className="text-body-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Join thousands of job seekers who transformed their resumes and landed their
            dream jobs.
          </p>
        </div>

        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card premium-card p-10 flex flex-col relative group">
              {/* Quote Icon */}
              <div className="absolute -top-5 left-8 w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 z-10">
                <Quote className="w-5 h-5 text-white fill-white" />
              </div>

              {/* Stars */}
              <div className="flex gap-1.5 mb-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>

              <p className="text-slate-600 text-[15px] leading-[1.8] font-medium mb-10 flex-grow italic">
                {t.quote}
              </p>

              <div className="flex items-center gap-4 pt-8 border-t border-slate-50">
                <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white font-black">{t.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{t.role}</div>
                </div>
              </div>

              {/* Success Badge */}
              <div className="mt-6">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-emerald-100 group-hover:bg-emerald-50 transition-colors`}>
                  <TrendingUp className={`w-3.5 h-3.5 ${t.color}`} />
                  <span className={`text-[10px] font-black uppercase tracking-widest ${t.color}`}>{t.stat}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
