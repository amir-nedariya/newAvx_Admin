import React, { useEffect, useState } from "react";
import {
    ArrowLeft,
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
    MapPin,
    Calendar,
    BadgeDollarSign,
    User,
    ClipboardList,
    History,
    AlertTriangle,
    Video,
} from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

const safe = (v) => (v === null || v === undefined || v === "" ? "—" : v);

const formatEnum = (val) => {
    if (val === null || val === undefined || val === "") return "—";
    return String(val)
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

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
        REQUESTED: "bg-amber-50 text-amber-700 border-amber-200",
        PENDING: "bg-amber-50 text-amber-700 border-amber-200",
        ACCEPTED: "bg-indigo-50 text-indigo-700 border-indigo-200",
        ASSIGNED: "bg-indigo-50 text-indigo-700 border-indigo-200",
        SCHEDULED: "bg-violet-50 text-violet-700 border-violet-200",
        SUBMITTED: "bg-teal-50 text-teal-700 border-teal-200",
        COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
        REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
        CANCELLED: "bg-slate-100 text-slate-700 border-slate-200",
    };
    return map[s] || "bg-slate-100 text-slate-700 border-slate-200";
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
                <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 cursor-pointer " onClick={() => onPreview(imageUrl, label)}>
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
const InspectionRequestDetail = ({ request: requestProp, onBack, onEdit, onDelete, onAssign, onCancel }) => {
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [preview, setPreview] = useState({ open: false, url: "", title: "" });
    const [activeTab, setActiveTab] = useState("overview");

    const TABS = [
        { key: "overview", label: "Overview", icon: <ClipboardList size={13} /> },
        { key: "vehicle", label: "Vehicle Info", icon: <Car size={13} /> },
        { key: "payment", label: "Payment", icon: <BadgeDollarSign size={13} /> },
    ];

    const TAB_COLORS = {
        overview: { active: "bg-slate-900 text-white border-slate-900", inactive: "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50" },
        vehicle: { active: "bg-sky-100 text-sky-800 border-sky-300", inactive: "bg-white text-slate-600 border-slate-200 hover:border-sky-200 hover:bg-sky-50" },
        payment: { active: "bg-emerald-100 text-emerald-800 border-emerald-300", inactive: "bg-white text-slate-600 border-slate-200 hover:border-emerald-200 hover:bg-emerald-50" },
        inspector: { active: "bg-indigo-100 text-indigo-800 border-indigo-300", inactive: "bg-white text-slate-600 border-slate-200 hover:border-indigo-200 hover:bg-indigo-50" },
        history: { active: "bg-amber-100 text-amber-800 border-amber-300", inactive: "bg-white text-slate-600 border-slate-200 hover:border-amber-200 hover:bg-amber-50" },
    };

    useEffect(() => {
        setLoading(true);
        if (requestProp) {
            if (requestProp.isLoadingDetails) return;
            // Map the nested API structure to local state
            const vd = requestProp.vehicleDetail || {};
            const ru = requestProp.requestedUser || {};
            const ai = requestProp.assignedInspector || {};

            setRequest({
                ...requestProp,
                vehicleName: vd ? `${vd.makerName} ${vd.modelName} ${vd.variantName} ${vd.yearOfMfg}` : "—",
                vehicleId: vd?.id || "—",
                requestedByName: ru ? `${ru.firstname} ${ru.lastname}` : "—",
                inspectorName: ai ? `${ai.firstname} ${ai.lastname}` : null,
                inspectorUsername: ai?.inspectorUsername || null,
            });
            setLoading(false);
        }
    }, [requestProp]);

    const openPreview = (url, title) => setPreview({ open: true, url, title });
    const closePreview = () => setPreview({ open: false, url: "", title: "" });

    if (loading) {
        return (
            <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
                <div className="flex-shrink-0 border-b border-slate-200 bg-white px-6 py-4">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
                            <ArrowLeft size={18} />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900">Inspection Request</h1>
                            <p className="text-[13px] text-slate-500">View complete request details</p>
                        </div>
                    </div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-12 w-12 text-sky-600 animate-spin" />
                        <p className="text-[14px] font-semibold text-slate-600">Loading request details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!request) return null;

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
                            <h1 className="text-xl font-bold tracking-tight text-slate-900">Request Details</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => onAssign?.(request)} className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-sky-700 transition-all active:scale-95 shadow-sm shadow-sky-600/20">
                            <User size={14} />
                            Assign Inspector
                        </button>
                        <button onClick={() => onCancel?.(request)} className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-[13px] font-semibold text-rose-700 hover:bg-rose-100 transition-all active:scale-95 shadow-sm">
                            <X size={14} />
                            Cancel Request
                        </button>
                    </div>
                </div>
            </div>

            {/* ── SCROLLABLE CONTENT ── */}
            <div className="flex-1 overflow-y-auto">
                <div className="w-full mx-auto px-6 py-6 space-y-6">

                    {/* ── REQUEST HERO CARD ── */}
                    <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm p-6">
                        <div className="flex flex-col sm:flex-row items-start gap-5">
                            {/* Icon */}
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-100 to-blue-200 border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                                <Car className="h-10 w-10 text-sky-700" />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">{request.vehicleName}</h2>
                                    <div className="flex items-center gap-3">
                                        <span className={cls("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider shadow-sm", statusBadge(request.inspectionRequestStatus))}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                                            {formatEnum(request.inspectionRequestStatus)}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-[11px] font-bold text-white shadow-sm shadow-slate-200 uppercase tracking-wider">
                                            {request.inspectionType?.includes("VIDEO") ? <Video size={12} className="text-sky-400" /> : <ClipboardList size={12} className="text-sky-400" />}
                                            {formatEnum(request.inspectionType)}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-[13px] text-slate-500 font-semibold mb-4 uppercase tracking-[0.05em] flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                    {formatEnum(request.requesterType)} Request
                                </p>

                                {/* Quick stats */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Requested By</p>
                                        <p className="mt-1 text-[13px] font-bold text-slate-900 truncate">{safe(request.requestedByName)}</p>
                                    </div>
                                    <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Type</p>
                                        <p className="mt-1 text-[13px] font-bold text-slate-900">{formatEnum(request.requesterType)}</p>
                                    </div>
                                    <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Scheduled At</p>
                                        <p className="mt-1 text-[13px] font-bold text-slate-900">{formatDateTime(request.videoCallScheduledAt)}</p>
                                    </div>
                                    <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Created At</p>
                                        <p className="mt-1 text-[13px] font-bold text-slate-900">{formatDateTime(request.createdAt)}</p>
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

                    {/* ── TAB CONTENT ── */}
                    {activeTab === "overview" && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Request Information */}
                            <SectionCard icon={<ClipboardList size={15} />} title="Request Information">
                                <InfoRow label="Request ID" value={request.id} mono />
                                <InfoRow label="Status" value={formatEnum(request.inspectionRequestStatus)} />
                                <InfoRow label="Inspection Type" value={formatEnum(request.inspectionType)} />
                                <InfoRow label="Requester Type" value={formatEnum(request.requesterType)} />
                                <InfoRow label="Process Completed" value={request.isProcessCompleted ? "Yes" : "No"} />
                                <InfoRow label="Created At" value={formatDateTime(request.createdAt)} />
                            </SectionCard>

                            {/* Scheduling & Contact */}
                            <SectionCard icon={<Calendar size={15} />} title="Scheduling & Contact">
                                <InfoRow label="Scheduled Date" value={formatDateTime(request.videoCallScheduledAt)} />
                                <InfoRow label="Whatsapp No" value={request.whatsappNumber} />
                            </SectionCard>

                            {/* Requester Profile */}
                            <SectionCard icon={<User size={15} />} title="Requester Profile">
                                <InfoRow label="Full Name" value={`${request.requestedUser?.firstname} ${request.requestedUser?.lastname}`} />
                                <InfoRow label="Email" value={request.requestedUser?.email} />
                                <InfoRow label="Phone" value={`${request.requestedUser?.countryCode} ${request.requestedUser?.phoneNumber}`} />
                                <InfoRow label="User Role" value={request.requestedUser?.userRole} />
                                <InfoRow label="Account Status" value={request.requestedUser?.status} />
                            </SectionCard>

                            {/* Vehicle Owner Details */}
                            <SectionCard icon={<ShieldCheck size={15} />} title="Vehicle Owner Details">
                                <InfoRow label="Owner Name" value={`${request.vehicleDetail?.userMaster?.firstname} ${request.vehicleDetail?.userMaster?.lastname}`} />
                                <InfoRow label="Owner Email" value={request.vehicleDetail?.userMaster?.email} />
                                <InfoRow label="Owner Phone" value={`${request.vehicleDetail?.userMaster?.countryCode} ${request.vehicleDetail?.userMaster?.phoneNumber}`} />
                                <InfoRow label="Owner Role" value={request.vehicleDetail?.userMaster?.userRole} />
                            </SectionCard>
                        </div>
                    )}

                    {activeTab === "vehicle" && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Core Specifications */}
                            <SectionCard icon={<Car size={15} />} title="Core Specifications">
                                <InfoRow label="Brand" value={request.vehicleDetail?.makerName} />
                                <InfoRow label="Model" value={request.vehicleDetail?.modelName} />
                                <InfoRow label="Variant" value={request.vehicleDetail?.variantName} />
                                <InfoRow label="Vehicle Type" value={formatEnum(request.vehicleDetail?.vehicleType)} />
                                <InfoRow label="Sub Type" value={formatEnum(request.vehicleDetail?.vehicleSubType)} />
                                <InfoRow label="Year of Mfg" value={request.vehicleDetail?.yearOfMfg} />
                                <InfoRow label="Transmission" value={formatEnum(request.vehicleDetail?.transmissionType)} />
                                <InfoRow label="Fuel Type" value={formatEnum(request.vehicleDetail?.fuelType)} />
                                <InfoRow label="Color" value={request.vehicleDetail?.colour} />
                                <InfoRow label="Ownership" value={`${request.vehicleDetail?.ownership} Owner`} />
                            </SectionCard>
                            
                            {/* Usage & Condition */}
                            <SectionCard icon={<History size={15} />} title="Usage & Condition">
                                <InfoRow label="KM Driven" value={`${request.vehicleDetail?.kmDriven?.toLocaleString()} km`} />
                                <InfoRow label="Last Service" value={formatDateTime(request.vehicleDetail?.lastServiceDate)} />
                                <InfoRow label="Spare Key" value={request.vehicleDetail?.spareKey ? "Available" : "Not Available"} />
                                <InfoRow label="Spare Wheel" value={request.vehicleDetail?.spareWheel ? "Available" : "Not Available"} />
                                <InfoRow label="Test Drive" value={request.vehicleDetail?.testDriveAvl ? "Available" : "Not Available"} />
                                <InfoRow label="CNG Fitted" value={request.vehicleDetail?.isCngFitted ? `Yes (${request.vehicleDetail?.cngType || "Standard"})` : "No"} />
                                <InfoRow label="Has Challan" value={request.vehicleDetail?.hasChallan ? "Yes" : "No"} />
                            </SectionCard>

                            {/* Status & Pricing */}
                            <SectionCard icon={<BadgeDollarSign size={15} />} title="Status & Pricing">
                                <InfoRow label="Asking Price" value={`₹${request.vehicleDetail?.price?.toLocaleString()}`} />
                                <InfoRow label="Verification" value={formatEnum(request.vehicleDetail?.verificationStatus)} />
                                <InfoRow label="Inspection" value={formatEnum(request.vehicleDetail?.inspectionStatus)} />
                                <InfoRow label="Is Sold" value={request.vehicleDetail?.isVehicleSold ? "Yes" : "No"} />
                                <InfoRow label="Verified At" value={formatDateTime(request.vehicleDetail?.verifiedAt)} />
                                <InfoRow label="Admin Remark" value={request.vehicleDetail?.adminRemark} />
                            </SectionCard>

                            {/* Identification */}
                            <SectionCard icon={<FileText size={15} />} title="Identification">
                                <InfoRow label="Vehicle ID" value={request.vehicleDetail?.id} mono />
                                <InfoRow label="Internal Status" value={request.vehicleDetail?.status} />
                                <InfoRow label="Created" value={formatDateTime(request.vehicleDetail?.createdAt)} />
                            </SectionCard>
                        </div>
                    )}

                    {activeTab === "payment" && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Payment Information */}
                            <SectionCard icon={<BadgeDollarSign size={15} />} title="Payment Information">
                                <InfoRow label="Amount" value={`₹${request.amount}`} />
                                <InfoRow label="Payment Status" value={formatEnum(request.paymentStatus)} />
                                <InfoRow label="Paid By" value={request.paidBy} />
                                <InfoRow label="Payment Mode" value={request.paymentMode} />
                                <InfoRow label="Transaction ID" value={request.transactionId} mono />
                            </SectionCard>
                        </div>
                    )}



                    {activeTab === "history" && (
                        <SectionCard icon={<History size={15} />} title="Request Timeline">
                            <div className="space-y-6 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                                <div className="relative pl-10">
                                    <div className="absolute left-0 top-1.5 w-5 h-5 rounded-full bg-emerald-100 border-2 border-white shadow-sm flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    </div>
                                    <p className="text-[13px] font-bold text-slate-900">Request Created</p>
                                    <p className="text-[12px] text-slate-500">{formatDateTime(request.requestedOn)}</p>
                                </div>
                                <div className="relative pl-10">
                                    <div className="absolute left-0 top-1.5 w-5 h-5 rounded-full bg-amber-100 border-2 border-white shadow-sm flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                    </div>
                                    <p className="text-[13px] font-bold text-slate-900">Awaiting Assignment</p>
                                    <p className="text-[12px] text-slate-500">System updated status</p>
                                </div>
                            </div>
                        </SectionCard>
                    )}

                </div>
            </div>

            {preview.open && (
                <ImagePreviewModal imageUrl={preview.url} title={preview.title} onClose={closePreview} />
            )}
        </div>
    );
};

export default InspectionRequestDetail;
