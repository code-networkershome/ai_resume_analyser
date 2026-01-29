import { Metadata } from "next";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
    title: "Check Your Email - ResumeAI",
    description: "We've sent you a magic link to sign in.",
};

export default function VerifyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex flex-col">
            {/* Header */}
            <header className="p-4">
                <div className="max-w-7xl mx-auto">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to home
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md text-center">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
                        <Mail className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>

                    {/* Content */}
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        Check your email
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                        We&apos;ve sent you a magic link to sign in. Click the link in the email
                        to continue. The link will expire in 1 hour.
                    </p>

                    {/* Tips */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-left">
                        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            Tips
                        </h2>
                        <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                Check your spam or junk folder if you don&apos;t see the email
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                The email is from{" "}
                                <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs">
                                    noreply@resumeai.dev
                                </code>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                The link expires in 1 hour for security
                            </li>
                        </ul>
                    </div>

                    {/* Back to sign in */}
                    <Link
                        href="/auth/signin"
                        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mt-6 text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to sign in
                    </Link>
                </div>
            </main>
        </div>
    );
}
