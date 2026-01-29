"use client";

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  children: ReactNode;
  className?: string;
}

export function FeatureCard({ children, className }: FeatureCardProps) {
  return (
    <div
      className={cn(
        'premium-card p-[1px] group',
        className
      )}
    >
      <div className="bg-white rounded-[23px] h-full w-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export function DarkFeatureCard({ children, className }: FeatureCardProps) {
  return (
    <div
      className={cn(
        'bg-slate-900 rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative group',
        className
      )}
    >
      {/* Subtle Glow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
