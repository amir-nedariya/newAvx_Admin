import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  X,
  RefreshCw,
  AlertTriangle,
  CalendarDays,
  ChevronDown,
  ShieldAlert,
  Scan,
  TrendingUp,
  Clock3,
  AlertCircle,
  Map,
  Copy,
  Users,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import FlaggedListingsFilterBar from "./flagged-listings/FlaggedListingsFilterBar";
import FlaggedListingsRowActions from "./flagged-listings/FlaggedListingsRowActions";
import FlaggedListingsConfirmModal from "./flagged-listings/FlaggedListingsConfirmModal";
import { DUMMY_FLAGGED_LISTINGS } from "./flagged-listings/flaggedListingsData";

const cls = (...a) => a.filter(Boolean).join(" ");

const initialFilters = {
  vehicleId: "",
  registration: "",
  consultant: "",
  cityId: "",
  risk: "",
  flagSource: "",
  status: "",
  tier: "",
  dateFlagged: "",
  disputeLinked: "",
};

/* =========================================================
   BADGES & HELPERS
   ========================================================= */
const riskBadge = (risk) => {
  if (risk === "High") return "border-rose-200 bg-rose-50 text-rose-700";
  if (risk === "Moderate") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-emerald-200 bg-emerald-50 text-emerald-700";
};

const sourceBadge = (source) => {
  const map = {
    Buyer: "border-sky-200 bg-sky-50 text-sky-700",
    System: "border-violet-200 bg-violet-50 text-violet-700",
    Admin: "border-slate-200 bg-slate-100 text-slate-700",
    Inspection: "border-indigo-200 bg-indigo-50 text-indigo-700",
  };
  return map[source] || "border-slate-200 bg-slate-100 text-slate-700";
};

const statusBadge = (status) => {
  const map = {
    "Under Review": "border-amber-200 bg-amber-50 text-amber-700",
    Investigating: "border-violet-200 bg-violet-50 text-violet-700",
    Resolved: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Escalated: "border-rose-200 bg-rose-50 text-rose-700",
    Suspended: "border-slate-900/10 bg-slate-900 text-white",
    Cleared: "border-sky-200 bg-sky-50 text-sky-700",
  };
  return map[status] || "border-slate-200 bg-slate-100 text-slate-700";
};

const formatEnumLabel = (str) => {
  if (!str || typeof str !== "string") return "";
  return str.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
};

export default function FlaggedListings() {
  const [rows, setRows] = useState(DUMMY_FLAGGED_LISTINGS);
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [modal, setModal] = useState(null);
  const navigate = useNavigate();

  const [cities] = useState([
    { id: "Ahmedabad", name: "Ahmedabad" },
    { id: "Surat", name: "Surat" },
    { id: "Rajkot", name: "Rajkot" },
    { id: "Vadodara", name: "Vadodara" },
    { id: "Mumbai", name: "Mumbai" },
    { id: "Delhi", name: "Delhi" },
  ]);
  const [cityQuery, setCityQuery] = useState("");
  const [cityOpen, setCityOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setFiltersOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleApplyFilters = () => {
    setAppliedFilters(draftFilters);
    setFiltersOpen(false);
  };

  const clearFilters = () => {
    setDraftFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setSearch("");
    setCityQuery("");
  };

  const quickFilter = (key, value) => {
    const newFilters = { ...initialFilters, [key]: value };
    setDraftFilters(newFilters);
    setAppliedFilters(newFilters);
  };

  const filteredRows = useMemo(() => {
    let data = [...rows];
    const q = search.toLowerCase();
    if (q) {
      data = data.filter(r => 
        r.id.toLowerCase().includes(q) || 
        r.consultant.toLowerCase().includes(q) || 
        r.city.toLowerCase().includes(q) || 
        r.title.toLowerCase().includes(q)
      );
    }
    const f = appliedFilters;
    if (f.vehicleId) data = data.filter(r => r.id.toLowerCase().includes(f.vehicleId.toLowerCase()));
    if (f.consultant) data = data.filter(r => r.consultant.toLowerCase().includes(f.consultant.toLowerCase()));
    if (f.cityId) data = data.filter(r => r.city === f.cityId);
    if (f.risk) data = data.filter(r => r.risk === f.risk);
    if (f.flagSource) data = data.filter(r => r.flagSource === f.flagSource);
    if (f.status) data = data.filter(r => r.status === f.status);
    if (f.tier) data = data.filter(r => r.tier.toLowerCase().includes(f.tier.toLowerCase()));
    if (f.dateFlagged) data = data.filter(r => r.dateFlagged === f.dateFlagged);
    if (f.disputeLinked === "Yes") data = data.filter(r => r.disputeLinked === true);
    if (f.disputeLinked === "No") data = data.filter(r => r.disputeLinked === false);
    return data;
  }, [rows, search, appliedFilters]);

  const stats = useMemo(() => {
    return {
      high: rows.filter(r => r.risk === "High").length,
      moderate: rows.filter(r => r.risk === "Moderate").length,
      buyer: rows.filter(r => r.flagSource === "Buyer").length,
      auto: rows.filter(r => r.flagSource === "System").length,
      duplicate: rows.filter(r => r.flagCategory?.includes("Duplicate")).length,
    };
  }, [rows]);

  const handleActionConfirm = (payload) => {
    if (!payload?.item) return;
    const id = payload.item.id;
    const updateStatus = (sid, s) => setRows(p => p.map(r => r.id === sid ? { ...r, status: s } : r));
    if (payload.type === "suspend") updateStatus(id, "Suspended");
    if (payload.type === "clear") updateStatus(id, "Cleared");
    if (payload.type === "escalate") updateStatus(id, "Investigating");
    setModal(null);
    toast.success(`${payload.type.charAt(0).toUpperCase() + payload.type.slice(1)} action applied.`);
  };

  const handleReview = (row) => {
    navigate(`/admin/vehicles/flagged-listings/${row.id}`);
  };

  return (
    <div className="relative min-h-screen bg-slate-50/50 pb-10">
      <style>{`
        .table-scroll::-webkit-scrollbar { height: 6px; }
        .table-scroll::-webkit-scrollbar-track { background: transparent; }
        .table-scroll::-webkit-scrollbar-thumb { background: rgba(148,163,184,0.22); border-radius: 10px; }
        .table-scroll::-webkit-scrollbar-thumb:hover { background: rgba(100,116,139,0.45); }

        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, 0.2); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(148, 163, 184, 0.4); }
      `}</style>

      {/* Background Decor */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-sky-100/30 blur-[100px]" />

      <div className="space-y-6 px-4 md:px-8 py-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              Flagged <span className="text-slate-400">Listings</span>
            </h1>
            <p className="mt-1 text-[13px] font-bold text-slate-500">
               Review suspicious or reported vehicles
            </p>
          </div>
        </div>

        {/* TOP RISK SUMMARY CARDS */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
           <TopCard title="High Risk" value={stats.high} color="text-rose-600" icon={<AlertTriangle size={18}/>} onClick={() => quickFilter("risk", "High")} />
           <TopCard title="Moderate" value={stats.moderate} color="text-amber-600" icon={<Clock3 size={18}/>} onClick={() => quickFilter("risk", "Moderate")} />
           <TopCard title="Buyer Reported" value={stats.buyer} color="text-sky-600" icon={<Users size={18}/>} onClick={() => quickFilter("flagSource", "Buyer")} />
           <TopCard title="Auto Fraud" value={stats.auto} color="text-violet-600" icon={<TrendingUp size={18}/>} onClick={() => quickFilter("flagSource", "System")} />
           <TopCard title="Duplicate" value={stats.duplicate} color="text-indigo-600" icon={<Copy size={18}/>} onClick={() => quickFilter("flagSource", "System")} />
        </div>

        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl shadow-slate-200/40">
          <div className="relative z-10 border-b border-slate-200 px-4 py-4 md:px-6">
             <FlaggedListingsFilterBar
                search={search}
                setSearch={setSearch}
                setFiltersOpen={setFiltersOpen}
                filtersOpen={filtersOpen}
                onRefresh={clearFilters}
             />
          </div>

          <div className="table-scroll overflow-x-auto">
            <table className="w-full min-w-[1680px] table-fixed border-separate border-spacing-0 text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="w-[140px] px-6 py-5 text-[11px] font-black uppercase tracking-wider text-slate-400">Vehicle ID</th>
                  <th className="w-[110px] px-4 py-5 text-center text-[11px] font-black uppercase tracking-wider text-slate-400">Thumbnail</th>
                  <th className="w-[180px] px-6 py-5 text-[11px] font-black uppercase tracking-wider text-slate-400">Consultant</th>
                  <th className="w-[140px] px-6 py-5 text-[11px] font-black uppercase tracking-wider text-slate-400">City</th>
                  <th className="w-[140px] px-5 py-5 text-center text-[11px] font-black uppercase tracking-wider text-slate-400">Risk</th>
                  <th className="w-[150px] px-5 py-5 text-center text-[11px] font-black uppercase tracking-wider text-slate-400">Flag Source</th>
                  <th className="w-[300px] px-6 py-5 text-[11px] font-black uppercase tracking-wider text-slate-400">Flag Reason</th>
                  <th className="w-[100px] px-5 py-5 text-center text-[11px] font-black uppercase tracking-wider text-slate-400">Inquiries</th>
                  <th className="w-[160px] px-5 py-5 text-center text-[11px] font-black uppercase tracking-wider text-slate-400">Status</th>
                  <th className="w-[120px] px-5 py-5 text-center text-[11px] font-black uppercase tracking-wider text-slate-400">Days Open</th>
                  <th className="w-[180px] px-6 py-5 text-right text-[11px] font-black uppercase tracking-wider text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredRows.length > 0 ? (
                  filteredRows.map((row) => (
                    <tr key={row.id} className="group transition-colors hover:bg-sky-50/30">
                      <td className="px-6 py-4 font-black text-slate-900">{row.id}</td>
                      <td className="px-4 py-4 text-center">
                        <VehicleThumb src={row.thumb} />
                      </td>
                      <td className="px-6 py-4 text-[13px] font-bold text-slate-900">
                        {row.consultant}
                      </td>
                      <td className="px-6 py-4 text-[13px] font-extrabold text-slate-500">{row.city}</td>
                      <td className="px-5 py-4 text-center">
                        <div className={cls("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-black text-[11px]", riskBadge(row.risk))}>
                          <div className={cls("h-1.5 w-1.5 rounded-full", row.risk === "High" ? "bg-rose-500 animate-pulse" : "bg-amber-500")} />
                          {row.risk}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className={cls("inline-flex rounded-full border px-3 py-1 text-[11px] font-black", sourceBadge(row.flagSource))}>
                           {row.flagSource}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[12px] font-bold text-slate-900 line-clamp-1">{row.flagCategory}</div>
                        <div className="text-[11px] font-medium text-slate-400 line-clamp-1 italic">{row.flagReason}</div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-[12px] font-black text-slate-900 ring-1 ring-slate-200">
                          {row.inquiries}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className={cls("inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold", statusBadge(row.status))}>
                           {row.status}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className={cls("text-[13px] font-bold", row.daysOpen > 5 ? "text-rose-600" : "text-slate-500")}>
                          {row.daysOpen}d
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <FlaggedListingsRowActions
                          onReview={() => handleReview(row)}
                          onSuspend={() => setModal({ type: "suspend", item: row, title: "Suspend Listing" })}
                          onClear={() => setModal({ type: "clear", item: row, title: "Clear Flag" })}
                          onEscalate={(item) => setModal({ type: "escalate", item, title: "Escalate to Fraud Investigation" })}
                          onPenalty={(item) => setModal({ type: "penalty", item, title: "Apply Ranking Penalty" })}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={11} className="px-6 py-32 text-center text-slate-400 font-bold">No records found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFiltersOpen(false)} className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm" />
            <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed bottom-0 right-0 top-0 z-[101] flex w-full max-w-[400px] flex-col bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                <div>
                  <h2 className="text-xl font-black tracking-tight text-slate-900">🔍 FILTER PANEL</h2>
                  <p className="text-[12px] font-bold text-slate-400">Refine flagged records</p>
                </div>
                <button onClick={() => setFiltersOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500 hover:text-slate-900 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="custom-scrollbar flex-1 overflow-y-auto px-6 py-6 space-y-8">
                 <div className="space-y-4">
                    <div className="text-[11px] font-black uppercase tracking-widest text-sky-600">Search:</div>
                    <InputField label="Vehicle ID" value={draftFilters.vehicleId} placeholder="Enter Vehicle ID..." onChange={(v) => setDraftFilters(p => ({ ...p, vehicleId: v }))} />
                    <InputField label="Registration" value={draftFilters.registration} placeholder="Enter Registration..." onChange={(v) => setDraftFilters(p => ({ ...p, registration: v }))} />
                    <InputField label="Consultant" value={draftFilters.consultant} placeholder="Enter Consultant..." onChange={(v) => setDraftFilters(p => ({ ...p, consultant: v }))} />
                    <SearchableCombobox label="City" value={draftFilters.cityId} onChange={(v) => setDraftFilters(p=>({ ...p, cityId: v }))} query={cityQuery} setQuery={setCityQuery} open={cityOpen} setOpen={setCityOpen} options={cities} allOptions={cities} placeholder="Search City..." icon={Map} />
                 </div>
                 <div className="space-y-4">
                    <div className="text-[11px] font-black uppercase tracking-widest text-sky-600">Filters:</div>
                    <Select label="Risk Level" value={draftFilters.risk} onChange={(v) => setDraftFilters(p=>({...p, risk: v}))} options={["", "Low", "Moderate", "High"]} />
                    <Select label="Flag Source" value={draftFilters.flagSource} onChange={(v)=>setDraftFilters(p=>({...p,flagSource:v}))} options={["", "Buyer", "System", "Admin", "Inspection"]} />
                    <Select label="Status" value={draftFilters.status} onChange={(v)=>setDraftFilters(p=>({...p,status:v}))} options={["", "Under Review", "Investigating", "Resolved", "Escalated"]} />
                    <InputField label="Tier" value={draftFilters.tier} placeholder="e.g. Pro, Premium..." onChange={(v)=>setDraftFilters(p=>({...p,tier:v}))} />
                    <DateInput label="Date Flagged" value={draftFilters.dateFlagged} onChange={(v)=>setDraftFilters(p=>({...p,dateFlagged:v}))} />
                    <Select label="Dispute Linked" value={draftFilters.disputeLinked} onChange={(v)=>setDraftFilters(p=>({...p,disputeLinked:v}))} options={["", "Yes", "No"]} />
                 </div>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-white px-6 py-5">
                <button onClick={clearFilters} className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-95">Clear All</button>
                <button onClick={handleApplyFilters} className="flex-[2] rounded-xl bg-slate-900 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95">Apply Filters</button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <FlaggedListingsConfirmModal modal={modal} onClose={() => setModal(null)} onConfirm={handleActionConfirm} />
    </div>
  );
}

function VehicleThumb({ src }) {
  return (
    <div className="inline-block relative h-12 w-[60px] overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm hover:scale-110 transition-transform">
      <img src={src} loading="lazy" className="h-full w-full object-cover" />
    </div>
  );
}

function TopCard({ title, value, color, icon, onClick }) {
  return (
    <button onClick={onClick} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md text-left active:scale-95">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="mb-1 text-[10px] font-black uppercase tracking-wider text-slate-400">{title}</div>
          <div className={cls("text-2xl font-black", color)}>{value?.toLocaleString?.() ?? value}</div>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-50 bg-slate-50/50 text-slate-400 group-hover:text-sky-500 transition-colors">{icon}</div>
      </div>
    </button>
  );
}

function SearchableCombobox({ label, value, onChange, query, setQuery, open, setOpen, options, allOptions, loading, placeholder, icon: Icon }) {
  const wrapperRef = useRef(null);
  const disp = [{ id: "", name: placeholder }, ...options];
  useEffect(() => {
    const fn = (e) => { if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", fn); return () => document.removeEventListener("mousedown", fn);
  }, [setOpen]);
  return (
    <div className="block" ref={wrapperRef}>
      <div className="mb-2 text-[12px] font-semibold uppercase text-slate-500">{label}</div>
      <div className="relative group">
        <input value={query} onChange={(e) => { setQuery(e.target.value); if (!open) setOpen(true); }} onFocus={() => setOpen(true)} className="h-11 w-full rounded-xl border border-slate-200 px-4 text-[13px] font-medium transition-all focus:border-sky-400 outline-none" placeholder={placeholder} />
        <button onClick={() => setOpen(!open)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"><Icon size={16} /></button>
        <AnimatePresence>{open && (
           <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute left-0 right-0 top-[calc(100%+8px)] z-[80] max-h-60 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl custom-scrollbar">
             {disp.map(o => <button key={o.id} onClick={() => { onChange(o.id); setQuery(o.name); setOpen(false); }} className={cls("w-full rounded-xl px-3 py-2 text-left text-sm transition-colors", String(value) === String(o.id) ? "bg-sky-50 text-sky-700 font-bold" : "hover:bg-slate-50")}>{o.name}</button>)}
           </motion.div>
        )}</AnimatePresence>
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <div className="mb-2 text-[12px] font-semibold uppercase text-slate-500">{label}</div>
      <div className="relative">
        <select value={value} onChange={e => onChange(e.target.value)} className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-[13px] font-medium outline-none focus:border-sky-400">
          {options.map(o => <option key={o} value={o}>{o === "" ? "All" : formatEnumLabel(o)}</option>)}
        </select>
        <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>
    </label>
  );
}

function InputField({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <div className="mb-2 text-[12px] font-semibold uppercase text-slate-500">{label}</div>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="h-11 w-full rounded-xl border border-slate-200 px-4 text-[13px] font-medium outline-none focus:border-sky-400" />
    </label>
  );
}

function DateInput({ label, value, onChange }) {
  const ref = useRef(null);
  return (
    <label className="block">
      <div className="mb-2 text-[12px] font-semibold uppercase text-slate-500">{label}</div>
      <div onClick={() => ref.current?.showPicker()} className="relative cursor-pointer">
        <input ref={ref} type="date" value={value} onChange={e=>onChange(e.target.value)} className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 px-4 pr-10 text-[13px] font-medium outline-none" />
        <CalendarDays size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>
    </label>
  );
}
