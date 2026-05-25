import React, { useState, useMemo, useEffect, useRef } from "react";
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
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getHelpTickets } from "../../../api/consultationApi";

const cls = (...classes) => classes.filter(Boolean).join(" ");

const FALLBACK_LOGO =
  "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=600&auto=format&fit=crop&q=60";

const agentsList = [
  "Sarah Jenkins",
  "David Vance",
  "Diana Prince",
  "Alex Mercer",
  "Bruce Wayne",
];

const initialTickets = [
  {
    id: "TCK-4812",
    consultantId: "C-901",
    consultantName: "Apex Motors",
    logoUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&auto=format&fit=crop&q=60",
    subject: "Storefront customization page throwing 500 error",
    category: "Storefront",
    priority: "HIGH",
    status: "OPEN",
    assignedTo: null,
    createdAt: "2026-05-24T10:15:30Z",
    description: "Whenever we try to save our storefront's advanced custom color scheme, the page crashes with a 500 Internal Server Error. Our logo is updated, but other modifications are lost.",
    messages: [
      { sender: "Apex Motors", text: "We need this fixed urgently, we have a campaign running starting tomorrow.", time: "2026-05-24T10:16:00Z" }
    ]
  },
  {
    id: "TCK-4813",
    consultantId: "C-902",
    consultantName: "Elite Auto Consult",
    logoUrl: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100&auto=format&fit=crop&q=60",
    subject: "Failed billing attempt for Premium Plan Activation",
    category: "Billing",
    priority: "CRITICAL",
    status: "ASSIGNED",
    assignedTo: "Sarah Jenkins",
    createdAt: "2026-05-23T14:22:10Z",
    description: "The payment succeeded on our credit card, but our account tier still shows 'Inactive' or 'Basic'. Please activate our Premium tier benefits immediately as we are losing leads.",
    messages: [
      { sender: "Sarah Jenkins", text: "Hi Elite Auto Consult, I am checking with our billing team. The transaction looks successful, we should have this activated in 15 minutes.", time: "2026-05-23T14:30:00Z" }
    ]
  },
  {
    id: "TCK-4814",
    consultantId: "C-903",
    consultantName: "Signature Auto Group",
    logoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=60",
    subject: "Unable to upload vehicle listing inspection report",
    category: "Verification",
    priority: "MEDIUM",
    status: "SOLVED",
    assignedTo: "Sarah Jenkins",
    createdAt: "2026-05-22T09:05:00Z",
    description: "The PDF upload fails at 99% with a network timeout. The report size is 12MB. Can you help verify if there is a file size limit?",
    messages: [
      { sender: "Sarah Jenkins", text: "We have increased the file upload limit to 25MB for your account. Please try again.", time: "2026-05-22T10:12:00Z" },
      { sender: "Signature Auto Group", text: "Thank you! Uploaded successfully. You can close this ticket.", time: "2026-05-22T10:30:00Z" }
    ]
  },
  {
    id: "TCK-4815",
    consultantId: "C-904",
    consultantName: "Prestige Auto Center",
    logoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=60",
    subject: "Custom domain mapping request details",
    category: "Storefront",
    priority: "LOW",
    status: "OPEN",
    assignedTo: null,
    createdAt: "2026-05-25T11:40:00Z",
    description: "We would like to map our own domain 'prestigeautocenter.com' to our Reecomm storefront. Please provide the CNAME and A record details.",
    messages: []
  },
  {
    id: "TCK-4816",
    consultantId: "C-905",
    consultantName: "Vanguard Dealership",
    logoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60",
    subject: "Account recovery for senior agent",
    category: "Account",
    priority: "HIGH",
    status: "ASSIGNED",
    assignedTo: "David Vance",
    createdAt: "2026-05-25T08:30:00Z",
    description: "Our agent lost access to their 2FA backup codes and changed phone numbers. We need manual verification to reset the 2FA configurations.",
    messages: [
      { sender: "David Vance", text: "Please send over the government business registry documents for verification.", time: "2026-05-25T09:00:00Z" }
    ]
  },
];

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
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_LOGO);

  useEffect(() => {
    setImgSrc(src || FALLBACK_LOGO);
  }, [src]);

  return (
    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-[0_2px_8px_rgba(15,23,42,0.05)]">
      <img
        src={imgSrc}
        alt={alt}
        loading="lazy"
        onError={() => setImgSrc(FALLBACK_LOGO)}
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
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isSolveModalOpen, setIsSolveModalOpen] = useState(false);
  
  // Custom dropdown reference for active menu
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  // New message input in detail view
  const [newMessage, setNewMessage] = useState("");

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const payload = {
        pageNo: ticketPage,
        ticketStatus: statusFilter || null,
        priority: priorityFilter || null,
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
        toast.error("Failed to fetch tickets from server");
      }
    } catch (err) {
      console.error(err);
      // Fallback: if there are no loaded tickets, load initial mock tickets as demo fallback
      if (tickets.length === 0) {
        const mappedMock = initialTickets.map((item) => ({
          ...item,
          consultantName: item.userFullName || item.consultantName || "Consultant",
          status: item.ticketStatus || item.status || "OPEN",
        }));
        setTickets(mappedMock);
        setTotalPages(1);
        setTotalElements(mappedMock.length);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [ticketPage, statusFilter, priorityFilter]);

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
    const q = searchText.trim().toLowerCase();
    return tickets.filter((item) => {
      const consultantName = item.userFullName || item.consultantName || "";
      const status = item.ticketStatus || item.status || "";

      const matchesSearch =
        !q ||
        String(item.id).toLowerCase().includes(q) ||
        String(consultantName).toLowerCase().includes(q) ||
        String(item.subject).toLowerCase().includes(q) ||
        String(item.category).toLowerCase().includes(q) ||
        String(item.description).toLowerCase().includes(q);

      const matchesStatus = !statusFilter || status === statusFilter;
      const matchesPriority = !priorityFilter || item.priority === priorityFilter;
      const matchesCategory = !categoryFilter || item.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });
  }, [tickets, searchText, statusFilter, priorityFilter, categoryFilter]);

  useEffect(() => {
    setTicketPage(1);
  }, [searchText, statusFilter, priorityFilter, categoryFilter]);

  const totalTicketPages = totalPages;

  const paginatedTickets = filteredTickets;

  const stats = useMemo(() => {
    return {
      all: tickets.length,
      solved: tickets.filter((t) => (t.ticketStatus || t.status) === "SOLVED").length,
      assigned: tickets.filter((t) => (t.ticketStatus || t.status) === "ASSIGNED" || t.assignedTo).length,
    };
  }, [tickets]);

  // Actions
  const handleOpenView = (ticket) => {
    setSelectedTicket(ticket);
    setIsViewModalOpen(true);
    setActiveMenuId(null);
  };

  const handleOpenAssign = (ticket) => {
    setSelectedTicket(ticket);
    setIsAssignModalOpen(true);
    setActiveMenuId(null);
  };

  const handleOpenSolve = (ticket) => {
    setSelectedTicket(ticket);
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

  const handleConfirmSolve = () => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id ? { ...t, status: "SOLVED" } : t
      )
    );
    toast.success("Ticket marked as solved successfully");
    setIsSolveModalOpen(false);
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
                      Ticket ID
                    </th>
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
                        {/* ID */}
                        <td className="border-b border-slate-100 px-6 py-4 align-middle font-mono font-bold text-xs text-slate-900">
                          {item.id}
                        </td>

                        {/* Consultant */}
                        <td className="border-b border-slate-100 px-6 py-4 align-middle">
                          <div className="flex items-center gap-3">
                            <ConsultantLogo src={item.logoUrl} alt={item.consultantName} />
                            <span className="text-[14px] font-bold text-slate-900 whitespace-nowrap">
                              {item.consultantName}
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

                            {activeMenuId === item.id && (
                              <div className="absolute right-6 mt-1 w-48 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-100 text-left">
                                <button
                                  onClick={() => handleOpenView(item)}
                                  className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                  <Eye size={14} className="text-slate-400" />
                                  View Ticket
                                </button>
                                <button
                                  onClick={() => handleOpenAssign(item)}
                                  className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                  <UserPlus size={14} className="text-slate-400" />
                                  Assign To...
                                </button>
                                {item.status !== "SOLVED" && (
                                  <button
                                    onClick={() => handleOpenSolve(item)}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-[13px] font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors border-t border-slate-100"
                                  >
                                    <CheckCircle2 size={14} className="text-emerald-500" />
                                    Mark as Solved
                                  </button>
                                )}
                              </div>
                            )}
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

      {/* VIEW TICKET MODAL */}
      {isViewModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-[700px] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
                  <Ticket size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 leading-tight">
                    {selectedTicket.id}: {selectedTicket.subject}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Submitted by <span className="font-bold text-slate-800">{selectedTicket.consultantName}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center border border-slate-200"
              >
                <X size={16} className="text-slate-500" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-5 overflow-y-auto flex-1 space-y-5 bg-slate-50/30">
              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-4 bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Priority</span>
                  <span className={cls("inline-block rounded-full border px-2.5 py-0.5 text-xs font-bold mt-1", priorityBadge(selectedTicket.priority))}>
                    {selectedTicket.priority}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Status</span>
                  <span className={cls("inline-block rounded-full border px-2.5 py-0.5 text-xs font-bold mt-1", statusBadge(selectedTicket.status))}>
                    {selectedTicket.status}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Assigned Agent</span>
                  <span className="text-xs font-semibold text-slate-700 block mt-1">
                    {selectedTicket.assignedTo || <span className="text-slate-400 italic">Unassigned</span>}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Submitted At</span>
                  <span className="text-xs font-semibold text-slate-700 block mt-1">
                    {formatTime(selectedTicket.createdAt)}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider mb-2">Description</span>
                <p className="text-[13.5px] leading-relaxed text-slate-700 whitespace-pre-wrap">
                  {selectedTicket.description}
                </p>
              </div>

              {/* Conversation history */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Agent Responses</span>
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {selectedTicket.messages && selectedTicket.messages.length > 0 ? (
                    selectedTicket.messages.map((m, idx) => {
                      const isAgent = m.sender !== selectedTicket.consultantName;
                      return (
                        <div
                          key={idx}
                          className={cls(
                            "flex flex-col rounded-2xl p-3 border",
                            isAgent
                              ? "bg-blue-50/50 border-blue-100 self-end ml-12"
                              : "bg-white border-slate-200 mr-12"
                          )}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[11px] font-bold text-slate-800">{m.sender}</span>
                            <span className="text-[10px] text-slate-400">{formatTime(m.time)}</span>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed">{m.text}</p>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-4 bg-white border border-slate-200/60 rounded-2xl italic text-xs text-slate-400">
                      No agent responses yet. Type below to send a reply.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Input Reply Box */}
            <form onSubmit={handleSendComment} className="px-6 py-4 border-t border-slate-200 bg-white flex gap-2">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a response to the consultant..."
                className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 text-xs font-bold"
              >
                <Send size={13} />
                Send
              </button>
            </form>
          </div>
        </div>
      )}

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
                Select a support agent to assign to ticket <span className="font-bold text-slate-900">{selectedTicket.id}</span>.
              </p>
              <div className="space-y-1.5">
                {agentsList.map((agent) => (
                  <button
                    key={agent}
                    onClick={() => handleConfirmAssign(agent)}
                    className={cls(
                      "w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-xs font-bold transition-all text-left",
                      selectedTicket.assignedTo === agent
                        ? "bg-purple-50/70 border-purple-400 text-purple-800"
                        : "bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700"
                    )}
                  >
                    <span>{agent}</span>
                    {selectedTicket.assignedTo === agent && (
                      <span className="text-[10px] bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full">Current</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700"
              >
                Cancel
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

            <div className="p-6 space-y-3">
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                Are you sure you want to mark ticket <span className="font-bold text-slate-900">{selectedTicket.id}</span> as resolved?
              </p>
              <p className="text-[11px] text-slate-400 italic">
                This will update the ticket status to <span className="text-emerald-600 font-semibold font-sans">SOLVED</span> and notify the consultant that their request has been resolved.
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
