"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    LayoutDashboard,
    Users,
    BarChart3,
    Sparkles,
    Settings,
    Megaphone,
    Shield,
    Download,
    ArrowLeft,
    ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "AI Usage", href: "/admin/ai-usage", icon: Sparkles },
    { name: "Settings", href: "/admin/settings", icon: Settings },
    { name: "Announcements", href: "/admin/announcements", icon: Megaphone },
    { name: "Security", href: "/admin/security", icon: Shield },
    { name: "Audit Logs", href: "/admin/logs", icon: ClipboardList },
    { name: "Exports", href: "/admin/exports", icon: Download },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-slate-900 text-white flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-700">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-lg">
                        R
                    </div>
                    <div>
                        <h1 className="font-bold text-lg">Admin</h1>
                        <p className="text-xs text-slate-400">MANAGEMENT</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== "/admin" && pathname.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                                isActive
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-700">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-200 mb-2"
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span className="font-medium">Return to App</span>
                </Link>
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
                >
                    <ArrowLeft className="h-5 w-5 rotate-180" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
