import Link from "next/link";
import { auth } from "@/lib/auth";
import { handleSignOut } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut, FileText } from "lucide-react";

export async function Navbar() {
    const session = await auth();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-xl">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <div className="flex items-center gap-12">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/20 transition-all group-hover:scale-110 group-hover:rotate-6">
                            <FileText className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-bold text-2xl tracking-tight text-slate-900 font-display">ResumeAI</span>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-10">
                        <Link href="#methodology" className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-all hover:translate-y-[-1px]">Methodology</Link>
                        <Link href="#audit" className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-all hover:translate-y-[-1px]">Audit</Link>
                        <Link href="#ai-rewrite" className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-all hover:translate-y-[-1px]">AI Rewrite</Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    {session?.user ? (
                        <div className="flex items-center gap-4">
                            <Button asChild variant="ghost" className="font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl">
                                <Link href="/dashboard">
                                    <LayoutDashboard className="w-4 h-4 mr-2" />
                                    Dashboard
                                </Link>
                            </Button>
                            <form action={handleSignOut}>
                                <Button variant="ghost" className="font-bold text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl">
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Sign Out
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link href="/signin" className="text-sm font-bold text-slate-600 hover:text-blue-600 px-4 py-2 transition-all">
                                Log in
                            </Link>
                            <Button asChild className="btn-primary rounded-xl px-6 h-11 font-bold shadow-lg shadow-blue-500/20">
                                <Link href="/review">Get Started</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
