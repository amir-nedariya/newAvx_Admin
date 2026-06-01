/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Star,
  X,
  Loader2,
  Upload,
  Image as ImageIcon,
  Plus,
  Trash2,
  Shield,
  Settings,
  Info,
  CreditCard,
} from "lucide-react";

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
      <div className="w-full max-w-[850px] max-h-[92vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
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
        <div className="overflow-y-auto flex-1 bg-slate-50/30">{children}</div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-white flex-shrink-0">
          {footer}
        </div>
      </div>
    </div>
  );
};

const CreateTierModal = ({
  open,
  mode = "create", // "create" or "edit"
  form,
  setForm,
  savingTier,
  onClose,
  onSubmit,
  onCancel,
}) => {
  const lockClose = !!savingTier;
  const [activeTab, setActiveTab] = useState("basic"); // "basic", "limits", "features", "razorpay"

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
      removeBadge: true, // Track if existing badge is removed
    }));
  };

  // Helper to update limits
  const updateLimit = (period, key, value) => {
    setForm((p) => ({
      ...p,
      [`${period}${key.charAt(0).toUpperCase()}${key.slice(1)}`]: value,
    }));
  };

  // Helper to manage dynamic features
  const addFeature = (period) => {
    const key = `${period}Features`;
    const current = Array.isArray(form[key]) ? form[key] : [];
    setForm((p) => ({
      ...p,
      [key]: [...current, { featureName: "", featureDescription: "" }],
    }));
  };

  const removeFeature = (period, index) => {
    const key = `${period}Features`;
    const current = Array.isArray(form[key]) ? form[key] : [];
    setForm((p) => ({
      ...p,
      [key]: current.filter((_, i) => i !== index),
    }));
  };

  const updateFeatureField = (period, index, field, value) => {
    const key = `${period}Features`;
    const current = Array.isArray(form[key]) ? form[key] : [];
    const updated = current.map((f, i) => {
      if (i === index) {
        return { ...f, [field]: value };
      }
      return f;
    });
    setForm((p) => ({
      ...p,
      [key]: updated,
    }));
  };

  const TABS = [
    { id: "basic", label: "Basic Info", icon: Info },
    { id: "limits", label: "Limits", icon: Settings },
    { id: "features", label: "Features", icon: Star },
    { id: "razorpay", label: "Razorpay", icon: CreditCard },
  ];

  // Quick Validation checks per tab
  const isBasicValid =
    ["BASIC", "PRO", "PREMIUM"].includes(form.title) &&
    form.description.trim().length >= 10 &&
    Number(form.monthly_price) > 0 &&
    Number(form.yearly_price) > 0 &&
    Number(form.monthlyDurationInDays) >= 1 &&
    Number(form.yearlyDurationInDays) >= 1;

  const isLimitsValid =
    Number(form.monthlyMaxVehicleOnMarketPlace) >= 0 &&
    Number(form.monthlyMaxFreeInspection) >= 0 &&
    Number(form.yearlyMaxVehicleOnMarketPlace) >= 0 &&
    Number(form.yearlyMaxFreeInspection) >= 0;

  const isFormValid = isBasicValid && isLimitsValid;

  return (
    <ModalShell
      open={open}
      icon={Star}
      title={mode === "create" ? "Create New Tier Plan" : "Edit Tier Plan"}
      subtitle={
        mode === "create"
          ? "Define benefits, pricing, monthly/yearly limits, and custom features."
          : `Update properties, limits, and plan mappings for ${form.title} plan.`
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
            onClick={onSubmit}
            disabled={!isFormValid || lockClose}
            type="button"
          >
            {savingTier ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="animate-spin" size={16} /> Saving...
              </span>
            ) : mode === "create" ? (
              "Create Plan"
            ) : (
              "Save Changes"
            )}
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Tabs Bar at the Top */}
        <div className="flex flex-wrap gap-2 border-b border-slate-150 pb-4">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cls(
                "px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all cursor-pointer",
                activeTab === tab.id
                  ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
              )}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: BASIC INFO */}
        {activeTab === "basic" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title / Tier Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Tier Title Plan *
                </label>
                <select
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-semibold text-slate-900 transition-all cursor-pointer disabled:bg-slate-50"
                  disabled={lockClose || mode === "edit"} // Don't allow changing Title during Edit since title is unique identifier
                >
                  <option value="">Select Tier Type</option>
                  <option value="BASIC">BASIC</option>
                  <option value="PRO">PRO</option>
                  <option value="PREMIUM">PREMIUM</option>
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  Must be one of the pre-configured tier levels: BASIC, PRO, or PREMIUM.
                </p>
              </div>

              {/* Status (Only in edit mode) */}
              {mode === "edit" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Status *
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-semibold text-slate-900 transition-all cursor-pointer"
                    disabled={lockClose}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Description * ({form.description.length}/500 chars)
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value.slice(0, 500) }))
                }
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400 resize-none"
                placeholder="Describe this plan in at least 10 characters..."
                rows={3}
                disabled={lockClose}
              />
              {form.description.trim().length > 0 && form.description.trim().length < 10 && (
                <p className="text-xs text-rose-500 mt-1">Description must be at least 10 characters.</p>
              )}
            </div>

            {/* Pricing Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Monthly Price (INR) *
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
                    placeholder="e.g. 299"
                    disabled={lockClose}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Yearly Price (INR) *
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
                    placeholder="e.g. 2999"
                    disabled={lockClose}
                  />
                </div>
              </div>
            </div>

            {/* Duration Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Monthly Duration (Days) *
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
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-semibold text-slate-900 transition-all"
                  placeholder="30"
                  disabled={lockClose}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Yearly Duration (Days) *
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
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-semibold text-slate-900 transition-all"
                  placeholder="365"
                  disabled={lockClose}
                />
              </div>
            </div>

            {/* Badge Logo Upload */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Badge Plan Icon
              </label>

              <label className="flex items-center justify-center gap-2 w-full min-h-[120px] px-4 py-4 rounded-2xl border-2 border-dashed border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 cursor-pointer transition-all">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={lockClose}
                />
                <div className="text-center">
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <Upload size={18} className="text-slate-500" />
                  </div>
                  <p className="text-sm font-bold text-slate-700">Upload badge image</p>
                  <p className="text-xs text-slate-400">PNG, JPG, SVG up to 5MB</p>
                </div>
              </label>

              {form.badgePreview ? (
                <div className="mt-4 rounded-2xl border-2 border-slate-200 p-4 bg-white">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-50 flex items-center justify-center flex-shrink-0">
                      <img
                        src={form.badgePreview}
                        alt="badge preview"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {form.badgeLogo?.name || "Selected / Existing Badge Logo"}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {form.badgeLogo?.size ? `${(form.badgeLogo.size / 1024).toFixed(1)} KB` : "Server Image"}
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
                  Optional custom SVG or PNG image for the tier badge logo.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: LIMITS */}
        {activeTab === "limits" && (
          <div className="space-y-6">
            {/* Monthly Section */}
            <div className="border border-slate-200 rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-bold">M</span>
                <h4 className="text-sm font-bold text-slate-800">Monthly Plan Limits</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Max Vehicle on Marketplace</label>
                  <input
                    type="number"
                    value={form.monthlyMaxVehicleOnMarketPlace}
                    onChange={(e) => updateLimit("monthly", "maxVehicleOnMarketPlace", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none font-semibold focus:border-blue-500"
                    disabled={lockClose}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Max Free Inspection</label>
                  <input
                    type="number"
                    value={form.monthlyMaxFreeInspection}
                    onChange={(e) => updateLimit("monthly", "maxFreeInspection", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none font-semibold focus:border-blue-500"
                    disabled={lockClose}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">2-Wheel Inspection Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.monthlyTwoWheelInspectionDiscount}
                    onChange={(e) => updateLimit("monthly", "twoWheelInspectionDiscount", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none font-semibold focus:border-blue-500"
                    disabled={lockClose}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">4-Wheel Inspection Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.monthlyFourWheelInspectionDiscount}
                    onChange={(e) => updateLimit("monthly", "fourWheelInspectionDiscount", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none font-semibold focus:border-blue-500"
                    disabled={lockClose}
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-3 mt-2 bg-slate-50/50 p-2.5 rounded-lg border border-slate-200/60">
                  <input
                    type="checkbox"
                    id="monthlyStoreImageCustomUpload"
                    checked={!!form.monthlyStoreImageCustomUpload}
                    onChange={(e) => updateLimit("monthly", "storeImageCustomUpload", e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                    disabled={lockClose}
                  />
                  <label htmlFor="monthlyStoreImageCustomUpload" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Enable custom image uploads for Store/Dealer profile logo & cover photo
                  </label>
                </div>
              </div>
            </div>

            {/* Yearly Section */}
            <div className="border border-slate-200 rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold">Y</span>
                <h4 className="text-sm font-bold text-slate-800">Yearly Plan Limits</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Max Vehicle on Marketplace</label>
                  <input
                    type="number"
                    value={form.yearlyMaxVehicleOnMarketPlace}
                    onChange={(e) => updateLimit("yearly", "maxVehicleOnMarketPlace", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none font-semibold focus:border-indigo-500"
                    disabled={lockClose}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Max Free Inspection</label>
                  <input
                    type="number"
                    value={form.yearlyMaxFreeInspection}
                    onChange={(e) => updateLimit("yearly", "maxFreeInspection", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none font-semibold focus:border-indigo-500"
                    disabled={lockClose}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">2-Wheel Inspection Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.yearlyTwoWheelInspectionDiscount}
                    onChange={(e) => updateLimit("yearly", "twoWheelInspectionDiscount", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none font-semibold focus:border-indigo-500"
                    disabled={lockClose}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">4-Wheel Inspection Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.yearlyFourWheelInspectionDiscount}
                    onChange={(e) => updateLimit("yearly", "fourWheelInspectionDiscount", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none font-semibold focus:border-indigo-500"
                    disabled={lockClose}
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-3 mt-2 bg-slate-50/50 p-2.5 rounded-lg border border-slate-200/60">
                  <input
                    type="checkbox"
                    id="yearlyStoreImageCustomUpload"
                    checked={!!form.yearlyStoreImageCustomUpload}
                    onChange={(e) => updateLimit("yearly", "storeImageCustomUpload", e.target.checked)}
                    className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                    disabled={lockClose}
                  />
                  <label htmlFor="yearlyStoreImageCustomUpload" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Enable custom image uploads for Store/Dealer profile logo & cover photo
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: FEATURES */}
        {activeTab === "features" && (
          <div className="space-y-6">
            {/* Monthly Features list */}
            <div className="border border-slate-200 rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-bold">M</span>
                  <h4 className="text-sm font-bold text-slate-800 font-sans">Monthly Feature Additions</h4>
                </div>
                <button
                  type="button"
                  onClick={() => addFeature("monthly")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
                  disabled={lockClose}
                >
                  <Plus size={14} /> Add Feature
                </button>
              </div>

              {(!form.monthlyFeatures || form.monthlyFeatures.length === 0) ? (
                <p className="text-xs text-slate-400 italic text-center py-4 bg-slate-50 rounded-xl">
                  No monthly plan features defined yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {form.monthlyFeatures.map((feat, idx) => (
                    <div key={idx} className="flex gap-2 items-start border border-slate-150 rounded-xl p-3 bg-slate-50/40">
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={feat.featureName}
                          onChange={(e) => updateFeatureField("monthly", idx, "featureName", e.target.value)}
                          placeholder="Feature Title (e.g. Real-time Lead Analytics)"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold outline-none focus:border-blue-500 bg-white"
                          required
                          disabled={lockClose}
                        />
                        <textarea
                          value={feat.featureDescription}
                          onChange={(e) => updateFeatureField("monthly", idx, "featureDescription", e.target.value)}
                          placeholder="Provide details about what features are provided..."
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs outline-none focus:border-blue-500 bg-white resize-none"
                          rows={2}
                          disabled={lockClose}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFeature("monthly", idx)}
                        className="p-1.5 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 transition-colors flex-shrink-0 cursor-pointer"
                        title="Delete Feature"
                        disabled={lockClose}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Yearly Features list */}
            <div className="border border-slate-200 rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold">Y</span>
                  <h4 className="text-sm font-bold text-slate-800 font-sans">Yearly Feature Additions</h4>
                </div>
                <button
                  type="button"
                  onClick={() => addFeature("yearly")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
                  disabled={lockClose}
                >
                  <Plus size={14} /> Add Feature
                </button>
              </div>

              {(!form.yearlyFeatures || form.yearlyFeatures.length === 0) ? (
                <p className="text-xs text-slate-400 italic text-center py-4 bg-slate-50 rounded-xl">
                  No yearly plan features defined yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {form.yearlyFeatures.map((feat, idx) => (
                    <div key={idx} className="flex gap-2 items-start border border-slate-150 rounded-xl p-3 bg-slate-50/40">
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={feat.featureName}
                          onChange={(e) => updateFeatureField("yearly", idx, "featureName", e.target.value)}
                          placeholder="Feature Title (e.g. Certified Inspector Priority Booking)"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold outline-none focus:border-indigo-500 bg-white"
                          required
                          disabled={lockClose}
                        />
                        <textarea
                          value={feat.featureDescription}
                          onChange={(e) => updateFeatureField("yearly", idx, "featureDescription", e.target.value)}
                          placeholder="Provide details about what features are provided..."
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs outline-none focus:border-indigo-500 bg-white resize-none"
                          rows={2}
                          disabled={lockClose}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFeature("yearly", idx)}
                        className="p-1.5 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 transition-colors flex-shrink-0 cursor-pointer"
                        title="Delete Feature"
                        disabled={lockClose}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: RAZORPAY INTEGRATION */}
        {activeTab === "razorpay" && (
          <div className="space-y-5">
            <div className="bg-sky-50 rounded-2xl border border-sky-200 p-4 flex gap-3 text-sky-800">
              <Shield className="flex-shrink-0 text-sky-600" size={20} />
              <div>
                <h4 className="text-sm font-bold">Payment Gateway Integration</h4>
                <p className="text-xs text-sky-700 mt-1 leading-relaxed">
                  Provide Razorpay plan IDs corresponding to the monthly and yearly setups in your dashboard.
                  This ensures consultants are correctly redirected to checkout forms with appropriate price structures.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Monthly Plan ID (Razorpay Plan ID)
                </label>
                <input
                  type="text"
                  value={form.monthlyRazorpayPlanId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, monthlyRazorpayPlanId: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-semibold text-slate-900 transition-all placeholder:text-slate-400"
                  placeholder="e.g. plan_N1234abcd5678"
                  disabled={lockClose}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Yearly Plan ID (Razorpay Plan ID)
                </label>
                <input
                  type="text"
                  value={form.yearlyRazorpayPlanId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, yearlyRazorpayPlanId: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm font-semibold text-slate-900 transition-all placeholder:text-slate-400"
                  placeholder="e.g. plan_Y9876xyz54321"
                  disabled={lockClose}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </ModalShell>
  );
};

export default CreateTierModal;