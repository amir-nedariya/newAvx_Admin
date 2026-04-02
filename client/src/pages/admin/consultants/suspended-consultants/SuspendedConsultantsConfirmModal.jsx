import { useState } from "react";
import { X, Loader2, RotateCcw } from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

export default function SuspendedConsultantsConfirmModal({
    modal,
    loading,
    onClose,
    onConfirm,
}) {
    const [reason, setReason] = useState("");

    if (!modal) return null;

    const handleConfirm = () => {
        if (modal.type === "unsuspend") {
            if (!reason.trim()) {
                alert("Please provide a reason for unsuspending");
                return;
            }
            onConfirm?.({ ...modal, reason: reason.trim() });
        }
    };

    const handleClose = () => {
        setReason("");
        onClose?.();
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
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-600">
                        <RotateCcw className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                            {modal.title || "Confirm Action"}
                        </h2>
                        <p className="mt-1 text-sm font-medium text-slate-500">
                            {modal.type === "unsuspend" && "Restore consultant access"}
                        </p>
                    </div>
                </div>

                {modal.type === "unsuspend" && (
                    <div className="mb-6">
                        <label className="mb-2 block text-sm font-bold text-slate-700">
                            Reason for Unsuspending
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Provide a reason for restoring this consultant..."
                            rows={4}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition-all focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 placeholder:text-slate-400"
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
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-600/30 active:scale-95 disabled:opacity-50"
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
