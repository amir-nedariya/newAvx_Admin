import React, { useState } from "react";
import { X, AlertTriangle, Scale, Ban, CheckCircle2 } from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-black uppercase tracking-[0.08em] text-slate-400">
        {label}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 shadow-sm outline-none focus:ring-4 focus:ring-slate-900/5 transition-all"
      >
        <option value="">Select Option</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function InputField({ label, value, onChange, type = "text", placeholder }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-black uppercase tracking-[0.08em] text-slate-400">
        {label}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 shadow-sm outline-none focus:ring-4 focus:ring-slate-900/5 transition-all"
      />
    </label>
  );
}

function TextareaField({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-black uppercase tracking-[0.08em] text-slate-400">
        {label}
      </div>
      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 shadow-sm outline-none focus:ring-4 focus:ring-slate-900/5 transition-all"
      />
    </label>
  );
}

export default function FlaggedListingsConfirmModal({
  modal,
  onClose,
  onConfirm,
}) {
  const [reason, setReason] = useState("");
  const [suspensionType, setSuspensionType] = useState("");
  const [duration, setDuration] = useState("7 days");
  const [penaltyType, setPenaltyType] = useState("");
  const [date, setDate] = useState("");
  const [fraudReason, setFraudReason] = useState("");

  if (!modal) return null;

  const getIcon = () => {
    if (modal.type === "suspend") return <Ban className="text-rose-600" />;
    if (modal.type === "clear") return <CheckCircle2 className="text-emerald-600" />;
    if (modal.type === "escalate") return <AlertTriangle className="text-amber-600" />;
    if (modal.type === "penalty") return <Scale className="text-slate-900" />;
    return null;
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />

      <div className="fixed left-1/2 top-1/2 z-[110] w-[92%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-[40px] border border-slate-200 bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
             <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 shadow-inner ring-1 ring-slate-100">
                {getIcon()}
             </div>
             <div>
               <h3 className="text-2xl font-black tracking-tight text-slate-900">{modal.title}</h3>
               <p className="mt-0.5 text-sm font-bold text-slate-400">{modal.item.id}</p>
             </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-8 space-y-5">
          {modal.type === "suspend" && (
            <>
              <SelectField
                label="Reason for Suspension"
                value={reason}
                onChange={setReason}
                options={[
                  "Fraud confirmed",
                  "Duplicate",
                  "Misleading listing",
                  "Inspection mismatch",
                  "Buyer dispute",
                ]}
              />
              <div className="grid grid-cols-2 gap-4">
                <SelectField
                  label="Type"
                  value={suspensionType}
                  onChange={setSuspensionType}
                  options={["Temporary", "Permanent"]}
                />
                <InputField
                  label="Expiry Date"
                  type="date"
                  value={date}
                  onChange={setDate}
                />
              </div>
            </>
          )}

          {modal.type === "clear" && (
            <SelectField
              label="Clearance Reason"
              value={reason}
              onChange={setReason}
              options={[
                "False report",
                "No violation found",
                "System mis-detection",
              ]}
            />
          )}

          {modal.type === "escalate" && (
            <TextareaField
              label="Escalation Details"
              value={fraudReason}
              onChange={setFraudReason}
              placeholder="Why is this being escalated to the Fraud Team?"
            />
          )}

          {modal.type === "penalty" && (
             <>
                <SelectField 
                   label="Penalty Type"
                   value={penaltyType}
                   onChange={setPenaltyType}
                   options={[
                     "-5% ranking",
                     "Remove homepage eligibility",
                     "Disable boost eligibility",
                     "Category demotion"
                   ]}
                />
                <InputField 
                   label="Duration"
                   value={duration}
                   onChange={setDuration}
                   placeholder="e.g. 7 days"
                />
                <TextareaField 
                   label="Internal Reason"
                   value={reason}
                   onChange={setReason}
                   placeholder="Document why this penalty is being applied..."
                />
             </>
          )}
        </div>

        <div className="mt-10 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl border border-slate-200 py-4 text-sm font-black text-slate-500 transition-all hover:bg-slate-50"
          >
            Go Back
          </button>

          <button
            onClick={() =>
              onConfirm({
                ...modal,
                meta: { reason, suspensionType, date, fraudReason, penaltyType, duration },
              })
            }
            className="flex-1 rounded-2xl bg-slate-900 py-4 text-sm font-black text-white shadow-xl shadow-slate-900/20 transition-all hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98]"
          >
            Confirm Action
          </button>
        </div>
      </div>
    </>
  );
}