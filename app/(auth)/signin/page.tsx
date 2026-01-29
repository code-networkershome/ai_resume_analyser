import { AuthForm } from "@/components/auth-form";
import { Sparkles } from "lucide-react";
import { AuroraBackground } from "@/components/shared/AuroraBackground";

export default function SignInPage() {
    return (
        <AuroraBackground className="flex items-center justify-center p-6">
            <div className="w-full max-w-[450px] relative z-10">
                <div className="relative">
                    <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-[3rem] transform rotate-3 opacity-50 pointer-events-none" />
                    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-2xl shadow-blue-900/5 relative z-10 transition-shadow hover:shadow-blue-900/10">
                        <div className="mb-10 text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full mb-6 shadow-sm">
                                <Sparkles className="w-4 h-4 text-blue-600" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Secure Access</span>
                            </div>
                            <h2 className="text-4xl font-black tracking-tight text-slate-900 font-display">Welcome Back</h2>
                            <p className="text-sm text-slate-500 mt-3 font-medium">
                                Sign in to your account to review your resumes
                            </p>
                        </div>
                        <AuthForm />
                    </div>
                </div>
            </div>
        </AuroraBackground>
    );
}
