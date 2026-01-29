import { Badge } from '@/components/ui/badge';
import { Building2, MapPin } from 'lucide-react';

interface JobCardUIProps {
  title: string;
  company?: string;
  location?: string;
  tags: string[];
  match: number;
}

export function JobCardUI({
  title,
  company = 'TechCorp Inc.',
  location = 'San Francisco, CA',
  tags,
  match,
}: JobCardUIProps) {
  return (
    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-semibold text-text-primary">{title}</h4>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center text-xs text-text-secondary">
              <Building2 className="w-3 h-3 mr-1" />
              {company}
            </span>
            <span className="flex items-center text-xs text-text-secondary">
              <MapPin className="w-3 h-3 mr-1" />
              {location}
            </span>
          </div>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            match >= 80
              ? 'bg-green-100 text-green-600'
              : match >= 60
              ? 'bg-amber-100 text-amber-600'
              : 'bg-red-100 text-red-600'
          }`}
        >
          Match {match}%
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="rounded-full px-2.5 py-1 text-xs bg-accent-light text-accent-blue">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-text-secondary">Requirements match</span>
          <span className="font-medium text-text-primary">{match}/100</span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              match >= 80 ? 'bg-green-500' : match >= 60 ? 'bg-amber-500' : 'bg-red-500'
            }`}
            style={{ width: `${match}%` }}
          />
        </div>
      </div>
    </div>
  );
}
