import React, { useEffect, useState } from "react";
import {
    ArrowLeft,
    User,
    ShieldCheck,
    Car,
    CreditCard,
    FileText,
    Eye,
    X,
    CheckCircle2,
    Clock3,
    RefreshCw,
    XCircle,
    Pencil,
    Trash2,
    Loader2,
    Mail,
    Phone,
    MapPin,
} from "lucide-react";
import { getInspectorById } from "../../../../api/inspector.api";

const cls = (...a) => a.filter(Boolean).join(" ");

const safe = (v) => (v === null || v === undefined || v === "" ? "—" : v);

const formatDateTime = (dateTime) => {
    if (!dateTime) return "—";
    const date = new Date(dateTime);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const statusBadge = (status) => {
    const s = String(status || "").toUpperCase();
    const map = {
        ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
        INACTIVE: "bg-slate-50 text-slate-700 border-slate-200",
    };
    return map[s] || "bg-slate-50 text-slate-700 border-slate-200";
};

const formatInspectorType = (type) => {
    if (!type) return "—";
    const map = { TWO_WHEELER: "2 Wheeler", FOUR_WHEELER: "4 Wheeler", BOTH: "Both" };
    return map[type] || type;
};

/* ── Image Preview Modal ─────────────────────────────────── */
function ImagePreviewModal({ imageUrl, title, onClose }) {
    if (!imageUrl) return null;
    return (
        <>
            <div className="fixed inset-0 z-[120] bg-black/75 backdrop-blur-sm" onClick={onClose} />
            <div className="fixed left-1/2 top-1/2 z-[121] w-[95%] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                    <h3 className="text-base font-bold text-slate-900">{title}</h3>
                    <button onClick={onClose} className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                        <X size={16} />
                    </button>
                </div>
                <div className="flex min-h-[280px] max-h-[75vh] items-center justify-center bg-slate-100 p-4">
                    <img src={imageUrl} alt={title} className="max-h-[70vh] w-auto max-w-full rounded-xl border border-slate-200 bg-white object-contain shadow-sm" />
                </div>
            </div>
        </>
    );
}

/* ── Section Card ────────────────────────────────────────── */
function SectionCard({ icon, title, children }) {
    return (
        <div className="rounded-[24px] border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 bg-slate-50/60">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 border border-sky-100 text-sky-600">
                    {icon}
                </div>
                <h3 className="text-[13px] font-bold uppercase tracking-[0.08em] text-slate-700">{title}</h3>
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}

/* ── Info Row ────────────────────────────────────────────── */
function InfoRow({ label, value, mono = false }) {
    return (
        <div className="flex items-start justify-between gap-4 py-2.5 border-b border-slate-100 last:border-0">
            <span className="text-[12px] font-semibold uppercase tracking-wide text-slate-400 shrink-0 pt-0.5">{label}</span>
            <span className={cls("text-[13px] font-semibold text-slate-900 text-right break-all", mono && "font-mono")}>{safe(value)}</span>
        </div>
    );
}

/* ── Document Photo Card ─────────────────────────────────── */
function DocPhotoCard({ label, imageUrl, onPreview }) {
    return (
        <div className="flex flex-col gap-2">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
            {imageUrl ? (
                <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 cursor-pointer" onClick={() => onPreview(imageUrl, label)}>
                    <img src={imageUrl} alt={label} className="h-28 w-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-800 shadow">
                            <Eye className="h-3.5 w-3.5" />
                            Preview
                        </div>
                    </div>
                    <div className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                        {label}
                    </div>
                </div>
            ) : (
                <div className="h-28 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-1.5 text-slate-400">
                    <FileText className="h-5 w-5" />
                    <span className="text-[11px] font-medium">Not uploaded</span>
                </div>
            )}
        </div>
    );
}

/* ── Empty Tab State ─────────────────────────────────────── */
function EmptyTabState({ icon, title, subtitle, color = "slate" }) {
    const colorMap = {
        amber: "bg-amber-50 border-amber-200 text-amber-500",
        sky: "bg-sky-50 border-sky-200 text-sky-500",
        emerald: "bg-emerald-50 border-emerald-200 text-emerald-500",
        rose: "bg-rose-50 border-rose-200 text-rose-500",
        slate: "bg-slate-50 border-slate-200 text-slate-400",
    };
    return (
        <div className="rounded-[24px] border-2 border-dashed border-slate-200 bg-white py-20 flex flex-col items-center justify-center text-center gap-3">
            <div className={cls("w-16 h-16 rounded-2xl border flex items-center justify-center", colorMap[color] || colorMap.slate)}>
                {icon}
            </div>
            <div>
                <p className="text-[15px] font-bold text-slate-900">{title}</p>
                <p className="mt-1 text-[13px] text-slate-500 max-w-xs mx-auto">{subtitle}</p>
            </div>
        </div>
    );
}

/* ── MAIN COMPONENT ──────────────────────────────────────── */
const InspectorDetail = ({ inspector: inspectorProp, onBack, onEdit, onDelete }) => {
    const [inspector, setInspector] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [preview, setPreview] = useState({ open: false, url: "", title: "" });
    const [activeTab, setActiveTab] = useState("overview");

    const TABS = [
        { key: "overview", label: "Overview", icon: <User size={13} /> },
        { key: "pending", label: "Pending", icon: <Clock3 size={13} /> },
        { key: "in_progress", label: "In Progress", icon: <RefreshCw size={13} /> },
        { key: "completed", label: "Completed", icon: <CheckCircle2 size={13} /> },
        { key: "rejected", label: "Rejected", icon: <XCircle size={13} /> },
    ];

    const TAB_COLORS = {
        overview: { active: "bg-slate-900 text-white border-slate-900", inactive: "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50" },
        pending: { active: "bg-amber-100 text-amber-800 border-amber-300", inactive: "bg-white text-slate-600 border-slate-200 hover:border-amber-200 hover:bg-amber-50" },
        in_progress: { active: "bg-sky-100 text-sky-800 border-sky-300", inactive: "bg-white text-slate-600 border-slate-200 hover:border-sky-200 hover:bg-sky-50" },
        completed: { active: "bg-emerald-100 text-emerald-800 border-emerald-300", inactive: "bg-white text-slate-600 border-slate-200 hover:border-emerald-200 hover:bg-emerald-50" },
        rejected: { active: "bg-rose-100 text-rose-800 border-rose-300", inactive: "bg-white text-slate-600 border-slate-200 hover:border-rose-200 hover:bg-rose-50" },
    };

    // Fetch full inspector details by ID
    useEffect(() => {
        if (!inspectorProp?.id) return;
        setLoading(true);
        setError("");
        getInspectorById(inspectorProp.id)
            .then((res) => {
                setInspector(res?.data || res);
            })
            .catch((err) => {
                console.error("Failed to fetch inspector details:", err);
                setError(err?.response?.data?.message || "Failed to load inspector details");
                // Fallback to prop data
                setInspector(inspectorProp);
            })
            .finally(() => setLoading(false));
    }, [inspectorProp?.id]);

    const openPreview = (url, title) => setPreview({ open: true, url, title });
    const closePreview = () => setPreview({ open: false, url: "", title: "" });

    // Loading state
    if (loading) {
        return (
            <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
                <div className="flex-shrink-0 border-b border-slate-200 bg-white px-6 py-4">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
                            <ArrowLeft size={18} />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900">Inspector Details</h1>
                            <p className="text-[13px] text-slate-500">View complete inspector profile</p>
                        </div>
                    </div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-12 w-12 text-sky-600 animate-spin" />
                        <p className="text-[14px] font-semibold text-slate-600">Loading inspector details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!inspector) return null;

    // Derived display values from InspectorResponse
    const fullName = [inspector.firstname, inspector.lastname].filter(Boolean).join(" ") || "—";

    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">

            {/* ── HEADER ── */}
            <div className="flex-shrink-0 border-b border-slate-200 bg-white px-6 py-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
                            <ArrowLeft size={18} />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900">Inspector Details</h1>
                            <p className="text-[13px] text-slate-500">View complete inspector profile</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => onEdit?.(inspector)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                        </button>
                        <button onClick={() => onDelete?.(inspector)} className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-rose-700 transition-all active:scale-95 shadow-sm shadow-rose-600/20">
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            {/* ── SCROLLABLE CONTENT ── */}
            <div className="flex-1 overflow-y-auto">
                <div className="w-full mx-auto px-6 py-6 space-y-6">

                    {/* ── PROFILE HERO CARD ── */}
                    <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm p-6">
                        <div className="flex flex-col sm:flex-row items-start gap-5">
                            {/* Avatar */}
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-100 to-blue-200 border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                                <span className="text-3xl font-extrabold text-sky-700">
                                    {inspector.firstname?.charAt(0)?.toUpperCase() || inspector.inspectorUsername?.charAt(0)?.toUpperCase() || "?"}
                                </span>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-3 mb-1">
                                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{fullName}</h2>
                                    <span className={cls("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold", statusBadge(inspector.status))}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                                        {inspector.status || "—"}
                                    </span>
                                </div>
                                <p className="text-[13px] text-slate-500 font-medium mb-4">@{safe(inspector.inspectorUsername)}</p>

                                {/* Quick stats */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Role</p>
                                        <p className="mt-1 text-[13px] font-bold text-slate-900">{safe(inspector.userRole)}</p>
                                    </div>
                                    <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Vehicle Type</p>
                                        <p className="mt-1 text-[13px] font-bold text-slate-900">{formatInspectorType(inspector.inspectorType)}</p>
                                    </div>
                                    <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">City</p>
                                        <p className="mt-1 text-[13px] font-bold text-slate-900">{safe(inspector.cityName)}</p>
                                    </div>
                                    <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Age</p>
                                        <p className="mt-1 text-[13px] font-bold text-slate-900">{safe(inspector.age)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── TABS ── */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={cls(
                                    "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[13px] font-semibold transition-all active:scale-95 shadow-sm",
                                    activeTab === tab.key ? TAB_COLORS[tab.key].active : TAB_COLORS[tab.key].inactive
                                )}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* ── OVERVIEW TAB ── */}
                    {activeTab === "overview" && (
                        <>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                                {/* Personal Information */}
                                <SectionCard icon={<User size={15} />} title="Personal Information">
                                    <InfoRow label="Full Name" value={fullName} />
                                    <InfoRow label="Username" value={inspector.inspectorUsername} />
                                    <InfoRow label="Email" value={inspector.email} />
                                    <InfoRow label="Contact" value={inspector.contactNumber} />
                                    <InfoRow label="Age" value={inspector.age} />
                                    <InfoRow label="UPI ID" value={inspector.upiId} />
                                    <InfoRow label="Vehicle Type" value={formatInspectorType(inspector.inspectorType)} />
                                </SectionCard>

                                {/* Account Information */}
                                <SectionCard icon={<ShieldCheck size={15} />} title="Account Information">
                                    <InfoRow label="Inspector ID" value={inspector.id} mono />
                                    <InfoRow label="Role" value={inspector.userRole} />
                                    <InfoRow label="Status" value={inspector.status} />
                                    <InfoRow label="Created At" value={formatDateTime(inspector.createdAt)} />
                                    <InfoRow label="Updated At" value={formatDateTime(inspector.updatedAt)} />
                                </SectionCard>
                            </div>

                            {/* Address */}
                            <SectionCard icon={<MapPin size={15} />} title="Address">
                                <InfoRow label="Address" value={inspector.address} />
                                <InfoRow label="City" value={inspector.cityName} />
                                <InfoRow label="State" value={inspector.stateName} />
                                <InfoRow label="Country" value={inspector.countryName} />
                            </SectionCard>

                            {/* Aadhar Card */}
                            <SectionCard icon={<CreditCard size={15} />} title="Aadhar Card">
                                <div className="mb-4">
                                    <InfoRow label="Aadhar Number" value={inspector.aadharCardNumber} mono />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <DocPhotoCard label="Front Photo" imageUrl={inspector.aadharCardFrontUrl} onPreview={openPreview} />
                                    <DocPhotoCard label="Back Photo" imageUrl={inspector.aadharCardBackUrl} onPreview={openPreview} />
                                </div>
                            </SectionCard>

                            {/* Driving License */}
                            <SectionCard icon={<Car size={15} />} title="Driving License">
                                <div className="mb-4">
                                    <InfoRow label="DL Number" value={inspector.drivingLicenseNumber} mono />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <DocPhotoCard label="Front Photo" imageUrl={inspector.drivingLicenseFrontUrl} onPreview={openPreview} />
                                    <DocPhotoCard label="Back Photo" imageUrl={inspector.drivingLicenseBackUrl} onPreview={openPreview} />
                                </div>
                            </SectionCard>
                        </>
                    )}

                    {activeTab === "pending" && (
                        <EmptyTabState icon={<Clock3 className="h-8 w-8" />} title="No Pending Inspections" subtitle="There are no pending inspections assigned to this inspector." color="amber" />
                    )}
                    {activeTab === "in_progress" && (
                        <EmptyTabState icon={<RefreshCw className="h-8 w-8" />} title="No In-Progress Inspections" subtitle="This inspector has no inspections currently in progress." color="sky" />
                    )}
                    {activeTab === "completed" && (
                        <EmptyTabState icon={<CheckCircle2 className="h-8 w-8" />} title="No Completed Inspections" subtitle="This inspector hasn't completed any inspections yet." color="emerald" />
                    )}
                    {activeTab === "rejected" && (
                        <EmptyTabState icon={<XCircle className="h-8 w-8" />} title="No Rejected Inspections" subtitle="This inspector has no rejected inspections on record." color="rose" />
                    )}

                </div>
            </div>

            {preview.open && (
                <ImagePreviewModal imageUrl={preview.url} title={preview.title} onClose={closePreview} />
            )}
        </div>
    );
};

export default InspectorDetail;
