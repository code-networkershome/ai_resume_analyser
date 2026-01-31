import { Settings, Mail, Globe, Shield, Bell, Database } from "lucide-react";

export default function AdminSettingsPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500 mt-1">Configure system settings and preferences</p>
            </div>

            {/* Settings Sections */}
            <div className="grid gap-6">
                {/* General Settings */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                        <Globe className="h-5 w-5 text-blue-600" />
                        <h2 className="font-semibold text-slate-900">General Settings</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-slate-100">
                            <div>
                                <p className="font-medium text-slate-900">App Name</p>
                                <p className="text-sm text-slate-500">Display name for the application</p>
                            </div>
                            <input
                                type="text"
                                defaultValue="ResumeAI"
                                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                readOnly
                            />
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <div>
                                <p className="font-medium text-slate-900">System Status</p>
                                <p className="text-sm text-slate-500">Current system operational status</p>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                Operational
                            </span>
                        </div>
                    </div>
                </div>

                {/* Email Settings */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                        <Mail className="h-5 w-5 text-purple-600" />
                        <h2 className="font-semibold text-slate-900">Email Settings</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-slate-100">
                            <div>
                                <p className="font-medium text-slate-900">Email Provider</p>
                                <p className="text-sm text-slate-500">Service used for sending emails</p>
                            </div>
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                Resend
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-slate-100">
                            <div>
                                <p className="font-medium text-slate-900">From Email</p>
                                <p className="text-sm text-slate-500">Sender email address</p>
                            </div>
                            <span className="text-slate-600">team@mail.networkershome.com</span>
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <div>
                                <p className="font-medium text-slate-900">Auto-send Reports</p>
                                <p className="text-sm text-slate-500">Automatically email reports to users</p>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                Enabled
                            </span>
                        </div>
                    </div>
                </div>

                {/* AI Settings */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                        <Settings className="h-5 w-5 text-orange-600" />
                        <h2 className="font-semibold text-slate-900">AI Configuration</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-slate-100">
                            <div>
                                <p className="font-medium text-slate-900">AI Provider</p>
                                <p className="text-sm text-slate-500">API service for AI inference</p>
                            </div>
                            <span className="text-slate-600">OpenRouter</span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-slate-100">
                            <div>
                                <p className="font-medium text-slate-900">Model</p>
                                <p className="text-sm text-slate-500">Active AI model</p>
                            </div>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                Gemma 2 9B
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <div>
                                <p className="font-medium text-slate-900">API Status</p>
                                <p className="text-sm text-slate-500">Current API connection status</p>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                Connected
                            </span>
                        </div>
                    </div>
                </div>

                {/* Database Settings */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                        <Database className="h-5 w-5 text-green-600" />
                        <h2 className="font-semibold text-slate-900">Database</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-slate-100">
                            <div>
                                <p className="font-medium text-slate-900">Provider</p>
                                <p className="text-sm text-slate-500">Database hosting service</p>
                            </div>
                            <span className="text-slate-600">Neon PostgreSQL</span>
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <div>
                                <p className="font-medium text-slate-900">Connection Status</p>
                                <p className="text-sm text-slate-500">Database connectivity</p>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                Connected
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
