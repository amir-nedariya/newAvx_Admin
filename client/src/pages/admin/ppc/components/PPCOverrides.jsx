import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Edit3, UserX, X, Check } from "lucide-react";

/* ─── DATA ─────────────────────────────────────────────────────── */
const initialOverrides = [
  {
    id: "OV-001",
    name: "NP Motors — Honda City 2023",
    meta: "Search result · CPI · Disabled 2 days ago",
    reason: "Vehicle listing had incorrect price. Pending consultant correction.",
    canBlacklist: false,
  },
  {
    id: "OV-002",
    name: "Speed Autos — Fortuner 2022",
    meta: "Homepage · CPC · Disabled 5 hrs ago",
    reason: "Suspected click fraud — 340 clicks in 2 hours with 0 inquiries. Under investigation.",
    canBlacklist: true,
  },
];

const history = [
  {
    id: "H-001",
    dot: "bg-red-400",
    title: "Speed Autos campaign disabled",
    sub: "Click fraud suspicion",
    time: "5 hrs ago",
  },
  {
    id: "H-002",
    dot: "bg-emerald-400",
    title: "Priya Autos campaign re-enabled",
    sub: "Issue resolved by consultant",
    time: "2 days ago",
  },
  {
    id: "H-003",
    dot: "bg-red-400",
    title: "NP Motors campaign disabled",
    sub: "Incorrect price on listing",
    time: "2 days ago",
  },
  {
    id: "H-004",
    dot: "bg-amber-400",
    title: "City Cars campaign paused",
    sub: "Vehicle marked sold, auto-rule triggered",
    time: "5 days ago",
  },
  {
    id: "H-005",
    dot: "bg-emerald-400",
    title: "AM Motors campaign re-enabled",
    sub: "Admin review cleared",
    time: "6 days ago",
  },
];

/* ─── EDIT REASON MODAL ─────────────────────────────────────────── */
const EditReasonModal = ({ override, onClose, onSave }) => {
  const [value, setValue] = useState(override.reason);
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
            <p className="font-semibold text-slate-800">Edit override reason</p>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition"><X size={16} /></button>
          </div>
          <div className="p-5">
            <p className="text-xs font-semibold text-slate-500 mb-2">Campaign</p>
            <div className="px-3 py-2 bg-slate-50 rounded-lg text-sm font-semibold text-slate-800 mb-4">{override.name}</div>
            <p className="text-xs font-semibold text-slate-500 mb-2">Reason (shown to consultant)</p>
            <textarea rows={3} value={value} onChange={(e) => setValue(e.target.value)} className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 resize-none text-slate-700" />
          </div>
          <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-100">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-slate-600 hover:bg-slate-100 transition">Cancel</button>
            <button onClick={() => onSave(value)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-700 transition">
              <Check size={14} /> Save reason
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─── COMPONENT ─────────────────────────────────────────────────── */
const PPCOverrides = () => {
  const [overrides, setOverrides] = useState(initialOverrides);
  const [editingOverride, setEditingOverride] = useState(null);

  const handleReEnable = (id) => {
    setOverrides((prev) => prev.filter((o) => o.id !== id));
  };

  const handleSaveReason = (reason) => {
    setOverrides((prev) =>
      prev.map((o) => (o.id === editingOverride.id ? { ...o, reason } : o))
    );
    setEditingOverride(null);
  };

  return (
    <>
      {editingOverride && (
        <EditReasonModal
          override={editingOverride}
          onClose={() => setEditingOverride(null)}
          onSave={handleSaveReason}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Active Overrides */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <p className="font-semibold text-slate-800">Active overrides</p>
            <span className="text-xs text-slate-400">Admin-disabled campaigns</span>
          </div>
          <div className="p-4 space-y-3">
            <AnimatePresence>
              {overrides.map((o) => (
                <motion.div
                  key={o.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, height: 0, marginBottom: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 24 }}
                  className="border border-slate-200 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{o.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{o.meta}</p>
                    </div>
                    <span className="px-2 py-0.5 text-[11px] font-bold bg-red-50 text-red-600 rounded-md whitespace-nowrap ml-3">Disabled</span>
                  </div>
                  <div className="flex items-start gap-1.5 mt-3 p-2.5 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 text-xs mt-0.5">❝</span>
                    <p className="text-xs text-slate-600 leading-relaxed">{o.reason}</p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleReEnable(o.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                    >
                      <Play size={12} /> Re-enable
                    </button>
                    <button
                      onClick={() => setEditingOverride(o)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                    >
                      <Edit3 size={12} /> Edit reason
                    </button>
                    {o.canBlacklist && (
                      <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition">
                        <UserX size={12} /> Blacklist
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {overrides.length === 0 && (
              <div className="py-10 text-center text-slate-400 text-sm">No active overrides.</div>
            )}
          </div>
        </motion.div>

        {/* History Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
          className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <p className="font-semibold text-slate-800">Override history</p>
            <span className="text-xs text-slate-400">Last 30 days</span>
          </div>
          <div className="p-4">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-slate-100" />
              <div className="space-y-1">
                {history.map((h, i) => (
                  <motion.div
                    key={h.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-4 py-3"
                  >
                    <div className={`w-3.5 h-3.5 rounded-full flex-shrink-0 mt-0.5 border-2 border-white shadow-sm ${h.dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 leading-snug">{h.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{h.sub}</p>
                    </div>
                    <span className="text-[11px] text-slate-400 whitespace-nowrap flex-shrink-0">{h.time}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default PPCOverrides;
