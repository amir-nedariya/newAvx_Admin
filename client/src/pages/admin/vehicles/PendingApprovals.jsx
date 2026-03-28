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
  ArrowLeft
} from "lucide-react";

import PendingApprovalsFilterBar from "./pending-approvals/PendingApprovalsFilterBar";
import PendingApprovalRowActions from "./pending-approvals/PendingApprovalRowActions";
import PendingApprovalsReviewPanel from "./pending-approvals/PendingApprovalsReviewPanel";
import PendingApprovalsConfirmModal from "./pending-approvals/PendingApprovalsConfirmModal";
import PendingApprovalAlerts from "./pending-approvals/PendingApprovalAlerts";

import {
  filterPendingApprovals,
  normalizePendingApprovalsResponse,
} from "../../../api/pendingApprovals.api";

const cls = (...a) => a.filter(Boolean).join(" ");
const PAGE_SIZE = 10;

const TIER_OPTIONS = [
  { label: "Basic", value: "BASIC" },
  { label: "Pro", value: "PRO" },
  { label: "Premium", value: "PREMIUM" },
];

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

const formatHours = (h) => {
  if (h < 1) return `${Math.max(1, Math.round(h * 60))}m`;
  return `${h.toFixed(1)}h`;
};

const getSlaBadge = (submittedAtHours, slaHours) => {
  if (submittedAtHours < 3) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (submittedAtHours <= slaHours) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-rose-50 text-rose-700 border-rose-200 animate-pulse";
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

  return {
    id: item?.vehicleId || "-",
    thumb: item?.thumbnailUrl || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=60",
    title: title || "-",
    consultant: item?.consultantName || item?.consultantUsername || "-",
    tier: item?.tierPlanTitle || "-",
    submissionType: item?.submissionType || "-",
    inspection: item?.inspectionStatus || "NOT_INSPECTED",
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

export default function PendingApprovals() {
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

  const searchDebounceRef = useRef(null);
  const firstLoadRef = useRef(true);

  /* =========================================================
     FETCH
  ========================================================= */
  const fetchPendingApprovals = async (pageNo, filters, searchText = search) => {
    try {
      setLoading(true);
      setError("");

      const payload = await filterPendingApprovals({
        searchText: searchText?.trim() ? searchText.trim() : null,
        submissionType: filters.submissionType || null,
        riskLevel: filters.risk || null,
        tierPlanId: filters.tierPlanId || null,
        inspectionStatus: filters.inspection || null,
        cityId: filters.cityId || null,
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
  };

  const handleApplyFilterValues = () => {
    setPage(1);
    setAppliedFilters({ ...draftFilters });
    setFiltersOpen(false);
  };

  const handleAlertFilter = (id) => {
    setDraftFilters(prev => ({ ...prev, alertFilter: id }));
    setAppliedFilters(prev => ({ ...prev, alertFilter: id }));
    setPage(1);
  };

  // Approval Flows
  const handleApprove = (item) => {
    console.log("Approving:", item);
    setRows(prev => prev.filter(r => r.id !== item.id));
    setModal(null);
    setReviewItem(null);
  };

  const handleReject = (item) => {
    console.log("Rejecting:", item);
    setRows(prev => prev.filter(r => r.id !== item.id));
    setModal(null);
    setReviewItem(null);
  };

  // If reviewItem is set, we show the review panel instead of the table list
  if (reviewItem) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
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
          onRequestChanges={() => setModal(null)}
          onEscalate={() => setModal(null)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-0 animate-in fade-in duration-500">
      <style>{`
        .table-scroll::-webkit-scrollbar { height: 6px; }
        .table-scroll::-webkit-scrollbar-track { background: transparent; }
        .table-scroll::-webkit-scrollbar-thumb {
          background: rgba(148,163,184,0.35);
          border-radius: 999px;
        }
        .table-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(100,116,139,0.45);
        }
      `}</style>

      <div className="mx-auto space-y-8">
        {/* HEADER & METRICS */}
        <section className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              Pending Approvals
            </h1>
          </div>

                  </section>

       
        {/* FILTER BAR */}
        <PendingApprovalsFilterBar
          search={search}
          setSearch={setSearch}
          filters={{
            submissionType: draftFilters.submissionType,
            risk: draftFilters.risk,
            tier: draftFilters.tierPlanId,
            inspection: draftFilters.inspection,
            city: draftFilters.cityId,
            alertFilter: draftFilters.alertFilter,
            submittedAfter: draftFilters.submittedAfter,
            submittedBefore: draftFilters.submittedBefore,
          }}
          setFilters={(updater) => {
            setDraftFilters((prev) => {
              const next = typeof updater === "function" ? updater(prev) : updater;
              return { ...prev, ...next };
            });
          }}
          filtersOpen={filtersOpen}
          setFiltersOpen={setFiltersOpen}
          onRefresh={handleRefresh}
          onClear={handleClear}
          onApplyFilters={handleApplyFilterValues}
          tierOptions={TIER_OPTIONS}
        />

        {/* PRIORITY ALERTS STRIP */}
        <PendingApprovalAlerts 
           highRiskCount={stats.highRisk}
           priceDeviationCount={3} // Mock or from stats
           duplicateCount={2}      // Mock
           expeditedCount={stats.premium}
           activeFilter={appliedFilters.alertFilter}
           onFilterChange={handleAlertFilter}
        />

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700 flex items-center gap-3 shadow-sm shadow-rose-100">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* TABLE SECTION */}
        <section className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl shadow-slate-200/40">
          <div className="z-10 border-b border-slate-100 bg-slate-50/50 p-6 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Approval Queue
                </h2>
                <p className="mt-1 text-[13px] font-medium text-slate-500">
                  Manage marketplace entry and fraud prevention
                </p>
              </div>

              <div className="flex items-center gap-3">
                 <div className="hidden items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-500 shadow-sm ring-1 ring-slate-200 sm:flex">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    LIVE UPDATES
                 </div>
                 <div className="text-sm font-bold text-slate-400">
                    <span className="text-slate-900">{page}</span> / {serverTotalPages}
                 </div>
              </div>
            </div>
          </div>

          <div className="table-scroll relative w-full overflow-x-auto">
            <table className="min-w-[1560px] w-full border-collapse">
              <thead className="bg-slate-50/30">
                <tr className="text-left text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                  <th className="px-8 py-5">Vehicle ID</th>
                  <th className="px-4 py-5">Thumbnail</th>
                  <th className="px-4 py-5">Title</th>
                  <th className="px-4 py-5">Consultant</th>
                  <th className="px-4 py-5">Tier</th>
                  <th className="px-4 py-5 text-center">Submission</th>
                  <th className="px-4 py-5 text-center">Inspection</th>
                  <th className="px-4 py-5 text-center">Risk</th>
                  <th className="px-4 py-5">Submitted</th>
                  <th className="px-4 py-5">SLA Timer</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={11} className="px-6 py-32 text-center">
                      <div className="inline-flex flex-col items-center gap-3">
                        <Loader2 className="h-10 w-10 animate-spin text-sky-600" />
                        <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Synchronizing Queue...</span>
                      </div>
                    </td>
                  </tr>
                ) : rows.length ? (
                  rows.map((row) => (
                    <tr
                      key={row.id}
                      className={cls(
                        "group transition-all duration-300 hover:bg-slate-50/80",
                        reviewItem?.id === row.id && "bg-sky-50 shadow-inner"
                      )}
                    >
                      <td className="px-8 py-5">
                        <div>
                          <div className="text-[14px] font-black text-slate-900 group-hover:text-sky-700 transition-colors">
                            {row.id}
                          </div>
                          <div className="mt-0.5 text-[11px] font-bold text-slate-400 font-mono">
                            {row.registrationNo}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-5">
                        <div className="h-16 w-16 overflow-hidden rounded-2xl border-2 border-white bg-slate-100 shadow-md ring-1 ring-slate-100 group-hover:scale-105 transition-transform">
                          <img
                            src={row.thumb}
                            alt={row.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </td>

                      <td className="px-4 py-5">
                        <div className="min-w-[200px]">
                          <div className="text-[14px] font-bold text-slate-900 line-clamp-1">
                            {row.title}
                          </div>
                          <div className="mt-1 text-[12px] font-medium text-slate-400">
                            {row.city}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-5">
                        <div className="text-[13px] font-bold text-slate-700">
                          {row.consultant}
                        </div>
                      </td>

                      <td className="px-4 py-5">
                        <span className={cls("inline-flex rounded-lg border px-2.5 py-1 text-[10px] font-black uppercase tracking-tight", tierBadge(row.tier))}>
                          {row.tier}
                        </span>
                      </td>

                      <td className="px-4 py-5 text-center">
                        <span className="text-[12px] font-bold text-slate-600">
                          {row.submissionType}
                        </span>
                      </td>

                      <td className="px-4 py-5 text-center">
                        <span className={cls("inline-flex rounded-lg border px-2.5 py-1 text-[10px] font-black uppercase tracking-tight", inspectionBadge(row.inspection))}>
                          {row.inspection}
                        </span>
                      </td>

                      <td className="px-4 py-5 text-center">
                        <span className={cls("inline-flex rounded-lg border px-2.5 py-1 text-[10px] font-black uppercase tracking-tight", riskBadge(row.risk))}>
                          {row.risk}
                        </span>
                      </td>

                      <td className="px-4 py-5">
                         <div className="flex items-center gap-2 text-[13px] font-bold text-slate-500 whitespace-nowrap">
                            {formatHours(row.submittedAtHours)} ago
                         </div>
                      </td>

                      <td className="px-4 py-5">
                        <span className={cls("inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-[10px] font-black uppercase tracking-tight shadow-sm", getSlaBadge(row.submittedAtHours, row.slaHours))}>
                          <Clock3 size={11} />
                          {formatHours(row.submittedAtHours)} / {row.slaHours}h
                        </span>
                      </td>

                      <td className="px-8 py-5 text-right">
                        <PendingApprovalRowActions
                          item={row}
                          canQuickApprove={canQuickApprove(row)}
                          onReview={(item) => setReviewItem(item)}
                          onQuickApprove={(item) => setModal({ type: "approve", item })}
                          onReject={(item) => setModal({ type: "reject", item })}
                          onRequestChanges={(item) => setModal({ type: "changes", item })}
                          onEscalate={(item) => setModal({ type: "escalate", item })}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="px-6 py-40 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-[32px] border-2 border-dashed border-slate-200 bg-slate-50 text-slate-300">
                          <FileSearch size={40} />
                        </div>
                        <div className="text-2xl font-black tracking-tight text-slate-900">
                          No pending submissions
                        </div>
                        <div className="mx-auto mt-2 max-w-sm text-[15px] font-medium text-slate-400">
                          The queue is all clear! All current vehicle submissions have been processed.
                        </div>
                        <button
                          onClick={handleClear}
                          className="mt-8 rounded-2xl bg-slate-900 px-8 py-3 text-sm font-bold text-white shadow-xl shadow-slate-900/20 transition-all hover:bg-slate-800 active:scale-95"
                        >
                          Refresh Queue
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex items-center justify-between gap-6 border-t border-slate-100 bg-white px-8 py-6">
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

      <PendingApprovalsConfirmModal
        modal={modal}
        onClose={() => setModal(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        onRequestChanges={() => setModal(null)}
        onEscalate={() => setModal(null)}
      />
    </div>
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
