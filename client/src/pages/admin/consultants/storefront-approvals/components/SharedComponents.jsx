import React, { useRef, useState, useEffect } from "react";
import {
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  ShieldAlert,
  Clock3,
  ChevronDown,
  X,
  FileImage,
  FileText,
  RotateCcw,
  Ban,
  Building2,
  SlidersHorizontal,
  BadgeCheck,
} from "lucide-react";

export const cls = (...a) => a.filter(Boolean).join(" ");

export const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export const riskBadge = (risk) => {
  const r = String(risk || "").toLowerCase();
  if (r === "high") return "bg-rose-50 text-rose-700 border-rose-200";
  if (r === "moderate") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-emerald-50 text-emerald-700 border-emerald-200";
};

export const tierBadge = (tier) => {
  const t = String(tier || "").toLowerCase();
  if (t.includes("premium"))
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (t.includes("pro")) return "bg-sky-50 text-sky-700 border-sky-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
};

export const detectionBadge = (severity) => {
  const s = String(severity || "").toLowerCase();
  if (s === "blocked") return "bg-rose-50 text-rose-700 border-rose-200";
  if (s === "warning") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-emerald-50 text-emerald-700 border-emerald-200";
};

export const tabBtn = (active) =>
  cls(
    "rounded-xl px-4 py-2.5 text-sm font-semibold transition whitespace-nowrap border",
    active
      ? "bg-slate-900 border-slate-900 text-white shadow-sm"
      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
  );

export function TopCard({ title, value, icon: Icon = Building2, active }) {
  return (
    <div className={cls(
      "relative overflow-hidden rounded-2xl border p-6 shadow-sm transition-all duration-300",
      active ? "border-sky-500 ring-1 ring-sky-500" : "border-slate-200 bg-white"
    )}>
      <div className={cls(
        "absolute inset-0 bg-gradient-to-br opacity-70",
        active ? "from-sky-100 to-transparent" : "from-slate-50 to-transparent"
      )} />
      <div className="relative z-10 flex items-end justify-between">
        <div>
          <div className="mb-2 text-[12px] font-bold uppercase tracking-[0.15em] text-slate-400">
            {title}
          </div>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900">
            {value}
          </div>
        </div>
        <div className={cls(
          "flex h-11 w-11 items-center justify-center rounded-xl border transition-colors",
          active ? "border-sky-200 bg-sky-100 text-sky-600" : "border-slate-100 bg-slate-50 text-slate-400"
        )}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

export function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none transition focus:border-sky-400 appearance-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ActionMenu({
  item,
  onView,
  onApprove,
  onReject,
  onSendBack,
  onAudit,
  compact = false,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handle = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div className="relative inline-flex justify-end" ref={ref}>
      {compact ? (
        <button
          type="button"
          onClick={() => setOpen((p) => !p)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((p) => !p)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Actions <ChevronDown className="h-4 w-4" />
        </button>
      )}

      {open && (
        <div className="absolute right-0 top-11 z-30 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
          <button
            type="button"
            onClick={() => {
              onView?.(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50"
          >
            <Eye className="h-4 w-4 text-slate-500" />
            View Review
          </button>

          {onApprove ? (
            <button
              type="button"
              onClick={() => {
                onApprove(item);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-emerald-700 hover:bg-emerald-50"
            >
              <CheckCircle2 className="h-4 w-4" />
              Approve
            </button>
          ) : null}

          {onReject ? (
            <button
              type="button"
              onClick={() => {
                onReject(item);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-rose-700 hover:bg-rose-50"
            >
              <XCircle className="h-4 w-4" />
              Reject
            </button>
          ) : null}

          {onSendBack ? (
            <button
              type="button"
              onClick={() => {
                onSendBack(item);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-indigo-700 hover:bg-indigo-50"
            >
              <RefreshCcw className="h-4 w-4" />
              Send Back
            </button>
          ) : null}

          {onAudit ? (
            <button
              type="button"
              onClick={() => {
                onAudit(item);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-amber-700 hover:bg-amber-50"
            >
              <ShieldAlert className="h-4 w-4" />
              Flag for Audit
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}

export const REJECT_REASONS = [
  "False Certification Claim",
  "Unauthorized Badge",
  "Warranty Guarantee Claim",
  "Irrelevant Media",
  "Contact Info in Banner",
  "Misleading Language",
  "Other",
];
