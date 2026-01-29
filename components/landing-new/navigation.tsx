import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { handleSignOut } from '@/lib/actions';

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
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled || mobileMenuOpen
        ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100'
        : 'bg-transparent'
        }`}
    >
      <div className="w-full px-6 lg:px-12 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 bg-accent-blue rounded-lg flex items-center justify-center shadow-lg shadow-accent-blue/20">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="font-bold text-lg text-text-primary">ResumeAI</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection('features')}
            className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('ats-check')}
            className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            ATS Check
          </button>
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {status === 'authenticated' ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className="text-sm font-medium text-text-secondary hover:text-accent-blue flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
              <form action={handleSignOut}>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg text-sm border-blue-100 text-text-secondary hover:text-red-500 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </form>
            </div>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button
                  variant="ghost"
                  className="text-sm font-medium text-text-secondary hover:text-text-primary"
                >
                  Login
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  className="bg-accent-blue hover:bg-accent-blue/90 text-white rounded-lg px-5 py-2 text-sm font-medium btn-hover"
                >
                  Analyse Now
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-text-primary" />
          ) : (
            <Menu className="w-6 h-6 text-text-primary" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-4">
            <button
              onClick={() => scrollToSection('features')}
              className="text-left text-sm font-medium text-text-secondary hover:text-text-primary transition-colors p-2"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('ats-check')}
              className="text-left text-sm font-medium text-text-secondary hover:text-text-primary transition-colors p-2"
            >
              ATS Check
            </button>

            {status === 'authenticated' ? (
              <>
                <Link href="/dashboard" className="w-full">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm font-medium text-text-secondary hover:text-accent-blue gap-3"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/review" className="w-full">
                  <Button
                    className="bg-accent-blue hover:bg-accent-blue/90 text-white rounded-lg px-5 py-2.5 text-sm font-medium w-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    New Analysis
                  </Button>
                </Link>
                <form action={handleSignOut} className="w-full">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:bg-red-50 gap-3"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="w-full">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm font-medium text-text-secondary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/dashboard" className="w-full">
                  <Button
                    className="bg-accent-blue hover:bg-accent-blue/90 text-white rounded-lg px-5 py-2.5 text-sm font-medium w-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Analyse Now
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
