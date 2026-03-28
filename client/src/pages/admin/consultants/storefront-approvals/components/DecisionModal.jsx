import React from "react";
import { X, CheckCircle2, XCircle, RefreshCcw, ShieldAlert } from "lucide-react";
import { cls, SelectField, REJECT_REASONS } from "./SharedComponents";

export default function DecisionModal({
  open,
  mode,
  item,
  reason,
  comment,
  setReason,
  setComment,
  onClose,
  onConfirm,
}) {
  if (!open || !item) return null;

  const isReject = mode === "reject";
  const isRevision = mode === "revision";
  const isAudit = mode === "audit";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {isReject
                  ? "Reject Storefront Change"
                  : isRevision
                  ? "Send Back for Revision"
                  : isAudit
                  ? "Flag Storefront for Audit"
                  : "Approve Storefront Change"}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Consultant: {item.consultantName || item.consultant}
              </p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-4 px-5 py-4">
          {(isReject || isRevision) && (
            <>
              <SelectField
                label="Reason"
                value={reason}
                onChange={setReason}
                options={[
                  { label: "Select reason", value: "" },
                  ...REJECT_REASONS.map((r) => ({ label: r, value: r })),
                ]}
              />

              <label className="block">
                <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Comment
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400"
                  placeholder="Add reviewer feedback..."
                />
              </label>
            </>
          )}

          {isAudit && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <div className="flex gap-3">
                <ShieldAlert className="shrink-0 h-5 w-5" />
                <p>
                  This will create an internal audit task, notify ops, increase risk
                  score, and optionally apply storefront ranking penalty.
                </p>
              </div>
            </div>
          )}

          {!isReject && !isRevision && !isAudit && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              <div className="flex gap-3">
                <CheckCircle2 className="shrink-0 h-5 w-5" />
                <p>
                  This will publish the updated storefront, remove previous version,
                  save timestamp, log approval, and notify consultant.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-5 py-4 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={(isReject || isRevision) && !reason}
            onClick={onConfirm}
            className={cls(
              "rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-50",
              isReject
                ? "bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-200"
                : isRevision
                ? "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                : isAudit
                ? "bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-200"
                : "bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200"
            )}
          >
            {isReject
              ? "Reject"
              : isRevision
              ? "Send Back"
              : isAudit
              ? "Flag Audit"
              : "Approve"}
          </button>
        </div>
      </div>
    </div>
  );
}
