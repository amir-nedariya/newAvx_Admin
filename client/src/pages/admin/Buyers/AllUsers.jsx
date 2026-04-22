import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  RefreshCw,
  MoreHorizontal,
  Eye,
  Ban,
  ShieldAlert,
  NotebookPen,
  MessageSquareWarning,
  X,
  User,
  Smartphone,
  CalendarDays,
  MapPin,
  TriangleAlert,
  ShieldCheck,
  Clock3,
  Activity,
  MessagesSquare,
  ChevronDown,
  Heart,
  FileText,
  MessageCircle,
  RotateCcw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  filterBuyers,
  getBuyerStats,
  suspendBuyer,
  reinstateBuyer,
  limitBuyerInquiries,
  flagBuyerForReview,
  addBuyerInternalNote,
} from "../../../api/buyer.api";
import { getAllCitiesFromSearch } from "../../../api/addressApi";

const cls = (...a) => a.filter(Boolean).join(" ");

/* =========================================================
   HELPER FUNCTIONS
========================================================= */
const formatDateTime = (dateTime) => {
  if (!dateTime) return "—";
  const date = new Date(dateTime);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const STATUS_OPTIONS = ["ACTIVE", "INACTIVE", "SUSPENDED"];
const RISK_OPTIONS = ["Low", "Moderate", "High"];
const SIGNUP_OPTIONS = ["OTP", "GOOGLE", "APPLE"];

/* =========================================================
   BADGES (Light Mode)
========================================================= */
const statusBadge = (status) => {
  const s = String(status || "").toUpperCase();
  const map = {
    ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
    INACTIVE: "bg-slate-50 text-slate-700 border-slate-200",
    SUSPENDED: "bg-rose-50 text-rose-700 border-rose-200",
    "UNDER REVIEW": "bg-amber-50 text-amber-700 border-amber-200",
    LIMITED: "bg-sky-50 text-sky-700 border-sky-200",
    BANNED: "bg-red-50 text-red-700 border-red-200",
  };
  return map[s] || "bg-slate-50 text-slate-700 border-slate-200";
};

const riskBadge = (risk) => {
  const map = {
    Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Moderate: "bg-amber-50 text-amber-700 border-amber-200",
    High: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return map[risk] || "bg-slate-50 text-slate-700 border-slate-200";
};

const signupBadge = (method) => {
  const map = {
    OTP: "bg-slate-100 text-slate-700 border-slate-200",
    GOOGLE: "bg-sky-50 text-sky-700 border-sky-200",
    APPLE: "bg-violet-50 text-violet-700 border-violet-200",
  };
  return map[method] || "bg-slate-50 text-slate-700 border-slate-200";
};

/* =========================================================
   ROW ACTIONS
========================================================= */
function RowActions({
  item,
  onView,
  onSuspend,
  onReinstate,
  onLimit,
  onFlag,
  onNote,
  onReset,
  onViewInquiries,
  onViewSaved,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative inline-flex justify-end" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 shadow-sm"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-30 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
          <button
            onClick={() => {
              onView(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Eye className="h-4 w-4 text-slate-500" />
            View Profile
          </button>

          <button
            onClick={() => {
              onNote(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <NotebookPen className="h-4 w-4 text-slate-500" />
            Add Internal Note
          </button>

          {item.status === "Suspended" || item.status === "SUSPENDED" ? (
            <button
              onClick={() => {
                onReinstate(item);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              <ShieldCheck className="h-4 w-4" />
              Reinstate
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  onSuspend(item);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-rose-700 hover:bg-rose-50 transition-colors"
              >
                <Ban className="h-4 w-4" />
                Suspend
              </button>

              <button
                onClick={() => {
                  onLimit(item);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-sky-700 hover:bg-sky-50 transition-colors"
              >
                <MessageSquareWarning className="h-4 w-4" />
                Limit Inquiries
              </button>

              <button
                onClick={() => {
                  onReset(item);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-violet-700 hover:bg-violet-50 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Account
              </button>

              <button
                onClick={() => {
                  onFlag(item);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-amber-700 hover:bg-amber-50 transition-colors"
              >
                <ShieldAlert className="h-4 w-4" />
                Flag for Review
              </button>
            </>
          )}

          <div className="my-1 border-t border-slate-100" />

          <button
            onClick={() => {
              onViewInquiries(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <MessageCircle className="h-4 w-4 text-slate-500" />
            View Inquiries
          </button>

          <button
            onClick={() => {
              onViewSaved(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Heart className="h-4 w-4 text-slate-500" />
            View Saved Vehicles
          </button>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   MODALS
========================================================= */
function AddInternalNoteModal({ modal, onClose, onConfirm }) {
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (modal?.type === "note") {
      setNote("");
      setCategory("");
    }
  }, [modal]);

  if (!modal || modal.type !== "note") return null;

  const categories = [
    "General",
    "Behavior Pattern",
    "Risk Assessment",
    "Account Activity",
    "Support Interaction",
    "Investigation",
  ];

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[61] w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Add Internal Note</h3>
            <p className="mt-1 text-[13px] text-slate-500">
              {modal.item.name} • {modal.item.userId}
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
            <label className="mb-2 block text-[13px] font-medium text-slate-700">Category</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-10 outline-none focus:border-sky-400 text-slate-900 text-[13px] appearance-none"
              >
                <option value="">Select category...</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-medium text-slate-700">Note</label>
            <textarea
              rows={5}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter internal note (visible only to admins)..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-slate-900 text-[13px]"
            />
            <p className="mt-2 text-[11px] text-slate-500">
              {note.length} / 1000 characters
            </p>
          </div>

          <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-[12px] leading-relaxed text-sky-700">
            This note will be visible only to admin users and will be logged with your name and timestamp.
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
                noteCategory: category,
                noteText: note,
              })
            }
            disabled={!category || !note.trim()}
            className="rounded-xl bg-sky-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Note
          </button>
        </div>
      </div>
    </>
  );
}

function FlagReviewModal({ modal, onClose, onConfirm }) {
  const [category, setCategory] = useState("");
  const [severity, setSeverity] = useState("Moderate");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (modal?.type === "flag") {
      setCategory("");
      setSeverity("Moderate");
      setNotes("");
    }
  }, [modal]);

  if (!modal || modal.type !== "flag") return null;

  const categories = [
    "Inquiry spam",
    "Suspicious behavior",
    "Multiple accounts",
    "Fake inspection requests",
    "Payment fraud attempt",
    "Abusive communication",
  ];

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[61] w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Flag for Review</h3>
            <p className="mt-1 text-[13px] text-slate-500">
              {modal.item.name} • {modal.item.userId}
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
            <label className="mb-2 block text-[13px] font-medium text-slate-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-amber-400 text-slate-900 text-[13px] appearance-none"
            >
              <option value="">Select category...</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-medium text-slate-700">
              Severity Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["Low", "Moderate", "High"].map((item) => (
                <button
                  key={item}
                  onClick={() => setSeverity(item)}
                  className={cls(
                    "rounded-xl border px-4 py-2.5 text-[13px] font-semibold transition-all",
                    severity === item
                      ? item === "High"
                        ? "border-rose-300 bg-rose-50 text-rose-700"
                        : item === "Moderate"
                          ? "border-amber-300 bg-amber-50 text-amber-700"
                          : "border-emerald-300 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-medium text-slate-700">Notes</label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter detailed notes about this flag..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-amber-400 text-slate-900 text-[13px]"
            />
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] leading-relaxed text-amber-700">
            This will mark the user for manual review and notify the moderation team.
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
                flagCategory: category,
                flagSeverity: severity,
                flagNotes: notes,
              })
            }
            disabled={!category || !notes.trim()}
            className="rounded-xl bg-amber-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Flag User
          </button>
        </div>
      </div>
    </>
  );
}

function SuspendModal({ modal, onClose, onConfirm }) {
  const [reason, setReason] = useState("Inquiry spam");
  const [type, setType] = useState("Temporary");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (modal?.type === "suspend") {
      setReason("Inquiry spam");
      setType("Temporary");
      setDate("");
    }
  }, [modal]);

  if (!modal || modal.type !== "suspend") return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[61] w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Suspend User</h3>
            <p className="mt-1 text-[13px] text-slate-500">
              {modal.item.name} • {modal.item.userId}
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
            <label className="mb-2 block text-[13px] font-medium text-slate-700">Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-slate-900 text-[13px] appearance-none"
            >
              <option>Inquiry spam</option>
              <option>Abuse in chat</option>
              <option>Fake inspection</option>
              <option>Fraud suspicion</option>
              <option>Multiple accounts</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-medium text-slate-700">
              Suspension Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["Temporary", "Permanent"].map((item) => (
                <button
                  key={item}
                  onClick={() => setType(item)}
                  className={cls(
                    "rounded-xl border px-4 py-2.5 text-[13px] font-semibold transition-all",
                    type === item
                      ? "border-rose-300 bg-rose-50 text-rose-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {type === "Temporary" && (
            <div>
              <label className="mb-2 block text-[13px] font-medium text-slate-700">
                End Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-slate-900 text-[13px]"
              />
            </div>
          )}

          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[12px] leading-relaxed text-rose-700">
            This will block login, chat, inquiries and log the moderation action immediately.
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
                suspendType: type,
                suspendUntil: date,
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

function LimitModal({ modal, onClose, onConfirm }) {
  const [maxPerDay, setMaxPerDay] = useState(2);
  const [duration, setDuration] = useState(7);
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (modal?.type === "limit") {
      setMaxPerDay(2);
      setDuration(7);
      setReason("");
    }
  }, [modal]);

  if (!modal || modal.type !== "limit") return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[61] w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Limit Daily Inquiries</h3>
            <p className="mt-1 text-[13px] text-slate-500">
              {modal.item.name} • {modal.item.userId}
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
              Max per day
            </label>
            <input
              type="number"
              min="1"
              value={maxPerDay}
              onChange={(e) => setMaxPerDay(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-slate-900 text-[13px]"
            />
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-medium text-slate-700">
              Duration (days)
            </label>
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-slate-900 text-[13px]"
            />
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-medium text-slate-700">Reason</label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-slate-900 text-[13px]"
            />
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
                inquiryCap: maxPerDay,
                inquiryCapDays: duration,
                inquiryCapReason: reason,
              })
            }
            className="rounded-xl bg-sky-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-sky-700 transition-colors"
          >
            Apply Limit
          </button>
        </div>
      </div>
    </>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */
const AllUsers = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    cityId: "",
    status: "",
    risk: "",
    signupMethod: "",
    appInstalled: "",
  });
  const [cities, setCities] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    suspended: 0,
    highRisk: 0,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalElements: 0,
    currentElements: 0,
  });

  const [modal, setModal] = useState(null);

  // Fetch cities for filter
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await getAllCitiesFromSearch("");
        if (response?.data) {
          setCities(response.data);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, []);

  // Fetch buyer stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getBuyerStats();
        if (response?.data) {
          setStats({
            total: response.data.totalUsers || 0,
            active: response.data.activeUsers || 0,
            suspended: response.data.suspendedUsers || 0,
            highRisk: response.data.highRiskUsers || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching buyer stats:", error);
      }
    };
    fetchStats();
  }, []);

  // Fetch buyers data
  const fetchBuyers = async (pageNo = 1) => {
    setLoading(true);
    try {
      const filterRequest = {
        searchText: search.trim() || null,
        cityId: filters.cityId || null,
        status: filters.status || null,
        risk: filters.risk || null,
      };

      const response = await filterBuyers(filterRequest, pageNo);

      if (response?.data) {
        setRows(response.data);
        if (response.pageResponse) {
          setPagination({
            currentPage: response.pageResponse.currentPage,
            totalPages: response.pageResponse.totalPages,
            totalElements: response.pageResponse.totalElements,
            currentElements: response.pageResponse.currentElements,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching buyers:", error);
      toast.error(error?.response?.data?.message || "Failed to fetch buyers");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchBuyers(1);
  }, []);

  // Fetch when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBuyers(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, filters]);

  const handleRefresh = () => {
    fetchBuyers(pagination.currentPage);
  };

  const handleClear = () => {
    setSearch("");
    setFilters({
      cityId: "",
      status: "",
      risk: "",
      signupMethod: "",
      appInstalled: "",
    });
    setFiltersOpen(false);
  };

  const handlePageChange = (newPage) => {
    fetchBuyers(newPage);
  };

  const handleSuspendConfirm = async (item) => {
    try {
      await suspendBuyer(item.userId, {
        reason: item.suspendReason,
        type: item.suspendType,
        until: item.suspendUntil,
      });
      toast.success("User suspended successfully");
      fetchBuyers(pagination.currentPage);
      setModal(null);
    } catch (error) {
      console.error("Error suspending user:", error);
      toast.error(error?.response?.data?.message || "Failed to suspend user");
    }
  };

  const handleLimitConfirm = async (item) => {
    try {
      await limitBuyerInquiries(item.userId, {
        maxPerDay: item.inquiryCap,
        duration: item.inquiryCapDays,
        reason: item.inquiryCapReason,
      });
      toast.success("Inquiry limit applied successfully");
      fetchBuyers(pagination.currentPage);
      setModal(null);
    } catch (error) {
      console.error("Error limiting inquiries:", error);
      toast.error(error?.response?.data?.message || "Failed to limit inquiries");
    }
  };

  const handleReinstate = async (item) => {
    try {
      await reinstateBuyer(item.userId, {
        reason: "Reinstated by admin",
      });
      toast.success("User reinstated successfully");
      fetchBuyers(pagination.currentPage);
    } catch (error) {
      console.error("Error reinstating user:", error);
      toast.error(error?.response?.data?.message || "Failed to reinstate user");
    }
  };

  const handleFlag = (item) => {
    setModal({ type: "flag", item });
  };

  const handleNote = (item) => {
    setModal({ type: "note", item });
  };

  const handleReset = (item) => {
    alert(`Reset account action for ${item.name}`);
  };

  const handleFlagConfirm = async (item) => {
    try {
      await flagBuyerForReview(item.userId, {
        category: item.flagCategory,
        severity: item.flagSeverity,
        notes: item.flagNotes,
      });
      toast.success("User flagged for review successfully");
      fetchBuyers(pagination.currentPage);
      setModal(null);
    } catch (error) {
      console.error("Error flagging user:", error);
      toast.error(error?.response?.data?.message || "Failed to flag user");
    }
  };

  const handleNoteConfirm = async (item) => {
    try {
      await addBuyerInternalNote(item.userId, {
        category: item.noteCategory,
        note: item.noteText,
      });
      toast.success("Internal note added successfully");
      setModal(null);
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error(error?.response?.data?.message || "Failed to add note");
    }
  };

  return (
    <>
      <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
        <style>{`
        .table-scroll::-webkit-scrollbar { height: 6px; width: 6px; }
        .table-scroll::-webkit-scrollbar-track { background: transparent; }
        .table-scroll::-webkit-scrollbar-thumb { background: rgba(148,163,184,0.35); border-radius: 6px; }
        .table-scroll::-webkit-scrollbar-thumb:hover { background: rgba(100,116,139,0.45); }
      `}</style>

        {/* Header Section - Fixed */}
        <div className="flex-shrink-0 p-6 pb-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
                All Buyers
              </h1>
              <p className="max-w-3xl text-sm leading-relaxed text-slate-500">
                Manage buyer accounts, monitor inquiry behavior, review risk
                patterns, and maintain a healthy marketplace.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards - Fixed */}
        <div className="flex-shrink-0 px-6 pb-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <TopCard title="Total Users" value={stats.total} />
            <TopCard title="Active Users" value={stats.active} />
            <TopCard title="Suspended" value={stats.suspended} />
            <TopCard title="High Risk" value={stats.highRisk} />
          </div>
        </div>

        {/* Table Section - Flexible with internal scroll */}
        <div className="flex-1 px-6 pb-6 overflow-hidden">
          <div className="h-full rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden relative flex flex-col">
            <div className="absolute top-0 right-0 w-96 h-96 bg-sky-100 blur-[100px] pointer-events-none" />

            <div className="p-5 md:p-6 relative z-10 border-b border-slate-200 flex-shrink-0">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="relative flex-1 max-w-2xl">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by User ID, mobile, email, city..."
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-[14px] text-slate-900 outline-none transition-all focus:border-sky-400 placeholder:text-slate-400"
                  />
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

                  <button
                    onClick={handleRefresh}
                    className="inline-flex h-11 items-center justify-center w-11 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                    title="Refresh List"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {filtersOpen && (
                <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-200 pt-5 md:grid-cols-2 xl:grid-cols-5">
                  <div className="flex items-center justify-between col-span-full mb-2">
                    <h4 className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">
                      Advanced Filters
                    </h4>
                    <button
                      onClick={handleClear}
                      className="text-[12px] text-sky-700 hover:text-sky-800 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>

                  <select
                    value={filters.cityId}
                    onChange={(e) => setFilters((p) => ({ ...p, cityId: e.target.value }))}
                    className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                  >
                    <option value="">All Cities</option>
                    {cities.map((city) => (
                      <option key={city.cityId} value={city.cityId}>
                        {city.cityName}
                      </option>
                    ))}
                  </select>

                  <select
                    value={filters.status}
                    onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
                    className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                  >
                    <option value="">All Status</option>
                    {STATUS_OPTIONS.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>

                  <select
                    value={filters.risk}
                    onChange={(e) => setFilters((p) => ({ ...p, risk: e.target.value }))}
                    className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                  >
                    <option value="">All Risk</option>
                    {RISK_OPTIONS.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>

                  <select
                    value={filters.signupMethod}
                    onChange={(e) =>
                      setFilters((p) => ({ ...p, signupMethod: e.target.value }))
                    }
                    className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                  >
                    <option value="">All Signup Methods</option>
                    {SIGNUP_OPTIONS.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>

                  <select
                    value={filters.appInstalled}
                    onChange={(e) =>
                      setFilters((p) => ({ ...p, appInstalled: e.target.value }))
                    }
                    className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                  >
                    <option value="">App Installed</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex-1 w-full overflow-auto table-scroll relative z-10">
              <table className="min-w-[1600px] w-full border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                    <th className="px-5 py-4 font-semibold whitespace-nowrap">Name</th>
                    <th className="px-5 py-4 font-semibold whitespace-nowrap">Mobile</th>
                    <th className="px-5 py-4 font-semibold whitespace-nowrap">City</th>
                    <th className="px-5 py-4 font-semibold whitespace-nowrap text-center">Inquiries (30d)</th>
                    <th className="px-5 py-4 font-semibold whitespace-nowrap text-center">Saved</th>
                    <th className="px-5 py-4 font-semibold whitespace-nowrap text-center">Inspection Req</th>
                    <th className="px-5 py-4 font-semibold whitespace-nowrap">Risk</th>
                    <th className="px-5 py-4 font-semibold whitespace-nowrap">Status</th>
                    <th className="px-5 py-4 font-semibold whitespace-nowrap">Last Active</th>
                    <th className="px-6 py-4 text-right font-semibold whitespace-nowrap">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={11} className="px-6 py-28 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Loader2 className="h-12 w-12 text-sky-600 animate-spin mb-4" />
                          <div className="text-lg font-bold text-slate-900">Loading buyers...</div>
                        </div>
                      </td>
                    </tr>
                  ) : rows.length ? (
                    rows.map((row) => (
                      <tr
                        key={row.userId}
                        className={cls(
                          "transition-colors duration-200 hover:bg-slate-50 group"
                        )}
                      >

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-100 to-blue-100 border border-slate-200 flex items-center justify-center shrink-0">
                              <span className="text-[13px] font-bold text-sky-700">
                                {row.name?.charAt(0) || "?"}
                              </span>
                            </div>
                            <div>
                              <div className="text-[13px] font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                                {row.name}
                              </div>
                              <div className="mt-0.5 text-[11px] text-slate-500 truncate max-w-[180px]">
                                {row.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="text-[13px] font-medium text-slate-700">
                            {row.countryCode} {row.phoneNumber}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[13px] font-medium text-slate-700">{row.city || "—"}</span>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-center">
                          <div className="inline-flex items-center justify-center min-w-[32px] h-8 rounded-lg bg-slate-50 px-2 text-[13px] font-semibold text-slate-700 border border-slate-200">
                            {row.inquiries || 0}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-center">
                          <div className="inline-flex items-center justify-center min-w-[32px] h-8 rounded-lg bg-slate-50 px-2 text-[13px] font-semibold text-slate-700 border border-slate-200">
                            {row.saved || 0}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-center">
                          <div className="inline-flex items-center justify-center min-w-[32px] h-8 rounded-lg bg-slate-50 px-2 text-[13px] font-semibold text-slate-700 border border-slate-200">
                            {row.inspectionRequests || 0}
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
                              "inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap items-center gap-1.5",
                              statusBadge(row.status)
                            )}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                            {row.status}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-500 whitespace-nowrap">
                            <Clock3 size={12} className="text-slate-400" />
                            {formatDateTime(row.lastActive)}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <RowActions
                            item={row}
                            onView={() => navigate("/admin/buyers/profile")}
                            onSuspend={(item) => setModal({ type: "suspend", item })}
                            onReinstate={handleReinstate}
                            onLimit={(item) => setModal({ type: "limit", item })}
                            onFlag={(item) => setModal({ type: "flag", item })}
                            onNote={handleNote}
                            onReset={handleReset}
                            onViewInquiries={() => navigate("/admin/buyers/inquiries")}
                            onViewSaved={() => navigate("/admin/buyers/saved-vehicles")}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={11} className="px-6 py-28 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-4">
                            <Search size={28} />
                          </div>
                          <div className="text-lg font-bold text-slate-900 tracking-tight">
                            No buyers found
                          </div>
                          <div className="mt-1 text-[14px] text-slate-500 max-w-sm mx-auto">
                            Try adjusting your search criteria or clear active filters to see more results.
                          </div>
                          {(search || Object.values(filters).some(Boolean)) && (
                            <button
                              onClick={handleClear}
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

            {/* Pagination */}
            {!loading && rows.length > 0 && (
              <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
                <div className="text-[13px] text-slate-600">
                  Page {pagination.currentPage}-{pagination.totalPages} • {pagination.totalElements} total records
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>

                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage >= pagination.totalPages}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <FlagReviewModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleFlagConfirm}
      />

      <AddInternalNoteModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleNoteConfirm}
      />

      <SuspendModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleSuspendConfirm}
      />

      <LimitModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleLimitConfirm}
      />
    </>
  );
};

function TopCard({ title, value }) {
  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-6 overflow-hidden group shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex items-end justify-between">
        <div>
          <div className="text-[12px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-2">
            {title}
          </div>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-baseline gap-1">
            {value}
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 transition-colors duration-300">
          <User size={18} />
        </div>
      </div>
    </div>
  );
}

export default AllUsers;