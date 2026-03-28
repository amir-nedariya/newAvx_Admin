import React, { useState, useEffect } from "react";
import { 
  Flag, 
  AlertTriangle, 
  ChevronDown, 
  Loader2, 
  X,
  AlertCircle,
  MessageSquareQuote
} from "lucide-react";
import { flagVehicleForReview } from "../../../../../api/vehicle.api";
import toast from "react-hot-toast";

const cls = (...a) => a.filter(Boolean).join(" ");

const FlagForReviewModal = ({ isOpen, onClose, vehicleId, vehicleTitle, onSuccess }) => {
  const [flagCategory, setFlagCategory] = useState("");
  const [severity, setSeverity] = useState("LOW");
  const [internalNotes, setInternalNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setFlagCategory("");
      setSeverity("LOW");
      setInternalNotes("");
      setError("");
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    try {
      setError("");

      if (!vehicleId) {
        setError("Vehicle ID not found.");
        return;
      }

      if (!flagCategory) {
        setError("Please select a flag category.");
        return;
      }

      if (!internalNotes.trim()) {
        setError("Please provide internal notes.");
        return;
      }

      setLoading(true);

      const payload = {
        vehicleId,
        flagCategory,
        severity,
        internalNotes: internalNotes.trim(),
      };

      const response = await flagVehicleForReview(payload);
      toast.success(response?.message || "Vehicle flagged for review");
      
      if (onSuccess) onSuccess();
      onClose();
    } catch (e) {
      console.error("Flag Vehicle Error:", e);
      const msg = e?.response?.data?.message || e?.message || "Failed to flag vehicle";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" 
      />

      {/* MODAL CARD */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_12px_45px_rgba(15,23,42,0.12)]">
        <div className="border-b border-slate-200 bg-gradient-to-r from-rose-50 to-white px-5 py-5 md:px-6 flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
              <Flag className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Flag Vehicle For Review
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
          {/* CATEGORY */}
          <label className="block">
            <div className="mb-2 text-[12px] font-bold uppercase tracking-[0.16em] text-slate-500 flex items-center gap-2">
              <AlertCircle size={14} className="text-rose-500" />
              Flag Category
            </div>

            <div className="relative">
              <select
                value={flagCategory}
                onChange={(e) => setFlagCategory(e.target.value)}
                className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-10 text-[14px] font-medium text-slate-900 outline-none transition-all focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
              >
                <option value="">Select Category</option>
                <option value="FRAUD_SUSPICION">⚠️ Fraud Suspicion</option>
                <option value="SUSPICIOUS_PRICING">💰 Suspicious Pricing</option>
                <option value="FAKE_INQUIRIES">📉 Fake Inquiries</option>
                <option value="POLICY_VIOLATION">🚫 Policy Violation</option>
                <option value="DATA_INCONSISTENCY">🌀 Data Inconsistency</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </label>

          {/* SEVERITY */}
          <label className="block">
            <div className="mb-2 text-[12px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Severity Level
            </div>

            <div className="grid grid-cols-3 gap-3">
              {["LOW", "MODERATE", "HIGH"].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSeverity(lvl)}
                  className={cls(
                    "rounded-2xl border px-3 py-3 text-center transition-all",
                    severity === lvl
                      ? (lvl === "HIGH" ? "border-rose-300 bg-rose-50 ring-4 ring-rose-100" : 
                         lvl === "MODERATE" ? "border-amber-300 bg-amber-50 ring-4 ring-amber-100" :
                         "border-sky-300 bg-sky-50 ring-4 ring-sky-100")
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  )}
                >
                  <div className="text-[13px] font-bold text-slate-900">
                    {lvl}
                  </div>
                </button>
              ))}
            </div>
          </label>

          {/* INTERNAL NOTES */}
          <label className="block">
            <div className="mb-2 text-[12px] font-bold uppercase tracking-[0.16em] text-slate-500 flex items-center gap-2">
              <MessageSquareQuote size={14} />
              Internal Administrative Notes
            </div>

            <textarea
              rows="4"
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="Why are you flagging this vehicle? Be specific for the auditing team..."
              className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-[14px] font-medium text-slate-900 outline-none transition-all focus:border-rose-400 focus:ring-4 focus:ring-rose-100 placeholder:text-slate-400"
            />
          </label>

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
              onClick={handleSubmit}
              disabled={loading}
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-rose-700 active:scale-95 disabled:opacity-50 shadow-lg shadow-rose-200"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Flag className="h-4 w-4" />
                  Flag Vehicle
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div >
  );
};

export default FlagForReviewModal;