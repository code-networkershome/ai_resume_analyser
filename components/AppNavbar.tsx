"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, LayoutDashboard, FileText, LogOut, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

export function AppNavbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'New Analysis', href: '/review', icon: PlusCircle },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled || mobileMenuOpen
                ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100'
                : 'bg-white/50 backdrop-blur-sm border-b border-transparent'
                }`}
        >
            <div className="w-full px-6 lg:px-12 py-3 flex items-center justify-between">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2"
                >
                    <div className="w-8 h-8 bg-accent-blue rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">R</span>
                    </div>
                    <span className="font-bold text-lg text-text-primary">ResumeAI</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm font-medium transition-colors flex items-center gap-2 ${pathname === link.href
                                ? 'text-accent-blue font-semibold'
                                : 'text-text-secondary hover:text-text-primary'
                                }`}
                        >
                            <link.icon className="w-4 h-4" />
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* CTA Buttons / Profile */}
                <div className="hidden md:flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-sm font-medium text-text-secondary hover:text-red-600 hover:bg-red-50 flex items-center gap-2"
                        onClick={() => signOut({ callbackUrl: '/' })}
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </Button>
                    {pathname !== '/review' && (
                        <Link href="/review">
                            <Button
                                size="sm"
                                className="bg-accent-blue hover:bg-accent-blue/90 text-white rounded-lg px-4 py-2 text-sm font-medium btn-hover flex items-center gap-2"
                            >
                                <PlusCircle className="w-4 h-4" />
                                New Scan
                            </Button>
                        </Link>
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
                <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-4 shadow-xl">
                    <div className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`text-sm font-medium flex items-center gap-3 p-2 rounded-lg ${pathname === link.href
                                    ? 'bg-accent-light text-accent-blue'
                                    : 'text-text-secondary'
                                    }`}
                            >
                                <link.icon className="w-5 h-5" />
                                {link.name}
                            </Link>
                        ))}
                        <div className="pt-4 border-t border-gray-100">
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-red-600 hover:bg-red-50 gap-3"
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    signOut({ callbackUrl: '/' });
                                }}
                            >
                                <LogOut className="w-5 h-5" />
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
