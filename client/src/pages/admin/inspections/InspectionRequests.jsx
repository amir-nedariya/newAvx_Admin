import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  RefreshCw,
  MoreHorizontal,
  Eye,
  UserPlus,
  CalendarClock,
  X,
  BadgeDollarSign,
  AlertTriangle,
  NotebookPen,
  ShieldAlert,
  Car,
  User,
  Clock3,
  CheckCircle2,
  CalendarDays,
  FileText,
} from "lucide-react";
const cls = (...a) => a.filter(Boolean).join(" ");

/* =========================================================
   DUMMY DATA
========================================================= */
const DUMMY_REQUESTS = [
  {
    id: "INSP-1001",
    vehicleId: "VH-7812",
    vehicle: "Hyundai Creta SX 2021",
    requestedBy: "Buyer",
    buyer: "Arjun Mehta",
    buyerId: "USR-10231",
    consultant: "Metro Auto Hub",
    consultantTier: "Premium",
    city: "Ahmedabad",
    inspectionType: "Premium",
    paymentStatus: "Paid",
    amount: "₹2,499",
    paidBy: "Buyer",
    paymentMode: "UPI",
    transactionId: "TXN-AX91K2",
    refundStatus: "Not Initiated",
    assigned: true,
    inspectorAssigned: "Rahul Inspector",
    inspectorCity: "Ahmedabad",
    inspectorAvailability: "Available Today",
    inspectorResponse: "Accepted",
    status: "Assigned",
    scheduledDate: "12 Mar 2026",
    preferredDate: "12 Mar 2026",
    preferredSlots: ["10:00 AM - 12:00 PM", "2:00 PM - 4:00 PM"],
    requestedOn: "10 Mar 2026",
    location: "Ahmedabad",
    sla: "Within SLA",
    slaBreached: false,
  },
  {
    id: "INSP-1002",
    vehicleId: "VH-9002",
    vehicle: "Tata Nexon XZ+ 2022",
    requestedBy: "Consultant",
    buyer: "Priya Shah",
    buyerId: "USR-10232",
    consultant: "City Drive",
    consultantTier: "Pro",
    city: "Surat",
    inspectionType: "Basic",
    paymentStatus: "Pending",
    amount: "₹999",
    paidBy: "Consultant",
    paymentMode: "Card",
    transactionId: "TXN-QW22N1",
    refundStatus: "Not Applicable",
    assigned: false,
    inspectorAssigned: "",
    inspectorCity: "",
    inspectorAvailability: "",
    inspectorResponse: "",
    status: "Awaiting Assignment",
    scheduledDate: "—",
    preferredDate: "13 Mar 2026",
    preferredSlots: ["11:00 AM - 1:00 PM"],
    requestedOn: "10 Mar 2026",
    location: "Surat",
    sla: "Assignment due in 1h",
    slaBreached: false,
  },
  {
    id: "INSP-1003",
    vehicleId: "VH-5510",
    vehicle: "Honda City ZX 2022",
    requestedBy: "Buyer",
    buyer: "Faizan Khan",
    buyerId: "USR-10235",
    consultant: "Elite Motors",
    consultantTier: "Premium",
    city: "Ahmedabad",
    inspectionType: "Video",
    paymentStatus: "Paid",
    amount: "₹1,499",
    paidBy: "Buyer",
    paymentMode: "UPI",
    transactionId: "TXN-ZX77K9",
    refundStatus: "Not Initiated",
    assigned: true,
    inspectorAssigned: "Nisha Patel",
    inspectorCity: "Ahmedabad",
    inspectorAvailability: "Today 4 PM",
    inspectorResponse: "Accepted",
    status: "In Progress",
    scheduledDate: "10 Mar 2026",
    preferredDate: "10 Mar 2026",
    preferredSlots: ["4:00 PM - 5:00 PM"],
    requestedOn: "09 Mar 2026",
    location: "Ahmedabad",
    sla: "Inspection in progress",
    slaBreached: false,
  },
  {
    id: "INSP-1004",
    vehicleId: "VH-3022",
    vehicle: "Mahindra Scorpio N Z8 2023",
    requestedBy: "Buyer",
    buyer: "Rohan Desai",
    buyerId: "USR-10240",
    consultant: "Torque Wheels",
    consultantTier: "Pro",
    city: "Vadodara",
    inspectionType: "Premium",
    paymentStatus: "Paid",
    amount: "₹2,499",
    paidBy: "Buyer",
    paymentMode: "Net Banking",
    transactionId: "TXN-LM01T9",
    refundStatus: "Pending",
    assigned: true,
    inspectorAssigned: "Vikram Joshi",
    inspectorCity: "Vadodara",
    inspectorAvailability: "Tomorrow 11 AM",
    inspectorResponse: "Accepted",
    status: "Refund Pending",
    scheduledDate: "11 Mar 2026",
    preferredDate: "11 Mar 2026",
    preferredSlots: ["11:00 AM - 1:00 PM"],
    requestedOn: "08 Mar 2026",
    location: "Vadodara",
    sla: "Refund review",
    slaBreached: false,
  },
  {
    id: "INSP-1005",
    vehicleId: "VH-4431",
    vehicle: "Toyota Innova Crysta 2021",
    requestedBy: "Consultant",
    buyer: "Sneha Verma",
    buyerId: "USR-10234",
    consultant: "Royal Cars",
    consultantTier: "Premium",
    city: "Rajkot",
    inspectionType: "Basic",
    paymentStatus: "Refunded",
    amount: "₹999",
    paidBy: "Consultant",
    paymentMode: "UPI",
    transactionId: "TXN-HJ66P2",
    refundStatus: "Completed",
    assigned: false,
    inspectorAssigned: "",
    inspectorCity: "",
    inspectorAvailability: "",
    inspectorResponse: "",
    status: "Cancelled",
    scheduledDate: "—",
    preferredDate: "09 Mar 2026",
    preferredSlots: ["9:00 AM - 11:00 AM"],
    requestedOn: "07 Mar 2026",
    location: "Rajkot",
    sla: "Closed",
    slaBreached: false,
  },
  {
    id: "INSP-1006",
    vehicleId: "VH-6201",
    vehicle: "Kia Seltos GTX 2020",
    requestedBy: "Buyer",
    buyer: "Nirali Shah",
    buyerId: "USR-10510",
    consultant: "Prime Wheels",
    consultantTier: "Premium",
    city: "Surat",
    inspectionType: "Premium",
    paymentStatus: "Paid",
    amount: "₹2,499",
    paidBy: "Buyer",
    paymentMode: "UPI",
    transactionId: "TXN-SL77A1",
    refundStatus: "Not Initiated",
    assigned: true,
    inspectorAssigned: "Mehul Trivedi",
    inspectorCity: "Surat",
    inspectorAvailability: "Busy",
    inspectorResponse: "Accepted",
    status: "SLA Breached",
    scheduledDate: "09 Mar 2026",
    preferredDate: "09 Mar 2026",
    preferredSlots: ["3:00 PM - 5:00 PM"],
    requestedOn: "07 Mar 2026",
    location: "Surat",
    sla: "Report overdue by 6h",
    slaBreached: true,
  },
];

const STATUS_OPTIONS = [
  "New",
  "Awaiting Assignment",
  "Assigned",
  "Scheduled",
  "In Progress",
  "Completed",
  "Report Submitted",
  "Cancelled",
  "Refund Pending",
  "SLA Breached",
];

const REQUEST_TYPE_OPTIONS = ["Buyer", "Consultant"];
const INSPECTION_TYPE_OPTIONS = ["Basic", "Premium", "Video"];

/* =========================================================
   BADGES
========================================================= */
const statusBadge = (status) => {
  const map = {
    New: "bg-sky-50 text-sky-700 border-sky-200",
    "Awaiting Assignment": "bg-amber-50 text-amber-700 border-amber-200",
    Assigned: "bg-indigo-50 text-indigo-700 border-indigo-200",
    Scheduled: "bg-violet-50 text-violet-700 border-violet-200",
    "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Report Submitted": "bg-teal-50 text-teal-700 border-teal-200",
    Cancelled: "bg-slate-100 text-slate-700 border-slate-200",
    "Refund Pending": "bg-orange-50 text-orange-700 border-orange-200",
    "SLA Breached": "bg-rose-50 text-rose-700 border-rose-200",
  };
  return map[status] || "bg-slate-100 text-slate-700 border-slate-200";
};

const paymentBadge = (status) => {
  const map = {
    Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Refunded: "bg-slate-100 text-slate-700 border-slate-200",
  };
  return map[status] || "bg-slate-100 text-slate-700 border-slate-200";
};

const typeBadge = (type) => {
  const map = {
    Buyer: "bg-sky-50 text-sky-700 border-sky-200",
    Consultant: "bg-violet-50 text-violet-700 border-violet-200",
  };
  return map[type] || "bg-slate-100 text-slate-700 border-slate-200";
};

const slaBadge = (breached, text) =>
  breached
    ? "bg-rose-50 text-rose-700 border-rose-200"
    : text?.toLowerCase().includes("due")
    ? "bg-amber-50 text-amber-700 border-amber-200"
    : "bg-emerald-50 text-emerald-700 border-emerald-200";

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

function InfoRow({ label, value }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-slate-400">{label}</div>
      <div className="mt-1 text-[13px] font-medium text-slate-700">{value}</div>
    </div>
  );
}

function MiniMetric({ title, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </div>
      <div className="mt-1 text-[15px] font-bold text-slate-900 break-words">{value}</div>
    </div>
  );
}

/* =========================================================
   ROW ACTIONS
========================================================= */
function InspectionRowActions({
  item,
  onView,
  onAssign,
  onReschedule,
  onCancel,
  onRefund,
  onEscalate,
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
        <div className="absolute right-0 top-11 z-30 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
          <button
            onClick={() => {
              onView(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Eye className="h-4 w-4 text-slate-500" />
            View Details
          </button>

          <button
            onClick={() => {
              onAssign(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-sky-700 hover:bg-sky-50 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            Assign Inspector
          </button>

          <button
            onClick={() => {
              onReschedule(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-indigo-700 hover:bg-indigo-50 transition-colors"
          >
            <CalendarClock className="h-4 w-4" />
            Reschedule
          </button>

          <button
            onClick={() => {
              onCancel(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-rose-700 hover:bg-rose-50 transition-colors"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>

          <button
            onClick={() => {
              onRefund(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-amber-700 hover:bg-amber-50 transition-colors"
          >
            <BadgeDollarSign className="h-4 w-4" />
            Initiate Refund
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
   DETAIL DRAWER
========================================================= */
function InspectionDetailDrawer({
  item,
  onClose,
  onAssign,
  onCancel,
  onEscalate,
  onComplete,
}) {
  if (!item) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-[640px] border-l border-slate-200 bg-white shadow-2xl flex flex-col">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 bg-slate-50">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{item.id}</h3>
            <p className="mt-1 text-sm text-slate-500">
              {item.vehicle} • {item.vehicleId}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span
                className={cls(
                  "inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold border",
                  typeBadge(item.requestedBy)
                )}
              >
                {item.requestedBy}
              </span>
              <span
                className={cls(
                  "inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold border",
                  paymentBadge(item.paymentStatus)
                )}
              >
                {item.paymentStatus}
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
                  slaBadge(item.slaBreached, item.sla)
                )}
              >
                {item.sla}
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
            <MiniMetric title="Consultant" value={item.consultant} />
            <MiniMetric title="Inspection Type" value={item.inspectionType} />
            <MiniMetric title="Buyer" value={item.buyer || "—"} />
            <MiniMetric title="Scheduled Date" value={item.scheduledDate} />
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
              Request Information
            </h4>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <InfoRow label="Requested By" value={item.requestedBy} />
              <InfoRow label="Inspection Type" value={item.inspectionType} />
              <InfoRow label="Requested On" value={item.requestedOn} />
              <InfoRow label="Preferred Date" value={item.preferredDate} />
              <InfoRow label="Location" value={item.location} />
              <InfoRow label="Preferred Slots" value={item.preferredSlots.join(", ")} />
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
              Payment Details
            </h4>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <InfoRow label="Amount" value={item.amount} />
              <InfoRow label="Paid By" value={item.paidBy} />
              <InfoRow label="Payment Mode" value={item.paymentMode} />
              <InfoRow label="Transaction ID" value={item.transactionId} />
              <InfoRow label="Payment Status" value={item.paymentStatus} />
              <InfoRow label="Refund Status" value={item.refundStatus} />
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
              Scheduling Panel
            </h4>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <InfoRow label="Scheduled Date" value={item.scheduledDate} />
              <InfoRow label="Preferred Slots" value={item.preferredSlots.join(", ")} />
              <InfoRow label="Assigned Inspector" value={item.inspectorAssigned || "Awaiting Inspector"} />
              <InfoRow label="Confirmed Status" value={item.inspectorResponse || "Pending"} />
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
              Inspector Assignment Status
            </h4>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <InfoRow label="Inspector" value={item.inspectorAssigned || "Awaiting Inspector"} />
              <InfoRow label="City" value={item.inspectorCity || "—"} />
              <InfoRow label="Availability" value={item.inspectorAvailability || "—"} />
              <InfoRow label="Accepted / Rejected" value={item.inspectorResponse || "Pending"} />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <button
              onClick={() => onAssign(item)}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-[13px] font-semibold text-white hover:bg-sky-700"
            >
              <UserPlus className="h-4 w-4" />
              Assign Inspector
            </button>

            <button
              onClick={() => onCancel(item)}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] font-semibold text-rose-700 hover:bg-rose-100"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>

            <button
              onClick={() => onEscalate(item)}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] font-semibold text-amber-700 hover:bg-amber-100"
            >
              <AlertTriangle className="h-4 w-4" />
              Escalate
            </button>

            <button
              onClick={() => onComplete(item)}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] font-semibold text-emerald-700 hover:bg-emerald-100"
            >
              <CheckCircle2 className="h-4 w-4" />
              Mark Complete
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
function AssignInspectorModal({ modal, onClose, onConfirm }) {
  const [inspector, setInspector] = useState("Rahul Inspector");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");

  useEffect(() => {
    if (modal?.type === "assign") {
      setInspector("Rahul Inspector");
      setDate("");
      setSlot("");
    }
  }, [modal]);

  if (!modal || modal.type !== "assign") return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[61] w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Assign Inspector</h3>
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
            <label className="mb-2 block text-[13px] font-medium text-slate-700">Inspector</label>
            <select
              value={inspector}
              onChange={(e) => setInspector(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-slate-900 text-[13px]"
            >
              <option>Rahul Inspector</option>
              <option>Nisha Patel</option>
              <option>Vikram Joshi</option>
              <option>Mehul Trivedi</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-medium text-slate-700">Schedule Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-slate-900 text-[13px]"
            />
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-medium text-slate-700">Time Slot</label>
            <input
              type="text"
              value={slot}
              onChange={(e) => setSlot(e.target.value)}
              placeholder="e.g. 10:00 AM - 12:00 PM"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-slate-900 text-[13px]"
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
                assignInspector: inspector,
                assignDate: date,
                assignSlot: slot,
              })
            }
            className="rounded-xl bg-sky-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-sky-700 transition-colors"
          >
            Confirm Assign
          </button>
        </div>
      </div>
    </>
  );
}

function CancelInspectionModal({ modal, onClose, onConfirm }) {
  const [reason, setReason] = useState("Buyer cancellation");
  const [refund, setRefund] = useState("Yes");

  useEffect(() => {
    if (modal?.type === "cancel") {
      setReason("Buyer cancellation");
      setRefund("Yes");
    }
  }, [modal]);

  if (!modal || modal.type !== "cancel") return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[61] w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Cancel Inspection</h3>
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
              <option>Buyer cancellation</option>
              <option>Consultant refusal</option>
              <option>Vehicle unavailable</option>
              <option>Payment issue</option>
              <option>Inspector unavailable</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-medium text-slate-700">Refund?</label>
            <div className="grid grid-cols-2 gap-3">
              {["Yes", "No"].map((item) => (
                <button
                  key={item}
                  onClick={() => setRefund(item)}
                  className={cls(
                    "rounded-xl border px-4 py-2.5 text-[13px] font-semibold transition-all",
                    refund === item
                      ? "border-rose-300 bg-rose-50 text-rose-700"
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
                cancelReason: reason,
                refundChoice: refund,
              })
            }
            className="rounded-xl bg-rose-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-rose-700 transition-colors"
          >
            Confirm Cancel
          </button>
        </div>
      </div>
    </>
  );
}

function EscalateModal({ modal, onClose, onConfirm }) {
  const [reason, setReason] = useState("Inspector delayed");

  useEffect(() => {
    if (modal?.type === "escalate") setReason("Inspector delayed");
  }, [modal]);

  if (!modal || modal.type !== "escalate") return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[61] w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Escalate Request</h3>
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
            <option>Inspector delayed</option>
            <option>Dispute expected</option>
            <option>SLA breach</option>
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
            onClick={() => onConfirm({ ...modal.item, escalateReason: reason })}
            className="rounded-xl bg-amber-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-amber-700 transition-colors"
          >
            Confirm Escalate
          </button>
        </div>
      </div>
    </>
  );
}

function RefundModal({ modal, onClose, onConfirm }) {
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (modal?.type === "refund") setComment("");
  }, [modal]);

  if (!modal || modal.type !== "refund") return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[61] w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Initiate Refund</h3>
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
          <label className="mb-2 block text-[13px] font-medium text-slate-700">Comment</label>
          <textarea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter refund note..."
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-slate-900 text-[13px]"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm({ ...modal.item, refundComment: comment })}
            className="rounded-xl bg-orange-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-orange-700 transition-colors"
          >
            Start Refund
          </button>
        </div>
      </div>
    </>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */
const InspectionRequests = () => {
  const [rows, setRows] = useState(DUMMY_REQUESTS);
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [quickFilter, setQuickFilter] = useState("all");
  const [filters, setFilters] = useState({
    status: "",
    requestType: "",
    inspectionType: "",
    inspectorAssigned: "",
    paymentStatus: "",
    city: "",
    slaBreached: "",
  });

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modal, setModal] = useState(null);

  const uniqueCities = useMemo(() => [...new Set(rows.map((r) => r.city))], [rows]);

  const summary = useMemo(() => {
    return {
      newRequests: rows.filter((r) => r.status === "New" || r.status === "Awaiting Assignment").length,
      assigned: rows.filter((r) => r.status === "Assigned" || r.status === "Scheduled").length,
      inProgress: rows.filter((r) => r.status === "In Progress").length,
      completed: rows.filter((r) => r.status === "Completed" || r.status === "Report Submitted").length,
      cancelled: rows.filter((r) => r.status === "Cancelled").length,
      refundPending: rows.filter((r) => r.status === "Refund Pending").length,
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
          r.buyerId.toLowerCase().includes(q) ||
          r.consultant.toLowerCase().includes(q) ||
          r.city.toLowerCase().includes(q) ||
          r.vehicle.toLowerCase().includes(q)
      );
    }

    if (filters.status) data = data.filter((r) => r.status === filters.status);
    if (filters.requestType) data = data.filter((r) => r.requestedBy === filters.requestType);
    if (filters.inspectionType) data = data.filter((r) => r.inspectionType === filters.inspectionType);
    if (filters.inspectorAssigned) {
      data = data.filter((r) =>
        filters.inspectorAssigned === "Yes" ? r.assigned : !r.assigned
      );
    }
    if (filters.paymentStatus) data = data.filter((r) => r.paymentStatus === filters.paymentStatus);
    if (filters.city) data = data.filter((r) => r.city === filters.city);
    if (filters.slaBreached) {
      data = data.filter((r) =>
        filters.slaBreached === "Yes" ? r.slaBreached : !r.slaBreached
      );
    }

    if (quickFilter === "new")
      data = data.filter((r) => r.status === "New" || r.status === "Awaiting Assignment");
    if (quickFilter === "assigned")
      data = data.filter((r) => r.status === "Assigned" || r.status === "Scheduled");
    if (quickFilter === "progress") data = data.filter((r) => r.status === "In Progress");
    if (quickFilter === "completed")
      data = data.filter((r) => r.status === "Completed" || r.status === "Report Submitted");
    if (quickFilter === "cancelled") data = data.filter((r) => r.status === "Cancelled");
    if (quickFilter === "refund") data = data.filter((r) => r.status === "Refund Pending");

    return data;
  }, [rows, search, filters, quickFilter]);

  const handleRefresh = () => setRows([...DUMMY_REQUESTS]);

  const handleClear = () => {
    setSearch("");
    setQuickFilter("all");
    setFilters({
      status: "",
      requestType: "",
      inspectionType: "",
      inspectorAssigned: "",
      paymentStatus: "",
      city: "",
      slaBreached: "",
    });
    setFiltersOpen(false);
  };

  const handleAssignConfirm = (item) => {
    const nextDate = item.assignDate || item.scheduledDate;
    setRows((prev) =>
      prev.map((r) =>
        r.id === item.id
          ? {
              ...r,
              assigned: true,
              inspectorAssigned: item.assignInspector,
              scheduledDate: nextDate,
              inspectorResponse: "Accepted",
              status: "Assigned",
            }
          : r
      )
    );

    if (selectedRequest?.id === item.id) {
      setSelectedRequest((prev) => ({
        ...prev,
        assigned: true,
        inspectorAssigned: item.assignInspector,
        scheduledDate: nextDate,
        inspectorResponse: "Accepted",
        status: "Assigned",
      }));
    }

    setModal(null);
  };

  const handleCancelConfirm = (item) => {
    const nextPayment =
      item.refundChoice === "Yes" && item.paymentStatus === "Paid"
        ? "Paid"
        : item.paymentStatus;
    const nextStatus =
      item.refundChoice === "Yes" && item.paymentStatus === "Paid"
        ? "Refund Pending"
        : "Cancelled";

    setRows((prev) =>
      prev.map((r) =>
        r.id === item.id
          ? {
              ...r,
              status: nextStatus,
              refundStatus:
                item.refundChoice === "Yes" ? "Pending" : r.refundStatus,
              paymentStatus: nextPayment,
            }
          : r
      )
    );

    if (selectedRequest?.id === item.id) {
      setSelectedRequest((prev) => ({
        ...prev,
        status: nextStatus,
        refundStatus: item.refundChoice === "Yes" ? "Pending" : prev.refundStatus,
        paymentStatus: nextPayment,
      }));
    }

    setModal(null);
  };

  const handleEscalateConfirm = (item) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === item.id
          ? { ...r, status: "SLA Breached", slaBreached: true, sla: "Escalated to Ops" }
          : r
      )
    );

    if (selectedRequest?.id === item.id) {
      setSelectedRequest((prev) => ({
        ...prev,
        status: "SLA Breached",
        slaBreached: true,
        sla: "Escalated to Ops",
      }));
    }

    setModal(null);
  };

  const handleRefundConfirm = (item) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === item.id
          ? { ...r, status: "Refund Pending", refundStatus: "Pending" }
          : r
      )
    );

    if (selectedRequest?.id === item.id) {
      setSelectedRequest((prev) => ({
        ...prev,
        status: "Refund Pending",
        refundStatus: "Pending",
      }));
    }

    setModal(null);
  };

  const handleComplete = (item) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === item.id ? { ...r, status: "Completed", sla: "Completed" } : r
      )
    );

    if (selectedRequest?.id === item.id) {
      setSelectedRequest((prev) => ({
        ...prev,
        status: "Completed",
        sla: "Completed",
      }));
    }
  };

  const handleReschedule = (item) => {
    alert(`Reschedule request ${item.id}`);
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
              Inspection Requests
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-500">
              Manage inspection bookings, assignment, payments, scheduling, SLA,
              cancellations and refund governance.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
          <TopCard
            title="New Requests"
            value={summary.newRequests}
            icon={FileText}
            active={quickFilter === "new"}
            onClick={() => setQuickFilter("new")}
          />
          <TopCard
            title="Assigned"
            value={summary.assigned}
            icon={UserPlus}
            active={quickFilter === "assigned"}
            onClick={() => setQuickFilter("assigned")}
          />
          <TopCard
            title="In Progress"
            value={summary.inProgress}
            icon={Clock3}
            active={quickFilter === "progress"}
            onClick={() => setQuickFilter("progress")}
          />
          <TopCard
            title="Completed"
            value={summary.completed}
            icon={CheckCircle2}
            active={quickFilter === "completed"}
            onClick={() => setQuickFilter("completed")}
          />
          <TopCard
            title="Cancelled"
            value={summary.cancelled}
            icon={X}
            active={quickFilter === "cancelled"}
            onClick={() => setQuickFilter("cancelled")}
          />
          <TopCard
            title="Refund Pending"
            value={summary.refundPending}
            icon={BadgeDollarSign}
            active={quickFilter === "refund"}
            onClick={() => setQuickFilter("refund")}
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
                  placeholder="Search by Request ID, Vehicle ID, Buyer ID, Consultant, City..."
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
              <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-200 pt-5 md:grid-cols-2 xl:grid-cols-7">
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
                  value={filters.requestType}
                  onChange={(e) => setFilters((p) => ({ ...p, requestType: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">Request Type</option>
                  {REQUEST_TYPE_OPTIONS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <select
                  value={filters.inspectionType}
                  onChange={(e) => setFilters((p) => ({ ...p, inspectionType: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">Inspection Type</option>
                  {INSPECTION_TYPE_OPTIONS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <select
                  value={filters.inspectorAssigned}
                  onChange={(e) => setFilters((p) => ({ ...p, inspectorAssigned: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">Inspector Assigned</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>

                <select
                  value={filters.paymentStatus}
                  onChange={(e) => setFilters((p) => ({ ...p, paymentStatus: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">Payment Status</option>
                  <option>Paid</option>
                  <option>Pending</option>
                  <option>Refunded</option>
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

                <select
                  value={filters.slaBreached}
                  onChange={(e) => setFilters((p) => ({ ...p, slaBreached: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">SLA Breached</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            )}
          </div>

          <div className="w-full overflow-x-auto table-scroll relative z-10 pb-4">
            <table className="min-w-[1600px] w-full border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Request ID</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Vehicle</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Requested By</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Type</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">City</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Payment</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Assigned</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Status</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Scheduled Date</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">SLA</th>
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
                        selectedRequest?.id === row.id && "bg-sky-50"
                      )}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-100 to-blue-100 border border-slate-200 flex items-center justify-center shrink-0">
                            <FileText className="h-4 w-4 text-sky-700" />
                          </div>
                          <div>
                            <div className="text-[14px] font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                              {row.id}
                            </div>
                            <div className="mt-0.5 text-[12px] text-slate-500">{row.vehicleId}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="min-w-[220px]">
                          <div className="text-[13px] font-medium text-slate-700">{row.vehicle}</div>
                          <div className="mt-1 text-[12px] text-slate-500">{row.consultant}</div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="min-w-[160px]">
                          <div className="text-[13px] font-medium text-slate-700">
                            {row.requestedBy === "Buyer" ? row.buyer : row.consultant}
                          </div>
                          <div className="mt-1 text-[12px] text-slate-500">
                            {row.requestedBy === "Buyer" ? row.buyerId : row.consultant}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={cls(
                            "inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap",
                            typeBadge(row.requestedBy)
                          )}
                        >
                          {row.inspectionType}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-[13px] font-medium text-slate-500">
                        {row.city}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={cls(
                            "inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap",
                            paymentBadge(row.paymentStatus)
                          )}
                        >
                          {row.paymentStatus}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-[13px] font-medium text-slate-500 whitespace-nowrap">
                        {row.assigned ? row.inspectorAssigned : "No"}
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

                      <td className="px-5 py-4 text-[13px] font-medium text-slate-500 whitespace-nowrap">
                        {row.scheduledDate}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={cls(
                            "inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap",
                            slaBadge(row.slaBreached, row.sla)
                          )}
                        >
                          {row.sla}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <InspectionRowActions
                          item={row}
                          onView={setSelectedRequest}
                          onAssign={(item) => setModal({ type: "assign", item })}
                          onReschedule={handleReschedule}
                          onCancel={(item) => setModal({ type: "cancel", item })}
                          onRefund={(item) => setModal({ type: "refund", item })}
                          onEscalate={(item) => setModal({ type: "escalate", item })}
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
                          No inspection requests found
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

      <InspectionDetailDrawer
        item={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onAssign={(item) => setModal({ type: "assign", item })}
        onCancel={(item) => setModal({ type: "cancel", item })}
        onEscalate={(item) => setModal({ type: "escalate", item })}
        onComplete={handleComplete}
      />

      <AssignInspectorModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleAssignConfirm}
      />

      <CancelInspectionModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleCancelConfirm}
      />

      <EscalateModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleEscalateConfirm}
      />

      <RefundModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleRefundConfirm}
      />
    </div>
  );
};

export default InspectionRequests;