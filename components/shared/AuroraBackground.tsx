import React from 'react';

export const AuroraBackground = ({ children, className }: { children?: React.ReactNode; className?: string }) => {
    return (
        <div className={`relative min-h-screen bg-gradient-to-b from-[#F8FAFF] via-white to-slate-50 ${className}`}>
            {/* Background Gradient Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-400/15 rounded-full blur-3xl animate-float-reverse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-400/10 rounded-full blur-3xl animate-float-slow" />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full">
                {children}
            </div>
        </div>
    );
};
