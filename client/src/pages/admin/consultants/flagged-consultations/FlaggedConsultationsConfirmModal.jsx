import { useState } from "react";
import { X, Loader2, Ban, CheckCircle2, AlertTriangle, TrendingDown } from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

const SUSPENSION_REASONS = [
    "Fake documents",
    "Fraudulent activity",
    "Policy violation",
    "Spam or misleading content",
    "Customer complaints",
    "Quality issues",
    "Other",
];

export default function FlaggedConsultationsConfirmModal({
    modal,
    loading,
    onClose,
    onConfirm,
}) {
    const [reason, setReason] = useState("");
    const [suspensionType, setSuspensionType] = useState("TEMPORARY");
    const [date, setDate] = useState("");
    const [deduction, setDeduction] = useState("");

    if (!modal) return null;

    const handleConfirm = () => {
        if (modal.type === "suspend") {
            if (!reason.trim()) {
                alert("Please select a reason for suspension");
                return;
            }
            if (suspensionType === "TEMPORARY" && !date) {
                alert("Please select suspension end date");
                return;
            }
            onConfirm?.({
                ...modal,
                reason: reason.trim(),
                meta: { reason: reason.trim(), suspensionType, date },
            });
        } else if (modal.type === "clear") {
            if (!reason.trim()) {
                alert("Please provide a reason for clearing the flag");
                return;
            }
            onConfirm?.({ ...modal, meta: { reason: reason.trim() } });
        } else if (modal.type === "penalty") {
            if (!reason.trim()) {
                alert("Please provide a reason for the penalty");
                return;
            }
            if (!deduction || isNaN(deduction)) {
                alert("Please provide a valid deduction amount");
                return;
            }
            onConfirm?.({
                ...modal,
                meta: { reason: reason.trim(), deduction: Number(deduction) },
            });
        } else if (modal.type === "escalate") {
            if (!reason.trim()) {
                alert("Please provide escalation details");
                return;
            }
            onConfirm?.({ ...modal, meta: { reason: reason.trim() } });
        }
    };

    const handleClose = () => {
        setReason("");
        setSuspensionType("TEMPORARY");
        setDate("");
        setDeduction("");
        onClose?.();
    };

    const getIcon = () => {
        switch (modal.type) {
            case "suspend":
                return <Ban className="h-6 w-6" />;
            case "clear":
                return <CheckCircle2 className="h-6 w-6" />;
            case "penalty":
                return <TrendingDown className="h-6 w-6" />;
            case "escalate":
                return <AlertTriangle className="h-6 w-6" />;
            default:
                return null;
        }
    };

    const getIconColor = () => {
        switch (modal.type) {
            case "suspend":
                return "border-rose-200 bg-rose-50 text-rose-600";
            case "clear":
                return "border-emerald-200 bg-emerald-50 text-emerald-600";
            case "penalty":
                return "border-amber-200 bg-amber-50 text-amber-600";
            case "escalate":
                return "border-indigo-200 bg-indigo-50 text-indigo-600";
            default:
                return "border-slate-200 bg-slate-50 text-slate-600";
        }
    };

    const getButtonColor = () => {
        switch (modal.type) {
            case "suspend":
                return "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-lg shadow-rose-500/30";
            case "clear":
                return "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20 hover:shadow-emerald-600/30";
            case "penalty":
                return "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20 hover:shadow-amber-600/30";
            case "escalate":
                return "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20 hover:shadow-indigo-600/30";
            default:
                return "bg-slate-900 hover:bg-slate-800 shadow-slate-900/20 hover:shadow-slate-900/30";
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-200 px-8 py-6 bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div
                            className={cls(
                                "flex h-14 w-14 items-center justify-center rounded-2xl border shadow-sm",
                                getIconColor()
                            )}
                        >
                            {getIcon()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                                {modal.title || "Confirm Action"}
                            </h2>
                            <p className="mt-1 text-sm font-medium text-slate-500">
                                {modal.item?.consultationName || modal.item?.consultName || "Consultant"}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-200 bg-white text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 disabled:opacity-50 active:scale-95"
                        type="button"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-8 py-6 bg-slate-50/30">
                    {modal.type === "suspend" && (
                        <div className="space-y-6">
                            {/* Reason Dropdown */}
                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Reason for Suspension
                                </label>
                                <div className="relative">
                                    <select
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        className="w-full appearance-none rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 pr-10 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
                                    >
                                        <option value="">Select reason</option>
                                        {SUSPENSION_REASONS.map((r) => (
                                            <option key={r} value={r}>
                                                {r}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                                        <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Suspension Type */}
                            <div>
                                <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Suspension Type
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setSuspensionType("TEMPORARY")}
                                        className={cls(
                                            "rounded-2xl border-2 p-5 text-left transition-all",
                                            suspensionType === "TEMPORARY"
                                                ? "border-sky-400 bg-sky-50/50 shadow-sm"
                                                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                                        )}
                                    >
                                        <div className="text-base font-bold text-slate-900">Temporary</div>
                                        <div className="mt-1 text-sm text-slate-500">Suspend for limited time</div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setSuspensionType("PERMANENT")}
                                        className={cls(
                                            "rounded-2xl border-2 p-5 text-left transition-all",
                                            suspensionType === "PERMANENT"
                                                ? "border-sky-400 bg-sky-50/50 shadow-sm"
                                                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                                        )}
                                    >
                                        <div className="text-base font-bold text-slate-900">Permanent</div>
                                        <div className="mt-1 text-sm text-slate-500">Until manually restored</div>
                                    </button>
                                </div>
                            </div>

                            {/* Suspend Until Date */}
                            {suspensionType === "TEMPORARY" && (
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Suspend Until
                                    </label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        min={new Date().toISOString().slice(0, 10)}
                                        className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
                                    />
                                    <p className="mt-2 text-xs text-slate-500">
                                        Select a future date for suspension end
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {modal.type === "clear" && (
                        <div>
                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                Clearance Reason
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Explain why this flag is being cleared..."
                                rows={4}
                                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition-all focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 placeholder:text-slate-400 resize-none"
                            />
                        </div>
                    )}

                    {modal.type === "penalty" && (
                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Deduction Amount (Points)
                                </label>
                                <input
                                    type="number"
                                    value={deduction}
                                    onChange={(e) => setDeduction(e.target.value)}
                                    placeholder="e.g., 10"
                                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-amber-400 focus:ring-4 focus:ring-amber-100 placeholder:text-slate-400"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Reason for Penalty
                                </label>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Explain the reason for this penalty..."
                                    rows={4}
                                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition-all focus:border-amber-400 focus:ring-4 focus:ring-amber-100 placeholder:text-slate-400 resize-none"
                                />
                            </div>
                        </div>
                    )}

                    {modal.type === "escalate" && (
                        <div>
                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                Escalation Details
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Provide details for escalation..."
                                rows={4}
                                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 placeholder:text-slate-400 resize-none"
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-8 py-5 rounded-b-3xl">
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95 disabled:opacity-50"
                        type="button"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className={cls(
                            "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-all hover:shadow-xl active:scale-95 disabled:opacity-50",
                            getButtonColor()
                        )}
                        type="button"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                {modal.type === "suspend" && <Ban className="h-4 w-4" />}
                                {modal.type === "suspend" ? "Confirm Suspend" : "Confirm"}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
