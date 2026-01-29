"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";

export function AuthForm() {
    const [email, setEmail] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        try {
            const result = await signIn("email", {
                email,
                callbackUrl: "/dashboard",
                redirect: false,
            });

            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Check your email for a magic link!");
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                />
            </div>
            <Button
                type="submit"
                className="w-full"
                variant="premium"
                disabled={isLoading}
            >
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Mail className="mr-2 h-4 w-4" />
                )}
                Sign In with Magic Link
            </Button>
            <p className="text-center text-xs text-muted-foreground px-8">
                By clicking continue, you agree to our{" "}
                <span className="underline cursor-pointer">Terms of Service</span> and{" "}
                <span className="underline cursor-pointer">Privacy Policy</span>.
            </p>
        </form>
    );
}
