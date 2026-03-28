import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  AlertTriangle,
  Ban,
  CalendarDays,
  ChevronDown,
  Loader2,
  X
} from "lucide-react";
import { suspendVehicle } from "../../../../../api/vehicle.api";
import toast from "react-hot-toast";

const cls = (...a) => a.filter(Boolean).join(" ");

const SuspendListingModal = ({ isOpen, onClose, vehicleId, vehicleTitle, onSuccess }) => {
  const [reason, setReason] = useState("");
  const [type, setType] = useState("TEMPORARY");
  const [suspendUntil, setSuspendUntil] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setReason("");
      setType("TEMPORARY");
      setSuspendUntil("");
      setError("");
    }
  }, [isOpen]);

  const handleSuspend = async () => {
    try {
      setError("");

      if (!vehicleId) {
        setError("Vehicle ID not found.");
        return;
      }

      if (!reason.trim()) {
        setError("Please select a reason.");
        return;
      }

      if (type === "TEMPORARY" && !suspendUntil) {
        setError("Please select suspend until date & time.");
        return;
      }

      setLoading(true);

      const payload = {
        vehicleId,
        reason: reason.trim(),
        suspendType: type,
        suspendUntil: type === "TEMPORARY" ? suspendUntil : null,
      };

      const response = await suspendVehicle(payload);
      toast.success(response?.message || "Vehicle suspended successfully");

      if (onSuccess) onSuccess();
      onClose();
    } catch (e) {
      console.error("Suspend Vehicle Error:", e);
      const msg = e?.response?.data?.message || e?.message || "Failed to suspend vehicle";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
      />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
        <div className="border-b border-slate-200 bg-gradient-to-r from-rose-50 to-white px-5 py-5 md:px-6 flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
              <Ban className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Suspend Vehicle Listing
              </h1>
              {vehicleTitle && (
                <p className="mt-1 text-[14px] font-bold text-slate-900">
                  {vehicleTitle}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 md:p-6 space-y-6">
          <label className="block">
            <div className="mb-2 text-[12px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Reason for Suspension
            </div>

            <div className="relative">
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-10 text-[14px] font-medium text-slate-900 outline-none transition-all focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
              >
                <option value="">Select reason</option>
                <option value="Fake photos">Fake photos</option>
                <option value="Fraud suspicion">Fraud suspicion</option>
                <option value="Price manipulation">Price manipulation</option>
                <option value="Duplicate listing">Duplicate listing</option>
                <option value="Meri Marzi">Meri Marzi</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </label>

          <label className="block">
            <div className="mb-2 text-[12px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Suspension Type
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType("TEMPORARY")}
                className={cls(
                  "rounded-2xl border px-4 py-4 text-left transition-all",
                  type === "TEMPORARY"
                    ? "border-sky-300 bg-sky-50 ring-4 ring-sky-100"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                )}
              >
                <div className="text-sm font-bold text-slate-900">
                  Temporary
                </div>
                <div className="mt-1 text-xs text-slate-500 font-medium">
                  Suspend for limited time
                </div>
              </button>

              <button
                type="button"
                onClick={() => setType("PERMANENT")}
                className={cls(
                  "rounded-2xl border px-4 py-4 text-left transition-all",
                  type === "PERMANENT"
                    ? "border-rose-300 bg-rose-50 ring-4 ring-rose-100"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                )}
              >
                <div className="text-sm font-bold text-slate-900">
                  Permanent
                </div>
                <div className="mt-1 text-xs text-slate-500 font-medium">
                  Until manually restored
                </div>
              </button>
            </div>
          </label>

          {type === "TEMPORARY" && (
            <label className="block">
              <div className="mb-2 text-[12px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Suspend Until
              </div>

              <div className="relative">
                <input
                  type="datetime-local"
                  value={suspendUntil}
                  onChange={(e) => setSuspendUntil(e.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-[14px] font-medium text-slate-900 outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
              </div>

              <p className="mt-2 text-xs text-slate-400 font-medium">
                Example: 2026-03-10T18:30
              </p>
            </label>
          )}

          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              onClick={onClose}
              disabled={loading}
              type="button"
              className="rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 active:scale-95 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={handleSuspend}
              disabled={loading}
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-rose-700 active:scale-95 disabled:opacity-50 shadow-lg shadow-rose-200"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Ban className="h-4 w-4" />
                  Confirm Suspend
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div >
  );
};

export default SuspendListingModal;