import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  RefreshCw,
  MoreHorizontal,
  Eye,
  Trash2,
  ShieldAlert,
  Ban,
  Siren,
  TriangleAlert,
  X,
  MessageSquareText,
  Phone,
  IndianRupee,
  AlertTriangle,
  ShieldCheck,
  Clock3,
  Activity,
  User,
  CarFront,
  TrendingUp,
  Lock,
  BadgeAlert,
  TimerReset,
  MessageCircleWarning,
} from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

/* =========================================================
   DUMMY DATA
========================================================= */
const DUMMY_CHATS = [
  {
    id: "CH-98102",
    inquiryId: "INQ-84022",
    vehicle: "Kia Seltos GTX+ 2023",
    buyer: "Priya Shah",
    consultant: "Prime Wheels",
    flagType: "Phone number detected",
    riskScore: 92,
    riskLevel: "High",
    preview: "Call me on 98xxxxxx, let’s discuss directly.",
    time: "2m ago",
    status: "Flagged",
    city: "Surat",
    lastMessage: "Call me directly on 98xxxxxx",
    active: true,
    phoneLeaks: 3,
    upiMentions: 0,
    abuseReports: 0,
    frozenToday: false,
    autoDetected: true,
    confidence: 94,
    previousAttempts: 2,
    buyerRisk: 78,
    buyerInquiryCount: 14,
    buyerSuspensionHistory: "Warning issued",
    consultantTier: "Premium",
    consultantResponseTime: "52m",
    consultantBoostActive: true,
    consultantPerformanceFlag: true,
    patternHistory: {
      externalAttempts: 4,
      deletedMessages: 1,
      previousWarnings: 2,
    },
    timeline: [
      {
        time: "10:12 AM",
        sender: "Buyer",
        text: "Hi, is this Kia available?",
        flagged: false,
      },
      {
        time: "10:18 AM",
        sender: "Consultant",
        text: "Yes, available. Please let me know if you want inspection.",
        flagged: false,
      },
      {
        time: "10:22 AM",
        sender: "Buyer",
        text: "Call me on 9876543210, let’s discuss directly.",
        flagged: true,
        highlight: "9876543210",
      },
    ],
  },
  {
    id: "CH-98103",
    inquiryId: "INQ-84024",
    vehicle: "Tata Nexon EV 2024",
    buyer: "Sneha Verma",
    consultant: "Green Auto Arena",
    flagType: "UPI / Payment Mention",
    riskScore: 88,
    riskLevel: "High",
    preview: "I can transfer token now on your UPI.",
    time: "7m ago",
    status: "Escalated",
    city: "Rajkot",
    lastMessage: "Share your UPI, I’ll send token now.",
    active: true,
    phoneLeaks: 0,
    upiMentions: 2,
    abuseReports: 0,
    frozenToday: false,
    autoDetected: true,
    confidence: 91,
    previousAttempts: 1,
    buyerRisk: 85,
    buyerInquiryCount: 12,
    buyerSuspensionHistory: "Previous temporary suspension",
    consultantTier: "Basic",
    consultantResponseTime: "34m",
    consultantBoostActive: false,
    consultantPerformanceFlag: false,
    patternHistory: {
      externalAttempts: 3,
      deletedMessages: 0,
      previousWarnings: 1,
    },
    timeline: [
      {
        time: "11:34 AM",
        sender: "Buyer",
        text: "Can I send token now?",
        flagged: false,
      },
      {
        time: "11:38 AM",
        sender: "Consultant",
        text: "Please book through platform.",
        flagged: false,
      },
      {
        time: "11:41 AM",
        sender: "Buyer",
        text: "Share UPI ID, I’ll pay directly.",
        flagged: true,
        highlight: "UPI ID",
      },
    ],
  },
  {
    id: "CH-98104",
    inquiryId: "INQ-84028",
    vehicle: "Hyundai Verna SX",
    buyer: "Aman Sheikh",
    consultant: "Cityline Motors",
    flagType: "Abusive language",
    riskScore: 76,
    riskLevel: "High",
    preview: "Your service is useless, stop wasting my time.",
    time: "13m ago",
    status: "Under Review",
    city: "Ahmedabad",
    lastMessage: "Stop wasting my time.",
    active: true,
    phoneLeaks: 0,
    upiMentions: 0,
    abuseReports: 2,
    frozenToday: false,
    autoDetected: true,
    confidence: 89,
    previousAttempts: 0,
    buyerRisk: 54,
    buyerInquiryCount: 8,
    buyerSuspensionHistory: "No",
    consultantTier: "Pro",
    consultantResponseTime: "1h 12m",
    consultantBoostActive: false,
    consultantPerformanceFlag: true,
    patternHistory: {
      externalAttempts: 0,
      deletedMessages: 0,
      previousWarnings: 0,
    },
    timeline: [
      {
        time: "09:44 AM",
        sender: "Buyer",
        text: "Need final price quickly.",
        flagged: false,
      },
      {
        time: "09:58 AM",
        sender: "Consultant",
        text: "Please wait while I confirm.",
        flagged: false,
      },
      {
        time: "10:01 AM",
        sender: "Buyer",
        text: "Your service is useless, stop wasting my time.",
        flagged: true,
        highlight: "useless",
      },
    ],
  },
  {
    id: "CH-98105",
    inquiryId: "INQ-84031",
    vehicle: "Mahindra XUV700 AX7",
    buyer: "Faizan Khan",
    consultant: "Elite Motors",
    flagType: "WhatsApp link",
    riskScore: 69,
    riskLevel: "Medium",
    preview: "Ping me on WhatsApp and I’ll share full details.",
    time: "18m ago",
    status: "Flagged",
    city: "Ahmedabad",
    lastMessage: "Message me on WhatsApp",
    active: true,
    phoneLeaks: 1,
    upiMentions: 0,
    abuseReports: 0,
    frozenToday: false,
    autoDetected: true,
    confidence: 86,
    previousAttempts: 1,
    buyerRisk: 36,
    buyerInquiryCount: 6,
    buyerSuspensionHistory: "No",
    consultantTier: "Premium",
    consultantResponseTime: "28m",
    consultantBoostActive: true,
    consultantPerformanceFlag: false,
    patternHistory: {
      externalAttempts: 2,
      deletedMessages: 0,
      previousWarnings: 1,
    },
    timeline: [
      {
        time: "11:55 AM",
        sender: "Buyer",
        text: "Can you share more photos?",
        flagged: false,
      },
      {
        time: "11:58 AM",
        sender: "Consultant",
        text: "Ping me on WhatsApp and I’ll send.",
        flagged: true,
        highlight: "WhatsApp",
      },
    ],
  },
  {
    id: "CH-98106",
    inquiryId: "INQ-84035",
    vehicle: "Honda City VX",
    buyer: "Rahul Patel",
    consultant: "Urban Drive",
    flagType: "Suspicious pattern",
    riskScore: 58,
    riskLevel: "Medium",
    preview: "Same message repeated across multiple chats.",
    time: "24m ago",
    status: "Flagged",
    city: "Vadodara",
    lastMessage: "Please call me directly for deal",
    active: false,
    phoneLeaks: 2,
    upiMentions: 0,
    abuseReports: 0,
    frozenToday: false,
    autoDetected: true,
    confidence: 80,
    previousAttempts: 3,
    buyerRisk: 62,
    buyerInquiryCount: 18,
    buyerSuspensionHistory: "Inquiry limit applied",
    consultantTier: "Pro",
    consultantResponseTime: "1h 08m",
    consultantBoostActive: false,
    consultantPerformanceFlag: false,
    patternHistory: {
      externalAttempts: 5,
      deletedMessages: 2,
      previousWarnings: 3,
    },
    timeline: [
      {
        time: "11:08 AM",
        sender: "Buyer",
        text: "Please call me directly for deal.",
        flagged: true,
        highlight: "call me directly",
      },
    ],
  },
  {
    id: "CH-98107",
    inquiryId: "INQ-84039",
    vehicle: "Toyota Fortuner Legender",
    buyer: "Nikita Joshi",
    consultant: "Royal Cars",
    flagType: "Healthy chat",
    riskScore: 18,
    riskLevel: "Low",
    preview: "Please share service history and inspection slot.",
    time: "31m ago",
    status: "Active",
    city: "Surat",
    lastMessage: "Can I book inspection tomorrow?",
    active: true,
    phoneLeaks: 0,
    upiMentions: 0,
    abuseReports: 0,
    frozenToday: false,
    autoDetected: false,
    confidence: 0,
    previousAttempts: 0,
    buyerRisk: 12,
    buyerInquiryCount: 3,
    buyerSuspensionHistory: "No",
    consultantTier: "Premium",
    consultantResponseTime: "22m",
    consultantBoostActive: true,
    consultantPerformanceFlag: false,
    patternHistory: {
      externalAttempts: 0,
      deletedMessages: 0,
      previousWarnings: 0,
    },
    timeline: [
      {
        time: "11:41 AM",
        sender: "Buyer",
        text: "Can I book inspection tomorrow?",
        flagged: false,
      },
      {
        time: "11:46 AM",
        sender: "Consultant",
        text: "Yes, tomorrow afternoon is available.",
        flagged: false,
      },
    ],
  },
];

const FLAG_OPTIONS = [
  "Phone number detected",
  "WhatsApp link",
  "Telegram mention",
  "UPI / Payment Mention",
  "Abusive language",
  "Threat language",
  "Suspicious pattern",
];
const STATUS_OPTIONS = ["Active", "Flagged", "Under Review", "Escalated", "Frozen", "Closed"];
const RISK_OPTIONS = ["Low", "Medium", "High"];
const CITY_OPTIONS = ["Ahmedabad", "Surat", "Rajkot", "Vadodara"];

/* =========================================================
   BADGES
========================================================= */
const riskBadge = (risk) => {
  const map = {
    Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Medium: "bg-amber-50 text-amber-700 border-amber-200",
    High: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return map[risk] || "bg-slate-50 text-slate-700 border-slate-200";
};

const statusBadge = (status) => {
  const map = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Flagged: "bg-amber-50 text-amber-700 border-amber-200",
    "Under Review": "bg-sky-50 text-sky-700 border-sky-200",
    Escalated: "bg-violet-50 text-violet-700 border-violet-200",
    Frozen: "bg-rose-50 text-rose-700 border-rose-200",
    Closed: "bg-slate-100 text-slate-700 border-slate-200",
  };
  return map[status] || "bg-slate-50 text-slate-700 border-slate-200";
};

const flagTypeBadge = (flagType) => {
  if (flagType === "Healthy chat") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  if (flagType.includes("Phone") || flagType.includes("WhatsApp")) {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }
  if (flagType.includes("UPI") || flagType.includes("Payment")) {
    return "bg-violet-50 text-violet-700 border-violet-200";
  }
  if (flagType.includes("Abusive") || flagType.includes("Threat")) {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }
  return "bg-slate-100 text-slate-700 border-slate-200";
};

const scoreToRisk = (score) => {
  if (score >= 70) return "High";
  if (score >= 40) return "Medium";
  return "Low";
};

/* =========================================================
   ROW ACTIONS
========================================================= */
function RowActions({
  item,
  onView,
  onDelete,
  onWarn,
  onFreeze,
  onEscalate,
  onSuspend,
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
          onClick={() => onWarn(item)}
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 text-[12px] font-semibold text-amber-700 transition hover:bg-amber-100"
        >
          <MessageCircleWarning className="h-4 w-4" />
          Warn
        </button>

        <button
          onClick={() => onFreeze(item)}
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 text-[12px] font-semibold text-rose-700 transition hover:bg-rose-100"
        >
          <Lock className="h-4 w-4" />
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
              onDelete(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-rose-700 hover:bg-rose-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete Message
          </button>

          <button
            onClick={() => {
              onEscalate(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-violet-700 hover:bg-violet-50"
          >
            <Siren className="h-4 w-4" />
            Escalate to Fraud
          </button>

          <button
            onClick={() => {
              onSuspend(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50"
          >
            <Ban className="h-4 w-4" />
            Suspend User
          </button>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   DETAIL DRAWER
========================================================= */
function ChatDetailDrawer({
  item,
  onClose,
  onFreeze,
  onWarnBuyer,
  onWarnConsultant,
  onDelete,
  onEscalate,
  onCloseChat,
}) {
  if (!item) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-[540px] border-l border-slate-200 bg-white shadow-2xl flex flex-col">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 shrink-0 bg-slate-50">
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {item.id}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {item.inquiryId} • {item.vehicle}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span
                className={cls(
                  "inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold border",
                  riskBadge(item.riskLevel)
                )}
              >
                {item.riskLevel} Risk
              </span>
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
                  flagTypeBadge(item.flagType)
                )}
              >
                {item.flagType}
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
            <StatCard label="Risk Score" value={item.riskScore} icon={BadgeAlert} />
            <StatCard label="Status" value={item.status} icon={ShieldAlert} />
            <StatCard label="Buyer" value={item.buyer} icon={User} />
            <StatCard label="Consultant" value={item.consultant} icon={ShieldCheck} />
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-4">
              Full Chat Timeline
            </h4>

            <div className="space-y-3">
              {item.timeline.map((msg, idx) => (
                <div
                  key={idx}
                  className={cls(
                    "rounded-xl border p-3.5",
                    msg.flagged
                      ? "border-rose-200 bg-rose-50"
                      : "border-slate-200 bg-slate-50"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[12px] font-semibold text-slate-700">
                      {msg.sender}
                    </span>
                    <span className="text-[11px] text-slate-400">{msg.time}</span>
                  </div>

                  <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">
                    {msg.highlight ? (
                      <>
                        {msg.text.split(msg.highlight)[0]}
                        <span className="rounded bg-rose-100 px-1 text-rose-700 font-semibold">
                          {msg.highlight}
                        </span>
                        {msg.text.split(msg.highlight)[1]}
                      </>
                    ) : (
                      msg.text
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-4">
              Detection Engine Details
            </h4>
            <div className="space-y-4 text-sm">
              <InfoRow icon={ShieldAlert} label="Detected Pattern" value={item.flagType} />
              <InfoRow icon={Activity} label="Confidence" value={`${item.confidence}%`} />
              <InfoRow
                icon={RefreshCw}
                label="Previous Attempts"
                value={item.previousAttempts}
              />
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-4">
              Participant Snapshot
            </h4>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-[12px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Buyer
                </div>
                <div className="space-y-3">
                  <InfoRow icon={BadgeAlert} label="Risk Score" value={item.buyerRisk} />
                  <InfoRow icon={MessageSquareText} label="Inquiry Count" value={item.buyerInquiryCount} />
                  <InfoRow
                    icon={TriangleAlert}
                    label="Suspension History"
                    value={item.buyerSuspensionHistory}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-[12px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Consultant
                </div>
                <div className="space-y-3">
                  <InfoRow icon={ShieldCheck} label="Tier" value={item.consultantTier} />
                  <InfoRow
                    icon={TimerReset}
                    label="Response Time"
                    value={item.consultantResponseTime}
                  />
                  <InfoRow
                    icon={TrendingUp}
                    label="Boost Active"
                    value={item.consultantBoostActive ? "Yes" : "No"}
                  />
                  <InfoRow
                    icon={AlertTriangle}
                    label="Performance Flag"
                    value={item.consultantPerformanceFlag ? "Yes" : "No"}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-4">
              Chat History Pattern
            </h4>
            <div className="space-y-4 text-sm">
              <InfoRow
                icon={Phone}
                label="External Deal Attempts"
                value={item.patternHistory.externalAttempts}
              />
              <InfoRow
                icon={Trash2}
                label="Message Deletion History"
                value={item.patternHistory.deletedMessages}
              />
              <InfoRow
                icon={MessageCircleWarning}
                label="Previous Warnings"
                value={item.patternHistory.previousWarnings}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <ActionBtn onClick={() => onFreeze(item)} icon={Lock} tone="rose" label="Freeze" />
            <ActionBtn
              onClick={() => onWarnBuyer(item)}
              icon={MessageCircleWarning}
              tone="amber"
              label="Warn Buyer"
            />
            <ActionBtn
              onClick={() => onWarnConsultant(item)}
              icon={ShieldAlert}
              tone="sky"
              label="Warn Consultant"
            />
            <ActionBtn
              onClick={() => onDelete(item)}
              icon={Trash2}
              tone="slate"
              label="Delete"
            />
            <ActionBtn
              onClick={() => onEscalate(item)}
              icon={Siren}
              tone="violet"
              label="Escalate"
            />
            <ActionBtn
              onClick={() => onCloseChat(item)}
              icon={X}
              tone="slate"
              label="Close"
            />
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

/* =========================================================
   MODALS
========================================================= */
function DeleteMessageModal({ modal, onClose, onConfirm }) {
  const [reason, setReason] = useState("Phone number sharing");

  useEffect(() => {
    if (modal?.type === "delete") setReason("Phone number sharing");
  }, [modal]);

  if (!modal || modal.type !== "delete") return null;

  return (
    <ModalShell
      title="Delete Message"
      subtitle={`${modal.item.id} • ${modal.item.flagType}`}
      onClose={onClose}
    >
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-[13px] font-medium text-slate-700">Reason</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-[13px]"
          >
            <option>Phone number sharing</option>
            <option>External deal attempt</option>
            <option>Abuse</option>
            <option>Payment outside</option>
          </select>
        </div>

        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[12px] text-rose-700">
          Message will be removed from user view, internal copy will be preserved, and admin action will be logged.
        </div>
      </div>

      <ModalFooter
        onClose={onClose}
        onConfirm={() => onConfirm({ ...modal.item, deleteReason: reason })}
        confirmText="Confirm Delete"
        confirmClass="bg-rose-600 hover:bg-rose-700"
      />
    </ModalShell>
  );
}

function WarnUserModal({ modal, onClose, onConfirm }) {
  const [message, setMessage] = useState(
    "You are not allowed to share contact information or transact outside AVX."
  );
  const [strike, setStrike] = useState("Yes");

  useEffect(() => {
    if (modal?.type === "warn") {
      setMessage("You are not allowed to share contact information or transact outside AVX.");
      setStrike("Yes");
    }
  }, [modal]);

  if (!modal || modal.type !== "warn") return null;

  return (
    <ModalShell
      title="Send Warning"
      subtitle={`${modal.item.id} • ${modal.target}`}
      onClose={onClose}
    >
      <div className="space-y-4">
        <textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-400 text-[13px] text-slate-900"
        />

        <div>
          <label className="mb-2 block text-[13px] font-medium text-slate-700">Apply strike?</label>
          <div className="grid grid-cols-2 gap-3">
            {["Yes", "No"].map((item) => (
              <button
                key={item}
                onClick={() => setStrike(item)}
                className={cls(
                  "rounded-xl border px-4 py-2.5 text-[13px] font-semibold transition-all",
                  strike === item
                    ? "border-amber-300 bg-amber-50 text-amber-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ModalFooter
        onClose={onClose}
        onConfirm={() => onConfirm({ ...modal.item, warningMessage: message, strike })}
        confirmText="Send Warning"
        confirmClass="bg-amber-600 hover:bg-amber-700"
      />
    </ModalShell>
  );
}

function FreezeChatModal({ modal, onClose, onConfirm }) {
  const [duration, setDuration] = useState("24 hours");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (modal?.type === "freeze") {
      setDuration("24 hours");
      setReason("");
    }
  }, [modal]);

  if (!modal || modal.type !== "freeze") return null;

  return (
    <ModalShell
      title="Freeze Chat"
      subtitle={`${modal.item.id} • ${modal.item.inquiryId}`}
      onClose={onClose}
    >
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-[13px] font-medium text-slate-700">Duration</label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-[13px]"
          >
            <option>24 hours</option>
            <option>Permanent</option>
            <option>Until Review</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-[13px] font-medium text-slate-700">Reason</label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason..."
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-[13px]"
          />
        </div>

        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[12px] text-rose-700">
          This will disable chat for both parties, notify participants, and create an immutable moderation log.
        </div>
      </div>

      <ModalFooter
        onClose={onClose}
        onConfirm={() => onConfirm({ ...modal.item, freezeDuration: duration, freezeReason: reason })}
        confirmText="Freeze Chat"
        confirmClass="bg-rose-600 hover:bg-rose-700"
      />
    </ModalShell>
  );
}

function EscalateModal({ modal, onClose, onConfirm }) {
  if (!modal || modal.type !== "escalate") return null;

  return (
    <ModalShell
      title="Escalate to Fraud"
      subtitle={`${modal.item.id} • ${modal.item.inquiryId}`}
      onClose={onClose}
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-[12px] text-violet-700">
          Fraud case will be created, chat logs will be linked, and related listings can be locked for review.
        </div>
      </div>

      <ModalFooter
        onClose={onClose}
        onConfirm={() => onConfirm(modal.item)}
        confirmText="Escalate"
        confirmClass="bg-violet-600 hover:bg-violet-700"
      />
    </ModalShell>
  );
}

function SuspendUserModal({ modal, onClose, onConfirm }) {
  const [reason, setReason] = useState("Repeated chat violations");

  useEffect(() => {
    if (modal?.type === "suspend") {
      setReason("Repeated chat violations");
    }
  }, [modal]);

  if (!modal || modal.type !== "suspend") return null;

  return (
    <ModalShell
      title="Suspend User"
      subtitle={`${modal.item.id} • ${modal.item.buyer}`}
      onClose={onClose}
    >
      <div className="space-y-4">
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-[13px]"
        >
          <option>Repeated chat violations</option>
          <option>Off-platform deal attempts</option>
          <option>UPI / payment sharing</option>
          <option>Abusive language</option>
        </select>
      </div>

      <ModalFooter
        onClose={onClose}
        onConfirm={() => onConfirm({ ...modal.item, suspendReason: reason })}
        confirmText="Suspend User"
        confirmClass="bg-slate-900 hover:bg-slate-800"
      />
    </ModalShell>
  );
}

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

/* =========================================================
   MAIN PAGE
========================================================= */
const ChatOversight = () => {
  const [rows, setRows] = useState(DUMMY_CHATS);
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("flagged");
  const [filters, setFilters] = useState({
    flagType: "",
    risk: "",
    status: "",
    city: "",
  });

  const [selectedChat, setSelectedChat] = useState(null);
  const [modal, setModal] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setLastRefresh(new Date());
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const flaggedRows = useMemo(() => {
    let data = rows.filter((r) => r.flagType !== "Healthy chat");

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.inquiryId.toLowerCase().includes(q) ||
          r.buyer.toLowerCase().includes(q) ||
          r.consultant.toLowerCase().includes(q) ||
          r.vehicle.toLowerCase().includes(q) ||
          r.preview.toLowerCase().includes(q)
      );
    }

    if (filters.flagType) data = data.filter((r) => r.flagType === filters.flagType);
    if (filters.risk) data = data.filter((r) => r.riskLevel === filters.risk);
    if (filters.status) data = data.filter((r) => r.status === filters.status);
    if (filters.city) data = data.filter((r) => r.city === filters.city);

    return data.sort((a, b) => b.riskScore - a.riskScore);
  }, [rows, search, filters]);

  const liveRows = useMemo(() => {
    let data = rows.filter((r) => r.active);

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.inquiryId.toLowerCase().includes(q) ||
          r.buyer.toLowerCase().includes(q) ||
          r.consultant.toLowerCase().includes(q) ||
          r.vehicle.toLowerCase().includes(q)
      );
    }

    if (filters.risk) data = data.filter((r) => r.riskLevel === filters.risk);
    if (filters.status) data = data.filter((r) => r.status === filters.status);
    if (filters.city) data = data.filter((r) => r.city === filters.city);

    return data.sort((a, b) => b.riskScore - a.riskScore);
  }, [rows, search, filters]);

  const stats = useMemo(() => {
    return {
      activeChats: rows.filter((r) => r.active).length,
      flaggedMessages: rows.filter((r) => r.flagType !== "Healthy chat").length,
      phoneLeakAttempts: rows.reduce((sum, r) => sum + r.phoneLeaks, 0),
      upiMentions: rows.reduce((sum, r) => sum + r.upiMentions, 0),
      abuseReports: rows.reduce((sum, r) => sum + r.abuseReports, 0),
      chatsFrozen: rows.filter((r) => r.status === "Frozen").length,
    };
  }, [rows]);

  const riskIntel = useMemo(() => {
    return {
      topConsultants: [
        { name: "Prime Wheels", count: 4, tone: "bad" },
        { name: "Elite Motors", count: 3, tone: "warn" },
        { name: "Cityline Motors", count: 2, tone: "warn" },
      ],
      topBuyers: [
        { name: "Priya Shah", count: 3, tone: "bad" },
        { name: "Sneha Verma", count: 2, tone: "warn" },
        { name: "Rahul Patel", count: 2, tone: "warn" },
      ],
      trend: [
        { label: "Phone Leak Trend", value: "18 today", tone: "bad" },
        { label: "Off-platform Ratio", value: "12.4%", tone: "warn" },
        { label: "Boost Leakage Risk", value: "Moderate", tone: "warn" },
      ],
    };
  }, []);

  const handleRefresh = () => {
    setRows([...DUMMY_CHATS]);
    setLastRefresh(new Date());
  };

  const handleClear = () => {
    setSearch("");
    setFilters({
      flagType: "",
      risk: "",
      status: "",
      city: "",
    });
    setFiltersOpen(false);
  };

  const handleDeleteConfirm = (item) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === item.id
          ? {
              ...r,
              preview: "[Deleted by admin]",
              lastMessage: "[Deleted by admin]",
              status: "Under Review",
              patternHistory: {
                ...r.patternHistory,
                deletedMessages: r.patternHistory.deletedMessages + 1,
              },
            }
          : r
      )
    );
    setModal(null);
  };

  const handleWarnConfirm = (item) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === item.id
          ? {
              ...r,
              riskScore: item.strike === "Yes" ? Math.min(r.riskScore + 8, 100) : r.riskScore,
              riskLevel:
                item.strike === "Yes"
                  ? scoreToRisk(Math.min(r.riskScore + 8, 100))
                  : r.riskLevel,
              patternHistory: {
                ...r.patternHistory,
                previousWarnings: r.patternHistory.previousWarnings + 1,
              },
            }
          : r
      )
    );
    setModal(null);
  };

  const handleFreezeConfirm = (item) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === item.id
          ? {
              ...r,
              status: "Frozen",
              active: false,
              frozenToday: true,
            }
          : r
      )
    );
    if (selectedChat?.id === item.id) {
      setSelectedChat((prev) => ({
        ...prev,
        status: "Frozen",
        active: false,
        frozenToday: true,
      }));
    }
    setModal(null);
  };

  const handleEscalateConfirm = (item) => {
    setRows((prev) =>
      prev.map((r) => (r.id === item.id ? { ...r, status: "Escalated" } : r))
    );
    if (selectedChat?.id === item.id) {
      setSelectedChat((prev) => ({ ...prev, status: "Escalated" }));
    }
    setModal(null);
  };

  const handleSuspendConfirm = (item) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === item.id ? { ...r, status: "Closed", active: false } : r
      )
    );
    if (selectedChat?.id === item.id) {
      setSelectedChat((prev) => ({ ...prev, status: "Closed", active: false }));
    }
    setModal(null);
  };

  const openWarnBuyer = (item) => setModal({ type: "warn", item, target: "Buyer" });
  const openWarnConsultant = (item) =>
    setModal({ type: "warn", item, target: "Consultant" });

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
              Chat Oversight
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-500">
              Monitor live chats, detect phone leaks, UPI/payment mentions, abuse,
              off-platform deal attempts, and take real-time moderation action with
              preserved audit evidence.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-medium text-slate-500 shadow-sm">
            <RefreshCw className="h-4 w-4 text-sky-600" />
            Auto-refresh every 10–20s • Last sync {lastRefresh.toLocaleTimeString()}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
          <TopCard title="Active Chats" value={stats.activeChats} icon={MessageSquareText} tone="good" />
          <TopCard title="Flagged Messages" value={stats.flaggedMessages} icon={ShieldAlert} tone="bad" />
          <TopCard title="Phone Leak Attempts" value={stats.phoneLeakAttempts} icon={Phone} tone="bad" />
          <TopCard title="UPI Mentions" value={stats.upiMentions} icon={IndianRupee} tone="warn" />
          <TopCard title="Abuse Reports" value={stats.abuseReports} icon={AlertTriangle} tone="warn" />
          <TopCard title="Chats Frozen" value={stats.chatsFrozen} icon={Lock} tone="bad" />
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
                  placeholder="Search by Chat ID, inquiry, buyer, consultant, vehicle..."
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

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveTab("flagged")}
                className={cls(
                  "inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-[13px] font-semibold transition-colors",
                  activeTab === "flagged"
                    ? "border-rose-200 bg-rose-50 text-rose-700"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                )}
              >
                <ShieldAlert className="h-4 w-4" />
                Flagged Messages Queue
              </button>

              <button
                onClick={() => setActiveTab("live")}
                className={cls(
                  "inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-[13px] font-semibold transition-colors",
                  activeTab === "live"
                    ? "border-sky-200 bg-sky-50 text-sky-700"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                )}
              >
                <Activity className="h-4 w-4" />
                Live Chat Stream
              </button>
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
                  value={filters.flagType}
                  onChange={(e) => setFilters((p) => ({ ...p, flagType: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400"
                >
                  <option value="">All Flag Types</option>
                  {FLAG_OPTIONS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <select
                  value={filters.risk}
                  onChange={(e) => setFilters((p) => ({ ...p, risk: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400"
                >
                  <option value="">All Risks</option>
                  {RISK_OPTIONS.map((item) => (
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
                  value={filters.city}
                  onChange={(e) => setFilters((p) => ({ ...p, city: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400"
                >
                  <option value="">All Cities</option>
                  {CITY_OPTIONS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {activeTab === "flagged" ? (
            <div className="w-full overflow-x-auto table-scroll relative z-10 pb-4">
              <table className="min-w-[1600px] w-full border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">Chat ID</th>
                    <th className="px-5 py-4 font-semibold whitespace-nowrap">Inquiry</th>
                    <th className="px-5 py-4 font-semibold whitespace-nowrap">Buyer</th>
                    <th className="px-5 py-4 font-semibold whitespace-nowrap">Consultant</th>
                    <th className="px-5 py-4 font-semibold whitespace-nowrap">Flag Type</th>
                    <th className="px-5 py-4 font-semibold whitespace-nowrap text-center">Risk Score</th>
                    <th className="px-5 py-4 font-semibold whitespace-nowrap">Message Preview</th>
                    <th className="px-5 py-4 font-semibold whitespace-nowrap">Time</th>
                    <th className="px-6 py-4 text-right font-semibold whitespace-nowrap">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {flaggedRows.length ? (
                    flaggedRows.map((row) => (
                      <tr
                        key={row.id}
                        className={cls(
                          "transition-colors duration-200 hover:bg-slate-50 group",
                          selectedChat?.id === row.id && "bg-sky-50"
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
                              <div className="mt-0.5 text-[12px] text-slate-500">{row.status}</div>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div>
                            <div className="text-[13px] font-medium text-slate-700">{row.inquiryId}</div>
                            <div className="text-[12px] text-slate-500">{row.vehicle}</div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="text-[13px] font-medium text-slate-700">{row.buyer}</div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="text-[13px] font-medium text-slate-700">{row.consultant}</div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={cls(
                              "inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap",
                              flagTypeBadge(row.flagType)
                            )}
                          >
                            {row.flagType}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-center">
                          <div
                            className={cls(
                              "inline-flex items-center justify-center min-w-[52px] h-9 rounded-xl text-[13px] font-bold border",
                              row.riskLevel === "High" &&
                                "bg-rose-50 text-rose-700 border-rose-200",
                              row.riskLevel === "Medium" &&
                                "bg-amber-50 text-amber-700 border-amber-200",
                              row.riskLevel === "Low" &&
                                "bg-emerald-50 text-emerald-700 border-emerald-200"
                            )}
                          >
                            {row.riskScore}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="max-w-[320px] text-[13px] text-slate-600 truncate">
                            {row.preview}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-[13px] font-medium text-slate-500 whitespace-nowrap">
                          {row.time}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <RowActions
                            item={row}
                            onView={setSelectedChat}
                            onDelete={(item) => setModal({ type: "delete", item })}
                            onWarn={openWarnBuyer}
                            onFreeze={(item) => setModal({ type: "freeze", item })}
                            onEscalate={(item) => setModal({ type: "escalate", item })}
                            onSuspend={(item) => setModal({ type: "suspend", item })}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <EmptyState
                      search={search}
                      filters={filters}
                      onClear={handleClear}
                      title="No flagged messages found"
                    />
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="w-full overflow-x-auto table-scroll relative z-10 pb-4">
              <table className="min-w-[1480px] w-full border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">Chat ID</th>
                    <th className="px-5 py-4 font-semibold whitespace-nowrap">Vehicle</th>
                    <th className="px-5 py-4 font-semibold whitespace-nowrap">Buyer</th>
                    <th className="px-5 py-4 font-semibold whitespace-nowrap">Consultant</th>
                    <th className="px-5 py-4 font-semibold whitespace-nowrap">Last Message</th>
                    <th className="px-5 py-4 font-semibold whitespace-nowrap">Risk</th>
                    <th className="px-5 py-4 font-semibold whitespace-nowrap">Status</th>
                    <th className="px-6 py-4 text-right font-semibold whitespace-nowrap">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {liveRows.length ? (
                    liveRows.map((row) => (
                      <tr
                        key={row.id}
                        className={cls(
                          "transition-colors duration-200 hover:bg-slate-50 group",
                          selectedChat?.id === row.id && "bg-sky-50"
                        )}
                      >
                        <td className="px-6 py-4">
                          <div className="text-[14px] font-bold text-slate-900">{row.id}</div>
                          <div className="text-[12px] text-slate-500">{row.inquiryId}</div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-start gap-2">
                            <CarFront className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                            <div className="text-[13px] font-medium text-slate-700">{row.vehicle}</div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-[13px] font-medium text-slate-700">
                          {row.buyer}
                        </td>

                        <td className="px-5 py-4 text-[13px] font-medium text-slate-700">
                          {row.consultant}
                        </td>

                        <td className="px-5 py-4">
                          <div className="max-w-[320px] text-[13px] text-slate-600 truncate">
                            {row.lastMessage}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={cls(
                              "inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap",
                              riskBadge(row.riskLevel)
                            )}
                          >
                            {row.riskLevel}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={cls(
                              "inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap",
                              statusBadge(row.status)
                            )}
                          >
                            {row.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <RowActions
                            item={row}
                            onView={setSelectedChat}
                            onDelete={(item) => setModal({ type: "delete", item })}
                            onWarn={openWarnBuyer}
                            onFreeze={(item) => setModal({ type: "freeze", item })}
                            onEscalate={(item) => setModal({ type: "escalate", item })}
                            onSuspend={(item) => setModal({ type: "suspend", item })}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <EmptyState
                      search={search}
                      filters={filters}
                      onClear={handleClear}
                      title="No live chats found"
                    />
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <IntelCard
            title="Top Consultants with Violations"
            rows={riskIntel.topConsultants}
          />
          <IntelCard
            title="Buyers with Most Warnings"
            rows={riskIntel.topBuyers}
          />
          <IntelCard
            title="Risk Intelligence"
            rows={riskIntel.trend}
          />
        </section>
      </div>

      <ChatDetailDrawer
        item={selectedChat}
        onClose={() => setSelectedChat(null)}
        onFreeze={(item) => setModal({ type: "freeze", item })}
        onWarnBuyer={openWarnBuyer}
        onWarnConsultant={openWarnConsultant}
        onDelete={(item) => setModal({ type: "delete", item })}
        onEscalate={(item) => setModal({ type: "escalate", item })}
        onCloseChat={(item) => handleSuspendConfirm(item)}
      />

      <DeleteMessageModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleDeleteConfirm}
      />

      <WarnUserModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleWarnConfirm}
      />

      <FreezeChatModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleFreezeConfirm}
      />

      <EscalateModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleEscalateConfirm}
      />

      <SuspendUserModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleSuspendConfirm}
      />
    </div>
  );
};

function EmptyState({ search, filters, onClear, title }) {
  return (
    <tr>
      <td colSpan={9} className="px-6 py-28 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-4">
            <Search size={28} />
          </div>
          <div className="text-lg font-bold text-slate-900 tracking-tight">{title}</div>
          <div className="mt-1 text-[14px] text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria or clear active filters to see more results.
          </div>
          {(search || Object.values(filters).some(Boolean)) && (
            <button
              onClick={onClear}
              className="mt-6 px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900"
            >
              Clear search & filters
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

function IntelCard({ title, rows = [] }) {
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
              {row.count ?? row.value}
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

export default ChatOversight;