/* =========================================================
   ✅ FILE: src/pages/admin/consultants/ForceAuditModal.jsx

   ✅ Premium UI (Tailwind + Lucide)
   ✅ API Connected (forceAuditConsultation)
   ✅ Loads consultant (getConsultationById)
   ✅ Validation + Loading + Toast
   ✅ Close on outside click + ESC
   ✅ Optional double confirm (2nd click) to avoid mistakes

   Route Example:
   <Route path="/admin/consultants/audit/:id" element={<ForceAuditModal />} />
========================================================= */

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  X,
  ShieldAlert,
  AlertTriangle,
  ClipboardCheck,
  Loader2,
  CheckCircle2,
  FileSearch,
  BadgeCheck,
  BadgeX,
  Clock,
} from "lucide-react";
import {
  getConsultationById,
  forceAuditConsultation,
} from "../../../../api/consultationApi";

const cls = (...a) => a.filter(Boolean).join(" ");

/* -------------------- AUDIT TYPES -------------------- */
const AUDIT_TYPES = [
  { value: "FULL_COMPLIANCE_AUDIT", label: "Full Compliance Audit" },
  { value: "DOCUMENT_VERIFICATION_AUDIT", label: "Document Verification Audit" },
  { value: "LISTING_QUALITY_AUDIT", label: "Listing Quality Audit" },
  { value: "FRAUD_RISK_AUDIT", label: "Fraud Risk Audit" },
];

/* -------------------- TOAST -------------------- */
const Toast = ({ show, type = "success", text }) => {
  if (!show) return null;

  const meta =
    type === "success"
      ? {
          wrap: "border-emerald-200",
          box: "bg-emerald-50 border-emerald-200",
          icon: "text-emerald-700",
          title: "Success",
          Icon: CheckCircle2,
        }
      : type === "error"
      ? {
          wrap: "border-rose-200",
          box: "bg-rose-50 border-rose-200",
          icon: "text-rose-700",
          title: "Failed",
          Icon: AlertTriangle,
        }
      : {
          wrap: "border-amber-200",
          box: "bg-amber-50 border-amber-200",
          icon: "text-amber-800",
          title: "Warning",
          Icon: ShieldAlert,
        };

  return (
    <div className="fixed top-4 right-4 z-[99999]">
      <div
        className={cls(
          "w-[360px] rounded-3xl bg-white border shadow-[0_20px_60px_-35px_rgba(2,6,23,0.5)] p-3",
          meta.wrap
        )}
      >
        <div className="flex items-start gap-3">
          <div
            className={cls(
              "w-11 h-11 rounded-2xl border flex items-center justify-center",
              meta.box
            )}
          >
            <meta.Icon size={18} className={meta.icon} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-slate-900">{meta.title}</p>
            <p className="text-[13px] text-slate-600 leading-snug mt-0.5">
              {text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------- UI PRIMITIVES -------------------- */
const InfoCard = ({ label, value, tone = "slate" }) => {
  const t =
    tone === "danger"
      ? "bg-rose-50 border-rose-200 text-rose-700"
      : tone === "warn"
      ? "bg-amber-50 border-amber-200 text-amber-800"
      : tone === "success"
      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
      : "bg-slate-50 border-slate-200 text-slate-700";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-[11px] font-black uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p
        className={cls(
          "mt-1 inline-flex items-center px-2.5 py-1 rounded-xl border text-sm font-extrabold",
          t
        )}
      >
        {value ?? "—"}
      </p>
    </div>
  );
};

const VerificationPill = ({ status }) => {
  const s = String(status || "").toUpperCase();
  const meta =
    s === "ACTIVE" || s === "VERIFIED"
      ? {
          Icon: BadgeCheck,
          text: "VERIFIED",
          cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
        }
      : s === "REJECTED"
      ? {
          Icon: BadgeX,
          text: "REJECTED",
          cls: "bg-rose-50 text-rose-700 border-rose-200",
        }
      : {
          Icon: Clock,
          text: s || "PENDING",
          cls: "bg-amber-50 text-amber-800 border-amber-200",
        };

  return (
    <span
      className={cls(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-extrabold",
        meta.cls
      )}
    >
      <meta.Icon size={14} />
      {meta.text}
    </span>
  );
};

/* ========================= MAIN ========================= */
const ForceAuditModal = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // consultId

  /* -------------------- consultant data -------------------- */
  const [consultant, setConsultant] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const safeConsultant = useMemo(() => {
    if (!consultant) return null;
    return {
      name:
        consultant?.consultName ||
        consultant?.consultationName ||
        consultant?.name ||
        "Consultant",
      tier: consultant?.tierTitle || consultant?.tier || "—",
      risk: consultant?.risk || consultant?.riskScore || "Low",
      vehicles: Number(consultant?.totalVehicles ?? 0),
      inquiries: Number(consultant?.totalInquiries ?? 0),
      verificationStatus:
        consultant?.verificationStatus || consultant?.verification || "PENDING",
    };
  }, [consultant]);

  /* -------------------- form -------------------- */
  const [auditType, setAuditType] = useState("FULL_COMPLIANCE_AUDIT");
  const [reason, setReason] = useState("");
  const [confirmStep, setConfirmStep] = useState(false);

  /* -------------------- ui -------------------- */
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "success", text: "" });

  const close = () => navigate(-1);

  const showToast = (type, text) => {
    setToast({ show: true, type, text });
    window.setTimeout(() => setToast({ show: false, type, text: "" }), 2300);
  };

  const isValid = auditType && reason.trim().length >= 10;

  /* -------------------- load profile -------------------- */
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoadingProfile(true);
        const data = await getConsultationById(id);
        if (!mounted) return;

        const obj = data?.data ? data.data : data;
        setConsultant(obj || null);
      } catch (e) {
        if (!mounted) return;
        setConsultant({
          consultName: "Consultant",
          tierTitle: "—",
          risk: "Low",
          totalVehicles: 0,
          totalInquiries: 0,
          verificationStatus: "PENDING",
        });
        showToast("error", e?.message || "Failed to load consultant details");
      } finally {
        if (mounted) setLoadingProfile(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  /* -------------------- ESC close -------------------- */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -------------------- submit -------------------- */
  const handleForceAudit = async () => {
    if (submitting) return;

    if (!isValid) {
      showToast("error", "Please select audit type and enter a reason (min 10 chars).");
      return;
    }

    if (!confirmStep) {
      setConfirmStep(true);
      showToast("warning", "Confirm again to trigger Force Audit.");
      return;
    }

    try {
      setSubmitting(true);

      await forceAuditConsultation({
        consultId: id,
        auditType,
        reason: reason.trim(),
      });

      showToast("success", "Force Audit triggered successfully.");
      window.setTimeout(() => close(), 650);
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Force audit failed";
      showToast("error", msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Toast show={toast.show} type={toast.type} text={toast.text} />

      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 p-4 bg-black/40 backdrop-blur-[2px] flex items-center justify-center"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        {/* Modal */}
        <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 shadow-[0_40px_120px_-60px_rgba(2,6,23,0.55)]">
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-slate-100 bg-gradient-to-b from-indigo-50/70 to-white">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-2xl bg-indigo-100 border border-indigo-200 flex items-center justify-center">
                <FileSearch className="text-indigo-700" size={20} />
              </div>

              <div className="min-w-0">
                <h2 className="text-lg font-extrabold text-slate-900">
                  Force Audit
                </h2>

                {loadingProfile ? (
                  <div className="mt-2">
                    <div className="h-4 w-48 bg-slate-100 rounded animate-pulse" />
                    <div className="mt-2 h-3 w-64 bg-slate-100 rounded animate-pulse" />
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-slate-600 truncate">
                      {safeConsultant?.name}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-xl border border-slate-200 bg-slate-50 text-xs font-extrabold text-slate-700">
                        ID: {id?.slice(0, 8)}…
                      </span>
                      <VerificationPill status={safeConsultant?.verificationStatus} />
                    </div>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={close}
              disabled={submitting}
              className="w-11 h-11 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition flex items-center justify-center disabled:opacity-60"
              aria-label="Close"
            >
              <X size={18} className="text-slate-700" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Consultant info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoCard label="Tier" value={safeConsultant?.tier} tone="success" />
              <InfoCard label="Risk" value={safeConsultant?.risk} tone="warn" />
              <InfoCard label="Vehicles" value={safeConsultant?.vehicles} />
              <InfoCard label="Inquiries" value={safeConsultant?.inquiries} />
            </div>

            {/* Impact */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-5">
              <p className="text-sm font-extrabold text-slate-900">
                🔎 What Force Audit does
              </p>
              <ul className="mt-3 text-[13.5px] text-slate-700 space-y-1.5 list-disc ml-5">
                <li>Creates an internal audit request for compliance review</li>
                <li>Tracks reason + type for admin operations</li>
                <li>Can be used for escalations and fraud prevention</li>
              </ul>
            </div>

            {/* Audit Type */}
            <div className="space-y-2">
              <label className="text-sm font-extrabold text-slate-900">
                Audit Type *
              </label>
              <select
                value={auditType}
                onChange={(e) => {
                  setAuditType(e.target.value);
                  setConfirmStep(false);
                }}
                className="w-full px-4 py-3 rounded-2xl border bg-white text-[15px] border-slate-200 outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 transition"
              >
                {AUDIT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <label className="text-sm font-extrabold text-slate-900">
                Reason *
              </label>
              <textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setConfirmStep(false);
                }}
                className="w-full px-4 py-3 rounded-2xl border bg-white text-[15px] border-slate-200 outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 transition"
                rows={4}
                placeholder='Example: "Multiple customer complaints and document inconsistencies detected. A full operational audit is required."'
              />
              <div className="flex items-center justify-between text-[12px] text-slate-500">
                <span>Minimum 10 characters</span>
                <span className={reason.trim().length >= 10 ? "text-emerald-700 font-semibold" : ""}>
                  {reason.trim().length}/10
                </span>
              </div>
            </div>

            {/* Confirm Banner */}
            {confirmStep ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <div className="flex items-start gap-2">
                  <ShieldAlert size={18} className="mt-0.5" />
                  <div>
                    <p className="font-extrabold">Confirm required</p>
                    <p className="mt-1 text-[13px] leading-snug">
                      Click <span className="font-extrabold">Force Audit</span> again to proceed.
                      This action will be logged.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Footer */}
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <button
              onClick={close}
              disabled={submitting}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-slate-200 bg-white text-slate-800 font-extrabold hover:bg-slate-50 transition disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              onClick={handleForceAudit}
              disabled={!isValid || submitting}
              className={cls(
                "w-full sm:w-auto px-5 py-3 rounded-2xl font-extrabold text-white transition inline-flex items-center justify-center gap-2",
                !isValid || submitting
                  ? "bg-slate-400"
                  : confirmStep
                  ? "bg-indigo-700 hover:bg-indigo-800"
                  : "bg-indigo-600 hover:bg-indigo-700"
              )}
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Submitting...
                </>
              ) : (
                <>
                  <ClipboardCheck size={18} />
                  {confirmStep ? "Confirm Force Audit" : "Force Audit"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForceAuditModal;