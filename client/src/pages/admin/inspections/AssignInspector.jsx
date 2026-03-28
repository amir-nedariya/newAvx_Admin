import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  RefreshCw,
  MoreHorizontal,
  UserPlus,
  AlertTriangle,
  RotateCcw,
  X,
  MapPin,
  Clock3,
  ShieldAlert,
  Star,
  Activity,
  CheckCircle2,
  Users,
  Car,
  Video,
  BadgeAlert,
  TimerReset,
  ClipboardList,
  Route,
  ShieldCheck,
  Ban,
  Briefcase,
} from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

/* =========================================================
   DUMMY DATA
========================================================= */

const DUMMY_QUEUE = [
  {
    id: "INSP-2101",
    vehicle: "Hyundai Creta SX 2021",
    city: "Ahmedabad",
    type: "Premium",
    requestedBy: "Buyer",
    preferredDate: "18 Mar 2026",
    slaTimer: "45m",
    slaLevel: "critical",
    risk: "High",
    boosted: true,
    vehicleType: "Car",
    videoRequired: false,
    consultant: "Metro Auto Hub",
    status: "Unassigned",
  },
  {
    id: "INSP-2102",
    vehicle: "Tata Nexon XZ+ 2022",
    city: "Surat",
    type: "Basic",
    requestedBy: "Consultant",
    preferredDate: "18 Mar 2026",
    slaTimer: "2h 10m",
    slaLevel: "warning",
    risk: "Moderate",
    boosted: false,
    vehicleType: "Car",
    videoRequired: false,
    consultant: "City Drive",
    status: "Unassigned",
  },
  {
    id: "INSP-2103",
    vehicle: "Honda City ZX 2022",
    city: "Ahmedabad",
    type: "Video",
    requestedBy: "Buyer",
    preferredDate: "19 Mar 2026",
    slaTimer: "5h 20m",
    slaLevel: "safe",
    risk: "Low",
    boosted: false,
    vehicleType: "Car",
    videoRequired: true,
    consultant: "Elite Motors",
    status: "Unassigned",
  },
  {
    id: "INSP-2104",
    vehicle: "Mahindra Scorpio N Z8",
    city: "Vadodara",
    type: "Premium",
    requestedBy: "Buyer",
    preferredDate: "18 Mar 2026",
    slaTimer: "1h 05m",
    slaLevel: "warning",
    risk: "High",
    boosted: true,
    vehicleType: "SUV",
    videoRequired: false,
    consultant: "Torque Wheels",
    status: "Unassigned",
  },
];

const DUMMY_INSPECTORS = [
  {
    id: "INS-101",
    name: "Rahul Shah",
    city: "Ahmedabad",
    distance: "4 km",
    distanceValue: 4,
    availability: "Available Today",
    status: "Available",
    activeJobs: 2,
    todayCapacity: 5,
    rating: 4.8,
    slaCompliance: "96%",
    slaComplianceValue: 96,
    risk: "Low",
    suspended: false,
    certified: true,
    videoSupport: true,
    vehicleSkills: ["Car", "SUV"],
    avgCompletion: "19h",
    lastAssignment: "1h ago",
    todayAssignments: 2,
    pastConsultantMatches: 1,
    flaggedBefore: false,
    familyConflict: false,
  },
  {
    id: "INS-102",
    name: "Nisha Patel",
    city: "Ahmedabad",
    distance: "7 km",
    distanceValue: 7,
    availability: "Today 4 PM",
    status: "Busy",
    activeJobs: 4,
    todayCapacity: 5,
    rating: 4.6,
    slaCompliance: "92%",
    slaComplianceValue: 92,
    risk: "Moderate",
    suspended: false,
    certified: true,
    videoSupport: true,
    vehicleSkills: ["Car"],
    avgCompletion: "22h",
    lastAssignment: "20m ago",
    todayAssignments: 4,
    pastConsultantMatches: 4,
    flaggedBefore: false,
    familyConflict: false,
  },
  {
    id: "INS-103",
    name: "Mehul Trivedi",
    city: "Surat",
    distance: "3 km",
    distanceValue: 3,
    availability: "Available Today",
    status: "Available",
    activeJobs: 1,
    todayCapacity: 4,
    rating: 4.3,
    slaCompliance: "88%",
    slaComplianceValue: 88,
    risk: "Low",
    suspended: false,
    certified: true,
    videoSupport: false,
    vehicleSkills: ["Car", "SUV"],
    avgCompletion: "24h",
    lastAssignment: "3h ago",
    todayAssignments: 1,
    pastConsultantMatches: 0,
    flaggedBefore: false,
    familyConflict: false,
  },
  {
    id: "INS-104",
    name: "Vikram Joshi",
    city: "Vadodara",
    distance: "5 km",
    distanceValue: 5,
    availability: "Tomorrow 11 AM",
    status: "Available",
    activeJobs: 2,
    todayCapacity: 6,
    rating: 4.9,
    slaCompliance: "97%",
    slaComplianceValue: 97,
    risk: "Low",
    suspended: false,
    certified: true,
    videoSupport: true,
    vehicleSkills: ["SUV", "Car"],
    avgCompletion: "18h",
    lastAssignment: "5h ago",
    todayAssignments: 2,
    pastConsultantMatches: 2,
    flaggedBefore: false,
    familyConflict: false,
  },
  {
    id: "INS-105",
    name: "Karan Vora",
    city: "Ahmedabad",
    distance: "2 km",
    distanceValue: 2,
    availability: "On Leave",
    status: "On Leave",
    activeJobs: 0,
    todayCapacity: 0,
    rating: 4.1,
    slaCompliance: "81%",
    slaComplianceValue: 81,
    risk: "High",
    suspended: false,
    certified: true,
    videoSupport: false,
    vehicleSkills: ["Car"],
    avgCompletion: "27h",
    lastAssignment: "2d ago",
    todayAssignments: 0,
    pastConsultantMatches: 5,
    flaggedBefore: true,
    familyConflict: false,
  },
  {
    id: "INS-106",
    name: "Rohit Soni",
    city: "Ahmedabad",
    distance: "6 km",
    distanceValue: 6,
    availability: "Suspended",
    status: "Suspended",
    activeJobs: 0,
    todayCapacity: 0,
    rating: 3.9,
    slaCompliance: "72%",
    slaComplianceValue: 72,
    risk: "High",
    suspended: true,
    certified: true,
    videoSupport: true,
    vehicleSkills: ["Car"],
    avgCompletion: "31h",
    lastAssignment: "5d ago",
    todayAssignments: 0,
    pastConsultantMatches: 1,
    flaggedBefore: true,
    familyConflict: true,
  },
];

const INITIAL_LOGS = [
  {
    id: "LOG-1",
    requestId: "INSP-2004",
    inspector: "Rahul Shah",
    city: "Ahmedabad",
    action: "Assigned",
    admin: "Admin Aakash",
    time: "17 Mar 2026 • 10:15 AM",
  },
  {
    id: "LOG-2",
    requestId: "INSP-2005",
    inspector: "Nisha Patel",
    city: "Ahmedabad",
    action: "Reassigned",
    admin: "Admin Dev",
    time: "17 Mar 2026 • 09:10 AM",
  },
];

/* =========================================================
   BADGES
========================================================= */

const queueSlaBadge = (level) => {
  const map = {
    critical: "bg-rose-50 text-rose-700 border-rose-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    safe: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return map[level] || "bg-slate-100 text-slate-700 border-slate-200";
};

const riskBadge = (risk) => {
  const map = {
    Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Moderate: "bg-amber-50 text-amber-700 border-amber-200",
    High: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return map[risk] || "bg-slate-100 text-slate-700 border-slate-200";
};

const typeBadge = (type) => {
  const map = {
    Basic: "bg-sky-50 text-sky-700 border-sky-200",
    Premium: "bg-violet-50 text-violet-700 border-violet-200",
    Video: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };
  return map[type] || "bg-slate-100 text-slate-700 border-slate-200";
};

const statusBadge = (status) => {
  const map = {
    Available: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Busy: "bg-amber-50 text-amber-700 border-amber-200",
    "On Leave": "bg-slate-100 text-slate-700 border-slate-200",
    Suspended: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return map[status] || "bg-slate-100 text-slate-700 border-slate-200";
};

/* =========================================================
   SMALL UI
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
   AUTO ASSIGN SCORING
========================================================= */

function computeAutoAssignScore(inspector, request) {
  const availabilityScore =
    inspector.status === "Available" ? 30 : inspector.status === "Busy" ? 15 : 0;

  const distanceScore = Math.max(0, 20 - inspector.distanceValue * 2);

  const freeCapacity = Math.max(0, inspector.todayCapacity - inspector.activeJobs);
  const workloadScore = Math.min(20, freeCapacity * 4);

  const slaScore = Math.min(20, Math.round((inspector.slaComplianceValue / 100) * 20));

  const ratingScore = Math.min(10, Math.round((inspector.rating / 5) * 10));

  return availabilityScore + distanceScore + workloadScore + slaScore + ratingScore;
}

function isEligibleInspector(inspector, request) {
  if (inspector.city !== request.city) return false;
  if (inspector.suspended) return false;
  if (inspector.status === "Suspended") return false;
  if (inspector.activeJobs >= inspector.todayCapacity) return false;
  if (!inspector.certified) return false;
  if (!inspector.vehicleSkills.includes(request.vehicleType)) return false;
  if (request.type === "Premium" && inspector.rating <= 4.2) return false;
  if (request.type === "Video" && !inspector.videoSupport) return false;
  return true;
}

/* =========================================================
   ROW ACTIONS
========================================================= */

function QueueRowActions({
  item,
  onAssign,
  onAutoAssign,
  onEscalate,
  onReassign,
  onCancel,
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
    <div className="relative inline-flex justify-end gap-2" ref={ref}>
      <button
        onClick={() => onAssign(item)}
        className="inline-flex h-9 items-center gap-2 rounded-xl bg-sky-600 px-3 text-[13px] font-semibold text-white hover:bg-sky-700"
      >
        <UserPlus className="h-4 w-4" />
        Assign
      </button>

      <button
        onClick={() => setOpen((p) => !p)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 shadow-sm"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-30 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
          <button
            onClick={() => {
              onAutoAssign(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-indigo-700 hover:bg-indigo-50"
          >
            <TimerReset className="h-4 w-4" />
            Auto-Assign
          </button>

          <button
            onClick={() => {
              onEscalate(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-amber-700 hover:bg-amber-50"
          >
            <AlertTriangle className="h-4 w-4" />
            Escalate
          </button>

          <button
            onClick={() => {
              onReassign(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-violet-700 hover:bg-violet-50"
          >
            <RotateCcw className="h-4 w-4" />
            Reassign
          </button>

          <button
            onClick={() => {
              onCancel(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-rose-700 hover:bg-rose-50"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   ASSIGNMENT DRAWER
========================================================= */

function AssignmentDrawer({ item, inspectors, onClose, onConfirmAssign }) {
  const [selectedInspectorId, setSelectedInspectorId] = useState("");

  useEffect(() => {
    setSelectedInspectorId("");
  }, [item]);

  if (!item) return null;

  const eligibleInspectors = inspectors
    .filter((x) => isEligibleInspector(x, item))
    .map((x) => ({
      ...x,
      score: computeAutoAssignScore(x, item),
    }))
    .sort((a, b) => b.score - a.score);

  const selectedInspector = eligibleInspectors.find((x) => x.id === selectedInspectorId);

  const conflictWarnings = selectedInspector
    ? [
        selectedInspector.pastConsultantMatches > 3
          ? "Inspector has frequent prior work with this consultant."
          : null,
        selectedInspector.flaggedBefore ? "Inspector was flagged previously." : null,
        selectedInspector.familyConflict ? "Potential contact / family conflict flagged." : null,
      ].filter(Boolean)
    : [];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-[780px] border-l border-slate-200 bg-white shadow-2xl flex flex-col">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 bg-slate-50">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{item.id}</h3>
            <p className="mt-1 text-sm text-slate-500">
              {item.city} • {item.type} • SLA Remaining {item.slaTimer}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className={cls("inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold border", typeBadge(item.type))}>
                {item.type}
              </span>
              <span className={cls("inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold border", queueSlaBadge(item.slaLevel))}>
                {item.slaTimer}
              </span>
              <span className={cls("inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold border", riskBadge(item.risk))}>
                {item.risk}
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
          {/* Eligible Inspectors */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
              Eligible Inspectors List
            </h4>

            <div className="mt-4 overflow-x-auto">
              <table className="min-w-[900px] w-full border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                    <th className="px-4 py-3">Inspector</th>
                    <th className="px-4 py-3">City</th>
                    <th className="px-4 py-3">Distance</th>
                    <th className="px-4 py-3">Availability</th>
                    <th className="px-4 py-3">Active Jobs</th>
                    <th className="px-4 py-3">Rating</th>
                    <th className="px-4 py-3">SLA</th>
                    <th className="px-4 py-3">Risk</th>
                    <th className="px-4 py-3">Score</th>
                    <th className="px-4 py-3 text-center">Select</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {eligibleInspectors.length ? (
                    eligibleInspectors.map((inspector) => (
                      <tr
                        key={inspector.id}
                        className={cls(
                          "hover:bg-slate-50 transition-colors",
                          selectedInspectorId === inspector.id && "bg-sky-50"
                        )}
                      >
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900">{inspector.name}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{inspector.city}</td>
                        <td className="px-4 py-3 text-slate-600">{inspector.distance}</td>
                        <td className="px-4 py-3 text-slate-600">{inspector.availability}</td>
                        <td className="px-4 py-3 text-slate-600">
                          {inspector.activeJobs}/{inspector.todayCapacity}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{inspector.rating}</td>
                        <td className="px-4 py-3 text-slate-600">{inspector.slaCompliance}</td>
                        <td className="px-4 py-3">
                          <span className={cls("inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border", riskBadge(inspector.risk))}>
                            {inspector.risk}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-900 font-semibold">{inspector.score}</td>
                        <td className="px-4 py-3 text-center">
                          <input
                            type="radio"
                            name="selectedInspector"
                            checked={selectedInspectorId === inspector.id}
                            onChange={() => setSelectedInspectorId(inspector.id)}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="px-4 py-10 text-center text-slate-500">
                        No eligible inspectors found for this request.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Workload Score */}
          {selectedInspector && (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
              <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
                Workload Score
              </h4>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <StatCard label="Current Active Inspections" value={selectedInspector.activeJobs} icon={Briefcase} />
                <StatCard label="Avg Completion Time" value={selectedInspector.avgCompletion} icon={Clock3} />
                <StatCard label="Last Assignment Time" value={selectedInspector.lastAssignment} icon={TimerReset} />
                <StatCard label="Today Assignments" value={selectedInspector.todayAssignments} icon={ClipboardList} />
              </div>
            </div>
          )}

          {/* Conflict Check */}
          {selectedInspector && (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
              <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
                Conflict Check
              </h4>

              {conflictWarnings.length ? (
                <div className="mt-4 space-y-3">
                  {conflictWarnings.map((warning, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-800"
                    >
                      {warning}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-800">
                  No conflict detected for selected inspector.
                </div>
              )}
            </div>
          )}

          {/* Confirmation */}
          {selectedInspector && (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
              <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
                Assign Confirmation
              </h4>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <InfoRow label="Inspector" value={selectedInspector.name} />
                <InfoRow label="Scheduled Date" value={item.preferredDate} />
                <InfoRow label="Estimated Completion" value="24h" />
                <InfoRow label="SLA Status" value={item.slaTimer} />
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() =>
                    onConfirmAssign({
                      request: item,
                      inspector: selectedInspector,
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-[13px] font-semibold text-white hover:bg-sky-700"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Confirm Assignment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* =========================================================
   REASSIGN MODAL
========================================================= */

function ReassignModal({ modal, inspectors, onClose, onConfirm }) {
  const [reason, setReason] = useState("Inspector rejected");
  const [newInspectorId, setNewInspectorId] = useState("");

  useEffect(() => {
    if (modal?.type === "reassign") {
      setReason("Inspector rejected");
      setNewInspectorId("");
    }
  }, [modal]);

  if (!modal || modal.type !== "reassign") return null;

  const eligible = inspectors.filter((x) => isEligibleInspector(x, modal.item));

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[61] w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Reassign Inspection</h3>
            <p className="mt-1 text-[13px] text-slate-500">{modal.item.id}</p>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
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
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[13px] outline-none focus:border-sky-400"
            >
              <option>Inspector rejected</option>
              <option>SLA delay</option>
              <option>Conflict detected</option>
              <option>Buyer complaint</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-medium text-slate-700">Select New Inspector</label>
            <select
              value={newInspectorId}
              onChange={(e) => setNewInspectorId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[13px] outline-none focus:border-sky-400"
            >
              <option value="">Choose inspector</option>
              {eligible.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name} • {x.city} • {x.rating}
                </option>
              ))}
            </select>
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
            onClick={() => onConfirm({ ...modal.item, reason, newInspectorId })}
            className="rounded-xl bg-violet-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-violet-700"
          >
            Confirm Reassign
          </button>
        </div>
      </div>
    </>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

const AssignInspector = () => {
  const [queue, setQueue] = useState(DUMMY_QUEUE);
  const [inspectors, setInspectors] = useState(DUMMY_INSPECTORS);
  const [logs, setLogs] = useState(INITIAL_LOGS);

  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modal, setModal] = useState(null);
  const [quickFilter, setQuickFilter] = useState("all");

  const [filters, setFilters] = useState({
    city: "",
    type: "",
    risk: "",
    requestedBy: "",
    slaLevel: "",
  });

  const uniqueCities = useMemo(
    () => [...new Set(queue.map((r) => r.city))],
    [queue]
  );

  const summary = useMemo(() => {
    const availableInspectors = inspectors.filter((x) => x.status === "Available").length;
    const avgAssignmentTime = "12m";
    const slaCompliance = "93%";
    const cityCoverageGaps = 2;
    const topPerformers = inspectors.filter((x) => x.rating >= 4.7).length;
    const underperformers = inspectors.filter((x) => x.risk === "High").length;

    return {
      unassigned: queue.length,
      availableInspectors,
      avgAssignmentTime,
      slaCompliance,
      cityCoverageGaps,
      topPerformers,
      underperformers,
    };
  }, [queue, inspectors]);

  const filteredQueue = useMemo(() => {
    let data = [...queue];

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.vehicle.toLowerCase().includes(q) ||
          r.city.toLowerCase().includes(q) ||
          r.consultant.toLowerCase().includes(q)
      );
    }

    if (filters.city) data = data.filter((r) => r.city === filters.city);
    if (filters.type) data = data.filter((r) => r.type === filters.type);
    if (filters.risk) data = data.filter((r) => r.risk === filters.risk);
    if (filters.requestedBy) data = data.filter((r) => r.requestedBy === filters.requestedBy);
    if (filters.slaLevel) data = data.filter((r) => r.slaLevel === filters.slaLevel);

    if (quickFilter === "critical") data = data.filter((r) => r.slaLevel === "critical");
    if (quickFilter === "premium") data = data.filter((r) => r.type === "Premium");
    if (quickFilter === "boosted") data = data.filter((r) => r.boosted);
    if (quickFilter === "highrisk") data = data.filter((r) => r.risk === "High");

    data.sort((a, b) => {
      const slaPriority = { critical: 0, warning: 1, safe: 2 };
      if (slaPriority[a.slaLevel] !== slaPriority[b.slaLevel]) {
        return slaPriority[a.slaLevel] - slaPriority[b.slaLevel];
      }
      if (a.type !== b.type) {
        if (a.type === "Premium") return -1;
        if (b.type === "Premium") return 1;
      }
      if (a.boosted !== b.boosted) return a.boosted ? -1 : 1;
      if (a.risk !== b.risk) {
        const riskOrder = { High: 0, Moderate: 1, Low: 2 };
        return riskOrder[a.risk] - riskOrder[b.risk];
      }
      return 0;
    });

    return data;
  }, [queue, search, filters, quickFilter]);

  const handleRefresh = () => {
    setQueue([...DUMMY_QUEUE]);
    setInspectors([...DUMMY_INSPECTORS]);
    setLogs([...INITIAL_LOGS]);
  };

  const handleClear = () => {
    setSearch("");
    setQuickFilter("all");
    setFilters({
      city: "",
      type: "",
      risk: "",
      requestedBy: "",
      slaLevel: "",
    });
    setFiltersOpen(false);
  };

  const addLog = (entry) => {
    setLogs((prev) => [
      {
        id: `LOG-${Date.now()}`,
        ...entry,
      },
      ...prev,
    ]);
  };

  const handleConfirmAssign = ({ request, inspector }) => {
    setQueue((prev) => prev.filter((r) => r.id !== request.id));

    setInspectors((prev) =>
      prev.map((x) =>
        x.id === inspector.id
          ? {
              ...x,
              activeJobs: x.activeJobs + 1,
              todayAssignments: x.todayAssignments + 1,
              lastAssignment: "Just now",
              status: x.activeJobs + 1 >= x.todayCapacity ? "Busy" : x.status,
            }
          : x
      )
    );

    addLog({
      requestId: request.id,
      inspector: inspector.name,
      city: request.city,
      action: "Assigned",
      admin: "Admin User",
      time: "17 Mar 2026 • 11:40 AM",
    });

    setSelectedRequest(null);
  };

  const handleAutoAssign = (request) => {
    const eligible = inspectors
      .filter((x) => isEligibleInspector(x, request))
      .map((x) => ({ ...x, score: computeAutoAssignScore(x, request) }))
      .sort((a, b) => b.score - a.score);

    if (!eligible.length) {
      alert(`No eligible inspector found for ${request.id}`);
      return;
    }

    handleConfirmAssign({ request, inspector: eligible[0] });
  };

  const handleEscalate = (request) => {
    addLog({
      requestId: request.id,
      inspector: "—",
      city: request.city,
      action: "Escalated",
      admin: "Admin User",
      time: "17 Mar 2026 • 11:45 AM",
    });
    alert(`Escalated ${request.id}`);
  };

  const handleCancel = (request) => {
    setQueue((prev) => prev.filter((r) => r.id !== request.id));
    addLog({
      requestId: request.id,
      inspector: "—",
      city: request.city,
      action: "Cancelled",
      admin: "Admin User",
      time: "17 Mar 2026 • 11:46 AM",
    });
  };

  const handleReassignConfirm = (payload) => {
    const inspector = inspectors.find((x) => x.id === payload.newInspectorId);
    if (!inspector) return;

    handleConfirmAssign({ request: payload, inspector });

    addLog({
      requestId: payload.id,
      inspector: inspector.name,
      city: payload.city,
      action: `Reassigned (${payload.reason})`,
      admin: "Admin User",
      time: "17 Mar 2026 • 11:50 AM",
    });

    setModal(null);
  };

  const updateInspectorStatus = (id, status) => {
    setInspectors((prev) =>
      prev.map((x) =>
        x.id === id
          ? {
              ...x,
              status,
              suspended: status === "Suspended" ? true : x.suspended,
            }
          : x
      )
    );
  };

  const adjustCapacity = (id, delta) => {
    setInspectors((prev) =>
      prev.map((x) =>
        x.id === id
          ? { ...x, todayCapacity: Math.max(0, x.todayCapacity + delta) }
          : x
      )
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

      <div className="mx-auto space-y-6">
        {/* Header */}
        <section className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
              Assign Inspector
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-500">
              Dispatch and manage field inspection workforce with workload balance,
              SLA control, city coverage, conflict checks, and risk protection.
            </p>
          </div>
        </section>

        {/* Summary / Performance */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
          <TopCard
            title="Unassigned Queue"
            value={summary.unassigned}
            icon={ClipboardList}
            active={quickFilter === "all"}
            onClick={() => setQuickFilter("all")}
          />
          <TopCard
            title="Available Inspectors"
            value={summary.availableInspectors}
            icon={Users}
            active={quickFilter === "available"}
            onClick={() => setQuickFilter("available")}
          />
          <TopCard
            title="Critical SLA"
            value={queue.filter((x) => x.slaLevel === "critical").length}
            icon={AlertTriangle}
            active={quickFilter === "critical"}
            onClick={() => setQuickFilter("critical")}
          />
          <TopCard
            title="Premium Queue"
            value={queue.filter((x) => x.type === "Premium").length}
            icon={ShieldCheck}
            active={quickFilter === "premium"}
            onClick={() => setQuickFilter("premium")}
          />
          <TopCard
            title="Boosted"
            value={queue.filter((x) => x.boosted).length}
            icon={BadgeAlert}
            active={quickFilter === "boosted"}
            onClick={() => setQuickFilter("boosted")}
          />
          <TopCard
            title="High Risk"
            value={queue.filter((x) => x.risk === "High").length}
            icon={ShieldAlert}
            active={quickFilter === "highrisk"}
            onClick={() => setQuickFilter("highrisk")}
          />
        </section>

        {/* Queue */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-100 blur-[100px] pointer-events-none" />

          <div className="p-5 md:p-6 relative z-10 border-b border-slate-200">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="relative flex-1 max-w-2xl">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by Request ID, Vehicle, City, Consultant..."
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
              <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-200 pt-5 md:grid-cols-2 xl:grid-cols-5">
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
                  value={filters.type}
                  onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">Inspection Type</option>
                  <option>Basic</option>
                  <option>Premium</option>
                  <option>Video</option>
                </select>

                <select
                  value={filters.risk}
                  onChange={(e) => setFilters((p) => ({ ...p, risk: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">Risk</option>
                  <option>Low</option>
                  <option>Moderate</option>
                  <option>High</option>
                </select>

                <select
                  value={filters.requestedBy}
                  onChange={(e) => setFilters((p) => ({ ...p, requestedBy: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">Requested By</option>
                  <option>Buyer</option>
                  <option>Consultant</option>
                </select>

                <select
                  value={filters.slaLevel}
                  onChange={(e) => setFilters((p) => ({ ...p, slaLevel: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">SLA Level</option>
                  <option value="critical">Critical</option>
                  <option value="warning">Approaching Deadline</option>
                  <option value="safe">Within Time</option>
                </select>
              </div>
            )}
          </div>

          <div className="w-full overflow-x-auto table-scroll relative z-10 pb-4">
            <table className="min-w-[1450px] w-full border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Request ID</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Vehicle</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">City</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Type</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Requested By</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Preferred Date</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">SLA Timer</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Risk</th>
                  <th className="px-6 py-4 text-right font-semibold whitespace-nowrap">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredQueue.length ? (
                  filteredQueue.map((row) => (
                    <tr key={row.id} className="transition-colors duration-200 hover:bg-slate-50 group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-100 to-blue-100 border border-slate-200 flex items-center justify-center shrink-0">
                            <ClipboardList className="h-4 w-4 text-sky-700" />
                          </div>
                          <div>
                            <div className="text-[14px] font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                              {row.id}
                            </div>
                            <div className="mt-0.5 text-[12px] text-slate-500">{row.consultant}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-[13px] font-medium text-slate-700">{row.vehicle}</td>
                      <td className="px-5 py-4 text-[13px] font-medium text-slate-500">{row.city}</td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className={cls("inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap", typeBadge(row.type))}>
                            {row.type}
                          </span>
                          {row.videoRequired && (
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-indigo-200 bg-indigo-50 text-indigo-700">
                              <Video className="h-3.5 w-3.5" />
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-[13px] font-medium text-slate-500">{row.requestedBy}</td>
                      <td className="px-5 py-4 text-[13px] font-medium text-slate-500 whitespace-nowrap">{row.preferredDate}</td>

                      <td className="px-5 py-4">
                        <span className={cls("inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap", queueSlaBadge(row.slaLevel))}>
                          {row.slaTimer}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className={cls("inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap", riskBadge(row.risk))}>
                          {row.risk}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <QueueRowActions
                          item={row}
                          onAssign={setSelectedRequest}
                          onAutoAssign={handleAutoAssign}
                          onEscalate={handleEscalate}
                          onReassign={(item) => setModal({ type: "reassign", item })}
                          onCancel={handleCancel}
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
                          No unassigned inspections found
                        </div>
                        <div className="mt-1 text-[14px] text-slate-500 max-w-sm mx-auto">
                          Try adjusting your search criteria or clear active filters to see more results.
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Inspector Availability Panel */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-5 md:p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Inspector Availability Panel</h2>
            <p className="mt-1 text-sm text-slate-500">
              Review availability, workload, capacity, rating, and risk status.
            </p>
          </div>

          <div className="w-full overflow-x-auto table-scroll pb-4">
            <table className="min-w-[1300px] w-full border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                  <th className="px-6 py-4">Inspector</th>
                  <th className="px-5 py-4">City</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Active Jobs</th>
                  <th className="px-5 py-4">Today Capacity</th>
                  <th className="px-5 py-4">Rating</th>
                  <th className="px-5 py-4">Risk</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {inspectors.map((inspector) => (
                  <tr key={inspector.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{inspector.name}</div>
                      <div className="text-[12px] text-slate-500">{inspector.id}</div>
                    </td>
                    <td className="px-5 py-4 text-[13px] text-slate-600">{inspector.city}</td>
                    <td className="px-5 py-4">
                      <span className={cls("inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border", statusBadge(inspector.status))}>
                        {inspector.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[13px] text-slate-600">{inspector.activeJobs}</td>
                    <td className="px-5 py-4 text-[13px] text-slate-600">{inspector.todayCapacity}</td>
                    <td className="px-5 py-4 text-[13px] text-slate-600">{inspector.rating}</td>
                    <td className="px-5 py-4">
                      <span className={cls("inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border", riskBadge(inspector.risk))}>
                        {inspector.risk}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => updateInspectorStatus(inspector.id, "On Leave")}
                          className="inline-flex h-9 items-center rounded-xl border border-slate-200 bg-white px-3 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Mark unavailable
                        </button>
                        <button
                          onClick={() => updateInspectorStatus(inspector.id, "Suspended")}
                          className="inline-flex h-9 items-center rounded-xl border border-rose-200 bg-rose-50 px-3 text-[12px] font-semibold text-rose-700 hover:bg-rose-100"
                        >
                          Suspend
                        </button>
                        <button
                          onClick={() => adjustCapacity(inspector.id, 1)}
                          className="inline-flex h-9 items-center rounded-xl border border-sky-200 bg-sky-50 px-3 text-[12px] font-semibold text-sky-700 hover:bg-sky-100"
                        >
                          + Capacity
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Optional City Map placeholder + assignment log */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                <Route className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">City Map View</h3>
                <p className="text-sm text-slate-500">
                  Pending inspections and available inspectors by city.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 h-[260px] flex items-center justify-center text-slate-400 text-sm">
              Map placeholder for city dispatch view
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Assignment Log</h3>
              <p className="text-sm text-slate-500 mt-1">
                Immutable activity log for assignment and reassignment events.
              </p>
            </div>

            <div className="p-6 space-y-3">
              {logs.length ? (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[13px] font-semibold text-slate-900">
                          {log.requestId} • {log.action}
                        </div>
                        <div className="mt-1 text-[12px] text-slate-500">
                          Inspector: {log.inspector} • {log.city}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[12px] font-medium text-slate-700">{log.admin}</div>
                        <div className="mt-1 text-[11px] text-slate-500">{log.time}</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-500">No logs yet.</div>
              )}
            </div>
          </div>
        </section>
      </div>

      <AssignmentDrawer
        item={selectedRequest}
        inspectors={inspectors}
        onClose={() => setSelectedRequest(null)}
        onConfirmAssign={handleConfirmAssign}
      />

      <ReassignModal
        modal={modal}
        inspectors={inspectors}
        onClose={() => setModal(null)}
        onConfirm={handleReassignConfirm}
      />
    </div>
  );
};

export default AssignInspector;