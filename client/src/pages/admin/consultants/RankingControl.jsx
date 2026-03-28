import React, { useMemo, useState } from "react";
import {
  SlidersHorizontal,
  Sparkles,
  ShieldAlert,
  Radar,
  FlaskConical,
  Search,
  Plus,
  X,
  ChevronUp,
  ChevronDown,
  Lock,
  Ban,
  ShieldCheck,
  TriangleAlert,
  Zap,
  FileText,
  Home,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Scale,
} from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

/* =========================================================
   DUMMY DATA
========================================================= */
const CONSULTANTS = [
  {
    id: "CON-101",
    name: "Adarsh Auto Consultants",
    tier: "Premium",
    city: "Ahmedabad",
    score: 72.5,
    position: 8,
    relevanceScore: 31,
    qualityScore: 29,
    tierScore: 8,
    penalty: -4,
  },
  {
    id: "CON-102",
    name: "Premium Cars",
    tier: "Premium",
    city: "Surat",
    score: 68.0,
    position: 11,
    relevanceScore: 28,
    qualityScore: 30,
    tierScore: 10,
    penalty: 0,
  },
  {
    id: "CON-103",
    name: "XYZ Motors",
    tier: "Pro",
    city: "Vadodara",
    score: 61.2,
    position: 17,
    relevanceScore: 26,
    qualityScore: 25,
    tierScore: 6,
    penalty: -2,
  },
  {
    id: "CON-104",
    name: "ABC Cars",
    tier: "Basic",
    city: "Rajkot",
    score: 54.7,
    position: 25,
    relevanceScore: 24,
    qualityScore: 22,
    tierScore: 2,
    penalty: -1,
  },
];

const INITIAL_LAYER_WEIGHTS = {
  relevance: 50,
  quality: 40,
  tier: 10,
};

const INITIAL_RELEVANCE_FIELDS = [
  { key: "vehicleType", label: "Vehicle Type", value: 5 },
  { key: "bodyType", label: "Body Type", value: 8 },
  { key: "fuelType", label: "Fuel Type", value: 6 },
  { key: "transmission", label: "Transmission", value: 4 },
  { key: "maker", label: "Maker (Brand)", value: 10 },
  { key: "model", label: "Model", value: 12 },
  { key: "budgetMatch", label: "Budget Match", value: 3 },
  { key: "cityMatch", label: "City Match", value: 6 },
  { key: "stateMatch", label: "State Match", value: 3 },
];

const INITIAL_QUALITY_CONFIG = {
  inspectionWeight: 15,
  responseTimeWeight: 8,
  sellerRatingWeight: 7,
  freshnessWeight: 10,
  inspectionRules: [
    { label: "Not Inspected", value: 0 },
    { label: "Inspection Requested", value: 5 },
    { label: "Inspection Completed", value: 10 },
    { label: "Inspection + High Score", value: 15 },
  ],
  responseRules: [
    { label: "<30 minutes", value: 8 },
    { label: "<2 hours", value: 6 },
    { label: "<6 hours", value: 4 },
    { label: "<12 hours", value: 2 },
    { label: ">12 hours", value: 0 },
  ],
  freshnessRules: [
    { label: "<3 days", value: 10 },
    { label: "<7 days", value: 8 },
    { label: "<14 days", value: 6 },
    { label: "<30 days", value: 4 },
    { label: ">30 days", value: 2 },
  ],
};

const INITIAL_TIER_MULTIPLIERS = {
  basic: 2,
  pro: 6,
  premium: 10,
};

const INITIAL_FALLBACKS = {
  defaultSellerRating: 3.5,
  defaultResponseScore: 4,
  defaultInspectionScore: 3,
  newListingBoost: true,
  lowInventoryRelaxation: true,
};

const INITIAL_OVERRIDES = [
  {
    id: "OVR-001",
    consultantId: "CON-101",
    consultant: "Adarsh Auto Consultants",
    currentScore: 74,
    override: "+8%",
    type: "Score Boost",
    reason: "Festive Boost",
    expiry: "2026-03-20",
    status: "Active",
  },
  {
    id: "OVR-002",
    consultantId: "CON-102",
    consultant: "Premium Cars",
    currentScore: 68,
    override: "+5%",
    type: "Homepage Eligibility",
    reason: "Launch Partner",
    expiry: "2026-03-27",
    status: "Active",
  },
];

const INITIAL_PENALTIES = [
  {
    id: "PEN-001",
    consultantId: "CON-103",
    consultant: "XYZ Motors",
    penalty: "Ranking Reduction",
    value: "-10%",
    reason: "Fake listing",
    expiry: "2026-03-23",
    status: "Active",
  },
  {
    id: "PEN-002",
    consultantId: "CON-104",
    consultant: "ABC Cars",
    penalty: "Homepage Removal",
    value: "-",
    reason: "Spam",
    expiry: "2026-03-20",
    status: "Active",
  },
];

const INITIAL_FRAUD_SIGNALS = [
  {
    id: "FRD-001",
    consultantId: "CON-101",
    consultant: "Adarsh Auto Consultants",
    signal: "Same IP Inquiries",
    severity: "HIGH",
    detected: "Today",
    action: "Investigate",
  },
  {
    id: "FRD-002",
    consultantId: "CON-103",
    consultant: "XYZ Motors",
    signal: "Reposting Spam",
    severity: "MEDIUM",
    detected: "Yesterday",
    action: "Review",
  },
  {
    id: "FRD-003",
    consultantId: "CON-104",
    consultant: "ABC Cars",
    signal: "Conversion Manipulation",
    severity: "HIGH",
    detected: "Today",
    action: "Freeze Ranking",
  },
];

const INITIAL_LOGS = [
  {
    id: "LOG-001",
    adminId: "ADM-01",
    consultantId: "CON-101",
    actionType: "Override Applied",
    oldScore: 70,
    newScore: 74,
    reason: "Festive Boost",
    timestamp: "2026-03-13 10:20 AM",
    expiry: "2026-03-20",
  },
  {
    id: "LOG-002",
    adminId: "ADM-01",
    consultantId: "CON-103",
    actionType: "Penalty Applied",
    oldScore: 68,
    newScore: 61.2,
    reason: "Fake listing",
    timestamp: "2026-03-12 04:15 PM",
    expiry: "2026-03-23",
  },
];

/* =========================================================
   HELPERS
========================================================= */
const statusBadge = (status) => {
  const s = String(status || "").toLowerCase();
  if (s.includes("active")) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (s.includes("expired")) return "bg-slate-100 text-slate-700 border-slate-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
};

const severityBadge = (severity) => {
  const s = String(severity || "").toLowerCase();
  if (s.includes("high")) return "bg-rose-50 text-rose-700 border-rose-200";
  if (s.includes("medium")) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-emerald-50 text-emerald-700 border-emerald-200";
};

const tierBadge = (tier) => {
  const t = String(tier || "").toLowerCase();
  if (t.includes("premium")) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (t.includes("pro")) return "bg-sky-50 text-sky-700 border-sky-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
};

const actionBadge = (action) => {
  const a = String(action || "").toLowerCase();
  if (a.includes("freeze") || a.includes("suspend")) return "bg-rose-50 text-rose-700 border-rose-200";
  if (a.includes("penalty")) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-sky-50 text-sky-700 border-sky-200";
};

const calcPositionFromScore = (score) => {
  if (score >= 82) return 4;
  if (score >= 78) return 6;
  if (score >= 74) return 8;
  if (score >= 70) return 10;
  if (score >= 66) return 12;
  if (score >= 60) return 17;
  return 24;
};

/* =========================================================
   UI PIECES
========================================================= */
function TopCard({ title, value, icon: Icon, tone = "sky" }) {
  const toneMap = {
    sky: "bg-sky-50 text-sky-600 border-sky-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
  };

  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-6 overflow-hidden group shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10 flex items-end justify-between">
        <div>
          <div className="text-[12px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-2">
            {title}
          </div>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900">{value}</div>
        </div>
        <div
          className={cls(
            "w-10 h-10 rounded-xl border flex items-center justify-center",
            toneMap[tone]
          )}
        >
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, subtitle, right, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 px-5 py-4 md:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
          </div>
          {right}
        </div>
      </div>
      <div className="p-5 md:p-6">{children}</div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-[13px] font-medium text-slate-700">{label}</label>
      {children}
    </div>
  );
}

function Modal({ open, title, subtitle, onClose, children }) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[80] bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[81] w-[95%] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-5 md:p-6">{children}</div>
      </div>
    </>
  );
}

function RuleEditor({ title, rows, setRows }) {
  const updateValue = (index, delta) => {
    setRows((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, value: Math.max(0, Number(item.value) + delta) } : item
      )
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-sm font-bold text-slate-900 mb-3">{title}</div>
      <div className="space-y-3">
        {rows.map((row, index) => (
          <div
            key={`${title}-${index}`}
            className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3"
          >
            <div className="text-sm font-medium text-slate-700">{row.label}</div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateValue(index, 1)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
              >
                <ChevronUp size={14} />
              </button>
              <div className="min-w-[48px] text-center text-sm font-bold text-slate-900">
                {row.value}
              </div>
              <button
                onClick={() => updateValue(index, -1)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
              >
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   MAIN
========================================================= */
const RankingControl = () => {
  const tabs = [
    { key: "engine", label: "Global Ranking Engine", icon: SlidersHorizontal },
    { key: "overrides", label: "Consultant Overrides", icon: Sparkles },
    { key: "penalties", label: "Penalties", icon: ShieldAlert },
    { key: "fraud", label: "Fraud Signals", icon: Radar },
    { key: "lab", label: "Simulation Lab", icon: FlaskConical },
  ];

  const [activeTab, setActiveTab] = useState("engine");

  const [layerWeights, setLayerWeights] = useState(INITIAL_LAYER_WEIGHTS);
  const [relevanceFields, setRelevanceFields] = useState(INITIAL_RELEVANCE_FIELDS);
  const [qualityConfig, setQualityConfig] = useState(INITIAL_QUALITY_CONFIG);
  const [tierMultipliers, setTierMultipliers] = useState(INITIAL_TIER_MULTIPLIERS);
  const [fallbacks, setFallbacks] = useState(INITIAL_FALLBACKS);

  const [overrides, setOverrides] = useState(INITIAL_OVERRIDES);
  const [penalties, setPenalties] = useState(INITIAL_PENALTIES);
  const [fraudSignals, setFraudSignals] = useState(INITIAL_FRAUD_SIGNALS);
  const [logs, setLogs] = useState(INITIAL_LOGS);

  const [overrideModal, setOverrideModal] = useState(false);
  const [penaltyModal, setPenaltyModal] = useState(false);

  const [overrideForm, setOverrideForm] = useState({
    consultantId: CONSULTANTS[0].id,
    type: "Score Boost",
    value: "+5%",
    reason: "",
    expiry: "",
  });

  const [penaltyForm, setPenaltyForm] = useState({
    consultantId: CONSULTANTS[0].id,
    type: "Ranking Score Reduction",
    value: "-10%",
    reason: "",
    expiry: "",
  });

  const [simulationConsultantId, setSimulationConsultantId] = useState(CONSULTANTS[0].id);
  const [searchContext, setSearchContext] = useState("Diesel SUVs Ahmedabad");

  const layerTotal = useMemo(
    () => Number(layerWeights.relevance) + Number(layerWeights.quality) + Number(layerWeights.tier),
    [layerWeights]
  );

  const relevanceRawTotal = useMemo(
    () => relevanceFields.reduce((sum, item) => sum + Number(item.value), 0),
    [relevanceFields]
  );

  const qualityTotal = useMemo(
    () =>
      Number(qualityConfig.inspectionWeight) +
      Number(qualityConfig.responseTimeWeight) +
      Number(qualityConfig.sellerRatingWeight) +
      Number(qualityConfig.freshnessWeight),
    [qualityConfig]
  );

  const selectedConsultant = useMemo(
    () => CONSULTANTS.find((item) => item.id === simulationConsultantId) || CONSULTANTS[0],
    [simulationConsultantId]
  );

  const simulatedBreakdown = useMemo(() => {
    const relevanceShare = layerWeights.relevance / 50;
    const qualityShare = layerWeights.quality / 40;
    const tierShare = layerWeights.tier / 10;

    const newRelevance = Number((selectedConsultant.relevanceScore * relevanceShare).toFixed(1));
    const newQuality = Number((selectedConsultant.qualityScore * qualityShare).toFixed(1));
    const newTier = Number((selectedConsultant.tierScore * tierShare).toFixed(1));
    const penaltyImpact = selectedConsultant.penalty;

    const finalScore = Number((newRelevance + newQuality + newTier + penaltyImpact).toFixed(1));

    return {
      currentScore: selectedConsultant.score,
      currentPosition: selectedConsultant.position,
      relevanceImpact: newRelevance,
      qualityImpact: newQuality,
      tierImpact: newTier,
      penaltyImpact,
      finalScore,
      finalPosition: calcPositionFromScore(finalScore),
    };
  }, [selectedConsultant, layerWeights]);

  const stats = useMemo(() => {
    return {
      totalOverrides: overrides.filter((i) => i.status === "Active").length,
      totalPenalties: penalties.filter((i) => i.status === "Active").length,
      highFrauds: fraudSignals.filter((i) => i.severity === "HIGH").length,
      immutableLogs: logs.length,
    };
  }, [overrides, penalties, fraudSignals, logs]);

  const updateLayer = (key, value) => {
    setLayerWeights((prev) => ({ ...prev, [key]: Number(value) }));
  };

  const adjustRelevanceField = (key, delta) => {
    setRelevanceFields((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, value: Math.max(0, item.value + delta) } : item
      )
    );
  };

  const applyEngineChanges = () => {
    setLogs((prev) => [
      {
        id: `LOG-${String(prev.length + 1).padStart(3, "0")}`,
        adminId: "ADM-01",
        consultantId: "GLOBAL",
        actionType: "Ranking Engine Updated",
        oldScore: "—",
        newScore: "—",
        reason: "Updated global ranking engine configuration",
        timestamp: new Date().toLocaleString(),
        expiry: "—",
      },
      ...prev,
    ]);
  };

  const handleAddOverride = () => {
    const consultant = CONSULTANTS.find((c) => c.id === overrideForm.consultantId);
    if (!consultant || !overrideForm.reason || !overrideForm.expiry) return;

    const next = {
      id: `OVR-${String(overrides.length + 1).padStart(3, "0")}`,
      consultantId: consultant.id,
      consultant: consultant.name,
      currentScore: consultant.score,
      override: overrideForm.value,
      type: overrideForm.type,
      reason: overrideForm.reason,
      expiry: overrideForm.expiry,
      status: "Active",
    };

    setOverrides((prev) => [next, ...prev]);
    setLogs((prev) => [
      {
        id: `LOG-${String(prev.length + 1).padStart(3, "0")}`,
        adminId: "ADM-01",
        consultantId: consultant.id,
        actionType: "Override Applied",
        oldScore: consultant.score,
        newScore: Number((consultant.score + 5).toFixed(1)),
        reason: overrideForm.reason,
        timestamp: new Date().toLocaleString(),
        expiry: overrideForm.expiry,
      },
      ...prev,
    ]);

    setOverrideModal(false);
    setOverrideForm({
      consultantId: CONSULTANTS[0].id,
      type: "Score Boost",
      value: "+5%",
      reason: "",
      expiry: "",
    });
  };

  const handleAddPenalty = () => {
    const consultant = CONSULTANTS.find((c) => c.id === penaltyForm.consultantId);
    if (!consultant || !penaltyForm.reason || !penaltyForm.expiry) return;

    const next = {
      id: `PEN-${String(penalties.length + 1).padStart(3, "0")}`,
      consultantId: consultant.id,
      consultant: consultant.name,
      penalty: penaltyForm.type,
      value: penaltyForm.value,
      reason: penaltyForm.reason,
      expiry: penaltyForm.expiry,
      status: "Active",
    };

    setPenalties((prev) => [next, ...prev]);
    setLogs((prev) => [
      {
        id: `LOG-${String(prev.length + 1).padStart(3, "0")}`,
        adminId: "ADM-01",
        consultantId: consultant.id,
        actionType: "Penalty Applied",
        oldScore: consultant.score,
        newScore: Number((consultant.score - 6).toFixed(1)),
        reason: penaltyForm.reason,
        timestamp: new Date().toLocaleString(),
        expiry: penaltyForm.expiry,
      },
      ...prev,
    ]);

    setPenaltyModal(false);
    setPenaltyForm({
      consultantId: CONSULTANTS[0].id,
      type: "Ranking Score Reduction",
      value: "-10%",
      reason: "",
      expiry: "",
    });
  };

  const handleFraudAction = (row, action) => {
    setLogs((prev) => [
      {
        id: `LOG-${String(prev.length + 1).padStart(3, "0")}`,
        adminId: "ADM-01",
        consultantId: row.consultantId,
        actionType: action,
        oldScore: "—",
        newScore: "—",
        reason: `Triggered by fraud signal: ${row.signal}`,
        timestamp: new Date().toLocaleString(),
        expiry: "—",
      },
      ...prev,
    ]);
  };

  return (
    <div className="min-h-screen p-0">
      <div className="mx-auto space-y-6">
        <section className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
              Ranking Control
            </h1>
            <p className="max-w-4xl text-sm leading-relaxed text-slate-500">
              AVX Marketplace Ranking Engine Control Panel to manage scoring layers,
              fairness, overrides, penalties, fraud monitoring, and algorithm simulation.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <TopCard title="Active Overrides" value={stats.totalOverrides} icon={Sparkles} tone="sky" />
          <TopCard title="Active Penalties" value={stats.totalPenalties} icon={ShieldAlert} tone="rose" />
          <TopCard title="High Fraud Alerts" value={stats.highFrauds} icon={Radar} tone="amber" />
          <TopCard title="Immutable Logs" value={stats.immutableLogs} icon={FileText} tone="emerald" />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 px-5 py-4 md:px-6">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={cls(
                      "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
                      active
                        ? "bg-sky-600 text-white"
                        : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                    )}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-5 md:p-6">
            {activeTab === "engine" && (
              <div className="space-y-6">
                <SectionCard
                  title="Layer Weights"
                  subtitle="Three-layer ranking architecture. Total must remain 100%."
                  right={
                    <div
                      className={cls(
                        "inline-flex rounded-full border px-3 py-1 text-xs font-bold",
                        layerTotal === 100
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      )}
                    >
                      Total = {layerTotal}%
                    </div>
                  }
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {[
                      { key: "relevance", label: "Layer 1 — Relevance Score" },
                      { key: "quality", label: "Layer 2 — Quality Score" },
                      { key: "tier", label: "Layer 3 — Tier Multiplier" },
                    ].map((item) => (
                      <div key={item.key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-sm font-bold text-slate-900">{item.label}</div>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={layerWeights[item.key]}
                            onChange={(e) => updateLayer(item.key, e.target.value)}
                            className="w-full accent-sky-600"
                          />
                          <div className="min-w-[68px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-900 text-center">
                            {layerWeights[item.key]}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-700">
                      <FlaskConical size={16} />
                      Simulate Impact
                    </button>
                    <button
                      onClick={applyEngineChanges}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <FileText size={16} />
                      Apply Changes
                    </button>
                  </div>
                </SectionCard>

                <SectionCard
                  title="Relevance Field Weights"
                  subtitle={`Total Raw Weight = ${relevanceRawTotal}. System normalizes this to ${layerWeights.relevance}% relevance contribution.`}
                >
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {relevanceFields.map((field) => (
                      <div
                        key={field.key}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                      >
                        <div className="text-sm font-medium text-slate-700">{field.label}</div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => adjustRelevanceField(field.key, 1)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
                          >
                            <ChevronUp size={14} />
                          </button>
                          <div className="min-w-[40px] text-center text-sm font-bold text-slate-900">
                            {field.value}
                          </div>
                          <button
                            onClick={() => adjustRelevanceField(field.key, -1)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
                          >
                            <ChevronDown size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard
                  title="Quality Score Configuration"
                  subtitle={`Layer 2 total = ${qualityTotal} out of target 40.`}
                >
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                    {[
                      {
                        key: "inspectionWeight",
                        label: "AVX Inspection Weight",
                        value: qualityConfig.inspectionWeight,
                      },
                      {
                        key: "responseTimeWeight",
                        label: "Seller Response Time",
                        value: qualityConfig.responseTimeWeight,
                      },
                      {
                        key: "sellerRatingWeight",
                        label: "Seller Rating",
                        value: qualityConfig.sellerRatingWeight,
                      },
                      {
                        key: "freshnessWeight",
                        label: "Listing Freshness",
                        value: qualityConfig.freshnessWeight,
                      },
                    ].map((item) => (
                      <div key={item.key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-sm font-bold text-slate-900">{item.label}</div>
                        <input
                          type="number"
                          min="0"
                          value={qualityConfig[item.key]}
                          onChange={(e) =>
                            setQualityConfig((prev) => ({
                              ...prev,
                              [item.key]: Number(e.target.value),
                            }))
                          }
                          className="mt-3 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none focus:border-sky-400"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
                    <RuleEditor
                      title="Inspection Score Rules"
                      rows={qualityConfig.inspectionRules}
                      setRows={(rows) => setQualityConfig((prev) => ({ ...prev, inspectionRules: rows }))}
                    />
                    <RuleEditor
                      title="Response Time Score"
                      rows={qualityConfig.responseRules}
                      setRows={(rows) => setQualityConfig((prev) => ({ ...prev, responseRules: rows }))}
                    />
                    <RuleEditor
                      title="Listing Freshness"
                      rows={qualityConfig.freshnessRules}
                      setRows={(rows) => setQualityConfig((prev) => ({ ...prev, freshnessRules: rows }))}
                    />
                  </div>
                </SectionCard>

                <SectionCard
                  title="Tier Ranking Multiplier"
                  subtitle="Premium cannot exceed 2x Basic to preserve fairness."
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {[
                      { key: "basic", label: "Basic" },
                      { key: "pro", label: "Pro" },
                      { key: "premium", label: "Premium" },
                    ].map((item) => (
                      <div key={item.key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-sm font-bold text-slate-900">{item.label}</div>
                        <input
                          type="number"
                          min="0"
                          value={tierMultipliers[item.key]}
                          onChange={(e) =>
                            setTierMultipliers((prev) => ({
                              ...prev,
                              [item.key]: Number(e.target.value),
                            }))
                          }
                          className="mt-3 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none focus:border-sky-400"
                        />
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard
                  title="Cold Start Fallbacks"
                  subtitle="Prevents ranking issues in early marketplace and low-data scenarios."
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="text-sm font-bold text-slate-900">Default Seller Rating</div>
                      <input
                        type="number"
                        step="0.1"
                        value={fallbacks.defaultSellerRating}
                        onChange={(e) =>
                          setFallbacks((prev) => ({
                            ...prev,
                            defaultSellerRating: Number(e.target.value),
                          }))
                        }
                        className="mt-3 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none"
                      />
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="text-sm font-bold text-slate-900">Default Response Score</div>
                      <input
                        type="number"
                        value={fallbacks.defaultResponseScore}
                        onChange={(e) =>
                          setFallbacks((prev) => ({
                            ...prev,
                            defaultResponseScore: Number(e.target.value),
                          }))
                        }
                        className="mt-3 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none"
                      />
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="text-sm font-bold text-slate-900">Default Inspection Score</div>
                      <input
                        type="number"
                        value={fallbacks.defaultInspectionScore}
                        onChange={(e) =>
                          setFallbacks((prev) => ({
                            ...prev,
                            defaultInspectionScore: Number(e.target.value),
                          }))
                        }
                        className="mt-3 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none"
                      />
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex flex-col justify-between">
                      <div className="text-sm font-bold text-slate-900">New Listing Boost (&lt;24h)</div>
                      <button
                        onClick={() =>
                          setFallbacks((prev) => ({
                            ...prev,
                            newListingBoost: !prev.newListingBoost,
                          }))
                        }
                        className={cls(
                          "mt-3 h-11 rounded-xl text-sm font-semibold border",
                          fallbacks.newListingBoost
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-white text-slate-700 border-slate-200"
                        )}
                      >
                        {fallbacks.newListingBoost ? "Enabled" : "Disabled"}
                      </button>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex flex-col justify-between">
                      <div className="text-sm font-bold text-slate-900">Low Inventory Relaxation</div>
                      <button
                        onClick={() =>
                          setFallbacks((prev) => ({
                            ...prev,
                            lowInventoryRelaxation: !prev.lowInventoryRelaxation,
                          }))
                        }
                        className={cls(
                          "mt-3 h-11 rounded-xl text-sm font-semibold border",
                          fallbacks.lowInventoryRelaxation
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-white text-slate-700 border-slate-200"
                        )}
                      >
                        {fallbacks.lowInventoryRelaxation ? "Enabled" : "Disabled"}
                      </button>
                    </div>
                  </div>
                </SectionCard>
              </div>
            )}

            {activeTab === "overrides" && (
              <SectionCard
                title="Consultant Overrides"
                subtitle="Manual ranking adjustments for premium onboarding, campaigns, strategic partnerships, and temporary boosts."
                right={
                  <button
                    onClick={() => setOverrideModal(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
                  >
                    <Plus size={16} />
                    Add Override
                  </button>
                }
              >
                <div className="overflow-x-auto">
                  <table className="min-w-[1100px] w-full border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                        <th className="px-5 py-4">Consultant</th>
                        <th className="px-5 py-4">Current Score</th>
                        <th className="px-5 py-4">Override</th>
                        <th className="px-5 py-4">Reason</th>
                        <th className="px-5 py-4">Expiry</th>
                        <th className="px-5 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {overrides.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-4">
                            <div className="text-sm font-bold text-slate-900">{row.consultant}</div>
                            <div className="mt-1">
                              <span
                                className={cls(
                                  "inline-flex rounded-md border px-2.5 py-1 text-[11px] font-bold",
                                  tierBadge(
                                    CONSULTANTS.find((c) => c.id === row.consultantId)?.tier
                                  )
                                )}
                              >
                                {CONSULTANTS.find((c) => c.id === row.consultantId)?.tier || "—"}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm font-semibold text-slate-900">{row.currentScore}</td>
                          <td className="px-5 py-4">
                            <div className="text-sm font-semibold text-slate-900">{row.type}</div>
                            <div className="mt-1 text-xs text-sky-700 font-bold">{row.override}</div>
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-600">{row.reason}</td>
                          <td className="px-5 py-4 text-sm text-slate-600">{row.expiry}</td>
                          <td className="px-5 py-4">
                            <span
                              className={cls(
                                "inline-flex rounded-md border px-2.5 py-1 text-[11px] font-bold",
                                statusBadge(row.status)
                              )}
                            >
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SectionCard>
            )}

            {activeTab === "penalties" && (
              <SectionCard
                title="Penalties"
                subtitle="Apply ranking penalties when consultants violate policy, spam listings, or damage trust."
                right={
                  <button
                    onClick={() => setPenaltyModal(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
                  >
                    <Plus size={16} />
                    Apply Penalty
                  </button>
                }
              >
                <div className="overflow-x-auto">
                  <table className="min-w-[1100px] w-full border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                        <th className="px-5 py-4">Consultant</th>
                        <th className="px-5 py-4">Penalty</th>
                        <th className="px-5 py-4">Value</th>
                        <th className="px-5 py-4">Reason</th>
                        <th className="px-5 py-4">Expiry</th>
                        <th className="px-5 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {penalties.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-4">
                            <div className="text-sm font-bold text-slate-900">{row.consultant}</div>
                            <div className="mt-1 text-xs text-slate-500">{row.consultantId}</div>
                          </td>
                          <td className="px-5 py-4 text-sm font-semibold text-slate-900">{row.penalty}</td>
                          <td className="px-5 py-4">
                            <span className="inline-flex rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700">
                              {row.value}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-600">{row.reason}</td>
                          <td className="px-5 py-4 text-sm text-slate-600">{row.expiry}</td>
                          <td className="px-5 py-4">
                            <span
                              className={cls(
                                "inline-flex rounded-md border px-2.5 py-1 text-[11px] font-bold",
                                statusBadge(row.status)
                              )}
                            >
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SectionCard>
            )}

            {activeTab === "fraud" && (
              <div className="space-y-6">
                <SectionCard
                  title="Fraud Signals"
                  subtitle="Automatic fraud monitoring for inquiry spikes, relisting spam, fake reviews, inspection tampering, and conversion manipulation."
                >
                  <div className="overflow-x-auto">
                    <table className="min-w-[1200px] w-full border-collapse">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                          <th className="px-5 py-4">Consultant</th>
                          <th className="px-5 py-4">Signal</th>
                          <th className="px-5 py-4">Severity</th>
                          <th className="px-5 py-4">Detected</th>
                          <th className="px-5 py-4">Action</th>
                          <th className="px-5 py-4 text-right">Admin Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {fraudSignals.map((row) => (
                          <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-5 py-4">
                              <div className="text-sm font-bold text-slate-900">{row.consultant}</div>
                            </td>
                            <td className="px-5 py-4 text-sm text-slate-700">{row.signal}</td>
                            <td className="px-5 py-4">
                              <span
                                className={cls(
                                  "inline-flex rounded-md border px-2.5 py-1 text-[11px] font-bold",
                                  severityBadge(row.severity)
                                )}
                              >
                                {row.severity}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-sm text-slate-600">{row.detected}</td>
                            <td className="px-5 py-4">
                              <span
                                className={cls(
                                  "inline-flex rounded-md border px-2.5 py-1 text-[11px] font-bold",
                                  actionBadge(row.action)
                                )}
                              >
                                {row.action}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex flex-wrap justify-end gap-2">
                                <button
                                  onClick={() => handleFraudAction(row, "Investigate")}
                                  className="inline-flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700"
                                >
                                  <Search size={14} />
                                  Investigate
                                </button>
                                <button
                                  onClick={() => handleFraudAction(row, "Apply Penalty")}
                                  className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700"
                                >
                                  <ShieldAlert size={14} />
                                  Apply Penalty
                                </button>
                                <button
                                  onClick={() => handleFraudAction(row, "Suspend Storefront")}
                                  className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700"
                                >
                                  <Ban size={14} />
                                  Suspend
                                </button>
                                <button
                                  onClick={() => handleFraudAction(row, "Freeze Ranking")}
                                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                                >
                                  <Lock size={14} />
                                  Freeze
                                </button>
                                <button
                                  onClick={() => handleFraudAction(row, "Disable Boost")}
                                  className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700"
                                >
                                  <Zap size={14} />
                                  Disable Boost
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </SectionCard>

                <SectionCard
                  title="Auto Penalty Rules"
                  subtitle="System automatically applies restrictions when trust thresholds are crossed."
                >
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
                    {[
                      "Response time > 12 hours",
                      "Conversion < 1%",
                      "3 unresolved disputes",
                      "Fake inspection detected",
                      "Repeated listing spam",
                    ].map((rule) => (
                      <div
                        key={rule}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="text-sm font-bold text-slate-900">{rule}</div>
                        <div className="mt-2 text-xs leading-relaxed text-slate-500">
                          Ranking Score = -5%, Homepage Eligibility = Disabled, Boost Eligibility = Disabled
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </div>
            )}

            {activeTab === "lab" && (
              <div className="space-y-6">
                <SectionCard
                  title="Ranking Simulation Lab"
                  subtitle="Test algorithm changes before deployment using consultant and search context."
                >
                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_1fr]">
                    <div className="space-y-4">
                      <Field label="Consultant">
                        <select
                          value={simulationConsultantId}
                          onChange={(e) => setSimulationConsultantId(e.target.value)}
                          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none focus:border-sky-400"
                        >
                          {CONSULTANTS.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </Field>

                      <Field label="Search Context">
                        <input
                          value={searchContext}
                          onChange={(e) => setSearchContext(e.target.value)}
                          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none focus:border-sky-400"
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                          Current Score
                        </div>
                        <div className="mt-2 text-2xl font-extrabold text-slate-900">
                          {simulatedBreakdown.currentScore}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                          Current Position
                        </div>
                        <div className="mt-2 text-2xl font-extrabold text-slate-900">
                          #{simulatedBreakdown.currentPosition}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                          New Score
                        </div>
                        <div className="mt-2 text-2xl font-extrabold text-slate-900">
                          {simulatedBreakdown.finalScore}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                          New Position
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-2xl font-extrabold text-slate-900">
                          #{simulatedBreakdown.finalPosition}
                          {simulatedBreakdown.finalPosition < simulatedBreakdown.currentPosition ? (
                            <ArrowUpRight size={18} className="text-emerald-600" />
                          ) : (
                            <ArrowDownRight size={18} className="text-amber-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard
                  title="Consultant Ranking Breakdown"
                  subtitle="Admin view of scoring composition and penalty impact."
                >
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="text-lg font-bold text-slate-900">{selectedConsultant.name}</div>
                        <div className="mt-1 text-sm text-slate-500">{searchContext}</div>
                      </div>
                      <span
                        className={cls(
                          "inline-flex rounded-md border px-2.5 py-1 text-[11px] font-bold",
                          tierBadge(selectedConsultant.tier)
                        )}
                      >
                        {selectedConsultant.tier}
                      </span>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                          Relevance Score
                        </div>
                        <div className="mt-2 text-2xl font-extrabold text-slate-900">
                          {simulatedBreakdown.relevanceImpact} / {layerWeights.relevance}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                          Quality Score
                        </div>
                        <div className="mt-2 text-2xl font-extrabold text-slate-900">
                          {simulatedBreakdown.qualityImpact} / {layerWeights.quality}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                          Tier Score
                        </div>
                        <div className="mt-2 text-2xl font-extrabold text-slate-900">
                          {simulatedBreakdown.tierImpact} / {layerWeights.tier}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                          Penalty
                        </div>
                        <div className="mt-2 text-2xl font-extrabold text-rose-700">
                          {simulatedBreakdown.penaltyImpact}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                          Final Score
                        </div>
                        <div className="mt-2 text-2xl font-extrabold text-slate-900">
                          {simulatedBreakdown.finalScore}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">
                      <button className="inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-sm font-semibold text-sky-700">
                        <Sparkles size={15} />
                        Apply Override
                      </button>
                      <button className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700">
                        <ShieldAlert size={15} />
                        Add Penalty
                      </button>
                      <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">
                        <Lock size={15} />
                        Freeze Ranking
                      </button>
                      <button className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-700">
                        <Radar size={15} />
                        View Fraud Signals
                      </button>
                    </div>
                  </div>
                </SectionCard>
              </div>
            )}
          </div>
        </section>

        <SectionCard
          title="Logging System (Mandatory)"
          subtitle="Every ranking action is logged with admin, consultant, action type, score delta, reason, timestamp, and expiry. Logs are immutable."
          right={
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              <Scale size={14} />
              Immutable Audit Trail
            </span>
          }
        >
          <div className="space-y-3">
            {logs.slice(0, 8).map((log) => (
              <div key={log.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm font-bold text-slate-900">{log.actionType}</div>
                    <div className="text-[11px] font-semibold text-slate-400">{log.id}</div>
                  </div>

                  <div className="text-xs text-slate-500">
                    Admin: {log.adminId} • Consultant: {log.consultantId}
                  </div>

                  <div className="text-sm text-slate-600">
                    Reason: <span className="font-medium text-slate-800">{log.reason}</span>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span>Old Score: {log.oldScore}</span>
                    <span>New Score: {log.newScore}</span>
                    <span>Expiry: {log.expiry}</span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Override Modal */}
      <Modal
        open={overrideModal}
        onClose={() => setOverrideModal(false)}
        title="Add Override"
        subtitle="Apply manual ranking adjustment for campaigns, onboarding, homepage eligibility, or position lock."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Consultant">
            <select
              value={overrideForm.consultantId}
              onChange={(e) => setOverrideForm((p) => ({ ...p, consultantId: e.target.value }))}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-sky-400"
            >
              {CONSULTANTS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Override Type">
            <select
              value={overrideForm.type}
              onChange={(e) => setOverrideForm((p) => ({ ...p, type: e.target.value }))}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-sky-400"
            >
              <option>Score Boost</option>
              <option>Category Priority</option>
              <option>Homepage Eligibility</option>
              <option>Freeze Ranking</option>
              <option>Manual Position Lock</option>
            </select>
          </Field>

          <Field label="Value">
            <input
              value={overrideForm.value}
              onChange={(e) => setOverrideForm((p) => ({ ...p, value: e.target.value }))}
              placeholder="+5%"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-sky-400"
            />
          </Field>

          <Field label="Expiry">
            <input
              type="date"
              value={overrideForm.expiry}
              onChange={(e) => setOverrideForm((p) => ({ ...p, expiry: e.target.value }))}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-sky-400"
            />
          </Field>

          <div className="md:col-span-2">
            <Field label="Reason">
              <textarea
                rows={4}
                value={overrideForm.reason}
                onChange={(e) => setOverrideForm((p) => ({ ...p, reason: e.target.value }))}
                placeholder="Enter reason..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
              />
            </Field>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-4">
          <button
            onClick={() => setOverrideModal(false)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAddOverride}
            className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
          >
            Apply Override
          </button>
        </div>
      </Modal>

      {/* Penalty Modal */}
      <Modal
        open={penaltyModal}
        onClose={() => setPenaltyModal(false)}
        title="Apply Penalty"
        subtitle="Apply score reduction, pushdown, homepage removal, or disable boost eligibility."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Consultant">
            <select
              value={penaltyForm.consultantId}
              onChange={(e) => setPenaltyForm((p) => ({ ...p, consultantId: e.target.value }))}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-rose-400"
            >
              {CONSULTANTS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Penalty Type">
            <select
              value={penaltyForm.type}
              onChange={(e) => setPenaltyForm((p) => ({ ...p, type: e.target.value }))}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-rose-400"
            >
              <option>Ranking Score Reduction</option>
              <option>Search Pushdown</option>
              <option>Category Visibility Drop</option>
              <option>Homepage Removal</option>
              <option>Disable Boost Eligibility</option>
            </select>
          </Field>

          <Field label="Value">
            <input
              value={penaltyForm.value}
              onChange={(e) => setPenaltyForm((p) => ({ ...p, value: e.target.value }))}
              placeholder="-10%"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-rose-400"
            />
          </Field>

          <Field label="Expiry">
            <input
              type="date"
              value={penaltyForm.expiry}
              onChange={(e) => setPenaltyForm((p) => ({ ...p, expiry: e.target.value }))}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-rose-400"
            />
          </Field>

          <div className="md:col-span-2">
            <Field label="Reason">
              <textarea
                rows={4}
                value={penaltyForm.reason}
                onChange={(e) => setPenaltyForm((p) => ({ ...p, reason: e.target.value }))}
                placeholder="Enter reason..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-400"
              />
            </Field>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-4">
          <button
            onClick={() => setPenaltyModal(false)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAddPenalty}
            className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
          >
            Apply Penalty
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default RankingControl;