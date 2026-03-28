/* =========================================================
   ✅ FILE: src/pages/admin/marketplace/Allvehicles.jsx
   ✅ PREMIUM MARKETPLACE TABLE UI
   ✅ CITY FILTER = SEARCHABLE COMBOBOX
   ✅ NO EXTRA SEARCH UI INSIDE DROPDOWN
   ✅ PRICE RANGE INPUT
   ✅ CUSTOM SELECT CHEVRON
   ✅ DATE INPUT FULL BOX CLICKABLE
   ✅ READY TO PASTE
========================================================= */

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  useId,
} from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  CalendarDays,
  ChevronDown,
  Loader2,
  CarFront,
  ShieldCheck,
  BadgeCheck,
  CircleDashed,
  Map,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import VehicleRowActions from "./marketplace/VehicleRowActions";
import SuspendListingModal from "./marketplace/actions/SuspendListing";
import FlagForReviewModal from "./marketplace/actions/FlagForReview";
import AddInternalNoteModal from "./marketplace/actions/AddInternalNote";
import {
  filterVehicles,
  normalizeVehicleListResponse,
  getVehicleKpi,
} from "../../../api/vehicle.api";
import { getAllCitiesFromSearch, getStates } from "../../../api/addressApi";
import toast, { Toaster } from "react-hot-toast";

const cls = (...a) => a.filter(Boolean).join(" ");
const PAGE_SIZE = 10;

const initialFilters = {
  searchText: "",
  stateId: "",
  cityId: "",
  minPrice: "",
  maxPrice: "",
  fuelType: "",
  vehicleType: "",
  transmissionType: "",
  inspectionStatus: "",
  isTierBoostActive: "",
  marketplaceStatus: "",
  listedAfter: "",
  listedBefore: "",
};

const FALLBACK_VEHICLE_IMAGE =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=60";

const formatEnumLabel = (value) => {
  if (!value) return "-";
  return String(value).replace(/_/g, " ");
};

const formatPrice = (value) => {
  const amount = Number(value || 0);
  return `₹${amount.toLocaleString("en-IN")}`;
};

const inspectionBadge = (inspectionStatus) => {
  const map = {
    NOT_INSPECTED: "border-slate-200 bg-slate-100 text-slate-700",
    IN_PROGRESS: "border-amber-200 bg-amber-50 text-amber-700",
    SELF_INSPECTED: "border-sky-200 bg-sky-50 text-sky-700",
    AI_INSPECTED: "border-indigo-200 bg-indigo-50 text-indigo-700",
    AVX_INSPECTED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };
  return map[inspectionStatus] || "border-slate-200 bg-slate-100 text-slate-700";
};

const typeBadge = (type) => {
  if (type === "SELLER") return "border-rose-200 bg-rose-50 text-rose-700";
  if (type === "CONSULTATION") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  return "border-slate-200 bg-slate-100 text-slate-700";
};

const statusBadge = (status) => {
  const map = {
    ACTIVE: "border-emerald-200 bg-emerald-50 text-emerald-700",
    INACTIVE: "border-slate-200 bg-slate-100 text-slate-700",
    SOLD: "border-violet-200 bg-violet-50 text-violet-700",
    DELETED: "border-rose-200 bg-rose-50 text-rose-700",
    DRAFT: "border-slate-200 bg-slate-100 text-slate-700",
  };
  return map[status] || "border-slate-200 bg-slate-100 text-slate-700";
};

const riskBadge = (risk) => {
  if (risk === "High") return "border-rose-200 bg-rose-50 text-rose-700";
  if (risk === "Moderate") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-emerald-200 bg-emerald-50 text-emerald-700";
};

const getInspectionIcon = (status) => {
  if (status === "AVX_INSPECTED") return <CheckCircle2 className="h-3.5 w-3.5" />;
  if (status === "AI_INSPECTED") return <CalendarDays className="h-3.5 w-3.5" />;
  if (status === "SELF_INSPECTED") return <AlertTriangle className="h-3.5 w-3.5" />;
  if (status === "IN_PROGRESS") return <CircleDashed className="h-3.5 w-3.5" />;
  return <ShieldCheck className="h-3.5 w-3.5" />;
};

const safeErrorMessage = (err) => {
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.response?.data?.error) return err.response.data.error;
  if (err?.message?.toLowerCase?.().includes("network")) {
    return "Network error. Please check your backend server / API base URL.";
  }
  if (err?.code === "ERR_NETWORK") {
    return "Network error. Please check your backend server / API base URL.";
  }
  return "Failed to load vehicles.";
};

export default function Allvehicles() {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [serverTotalPages, setServerTotalPages] = useState(1);
  const [serverTotal, setServerTotal] = useState(0);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [kpiLoading, setKpiLoading] = useState(false);
  const [error, setError] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);

  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [cityQuery, setCityQuery] = useState("");

  const [states, setStates] = useState([]);
  const [statesLoading, setStatesLoading] = useState(false);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [stateQuery, setStateQuery] = useState("");

  const [kpi, setKpi] = useState({
    totalVehicles: 0,
    totalActiveVehicles: 0,
    totalBoostedVehicles: 0,
    totalHighRiskVehicles: 0,
  });

  const [suspendModal, setSuspendModal] = useState({
    open: false,
    vehicleId: null,
    vehicleTitle: "",
  });

  const [flagModal, setFlagModal] = useState({
    open: false,
    vehicleId: null,
    vehicleTitle: "",
  });

  const [noteModal, setNoteModal] = useState({
    open: false,
    vehicleId: null,
    vehicleTitle: "",
  });

  const searchDebounceRef = useRef(null);
  const firstLoadRef = useRef(true);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setFiltersOpen(false);
        setCityDropdownOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const mapVehicleToRow = (v) => {
    const makerName = v?.makerName || "-";
    const modelName = v?.modelName || "-";
    const variantName = v?.variantName || "-";
    const yearOfMfg = v?.yearOfMfg || "-";

    return {
      id: v?.vehicleId || "-",
      thumb: v?.thumbnailUrl || FALLBACK_VEHICLE_IMAGE,
      title:
        [makerName, modelName, variantName, yearOfMfg !== "-" ? yearOfMfg : null]
          .filter(Boolean)
          .join(" • ") || "-",
      consultantName: v?.consultantName || "-",
      type: v?.type || "-",
      city: v?.cityName || "-",
      price: Number(v?.price ?? 0),
      inspectionStatus: v?.inspectionStatus || "-",
      rankScore: Number(v?.rankScore ?? 0),
      inquiries: Number(v?.totalInquiries ?? 0),
      boost: Boolean(v?.isTierBoostActive ?? false),
      status: v?.status || "-",
      risk: v?.risk || "Low",
      ownerName: v?.ownerName || "-",
      avxInspectionRating: v?.avxInspectionRating ?? "-",
      __raw: v,
    };
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

  const loadStatesOnce = useCallback(async () => {
    if (states.length > 0 || statesLoading) return;

    setStatesLoading(true);
    try {
      const res = await getStates(101); // Assuming 101 for India based on other files
      const list =
        (Array.isArray(res?.data) && res.data) || (Array.isArray(res) && res) || [];

      setStates(
        list
          .map((s) => ({
            id: s?.stateId ?? s?.id ?? s?._id,
            name: s?.stateName ?? s?.name ?? "State",
          }))
          .filter((x) => x.id != null)
      );
    } catch (e) {
      console.error("States load failed:", e);
      setStates([]);
      toast.error("Failed to load states");
    } finally {
      setStatesLoading(false);
    }
  }, [states.length, statesLoading]);

  const loadKpi = useCallback(async () => {
    setKpiLoading(true);
    try {
      const res = await getVehicleKpi();
      const data = res?.data?.data || res?.data || {};

      setKpi({
        totalVehicles: Number(data?.totalVehicles ?? 0),
        totalActiveVehicles: Number(data?.totalActiveVehicles ?? 0),
        totalBoostedVehicles: Number(data?.totalBoostedVehicles ?? 0),
        totalHighRiskVehicles: Number(data?.totalHighRiskVehicles ?? 0),
      });
    } catch (e) {
      console.error("Vehicle KPI load failed:", e);
      setKpi({
        totalVehicles: 0,
        totalActiveVehicles: 0,
        totalBoostedVehicles: 0,
        totalHighRiskVehicles: 0,
      });
    } finally {
      setKpiLoading(false);
    }
  }, []);

  const fetchVehicles = useCallback(async (pageNo, filters) => {
    try {
      setLoading(true);
      setError("");

      const payload = await filterVehicles({
        searchText: filters.searchText || null,
        stateId: filters.stateId ? Number(filters.stateId) : null,
        cityId: filters.cityId ? Number(filters.cityId) : null,
        minPrice: filters.minPrice ? Number(filters.minPrice) : null,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : null,
        fuelType: filters.fuelType || null,
        vehicleType: filters.vehicleType || null,
        transmissionType: filters.transmissionType || null,
        inspectionStatus: filters.inspectionStatus || null,
        isTierBoostActive:
          filters.isTierBoostActive === ""
            ? null
            : filters.isTierBoostActive === "true",
        marketplaceStatus: filters.marketplaceStatus || null,
        listedAfter: filters.listedAfter ? `${filters.listedAfter}T00:00:00` : null,
        listedBefore: filters.listedBefore ? `${filters.listedBefore}T23:59:59` : null,
        pageNo: pageNo,
        pageSize: PAGE_SIZE,
        sortBy: "id",
        sortDirection: "DESC",
      });

      const { list, totalPages, totalElements, currentPage } =
        normalizeVehicleListResponse(payload);

      setRows((list || []).map(mapVehicleToRow));
      setServerTotalPages(Math.max(1, Number(totalPages || 1)));
      setServerTotal(Number(totalElements || 0));
      setPage(Number(currentPage || pageNo));
    } catch (e) {
      console.error("Vehicle list load failed:", e);
      setRows([]);
      setServerTotalPages(1);
      setServerTotal(0);
      setError(safeErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadKpi();
    loadCitiesOnce();
  }, [loadKpi, loadCitiesOnce]);

  useEffect(() => {
    fetchVehicles(page, appliedFilters);
  }, [page, appliedFilters, fetchVehicles]);

  useEffect(() => {
    if (filtersOpen) {
      loadKpi();
      loadCitiesOnce();
      loadStatesOnce();
    }
  }, [filtersOpen, loadKpi, loadCitiesOnce, loadStatesOnce]);

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

  useEffect(() => {
    if (firstLoadRef.current) {
      firstLoadRef.current = false;
      return;
    }

    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    searchDebounceRef.current = setTimeout(() => {
      setPage(1);
      setAppliedFilters((prev) => ({
        ...prev,
        searchText: draftFilters.searchText,
      }));
    }, 500);

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [draftFilters.searchText]);

  const filteredCities = useMemo(() => {
    if (!cityQuery.trim()) return cities;
    const q = cityQuery.toLowerCase();
    return cities.filter((c) => c.name.toLowerCase().includes(q));
  }, [cities, cityQuery]);

  const filteredStates = useMemo(() => {
    if (!stateQuery.trim()) return states;
    const q = stateQuery.toLowerCase();
    return states.filter((s) => s.name.toLowerCase().includes(q));
  }, [states, stateQuery]);

  const handleRefresh = async () => {
    await Promise.all([loadKpi(), fetchVehicles(page, appliedFilters)]);
    toast.success("Vehicles refreshed");
  };

  const handleApplyFilters = () => {
    const min = Number(draftFilters.minPrice || 0);
    const max = Number(draftFilters.maxPrice || 0);

    if (
      draftFilters.minPrice &&
      draftFilters.maxPrice &&
      Number.isFinite(min) &&
      Number.isFinite(max) &&
      min > max
    ) {
      toast.error("Min Price cannot be greater than Max Price");
      return;
    }

    setPage(1);
    setAppliedFilters({
      ...draftFilters,
      searchText: draftFilters.searchText,
    });
    setCityDropdownOpen(false);
    setFiltersOpen(false);
  };

  const clearFilters = () => {
    setDraftFilters(initialFilters);
    setPage(1);
    setAppliedFilters(initialFilters);
    setCityDropdownOpen(false);
    setCityQuery("");
    setFiltersOpen(false);
  };

  const onRowAction = (action, vehicle) => {
    const id = vehicle?.id;

    if (action === "SUSPEND_LISTING") {
      setSuspendModal({ open: true, vehicleId: id, vehicleTitle: vehicle.title });
      return;
    }

    if (action === "FLAG_REVIEW") {
      setFlagModal({ open: true, vehicleId: id, vehicleTitle: vehicle.title });
      return;
    }

    if (action === "ADD_NOTE") {
      setNoteModal({ open: true, vehicleId: id, vehicleTitle: vehicle.title });
      return;
    }

    const map = {
      VIEW_DETAILS: `/admin/vehicles/${id}`,
      EDIT_OVERRIDE: `/admin/vehicles/${id}/edit-override`,
      RECALC_RANK: `/admin/vehicles/${id}/recalc-rank`,
      FEATURE_TEMP: `/admin/vehicles/${id}/feature`,
      REMOVE_BOOST: `/admin/vehicles/${id}/remove-boost`,
      FLAG_REVIEW: `/admin/vehicles/${id}/flag-review`,
      VIEW_INQUIRIES: `/admin/vehicles/${id}/inquiries`,
      VIEW_INSPECTION: `/admin/vehicles/${id}/inspection`,
      ADD_NOTE: `/admin/vehicles/${id}/add-note`,
    };

    const path = map[action];
    if (path) {
      navigate(path);
      return;
    }

    console.log("ACTION:", action, vehicle);
  };

  const activeFiltersCount = useMemo(() => {
    return [
      appliedFilters.cityId,
      appliedFilters.minPrice,
      appliedFilters.maxPrice,
      appliedFilters.fuelType,
      appliedFilters.vehicleType,
      appliedFilters.transmissionType,
      appliedFilters.inspectionStatus,
      appliedFilters.isTierBoostActive,
      appliedFilters.marketplaceStatus,
      appliedFilters.listedAfter,
      appliedFilters.listedBefore,
    ].filter(Boolean).length;
  }, [appliedFilters]);

  const stats = useMemo(() => {
    return {
      total: kpi.totalVehicles || serverTotal || 0,
      active:
        kpi.totalActiveVehicles ||
        rows.filter((r) => r.status === "ACTIVE").length,
      boosted:
        kpi.totalBoostedVehicles || rows.filter((r) => r.boost).length,
      highRisk:
        kpi.totalHighRiskVehicles || rows.filter((r) => r.risk === "High").length,
    };
  }, [kpi, rows, serverTotal]);

  return (
    <div className="min-h-screen p-0">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "14px",
            border: "1px solid #e2e8f0",
            background: "#fff",
            color: "#0f172a",
            boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
            fontSize: "13px",
            fontWeight: 600,
          },
        }}
      />

      <style>{`
        .table-scroll::-webkit-scrollbar { height: 8px; width: 8px; }
        .table-scroll::-webkit-scrollbar-track { background: transparent; }
        .table-scroll::-webkit-scrollbar-thumb {
          background: rgba(148,163,184,0.40);
          border-radius: 999px;
        }
        .table-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(100,116,139,0.55);
        }

        /* Hide native date picker icon */
        input[type="date"]::-webkit-inner-spin-button,
        input[type="date"]::-webkit-calendar-picker-indicator {
          opacity: 0;
          -webkit-appearance: none;
          appearance: none;
          position: absolute;
          right: 0;
          top: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
          z-index: 1;
        }
      `}</style>

      <div className="space-y-6">
        <section className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="mb-1 text-[32px] font-extrabold tracking-tight text-slate-900">
              All Vehicles
            </h1>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <TopCard title="Total Vehicles" value={kpiLoading ? "..." : stats.total} />
          <TopCard
            title="Active Listings"
            value={kpiLoading ? "..." : stats.active}
            color="text-emerald-600"
          />
          <TopCard
            title="Boosted"
            value={kpiLoading ? "..." : stats.boosted}
            color="text-blue-600"
          />
          <TopCard
            title="High Risk"
            value={kpiLoading ? "..." : stats.highRisk}
            color="text-rose-600"
          />
        </section>

        <section className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
          <div className="pointer-events-none absolute -top-10 right-10 h-48 w-48 rounded-full bg-sky-100/60 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-indigo-50 blur-3xl" />

          <div className="relative z-10 border-b border-slate-200 px-4 py-4 md:px-6">
            <div className="flex items-center gap-2.5 md:gap-4 lg:justify-between">
              <div className="relative min-w-0 flex-1 max-w-2xl">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={draftFilters.searchText}
                  onChange={(e) =>
                    setDraftFilters((prev) => ({
                      ...prev,
                      searchText: e.target.value,
                    }))
                  }
                  placeholder="Search ID, model, city..."
                  className="h-11 md:h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-[13px] md:text-[14px] font-medium text-slate-900 outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-100 placeholder:text-slate-400"
                />
              </div>

              <div className="flex shrink-0 items-center gap-2 md:gap-3">
                <button
                  onClick={() => setFiltersOpen(true)}
                  className="inline-flex h-11 md:h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 md:px-5 text-[13px] font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
                  type="button"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden md:inline">Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-900 px-1.5 text-[10px] font-black text-white">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={handleRefresh}
                  className="flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
                  title="Refresh List"
                  type="button"
                >
                  {loading || kpiLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-sky-500" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>


          <div className="relative z-10 overflow-visible">
            <div className="table-scroll w-full overflow-x-auto pb-[220px]">
              <table className="min-w-[1520px] w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-slate-50/80 backdrop-blur-sm">
                    <th className="border-b border-r border-slate-200/60 px-6 py-4.5 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                      Vehicle
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                      Consultant
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                      Type
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                      City
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                      Price
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                      Inspection
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                      Inquiries
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                      Boost
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                      Status
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                      Risk
                    </th>
                    <th className="border-b border-slate-200 px-6 py-4.5 text-right text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={11} className="px-6 py-24 text-center">
                        <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading vehicles...
                        </div>
                      </td>
                    </tr>
                  ) : rows.length > 0 ? (
                    rows.map((v, index) => (
                      <tr
                        key={v.id}
                        className={cls(
                          "group",
                          index % 2 === 0 ? "bg-white" : "bg-slate-50/35",
                          "transition-colors duration-200 hover:bg-sky-50/45"
                        )}
                      >
                        <td className="border-b border-slate-100 px-6 py-4.5 align-middle">
                          <div className="flex min-w-[320px] items-center gap-4">
                            <VehicleThumb src={v.thumb} alt={v.title || "Vehicle"} />
                            <div className="min-w-0">
                              <div className="truncate text-[14px] font-bold text-slate-900 transition-colors group-hover:text-sky-700">
                                {v.title || "-"}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                          <div className="inline-flex min-w-[180px] items-center justify-center">
                            <div
                              className={cls(
                                "flex items-center gap-2 text-[13px] font-semibold",
                                v.consultantName && v.consultantName !== "-"
                                  ? "text-slate-800"
                                  : "text-slate-400"
                              )}
                            >
                              {v.consultantName && v.consultantName !== "-" ? (
                                <>
                                  <BadgeCheck className="h-4 w-4 shrink-0 text-sky-600" />
                                  <span className="truncate">{v.consultantName}</span>
                                </>
                              ) : (
                                <span className="opacity-50">-</span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                          <span
                            className={cls(
                              "inline-flex rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.03em] whitespace-nowrap",
                              typeBadge(v.type)
                            )}
                          >
                            {formatEnumLabel(v.type)}
                          </span>
                        </td>

                        <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                          <div className="inline-flex items-center gap-2 text-[13px] font-medium text-slate-600 whitespace-nowrap">
                            {v.city || "-"}
                          </div>
                        </td>

                        <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                          <div className="text-[13.5px] font-bold text-slate-900 whitespace-nowrap tracking-tight">
                            {formatPrice(v.price)}
                          </div>
                        </td>

                        <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                          <span
                            className={cls(
                              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.03em] whitespace-nowrap shadow-sm",
                              inspectionBadge(v.inspectionStatus)
                            )}
                          >
                            {getInspectionIcon(v.inspectionStatus)}
                            {formatEnumLabel(v.inspectionStatus)}
                          </span>
                        </td>

                        <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                          <div className="inline-flex h-8 min-w-8 items-center justify-center rounded-xl border border-slate-200 bg-white px-2.5 text-[12.5px] font-extrabold text-slate-800 shadow-sm ring-4 ring-slate-50">
                            {v.inquiries ?? 0}
                          </div>
                        </td>

                        <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                          <span
                            className={cls(
                              "inline-flex rounded-full border px-3 py-1 text-[11px] font-bold whitespace-nowrap",
                              v.boost
                                ? "border-indigo-200 bg-indigo-50/50 text-indigo-700"
                                : "border-slate-200 bg-slate-100/50 text-slate-500"
                            )}
                          >
                            {v.boost ? "Boosted" : "No Boost"}
                          </span>
                        </td>

                        <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                          <span
                            className={cls(
                              "inline-flex rounded-full border px-3 py-1 text-[11px] font-bold whitespace-nowrap",
                              statusBadge(v.status)
                            )}
                          >
                            {formatEnumLabel(v.status)}
                          </span>
                        </td>

                        <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                          <span
                            className={cls(
                              "inline-flex rounded-full border px-3 py-1 text-[11px] font-bold whitespace-nowrap",
                              riskBadge(v.risk || "Low")
                            )}
                          >
                            {v.risk || "Low"}
                          </span>
                        </td>

                        <td className="border-b border-slate-100 px-6 py-4.5 text-right align-middle">
                          <VehicleRowActions vehicle={v} onAction={onRowAction} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={11} className="px-6 py-28 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-400">
                            <CarFront size={28} />
                          </div>
                          <div className="text-lg font-bold tracking-tight text-slate-900">
                            No vehicles found
                          </div>
                          <div className="mx-auto mt-1 max-w-sm text-[14px] text-slate-500">
                            Try adjusting your search criteria or clear active filters to see more
                            results.
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
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-5 py-4 md:flex-row md:items-center md:justify-between">
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
        </section>
      </div>

      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setFiltersOpen(false);
                setCityDropdownOpen(false);
              }}
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.aside
              initial={{ x: 420, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 420, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-[430px] flex-col border-l border-slate-200 bg-white shadow-2xl"
            >
              <div className="shrink-0 border-b border-slate-200 bg-slate-50 px-6 py-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-slate-900">
                      Filters
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Refine inventory results
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setFiltersOpen(false);
                      setCityDropdownOpen(false);
                    }}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto p-6">
                <SearchableCombobox
                  label="State"
                  value={draftFilters.stateId}
                  onChange={(val) =>
                    setDraftFilters((prev) => ({
                      ...prev,
                      stateId: val,
                    }))
                  }
                  query={stateQuery}
                  setQuery={setStateQuery}
                  open={stateDropdownOpen}
                  setOpen={setStateDropdownOpen}
                  options={filteredStates}
                  allOptions={states}
                  loading={statesLoading}
                  placeholder="All States"
                />

                <SearchableCombobox
                  label="City"
                  value={draftFilters.cityId}
                  onChange={(val) =>
                    setDraftFilters((prev) => ({
                      ...prev,
                      cityId: val,
                    }))
                  }
                  query={cityQuery}
                  setQuery={setCityQuery}
                  open={cityDropdownOpen}
                  setOpen={setCityDropdownOpen}
                  options={filteredCities}
                  allOptions={cities}
                  loading={citiesLoading}
                  placeholder="All Cities"
                />

                <div className="space-y-4 rounded-3xl border border-slate-100 bg-slate-50/50 p-5">
                  <div className="grid grid-cols-2 gap-3">
                    <InputField
                      label="Min Price"
                      type="number"
                      prefix="₹"
                      inputMode="numeric"
                      value={draftFilters.minPrice}
                      onChange={(val) =>
                        setDraftFilters((p) => ({ ...p, minPrice: val }))
                      }
                      placeholder="Min"
                    />
                    <InputField
                      label="Max Price"
                      type="number"
                      prefix="₹"
                      inputMode="numeric"
                      value={draftFilters.maxPrice}
                      onChange={(val) =>
                        setDraftFilters((p) => ({ ...p, maxPrice: val }))
                      }
                      placeholder="Max"
                    />
                  </div>

                  <PriceRangeSlider
                    minPrice={draftFilters.minPrice}
                    maxPrice={draftFilters.maxPrice}
                    onMinChange={(val) => setDraftFilters(p => ({ ...p, minPrice: val }))}
                    onMaxChange={(val) => setDraftFilters(p => ({ ...p, maxPrice: val }))}
                  />
                </div>

                <Select
                  label="Fuel Type"
                  value={draftFilters.fuelType}
                  onChange={(val) =>
                    setDraftFilters((p) => ({ ...p, fuelType: val }))
                  }
                  options={[
                    "",
                    "PETROL",
                    "DIESEL",
                    "CNG",
                    "LPG",
                    "ELECTRIC",
                    "HYBRID",
                    "OTHER",
                  ]}
                />

                <Select
                  label="Vehicle Type"
                  value={draftFilters.vehicleType}
                  onChange={(val) =>
                    setDraftFilters((p) => ({ ...p, vehicleType: val }))
                  }
                  options={["", "TWO_WHEELER", "FOUR_WHEELER", "COMMERCIAL", "OTHER"]}
                />

                <Select
                  label="Transmission"
                  value={draftFilters.transmissionType}
                  onChange={(val) =>
                    setDraftFilters((p) => ({ ...p, transmissionType: val }))
                  }
                  options={["", "MANUAL", "AUTOMATIC", "OTHER"]}
                />

                <Select
                  label="Inspection Status"
                  value={draftFilters.inspectionStatus}
                  onChange={(val) =>
                    setDraftFilters((p) => ({ ...p, inspectionStatus: val }))
                  }
                  options={[
                    "",
                    "NOT_INSPECTED",
                    "IN_PROGRESS",
                    "SELF_INSPECTED",
                    "AI_INSPECTED",
                    "AVX_INSPECTED",
                  ]}
                />

                <Select
                  label="Boost Active"
                  value={draftFilters.isTierBoostActive}
                  onChange={(val) =>
                    setDraftFilters((p) => ({ ...p, isTierBoostActive: val }))
                  }
                  options={[
                    { label: "All", value: "" },
                    { label: "Yes", value: "true" },
                    { label: "No", value: "false" },
                  ]}
                  isObject
                />

                <Select
                  label="Marketplace Status"
                  value={draftFilters.marketplaceStatus}
                  onChange={(val) =>
                    setDraftFilters((p) => ({ ...p, marketplaceStatus: val }))
                  }
                  options={["", "ACTIVE", "SOLD", "INACTIVE", "DELETED", "DRAFT"]}
                />

                <div className="grid grid-cols-2 gap-3">
                  <DateInput
                    label="Listed After"
                    value={draftFilters.listedAfter}
                    onChange={(val) =>
                      setDraftFilters((p) => ({ ...p, listedAfter: val }))
                    }
                  />
                  <DateInput
                    label="Listed Before"
                    value={draftFilters.listedBefore}
                    onChange={(val) =>
                      setDraftFilters((p) => ({ ...p, listedBefore: val }))
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-6 py-4">
                <button
                  onClick={clearFilters}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  type="button"
                >
                  Clear
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                  type="button"
                >
                  Apply Filters
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <SuspendListingModal
        isOpen={suspendModal.open}
        onClose={() => setSuspendModal({ open: false, vehicleId: null, vehicleTitle: "" })}
        vehicleId={suspendModal.vehicleId}
        vehicleTitle={suspendModal.vehicleTitle}
        onSuccess={() => fetchVehicles(page, appliedFilters)}
      />

      <FlagForReviewModal
        isOpen={flagModal.open}
        onClose={() => setFlagModal({ open: false, vehicleId: null, vehicleTitle: "" })}
        vehicleId={flagModal.vehicleId}
        vehicleTitle={flagModal.vehicleTitle}
        onSuccess={() => fetchVehicles(page, appliedFilters)}
      />

      <AddInternalNoteModal
        isOpen={noteModal.open}
        onClose={() => setNoteModal({ open: false, vehicleId: null, vehicleTitle: "" })}
        vehicleId={noteModal.vehicleId}
        vehicleTitle={noteModal.vehicleTitle}
        onSuccess={() => fetchVehicles(page, appliedFilters)}
      />
    </div>
  );
}

function VehicleThumb({ src, alt }) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_VEHICLE_IMAGE);

  useEffect(() => {
    setImgSrc(src || FALLBACK_VEHICLE_IMAGE);
  }, [src]);

  return (
    <div className="relative h-12 w-[60px] shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
      <img
        src={imgSrc}
        alt={alt}
        loading="lazy"
        onError={() => setImgSrc(FALLBACK_VEHICLE_IMAGE)}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent" />
    </div>
  );
}

function TopCard({ title, value, color = "text-slate-900" }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50/80 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative z-10 flex items-center justify-between gap-4">
        <div>
          <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            {title}
          </div>
          <div className={cls("text-4xl font-extrabold tracking-tight", color)}>
            {value}
          </div>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-100 bg-sky-50 text-sky-600 shadow-sm">
          <CarFront size={18} />
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
      <div className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </div>

      <div className="relative">
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
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 pr-10 text-[13px] font-medium text-slate-900 outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-100 placeholder:text-slate-400"
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

function Select({ label, value, onChange, options, isObject = false }) {
  return (
    <label className="block">
      <div className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </div>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-[13px] font-medium text-slate-900 outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
        >
          {isObject
            ? options.map((o) => (
              <option key={o.value || "all"} value={o.value}>
                {o.label}
              </option>
            ))
            : options.map((o) => (
              <option key={o || "all"} value={o}>
                {o ? formatEnumLabel(o) : "All"}
              </option>
            ))}
        </select>

        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
    </label>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  prefix = "",
  inputMode,
}) {
  return (
    <label className="block">
      <div className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </div>

      <div className="relative">
        {prefix ? (
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-slate-400">
            {prefix}
          </div>
        ) : null}

        <input
          type={type}
          value={value}
          inputMode={inputMode}
          onChange={(e) => {
            const next = e.target.value;
            if (type === "number") {
              onChange(next.replace(/[^\d]/g, ""));
              return;
            }
            onChange(next);
          }}
          placeholder={placeholder}
          className={cls(
            "h-11 w-full rounded-xl border border-slate-200 bg-white text-[13px] font-medium text-slate-900 outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-100 placeholder:text-slate-400",
            prefix ? "pl-9 pr-4" : "px-4"
          )}
        />
      </div>
    </label>
  );
}

function DateInput({ label, value, onChange }) {
  const inputRef = useRef(null);
  const inputId = useId();

  const openPicker = () => {
    if (!inputRef.current) return;

    inputRef.current.focus();

    if (typeof inputRef.current.showPicker === "function") {
      inputRef.current.showPicker();
    } else {
      inputRef.current.click();
    }
  };

  return (
    <label className="block">
      <div className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </div>

      <div
        onClick={openPicker}
        className="group relative cursor-pointer"
      >
        <input
          id={inputId}
          ref={inputRef}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 pr-11 text-[13px] font-semibold text-slate-900 outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-100 group-hover:border-sky-200"
        />

        <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-hover:text-sky-500">
          <CalendarDays className="h-4 w-4" />
        </div>
      </div>
    </label>
  );
}

function PriceRangeSlider({ minPrice, maxPrice, onMinChange, onMaxChange }) {
  const minVal = Number(minPrice || 0);
  const maxVal = Number(maxPrice || 10000000); // 1Cr default max for slider bounds

  const minLimit = 0;
  const maxLimit = 10000000;

  const getPercent = (value) =>
    Math.round(((value - minLimit) / (maxLimit - minLimit)) * 100);

  return (
    <div className="relative pt-4 pb-2">
      <div className="relative h-2 w-full rounded-full bg-slate-200 shadow-inner">
        <div
          className="absolute h-full rounded-full bg-sky-500 shadow-sm transition-all"
          style={{
            left: `${getPercent(minVal)}%`,
            right: `${100 - getPercent(Math.min(maxVal, maxLimit))}%`,
          }}
        />
      </div>

      <input
        type="range"
        min={minLimit}
        max={maxLimit}
        step={50000}
        value={minVal}
        onChange={(e) => {
          const value = Math.min(Number(e.target.value), maxVal - 50000);
          onMinChange(String(value));
        }}
        className="pointer-events-none absolute -top-0.5 h-10 w-full appearance-none bg-transparent outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-sky-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
      />

      <input
        type="range"
        min={minLimit}
        max={maxLimit}
        step={50000}
        value={maxVal > maxLimit ? maxLimit : maxVal}
        onChange={(e) => {
          const value = Math.max(Number(e.target.value), minVal + 50000);
          onMaxChange(String(value));
        }}
        className="pointer-events-none absolute -top-0.5 h-10 w-full appearance-none bg-transparent outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-sky-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
      />

      <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-slate-400">
        <span>₹0</span>
        <span>₹1Cr+</span>
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  prefix = "",
  inputMode,
}) {
  return (
    <label className="block">
      <div className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </div>

      <div className="relative group">
        {prefix ? (
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-slate-400 group-focus-within:text-sky-500">
            {prefix}
          </div>
        ) : null}

        <input
          type={type}
          value={value}
          inputMode={inputMode}
          onChange={(e) => {
            const next = e.target.value;
            if (type === "number") {
              onChange(next.replace(/[^\d]/g, ""));
              return;
            }
            onChange(next);
          }}
          placeholder={placeholder}
          className={cls(
            "h-11 w-full rounded-xl border border-slate-200 bg-white text-[13px] font-bold text-slate-900 outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-100 placeholder:text-slate-300",
            prefix ? "pl-9 pr-4" : "px-4"
          )}
        />
      </div>
    </label>
  );
}