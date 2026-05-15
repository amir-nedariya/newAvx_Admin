import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Search,
  SlidersHorizontal,
  RefreshCw,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Flag,
  FileText,
  Eye,
  X,
  Clock3,
  CalendarDays,
  ClipboardCheck,
  Images,
  Star,
  Loader2,
} from "lucide-react";
import { getAllVehicleInspectionAssigned } from "../../../api/vehicleInspection.api";
import toast from "react-hot-toast";

const cls = (...a) => a.filter(Boolean).join(" ");

/* ======================================================
   DUMMY DATA
====================================================== */

const REPORTS = [
  {
    id: "REP-2101",
    vehicle: "Hyundai Creta SX 2021",
    vehicleThumbnailUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80",
    city: "Ahmedabad",
    inspectionType: "VIDEO CALL WITH REPORT",
    requestedByName: "Rahul Malhotra",
    requesterType: "BUYER",
    scheduledAt: "15 May 2026",
    createdAt: "12 May 2026",
    status: "SUBMITTED",
    inspectorName: "Harsh Patel",
    checklist: 92,
    media: 18,
    rating: 4.8,
    consultant: "Metro Auto Hub",
  },
  {
    id: "REP-2104",
    vehicle: "Mahindra Scorpio N Z8",
    vehicleThumbnailUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80",
    city: "Vadodara",
    inspectionType: "REPORT",
    requestedByName: "Torque Wheels",
    requesterType: "BUYER",
    scheduledAt: "18 May 2026",
    createdAt: "14 May 2026",
    status: "SUBMITTED",
    inspectorName: "Rahul Shah",
    checklist: 84,
    media: 12,
    rating: 4.6,
    consultant: "Torque Wheels",
  },
  {
    id: "REP-2102",
    vehicle: "Tata Nexon XZ+ 2022",
    vehicleThumbnailUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80",
    city: "Surat",
    inspectionType: "REPORT",
    requestedByName: "Hello hello1234",
    requesterType: "BUYER",
    scheduledAt: "15 Jun 2026",
    createdAt: "30 Apr 2026",
    status: "SUBMITTED",
    inspectorName: "Fardin Bhu_d",
    checklist: 100,
    media: 26,
    rating: 4.9,
    consultant: "City Drive",
  },
  {
    id: "REP-2103",
    vehicle: "Honda City ZX 2022",
    vehicleThumbnailUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80",
    city: "Ahmedabad",
    inspectionType: "VIDEO CALL WITH REPORT",
    requestedByName: "Elite Motors",
    requesterType: "BUYER",
    scheduledAt: "19 May 2026",
    createdAt: "10 May 2026",
    status: "SUBMITTED",
    inspectorName: "Usman Lala",
    checklist: 88,
    media: 22,
    rating: 4.7,
    consultant: "Elite Motors",
  },
];

/* ======================================================
   BADGES
====================================================== */

const typeBadge = (type) => {
  const upperType = type?.toUpperCase();
  if (upperType?.includes("VIDEO")) return "bg-indigo-50 text-indigo-700 border-indigo-200";
  if (upperType?.includes("PREMIUM")) return "bg-violet-50 text-violet-700 border-violet-200";
  return "bg-sky-50 text-sky-700 border-sky-200";
};

const requesterTypeBadge = (type) => {
  return "bg-slate-100 text-slate-600 border-slate-200";
};

const requestStatusBadge = (status) => {
  const map = {
    SUBMITTED: "bg-sky-50 text-sky-700 border-sky-200",
    APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
    FLAGGED: "bg-amber-50 text-amber-700 border-amber-200",
  };
  return map[status] || "bg-slate-100 text-slate-600 border-slate-200";
};

/* ======================================================
   SMALL COMPONENTS
====================================================== */

function TopCard({ title, value, icon: Icon }) {
  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-6 overflow-hidden shadow-sm">
      <div className="relative z-10 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[12px] font-bold uppercase tracking-[0.15em] mb-2 text-slate-400">
            {title}
          </div>
          <div className="text-3xl font-extrabold tracking-tight break-words leading-tight text-slate-900">
            {value}
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-sky-100 bg-sky-50 text-sky-600 shrink-0 transition-colors">
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

function ReportsRowActions({ item, onSelect, onApprove, onReject, onFlag }) {
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
    <div className="relative inline-flex justify-end gap-2" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 shadow-sm"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-30 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
          <button
            onClick={() => {
              onSelect(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50"
          >
            <Eye className="h-4 w-4" />
            View Details
          </button>

          <button
            onClick={() => {
              onApprove(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-emerald-700 hover:bg-emerald-50 border-t border-slate-100"
          >
            <CheckCircle2 className="h-4 w-4" />
            Approve Report
          </button>

          <button
            onClick={() => {
              onReject(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-rose-700 hover:bg-rose-50"
          >
            <XCircle className="h-4 w-4" />
            Reject Report
          </button>

          <button
            onClick={() => {
              onFlag(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-amber-700 hover:bg-amber-50 border-t border-slate-100"
          >
            <Flag className="h-4 w-4" />
            Flag for Audit
          </button>
        </div>
      )}
    </div>
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

function InfoRow({ label, value }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-slate-400">{label}</div>
      <div className="mt-1 text-[13px] font-medium text-slate-700">{value}</div>
    </div>
  );
}

/* ======================================================
   MAIN PAGE
====================================================== */

const ReportsReview = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState({
    city: "",
    type: "",
    status: "",
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalElements: 0,
    size: 10,
  });

  const handlePageChange = (page) => {
    fetchReports(page);
  };

  const uniqueCities = useMemo(
    () => [...new Set(reports.map((r) => r.city))],
    [reports]
  );

  const filtered = useMemo(() => {
    let data = [...reports];

    if (filters.city) data = data.filter((r) => r.city === filters.city);
    if (filters.type) data = data.filter((r) => r.inspectionType === filters.type);
    if (filters.status) data = data.filter((r) => r.status === filters.status);

    return data;
  }, [reports, filters]);

  const fetchReports = async (pageNo = 1) => {
    setLoading(true);
    try {
      const res = await getAllVehicleInspectionAssigned({ searchText: search.trim() || null, pageNo, status: "SUBMITTED" });
      const data = res?.data || [];
      setReports(Array.isArray(data) ? data : []);
      if (res?.pageResponse) {
        setPagination({
          currentPage: res.pageResponse.currentPage ?? pageNo,
          totalPages: res.pageResponse.totalPages ?? 1,
          totalElements: res.pageResponse.totalElements ?? data.length,
          size: res.pageResponse.pageSize ?? 10,
        });
      }
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      toast.error(err?.response?.data?.message || "Failed to load reports queue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(1);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchReports(1), 500);
    return () => clearTimeout(t);
  }, [search]);

  const formatDate = (dt) => {
    if (!dt) return "—";
    const d = new Date(dt);
    if (isNaN(d.getTime())) return "—";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatScheduledDate = (dt) => {
    if (!dt) return "—";
    const d = new Date(dt);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const summary = useMemo(
    () => ({
      submitted: pagination.totalElements,
      approved: reports.filter((r) => r.status === "APPROVED").length,
      rejected: reports.filter((r) => r.status === "REJECTED").length,
      flagged: reports.filter((r) => r.status === "FLAGGED").length,
    }),
    [reports, pagination.totalElements]
  );

  const handleClear = () => {
    setSearch("");
    setFilters({ city: "", type: "", status: "" });
    setFiltersOpen(false);
  };

  const handleRefresh = () => {
    fetchReports(pagination.currentPage);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      <style>{`
        .table-scroll::-webkit-scrollbar { height: 6px; width: 6px; }
        .table-scroll::-webkit-scrollbar-track { background: transparent; }
        .table-scroll::-webkit-scrollbar-thumb { background: rgba(148,163,184,0.35); border-radius: 6px; }
        .table-scroll::-webkit-scrollbar-thumb:hover { background: rgba(100,116,139,0.45); }
      `}</style>

      {/* HEADER BAR */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-4 relative z-20 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Reports Review</h1>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-500">
              Validate submitted inspection reports, review quality, and ensure accuracy before approval.
            </p>
          </div>
        </div>
      </div>

      {/* KPI STRIP */}
      <div className="flex-shrink-0 px-6 py-5 bg-slate-50">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-4">
          <TopCard title="Submitted" value={summary.submitted} icon={FileText} />
          <TopCard title="Approved" value={summary.approved} icon={CheckCircle2} />
          <TopCard title="Rejected" value={summary.rejected} icon={XCircle} />
          <TopCard title="Flagged" value={summary.flagged} icon={Flag} />
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-hidden px-6 pb-6 flex flex-col">
        {/* Reports Queue */}
        <section className="flex-1 min-0 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden relative flex flex-col">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-50/50 blur-[100px] pointer-events-none" />

          {/* Filter Bar */}
          <div className="p-5 md:p-6 relative z-10 border-b border-slate-200 flex-shrink-0">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="relative flex-1 max-w-2xl">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search report, vehicle, inspector, consultant..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-[14px] text-slate-900 outline-none transition-all focus:border-sky-400 placeholder:text-slate-400 shadow-sm"
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setFiltersOpen((p) => !p)}
                  className={cls(
                    "inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-[13px] font-semibold transition-colors",
                    filtersOpen ? "bg-sky-600 text-white border-sky-600" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-sm"
                  )}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </button>
              </div>
            </div>

            {filtersOpen && (
              <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-200 pt-5 md:grid-cols-4">
                <div className="flex items-center justify-between col-span-full mb-2">
                  <h4 className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">
                    Advanced Filters
                  </h4>
                  <button onClick={handleClear} className="text-[12px] text-sky-700 hover:text-sky-800 transition-colors">
                    Clear All Filters
                  </button>
                </div>

                <select
                  value={filters.city}
                  onChange={(e) => setFilters((p) => ({ ...p, city: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">City</option>
                  {uniqueCities.map((city) => <option key={city}>{city}</option>)}
                </select>

                <select
                  value={filters.type}
                  onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">Inspection Type</option>
                  <option>BASIC</option>
                  <option>PREMIUM</option>
                  <option>VIDEO CALL WITH REPORT</option>
                </select>

                <select
                  value={filters.status}
                  onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                >
                  <option value="">Status</option>
                  <option>SUBMITTED</option>
                  <option>APPROVED</option>
                  <option>REJECTED</option>
                  <option>FLAGGED</option>
                </select>
              </div>
            )}
          </div>

          {/* TABLE CONTAINER */}
          <div className="flex-1 w-full overflow-auto table-scroll relative z-10">
            <table className="min-w-[1450px] w-full border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-20">
                <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Vehicle</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Requester Name</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Requester Type</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Inspection Type</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Status</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Scheduled</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Created</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Inspector</th>
                  <th className="px-6 py-4 text-right font-semibold whitespace-nowrap">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-28 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Loader2 className="h-12 w-12 text-sky-600 animate-spin mb-4" />
                        <div className="text-lg font-bold text-slate-900">Loading reports...</div>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length ? (
                  filtered.map((row) => (
                    <tr key={row.assignmentId || row.id} className="transition-colors duration-200 hover:bg-slate-50 group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={row.vehicleThumbnailUrl || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80"}
                            alt=""
                            className="w-10 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                          <div className="text-[13px] font-bold text-slate-900 leading-tight">
                            {row.vehicleName || row.vehicle}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-[13px] font-medium text-slate-700">{row.requestedUserName || row.requestedByName}</td>

                      <td className="px-5 py-4">
                        <span className={cls("inline-flex rounded-md px-2.5 py-1 text-[10px] font-bold border uppercase", requesterTypeBadge(row.requesterType))}>
                          {row.requesterType}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className={cls("inline-flex rounded-md px-2.5 py-1 text-[10px] font-bold border uppercase", typeBadge(row.inspectionType))}>
                          {row.inspectionType}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className={cls("inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-bold border uppercase", requestStatusBadge(row.assignmentStatus || row.inspectionRequestStatus || row.status))}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {row.assignmentStatus || row.inspectionRequestStatus || row.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-[13px] font-medium text-slate-500 whitespace-nowrap">
                        {formatScheduledDate(row.videoCallScheduledAt || row.scheduledAt)}
                      </td>

                      <td className="px-5 py-4 text-[13px] font-medium text-slate-400 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock3 className="h-3.5 w-3.5" />
                          {formatDate(row.createdAt)}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        {row.inspectorUsername || row.inspectorName ? (
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 text-[11px] font-bold">
                              {(row.inspectorUsername || row.inspectorName)[0]}
                            </div>
                            <span className="text-[13px] font-semibold text-slate-700">
                              {row.inspectorUsername || row.inspectorName}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[12px] text-slate-400 font-medium italic">Unassigned</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <ReportsRowActions
                          item={row}
                          onSelect={setSelected}
                          onApprove={() => console.log("Approved")}
                          onReject={() => console.log("Rejected")}
                          onFlag={() => console.log("Flagged")}
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
                          No reports found
                        </div>
                        <div className="mt-1 text-[14px] text-slate-500 max-w-sm mx-auto">
                          Try adjusting your search criteria or clear active filters.
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between flex-shrink-0 bg-white relative z-20">
            <div className="text-[13px] text-slate-600 font-medium">
              Page {pagination.currentPage} of {pagination.totalPages} • {pagination.totalElements} total records
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                Prev
              </button>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* DRAWER */}
      {selected && (
        <>
          <div
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />

          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-[520px] border-l border-slate-200 bg-white shadow-2xl flex flex-col">
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 bg-slate-50">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{selected.id}</h3>
                <p className="mt-1 text-sm text-slate-500">{selected.vehicleName || selected.vehicle}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className={cls("inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold border uppercase", requestStatusBadge(selected.inspectionRequestStatus || selected.status))}>
                    {selected.inspectionRequestStatus || selected.status}
                  </span>
                  <span className={cls("inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold border uppercase", typeBadge(selected.inspectionType))}>
                    {selected.inspectionType}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 gap-3">
                <StatCard label="Checklist Score" value={`${selected.checklist}%`} icon={ClipboardCheck} />
                <StatCard label="Media Count" value={selected.media} icon={Images} />
                <StatCard label="Inspector Rating" value={selected.rating} icon={Star} />
                <StatCard label="Scheduled" value={selected.scheduledAt} icon={CalendarDays} />
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
                <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
                  Report Details
                </h4>

                <div className="mt-4 space-y-4">
                  <InfoRow label="Vehicle" value={selected.vehicleName || selected.vehicle} />
                  <InfoRow label="Inspector" value={selected.inspectorUsername || selected.inspectorName} />
                  <InfoRow label="Consultant" value={selected.consultant || "—"} />
                  <InfoRow label="Inspection Type" value={selected.inspectionType} />
                  <InfoRow label="Scheduled Date" value={formatScheduledDate(selected.videoCallScheduledAt || selected.scheduledAt)} />
                  <InfoRow label="City" value={selected.city || "—"} />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-[13px] font-semibold text-white hover:bg-emerald-700 transition-all active:scale-95 shadow-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  Approve Report
                </button>

                <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-[13px] font-semibold text-white hover:bg-rose-700 transition-all active:scale-95 shadow-sm">
                  <XCircle className="h-4 w-4" />
                  Reject Report
                </button>

                <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] font-semibold text-amber-700 hover:bg-amber-100 transition-all active:scale-95 shadow-sm">
                  <Flag className="h-4 w-4" />
                  Flag for Audit
                </button>

                <button
                  onClick={() => setSelected(null)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportsReview;