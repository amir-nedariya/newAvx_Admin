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

      setLimitNames(namesRes?.data?.data || {});
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

      const res = await getTierLimitsByTierPlanId(payload.tierPlanId);
      const arr = res?.data?.data || res?.data || [];
      setTierLimits(Array.isArray(arr) ? arr : []);
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
      showToast("success", "Limit deleted");
      setTierLimits((p) => p.filter((x) => (x?.id || x?._id) !== id));
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-10">
      <Toast show={toast.show} type={toast.type} text={toast.text} />

      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Tier Management"
          subtitle="Create tiers and manage tier plan features + limits"
          actions={
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                onClick={() => loadAll("reload")}
                disabled={reloading}
                type="button"
              >
                <span className="inline-flex items-center gap-2">
                  <RefreshCw size={16} className={reloading ? "animate-spin" : ""} />
                  Refresh
                </span>
              </Button>

              <Button onClick={() => setCreateOpen(true)} type="button">
                <span className="inline-flex items-center gap-2">
                  <Plus size={16} /> Create New Tier
                </span>
              </Button>
            </div>
          }
        />

        {loading ? (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-10 flex items-center gap-3">
            <Loader2 className="animate-spin" />
            <p className="text-gray-600 font-semibold">Loading tiers...</p>
          </div>
        ) : cards.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-10">
            <p className="text-gray-700 font-semibold">No tiers found.</p>
            <p className="text-gray-500 text-sm mt-1">Create a tier to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {cards.map(({ tier, title, Icon, isPopular, feats, limits, monthly, yearly }) => (
              <div
                key={tier?.id || tier?._id || title}
                className={cls(
                  "relative bg-white rounded-3xl border shadow-sm hover:shadow-xl transition-all duration-300 p-8",
                  isPopular ? "border-blue-600 scale-[1.02]" : "border-gray-200"
                )}
              >
                {isPopular ? (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-4 py-1 rounded-full font-semibold shadow">
                    MOST POPULAR
                  </div>
                ) : null}

                <div className="flex items-center justify-between gap-3 mb-6">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-md overflow-hidden">
                      {tier?.tierBadgeUrl || tier?.badgeUrl || tier?.badgeLogoUrl ? (
                        <img
                          src={tier?.tierBadgeUrl || tier?.badgeUrl || tier?.badgeLogoUrl}
                          alt="tier badge"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Icon className="text-white" size={22} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 truncate">{title}</h3>
                      <p className="text-sm text-gray-500">
                        {tier?.monthlyDurationInDays || 30} days /{" "}
                        {tier?.yearlyDurationInDays || 365} days
                      </p>
                    </div>
                  </div>

                  <StatusPill status={tier?.status} />
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-gray-900">
                    ₹{moneyIN(monthly)}
                  </span>
                  <span className="text-gray-500 text-sm ml-2">/ month</span>

                  <div className="mt-2 text-sm text-gray-600">
                    Yearly:{" "}
                    <span className="font-bold text-gray-900">₹{moneyIN(yearly)}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-6 line-clamp-3">
                  {tier?.description || "—"}
                </p>

                <div className="mb-6">
                  <p className="text-sm font-bold text-gray-900 mb-2">Limits</p>
                  {limits.length === 0 ? (
                    <p className="text-sm text-gray-500">No limits</p>
                  ) : (
                    <div className="space-y-2">
                      {limits.slice(0, 4).map((l) => (
                        <div
                          key={l?.id || l?._id || l?.limitsName}
                          className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2"
                        >
                          <span className="text-[12px] font-semibold text-gray-700">
                            {l?.limitsName}
                          </span>
                          <span className="text-[12px] font-extrabold text-gray-900">
                            {String(l?.limitsValue ?? "—")}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    variant="secondary"
                    className="w-full mt-3"
                    onClick={() => openLimitsManager(tier)}
                    type="button"
                  >
                    Manage Limits
                  </Button>
                </div>

                <div className="space-y-3 mb-6">
                  <p className="text-sm font-bold text-gray-900">Features</p>

                  {feats.length === 0 ? (
                    <p className="text-sm text-gray-500">No features added yet.</p>
                  ) : (
                    feats.slice(0, 6).map((f) => {
                      const fid = safeId(f);
                      const rowBusy = busyFeatureId && busyFeatureId === fid;

                      return (
                        <div
                          key={fid || f?.featureName}
                          className="rounded-2xl border border-gray-200 bg-white p-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2 min-w-0">
                              <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="text-sm font-extrabold text-gray-900">
                                    {f?.featureName || "Feature"}
                                  </p>
                                  <FeatureStatusPill status={f?.status} />
                                </div>
                                <p className="text-[12px] text-gray-500 mt-0.5">
                                  {f?.featureDescription || ""}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button
                                onClick={() => openEditFeature(f)}
                                disabled={rowBusy}
                                className="w-9 h-9 rounded-xl border border-gray-200 hover:bg-gray-50 flex items-center justify-center disabled:opacity-60"
                                title="Edit feature"
                                type="button"
                              >
                                {rowBusy ? (
                                  <Loader2 size={16} className="animate-spin" />
                                ) : (
                                  <Pencil size={16} className="text-gray-700" />
                                )}
                              </button>

                              <button
                                onClick={() => openDeleteFeature(f)}
                                disabled={rowBusy}
                                className="w-9 h-9 rounded-xl border border-rose-200 hover:bg-rose-50 flex items-center justify-center disabled:opacity-60"
                                title="Delete feature"
                                type="button"
                              >
                                {rowBusy ? (
                                  <Loader2 size={16} className="animate-spin" />
                                ) : (
                                  <Trash2 size={16} className="text-rose-700" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => openFeatureModal(tier)}
                  type="button"
                >
                  <span className="inline-flex items-center gap-2">
                    <ListPlus size={16} /> Add Features
                  </span>
                </Button>
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
        limitNames={limitNames}
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