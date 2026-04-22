import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
    Search,
    RefreshCw,
    MoreHorizontal,
    Eye,
    X,
    User,
    ChevronLeft,
    ChevronRight,
    ShieldAlert,
    Clock3,
    BadgeCheck,
    CheckCircle2,
    XCircle,
    RotateCcw,
    SlidersHorizontal,
    MapPin,
    ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
    filterConsultations,
    mapConsultationToRow,
    getConsultationKpi,
    approveKYCConsultation,
    rejectKYCConsultation,
    requestUploadKYCConsultation,
} from "../../../api/consultationApi";
import { getTierPlans } from "../../../api/tierPlan.api";
import { getStates, getAllCitiesFromSearch, getCities } from "../../../api/addressApi";

/* =========================================================
   HELPERS
========================================================= */
const cls = (...a) => a.filter(Boolean).join(" ");

const safeErrorMessage = (err) => {
    if (err?.response?.data?.message) return err.response.data.message;
    if (err?.response?.data?.error) return err.response.data.error;
    if (err?.message?.toLowerCase().includes("network")) {
        return "Network error. Please check your internet connection.";
    }
    if (err?.code === "ERR_NETWORK") {
        return "Network error. Please check your internet connection.";
    }
    return "Something went wrong while loading request changes.";
};

/* =========================================================
   ENUMS
========================================================= */
const STATUS_OPTIONS = ["ACTIVE", "INACTIVE", "DELETED"];
const DEFAULT_COUNTRY_ID = "101";

const fmtInt = (v) => (Number.isFinite(Number(v)) ? Math.round(Number(v)) : 0);

const fmtHours = (v) => {
    const minutes = Number(v);
    if (!Number.isFinite(minutes) || minutes <= 0) return "N/A";

    // Convert minutes to different time units
    const minutesInHour = 60;
    const minutesInDay = 60 * 24;
    const minutesInMonth = 60 * 24 * 30; // Approximate
    const minutesInYear = 60 * 24 * 365; // Approximate

    if (minutes < minutesInHour) {
        // Less than 1 hour - show minutes
        return `${Math.round(minutes)}m`;
    } else if (minutes < minutesInDay) {
        // Less than 1 day - show hours and minutes
        const hours = Math.floor(minutes / minutesInHour);
        const mins = Math.round(minutes % minutesInHour);
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    } else if (minutes < minutesInMonth) {
        // Less than 1 month - show days and hours
        const days = Math.floor(minutes / minutesInDay);
        const hours = Math.round((minutes % minutesInDay) / minutesInHour);
        return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
    } else if (minutes < minutesInYear) {
        // Less than 1 year - show months and days
        const months = Math.floor(minutes / minutesInMonth);
        const days = Math.round((minutes % minutesInMonth) / minutesInDay);
        return days > 0 ? `${months}mo ${days}d` : `${months}mo`;
    } else {
        // 1 year or more - show years and months
        const years = Math.floor(minutes / minutesInYear);
        const months = Math.round((minutes % minutesInYear) / minutesInMonth);
        return months > 0 ? `${years}y ${months}mo` : `${years}y`;
    }
};

const fmtPct = (v) =>
    Number.isFinite(Number(v))
        ? `${Number(v).toFixed(1).replace(".0", "")}%`
        : "0%";

/* =========================================================
   BADGES
========================================================= */
const statusBadge = (status) => {
    const s = String(status || "").toUpperCase();

    const map = {
        ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
        INACTIVE: "bg-slate-100 text-slate-700 border-slate-200",
        DELETED: "bg-rose-50 text-rose-700 border-rose-200",

        REQUESTED: "bg-amber-50 text-amber-700 border-amber-200",
        REQUEST_CHANGES: "bg-orange-50 text-orange-700 border-orange-200",
        VERIFIED: "bg-emerald-50 text-emerald-700 border-emerald-200",
        REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
    };

    return map[s] || "bg-slate-50 text-slate-700 border-slate-200";
};

const tierBadge = (tierTitle) => {
    const t = String(tierTitle || "").toLowerCase();

    if (t.includes("premium")) {
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (t.includes("pro")) {
        return "bg-sky-50 text-sky-700 border-sky-200";
    }
    return "bg-slate-100 text-slate-700 border-slate-200";
};

/* =========================================================
   TOP CARDS
========================================================= */
function TopCard({ title, value, icon: Icon = User, valueClass = "" }) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-50/80 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative z-10 flex items-center justify-between gap-4">
                <div>
                    <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                        {title}
                    </div>
                    <div className={cls(
                        "text-4xl font-extrabold tracking-tight",
                        valueClass || "text-slate-900"
                    )}>
                        {value}
                    </div>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-100 bg-sky-50 text-sky-600 shadow-sm">
                    <Icon size={18} />
                </div>
            </div>
        </div>
    );
}

/* =========================================================
   ROW ACTIONS
========================================================= */
function RowActions({ item, onApprove, onReject, onRequestReupload }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClick = (e) => {
            if (!ref.current?.contains(e.target)) setOpen(false);
        };

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const go = (path) => {
        navigate(path);
        setOpen(false);
    };

    const handleAction = (action) => {
        setOpen(false);
        action();
    };

    return (
        <div className="relative inline-flex justify-end" ref={ref}>
            <button
                onClick={() => setOpen((p) => !p)}
                className="inline-flex cursor-pointer h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
                type="button"
            >
                <MoreHorizontal className="h-4 w-4" />
            </button>

            {open && (
                <div className="absolute right-0 top-11 z-30 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                    <button
                        onClick={() => go(`/admin/consultants/profile/${item.id}`)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-50"
                        type="button"
                    >
                        <Eye className="h-4 w-4 text-slate-500" />
                        View Profile
                    </button>

                    {/* <div className="my-1 border-t border-slate-100" /> */}

                    <button
                        onClick={() => handleAction(() => onApprove(item))}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
                        type="button"
                    >
                        <CheckCircle2 className="h-4 w-4" />
                        Approve KYC
                    </button>

                    <button
                        onClick={() => handleAction(() => onReject(item))}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-rose-700 transition-colors hover:bg-rose-50"
                        type="button"
                    >
                        <XCircle className="h-4 w-4" />
                        Reject KYC
                    </button>
                    {/*
                    <button
                        onClick={() => handleAction(() => onRequestReupload(item))}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-amber-700 transition-colors hover:bg-amber-50"
                        type="button"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Request Re-upload
                    </button> */}
                </div>
            )}
        </div>
    );
}

/* =========================================================
   PAGINATION
========================================================= */
function PaginationBar({ page, totalPages, totalCount, loading, onPageChange }) {
    if (totalPages <= 1) return null;

    return (
        <div className="mt-6 flex justify-end">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
                <span className="text-sm text-slate-500">{totalCount} total</span>

                <button
                    disabled={page <= 1 || loading}
                    onClick={() => onPageChange(page - 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 transition hover:bg-slate-200 disabled:opacity-40"
                    type="button"
                >
                    <ChevronLeft size={16} />
                </button>

                <span className="text-sm text-slate-500">
                    Page {page} of {totalPages}
                </span>

                <button
                    disabled={page >= totalPages || loading}
                    onClick={() => onPageChange(page + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 transition hover:bg-slate-200 disabled:opacity-40"
                    type="button"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}

/* =========================================================
   APPROVE KYC MODAL
========================================================= */
function ApproveKYCModal({ open, consultantName, remark, setRemark, loading, onClose, onConfirm }) {
    if (!open) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="fixed left-1/2 top-1/2 z-[111] w-[95%] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-zinc-200 bg-white shadow-2xl">
                <div className="flex items-start justify-between border-b border-zinc-100 px-6 py-5">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50">
                            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-zinc-900">Approve KYC</h3>
                            {consultantName && (
                                <p className="mt-1 text-sm text-zinc-500">{consultantName}</p>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-900"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-6 rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-3">
                        <p className="text-sm font-semibold text-emerald-800">
                            KYC will be approved. Consultant will be able to list vehicles immediately.
                        </p>
                    </div>

                    <div className="mb-6">
                        <label className="mb-2 block text-sm font-bold text-zinc-700">
                            Remark <span className="text-zinc-400">(Optional)</span>
                        </label>

                        <textarea
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                            rows={4}
                            placeholder="Enter remark for approving KYC..."
                            className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="rounded-xl border border-zinc-200 bg-white px-6 py-2.5 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Processing..." : "Approve KYC"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

/* =========================================================
   REJECT KYC MODAL
========================================================= */
function RejectKYCModal({
    open,
    consultantName,
    rejectionReason,
    setRejectionReason,
    rejectionReasonText,
    setRejectionReasonText,
    loading,
    onClose,
    onConfirm,
}) {
    if (!open) return null;

    const rejectionReasons = [
        "Incomplete documents",
        "Invalid documents",
        "Document mismatch",
        "Expired documents",
        "Fraudulent information",
        "Policy violation",
        "Other",
    ];

    return (
        <>
            <div
                className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="fixed left-1/2 top-1/2 z-[111] w-[95%] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-zinc-200 bg-white shadow-2xl">
                <div className="flex items-start justify-between border-b border-zinc-100 px-6 py-5">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50">
                            <XCircle className="h-6 w-6 text-rose-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-zinc-900">Reject KYC</h3>
                            {consultantName && (
                                <p className="mt-1 text-sm text-zinc-500">{consultantName}</p>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-900"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-6 rounded-2xl bg-rose-50 border border-rose-100 px-4 py-3">
                        <p className="text-sm font-semibold text-rose-800">
                            KYC will be rejected. Consultant will be notified with the rejection reason.
                        </p>
                    </div>

                    <div className="mb-6">
                        <label className="mb-2 block text-sm font-bold text-zinc-700">
                            Reason
                        </label>
                        <select
                            value={rejectionReason}
                            onChange={(e) => {
                                setRejectionReason(e.target.value);
                                if (e.target.value !== "Other") {
                                    setRejectionReasonText("");
                                }
                            }}
                            className="w-full appearance-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                        >
                            <option value="">Select a reason...</option>
                            {rejectionReasons.map((reason) => (
                                <option key={reason} value={reason}>
                                    {reason}
                                </option>
                            ))}
                        </select>
                    </div>

                    {rejectionReason === "Other" && (
                        <div className="mb-6">
                            <label className="mb-2 block text-sm font-bold text-zinc-700">
                                Reason <span className="text-rose-500">*</span>
                            </label>
                            <textarea
                                value={rejectionReasonText}
                                onChange={(e) => setRejectionReasonText(e.target.value)}
                                rows={4}
                                placeholder="Enter the rejection reason..."
                                className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                            />
                        </div>
                    )}

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="rounded-xl border border-zinc-200 bg-white px-6 py-2.5 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={onConfirm}
                            disabled={
                                loading ||
                                !rejectionReason ||
                                (rejectionReason === "Other" && !rejectionReasonText.trim())
                            }
                            className="rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Processing..." : "Confirm Rejection"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

/* =========================================================
   REQUEST RE-UPLOAD MODAL
========================================================= */
function RequestReuploadModal({
    open,
    consultantName,
    remark,
    setRemark,
    loading,
    onClose,
    onConfirm,
}) {
    if (!open) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="fixed left-1/2 top-1/2 z-[111] w-[95%] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-zinc-200 bg-white shadow-2xl">
                <div className="flex items-start justify-between border-b border-zinc-100 px-6 py-5">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50">
                            <RotateCcw className="h-6 w-6 text-amber-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-zinc-900">Request KYC Re-upload</h3>
                            {consultantName && (
                                <p className="mt-1 text-sm text-zinc-500">{consultantName}</p>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-900"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-6 rounded-2xl bg-amber-50 border border-amber-100 px-4 py-3">
                        <p className="text-sm font-semibold text-amber-800">
                            Consultant will be notified to re-upload KYC documents with your remarks.
                        </p>
                    </div>

                    <div className="mb-6">
                        <label className="mb-2 block text-sm font-bold text-zinc-700">
                            Remark <span className="text-amber-500">*</span>
                        </label>
                        <textarea
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                            rows={4}
                            placeholder="Enter remark for requesting re-upload..."
                            className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="rounded-xl border border-zinc-200 bg-white px-6 py-2.5 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={onConfirm}
                            disabled={loading || !remark.trim()}
                            className="rounded-xl bg-amber-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Processing..." : "Request Re-upload"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

/* =========================================================
   MAIN
========================================================= */
const RequestChangesConsult = () => {
    const didInit = useRef(false);
    const lastFetchKeyRef = useRef("");
    const searchDebounceRef = useRef(null);
    const citiesLoadedRef = useRef(false);
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [filtersOpen, setFiltersOpen] = useState(false);

    // Filter states
    const [tierPlans, setTierPlans] = useState([]);
    const [tierId, setTierId] = useState("ALL");
    const [draftTierId, setDraftTierId] = useState("ALL");
    const [tierLoaded, setTierLoaded] = useState(false);
    const [tierLoading, setTierLoading] = useState(false);

    const [countryId] = useState(DEFAULT_COUNTRY_ID);

    const [cities, setCities] = useState([]);
    const [citiesLoading, setCitiesLoading] = useState(false);
    const [cityId, setCityId] = useState("ALL");
    const [draftCityId, setDraftCityId] = useState("ALL");

    const [states, setStates] = useState([]);
    const [stateId, setStateId] = useState("ALL");
    const [draftStateId, setDraftStateId] = useState("ALL");
    const [statesLoadedFor, setStatesLoadedFor] = useState(null);
    const [statesLoading, setStatesLoading] = useState(false);

    const [status, setStatus] = useState("ALL");
    const [draftStatus, setDraftStatus] = useState("ALL");

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [kpiLoading, setKpiLoading] = useState(false);
    const [error, setError] = useState("");

    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [kpi, setKpi] = useState({
        totalPendingConsultations: 0,
        totalRequestedConsultations: 0,
        totalActiveConsultations: 0,
        totalUnderReviewConsultations: 0,
    });

    // KYC Action Modal States
    const [kycModal, setKycModal] = useState({ open: false, type: "", consultant: null });
    const [kycLoading, setKycLoading] = useState(false);
    const [approveRemark, setApproveRemark] = useState("");
    const [rejectReason, setRejectReason] = useState("");
    const [rejectReasonText, setRejectReasonText] = useState("");
    const [reuploadRemark, setReuploadRemark] = useState("");

    const loadKpi = useCallback(async () => {
        setKpiLoading(true);

        try {
            const res = await getConsultationKpi();
            const data = res?.data?.data || res?.data || {};

            setKpi({
                totalPendingConsultations: Number(data?.totalPendingConsultations ?? 0),
                totalRequestedConsultations: Number(data?.totalRequestedConsultations ?? 0),
                totalActiveConsultations: Number(data?.totalActiveConsultations ?? 0),
                totalUnderReviewConsultations: Number(
                    data?.totalUnderReviewConsultations ?? 0
                ),
            });
        } catch (e) {
            console.error("KPI load failed:", e);
            setKpi({
                totalPendingConsultations: 0,
                totalRequestedConsultations: 0,
                totalActiveConsultations: 0,
                totalUnderReviewConsultations: 0,
            });
        } finally {
            setKpiLoading(false);
        }
    }, []);

    const loadTiersOnce = useCallback(async () => {
        if (tierLoaded || tierLoading) return;

        setTierLoading(true);
        try {
            const res = await getTierPlans();
            const list =
                (Array.isArray(res?.data) && res.data) || (Array.isArray(res) && res) || [];

            setTierPlans(
                list
                    .map((p) => ({
                        id: p?.id ?? p?.tierPlanId ?? p?._id,
                        title: p?.title ?? p?.name ?? "Plan",
                    }))
                    .filter((x) => x.id != null)
            );
            setTierLoaded(true);
        } catch (e) {
            console.error(e);
            setTierPlans([]);
            setTierLoaded(true);
            toast.error("Failed to load tier plans");
        } finally {
            setTierLoading(false);
        }
    }, [tierLoaded, tierLoading]);

    const loadStatesForCountry = useCallback(
        async (cid) => {
            if (!cid || cid === "ALL") return;
            if (statesLoadedFor === cid || statesLoading) return;

            setStatesLoading(true);
            try {
                const res = await getStates(cid);
                const list =
                    (Array.isArray(res?.data) && res.data) || (Array.isArray(res) && res) || [];

                setStates(
                    list
                        .map((s) => ({
                            id: s?.id ?? s?.stateId ?? s?._id,
                            name: s?.name ?? s?.stateName ?? "State",
                        }))
                        .filter((x) => x.id != null)
                );
                setStatesLoadedFor(cid);
            } catch (e) {
                console.error(e);
                setStates([]);
                setStatesLoadedFor(cid);
                toast.error("Failed to load states");
            } finally {
                setStatesLoading(false);
            }
        },
        [statesLoadedFor, statesLoading]
    );

    const loadCitiesOnce = useCallback(async () => {
        if (citiesLoadedRef.current || citiesLoading) return;

        citiesLoadedRef.current = true;
        setCitiesLoading(true);
        try {
            const res = await getAllCitiesFromSearch("");
            const list =
                (Array.isArray(res?.data) && res.data) || (Array.isArray(res) && res) || [];

            setCities(
                list
                    .map((c) => ({
                        id: c?.cityId ?? c?.id ?? c?._id,
                        name: c?.cityName ?? c?.name ?? "City",
                    }))
                    .filter((x) => x.id != null)
            );
        } catch (e) {
            console.error(e);
            setCities([]);
            toast.error("Failed to load cities");
            citiesLoadedRef.current = false;
        } finally {
            setCitiesLoading(false);
        }
    }, [citiesLoading]);

    const loadCitiesByState = useCallback(async (stateId) => {
        if (!stateId || stateId === "ALL") {
            setCitiesLoading(true);
            try {
                const res = await getAllCitiesFromSearch("");
                const list =
                    (Array.isArray(res?.data) && res.data) || (Array.isArray(res) && res) || [];

                setCities(
                    list
                        .map((c) => ({
                            id: c?.cityId ?? c?.id ?? c?._id,
                            name: c?.cityName ?? c?.name ?? "City",
                        }))
                        .filter((x) => x.id != null)
                );
            } catch (e) {
                console.error(e);
                setCities([]);
                toast.error("Failed to load cities");
            } finally {
                setCitiesLoading(false);
            }
            return;
        }

        setCitiesLoading(true);
        try {
            const res = await getCities(stateId);
            const list =
                (Array.isArray(res?.data) && res.data) || (Array.isArray(res) && res) || [];

            const mappedCities = list
                .map((c) => ({
                    id: c?.cityId ?? c?.id ?? c?._id,
                    name: c?.cityName ?? c?.name ?? "City",
                }))
                .filter((x) => x.id != null);

            setCities(mappedCities);

            setDraftCityId((currentCityId) => {
                if (currentCityId && currentCityId !== "ALL") {
                    const cityExists = mappedCities.some(c => String(c.id) === String(currentCityId));
                    if (!cityExists) {
                        return "ALL";
                    }
                }
                return currentCityId;
            });
        } catch (e) {
            console.error(e);
            setCities([]);
            toast.error("Failed to load cities for selected state");
        } finally {
            setCitiesLoading(false);
        }
    }, []);

    const buildPayload = useCallback(
        ({
            nextPage = 1,
            nextSearch = "",
            nextTierId = "ALL",
            nextCityId = "ALL",
            nextStateId = "ALL",
            nextStatus = "ALL",
        }) => ({
            searchText: nextSearch?.trim() || null,
            tierId: nextTierId === "ALL" ? null : String(nextTierId),
            cityId: nextCityId === "ALL" ? null : String(nextCityId),
            stateId: nextStateId === "ALL" ? null : String(nextStateId),
            status: nextStatus === "ALL" ? null : nextStatus,
            verificationStatus: "REQUEST_CHANGES", // Filter by REQUEST_CHANGES for this page
            pageNo: nextPage,
            pageSize,
            sortBy: null,
            sortDirection: "DESC",
        }),
        []
    );

    const fetchList = useCallback(
        async ({
            nextPage = 1,
            nextSearch = "",
            nextTierId = "ALL",
            nextCityId = "ALL",
            nextStateId = "ALL",
            nextStatus = "ALL",
            silent = false,
            force = false,
        }) => {
            const payload = buildPayload({
                nextPage,
                nextSearch,
                nextTierId,
                nextCityId,
                nextStateId,
                nextStatus,
            });
            const requestKey = JSON.stringify(payload);

            if (!force && lastFetchKeyRef.current === requestKey) {
                return;
            }

            lastFetchKeyRef.current = requestKey;
            setLoading(true);
            setError("");

            try {
                const res = await filterConsultations(payload);

                const list = Array.isArray(res?.data) ? res.data : [];
                const mapped = list.map(mapConsultationToRow);

                setRows(mapped);

                const pr = res?.pageResponse || {};
                const serverTotal =
                    Number(pr?.totalElements ?? mapped.length) || mapped.length;
                const serverTotalPages =
                    Number(pr?.totalPages ?? Math.max(1, Math.ceil(serverTotal / pageSize))) || 1;
                const serverCurrentPage = Number(pr?.currentPage ?? nextPage) || nextPage;

                setTotalCount(serverTotal);
                setTotalPages(serverTotalPages);
                setPage(serverCurrentPage);
            } catch (e) {
                console.error(e);
                const message = safeErrorMessage(e);

                setError(message);
                setRows([]);
                setTotalCount(0);
                setTotalPages(1);
                setPage(1);

                if (!silent) toast.error(message);
            } finally {
                setLoading(false);
            }
        },
        [buildPayload]
    );

    const queryState = useMemo(
        () => ({
            nextPage: page,
            nextSearch: search,
            nextTierId: tierId,
            nextCityId: cityId,
            nextStateId: stateId,
            nextStatus: status,
        }),
        [page, search, tierId, cityId, stateId, status]
    );

    useEffect(() => {
        if (didInit.current) return;
        didInit.current = true;

        loadKpi();
        loadTiersOnce();
        loadStatesForCountry(countryId);
        loadCitiesOnce();

        fetchList({
            nextPage: 1,
            nextSearch: "",
            nextTierId: "ALL",
            nextCityId: "ALL",
            nextStateId: "ALL",
            nextStatus: "ALL",
            silent: false,
            force: true,
        });
    }, [countryId, fetchList, loadCitiesOnce, loadKpi, loadStatesForCountry, loadTiersOnce]);

    useEffect(() => {
        if (!didInit.current) return;

        if (searchDebounceRef.current) {
            clearTimeout(searchDebounceRef.current);
        }

        const isSearching = search.trim().length > 0;

        if (isSearching) {
            searchDebounceRef.current = setTimeout(() => {
                fetchList({
                    ...queryState,
                    silent: true,
                });
            }, 450);
        } else {
            fetchList({
                ...queryState,
                silent: true,
            });
        }

        return () => {
            if (searchDebounceRef.current) {
                clearTimeout(searchDebounceRef.current);
            }
        };
    }, [queryState, search, fetchList]);

    useEffect(() => {
        if (!didInit.current) return;
        // Reset page to 1 when search changes
        setPage(1);
    }, [search]);

    useEffect(() => {
        if (!filtersOpen) return;
        loadStatesForCountry(countryId);

        // Sync draft values with applied values when opening filter sidebar
        setDraftTierId(tierId);
        setDraftStateId(stateId);
        setDraftCityId(cityId);
        setDraftStatus(status);
    }, [filtersOpen, loadStatesForCountry, countryId, tierId, stateId, cityId, status]);

    // Load cities when state changes (but not on initial sync)
    useEffect(() => {
        if (!didInit.current) return;
        if (!filtersOpen) return; // Only load when filters are open

        loadCitiesByState(draftStateId);
    }, [draftStateId, loadCitiesByState, filtersOpen]);

    const applyFilters = () => {
        setTierId(draftTierId);
        setStateId(draftStateId);
        setCityId(draftCityId);
        setStatus(draftStatus);
        setFiltersOpen(false);
        setPage(1);
    };

    const clearAll = () => {
        lastFetchKeyRef.current = "";

        setSearch("");
        setTierId("ALL");
        setDraftTierId("ALL");
        setStateId("ALL");
        setDraftStateId("ALL");
        setCityId("ALL");
        setDraftCityId("ALL");
        setStatus("ALL");
        setDraftStatus("ALL");
        setFiltersOpen(false);
        setPage(1);

        fetchList({
            nextPage: 1,
            nextSearch: "",
            nextTierId: "ALL",
            nextCityId: "ALL",
            nextStateId: "ALL",
            nextStatus: "ALL",
            silent: true,
            force: true,
        });
    };

    const activeFilters =
        search ||
        tierId !== "ALL" ||
        stateId !== "ALL" ||
        cityId !== "ALL" ||
        status !== "ALL";

    const handleRefresh = async () => {
        lastFetchKeyRef.current = "";

        await Promise.all([
            loadKpi(),
            fetchList({
                nextPage: page,
                nextSearch: search,
                nextTierId: tierId,
                nextCityId: cityId,
                nextStateId: stateId,
                nextStatus: status,
                silent: false,
                force: true,
            }),
        ]);

        toast.success("Request changes refreshed");
    };

    const closeKycModal = () => {
        setKycModal({ open: false, type: "", consultant: null });
        setApproveRemark("");
        setRejectReason("");
        setRejectReasonText("");
        setReuploadRemark("");
    };

    const handleApproveKYC = async () => {
        try {
            const consultId = kycModal.consultant?.id;
            if (!consultId) {
                toast.error("Consultant ID not found");
                return;
            }

            setKycLoading(true);

            await approveKYCConsultation({
                consultId,
                remark: approveRemark.trim() || "KYC approved",
            });

            toast.success("KYC approved successfully");
            closeKycModal();
            await fetchList({ nextPage: page, nextSearch: search, nextTierId: tierId, nextCityId: cityId, nextStateId: stateId, nextStatus: status, silent: true, force: true });
            await loadKpi();
        } catch (e) {
            const message = safeErrorMessage(e);
            toast.error(message);
        } finally {
            setKycLoading(false);
        }
    };

    const handleRejectKYC = async () => {
        try {
            const consultId = kycModal.consultant?.id;
            if (!consultId) {
                toast.error("Consultant ID not found");
                return;
            }

            let finalReason = "";
            if (rejectReason === "Other") {
                if (!rejectReasonText.trim()) {
                    toast.error("Please enter a rejection reason");
                    return;
                }
                finalReason = rejectReasonText.trim();
            } else {
                if (!rejectReason) {
                    toast.error("Please select a rejection reason");
                    return;
                }
                finalReason = rejectReason;
            }

            setKycLoading(true);

            await rejectKYCConsultation({
                consultId,
                remark: finalReason,
            });

            toast.success("KYC rejected successfully");
            closeKycModal();
            await fetchList({ nextPage: page, nextSearch: search, nextTierId: tierId, nextCityId: cityId, nextStateId: stateId, nextStatus: status, silent: true, force: true });
            await loadKpi();
        } catch (e) {
            const message = safeErrorMessage(e);
            toast.error(message);
        } finally {
            setKycLoading(false);
        }
    };

    const handleRequestReupload = async () => {
        try {
            const consultId = kycModal.consultant?.id;
            if (!consultId) {
                toast.error("Consultant ID not found");
                return;
            }

            if (!reuploadRemark.trim()) {
                toast.error("Remark is required");
                return;
            }

            setKycLoading(true);

            await requestUploadKYCConsultation({
                consultId,
                remark: reuploadRemark.trim(),
            });

            toast.success("KYC re-upload requested successfully");
            closeKycModal();
            await fetchList({ nextPage: page, nextSearch: search, nextTierId: tierId, nextCityId: cityId, nextStateId: stateId, nextStatus: status, silent: true, force: true });
            await loadKpi();
        } catch (e) {
            const message = safeErrorMessage(e);
            toast.error(message);
        } finally {
            setKycLoading(false);
        }
    };

    const stats = useMemo(() => {
        return {
            total:
                kpi.totalPendingConsultations || totalCount || rows.length,
            requested:
                kpi.totalRequestedConsultations ||
                rows.filter(
                    (r) => String(r.verificationStatus || "").toUpperCase() === "REQUESTED"
                ).length,
            active:
                kpi.totalActiveConsultations ||
                rows.filter((r) => String(r.status || "").toUpperCase() === "ACTIVE").length,
            underReview:
                kpi.totalUnderReviewConsultations ||
                rows.filter((r) =>
                    ["REQUESTED", "REQUEST_CHANGES"].includes(
                        String(r.verificationStatus || "").toUpperCase()
                    )
                ).length,
        };
    }, [kpi, rows, totalCount]);

    return (
        <div className="h-screen flex flex-col overflow-hidden p-0">
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

            <style>{`
        .table-scroll::-webkit-scrollbar { height: 6px; width: 8px; }
        .table-scroll::-webkit-scrollbar-track { background: transparent; }
        .table-scroll::-webkit-scrollbar-thumb { background: rgba(148,163,184,0.35); border-radius: 6px; }
        .table-scroll::-webkit-scrollbar-thumb:hover { background: rgba(100,116,139,0.45); }
      `}</style>

            <div className="flex flex-1 flex-col space-y-4 overflow-hidden p-6">
                <section className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div>
                        <h1 className="mb-1 text-[32px] font-extrabold tracking-tight text-slate-900">
                            Request Changes
                        </h1>
                        {/* <p className="max-w-3xl text-sm leading-relaxed text-slate-500">
              Review consultants waiting for approval and manage their
              verification decisions from one place.
            </p> */}
                    </div>
                </section>

                <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <TopCard
                        title="Total Pending"
                        value={kpiLoading ? "..." : stats.total}
                        icon={Clock3}
                        valueClass="text-black-600"
                    />
                    <TopCard
                        title="Requested"
                        value={kpiLoading ? "..." : stats.requested}
                        icon={ShieldAlert}
                        valueClass="text-amber-600"
                    />
                    <TopCard
                        title="Active Profiles"
                        value={kpiLoading ? "..." : stats.active}
                        icon={BadgeCheck}
                        valueClass="text-emerald-600"
                    />
                    <TopCard
                        title="Under Review"
                        value={kpiLoading ? "..." : stats.underReview}
                        icon={User}
                        valueClass="text-rose-600"
                    />
                </section>

                <section className="relative flex flex-1 flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
                    <div className="pointer-events-none absolute -top-10 right-10 h-48 w-48 rounded-full bg-sky-100/60 blur-3xl" />
                    <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-indigo-50 blur-3xl" />

                    <div className="relative z-10 shrink-0 border-b border-slate-200 px-4 py-4 md:px-6">
                        <div className="flex items-center gap-2.5 md:gap-4 lg:justify-between">
                            <div className="relative min-w-0 flex-1 max-w-2xl">
                                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search request changes consultant..."
                                    className="h-11 md:h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-11 text-[13px] md:text-[14px] font-medium text-slate-900 outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-100 placeholder:text-slate-400"
                                />

                                {search ? (
                                    <button
                                        type="button"
                                        onClick={() => setSearch("")}
                                        className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                    >
                                        <X size={14} />
                                    </button>
                                ) : null}
                            </div>

                            <div className="flex shrink-0 items-center gap-2 md:gap-3">
                                <button
                                    onClick={() => setFiltersOpen(true)}
                                    className="inline-flex h-11 md:h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 md:px-5 text-[13px] font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
                                    type="button"
                                >
                                    <SlidersHorizontal className="h-4 w-4" />
                                    <span className="hidden md:inline">Filters</span>
                                    {activeFilters && (
                                        <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-900 px-1.5 text-[10px] font-black text-white">
                                            {[tierId !== "ALL", stateId !== "ALL", cityId !== "ALL", status !== "ALL"].filter(Boolean).length}
                                        </span>
                                    )}
                                </button>

                                <button
                                    onClick={handleRefresh}
                                    className="flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
                                    title="Refresh List"
                                    type="button"
                                >
                                    {loading || kpiLoading ? (
                                        <RefreshCw className="h-4 w-4 animate-spin text-sky-500" />
                                    ) : (
                                        <RefreshCw className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {error ? (
                        <div className="px-6 pt-5 relative z-10 shrink-0">
                            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] font-medium text-rose-700">
                                {error}
                            </div>
                        </div>
                    ) : null}

                    <div className="relative z-10 flex-1 overflow-auto">
                        <div className="table-scroll h-full w-full overflow-x-auto overflow-y-auto">
                            <table className="min-w-[1400px] w-full border-separate border-spacing-0">
                                <thead>
                                    <tr className="bg-slate-50/80 backdrop-blur-sm">
                                        <th className="border-b border-r border-slate-200/60 px-6 py-4.5 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">Consultant</th>
                                        <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">Tier</th>
                                        <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">City</th>
                                        <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">Status</th>
                                        <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">Verification</th>
                                        <th className="border-b border-slate-200 px-6 py-4.5 text-right text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={12} className="px-6 py-24 text-center">
                                                <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
                                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                                    Loading request changes...
                                                </div>
                                            </td>
                                        </tr>
                                    ) : rows.length ? (
                                        rows.map((row, idx) => (
                                            <motion.tr
                                                key={row.id || idx}
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={cls(
                                                    "group relative",
                                                    idx % 2 === 0 ? "bg-white" : "bg-slate-50/35",
                                                    "transition-colors duration-200 hover:bg-sky-50/45"
                                                )}
                                            >
                                                <td className="border-b border-slate-100 px-6 py-4.5 align-middle">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 shrink-0">
                                                            {row.logoURL ? (
                                                                <img
                                                                    src={row.logoURL}
                                                                    alt={row.name}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <span className="text-xs font-bold text-slate-500">
                                                                    {(row.name || "C").charAt(0)}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <div className="truncate text-[14px] font-bold cursor-pointer text-slate-900 transition-colors group-hover:text-sky-700"
                                                                title="View Consultant Details"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    navigate(`/admin/consultants/profile/${row.id}`);
                                                                }}
                                                            >
                                                                {row.name || "-"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                                                    <span
                                                        className={cls(
                                                            "inline-flex rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.03em] whitespace-nowrap",
                                                            tierBadge(row.tierTitle)
                                                        )}
                                                    >
                                                        {row.tierTitle || "Basic"}
                                                    </span>
                                                </td>

                                                <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                                                    <div className="text-[13px] font-medium text-slate-600 whitespace-nowrap">
                                                        {row.city || "-"}
                                                    </div>
                                                </td>

                                                <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                                                    <span
                                                        className={cls(
                                                            "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-bold",
                                                            statusBadge(row.status)
                                                        )}
                                                    >
                                                        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
                                                        {String(row.status || "UNKNOWN").replaceAll("_", " ")}
                                                    </span>
                                                </td>

                                                <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                                                    <span
                                                        className={cls(
                                                            "inline-flex whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-bold",
                                                            statusBadge(row.verificationStatus)
                                                        )}
                                                    >
                                                        {String(row.verificationStatus || "N/A").replaceAll("_", " ")}
                                                    </span>
                                                </td>

                                                <td className="border-b border-slate-100 px-6 py-4.5 text-right align-middle">
                                                    <RowActions
                                                        item={row}
                                                        onApprove={(consultant) => setKycModal({ open: true, type: "approve", consultant })}
                                                        onReject={(consultant) => setKycModal({ open: true, type: "reject", consultant })}
                                                        onRequestReupload={(consultant) => setKycModal({ open: true, type: "reupload", consultant })}
                                                    />
                                                </td>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={12} className="px-6 py-28 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-400">
                                                        <Search size={28} />
                                                    </div>

                                                    <div className="text-lg font-bold tracking-tight text-slate-900">
                                                        No request changes found
                                                    </div>

                                                    <div className="mx-auto mt-1 max-w-sm text-[14px] text-slate-500">
                                                        Try adjusting your search or refresh the list to load
                                                        the latest request changes consultants.
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="relative z-10 flex shrink-0 flex-col gap-3 border-t border-slate-200 bg-white px-5 py-4 md:flex-row md:items-center md:justify-between">
                        <div className="text-sm text-slate-500">
                            Page <span className="font-semibold text-slate-900">{page}</span> /{" "}
                            <span className="font-semibold text-slate-900">{totalPages}</span>
                            <span className="ml-2">• {totalCount} total records</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1 || loading}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                type="button"
                            >
                                Prev
                            </button>

                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages || loading}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                type="button"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            {/* KYC Action Modals */}
            <ApproveKYCModal
                open={kycModal.open && kycModal.type === "approve"}
                consultantName={kycModal.consultant?.name}
                remark={approveRemark}
                setRemark={setApproveRemark}
                loading={kycLoading}
                onClose={closeKycModal}
                onConfirm={handleApproveKYC}
            />

            <RejectKYCModal
                open={kycModal.open && kycModal.type === "reject"}
                consultantName={kycModal.consultant?.name}
                rejectionReason={rejectReason}
                setRejectionReason={setRejectReason}
                rejectionReasonText={rejectReasonText}
                setRejectionReasonText={setRejectReasonText}
                loading={kycLoading}
                onClose={closeKycModal}
                onConfirm={handleRejectKYC}
            />

            <RequestReuploadModal
                open={kycModal.open && kycModal.type === "reupload"}
                consultantName={kycModal.consultant?.name}
                remark={reuploadRemark}
                setRemark={setReuploadRemark}
                loading={kycLoading}
                onClose={closeKycModal}
                onConfirm={handleRequestReupload}
            />

            {/* Filter Sidebar */}
            <AnimatePresence>
                {filtersOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setFiltersOpen(false)}
                            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
                        />

                        <motion.aside
                            initial={{ x: 420, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 420, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 260, damping: 24 }}
                            className="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-[440px] flex-col border-l border-slate-200 bg-white shadow-2xl"
                        >
                            <div className="shrink-0 border-b border-slate-200 bg-gradient-to-br from-slate-50 via-white to-sky-50/30 px-6 py-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/20">
                                                <SlidersHorizontal className="h-5 w-5" />
                                            </div>
                                            <h3 className="text-2xl font-black tracking-tight text-slate-900">
                                                Filters
                                            </h3>
                                        </div>
                                        <p className="mt-1 text-sm font-medium text-slate-500">
                                            Refine your request changes search
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => setFiltersOpen(false)}
                                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 active:scale-95"
                                        type="button"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 space-y-5 overflow-y-auto p-6 bg-slate-50/30">
                                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <div className="mb-4 flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-slate-400" />
                                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Location</h4>
                                    </div>
                                    <div className="space-y-4">
                                        <SimpleDropdown
                                            key="state-dropdown"
                                            label="State"
                                            value={String(draftStateId || "ALL")}
                                            onChange={(val) => {
                                                setDraftStateId(val);
                                            }}
                                            options={states}
                                            loading={statesLoading}
                                            placeholder="All States"
                                        />

                                        <SimpleDropdown
                                            key="city-dropdown"
                                            label="City"
                                            value={String(draftCityId || "ALL")}
                                            onChange={(val) => setDraftCityId(val)}
                                            options={cities}
                                            loading={citiesLoading}
                                            placeholder="All Cities"
                                        />
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                                    <div className="mb-4 flex items-center gap-2">
                                        <BadgeCheck className="h-4 w-4 text-slate-400" />
                                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Consultant Details</h4>
                                    </div>

                                    {/* Tier Plan Dropdown */}
                                    <div>
                                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                            Tier Plan
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={draftTierId}
                                                onChange={(e) => setDraftTierId(e.target.value)}
                                                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-[13px] font-semibold text-slate-900 outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-100 shadow-sm"
                                            >
                                                <option value="ALL">All Tiers</option>
                                                {tierPlans.map((tier) => (
                                                    <option key={tier.id} value={tier.id}>
                                                        {tier.title}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                        </div>
                                    </div>

                                    {/* Status Dropdown */}
                                    <div>
                                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                            Status
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={draftStatus}
                                                onChange={(e) => setDraftStatus(e.target.value)}
                                                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-[13px] font-semibold text-slate-900 outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-100 shadow-sm"
                                            >
                                                <option value="ALL">All Status</option>
                                                {STATUS_OPTIONS.map((status) => (
                                                    <option key={status} value={status}>
                                                        {status.replace(/_/g, " ")}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-gradient-to-br from-slate-50 via-white to-sky-50/30 px-6 py-5 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
                                <button
                                    onClick={clearAll}
                                    className="flex-1 rounded-xl border-2 border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
                                    type="button"
                                >
                                    Clear All
                                </button>
                                <button
                                    onClick={applyFilters}
                                    className="flex-1 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/30 active:scale-95"
                                    type="button"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

function SimpleDropdown({
    label,
    value,
    onChange,
    options,
    placeholder = "Select...",
    loading = false,
}) {
    // Ensure value is always a string for comparison
    const normalizedValue = String(value || "ALL");

    return (
        <div className="block">
            <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {label}
            </div>

            <div className="relative">
                <select
                    value={normalizedValue}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        onChange(newValue);
                    }}
                    disabled={loading}
                    className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-[13px] font-semibold text-slate-900 outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-100 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <option value="ALL">{placeholder}</option>
                    {options.map((item) => (
                        <option key={String(item.id)} value={String(item.id)}>
                            {item.title || item.name}
                        </option>
                    ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            </div>
        </div>
    );
}

export default RequestChangesConsult;