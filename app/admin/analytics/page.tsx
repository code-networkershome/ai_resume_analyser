import { prisma } from "@/lib/prisma";
import { BarChart3, TrendingUp, Users, FileText, Clock, Calendar } from "lucide-react";

async function getAnalytics() {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
        totalUsers,
        totalResumes,
        totalReviews,
        usersToday,
        resumesToday,
        reviewsToday,
        usersThisWeek,
        resumesThisWeek,
        reviewsThisWeek,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.resume.count(),
        prisma.review.count(),
        prisma.user.count({ where: { createdAt: { gte: startOfToday } } }),
        prisma.resume.count({ where: { createdAt: { gte: startOfToday } } }),
        prisma.review.count({ where: { createdAt: { gte: startOfToday } } }),
        prisma.user.count({ where: { createdAt: { gte: startOfWeek } } }),
        prisma.resume.count({ where: { createdAt: { gte: startOfWeek } } }),
        prisma.review.count({ where: { createdAt: { gte: startOfWeek } } }),
    ]);

    return {
        totalUsers,
        totalResumes,
        totalReviews,
        usersToday,
        resumesToday,
        reviewsToday,
        usersThisWeek,
        resumesThisWeek,
        reviewsThisWeek,
    };
}

export default async function AdminAnalyticsPage() {
    const analytics = await getAnalytics();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
                <p className="text-slate-500 mt-1">Platform performance and growth metrics</p>
            </div>

            {/* Totals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnalyticsCard
                    title="Total Users"
                    value={analytics.totalUsers}
                    icon={<Users className="h-6 w-6" />}
                    color="blue"
                />
                <AnalyticsCard
                    title="Total Resumes"
                    value={analytics.totalResumes}
                    icon={<FileText className="h-6 w-6" />}
                    color="purple"
                />
                <AnalyticsCard
                    title="Total Reviews"
                    value={analytics.totalReviews}
                    icon={<BarChart3 className="h-6 w-6" />}
                    color="green"
                />
            </div>

            {/* Today's Stats */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-slate-400" />
                    <h2 className="text-xl font-semibold text-slate-900">Today</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <MetricCard label="New Users" value={analytics.usersToday} trend="up" />
                    <MetricCard label="Resumes Uploaded" value={analytics.resumesToday} trend="up" />
                    <MetricCard label="Reviews Generated" value={analytics.reviewsToday} trend="up" />
                </div>
            </div>

            {/* This Week */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-5 w-5 text-slate-400" />
                    <h2 className="text-xl font-semibold text-slate-900">This Week</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <MetricCard label="New Users" value={analytics.usersThisWeek} trend="up" />
                    <MetricCard label="Resumes Uploaded" value={analytics.resumesThisWeek} trend="up" />
                    <MetricCard label="Reviews Generated" value={analytics.reviewsThisWeek} trend="up" />
                </div>
            </div>

            {/* Conversion Rate */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Conversion Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm text-slate-500 mb-1">Resume to Review Rate</p>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold text-slate-900">
                                {analytics.totalResumes > 0
                                    ? Math.round((analytics.totalReviews / analytics.totalResumes) * 100)
                                    : 0}%
                            </span>
                            <span className="text-sm text-green-600 flex items-center gap-1 mb-1">
                                <TrendingUp className="h-4 w-4" />
                            </span>
                        </div>
                        <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                style={{
                                    width: `${analytics.totalResumes > 0
                                        ? Math.min((analytics.totalReviews / analytics.totalResumes) * 100, 100)
                                        : 0}%`
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 mb-1">Avg Resumes per User</p>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold text-slate-900">
                                {analytics.totalUsers > 0
                                    ? (analytics.totalResumes / analytics.totalUsers).toFixed(1)
                                    : 0}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AnalyticsCard({
    title,
    value,
    icon,
    color,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: "blue" | "purple" | "green";
}) {
    const colors = {
        blue: "from-blue-500 to-blue-600",
        purple: "from-purple-500 to-purple-600",
        green: "from-green-500 to-green-600",
    };

    return (
        <div className={`bg-gradient-to-br ${colors[color]} rounded-2xl p-6 text-white shadow-lg`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-white/80 text-sm">{title}</p>
                    <p className="text-4xl font-bold mt-2">{value}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                    {icon}
                </div>
            </div>
        </div>
    );
}

function MetricCard({
    label,
    value,
    trend,
}: {
    label: string;
    value: number;
    trend: "up" | "down";
}) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <p className="text-sm text-slate-500">{label}</p>
            <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold text-slate-900">{value}</span>
                {value > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {trend === "up" ? "↑" : "↓"}
                    </span>
                )}
            </div>
        </div>
    );
}
