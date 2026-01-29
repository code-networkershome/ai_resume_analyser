"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Mail, Loader2, ArrowRight, Lock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SignInFormProps {
    callbackUrl?: string;
}

export function SignInForm({ callbackUrl }: SignInFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

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
            console.log("DEBUG: Attempting sign-in with credentials:", email);
            const result = await signIn("credentials", {
                email: email.toLowerCase().trim(),
                password,
                redirect: false,
                callbackUrl: callbackUrl || "/dashboard",
            });
            console.log("DEBUG: Sign-in result:", result);

            if (result?.error) {
                if (result.error === "CredentialsSignin") {
                    setError("Invalid email or password");
                } else {
                    setError("Something went wrong. Please try again.");
                }
            } else {
                router.push(callbackUrl || "/dashboard");
                router.refresh();
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                    >
                        Email address
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError(null);
                            }}
                            placeholder="you@example.com"
                            className="block w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                        >
                            Password
                        </label>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError(null);
                            }}
                            placeholder="••••••••"
                            className="block w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            disabled={isLoading}
                        />
                    </div>
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
                disabled={!email || !password || isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity shadow-lg shadow-blue-500/20"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Signing in...
                    </>
                ) : (
                    <>
                        Sign In
                        <ArrowRight className="w-5 h-5" />
                    </>
                )}
            </button>

            <div className="text-center space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/auth/signup"
                        className="text-blue-600 hover:text-blue-500 font-medium underline"
                    >
                        Sign up for free
                    </Link>
                </p>
            </div>
        </form>
    );
}
