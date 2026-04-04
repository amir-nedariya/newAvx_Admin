import React from "react";
import { Zap, X, Loader2, Plus, Trash2 } from "lucide-react";

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
      className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (lockClose) return;
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="w-full max-w-[800px] max-h-[90vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
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
          ? `Tier: ${selectedTier.title} — Add and manage features for this tier plan`
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
            className="rounded-2xl border-2 border-slate-200 bg-white p-5 transition-all hover:border-slate-300"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-sm">
                  {idx + 1}
                </div>
                <p className="text-base font-extrabold text-slate-900">
                  Feature #{idx + 1}
                </p>
              </div>

              {featureList.length > 1 ? (
                <button
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-rose-600 hover:text-rose-700 disabled:opacity-60 transition-colors"
                  onClick={() =>
                    setFeatureList((prev) => prev.filter((_, i) => i !== idx))
                  }
                  type="button"
                  disabled={lockClose}
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              ) : null}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
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
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-semibold text-slate-900 transition-all placeholder:text-slate-400"
                  placeholder="e.g., Priority Listing"
                  disabled={lockClose}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
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
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400 resize-none"
                  placeholder="e.g., Vehicles appear at the top of search results"
                  rows={3}
                  disabled={lockClose}
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            setFeatureList((p) => [
              ...p,
              { featureName: "", featureDescription: "" },
            ])
          }
          disabled={lockClose}
          className="w-full rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50 disabled:opacity-60 active:scale-[0.98]"
        >
          <span className="inline-flex items-center gap-2">
            <Plus size={16} /> Add Another Feature
          </span>
        </button>
      </div>
    </ModalShell>
  );
};

export default AddFeaturesModal;
