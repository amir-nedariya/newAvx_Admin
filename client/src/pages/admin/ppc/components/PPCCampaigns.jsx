import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Pause, Play, Ban, Check, X, Download, Search } from "lucide-react";

/* ─── DATA ─────────────────────────────────────────────────────── */
const allCampaigns = [
  {
    id: "C-0482",
    consultant: "Rajesh Kumar",
    company: "Rajesh Motors",
    initials: "RK",
    avatarColor: "bg-blue-100 text-blue-700",
    vehicle: "BMW X1 2023",
    vehiclePrice: "₹42L",
    placement: "Homepage",
    type: "CPC",
    status: "Active",
    spend: 558,
    clicks: 124,
    inquiries: 8,
    flagged: false,
  },
  {
    id: "C-0483",
    consultant: "Ravi Mehta",
    company: "Speed Autos",
    initials: "RM",
    avatarColor: "bg-red-100 text-red-700",
    vehicle: "Fortuner 2022",
    vehiclePrice: "₹35L",
    placement: "Search result",
    type: "CPC",
    status: "Active",
    spend: 1820,
    clicks: 340,
    inquiries: 0,
    flagged: true,
  },
  {
    id: "C-0391",
    consultant: "Priya Autos",
    company: "Priya Automobiles",
    initials: "PA",
    avatarColor: "bg-indigo-100 text-indigo-700",
    vehicle: "Mercedes C200",
    vehiclePrice: "₹52L",
    placement: "Vehicle detail",
    type: "CPI",
    status: "Active",
    spend: 216,
    clicks: null,
    inquiries: 12,
    flagged: false,
  },
  {
    id: "C-0500",
    consultant: "Suresh K.",
    company: "City Cars",
    initials: "SK",
    avatarColor: "bg-amber-100 text-amber-700",
    vehicle: "Audi A4 2021",
    vehiclePrice: "₹38L",
    placement: "Consultant",
    type: "CPC",
    status: "In review",
    spend: 0,
    clicks: 0,
    inquiries: 0,
    flagged: false,
  },
  {
    id: "C-0321",
    consultant: "Nikhil P.",
    company: "NP Motors",
    initials: "NP",
    avatarColor: "bg-emerald-100 text-emerald-700",
    vehicle: "Honda City 2023",
    vehiclePrice: "₹14.5L",
    placement: "Search result",
    type: "CPI",
    status: "Disabled",
    spend: 90,
    clicks: null,
    inquiries: 3,
    flagged: false,
  },
];

const STATUS_STYLE = {
  Active: "bg-emerald-50 text-emerald-700",
  "In review": "bg-blue-50 text-blue-700",
  Disabled: "bg-red-50 text-red-600",
  Paused: "bg-amber-50 text-amber-700",
};

const TYPE_STYLE = {
  CPC: "bg-blue-50 text-blue-700",
  CPI: "bg-amber-50 text-amber-700",
};

/* ─── OVERRIDE / ACTION MODAL ───────────────────────────────────── */
const ActionModal = ({ campaign, action, onClose, onConfirm }) => {
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const isDisable = action === "disable";

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
            <p className="font-semibold text-slate-800">
              {isDisable ? "Disable campaign" : "Pause campaign"}
            </p>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition">
              <X size={16} />
            </button>
          </div>
          <div className="p-5 space-y-4">
            <div className={`p-3 rounded-xl text-xs leading-relaxed ${isDisable ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>
              {isDisable
                ? "This will immediately stop the campaign. The consultant will be notified. Unspent reserved budget will be refunded to their wallet."
                : "Campaign will be paused. Consultant can resume at any time. No budget will be refunded."}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1.5">Campaign</p>
              <div className="px-3 py-2 bg-slate-50 rounded-lg text-sm font-semibold text-slate-800">
                {campaign.company} — {campaign.vehicle}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1.5">Reason (shown to consultant)</p>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 text-slate-700"
              >
                <option value="">Select a reason…</option>
                <option>Suspicious click activity detected</option>
                <option>Vehicle listing no longer valid</option>
                <option>Incorrect vehicle information</option>
                <option>Policy violation</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1.5">Additional notes (internal only)</p>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Internal notes for audit trail…"
                className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 resize-none text-slate-700"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-100">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-slate-600 hover:bg-slate-100 transition">
              Cancel
            </button>
            <button
              onClick={() => onConfirm(action)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                isDisable
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-amber-400 text-white hover:bg-amber-500"
              }`}
            >
              {isDisable ? <Ban size={14} /> : <Pause size={14} />}
              {isDisable ? "Disable campaign" : "Pause campaign"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─── APPROVE MODAL ─────────────────────────────────────────────── */
const ApproveModal = ({ campaign, onClose, onConfirm }) => (
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
          <p className="font-semibold text-slate-800">Approve campaign</p>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-700 leading-relaxed">
            Campaign will go live immediately after approval. Budget will be reserved from consultant wallet.
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1.5">Campaign</p>
            <div className="px-3 py-2 bg-slate-50 rounded-lg text-sm font-semibold text-slate-800">
              {campaign?.company} — {campaign?.vehicle} · {campaign?.placement} · {campaign?.type}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1.5">Approval notes (optional)</p>
            <textarea rows={2} placeholder="Any notes for internal record…" className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 resize-none text-slate-700" />
          </div>
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-100">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-slate-600 hover:bg-slate-100 transition">Cancel</button>
          <button onClick={() => onConfirm()} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition">
            <Check size={14} /> Approve & go live
          </button>
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

/* ─── COMPONENT ─────────────────────────────────────────────────── */
const PPCCampaigns = () => {
  const [campaigns, setCampaigns] = useState(allCampaigns);
  const [search, setSearch] = useState("");
  const [filterPlacement, setFilterPlacement] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [modal, setModal] = useState(null); // { campaign, action }
  const [approveModal, setApproveModal] = useState(null);

  const filtered = campaigns.filter((c) => {
    const matchSearch =
      !search ||
      c.consultant.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.vehicle.toLowerCase().includes(search.toLowerCase());
    const matchPlacement = filterPlacement === "All" || c.placement === filterPlacement;
    const matchStatus = filterStatus === "All" || c.status === filterStatus;
    const matchType = filterType === "All" || c.type === filterType;
    return matchSearch && matchPlacement && matchStatus && matchType;
  });

  const handleActionConfirm = (action) => {
    const newStatus = action === "disable" ? "Disabled" : "Paused";
    setCampaigns((prev) =>
      prev.map((c) => (c.id === modal.campaign.id ? { ...c, status: newStatus } : c))
    );
    setModal(null);
  };

  const handleApprove = () => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === approveModal.id ? { ...c, status: "Active" } : c))
    );
    setApproveModal(null);
  };

  return (
    <>
      {modal && (
        <ActionModal
          campaign={modal.campaign}
          action={modal.action}
          onClose={() => setModal(null)}
          onConfirm={handleActionConfirm}
        />
      )}
      {approveModal && (
        <ApproveModal
          campaign={approveModal}
          onClose={() => setApproveModal(null)}
          onConfirm={handleApprove}
        />
      )}

      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search consultant, vehicle…"
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 text-slate-700"
            />
          </div>
          {[
            { label: "Placement", value: filterPlacement, setter: setFilterPlacement, options: ["All", "Homepage", "Search result", "Vehicle detail", "Consultant"] },
            { label: "Status", value: filterStatus, setter: setFilterStatus, options: ["All", "Active", "Paused", "In review", "Disabled"] },
            { label: "Billing", value: filterType, setter: setFilterType, options: ["All", "CPC", "CPI"] },
          ].map(({ label, value, setter, options }) => (
            <select
              key={label}
              value={value}
              onChange={(e) => setter(e.target.value)}
              className="text-sm px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 text-slate-600"
            >
              {options.map((o) => (
                <option key={o}>{o === "All" ? `All ${label.toLowerCase()}s` : o}</option>
              ))}
            </select>
          ))}
          <button className="ml-auto flex items-center gap-1.5 px-4 py-2 text-sm border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition">
            <Download size={14} /> Export
          </button>
        </div>

        {/* Table Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Consultant", "Vehicle", "Placement", "Type", "Status", "Spend", "Clicks", "Inquiries", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((c, i) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`hover:bg-slate-50 transition-colors ${c.flagged ? "bg-red-50/50" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${c.avatarColor}`}>
                          {c.initials}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{c.consultant}</p>
                          <p className="text-xs text-slate-400">{c.company}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800 text-sm">{c.vehicle}</p>
                      <p className="text-xs text-slate-400">{c.vehiclePrice}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{c.placement}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${TYPE_STYLE[c.type]}`}>{c.type}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${STATUS_STYLE[c.status]}`}>{c.status}</span>
                    </td>
                    <td className={`px-4 py-3 font-semibold ${c.flagged ? "text-red-600" : "text-slate-800"}`}>₹{c.spend.toLocaleString()}</td>
                    <td className={`px-4 py-3 ${c.flagged ? "text-red-600 font-bold" : "text-slate-700"}`}>
                      {c.clicks === null ? "—" : c.flagged ? `${c.clicks} ⚠` : c.clicks}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{c.inquiries === null ? "—" : c.inquiries}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button title="View details" className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition">
                          <Eye size={14} />
                        </button>
                        {c.status === "In review" ? (
                          <>
                            <button
                              title="Approve"
                              onClick={() => setApproveModal(c)}
                              className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 border border-emerald-200 transition"
                            >
                              <Check size={14} />
                            </button>
                            <button title="Reject" className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 border border-red-200 transition">
                              <X size={14} />
                            </button>
                          </>
                        ) : c.status === "Disabled" ? (
                          <button title="Re-enable" className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 border border-emerald-200 transition">
                            <Play size={14} />
                          </button>
                        ) : (
                          <>
                            <button
                              title="Pause"
                              onClick={() => setModal({ campaign: c, action: "pause" })}
                              className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 border border-amber-200 transition"
                            >
                              <Pause size={14} />
                            </button>
                            <button
                              title="Disable"
                              onClick={() => setModal({ campaign: c, action: "disable" })}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 border border-red-200 transition"
                            >
                              <Ban size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-14 text-center text-slate-400 text-sm">No campaigns match your filters.</div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default PPCCampaigns;
