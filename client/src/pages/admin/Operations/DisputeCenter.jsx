import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  RefreshCw,
  MoreHorizontal,
  Eye,
  UserCog,
  Siren,
  ShieldAlert,
  X,
  Clock3,
  BadgeAlert,
  Wallet,
  Scale,
  FileText,
  MessageSquareText,
  Camera,
  CreditCard,
  AlertTriangle,
  ShieldCheck,
  CarFront,
  Gavel,
  Activity,
  TimerReset,
  CheckCircle2,
  Ban,
  TrendingUp,
  Download,
} from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

/* =========================================================
   DUMMY DATA
========================================================= */
const DUMMY_CASES = [
  {
    id: "DSP-21031",
    type: "Inspection Dispute",
    linkedInquiryId: "INQ-84022",
    linkedInspectionId: "INS-22011",
    vehicleId: "VH-2044",
    vehicle: "Kia Seltos GTX+ 2023",
    buyer: "Priya Shah",
    consultant: "Prime Wheels",
    inspector: "Rakesh Solanki",
    raisedBy: "Buyer",
    severity: "High",
    assignedTo: "Senior Reviewer",
    slaState: "Near Breach",
    slaCountdown: "1h 18m left",
    status: "Under Investigation",
    age: "10h",
    submittedOn: "18 Feb 2026",
    claim: "Major dent not mentioned in report",
    financialImpact: "₹3,000 inspection fee",
    refundImpact: 3000,
    escalatedToLegal: false,
    decision: "-",
    outcome: "-",
    buyerRisk: 42,
    consultantRisk: 63,
    inspectorRisk: 71,
    repeatPattern: "Inspector has 2 previous valid disputes",
    timeline: [
      { time: "08:20 AM", label: "Inquiry created" },
      { time: "10:40 AM", label: "Inspection completed" },
      { time: "11:15 AM", label: "Inspection report approved" },
      { time: "02:30 PM", label: "Buyer raised dispute" },
      { time: "03:00 PM", label: "Case assigned to Senior Reviewer" },
    ],
    evidence: {
      chatLogs: 12,
      inspectionReport: "Available",
      mediaComparison: "Mismatch detected",
      paymentRecords: "Available",
      previousWarnings: "Inspector warned 1 time",
      fraudSignals: "No cluster match",
    },
  },
  {
    id: "DSP-21032",
    type: "Refund Claim",
    linkedInquiryId: "INQ-84031",
    linkedInspectionId: "-",
    vehicleId: "VH-2237",
    vehicle: "Mahindra XUV700 AX7",
    buyer: "Faizan Khan",
    consultant: "Elite Motors",
    inspector: "-",
    raisedBy: "Buyer",
    severity: "Medium",
    assignedTo: "Ops Executive",
    slaState: "Within SLA",
    slaCountdown: "9h 10m left",
    status: "Assigned",
    age: "3h",
    submittedOn: "20 Feb 2026",
    claim: "Booking token deducted twice",
    financialImpact: "₹5,000 duplicate charge",
    refundImpact: 5000,
    escalatedToLegal: false,
    decision: "-",
    outcome: "-",
    buyerRisk: 18,
    consultantRisk: 25,
    inspectorRisk: 0,
    repeatPattern: "No repeat pattern",
    timeline: [
      { time: "09:10 AM", label: "Payment initiated" },
      { time: "09:12 AM", label: "Duplicate debit reported" },
      { time: "09:32 AM", label: "Refund claim created" },
    ],
    evidence: {
      chatLogs: 5,
      inspectionReport: "N/A",
      mediaComparison: "N/A",
      paymentRecords: "Duplicate debit visible",
      previousWarnings: "None",
      fraudSignals: "No fraud signal",
    },
  },
  {
    id: "DSP-21033",
    type: "Fraud Investigation",
    linkedInquiryId: "INQ-84035",
    linkedInspectionId: "-",
    vehicleId: "VH-2251",
    vehicle: "Maruti Baleno Alpha",
    buyer: "Rahul Patel",
    consultant: "City Cars",
    inspector: "-",
    raisedBy: "System",
    severity: "Critical",
    assignedTo: "Fraud Lead",
    slaState: "Breached",
    slaCountdown: "Breached by 28m",
    status: "Escalated to Legal",
    age: "6h",
    submittedOn: "21 Feb 2026",
    claim: "Repeated off-platform deal attempts linked to payment redirection",
    financialImpact: "Potential high-value fraud exposure",
    refundImpact: 0,
    escalatedToLegal: true,
    decision: "Valid",
    outcome: "Legal Review",
    buyerRisk: 78,
    consultantRisk: 90,
    inspectorRisk: 0,
    repeatPattern: "Same consultant > 3 disputes in 30 days",
    timeline: [
      { time: "01:02 PM", label: "Suspicious payment pattern detected" },
      { time: "01:14 PM", label: "Fraud case auto-created" },
      { time: "02:10 PM", label: "Consultant listings locked" },
      { time: "03:30 PM", label: "Escalated to legal" },
    ],
    evidence: {
      chatLogs: 28,
      inspectionReport: "N/A",
      mediaComparison: "N/A",
      paymentRecords: "External transfer mention found",
      previousWarnings: "Consultant had 3 previous warnings",
      fraudSignals: "High cluster confidence",
    },
  },
  {
    id: "DSP-21034",
    type: "Consultant Misconduct",
    linkedInquiryId: "INQ-84040",
    linkedInspectionId: "-",
    vehicleId: "VH-2289",
    vehicle: "Hyundai Creta S",
    buyer: "Sneha Verma",
    consultant: "Metro Auto Hub",
    inspector: "-",
    raisedBy: "Buyer",
    severity: "High",
    assignedTo: "Senior Reviewer",
    slaState: "Within SLA",
    slaCountdown: "7h 05m left",
    status: "Pending Decision",
    age: "5h",
    submittedOn: "21 Feb 2026",
    claim: "Consultant shared misleading vehicle condition details",
    financialImpact: "Potential booking cancellation",
    refundImpact: 0,
    escalatedToLegal: false,
    decision: "-",
    outcome: "-",
    buyerRisk: 26,
    consultantRisk: 68,
    inspectorRisk: 0,
    repeatPattern: "2 related complaints in last 14 days",
    timeline: [
      { time: "10:11 AM", label: "Buyer raised complaint" },
      { time: "10:32 AM", label: "Evidence request sent" },
      { time: "12:05 PM", label: "Consultant evidence received" },
    ],
    evidence: {
      chatLogs: 14,
      inspectionReport: "N/A",
      mediaComparison: "Buyer uploaded comparison set",
      paymentRecords: "No payment issue",
      previousWarnings: "Consultant warned 2 times",
      fraudSignals: "No major fraud signal",
    },
  },
  {
    id: "DSP-21035",
    type: "Buyer Misconduct",
    linkedInquiryId: "INQ-84044",
    linkedInspectionId: "-",
    vehicleId: "VH-2301",
    vehicle: "Toyota Innova Crysta",
    buyer: "Aman Sheikh",
    consultant: "Urban Drive",
    inspector: "-",
    raisedBy: "Consultant",
    severity: "Low",
    assignedTo: "Ops Executive",
    slaState: "Within SLA",
    slaCountdown: "34h left",
    status: "New",
    age: "1h",
    submittedOn: "21 Feb 2026",
    claim: "Buyer repeatedly used abusive language",
    financialImpact: "No direct financial impact",
    refundImpact: 0,
    escalatedToLegal: false,
    decision: "-",
    outcome: "-",
    buyerRisk: 66,
    consultantRisk: 14,
    inspectorRisk: 0,
    repeatPattern: "Same buyer has 2 invalid disputes",
    timeline: [
      { time: "04:02 PM", label: "Consultant submitted misconduct complaint" },
      { time: "04:15 PM", label: "Case created" },
    ],
    evidence: {
      chatLogs: 8,
      inspectionReport: "N/A",
      mediaComparison: "N/A",
      paymentRecords: "N/A",
      previousWarnings: "Buyer warned 1 time",
      fraudSignals: "No cluster match",
    },
  },
];

const TYPE_OPTIONS = [
  "Inspection Dispute",
  "Inquiry Dispute",
  "Chat Abuse",
  "Refund Claim",
  "Fraud Investigation",
  "Consultant Misconduct",
  "Buyer Misconduct",
  "Ranking Complaint",
];
const SEVERITY_OPTIONS = ["Low", "Medium", "High", "Critical"];
const STATUS_OPTIONS = [
  "New",
  "Assigned",
  "Awaiting Evidence",
  "Under Investigation",
  "Pending Decision",
  "Resolved",
  "Closed",
  "Escalated to Legal",
];
const ASSIGN_OPTIONS = ["Ops Executive", "Senior Reviewer", "Fraud Lead"];

/* =========================================================
   BADGES
========================================================= */
const severityBadge = (severity) => {
  const map = {
    Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Medium: "bg-amber-50 text-amber-700 border-amber-200",
    High: "bg-rose-50 text-rose-700 border-rose-200",
    Critical: "bg-red-50 text-red-700 border-red-200",
  };
  return map[severity] || "bg-slate-50 text-slate-700 border-slate-200";
};

const statusBadge = (status) => {
  const map = {
    New: "bg-slate-100 text-slate-700 border-slate-200",
    Assigned: "bg-sky-50 text-sky-700 border-sky-200",
    "Awaiting Evidence": "bg-amber-50 text-amber-700 border-amber-200",
    "Under Investigation": "bg-violet-50 text-violet-700 border-violet-200",
    "Pending Decision": "bg-orange-50 text-orange-700 border-orange-200",
    Resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Closed: "bg-slate-100 text-slate-700 border-slate-200",
    "Escalated to Legal": "bg-rose-50 text-rose-700 border-rose-200",
  };
  return map[status] || "bg-slate-50 text-slate-700 border-slate-200";
};

const slaBadge = (sla) => {
  const map = {
    "Within SLA": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Near Breach": "bg-amber-50 text-amber-700 border-amber-200",
    Breached: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return map[sla] || "bg-slate-50 text-slate-700 border-slate-200";
};

const typeBadge = (type) => {
  const map = {
    "Inspection Dispute": "bg-sky-50 text-sky-700 border-sky-200",
    "Inquiry Dispute": "bg-slate-100 text-slate-700 border-slate-200",
    "Chat Abuse": "bg-amber-50 text-amber-700 border-amber-200",
    "Refund Claim": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Fraud Investigation": "bg-rose-50 text-rose-700 border-rose-200",
    "Consultant Misconduct": "bg-violet-50 text-violet-700 border-violet-200",
    "Buyer Misconduct": "bg-orange-50 text-orange-700 border-orange-200",
    "Ranking Complaint": "bg-indigo-50 text-indigo-700 border-indigo-200",
  };
  return map[type] || "bg-slate-50 text-slate-700 border-slate-200";
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

function DecisionButton({ active, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cls(
        "rounded-xl border px-4 py-2.5 text-[13px] font-semibold transition-all",
        active
          ? "border-sky-300 bg-sky-50 text-sky-700"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
      )}
    >
      {label}
    </button>
  );
}

/* =========================================================
   ROW ACTIONS
========================================================= */
function RowActions({
  item,
  onView,
  onAssign,
  onEscalate,
  onSeverity,
  onCloseCase,
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
          onClick={() => onView(item)}
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-[12px] font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <Eye className="h-4 w-4" />
          View
        </button>

        <button
          onClick={() => onAssign(item)}
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-3 text-[12px] font-semibold text-sky-700 transition hover:bg-sky-100"
        >
          <UserCog className="h-4 w-4" />
          Assign
        </button>

        <button
          onClick={() => onEscalate(item)}
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 text-[12px] font-semibold text-rose-700 transition hover:bg-rose-100"
        >
          <Siren className="h-4 w-4" />
          Escalate
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
              onSeverity(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-amber-700 hover:bg-amber-50"
          >
            <ShieldAlert className="h-4 w-4" />
            Change Severity
          </button>

          <button
            onClick={() => {
              onCloseCase(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-emerald-700 hover:bg-emerald-50"
          >
            <CheckCircle2 className="h-4 w-4" />
            Close Case
          </button>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   DETAIL DRAWER
========================================================= */
function CaseDetailDrawer({
  item,
  onClose,
  onAssign,
  onEscalate,
  onRefund,
  onPenalty,
  onCloseCase,
  onDecision,
}) {
  const [activeEvidenceTab, setActiveEvidenceTab] = useState("Chat Logs");
  const [selectedDecision, setSelectedDecision] = useState(item?.decision || "Valid");

  useEffect(() => {
    setSelectedDecision(item?.decision && item.decision !== "-" ? item.decision : "Valid");
    setActiveEvidenceTab("Chat Logs");
  }, [item]);

  if (!item) return null;

  const evidenceTabs = [
    "Chat Logs",
    "Inspection Report",
    "Media Comparison",
    "Payment Records",
    "Previous Warnings",
    "Fraud Signals",
  ];

  const evidenceContent = {
    "Chat Logs": `${item.evidence.chatLogs} related chat records available for case review.`,
    "Inspection Report": item.evidence.inspectionReport,
    "Media Comparison": item.evidence.mediaComparison,
    "Payment Records": item.evidence.paymentRecords,
    "Previous Warnings": item.evidence.previousWarnings,
    "Fraud Signals": item.evidence.fraudSignals,
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
              {item.linkedInquiryId} • {item.vehicle}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className={cls("inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold border", severityBadge(item.severity))}>
                {item.severity}
              </span>
              <span className={cls("inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold border", statusBadge(item.status))}>
                {item.status}
              </span>
              <span className={cls("inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold border", slaBadge(item.slaState))}>
                {item.slaState}
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
            <StatCard label="Severity" value={item.severity} icon={BadgeAlert} />
            <StatCard label="SLA Countdown" value={item.slaCountdown} icon={Clock3} />
            <StatCard label="Case Manager" value={item.assignedTo} icon={UserCog} />
            <StatCard label="Refund Impact" value={item.refundImpact ? `₹${item.refundImpact}` : "₹0"} icon={Wallet} />
          </div>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <ActionBtn onClick={() => onAssign(item)} icon={UserCog} tone="sky" label="Assign" />
            <ActionBtn onClick={() => onEscalate(item)} icon={Siren} tone="rose" label="Escalate" />
            <ActionBtn onClick={() => onRefund(item)} icon={Wallet} tone="emerald" label="Issue Refund" />
            <ActionBtn onClick={() => onPenalty(item)} icon={Ban} tone="amber" label="Penalize" />
            <ActionBtn onClick={() => onCloseCase(item)} icon={CheckCircle2} tone="slate" label="Close" />
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-4">
              Dispute Summary
            </h4>
            <div className="space-y-4 text-sm">
              <InfoRow icon={ShieldAlert} label="Raised By" value={item.raisedBy} />
              <InfoRow icon={FileText} label="Type" value={item.type} />
              <InfoRow icon={MessageSquareText} label="Claim" value={item.claim} />
              <InfoRow icon={Wallet} label="Financial Impact" value={item.financialImpact} />
              <InfoRow icon={Clock3} label="Submitted On" value={item.submittedOn} />
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
                Evidence Panel
              </h4>
              <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50">
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {evidenceTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveEvidenceTab(tab)}
                  className={cls(
                    "rounded-xl border px-3 py-2 text-[12px] font-semibold transition",
                    activeEvidenceTab === tab
                      ? "border-sky-300 bg-sky-50 text-sky-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-[13px] text-slate-700 leading-relaxed">
              {evidenceContent[activeEvidenceTab]}
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-4">
              Timeline
            </h4>
            <div className="space-y-3">
              {item.timeline.map((entry, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[13px] font-semibold text-slate-700">{entry.label}</span>
                    <span className="text-[11px] text-slate-400">{entry.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-4">
              Participant Risk Snapshot
            </h4>
            <div className="space-y-4 text-sm">
              <InfoRow icon={ShieldAlert} label="Buyer Risk" value={item.buyerRisk} />
              <InfoRow icon={ShieldCheck} label="Consultant Risk" value={item.consultantRisk} />
              <InfoRow icon={Activity} label="Inspector Risk" value={item.inspectorRisk || "-"} />
              <InfoRow icon={AlertTriangle} label="Pattern Signal" value={item.repeatPattern} />
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-4">
              Decision Panel
            </h4>

            <div className="grid grid-cols-3 gap-3">
              {["Valid", "Partially Valid", "Invalid"].map((decision) => (
                <DecisionButton
                  key={decision}
                  label={decision}
                  active={selectedDecision === decision}
                  onClick={() => setSelectedDecision(decision)}
                />
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              {selectedDecision === "Valid" && (
                <div className="space-y-2 text-[13px] text-slate-700">
                  <div>• Refund inspection</div>
                  <div>• Penalize inspector</div>
                  <div>• Penalize consultant</div>
                  <div>• Re-inspection</div>
                  <div>• Ranking penalty</div>
                </div>
              )}

              {selectedDecision === "Partially Valid" && (
                <div className="space-y-2 text-[13px] text-slate-700">
                  <div>• Partial refund</div>
                  <div>• Warning with monitoring</div>
                  <div>• Limited ranking adjustment</div>
                </div>
              )}

              {selectedDecision === "Invalid" && (
                <div className="space-y-2 text-[13px] text-slate-700">
                  <div>• Increase buyer risk</div>
                  <div>• Issue warning</div>
                  <div>• Close with audit note</div>
                </div>
              )}
            </div>

            <button
              onClick={() => onDecision(item, selectedDecision)}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-[13px] font-semibold text-white hover:bg-sky-700 transition"
            >
              <Scale className="h-4 w-4" />
              Save Decision
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function ActionBtn({ onClick, icon: Icon, label, tone = "slate" }) {
  const tones = {
    slate: "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100",
    sky: "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100",
    rose: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
    amber: "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
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

function AssignCaseModal({ modal, onClose, onConfirm }) {
  const [assignTo, setAssignTo] = useState("Ops Executive");

  useEffect(() => {
    if (modal?.type === "assign") setAssignTo("Ops Executive");
  }, [modal]);

  if (!modal || modal.type !== "assign") return null;

  return (
    <ModalShell
      title="Assign Case Manager"
      subtitle={`${modal.item.id} • ${modal.item.type}`}
      onClose={onClose}
    >
      <select
        value={assignTo}
        onChange={(e) => setAssignTo(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-[13px]"
      >
        {ASSIGN_OPTIONS.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>

      <ModalFooter
        onClose={onClose}
        onConfirm={() => onConfirm({ ...modal.item, assignTo })}
        confirmText="Confirm Assignment"
        confirmClass="bg-sky-600 hover:bg-sky-700"
      />
    </ModalShell>
  );
}

function EscalateLegalModal({ modal, onClose, onConfirm }) {
  if (!modal || modal.type !== "escalate") return null;

  return (
    <ModalShell
      title="Escalate to Legal"
      subtitle={`${modal.item.id} • ${modal.item.type}`}
      onClose={onClose}
    >
      <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[12px] text-rose-700">
        Status will move to Legal Review, access will be restricted, and complete audit evidence will be preserved.
      </div>

      <ModalFooter
        onClose={onClose}
        onConfirm={() => onConfirm(modal.item)}
        confirmText="Escalate"
        confirmClass="bg-rose-600 hover:bg-rose-700"
      />
    </ModalShell>
  );
}

function SeverityModal({ modal, onClose, onConfirm }) {
  const [severity, setSeverity] = useState("Medium");

  useEffect(() => {
    if (modal?.type === "severity") setSeverity(modal.item.severity);
  }, [modal]);

  if (!modal || modal.type !== "severity") return null;

  return (
    <ModalShell
      title="Change Severity"
      subtitle={`${modal.item.id} • ${modal.item.type}`}
      onClose={onClose}
    >
      <select
        value={severity}
        onChange={(e) => setSeverity(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-[13px]"
      >
        {SEVERITY_OPTIONS.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>

      <ModalFooter
        onClose={onClose}
        onConfirm={() => onConfirm({ ...modal.item, severity })}
        confirmText="Save Severity"
        confirmClass="bg-amber-600 hover:bg-amber-700"
      />
    </ModalShell>
  );
}

function RefundModal({ modal, onClose, onConfirm }) {
  const [amount, setAmount] = useState("");
  const [refundTo, setRefundTo] = useState("Buyer");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (modal?.type === "refund") {
      setAmount("");
      setRefundTo("Buyer");
      setReason("");
    }
  }, [modal]);

  if (!modal || modal.type !== "refund") return null;

  return (
    <ModalShell
      title="Issue Refund"
      subtitle={`${modal.item.id} • ${modal.item.type}`}
      onClose={onClose}
    >
      <div className="space-y-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Refund Amount (₹)"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-[13px]"
        />

        <select
          value={refundTo}
          onChange={(e) => setRefundTo(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-[13px]"
        >
          <option>Buyer</option>
          <option>Consultant</option>
        </select>

        <textarea
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason"
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-[13px]"
        />
      </div>

      <ModalFooter
        onClose={onClose}
        onConfirm={() =>
          onConfirm({
            ...modal.item,
            refundAmount: Number(amount || 0),
            refundTo,
            refundReason: reason,
          })
        }
        confirmText="Create Refund Entry"
        confirmClass="bg-emerald-600 hover:bg-emerald-700"
      />
    </ModalShell>
  );
}

function PenaltyModal({ modal, onClose, onConfirm }) {
  const [target, setTarget] = useState("Consultant");
  const [penalty, setPenalty] = useState("Ranking -10%");

  useEffect(() => {
    if (modal?.type === "penalty") {
      setTarget("Consultant");
      setPenalty("Ranking -10%");
    }
  }, [modal]);

  const penaltyOptions = {
    Consultant: ["Ranking -10%", "Boost disabled 7 days", "Temporary suspension"],
    Inspector: ["Rating deduction", "Temporary suspension"],
    Buyer: ["Warning", "Inquiry cap", "Suspension"],
  };

  if (!modal || modal.type !== "penalty") return null;

  return (
    <ModalShell
      title="Apply Penalty"
      subtitle={`${modal.item.id} • ${modal.item.type}`}
      onClose={onClose}
    >
      <div className="space-y-4">
        <select
          value={target}
          onChange={(e) => {
            const newTarget = e.target.value;
            setTarget(newTarget);
            setPenalty(penaltyOptions[newTarget][0]);
          }}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-[13px]"
        >
          <option>Consultant</option>
          <option>Inspector</option>
          <option>Buyer</option>
        </select>

        <select
          value={penalty}
          onChange={(e) => setPenalty(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-[13px]"
        >
          {penaltyOptions[target].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>

      <ModalFooter
        onClose={onClose}
        onConfirm={() => onConfirm({ ...modal.item, penaltyTarget: target, penalty })}
        confirmText="Apply Penalty"
        confirmClass="bg-amber-600 hover:bg-amber-700"
      />
    </ModalShell>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */
const DisputeCenter = () => {
  const [rows, setRows] = useState(DUMMY_CASES);
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: "",
    severity: "",
    status: "",
    assignedTo: "",
  });

  const [selectedCase, setSelectedCase] = useState(null);
  const [modal, setModal] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setLastRefresh(new Date());
    }, 20000);
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
          r.vehicle.toLowerCase().includes(q) ||
          r.buyer.toLowerCase().includes(q) ||
          r.consultant.toLowerCase().includes(q) ||
          r.raisedBy.toLowerCase().includes(q) ||
          r.linkedInquiryId.toLowerCase().includes(q)
      );
    }

    if (filters.type) data = data.filter((r) => r.type === filters.type);
    if (filters.severity) data = data.filter((r) => r.severity === filters.severity);
    if (filters.status) data = data.filter((r) => r.status === filters.status);
    if (filters.assignedTo) data = data.filter((r) => r.assignedTo === filters.assignedTo);

    const severityRank = { Critical: 4, High: 3, Medium: 2, Low: 1 };
    return data.sort((a, b) => severityRank[b.severity] - severityRank[a.severity]);
  }, [rows, search, filters]);

  const stats = useMemo(() => {
    const openCases = rows.filter((r) => !["Resolved", "Closed"].includes(r.status)).length;
    const critical = rows.filter((r) => r.severity === "Critical").length;
    const slaBreached = rows.filter((r) => r.slaState === "Breached").length;
    const avgResolutionTime = "14h 20m";
    const refundImpact = rows.reduce((sum, r) => sum + (r.refundImpact || 0), 0);
    const legal = rows.filter((r) => r.escalatedToLegal).length;

    return { openCases, critical, slaBreached, avgResolutionTime, refundImpact, legal };
  }, [rows]);

  const analytics = useMemo(() => {
    return {
      avgResolution: "14h 20m",
      per100Inquiries: "2.8",
      per100Inspections: "6.1",
      topDisputedConsultants: [
        { label: "Prime Wheels", value: "4 cases", tone: "bad" },
        { label: "Metro Auto Hub", value: "3 cases", tone: "warn" },
        { label: "Elite Motors", value: "2 cases", tone: "warn" },
      ],
      inspectorRatio: [
        { label: "Rakesh Solanki", value: "18%", tone: "bad" },
        { label: "Vikas Rana", value: "9%", tone: "warn" },
      ],
      refundTrend: [
        { label: "This Week", value: "₹12,000", tone: "warn" },
        { label: "This Month", value: "₹48,000", tone: "bad" },
      ],
    };
  }, []);

  const handleRefresh = () => {
    setRows([...DUMMY_CASES]);
    setLastRefresh(new Date());
  };

  const handleClear = () => {
    setSearch("");
    setFilters({
      type: "",
      severity: "",
      status: "",
      assignedTo: "",
    });
    setFiltersOpen(false);
  };

  const handleAssignConfirm = (item) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === item.id
          ? { ...r, assignedTo: item.assignTo, status: "Assigned" }
          : r
      )
    );
    if (selectedCase?.id === item.id) {
      setSelectedCase((prev) => ({ ...prev, assignedTo: item.assignTo, status: "Assigned" }));
    }
    setModal(null);
  };

  const handleEscalateConfirm = (item) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === item.id
          ? {
              ...r,
              status: "Escalated to Legal",
              escalatedToLegal: true,
              slaState: "Breached",
              slaCountdown: "Legal Review",
            }
          : r
      )
    );
    if (selectedCase?.id === item.id) {
      setSelectedCase((prev) => ({
        ...prev,
        status: "Escalated to Legal",
        escalatedToLegal: true,
        slaState: "Breached",
        slaCountdown: "Legal Review",
      }));
    }
    setModal(null);
  };

  const handleSeverityConfirm = (item) => {
    setRows((prev) =>
      prev.map((r) => (r.id === item.id ? { ...r, severity: item.severity } : r))
    );
    if (selectedCase?.id === item.id) {
      setSelectedCase((prev) => ({ ...prev, severity: item.severity }));
    }
    setModal(null);
  };

  const handleRefundConfirm = (item) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === item.id
          ? {
              ...r,
              refundImpact: item.refundAmount,
              outcome: `Refund to ${item.refundTo}`,
              decision: "Valid",
              status: "Resolved",
            }
          : r
      )
    );
    if (selectedCase?.id === item.id) {
      setSelectedCase((prev) => ({
        ...prev,
        refundImpact: item.refundAmount,
        outcome: `Refund to ${item.refundTo}`,
        decision: "Valid",
        status: "Resolved",
      }));
    }
    setModal(null);
  };

  const handlePenaltyConfirm = (item) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === item.id
          ? {
              ...r,
              outcome: `${item.penaltyTarget}: ${item.penalty}`,
              status: "Resolved",
            }
          : r
      )
    );
    if (selectedCase?.id === item.id) {
      setSelectedCase((prev) => ({
        ...prev,
        outcome: `${item.penaltyTarget}: ${item.penalty}`,
        status: "Resolved",
      }));
    }
    setModal(null);
  };

  const handleCloseCase = (item) => {
    setRows((prev) =>
      prev.map((r) => (r.id === item.id ? { ...r, status: "Closed" } : r))
    );
    if (selectedCase?.id === item.id) {
      setSelectedCase((prev) => ({ ...prev, status: "Closed" }));
    }
  };

  const handleDecisionSave = (item, decision) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === item.id
          ? { ...r, decision, status: "Pending Decision" }
          : r
      )
    );
    setSelectedCase((prev) =>
      prev?.id === item.id ? { ...prev, decision, status: "Pending Decision" } : prev
    );
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
              Dispute Center
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-500">
              Centralized case command center for dispute resolution, refund governance,
              penalties, legal escalation, evidence storage, and immutable audit logging.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-medium text-slate-500 shadow-sm">
            <RefreshCw className="h-4 w-4 text-sky-600" />
            Auto-refresh • Last sync {lastRefresh.toLocaleTimeString()}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
          <TopCard title="Open Cases" value={stats.openCases} icon={FileText} tone="good" />
          <TopCard title="Critical" value={stats.critical} icon={AlertTriangle} tone="bad" />
          <TopCard title="SLA Breached" value={stats.slaBreached} icon={Clock3} tone="bad" />
          <TopCard title="Avg Resolution" value={stats.avgResolutionTime} icon={TimerReset} tone="warn" />
          <TopCard title="Refund Impact" value={`₹${stats.refundImpact}`} icon={Wallet} tone="warn" />
          <TopCard title="Escalated to Legal" value={stats.legal} icon={Gavel} tone="bad" />
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
                  placeholder="Search by Case ID, inquiry, buyer, consultant, vehicle..."
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

                <select
                  value={filters.assignedTo}
                  onChange={(e) => setFilters((p) => ({ ...p, assignedTo: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400"
                >
                  <option value="">Assigned To</option>
                  {ASSIGN_OPTIONS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="w-full overflow-x-auto table-scroll relative z-10 pb-4">
            <table className="min-w-[1560px] w-full border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Case ID</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Type</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Entity</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Raised By</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Severity</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Assigned To</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">SLA</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Status</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Age</th>
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
                        selectedCase?.id === row.id && "bg-sky-50"
                      )}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-100 to-blue-100 border border-slate-200 flex items-center justify-center shrink-0">
                            <Scale className="h-4 w-4 text-sky-700" />
                          </div>
                          <div>
                            <div className="text-[14px] font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                              {row.id}
                            </div>
                            <div className="mt-0.5 text-[12px] text-slate-500">{row.linkedInquiryId}</div>
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
                          <CarFront className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                          <div>
                            <div className="text-[13px] font-medium text-slate-700">{row.vehicle}</div>
                            <div className="text-[12px] text-slate-500">{row.vehicleId}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-[13px] font-medium text-slate-700">
                        {row.raisedBy}
                      </td>

                      <td className="px-5 py-4">
                        <span className={cls("inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap", severityBadge(row.severity))}>
                          {row.severity}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-[13px] font-medium text-slate-700">
                        {row.assignedTo}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={cls("inline-flex w-fit rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap", slaBadge(row.slaState))}>
                            {row.slaState}
                          </span>
                          <span className="text-[12px] text-slate-500">{row.slaCountdown}</span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className={cls("inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap", statusBadge(row.status))}>
                          {row.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-[13px] font-medium text-slate-500 whitespace-nowrap">
                        {row.age}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <RowActions
                          item={row}
                          onView={setSelectedCase}
                          onAssign={(item) => setModal({ type: "assign", item })}
                          onEscalate={(item) => setModal({ type: "escalate", item })}
                          onSeverity={(item) => setModal({ type: "severity", item })}
                          onCloseCase={handleCloseCase}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="px-6 py-28 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-4">
                          <Search size={28} />
                        </div>
                        <div className="text-lg font-bold text-slate-900 tracking-tight">
                          No disputes found
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

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <AnalyticsCard
            title="Resolution Analytics"
            rows={[
              { label: "Avg Resolution Time", value: analytics.avgResolution, tone: "warn" },
              { label: "Per 100 Inquiries", value: analytics.per100Inquiries, tone: "good" },
              { label: "Per 100 Inspections", value: analytics.per100Inspections, tone: "warn" },
            ]}
          />
          <AnalyticsCard title="Top Disputed Consultants" rows={analytics.topDisputedConsultants} />
          <AnalyticsCard
            title="Inspector Ratio / Refund Trend"
            rows={[...analytics.inspectorRatio, ...analytics.refundTrend]}
          />
        </section>
      </div>

      <CaseDetailDrawer
        item={selectedCase}
        onClose={() => setSelectedCase(null)}
        onAssign={(item) => setModal({ type: "assign", item })}
        onEscalate={(item) => setModal({ type: "escalate", item })}
        onRefund={(item) => setModal({ type: "refund", item })}
        onPenalty={(item) => setModal({ type: "penalty", item })}
        onCloseCase={handleCloseCase}
        onDecision={handleDecisionSave}
      />

      <AssignCaseModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleAssignConfirm}
      />

      <EscalateLegalModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleEscalateConfirm}
      />

      <SeverityModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleSeverityConfirm}
      />

      <RefundModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleRefundConfirm}
      />

      <PenaltyModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handlePenaltyConfirm}
      />
    </div>
  );
};

function AnalyticsCard({ title, rows = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-[14px] font-bold text-slate-900">{title}</h3>
      <div className="mt-4 space-y-3">
        {rows.map((row, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
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

export default DisputeCenter;