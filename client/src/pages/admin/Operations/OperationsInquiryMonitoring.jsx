import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  RefreshCw,
  MoreHorizontal,
  Eye,
  BellRing,
  Siren,
  Snowflake,
  ShieldAlert,
  UserX,
  UserCog,
  CheckCircle2,
  X,
  Clock3,
  Activity,
  TriangleAlert,
  MessageSquare,
  BadgeAlert,
  MapPin,
  Car,
  User,
  Building2,
  ShieldCheck,
  TimerReset,
  TrendingUp,
  Zap,
  PhoneCall,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

/* =========================================================
   DUMMY DATA
========================================================= */
const DUMMY_INQUIRIES = [
  {
    id: "INQ-80121",
    vehicleId: "VH-2201",
    vehicle: "Hyundai Creta SX 2022",
    consultant: "Metro Auto Hub",
    buyer: "Arjun Mehta",
    city: "Ahmedabad",
    tier: "Premium",
    boosted: true,
    status: "No Response",
    risk: "Consultant Risk",
    timeOpenMin: 165,
    responseTimeMin: null,
    slaState: "Breached",
    priorityScore: 94,
    inquiryCreatedAt: "11 Mar 2026, 10:05 AM",
    lastActivity: "18 min ago",
    chatTimeline: [
      "Buyer initiated inquiry for Hyundai Creta SX 2022",
      "System pushed lead to consultant",
      "No consultant reply detected",
      "Boosted lead delay threshold crossed",
    ],
    buyerSnapshot: {
      riskScore: "Moderate",
      inquiryFrequency: "8 in last 24h",
      accountAge: "3 months",
      suspensionHistory: "No",
    },
    consultantSnapshot: {
      tier: "Premium",
      avgResponse: "2h 18m",
      conversion: "18%",
      ranking: 78,
      boostActive: "Yes",
    },
    slaTracker: {
      timeSinceInquiry: "2h 45m",
      firstResponse: "No response",
      tierRequirement: "Within 1 hour",
      breach: "Yes",
    },
  },
  {
    id: "INQ-80122",
    vehicleId: "VH-2204",
    vehicle: "Honda City ZX 2021",
    consultant: "Prime Wheels",
    buyer: "Priya Shah",
    city: "Surat",
    tier: "Pro",
    boosted: false,
    status: "Escalated",
    risk: "Buyer Risk",
    timeOpenMin: 210,
    responseTimeMin: 85,
    slaState: "Breached",
    priorityScore: 88,
    inquiryCreatedAt: "11 Mar 2026, 09:20 AM",
    lastActivity: "9 min ago",
    chatTimeline: [
      "Buyer requested callback",
      "Consultant delayed response",
      "Buyer complained about repeated delay",
      "Ops escalated case to Senior Ops",
    ],
    buyerSnapshot: {
      riskScore: "High",
      inquiryFrequency: "15 in last 12h",
      accountAge: "22 days",
      suspensionHistory: "Warning issued",
    },
    consultantSnapshot: {
      tier: "Pro",
      avgResponse: "1h 44m",
      conversion: "12%",
      ranking: 66,
      boostActive: "No",
    },
    slaTracker: {
      timeSinceInquiry: "3h 30m",
      firstResponse: "1h 25m",
      tierRequirement: "Within 45 min",
      breach: "Yes",
    },
  },
  {
    id: "INQ-80123",
    vehicleId: "VH-2211",
    vehicle: "Kia Seltos HTX 2023",
    consultant: "City Car Bazaar",
    buyer: "Rahul Patel",
    city: "Vadodara",
    tier: "Premium",
    boosted: true,
    status: "Chat Started",
    risk: "Low",
    timeOpenMin: 36,
    responseTimeMin: 8,
    slaState: "Within SLA",
    priorityScore: 54,
    inquiryCreatedAt: "11 Mar 2026, 12:01 PM",
    lastActivity: "4 min ago",
    chatTimeline: [
      "Buyer asked for inspection availability",
      "Consultant replied in 8 minutes",
      "Buyer requested loan support details",
    ],
    buyerSnapshot: {
      riskScore: "Low",
      inquiryFrequency: "2 in last 24h",
      accountAge: "5 months",
      suspensionHistory: "No",
    },
    consultantSnapshot: {
      tier: "Premium",
      avgResponse: "22m",
      conversion: "31%",
      ranking: 91,
      boostActive: "Yes",
    },
    slaTracker: {
      timeSinceInquiry: "36m",
      firstResponse: "8m",
      tierRequirement: "Within 1 hour",
      breach: "No",
    },
  },
  {
    id: "INQ-80124",
    vehicleId: "VH-2218",
    vehicle: "Tata Nexon XZ+ 2022",
    consultant: "Rapid Drive",
    buyer: "Sneha Verma",
    city: "Rajkot",
    tier: "Basic",
    boosted: false,
    status: "Suspicious",
    risk: "Buyer Risk",
    timeOpenMin: 28,
    responseTimeMin: 11,
    slaState: "Near Breach",
    priorityScore: 73,
    inquiryCreatedAt: "11 Mar 2026, 12:10 PM",
    lastActivity: "2 min ago",
    chatTimeline: [
      "Buyer initiated inquiry",
      "Phone number pattern detected in chat",
      "External deal suspicion triggered",
      "Marked suspicious for ops review",
    ],
    buyerSnapshot: {
      riskScore: "High",
      inquiryFrequency: "10 in last 10m",
      accountAge: "9 days",
      suspensionHistory: "No",
    },
    consultantSnapshot: {
      tier: "Basic",
      avgResponse: "39m",
      conversion: "9%",
      ranking: 52,
      boostActive: "No",
    },
    slaTracker: {
      timeSinceInquiry: "28m",
      firstResponse: "11m",
      tierRequirement: "Within 30 min",
      breach: "Near breach",
    },
  },
  {
    id: "INQ-80125",
    vehicleId: "VH-2222",
    vehicle: "Mahindra XUV700 AX7",
    consultant: "Urban Cars",
    buyer: "Faizan Khan",
    city: "Ahmedabad",
    tier: "Premium",
    boosted: true,
    status: "New",
    risk: "Low",
    timeOpenMin: 14,
    responseTimeMin: null,
    slaState: "Near Breach",
    priorityScore: 76,
    inquiryCreatedAt: "11 Mar 2026, 12:24 PM",
    lastActivity: "Just now",
    chatTimeline: [
      "Buyer inquiry created",
      "Lead delivered to consultant",
      "Awaiting first response",
    ],
    buyerSnapshot: {
      riskScore: "Low",
      inquiryFrequency: "3 in last 24h",
      accountAge: "4 months",
      suspensionHistory: "No",
    },
    consultantSnapshot: {
      tier: "Premium",
      avgResponse: "58m",
      conversion: "24%",
      ranking: 83,
      boostActive: "Yes",
    },
    slaTracker: {
      timeSinceInquiry: "14m",
      firstResponse: "Pending",
      tierRequirement: "Within 30 min",
      breach: "Near breach",
    },
  },
  {
    id: "INQ-80126",
    vehicleId: "VH-2230",
    vehicle: "Toyota Innova Crysta 2021",
    consultant: "Golden Motors",
    buyer: "Dev Sharma",
    city: "Surat",
    tier: "Pro",
    boosted: false,
    status: "Closed",
    risk: "Low",
    timeOpenMin: 82,
    responseTimeMin: 14,
    slaState: "Within SLA",
    priorityScore: 29,
    inquiryCreatedAt: "11 Mar 2026, 11:02 AM",
    lastActivity: "31 min ago",
    chatTimeline: [
      "Buyer asked for final quote",
      "Consultant replied quickly",
      "Conversation completed and closed",
    ],
    buyerSnapshot: {
      riskScore: "Low",
      inquiryFrequency: "1 in last 24h",
      accountAge: "11 months",
      suspensionHistory: "No",
    },
    consultantSnapshot: {
      tier: "Pro",
      avgResponse: "26m",
      conversion: "29%",
      ranking: 80,
      boostActive: "No",
    },
    slaTracker: {
      timeSinceInquiry: "1h 22m",
      firstResponse: "14m",
      tierRequirement: "Within 45 min",
      breach: "No",
    },
  },
];

const STATUS_OPTIONS = [
  "New",
  "Chat Started",
  "No Response",
  "Escalated",
  "Suspicious",
  "Closed",
];

const TIER_OPTIONS = ["Basic", "Pro", "Premium"];
const SLA_OPTIONS = ["Within SLA", "Near Breach", "Breached"];
const RISK_OPTIONS = ["Low", "Buyer Risk", "Consultant Risk"];

/* =========================================================
   BADGES
========================================================= */
const tierBadge = (tier) => {
  const map = {
    Basic: "bg-slate-100 text-slate-700 border-slate-200",
    Pro: "bg-violet-50 text-violet-700 border-violet-200",
    Premium: "bg-amber-50 text-amber-700 border-amber-200",
  };
  return map[tier] || "bg-slate-100 text-slate-700 border-slate-200";
};

const slaBadge = (sla) => {
  const map = {
    "Within SLA": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Near Breach": "bg-amber-50 text-amber-700 border-amber-200",
    Breached: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return map[sla] || "bg-slate-100 text-slate-700 border-slate-200";
};

const riskBadge = (risk) => {
  const map = {
    Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Buyer Risk": "bg-amber-50 text-amber-700 border-amber-200",
    "Consultant Risk": "bg-rose-50 text-rose-700 border-rose-200",
  };
  return map[risk] || "bg-slate-100 text-slate-700 border-slate-200";
};

const statusBadge = (status) => {
  const map = {
    New: "bg-sky-50 text-sky-700 border-sky-200",
    "Chat Started": "bg-indigo-50 text-indigo-700 border-indigo-200",
    "No Response": "bg-rose-50 text-rose-700 border-rose-200",
    Escalated: "bg-orange-50 text-orange-700 border-orange-200",
    Suspicious: "bg-amber-50 text-amber-700 border-amber-200",
    Closed: "bg-slate-100 text-slate-700 border-slate-200",
  };
  return map[status] || "bg-slate-100 text-slate-700 border-slate-200";
};

const priorityBadge = (score) => {
  if (score >= 85) return "bg-rose-50 text-rose-700 border-rose-200";
  if (score >= 65) return "bg-amber-50 text-amber-700 border-amber-200";
  if (score >= 45) return "bg-sky-50 text-sky-700 border-sky-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
};

/* =========================================================
   ROW ACTIONS
========================================================= */
function RowActions({
  item,
  onView,
  onNudge,
  onEscalate,
  onFreeze,
  onPenalize,
  onFlagBuyer,
  onAssignAgent,
  onCloseInquiry,
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
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => onView(item)}
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-[12px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <Eye className="h-4 w-4" />
          View
        </button>

        <button
          onClick={() => onNudge(item)}
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-3 text-[12px] font-semibold text-sky-700 hover:bg-sky-100 transition-colors"
        >
          <BellRing className="h-4 w-4" />
          Nudge
        </button>

        <button
          onClick={() => onEscalate(item)}
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 text-[12px] font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
        >
          <Siren className="h-4 w-4" />
          Escalate
        </button>

        <button
          onClick={() => setOpen((p) => !p)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {open && (
        <div className="absolute right-0 top-11 z-30 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
          <button
            onClick={() => {
              onFreeze(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50"
          >
            <Snowflake className="h-4 w-4 text-slate-500" />
            Freeze Chat
          </button>

          <button
            onClick={() => {
              onPenalize(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-rose-700 hover:bg-rose-50"
          >
            <ShieldAlert className="h-4 w-4" />
            Penalize Consultant
          </button>

          <button
            onClick={() => {
              onFlagBuyer(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-amber-700 hover:bg-amber-50"
          >
            <UserX className="h-4 w-4" />
            Flag Buyer
          </button>

          <button
            onClick={() => {
              onAssignAgent(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-sky-700 hover:bg-sky-50"
          >
            <UserCog className="h-4 w-4" />
            Assign Ops Agent
          </button>

          <div className="my-1 border-t border-slate-100" />

          <button
            onClick={() => {
              onCloseInquiry(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-emerald-700 hover:bg-emerald-50"
          >
            <CheckCircle2 className="h-4 w-4" />
            Close Inquiry
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
  onNudge,
  onEscalate,
  onFreeze,
  onWarnConsultant,
  onPenalize,
  onFlagBuyer,
}) {
  if (!item) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-[520px] border-l border-slate-200 bg-white shadow-2xl flex flex-col">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 shrink-0 bg-slate-50">
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Inquiry Detail
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {item.id} • {item.vehicle}
            </p>

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
                  tierBadge(item.tier)
                )}
              >
                {item.tier}
              </span>

              <span
                className={cls(
                  "inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold border",
                  slaBadge(item.slaState)
                )}
              >
                {item.slaState}
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

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Priority Score" value={item.priorityScore} icon={Zap} />
            <StatCard label="Time Open" value={`${item.timeOpenMin} min`} icon={Clock3} />
            <StatCard
              label="Response Time"
              value={item.responseTimeMin ? `${item.responseTimeMin} min` : "Pending"}
              icon={TimerReset}
            />
            <StatCard label="Last Activity" value={item.lastActivity} icon={Activity} />
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-4">
              Chat Timeline
            </h4>
            <SectionList items={item.chatTimeline} />
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-4">
              SLA Tracker
            </h4>
            <div className="space-y-4 text-sm">
              <InfoRow icon={Clock3} label="Time Since Inquiry" value={item.slaTracker.timeSinceInquiry} />
              <InfoRow icon={PhoneCall} label="Time to First Response" value={item.slaTracker.firstResponse} />
              <InfoRow icon={ShieldCheck} label="Tier SLA Requirement" value={item.slaTracker.tierRequirement} />
              <InfoRow icon={AlertTriangle} label="Breach Indicator" value={item.slaTracker.breach} />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5">
            <SnapshotCard
              title="Buyer Snapshot"
              icon={User}
              rows={[
                { label: "Risk Score", value: item.buyerSnapshot.riskScore },
                { label: "Inquiry Frequency", value: item.buyerSnapshot.inquiryFrequency },
                { label: "Account Age", value: item.buyerSnapshot.accountAge },
                { label: "Suspension History", value: item.buyerSnapshot.suspensionHistory },
              ]}
            />

            <SnapshotCard
              title="Consultant Snapshot"
              icon={Building2}
              rows={[
                { label: "Tier", value: item.consultantSnapshot.tier },
                { label: "Avg Response Time", value: item.consultantSnapshot.avgResponse },
                { label: "Conversion %", value: item.consultantSnapshot.conversion },
                { label: "Ranking Score", value: item.consultantSnapshot.ranking },
                { label: "Boost Active", value: item.consultantSnapshot.boostActive },
              ]}
            />
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-4">
              Quick Actions
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <ActionBtn
                icon={BellRing}
                label="Nudge Consultant"
                style="sky"
                onClick={() => onNudge(item)}
              />
              <ActionBtn
                icon={Siren}
                label="Escalate Inquiry"
                style="rose"
                onClick={() => onEscalate(item)}
              />
              <ActionBtn
                icon={Snowflake}
                label="Freeze Chat"
                style="slate"
                onClick={() => onFreeze(item)}
              />
              <ActionBtn
                icon={TriangleAlert}
                label="Warn Consultant"
                style="amber"
                onClick={() => onWarnConsultant(item)}
              />
              <ActionBtn
                icon={ShieldAlert}
                label="Penalize Ranking"
                style="rose"
                onClick={() => onPenalize(item)}
              />
              <ActionBtn
                icon={UserX}
                label="Flag Buyer"
                style="amber"
                onClick={() => onFlagBuyer(item)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ActionBtn({ icon: Icon, label, onClick, style = "slate" }) {
  const styles = {
    slate: "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100",
    sky: "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100",
    amber: "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100",
    rose: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
  };

  return (
    <button
      onClick={onClick}
      className={cls(
        "inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-[13px] font-semibold transition-colors",
        styles[style]
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function SnapshotCard({ title, icon: Icon, rows = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
          <Icon className="h-4 w-4" />
        </div>
        <h4 className="text-[14px] font-bold text-slate-900">{title}</h4>
      </div>

      <div className="space-y-4">
        {rows.map((row, i) => (
          <div key={`${title}-${i}`} className="flex items-start justify-between gap-4">
            <div className="text-[12px] text-slate-500">{row.label}</div>
            <div className="text-[13px] font-semibold text-slate-800 text-right">{row.value}</div>
          </div>
        ))}
      </div>
    </div>
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

function SectionList({ items = [] }) {
  return (
    <div className="space-y-2">
      {items.length ? (
        items.map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[13px] text-slate-600 leading-relaxed"
          >
            {item}
          </div>
        ))
      ) : (
        <div className="text-[13px] text-slate-400">No records</div>
      )}
    </div>
  );
}

/* =========================================================
   MODALS
========================================================= */
function NudgeModal({ modal, onClose, onConfirm }) {
  const [message, setMessage] = useState(
    "Please respond to this inquiry. SLA breach risk is approaching."
  );

  useEffect(() => {
    if (modal?.type === "nudge") {
      setMessage("Please respond to this inquiry. SLA breach risk is approaching.");
    }
  }, [modal]);

  if (!modal || modal.type !== "nudge") return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[61] w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Send Reminder to Consultant</h3>
            <p className="mt-1 text-[13px] text-slate-500">
              {modal.item.id} • {modal.item.consultant}
            </p>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-[13px] font-medium text-slate-700">Message</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-400 text-[13px] text-slate-900"
            />
          </div>

          <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-[12px] leading-relaxed text-sky-700">
            System will log nudge count, notify consultant, and raise performance risk after repeated reminders.
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm({ ...modal.item, nudgeMessage: message })}
            className="rounded-xl bg-sky-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-sky-700"
          >
            Send Nudge
          </button>
        </div>
      </div>
    </>
  );
}

function EscalateModal({ modal, onClose, onConfirm }) {
  const [reason, setReason] = useState("SLA Breach");
  const [assignTo, setAssignTo] = useState("Senior Ops");

  useEffect(() => {
    if (modal?.type === "escalate") {
      setReason("SLA Breach");
      setAssignTo("Senior Ops");
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
            <p className="mt-1 text-[13px] text-slate-500">
              {modal.item.id} • {modal.item.vehicle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900"
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
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-[13px] text-slate-900"
            >
              <option>SLA Breach</option>
              <option>Boosted Lead Delay</option>
              <option>Suspicious Activity</option>
              <option>Buyer Complaint</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-medium text-slate-700">Assign to</label>
            <select
              value={assignTo}
              onChange={(e) => setAssignTo(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-[13px] text-slate-900"
            >
              <option>Senior Ops</option>
              <option>Fraud</option>
              <option>Support</option>
            </select>
          </div>

          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[12px] leading-relaxed text-rose-700">
            This action will change status to escalated and create audit logs immediately.
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onConfirm({
                ...modal.item,
                escalationReason: reason,
                assignedTo: assignTo,
              })
            }
            className="rounded-xl bg-rose-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-rose-700"
          >
            Confirm Escalation
          </button>
        </div>
      </div>
    </>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */
const OperationsInquiryMonitoring = () => {
  const [rows, setRows] = useState(DUMMY_INQUIRIES);
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [modal, setModal] = useState(null);

  const [filters, setFilters] = useState({
    status: "",
    tier: "",
    boosted: "",
    sla: "",
    risk: "",
    city: "",
  });

  const filteredRows = useMemo(() => {
    let data = [...rows];

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.vehicleId.toLowerCase().includes(q) ||
          r.vehicle.toLowerCase().includes(q) ||
          r.consultant.toLowerCase().includes(q) ||
          r.buyer.toLowerCase().includes(q) ||
          r.city.toLowerCase().includes(q)
      );
    }

    if (filters.status) data = data.filter((r) => r.status === filters.status);
    if (filters.tier) data = data.filter((r) => r.tier === filters.tier);
    if (filters.boosted) data = data.filter((r) => (filters.boosted === "Yes" ? r.boosted : !r.boosted));
    if (filters.sla) data = data.filter((r) => r.slaState === filters.sla);
    if (filters.risk) data = data.filter((r) => r.risk === filters.risk);
    if (filters.city) data = data.filter((r) => r.city === filters.city);

    return data.sort((a, b) => b.priorityScore - a.priorityScore);
  }, [rows, search, filters]);

  const stats = useMemo(() => {
    const lastHour = rows.length;
    const responseRows = rows.filter((r) => typeof r.responseTimeMin === "number");
    const avgResponse =
      responseRows.length > 0
        ? Math.round(
            responseRows.reduce((sum, item) => sum + item.responseTimeMin, 0) /
              responseRows.length
          )
        : 0;

    return {
      inquiries1h: lastHour,
      avgResponseTime: avgResponse,
      unansweredBreached: rows.filter(
        (r) => r.slaState === "Breached" && !r.responseTimeMin
      ).length,
      boostedUnanswered: rows.filter((r) => r.boosted && !r.responseTimeMin).length,
      escalatedToday: rows.filter((r) => r.status === "Escalated").length,
    };
  }, [rows]);

  const uniqueCities = useMemo(() => [...new Set(rows.map((r) => r.city))], [rows]);

  const alerts = useMemo(() => {
    const premiumBreached = rows.filter(
      (r) => r.tier === "Premium" && r.slaState === "Breached"
    ).length;
    const boostedUnanswered = rows.filter((r) => r.boosted && !r.responseTimeMin).length;
    const highRiskChats = rows.filter((r) => r.status === "Suspicious").length;

    return [
      {
        label: `🚨 ${premiumBreached} Premium Inquiries Breached SLA`,
        type: "premiumBreached",
        show: premiumBreached > 0,
      },
      {
        label: `🚨 ${boostedUnanswered} Boosted Leads Unanswered`,
        type: "boostedUnanswered",
        show: boostedUnanswered > 0,
      },
      {
        label: `⚠ ${highRiskChats} High-Risk Chats Detected`,
        type: "highRiskChats",
        show: highRiskChats > 0,
      },
    ].filter((x) => x.show);
  }, [rows]);

  const handleAlertClick = (type) => {
    if (type === "premiumBreached") {
      setFilters((p) => ({ ...p, tier: "Premium", sla: "Breached" }));
      setFiltersOpen(true);
    }
    if (type === "boostedUnanswered") {
      setFilters((p) => ({ ...p, boosted: "Yes" }));
      setFiltersOpen(true);
    }
    if (type === "highRiskChats") {
      setFilters((p) => ({ ...p, status: "Suspicious" }));
      setFiltersOpen(true);
    }
  };

  const handleRefresh = () => setRows([...DUMMY_INQUIRIES]);

  const handleClear = () => {
    setSearch("");
    setFilters({
      status: "",
      tier: "",
      boosted: "",
      sla: "",
      risk: "",
      city: "",
    });
    setFiltersOpen(false);
  };

  const updateRow = (id, patch) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    if (selectedInquiry?.id === id) {
      setSelectedInquiry((prev) => ({ ...prev, ...patch }));
    }
  };

  const handleNudgeConfirm = (item) => {
    updateRow(item.id, { lastActivity: "Just now" });
    setModal(null);
  };

  const handleEscalateConfirm = (item) => {
    updateRow(item.id, {
      status: "Escalated",
      slaState: "Breached",
      priorityScore: Math.max(item.priorityScore, 90),
      risk: item.risk === "Low" ? "Consultant Risk" : item.risk,
      lastActivity: "Just now",
    });
    setModal(null);
  };

  const handleFreeze = (item) => {
    updateRow(item.id, {
      status: "Suspicious",
      lastActivity: "Just now",
    });
  };

  const handlePenalize = (item) => {
    updateRow(item.id, {
      risk: "Consultant Risk",
      priorityScore: Math.min(99, item.priorityScore + 6),
      lastActivity: "Just now",
    });
  };

  const handleFlagBuyer = (item) => {
    updateRow(item.id, {
      risk: "Buyer Risk",
      status: "Suspicious",
      priorityScore: Math.min(99, item.priorityScore + 8),
      lastActivity: "Just now",
    });
  };

  const handleAssignAgent = (item) => {
    updateRow(item.id, {
      status: "Escalated",
      lastActivity: "Just now",
    });
  };

  const handleCloseInquiry = (item) => {
    updateRow(item.id, {
      status: "Closed",
      lastActivity: "Just now",
      priorityScore: 20,
    });
  };

  const handleWarnConsultant = (item) => {
    updateRow(item.id, {
      risk: "Consultant Risk",
      lastActivity: "Just now",
    });
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
              Inquiry Monitoring
            </h1>
            <p className="max-w-4xl text-sm leading-relaxed text-slate-500">
              Live operations command center for SLA enforcement, boosted lead protection,
              consultant responsiveness, abuse detection, and escalation handling.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <TopCard
            title="Inquiries (1h)"
            value={stats.inquiries1h}
            icon={MessageSquare}
          />
          <TopCard
            title="Avg Response Time"
            value={`${stats.avgResponseTime} min`}
            icon={Clock3}
            tone={stats.avgResponseTime <= 30 ? "success" : "warning"}
          />
          <TopCard
            title="Unanswered > SLA"
            value={stats.unansweredBreached}
            icon={BadgeAlert}
            tone={stats.unansweredBreached > 0 ? "danger" : "success"}
          />
          <TopCard
            title="Boosted Unanswered"
            value={stats.boostedUnanswered}
            icon={Zap}
            tone={stats.boostedUnanswered > 0 ? "danger" : "default"}
          />
          <TopCard
            title="Escalated Today"
            value={stats.escalatedToday}
            icon={TrendingUp}
            tone="default"
          />
        </section>

        {alerts.length > 0 && (
          <section className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              {alerts.map((alert) => (
                <button
                  key={alert.type}
                  onClick={() => handleAlertClick(alert.type)}
                  className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-3 py-2 text-[13px] font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
                >
                  <TriangleAlert className="h-4 w-4" />
                  {alert.label}
                  <ChevronRight className="h-4 w-4" />
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-100 blur-[100px] pointer-events-none" />

          <div className="p-5 md:p-6 relative z-10 border-b border-slate-200">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="relative flex-1 max-w-3xl">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by Inquiry ID, Vehicle ID, buyer, consultant, city..."
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
                  value={filters.tier}
                  onChange={(e) => setFilters((p) => ({ ...p, tier: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400"
                >
                  <option value="">All Tiers</option>
                  {TIER_OPTIONS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <select
                  value={filters.boosted}
                  onChange={(e) => setFilters((p) => ({ ...p, boosted: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400"
                >
                  <option value="">Boosted</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>

                <select
                  value={filters.sla}
                  onChange={(e) => setFilters((p) => ({ ...p, sla: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400"
                >
                  <option value="">All SLA</option>
                  {SLA_OPTIONS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <select
                  value={filters.risk}
                  onChange={(e) => setFilters((p) => ({ ...p, risk: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400"
                >
                  <option value="">All Risk</option>
                  {RISK_OPTIONS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <select
                  value={filters.city}
                  onChange={(e) => setFilters((p) => ({ ...p, city: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400"
                >
                  <option value="">All Cities</option>
                  {uniqueCities.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="w-full overflow-x-auto table-scroll relative z-10 pb-4">
            <table className="min-w-[1700px] w-full border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Inquiry</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Vehicle</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Consultant</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Tier</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Boosted</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Time Open</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Resp Time</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">SLA</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Risk</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Status</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Priority</th>
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
                        <div>
                          <div className="text-[14px] font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                            {row.id}
                          </div>
                          <div className="mt-1 text-[12px] text-slate-500 font-mono">
                            {row.vehicleId}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0 text-sky-600">
                            <Car className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-[13px] font-semibold text-slate-900">
                              {row.vehicle}
                            </div>
                            <div className="mt-1 text-[12px] text-slate-500 flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {row.city}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div>
                          <div className="text-[13px] font-medium text-slate-800">
                            {row.consultant}
                          </div>
                          <div className="mt-1 text-[12px] text-slate-500">
                            Buyer: {row.buyer}
                          </div>
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
                        {row.boosted ? (
                          <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                            <Zap className="h-3.5 w-3.5" />
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex rounded-md border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                            No
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">
                        {row.timeOpenMin} min
                      </td>

                      <td className="px-5 py-4 text-[13px] font-semibold text-slate-700 whitespace-nowrap">
                        {row.responseTimeMin ? `${row.responseTimeMin} min` : "Pending"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={cls(
                            "inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap",
                            slaBadge(row.slaState)
                          )}
                        >
                          {row.slaState}
                        </span>
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
                        <span
                          className={cls(
                            "inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap",
                            priorityBadge(row.priorityScore)
                          )}
                        >
                          {row.priorityScore}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <RowActions
                          item={row}
                          onView={setSelectedInquiry}
                          onNudge={(item) => setModal({ type: "nudge", item })}
                          onEscalate={(item) => setModal({ type: "escalate", item })}
                          onFreeze={handleFreeze}
                          onPenalize={handlePenalize}
                          onFlagBuyer={handleFlagBuyer}
                          onAssignAgent={handleAssignAgent}
                          onCloseInquiry={handleCloseInquiry}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={12} className="px-6 py-28 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-4">
                          <Search size={28} />
                        </div>
                        <div className="text-lg font-bold text-slate-900 tracking-tight">
                          No inquiries found
                        </div>
                        <div className="mt-1 text-[14px] text-slate-500 max-w-sm mx-auto">
                          Try adjusting your filters or clear the current search.
                        </div>
                        {(search || Object.values(filters).some(Boolean)) && (
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

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <HeatmapCard
            title="City vs Avg Response Time"
            data={[
              { label: "Ahmedabad", value: "34m", tone: "good" },
              { label: "Surat", value: "1h 12m", tone: "bad" },
              { label: "Vadodara", value: "28m", tone: "good" },
              { label: "Rajkot", value: "52m", tone: "warn" },
            ]}
          />

          <HeatmapCard
            title="Tier vs SLA Compliance"
            data={[
              { label: "Basic", value: "81%", tone: "warn" },
              { label: "Pro", value: "74%", tone: "bad" },
              { label: "Premium", value: "89%", tone: "good" },
            ]}
          />

          <HeatmapCard
            title="Boosted vs Non-Boosted"
            data={[
              { label: "Boosted Response", value: "41m", tone: "warn" },
              { label: "Non-Boosted Response", value: "27m", tone: "good" },
            ]}
          />

          <HeatmapCard
            title="Automation & Risk Signals"
            data={[
              { label: "Premium > 2h no response", value: "2 cases", tone: "bad" },
              { label: "Boosted > 1h alert", value: "3 cases", tone: "bad" },
              { label: "Repeated ignored inquiries", value: "1 consultant", tone: "warn" },
              { label: "10 inquiries in 10 min", value: "1 buyer", tone: "bad" },
            ]}
          />
        </section>
      </div>

      <InquiryDetailDrawer
        item={selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        onNudge={(item) => setModal({ type: "nudge", item })}
        onEscalate={(item) => setModal({ type: "escalate", item })}
        onFreeze={handleFreeze}
        onWarnConsultant={handleWarnConsultant}
        onPenalize={handlePenalize}
        onFlagBuyer={handleFlagBuyer}
      />

      <NudgeModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleNudgeConfirm}
      />

      <EscalateModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleEscalateConfirm}
      />
    </div>
  );
};

function HeatmapCard({ title, data = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="text-[15px] font-bold text-slate-900">{title}</h3>
      </div>

      <div className="p-5 space-y-3">
        {data.map((item, index) => (
          <div
            key={`${title}-${index}`}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
          >
            <div className="text-[13px] font-medium text-slate-700">{item.label}</div>
            <span
              className={cls(
                "inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border",
                item.tone === "good" && "bg-emerald-50 text-emerald-700 border-emerald-200",
                item.tone === "warn" && "bg-amber-50 text-amber-700 border-amber-200",
                item.tone === "bad" && "bg-rose-50 text-rose-700 border-rose-200"
              )}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopCard({ title, value, icon: Icon, tone = "default" }) {
  const toneMap = {
    default: "bg-sky-50 border-sky-100 text-sky-600",
    success: "bg-emerald-50 border-emerald-100 text-emerald-600",
    warning: "bg-amber-50 border-amber-100 text-amber-600",
    danger: "bg-rose-50 border-rose-100 text-rose-600",
  };

  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-6 overflow-hidden group shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10 flex items-end justify-between">
        <div>
          <div className="text-[12px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-2">
            {title}
          </div>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900">
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

export default OperationsInquiryMonitoring;