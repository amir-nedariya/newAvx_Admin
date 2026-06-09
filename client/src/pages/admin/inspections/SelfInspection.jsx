import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Search,
  RefreshCw,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Eye,
  X,
  Clock3,
  CalendarDays,
  ClipboardCheck,
  Loader2,
  ChevronDown
} from "lucide-react";
import {
  filterSelfInspections,
  approveSelfInspection,
  rejectSelfInspection,
  requestChangesSelfInspection,
  getSelfInspectionReport,
  getSelfInspectionStats
} from "../../../api/selfInspection.api";
import toast from "react-hot-toast";

const cls = (...a) => a.filter(Boolean).join(" ");



/* ======================================================
   BADGE HELPERS
====================================================== */
const verificationBadge = (status) => {
  const map = {
    REQUESTED: "bg-sky-50 text-sky-700 border-sky-200",
    VERIFIED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    REQUEST_CHANGES: "bg-amber-50 text-amber-700 border-amber-200",
    REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return map[status] || "bg-slate-100 text-slate-600 border-slate-200";
};

const submissionBadge = (isSubmitted) => {
  return isSubmitted
    ? "bg-indigo-50 text-indigo-700 border-indigo-200"
    : "bg-slate-100 text-slate-500 border-slate-200";
};

/* ======================================================
   SUB-COMPONENTS
====================================================== */
function TopCard({ title, value, icon: Icon, colorClass = "text-sky-600 border-sky-100 bg-sky-50" }) {
  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-6 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="relative z-10 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[12px] font-bold uppercase tracking-[0.15em] mb-2 text-slate-400">
            {title}
          </div>
          <div className="text-3xl font-extrabold tracking-tight break-words leading-tight text-slate-900">
            {value}
          </div>
        </div>
        <div className={cls("w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 transition-colors", colorClass)}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

function SelfInspectionRowActions({ item, onApprove, onReject, onRequestChanges, onViewReport }) {
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
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 shadow-sm cursor-pointer"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-30 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
          <button
            onClick={() => {
              onApprove(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-emerald-700 hover:bg-emerald-50 cursor-pointer"
          >
            <CheckCircle2 className="h-4 w-4" />
            Approve
          </button>

          <button
            onClick={() => {
              onReject(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-rose-700 hover:bg-rose-50 cursor-pointer"
          >
            <XCircle className="h-4 w-4" />
            Reject
          </button>

          <button
            onClick={() => {
              onRequestChanges(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-amber-700 hover:bg-amber-50 cursor-pointer border-b border-slate-100"
          >
            <AlertTriangle className="h-4 w-4" />
            Request Change
          </button>

          <button
            onClick={() => {
              onViewReport(item);
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 cursor-pointer pt-2"
          >
            <FileText className="h-4 w-4 text-slate-500" />
            View Report
          </button>
        </div>
      )}
    </div>
  );
}

/* ======================================================
   ACTION MODALS
====================================================== */
function ActionModal({ open, type, item, onClose, onConfirm }) {
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setRemarks("");
      setSubmitting(false);
    }
  }, [open]);

  if (!open || !item) return null;

  const getModalDetails = () => {
    switch (type) {
      case "APPROVE":
        return {
          title: "Approve Self Inspection",
          description: `Are you sure you want to approve self-inspection for vehicle ${item.vehicleDetail?.makerName} ${item.vehicleDetail?.modelName}?`,
          buttonText: "Approve",
          buttonColor: "bg-emerald-600 hover:bg-emerald-700 text-white",
          icon: CheckCircle2,
          iconColor: "text-emerald-600 bg-emerald-50 border-emerald-100",
        };
      case "REJECT":
        return {
          title: "Reject Self Inspection",
          description: `Provide a reason to reject self-inspection for vehicle ${item.vehicleDetail?.makerName} ${item.vehicleDetail?.modelName}.`,
          buttonText: "Reject",
          buttonColor: "bg-rose-600 hover:bg-rose-700 text-white",
          icon: XCircle,
          iconColor: "text-rose-600 bg-rose-50 border-rose-100",
        };
      case "REQUEST_CHANGE":
        return {
          title: "Request Changes",
          description: `Specify the changes required for self-inspection of vehicle ${item.vehicleDetail?.makerName} ${item.vehicleDetail?.modelName}.`,
          buttonText: "Request Changes",
          buttonColor: "bg-amber-600 hover:bg-amber-700 text-white",
          icon: AlertTriangle,
          iconColor: "text-amber-600 bg-amber-50 border-amber-100",
        };
      default:
        return {};
    }
  };

  const details = getModalDetails();
  const Icon = details.icon;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onConfirm(item.id, remarks);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-51 w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-scale-in">
        <div className="flex items-start gap-4">
          <div className={cls("w-10 h-10 rounded-xl flex items-center justify-center border shrink-0", details.iconColor)}>
            <Icon size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900 leading-6">{details.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{details.description}</p>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-2 block text-[13px] font-bold text-slate-700">Remarks / Reason</label>
            <textarea
              required
              rows={4}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              disabled={submitting}
              placeholder="Enter details here..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-slate-900 text-[13px] transition disabled:bg-slate-50 disabled:text-slate-400 placeholder:text-slate-400 shadow-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={cls("rounded-xl px-5 py-2 text-[13px] font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50 flex items-center gap-2 cursor-pointer", details.buttonColor)}
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {details.buttonText}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

/* ======================================================
   MAIN PAGE
====================================================== */
const SelfInspection = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalElements: 0,
    size: 10
  });

  // Modal actions state
  const [activeModal, setActiveModal] = useState({ open: false, type: null, item: null });

  const [stats, setStats] = useState({ requested: 0, verified: 0, requestChanges: 0, rejected: 0 });

  const fetchStats = async () => {
    try {
      const res = await getSelfInspectionStats();
      if (res && !res.error && res.data) {
        const statsData = res.data;
        setStats({
          requested: statsData.totalRequested || 0,
          verified: statsData.totalVerified || 0,
          rejected: statsData.totalRejected || 0,
          requestChanges: statsData.totalRequestChanges || 0
        });
      }
    } catch (err) {
      console.error("Failed to fetch live stats. Error details:", err);
    }
  };

  const fetchRecords = async (pageNo = 1) => {
    setLoading(true);
    try {
      const res = await filterSelfInspections({
        searchText: search.trim() || null,
        verificationStatus: filterStatus || null,
        pageNo,
        pageSize: pagination.size
      });

      const list = res?.data || [];
      setData(Array.isArray(list) ? list : []);

      if (res?.pageResponse) {
        setPagination({
          currentPage: res.pageResponse.currentPage || pageNo,
          totalPages: res.pageResponse.totalPages || 1,
          totalElements: res.pageResponse.totalElements || list.length,
          size: res.pageResponse.pageSize || pagination.size
        });
      } else {
        setPagination((prev) => ({
          ...prev,
          currentPage: pageNo,
          totalElements: list.length,
          totalPages: 1
        }));
      }
    } catch (err) {
      console.error("Failed to fetch self-inspections list from API. Error details:", err);
      toast.error(err?.response?.data?.message || "Failed to load inspection queue");
    } finally {
      setLoading(false);
    }
  };



  const isMounted = useRef(false);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (!isMounted.current) {
      fetchRecords(1);
      isMounted.current = true;
      return;
    }
    const t = setTimeout(() => fetchRecords(1), 400);
    return () => clearTimeout(t);
  }, [search, filterStatus]);

  const handlePageChange = (page) => {
    fetchRecords(page);
  };

  const handleRefresh = () => {
    fetchStats();
    fetchRecords(pagination.currentPage);
  };

  const handleClear = () => {
    setSearch("");
    setFilterStatus("");
  };

  // Action confirmations
  const handleConfirmAction = async (id, remarks) => {
    const actionType = activeModal.type;
    try {
      let res;
      if (actionType === "APPROVE") {
        res = await approveSelfInspection({ id, remarks });
        toast.success(res?.message || "Self inspection approved successfully");
      } else if (actionType === "REJECT") {
        res = await rejectSelfInspection({ id, remarks });
        toast.success(res?.message || "Self inspection rejected successfully");
      } else if (actionType === "REQUEST_CHANGE") {
        res = await requestChangesSelfInspection({ id, remarks });
        toast.success(res?.message || "Changes requested successfully");
      }

      // Refresh list & stats
      fetchStats();
      fetchRecords(pagination.currentPage);
    } catch (err) {
      console.error(`Action ${actionType} failed:`, err);
      toast.error(err?.response?.data?.message || `Failed to perform ${actionType.toLowerCase()} action`);
    }
  };

  const handleViewReport = async (item) => {
    setLoading(true);
    try {
      const res = await getSelfInspectionReport(item.id);
      if (res && !res.error && res.data) {
        window.open(res.data, "_blank");
      } else if (item.reportPdfUrl) {
        window.open(item.reportPdfUrl, "_blank");
      } else {
        toast.error(res?.message || "No report PDF URL available for this inspection");
      }
    } catch (err) {
      console.error("Failed to fetch report PDF URL:", err);
      if (item.reportPdfUrl) {
        window.open(item.reportPdfUrl, "_blank");
      } else {
        toast.error(err?.response?.data?.message || "Failed to fetch inspection report");
      }
    } finally {
      setLoading(false);
    }
  };

  // Date formatter helpers
  const formatDateTime = (dt) => {
    if (!dt) return "—";
    const d = new Date(dt);
    if (isNaN(d.getTime())) return "—";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
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
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Self Inspections</h1>
            </div>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-500 mt-1">
              Review, approve, or request changes on self-inspection reports submitted directly by vehicle owners.
            </p>
          </div>
          <div>
            <button
              onClick={handleRefresh}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition shadow-sm cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Queue
            </button>
          </div>
        </div>
      </div>

      {/* KPI STRIP */}
      <div className="flex-shrink-0 px-6 py-5 bg-slate-50">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <TopCard title="Requested" value={stats.requested} icon={Clock3} colorClass="text-sky-600 border-sky-100 bg-sky-50" />
          <TopCard title="Verified" value={stats.verified} icon={CheckCircle2} colorClass="text-emerald-600 border-emerald-100 bg-emerald-50" />
          <TopCard title="Request Changes" value={stats.requestChanges} icon={AlertTriangle} colorClass="text-amber-600 border-amber-100 bg-amber-50" />
          <TopCard title="Rejected" value={stats.rejected} icon={XCircle} colorClass="text-rose-600 border-rose-100 bg-rose-50" />
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-hidden px-6 pb-6 flex flex-col">
        <section className="flex-1 min-h-0 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden relative flex flex-col">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-50/50 blur-[100px] pointer-events-none" />

          {/* Filter Bar */}
          <div className="p-5 md:p-6 relative z-10 border-b border-slate-200 flex-shrink-0">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-start">
              <div className="relative flex-1 max-w-2xl">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by ID, vehicle model, owner name..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-[14px] text-slate-900 outline-none transition-all focus:border-sky-400 placeholder:text-slate-400 shadow-sm"
                />
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="relative min-w-[200px]">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-4 pr-10 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none shadow-sm cursor-pointer"
                  >
                    <option value="">All Status</option>
                    <option value="REQUESTED">Requested</option>
                    <option value="VERIFIED">Verified</option>
                    <option value="REQUEST_CHANGES">Request Changes</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
                {(search || filterStatus) && (
                  <button
                    onClick={handleClear}
                    className="text-[12px] font-bold text-sky-700 hover:text-sky-800 transition-colors cursor-pointer px-2"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* TABLE CONTAINER */}
          <div className="flex-1 w-full overflow-auto table-scroll relative z-10">
            <table className="min-w-[1450px] w-full border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-20">
                <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Vehicle Info</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Owner Details</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Started At</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Submitted At</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Submitted</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Status Badge</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Remarks / Notes</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Verified At</th>
                  <th className="px-6 py-4 text-right font-semibold whitespace-nowrap">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-28 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Loader2 className="h-12 w-12 text-sky-600 animate-spin mb-4" />
                        <div className="text-lg font-bold text-slate-900 animate-pulse">Loading inspection queue...</div>
                      </div>
                    </td>
                  </tr>
                ) : data.length ? (
                  data.map((row) => (
                    <tr key={row.id} className="transition-colors duration-200 hover:bg-slate-50/50 group">
                      {/* Vehicle Info */}
                      <td className="px-6 py-4">
                        {row.vehicleDetail ? (
                          <div className="flex flex-col">
                            <span className="text-[13px] font-extrabold text-slate-900 leading-tight">
                              {row.vehicleDetail.makerName} {row.vehicleDetail.modelName}
                            </span>
                            <span className="text-[11px] text-slate-400 mt-0.5">
                              {row.vehicleDetail.variantName} • {row.vehicleDetail.yearOfMfg}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[12px]">No Vehicle Details</span>
                        )}
                      </td>

                      {/* Owner Details */}
                      <td className="px-6 py-4">
                        {row.vehicleDetail?.userMaster ? (
                          <div className="flex flex-col">
                            <span className="text-[13px] font-semibold text-slate-700">
                              {row.vehicleDetail.userMaster.firstname} {row.vehicleDetail.userMaster.lastname}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono mt-0.5">
                              {row.vehicleDetail.userMaster.countryCode} {row.vehicleDetail.userMaster.phoneNumber}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[12px]">No Owner Info</span>
                        )}
                      </td>

                      {/* Started At */}
                      <td className="px-6 py-4 text-[13px] font-medium text-slate-500 whitespace-nowrap">
                        {formatDateTime(row.inspectionStartedAt)}
                      </td>

                      {/* Submitted At */}
                      <td className="px-6 py-4 text-[13px] font-medium text-slate-500 whitespace-nowrap">
                        {formatDateTime(row.inspectionSubmittedAt)}
                      </td>

                      {/* Submitted */}
                      <td className="px-6 py-4">
                        <span className={cls("inline-flex rounded-md px-2.5 py-1 text-[10px] font-bold border uppercase tracking-wider", submissionBadge(row.isSubmitted))}>
                          {row.isSubmitted ? "SUBMITTED" : "DRAFT"}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4">
                        <span className={cls("inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-bold border uppercase tracking-wider", verificationBadge(row.verificationStatus))}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {row.verificationStatus}
                        </span>
                      </td>

                      {/* Remarks */}
                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-[13px] text-slate-600 line-clamp-2 leading-relaxed" title={row.remark}>
                          {row.remark || <span className="text-slate-300 italic">No remarks</span>}
                        </p>
                      </td>

                      {/* Verified At */}
                      <td className="px-6 py-4 text-[13px] font-medium text-slate-500 whitespace-nowrap">
                        {formatDateTime(row.verifiedAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <SelfInspectionRowActions
                          item={row}
                          onApprove={(item) => setActiveModal({ open: true, type: "APPROVE", item })}
                          onReject={(item) => setActiveModal({ open: true, type: "REJECT", item })}
                          onRequestChanges={(item) => setActiveModal({ open: true, type: "REQUEST_CHANGE", item })}
                          onViewReport={handleViewReport}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="px-6 py-28 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-4">
                          <Search size={28} />
                        </div>
                        <div className="text-lg font-bold text-slate-900 tracking-tight">No records found</div>
                        <div className="mt-1 text-[14px] text-slate-500 max-w-sm mx-auto">
                          No self inspections matched the search query or status filters.
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
                disabled={pagination.currentPage === 1 || loading}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
              >
                Prev
              </button>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages || loading}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* CONFIRMATION DIALOG MODAL */}
      <ActionModal
        open={activeModal.open}
        type={activeModal.type}
        item={activeModal.item}
        onClose={() => setActiveModal({ open: false, type: null, item: null })}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
};

export default SelfInspection;
