import React, { useEffect, useMemo, useState } from "react";
import {
  Settings as SettingsIcon,
  BadgePercent,
  Crown,
  SlidersHorizontal,
  Bell,
  Shield,
  Save,
  RotateCcw,
  History,
  Plus,
  Trash2,
  Pencil,
  X,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ChevronRight,
  UserCheck,
  AlertCircle,
  Eye,
  CheckCheck,
  ShieldAlert,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* =========================================================
   ✅ FILE: src/pages/admin/Settings.jsx
   ✅ PREMIUM SETTINGS CORE ENGINE UI
   ✅ MATCHES "ALL VEHICLES" AESTHETIC (Clean, Professional, Slate)
   ✅ MODULES: Commission, Tiers, Ranking, Notifications, Admin Roles
   ========================================================= */

const cls = (...a) => a.filter(Boolean).join(" ");

const STORAGE_KEY = "avx_v2_settings";

const DEFAULT_SETTINGS = {
  meta: { updatedAt: null, updatedBy: "Super Admin", version: 1 },
  commission: {
    mode: "OFF", // OFF | FLAT | TIER | CATEGORY | HYBRID
    rules: [
      { id: "R-1001", tier: "Premium", category: "SUV", city: "Mumbai", pct: 2.5, status: "ACTIVE" },
      { id: "R-1002", tier: "Pro", category: "Hatchback", city: "Ahmedabad", pct: 1.5, status: "PAUSED" },
    ],
    inspectionSplit: { inspector: 70, platform: 30, payerModel: "BUYER" },
    conditionalRules: [
      { id: "C-1", label: "Premium → 10% inspection discount", enabled: true },
      { id: "C-2", label: "Re-inspection → 50% discount", enabled: false },
    ],
  },
  tiers: {
    pricing: {
      Basic: { priceMonthly: 0, priceYearly: 0, trial: false },
      Pro: { priceMonthly: 999, priceYearly: 9990, trial: true },
      Premium: { priceMonthly: 2999, priceYearly: 29990, trial: true },
    },
    features: [
      { key: "maxListings", label: "Max Active Listings", Basic: 15, Pro: 60, Premium: 200, type: "number" },
      { key: "chatLimit", label: "Chat Daily Limit", Basic: 20, Pro: 80, Premium: 200, type: "number" },
      { key: "storefront", label: "Storefront Customization", Basic: false, Pro: true, Premium: true, type: "bool" },
      { key: "ranking", label: "Ranking Multiplier", Basic: 1.0, Pro: 1.15, Premium: 1.3, type: "number" },
      { key: "sla", label: "Priority SLA", Basic: false, Pro: false, Premium: true, type: "bool" },
    ],
    limits: {
      Basic: { maxVehicles: 15, maxBoost: 0, maxInquiries: 2 },
      Pro: { maxVehicles: 60, maxBoost: 2, maxInquiries: 6 },
      Premium: { maxVehicles: 200, maxBoost: 8, maxInquiries: 20 },
    },
    expiry: { graceDays: 7, hideStore: true, disableBoost: true },
  },
  ranking: {
    weights: { response: 20, conversion: 20, review: 20, inspection: 10, fresh: 10, boost: 10, engage: 10 },
    multipliers: { Basic: 1.0, Pro: 1.15, Premium: 1.3 },
    penalties: [
      { id: "P-1", label: "Fraud Flag", val: -30, enabled: true },
      { id: "P-2", label: "SLA Breach", val: -10, enabled: true },
      { id: "P-3", label: "High Dispute Rate", val: -15, enabled: true },
    ],
  },
  notifications: {
    events: [
      { id: "N-1", event: "New Inquiry", push: true, email: true, sms: false, escalation: "None" },
      { id: "N-2", event: "Chat Message", push: true, email: false, sms: false, escalation: "None" },
      { id: "N-3", event: "SLA Near Breach", push: true, email: true, sms: false, escalation: "Ops Notify" },
      { id: "N-4", event: "Fraud Flag", push: true, email: true, sms: true, escalation: "Immediate" },
    ],
    caps: { maxReminders: 3, maxAlerts: 2 },
  },
  roles: {
    roles: [
      { id: "role_super", name: "Super Admin", system: true },
      { id: "role_fin", name: "Finance Admin", system: true },
      { id: "role_ops", name: "Ops Admin", system: true },
    ],
    matrix: {
      role_super: { Marketplace: true, Consultants: true, Finance: true, Analytics: true, Settings: true },
    },
  },
  audit: [],
};

const deepClone = (x) => JSON.parse(JSON.stringify(x));

/* =========================
   UI HELPERS
   ========================= */

const SectionTitle = ({ children, subtitle }) => (
  <div className="mb-6">
    <h2 className="text-xl font-bold text-slate-900 leading-tight">{children}</h2>
    {subtitle && <p className="text-sm font-medium text-slate-500 mt-1">{subtitle}</p>}
  </div>
);

const Card = ({ children, className = "", noPadding = false }) => (
  <div className={cls("rounded-[32px] border border-slate-200 bg-white shadow-sm overflow-hidden", className)}>
    <div className={cls(noPadding ? "" : "p-6 md:p-8")}>{children}</div>
  </div>
);

const Label = ({ children, className = "" }) => (
  <label className={cls("block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2.5", className)}>
    {children}
  </label>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={cls(
      "w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-bold text-slate-900 outline-none transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 placeholder:text-slate-400",
      className
    )}
    {...props}
  />
);

const Select = ({ className = "", children, ...props }) => (
  <select
    className={cls(
      "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100",
      className
    )}
    {...props}
  >
    {children}
  </select>
);

const PrimaryBtn = ({ children, icon: Icon, className = "", disabled, ...props }) => (
  <button
    disabled={disabled}
    className={cls(
      "inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-6 py-2.5 text-sm font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
      "bg-slate-900 text-white hover:bg-slate-800 shadow-md shadow-slate-200",
      className
    )}
    {...props}
  >
    {Icon && <Icon size={18} />}
    {children}
  </button>
);

const GhostBtn = ({ children, icon: Icon, className = "", ...props }) => (
  <button
    className={cls(
      "inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-6 py-2.5 text-sm font-bold transition-all active:scale-95",
      "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50",
      className
    )}
    {...props}
  >
    {Icon && <Icon size={18} />}
    {children}
  </button>
);

const Toggle = ({ checked, onChange, label, desc }) => (
  <div className="flex items-center justify-between p-5 rounded-3xl border border-slate-100 bg-slate-50/30 group hover:border-indigo-200 hover:bg-white transition-all duration-300">
    <div>
      <div className="text-[14px] font-bold text-slate-900">{label}</div>
      {desc && <div className="text-xs font-semibold text-slate-400 mt-0.5">{desc}</div>}
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cls(
        "relative h-6 w-11 rounded-full p-1 transition-colors duration-200",
        checked ? "bg-emerald-500" : "bg-slate-300"
      )}
    >
      <div className={cls("h-4 w-4 rounded-full bg-white transition-transform duration-200", checked ? "translate-x-5" : "translate-x-0")} />
    </button>
  </div>
);

const Badge = ({ children, color = "neutral" }) => {
  const map = {
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-rose-50 text-rose-700 border-rose-200",
    info: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };
  return (
    <span className={cls("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wide", map[color])}>
      {children}
    </span>
  );
};

/* =========================
   MAIN SETTINGS PAGE
   ========================= */
const Settings = () => {
  const [tab, setTab] = useState("commission");
  const [settings, setSettings] = useState(deepClone(DEFAULT_SETTINGS));
  const [dirty, setDirty] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setSettings(JSON.parse(raw));
  }, []);

  const markDirty = () => setDirty(true);

  const save = () => {
    if (!reason.trim()) return;
    const next = {
      ...settings,
      meta: { ...settings.meta, version: settings.meta.version + 1, updatedAt: new Date().toISOString() },
    };
    next.audit.unshift({ id: Date.now(), at: new Date().toISOString(), by: next.meta.updatedBy, module: tab, reason });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSettings(next);
    setDirty(false);
    setConfirmOpen(false);
    setReason("");
  };

  const nav = [
    { key: "commission", label: "Commission Logic", icon: BadgePercent, desc: "Monetization Brain" },
    { key: "tiers", label: "Tier Configuration", icon: Crown, desc: "Supply Power" },
    { key: "ranking", label: "Ranking Weights", icon: SlidersHorizontal, desc: "Algorithm Controls" },
    { key: "notifications", label: "Notification Rules", icon: Bell, desc: "SLA Discipline" },
    { key: "roles", label: "Admin Roles", icon: Shield, desc: "Security Matrix" },
    { key: "audit", label: "Audit Log", icon: History, desc: "Legal Trail" },
  ];

  const up = (module, patch) => {
    setSettings((prev) => ({ ...prev, [module]: { ...prev[module], ...patch } }));
    markDirty();
  };

  return (
    <div className="min-h-screen pb-20 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between mb-10 max-w-7xl mx-auto">
        <div>
          <h1 className="text-[36px] font-black tracking-tight text-slate-900 leading-none">
            Settings <span className="text-slate-300">/ Core Engine</span>
          </h1>
          <p className="text-slate-500 font-bold mt-2">The operational and algorithmic brain of AVX Marketplace.</p>
        </div>
        <div className="flex items-center gap-3">
          {dirty && <Badge color="warning"><AlertTriangle size={12} className="mr-1" /> Unsaved Logic Changes</Badge>}
          <PrimaryBtn icon={Save} disabled={!dirty} onClick={() => setConfirmOpen(true)}>Save Configuration</PrimaryBtn>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10 max-w-7xl mx-auto items-start">
        {/* Sidebar Nav */}
        <div className="space-y-3 sticky top-10">
          {nav.map((n) => {
            const active = tab === n.key;
            const Icon = n.icon;
            return (
              <button
                key={n.key}
                onClick={() => setTab(n.key)}
                className={cls(
                  "w-full flex items-center gap-5 rounded-[28px] p-5 transition-all duration-300 text-left group",
                  active
                    ? "bg-slate-900 text-white shadow-2xl shadow-slate-200"
                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-100 shadow-sm"
                )}
              >
                <div className={cls(
                  "h-12 w-12 rounded-2xl flex items-center justify-center transition-all",
                  active ? "bg-white/10" : "bg-slate-100 group-hover:bg-indigo-50"
                )}>
                  <Icon size={22} className={active ? "text-white" : "text-slate-700 group-hover:text-indigo-600"} />
                </div>
                <div>
                  <div className="font-black text-[15px] mb-0.5">{n.label}</div>
                  <div className={cls("text-[11px] font-bold uppercase tracking-tighter", active ? "text-white/40" : "text-slate-400")}>{n.desc}</div>
                </div>
                {active && <ChevronRight className="ml-auto text-white/30" size={18} />}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {tab === "commission" && <CommSec sets={settings.commission} up={(p) => up("commission", p)} />}
              {tab === "tiers" && <TierSec sets={settings.tiers} up={(p) => up("tiers", p)} />}
              {tab === "ranking" && <RankSec sets={settings.ranking} up={(p) => up("ranking", p)} />}
              {tab === "notifications" && <NotifSec sets={settings.notifications} up={(p) => up("notifications", p)} />}
              {tab === "roles" && <RoleSec sets={settings.roles} up={(p) => up("roles", p)} />}
              {tab === "audit" && <AuditSec logs={settings.audit} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Save Confirmation Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-lg rounded-[42px] bg-white p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
            <div className="mb-8 flex items-center gap-5">
              <div className="h-14 w-14 rounded-3xl bg-amber-50 flex items-center justify-center text-amber-600"><ShieldAlert size={30} /></div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">Governance Confirmation</h3>
                <p className="text-sm font-bold text-slate-500">Settings changes are critical for revenue and fairness.</p>
              </div>
            </div>
            <Label>Justification for update (Audit Requirement)</Label>
            <textarea
              className="w-full min-h-[120px] rounded-3xl border border-slate-200 bg-slate-50 p-5 text-[15px] font-bold text-slate-900 focus:ring-4 focus:ring-indigo-100 outline-none mb-8 transition-all"
              placeholder="e.g., Adjusting SUV platform margin based on Q1 growth..."
              value={reason} onChange={(e) => setReason(e.target.value)}
            />
            <div className="flex gap-4">
              <GhostBtn className="flex-1 rounded-3xl" onClick={() => setConfirmOpen(false)}>Cancel</GhostBtn>
              <PrimaryBtn className="flex-1 rounded-3xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100" disabled={!reason.trim()} onClick={save}>Commit Configuration</PrimaryBtn>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

/* =========================================================
   SUB-MODULES
   ========================================================= */

const CommSec = ({ sets, up }) => (
  <Card>
    <SectionTitle subtitle="Define how much platform margin is taken from inspection and sales.">Commission Logic</SectionTitle>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
      <div className="space-y-6">
        <div>
          <Label>Active Commission Mode</Label>
          <Select value={sets.mode} onChange={(e) => up({ mode: e.target.value })}>
            <option value="OFF">OFF (Transaction only)</option>
            <option value="FLAT">Flat % Fee</option>
            <option value="TIER">Tier-Based Commissions</option>
            <option value="HYBRID">Hybrid Ecosystem</option>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Inspector %</Label><Input type="number" value={sets.inspectionSplit.inspector} onChange={(e) => {
            const val = Math.min(100, Math.max(0, e.target.value));
            up({ inspectionSplit: { ...sets.inspectionSplit, inspector: val, platform: 100 - val } });
          }} /></div>
          <div><Label>Platform %</Label><Input readOnly value={sets.inspectionSplit.platform} /></div>
        </div>
      </div>
      <div className="p-8 rounded-[42px] bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10"><BadgePercent size={80} /></div>
        <div className="relative z-10">
          <h4 className="text-lg font-black mb-3">Revenue Guard</h4>
          <p className="text-xs font-bold text-slate-400 mb-6 italic leading-relaxed">System automatically holds marketplace payouts until inspection logic is satisfied.</p>
          <Badge color="success">Escrow Logic Enabled</Badge>
        </div>
      </div>
    </div>
    <div className="mb-10"><Label>Conditional Logic Rules</Label><div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
      {sets.conditionalRules.map((r, i) => (
        <Toggle key={r.id} label={r.label} checked={r.enabled} onChange={(v) => {
          const next = [...sets.conditionalRules]; next[i].enabled = v; up({ conditionalRules: next });
        }} />
      ))}
    </div></div>
    <div>
      <div className="flex items-center justify-between mb-4"><Label className="mb-0">Revenue Matrix</Label><GhostBtn className="h-10 px-4 rounded-xl" icon={Plus}>Add Custom Rule</GhostBtn></div>
      <div className="overflow-x-auto rounded-[32px] border border-slate-100 bg-slate-50/50">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead><tr className="bg-slate-100/50">{["Tier", "Category", "City", "% Logic", "Status"].map(h => <th key={h} className="p-5 text-[10px] font-black uppercase text-slate-400">{h}</th>)}</tr></thead>
          <tbody>{sets.rules.map(rule => (
            <tr key={rule.id} className="border-t border-slate-100 group">
              <td className="p-5 text-[14px] font-black text-slate-900">{rule.tier}</td>
              <td className="p-5 text-[14px] font-bold text-slate-500">{rule.category}</td>
              <td className="p-5 text-[14px] font-bold text-slate-500">{rule.city}</td>
              <td className="p-5 text-[14px] font-black text-indigo-600">{rule.pct}%</td>
              <td className="p-5"><Badge color={rule.status === "ACTIVE" ? "success" : "warning"}>{rule.status}</Badge></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  </Card>
);

const TierSec = ({ sets, up }) => (
  <div className="space-y-8">
    <Card>
      <SectionTitle subtitle="Subscription tiers control monetization and listing limits.">Tier Configuration</SectionTitle>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
        {Object.entries(sets.pricing).map(([k, d]) => (
          <div key={k} className="p-8 rounded-[42px] border border-slate-100 bg-slate-50/30">
            <div className="flex items-center gap-4 mb-6">
              <div className={cls("h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3", k === "Premium" ? "bg-amber-100 text-amber-600" : "bg-indigo-100 text-indigo-600")}>
                <Crown size={24} />
              </div>
              <h3 className="font-black text-[18px] text-slate-900 uppercase tracking-tighter">{k}</h3>
            </div>
            <div className="space-y-5">
              <div><Label>Monthly INR</Label><Input type="number" value={d.priceMonthly} onChange={(e) => {
                const n = { ...sets.pricing, [k]: { ...d, priceMonthly: e.target.value } }; up({ pricing: n });
              }} /></div>
              <div><Label>Yearly INR</Label><Input type="number" value={d.priceYearly} onChange={(e) => {
                const n = { ...sets.pricing, [k]: { ...d, priceYearly: e.target.value } }; up({ pricing: n });
              }} /></div>
              <Toggle label="Free Trial" checked={d.trial} onChange={(v) => {
                const n = { ...sets.pricing, [k]: { ...d, trial: v } }; up({ pricing: n });
              }} />
            </div>
          </div>
        ))}
      </div>
      <Label>Tier Permissions Matrix</Label>
      <div className="overflow-x-auto rounded-[32px] border border-slate-100 mt-4">
        <table className="w-full text-left">
          <thead><tr className="bg-slate-100/50 shadow-[inset_0_-1px_0_rgba(0,0,0,0.05)] border-b border-slate-100">
            <th className="p-5 text-[10px] font-black uppercase text-slate-400">Feature</th>
            {["Basic", "Pro", "Premium"].map(t => <th key={t} className="p-5 text-[10px] font-black uppercase text-slate-400 text-center">{t}</th>)}
          </tr></thead>
          <tbody>{sets.features.map((f, i) => (
            <tr key={f.key} className="border-b border-slate-50 hover:bg-slate-50/20 transition-colors">
              <td className="p-5 py-7 text-[14px] font-black text-slate-700">{f.label}</td>
              {["Basic", "Pro", "Premium"].map(t => (
                <td key={t} className="p-5 text-center">
                  {f.type === "bool" ? (
                    <button onClick={() => {
                      const n = [...sets.features]; n[i][t] = !n[i][t]; up({ features: n });
                    }} className={cls("h-10 w-10 rounded-2xl inline-flex items-center justify-center transition-all", f[t] ? "bg-emerald-100 text-emerald-600 shadow-md transform scale-110" : "bg-slate-100 text-slate-300 opacity-50")}>
                      {f[t] ? <CheckCheck size={20} /> : <X size={20} />}
                    </button>
                  ) : <input type="number" className="w-16 text-center font-black text-indigo-600 bg-transparent border-b-2 border-slate-100 focus:border-indigo-400 outline-none pb-1" value={f[t]} onChange={(e) => {
                    const n = [...sets.features]; n[i][t] = e.target.value; up({ features: n });
                  }} />}
                </td>
              ))}
            </tr>
          ))}</tbody>
        </table>
      </div>
    </Card>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card><Label>SLA & Grace Penalties</Label><div className="space-y-4 mt-6">
        <div><Label>Grace Period Days</Label><Input type="number" value={sets.expiry.graceDays} onChange={(e) => up({ expiry: { ...sets.expiry, graceDays: e.target.value } })} /></div>
        <Toggle label="Hide Entity on Expiry" checked={sets.expiry.hideStore} onChange={(v) => up({ expiry: { ...sets.expiry, hideStore: v } })} />
        <Toggle label="Wipe Active Boosts" checked={sets.expiry.disableBoost} onChange={(v) => up({ expiry: { ...sets.expiry, disableBoost: v } })} />
      </div></Card>
      <Card><Label>Enforcement Limits</Label><div className="space-y-4 mt-6">
        {Object.entries(sets.limits).map(([tier, lims]) => (
          <div key={tier} className="p-5 rounded-3xl bg-slate-50 border border-slate-100">
            <div className="text-[12px] font-black text-slate-900 mb-4 flex items-center justify-between">{tier} <div className="h-px flex-1 mx-4 bg-slate-200" /></div>
            <div className="grid grid-cols-3 gap-6">
              {Object.entries(lims).map(([k, v]) => (
                <div key={k} className="text-center">
                  <div className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-tighter">{k.replace("max", "")}</div>
                  <input className="w-full text-center font-black text-[15px] bg-white rounded-2xl py-2 shadow-sm border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-100" value={v} onChange={(e) => {
                    const n = { ...sets.limits, [tier]: { ...lims, [k]: e.target.value } }; up({ limits: n });
                  }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div></Card>
    </div>
  </div>
);

const RankSec = ({ sets, up }) => {
  const sum = Object.values(sets.weights).reduce((a, b) => a + Number(b), 0);
  const normalize = () => { if (sum === 0) return; const n = {}; Object.keys(sets.weights).forEach(k => n[k] = Math.round((sets.weights[k] / sum) * 100)); up({ weights: n }); };
  return (
    <div className="space-y-8">
      <Card>
        <div className="flex items-center justify-between mb-2">
          <SectionTitle subtitle="Algorithmic weights control search result positions.">Ranking Logic</SectionTitle>
          <div className="text-right">
            <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Normalized Total</div>
            <div className={cls("text-3xl font-black", sum === 100 ? "text-emerald-500" : "text-rose-500")}>{sum}%</div>
            {sum !== 100 && <button className="text-[10px] font-black uppercase text-indigo-600 underline" onClick={normalize}>Auto-Resolve</button>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">
          <div className="space-y-8">
            {Object.entries(sets.weights).map(([k, v]) => (
              <div key={k}>
                <div className="flex items-center justify-between mb-3"><div className="text-[14px] font-black text-slate-800 capitalize">{k} Weight</div><div className="text-[15px] font-black text-indigo-600">{v}%</div></div>
                <input type="range" min="0" max="100" value={v} onChange={(e) => up({ weights: { ...sets.weights, [k]: e.target.value } })} className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600" />
              </div>
            ))}
          </div>
          <div className="p-10 rounded-[48px] bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-start text-left">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 rounded-[22px] bg-white shadow-xl flex items-center justify-center text-indigo-600"><RotateCcw size={24} /></div>
              <div>
                <h4 className="text-[16px] font-black text-slate-900 leading-none">Simulation Engine</h4>
                <p className="text-[12px] font-bold text-slate-400 mt-1">Predict rank vector shifts.</p>
              </div>
            </div>
            
            <div className="w-full space-y-4">
              <div>
                <Label className="text-[10px]">Reference Consultant</Label>
                <Select className="bg-white border-slate-200">
                  <option>Top Performer (Ahmedabad)</option>
                  <option>SLA Breaker (Mumbai)</option>
                  <option>New Onboarding (Surat)</option>
                </Select>
              </div>
              <button className="w-full h-12 rounded-2xl bg-slate-900 text-white font-black text-[12px] uppercase tracking-widest shadow-lg shadow-slate-200 transition-all hover:bg-slate-800">Recalculate Vector</button>
            </div>

            <div className="mt-8 w-full p-6 rounded-[32px] bg-indigo-600 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><SlidersHorizontal size={60} /></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-black uppercase opacity-60">Result Forecast</span>
                  <Badge color="success">+12.4% Elevate</Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-[14px] font-black"><span>Primary Score</span> <span>842.5 pts</span></div>
                  <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden leading-none"><div className="h-full bg-white" style={{ width: "84%" }} /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <Card>
        <SectionTitle subtitle="Penalties deducted from absolute ranking score.">Breach Deductions</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sets.penalties.map((p, i) => (
            <div key={p.id} className="p-8 rounded-[42px] border border-slate-100 bg-slate-50/50 group hover:bg-white hover:shadow-2xl transition-all duration-500">
              <div className="flex items-center justify-between mb-6">
                <div className="text-[16px] font-black text-slate-900 leading-none">{p.label}</div>
                <Toggle checked={p.enabled} onChange={(v) => { const n = [...sets.penalties]; n[i].enabled = v; up({ penalties: n }); }} />
              </div>
              <div className="flex items-end gap-3"><Input type="number" className="text-rose-600 font-black text-[22px]" value={p.val} onChange={(e) => { const n = [...sets.penalties]; n[i].val = e.target.value; up({ penalties: n }); }} /><div className="text-[10px] font-black text-rose-300 mb-3 rotate-90 shrink-0 uppercase tracking-widest">Score</div></div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const NotifSec = ({ sets, up }) => (
  <Card>
    <SectionTitle subtitle="Define triggers and escalation for SLA-bound alerts.">Notification Hub</SectionTitle>
    <div className="overflow-x-auto rounded-[32px] border border-slate-100 mb-12">
      <table className="w-full text-left">
        <thead><tr className="bg-slate-100/50 shadow-[inset_0_-1px_0_rgba(0,0,0,0.05)] border-b border-slate-100">{["Event Trigger", "Push", "Email", "SMS", "Escalation"].map(h => <th key={h} className="p-5 text-[10px] font-black uppercase text-slate-400 text-center first:text-left">{h}</th>)}</tr></thead>
        <tbody>{sets.events.map((ev, i) => (
          <tr key={ev.id} className="border-b border-slate-50 hover:bg-slate-50/20 transition-colors">
            <td className="p-5 py-8 text-[15px] font-black text-slate-800">{ev.event}</td>
            {["push", "email", "sms"].map(c => <td key={c} className="p-5 text-center"><button onClick={() => { const next = [...sets.events]; next[i][c] = !next[i][c]; up({ events: next }); }} className={cls("h-10 w-10 rounded-2xl inline-flex items-center justify-center transition-all shadow-sm", ev[c] ? "bg-indigo-600 text-white transform scale-110" : "bg-slate-100 text-slate-300 opacity-40")}>{ev[c] ? <CheckCircle2 size={20} /> : <X size={20} />}</button></td>)}
            <td className="p-5"><Select className="py-2.5 px-4 text-[12px] text-center" value={ev.escalation} onChange={(e) => { const next = [...sets.events]; next[i].escalation = e.target.value; up({ events: next }); }}><option>None</option><option>Ops Notify</option><option>Immediate</option></Select></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="p-8 rounded-[48px] bg-slate-50/50 border border-slate-100"><div className="flex items-center gap-4 mb-6 text-indigo-600"><Bell size={24} /><h4 className="text-[14px] font-black uppercase tracking-tighter">Anti-Spam Thresholds</h4></div>
        <div className="space-y-6">
          <div><Label>Reminders per Inquiry</Label><Input type="number" value={sets.caps.maxReminders} onChange={(e) => up({ caps: { ...sets.caps, maxReminders: e.target.value } })} /></div>
          <div><Label>Staff Fraud Alerts / Day</Label><Input type="number" value={sets.caps.maxAlerts} onChange={(e) => up({ caps: { ...sets.caps, maxAlerts: e.target.value } })} /></div>
        </div>
      </div>
    </div>
  </Card>
);

const RoleSec = ({ sets, up }) => {
  const [sel, setSel] = useState(sets.roles[0].id);
  const m = sets.matrix[sel] || {};
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8">
      <Card>
        <div className="flex items-center justify-between mb-8"><SectionTitle subtitle={`Permissions for: ${sets.roles.find(r => r.id === sel)?.name}`}>Access Matrix</SectionTitle><Badge color="info">RBAC Layer</Badge></div>
        <div className="overflow-x-auto rounded-[32px] border border-slate-100 bg-white">
          <table className="w-full text-left">
            <thead><tr className="bg-slate-50 border-b border-slate-100"><th className="p-6 text-[10px] font-black uppercase text-slate-400">Module Path</th>{["Access", "Write", "Override"].map(p => <th key={p} className="p-6 text-[10px] font-black uppercase text-slate-400 text-center">{p}</th>)}</tr></thead>
            <tbody>{["Marketplace", "Consultants", "Finance", "Analytics", "Settings", "Fraud", "Disputes"].map(mod => (
              <tr key={mod} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                <td className="p-6 py-8 text-[15px] font-black text-slate-800 flex items-center gap-4"><div className="h-8 w-1.5 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" /> {mod}</td>
                {[1, 2, 3].map(cx => <td key={cx} className="p-6 text-center"><button className={cls("h-12 w-12 rounded-[22px] inline-flex items-center justify-center transition-all shadow-sm", cx === 1 ? "bg-emerald-50 text-emerald-600 scale-110" : "bg-slate-100 text-slate-300 opacity-40")}>{cx === 1 ? <ShieldCheck size={22} /> : <Eye size={18} />}</button></td>)}
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Card>
      <div className="space-y-8">
        <Card noPadding><div className="p-6 border-b border-slate-100 flex items-center justify-between"><h4 className="text-[13px] font-black uppercase text-slate-900 flex items-center gap-2"><UserCheck size={20} /> Defined Roles</h4><button className="h-10 w-10 hover:bg-slate-100 rounded-2xl transition-all text-indigo-600 flex items-center justify-center"><Plus size={20} /></button></div>
          <div className="p-5 space-y-3">{sets.roles.map(r => (
            <button key={r.id} onClick={() => setSel(r.id)} className={cls("w-full flex items-center justify-between p-6 rounded-[32px] transition-all duration-300 text-left group", sel === r.id ? "bg-slate-50 border-2 border-slate-200 shadow-inner" : "bg-white hover:bg-slate-50")}>
              <div><div className="text-[16px] font-black text-slate-900 leading-none mb-1.5">{r.name}</div><div className="text-[10px] font-black text-slate-400 tracking-widest uppercase">{r.system ? "System Auth" : "Custom Layer"}</div></div>
              {sel === r.id && <div className="h-3 w-3 rounded-full bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.8)]" />}
            </button>
          ))}</div></Card>
        <Card className="bg-slate-900 border-none shadow-2xl relative overflow-hidden"><div className="absolute top-0 right-0 p-8 opacity-20"><Shield size={100} className="text-white" /></div><div className="relative z-10 text-white"><h4 className="text-xl font-black mb-4">Security Policy</h4><p className="text-sm font-bold text-slate-400 leading-relaxed mb-6">Roles with <span className="text-white">System Auth</span> have inherent structural permissions that cannot be truncated by the matrix.</p><div className="flex items-center gap-4 text-[12px] font-black text-emerald-400"><CheckCheck size={20} /> Multi-Admin Approval Enforced</div></div></Card>
      </div>
    </div>
  );
};

const AuditSec = ({ logs }) => (
  <Card>
    <SectionTitle subtitle="Maintain a bulletproof legal trail of all logical changes.">Operational Audit Log</SectionTitle>
    <div className="space-y-6">
      {logs.length === 0 ? <div className="py-24 text-center text-slate-300 font-bold"><History size={48} className="mx-auto mb-4 opacity-10" /> No logic changes committed yet.</div> : logs.map(l => (
        <div key={l.id} className="p-8 rounded-[42px] border border-slate-100 bg-white hover:border-slate-300 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-6">
            <div className="h-14 w-14 rounded-3xl bg-slate-100 flex items-center justify-center font-black text-slate-400 uppercase text-lg shrink-0">{l.module.charAt(0)}</div>
            <div>
              <div className="flex items-center gap-3 mb-2"><span className="text-[15px] font-black text-slate-900 uppercase tracking-tighter">{l.module} update</span><Badge color="info">v.engine</Badge></div>
              <p className="text-[14px] font-bold text-slate-500 mb-4 italic leading-relaxed">"{l.reason}"</p>
              <div className="flex items-center gap-4 text-[11px] font-black text-slate-400 uppercase tracking-wider"><div className="flex items-center gap-2"><UserCheck size={14} className="text-indigo-500" /> {l.by}</div><div className="h-1 w-1 rounded-full bg-slate-200" /><div className="flex items-center gap-2"><History size={14} /> {new Date(l.at).toLocaleString()}</div></div>
            </div>
          </div>
          <GhostBtn className="px-6 py-2.5 h-auto text-[11px] rounded-2xl bg-slate-900 text-white border-none shadow-lg">View snapshot</GhostBtn>
        </div>
      ))}
    </div>
  </Card>
);

export default Settings;
