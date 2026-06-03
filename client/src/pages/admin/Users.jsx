import React, { useEffect, useRef, useState } from "react";
import {
  User,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Ban,
  ShieldAlert,
  Clock,
  CheckCircle,
  Car,
  Flag,
  UserX,
  Ticket,
  BadgeCheck,
  UserCheck,
  MoreVertical,
  X,
  UserPlus,
  CalendarDays,
  Tag,
  ChevronDown,
  Search,
  RefreshCw,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";

import {
  getUsers,
  getPendingUserSellers,
  getSuspendedUserSellers,
  getFlaggedUserSellers,
  getUserSellerStats,
  getUserHelpTickets,
  getUserHelpTicketStats,
  resolveUserHelpTicket,
} from "../../api/user.api";

const cls = (...classes) => classes.filter(Boolean).join(" ");

const Users = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(() => {
    return location.state?.activeTab || "all";
  }); // "all", "pending", "suspended", "flagged", "help-center"

  // Help Center states
  const [tickets, setTickets] = useState([]);
  const [ticketSearch, setTicketSearch] = useState("");
  const [ticketStatusFilter, setTicketStatusFilter] = useState("");
  const [ticketPriorityFilter, setTicketPriorityFilter] = useState("");
  const [ticketPage, setTicketPage] = useState(1);
  const [ticketTotalPages, setTicketTotalPages] = useState(1);
  const [ticketTotalElements, setTicketTotalElements] = useState(0);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [ticketsRefreshing, setTicketsRefreshing] = useState(false);

  // Help Center — API-sourced stats
  const [apiTicketStats, setApiTicketStats] = useState({ totalTickets: 0, solvedTickets: 0 });

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isSolveModalOpen, setIsSolveModalOpen] = useState(false);
  const [solveRemarks, setSolveRemarks] = useState("");
  const [solving, setSolving] = useState(false);

  // Dynamic assignee name
  const [assigneeName, setAssigneeName] = useState("");

  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  const priorityBadge = (priority) => {
    const p = String(priority || "").toUpperCase();
    if (p === "CRITICAL") return "bg-rose-50 text-rose-700 border-rose-200";
    if (p === "HIGH") return "bg-orange-50 text-orange-700 border-orange-200";
    if (p === "MEDIUM") return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-sky-50 text-sky-700 border-sky-200";
  };

  const statusBadge = (status) => {
    const s = String(status || "").toUpperCase();
    if (s === "SOLVED") return "bg-emerald-50 text-emerald-700 border-emerald-200";
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
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-[12px] font-bold text-black shadow-sm">
          {initials}
        </div>
      );
    }

    return (
      <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-sm">
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
  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [suspendedUsers, setSuspendedUsers] = useState([]);
  const [flaggedUsers, setFlaggedUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVerifiedUserSellers: 0,
    totalListedVehicles: 0,
    totalActiveFlaggedUserSellers: 0,
    totalSuspendedUserSellers: 0,
  });
  const [userSearch, setUserSearch] = useState("");
  const firstLoadUsersSearchRef = useRef(true);
  const userSearchDebounceRef = useRef(null);

  /* ================= FETCH USERS ================= */
  const fetchUsers = async (pageNo, searchVal = userSearch) => {
    try {
      setLoading(true);
      const res = await getUsers(pageNo, searchVal);
      if (res.status === "OK") {
        setUsers(res.data);
        setPage(res.pageResponse.currentPage);
        setTotalPages(res.pageResponse.totalPages);
        setTotalUsers(res.pageResponse.totalElements);
      }
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshUsers = () => {
    fetchUsers(page, userSearch);
  };

  /* ================= FETCH PENDING USERS ================= */
  const fetchPendingUsers = async (pageNo) => {
    try {
      setLoading(true);
      const res = await getPendingUserSellers(pageNo);
      if (res.status === "OK") {
        setPendingUsers(res.data);
        setPage(res.pageResponse.currentPage);
        setTotalPages(res.pageResponse.totalPages);
        setTotalUsers(res.pageResponse.totalElements);
      }
    } catch {
      toast.error("Failed to fetch pending users");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH SUSPENDED USERS ================= */
  const fetchSuspendedUsers = async () => {
    try {
      setLoading(true);
      const res = await getSuspendedUserSellers();
      if (res.status === "OK") {
        setSuspendedUsers(res.data);
      }
    } catch {
      toast.error("Failed to fetch suspended users");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH FLAGGED USERS ================= */
  const fetchFlaggedUsers = async () => {
    try {
      setLoading(true);
      const res = await getFlaggedUserSellers();
      if (res.status === "OK") {
        setFlaggedUsers(res.data);
      }
    } catch {
      toast.error("Failed to fetch flagged users");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH STATS ================= */
  const fetchStats = async () => {
    try {
      const res = await getUserSellerStats();
      if (res.status === "OK") {
        setStats(res.data);
      }
    } catch {
      // Silently fail for stats
      console.error("Failed to fetch stats");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === "all") {
      fetchUsers(page, userSearch);
    } else if (activeTab === "pending") {
      fetchPendingUsers(page);
    } else if (activeTab === "suspended") {
      fetchSuspendedUsers();
    } else if (activeTab === "flagged") {
      fetchFlaggedUsers();
    } else if (activeTab === "help-center") {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, page]);

  useEffect(() => {
    if (activeTab !== "all") return;

    if (firstLoadUsersSearchRef.current) {
      firstLoadUsersSearchRef.current = false;
      return;
    }

    if (userSearchDebounceRef.current) {
      clearTimeout(userSearchDebounceRef.current);
    }

    userSearchDebounceRef.current = setTimeout(() => {
      setPage(1);
      fetchUsers(1, userSearch);
    }, 500);

    return () => {
      if (userSearchDebounceRef.current) {
        clearTimeout(userSearchDebounceRef.current);
      }
    };
  }, [userSearch]);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ================= FETCH HELP TICKET STATS ================= */
  const fetchTicketStats = async () => {
    try {
      const res = await getUserHelpTicketStats();
      if (res.status === "OK" && res.data) {
        setApiTicketStats({
          totalTickets: res.data.totalTickets ?? 0,
          solvedTickets: res.data.solvedTickets ?? 0,
        });
      }
    } catch (err) {
      console.error("Failed to fetch ticket stats:", err);
    }
  };

  /* ================= FETCH HELP TICKETS ================= */
  const fetchHelpTickets = async () => {
    try {
      setTicketsLoading(true);
      const payload = {
        pageNo: ticketPage,
        searchText: ticketSearch.trim() || null,
        ticketStatus: ticketStatusFilter || null,
        priority: ticketPriorityFilter || null,
      };
      const res = await getUserHelpTickets(payload);
      if (res.status === "OK") {
        const mapped = (res.data || []).map((item) => ({
          ...item,
          consultantName: item.userFullName || "User",
          status: item.ticketStatus || item.status || "OPEN",
          logoUrl: item.consultThumbnailImage || null,
        }));
        setTickets(mapped);
        if (res.pageResponse) {
          setTicketTotalPages(res.pageResponse.totalPages || 1);
          setTicketTotalElements(res.pageResponse.totalElements || 0);
        } else {
          setTicketTotalPages(1);
          setTicketTotalElements(mapped.length);
        }
      } else {
        setTickets([]);
        setTicketTotalPages(1);
        setTicketTotalElements(0);
        toast.error("Failed to fetch tickets from server");
      }
    } catch (err) {
      console.error(err);
      setTickets([]);
      setTicketTotalPages(1);
      setTicketTotalElements(0);
      toast.error("Error loading help tickets");
    } finally {
      setTicketsLoading(false);
    }
  };

  const handleRefreshTickets = async () => {
    setTicketsRefreshing(true);
    await Promise.all([fetchHelpTickets(), fetchTicketStats()]);
    setTicketsRefreshing(false);
    toast.success("Help Center tickets refreshed");
  };

  useEffect(() => {
    if (activeTab === "help-center") {
      fetchHelpTickets();
      fetchTicketStats();
    }
  }, [activeTab, ticketPage, ticketStatusFilter, ticketPriorityFilter, ticketSearch]);

  useEffect(() => {
      const handler = (e) => {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
          setActiveMenuId(null);
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, []);

  // Filtering is done server-side; tickets returned by the API are already filtered
  const filteredTickets = tickets;

  useEffect(() => {
    setTicketPage(1);
  }, [ticketSearch, ticketStatusFilter, ticketPriorityFilter]);

  const totalTicketPages = ticketTotalPages;

  const paginatedTickets = filteredTickets;

  // Stats come from the API; "assigned" is not returned by backend so kept as 0
  const ticketStats = {
    all: apiTicketStats.totalTickets,
    solved: apiTicketStats.solvedTickets,
    assigned: 0,
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
      setSolving(true);
      const payload = {
        helpTicketId: selectedTicket.id,
        remarks: solveRemarks.trim() || null,
      };
      await resolveUserHelpTicket(payload);
      setTickets((prev) =>
        prev.map((t) =>
          t.id === selectedTicket.id ? { ...t, status: "RESOLVED", ticketStatus: "RESOLVED" } : t
        )
      );
      toast.success("Ticket marked as resolved successfully");
      setIsSolveModalOpen(false);
      setSolveRemarks("");
      fetchTicketStats();
    } catch (err) {
      console.error(err);
      toast.error("Failed to resolve ticket");
    } finally {
      setSolving(false);
    }
  };

  const handleSendComment = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      sender: selectedTicket.assignedTo || "Support Agent",
      text: newMessage.trim(),
      time: new Date().toISOString(),
    };

    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id
          ? {
              ...t,
              messages: [...(t.messages || []), msg],
            }
          : t
      )
    );

    setSelectedTicket((prev) => ({
      ...prev,
      messages: [...(prev.messages || []), msg],
    }));

    setNewMessage("");
    toast.success("Response sent successfully");
  };

  const formatEnumLabel = (value) => {
    if (!value) return "-";
    return String(value).replace(/_/g, " ");
  };

  const getVerificationStatusColor = (status) => {
    switch (status) {
      case "VERIFIED":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "REQUESTED":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "REQUEST_CHANGES":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "REJECTED":
        return "bg-rose-100 text-rose-700 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  /* ================= VIEW USER ================= */
  const handleViewUser = (id) => {
    navigate(`/admin/users/${id}`);
  };

  if (loading) {
    return (
      <div className="h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="h-6 w-6 animate-spin text-sky-600" />
          <span className="text-lg font-medium">Loading users...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      <ToastContainer position="top-right" theme="light" />

      <div className="flex-1 flex flex-col overflow-hidden p-3">
        <div className="mx-auto w-full px-4 flex-1 flex flex-col min-h-0">
          {/* ================= HEADER ================= */}
          <div className="mb-6 flex-shrink-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Users Management</h1>
                <p className="text-slate-600 text-sm mt-1">
                  Manage platform users and access control
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 border border-sky-200 px-4 py-2">
                <User className="h-4 w-4 text-sky-600" />
                <span className="text-sm font-semibold text-sky-700">
                  Total: {
                    activeTab === "all" ? totalUsers :
                    activeTab === "pending" ? totalUsers :
                    activeTab === "suspended" ? suspendedUsers.length :
                    activeTab === "flagged" ? flaggedUsers.length :
                    tickets.length
                  }
                </span>
              </div>
            </div>
          </div>

          {/* ================= STATS CARDS ================= */}
          {activeTab === "help-center" ? (
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3 flex-shrink-0 animate-in fade-in duration-300">
              {/* All Tickets */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      All Tickets
                    </p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {ticketStats.all}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                    <Ticket className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Mark as Solved */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Mark as Solved
                    </p>
                    <p className="mt-2 text-3xl font-bold text-emerald-600">
                      {ticketStats.solved}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                    <BadgeCheck className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </div>

              {/* Total Assigned Tickets */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Total Assigned Tickets
                    </p>
                    <p className="mt-2 text-3xl font-bold text-purple-600">
                      {ticketStats.assigned}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50">
                    <UserCheck className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 flex-shrink-0">
              {/* Verified Users */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Verified Users
                    </p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {stats.totalVerifiedUserSellers}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                    <CheckCircle className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </div>

              {/* Listed Vehicles */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Listed Vehicles
                    </p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {stats.totalListedVehicles}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50">
                    <Car className="h-6 w-6 text-sky-600" />
                  </div>
                </div>
              </div>

              {/* Flagged Users */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Flagged Users
                    </p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {stats.totalActiveFlaggedUserSellers}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50">
                    <Flag className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </div>

              {/* Suspended Users */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Suspended Users
                    </p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {stats.totalSuspendedUserSellers}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50">
                    <UserX className="h-6 w-6 text-rose-600" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TABS ================= */}
          <div className="mb-4 flex-shrink-0">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setActiveTab("all");
                  setPage(1);
                }}
                className={`px-6 py-3 text-sm font-semibold transition-all rounded-lg ${activeTab === "all"
                  ? "bg-sky-100 text-sky-700 border border-sky-200"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  All Sellers
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab("pending");
                  setPage(1);
                }}
                className={`px-6 py-3 text-sm font-semibold transition-all rounded-lg ${activeTab === "pending"
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Pending
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab("suspended");
                  setPage(1);
                }}
                className={`px-6 py-3 text-sm font-semibold transition-all rounded-lg ${activeTab === "suspended"
                  ? "bg-rose-100 text-rose-700 border border-rose-200"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <Ban className="h-4 w-4" />
                  Suspended
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab("flagged");
                  setPage(1);
                }}
                className={`px-6 py-3 text-sm font-semibold transition-all rounded-lg ${activeTab === "flagged"
                  ? "bg-amber-100 text-amber-700 border border-amber-200"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4" />
                  Flagged
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab("help-center");
                  setPage(1);
                }}
                className={`px-6 py-3 text-sm font-semibold transition-all rounded-lg ${activeTab === "help-center"
                  ? "bg-blue-100 text-blue-700 border border-blue-205"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <Ticket className="h-4 w-4" />
                  Help Center
                </div>
              </button>
            </div>
          </div>

          {/* ================= SEARCH BAR FOR ALL USERS ================= */}
          {activeTab === "all" && (
            <div className="mb-4 flex-shrink-0 flex items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm text-left animate-in fade-in duration-300">
              <div className="relative flex-1 max-w-md">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search users by name, email, phone..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-[13.5px] font-medium text-slate-900 outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-100 placeholder:text-slate-400"
                />
              </div>
              <button
                onClick={handleRefreshUsers}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[13px] font-bold text-slate-700 transition-all hover:bg-slate-50 active:scale-95 shadow-sm"
                type="button"
              >
                <RefreshCw className="h-4 w-4 text-slate-500" />
                Refresh
              </button>
            </div>
          )}

          {/* ================= TABLE CARD ================= */}
          <div className="flex-1 flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden min-h-0">
            <div className="flex-1 overflow-auto">
              {activeTab === "all" && (
                <table className="w-full min-w-[1100px]">
                  <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                    <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-4 py-4">Phone</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-4 py-4">Role</th>
                      <th className="px-4 py-4">Verification Status</th>
                      <th className="px-4 py-4">Register At</th>
                      {/* <th className="px-4 py-4">Updated At</th> */}
                      <th className="px-6 py-4 text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {users.map((u) => (
                      <tr
                        key={u.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                              <User className="w-5 h-5 text-sky-600" />
                            </div>
                            <div className="min-w-0">
                              <p
                                onClick={() => handleViewUser(u.id)}
                                title="View user details"
                                className="font-semibold text-slate-900 cursor-pointer hover:text-blue-600"
                              >
                                {u.firstname} {u.lastname}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-700">
                            <p className="truncate">{(u?.email) ? u.email : "-"}</p>
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-700">
                            {u.countryCode} {u.phoneNumber}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${u.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : "bg-rose-100 text-rose-700 border border-rose-200"
                            }`}>
                            {u.status}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                            {formatEnumLabel(u.userRole)}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${getVerificationStatusColor(u.verificationStatus)}`}>
                            {formatEnumLabel(u.verificationStatus) || "-"}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-700">
                            {new Date(u.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </td>

                        {/* <td className="px-4 py-4">
                          <span className="text-sm text-slate-700">
                            {new Date(u.updatedAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </td> */}

                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleViewUser(u.id)}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg
                              bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "pending" && (
                <table className="w-full min-w-[1100px]">
                  <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                    <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-4 py-4">Phone</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-4 py-4">Role</th>
                      <th className="px-4 py-4">Verification Status</th>
                      <th className="px-4 py-4">Created At</th>
                      <th className="px-6 py-4 text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {pendingUsers.map((u) => (
                      <tr
                        key={u.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <p
                                onClick={() => handleViewUser(u.id)}
                                title="View user details"
                                className="font-semibold text-slate-900 cursor-pointer hover:text-blue-600"
                              >
                                {u.firstname} {u.lastname}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-700">
                            <p className="truncate">{(u?.email) ? u.email : "-"}</p>
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-700">
                            {u.countryCode} {u.phoneNumber}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${u.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : "bg-rose-100 text-rose-700 border border-rose-200"
                            }`}>
                            {u.status}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                            {formatEnumLabel(u.userRole)}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${getVerificationStatusColor(u.verificationStatus)}`}>
                            {formatEnumLabel(u.verificationStatus) || "-"}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-700">
                            {new Date(u.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleViewUser(u.id)}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg
                              bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "suspended" && (
                <table className="w-full min-w-[1100px]">
                  <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                    <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                      <th className="px-6 py-4">User</th>
                      <th className="px-4 py-4">City</th>
                      <th className="px-4 py-4">Reason</th>
                      <th className="px-4 py-4">Type</th>
                      <th className="px-4 py-4">Suspend Until</th>
                      <th className="px-4 py-4">Suspended At</th>
                      <th className="px-6 py-4 text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {suspendedUsers.map((u) => (
                      <tr
                        key={u.suspensionId}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                              <User className="w-5 h-5 text-rose-600" />
                            </div>
                            <div className="min-w-0">
                              <p
                                onClick={() => handleViewUser(u.id)}
                                title="View user details"
                                className="font-semibold text-slate-900 cursor-pointer hover:text-blue-600"
                              >
                                {u.firstname} {u.lastname}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-700">{u.city || "-"}</span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-700 line-clamp-2 max-w-xs">
                            {u.reason}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${u.suspenseType === "PERMANENT"
                            ? "border-rose-200 bg-rose-50 text-rose-700"
                            : "border-amber-200 bg-amber-50 text-amber-700"
                            }`}>
                            {formatEnumLabel(u.suspenseType)}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-700">
                            {u.suspendUntil
                              ? new Date(u.suspendUntil).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                              : "-"}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-700">
                            {new Date(u.suspendedAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleViewUser(u.userId)}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg
                              bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "flagged" && (
                <table className="w-full min-w-[1200px]">
                  <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                    <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                      <th className="px-6 py-4">User</th>
                      <th className="px-4 py-4">City</th>
                      <th className="px-4 py-4">Category</th>
                      <th className="px-4 py-4">Severity</th>
                      <th className="px-4 py-4">Notes</th>
                      <th className="px-4 py-4 text-center">Status</th>
                      <th className="px-4 py-4">Flagged At</th>
                      <th className="px-6 py-4 text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {flaggedUsers.map((u) => (
                      <tr
                        key={u.flagReviewId}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                              <User className="w-5 h-5 text-amber-600" />
                            </div>
                            <div className="min-w-0">
                              <p
                                onClick={() => handleViewUser(u.id)}
                                title="View user details"
                                className="font-semibold text-slate-900 cursor-pointer hover:text-blue-600"
                              >
                                {u.firstname} {u.lastname}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-700">{u.city || "-"}</span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                            {formatEnumLabel(u.flagCategory)}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${u.severity === "HIGH"
                            ? "border-rose-200 bg-rose-50 text-rose-700"
                            : u.severity === "MODERATE"
                              ? "border-amber-200 bg-amber-50 text-amber-700"
                              : "border-blue-200 bg-blue-50 text-blue-700"
                            }`}>
                            {u.severity}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-700 line-clamp-2 max-w-xs">
                            {u.internalNotes}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-center">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${u.isResolved
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-700"
                            }`}>
                            {u.isResolved ? "Resolved" : "Pending"}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-700">
                            {new Date(u.flaggedAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleViewUser(u.userId)}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg
                              bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "help-center" && (
                <div className="flex flex-col h-full overflow-hidden">
                  {/* Filters and Search */}
                  <div className="relative z-10 border-b border-slate-200 px-4 py-4 md:px-6 flex-shrink-0 text-left bg-white">
                    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                      <div className="flex flex-1 flex-col gap-3 lg:flex-row">
                        <div className="relative min-w-0 flex-1 max-w-xl">
                          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <input
                            value={ticketSearch}
                            onChange={(e) => setTicketSearch(e.target.value)}
                            placeholder="Search ticket ID, user name, subject, category..."
                            className="h-11 md:h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-[13px] md:text-[14px] font-medium text-slate-900 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400"
                          />
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {/* Status Filter */}
                          <div className="relative min-w-[140px]">
                            <select
                              value={ticketStatusFilter}
                              onChange={(e) => setTicketStatusFilter(e.target.value)}
                              className="h-11 md:h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-10 text-[13px] font-semibold text-slate-900 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100 cursor-pointer"
                            >
                              <option value="">All Statuses</option>
                              <option value="OPEN">Open</option>
                              <option value="ASSIGNED">Assigned</option>
                              <option value="SOLVED">Solved</option>
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          </div>

                          {/* Priority Filter */}
                          <div className="relative min-w-[140px]">
                            <select
                              value={ticketPriorityFilter}
                              onChange={(e) => setTicketPriorityFilter(e.target.value)}
                              className="h-11 md:h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-10 text-[13px] font-semibold text-slate-900 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100 cursor-pointer"
                            >
                              <option value="">All Priorities</option>
                              <option value="CRITICAL">Critical</option>
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
                            setTicketSearch("");
                            setTicketStatusFilter("");
                            setTicketPriorityFilter("");
                          }}
                          className="inline-flex h-11 md:h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-[13px] font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
                          type="button"
                        >
                          Clear Filters
                        </button>

                        <button
                          onClick={handleRefreshTickets}
                          disabled={ticketsRefreshing || ticketsLoading}
                          className="inline-flex h-11 md:h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-[13px] font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                          type="button"
                        >
                          {ticketsRefreshing || ticketsLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                          Refresh
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="flex-1 overflow-auto">
                    <table className="min-w-[1200px] w-full border-separate border-spacing-0">
                      <thead>
                        <tr className="bg-slate-50/80 backdrop-blur-sm">
                          <th className="border-b border-r border-slate-200/60 px-6 py-4.5 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90">
                            USER
                          </th>
                          <th className="border-b border-r border-slate-200/60 px-6 py-4.5 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90">
                            SUBJECT
                          </th>
                          <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90">
                            CATEGORY
                          </th>
                          <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90">
                            PRIORITY
                          </th>
                          <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90">
                            CREATED AT
                          </th>
                          <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90">
                            ASSIGNED TO
                          </th>
                          <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90">
                            STATUS
                          </th>
                          <th className="border-b border-slate-200 px-6 py-4.5 text-right text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90">
                            ACTIONS
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100 text-left">
                        {ticketsLoading ? (
                          <tr>
                            <td colSpan={9} className="px-6 py-24 text-center">
                              <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
                                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
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

                              <td className="border-b border-slate-100 px-6 py-4 align-middle">
                                <div className="flex items-center gap-3">
                                  <ConsultantLogo src={item.logoUrl} alt={item.consultantName} />
                                  <span className="text-[14px] font-bold text-slate-900 whitespace-nowrap">
                                    {item.consultantName}
                                  </span>
                                </div>
                              </td>

                              <td className="border-b border-slate-100 px-6 py-4 align-middle min-w-[260px] max-w-[400px]">
                                <div
                                  onClick={() => {
                                    navigate(`/admin/users/help-center/${item.id}`);
                                  }}
                                  className="truncate text-[13.5px] font-semibold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
                                  title={item.subject}
                                >
                                  {item.subject}
                                </div>
                              </td>

                              <td className="border-b border-slate-100 px-5 py-4 text-center align-middle">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold">
                                  <Tag size={12} className="text-slate-400" />
                                  {item.category}
                                </span>
                              </td>

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

                              <td className="border-b border-slate-100 px-5 py-4 text-center align-middle">
                                <div className="inline-flex items-center gap-2 text-[12.5px] font-medium text-slate-500 whitespace-nowrap">
                                  <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                                  {new Date(item.createdAt).toLocaleString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                              </td>

                              <td className="border-b border-slate-100 px-5 py-4 text-center align-middle">
                                <div className="text-[13px] font-semibold text-slate-700 whitespace-nowrap">
                                  {item.assignedTo ? (
                                    <span className="text-slate-800">{item.assignedTo}</span>
                                  ) : (
                                    <span className="text-slate-400 italic">Unassigned</span>
                                  )}
                                </div>
                              </td>

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
                                          onClick={() => {
                                            navigate(`/admin/users/help-center/${item.id}`);
                                            setActiveMenuId(null);
                                          }}
                                          className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                                        >
                                          <Eye size={12} className="text-slate-400" />
                                          View Ticket
                                        </button>
                                        {!isResolved && (
                                          <>
                                            <button
                                              onClick={() => {
                                                setSelectedTicket(item);
                                                setAssigneeName(item.assignedTo || "");
                                                setIsAssignModalOpen(true);
                                                setActiveMenuId(null);
                                              }}
                                              className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                                            >
                                              <UserCheck size={12} className="text-slate-400" />
                                              Assign To...
                                            </button>
                                            <button
                                              onClick={() => {
                                                setSelectedTicket(item);
                                                setIsSolveModalOpen(true);
                                                setActiveMenuId(null);
                                              }}
                                              className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition-colors border-t border-slate-100"
                                            >
                                              <CheckCircle size={12} className="text-emerald-500" />
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
              )}
            </div>

            {/* ================= PAGINATION ================= */}
            {(activeTab === "all" || activeTab === "pending") && totalPages > 1 && (
              <div className="flex justify-between items-center px-6 py-4 border-t border-slate-200 bg-slate-50 flex-shrink-0">
                <p className="text-sm text-slate-600">
                  Page {page} of {totalPages}
                </p>

                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {activeTab === "help-center" && (
              <div className="flex shrink-0 flex-col gap-2 border-t border-slate-200 bg-white px-5 py-4 md:flex-row md:items-center md:justify-between">
                <div className="text-sm text-slate-500">
                  Showing <span className="font-semibold text-slate-900">{paginatedTickets.length}</span> of{" "}
                  <span className="font-semibold text-slate-900">{ticketTotalElements}</span> tickets
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
            )}
          </div>
        </div>
      </div>


      {/* ASSIGN TO MODAL */}
      {isAssignModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-[380px] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-gradient-to-br from-slate-50 via-white to-slate-50/50 text-left">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md">
                  <UserPlus size={14} />
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm">Assign Ticket</h3>
              </div>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center border border-slate-200"
              >
                <X size={14} className="text-slate-500" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-left">
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
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="px-3.5 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700"
              >
                Cancel
              </button>
              <button
                disabled={!assigneeName.trim()}
                onClick={() => handleConfirmAssign(assigneeName.trim())}
                className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-colors animate-in duration-200"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MARK AS SOLVED MODAL */}
      {isSolveModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-[420px] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-gradient-to-br from-slate-50 via-white to-slate-50/50 text-left">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md">
                  <BadgeCheck size={16} />
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm">Mark as Solved</h3>
              </div>
              <button
                onClick={() => { setIsSolveModalOpen(false); setSolveRemarks(""); }}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center border border-slate-200"
              >
                <X size={14} className="text-slate-500" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-left">
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                Are you sure you want to mark this ticket as resolved?
              </p>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Resolution Remarks (Optional)
                </label>
                <textarea
                  value={solveRemarks}
                  onChange={(e) => setSolveRemarks(e.target.value)}
                  placeholder="Enter comments or resolution details..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-2xl text-xs font-semibold outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 placeholder:text-slate-400 resize-none"
                />
              </div>
              <p className="text-[10px] text-slate-400 italic">
                This will update the ticket status to{" "}
                <span className="text-emerald-600 font-semibold">RESOLVED</span> and notify the user that their request has been resolved.
              </p>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                disabled={solving}
                onClick={() => { setIsSolveModalOpen(false); setSolveRemarks(""); }}
                className="px-3.5 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                disabled={solving}
                onClick={handleConfirmSolve}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
              >
                {solving && <Loader2 className="h-3 w-3 animate-spin" />}
                Confirm Resolve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
