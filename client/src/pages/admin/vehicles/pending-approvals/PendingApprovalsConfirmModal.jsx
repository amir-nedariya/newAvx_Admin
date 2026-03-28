import React, { useEffect, useMemo, useState } from "react";
import {
  X,
  CheckCircle2,
  ShieldAlert,
  FileEdit,
  NotebookPen,
  XCircle,
} from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

const rejectReasons = [
  "Fake images",
  "Price manipulation",
  "Duplicate vehicle",
  "Policy violation",
  "Incomplete data",
  "Fraud suspicion",
];

const changeFields = [
  "Price",
  "Description",
  "Media",
  "Inspection details",
  "Registration details",
];

export default function PendingApprovalsConfirmModal({
  modal,
  onClose,
  onApprove,
  onReject,
  onRequestChanges,
  onEscalate,
  onSaveNote,
}) {
  const [reason, setReason] = useState(rejectReasons[0]);
  const [comment, setComment] = useState("");
  const [note, setNote] = useState("");
  const [selectedFields, setSelectedFields] = useState(["Price", "Description"]);

  useEffect(() => {
    if (!modal) return;
    setReason(rejectReasons[0]);
    setComment("");
    setNote("");
    setSelectedFields(["Price", "Description"]);
  }, [modal]);

  const config = useMemo(() => {
    switch (modal?.type) {
      case "approve":
        return {
          title: "Approve Vehicle Listing",
          icon: CheckCircle2,
          tone: "emerald",
          description:
            "Status will change to Active. Listing will become searchable immediately.",
          confirmText: "Confirm Approval",
        };
      case "reject":
        return {
          title: "Reject Vehicle Listing",
          icon: XCircle,
          tone: "rose",
          description:
            "Listing will not be visible. Consultant will be notified with the rejection reason.",
          confirmText: "Confirm Rejection",
        };
      case "changes":
        return {
          title: "Request Changes",
          icon: FileEdit,
          tone: "amber",
          description:
            "Consultant must update the selected fields and resubmit for approval.",
          confirmText: "Send Change Request",
        };
      case "escalate":
        return {
          title: "Escalate to Fraud Review",
          icon: ShieldAlert,
          tone: "amber",
          description:
            "This will create a fraud case, lock the listing, and notify the ops team.",
          confirmText: "Escalate Listing",
        };
      case "note":
        return {
          title: "Add Internal Note",
          icon: NotebookPen,
          tone: "slate",
          description:
            "Add an internal note for moderators and operations visibility.",
          confirmText: "Save Note",
        };
      default:
        return null;
    }
  }, [modal]);

  if (!modal || !config) return null;

  const item = modal.item;
  const Icon = config.icon;

  const toneMap = {
    emerald: {
      soft: "border-emerald-200 bg-emerald-50 text-emerald-700",
      btn: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
    rose: {
      soft: "border-rose-200 bg-rose-50 text-rose-700",
      btn: "bg-rose-600 hover:bg-rose-700 text-white",
    },
    amber: {
      soft: "border-amber-200 bg-amber-50 text-amber-700",
      btn: "bg-amber-600 hover:bg-amber-700 text-white",
    },
    slate: {
      soft: "border-slate-200 bg-slate-50 text-slate-700",
      btn: "bg-slate-900 hover:bg-slate-800 text-white",
    },
  };

  const tone = toneMap[config.tone];

  const toggleField = (field) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const handleConfirm = () => {
    if (modal.type === "approve") {
      onApprove?.(item);
      return;
    }

    if (modal.type === "reject") {
      if (!comment.trim()) return;
      onReject?.({
        ...item,
        rejectReason: reason,
        rejectComment: comment.trim(),
      });
      return;
    }

    if (modal.type === "changes") {
      if (!comment.trim()) return;
      onRequestChanges?.({
        ...item,
        requestedFields: selectedFields,
        requestComment: comment.trim(),
      });
      return;
    }

    if (modal.type === "escalate") {
      if (!comment.trim()) return;
      onEscalate?.({
        ...item,
        escalateComment: comment.trim(),
      });
      return;
    }

    if (modal.type === "note") {
      if (!note.trim()) return;
      onSaveNote?.({
        ...item,
        note: note.trim(),
      });
      return;
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed left-1/2 top-1/2 z-[61] w-[95%] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className={cls(
                  "flex h-11 w-11 items-center justify-center rounded-xl border",
                  tone.soft
                )}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">{config.title}</h3>
                <p className="mt-1 text-[13px] text-slate-500">
                  {item?.title || item?.id}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div className={cls("rounded-xl border px-4 py-3 text-[13px]", tone.soft)}>
            {config.description}
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">
              Listing Summary
            </div>
            <div className="mt-2 grid grid-cols-2 gap-3 text-[13px]">
              <div>
                <span className="text-slate-400">Vehicle ID:</span>{" "}
                <span className="font-medium text-slate-700">{item?.id || "-"}</span>
              </div>
              <div>
                <span className="text-slate-400">Submission:</span>{" "}
                <span className="font-medium text-slate-700">
                  {item?.submissionType || "-"}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Consultant:</span>{" "}
                <span className="font-medium text-slate-700">
                  {item?.consultant || "-"}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Risk:</span>{" "}
                <span className="font-medium text-slate-700">{item?.risk || "-"}</span>
              </div>
            </div>
          </div>

          {modal.type === "reject" && (
            <>
              <div>
                <label className="mb-2 block text-[13px] font-medium text-slate-700">
                  Reason
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400"
                >
                  {rejectReasons.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-medium text-slate-700">
                  Comment <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Enter rejection note for consultant and audit trail..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] text-slate-900 outline-none focus:border-sky-400"
                />
              </div>
            </>
          )}

          {modal.type === "changes" && (
            <>
              <div>
                <label className="mb-3 block text-[13px] font-medium text-slate-700">
                  Fields needing correction
                </label>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {changeFields.map((field) => (
                    <label
                      key={field}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFields.includes(field)}
                        onChange={() => toggleField(field)}
                        className="h-4 w-4 rounded border-slate-300"
                      />
                      <span>{field}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-medium text-slate-700">
                  Comment <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Describe what needs to be corrected..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] text-slate-900 outline-none focus:border-sky-400"
                />
              </div>
            </>
          )}

          {modal.type === "escalate" && (
            <div>
              <label className="mb-2 block text-[13px] font-medium text-slate-700">
                Escalation Note <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Mention why this listing should be moved to fraud review..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] text-slate-900 outline-none focus:border-sky-400"
              />
            </div>
          )}

          {modal.type === "note" && (
            <div>
              <label className="mb-2 block text-[13px] font-medium text-slate-700">
                Internal Note <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add internal ops / moderation note..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] text-slate-900 outline-none focus:border-sky-400"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[13px] font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            className={cls(
              "rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-colors",
              tone.btn
            )}
          >
            {config.confirmText}
          </button>
        </div>
      </div>
    </>
  );
}