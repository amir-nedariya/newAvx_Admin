// src/pages/admin/consultants/Allconsultants.jsx
import React, { useEffect, useMemo, useRef, useState, useCallback, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  Search,
  SlidersHorizontal,
  RefreshCw,
  MoreHorizontal,
  Eye,
  Ban,
  ShieldAlert,
  NotebookPen,
  X,
  User,
  MapPin,
  Star,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Activity,
  Clock3,
  BadgeCheck,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  filterConsultations,
  mapConsultationToRow,
  getConsultationKpi,
  suspendConsultation,
  changeConsultantTier,
  flagConsultationReview,
  forceAuditConsultation,
  addInternalNote,
} from "../../../api/consultationApi";
import { getTierPlans } from "../../../api/tierPlan.api";
import { getStates, getAllCitiesFromSearch, getCities } from "../../../api/addressApi";

/* =========================================================
   HELPERS
========================================================= */
const cls = (...a) => a.filter(Boolean).join(" ");

const fmtInt = (v) => (Number.isFinite(Number(v)) ? Math.round(Number(v)) : 0);

const fmtHours = (v) => {
  const minutes = Number(v);
  if (!Number.isFinite(minutes) || minutes <= 0) return "N/A";

  // Convert minutes to different time units
  const minutesInHour = 60;
  const minutesInDay = 60 * 24;
  const minutesInMonth = 60 * 24 * 30; // Approximate
  const minutesInYear = 60 * 24 * 365; // Approximate

  if (minutes < minutesInHour) {
    // Less than 1 hour - show minutes
    return `${Math.round(minutes)}m`;
  } else if (minutes < minutesInDay) {
    // Less than 1 day - show hours and minutes
    const hours = Math.floor(minutes / minutesInHour);
    const mins = Math.round(minutes % minutesInHour);
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  } else if (minutes < minutesInMonth) {
    // Less than 1 month - show days and hours
    const days = Math.floor(minutes / minutesInDay);
    const hours = Math.round((minutes % minutesInDay) / minutesInHour);
    return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
  } else if (minutes < minutesInYear) {
    // Less than 1 year - show months and days
    const months = Math.floor(minutes / minutesInMonth);
    const days = Math.round((minutes % minutesInMonth) / minutesInDay);
    return days > 0 ? `${months}mo ${days}d` : `${months}mo`;
  } else {
    // 1 year or more - show years and months
    const years = Math.floor(minutes / minutesInYear);
    const months = Math.round((minutes % minutesInYear) / minutesInMonth);
    return months > 0 ? `${years}y ${months}mo` : `${years}y`;
  }
};

const fmtPct = (v) =>
  Number.isFinite(Number(v))
    ? `${Number(v).toFixed(1).replace(".0", "")}%`
    : "0%";

const safeErrorMessage = (err) => {
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.response?.data?.error) return err.response.data.error;
  if (err?.message?.toLowerCase().includes("network"))
    return "Network error. Please check your backend server / API base URL.";
  if (err?.code === "ERR_NETWORK")
    return "Network error. Please check your backend server / API base URL.";
  return "Something went wrong while loading consultants.";
};

/* =========================================================
   ENUMS
========================================================= */
const STATUS_OPTIONS = ["ACTIVE", "INACTIVE", "DELETED"];
const VERIFY_OPTIONS = ["REQUESTED", "REQUEST_CHANGES", "VERIFIED", "REJECTED"];
const DEFAULT_COUNTRY_ID = "101";

/* =========================================================
   BADGES
========================================================= */
const statusBadge = (status) => {
  const s = String(status || "").toUpperCase();

  const map = {
    ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
    INACTIVE: "bg-slate-100 text-slate-700 border-slate-200",
    DELETED: "bg-rose-50 text-rose-700 border-rose-200",
    REQUESTED: "bg-amber-50 text-amber-700 border-amber-200",
    REQUEST_CHANGES: "bg-orange-50 text-orange-700 border-orange-200",
    VERIFIED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return map[s] || "bg-slate-50 text-slate-700 border-slate-200";
};

const riskBadge = (risk) => {
  const r = String(risk || "").toLowerCase();
  if (r.includes("high")) return "bg-rose-50 text-rose-700 border-rose-200";
  if (r.includes("med") || r.includes("moderate"))
    return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-emerald-50 text-emerald-700 border-emerald-200";
};

const tierBadge = (tierTitle) => {
  const t = String(tierTitle || "").toLowerCase();
  if (t.includes("premium"))
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (t.includes("pro")) return "bg-sky-50 text-sky-700 border-sky-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
};

/* =========================================================
   ROW ACTIONS
========================================================= */
// function RowActions({ item, onSuspend, onFlag, onNote }) {
//   const [open, setOpen] = useState(false);
//   const ref = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleClick = (e) => {
//       if (!ref.current?.contains(e.target)) setOpen(false);
//     };
//     document.addEventListener("mousedown", handleClick);
//     return () => document.removeEventListener("mousedown", handleClick);
//   }, []);

//   const go = (path) => {
//     navigate(path);
//     setOpen(false);
//   };

//   return (
//     <div className="relative inline-flex justify-end" ref={ref}>
//       <button
//         onClick={() => setOpen((p) => !p)}
//         className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 shadow-sm"
//       >
//         <MoreHorizontal className="h-4 w-4" />
//       </button>

//       {open && (
//         <div className="absolute right-0 top-11 z-30 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
//           <button
//             onClick={() => go(`/admin/consultants/profile/${item.id}`)}
//             className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors"
//           >
//             <User className="h-4 w-4 text-slate-500" />
//             View Profile
//           </button>

//           <button
//             onClick={() => {
//               onSuspend(item);
//               setOpen(false);
//             }}
//             className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-rose-700 hover:bg-rose-50 transition-colors"
//           >
//             <Ban className="h-4 w-4" />
//             Suspend
//           </button>

//           <button
//             onClick={() => go(`/admin/consultants/change-tier/${item.id}`)}
//             className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-sky-700 hover:bg-sky-50 transition-colors"
//           >
//             <BadgeCheck className="h-4 w-4" />
//             Change Tier
//           </button>

//           <button
//             onClick={() => go(`/admin/consultants/ranking/${item.id}`)}
//             className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors"
//           >
//             <TrendingUp className="h-4 w-4 text-slate-500" />
//             Ranking Breakdown
//           </button>

//           <button
//             onClick={() => {
//               onFlag(item);
//               setOpen(false);
//             }}
//             className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-amber-700 hover:bg-amber-50 transition-colors"
//           >
//             <ShieldAlert className="h-4 w-4" />
//             Flag for Review
//           </button>

//           <div className="my-1 border-t border-slate-100" />

//           <button
//             onClick={() => {
//               onNote(item);
//               setOpen(false);
//             }}
//             className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors"
//           >
//             <NotebookPen className="h-4 w-4 text-slate-500" />
//             Add Internal Note
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

function RowActions({ consultantId, consultantName, onOpenModal }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* VIEW PROFILE */
  const handleViewProfile = () => {
    navigate(`/admin/consultants/profile/${consultantId}`);
    setOpen(false);
  };

  /* SUSPEND */
  const handleSuspend = () => {
    onOpenModal("suspend", consultantId, consultantName);
    setOpen(false);
  };

  /* CHANGE TIER */
  const handleChangeTier = () => {
    onOpenModal("changeTier", consultantId, consultantName);
    setOpen(false);
  };

  /* VIEW RANKING */
  const handleViewRanking = () => {
    navigate(`/admin/consultants/ranking/${consultantId}`);
    setOpen(false);
  };

  /* FLAG FOR REVIEW */
  const handleFlagForReview = () => {
    onOpenModal("flagReview", consultantId, consultantName);
    setOpen(false);
  };

  /* FORCE AUDIT */
  const handleForceAudit = () => {
    onOpenModal("forceAudit", consultantId, consultantName);
    setOpen(false);
  };

  /* ADD INTERNAL NOTE */
  const handleAddNote = () => {
    onOpenModal("addNote", consultantId, consultantName);
    setOpen(false);
  };

  return (
    <div className="relative inline-flex justify-end" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="inline-flex cursor-pointer h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-30 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
          <button
            onClick={handleViewProfile}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <User className="h-4 w-4 text-slate-500" />
            View Profile
          </button>

          <button
            onClick={handleSuspend}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-rose-700 transition-colors hover:bg-rose-50"
          >
            <Ban className="h-4 w-4" />
            Suspend
          </button>

          <button
            onClick={handleChangeTier}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-sky-700 transition-colors hover:bg-sky-50"
          >
            <BadgeCheck className="h-4 w-4" />
            Change Tier
          </button>

          <button
            onClick={handleViewRanking}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <TrendingUp className="h-4 w-4 text-slate-500" />
            View Ranking
          </button>

          <button
            onClick={handleFlagForReview}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-amber-700 transition-colors hover:bg-amber-50"
          >
            <ShieldAlert className="h-4 w-4" />
            Flag for Review
          </button>

          <button
            onClick={handleForceAudit}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-violet-700 transition-colors hover:bg-violet-50"
          >
            <Activity className="h-4 w-4" />
            Force Audit
          </button>

          <div className="my-1 border-t border-slate-100" />

          <button
            onClick={handleAddNote}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <NotebookPen className="h-4 w-4 text-slate-500" />
            Add Internal Note
          </button>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   ACTION MODALS
========================================================= */

/* SUSPEND CONSULTANT MODAL */
function SuspendConsultantModal({
  open,
  consultantName,
  suspendReason,
  setSuspendReason,
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
    "Quality issues",
    "Other",
  ];

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
              <h3 className="text-xl font-bold text-zinc-900">Suspend Consultant</h3>
              {consultantName && (
                <p className="mt-1 text-sm text-zinc-600">{consultantName}</p>
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
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
              </div>
            </div>

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
                  min={new Date().toISOString().slice(0, 10)}
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

/* CHANGE TIER MODAL */
function ChangeTierModal({
  open,
  consultantName,
  selectedTier,
  setSelectedTier,
  tierPlans,
  applyType,
  setApplyType,
  discountPercentage,
  setDiscountPercentage,
  manualPrice,
  setManualPrice,
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
        <div className="flex items-start justify-between border-b border-zinc-100 px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50">
              <BadgeCheck className="h-6 w-6 text-sky-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-zinc-900">Change Tier Plan</h3>
              {consultantName && (
                <p className="mt-1 text-sm text-zinc-500">{consultantName}</p>
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
          <div className="mb-6 rounded-2xl bg-sky-50 border border-sky-100 px-4 py-3">
            <p className="text-sm font-semibold text-sky-800">
              Select a new tier plan for this consultant. Changes will take effect based on apply type.
            </p>
          </div>

          <div className="space-y-5">
            {/* Select Tier Plan */}
            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-700">
                Select Tier Plan <span className="text-sky-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="w-full appearance-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 pr-10 text-sm text-zinc-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                >
                  <option value="">Select a tier...</option>
                  {tierPlans.map((tier) => (
                    <option key={tier.id} value={tier.id}>
                      {tier.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
              </div>
            </div>

            {/* Apply Type */}
            <div>
              <label className="mb-3 block text-sm font-bold text-zinc-700">
                Apply Type <span className="text-sky-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setApplyType("IMMEDIATE")}
                  className={cls(
                    "rounded-2xl border-2 p-4 text-left transition-all",
                    applyType === "IMMEDIATE"
                      ? "border-sky-500 bg-sky-50"
                      : "border-zinc-200 bg-white hover:border-zinc-300"
                  )}
                >
                  <div className="text-base font-bold text-zinc-900">Immediate</div>
                  <div className="mt-1 text-sm text-zinc-500">Apply changes now</div>
                </button>
                <button
                  type="button"
                  onClick={() => setApplyType("AT_EXPIRY")}
                  className={cls(
                    "rounded-2xl border-2 p-4 text-left transition-all",
                    applyType === "AT_EXPIRY"
                      ? "border-sky-500 bg-sky-50"
                      : "border-zinc-200 bg-white hover:border-zinc-300"
                  )}
                >
                  <div className="text-base font-bold text-zinc-900">At Expiry</div>
                  <div className="mt-1 text-sm text-zinc-500">Apply after current tier expires</div>
                </button>
              </div>
            </div>

            {/* Discount Percentage */}
            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-700">
                Discount Percentage (Optional)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(e.target.value)}
                  placeholder="0"
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 pr-10 text-sm text-zinc-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-zinc-400">
                  %
                </span>
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                Maximum 100%
              </p>
            </div>

            {/* Manual Price */}
            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-700">
                Manual Price (Optional)
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-zinc-400">
                  ₹
                </span>
                <input
                  type="number"
                  value={manualPrice}
                  onChange={(e) => setManualPrice(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 pl-10 text-sm text-zinc-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                Override tier price with custom amount
              </p>
            </div>

            {/* Reason */}
            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-700">
                Reason <span className="text-sky-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="Enter reason for tier change..."
                className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
              <p className="mt-2 text-xs text-zinc-500">
                Minimum 5 characters required
              </p>
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
                !selectedTier ||
                !applyType ||
                !reason.trim() ||
                reason.trim().length < 5
              }
              className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <BadgeCheck className="h-4 w-4" />
              {loading ? "Updating..." : "Confirm Change"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* FLAG FOR REVIEW MODAL */
function FlagReviewModal({
  open,
  consultantName,
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
    { value: "FRAUD_SUSPICION", label: "Fraud Suspicion", icon: "⚠️" },
    { value: "SUSPICIOUS_PRICING", label: "Suspicious Pricing", icon: "💰" },
    { value: "FAKE_INQUIRIES", label: "Fake Inquiries", icon: "🚫" },
    { value: "POLICY_VIOLATION", label: "Policy Violation", icon: "🚷" },
    { value: "DATA_INCONSISTENCY", label: "Data Inconsistency", icon: "🔵" },
  ];

  const severityLevels = ["LOW", "MODERATE", "HIGH"];

  return (
    <>
      <div
        className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed left-1/2 top-1/2 z-[111] w-[95%] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-zinc-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-zinc-100 px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50">
              <ShieldAlert className="h-6 w-6 text-rose-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-zinc-900">Flag Consultant For Review</h3>
              {consultantName && (
                <p className="mt-1 text-sm text-zinc-500">{consultantName}</p>
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
              <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-rose-400">
                <ShieldAlert className="h-4 w-4" />
                Flag Category
              </label>
              <div className="relative">
                <select
                  value={flagCategory}
                  onChange={(e) => setFlagCategory(e.target.value)}
                  className="w-full appearance-none rounded-2xl border-2 border-rose-200 bg-white px-4 py-3 pr-10 text-sm text-zinc-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                >
                  <option value="">Select Category</option>
                  {flagCategories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
              </div>
            </div>

            {/* Severity Level */}
            <div>
              <label className="mb-3 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Severity Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {severityLevels.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFlagSeverity(level)}
                    className={cls(
                      "rounded-2xl border-2 px-4 py-3 text-sm font-bold uppercase tracking-wide transition-all",
                      flagSeverity === level
                        ? level === "LOW"
                          ? "border-sky-500 bg-sky-50 text-sky-700"
                          : level === "MODERATE"
                            ? "border-amber-500 bg-amber-50 text-amber-700"
                            : "border-rose-500 bg-rose-50 text-rose-700"
                        : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Internal Administrative Notes */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                <NotebookPen className="h-4 w-4" />
                Internal Administrative Notes
              </label>
              <textarea
                value={flagNotes}
                onChange={(e) => setFlagNotes(e.target.value)}
                rows={4}
                placeholder="Why are you flagging this consultant? Be specific for the auditing team..."
                className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
              />
              <p className="mt-2 text-xs text-zinc-500">
                Minimum 10 characters required
              </p>
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
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ShieldAlert className="h-4 w-4" />
              {loading ? "Flagging..." : "Flag Consultant"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* FORCE AUDIT MODAL */
function ForceAuditModal({
  open,
  consultantName,
  auditType,
  setAuditType,
  auditReason,
  setAuditReason,
  loading,
  onClose,
  onConfirm,
}) {
  if (!open) return null;

  const auditTypes = [
    { value: "INVENTORY_AUDIT", label: "Inventory Audit" },
    { value: "KYC_AUDIT", label: "KYC Audit" },
    { value: "FULL_COMPLIANCE_AUDIT", label: "Full Compliance Audit" },
  ];

  return (
    <>
      <div
        className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed left-1/2 top-1/2 z-[111] w-[95%] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-zinc-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-zinc-100 px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50">
              <Activity className="h-6 w-6 text-violet-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-zinc-900">Force Audit</h3>
              {consultantName && (
                <p className="mt-1 text-sm text-zinc-500">{consultantName}</p>
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
          <div className="mb-6 rounded-2xl bg-violet-50 border border-violet-100 px-4 py-3">
            <p className="text-sm font-semibold text-violet-800">
              This will trigger a comprehensive audit of the consultant's account and activities.
            </p>
          </div>

          <div className="space-y-5">
            {/* Audit Type Dropdown */}
            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-700">
                Audit Type <span className="text-violet-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={auditType}
                  onChange={(e) => setAuditType(e.target.value)}
                  className="w-full appearance-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 pr-10 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                >
                  <option value="">Select audit type</option>
                  {auditTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-700">
                Reason for Audit <span className="text-violet-500">*</span>
              </label>
              <textarea
                value={auditReason}
                onChange={(e) => setAuditReason(e.target.value)}
                rows={4}
                placeholder="Enter reason for forcing an audit..."
                className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
              <p className="mt-2 text-xs text-zinc-500">
                Minimum 10 characters required
              </p>
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
                !auditType ||
                !auditReason.trim() ||
                auditReason.trim().length < 10
              }
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Activity className="h-4 w-4" />
              {loading ? "Processing..." : "Confirm Audit"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ADD INTERNAL NOTE MODAL */
function AddNoteModal({
  open,
  consultantName,
  noteText,
  setNoteText,
  noteVisibility,
  setNoteVisibility,
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
        <div className="flex items-start justify-between border-b border-zinc-100 px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100">
              <NotebookPen className="h-6 w-6 text-slate-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-zinc-900">Add Internal Note</h3>
              {consultantName && (
                <p className="mt-1 text-sm text-zinc-500">{consultantName}</p>
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
          <div className="space-y-5">
            {/* Visibility Selection */}
            <div>
              <label className="mb-3 block text-sm font-bold text-zinc-700">
                Visibility <span className="text-slate-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setNoteVisibility("INTERNAL_ONLY")}
                  className={cls(
                    "rounded-2xl border-2 p-4 text-left transition-all",
                    noteVisibility === "INTERNAL_ONLY"
                      ? "border-slate-500 bg-slate-50"
                      : "border-zinc-200 bg-white hover:border-zinc-300"
                  )}
                >
                  <div className="text-base font-bold text-zinc-900">Internal Only</div>
                  <div className="mt-1 text-sm text-zinc-500">Visible to admin team only</div>
                </button>
                <button
                  type="button"
                  onClick={() => setNoteVisibility("COMPLIANCE_TEAM")}
                  className={cls(
                    "rounded-2xl border-2 p-4 text-left transition-all",
                    noteVisibility === "COMPLIANCE_TEAM"
                      ? "border-slate-500 bg-slate-50"
                      : "border-zinc-200 bg-white hover:border-zinc-300"
                  )}
                >
                  <div className="text-base font-bold text-zinc-900">Compliance Team</div>
                  <div className="mt-1 text-sm text-zinc-500">Shared with compliance</div>
                </button>
              </div>
            </div>

            {/* Note Text */}
            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-700">
                Note <span className="text-slate-500">*</span>
              </label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={5}
                placeholder="Enter internal note about this consultant..."
                className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20"
              />
              <p className="mt-2 text-xs text-zinc-500">
                Minimum 5 characters required
              </p>
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
              disabled={loading || !noteText.trim() || noteText.trim().length < 5}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <NotebookPen className="h-4 w-4" />
              {loading ? "Saving..." : "Save Note"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* =========================================================
   DRAWER / SMALL PARTS
========================================================= */
function ConsultantProfileDrawer({ item, onClose, onSuspend, onFlag }) {
  const navigate = useNavigate();
  if (!item) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-[500px] border-l border-slate-200 bg-white shadow-2xl flex flex-col">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 shrink-0 bg-slate-50">
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {item.name || "Consultant"}
            </h3>
            <p className="mt-1 text-sm text-slate-500 font-mono">
              {item.id || "N/A"}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span
                className={cls(
                  "inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold border",
                  statusBadge(item.status)
                )}
              >
                {String(item.status || "UNKNOWN").replaceAll("_", " ")}
              </span>
              <span
                className={cls(
                  "inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold border",
                  riskBadge(item.risk)
                )}
              >
                {item.risk || "Low"} Risk
              </span>
              <span
                className={cls(
                  "inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold border",
                  tierBadge(item.tierTitle)
                )}
              >
                {item.tierTitle || "Basic"}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Vehicles" value={fmtInt(item.vehicles)} icon={Activity} />
            <StatCard
              label="Inquiries (30d)"
              value={fmtInt(item.inquiries)}
              icon={TrendingUp}
            />
            <StatCard
              label="Response Time"
              value={fmtHours(item.responseTime)}
              icon={Clock3}
            />
            <StatCard
              label="Conversion"
              value={fmtPct(item.conversion)}
              icon={BadgeCheck}
            />
            <StatCard
              label="Rating"
              value={Number(item.rating || 0).toFixed(1).replace(".0", "")}
              icon={Star}
            />
            <StatCard label="City" value={item.city || "N/A"} icon={MapPin} />
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-4">
              Consultant Details
            </h4>
            <div className="space-y-4 text-sm">
              <InfoRow icon={User} label="Name" value={item.name || "-"} />
              <InfoRow icon={MapPin} label="City" value={item.city || "-"} />
              <InfoRow icon={BadgeCheck} label="Tier" value={item.tierTitle || "-"} />
              <InfoRow icon={ShieldAlert} label="Risk" value={item.risk || "Low"} />
              <InfoRow
                icon={Activity}
                label="Status"
                value={String(item.status || "-").replaceAll("_", " ")}
              />
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-4">
              Performance Summary
            </h4>

            <div className="space-y-3">
              <SummaryRow label="Listed Vehicles" value={fmtInt(item.vehicles)} />
              <SummaryRow label="30 Day Inquiries" value={fmtInt(item.inquiries)} />
              <SummaryRow label="Average Response Time" value={fmtHours(item.responseTime)} />
              <SummaryRow label="Conversion Rate" value={fmtPct(item.conversion)} />
              <SummaryRow
                label="Rating"
                value={`${Number(item.rating || 0).toFixed(1).replace(".0", "")} / 5`}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <button
              onClick={() => navigate(`/admin/consultants/profile/${item.id}`)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-[13px] font-semibold text-white transition hover:bg-slate-800"
            >
              <Eye className="h-4 w-4" />
              Full Profile
            </button>

            <button
              onClick={() => onSuspend(item)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-[13px] font-semibold text-rose-700 transition hover:bg-rose-100"
            >
              <Ban className="h-4 w-4" />
              Suspend
            </button>

            <button
              onClick={() => onFlag(item)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] font-semibold text-amber-700 transition hover:bg-amber-100"
            >
              <ShieldAlert className="h-4 w-4" />
              Flag
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 flex flex-col justify-center">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 truncate">
            {label}
          </div>
          <div className="mt-0.5 text-[15px] font-bold text-slate-900 truncate">
            {value}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 shrink-0">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="pt-0.5">
        <div className="text-[10px] uppercase tracking-wider text-slate-400">
          {label}
        </div>
        <div className="text-[13px] font-medium text-slate-700 mt-0.5">
          {value}
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <span className="text-[13px] text-slate-600">{label}</span>
      <span className="text-[13px] font-semibold text-slate-900">{value}</span>
    </div>
  );
}

function SuspendModal({ modal, onClose, onConfirm }) {
  const [reason, setReason] = useState("Policy violation");

  useEffect(() => {
    if (modal?.type === "suspend") {
      setReason("Policy violation");
    }
  }, [modal]);

  if (!modal || modal.type !== "suspend") return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="fixed left-1/2 top-1/2 z-[61] w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Suspend Consultant</h3>
            <p className="mt-1 text-[13px] text-slate-500">
              {modal.item.name} • {modal.item.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-[13px] font-medium text-slate-700">
              Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-slate-900 text-[13px] appearance-none"
            >
              <option>Policy violation</option>
              <option>Fraud suspicion</option>
              <option>Spam activity</option>
              <option>Profile issue</option>
              <option>Manual moderation</option>
            </select>
          </div>

          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[12px] leading-relaxed text-rose-700">
            This action is for UI demo only. Replace this with your suspend API call if needed.
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onConfirm({
                ...modal.item,
                suspendReason: reason,
              })
            }
            className="rounded-xl bg-rose-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-rose-700 transition-colors"
          >
            Confirm Suspend
          </button>
        </div>
      </div>
    </>
  );
}

function PaginationBar({ page, totalPages, totalCount, loading, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-end mt-6">
      <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm">
        <span className="text-sm text-slate-500">{totalCount} total</span>

        <button
          disabled={page <= 1 || loading}
          onClick={() => onPageChange(page - 1)}
          className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-lg disabled:opacity-40 hover:bg-slate-200 transition"
        >
          <ChevronLeft size={16} />
        </button>

        <span className="text-sm text-slate-500">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page >= totalPages || loading}
          onClick={() => onPageChange(page + 1)}
          className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-lg disabled:opacity-40 hover:bg-slate-200 transition"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function TopCard({ title, value, icon: Icon = User, valueClass = "" }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50/80 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative z-10 flex items-center justify-between gap-4">
        <div>
          <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            {title}
          </div>
          <div className={cls(
            "text-4xl font-extrabold tracking-tight",
            valueClass || "text-slate-900"
          )}>
            {value}
          </div>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-100 bg-sky-50 text-sky-600 shadow-sm">
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN
========================================================= */
const Allconsultants = () => {
  const navigate = useNavigate();
  const didInit = useRef(false);
  const lastFetchKeyRef = useRef("");
  const searchDebounceRef = useRef(null);
  const citiesLoadedRef = useRef(false);

  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [tierPlans, setTierPlans] = useState([]);
  const [tierId, setTierId] = useState("ALL");
  const [draftTierId, setDraftTierId] = useState("ALL");
  const [tierLoaded, setTierLoaded] = useState(false);
  const [tierLoading, setTierLoading] = useState(false);

  const [countryId] = useState(DEFAULT_COUNTRY_ID);

  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [cityId, setCityId] = useState("ALL");
  const [draftCityId, setDraftCityId] = useState("ALL");
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [cityQuery, setCityQuery] = useState("");

  const [states, setStates] = useState([]);
  const [stateId, setStateId] = useState("ALL");
  const [draftStateId, setDraftStateId] = useState("ALL");
  const [statesLoadedFor, setStatesLoadedFor] = useState(null);
  const [statesLoading, setStatesLoading] = useState(false);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [stateQuery, setStateQuery] = useState("");

  const [status, setStatus] = useState("ALL");
  const [draftStatus, setDraftStatus] = useState("ALL");
  const [verificationStatus, setVerificationStatus] = useState("ALL");
  const [draftVerificationStatus, setDraftVerificationStatus] = useState("ALL");

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [kpiLoading, setKpiLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [kpi, setKpi] = useState({
    totalConsultations: 0,
    totalActiveConsultations: 0,
    totalVerifiedConsultations: 0,
  });

  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [modal, setModal] = useState(null);

  // Action modal states
  const [actionModal, setActionModal] = useState({ open: false, type: "", consultantId: null, consultantName: "" });
  const [actionLoading, setActionLoading] = useState(false);

  // Suspend modal states
  const [suspendReason, setSuspendReason] = useState("");
  const [suspendType, setSuspendType] = useState("TEMPORARY");
  const [suspendUntil, setSuspendUntil] = useState("");

  // Change tier modal states
  const [selectedTier, setSelectedTier] = useState("");
  const [applyType, setApplyType] = useState("IMMEDIATE");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [manualPrice, setManualPrice] = useState("");
  const [tierChangeReason, setTierChangeReason] = useState("");

  // Flag review modal states
  const [flagCategory, setFlagCategory] = useState("");
  const [flagSeverity, setFlagSeverity] = useState("");
  const [flagNotes, setFlagNotes] = useState("");

  // Force audit modal states
  const [auditType, setAuditType] = useState("");
  const [auditReason, setAuditReason] = useState("");

  // Add note modal states
  const [noteText, setNoteText] = useState("");
  const [noteVisibility, setNoteVisibility] = useState("INTERNAL_ONLY");

  // Filter verification options based on status
  const filteredVerifyOptions = useMemo(() => {
    if (draftStatus === "ACTIVE") {
      return VERIFY_OPTIONS.filter(option => option !== "REQUESTED");
    }
    return VERIFY_OPTIONS;
  }, [draftStatus]);

  const loadKpi = useCallback(async () => {
    setKpiLoading(true);
    try {
      const res = await getConsultationKpi();
      const data = res?.data || {};

      setKpi({
        totalConsultations: Number(data?.totalConsultations ?? 0),
        totalActiveConsultations: Number(data?.totalActiveConsultations ?? 0),
        totalVerifiedConsultations: Number(data?.totalVerifiedConsultations ?? 0),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setKpiLoading(false);
    }
  }, []);

  const loadTiersOnce = useCallback(async () => {
    if (tierLoaded || tierLoading) return;

    setTierLoading(true);
    try {
      const res = await getTierPlans();
      const list =
        (Array.isArray(res?.data) && res.data) || (Array.isArray(res) && res) || [];

      setTierPlans(
        list
          .map((p) => ({
            id: p?.id ?? p?.tierPlanId ?? p?._id,
            title: p?.title ?? p?.name ?? "Plan",
          }))
          .filter((x) => x.id != null)
      );
      setTierLoaded(true);
    } catch (e) {
      console.error(e);
      setTierPlans([]);
      setTierLoaded(true);
      toast.error("Failed to load tier plans");
    } finally {
      setTierLoading(false);
    }
  }, [tierLoaded, tierLoading]);

  const loadStatesForCountry = useCallback(
    async (cid) => {
      if (!cid || cid === "ALL") return;
      if (statesLoadedFor === cid || statesLoading) return;

      setStatesLoading(true);
      try {
        const res = await getStates(cid);
        const list =
          (Array.isArray(res?.data) && res.data) || (Array.isArray(res) && res) || [];

        setStates(
          list
            .map((s) => ({
              id: s?.id ?? s?.stateId ?? s?._id,
              name: s?.name ?? s?.stateName ?? "State",
            }))
            .filter((x) => x.id != null)
        );
        setStatesLoadedFor(cid);
      } catch (e) {
        console.error(e);
        setStates([]);
        setStatesLoadedFor(cid);
        toast.error("Failed to load states");
      } finally {
        setStatesLoading(false);
      }
    },
    [statesLoadedFor, statesLoading]
  );

  const loadCitiesOnce = useCallback(async () => {
    if (citiesLoadedRef.current || citiesLoading) return;

    citiesLoadedRef.current = true;
    setCitiesLoading(true);
    try {
      const res = await getAllCitiesFromSearch("");
      const list =
        (Array.isArray(res?.data) && res.data) || (Array.isArray(res) && res) || [];

      setCities(
        list
          .map((c) => ({
            id: c?.cityId ?? c?.id ?? c?._id,
            name: c?.cityName ?? c?.name ?? "City",
          }))
          .filter((x) => x.id != null)
      );
    } catch (e) {
      console.error(e);
      setCities([]);
      toast.error("Failed to load cities");
      citiesLoadedRef.current = false; // Reset on error so it can retry
    } finally {
      setCitiesLoading(false);
    }
  }, [citiesLoading]);

  const loadCitiesByState = useCallback(async (stateId) => {
    if (!stateId || stateId === "ALL") {
      // Load all cities if no state selected
      setCitiesLoading(true);
      try {
        const res = await getAllCitiesFromSearch("");
        const list =
          (Array.isArray(res?.data) && res.data) || (Array.isArray(res) && res) || [];

        setCities(
          list
            .map((c) => ({
              id: c?.cityId ?? c?.id ?? c?._id,
              name: c?.cityName ?? c?.name ?? "City",
            }))
            .filter((x) => x.id != null)
        );
      } catch (e) {
        console.error(e);
        setCities([]);
        toast.error("Failed to load cities");
      } finally {
        setCitiesLoading(false);
      }
      return;
    }

    setCitiesLoading(true);
    try {
      const res = await getCities(stateId);
      const list =
        (Array.isArray(res?.data) && res.data) || (Array.isArray(res) && res) || [];

      const mappedCities = list
        .map((c) => ({
          id: c?.cityId ?? c?.id ?? c?._id,
          name: c?.cityName ?? c?.name ?? "City",
        }))
        .filter((x) => x.id != null);

      setCities(mappedCities);

      // Reset city selection if current city is not in the new list
      setDraftCityId((currentCityId) => {
        if (currentCityId && currentCityId !== "ALL") {
          const cityExists = mappedCities.some(c => String(c.id) === String(currentCityId));
          if (!cityExists) {
            return "ALL";
          }
        }
        return currentCityId;
      });
    } catch (e) {
      console.error(e);
      setCities([]);
      toast.error("Failed to load cities for selected state");
    } finally {
      setCitiesLoading(false);
    }
  }, []);

  const buildPayload = useCallback(
    ({
      nextPage = 1,
      nextSearch = "",
      nextTierId = "ALL",
      nextCityId = "ALL",
      nextStateId = "ALL",
      nextStatus = "ALL",
      nextVerify = "ALL",
    }) => ({
      searchText: nextSearch?.trim() || null,
      tierId: nextTierId === "ALL" ? null : String(nextTierId),
      cityId: nextCityId === "ALL" ? null : String(nextCityId),
      stateId: nextStateId === "ALL" ? null : String(nextStateId),
      status: nextStatus === "ALL" ? null : nextStatus,
      verificationStatus: nextVerify === "ALL" ? null : nextVerify,
      pageNo: nextPage,
      pageSize,
      sortBy: null,
      sortDirection: "DESC",
    }),
    []
  );

  const fetchList = useCallback(
    async ({
      nextPage,
      nextSearch,
      nextTierId,
      nextCityId,
      nextStateId,
      nextStatus,
      nextVerify,
      silent = false,
      force = false,
    }) => {
      const payload = buildPayload({
        nextPage,
        nextSearch,
        nextTierId,
        nextCityId,
        nextStateId,
        nextStatus,
        nextVerify,
      });

      const requestKey = JSON.stringify(payload);

      if (!force && lastFetchKeyRef.current === requestKey) {
        return;
      }

      lastFetchKeyRef.current = requestKey;
      setLoading(true);
      setError("");

      try {
        const res = await filterConsultations(payload);
        const list = Array.isArray(res?.data) ? res.data : [];
        const mapped = list.map(mapConsultationToRow);

        setRows(mapped);

        const pr = res?.pageResponse || {};
        const serverTotal =
          Number(pr?.totalElements ?? mapped.length) || mapped.length;
        const serverTotalPages =
          Number(pr?.totalPages ?? Math.max(1, Math.ceil(serverTotal / pageSize))) || 1;
        const serverCurrentPage = Number(pr?.currentPage ?? nextPage) || nextPage;

        setTotalCount(serverTotal);
        setTotalPages(serverTotalPages);
        setPage(serverCurrentPage);
      } catch (e) {
        console.error(e);
        const message = safeErrorMessage(e);
        setError(message);
        setRows([]);
        setTotalCount(0);
        setTotalPages(1);
        setPage(1);

        if (!silent) {
          toast.error(message);
        }
      } finally {
        setLoading(false);
      }
    },
    [buildPayload]
  );

  const queryState = useMemo(
    () => ({
      nextPage: page,
      nextSearch: search,
      nextTierId: tierId,
      nextCityId: cityId,
      nextStateId: stateId,
      nextStatus: status,
      nextVerify: verificationStatus,
    }),
    [page, search, tierId, cityId, stateId, status, verificationStatus]
  );

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    loadKpi();
    loadTiersOnce();
    loadStatesForCountry(countryId);
    loadCitiesOnce();

    fetchList({
      nextPage: 1,
      nextSearch: "",
      nextTierId: "ALL",
      nextCityId: "ALL",
      nextStateId: "ALL",
      nextStatus: "ALL",
      nextVerify: "ALL",
      silent: false,
      force: true,
    });
  }, [countryId, fetchList, loadCitiesOnce, loadKpi, loadStatesForCountry, loadTiersOnce]);

  useEffect(() => {
    if (!didInit.current) return;

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    const isSearching = search.trim().length > 0;

    if (isSearching) {
      searchDebounceRef.current = setTimeout(() => {
        fetchList({
          ...queryState,
          silent: true,
        });
      }, 450);
    } else {
      fetchList({
        ...queryState,
        silent: true,
      });
    }

    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [queryState, search, fetchList]);

  useEffect(() => {
    if (!didInit.current) return;
    // Reset page to 1 when search changes
    setPage(1);
  }, [search]);

  useEffect(() => {
    if (!filtersOpen) return;
    loadStatesForCountry(countryId);

    // Sync draft values with applied values when opening filter sidebar
    setDraftTierId(tierId);
    setDraftStateId(stateId);
    setDraftCityId(cityId);
    setDraftStatus(status);
    setDraftVerificationStatus(verificationStatus);
  }, [filtersOpen, loadStatesForCountry, countryId, tierId, stateId, cityId, status, verificationStatus]);

  useEffect(() => {
    const selectedCity = cities.find(
      (city) => String(city.id) === String(draftCityId)
    );

    if (selectedCity) {
      setCityQuery(selectedCity.name || "");
    } else if (!draftCityId || draftCityId === "ALL") {
      setCityQuery("");
    }
  }, [draftCityId, cities]);

  useEffect(() => {
    const selectedState = states.find(
      (state) => String(state.id) === String(draftStateId)
    );

    if (selectedState) {
      setStateQuery(selectedState.name || "");
    } else if (!draftStateId || draftStateId === "ALL") {
      setStateQuery("");
    }
  }, [draftStateId, states]);

  // Load cities when state changes (but not on initial sync)
  useEffect(() => {
    if (!didInit.current) return;
    if (!filtersOpen) return; // Only load when filters are open

    loadCitiesByState(draftStateId);
  }, [draftStateId, loadCitiesByState, filtersOpen]);

  const handleRefresh = () => {
    lastFetchKeyRef.current = "";
    loadKpi();
    fetchList({
      ...queryState,
      silent: false,
      force: true,
    });
    toast.success("Consultants refreshed");
  };

  const applyFilters = () => {
    setTierId(draftTierId);
    setStateId(draftStateId);
    setCityId(draftCityId);
    setStatus(draftStatus);
    setVerificationStatus(draftVerificationStatus);
    setFiltersOpen(false);
    setPage(1);
  };

  const clearAll = () => {
    lastFetchKeyRef.current = "";

    setSearch("");
    setTierId("ALL");
    setDraftTierId("ALL");
    setStateId("ALL");
    setDraftStateId("ALL");
    setCityId("ALL");
    setDraftCityId("ALL");
    setStatus("ALL");
    setDraftStatus("ALL");
    setVerificationStatus("ALL");
    setDraftVerificationStatus("ALL");
    setFiltersOpen(false);
    setPage(1);

    fetchList({
      nextPage: 1,
      nextSearch: "",
      nextTierId: "ALL",
      nextCityId: "ALL",
      nextStateId: "ALL",
      nextStatus: "ALL",
      nextVerify: "ALL",
      silent: true,
      force: true,
    });
  };

  const activeFilters =
    search ||
    tierId !== "ALL" ||
    stateId !== "ALL" ||
    cityId !== "ALL" ||
    status !== "ALL" ||
    verificationStatus !== "ALL";

  const stats = useMemo(() => {
    return {
      total: kpi.totalConsultations || totalCount || rows.length,
      active:
        kpi.totalActiveConsultations ||
        rows.filter((r) => String(r.status).toUpperCase() === "ACTIVE").length,
      verified:
        kpi.totalVerifiedConsultations ||
        rows.filter((r) => String(r.verificationStatus).toUpperCase() === "VERIFIED").length,
      highRisk: rows.filter((r) =>
        String(r.risk || "").toLowerCase().includes("high")
      ).length,
    };
  }, [kpi, rows, totalCount]);

  const handleOldSuspendConfirm = (item) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === item.id ? { ...r, status: "INACTIVE", risk: "High" } : r
      )
    );

    if (selectedConsultant?.id === item.id) {
      setSelectedConsultant((prev) => ({
        ...prev,
        status: "INACTIVE",
        risk: "High",
      }));
    }

    setModal(null);
    toast.success("Consultant suspended");
  };

  const handleFlag = (item) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === item.id
          ? { ...r, verificationStatus: "REQUEST_CHANGES", risk: "Moderate" }
          : r
      )
    );

    if (selectedConsultant?.id === item.id) {
      setSelectedConsultant((prev) => ({
        ...prev,
        verificationStatus: "REQUEST_CHANGES",
        risk: "Moderate",
      }));
    }

    toast.success("Consultant flagged for review");
  };

  const handleNote = (item) => {
    toast.success(`Internal note action for ${item.name}`);
  };

  const filteredCities = useMemo(() => {
    if (!cityQuery.trim()) return cities;
    const q = cityQuery.toLowerCase();
    return cities.filter((c) => c.name.toLowerCase().includes(q));
  }, [cities, cityQuery]);

  const filteredStates = useMemo(() => {
    if (!stateQuery.trim()) return states;
    const q = stateQuery.toLowerCase();
    return states.filter((s) => s.name.toLowerCase().includes(q));
  }, [states, stateQuery]);

  // Modal handlers
  const openModal = (type, consultantId, consultantName) => {
    setActionModal({ open: true, type, consultantId, consultantName });
    // Reset all modal states
    setSuspendReason("");
    setSuspendType("TEMPORARY");
    setSuspendUntil("");
    setSelectedTier("");
    setApplyType("IMMEDIATE");
    setDiscountPercentage("");
    setManualPrice("");
    setTierChangeReason("");
    setFlagCategory("");
    setFlagSeverity("");
    setFlagNotes("");
    setAuditType("");
    setAuditReason("");
    setNoteText("");
    setNoteVisibility("INTERNAL_ONLY");
  };

  const closeModal = () => {
    setActionModal({ open: false, type: "", consultantId: null, consultantName: "" });
    setActionLoading(false);
  };
  const handleSuspendConfirm = async () => {
    try {
      setActionLoading(true);

      await suspendConsultation({
        consultId: actionModal.consultantId,
        reason: suspendReason,
        suspendType: suspendType,
        suspendUntil: suspendType === "TEMPORARY" ? suspendUntil : null,
      });

      toast.success("Consultant suspended successfully");
      closeModal();
      handleRefresh();
    } catch (e) {
      console.error("Failed to suspend consultant:", e);
      toast.error(
        e?.response?.data?.message ||
        e?.message ||
        "Failed to suspend consultant"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangeTierConfirm = async () => {
    try {
      setActionLoading(true);

      await changeConsultantTier({
        consultId: actionModal.consultantId,
        newTierId: selectedTier,
        applyType: applyType,
        discountPercentage: discountPercentage ? parseFloat(discountPercentage) : null,
        manualPrice: manualPrice ? parseFloat(manualPrice) : null,
        reason: tierChangeReason,
      });

      toast.success("Tier plan changed successfully");
      closeModal();
      handleRefresh();
    } catch (e) {
      console.error("Failed to change tier plan:", e);
      toast.error(
        e?.response?.data?.message ||
        e?.message ||
        "Failed to change tier plan"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleFlagReviewConfirm = async () => {
    try {
      setActionLoading(true);

      await flagConsultationReview({
        consultId: actionModal.consultantId,
        flagCategory: flagCategory,
        severity: flagSeverity,
        internalNotes: flagNotes,
      });

      toast.success("Consultant flagged for review");
      closeModal();
      handleRefresh();
    } catch (e) {
      console.error("Failed to flag consultant:", e);
      toast.error(
        e?.response?.data?.message ||
        e?.message ||
        "Failed to flag consultant"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleForceAuditConfirm = async () => {
    try {
      setActionLoading(true);

      await forceAuditConsultation({
        consultId: actionModal.consultantId,
        auditType: auditType,
        reason: auditReason,
      });

      toast.success("Audit initiated successfully");
      closeModal();
      handleRefresh();
    } catch (e) {
      console.error("Failed to initiate audit:", e);
      toast.error(
        e?.response?.data?.message ||
        e?.message ||
        "Failed to initiate audit"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddNoteConfirm = async () => {
    try {
      setActionLoading(true);

      await addInternalNote({
        consultId: actionModal.consultantId,
        note: noteText,
        visibility: noteVisibility,
        attachmentUrl: null,
      });

      toast.success("Internal note added successfully");
      closeModal();
      handleRefresh();
    } catch (e) {
      console.error("Failed to add note:", e);
      toast.error(
        e?.response?.data?.message ||
        e?.message ||
        "Failed to add note"
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden p-0">
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

      <style>{`
        .table-scroll::-webkit-scrollbar { height: 6px; width: 8px; }
        .table-scroll::-webkit-scrollbar-track { background: transparent; }
        .table-scroll::-webkit-scrollbar-thumb { background: rgba(148,163,184,0.35); border-radius: 6px; }
        .table-scroll::-webkit-scrollbar-thumb:hover { background: rgba(100,116,139,0.45); }
      `}</style>

      <div className="flex flex-1 flex-col space-y-4 overflow-hidden p-6">
        <section className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="mb-1 text-[32px] font-extrabold tracking-tight text-slate-900">
              All Consultants
            </h1>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <TopCard
            title="Total Consultants"
            value={kpiLoading ? "..." : stats.total}
            icon={User}
            valueClass="text-black-600"
          />
          <TopCard
            title="Active"
            value={kpiLoading ? "..." : stats.active}
            icon={BadgeCheck}
            valueClass="text-emerald-600"
          />
          <TopCard
            title="Verified"
            value={kpiLoading ? "..." : stats.verified}
            icon={Star}
            valueClass="text-amber-600"
          />
          <TopCard
            title="High Risk"
            value={loading ? "..." : stats.highRisk}
            icon={ShieldAlert}
            valueClass="text-rose-600"
          />
        </section>

        <section className="relative flex flex-1 flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
          <div className="pointer-events-none absolute -top-10 right-10 h-48 w-48 rounded-full bg-sky-100/60 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-indigo-50 blur-3xl" />

          <div className="relative z-10 shrink-0 border-b border-slate-200 px-4 py-4 md:px-6">
            <div className="flex items-center gap-2.5 md:gap-4 lg:justify-between">
              <div className="relative min-w-0 flex-1 max-w-2xl">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by consultant name, city..."
                  className="h-11 md:h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-[13px] md:text-[14px] font-medium text-slate-900 outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-100 placeholder:text-slate-400"
                />
              </div>

              <div className="flex shrink-0 items-center gap-2 md:gap-3">
                <button
                  onClick={() => setFiltersOpen(true)}
                  className="inline-flex h-11 md:h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 md:px-5 text-[13px] font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
                  type="button"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden md:inline">Filters</span>
                  {activeFilters && (
                    <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-900 px-1.5 text-[10px] font-black text-white">
                      {[tierId !== "ALL", stateId !== "ALL", cityId !== "ALL", status !== "ALL", verificationStatus !== "ALL"].filter(Boolean).length}
                    </span>
                  )}
                </button>

                <button
                  onClick={handleRefresh}
                  className="flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
                  title="Refresh List"
                  type="button"
                >
                  {loading || kpiLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin text-sky-500" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {error ? (
            <div className="px-6 pt-5 relative z-10 shrink-0">
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] font-medium text-rose-700">
                {error}
              </div>
            </div>
          ) : null}

          <div className="relative z-10 flex-1 overflow-auto">
            <div className="table-scroll h-full w-full overflow-x-auto overflow-y-auto">
              <table className="min-w-[1520px] w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-slate-50/80 backdrop-blur-sm">
                    <th className="border-b border-r border-slate-200/60 px-6 py-4.5 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                      Consultant
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                      Tier
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                      City
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                      Vehicles
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                      Inquiries
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                      Response Time
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                      Conversion
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                      Rating
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                      Risk
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                      Status
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                      Verification
                    </th>
                    <th className="border-b border-slate-200 px-6 py-4.5 text-right text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={12} className="px-6 py-24 text-center">
                        <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Loading consultants...
                        </div>
                      </td>
                    </tr>
                  ) : rows.length ? (
                    rows.map((row, idx) => {
                      const idLabel = row?.id
                        ? String(row.id).slice(0, 8).toUpperCase()
                        : `C${String(idx + 1).padStart(3, "0")}`;

                      return (
                        <tr
                          key={row.id || idx}
                          className={cls(
                            "group relative",
                            idx % 2 === 0 ? "bg-white" : "bg-slate-50/35",
                            "transition-colors duration-200 hover:bg-sky-50/45"
                          )}
                        >
                          <td className="border-b border-slate-100 px-6 py-4.5 align-middle">
                            <button
                              type="button"
                              onClick={() => setSelectedConsultant(row)}
                              className="flex items-center gap-3 text-left"
                            >
                              <div className="h-10 w-10 overflow-hidden rounded-full border border-slate-200 bg-slate-100 flex items-center justify-center shrink-0">
                                {row.logoURL ? (
                                  <img
                                    src={row.logoURL}
                                    alt={row.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <span className="text-xs font-bold text-slate-500">
                                    {(row.name || "C").charAt(0)}
                                  </span>
                                )}
                              </div>

                              <div className="min-w-0">
                                <div
                                  className="truncate text-[14px] font-bold text-slate-900 transition-colors group-hover:text-sky-700 cursor-pointer"
                                  title="View Consultant Details"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/admin/consultants/profile/${row.id}`);
                                  }}
                                >
                                  {row.name || "-"}
                                </div>
                              </div>
                            </button>
                          </td>

                          <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                            <span
                              className={cls(
                                "inline-flex rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.03em] whitespace-nowrap",
                                tierBadge(row.tierTitle)
                              )}
                            >
                              {row.tierTitle || "-"}
                            </span>
                          </td>

                          <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                            <div className="inline-flex items-center gap-2 text-[13px] font-medium text-slate-600 whitespace-nowrap">
                              {row.city || "-"}
                            </div>
                          </td>

                          <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                            <div className="inline-flex h-8 min-w-8 items-center justify-center rounded-xl border border-slate-200 bg-white px-2.5 text-[12.5px] font-extrabold text-slate-800 shadow-sm ring-4 ring-slate-50">
                              {fmtInt(row.vehicles)}
                            </div>
                          </td>

                          <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                            <div className="inline-flex h-8 min-w-8 items-center justify-center rounded-xl border border-slate-200 bg-white px-2.5 text-[12.5px] font-extrabold text-slate-800 shadow-sm ring-4 ring-slate-50">
                              {fmtInt(row.inquiries)}
                            </div>
                          </td>

                          <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                            <div className="text-[13px] font-medium text-slate-500 whitespace-nowrap">
                              {fmtHours(row.responseTime)}
                            </div>
                          </td>

                          <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                            <div className="text-[13.5px] font-bold text-slate-900 whitespace-nowrap tracking-tight">
                              {fmtPct(row.conversion)}
                            </div>
                          </td>

                          <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                            <div className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-900">
                              {Number(row.rating || 0).toFixed(1).replace(".0", "")}
                              <Star size={14} className="text-amber-500 fill-amber-500" />
                            </div>
                          </td>

                          <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                            <span
                              className={cls(
                                "inline-flex rounded-full border px-3 py-1 text-[11px] font-bold whitespace-nowrap",
                                riskBadge(row.risk)
                              )}
                            >
                              {row.risk || "Low"}
                            </span>
                          </td>

                          <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                            <span
                              className={cls(
                                "inline-flex rounded-full border px-3 py-1 text-[11px] font-bold whitespace-nowrap",
                                statusBadge(row.status)
                              )}
                            >
                              {String(row.status || "-").replaceAll("_", " ")}
                            </span>
                          </td>

                          <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                            <span
                              className={cls(
                                "inline-flex rounded-full border px-3 py-1 text-[11px] font-bold whitespace-nowrap",
                                statusBadge(row.verificationStatus)
                              )}
                            >
                              {String(row.verificationStatus || "-").replaceAll("_", " ")}
                            </span>
                          </td>

                          <td className="border-b border-slate-100 px-6 py-4.5 text-right align-middle">
                            <RowActions
                              consultantId={row.id}
                              consultantName={row.name}
                              onOpenModal={openModal}
                            />
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={12} className="px-6 py-28 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-400">
                            <User size={28} />
                          </div>
                          <div className="text-lg font-bold tracking-tight text-slate-900">
                            No consultants found
                          </div>
                          <div className="mx-auto mt-1 max-w-sm text-[14px] text-slate-500">
                            Try adjusting your search criteria or clear active filters to see more results.
                          </div>
                          {activeFilters && (
                            <button
                              onClick={clearAll}
                              className="mt-6 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50"
                              type="button"
                            >
                              Clear search & filters
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="relative z-10 flex shrink-0 flex-col gap-3 border-t border-slate-200 bg-white px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-slate-500">
              Page <span className="font-semibold text-slate-900">{page}</span> /{" "}
              <span className="font-semibold text-slate-900">{totalPages}</span>
              <span className="ml-2">• {totalCount} total records</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
              >
                Prev
              </button>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFiltersOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.aside
              initial={{ x: 420, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 420, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-[440px] flex-col border-l border-slate-200 bg-white shadow-2xl"
            >
              <div className="shrink-0 border-b border-slate-200 bg-gradient-to-br from-slate-50 via-white to-sky-50/30 px-6 py-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/20">
                        <SlidersHorizontal className="h-5 w-5" />
                      </div>
                      <h3 className="text-2xl font-black tracking-tight text-slate-900">
                        Filters
                      </h3>
                    </div>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      Refine your consultant search results
                    </p>
                  </div>

                  <button
                    onClick={() => setFiltersOpen(false)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 active:scale-95"
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 space-y-5 overflow-y-auto p-6 bg-slate-50/30">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Location</h4>
                  </div>
                  <div className="space-y-4">
                    <SimpleDropdown
                      key="state-dropdown"
                      label="State"
                      value={String(draftStateId || "ALL")}
                      onChange={(val) => {
                        setDraftStateId(val);
                      }}
                      options={states}
                      loading={statesLoading}
                      placeholder="All States"
                    />

                    <SimpleDropdown
                      key="city-dropdown"
                      label="City"
                      value={String(draftCityId || "ALL")}
                      onChange={(val) => setDraftCityId(val)}
                      options={cities}
                      loading={citiesLoading}
                      placeholder="All Cities"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                  <div className="mb-4 flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-slate-400" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Consultant Details</h4>
                  </div>

                  {/* Tier Plan Dropdown */}
                  <div>
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Tier Plan
                    </label>
                    <div className="relative">
                      <select
                        value={draftTierId}
                        onChange={(e) => setDraftTierId(e.target.value)}
                        className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-[13px] font-semibold text-slate-900 outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-100 shadow-sm"
                      >
                        <option value="ALL">All Tiers</option>
                        {tierPlans.map((tier) => (
                          <option key={tier.id} value={tier.id}>
                            {tier.title}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div>
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Status
                    </label>
                    <div className="relative">
                      <select
                        value={draftStatus}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          setDraftStatus(newStatus);
                          // Reset verification status if ACTIVE is selected and current is REQUESTED
                          if (newStatus === "ACTIVE" && draftVerificationStatus === "REQUESTED") {
                            setDraftVerificationStatus("ALL");
                          }
                        }}
                        className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-[13px] font-semibold text-slate-900 outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-100 shadow-sm"
                      >
                        <option value="ALL">All Status</option>
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status.replace(/_/g, " ")}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>

                  {/* Verification Status Dropdown */}
                  <div>
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Verification Status
                    </label>
                    <div className="relative">
                      <select
                        value={draftVerificationStatus}
                        onChange={(e) => setDraftVerificationStatus(e.target.value)}
                        className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-[13px] font-semibold text-slate-900 outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-100 shadow-sm"
                      >
                        <option value="ALL">All Verification</option>
                        {filteredVerifyOptions.map((verify) => (
                          <option key={verify} value={verify}>
                            {verify.replace(/_/g, " ")}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-gradient-to-br from-slate-50 via-white to-sky-50/30 px-6 py-5 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
                <button
                  onClick={clearAll}
                  className="flex-1 rounded-xl border-2 border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
                  type="button"
                >
                  Clear All
                </button>
                <button
                  onClick={applyFilters}
                  className="flex-1 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/30 active:scale-95"
                  type="button"
                >
                  Apply Filters
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <ConsultantProfileDrawer
        item={selectedConsultant}
        onClose={() => setSelectedConsultant(null)}
        onSuspend={(item) => setModal({ type: "suspend", item })}
        onFlag={handleFlag}
      />

      <SuspendModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleOldSuspendConfirm}
      />

      {/* Action Modals */}
      <SuspendConsultantModal
        open={actionModal.open && actionModal.type === "suspend"}
        consultantName={actionModal.consultantName}
        suspendReason={suspendReason}
        setSuspendReason={setSuspendReason}
        suspendType={suspendType}
        setSuspendType={setSuspendType}
        suspendUntil={suspendUntil}
        setSuspendUntil={setSuspendUntil}
        loading={actionLoading}
        onClose={closeModal}
        onConfirm={handleSuspendConfirm}
      />

      <ChangeTierModal
        open={actionModal.open && actionModal.type === "changeTier"}
        consultantName={actionModal.consultantName}
        selectedTier={selectedTier}
        setSelectedTier={setSelectedTier}
        tierPlans={tierPlans}
        applyType={applyType}
        setApplyType={setApplyType}
        discountPercentage={discountPercentage}
        setDiscountPercentage={setDiscountPercentage}
        manualPrice={manualPrice}
        setManualPrice={setManualPrice}
        reason={tierChangeReason}
        setReason={setTierChangeReason}
        loading={actionLoading}
        onClose={closeModal}
        onConfirm={handleChangeTierConfirm}
      />

      <FlagReviewModal
        open={actionModal.open && actionModal.type === "flagReview"}
        consultantName={actionModal.consultantName}
        flagCategory={flagCategory}
        setFlagCategory={setFlagCategory}
        flagSeverity={flagSeverity}
        setFlagSeverity={setFlagSeverity}
        flagNotes={flagNotes}
        setFlagNotes={setFlagNotes}
        loading={actionLoading}
        onClose={closeModal}
        onConfirm={handleFlagReviewConfirm}
      />

      <ForceAuditModal
        open={actionModal.open && actionModal.type === "forceAudit"}
        consultantName={actionModal.consultantName}
        auditType={auditType}
        setAuditType={setAuditType}
        auditReason={auditReason}
        setAuditReason={setAuditReason}
        loading={actionLoading}
        onClose={closeModal}
        onConfirm={handleForceAuditConfirm}
      />

      <AddNoteModal
        open={actionModal.open && actionModal.type === "addNote"}
        consultantName={actionModal.consultantName}
        noteText={noteText}
        setNoteText={setNoteText}
        noteVisibility={noteVisibility}
        setNoteVisibility={setNoteVisibility}
        loading={actionLoading}
        onClose={closeModal}
        onConfirm={handleAddNoteConfirm}
      />
    </div>
  );
};

function SimpleDropdown({
  label,
  value,
  onChange,
  options,
  placeholder = "Select...",
  loading = false,
}) {
  // Ensure value is always a string for comparison
  const normalizedValue = String(value || "ALL");

  return (
    <div className="block">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </div>

      <div className="relative">
        <select
          value={normalizedValue}
          onChange={(e) => {
            const newValue = e.target.value;
            onChange(newValue);
          }}
          disabled={loading}
          className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-[13px] font-semibold text-slate-900 outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-100 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="ALL">{placeholder}</option>
          {options.map((item) => (
            <option key={String(item.id)} value={String(item.id)}>
              {item.title || item.name}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );
}

function SearchableCombobox({
  label,
  value,
  onChange,
  query,
  setQuery,
  open,
  setOpen,
  options,
  allOptions,
  loading,
  placeholder = "Search...",
}) {
  const wrapperRef = useRef(null);
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const displayOptions = useMemo(() => {
    return [{ id: "", name: placeholder, title: placeholder }, ...options];
  }, [options, placeholder]);

  useEffect(() => {
    if (!open) {
      setActiveIndex(-1);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  const handleSelect = (item) => {
    onChange(item.id ? String(item.id) : "ALL");
    setQuery(item.id ? (item.title || item.name || "") : "");
    setOpen(false);
    setActiveIndex(-1);
  };

  useEffect(() => {
    if (activeIndex !== -1 && scrollRef.current) {
      const activeEl = scrollRef.current.children[activeIndex];
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeIndex]);

  const handleKeyDown = (e) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter") {
        setOpen(true);
        return;
      }
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < displayOptions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : displayOptions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < displayOptions.length) {
        handleSelect(displayOptions[activeIndex]);
      } else if (query.trim()) {
        const match = options.find(
          (o) => (o.name?.toLowerCase() === query.trim().toLowerCase()) ||
            (o.title?.toLowerCase() === query.trim().toLowerCase())
        );
        if (match) handleSelect(match);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  useEffect(() => {
    const handleOutside = (e) => {
      if (!wrapperRef.current?.contains(e.target)) {
        setOpen(false);

        const selected = allOptions.find(
          (o) => String(o.id) === String(value)
        );

        setQuery(selected ? (selected.title || selected.name || "") : "");
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [allOptions, setOpen, setQuery, value]);

  return (
    <div className="block" ref={wrapperRef}>
      <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </div>

      <div className="relative">
        <input
          value={query}
          onChange={(e) => {
            const nextValue = e.target.value;
            setQuery(nextValue);

            if (!open) setOpen(true);

            if (!nextValue.trim()) {
              onChange("ALL");
            }
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={loading ? "Loading..." : placeholder}
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 pr-10 text-[13px] font-semibold text-slate-900 outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-100 placeholder:text-slate-400 shadow-sm"
        />

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <ChevronDown
            className={cls(
              "h-4 w-4 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              ref={scrollRef}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute left-0 right-0 top-[calc(100%+8px)] z-[80] max-h-64 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/40"
            >
              {loading ? (
                <div className="px-3 py-3 text-[13px] font-medium text-slate-500">
                  Loading...
                </div>
              ) : displayOptions.length > 0 ? (
                displayOptions.map((item, idx) => {
                  const isAll = item.id === "";
                  const active = isAll
                    ? !value || value === "ALL"
                    : String(value) === String(item.id);
                  const highlighted = activeIndex === idx;
                  const displayName = item.title || item.name;

                  return (
                    <button
                      key={item.id || `all-${label}`}
                      type="button"
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={cls(
                        "flex w-full items-center rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition-all duration-200",
                        active
                          ? "bg-sky-50 text-sky-700 font-bold"
                          : highlighted
                            ? "translate-x-1 bg-sky-50/50 text-sky-800"
                            : "text-slate-700 hover:bg-slate-50 hover:translate-x-1"
                      )}
                    >
                      <span className="truncate">{displayName}</span>
                    </button>
                  );
                })
              ) : (
                <div className="px-3 py-3 text-[13px] font-medium text-slate-500">
                  No results found
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Allconsultants;