import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { FileText, ArrowLeft, Shield, Sparkles } from "lucide-react";
import { SignInForm } from "@/components/auth/signin-form";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Sign In - ResumeAI",
    description: "Sign in to ResumeAI to access your resume reviews and history.",
};

interface SignInPageProps {
    searchParams: {
        callbackUrl?: string;
        message?: string;
        error?: string;
    };
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
    const session = await auth();

    if (session?.user) {
        redirect(searchParams.callbackUrl || "/dashboard");
    }

    const message = searchParams.message;
    const error = searchParams.error;

    return (
        <div className="min-h-screen relative flex flex-col items-center justify-center p-6 bg-[#F8FAFC]">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-blue/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/5 blur-[120px] rounded-full" />
            </div>

            <div className="w-full max-w-md relative z-10 transition-all">
                <div className="mb-8 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
                        <div className="w-10 h-10 bg-accent-blue rounded-xl flex items-center justify-center shadow-lg shadow-accent-blue/20 transition-transform group-hover:scale-110">
                            <span className="text-white font-bold text-xl">R</span>
                        </div>
                        <span className="font-bold text-2xl text-text-primary">ResumeAI</span>
                    </Link>
                    <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Welcome Back</h1>
                    <p className="text-text-secondary mt-2 font-medium italic">Your career journey continues here.</p>
                </div>

                <div className="bg-white border-none shadow-2xl shadow-blue-500/5 rounded-[2rem] p-8 md:p-10">
                    {message && (
                        <div className="mb-6 p-4 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 rounded-xl text-center uppercase tracking-widest">
                            {message === "limit" ? "Sign in for unlimited access" : message}
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 text-xs font-bold text-red-700 bg-red-50 border border-red-100 rounded-xl text-center uppercase tracking-widest">
                            Authentication Failed. Please try again.
                        </div>
                    )}

                    <SignInForm callbackUrl={searchParams.callbackUrl} />

                    <div className="mt-8 pt-8 border-t border-gray-50 text-center">
                        <p className="text-sm text-text-secondary font-medium">
                            Don&apos;t have an account?{" "}
                            <Link href="/auth/signup" className="text-accent-blue font-bold hover:underline underline-offset-4">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex justify-center gap-6 text-text-secondary">
                    <Link href="/" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-accent-blue transition-colors">
                        <ArrowLeft className="h-3 w-3" />
                        Back to Home
                    </Link>
                    <span className="text-gray-200">|</span>
                    <Link href="/privacy" className="text-xs font-bold uppercase tracking-widest hover:text-accent-blue transition-colors">
                        Privacy Policy
                    </Link>
                </div>
            </div>
        </div>
    );
}
