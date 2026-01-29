import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, XCircle, Info, ChevronRight, BarChart3, TrendingUp, AlertTriangle, ShieldCheck } from "lucide-react";
import { cn, getScoreColor, getScoreBgColor, getScoreLabel, formatDate } from "@/lib/utils";

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
    const reviewData = {
        ...review,
        aiCritique: review.aiCritique as any,
        skillGaps: review.skillGaps as any,
        atsBreakdown: review.atsBreakdown as any,
        responsibilityAnalysis: review.responsibilityAnalysis as any,
        recommendations: review.recommendations as any,
        targetRole: review.targetRole,
        experienceLevel: review.experienceLevel,
        structuralIssues: review.structuralIssues as string[],
        contentIssues: review.contentIssues as string[],
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <InteractiveReport review={reviewData} />
        </div>
    );
}

