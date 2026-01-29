"use client";

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Navigation } from '@/components/landing-new/navigation';
import { HeroSection } from '@/components/landing-new/sections/HeroSection';
import { ATSScoreSection } from '@/components/landing-new/sections/ATSScoreSection';
import { KeywordMatchSection } from '@/components/landing-new/sections/KeywordMatchSection';
import { ContentEnhancementSection } from '@/components/landing-new/sections/ContentEnhancementSection';
import { SkillGapSection } from '@/components/landing-new/sections/SkillGapSection';
import { AIEngineSection } from '@/components/landing-new/sections/AIEngineSection';
import { AISuggestionsSection } from '@/components/landing-new/sections/AISuggestionsSection';
import { JobOptimizationSection } from '@/components/landing-new/sections/JobOptimizationSection';
import { TestimonialsSection } from '@/components/landing-new/sections/TestimonialsSection';
import { FinalCTASection } from '@/components/landing-new/sections/FinalCTASection';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
    // Cleanup ScrollTriggers on unmount
    useEffect(() => {
        return () => {
            ScrollTrigger.getAll().forEach((st) => st.kill());
        };
    }, []);

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-[#F0F7FF] to-white">
            {/* Navigation */}
            <Navigation />

            {/* Main Content - Continuous Scrolling */}
            <main className="relative">
                <HeroSection />
                <ATSScoreSection />
                <KeywordMatchSection />
                <ContentEnhancementSection />
                <SkillGapSection />
                <AIEngineSection />
                <AISuggestionsSection />
                <JobOptimizationSection />
                <TestimonialsSection />
                <FinalCTASection />
            </main>
        </div>
    );
}
