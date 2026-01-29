"use client";

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Navigation } from '@/components/landing-new/navigation';
import { HeroSection } from '@/components/landing-new/sections/HeroSection';
import { ATSScoreSection } from '@/components/landing-new/sections/ATSScoreSection';
import { FeaturesSection } from '@/components/landing-new/sections/FeaturesSection';
import { AnalysisSuiteSection } from '@/components/landing-new/sections/AnalysisSuiteSection';
import { AIEngineSection } from '@/components/landing-new/sections/AIEngineSection';
import { TestimonialsSection } from '@/components/landing-new/sections/TestimonialsSection';
import { FinalCTASection } from '@/components/landing-new/sections/FinalCTASection';
import { Footer } from '@/components/landing-new/footer';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
    // Cleanup ScrollTriggers on unmount
    useEffect(() => {
        return () => {
            ScrollTrigger.getAll().forEach((st) => st.kill());
        };
    }, []);

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-[#F8FAFF] via-white to-slate-50">
            {/* Navigation */}
            <Navigation />

            {/* Main Content - Continuous Scrolling */}
            <main className="relative">
                <HeroSection />
                <FeaturesSection />
                <ATSScoreSection />
                <AnalysisSuiteSection />
                <AIEngineSection />
                <TestimonialsSection />
                <FinalCTASection />
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
