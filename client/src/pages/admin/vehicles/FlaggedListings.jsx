import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
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
  Loader2,
  Clock3,
  Map,
  Copy,
  Users,
  CheckCircle2,
  Scan,
  BadgeCheck,
  User,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  filterFlaggedVehicles,
  normalizeFlaggedVehicleListResponse,
  suspendVehicle,
  clearFlaggedVehicle,
  getFlaggedVehiclesKpi
} from "../../../api/vehicle.api";
import { getAllCitiesFromSearch } from "../../../api/addressApi";
import FlaggedListingsFilterBar from "./flagged-listings/FlaggedListingsFilterBar";
import FlaggedListingsRowActions from "./flagged-listings/FlaggedListingsRowActions";
import FlaggedListingsConfirmModal from "./flagged-listings/FlaggedListingsConfirmModal";

const cls = (...a) => a.filter(Boolean).join(" ");
const PAGE_SIZE = 10;

const initialFilters = {
  vehicleName: "",
  consultantName: "",
  cityId: "",
  severity: "",
  dateFrom: "",
  dateTo: "",
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

const typeBadge = (type) => {
  if (type === "SELLER" || type === "USER_SELLER") return "border-rose-200 bg-rose-50 text-rose-700";
  if (type === "CONSULTATION") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  return "border-slate-200 bg-slate-100 text-slate-700";
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

  // Pagination state
  const [page, setPage] = useState(1);
  const [serverTotalPages, setServerTotalPages] = useState(1);
  const [serverTotal, setServerTotal] = useState(0);

  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [cityQuery, setCityQuery] = useState("");
  const [cityOpen, setCityOpen] = useState(false);

  const searchDebounceRef = useRef(null);
  const firstLoadRef = useRef(true);

  const filteredCities = useMemo(() => {
    if (!cityQuery.trim()) return cities;
    const q = cityQuery.toLowerCase();
    return cities.filter((c) => c.name.toLowerCase().includes(q));
  }, [cities, cityQuery]);

  const fetchFlaggedList = async (pageNo = 1, filters = appliedFilters) => {
    try {
      setLoading(true);

      // Prepare date filters
      const flaggedAfter = filters.dateFrom ? `${filters.dateFrom}T00:00:00` : null;
      const flaggedBefore = filters.dateTo ? `${filters.dateTo}T23:59:59` : null;

      const payload = await filterFlaggedVehicles({
        searchText: search?.trim() || filters.vehicleName?.trim() || null,
        consultantName: filters.consultantName?.trim() || null,
        cityId: filters.cityId ? Number(filters.cityId) : null,
        severity: filters.severity || null,
        flaggedAfter,
        flaggedBefore,
        pageNo,
        pageSize: PAGE_SIZE,
      });

      const { list, totalPages, totalElements, currentPage } =
        normalizeFlaggedVehicleListResponse(payload);

      setRows(list || []);
      setServerTotalPages(Math.max(1, Number(totalPages || 1)));
      setServerTotal(Number(totalElements || 0));
      setPage(Number(currentPage || pageNo));
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to fetch flagged listings");
      setRows([]);
      setServerTotalPages(1);
      setServerTotal(0);
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

  const loadCitiesOnce = useCallback(async () => {
    if (cities.length > 0 || citiesLoading) return;

    setCitiesLoading(true);
    try {
      const res = await getAllCitiesFromSearch("");
      const list =
        (Array.isArray(res?.data) && res.data) || (Array.isArray(res) && res) || [];

      setCities(
        list
          .map((c) => ({
            id: c?.cityId ?? c?.id ?? c?._id,
            name: c?.cityName ?? c?.name ?? "City",
          }))
          .filter((x) => x.id != null)
      );
    } catch (e) {
      console.error("Cities load failed:", e);
      setCities([]);
      toast.error("Failed to load cities");
    } finally {
      setCitiesLoading(false);
    }
  }, [cities.length, citiesLoading]);

  useEffect(() => {
    fetchFlaggedList(page, appliedFilters);
  }, [page, appliedFilters]);

  useEffect(() => {
    fetchKpis();
    loadCitiesOnce();
  }, [loadCitiesOnce]);

  useEffect(() => {
    if (filtersOpen) {
      loadCitiesOnce();
    }
  }, [filtersOpen, loadCitiesOnce]);

  // Update city query when cityId changes
  useEffect(() => {
    const selectedCity = cities.find(
      (city) => String(city.id) === String(draftFilters.cityId)
    );

    if (selectedCity) {
      setCityQuery(selectedCity.name || "");
    } else if (!draftFilters.cityId) {
      setCityQuery("");
    }
  }, [draftFilters.cityId, cities]);

  // Debounced search effect
  useEffect(() => {
    if (firstLoadRef.current) {
      firstLoadRef.current = false;
      return;
    }

    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    searchDebounceRef.current = setTimeout(() => {
      setPage(1);
      fetchFlaggedList(1, appliedFilters);
    }, 500);

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [search]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setFiltersOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleApplyFilters = () => {
    setPage(1); // Reset to first page when applying filters
    setAppliedFilters(draftFilters);
    setFiltersOpen(false);
  };

  const clearFilters = () => {
    setDraftFilters(initialFilters);
    setPage(1); // Reset to first page when clearing filters
    setAppliedFilters(initialFilters);
    setSearch("");
    setCityQuery("");
    setFiltersOpen(false); // Close the filter sidebar
  };

  const quickFilter = (key, value) => {
    const newFilters = { ...initialFilters, [key]: value };
    setDraftFilters(newFilters);
    setPage(1); // Reset to first page
    setAppliedFilters(newFilters);
  };

  // Remove the filteredRows useMemo since filtering is now done server-side
  const filteredRows = rows;

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
    console.log("first",payload);
    const vehicleId = payload.item.vehicleId;
    const flagId = payload.item.flagReviewId;

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
      fetchFlaggedList(page, appliedFilters);
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
    navigate(`/admin/vehicles/flagged-listings/${row?.flagReviewId}`);
  };

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
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

      <div className="flex flex-1 flex-col space-y-4 overflow-hidden p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="mb-1 text-[32px] font-extrabold tracking-tight text-slate-900">
              Flagged Listings
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

        <div className="flex flex-1 flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl shadow-slate-200/40">
          <div className="relative z-10 border-b border-slate-200 px-4 py-4 md:px-6">
            <FlaggedListingsFilterBar
              search={search}
              setSearch={setSearch}
              setFiltersOpen={setFiltersOpen}
              filtersOpen={filtersOpen}
              onRefresh={() => fetchFlaggedList(page, appliedFilters)}
            />
          </div>

          <div className="table-scroll flex-1 overflow-auto">
            <table className="w-full min-w-[1800px] border-separate border-spacing-0 text-left">
              <thead>
                <tr className="bg-slate-50/80 backdrop-blur-sm">
                  <th className="w-[450px] border-b border-r border-slate-200/60 px-6 py-4.5 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                    Vehicle
                  </th>
                  <th className="w-[220px] border-b border-r border-slate-200/60 px-6 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                    Consultant / Seller
                  </th>
                  <th className="w-[140px] border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                    Type
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
                    <td colSpan={11} className="px-6 py-24 text-center">
                      <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading flag listings...
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
                            <div className="truncate text-[14px] font-bold text-slate-900 transition-colors group-hover:text-sky-700">
                              {row.vehicleTitle || "-"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="border-b border-r border-slate-100 px-6 py-4.5 text-center align-middle">
                        <div className="inline-flex min-w-[180px] items-center justify-center">
                          <div
                            className={cls(
                              "flex items-center gap-2 text-[13px] font-semibold",
                              ((row.type === "CONSULTATION" && row.consultantName) ||
                                ((row.type === "USER_SELLER" || row.type === "SELLER") && row.ownerName))
                                ? "text-slate-800"
                                : "text-slate-400"
                            )}
                          >
                            {row.type === "CONSULTATION" && row.consultantName ? (
                              <>
                                <BadgeCheck className="h-4 w-4 shrink-0 text-sky-600" />
                                <span className="truncate">{row.consultantName}</span>
                              </>
                            ) : (row.type === "USER_SELLER" || row.type === "SELLER") && row.ownerName ? (
                              <>
                                <User className="h-4 w-4 shrink-0 text-slate-600" />
                                <span className="truncate">{row.ownerName}</span>
                              </>
                            ) : (
                              <span className="opacity-50">-</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="border-b border-r border-slate-100 px-5 py-4.5 text-center align-middle">
                        <span
                          className={cls(
                            "inline-flex rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.03em] whitespace-nowrap",
                            typeBadge(row.type === "USER_SELLER" ? "SELLER" : row.type)
                          )}
                        >
                          {formatEnumLabel(row.type === "USER_SELLER" ? "SELLER" : row.type)}
                        </span>
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
                    <td colSpan={11} className="px-6 py-32 text-center">
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
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex shrink-0 flex-col gap-3 border-t border-slate-200 bg-white px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-slate-500">
              Page <span className="font-semibold text-slate-900">{page}</span> /{" "}
              <span className="font-semibold text-slate-900">{serverTotalPages}</span>
              <span className="ml-2">• {serverTotal} total records</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
              >
                Prev
              </button>

              <button
                onClick={() => setPage((p) => Math.min(serverTotalPages, p + 1))}
                disabled={page === serverTotalPages || loading}
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
            <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed bottom-0 right-0 top-0 z-[101] flex w-full max-w-[440px] flex-col bg-white shadow-2xl border-l border-slate-200">
              <div className="shrink-0 border-b border-slate-200 bg-gradient-to-br from-slate-50 via-white to-sky-50/30 px-6 py-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/20">
                        <SlidersHorizontal className="h-5 w-5" />
                      </div>
                      <h2 className="text-2xl font-black tracking-tight text-slate-900">Filters</h2>
                    </div>
                    <p className="mt-1 text-sm font-medium text-slate-500">Refine flagged vehicle records</p>
                  </div>
                  <button onClick={() => setFiltersOpen(false)} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 active:scale-95">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="custom-scrollbar flex-1 overflow-y-auto px-6 py-6 space-y-5 bg-slate-50/30">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <Search className="h-4 w-4 text-slate-400" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Search Criteria</h4>
                  </div>
                  <div className="space-y-4">
                    <InputField
                      label="Vehicle Name"
                      value={draftFilters.vehicleName}
                      placeholder="Search by vehicle name..."
                      onChange={(v) => setDraftFilters(p => ({ ...p, vehicleName: v }))}
                    />
                    <InputField
                      label="Consultant Name"
                      value={draftFilters.consultantName}
                      placeholder="Search by consultant..."
                      onChange={(v) => setDraftFilters(p => ({ ...p, consultantName: v }))}
                    />
                    <SearchableCombobox
                      label="City"
                      value={draftFilters.cityId}
                      onChange={(v) => setDraftFilters(p => ({ ...p, cityId: v }))}
                      query={cityQuery}
                      setQuery={setCityQuery}
                      open={cityOpen}
                      setOpen={setCityOpen}
                      options={filteredCities}
                      allOptions={cities}
                      loading={citiesLoading}
                      placeholder="All Cities"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-slate-400" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Severity Level</h4>
                  </div>
                  <div className="space-y-4">
                    <Select
                      label="Flag Severity"
                      value={draftFilters.severity}
                      onChange={(v) => setDraftFilters(p => ({ ...p, severity: v }))}
                      options={["", "LOW", "MODERATE", "HIGH"]}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-slate-400" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Date Range</h4>
                  </div>
                  <div className="space-y-4">
                    <DateInput
                      label="From Date"
                      value={draftFilters.dateFrom}
                      onChange={(v) => setDraftFilters(p => ({ ...p, dateFrom: v }))}
                    />
                    <DateInput
                      label="To Date"
                      value={draftFilters.dateTo}
                      onChange={(v) => setDraftFilters(p => ({ ...p, dateTo: v }))}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-gradient-to-br from-slate-50 via-white to-sky-50/30 px-6 py-5 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
                <button onClick={clearFilters} className="flex-1 rounded-xl border-2 border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95">Clear All</button>
                <button onClick={handleApplyFilters} className="flex-1 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/30 active:scale-95">Apply Filters</button>
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

function SearchableCombobox({
  label,
  value,
  onChange,
  query,
  setQuery,
  open,
  setOpen,
  options,
  allOptions,
  loading,
  placeholder = "Search...",
  icon: Icon = ChevronDown,
}) {
  const wrapperRef = useRef(null);
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const displayOptions = useMemo(() => {
    return [{ id: "", name: placeholder }, ...options];
  }, [options, placeholder]);

  useEffect(() => {
    if (!open) {
      setActiveIndex(-1);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  const handleSelect = (item) => {
    onChange(item.id ? String(item.id) : "");
    setQuery(item.id ? item.name || "" : "");
    setOpen(false);
    setActiveIndex(-1);
  };

  useEffect(() => {
    if (activeIndex !== -1 && scrollRef.current) {
      const activeEl = scrollRef.current.children[activeIndex];
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeIndex]);

  const handleKeyDown = (e) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter") {
        setOpen(true);
        return;
      }
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < displayOptions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : displayOptions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < displayOptions.length) {
        handleSelect(displayOptions[activeIndex]);
      } else if (query.trim()) {
        const match = options.find(
          (o) => o.name?.toLowerCase() === query.trim().toLowerCase()
        );
        if (match) handleSelect(match);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  useEffect(() => {
    const handleOutside = (e) => {
      if (!wrapperRef.current?.contains(e.target)) {
        setOpen(false);

        const selected = allOptions.find(
          (o) => String(o.id) === String(value)
        );

        setQuery(selected?.name || "");
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [allOptions, setOpen, setQuery, value]);

  return (
    <div className="block" ref={wrapperRef}>
      <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</div>
      <div className="relative group">
        <input
          value={query}
          onChange={(e) => {
            const nextValue = e.target.value;
            setQuery(nextValue);

            if (!open) setOpen(true);

            if (!nextValue.trim()) {
              onChange("");
            }
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={loading ? "Loading..." : placeholder}
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 pr-10 text-[13px] font-semibold text-slate-900 outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-100 placeholder:text-slate-400 shadow-sm"
        />
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <Icon
            className={cls(
              "h-4 w-4 transition-transform duration-200",
              open && Icon === ChevronDown && "rotate-180"
            )}
          />
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              ref={scrollRef}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute left-0 right-0 top-[calc(100%+8px)] z-[80] max-h-64 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/40"
            >
              {loading ? (
                <div className="px-3 py-3 text-[13px] font-medium text-slate-500">
                  Loading...
                </div>
              ) : displayOptions.length > 0 ? (
                displayOptions.map((item, idx) => {
                  const isAll = item.id === "";
                  const active = isAll
                    ? !value
                    : String(value) === String(item.id);
                  const highlighted = activeIndex === idx;

                  return (
                    <button
                      key={item.id || `all-${label}`}
                      type="button"
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={cls(
                        "flex w-full items-center rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition-all duration-200",
                        active
                          ? "bg-sky-50 text-sky-700 font-bold"
                          : highlighted
                            ? "translate-x-1 bg-sky-50/50 text-sky-800"
                            : "text-slate-700 hover:bg-slate-50 hover:translate-x-1"
                      )}
                    >
                      <span className="truncate">{item.name}</span>
                    </button>
                  );
                })
              ) : (
                <div className="px-3 py-3 text-[13px] font-medium text-slate-500">
                  No results found
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</div>
      <div className="relative">
        <select value={value} onChange={e => onChange(e.target.value)} className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-[13px] font-semibold outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-100 shadow-sm">
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
      <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</div>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="h-11 w-full rounded-xl border border-slate-200 px-4 text-[13px] font-semibold outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-100 placeholder:text-slate-400 shadow-sm" />
    </label>
  );
}

function DateInput({ label, value, onChange }) {
  const ref = useRef(null);
  const openPicker = () => {
    if (!ref.current) return;
    ref.current.focus();
    if (typeof ref.current.showPicker === "function") {
      ref.current.showPicker();
    } else {
      ref.current.click();
    }
  };
  return (
    <label className="block">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</div>
      <div onClick={openPicker} className="group relative cursor-pointer">
        <input ref={ref} type="date" value={value} onChange={e => onChange(e.target.value)} className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 px-4 pr-11 text-[13px] font-semibold outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-100 group-hover:border-sky-200 shadow-sm" />
        <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-hover:text-sky-500">
          <CalendarDays className="h-4 w-4" />
        </div>
      </div>
    </label>
  );
}
