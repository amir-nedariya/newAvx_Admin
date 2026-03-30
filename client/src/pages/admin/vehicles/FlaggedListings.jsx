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
  AlertCircle,
  TrendingUp,
  Clock3,
  Map,
  Copy,
  Users,
  CheckCircle2,
  Scan,
  BadgeCheck,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  getFlaggedVehicles,
  suspendVehicle,
  clearFlaggedVehicle,
  getFlaggedVehiclesKpi
} from "../../../api/vehicle.api";
import FlaggedListingsFilterBar from "./flagged-listings/FlaggedListingsFilterBar";
import FlaggedListingsRowActions from "./flagged-listings/FlaggedListingsRowActions";
import FlaggedListingsConfirmModal from "./flagged-listings/FlaggedListingsConfirmModal";

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
  if (risk === "HIGH") return "border-rose-200 bg-rose-50 text-rose-700";
  if (risk === "MODERATE") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-emerald-200 bg-emerald-50 text-emerald-700";
};

const statusBadge = (resolved) => {
  if (resolved) return "border-emerald-200 bg-emerald-50 text-emerald-700";
  return "border-amber-200 bg-amber-50 text-amber-700";
};

const formatEnumLabel = (str) => {
  if (!str || typeof str !== "string") return "";
  return str.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
};

export default function FlaggedListings() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kpiData, setKpiData] = useState(null);
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [modal, setModal] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
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

  const fetchFlaggedList = async () => {
    try {
      setLoading(true);
      const res = await getFlaggedVehicles();
      // If res is { status: "OK", data: [...] }
      const data = res?.data || res || [];
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to fetch flagged listings");
    } finally {
      setLoading(false);
    }
  };

  const fetchKpis = async () => {
    try {
      const res = await getFlaggedVehiclesKpi();
      if (res?.data) {
        setKpiData(res.data);
      }
    } catch (err) {
      console.error("KPI Error:", err);
    }
  };

  useEffect(() => {
    fetchFlaggedList();
    fetchKpis();
  }, []);

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
        (r.vehicleId || "").toLowerCase().includes(q) ||
        (r.vehicleTitle || "").toLowerCase().includes(q) ||
        (r.ownerName || "").toLowerCase().includes(q) ||
        (r.cityName || "").toLowerCase().includes(q)
      );
    }
    const f = appliedFilters;
    if (f.vehicleId) data = data.filter(r => (r.vehicleId || "").toLowerCase().includes(f.vehicleId.toLowerCase()));
    if (f.cityId) data = data.filter(r => r.cityName === f.cityId);
    if (f.risk) data = data.filter(r => r.severity === f.risk);
    if (f.dateFlagged) data = data.filter(r => r.flaggedAt.startsWith(f.dateFlagged));
    return data;
  }, [rows, search, appliedFilters]);

  const stats = useMemo(() => {
    if (kpiData) {
      return {
        high: kpiData.highSeverityCount || 0,
        moderate: kpiData.moderateSeverityCount || 0,
        low: kpiData.lowSeverityCount || 0,
        total: kpiData.totalFlags || 0,
        unresolved: (kpiData.totalFlags || 0) - (kpiData.resolvedCount || 0),
        resolved: kpiData.resolvedCount || 0,
      };
    }
    return {
      high: rows.filter(r => r.severity === "HIGH").length,
      moderate: rows.filter(r => r.severity === "MODERATE").length,
      total: rows.length,
      unresolved: rows.filter(r => !r.isResolved).length,
      resolved: rows.filter(r => r.isResolved).length,
    };
  }, [rows, kpiData]);

  const handleActionConfirm = async (payload) => {
    if (!payload?.item) return;
    const vehicleId = payload.item.vehicleId;
    const flagId = payload.item.flagId;

    try {
      setActionLoading(true);
      if (payload.type === "suspend") {
        await suspendVehicle({
          vehicleId,
          reason: payload.meta?.reason || payload.reason,
          suspendType: (payload.meta?.suspensionType || "TEMPORARY").toUpperCase(),
          suspendUntil: payload.meta?.date
        });
        toast.success("Vehicle suspended successfully");
      } else if (payload.type === "clear") {
        if (!flagId) throw new Error("Flag ID not found");
        const clearanceReason = payload.meta?.reason || "No violation found";
        await clearFlaggedVehicle({ flagId, reason: clearanceReason });
        toast.success("Flag cleared successfully");
      }
      fetchFlaggedList();
      fetchKpis();
      setModal(null);
    } catch (err) {
      console.error("Action error:", err);
      toast.error(err?.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReview = (row) => {
    navigate(`/admin/vehicles/flagged-listings/${row.flagId || row.id}`);
  };

  return (
    <div className="relative min-h-screen pb-10">
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
          </div>
        </div>

        {/* TOP RISK SUMMARY CARDS */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <TopCard title="Total Flagged" value={stats.total} color="text-slate-900" icon={<Scan size={18} />} />
          <TopCard title="High Severity" value={stats.high} color="text-rose-600" icon={<AlertTriangle size={18} />} />
          <TopCard title="Moderate Risk" value={stats.moderate} color="text-amber-600" icon={<Clock3 size={18} />} />

          <TopCard title="Low Severity" value={stats.low} color="text-emerald-600" icon={<BadgeCheck size={18} />} />
          <TopCard title="Total Resolved" value={stats.resolved} color="text-indigo-600" icon={<CheckCircle2 size={18} />} />
        </section>

        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl shadow-slate-200/40">
          <div className="relative z-10 border-b border-slate-200 px-4 py-4 md:px-6">
            <FlaggedListingsFilterBar
              search={search}
              setSearch={setSearch}
              setFiltersOpen={setFiltersOpen}
              filtersOpen={filtersOpen}
              onRefresh={fetchFlaggedList}
            />
          </div>

          <div className="table-scroll overflow-x-auto">
            <table className="w-full min-w-[1800px] border-separate border-spacing-0 text-left">
              <thead>
                <tr className="bg-slate-50/80 backdrop-blur-sm">
                  <th className="w-[450px] border-b border-r border-slate-200/60 px-6 py-4.5 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                    Vehicle
                  </th>
                  <th className="w-[220px] border-b border-r border-slate-200/60 px-6 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                    Owner / Consultant
                  </th>
                  <th className="w-[140px] border-b border-r border-slate-200/60 px-6 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                    City
                  </th>
                  <th className="w-[160px] border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                    Severity
                  </th>
                  <th className="w-[200px] border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                    Category
                  </th>
                  <th className="w-[350px] border-b border-r border-slate-200/60 px-6 py-4.5 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                    Description
                  </th>
                  <th className="w-[120px] border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                    Price
                  </th>
                  <th className="w-[180px] border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                    Varification Status
                  </th>
                  <th className="w-[140px] border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                    Flagged At
                  </th>
                  <th className="w-[180px] border-b border-slate-200 px-6 py-4.5 text-right text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-32 text-center">
                      <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
                        <RefreshCw className="h-4 w-4 animate-spin text-sky-500" />
                        Loading flagged listings...
                      </div>
                    </td>
                  </tr>
                ) : filteredRows.length > 0 ? (
                  filteredRows.map((row, index) => (
                    <tr
                      key={row.flagId}
                      className={cls(
                        "group",
                        index % 2 === 0 ? "bg-white" : "bg-slate-50/35",
                        "transition-colors duration-200 hover:bg-sky-50/45"
                      )}
                    >
                      <td className="border-b border-r border-slate-100 px-6 py-4.5 align-middle">
                        <div className="flex min-w-[340px] items-center gap-4">
                          <VehicleThumb src={row.thumbnailUrl} />
                          <div className="min-w-0">
                            <div className="truncate text-[15px] font-bold text-slate-900 transition-colors group-hover:text-sky-700">
                              {row.vehicleTitle || "-"}
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400/80 mt-0.5">
                              ID: {row.vehicleId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="border-b border-r border-slate-100 px-6 py-4.5 text-center align-middle">
                        <div className="inline-flex flex-col items-center">
                          <div className="text-[13px] font-bold text-slate-900">{row.ownerName}</div>
                          {row.consultantName && (
                            <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-sky-600 mt-1">
                              <BadgeCheck size={12} />
                              {row.consultantName}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="border-b border-r border-slate-100 px-6 py-4.5 text-center align-middle">
                        <div className="text-[13px] font-extrabold text-slate-500">{row.cityName || "-"}</div>
                      </td>
                      <td className="border-b border-r border-slate-100 px-5 py-4.5 text-center align-middle">
                        <span className={cls("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-black text-[10px] uppercase tracking-wider shadow-sm whitespace-nowrap", riskBadge(row.severity))}>
                          <div className={cls("h-1.5 w-1.5 rounded-full", row.severity === "HIGH" ? "bg-rose-500 animate-pulse" : "bg-amber-500")} />
                          {row.severity}
                        </span>
                      </td>
                      <td className="border-b border-r border-slate-100 px-5 py-4.5 text-center align-middle">
                        <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-600 shadow-sm">
                          {formatEnumLabel(row.flagCategory)}
                        </span>
                      </td>
                      <td className="border-b border-r border-slate-100 px-6 py-4.5 align-middle">
                        <div className="text-[11px] font-medium text-slate-500 line-clamp-2 italic leading-relaxed whitespace-pre-wrap max-w-[250px]">
                          {row.internalNotes || "No internal notes provided"}
                        </div>
                      </td>
                      <td className="border-b border-r border-slate-100 px-5 py-4.5 text-center align-middle">
                        <div className="text-[14px] font-black text-slate-900 tabular-nums">
                          ₹{(row.price || 0).toLocaleString("en-IN")}
                        </div>
                      </td>
                      <td className="border-b border-r border-slate-100 px-5 py-4.5 text-center align-middle">
                        <span className={cls("inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-wider shadow-sm whitespace-nowrap", statusBadge(row.isResolved))}>
                          {row.isResolved ? "Resolved" : "Under Review"}
                        </span>
                      </td>
                      <td className="border-b border-r border-slate-100 px-5 py-4.5 text-center align-middle">
                        <div className="flex flex-col items-center">
                          <div className="text-[12px] font-bold text-slate-700">
                            {row.flaggedAt ? new Date(row.flaggedAt).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' }) : "-"}
                          </div>
                          <div className="text-[10px] font-black text-slate-400/80 uppercase">
                            {row.flaggedAt ? new Date(row.flaggedAt).toLocaleDateString("en-IN", { year: 'numeric' }) : ""}
                          </div>
                        </div>
                      </td>
                      <td className="border-b border-slate-100 px-6 py-4.5 text-right align-middle">
                        <FlaggedListingsRowActions
                          onReview={() => handleReview(row)}
                          onSuspend={() => setModal({ type: "suspend", item: row, title: "Suspend Listing" })}
                          onClear={() => setModal({ type: "clear", item: row, title: "Clear Flag" })}
                          onEscalate={() => setModal({ type: "escalate", item: row, title: "Escalate to Fraud Investigation" })}
                          onPenalty={() => setModal({ type: "penalty", item: row, title: "Apply Ranking Penalty" })}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="px-6 py-32 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-400">
                          <AlertTriangle size={28} />
                        </div>
                        <div className="text-lg font-bold tracking-tight text-slate-900">
                          No flagged listings found
                        </div>
                        <div className="mx-auto mt-1 max-w-sm text-[14px] text-slate-500">
                          Try adjusting your filters or clear the search to see more records.
                        </div>
                        <button
                          onClick={clearFilters}
                          className="mt-6 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50"
                          type="button"
                        >
                          Clear search & filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-slate-500">
              Page <span className="font-semibold text-slate-900">1</span> /{" "}
              <span className="font-semibold text-slate-900">1</span>
              <span className="ml-2">• {rows.length} total records</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={true}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
              >
                Prev
              </button>

              <button
                disabled={true}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
              >
                Next
              </button>
            </div>
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
                  <SearchableCombobox label="City" value={draftFilters.cityId} onChange={(v) => setDraftFilters(p => ({ ...p, cityId: v }))} query={cityQuery} setQuery={setCityQuery} open={cityOpen} setOpen={setCityOpen} options={cities} allOptions={cities} placeholder="Search City..." icon={Map} />
                </div>
                <div className="space-y-4">
                  <div className="text-[11px] font-black uppercase tracking-widest text-sky-600">Filters:</div>
                  <Select label="Risk Level" value={draftFilters.risk} onChange={(v) => setDraftFilters(p => ({ ...p, risk: v }))} options={["", "LOW", "MODERATE", "HIGH"]} />
                  <Select label="Flag Source" value={draftFilters.flagSource} onChange={(v) => setDraftFilters(p => ({ ...p, flagSource: v }))} options={["", "Buyer", "System", "Admin", "Inspection"]} />
                  <DateInput label="Date Flagged" value={draftFilters.dateFlagged} onChange={(v) => setDraftFilters(p => ({ ...p, dateFlagged: v }))} />
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

      <FlaggedListingsConfirmModal
        modal={modal}
        loading={actionLoading}
        onClose={() => setModal(null)}
        onConfirm={handleActionConfirm}
      />
    </div>
  );
}

function VehicleThumb({ src, alt }) {
  const [imgSrc, setImgSrc] = useState(src || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=60");

  useEffect(() => {
    setImgSrc(src || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=60");
  }, [src]);

  return (
    <div className="relative h-12 w-[60px] shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
      <img
        src={imgSrc}
        alt={alt}
        loading="lazy"
        onError={() => setImgSrc("https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=60")}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent" />
    </div>
  );
}

function TopCard({ title, value, color, icon }) {
  return (
    <div className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50/80 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="mb-2.5 truncate text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            {title}
          </div>
          <div className={cls("text-3xl font-black tracking-tight tabular-nums leading-none", color || "text-slate-900")}>
            {value?.toLocaleString?.() ?? value}
          </div>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-sky-100 bg-sky-50 text-sky-600 shadow-sm transition-colors group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900">
          {icon}
        </div>
      </div>
    </div>
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
        <input ref={ref} type="date" value={value} onChange={e => onChange(e.target.value)} className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 px-4 pr-10 text-[13px] font-medium outline-none" />
        <CalendarDays size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>
    </label>
  );
}
