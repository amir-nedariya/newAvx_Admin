import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone,
  IndianRupee,
  ClipboardList,
  ShieldOff,
  Clock,
  Eye,
  Check,
  X,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import PPCCampaigns from "./PPCCampaigns";

/* ─── DATA ─────────────────────────────────────────────────────── */
const stats = [
  {
    label: "Active campaigns",
    value: "48",
    sub: "↑ 6 this week",
    positive: true,
    icon: Megaphone,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    label: "Revenue today",
    value: "₹4,440",
    sub: "↑ 18% vs yesterday",
    positive: true,
    icon: IndianRupee,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    label: "Pending review",
    value: "5",
    sub: "Needs attention",
    positive: false,
    icon: ClipboardList,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    valueColor: "text-red-500",
  },
  {
    label: "Overridden ads",
    value: "3",
    sub: "Admin disabled",
    positive: null,
    icon: ShieldOff,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-500",
  },
];

const recentPendingRequests = [
  {
    id: "M-002",
    consultant: "Ravi Mehta",
    company: "Speed Autos",
    initials: "RM",
    avatarColor: "bg-red-100 text-red-700",
    vehicle: "Fortuner 2022",
    vehicleDetail: "₹35L · 22,100 km",
    placement: "Homepage",
    type: "CPC",
    budget: 800,
    submittedMins: 420,
    slaBreached: true,
  },
  {
    id: "M-004",
    consultant: "Priya Autos",
    company: "Priya Automobiles",
    initials: "PA",
    avatarColor: "bg-indigo-100 text-indigo-700",
    vehicle: "Honda Amaze 2022",
    vehicleDetail: "₹8.5L · 14,300 km",
    placement: "Vehicle detail",
    type: "CPI",
    budget: 150,
    submittedMins: 310,
    slaBreached: true,
  },
  {
    id: "M-001",
    consultant: "Suresh K.",
    company: "City Cars",
    initials: "SK",
    avatarColor: "bg-amber-100 text-amber-700",
    vehicle: "Audi A4 2021",
    vehicleDetail: "₹38L · 18,700 km",
    placement: "Consultant page",
    type: "CPC",
    budget: 300,
    submittedMins: 120,
    slaBreached: false,
  },
];

const placementData = [
  { name: "Homepage", revenue: 2140, type: "CPC", color: "#10B981" },
  { name: "Search", revenue: 1480, type: "CPC+CPI", color: "#3B82F6" },
  { name: "Vehicle Detail", revenue: 820, type: "CPI", color: "#F59E0B" },
];

/* ─── CUSTOM TOOLTIP ───────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-sm">
        <p className="font-semibold text-slate-800 mb-1">{label}</p>
        <p className="text-emerald-600 font-bold">₹{payload[0].value.toLocaleString()}</p>
        <p className="text-xs text-slate-400 mt-0.5">{payload[0].payload.type}</p>
      </div>
    );
  }
  return null;
};

/* ─── APPROVE MODAL ─────────────────────────────────────────────── */
const ApproveModal = ({ item, onClose, onConfirm }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden text-left"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <p className="font-semibold text-slate-800">Approve campaign</p>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-700 leading-relaxed">
            Campaign will go live immediately after approval. Budget will be reserved from consultant wallet.
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1.5">Campaign</p>
            <div className="px-3 py-2 bg-slate-50 rounded-lg text-sm font-semibold text-slate-800">
              {item.company} — {item.vehicle} · {item.placement} · {item.type}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1.5">Approval notes (optional)</p>
            <textarea rows={2} placeholder="Any notes for internal record…" className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 resize-none text-slate-700" />
          </div>
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-100 bg-slate-50/50">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-slate-600 hover:bg-slate-100 transition">Cancel</button>
          <button onClick={onConfirm} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition">
            <Check size={14} /> Approve & go live
          </button>
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

/* ─── REJECT MODAL ──────────────────────────────────────────────── */
const RejectModal = ({ item, onClose, onConfirm }) => {
  const [reason, setReason] = useState("");
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.93, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.93, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden text-left"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <p className="font-semibold text-slate-800">Reject campaign</p>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition"><X size={16} /></button>
          </div>
          <div className="p-5 space-y-4">
            <div className="p-3 bg-red-50 rounded-xl text-xs text-red-700 leading-relaxed">
              The campaign will be rejected and the consultant will be notified with the reason provided.
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1.5">Campaign</p>
              <div className="px-3 py-2 bg-slate-50 rounded-lg text-sm font-semibold text-slate-800">
                {item.company} — {item.vehicle}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1.5">Rejection reason</p>
              <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 text-slate-700">
                <option value="">Select a reason…</option>
                <option>Misleading ad content</option>
                <option>Vehicle information mismatch</option>
                <option>Insufficient wallet balance</option>
                <option>Policy violation</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-100 bg-slate-50/50">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-slate-600 hover:bg-slate-100 transition">Cancel</button>
            <button onClick={onConfirm} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition">
              <X size={14} /> Reject
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─── CONTAINER VARIANTS ───────────────────────────────────────── */
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } },
};

/* ─── COMPONENT ────────────────────────────────────────────────── */
const PPCDashboard = () => {
  const [pendingRequests, setPendingRequests] = useState(recentPendingRequests);
  const [approveItem, setApproveItem] = useState(null);
  const [rejectItem, setRejectItem] = useState(null);

  const handleApprove = () => {
    setPendingRequests((prev) => prev.filter((i) => i.id !== approveItem.id));
    setApproveItem(null);
  };

  const handleReject = () => {
    setPendingRequests((prev) => prev.filter((i) => i.id !== rejectItem.id));
    setRejectItem(null);
  };

  return (
    <div className="space-y-6">
      {approveItem && (
        <ApproveModal
          item={approveItem}
          onClose={() => setApproveItem(null)}
          onConfirm={handleApprove}
        />
      )}
      {rejectItem && (
        <RejectModal
          item={rejectItem}
          onClose={() => setRejectItem(null)}
          onConfirm={handleReject}
        />
      )}

      {/* ── STAT CARDS ── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={i}
              variants={item}
              whileHover={{ y: -4, boxShadow: "0 12px 32px -8px rgba(0,0,0,0.10)" }}
              className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${s.iconBg}`}>
                  <Icon size={18} className={s.iconColor} strokeWidth={2} />
                </div>
              </div>
              <p className="text-sm text-slate-500 mb-1">{s.label}</p>
              <p className={`text-3xl font-bold tracking-tight ${s.valueColor || "text-slate-900"}`}>
                {s.value}
              </p>
              <p
                className={`text-xs mt-2 font-medium ${
                  s.positive === true
                    ? "text-emerald-600"
                    : s.positive === false
                    ? "text-red-500"
                    : "text-slate-400"
                }`}
              >
                {s.sub}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── BOTTOM ROW ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Ad Moderation Requests */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, type: "spring", stiffness: 100 }}
          className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <p className="font-semibold text-slate-800 text-sm">Recent pending moderation requests</p>
            <span className="px-2.5 py-0.5 text-[11px] font-bold bg-amber-50 text-amber-700 rounded-full">
              {pendingRequests.length} pending
            </span>
          </div>
          <div className="p-4 space-y-3.5">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className={`flex items-start justify-between p-3 rounded-xl border transition-all hover:bg-slate-50/50 ${
                  req.slaBreached ? "bg-red-50/30 border-red-100/50 animate-pulse-subtle" : "bg-slate-50/20 border-slate-100"
                }`}
              >
                <div className="flex gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${req.avatarColor}`}>
                    {req.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-800 text-sm leading-none">{req.consultant}</p>
                      <span className="text-[10px] text-slate-400 font-medium">({req.company})</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5">
                      <span className="font-medium text-slate-800">{req.vehicle}</span> · {req.placement}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${req.type === "CPC" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}`}>
                        {req.type}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">₹{req.budget}/day</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0 text-right">
                    <div className={`flex items-center gap-1 text-[11px] font-medium ${req.slaBreached ? "text-red-500 font-bold" : "text-slate-500"}`}>
                      <Clock size={11} />
                      {req.submittedMins >= 60 ? `${Math.floor(req.submittedMins / 60)} hrs ago` : `${req.submittedMins} mins ago`}
                    </div>
                    {req.slaBreached && (
                      <span className="text-[9px] font-bold text-red-600 bg-red-100/60 px-1.5 py-0.5 rounded-md uppercase tracking-wider leading-none">
                        SLA Breach
                      </span>
                    )}
                  </div>

                  {/* Actions column on Dashboard */}
                  <div className="flex items-center gap-1 border-l border-slate-100 pl-2.5">
                    <button
                      title="Preview ad"
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition"
                    >
                      <Eye size={13} />
                    </button>
                    <button
                      title="Approve"
                      onClick={() => setApproveItem(req)}
                      className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 border border-emerald-100 transition"
                    >
                      <Check size={13} />
                    </button>
                    <button
                      title="Reject"
                      onClick={() => setRejectItem(req)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 border border-red-100 transition"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {pendingRequests.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-sm">
                🎉 All caught up! No pending requests.
              </div>
            )}
          </div>
        </motion.div>

        {/* Placement Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, type: "spring", stiffness: 100 }}
          className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <p className="font-semibold text-slate-800 text-sm">Revenue by placement (today)</p>
            <span className="text-xs text-slate-400 font-medium">₹4,440 total</span>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={placementData} barSize={36} barCategoryGap="30%">
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#94A3B8" }}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                  {placementData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-3">
              {placementData.map((p, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: p.color }} />
                  <span className="text-xs text-slate-500">{p.name}</span>
                  <span className="text-xs font-semibold text-slate-700">₹{p.revenue.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── ALL CAMPAIGNS TABLE ── */}
      <div className="space-y-4 pt-6 border-t border-slate-100">
        <div>
          <h3 className="text-base font-semibold text-slate-800">All Campaigns</h3>
          <p className="text-xs text-slate-400 mt-0.5">Monitor and manage all PPC campaigns across the platform</p>
        </div>
        <PPCCampaigns />
      </div>
    </div>
  );
};

export default PPCDashboard;
