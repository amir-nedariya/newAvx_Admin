/* =========================================================
   ✅ FILE: src/pages/admin/consultants/SuspendConsultantModal.jsx

   ✅ Perfect UI (premium)
   ✅ API Connected (suspendConsultation)
   ✅ Double Confirm if active boost/inspections
   ✅ TEMPORARY => suspendUntil (string)
   ✅ PERMANENT => suspendUntil null
   ✅ Validation + Loading + Toast
   ✅ Close on outside click + ESC
   ✅ Tailwind + Lucide

   Route Example:
   <Route path="/admin/consultants/suspend/:id" element={<SuspendConsultantModal />} />
========================================================= */

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  X,
  AlertTriangle,
  ShieldAlert,
  Calendar,
  Loader2,
  CheckCircle2,
  BadgeCheck,
  BadgeX,
  Clock,
} from "lucide-react";
import {
  getConsultationById,
  suspendConsultation,
} from "../.././../../api/consultationApi";

/* -------------------- REASONS -------------------- */
const SUSPEND_REASONS = [
  { value: "fraud", label: "Fraud suspicion" },
  { value: "disputes", label: "High dispute rate" },
  { value: "fake_inspection", label: "Fake inspection" },
  { value: "policy", label: "Policy violation" },
  { value: "other", label: "Other (specify below)" },
];

const todayYMD = () => new Date().toISOString().slice(0, 10);

/**
 * ✅ Backend sample:
 * "2026-03-10T18:30:00"
 * We will send exactly like this (NO Z).
 * We'll convert date (YYYY-MM-DD) => "YYYY-MM-DDT18:30:00"
 */
const dateToBackendSuspendUntil = (yyyy_mm_dd) => {
  if (!yyyy_mm_dd) return null;
  return `${yyyy_mm_dd}T18:30:00`;
};

const cls = (...a) => a.filter(Boolean).join(" ");

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
          "w-[340px] rounded-3xl bg-white border shadow-[0_20px_60px_-35px_rgba(2,6,23,0.5)] p-3",
          meta.wrap
        )}
      >
        <div className="flex items-start gap-3">
          <div className={cls("w-11 h-11 rounded-2xl border flex items-center justify-center", meta.box)}>
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
      <p className={cls("mt-1 inline-flex items-center px-2.5 py-1 rounded-xl border text-sm font-extrabold", t)}>
        {value ?? "—"}
      </p>
    </div>
  );
};

const RadioCard = ({ checked, onClick, title, desc }) => (
  <button
    type="button"
    onClick={onClick}
    className={cls(
      "w-full text-left p-4 rounded-2xl border transition flex items-start gap-3",
      checked
        ? "border-indigo-300 bg-indigo-50/50 shadow-sm"
        : "border-slate-200 bg-white hover:bg-slate-50"
    )}
  >
    <span
      className={cls(
        "mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center",
        checked ? "border-indigo-500" : "border-slate-300"
      )}
    >
      {checked ? <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> : null}
    </span>
    <span className="flex-1 min-w-0">
      <span className="block text-sm font-extrabold text-slate-900">{title}</span>
      <span className="block text-[13px] text-slate-600 mt-0.5">{desc}</span>
    </span>
  </button>
);

const VerificationPill = ({ status }) => {
  const s = String(status || "").toUpperCase();
  const meta =
    s === "ACTIVE" || s === "VERIFIED"
      ? { Icon: BadgeCheck, text: "VERIFIED", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" }
      : s === "REJECTED"
      ? { Icon: BadgeX, text: "REJECTED", cls: "bg-rose-50 text-rose-700 border-rose-200" }
      : { Icon: Clock, text: s || "PENDING", cls: "bg-amber-50 text-amber-800 border-amber-200" };

  return (
    <span className={cls("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-extrabold", meta.cls)}>
      <meta.Icon size={14} />
      {meta.text}
    </span>
  );
};

/* ========================= MAIN ========================= */
const SuspendConsultantModal = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // consultId

  /* -------------------- consultant data -------------------- */
  const [consultant, setConsultant] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // ✅ NOTE: aapke backend me fields differ ho sakte. We'll map safely.
  const safeConsultant = useMemo(() => {
    if (!consultant) return null;

    return {
      name:
        consultant?.consultName ||
        consultant?.consultationName ||
        consultant?.name ||
        "Consultant",
      tier:
        consultant?.tierTitle ||
        consultant?.tier ||
        "—",
      risk:
        consultant?.risk ||
        consultant?.riskScore ||
        "Low",
      activeVehicles:
        Number(consultant?.totalVehicles ?? consultant?.activeVehicles ?? 0),
      openInquiries:
        Number(consultant?.totalInquiries ?? consultant?.openInquiries ?? 0),
      verificationStatus:
        consultant?.verificationStatus ||
        consultant?.verification ||
        "PENDING",

      // ✅ These flags may not exist in API - default false
      hasActiveBoost: Boolean(consultant?.hasActiveBoost ?? false),
      hasOpenInspections: Boolean(consultant?.hasOpenInspections ?? false),
    };
  }, [consultant]);

  const hasActiveActivities =
    !!safeConsultant?.hasActiveBoost || !!safeConsultant?.hasOpenInspections;

  /* -------------------- form states -------------------- */
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [suspendType, setSuspendType] = useState("TEMPORARY"); // TEMPORARY | PERMANENT
  const [untilDate, setUntilDate] = useState(""); // YYYY-MM-DD
  const [confirmWarning, setConfirmWarning] = useState(false);

  /* -------------------- ui states -------------------- */
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "success", text: "" });

  const finalReason = reason === "other" ? customReason.trim() : reason;

  const isValid =
    !!reason &&
    (reason !== "other" || customReason.trim().length >= 3) &&
    (suspendType === "PERMANENT" || !!untilDate);

  const close = () => navigate(-1);

  const showToast = (type, text) => {
    setToast({ show: true, type, text });
    window.setTimeout(() => setToast({ show: false, type, text: "" }), 2300);
  };

  /* -------------------- load profile -------------------- */
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoadingProfile(true);
        const data = await getConsultationById(id);
        if (!mounted) return;

        // backend can return object OR {data: {...}}
        const obj = data?.data ? data.data : data;
        setConsultant(obj || null);
      } catch (e) {
        // fallback minimal view
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
  }, []);

  /* -------------------- submit -------------------- */
  const handleConfirm = async () => {
    if (hasActiveActivities && !confirmWarning) {
      setConfirmWarning(true);
      showToast(
        "warning",
        "Active boost/inspections detected. Confirm again to proceed."
      );
      return;
    }

    if (!isValid || submitting) return;

    try {
      setSubmitting(true);

      await suspendConsultation({
        consultId: id,
        reason: finalReason,
        suspendType,
        suspendUntil:
          suspendType === "TEMPORARY"
            ? dateToBackendSuspendUntil(untilDate)
            : null,
      });

      showToast("success", "Consultant suspended successfully.");
      window.setTimeout(() => close(), 650);
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Suspend failed";
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
          <div className="flex items-start justify-between p-6 border-b border-slate-100 bg-gradient-to-b from-rose-50/60 to-white">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center">
                <AlertTriangle className="text-rose-700" size={20} />
              </div>

              <div className="min-w-0">
                <h2 className="text-lg font-extrabold text-slate-900">
                  Suspend Consultant
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
              <InfoCard label="Active Vehicles" value={safeConsultant?.activeVehicles} />
              <InfoCard label="Open Inquiries" value={safeConsultant?.openInquiries} />
            </div>

            {/* Warning */}
            {hasActiveActivities ? (
              <div
                className={cls(
                  "rounded-2xl border p-4 text-sm",
                  confirmWarning
                    ? "bg-rose-50 border-rose-200 text-rose-800"
                    : "bg-amber-50 border-amber-200 text-amber-900"
                )}
              >
                <div className="flex items-start gap-2">
                  <ShieldAlert size={18} className="mt-0.5" />
                  <div>
                    <p className="font-extrabold">
                      Active revenue-impacting activities detected
                    </p>
                    <p className="mt-1 text-[13px] leading-snug">
                      This consultant has active boost campaigns or open inspections.
                      {confirmWarning ? (
                        <span className="font-semibold"> You chose to proceed anyway.</span>
                      ) : (
                        <span className="font-semibold"> Confirm again to proceed.</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Impact */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-5">
              <p className="text-sm font-extrabold text-slate-900">⚠ What will happen</p>
              <ul className="mt-3 text-[13.5px] text-slate-700 space-y-1.5 list-disc ml-5">
                <li>All listings hidden</li>
                <li>Boost campaigns paused</li>
                <li>Ranking score removed</li>
                <li>No new inquiries</li>
              </ul>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <label className="text-sm font-extrabold text-slate-900">Reason *</label>
              <select
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setConfirmWarning(false);
                }}
                className="w-full px-4 py-3 rounded-2xl border bg-white text-[15px] border-slate-200 outline-none focus:ring-4 focus:ring-rose-100 focus:border-rose-300 transition"
              >
                <option value="">Select reason</option>
                {SUSPEND_REASONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>

              {reason === "other" ? (
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border bg-white text-[15px] border-slate-200 outline-none focus:ring-4 focus:ring-rose-100 focus:border-rose-300 transition"
                  rows={3}
                  placeholder="Enter detailed reason (min 3 chars)"
                />
              ) : null}
            </div>

            {/* Type */}
            <div className="space-y-2">
              <label className="text-sm font-extrabold text-slate-900">Suspension Type *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <RadioCard
                  checked={suspendType === "TEMPORARY"}
                  onClick={() => {
                    setSuspendType("TEMPORARY");
                    setConfirmWarning(false);
                  }}
                  title="Temporary"
                  desc="Suspend until a specific date"
                />
                <RadioCard
                  checked={suspendType === "PERMANENT"}
                  onClick={() => {
                    setSuspendType("PERMANENT");
                    setUntilDate("");
                    setConfirmWarning(false);
                  }}
                  title="Permanent"
                  desc="Suspend indefinitely"
                />
              </div>
            </div>

            {/* Date (only for temporary) */}
            {suspendType === "TEMPORARY" ? (
              <div className="space-y-2">
                <label className="text-sm font-extrabold text-slate-900">Suspend Until *</label>

                <div className="relative">
                  <Calendar
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="date"
                    value={untilDate}
                    onChange={(e) => setUntilDate(e.target.value)}
                    min={todayYMD()}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border bg-white text-[15px] border-slate-200 outline-none focus:ring-4 focus:ring-rose-100 focus:border-rose-300 transition"
                  />
                </div>

                <p className="text-[12px] text-slate-500">
                  API will send: <span className="font-semibold">YYYY-MM-DDT18:30:00</span>
                </p>
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
              onClick={handleConfirm}
              disabled={!isValid || submitting}
              className={cls(
                "w-full sm:w-auto px-5 py-3 rounded-2xl font-extrabold text-white transition inline-flex items-center justify-center gap-2",
                !isValid || submitting
                  ? "bg-slate-400"
                  : confirmWarning
                  ? "bg-rose-700 hover:bg-rose-800"
                  : "bg-rose-600 hover:bg-rose-700"
              )}
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Suspending...
                </>
              ) : confirmWarning ? (
                "Confirm Anyway"
              ) : (
                "Confirm Suspension"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuspendConsultantModal;