"use client";

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface MetricBarProps {
  label: string;
  value: number;
  delay?: number;
}

export function MetricBar({ label, value, delay = 0 }: MetricBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (barRef.current && containerRef.current) {
      gsap.fromTo(
        barRef.current,
        { width: '0%', opacity: 0 },
        {
          width: `${value}%`,
          opacity: 1,
          duration: 1.5,
          delay: delay,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 90%',
          }
        }
      );
    }
  }, { dependencies: [value, delay], scope: containerRef });

  return (
    <div ref={containerRef} className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">{label}</span>
        <span className="text-sm font-black text-blue-600 font-display">{value}%</span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 p-[1px]">
        <div
          ref={barRef}
          className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          style={{ width: '0%', transition: 'none' }}
        />
      </div>
    </div>
  );
}
