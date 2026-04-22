import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Building2,
    MapPin,
    FileText,
    Loader2,
    RefreshCw,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    X,
    Eye,
    RotateCcw,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import api from "../../../api/axios";

const cls = (...a) => a.filter(Boolean).join(" ");

/* =========================================================
   API FUNCTION
========================================================= */
const getConsultationUpdateDetails = async (updateId) => {
    const res = await api.get(`/consultation/update-requests/${updateId}`);
    return res.data;
};

const rejectConsultationUpdate = async (consultationUpdateId, reason) => {
    const res = await api.patch(`/consultation/update-requests/reject`, {
        consultationUpdateId,
        reason,
    });
    return res.data;
};

const requestChangeConsultationUpdate = async (consultationUpdateId, reason) => {
    const res = await api.patch(`/consultation/update-requests/request-change`, {
        consultationUpdateId,
        reason,
    });
    return res.data;
};

const approveConsultationUpdate = async (consultationUpdateId, reason = "") => {
    const res = await api.patch(`/consultation/update-requests/approve`, {
        consultationUpdateId,
        reason,
    });
    return res.data;
};

/* =========================================================
   HELPER FUNCTIONS
========================================================= */
const safeValue = (value, fallback = "-") => {
    if (value === null || value === undefined || value === "") return fallback;
    return value;
};

const hasChanged = (original, updated) => {
    if (original === updated) return false;
    if (!original && !updated) return false;
    if (!original && updated) return true;
    if (original && !updated) return true;
    return String(original) !== String(updated);
};

/* =========================================================
   FIELD COMPONENT
========================================================= */
function ComparisonField({ label, originalValue, updatedValue, isImage = false }) {
    const [imageModal, setImageModal] = useState(null);
    const changed = hasChanged(originalValue, updatedValue);
    const displayOriginal = safeValue(originalValue);
    const displayUpdated = safeValue(updatedValue);

    if (isImage) {
        return (
            <>
                {/* Image Modal */}
                {imageModal && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                        onClick={() => setImageModal(null)}
                    >
                        <div className="relative max-h-[90vh] max-w-[90vw]">
                            <button
                                onClick={() => setImageModal(null)}
                                className="absolute -right-4 -top-4 rounded-full bg-white p-2 shadow-lg hover:bg-slate-100"
                            >
                                <X className="h-5 w-5 text-slate-900" />
                            </button>
                            <img
                                src={imageModal}
                                alt={label}
                                className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {label}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Original */}
                        <div className={cls(
                            "rounded-xl border-2 p-3",
                            changed ? "border-emerald-200 bg-emerald-50/30" : "border-slate-200 bg-slate-50"
                        )}>
                            <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Original
                            </div>
                            {displayOriginal !== "-" ? (
                                <div className="group relative cursor-pointer" onClick={() => setImageModal(displayOriginal)}>
                                    <img
                                        src={displayOriginal}
                                        alt={label}
                                        className="h-32 w-full rounded-lg object-cover transition-all group-hover:brightness-75"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                                        <div className="rounded-full bg-white/90 p-2 shadow-lg">
                                            <Eye className="h-5 w-5 text-slate-900" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex h-32 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                                    No image
                                </div>
                            )}
                        </div>

                        {/* Updated */}
                        <div className={cls(
                            "rounded-xl border-2 p-3",
                            changed ? "border-rose-200 bg-rose-50/30" : "border-slate-200 bg-slate-50"
                        )}>
                            <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Updated
                            </div>
                            {displayUpdated !== "-" ? (
                                <div className="group relative cursor-pointer" onClick={() => setImageModal(displayUpdated)}>
                                    <img
                                        src={displayUpdated}
                                        alt={label}
                                        className="h-32 w-full rounded-lg object-cover transition-all group-hover:brightness-75"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                                        <div className="rounded-full bg-white/90 p-2 shadow-lg">
                                            <Eye className="h-5 w-5 text-slate-900" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex h-32 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                                    No image
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {label}
            </div>
            <div className="grid grid-cols-2 gap-4">
                {/* Original */}
                <div className={cls(
                    "rounded-xl border-2 px-4 py-3",
                    changed ? "border-emerald-200 bg-emerald-50/30" : "border-slate-200 bg-slate-50"
                )}>
                    <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Original
                    </div>
                    <div className={cls(
                        "text-sm font-semibold break-words",
                        changed ? "text-emerald-900" : "text-slate-900"
                    )}>
                        {displayOriginal}
                    </div>
                </div>

                {/* Updated */}
                <div className={cls(
                    "rounded-xl border-2 px-4 py-3",
                    changed ? "border-rose-200 bg-rose-50/30" : "border-slate-200 bg-slate-50"
                )}>
                    <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Updated
                    </div>
                    <div className={cls(
                        "text-sm font-semibold break-words",
                        changed ? "text-rose-900" : "text-slate-900"
                    )}>
                        {displayUpdated}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */
const ConsultUpdateDetail = () => {
    const navigate = useNavigate();
    const { updateId } = useParams();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [data, setData] = useState(null);
    const [activeTab, setActiveTab] = useState("consultation");

    // Modal states
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showRequestChangeModal, setShowRequestChangeModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [selectedReason, setSelectedReason] = useState("");
    const [customReason, setCustomReason] = useState("");
    const [approveRemark, setApproveRemark] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const reasonOptions = [
        "Incomplete documents",
        "Invalid documents",
        "Document mismatch",
        "Expired documents",
        "Fraudulent information",
        "Policy violation",
        "Other",
    ];

    const fetchDetails = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await getConsultationUpdateDetails(updateId);
            setData(res?.data || null);
        } catch (e) {
            console.error(e);
            setError(
                e?.response?.data?.message ||
                e?.message ||
                "Failed to load update details"
            );
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        const finalReason = selectedReason === "Other" ? customReason : selectedReason;

        if (!finalReason.trim()) {
            toast.error("Please provide a reason for rejection");
            return;
        }

        try {
            setSubmitting(true);
            await rejectConsultationUpdate(updateId, finalReason);
            toast.success("Update request rejected successfully");
            setShowRejectModal(false);
            setTimeout(() => navigate(-1), 1500);
        } catch (e) {
            console.error(e);
            toast.error(
                e?.response?.data?.message ||
                e?.message ||
                "Failed to reject update request"
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleRequestChange = async () => {
        if (!customReason.trim()) {
            toast.error("Please provide a remark for requesting changes");
            return;
        }

        try {
            setSubmitting(true);
            await requestChangeConsultationUpdate(updateId, customReason);
            toast.success("Change request sent successfully");
            setShowRequestChangeModal(false);
            setTimeout(() => navigate(-1), 1500);
        } catch (e) {
            console.error(e);
            toast.error(
                e?.response?.data?.message ||
                e?.message ||
                "Failed to request changes"
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleApprove = async () => {
        try {
            setSubmitting(true);
            await approveConsultationUpdate(updateId, approveRemark);
            toast.success("Update request approved successfully");
            setShowApproveModal(false);
            setTimeout(() => navigate(-1), 1500);
        } catch (e) {
            console.error(e);
            toast.error(
                e?.response?.data?.message ||
                e?.message ||
                "Failed to approve update request"
            );
        } finally {
            setSubmitting(false);
        }
    };

    const openApproveModal = () => {
        setApproveRemark("");
        setShowApproveModal(true);
    };

    const openRejectModal = () => {
        setSelectedReason("");
        setCustomReason("");
        setShowRejectModal(true);
    };

    const openRequestChangeModal = () => {
        setCustomReason("");
        setShowRequestChangeModal(true);
    };

    useEffect(() => {
        if (updateId) {
            fetchDetails();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <div className="mx-auto max-w-[1600px] px-4 py-8 md:px-6">
                    <div className="rounded-[32px] border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
                        <div className="inline-flex items-center gap-3 text-sm font-semibold text-slate-800">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Loading update details...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-slate-50">
                <div className="mx-auto max-w-[1600px] px-4 py-8 md:px-6">
                    <div className="mb-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </button>
                    </div>

                    <div className="rounded-[32px] border border-rose-200 bg-rose-50 px-6 py-14 text-center shadow-sm">
                        <div className="text-lg font-semibold text-rose-800">
                            {error || "Update details not found"}
                        </div>
                        <button
                            onClick={fetchDetails}
                            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const original = data?.original || {};
    const update = data?.update || {};

    return (
        <div className="min-h-screen bg-slate-50">
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        borderRadius: "14px",
                        border: "1px solid #e2e8f0",
                        background: "#fff",
                        color: "#0f172a",
                        boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
                        fontSize: "13px",
                        fontWeight: 600,
                    },
                }}
            />

            {/* Approve Modal */}
            {showApproveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-2xl rounded-[28px] bg-white p-8 shadow-2xl">
                        {/* Header */}
                        <div className="mb-6 flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="rounded-2xl bg-emerald-100 p-3">
                                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">Approve KYC</h2>
                                    <p className="text-sm text-slate-500">
                                        {data?.update?.consultation?.consultationName || "Consultation"}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowApproveModal(false)}
                                className="rounded-xl p-2 hover:bg-slate-100"
                            >
                                <X className="h-5 w-5 text-slate-500" />
                            </button>
                        </div>

                        {/* Info */}
                        <div className="mb-6 rounded-2xl bg-emerald-50 p-4">
                            <p className="text-sm font-semibold text-emerald-800">
                                KYC will be approved. Consultant will be able to list vehicles immediately.
                            </p>
                        </div>

                        {/* Remark Textarea */}
                        <div className="mb-6">
                            <label className="mb-2 block text-sm font-bold text-slate-700">
                                Remark <span className="text-slate-400">(Optional)</span>
                            </label>
                            <textarea
                                value={approveRemark}
                                onChange={(e) => setApproveRemark(e.target.value)}
                                placeholder="Enter remark for approving KYC..."
                                rows={5}
                                className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={() => setShowApproveModal(false)}
                                disabled={submitting}
                                className="rounded-xl border-2 border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleApprove}
                                disabled={submitting}
                                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 disabled:opacity-50"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Approving...
                                    </>
                                ) : (
                                    "Approve KYC"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-2xl rounded-[28px] bg-white p-8 shadow-2xl">
                        {/* Header */}
                        <div className="mb-6 flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="rounded-2xl bg-rose-100 p-3">
                                    <XCircle className="h-6 w-6 text-rose-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">Reject KYC</h2>
                                    <p className="text-sm text-slate-500">
                                        {data?.update?.consultation?.consultationName || "Consultation"}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowRejectModal(false)}
                                className="rounded-xl p-2 hover:bg-slate-100"
                            >
                                <X className="h-5 w-5 text-slate-500" />
                            </button>
                        </div>

                        {/* Warning */}
                        <div className="mb-6 rounded-2xl bg-rose-50 p-4">
                            <p className="text-sm font-semibold text-rose-800">
                                KYC will be rejected. Consultant will be notified with the rejection reason.
                            </p>
                        </div>

                        {/* Reason Dropdown */}
                        <div className="mb-4">
                            <label className="mb-2 block text-sm font-bold text-slate-700">
                                Reason
                            </label>
                            <select
                                value={selectedReason}
                                onChange={(e) => setSelectedReason(e.target.value)}
                                className="w-full rounded-xl border-2 border-rose-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 focus:border-rose-500 focus:outline-none"
                            >
                                <option value="">Select a reason...</option>
                                {reasonOptions.map((reason) => (
                                    <option key={reason} value={reason}>
                                        {reason}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Custom Reason Textarea */}
                        {selectedReason === "Other" && (
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Reason <span className="text-rose-600">*</span>
                                </label>
                                <textarea
                                    value={customReason}
                                    onChange={(e) => setCustomReason(e.target.value)}
                                    placeholder="Enter the rejection reason..."
                                    rows={5}
                                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-rose-500 focus:outline-none"
                                />
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={() => setShowRejectModal(false)}
                                disabled={submitting}
                                className="rounded-xl border-2 border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={submitting || !selectedReason}
                                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-600/20 hover:bg-rose-700 disabled:opacity-50"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Rejecting...
                                    </>
                                ) : (
                                    "Confirm Rejection"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Request Change Modal */}
            {showRequestChangeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-2xl rounded-[28px] bg-white p-8 shadow-2xl">
                        {/* Header */}
                        <div className="mb-6 flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="rounded-2xl bg-amber-100 p-3">
                                    <RotateCcw className="h-6 w-6 text-amber-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">Request KYC Re-upload</h2>
                                    <p className="text-sm text-slate-500">
                                        {data?.update?.consultation?.consultationName || "Consultation"}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowRequestChangeModal(false)}
                                className="rounded-xl p-2 hover:bg-slate-100"
                            >
                                <X className="h-5 w-5 text-slate-500" />
                            </button>
                        </div>

                        {/* Warning */}
                        <div className="mb-6 rounded-2xl bg-amber-50 p-4">
                            <p className="text-sm font-semibold text-amber-800">
                                Consultant will be notified to re-upload KYC documents with your remarks.
                            </p>
                        </div>

                        {/* Remark Textarea */}
                        <div className="mb-6">
                            <label className="mb-2 block text-sm font-bold text-slate-700">
                                Remark <span className="text-amber-600">*</span>
                            </label>
                            <textarea
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                placeholder="Enter remark for requesting re-upload..."
                                rows={5}
                                className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={() => setShowRequestChangeModal(false)}
                                disabled={submitting}
                                className="rounded-xl border-2 border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRequestChange}
                                disabled={submitting || !customReason.trim()}
                                className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-600/20 hover:bg-amber-700 disabled:opacity-50"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Requesting...
                                    </>
                                ) : (
                                    "Request Re-upload"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-6">
                {/* Header */}
                <div className="mb-5 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </button>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={openApproveModal}
                            disabled={submitting}
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            Approve
                        </button>

                        <button
                            onClick={openRejectModal}
                            disabled={submitting}
                            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-600/20 transition-all hover:bg-rose-700 active:scale-95 disabled:opacity-50"
                        >
                            <XCircle className="h-4 w-4" />
                            Reject
                        </button>

                        <button
                            onClick={openRequestChangeModal}
                            disabled={submitting}
                            className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-600/20 transition-all hover:bg-amber-700 active:scale-95 disabled:opacity-50"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Request Changes
                        </button>
                    </div>
                </div>

                {/* Title */}
                <div className="mb-6">
                    <h1 className="text-[32px] font-extrabold tracking-tight text-slate-900">
                        Update Request Details
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Review and compare original vs updated consultation information
                    </p>
                </div>

                {/* Legend */}
                <div className="mb-6 flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                        <span className="text-xs font-semibold text-slate-600">Original Data</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-rose-500"></div>
                        <span className="text-xs font-semibold text-slate-600">Updated Data</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6 flex items-center gap-3">
                    <button
                        onClick={() => setActiveTab("consultation")}
                        className={cls(
                            "inline-flex items-center gap-2 rounded-[10px] px-6 py-3 text-sm font-bold transition-all",
                            activeTab === "consultation"
                                ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                                : "bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300"
                        )}
                    >
                        <Building2 className="h-4 w-4" />
                        Consultation Details
                    </button>

                    <button
                        onClick={() => setActiveTab("address")}
                        className={cls(
                            "inline-flex items-center gap-2 rounded-[10px] px-6 py-3 text-sm font-bold transition-all",
                            activeTab === "address"
                                ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                                : "bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300"
                        )}
                    >
                        <MapPin className="h-4 w-4" />
                        Address Details
                    </button>

                    <button
                        onClick={() => setActiveTab("document")}
                        className={cls(
                            "inline-flex items-center gap-2 rounded-[10px] px-6 py-3 text-sm font-bold transition-all",
                            activeTab === "document"
                                ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                                : "bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300"
                        )}
                    >
                        <FileText className="h-4 w-4" />
                        Document Details
                    </button>
                </div>

                {/* Content */}
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    {activeTab === "consultation" && (
                        <div className="space-y-6">
                            <ComparisonField
                                label="Consultation Name"
                                originalValue={original?.consultation?.consultationName}
                                updatedValue={update?.consultation?.consultationName}
                            />

                            <ComparisonField
                                label="Username"
                                originalValue={original?.consultation?.username}
                                updatedValue={update?.consultation?.username}
                            />

                            <ComparisonField
                                label="Owner Name"
                                originalValue={original?.consultation?.ownerName}
                                updatedValue={update?.consultation?.ownerName}
                            />

                            <ComparisonField
                                label="Company Email"
                                originalValue={original?.consultation?.companyEmail}
                                updatedValue={update?.consultation?.companyEmail}
                            />

                            <ComparisonField
                                label="Establishment Year"
                                originalValue={original?.consultation?.establishmentYear}
                                updatedValue={update?.consultation?.establishmentYear}
                            />

                            <ComparisonField
                                label="Verification Status"
                                originalValue={original?.consultation?.verificationStatus}
                                updatedValue={update?.consultation?.verificationStatus}
                            />

                            <ComparisonField
                                label="Admin Remark"
                                originalValue={original?.consultation?.adminRemark}
                                updatedValue={update?.consultation?.adminRemark}
                            />

                            <ComparisonField
                                label="Logo"
                                originalValue={original?.consultation?.logoUrl}
                                updatedValue={update?.consultation?.logoUrl}
                                isImage
                            />

                            <ComparisonField
                                label="Banner"
                                originalValue={original?.consultation?.bannerUrl}
                                updatedValue={update?.consultation?.bannerUrl}
                                isImage
                            />
                        </div>
                    )}

                    {activeTab === "address" && (
                        <div className="space-y-6">
                            {!original?.address && !update?.address ? (
                                <div className="py-20 text-center">
                                    <div className="text-base font-semibold text-slate-900">No address data available</div>
                                    <div className="mt-1 text-sm text-slate-500">Address information has not been provided</div>
                                </div>
                            ) : (
                                <>
                                    <ComparisonField
                                        label="Address"
                                        originalValue={original?.address?.address}
                                        updatedValue={update?.address?.address}
                                    />

                                    <ComparisonField
                                        label="City"
                                        originalValue={original?.address?.cityName}
                                        updatedValue={update?.address?.cityName}
                                    />

                                    <ComparisonField
                                        label="State"
                                        originalValue={original?.address?.stateName}
                                        updatedValue={update?.address?.stateName}
                                    />

                                    <ComparisonField
                                        label="Country"
                                        originalValue={original?.address?.countryName}
                                        updatedValue={update?.address?.countryName}
                                    />

                                    <ComparisonField
                                        label="Latitude"
                                        originalValue={original?.address?.latitude}
                                        updatedValue={update?.address?.latitude}
                                    />

                                    <ComparisonField
                                        label="Longitude"
                                        originalValue={original?.address?.longitude}
                                        updatedValue={update?.address?.longitude}
                                    />

                                    <ComparisonField
                                        label="Map URL"
                                        originalValue={original?.address?.mapUrl}
                                        updatedValue={update?.address?.mapUrl}
                                    />
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === "document" && (
                        <div className="space-y-6">
                            {!original?.document && !update?.document ? (
                                <div className="py-20 text-center">
                                    <div className="text-base font-semibold text-slate-900">No document data available</div>
                                    <div className="mt-1 text-sm text-slate-500">Document information has not been provided</div>
                                </div>
                            ) : (
                                <>
                                    <ComparisonField
                                        label="GST Number"
                                        originalValue={original?.document?.gstNumber}
                                        updatedValue={update?.document?.gstNumber}
                                    />

                                    <ComparisonField
                                        label="PAN Card Number"
                                        originalValue={original?.document?.panCardNumber}
                                        updatedValue={update?.document?.panCardNumber}
                                    />

                                    <ComparisonField
                                        label="Aadhar Card Number"
                                        originalValue={original?.document?.aadharCardNumber}
                                        updatedValue={update?.document?.aadharCardNumber}
                                    />

                                    <ComparisonField
                                        label="GST Certificate"
                                        originalValue={original?.document?.gstCertificateUrl}
                                        updatedValue={update?.document?.gstCertificateUrl}
                                        isImage
                                    />

                                    <ComparisonField
                                        label="PAN Card Front"
                                        originalValue={original?.document?.panCardFrontUrl}
                                        updatedValue={update?.document?.panCardFrontUrl}
                                        isImage
                                    />

                                    <ComparisonField
                                        label="Aadhar Card Front"
                                        originalValue={original?.document?.aadharCardFrontUrl}
                                        updatedValue={update?.document?.aadharCardFrontUrl}
                                        isImage
                                    />

                                    <ComparisonField
                                        label="Aadhar Card Back"
                                        originalValue={original?.document?.aadharCardBackUrl}
                                        updatedValue={update?.document?.aadharCardBackUrl}
                                        isImage
                                    />
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConsultUpdateDetail;
