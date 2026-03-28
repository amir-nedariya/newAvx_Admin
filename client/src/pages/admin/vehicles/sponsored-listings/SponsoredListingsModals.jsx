import React, { useState } from "react";
import {
  X,
  PauseCircle,
  IndianRupee,
  LayoutTemplate,
  Gauge,
  Ban,
  RotateCcw,
  Target,
  Clock3,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const cls = (...a) => a.filter(Boolean).join(" ");

const modalContainerStyles = "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm";

const SponsoredListingsModals = ({ type, item, onClose, onConfirm }) => {
  const [value, setValue] = useState("");
  const [reason, setReason] = useState("");

  if (!type || !item) return null;

  const renderModal = () => {
    switch (type) {
      case "pause":
        return (
          <ModalFrame title="Pause Campaign" icon={PauseCircle} iconColor="text-amber-500" onClose={onClose}>
            <p className="text-[14px] font-bold text-slate-500 leading-relaxed mb-6">
              Pausing <span className="text-slate-900">{item.campaignId}</span> will stop all impressions and clicks immediately. Remaining budget will be preserved.
            </p>
            <SelectField
              label="Reason for pausing"
              options={["Fraud suspicion", "Vehicle flagged", "Policy violation", "Manual intervention", "Low quality traffic"]}
              onChange={setReason}
            />
            <button onClick={() => onConfirm({ type, reason })} className="w-full mt-6 rounded-2xl bg-amber-500 py-3.5 text-sm font-black text-white hover:bg-amber-600 active:scale-95 shadow-lg shadow-amber-200">
              Confirm Pause
            </button>
          </ModalFrame>
        );

      case "budget":
        return (
          <ModalFrame title="Adjust Budget" icon={IndianRupee} iconColor="text-blue-500" onClose={onClose}>
            <div className="mb-6 grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4">
              <BudgetStat label="Current Budget" value={`₹${item.budget}`} />
              <BudgetStat label="Spent" value={`₹${item.spent}`} />
              <BudgetStat label="Remaining" value={`₹${item.remaining}`} color="text-amber-600" />
            </div>
            <InputField label="New Budget Amount" type="number" placeholder="Enter amount" onChange={setValue} />
            <button onClick={() => onConfirm({ type, value, reason })} className="w-full mt-6 rounded-2xl bg-slate-900 py-3.5 text-sm font-black text-white hover:bg-slate-800 active:scale-95 shadow-xl shadow-slate-200">
              Update Budget Caps
            </button>
          </ModalFrame>
        );

      case "placement":
        return (
          <ModalFrame title="Change Placement" icon={LayoutTemplate} iconColor="text-indigo-500" onClose={onClose}>
            <p className="text-[14px] font-bold text-slate-500 mb-6">Current: <span className="text-indigo-600">{item.placement}</span></p>
            <SelectField
              label="Select New Placement"
              options={["Homepage Featured", "Search Top Sponsored", "Similar Vehicles Sponsored", "City Page Spotlight", "Category Priority"]}
              onChange={setValue}
            />
            <div className="mt-6 flex flex-col gap-3">
              <EligibilityCheck label="Tier Allowed" status="pass" />
              <EligibilityCheck label="Inspection Valid" status="pass" />
              <EligibilityCheck label="No Fraud Flag" status="pass" />
            </div>
            <button onClick={() => onConfirm({ type, placement: value })} className="w-full mt-6 rounded-2xl bg-indigo-600 py-3.5 text-sm font-black text-white hover:bg-indigo-700 active:scale-95 shadow-lg shadow-indigo-200">
              Update Placement
            </button>
          </ModalFrame>
        );

      case "cap":
        return (
          <ModalFrame title="Set Impression Cap" icon={Target} iconColor="text-sky-500" onClose={onClose}>
            <p className="text-[14px] font-bold text-slate-500 mb-6">Current: <span className="text-slate-900">{item.impressions.toLocaleString()} clicks</span></p>
            <InputField label="Maximum Impression Limit" type="number" placeholder="Enter cap" onChange={setValue} />
            <button onClick={() => onConfirm({ type, cap: value })} className="w-full mt-6 rounded-2xl bg-sky-600 py-3.5 text-sm font-black text-white hover:bg-sky-700 active:scale-95">
              Save Limit
            </button>
          </ModalFrame>
        );

      case "suspend":
        return (
          <ModalFrame title="Suspend Campaign" icon={Ban} iconColor="text-rose-500" onClose={onClose}>
             <p className="text-[14px] font-bold text-slate-500 leading-relaxed mb-6 text-center">
              Suspending <span className="text-slate-900 font-black">{item.campaignId}</span> is a critical action. Budget will be frozen until reinstated by an admin.
            </p>
            <label className="block mb-6">
              <span className="mb-2 block text-[12px] font-black uppercase tracking-wider text-slate-500">Suspension Reason</span>
              <textarea
                onChange={(e) => setReason(e.target.value)}
                className="w-full h-24 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-[14px] font-bold outline-none focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-50 placeholder:text-slate-300"
                placeholder="Explain why this campaign is being suspended..."
              />
            </label>
            <button onClick={() => onConfirm({ type, reason })} className="w-full rounded-2xl bg-rose-600 py-3.5 text-sm font-black text-white hover:bg-rose-700 active:scale-95 shadow-lg shadow-rose-200">
              Confirm Critical Suspension
            </button>
          </ModalFrame>
        );

      case "refund":
        return (
          <ModalFrame title="Issue Refund" icon={RotateCcw} iconColor="text-violet-500" onClose={onClose}>
            <div className="mb-6">
              <SelectField label="Refund Type" options={["Full Remaining Budget", "Partial Amount"]} onChange={setValue} />
            </div>
            <InputField label="Refund Amount" type="number" placeholder="Enter amount" onChange={setReason} />
            <button onClick={() => onConfirm({ type, amount: reason, refundType: value })} className="w-full mt-6 rounded-2xl bg-violet-600 py-3.5 text-sm font-black text-white hover:bg-violet-700">
              Process Finance Entry
            </button>
          </ModalFrame>
        );

      default:
        return null;
    }
  };

  return (
    <div className={modalContainerStyles}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-[480px]"
      >
        {renderModal()}
      </motion.div>
    </div>
  );
};

const ModalFrame = ({ title, icon: Icon, iconColor, onClose, children }) => (
  <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_40px_80px_-20px_rgba(15,23,42,0.3)]">
    <div className="relative p-8">
      <header className="mb-8 flex flex-col items-center text-center">
        <div className={cls("mb-4 flex h-20 w-20 items-center justify-center rounded-[28px] bg-slate-50 shadow-inner", iconColor)}>
          {Icon && <Icon className="h-10 w-10" />}
        </div>
        <h3 className="text-[24px] font-black tracking-tight text-slate-900">{title}</h3>
      </header>
      {children}
      <button onClick={onClose} className="absolute right-6 top-6 rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600">
        <X className="h-5 w-5" />
      </button>
    </div>
  </div>
);

const BudgetStat = ({ label, value, color = "text-slate-900" }) => (
  <div className="flex flex-col">
    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{label}</span>
    <span className={cls("text-[15px] font-black tracking-tight", color)}>{value}</span>
  </div>
);

const InputField = ({ label, type, placeholder, onChange }) => (
  <label className="block">
    <span className="mb-2 block text-[12px] font-black uppercase tracking-wider text-slate-500">{label}</span>
    <input
      type={type}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-[14px] font-bold outline-none transition-all focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100 placeholder:text-slate-300"
    />
  </label>
);

const SelectField = ({ label, options, onChange }) => (
  <label className="block">
    <span className="mb-2 block text-[12px] font-black uppercase tracking-wider text-slate-500">{label}</span>
    <select
      onChange={(e) => onChange(e.target.value)}
      className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-[14px] font-bold outline-none focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
    >
      {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </label>
);

const EligibilityCheck = ({ label, status }) => (
  <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-emerald-700">
    <div className="h-2 w-2 rounded-full bg-emerald-500" />
    <span className="text-[12px] font-black tracking-wider uppercase">{label}</span>
    <span className="ml-auto text-[10px] font-black uppercase">Verified</span>
  </div>
);

export default SponsoredListingsModals;
