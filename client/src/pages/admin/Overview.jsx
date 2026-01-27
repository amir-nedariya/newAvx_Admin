import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Car,
  ClipboardList,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

/* ================= VARIANTS ================= */

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const card = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
  hover: { y: -4 },
};

/* ================= DATA ================= */

const stats = [
  {
    title: "Pending Consultants",
    value: 12,
    hint: "Requires approval",
    icon: Users,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Live Vehicles",
    value: "4,210",
    hint: "Currently visible",
    icon: Car,
    gradient: "from-emerald-500 to-green-500",
  },
  {
    title: "Inspections Today",
    value: 86,
    hint: "Scheduled",
    icon: ClipboardList,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Inquiries Today",
    value: "1,420",
    hint: "Buyer activity",
    icon: MessageSquare,
    gradient: "from-orange-500 to-amber-500",
  },
];

const revenue = [
  { label: "Subscriptions", value: "₹3.2L", trend: "+12%" },
  { label: "Inspections", value: "₹1.1L", trend: "+6%" },
  { label: "PPC Revenue", value: "₹78K", trend: "-2%" },
];

const alerts = [
  {
    text: "4 consultants breached response SLA",
    type: "critical",
  },
  {
    text: "7 vehicles flagged for manual review",
    type: "warning",
  },
];

/* ================= COMPONENT ================= */

const AdminOverview = () => {
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-gray-200 p-6 space-y-12">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-semibold tracking-tight">
          Admin Command Center
        </h1>
        <p className="text-sm text-gray-400">
          Real-time platform health & risk monitoring
        </p>
      </motion.div>

      {/* TODAY STATS */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
      >
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={i}
              variants={card}
              whileHover="hover"
              className="rounded-2xl p-5 bg-white/5 backdrop-blur-xl
              border border-white/10 hover:border-white/20 transition"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center
                bg-gradient-to-r ${s.gradient}`}
              >
                <Icon size={22} />
              </div>

              <p className="mt-4 text-sm text-gray-400">{s.title}</p>

              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{s.value}</p>
                <ArrowUpRight size={16} className="text-gray-500" />
              </div>

              <p className="text-xs text-gray-500 mt-1">{s.hint}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* REVENUE SNAPSHOT */}
      <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-white/10">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-green-400" />
          <h2 className="text-lg font-semibold">Revenue Pulse</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {revenue.map((r, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -3 }}
              className="rounded-xl p-4 bg-black/30 border border-white/10
              hover:border-white/20 transition"
            >
              <p className="text-sm text-gray-400">{r.label}</p>
              <p className="text-xl font-semibold mt-1">{r.value}</p>
              <p
                className={`text-xs mt-1 ${
                  r.trend.startsWith("-")
                    ? "text-red-400"
                    : "text-green-400"
                }`}
              >
                {r.trend} vs yesterday
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ALERTS */}
      <div className="rounded-2xl p-6 bg-red-500/10 border border-red-500/20">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="text-red-400" />
          <h2 className="text-lg font-semibold text-red-300">
            Attention Required
          </h2>
        </div>

        <ul className="space-y-3 text-sm">
          {alerts.map((a, i) => (
            <li
              key={i}
              className={`flex items-start gap-2 ${
                a.type === "critical"
                  ? "text-red-300"
                  : "text-yellow-300"
              }`}
            >
              ⚠️ {a.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminOverview;
