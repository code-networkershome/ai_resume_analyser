import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface MetricBarProps {
  label: string;
  value: number;
  delay?: number;
}

export function MetricBar({ label, value, delay = 0 }: MetricBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (barRef.current && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, delay, ease: 'power2.out' }
      );

      gsap.fromTo(
        barRef.current,
        { width: '0%' },
        { width: `${value}%`, duration: 1, delay: delay + 0.2, ease: 'power2.out' }
      );
    }
  }, [value, delay]);

  return (
    <div ref={containerRef}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-text-primary">{label}</span>
        <span className="text-sm font-semibold text-accent-blue">{value}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          ref={barRef}
          className="h-full bg-accent-blue rounded-full"
          style={{ width: '0%' }}
        />
      </div>
    </div>
  );
}
