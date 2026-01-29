import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4 relative">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
                        <h1 className="text-3xl font-extrabold gradient-text">ResumeAI</h1>
                    </Link>
                    <p className="mt-2 text-sm text-muted-foreground">
                        The community-first AI resume reviewer
                    </p>
                </div>
                {children}
            </div>
        </div>
    );
}
