import React from "react";
import { Pencil, X, Loader2 } from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

/* ================= BUTTON ================= */
const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const styles = {
    primary:
      "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 shadow-sm",
    secondary:
      "bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-200",
    danger: "bg-rose-600 text-white hover:bg-rose-700",
  };
  return (
    <button
      {...props}
      className={cls(
        "px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]",
        styles[variant] || styles.primary,
        className
      )}
    >
      {children}
    </button>
  );
};

/* ================= MODAL SHELL ================= */
const ModalShell = ({
  open,
  title,
  subtitle,
  icon: Icon,
  onClose,
  children,
  footer,
  lockClose = false,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (lockClose) return;
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="w-full max-w-[700px] max-h-[90vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
              <Icon size={24} />
            </div>
            <div className="min-w-0">
              <h3 className="text-xl font-extrabold text-slate-900 leading-tight tracking-tight">
                {title}
              </h3>
              {subtitle ? (
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">{subtitle}</p>
              ) : null}
            </div>
          </div>

          <button
            onClick={() => !lockClose && onClose?.()}
            className={cls(
              "w-10 h-10 rounded-xl border-2 transition-all flex items-center justify-center",
              lockClose
                ? "opacity-50 cursor-not-allowed border-slate-200 bg-slate-50"
                : "hover:bg-slate-50 border-slate-200 hover:border-slate-300 active:scale-95"
            )}
            aria-label="Close"
            type="button"
            disabled={lockClose}
          >
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 overflow-y-auto flex-1 bg-slate-50/30">{children}</div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 bg-white">
          {footer}
        </div>
      </div>
    </div>
  );
};

const safeId = (obj) => obj?.id || obj?._id;

const EditFeatureModal = ({
  open,
  selectedFeature,
  editForm,
  setEditForm,
  editValid,
  savingEdit,
  onClose,
  onUpdate,
  onCancel,
}) => {
  const lockClose = !!savingEdit;

  return (
    <ModalShell
      open={open}
      icon={Pencil}
      title="Edit Tier Feature"
      subtitle=""
      onClose={onClose}
      lockClose={lockClose}
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={lockClose}
            type="button"
          >
            Cancel
          </Button>

          <Button
            onClick={onUpdate}
            disabled={!editValid || lockClose}
            type="button"
          >
            {savingEdit ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="animate-spin" size={16} /> Updating...
              </span>
            ) : (
              "Update Feature"
            )}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Feature Info Card */}
        <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50/50 p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <p className="text-lg font-extrabold text-slate-900 mb-1">
                {selectedFeature?.featureName || "Feature"}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                Feature ID:{" "}
                <span className="font-bold text-slate-700">{safeId(selectedFeature) || "—"}</span>
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm">
              <Pencil size={18} />
            </div>
          </div>
        </div>

        {/* Feature Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Feature Name *
          </label>
          <input
            value={editForm.featureName}
            onChange={(e) =>
              setEditForm((p) => ({ ...p, featureName: e.target.value }))
            }
            className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-semibold text-slate-900 transition-all placeholder:text-slate-400"
            placeholder="e.g., Advanced Analytics Dashboard"
            disabled={lockClose}
          />
        </div>

        {/* Feature Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Feature Description *
          </label>
          <textarea
            value={editForm.featureDescription}
            onChange={(e) =>
              setEditForm((p) => ({ ...p, featureDescription: e.target.value }))
            }
            className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400 resize-none"
            placeholder="e.g., Provides detailed insights about listing performance and user engagement"
            rows={4}
            disabled={lockClose}
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Status
          </label>
          <select
            value={editForm.status}
            onChange={(e) =>
              setEditForm((p) => ({ ...p, status: e.target.value }))
            }
            className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-semibold text-slate-900 transition-all"
            disabled={lockClose}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="DELETED">DELETED</option>
          </select>

          {/* <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
            <p className="text-xs text-amber-800 leading-relaxed">
              <span className="font-bold">Note:</span> If you choose{" "}
              <span className="font-extrabold">DELETED</span>, backend may treat it as soft-delete.
            </p>
          </div> */}
        </div>
      </div>
    </ModalShell>
  );
};

export default EditFeatureModal;