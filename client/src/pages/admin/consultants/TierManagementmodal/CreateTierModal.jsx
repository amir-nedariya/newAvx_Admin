import React from "react";
import { Star, X, Loader2, Upload, Image as ImageIcon } from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

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
      <div className="w-full max-w-[800px] max-h-[90vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between flex-shrink-0 bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
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
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 bg-white flex-shrink-0">
          {footer}
        </div>
      </div>
    </div>
  );
};

const CreateTierModal = ({
  open,
  form,
  setForm,
  createValid,
  savingTier,
  onClose,
  onCreate,
  onCancel,
}) => {
  const lockClose = !!savingTier;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);

    setForm((p) => ({
      ...p,
      badgeLogo: file,
      badgePreview: preview,
    }));
  };

  const removeFile = () => {
    setForm((p) => ({
      ...p,
      badgeLogo: null,
      badgePreview: "",
    }));
  };

  return (
    <ModalShell
      open={open}
      icon={Star}
      title="Create New Tier"
      subtitle="Define the benefits and pricing for this tier plan."
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
            onClick={onCreate}
            disabled={!createValid || lockClose}
            type="button"
          >
            {savingTier ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="animate-spin" size={16} /> Creating...
              </span>
            ) : (
              "Create Tier"
            )}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Title *
          </label>
          <input
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-semibold text-slate-900 transition-all placeholder:text-slate-400"
            placeholder="e.g., Gold Tier"
            disabled={lockClose}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Description *
          </label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
            className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400 resize-none"
            placeholder="e.g., Best premium plan for users"
            rows={3}
            disabled={lockClose}
          />
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Monthly Price *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">₹</span>
              <input
                type="number"
                value={form.monthly_price}
                onChange={(e) =>
                  setForm((p) => ({ ...p, monthly_price: e.target.value }))
                }
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-semibold text-slate-900 transition-all placeholder:text-slate-400"
                placeholder="120"
                disabled={lockClose}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Yearly Price *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">₹</span>
              <input
                type="number"
                value={form.yearly_price}
                onChange={(e) =>
                  setForm((p) => ({ ...p, yearly_price: e.target.value }))
                }
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-semibold text-slate-900 transition-all placeholder:text-slate-400"
                placeholder="1200"
                disabled={lockClose}
              />
            </div>
          </div>
        </div>

        {/* Duration Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Monthly Duration (Days)
            </label>
            <input
              type="number"
              value={form.monthlyDurationInDays}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  monthlyDurationInDays: e.target.value,
                }))
              }
              className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-semibold text-slate-900 transition-all placeholder:text-slate-400"
              placeholder="30"
              disabled={lockClose}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Yearly Duration (Days)
            </label>
            <input
              type="number"
              value={form.yearlyDurationInDays}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  yearlyDurationInDays: e.target.value,
                }))
              }
              className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-semibold text-slate-900 transition-all placeholder:text-slate-400"
              placeholder="365"
              disabled={lockClose}
            />
          </div>
        </div>

        {/* Badge Logo Upload */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Badge Logo
          </label>

          <label className="flex items-center justify-center gap-2 w-full min-h-[140px] px-4 py-6 rounded-2xl border-2 border-dashed border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 cursor-pointer transition-all">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={lockClose}
            />
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                <Upload size={20} className="text-slate-500" />
              </div>
              <p className="text-sm font-bold text-slate-700">Upload badge image</p>
              <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p>
            </div>
          </label>

          {form.badgePreview ? (
            <div className="mt-4 rounded-2xl border-2 border-slate-200 p-4 bg-white">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-50 flex items-center justify-center flex-shrink-0">
                  <img
                    src={form.badgePreview}
                    alt="badge preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {form.badgeLogo?.name || "Selected image"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {(form.badgeLogo?.size / 1024).toFixed(1)} KB
                  </p>
                </div>

                <button
                  type="button"
                  onClick={removeFile}
                  disabled={lockClose}
                  className="px-4 py-2 rounded-xl border-2 border-rose-200 text-rose-600 hover:bg-rose-50 text-sm font-bold transition-all disabled:opacity-60"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
              <ImageIcon size={14} />
              Optional image file for tier badge
            </div>
          )}
        </div>
      </div>
    </ModalShell>
  );
};

export default CreateTierModal;