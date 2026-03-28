// src/pages/admin/consultants/Allconsultants.jsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
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
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
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
    <div className="relative rounded-2xl border border-slate-200 bg-white p-6 overflow-hidden group shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10 flex items-end justify-between">
        <div>
          <div className="text-[12px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-2">
            {title}
          </div>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900">
            {value}
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 transition-colors duration-300">
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
  const [tierLoaded, setTierLoaded] = useState(false);
  const [tierLoading, setTierLoading] = useState(false);

  const [countryId] = useState(DEFAULT_COUNTRY_ID);

  const [states, setStates] = useState([]);
  const [stateId, setStateId] = useState("ALL");
  const [statesLoadedFor, setStatesLoadedFor] = useState(null);
  const [statesLoading, setStatesLoading] = useState(false);

  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [cityId, setCityId] = useState("ALL");

  const [status, setStatus] = useState("ALL");
  const [verificationStatus, setVerificationStatus] = useState("ALL");

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
  }, [countryId, fetchList, loadCitiesOnce, loadKpi, loadStatesForCountry]);

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
    if (page !== 1) {
      setPage(1);
    }
  }, [search, tierId, stateId, cityId, status, verificationStatus, page]);

  useEffect(() => {
    if (!filtersOpen) return;
    loadTiersOnce();
    loadStatesForCountry(countryId);
    loadCitiesOnce();
  }, [filtersOpen, loadCitiesOnce, loadStatesForCountry, loadTiersOnce, countryId]);

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

  const clearAll = () => {
    lastFetchKeyRef.current = "";

    setSearch("");
    setTierId("ALL");
    setStateId("ALL");
    setCityId("ALL");
    setStatus("ALL");
    setVerificationStatus("ALL");
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

  return (
    <div className="min-h-screen p-0">
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
        .table-scroll::-webkit-scrollbar { height: 6px; }
        .table-scroll::-webkit-scrollbar-track { background: transparent; }
        .table-scroll::-webkit-scrollbar-thumb { background: rgba(148,163,184,0.35); border-radius: 6px; }
        .table-scroll::-webkit-scrollbar-thumb:hover { background: rgba(100,116,139,0.45); }
      `}</style>

      <div className="mx-auto space-y-6">
        <section className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
              All Consultants
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-500">
              Manage consultant accounts, performance signals, tier controls,
              verification states, and overall marketplace quality.
            </p>
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

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-100 blur-[100px] pointer-events-none" />

          <div className="p-5 md:p-6 relative z-10 border-b border-slate-200">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="relative flex-1 max-w-2xl">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by consultant name..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-11 text-[14px] text-slate-900 outline-none transition-all focus:border-sky-400 placeholder:text-slate-400"
                />
                {search ? (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  >
                    <X size={14} />
                  </button>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setFiltersOpen((p) => !p)}
                  className={cls(
                    "inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-[13px] font-semibold transition-colors",
                    filtersOpen
                      ? "bg-sky-600 text-white border-sky-600"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  )}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </button>

                {activeFilters ? (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="inline-flex h-11 items-center rounded-xl border border-slate-200 bg-white px-4 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Clear
                  </button>
                ) : null}

                <button
                  onClick={handleRefresh}
                  className="inline-flex h-11 items-center justify-center w-11 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                  title="Refresh List"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {filtersOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-200 pt-5 md:grid-cols-2 xl:grid-cols-5"
                >
                  <div className="flex items-center justify-between col-span-full mb-2">
                    <h4 className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">
                      Advanced Filters
                    </h4>
                    <button
                      onClick={clearAll}
                      className="text-[12px] text-sky-700 hover:text-sky-800 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>

                  <select
                    value={tierId}
                    onChange={(e) => setTierId(e.target.value)}
                    className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                  >
                    <option value="ALL">{tierLoading ? "Loading..." : "All Tiers"}</option>
                    {tierPlans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>

                  <select
                    value={stateId}
                    onChange={(e) => setStateId(e.target.value)}
                    className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                  >
                    <option value="ALL">{statesLoading ? "Loading..." : "All States"}</option>
                    {states.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={cityId}
                    onChange={(e) => setCityId(e.target.value)}
                    className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                  >
                    <option value="ALL">{citiesLoading ? "Loading..." : "All Cities"}</option>
                    {cities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                  >
                    <option value="ALL">All Status</option>
                    {STATUS_OPTIONS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                  <select
                    value={verificationStatus}
                    onChange={(e) => setVerificationStatus(e.target.value)}
                    className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                  >
                    <option value="ALL">All Verification</option>
                    {VERIFY_OPTIONS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {error ? (
            <div className="px-6 pt-5 relative z-10">
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] font-medium text-rose-700">
                {error}
              </div>
            </div>
          ) : null}

          <div className="w-full overflow-x-auto table-scroll relative z-10 pb-4">
            <table className="min-w-[1500px] w-full border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Consultant</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Tier</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">City</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap text-center">Vehicles</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap text-center">Inquiries</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Response Time</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Conversion</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Rating</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Risk</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Status</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Verification</th>
                  <th className="px-6 py-4 text-right font-semibold whitespace-nowrap">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={12} className="px-6 py-28 text-center">
                      <div className="text-[14px] font-medium text-slate-500">
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
                      <motion.tr
                        key={row.id || idx}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cls(
                          "transition-colors duration-200 hover:bg-slate-50 group",
                          selectedConsultant?.id === row.id && "bg-sky-50"
                        )}
                      >
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() => setSelectedConsultant(row)}
                            className="flex items-center gap-3 text-left"
                          >
                            <div className="h-10 w-10 overflow-hidden rounded-full border border-slate-200 bg-slate-100 flex items-center justify-center">
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

                            <div>
                              <div className="text-[14px] font-bold text-slate-900 transition-colors group-hover:text-sky-700">
                                {row.name || "-"}
                              </div>
                    
                            </div>
                          </button>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={cls(
                              "inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap",
                              tierBadge(row.tierTitle)
                            )}
                          >
                            {row.tierTitle || "Basic"}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-[13px] font-medium text-slate-600 whitespace-nowrap">
                          {row.city || "-"}
                        </td>

                        <td className="px-5 py-4 text-center">
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-[13px] font-semibold text-slate-700 border border-slate-200">
                            {fmtInt(row.vehicles)}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-center">
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-[13px] font-semibold text-slate-700 border border-slate-200">
                            {fmtInt(row.inquiries)}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-[13px] font-medium text-slate-500 whitespace-nowrap">
                          {fmtHours(row.responseTime)}
                        </td>

                        <td className="px-5 py-4 text-[13px] font-semibold text-slate-900 whitespace-nowrap">
                          {fmtPct(row.conversion)}
                        </td>

                        <td className="px-5 py-4">
                          <div className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-900">
                            {Number(row.rating || 0).toFixed(1).replace(".0", "")}
                            <Star size={14} className="text-amber-500 fill-amber-500" />
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={cls(
                              "inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap",
                              riskBadge(row.risk)
                            )}
                          >
                            {row.risk || "Low"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={cls(
                              "inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap flex items-center gap-1.5",
                              statusBadge(row.status)
                            )}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                            {String(row.status || "UNKNOWN").replaceAll("_", " ")}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={cls(
                              "inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap",
                              statusBadge(row.verificationStatus)
                            )}
                          >
                            {String(row.verificationStatus || "N/A").replaceAll("_", " ")}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          {/* <RowActions
                            item={row}
                            onSuspend={(item) => setModal({ type: "suspend", item })}
                            onFlag={handleFlag}
                            onNote={handleNote}
                          /> */}
                          <RowActions consultantId={row.id} />
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={12} className="px-6 py-28 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-4">
                          <Search size={28} />
                        </div>
                        <div className="text-lg font-bold text-slate-900 tracking-tight">
                          No consultants found
                        </div>
                        <div className="mt-1 text-[14px] text-slate-500 max-w-sm mx-auto">
                          Try adjusting your search criteria or clear active filters to see more results.
                        </div>
                        {activeFilters && (
                          <button
                            onClick={clearAll}
                            className="mt-6 px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 transition-colors"
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
        </section>

        <PaginationBar
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          loading={loading}
          onPageChange={setPage}
        />
      </div>

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

export default Allconsultants;