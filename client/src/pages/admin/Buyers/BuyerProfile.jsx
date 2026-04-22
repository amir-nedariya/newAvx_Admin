import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    User,
    Smartphone,
    Mail,
    MapPin,
    CalendarDays,
    Activity,
    ShieldCheck,
    Clock3,
    MessagesSquare,
    Ban,
    MessageSquareWarning,
    ShieldAlert,
    TriangleAlert,
    ChevronDown,
} from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

// Dummy user data
const DUMMY_USER = {
    id: "USR-10231",
    name: "Arjun Mehta",
    mobile: "+91 98765 43120",
    email: "arjun.mehta@gmail.com",
    city: "Ahmedabad",
    inquiries30d: 18,
    saved: 12,
    inspectionReq: 3,
    risk: "Low",
    status: "Active",
    lastActive: "2h ago",
    signupMethod: "Google",
    appInstalled: true,
    chatViolations: 0,
    ipAddress: "103.22.14.80",
    signupDate: "12 Jan 2026",
    totalBookings: 2,
    totalInquiries: 64,
    totalInspectionRequests: 7,
    deviceHistory: ["iPhone 14", "Chrome on Windows"],
    ipHistory: ["103.22.14.80", "103.22.14.81"],
    loginMethods: ["Google", "OTP"],
    activityLog: [
        { date: "12 Apr 2026 14:30", action: "Inquiry sent for Hyundai Creta" },
        { date: "12 Apr 2026 12:15", action: "Saved Tata Nexon to wishlist" },
        { date: "11 Apr 2026 18:45", action: "Inspection requested for Kia Seltos" },
        { date: "11 Apr 2026 10:20", action: "Logged in via Google" },
        { date: "10 Apr 2026 16:30", action: "Profile updated" },
    ],
};

const statusBadge = (status) => {
    const map = {
        Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
        Suspended: "bg-rose-50 text-rose-700 border-rose-200",
        "Under Review": "bg-amber-50 text-amber-700 border-amber-200",
        Limited: "bg-sky-50 text-sky-700 border-sky-200",
        Banned: "bg-red-50 text-red-700 border-red-200",
    };
    return map[status] || "bg-slate-50 text-slate-700 border-slate-200";
};

const riskBadge = (risk) => {
    const map = {
        Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
        Moderate: "bg-amber-50 text-amber-700 border-amber-200",
        High: "bg-rose-50 text-rose-700 border-rose-200",
    };
    return map[risk] || "bg-slate-50 text-slate-700 border-slate-200";
};

const BuyerProfile = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState("overview");
    const user = DUMMY_USER;

    const tabs = [
        { id: "overview", label: "Activity Overview" },
        { id: "inquiries", label: "Inquiries" },
        { id: "saved", label: "Saved Vehicles" },
        { id: "inspections", label: "Inspection Requests" },
        { id: "violations", label: "Chat Violations" },
        { id: "activity", label: "Activity Log" },
    ];

    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
            <div className="flex-1 overflow-auto">
                <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/admin/buyers/all")}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Buyer Profile</h1>
                            <p className="text-sm text-slate-500 mt-1">View and manage buyer account details</p>
                        </div>
                    </div>

                    {/* User Info Card */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-100 to-blue-100 border-2 border-slate-200 flex items-center justify-center shrink-0">
                                    <span className="text-2xl font-bold text-sky-700">
                                        {user.name.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                                    <p className="text-sm text-slate-500 font-mono mt-1">{user.id}</p>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        <span
                                            className={cls(
                                                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold border",
                                                statusBadge(user.status)
                                            )}
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                            {user.status}
                                        </span>
                                        <span
                                            className={cls(
                                                "inline-flex rounded-full px-3 py-1 text-[11px] font-bold border",
                                                riskBadge(user.risk)
                                            )}
                                        >
                                            {user.risk} Risk
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold border bg-slate-100 text-slate-700 border-slate-200">
                                            {user.signupMethod}
                                        </span>
                                        {user.appInstalled && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-200">
                                                <Smartphone size={12} />
                                                App Installed
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {user.status !== "Suspended" && (
                                <div className="flex gap-2">
                                    <button className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-[13px] font-semibold text-rose-700 hover:bg-rose-100 transition-colors">
                                        <Ban size={14} />
                                        Suspend
                                    </button>
                                    <button className="inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-2 text-[13px] font-semibold text-sky-700 hover:bg-sky-100 transition-colors">
                                        <MessageSquareWarning size={14} />
                                        Limit
                                    </button>
                                    <button className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-[13px] font-semibold text-amber-700 hover:bg-amber-100 transition-colors">
                                        <ShieldAlert size={14} />
                                        Flag
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200">
                            <StatCard label="Signup Date" value={user.signupDate} icon={CalendarDays} />
                            <StatCard label="Total Inquiries" value={user.totalInquiries} icon={MessagesSquare} />
                            <StatCard label="Total Bookings" value={user.totalBookings} icon={Activity} />
                            <StatCard label="Inspections" value={user.totalInspectionRequests} icon={ShieldCheck} />
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-slate-200 bg-white rounded-t-2xl">
                        <div className="flex gap-1 px-2 pt-2 overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cls(
                                        "px-4 py-3 text-[13px] font-semibold rounded-t-xl transition-all whitespace-nowrap",
                                        activeTab === tab.id
                                            ? "bg-sky-50 text-sky-700 border-t-2 border-x-2 border-sky-500"
                                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                    )}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="rounded-b-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        {activeTab === "overview" && <ActivityOverviewTab user={user} />}
                        {activeTab === "inquiries" && <InquiriesTab />}
                        {activeTab === "saved" && <SavedVehiclesTab />}
                        {activeTab === "inspections" && <InspectionRequestsTab />}
                        {activeTab === "violations" && <ChatViolationsTab />}
                        {activeTab === "activity" && <ActivityLogTab user={user} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

function StatCard({ label, value, icon: Icon }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                    <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        {label}
                    </div>
                    <div className="mt-0.5 text-[16px] font-bold text-slate-900">{value}</div>
                </div>
            </div>
        </div>
    );
}

function ActivityOverviewTab({ user }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Account Details */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4">
                        Account Details
                    </h3>
                    <div className="space-y-3">
                        <InfoRow icon={User} label="Name" value={user.name} />
                        <InfoRow icon={Smartphone} label="Mobile" value={user.mobile} />
                        <InfoRow icon={Mail} label="Email" value={user.email} />
                        <InfoRow icon={MapPin} label="City" value={user.city} />
                        <InfoRow icon={ShieldAlert} label="IP Address" value={user.ipAddress} />
                        <InfoRow icon={Clock3} label="Last Active" value={user.lastActive} />
                    </div>
                </div>

                {/* Activity Summary */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4">
                        Activity Summary
                    </h3>
                    <div className="space-y-3">
                        <SectionList title="Device History" items={user.deviceHistory} />
                        <SectionList title="IP History" items={user.ipHistory} />
                        <SectionList title="Login Methods" items={user.loginMethods} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function InquiriesTab() {
    const navigate = useNavigate();

    return (
        <div className="text-center py-12">
            <MessagesSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">View Full Inquiries</h3>
            <p className="text-sm text-slate-500 mb-6">
                Click below to view all inquiries in detail
            </p>
            <button
                onClick={() => navigate("/admin/buyers/inquiries")}
                className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-700 transition-colors"
            >
                <MessagesSquare size={16} />
                View All Inquiries
            </button>
        </div>
    );
}

function SavedVehiclesTab() {
    const navigate = useNavigate();

    return (
        <div className="text-center py-12">
            <Activity className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">View Saved Vehicles</h3>
            <p className="text-sm text-slate-500 mb-6">
                Click below to view all saved vehicles in detail
            </p>
            <button
                onClick={() => navigate("/admin/buyers/saved-vehicles")}
                className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-700 transition-colors"
            >
                <Activity size={16} />
                View Saved Vehicles
            </button>
        </div>
    );
}

function InspectionRequestsTab() {
    return (
        <div className="text-center py-12">
            <ShieldCheck className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">No Inspection Requests</h3>
            <p className="text-sm text-slate-500">
                This user hasn't requested any inspections yet
            </p>
        </div>
    );
}

function ChatViolationsTab() {
    return (
        <div className="text-center py-12">
            <ShieldCheck className="h-12 w-12 text-emerald-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">No Violations</h3>
            <p className="text-sm text-slate-500">
                This user has a clean chat history with no violations
            </p>
        </div>
    );
}

function ActivityLogTab({ user }) {
    return (
        <div className="space-y-3">
            {user.activityLog.map((log, idx) => (
                <div
                    key={idx}
                    className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 shrink-0">
                        <Activity className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                        <div className="text-[13px] font-medium text-slate-900">{log.action}</div>
                        <div className="text-[11px] text-slate-500 mt-1">{log.date}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function InfoRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-slate-500 shrink-0">
                <Icon className="h-3.5 w-3.5" />
            </div>
            <div className="pt-0.5">
                <div className="text-[10px] uppercase tracking-wider text-slate-400">{label}</div>
                <div className="text-[13px] font-medium text-slate-700 mt-0.5">{value}</div>
            </div>
        </div>
    );
}

function SectionList({ title, items = [] }) {
    return (
        <div className="mb-4 last:mb-0">
            <h5 className="mb-2 text-[12px] font-semibold text-slate-600">{title}</h5>
            <div className="space-y-2">
                {items.length ? (
                    items.map((item, idx) => (
                        <div
                            key={`${title}-${idx}`}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-600"
                        >
                            {item}
                        </div>
                    ))
                ) : (
                    <div className="text-[12px] text-slate-400">No records</div>
                )}
            </div>
        </div>
    );
}

export default BuyerProfile;
