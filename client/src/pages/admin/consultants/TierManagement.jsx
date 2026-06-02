/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Crown,
  Star,
  Zap,
  Loader2,
  Plus,
  RefreshCw,
  BadgeCheck,
  BadgeX,
} from "lucide-react";

import { getTierPlans, createTierPlan, updateTierPlan } from "../../../api/tierPlan.api";
import CreateTierModal from "./TierManagementmodal/CreateTierModal";

const cls = (...a) => a.filter(Boolean).join(" ");

const moneyIN = (n) => Number(n ?? 0).toLocaleString("en-IN");

const Toast = ({ show, type = "success", text }) => {
  if (!show) return null;

  const meta =
    type === "success"
      ? {
          box: "bg-emerald-50 border-emerald-200 text-emerald-800",
          title: "Success",
        }
      : {
          box: "bg-rose-50 border-rose-200 text-rose-800",
          title: "Error",
        };

  return (
    <div className="fixed top-4 right-4 z-[99999]">
      <div
        className={cls("w-[360px] rounded-2xl border p-3 shadow-lg", meta.box)}
      >
        <p className="text-sm font-extrabold">{meta.title}</p>
        <p className="text-[13px] mt-1 leading-snug">{text}</p>
      </div>
    </div>
  );
};

const iconForTier = (title = "") => {
  const t = String(title || "").toLowerCase();
  if (t.includes("premium") || t.includes("ultra")) return Crown;
  if (t.includes("pro")) return Zap;
  return Star;
};

const StatusPill = ({ status }) => {
  const s = String(status || "").toUpperCase();
  const ok = s === "ACTIVE";
  const Icon = ok ? BadgeCheck : BadgeX;

  return (
    <span
      className={cls(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-extrabold",
        ok
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-rose-50 text-rose-700 border-rose-200"
      )}
    >
      <Icon size={14} />
      {s || "—"}
    </span>
  );
};

const normalizeTiers = (res) => {
  const arr =
    res?.data?.data ||
    res?.data ||
    res?.tiers ||
    res?.tierPlans ||
    res ||
    [];
  return Array.isArray(arr) ? arr : [];
};

const TierManagement = () => {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    text: "",
  });

  const showToast = (type, text) => {
    setToast({ show: true, type, text });
    window.setTimeout(
      () => setToast({ show: false, type: "success", text: "" }),
      2200
    );
  };

  const [createOpen, setCreateOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" or "edit"
  const [editingTierId, setEditingTierId] = useState(null);
  
  // Card tabs for Monthly/Yearly toggle
  const [cardTabs, setCardTabs] = useState({}); // { [tierId]: "monthly" | "yearly" }

  const [form, setForm] = useState({
    title: "",
    description: "",
    monthly_price: "",
    yearly_price: "",
    monthlyDurationInDays: 30,
    yearlyDurationInDays: 365,
    monthlyGracePeriodDays: 0,
    yearlyGracePeriodDays: 0,
    badgeLogo: null,
    badgePreview: "",
    // monthly limits
    monthlyMaxVehicleOnMarketPlace: 0,
    monthlyMaxFreeInspection: 0,
    monthlyStoreImageCustomUpload: false,
    monthlyTwoWheelInspectionDiscount: 0,
    monthlyFourWheelInspectionDiscount: 0,
    // yearly limits
    yearlyMaxVehicleOnMarketPlace: 0,
    yearlyMaxFreeInspection: 0,
    yearlyStoreImageCustomUpload: false,
    yearlyTwoWheelInspectionDiscount: 0,
    yearlyFourWheelInspectionDiscount: 0,
    // features
    monthlyFeatures: [],
    yearlyFeatures: [],
    // razorpay plan ids
    monthlyRazorpayPlanId: "",
    yearlyRazorpayPlanId: "",
    status: "ACTIVE",
  });

  const [savingTier, setSavingTier] = useState(false);

  const resetCreate = () => {
    setForm({
      title: "",
      description: "",
      monthly_price: "",
      yearly_price: "",
      monthlyDurationInDays: 30,
      yearlyDurationInDays: 365,
      monthlyGracePeriodDays: 0,
      yearlyGracePeriodDays: 0,
      badgeLogo: null,
      badgePreview: "",
      monthlyMaxVehicleOnMarketPlace: 0,
      monthlyMaxFreeInspection: 0,
      monthlyStoreImageCustomUpload: false,
      monthlyTwoWheelInspectionDiscount: 0,
      monthlyFourWheelInspectionDiscount: 0,
      yearlyMaxVehicleOnMarketPlace: 0,
      yearlyMaxFreeInspection: 0,
      yearlyStoreImageCustomUpload: false,
      yearlyTwoWheelInspectionDiscount: 0,
      yearlyFourWheelInspectionDiscount: 0,
      monthlyFeatures: [],
      yearlyFeatures: [],
      monthlyRazorpayPlanId: "",
      yearlyRazorpayPlanId: "",
      status: "ACTIVE",
    });
    setEditingTierId(null);
  };

  const loadAll = async (mode = "initial") => {
    try {
      mode === "initial" ? setLoading(true) : setReloading(true);

      const res = await getTierPlans();
      const list = normalizeTiers(res);
      setTiers(list);
    } catch (e) {
      showToast(
        "error",
        e?.response?.data?.message || e?.message || "Failed to load tiers"
      );
      setTiers([]);
    } finally {
      mode === "initial" ? setLoading(false) : setReloading(false);
    }
  };

  useEffect(() => {
    loadAll("initial");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveTier = async () => {
    try {
      setSavingTier(true);

      const payload = {
        title: form.title,
        description: form.description.trim(),
        monthly_price: Number(form.monthly_price),
        yearly_price: Number(form.yearly_price),
        monthlyDurationInDays: Number(form.monthlyDurationInDays) || 30,
        yearlyDurationInDays: Number(form.yearlyDurationInDays) || 365,
        monthlyGracePeriodDays: Number(form.monthlyGracePeriodDays) || 0,
        yearlyGracePeriodDays: Number(form.yearlyGracePeriodDays) || 0,
        status: form.status,
        
        // Limits
        monthlyMaxVehicleOnMarketPlace: Number(form.monthlyMaxVehicleOnMarketPlace) || 0,
        monthlyMaxFreeInspection: Number(form.monthlyMaxFreeInspection) || 0,
        monthlyStoreImageCustomUpload: !!form.monthlyStoreImageCustomUpload,
        monthlyTwoWheelInspectionDiscount: Number(form.monthlyTwoWheelInspectionDiscount) || 0,
        monthlyFourWheelInspectionDiscount: Number(form.monthlyFourWheelInspectionDiscount) || 0,
        
        yearlyMaxVehicleOnMarketPlace: Number(form.yearlyMaxVehicleOnMarketPlace) || 0,
        yearlyMaxFreeInspection: Number(form.yearlyMaxFreeInspection) || 0,
        yearlyStoreImageCustomUpload: !!form.yearlyStoreImageCustomUpload,
        yearlyTwoWheelInspectionDiscount: Number(form.yearlyTwoWheelInspectionDiscount) || 0,
        yearlyFourWheelInspectionDiscount: Number(form.yearlyFourWheelInspectionDiscount) || 0,
        
        // Features JSON Strings
        monthlyFeatures: JSON.stringify(form.monthlyFeatures || []),
        yearlyFeatures: JSON.stringify(form.yearlyFeatures || []),
        
        // Razorpay Plan IDs
        monthlyRazorpayPlanId: form.monthlyRazorpayPlanId || "",
        yearlyRazorpayPlanId: form.yearlyRazorpayPlanId || "",
        
        badgeLogo: form.badgeLogo,
      };

      if (modalMode === "create") {
        await createTierPlan(payload);
        showToast("success", "Tier plan created successfully!");
      } else {
        await updateTierPlan(editingTierId, payload);
        showToast("success", "Tier plan updated successfully!");
      }

      setCreateOpen(false);
      resetCreate();
      await loadAll("reload");
    } catch (e) {
      showToast(
        "error",
        e?.response?.data?.message || e?.message || "Operation failed"
      );
    } finally {
      setSavingTier(false);
    }
  };

  const openEditTierPlan = (tier) => {
    setModalMode("edit");
    setEditingTierId(tier.id);

    setForm({
      title: tier.title || "",
      description: tier.description || "",
      monthly_price: String(tier.monthlyPrice ?? tier.monthly_price ?? ""),
      yearly_price: String(tier.yearlyPrice ?? tier.yearly_price ?? ""),
      monthlyDurationInDays: tier.monthlyDurationInDays ?? 30,
      yearlyDurationInDays: tier.yearlyDurationInDays ?? 365,
      monthlyGracePeriodDays: tier.monthlyGracePeriodDays ?? 0,
      yearlyGracePeriodDays: tier.yearlyGracePeriodDays ?? 0,
      badgeLogo: null,
      badgePreview: tier.tierBadgeUrl || tier.badgeUrl || "",
      
      // Monthly Limits
      monthlyMaxVehicleOnMarketPlace: tier.monthlyLimits?.maxVehicleOnMarketPlace ?? 0,
      monthlyMaxFreeInspection: tier.monthlyLimits?.maxFreeInspection ?? 0,
      monthlyStoreImageCustomUpload: !!tier.monthlyLimits?.storeImageCustomUpload,
      monthlyTwoWheelInspectionDiscount: tier.monthlyLimits?.twoWheelInspectionDiscount ?? 0,
      monthlyFourWheelInspectionDiscount: tier.monthlyLimits?.fourWheelInspectionDiscount ?? 0,
      
      // Yearly Limits
      yearlyMaxVehicleOnMarketPlace: tier.yearlyLimits?.maxVehicleOnMarketPlace ?? 0,
      yearlyMaxFreeInspection: tier.yearlyLimits?.maxFreeInspection ?? 0,
      yearlyStoreImageCustomUpload: !!tier.yearlyLimits?.storeImageCustomUpload,
      yearlyTwoWheelInspectionDiscount: tier.yearlyLimits?.twoWheelInspectionDiscount ?? 0,
      yearlyFourWheelInspectionDiscount: tier.yearlyLimits?.fourWheelInspectionDiscount ?? 0,
      
      // Features
      monthlyFeatures: Array.isArray(tier.monthlyFeatures)
        ? tier.monthlyFeatures.map((f) => ({
            featureName: f.featureName,
            featureDescription: f.featureDescription,
          }))
        : [],
      yearlyFeatures: Array.isArray(tier.yearlyFeatures)
        ? tier.yearlyFeatures.map((f) => ({
            featureName: f.featureName,
            featureDescription: f.featureDescription,
          }))
        : [],
        
      // Razorpay
      monthlyRazorpayPlanId: tier.monthlyRazorpayPlanId || "",
      yearlyRazorpayPlanId: tier.yearlyRazorpayPlanId || "",
      status: tier.status || "ACTIVE",
    });

    setCreateOpen(true);
  };

  const cards = useMemo(() => {
    return tiers.map((tier) => {
      const title = tier?.title || "Tier";
      const Icon = iconForTier(title);
      const isPopular = String(title).toLowerCase().includes("pro");

      const monthly = tier?.monthlyPrice ?? tier?.monthly_price ?? 0;
      const yearly = tier?.yearlyPrice ?? tier?.yearly_price ?? 0;

      // Extract and map features & limits
      const mLimits = tier?.monthlyLimits || {};
      const yLimits = tier?.yearlyLimits || {};
      const mFeatures = Array.isArray(tier?.monthlyFeatures) ? tier.monthlyFeatures : [];
      const yFeatures = Array.isArray(tier?.yearlyFeatures) ? tier.yearlyFeatures : [];

      return {
        tier,
        title,
        Icon,
        isPopular,
        monthly,
        yearly,
        mLimits,
        yLimits,
        mFeatures,
        yFeatures,
      };
    });
  }, [tiers]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <Toast show={toast.show} type={toast.type} text={toast.text} />

      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Tier Management
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => loadAll("reload")}
                disabled={reloading}
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-60 cursor-pointer"
              >
                <RefreshCw size={16} className={reloading ? "animate-spin" : ""} />
                Refresh
              </button>

              <button
                onClick={() => {
                  setModalMode("create");
                  resetCreate();
                  setCreateOpen(true);
                }}
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800 cursor-pointer"
              >
                <Plus size={16} /> Create New Tier
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-12 shadow-sm">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-slate-600" />
              <p className="text-sm font-semibold text-slate-600">Loading tiers...</p>
            </div>
          </div>
        ) : cards.length === 0 ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-12 shadow-sm text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <Crown className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-base font-bold text-slate-900">No tiers found</p>
            <p className="text-sm text-slate-500 mt-1">Create your first tier plan to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {cards.map((card) => {
              const {
                tier,
                title,
                Icon,
                isPopular,
                monthly,
                yearly,
                mLimits,
                yLimits,
                mFeatures,
                yFeatures,
              } = card;

              const tierId = tier?.id || title;
              const activeCardTab = cardTabs[tierId] || "monthly";

              const currentLimits = activeCardTab === "monthly" ? mLimits : yLimits;
              const currentFeatures = activeCardTab === "monthly" ? mFeatures : yFeatures;

              return (
                <div
                  key={tierId}
                  className={cls(
                    "relative rounded-3xl border bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-slate-200 flex flex-col justify-between"
                  )}
                >
                  {/* Card Header with Badge and Title */}
                  <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-slate-50 via-white to-slate-50/50 p-6 pb-6 flex-shrink-0">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-slate-100/50 blur-2xl" />

                    <div className="relative">
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {/* Badge Icon */}
                          <div className={cls(
                            "relative flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg overflow-hidden border-2",
                            isPopular
                              ? "bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 border-indigo-400"
                              : "bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700"
                          )}>
                            {tier?.tierBadgeUrl || tier?.badgeUrl || tier?.badgeLogoUrl ? (
                              <img
                                src={tier?.tierBadgeUrl || tier?.badgeUrl || tier?.badgeLogoUrl}
                                alt="tier badge"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Icon className="text-white" size={28} />
                            )}
                          </div>

                          {/* Title and Duration */}
                          <div>
                            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{title}</h3>
                            <p className="text-xs font-semibold text-slate-400 mt-1">
                              {tier?.monthlyDurationInDays || 30}d M / {tier?.yearlyDurationInDays || 365}d Y
                            </p>
                          </div>
                        </div>

                        <StatusPill status={tier?.status} />
                      </div>

                      {/* Pricing */}
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-black text-slate-900 tracking-tight font-sans">
                            ₹{moneyIN(monthly)}
                          </span>
                          <span className="text-sm font-semibold text-slate-500">/ month</span>
                        </div>
                        <div className="text-sm font-medium text-slate-600">
                          Yearly: <span className="font-bold text-slate-900 font-sans">₹{moneyIN(yearly)}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="mt-4 text-sm leading-relaxed text-slate-600 line-clamp-2">
                        {tier?.description || "No description provided."}
                      </p>
                    </div>
                  </div>

                  {/* Monthly / Yearly view selector */}
                  <div className="flex rounded-xl bg-slate-100 p-1 mx-5 my-2 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setCardTabs((p) => ({ ...p, [tierId]: "monthly" }))}
                      className={cls(
                        "flex-1 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer",
                        activeCardTab === "monthly"
                          ? "bg-white text-slate-800 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      Monthly Info
                    </button>
                    <button
                      type="button"
                      onClick={() => setCardTabs((p) => ({ ...p, [tierId]: "yearly" }))}
                      className={cls(
                        "flex-1 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer",
                        activeCardTab === "yearly"
                          ? "bg-white text-slate-800 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      Yearly Info
                    </button>
                  </div>

                  {/* Limits Section */}
                  <div className="bg-white p-5 border-t border-slate-100">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                        {activeCardTab.toUpperCase()} Limits
                      </h4>
                      <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[9px] font-extrabold text-slate-600 border border-slate-150 uppercase">
                        {activeCardTab}
                      </span>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between rounded-xl bg-slate-50/50 px-3.5 py-2 shadow-md">
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                          Vehicles on Marketplace
                        </span>
                        <span className="rounded-lg bg-slate-900 text-white px-2 py-0.5 text-xs font-bold font-sans">
                          {currentLimits.maxVehicleOnMarketPlace ?? 0}
                        </span>
                      </div>

                      <div className="flex items-center justify-between rounded-xl bg-slate-50/50 px-3.5 py-2 shadow-md">
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                          Free Inspections
                        </span>
                        <span className="rounded-lg bg-slate-900 text-white px-2 py-0.5 text-xs font-bold font-sans">
                          {currentLimits.maxFreeInspection ?? 0}
                        </span>
                      </div>

                      <div className="flex items-center justify-between rounded-xl bg-slate-50/50 px-3.5 py-2 shadow-md">
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                          Custom Store Uploads
                        </span>
                        <span className={cls(
                          "rounded-lg px-2 py-0.5 text-xs font-bold",
                          currentLimits.storeImageCustomUpload
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        )}>
                          {currentLimits.storeImageCustomUpload ? "Yes" : "No"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between rounded-xl bg-slate-50/50 px-3.5 py-2 shadow-md">
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                          2W Inspection Discount
                        </span>
                        <span className="rounded-lg bg-blue-100 text-blue-800 px-2 py-0.5 text-xs font-bold font-sans">
                          {currentLimits.twoWheelInspectionDiscount ?? 0}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between rounded-xl bg-slate-50/50 px-3.5 py-2 shadow-md">
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                          4W Inspection Discount
                        </span>
                        <span className="rounded-lg bg-blue-100 text-blue-800 px-2 py-0.5 text-xs font-bold font-sans">
                          {currentLimits.fourWheelInspectionDiscount ?? 0}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between rounded-xl bg-slate-50/50 px-3.5 py-2 shadow-md">
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                          Grace Period
                        </span>
                        <span className="rounded-lg bg-amber-100 text-amber-800 px-2 py-0.5 text-xs font-bold font-sans">
                          {activeCardTab === "monthly"
                            ? `${tier?.monthlyGracePeriodDays ?? 0} Days`
                            : `${tier?.yearlyGracePeriodDays ?? 0} Days`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Features Section */}
                  <div className="border-t border-slate-100 bg-white p-5 rounded-b-3xl flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                          {activeCardTab.toUpperCase()} Features
                        </h4>
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                          {currentFeatures.length} added
                        </span>
                      </div>

                      {currentFeatures.length === 0 ? (
                        <div className="rounded-xl bg-slate-50 px-4 py-5 text-center">
                          <p className="text-xs font-medium text-slate-400 italic">No features added</p>
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                          {currentFeatures.map((f, idx) => (
                            <div
                              key={idx}
                              className="rounded-xl border border-slate-200 bg-gradient-to-r from-white to-slate-50/50 p-2.5 transition-all hover:border-slate-300"
                            >
                              <div className="flex items-start gap-2 min-w-0">
                                <div className="mt-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-100 flex-shrink-0">
                                  <Check className="h-2.5 w-2.5 text-emerald-600" strokeWidth={3} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-extrabold text-slate-900 leading-tight">
                                    {f?.featureName || "Feature"}
                                  </p>
                                  <p className="text-[10px] leading-relaxed text-slate-500 mt-0.5">
                                    {f?.featureDescription || ""}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <button
                        onClick={() => openEditTierPlan(tier)}
                        type="button"
                        className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] cursor-pointer"
                      >
                        Edit Tier Plan
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <CreateTierModal
        open={createOpen}
        mode={modalMode}
        form={form}
        setForm={setForm}
        savingTier={savingTier}
        onClose={() => {
          if (savingTier) return;
          setCreateOpen(false);
          resetCreate();
        }}
        onCancel={() => {
          if (savingTier) return;
          setCreateOpen(false);
          resetCreate();
        }}
        onSubmit={handleSaveTier}
      />
    </div>
  );
};

export default TierManagement;