import React from "react";
import { X, Trash2, Loader2 } from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

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

const ModalShell = ({
  open,
  title,
  subtitle,
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
      <div className="w-full max-w-[820px] max-h-[90vh] bg-white border border-gray-200 rounded-2xl shadow-[0_30px_90px_-50px_rgba(2,6,23,0.55)] overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-gray-200 flex items-start justify-between bg-white">
          <div>
            <h3 className="text-[15px] font-extrabold text-gray-900 leading-tight">
              {title}
            </h3>
            {subtitle ? (
              <p className="text-[12px] text-gray-500 mt-0.5">{subtitle}</p>
            ) : null}
          </div>

          <button
            onClick={() => !lockClose && onClose?.()}
            className={cls(
              "w-9 h-9 rounded-xl border transition flex items-center justify-center",
              lockClose
                ? "opacity-50 cursor-not-allowed border-transparent"
                : "hover:bg-gray-50 border-transparent hover:border-gray-200"
            )}
            type="button"
            disabled={lockClose}
            aria-label="Close"
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

const TierLimitsModal = ({
  open,
  tierTitle,
  limits = [],
  loading,
  deletingId,
  onClose,
  onAdd,
  onDelete,
}) => {
  const lockClose = !!loading || !!deletingId;

  return (
    <ModalShell
      open={open}
      title="Manage Tier Limits"
      subtitle={
        tierTitle
          ? `Tier: ${tierTitle} — define and manage the limits for this tier plan.`
          : "Tier limits"
      }
      onClose={onClose}
      lockClose={lockClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={lockClose} type="button">
            Close
          </Button>
          <Button onClick={onAdd} disabled={lockClose} type="button">
            Add Limits
          </Button>
        </>
      }
    >
      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 flex items-center gap-3">
          <Loader2 className="animate-spin" size={18} />
          <p className="text-sm font-semibold text-gray-700">Loading limits...</p>
        </div>
      ) : limits.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <p className="text-sm font-semibold text-gray-800">No limits found.</p>
          <p className="text-xs text-gray-500 mt-1">Click “Add Limits” to create.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {limits.map((l) => {
            const id = safeId(l);
            const busy = deletingId === id;

            return (
              <div
                key={id || l?.limitsName}
                className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-extrabold text-gray-900">
                    {l?.limitsName || "—"}
                  </p>
                  <p className="text-[12px] text-gray-500 mt-0.5">
                    ID: <span className="font-semibold">{id || "—"}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-full border text-xs font-extrabold bg-gray-50 border-gray-200 text-gray-900">
                    {String(l?.limitsValue ?? "—")}
                  </span>

                  <button
                    type="button"
                    disabled={busy || loading}
                    onClick={() => onDelete?.(l)}
                    className="w-9 h-9 rounded-xl border border-rose-200 hover:bg-rose-50 flex items-center justify-center disabled:opacity-60"
                    title="Delete limit"
                  >
                    {busy ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} className="text-rose-700" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </ModalShell>
  );
};

export default TierLimitsModal;