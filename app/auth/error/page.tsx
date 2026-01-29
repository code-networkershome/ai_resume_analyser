import { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";

export const metadata: Metadata = {
    title: "Authentication Error - ResumeAI",
    description: "There was a problem with authentication.",
};

interface ErrorPageProps {
    searchParams: {
        error?: string;
    };
}

export default function ErrorPage({ searchParams }: ErrorPageProps) {
    const error = searchParams.error;

    const errorMessages: Record<string, { title: string; description: string }> = {
        Configuration: {
            title: "Server Configuration Error",
            description:
                "There is a problem with the server configuration. Please contact support.",
        },
        AccessDenied: {
            title: "Access Denied",
            description:
                "You do not have permission to sign in. This may be due to using a blocked email domain.",
        },
        Verification: {
            title: "Verification Failed",
            description:
                "The verification link may have expired or already been used. Please try signing in again.",
        },
        OAuthSignin: {
            title: "Sign In Error",
            description: "Error in constructing an authorization URL.",
        },
        OAuthCallback: {
            title: "Callback Error",
            description: "Error in handling the response from the OAuth provider.",
        },
        OAuthCreateAccount: {
            title: "Account Creation Error",
            description: "Could not create OAuth provider user in the database.",
        },
        EmailCreateAccount: {
            title: "Account Creation Error",
            description: "Could not create email provider user in the database.",
        },
        Callback: {
            title: "Callback Error",
            description: "Error in the OAuth callback handler route.",
        },
        OAuthAccountNotLinked: {
            title: "Account Not Linked",
            description:
                "Email is already associated with another account. Please sign in with the original provider.",
        },
        EmailSignin: {
            title: "Email Sign In Error",
            description:
                "Could not send the verification email. Please check your email address and try again.",
        },
        CredentialsSignin: {
            title: "Sign In Failed",
            description: "The credentials provided are invalid.",
        },
        SessionRequired: {
            title: "Session Required",
            description: "You must be signed in to access this page.",
        },
        Default: {
            title: "Authentication Error",
            description: "An unexpected error occurred. Please try again.",
        },
    };

    const { title, description } = errorMessages[error || "Default"] || errorMessages.Default;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex flex-col">
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
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
                        <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
                    </div>

                    {/* Content */}
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        {title}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                        {description}
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/auth/signin"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Try again
                        </Link>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            Go to homepage
                        </Link>
                    </div>

                    {/* Error Code */}
                    {error && (
                        <p className="mt-8 text-xs text-gray-500 dark:text-gray-400">
                            Error code:{" "}
                            <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700">
                                {error}
                            </code>
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
}
