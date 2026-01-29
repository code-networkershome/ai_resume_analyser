import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers";
import { Toaster } from "sonner";
import { GrainOverlay } from "@/components/layout/GrainOverlay";

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-plus-jakarta",
    display: 'swap',
});

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
    display: 'swap',
});

export const metadata: Metadata = {
    title: {
        default: "ResumeAI - Perfect Your Resume. Get Hired.",
        template: "%s | ResumeAI",
    },
    description: "Get honest AI feedback on your resume. Optimize for success and view your results in your personalized Dashboard.",
    keywords: ["resume reviewer", "ATS checker", "AI resume feedback", "IT jobs", "career growth"],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${plusJakartaSans.variable} ${outfit.variable} font-sans antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem={false}
                    disableTransitionOnChange
                >
                    <GrainOverlay />
                    {children}
                    <Toaster position="top-center" richColors />
                </ThemeProvider>
            </body>
        </html>
    );
}
