import React, { useEffect, useRef, useState } from "react";
import {
  MoreHorizontal,
  Eye,
  CheckCircle2,
  XCircle,
  FileEdit,
  ShieldAlert,
  NotebookPen,
} from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

export default function PendingApprovalRowActions({
  item,
  canQuickApprove = false,
  onReview,
  onQuickApprove,
  onReject,
  onRequestChanges,
  onEscalate,
  onAddNote,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="relative inline-flex items-center justify-end gap-2" ref={ref}>
      <button
        onClick={() => onReview?.(item)}
        className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-[12px] font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
      >
        <Eye className="h-4 w-4" />
        Review
      </button>

      {canQuickApprove && (
        <button
          onClick={() => onQuickApprove?.(item)}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 text-[12px] font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
        >
          <CheckCircle2 className="h-4 w-4" />
          Quick Approve
        </button>
      )}

      <button
        onClick={() => onReject?.(item)}
        className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 text-[12px] font-semibold text-rose-700 transition-colors hover:bg-rose-100"
      >
        <XCircle className="h-4 w-4" />
        Reject
      </button>

      <button
        onClick={() => setOpen((p) => !p)}
        className={cls(
          "inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-colors",
          open
            ? "border-slate-300 bg-slate-100 text-slate-900"
            : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900"
        )}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-30 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl">
          <button
            onClick={() => {
              onRequestChanges?.(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <FileEdit className="h-4 w-4 text-slate-500" />
            Request Changes
          </button>

          <button
            onClick={() => {
              onEscalate?.(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-amber-700 transition-colors hover:bg-amber-50"
          >
            <ShieldAlert className="h-4 w-4" />
            Escalate to Fraud
          </button>

          <div className="my-1 border-t border-slate-100" />

          <button
            onClick={() => {
              onAddNote?.(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <NotebookPen className="h-4 w-4 text-slate-500" />
            Add Internal Note
          </button>
        </div>
      )}
    </div>
  );
}