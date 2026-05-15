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
  Clock3,
  CheckCircle2,
  FileText,
  Loader2,
  XCircle,
  CreditCard,
  ClipboardCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { 
  getAllVehicleInspections, 
  getAllVehicleInspectionAssigned, 
  assignInspector,
  getVehicleInspectionById,
  getVehicleInspectionAssignmentById,
  approveInspection,
  rejectInspection
} from "../../../api/vehicleInspection.api";
import { getAllInspectors } from "../../../api/inspector.api";
import InspectionRequestDetail from "./modal/InspectionRequestDetail";
import InspectionCommonDetail from "./modal/InspectionCommonDetail";
import { ChevronDown } from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

/* =========================================================
   CONSTANTS
========================================================= */

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
    // Enum values from API
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    AWAITING_ASSIGNMENT: "bg-amber-50 text-amber-700 border-amber-200",
    ASSIGNED: "bg-indigo-50 text-indigo-700 border-indigo-200",
    SCHEDULED: "bg-violet-50 text-violet-700 border-violet-200",
    IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    REPORT_SUBMITTED: "bg-teal-50 text-teal-700 border-teal-200",
    CANCELLED: "bg-slate-100 text-slate-700 border-slate-200",
    REFUND_PENDING: "bg-orange-50 text-orange-700 border-orange-200",
    SLA_BREACHED: "bg-rose-50 text-rose-700 border-rose-200",
    ESCALATED: "bg-rose-50 text-rose-700 border-rose-200",
    // Legacy display values
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
function TopCard({ title, value, icon: Icon }) {
  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-6 overflow-hidden shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative z-10 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[12px] font-bold uppercase tracking-[0.15em] mb-2 text-slate-400">
            {title}
          </div>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900 break-words leading-tight">
            {value}
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 bg-sky-50 border-sky-100 text-sky-600">
          <Icon size={18} />
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
  activeTab,
  onView,
  onAssign,
  onReschedule,
  onCancel,
  onRefund,
  onApprove,
  onReject,
  onReview,
  onPayment,
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

          {activeTab === "PENDING" && (
            <>
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
            </>
          )}

          {activeTab === "SUBMITTED" && (
            <>
              <button
                onClick={() => {
                  onReview(item);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-sky-700 hover:bg-sky-50 transition-colors border-t border-slate-100"
              >
                <ClipboardCheck className="h-4 w-4" />
                Review Report
              </button>
              <button
                onClick={() => {
                  onApprove(item);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                <CheckCircle2 className="h-4 w-4" />
                Approve Report
              </button>
              <button
                onClick={() => {
                  onReject(item);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-rose-700 hover:bg-rose-50 transition-colors"
              >
                <XCircle className="h-4 w-4" />
                Reject Report
              </button>
            </>
          )}

          {activeTab === "COMPLETED" && (
            <>
              <button
                onClick={() => {
                  onReview(item);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-sky-700 hover:bg-sky-50 transition-colors border-t border-slate-100"
              >
                <ClipboardCheck className="h-4 w-4" />
                Review Report
              </button>
              <button
                onClick={() => {
                  onPayment(item);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                <CreditCard className="h-4 w-4" />
                Payment Details
              </button>
            </>
          )}
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
  const [selectedInspector, setSelectedInspector] = useState(null);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [inspectors, setInspectors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (modal?.type === "assign") {
      fetchInspectors();
      setSelectedInspector(null);
      setDate("");
      setSlot("");
      setSearchQuery("");
      setDropdownOpen(false);
      setActiveIndex(-1);
    }
  }, [modal]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchInspectors = async () => {
    try {
      setLoading(true);
      const res = await getAllInspectors(1);
      // Assuming res.data contains the list based on common patterns in this repo
      // or if it's direct array. User said getAllInspectors returns response.data
      // Let's handle both common cases
      setInspectors(res.inspectors || res.docs || res.data || (Array.isArray(res) ? res : []));
    } catch (error) {
      console.error("Error fetching inspectors:", error);
      toast.error("Failed to load inspectors");
    } finally {
      setLoading(false);
    }
  };

  const filteredInspectors = useMemo(() => {
    let data = inspectors;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = inspectors.filter(
        (ins) =>
          `${ins.firstname} ${ins.lastname}`.toLowerCase().includes(q) ||
          ins.inspectorUsername?.toLowerCase().includes(q)
      );
    }
    return data;
  }, [inspectors, searchQuery]);

  useEffect(() => {
    setActiveIndex(filteredInspectors.length > 0 ? 0 : -1);
  }, [filteredInspectors]);

  const handleKeyDown = (e) => {
    if (!dropdownOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < filteredInspectors.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < filteredInspectors.length) {
        const ins = filteredInspectors[activeIndex];
        setSelectedInspector(ins);
        setDropdownOpen(false);
        setSearchQuery("");
      }
    } else if (e.key === "Escape") {
      setDropdownOpen(false);
    }
  };

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
          <div className="relative" ref={dropdownRef}>
            <label className="mb-2 block text-[13px] font-medium text-slate-700">Inspector</label>
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex w-full items-center justify-between cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus-within:border-sky-400 text-slate-900 text-[13px]"
            >
              <span className={!selectedInspector ? "text-slate-400" : ""}>
                {selectedInspector
                  ? `${selectedInspector.firstname} ${selectedInspector.lastname}`
                  : "Select Inspector"}
              </span>
              <ChevronDown className={cls("h-4 w-4 text-slate-400 transition-transform", dropdownOpen && "rotate-180")} />
            </div>

            {dropdownOpen && (
              <div className="absolute left-0 right-0 z-20 mt-2 rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden flex flex-col max-h-[300px]">
                <div className="p-2 border-b border-slate-100">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search inspector..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full rounded-lg border border-slate-100 bg-slate-50 py-2 pl-9 pr-4 text-[13px] outline-none focus:border-sky-300"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>

                <div className="overflow-y-auto flex-1">
                  {loading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-5 w-5 animate-spin text-sky-600" />
                    </div>
                  ) : filteredInspectors.length > 0 ? (
                    filteredInspectors.map((ins, index) => (
                      <div
                        key={ins._id || ins.id}
                        onClick={() => {
                          setSelectedInspector(ins);
                          setDropdownOpen(false);
                          setSearchQuery("");
                        }}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={cls(
                          "px-4 py-2.5 cursor-pointer transition-colors border-b border-slate-50 last:border-0",
                          activeIndex === index ? "bg-sky-50" : "bg-white"
                        )}
                      >
                        <div className="text-[13px] font-bold text-slate-900">
                          {ins.firstname} {ins.lastname}
                        </div>
                        <div className="text-[11px] text-slate-500">{ins.inspectorUsername}</div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-[13px] text-slate-500">No inspectors found</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-medium text-slate-700">Schedule Date</label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-slate-900 text-[13px]"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-4">
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
                assignInspector: selectedInspector?.id || selectedInspector?._id,
                assignDate: date,
                assignSlot: slot,
              })
            }
            disabled={!selectedInspector}
            className="rounded-xl bg-sky-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

function ApproveInspectionModal({ modal, onClose, onConfirm }) {
  if (!modal || modal.type !== "approve") return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[61] w-[95%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Approve Inspection</h3>
            <p className="mt-1 text-[13px] text-slate-500">Are you sure you want to approve this inspection report?</p>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(modal.item)}
            className="rounded-xl bg-emerald-600 px-6 py-2 text-[13px] font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            Yes, Approve
          </button>
        </div>
      </div>
    </>
  );
}

function RejectInspectionModal({ modal, onClose, onConfirm }) {
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    if (modal?.type === "reject") setRemarks("");
  }, [modal]);

  if (!modal || modal.type !== "reject") return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[61] w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Reject Inspection</h3>
            <p className="mt-1 text-[13px] text-slate-500">Please provide a reason for rejecting this report.</p>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-[13px] font-medium text-slate-700">Rejection Remarks</label>
          <textarea
            rows={4}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Type rejection reason here..."
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
            onClick={() => onConfirm(modal.item, remarks)}
            disabled={!remarks.trim()}
            className="rounded-xl bg-rose-600 px-6 py-2 text-[13px] font-semibold text-white hover:bg-rose-700 transition-colors disabled:opacity-50"
          >
            Confirm Reject
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
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    requestType: "",
    inspectionType: "",
    inspectorAssigned: "",
  });
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalElements: 0 });

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modal, setModal] = useState(null);
  const [activeTab, setActiveTab] = useState("PENDING");

  const TABS = [
    { id: "PENDING", label: "Pending" },
    { id: "ACCEPTED", label: "Accepted" },
    { id: "REJECTED", label: "Rejected" },
    { id: "SUBMITTED", label: "Submitted" },
    { id: "COMPLETED", label: "Completed" },
  ];

  // Static summary from current page data
  const summary = useMemo(() => ({
    total: pagination.totalElements,
    pending: rows.filter((r) => !r.inspectorId).length,
    assigned: rows.filter((r) => !!r.inspectorId).length,
    inProgress: rows.filter((r) => r.inspectionRequestStatus === "IN_PROGRESS").length,
    completed: rows.filter((r) => r.inspectionRequestStatus === "COMPLETED").length,
    cancelled: rows.filter((r) => r.inspectionRequestStatus === "CANCELLED").length,
  }), [rows, pagination.totalElements]);

  // Client-side filter on top of API results
  const filteredRows = useMemo(() => {
    let data = [...rows];
    if (filters.status) data = data.filter((r) => r.inspectionRequestStatus === filters.status);
    if (filters.requestType) data = data.filter((r) => r.requesterType === filters.requestType);
    if (filters.inspectionType) data = data.filter((r) => r.inspectionType === filters.inspectionType);
    if (filters.inspectorAssigned) data = data.filter((r) => filters.inspectorAssigned === "Yes" ? !!r.inspectorId : !r.inspectorId);
    return data;
  }, [rows, filters]);

  // ── Fetch ─────────────────────────────────────────────────────
  const fetchInspections = async (pageNo = 1) => {
    setLoading(true);
    try {
      let res;
      if (activeTab === "PENDING") {
        res = await getAllVehicleInspections({ searchText: search.trim() || null, pageNo, status: "REQUESTED" });
      } else {
        res = await getAllVehicleInspectionAssigned({ searchText: search.trim() || null, pageNo, status: activeTab });
      }
      const data = res?.data || [];
      setRows(Array.isArray(data) ? data : []);
      if (res?.pageResponse) {
        setPagination({
          currentPage: res.pageResponse.currentPage ?? pageNo,
          totalPages: res.pageResponse.totalPages ?? 1,
          totalElements: res.pageResponse.totalElements ?? data.length,
        });
      }
    } catch (err) {
      console.error("Failed to fetch inspections:", err);
      toast.error(err?.response?.data?.message || "Failed to load inspection requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInspections(1); }, [activeTab]);

  useEffect(() => {
    const t = setTimeout(() => fetchInspections(1), 500);
    return () => clearTimeout(t);
  }, [search]);

  const handleRefresh = () => fetchInspections(pagination.currentPage);
  const handlePageChange = (newPage) => fetchInspections(newPage);

  const handleClear = () => {
    setSearch("");
    setFilters({ status: "", requestType: "", inspectionType: "", inspectorAssigned: "" });
    setFiltersOpen(false);
    fetchInspections(1);
  };

  const handleAssignConfirm = async (item) => {
    try {
      const payload = {
        inspectionRequestId: item.id,
        inspectorId: item.assignInspector,
        scheduleDate: item.assignDate, // item.assignDate comes from datetime-local input
      };

      if (!payload.scheduleDate) {
        toast.error("Please select a schedule date and time");
        return;
      }

      const res = await assignInspector(payload);
      
      if (!res.error) {
        toast.success(res.message || "Inspector assigned successfully");
        fetchInspections(pagination.currentPage);
        setModal(null);
      } else {
        toast.error(res.message || "Failed to assign inspector");
      }
    } catch (err) {
      console.error("Failed to assign inspector:", err);
      toast.error(err?.response?.data?.message || "Failed to assign inspector");
    }
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

  const handleApproveConfirm = async (item) => {
    try {
      const res = await approveInspection({ assignmentId: item.assignmentId || item.id });
      if (!res.error) {
        toast.success(res.message || "Report approved successfully");
        fetchInspections(pagination.currentPage);
        setModal(null);
        setSelectedRequest(null);
      } else {
        toast.error(res.message || "Failed to approve report");
      }
    } catch (err) {
      console.error("Approve error:", err);
      toast.error(err?.response?.data?.message || "Failed to approve report");
    }
  };

  const handleRejectConfirm = async (item, remarks) => {
    try {
      const res = await rejectInspection({ assignmentId: item.assignmentId || item.id, remarks });
      if (!res.error) {
        toast.success(res.message || "Report rejected successfully");
        fetchInspections(pagination.currentPage);
        setModal(null);
        setSelectedRequest(null);
      } else {
        toast.error(res.message || "Failed to reject report");
      }
    } catch (err) {
      console.error("Reject error:", err);
      toast.error(err?.response?.data?.message || "Failed to reject report");
    }
  };

  const handleViewDetails = async (item) => {
    setLoading(true);
    try {
      let res;
      if (activeTab === "PENDING") {
        res = await getVehicleInspectionById(item.id);
      } else {
        // Use assignmentId or id based on what the API expects
        res = await getVehicleInspectionAssignmentById(item.assignmentId || item.id);
      }
      
      if (res?.data) {
        setSelectedRequest(res.data);
      } else {
        toast.error("Failed to load inspection details");
      }
    } catch (err) {
      console.error("Error fetching inspection details:", err);
      toast.error(err?.response?.data?.message || "Failed to load inspection details");
    } finally {
      setLoading(false);
    }
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

  const formatStatus = (s) => s
    ? s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "—";
  const formatDate = (dt) => {
    if (!dt) return "—";
    const d = new Date(dt);
    if (isNaN(d.getTime())) return "—";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatScheduledDate = (dt) => {
    if (!dt) return "—";
    const d = new Date(dt);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {selectedRequest ? (
        activeTab === "PENDING" ? (
          <InspectionRequestDetail
            request={selectedRequest}
            onBack={() => setSelectedRequest(null)}
            onAssign={(item) => setModal({ type: "assign", item })}
            onCancel={(item) => setModal({ type: "cancel", item })}
          />
        ) : (
          <InspectionCommonDetail
            request={selectedRequest}
            onBack={() => setSelectedRequest(null)}
            onApprove={(item) => setModal({ type: "approve", item })}
            onReject={(item) => setModal({ type: "reject", item })}
            onReview={(item) => toast.success("Reviewing...")}
            onPayment={(item) => toast.success("Payment details...")}
          />
        )
      ) : (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
          <style>{`
        .table-scroll::-webkit-scrollbar { height: 6px; width: 6px; }
        .table-scroll::-webkit-scrollbar-track { background: transparent; }
        .table-scroll::-webkit-scrollbar-thumb { background: rgba(148,163,184,0.35); border-radius: 6px; }
        .table-scroll::-webkit-scrollbar-thumb:hover { background: rgba(100,116,139,0.45); }
      `}</style>

          {/* HEADER */}
          <div className="flex-shrink-0 p-6 pb-4">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Inspection Requests</h1>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-500">
              Manage inspection bookings, assignment, payments, scheduling, SLA, cancellations and refund governance.
            </p>
          </div>

          {/* KPI CARDS */}
          <div className="flex-shrink-0 px-6 pb-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
              <TopCard title="Total Requests" value={summary.total} icon={FileText} />
              <TopCard title="Pending" value={summary.pending} icon={Clock3} />
              <TopCard title="Assigned" value={summary.assigned} icon={UserPlus} />
              <TopCard title="In Progress" value={summary.inProgress} icon={RefreshCw} />
              <TopCard title="Completed" value={summary.completed} icon={CheckCircle2} />
              <TopCard title="Cancelled" value={summary.cancelled} icon={X} />
            </div>
          </div>

          {/* TABS */}
          <div className="flex-shrink-0 px-6 pb-4">
            <div className="flex flex-wrap items-center gap-3">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cls(
                    "px-6 py-2.5 rounded-full text-[13px] font-bold transition-all duration-200",
                    activeTab === tab.id
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* TABLE CARD */}
          <div className="flex-1 px-6 pb-6 overflow-hidden">
            <div className="h-full rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden relative flex flex-col">
              <div className="absolute top-0 right-0 w-96 h-96 bg-sky-100 blur-[100px] pointer-events-none" />

              {/* SEARCH + FILTER BAR */}
              <div className="p-5 md:p-6 relative z-10 border-b border-slate-200 flex-shrink-0">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div className="relative flex-1 max-w-2xl">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search by Request ID, Vehicle, Buyer, Inspector..."
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-[14px] text-slate-900 outline-none transition-all focus:border-sky-400 placeholder:text-slate-400"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button onClick={() => setFiltersOpen((p) => !p)} className={cls("inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-[13px] font-semibold transition-colors", filtersOpen ? "bg-sky-600 text-white border-sky-600" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50")}>
                      <SlidersHorizontal className="h-4 w-4" />
                      Filters
                    </button>
                    <button onClick={handleRefresh} className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors">
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {filtersOpen && (
                  <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-200 pt-5 md:grid-cols-2 xl:grid-cols-4">
                    <div className="flex items-center justify-between col-span-full mb-2">
                      <h4 className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Advanced Filters</h4>
                      <button onClick={handleClear} className="text-[12px] text-sky-700 hover:text-sky-800 transition-colors">Clear All</button>
                    </div>
                    <select value={filters.status} onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))} className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none">
                      <option value="">All Status</option>
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                    </select>
                    <select value={filters.requestType} onChange={(e) => setFilters((p) => ({ ...p, requestType: e.target.value }))} className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none">
                      <option value="">Request Type</option>
                      {REQUEST_TYPE_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <select value={filters.inspectionType} onChange={(e) => setFilters((p) => ({ ...p, inspectionType: e.target.value }))} className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none">
                      <option value="">Inspection Type</option>
                      {INSPECTION_TYPE_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <select value={filters.inspectorAssigned} onChange={(e) => setFilters((p) => ({ ...p, inspectorAssigned: e.target.value }))} className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none">
                      <option value="">Inspector Assigned</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                )}
              </div>

              {/* TABLE */}
              <div className="flex-1 w-full overflow-auto table-scroll relative z-10">
                <table className="min-w-[1200px] w-full border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                      {/* <th className="px-6 py-4 font-semibold whitespace-nowrap">Request ID</th> */}
                      <th className="px-5 py-4 font-semibold whitespace-nowrap">Vehicle</th>
                      <th className="px-5 py-4 font-semibold whitespace-nowrap">Requester Name</th>
                      <th className="px-5 py-4 font-semibold whitespace-nowrap">Requester Type</th>
                      <th className="px-5 py-4 font-semibold whitespace-nowrap">Type</th>
                      <th className="px-5 py-4 font-semibold whitespace-nowrap">Status</th>
                      <th className="px-5 py-4 font-semibold whitespace-nowrap">Scheduled</th>
                      <th className="px-5 py-4 font-semibold whitespace-nowrap">Created At</th>
                      {activeTab !== "PENDING" && (
                        <th className="px-5 py-4 font-semibold whitespace-nowrap">Inspector</th>
                      )}
                      <th className="px-6 py-4 text-right font-semibold whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr>
                        <td colSpan={9} className="px-6 py-28 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <Loader2 className="h-12 w-12 text-sky-600 animate-spin mb-4" />
                            <div className="text-lg font-bold text-slate-900">Loading inspection requests...</div>
                          </div>
                        </td>
                      </tr>
                    ) : filteredRows.length ? (
                      filteredRows.map((row) => (
                        <tr key={row.assignmentId || row.id} className={cls("transition-colors duration-200 hover:bg-slate-50 group", selectedRequest?.id === row.id && "bg-sky-50/50")}>

                          {/* REQUEST ID */}
                          {/* <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-100 to-blue-100 border border-slate-200 flex items-center justify-center shrink-0">
                            <FileText className="h-4 w-4 text-sky-700" />
                          </div>
                          <div>
                            <div className="text-[13px] font-bold text-slate-900 group-hover:text-sky-700 transition-colors font-mono">{row.id?.slice(0, 8)}...</div>
                            <div className="mt-0.5 text-[11px] text-slate-400 font-mono">{row.vehicleId?.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </td> */}

                          {/* VEHICLE */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              {row.vehicleThumbnailUrl ? (
                                <img src={row.vehicleThumbnailUrl} alt="" className="w-10 h-8 rounded-lg object-cover border border-slate-200 shrink-0" />
                              ) : (
                                <div className="w-10 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-400 text-[10px]">IMG</div>
                              )}
                              <div className="text-[13px] font-semibold text-slate-800 max-w-[160px]">{row.vehicleName || "—"}</div>
                            </div>
                          </td>

                          {/* REQUESTED BY */}
                          <td className="px-5 py-4">
                            <div>
                              <div className="text-[13px] font-semibold text-slate-800">{row.requestedUserName || row.requestedByName || "—"}</div>
                            </div>
                          </td>

                          {/* REQUESTER TYPE */}
                          <td className="px-5 py-4">
                            <div>
                              {row.requesterType && (
                                <span className={cls("mt-1 inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold border", typeBadge(row.requesterType))}>
                                  {row.requesterType}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* TYPE */}
                          <td className="px-5 py-4">
                            <span className={cls("inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap",
                              row.inspectionType?.includes("VIDEO") ? "bg-violet-50 text-violet-700 border-violet-200"
                                : row.inspectionType?.includes("PHYSICAL") ? "bg-sky-50 text-sky-700 border-sky-200"
                                  : "bg-slate-50 text-slate-600 border-slate-200"
                            )}>
                              {row.inspectionType
                                ? row.inspectionType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
                                : "—"}
                            </span>
                          </td>

                          {/* STATUS */}
                          <td className="px-5 py-4">
                            <span className={cls("inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap", statusBadge(row.assignmentStatus || row.inspectionRequestStatus))}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                              {formatStatus(row.assignmentStatus || row.inspectionRequestStatus)}
                            </span>
                          </td>

                          {/* SCHEDULED */}
                          <td className="px-5 py-4 text-[13px] font-medium text-slate-500 whitespace-nowrap">
                            {formatScheduledDate(row.videoCallScheduledAt || row.scheduledAt)}
                          </td>

                          {/* CREATED AT */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-500 whitespace-nowrap">
                              <Clock3 size={12} className="text-slate-400" />
                              {formatDate(row.createdAt)}
                            </div>
                          </td>

                          {/* INSPECTOR */}
                          {activeTab !== "PENDING" && (
                            <td className="px-5 py-4">
                              {row.inspectorUsername || row.inspectorName ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 text-[11px] font-bold">
                                    {(row.inspectorUsername || row.inspectorName)[0]}
                                  </div>
                                  <span className="text-[13px] font-semibold text-slate-700">
                                    {row.inspectorUsername || row.inspectorName}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-[12px] text-slate-400 font-medium italic">Unassigned</span>
                              )}
                            </td>
                          )}

                          {/* ACTIONS */}
                          <td className="px-6 py-4 text-right">
                            <InspectionRowActions
                              item={row}
                              activeTab={activeTab}
                              onView={handleViewDetails}
                              onAssign={(item) => setModal({ type: "assign", item })}
                              onReschedule={handleReschedule}
                              onCancel={(item) => setModal({ type: "cancel", item })}
                              onApprove={(item) => setModal({ type: "approve", item })}
                              onReject={(item) => setModal({ type: "reject", item })}
                              onRefund={(item) => setModal({ type: "refund", item })}
                              onReview={() => toast.success("Opening Review...")}
                              onPayment={() => toast.success("Opening Payment Details...")}
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
                            <div className="text-lg font-bold text-slate-900 tracking-tight">No inspection requests found</div>
                            <div className="mt-1 text-[14px] text-slate-500 max-w-sm mx-auto">Try adjusting your search or clear active filters.</div>
                            {(search || Object.values(filters).some(Boolean)) && (
                              <button onClick={handleClear} className="mt-6 px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 transition-colors">
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

              {/* PAGINATION */}
              {!loading && filteredRows.length > 0 && (
                <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
                  <div className="text-[13px] text-slate-600">
                    Page {pagination.currentPage} of {pagination.totalPages} • {pagination.totalElements} total records
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={pagination.currentPage === 1} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      Prev
                    </button>
                    <button onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={pagination.currentPage >= pagination.totalPages} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <AssignInspectorModal modal={modal} onClose={() => setModal(null)} onConfirm={handleAssignConfirm} />
      <CancelInspectionModal modal={modal} onClose={() => setModal(null)} onConfirm={handleCancelConfirm} />
      <EscalateModal modal={modal} onClose={() => setModal(null)} onConfirm={handleEscalateConfirm} />
      <RefundModal modal={modal} onClose={() => setModal(null)} onConfirm={handleRefundConfirm} />
      <ApproveInspectionModal modal={modal} onClose={() => setModal(null)} onConfirm={handleApproveConfirm} />
      <RejectInspectionModal modal={modal} onClose={() => setModal(null)} onConfirm={handleRejectConfirm} />
    </>
  );

};

export default InspectionRequests;
