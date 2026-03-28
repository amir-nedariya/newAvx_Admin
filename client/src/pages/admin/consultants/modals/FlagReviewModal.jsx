import React, { useMemo, useState } from "react";
import { X, Flag, AlertTriangle, ShieldAlert, StickyNote } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { flagConsultationReview } from "../../../../api/consultationApi";

const cls = (...a) => a.filter(Boolean).join(" ");

const FLAG_CATEGORIES = [
  { value: "FRAUD_SUSPICION", label: "Fraud Suspicion" },
  { value: "SUSPICIOUS_PRICING", label: "Suspicious Pricing" },
  { value: "FAKE_INQUIRIES", label: "Fake Inquiries" },
  { value: "POLICY_VIOLATION", label: "Policy Violation" },
];

const SEVERITIES = [
  { value: "LOW", label: "Low" },
  { value: "MODERATE", label: "Moderate" },
  { value: "HIGH", label: "High" },
];

const FlagReviewModal = ({ onClose = null }) => {
  const navigate = useNavigate();
  const params = useParams();

  // supports both: /flag-review/:id OR nested route where :id exists
  const consultId = params?.id || params?.consultId;

  const [flagCategory, setFlagCategory] = useState("FRAUD_SUSPICION");
  const [severity, setSeverity] = useState("HIGH");
  const [internalNotes, setInternalNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const close = () => {
    if (typeof onClose === "function") return onClose();
    navigate(-1);
  };

  const canSubmit = useMemo(() => {
    return Boolean(consultId) && Boolean(flagCategory) && Boolean(severity) && internalNotes.trim().length >= 10;
  }, [consultId, flagCategory, severity, internalNotes]);

  const severityPill = (s) => {
    const map = {
      LOW: "bg-emerald-50 text-emerald-700 border-emerald-200",
      MODERATE: "bg-amber-50 text-amber-800 border-amber-200",
      HIGH: "bg-rose-50 text-rose-700 border-rose-200",
    };
    return map[String(s || "").toUpperCase()] || "bg-slate-50 text-slate-700 border-slate-200";
  };

  const onSubmit = async () => {
    if (!consultId) return toast.error("Consultant ID missing in route!");
    if (!internalNotes.trim() || internalNotes.trim().length < 10) return toast.error("Internal notes minimum 10 characters.");

    setLoading(true);
    try {
      const payload = {
        consultId,
        flagCategory,
        severity,
        internalNotes: internalNotes.trim(),
      };

      await flagConsultationReview(payload);

      toast.success("Flag submitted successfully ✅");
      setTimeout(() => close(), 600);
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Failed to flag consultant";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      {/* overlay */}
      <div className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-[2px]" onClick={close} />

      {/* modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div
          className="w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between">
            <div className="min-w-0">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Compliance</p>
              <h2 className="mt-1 text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-rose-50 border border-rose-200">
                  <Flag size={18} className="text-rose-700" />
                </span>
                Flag for Review
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Consultant ID: <span className="font-bold text-slate-700">{consultId || "—"}</span>
              </p>
            </div>

            <button
              type="button"
              onClick={close}
              className="w-10 h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition inline-flex items-center justify-center"
              aria-label="Close"
            >
              <X size={18} className="text-slate-700" />
            </button>
          </div>

          {/* body */}
          <div className="p-5 space-y-4">
            {/* category + severity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[12px] font-extrabold text-slate-600">Flag Category</label>
                <div className="mt-2 relative">
                  <ShieldAlert size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    value={flagCategory}
                    onChange={(e) => setFlagCategory(e.target.value)}
                    className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    {FLAG_CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[12px] font-extrabold text-slate-600">Severity</label>
                <div className="mt-2 relative">
                  <AlertTriangle size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className={cls(
                      "w-full h-11 pl-10 pr-3 rounded-xl border text-sm font-extrabold focus:outline-none focus:ring-2 focus:ring-blue-400",
                      severityPill(severity)
                    )}
                  >
                    {SEVERITIES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* notes */}
            <div>
              <label className="text-[12px] font-extrabold text-slate-600">Internal Notes</label>
              <div className="mt-2 relative">
                <StickyNote size={16} className="absolute left-3 top-3 text-slate-400" />
                <textarea
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  rows={6}
                  placeholder="Write internal notes for compliance review..."
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Minimum 10 characters. This note is internal-only.
              </p>
            </div>
          </div>

          {/* footer */}
          <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={close}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 font-extrabold text-sm transition"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onSubmit}
              disabled={!canSubmit || loading}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-sm transition"
            >
              {loading ? "Submitting..." : "Submit Flag"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FlagReviewModal;