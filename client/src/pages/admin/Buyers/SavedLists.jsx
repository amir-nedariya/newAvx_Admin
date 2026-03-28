import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  RefreshCw,
  MoreHorizontal,
  Car,
  User,
  Users,
  NotebookPen,
  Flag,
  Trash2,
  X,
  Heart,
  GitCompareArrows,
  BellRing,
  ShieldAlert,
  TrendingUp,
  BarChart3,
} from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

/* =========================================================
   DUMMY DATA
========================================================= */
const DUMMY_SAVED_LISTS = [
  {
    id: "SAVE-1001",
    userId: "USR-10231",
    buyerName: "Arjun Mehta",
    type: "Wishlist",
    vehicleId: "VH-7812",
    vehicleTitle: "Hyundai Creta SX 2021",
    consultant: "Metro Auto Hub",
    consultantTier: "Premium",
    city: "Ahmedabad",
    date: "09 Mar 2026",
    buyerRisk: "Low",
    vehicleRisk: "Low",
    suspendedBuyer: false,
    buyerEmail: "arjun.mehta@gmail.com",
    saveCount: 24,
    compareCount: 5,
    followedCount: 3,
    pattern: {
      savesPerDay: "8/day",
      duplicateSaves: 1,
      multiAccountSameVehicle: false,
      rapidSaveActivity: false,
    },
    wishlistVehicles: [
      {
        id: "VH-7812",
        title: "Hyundai Creta SX 2021",
        consultant: "Metro Auto Hub",
        tier: "Premium",
        inspection: "AVX_INSPECTED",
        savedOn: "09 Mar 2026",
      },
      {
        id: "VH-6109",
        title: "Kia Seltos GTX 2020",
        consultant: "Prime Wheels",
        tier: "Pro",
        inspection: "AI_INSPECTED",
        savedOn: "08 Mar 2026",
      },
    ],
    compareList: [
      "Hyundai Creta SX 2021",
      "Kia Seltos GTX 2020",
      "Honda City ZX 2022",
    ],
    followedConsultants: [
      { name: "Metro Auto Hub", tier: "Premium", followDate: "01 Mar 2026" },
      { name: "Prime Wheels", tier: "Pro", followDate: "05 Mar 2026" },
    ],
  },
  {
    id: "SAVE-1002",
    userId: "USR-10232",
    buyerName: "Priya Shah",
    type: "Compare",
    vehicleId: "VH-9002",
    vehicleTitle: "Tata Nexon XZ+ 2022",
    consultant: "City Drive",
    consultantTier: "Pro",
    city: "Surat",
    date: "08 Mar 2026",
    buyerRisk: "Moderate",
    vehicleRisk: "Low",
    suspendedBuyer: false,
    buyerEmail: "priya.shah@gmail.com",
    saveCount: 41,
    compareCount: 12,
    followedCount: 1,
    pattern: {
      savesPerDay: "14/day",
      duplicateSaves: 3,
      multiAccountSameVehicle: true,
      rapidSaveActivity: false,
    },
    wishlistVehicles: [
      {
        id: "VH-9002",
        title: "Tata Nexon XZ+ 2022",
        consultant: "City Drive",
        tier: "Pro",
        inspection: "SELF_INSPECTED",
        savedOn: "08 Mar 2026",
      },
    ],
    compareList: [
      "Tata Nexon XZ+ 2022",
      "Mahindra XUV300 W8 2021",
      "Maruti Brezza ZXI 2020",
    ],
    followedConsultants: [
      { name: "City Drive", tier: "Pro", followDate: "04 Mar 2026" },
    ],
  },
  {
    id: "SAVE-1003",
    userId: "USR-10234",
    buyerName: "Sneha Verma",
    type: "Follow Consultant",
    vehicleId: "",
    vehicleTitle: "—",
    consultant: "Royal Cars",
    consultantTier: "Premium",
    city: "Rajkot",
    date: "07 Mar 2026",
    buyerRisk: "High",
    vehicleRisk: "Moderate",
    suspendedBuyer: true,
    buyerEmail: "sneha.verma@yahoo.com",
    saveCount: 72,
    compareCount: 18,
    followedCount: 7,
    pattern: {
      savesPerDay: "32/day",
      duplicateSaves: 9,
      multiAccountSameVehicle: true,
      rapidSaveActivity: true,
    },
    wishlistVehicles: [
      {
        id: "VH-4431",
        title: "Toyota Innova Crysta 2021",
        consultant: "Royal Cars",
        tier: "Premium",
        inspection: "AVX_INSPECTED",
        savedOn: "07 Mar 2026",
      },
    ],
    compareList: ["Toyota Innova Crysta 2021", "Ertiga ZXI 2020"],
    followedConsultants: [
      { name: "Royal Cars", tier: "Premium", followDate: "07 Mar 2026" },
      { name: "Westline Auto", tier: "Premium", followDate: "06 Mar 2026" },
    ],
  },
  {
    id: "SAVE-1004",
    userId: "USR-10235",
    buyerName: "Faizan Khan",
    type: "Auto-Save",
    vehicleId: "VH-5510",
    vehicleTitle: "Honda City ZX 2022",
    consultant: "Elite Motors",
    consultantTier: "Premium",
    city: "Ahmedabad",
    date: "10 Mar 2026",
    buyerRisk: "Moderate",
    vehicleRisk: "Low",
    suspendedBuyer: false,
    buyerEmail: "faizan.khan@gmail.com",
    saveCount: 13,
    compareCount: 2,
    followedCount: 0,
    pattern: {
      savesPerDay: "4/day",
      duplicateSaves: 0,
      multiAccountSameVehicle: false,
      rapidSaveActivity: false,
    },
    wishlistVehicles: [
      {
        id: "VH-5510",
        title: "Honda City ZX 2022",
        consultant: "Elite Motors",
        tier: "Premium",
        inspection: "AI_INSPECTED",
        savedOn: "10 Mar 2026",
      },
    ],
    compareList: ["Honda City ZX 2022", "Verna SX 2021"],
    followedConsultants: [],
  },
  {
    id: "SAVE-1005",
    userId: "USR-10240",
    buyerName: "Rohan Desai",
    type: "Wishlist",
    vehicleId: "VH-3022",
    vehicleTitle: "Mahindra Scorpio N Z8 2023",
    consultant: "Torque Wheels",
    consultantTier: "Pro",
    city: "Vadodara",
    date: "06 Mar 2026",
    buyerRisk: "Low",
    vehicleRisk: "Low",
    suspendedBuyer: false,
    buyerEmail: "rohan.desai@gmail.com",
    saveCount: 8,
    compareCount: 1,
    followedCount: 2,
    pattern: {
      savesPerDay: "2/day",
      duplicateSaves: 0,
      multiAccountSameVehicle: false,
      rapidSaveActivity: false,
    },
    wishlistVehicles: [
      {
        id: "VH-3022",
        title: "Mahindra Scorpio N Z8 2023",
        consultant: "Torque Wheels",
        tier: "Pro",
        inspection: "AVX_INSPECTED",
        savedOn: "06 Mar 2026",
      },
    ],
    compareList: ["Mahindra Scorpio N Z8 2023"],
    followedConsultants: [
      { name: "Torque Wheels", tier: "Pro", followDate: "02 Mar 2026" },
    ],
  },
];

const SAVE_TYPES = ["Wishlist", "Compare", "Follow Consultant", "Auto-Save"];
const RISK_OPTIONS = ["Low", "Moderate", "High"];
const TIER_OPTIONS = ["Basic", "Pro", "Premium"];

/* =========================================================
   BADGES
========================================================= */
const saveTypeBadge = (type) => {
  const map = {
    Wishlist: "bg-rose-50 text-rose-700 border-rose-200",
    Compare: "bg-sky-50 text-sky-700 border-sky-200",
    "Follow Consultant": "bg-violet-50 text-violet-700 border-violet-200",
    "Auto-Save": "bg-amber-50 text-amber-700 border-amber-200",
  };
  return map[type] || "bg-slate-100 text-slate-700 border-slate-200";
};

const riskBadge = (risk) => {
  const map = {
    Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Moderate: "bg-amber-50 text-amber-700 border-amber-200",
    High: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return map[risk] || "bg-slate-100 text-slate-700 border-slate-200";
};

const tierBadge = (tier) => {
  if (tier === "Premium") return "bg-violet-50 text-violet-700 border-violet-200";
  if (tier === "Pro") return "bg-sky-50 text-sky-700 border-sky-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
};

const inspectionBadge = (status) => {
  const map = {
    AVX_INSPECTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    AI_INSPECTED: "bg-indigo-50 text-indigo-700 border-indigo-200",
    SELF_INSPECTED: "bg-slate-100 text-slate-700 border-slate-200",
  };
  return map[status] || "bg-slate-100 text-slate-700 border-slate-200";
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

function PatternBox({ title, value }) {
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
function SavedRowActions({
  item,
  onViewBuyer,
  onViewVehicle,
  onViewConsultant,
  onRemove,
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
        <div className="absolute right-0 top-11 z-30 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
          <button
            onClick={() => {
              onViewBuyer(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <User className="h-4 w-4 text-slate-500" />
            View Buyer Profile
          </button>

          {item.vehicleTitle !== "—" && (
            <button
              onClick={() => {
                onViewVehicle(item);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Car className="h-4 w-4 text-slate-500" />
              View Vehicle
            </button>
          )}

          <button
            onClick={() => {
              onViewConsultant(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Users className="h-4 w-4 text-slate-500" />
            View Consultant
          </button>

          <button
            onClick={() => {
              onRemove(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-rose-700 hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Remove Save
          </button>

          <button
            onClick={() => {
              onFlag(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-amber-700 hover:bg-amber-50 transition-colors"
          >
            <Flag className="h-4 w-4" />
            Flag Suspicious
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
function SavedActivityDrawer({ item, onClose, onRemove, onFlag }) {
  if (!item) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-[580px] border-l border-slate-200 bg-white shadow-2xl flex flex-col">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 bg-slate-50">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{item.buyerName}</h3>
            <p className="mt-1 text-sm text-slate-500">
              {item.userId} • {item.buyerEmail}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span
                className={cls(
                  "inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold border",
                  riskBadge(item.buyerRisk)
                )}
              >
                {item.buyerRisk} Risk
              </span>
              {item.suspendedBuyer && (
                <span className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold border bg-rose-50 text-rose-700 border-rose-200">
                  Suspended Buyer
                </span>
              )}
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatCard label="Total Saves" value={item.saveCount} icon={Heart} />
            <StatCard label="Total Compares" value={item.compareCount} icon={GitCompareArrows} />
            <StatCard label="Consultants Followed" value={item.followedCount} icon={BellRing} />
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
              Wishlist Vehicles
            </h4>

            <div className="mt-4 space-y-3">
              {item.wishlistVehicles.length ? (
                item.wishlistVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-900 break-words">
                          {vehicle.title}
                        </div>
                        <div className="mt-1 text-sm text-slate-500">
                          {vehicle.consultant} • {vehicle.id}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span
                          className={cls(
                            "inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border",
                            tierBadge(vehicle.tier)
                          )}
                        >
                          {vehicle.tier}
                        </span>
                        <span
                          className={cls(
                            "inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border",
                            inspectionBadge(vehicle.inspection)
                          )}
                        >
                          {vehicle.inspection}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-slate-500">
                      Saved On: {vehicle.savedOn}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-500">No wishlist items</div>
              )}
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
              Compare List
            </h4>

            <div className="mt-4 space-y-2">
              {item.compareList.length ? (
                item.compareList.map((name, idx) => (
                  <div
                    key={`${name}-${idx}`}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[13px] text-slate-600"
                  >
                    {name}
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-500">No compare vehicles</div>
              )}
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
              Followed Consultants
            </h4>

            <div className="mt-4 space-y-3">
              {item.followedConsultants.length ? (
                item.followedConsultants.map((consultant, idx) => (
                  <div
                    key={`${consultant.name}-${idx}`}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-900 break-words">
                          {consultant.name}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          Followed On: {consultant.followDate}
                        </div>
                      </div>

                      <span
                        className={cls(
                          "inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border",
                          tierBadge(consultant.tier)
                        )}
                      >
                        {consultant.tier}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-500">No followed consultants</div>
              )}
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
              Save Behavior Pattern
            </h4>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <PatternBox title="Saves Per Day" value={item.pattern.savesPerDay} />
              <PatternBox title="Duplicate Saves" value={item.pattern.duplicateSaves} />
              <PatternBox
                title="Same Vehicle Multi Accounts"
                value={item.pattern.multiAccountSameVehicle ? "Yes" : "No"}
              />
              <PatternBox
                title="Rapid Save Activity"
                value={item.pattern.rapidSaveActivity ? "Yes" : "No"}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <button
              onClick={() => onRemove(item)}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-[13px] font-semibold text-white hover:bg-rose-700"
            >
              <Trash2 className="h-4 w-4" />
              Remove Save
            </button>

            <button
              onClick={() => onFlag(item)}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] font-semibold text-amber-700 hover:bg-amber-100"
            >
              <Flag className="h-4 w-4" />
              Flag Suspicious
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
function RemoveSaveModal({ modal, onClose, onConfirm }) {
  const [reason, setReason] = useState("Fraud pattern");

  useEffect(() => {
    if (modal?.type === "remove") {
      setReason("Fraud pattern");
    }
  }, [modal]);

  if (!modal || modal.type !== "remove") return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[61] w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Remove Saved Item</h3>
            <p className="mt-1 text-[13px] text-slate-500">
              {modal.item.id} • {modal.item.buyerName}
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
              Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-slate-900 text-[13px]"
            >
              <option>Fraud pattern</option>
              <option>Bot detection</option>
              <option>Policy violation</option>
              <option>Manual moderation</option>
            </select>
          </div>

          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[12px] leading-relaxed text-rose-700">
            This action will be logged with admin id, save id, buyer id, and reason.
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
            onClick={() => onConfirm({ ...modal.item, removeReason: reason })}
            className="rounded-xl bg-rose-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-rose-700 transition-colors"
          >
            Confirm Remove
          </button>
        </div>
      </div>
    </>
  );
}

function FlagSuspiciousModal({ modal, onClose, onConfirm }) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (modal?.type === "flag") setReason("");
  }, [modal]);

  if (!modal || modal.type !== "flag") return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[61] w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Flag Suspicious Behavior</h3>
            <p className="mt-1 text-[13px] text-slate-500">
              {modal.item.id} • {modal.item.buyerName}
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
              Reason
            </label>
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter suspicious behavior reason..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-slate-900 text-[13px]"
            />
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] leading-relaxed text-amber-700">
            This may increase risk score and trigger auto review if threshold is crossed.
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
            onClick={() => onConfirm({ ...modal.item, flagReason: reason })}
            className="rounded-xl bg-amber-500 px-4 py-2 text-[13px] font-semibold text-white hover:bg-amber-600 transition-colors"
          >
            Confirm Flag
          </button>
        </div>
      </div>
    </>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */
const SavedLists = () => {
  const [rows, setRows] = useState(DUMMY_SAVED_LISTS);
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [quickFilter, setQuickFilter] = useState("all");
  const [filters, setFilters] = useState({
    saveType: "",
    buyerRisk: "",
    vehicleRisk: "",
    tier: "",
    city: "",
    suspendedBuyer: "",
  });

  const [selectedItem, setSelectedItem] = useState(null);
  const [modal, setModal] = useState(null);

  const uniqueCities = useMemo(() => [...new Set(rows.map((r) => r.city))], [rows]);

  const summary = useMemo(() => {
    const totalSaves = rows.length;
    const uniqueBuyers = new Set(rows.map((r) => r.userId)).size;

    const mostSavedVehicleMap = {};
    rows.forEach((r) => {
      if (r.vehicleTitle && r.vehicleTitle !== "—") {
        mostSavedVehicleMap[r.vehicleTitle] =
          (mostSavedVehicleMap[r.vehicleTitle] || 0) + 1;
      }
    });

    const mostSavedVehicle =
      Object.entries(mostSavedVehicleMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

    const consultantMap = {};
    rows.forEach((r) => {
      consultantMap[r.consultant] = (consultantMap[r.consultant] || 0) + 1;
    });

    const mostFollowedConsultant =
      Object.entries(consultantMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

    const compareUsage = rows.filter((r) => r.type === "Compare").length;

    return {
      totalSaves,
      uniqueBuyers,
      mostSavedVehicle,
      mostFollowedConsultant,
      compareUsage,
    };
  }, [rows]);

  const filteredRows = useMemo(() => {
    let data = [...rows];

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.userId.toLowerCase().includes(q) ||
          r.consultant.toLowerCase().includes(q) ||
          r.city.toLowerCase().includes(q) ||
          r.vehicleId.toLowerCase().includes(q) ||
          r.buyerName.toLowerCase().includes(q)
      );
    }

    if (filters.saveType) data = data.filter((r) => r.type === filters.saveType);
    if (filters.buyerRisk) data = data.filter((r) => r.buyerRisk === filters.buyerRisk);
    if (filters.vehicleRisk)
      data = data.filter((r) => r.vehicleRisk === filters.vehicleRisk);
    if (filters.tier) data = data.filter((r) => r.consultantTier === filters.tier);
    if (filters.city) data = data.filter((r) => r.city === filters.city);
    if (filters.suspendedBuyer) {
      data = data.filter((r) =>
        filters.suspendedBuyer === "Yes" ? r.suspendedBuyer : !r.suspendedBuyer
      );
    }

    if (quickFilter === "wishlist") data = data.filter((r) => r.type === "Wishlist");
    if (quickFilter === "compare") data = data.filter((r) => r.type === "Compare");
    if (quickFilter === "follow")
      data = data.filter((r) => r.type === "Follow Consultant");
    if (quickFilter === "suspended") data = data.filter((r) => r.suspendedBuyer);

    return data;
  }, [rows, search, filters, quickFilter]);

  const handleRefresh = () => setRows([...DUMMY_SAVED_LISTS]);

  const handleClear = () => {
    setSearch("");
    setQuickFilter("all");
    setFilters({
      saveType: "",
      buyerRisk: "",
      vehicleRisk: "",
      tier: "",
      city: "",
      suspendedBuyer: "",
    });
    setFiltersOpen(false);
  };

  const handleRemoveConfirm = (item) => {
    setRows((prev) => prev.filter((r) => r.id !== item.id));
    if (selectedItem?.id === item.id) setSelectedItem(null);
    setModal(null);
  };

  const handleFlagConfirm = (item) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === item.id
          ? {
              ...r,
              buyerRisk: r.buyerRisk === "Low" ? "Moderate" : "High",
            }
          : r
      )
    );

    if (selectedItem?.id === item.id) {
      setSelectedItem((prev) => ({
        ...prev,
        buyerRisk: prev.buyerRisk === "Low" ? "Moderate" : "High",
      }));
    }

    setModal(null);
  };

  const handleViewVehicle = (item) => {
    alert(`View vehicle: ${item.vehicleTitle}`);
  };

  const handleViewConsultant = (item) => {
    alert(`View consultant: ${item.consultant}`);
  };

  const handleNote = (item) => {
    alert(`Add internal note for ${item.buyerName}`);
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
              Saved Lists
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-500">
              Monitor buyer wishlist behavior, compare usage, consultant follow trends,
              and suspicious save patterns across the marketplace.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <TopCard
            title="Total Saves (30d)"
            value={summary.totalSaves}
            icon={Heart}
            active={quickFilter === "all"}
            onClick={() => setQuickFilter("all")}
          />
          <TopCard
            title="Unique Buyers"
            value={summary.uniqueBuyers}
            icon={Users}
            active={quickFilter === "wishlist"}
            onClick={() => setQuickFilter("wishlist")}
          />
          <TopCard
            title="Most Saved Vehicle"
            value={summary.mostSavedVehicle}
            icon={Car}
            active={quickFilter === "compare"}
            onClick={() => setQuickFilter("compare")}
          />
          <TopCard
            title="Most Followed Consultant"
            value={summary.mostFollowedConsultant}
            icon={TrendingUp}
            active={quickFilter === "follow"}
            onClick={() => setQuickFilter("follow")}
          />
          <TopCard
            title="Compare Usage"
            value={summary.compareUsage}
            icon={BarChart3}
            active={quickFilter === "suspended"}
            onClick={() => setQuickFilter("suspended")}
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
                  placeholder="Search by User ID, Vehicle ID, Consultant, City..."
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
                  value={filters.saveType}
                  onChange={(e) => setFilters((p) => ({ ...p, saveType: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">All Save Types</option>
                  {SAVE_TYPES.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <select
                  value={filters.buyerRisk}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, buyerRisk: e.target.value }))
                  }
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">Buyer Risk</option>
                  {RISK_OPTIONS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <select
                  value={filters.vehicleRisk}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, vehicleRisk: e.target.value }))
                  }
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">Vehicle Risk</option>
                  {RISK_OPTIONS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <select
                  value={filters.tier}
                  onChange={(e) => setFilters((p) => ({ ...p, tier: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">Consultant Tier</option>
                  {TIER_OPTIONS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

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
                  value={filters.suspendedBuyer}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, suspendedBuyer: e.target.value }))
                  }
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">Suspended Buyer</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            )}
          </div>

          <div className="w-full overflow-x-auto table-scroll relative z-10 pb-4">
            <table className="min-w-[1480px] w-full border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Save ID</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">User</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Type</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Vehicle / Consultant</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Consultant Tier</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">City</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Date</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Buyer Risk</th>
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
                        selectedItem?.id === row.id && "bg-sky-50"
                      )}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-100 to-blue-100 border border-slate-200 flex items-center justify-center shrink-0">
                            <Heart className="h-4 w-4 text-sky-700" />
                          </div>
                          <div>
                            <div className="text-[14px] font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                              {row.id}
                            </div>
                            <div className="mt-0.5 text-[12px] text-slate-500">{row.userId}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1 min-w-[180px]">
                          <span className="text-[13px] font-medium text-slate-700">{row.buyerName}</span>
                          <span className="text-[12px] text-slate-500 truncate">{row.buyerEmail}</span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={cls(
                            "inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap",
                            saveTypeBadge(row.type)
                          )}
                        >
                          {row.type}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="min-w-[240px]">
                          <div className="text-[13px] font-medium text-slate-700">
                            {row.type === "Follow Consultant" ? row.consultant : row.vehicleTitle}
                          </div>
                          <div className="mt-1 text-[12px] text-slate-500">{row.consultant}</div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={cls(
                            "inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap",
                            tierBadge(row.consultantTier)
                          )}
                        >
                          {row.consultantTier}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-[13px] font-medium text-slate-500">
                        {row.city}
                      </td>

                      <td className="px-5 py-4 text-[13px] font-medium text-slate-500 whitespace-nowrap">
                        {row.date}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={cls(
                            "inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap",
                            riskBadge(row.buyerRisk)
                          )}
                        >
                          {row.buyerRisk}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <SavedRowActions
                          item={row}
                          onViewBuyer={setSelectedItem}
                          onViewVehicle={handleViewVehicle}
                          onViewConsultant={handleViewConsultant}
                          onRemove={(item) => setModal({ type: "remove", item })}
                          onFlag={(item) => setModal({ type: "flag", item })}
                          onNote={handleNote}
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
                          No saved items found
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

      <SavedActivityDrawer
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onRemove={(item) => setModal({ type: "remove", item })}
        onFlag={(item) => setModal({ type: "flag", item })}
      />

      <RemoveSaveModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleRemoveConfirm}
      />

      <FlagSuspiciousModal
        modal={modal}
        onClose={() => setModal(null)}
        onConfirm={handleFlagConfirm}
      />
    </div>
  );
};

export default SavedLists;