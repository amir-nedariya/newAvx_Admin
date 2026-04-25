import { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  User,
  Download,
  SlidersHorizontal,
  X,
  Mail,
  Phone,
  CalendarDays,
  Hash,
} from "lucide-react";
import { exportToCSV } from "../../utils/exportToCSV";
import toast from "react-hot-toast";
import { filterApplicants } from "../../api/consultationApi";

const cls = (...a) => a.filter(Boolean).join(" ");

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "DELETED", label: "Deleted" },
];

const statusBadge = (status) => {
  const s = String(status || "").toUpperCase();
  const map = {
    ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
    INACTIVE: "bg-slate-50 text-slate-700 border-slate-200",
    DELETED: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return map[s] || "bg-slate-50 text-slate-700 border-slate-200";
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const toISOFrom = (dateStr) => {
  if (!dateStr) return null;
  return new Date(`${dateStr}T00:00:00`).toISOString();
};

const toISOTo = (dateStr) => {
  if (!dateStr) return null;
  return new Date(`${dateStr}T23:59:59`).toISOString();
};

const PAGE_SIZE = 10;

const Leads = () => {
  // Applied filters (used for API calls)
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Draft filters (inside the panel before Apply)
  const [draftStatus, setDraftStatus] = useState("");
  const [draftDateFrom, setDraftDateFrom] = useState("");
  const [draftDateTo, setDraftDateTo] = useState("");

  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [rows, setRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedLead, setSelectedLead] = useState(null);

  const panelRef = useRef(null);

  // Count active filters for badge
  const activeFilterCount = [status, dateFrom, dateTo].filter(Boolean).length;

  /* ── Close panel on outside click ── */
  useEffect(() => {
    const handleClick = (e) => {
      if (filterOpen && panelRef.current && !panelRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [filterOpen]);

  /* ── Sync draft when panel opens ── */
  const handleOpenFilter = () => {
    setDraftStatus(status);
    setDraftDateFrom(dateFrom);
    setDraftDateTo(dateTo);
    setFilterOpen(true);
  };

  /* ── Apply filters from panel ── */
  const handleApplyFilters = () => {
    setStatus(draftStatus);
    setDateFrom(draftDateFrom);
    setDateTo(draftDateTo);
    setCurrentPage(1);
    setFilterOpen(false);
  };

  /* ── Clear filters in panel ── */
  const handleClearFilters = () => {
    setDraftStatus("");
    setDraftDateFrom("");
    setDraftDateTo("");
    // Also reset applied filters so badge count goes to zero
    setStatus("");
    setDateFrom("");
    setDateTo("");
    setFilterOpen(false);
  };

  /* ── Clear all applied filters ── */
  const handleClearAll = () => {
    setStatus("");
    setDateFrom("");
    setDateTo("");
    setDraftStatus("");
    setDraftDateFrom("");
    setDraftDateTo("");
    setSearchInput("");
    setSearch("");
    setCurrentPage(1);
  };

  /* ── Debounce search ── */
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  /* ── Fetch from API ── */
  const fetchLeads = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const payload = {
        pageNo: page,
        pageSize: PAGE_SIZE,
        searchText: search.trim() || null,
        status: status || null,
        fromDate: toISOFrom(dateFrom),
        toDate: toISOTo(dateTo),
      };

      const response = await filterApplicants(payload);

      setRows(response?.data || []);

      if (response?.pageResponse) {
        setTotalPages(response.pageResponse.totalPages || 0);
        setTotalElements(response.pageResponse.totalElements || 0);
        setCurrentPage(response.pageResponse.currentPage || page);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast.error(error?.response?.data?.message || "Failed to fetch leads");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [search, status, dateFrom, dateTo]);

  useEffect(() => {
    fetchLeads(1);
  }, [search, status, dateFrom, dateTo]);

  const handlePageChange = (newPage) => {
    fetchLeads(newPage);
  };

  /* ── Export ── */
  const handleExport = async () => {
    setExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      const payload = {
        pageNo: 1,
        pageSize: 10000,
        searchText: search.trim() || null,
        status: status || null,
        fromDate: toISOFrom(dateFrom),
        toDate: toISOTo(dateTo),
      };

      const response = await filterApplicants(payload);
      const allData = response?.data || [];

      if (allData.length === 0) {
        toast.error("No data to export");
        return;
      }

      const columns = [
        { key: "userId", label: "User ID" },
        { key: "firstname", label: "First Name" },
        { key: "lastname", label: "Last Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "status", label: "Status" },
        { key: "createdAt", label: "Created At" },
      ];

      const exportData = allData.map((lead) => {
        const phoneNumber = `${lead.countryCode || ""}${lead.phoneNumber || ""}`;
        return {
          userId: lead.userId || "",
          firstname: lead.firstname || "",
          lastname: lead.lastname || "",
          email: lead.email || "",
          phone: phoneNumber ? `\t${phoneNumber}` : "",
          status: lead.status || "",
          createdAt: formatDate(lead.createdAt),
        };
      });

      const timestamp = new Date().toISOString().split("T")[0];
      exportToCSV(exportData, `leads-export-${timestamp}`, columns);

      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success(`${allData.length} leads exported successfully!`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export leads");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="h-screen bg-slate-50 p-6 flex flex-col overflow-hidden">
      <div className="mx-auto w-full flex flex-col flex-1 space-y-6 overflow-hidden">

        {/* ── PAGE HEADER ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Track and manage all incoming leads
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
            <User className="h-4 w-4" />
            <span>Total: {totalElements}</span>
          </div>
        </div>

        {/* ── TABLE CARD ── */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col flex-1 min-h-0">

          {/* ── Toolbar ── */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">

            {/* Search */}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-sky-400 focus:bg-white transition"
              />
            </div>

            {/* Filter button */}
            <button
              onClick={handleOpenFilter}
              className={cls(
                "relative inline-flex items-center gap-2 h-9 px-4 rounded-xl border text-sm font-medium transition shadow-sm",
                activeFilterCount > 0
                  ? "border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-sky-600 text-[10px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Export */}
            <button
              onClick={handleExport}
              disabled={loading || exporting || totalElements === 0}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-xl border border-slate-200 bg-sky-500 text-white hover:bg-slate-50 hover:text-sky-500 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium whitespace-nowrap"
            >
              {exporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Export
                </>
              )}
            </button>

            {/* Refresh */}
            <button
              onClick={() => fetchLeads(currentPage)}
              disabled={loading}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition shadow-sm disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={cls("h-4 w-4", loading && "animate-spin")} />
            </button>
          </div>

          {/* ── Table ── */}
          <div className="overflow-auto flex-1 min-h-0">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  {["Name", "Email", "Phone", "Status", "Created At", "Action"].map((h) => (
                    <th
                      key={h}
                      className="whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-slate-400" />
                      <p className="mt-2 text-sm text-slate-400">Loading leads…</p>
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <p className="text-sm text-slate-400">No leads found.</p>
                    </td>
                  </tr>
                ) : (
                  rows.map((lead) => (
                    <tr key={lead.userId} className="group hover:bg-slate-50 transition-colors">

                      {/* Name */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                            <User className="h-4 w-4" />
                          </div>
                          <span className="font-medium text-slate-900">
                            {lead.firstname} {lead.lastname}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                        {lead.email || "—"}
                      </td>

                      {/* Phone */}
                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                        {lead.countryCode && lead.phoneNumber
                          ? `${lead.countryCode} ${lead.phoneNumber}`
                          : "—"}
                      </td>

                      {/* Status */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <span className={cls(
                          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                          statusBadge(lead.status)
                        )}>
                          {lead.status || "—"}
                        </span>
                      </td>

                      {/* Created At */}
                      <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                        {formatDate(lead.createdAt)}
                      </td>

                      {/* Action */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="inline-flex cursor-pointer h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 shadow-sm"
                          title="View Lead Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          {!loading && totalElements > 0 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3.5">
              <p className="text-sm text-slate-500">
                Page {currentPage} of {totalPages} &nbsp;·&nbsp; {totalElements} lead{totalElements !== 1 ? "s" : ""}
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="text-sm font-medium">Prev</span>
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <span className="text-sm font-medium">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Lead Detail Modal ── */}
      {selectedLead && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            onClick={() => setSelectedLead(null)}
          />
          <div className="fixed left-1/2 top-1/2 z-50 w-[95%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedLead.firstname} {selectedLead.lastname}
                  </h3>
                  <p className="text-xs text-slate-500">Lead Details</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 space-y-4">

              {/* Name */}
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Full Name</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-900">
                    {selectedLead.firstname} {selectedLead.lastname}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Email</p>
                  <p className="mt-0.5 text-sm text-slate-900">{selectedLead.email || "—"}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Phone</p>
                  <p className="mt-0.5 text-sm text-slate-900">
                    {selectedLead.countryCode && selectedLead.phoneNumber
                      ? `${selectedLead.countryCode} ${selectedLead.phoneNumber}`
                      : "—"}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  <Hash className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Status</p>
                  <span className={cls(
                    "mt-1 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                    statusBadge(selectedLead.status)
                  )}>
                    {selectedLead.status || "—"}
                  </span>
                </div>
              </div>

              {/* Created At */}
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  <CalendarDays className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Registered On</p>
                  <p className="mt-0.5 text-sm text-slate-900">{formatDate(selectedLead.createdAt)}</p>
                </div>
              </div>

            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => setSelectedLead(null)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Filter Panel Overlay ── */}
      {filterOpen && (
        <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setFilterOpen(false)} />
      )}

      {/* ── Filter Panel (slides in from right) ── */}
      <div
        ref={panelRef}
        className={cls(
          "fixed top-0 right-0 z-50 h-full w-80 bg-white shadow-2xl border-l border-slate-200 flex flex-col transition-transform duration-300 ease-in-out",
          filterOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-slate-600" />
            <h3 className="text-base font-semibold text-slate-900">Filters</h3>
          </div>
          <button
            onClick={() => setFilterOpen(false)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Panel body */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">

          {/* Status */}
          {/* <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Status</label>
            <div className="space-y-2">
              {STATUS_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={cls(
                    "flex items-center gap-3 rounded-xl border px-4 py-2.5 cursor-pointer transition",
                    draftStatus === opt.value
                      ? "border-sky-300 bg-sky-50"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  )}
                >
                  <input
                    type="radio"
                    name="status"
                    value={opt.value}
                    checked={draftStatus === opt.value}
                    onChange={() => setDraftStatus(opt.value)}
                    className="accent-sky-600"
                  />
                  <span className={cls(
                    "text-sm font-medium",
                    draftStatus === opt.value ? "text-sky-700" : "text-slate-700"
                  )}>
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </div> */}

          {/* Date Range */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">Date Range</label>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide">From</label>
              <input
                type="date"
                value={draftDateFrom}
                onChange={(e) => setDraftDateFrom(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-sky-400 focus:bg-white transition"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide">To</label>
              <input
                type="date"
                value={draftDateTo}
                onChange={(e) => setDraftDateTo(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-sky-400 focus:bg-white transition"
              />
            </div>
          </div>
        </div>

        {/* Panel footer */}
        <div className="px-5 py-4 border-t border-slate-100 flex gap-3">
          <button
            onClick={handleClearFilters}
            className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Clear
          </button>
          <button
            onClick={handleApplyFilters}
            className="flex-1 rounded-xl bg-sky-600 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 transition"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leads;
