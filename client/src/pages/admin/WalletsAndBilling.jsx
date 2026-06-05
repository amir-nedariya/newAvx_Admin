import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Filter,
  Calendar,
  MapPin,
  SlidersHorizontal,
  Wallet,
  ArrowLeft,
  User,
  Building,
  Award,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { mockWallets, mockTransactions } from "./ppc/mockData";

const TX_STYLES = {
  topup: {
    bg: "bg-emerald-50 border border-emerald-100",
    icon: ArrowDownLeft,
    iconColor: "text-emerald-600",
    amountColor: "text-emerald-600",
    prefix: "+",
    label: "Top up",
  },
  inspection: {
    bg: "bg-blue-50 border border-blue-100",
    icon: ArrowUpRight,
    iconColor: "text-blue-600",
    amountColor: "text-red-500",
    prefix: "",
    label: "Inspection",
  },
  refund: {
    bg: "bg-purple-50 border border-purple-100",
    icon: RefreshCw,
    iconColor: "text-purple-600",
    amountColor: "text-emerald-600",
    prefix: "+",
    label: "Refund",
  },
  ppc_cpi: {
    bg: "bg-amber-50 border border-amber-100",
    icon: ArrowUpRight,
    iconColor: "text-amber-600",
    amountColor: "text-red-500",
    prefix: "",
    label: "PPC CPI",
  },
  ppc_cpc: {
    bg: "bg-amber-50 border border-amber-100",
    icon: ArrowUpRight,
    iconColor: "text-amber-600",
    amountColor: "text-red-500",
    prefix: "",
    label: "PPC CPC",
  },
};

/* ─── TOPUP MODAL ───────────────────────────────────────────────── */
const TopUpModal = ({ wallet, walletsList, onClose, onConfirm }) => {
  const [selectedWalletId, setSelectedWalletId] = useState(wallet ? wallet.id : (walletsList && walletsList[0]?.id || ""));
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const presets = [500, 1000, 2000, 5000];

  const currentWallet = wallet || (walletsList && walletsList.find(w => w.id === selectedWalletId));

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
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition">
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
                  <span>{wallet.name}</span>
                  <span className="text-xs text-slate-400 font-normal">Current: ₹{wallet.balance.toLocaleString()}</span>
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
                  {walletsList.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} (Current: ₹{w.balance.toLocaleString()})
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
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                      amount === String(p)
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    ₹{p.toLocaleString()}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium">₹</span>
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
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-slate-600 hover:bg-slate-100 transition">
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
  // Navigation details state
  const [activeWalletId, setActiveWalletId] = useState(null);

  // Load state from local storage or fallback to mock data
  const [walletList, setWalletList] = useState(() => {
    const saved = localStorage.getItem("ppc_wallets_list");
    return saved ? JSON.parse(saved) : mockWallets;
  });

  const [txList, setTxList] = useState(() => {
    const saved = localStorage.getItem("ppc_transactions_list");
    return saved ? JSON.parse(saved) : mockTransactions;
  });

  const [topUpWallet, setTopUpWallet] = useState(null);
  const [globalTopUp, setGlobalTopUp] = useState(false);

  // Sync state to local storage and keep pages in sync
  useEffect(() => {
    localStorage.setItem("ppc_wallets_list", JSON.stringify(walletList));
  }, [walletList]);

  useEffect(() => {
    localStorage.setItem("ppc_transactions_list", JSON.stringify(txList));
  }, [txList]);

  // Synchronize state updates dynamically
  useEffect(() => {
    const syncLists = () => {
      const savedWallets = localStorage.getItem("ppc_wallets_list");
      if (savedWallets) setWalletList(JSON.parse(savedWallets));
      const savedTx = localStorage.getItem("ppc_transactions_list");
      if (savedTx) setTxList(JSON.parse(savedTx));
    };

    window.addEventListener("storage", syncLists);
    return () => window.removeEventListener("storage", syncLists);
  }, []);

  // Stats Calculations
  const totalBalance = walletList.reduce((sum, w) => sum + (w.balance || 0), 0);
  const totalReserved = walletList.reduce((sum, w) => sum + (w.reserved || 0), 0);
  const totalAvailable = Math.max(0, totalBalance - totalReserved);
  const healthyCount = walletList.filter((w) => w.status === "Healthy").length;

  // Wallet Table Filters & Searching State
  const [walletSearch, setWalletSearch] = useState("");
  const [walletTier, setWalletTier] = useState("All");
  const [walletState, setWalletState] = useState("All");
  const [walletCity, setWalletCity] = useState("All");
  const [walletMinBal, setWalletMinBal] = useState("");
  const [walletMaxBal, setWalletMaxBal] = useState("");
  const [walletDate, setWalletDate] = useState("");
  const [showWalletFilters, setShowWalletFilters] = useState(false);

  // Wallet Pagination
  const [walletPage, setWalletPage] = useState(1);
  const walletsPerPage = 5;

  // Transactions Table Filters & Searching State
  const [txSearch, setTxSearch] = useState("");
  const [txFilter, setTxFilter] = useState("All");

  // Transactions Pagination
  const [txPage, setTxPage] = useState(1);
  const txPerPage = 5;

  // Local state details view fields
  const [detailWalletTx, setDetailWalletTx] = useState([]);
  const [detailWallet, setDetailWallet] = useState(null);
  const [detailSearch, setDetailSearch] = useState("");
  const [detailTypeFilter, setDetailTypeFilter] = useState("All");
  const [detailCurrentPage, setDetailCurrentPage] = useState(1);

  // Trigger details screen selection
  const handleOpenWalletDetails = (walletId) => {
    const foundWallet = walletList.find((w) => w.id === walletId);
    if (foundWallet) {
      setDetailWallet(foundWallet);
      setDetailWalletTx(txList.filter((tx) => tx.consultantId === walletId));
      setDetailSearch("");
      setDetailTypeFilter("All");
      setDetailCurrentPage(1);
      setActiveWalletId(walletId);
    }
  };

  const handleTopUp = (target, amount) => {
    if (!target || !amount) {
      setGlobalTopUp(false);
      setTopUpWallet(null);
      return;
    }

    const updatedWallets = walletList.map((w) => {
      if (w.id === target.id) {
        const nextBal = w.balance + amount;
        return {
          ...w,
          balance: nextBal,
          status: nextBal >= 1000 ? "Healthy" : (nextBal >= 500 ? "Low" : "Critical"),
          statusStyle: nextBal >= 1000 
            ? "bg-emerald-50 text-emerald-700" 
            : (nextBal >= 500 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-600"),
          balanceColor: nextBal >= 1000 
            ? "text-slate-800" 
            : (nextBal >= 500 ? "text-amber-600" : "text-red-500")
        };
      }
      return w;
    });

    const newTx = {
      id: `TXN-${Date.now()}`,
      consultantId: target.id,
      type: "topup",
      name: `${target.name} — admin top-up`,
      sub: `Wallet credited manually`,
      amount: amount,
      time: "Just now",
      date: new Date().toISOString().split("T")[0],
    };

    const updatedTx = [newTx, ...txList];

    setWalletList(updatedWallets);
    setTxList(updatedTx);

    // Synchronize to details layout if open
    if (activeWalletId === target.id) {
      setDetailWallet(updatedWallets.find((w) => w.id === target.id));
      setDetailWalletTx(updatedTx.filter((tx) => tx.consultantId === target.id));
    }

    // Write directly to local storage to also sync the separate details page in Router
    localStorage.setItem(`wallet_details_${target.id}`, JSON.stringify({
      wallet: updatedWallets.find(w => w.id === target.id),
      transactions: updatedTx.filter(tx => tx.consultantId === target.id)
    }));

    setTopUpWallet(null);
    setGlobalTopUp(false);
    toast.success(`Successfully credited ₹${amount.toLocaleString()} to ${target.name}'s wallet!`);
  };

  // Filter Wallets
  const filteredWallets = walletList.filter((w) => {
    const matchSearch =
      !walletSearch ||
      w.name.toLowerCase().includes(walletSearch.toLowerCase()) ||
      w.id.toLowerCase().includes(walletSearch.toLowerCase());
    const matchTier = walletTier === "All" || w.tier === walletTier;
    const matchState = walletState === "All" || w.state === walletState;
    const matchCity = walletCity === "All" || w.city === walletCity;
    const matchMinBal = !walletMinBal || w.balance >= Number(walletMinBal);
    const matchMaxBal = !walletMaxBal || w.balance <= Number(walletMaxBal);
    const matchDate = !walletDate || w.date === walletDate;

    return matchSearch && matchTier && matchState && matchCity && matchMinBal && matchMaxBal && matchDate;
  });

  // Filter Transactions
  const filteredTx = txList.filter((t) => {
    const matchSearch =
      !txSearch ||
      t.name.toLowerCase().includes(txSearch.toLowerCase()) ||
      t.id.toLowerCase().includes(txSearch.toLowerCase()) ||
      (t.sub && t.sub.toLowerCase().includes(txSearch.toLowerCase()));

    const matchType =
      txFilter === "All" ||
      (txFilter === "Inspection" && t.type === "inspection") ||
      (txFilter === "Top-up" && t.type === "topup") ||
      (txFilter === "Refund" && t.type === "refund") ||
      (txFilter === "PPC Transaction" && (t.type === "ppc_cpi" || t.type === "ppc_cpc")) ||
      (txFilter === "PPC CPI" && t.type === "ppc_cpi") ||
      (txFilter === "PPC CPC" && t.type === "ppc_cpc");

    return matchSearch && matchType;
  });

  // Unique lists for wallet filter dropdowns
  const uniqueTiers = ["Platinum", "Gold", "Silver", "Bronze"];
  const uniqueStates = Array.from(new Set(mockWallets.map((w) => w.state)));
  const uniqueCities = Array.from(new Set(mockWallets.map((w) => w.city)));

  // Pagination bounds
  const totalWalletPages = Math.ceil(filteredWallets.length / walletsPerPage) || 1;
  const walletStartIdx = (walletPage - 1) * walletsPerPage;
  const paginatedWallets = filteredWallets.slice(walletStartIdx, walletStartIdx + walletsPerPage);

  const totalTxPages = Math.ceil(filteredTx.length / txPerPage) || 1;
  const txStartIdx = (txPage - 1) * txPerPage;
  const paginatedTx = filteredTx.slice(txStartIdx, txStartIdx + txPerPage);

  // Reset Wallet filters
  const resetWalletFilters = () => {
    setWalletSearch("");
    setWalletTier("All");
    setWalletState("All");
    setWalletCity("All");
    setWalletMinBal("");
    setWalletMaxBal("");
    setWalletDate("");
    setWalletPage(1);
  };

  const handleWalletFilterChange = (setter, val) => {
    setter(val);
    setWalletPage(1);
  };

  const handleTxFilterChange = (val) => {
    setTxFilter(val);
    setTxPage(1);
  };

  const handleTxSearchChange = (val) => {
    setTxSearch(val);
    setTxPage(1);
  };

  /* ─── DETAIL SCREEN SPECIFIC FILTER & PAGINATION ────────────────── */
  const detailFilteredTx = detailWalletTx.filter((t) => {
    const matchSearch =
      !detailSearch ||
      t.name.toLowerCase().includes(detailSearch.toLowerCase()) ||
      t.id.toLowerCase().includes(detailSearch.toLowerCase()) ||
      (t.sub && t.sub.toLowerCase().includes(detailSearch.toLowerCase()));

    const matchType =
      detailTypeFilter === "All" ||
      (detailTypeFilter === "Inspection" && t.type === "inspection") ||
      (detailTypeFilter === "Top-up" && t.type === "topup") ||
      (detailTypeFilter === "Refund" && t.type === "refund") ||
      (detailTypeFilter === "PPC Transaction" && (t.type === "ppc_cpi" || t.type === "ppc_cpc")) ||
      (detailTypeFilter === "PPC CPI" && t.type === "ppc_cpi") ||
      (detailTypeFilter === "PPC CPC" && t.type === "ppc_cpc");

    return matchSearch && matchType;
  });

  const detailTotalPages = Math.ceil(detailFilteredTx.length / walletsPerPage) || 1;
  const detailIndexOfLastItem = detailCurrentPage * walletsPerPage;
  const detailIndexOfFirstItem = detailIndexOfLastItem - walletsPerPage;
  const detailCurrentItems = detailFilteredTx.slice(detailIndexOfFirstItem, detailIndexOfLastItem);

  const handleDetailFilterChange = (val) => {
    setDetailTypeFilter(val);
    setDetailCurrentPage(1);
  };

  const handleDetailSearchChange = (val) => {
    setDetailSearch(val);
    setDetailCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans p-6 md:p-8 flex flex-col space-y-6 text-left">
      <Toaster position="top-right" />

      {/* Manual top-up modals */}
      {(topUpWallet || globalTopUp) && (
        <TopUpModal
          wallet={topUpWallet}
          walletsList={walletList}
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
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Finance Center</span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Wallets & Billing</h1>
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
              <button className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 bg-white transition shadow-sm">
                <Download size={14} /> Export Report
              </button>
            </div>
          </div>

          {/* Top Stat Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 min-h-[120px]">
            {/* Stat 1: Total Platform Balance */}
            <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm flex items-center justify-between relative overflow-hidden">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Platform Balance</p>
                <p className="text-xl font-black text-slate-900 mt-1.5 leading-none">
                  ₹{totalBalance.toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Wallet size={18} />
              </div>
            </div>

            {/* Stat 2: Total Reserved Funds */}
            <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm flex items-center justify-between relative overflow-hidden">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Reserved Funds</p>
                <p className="text-xl font-black text-slate-900 mt-1.5 leading-none">
                  ₹{totalReserved.toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <TrendingUp size={18} />
              </div>
            </div>

            {/* Stat 3: Total Available Funds */}
            <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm flex items-center justify-between relative overflow-hidden">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Available Funds</p>
                <p className="text-xl font-black text-slate-900 mt-1.5 leading-none">
                  ₹{totalAvailable.toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <ShieldCheck size={18} />
              </div>
            </div>

            {/* Stat 4: Active Consultants */}
            <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm flex items-center justify-between relative overflow-hidden">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Consultants</p>
                <p className="text-xl font-black text-slate-900 mt-1.5 leading-none">
                  {healthyCount} <span className="text-xs font-semibold text-slate-400">Healthy</span>
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <User size={18} />
              </div>
            </div>
          </div>

          {/* Grid Tables Container */}
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
                  <p className="font-bold text-slate-800 text-l">Consultant Wallets</p>
                  <button
                    onClick={() => setShowWalletFilters(!showWalletFilters)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition ${
                      showWalletFilters || walletTier !== "All" || walletState !== "All" || walletCity !== "All" || walletMinBal || walletMaxBal || walletDate
                        ? "bg-blue-50 text-blue-600 border-blue-200"
                        : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <SlidersHorizontal size={12} />
                    Filters
                  </button>
                </div>

                {/* Wallet Searchbar */}
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={walletSearch}
                    onChange={(e) => handleWalletFilterChange(setWalletSearch, e.target.value)}
                    placeholder="Search consultant name or ID…"
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
                        <div>
                          <label className="font-bold text-slate-400 block mb-1">Tier</label>
                          <select
                            value={walletTier}
                            onChange={(e) => handleWalletFilterChange(setWalletTier, e.target.value)}
                            className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-white"
                          >
                            <option value="All">All Tiers</option>
                            {uniqueTiers.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="font-bold text-slate-400 block mb-1">State</label>
                          <select
                            value={walletState}
                            onChange={(e) => handleWalletFilterChange(setWalletState, e.target.value)}
                            className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-white"
                          >
                            <option value="All">All States</option>
                            {uniqueStates.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="font-bold text-slate-400 block mb-1">City</label>
                          <select
                            value={walletCity}
                            onChange={(e) => handleWalletFilterChange(setWalletCity, e.target.value)}
                            className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-white"
                          >
                            <option value="All">All Cities</option>
                            {uniqueCities.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="font-bold text-slate-400 block mb-1">Registration Date</label>
                          <input
                            type="date"
                            value={walletDate}
                            onChange={(e) => handleWalletFilterChange(setWalletDate, e.target.value)}
                            className="w-full px-2 py-1 border border-slate-200 rounded-lg bg-white text-slate-700"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="font-bold text-slate-400 block mb-1">Wallet Balance Range</label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="number"
                              placeholder="Min Balance"
                              value={walletMinBal}
                              onChange={(e) => handleWalletFilterChange(setWalletMinBal, e.target.value)}
                              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                            />
                            <span className="text-slate-400 font-bold">-</span>
                            <input
                              type="number"
                              placeholder="Max Balance"
                              value={walletMaxBal}
                              onChange={(e) => handleWalletFilterChange(setWalletMaxBal, e.target.value)}
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
                      <th className="px-4 py-3 text-l">Consultant</th>
                      <th className="px-4 py-3 text-l">Balance</th>
                      <th className="px-4 py-3 text-l">Reserved</th>
                      <th className="px-4 py-3 text-l">Status</th>
                      <th className="px-4 py-3 text-center text-l">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                    {paginatedWallets.map((w) => (
                      <tr
                        key={w.id}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${w.avatarColor}`}
                            >
                              {w.initials}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-sm leading-none">{w.name}</p>
                              <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-slate-400">
                                <span className="font-semibold">{w.tier}</span>
                                <span>·</span>
                                <span className="flex items-center gap-0.5">
                                  <MapPin size={8.5} /> {w.city}, {w.state}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className={`px-4 py-3 font-extrabold text-sm ${w.balanceColor || "text-slate-800"}`}>
                          ₹{w.balance.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-slate-500 font-semibold text-sm">₹{w.reserved.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wide ${w.statusStyle}`}>
                            {w.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleOpenWalletDetails(w.id)}
                            className="p-1.5 rounded-lg cursor-pointer hover:bg-blue-50 text-blue-600 border border-blue-100 transition shadow-sm inline-flex items-center"
                            title="View Details"
                          >
                            <Eye size={13} className="stroke-[2px]" />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredWallets.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-400 text-sm font-semibold">
                          No wallets found matching the criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination footer */}
              {totalWalletPages > 1 && (
                <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold bg-slate-50/30">
                  <span>
                    Page {walletPage} of {totalWalletPages}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setWalletPage(Math.max(1, walletPage - 1))}
                      disabled={walletPage === 1}
                      className="px-2 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Prev
                    </button>
                    <button
                      onClick={() => setWalletPage(Math.min(totalWalletPages, walletPage + 1))}
                      disabled={walletPage === totalWalletPages}
                      className="px-2 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Next
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
                  <p className="font-bold text-slate-800 text-l">Recent Transactions</p>
                  <span className="text-xs text-slate-400 font-semibold bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                    {filteredTx.length} records
                  </span>
                </div>

                {/* Transactions search & filter */}
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      value={txSearch}
                      onChange={(e) => handleTxSearchChange(e.target.value)}
                      placeholder="Search transaction..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 text-slate-700 placeholder:text-slate-400"
                    />
                  </div>
                  <select
                    value={txFilter}
                    onChange={(e) => handleTxFilterChange(e.target.value)}
                    className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 text-slate-600 font-semibold"
                  >
                    <option value="All">All Types</option>
                    <option value="Inspection">Inspection Transactions</option>
                    <option value="Top-up">Top-up Transactions</option>
                    <option value="Refund">Refund Transactions</option>
                    <option value="PPC Transaction">PPC Transactions (CPI / CPC)</option>
                    <option value="PPC CPI">PPC - CPI Only</option>
                    <option value="PPC CPC">PPC - CPC Only</option>
                  </select>
                </div>
              </div>

              {/* List */}
              <div className="p-4 space-y-1 flex-1 overflow-y-auto">
                {paginatedTx.map((t) => {
                  const style = TX_STYLES[t.type] || TX_STYLES.topup;
                  const Icon = style.icon;
                  return (
                    <div
                      key={t.id}
                      className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0"
                    >
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${style.bg}`}>
                        <Icon size={16} className={style.iconColor} />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-bold text-slate-800 leading-snug truncate" title={t.name}>
                          {t.name}
                        </p>
                        <p className="text-[11.5px] text-slate-400 truncate mt-0.5" title={t.sub}>
                          {t.sub}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <p className={`text-sm font-extrabold ${style.amountColor}`}>
                          {style.prefix}₹{Math.abs(t.amount).toLocaleString()}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {t.date ? new Date(t.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : t.time}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {filteredTx.length === 0 && (
                  <div className="py-12 text-center text-slate-400 text-xs font-bold">No transactions found.</div>
                )}
              </div>

              {/* Pagination footer */}
              {totalTxPages > 1 && (
                <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold bg-slate-50/30">
                  <span>
                    Page {txPage} of {totalTxPages}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setTxPage(Math.max(1, txPage - 1))}
                      disabled={txPage === 1}
                      className="px-2 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Prev
                    </button>
                    <button
                      onClick={() => setTxPage(Math.min(totalTxPages, txPage + 1))}
                      disabled={txPage === totalTxPages}
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
        detailWallet && (
          <div className="flex flex-col space-y-6">
            
            {/* Header Toolbar */}
            <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-5 border border-slate-200/60 rounded-2xl shadow-[0_8px_30px_rgba(15,23,42,0.02)]">
              <div className="flex items-center gap-4 min-w-0">
                <button
                  onClick={() => setActiveWalletId(null)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-50 shadow-sm transition shrink-0 cursor-pointer"
                  title="Back to Wallets & Billing"
                >
                  <ArrowLeft size={16} className="stroke-[2.5px]" />
                </button>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 font-sans font-bold text-[10px] uppercase tracking-wider">
                      Wallet Details
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${detailWallet.statusStyle}`}>
                      {detailWallet.status}
                    </span>
                  </div>
                  <h1 className="text-xl font-extrabold text-slate-900 mt-1 leading-tight truncate">
                    {detailWallet.name}
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Wallet ID: <span className="font-semibold text-slate-600">{detailWallet.id}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setTopUpWallet(detailWallet)}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 text-xs font-bold transition shadow-md shadow-emerald-100 shrink-0 self-start sm:self-center cursor-pointer"
              >
                <Plus size={14} className="stroke-[2.5px]" />
                Manual Top-Up
              </button>
            </section>

            {/* Grid containing summary and info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card 1: Balance Card */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-between h-[180px]">
                <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-32 h-32 rounded-full bg-blue-500/5 pointer-events-none" />
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                    <Wallet size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">PPC Balance</p>
                    <p className="text-[26px] font-black text-slate-900 mt-0.5 leading-none">
                      ₹{detailWallet.balance.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Reserved</span>
                    <span className="text-sm font-semibold text-slate-600 block mt-0.5">
                      ₹{detailWallet.reserved.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Available</span>
                    <span className="text-sm font-bold text-emerald-600 block mt-0.5">
                      ₹{Math.max(0, detailWallet.balance - detailWallet.reserved).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Consultant Profile Details */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm space-y-3.5 text-xs flex flex-col justify-between h-[180px]">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <User size={14} className="text-slate-400" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Consultant Profile</span>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-3 flex-1 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-400">Tier</span>
                    <span className="inline-flex items-center gap-1 font-bold text-slate-700">
                      <Award size={13} className="text-amber-500" />
                      {detailWallet.tier || "Bronze"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-400">State</span>
                    <span className="inline-flex items-center gap-1 font-bold text-slate-700">
                      <Building size={13} className="text-slate-400" />
                      {detailWallet.state}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-400">City</span>
                    <span className="inline-flex items-center gap-1 font-bold text-slate-700">
                      <MapPin size={13} className="text-slate-400" />
                      {detailWallet.city}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-400">Registered</span>
                    <span className="inline-flex items-center gap-1 font-bold text-slate-700">
                      <Calendar size={13} className="text-slate-400" />
                      {detailWallet.date ? new Date(detailWallet.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Transactions Table Card */}
            <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-420px)]">
              {/* Header section with Filter controls */}
              <div className="p-5 border-b border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-800">Wallet Transactions</p>
                </div>

                {/* Filter controls row */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      value={detailSearch}
                      onChange={(e) => handleDetailSearchChange(e.target.value)}
                      placeholder="Search transaction description or ID…"
                      className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 text-slate-700 placeholder:text-slate-400"
                    />
                  </div>
                  <select
                    value={detailTypeFilter}
                    onChange={(e) => handleDetailFilterChange(e.target.value)}
                    className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 text-slate-600 font-medium"
                  >
                    <option value="All">All Types</option>
                    <option value="Inspection">Inspection Transactions</option>
                    <option value="Top-up">Top-up Transactions</option>
                    <option value="Refund">Refund Transactions</option>
                    <option value="PPC Transaction">PPC Transactions (CPI / CPC)</option>
                    <option value="PPC CPI">PPC - CPI Only</option>
                    <option value="PPC CPC">PPC - CPC Only</option>
                  </select>
                </div>
              </div>

              {/* Table wrapper */}
              <div className="flex-1 overflow-x-auto overflow-y-auto">
                <table className="w-full text-sm text-left">
                  <thead className="sticky top-0 bg-slate-50 z-10">
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="px-5 py-3">Transaction</th>
                      <th className="px-5 py-3">Type</th>
                      <th className="px-5 py-3">Amount</th>
                      <th className="px-5 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                    {detailCurrentItems.map((t) => {
                      const style = TX_STYLES[t.type] || TX_STYLES.topup;
                      const Icon = style.icon;
                      return (
                        <tr
                          key={t.id}
                          className="hover:bg-slate-50/70 transition-colors"
                        >
                          <td className="px-5 py-3.5">
                            <div>
                              <p className="text-sm font-bold text-slate-800 truncate max-w-[200px] sm:max-w-xs" title={t.name}>
                                {t.name}
                              </p>
                              <p className="text-[11.5px] text-slate-400 truncate max-w-[200px] sm:max-w-xs mt-0.5" title={t.sub}>
                                {t.sub}
                              </p>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold uppercase ${style.bg} ${style.iconColor}`}>
                              <Icon size={10} strokeWidth={2.5} />
                              {style.label}
                            </span>
                          </td>
                          <td className={`px-5 py-3.5 whitespace-nowrap text-sm font-extrabold ${style.amountColor}`}>
                            {style.prefix}₹{Math.abs(t.amount).toLocaleString()}
                          </td>
                          <td className="px-5 py-3.5 text-slate-400 whitespace-nowrap text-[12px]">
                            {t.date ? new Date(t.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : t.time}
                          </td>
                        </tr>
                      );
                    })}

                    {detailFilteredTx.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-slate-400 text-sm font-semibold">
                          No transactions found matching the filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination footer */}
              {detailTotalPages > 1 && (
                <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold bg-slate-50/30">
                  <span>
                    Showing {detailIndexOfFirstItem + 1} to {Math.min(detailIndexOfLastItem, detailFilteredTx.length)} of {detailFilteredTx.length} records
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDetailCurrentPage(Math.max(1, detailCurrentPage - 1))}
                      disabled={detailCurrentPage === 1}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-1 font-bold">
                      {Array.from({ length: detailTotalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => setDetailCurrentPage(p)}
                          className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs transition ${
                            detailCurrentPage === p
                              ? "bg-blue-600 text-white shadow-sm shadow-blue-100"
                              : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setDetailCurrentPage(Math.min(detailTotalPages, detailCurrentPage + 1))}
                      disabled={detailCurrentPage === detailTotalPages}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        )
      )}
    </div>
  );
};

export default WalletsAndBilling;