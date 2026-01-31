import { Megaphone, Plus, Calendar, AlertTriangle } from "lucide-react";

export default function AdminAnnouncementsPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Announcements</h1>
                    <p className="text-slate-500 mt-1">Manage system announcements and notifications</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30">
                    <Plus className="h-4 w-4" />
                    New Announcement
                </button>
            </div>

            {/* Empty State */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
                <div className="h-16 w-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
                    <Megaphone className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">No announcements yet</h3>
                <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                    Create announcements to notify all users about important updates, maintenance, or new features.
                </p>
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
                <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-blue-900">Announcement Feature</h4>
                        <p className="text-sm text-blue-700 mt-1">
                            This feature allows you to broadcast messages to all users. Announcements can be used for scheduled maintenance, new feature releases, or important system updates.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
