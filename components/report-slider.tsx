"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

const darkImages = [
    "/assets/hero_1_dark.png",
    "/assets/hero_2_dark.png",
    "/assets/hero_3_dark.png",
    "/assets/hero_4_dark.png",
];

const lightImages = [
    "/assets/hero_1_light.png",
    "/assets/hero_2_light.png",
    "/assets/hero_3_light.png",
    "/assets/hero_4_light.png",
];

const labels = [
    "Screening Verdict",
    "Skill Matrix & Gaps",
    "Diagnostic Findings",
    "ATS Structure Analysis"
];

export function ReportSlider() {
    const { resolvedTheme } = useTheme();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % 4);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    if (!mounted) return <div className="aspect-[4/3] w-full rounded-[2.5rem] bg-primary/5 animate-pulse" />;

    const images = resolvedTheme === "dark" ? darkImages : lightImages;

    return (
        <div className="relative w-full aspect-[4/3] rounded-[2.5rem] border border-primary/20 bg-primary/5 backdrop-blur-xl shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent z-10 pointer-events-none" />

            <div className="relative w-full h-full flex items-center justify-center p-8">
                <AnimatePresence mode="popLayout">
                    {images.map((src, idx) => (
                        idx === currentIndex && (
                            <motion.div
                                key={`${resolvedTheme}-${idx}`}
                                initial={{ opacity: 0, scale: 0.9, x: 50, rotate: 2 }}
                                animate={{ opacity: 1, scale: 1, x: 0, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.95, x: -50, rotate: -2 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30
                                }}
                                className="absolute inset-8"
                            >
                                <img
                                    src={src}
                                    alt="Analysis Preview"
                                    className="w-full h-full object-contain rounded-2xl shadow-xl transition-transform duration-700 group-hover:scale-[1.02]"
                                />
                            </motion.div>
                        )
                    ))}
                </AnimatePresence>
            </div>

            {/* Overlay Indicators */}
            <div className="absolute bottom-10 left-10 right-10 flex justify-end items-end z-20">
                <div className="flex gap-2.5 pb-2">
                    {[0, 1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className={`h-1.5 transition-all duration-500 rounded-full ${i === currentIndex ? "w-10 bg-primary" : "w-3 bg-primary/20"}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
