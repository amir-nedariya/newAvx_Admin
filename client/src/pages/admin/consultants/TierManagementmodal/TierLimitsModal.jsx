import React from "react";
import { X, Trash2, Loader2, Shield } from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

// Enum mapping for limit names to human-readable labels
const LIMIT_NAME_MAP = {
  MAX_FREE_INSPECTION: "Max Free Inspections",
  STORE_IMAGE_UPLOAD: "Store Image Upload",
  MAX_VEHICLE_ON_MARKET_PLACE: "Max Vehicles on Marketplace",
  MAX_ACTIVE_LISTINGS: "Max Active Listings",
  FEATURED_LISTING: "Featured Listing",
  PRIORITY_SUPPORT: "Priority Support",
  ANALYTICS_ACCESS: "Analytics Access",
  CUSTOM_BRANDING: "Custom Branding",
  API_ACCESS: "API Access",
  BULK_UPLOAD: "Bulk Upload",
  ADVANCED_FILTERS: "Advanced Filters",
  EXPORT_DATA: "Export Data",
};

// Helper to format limit names
const formatLimitName = (name) => {
  if (!name) return "—";
  return LIMIT_NAME_MAP[name] || name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

// Helper to format limit values with appropriate styling
const formatLimitValue = (value) => {
  const val = String(value ?? "—").toLowerCase();

  if (val === "true") {
    return {
      display: "Enabled",
      className: "bg-emerald-100 text-emerald-700 border-emerald-200",
    };
  }

  if (val === "false") {
    return {
      display: "Disabled",
      className: "bg-rose-100 text-rose-700 border-rose-200",
    };
  }

  // Numeric values
  if (!isNaN(val) && val !== "") {
    return {
      display: value,
      className: "bg-slate-900 text-white border-slate-900",
    };
  }

  return {
    display: value ?? "—",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  };
};

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
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (lockClose) return;
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="w-full max-w-[900px] max-h-[90vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
              <Shield size={20} />
            </div>
            <div>
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
            type="button"
            disabled={lockClose}
            aria-label="Close"
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
          <Button
            onClick={() => {
              onAdd(); // Open Add Limits modal (don't close this modal first)
            }}
            disabled={lockClose}
            type="button"
          >
            Add Limits
          </Button>
        </>
      }
    >
      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 flex items-center justify-center gap-3 shadow-sm">
          <Loader2 className="animate-spin text-slate-600" size={20} />
          <p className="text-sm font-semibold text-slate-700">Loading limits...</p>
        </div>
      ) : limits.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <Shield className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-base font-bold text-slate-900">No limits configured</p>
          <p className="text-sm text-slate-500 mt-1">Click "Add Limits" to create your first limit.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {limits.map((l) => {
            const id = safeId(l);
            const busy = deletingId === id;
            const formattedValue = formatLimitValue(l?.limitsValue);
            const displayName = formatLimitName(l?.limitsName);

            return (
              <div
                key={id || l?.limitsName}
                className="group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white transition-all hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex items-center justify-between px-5 py-4">
                  {/* Left: Limit Name and ID */}
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-extrabold text-slate-900 tracking-tight">
                      {displayName}
                    </p>
                    {/* <p className="text-xs text-slate-400 mt-1 font-mono">
                      ID: <span className="font-semibold text-slate-500">{id || "—"}</span>
                    </p> */}
                  </div>

                  {/* Right: Value Badge and Delete Button */}
                  <div className="flex items-center gap-3">
                    <span className={cls(
                      "px-4 py-2 rounded-xl border-2 text-sm font-extrabold shadow-sm",
                      formattedValue.className
                    )}>
                      {formattedValue.display}
                    </span>

                    <button
                      type="button"
                      disabled={busy || loading}
                      onClick={() => onDelete?.(l)}
                      className="w-10 h-10 cursor-pointer rounded-xl border-2 border-rose-200 bg-white hover:bg-rose-50 hover:border-rose-300 flex items-center justify-center disabled:opacity-60 transition-all active:scale-95"
                      title="Delete limit"
                    >
                      {busy ? (
                        <Loader2 size={18} className="animate-spin text-rose-600" />
                      ) : (
                        <Trash2 size={18} className="text-rose-600" />
                      )}
                    </button>
                  </div>
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
