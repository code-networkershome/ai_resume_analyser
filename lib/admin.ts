import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Admin email - only this user can access admin pages
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'vikas@networkershome.com';

export async function isAdmin(email?: string | null): Promise<boolean> {
    return email === ADMIN_EMAIL;
}

export async function adminMiddleware(request: NextRequest) {
    const session = await auth();

    if (!session?.user?.email) {
        return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    if (session.user.email !== ADMIN_EMAIL) {
        // Not admin - redirect to home
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export { ADMIN_EMAIL };
