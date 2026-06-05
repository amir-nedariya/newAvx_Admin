import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Search,
  X,
  Check,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  Calendar,
  MapPin,
  User,
  Wallet,
  Building,
  Award,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { mockWallets, mockTransactions } from "./mockData";

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
const TopUpModal = ({ wallet, onClose, onConfirm }) => {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const presets = [500, 1000, 2000, 5000];

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
              Manually credit this consultant's PPC wallet. This is logged as an admin top-up.
            </div>
            {wallet && (
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1.5">Consultant</p>
                <div className="px-3 py-2 bg-slate-50 rounded-lg text-sm font-semibold text-slate-800 flex items-center justify-between">
                  <span>{wallet.name}</span>
                  <span className="text-xs text-slate-400 font-normal">Current: ₹{wallet.balance.toLocaleString()}</span>
                </div>
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
              onClick={() => onConfirm(Number(amount))}
              disabled={!amount || Number(amount) <= 0}
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
const PPCWalletDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [wallet, setWallet] = useState(null);
  const [walletTx, setWalletTx] = useState([]);
  const [showTopUp, setShowTopUp] = useState(false);
  
  // Filtering & searching states
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    // Find wallet by ID
    const foundWallet = mockWallets.find((w) => w.id === id);
    if (foundWallet) {
      // Check if session storage or local state already has updates for this wallet
      const key = `wallet_details_${id}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        setWallet(parsed.wallet);
        setWalletTx(parsed.transactions);
      } else {
        setWallet(foundWallet);
        const relatedTx = mockTransactions.filter((tx) => tx.consultantId === id);
        setWalletTx(relatedTx);
      }
    }
  }, [id]);

  const saveState = (updatedWallet, updatedTx) => {
    const key = `wallet_details_${id}`;
    localStorage.setItem(key, JSON.stringify({ wallet: updatedWallet, transactions: updatedTx }));
    
    // Also update main local storage lists to maintain sync with PPCWallets
    const allWalletsKey = "ppc_wallets_list";
    const allTxKey = "ppc_transactions_list";
    
    let allWallets = JSON.parse(localStorage.getItem(allWalletsKey)) || mockWallets;
    let allTx = JSON.parse(localStorage.getItem(allTxKey)) || mockTransactions;

    allWallets = allWallets.map((w) => (w.id === id ? updatedWallet : w));
    
    // Find if the newly added transaction is already in allTx.
    // Since we prepend to updatedTx, we take the first item if its length is greater.
    if (updatedTx.length > walletTx.length) {
      const newTx = updatedTx[0];
      allTx = [newTx, ...allTx];
    }
    
    localStorage.setItem(allWalletsKey, JSON.stringify(allWallets));
    localStorage.setItem(allTxKey, JSON.stringify(allTx));
  };

  const handleTopUpConfirm = (amount) => {
    if (!wallet || !amount) return;

    const updatedWallet = {
      ...wallet,
      balance: wallet.balance + amount,
      status: wallet.balance + amount >= 1000 ? "Healthy" : (wallet.balance + amount >= 500 ? "Low" : "Critical"),
      statusStyle: wallet.balance + amount >= 1000 
        ? "bg-emerald-50 text-emerald-700" 
        : (wallet.balance + amount >= 500 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-600"),
      balanceColor: wallet.balance + amount >= 1000 
        ? "text-slate-800" 
        : (wallet.balance + amount >= 500 ? "text-amber-600" : "text-red-500")
    };

    const newTx = {
      id: `TXN-${Date.now()}`,
      consultantId: id,
      type: "topup",
      name: `${wallet.name} — admin top-up`,
      sub: "Wallet credited manually",
      amount: amount,
      time: "Just now",
      date: new Date().toISOString().split("T")[0],
    };

    const updatedTx = [newTx, ...walletTx];

    setWallet(updatedWallet);
    setWalletTx(updatedTx);
    setShowTopUp(false);
    
    // Save state to sync across pages
    saveState(updatedWallet, updatedTx);

    toast.success(`Successfully credited ₹${amount.toLocaleString()} to ${wallet.name}'s wallet!`);
  };

  if (!wallet) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center bg-slate-50/50 p-6 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <p className="text-slate-500 text-sm mt-4">Loading wallet details...</p>
      </div>
    );
  }

  // Filter transactions
  const filteredTx = walletTx.filter((t) => {
    const matchSearch =
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      (t.sub && t.sub.toLowerCase().includes(search.toLowerCase()));

    const matchType =
      typeFilter === "All" ||
      (typeFilter === "Inspection" && t.type === "inspection") ||
      (typeFilter === "Top-up" && t.type === "topup") ||
      (typeFilter === "Refund" && t.type === "refund") ||
      (typeFilter === "PPC Transaction" && (t.type === "ppc_cpi" || t.type === "ppc_cpc")) ||
      (typeFilter === "PPC CPI" && t.type === "ppc_cpi") ||
      (typeFilter === "PPC CPC" && t.type === "ppc_cpc");

    return matchSearch && matchType;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredTx.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTx.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Reset page when filters change
  const handleFilterChange = (val) => {
    setTypeFilter(val);
    setCurrentPage(1);
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col space-y-6 p-6 md:p-8 bg-slate-50/50 min-h-screen text-left">
      <Toaster position="top-right" />

      {showTopUp && (
        <TopUpModal
          wallet={wallet}
          onClose={() => setShowTopUp(false)}
          onConfirm={handleTopUpConfirm}
        />
      )}

      {/* Header / Toolbar */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-5 border border-slate-200/60 rounded-2xl shadow-[0_8px_30px_rgba(15,23,42,0.02)]">
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={() => navigate("/admin/ppc/wallets")}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-50 shadow-sm transition shrink-0"
            title="Back to PPC Billing"
          >
            <ArrowLeft size={16} className="stroke-[2.5px]" />
          </button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 font-sans font-bold text-[10px] uppercase tracking-wider">
                Wallet Details
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${wallet.statusStyle}`}>
                {wallet.status}
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 mt-1 leading-tight truncate">
              {wallet.name}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Wallet ID: <span className="font-semibold text-slate-600">{wallet.id}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowTopUp(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 text-xs font-bold transition shadow-md shadow-emerald-100 shrink-0 self-start sm:self-center"
        >
          <Plus size={14} className="stroke-[2.5px]" />
          Manual Top-Up
        </button>
      </section>

      {/* First Row Grid: Balance Card and Consultant Profile side-by-side */}
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
                ₹{wallet.balance.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Reserved</span>
              <span className="text-sm font-semibold text-slate-600 block mt-0.5">
                ₹{wallet.reserved.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Available</span>
              <span className="text-sm font-bold text-emerald-600 block mt-0.5">
                ₹{Math.max(0, wallet.balance - wallet.reserved).toLocaleString()}
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
                {wallet.tier || "Bronze"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-400">State</span>
              <span className="inline-flex items-center gap-1 font-bold text-slate-700">
                <Building size={13} className="text-slate-400" />
                {wallet.state}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-400">City</span>
              <span className="inline-flex items-center gap-1 font-bold text-slate-700">
                <MapPin size={13} className="text-slate-400" />
                {wallet.city}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-400">Registered</span>
              <span className="inline-flex items-center gap-1 font-bold text-slate-700">
                <Calendar size={13} className="text-slate-400" />
                {wallet.date ? new Date(wallet.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row: Transactions Table Card taking full width and stretching to viewport bottom */}
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
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search transaction description or ID…"
                    className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 text-slate-700 placeholder:text-slate-400"
                  />
                </div>
                <select
                  value={typeFilter}
                  onChange={(e) => handleFilterChange(e.target.value)}
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

            {/* Table or list of transactions */}
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
                  {currentItems.map((t) => {
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

                  {filteredTx.length === 0 && (
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
            {totalPages > 1 && (
              <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold bg-slate-50/30">
                <span>
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredTx.length)} of {filteredTx.length} records
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1 font-bold">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs transition ${
                          currentPage === p
                            ? "bg-blue-600 text-white shadow-sm shadow-blue-100"
                            : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>
    );
  };
  
  export default PPCWalletDetails;
