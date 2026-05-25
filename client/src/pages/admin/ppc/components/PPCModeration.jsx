import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Check, X, Clock } from "lucide-react";

/* ─── DATA ─────────────────────────────────────────────────────── */
const initialQueue = [
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
    id: "M-003",
    consultant: "Arjun M.",
    company: "AM Motors",
    initials: "AM",
    avatarColor: "bg-indigo-100 text-indigo-700",
    vehicle: "Hyundai Creta",
    vehicleDetail: "₹18L · 9,200 km",
    placement: "Search result",
    type: "CPI",
    budget: 200,
    submittedMins: 240,
    slaBreached: false,
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
    id: "M-005",
    consultant: "Nikhil P.",
    company: "NP Motors",
    initials: "NP",
    avatarColor: "bg-emerald-100 text-emerald-700",
    vehicle: "Tata Nexon 2023",
    vehicleDetail: "₹12L · 5,800 km",
    placement: "Search result",
    type: "CPC",
    budget: 250,
    submittedMins: 60,
    slaBreached: false,
  },
];

const formatSubmitted = (mins) => {
  if (mins < 60) return `${mins} min ago`;
  const h = Math.floor(mins / 60);
  return `${h} hr${h > 1 ? "s" : ""} ago`;
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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
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
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-100">
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
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
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
          <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-100">
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

/* ─── COMPONENT ─────────────────────────────────────────────────── */
const PPCModeration = () => {
  const [queue, setQueue] = useState(initialQueue);
  const [approveItem, setApproveItem] = useState(null);
  const [rejectItem, setRejectItem] = useState(null);

  const handleApprove = () => {
    setQueue((prev) => prev.filter((i) => i.id !== approveItem.id));
    setApproveItem(null);
  };

  const handleReject = () => {
    setQueue((prev) => prev.filter((i) => i.id !== rejectItem.id));
    setRejectItem(null);
  };

  return (
    <>
      {approveItem && <ApproveModal item={approveItem} onClose={() => setApproveItem(null)} onConfirm={handleApprove} />}
      {rejectItem && <RejectModal item={rejectItem} onClose={() => setRejectItem(null)} onConfirm={handleReject} />}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <p className="font-semibold text-slate-800">Ad moderation queue</p>
            <p className="text-xs text-slate-400 mt-1">New campaigns require approval before going live</p>
          </div>
          <span className="px-3 py-1 text-xs font-bold bg-red-50 text-red-600 rounded-full">
            {queue.length} pending
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {["Consultant", "Vehicle", "Placement", "Type", "Budget/day", "Submitted", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {queue.map((item, i) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={`hover:bg-slate-50 transition-colors ${item.slaBreached ? "bg-amber-50/40" : ""}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${item.avatarColor}`}>
                        {item.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{item.consultant}</p>
                        <p className="text-xs text-slate-400">{item.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800 text-sm">{item.vehicle}</p>
                    <p className="text-xs text-slate-400">{item.vehicleDetail}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{item.placement}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${item.type === "CPC" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}`}>{item.type}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-800">₹{item.budget}</td>
                  <td className="px-4 py-3">
                    <div className={`flex items-center gap-1 text-xs font-medium ${item.slaBreached ? "text-red-500" : "text-slate-500"}`}>
                      <Clock size={11} />
                      {formatSubmitted(item.submittedMins)}
                      {item.slaBreached && " ⚠"}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button title="Preview ad" className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition">
                        <Eye size={14} />
                      </button>
                      <button
                        title="Approve"
                        onClick={() => setApproveItem(item)}
                        className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 border border-emerald-200 transition"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        title="Reject"
                        onClick={() => setRejectItem(item)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 border border-red-200 transition"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {queue.length === 0 && (
            <div className="py-16 text-center text-slate-400 text-sm">
              🎉 All caught up! No pending campaigns.
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default PPCModeration;
