import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  RefreshCw,
  MoreHorizontal,
  Eye,
  RotateCcw,
  ShieldBan,
  NotebookPen,
  Scale,
  X,
  User,
  Smartphone,
  CalendarDays,
  MapPin,
  ShieldAlert,
  Clock3,
  Activity,
  AlertTriangle,
  Link2,
} from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

/* =========================================================
   DUMMY DATA
========================================================= */
const DUMMY_SUSPENDED_USERS = [
  {
    id: "USR-8801",
    name: "Rahul Mehta",
    mobile: "+91 98765 44321",
    email: "rahul.mehta@gmail.com",
    city: "Ahmedabad",
    suspensionType: "Temporary",
    reason: "Inquiry Spam",
    suspendedOn: "04 Mar 2026",
    expiry: "18 Mar 2026",
    appeal: "Pending",
    risk: "High",
    suspendedBy: "Admin Aakash",
    adminComment: "Repeated fake inquiries to multiple consultants.",
    evidence: [
      "18 inquiries in 2 hours",
      "Same IP detected across 3 accounts",
      "Phone reuse flagged",
    ],
    inquiries: 121,
    inspectionAbuse: 2,
    cancellationRate: "38%",
    chatViolations: 4,
    linkedAccounts: ["USR-1203", "USR-7781", "USR-5541"],
    userAppealMessage: "I was browsing quickly, it was not intentional spam.",
    appealSubmittedOn: "06 Mar 2026",
    repeatOffender: true,
  },
  {
    id: "USR-8802",
    name: "Priya Soni",
    mobile: "+91 98989 11221",
    email: "priya.soni@yahoo.com",
    city: "Surat",
    suspensionType: "Permanent",
    reason: "Fraud Suspicion",
    suspendedOn: "21 Feb 2026",
    expiry: "—",
    appeal: "Reviewed",
    risk: "High",
    suspendedBy: "Super Admin Nikhil",
    adminComment: "Multiple linked devices and fake booking pattern found.",
    evidence: [
      "Same device fingerprint as banned account",
      "High cancellation after inspection booking",
      "Repeated consultant complaints",
    ],
    inquiries: 88,
    inspectionAbuse: 5,
    cancellationRate: "61%",
    chatViolations: 3,
    linkedAccounts: ["USR-6610", "USR-2201"],
    userAppealMessage: "Please review again, I believe this is incorrect.",
    appealSubmittedOn: "25 Feb 2026",
    repeatOffender: true,
  },
  {
    id: "USR-8803",
    name: "Faizan Khan",
    mobile: "+91 90123 56780",
    email: "faizan.khan@gmail.com",
    city: "Vadodara",
    suspensionType: "Auto-Suspended",
    reason: "Same IP as banned account",
    suspendedOn: "08 Mar 2026",
    expiry: "15 Mar 2026",
    appeal: "None",
    risk: "Moderate",
    suspendedBy: "System",
    adminComment: "Auto-triggered due to linked abuse signal.",
    evidence: [
      "Matched banned IP fingerprint",
      "Unusual inquiry burst",
      "Linked with prior flagged account",
    ],
    inquiries: 36,
    inspectionAbuse: 0,
    cancellationRate: "12%",
    chatViolations: 1,
    linkedAccounts: ["USR-9910"],
    userAppealMessage: "",
    appealSubmittedOn: "",
    repeatOffender: false,
  },
  {
    id: "USR-8804",
    name: "Sneha Verma",
    mobile: "+91 97655 20110",
    email: "sneha.verma@gmail.com",
    city: "Rajkot",
    suspensionType: "Fraud-Ban",
    reason: "Multiple Accounts",
    suspendedOn: "01 Mar 2026",
    expiry: "—",
    appeal: "Rejected",
    risk: "High",
    suspendedBy: "Super Admin Riya",
    adminComment: "Device and mobile number overlap across banned profiles.",
    evidence: [
      "Same mobile used in 2 accounts",
      "Device fingerprint overlap",
      "Inspection misuse pattern",
    ],
    inquiries: 140,
    inspectionAbuse: 6,
    cancellationRate: "45%",
    chatViolations: 5,
    linkedAccounts: ["USR-4021", "USR-7771", "USR-1009"],
    userAppealMessage: "My brother also uses the same device.",
    appealSubmittedOn: "03 Mar 2026",
    repeatOffender: true,
  },
  {
    id: "USR-8805",
    name: "Arjun Patel",
    mobile: "+91 99880 22111",
    email: "arjunpatel@outlook.com",
    city: "Ahmedabad",
    suspensionType: "Temporary",
    reason: "Chat Abuse",
    suspendedOn: "07 Mar 2026",
    expiry: "14 Mar 2026",
    appeal: "Approved",
    risk: "Moderate",
    suspendedBy: "Admin Dev",
    adminComment: "Abusive chat language reported by consultant.",
    evidence: [
      "Abusive wording in chat logs",
      "External payment attempt",
    ],
    inquiries: 24,
    inspectionAbuse: 1,
    cancellationRate: "9%",
    chatViolations: 2,
    linkedAccounts: [],
    userAppealMessage: "I understand the mistake and will follow rules.",
    appealSubmittedOn: "08 Mar 2026",
    repeatOffender: false,
  },
];

const SUSPENSION_TYPES = [
  "Temporary",
  "Permanent",
  "Auto-Suspended",
  "Fraud-Ban",
];
const RISK_OPTIONS = ["Low", "Moderate", "High"];
const APPEAL_OPTIONS = ["None", "Pending", "Reviewed", "Approved", "Rejected"];

/* =========================================================
   BADGES
========================================================= */
const suspensionBadge = (type) => {
  const map = {
    Temporary: "bg-sky-50 text-sky-700 border-sky-200",
    Permanent: "bg-rose-50 text-rose-700 border-rose-200",
    "Auto-Suspended": "bg-amber-50 text-amber-700 border-amber-200",
    "Fraud-Ban": "bg-slate-900 text-white border-slate-900",
  };
  return map[type] || "bg-slate-100 text-slate-700 border-slate-200";
};

const riskBadge = (risk) => {
  const map = {
    Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Moderate: "bg-amber-50 text-amber-700 border-amber-200",
    High: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return map[risk] || "bg-slate-100 text-slate-700 border-slate-200";
};

const appealBadge = (appeal) => {
  const map = {
    None: "bg-slate-100 text-slate-700 border-slate-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Reviewed: "bg-sky-50 text-sky-700 border-sky-200",
    Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Rejected: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return map[appeal] || "bg-slate-100 text-slate-700 border-slate-200";
};

/* =========================================================
   TOP CARDS
========================================================= */
function TopCard({ title, value, icon: Icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cls(
        "relative rounded-2xl border p-6 overflow-hidden transition text-left shadow-sm",
        active
          ? "border-sky-600 bg-sky-600 text-white"
          : "border-slate-200 bg-white hover:bg-slate-50"
      )}
    >
      <div className="relative z-10 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div
            className={cls(
              "text-[12px] font-bold uppercase tracking-[0.15em] mb-2",
              active ? "text-sky-100" : "text-slate-400"
            )}
          >
            {title}
          </div>
          <div className="text-3xl font-extrabold tracking-tight break-words leading-tight">
            {value}
          </div>
        </div>
        <div
          className={cls(
            "w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 transition-colors",
            active
              ? "bg-white/10 border-white/20 text-white"
              : "bg-sky-50 border-sky-100 text-sky-600"
          )}
        >
          <Icon size={18} />
        </div>
      </div>
    </button>
  );
}

/* =========================================================
   ROW ACTIONS
========================================================= */
function SuspendedRowActions({
  item,
  onView,
  onReinstate,
  onExtend,
  onConvert,
  onAppeal,
  onNote,
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
        <div className="absolute right-0 top-11 z-30 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
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

          {item.suspensionType === "Temporary" || item.suspensionType === "Auto-Suspended" ? (
            <>
              <button
                onClick={() => {
                  onReinstate(item);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Reinstate
              </button>

              <button
                onClick={() => {
                  onExtend(item);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-sky-700 hover:bg-sky-50 transition-colors"
              >
                <Clock3 className="h-4 w-4" />
                Extend Suspension
              </button>

              <button
                onClick={() => {
                  onConvert(item);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-rose-700 hover:bg-rose-50 transition-colors"
              >
                <ShieldBan className="h-4 w-4" />
                Convert to Permanent
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  onAppeal(item);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-amber-700 hover:bg-amber-50 transition-colors"
              >
                <Scale className="h-4 w-4" />
                Review Appeal
              </button>

              <button
                onClick={() => {
                  onReinstate(item);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Reinstate
              </button>
            </>
          )}

          <div className="my-1 border-t border-slate-100" />

          <button
            onClick={() => {
              onNote(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <NotebookPen className="h-4 w-4 text-slate-500" />
            Add Note
          </button>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   DRAWER
========================================================= */
function SuspendedUserDrawer({
  item,
  onClose,
  onReinstate,
  onExtend,
  onConvert,
  onAppeal,
}) {
  if (!item) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-[560px] border-l border-slate-200 bg-white shadow-2xl flex flex-col">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 bg-slate-50">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{item.name}</h3>
            <p className="mt-1 text-sm text-slate-500">{item.id}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span
                className={cls(
                  "inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold border",
                  riskBadge(item.risk)
                )}
              >
                {item.risk} Risk
              </span>

              <span
                className={cls(
                  "inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold border",
                  suspensionBadge(item.suspensionType)
                )}
              >
                {item.suspensionType}
              </span>

              <span
                className={cls(
                  "inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold border",
                  appealBadge(item.appeal)
                )}
              >
                Appeal: {item.appeal}
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
            <StatCard label="Suspended On" value={item.suspendedOn} icon={CalendarDays} />
            <StatCard label="Suspended By" value={item.suspendedBy} icon={User} />
            <StatCard label="Expiry" value={item.expiry} icon={Clock3} />
            <StatCard label="Inquiries" value={item.inquiries} icon={Activity} />
            <StatCard label="Chat Violations" value={item.chatViolations} icon={AlertTriangle} />
            <StatCard label="Cancellation Rate" value={item.cancellationRate} icon={ShieldAlert} />
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
              Suspension Details
            </h4>

            <div className="mt-4 space-y-4 text-sm">
              <InfoRow icon={ShieldBan} label="Reason" value={item.reason} />
              <InfoRow icon={MapPin} label="City" value={item.city} />
              <InfoRow icon={Smartphone} label="Mobile" value={item.mobile} />
              <InfoRow icon={User} label="Email" value={item.email} />
              <InfoRow icon={NotebookPen} label="Admin Comment" value={item.adminComment} />
            </div>

            <div className="mt-5">
              <h5 className="mb-2 text-[13px] font-semibold text-slate-700">Evidence</h5>
              <div className="space-y-2">
                {item.evidence.map((ev, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[13px] text-slate-600"
                  >
                    • {ev}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
              Activity Snapshot
            </h4>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <MiniMetric title="Inspection Abuse" value={item.inspectionAbuse} />
              <MiniMetric title="Linked Accounts" value={item.linkedAccounts.length} />
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
              <Link2 className="h-4 w-4" />
              Linked Accounts
            </h4>

            <div className="mt-4 space-y-2">
              {item.linkedAccounts.length ? (
                item.linkedAccounts.map((acc) => (
                  <div
                    key={acc}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[13px] font-medium text-slate-700"
                  >
                    {acc}
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-500">No linked accounts found</div>
              )}
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
              Appeal Management
            </h4>

            <div className="mt-4 space-y-4 text-sm">
              <InfoRow icon={Scale} label="Appeal Status" value={item.appeal} />
              <InfoRow
                icon={CalendarDays}
                label="Submitted On"
                value={item.appealSubmittedOn || "—"}
              />
              <InfoRow
                icon={NotebookPen}
                label="User Message"
                value={item.userAppealMessage || "No appeal submitted"}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <button
              onClick={() => onReinstate(item)}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-[13px] font-semibold text-white hover:bg-emerald-700"
            >
              <RotateCcw className="h-4 w-4" />
              Reinstate
            </button>

            <button
              onClick={() => onExtend(item)}
              className="inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-[13px] font-semibold text-sky-700 hover:bg-sky-100"
            >
              <Clock3 className="h-4 w-4" />
              Extend Suspension
            </button>

            <button
              onClick={() => onConvert(item)}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] font-semibold text-rose-700 hover:bg-rose-100"
            >
              <ShieldBan className="h-4 w-4" />
              Convert to Permanent
            </button>

            <button
              onClick={() => onAppeal(item)}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] font-semibold text-amber-700 hover:bg-amber-100"
            >
              <Scale className="h-4 w-4" />
              Review Appeal
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
          <div className="mt-0.5 text-[15px] font-bold text-slate-900 truncate">{value}</div>
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
        <div className="text-[10px] uppercase tracking-wider text-slate-400">{label}</div>
        <div className="text-[13px] font-medium text-slate-700 mt-0.5">{value}</div>
      </div>
    </div>
  );
}

function MiniMetric({ title, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </div>
      <div className="mt-1 text-[15px] font-bold text-slate-900">{value}</div>
    </div>
  );
}

/* =========================================================
   MODALS
========================================================= */
function ReinstateModal({ modal, onClose, onConfirm }) {
  const [reason, setReason] = useState("Appeal approved");
  const [applyCap, setApplyCap] = useState("No");

  useEffect(() => {
    if (modal?.type === "reinstate") {
      setReason("Appeal approved");
      setApplyCap("No");
    }
  }, [modal]);

  if (!modal || modal.type !== "reinstate") return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[61] w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Reinstate User</h3>
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
            <label className="mb-2 block text-[13px] font-medium text-slate-700">Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-slate-900 text-[13px]"
            >
              <option>Appeal approved</option>
              <option>False detection</option>
              <option>Manual override</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-medium text-slate-700">
              Apply Inquiry Cap?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["Yes", "No"].map((item) => (
                <button
                  key={item}
                  onClick={() => setApplyCap(item)}
                  className={cls(
                    "rounded-xl border px-4 py-2.5 text-[13px] font-semibold transition-all",
                    applyCap === item
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
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
                reinstateReason: reason,
                applyCap,
              })
            }
            className="rounded-xl bg-emerald-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            Confirm Reinstate
          </button>
        </div>
      </div>
    </>
  );
}

function ExtendModal({ modal, onClose, onConfirm }) {
  const [expiry, setExpiry] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (modal?.type === "extend") {
      setExpiry("");
      setReason("");
    }
  }, [modal]);

  if (!modal || modal.type !== "extend") return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[61] w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Extend Suspension</h3>
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
              New Expiry Date
            </label>
            <input
              type="date"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-slate-900 text-[13px]"
            />
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-medium text-slate-700">Reason</label>
            <textarea
              rows={4}
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
                newExpiry: expiry,
                extendReason: reason,
              })
            }
            className="rounded-xl bg-sky-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-sky-700 transition-colors"
          >
            Extend
          </button>
        </div>
      </div>
    </>
  );
}

function ConvertPermanentModal({ modal, onClose, onConfirm }) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (modal?.type === "convert") setReason("");
  }, [modal]);

  if (!modal || modal.type !== "convert") return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[61] w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Convert to Permanent Ban</h3>
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
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[12px] leading-relaxed text-rose-700">
            This action permanently blocks login, re-registration with same number,
            and blacklists device fingerprint.
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-medium text-slate-700">Reason</label>
            <textarea
              rows={4}
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
                convertReason: reason,
              })
            }
            className="rounded-xl bg-rose-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-rose-700 transition-colors"
          >
            Confirm Ban
          </button>
        </div>
      </div>
    </>
  );
}

function AppealModal({ modal, onClose, onConfirm }) {
  const [decision, setDecision] = useState("Approve");
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (modal?.type === "appeal") {
      setDecision("Approve");
      setComment("");
    }
  }, [modal]);

  if (!modal || modal.type !== "appeal") return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[61] w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Review Appeal</h3>
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
              Appeal Decision
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["Approve", "Reject"].map((item) => (
                <button
                  key={item}
                  onClick={() => setDecision(item)}
                  className={cls(
                    "rounded-xl border px-4 py-2.5 text-[13px] font-semibold transition-all",
                    decision === item
                      ? item === "Approve"
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                        : "border-rose-300 bg-rose-50 text-rose-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-medium text-slate-700">Comment</label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter comment..."
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
                decision,
                comment,
              })
            }
            className={cls(
              "rounded-xl px-4 py-2 text-[13px] font-semibold text-white transition-colors",
              decision === "Approve"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-rose-600 hover:bg-rose-700"
            )}
          >
            Submit Decision
          </button>
        </div>
      </div>
    </>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */
const SuspendedUsers = () => {
  const [rows, setRows] = useState(DUMMY_SUSPENDED_USERS);
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [quickFilter, setQuickFilter] = useState("all");
  const [filters, setFilters] = useState({
    suspensionType: "",
    risk: "",
    appeal: "",
    reason: "",
    city: "",
    suspendedBy: "",
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [modal, setModal] = useState(null);

  const uniqueCities = useMemo(() => [...new Set(rows.map((r) => r.city))], [rows]);
  const uniqueReasons = useMemo(() => [...new Set(rows.map((r) => r.reason))], [rows]);
  const uniqueAdmins = useMemo(() => [...new Set(rows.map((r) => r.suspendedBy))], [rows]);

  const filteredRows = useMemo(() => {
    let data = [...rows];

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q) ||
          r.mobile.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.city.toLowerCase().includes(q)
      );
    }

    if (filters.suspensionType) data = data.filter((r) => r.suspensionType === filters.suspensionType);
    if (filters.risk) data = data.filter((r) => r.risk === filters.risk);
    if (filters.appeal) data = data.filter((r) => r.appeal === filters.appeal);
    if (filters.reason) data = data.filter((r) => r.reason === filters.reason);
    if (filters.city) data = data.filter((r) => r.city === filters.city);
    if (filters.suspendedBy) data = data.filter((r) => r.suspendedBy === filters.suspendedBy);

    if (quickFilter === "temporary") {
      data = data.filter((r) => r.suspensionType === "Temporary");
    } else if (quickFilter === "permanent") {
      data = data.filter((r) => r.suspensionType === "Permanent" || r.suspensionType === "Fraud-Ban");
    } else if (quickFilter === "appeals") {
      data = data.filter((r) => r.appeal === "Pending");
    } else if (quickFilter === "repeat") {
      data = data.filter((r) => r.repeatOffender);
    }

    return data;
  }, [rows, search, filters, quickFilter]);

  const metrics = useMemo(() => {
    const total = rows.length;
    const temporary = rows.filter(
      (r) => r.suspensionType === "Temporary" || r.suspensionType === "Auto-Suspended"
    ).length;
    const permanent = rows.filter(
      (r) => r.suspensionType === "Permanent" || r.suspensionType === "Fraud-Ban"
    ).length;
    const appealsPending = rows.filter((r) => r.appeal === "Pending").length;
    const repeat = rows.filter((r) => r.repeatOffender).length;

    return { total, temporary, permanent, appealsPending, repeat };
  }, [rows]);

  const handleRefresh = () => setRows([...DUMMY_SUSPENDED_USERS]);

  const handleClear = () => {
    setSearch("");
    setQuickFilter("all");
    setFilters({
      suspensionType: "",
      risk: "",
      appeal: "",
      reason: "",
      city: "",
      suspendedBy: "",
    });
    setFiltersOpen(false);
  };

  const handleReinstate = (item) => {
    setModal({ type: "reinstate", item });
  };

  const handleReinstateConfirm = (item) => {
    setRows((prev) => prev.filter((r) => r.id !== item.id));
    if (selectedUser?.id === item.id) setSelectedUser(null);
    setModal(null);
  };

  const handleExtendConfirm = (item) => {
    setRows((prev) =>
      prev.map((r) => (r.id === item.id ? { ...r, expiry: item.newExpiry || r.expiry } : r))
    );
    if (selectedUser?.id === item.id) {
      setSelectedUser((prev) => ({ ...prev, expiry: item.newExpiry || prev.expiry }));
    }
    setModal(null);
  };

  const handleConvertConfirm = (item) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === item.id
          ? { ...r, suspensionType: "Permanent", expiry: "—", risk: "High" }
          : r
      )
    );
    if (selectedUser?.id === item.id) {
      setSelectedUser((prev) => ({
        ...prev,
        suspensionType: "Permanent",
        expiry: "—",
        risk: "High",
      }));
    }
    setModal(null);
  };

  const handleAppealConfirm = (item) => {
    if (item.decision === "Approve") {
      setRows((prev) => prev.filter((r) => r.id !== item.id));
      if (selectedUser?.id === item.id) setSelectedUser(null);
    } else {
      setRows((prev) =>
        prev.map((r) => (r.id === item.id ? { ...r, appeal: "Rejected" } : r))
      );
      if (selectedUser?.id === item.id) {
        setSelectedUser((prev) => ({ ...prev, appeal: "Rejected" }));
      }
    }
    setModal(null);
  };

  const handleNote = (item) => {
    alert(`Add internal note for ${item.name}`);
  };

  return (
    <div className="min-h-screen p-0">
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
              Suspended Users
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-500">
              Review restricted buyer accounts, manage appeals, prevent repeat abuse,
              and maintain consultant trust with strong moderation controls.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <TopCard
            title="Total Suspended"
            value={metrics.total}
            icon={ShieldBan}
            active={quickFilter === "all"}
            onClick={() => setQuickFilter("all")}
          />
          <TopCard
            title="Temporary"
            value={metrics.temporary}
            icon={Clock3}
            active={quickFilter === "temporary"}
            onClick={() => setQuickFilter("temporary")}
          />
          <TopCard
            title="Permanent"
            value={metrics.permanent}
            icon={ShieldAlert}
            active={quickFilter === "permanent"}
            onClick={() => setQuickFilter("permanent")}
          />
          <TopCard
            title="Appeals Pending"
            value={metrics.appealsPending}
            icon={Scale}
            active={quickFilter === "appeals"}
            onClick={() => setQuickFilter("appeals")}
          />
          <TopCard
            title="High Risk Repeat"
            value={metrics.repeat}
            icon={AlertTriangle}
            active={quickFilter === "repeat"}
            onClick={() => setQuickFilter("repeat")}
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

                <button
                  onClick={handleClear}
                  className="inline-flex h-11 items-center justify-center w-11 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                  title="Clear"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {filtersOpen && (
              <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-200 pt-5 md:grid-cols-2 xl:grid-cols-6">
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
                  value={filters.suspensionType}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, suspensionType: e.target.value }))
                  }
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">All Suspension Types</option>
                  {SUSPENSION_TYPES.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <select
                  value={filters.risk}
                  onChange={(e) => setFilters((p) => ({ ...p, risk: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">All Risk Levels</option>
                  {RISK_OPTIONS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <select
                  value={filters.appeal}
                  onChange={(e) => setFilters((p) => ({ ...p, appeal: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">All Appeal Status</option>
                  {APPEAL_OPTIONS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <select
                  value={filters.reason}
                  onChange={(e) => setFilters((p) => ({ ...p, reason: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">All Reasons</option>
                  {uniqueReasons.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <select
                  value={filters.city}
                  onChange={(e) => setFilters((p) => ({ ...p, city: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">All Cities</option>
                  {uniqueCities.map((city) => (
                    <option key={city}>{city}</option>
                  ))}
                </select>

                <select
                  value={filters.suspendedBy}
                  onChange={(e) => setFilters((p) => ({ ...p, suspendedBy: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">All Admins</option>
                  {uniqueAdmins.map((admin) => (
                    <option key={admin}>{admin}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="w-full overflow-x-auto table-scroll relative z-10 pb-4">
            <table className="min-w-[1580px] w-full border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">User ID</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Name</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Mobile</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">City</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Suspension Type</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Reason</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Suspended On</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Expiry</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Appeal</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Risk</th>
                  <th className="px-6 py-4 text-right font-semibold whitespace-nowrap">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredRows.length ? (
                  filteredRows.map((row) => (
                    <tr
                      key={row.id}
                      className={cls(
                        "transition-colors duration-200 hover:bg-slate-50 group",
                        selectedUser?.id === row.id && "bg-sky-50"
                      )}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-100 to-blue-100 border border-slate-200 flex items-center justify-center shrink-0">
                            <span className="text-[13px] font-bold text-sky-700">
                              {row.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="text-[14px] font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                              {row.id}
                            </div>
                            <div className="mt-0.5 text-[12px] text-slate-500">{row.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1 min-w-[160px]">
                          <span className="text-[13px] font-medium text-slate-700">{row.name}</span>
                          <span className="text-[12px] text-slate-500">{row.suspendedBy}</span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-[13px] font-medium text-slate-500 whitespace-nowrap">
                        {row.mobile}
                      </td>

                      <td className="px-5 py-4 text-[13px] font-medium text-slate-500">
                        {row.city}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={cls(
                            "inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap",
                            suspensionBadge(row.suspensionType)
                          )}
                        >
                          {row.suspensionType}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-[13px] font-medium text-slate-500">
                        {row.reason}
                      </td>

                      <td className="px-5 py-4 text-[13px] font-medium text-slate-500 whitespace-nowrap">
                        {row.suspendedOn}
                      </td>

                      <td className="px-5 py-4 text-[13px] font-medium text-slate-500 whitespace-nowrap">
                        {row.expiry}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={cls(
                            "inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap",
                            appealBadge(row.appeal)
                          )}
                        >
                          {row.appeal}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={cls(
                            "inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap",
                            riskBadge(row.risk)
                          )}
                        >
                          {row.risk}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <SuspendedRowActions
                          item={row}
                          onView={setSelectedUser}
                          onReinstate={handleReinstate}
                          onExtend={(item) => setModal({ type: "extend", item })}
                          onConvert={(item) => setModal({ type: "convert", item })}
                          onAppeal={(item) => setModal({ type: "appeal", item })}
                          onNote={handleNote}
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
                          No suspended users found
                        </div>
                        <div className="mt-1 text-[14px] text-slate-500 max-w-sm mx-auto">
                          Try adjusting your search criteria or clear active filters to see more results.
                        </div>
                        {(search || Object.values(filters).some(Boolean) || quickFilter !== "all") && (
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
        </section>
      </div>

      <SuspendedUserDrawer
        item={selectedUser}
        onClose={() => setSelectedUser(null)}
        onReinstate={handleReinstate}
        onExtend={(item) => setModal({ type: "extend", item })}
        onConvert={(item) => setModal({ type: "convert", item })}
        onAppeal={(item) => setModal({ type: "appeal", item })}
      />

      <ReinstateModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleReinstateConfirm}
      />

      <ExtendModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleExtendConfirm}
      />

      <ConvertPermanentModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleConvertConfirm}
      />

      <AppealModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleAppealConfirm}
      />
    </div>
  );
};

export default SuspendedUsers;