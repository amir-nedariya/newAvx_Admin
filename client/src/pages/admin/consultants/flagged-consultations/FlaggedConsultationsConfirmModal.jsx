import { useState } from "react";
import { X, Loader2, Ban, CheckCircle2, AlertTriangle, TrendingDown } from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

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
                alert("Please provide a reason for suspension");
                return;
            }
            if (suspensionType === "TEMPORARY" && !date) {
                alert("Please select suspension end date");
                return;
            }
            onConfirm?.({
                ...modal,
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
                return "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20 hover:shadow-rose-600/30";
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
            <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl">
                <button
                    onClick={handleClose}
                    disabled={loading}
                    className="absolute right-6 top-6 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
                    type="button"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="mb-6 flex items-center gap-4">
                    <div
                        className={cls(
                            "flex h-14 w-14 items-center justify-center rounded-2xl border",
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
                            {modal.type === "suspend" && "Suspend consultant access"}
                            {modal.type === "clear" && "Clear this flag review"}
                            {modal.type === "penalty" && "Apply ranking penalty"}
                            {modal.type === "escalate" && "Escalate for investigation"}
                        </p>
                    </div>
                </div>

                {modal.type === "suspend" && (
                    <div className="mb-6 space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-bold text-slate-700">
                                Suspension Type
                            </label>
                            <select
                                value={suspensionType}
                                onChange={(e) => setSuspensionType(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition-all focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
                            >
                                <option value="TEMPORARY">Temporary</option>
                                <option value="PERMANENT">Permanent</option>
                            </select>
                        </div>

                        {suspensionType === "TEMPORARY" && (
                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Suspend Until
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition-all focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
                                />
                            </div>
                        )}

                        <div>
                            <label className="mb-2 block text-sm font-bold text-slate-700">
                                Reason for Suspension
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Provide a detailed reason for suspending this consultant..."
                                rows={4}
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition-all focus:border-rose-400 focus:ring-4 focus:ring-rose-100 placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                )}

                {modal.type === "clear" && (
                    <div className="mb-6">
                        <label className="mb-2 block text-sm font-bold text-slate-700">
                            Clearance Reason
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Explain why this flag is being cleared..."
                            rows={4}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition-all focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 placeholder:text-slate-400"
                        />
                    </div>
                )}

                {modal.type === "penalty" && (
                    <div className="mb-6 space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-bold text-slate-700">
                                Deduction Amount (Points)
                            </label>
                            <input
                                type="number"
                                value={deduction}
                                onChange={(e) => setDeduction(e.target.value)}
                                placeholder="e.g., 10"
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition-all focus:border-amber-400 focus:ring-4 focus:ring-amber-100 placeholder:text-slate-400"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-bold text-slate-700">
                                Reason for Penalty
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Explain the reason for this penalty..."
                                rows={4}
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition-all focus:border-amber-400 focus:ring-4 focus:ring-amber-100 placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                )}

                {modal.type === "escalate" && (
                    <div className="mb-6">
                        <label className="mb-2 block text-sm font-bold text-slate-700">
                            Escalation Details
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Provide details for escalation..."
                            rows={4}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 placeholder:text-slate-400"
                        />
                    </div>
                )}

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="flex-1 rounded-xl border-2 border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95 disabled:opacity-50"
                        type="button"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className={cls(
                            "flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl active:scale-95 disabled:opacity-50",
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
                            "Confirm"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
