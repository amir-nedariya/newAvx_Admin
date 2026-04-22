import React, { useState } from "react";
import { XCircle, ShieldCheck, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { unsuspendVehicle } from "../../../../../api/vehicle.api";

const cls = (...a) => a.filter(Boolean).join(" ");

const UnsuspendListingModal = ({ isOpen, onClose, vehicleId, vehicleTitle, onSuccess }) => {
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            setLoading(true);

            await unsuspendVehicle({
                vehicleId,
                reason: reason.trim() || null,
            });

            toast.success("Vehicle unsuspended successfully!");
            setReason("");
            onClose();

            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error("Unsuspend failed:", error);
            toast.error(error?.response?.data?.message || "Failed to unsuspend vehicle");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="fixed left-1/2 top-1/2 z-[111] w-[95%] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-zinc-200 bg-white shadow-2xl">
                <div className="flex items-start justify-between border-b border-zinc-100 px-6 py-5">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50">
                            <ShieldCheck className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-zinc-900">Restore Vehicle Listing</h3>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-900"
                    >
                        <XCircle size={18} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                        <p className="text-sm font-semibold text-emerald-800">
                            This vehicle will be restored and made visible on the marketplace again.
                        </p>
                    </div>

                    <div className="mb-6">
                        <label className="mb-2 block text-sm font-bold text-zinc-700">
                            REASON FOR UNSUSPENSION
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={4}
                            placeholder="Document why this vehicle is being unsuspended (optional)..."
                            className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="rounded-xl border border-zinc-200 bg-white px-6 py-2.5 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50"
                        >
                            Go Back
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={cls(
                                "inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                            )}
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            {loading ? "Restoring..." : "Confirm Restore"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UnsuspendListingModal;
