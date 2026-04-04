import React, { useEffect, useMemo, useState } from "react";
import {
  Check,
  Crown,
  Star,
  Zap,
  Loader2,
  Plus,
  ListPlus,
  RefreshCw,
  BadgeCheck,
  BadgeX,
  Pencil,
  Trash2,
} from "lucide-react";

import { getTierPlans, createTierPlan } from "../../../api/tierPlan.api";
import {
  addTierPlanFeatures,
  updateTierFeatureById,
  deleteTierFeatureById,
} from "../../../api/tierFeatureApi";

import {
  getTierLimitNames,
  createTierLimits,
  getTierLimitsByTierPlanId,
  deleteTierLimitById,
} from "../../../api/tierPlanLimits.api";

import CreateTierModal from "./TierManagementmodal/CreateTierModal";
import AddFeaturesModal from "./TierManagementmodal/AddFeaturesModal";
import EditFeatureModal from "./TierManagementmodal/EditFeatureModal";
import DeleteFeatureModal from "./TierManagementmodal/DeleteFeatureModal";
import TierLimitsModal from "./TierManagementmodal/TierLimitsModal";
import AddLimitsModal from "./TierManagementmodal/AddLimitsModal";

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

const PageHeader = ({ title, subtitle, actions }) => (
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
    </div>
    {actions}
  </div>
);

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

const moneyIN = (n) => Number(n ?? 0).toLocaleString("en-IN");

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

const FeatureStatusPill = ({ status }) => {
  const s = String(status || "ACTIVE").toUpperCase();
  const tone =
    s === "ACTIVE"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : s === "INACTIVE"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-rose-50 text-rose-700 border-rose-200";

  return (
    <span
      className={cls(
        "px-2 py-1 rounded-full border text-[11px] font-extrabold",
        tone
      )}
    >
      {s}
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

const safeId = (obj) => obj?.id || obj?._id;

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
  const [featureOpen, setFeatureOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [limitsOpen, setLimitsOpen] = useState(false);
  const [addLimitsOpen, setAddLimitsOpen] = useState(false);

  const [selectedTier, setSelectedTier] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [busyFeatureId, setBusyFeatureId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    monthly_price: "",
    yearly_price: "",
    monthlyDurationInDays: 30,
    yearlyDurationInDays: 365,
    badgeLogo: null,
    badgePreview: "",
  });

  const [savingTier, setSavingTier] = useState(false);

  const [featureList, setFeatureList] = useState([
    { featureName: "", featureDescription: "" },
  ]);
  const [savingFeatures, setSavingFeatures] = useState(false);

  const [editForm, setEditForm] = useState({
    featureName: "",
    featureDescription: "",
    status: "ACTIVE",
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const [limitNames, setLimitNames] = useState({});
  const [tierLimits, setTierLimits] = useState([]);
  const [limitsLoading, setLimitsLoading] = useState(false);
  const [deletingLimitId, setDeletingLimitId] = useState(null);
  const [savingLimits, setSavingLimits] = useState(false);

  const createValid =
    form.title.trim().length >= 2 &&
    form.description.trim().length >= 5 &&
    Number(form.monthly_price) > 0 &&
    Number(form.yearly_price) > 0;

  const featuresValid = featureList.every(
    (f) =>
      f.featureName.trim().length >= 2 &&
      f.featureDescription.trim().length >= 3
  );

  const editValid =
    editForm.featureName.trim().length >= 2 &&
    editForm.featureDescription.trim().length >= 3 &&
    ["ACTIVE", "INACTIVE", "DELETED"].includes(
      String(editForm.status).toUpperCase()
    );

  const resetCreate = () => {
    setForm({
      title: "",
      description: "",
      monthly_price: "",
      yearly_price: "",
      monthlyDurationInDays: 30,
      yearlyDurationInDays: 365,
      badgeLogo: null,
      badgePreview: "",
    });
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
  }, []);

  const handleCreateTier = async () => {
    if (!createValid || savingTier) return;

    try {
      setSavingTier(true);

      await createTierPlan({
        title: form.title.trim(),
        description: form.description.trim(),
        yearly_price: Number(form.yearly_price),
        monthly_price: Number(form.monthly_price),
        monthlyDurationInDays: Number(form.monthlyDurationInDays) || 30,
        yearlyDurationInDays: Number(form.yearlyDurationInDays) || 365,
        badgeLogo: form.badgeLogo || null,
      });

      showToast("success", "Tier created successfully");
      setCreateOpen(false);
      resetCreate();
      await loadAll("reload");
    } catch (e) {
      showToast(
        "error",
        e?.response?.data?.message || e?.message || "Create tier failed"
      );
    } finally {
      setSavingTier(false);
    }
  };

  const openFeatureModal = (tier) => {
    setSelectedTier(tier);
    setFeatureList([{ featureName: "", featureDescription: "" }]);
    setFeatureOpen(true);
  };

  const handleSaveFeatures = async () => {
    const tierPlanId = selectedTier?.id || selectedTier?._id;
    if (!tierPlanId) return showToast("error", "Tier ID not found");
    if (!featuresValid || savingFeatures) return;

    try {
      setSavingFeatures(true);

      await addTierPlanFeatures({
        tierPlanId,
        features: featureList.map((f) => ({
          featureName: f.featureName.trim(),
          featureDescription: f.featureDescription.trim(),
        })),
      });

      showToast("success", "Features added successfully");
      setFeatureOpen(false);
      setSelectedTier(null);
      await loadAll("reload");
    } catch (e) {
      showToast(
        "error",
        e?.response?.data?.message || e?.message || "Failed to add features"
      );
    } finally {
      setSavingFeatures(false);
    }
  };

  const openEditFeature = (feature) => {
    setSelectedFeature(feature);
    setEditForm({
      featureName: feature?.featureName || "",
      featureDescription: feature?.featureDescription || "",
      status: (feature?.status || "ACTIVE").toUpperCase(),
    });
    setEditOpen(true);
  };

  const handleUpdateFeature = async () => {
    const fid = safeId(selectedFeature);
    if (!fid) return showToast("error", "Feature ID not found");
    if (!editValid || savingEdit) return;

    try {
      setSavingEdit(true);
      setBusyFeatureId(fid);

      await updateTierFeatureById(fid, {
        featureName: editForm.featureName.trim(),
        featureDescription: editForm.featureDescription.trim(),
        status: String(editForm.status).toUpperCase(),
      });

      showToast("success", "Feature updated successfully");
      setEditOpen(false);
      setSelectedFeature(null);
      await loadAll("reload");
    } catch (e) {
      showToast(
        "error",
        e?.response?.data?.message || e?.message || "Update feature failed"
      );
    } finally {
      setSavingEdit(false);
      setBusyFeatureId(null);
    }
  };

  const openDeleteFeature = (feature) => {
    setSelectedFeature(feature);
    setDeleteOpen(true);
  };

  const handleDeleteFeature = async () => {
    const fid = safeId(selectedFeature);
    if (!fid) return showToast("error", "Feature ID not found");
    if (deleting) return;

    try {
      setDeleting(true);
      setBusyFeatureId(fid);

      await deleteTierFeatureById(fid);

      showToast("success", "Feature deleted successfully");
      setDeleteOpen(false);
      setSelectedFeature(null);
      await loadAll("reload");
    } catch (e) {
      showToast(
        "error",
        e?.response?.data?.message || e?.message || "Delete feature failed"
      );
    } finally {
      setDeleting(false);
      setBusyFeatureId(null);
    }
  };

  const openLimitsManager = async (tier) => {
    setSelectedTier(tier);
    setLimitsOpen(true);

    const tierPlanId = tier?.id || tier?._id;
    if (!tierPlanId) {
      showToast("error", "Tier plan ID not found");
      return;
    }

    try {
      setLimitsLoading(true);

      const [namesRes, limitsRes] = await Promise.all([
        getTierLimitNames(),
        getTierLimitsByTierPlanId(tierPlanId),
      ]);

      console.log("🔍 TierManagement - namesRes:", namesRes);
      console.log("🔍 TierManagement - namesRes.data:", namesRes?.data);

      setLimitNames(namesRes?.data || namesRes?.data?.data || {});
      const limitsArr = limitsRes?.data?.data || limitsRes?.data || [];
      setTierLimits(Array.isArray(limitsArr) ? limitsArr : []);
    } catch (e) {
      showToast(
        "error",
        e?.response?.data?.message || e?.message || "Failed to load limits"
      );
      setLimitNames({});
      setTierLimits([]);
    } finally {
      setLimitsLoading(false);
    }
  };

  const handleSaveLimits = async (payload) => {
    if (!payload?.tierPlanId) return showToast("error", "Tier ID missing");

    try {
      setSavingLimits(true);

      await createTierLimits(payload);

      showToast("success", "Limits saved successfully");
      setAddLimitsOpen(false);

      // Reload the limits for the current tier
      const res = await getTierLimitsByTierPlanId(payload.tierPlanId);
      const arr = res?.data?.data || res?.data || [];
      setTierLimits(Array.isArray(arr) ? arr : []);

      // Reopen the Manage Tier Limits modal
      setLimitsOpen(true);
    } catch (e) {
      showToast(
        "error",
        e?.response?.data?.message || e?.message || "Save limits failed"
      );
    } finally {
      setSavingLimits(false);
    }
  };

  const handleDeleteLimit = async (limitObj) => {
    const id = limitObj?.id || limitObj?._id;
    if (!id) return showToast("error", "Tier limit ID not found");

    try {
      setDeletingLimitId(id);
      await deleteTierLimitById(id);
      showToast("success", "Limit deleted successfully");

      // Update local state
      setTierLimits((p) => p.filter((x) => (x?.id || x?._id) !== id));

      // Close the modal
      setLimitsOpen(false);
      setSelectedTier(null);
      setTierLimits([]);
      setLimitNames({});

      // Reload tier data to reflect changes in UI
      await loadAll("reload");
    } catch (e) {
      showToast(
        "error",
        e?.response?.data?.message || e?.message || "Delete limit failed"
      );
    } finally {
      setDeletingLimitId(null);
    }
  };

  const cards = useMemo(() => {
    return tiers.map((tier) => {
      const title = tier?.title || "Tier";
      const Icon = iconForTier(title);
      const isPopular = String(title).toLowerCase().includes("pro");

      const monthly = tier?.monthlyPrice ?? tier?.monthly_price ?? 0;
      const yearly = tier?.yearlyPrice ?? tier?.yearly_price ?? 0;

      const feats = Array.isArray(tier?.features) ? tier.features : [];
      const limits = Array.isArray(tier?.tierPlanLimits)
        ? tier.tierPlanLimits
        : [];

      return { tier, title, Icon, isPopular, feats, limits, monthly, yearly };
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
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-60"
              >
                <RefreshCw size={16} className={reloading ? "animate-spin" : ""} />
                Refresh
              </button>

              <button
                onClick={() => setCreateOpen(true)}
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800"
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
            <p className="text-sm text-slate-500 mt-1">Create your first tier to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {cards.map(({ tier, title, Icon, isPopular, feats, limits, monthly, yearly }) => (
              <div
                key={tier?.id || tier?._id || title}
                className={cls(
                  "relative rounded-3xl border bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-slate-200"
                )}
              >
                {/* {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 px-4 py-1.5 text-xs font-extrabold text-white shadow-lg shadow-indigo-500/30">
                      <Star size={12} className="fill-white" />
                      MOST POPULAR
                    </span>
                  </div>
                )} */}

                {/* Card Header with Badge and Title */}
                <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-slate-50 via-white to-slate-50/50 p-6 pb-8">
                  {/* Background decoration */}
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
                          <p className="text-xs font-medium text-slate-500 mt-1">
                            {tier?.monthlyDurationInDays || 30}d / {tier?.yearlyDurationInDays || 365}d
                          </p>
                        </div>
                      </div>

                      <StatusPill status={tier?.status} />
                    </div>

                    {/* Pricing */}
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-slate-900 tracking-tight">
                          ₹{moneyIN(monthly)}
                        </span>
                        <span className="text-sm font-semibold text-slate-500">/ month</span>
                      </div>
                      <div className="text-sm font-medium text-slate-600">
                        Yearly: <span className="font-bold text-slate-900">₹{moneyIN(yearly)}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="mt-4 text-sm leading-relaxed text-slate-600 line-clamp-2">
                      {tier?.description || "No description"}
                    </p>
                  </div>
                </div>

                {/* Limits Section */}
                <div className="border-t border-slate-100 bg-white p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                      Limits
                    </h4>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                      {limits.length} configured
                    </span>
                  </div>

                  {limits.length === 0 ? (
                    <div className="mb-3 rounded-xl bg-slate-50 px-4 py-6 text-center">
                      <p className="text-xs font-medium text-slate-400 italic">No limits configured</p>
                    </div>
                  ) : (
                    <div className="space-y-2 mb-3">
                      {limits.slice(0, 3).map((l) => (
                        <div
                          key={l?.id || l?._id || l?.limitsName}
                          className="flex items-center justify-between rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white px-4 py-2.5 transition-all hover:border-slate-300"
                        >
                          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                            {l?.limitsName?.replace(/_/g, ' ')}
                          </span>
                          <span className={cls(
                            "rounded-lg px-2.5 py-1 text-xs font-extrabold",
                            String(l?.limitsValue).toLowerCase() === 'false'
                              ? "bg-rose-100 text-rose-700"
                              : String(l?.limitsValue).toLowerCase() === 'true'
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-900 text-white"
                          )}>
                            {String(l?.limitsValue ?? "—")}
                          </span>
                        </div>
                      ))}
                      {limits.length > 3 && (
                        <p className="text-xs font-semibold text-slate-400 text-center pt-1">
                          +{limits.length - 3} more limits
                        </p>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => openLimitsManager(tier)}
                    type="button"
                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
                  >
                    Manage Limits
                  </button>
                </div>

                {/* Features Section */}
                <div className="border-t border-slate-100 bg-white p-5 rounded-b-3xl">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                      Features
                    </h4>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                      {feats.length} added
                    </span>
                  </div>

                  {feats.length === 0 ? (
                    <div className="mb-4 rounded-xl bg-slate-50 px-4 py-6 text-center">
                      <p className="text-xs font-medium text-slate-400 italic">No features added yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2 mb-4 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                      {feats.map((f) => {
                        const fid = safeId(f);
                        const rowBusy = busyFeatureId && busyFeatureId === fid;

                        return (
                          <div
                            key={fid || f?.featureName}
                            className="group rounded-xl border border-slate-200 bg-gradient-to-r from-white to-slate-50/50 p-3 transition-all hover:border-slate-300 hover:shadow-sm"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2.5 min-w-0 flex-1">
                                <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 flex-shrink-0">
                                  <Check className="h-3 w-3 text-emerald-600" strokeWidth={3} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <p className="text-sm font-bold text-slate-900 leading-tight">
                                      {f?.featureName || "Feature"}
                                    </p>
                                    <FeatureStatusPill status={f?.status} />
                                  </div>
                                  <p className="text-xs leading-relaxed text-slate-500 line-clamp-2">
                                    {f?.featureDescription || ""}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => openEditFeature(f)}
                                  disabled={rowBusy}
                                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white transition-all hover:bg-slate-50 hover:border-slate-300 disabled:opacity-60"
                                  title="Edit"
                                  type="button"
                                >
                                  {rowBusy ? (
                                    <Loader2 size={13} className="animate-spin" />
                                  ) : (
                                    <Pencil size={13} className="text-slate-600" />
                                  )}
                                </button>

                                <button
                                  onClick={() => openDeleteFeature(f)}
                                  disabled={rowBusy}
                                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-rose-200 bg-white transition-all hover:bg-rose-50 hover:border-rose-300 disabled:opacity-60"
                                  title="Delete"
                                  type="button"
                                >
                                  {rowBusy ? (
                                    <Loader2 size={13} className="animate-spin" />
                                  ) : (
                                    <Trash2 size={13} className="text-rose-600" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <button
                    onClick={() => openFeatureModal(tier)}
                    type="button"
                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
                  >
                    <span className="inline-flex items-center gap-2">
                      <ListPlus size={16} /> Add Features
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateTierModal
        open={createOpen}
        form={form}
        setForm={setForm}
        createValid={createValid}
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
        onCreate={handleCreateTier}
      />

      <AddFeaturesModal
        open={featureOpen}
        selectedTier={selectedTier}
        featureList={featureList}
        setFeatureList={setFeatureList}
        featuresValid={featuresValid}
        savingFeatures={savingFeatures}
        onClose={() => {
          if (savingFeatures) return;
          setFeatureOpen(false);
          setSelectedTier(null);
          setFeatureList([{ featureName: "", featureDescription: "" }]);
        }}
        onCancel={() => {
          if (savingFeatures) return;
          setFeatureOpen(false);
          setSelectedTier(null);
        }}
        onSave={handleSaveFeatures}
      />

      <EditFeatureModal
        open={editOpen}
        selectedFeature={selectedFeature}
        editForm={editForm}
        setEditForm={setEditForm}
        editValid={editValid}
        savingEdit={savingEdit}
        onClose={() => {
          if (savingEdit) return;
          setEditOpen(false);
          setSelectedFeature(null);
        }}
        onCancel={() => {
          if (savingEdit) return;
          setEditOpen(false);
          setSelectedFeature(null);
        }}
        onUpdate={handleUpdateFeature}
      />

      <DeleteFeatureModal
        open={deleteOpen}
        selectedFeature={selectedFeature}
        deleting={deleting}
        onClose={() => {
          if (deleting) return;
          setDeleteOpen(false);
          setSelectedFeature(null);
        }}
        onCancel={() => {
          if (deleting) return;
          setDeleteOpen(false);
          setSelectedFeature(null);
        }}
        onDelete={handleDeleteFeature}
      />

      <TierLimitsModal
        open={limitsOpen}
        tierTitle={selectedTier?.title}
        limits={tierLimits}
        loading={limitsLoading}
        deletingId={deletingLimitId}
        onClose={() => {
          if (limitsLoading || deletingLimitId) return;
          setLimitsOpen(false);
          setSelectedTier(null);
          setTierLimits([]);
          setLimitNames({});
          setAddLimitsOpen(false);
        }}
        onAdd={() => setAddLimitsOpen(true)}
        onDelete={handleDeleteLimit}
      />

      <AddLimitsModal
        open={addLimitsOpen}
        tierPlanId={selectedTier?.id || selectedTier?._id}
        tierTitle={selectedTier?.title}
        saving={savingLimits}
        onClose={() => {
          if (savingLimits) return;
          setAddLimitsOpen(false);
        }}
        onCancel={() => {
          if (savingLimits) return;
          setAddLimitsOpen(false);
        }}
        onSave={handleSaveLimits}
      />
    </div>
  );
};

export default TierManagement;