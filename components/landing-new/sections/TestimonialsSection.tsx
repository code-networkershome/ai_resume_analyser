import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TestimonialCard } from '@/components/landing-new/shared/TestimonialCard';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    avatar: '/avatars/avatar-01.jpg',
    name: 'Michael Chen',
    role: 'Software Engineer at Google',
    quote:
      'ResumeAI helped me understand exactly what ATS systems were seeing. After optimizing my resume, I started getting callbacks within days.',
    metric: 'ATS score improved from 62 to 91',
  },
  {
    avatar: '/avatars/avatar-02.jpg',
    name: 'Sarah Williams',
    role: 'Product Manager at Meta',
    quote:
      'The keyword matching feature was a game-changer. I could see exactly which skills I needed to highlight for each job application.',
    metric: '3 callbacks in one week after rewriting bullets',
  },
  {
    avatar: '/avatars/avatar-03.jpg',
    name: 'David Park',
    role: 'Tech Lead at Netflix',
    quote:
      'Finally understood what recruiters actually see. The AI suggestions transformed my resume from generic to compelling.',
    metric: 'Interview rate increased by 4x',
  },
];

export function TestimonialsSection() {
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
    <section ref={sectionRef} className="section-padding bg-white/50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-micro text-accent-blue mb-3 block">Testimonials</span>
          <h2 className="text-h2 text-text-primary mb-4">
            Hired <span className="text-accent-blue">Faster</span>
          </h2>
          <p className="text-body text-text-secondary max-w-2xl mx-auto">
            Job seekers use ResumeAI to land interviews at companies that screen with ATS.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              avatar={testimonial.avatar}
              name={testimonial.name}
              role={testimonial.role}
              quote={testimonial.quote}
              metric={testimonial.metric}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
