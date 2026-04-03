import React, { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  ArrowLeft,
  Ban,
  RotateCcw,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  X,
  Image as ImageIcon,
  Eye,
  XCircle,
  User,
  Mail,
  Phone,
  CalendarDays,
  FileText,
  Loader2,
  ChevronRight,
  Activity,
  Clock3,
  Search,
  ChevronLeft,
  Filter,
  BadgeCheck,
  ShieldAlert,
  NotebookPen,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getConsultationById,
  unsuspendConsultation,
  approveKYCConsultation,
  rejectKYCConsultation,
  requestUploadKYCConsultation,
  addPenalty,
  suspendConsultation,
} from "../../../../api/consultationApi";
import { getTierPlans } from "../../../../api/tierPlan.api";

const cls = (...a) => a.filter(Boolean).join(" ");

/* ================= FORMATTERS ================= */
const safe = (v) => (v === null || v === undefined || v === "" ? "—" : v);

const fmtInt = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(n) : 0;
};

const fmtPct = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return "0%";
  return `${Number(n).toFixed(1).replace(".0", "")}%`;
};

const fmtResponse = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return "N/A";

  if (n > 3600) {
    const hours = n / 3600;
    return `${hours.toFixed(1).replace(".0", "")}h`;
  }

  if (n <= 24) return `${n.toFixed(1).replace(".0", "")}h`;

  const h = n / 60;
  return `${h.toFixed(1).replace(".0", "")}h`;
};

const formatEnumLabel = (value) => {
  if (!value) return "-";
  return String(value).replace(/_/g, " ");
};

const getErrorMessage = (e, fallback = "Something went wrong") => {
  return (
    e?.response?.data?.message ||
    e?.response?.data?.error ||
    e?.message ||
    fallback
  );
};

/* ================= SMALL UI PARTS ================= */
const Pill = ({ tone = "slate", children }) => {
  const map = {
    slate: "bg-slate-50 text-slate-700 border-slate-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    red: "bg-rose-50 text-rose-700 border-rose-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };

  return (
    <span
      className={cls(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold",
        map[tone] || map.slate
      )}
    >
      {children}
    </span>
  );
};

const Stat = ({ label, value, highlight = false }) => (
  <div className="min-w-[160px] flex-1 py-3">
    <p className="text-[11px] uppercase tracking-wide text-slate-500">
      {label}
    </p>
    <p
      className={cls(
        "mt-1 text-lg font-extrabold",
        highlight ? "text-emerald-700" : "text-slate-900"
      )}
    >
      {value}
    </p>
  </div>
);

function StatItem({ label, value }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{label}</div>
      <div className="mt-1 text-lg font-bold text-zinc-900">{value}</div>
    </div>
  );
}

function SectionCard({ title, subtitle, children }) {
  return (
    <div className="rounded-[28px] border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-100 px-5 py-4">
        <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
        {subtitle ? <p className="text-sm text-zinc-500">{subtitle}</p> : null}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function InfoItem({ label, value, full = false }) {
  return (
    <div className={cls(full ? "col-span-2" : "")}>
      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-zinc-900 break-words">{value || "-"}</div>
    </div>
  );
}

function InfoLine({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3">
      <div className="mt-0.5 text-zinc-500">{icon}</div>
      <div className="min-w-0">
        <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</div>
        <div className="mt-1 text-sm font-semibold text-zinc-900 break-words">{value || "-"}</div>
      </div>
    </div>
  );
}

const CardField = ({ label, value }) => (
  <div className="py-3">
    <p className="text-[11px] uppercase tracking-wide text-slate-500">
      {label}
    </p>
    <p className="mt-1 text-sm font-semibold text-slate-900">{safe(value)}</p>
  </div>
);

const DocChip = ({ ok, text, onClick, clickable = false }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={!clickable}
    className={cls(
      "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold transition",
      ok
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-slate-200 bg-slate-50 text-slate-700",
      clickable
        ? "cursor-pointer hover:scale-[1.02] hover:shadow-sm"
        : "cursor-default"
    )}
  >
    {ok ? (
      <CheckCircle2 size={14} />
    ) : (
      <AlertTriangle size={14} className="text-amber-500" />
    )}
    {text}
  </button>
);

/* ================= IMAGE MODAL ================= */
function DocumentImageModal({ open, onClose, title, imageUrl }) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-slate-900/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed left-1/2 top-1/2 z-[101] w-[95%] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              {title}
            </h3>
            <p className="mt-1 text-xs text-slate-500">Document preview</p>
          </div>

          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex max-h-[80vh] min-h-[320px] items-center justify-center bg-slate-100 p-4">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="max-h-[72vh] w-auto max-w-full rounded-xl border border-slate-200 bg-white object-contain shadow-sm"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400">
              <ImageIcon size={34} />
              <p className="mt-2 text-sm font-semibold">No image available</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ================= UNSUSPEND CONSULTANT MODAL ================= */
function UnsuspendConsultantModal({
  open,
  consultantName,
  value,
  setValue,
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
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50">
              <RotateCcw className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-zinc-900">Unsuspend Consultant</h3>
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
          <div className="mb-6 rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-3">
            <p className="text-sm font-semibold text-emerald-800">
              Consultant will be reactivated and able to access their account immediately.
            </p>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-bold text-zinc-700">
              Reason <span className="text-emerald-500">*</span>
            </label>
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={4}
              placeholder="Enter reason for unsuspending this consultant..."
              className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-xl border border-zinc-200 bg-white px-6 py-2.5 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={loading || !value.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RotateCcw className="h-4 w-4" />
              {loading ? "Processing..." : "Confirm Unsuspend"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ================= SUSPEND CONSULTANT MODAL ================= */
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
              <select
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
              >
                <option value="">Select reason</option>
                {suspensionReasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
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
                  type="datetime-local"
                  value={suspendUntil}
                  onChange={(e) => setSuspendUntil(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                />
                <p className="mt-2 text-xs text-zinc-500">Select a future date and time for suspension end</p>
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

/* ================= REQUEST RE-UPLOAD MODAL ================= */
function RequestReuploadModal({
  open,
  consultantName,
  value,
  setValue,
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
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50">
              <RotateCcw className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-zinc-900">Request KYC Re-upload</h3>
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
          <div className="mb-6 rounded-2xl bg-amber-50 border border-amber-100 px-4 py-3">
            <p className="text-sm font-semibold text-amber-800">
              Consultant will be notified to re-upload KYC documents with your remarks.
            </p>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-bold text-zinc-700">
              Remark <span className="text-amber-500">*</span>
            </label>
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={4}
              placeholder="Enter remark for requesting re-upload..."
              className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-xl border border-zinc-200 bg-white px-6 py-2.5 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={loading || !value.trim()}
              className="rounded-xl bg-amber-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Processing..." : "Request Re-upload"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ================= REJECT KYC MODAL ================= */
function RejectKYCModal({
  open,
  consultantName,
  rejectionReason,
  setRejectionReason,
  rejectionReasonText,
  setRejectionReasonText,
  loading,
  onClose,
  onConfirm,
}) {
  if (!open) return null;

  const rejectionReasons = [
    "Incomplete documents",
    "Invalid documents",
    "Document mismatch",
    "Expired documents",
    "Fraudulent information",
    "Policy violation",
    "Other",
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
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50">
              <XCircle className="h-6 w-6 text-rose-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-zinc-900">Reject KYC</h3>
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
          <div className="mb-6 rounded-2xl bg-rose-50 border border-rose-100 px-4 py-3">
            <p className="text-sm font-semibold text-rose-800">
              KYC will be rejected. Consultant will be notified with the rejection reason.
            </p>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-bold text-zinc-700">
              Reason
            </label>
            <select
              value={rejectionReason}
              onChange={(e) => {
                setRejectionReason(e.target.value);
                if (e.target.value !== "Other") {
                  setRejectionReasonText("");
                }
              }}
              className="w-full appearance-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
            >
              <option value="">Select a reason...</option>
              {rejectionReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          {rejectionReason === "Other" && (
            <div className="mb-6">
              <label className="mb-2 block text-sm font-bold text-zinc-700">
                Reason <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={rejectionReasonText}
                onChange={(e) => setRejectionReasonText(e.target.value)}
                rows={4}
                placeholder="Enter the rejection reason..."
                className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
              />
            </div>
          )}

          <div className="flex justify-end gap-3">
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
                !rejectionReason ||
                (rejectionReason === "Other" && !rejectionReasonText.trim())
              }
              className="rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Processing..." : "Confirm Rejection"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ================= ACTION MODAL ================= */
function ActionRemarkModal({
  open,
  title,
  label,
  value,
  setValue,
  confirmText,
  loading,
  onClose,
  onConfirm,
  placeholder,
  isApproval = false,
  consultantName = "",
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
            {isApproval && (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-zinc-900">{title}</h3>
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
          {isApproval && (
            <div className="mb-6 rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-3">
              <p className="text-sm font-semibold text-emerald-800">
                KYC will be approved. Consultant will be able to list vehicles immediately.
              </p>
            </div>
          )}

          <div className="mb-6">
            <label className="mb-2 block text-sm font-bold text-zinc-700">
              {label} {isApproval && <span className="text-zinc-400">(Optional)</span>}
            </label>

            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={4}
              placeholder={placeholder}
              className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-xl border border-zinc-200 bg-white px-6 py-2.5 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={loading || (!isApproval && !value.trim())}
              className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Processing..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ================= PENALTY MODAL ================= */
function PenaltyActionModal({
  open,
  consultantName,
  deduction,
  setDeduction,
  reason,
  setReason,
  confirmText,
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
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-zinc-900">Apply Ranking Penalty</h3>
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
          <div className="mb-6 rounded-2xl bg-red-50 border border-red-100 px-4 py-3">
            <p className="text-sm font-semibold text-red-800">
              This will deduct points from the consultant's ranking score. Action cannot be undone.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-700">
                Deduction Amount (Points) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={deduction}
                onChange={(e) => setDeduction(e.target.value)}
                placeholder="e.g. 10"
                min="1"
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-700">
                Reason for Penalty <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                placeholder="Enter reason for this penalty..."
                className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              />
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
              disabled={loading || !reason.trim() || !deduction || Number(deduction) <= 0}
              className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Applying..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ================= MAIN ================= */
const ConsultantProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [kycActionLoading, setKycActionLoading] = useState("");
  const [activeTab, setActiveTab] = useState("Overview");
  const [previewImage, setPreviewImage] = useState(null);
  const [previewTitle, setPreviewTitle] = useState("");

  // Inventory pagination and search
  const [inventorySearch, setInventorySearch] = useState("");
  const [inventoryPage, setInventoryPage] = useState(1);
  const [inventoryStatusFilter, setInventoryStatusFilter] = useState("ALL");
  const inventoryPerPage = 10;

  const [docModal, setDocModal] = useState({
    open: false,
    title: "",
    imageUrl: "",
  });

  const [actionModal, setActionModal] = useState({
    open: false,
    type: "",
    menuOpen: false,
  });

  const [reasonText, setReasonText] = useState("");
  const [remarkText, setRemarkText] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionReasonText, setRejectionReasonText] = useState("");
  const [penaltyDeduction, setPenaltyDeduction] = useState("");
  const [penaltyReason, setPenaltyReason] = useState("");

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

  // Tier plans
  const [tierPlans, setTierPlans] = useState([]);

  const profile = useMemo(() => {
    const d = data?.data ? data.data : data;
    if (!d) return null;

    // Extract nested data
    const tierInfo = d?.tierPlanInfo || {};
    const addressInfo = d?.addressInfo || {};
    const documentInfo = d?.documentInfo || {};
    const stats = d?.stats || {};

    const tierTitle = tierInfo?.tierPlanTitle || "—";
    const status = String(d?.status || "").toUpperCase() || "—";

    const verification = d?.verificationStatus
      ? String(d.verificationStatus).toUpperCase()
      : "PENDING";

    const risk = d?.risk ? String(d.risk) : "Low";

    const name = d?.consultationName || d?.consultName || d?.ownerName || "Consultant";
    const username = d?.username || "—";

    const city = addressInfo?.cityName || "—";
    const state = addressInfo?.stateName || "—";
    const location =
      city !== "—" && state !== "—"
        ? `${city}, ${state}`
        : city !== "—"
          ? city
          : state;

    const tierTone = tierTitle.toLowerCase().includes("premium")
      ? "green"
      : tierTitle.toLowerCase().includes("pro")
        ? "blue"
        : "slate";

    const verifiedTone =
      verification === "VERIFIED"
        ? "green"
        : verification === "REJECTED"
          ? "red"
          : verification === "REQUEST_CHANGES"
            ? "amber"
            : verification === "REQUESTED"
              ? "blue"
              : "slate";

    const statusTone =
      status === "ACTIVE"
        ? "green"
        : status === "INACTIVE"
          ? "slate"
          : status === "DELETED"
            ? "red"
            : "slate";

    const kycLabel =
      verification === "VERIFIED"
        ? "KYC: Approved"
        : verification === "REJECTED"
          ? "KYC: Rejected"
          : verification === "REQUEST_CHANGES"
            ? "KYC: Changes Requested"
            : verification === "REQUESTED"
              ? "KYC: Requested"
              : "KYC: Pending";

    const riskLabel = risk?.trim() ? risk : "Low";

    return {
      raw: d,
      consultId: d?.id || id,
      name,
      username,
      ownerName: d?.ownerName || "—",

      tierId: tierInfo?.tierPlanId || null,
      tierTitle,
      tierTone,
      tierBadgeUrl: tierInfo?.tierBadgeUrl || null,
      tierStartDate: tierInfo?.tierStartDate || null,
      tierEndDate: tierInfo?.tierEndDate || null,

      status,
      statusTone,

      verification,
      verifiedTone,
      kycLabel,

      risk: riskLabel,

      location: location || "—",
      address: addressInfo?.address || "—",
      email: d?.companyEmail || "—",
      phone: d?.phoneNumber || "—",

      bannerUrl: d?.bannerUrl || null,
      logoUrl: d?.logoUrl || d?.logoURL || null,

      establishmentYear: d?.establishmentYear || "—",
      vehicleTypes: d?.vehicleTypes || [],
      services: d?.services || [],

      totalVehicles: fmtInt(stats?.totalVehicles),
      totalActiveVehicles: fmtInt(stats?.activeVehicles),
      totalSoldVehicles: fmtInt(stats?.soldVehicles),
      conversions: fmtPct(stats?.conversionRate),
      totalInquiries: fmtInt(stats?.totalInquiries),
      responseTime: fmtResponse(stats?.avgResponseTime),
      avgRating: stats?.avgRating ?? 0,
      totalReviews: fmtInt(stats?.totalReviews),
      totalFollowers: fmtInt(stats?.totalFollowers),

      gstNumber: documentInfo?.gstNumber || "—",
      panCardNumber: documentInfo?.panCardNumber || "—",
      aadharCardNumber: documentInfo?.aadharCardNumber || "—",
      gstCertificateUrl: documentInfo?.gstCertificateUrl || null,
      panCardFrontUrl: documentInfo?.panCardFrontUrl || null,
      aadharCardFrontUrl: documentInfo?.aadharCardFrontUrl || null,
      aadharCardBackUrl: documentInfo?.aadharCardBackUrl || null,
      addressVerifiedStatus: addressInfo?.status || null,

      flagReviews: d?.flagReviews || [],
      suspensions: d?.suspensions || [],
      internalNotes: d?.internalNotes || [],
      activityLogs: d?.activityLogs || [],
    };
  }, [data, id]);

  // Filtered and paginated vehicles for inventory tab
  const filteredVehicles = useMemo(() => {
    if (!profile?.raw?.vehicles) return [];

    let vehicles = profile.raw.vehicles;

    // Filter by search text
    if (inventorySearch.trim()) {
      const searchLower = inventorySearch.toLowerCase();
      vehicles = vehicles.filter(vehicle =>
        vehicle.vehicleTitle?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by verification status
    if (inventoryStatusFilter !== "ALL") {
      vehicles = vehicles.filter(vehicle =>
        vehicle.verificationStatus === inventoryStatusFilter
      );
    }

    return vehicles;
  }, [profile?.raw?.vehicles, inventorySearch, inventoryStatusFilter]);

  const paginatedVehicles = useMemo(() => {
    const startIndex = (inventoryPage - 1) * inventoryPerPage;
    const endIndex = startIndex + inventoryPerPage;
    return filteredVehicles.slice(startIndex, endIndex);
  }, [filteredVehicles, inventoryPage, inventoryPerPage]);

  const totalVehiclePages = Math.ceil(filteredVehicles.length / inventoryPerPage);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setInventoryPage(1);
  }, [inventorySearch, inventoryStatusFilter]);

  const fetchProfile = async ({ silent = false } = {}) => {
    try {
      if (!silent) setLoading(true);
      setError("");
      const res = await getConsultationById(id);
      setData(res);
    } catch (e) {
      const msg = getErrorMessage(e, "Failed to load consultant profile");
      setError(msg);
      toast.error(msg);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    loadTierPlans();
  }, [id]);

  const loadTierPlans = async () => {
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
    } catch (e) {
      console.error(e);
      setTierPlans([]);
    }
  };

  const getConsultId = () => {
    const consultId = profile?.consultId || id;
    if (!consultId) {
      toast.error("consultId not found");
      return null;
    }
    return consultId;
  };

  const openDocModal = (title, imageUrl) => {
    if (!imageUrl) {
      toast.error("Document image not available");
      return;
    }

    setDocModal({
      open: true,
      title,
      imageUrl,
    });
  };

  const closeDocModal = () => {
    setDocModal({
      open: false,
      title: "",
      imageUrl: "",
    });
  };

  const openKycModal = (type) => {
    setRemarkText("");
    setActionModal({
      open: true,
      type,
      menuOpen: false,
    });
  };

  const closeActionModal = () => {
    setActionModal({
      open: false,
      type: "",
      menuOpen: false,
    });
    setReasonText("");
    setRemarkText("");
    setRejectionReason("");
    setRejectionReasonText("");
    setPenaltyReason("");
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
  };

  const handleUnsuspend = async () => {
    try {
      const consultId = getConsultId();
      if (!consultId) return;

      if (!reasonText.trim()) {
        toast.error("Reason is required");
        return;
      }

      setActionLoading(true);

      await unsuspendConsultation({
        consultId,
        reason: reasonText.trim(),
      });

      toast.success("Consultant unsuspended successfully");
      closeActionModal();
      await fetchProfile({ silent: true });
    } catch (e) {
      toast.error(getErrorMessage(e, "Failed to unsuspend consultant"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveKYC = async () => {
    try {
      const consultId = getConsultId();
      if (!consultId) return;

      setKycActionLoading("approve");

      await approveKYCConsultation({
        consultId,
        remark: remarkText.trim() || "KYC approved",
      });

      toast.success("KYC approved successfully");
      closeActionModal();
      await fetchProfile({ silent: true });
    } catch (e) {
      toast.error(getErrorMessage(e, "Failed to approve KYC"));
    } finally {
      setKycActionLoading("");
    }
  };

  const handleRejectKYC = async () => {
    try {
      const consultId = getConsultId();
      if (!consultId) return;

      // Determine the final reason based on dropdown selection
      let finalReason = "";
      if (rejectionReason === "Other") {
        if (!rejectionReasonText.trim()) {
          toast.error("Please enter a rejection reason");
          return;
        }
        finalReason = rejectionReasonText.trim();
      } else {
        if (!rejectionReason) {
          toast.error("Please select a rejection reason");
          return;
        }
        finalReason = rejectionReason;
      }

      setKycActionLoading("reject");

      await rejectKYCConsultation({
        consultId,
        remark: finalReason,
      });

      toast.success("KYC rejected successfully");
      closeActionModal();
      await fetchProfile({ silent: true });
    } catch (e) {
      toast.error(getErrorMessage(e, "Failed to reject KYC"));
    } finally {
      setKycActionLoading("");
    }
  };

  const handleRequestUploadKYC = async () => {
    try {
      const consultId = getConsultId();
      if (!consultId) return;

      if (!remarkText.trim()) {
        toast.error("Remark is required");
        return;
      }

      setKycActionLoading("request");

      await requestUploadKYCConsultation({
        consultId,
        remark: remarkText.trim(),
      });

      toast.success("KYC re-upload requested successfully");
      closeActionModal();
      await fetchProfile({ silent: true });
    } catch (e) {
      toast.error(getErrorMessage(e, "Failed to request KYC re-upload"));
    } finally {
      setKycActionLoading("");
    }
  };

  const handleApplyPenalty = async () => {
    try {
      const consultId = getConsultId();
      if (!consultId) return;

      if (!penaltyReason.trim()) {
        toast.error("Reason is required");
        return;
      }

      if (!penaltyDeduction || isNaN(penaltyDeduction)) {
        toast.error("Valid deduction amount is required");
        return;
      }

      setActionLoading(true);

      await addPenalty({
        consultId,
        deductionCount: Number(penaltyDeduction),
        reason: penaltyReason.trim(),
      });

      toast.success("Penalty applied successfully");
      closeActionModal();
      await fetchProfile({ silent: true });
    } catch (e) {
      toast.error(getErrorMessage(e, "Failed to apply penalty"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspendConsultant = async () => {
    try {
      const consultId = getConsultId();
      if (!consultId) return;

      if (!suspendReason) {
        toast.error("Please select a suspension reason");
        return;
      }

      if (suspendType === "TEMPORARY" && !suspendUntil) {
        toast.error("Please select suspension end date");
        return;
      }

      setActionLoading(true);

      await suspendConsultation({
        consultId,
        reason: suspendReason,
        suspendType,
        suspendUntil: suspendType === "TEMPORARY" ? suspendUntil : null,
      });

      toast.success("Consultant suspended successfully");
      closeActionModal();
      await fetchProfile({ silent: true });
    } catch (e) {
      toast.error(getErrorMessage(e, "Failed to suspend consultant"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangeTierConfirm = async () => {
    try {
      const consultId = getConsultId();
      if (!consultId) return;

      if (!selectedTier || !applyType || !tierChangeReason.trim() || tierChangeReason.trim().length < 5) {
        toast.error("Please fill all required fields");
        return;
      }

      setActionLoading(true);

      // TODO: Replace with actual API call
      // await changeTierPlan({
      //   consultId,
      //   newTierId: selectedTier,
      //   applyType: applyType,
      //   discountPercentage: discountPercentage ? parseFloat(discountPercentage) : null,
      //   manualPrice: manualPrice ? parseFloat(manualPrice) : null,
      //   reason: tierChangeReason,
      // });

      toast.success("Tier plan changed successfully");
      closeActionModal();
      await fetchProfile({ silent: true });
    } catch (e) {
      toast.error(getErrorMessage(e, "Failed to change tier plan"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleFlagReviewConfirm = async () => {
    try {
      const consultId = getConsultId();
      if (!consultId) return;

      if (!flagCategory || !flagSeverity || !flagNotes.trim() || flagNotes.trim().length < 10) {
        toast.error("Please fill all required fields");
        return;
      }

      setActionLoading(true);

      // TODO: Replace with actual API call
      // await flagForReview({
      //   consultId,
      //   flagCategory: flagCategory,
      //   severity: flagSeverity,
      //   internalNotes: flagNotes,
      // });

      toast.success("Consultant flagged for review");
      closeActionModal();
      await fetchProfile({ silent: true });
    } catch (e) {
      toast.error(getErrorMessage(e, "Failed to flag consultant"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleForceAuditConfirm = async () => {
    try {
      const consultId = getConsultId();
      if (!consultId) return;

      if (!auditType || !auditReason.trim() || auditReason.trim().length < 10) {
        toast.error("Please fill all required fields");
        return;
      }

      setActionLoading(true);

      // TODO: Replace with actual API call
      // await forceAudit({
      //   consultId,
      //   auditType: auditType,
      //   reason: auditReason,
      // });

      toast.success("Audit initiated successfully");
      closeActionModal();
      await fetchProfile({ silent: true });
    } catch (e) {
      toast.error(getErrorMessage(e, "Failed to initiate audit"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddNoteConfirm = async () => {
    try {
      const consultId = getConsultId();
      if (!consultId) return;

      if (!noteText.trim()) {
        toast.error("Note text is required");
        return;
      }

      setActionLoading(true);

      // TODO: Replace with actual API call
      // await addInternalNote({
      //   consultId,
      //   note: noteText,
      // });

      toast.success("Internal note added successfully");
      closeActionModal();
      await fetchProfile({ silent: true });
    } catch (e) {
      toast.error(getErrorMessage(e, "Failed to add note"));
    } finally {
      setActionLoading(false);
    }
  };

  const bannerStyle = profile?.bannerUrl
    ? { backgroundImage: `url(${profile.bannerUrl})` }
    : null;

  const initial = String(profile?.name || "C")
    .trim()
    .slice(0, 1)
    .toUpperCase();

  const isInactive = profile?.status === "INACTIVE";

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <div className="mx-auto max-w-[1450px] px-4 py-8 md:px-6">
          <div className="rounded-[32px] border border-zinc-200 bg-white px-6 py-20 text-center shadow-sm">
            <div className="inline-flex items-center gap-3 text-sm font-semibold text-zinc-800">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading consultant details...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <div className="mx-auto max-w-[1450px] px-4 py-8 md:px-6">
          <div className="mb-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm hover:bg-zinc-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          </div>

          <div className="rounded-[32px] border border-rose-200 bg-rose-50 px-6 py-14 text-center shadow-sm">
            <div className="text-lg font-semibold text-rose-800">
              {error || "Consultant details not found"}
            </div>
            <button
              onClick={() => fetchProfile()}
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
            >
              <RotateCcw className="h-4 w-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
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

      <div className="mx-auto max-w-[1450px] px-4 py-6 md:px-6">
        <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 font-semibold text-zinc-800 shadow-sm hover:bg-zinc-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <ChevronRight className="h-4 w-4" />
          <span>Consultants</span>
          <ChevronRight className="h-4 w-4" />
          <span>All Consultants</span>
          <ChevronRight className="h-4 w-4" />
          <span className="font-semibold text-zinc-900">Consultant Details</span>
        </div>

        <div className="rounded-[34px] border border-zinc-200 bg-white shadow-[0_18px_45px_rgba(0,0,0,0.06)]">
          <div className="border-b border-zinc-100 bg-white px-5 py-5 md:px-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-sm">
                    {profile?.logoUrl ? (
                      <img
                        src={profile.logoUrl}
                        alt={profile.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-2xl font-black text-zinc-700">
                        {String(profile?.name || "C").trim().slice(0, 1).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-xl font-bold tracking-tight text-zinc-900 md:text-2xl">
                      {profile?.name || "Consultant"}
                    </h1>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Pill tone={profile?.tierTone || "slate"}>
                        Tier: {profile?.tierTitle || "—"}
                      </Pill>

                      <Pill tone={profile?.verifiedTone || "slate"}>
                        <CheckCircle2 size={14} />
                        Verification: {profile?.verification === "VERIFIED"
                          ? "Verified"
                          : safe(profile?.verification)}
                      </Pill>

                      <Pill tone={profile?.statusTone || "slate"}>
                        Status: {profile?.status || "—"}
                      </Pill>

                      <Pill tone="amber">
                        <AlertTriangle className="h-3 w-3" />
                        Risk: {profile?.risk || "Low"}
                      </Pill>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Three Dot Menu for All Actions */}
                  <div className="relative">
                    <button
                      onClick={() => setActionModal({ ...actionModal, menuOpen: !actionModal.menuOpen })}
                      className="inline-flex cursor-pointer h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-500 shadow-sm transition hover:bg-zinc-50 hover:text-zinc-900"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>

                    {actionModal.menuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setActionModal({ ...actionModal, menuOpen: false })}
                        />
                        <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-xl border border-zinc-200 bg-white p-1.5 shadow-xl">
                          {/* KYC Actions */}
                          <button
                            onClick={() => openKycModal("approve")}
                            disabled={kycActionLoading === "approve"}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            {kycActionLoading === "approve" ? "Approving..." : "Approve KYC"}
                          </button>

                          <button
                            onClick={() => openKycModal("reject")}
                            disabled={kycActionLoading === "reject"}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-rose-700 transition-colors hover:bg-rose-50"
                          >
                            <XCircle className="h-4 w-4" />
                            {kycActionLoading === "reject" ? "Rejecting..." : "Reject KYC"}
                          </button>

                          <button
                            onClick={() => openKycModal("request")}
                            disabled={kycActionLoading === "request"}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-amber-700 transition-colors hover:bg-amber-50"
                          >
                            <RotateCcw className="h-4 w-4" />
                            {kycActionLoading === "request" ? "Requesting..." : "Request Re-upload"}
                          </button>

                          {/* Show admin actions only if verification is not REQUESTED */}
                          {profile?.verification !== "REQUESTED" && (
                            <>
                              <div className="my-1 border-t border-zinc-100" />

                              {/* Other Actions */}
                              <button
                                onClick={() => {
                                  setActionModal({ open: true, type: "penalty", menuOpen: false });
                                }}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-blue-700 transition-colors hover:bg-blue-50"
                              >
                                <AlertTriangle className="h-4 w-4" />
                                Apply Penalty
                              </button>

                              <button
                                onClick={() => {
                                  setActionModal({ open: true, type: "changeTier", menuOpen: false });
                                }}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-sky-700 transition-colors hover:bg-sky-50"
                              >
                                <BadgeCheck className="h-4 w-4" />
                                Change Tier
                              </button>

                              <button
                                onClick={() => {
                                  setActionModal({ open: true, type: "flagReview", menuOpen: false });
                                }}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-amber-700 transition-colors hover:bg-amber-50"
                              >
                                <ShieldAlert className="h-4 w-4" />
                                Flag Review
                              </button>

                              <button
                                onClick={() => {
                                  setActionModal({ open: true, type: "forceAudit", menuOpen: false });
                                }}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-violet-700 transition-colors hover:bg-violet-50"
                              >
                                <Activity className="h-4 w-4" />
                                Force Audit
                              </button>

                              <button
                                onClick={() => {
                                  setActionModal({ open: true, type: "addNote", menuOpen: false });
                                }}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-50"
                              >
                                <NotebookPen className="h-4 w-4" />
                                Add Internal Note
                              </button>

                              <div className="my-1 border-t border-zinc-100" />

                              {/* Suspend/Unsuspend */}
                              {isInactive ? (
                                <button
                                  onClick={() => {
                                    setActionModal({ open: true, type: "unsuspend", menuOpen: false });
                                  }}
                                  disabled={actionLoading}
                                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
                                >
                                  <RotateCcw className="h-4 w-4" />
                                  {actionLoading ? "Unsuspending..." : "Unsuspend"}
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setActionModal({ open: true, type: "suspend", menuOpen: false });
                                  }}
                                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-rose-700 transition-colors hover:bg-rose-50"
                                >
                                  <Ban className="h-4 w-4" />
                                  Suspend
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {profile?.verification !== "REQUESTED" && (
                <div className="grid grid-cols-2 gap-3 border-t border-zinc-100 pt-4 md:grid-cols-3 lg:grid-cols-5">
                  <StatItem label="Total Vehicles" value={safe(profile?.totalVehicles)} />
                  <StatItem label="Active Vehicles" value={safe(profile?.totalActiveVehicles)} />
                  <StatItem label="Total Sold" value={safe(profile?.totalSoldVehicles)} />
                  <StatItem label="30d Conversion" value={safe(profile?.conversions)} />
                  <StatItem label="30d Inquiries" value={safe(profile?.totalInquiries)} />
                  <StatItem label="Avg Response" value={safe(profile?.responseTime)} />
                  <StatItem label="Avg Rating" value={safe(profile?.avgRating)} />
                  <StatItem label="Total Reviews" value={safe(profile?.totalReviews)} />
                  <StatItem label="Total Followers" value={safe(profile?.totalFollowers)} />
                </div>
              )}
            </div>
          </div>

          <div className="border-b border-zinc-100 bg-white px-3 py-3 md:px-4">
            <div className="flex gap-2 overflow-x-auto">
              {[
                "Overview",
                "Inventory",
                "Ranking Breakdown",
                "Financial",
                "Complaints",
                "Activity Logs",
              ]
                .filter((tab) => {
                  // Hide Inventory tab when verification is REQUESTED
                  if ((tab === "Inventory" || tab === "Ranking Breakdown" || tab === "Financial" || tab === "Complaints") && profile?.verification === "REQUESTED") {
                    return false;
                  }
                  return true;
                })
                .map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cls(
                      "whitespace-nowrap rounded-2xl px-4 py-2.5 text-sm font-semibold transition",
                      activeTab === tab
                        ? "bg-zinc-900 text-white shadow-sm"
                        : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                    )}
                  >
                    {tab}
                  </button>
                ))}
            </div>
          </div>
        </div>

        <div className="space-y-5 py-5 md:py-6 px-0">
          {activeTab === "Overview" && (
            <div className="space-y-5">
              <SectionCard title="Business Details" subtitle="Core business information">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <InfoItem label="Business Name" value={profile.name} />
                  <InfoItem label="Owner Name" value={profile.ownerName} />
                  <InfoItem label="Username" value={profile.username} />
                  <InfoItem label="Establishment Year" value={profile.establishmentYear} />
                  <InfoItem label="Contact Number" value={profile.phone} />
                  <InfoItem label="Email" value={profile.email} />
                  <InfoItem label="GST Number" value={profile.gstNumber} />
                  <InfoItem label="PAN Number" value={profile.panCardNumber} />
                  <InfoItem label="Aadhar Number" value={profile.aadharCardNumber} />
                  <InfoItem label="City" value={profile.location} />
                  <InfoItem label="Address" value={profile.address} full />
                </div>
              </SectionCard>

              <SectionCard title="Tier & Subscription" subtitle="Subscription plan details">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <InfoItem label="Current Tier" value={profile.tierTitle} />
                  <InfoItem
                    label="Tier Start Date"
                    value={profile.tierStartDate ? new Date(profile.tierStartDate).toLocaleDateString("en-IN") : "—"}
                  />
                  <InfoItem
                    label="Tier End Date"
                    value={profile.tierEndDate ? new Date(profile.tierEndDate).toLocaleDateString("en-IN") : "—"}
                  />
                  <InfoItem
                    label="Vehicle Types"
                    value={profile.vehicleTypes.length > 0 ? formatEnumLabel(profile.vehicleTypes.join(", ")) : "—"}
                  />
                  <InfoItem
                    label="Services"
                    value={profile.services.length > 0 ? profile.services.join(", ") : "—"}
                  />
                </div>
              </SectionCard>

              <SectionCard title="KYC Documents" subtitle="Verification documents">
                <div className="flex flex-wrap gap-2">
                  <DocChip
                    ok={!!profile.gstCertificateUrl}
                    clickable={!!profile.gstCertificateUrl}
                    onClick={() =>
                      openDocModal("GST Certificate", profile.gstCertificateUrl)
                    }
                    text={`GST Certificate • ${profile.gstCertificateUrl ? "Click to View" : "Missing"}`}
                  />

                  <DocChip
                    ok={!!profile.panCardFrontUrl}
                    clickable={!!profile.panCardFrontUrl}
                    onClick={() =>
                      openDocModal("PAN Card", profile.panCardFrontUrl)
                    }
                    text={`PAN Card • ${profile.panCardFrontUrl ? "Click to View" : "Missing"}`}
                  />

                  <DocChip
                    ok={!!profile.aadharCardFrontUrl}
                    clickable={!!profile.aadharCardFrontUrl}
                    onClick={() =>
                      openDocModal("Aadhar Card (Front)", profile.aadharCardFrontUrl)
                    }
                    text={`Aadhar Front • ${profile.aadharCardFrontUrl ? "Click to View" : "Missing"}`}
                  />

                  <DocChip
                    ok={!!profile.aadharCardBackUrl}
                    clickable={!!profile.aadharCardBackUrl}
                    onClick={() =>
                      openDocModal("Aadhar Card (Back)", profile.aadharCardBackUrl)
                    }
                    text={`Aadhar Back • ${profile.aadharCardBackUrl ? "Click to View" : "Missing"}`}
                  />

                  <DocChip
                    ok={!!profile.addressVerifiedStatus}
                    text={`Address Proof${profile.verification === "REQUESTED"
                        ? ""
                        : ` • ${profile.addressVerifiedStatus ? "Verified" : "Pending"}`
                      }`}
                  />
                </div>
              </SectionCard>

              <div className="rounded-[28px] border border-zinc-200 bg-white shadow-sm">
                <div className="border-b border-zinc-100 px-5 py-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-zinc-900">Consultant Branding</h3>
                    <p className="text-sm text-zinc-500">Logo and banner images</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {profile?.logoUrl && (
                      <button
                        onClick={() => {
                          setPreviewImage(profile.logoUrl);
                          setPreviewTitle("Consultant Logo");
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-all hover:bg-zinc-50 active:scale-95"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Preview Logo
                      </button>
                    )}
                    {profile?.bannerUrl && (
                      <button
                        onClick={() => {
                          setPreviewImage(profile.bannerUrl);
                          setPreviewTitle("Consultant Banner");
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-all hover:bg-zinc-50 active:scale-95"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Preview Banner
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-5">
                  <div className="relative h-48 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100">
                    {profile?.bannerUrl ? (
                      <img
                        src={profile.bannerUrl}
                        alt="Banner"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-zinc-200 to-zinc-100" />
                    )}

                    {profile?.logoUrl && (
                      <div className="absolute left-6 top-1/2 -translate-y-1/2">
                        <div className="h-24 w-24 rounded-2xl border-4 border-white bg-white shadow-2xl overflow-hidden">
                          <img
                            src={profile.logoUrl}
                            alt="Logo"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Inventory" && (
            <div className="space-y-5">
              {/* Search Bar and Filter */}
              <div className="rounded-[28px] border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Search by vehicle name..."
                      value={inventorySearch}
                      onChange={(e) => setInventorySearch(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 outline-none transition focus:border-blue-500"
                    />
                  </div>
                  <div className="relative sm:w-56">
                    <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <select
                      value={inventoryStatusFilter}
                      onChange={(e) => setInventoryStatusFilter(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-10 text-sm text-zinc-900 outline-none transition focus:border-blue-500 cursor-pointer"
                    >
                      <option value="ALL">All Status</option>
                      <option value="REQUESTED">Requested</option>
                      <option value="REQUEST_CHANGES">Request Changes</option>
                      <option value="VERIFIED">Verified</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                    <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-zinc-400" />
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="rounded-[28px] border border-zinc-200 bg-white shadow-sm overflow-hidden">
                <div className="border-b border-zinc-100 px-5 py-4">
                  <h3 className="text-base font-semibold text-zinc-900">Vehicle Inventory</h3>
                  <p className="text-sm text-zinc-500">{filteredVehicles.length} vehicles found</p>
                </div>

                {paginatedVehicles.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-zinc-50">
                          <tr>
                            <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-zinc-600">Vehicle</th>
                            <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-zinc-600">Price</th>
                            <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-zinc-600">Verification</th>
                            <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-zinc-600">Inspection</th>
                            <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-zinc-600">Status</th>
                            <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-zinc-600">Listed Date</th>
                            <th className="px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-zinc-600">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                          {paginatedVehicles.map((vehicle) => (
                            <tr key={vehicle.vehicleId} className="transition-colors hover:bg-zinc-50">
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
                                    {vehicle.thumbnailUrl ? (
                                      <img
                                        src={vehicle.thumbnailUrl}
                                        alt={vehicle.vehicleTitle}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <div className="flex h-full w-full items-center justify-center text-zinc-400">
                                        <ImageIcon className="h-5 w-5" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-sm font-semibold text-zinc-900 line-clamp-1">
                                      {vehicle.vehicleTitle}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-4">
                                <div className="text-sm font-bold text-emerald-600">
                                  ₹{Number(vehicle.price).toLocaleString('en-IN')}
                                </div>
                              </td>
                              <td className="px-5 py-4">
                                <span
                                  className={cls(
                                    "inline-flex rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider",
                                    vehicle.verificationStatus === "VERIFIED"
                                      ? "bg-emerald-50 text-emerald-700"
                                      : vehicle.verificationStatus === "REJECTED"
                                        ? "bg-rose-50 text-rose-700"
                                        : "bg-amber-50 text-amber-700"
                                  )}
                                >
                                  {vehicle.verificationStatus}
                                </span>
                              </td>
                              <td className="px-5 py-4">
                                <span
                                  className={cls(
                                    "inline-flex rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider",
                                    vehicle.inspectionStatus === "AI_INSPECTED" || vehicle.inspectionStatus === "MANUAL_INSPECTED"
                                      ? "bg-blue-50 text-blue-700"
                                      : "bg-zinc-100 text-zinc-700"
                                  )}
                                >
                                  {vehicle.inspectionStatus?.replace(/_/g, ' ')}
                                </span>
                              </td>
                              <td className="px-5 py-4">
                                {vehicle.isVehicleSold ? (
                                  <span className="inline-flex rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700">
                                    SOLD
                                  </span>
                                ) : (
                                  <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                                    ACTIVE
                                  </span>
                                )}
                              </td>
                              <td className="px-5 py-4">
                                <div className="text-sm text-zinc-600">
                                  {new Date(vehicle.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </div>
                              </td>
                              <td className="px-5 py-4 text-center">
                                <button
                                  onClick={() => navigate(`/admin/vehicles/${vehicle.vehicleId}`)}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition-all hover:bg-zinc-50 hover:text-zinc-900"
                                  title="View Vehicle Details"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="border-t border-zinc-100 bg-zinc-50 px-5 py-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-zinc-600">
                          Page {inventoryPage} / {totalVehiclePages} • {filteredVehicles.length} total records
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setInventoryPage(p => Math.max(1, p - 1))}
                            disabled={inventoryPage === 1}
                            className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <ChevronLeft className="h-4 w-4" />
                            Prev
                          </button>
                          <button
                            onClick={() => setInventoryPage(p => Math.min(totalVehiclePages, p + 1))}
                            disabled={inventoryPage === totalVehiclePages}
                            className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Next
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-12 text-center">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 mb-3">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                    <div className="text-sm font-semibold text-zinc-500">
                      {inventorySearch ? "No vehicles match your search" : "No vehicles found"}
                    </div>
                    <p className="mt-1 text-xs text-zinc-400">
                      {inventorySearch ? "Try a different search term" : "This consultant hasn't listed any vehicles yet"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "Ranking Breakdown" && (
            <SectionCard title="Ranking Details" subtitle="Consultant ranking information">
              <div className="py-12 text-center">
                <div className="text-sm font-semibold text-zinc-500">Ranking data not available</div>
              </div>
            </SectionCard>
          )}

          {activeTab === "Financial" && (
            <SectionCard title="Financial Information" subtitle="Payment and transaction history">
              <div className="py-12 text-center">
                <div className="text-sm font-semibold text-zinc-500">Financial data not available</div>
              </div>
            </SectionCard>
          )}

          {activeTab === "Complaints" && (
            <SectionCard title="Complaints & Issues" subtitle={`${profile?.flagReviews?.length || 0} complaints found`}>
              {profile?.flagReviews && profile.flagReviews.length > 0 ? (
                <div className="space-y-3">
                  {profile.flagReviews.map((flag) => (
                    <div
                      key={flag.id}
                      className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
                    >
                      <div className="text-sm font-semibold text-zinc-900">{flag.reason || "Complaint"}</div>
                      <div className="mt-1 text-xs text-zinc-500">{flag.createdAt}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="text-sm font-semibold text-zinc-500">No complaints found</div>
                </div>
              )}
            </SectionCard>
          )}

          {activeTab === "Activity Logs" && (
            <SectionCard title="Activity Logs" subtitle={`${profile?.activityLogs?.length || 0} logs found`}>
              {profile?.activityLogs && profile.activityLogs.length > 0 ? (
                <div className="space-y-4">
                  {profile.activityLogs.map((log, index) => (
                    <div
                      key={log.activityId}
                      className="relative rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
                    >
                      {index !== profile.activityLogs.length - 1 && (
                        <div className="absolute left-[38px] top-[72px] h-[calc(100%+16px)] w-0.5 bg-zinc-200" />
                      )}

                      <div className="flex items-start gap-4">
                        <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/20">
                          <Activity className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="mb-2 flex items-start justify-between gap-4">
                            <div>
                              <h4 className="text-base font-bold text-zinc-900">{log.action}</h4>
                              <p className="mt-1 text-sm text-zinc-600">{log.description}</p>
                            </div>
                            <div className="shrink-0 text-right">
                              <div className="flex items-center gap-1 text-xs font-semibold text-zinc-400">
                                <Clock3 className="h-3.5 w-3.5" />
                                {new Date(log.performedAt).toLocaleString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                              <p className="mt-1 text-xs font-semibold text-zinc-600">by {log.adminName}</p>
                            </div>
                          </div>

                          <div className="mt-3 rounded-xl bg-zinc-50 p-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">Additional Details</p>
                            <div className="space-y-2">
                              <div className="flex items-start gap-2">
                                <span className="text-xs font-semibold text-zinc-500 min-w-[100px]">Admin:</span>
                                <span className="text-xs text-zinc-700">{log.adminName}</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-xs font-semibold text-zinc-500 min-w-[100px]">Action:</span>
                                <span className="text-xs text-zinc-700">{log.action}</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-xs font-semibold text-zinc-500 min-w-[100px]">Description:</span>
                                <span className="text-xs text-zinc-700">{log.description}</span>
                              </div>
                              {log.remarks && log.remarks !== "-" && (
                                <div className="flex items-start gap-2">
                                  <span className="text-xs font-semibold text-zinc-500 min-w-[100px]">Remarks:</span>
                                  <span className="text-xs text-zinc-700">{log.remarks}</span>
                                </div>
                              )}
                              <div className="flex items-start gap-2">
                                <span className="text-xs font-semibold text-zinc-500 min-w-[100px]">Performed At:</span>
                                <span className="text-xs text-zinc-700">
                                  {new Date(log.performedAt).toLocaleString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="text-sm font-semibold text-zinc-500">No activity logs found</div>
                </div>
              )}
            </SectionCard>
          )}
        </div>
      </div >

      <DocumentImageModal
        open={docModal.open}
        onClose={closeDocModal}
        title={docModal.title}
        imageUrl={docModal.imageUrl}
      />

      <UnsuspendConsultantModal
        open={actionModal.open && actionModal.type === "unsuspend"}
        consultantName={profile?.name}
        value={reasonText}
        setValue={setReasonText}
        loading={actionLoading}
        onClose={closeActionModal}
        onConfirm={handleUnsuspend}
      />

      <ActionRemarkModal
        open={actionModal.open && actionModal.type === "approve"}
        title="Approve KYC"
        label="Remark"
        value={remarkText}
        setValue={setRemarkText}
        confirmText="Approve KYC"
        loading={kycActionLoading === "approve"}
        onClose={closeActionModal}
        onConfirm={handleApproveKYC}
        placeholder="Enter remark for approving KYC..."
        isApproval={true}
        consultantName={profile?.name}
      />

      <RejectKYCModal
        open={actionModal.open && actionModal.type === "reject"}
        consultantName={profile?.name}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        rejectionReasonText={rejectionReasonText}
        setRejectionReasonText={setRejectionReasonText}
        loading={kycActionLoading === "reject"}
        onClose={closeActionModal}
        onConfirm={handleRejectKYC}
      />

      <RequestReuploadModal
        open={actionModal.open && actionModal.type === "request"}
        consultantName={profile?.name}
        value={remarkText}
        setValue={setRemarkText}
        loading={kycActionLoading === "request"}
        onClose={closeActionModal}
        onConfirm={handleRequestUploadKYC}
      />

      <PenaltyActionModal
        open={actionModal.open && actionModal.type === "penalty"}
        consultantName={profile?.name}
        deduction={penaltyDeduction}
        setDeduction={setPenaltyDeduction}
        reason={penaltyReason}
        setReason={setPenaltyReason}
        confirmText="Apply Penalty"
        loading={actionLoading}
        onClose={closeActionModal}
        onConfirm={handleApplyPenalty}
      />

      <SuspendConsultantModal
        open={actionModal.open && actionModal.type === "suspend"}
        consultantName={profile?.name}
        suspendReason={suspendReason}
        setSuspendReason={setSuspendReason}
        suspendType={suspendType}
        setSuspendType={setSuspendType}
        suspendUntil={suspendUntil}
        setSuspendUntil={setSuspendUntil}
        loading={actionLoading}
        onClose={closeActionModal}
        onConfirm={handleSuspendConsultant}
      />

      <ChangeTierModal
        open={actionModal.open && actionModal.type === "changeTier"}
        consultantName={profile?.name}
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
        onClose={closeActionModal}
        onConfirm={handleChangeTierConfirm}
      />

      <FlagReviewModal
        open={actionModal.open && actionModal.type === "flagReview"}
        consultantName={profile?.name}
        flagCategory={flagCategory}
        setFlagCategory={setFlagCategory}
        flagSeverity={flagSeverity}
        setFlagSeverity={setFlagSeverity}
        flagNotes={flagNotes}
        setFlagNotes={setFlagNotes}
        loading={actionLoading}
        onClose={closeActionModal}
        onConfirm={handleFlagReviewConfirm}
      />

      <ForceAuditModal
        open={actionModal.open && actionModal.type === "forceAudit"}
        consultantName={profile?.name}
        auditType={auditType}
        setAuditType={setAuditType}
        auditReason={auditReason}
        setAuditReason={setAuditReason}
        loading={actionLoading}
        onClose={closeActionModal}
        onConfirm={handleForceAuditConfirm}
      />

      <AddNoteModal
        open={actionModal.open && actionModal.type === "addNote"}
        consultantName={profile?.name}
        noteText={noteText}
        setNoteText={setNoteText}
        loading={actionLoading}
        onClose={closeActionModal}
        onConfirm={handleAddNoteConfirm}
      />

      {
        previewImage && (
          <ImagePreviewModal
            imageUrl={previewImage}
            title={previewTitle}
            onClose={() => {
              setPreviewImage(null);
              setPreviewTitle("");
            }}
          />
        )
      }
    </div >
  );
};

/* ================= CHANGE TIER MODAL ================= */
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
              <p className="mt-2 text-xs text-zinc-500">Maximum 100%</p>
            </div>

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
              <p className="mt-2 text-xs text-zinc-500">Override tier price with custom amount</p>
            </div>

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
              <p className="mt-2 text-xs text-zinc-500">Minimum 5 characters required</p>
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

/* ================= FLAG REVIEW MODAL ================= */
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
              <p className="mt-2 text-xs text-zinc-500">Minimum 10 characters required</p>
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

/* ================= FORCE AUDIT MODAL ================= */
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
              <p className="mt-2 text-xs text-zinc-500">Minimum 10 characters required</p>
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

/* ================= ADD NOTE MODAL ================= */
function AddNoteModal({
  open,
  consultantName,
  noteText,
  setNoteText,
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
          <div className="mb-6 rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3">
            <p className="text-sm font-semibold text-slate-700">
              This note will be visible only to admin team members.
            </p>
          </div>

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
              disabled={loading || !noteText.trim()}
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

function ImagePreviewModal({ imageUrl, title, onClose }) {
  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-6xl max-h-[90vh] w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl">
          <img
            src={imageUrl}
            alt={title}
            className="max-h-[80vh] w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default ConsultantProfile;