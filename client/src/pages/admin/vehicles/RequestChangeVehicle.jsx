import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  X,
  Loader2,
  FileSearch,
  ShieldAlert,
  Gem,
  Clock3,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Search,
  SlidersHorizontal,
  RefreshCw,
  ChevronDown,
  CalendarDays,
  Map,
  BadgeCheck,
  User,
  Eye,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import PendingApprovalsReviewPanel from "./pending-approvals/PendingApprovalsReviewPanel";
import PendingApprovalsConfirmModal from "./pending-approvals/PendingApprovalsConfirmModal";

import {
  filterPendingApprovals,
  normalizePendingApprovalsResponse,
  approvePendingVehicle,
  rejectPendingVehicle,
  requestChangesPendingVehicle,
} from "../../../api/pendingApprovals.api";
import { getAllTierPlans } from "../../../api/tierPlan.api";
import { getAllCitiesFromSearch } from "../../../api/addressApi";

const cls = (...a) => a.filter(Boolean).join(" ");
const PAGE_SIZE = 10;

const initialFilters = {
  submissionType: "",
  risk: "",
  tierPlanId: "",
  inspection: "",
  cityId: "",
  submittedAfter: "",
  submittedBefore: "",
  alertFilter: "",
};

/* =========================================================
   BADGES & FORMATTERS
   ========================================================= */
const formatEnumLabel = (value) => {
  return String(value || "").replace(/_/g, " ");
};

const typeBadge = (type) => {
  if (type === "CONSULTATION") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  return "bg-rose-50 text-rose-700 border-rose-200";
};

const riskBadge = (risk) => {
  if (risk === "HIGH") return "bg-rose-50 text-rose-700 border-rose-200";
  if (risk === "MODERATE") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-emerald-50 text-emerald-700 border-emerald-200";
};

const tierBadge = (tier) => {
  const t = String(tier || "").toUpperCase();
  if (t.includes("PREMIUM")) return "bg-violet-50 text-violet-700 border-violet-200";
  if (t.includes("PRO")) return "bg-sky-50 text-sky-700 border-sky-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
};

const inspectionBadge = (status) => {
  const map = {
    AVX_INSPECTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    AI_INSPECTED: "bg-indigo-50 text-indigo-700 border-indigo-200",
    SELF_INSPECTED: "bg-slate-100 text-slate-700 border-slate-200",
    IN_PROGRESS: "bg-amber-50 text-amber-700 border-amber-200",
    NOT_INSPECTED: "bg-slate-100 text-slate-700 border-slate-200",
  };
  return map[status] || "bg-slate-100 text-slate-700 border-slate-200";
};

const verificationStatusBadge = (status) => {
  const map = {
    REQUESTED: "bg-amber-50 text-amber-700 border-amber-200",
    VERIFIED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
    REQUEST_CHANGES: "bg-sky-50 text-sky-700 border-sky-200",
  };
  return map[status] || "bg-slate-100 text-slate-700 border-slate-200";
};

const formatHours = (h) => {
  const totalMinutes = h * 60;
  const totalHours = h;
  const totalDays = h / 24;
  const totalMonths = totalDays / 30;
  const totalYears = totalDays / 365;

  // Years (if >= 1 year)
  if (totalYears >= 1) {
    return `${totalYears.toFixed(1)}y`;
  }

  // Months (if >= 1 month)
  if (totalMonths >= 1) {
    return `${totalMonths.toFixed(1)}mo`;
  }

  // Days (if >= 1 day)
  if (totalDays >= 1) {
    return `${totalDays.toFixed(1)}d`;
  }

  // Hours (if >= 1 hour)
  if (totalHours >= 1) {
    return `${totalHours.toFixed(1)}h`;
  }

  // Minutes (less than 1 hour)
  return `${Math.max(1, Math.round(totalMinutes))}m`;
};

const getSlaBadge = (submittedAtHours, slaHours) => {
  if (submittedAtHours < 3) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (submittedAtHours >= 3 && submittedAtHours <= slaHours) {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  return "bg-rose-50 text-rose-700 border-rose-200";
};

/* =========================================================
   HELPERS
   ========================================================= */
const hoursSinceDate = (iso) => {
  if (!iso) return 0;
  const now = new Date();
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();
  return Math.max(0, diffMs / (1000 * 60 * 60));
};

const deriveSlaHours = (submissionType) => {
  const map = {
    NEW: 24,
    EDITED: 12,
    REACTIVATION: 8,
  };
  return map[submissionType] || 24;
};

const mapApiRow = (item) => {
  const title = [
    item?.makerName,
    item?.modelName,
    item?.yearOfMfg,
  ]
    .filter(Boolean)
    .join(" • ");

  const type = item?.type || "SELLER";
  const normalizedType = type === "USER_SELLER" ? "SELLER" : type;

  // Determine consultant/seller name based on type
  let consultantName = "-";
  if (normalizedType === "CONSULTATION") {
    consultantName = item?.consultantName || "-";
  } else if (normalizedType === "SELLER") {
    consultantName = item?.consultantUsername || "-";
  }

  return {
    id: item?.vehicleId || "-",
    thumb: item?.thumbnailUrl || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=60",
    title: title || "-",
    consultant: consultantName,
    type: normalizedType,
    tier: item?.tierPlanTitle || "-",
    submissionType: item?.submissionType || "-",
    inspection: item?.inspectionStatus || "NOT_INSPECTED",
    verificationStatus: item?.verificationStatus || "REQUESTED",
    risk: item?.riskLevel || "LOW",
    submittedAt: item?.submittedAt || null,
    submittedAtHours: hoursSinceDate(item?.submittedAt),
    slaHours: deriveSlaHours(item?.submissionType),
    city: item?.cityName || "-",
    registrationNo: item?.registrationNumber || "-",
    price: Number(item?.price || 0),
    boost: Boolean(item?.isBoostActive),
    duplicateFound: false, // In reality, this might come from API or be calculated
    priceDeviation: 0,
    __raw: item,
  };
};

const canQuickApprove = (row) => {
  return (
    String(row.tier).toUpperCase().includes("PREMIUM") &&
    row.risk === "LOW" &&
    row.inspection === "AVX_INSPECTED" &&
    !row.duplicateFound
  );
};

/* =========================================================
   VEHICLE THUMBNAIL COMPONENT
   ========================================================= */
const FALLBACK_VEHICLE_IMAGE =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=60";

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

/* =========================================================
   SEARCHABLE COMBOBOX COMPONENT
   ========================================================= */
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
        const selected = allOptions.find((o) => String(o.id) === String(value));
        setQuery(selected?.name || "");
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [allOptions, setOpen, setQuery, value]);

  return (
    <div className="block" ref={wrapperRef}>
      <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
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
                  const active = isAll ? !value : String(value) === String(item.id);
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

export default function RequestChangeVehicle() {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [serverTotalPages, setServerTotalPages] = useState(1);
  const [serverTotal, setServerTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);

  const [reviewItem, setReviewItem] = useState(null);
  const [modal, setModal] = useState(null);

  const [tierPlans, setTierPlans] = useState([]);
  const [tierPlansLoading, setTierPlansLoading] = useState(false);

  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [cityQuery, setCityQuery] = useState("");

  const [tierDropdownOpen, setTierDropdownOpen] = useState(false);
  const [tierQuery, setTierQuery] = useState("");

  const searchDebounceRef = useRef(null);
  const firstLoadRef = useRef(true);

  /* =========================================================
     FETCH
  ========================================================= */
  const fetchTierPlans = async () => {
    setTierPlansLoading(true);
    try {
      const res = await getAllTierPlans();
      const list = (Array.isArray(res?.data) && res.data) || (Array.isArray(res) && res) || [];
      setTierPlans(
        list
          .map((t) => ({
            id: t?.tierPlanId ?? t?.id,
            name: t?.title || "Tier",
          }))
          .filter((x) => x.id != null)
      );
    } catch (err) {
      console.error("Failed to load tier plans:", err);
      setTierPlans([]);
    } finally {
      setTierPlansLoading(false);
    }
  };

  const fetchCities = async () => {
    setCitiesLoading(true);
    try {
      const res = await getAllCitiesFromSearch("");
      const list = (Array.isArray(res?.data) && res.data) || (Array.isArray(res) && res) || [];
      setCities(
        list
          .map((c) => ({
            id: c?.cityId ?? c?.id ?? c?._id,
            name: c?.cityName ?? c?.name ?? "City",
          }))
          .filter((x) => x.id != null)
      );
    } catch (err) {
      console.error("Failed to load cities:", err);
      setCities([]);
    } finally {
      setCitiesLoading(false);
    }
  };

  const fetchPendingApprovals = async (pageNo, filters, searchText = search) => {
    try {
      setLoading(true);
      setError("");

      const payload = await filterPendingApprovals({
        searchText: searchText?.trim() ? searchText.trim() : null,
        submissionType: filters.submissionType || null,
        riskLevel: filters.risk || null,
        tierPlanId: filters.tierPlanId ? String(filters.tierPlanId) : null,
        inspectionStatus: filters.inspection || null,
        verificationStatus: "REQUEST_CHANGES",
        cityId: filters.cityId ? Number(filters.cityId) : null,
        submittedAfter: filters.submittedAfter || null,
        submittedBefore: filters.submittedBefore || null,
        pageNo,
        pageSize: PAGE_SIZE,
      });

      const { list, totalElements, totalPages, currentPage } =
        normalizePendingApprovalsResponse(payload);

      const mapped = (list || []).map(mapApiRow);

      setRows(mapped);
      setServerTotal(Number(totalElements || 0));
      setServerTotalPages(Math.max(1, Number(totalPages || 1)));
      setPage(Number(currentPage || pageNo));
    } catch (e) {
      setRows([]);
      setServerTotal(0);
      setServerTotalPages(1);
      setError(
        e?.response?.data?.message ||
        e?.message ||
        "Failed to load pending approvals"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingApprovals(page, appliedFilters, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, appliedFilters]);

  useEffect(() => {
    fetchTierPlans();
    fetchCities();
  }, []);

  useEffect(() => {
    const selectedCity = cities.find((city) => String(city.id) === String(draftFilters.cityId));
    if (selectedCity) {
      setCityQuery(selectedCity.name || "");
    } else if (!draftFilters.cityId) {
      setCityQuery("");
    }
  }, [draftFilters.cityId, cities]);

  useEffect(() => {
    const selectedTier = tierPlans.find((tier) => String(tier.id) === String(draftFilters.tierPlanId));
    if (selectedTier) {
      setTierQuery(selectedTier.name || "");
    } else if (!draftFilters.tierPlanId) {
      setTierQuery("");
    }
  }, [draftFilters.tierPlanId, tierPlans]);

  /* =========================================================
     SEARCH DEBOUNCE
  ========================================================= */
  useEffect(() => {
    if (firstLoadRef.current) {
      firstLoadRef.current = false;
      return;
    }

    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    searchDebounceRef.current = setTimeout(() => {
      setPage(1);
      fetchPendingApprovals(1, appliedFilters, search);
    }, 500);

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  /* =========================================================
     STATS
  ========================================================= */
  const filteredCities = useMemo(() => {
    if (!cityQuery.trim()) return cities;
    const q = cityQuery.toLowerCase();
    return cities.filter((c) => c.name.toLowerCase().includes(q));
  }, [cities, cityQuery]);

  const filteredTierPlans = useMemo(() => {
    if (!tierQuery.trim()) return tierPlans;
    const q = tierQuery.toLowerCase();
    return tierPlans.filter((t) => t.name.toLowerCase().includes(q));
  }, [tierPlans, tierQuery]);

  const stats = useMemo(() => {
    return {
      total: serverTotal,
      highRisk: rows.filter((r) => r.risk === "HIGH").length,
      premium: rows.filter((r) =>
        String(r.tier).toUpperCase().includes("PREMIUM")
      ).length,
      slaCritical: rows.filter((r) => r.submittedAtHours > r.slaHours).length,
      performance: {
        avgApproval: "4.2h",
        rejected: "12%",
        escalated: "2.4%",
        slaCompliance: "94%"
      }
    };
  }, [rows, serverTotal]);

  /* =========================================================
     ACTIONS
  ========================================================= */
  const handleRefresh = () => {
    fetchPendingApprovals(page, appliedFilters, search);
  };

  const handleClear = () => {
    setSearch("");
    setDraftFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setPage(1);
    setFiltersOpen(false);
    setCityDropdownOpen(false);
    setTierDropdownOpen(false);
    setCityQuery("");
    setTierQuery("");
  };

  const handleApplyFilterValues = () => {
    setPage(1);
    setAppliedFilters({ ...draftFilters });
    setFiltersOpen(false);
    setCityDropdownOpen(false);
    setTierDropdownOpen(false);
  };

  const handleAlertFilter = (id) => {
    setDraftFilters(prev => ({ ...prev, alertFilter: id }));
    setAppliedFilters(prev => ({ ...prev, alertFilter: id }));
    setPage(1);
  };

  // Approval Flows
  const handleApprove = async (item) => {
    try {
      await approvePendingVehicle(item.id, item.approvalRemarks || null);
      setRows(prev => prev.filter(r => r.id !== item.id));
      setModal(null);
      setReviewItem(null);
    } catch (error) {
      console.error("Failed to approve vehicle:", error);
      throw error; // Re-throw to be caught by modal
    }
  };

  const handleReject = async (item) => {
    try {
      const reason = item.rejectReason; // Already formatted in modal
      await rejectPendingVehicle(item.id, reason);
      setRows(prev => prev.filter(r => r.id !== item.id));
      setModal(null);
      setReviewItem(null);
    } catch (error) {
      console.error("Failed to reject vehicle:", error);
      throw error; // Re-throw to be caught by modal
    }
  };

  const handleRequestChanges = async (item) => {
    try {
      const reason = item.changeReason; // Already formatted in modal
      await requestChangesPendingVehicle(item.id, reason);
      setRows(prev => prev.filter(r => r.id !== item.id));
      setModal(null);
      setReviewItem(null);
    } catch (error) {
      console.error("Failed to request changes:", error);
      throw error; // Re-throw to be caught by modal
    }
  };

  // If reviewItem is set, we show the review panel instead of the table list
  if (reviewItem) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
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
        <button
          onClick={() => setReviewItem(null)}
          className="group mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-slate-900"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200 group-hover:bg-slate-50">
            <ArrowLeft size={16} />
          </div>
          Back to Queue
        </button>

        <div className="rounded-[40px] border border-slate-200 bg-white shadow-2xl shadow-slate-200/50 overflow-hidden">
          <PendingApprovalsReviewPanel
            item={reviewItem}
            onClose={() => setReviewItem(null)}
            onApprove={(item) => setModal({ type: "approve", item })}
            onReject={(item) => setModal({ type: "reject", item })}
            onRequestChanges={(item) => setModal({ type: "changes", item })}
            onEscalate={(item) => setModal({ type: "escalate", item })}
          />
        </div>

        <PendingApprovalsConfirmModal
          modal={modal}
          onClose={() => setModal(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          onRequestChanges={handleRequestChanges}
          onEscalate={() => setModal(null)}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden p-0">
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

        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, 0.2); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(148, 163, 184, 0.4); }
      `}</style>

      <div className="flex flex-1 flex-col space-y-4 overflow-hidden p-6">
        {/* HEADER */}
        <section className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="mb-1 text-[32px] font-extrabold tracking-tight text-slate-900">
              Request Changes
            </h1>
          </div>
        </section>

        {/* STATS CARDS */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <TopCard title="Total Pending" value={stats.total} color="text-slate-900" icon={<FileSearch size={18} />} />
          <TopCard title="High Risk" value={stats.highRisk} color="text-rose-600" icon={<ShieldAlert size={18} />} />
          <TopCard title="Premium Tier" value={stats.premium} color="text-violet-600" icon={<Gem size={18} />} />
          <TopCard title="SLA Critical" value={stats.slaCritical} color="text-amber-600" icon={<Clock3 size={18} />} />
        </section>

        {/* TABLE SECTION */}
        <section className="relative flex flex-1 flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
          <div className="pointer-events-none absolute -top-10 right-10 h-48 w-48 rounded-full bg-sky-100/60 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-indigo-50 blur-3xl" />

          {/* SEARCH BAR */}
          <div className="relative z-10 shrink-0 border-b border-slate-200 px-4 py-4 md:px-6">
            <div className="flex items-center gap-2.5 md:gap-4 lg:justify-between">
              <div className="relative min-w-0 flex-1 max-w-2xl">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by ID, consultant, city, registration..."
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
                  {Object.values(appliedFilters).filter(Boolean).length > 0 && (
                    <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-900 px-1.5 text-[10px] font-black text-white">
                      {Object.values(appliedFilters).filter(Boolean).length}
                    </span>
                  )}
                </button>

                <button
                  onClick={handleRefresh}
                  className="flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
                  title="Refresh List"
                  type="button"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-sky-500" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="border-b border-slate-200 bg-rose-50/70 px-6 py-4 text-sm font-semibold text-rose-700">
              {error}
            </div>
          )}

          <div className="table-scroll relative flex-1 w-full overflow-auto">
            <table className="min-w-[1560px] w-full border-collapse">
              <thead className="bg-slate-50/80 backdrop-blur-sm">
                <tr>
                  <th className="border-b border-r border-slate-200/60 px-6 py-4.5 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                    Vehicle
                  </th>
                  <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                    Consultant / Seller
                  </th>
                  <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                    Type
                  </th>
                  <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                    City
                  </th>
                  <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                    Tier
                  </th>
                  <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                    Submission
                  </th>
                  <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                    Inspection
                  </th>
                  <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                    Verification Status
                  </th>
                  <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                    Risk
                  </th>
                  <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                    Submitted
                  </th>
                  <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                    SLA Timer
                  </th>
                  <th className="border-b border-slate-200 px-6 py-4.5 text-right text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={12} className="px-6 py-24 text-center">
                      <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading pending approval...
                      </div>
                    </td>
                  </tr>
                ) : rows.length ? (
                  rows.map((row, index) => (
                    <tr
                      key={row.id}
                      className={cls(
                        "group transition-colors duration-200 hover:bg-sky-50/45",
                        index % 2 === 0 ? "bg-white" : "bg-slate-50/35"
                      )}
                    >
                      <td className="border-b border-slate-100 px-6 py-4.5 align-middle">
                        <div className="flex min-w-[320px] items-center gap-4">
                          <VehicleThumb src={row.thumb} alt={row.title} />
                          <div className="min-w-0">
                            <div className="truncate text-[14px] cursor-pointer font-bold text-slate-900 transition-colors group-hover:text-sky-700"
                              title="View Vehicles Details"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/admin/vehicles/${row.id}`);
                              }}
                            >
                              {row.title}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                        <div className="inline-flex min-w-[180px] items-center justify-center">
                          <div
                            className={cls(
                              "flex items-center gap-2 text-[13px] font-semibold",
                              row.consultant && row.consultant !== "-"
                                ? "text-slate-800"
                                : "text-slate-400"
                            )}
                          >
                            {row.consultant && row.consultant !== "-" ? (
                              <>
                                {row.type === "CONSULTATION" ? (
                                  <BadgeCheck className="h-4 w-4 shrink-0 text-sky-600" />
                                ) : (
                                  <User className="h-4 w-4 shrink-0 text-slate-600" />
                                )}
                                <span className="truncate">{row.consultant}</span>
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
                            typeBadge(row.type)
                          )}
                        >
                          {formatEnumLabel(row.type)}
                        </span>
                      </td>

                      <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                        <div className="inline-flex items-center gap-2 text-[13px] font-medium text-slate-600 whitespace-nowrap">
                          {row.city}
                        </div>
                      </td>

                      <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                        <span className={cls("inline-flex rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.03em] whitespace-nowrap", tierBadge(row.tier))}>
                          {row.tier}
                        </span>
                      </td>

                      <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                        <span className="text-[12px] font-bold text-slate-600">
                          {row.submissionType}
                        </span>
                      </td>

                      <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                        <span className={cls("inline-flex rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.03em] whitespace-nowrap", inspectionBadge(row.inspection))}>
                          {formatEnumLabel(row.inspection)}
                        </span>
                      </td>

                      <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                        <span className={cls("inline-flex rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.03em] whitespace-nowrap", verificationStatusBadge(row.verificationStatus))}>
                          {formatEnumLabel(row.verificationStatus)}
                        </span>
                      </td>

                      <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                        <span className={cls("inline-flex rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.03em] whitespace-nowrap", riskBadge(row.risk))}>
                          {row.risk}
                        </span>
                      </td>

                      <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                        <div className="text-[13px] font-bold text-slate-500 whitespace-nowrap">
                          {formatHours(row.submittedAtHours)} ago
                        </div>
                      </td>

                      <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                        <span className={cls("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.03em] whitespace-nowrap shadow-sm", getSlaBadge(row.submittedAtHours, row.slaHours))}>
                          <Clock3 size={11} />
                          {formatHours(row.submittedAtHours)} / {row.slaHours}h
                        </span>
                      </td>

                      <td className="border-b border-slate-100 px-6 py-4.5 text-right align-middle">
                        <button
                          onClick={() => navigate(`/admin/vehicles/${row.id}`, { state: { fromPendingApprovals: true } })}
                          title="Review"
                          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={12} className="px-6 py-40 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-2xl font-black tracking-tight text-slate-900">
                          No pending submissions
                        </div>
                        <div className="mx-auto mt-2 max-w-sm text-[15px] font-medium text-slate-400">
                          The queue is all clear! All current vehicle submissions have been processed.
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex shrink-0 items-center justify-between gap-6 border-t border-slate-100 bg-white px-8 py-6">
            <div className="text-sm font-bold text-slate-500">
              Showing <span className="text-slate-900">{(page - 1) * PAGE_SIZE + 1}</span> - <span className="text-slate-900">{Math.min(page * PAGE_SIZE, serverTotal)}</span> of <span className="text-slate-900">{serverTotal}</span> listings
            </div>

            <div className="flex items-center gap-3">
              <PaginationButton
                label="Prev"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
              />
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, serverTotalPages) }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={cls(
                      "h-10 w-10 rounded-xl text-sm font-bold transition-all",
                      page === i + 1 ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10" : "text-slate-500 hover:bg-slate-100"
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <PaginationButton
                label="Next"
                onClick={() => setPage(p => Math.min(serverTotalPages, p + 1))}
                disabled={page === serverTotalPages || loading}
              />
            </div>
          </div>
        </section>
      </div>

      {/* FILTER SIDEBAR */}
      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFiltersOpen(false)}
              className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 right-0 top-0 z-[101] flex w-full max-w-[440px] flex-col bg-white shadow-2xl border-l border-slate-200"
            >
              <div className="shrink-0 border-b border-slate-200 bg-gradient-to-br from-slate-50 via-white to-sky-50/30 px-6 py-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/20">
                        <SlidersHorizontal className="h-5 w-5" />
                      </div>
                      <h2 className="text-2xl font-black tracking-tight text-slate-900">Filters</h2>
                    </div>
                    <p className="mt-1 text-sm font-medium text-slate-500">Refine pending approval records</p>
                  </div>
                  <button
                    onClick={() => setFiltersOpen(false)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 active:scale-95"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="custom-scrollbar flex-1 overflow-y-auto px-6 py-6 space-y-5 bg-slate-50/30">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <FileSearch className="h-4 w-4 text-slate-400" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Submission Details</h4>
                  </div>
                  <div className="space-y-4">
                    <Select
                      label="Submission Type"
                      value={draftFilters.submissionType}
                      onChange={(v) => setDraftFilters(p => ({ ...p, submissionType: v }))}
                      options={["", "NEW", "EDITED", "REACTIVATION"]}
                    />
                    <Select
                      label="Risk Level"
                      value={draftFilters.risk}
                      onChange={(v) => setDraftFilters(p => ({ ...p, risk: v }))}
                      options={["", "LOW", "MODERATE", "HIGH"]}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <Gem className="h-4 w-4 text-slate-400" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Tier & Inspection</h4>
                  </div>
                  <div className="space-y-4">
                    <SearchableCombobox
                      label="Tier Plan"
                      value={draftFilters.tierPlanId}
                      onChange={(val) => setDraftFilters((prev) => ({ ...prev, tierPlanId: val }))}
                      query={tierQuery}
                      setQuery={setTierQuery}
                      open={tierDropdownOpen}
                      setOpen={setTierDropdownOpen}
                      options={filteredTierPlans}
                      allOptions={tierPlans}
                      loading={tierPlansLoading}
                      placeholder="All Tiers"
                    />
                    <Select
                      label="Inspection Status"
                      value={draftFilters.inspection}
                      onChange={(v) => setDraftFilters(p => ({ ...p, inspection: v }))}
                      options={["", "NOT_INSPECTED", "IN_PROGRESS", "SELF_INSPECTED", "AI_INSPECTED", "AVX_INSPECTED"]}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <Map className="h-4 w-4 text-slate-400" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Location</h4>
                  </div>
                  <div className="space-y-4">
                    <SearchableCombobox
                      label="City"
                      value={draftFilters.cityId}
                      onChange={(val) => setDraftFilters((prev) => ({ ...prev, cityId: val }))}
                      query={cityQuery}
                      setQuery={setCityQuery}
                      open={cityDropdownOpen}
                      setOpen={setCityDropdownOpen}
                      options={filteredCities}
                      allOptions={cities}
                      loading={citiesLoading}
                      placeholder="All Cities"
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
                      label="Submitted After"
                      value={draftFilters.submittedAfter}
                      onChange={(v) => setDraftFilters(p => ({ ...p, submittedAfter: v }))}
                    />
                    <DateInput
                      label="Submitted Before"
                      value={draftFilters.submittedBefore}
                      onChange={(v) => setDraftFilters(p => ({ ...p, submittedBefore: v }))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-gradient-to-br from-slate-50 via-white to-sky-50/30 px-6 py-5 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
                <button
                  onClick={handleClear}
                  className="flex-1 rounded-xl border-2 border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
                >
                  Clear All
                </button>
                <button
                  onClick={handleApplyFilterValues}
                  className="flex-1 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/30 active:scale-95"
                >
                  Apply Filters
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <PendingApprovalsConfirmModal
        modal={modal}
        onClose={() => setModal(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        onRequestChanges={handleRequestChanges}
        onEscalate={() => setModal(null)}
      />
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

function Select({ label, value, onChange, options, isObject = false }) {
  const formatEnumLabel = (str) => {
    if (!str) return "All";
    return String(str).replace(/_/g, " ");
  };

  return (
    <label className="block">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</div>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-[13px] font-semibold outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-100 shadow-sm"
        >
          {options.map(o => (
            <option key={o} value={o}>
              {formatEnumLabel(o)}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>
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
        <input
          ref={ref}
          type="date"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 px-4 pr-11 text-[13px] font-semibold outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-100 group-hover:border-sky-200 shadow-sm"
        />
        <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-hover:text-sky-500">
          <CalendarDays className="h-4 w-4" />
        </div>
      </div>
    </label>
  );
}


function PaginationButton({ label, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 disabled:opacity-40 active:scale-95 shadow-sm"
    >
      {label}
    </button>
  );
}
