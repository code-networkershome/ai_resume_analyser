import { prisma } from "@/lib/prisma";
import { Users, FileText, Download, Sparkles, Activity } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

async function getStats() {
    const [userCount, reviewCount, resumeCount] = await Promise.all([
        prisma.user.count(),
        prisma.review.count(),
        prisma.resume.count(),
    ]);

    return {
        activeUsers: userCount,
        resumesCreated: resumeCount,
        exportVolume: reviewCount,
        aiOperations: reviewCount,
    };
}

async function getRecentResumes() {
    const resumes = await prisma.resume.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
            user: { select: { name: true, email: true } },
            reviews: { select: { id: true } },
        },
    });
    return resumes;
}

async function getRecentReviews() {
    const reviews = await prisma.review.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
            resume: {
                include: { user: { select: { name: true, email: true } } },
            },
        },
    });
    return reviews;
}

export default async function AdminDashboardPage() {
    const stats = await getStats();
    const recentResumes = await getRecentResumes();
    const recentReviews = await getRecentReviews();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">System Overview</h1>
                    <p className="text-slate-500 mt-1">Real-time performance and user engagement metrics</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm">
                    <Activity className="h-4 w-4 text-green-500 animate-pulse" />
                    <span className="text-sm font-medium text-slate-700">SYSTEM LIVE</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="ACTIVE USERS"
                    value={stats.activeUsers}
                    icon={<Users className="h-6 w-6" />}
                    iconBg="bg-blue-100"
                    iconColor="text-blue-600"
                />
                <StatCard
                    label="RESUMES CREATED"
                    value={stats.resumesCreated}
                    icon={<FileText className="h-6 w-6" />}
                    iconBg="bg-purple-100"
                    iconColor="text-purple-600"
                />
                <StatCard
                    label="EXPORT VOLUME"
                    value={stats.exportVolume}
                    icon={<Download className="h-6 w-6" />}
                    iconBg="bg-orange-100"
                    iconColor="text-orange-600"
                />
                <StatCard
                    label="AI OPERATIONS"
                    value={stats.aiOperations}
                    icon={<Sparkles className="h-6 w-6" />}
                    iconBg="bg-pink-100"
                    iconColor="text-pink-600"
                />
            </div>

            {/* Recent Activity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Resumes */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                        <h2 className="font-semibold text-slate-900">Recent Resumes</h2>
                        <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">LATEST 5</span>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recentResumes.length === 0 ? (
                            <p className="px-6 py-8 text-center text-slate-400">No resumes yet</p>
                        ) : (
                            recentResumes.slice(0, 5).map((resume) => (
                                <div key={resume.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                                            <FileText className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">{resume.detectedRole || "My Resume"}</p>
                                            <p className="text-xs text-slate-400">
                                                {formatDistanceToNow(resume.createdAt, { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-400 font-mono">
                                        ID: #{resume.id.slice(-8)}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Reviews/Downloads */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                        <h2 className="font-semibold text-slate-900">Recent Reviews</h2>
                        <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">LATEST 5</span>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recentReviews.length === 0 ? (
                            <p className="px-6 py-8 text-center text-slate-400">No reviews yet</p>
                        ) : (
                            recentReviews.slice(0, 5).map((review) => (
                                <div key={review.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                            <Sparkles className="h-5 w-5 text-purple-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">
                                                {review.targetRole || "Resume Review"}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {formatDistanceToNow(review.createdAt, { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                                        PDF
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({
    label,
    value,
    icon,
    iconBg,
    iconColor,
}: {
    label: string;
    value: number;
    icon: React.ReactNode;
    iconBg: string;
    iconColor: string;
}) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-slate-400 tracking-wide">{label}</p>
                    <p className="text-4xl font-bold text-slate-900 mt-2">{value}</p>
                </div>
                <div className={`h-12 w-12 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}
