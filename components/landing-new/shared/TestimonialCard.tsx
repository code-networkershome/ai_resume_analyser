import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface TestimonialCardProps {
  avatar: string;
  name: string;
  role: string;
  quote: string;
  metric: string;
}

export function TestimonialCard({
  avatar,
  name,
  role,
  quote,
  metric,
}: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-blue-100 p-6 card-hover">
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="bg-accent-light text-accent-blue font-medium">
            {name.split(' ').map((n) => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-semibold text-text-primary">{name}</h4>
          <p className="text-xs text-text-secondary">{role}</p>
        </div>
      </div>

      <p className="text-text-primary text-sm leading-relaxed mb-4">{quote}</p>

      <div className="pt-4 border-t border-blue-50">
        <span className="text-micro text-accent-blue">{metric}</span>
      </div>
    </div>
  );
}
