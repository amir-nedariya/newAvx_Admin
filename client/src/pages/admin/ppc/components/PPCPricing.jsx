import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Info, X, Check } from "lucide-react";

/* ─── DATA ─────────────────────────────────────────────────────── */
const initialPlacements = [
  {
    id: "homepage",
    name: "Homepage featured",
    type: "CPC only",
    active: true,
    fields: [
      { key: "cpc", label: "Price per click", prefix: "₹", suffix: "/ click", value: 5, min: 1, step: 1 },
      { key: "minBudget", label: "Min. daily budget", prefix: "₹", suffix: "/ day", value: 200, min: 50, step: 50 },
      { key: "maxBudget", label: "Max. daily budget", prefix: "₹", suffix: "/ day", value: 5000, min: 500, step: 500 },
    ],
    note: "Slot cap: max 4 simultaneous ads on this placement. Top bidders ranked by spend velocity.",
  },
  {
    id: "search",
    name: "Search result page",
    type: "CPC + CPI available",
    active: true,
    fields: [
      { key: "cpc", label: "CPC — per click", prefix: "₹", suffix: "/ click", value: 3, min: 1, step: 1 },
      { key: "cpi", label: "CPI — per inquiry", prefix: "₹", suffix: "/ inquiry", value: 20, min: 5, step: 5 },
      { key: "minBudget", label: "Min. daily budget", prefix: "₹", suffix: "/ day", value: 150, min: 50, step: 50 },
    ],
    note: "CPI triggers on buyer click of inquiry button on vehicle detail — before consultant accepts.",
  },
  {
    id: "vehicle",
    name: "Vehicle detail page",
    type: "CPI only",
    active: true,
    fields: [
      { key: "cpi", label: "CPI — per inquiry", prefix: "₹", suffix: "/ inquiry", value: 35, min: 10, step: 5 },
      { key: "minBudget", label: "Min. daily budget", prefix: "₹", suffix: "/ day", value: 100, min: 50, step: 50 },
      { key: "maxBudget", label: "Max. daily budget", prefix: "₹", suffix: "/ day", value: 2000, min: 200, step: 200 },
    ],
    note: "Charge fires on inquiry button tap. No charge if buyer abandons before submitting form.",
  },
];

/* ─── TOGGLE ────────────────────────────────────────────────────── */
const Toggle = ({ active, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className={`relative w-10 h-[22px] rounded-full transition-colors duration-200 ${
      active ? "bg-emerald-500" : "bg-slate-200"
    }`}
  >
    <motion.span
      layout
      transition={{ type: "spring", stiffness: 500, damping: 35 }}
      className="absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm"
      style={{ left: active ? "calc(100% - 19px)" : "3px" }}
    />
  </button>
);

/* ─── CONFIRM MODAL ─────────────────────────────────────────────── */
const ConfirmModal = ({ placements, onClose, onConfirm }) => (
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
          <p className="font-semibold text-slate-800">Confirm pricing update</p>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition text-slate-400">
            <X size={16} />
          </button>
        </div>
        <div className="p-5">
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-4 text-xs text-amber-700 leading-relaxed">
            New rates apply to campaigns created after this save. All currently running campaigns
            continue at their original rates.
          </div>
          <div className="space-y-2">
            {placements.map((p) =>
              p.fields.map((f) => (
                <div
                  key={`${p.id}-${f.key}`}
                  className="flex items-center justify-between py-2 border-b border-slate-100 text-sm"
                >
                  <span className="text-slate-500">
                    {p.name} · {f.label}
                  </span>
                  <span className="font-semibold text-slate-800">
                    {f.prefix}
                    {f.value} {f.suffix}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm text-slate-600 hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition"
          >
            <Check size={14} />
            Confirm & save
          </button>
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

/* ─── COMPONENT ─────────────────────────────────────────────────── */
const PPCPricing = () => {
  const [placements, setPlacements] = useState(initialPlacements);
  const [showModal, setShowModal] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateField = (placementId, fieldKey, value) => {
    setPlacements((prev) =>
      prev.map((p) =>
        p.id === placementId
          ? {
              ...p,
              fields: p.fields.map((f) => (f.key === fieldKey ? { ...f, value: Number(value) } : f)),
            }
          : p
      )
    );
  };

  const toggleActive = (placementId) => {
    setPlacements((prev) =>
      prev.map((p) => (p.id === placementId ? { ...p, active: !p.active } : p))
    );
  };

  const handleConfirm = () => {
    setShowModal(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <>
      {showModal && (
        <ConfirmModal
          placements={placements}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirm}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100">
          <p className="font-semibold text-slate-800">Placement pricing configuration</p>
          <p className="text-xs text-slate-400 mt-1">
            Fixed rates charged to consultants per placement. Changes apply to new campaigns only.
          </p>
        </div>

        {/* Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {placements.map((p) => (
            <motion.div
              key={p.id}
              whileHover={{ boxShadow: "0 4px 24px -4px rgba(0,0,0,0.08)" }}
              className="border border-slate-200 rounded-xl p-5 transition-all duration-200"
            >
              {/* Placement Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{p.type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">{p.active ? "Active" : "Inactive"}</span>
                  <Toggle active={p.active} onToggle={() => toggleActive(p.id)} />
                </div>
              </div>

              {/* Fields */}
              <div className="space-y-3">
                {p.fields.map((f) => (
                  <div key={f.key} className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 w-36 flex-shrink-0">{f.label}</span>
                    <div className="flex items-center gap-1.5 flex-1">
                      <span className="text-xs text-slate-400">{f.prefix}</span>
                      <input
                        type="number"
                        value={f.value}
                        min={f.min}
                        step={f.step}
                        onChange={(e) => updateField(p.id, f.key, e.target.value)}
                        className="w-20 text-sm font-semibold text-right text-slate-800 px-2 py-1.5 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition"
                      />
                      <span className="text-xs text-slate-400">{f.suffix}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Note */}
              <p className="text-xs text-slate-400 mt-4 pt-3 border-t border-slate-100 leading-relaxed">
                {p.note}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info size={13} />
            Price changes apply to new campaigns only. Running campaigns honour the rate at time of
            creation.
          </div>
          <button
            onClick={() => setShowModal(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              saved
                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                : "bg-slate-900 text-white hover:bg-slate-700"
            }`}
          >
            {saved ? (
              <>
                <Check size={14} /> Saved!
              </>
            ) : (
              <>
                <Save size={14} /> Save pricing
              </>
            )}
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default PPCPricing;
