import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  RefreshCw,
  MoreHorizontal,
  Eye,
  UserPlus,
  FileSearch,
  RotateCcw,
  BadgeDollarSign,
  ShieldAlert,
  Scale,
  X,
  Car,
  User,
  Clock3,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  MessageSquareText,
  Gavel,
  AlertTriangle,
  ClipboardList,
} from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

/* =========================================================
   DUMMY DATA
========================================================= */
const DUMMY_DISPUTES = [
  {
    id: "DSP-1001",
    vehicleId: "VH-7812",
    reportId: "REP-8421",
    vehicle: "Hyundai Creta SX 2021",
    raisedBy: "Buyer",
    raisedByName: "Arjun Mehta",
    raisedById: "USR-10231",
    against: "Inspector",
    againstName: "Rahul Shah",
    consultant: "Metro Auto Hub",
    inspector: "Rahul Shah",
    city: "Ahmedabad",
    disputeType: "Inspection mismatch",
    severity: "High",
    status: "Open",
    age: "2d",
    refundRequested: true,
    date: "15 Mar 2026",
    caseManager: "",
    claim: "Major accident damage not mentioned in report.",
    evidenceCount: 3,
    safetyIssue: true,
    fraudSuspicion: false,
    repeatOffender: true,
    linkedHistory: 2,
    analytics: {
      disputeRate: "4.6%",
      inspectorRatio: "7/100",
      consultantRatio: "3/100",
      avgResolution: "2.8d",
      reinspectionFreq: "11%",
      refundTrend: "₹18,500 / month",
    },
    summary: {
      submittedOn: "15 Mar 2026",
      evidenceSubmitted: "3 Photos",
      reportClaim: "No structural issue mentioned",
      systemFlag: "Mismatch in accident section",
    },
    evidencePanel: {
      buyerEvidence: ["Front bumper crack photo", "Engine bay image", "Door alignment image"],
      reportMedia: ["Inspection photo set", "Underbody images"],
      video: "Walkaround inspection clip",
      chatLogs: ["Buyer reported issue after delivery", "Consultant denied hidden damage"],
      timeline: [
        "Inspection completed on 13 Mar 2026",
        "Buyer raised complaint on 15 Mar 2026",
        "System mismatch flag generated",
      ],
    },
    reportSnapshot: {
      accidentStatus: "Not Mentioned",
      structuralRemarks: "No major structural note",
      majorIssues: "Minor scratches only",
      inspectorNotes: "Vehicle condition acceptable",
    },
    consultantStatement:
      "Vehicle was listed based on report. Consultant denies knowledge of hidden accident.",
    inspectorResponse:
      "Damage visible in current images may have occurred after inspection date.",
    immutableLogs: [
      "Case created by Buyer • 15 Mar 2026",
      "Auto-flag raised by mismatch engine • 15 Mar 2026",
    ],
  },
  {
    id: "DSP-1002",
    vehicleId: "VH-9002",
    reportId: "REP-8439",
    vehicle: "Tata Nexon XZ+ 2022",
    raisedBy: "Consultant",
    raisedByName: "City Drive",
    raisedById: "CON-401",
    against: "Buyer",
    againstName: "Priya Shah",
    consultant: "City Drive",
    inspector: "Nisha Patel",
    city: "Surat",
    disputeType: "Buyer false complaint",
    severity: "Medium",
    status: "Under Investigation",
    age: "1d",
    refundRequested: false,
    date: "16 Mar 2026",
    caseManager: "Ops Lead",
    claim: "Buyer raised false complaint after negotiation failure.",
    evidenceCount: 2,
    safetyIssue: false,
    fraudSuspicion: true,
    repeatOffender: false,
    linkedHistory: 1,
    analytics: {
      disputeRate: "3.1%",
      inspectorRatio: "5/100",
      consultantRatio: "4/100",
      avgResolution: "3.1d",
      reinspectionFreq: "9%",
      refundTrend: "₹12,300 / month",
    },
    summary: {
      submittedOn: "16 Mar 2026",
      evidenceSubmitted: "2 Attachments",
      reportClaim: "No discrepancy in final report",
      systemFlag: "Buyer history moderate risk",
    },
    evidencePanel: {
      buyerEvidence: ["Chat screenshot"],
      reportMedia: ["Report PDF", "Car side images"],
      video: "No video",
      chatLogs: ["Buyer changed claim twice", "Consultant requested admin review"],
      timeline: [
        "Inspection done on 14 Mar 2026",
        "Buyer dispute raised on 16 Mar 2026",
      ],
    },
    reportSnapshot: {
      accidentStatus: "Clean",
      structuralRemarks: "No issue",
      majorIssues: "Tyres 40% worn",
      inspectorNotes: "Condition consistent with age",
    },
    consultantStatement:
      "Complaint seems retaliatory after pricing disagreement.",
    inspectorResponse:
      "Report is accurate based on inspection date and visible condition.",
    immutableLogs: [
      "Case created by Consultant • 16 Mar 2026",
      "Assigned to Ops Lead • 16 Mar 2026",
    ],
  },
  {
    id: "DSP-1003",
    vehicleId: "VH-4431",
    reportId: "REP-8447",
    vehicle: "Toyota Innova Crysta 2021",
    raisedBy: "System",
    raisedByName: "Rule Engine",
    raisedById: "SYS-01",
    against: "Consultant",
    againstName: "Royal Cars",
    consultant: "Royal Cars",
    inspector: "Karan Vora",
    city: "Rajkot",
    disputeType: "Media manipulation",
    severity: "Critical",
    status: "Escalated",
    age: "4h",
    refundRequested: true,
    date: "17 Mar 2026",
    caseManager: "Fraud Team",
    claim: "Media inconsistency detected across report and listing assets.",
    evidenceCount: 5,
    safetyIssue: true,
    fraudSuspicion: true,
    repeatOffender: true,
    linkedHistory: 4,
    analytics: {
      disputeRate: "6.8%",
      inspectorRatio: "9/100",
      consultantRatio: "12/100",
      avgResolution: "4.2d",
      reinspectionFreq: "15%",
      refundTrend: "₹31,200 / month",
    },
    summary: {
      submittedOn: "17 Mar 2026",
      evidenceSubmitted: "5 Media Items",
      reportClaim: "Structural condition normal",
      systemFlag: "Media hash mismatch + repeat offender",
    },
    evidencePanel: {
      buyerEvidence: ["Listing screenshot", "Comparison collage"],
      reportMedia: ["Inspection gallery", "Chassis image", "Exterior video"],
      video: "Inspector media clip",
      chatLogs: ["No buyer complaint yet", "System escalated directly"],
      timeline: [
        "Media mismatch auto-detected",
        "Critical fraud alert triggered",
        "Case escalated to Fraud Team",
      ],
    },
    reportSnapshot: {
      accidentStatus: "No major issue",
      structuralRemarks: "Clean frame note",
      majorIssues: "Minor dent only",
      inspectorNotes: "Vehicle visually acceptable",
    },
    consultantStatement:
      "Consultant statement pending submission.",
    inspectorResponse:
      "Inspector response awaited.",
    immutableLogs: [
      "Case created by System • 17 Mar 2026",
      "Escalated to Fraud Team • 17 Mar 2026",
    ],
  },
  {
    id: "DSP-1004",
    vehicleId: "VH-6201",
    reportId: "REP-8455",
    vehicle: "Kia Seltos GTX 2020",
    raisedBy: "Buyer",
    raisedByName: "Nirali Shah",
    raisedById: "USR-10510",
    against: "Consultant",
    againstName: "Prime Wheels",
    consultant: "Prime Wheels",
    inspector: "Mehul Trivedi",
    city: "Surat",
    disputeType: "Hidden accident claim",
    severity: "High",
    status: "Awaiting Evidence",
    age: "3d",
    refundRequested: true,
    date: "14 Mar 2026",
    caseManager: "Senior Reviewer",
    claim: "Hidden rear-end damage not disclosed before purchase discussion.",
    evidenceCount: 1,
    safetyIssue: true,
    fraudSuspicion: false,
    repeatOffender: false,
    linkedHistory: 0,
    analytics: {
      disputeRate: "4.2%",
      inspectorRatio: "6/100",
      consultantRatio: "5/100",
      avgResolution: "2.5d",
      reinspectionFreq: "10%",
      refundTrend: "₹15,900 / month",
    },
    summary: {
      submittedOn: "14 Mar 2026",
      evidenceSubmitted: "1 Photo",
      reportClaim: "Rear panel minor scratch only",
      systemFlag: "Awaiting more buyer proof",
    },
    evidencePanel: {
      buyerEvidence: ["Rear chassis photo"],
      reportMedia: ["Rear bumper images", "Side images"],
      video: "No video",
      chatLogs: ["Buyer requested refund", "Consultant denied hidden damage"],
      timeline: [
        "Dispute submitted",
        "Additional evidence requested",
      ],
    },
    reportSnapshot: {
      accidentStatus: "No major accident",
      structuralRemarks: "No structural bend noted",
      majorIssues: "Minor cosmetic wear",
      inspectorNotes: "Rear looked clean during inspection",
    },
    consultantStatement:
      "Consultant denies concealment and requests re-inspection.",
    inspectorResponse:
      "Inspector states no hidden accident signs were visible at the time.",
    immutableLogs: [
      "Case created by Buyer • 14 Mar 2026",
      "Evidence request sent • 15 Mar 2026",
    ],
  },
];

const DISPUTE_TYPES = [
  "Inspection mismatch",
  "Hidden accident claim",
  "Odometer mismatch",
  "Structural damage dispute",
  "Media manipulation",
  "Inspector bias",
  "Consultant pressure",
  "Buyer false complaint",
];

const RAISED_BY_OPTIONS = ["Buyer", "Consultant", "System"];
const STATUS_OPTIONS = [
  "Open",
  "Under Investigation",
  "Awaiting Evidence",
  "Resolved",
  "Escalated",
  "Re-Inspection Ordered",
];
const SEVERITY_OPTIONS = ["Low", "Medium", "High", "Critical"];

/* =========================================================
   BADGES
========================================================= */
const statusBadge = (status) => {
  const map = {
    Open: "bg-sky-50 text-sky-700 border-sky-200",
    "Under Investigation": "bg-amber-50 text-amber-700 border-amber-200",
    "Awaiting Evidence": "bg-violet-50 text-violet-700 border-violet-200",
    Resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Escalated: "bg-rose-50 text-rose-700 border-rose-200",
    "Re-Inspection Ordered": "bg-indigo-50 text-indigo-700 border-indigo-200",
  };
  return map[status] || "bg-slate-100 text-slate-700 border-slate-200";
};

const severityBadge = (severity) => {
  const map = {
    Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Medium: "bg-amber-50 text-amber-700 border-amber-200",
    High: "bg-orange-50 text-orange-700 border-orange-200",
    Critical: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return map[severity] || "bg-slate-100 text-slate-700 border-slate-200";
};

const raisedByBadge = (raisedBy) => {
  const map = {
    Buyer: "bg-sky-50 text-sky-700 border-sky-200",
    Consultant: "bg-violet-50 text-violet-700 border-violet-200",
    System: "bg-slate-900 text-white border-slate-900",
  };
  return map[raisedBy] || "bg-slate-100 text-slate-700 border-slate-200";
};

/* =========================================================
   SMALL COMPONENTS
========================================================= */
function TopCard({ title, value, icon: Icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cls(
        "relative rounded-2xl border p-6 overflow-hidden transition text-left shadow-sm",
        active
          ? "border-sky-600 bg-sky-600 text-white"
          : "border-slate-200 bg-white hover:bg-slate-50"
      )}
    >
      <div className="relative z-10 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div
            className={cls(
              "text-[12px] font-bold uppercase tracking-[0.15em] mb-2",
              active ? "text-sky-100" : "text-slate-400"
            )}
          >
            {title}
          </div>
          <div className="text-3xl font-extrabold tracking-tight break-words leading-tight">
            {value}
          </div>
        </div>

        <div
          className={cls(
            "w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 transition-colors",
            active
              ? "bg-white/10 border-white/20 text-white"
              : "bg-sky-50 border-sky-100 text-sky-600"
          )}
        >
          <Icon size={18} />
        </div>
      </div>
    </button>
  );
}

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

function InfoRow({ label, value }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-slate-400">{label}</div>
      <div className="mt-1 text-[13px] font-medium text-slate-700">{value}</div>
    </div>
  );
}

/* =========================================================
   ACTION MENU
========================================================= */
function DisputeRowActions({
  item,
  onView,
  onAssign,
  onEvidence,
  onReinspect,
  onRefund,
  onPenalty,
  onCloseCase,
  onEscalate,
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
      <button
        onClick={() => setOpen((p) => !p)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 shadow-sm"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-30 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
          <button
            onClick={() => {
              onView(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50"
          >
            <Eye className="h-4 w-4 text-slate-500" />
            View Case
          </button>

          <button
            onClick={() => {
              onAssign(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-sky-700 hover:bg-sky-50"
          >
            <UserPlus className="h-4 w-4" />
            Assign Case Manager
          </button>

          <button
            onClick={() => {
              onEvidence(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-indigo-700 hover:bg-indigo-50"
          >
            <FileSearch className="h-4 w-4" />
            Request Evidence
          </button>

          <button
            onClick={() => {
              onReinspect(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-violet-700 hover:bg-violet-50"
          >
            <RotateCcw className="h-4 w-4" />
            Order Re-Inspection
          </button>

          <button
            onClick={() => {
              onRefund(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-amber-700 hover:bg-amber-50"
          >
            <BadgeDollarSign className="h-4 w-4" />
            Issue Refund
          </button>

          <button
            onClick={() => {
              onPenalty(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-orange-700 hover:bg-orange-50"
          >
            <ShieldAlert className="h-4 w-4" />
            Penalize Party
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

          <button
            onClick={() => {
              onEscalate(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-rose-700 hover:bg-rose-50"
          >
            <Scale className="h-4 w-4" />
            Escalate to Legal
          </button>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   CASE DRAWER
========================================================= */
function DisputeCaseDrawer({
  item,
  onClose,
  onAssign,
  onReinspect,
  onRefund,
  onPenalty,
  onCloseCase,
  onEvidence,
}) {
  if (!item) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-[760px] border-l border-slate-200 bg-white shadow-2xl flex flex-col">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 bg-slate-50">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{item.id}</h3>
            <p className="mt-1 text-sm text-slate-500">
              {item.vehicle} • {item.vehicleId}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className={cls("inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold border", raisedByBadge(item.raisedBy))}>
                {item.raisedBy}
              </span>
              <span className={cls("inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold border", severityBadge(item.severity))}>
                {item.severity}
              </span>
              <span className={cls("inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold border", statusBadge(item.status))}>
                {item.status}
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
            <StatCard label="Report ID" value={item.reportId} icon={FileText} />
            <StatCard label="Case Manager" value={item.caseManager || "Unassigned"} icon={UserPlus} />
            <StatCard label="Evidence Count" value={item.evidenceCount} icon={ImageIcon} />
            <StatCard label="Age" value={item.age} icon={Clock3} />
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
              Dispute Summary
            </h4>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <InfoRow label="Raised By" value={`${item.raisedBy} • ${item.raisedByName}`} />
              <InfoRow label="Against" value={`${item.against} • ${item.againstName}`} />
              <InfoRow label="Claim" value={item.claim} />
              <InfoRow label="Submitted On" value={item.summary.submittedOn} />
              <InfoRow label="Evidence Submitted" value={item.summary.evidenceSubmitted} />
              <InfoRow label="Inspection Report ID" value={item.reportId} />
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
              <ImageIcon className="h-4 w-4" />
              Evidence Panel
            </h4>

            <div className="mt-4 grid grid-cols-1 gap-4">
              <div>
                <div className="text-[12px] font-semibold text-slate-500 mb-2">Buyer Evidence</div>
                <div className="space-y-2">
                  {item.evidencePanel.buyerEvidence.map((x, i) => (
                    <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[13px] text-slate-600">
                      {x}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[12px] font-semibold text-slate-500 mb-2">Inspection Report Media</div>
                <div className="space-y-2">
                  {item.evidencePanel.reportMedia.map((x, i) => (
                    <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[13px] text-slate-600">
                      {x}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InfoRow label="Video" value={item.evidencePanel.video} />
                <InfoRow label="Timeline" value={item.evidencePanel.timeline.join(" • ")} />
              </div>

              <div>
                <div className="text-[12px] font-semibold text-slate-500 mb-2">Chat Logs</div>
                <div className="space-y-2">
                  {item.evidencePanel.chatLogs.map((x, i) => (
                    <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[13px] text-slate-600">
                      {x}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
              Inspection Report Snapshot
            </h4>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <InfoRow label="Accident Status" value={item.reportSnapshot.accidentStatus} />
              <InfoRow label="Structural Remarks" value={item.reportSnapshot.structuralRemarks} />
              <InfoRow label="Major Issues" value={item.reportSnapshot.majorIssues} />
              <InfoRow label="Inspector Notes" value={item.reportSnapshot.inspectorNotes} />
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
              Consultant Statement
            </h4>
            <p className="mt-3 text-[13px] text-slate-700 leading-6">{item.consultantStatement}</p>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
              Inspector Response
            </h4>
            <p className="mt-3 text-[13px] text-slate-700 leading-6">{item.inspectorResponse}</p>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
              Dispute Analytics Panel
            </h4>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <InfoRow label="Dispute Rate / 100" value={item.analytics.disputeRate} />
              <InfoRow label="Inspector Dispute Ratio" value={item.analytics.inspectorRatio} />
              <InfoRow label="Consultant Dispute Ratio" value={item.analytics.consultantRatio} />
              <InfoRow label="Avg Resolution Time" value={item.analytics.avgResolution} />
              <InfoRow label="Re-Inspection Frequency" value={item.analytics.reinspectionFreq} />
              <InfoRow label="Refund Cost Trend" value={item.analytics.refundTrend} />
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
              Immutable Logging
            </h4>

            <div className="mt-4 space-y-2">
              {item.immutableLogs.map((log, i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[13px] text-slate-600">
                  {log}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <button
              onClick={() => onAssign(item)}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-[13px] font-semibold text-white hover:bg-sky-700"
            >
              <UserPlus className="h-4 w-4" />
              Assign
            </button>

            <button
              onClick={() => onReinspect(item)}
              className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-[13px] font-semibold text-violet-700 hover:bg-violet-100"
            >
              <RotateCcw className="h-4 w-4" />
              Order Re-Inspection
            </button>

            <button
              onClick={() => onRefund(item)}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] font-semibold text-amber-700 hover:bg-amber-100"
            >
              <BadgeDollarSign className="h-4 w-4" />
              Issue Refund
            </button>

            <button
              onClick={() => onPenalty(item)}
              className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-[13px] font-semibold text-orange-700 hover:bg-orange-100"
            >
              <ShieldAlert className="h-4 w-4" />
              Penalize
            </button>

            <button
              onClick={() => onCloseCase(item)}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] font-semibold text-emerald-700 hover:bg-emerald-100"
            >
              <CheckCircle2 className="h-4 w-4" />
              Close
            </button>

            <button
              onClick={() => onEvidence(item)}
              className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-[13px] font-semibold text-indigo-700 hover:bg-indigo-100"
            >
              <FileSearch className="h-4 w-4" />
              Request Evidence
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* =========================================================
   MODALS
========================================================= */
function AssignManagerModal({ modal, onClose, onConfirm }) {
  const [assignTo, setAssignTo] = useState("Ops Lead");

  useEffect(() => {
    if (modal?.type === "assign") setAssignTo("Ops Lead");
  }, [modal]);

  if (!modal || modal.type !== "assign") return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[61] w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Assign Case Manager</h3>
            <p className="mt-1 text-[13px] text-slate-500">{modal.item.id}</p>
          </div>
          <button onClick={onClose} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-[13px] font-medium text-slate-700">Assign To</label>
          <select
            value={assignTo}
            onChange={(e) => setAssignTo(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[13px] outline-none focus:border-sky-400"
          >
            <option>Ops Lead</option>
            <option>Fraud Team</option>
            <option>Senior Reviewer</option>
          </select>
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-200">
          <button onClick={onClose} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={() => onConfirm({ ...modal.item, assignTo })}
            className="rounded-xl bg-sky-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-sky-700"
          >
            Confirm Assign
          </button>
        </div>
      </div>
    </>
  );
}

function EvidenceModal({ modal, onClose, onConfirm }) {
  const [requestFrom, setRequestFrom] = useState("Buyer");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (modal?.type === "evidence") {
      setRequestFrom("Buyer");
      setMessage("");
    }
  }, [modal]);

  if (!modal || modal.type !== "evidence") return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[61] w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Request Additional Evidence</h3>
            <p className="mt-1 text-[13px] text-slate-500">{modal.item.id}</p>
          </div>
          <button onClick={onClose} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-[13px] font-medium text-slate-700">Request From</label>
            <select
              value={requestFrom}
              onChange={(e) => setRequestFrom(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[13px] outline-none focus:border-sky-400"
            >
              <option>Buyer</option>
              <option>Consultant</option>
              <option>Inspector</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-medium text-slate-700">Message</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter evidence request message..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[13px] outline-none focus:border-sky-400"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-200">
          <button onClick={onClose} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={() => onConfirm({ ...modal.item, requestFrom, message })}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-indigo-700"
          >
            Send Request
          </button>
        </div>
      </div>
    </>
  );
}

function ReinspectionModal({ modal, onClose, onConfirm }) {
  const [newInspector, setNewInspector] = useState("Yes");
  const [costCoveredBy, setCostCoveredBy] = useState("AVX");

  useEffect(() => {
    if (modal?.type === "reinspect") {
      setNewInspector("Yes");
      setCostCoveredBy("AVX");
    }
  }, [modal]);

  if (!modal || modal.type !== "reinspect") return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[61] w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Order Re-Inspection</h3>
            <p className="mt-1 text-[13px] text-slate-500">{modal.item.id}</p>
          </div>
          <button onClick={onClose} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-[13px] font-medium text-slate-700">Assign New Inspector?</label>
            <div className="grid grid-cols-2 gap-3">
              {["Yes", "No"].map((x) => (
                <button
                  key={x}
                  onClick={() => setNewInspector(x)}
                  className={cls(
                    "rounded-xl border px-4 py-2.5 text-[13px] font-semibold transition-all",
                    newInspector === x
                      ? "border-violet-300 bg-violet-50 text-violet-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {x}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-medium text-slate-700">Cost Covered By</label>
            <select
              value={costCoveredBy}
              onChange={(e) => setCostCoveredBy(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[13px] outline-none focus:border-sky-400"
            >
              <option>AVX</option>
              <option>Consultant</option>
              <option>Buyer</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-200">
          <button onClick={onClose} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={() => onConfirm({ ...modal.item, newInspector, costCoveredBy })}
            className="rounded-xl bg-violet-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-violet-700"
          >
            Order Re-Inspection
          </button>
        </div>
      </div>
    </>
  );
}

function RefundModal({ modal, onClose, onConfirm }) {
  const [amount, setAmount] = useState("999");
  const [refundTo, setRefundTo] = useState("Buyer");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (modal?.type === "refund") {
      setAmount("999");
      setRefundTo("Buyer");
      setReason("");
    }
  }, [modal]);

  if (!modal || modal.type !== "refund") return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[61] w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Issue Refund</h3>
            <p className="mt-1 text-[13px] text-slate-500">{modal.item.id}</p>
          </div>
          <button onClick={onClose} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-[13px] font-medium text-slate-700">Refund Amount</label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[13px] outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-medium text-slate-700">Refund To</label>
            <select
              value={refundTo}
              onChange={(e) => setRefundTo(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[13px] outline-none focus:border-sky-400"
            >
              <option>Buyer</option>
              <option>Consultant</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-medium text-slate-700">Reason</label>
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter refund reason..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[13px] outline-none focus:border-sky-400"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-200">
          <button onClick={onClose} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={() => onConfirm({ ...modal.item, amount, refundTo, reason })}
            className="rounded-xl bg-amber-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-amber-700"
          >
            Issue Refund
          </button>
        </div>
      </div>
    </>
  );
}

function PenaltyModal({ modal, onClose, onConfirm }) {
  const [penalty, setPenalty] = useState("Inspector rating deduction");

  useEffect(() => {
    if (modal?.type === "penalty") setPenalty("Inspector rating deduction");
  }, [modal]);

  if (!modal || modal.type !== "penalty") return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[61] w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Apply Penalty</h3>
            <p className="mt-1 text-[13px] text-slate-500">{modal.item.id}</p>
          </div>
          <button onClick={onClose} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-[13px] font-medium text-slate-700">Penalty Option</label>
          <select
            value={penalty}
            onChange={(e) => setPenalty(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[13px] outline-none focus:border-sky-400"
          >
            <option>Inspector rating deduction</option>
            <option>Inspector suspension</option>
            <option>Consultant ranking penalty</option>
            <option>Consultant temporary suspension</option>
            <option>Buyer warning</option>
            <option>Buyer suspension</option>
          </select>
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-200">
          <button onClick={onClose} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={() => onConfirm({ ...modal.item, penalty })}
            className="rounded-xl bg-orange-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-orange-700"
          >
            Apply Penalty
          </button>
        </div>
      </div>
    </>
  );
}

function CloseCaseModal({ modal, onClose, onConfirm }) {
  const [resolution, setResolution] = useState("Claim Valid");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (modal?.type === "close") {
      setResolution("Claim Valid");
      setNotes("");
    }
  }, [modal]);

  if (!modal || modal.type !== "close") return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[61] w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Close Case</h3>
            <p className="mt-1 text-[13px] text-slate-500">{modal.item.id}</p>
          </div>
          <button onClick={onClose} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-[13px] font-medium text-slate-700">Resolution</label>
            <select
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[13px] outline-none focus:border-sky-400"
            >
              <option>Claim Valid</option>
              <option>Claim Partially Valid</option>
              <option>Claim Invalid</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-medium text-slate-700">Notes</label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter resolution notes..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[13px] outline-none focus:border-sky-400"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-200">
          <button onClick={onClose} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={() => onConfirm({ ...modal.item, resolution, notes })}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-emerald-700"
          >
            Close Case
          </button>
        </div>
      </div>
    </>
  );
}

function EscalateLegalModal({ modal, onClose, onConfirm }) {
  const [reason, setReason] = useState("Critical severity / legal review required");

  useEffect(() => {
    if (modal?.type === "escalate") {
      setReason("Critical severity / legal review required");
    }
  }, [modal]);

  if (!modal || modal.type !== "escalate") return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[61] w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Escalate to Legal</h3>
            <p className="mt-1 text-[13px] text-slate-500">{modal.item.id}</p>
          </div>
          <button onClick={onClose} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-[13px] font-medium text-slate-700">Reason</label>
          <textarea
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[13px] outline-none focus:border-sky-400"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-200">
          <button onClick={onClose} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={() => onConfirm({ ...modal.item, reason })}
            className="rounded-xl bg-rose-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-rose-700"
          >
            Escalate
          </button>
        </div>
      </div>
    </>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */
const Disputes = () => {
  const [rows, setRows] = useState(DUMMY_DISPUTES);
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [quickFilter, setQuickFilter] = useState("all");
  const [filters, setFilters] = useState({
    disputeType: "",
    raisedBy: "",
    status: "",
    severity: "",
    refundRequested: "",
    city: "",
  });

  const [selectedCase, setSelectedCase] = useState(null);
  const [modal, setModal] = useState(null);

  const uniqueCities = useMemo(() => [...new Set(rows.map((r) => r.city))], [rows]);

  const summary = useMemo(() => {
    return {
      open: rows.filter((r) => r.status === "Open").length,
      investigating: rows.filter((r) => r.status === "Under Investigation").length,
      evidence: rows.filter((r) => r.status === "Awaiting Evidence").length,
      resolved: rows.filter((r) => r.status === "Resolved").length,
      escalated: rows.filter((r) => r.status === "Escalated").length,
      reinspect: rows.filter((r) => r.status === "Re-Inspection Ordered").length,
    };
  }, [rows]);

  const filteredRows = useMemo(() => {
    let data = [...rows];

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.vehicleId.toLowerCase().includes(q) ||
          r.reportId.toLowerCase().includes(q) ||
          r.raisedById.toLowerCase().includes(q) ||
          r.consultant.toLowerCase().includes(q) ||
          r.inspector.toLowerCase().includes(q)
      );
    }

    if (filters.disputeType) data = data.filter((r) => r.disputeType === filters.disputeType);
    if (filters.raisedBy) data = data.filter((r) => r.raisedBy === filters.raisedBy);
    if (filters.status) data = data.filter((r) => r.status === filters.status);
    if (filters.severity) data = data.filter((r) => r.severity === filters.severity);
    if (filters.refundRequested) {
      data = data.filter((r) =>
        filters.refundRequested === "Yes" ? r.refundRequested : !r.refundRequested
      );
    }
    if (filters.city) data = data.filter((r) => r.city === filters.city);

    if (quickFilter === "open") data = data.filter((r) => r.status === "Open");
    if (quickFilter === "investigating")
      data = data.filter((r) => r.status === "Under Investigation");
    if (quickFilter === "evidence")
      data = data.filter((r) => r.status === "Awaiting Evidence");
    if (quickFilter === "resolved")
      data = data.filter((r) => r.status === "Resolved");
    if (quickFilter === "escalated")
      data = data.filter((r) => r.status === "Escalated");
    if (quickFilter === "reinspect")
      data = data.filter((r) => r.status === "Re-Inspection Ordered");

    return data;
  }, [rows, search, filters, quickFilter]);

  const handleRefresh = () => setRows([...DUMMY_DISPUTES]);

  const handleClear = () => {
    setSearch("");
    setQuickFilter("all");
    setFilters({
      disputeType: "",
      raisedBy: "",
      status: "",
      severity: "",
      refundRequested: "",
      city: "",
    });
    setFiltersOpen(false);
  };

  const handleAssignConfirm = (item) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === item.id
          ? {
              ...r,
              caseManager: item.assignTo,
              status: r.status === "Open" ? "Under Investigation" : r.status,
              immutableLogs: [...r.immutableLogs, `Assigned to ${item.assignTo} • 17 Mar 2026`],
            }
          : r
      )
    );

    if (selectedCase?.id === item.id) {
      setSelectedCase((prev) => ({
        ...prev,
        caseManager: item.assignTo,
        status: prev.status === "Open" ? "Under Investigation" : prev.status,
        immutableLogs: [...prev.immutableLogs, `Assigned to ${item.assignTo} • 17 Mar 2026`],
      }));
    }

    setModal(null);
  };

  const handleEvidenceConfirm = (item) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === item.id
          ? {
              ...r,
              status: "Awaiting Evidence",
              immutableLogs: [...r.immutableLogs, `Evidence requested from ${item.requestFrom} • 17 Mar 2026`],
            }
          : r
      )
    );

    if (selectedCase?.id === item.id) {
      setSelectedCase((prev) => ({
        ...prev,
        status: "Awaiting Evidence",
        immutableLogs: [...prev.immutableLogs, `Evidence requested from ${item.requestFrom} • 17 Mar 2026`],
      }));
    }

    setModal(null);
  };

  const handleReinspectConfirm = (item) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === item.id
          ? {
              ...r,
              status: "Re-Inspection Ordered",
              immutableLogs: [...r.immutableLogs, `Re-inspection ordered • 17 Mar 2026`],
            }
          : r
      )
    );

    if (selectedCase?.id === item.id) {
      setSelectedCase((prev) => ({
        ...prev,
        status: "Re-Inspection Ordered",
        immutableLogs: [...prev.immutableLogs, `Re-inspection ordered • 17 Mar 2026`],
      }));
    }

    setModal(null);
  };

  const handleRefundConfirm = (item) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === item.id
          ? {
              ...r,
              immutableLogs: [...r.immutableLogs, `Refund ₹${item.amount} issued to ${item.refundTo} • 17 Mar 2026`],
            }
          : r
      )
    );

    if (selectedCase?.id === item.id) {
      setSelectedCase((prev) => ({
        ...prev,
        immutableLogs: [...prev.immutableLogs, `Refund ₹${item.amount} issued to ${item.refundTo} • 17 Mar 2026`],
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
              immutableLogs: [...r.immutableLogs, `Penalty applied: ${item.penalty} • 17 Mar 2026`],
            }
          : r
      )
    );

    if (selectedCase?.id === item.id) {
      setSelectedCase((prev) => ({
        ...prev,
        immutableLogs: [...prev.immutableLogs, `Penalty applied: ${item.penalty} • 17 Mar 2026`],
      }));
    }

    setModal(null);
  };

  const handleCloseConfirm = (item) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === item.id
          ? {
              ...r,
              status: "Resolved",
              immutableLogs: [...r.immutableLogs, `Case closed: ${item.resolution} • 17 Mar 2026`],
            }
          : r
      )
    );

    if (selectedCase?.id === item.id) {
      setSelectedCase((prev) => ({
        ...prev,
        status: "Resolved",
        immutableLogs: [...prev.immutableLogs, `Case closed: ${item.resolution} • 17 Mar 2026`],
      }));
    }

    setModal(null);
  };

  const handleEscalateConfirm = (item) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === item.id
          ? {
              ...r,
              status: "Escalated",
              immutableLogs: [...r.immutableLogs, `Escalated to Legal • 17 Mar 2026`],
            }
          : r
      )
    );

    if (selectedCase?.id === item.id) {
      setSelectedCase((prev) => ({
        ...prev,
        status: "Escalated",
        immutableLogs: [...prev.immutableLogs, `Escalated to Legal • 17 Mar 2026`],
      }));
    }

    setModal(null);
  };

  return (
    <div className="min-h-screen p-0">
      <style>{`
        .table-scroll::-webkit-scrollbar { height: 6px; }
        .table-scroll::-webkit-scrollbar-track { background: transparent; }
        .table-scroll::-webkit-scrollbar-thumb { background: rgba(148,163,184,0.35); border-radius: 6px; }
        .table-scroll::-webkit-scrollbar-thumb:hover { background: rgba(100,116,139,0.45); }
      `}</style>

      <div className="mx-auto space-y-6">
        <section className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
              Inspection Disputes
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-500">
              Manage inspection-related disputes, resolve trust issues, order re-inspections,
              control refunds, and maintain marketplace credibility.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
          <TopCard title="Open" value={summary.open} icon={ClipboardList} active={quickFilter === "open"} onClick={() => setQuickFilter("open")} />
          <TopCard title="Under Investigation" value={summary.investigating} icon={Search} active={quickFilter === "investigating"} onClick={() => setQuickFilter("investigating")} />
          <TopCard title="Awaiting Evidence" value={summary.evidence} icon={FileSearch} active={quickFilter === "evidence"} onClick={() => setQuickFilter("evidence")} />
          <TopCard title="Resolved" value={summary.resolved} icon={CheckCircle2} active={quickFilter === "resolved"} onClick={() => setQuickFilter("resolved")} />
          <TopCard title="Escalated" value={summary.escalated} icon={Scale} active={quickFilter === "escalated"} onClick={() => setQuickFilter("escalated")} />
          <TopCard title="Re-Inspection Ordered" value={summary.reinspect} icon={RotateCcw} active={quickFilter === "reinspect"} onClick={() => setQuickFilter("reinspect")} />
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
                  placeholder="Search by Dispute ID, Vehicle ID, Report ID, Buyer ID, Consultant, Inspector..."
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

                <button
                  onClick={handleClear}
                  className="inline-flex h-11 items-center justify-center w-11 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                  title="Clear"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {filtersOpen && (
              <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-200 pt-5 md:grid-cols-2 xl:grid-cols-6">
                <div className="flex items-center justify-between col-span-full mb-2">
                  <h4 className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">
                    Advanced Filters
                  </h4>
                  <button
                    onClick={handleClear}
                    className="text-[12px] text-sky-700 hover:text-sky-800 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>

                <select
                  value={filters.disputeType}
                  onChange={(e) => setFilters((p) => ({ ...p, disputeType: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">Dispute Type</option>
                  {DISPUTE_TYPES.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <select
                  value={filters.raisedBy}
                  onChange={(e) => setFilters((p) => ({ ...p, raisedBy: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">Raised By</option>
                  {RAISED_BY_OPTIONS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <select
                  value={filters.status}
                  onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">Status</option>
                  {STATUS_OPTIONS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <select
                  value={filters.severity}
                  onChange={(e) => setFilters((p) => ({ ...p, severity: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">Severity</option>
                  {SEVERITY_OPTIONS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <select
                  value={filters.refundRequested}
                  onChange={(e) => setFilters((p) => ({ ...p, refundRequested: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">Refund Requested</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>

                <select
                  value={filters.city}
                  onChange={(e) => setFilters((p) => ({ ...p, city: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">City</option>
                  {uniqueCities.map((city) => (
                    <option key={city}>{city}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="w-full overflow-x-auto table-scroll relative z-10 pb-4">
            <table className="min-w-[1500px] w-full border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Dispute ID</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Vehicle</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Raised By</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Against</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Type</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Severity</th>
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
                            <ClipboardList className="h-4 w-4 text-sky-700" />
                          </div>
                          <div>
                            <div className="text-[14px] font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                              {row.id}
                            </div>
                            <div className="mt-0.5 text-[12px] text-slate-500">{row.reportId}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="min-w-[220px]">
                          <div className="text-[13px] font-medium text-slate-700">{row.vehicle}</div>
                          <div className="mt-1 text-[12px] text-slate-500">{row.vehicleId}</div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="min-w-[160px]">
                          <div className="text-[13px] font-medium text-slate-700">{row.raisedByName}</div>
                          <div className="mt-1">
                            <span className={cls("inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border", raisedByBadge(row.raisedBy))}>
                              {row.raisedBy}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-[13px] font-medium text-slate-500">
                        {row.against} • {row.againstName}
                      </td>

                      <td className="px-5 py-4 text-[13px] font-medium text-slate-500">
                        {row.disputeType}
                      </td>

                      <td className="px-5 py-4">
                        <span className={cls("inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap", severityBadge(row.severity))}>
                          {row.severity}
                        </span>
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
                        <DisputeRowActions
                          item={row}
                          onView={setSelectedCase}
                          onAssign={(item) => setModal({ type: "assign", item })}
                          onEvidence={(item) => setModal({ type: "evidence", item })}
                          onReinspect={(item) => setModal({ type: "reinspect", item })}
                          onRefund={(item) => setModal({ type: "refund", item })}
                          onPenalty={(item) => setModal({ type: "penalty", item })}
                          onCloseCase={(item) => setModal({ type: "close", item })}
                          onEscalate={(item) => setModal({ type: "escalate", item })}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-28 text-center">
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
                        {(search || Object.values(filters).some(Boolean) || quickFilter !== "all") && (
                          <button
                            onClick={handleClear}
                            className="mt-6 px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 transition-colors"
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
      </div>

      <DisputeCaseDrawer
        item={selectedCase}
        onClose={() => setSelectedCase(null)}
        onAssign={(item) => setModal({ type: "assign", item })}
        onReinspect={(item) => setModal({ type: "reinspect", item })}
        onRefund={(item) => setModal({ type: "refund", item })}
        onPenalty={(item) => setModal({ type: "penalty", item })}
        onCloseCase={(item) => setModal({ type: "close", item })}
        onEvidence={(item) => setModal({ type: "evidence", item })}
      />

      <AssignManagerModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleAssignConfirm}
      />

      <EvidenceModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleEvidenceConfirm}
      />

      <ReinspectionModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleReinspectConfirm}
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

      <CloseCaseModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleCloseConfirm}
      />

      <EscalateLegalModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleEscalateConfirm}
      />
    </div>
  );
};

export default Disputes;