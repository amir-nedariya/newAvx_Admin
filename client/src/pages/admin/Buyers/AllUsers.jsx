import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  RefreshCw,
  MoreHorizontal,
  Eye,
  Ban,
  ShieldAlert,
  NotebookPen,
  MessageSquareWarning,
  X,
  User,
  Smartphone,
  CalendarDays,
  MapPin,
  TriangleAlert,
  ShieldCheck,
  Clock3,
  Activity,
  MessagesSquare,
} from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

/* =========================================================
   DUMMY DATA
========================================================= */
const DUMMY_USERS = [
  {
    id: "USR-10231",
    name: "Arjun Mehta",
    mobile: "+91 98765 43120",
    email: "arjun.mehta@gmail.com",
    city: "Ahmedabad",
    inquiries30d: 18,
    saved: 12,
    inspectionReq: 3,
    risk: "Low",
    status: "Active",
    lastActive: "2h ago",
    signupMethod: "Google",
    appInstalled: true,
    chatViolations: 0,
    inquiryIds: ["INQ-103", "INQ-107"],
    ipAddress: "103.22.14.80",
    signupDate: "12 Jan 2026",
    totalBookings: 2,
    totalInquiries: 64,
    totalInspectionRequests: 7,
    deviceHistory: ["iPhone 14", "Chrome on Windows"],
    ipHistory: ["103.22.14.80", "103.22.14.81"],
    loginMethods: ["Google", "OTP"],
    activityLog: [
      "Inquiry sent for Hyundai Creta",
      "Saved Tata Nexon",
      "Inspection requested for Kia Seltos",
    ],
  },
  {
    id: "USR-10232",
    name: "Priya Shah",
    mobile: "+91 98989 11120",
    email: "priya.shah@gmail.com",
    city: "Surat",
    inquiries30d: 42,
    saved: 5,
    inspectionReq: 8,
    risk: "Moderate",
    status: "Under Review",
    lastActive: "25m ago",
    signupMethod: "OTP",
    appInstalled: true,
    chatViolations: 2,
    inquiryIds: ["INQ-301", "INQ-304", "INQ-312"],
    ipAddress: "182.71.22.190",
    signupDate: "03 Feb 2026",
    totalBookings: 1,
    totalInquiries: 112,
    totalInspectionRequests: 18,
    deviceHistory: ["Samsung S23", "Chrome on Mac"],
    ipHistory: ["182.71.22.190", "182.71.22.191"],
    loginMethods: ["OTP"],
    activityLog: [
      "Repeated inquiries to multiple consultants",
      "Chat flagged for external number sharing",
      "Inspection escalation raised",
    ],
  },
  {
    id: "USR-10233",
    name: "Rahul Patel",
    mobile: "+91 99881 77760",
    email: "rahulpatel@outlook.com",
    city: "Vadodara",
    inquiries30d: 6,
    saved: 21,
    inspectionReq: 1,
    risk: "Low",
    status: "Limited",
    lastActive: "1d ago",
    signupMethod: "Apple",
    appInstalled: false,
    chatViolations: 0,
    inquiryIds: ["INQ-510"],
    ipAddress: "49.36.89.10",
    signupDate: "27 Dec 2025",
    totalBookings: 0,
    totalInquiries: 26,
    totalInspectionRequests: 2,
    deviceHistory: ["Safari on iPhone"],
    ipHistory: ["49.36.89.10"],
    loginMethods: ["Apple"],
    activityLog: [
      "Inquiry cap applied",
      "Saved 4 vehicles in one session",
      "Viewed 19 vehicle profiles",
    ],
  },
  {
    id: "USR-10234",
    name: "Sneha Verma",
    mobile: "+91 97655 20110",
    email: "sneha.verma@yahoo.com",
    city: "Rajkot",
    inquiries30d: 55,
    saved: 2,
    inspectionReq: 10,
    risk: "High",
    status: "Suspended",
    lastActive: "3d ago",
    signupMethod: "OTP",
    appInstalled: true,
    chatViolations: 5,
    inquiryIds: ["INQ-900", "INQ-901", "INQ-902"],
    ipAddress: "117.201.55.4",
    signupDate: "08 Jan 2026",
    totalBookings: 0,
    totalInquiries: 143,
    totalInspectionRequests: 24,
    deviceHistory: ["Redmi Note 12", "Chrome on Windows"],
    ipHistory: ["117.201.55.4", "117.201.55.8", "117.201.55.9"],
    loginMethods: ["OTP"],
    activityLog: [
      "Account suspended for inquiry spam",
      "Multiple accounts detected on same IP",
      "Chat abuse violation logged",
    ],
  },
  {
    id: "USR-10235",
    name: "Faizan Khan",
    mobile: "+91 90909 45210",
    email: "faizan.khan@gmail.com",
    city: "Ahmedabad",
    inquiries30d: 29,
    saved: 11,
    inspectionReq: 4,
    risk: "Moderate",
    status: "Active",
    lastActive: "5h ago",
    signupMethod: "Google",
    appInstalled: true,
    chatViolations: 1,
    inquiryIds: ["INQ-777", "INQ-778"],
    ipAddress: "45.123.98.12",
    signupDate: "18 Feb 2026",
    totalBookings: 3,
    totalInquiries: 77,
    totalInspectionRequests: 9,
    deviceHistory: ["Pixel 8", "Chrome on Android"],
    ipHistory: ["45.123.98.12"],
    loginMethods: ["Google", "OTP"],
    activityLog: [
      "Marked one chat as suspicious",
      "Added vehicle to saved list",
      "Requested inspection for Honda City",
    ],
  },
];

const STATUS_OPTIONS = ["Active", "Suspended", "Under Review", "Limited", "Banned"];
const RISK_OPTIONS = ["Low", "Moderate", "High"];
const SIGNUP_OPTIONS = ["OTP", "Google", "Apple"];

/* =========================================================
   BADGES (Light Mode)
========================================================= */
const statusBadge = (status) => {
  const map = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Suspended: "bg-rose-50 text-rose-700 border-rose-200",
    "Under Review": "bg-amber-50 text-amber-700 border-amber-200",
    Limited: "bg-sky-50 text-sky-700 border-sky-200",
    Banned: "bg-red-50 text-red-700 border-red-200",
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

const signupBadge = (method) => {
  const map = {
    OTP: "bg-slate-100 text-slate-700 border-slate-200",
    Google: "bg-sky-50 text-sky-700 border-sky-200",
    Apple: "bg-violet-50 text-violet-700 border-violet-200",
  };
  return map[method] || "bg-slate-50 text-slate-700 border-slate-200";
};

/* =========================================================
   ROW ACTIONS
========================================================= */
function RowActions({
  item,
  onView,
  onSuspend,
  onReinstate,
  onLimit,
  onFlag,
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
        <div className="absolute right-0 top-11 z-30 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
          <button
            onClick={() => {
              onView(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Eye className="h-4 w-4 text-slate-500" />
            View Profile
          </button>

          {item.status === "Suspended" ? (
            <button
              onClick={() => {
                onReinstate(item);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              <ShieldCheck className="h-4 w-4" />
              Reinstate
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  onSuspend(item);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-rose-700 hover:bg-rose-50 transition-colors"
              >
                <Ban className="h-4 w-4" />
                Suspend
              </button>

              <button
                onClick={() => {
                  onLimit(item);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-sky-700 hover:bg-sky-50 transition-colors"
              >
                <MessageSquareWarning className="h-4 w-4" />
                Limit Inquiries
              </button>

              <button
                onClick={() => {
                  onFlag(item);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-amber-700 hover:bg-amber-50 transition-colors"
              >
                <ShieldAlert className="h-4 w-4" />
                Flag for Review
              </button>
            </>
          )}

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
   PROFILE DRAWER
========================================================= */
function UserProfileDrawer({ item, onClose, onSuspend, onLimit, onFlag }) {
  if (!item) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-[480px] border-l border-slate-200 bg-white shadow-2xl flex flex-col">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 shrink-0 bg-slate-50">
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">{item.name}</h3>
            <p className="mt-1 text-sm text-slate-500">{item.id}</p>

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
                  signupBadge(item.signupMethod)
                )}
              >
                {item.signupMethod}
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
            <StatCard label="Signup Date" value={item.signupDate} icon={CalendarDays} />
            <StatCard
              label="App Installed"
              value={item.appInstalled ? "Yes" : "No"}
              icon={Smartphone}
            />
            <StatCard label="Total Inquiries" value={item.totalInquiries} icon={MessagesSquare} />
            <StatCard label="Bookings" value={item.totalBookings} icon={Activity} />
            <StatCard
              label="Inspection Req"
              value={item.totalInspectionRequests}
              icon={ShieldCheck}
            />
            <StatCard label="Last Active" value={item.lastActive} icon={Clock3} />
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-4">
              Account Details
            </h4>
            <div className="space-y-4 text-sm">
              <InfoRow icon={User} label="Name" value={item.name} />
              <InfoRow icon={Smartphone} label="Mobile" value={item.mobile} />
              <InfoRow icon={MapPin} label="City" value={item.city} />
              <InfoRow icon={MessagesSquare} label="Email" value={item.email} />
              <InfoRow icon={ShieldAlert} label="IP Address" value={item.ipAddress} />
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-4">
              Activity Overview
            </h4>

            <div>
              <SectionList title="Device History" items={item.deviceHistory} />
              <SectionList title="IP History" items={item.ipHistory} />
              <SectionList title="Login Methods" items={item.loginMethods} />
              <SectionList title="Activity Log" items={item.activityLog} />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {item.status !== "Suspended" && (
              <button
                onClick={() => onSuspend(item)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-[13px] font-semibold text-rose-700 transition hover:bg-rose-100"
              >
                <Ban className="h-4 w-4" />
                Suspend
              </button>
            )}

            <button
              onClick={() => onLimit(item)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-[13px] font-semibold text-sky-700 transition hover:bg-sky-100"
            >
              <MessageSquareWarning className="h-4 w-4" />
              Limit
            </button>

            <button
              onClick={() => onFlag(item)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] font-semibold text-amber-700 transition hover:bg-amber-100"
            >
              <TriangleAlert className="h-4 w-4" />
              Flag
            </button>
          </div>
        </div>
      </div>
    </>
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

function SectionList({ title, items = [] }) {
  return (
    <div className="mb-5 last:mb-0">
      <h5 className="mb-2 text-[13px] font-semibold text-slate-700">{title}</h5>
      <div className="space-y-2">
        {items.length ? (
          items.map((item, idx) => (
            <div
              key={`${title}-${idx}`}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[13px] text-slate-600 leading-relaxed"
            >
              {item}
            </div>
          ))
        ) : (
          <div className="text-[13px] text-slate-400">No records</div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   MODALS
========================================================= */
function SuspendModal({ modal, onClose, onConfirm }) {
  const [reason, setReason] = useState("Inquiry spam");
  const [type, setType] = useState("Temporary");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (modal?.type === "suspend") {
      setReason("Inquiry spam");
      setType("Temporary");
      setDate("");
    }
  }, [modal]);

  if (!modal || modal.type !== "suspend") return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[61] w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Suspend User</h3>
            <p className="mt-1 text-[13px] text-slate-500">
              {modal.item.name} • {modal.item.id}
            </p>
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
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-slate-900 text-[13px] appearance-none"
            >
              <option>Inquiry spam</option>
              <option>Abuse in chat</option>
              <option>Fake inspection</option>
              <option>Fraud suspicion</option>
              <option>Multiple accounts</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-medium text-slate-700">
              Suspension Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["Temporary", "Permanent"].map((item) => (
                <button
                  key={item}
                  onClick={() => setType(item)}
                  className={cls(
                    "rounded-xl border px-4 py-2.5 text-[13px] font-semibold transition-all",
                    type === item
                      ? "border-rose-300 bg-rose-50 text-rose-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {type === "Temporary" && (
            <div>
              <label className="mb-2 block text-[13px] font-medium text-slate-700">
                End Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-slate-900 text-[13px]"
              />
            </div>
          )}

          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[12px] leading-relaxed text-rose-700">
            This will block login, chat, inquiries and log the moderation action immediately.
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
                suspendReason: reason,
                suspendType: type,
                suspendUntil: date,
              })
            }
            className="rounded-xl bg-rose-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-rose-700 transition-colors"
          >
            Confirm Suspend
          </button>
        </div>
      </div>
    </>
  );
}

function LimitModal({ modal, onClose, onConfirm }) {
  const [maxPerDay, setMaxPerDay] = useState(2);
  const [duration, setDuration] = useState(7);
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (modal?.type === "limit") {
      setMaxPerDay(2);
      setDuration(7);
      setReason("");
    }
  }, [modal]);

  if (!modal || modal.type !== "limit") return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[61] w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Limit Daily Inquiries</h3>
            <p className="mt-1 text-[13px] text-slate-500">
              {modal.item.name} • {modal.item.id}
            </p>
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
            <label className="mb-2 block text-[13px] font-medium text-slate-700">
              Max per day
            </label>
            <input
              type="number"
              min="1"
              value={maxPerDay}
              onChange={(e) => setMaxPerDay(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-slate-900 text-[13px]"
            />
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-medium text-slate-700">
              Duration (days)
            </label>
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-slate-900 text-[13px]"
            />
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-medium text-slate-700">Reason</label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason..."
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
                inquiryCap: maxPerDay,
                inquiryCapDays: duration,
                inquiryCapReason: reason,
              })
            }
            className="rounded-xl bg-sky-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-sky-700 transition-colors"
          >
            Apply Limit
          </button>
        </div>
      </div>
    </>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */
const AllUsers = () => {
  const [rows, setRows] = useState(DUMMY_USERS);
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    city: "",
    status: "",
    risk: "",
    signupMethod: "",
    appInstalled: "",
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [modal, setModal] = useState(null);

  const filteredRows = useMemo(() => {
    let data = [...rows];

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q) ||
          r.mobile.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.city.toLowerCase().includes(q) ||
          r.ipAddress.toLowerCase().includes(q) ||
          r.inquiryIds.some((id) => id.toLowerCase().includes(q))
      );
    }

    if (filters.city) data = data.filter((r) => r.city === filters.city);
    if (filters.status) data = data.filter((r) => r.status === filters.status);
    if (filters.risk) data = data.filter((r) => r.risk === filters.risk);
    if (filters.signupMethod) data = data.filter((r) => r.signupMethod === filters.signupMethod);
    if (filters.appInstalled) {
      data = data.filter((r) =>
        filters.appInstalled === "Yes" ? r.appInstalled : !r.appInstalled
      );
    }

    return data;
  }, [rows, search, filters]);

  const stats = useMemo(() => {
    return {
      total: rows.length,
      active: rows.filter((r) => r.status === "Active").length,
      suspended: rows.filter((r) => r.status === "Suspended").length,
      highRisk: rows.filter((r) => r.risk === "High").length,
    };
  }, [rows]);

  const uniqueCities = useMemo(() => [...new Set(rows.map((r) => r.city))], [rows]);

  const handleRefresh = () => {
    setRows([...DUMMY_USERS]);
  };

  const handleClear = () => {
    setSearch("");
    setFilters({
      city: "",
      status: "",
      risk: "",
      signupMethod: "",
      appInstalled: "",
    });
    setFiltersOpen(false);
  };

  const handleSuspendConfirm = (item) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === item.id ? { ...r, status: "Suspended", risk: "High" } : r
      )
    );
    if (selectedUser?.id === item.id) {
      setSelectedUser((prev) => ({ ...prev, status: "Suspended", risk: "High" }));
    }
    setModal(null);
  };

  const handleLimitConfirm = (item) => {
    setRows((prev) =>
      prev.map((r) => (r.id === item.id ? { ...r, status: "Limited" } : r))
    );
    if (selectedUser?.id === item.id) {
      setSelectedUser((prev) => ({ ...prev, status: "Limited" }));
    }
    setModal(null);
  };

  const handleReinstate = (item) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === item.id ? { ...r, status: "Active", risk: "Moderate" } : r
      )
    );
    if (selectedUser?.id === item.id) {
      setSelectedUser((prev) => ({ ...prev, status: "Active", risk: "Moderate" }));
    }
  };

  const handleFlag = (item) => {
    setRows((prev) =>
      prev.map((r) => (r.id === item.id ? { ...r, status: "Under Review" } : r))
    );
    if (selectedUser?.id === item.id) {
      setSelectedUser((prev) => ({ ...prev, status: "Under Review" }));
    }
  };

  const handleNote = (item) => {
    alert(`Internal note action for ${item.name}`);
  };

  return (
    // <div className="min-h-screen bg-slate-50 p-5 md:p-6 lg:p-8">
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
              All Buyers
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-500">
              Manage buyer accounts, monitor inquiry behavior, review risk
              patterns, and maintain a healthy marketplace.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <TopCard title="Total Users" value={stats.total} />
          <TopCard title="Active Users" value={stats.active} />
          <TopCard title="Suspended" value={stats.suspended} />
          <TopCard title="High Risk" value={stats.highRisk} />
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
                  placeholder="Search by User ID, mobile, email, city..."
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
                  <option value="">All Cities</option>
                  {uniqueCities.map((city) => (
                    <option key={city}>{city}</option>
                  ))}
                </select>

                <select
                  value={filters.status}
                  onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">All Status</option>
                  {STATUS_OPTIONS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <select
                  value={filters.risk}
                  onChange={(e) => setFilters((p) => ({ ...p, risk: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">All Risk</option>
                  {RISK_OPTIONS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <select
                  value={filters.signupMethod}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, signupMethod: e.target.value }))
                  }
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">All Signup Methods</option>
                  {SIGNUP_OPTIONS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <select
                  value={filters.appInstalled}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, appInstalled: e.target.value }))
                  }
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">App Installed</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            )}
          </div>

          <div className="w-full overflow-x-auto table-scroll relative z-10 pb-4">
            <table className="min-w-[1450px] w-full border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">User Name & ID</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Source</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Contact</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap text-center">Inquiries</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap text-center">Saved</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap text-center">Requests</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Risk</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Status</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Last Active</th>
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
                        selectedUser?.id === row.id && "bg-sky-50"
                      )}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-100 to-blue-100 border border-slate-200 flex items-center justify-center shrink-0">
                            <span className="text-[14px] font-bold text-sky-700">
                              {row.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="text-[14px] font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                              {row.name}
                            </div>
                            <div className="mt-0.5 text-[12px] flex items-center gap-1.5 text-slate-500 font-mono">
                              <span>{row.id}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-[13px] text-slate-700 font-medium">{row.signupMethod}</span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            {row.appInstalled ? <Smartphone size={12} /> : <User size={12} />}
                            {row.appInstalled ? "App Installed" : "Web Session"}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-[13px] font-medium text-slate-700">{row.mobile}</span>
                          <span className="text-[12px] text-slate-500 truncate max-w-[150px]">
                            {row.email}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-[13px] font-semibold text-slate-700 border border-slate-200">
                          {row.inquiries30d}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-[13px] font-semibold text-slate-700 border border-slate-200">
                          {row.saved}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-[13px] font-semibold text-slate-700 border border-slate-200">
                          {row.inspectionReq}
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

                      <td className="px-5 py-4 text-[13px] font-medium text-slate-500 whitespace-nowrap">
                        {row.lastActive}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <RowActions
                          item={row}
                          onView={setSelectedUser}
                          onSuspend={(item) => setModal({ type: "suspend", item })}
                          onReinstate={handleReinstate}
                          onLimit={(item) => setModal({ type: "limit", item })}
                          onFlag={handleFlag}
                          onNote={handleNote}
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
                          No buyers found
                        </div>
                        <div className="mt-1 text-[14px] text-slate-500 max-w-sm mx-auto">
                          Try adjusting your search criteria or clear active filters to see more results.
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
      </div>

      <UserProfileDrawer
        item={selectedUser}
        onClose={() => setSelectedUser(null)}
        onSuspend={(item) => setModal({ type: "suspend", item })}
        onLimit={(item) => setModal({ type: "limit", item })}
        onFlag={handleFlag}
      />

      <SuspendModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleSuspendConfirm}
      />

      <LimitModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleLimitConfirm}
      />
    </div>
  );
};

function TopCard({ title, value }) {
  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-6 overflow-hidden group shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex items-end justify-between">
        <div>
          <div className="text-[12px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-2">
            {title}
          </div>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-baseline gap-1">
            {value}
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 transition-colors duration-300">
          <User size={18} />
        </div>
      </div>
    </div>
  );
}

export default AllUsers;