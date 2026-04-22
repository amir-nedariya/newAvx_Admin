import React, { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
    ArrowLeft,
    Ban,
    RotateCcw,
    MapPin,
    ShieldCheck,
    CheckCircle2,
    AlertTriangle,
    X,
    XCircle,
    Image as ImageIcon,
    Eye,
    User,
    Mail,
    Phone,
    CalendarDays,
    FileText,
    Loader2,
    ChevronRight,
    Activity,
    Clock3,
    Search,
    ChevronLeft,
    Filter,
    BadgeCheck,
    ShieldAlert,
    NotebookPen,
    ChevronDown,
    MoreHorizontal,
    Star,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getUserById,
    updateUserStatus,
    getUserMetaData,
    suspendUserSeller,
    flagUserSellerForReview,
    unsuspendUserSeller,
    clearUserSellerFlag,
    approveUserSellerKYC,
    rejectUserSellerKYC,
    requestChangesUserSellerKYC,
} from "../../../api/user.api";

const cls = (...a) => a.filter(Boolean).join(" ");

/* ================= FORMATTERS ================= */
const safe = (v) => (v === null || v === undefined || v === "" ? "—" : v);

const getErrorMessage = (e, fallback = "Something went wrong") => {
    return (
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        fallback
    );
};

const formatEnumLabel = (value) => {
    if (!value) return "-";
    return String(value).replace(/_/g, " ");
};

/* ================= SMALL UI PARTS ================= */
const Pill = ({ tone = "slate", children }) => {
    const map = {
        slate: "bg-slate-50 text-slate-700 border-slate-200",
        green: "bg-emerald-50 text-emerald-700 border-emerald-200",
        blue: "bg-blue-50 text-blue-700 border-blue-200",
        amber: "bg-amber-50 text-amber-800 border-amber-200",
        red: "bg-rose-50 text-rose-700 border-rose-200",
        indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    };

    return (
        <span
            className={cls(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold",
                map[tone] || map.slate
            )}
        >
            {children}
        </span>
    );
};

function StatItem({ label, value }) {
    return (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{label}</div>
            <div className="mt-1 text-lg font-bold text-zinc-900">{value}</div>
        </div>
    );
}

function SectionCard({ title, subtitle, children }) {
    return (
        <div className="rounded-[28px] border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-100 px-5 py-4">
                <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
                {subtitle ? <p className="text-sm text-zinc-500">{subtitle}</p> : null}
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}

function InfoItem({ label, value, full = false }) {
    return (
        <div className={cls(full ? "col-span-2" : "")}>
            <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</div>
            <div className="mt-1 text-sm font-semibold text-zinc-900 break-words">{value || "-"}</div>
        </div>
    );
}

const DocChip = ({ ok, text, onClick, clickable = false }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={!clickable}
        className={cls(
            "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold transition",
            ok
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-slate-50 text-slate-700",
            clickable
                ? "cursor-pointer hover:scale-[1.02] hover:shadow-sm"
                : "cursor-default"
        )}
    >
        {ok ? (
            <CheckCircle2 size={14} />
        ) : (
            <AlertTriangle size={14} className="text-amber-500" />
        )}
        {text}
    </button>
);

/* ================= IMAGE MODAL ================= */
function DocumentImageModal({ open, onClose, title, imageUrl }) {
    if (!open) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-[100] bg-slate-900/70 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="fixed left-1/2 top-1/2 z-[101] w-[95%] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                    <div>
                        <h3 className="text-base font-extrabold text-slate-900">
                            {title}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">Document preview</p>
                    </div>

                    <button
                        onClick={onClose}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="flex max-h-[80vh] min-h-[320px] items-center justify-center bg-slate-100 p-4">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={title}
                            className="max-h-[72vh] w-auto max-w-full rounded-xl border border-slate-200 bg-white object-contain shadow-sm"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400">
                            <ImageIcon size={34} />
                            <p className="mt-2 text-sm font-semibold">No image available</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

/* ================= SUSPEND USER MODAL ================= */
function SuspendUserModal({
    open,
    userName,
    suspendReason,
    setSuspendReason,
    suspendDescription,
    setSuspendDescription,
    suspendType,
    setSuspendType,
    suspendUntil,
    setSuspendUntil,
    loading,
    onClose,
    onConfirm,
}) {
    if (!open) return null;

    const suspensionReasons = [
        "Policy violation",
        "Fraudulent activity",
        "Multiple complaints",
        "Fake documents",
        "Inappropriate behavior",
        "Terms of service violation",
        "Suspicious activity",
        "Other",
    ];

    // Get today's date in YYYY-MM-DD format for min attribute
    const getTodayDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <>
            <div
                className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="fixed left-1/2 top-1/2 z-[111] w-[95%] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-zinc-200 bg-white shadow-2xl">
                <div className="flex items-start justify-between border-b border-zinc-100 bg-rose-50 px-6 py-5 rounded-t-[28px]">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100">
                            <Ban className="h-6 w-6 text-rose-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-zinc-900">Suspend User</h3>
                            {userName && (
                                <p className="mt-1 text-sm text-zinc-600">{userName}</p>
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
                    <div className="space-y-6">
                        {/* Reason Dropdown */}
                        <div>
                            <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-zinc-600">
                                Reason for Suspension
                            </label>
                            <div className="relative">
                                <select
                                    value={suspendReason}
                                    onChange={(e) => setSuspendReason(e.target.value)}
                                    className="w-full appearance-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 pr-10 text-sm text-zinc-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                                >
                                    <option value="">Select reason</option>
                                    {suspensionReasons.map((reason) => (
                                        <option key={reason} value={reason}>
                                            {reason}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                            </div>
                        </div>

                        {/* Description Field (shown when "Other" is selected) */}
                        {suspendReason === "Other" && (
                            <div>
                                <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-zinc-600">
                                    Description
                                </label>
                                <textarea
                                    value={suspendDescription}
                                    onChange={(e) => setSuspendDescription(e.target.value)}
                                    placeholder="Please provide detailed reason for suspension (minimum 5 characters)"
                                    rows={4}
                                    className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 resize-none"
                                />
                                <p className="mt-2 text-xs text-zinc-500">
                                    {suspendDescription.length}/500 characters
                                </p>
                            </div>
                        )}

                        {/* Suspension Type */}
                        <div>
                            <label className="mb-3 block text-sm font-bold uppercase tracking-wide text-zinc-600">
                                Suspension Type
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setSuspendType("TEMPORARY")}
                                    className={cls(
                                        "rounded-2xl border-2 p-4 text-left transition-all",
                                        suspendType === "TEMPORARY"
                                            ? "border-sky-500 bg-sky-50"
                                            : "border-zinc-200 bg-white hover:border-zinc-300"
                                    )}
                                >
                                    <div className="text-base font-bold text-zinc-900">Temporary</div>
                                    <div className="mt-1 text-sm text-zinc-500">Suspend for limited time</div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSuspendType("PERMANENT")}
                                    className={cls(
                                        "rounded-2xl border-2 p-4 text-left transition-all",
                                        suspendType === "PERMANENT"
                                            ? "border-sky-500 bg-sky-50"
                                            : "border-zinc-200 bg-white hover:border-zinc-300"
                                    )}
                                >
                                    <div className="text-base font-bold text-zinc-900">Permanent</div>
                                    <div className="mt-1 text-sm text-zinc-500">Until manually restored</div>
                                </button>
                            </div>
                        </div>

                        {/* Suspend Until (only for temporary) */}
                        {suspendType === "TEMPORARY" && (
                            <div>
                                <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-zinc-600">
                                    Suspend Until
                                </label>
                                <input
                                    type="date"
                                    value={suspendUntil}
                                    onChange={(e) => setSuspendUntil(e.target.value)}
                                    min={getTodayDate()}
                                    className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                                />
                                <p className="mt-2 text-xs text-zinc-500">Select a future date for suspension end</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
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
                                !suspendReason ||
                                (suspendReason === "Other" && (!suspendDescription.trim() || suspendDescription.trim().length < 5)) ||
                                (suspendType === "TEMPORARY" && !suspendUntil)
                            }
                            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Ban className="h-4 w-4" />
                            {loading ? "Suspending..." : "Confirm Suspend"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

/* ================= FLAG REVIEW MODAL ================= */
function FlagReviewModal({
    open,
    userName,
    flagCategory,
    setFlagCategory,
    flagSeverity,
    setFlagSeverity,
    flagNotes,
    setFlagNotes,
    loading,
    onClose,
    onConfirm,
}) {
    if (!open) return null;

    const flagCategories = [
        { value: "FRAUD_SUSPICION", label: "Fraud Suspicion" },
        { value: "SUSPICIOUS_PRICING", label: "Suspicious Pricing" },
        { value: "FAKE_INQUIRIES", label: "Fake Inquiries" },
        { value: "POLICY_VIOLATION", label: "Policy Violation" },
    ];

    const severityLevels = [
        { value: "LOW", label: "Low" },
        { value: "MODERATE", label: "Moderate" },
        { value: "HIGH", label: "High" },
    ];

    return (
        <>
            <div
                className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="fixed left-1/2 top-1/2 z-[111] w-[95%] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-zinc-200 bg-white shadow-2xl">
                <div className="flex items-start justify-between border-b border-zinc-100 bg-amber-50 px-6 py-5 rounded-t-[28px]">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100">
                            <ShieldAlert className="h-6 w-6 text-amber-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-zinc-900">Flag User For Review</h3>
                            {userName && (
                                <p className="mt-1 text-sm text-zinc-600">{userName}</p>
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
                    <div className="space-y-6">
                        {/* Flag Category */}
                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-zinc-600">
                                <ShieldAlert className="h-4 w-4 text-amber-600" />
                                Flag Category
                            </label>
                            <div className="relative">
                                <select
                                    value={flagCategory}
                                    onChange={(e) => setFlagCategory(e.target.value)}
                                    className="w-full appearance-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 pr-10 text-sm text-zinc-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                                >
                                    <option value="">Select Category</option>
                                    {flagCategories.map((cat) => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                            </div>
                        </div>

                        {/* Severity Level */}
                        <div>
                            <label className="mb-3 block text-sm font-bold uppercase tracking-wide text-zinc-600">
                                Severity Level
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {severityLevels.map((level) => (
                                    <button
                                        key={level.value}
                                        type="button"
                                        onClick={() => setFlagSeverity(level.value)}
                                        className={cls(
                                            "rounded-2xl border-2 p-4 text-center transition-all",
                                            flagSeverity === level.value
                                                ? level.value === "HIGH"
                                                    ? "border-rose-500 bg-rose-50"
                                                    : level.value === "MODERATE"
                                                        ? "border-amber-500 bg-amber-50"
                                                        : "border-blue-500 bg-blue-50"
                                                : "border-zinc-200 bg-white hover:border-zinc-300"
                                        )}
                                    >
                                        <div className={cls(
                                            "text-base font-bold",
                                            flagSeverity === level.value
                                                ? level.value === "HIGH"
                                                    ? "text-rose-700"
                                                    : level.value === "MODERATE"
                                                        ? "text-amber-700"
                                                        : "text-blue-700"
                                                : "text-zinc-900"
                                        )}>
                                            {level.label}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Internal Notes */}
                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-zinc-600">
                                <FileText className="h-4 w-4 text-zinc-600" />
                                Internal Administrative Notes
                            </label>
                            <textarea
                                value={flagNotes}
                                onChange={(e) => setFlagNotes(e.target.value)}
                                rows={5}
                                placeholder="Why are you flagging this user? Be specific for the auditing team..."
                                className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                            />
                            <p className="mt-2 text-xs text-zinc-500">Minimum 10 characters required</p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
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
                                !flagCategory ||
                                !flagSeverity ||
                                !flagNotes.trim() ||
                                flagNotes.trim().length < 10
                            }
                            className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <ShieldAlert className="h-4 w-4" />
                            {loading ? "Flagging..." : "Flag User"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

/* ================= UNSUSPEND USER MODAL ================= */
function UnsuspendUserModal({
    open,
    userName,
    unsuspendReason,
    setUnsuspendReason,
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
                <div className="flex items-start justify-between border-b border-zinc-100 bg-emerald-50 px-6 py-5 rounded-t-[28px]">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100">
                            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-zinc-900">Unsuspend User</h3>
                            {userName && (
                                <p className="mt-1 text-sm text-zinc-600">{userName}</p>
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
                    <div className="space-y-6">
                        {/* Info Message */}
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
                                <div className="text-sm text-emerald-800">
                                    User will be reactivated and able to access their account immediately after unsuspension.
                                </div>
                            </div>
                        </div>

                        {/* Reason */}
                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-zinc-600">
                                <FileText className="h-4 w-4 text-zinc-600" />
                                Reason for Unsuspension
                            </label>
                            <textarea
                                value={unsuspendReason}
                                onChange={(e) => setUnsuspendReason(e.target.value)}
                                rows={4}
                                placeholder="Provide a reason for unsuspending this user..."
                                className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                            />
                            <p className="mt-2 text-xs text-zinc-500">Required field</p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="rounded-xl border border-zinc-200 bg-white px-6 py-2.5 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={onConfirm}
                            disabled={loading || !unsuspendReason.trim()}
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            {loading ? "Unsuspending..." : "Confirm Unsuspend"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

/* ================= CLEAR FLAG MODAL ================= */
function ClearFlagModal({
    open,
    userName,
    clearFlagReason,
    setClearFlagReason,
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
                <div className="flex items-start justify-between border-b border-zinc-100 bg-emerald-50 px-6 py-5 rounded-t-[28px]">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100">
                            <ShieldCheck className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-zinc-900">Clear User Flag</h3>
                            {userName && (
                                <p className="mt-1 text-sm text-zinc-600">{userName}</p>
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
                    <div className="space-y-6">
                        {/* Clearance Reason */}
                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-zinc-600">
                                <FileText className="h-4 w-4 text-zinc-600" />
                                Clearance Reason
                            </label>
                            <textarea
                                value={clearFlagReason}
                                onChange={(e) => setClearFlagReason(e.target.value)}
                                rows={4}
                                placeholder="Provide a reason for clearing this flag..."
                                className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                            />
                            <p className="mt-2 text-xs text-zinc-500">Required field</p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="rounded-xl border border-zinc-200 bg-white px-6 py-2.5 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={onConfirm}
                            disabled={loading || !clearFlagReason.trim()}
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <ShieldCheck className="h-4 w-4" />
                            {loading ? "Clearing..." : "Clear Flag"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

/* ================= APPROVE KYC MODAL ================= */
function ApproveKYCModal({
    open,
    userName,
    reason,
    setReason,
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
                <div className="flex items-start justify-between border-b border-zinc-100 bg-emerald-50 px-6 py-5 rounded-t-[28px]">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100">
                            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-zinc-900">Approve KYC</h3>
                            {userName && (
                                <p className="mt-1 text-sm text-zinc-600 uppercase tracking-wide">{userName}</p>
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
                    <div className="space-y-6">
                        {/* Info Message */}
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                            <div className="text-sm font-semibold text-emerald-800">
                                KYC will be approved. Consultant will be able to list vehicles immediately.
                            </div>
                        </div>

                        {/* Remark */}
                        <div>
                            <label className="mb-2 block text-sm font-bold text-zinc-700">
                                Remark <span className="text-zinc-400">(Optional)</span>
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows={4}
                                placeholder="Enter remark for approving KYC..."
                                className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="rounded-xl border border-zinc-200 bg-white px-6 py-2.5 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Approving..." : "Approve KYC"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

/* ================= REJECT KYC MODAL ================= */
function RejectKYCModal({
    open,
    userName,
    reason,
    setReason,
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
                <div className="flex items-start justify-between border-b border-zinc-100 bg-rose-50 px-6 py-5 rounded-t-[28px]">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100">
                            <XCircle className="h-6 w-6 text-rose-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-zinc-900">Reject KYC</h3>
                            {userName && (
                                <p className="mt-1 text-sm text-zinc-600 uppercase tracking-wide">{userName}</p>
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
                    <div className="space-y-6">
                        {/* Info Message */}
                        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
                            <div className="text-sm font-semibold text-rose-800">
                                KYC will be rejected. Consultant will be notified with the rejection reason.
                            </div>
                        </div>

                        {/* Reason */}
                        <div>
                            <label className="mb-2 block text-sm font-bold text-zinc-700">
                                Reason
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows={4}
                                placeholder="Select a reason..."
                                className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                            />
                            <p className="mt-2 text-xs text-zinc-500">Minimum 5 characters required</p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="rounded-xl border border-zinc-200 bg-white px-6 py-2.5 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={onConfirm}
                            disabled={loading || !reason.trim() || reason.trim().length < 5}
                            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Rejecting..." : "Confirm Rejection"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

/* ================= REQUEST CHANGES KYC MODAL ================= */
function RequestChangesKYCModal({
    open,
    userName,
    reason,
    setReason,
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
                <div className="flex items-start justify-between border-b border-zinc-100 bg-amber-50 px-6 py-5 rounded-t-[28px]">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100">
                            <RotateCcw className="h-6 w-6 text-amber-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-zinc-900">Request KYC Re-upload</h3>
                            {userName && (
                                <p className="mt-1 text-sm text-zinc-600 uppercase tracking-wide">{userName}</p>
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
                    <div className="space-y-6">
                        {/* Info Message */}
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                            <div className="text-sm font-semibold text-amber-800">
                                Consultant will be notified to re-upload KYC documents with your remarks.
                            </div>
                        </div>

                        {/* Remark */}
                        <div>
                            <label className="mb-2 block text-sm font-bold text-zinc-700">
                                Remark <span className="text-amber-600">*</span>
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows={4}
                                placeholder="Enter remark for requesting re-upload..."
                                className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                            />
                            <p className="mt-2 text-xs text-zinc-500">Minimum 5 characters required</p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="rounded-xl border border-zinc-200 bg-white px-6 py-2.5 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={onConfirm}
                            disabled={loading || !reason.trim() || reason.trim().length < 5}
                            className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Requesting..." : "Request Re-upload"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

/* ================= MAIN ================= */
const UserDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [data, setData] = useState(null);
    const [activeTab, setActiveTab] = useState("Overview");
    const [docModal, setDocModal] = useState({
        open: false,
        title: "",
        imageUrl: "",
    });

    // Inventory pagination and search
    const [inventorySearch, setInventorySearch] = useState("");
    const [inventoryPage, setInventoryPage] = useState(1);
    const [inventoryStatusFilter, setInventoryStatusFilter] = useState("ALL");
    const inventoryPerPage = 10;

    // Suspend modal states
    const [suspendModalOpen, setSuspendModalOpen] = useState(false);
    const [suspendReason, setSuspendReason] = useState("");
    const [suspendDescription, setSuspendDescription] = useState("");
    const [suspendType, setSuspendType] = useState("TEMPORARY");
    const [suspendUntil, setSuspendUntil] = useState("");
    const [suspendLoading, setSuspendLoading] = useState(false);

    // Flag review modal states
    const [flagReviewModalOpen, setFlagReviewModalOpen] = useState(false);
    const [flagCategory, setFlagCategory] = useState("");
    const [flagSeverity, setFlagSeverity] = useState("");
    const [flagNotes, setFlagNotes] = useState("");
    const [flagLoading, setFlagLoading] = useState(false);

    // Unsuspend modal states
    const [unsuspendModalOpen, setUnsuspendModalOpen] = useState(false);
    const [unsuspendReason, setUnsuspendReason] = useState("");
    const [unsuspendLoading, setUnsuspendLoading] = useState(false);

    // Clear flag modal states
    const [clearFlagModalOpen, setClearFlagModalOpen] = useState(false);
    const [clearFlagReason, setClearFlagReason] = useState("");
    const [clearFlagLoading, setClearFlagLoading] = useState(false);

    // KYC modal states
    const [approveKYCModalOpen, setApproveKYCModalOpen] = useState(false);
    const [approveKYCReason, setApproveKYCReason] = useState("");
    const [approveKYCLoading, setApproveKYCLoading] = useState(false);

    const [rejectKYCModalOpen, setRejectKYCModalOpen] = useState(false);
    const [rejectKYCReason, setRejectKYCReason] = useState("");
    const [rejectKYCLoading, setRejectKYCLoading] = useState(false);

    const [requestChangesKYCModalOpen, setRequestChangesKYCModalOpen] = useState(false);
    const [requestChangesKYCReason, setRequestChangesKYCReason] = useState("");
    const [requestChangesKYCLoading, setRequestChangesKYCLoading] = useState(false);

    const profile = useMemo(() => {
        if (!data) return null;

        const statusTone = data.userStatus === "ACTIVE" ? "green" : "slate";
        const roleTone = data.userRole === "ADMIN" ? "indigo" : data.userRole === "CONSULTATION" ? "blue" : "slate";
        const verificationTone =
            data.verificationStatus === "VERIFIED" ? "green" :
                data.verificationStatus === "REJECTED" ? "red" :
                    data.verificationStatus === "REQUEST_CHANGES" ? "amber" :
                        data.verificationStatus === "REQUESTED" ? "blue" : "slate";

        return {
            raw: data,
            userId: data.userId,
            firstname: data.firstname || "—",
            lastname: data.lastname || "—",
            fullName: `${data.firstname || ""} ${data.lastname || ""}`.trim() || "User",
            email: data.email || "—",
            phone: data.phoneNumber || "—",
            countryCode: data.countryCode || "+91",
            userRole: formatEnumLabel(data.userRole) || "—",
            status: data.userStatus || "—",
            statusTone,
            roleTone,
            createdAt: data.userCreatedAt || null,
            updatedAt: data.userUpdatedAt || null,

            // Meta data
            metaDataId: data.metaDataId || null,
            age: data.age || "—",
            profession: data.profession || "—",
            gender: data.gender || "—",
            address: data.address || "—",
            cityId: data.cityId || null,
            cityName: data.cityName || "—",
            stateId: data.stateId || null,
            stateName: data.stateName || "—",
            countryId: data.countryId || null,
            countryName: data.countryName || "—",
            latitude: data.latitude || null,
            longitude: data.longitude || null,
            metaDataStatus: data.metaDataStatus || "—",

            // Seller data
            sellerId: data.sellerId || null,
            panCardNumber: data.panCardNumber || "—",
            panCardFrontUrl: data.panCardFrontUrl || null,
            aadharCardNumber: data.aadharCardNumber || "—",
            aadharCardFrontUrl: data.aadharCardFrontUrl || null,
            aadharCardBackUrl: data.aadharCardBackUrl || null,
            verificationStatus: data.verificationStatus || "—",
            verificationTone,
            verifiedAt: data.verifiedAt || null,
            adminRemark: data.adminRemark || "—",
            sellerStatus: data.sellerStatus || "—",

            // Inspection requests and activity logs
            inspectionRequests: data.inspectionRequests || [],
            activityLogs: data.activityLogs || [],

            // Suspension and flag status
            isSuspended: data.isSuspended || false,
            isFlagged: data.isFlagged || false,
            flagId: data.flagId || null,
        };
    }, [data]);

    // Filtered and paginated vehicles for inventory tab
    const filteredVehicles = useMemo(() => {
        if (!profile?.raw?.vehicles) return [];

        let vehicles = profile.raw.vehicles;

        // Filter by search text
        if (inventorySearch.trim()) {
            const searchLower = inventorySearch.toLowerCase();
            vehicles = vehicles.filter(vehicle =>
                vehicle.vehicleTitle?.toLowerCase().includes(searchLower)
            );
        }

        // Filter by status
        if (inventoryStatusFilter !== "ALL") {
            if (inventoryStatusFilter === "SOLD") {
                vehicles = vehicles.filter(vehicle => vehicle.isVehicleSold === true);
            } else {
                vehicles = vehicles.filter(vehicle =>
                    vehicle.status === inventoryStatusFilter && vehicle.isVehicleSold !== true
                );
            }
        }

        return vehicles;
    }, [profile?.raw?.vehicles, inventorySearch, inventoryStatusFilter]);

    const paginatedVehicles = useMemo(() => {
        const startIndex = (inventoryPage - 1) * inventoryPerPage;
        const endIndex = startIndex + inventoryPerPage;
        return filteredVehicles.slice(startIndex, endIndex);
    }, [filteredVehicles, inventoryPage, inventoryPerPage]);

    const totalVehiclePages = Math.ceil(filteredVehicles.length / inventoryPerPage);

    // Reset to page 1 when search or filter changes
    useEffect(() => {
        setInventoryPage(1);
    }, [inventorySearch, inventoryStatusFilter]);

    const fetchUserDetails = async ({ silent = false } = {}) => {
        try {
            if (!silent) setLoading(true);
            setError("");

            const resMeta = await getUserMetaData(id);

            if (resMeta.status === "OK") {
                setData(resMeta.data);
            }
        } catch (e) {
            const msg = getErrorMessage(e, "Failed to load user details");
            setError(msg);
            toast.error(msg);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, [id]);

    const openDocModal = (title, imageUrl) => {
        if (!imageUrl) {
            toast.error("Document image not available");
            return;
        }

        setDocModal({
            open: true,
            title,
            imageUrl,
        });
    };

    const closeDocModal = () => {
        setDocModal({
            open: false,
            title: "",
            imageUrl: "",
        });
    };

    const handleSuspendUser = async () => {
        try {
            // If "Other" is selected, use description as reason
            const finalReason = suspendReason === "Other" ? suspendDescription.trim() : suspendReason.trim();

            if (!finalReason || finalReason.length < 5) {
                toast.error("Reason must be at least 5 characters");
                return;
            }

            if (suspendType === "TEMPORARY" && !suspendUntil) {
                toast.error("Please select suspension end date");
                return;
            }

            setSuspendLoading(true);

            await suspendUserSeller({
                userId: id,
                reason: finalReason,
                suspendType: suspendType,
                suspendUntil: suspendType === "TEMPORARY" ? suspendUntil : null,
            });

            toast.success("User suspended successfully");
            setSuspendModalOpen(false);
            setSuspendReason("");
            setSuspendDescription("");
            setSuspendType("TEMPORARY");
            setSuspendUntil("");
            await fetchUserDetails({ silent: true });
        } catch (e) {
            toast.error(getErrorMessage(e, "Failed to suspend user"));
        } finally {
            setSuspendLoading(false);
        }
    };

    const handleFlagReview = async () => {
        try {
            if (!flagCategory) {
                toast.error("Please select a flag category");
                return;
            }

            if (!flagSeverity) {
                toast.error("Please select severity level");
                return;
            }

            if (!flagNotes.trim() || flagNotes.trim().length < 10) {
                toast.error("Internal notes must be at least 10 characters");
                return;
            }

            setFlagLoading(true);

            await flagUserSellerForReview({
                userId: id,
                flagCategory: flagCategory,
                severity: flagSeverity,
                internalNotes: flagNotes.trim(),
            });

            toast.success("User flagged for review successfully");
            setFlagReviewModalOpen(false);
            setFlagCategory("");
            setFlagSeverity("");
            setFlagNotes("");
            await fetchUserDetails({ silent: true });
        } catch (e) {
            toast.error(getErrorMessage(e, "Failed to flag user for review"));
        } finally {
            setFlagLoading(false);
        }
    };

    const handleUnsuspendUser = async () => {
        try {
            if (!unsuspendReason.trim()) {
                toast.error("Reason is required");
                return;
            }

            setUnsuspendLoading(true);

            await unsuspendUserSeller({
                userId: id,
                reason: unsuspendReason.trim(),
            });

            toast.success("User unsuspended successfully");
            setUnsuspendModalOpen(false);
            setUnsuspendReason("");
            await fetchUserDetails({ silent: true });
        } catch (e) {
            toast.error(getErrorMessage(e, "Failed to unsuspend user"));
        } finally {
            setUnsuspendLoading(false);
        }
    };

    const handleClearFlag = async () => {
        try {
            if (!clearFlagReason.trim()) {
                toast.error("Clearance reason is required");
                return;
            }

            if (!profile?.flagId) {
                toast.error("Flag ID not found");
                return;
            }

            setClearFlagLoading(true);

            await clearUserSellerFlag({
                flagId: profile.flagId,
                reason: clearFlagReason.trim(),
            });

            toast.success("User flag cleared successfully");
            setClearFlagModalOpen(false);
            setClearFlagReason("");
            await fetchUserDetails({ silent: true });
        } catch (e) {
            toast.error(getErrorMessage(e, "Failed to clear user flag"));
        } finally {
            setClearFlagLoading(false);
        }
    };

    const handleApproveKYC = async () => {
        try {
            // Reason is optional for approve, so we allow empty
            setApproveKYCLoading(true);

            await approveUserSellerKYC({
                userId: id,
                reason: approveKYCReason.trim() || "Approved",
            });

            toast.success("KYC approved successfully");
            setApproveKYCModalOpen(false);
            setApproveKYCReason("");
            await fetchUserDetails({ silent: true });
        } catch (e) {
            toast.error(getErrorMessage(e, "Failed to approve KYC"));
        } finally {
            setApproveKYCLoading(false);
        }
    };

    const handleRejectKYC = async () => {
        try {
            if (!rejectKYCReason.trim() || rejectKYCReason.trim().length < 5) {
                toast.error("Reason must be at least 5 characters");
                return;
            }

            setRejectKYCLoading(true);

            await rejectUserSellerKYC({
                userId: id,
                reason: rejectKYCReason.trim(),
            });

            toast.success("KYC rejected successfully");
            setRejectKYCModalOpen(false);
            setRejectKYCReason("");
            await fetchUserDetails({ silent: true });
        } catch (e) {
            toast.error(getErrorMessage(e, "Failed to reject KYC"));
        } finally {
            setRejectKYCLoading(false);
        }
    };

    const handleRequestChangesKYC = async () => {
        try {
            if (!requestChangesKYCReason.trim() || requestChangesKYCReason.trim().length < 5) {
                toast.error("Remark must be at least 5 characters");
                return;
            }

            setRequestChangesKYCLoading(true);

            await requestChangesUserSellerKYC({
                userId: id,
                reason: requestChangesKYCReason.trim(),
            });

            toast.success("KYC changes requested successfully");
            setRequestChangesKYCModalOpen(false);
            setRequestChangesKYCReason("");
            await fetchUserDetails({ silent: true });
        } catch (e) {
            toast.error(getErrorMessage(e, "Failed to request KYC changes"));
        } finally {
            setRequestChangesKYCLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-50">
                <div className="mx-auto max-w-[1450px] px-4 py-8 md:px-6">
                    <div className="rounded-[32px] border border-zinc-200 bg-white px-6 py-20 text-center shadow-sm">
                        <div className="inline-flex items-center gap-3 text-sm font-semibold text-zinc-800">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Loading user details...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen bg-zinc-50">
                <div className="mx-auto max-w-[1450px] px-4 py-8 md:px-6">
                    <div className="mb-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm hover:bg-zinc-50"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </button>
                    </div>

                    <div className="rounded-[32px] border border-rose-200 bg-rose-50 px-6 py-14 text-center shadow-sm">
                        <div className="text-lg font-semibold text-rose-800">
                            {error || "User details not found"}
                        </div>
                        <button
                            onClick={() => fetchUserDetails()}
                            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50">
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

            <div className="mx-auto max-w-[1450px] px-4 py-6 md:px-6">
                <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 font-semibold text-zinc-800 shadow-sm hover:bg-zinc-50"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </button>
                    <ChevronRight className="h-4 w-4" />
                    <span>Users</span>
                    <ChevronRight className="h-4 w-4" />
                    <span className="font-semibold text-zinc-900">User Details</span>
                </div>

                <div className="border border-zinc-200 bg-white shadow-[0_18px_45px_rgba(0,0,0,0.06)]">
                    <div className="border-b border-zinc-100 bg-white px-5 py-5 md:px-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-sm">
                                        <div className="flex h-full w-full items-center justify-center text-2xl font-black text-zinc-700">
                                            {String(profile?.firstname || "U").trim().slice(0, 1).toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="min-w-0">
                                        <h1 className="text-xl font-bold tracking-tight text-zinc-900 md:text-2xl">
                                            {profile?.fullName || "User"}
                                        </h1>
                                        <div className="mt-2 flex flex-wrap items-center gap-2">
                                            <Pill tone={profile?.roleTone || "slate"}>
                                                Role : {profile?.userRole || "—"}
                                            </Pill>

                                            <Pill tone={profile?.statusTone || "slate"}>
                                                <CheckCircle2 size={14} />
                                                Status : {profile?.status || "—"}
                                            </Pill>

                                            {profile?.sellerId && (
                                                <Pill tone={profile?.verificationTone || "slate"}>
                                                    <ShieldCheck size={14} />
                                                    Verification : {profile?.verificationStatus || "—"}
                                                </Pill>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap items-center gap-2">
                                    {/* Group 1: KYC Action Buttons - Show only when verificationStatus === "REQUESTED" */}
                                    {profile?.sellerId && profile?.verificationStatus === "REQUESTED" && (
                                        <>
                                            <button
                                                onClick={() => setApproveKYCModalOpen(true)}
                                                className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm transition-all hover:bg-emerald-100"
                                            >
                                                <CheckCircle2 className="h-4 w-4" />
                                                Approve KYC
                                            </button>
                                            <button
                                                onClick={() => setRejectKYCModalOpen(true)}
                                                className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 shadow-sm transition-all hover:bg-rose-100"
                                            >
                                                <XCircle className="h-4 w-4" />
                                                Reject KYC
                                            </button>
                                            <button
                                                onClick={() => setRequestChangesKYCModalOpen(true)}
                                                className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-700 shadow-sm transition-all hover:bg-amber-100"
                                            >
                                                <RotateCcw className="h-4 w-4" />
                                                Request Changes
                                            </button>
                                        </>
                                    )}

                                    {/* Group 2: Suspend and Flag Review - Show when verificationStatus !== "REQUESTED" */}
                                    {profile?.sellerId && profile?.verificationStatus !== "REQUESTED" && (
                                        <>
                                            {/* Suspend/Unsuspend Button */}
                                            {profile?.isSuspended ? (
                                                <button
                                                    onClick={() => setUnsuspendModalOpen(true)}
                                                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm transition-all hover:bg-emerald-100"
                                                >
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    Unsuspend
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => setSuspendModalOpen(true)}
                                                    className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 shadow-sm transition-all hover:bg-rose-100"
                                                >
                                                    <Ban className="h-4 w-4" />
                                                    Suspend
                                                </button>
                                            )}

                                            {/* Flag/Clear Flag Button */}
                                            {profile?.isFlagged ? (
                                                <button
                                                    onClick={() => setClearFlagModalOpen(true)}
                                                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm transition-all hover:bg-emerald-100"
                                                >
                                                    <ShieldCheck className="h-4 w-4" />
                                                    Clear Flag
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => setFlagReviewModalOpen(true)}
                                                    className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-700 shadow-sm transition-all hover:bg-amber-100"
                                                >
                                                    <ShieldAlert className="h-4 w-4" />
                                                    Flag Review
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* <div className="grid grid-cols-2 gap-3 border-t border-zinc-100 pt-4 md:grid-cols-3 lg:grid-cols-5">
                                <StatItem label="Email" value={profile?.email} />
                                <StatItem label="Phone" value={`${profile?.countryCode} ${profile?.phone}`} />
                                <StatItem label="Role" value={profile?.userRole} />
                                <StatItem label="Status" value={profile?.status} />
                                {profile?.age && profile.age !== "—" && (
                                    <StatItem label="Age" value={profile?.age} />
                                )}
                            </div> */}
                        </div>
                    </div>

                    {/* ================= ADMIN REMARK BANNER (for REQUEST_CHANGES status) ================= */}
                    {profile?.verificationStatus === "REQUEST_CHANGES" && profile?.adminRemark && profile.adminRemark !== "—" && (
                        <div className="border-b border-amber-200 bg-amber-50 px-5 py-4">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-sm font-bold uppercase tracking-wide text-amber-900">
                                            Admin Remark - Changes Requested
                                        </h4>
                                    </div>
                                    <p className="text-sm text-amber-800 leading-relaxed">
                                        {profile.adminRemark}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="border-b border-zinc-100 bg-white px-3 py-3 md:px-4">
                        <div className="flex gap-2 overflow-x-auto">
                            {["Overview", "KYC", "Inventory", "Inspection Request", "Activity Logs"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={cls(
                                        "whitespace-nowrap rounded-2xl px-4 py-2.5 text-sm font-semibold transition",
                                        activeTab === tab
                                            ? "bg-zinc-900 text-white shadow-sm"
                                            : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                                    )}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-5 py-5 md:py-6 px-0">
                    {activeTab === "Overview" && (
                        <div className="space-y-5">
                            <SectionCard title="Personal Information" subtitle="User personal details">
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                    <InfoItem label="First Name" value={profile.firstname} />
                                    <InfoItem label="Last Name" value={profile.lastname} />
                                    <InfoItem label="Email" value={profile.email} />
                                    <InfoItem label="Phone Number" value={`${profile.countryCode} ${profile.phone}`} />
                                    <InfoItem label="User Role" value={profile.userRole} />
                                    <InfoItem label="Status" value={profile.status} />
                                    {profile.createdAt && (
                                        <InfoItem
                                            label="Created At"
                                            value={new Date(profile.createdAt).toLocaleString('en-IN')}
                                        />
                                    )}
                                    {profile.updatedAt && (
                                        <InfoItem
                                            label="Updated At"
                                            value={new Date(profile.updatedAt).toLocaleString('en-IN')}
                                        />
                                    )}
                                </div>
                            </SectionCard>

                            {profile.metaDataId && (
                                <SectionCard title="Additional Information" subtitle="Extended user details">
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                        {profile.age !== "—" && <InfoItem label="Age" value={profile.age} />}
                                        <InfoItem label="Profession" value={profile.profession} />
                                        <InfoItem label="Gender" value={profile.gender} />
                                        <InfoItem label="City" value={profile.cityName} />
                                        <InfoItem label="State" value={profile.stateName} />
                                        <InfoItem label="Country" value={profile.countryName} />
                                        {profile.latitude && profile.longitude && (
                                            <InfoItem
                                                label="Coordinates"
                                                value={`${profile.latitude}, ${profile.longitude}`}
                                            />
                                        )}
                                        <InfoItem label="Meta Status" value={profile.metaDataStatus} />
                                        <InfoItem label="Address" value={profile.address} full />
                                    </div>
                                </SectionCard>
                            )}

                        </div>
                    )}

                    {activeTab === "KYC" && (
                        <div className="space-y-5">
                            {profile.sellerId && (
                                <SectionCard title="Seller Information" subtitle="Seller KYC and verification details">
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                        <InfoItem label="PAN Card Number" value={profile.panCardNumber} />
                                        <InfoItem label="Aadhar Card Number" value={profile.aadharCardNumber} />
                                        <InfoItem label="Verification Status" value={profile.verificationStatus} />
                                        <InfoItem label="Seller Status" value={profile.sellerStatus} />
                                        {profile.verifiedAt && (
                                            <InfoItem
                                                label="Verified At"
                                                value={new Date(profile.verifiedAt).toLocaleString('en-IN')}
                                            />
                                        )}
                                        <InfoItem label="Admin Remark" value={profile.adminRemark} full />
                                    </div>
                                </SectionCard>
                            )}

                            <SectionCard title="KYC Documents" subtitle="User verification documents">
                                {profile.sellerId ? (
                                    <div className="flex flex-wrap gap-2">
                                        <DocChip
                                            ok={!!profile.panCardFrontUrl}
                                            clickable={!!profile.panCardFrontUrl}
                                            onClick={() =>
                                                openDocModal("PAN Card", profile.panCardFrontUrl)
                                            }
                                            text={`PAN Card • ${profile.panCardFrontUrl ? "Click to View" : "Missing"}`}
                                        />

                                        <DocChip
                                            ok={!!profile.aadharCardFrontUrl}
                                            clickable={!!profile.aadharCardFrontUrl}
                                            onClick={() =>
                                                openDocModal("Aadhar Card (Front)", profile.aadharCardFrontUrl)
                                            }
                                            text={`Aadhar Front • ${profile.aadharCardFrontUrl ? "Click to View" : "Missing"}`}
                                        />

                                        <DocChip
                                            ok={!!profile.aadharCardBackUrl}
                                            clickable={!!profile.aadharCardBackUrl}
                                            onClick={() =>
                                                openDocModal("Aadhar Card (Back)", profile.aadharCardBackUrl)
                                            }
                                            text={`Aadhar Back • ${profile.aadharCardBackUrl ? "Click to View" : "Missing"}`}
                                        />
                                    </div>
                                ) : (
                                    <div className="py-12 text-center">
                                        <div className="text-sm font-semibold text-zinc-500">User is not a seller</div>
                                        <p className="mt-1 text-xs text-zinc-400">No KYC documents available</p>
                                    </div>
                                )}
                            </SectionCard>
                        </div>
                    )}

                    {activeTab === "Inventory" && (
                        <div className="space-y-5">
                            {/* Search Bar and Filter */}
                            <div className="rounded-[28px] border border-zinc-200 bg-white p-4 shadow-sm">
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                        <input
                                            type="text"
                                            placeholder="Search by vehicle name..."
                                            value={inventorySearch}
                                            onChange={(e) => setInventorySearch(e.target.value)}
                                            className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 outline-none transition focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="relative sm:w-56">
                                        <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                        <select
                                            value={inventoryStatusFilter}
                                            onChange={(e) => setInventoryStatusFilter(e.target.value)}
                                            className="w-full appearance-none rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-10 text-sm text-zinc-900 outline-none transition focus:border-blue-500 cursor-pointer"
                                        >
                                            <option value="ALL">All Status</option>
                                            <option value="ACTIVE">Active</option>
                                            <option value="INACTIVE">Inactive</option>
                                            <option value="SOLD">Sold</option>
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="rounded-[28px] border border-zinc-200 bg-white shadow-sm overflow-hidden">
                                <div className="border-b border-zinc-100 px-5 py-4">
                                    <h3 className="text-base font-semibold text-zinc-900">Vehicle Inventory</h3>
                                    <p className="text-sm text-zinc-500">{filteredVehicles.length} vehicles found</p>
                                </div>

                                {paginatedVehicles.length > 0 ? (
                                    <>
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="bg-zinc-50">
                                                    <tr>
                                                        <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-zinc-600">Vehicle</th>
                                                        <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-zinc-600">Price</th>
                                                        <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-zinc-600">Verification</th>
                                                        <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-zinc-600">Inspection</th>
                                                        <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-zinc-600">Status</th>
                                                        <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-zinc-600">Listed Date</th>
                                                        <th className="px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-zinc-600">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-zinc-100">
                                                    {paginatedVehicles.map((vehicle) => (
                                                        <tr key={vehicle.vehicleId} className="transition-colors hover:bg-zinc-50">
                                                            <td className="px-5 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
                                                                        {vehicle.thumbnailUrl ? (
                                                                            <img
                                                                                src={vehicle.thumbnailUrl}
                                                                                alt={vehicle.vehicleTitle}
                                                                                className="h-full w-full object-cover"
                                                                            />
                                                                        ) : (
                                                                            <div className="flex h-full w-full items-center justify-center text-zinc-400">
                                                                                <ImageIcon className="h-5 w-5" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <div className="text-sm font-semibold text-zinc-900 line-clamp-1">
                                                                            {vehicle.vehicleTitle}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-4">
                                                                <div className="text-sm font-bold text-emerald-600">
                                                                    ₹{Number(vehicle.price).toLocaleString('en-IN')}
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-4">
                                                                <span
                                                                    className={cls(
                                                                        "inline-flex rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider",
                                                                        vehicle.verificationStatus === "VERIFIED"
                                                                            ? "bg-emerald-50 text-emerald-700"
                                                                            : vehicle.verificationStatus === "REJECTED"
                                                                                ? "bg-rose-50 text-rose-700"
                                                                                : "bg-amber-50 text-amber-700"
                                                                    )}
                                                                >
                                                                    {vehicle.verificationStatus}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-4">
                                                                <span
                                                                    className={cls(
                                                                        "inline-flex rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider",
                                                                        vehicle.inspectionStatus === "AI_INSPECTED" || vehicle.inspectionStatus === "MANUAL_INSPECTED" || vehicle.inspectionStatus === "AVX_INSPECTED"
                                                                            ? "bg-blue-50 text-blue-700"
                                                                            : "bg-zinc-100 text-zinc-700"
                                                                    )}
                                                                >
                                                                    {vehicle.inspectionStatus?.replace(/_/g, ' ')}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-4">
                                                                {vehicle.isVehicleSold ? (
                                                                    <span className="inline-flex rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700">
                                                                        SOLD
                                                                    </span>
                                                                ) : (
                                                                    <span className={cls(
                                                                        "inline-flex rounded-full px-2.5 py-1 text-xs font-bold",
                                                                        vehicle.status === "ACTIVE"
                                                                            ? "bg-emerald-50 text-emerald-700"
                                                                            : "bg-slate-50 text-slate-700"
                                                                    )}>
                                                                        {vehicle.status}
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="px-5 py-4">
                                                                <div className="text-sm text-zinc-600">
                                                                    {new Date(vehicle.createdAt).toLocaleDateString('en-IN', {
                                                                        day: 'numeric',
                                                                        month: 'short',
                                                                        year: 'numeric'
                                                                    })}
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-4 text-center">
                                                                <button
                                                                    onClick={() => navigate(`/admin/vehicles/${vehicle.vehicleId}`, { state: { fromUserInventory: true } })}
                                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition-all hover:bg-zinc-50 hover:text-zinc-900"
                                                                    title="View Vehicle Details"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Pagination Footer */}
                                        <div className="border-t border-zinc-100 bg-zinc-50 px-5 py-4">
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm text-zinc-600">
                                                    Page {inventoryPage} / {totalVehiclePages || 1} • {filteredVehicles.length} total records
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setInventoryPage(p => Math.max(1, p - 1))}
                                                        disabled={inventoryPage === 1}
                                                        className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <ChevronLeft className="h-4 w-4" />
                                                        Prev
                                                    </button>
                                                    <button
                                                        onClick={() => setInventoryPage(p => Math.min(totalVehiclePages || 1, p + 1))}
                                                        disabled={inventoryPage === totalVehiclePages || totalVehiclePages === 0}
                                                        className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        Next
                                                        <ChevronRight className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="py-12 text-center">
                                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 mb-3">
                                            <ImageIcon className="h-8 w-8" />
                                        </div>
                                        <div className="text-sm font-semibold text-zinc-500">
                                            {inventorySearch ? "No vehicles match your search" : "No vehicles found"}
                                        </div>
                                        <p className="mt-1 text-xs text-zinc-400">
                                            {inventorySearch ? "Try a different search term" : "This user hasn't listed any vehicles yet"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "Inspection Request" && (
                        <SectionCard title="Inspection Requests" subtitle={`${profile.inspectionRequests?.length || 0} inspection requests found`}>
                            {profile.inspectionRequests && profile.inspectionRequests.length > 0 ? (
                                <div className="space-y-3">
                                    {profile.inspectionRequests.map((request) => (
                                        <div
                                            key={request.inspectionRequestId}
                                            className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
                                                            <div className="flex h-full w-full items-center justify-center text-zinc-400">
                                                                <ImageIcon className="h-5 w-5" />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="text-sm font-bold text-zinc-900">{request.vehicleTitle}</h4>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-sm font-bold text-emerald-600">
                                                                    ₹{Number(request.price).toLocaleString('en-IN')}
                                                                </span>
                                                                {request.discountedPrice && (
                                                                    <span className="text-xs text-zinc-500 line-through">
                                                                        ₹{Number(request.discountedPrice).toLocaleString('en-IN')}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                                        <div>
                                                            <span className="text-zinc-500">Status:</span>
                                                            <span
                                                                className={cls(
                                                                    "ml-2 inline-flex rounded-full px-2 py-0.5 text-xs font-bold",
                                                                    request.inspectionRequestStatus === "COMPLETED"
                                                                        ? "bg-emerald-50 text-emerald-700"
                                                                        : request.inspectionRequestStatus === "SCHEDULED"
                                                                            ? "bg-blue-50 text-blue-700"
                                                                            : request.inspectionRequestStatus === "CANCELLED"
                                                                                ? "bg-rose-50 text-rose-700"
                                                                                : "bg-amber-50 text-amber-700"
                                                                )}
                                                            >
                                                                {request.inspectionRequestStatus}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="text-zinc-500">Request Status:</span>
                                                            <span className="ml-2 font-semibold text-zinc-900">{request.status}</span>
                                                        </div>
                                                        {request.scheduledAt && (
                                                            <div>
                                                                <span className="text-zinc-500">Scheduled:</span>
                                                                <span className="ml-2 font-semibold text-zinc-900">
                                                                    {new Date(request.scheduledAt).toLocaleString('en-IN')}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {request.inspectionCompletedAt && (
                                                            <div>
                                                                <span className="text-zinc-500">Completed:</span>
                                                                <span className="ml-2 font-semibold text-zinc-900">
                                                                    {new Date(request.inspectionCompletedAt).toLocaleString('en-IN')}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <span className="text-zinc-500">Created:</span>
                                                            <span className="ml-2 font-semibold text-zinc-900">
                                                                {new Date(request.createdAt).toLocaleString('en-IN')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <div className="text-sm font-semibold text-zinc-500">No inspection requests found</div>
                                </div>
                            )}
                        </SectionCard>
                    )}

                    {activeTab === "Activity Logs" && (
                        <SectionCard title="Activity Logs" subtitle={`${profile.activityLogs?.length || 0} logs found`}>
                            {profile.activityLogs && profile.activityLogs.length > 0 ? (
                                <div className="space-y-4">
                                    {profile.activityLogs.map((log) => (
                                        <div
                                            key={log.activityId}
                                            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start gap-4">
                                                {/* Icon */}
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50">
                                                    <Activity className="h-6 w-6 text-blue-600" />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-4 mb-3">
                                                        <div>
                                                            <h4 className="text-base font-bold text-zinc-900 uppercase">
                                                                {log.action}
                                                            </h4>
                                                            <p className="text-sm text-zinc-600 mt-1">
                                                                {log.description}
                                                            </p>
                                                        </div>
                                                        <div className="text-right shrink-0">
                                                            <div className="flex items-center gap-1 text-xs text-zinc-500">
                                                                <Clock3 className="h-3 w-3" />
                                                                {new Date(log.performedAt).toLocaleDateString('en-IN', {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    year: 'numeric'
                                                                })}
                                                            </div>
                                                            <div className="text-xs text-zinc-500 mt-1">
                                                                {new Date(log.performedAt).toLocaleTimeString('en-IN', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                    hour12: true
                                                                })}
                                                            </div>
                                                            <div className="text-xs text-zinc-400 mt-1">
                                                                by {log.adminName || 'System'}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Additional Details */}
                                                    <div className="rounded-xl bg-zinc-50 border border-zinc-100 p-3">
                                                        <div className="text-xs font-bold uppercase tracking-wide text-zinc-500 mb-2">
                                                            Additional Details
                                                        </div>
                                                        <div className="grid grid-cols-1 gap-2 text-sm">
                                                            <div className="flex">
                                                                <span className="text-zinc-500 w-32">Admin:</span>
                                                                <span className="font-semibold text-zinc-900">{log.adminName || 'System'}</span>
                                                            </div>
                                                            <div className="flex">
                                                                <span className="text-zinc-500 w-32">Action:</span>
                                                                <span className="font-semibold text-zinc-900">{log.action}</span>
                                                            </div>
                                                            <div className="flex">
                                                                <span className="text-zinc-500 w-32">Description:</span>
                                                                <span className="font-semibold text-zinc-900">{log.description}</span>
                                                            </div>
                                                            {log.remarks && (
                                                                <div className="flex">
                                                                    <span className="text-zinc-500 w-32">Remarks:</span>
                                                                    <span className="font-semibold text-zinc-900">{log.remarks}</span>
                                                                </div>
                                                            )}
                                                            <div className="flex">
                                                                <span className="text-zinc-500 w-32">Performed At:</span>
                                                                <span className="font-semibold text-zinc-900">
                                                                    {new Date(log.performedAt).toLocaleString('en-IN', {
                                                                        day: 'numeric',
                                                                        month: 'short',
                                                                        year: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit',
                                                                        second: '2-digit',
                                                                        hour12: true
                                                                    })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <div className="text-sm font-semibold text-zinc-500">No activity logs found</div>
                                </div>
                            )}
                        </SectionCard>
                    )}
                </div>
            </div>

            {/* ================= DOCUMENT MODAL ================= */}
            <DocumentImageModal
                open={docModal.open}
                onClose={closeDocModal}
                title={docModal.title}
                imageUrl={docModal.imageUrl}
            />

            {/* ================= SUSPEND USER MODAL ================= */}
            <SuspendUserModal
                open={suspendModalOpen}
                userName={profile?.fullName}
                suspendReason={suspendReason}
                setSuspendReason={setSuspendReason}
                suspendDescription={suspendDescription}
                setSuspendDescription={setSuspendDescription}
                suspendType={suspendType}
                setSuspendType={setSuspendType}
                suspendUntil={suspendUntil}
                setSuspendUntil={setSuspendUntil}
                loading={suspendLoading}
                onClose={() => {
                    setSuspendModalOpen(false);
                    setSuspendReason("");
                    setSuspendDescription("");
                    setSuspendType("TEMPORARY");
                    setSuspendUntil("");
                }}
                onConfirm={handleSuspendUser}
            />

            {/* ================= FLAG REVIEW MODAL ================= */}
            <FlagReviewModal
                open={flagReviewModalOpen}
                userName={profile?.fullName}
                flagCategory={flagCategory}
                setFlagCategory={setFlagCategory}
                flagSeverity={flagSeverity}
                setFlagSeverity={setFlagSeverity}
                flagNotes={flagNotes}
                setFlagNotes={setFlagNotes}
                loading={flagLoading}
                onClose={() => {
                    setFlagReviewModalOpen(false);
                    setFlagCategory("");
                    setFlagSeverity("");
                    setFlagNotes("");
                }}
                onConfirm={handleFlagReview}
            />

            {/* ================= UNSUSPEND USER MODAL ================= */}
            <UnsuspendUserModal
                open={unsuspendModalOpen}
                userName={profile?.fullName}
                unsuspendReason={unsuspendReason}
                setUnsuspendReason={setUnsuspendReason}
                loading={unsuspendLoading}
                onClose={() => {
                    setUnsuspendModalOpen(false);
                    setUnsuspendReason("");
                }}
                onConfirm={handleUnsuspendUser}
            />

            {/* ================= CLEAR FLAG MODAL ================= */}
            <ClearFlagModal
                open={clearFlagModalOpen}
                userName={profile?.fullName}
                clearFlagReason={clearFlagReason}
                setClearFlagReason={setClearFlagReason}
                loading={clearFlagLoading}
                onClose={() => {
                    setClearFlagModalOpen(false);
                    setClearFlagReason("");
                }}
                onConfirm={handleClearFlag}
            />

            {/* ================= APPROVE KYC MODAL ================= */}
            <ApproveKYCModal
                open={approveKYCModalOpen}
                userName={profile?.fullName}
                reason={approveKYCReason}
                setReason={setApproveKYCReason}
                loading={approveKYCLoading}
                onClose={() => {
                    setApproveKYCModalOpen(false);
                    setApproveKYCReason("");
                }}
                onConfirm={handleApproveKYC}
            />

            {/* ================= REJECT KYC MODAL ================= */}
            <RejectKYCModal
                open={rejectKYCModalOpen}
                userName={profile?.fullName}
                reason={rejectKYCReason}
                setReason={setRejectKYCReason}
                loading={rejectKYCLoading}
                onClose={() => {
                    setRejectKYCModalOpen(false);
                    setRejectKYCReason("");
                }}
                onConfirm={handleRejectKYC}
            />

            {/* ================= REQUEST CHANGES KYC MODAL ================= */}
            <RequestChangesKYCModal
                open={requestChangesKYCModalOpen}
                userName={profile?.fullName}
                reason={requestChangesKYCReason}
                setReason={setRequestChangesKYCReason}
                loading={requestChangesKYCLoading}
                onClose={() => {
                    setRequestChangesKYCModalOpen(false);
                    setRequestChangesKYCReason("");
                }}
                onConfirm={handleRequestChangesKYC}
            />
        </div>
    );
};

export default UserDetails;
