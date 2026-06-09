import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Download,
  Search,
  X,
  Check,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  Eye,
  MapPin,
  SlidersHorizontal,
  Wallet,
  ArrowLeft,
  User,
  Building,
  Award,
  TrendingUp,
  ShieldCheck,
  Loader2,
  Calendar,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import {
  getWalletKpi,
  filterWallets,
  getWalletById,
  filterWalletTransactions,
} from "../../api/consultationApi";
import { getStates, getCities } from "../../api/addressApi";
import { getTierPlans } from "../../api/tierPlan.api";

/* ─── CONSTANTS ─────────────────────────────────────────────────── */
const INDIA_COUNTRY_ID = 101;

/* ─── TX_STYLES — mapped to WalletTransactionSource enum ────────── */
const TX_STYLES = {
  // credit types
  MANUAL_TOPUP: {
    bg: "bg-emerald-50 border border-emerald-100",
    icon: ArrowDownLeft,
    iconColor: "text-emerald-600",
    amountColor: "text-emerald-600",
    prefix: "+",
    label: "Top-up",
  },
  ADMIN_CREDIT: {
    bg: "bg-emerald-50 border border-emerald-100",
    icon: ArrowDownLeft,
    iconColor: "text-emerald-600",
    amountColor: "text-emerald-600",
    prefix: "+",
    label: "Admin Credit",
  },
  SUBSCRIPTION_REFUND: {
    bg: "bg-purple-50 border border-purple-100",
    icon: RefreshCw,
    iconColor: "text-purple-600",
    amountColor: "text-emerald-600",
    prefix: "+",
    label: "Refund",
  },
  // debit types
  INSPECTION_PAYMENT: {
    bg: "bg-blue-50 border border-blue-100",
    icon: ArrowUpRight,
    iconColor: "text-blue-600",
    amountColor: "text-red-500",
    prefix: "−",
    label: "Inspection",
  },
  PPC_PURCHASE: {
    bg: "bg-amber-50 border border-amber-100",
    icon: ArrowUpRight,
    iconColor: "text-amber-600",
    amountColor: "text-red-500",
    prefix: "−",
    label: "PPC",
  },
  ADMIN_DEBIT: {
    bg: "bg-red-50 border border-red-100",
    icon: ArrowUpRight,
    iconColor: "text-red-500",
    amountColor: "text-red-500",
    prefix: "−",
    label: "Admin Debit",
  },
  // fallback
  default: {
    bg: "bg-slate-50 border border-slate-100",
    icon: ArrowDownLeft,
    iconColor: "text-slate-400",
    amountColor: "text-slate-600",
    prefix: "",
    label: "Transaction",
  },
};

const getTxStyle = (sourceType) => TX_STYLES[sourceType] || TX_STYLES.default;

/* ─── WALLET STATUS STYLING ─────────────────────────────────────── */
const walletStatusStyle = (status) => {
  const s = String(status || "").toUpperCase();
  if (s === "ACTIVE") return "bg-emerald-50 text-emerald-700";
  if (s === "INACTIVE") return "bg-slate-100 text-slate-500";
  if (s === "SUSPENDED") return "bg-red-50 text-red-600";
  return "bg-slate-100 text-slate-500";
};

/* ─── DATE HELPERS ──────────────────────────────────────────────── */
const fmtDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const fmtDateShort = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

const fmtCurrency = (val) => {
  if (val === null || val === undefined) return "₹0";
  return `₹${Number(val).toLocaleString("en-IN")}`;
};

/* ─── INITIALS HELPER ───────────────────────────────────────────── */
const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-indigo-100 text-indigo-700",
];
const getInitials = (name = "") =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");
const getAvatarColor = (name = "") =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

/* ─── LOADING SKELETON ──────────────────────────────────────────── */
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-slate-100 rounded-lg ${className}`} />
);

/* ─── TOPUP MODAL ───────────────────────────────────────────────── */
const TopUpModal = ({ wallet, walletsList, onClose, onConfirm }) => {
  const [selectedWalletId, setSelectedWalletId] = useState(
    wallet ? wallet.walletId : walletsList?.[0]?.walletId || ""
  );
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const presets = [500, 1000, 2000, 5000];

  const currentWallet =
    wallet || walletsList?.find((w) => w.walletId === selectedWalletId);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.93, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.93, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <p className="font-semibold text-slate-800">Manual wallet top-up</p>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition"
            >
              <X size={16} />
            </button>
          </div>
          <div className="p-5 space-y-4 text-left">
            <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-700 leading-relaxed">
              Manually credit the consultant's wallet. This is logged as an admin top-up.
            </div>

            {wallet ? (
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1.5">Consultant</p>
                <div className="px-3 py-2 bg-slate-50 rounded-lg text-sm font-semibold text-slate-800 flex items-center justify-between">
                  <span>{wallet.consultationName}</span>
                  <span className="text-xs text-slate-400 font-normal">
                    Current: {fmtCurrency(wallet.balance)}
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1.5">Select Consultant</p>
                <select
                  value={selectedWalletId}
                  onChange={(e) => setSelectedWalletId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 text-slate-800"
                >
                  {walletsList?.map((w) => (
                    <option key={w.walletId} value={w.walletId}>
                      {w.consultationName} (Current: {fmtCurrency(w.balance)})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2">Quick amounts</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {presets.map((p) => (
                  <button
                    key={p}
                    onClick={() => setAmount(String(p))}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${amount === String(p)
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                  >
                    ₹{p.toLocaleString()}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium">
                  ₹
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter custom amount"
                  className="w-full pl-7 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 text-slate-800"
                />
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1.5">Admin note (internal)</p>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Reason for manual top-up…"
                className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 resize-none text-slate-700"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(currentWallet, Number(amount))}
              disabled={!amount || Number(amount) <= 0 || !currentWallet}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check size={14} /> Credit ₹{amount ? Number(amount).toLocaleString() : "—"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─── MAIN COMPONENT ────────────────────────────────────────────── */
const WalletsAndBilling = () => {

  /* ── View state ── */
  const [activeWalletId, setActiveWalletId] = useState(null);
  const [topUpWallet, setTopUpWallet] = useState(null);
  const [globalTopUp, setGlobalTopUp] = useState(false);

  /* ═══════════════════════════════════════════════════════════
     KPI STATE
  ═══════════════════════════════════════════════════════════ */
  const [kpiData, setKpiData] = useState(null);
  const [kpiLoading, setKpiLoading] = useState(true);

  const fetchKpi = useCallback(async () => {
    setKpiLoading(true);
    try {
      const res = await getWalletKpi();
      setKpiData(res?.data || null);
    } catch (err) {
      console.error("KPI fetch error:", err);
      toast.error("Failed to load KPI stats");
    } finally {
      setKpiLoading(false);
    }
  }, []);

  /* ═══════════════════════════════════════════════════════════
     DROPDOWNS — Tiers / States / Cities
  ═══════════════════════════════════════════════════════════ */
  const [tierList, setTierList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(false);

  /* Load tiers and states on mount */
  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const [tiersRes, statesRes] = await Promise.all([
          getTierPlans(),
          getStates(INDIA_COUNTRY_ID),
        ]);
        setTierList(tiersRes?.data || []);
        setStateList(statesRes?.data || []);
      } catch (err) {
        console.error("Dropdown load error:", err);
      }
    };
    loadDropdowns();
  }, []);

  /* Load cities — by selected state or all India cities */
  const loadCities = useCallback(async (stateId) => {
    setCitiesLoading(true);
    try {
      let res;
      if (stateId) {
        res = await getCities(stateId);
      } else {
        // Import getAllCitiesFromSearch for all India cities
        const { getAllCitiesFromSearch } = await import("../../api/addressApi");
        res = await getAllCitiesFromSearch("");
      }
      setCityList(res?.data || []);
    } catch (err) {
      console.error("Cities load error:", err);
      setCityList([]);
    } finally {
      setCitiesLoading(false);
    }
  }, []);

  /* ═══════════════════════════════════════════════════════════
     WALLET TABLE STATE
  ═══════════════════════════════════════════════════════════ */
  const [wallets, setWallets] = useState([]);
  const [walletTotal, setWalletTotal] = useState(0);
  const [walletTotalPages, setWalletTotalPages] = useState(0);
  const [walletLoading, setWalletLoading] = useState(true);
  const [walletPage, setWalletPage] = useState(1);

  /* Filter inputs */
  const [walletSearchInput, setWalletSearchInput] = useState("");
  const [walletSearchText, setWalletSearchText] = useState("");
  const [walletTierId, setWalletTierId] = useState("");
  const [walletStateId, setWalletStateId] = useState("");
  const [walletCityId, setWalletCityId] = useState("");
  const [walletMinBal, setWalletMinBal] = useState("");
  const [walletMaxBal, setWalletMaxBal] = useState("");
  const [walletFromDate, setWalletFromDate] = useState("");
  const [walletToDate, setWalletToDate] = useState("");
  const [showWalletFilters, setShowWalletFilters] = useState(false);

  /* Debounce wallet search */
  useEffect(() => {
    const t = setTimeout(() => {
      setWalletSearchText(walletSearchInput);
      setWalletPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [walletSearchInput]);

  /* When state changes → reload cities, reset city */
  useEffect(() => {
    setWalletCityId("");
    loadCities(walletStateId);
  }, [walletStateId, loadCities]);

  /* Fetch wallets */
  const fetchWallets = useCallback(
    async (page = 1) => {
      setWalletLoading(true);
      try {
        const payload = {
          consultName: walletSearchText.trim() || null,
          tierId: walletTierId || null,
          stateId: walletStateId ? Number(walletStateId) : null,
          cityId: walletCityId ? Number(walletCityId) : null,
          minBalance: walletMinBal ? Number(walletMinBal) : null,
          maxBalance: walletMaxBal ? Number(walletMaxBal) : null,
          fromDate: walletFromDate || null,
          toDate: walletToDate || null,
          pageNo: page,
        };
        const res = await filterWallets(payload);
        setWallets(res?.data || []);
        if (res?.pageResponse) {
          setWalletTotal(res.pageResponse.totalElements || 0);
          setWalletTotalPages(res.pageResponse.totalPages || 1);
          setWalletPage(res.pageResponse.currentPage || page);
        }
      } catch (err) {
        console.error("Wallet filter error:", err);
        toast.error(err?.response?.data?.message || "Failed to load wallets");
        setWallets([]);
      } finally {
        setWalletLoading(false);
      }
    },
    [
      walletSearchText,
      walletTierId,
      walletStateId,
      walletCityId,
      walletMinBal,
      walletMaxBal,
      walletFromDate,
      walletToDate,
    ]
  );

  useEffect(() => {
    fetchWallets(1);
  }, [fetchWallets]);

  const resetWalletFilters = () => {
    setWalletSearchInput("");
    setWalletSearchText("");
    setWalletTierId("");
    setWalletStateId("");
    setWalletCityId("");
    setWalletMinBal("");
    setWalletMaxBal("");
    setWalletFromDate("");
    setWalletToDate("");
    setWalletPage(1);
  };

  const activeWalletFilterCount = [
    walletTierId,
    walletStateId,
    walletCityId,
    walletMinBal,
    walletMaxBal,
    walletFromDate,
    walletToDate,
  ].filter(Boolean).length;

  /* ═══════════════════════════════════════════════════════════
     TRANSACTIONS PANEL STATE
  ═══════════════════════════════════════════════════════════ */
  const [txs, setTxs] = useState([]);
  const [txTotal, setTxTotal] = useState(0);
  const [txTotalPages, setTxTotalPages] = useState(0);
  const [txLoading, setTxLoading] = useState(true);
  const [txPage, setTxPage] = useState(1);

  const [txSearchInput, setTxSearchInput] = useState("");
  const [txSearchText, setTxSearchText] = useState("");
  const [txSourceType, setTxSourceType] = useState("");
  const [txFromDate, setTxFromDate] = useState("");
  const [txToDate, setTxToDate] = useState("");

  /* Debounce tx search */
  useEffect(() => {
    const t = setTimeout(() => {
      setTxSearchText(txSearchInput);
      setTxPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [txSearchInput]);

  const fetchTransactions = useCallback(
    async (page = 1) => {
      setTxLoading(true);
      try {
        const payload = {
          searchText: txSearchText.trim() || null,
          sourceType: txSourceType || null,
          fromDate: txFromDate || null,
          toDate: txToDate || null,
          pageNo: page,
        };
        const res = await filterWalletTransactions(payload);
        setTxs(res?.data || []);
        if (res?.pageResponse) {
          setTxTotal(res.pageResponse.totalElements || 0);
          setTxTotalPages(res.pageResponse.totalPages || 1);
          setTxPage(res.pageResponse.currentPage || page);
        }
      } catch (err) {
        console.error("Transaction filter error:", err);
        toast.error(err?.response?.data?.message || "Failed to load transactions");
        setTxs([]);
      } finally {
        setTxLoading(false);
      }
    },
    [txSearchText, txSourceType, txFromDate, txToDate]
  );

  useEffect(() => {
    fetchTransactions(1);
  }, [fetchTransactions]);

  /* ═══════════════════════════════════════════════════════════
     DETAIL VIEW STATE
  ═══════════════════════════════════════════════════════════ */
  const [detailWallet, setDetailWallet] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  /* Detail transactions filter */
  const [detailSearch, setDetailSearch] = useState("");
  const [detailSourceType, setDetailSourceType] = useState("");
  const [detailPage, setDetailPage] = useState(1);
  const DETAIL_PAGE_SIZE = 10;

  const handleOpenWalletDetails = async (walletId) => {
    setDetailLoading(true);
    setActiveWalletId(walletId);
    setDetailSearch("");
    setDetailSourceType("");
    setDetailPage(1);
    try {
      const res = await getWalletById(walletId);
      setDetailWallet(res?.data || null);
    } catch (err) {
      console.error("Wallet details error:", err);
      toast.error(err?.response?.data?.message || "Failed to load wallet details");
      setActiveWalletId(null);
      setDetailWallet(null);
    } finally {
      setDetailLoading(false);
    }
  };

  /* Filter detail transactions locally (they come embedded in getWalletById response) */
  const rawDetailTx = detailWallet?.transactions || [];
  const filteredDetailTx = rawDetailTx.filter((t) => {
    const matchSearch =
      !detailSearch ||
      t.transactionNumber?.toLowerCase().includes(detailSearch.toLowerCase()) ||
      t.transactionId?.toLowerCase().includes(detailSearch.toLowerCase()) ||
      t.referenceId?.toLowerCase().includes(detailSearch.toLowerCase());
    const matchType = !detailSourceType || t.sourceType === detailSourceType;
    return matchSearch && matchType;
  });
  const detailTotalPages = Math.ceil(filteredDetailTx.length / DETAIL_PAGE_SIZE) || 1;
  const detailStart = (detailPage - 1) * DETAIL_PAGE_SIZE;
  const detailCurrentItems = filteredDetailTx.slice(detailStart, detailStart + DETAIL_PAGE_SIZE);

  /* ═══════════════════════════════════════════════════════════
     ON MOUNT — fetch KPI, wallets, transactions in parallel
  ═══════════════════════════════════════════════════════════ */
  useEffect(() => {
    fetchKpi();
    // initial cities load (all India)
    loadCities(null);
  }, [fetchKpi, loadCities]);

  /* ─── TOP-UP HANDLER (local optimistic; then refresh) ───────── */
  const handleTopUp = async (target, amount) => {
    if (!target || !amount) {
      setGlobalTopUp(false);
      setTopUpWallet(null);
      return;
    }
    toast.success(
      `Successfully credited ₹${amount.toLocaleString()} to ${target.consultationName || target.name}'s wallet!`
    );
    setTopUpWallet(null);
    setGlobalTopUp(false);
    // Refresh everything
    fetchKpi();
    fetchWallets(walletPage);
    fetchTransactions(1);
    if (activeWalletId) {
      handleOpenWalletDetails(activeWalletId);
    }
  };

  /* ═══════════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans p-6 md:p-8 flex flex-col space-y-6 text-left">
      <Toaster position="top-right" />

      {/* Manual top-up modals */}
      {(topUpWallet || globalTopUp) && (
        <TopUpModal
          wallet={topUpWallet}
          walletsList={wallets}
          onClose={() => {
            setTopUpWallet(null);
            setGlobalTopUp(false);
          }}
          onConfirm={handleTopUp}
        />
      )}

      {activeWalletId === null ? (
        /* ─── LIST VIEW ─────────────────────────────────────────────── */
        <>
          {/* Page Title & Header Toolbar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-5 border border-slate-200/60 rounded-2xl shadow-[0_8px_30px_rgba(15,23,42,0.02)]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="bg-blue-600 p-1.5 rounded-lg flex items-center justify-center">
                  <Wallet size={16} className="text-white" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Finance Center
                </span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Wallets & Billing
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">
                Manage platform consultant wallets, reserves, balances, and transaction records.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5 items-center shrink-0">
              <button
                onClick={() => setGlobalTopUp(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition shadow-md shadow-emerald-100"
              >
                <Plus size={14} className="stroke-[2.5px]" /> Manual top-up
              </button>
              <button
                onClick={() => { fetchKpi(); fetchWallets(walletPage); fetchTransactions(txPage); }}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 bg-white transition shadow-sm"
              >
                <RefreshCw size={14} /> Refresh
              </button>
            </div>
          </div>

          {/* ── KPI Stat Cards Row ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 min-h-[120px]">
            {/* Card 1: Total Platform Balance */}
            <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm flex items-center justify-between relative overflow-hidden">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Total Platform Balance
                </p>
                {kpiLoading ? (
                  <Skeleton className="h-7 w-28 mt-2" />
                ) : (
                  <p className="text-xl font-black text-slate-900 mt-1.5 leading-none">
                    {fmtCurrency(kpiData?.totalBalance)}
                  </p>
                )}
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Wallet size={18} />
              </div>
            </div>

            {/* Card 2: Total Top-Up Balance */}
            <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm flex items-center justify-between relative overflow-hidden">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Total Top-Up Balance
                </p>
                {kpiLoading ? (
                  <Skeleton className="h-7 w-28 mt-2" />
                ) : (
                  <p className="text-xl font-black text-slate-900 mt-1.5 leading-none">
                    {fmtCurrency(kpiData?.totalTopUpBalance)}
                  </p>
                )}
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <TrendingUp size={18} />
              </div>
            </div>

            {/* Card 3: Total Withdrawals */}
            <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm flex items-center justify-between relative overflow-hidden">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Total Withdrawals
                </p>
                {kpiLoading ? (
                  <Skeleton className="h-7 w-28 mt-2" />
                ) : (
                  <p className="text-xl font-black text-slate-900 mt-1.5 leading-none">
                    {fmtCurrency(kpiData?.totalWithdrawBalance)}
                  </p>
                )}
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <ShieldCheck size={18} />
              </div>
            </div>

            {/* Card 4: Active Consultants */}
            <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm flex items-center justify-between relative overflow-hidden">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Active Consultants
                </p>
                {kpiLoading ? (
                  <Skeleton className="h-7 w-20 mt-2" />
                ) : (
                  <p className="text-xl font-black text-slate-900 mt-1.5 leading-none">
                    {kpiData?.totalActiveConsultCount ?? 0}{" "}
                    <span className="text-xs font-semibold text-slate-400">Active</span>
                  </p>
                )}
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <User size={18} />
              </div>
            </div>
          </div>

          {/* ── Grid: Wallets Table + Transactions Panel ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-fit">

            {/* ── WALLETS SECTION (8 Columns) ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="lg:col-span-8 bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-425px)]"
            >
              {/* Header and filters */}
              <div className="px-5 py-4 border-b border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-800">
                    Consultant Wallets
                    {walletTotal > 0 && (
                      <span className="ml-2 text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                        {walletTotal} records
                      </span>
                    )}
                  </p>
                  <button
                    onClick={() => setShowWalletFilters(!showWalletFilters)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition ${showWalletFilters || activeWalletFilterCount > 0
                        ? "bg-blue-50 text-blue-600 border-blue-200"
                        : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                      }`}
                  >
                    <SlidersHorizontal size={12} />
                    Filters
                    {activeWalletFilterCount > 0 && (
                      <span className="ml-0.5 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        {activeWalletFilterCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* Wallet Searchbar */}
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={walletSearchInput}
                    onChange={(e) => setWalletSearchInput(e.target.value)}
                    placeholder="Search consultant name…"
                    className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 text-slate-700 placeholder:text-slate-400"
                  />
                </div>

                {/* Wallet Filter Panel */}
                <AnimatePresence>
                  {showWalletFilters && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pt-2 text-left"
                    >
                      <div className="bg-slate-50/50 p-4 border border-slate-100 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">

                        {/* Tier filter */}
                        <div>
                          <label className="font-bold text-slate-400 block mb-1">Tier</label>
                          <select
                            value={walletTierId}
                            onChange={(e) => { setWalletTierId(e.target.value); setWalletPage(1); }}
                            className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-700"
                          >
                            <option value="">All Tiers</option>
                            {tierList.map((t) => (
                              <option key={t.tierId || t.id} value={t.tierId || t.id}>
                                {t.title || t.tierTitle || t.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* State filter */}
                        <div>
                          <label className="font-bold text-slate-400 block mb-1">State</label>
                          <select
                            value={walletStateId}
                            onChange={(e) => { setWalletStateId(e.target.value); setWalletPage(1); }}
                            className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-700"
                          >
                            <option value="">All States</option>
                            {stateList.map((s) => (
                              <option key={s.stateId || s.id} value={s.stateId || s.id}>
                                {s.stateName || s.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* City filter */}
                        <div>
                          <label className="font-bold text-slate-400 block mb-1">
                            City {citiesLoading && <span className="text-slate-300">(loading…)</span>}
                          </label>
                          <select
                            value={walletCityId}
                            onChange={(e) => { setWalletCityId(e.target.value); setWalletPage(1); }}
                            disabled={citiesLoading}
                            className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-700 disabled:opacity-50"
                          >
                            <option value="">All Cities</option>
                            {cityList.map((c) => (
                              <option key={c.cityId || c.id} value={c.cityId || c.id}>
                                {c.cityName || c.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Registration Date Range */}
                        <div>
                          <label className="font-bold text-slate-400 block mb-1">From Date</label>
                          <input
                            type="date"
                            value={walletFromDate}
                            onChange={(e) => { setWalletFromDate(e.target.value); setWalletPage(1); }}
                            className="w-full px-2 py-1 border border-slate-200 rounded-lg bg-white text-slate-700"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-400 block mb-1">To Date</label>
                          <input
                            type="date"
                            value={walletToDate}
                            onChange={(e) => { setWalletToDate(e.target.value); setWalletPage(1); }}
                            className="w-full px-2 py-1 border border-slate-200 rounded-lg bg-white text-slate-700"
                          />
                        </div>

                        {/* Balance range */}
                        <div className="sm:col-span-2">
                          <label className="font-bold text-slate-400 block mb-1">
                            Wallet Balance Range
                          </label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="number"
                              placeholder="Min Balance"
                              value={walletMinBal}
                              onChange={(e) => { setWalletMinBal(e.target.value); setWalletPage(1); }}
                              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                            />
                            <span className="text-slate-400 font-bold">-</span>
                            <input
                              type="number"
                              placeholder="Max Balance"
                              value={walletMaxBal}
                              onChange={(e) => { setWalletMaxBal(e.target.value); setWalletPage(1); }}
                              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                          <button
                            onClick={resetWalletFilters}
                            className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-bold transition"
                          >
                            Reset Filters
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Table */}
              <div className="flex-1 overflow-x-auto overflow-y-auto">
                <table className="w-full text-sm text-left">
                  <thead className="sticky top-0 bg-slate-50 z-10">
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="px-4 py-3 text-xs">Consultant</th>
                      <th className="px-4 py-3 text-xs">Balance</th>
                      <th className="px-4 py-3 text-xs">Total Top-Up</th>
                      <th className="px-4 py-3 text-xs">Total Withdraw</th>
                      <th className="px-4 py-3 text-xs">Status</th>
                      <th className="px-4 py-3 text-center text-xs">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                    {walletLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i}>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2.5">
                              <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                              <div className="space-y-1.5">
                                <Skeleton className="h-3 w-28" />
                                <Skeleton className="h-2.5 w-20" />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4"><Skeleton className="h-3 w-20" /></td>
                          <td className="px-4 py-4"><Skeleton className="h-3 w-16" /></td>
                          <td className="px-4 py-4"><Skeleton className="h-5 w-14 rounded-md" /></td>
                          <td className="px-4 py-4 text-center"><Skeleton className="h-7 w-7 rounded-lg mx-auto" /></td>
                        </tr>
                      ))
                    ) : wallets.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-14 text-center text-slate-400 text-sm font-semibold">
                          No wallets found matching the criteria.
                        </td>
                      </tr>
                    ) : (
                      wallets.map((w) => {
                        const initials = getInitials(w.consultationName || "");
                        const avatarColor = getAvatarColor(w.consultationName || "");
                        const statusClass = walletStatusStyle(w.walletStatus);
                        return (
                          <tr
                            key={w.walletId}
                            className="hover:bg-slate-50/70 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                {w.logoUrl ? (
                                  <img
                                    src={w.logoUrl}
                                    alt={w.consultationName}
                                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                  />
                                ) : (
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${avatarColor}`}
                                  >
                                    {initials}
                                  </div>
                                )}
                                <div>
                                  <p className="font-bold text-slate-800 text-sm leading-none">
                                    {w.consultationName || "—"}
                                  </p>
                                  <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-slate-400">
                                    {w.tierTitle && (
                                      <span className="font-semibold">{w.tierTitle}</span>
                                    )}
                                    {w.tierTitle && w.cityName && <span>·</span>}
                                    {w.cityName && (
                                      <span className="flex items-center gap-0.5">
                                        <MapPin size={8.5} /> {w.cityName}, {w.stateName}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 font-extrabold text-sm text-slate-800">
                              {fmtCurrency(w.balance)}
                            </td>
                            <td className="px-4 py-3 text-slate-500 font-semibold text-sm">
                              {fmtCurrency(w.totalTopUpAmount)}
                            </td>
                            <td className="px-4 py-3 text-slate-500 font-semibold text-sm">
                              {fmtCurrency(w.totalWithdrawAmount)}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wide ${statusClass}`}
                              >
                                {w.walletStatus || "—"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => handleOpenWalletDetails(w.walletId)}
                                className="p-1.5 rounded-lg cursor-pointer hover:bg-blue-50 text-blue-600 border border-blue-100 transition shadow-sm inline-flex items-center"
                                title="View Details"
                              >
                                <Eye size={13} className="stroke-[2px]" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination footer */}
              {!walletLoading && walletTotalPages > 1 && (
                <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold bg-slate-50/30">
                  <span>
                    Page {walletPage} of {walletTotalPages}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        const p = Math.max(1, walletPage - 1);
                        setWalletPage(p);
                        fetchWallets(p);
                      }}
                      disabled={walletPage === 1}
                      className="px-2 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition inline-flex items-center gap-1"
                    >
                      <ChevronLeft size={12} /> Prev
                    </button>
                    <button
                      onClick={() => {
                        const p = Math.min(walletTotalPages, walletPage + 1);
                        setWalletPage(p);
                        fetchWallets(p);
                      }}
                      disabled={walletPage === walletTotalPages}
                      className="px-2 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition inline-flex items-center gap-1"
                    >
                      Next <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>

            {/* ── TRANSACTIONS SECTION (4 Columns) ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
              className="lg:col-span-4 bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-425px)]"
            >
              <div className="flex flex-col px-5 py-4 border-b border-slate-100 gap-3">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-800">Recent Transactions</p>
                  <span className="text-xs text-slate-400 font-semibold bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                    {txTotal} records
                  </span>
                </div>

                {/* Transactions search & filter */}
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      value={txSearchInput}
                      onChange={(e) => setTxSearchInput(e.target.value)}
                      placeholder="Search consultant..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 text-slate-700 placeholder:text-slate-400"
                    />
                  </div>
                  <select
                    value={txSourceType}
                    onChange={(e) => { setTxSourceType(e.target.value); setTxPage(1); }}
                    className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 text-slate-600 font-semibold"
                  >
                    <option value="">All Types</option>
                    <option value="MANUAL_TOPUP">Manual Top-up</option>
                    <option value="ADMIN_CREDIT">Admin Credit</option>
                    <option value="SUBSCRIPTION_REFUND">Subscription Refund</option>
                    <option value="INSPECTION_PAYMENT">Inspection Payment</option>
                    <option value="PPC_PURCHASE">PPC Purchase</option>
                    <option value="ADMIN_DEBIT">Admin Debit</option>
                  </select>
                </div>
              </div>

              {/* List */}
              <div className="p-4 space-y-1 flex-1 overflow-y-auto">
                {txLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0">
                      <Skeleton className="w-9 h-9 rounded-full flex-shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-3 w-3/4" />
                        <Skeleton className="h-2.5 w-1/2" />
                      </div>
                      <div className="text-right space-y-1.5">
                        <Skeleton className="h-3 w-16 ml-auto" />
                        <Skeleton className="h-2.5 w-10 ml-auto" />
                      </div>
                    </div>
                  ))
                ) : txs.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs font-bold">
                    No transactions found.
                  </div>
                ) : (
                  txs.map((t) => {
                    const style = getTxStyle(t.sourceType);
                    const Icon = style.icon;
                    return (
                      <div
                        key={t.transactionId}
                        className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0"
                      >
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${style.bg}`}
                        >
                          <Icon size={16} className={style.iconColor} />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p
                            className="text-sm font-bold text-slate-800 leading-snug truncate"
                            title={t.consultationName}
                          >
                            {t.consultationName || "—"}
                          </p>
                          <p
                            className="text-[11.5px] text-slate-400 truncate mt-0.5"
                            title={t.transactionNumber}
                          >
                            {t.transactionNumber || style.label}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <p className={`text-sm font-extrabold ${style.amountColor}`}>
                            {style.prefix}₹{Number(t.amount || 0).toLocaleString("en-IN")}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {fmtDateShort(t.transactionCreatedAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Pagination footer */}
              {!txLoading && txTotalPages > 1 && (
                <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold bg-slate-50/30">
                  <span>
                    Page {txPage} of {txTotalPages}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        const p = Math.max(1, txPage - 1);
                        setTxPage(p);
                        fetchTransactions(p);
                      }}
                      disabled={txPage === 1}
                      className="px-2 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Prev
                    </button>
                    <button
                      onClick={() => {
                        const p = Math.min(txTotalPages, txPage + 1);
                        setTxPage(p);
                        fetchTransactions(p);
                      }}
                      disabled={txPage === txTotalPages}
                      className="px-2 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </>
      ) : (
        /* ─── DETAIL VIEW ───────────────────────────────────────────── */
        <div className="flex flex-col space-y-6">
          {/* Header Toolbar */}
          <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-5 border border-slate-200/60 rounded-2xl shadow-[0_8px_30px_rgba(15,23,42,0.02)]">
            <div className="flex items-center gap-4 min-w-0">
              <button
                onClick={() => { setActiveWalletId(null); setDetailWallet(null); }}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-50 shadow-sm transition shrink-0 cursor-pointer"
                title="Back to Wallets & Billing"
              >
                <ArrowLeft size={16} className="stroke-[2.5px]" />
              </button>
              <div className="min-w-0">
                {/* <div className="flex items-center justify-center gap-1">
                  <span className="text-[12px] font-semibold text-gray-700 uppercase tracking-wide">
                    Status
                  </span>

                  {detailWallet && (
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm border ${walletStatusStyle(
                        detailWallet.walletStatus
                      )}`}
                    >
                      {detailWallet.walletStatus}
                    </span>
                  )}
                </div> */}
                <h1 className="text-xl font-extrabold text-slate-900 mt-1 flex items-end gap-2 leading-tight truncate">
                  {detailLoading ? (
                    <Skeleton className="h-6 w-40 mt-1" />
                  ) : (
                    detailWallet?.consultationName || "Loading…"
                  )}
                  {detailWallet && (
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm border ${walletStatusStyle(
                        detailWallet.walletStatus
                      )}`}
                    >
                      {detailWallet.walletStatus}
                    </span>
                  )}
                </h1>
              </div>
            </div>

            {detailWallet && (
              <button
                onClick={() => setTopUpWallet(detailWallet)}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 text-xs font-bold transition shadow-md shadow-emerald-100 shrink-0 self-start sm:self-center cursor-pointer"
              >
                <Plus size={14} className="stroke-[2.5px]" />
                Manual Top-Up
              </button>
            )}
          </section>

          {detailLoading ? (
            <div className="flex items-center justify-center py-24">
              <div className="flex flex-col items-center gap-3">
                <Loader2 size={28} className="animate-spin text-blue-500" />
                <p className="text-sm text-slate-400 font-medium">Loading wallet details…</p>
              </div>
            </div>
          ) : detailWallet ? (
            <>
              {/* Grid: summary cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Card 1: Balance */}
                <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-between h-[200px]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                      <Wallet size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Wallet Balance
                      </p>
                      <p className="text-[26px] font-black text-slate-900 mt-0.5 leading-none">
                        {fmtCurrency(detailWallet.balance)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">
                        Total Top-Up
                      </span>
                      <span className="text-sm font-semibold text-emerald-600 block mt-0.5">
                        {fmtCurrency(detailWallet.totalTopUpAmount)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">
                        Total Withdrawn
                      </span>
                      <span className="text-sm font-bold text-red-500 block mt-0.5">
                        {fmtCurrency(detailWallet.totalWithdrawAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card 2: Consultant Profile Details */}
                <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm space-y-3 text-xs flex flex-col justify-between h-[200px]">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <User size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Consultant Profile
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-2.5 flex-1 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-400">Tier</span>
                      <span className="inline-flex items-center gap-1 font-bold text-slate-700">
                        <Award size={13} className="text-amber-500" />
                        {detailWallet.tierTitle || "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-400">State</span>
                      <span className="inline-flex items-center gap-1 font-bold text-slate-700">
                        <Building size={13} className="text-slate-400" />
                        {detailWallet.stateName || "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-400">City</span>
                      <span className="inline-flex items-center gap-1 font-bold text-slate-700">
                        <MapPin size={13} className="text-slate-400" />
                        {detailWallet.cityName || "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-400">Registered</span>
                      <span className="inline-flex items-center gap-1 font-bold text-slate-700">
                        <Calendar size={13} className="text-slate-400" />
                        {fmtDate(detailWallet.walletCreatedAt)}
                      </span>
                    </div>
                    {detailWallet.phoneNumber && (
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-400">Phone</span>
                        <span className="inline-flex items-center gap-1 font-bold text-slate-700">
                          <Phone size={13} className="text-slate-400" />
                          {detailWallet.phoneNumber}
                        </span>
                      </div>
                    )}
                    {detailWallet.companyEmail && (
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-400">Email</span>
                        <span className="inline-flex items-center gap-1 font-bold text-slate-700 truncate">
                          <Mail size={13} className="text-slate-400 shrink-0" />
                          <span className="truncate">{detailWallet.companyEmail}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Row: Transactions Table Card */}
              <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-420px)]">
                {/* Header with filter controls */}
                <div className="p-5 border-b border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-800">
                      Wallet Transactions
                      <span className="ml-2 text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                        {filteredDetailTx.length} records
                      </span>
                    </p>
                  </div>

                  {/* Filter controls row */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        value={detailSearch}
                        onChange={(e) => { setDetailSearch(e.target.value); setDetailPage(1); }}
                        placeholder="Search by transaction # or reference…"
                        className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 text-slate-700 placeholder:text-slate-400"
                      />
                    </div>
                    <select
                      value={detailSourceType}
                      onChange={(e) => { setDetailSourceType(e.target.value); setDetailPage(1); }}
                      className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 text-slate-600 font-medium"
                    >
                      <option value="">All Types</option>
                      <option value="MANUAL_TOPUP">Manual Top-up</option>
                      <option value="ADMIN_CREDIT">Admin Credit</option>
                      <option value="SUBSCRIPTION_REFUND">Subscription Refund</option>
                      <option value="INSPECTION_PAYMENT">Inspection Payment</option>
                      <option value="PPC_PURCHASE">PPC Purchase</option>
                      <option value="ADMIN_DEBIT">Admin Debit</option>
                    </select>
                  </div>
                </div>

                {/* Table wrapper */}
                <div className="flex-1 overflow-x-auto overflow-y-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="sticky top-0 bg-slate-50 z-10">
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="px-5 py-3 text-xs">Transaction #</th>
                        <th className="px-5 py-3 text-xs">Type</th>
                        <th className="px-5 py-3 text-xs">Amount</th>
                        <th className="px-5 py-3 text-xs">Balance Before</th>
                        <th className="px-5 py-3 text-xs">Balance After</th>
                        <th className="px-5 py-3 text-xs">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                      {detailCurrentItems.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400 text-sm font-semibold">
                            No transactions found matching the filters.
                          </td>
                        </tr>
                      ) : (
                        detailCurrentItems.map((t) => {
                          const style = getTxStyle(t.sourceType);
                          const Icon = style.icon;
                          return (
                            <tr
                              key={t.transactionId}
                              className="hover:bg-slate-50/70 transition-colors"
                            >
                              <td className="px-5 py-3.5">
                                <div>
                                  <p className="text-sm font-bold text-slate-800 truncate max-w-[180px]">
                                    {t.transactionNumber || t.transactionId}
                                  </p>
                                  {t.referenceId && (
                                    <p className="text-[11.5px] text-slate-400 truncate max-w-[180px] mt-0.5">
                                      Ref: {t.referenceId}
                                    </p>
                                  )}
                                </div>
                              </td>
                              <td className="px-5 py-3.5 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold uppercase ${style.bg} ${style.iconColor}`}
                                >
                                  <Icon size={10} strokeWidth={2.5} />
                                  {style.label}
                                </span>
                              </td>
                              <td
                                className={`px-5 py-3.5 whitespace-nowrap text-sm font-extrabold ${style.amountColor}`}
                              >
                                {style.prefix}₹{Number(t.amount || 0).toLocaleString("en-IN")}
                              </td>
                              <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap text-sm font-semibold">
                                {fmtCurrency(t.balanceBefore)}
                              </td>
                              <td className="px-5 py-3.5 text-slate-700 whitespace-nowrap text-sm font-semibold">
                                {fmtCurrency(t.balanceAfter)}
                              </td>
                              <td className="px-5 py-3.5 text-slate-400 whitespace-nowrap text-[12px]">
                                {fmtDate(t.createdAt)}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination footer */}
                {detailTotalPages > 1 && (
                  <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold bg-slate-50/30">
                    <span>
                      Showing {detailStart + 1} to{" "}
                      {Math.min(detailStart + DETAIL_PAGE_SIZE, filteredDetailTx.length)} of{" "}
                      {filteredDetailTx.length} records
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDetailPage(Math.max(1, detailPage - 1))}
                        disabled={detailPage === 1}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        Previous
                      </button>
                      <div className="flex items-center gap-1 font-bold">
                        {Array.from({ length: Math.min(detailTotalPages, 7) }, (_, i) => i + 1).map(
                          (p) => (
                            <button
                              key={p}
                              onClick={() => setDetailPage(p)}
                              className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs transition ${detailPage === p
                                  ? "bg-blue-600 text-white shadow-sm shadow-blue-100"
                                  : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                                }`}
                            >
                              {p}
                            </button>
                          )
                        )}
                      </div>
                      <button
                        onClick={() => setDetailPage(Math.min(detailTotalPages, detailPage + 1))}
                        disabled={detailPage === detailTotalPages}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center py-24">
              <p className="text-slate-400 text-sm">Failed to load wallet details. Please go back and try again.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletsAndBilling;