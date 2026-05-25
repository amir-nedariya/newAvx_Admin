import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Download, Search, X, Check, ArrowDownLeft, ArrowUpRight, RefreshCw } from "lucide-react";

/* ─── DATA ─────────────────────────────────────────────────────── */
const wallets = [
  {
    id: "W-001",
    name: "Rajesh Kumar",
    initials: "RK",
    avatarColor: "bg-blue-100 text-blue-700",
    balance: 7682,
    reserved: 1500,
    status: "Healthy",
    statusStyle: "bg-emerald-50 text-emerald-700",
  },
  {
    id: "W-002",
    name: "Priya Autos",
    initials: "PA",
    avatarColor: "bg-indigo-100 text-indigo-700",
    balance: 42,
    reserved: 0,
    status: "Critical",
    statusStyle: "bg-red-50 text-red-600",
    balanceColor: "text-red-500",
  },
  {
    id: "W-003",
    name: "Suresh K.",
    initials: "SK",
    avatarColor: "bg-amber-100 text-amber-700",
    balance: 3200,
    reserved: 900,
    status: "Healthy",
    statusStyle: "bg-emerald-50 text-emerald-700",
  },
  {
    id: "W-004",
    name: "Ravi Mehta",
    initials: "RM",
    avatarColor: "bg-red-100 text-red-700",
    balance: 580,
    reserved: 800,
    status: "Low",
    statusStyle: "bg-amber-50 text-amber-700",
    balanceColor: "text-amber-600",
  },
];

const transactions = [
  {
    id: "TXN-8821",
    type: "credit",
    name: "Rajesh Kumar — top-up",
    sub: "Wallet credited · Ref #TXN-8821",
    amount: 5000,
    time: "10 min ago",
  },
  {
    id: "TXN-8820",
    type: "debit",
    name: "Priya Autos — CPI charge",
    sub: "Inquiry on Mercedes C200 · Ad #AD-0391",
    amount: -35,
    time: "22 min ago",
  },
  {
    id: "TXN-8819",
    type: "debit",
    name: "Rajesh Kumar — CPC charge",
    sub: "6 clicks · BMW X1 homepage · Ad #AD-0482",
    amount: -27,
    time: "35 min ago",
  },
  {
    id: "TXN-8804",
    type: "refund",
    name: "NP Motors — refund issued",
    sub: "Campaign disabled by admin · ₹90 returned",
    amount: 90,
    time: "2 days ago",
  },
  {
    id: "TXN-8800",
    type: "credit",
    name: "Suresh K. — top-up",
    sub: "Wallet credited · Ref #TXN-8800",
    amount: 2000,
    time: "3 days ago",
  },
  {
    id: "TXN-8795",
    type: "debit",
    name: "Ravi Mehta — CPC charge",
    sub: "14 clicks · Fortuner homepage · Ad #AD-0483",
    amount: -42,
    time: "3 days ago",
  },
];

const TX_STYLES = {
  credit: {
    bg: "bg-emerald-50",
    icon: ArrowDownLeft,
    iconColor: "text-emerald-600",
    amountColor: "text-emerald-600",
    prefix: "+",
  },
  debit: {
    bg: "bg-amber-50",
    icon: ArrowUpRight,
    iconColor: "text-amber-600",
    amountColor: "text-red-500",
    prefix: "",
  },
  refund: {
    bg: "bg-blue-50",
    icon: RefreshCw,
    iconColor: "text-blue-600",
    amountColor: "text-emerald-600",
    prefix: "+",
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
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition"><X size={16} /></button>
          </div>
          <div className="p-5 space-y-4">
            <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-700 leading-relaxed">
              Manually credit the consultant's PPC wallet. This is logged as an admin top-up.
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
              <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Reason for manual top-up…" className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 resize-none text-slate-700" />
            </div>
          </div>
          <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-100">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-slate-600 hover:bg-slate-100 transition">Cancel</button>
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

/* ─── COMPONENT ─────────────────────────────────────────────────── */
const PPCWallets = () => {
  const [walletList, setWalletList] = useState(wallets);
  const [txList, setTxList] = useState(transactions);
  const [topUpWallet, setTopUpWallet] = useState(null); // null = global, else specific wallet
  const [globalTopUp, setGlobalTopUp] = useState(false);
  const [txFilter, setTxFilter] = useState("All");
  const [search, setSearch] = useState("");

  const handleTopUp = (amount) => {
    const target = topUpWallet;
    if (!target || !amount) {
      setGlobalTopUp(false);
      setTopUpWallet(null);
      return;
    }
    setWalletList((prev) =>
      prev.map((w) => (w.id === target.id ? { ...w, balance: w.balance + amount } : w))
    );
    setTxList((prev) => [
      {
        id: `TXN-${Date.now()}`,
        type: "credit",
        name: `${target.name} — admin top-up`,
        sub: `Wallet credited manually`,
        amount: amount,
        time: "Just now",
      },
      ...prev,
    ]);
    setTopUpWallet(null);
    setGlobalTopUp(false);
  };

  const filteredTx = txList.filter((t) => {
    const matchFilter =
      txFilter === "All" ||
      (txFilter === "Top-ups" && t.type === "credit") ||
      (txFilter === "Deductions" && t.type === "debit") ||
      (txFilter === "Refunds" && t.type === "refund");
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <>
      {(topUpWallet || globalTopUp) && (
        <TopUpModal
          wallet={topUpWallet}
          onClose={() => { setTopUpWallet(null); setGlobalTopUp(false); }}
          onConfirm={handleTopUp}
        />
      )}

      <div className="space-y-4">
        {/* Filter Bar */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search consultant or transaction ID…"
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 text-slate-700"
            />
          </div>
          <select value={txFilter} onChange={(e) => setTxFilter(e.target.value)} className="text-sm px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 text-slate-600">
            {["All", "Top-ups", "Deductions", "Refunds"].map((o) => <option key={o}>{o}</option>)}
          </select>
          <button onClick={() => setGlobalTopUp(true)} className="ml-auto flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition">
            <Plus size={14} /> Manual top-up
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition">
            <Download size={14} /> Export
          </button>
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Wallet Balances */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-slate-100">
              <p className="font-semibold text-slate-800">Wallet balances</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    {["Consultant", "Balance", "Reserved", "Status", ""].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {walletList.map((w, i) => (
                    <motion.tr
                      key={w.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${w.avatarColor}`}>
                            {w.initials}
                          </div>
                          <p className="font-semibold text-slate-800 text-sm">{w.name}</p>
                        </div>
                      </td>
                      <td className={`px-4 py-3 font-bold ${w.balanceColor || "text-slate-800"}`}>₹{w.balance.toLocaleString()}</td>
                      <td className="px-4 py-3 text-slate-500">₹{w.reserved.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-md ${w.statusStyle}`}>{w.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setTopUpWallet(w)}
                          className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 border border-emerald-200 transition"
                          title="Top up"
                        >
                          <Plus size={14} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
            className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <p className="font-semibold text-slate-800">Recent transactions</p>
              <span className="text-xs text-slate-400">{filteredTx.length} records</span>
            </div>
            <div className="p-4 space-y-1 max-h-[380px] overflow-y-auto">
              <AnimatePresence>
                {filteredTx.map((t, i) => {
                  const style = TX_STYLES[t.type];
                  const Icon = style.icon;
                  return (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0"
                    >
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${style.bg}`}>
                        <Icon size={16} className={style.iconColor} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 leading-snug truncate">{t.name}</p>
                        <p className="text-xs text-slate-400 truncate">{t.sub}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-sm font-bold ${style.amountColor}`}>
                          {style.prefix}₹{Math.abs(t.amount).toLocaleString()}
                        </p>
                        <p className="text-[11px] text-slate-400">{t.time}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {filteredTx.length === 0 && (
                <div className="py-12 text-center text-slate-400 text-sm">No transactions found.</div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PPCWallets;
