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
} from "../../../api/consultationApi";
import { getTierPlans } from "../../../api/tierPlan.api";
import { getStates, getAllCitiesFromSearch } from "../../../api/addressApi";

/* =========================================================
   HELPERS
========================================================= */
const cls = (...a) => a.filter(Boolean).join(" ");

const fmtInt = (v) => (Number.isFinite(Number(v)) ? Math.round(Number(v)) : 0);

const fmtHours = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return "N/A";
  if (n > 100000) {
    const hours = n / (1000 * 60 * 60);
    return hours < 1 ? `${Math.round(hours * 60)}m` : `${hours.toFixed(1)}h`;
  }
  return n % 1 === 0 ? `${n}h` : `${n.toFixed(1)}h`;
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

function RowActions({ consultantId }) {
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
    navigate(`/admin/consultants/suspend/${consultantId}`);
    setOpen(false);
  };

  /* CHANGE TIER */
  const handleChangeTier = () => {
    navigate(`/admin/consultants/change-tier/${consultantId}`);
    setOpen(false);
  };

  /* VIEW RANKING */
  const handleViewRanking = () => {
    navigate(`/admin/consultants/ranking/${consultantId}`);
    setOpen(false);
  };

  /* FLAG FOR REVIEW */
  const handleFlagForReview = () => {
    navigate(`/admin/consultants/flag-review/${consultantId}`);
    setOpen(false);
  };

  /* FORCE AUDIT */
  const handleForceAudit = () => {
    navigate(`/admin/consultants/force-audit/${consultantId}`);
    setOpen(false);
  };

  /* ADD INTERNAL NOTE */
  const handleAddNote = () => {
    navigate(`/admin/consultants/add-note/${consultantId}`);
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

function TopCard({ title, value, icon: Icon = User }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50/80 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative z-10 flex items-center justify-between gap-4">
        <div>
          <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            {title}
          </div>
          <div className="text-4xl font-extrabold tracking-tight text-slate-900">
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
  const didInit = useRef(false);
  const lastFetchKeyRef = useRef("");
  const searchDebounceRef = useRef(null);

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

  const [tierDropdownOpen, setTierDropdownOpen] = useState(false);
  const [tierQuery, setTierQuery] = useState("");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [statusQuery, setStatusQuery] = useState("");
  const [verificationDropdownOpen, setVerificationDropdownOpen] = useState(false);
  const [verificationQuery, setVerificationQuery] = useState("");

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
    if (cities.length > 0 || citiesLoading) return;

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
  }, [cities.length, citiesLoading]);

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
    loadCitiesOnce();

    // Sync draft values with applied values when opening filter sidebar
    setDraftTierId(tierId);
    setDraftStateId(stateId);
    setDraftCityId(cityId);
    setDraftStatus(status);
    setDraftVerificationStatus(verificationStatus);
  }, [filtersOpen, loadCitiesOnce, loadStatesForCountry, countryId, tierId, stateId, cityId, status, verificationStatus]);

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

  useEffect(() => {
    const selectedTier = tierPlans.find(
      (tier) => String(tier.id) === String(draftTierId)
    );

    if (selectedTier) {
      setTierQuery(selectedTier.title || "");
    } else if (!draftTierId || draftTierId === "ALL") {
      setTierQuery("");
    }
  }, [draftTierId, tierPlans]);

  useEffect(() => {
    if (draftStatus && draftStatus !== "ALL") {
      setStatusQuery(draftStatus.replace(/_/g, " "));
    } else {
      setStatusQuery("");
    }
  }, [draftStatus]);

  useEffect(() => {
    if (draftVerificationStatus && draftVerificationStatus !== "ALL") {
      setVerificationQuery(draftVerificationStatus.replace(/_/g, " "));
    } else {
      setVerificationQuery("");
    }
  }, [draftVerificationStatus]);

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

  const handleSuspendConfirm = (item) => {
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

  const filteredTierPlans = useMemo(() => {
    if (!tierQuery.trim()) return tierPlans;
    const q = tierQuery.toLowerCase();
    return tierPlans.filter((t) => t.title.toLowerCase().includes(q));
  }, [tierPlans, tierQuery]);

  const filteredStatusOptions = useMemo(() => {
    if (!statusQuery.trim()) return STATUS_OPTIONS.map(s => ({ id: s, name: s.replace(/_/g, " ") }));
    const q = statusQuery.toLowerCase();
    return STATUS_OPTIONS.map(s => ({ id: s, name: s.replace(/_/g, " ") }))
      .filter((s) => s.name.toLowerCase().includes(q));
  }, [statusQuery]);

  const filteredVerificationOptions = useMemo(() => {
    if (!verificationQuery.trim()) return VERIFY_OPTIONS.map(v => ({ id: v, name: v.replace(/_/g, " ") }));
    const q = verificationQuery.toLowerCase();
    return VERIFY_OPTIONS.map(v => ({ id: v, name: v.replace(/_/g, " ") }))
      .filter((v) => v.name.toLowerCase().includes(q));
  }, [verificationQuery]);

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
          />
          <TopCard
            title="Active"
            value={kpiLoading ? "..." : stats.active}
            icon={BadgeCheck}
          />
          <TopCard
            title="Verified"
            value={kpiLoading ? "..." : stats.verified}
            icon={Star}
          />
          <TopCard
            title="High Risk"
            value={loading ? "..." : stats.highRisk}
            icon={ShieldAlert}
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
                                <div className="truncate text-[14px] font-bold text-slate-900 transition-colors group-hover:text-sky-700">
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
                              {row.tierTitle || "Basic"}
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
                              {String(row.status || "UNKNOWN").replaceAll("_", " ")}
                            </span>
                          </td>

                          <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                            <span
                              className={cls(
                                "inline-flex rounded-full border px-3 py-1 text-[11px] font-bold whitespace-nowrap",
                                statusBadge(row.verificationStatus)
                              )}
                            >
                              {String(row.verificationStatus || "N/A").replaceAll("_", " ")}
                            </span>
                          </td>

                          <td className="border-b border-slate-100 px-6 py-4.5 text-right align-middle">
                            <RowActions consultantId={row.id} />
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
                    <SearchableCombobox
                      label="State"
                      value={draftStateId}
                      onChange={(val) => setDraftStateId(val)}
                      query={stateQuery}
                      setQuery={setStateQuery}
                      open={stateDropdownOpen}
                      setOpen={setStateDropdownOpen}
                      options={filteredStates}
                      allOptions={states}
                      loading={statesLoading}
                      placeholder="All States"
                    />

                    <SearchableCombobox
                      label="City"
                      value={draftCityId}
                      onChange={(val) => setDraftCityId(val)}
                      query={cityQuery}
                      setQuery={setCityQuery}
                      open={cityDropdownOpen}
                      setOpen={setCityDropdownOpen}
                      options={filteredCities}
                      allOptions={cities}
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

                  <SearchableCombobox
                    label="Tier Plan"
                    value={draftTierId}
                    onChange={(val) => setDraftTierId(val)}
                    query={tierQuery}
                    setQuery={setTierQuery}
                    open={tierDropdownOpen}
                    setOpen={setTierDropdownOpen}
                    options={filteredTierPlans}
                    allOptions={tierPlans}
                    loading={tierLoading}
                    placeholder="All Tiers"
                  />

                  <SearchableCombobox
                    label="Status"
                    value={draftStatus}
                    onChange={(val) => setDraftStatus(val)}
                    query={statusQuery}
                    setQuery={setStatusQuery}
                    open={statusDropdownOpen}
                    setOpen={setStatusDropdownOpen}
                    options={filteredStatusOptions}
                    allOptions={STATUS_OPTIONS.map(s => ({ id: s, name: s.replace(/_/g, " ") }))}
                    loading={false}
                    placeholder="All Status"
                  />

                  <SearchableCombobox
                    label="Verification Status"
                    value={draftVerificationStatus}
                    onChange={(val) => setDraftVerificationStatus(val)}
                    query={verificationQuery}
                    setQuery={setVerificationQuery}
                    open={verificationDropdownOpen}
                    setOpen={setVerificationDropdownOpen}
                    options={filteredVerificationOptions}
                    allOptions={VERIFY_OPTIONS.map(v => ({ id: v, name: v.replace(/_/g, " ") }))}
                    loading={false}
                    placeholder="All Verification"
                  />
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
        onConfirm={handleSuspendConfirm}
      />
    </div>
  );
};

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