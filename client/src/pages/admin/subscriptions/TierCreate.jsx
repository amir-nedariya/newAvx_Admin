import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Save, XCircle, Shield, Zap, Info, CreditCard } from "lucide-react";
import { createTierPlan } from "../../../api/tierPlan.api";
import { toast } from "react-toastify";

// Default States
const defaultLimit = { limitsName: "", limitsValue: "" };
const defaultFeature = { featureName: "", featureDescription: "" };

const TierCreate = () => {
  const navigate = useNavigate();

  // Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [monthlyPrice, setMonthlyPrice] = useState("");
  const [yearlyPrice, setYearlyPrice] = useState("");
  const [monthlyDuration, setMonthlyDuration] = useState(30);
  const [yearlyDuration, setYearlyDuration] = useState(365);
  const [status, setStatus] = useState("ACTIVE");
  const [tierBadgeUrl, setTierBadgeUrl] = useState("");
  const [limits, setLimits] = useState([defaultLimit]);
  const [features, setFeatures] = useState([defaultFeature]);
  const [loading, setLoading] = useState(false);

  // Dynamic Handlers
  const handleAddLimit = () => setLimits([...limits, { ...defaultLimit }]);
  const handleRemoveLimit = (idx) => setLimits(limits.filter((_, i) => i !== idx));
  const handleAddFeature = () => setFeatures([...features, { ...defaultFeature }]);
  const handleRemoveFeature = (idx) => setFeatures(features.filter((_, i) => i !== idx));

  // Save Tier
  const handleSave = async () => {
    if (!title || !monthlyPrice || !yearlyPrice) {
      toast.error("Title, Monthly, and Yearly prices are required!");
      return;
    }

    const payload = {
      title,
      description,
      monthly_price: parseFloat(monthlyPrice),
      yearly_price: parseFloat(yearlyPrice),
      monthlyDurationInDays: parseInt(monthlyDuration),
      yearlyDurationInDays: parseInt(yearlyDuration),
      status,
      tierBadgeUrl,
      tierPlanLimits: limits.filter((l) => l.limitsName && l.limitsValue),
      features: features.filter((f) => f.featureName),
    };

    setLoading(true);
    try {
      await createTierPlan(payload);
      toast.success("Tier Created Successfully!");
      navigate("/admin/subscriptions/tiers");
    } catch (err) {
      const msg = err.response?.data?.message || "Internal Server Error";
      toast.error(msg);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Reusable Input Field
  const InputField = ({ label, value, setValue, type = "text", placeholder = "" }) => (
    <div className="space-y-1">
      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl bg-[#050810] border border-white/10 text-white text-sm focus:border-blue-500 focus:outline-none transition"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050810] p-6 lg:p-10 text-slate-300 font-sans selection:bg-blue-500/30">
      <div className="max-w-[1100px] mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">Create New Tier</h1>
            <p className="text-slate-500 mt-1">Set pricing, limits, and features for your subscription tier.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate("/admin/subscriptions/tiers")} className="px-6 py-2.5 rounded-xl border border-white/10 font-bold text-sm hover:bg-white/5 transition">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-50 transition"
            >
              <Save size={18} /> {loading ? "Saving..." : "Save Tier"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT PANEL */}
          <div className="lg:col-span-8 space-y-8">

            {/* 1. Identity & Description */}
            <div className="bg-[#0B1120] border border-white/5 p-8 rounded-[2rem] shadow-xl space-y-6">
              <div className="flex items-center gap-2 text-blue-500 font-bold text-xs uppercase tracking-widest">
                <Shield size={16} /> Identity
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Title" value={title} setValue={setTitle} placeholder="Tier Name" />
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#050810] border border-white/10 text-white text-sm font-bold focus:border-blue-500 focus:outline-none transition"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Describe this tier..."
                    className="w-full px-4 py-3 rounded-2xl bg-[#050810] border border-white/10 text-white text-sm resize-none focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 2. Limits */}
            <div className="bg-[#0B1120] border border-white/5 p-8 rounded-[2rem] shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-widest">
                  <Zap size={16} /> Limits
                </div>
                <button
                  onClick={handleAddLimit}
                  className="flex items-center gap-1 text-emerald-500 hover:text-white text-xs font-bold bg-emerald-500/5 px-3 py-1.5 rounded-lg border border-emerald-500/10 transition-colors"
                >
                  <Plus size={14} /> Add Limit
                </button>
              </div>
              <div className="space-y-3">
                {limits.map((l, idx) => (
                  <div key={idx} className="flex gap-3 items-center group">
                    <input
                      value={l.limitsName}
                      onChange={(e) => setLimits(limits.map((item, i) => i === idx ? { ...item, limitsName: e.target.value } : item))}
                      placeholder="Limit Name"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-[#050810] border border-white/10 text-white text-sm focus:border-emerald-500 focus:outline-none"
                    />
                    <input
                      value={l.limitsValue}
                      onChange={(e) => setLimits(limits.map((item, i) => i === idx ? { ...item, limitsValue: e.target.value } : item))}
                      placeholder="Value"
                      className="w-36 px-4 py-2.5 rounded-xl bg-[#050810] border border-white/10 text-white text-sm text-center focus:border-emerald-500 focus:outline-none"
                    />
                    <button onClick={() => handleRemoveLimit(idx)} className="p-2 text-slate-700 hover:text-rose-500 transition">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Features */}
            <div className="bg-[#0B1120] border border-white/5 p-8 rounded-[2rem] shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-500 font-bold text-xs uppercase tracking-widest">
                  <Info size={16} /> Features
                </div>
                <button
                  onClick={handleAddFeature}
                  className="flex items-center gap-1 text-purple-500 hover:text-white text-xs font-bold bg-purple-500/5 px-3 py-1.5 rounded-lg border border-purple-500/10 transition-colors"
                >
                  <Plus size={14} /> Add Feature
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((f, idx) => (
                  <div key={idx} className="bg-[#050810] p-4 rounded-2xl border border-white/5 relative space-y-2">
                    <input
                      value={f.featureName}
                      onChange={(e) => setFeatures(features.map((item, i) => i === idx ? { ...item, featureName: e.target.value } : item))}
                      placeholder="Feature Title"
                      className="w-full bg-transparent font-bold text-white focus:outline-none border-b border-white/5 pb-1 text-sm"
                    />
                    <textarea
                      value={f.featureDescription}
                      onChange={(e) => setFeatures(features.map((item, i) => i === idx ? { ...item, featureDescription: e.target.value } : item))}
                      placeholder="Feature Description"
                      rows={2}
                      className="w-full bg-transparent text-xs text-slate-500 focus:outline-none resize-none pt-1"
                    />
                    <button onClick={() => handleRemoveFeature(idx)} className="absolute top-3 right-3 text-slate-800 hover:text-rose-500">
                      <XCircle size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-[#0B1120] border border-white/5 p-8 rounded-[2rem] shadow-xl sticky top-10 space-y-6">
              <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-widest">
                <CreditCard size={16} /> Pricing & Badge
              </div>
              <InputField label="Monthly Price (₹)" value={monthlyPrice} setValue={setMonthlyPrice} />
              <InputField label="Yearly Price (₹)" value={yearlyPrice} setValue={setYearlyPrice} />
              <InputField label="Monthly Cycle (Days)" value={monthlyDuration} setValue={setMonthlyDuration} />
              <InputField label="Yearly Cycle (Days)" value={yearlyDuration} setValue={setYearlyDuration} />
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Badge URL</label>
                <input
                  value={tierBadgeUrl}
                  onChange={(e) => setTierBadgeUrl(e.target.value)}
                  placeholder="Paste badge image URL"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#050810] border border-white/10 text-white text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="bg-blue-500/5 border border-blue-500/10 p-3 rounded-xl text-[10px] text-blue-400 font-medium">
                Monthly & Yearly durations are typically 30 & 365 days for standard tiers.
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TierCreate;
