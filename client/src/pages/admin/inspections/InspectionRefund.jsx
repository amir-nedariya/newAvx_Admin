/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import {
    Search,
    RefreshCw,
    Loader2,
    X,
    DollarSign,
    Clock,
    CreditCard,
    AlertTriangle,
    CheckCircle2,
    User,
    ArrowUpRight,
    Eye,
    FileText,
    MoreHorizontal,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getRefundInspectionPayments } from "../../../api/vehicleInspection.api";
import InspectionRefundDetail from "./modal/InspectionRefundDetail";

const cls = (...classes) => classes.filter(Boolean).join(" ");

// Formats number to Indian currency representation
const moneyIN = (n) => Number(n ?? 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
});

const formatDateTime = (dt) => {
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

/* =========================================================
   Badges & Tones
========================================================= */
const RefundStatusBadge = ({ status }) => {
    const s = String(status || "").toUpperCase();
    const tones = {
        REFUND_REQUESTED: "bg-amber-50 text-amber-700 border-amber-200",
        REFUND_COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
        REFUND_FAILED: "bg-rose-50 text-rose-700 border-rose-200",
    };

    const label = {
        REFUND_REQUESTED: "REFUND REQUESTED",
        REFUND_COMPLETED: "REFUND COMPLETED",
        REFUND_FAILED: "REFUND FAILED",
    };

    return (
        <span className={cls("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-extrabold shadow-sm uppercase tracking-wider", tones[s] || "bg-slate-50 text-slate-700 border-slate-200")}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {label[s] || s || "—"}
        </span>
    );
};

/* =========================================================
   Small UI components
========================================================= */
function TopCard({ title, value, icon: Icon }) {
    return (
        <div className="relative rounded-2xl border border-slate-200 bg-white p-6 overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative z-10 flex items-end justify-between gap-3">
                <div className="min-w-0">
                    <div className="text-[10px] font-extrabold uppercase tracking-[0.15em] mb-2 text-slate-400">
                        {title}
                    </div>
                    <div className="text-3xl font-extrabold tracking-tight text-slate-900 break-words leading-tight font-sans">
                        {value}
                    </div>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 bg-sky-50 border-sky-100 text-sky-600">
                    <Icon size={18} />
                </div>
            </div>
        </div>
    );
}

function RefundRowActions({ item, onView }) {
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
        <div className="relative inline-flex justify-end" ref={ref}>
            <button
                onClick={() => setOpen((p) => !p)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 shadow-sm cursor-pointer"
            >
                <MoreHorizontal className="h-4 w-4" />
            </button>

            {open && (
                <div className="absolute right-0 top-11 z-30 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                    <button
                        onClick={() => {
                            onView(item);
                            setOpen(false);
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                    >
                        <Eye className="h-4 w-4 text-slate-500" />
                        View Details
                    </button>
                </div>
            )}
        </div>
    );
}

/* =========================================================
   InspectionRefund Component
========================================================= */
function InspectionRefund() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("REFUND_REQUESTED"); // "REFUND_REQUESTED", "REFUND_COMPLETED", "REFUND_FAILED"
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalElements: 0 });
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedRefundId, setSelectedRefundId] = useState(null);

    const [tabCounts, setTabCounts] = useState({
        REFUND_REQUESTED: 0,
        REFUND_COMPLETED: 0,
        REFUND_FAILED: 0,
    });

    const TABS = [
        { id: "REFUND_REQUESTED", label: "Refund Requested" },
        { id: "REFUND_FAILED", label: "Refund Failed" },
        { id: "REFUND_COMPLETED", label: "Refund Completed" },
    ];

    // Fetch count stats for all status tabs
    const fetchTabCounts = async () => {
        try {
            getRefundInspectionPayments({ pageNo: 1, refundStatus: "REFUND_REQUESTED" })
                .then((res) => {
                    setTabCounts((prev) => ({
                        ...prev,
                        REFUND_REQUESTED: res?.pageResponse?.totalElements ?? res?.data?.length ?? 0,
                    }));
                })
                .catch((err) => console.error("Requested count fetch error:", err));

            getRefundInspectionPayments({ pageNo: 1, refundStatus: "REFUND_COMPLETED" })
                .then((res) => {
                    setTabCounts((prev) => ({
                        ...prev,
                        REFUND_COMPLETED: res?.pageResponse?.totalElements ?? res?.data?.length ?? 0,
                    }));
                })
                .catch((err) => console.error("Completed count fetch error:", err));

            getRefundInspectionPayments({ pageNo: 1, refundStatus: "REFUND_FAILED" })
                .then((res) => {
                    setTabCounts((prev) => ({
                        ...prev,
                        REFUND_FAILED: res?.pageResponse?.totalElements ?? res?.data?.length ?? 0,
                    }));
                })
                .catch((err) => console.error("Failed count fetch error:", err));
        } catch (err) {
            console.error("Error setting count statistics:", err);
        }
    };

    // Main list fetch
    const fetchRefundPayments = async (pageNo = 1) => {
        setLoading(true);
        try {
            const res = await getRefundInspectionPayments({
                pageNo,
                refundStatus: activeTab,
                searchText: search.trim() || null,
            });

            const data = res?.data || [];
            setRows(Array.isArray(data) ? data : []);

            if (res?.pageResponse) {
                setPagination({
                    currentPage: res.pageResponse.currentPage ?? pageNo,
                    totalPages: res.pageResponse.totalPages ?? 1,
                    totalElements: res.pageResponse.totalElements ?? data.length,
                });
            }
            fetchTabCounts();
        } catch (err) {
            console.error("Refund payments fetch failure:", err);
            toast.error(err?.response?.data?.message || "Failed to load refund transactions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRefundPayments(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    // Debounced search trigger
    useEffect(() => {
        const t = setTimeout(() => fetchRefundPayments(1), 500);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const handleRefresh = () => {
        fetchRefundPayments(pagination.currentPage);
    };

    const handlePageChange = (newPage) => {
        fetchRefundPayments(newPage);
    };

    return (
        <>
            {selectedRefundId ? (
                <InspectionRefundDetail
                    refundId={selectedRefundId}
                    onBack={() => setSelectedRefundId(null)}
                />
            ) : (
                <div className="h-screen flex flex-col bg-slate-50 overflow-hidden relative">
                    <Toaster position="top-right" />

            <style>{`
        .table-scroll::-webkit-scrollbar { height: 6px; width: 6px; }
        .table-scroll::-webkit-scrollbar-track { background: transparent; }
        .table-scroll::-webkit-scrollbar-thumb { background: rgba(148,163,184,0.35); border-radius: 6px; }
        .table-scroll::-webkit-scrollbar-thumb:hover { background: rgba(100,116,139,0.45); }
      `}</style>

            {/* HEADER */}
            <div className="flex-shrink-0 p-6 pb-4">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Inspection Refunds</h1>
                <p className="max-w-3xl text-sm leading-relaxed text-slate-500">
                    Monitor, audit and track fee refunds triggered for vehicle inspections.
                </p>
            </div>

            {/* KPI CARDS */}
            <div className="flex-shrink-0 px-6 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-full">
                    <TopCard
                        title="Refunds Requested"
                        value={tabCounts.REFUND_REQUESTED}
                        icon={AlertTriangle}
                    />
                    <TopCard
                        title="Refunds Completed"
                        value={tabCounts.REFUND_COMPLETED}
                        icon={CheckCircle2}
                    />
                    <TopCard
                        title="Refunds Failed"
                        value={tabCounts.REFUND_FAILED}
                        icon={X}
                    />
                </div>
            </div>

            {/* TABS */}
            <div className="flex-shrink-0 px-6 pb-4">
                <div className="flex flex-wrap items-center gap-3">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cls(
                                "px-6 py-2.5 rounded-full text-[13px] font-bold transition-all duration-200 cursor-pointer",
                                activeTab === tab.id
                                    ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            )}
                        >
                            {tab.label} ({tabCounts[tab.id] ?? 0})
                        </button>
                    ))}
                </div>
            </div>

            {/* TABLE CARD CONTAINER */}
            <div className="flex-1 px-6 pb-6 overflow-hidden flex flex-col">
                <div className="flex-1 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden relative flex flex-col">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-sky-100/40 blur-[100px] pointer-events-none" />

                    {/* SEARCH + FILTER BAR */}
                    <div className="p-5 md:p-6 border-b border-slate-200 flex-shrink-0 relative z-10">
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                            <div className="flex-1 max-w-xl">
                                <div className="relative">
                                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
                                    <input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search by Payment ID, Order ID, User..."
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition-all focus:border-sky-400 placeholder:text-slate-400 font-medium"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    onClick={handleRefresh}
                                    disabled={loading}
                                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 shadow-sm cursor-pointer"
                                    title="Refresh Results"
                                >
                                    <RefreshCw size={15} className={cls(loading && "animate-spin")} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* TABLE SCROLLABLE WRAPPER */}
                    <div className="flex-1 overflow-auto table-scroll relative z-10">
                        {loading && rows.length === 0 ? (
                            <div className="flex h-full items-center justify-center">
                                <div className="flex flex-col items-center gap-3">
                                    <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
                                    <p className="text-sm font-semibold text-slate-500">Retrieving refund listings...</p>
                                </div>
                            </div>
                        ) : rows.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center text-center p-8">
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 border border-slate-200">
                                    <DollarSign size={26} />
                                </div>
                                <h3 className="text-base font-bold text-slate-900">No refund records found</h3>
                                <p className="mt-1 text-xs text-slate-500 max-w-[280px]">
                                    {search ? "No refund results match your current search queries." : "There are no refund transactions recorded under this status."}
                                </p>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse min-w-[1000px]">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider sticky top-0 bg-slate-50/95 backdrop-blur-sm z-10">
                                        <th className="px-6 py-4">Transaction ID</th>
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Paid Amount</th>
                                        <th className="px-6 py-4">Refund Amount</th>
                                        <th className="px-6 py-4">Payment Method</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Requested At</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {rows.map((row) => (
                                        <tr
                                            key={row.id}
                                            className="hover:bg-slate-50/50 transition-colors font-medium text-slate-700 text-sm"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-900 truncate max-w-[180px]" title={row.razorpayPaymentId}>
                                                        {row.razorpayPaymentId || "—"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-extrabold text-xs">
                                                        {row.userFullName?.charAt(0) || "U"}
                                                    </div>
                                                    <span className="font-semibold text-slate-800">{row.userFullName || "Dealer / User"}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-900 font-sans">
                                                ₹{moneyIN(row.amount)}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-sky-600 font-sans">
                                                ₹{moneyIN(row.refundAmount)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs border border-slate-200 bg-slate-50 text-slate-600 rounded-lg px-2 py-0.5 font-bold uppercase tracking-wide">
                                                    {row.paymentMethod || "Razorpay"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <RefundStatusBadge status={row.refundStatus} />
                                            </td>
                                            <td className="px-6 py-4 text-xs font-semibold text-slate-500 whitespace-nowrap font-sans">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                                                    <span>{formatDateTime(row.refundRequestedAt)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <RefundRowActions item={row} onView={(item) => setSelectedRefundId(item.id)} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* PAGINATION FOOTER */}
                    {rows.length > 0 && (
                        <div className="px-6 py-4 border-t border-slate-200 flex-shrink-0 flex items-center justify-between bg-white relative z-10">
                            <div className="text-[13px] text-slate-600">
                                Page {pagination.currentPage} of {pagination.totalPages} • {pagination.totalElements} total records
                            </div>

                            <div className="flex gap-2">
                                <button
                                    disabled={pagination.currentPage <= 1 || loading}
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 disabled:opacity-40 transition-all cursor-pointer"
                                >
                                    Prev
                                </button>
                                <button
                                    disabled={pagination.currentPage >= pagination.totalPages || loading}
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 disabled:opacity-40 transition-all cursor-pointer"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Side Slide Drawer: Payment & Refund Auditing */}
            {selectedItem && (
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex justify-end">
                    <div className="w-full max-w-[480px] bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-slide-in relative">

                        {/* Drawer Header */}
                        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-br from-slate-50 to-white flex-shrink-0">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 border border-sky-100 shadow-sm">
                                    <FileText size={18} />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-slate-900 text-base">Refund Audit Logs</h3>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold font-sans mt-0.5">
                                        TXN ID: {selectedItem.razorpayPaymentId || "—"}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedItem(null)}
                                className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 active:scale-95 flex items-center justify-center cursor-pointer transition-all"
                            >
                                <X size={16} className="text-slate-500" />
                            </button>
                        </div>

                        {/* Drawer Body Scroll */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                            {/* Section 1: User details */}
                            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                                <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-3">
                                    <User size={15} className="text-slate-500" />
                                    <h4 className="text-xs font-extrabold uppercase text-slate-700 tracking-wider">User Information</h4>
                                </div>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400 font-semibold">User Name:</span>
                                        <span className="font-bold text-slate-900">{selectedItem.userFullName || "—"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400 font-semibold">User ID:</span>
                                        <span className="font-bold text-slate-700 select-all font-sans">{selectedItem.userId || "—"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Original Payment Details */}
                            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                                <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-3">
                                    <CreditCard size={15} className="text-slate-500" />
                                    <h4 className="text-xs font-extrabold uppercase text-slate-700 tracking-wider">Original Payment Details</h4>
                                </div>
                                <div className="space-y-2.5 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400 font-semibold">Inspection Req ID:</span>
                                        <span className="font-bold text-slate-900 select-all font-sans">{selectedItem.inspectionRequestId || "—"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400 font-semibold">Paid Amount:</span>
                                        <span className="font-bold text-slate-900 font-sans text-sm">₹{moneyIN(selectedItem.amount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400 font-semibold">Razorpay Order ID:</span>
                                        <span className="font-bold text-slate-800 font-sans select-all">{selectedItem.razorpayOrderId || "—"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400 font-semibold">Razorpay Payment ID:</span>
                                        <span className="font-bold text-slate-800 font-sans select-all">{selectedItem.razorpayPaymentId || "—"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400 font-semibold">Payment Method:</span>
                                        <span className="font-bold text-slate-750 uppercase">{selectedItem.paymentMethod || "—"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400 font-semibold">Paid At:</span>
                                        <span className="font-bold text-slate-900 font-sans">{formatDateTime(selectedItem.paidAt)}</span>
                                    </div>
                                    {selectedItem.invoiceId && (
                                        <div className="flex justify-between items-center pt-1 border-t border-slate-100 mt-2">
                                            <span className="text-slate-400 font-semibold">Invoice:</span>
                                            <a
                                                href={selectedItem.invoiceUrl || "#"}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-600 hover:text-sky-700 underline"
                                            >
                                                Download Invoice
                                                <ArrowUpRight size={12} />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Section 3: Refund Auditing Details */}
                            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                                <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-3">
                                    <DollarSign size={15} className="text-slate-500" />
                                    <h4 className="text-xs font-extrabold uppercase text-slate-700 tracking-wider">Refund Transaction Details</h4>
                                </div>
                                <div className="space-y-2.5 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400 font-semibold">Refund Status:</span>
                                        <RefundStatusBadge status={selectedItem.refundStatus} />
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400 font-semibold">Razorpay Refund ID:</span>
                                        <span className="font-bold text-slate-800 font-sans select-all">{selectedItem.razorpayRefundId || "—"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400 font-semibold">Refunded Amount:</span>
                                        <span className="font-bold text-sky-600 font-sans text-sm">₹{moneyIN(selectedItem.refundAmount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400 font-semibold">Requested At:</span>
                                        <span className="font-bold text-slate-900 font-sans">{formatDateTime(selectedItem.refundRequestedAt)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400 font-semibold">Completed At:</span>
                                        <span className="font-bold text-slate-900 font-sans">{formatDateTime(selectedItem.refundCompletedAt)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400 font-semibold">Retry Count:</span>
                                        <span className="font-bold text-slate-900 font-sans">{selectedItem.refundRetryCount ?? 0}</span>
                                    </div>

                                    {/* Failure reason card block if failed */}
                                    {selectedItem.refundStatus === "REFUND_FAILED" && (
                                        <div className="mt-3 bg-rose-50 border border-rose-100 rounded-xl p-3 text-rose-800 flex gap-2">
                                            <AlertTriangle size={16} className="text-rose-500 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-bold text-xs">Refund Failure Reason</p>
                                                <p className="text-[11px] leading-relaxed mt-1 text-rose-700">
                                                    {selectedItem.refundFailureReason || "Transaction declined by billing gateway. Payment settlement issue."}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Drawer Footer actions */}
                        <div className="p-4 border-t border-slate-200 bg-white flex justify-end flex-shrink-0">
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="px-5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-xs font-bold text-slate-700 transition"
                            >
                                Close Audit panel
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
            )}
        </>
    );
}

export default InspectionRefund;