import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  ArrowLeft,
  Search,
  MessageSquare,
  AlertTriangle,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  X,
  Clock3,
  User,
  BadgeCheck,
  Loader2,
  Phone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { getVehicleInquiries } from "../../../../../api/vehicle.api";
import toast from "react-hot-toast";

const cls = (...a) => a.filter(Boolean).join(" ");

/* =========================================================
   HELPERS
========================================================= */
const formatDateTime = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const inquiryStatusBadge = (status) => {
  const s = String(status || "").toUpperCase();

  const map = {
    APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    OPEN: "bg-emerald-50 text-emerald-700 border-emerald-200",
    FOLLOW_UP: "bg-amber-50 text-amber-700 border-amber-200",
    CLOSED: "bg-slate-100 text-slate-700 border-slate-200",
    CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return map[s] || "bg-slate-100 text-slate-700 border-slate-200";
};

function TopCard({ title, value, icon: Icon = User, colorClass = "text-slate-900" }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent opacity-70" />
      <div className="relative z-10 flex items-end justify-between">
        <div>
          <div className="mb-2 text-[12px] font-bold uppercase tracking-[0.15em] text-slate-400">
            {title}
          </div>
          <div className={cls("text-3xl font-extrabold tracking-tight", colorClass)}>
            {value}
          </div>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-500">
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ROW ACTIONS
========================================================= */
function InquiryRowActions({ item, onViewChat, onMarkSuspicious }) {
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
    <div className="relative inline-flex justify-center" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className={cls(
          "inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200",
          open
            ? "border-sky-300 bg-sky-50 text-sky-600 shadow-md ring-4 ring-sky-100"
            : "border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50 hover:text-slate-900"
        )}
        type="button"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="absolute right-0 top-11 z-[60] w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
          >
            <button
              onClick={() => {
                onViewChat(item);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-bold text-slate-700 transition hover:bg-slate-50 active:scale-95"
              type="button"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm">
                <Eye className="h-4 w-4 text-slate-500" />
              </div>
              View Chat Logs
            </button>

            <button
              onClick={() => {
                onMarkSuspicious(item);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-bold text-rose-700 transition hover:bg-rose-50 active:scale-95"
              type="button"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-100 bg-rose-50 shadow-sm">
                <AlertTriangle className="h-4 w-4" />
              </div>
              Mark Suspicious
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* =========================================================
   PAGINATION
========================================================= */
function PaginationBar({ page, totalPages, totalCount, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-end">
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
        <span className="text-sm text-slate-500">{totalCount} total</span>

        <button
          disabled={page <= 1}
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
          disabled={page >= totalPages}
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
   CHAT LOG MODAL
========================================================= */
function ChatLogsModal({ open, inquiry, onClose }) {
  if (!open || !inquiry) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 bg-gradient-to-r from-sky-50 to-white px-6 py-5">
          <div>
            <h3 className="text-2xl font-extrabold tracking-tight text-slate-900">Chat Logs</h3>
            <p className="mt-1 text-sm font-bold text-slate-500 uppercase">
              Buyer: {inquiry.buyerName}
            </p>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
          {inquiry.chatLogs?.length ? (
            <div className="space-y-4">
              {inquiry.chatLogs.map((msg) => {
                const isBuyer = msg.sender === "Buyer";

                return (
                  <div
                    key={msg.id}
                    className={cls(
                      "flex",
                      isBuyer ? "justify-start" : "justify-end"
                    )}
                  >
                    <div
                      className={cls(
                        "max-w-[78%] rounded-2xl border px-5 py-4 shadow-sm transition-all",
                        isBuyer
                          ? "border-white bg-white text-slate-800"
                          : "border-sky-100 bg-sky-50 text-slate-900"
                      )}
                    >
                      <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        {msg.sender}
                      </div>
                      <p className="text-[14px] leading-relaxed font-medium">{msg.text}</p>
                      <div className="mt-2 text-[11px] font-semibold text-slate-400">
                        {formatDateTime(msg.time)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-200 bg-white text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <MessageSquare className="h-6 w-6" />
              </div>
              <p className="text-[15px] font-bold text-slate-900 uppercase tracking-widest">
                No chat logs available
              </p>
              <p className="mt-1 text-[13px] text-slate-500">There are no interaction records for this inquiry yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN
========================================================= */
const ViewInquiries = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalInquiries: 0,
    openInquiries: 0,
    chatInitiated: 0,
    suspicious: 0,
    inquiries: []
  });

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, [id]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await getVehicleInquiries(id);
      setData(res?.data || { inquiries: [] });
    } catch (e) {
      console.error(e);
      toast.error("Failed to fetch inquiries");
    } finally {
      setLoading(false);
    }
  };

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = data.inquiries || [];
    if (!q) return rows;

    return rows.filter((item) => {
      return (
        String(item.buyerName || "").toLowerCase().includes(q) ||
        String(item.buyerPhone || "").toLowerCase().includes(q) ||
        String(item.status || "").toLowerCase().includes(q)
      );
    });
  }, [data.inquiries, search]);

  const totalCount = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleViewChat = (item) => {
    setSelectedInquiry(item);
    setChatOpen(true);
  };

  const handleMarkSuspicious = (item) => {
    toast.success("Flagged as suspicious");
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
        <p className="mt-4 text-sm font-medium text-slate-500 tracking-wide">Fetching Inquiries...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden p-6">
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

      <div className="flex flex-1 flex-col space-y-6 overflow-hidden">
        <section className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between shrink-0">
          <div>
            <button
              onClick={() => navigate(-1)}
              type="button"
              className="mb-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Back
            </button>

            <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900">
              Vehicle Inquiries
            </h1>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 shrink-0">
          <TopCard title="Total Inquiries" value={data.totalInquiries || 0} icon={User} />
          <TopCard
            title="Open"
            value={data.openInquiries || 0}
            icon={Clock3}
            colorClass="text-emerald-500"
          />
          <TopCard
            title="Chat Initiated"
            value={data.chatInitiated || 0}
            icon={MessageSquare}
            colorClass="text-sky-500"
          />
          <TopCard
            title="Suspicious"
            value={data.suspicious || 0}
            icon={ShieldAlert}
            colorClass="text-rose-500"
          />
        </section>

        <section className="relative flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 bg-sky-100 blur-[100px] opacity-20" />

          <div className="relative z-10 shrink-0 border-b border-slate-200 p-5 md:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="relative max-w-2xl flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by buyer name, phone, status..."
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
            </div>
          </div>

          <div className="table-scroll relative z-10 flex-1 w-full overflow-auto">
            <table className="min-w-[1100px] w-full border-separate border-spacing-0">
              <thead className="sticky top-0 z-20">
                <tr className="bg-slate-50/80 backdrop-blur-sm">
                  <th className="border-b border-r border-slate-200/60 px-6 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                    Buyer
                  </th>
                  <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                    Buyer Phone
                  </th>
                  <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                    Status
                  </th>
                  <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                    Date
                  </th>
                  <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                    Chat Initiated
                  </th>
                  <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                    Flags
                  </th>
                  <th className="border-b border-slate-200 px-6 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {paginatedRows.length ? (
                  paginatedRows.map((row, idx) => (
                    <motion.tr
                      key={row.inquiryId || idx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group transition-colors duration-200 hover:bg-slate-50 text-center"
                    >
                      <td className="border-b border-slate-100 px-6 py-4.5">
                        <div className="flex items-center justify-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 shrink-0">
                            <span className="text-xs font-bold text-slate-500">
                              {(row.buyerName || "B").charAt(0)}
                            </span>
                          </div>

                          <div className="text-[14px] font-bold text-slate-900 truncate max-w-[150px]">
                            {row.buyerName || "-"}
                          </div>
                        </div>
                      </td>

                      <td className="border-b border-slate-100 px-5 py-4.5">
                        <div className="flex items-center justify-center gap-2 text-[13px] font-semibold text-slate-600">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          {row.buyerPhone || "-"}
                        </div>
                      </td>

                      <td className="border-b border-slate-100 px-5 py-4.5">
                        <div className="flex justify-center">
                          <span
                            className={cls(
                              "inline-flex whitespace-nowrap rounded-md border px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-widest",
                              inquiryStatusBadge(row.status)
                            )}
                          >
                            {String(row.status || "UNKNOWN").replaceAll("_", " ")}
                          </span>
                        </div>
                      </td>

                      <td className="border-b border-slate-100 whitespace-nowrap px-5 py-4.5 text-[13px] font-medium text-slate-600">
                        {formatDateTime(row.date)}
                      </td>

                      <td className="border-b border-slate-100 px-5 py-4.5">
                        <div className="flex justify-center">
                          <span
                            className={cls(
                              "inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-widest",
                              row.chatInitiated
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            )}
                          >
                            {row.chatInitiated ? (
                              <BadgeCheck className="h-3.5 w-3.5" />
                            ) : null}
                            {row.chatInitiated ? "Yes" : "No"}
                          </span>
                        </div>
                      </td>

                      <td className="border-b border-slate-100 px-5 py-4.5">
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          {String(row.flags).trim() ? (
                            <span className="inline-flex rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-amber-700">
                              {row.flags}
                            </span>
                          ) : (
                            <span className="inline-flex rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-slate-600">
                              —
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="border-b border-slate-100 px-6 py-4.5">
                        <div className="flex justify-center">
                          <InquiryRowActions
                            item={row}
                            onViewChat={handleViewChat}
                            onMarkSuspicious={handleMarkSuspicious}
                          />
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-28 text-center border-b border-slate-100">
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-400">
                          <Search size={28} />
                        </div>

                        <div className="text-lg font-bold tracking-tight text-slate-900">
                          No inquiries found
                        </div>

                        <div className="mx-auto mt-1 max-w-sm text-[14px] text-slate-500">
                          Try adjusting your search to see matching vehicle
                          inquiries.
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="shrink-0 border-t border-slate-100 bg-white px-8 py-5">
            <PaginationBar
              page={page}
              totalPages={totalPages}
              totalCount={totalCount}
              onPageChange={setPage}
            />
          </div>
        </section>
      </div>

      <ChatLogsModal
        open={chatOpen}
        inquiry={selectedInquiry}
        onClose={() => {
          setChatOpen(false);
          setSelectedInquiry(null);
        }}
      />
    </div>
  );
};

export default ViewInquiries;