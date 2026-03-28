import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  Search,
  RefreshCw,
  MoreHorizontal,
  Eye,
  X,
  User,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Clock3,
  BadgeCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  filterConsultations,
  mapConsultationToRow,
  getConsultationKpi,
} from "../../../api/consultationApi";

/* =========================================================
   HELPERS
========================================================= */
const cls = (...a) => a.filter(Boolean).join(" ");

const safeErrorMessage = (err) => {
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.response?.data?.error) return err.response.data.error;
  if (err?.message?.toLowerCase().includes("network")) {
    return "Network error. Please check your internet connection.";
  }
  if (err?.code === "ERR_NETWORK") {
    return "Network error. Please check your internet connection.";
  }
  return "Something went wrong while loading pending approvals.";
};

/* =========================================================
   BADGES
========================================================= */
const statusBadge = (status) => {
  const s = String(status || "").toUpperCase();

  const map = {
    ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
    INACTIVE: "bg-slate-100 text-slate-700 border-slate-200",
    DELETED: "bg-rose-50 text-rose-700 border-rose-200",

    REQUESTED: "bg-amber-50 text-amber-700 border-amber-200",
    REQUEST_CHANGES: "bg-orange-50 text-orange-700 border-orange-200",
    VERIFIED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return map[s] || "bg-slate-50 text-slate-700 border-slate-200";
};

const tierBadge = (tierTitle) => {
  const t = String(tierTitle || "").toLowerCase();

  if (t.includes("premium")) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  if (t.includes("pro")) {
    return "bg-sky-50 text-sky-700 border-sky-200";
  }
  return "bg-slate-100 text-slate-700 border-slate-200";
};

/* =========================================================
   TOP CARDS
========================================================= */
function TopCard({ title, value, icon: Icon = User }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-transparent opacity-70" />
      <div className="relative z-10 flex items-end justify-between">
        <div>
          <div className="mb-2 text-[12px] font-bold uppercase tracking-[0.15em] text-slate-400">
            {title}
          </div>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900">
            {value}
          </div>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-sky-100 bg-sky-50 text-sky-600">
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ROW ACTIONS
========================================================= */
function RowActions({ item }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const go = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <div className="relative inline-flex justify-end" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
        type="button"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-30 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
          <button
            onClick={() => go(`/admin/consultants/profile/${item.id}`)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-50"
            type="button"
          >
            <Eye className="h-4 w-4 text-slate-500" />
            View Profile
          </button>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   PAGINATION
========================================================= */
function PaginationBar({ page, totalPages, totalCount, loading, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex justify-end">
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
        <span className="text-sm text-slate-500">{totalCount} total</span>

        <button
          disabled={page <= 1 || loading}
          onClick={() => onPageChange(page - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 transition hover:bg-slate-200 disabled:opacity-40"
          type="button"
        >
          <ChevronLeft size={16} />
        </button>

        <span className="text-sm text-slate-500">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page >= totalPages || loading}
          onClick={() => onPageChange(page + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 transition hover:bg-slate-200 disabled:opacity-40"
          type="button"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN
========================================================= */
const Pendingapprovals = () => {
  const didInit = useRef(false);
  const lastFetchKeyRef = useRef("");
  const searchDebounceRef = useRef(null);

  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [kpiLoading, setKpiLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [kpi, setKpi] = useState({
    totalPendingConsultations: 0,
    totalRequestedConsultations: 0,
    totalActiveConsultations: 0,
    totalUnderReviewConsultations: 0,
  });

  const loadKpi = useCallback(async () => {
    setKpiLoading(true);

    try {
      const res = await getConsultationKpi();
      const data = res?.data?.data || res?.data || {};

      setKpi({
        totalPendingConsultations: Number(data?.totalPendingConsultations ?? 0),
        totalRequestedConsultations: Number(data?.totalRequestedConsultations ?? 0),
        totalActiveConsultations: Number(data?.totalActiveConsultations ?? 0),
        totalUnderReviewConsultations: Number(
          data?.totalUnderReviewConsultations ?? 0
        ),
      });
    } catch (e) {
      console.error("KPI load failed:", e);
      setKpi({
        totalPendingConsultations: 0,
        totalRequestedConsultations: 0,
        totalActiveConsultations: 0,
        totalUnderReviewConsultations: 0,
      });
    } finally {
      setKpiLoading(false);
    }
  }, []);

  const buildPayload = useCallback(
    ({ nextPage = 1, nextSearch = "" }) => ({
      searchText: nextSearch?.trim() || null,
      verificationStatus: "REQUESTED",
      pageNo: nextPage,
      pageSize,
      sortBy: null,
      sortDirection: "DESC",
    }),
    []
  );

  const fetchList = useCallback(
    async ({ nextPage = 1, nextSearch = "", silent = false, force = false }) => {
      const payload = buildPayload({ nextPage, nextSearch });
      const requestKey = JSON.stringify(payload);

      if (!force && lastFetchKeyRef.current === requestKey) {
        return;
      }

      lastFetchKeyRef.current = requestKey;
      setLoading(true);
      setError("");

      try {
        const res = await filterConsultations(payload);

        const list = Array.isArray(res?.data) ? res.data : [];
        const mapped = list.map(mapConsultationToRow);

        setRows(mapped);

        const pr = res?.pageResponse || {};
        const serverTotal =
          Number(pr?.totalElements ?? mapped.length) || mapped.length;
        const serverTotalPages =
          Number(pr?.totalPages ?? Math.max(1, Math.ceil(serverTotal / pageSize))) || 1;
        const serverCurrentPage = Number(pr?.currentPage ?? nextPage) || nextPage;

        setTotalCount(serverTotal);
        setTotalPages(serverTotalPages);
        setPage(serverCurrentPage);
      } catch (e) {
        console.error(e);
        const message = safeErrorMessage(e);

        setError(message);
        setRows([]);
        setTotalCount(0);
        setTotalPages(1);
        setPage(1);

        if (!silent) toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [buildPayload]
  );

  const queryState = useMemo(
    () => ({
      nextPage: page,
      nextSearch: search,
    }),
    [page, search]
  );

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    loadKpi();
    fetchList({
      nextPage: 1,
      nextSearch: "",
      silent: false,
      force: true,
    });
  }, [fetchList, loadKpi]);

  useEffect(() => {
    if (!didInit.current) return;

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    const isSearching = search.trim().length > 0;

    if (isSearching) {
      searchDebounceRef.current = setTimeout(() => {
        fetchList({
          ...queryState,
          silent: true,
        });
      }, 450);
    } else {
      fetchList({
        ...queryState,
        silent: true,
      });
    }

    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [queryState, search, fetchList]);

  useEffect(() => {
    if (!didInit.current) return;

    if (page !== 1) {
      setPage(1);
    }
  }, [search]);

  const handleRefresh = async () => {
    lastFetchKeyRef.current = "";

    await Promise.all([
      loadKpi(),
      fetchList({
        nextPage: page,
        nextSearch: search,
        silent: false,
        force: true,
      }),
    ]);

    toast.success("Pending approvals refreshed");
  };

  const stats = useMemo(() => {
    return {
      total:
        kpi.totalPendingConsultations || totalCount || rows.length,
      requested:
        kpi.totalRequestedConsultations ||
        rows.filter(
          (r) => String(r.verificationStatus || "").toUpperCase() === "REQUESTED"
        ).length,
      active:
        kpi.totalActiveConsultations ||
        rows.filter((r) => String(r.status || "").toUpperCase() === "ACTIVE").length,
      underReview:
        kpi.totalUnderReviewConsultations ||
        rows.filter((r) =>
          ["REQUESTED", "REQUEST_CHANGES"].includes(
            String(r.verificationStatus || "").toUpperCase()
          )
        ).length,
    };
  }, [kpi, rows, totalCount]);

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
        .table-scroll::-webkit-scrollbar { height: 6px; }
        .table-scroll::-webkit-scrollbar-track { background: transparent; }
        .table-scroll::-webkit-scrollbar-thumb {
          background: rgba(148,163,184,0.35);
          border-radius: 6px;
        }
        .table-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(100,116,139,0.45);
        }
      `}</style>

      <div className="mx-auto space-y-6">
        <section className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900">
              Pending Approvals
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-500">
              Review consultants waiting for approval and manage their
              verification decisions from one place.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <TopCard
            title="Total Pending"
            value={kpiLoading ? "..." : stats.total}
            icon={Clock3}
          />
          <TopCard
            title="Requested"
            value={kpiLoading ? "..." : stats.requested}
            icon={ShieldAlert}
          />
          <TopCard
            title="Active Profiles"
            value={kpiLoading ? "..." : stats.active}
            icon={BadgeCheck}
          />
          <TopCard
            title="Under Review"
            value={kpiLoading ? "..." : stats.underReview}
            icon={User}
          />
        </section>

        <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 bg-sky-100 blur-[100px]" />

          <div className="relative z-10 border-b border-slate-200 p-5 md:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="relative max-w-2xl flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search pending consultant..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-11 text-[14px] text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-sky-400"
                />

                {search ? (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  >
                    <X size={14} />
                  </button>
                ) : null}
              </div>

              <button
                onClick={handleRefresh}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
                title="Refresh List"
                type="button"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {error ? (
            <div className="relative z-10 px-6 pt-5">
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] font-medium text-rose-700">
                {error}
              </div>
            </div>
          ) : null}

          <div className="table-scroll relative z-10 w-full overflow-x-auto pb-4">
            <table className="min-w-[1000px] w-full border-collapse">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                  <th className="whitespace-nowrap px-6 py-4 font-semibold">Consultant</th>
                  <th className="whitespace-nowrap px-5 py-4 font-semibold">Tier</th>
                  <th className="whitespace-nowrap px-5 py-4 font-semibold">City</th>
                  <th className="whitespace-nowrap px-5 py-4 font-semibold">Status</th>
                  <th className="whitespace-nowrap px-5 py-4 font-semibold">Verification</th>
                  <th className="whitespace-nowrap px-6 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-28 text-center">
                      <div className="text-[14px] font-medium text-slate-500">
                        Loading pending approvals...
                      </div>
                    </td>
                  </tr>
                ) : rows.length ? (
                  rows.map((row, idx) => (
                    <motion.tr
                      key={row.id || idx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group transition-colors duration-200 hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                            {row.logoURL ? (
                              <img
                                src={row.logoURL}
                                alt={row.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-xs font-bold text-slate-500">
                                {(row.name || "C").charAt(0)}
                              </span>
                            )}
                          </div>

                          <div>
                            <div className="text-[14px] font-bold text-slate-900 transition-colors group-hover:text-sky-700">
                              {row.name || "-"}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={cls(
                            "inline-flex whitespace-nowrap rounded-md border px-2.5 py-1 text-[11px] font-bold",
                            tierBadge(row.tierTitle)
                          )}
                        >
                          {row.tierTitle || "Basic"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-[13px] font-medium text-slate-600">
                        {row.city || "-"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={cls(
                            "inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2.5 py-1 text-[11px] font-bold",
                            statusBadge(row.status)
                          )}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
                          {String(row.status || "UNKNOWN").replaceAll("_", " ")}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={cls(
                            "inline-flex whitespace-nowrap rounded-md border px-2.5 py-1 text-[11px] font-bold",
                            statusBadge(row.verificationStatus)
                          )}
                        >
                          {String(row.verificationStatus || "N/A").replaceAll("_", " ")}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <RowActions item={row} />
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-28 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-400">
                          <Search size={28} />
                        </div>

                        <div className="text-lg font-bold tracking-tight text-slate-900">
                          No pending approvals found
                        </div>

                        <div className="mx-auto mt-1 max-w-sm text-[14px] text-slate-500">
                          Try adjusting your search or refresh the list to load
                          the latest pending consultants.
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <PaginationBar
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          loading={loading}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default Pendingapprovals;