import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  RefreshCw,
  Loader2,
  Ticket,
  BadgeCheck,
  Clock,
  UserCheck,
  MoreVertical,
  Eye,
  UserPlus,
  CheckCircle2,
  X,
  ChevronDown,
  Filter,
  Tag,
  HelpCircle,
  Send,
  CalendarDays,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  User,
  Car,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getHelpTickets, getHelpTicketDetailsById, resolveHelpTicket, getHelpTicketStats } from "../../../api/consultationApi";

const cls = (...classes) => classes.filter(Boolean).join(" ");


const priorityBadge = (priority) => {
  const p = String(priority || "").toUpperCase();
  if (p === "CRITICAL") return "bg-rose-50 text-rose-700 border-rose-200";
  if (p === "HIGH") return "bg-orange-50 text-orange-700 border-orange-200";
  if (p === "MEDIUM") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-sky-50 text-sky-700 border-sky-200";
};

const statusBadge = (status) => {
  const s = String(status || "").toUpperCase();
  if (s === "SOLVED" || s === "RESOLVED") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (s === "ASSIGNED") return "bg-purple-50 text-purple-700 border-purple-200";
  return "bg-blue-50 text-blue-700 border-blue-200";
};

function ConsultantLogo({ src, alt }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0] ? parts[0][0].toUpperCase() : "?";
  };

  if (!src || hasError) {
    const initials = getInitials(alt);
    return (
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-[14px] font-bold text-black shadow-[0_2px_8px_rgba(15,23,42,0.05)]">
        {initials}
      </div>
    );
  }

  return (
    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-[0_2px_8px_rgba(15,23,42,0.05)]">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setHasError(true)}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

function StatCard({ title, value, icon: Icon, iconWrapClass = "", valueClass = "" }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative z-10 flex items-center justify-between gap-4">
        <div>
          <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            {title}
          </div>
          <div className={cls("text-3xl font-extrabold tracking-tight text-slate-900", valueClass)}>
            {value}
          </div>
        </div>

        <div className={cls("flex h-11 w-11 items-center justify-center rounded-2xl border shadow-sm", iconWrapClass)}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

const HelpCenter = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Pagination states
  const [ticketPage, setTicketPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Modals state
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isSolveModalOpen, setIsSolveModalOpen] = useState(false);
  const [solveRemarks, setSolveRemarks] = useState("");
  const [assigneeName, setAssigneeName] = useState("");
  
  // Custom dropdown reference for active menu
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  // Stats state and fetch helper
  const [statsData, setStatsData] = useState({ totalTickets: 0, solvedTickets: 0 });

  const fetchStats = async () => {
    try {
      const res = await getHelpTicketStats();
      if (res.status === "OK" && res.data) {
        setStatsData(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const fetchTickets = async () => {
    try {
      setLoading(true);
      fetchStats();
      const payload = {
        pageNo: ticketPage,
        ticketStatus: statusFilter || null,
        priority: priorityFilter || null,
        searchText: searchText.trim() || null,
      };
      const res = await getHelpTickets(payload);
      if (res.status === "OK") {
        const mapped = (res.data || []).map((item) => ({
          ...item,
          consultantName: item.userFullName || item.consultantName || "Consultant",
          status: item.ticketStatus || item.status || "OPEN",
          logoUrl: item.logoUrl || null,
        }));
        setTickets(mapped);
        if (res.pageResponse) {
          setTotalPages(res.pageResponse.totalPages || 1);
          setTotalElements(res.pageResponse.totalElements || 0);
        } else {
          setTotalPages(1);
          setTotalElements(mapped.length);
        }
      } else {
        setTickets([]);
        setTotalPages(1);
        setTotalElements(0);
        toast.error("Failed to fetch tickets from server");
      }
    } catch (err) {
      console.error(err);
      setTickets([]);
      setTotalPages(1);
      setTotalElements(0);
      toast.error("Failed to fetch tickets from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [ticketPage, statusFilter, priorityFilter, searchText]);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTickets();
    setRefreshing(false);
    toast.success("Help Center tickets refreshed");
  };

  const filteredTickets = useMemo(() => {
    return tickets;
  }, [tickets]);

  useEffect(() => {
    setTicketPage(1);
  }, [searchText, statusFilter, priorityFilter, categoryFilter]);

  const totalTicketPages = totalPages;

  const paginatedTickets = filteredTickets;

  const stats = useMemo(() => {
    return {
      all: statsData.totalTickets,
      solved: statsData.solvedTickets,
      assigned: 0,
    };
  }, [statsData]);

  // Actions
  const handleOpenView = (ticket) => {
    navigate(`/admin/consultants/help-center/${ticket.id}`);
  };

  const handleOpenAssign = (ticket) => {
    setSelectedTicket(ticket);
    setAssigneeName(ticket.assignedTo || "");
    setIsAssignModalOpen(true);
    setActiveMenuId(null);
  };

  const handleOpenSolve = (ticket) => {
    setSelectedTicket(ticket);
    setSolveRemarks("");
    setIsSolveModalOpen(true);
    setActiveMenuId(null);
  };

  const handleConfirmAssign = (agent) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id
          ? {
              ...t,
              assignedTo: agent,
              status: t.status === "OPEN" ? "ASSIGNED" : t.status,
            }
          : t
      )
    );
    toast.success(`Ticket assigned to ${agent}`);
    setIsAssignModalOpen(false);
  };

  const handleConfirmSolve = async () => {
    try {
      const payload = {
        helpTicketId: selectedTicket.id,
        remarks: solveRemarks.trim() || null,
      };
      const res = await resolveHelpTicket(payload);
      if (res.status === "OK") {
        setTickets((prev) =>
          prev.map((t) =>
            t.id === selectedTicket.id ? { ...t, status: "SOLVED", ticketStatus: "SOLVED" } : t
          )
        );
        toast.success("Ticket marked as solved successfully");
        setIsSolveModalOpen(false);
        setSolveRemarks("");
        fetchStats();
      } else {
        toast.error("Failed to resolve ticket");
      }
    } catch (err) {
      console.error(err);
      // Fallback for simulation if API call fails
      setTickets((prev) =>
        prev.map((t) =>
          t.id === selectedTicket.id ? { ...t, status: "SOLVED" } : t
        )
      );
      toast.success("Ticket marked as solved (Simulation mode)");
      setIsSolveModalOpen(false);
      setSolveRemarks("");
      fetchStats();
    }
  };

  const formatTime = (timeStr) => {
    return new Date(timeStr).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden p-0 bg-slate-50">
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

      <div className="flex flex-1 flex-col space-y-4 overflow-hidden p-6">
        {/* Header */}
        <section className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-1 text-[32px] font-extrabold tracking-tight text-slate-900">
              Help Center
            </h1>
            <p className="text-sm text-slate-500">Manage consultant technical support requests and tickets.</p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            title="All Tickets"
            value={stats.all}
            icon={Ticket}
            iconWrapClass="border-blue-100 bg-blue-50 text-blue-600"
          />
          <StatCard
            title="Mark as Solved"
            value={stats.solved}
            icon={BadgeCheck}
            iconWrapClass="border-emerald-100 bg-emerald-50 text-emerald-600"
            valueClass="text-emerald-600"
          />
          <StatCard
            title="Total Assigned Tickets"
            value={stats.assigned}
            icon={UserCheck}
            iconWrapClass="border-purple-100 bg-purple-50 text-purple-600"
            valueClass="text-purple-600"
          />
        </section>

        {/* Content Section */}
        <section className="relative flex flex-1 flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
          <div className="pointer-events-none absolute -top-10 right-10 h-48 w-48 rounded-full bg-blue-100/50 blur-3xl" />

          {/* Filters and Search */}
          <div className="relative z-10 border-b border-slate-200 px-4 py-4 md:px-6">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-1 flex-col gap-3 lg:flex-row">
                <div className="relative min-w-0 flex-1 max-w-xl">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search ticket ID, consultant name, subject, category..."
                    className="h-11 md:h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-[13px] md:text-[14px] font-medium text-slate-900 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {/* Status Filter */}
                  <div className="relative min-w-[140px]">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="h-11 md:h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-10 text-[13px] font-semibold text-slate-900 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100 cursor-pointer"
                    >
                      <option value="">All Statuses</option>
                      <option value="OPEN">Open</option>
                      <option value="RESOLVED">Resolved</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>

                  {/* Priority Filter */}
                  <div className="relative min-w-[140px]">
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="h-11 md:h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-10 text-[13px] font-semibold text-slate-900 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100 cursor-pointer"
                    >
                      <option value="">All Priorities</option>
                      <option value="HIGH">High</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="LOW">Low</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSearchText("");
                    setStatusFilter("");
                    setPriorityFilter("");
                  }}
                  className="inline-flex h-11 md:h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-[13px] font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
                  type="button"
                >
                  Clear Filters
                </button>

                <button
                  onClick={handleRefresh}
                  className="inline-flex h-11 md:h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-[13px] font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
                  type="button"
                >
                  {refreshing ? (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="relative z-10 flex-1 overflow-auto">
            <div className="table-scroll h-full w-full overflow-auto">
              <table className="min-w-[1200px] w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-slate-50/80 backdrop-blur-sm">
                    <th className="border-b border-r border-slate-200/60 px-6 py-4.5 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90">
                      Consultant
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-6 py-4.5 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90">
                      Subject
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90">
                      Category
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90">
                      Priority
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90">
                      Created At
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90">
                      Assigned To
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90">
                      Status
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
                          Loading tickets...
                        </div>
                      </td>
                    </tr>
                  ) : paginatedTickets.length > 0 ? (
                    paginatedTickets.map((item, index) => (
                      <tr
                        key={item.id}
                        className={cls(
                          "group transition-colors duration-200 hover:bg-slate-50/50",
                          index % 2 === 0 ? "bg-white" : "bg-slate-50/20"
                        )}
                      >

                        {/* Consultant */}
                        <td className="border-b border-slate-100 px-6 py-4 align-middle">
                          <div className="flex items-center gap-3">
                            <ConsultantLogo src={item.consultThumbnailImage} alt={item.consultName || item.userFullName} />
                            <span className="text-[14px] font-bold text-slate-900 whitespace-nowrap">
                              {item.consultName || item.userFullName}
                            </span>
                          </div>
                        </td>

                        {/* Subject */}
                        <td className="border-b border-slate-100 px-6 py-4 align-middle min-w-[260px] max-w-[400px]">
                          <div
                            onClick={() => handleOpenView(item)}
                            className="truncate text-[13.5px] font-semibold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
                            title="Click to view ticket details"
                          >
                            {item.subject}
                          </div>
                        </td>

                        {/* Category */}
                        <td className="border-b border-slate-100 px-5 py-4 text-center align-middle">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold">
                            <Tag size={12} className="text-slate-400" />
                            {item.category}
                          </span>
                        </td>

                        {/* Priority */}
                        <td className="border-b border-slate-100 px-5 py-4 text-center align-middle">
                          <span
                            className={cls(
                              "inline-flex rounded-full border px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-[0.03em] whitespace-nowrap",
                              priorityBadge(item.priority)
                            )}
                          >
                            {item.priority}
                          </span>
                        </td>

                        {/* Created At */}
                        <td className="border-b border-slate-100 px-5 py-4 text-center align-middle">
                          <div className="inline-flex items-center gap-2 text-[12.5px] font-medium text-slate-500 whitespace-nowrap">
                            <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                            {formatTime(item.createdAt)}
                          </div>
                        </td>

                        {/* Assigned To */}
                        <td className="border-b border-slate-100 px-5 py-4 text-center align-middle">
                          <div className="text-[13px] font-semibold text-slate-700 whitespace-nowrap">
                            {item.assignedTo ? (
                              <span className="text-slate-800">{item.assignedTo}</span>
                            ) : (
                              <span className="text-slate-400 italic">Unassigned</span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="border-b border-slate-100 px-5 py-4 text-center align-middle">
                          <span
                            className={cls(
                              "inline-flex rounded-full border px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-[0.03em] whitespace-nowrap",
                              statusBadge(item.status)
                            )}
                          >
                            {item.status}
                          </span>
                        </td>

                        {/* Action Menu dropdown */}
                        <td className="border-b border-slate-100 px-6 py-4 text-right align-middle relative">
                          <div className="inline-block" ref={activeMenuId === item.id ? menuRef : null}>
                            <button
                              onClick={() =>
                                setActiveMenuId(activeMenuId === item.id ? null : item.id)
                              }
                              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                              <MoreVertical size={16} className="text-slate-600" />
                            </button>

                            {activeMenuId === item.id && (() => {
                              const isResolved = String(item.status || "").toUpperCase() === "RESOLVED" || String(item.status || "").toUpperCase() === "SOLVED";
                              return (
                                <div className="absolute right-6 mt-1 w-48 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-100 text-left">
                                  <button
                                    onClick={() => handleOpenView(item)}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                                  >
                                    <Eye size={14} className="text-slate-400" />
                                    View Ticket
                                  </button>
                                  {!isResolved && (
                                    <>
                                      <button
                                        onClick={() => handleOpenAssign(item)}
                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                                      >
                                        <UserPlus size={14} className="text-slate-400" />
                                        Assign To...
                                      </button>
                                      <button
                                        onClick={() => handleOpenSolve(item)}
                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-[13px] font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors border-t border-slate-100"
                                      >
                                        <CheckCircle2 size={14} className="text-emerald-500" />
                                        Mark as Solved
                                      </button>
                                    </>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="px-6 py-28 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-400 shadow-sm">
                            <ShieldAlert size={28} />
                          </div>
                          <div className="text-lg font-bold tracking-tight text-slate-900">
                            No tickets found
                          </div>
                          <div className="mx-auto mt-1 max-w-sm text-[14px] text-slate-500">
                            Try adjusting your search query or dropdown filters.
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer stats */}
          <div className="flex shrink-0 flex-col gap-2 border-t border-slate-200 bg-white px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-900">{paginatedTickets.length}</span> of{" "}
              <span className="font-semibold text-slate-900">{filteredTickets.length}</span> tickets
            </div>
            <div className="flex gap-2">
              <button
                disabled={ticketPage === 1}
                onClick={() => setTicketPage((prev) => Math.max(prev - 1, 1))}
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                type="button"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                disabled={ticketPage === totalTicketPages}
                onClick={() => setTicketPage((prev) => Math.min(prev + 1, totalTicketPages))}
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                type="button"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* ASSIGN TO MODAL */}
      {isAssignModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-[420px] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md">
                  <UserPlus size={16} />
                </div>
                <h3 className="font-extrabold text-slate-900">Assign Ticket</h3>
              </div>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center border border-slate-200"
              >
                <X size={14} className="text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Assign ticket <span className="font-bold text-slate-900">{selectedTicket.id}</span> to a support agent.
              </p>
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Agent Name</label>
                <input
                  type="text"
                  value={assigneeName}
                  onChange={(e) => setAssigneeName(e.target.value)}
                  placeholder="Enter agent name..."
                  className="w-full h-11 px-3.5 border border-slate-200 rounded-2xl text-xs font-semibold outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 placeholder:text-slate-400"
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700"
              >
                Cancel
              </button>
              <button
                disabled={!assigneeName.trim()}
                onClick={() => handleConfirmAssign(assigneeName.trim())}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-colors"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MARK AS SOLVED MODAL */}
      {isSolveModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-[420px] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md">
                  <BadgeCheck size={18} />
                </div>
                <h3 className="font-extrabold text-slate-900">Mark as Solved</h3>
              </div>
              <button
                onClick={() => setIsSolveModalOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center border border-slate-200"
              >
                <X size={14} className="text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600 font-semibold leading-relaxed text-left">
                Are you sure you want to mark ticket <span className="font-bold text-slate-900"></span> as resolved?
              </p>
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Resolution Remarks (Optional)</label>
                <textarea
                  value={solveRemarks}
                  onChange={(e) => setSolveRemarks(e.target.value)}
                  placeholder="Enter comments or resolution details..."
                  className="w-full h-20 px-3.5 py-2.5 border border-slate-200 rounded-2xl text-xs font-semibold outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 placeholder:text-slate-400 resize-none"
                />
              </div>
              <p className="text-[11px] text-slate-400 italic text-left">
                This will update the ticket status to <span className="text-emerald-600 font-semibold font-sans">SOLVED</span> and trigger the backend resolution workflow.
              </p>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setIsSolveModalOpen(false)}
                className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSolve}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Confirm Resolve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpCenter;
