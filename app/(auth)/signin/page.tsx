import { AuthForm } from "@/components/auth-form";

export default function SignInPage() {
    return (
        <div className="rounded-2xl bg-background p-8 border shadow-xl">
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold">Welcome Back</h2>
                <p className="text-sm text-muted-foreground">
                    Sign in to your account to review your resumes
                </p>
            </div>
            <AuthForm />
        </div>
    );
}
