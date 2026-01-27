import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, Save, Trash2, Activity, Zap, Layout, ShieldCheck } from "lucide-react";

import { getTierPlanById } from "../../../api/tierPlan.api";
import { getLimitsByTier, updateLimit, deleteLimit } from "../../../api/tierPlanLimits.api";
import { getFeaturesByTier, updateFeature, deleteFeature } from "../../../api/tierPlanFeatures.api";

const TierDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tier, setTier] = useState(null);
  const [limits, setLimits] = useState([]);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tierRes, limitsRes, featuresRes] = await Promise.all([
          getTierPlanById(id),
          getLimitsByTier(id),
          getFeaturesByTier(id)
        ]);
        setTier(tierRes.data.data);
        setLimits(limitsRes.data.data);
        setFeatures(featuresRes.data.data);
      } catch {
        toast.error("Failed to load tier data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleLimitChange = (index, field, value) => {
    const newLimits = [...limits];
    newLimits[index][field] = value;
    setLimits(newLimits);
  };

  const saveLimit = async (limit) => {
    try {
      await updateLimit(limit.id, { limitsName: limit.limitsName, limitsValue: limit.limitsValue });
      toast.success("Limit updated successfully");
    } catch {
      toast.error("Failed to update limit");
    }
  };

  const removeLimit = async (limitId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteLimit(limitId);
      setLimits(limits.filter((l) => l.id !== limitId));
      toast.success("Limit removed");
    } catch {
      toast.error("Failed to delete limit");
    }
  };

  const handleFeatureChange = (index, field, value) => {
    const newFeatures = [...features];
    newFeatures[index][field] = value;
    setFeatures(newFeatures);
  };

  const saveFeature = async (feature) => {
    try {
      await updateFeature(feature.id, {
        featureName: feature.featureName,
        featureDescription: feature.featureDescription,
      });
      toast.success("Feature updated");
    } catch {
      toast.error("Failed to update feature");
    }
  };

  const removeFeature = async (featureId) => {
    if (!window.confirm("Delete this feature?")) return;
    try {
      await deleteFeature(featureId);
      setFeatures(features.filter((f) => f.id !== featureId));
      toast.success("Feature deleted");
    } catch {
      toast.error("Deletion failed");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050810] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (!tier) return <div className="p-10 text-center text-red-500">Tier not found.</div>;

  return (
    <div className="min-h-screen bg-[#050810] text-slate-300 font-sans p-4 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Back Navigation */}
        <button 
          onClick={() => navigate("/admin/subscriptions/tiers")}
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Back to Dashboard</span>
        </button>

        {/* Tier Header */}
        <div className="bg-[#0B1120] border border-white/5 rounded-2xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <ShieldCheck size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 text-blue-500 font-bold text-xs uppercase tracking-widest mb-3">
              <Activity size={16} /> Tier Configuration
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">{tier.title}</h1>
            <p className="text-slate-400 mt-2 max-w-2xl leading-relaxed">{tier.description}</p>
            <div className="flex gap-4 mt-6">
              <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                <p className="text-[10px] uppercase font-bold text-slate-500">Monthly</p>
                <p className="text-white font-bold">₹{tier.monthlyPrice}</p>
              </div>
              <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                <p className="text-[10px] uppercase font-bold text-slate-500">Yearly</p>
                <p className="text-white font-bold">₹{tier.yearlyPrice}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Limits */}
        <section className="bg-[#0B1120] border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <Zap className="text-amber-500" size={20} />
            <h2 className="text-xl font-bold text-white">Usage Limits</h2>
          </div>
          <div className="p-6 space-y-4">
            {limits.map((limit, i) => (
              <div key={limit.id} className="flex flex-wrap md:flex-nowrap gap-3 items-center bg-white/[0.02] p-3 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                <input
                  type="text"
                  placeholder="Limit Name"
                  value={limit.limitsName}
                  onChange={(e) => handleLimitChange(i, "limitsName", e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 w-full md:w-1/3 focus:border-blue-500 focus:outline-none text-sm font-medium"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. 500)"
                  value={limit.limitsValue}
                  onChange={(e) => handleLimitChange(i, "limitsValue", e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 w-full md:w-1/3 focus:border-blue-500 focus:outline-none text-sm"
                />
                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={() => saveLimit(limit)}
                    className="p-2.5 bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white rounded-xl transition-all"
                    title="Save"
                  >
                    <Save size={18} />
                  </button>
                  <button
                    onClick={() => removeLimit(limit.id)}
                    className="p-2.5 bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white rounded-xl transition-all"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="bg-[#0B1120] border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <Layout className="text-purple-500" size={20} />
            <h2 className="text-xl font-bold text-white">Entitled Features</h2>
          </div>
          <div className="p-6 space-y-4">
            {features.map((feature, i) => (
              <div key={feature.id} className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-white/[0.02] p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                <div className="flex flex-col gap-3 w-full">
                  <input
                    type="text"
                    placeholder="Feature Title"
                    value={feature.featureName}
                    onChange={(e) => handleFeatureChange(i, "featureName", e.target.value)}
                    className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 w-full focus:border-purple-500 focus:outline-none transition-all text-sm font-bold text-white"
                  />
                  <textarea
                    placeholder="Describe feature..."
                    value={feature.featureDescription}
                    onChange={(e) => handleFeatureChange(i, "featureDescription", e.target.value)}
                    className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 w-full h-20 focus:border-purple-500 focus:outline-none transition-all text-sm text-slate-400 resize-none"
                  />
                </div>
                <div className="flex md:flex-col gap-2 w-full md:w-auto">
                  <button
                    onClick={() => saveFeature(feature)}
                    className="flex-1 md:flex-none p-3 bg-purple-600/10 text-purple-500 hover:bg-purple-600 hover:text-white rounded-xl transition-all flex items-center justify-center"
                  >
                    <Save size={18} />
                  </button>
                  <button
                    onClick={() => removeFeature(feature.id)}
                    className="flex-1 md:flex-none p-3 bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white rounded-xl transition-all flex items-center justify-center"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div className="mt-10 flex justify-center">
          <button 
            onClick={() => navigate("/admin/subscriptions/tiers")}
            className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-sm font-bold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TierDetail;
