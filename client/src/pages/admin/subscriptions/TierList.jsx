import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Eye } from "lucide-react";
import { getTierPlans } from "../../../api/tierPlan.api";

/* ================= ANIMATION ================= */
const rowAnim = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

/* ================= STATUS STYLES ================= */
const statusStyles = {
  ACTIVE: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30",
  INACTIVE: "bg-red-500/10 text-red-500 border border-red-500/30",
};

/* ================= COMPONENT ================= */
const TierList = () => {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getTierPlans()
      .then((res) => {
        setTiers(res.data?.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-gray-200 p-8">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Tier Plans</h1>
          <p className="text-gray-400">
            Manage subscription tiers & pricing
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/subscriptions/tiers/create")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#50A2FF] text-black font-medium hover:opacity-90"
        >
          <Plus size={18} />
          Create Tier
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[900px]">
          <thead className="bg-[#0E1424] text-xs text-gray-400 uppercase">
            <tr>
              <th className="px-6 py-3 text-left">Plan</th>
              <th className="px-6 py-3 text-center">Monthly</th>
              <th className="px-6 py-3 text-center">Yearly</th>
              <th className="px-6 py-3 text-left">Limits</th>
              <th className="px-6 py-3 text-center">Status</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="py-10 text-center text-gray-400">
                  Loading tier plans...
                </td>
              </tr>
            ) : tiers.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-10 text-center text-gray-400">
                  No tier plans available
                </td>
              </tr>
            ) : (
              tiers.map((tier) => (
                <motion.tr
                  key={tier.id}
                  variants={rowAnim}
                  initial="hidden"
                  animate="show"
                  className="border-b border-white/10 hover:bg-white/5"
                >
                  {/* PLAN */}
                  <td className="px-6 py-4">
                    <p className="font-semibold text-white">
                      {tier.title}
                    </p>
                    <p className="text-sm text-gray-400">
                      {tier.description}
                    </p>
                  </td>

                  {/* PRICING */}
                  <td className="px-6 py-4 text-center font-medium">
                    ₹{tier.monthlyPrice}
                  </td>
                  <td className="px-6 py-4 text-center font-medium">
                    ₹{tier.yearlyPrice}
                  </td>

                  {/* LIMITS */}
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {tier.tierPlanLimits?.length === 0 ? (
                      <span className="text-gray-500">No limits</span>
                    ) : (
                      <ul className="space-y-1">
                        {tier.tierPlanLimits.map((limit) => (
                          <li key={limit.id}>
                            <span className="text-gray-400">
                              {limit.limitsName}:
                            </span>{" "}
                            <span className="text-white">
                              {limit.limitsValue}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        statusStyles[tier.status] ||
                        "bg-gray-500/10 text-gray-400"
                      }`}
                    >
                      {tier.status}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() =>
                        navigate(`/admin/subscriptions/tiers/${tier.id}`)
                      }
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TierList;
