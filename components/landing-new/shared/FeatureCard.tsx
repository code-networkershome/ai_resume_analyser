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
        'bg-white rounded-2xl shadow-card border border-blue-100 overflow-hidden card-hover',
        className
      )}
    >
      {children}
    </div>
  );
}

export function DarkFeatureCard({ children, className }: FeatureCardProps) {
  return (
    <div
      className={cn(
        'bg-blue-900/50 rounded-2xl border border-white/10 overflow-hidden',
        className
      )}
    >
      {children}
    </div>
  );
}
