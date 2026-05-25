import React, { useState } from "react";
import { motion } from "framer-motion";
import { Save, Check, Lock } from "lucide-react";

/* ─── DATA ─────────────────────────────────────────────────────── */
const initialRules = [
  {
    id: "auto_pause_sold",
    title: "Auto-pause on sold vehicle",
    description: "Automatically pause any ad if the linked vehicle is marked sold in inventory",
    enabled: true,
    inputField: null,
  },
  {
    id: "click_fraud",
    title: "Click fraud auto-detection",
    description: "Flag campaigns where clicks > 200/hr with 0 inquiries for manual review",
    enabled: true,
    inputField: null,
  },
  {
    id: "new_campaign_review",
    title: "New campaign requires review",
    description:
      "All new campaigns go to INREVIEW before going live. Admin must approve.",
    enabled: true,
    inputField: null,
  },
  {
    id: "low_wallet_warn",
    title: "Low wallet warning",
    description: "Notify consultant when wallet balance drops below",
    enabled: true,
    inputField: { key: "threshold", value: 200, suffix: "₹", min: 50, step: 50, unit: "" },
  },
  {
    id: "max_campaigns",
    title: "Max active campaigns per consultant",
    description: "Limit simultaneous active campaigns to",
    enabled: true,
    inputField: { key: "limit", value: 10, suffix: "", min: 1, step: 1, unit: "per consultant" },
  },
];

/* ─── TOGGLE ────────────────────────────────────────────────────── */
const Toggle = ({ active, onToggle, disabled }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onToggle}
    className={`relative flex-shrink-0 w-10 h-[22px] rounded-full transition-colors duration-200 ${
      active ? "bg-emerald-500" : "bg-slate-200"
    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
  >
    <motion.span
      layout
      transition={{ type: "spring", stiffness: 500, damping: 35 }}
      className="absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm"
      style={{ left: active ? "calc(100% - 19px)" : "3px" }}
    />
  </button>
);

/* ─── COMPONENT ─────────────────────────────────────────────────── */
const PPCRules = () => {
  const [rules, setRules] = useState(initialRules);
  const [saved, setSaved] = useState(false);

  const toggleRule = (id) => {
    if (id === "click_fraud" || id === "new_campaign_review") return;
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const updateInputField = (id, value) => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === id && r.inputField
          ? { ...r, inputField: { ...r.inputField, value: Number(value) } }
          : r
      )
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100">
        <p className="font-semibold text-slate-800">Platform-wide PPC rules</p>
        <p className="text-xs text-slate-400 mt-1">
          Global automation and guardrails. Changes take effect immediately for all active campaigns.
        </p>
      </div>

      {/* Rules List */}
      <div className="divide-y divide-slate-100">
        {rules.map((rule, i) => {
          const isLocked = rule.id === "click_fraud" || rule.id === "new_campaign_review";
          return (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07, type: "spring", stiffness: 120 }}
              className={`flex items-center justify-between gap-6 px-6 py-5 transition-colors ${
                rule.enabled ? "" : "opacity-60"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-800">{rule.title}</p>
                  {isLocked && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none">
                      <Lock size={10} /> Locked
                    </span>
                  )}
                </div>
                <div className="flex items-center flex-wrap gap-1.5 mt-1">
                  <p className="text-xs text-slate-500">{rule.description}</p>
                  {rule.inputField && (
                    <>
                      {rule.inputField.suffix && (
                        <span className="text-xs text-slate-500">{rule.inputField.suffix}</span>
                      )}
                      <input
                        type="number"
                        value={rule.inputField.value}
                        min={rule.inputField.min}
                        step={rule.inputField.step}
                        disabled={!rule.enabled}
                        onChange={(e) => updateInputField(rule.id, e.target.value)}
                        className="w-16 text-xs font-semibold text-center px-2 py-1 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition disabled:opacity-40"
                      />
                      {rule.inputField.unit && (
                        <span className="text-xs text-slate-500">{rule.inputField.unit}</span>
                      )}
                    </>
                  )}
                </div>
              </div>
              <Toggle active={rule.enabled} onToggle={() => toggleRule(rule.id)} disabled={isLocked} />
            </motion.div>
          );
        })}
      </div>

      {/* Save Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
        <p className="text-xs text-slate-500">Rule changes take effect immediately for all active campaigns.</p>
        <button
          onClick={handleSave}
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
              <Save size={14} /> Save rules
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default PPCRules;
