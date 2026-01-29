"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Loader2, ArrowRight, Lock, User, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function SignUpForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!name.trim()) {
            setError("Please enter your name");
            return;
        }

        if (!isValidEmail) {
            setError("Please enter a valid email address");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email: email.toLowerCase().trim(),
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            setSuccess(true);
            setTimeout(() => {
                router.push("/auth/signin");
            }, 2000);
        } catch (err: any) {
            setError(err.message || "Failed to register. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    if (success) {
        return (
            <div className="text-center space-y-4 p-8 bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-100 dark:border-green-900/20">
                <div className="flex justify-center">
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Account Created!</h3>
                <p className="text-gray-600 dark:text-gray-400">
                    Registration successful. Redirecting you to sign in...
                </p>
                <div className="flex justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-green-500" />
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Full Name
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            className="block w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Email Address
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="block w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="block w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            disabled={isLoading}
                        />
                    </div>
                    <p className="mt-1 text-xs text-gray-500 italic">Minimum 6 characters</p>
                </div>
            </div>

            {error && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity shadow-lg shadow-blue-500/20"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating Account...
                    </>
                ) : (
                    <>
                        Create Free Account
                        <ArrowRight className="w-5 h-5" />
                    </>
                )}
            </button>

            <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Already have an account?{" "}
                    <Link
                        href="/auth/signin"
                        className="text-blue-600 hover:text-blue-500 font-medium underline"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </form>
    );
}
