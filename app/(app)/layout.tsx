import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AppNavbar } from "@/components/AppNavbar";

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    console.log("DEBUG: Loading AppLayout session...");
    const session = await auth();
    console.log("DEBUG: Session loaded:", !!session);

    if (!session) {
        redirect("/auth/signin");
    }

    return (
        <div className="flex min-h-screen flex-col">
            <AppNavbar />
            <main className="flex-1 pt-16">{children}</main>
        </div>
    );
}
