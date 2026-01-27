import { useEffect, useState } from "react";
import { Plus, Layers, Package, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getTierPlans } from "../../../api/tierPlan.api";

const TierList = () => {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getTierPlans()
      .then((res) => {
        setTiers(res.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 p-4 lg:p-8 font-sans">
      <div className="max-w-[1200px] mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <Layers className="text-blue-500" size={28} /> Tier Plans
          </h1>
          <button
            onClick={() => navigate("/admin/subscriptions/tiers/create")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-600/20 text-sm"
          >
            <Plus size={18} /> Create Tier
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-[#0B1120] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white/[0.02] border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-tighter w-[30%]">Plan Name</th>
                  <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-tighter w-[20%]">Pricing</th>
                  <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-tighter w-[30%]">Limits</th>
                  <th className="px-6 py-4 text-center font-bold text-slate-500 uppercase tracking-tighter w-[10%]">Status</th>
                  <th className="px-6 py-4 text-right font-bold text-slate-500 uppercase tracking-tighter w-[10%]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-20 text-center animate-pulse text-slate-500">
                      Loading tier plans...
                    </td>
                  </tr>
                ) : tiers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-20 text-center text-slate-600 italic">
                      No tier plans available.
                    </td>
                  </tr>
                ) : (
                  tiers.map((tier) => (
                    <tr key={tier.id} className="hover:bg-white/[0.01] transition-all group">
                      {/* Name & Badge */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-800 border border-white/10 overflow-hidden">
                            {tier.tierBadgeUrl ? (
                              <img src={tier.tierBadgeUrl} className="h-full w-full object-cover" alt={tier.title} />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-slate-600">
                                <Package size={18} />
                              </div>
                            )}
                          </div>
                          <div className="truncate">
                            <p className="font-bold text-white truncate">{tier.title}</p>
                            <p className="text-[11px] text-slate-500 truncate max-w-[150px]">{tier.description}</p>
                          </div>
                        </div>
                      </td>

                      {/* Pricing */}
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-white font-bold text-base">₹{tier.monthlyPrice}</span>
                          <span className="text-[10px] text-blue-500 font-bold uppercase tracking-tight">
                            Yearly: ₹{tier.yearlyPrice}
                          </span>
                        </div>
                      </td>

                      {/* Limits */}
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-1.5">
                          {tier.tierPlanLimits.map((limit) => (
                            <span
                              key={limit.id}
                              className="text-[10px] font-medium bg-white/5 border border-white/5 px-2 py-0.5 rounded-md text-slate-400"
                            >
                              {limit.limitsValue} {limit.limitsName.replace(/_/g, " ")}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                            tier.status === "ACTIVE"
                              ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20"
                              : "bg-rose-500/5 text-rose-500 border-rose-500/20"
                          }`}
                        >
                          {tier.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => navigate(`/admin/subscriptions/tiers/${tier.id}`)}
                          className="p-2 rounded-lg bg-white/5 text-slate-400 hover:bg-white hover:text-black transition-all"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TierList;
