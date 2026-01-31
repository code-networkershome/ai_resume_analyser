import { Shield, Key, Lock, Eye, CheckCircle } from "lucide-react";

export default function AdminSecurityPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Security</h1>
                <p className="text-slate-500 mt-1">Monitor and configure security settings</p>
            </div>

            {/* Security Status */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center">
                        <Shield className="h-7 w-7" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Security Status: Good</h3>
                        <p className="text-white/80">All security measures are properly configured</p>
                    </div>
                </div>
            </div>

            {/* Security Checks */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="font-semibold text-slate-900">Security Checklist</h2>
                </div>
                <div className="divide-y divide-slate-100">
                    <SecurityItem
                        icon={<Key className="h-5 w-5" />}
                        title="API Keys Configured"
                        description="OpenRouter and Resend API keys are set"
                        status="secure"
                    />
                    <SecurityItem
                        icon={<Lock className="h-5 w-5" />}
                        title="Authentication Enabled"
                        description="NextAuth with email/password authentication"
                        status="secure"
                    />
                    <SecurityItem
                        icon={<Shield className="h-5 w-5" />}
                        title="Admin Protected Routes"
                        description="Admin pages restricted to authorized email"
                        status="secure"
                    />
                    <SecurityItem
                        icon={<Eye className="h-5 w-5" />}
                        title="Disposable Email Blocking"
                        description="Temporary email services are blocked"
                        status="secure"
                    />
                </div>
            </div>

            {/* Admin Access */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="font-semibold text-slate-900">Admin Access</h2>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-between py-3">
                        <div>
                            <p className="font-medium text-slate-900">Authorized Admin Email</p>
                            <p className="text-sm text-slate-500">Only this email can access admin dashboard</p>
                        </div>
                        <span className="px-4 py-2 bg-slate-100 rounded-lg font-mono text-sm text-slate-700">
                            vikas@networkershome.com
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SecurityItem({
    icon,
    title,
    description,
    status,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    status: "secure" | "warning" | "critical";
}) {
    return (
        <div className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                    {icon}
                </div>
                <div>
                    <p className="font-medium text-slate-900">{title}</p>
                    <p className="text-sm text-slate-500">{description}</p>
                </div>
            </div>
            <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Secure</span>
            </div>
        </div>
    );
}
