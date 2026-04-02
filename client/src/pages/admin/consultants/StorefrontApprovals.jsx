import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Clock3,
  RefreshCw,
  Loader2,
  Eye,
  Mail,
  Phone,
  SlidersHorizontal,
  X,
  MapPin,
  BadgeCheck,
  ChevronDown,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { filterStorefrontApprovals } from "../../../api/pendingApprovals.api";
import { getTierPlans } from "../../../api/tierPlan.api";
import { getAllCitiesFromSearch } from "../../../api/addressApi";

const cls = (...a) => a.filter(Boolean).join(" ");

const safeText = (value, fallback = "-") => {
  if (value === null || value === undefined || value === "") return fallback;
  return value;
};

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const verificationBadge = (status) => {
  const map = {
    VERIFIED: "border-emerald-200 bg-emerald-50 text-emerald-700",
    REQUESTED: "border-amber-200 bg-amber-50 text-amber-700",
    REJECTED: "border-rose-200 bg-rose-50 text-rose-700",
    PENDING: "border-slate-200 bg-slate-100 text-slate-700",
  };
  return map[status] || map.PENDING;
};

const tierBadge = (tier) => {
  if (tier === "PREMIUM") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (tier === "PRO") return "border-blue-200 bg-blue-50 text-blue-700";
  return "border-slate-200 bg-slate-100 text-slate-700";
};

const modeTypeBadge = (modeType) => {
  const type = String(modeType || "").toUpperCase();
  if (type === "NEW") return "border-sky-200 bg-sky-50 text-sky-700";
  if (type === "UPDATED") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-slate-200 bg-slate-100 text-slate-700";
};

function ConsultantLogo({ src, alt }) {
  const [imgSrc, setImgSrc] = useState(
    src || "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=600&auto=format&fit=crop&q=60"
  );

  useEffect(() => {
    setImgSrc(
      src || "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=600&auto=format&fit=crop&q=60"
    );
  }, [src]);

  return (
    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-[0_4px_16px_rgba(15,23,42,0.08)]">
      <img
        src={imgSrc}
        alt={alt}
        loading="lazy"
        onError={() =>
          setImgSrc(
            "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=600&auto=format&fit=crop&q=60"
          )
        }
        className="h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent" />
    </div>
  );
}

function TopCard({ title, value, icon: Icon, iconWrapClass = "", valueClass = "" }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative z-10 flex items-center justify-between gap-4">
        <div>
          <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            {title}
          </div>
          <div
            className={cls(
              "text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900",
              valueClass
            )}
          >
            {value}
          </div>
        </div>

        <div
          className={cls(
            "flex h-11 w-11 items-center justify-center rounded-2xl border shadow-sm",
            iconWrapClass || "border-sky-100 bg-sky-50 text-sky-600"
          )}
        >
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

function RowActions({ onView, onApprove, onReject }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex cursor-pointer h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 active:scale-95"
        type="button"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="p-2">
            <button
              onClick={() => {
                onView?.();
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-semibold text-slate-700 transition-all hover:bg-sky-50 hover:text-sky-700"
              type="button"
            >
              <Eye className="h-4 w-4" />
              View Details
            </button>

            <button
              onClick={() => {
                onApprove?.();
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-semibold text-emerald-700 transition-all hover:bg-emerald-50"
              type="button"
            >
              <CheckCircle2 className="h-4 w-4" />
              Approve
            </button>

            <button
              onClick={() => {
                onReject?.();
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-semibold text-rose-700 transition-all hover:bg-rose-50"
              type="button"
            >
              <XCircle className="h-4 w-4" />
              Reject
            </button>
          </div>
        </div>
      )}
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
}) {
  const wrapperRef = useRef(null);
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const displayOptions = useMemo(() => {
    return [{ id: "", name: placeholder, title: placeholder }, ...options];
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
    onChange(item.id ? String(item.id) : "ALL");
    setQuery(item.id ? (item.title || item.name || "") : "");
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
          (o) => (o.name?.toLowerCase() === query.trim().toLowerCase()) ||
            (o.title?.toLowerCase() === query.trim().toLowerCase())
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

        setQuery(selected ? (selected.title || selected.name || "") : "");
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
              onChange("ALL");
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
          <ChevronDown
            className={cls(
              "h-4 w-4 transition-transform duration-200",
              open && "rotate-180"
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
                    ? !value || value === "ALL"
                    : String(value) === String(item.id);
                  const highlighted = activeIndex === idx;
                  const displayName = item.title || item.name;

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
                      <span className="truncate">{displayName}</span>
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

const StorefrontApprovals = () => {
  const navigate = useNavigate();
  const didInit = useRef(false);
  const lastFetchKeyRef = useRef("");

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [filtersOpen, setFiltersOpen] = useState(false);

  const [tierPlans, setTierPlans] = useState([]);
  const [tierId, setTierId] = useState("ALL");
  const [draftTierId, setDraftTierId] = useState("ALL");
  const [tierLoaded, setTierLoaded] = useState(false);
  const [tierLoading, setTierLoading] = useState(false);
  const [tierDropdownOpen, setTierDropdownOpen] = useState(false);
  const [tierQuery, setTierQuery] = useState("");

  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [cityId, setCityId] = useState("ALL");
  const [draftCityId, setDraftCityId] = useState("ALL");
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [cityQuery, setCityQuery] = useState("");

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [searchText, setSearchText] = useState("");
  const searchDebounceRef = useRef(null);

  const loadTiersOnce = useCallback(async () => {
    if (tierLoaded || tierLoading) return;

    setTierLoading(true);
    try {
      const res = await getTierPlans();
      const list =
        (Array.isArray(res?.data) && res.data) || (Array.isArray(res) && res) || [];

      setTierPlans(
        list
          .map((p) => ({
            id: p?.id ?? p?.tierPlanId ?? p?._id,
            title: p?.title ?? p?.name ?? "Plan",
          }))
          .filter((x) => x.id != null)
      );
      setTierLoaded(true);
    } catch (e) {
      console.error(e);
      setTierPlans([]);
      setTierLoaded(true);
      toast.error("Failed to load tier plans");
    } finally {
      setTierLoading(false);
    }
  }, [tierLoaded, tierLoading]);

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
      console.error(e);
      setCities([]);
      toast.error("Failed to load cities");
    } finally {
      setCitiesLoading(false);
    }
  }, [cities.length, citiesLoading]);

  const buildPayload = useCallback(
    ({
      nextPage = 1,
      nextTierId = "ALL",
      nextCityId = "ALL",
      nextSearch = "",
    }) => ({
      searchText: nextSearch?.trim() || null,
      tierPlanId: nextTierId === "ALL" ? null : String(nextTierId),
      cityId: nextCityId === "ALL" ? null : String(nextCityId),
      pageNo: nextPage,
      pageSize,
    }),
    []
  );

  const fetchApprovals = useCallback(
    async ({
      nextPage,
      nextTierId,
      nextCityId,
      nextSearch,
      silent = false,
      force = false,
    }) => {
      const payload = buildPayload({
        nextPage,
        nextTierId,
        nextCityId,
        nextSearch,
      });

      const requestKey = JSON.stringify(payload);

      if (!force && lastFetchKeyRef.current === requestKey) {
        return;
      }

      lastFetchKeyRef.current = requestKey;
      setLoading(true);
      setError("");

      try {
        const res = await filterStorefrontApprovals(payload);
        const list =
          (Array.isArray(res?.data) && res.data) ||
          (Array.isArray(res) && res) ||
          [];

        setRows(list);

        const pr = res?.pageResponse || {};
        const serverTotal =
          Number(pr?.totalElements ?? list.length) || list.length;
        const serverTotalPages =
          Number(pr?.totalPages ?? Math.max(1, Math.ceil(serverTotal / pageSize))) || 1;
        const serverCurrentPage = Number(pr?.currentPage ?? nextPage) || nextPage;

        setTotalCount(serverTotal);
        setTotalPages(serverTotalPages);
        setPage(serverCurrentPage);

        if (!silent) {
          toast.success("Storefront approvals loaded");
        }
      } catch (err) {
        console.error("Storefront approvals fetch failed:", err);
        setRows([]);
        setTotalCount(0);
        setTotalPages(1);
        setPage(1);
        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch storefront approvals."
        );
        if (!silent) {
          toast.error("Failed to fetch storefront approvals");
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [buildPayload]
  );

  const queryState = useMemo(
    () => ({
      nextPage: page,
      nextTierId: tierId,
      nextCityId: cityId,
      nextSearch: searchText,
    }),
    [page, tierId, cityId, searchText]
  );

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    loadTiersOnce();
    loadCitiesOnce();

    fetchApprovals({
      nextPage: 1,
      nextTierId: "ALL",
      nextCityId: "ALL",
      nextSearch: "",
      silent: false,
      force: true,
    });
  }, [fetchApprovals, loadCitiesOnce, loadTiersOnce]);

  useEffect(() => {
    if (!didInit.current) return;

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    const isSearching = searchText.trim().length > 0;

    if (isSearching) {
      searchDebounceRef.current = setTimeout(() => {
        fetchApprovals({
          ...queryState,
          silent: true,
        });
      }, 450);
    } else {
      fetchApprovals({
        ...queryState,
        silent: true,
      });
    }

    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [queryState, searchText, fetchApprovals]);

  useEffect(() => {
    if (!didInit.current) return;
    setPage(1);
  }, [searchText]);

  useEffect(() => {
    if (!filtersOpen) return;
    loadCitiesOnce();

    setDraftTierId(tierId);
    setDraftCityId(cityId);
  }, [filtersOpen, loadCitiesOnce, tierId, cityId]);

  useEffect(() => {
    const selectedCity = cities.find(
      (city) => String(city.id) === String(draftCityId)
    );

    if (selectedCity) {
      setCityQuery(selectedCity.name || "");
    } else if (!draftCityId || draftCityId === "ALL") {
      setCityQuery("");
    }
  }, [draftCityId, cities]);

  useEffect(() => {
    const selectedTier = tierPlans.find(
      (tier) => String(tier.id) === String(draftTierId)
    );

    if (selectedTier) {
      setTierQuery(selectedTier.title || "");
    } else if (!draftTierId || draftTierId === "ALL") {
      setTierQuery("");
    }
  }, [draftTierId, tierPlans]);

  const stats = useMemo(() => {
    return {
      total: totalCount,
      requested: rows.filter((item) => item?.verificationStatus === "REQUESTED").length,
      verified: rows.filter((item) => item?.verificationStatus === "VERIFIED").length,
      rejected: rows.filter((item) => item?.verificationStatus === "REJECTED").length,
    };
  }, [rows, totalCount]);

  const handleRefresh = () => {
    lastFetchKeyRef.current = "";
    setRefreshing(true);
    fetchApprovals({
      ...queryState,
      silent: false,
      force: true,
    });
  };

  const applyFilters = () => {
    setTierId(draftTierId);
    setCityId(draftCityId);
    setFiltersOpen(false);
    setPage(1);
  };

  const clearAll = () => {
    lastFetchKeyRef.current = "";

    setSearchText("");
    setTierId("ALL");
    setDraftTierId("ALL");
    setCityId("ALL");
    setDraftCityId("ALL");
    setFiltersOpen(false);
    setPage(1);

    fetchApprovals({
      nextPage: 1,
      nextTierId: "ALL",
      nextCityId: "ALL",
      nextSearch: "",
      silent: true,
      force: true,
    });
  };

  const activeFilters = tierId !== "ALL" || cityId !== "ALL";

  const filteredCities = useMemo(() => {
    if (!cityQuery.trim()) return cities;
    const q = cityQuery.toLowerCase();
    return cities.filter((c) => c.name.toLowerCase().includes(q));
  }, [cities, cityQuery]);

  const filteredTierPlans = useMemo(() => {
    if (!tierQuery.trim()) return tierPlans;
    const q = tierQuery.toLowerCase();
    return tierPlans.filter((t) => t.title.toLowerCase().includes(q));
  }, [tierPlans, tierQuery]);

  const handleViewDetails = (item) => {
    navigate(`/admin/consultants/storefront-approvals/${item.storeDraftId}`, {
      state: { from: '/admin/consultants/storefront-approvals' }
    });
  };

  const handleApprove = (item) => {
    toast.success(`Approved storefront for ${item.consultationName}`);
  };

  const handleReject = (item) => {
    toast.error(`Rejected storefront for ${item.consultationName}`);
  };

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
      `}</style>

      <div className="flex flex-1 flex-col space-y-4 overflow-hidden p-6">
        <section className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-1 text-[32px] font-extrabold tracking-tight text-slate-900">
              Storefront Approvals
            </h1>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <TopCard
            title="Total Requests"
            value={loading ? "..." : stats.total}
            icon={Clock3}
            iconWrapClass="border-sky-100 bg-sky-50 text-sky-600"
          />
          <TopCard
            title="Requested"
            value={loading ? "..." : stats.requested}
            icon={ShieldAlert}
            iconWrapClass="border-amber-100 bg-amber-50 text-amber-600"
            valueClass="text-amber-600"
          />
          <TopCard
            title="Verified"
            value={loading ? "..." : stats.verified}
            icon={CheckCircle2}
            iconWrapClass="border-emerald-100 bg-emerald-50 text-emerald-600"
            valueClass="text-emerald-600"
          />
          <TopCard
            title="Rejected"
            value={loading ? "..." : stats.rejected}
            icon={XCircle}
            iconWrapClass="border-rose-100 bg-rose-50 text-rose-600"
            valueClass="text-rose-600"
          />
        </section>

        <section className="relative flex flex-1 flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
          <div className="pointer-events-none absolute -top-10 right-10 h-48 w-48 rounded-full bg-sky-100/60 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-indigo-50 blur-3xl" />

          <div className="relative z-10 border-b border-slate-200 px-4 py-4 md:px-6">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center">
                <div className="relative min-w-0 flex-1 max-w-2xl">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search by consultant name..."
                    className="h-11 md:h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-[13px] md:text-[14px] font-medium text-slate-900 outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-100 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFiltersOpen(true)}
                  className="inline-flex cursor-pointer h-11 md:h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 md:px-5 text-[13px] font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
                  type="button"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden md:inline">Filters</span>
                  {activeFilters && (
                    <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-900 px-1.5 text-[10px] font-black text-white">
                      {[tierId !== "ALL", cityId !== "ALL"].filter(Boolean).length}
                    </span>
                  )}
                </button>

                <button
                  onClick={handleRefresh}
                  className="inline-flex cursor-pointer h-11 md:h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-[13px] font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
                  type="button"
                >
                  {refreshing ? (
                    <Loader2 className="h-4 w-4 animate-spin text-sky-500" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {error ? (
            <div className="border-b border-slate-200 bg-rose-50/70 px-6 py-4 text-sm font-semibold text-rose-700">
              {error}
            </div>
          ) : null}

          <div className="relative z-10 flex-1 overflow-auto">
            <div className="table-scroll h-full w-full overflow-auto">
              <table className="min-w-[1600px] w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-slate-50/80 backdrop-blur-sm">
                    <th className="border-b border-r border-slate-200/60 px-6 py-4.5 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90">
                      Consultant
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90">
                      Mode Type
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90">
                      Email
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90">
                      Phone
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90">
                      City
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90">
                      Tier
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90">
                      Status
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90">
                      Submitted At
                    </th>
                    <th className="border-b border-slate-200 px-6 py-4.5 text-right text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-24 text-center">
                        <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading approvals...
                        </div>
                      </td>
                    </tr>
                  ) : rows.length > 0 ? (
                    rows.map((item, index) => (
                      <tr
                        key={item?.storeDraftId || index}
                        className={cls(
                          "group transition-colors duration-200 hover:bg-sky-50/45",
                          index % 2 === 0 ? "bg-white" : "bg-slate-50/35"
                        )}
                      >
                        <td className="border-b border-slate-100 px-6 py-4.5 align-middle">
                          <div className="flex min-w-[280px] items-center gap-4">
                            <ConsultantLogo
                              src={item?.logoUrl}
                              alt={item?.consultationName || "Consultant"}
                            />
                            <div className="min-w-0">
                              <div className="truncate text-[14px] font-bold text-slate-900 transition-colors group-hover:text-sky-700">
                                {safeText(item?.consultationName)}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                          <span
                            className={cls(
                              "inline-flex rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.03em] whitespace-nowrap",
                              modeTypeBadge(item?.modeType)
                            )}
                          >
                            {safeText(item?.modeType)}
                          </span>
                        </td>

                        <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                          <div className="inline-flex items-center justify-center gap-2 text-[12px] font-medium text-slate-600">
                            <Mail className="h-3 w-3 text-slate-400" />
                            <span className="truncate max-w-[180px]">{safeText(item?.companyEmail)}</span>
                          </div>
                        </td>

                        <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                          <div className="inline-flex items-center justify-center gap-2 text-[12px] font-medium text-slate-600">
                            <Phone className="h-3 w-3 text-slate-400" />
                            <span>{safeText(item?.phoneNumber)}</span>
                          </div>
                        </td>

                        <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                          <div className="text-[13px] font-medium text-slate-600">
                            {safeText(item?.cityName)}
                          </div>
                        </td>

                        <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                          <span
                            className={cls(
                              "inline-flex rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.03em] whitespace-nowrap",
                              tierBadge(item?.tierPlanTitle)
                            )}
                          >
                            {safeText(item?.tierPlanTitle)}
                          </span>
                        </td>

                        <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                          <span
                            className={cls(
                              "inline-flex rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.03em] whitespace-nowrap",
                              verificationBadge(item?.verificationStatus)
                            )}
                          >
                            {safeText(item?.verificationStatus)}
                          </span>
                        </td>

                        <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                          <div className="text-[12.5px] font-semibold text-slate-700 whitespace-nowrap">
                            {formatDateTime(item?.submittedAt)}
                          </div>
                        </td>

                        <td className="border-b border-slate-100 px-6 py-4.5 text-right align-middle">
                          <RowActions
                            onView={() => handleViewDetails(item)}
                            onApprove={() => handleApprove(item)}
                            onReject={() => handleReject(item)}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="px-6 py-28 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-400">
                            <ShieldAlert size={28} />
                          </div>
                          <div className="text-lg font-bold tracking-tight text-slate-900">
                            No storefront approvals found
                          </div>
                          <div className="mx-auto mt-1 max-w-sm text-[14px] text-slate-500">
                            Try adjusting your filters to see more results.
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="relative z-10 flex shrink-0 flex-col gap-3 border-t border-slate-200 bg-white px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-slate-500">
              Page <span className="font-semibold text-slate-900">{page}</span> /{" "}
              <span className="font-semibold text-slate-900">{totalPages}</span>
              <span className="ml-2">• {totalCount} total records</span>
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
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
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
              onClick={() => setFiltersOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.aside
              initial={{ x: 420, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 420, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-[440px] flex-col border-l border-slate-200 bg-white shadow-2xl"
            >
              <div className="shrink-0 border-b border-slate-200 bg-gradient-to-br from-slate-50 via-white to-sky-50/30 px-6 py-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/20">
                        <SlidersHorizontal className="h-5 w-5" />
                      </div>
                      <h3 className="text-2xl font-black tracking-tight text-slate-900">
                        Filters
                      </h3>
                    </div>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      Refine storefront approval results
                    </p>
                  </div>

                  <button
                    onClick={() => setFiltersOpen(false)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 active:scale-95"
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 space-y-5 overflow-y-auto p-6 bg-slate-50/30">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Location</h4>
                  </div>
                  <div className="space-y-4">
                    <SearchableCombobox
                      label="City"
                      value={draftCityId}
                      onChange={(val) => setDraftCityId(val)}
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

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                  <div className="mb-4 flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-slate-400" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Consultant Details</h4>
                  </div>

                  <SearchableCombobox
                    label="Tier Plan"
                    value={draftTierId}
                    onChange={(val) => setDraftTierId(val)}
                    query={tierQuery}
                    setQuery={setTierQuery}
                    open={tierDropdownOpen}
                    setOpen={setTierDropdownOpen}
                    options={filteredTierPlans}
                    allOptions={tierPlans}
                    loading={tierLoading}
                    placeholder="All Tiers"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-gradient-to-br from-slate-50 via-white to-sky-50/30 px-6 py-5 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
                <button
                  onClick={clearAll}
                  className="flex-1 rounded-xl border-2 border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
                  type="button"
                >
                  Clear All
                </button>
                <button
                  onClick={applyFilters}
                  className="flex-1 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/30 active:scale-95"
                  type="button"
                >
                  Apply Filters
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StorefrontApprovals;
