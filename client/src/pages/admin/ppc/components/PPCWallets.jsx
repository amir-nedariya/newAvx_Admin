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
} from "lucide-react";
import { mockWallets, mockTransactions } from "../mockData";

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
              Manually credit the consultant's PPC wallet. This is logged as an admin top-up.
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
const PPCWallets = () => {
  const navigate = useNavigate();

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

  // Sync state to local storage and keep individual pages in sync
  useEffect(() => {
    localStorage.setItem("ppc_wallets_list", JSON.stringify(walletList));
  }, [walletList]);

  useEffect(() => {
    localStorage.setItem("ppc_transactions_list", JSON.stringify(txList));
  }, [txList]);

  // Read updates dynamically from details pages that might have written to localStorage
  useEffect(() => {
    const syncLists = () => {
      const savedWallets = localStorage.getItem("ppc_wallets_list");
      if (savedWallets) setWalletList(JSON.parse(savedWallets));
      const savedTx = localStorage.getItem("ppc_transactions_list");
      if (savedTx) setTxList(JSON.parse(savedTx));
    };

    window.addEventListener("storage", syncLists);
    // Also run on mount to capture any changes made in detail pages
    syncLists();
    
    return () => window.removeEventListener("storage", syncLists);
  }, []);

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
    
    // Write directly to local storage to also sync the detail page if stored
    localStorage.setItem(`wallet_details_${target.id}`, JSON.stringify({
      wallet: updatedWallets.find(w => w.id === target.id),
      transactions: updatedTx.filter(tx => tx.consultantId === target.id)
    }));

    setTopUpWallet(null);
    setGlobalTopUp(false);
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

  return (
    <>
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

      <div className="space-y-6">
        {/* Global Toolbar */}
        <div className="flex flex-wrap gap-3 items-center bg-white p-4 border border-slate-100 rounded-2xl shadow-sm">
          <p className="text-l font-bold text-slate-800">Billing Controls</p>
          <button
            onClick={() => setGlobalTopUp(true)}
            className="ml-auto flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition shadow-sm"
          >
            <Plus size={14} className="stroke-[2.5px]" /> Manual top-up
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition">
            <Download size={14} /> Export Report
          </button>
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-fit">
          
          {/* ── WALLETS SECTION (7 Columns on large screens) ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="lg:col-span-8 bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-350px)]"
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
                          onClick={() => navigate(`/admin/ppc/wallets/${w.id}`)}
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

          {/* ── TRANSACTIONS SECTION (5 Columns on large screens) ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
            className="lg:col-span-4 bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-350px)]"
          >
            <div className="flex flex-col px-5 py-4 border-b border-slate-100 gap-3">
              <div className="flex items-center justify-between">
                <p className="font-bold text-slate-800 text-l">Recent Transactions</p>
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
      </div>
    </>
  );
};

export default PPCWallets;
