import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

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
  strokeWidth = 10,
}: ScoreRingProps) {
  const ringRef = useRef<SVGCircleElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  useEffect(() => {
    if (ringRef.current && numberRef.current && containerRef.current) {
      // Animate ring stroke
      gsap.fromTo(
        ringRef.current,
        { strokeDashoffset: circumference },
        { strokeDashoffset: offset, duration: 1.2, ease: 'power2.out' }
      );

      // Animate number count
      const obj = { value: 0 };
      gsap.to(obj, {
        value: score,
        duration: 1.2,
        ease: 'power2.out',
        onUpdate: () => {
          if (numberRef.current) {
            numberRef.current.textContent = Math.round(obj.value).toString();
          }
        },
      });

      // Scale in
      gsap.fromTo(
        containerRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.2 }
      );
    }
  }, [score, offset, circumference]);

  return (
    <div ref={containerRef} className="relative">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <circle
          ref={ringRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#3B82F6"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          style={{ transition: 'none' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          ref={numberRef}
          className="text-4xl font-bold text-text-primary"
        >
          0
        </span>
        <span className="text-sm font-medium text-text-secondary mt-1">
          {label}
        </span>
      </div>
    </div>
  );
}
