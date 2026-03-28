import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Save,
  Trash2,
  Layout,
  Zap,
  ShieldCheck,
} from "lucide-react";

import { getTierPlanById } from "../../../api/tierPlan.api";
import {
  getLimitsByTier,
  updateLimit,
  deleteLimit,
} from "../../../api/tierPlanLimits.api";
import {
  getFeaturesByTier,
  updateFeature,
  deleteFeature,
} from "../../../api/tierPlanFeatures.api";

/* ================= COMPONENT ================= */
const TierDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tier, setTier] = useState(null);
  const [limits, setLimits] = useState([]);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [tierRes, limitsRes, featuresRes] = await Promise.all([
          getTierPlanById(id),
          getLimitsByTier(id),
          getFeaturesByTier(id),
        ]);
        setTier(tierRes.data?.data);
        setLimits(limitsRes.data?.data || []);
        setFeatures(featuresRes.data?.data || []);
      } catch {
        toast.error("Failed to load tier details");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  /* ================= HANDLERS ================= */
  const updateLimitState = (i, field, value) => {
    const copy = [...limits];
    copy[i][field] = value;
    setLimits(copy);
  };

  const updateFeatureState = (i, field, value) => {
    const copy = [...features];
    copy[i][field] = value;
    setFeatures(copy);
  };

  const saveLimit = async (l) => {
    try {
      await updateLimit(l.id, {
        limitsName: l.limitsName,
        limitsValue: l.limitsValue,
      });
      toast.success("Limit updated");
    } catch {
      toast.error("Update failed");
    }
  };

  const removeLimit = async (id) => {
    if (!window.confirm("Delete this limit?")) return;
    try {
      await deleteLimit(id);
      setLimits((p) => p.filter((l) => l.id !== id));
      toast.success("Limit removed");
    } catch {
      toast.error("Delete failed");
    }
  };

  const saveFeature = async (f) => {
    try {
      await updateFeature(f.id, {
        featureName: f.featureName,
        featureDescription: f.featureDescription,
      });
      toast.success("Feature updated");
    } catch {
      toast.error("Update failed");
    }
  };

  const removeFeature = async (id) => {
    if (!window.confirm("Delete this feature?")) return;
    try {
      await deleteFeature(id);
      setFeatures((p) => p.filter((f) => f.id !== id));
      toast.success("Feature deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================= STATES ================= */
  if (loading)
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/20 border-t-[#50A2FF] rounded-full animate-spin" />
      </div>
    );

  if (!tier)
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center text-red-500">
        Tier not found
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-gray-200 p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ================= BACK ================= */}
        <button
          onClick={() => navigate("/admin/subscriptions/tiers")}
          className="flex items-center gap-2 text-gray-400 hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to Tiers
        </button>

        {/* ================= HEADER CARD ================= */}
        <div className="relative bg-[#0E1424] border border-white/10 rounded-2xl p-8 overflow-hidden">
          <ShieldCheck
            size={140}
            className="absolute -top-10 -right-10 text-white/5"
          />

          <div className="relative">
            <h1 className="text-3xl font-bold text-white">{tier.title}</h1>
            <p className="text-gray-400 max-w-2xl mt-2">
              {tier.description}
            </p>

            <div className="flex gap-6 mt-6">
              <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-3">
                <p className="text-xs text-gray-400 uppercase">Monthly</p>
                <p className="text-white font-semibold">₹{tier.monthlyPrice}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-3">
                <p className="text-xs text-gray-400 uppercase">Yearly</p>
                <p className="text-white font-semibold">₹{tier.yearlyPrice}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= LIMITS ================= */}
        <section className="bg-[#0E1424] border border-white/10 rounded-2xl">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
            <Zap className="text-amber-500" size={18} />
            <h2 className="text-lg font-semibold text-white">
              Usage Limits
            </h2>
          </div>

          <div className="p-6 space-y-4">
            {limits.map((l, i) => (
              <div
                key={l.id}
                className="flex flex-wrap gap-3 items-center bg-white/5 border border-white/10 rounded-xl p-4"
              >
                <input
                  value={l.limitsName}
                  onChange={(e) =>
                    updateLimitState(i, "limitsName", e.target.value)
                  }
                  placeholder="Limit Name"
                  className="bg-[#0B0F1A] border border-white/10 rounded-xl px-4 py-2 w-full md:w-1/3"
                />

                <input
                  value={l.limitsValue}
                  onChange={(e) =>
                    updateLimitState(i, "limitsValue", e.target.value)
                  }
                  placeholder="Value"
                  className="bg-[#0B0F1A] border border-white/10 rounded-xl px-4 py-2 w-full md:w-1/3"
                />

                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={() => saveLimit(l)}
                    className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black"
                  >
                    <Save size={18} />
                  </button>
                  <button
                    onClick={() => removeLimit(l.id)}
                    className="p-2.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section className="bg-[#0E1424] border border-white/10 rounded-2xl">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
            <Layout className="text-purple-500" size={18} />
            <h2 className="text-lg font-semibold text-white">
              Features
            </h2>
          </div>

          <div className="p-6 space-y-4">
            {features.map((f, i) => (
              <div
                key={f.id}
                className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3"
              >
                <input
                  value={f.featureName}
                  onChange={(e) =>
                    updateFeatureState(i, "featureName", e.target.value)
                  }
                  placeholder="Feature Name"
                  className="bg-[#0B0F1A] border border-white/10 rounded-xl px-4 py-2 w-full font-medium"
                />

                <textarea
                  value={f.featureDescription}
                  onChange={(e) =>
                    updateFeatureState(i, "featureDescription", e.target.value)
                  }
                  placeholder="Feature description"
                  rows={3}
                  className="bg-[#0B0F1A] border border-white/10 rounded-xl px-4 py-2 w-full resize-none text-sm"
                />

                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => saveFeature(f)}
                    className="p-2.5 rounded-lg bg-[#50A2FF]/10 text-[#50A2FF] hover:bg-[#50A2FF] hover:text-black"
                  >
                    <Save size={18} />
                  </button>
                  <button
                    onClick={() => removeFeature(f.id)}
                    className="p-2.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <div className="flex justify-center pt-6">
          <button
            onClick={() => navigate("/admin/subscriptions/tiers")}
            className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TierDetail;
