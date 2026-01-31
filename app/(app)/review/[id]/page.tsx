import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { InteractiveReport } from "@/components/review/interactive-report";

export default async function ReviewReportPage({
    params,
}: {
    params: { id: string };
}) {
    const session = await auth();
    if (!session?.user) {
        redirect("/auth/signin");
    }

    const review = await prisma.review.findUnique({
        where: { id: params.id },
        include: { resume: true },
    });

    if (!review || review.resume.userId !== session.user.id) {
        notFound();
    }

    // Prepare data for client component
    const atsBreakdownData = review.atsBreakdown as any;
    const reviewData = {
        ...review,
        aiCritique: review.aiCritique as any,
        skillGaps: review.skillGaps as any,
        atsBreakdown: atsBreakdownData,
        responsibilityAnalysis: review.responsibilityAnalysis as any,
        recommendations: review.recommendations as any,
        targetRole: review.targetRole,
        experienceLevel: review.experienceLevel,
        structuralIssues: review.structuralIssues as string[],
        contentIssues: review.contentIssues as string[],
        // Extract universalAnalysis from atsBreakdown where it's stored
        universalAnalysis: atsBreakdownData?.universalAnalysis || null,
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <InteractiveReport review={reviewData} />
        </div>
    );
}
