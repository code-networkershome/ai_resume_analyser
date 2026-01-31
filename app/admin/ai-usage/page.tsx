import { prisma } from "@/lib/prisma";
import { Sparkles, Zap, Clock, TrendingUp, Brain, Activity } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

async function getAIStats() {
    const reviews = await prisma.review.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
            id: true,
            targetRole: true,
            experienceLevel: true,
            atsScore: true,
            processingTimeMs: true,
            createdAt: true,
        },
    });

    const totalReviews = await prisma.review.count();
    const avgProcessingTime = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + (r.processingTimeMs || 0), 0) / reviews.length
        : 0;

    return {
        totalOperations: totalReviews,
        avgProcessingTime: Math.round(avgProcessingTime),
        recentOperations: reviews,
    };
}

export default async function AdminAIUsagePage() {
    const stats = await getAIStats();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">AI Usage</h1>
                <p className="text-slate-500 mt-1">Monitor AI operations and performance</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/80 text-sm">Total AI Operations</p>
                            <p className="text-4xl font-bold mt-2">{stats.totalOperations}</p>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                            <Brain className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm">Avg Processing Time</p>
                            <p className="text-3xl font-bold text-slate-900 mt-2">
                                {(stats.avgProcessingTime / 1000).toFixed(1)}s
                            </p>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                            <Clock className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm">Model</p>
                            <p className="text-lg font-bold text-slate-900 mt-2">Gemma 2 9B</p>
                            <p className="text-xs text-slate-400">via OpenRouter</p>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                            <Sparkles className="h-6 w-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Operations */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="font-semibold text-slate-900">Recent AI Operations</h2>
                </div>
                <div className="divide-y divide-slate-100">
                    {stats.recentOperations.length === 0 ? (
                        <p className="px-6 py-12 text-center text-slate-400">No AI operations yet</p>
                    ) : (
                        stats.recentOperations.map((op) => (
                            <div key={op.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                                        <Zap className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">Resume Analysis</p>
                                        <p className="text-sm text-slate-500">
                                            {op.targetRole} • {op.experienceLevel}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-slate-900">
                                            Score: {op.atsScore}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            {op.processingTimeMs ? `${(op.processingTimeMs / 1000).toFixed(1)}s` : "-"}
                                        </p>
                                    </div>
                                    <div className="text-right min-w-24">
                                        <p className="text-xs text-slate-400">
                                            {formatDistanceToNow(op.createdAt, { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
