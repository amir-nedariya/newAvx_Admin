/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
    ArrowLeft,
    ShieldCheck,
    Car,
    CreditCard,
    FileText,
    Eye,
    X,
    Loader2,
    BadgeDollarSign,
    User,
    ClipboardList,
    History,
    AlertTriangle,
    ArrowUpRight,
    XCircle
} from "lucide-react";
import toast from "react-hot-toast";
import { getInspectionPaymentById } from "../../../../api/vehicleInspection.api";

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

const moneyIN = (n) => Number(n ?? 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
});

const paymentStatusBadge = (status) => {
    const s = String(status || "").toUpperCase();
    const map = {
        PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
        PENDING: "bg-amber-50 text-amber-700 border-amber-200",
        FAILED: "bg-rose-50 text-rose-700 border-rose-200",
        REFUNDED: "bg-slate-100 text-slate-700 border-slate-200",
    };
    return map[s] || "bg-slate-100 text-slate-700 border-slate-200";
};

const refundStatusBadge = (status) => {
    const s = String(status || "").toUpperCase();
    const tones = {
        REFUND_REQUESTED: "bg-amber-50 text-amber-700 border-amber-200",
        REFUND_COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
        REFUND_FAILED: "bg-rose-50 text-rose-700 border-rose-200",
    };
    const label = {
        REFUND_REQUESTED: "REFUND REQUESTED",
        REFUND_COMPLETED: "REFUND COMPLETED",
        REFUND_FAILED: "REFUND FAILED",
    };
    return (
        <span className={cls("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-extrabold shadow-sm uppercase tracking-wider", tones[s] || "bg-slate-50 text-slate-700 border-slate-200")}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {label[s] || s || "—"}
        </span>
    );
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
        <div className="rounded-[24px] border border-slate-200 bg-white shadow-sm overflow-hidden animate-fade-in">
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

/* ── MAIN COMPONENT ──────────────────────────────────────── */
const InspectionRefundDetail = ({ refundId, onBack }) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [preview, setPreview] = useState({ open: false, url: "", title: "" });
    const [activeTab, setActiveTab] = useState("overview");

    const TABS = [
        { key: "overview", label: "Overview", icon: <ClipboardList size={13} /> },
        { key: "inspection", label: "Inspection Info", icon: <Car size={13} /> },
        { key: "user", label: "User Profile", icon: <User size={13} /> },
    ];

    const TAB_COLORS = {
        overview: { active: "bg-slate-900 text-white border-slate-900", inactive: "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50" },
        inspection: { active: "bg-sky-100 text-sky-800 border-sky-300", inactive: "bg-white text-slate-600 border-slate-200 hover:border-sky-200 hover:bg-sky-50" },
        user: { active: "bg-indigo-100 text-indigo-800 border-indigo-300", inactive: "bg-white text-slate-600 border-slate-200 hover:border-indigo-200 hover:bg-indigo-50" },
    };

    useEffect(() => {
        if (!refundId) return;
        let active = true;
        setLoading(true);
        getInspectionPaymentById(refundId)
            .then((res) => {
                if (active) {
                    if (res?.data) {
                        setDetails(res.data);
                    } else {
                        toast.error("Refund details not found");
                        onBack();
                    }
                }
            })
            .catch((err) => {
                console.error("Error loading refund details:", err);
                toast.error(err?.response?.data?.message || "Failed to load refund details");
                if (active) onBack();
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [refundId, onBack]);

    const openPreview = (url, title) => setPreview({ open: true, url, title });
    const closePreview = () => setPreview({ open: false, url: "", title: "" });

    if (loading || !details) {
        return (
            <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
                <div className="flex-shrink-0 border-b border-slate-200 bg-white px-6 py-4">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all active:scale-95 shadow-sm cursor-pointer">
                            <ArrowLeft size={18} />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900">Refund Details</h1>
                            <p className="text-[13px] text-slate-500">Loading payment audit details...</p>
                        </div>
                    </div>
                </div>
                <div className="flex-1 flex items-center justify-center bg-slate-50">
                    <div className="flex flex-col items-center gap-4 animate-pulse">
                        <Loader2 className="h-12 w-12 text-sky-600 animate-spin" />
                        <p className="text-[14px] font-bold text-slate-500 tracking-wider">Retrieving Refund Transaction Audits...</p>
                    </div>
                </div>
            </div>
        );
    }

    const inspection = details.inspectionRequest || {};
    const vehicle = inspection.vehicleDetail || {};
    const inspector = inspection.assignedInspector || {};
    const user = details.userMaster || {};

    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
            {/* ── HEADER ── */}
            <div className="flex-shrink-0 border-b border-slate-200 bg-white px-6 py-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all active:scale-95 shadow-sm cursor-pointer">
                            <ArrowLeft size={18} />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900">Refund Transaction Details</h1>
                            <p className="text-[11px] text-slate-400 uppercase tracking-widest font-bold font-sans mt-0.5">
                                Transaction ID: {details.razorpayPaymentId || "—"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {details.invoiceUrl && (
                            <a
                                href={details.invoiceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-[13px] font-semibold text-white hover:bg-slate-800 transition-all active:scale-95 shadow-sm"
                            >
                                <FileText size={14} className="text-sky-400" />
                                Download Invoice
                                <ArrowUpRight size={13} />
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* ── SCROLLABLE CONTENT ── */}
            <div className="flex-1 overflow-y-auto">
                <div className="w-full mx-auto px-6 py-6 space-y-6">

                    {/* ── HERO BANNER RIBBON ── */}
                    <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-100/30 blur-[80px] pointer-events-none" />
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                                    <BadgeDollarSign size={28} />
                                </div>
                                <div className="flex flex-col justify-center items-start mt-2">
                                    <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400 block mb-1">
                                        Refund Transaction
                                    </span>
                                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                                        ₹{moneyIN(details.refundAmount)}
                                    </h2>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Refund Status</span>
                                    {refundStatusBadge(details.refundStatus)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── TABS ── */}
                    <div className="flex items-center gap-2 flex-wrap border-b border-slate-200 pb-2">
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={cls(
                                    "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[13px] font-bold transition-all active:scale-95 shadow-sm cursor-pointer",
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
                            {/* Refund Details */}
                            <SectionCard icon={<History size={15} />} title="Refund Transaction Details">
                                <InfoRow label="Refund Status" value={formatEnum(details.refundStatus)} />
                                <InfoRow label="Razorpay Refund ID" value={details.razorpayRefundId} mono />
                                <InfoRow label="Refund Amount" value={`₹${moneyIN(details.refundAmount)}`} />
                                <InfoRow label="Requested At" value={formatDateTime(details.refundRequestedAt)} />
                                <InfoRow label="Completed At" value={formatDateTime(details.refundCompletedAt)} />
                                <InfoRow label="Retry Count" value={details.refundRetryCount ?? 0} />
                                <InfoRow label="Updated At" value={formatDateTime(details.updatedAt)} />

                                {details.refundStatus === "REFUND_FAILED" && (
                                    <div className="mt-4 bg-rose-50 border border-rose-100 rounded-2xl p-4 text-rose-800 flex gap-3">
                                        <AlertTriangle size={18} className="text-rose-500 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-extrabold text-xs">Refund Gateway Rejection Reason</p>
                                            <p className="text-[12px] leading-relaxed mt-1 text-rose-700">
                                                {details.refundFailureReason || "Billing gateway declined settlement or reference payment account has expired."}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </SectionCard>

                            {/* Original Payment Details */}
                            <SectionCard icon={<CreditCard size={15} />} title="Original Payment Details">
                                {/* <InfoRow label="Payment ID" value={details.id} mono /> */}
                                <InfoRow label="Razorpay Payment ID" value={details.razorpayPaymentId} mono />
                                <InfoRow label="Razorpay Order ID" value={details.razorpayOrderId} mono />
                                <InfoRow label="Amount Paid" value={`₹${moneyIN(details.amount)}`} />
                                <InfoRow label="Currency" value={details.currency || "INR"} />
                                <InfoRow label="Payment Status" value={formatEnum(details.paymentStatus)} />
                                <InfoRow label="Payment Method" value={details.paymentMethod || "Razorpay"} />
                                <InfoRow label="Paid At" value={formatDateTime(details.paidAt)} />
                                <InfoRow label="Invoice ID" value={details.invoiceId} mono />

                                {details.failureReason && (
                                    <div className="mt-4 bg-rose-50 border border-rose-100 rounded-2xl p-4 text-rose-800 flex gap-3">
                                        <XCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-extrabold text-xs">Original Payment Failure Logs</p>
                                            <p className="text-[12px] leading-relaxed mt-1 text-rose-700">
                                                [{details.failureCode || "UNKNOWN"}]: {details.failureReason}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </SectionCard>
                        </div>
                    )}

                    {activeTab === "inspection" && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Vehicle details */}
                            {vehicle.makerName ? (
                                <SectionCard icon={<Car size={15} />} title="Vehicle Details">
                                    <InfoRow label="Maker / Brand" value={vehicle.makerName} />
                                    <InfoRow label="Model" value={vehicle.modelName} />
                                    <InfoRow label="Variant" value={vehicle.variantName} />
                                    <InfoRow label="Year of Mfg" value={vehicle.yearOfMfg} />
                                    <InfoRow label="Vehicle Type" value={formatEnum(vehicle.vehicleType)} />
                                    <InfoRow label="Sub Type" value={formatEnum(vehicle.vehicleSubType)} />
                                    <InfoRow label="Transmission" value={formatEnum(vehicle.transmissionType)} />
                                    <InfoRow label="Fuel Type" value={formatEnum(vehicle.fuelType)} />
                                    <InfoRow label="KM Driven" value={vehicle.kmDriven ? `${vehicle.kmDriven.toLocaleString()} KM` : "—"} />
                                    <InfoRow label="Ownership" value={vehicle.ownership ? `${vehicle.ownership} Owner` : "—"} />
                                    <InfoRow label="Asking Price" value={vehicle.price ? `₹${vehicle.price.toLocaleString()}` : "—"} />
                                    <InfoRow label="Verification" value={formatEnum(vehicle.verificationStatus)} />
                                    <InfoRow label="Inspection" value={formatEnum(vehicle.inspectionStatus)} />
                                </SectionCard>
                            ) : (
                                <SectionCard icon={<Car size={15} />} title="Vehicle Details">
                                    <div className="py-12 text-center text-slate-400 font-semibold text-xs">
                                        No linked vehicle specification logs found.
                                    </div>
                                </SectionCard>
                            )}

                            {/* Inspection request details */}
                            {inspection.id ? (
                                <SectionCard icon={<ClipboardList size={15} />} title="Inspection Request Details">
                                    {/* <InfoRow label="Request ID" value={inspection.id} mono /> */}
                                    <InfoRow label="Inspection Type" value={formatEnum(inspection.inspectionType)} />
                                    <InfoRow label="Requester Type" value={formatEnum(inspection.requesterType)} />
                                    <InfoRow label="WhatsApp No" value={inspection.whatsappNumber} />
                                    <InfoRow label="Video Scheduled At" value={formatDateTime(inspection.videoCallScheduledAt)} />
                                    <InfoRow label="Completed At" value={formatDateTime(inspection.inspectionCompletedAt)} />
                                    <InfoRow label="Request Status" value={formatEnum(inspection.inspectionRequestStatus)} />
                                    <InfoRow label="Process Completed" value={inspection.isProcessCompleted ? "Yes" : "No"} />
                                    <InfoRow label="Created At" value={formatDateTime(inspection.createdAt)} />
                                </SectionCard>
                            ) : (
                                <SectionCard icon={<ClipboardList size={15} />} title="Inspection Request Details">
                                    <div className="py-12 text-center text-slate-400 font-semibold text-xs">
                                        No linked inspection request logs found.
                                    </div>
                                </SectionCard>
                            )}
                        </div>
                    )}

                    {activeTab === "user" && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Payer User Master */}
                            {user.id ? (
                                <SectionCard icon={<User size={15} />} title="Payer Profile Details">
                                    {/* <InfoRow label="User ID" value={user.id} mono /> */}
                                    <InfoRow label="Full Name" value={user.fullName || `${user.firstname || ""} ${user.lastname || ""}`} />
                                    <InfoRow label="Email Address" value={user.email} />
                                    <InfoRow label="Phone Number" value={user.phoneNumber ? `${user.countryCode || ""} ${user.phoneNumber}` : "—"} />
                                    <InfoRow label="User Role" value={formatEnum(user.userRole)} />
                                    <InfoRow label="Account Status" value={formatEnum(user.status)} />
                                    <InfoRow label="Verification Status" value={formatEnum(user.verificationStatus)} />
                                    <InfoRow label="Registered On" value={formatDateTime(user.createdAt)} />
                                </SectionCard>
                            ) : (
                                <SectionCard icon={<User size={15} />} title="Payer Profile Details">
                                    <div className="py-12 text-center text-slate-400 font-semibold text-xs">
                                        No dealer/payer profile mapped.
                                    </div>
                                </SectionCard>
                            )}

                            {/* Assigned Inspector Profile */}
                            {inspector.id ? (
                                <SectionCard icon={<ShieldCheck size={15} />} title="Assigned Inspector Details">
                                    <InfoRow label="Inspector ID" value={inspector.id} mono />
                                    <InfoRow label="Username" value={inspector.inspectorUsername} mono />
                                    <InfoRow label="Full Name" value={`${inspector.firstname || ""} ${inspector.lastname || ""}`} />
                                    <InfoRow label="Email Address" value={inspector.email} />
                                    <InfoRow label="Contact No" value={inspector.contactNumber} />
                                    <InfoRow label="UPI ID" value={inspector.upiId} mono />
                                    <InfoRow label="City / State" value={`${inspector.cityName || ""} / ${inspector.stateName || ""}`} />
                                    <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
                                        <DocPhotoCard label="DL Front" imageUrl={inspector.drivingLicenseFrontUrl} onPreview={openPreview} />
                                        <DocPhotoCard label="DL Back" imageUrl={inspector.drivingLicenseBackUrl} onPreview={openPreview} />
                                    </div>
                                </SectionCard>
                            ) : (
                                <SectionCard icon={<ShieldCheck size={15} />} title="Assigned Inspector Details">
                                    <div className="py-12 text-center text-slate-400 font-semibold text-xs">
                                        No inspector was assigned for this request.
                                    </div>
                                </SectionCard>
                            )}
                        </div>
                    )}

                </div>
            </div>

            {preview.open && (
                <ImagePreviewModal imageUrl={preview.url} title={preview.title} onClose={closePreview} />
            )}
        </div>
    );
};

export default InspectionRefundDetail;
