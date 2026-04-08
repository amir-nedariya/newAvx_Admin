import React, { useMemo, useState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
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
  Loader2,
} from "lucide-react";
import { getGlobalRankingConfig, updateGlobalRankingConfig, getConsultantOverrides, getConsultantPenalties, getAllConsultantNames, applyOverride, applyPenalties } from "../../../api/consultationApi";

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
  preferenceScoreWeight: 50,
  qualityScoreWeight: 40,
  tierScoreWeight: 10,
};

const INITIAL_PREFERENCE_FIELDS = [
  { key: "vehicleTypeScore", label: "Vehicle Type", value: 0 },
  { key: "vehicleSubTypeScore", label: "Vehicle Sub Type", value: 0 },
  { key: "makerScore", label: "Maker (Brand)", value: 0 },
  { key: "modelScore", label: "Model", value: 0 },
  { key: "fuelTypeScore", label: "Fuel Type", value: 0 },
  { key: "transmissionTypeScore", label: "Transmission Type", value: 0 },
  { key: "cityScore", label: "City Match", value: 0 },
  { key: "stateScore", label: "State Match", value: 0 },
  { key: "budgetScore", label: "Budget Match", value: 0 },
];

const INITIAL_QUALITY_CONFIG = {
  inspectionRules: [
    { key: "notInspectedScore", label: "Not Inspected", value: 0 },
    { key: "inspectionRequestedScore", label: "Inspection Requested", value: 0 },
    { key: "avxInspectedScore", label: "AVX Inspected", value: 0 },
    { key: "avxInspectedGoodRatingScore", label: "AVX Inspected (7+ Rating)", value: 0 },
  ],
  responseRules: [
    { key: "responseUnder30MinScore", label: "< 30 minutes", value: 0 },
    { key: "responseUnder2HourScore", label: "< 2 hours", value: 0 },
    { key: "responseUnder6HourScore", label: "< 6 hours", value: 0 },
    { key: "responseUnder12HourScore", label: "< 12 hours", value: 0 },
  ],
  sellerRatingScore: 0,
  freshnessRules: [
    { key: "listingUnder3DayScore", label: "< 3 days", value: 0 },
    { key: "listingUnder7DayScore", label: "< 7 days", value: 0 },
    { key: "listingUnder15DayScore", label: "< 15 days", value: 0 },
    { key: "listingUnder30DayScore", label: "< 30 days", value: 0 },
  ],
};

const INITIAL_TIER_SCORES = {
  userSellerScore: 0,
  basicTierScore: 0,
  proTierScore: 0,
  premiumTierScore: 0,
};

const INITIAL_PENALTY_CONFIG = {
  minExpectedSellerRating: 0,
  sellerRatingPenaltyScore: 0,
  maxExpectedResponseMinutes: 7200,
  responseTimePenaltyScore: 0,
};

const INITIAL_FALLBACKS = {
  newListingFallbackThresholdDays: 7,
  fallbackBaselineSellerRating: 0,
  fallbackBaselineResponseMinutes: 60,
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
    // { key: "fraud", label: "Fraud Signals", icon: Radar },
    // { key: "lab", label: "Simulation Lab", icon: FlaskConical },
  ];

  const [activeTab, setActiveTab] = useState("engine");
  const [loading, setLoading] = useState(true);
  const [configLoaded, setConfigLoaded] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Store original config for change detection
  const [originalConfig, setOriginalConfig] = useState(null);

  const [layerWeights, setLayerWeights] = useState(INITIAL_LAYER_WEIGHTS);
  const [preferenceFields, setPreferenceFields] = useState(INITIAL_PREFERENCE_FIELDS);
  const [qualityConfig, setQualityConfig] = useState(INITIAL_QUALITY_CONFIG);
  const [tierScores, setTierScores] = useState(INITIAL_TIER_SCORES);
  const [penaltyConfig, setPenaltyConfig] = useState(INITIAL_PENALTY_CONFIG);
  const [fallbacks, setFallbacks] = useState(INITIAL_FALLBACKS);

  const [overrides, setOverrides] = useState([]);
  const [penalties, setPenalties] = useState([]);
  const [fraudSignals, setFraudSignals] = useState(INITIAL_FRAUD_SIGNALS);
  const [logs, setLogs] = useState(INITIAL_LOGS);

  const [overridesLoading, setOverridesLoading] = useState(false);
  const [penaltiesLoading, setPenaltiesLoading] = useState(false);
  const [addOverrideLoading, setAddOverrideLoading] = useState(false);
  const [addPenaltyLoading, setAddPenaltyLoading] = useState(false);

  const [consultantsList, setConsultantsList] = useState([]);
  const [consultantsLoading, setConsultantsLoading] = useState(false);
  const [consultantSearch, setConsultantSearch] = useState("");
  const [penaltyConsultantSearch, setPenaltyConsultantSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedDropdownIndex, setSelectedDropdownIndex] = useState(-1);
  const [penaltyDropdownOpen, setPenaltyDropdownOpen] = useState(false);
  const [penaltySelectedDropdownIndex, setPenaltySelectedDropdownIndex] = useState(-1);

  const [overrideModal, setOverrideModal] = useState(false);
  const [penaltyModal, setPenaltyModal] = useState(false);

  const [overrideForm, setOverrideForm] = useState({
    consultationId: "",
    userId: "",
    type: "Score Boost",
    value: "",
    reason: "",
    expiry: "",
  });

  const [penaltyForm, setPenaltyForm] = useState({
    consultationId: "",
    userId: "",
    type: "Ranking Score Reduction",
    value: "",
    reason: "",
    expiry: "",
  });

  const [simulationConsultantId, setSimulationConsultantId] = useState(CONSULTANTS[0].id);
  const [searchContext, setSearchContext] = useState("Diesel SUVs Ahmedabad");

  const layerTotal = useMemo(
    () => Number(layerWeights.preferenceScoreWeight) + Number(layerWeights.qualityScoreWeight) + Number(layerWeights.tierScoreWeight),
    [layerWeights]
  );

  const preferenceRawTotal = useMemo(
    () => preferenceFields.reduce((sum, item) => sum + Number(item.value), 0),
    [preferenceFields]
  );

  const qualityInspectionTotal = useMemo(
    () => qualityConfig.inspectionRules.reduce((sum, item) => sum + Number(item.value), 0),
    [qualityConfig.inspectionRules]
  );

  const qualityResponseTotal = useMemo(
    () => qualityConfig.responseRules.reduce((sum, item) => sum + Number(item.value), 0),
    [qualityConfig.responseRules]
  );

  const qualityFreshnessTotal = useMemo(
    () => qualityConfig.freshnessRules.reduce((sum, item) => sum + Number(item.value), 0),
    [qualityConfig.freshnessRules]
  );

  const tierTotal = useMemo(
    () => Number(tierScores.userSellerScore) + Number(tierScores.basicTierScore) + Number(tierScores.proTierScore) + Number(tierScores.premiumTierScore),
    [tierScores]
  );

  const filteredConsultants = useMemo(() => {
    if (!consultantSearch.trim()) return consultantsList;

    const searchLower = consultantSearch.toLowerCase();
    return consultantsList.filter(c =>
      c.consultationName?.toLowerCase().includes(searchLower)
    );
  }, [consultantsList, consultantSearch]);

  const filteredPenaltyConsultants = useMemo(() => {
    if (!penaltyConsultantSearch.trim()) return consultantsList;

    const searchLower = penaltyConsultantSearch.toLowerCase();
    return consultantsList.filter(c =>
      c.consultationName?.toLowerCase().includes(searchLower)
    );
  }, [consultantsList, penaltyConsultantSearch]);

  // Fetch ranking config on mount
  useEffect(() => {
    fetchRankingConfig();
  }, []);

  // Fetch overrides when overrides tab is active
  useEffect(() => {
    if (activeTab === "overrides") {
      fetchConsultantOverrides();
    }
  }, [activeTab]);

  // Fetch penalties when penalties tab is active
  useEffect(() => {
    if (activeTab === "penalties") {
      fetchConsultantPenalties();
    }
  }, [activeTab]);

  // Scroll selected dropdown item into view
  useEffect(() => {
    if (selectedDropdownIndex >= 0) {
      const element = document.querySelector(`[data-dropdown-index="${selectedDropdownIndex}"]`);
      if (element) {
        element.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [selectedDropdownIndex]);

  // Scroll selected penalty dropdown item into view
  useEffect(() => {
    if (penaltySelectedDropdownIndex >= 0) {
      const element = document.querySelector(`[data-penalty-dropdown-index="${penaltySelectedDropdownIndex}"]`);
      if (element) {
        element.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [penaltySelectedDropdownIndex]);

  // Detect changes in configuration
  useEffect(() => {
    if (!originalConfig || !configLoaded) return;

    const currentConfig = buildConfigPayload();
    const hasChanged = JSON.stringify(currentConfig) !== JSON.stringify(buildConfigPayloadFromOriginal(originalConfig));
    setHasChanges(hasChanged);
  }, [layerWeights, preferenceFields, qualityConfig, tierScores, penaltyConfig, fallbacks, originalConfig, configLoaded]);

  // Build payload from current state
  const buildConfigPayload = () => {
    const payload = {
      // Final calculation weights
      preferenceScoreWeight: Number(layerWeights.preferenceScoreWeight),
      qualityScoreWeight: Number(layerWeights.qualityScoreWeight),
      tierScoreWeight: Number(layerWeights.tierScoreWeight),

      // Preference scores
      vehicleTypeScore: Number(preferenceFields.find(f => f.key === "vehicleTypeScore")?.value || 0),
      vehicleSubTypeScore: Number(preferenceFields.find(f => f.key === "vehicleSubTypeScore")?.value || 0),
      makerScore: Number(preferenceFields.find(f => f.key === "makerScore")?.value || 0),
      modelScore: Number(preferenceFields.find(f => f.key === "modelScore")?.value || 0),
      fuelTypeScore: Number(preferenceFields.find(f => f.key === "fuelTypeScore")?.value || 0),
      transmissionTypeScore: Number(preferenceFields.find(f => f.key === "transmissionTypeScore")?.value || 0),
      cityScore: Number(preferenceFields.find(f => f.key === "cityScore")?.value || 0),
      stateScore: Number(preferenceFields.find(f => f.key === "stateScore")?.value || 0),
      budgetScore: Number(preferenceFields.find(f => f.key === "budgetScore")?.value || 0),

      // Quality scores - Inspection
      notInspectedScore: Number(qualityConfig.inspectionRules.find(r => r.key === "notInspectedScore")?.value || 0),
      inspectionRequestedScore: Number(qualityConfig.inspectionRules.find(r => r.key === "inspectionRequestedScore")?.value || 0),
      avxInspectedScore: Number(qualityConfig.inspectionRules.find(r => r.key === "avxInspectedScore")?.value || 0),
      avxInspectedGoodRatingScore: Number(qualityConfig.inspectionRules.find(r => r.key === "avxInspectedGoodRatingScore")?.value || 0),

      // Quality scores - Response time
      responseUnder30MinScore: Number(qualityConfig.responseRules.find(r => r.key === "responseUnder30MinScore")?.value || 0),
      responseUnder2HourScore: Number(qualityConfig.responseRules.find(r => r.key === "responseUnder2HourScore")?.value || 0),
      responseUnder6HourScore: Number(qualityConfig.responseRules.find(r => r.key === "responseUnder6HourScore")?.value || 0),
      responseUnder12HourScore: Number(qualityConfig.responseRules.find(r => r.key === "responseUnder12HourScore")?.value || 0),

      // Quality scores - Seller rating
      sellerRatingScore: Number(qualityConfig.sellerRatingScore),

      // Quality scores - Listing freshness
      listingUnder3DayScore: Number(qualityConfig.freshnessRules.find(r => r.key === "listingUnder3DayScore")?.value || 0),
      listingUnder7DayScore: Number(qualityConfig.freshnessRules.find(r => r.key === "listingUnder7DayScore")?.value || 0),
      listingUnder15DayScore: Number(qualityConfig.freshnessRules.find(r => r.key === "listingUnder15DayScore")?.value || 0),
      listingUnder30DayScore: Number(qualityConfig.freshnessRules.find(r => r.key === "listingUnder30DayScore")?.value || 0),

      // Tier scores
      userSellerScore: Number(tierScores.userSellerScore),
      basicTierScore: Number(tierScores.basicTierScore),
      proTierScore: Number(tierScores.proTierScore),
      premiumTierScore: Number(tierScores.premiumTierScore),

      // Penalty scores
      minExpectedSellerRating: Number(penaltyConfig.minExpectedSellerRating),
      sellerRatingPenaltyScore: Number(penaltyConfig.sellerRatingPenaltyScore),
      maxExpectedResponseMinutes: Number(penaltyConfig.maxExpectedResponseMinutes),
      responseTimePenaltyScore: Number(penaltyConfig.responseTimePenaltyScore),

      // Fallback config
      newListingFallbackThresholdDays: Number(fallbacks.newListingFallbackThresholdDays),
      fallbackBaselineSellerRating: Number(fallbacks.fallbackBaselineSellerRating),
      fallbackBaselineResponseMinutes: Number(fallbacks.fallbackBaselineResponseMinutes),
    };

    return payload;
  };

  // Build payload from original config for comparison
  const buildConfigPayloadFromOriginal = (config) => {
    return {
      preferenceScoreWeight: Number(config.preferenceScoreWeight),
      qualityScoreWeight: Number(config.qualityScoreWeight),
      tierScoreWeight: Number(config.tierScoreWeight),
      vehicleTypeScore: Number(config.vehicleTypeScore),
      vehicleSubTypeScore: Number(config.vehicleSubTypeScore),
      makerScore: Number(config.makerScore),
      modelScore: Number(config.modelScore),
      fuelTypeScore: Number(config.fuelTypeScore),
      transmissionTypeScore: Number(config.transmissionTypeScore),
      cityScore: Number(config.cityScore),
      stateScore: Number(config.stateScore),
      budgetScore: Number(config.budgetScore),
      notInspectedScore: Number(config.notInspectedScore),
      inspectionRequestedScore: Number(config.inspectionRequestedScore),
      avxInspectedScore: Number(config.avxInspectedScore),
      avxInspectedGoodRatingScore: Number(config.avxInspectedGoodRatingScore),
      responseUnder30MinScore: Number(config.responseUnder30MinScore),
      responseUnder2HourScore: Number(config.responseUnder2HourScore),
      responseUnder6HourScore: Number(config.responseUnder6HourScore),
      responseUnder12HourScore: Number(config.responseUnder12HourScore),
      sellerRatingScore: Number(config.sellerRatingScore),
      listingUnder3DayScore: Number(config.listingUnder3DayScore),
      listingUnder7DayScore: Number(config.listingUnder7DayScore),
      listingUnder15DayScore: Number(config.listingUnder15DayScore),
      listingUnder30DayScore: Number(config.listingUnder30DayScore),
      userSellerScore: Number(config.userSellerScore),
      basicTierScore: Number(config.basicTierScore),
      proTierScore: Number(config.proTierScore),
      premiumTierScore: Number(config.premiumTierScore),
      minExpectedSellerRating: Number(config.minExpectedSellerRating),
      sellerRatingPenaltyScore: Number(config.sellerRatingPenaltyScore),
      maxExpectedResponseMinutes: Number(config.maxExpectedResponseMinutes),
      responseTimePenaltyScore: Number(config.responseTimePenaltyScore),
      newListingFallbackThresholdDays: Number(config.newListingFallbackThresholdDays),
      fallbackBaselineSellerRating: Number(config.fallbackBaselineSellerRating),
      fallbackBaselineResponseMinutes: Number(config.fallbackBaselineResponseMinutes),
    };
  };

  const fetchRankingConfig = async () => {
    try {
      setLoading(true);
      const response = await getGlobalRankingConfig();
      const config = response?.data || response;

      if (config) {
        // Store original config for change detection
        setOriginalConfig(config);

        // Map API data to state
        setLayerWeights({
          preferenceScoreWeight: config.preferenceScoreWeight || 50,
          qualityScoreWeight: config.qualityScoreWeight || 40,
          tierScoreWeight: config.tierScoreWeight || 10,
        });

        setPreferenceFields([
          { key: "vehicleTypeScore", label: "Vehicle Type", value: config.vehicleTypeScore || 0 },
          { key: "vehicleSubTypeScore", label: "Vehicle Sub Type", value: config.vehicleSubTypeScore || 0 },
          { key: "makerScore", label: "Maker (Brand)", value: config.makerScore || 0 },
          { key: "modelScore", label: "Model", value: config.modelScore || 0 },
          { key: "fuelTypeScore", label: "Fuel Type", value: config.fuelTypeScore || 0 },
          { key: "transmissionTypeScore", label: "Transmission Type", value: config.transmissionTypeScore || 0 },
          { key: "cityScore", label: "City Match", value: config.cityScore || 0 },
          { key: "stateScore", label: "State Match", value: config.stateScore || 0 },
          { key: "budgetScore", label: "Budget Match", value: config.budgetScore || 0 },
        ]);

        setQualityConfig({
          inspectionRules: [
            { key: "notInspectedScore", label: "Not Inspected", value: config.notInspectedScore || 0 },
            { key: "inspectionRequestedScore", label: "Inspection Requested", value: config.inspectionRequestedScore || 0 },
            { key: "avxInspectedScore", label: "AVX Inspected", value: config.avxInspectedScore || 0 },
            { key: "avxInspectedGoodRatingScore", label: "AVX Inspected (7+ Rating)", value: config.avxInspectedGoodRatingScore || 0 },
          ],
          responseRules: [
            { key: "responseUnder30MinScore", label: "< 30 minutes", value: config.responseUnder30MinScore || 0 },
            { key: "responseUnder2HourScore", label: "< 2 hours", value: config.responseUnder2HourScore || 0 },
            { key: "responseUnder6HourScore", label: "< 6 hours", value: config.responseUnder6HourScore || 0 },
            { key: "responseUnder12HourScore", label: "< 12 hours", value: config.responseUnder12HourScore || 0 },
          ],
          sellerRatingScore: config.sellerRatingScore || 0,
          freshnessRules: [
            { key: "listingUnder3DayScore", label: "< 3 days", value: config.listingUnder3DayScore || 0 },
            { key: "listingUnder7DayScore", label: "< 7 days", value: config.listingUnder7DayScore || 0 },
            { key: "listingUnder15DayScore", label: "< 15 days", value: config.listingUnder15DayScore || 0 },
            { key: "listingUnder30DayScore", label: "< 30 days", value: config.listingUnder30DayScore || 0 },
          ],
        });

        setTierScores({
          userSellerScore: config.userSellerScore || 0,
          basicTierScore: config.basicTierScore || 0,
          proTierScore: config.proTierScore || 0,
          premiumTierScore: config.premiumTierScore || 0,
        });

        setPenaltyConfig({
          minExpectedSellerRating: config.minExpectedSellerRating || 0,
          sellerRatingPenaltyScore: config.sellerRatingPenaltyScore || 0,
          maxExpectedResponseMinutes: config.maxExpectedResponseMinutes || 7200,
          responseTimePenaltyScore: config.responseTimePenaltyScore || 0,
        });

        setFallbacks({
          newListingFallbackThresholdDays: config.newListingFallbackThresholdDays || 7,
          fallbackBaselineSellerRating: config.fallbackBaselineSellerRating || 0,
          fallbackBaselineResponseMinutes: config.fallbackBaselineResponseMinutes || 60,
        });

        setConfigLoaded(true);
        setHasChanges(false); // Reset changes flag after loading
        toast.success("Ranking configuration loaded successfully");
      }
    } catch (error) {
      console.error("Failed to fetch ranking config:", error);
      toast.error(error?.response?.data?.message || "Failed to load ranking configuration");
    } finally {
      setLoading(false);
    }
  };

  const selectedConsultant = useMemo(
    () => CONSULTANTS.find((item) => item.id === simulationConsultantId) || CONSULTANTS[0],
    [simulationConsultantId]
  );

  const simulatedBreakdown = useMemo(() => {
    const preferenceShare = layerWeights.preferenceScoreWeight / 50;
    const qualityShare = layerWeights.qualityScoreWeight / 40;
    const tierShare = layerWeights.tierScoreWeight / 10;

    const newPreference = Number((selectedConsultant.relevanceScore * preferenceShare).toFixed(1));
    const newQuality = Number((selectedConsultant.qualityScore * qualityShare).toFixed(1));
    const newTier = Number((selectedConsultant.tierScore * tierShare).toFixed(1));
    const penaltyImpact = selectedConsultant.penalty;

    const finalScore = Number((newPreference + newQuality + newTier + penaltyImpact).toFixed(1));

    return {
      currentScore: selectedConsultant.score,
      currentPosition: selectedConsultant.position,
      preferenceImpact: newPreference,
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

  const adjustPreferenceField = (key, delta) => {
    setPreferenceFields((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, value: Math.max(0, item.value + delta) } : item
      )
    );
  };

  const applyEngineChanges = async () => {
    try {
      setUpdateLoading(true);

      const payload = buildConfigPayload();
      const response = await updateGlobalRankingConfig(payload);

      toast.success("Ranking configuration updated successfully");

      // Refresh the config to get the latest data
      await fetchRankingConfig();

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
    } catch (error) {
      console.error("Failed to update ranking config:", error);
      toast.error(error?.response?.data?.message || "Failed to update ranking configuration");
    } finally {
      setUpdateLoading(false);
    }
  };

  const clearChanges = () => {
    if (!originalConfig) return;

    // Reset all states to original config values
    setLayerWeights({
      preferenceScoreWeight: originalConfig?.preferenceScoreWeight || 0,
      qualityScoreWeight: originalConfig?.qualityScoreWeight || 0,
      tierScoreWeight: originalConfig?.tierScoreWeight || 0,
    });

    setPreferenceFields([
      { key: "vehicleTypeScore", label: "Vehicle Type", value: originalConfig?.vehicleTypeScore || 0 },
      { key: "vehicleSubTypeScore", label: "Vehicle Sub Type", value: originalConfig?.vehicleSubTypeScore || 0 },
      { key: "makerScore", label: "Maker (Brand)", value: originalConfig?.makerScore || 0 },
      { key: "modelScore", label: "Model", value: originalConfig?.modelScore || 0 },
      { key: "fuelTypeScore", label: "Fuel Type", value: originalConfig?.fuelTypeScore || 0 },
      { key: "transmissionTypeScore", label: "Transmission Type", value: originalConfig?.transmissionTypeScore || 0 },
      { key: "cityScore", label: "City Match", value: originalConfig?.cityScore || 0 },
      { key: "stateScore", label: "State Match", value: originalConfig?.stateScore || 0 },
      { key: "budgetScore", label: "Budget Match", value: originalConfig?.budgetScore || 0 },
    ]);

    setQualityConfig({
      inspectionRules: [
        { key: "notInspectedScore", label: "Not Inspected", value: originalConfig?.notInspectedScore || 0 },
        { key: "inspectionRequestedScore", label: "Inspection Requested", value: originalConfig?.inspectionRequestedScore || 0 },
        { key: "avxInspectedScore", label: "AVX Inspected", value: originalConfig?.avxInspectedScore || 0 },
        { key: "avxInspectedGoodRatingScore", label: "AVX Inspected (7+ Rating)", value: originalConfig?.avxInspectedGoodRatingScore || 0 },
      ],
      responseRules: [
        { key: "responseUnder30MinScore", label: "< 30 minutes", value: originalConfig?.responseUnder30MinScore || 0 },
        { key: "responseUnder2HourScore", label: "< 2 hours", value: originalConfig?.responseUnder2HourScore || 0 },
        { key: "responseUnder6HourScore", label: "< 6 hours", value: originalConfig?.responseUnder6HourScore || 0 },
        { key: "responseUnder12HourScore", label: "< 12 hours", value: originalConfig?.responseUnder12HourScore || 0 },
      ],
      sellerRatingScore: originalConfig.sellerRatingScore || 0,
      freshnessRules: [
        { key: "listingUnder3DayScore", label: "< 3 days", value: originalConfig?.listingUnder3DayScore || 0 },
        { key: "listingUnder7DayScore", label: "< 7 days", value: originalConfig?.listingUnder7DayScore || 0 },
        { key: "listingUnder15DayScore", label: "< 15 days", value: originalConfig?.listingUnder15DayScore || 0 },
        { key: "listingUnder30DayScore", label: "< 30 days", value: originalConfig?.listingUnder30DayScore || 0 },
      ],
    });

    setTierScores({
      userSellerScore: originalConfig?.userSellerScore || 0,
      basicTierScore: originalConfig?.basicTierScore || 0,
      proTierScore: originalConfig?.proTierScore || 0,
      premiumTierScore: originalConfig?.premiumTierScore || 0,
    });

    setPenaltyConfig({
      minExpectedSellerRating: originalConfig?.minExpectedSellerRating,
      sellerRatingPenaltyScore: originalConfig?.sellerRatingPenaltyScore,
      maxExpectedResponseMinutes: originalConfig?.maxExpectedResponseMinutes,
      responseTimePenaltyScore: originalConfig?.responseTimePenaltyScore,
    });

    setFallbacks({
      newListingFallbackThresholdDays: originalConfig?.newListingFallbackThresholdDays,
      fallbackBaselineSellerRating: originalConfig?.fallbackBaselineSellerRating,
      fallbackBaselineResponseMinutes: originalConfig?.fallbackBaselineResponseMinutes,
    });

    toast.success("Changes cleared. Configuration reset to saved values.");
  };

  const fetchConsultantOverrides = async () => {
    try {
      setOverridesLoading(true);
      const response = await getConsultantOverrides();
      const data = response?.data || response;

      if (Array.isArray(data)) {
        // Map API data to table format
        const mappedOverrides = data.map((item) => ({
          id: item.userId || item.consultationId,
          consultantId: item.consultationId,
          consultant: item.consultationName || "—",
          currentScore: item.manualBoostScore || 0,
          override: item.manualBoostScore ? `+${item.manualBoostScore}` : "—",
          type: item.manualBoostScoreType || "Score Boost",
          reason: item.manualBoostScoreReason || "—",
          expiry: "—", // Not provided in API
          status: item.manualBoostScore > 0 ? "Active" : "Inactive",
          tierPlan: item.tierPlan || "—",
        }));

        setOverrides(mappedOverrides);
      }
    } catch (error) {
      console.error("Failed to fetch consultant overrides:", error);
      toast.error(error?.response?.data?.message || "Failed to load consultant overrides");
    } finally {
      setOverridesLoading(false);
    }
  };

  const fetchConsultantPenalties = async () => {
    try {
      setPenaltiesLoading(true);
      const response = await getConsultantPenalties();
      const data = response?.data || response;

      if (Array.isArray(data)) {
        // Map API data to table format
        const mappedPenalties = data.map((item) => ({
          id: item.userId || item.consultationId,
          consultantId: item.consultationId,
          consultant: item.consultationName || "—",
          username: item.username || "—",
          penalty: item.manualDeductionScoreType || "Ranking Reduction",
          value: item.manualDeductionScore ? `-${item.manualDeductionScore}` : "—",
          reason: item.manualDeductionScoreReason || "—",
          expiry: "—", // Not provided in API
          status: item.manualDeductionScore > 0 ? "Active" : "Inactive",
          tierPlan: item.tierPlan || "—",
        }));

        setPenalties(mappedPenalties);
      }
    } catch (error) {
      console.error("Failed to fetch consultant penalties:", error);
      toast.error(error?.response?.data?.message || "Failed to load consultant penalties");
    } finally {
      setPenaltiesLoading(false);
    }
  };

  const fetchConsultantNames = async () => {
    try {
      setConsultantsLoading(true);
      const response = await getAllConsultantNames();
      const data = response?.data || response;

      if (Array.isArray(data)) {
        setConsultantsList(data);
      }
    } catch (error) {
      console.error("Failed to fetch consultant names:", error);
      toast.error(error?.response?.data?.message || "Failed to load consultant names");
    } finally {
      setConsultantsLoading(false);
    }
  };

  const openOverrideModal = () => {
    setOverrideModal(true);
    fetchConsultantNames();
  };

  const closeOverrideModal = () => {
    setOverrideModal(false);
    setConsultantSearch("");
    setDropdownOpen(false);
    setSelectedDropdownIndex(-1);
    setOverrideForm({
      consultationId: "",
      userId: "",
      type: "Score Boost",
      value: "",
      reason: "",
      expiry: "",
    });
  };

  const openPenaltyModal = () => {
    setPenaltyModal(true);
    fetchConsultantNames();
  };

  const closePenaltyModal = () => {
    setPenaltyModal(false);
    setPenaltyConsultantSearch("");
    setPenaltyDropdownOpen(false);
    setPenaltySelectedDropdownIndex(-1);
    setPenaltyForm({
      consultationId: "",
      userId: "",
      type: "Ranking Score Reduction",
      value: "",
      reason: "",
      expiry: "",
    });
  };

  const handleAddOverride = async () => {
    if (!overrideForm.consultationId || !overrideForm.userId || !overrideForm.value || !overrideForm.reason) {
      toast.error("Please fill all required fields");
      return;
    }

    const consultant = consultantsList.find((c) => c.consultationId === overrideForm.consultationId);
    if (!consultant) {
      toast.error("Please select a valid consultant");
      return;
    }

    try {
      setAddOverrideLoading(true);

      await applyOverride({
        userId: overrideForm.userId,
        manualBoostScore: overrideForm.value,
        manualBoostScoreReason: overrideForm.reason,
        manualBoostScoreType: overrideForm.type,
      });

      toast.success("Override applied successfully");

      // Refresh overrides list
      await fetchConsultantOverrides();

      // Add to audit log
      setLogs((prev) => [
        {
          id: `LOG-${String(prev.length + 1).padStart(3, "0")}`,
          adminId: "ADM-01",
          consultantId: consultant.consultationId,
          actionType: "Override Applied",
          oldScore: "—",
          newScore: "—",
          reason: overrideForm.reason,
          timestamp: new Date().toLocaleString(),
          expiry: overrideForm.expiry,
        },
        ...prev,
      ]);

      // Reset form and close modal
      closeOverrideModal();
    } catch (error) {
      console.error("Error applying override:", error);
      toast.error(error?.response?.data?.message || "Failed to apply override");
    } finally {
      setAddOverrideLoading(false);
    }
  };

  const handleAddPenalty = async () => {
    if (!penaltyForm.consultationId || !penaltyForm.userId || !penaltyForm.value || !penaltyForm.reason) {
      toast.error("Please fill all required fields");
      return;
    }

    const consultant = consultantsList.find((c) => c.consultationId === penaltyForm.consultationId);
    if (!consultant) {
      toast.error("Please select a valid consultant");
      return;
    }

    try {
      setAddPenaltyLoading(true);

      await applyPenalties({
        userId: penaltyForm.userId,
        manualDeductionScore: penaltyForm.value,
        manualDeductionScoreReason: penaltyForm.reason,
        manualDeductionScoreType: penaltyForm.type,
      });

      toast.success("Penalty applied successfully");

      // Refresh penalties list
      await fetchConsultantPenalties();

      // Add to audit log
      setLogs((prev) => [
        {
          id: `LOG-${String(prev.length + 1).padStart(3, "0")}`,
          adminId: "ADM-01",
          consultantId: consultant.consultationId,
          actionType: "Penalty Applied",
          oldScore: "—",
          newScore: "—",
          reason: penaltyForm.reason,
          timestamp: new Date().toLocaleString(),
          expiry: penaltyForm.expiry,
        },
        ...prev,
      ]);

      // Reset form and close modal
      closePenaltyModal();
    } catch (error) {
      console.error("Error applying penalty:", error);
      toast.error(error?.response?.data?.message || "Failed to apply penalty");
    } finally {
      setAddPenaltyLoading(false);
    }
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
    <div className="min-h-screen p-6">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "14px",
            border: "1px solid #e2e8f0",
            background: "#fff",
            color: "#0f172a",
            boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
            fontSize: "13px",
            fontWeight: 600,
          },
        }}
      />

      <div className="mx-auto space-y-6">
        <section className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
              Ranking Control
            </h1>
          </div>
        </section>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="inline-flex items-center gap-3 text-sm font-semibold text-slate-800">
              <Loader2 className="h-5 w-5 animate-spin text-sky-600" />
              Loading ranking configuration...
            </div>
          </div>
        ) : (
          <>
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
                      title="Final Calculation Weights"
                      subtitle="Three-layer ranking architecture. Total must remain 100%. Formula: finalScore = (preferenceScore × weight/100) + (qualityScore × weight/100) + (tierScore × weight/100)"
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
                          { key: "preferenceScoreWeight", label: "Preference Score Weight" },
                          { key: "qualityScoreWeight", label: "Quality Score Weight" },
                          { key: "tierScoreWeight", label: "Tier Score Weight" },
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
                        {/* <button className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-700">
                          <FlaskConical size={16} />
                          Simulate Impact
                        </button> */}
                        <button
                          onClick={applyEngineChanges}
                          disabled={!hasChanges || updateLoading}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {updateLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Applying Changes...
                            </>
                          ) : (
                            <>
                              <FileText size={16} />
                              Apply Changes
                            </>
                          )}
                        </button>
                        {hasChanges && !updateLoading && (
                          <button
                            onClick={clearChanges}
                            className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 transition-colors hover:bg-amber-100 hover:border-amber-300"
                          >
                            <X size={14} />
                            Clear Changes
                          </button>
                        )}
                      </div>
                    </SectionCard>

                    <SectionCard
                      title="Preference Score Configuration"
                      subtitle={`Total Raw Score = ${preferenceRawTotal}. System normalizes this to ${layerWeights.preferenceScoreWeight}% preference contribution.`}
                    >
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {preferenceFields.map((field) => (
                          <div
                            key={field.key}
                            className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                          >
                            <div className="text-sm font-medium text-slate-700">{field.label}</div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => adjustPreferenceField(field.key, 1)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
                              >
                                <ChevronUp size={14} />
                              </button>
                              <div className="min-w-[40px] text-center text-sm font-bold text-slate-900">
                                {field.value}
                              </div>
                              <button
                                onClick={() => adjustPreferenceField(field.key, -1)}
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
                      subtitle="Configure inspection, response time, seller rating, and listing freshness scores."
                    >
                      <div className="space-y-6">
                        <RuleEditor
                          title={`AVX Inspection Score Rules (Total: ${qualityInspectionTotal})`}
                          rows={qualityConfig.inspectionRules}
                          setRows={(rows) => setQualityConfig((prev) => ({ ...prev, inspectionRules: rows }))}
                        />

                        <RuleEditor
                          title={`Response Time Score Rules (Total: ${qualityResponseTotal})`}
                          rows={qualityConfig.responseRules}
                          setRows={(rows) => setQualityConfig((prev) => ({ ...prev, responseRules: rows }))}
                        />

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="text-sm font-bold text-slate-900 mb-3">Seller Rating Score</div>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={qualityConfig.sellerRatingScore}
                            onChange={(e) =>
                              setQualityConfig((prev) => ({
                                ...prev,
                                sellerRatingScore: Number(e.target.value),
                              }))
                            }
                            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none focus:border-sky-400"
                          />
                        </div>

                        <RuleEditor
                          title={`Listing Freshness Score Rules (Total: ${qualityFreshnessTotal})`}
                          rows={qualityConfig.freshnessRules}
                          setRows={(rows) => setQualityConfig((prev) => ({ ...prev, freshnessRules: rows }))}
                        />
                      </div>
                    </SectionCard>

                    <SectionCard
                      title="Tier Score Configuration"
                      subtitle={`Configure tier-based ranking scores. Total: ${tierTotal}`}
                    >
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {[
                          { key: "userSellerScore", label: "User Seller Score" },
                          { key: "basicTierScore", label: "Basic Tier Score" },
                          { key: "proTierScore", label: "Pro Tier Score" },
                          { key: "premiumTierScore", label: "Premium Tier Score" },
                        ].map((item) => (
                          <div key={item.key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="text-sm font-bold text-slate-900">{item.label}</div>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={tierScores[item.key]}
                              onChange={(e) =>
                                setTierScores((prev) => ({
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
                      title="Penalty Configuration"
                      subtitle="Configure automatic penalties for low ratings and slow response times. Admin provides positive values; system converts to negative."
                    >
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
                          <div className="text-sm font-bold text-rose-900 mb-3">Seller Rating Penalty</div>
                          <div className="space-y-3">
                            <div>
                              <label className="text-xs font-semibold text-rose-700 mb-1 block">
                                Min Expected Seller Rating
                              </label>
                              <input
                                type="number"
                                min="0"
                                max="5"
                                step="0.1"
                                value={penaltyConfig.minExpectedSellerRating}
                                onChange={(e) =>
                                  setPenaltyConfig((prev) => ({
                                    ...prev,
                                    minExpectedSellerRating: Number(e.target.value),
                                  }))
                                }
                                className="h-11 w-full rounded-xl border border-rose-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none focus:border-rose-400"
                              />
                              <p className="mt-1 text-xs text-rose-600">If rating is below this, penalty applies</p>
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-rose-700 mb-1 block">
                                Penalty Score (Positive Value)
                              </label>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={penaltyConfig.sellerRatingPenaltyScore}
                                onChange={(e) =>
                                  setPenaltyConfig((prev) => ({
                                    ...prev,
                                    sellerRatingPenaltyScore: Number(e.target.value),
                                  }))
                                }
                                className="h-11 w-full rounded-xl border border-rose-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none focus:border-rose-400"
                              />
                              <p className="mt-1 text-xs text-rose-600">Will be subtracted from final score</p>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
                          <div className="text-sm font-bold text-rose-900 mb-3">Response Time Penalty</div>
                          <div className="space-y-3">
                            <div>
                              <label className="text-xs font-semibold text-rose-700 mb-1 block">
                                Max Expected Response (Minutes)
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={penaltyConfig.maxExpectedResponseMinutes}
                                onChange={(e) =>
                                  setPenaltyConfig((prev) => ({
                                    ...prev,
                                    maxExpectedResponseMinutes: Number(e.target.value),
                                  }))
                                }
                                className="h-11 w-full rounded-xl border border-rose-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none focus:border-rose-400"
                              />
                              <p className="mt-1 text-xs text-rose-600">If response time exceeds this, penalty applies</p>
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-rose-700 mb-1 block">
                                Penalty Score (Positive Value)
                              </label>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={penaltyConfig.responseTimePenaltyScore}
                                onChange={(e) =>
                                  setPenaltyConfig((prev) => ({
                                    ...prev,
                                    responseTimePenaltyScore: Number(e.target.value),
                                  }))
                                }
                                className="h-11 w-full rounded-xl border border-rose-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none focus:border-rose-400"
                              />
                              <p className="mt-1 text-xs text-rose-600">Will be subtracted from final score</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SectionCard>

                    <SectionCard
                      title="Fallback Configuration"
                      subtitle="Baseline values for new listings to prevent ranking issues in early marketplace scenarios."
                    >
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="text-sm font-bold text-slate-900">New Listing Threshold (Days)</div>
                          <input
                            type="number"
                            min="0"
                            value={fallbacks.newListingFallbackThresholdDays}
                            onChange={(e) =>
                              setFallbacks((prev) => ({
                                ...prev,
                                newListingFallbackThresholdDays: Number(e.target.value),
                              }))
                            }
                            className="mt-3 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none"
                          />
                          <p className="mt-2 text-xs text-slate-500">If listing age ≤ this, use fallback values</p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="text-sm font-bold text-slate-900">Fallback Baseline Seller Rating</div>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="5"
                            value={fallbacks.fallbackBaselineSellerRating}
                            onChange={(e) =>
                              setFallbacks((prev) => ({
                                ...prev,
                                fallbackBaselineSellerRating: Number(e.target.value),
                              }))
                            }
                            className="mt-3 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none"
                          />
                          <p className="mt-2 text-xs text-slate-500">Default rating for new listings</p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="text-sm font-bold text-slate-900">Fallback Response Time (Minutes)</div>
                          <input
                            type="number"
                            min="0"
                            value={fallbacks.fallbackBaselineResponseMinutes}
                            onChange={(e) =>
                              setFallbacks((prev) => ({
                                ...prev,
                                fallbackBaselineResponseMinutes: Number(e.target.value),
                              }))
                            }
                            className="mt-3 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none"
                          />
                          <p className="mt-2 text-xs text-slate-500">Default response time for new listings</p>
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
                        onClick={openOverrideModal}
                        className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
                      >
                        <Plus size={16} />
                        Add Override
                      </button>
                    }
                  >
                    {overridesLoading ? (
                      <div className="py-12 text-center">
                        <div className="inline-flex items-center gap-3 text-sm font-semibold text-slate-800">
                          <Loader2 className="h-5 w-5 animate-spin text-sky-600" />
                          Loading consultant overrides...
                        </div>
                      </div>
                    ) : overrides.length === 0 ? (
                      <div className="py-12 text-center">
                        <div className="text-sm font-semibold text-slate-500">No consultant overrides found</div>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-[1100px] w-full border-collapse">
                          <thead className="bg-slate-50 border-b border-slate-200">
                            <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                              <th className="px-5 py-4">Consultant</th>
                              <th className="px-5 py-4">Current Score</th>
                              <th className="px-5 py-4">Override Type</th>
                              <th className="px-5 py-4">Reason</th>
                              <th className="px-5 py-4">Expiry</th>
                              {/* <th className="px-5 py-4">Status</th> */}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {overrides.map((row) => (
                              <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-5 py-4">
                                  <div className="text-sm font-bold text-slate-900">{row.consultant}</div>
                                  <div className="mt-1 flex items-center gap-2">
                                    <span
                                      className={cls(
                                        "inline-flex rounded-md border px-2.5 py-1 text-[11px] font-bold",
                                        tierBadge(row.tierPlan)
                                      )}
                                    >
                                      {row.tierPlan}
                                    </span>
                                    {/* <span className="text-xs text-slate-500">{row.username}</span> */}
                                  </div>
                                </td>
                                <td className="px-5 py-4">
                                  <div className="text-sm font-semibold text-slate-900">{row.currentScore}</div>
                                </td>
                                <td className="px-5 py-4">
                                  <div className="text-sm font-semibold text-slate-900">{row.type}</div>
                                </td>
                                <td className="px-5 py-4 text-sm text-slate-600">{row.reason}</td>
                                <td className="px-5 py-4 text-sm text-slate-600">{row.expiry}</td>
                                {/* <td className="px-5 py-4">
                                  <span
                                    className={cls(
                                      "inline-flex rounded-md border px-2.5 py-1 text-[11px] font-bold",
                                      statusBadge(row.status)
                                    )}
                                  >
                                    {row.status}
                                  </span>
                                </td> */}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </SectionCard>
                )}

                {activeTab === "penalties" && (
                  <SectionCard
                    title="Penalties"
                    subtitle="Apply ranking penalties when consultants violate policy, spam listings, or damage trust."
                    right={
                      <button
                        onClick={openPenaltyModal}
                        className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
                      >
                        <Plus size={16} />
                        Apply Penalty
                      </button>
                    }
                  >
                    {penaltiesLoading ? (
                      <div className="py-12 text-center">
                        <div className="inline-flex items-center gap-3 text-sm font-semibold text-slate-800">
                          <Loader2 className="h-5 w-5 animate-spin text-rose-600" />
                          Loading consultant penalties...
                        </div>
                      </div>
                    ) : penalties.length === 0 ? (
                      <div className="py-12 text-center">
                        <div className="text-sm font-semibold text-slate-500">No consultant penalties found</div>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-[1100px] w-full border-collapse">
                          <thead className="bg-slate-50 border-b border-slate-200">
                            <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                              <th className="px-5 py-4">Consultant</th>
                              <th className="px-5 py-4">Penalty Type</th>
                              <th className="px-5 py-4">Value</th>
                              <th className="px-5 py-4">Reason</th>
                              <th className="px-5 py-4">Expiry</th>
                              {/* <th className="px-5 py-4">Status</th> */}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {penalties.map((row) => (
                              <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-5 py-4">
                                  <div className="text-sm font-bold text-slate-900">{row.consultant}</div>
                                  <div className="mt-1 flex items-center gap-2">
                                    <span
                                      className={cls(
                                        "inline-flex rounded-md border px-2.5 py-1 text-[11px] font-bold",
                                        tierBadge(row.tierPlan)
                                      )}
                                    >
                                      {row.tierPlan}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-5 py-4">
                                  <div className="text-sm font-semibold text-slate-900">{row.penalty}</div>
                                </td>
                                <td className="px-5 py-4">
                                  <span className="inline-flex rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700">
                                    {row.value}
                                  </span>
                                </td>
                                <td className="px-5 py-4 text-sm text-slate-600">{row.reason}</td>
                                <td className="px-5 py-4 text-sm text-slate-600">{row.expiry}</td>
                                {/* <td className="px-5 py-4">
                                  <span
                                    className={cls(
                                      "inline-flex rounded-md border px-2.5 py-1 text-[11px] font-bold",
                                      statusBadge(row.status)
                                    )}
                                  >
                                    {row.status}
                                  </span>
                                </td> */}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
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
                              Preference Score
                            </div>
                            <div className="mt-2 text-2xl font-extrabold text-slate-900">
                              {simulatedBreakdown.preferenceImpact} / {layerWeights.preferenceScoreWeight}
                            </div>
                          </div>

                          <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <div className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                              Quality Score
                            </div>
                            <div className="mt-2 text-2xl font-extrabold text-slate-900">
                              {simulatedBreakdown.qualityImpact} / {layerWeights.qualityScoreWeight}
                            </div>
                          </div>

                          <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <div className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                              Tier Score
                            </div>
                            <div className="mt-2 text-2xl font-extrabold text-slate-900">
                              {simulatedBreakdown.tierImpact} / {layerWeights.tierScoreWeight}
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

            {/* <SectionCard
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
            </SectionCard> */}

            {/* Override Modal */}
            <Modal
              open={overrideModal}
              onClose={closeOverrideModal}
              title="Add Override"
              subtitle="Apply manual ranking adjustment for campaigns, onboarding, homepage eligibility, or position lock."
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Consultant">
                  {consultantsLoading ? (
                    <div className="flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                      <Loader2 className="h-4 w-4 animate-spin text-sky-600" />
                      <span className="ml-2 text-sm text-slate-600">Loading...</span>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="text"
                        value={consultantSearch}
                        onChange={(e) => {
                          setConsultantSearch(e.target.value);
                          setDropdownOpen(true);
                          setSelectedDropdownIndex(-1);
                        }}
                        onFocus={() => {
                          if (consultantSearch) {
                            setDropdownOpen(true);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (!dropdownOpen || filteredConsultants.length === 0) return;

                          if (e.key === "ArrowDown") {
                            e.preventDefault();
                            setSelectedDropdownIndex((prev) =>
                              prev < filteredConsultants.length - 1 ? prev + 1 : prev
                            );
                          } else if (e.key === "ArrowUp") {
                            e.preventDefault();
                            setSelectedDropdownIndex((prev) => (prev > 0 ? prev - 1 : -1));
                          } else if (e.key === "Enter" && selectedDropdownIndex >= 0) {
                            e.preventDefault();
                            const selected = filteredConsultants[selectedDropdownIndex];
                            setOverrideForm((p) => ({
                              ...p,
                              consultationId: selected.consultationId,
                              userId: selected.userId,
                            }));
                            setConsultantSearch(selected.consultationName);
                            setDropdownOpen(false);
                            setSelectedDropdownIndex(-1);
                          } else if (e.key === "Escape") {
                            setDropdownOpen(false);
                            setSelectedDropdownIndex(-1);
                          }
                        }}
                        placeholder="Search consultant by name..."
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-sky-400"
                      />
                      {dropdownOpen && consultantSearch && filteredConsultants.length > 0 && (
                        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                          {filteredConsultants.map((c, index) => (
                            <button
                              key={c.consultationId}
                              type="button"
                              data-dropdown-index={index}
                              onClick={() => {
                                setOverrideForm((p) => ({
                                  ...p,
                                  consultationId: c.consultationId,
                                  userId: c.userId,
                                }));
                                setConsultantSearch(c.consultationName);
                                setDropdownOpen(false);
                                setSelectedDropdownIndex(-1);
                              }}
                              className={cls(
                                "w-full px-4 py-2.5 text-left text-sm transition-colors",
                                selectedDropdownIndex === index
                                  ? "bg-sky-100"
                                  : "hover:bg-sky-50"
                              )}
                            >
                              <div className="font-semibold text-slate-900">{c.consultationName}</div>
                              <div className="text-xs text-slate-500">@{c.username}</div>
                            </button>
                          ))}
                        </div>
                      )}
                      {dropdownOpen && consultantSearch && filteredConsultants.length === 0 && (
                        <div className="absolute z-10 mt-1 w-full rounded-xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-500 shadow-lg">
                          No consultants found
                        </div>
                      )}
                    </div>
                  )}
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
                    type="number"
                    min="0"
                    step="0.01"
                    value={overrideForm.value}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Only allow positive numbers
                      if (value === "" || parseFloat(value) >= 0) {
                        setOverrideForm((p) => ({ ...p, value: value }));
                      }
                    }}
                    onKeyDown={(e) => {
                      // Prevent minus sign and 'e' (exponential notation)
                      if (e.key === "-" || e.key === "e" || e.key === "E") {
                        e.preventDefault();
                      }
                    }}
                    placeholder="5"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-sky-400"
                  />
                </Field>

                {/* <Field label="Expiry">
                  <input
                    type="date"
                    value={overrideForm.expiry}
                    onChange={(e) => setOverrideForm((p) => ({ ...p, expiry: e.target.value }))}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-sky-400"
                  />
                </Field> */}

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
                  onClick={closeOverrideModal}
                  disabled={addOverrideLoading}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddOverride}
                  disabled={addOverrideLoading}
                  className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addOverrideLoading && <Loader2 size={16} className="animate-spin" />}
                  Apply Override
                </button>
              </div>
            </Modal>

            {/* Penalty Modal */}
            <Modal
              open={penaltyModal}
              onClose={closePenaltyModal}
              title="Apply Penalty"
              subtitle="Apply score reduction, pushdown, homepage removal, or disable boost eligibility."
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Consultant">
                  {consultantsLoading ? (
                    <div className="flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                      <Loader2 className="h-4 w-4 animate-spin text-rose-600" />
                      <span className="ml-2 text-sm text-slate-600">Loading...</span>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="text"
                        value={penaltyConsultantSearch}
                        onChange={(e) => {
                          setPenaltyConsultantSearch(e.target.value);
                          setPenaltyDropdownOpen(true);
                          setPenaltySelectedDropdownIndex(-1);
                        }}
                        onFocus={() => {
                          if (penaltyConsultantSearch) {
                            setPenaltyDropdownOpen(true);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (!penaltyDropdownOpen || filteredPenaltyConsultants.length === 0) return;

                          if (e.key === "ArrowDown") {
                            e.preventDefault();
                            setPenaltySelectedDropdownIndex((prev) =>
                              prev < filteredPenaltyConsultants.length - 1 ? prev + 1 : prev
                            );
                          } else if (e.key === "ArrowUp") {
                            e.preventDefault();
                            setPenaltySelectedDropdownIndex((prev) => (prev > 0 ? prev - 1 : -1));
                          } else if (e.key === "Enter" && penaltySelectedDropdownIndex >= 0) {
                            e.preventDefault();
                            const selected = filteredPenaltyConsultants[penaltySelectedDropdownIndex];
                            setPenaltyForm((p) => ({
                              ...p,
                              consultationId: selected.consultationId,
                              userId: selected.userId,
                            }));
                            setPenaltyConsultantSearch(selected.consultationName);
                            setPenaltyDropdownOpen(false);
                            setPenaltySelectedDropdownIndex(-1);
                          } else if (e.key === "Escape") {
                            setPenaltyDropdownOpen(false);
                            setPenaltySelectedDropdownIndex(-1);
                          }
                        }}
                        placeholder="Search consultant by name..."
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-rose-400"
                      />
                      {penaltyDropdownOpen && penaltyConsultantSearch && filteredPenaltyConsultants.length > 0 && (
                        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                          {filteredPenaltyConsultants.map((c, index) => (
                            <button
                              key={c.consultationId}
                              type="button"
                              data-penalty-dropdown-index={index}
                              onClick={() => {
                                setPenaltyForm((p) => ({
                                  ...p,
                                  consultationId: c.consultationId,
                                  userId: c.userId,
                                }));
                                setPenaltyConsultantSearch(c.consultationName);
                                setPenaltyDropdownOpen(false);
                                setPenaltySelectedDropdownIndex(-1);
                              }}
                              className={cls(
                                "w-full px-4 py-2.5 text-left text-sm transition-colors",
                                penaltySelectedDropdownIndex === index
                                  ? "bg-rose-100"
                                  : "hover:bg-rose-50"
                              )}
                            >
                              <div className="font-semibold text-slate-900">{c.consultationName}</div>
                              <div className="text-xs text-slate-500">@{c.username}</div>
                            </button>
                          ))}
                        </div>
                      )}
                      {penaltyDropdownOpen && penaltyConsultantSearch && filteredPenaltyConsultants.length === 0 && (
                        <div className="absolute z-10 mt-1 w-full rounded-xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-500 shadow-lg">
                          No consultants found
                        </div>
                      )}
                    </div>
                  )}
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
                    type="number"
                    min="0"
                    step="0.01"
                    value={penaltyForm.value}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || parseFloat(val) >= 0) {
                        setPenaltyForm((p) => ({ ...p, value: val }));
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                        e.preventDefault();
                      }
                    }}
                    placeholder="10"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-rose-400"
                  />
                </Field>

                {/* <Field label="Expiry">
                  <input
                    type="date"
                    value={penaltyForm.expiry}
                    onChange={(e) => setPenaltyForm((p) => ({ ...p, expiry: e.target.value }))}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-rose-400"
                  />
                </Field> */}

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
                  onClick={closePenaltyModal}
                  disabled={addPenaltyLoading}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPenalty}
                  disabled={addPenaltyLoading}
                  className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addPenaltyLoading && <Loader2 size={16} className="animate-spin" />}
                  Apply Penalty
                </button>
              </div>
            </Modal>
          </>
        )}
      </div>
    </div >
  );
};

export default RankingControl;