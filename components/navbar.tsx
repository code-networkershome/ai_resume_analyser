import Link from "next/link";
import { auth } from "@/lib/auth";
import { handleSignOut } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut, FileText } from "lucide-react";

export async function Navbar() {
    const session = await auth();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20 transition-transform group-hover:scale-105 group-hover:rotate-3">
                            <FileText className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-black text-2xl tracking-tighter text-slate-900">ResumeAI</span>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-8">
                        <Link href="#methodology" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">Methodology</Link>
                        <Link href="#audit" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">Audit</Link>
                        <Link href="#ai-rewrite" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">AI Rewrite</Link>
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    {session?.user ? (
                        <div className="flex items-center gap-3">
                            <Button asChild variant="ghost" size="sm" className="font-bold text-slate-600">
                                <Link href="/dashboard">
                                    <LayoutDashboard className="w-4 h-4 mr-2" />
                                    Dashboard
                                </Link>
                            </Button>
                            <form action={handleSignOut}>
                                <Button variant="ghost" size="sm" className="font-bold text-red-500 hover:text-red-600 hover:bg-red-50">
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Sign Out
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button asChild variant="ghost" size="sm" className="font-bold text-slate-600">
                                <Link href="/signin">Log in</Link>
                            </Button>
                            <Button asChild size="sm" className="rounded-full px-5 font-bold bg-primary hover:bg-primary/90 shadow-md shadow-primary/10">
                                <Link href="/review">Get Started</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
