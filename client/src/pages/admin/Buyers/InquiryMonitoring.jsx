import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  RefreshCw,
  MoreHorizontal,
  Eye,
  AlertTriangle,
  ShieldAlert,
  Lock,
  Flag,
  NotebookPen,
  X,
  MessageSquare,
  Clock3,
  Car,
  User,
  Users,
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Zap,
} from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

/* =========================================================
   DUMMY DATA
========================================================= */
const DUMMY_INQUIRIES = [
  {
    id: "INQ-1001",
    vehicle: "Hyundai Creta SX 2021",
    buyer: "Arjun Mehta",
    buyerId: "USR-10231",
    consultant: "Metro Auto Hub",
    consultantId: "CON-301",
    tier: "Premium",
    boosted: true,
    created: "10 Mar 2026, 09:20 AM",
    createdMinutesAgo: 34,
    status: "Chat Initiated",
    responseTime: "8m",
    risk: "Low",
    city: "Ahmedabad",
    inspectionRequested: true,
    buyerRisk: "Low",
    consultantRisk: "Low",
    assignedTo: "",
    alerts: ["Boosted lead"],
    chat: [
      {
        from: "Buyer",
        text: "Hi, is this Creta still available?",
        time: "09:21 AM",
        type: "buyer",
      },
      {
        from: "Consultant",
        text: "Yes, available. Would you like inspection details?",
        time: "09:29 AM",
        type: "consultant",
      },
    ],
    buyerSnapshot: {
      riskScore: "28/100",
      totalInquiries: 64,
      suspensionHistory: "None",
      pattern: "Normal browsing pattern",
    },
    consultantSnapshot: {
      tier: "Premium",
      avgResponseTime: "11m",
      conversion: "14%",
      disputes: 1,
      rankingScore: 88,
      boostActive: true,
    },
    responseAnalysis: {
      firstResponse: "8m",
      avgDelay: "6m",
      messageCount: 5,
      followUpPattern: "Healthy",
      slaBreached: false,
    },
  },
  {
    id: "INQ-1002",
    vehicle: "Tata Nexon XZ+ 2022",
    buyer: "Priya Shah",
    buyerId: "USR-10232",
    consultant: "City Drive",
    consultantId: "CON-401",
    tier: "Pro",
    boosted: false,
    created: "10 Mar 2026, 07:10 AM",
    createdMinutesAgo: 168,
    status: "No Response",
    responseTime: "2h 48m",
    risk: "Moderate",
    city: "Surat",
    inspectionRequested: false,
    buyerRisk: "Moderate",
    consultantRisk: "Moderate",
    assignedTo: "",
    alerts: ["Consultant delay"],
    chat: [
      {
        from: "Buyer",
        text: "Need mileage details and loan eligibility.",
        time: "07:11 AM",
        type: "buyer",
      },
      {
        from: "System",
        text: "No consultant response for more than 2 hours.",
        time: "09:15 AM",
        type: "system",
      },
    ],
    buyerSnapshot: {
      riskScore: "46/100",
      totalInquiries: 112,
      suspensionHistory: "Under Review once",
      pattern: "High inquiry frequency",
    },
    consultantSnapshot: {
      tier: "Pro",
      avgResponseTime: "2h 10m",
      conversion: "8%",
      disputes: 3,
      rankingScore: 63,
      boostActive: false,
    },
    responseAnalysis: {
      firstResponse: "Pending",
      avgDelay: "2h+",
      messageCount: 1,
      followUpPattern: "Weak",
      slaBreached: true,
    },
  },
  {
    id: "INQ-1003",
    vehicle: "Honda City ZX 2022",
    buyer: "Sneha Verma",
    buyerId: "USR-10234",
    consultant: "Elite Motors",
    consultantId: "CON-220",
    tier: "Premium",
    boosted: true,
    created: "10 Mar 2026, 08:02 AM",
    createdMinutesAgo: 116,
    status: "Suspicious",
    responseTime: "3m",
    risk: "High",
    city: "Rajkot",
    inspectionRequested: true,
    buyerRisk: "High",
    consultantRisk: "Moderate",
    assignedTo: "Fraud Team",
    alerts: ["Phone detected", "Boosted lead", "Suspicious pattern"],
    chat: [
      {
        from: "Buyer",
        text: "Send your number, we’ll deal outside.",
        time: "08:04 AM",
        type: "buyer",
      },
      {
        from: "System",
        text: "Phone number / external deal attempt detected.",
        time: "08:04 AM",
        type: "system",
      },
      {
        from: "Consultant",
        text: "Please continue within platform chat.",
        time: "08:07 AM",
        type: "consultant",
      },
    ],
    buyerSnapshot: {
      riskScore: "81/100",
      totalInquiries: 143,
      suspensionHistory: "1 temporary suspension",
      pattern: "Burst inquiries and risky chat content",
    },
    consultantSnapshot: {
      tier: "Premium",
      avgResponseTime: "9m",
      conversion: "11%",
      disputes: 2,
      rankingScore: 79,
      boostActive: true,
    },
    responseAnalysis: {
      firstResponse: "3m",
      avgDelay: "4m",
      messageCount: 8,
      followUpPattern: "Risky",
      slaBreached: false,
    },
  },
  {
    id: "INQ-1004",
    vehicle: "Mahindra Scorpio N Z8 2023",
    buyer: "Faizan Khan",
    buyerId: "USR-10235",
    consultant: "Torque Wheels",
    consultantId: "CON-550",
    tier: "Pro",
    boosted: false,
    created: "10 Mar 2026, 10:05 AM",
    createdMinutesAgo: 5,
    status: "New",
    responseTime: "Pending",
    risk: "Low",
    city: "Ahmedabad",
    inspectionRequested: false,
    buyerRisk: "Low",
    consultantRisk: "Low",
    assignedTo: "",
    alerts: [],
    chat: [
      {
        from: "Buyer",
        text: "Interested in test drive tomorrow.",
        time: "10:05 AM",
        type: "buyer",
      },
    ],
    buyerSnapshot: {
      riskScore: "25/100",
      totalInquiries: 77,
      suspensionHistory: "None",
      pattern: "Normal",
    },
    consultantSnapshot: {
      tier: "Pro",
      avgResponseTime: "18m",
      conversion: "10%",
      disputes: 0,
      rankingScore: 82,
      boostActive: false,
    },
    responseAnalysis: {
      firstResponse: "Pending",
      avgDelay: "Pending",
      messageCount: 1,
      followUpPattern: "Too early",
      slaBreached: false,
    },
  },
  {
    id: "INQ-1005",
    vehicle: "Kia Seltos GTX 2020",
    buyer: "Rohan Desai",
    buyerId: "USR-10240",
    consultant: "Prime Wheels",
    consultantId: "CON-119",
    tier: "Premium",
    boosted: true,
    created: "10 Mar 2026, 06:20 AM",
    createdMinutesAgo: 218,
    status: "Escalated",
    responseTime: "1h 55m",
    risk: "Moderate",
    city: "Vadodara",
    inspectionRequested: true,
    buyerRisk: "Low",
    consultantRisk: "Moderate",
    assignedTo: "Ops Manager",
    alerts: ["Escalated", "Boosted lead unanswered"],
    chat: [
      {
        from: "Buyer",
        text: "Can you share full service history?",
        time: "06:21 AM",
        type: "buyer",
      },
      {
        from: "System",
        text: "Escalated due to premium SLA breach.",
        time: "08:30 AM",
        type: "system",
      },
    ],
    buyerSnapshot: {
      riskScore: "31/100",
      totalInquiries: 26,
      suspensionHistory: "None",
      pattern: "Serious buyer",
    },
    consultantSnapshot: {
      tier: "Premium",
      avgResponseTime: "1h 35m",
      conversion: "12%",
      disputes: 2,
      rankingScore: 71,
      boostActive: true,
    },
    responseAnalysis: {
      firstResponse: "1h 55m",
      avgDelay: "48m",
      messageCount: 2,
      followUpPattern: "Delayed consultant response",
      slaBreached: true,
    },
  },
];

const STATUS_OPTIONS = [
  "New",
  "Chat Initiated",
  "No Response",
  "Buyer Inactive",
  "Escalated",
  "Closed",
  "Converted",
  "Suspicious",
];
const RISK_OPTIONS = ["Low", "Moderate", "High"];
const TIER_OPTIONS = ["Basic", "Pro", "Premium"];

/* =========================================================
   BADGES
========================================================= */
const statusBadge = (status) => {
  const map = {
    New: "bg-sky-50 text-sky-700 border-sky-200",
    "Chat Initiated": "bg-indigo-50 text-indigo-700 border-indigo-200",
    "No Response": "bg-amber-50 text-amber-700 border-amber-200",
    "Buyer Inactive": "bg-slate-100 text-slate-700 border-slate-200",
    Escalated: "bg-orange-50 text-orange-700 border-orange-200",
    Closed: "bg-slate-100 text-slate-700 border-slate-200",
    Converted: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Suspicious: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return map[status] || "bg-slate-50 text-slate-700 border-slate-200";
};

const riskBadge = (risk) => {
  const map = {
    Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Moderate: "bg-amber-50 text-amber-700 border-amber-200",
    High: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return map[risk] || "bg-slate-50 text-slate-700 border-slate-200";
};

const tierBadge = (tier) => {
  if (tier === "Premium") return "bg-violet-50 text-violet-700 border-violet-200";
  if (tier === "Pro") return "bg-sky-50 text-sky-700 border-sky-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
};

const boostedBadge = (boosted) =>
  boosted
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : "bg-slate-100 text-slate-700 border-slate-200";

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
      <div
        className={cls(
          "absolute inset-0 opacity-0 transition-opacity",
          !active && "bg-gradient-to-br from-sky-50 to-transparent group-hover:opacity-100"
        )}
      />
      <div className="relative z-10 flex items-end justify-between">
        <div>
          <div
            className={cls(
              "text-[12px] font-bold uppercase tracking-[0.15em] mb-2",
              active ? "text-sky-100" : "text-slate-400"
            )}
          >
            {title}
          </div>
          <div className="text-3xl font-extrabold tracking-tight">{value}</div>
        </div>
        <div
          className={cls(
            "w-10 h-10 rounded-xl flex items-center justify-center border transition-colors",
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

function MiniMetric({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
        {title}
      </div>
      <div className="mt-1 text-xl font-bold text-slate-900">{value}</div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.08em] text-slate-400">{label}</div>
      <div className="mt-1 font-medium text-slate-900">{value}</div>
    </div>
  );
}

/* =========================================================
   ROW ACTIONS
========================================================= */
function InquiryRowActions({
  item,
  onView,
  onEscalate,
  onSuspicious,
  onClose,
  onFreeze,
  onPenalize,
  onFlagBuyer,
  onNote,
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
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Eye className="h-4 w-4 text-slate-500" />
            View Full Conversation
          </button>

          <button
            onClick={() => {
              onEscalate(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-orange-700 hover:bg-orange-50 transition-colors"
          >
            <AlertTriangle className="h-4 w-4" />
            Escalate
          </button>

          <button
            onClick={() => {
              onSuspicious(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-rose-700 hover:bg-rose-50 transition-colors"
          >
            <ShieldAlert className="h-4 w-4" />
            Mark Suspicious
          </button>

          <button
            onClick={() => {
              onClose(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <X className="h-4 w-4" />
            Close Inquiry
          </button>

          <button
            onClick={() => {
              onFreeze(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-sky-700 hover:bg-sky-50 transition-colors"
          >
            <Lock className="h-4 w-4" />
            Freeze Chat
          </button>

          <button
            onClick={() => {
              onPenalize(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-amber-700 hover:bg-amber-50 transition-colors"
          >
            <Zap className="h-4 w-4" />
            Penalize Consultant
          </button>

          <button
            onClick={() => {
              onFlagBuyer(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-violet-700 hover:bg-violet-50 transition-colors"
          >
            <Flag className="h-4 w-4" />
            Flag Buyer
          </button>

          <div className="my-1 border-t border-slate-100" />

          <button
            onClick={() => {
              onNote(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <NotebookPen className="h-4 w-4 text-slate-500" />
            Add Internal Note
          </button>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   DRAWER
========================================================= */
function InquiryDetailDrawer({
  item,
  onClose,
  onEscalate,
  onFreeze,
  onCloseInquiry,
  onPenalize,
}) {
  if (!item) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-[640px] border-l border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 bg-slate-50">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{item.id}</h3>
            <p className="mt-1 text-sm text-slate-500">{item.vehicle}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span
                className={cls(
                  "inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold border",
                  statusBadge(item.status)
                )}
              >
                {item.status}
              </span>
              <span
                className={cls(
                  "inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold border",
                  riskBadge(item.risk)
                )}
              >
                {item.risk} Risk
              </span>
              <span
                className={cls(
                  "inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold border",
                  tierBadge(item.tier)
                )}
              >
                {item.tier}
              </span>
              <span
                className={cls(
                  "inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold border",
                  boostedBadge(item.boosted)
                )}
              >
                {item.boosted ? "Boosted Lead" : "Non-Boosted"}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="h-[calc(100vh-96px)] overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-3">
            <MiniMetric title="Buyer" value={item.buyer} />
            <MiniMetric title="Consultant" value={item.consultant} />
            <MiniMetric title="Created At" value={item.created} />
            <MiniMetric
              title="SLA Status"
              value={item.responseAnalysis.slaBreached ? "Breached" : "Within SLA"}
            />
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
              Chat Timeline
            </h4>

            <div className="mt-4 space-y-3">
              {item.chat.map((message, idx) => (
                <div
                  key={idx}
                  className={cls(
                    "rounded-xl border px-4 py-3",
                    message.type === "buyer" && "border-sky-200 bg-sky-50 text-sky-900",
                    message.type === "consultant" &&
                      "border-emerald-200 bg-emerald-50 text-emerald-900",
                    message.type === "system" &&
                      "border-amber-200 bg-amber-50 text-amber-900"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-bold">{message.from}</div>
                    <div className="text-xs opacity-70">{message.time}</div>
                  </div>
                  <div className="mt-2 text-sm leading-6">{message.text}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
              Response Analysis
            </h4>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <MiniMetric title="First Response" value={item.responseAnalysis.firstResponse} />
              <MiniMetric title="Avg Delay" value={item.responseAnalysis.avgDelay} />
              <MiniMetric title="Message Count" value={item.responseAnalysis.messageCount} />
              <MiniMetric
                title="Follow-up Pattern"
                value={item.responseAnalysis.followUpPattern}
              />
            </div>

            {item.responseAnalysis.slaBreached && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                Consultant breached SLA.
              </div>
            )}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
                Buyer Snapshot
              </h4>

              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <InfoRow label="Risk Score" value={item.buyerSnapshot.riskScore} />
                <InfoRow label="Total Inquiries" value={item.buyerSnapshot.totalInquiries} />
                <InfoRow
                  label="Suspension History"
                  value={item.buyerSnapshot.suspensionHistory}
                />
                <InfoRow label="Pattern" value={item.buyerSnapshot.pattern} />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
                Consultant Snapshot
              </h4>

              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <InfoRow label="Tier" value={item.consultantSnapshot.tier} />
                <InfoRow
                  label="Avg Response"
                  value={item.consultantSnapshot.avgResponseTime}
                />
                <InfoRow label="Conversion %" value={item.consultantSnapshot.conversion} />
                <InfoRow label="Disputes" value={item.consultantSnapshot.disputes} />
                <InfoRow label="Ranking Score" value={item.consultantSnapshot.rankingScore} />
                <InfoRow
                  label="Boost Active"
                  value={item.consultantSnapshot.boostActive ? "Yes" : "No"}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <button
              onClick={() => onEscalate(item)}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-[13px] font-semibold text-white hover:bg-orange-700"
            >
              <AlertTriangle className="h-4 w-4" />
              Escalate
            </button>

            <button
              onClick={() => onFreeze(item)}
              className="inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-[13px] font-semibold text-sky-700 hover:bg-sky-100"
            >
              <Lock className="h-4 w-4" />
              Freeze Chat
            </button>

            <button
              onClick={() => onPenalize(item)}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] font-semibold text-amber-700 hover:bg-amber-100"
            >
              <Zap className="h-4 w-4" />
              Apply Penalty
            </button>

            <button
              onClick={() => onCloseInquiry(item)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] font-semibold text-slate-700 hover:bg-slate-50"
            >
              <X className="h-4 w-4" />
              Close
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
function EscalateModal({ modal, onClose, onConfirm }) {
  const [reason, setReason] = useState("Consultant non-response");
  const [assignTo, setAssignTo] = useState("Ops Manager");

  useEffect(() => {
    if (modal?.type === "escalate") {
      setReason("Consultant non-response");
      setAssignTo("Ops Manager");
    }
  }, [modal]);

  if (!modal || modal.type !== "escalate") return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[61] w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Escalate Inquiry</h3>
            <p className="mt-1 text-[13px] text-slate-500">{modal.item.id}</p>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-[13px] font-medium text-slate-700">Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-slate-900 text-[13px]"
            >
              <option>Consultant non-response</option>
              <option>Buyer abuse</option>
              <option>Fraud suspicion</option>
              <option>Payment outside attempt</option>
              <option>Inspection dispute</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-medium text-slate-700">Assign to</label>
            <select
              value={assignTo}
              onChange={(e) => setAssignTo(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-slate-900 text-[13px]"
            >
              <option>Ops Manager</option>
              <option>Fraud Team</option>
              <option>Customer Support</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onConfirm({
                ...modal.item,
                escalateReason: reason,
                assignTo,
              })
            }
            className="rounded-xl bg-orange-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-orange-700 transition-colors"
          >
            Confirm Escalate
          </button>
        </div>
      </div>
    </>
  );
}

function FreezeModal({ modal, onClose, onConfirm }) {
  const [reason, setReason] = useState("Abuse");
  const [duration, setDuration] = useState("Temporary");

  useEffect(() => {
    if (modal?.type === "freeze") {
      setReason("Abuse");
      setDuration("Temporary");
    }
  }, [modal]);

  if (!modal || modal.type !== "freeze") return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[61] w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Freeze Chat</h3>
            <p className="mt-1 text-[13px] text-slate-500">{modal.item.id}</p>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-[13px] font-medium text-slate-700">Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-slate-900 text-[13px]"
            >
              <option>Abuse</option>
              <option>Fraud</option>
              <option>External deal attempt</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-medium text-slate-700">Duration</label>
            <div className="grid grid-cols-2 gap-3">
              {["Temporary", "Permanent"].map((item) => (
                <button
                  key={item}
                  onClick={() => setDuration(item)}
                  className={cls(
                    "rounded-xl border px-4 py-2.5 text-[13px] font-semibold transition-all",
                    duration === item
                      ? "border-sky-300 bg-sky-50 text-sky-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onConfirm({
                ...modal.item,
                freezeReason: reason,
                freezeDuration: duration,
              })
            }
            className="rounded-xl bg-sky-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-sky-700 transition-colors"
          >
            Confirm Freeze
          </button>
        </div>
      </div>
    </>
  );
}

function SuspiciousModal({ modal, onClose, onConfirm }) {
  const [reason, setReason] = useState("Fake lead");

  useEffect(() => {
    if (modal?.type === "suspicious") setReason("Fake lead");
  }, [modal]);

  if (!modal || modal.type !== "suspicious") return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[61] w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Mark Suspicious</h3>
            <p className="mt-1 text-[13px] text-slate-500">{modal.item.id}</p>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-[13px] font-medium text-slate-700">Reason</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-slate-900 text-[13px]"
          >
            <option>Fake lead</option>
            <option>Inquiry farming</option>
            <option>Bot activity</option>
            <option>Consultant manipulation</option>
          </select>
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onConfirm({
                ...modal.item,
                suspiciousReason: reason,
              })
            }
            className="rounded-xl bg-rose-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-rose-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </>
  );
}

function CloseInquiryModal({ modal, onClose, onConfirm }) {
  const [outcome, setOutcome] = useState("No Deal");
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (modal?.type === "close") {
      setOutcome("No Deal");
      setComment("");
    }
  }, [modal]);

  if (!modal || modal.type !== "close") return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[61] w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Close Inquiry</h3>
            <p className="mt-1 text-[13px] text-slate-500">{modal.item.id}</p>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-[13px] font-medium text-slate-700">Outcome</label>
            <select
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-slate-900 text-[13px]"
            >
              <option>No Deal</option>
              <option>Converted</option>
              <option>Cancelled</option>
              <option>Invalid</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-medium text-slate-700">Comment</label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter comment..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-slate-900 text-[13px]"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onConfirm({
                ...modal.item,
                closeOutcome: outcome,
                closeComment: comment,
              })
            }
            className="rounded-xl bg-slate-900 px-4 py-2 text-[13px] font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            Confirm Close
          </button>
        </div>
      </div>
    </>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */
const InquiryMonitoring = () => {
  const [rows, setRows] = useState(DUMMY_INQUIRIES);
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [quickFilter, setQuickFilter] = useState("all");
  const [filters, setFilters] = useState({
    status: "",
    consultantTier: "",
    boosted: "",
    risk: "",
    inspectionRequested: "",
    buyerRisk: "",
    consultantRisk: "",
    city: "",
  });

  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [modal, setModal] = useState(null);

  const uniqueCities = useMemo(() => [...new Set(rows.map((r) => r.city))], [rows]);

  const liveSummary = useMemo(() => {
    return {
      inquiriesToday: rows.length,
      activeChats: rows.filter((r) => r.status === "Chat Initiated").length,
      unanswered2h: rows.filter((r) => r.createdMinutesAgo > 120 && r.status === "No Response")
        .length,
      escalated: rows.filter((r) => r.status === "Escalated").length,
      suspicious: rows.filter((r) => r.status === "Suspicious").length,
      boostedLeads: rows.filter((r) => r.boosted).length,
    };
  }, [rows]);

  const filteredRows = useMemo(() => {
    let data = [...rows];

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.buyerId.toLowerCase().includes(q) ||
          r.consultant.toLowerCase().includes(q) ||
          r.vehicle.toLowerCase().includes(q) ||
          r.city.toLowerCase().includes(q) ||
          r.buyer.toLowerCase().includes(q)
      );
    }

    if (filters.status) data = data.filter((r) => r.status === filters.status);
    if (filters.consultantTier) data = data.filter((r) => r.tier === filters.consultantTier);
    if (filters.boosted) {
      data = data.filter((r) => (filters.boosted === "Yes" ? r.boosted : !r.boosted));
    }
    if (filters.risk) data = data.filter((r) => r.risk === filters.risk);
    if (filters.inspectionRequested) {
      data = data.filter((r) =>
        filters.inspectionRequested === "Yes"
          ? r.inspectionRequested
          : !r.inspectionRequested
      );
    }
    if (filters.buyerRisk) data = data.filter((r) => r.buyerRisk === filters.buyerRisk);
    if (filters.consultantRisk)
      data = data.filter((r) => r.consultantRisk === filters.consultantRisk);
    if (filters.city) data = data.filter((r) => r.city === filters.city);

    if (quickFilter === "active")
      data = data.filter((r) => r.status === "Chat Initiated");
    if (quickFilter === "unanswered")
      data = data.filter((r) => r.createdMinutesAgo > 120 && r.status === "No Response");
    if (quickFilter === "escalated") data = data.filter((r) => r.status === "Escalated");
    if (quickFilter === "suspicious") data = data.filter((r) => r.status === "Suspicious");
    if (quickFilter === "boosted") data = data.filter((r) => r.boosted);

    return data;
  }, [rows, search, filters, quickFilter]);

  const handleRefresh = () => setRows([...DUMMY_INQUIRIES]);

  const handleClear = () => {
    setSearch("");
    setQuickFilter("all");
    setFilters({
      status: "",
      consultantTier: "",
      boosted: "",
      risk: "",
      inspectionRequested: "",
      buyerRisk: "",
      consultantRisk: "",
      city: "",
    });
    setFiltersOpen(false);
  };

  const handleEscalateConfirm = (item) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === item.id
          ? { ...r, status: "Escalated", assignedTo: item.assignTo, risk: "High" }
          : r
      )
    );

    if (selectedInquiry?.id === item.id) {
      setSelectedInquiry((prev) => ({
        ...prev,
        status: "Escalated",
        assignedTo: item.assignTo,
        risk: "High",
      }));
    }

    setModal(null);
  };

  const handleFreezeConfirm = (item) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === item.id ? { ...r, status: "Escalated", risk: "High" } : r
      )
    );

    if (selectedInquiry?.id === item.id) {
      setSelectedInquiry((prev) => ({
        ...prev,
        status: "Escalated",
        risk: "High",
      }));
    }

    setModal(null);
  };

  const handleSuspiciousConfirm = (item) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === item.id ? { ...r, status: "Suspicious", risk: "High" } : r
      )
    );

    if (selectedInquiry?.id === item.id) {
      setSelectedInquiry((prev) => ({
        ...prev,
        status: "Suspicious",
        risk: "High",
      }));
    }

    setModal(null);
  };

  const handleCloseConfirm = (item) => {
    const nextStatus = item.closeOutcome === "Converted" ? "Converted" : "Closed";

    setRows((prev) =>
      prev.map((r) => (r.id === item.id ? { ...r, status: nextStatus } : r))
    );

    if (selectedInquiry?.id === item.id) {
      setSelectedInquiry((prev) => ({
        ...prev,
        status: nextStatus,
      }));
    }

    setModal(null);
  };

  const handlePenalize = (item) => {
    alert(`Penalize consultant for ${item.id}`);
  };

  const handleFlagBuyer = (item) => {
    alert(`Flag buyer for ${item.id}`);
  };

  const handleNote = (item) => {
    alert(`Add internal note for ${item.id}`);
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
              Inquiry Monitoring
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-500">
              Monitor inquiry flow, consultant response behavior, suspicious chat activity,
              and SLA-based escalations in one place.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
          <TopCard
            title="Inquiries Today"
            value={liveSummary.inquiriesToday}
            icon={BarChart3}
            active={quickFilter === "all"}
            onClick={() => setQuickFilter("all")}
          />
          <TopCard
            title="Active Chats"
            value={liveSummary.activeChats}
            icon={MessageSquare}
            active={quickFilter === "active"}
            onClick={() => setQuickFilter("active")}
          />
          <TopCard
            title="Unanswered > 2h"
            value={liveSummary.unanswered2h}
            icon={Clock3}
            active={quickFilter === "unanswered"}
            onClick={() => setQuickFilter("unanswered")}
          />
          <TopCard
            title="Escalated"
            value={liveSummary.escalated}
            icon={AlertTriangle}
            active={quickFilter === "escalated"}
            onClick={() => setQuickFilter("escalated")}
          />
          <TopCard
            title="Suspicious"
            value={liveSummary.suspicious}
            icon={ShieldAlert}
            active={quickFilter === "suspicious"}
            onClick={() => setQuickFilter("suspicious")}
          />
          <TopCard
            title="Boosted Leads"
            value={liveSummary.boostedLeads}
            icon={TrendingUp}
            active={quickFilter === "boosted"}
            onClick={() => setQuickFilter("boosted")}
          />
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
                  placeholder="Search by Inquiry ID, Buyer ID, Consultant, Vehicle, City..."
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
              <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-200 pt-5 md:grid-cols-2 xl:grid-cols-8">
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
                  value={filters.consultantTier}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, consultantTier: e.target.value }))
                  }
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">Consultant Tier</option>
                  {TIER_OPTIONS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <select
                  value={filters.boosted}
                  onChange={(e) => setFilters((p) => ({ ...p, boosted: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">Boosted</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>

                <select
                  value={filters.risk}
                  onChange={(e) => setFilters((p) => ({ ...p, risk: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">Risk</option>
                  {RISK_OPTIONS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <select
                  value={filters.inspectionRequested}
                  onChange={(e) =>
                    setFilters((p) => ({
                      ...p,
                      inspectionRequested: e.target.value,
                    }))
                  }
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">Inspection Req</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>

                <select
                  value={filters.buyerRisk}
                  onChange={(e) => setFilters((p) => ({ ...p, buyerRisk: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">Buyer Risk</option>
                  {RISK_OPTIONS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <select
                  value={filters.consultantRisk}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, consultantRisk: e.target.value }))
                  }
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">Consultant Risk</option>
                  {RISK_OPTIONS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
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
            <table className="min-w-[1600px] w-full border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Inquiry ID</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Vehicle</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Buyer</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Consultant</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Tier</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Boosted</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Created</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Status</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Response Time</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Risk</th>
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
                        selectedInquiry?.id === row.id && "bg-sky-50"
                      )}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-100 to-blue-100 border border-slate-200 flex items-center justify-center shrink-0">
                            <span className="text-[13px] font-bold text-sky-700">
                              {row.id.split("-")[1]}
                            </span>
                          </div>
                          <div>
                            <div className="text-[14px] font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                              {row.id}
                            </div>
                            <div className="mt-0.5 text-[12px] text-slate-500">{row.city}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="min-w-[230px]">
                          <div className="text-[13px] font-medium text-slate-700">
                            {row.vehicle}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1 min-w-[160px]">
                          <span className="text-[13px] font-medium text-slate-700">{row.buyer}</span>
                          <span className="text-[12px] text-slate-500">{row.buyerId}</span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1 min-w-[170px]">
                          <span className="text-[13px] font-medium text-slate-700">
                            {row.consultant}
                          </span>
                          <span className="text-[12px] text-slate-500">{row.consultantId}</span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={cls(
                            "inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap",
                            tierBadge(row.tier)
                          )}
                        >
                          {row.tier}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={cls(
                            "inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap",
                            boostedBadge(row.boosted)
                          )}
                        >
                          {row.boosted ? "Yes" : "No"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-[13px] font-medium text-slate-500 whitespace-nowrap">
                        {row.created}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={cls(
                            "inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap flex items-center gap-1.5",
                            statusBadge(row.status)
                          )}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                          {row.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="inline-flex items-center justify-center min-w-[62px] h-8 rounded-lg bg-slate-50 text-[13px] font-semibold text-slate-700 border border-slate-200 px-2">
                          {row.responseTime}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={cls(
                            "inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap",
                            riskBadge(row.risk)
                          )}
                        >
                          {row.risk}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <InquiryRowActions
                          item={row}
                          onView={setSelectedInquiry}
                          onEscalate={(item) => setModal({ type: "escalate", item })}
                          onSuspicious={(item) => setModal({ type: "suspicious", item })}
                          onClose={(item) => setModal({ type: "close", item })}
                          onFreeze={(item) => setModal({ type: "freeze", item })}
                          onPenalize={handlePenalize}
                          onFlagBuyer={handleFlagBuyer}
                          onNote={handleNote}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="px-6 py-28 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-4">
                          <Search size={28} />
                        </div>
                        <div className="text-lg font-bold text-slate-900 tracking-tight">
                          No inquiries found
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

      <InquiryDetailDrawer
        item={selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        onEscalate={(item) => setModal({ type: "escalate", item })}
        onFreeze={(item) => setModal({ type: "freeze", item })}
        onCloseInquiry={(item) => setModal({ type: "close", item })}
        onPenalize={handlePenalize}
      />

      <EscalateModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleEscalateConfirm}
      />

      <FreezeModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleFreezeConfirm}
      />

      <SuspiciousModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleSuspiciousConfirm}
      />

      <CloseInquiryModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleCloseConfirm}
      />
    </div>
  );
};

export default InquiryMonitoring;