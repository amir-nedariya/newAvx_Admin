import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Car,
  ClipboardList,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  LayoutDashboard
} from "lucide-react";

/* ================= ANIMATION VARIANTS ================= */
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 12 } }
};

/* ================= DATA ================= */
const stats = [
  {
    title: "Pending Consultants",
    value: 12,
    hint: "Requires approval",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Live Vehicles",
    value: "3,210",
    hint: "Currently active",
    icon: Car,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    title: "Inspections Today",
    value: 86,
    hint: "Scheduled tasks",
    icon: ClipboardList,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    title: "Inquiries Today",
    value: "1,420",
    hint: "High buyer intent",
    icon: MessageSquare,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
];

const revenue = [
  { label: "Subscriptions", value: "₹3.2L", trend: "+12.5%", positive: true },
  { label: "Inspections", value: "₹1.1L", trend: "+6.2%", positive: true },
  { label: "PPC Revenue", value: "₹17K", trend: "-2.1%", positive: false },
];

/* ================= COMPONENT ================= */
const AdminOverview = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 md:p-10 font-sans text-slate-900">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-blue-600 p-1.5 rounded-lg flex items-center justify-center">
              <LayoutDashboard size={18} className="text-white" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Overview</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Admin Command Center
          </h1>
          <p className="text-slate-500 mt-1">Platform metrics and real-time monitoring</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm text-slate-600">
            Last updated: Just now
          </span>
        </div>
      </div>

      {/* STATS GRID */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
      >
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={i}
              variants={item}
              whileHover={{ y: -5, scale: 1.03 }}
              className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-2xl ${s.bg} ${s.color}`}>
                  <Icon size={24} strokeWidth={2.5} />
                </div>
                <ArrowUpRight className="text-slate-300" size={20} />
              </div>
              <div className="mt-6">
                <p className="text-sm font-medium text-slate-500 mb-1">{s.title}</p>
                <h3 className="text-3xl font-bold text-slate-900 leading-none">{s.value}</h3>
                <div className="mt-3 flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{s.hint}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* REVENUE SECTION */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <TrendingUp className="text-emerald-600" size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Revenue Pulse</h2>
            </div>
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition">View Details</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {revenue.map((r, i) => (
              <div key={i} className="group p-5 rounded-2xl bg-[#FBFBFC] hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-lg transition-all duration-300">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{r.label}</p>
                <p className="text-2xl font-bold text-slate-900 mb-2">{r.value}</p>
                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold ${
                  r.positive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                }`}>
                  {r.positive ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
                  {r.trend}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminOverview;
 