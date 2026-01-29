import { ArrowRight, Sparkles } from 'lucide-react';

interface RewriteUIProps {
  before: string;
  after: string;
}

export function RewriteUI({ before, after }: RewriteUIProps) {
  return (
    <div className="space-y-3">
      {/* Before */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">Before</span>
        </div>
        <p className="text-text-primary text-sm">{before}</p>
      </div>

      {/* Arrow */}
      <div className="flex justify-center">
        <div className="w-8 h-8 rounded-full bg-accent-light flex items-center justify-center">
          <ArrowRight className="w-4 h-4 text-accent-blue" />
        </div>
      </div>

      {/* After */}
      <div className="bg-accent-light rounded-xl p-4 border border-blue-100 relative">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-blue rounded-l-xl" />
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-accent-blue" />
          <span className="text-xs font-medium text-accent-blue uppercase tracking-wider">After</span>
        </div>
        <p className="text-text-primary text-sm font-medium">{after}</p>
      </div>
    </div>
  );
}
