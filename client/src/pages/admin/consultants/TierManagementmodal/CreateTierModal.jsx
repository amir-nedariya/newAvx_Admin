import React from "react";
import { Star, X, Loader2, Upload, Image as ImageIcon } from "lucide-react";

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
        <div className="px-5 py-4 border-b border-gray-200 flex items-start justify-between flex-shrink-0 bg-white">
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

        <div className="px-5 py-4 border-t border-gray-200 flex items-center justify-end gap-3 bg-white flex-shrink-0">
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
      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-700">Title *</label>
          <input
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            className="mt-1 w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Gold Tier"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">
            Description *
          </label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
            className="mt-1 w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none min-h-[110px]"
            placeholder="Best premium plan for users"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Monthly Price *
            </label>
            <input
              type="number"
              value={form.monthly_price}
              onChange={(e) =>
                setForm((p) => ({ ...p, monthly_price: e.target.value }))
              }
              className="mt-1 w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="120"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Yearly Price *
            </label>
            <input
              type="number"
              value={form.yearly_price}
              onChange={(e) =>
                setForm((p) => ({ ...p, yearly_price: e.target.value }))
              }
              className="mt-1 w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="1200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">
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
              className="mt-1 w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
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
              className="mt-1 w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">
            Badge Logo
          </label>

          <label className="mt-1 flex items-center justify-center gap-2 w-full min-h-[120px] px-4 py-4 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer transition">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Upload size={18} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-600">
              Upload badge image
            </span>
          </label>

          {form.badgePreview ? (
            <div className="mt-3 rounded-2xl border border-gray-200 p-3 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                  <img
                    src={form.badgePreview}
                    alt="badge preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {form.badgeLogo?.name || "Selected image"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(form.badgeLogo?.size / 1024).toFixed(1)} KB
                  </p>
                </div>

                <button
                  type="button"
                  onClick={removeFile}
                  className="px-3 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-sm font-semibold"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
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