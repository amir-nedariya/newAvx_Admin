import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  MoreHorizontal,
  Eye,
  PauseCircle,
  PlayCircle,
  Wallet,
  LayoutTemplate,
  Gauge,
  Ban,
  IndianRupee,
  RotateCcw,
  RefreshCw,
  X,
  TrendingUp,
  MousePointerClick,
  Users,
  Target,
  Clock3,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import CampaignDetailView from "./sponsored-listings/CampaignDetailView";
import SponsoredListingsModals from "./sponsored-listings/SponsoredListingsModals";

const cls = (...a) => a.filter(Boolean).join(" ");

const FALLBACK_VEHICLE_IMAGE = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=60";

/* =========================================================
   DUMMY DATA & INITIAL STATE
========================================================= */
const DUMMY_SPONSORED_LISTINGS = [
  {
    campaignId: "CMP-10421",
    vehicleId: "VH-78231",
    consultantId: "CON-201",
    consultant: "Metro Auto Hub",
    tier: "Premium",
    city: "Ahmedabad",
    vehicle: "Hyundai Creta SX • 2021",
    placement: "Homepage Featured",
    budget: 10000,
    spent: 6500,
    remaining: 3500,
    impressions: 52000,
    clicks: 1400,
    ctr: 2.7,
    inquiries: 43,
    conversionRate: 3.1,
    status: "Active",
    risk: "Low",
    startDate: "2026-03-01",
    endDate: "2026-03-20",
    expiringSoon: true,
    thumb: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=60",
    trafficSources: [
      { source: "Homepage", clicks: 620 },
      { source: "Search", clicks: 540 },
      { source: "Similar Vehicles", clicks: 240 },
    ],
    riskPanel: {
      consultantRisk: "Low",
      vehicleFlagStatus: "Clear",
      inspectionValidity: "Valid",
      duplicateDetected: "No",
      fraudAlertLinked: "No",
    },
  },
  {
    campaignId: "CMP-10422",
    vehicleId: "VH-78232",
    consultantId: "CON-202",
    consultant: "Cityline Wheels",
    tier: "Pro",
    city: "Surat",
    vehicle: "Maruti Baleno Alpha • 2020",
    placement: "Search Top Sponsored",
    budget: 7000,
    spent: 3200,
    remaining: 3800,
    impressions: 34000,
    clicks: 910,
    ctr: 2.68,
    inquiries: 27,
    conversionRate: 2.9,
    status: "Under Review",
    risk: "Moderate",
    startDate: "2026-03-03",
    endDate: "2026-03-28",
    expiringSoon: false,
    thumb: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&auto=format&fit=crop&q=60",
    trafficSources: [
      { source: "Search", clicks: 720 },
      { source: "Homepage", clicks: 110 },
      { source: "Similar Vehicles", clicks: 80 },
    ],
    riskPanel: {
      consultantRisk: "Moderate",
      vehicleFlagStatus: "Buyer complaint linked",
      inspectionValidity: "Valid",
      duplicateDetected: "No",
      fraudAlertLinked: "No",
    },
  },
];

const initialFilters = {
  campaignId: "",
  vehicleId: "",
  consultant: "",
  city: "",
  placement: "",
  tier: "",
  status: "",
  risk: "",
  budgetMin: "",
  budgetMax: "",
  startDate: "",
  endDate: "",
  expiringSoon: "",
};

/* =========================================================
   HELPERS
========================================================= */
const currency = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const statusBadge = (status) => {
  const map = {
    Active: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Paused: "border-amber-200 bg-amber-50 text-amber-700",
    "Under Review": "border-sky-200 bg-sky-50 text-sky-700",
    Expired: "border-slate-200 bg-slate-100 text-slate-700",
    "Budget Exhausted": "border-violet-200 bg-violet-50 text-violet-700",
    Suspended: "border-rose-200 bg-rose-50 text-rose-700",
  };
  return map[status] || "border-slate-200 bg-slate-100 text-slate-700";
};

const tierBadge = (tier) => {
  if (tier === "Premium") return "border-violet-200 bg-violet-50 text-violet-700";
  if (tier === "Pro") return "border-sky-200 bg-sky-50 text-sky-700";
  return "border-slate-200 bg-slate-100 text-slate-700";
};

const riskBadge = (risk) => {
  if (risk === "High") return "border-rose-200 bg-rose-50 text-rose-700";
  if (risk === "Moderate") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-emerald-200 bg-emerald-50 text-emerald-700";
};

const placementBadge = (placement) => {
  const map = {
    "Homepage Featured": "border-indigo-200 bg-indigo-50 text-indigo-700",
    "Search Top Sponsored": "border-sky-200 bg-sky-50 text-sky-700",
    "Similar Vehicles Sponsored": "border-violet-200 bg-violet-50 text-violet-700",
    "City Page Spotlight": "border-amber-200 bg-amber-50 text-amber-700",
    "Category Priority": "border-emerald-200 bg-emerald-50 text-emerald-700",
  };
  return map[placement] || "border-slate-200 bg-slate-100 text-slate-700";
};

/* =========================================================
   COMPONENTS
========================================================= */
function VehicleThumb({ src, alt }) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_VEHICLE_IMAGE);
  useEffect(() => { setImgSrc(src || FALLBACK_VEHICLE_IMAGE); }, [src]);

  return (
    <div className="relative h-12 w-[80px] shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition-transform group-hover:scale-105">
      <img src={imgSrc} alt={alt} loading="lazy" onError={() => setImgSrc(FALLBACK_VEHICLE_IMAGE)} className="h-full w-full object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent" />
    </div>
  );
}

function MenuAction({ icon: Icon, label, onClick, color = "text-slate-600" }) {
  return (
    <button onClick={onClick} className={cls("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-extrabold transition-colors hover:bg-slate-50 focus:outline-none", color)}>
      {Icon && <Icon className="h-4 w-4" />}
      {label}
    </button>
  );
}

function InputField({ label, placeholder, value, onChange, type = "text" }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">{label}</label>
      <input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-[13px] font-bold text-slate-900 outline-none transition-all focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100 placeholder:text-slate-300" />
    </div>
  );
}

function SelectField({ label, options, value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">{label}</label>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)} className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 pr-10 text-[13px] font-bold text-slate-900 outline-none transition-all focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100">
          {options.map((opt) => (
            <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
              {typeof opt === 'string' ? opt || `All ${label}s` : opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );
}

/* =========================================================
   MAIN
========================================================= */
const SponsoredListings = () => {
  const [rows, setRows] = useState(DUMMY_SPONSORED_LISTINGS);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(initialFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeView, setActiveView] = useState("list");
  const [selectedItem, setSelectedItem] = useState(null);
  const [modal, setModal] = useState({ type: null, item: null });
  const [menuOpenId, setMenuOpenId] = useState(null);

  const menuRefs = useRef({});

  useEffect(() => {
    const handleClickOutside = (e) => {
      const isMenuClick = Object.values(menuRefs.current).some(ref => ref && ref.contains(e.target));
      if (!isMenuClick) setMenuOpenId(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredRows = useMemo(() => {
    let data = [...rows];
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(r => r.campaignId.toLowerCase().includes(q) || r.vehicle.toLowerCase().includes(q) || r.consultant.toLowerCase().includes(q));
    }
    if (filters.campaignId) data = data.filter(r => r.campaignId.toLowerCase().includes(filters.campaignId.toLowerCase()));
    if (filters.vehicleId) data = data.filter(r => r.vehicleId.toLowerCase().includes(filters.vehicleId.toLowerCase()));
    if (filters.consultant) data = data.filter(r => r.consultant.toLowerCase().includes(filters.consultant.toLowerCase()));
    if (filters.city) data = data.filter(r => r.city.toLowerCase().includes(filters.city.toLowerCase()));
    if (filters.placement) data = data.filter(r => r.placement === filters.placement);
    if (filters.tier) data = data.filter(r => r.tier === filters.tier);
    if (filters.status) data = data.filter(r => r.status === filters.status);
    if (filters.risk) data = data.filter(r => r.risk === filters.risk);
    if (filters.budgetMin) data = data.filter(r => r.budget >= Number(filters.budgetMin));
    if (filters.budgetMax) data = data.filter(r => r.budget <= Number(filters.budgetMax));
    if (filters.startDate) data = data.filter(r => r.startDate >= filters.startDate);
    if (filters.endDate) data = data.filter(r => r.endDate <= filters.endDate);
    if (filters.expiringSoon) data = data.filter(r => r.expiringSoon === (filters.expiringSoon === "Yes"));
    return data;
  }, [rows, search, filters]);

  const handleAction = (type, item) => { setModal({ type, item }); setMenuOpenId(null); };
  const handleConfirmAction = (data) => { toast.success(`${data.type.toUpperCase()} processed successfully`); setModal({ type: null, item: null }); };
  const openDetail = (item) => { setSelectedItem(item); setActiveView("detail"); };
  const activeFiltersCount = Object.values(filters).filter(v => v !== "").length;

  return (
    <div className="min-h-screen p-0 bg-slate-50/50">
      <Toaster position="top-right" />
      <style>{`
        .table-scroll::-webkit-scrollbar { height: 8px; width: 8px; }
        .table-scroll::-webkit-scrollbar-track { background: transparent; }
        .table-scroll::-webkit-scrollbar-thumb { background: rgba(148,163,184,0.40); border-radius: 999px; }
        .table-scroll::-webkit-scrollbar-thumb:hover { background: rgba(100,116,139,0.55); }
      `}</style>

      <div className="space-y-8 p-4 md:p-8 max-w-[2000px] mx-auto">
        {activeView === "list" ? (
          <>
            <header>
              <h1 className="text-[32px] font-black tracking-tight text-slate-900">Sponsored Listings Dashboard</h1>
              <p className="mt-1 text-slate-500 font-medium tracking-tight">Monitor & control paid vehicle placements</p>
            </header>

            <section className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl shadow-slate-200/40">
              <div className="relative z-10 border-b border-slate-100 bg-white/80 p-5 backdrop-blur-md md:px-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  {/* SEARCH BAR */}
                  <div className="relative flex-1 max-w-2xl">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Global Search Campaign, Vehicle, Consultant..." className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 text-[14px] font-semibold text-slate-900 outline-none transition-all focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100 placeholder:text-slate-400" />
                  </div>
                  
                  {/* FILTERS TRIGGER */}
                  <div className="flex items-center gap-3">
                    <button onClick={() => setFiltersOpen(true)} className={cls("inline-flex h-12 items-center gap-2.5 rounded-2xl border bg-white px-5 text-[14px] font-bold text-slate-700 transition-all shadow-sm hover:bg-slate-50 active:scale-95 border-slate-200")}>
                      <SlidersHorizontal className="h-4 w-4" />
                      <span>Filters</span>
                      {activeFiltersCount > 0 && <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-900 px-1.5 text-[10px] font-black text-white">{activeFiltersCount}</span>}
                    </button>
                    <button onClick={() => { setSearch(""); setFilters(initialFilters); toast.success("Data refreshed"); }} className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:scale-95"><RefreshCw className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>

              {/* PERFECT 14-COLUMN TABLE */}
              <div className="relative z-10 w-full overflow-hidden">
                <div className="table-scroll overflow-x-auto pb-[200px]">
                  <table className="min-w-[2100px] w-full border-separate border-spacing-0">
                    <thead>
                      <tr className="bg-slate-50/80 backdrop-blur-sm">
                        <th className="border-b border-r border-slate-200/60 px-6 py-4.5 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">Campaign ID</th>
                        <th className="border-b border-r border-slate-200/60 px-6 py-4.5 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">Vehicle</th>
                        <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">Consultant</th>
                        <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">Tier</th>
                        <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">Placement</th>
                        <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">Budget</th>
                        <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">Remaining</th>
                        <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">Impressions</th>
                        <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">Clicks</th>
                        <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">CTR (%)</th>
                        <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">Inquiries</th>
                        <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">Status</th>
                        <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">Risk</th>
                        <th className="border-b border-slate-200 px-6 py-4.5 text-right text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredRows.map((row, index) => (
                        <tr key={row.campaignId} className={cls("group transition-colors duration-200 hover:bg-sky-50/45", index % 2 === 0 ? "bg-white" : "bg-slate-50/35")}>
                          <td className="border-b border-slate-100 px-6 py-4.5 align-middle"><div className="flex flex-col"><span onClick={() => openDetail(row)} className="text-[14px] font-black text-slate-900 group-hover:text-sky-700 cursor-pointer transition-colors">{row.campaignId}</span><span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{row.vehicleId}</span></div></td>
                          <td className="border-b border-slate-100 px-6 py-4.5 align-middle"><div className="flex min-w-[320px] items-center gap-4"><VehicleThumb src={row.thumb} alt={row.vehicle} /><div className="min-w-0"><div className="truncate text-[14px] font-bold text-slate-900">{row.vehicle}</div><div className="text-[12px] font-medium text-slate-500">{row.city}</div></div></div></td>
                          <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle font-bold text-slate-700">{row.consultant}</td>
                          <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle"><span className={cls("inline-flex rounded-full border px-3 py-1 text-[11px] font-black tracking-wider uppercase", tierBadge(row.tier))}>{row.tier}</span></td>
                          <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle"><span className={cls("inline-flex rounded-full border px-3 py-1 text-[11px] font-black tracking-wider uppercase whitespace-nowrap", placementBadge(row.placement))}>{row.placement}</span></td>
                          <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle font-black text-slate-900">{currency(row.budget)}</td>
                          <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle font-black text-slate-900">{currency(row.remaining)}</td>
                          <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle font-bold text-slate-800 tracking-tight">{row.impressions.toLocaleString()}</td>
                          <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle font-bold text-sky-600 tracking-tight">{row.clicks.toLocaleString()}</td>
                          <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle font-black text-emerald-600">{row.ctr}%</td>
                          <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle font-black text-slate-900">{row.inquiries}</td>
                          <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle"><span className={cls("inline-flex rounded-full border px-3 py-1 text-[11px] font-bold tracking-wider uppercase shadow-sm", statusBadge(row.status))}>{row.status}</span></td>
                          <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle"><span className={cls("inline-flex rounded-full border px-3 py-1 text-[11px] font-bold tracking-wider uppercase", riskBadge(row.risk))}>{row.risk}</span></td>
                          <td className="border-b border-slate-100 px-6 py-4.5 text-right align-middle">
                            <div className="relative inline-block" ref={el => menuRefs.current[row.campaignId] = el}>
                              <button onClick={() => setMenuOpenId(menuOpenId === row.campaignId ? null : row.campaignId)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm hover:border-slate-300 hover:bg-slate-900 hover:text-white transition-all"><MoreHorizontal className="h-5 w-5" /></button>
                              <AnimatePresence>{menuOpenId === row.campaignId && <motion.div initial={{ opacity: 0, scale: 0.95, y: 10, x: -10 }} animate={{ opacity: 1, scale: 1, y: 0, x: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10, x: -10 }} className="absolute right-0 top-12 z-[100] min-w-[220px] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_50px_rgba(15,23,42,0.15)] ring-1 ring-slate-900/5"><MenuAction icon={Eye} label="View Details" onClick={() => openDetail(row)} /><div className="my-1 border-t border-slate-100" />{row.status === "Active" ? (<><MenuAction icon={PauseCircle} label="Pause Campaign" onClick={() => handleAction("pause", row)} /><MenuAction icon={IndianRupee} label="Adjust Budget" onClick={() => handleAction("budget", row)} /><MenuAction icon={LayoutTemplate} label="Change Placement" onClick={() => handleAction("placement", row)} /><MenuAction icon={Target} label="Set Imp. Cap" onClick={() => handleAction("cap", row)} /><div className="my-1 border-t border-slate-100" /><MenuAction icon={Ban} label="Suspend" color="text-rose-600" onClick={() => handleAction("suspend", row)} /><MenuAction icon={RotateCcw} label="Issue Refund" onClick={() => handleAction("refund", row)} /></>) : row.status === "Under Review" ? (<><div className="my-1 border-t border-slate-100" /><MenuAction icon={PlayCircle} label="Approve Placement" color="text-emerald-600" onClick={() => handleAction("approve", row)} /><MenuAction icon={X} label="Reject & Flag" color="text-rose-600" onClick={() => handleAction("reject", row)} /></>) : (<MenuAction icon={RotateCcw} label="Reinstate" color="text-emerald-600" onClick={() => handleAction("reinstate", row)} />)}</motion.div>}</AnimatePresence>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </>
        ) : (
          <CampaignDetailView item={selectedItem} onBack={() => setActiveView("list")} onAction={handleAction} />
        )}

        {/* RIGHT SIDEBAR FILTERS */}
        <AnimatePresence>
          {filtersOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFiltersOpen(false)} className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm" />
              <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed bottom-0 right-0 top-0 z-[110] w-full max-w-[450px] bg-white shadow-2xl">
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between border-b border-slate-100 p-6">
                    <div><h2 className="text-2xl font-black text-slate-900">Filters</h2><p className="mt-1 text-[13px] font-medium text-slate-500">Refine campaign results</p></div>
                    <button onClick={() => setFiltersOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 transition-all"><X className="h-5 w-5" /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    <div className="space-y-8">
                      <FilterGroup label="Identification"><InputField label="Campaign ID" placeholder="Search ID..." value={filters.campaignId} onChange={(val) => setFilters(p => ({...p, campaignId: val}))} /><InputField label="Vehicle ID" placeholder="Search VH-..." value={filters.vehicleId} onChange={(val) => setFilters(p => ({...p, vehicleId: val}))} /></FilterGroup>
                      <FilterGroup label="Entities"><InputField label="Consultant" placeholder="Name..." value={filters.consultant} onChange={(val) => setFilters(p => ({...p, consultant: val}))} /><InputField label="City" placeholder="Location..." value={filters.city} onChange={(val) => setFilters(p => ({...p, city: val}))} /></FilterGroup>
                      <FilterGroup label="Parameters"><SelectField label="Placement" value={filters.placement} onChange={(val) => setFilters(p => ({...p, placement: val}))} options={["", "Homepage Featured", "Search Top Sponsored", "Similar Vehicles Sponsored", "City Page Spotlight", "Category Priority"]} /><SelectField label="Tier" value={filters.tier} onChange={(val) => setFilters(p => ({...p, tier: val}))} options={["", "Basic", "Pro", "Premium"]} /><SelectField label="Status" value={filters.status} onChange={(val) => setFilters(p => ({...p, status: val}))} options={["", "Active", "Paused", "Under Review", "Expired", "Budget Exhausted", "Suspended"]} /><SelectField label="Risk Level" value={filters.risk} onChange={(val) => setFilters(p => ({...p, risk: val}))} options={["", "Low", "Moderate", "High"]} /></FilterGroup>
                      <FilterGroup label="Timeframe"><InputField label="Start From" type="date" value={filters.startDate} onChange={(val) => setFilters(p => ({...p, startDate: val}))} /><InputField label="End At" type="date" value={filters.endDate} onChange={(val) => setFilters(p => ({...p, endDate: val}))} /></FilterGroup>
                      <FilterGroup label="Budget Range"><div className="grid grid-cols-2 gap-4"><InputField label="Min Budget" type="number" value={filters.budgetMin} onChange={(val) => setFilters(p => ({...p, budgetMin: val}))} /><InputField label="Max Budget" type="number" value={filters.budgetMax} onChange={(val) => setFilters(p => ({...p, budgetMax: val}))} /></div></FilterGroup>
                      <FilterGroup label="Notifications"><SelectField label="Expiring Soon" value={filters.expiringSoon} onChange={(val) => setFilters(p => ({...p, expiringSoon: val}))} options={["", "Yes", "No"]} /></FilterGroup>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 border-t border-slate-100 bg-white p-6">
                    <button onClick={() => { setFilters(initialFilters); toast.success("Filters cleared"); }} className="flex-1 rounded-2xl border border-slate-200 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">Clear All</button>
                    <button onClick={() => setFiltersOpen(false)} className="flex-[2] rounded-2xl bg-slate-900 py-4 text-sm font-bold text-white hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">Apply Filters</button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {modal.type && <SponsoredListingsModals type={modal.type} item={modal.item} onClose={() => setModal({ type: null, item: null })} onConfirm={handleConfirmAction} />}
        </AnimatePresence>
      </div>
    </div>
  );
};

const FilterGroup = ({ label, children }) => (<div className="space-y-4"><div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</div><div className="space-y-4">{children}</div></div>);

export default SponsoredListings;