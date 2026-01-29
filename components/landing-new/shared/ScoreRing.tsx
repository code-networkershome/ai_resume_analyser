"use client";

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);
interface ScoreRingProps {
  score: number;
  label: string;
  size?: number;
  strokeWidth?: number;
}

export function ScoreRing({
  score,
  label,
  size = 180,
  strokeWidth = 12,
}: ScoreRingProps) {
  const ringRef = useRef<SVGCircleElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  useGSAP(() => {
    if (ringRef.current && containerRef.current) {
      // Animate ring stroke
      gsap.fromTo(
        ringRef.current,
        { strokeDashoffset: circumference },
        {
          strokeDashoffset: offset,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
          }
        }
      );

      // Animate number count
      const obj = { value: 0 };
      gsap.to(obj, {
        value: score,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
        },
        onUpdate: () => {
          if (numberRef.current) {
            numberRef.current.textContent = Math.round(obj.value).toString();
          }
        },
      });

      // Scale in
      gsap.fromTo(
        containerRef.current,
        { scale: 0.8, opacity: 0, rotate: -10 },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 90%',
          }
        }
      );
    }
  }, { dependencies: [score, offset, circumference], scope: containerRef });

  return (
    <div ref={containerRef} className="relative inline-block group">
      <div className="absolute inset-0 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors duration-700" />
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90 relative z-10"
      >
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#F1F5F9"
          strokeWidth={strokeWidth}
        />
        {/* Progress ring with gradient effect */}
        <circle
          ref={ringRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#score-ring-gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
        />
        <defs>
          <linearGradient id="score-ring-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
        <div className="flex flex-col items-center">
          <div className="flex items-baseline mb-0.5">
            <span
              ref={numberRef}
              className="text-5xl font-black text-slate-900 font-display tracking-tight leading-none"
            >
              0
            </span>
            <span className="text-xl font-black text-blue-500 ml-0.5">%</span>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}
