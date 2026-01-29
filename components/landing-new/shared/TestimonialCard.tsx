"use client";

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Quote } from 'lucide-react';

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
    <div className="premium-card p-[1px] h-full group">
      <div className="bg-white rounded-[23px] p-8 h-full flex flex-col">
        <div className="mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 mb-4 transition-transform group-hover:rotate-12">
            <Quote className="w-5 h-5 text-blue-500 fill-blue-500" />
          </div>
          <p className="text-slate-700 text-sm leading-relaxed font-medium italic">"{quote}"</p>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-11 h-11 border-2 border-white shadow-md">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="bg-blue-50 text-blue-600 font-black text-xs">
                {name.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h4 className="font-bold text-slate-900 text-sm truncate">{name}</h4>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest truncate">{role}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-50/50">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-50/50 px-2.5 py-1 rounded-full border border-blue-100/50">
            {metric}
          </span>
        </div>
      </div>
    </div>
  );
}
