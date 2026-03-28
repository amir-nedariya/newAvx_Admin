import React from "react";
import { Zap, X, Loader2 } from "lucide-react";

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
      <div className="w-full max-w-[720px] max-h-[90vh] bg-white border border-gray-200 rounded-2xl shadow-[0_30px_90px_-50px_rgba(2,6,23,0.55)] overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-gray-200 flex items-start justify-between bg-white">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              <Icon size={18} className="text-blue-700" />
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

const AddFeaturesModal = ({
  open,
  selectedTier,
  featureList,
  setFeatureList,
  featuresValid,
  savingFeatures,
  onClose,
  onSave,
  onCancel,
}) => {
  const lockClose = !!savingFeatures;

  return (
    <ModalShell
      open={open}
      icon={Zap}
      title="Add Tier Features"
      subtitle={
        selectedTier?.title
          ? `Tier: ${selectedTier.title} — add and manage features for this tier plan.`
          : "Add features to this tier plan"
      }
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
            onClick={onSave}
            disabled={!featuresValid || lockClose}
            type="button"
          >
            {savingFeatures ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="animate-spin" size={16} /> Saving...
              </span>
            ) : (
              "Save Features"
            )}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {featureList.map((f, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-gray-200 p-4 bg-gray-50"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-bold text-gray-900">
                Feature #{idx + 1}
              </p>

              {featureList.length > 1 ? (
                <button
                  className="text-xs font-extrabold text-rose-600 hover:text-rose-700 disabled:opacity-60"
                  onClick={() =>
                    setFeatureList((prev) => prev.filter((_, i) => i !== idx))
                  }
                  type="button"
                  disabled={lockClose}
                >
                  Remove
                </button>
              ) : null}
            </div>

            <div className="mt-3 space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Feature Name *
                </label>
                <input
                  value={f.featureName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFeatureList((prev) =>
                      prev.map((it, i) =>
                        i === idx ? { ...it, featureName: val } : it
                      )
                    );
                  }}
                  className="mt-1 w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  placeholder="Priority Listing"
                  disabled={lockClose}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Description *
                </label>
                <textarea
                  value={f.featureDescription}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFeatureList((prev) =>
                      prev.map((it, i) =>
                        i === idx
                          ? { ...it, featureDescription: val }
                          : it
                      )
                    );
                  }}
                  className="mt-1 w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white min-h-[90px]"
                  placeholder="Vehicles appear at the top..."
                  disabled={lockClose}
                />
              </div>
            </div>
          </div>
        ))}

        <Button
          variant="secondary"
          className="w-full"
          onClick={() =>
            setFeatureList((p) => [
              ...p,
              { featureName: "", featureDescription: "" },
            ])
          }
          type="button"
          disabled={lockClose}
        >
          + Add Another Feature
        </Button>
      </div>
    </ModalShell>
  );
};

export default AddFeaturesModal;