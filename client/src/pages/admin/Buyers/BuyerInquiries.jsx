import React from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    CalendarDays,
    MessageCircle,
    Eye,
    ShieldAlert,
    X,
} from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

const DUMMY_USER = {
    id: "USR-10231",
    name: "Arjun Mehta",
};

const DUMMY_INQUIRIES = [
    {
        id: "INQ-103",
        vehicle: "Hyundai Creta 2023",
        consultant: "Rajesh Motors",
        status: "Active",
        date: "10 Apr 2026",
        chatStarted: true,
    },
    {
        id: "INQ-107",
        vehicle: "Tata Nexon EV",
        consultant: "City Cars",
        status: "Closed",
        date: "08 Apr 2026",
        chatStarted: true,
    },
    {
        id: "INQ-112",
        vehicle: "Maruti Swift 2022",
        consultant: "Auto Hub",
        status: "Pending",
        date: "05 Apr 2026",
        chatStarted: false,
    },
    {
        id: "INQ-115",
        vehicle: "Honda City 2023",
        consultant: "Premium Motors",
        status: "Active",
        date: "03 Apr 2026",
        chatStarted: true,
    },
    {
        id: "INQ-118",
        vehicle: "Mahindra XUV700",
        consultant: "Elite Cars",
        status: "Active",
        date: "01 Apr 2026",
        chatStarted: true,
    },
];

const BuyerInquiries = () => {
    const navigate = useNavigate();
    const user = DUMMY_USER;

    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
            <div className="flex-1 overflow-auto">
                <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate("/admin/buyers/profile")}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">User Inquiries</h1>
                                <p className="text-sm text-slate-500 mt-1">
                                    {user.name} • {user.id}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Inquiries List */}
                    <div className="space-y-4">
                        {DUMMY_INQUIRIES.map((inquiry) => (
                            <div
                                key={inquiry.id}
                                className="rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="text-[13px] font-mono font-semibold text-slate-500">
                                            {inquiry.id}
                                        </div>
                                        <div className="mt-1 text-[17px] font-bold text-slate-900">
                                            {inquiry.vehicle}
                                        </div>
                                        <div className="mt-1 text-[14px] text-slate-600">
                                            Consultant: {inquiry.consultant}
                                        </div>
                                    </div>
                                    <span
                                        className={cls(
                                            "inline-flex rounded-full px-3 py-1.5 text-[11px] font-bold border",
                                            inquiry.status === "Active"
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                : inquiry.status === "Closed"
                                                    ? "bg-slate-50 text-slate-700 border-slate-200"
                                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                        )}
                                    >
                                        {inquiry.status}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-4 text-[13px] text-slate-500">
                                        <span className="flex items-center gap-1.5">
                                            <CalendarDays size={14} />
                                            {inquiry.date}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <MessageCircle size={14} />
                                            {inquiry.chatStarted ? "Chat Active" : "No Chat"}
                                        </span>
                                    </div>

                                    <div className="flex gap-2">
                                        <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                                            <Eye size={14} />
                                            View Chat
                                        </button>
                                        <button className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] font-semibold text-amber-700 hover:bg-amber-100 transition-colors">
                                            <ShieldAlert size={14} />
                                            Mark Suspicious
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyerInquiries;
