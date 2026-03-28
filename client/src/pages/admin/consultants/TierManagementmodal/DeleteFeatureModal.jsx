import React from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

/* ================= BUTTON ================= */
const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const styles = {
    primary:
      "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90",
    secondary:
      "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200",
    danger: "bg-rose-600 text-white hover:bg-rose-700",
  };
  return (
    <button
      {...props}
      className={cls(
        "px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed",
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
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px] flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (lockClose) return;
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="w-full max-w-[620px] max-h-[90vh] bg-white border border-gray-200 rounded-2xl shadow-[0_30px_90px_-50px_rgba(2,6,23,0.55)] overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-gray-200 flex items-start justify-between bg-white">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center">
              <Icon size={18} className="text-rose-700" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[15px] font-extrabold text-gray-900 leading-tight">
                {title}
              </h3>
              {subtitle ? (
                <p className="text-[12px] text-gray-500 mt-0.5">{subtitle}</p>
              ) : null}
            </div>
          </div>

          <button
            onClick={() => !lockClose && onClose?.()}
            className={cls(
              "w-9 h-9 rounded-xl border transition flex items-center justify-center",
              lockClose
                ? "opacity-50 cursor-not-allowed border-transparent"
                : "hover:bg-gray-50 border-transparent hover:border-gray-200"
            )}
            aria-label="Close"
            type="button"
            disabled={lockClose}
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="px-5 py-4 overflow-y-auto flex-1">{children}</div>

        <div className="px-5 py-4 border-t border-gray-200 flex items-center justify-end gap-3 bg-white">
          {footer}
        </div>
      </div>
    </div>
  );
};

const safeId = (obj) => obj?.id || obj?._id;

const DeleteFeatureModal = ({
  open,
  selectedFeature,
  deleting,
  onClose,
  onDelete,
  onCancel,
}) => {
  const lockClose = !!deleting;

  return (
    <ModalShell
      open={open}
      icon={AlertTriangle}
      title="Delete Feature"
      subtitle="DELETE /api/tier-plan-features/{tierFeaturesID}"
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
            variant="danger"
            onClick={onDelete}
            disabled={lockClose}
            type="button"
          >
            {deleting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="animate-spin" size={16} /> Deleting...
              </span>
            ) : (
              "Delete"
            )}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-rose-200 flex items-center justify-center">
              <AlertTriangle className="text-rose-700" size={18} />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-extrabold text-gray-900">
                This action cannot be undone.
              </p>
              <p className="text-[12px] text-gray-700 mt-1">
                You are deleting:{" "}
                <span className="font-extrabold">
                  {selectedFeature?.featureName || "Feature"}
                </span>
              </p>
              <p className="text-[12px] text-gray-600 mt-1">
                Feature ID:{" "}
                <span className="font-semibold">{safeId(selectedFeature) || "—"}</span>
              </p>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600">
          If your backend supports soft delete via status, use Edit → Status =
          <span className="font-semibold"> DELETED</span>. Otherwise this will
          permanently delete.
        </p>
      </div>
    </ModalShell>
  );
};

export default DeleteFeatureModal;