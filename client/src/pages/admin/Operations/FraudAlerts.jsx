import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  RefreshCw,
  MoreHorizontal,
  Eye,
  Snowflake,
  Ban,
  Lock,
  ShieldAlert,
  Siren,
  CheckCircle2,
  X,
  Activity,
  AlertTriangle,
  ShieldCheck,
  Radar,
  Bot,
  CarFront,
  User,
  Users,
  Fingerprint,
  Globe,
  TrendingUp,
  BarChart3,
  Wallet,
  GitBranch,
  FileText,
  Download,
  Clock3,
  BadgeAlert,
  ScanSearch,
} from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

/* =========================================================
   DUMMY DATA
========================================================= */
const DUMMY_ALERTS = [
  {
    id: "FRA-11021",
    type: "Inquiry Fraud",
    entityType: "Buyer",
    entity: "Priya Shah",
    severity: "Critical",
    triggerLogic: "28 inquiries from same IP in 9 mins across 6 accounts",
    detectedAt: "11:22 AM",
    status: "Auto Frozen",
    fraudScore: 91,
    autoActionTaken: true,
    confidence: 92,
    linkedEntities: ["Buyer #6", "Prime Wheels", "IP 192.168.4.21", "Device FP-A221"],
    explanation:
      "Detected 28 inquiries from same IP within 9 minutes across 6 different buyer accounts targeting the same consultant.",
    inquiryHistory: "112 inquiries in 30 days",
    ipHistory: ["192.168.4.21", "192.168.4.22", "182.71.22.191"],
    deviceFingerprint: "FP-A221-XY9",
    suspensionHistory: "1 previous inquiry cap",
    boostCampaigns: "-",
    conversionRate: "4%",
    inquiryRatio: "Abnormal spike",
    rankingTrend: "N/A",
    reportPatternSimilarity: "-",
    disputeRate: "-",
    assignmentFrequency: "-",
    anomalyTitle: "Inquiry Spike",
    anomalySeries: [
      { label: "Baseline", value: "3 / 10m", tone: "good" },
      { label: "Current", value: "28 / 9m", tone: "bad" },
      { label: "Confidence", value: "92%", tone: "bad" },
    ],
  },
  {
    id: "FRA-11022",
    type: "Boost Manipulation",
    entityType: "Consultant",
    entity: "Prime Wheels",
    severity: "High",
    triggerLogic: "CTR spike 2% → 18% in 3 hours with same-IP clicks",
    detectedAt: "10:48 AM",
    status: "Manual Review",
    fraudScore: 79,
    autoActionTaken: true,
    confidence: 89,
    linkedEntities: ["Campaign CMP-22", "IP cluster 45.67.x.x", "4 buyer accounts"],
    explanation:
      "Boost campaign CTR increased from 2% to 18% in 3 hours with repeated clicks from the same IP block and weak click-to-inquiry ratio.",
    inquiryHistory: "-",
    ipHistory: ["45.67.12.9", "45.67.12.10", "45.67.12.14"],
    deviceFingerprint: "Campaign click farm pattern",
    suspensionHistory: "No",
    boostCampaigns: "3 active campaigns",
    conversionRate: "61%",
    inquiryRatio: "Click-to-inquiry abnormal",
    rankingTrend: "Sharp upward anomaly",
    reportPatternSimilarity: "-",
    disputeRate: "2.1%",
    assignmentFrequency: "-",
    anomalyTitle: "CTR Manipulation",
    anomalySeries: [
      { label: "Historical CTR", value: "2%", tone: "good" },
      { label: "Current CTR", value: "18%", tone: "bad" },
      { label: "Inquiry Ratio", value: "Weak", tone: "warn" },
    ],
  },
  {
    id: "FRA-11023",
    type: "Inspection Collusion",
    entityType: "Inspector",
    entity: "Rakesh Solanki",
    severity: "High",
    triggerLogic: "Same inspector assigned to same consultant repeatedly, 100% clean reports",
    detectedAt: "09:55 AM",
    status: "Watchlisted",
    fraudScore: 72,
    autoActionTaken: false,
    confidence: 84,
    linkedEntities: ["Prime Wheels", "7 inspections", "Photo set reuse risk"],
    explanation:
      "Inspector repeatedly assigned to the same consultant with unusually clean reports and potential duplicate media patterns.",
    inquiryHistory: "-",
    ipHistory: ["N/A"],
    deviceFingerprint: "Inspector upload cluster stable",
    suspensionHistory: "No",
    boostCampaigns: "-",
    conversionRate: "-",
    inquiryRatio: "-",
    rankingTrend: "-",
    reportPatternSimilarity: "88% image similarity",
    disputeRate: "18%",
    assignmentFrequency: "7 same-consultant assignments / 14d",
    anomalyTitle: "Inspection Similarity",
    anomalySeries: [
      { label: "Normal Clean Rate", value: "62%", tone: "good" },
      { label: "Observed Clean Rate", value: "100%", tone: "bad" },
      { label: "Photo Similarity", value: "88%", tone: "bad" },
    ],
  },
  {
    id: "FRA-11024",
    type: "Duplicate Listings",
    entityType: "Vehicle",
    entity: "VH-2301",
    severity: "Medium",
    triggerLogic: "Same registration and reused media across multiple listings",
    detectedAt: "08:41 AM",
    status: "Investigating",
    fraudScore: 58,
    autoActionTaken: false,
    confidence: 81,
    linkedEntities: ["VH-2297", "Metro Auto Hub", "Reg GJ01AB1234"],
    explanation:
      "Vehicle registration number and image set matched against another active listing with overlapping details.",
    inquiryHistory: "-",
    ipHistory: ["N/A"],
    deviceFingerprint: "Listing media hash reuse",
    suspensionHistory: "No",
    boostCampaigns: "1 campaign active",
    conversionRate: "12%",
    inquiryRatio: "Normal",
    rankingTrend: "Stable",
    reportPatternSimilarity: "-",
    disputeRate: "-",
    assignmentFrequency: "-",
    anomalyTitle: "Duplicate Vehicle Identity",
    anomalySeries: [
      { label: "Reg Match", value: "100%", tone: "bad" },
      { label: "Image Reuse", value: "84%", tone: "bad" },
      { label: "Listing Overlap", value: "2 active", tone: "warn" },
    ],
  },
  {
    id: "FRA-11025",
    type: "Fake Conversion Pattern",
    entityType: "Consultant",
    entity: "Elite Motors",
    severity: "Critical",
    triggerLogic: "Repeated buyer-conversion loop with same consultant",
    detectedAt: "12:04 PM",
    status: "Auto Suspended",
    fraudScore: 88,
    autoActionTaken: true,
    confidence: 90,
    linkedEntities: ["Faizan Khan", "3 repeat bookings", "Campaign CMP-11"],
    explanation:
      "Same buyer repeatedly converts with same consultant at abnormal frequency with low supporting inquiry behavior.",
    inquiryHistory: "77 inquiries total",
    ipHistory: ["45.123.98.12"],
    deviceFingerprint: "Buyer-consultant loop pattern",
    suspensionHistory: "Soft notice issued",
    boostCampaigns: "2 campaigns frozen",
    conversionRate: "63%",
    inquiryRatio: "Low inquiry / high conversion anomaly",
    rankingTrend: "Fast upward movement",
    reportPatternSimilarity: "-",
    disputeRate: "1.4%",
    assignmentFrequency: "-",
    anomalyTitle: "Conversion Loop",
    anomalySeries: [
      { label: "Normal Conversion", value: "9%", tone: "good" },
      { label: "Observed Conversion", value: "63%", tone: "bad" },
      { label: "Repeat Buyer Link", value: "High", tone: "bad" },
    ],
  },
  {
    id: "FRA-11026",
    type: "Ranking Manipulation",
    entityType: "Campaign",
    entity: "CMP-22",
    severity: "Low",
    triggerLogic: "Ranking jump without matching traffic growth",
    detectedAt: "07:18 AM",
    status: "Logged",
    fraudScore: 34,
    autoActionTaken: false,
    confidence: 70,
    linkedEntities: ["Prime Wheels", "Boost Campaign", "Review Spike"],
    explanation:
      "Campaign ranking increased faster than normal baseline despite muted traffic growth and suspicious review timing.",
    inquiryHistory: "-",
    ipHistory: ["N/A"],
    deviceFingerprint: "Review burst cluster",
    suspensionHistory: "No",
    boostCampaigns: "Primary boost campaign",
    conversionRate: "14%",
    inquiryRatio: "Mild anomaly",
    rankingTrend: "Spike detected",
    reportPatternSimilarity: "-",
    disputeRate: "-",
    assignmentFrequency: "-",
    anomalyTitle: "Ranking Spike",
    anomalySeries: [
      { label: "Traffic Growth", value: "+4%", tone: "good" },
      { label: "Ranking Growth", value: "+29%", tone: "warn" },
      { label: "Review Burst", value: "Suspicious", tone: "warn" },
    ],
  },
];

const TYPE_OPTIONS = [
  "Inquiry Fraud",
  "Boost Manipulation",
  "Fake Conversion Pattern",
  "Inspection Collusion",
  "Ranking Manipulation",
  "Duplicate Listings",
];
const ENTITY_OPTIONS = ["Buyer", "Consultant", "Inspector", "Vehicle", "Campaign"];
const SEVERITY_OPTIONS = ["Critical", "High", "Medium", "Low"];
const STATUS_OPTIONS = [
  "Auto Frozen",
  "Manual Review",
  "Watchlisted",
  "Investigating",
  "Auto Suspended",
  "Logged",
  "Closed",
  "False Positive",
];

/* =========================================================
   BADGES
========================================================= */
const severityBadge = (severity) => {
  const map = {
    Critical: "bg-red-50 text-red-700 border-red-200",
    High: "bg-rose-50 text-rose-700 border-rose-200",
    Medium: "bg-amber-50 text-amber-700 border-amber-200",
    Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return map[severity] || "bg-slate-50 text-slate-700 border-slate-200";
};

const statusBadge = (status) => {
  const map = {
    "Auto Frozen": "bg-rose-50 text-rose-700 border-rose-200",
    "Manual Review": "bg-sky-50 text-sky-700 border-sky-200",
    Watchlisted: "bg-amber-50 text-amber-700 border-amber-200",
    Investigating: "bg-violet-50 text-violet-700 border-violet-200",
    "Auto Suspended": "bg-red-50 text-red-700 border-red-200",
    Logged: "bg-slate-100 text-slate-700 border-slate-200",
    Closed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    "False Positive": "bg-slate-100 text-slate-700 border-slate-200",
  };
  return map[status] || "bg-slate-50 text-slate-700 border-slate-200";
};

const typeBadge = (type) => {
  const map = {
    "Inquiry Fraud": "bg-sky-50 text-sky-700 border-sky-200",
    "Boost Manipulation": "bg-violet-50 text-violet-700 border-violet-200",
    "Fake Conversion Pattern": "bg-rose-50 text-rose-700 border-rose-200",
    "Inspection Collusion": "bg-amber-50 text-amber-700 border-amber-200",
    "Ranking Manipulation": "bg-indigo-50 text-indigo-700 border-indigo-200",
    "Duplicate Listings": "bg-orange-50 text-orange-700 border-orange-200",
  };
  return map[type] || "bg-slate-50 text-slate-700 border-slate-200";
};

const scoreTone = (score) => {
  if (score >= 80) return "bad";
  if (score >= 60) return "warn";
  if (score >= 30) return "warn";
  return "good";
};

/* =========================================================
   SMALL UI
========================================================= */
function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 flex flex-col justify-center">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 truncate">
            {label}
          </div>
          <div className="mt-0.5 text-[15px] font-bold text-slate-900 truncate">{value}</div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 shrink-0">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="pt-0.5">
        <div className="text-[10px] uppercase tracking-wider text-slate-400">{label}</div>
        <div className="text-[13px] font-medium text-slate-700 mt-0.5">{value}</div>
      </div>
    </div>
  );
}

function ActionBtn({ onClick, icon: Icon, label, tone = "slate" }) {
  const tones = {
    slate: "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100",
    sky: "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100",
    rose: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
    amber: "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
    violet: "border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100",
  };

  return (
    <button
      onClick={onClick}
      className={cls(
        "inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-[13px] font-semibold transition",
        tones[tone]
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

/* =========================================================
   ROW ACTIONS
========================================================= */
function RowActions({
  item,
  onInvestigate,
  onFreeze,
  onSuspend,
  onLockRanking,
  onDisableBoost,
  onEscalate,
  onFalsePositive,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative inline-flex justify-end" ref={ref}>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onInvestigate(item)}
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-[12px] font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <Eye className="h-4 w-4" />
          Investigate
        </button>

        <button
          onClick={() => onFreeze(item)}
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 text-[12px] font-semibold text-rose-700 transition hover:bg-rose-100"
        >
          <Snowflake className="h-4 w-4" />
          Freeze
        </button>

        <button
          onClick={() => setOpen((p) => !p)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 shadow-sm"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {open && (
        <div className="absolute right-0 top-11 z-30 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
          <button
            onClick={() => {
              onSuspend(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-rose-700 hover:bg-rose-50"
          >
            <Ban className="h-4 w-4" />
            Suspend
          </button>

          <button
            onClick={() => {
              onLockRanking(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-amber-700 hover:bg-amber-50"
          >
            <Lock className="h-4 w-4" />
            Lock Ranking
          </button>

          <button
            onClick={() => {
              onDisableBoost(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-violet-700 hover:bg-violet-50"
          >
            <Wallet className="h-4 w-4" />
            Disable Boost
          </button>

          <button
            onClick={() => {
              onEscalate(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-sky-700 hover:bg-sky-50"
          >
            <Siren className="h-4 w-4" />
            Escalate to Dispute
          </button>

          <div className="my-1 border-t border-slate-100" />

          <button
            onClick={() => {
              onFalsePositive(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-emerald-700 hover:bg-emerald-50"
          >
            <CheckCircle2 className="h-4 w-4" />
            Mark False Positive
          </button>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   ALERT DETAIL DRAWER
========================================================= */
function AlertDetailDrawer({
  item,
  onClose,
  onFreeze,
  onSuspend,
  onPenalize,
  onEscalate,
  onCloseAlert,
}) {
  if (!item) return null;

  const entitySnapshotByType = {
    Buyer: [
      { icon: Activity, label: "Inquiry History", value: item.inquiryHistory },
      { icon: Globe, label: "IP History", value: item.ipHistory.join(", ") },
      { icon: Fingerprint, label: "Device Fingerprint", value: item.deviceFingerprint },
      { icon: ShieldAlert, label: "Suspension History", value: item.suspensionHistory },
    ],
    Consultant: [
      { icon: Wallet, label: "Boost Campaigns", value: item.boostCampaigns },
      { icon: TrendingUp, label: "Conversion Rate", value: item.conversionRate },
      { icon: Activity, label: "Inquiry Ratio", value: item.inquiryRatio },
      { icon: BarChart3, label: "Ranking Trend", value: item.rankingTrend },
    ],
    Inspector: [
      { icon: ScanSearch, label: "Report Similarity", value: item.reportPatternSimilarity },
      { icon: ShieldAlert, label: "Dispute Rate", value: item.disputeRate },
      { icon: Activity, label: "Assignment Frequency", value: item.assignmentFrequency },
      { icon: Fingerprint, label: "Upload Pattern", value: item.deviceFingerprint },
    ],
    Vehicle: [
      { icon: CarFront, label: "Listing Pattern", value: item.triggerLogic },
      { icon: Fingerprint, label: "Media Hash", value: item.deviceFingerprint },
      { icon: Wallet, label: "Boost Campaigns", value: item.boostCampaigns },
      { icon: BarChart3, label: "Ranking Trend", value: item.rankingTrend },
    ],
    Campaign: [
      { icon: Wallet, label: "Boost Campaigns", value: item.boostCampaigns },
      { icon: TrendingUp, label: "Conversion Rate", value: item.conversionRate },
      { icon: Activity, label: "Inquiry Ratio", value: item.inquiryRatio },
      { icon: BarChart3, label: "Ranking Trend", value: item.rankingTrend },
    ],
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-[560px] border-l border-slate-200 bg-white shadow-2xl flex flex-col">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 shrink-0 bg-slate-50">
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">{item.id}</h3>
            <p className="mt-1 text-sm text-slate-500">
              {item.type} • {item.entityType}: {item.entity}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className={cls("inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold border", severityBadge(item.severity))}>
                {item.severity}
              </span>
              <span className={cls("inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold border", statusBadge(item.status))}>
                {item.status}
              </span>
              <span className={cls("inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold border", typeBadge(item.type))}>
                {item.type}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Fraud Score" value={item.fraudScore} icon={BadgeAlert} />
            <StatCard label="Confidence" value={`${item.confidence}%`} icon={Radar} />
            <StatCard label="Auto Action" value={item.autoActionTaken ? "Yes" : "No"} icon={ShieldCheck} />
            <StatCard label="Entity Type" value={item.entityType} icon={Users} />
          </div>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <ActionBtn onClick={() => onFreeze(item)} icon={Snowflake} tone="rose" label="Freeze" />
            <ActionBtn onClick={() => onSuspend(item)} icon={Ban} tone="rose" label="Suspend" />
            <ActionBtn onClick={() => onPenalize(item)} icon={Lock} tone="amber" label="Penalize" />
            <ActionBtn onClick={() => onEscalate(item)} icon={Siren} tone="sky" label="Escalate" />
            <ActionBtn onClick={() => onCloseAlert(item)} icon={CheckCircle2} tone="emerald" label="Close" />
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-4">
              Trigger Explanation
            </h4>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-[13px] leading-relaxed text-slate-700">
              {item.explanation}
              <div className="mt-3 text-[12px] text-slate-500">
                Confidence: <span className="font-semibold text-slate-700">{item.confidence}%</span>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-4">
              Entity Snapshot
            </h4>
            <div className="space-y-4 text-sm">
              {(entitySnapshotByType[item.entityType] || []).map((entry, idx) => (
                <InfoRow
                  key={idx}
                  icon={entry.icon}
                  label={entry.label}
                  value={entry.value}
                />
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-4">
              Related Entities Map
            </h4>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap gap-2">
                {item.linkedEntities.map((entity, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-700"
                  >
                    <GitBranch className="h-3.5 w-3.5 text-sky-600" />
                    {entity}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-4">
              Anomaly Graph
            </h4>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-[13px] font-semibold text-slate-700 mb-3">{item.anomalyTitle}</div>
              <div className="space-y-3">
                {item.anomalySeries.map((row, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
                  >
                    <span className="text-[13px] font-medium text-slate-700">{row.label}</span>
                    <span
                      className={cls(
                        "rounded-lg px-2.5 py-1 text-[12px] font-bold",
                        row.tone === "good" && "bg-emerald-50 text-emerald-700",
                        row.tone === "warn" && "bg-amber-50 text-amber-700",
                        row.tone === "bad" && "bg-rose-50 text-rose-700"
                      )}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* =========================================================
   MODALS
========================================================= */
function ModalShell({ title, subtitle, children, onClose }) {
  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[61] w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <p className="mt-1 text-[13px] text-slate-500">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </>
  );
}

function ModalFooter({ onClose, onConfirm, confirmText, confirmClass }) {
  return (
    <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-200">
      <button
        onClick={onClose}
        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        className={cls(
          "rounded-xl px-4 py-2 text-[13px] font-semibold text-white transition",
          confirmClass
        )}
      >
        {confirmText}
      </button>
    </div>
  );
}

function FreezeEntityModal({ modal, onClose, onConfirm }) {
  const [reason, setReason] = useState("");
  useEffect(() => {
    if (modal?.type === "freeze") setReason("");
  }, [modal]);

  if (!modal || modal.type !== "freeze") return null;

  return (
    <ModalShell
      title="Freeze Entity"
      subtitle={`${modal.item.id} • ${modal.item.entity}`}
      onClose={onClose}
    >
      <div className="space-y-4">
        <textarea
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for freeze"
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-[13px]"
        />
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[12px] text-rose-700">
          Freeze will block boost, ranking changes, chat, and inquiry acceptance until review.
        </div>
      </div>

      <ModalFooter
        onClose={onClose}
        onConfirm={() => onConfirm({ ...modal.item, freezeReason: reason })}
        confirmText="Confirm Freeze"
        confirmClass="bg-rose-600 hover:bg-rose-700"
      />
    </ModalShell>
  );
}

function SuspendModal({ modal, onClose, onConfirm }) {
  const [reason, setReason] = useState("Critical fraud risk");
  useEffect(() => {
    if (modal?.type === "suspend") setReason("Critical fraud risk");
  }, [modal]);

  if (!modal || modal.type !== "suspend") return null;

  return (
    <ModalShell
      title="Suspend Entity"
      subtitle={`${modal.item.id} • ${modal.item.entity}`}
      onClose={onClose}
    >
      <select
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-[13px]"
      >
        <option>Critical fraud risk</option>
        <option>Repeated anomaly cluster</option>
        <option>Collusion suspected</option>
        <option>Manual enforcement review</option>
      </select>

      <ModalFooter
        onClose={onClose}
        onConfirm={() => onConfirm({ ...modal.item, suspendReason: reason })}
        confirmText="Suspend"
        confirmClass="bg-slate-900 hover:bg-slate-800"
      />
    </ModalShell>
  );
}

function PenalizeModal({ modal, onClose, onConfirm }) {
  const [action, setAction] = useState("Lock Ranking");
  useEffect(() => {
    if (modal?.type === "penalize") setAction("Lock Ranking");
  }, [modal]);

  if (!modal || modal.type !== "penalize") return null;

  return (
    <ModalShell
      title="Apply Penalty"
      subtitle={`${modal.item.id} • ${modal.item.entity}`}
      onClose={onClose}
    >
      <select
        value={action}
        onChange={(e) => setAction(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-[13px]"
      >
        <option>Lock Ranking</option>
        <option>Disable Boost</option>
        <option>Watchlist Only</option>
        <option>Reduce Eligibility</option>
      </select>

      <ModalFooter
        onClose={onClose}
        onConfirm={() => onConfirm({ ...modal.item, penaltyAction: action })}
        confirmText="Apply Penalty"
        confirmClass="bg-amber-600 hover:bg-amber-700"
      />
    </ModalShell>
  );
}

function EscalateModal({ modal, onClose, onConfirm }) {
  if (!modal || modal.type !== "escalate") return null;

  return (
    <ModalShell
      title="Escalate to Dispute Center"
      subtitle={`${modal.item.id} • ${modal.item.entity}`}
      onClose={onClose}
    >
      <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-[12px] text-sky-700">
        A formal dispute case will be created with linked fraud evidence, entity relationships, and anomaly logs.
      </div>

      <ModalFooter
        onClose={onClose}
        onConfirm={() => onConfirm(modal.item)}
        confirmText="Escalate"
        confirmClass="bg-sky-600 hover:bg-sky-700"
      />
    </ModalShell>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */
const FraudAlerts = () => {
  const [rows, setRows] = useState(DUMMY_ALERTS);
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: "",
    entityType: "",
    severity: "",
    status: "",
  });

  const [selectedAlert, setSelectedAlert] = useState(null);
  const [modal, setModal] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setLastRefresh(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const filteredRows = useMemo(() => {
    let data = [...rows];

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q) ||
          r.entity.toLowerCase().includes(q) ||
          r.entityType.toLowerCase().includes(q) ||
          r.triggerLogic.toLowerCase().includes(q)
      );
    }

    if (filters.type) data = data.filter((r) => r.type === filters.type);
    if (filters.entityType) data = data.filter((r) => r.entityType === filters.entityType);
    if (filters.severity) data = data.filter((r) => r.severity === filters.severity);
    if (filters.status) data = data.filter((r) => r.status === filters.status);

    const severityRank = { Critical: 4, High: 3, Medium: 2, Low: 1 };
    return data.sort((a, b) => severityRank[b.severity] - severityRank[a.severity]);
  }, [rows, search, filters]);

  const stats = useMemo(() => {
    return {
      critical: rows.filter((r) => r.severity === "Critical").length,
      high: rows.filter((r) => r.severity === "High").length,
      medium: rows.filter((r) => r.severity === "Medium").length,
      low: rows.filter((r) => r.severity === "Low").length,
      incidentsToday: rows.length,
      boostAbuse: rows.filter((r) => r.type === "Boost Manipulation").length,
      spamAttempts: rows.filter((r) => r.type === "Inquiry Fraud").length,
      collusionClusters: rows.filter((r) => r.type === "Inspection Collusion").length,
      autoSuspended: rows.filter((r) => r.status === "Auto Suspended").length,
    };
  }, [rows]);

  const enforcementLog = useMemo(() => {
    return [
      {
        entity: "Prime Wheels",
        action: "Disable Boost",
        admin: "System",
        mode: "Auto",
        timestamp: "11:01 AM",
        reversed: "No",
      },
      {
        entity: "Priya Shah",
        action: "Freeze Entity",
        admin: "System",
        mode: "Auto",
        timestamp: "11:23 AM",
        reversed: "No",
      },
      {
        entity: "Rakesh Solanki",
        action: "Watchlist",
        admin: "Ops-12",
        mode: "Manual",
        timestamp: "10:02 AM",
        reversed: "No",
      },
      {
        entity: "CMP-22",
        action: "Lock Ranking",
        admin: "Ops-07",
        mode: "Manual",
        timestamp: "08:10 AM",
        reversed: "Yes",
      },
    ];
  }, []);

  const patternMap = useMemo(() => {
    return [
      { name: "Buyer Cluster", value: "6 linked accounts", tone: "bad" },
      { name: "Consultant Ring", value: "2 consultants linked", tone: "warn" },
      { name: "Inspector Bias", value: "7 repeated assignments", tone: "bad" },
      { name: "Device Farm", value: "3 fingerprints reused", tone: "bad" },
    ];
  }, []);

  const handleRefresh = () => {
    setRows([...DUMMY_ALERTS]);
    setLastRefresh(new Date());
  };

  const handleClear = () => {
    setSearch("");
    setFilters({
      type: "",
      entityType: "",
      severity: "",
      status: "",
    });
    setFiltersOpen(false);
  };

  const handleFreezeConfirm = (item) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === item.id ? { ...r, status: "Auto Frozen", autoActionTaken: true } : r
      )
    );
    if (selectedAlert?.id === item.id) {
      setSelectedAlert((prev) => ({ ...prev, status: "Auto Frozen", autoActionTaken: true }));
    }
    setModal(null);
  };

  const handleSuspendConfirm = (item) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === item.id ? { ...r, status: "Auto Suspended", autoActionTaken: true } : r
      )
    );
    if (selectedAlert?.id === item.id) {
      setSelectedAlert((prev) => ({ ...prev, status: "Auto Suspended", autoActionTaken: true }));
    }
    setModal(null);
  };

  const handlePenalizeConfirm = (item) => {
    const newStatus =
      item.penaltyAction === "Lock Ranking"
        ? "Investigating"
        : item.penaltyAction === "Disable Boost"
        ? "Manual Review"
        : "Watchlisted";

    setRows((prev) => prev.map((r) => (r.id === item.id ? { ...r, status: newStatus } : r)));
    if (selectedAlert?.id === item.id) {
      setSelectedAlert((prev) => ({ ...prev, status: newStatus }));
    }
    setModal(null);
  };

  const handleEscalateConfirm = (item) => {
    setRows((prev) =>
      prev.map((r) => (r.id === item.id ? { ...r, status: "Manual Review" } : r))
    );
    if (selectedAlert?.id === item.id) {
      setSelectedAlert((prev) => ({ ...prev, status: "Manual Review" }));
    }
    setModal(null);
  };

  const handleFalsePositive = (item) => {
    setRows((prev) =>
      prev.map((r) => (r.id === item.id ? { ...r, status: "False Positive" } : r))
    );
    if (selectedAlert?.id === item.id) {
      setSelectedAlert((prev) => ({ ...prev, status: "False Positive" }));
    }
  };

  const handleCloseAlert = (item) => {
    setRows((prev) =>
      prev.map((r) => (r.id === item.id ? { ...r, status: "Closed" } : r))
    );
    if (selectedAlert?.id === item.id) {
      setSelectedAlert((prev) => ({ ...prev, status: "Closed" }));
    }
  };

  return (
    <div className="min-h-screen p-0">
      <style>{`
        .table-scroll::-webkit-scrollbar { height: 6px; }
        .table-scroll::-webkit-scrollbar-track { background: transparent; }
        .table-scroll::-webkit-scrollbar-thumb { background: rgba(148,163,184,0.35); border-radius: 6px; }
        .table-scroll::-webkit-scrollbar-thumb:hover { background: rgba(100,116,139,0.45); }
      `}</style>

      <div className="mx-auto max-w-auto space-y-6">
        <section className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
              Fraud Alerts
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-500">
              Intelligence engine for inquiry fraud, boost abuse, collusion networks,
              ranking manipulation, duplicate listings, and pattern-based fraud clusters.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-medium text-slate-500 shadow-sm">
            <RefreshCw className="h-4 w-4 text-sky-600" />
            Auto-refresh every 30s • Last sync {lastRefresh.toLocaleTimeString()}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-9">
          <TopCard title="Critical" value={stats.critical} icon={AlertTriangle} tone="bad" />
          <TopCard title="High" value={stats.high} icon={ShieldAlert} tone="bad" />
          <TopCard title="Medium" value={stats.medium} icon={BadgeAlert} tone="warn" />
          <TopCard title="Low" value={stats.low} icon={ShieldCheck} tone="good" />
          <TopCard title="Incidents Today" value={stats.incidentsToday} icon={Activity} tone="warn" />
          <TopCard title="Boost Abuse" value={stats.boostAbuse} icon={Wallet} tone="warn" />
          <TopCard title="Spam Attempts" value={stats.spamAttempts} icon={Bot} tone="bad" />
          <TopCard title="Collusion Clusters" value={stats.collusionClusters} icon={GitBranch} tone="bad" />
          <TopCard title="Auto-Suspended" value={stats.autoSuspended} icon={Ban} tone="bad" />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-100 blur-[100px] pointer-events-none" />

          <div className="p-5 md:p-6 relative z-10 border-b border-slate-200">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="relative flex-1 max-w-2xl">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by Alert ID, entity, trigger logic, type..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-[14px] text-slate-900 outline-none transition-all focus:border-sky-400 placeholder:text-slate-400"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setFiltersOpen((p) => !p)}
                  className={cls(
                    "inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-[13px] font-semibold transition-colors",
                    filtersOpen
                      ? "bg-sky-600 text-white border-sky-600"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  )}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </button>

                <button
                  onClick={handleRefresh}
                  className="inline-flex h-11 items-center justify-center w-11 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                  title="Refresh List"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {filtersOpen && (
              <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-200 pt-5 md:grid-cols-2 xl:grid-cols-4">
                <div className="flex items-center justify-between col-span-full mb-2">
                  <h4 className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">
                    Advanced Filters
                  </h4>
                  <button
                    onClick={handleClear}
                    className="text-[12px] text-sky-700 hover:text-sky-800"
                  >
                    Clear All Filters
                  </button>
                </div>

                <select
                  value={filters.type}
                  onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400"
                >
                  <option value="">All Types</option>
                  {TYPE_OPTIONS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <select
                  value={filters.entityType}
                  onChange={(e) => setFilters((p) => ({ ...p, entityType: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400"
                >
                  <option value="">All Entities</option>
                  {ENTITY_OPTIONS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <select
                  value={filters.severity}
                  onChange={(e) => setFilters((p) => ({ ...p, severity: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400"
                >
                  <option value="">All Severity</option>
                  {SEVERITY_OPTIONS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <select
                  value={filters.status}
                  onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400"
                >
                  <option value="">All Status</option>
                  {STATUS_OPTIONS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="w-full overflow-x-auto table-scroll relative z-10 pb-4">
            <table className="min-w-[1520px] w-full border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Alert ID</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Type</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Entity</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Severity</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Trigger Logic</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Detected At</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 text-right font-semibold whitespace-nowrap">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredRows.length ? (
                  filteredRows.map((row) => (
                    <tr
                      key={row.id}
                      className={cls(
                        "transition-colors duration-200 hover:bg-slate-50 group",
                        selectedAlert?.id === row.id && "bg-sky-50"
                      )}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-100 to-orange-100 border border-slate-200 flex items-center justify-center shrink-0">
                            <ShieldAlert className="h-4 w-4 text-rose-700" />
                          </div>
                          <div>
                            <div className="text-[14px] font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                              {row.id}
                            </div>
                            <div className="mt-0.5 text-[12px] text-slate-500">Score {row.fraudScore}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className={cls("inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap", typeBadge(row.type))}>
                          {row.type}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-start gap-2">
                          {row.entityType === "Buyer" && <User className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />}
                          {row.entityType === "Consultant" && <Users className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />}
                          {row.entityType === "Inspector" && <ScanSearch className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />}
                          {row.entityType === "Vehicle" && <CarFront className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />}
                          {row.entityType === "Campaign" && <Wallet className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />}
                          <div>
                            <div className="text-[13px] font-medium text-slate-700">{row.entity}</div>
                            <div className="text-[12px] text-slate-500">{row.entityType}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className={cls("inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap", severityBadge(row.severity))}>
                          {row.severity}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="max-w-[340px] text-[13px] text-slate-600 leading-relaxed">
                          {row.triggerLogic}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-[13px] font-medium text-slate-500 whitespace-nowrap">
                        {row.detectedAt}
                      </td>

                      <td className="px-5 py-4">
                        <span className={cls("inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap", statusBadge(row.status))}>
                          {row.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <RowActions
                          item={row}
                          onInvestigate={setSelectedAlert}
                          onFreeze={(item) => setModal({ type: "freeze", item })}
                          onSuspend={(item) => setModal({ type: "suspend", item })}
                          onLockRanking={(item) => setModal({ type: "penalize", item })}
                          onDisableBoost={(item) => setModal({ type: "penalize", item: { ...item, defaultAction: "Disable Boost" } })}
                          onEscalate={(item) => setModal({ type: "escalate", item })}
                          onFalsePositive={handleFalsePositive}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-28 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-4">
                          <Search size={28} />
                        </div>
                        <div className="text-lg font-bold text-slate-900 tracking-tight">
                          No fraud alerts found
                        </div>
                        <div className="mt-1 text-[14px] text-slate-500 max-w-sm mx-auto">
                          Try adjusting your search criteria or clear active filters to see more results.
                        </div>
                        {(search || Object.values(filters).some(Boolean)) && (
                          <button
                            onClick={handleClear}
                            className="mt-6 px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900"
                          >
                            Clear search & filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <IntelligenceCard title="Pattern Intelligence Map" rows={patternMap} />
          <IntelligenceCard
            title="Fraud Score Bands"
            rows={[
              { label: "0–30", value: "Low", tone: "good" },
              { label: "30–60", value: "Watch", tone: "warn" },
              { label: "60–80", value: "High", tone: "warn" },
              { label: "80+", value: "Critical", tone: "bad" },
            ]}
          />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 px-5 py-4 md:px-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-[16px] font-bold text-slate-900">Enforcement Log</h3>
                <p className="mt-1 text-[13px] text-slate-500">
                  Immutable action history for every fraud control decision.
                </p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>

          <div className="w-full overflow-x-auto table-scroll pb-4">
            <table className="min-w-[1100px] w-full border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Entity</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Action</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Admin</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Auto / Manual</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Timestamp</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Reversed?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enforcementLog.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-[13px] font-medium text-slate-700">{row.entity}</td>
                    <td className="px-5 py-4 text-[13px] text-slate-700">{row.action}</td>
                    <td className="px-5 py-4 text-[13px] text-slate-700">{row.admin}</td>
                    <td className="px-5 py-4">
                      <span
                        className={cls(
                          "inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap",
                          row.mode === "Auto"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-sky-50 text-sky-700 border-sky-200"
                        )}
                      >
                        {row.mode}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[13px] text-slate-500">{row.timestamp}</td>
                    <td className="px-5 py-4 text-[13px] text-slate-700">{row.reversed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <AlertDetailDrawer
        item={selectedAlert}
        onClose={() => setSelectedAlert(null)}
        onFreeze={(item) => setModal({ type: "freeze", item })}
        onSuspend={(item) => setModal({ type: "suspend", item })}
        onPenalize={(item) => setModal({ type: "penalize", item })}
        onEscalate={(item) => setModal({ type: "escalate", item })}
        onCloseAlert={handleCloseAlert}
      />

      <FreezeEntityModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleFreezeConfirm}
      />

      <SuspendModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleSuspendConfirm}
      />

      <PenalizeModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handlePenalizeConfirm}
      />

      <EscalateModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleEscalateConfirm}
      />
    </div>
  );
};

function IntelligenceCard({ title, rows = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-[14px] font-bold text-slate-900">{title}</h3>
      <div className="mt-4 space-y-3">
        {rows.map((row, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
          >
            <span className="text-[13px] font-medium text-slate-700">{row.name || row.label}</span>
            <span
              className={cls(
                "rounded-lg px-2.5 py-1 text-[12px] font-bold",
                row.tone === "good" && "bg-emerald-50 text-emerald-700",
                row.tone === "warn" && "bg-amber-50 text-amber-700",
                row.tone === "bad" && "bg-rose-50 text-rose-700"
              )}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopCard({ title, value, icon: Icon, tone = "good" }) {
  const toneMap = {
    good: "bg-emerald-50 border-emerald-100 text-emerald-600",
    warn: "bg-amber-50 border-amber-100 text-amber-600",
    bad: "bg-rose-50 border-rose-100 text-rose-600",
  };

  const overlayMap = {
    good: "from-emerald-50",
    warn: "from-amber-50",
    bad: "from-rose-50",
  };

  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-6 overflow-hidden group shadow-sm">
      <div
        className={cls(
          "absolute inset-0 bg-gradient-to-br to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          overlayMap[tone]
        )}
      />

      <div className="relative z-10 flex items-end justify-between">
        <div>
          <div className="text-[12px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-2">
            {title}
          </div>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-baseline gap-1">
            {value}
          </div>
        </div>
        <div
          className={cls(
            "w-10 h-10 rounded-xl border flex items-center justify-center transition-colors duration-300",
            toneMap[tone]
          )}
        >
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

export default FraudAlerts;