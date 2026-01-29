import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/auth/signin");
    }

    const usage = await prisma.usage.findUnique({
        where: { userId: session.user.id },
    });

    const reviews = await prisma.review.findMany({
        where: {
            resume: {
                userId: session.user.id,
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return <DashboardClient usage={usage} reviews={reviews} />;
}
