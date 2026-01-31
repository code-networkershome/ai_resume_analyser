import { prisma } from "@/lib/prisma";
import { Download, FileText, Calendar, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

async function getExportData() {
    const reviews = await prisma.review.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
        include: {
            resume: {
                include: { user: { select: { name: true, email: true } } },
            },
        },
    });

    return reviews;
}

export default async function AdminExportsPage() {
    const reviews = await getExportData();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Exports</h1>
                    <p className="text-slate-500 mt-1">View and manage exported reports</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">{reviews.length}</p>
                    <p className="text-sm text-slate-500">Total Exports</p>
                </div>
            </div>

            {/* Exports List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-semibold text-slate-900">Recent Exports</h2>
                    <span className="text-xs text-slate-500">Last 20 exports</span>
                </div>
                <div className="divide-y divide-slate-100">
                    {reviews.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                <Download className="h-8 w-8 text-slate-400" />
                            </div>
                            <p className="text-slate-500">No exports yet</p>
                        </div>
                    ) : (
                        reviews.map((review) => (
                            <div key={review.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">
                                            {review.targetRole || "Resume Analysis"}
                                        </p>
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <User className="h-3 w-3" />
                                            <span>{review.resume.user?.email || "Unknown"}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-slate-900">
                                            Score: {review.atsScore}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            {review.experienceLevel}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <Calendar className="h-3 w-3" />
                                        <span>{formatDistanceToNow(review.createdAt, { addSuffix: true })}</span>
                                    </div>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                        PDF
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
