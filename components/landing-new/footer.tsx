"use client";

import { Linkedin, Twitter, Github, FileText, ArrowUp } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-slate-100 px-6 lg:px-12 py-16 relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-6 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/10 group-hover:scale-105 transition-transform">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900 font-display">ResumeAI</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              Empowering job seekers with AI-driven resume intelligence and ATS optimization since 2024.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: Twitter, href: "#" },
                { icon: Linkedin, href: "#" },
                { icon: Github, href: "#" }
              ].map((social, i) => (
                <a key={i} href={social.href} className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all border border-slate-100">
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 col-span-1 md:col-span-3 gap-8">
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-6 uppercase tracking-widest">Product</h4>
              <ul className="space-y-4">
                <li><Link href="#ats-check" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">ATS Checker</Link></li>
                <li><Link href="#features" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Keyword Match</Link></li>
                <li><Link href="#ai-rewrite" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">AI Rewriting</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-6 uppercase tracking-widest">Resources</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Resume Tips</Link></li>
                <li><Link href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">ATS Guide</Link></li>
                <li><Link href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Success Stories</Link></li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1 pt-8 md:pt-0">
              <h4 className="font-bold text-slate-900 text-sm mb-6 uppercase tracking-widest">Company</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Contact Support</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[2px]">
            © {new Date().getFullYear()} RESUME AI ANALYSER. ALL RIGHTS RESERVED.
          </p>
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors"
          >
            Back to top
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-all">
              <ArrowUp className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
