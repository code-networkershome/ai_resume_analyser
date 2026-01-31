"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, LayoutDashboard, LogOut, FileText, Sparkles, Shield } from 'lucide-react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled || mobileMenuOpen
        ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-blue-500/5 border-b border-blue-100/50 py-3'
        : 'bg-transparent py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group transition-transform hover:scale-105 active:scale-95"
        >
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="font-bold text-lg text-slate-900">ResumeAI</span>
        </Link>

        {/* Desktop Nav - Removed as per request */}
        <div className="hidden md:flex items-center gap-1" />

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {status === 'authenticated' ? (
            <div className="flex items-center gap-3">
              {session?.user?.email === 'vikas@networkershome.com' && (
                <Link href="/admin">
                  <Button
                    variant="ghost"
                    className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </Button>
                </Link>
              )}
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
              <Button
                variant="outline"
                className="px-5 py-2.5 text-sm font-medium border-slate-200 text-slate-600 hover:text-red-500 hover:bg-red-50 hover:border-red-100 rounded-xl transition-all"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <Link href="/auth/signin">
                <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                  Login
                </button>
              </Link>
              <Link href="/review">
                <button
                  className="px-5 py-2.5 bg-accent-blue text-white text-sm font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Get Started
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[73px] bg-white/95 backdrop-blur-xl z-[90] px-6 py-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-6">
            {/* Mobile Nav Links - Removed */}

            <div className="pt-4 flex flex-col gap-4">
              {status === 'authenticated' ? (
                <>
                  {session?.user?.email === 'vikas@networkershome.com' && (
                    <Link href="/admin" className="w-full">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-base font-bold text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl gap-3 py-6"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Shield className="w-5 h-5" />
                        Admin Dashboard
                      </Button>
                    </Link>
                  )}
                  <Link href="/dashboard" className="w-full">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-base font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl gap-3 py-6"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/review" className="w-full">
                    <Button
                      className="btn-primary rounded-xl w-full py-6 text-base font-bold shadow-lg shadow-blue-500/20"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      New Analysis
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:bg-red-50 rounded-xl gap-3 py-6 font-bold"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/signin" className="w-full">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-base font-bold text-slate-600 py-6"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Log in
                    </Button>
                  </Link>
                  <Link href="/review" className="w-full">
                    <Button
                      className="btn-primary rounded-xl w-full py-6 text-base font-bold shadow-lg shadow-blue-500/20"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Analyse My Resume
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
