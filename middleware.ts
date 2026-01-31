import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const session = await auth();
    const path = req.nextUrl.pathname;

    // 1. Protect Dashboard Routes
    if (path.startsWith("/dashboard") || path.startsWith("/review")) {
        if (!session?.user) {
            return NextResponse.redirect(new URL("/auth/signin", req.url));
        }
    }

    // 2. Protect Admin Routes (Stricter)
    if (path.startsWith("/admin")) {
        if (!session?.user) {
            return NextResponse.redirect(new URL("/auth/signin", req.url));
        }

        // Double check admin status
        const userIsAdmin = await isAdmin(session.user.email);
        if (!userIsAdmin) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*", "/review/:path*"],
};
