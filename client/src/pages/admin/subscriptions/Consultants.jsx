import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Users, Mail, CreditCard, ChevronDown, UserCheck, Search, Filter } from "lucide-react";
import { getTierPlans } from "../../../api/tierPlan.api";
import axios from "../../../api/axios";

const Consultants = () => {
  const [consultants, setConsultants] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [consultantRes, tierRes] = await Promise.all([
          axios.get("/consultation/filter?status=ALL"),
          getTierPlans(),
        ]);

        setConsultants(consultantRes.data.data || []);
        setTiers(tierRes.data.data || []);
      } catch (err) {
        toast.error("Failed to load ecosystem data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* ================= ASSIGN TIER ================= */
  const assignTier = async (consultantId, tierPlanId) => {
    try {
      await axios.patch(`/consultation/change-tier/${consultantId}`, {
        tierPlanId,
      });

      toast.success("Consultant tier updated");

      setConsultants((prev) =>
        prev.map((c) =>
          c.id === consultantId ? { ...c, tierPlanId } : c
        )
      );
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  const filteredConsultants = consultants.filter(c => 
    (c.fullName || c.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Syncing Members...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#050810] text-slate-300 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER & SEARCH */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 text-blue-500 font-bold text-xs mb-2 uppercase tracking-[0.2em]">
              <UserCheck size={16} /> Member Management
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">
              Consultants
            </h1>
            <p className="text-slate-500 mt-2 text-lg font-medium">
              Oversee consultant access levels and subscription assignments.
            </p>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#0B1120] border border-white/5 rounded-2xl py-3 pl-12 pr-6 w-full md:w-80 text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600 shadow-xl"
            />
          </div>
        </div>

        {/* TABLE CONTAINER */}
        <div className="bg-[#0B1120] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-white/[0.02]">
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Identity</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Contact Details</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Subscription Status</th>
                  <th className="px-8 py-6 text-right text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Access Assignment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filteredConsultants.map((c) => {
                  const currentTier = tiers.find((t) => t.id === c.tierPlanId);
                  
                  return (
                    <tr key={c.id} className="hover:bg-white/[0.02] transition-all group">
                      {/* Name & Avatar */}
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-blue-400 font-bold text-lg">
                            {(c.fullName || c.name || "?").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-white text-base leading-none mb-1">
                              {c.fullName || c.name}
                            </p>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">ID: {c.id.slice(-6)}</span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Mail size={14} className="opacity-50" />
                          <span className="text-sm font-medium">{c.email}</span>
                        </div>
                      </td>

                      {/* Current Tier Info */}
                      <td className="px-8 py-6">
                        {currentTier ? (
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                            <span className="text-[11px] font-black text-blue-400 uppercase tracking-wider">
                              {currentTier.title}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-600 text-xs italic">No tier assigned</span>
                        )}
                      </td>

                      {/* Action - Tier Select */}
                      <td className="px-8 py-6 text-right">
                        <div className="relative inline-block w-48 text-left">
                          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-500">
                            <ChevronDown size={14} />
                          </div>
                          <select
                            className="appearance-none bg-[#050810] border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-xs font-bold text-white w-full focus:outline-none focus:border-blue-500 transition-all cursor-pointer hover:border-white/20 shadow-inner"
                            value={c.tierPlanId || ""}
                            onChange={(e) => assignTier(c.id, e.target.value)}
                          >
                            <option value="" className="bg-[#0B1120]">Unassigned</option>
                            {tiers.map((t) => (
                              <option key={t.id} value={t.id} className="bg-[#0B1120]">
                                {t.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredConsultants.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-30">
                        <Users size={64} strokeWidth={1} />
                        <p className="text-xl font-light italic">No matching consultants found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER INFO */}
        <div className="mt-8 flex justify-between items-center px-6">
          <p className="text-slate-500 text-xs font-medium">
            Showing <span className="text-slate-300">{filteredConsultants.length}</span> active consultants
          </p>
          <div className="flex gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Sync Enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Consultants;