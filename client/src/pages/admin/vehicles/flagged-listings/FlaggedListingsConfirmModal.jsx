import React, { useState, useEffect } from "react";
import {
  X,
  AlertTriangle,
  Scale,
  Ban,
  CheckCircle2,
  ChevronDown,
  Loader2,
  CalendarDays
} from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
        {label}
      </div>
      <div className="relative group">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full appearance-none rounded-[18px] border border-slate-200 bg-white px-4 text-[14px] font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-slate-900 focus:ring-4 group-hover:border-slate-300"
        >
          <option value="">Select Option</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-900" />
      </div>
    </label>
  );
}

function InputField({ label, value, onChange, type = "text", placeholder }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
        {label}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-[18px] border border-slate-200 bg-white px-4 text-[14px] font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-slate-900 focus:ring-4 hover:border-slate-300"
      />
    </label>
  );
}

function TextareaField({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <div className="mb-2 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">
        {label}
      </div>
      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full resize-none rounded-[22px] border border-slate-200 bg-white px-5 py-4 text-[15px] font-bold text-slate-900 shadow-sm outline-none ring-slate-900/5 transition-all focus:border-slate-900 focus:ring-4 hover:border-slate-300"
      />
    </label>
  );
}

export default function FlaggedListingsConfirmModal({
  modal,
  onClose,
  onConfirm,
  loading = false,
}) {
  const [reason, setReason] = useState("");
  const [suspensionType, setSuspensionType] = useState("TEMPORARY");
  const [duration, setDuration] = useState("7 days");
  const [penaltyType, setPenaltyType] = useState("");
  const [date, setDate] = useState("");
  const [fraudReason, setFraudReason] = useState("");

  // Reset internal state when modal opens/changes
  useEffect(() => {
    if (modal) {
      setReason("");
      setSuspensionType("TEMPORARY");
      setPenaltyType("");
      setFraudReason("");
      setDate("");
    }
  }, [modal?.type, modal?.item?.vehicleId]);

  if (!modal) return null;

  const getIcon = () => {
    if (modal.type === "suspend") return <Ban className="text-rose-600" size={26} strokeWidth={2.5} />;
    if (modal.type === "clear") return <CheckCircle2 className="text-emerald-500" size={26} strokeWidth={2.5} />;
    if (modal.type === "escalate") return <AlertTriangle className="text-amber-500" size={26} strokeWidth={2.5} />;
    if (modal.type === "penalty") return <Scale className="text-slate-900" size={26} strokeWidth={2.5} />;
    return null;
  };

  const isSuspend = modal.type === "suspend";

  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className={cls(
        "fixed left-1/2 top-1/2 z-[110] w-[95%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[48px] border border-slate-200 bg-white shadow-[0_32px_80px_rgba(0,0,0,0.18)] animate-in zoom-in-95 duration-300",
        isSuspend ? "max-w-[640px]" : "max-w-[540px]"
      )}>
        {/* HEADER */}
        <div className={cls(
          "flex items-start justify-between gap-4 p-5 md:px-8 md:pt-8 md:pb-0",
          isSuspend && "bg-gradient-to-r from-rose-50/50 to-white"
        )}>
          <div className="flex items-center gap-4">
            <div className={cls(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] shadow-inner ring-1",
              isSuspend ? "bg-rose-100 text-rose-600 ring-rose-200" : "bg-slate-50/80 text-emerald-500 ring-slate-100"
            )}>
              {getIcon()}
            </div>
            <div>
              <h3 className="text-[20px] font-black tracking-tight text-slate-900 leading-none">{modal.title}</h3>
              <p className="mt-1 text-[12px] font-bold text-slate-500 font-medium">
                {modal.item.vehicleTitle || `Vehicle ID: ${modal.item.vehicleId}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-100 text-slate-400 transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-90"
          >
            <X size={22} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 md:px-8 md:py-6 space-y-4">
          {modal.type === "suspend" && (
            <div className="space-y-4">
              <label className="block">
                <div className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 font-black">
                  Reason for Suspension
                </div>
                <div className="relative group">
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="h-12 w-full appearance-none rounded-[18px] border border-slate-200 bg-white px-4 text-[14px] font-bold text-slate-900 shadow-sm outline-none ring-rose-100 transition-all focus:border-rose-400 focus:ring-4 group-hover:border-slate-300"
                  >
                    <option value="">Select reason</option>
                    <option value="Fake photos">Fake photos</option>
                    <option value="Fraud suspicion">Fraud suspicion</option>
                    <option value="Price manipulation">Price manipulation</option>
                    <option value="Duplicate listing">Duplicate listing</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-hover:text-slate-900" />
                </div>
              </label>

              <div className="block">
                <div className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 font-black">
                  Suspension Type
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSuspensionType("TEMPORARY")}
                    className={cls(
                      "rounded-[18px] border px-4 py-4 text-left transition-all",
                      suspensionType === "TEMPORARY"
                        ? "border-sky-300 bg-sky-50 ring-4 ring-sky-100"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    )}
                  >
                    <div className="text-[14px] font-black text-slate-900 leading-none">Temporary</div>
                    <div className="mt-1 text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none">Limited time</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSuspensionType("PERMANENT")}
                    className={cls(
                      "rounded-[18px] border px-4 py-4 text-left transition-all",
                      suspensionType === "PERMANENT"
                        ? "border-rose-300 bg-rose-50 ring-4 ring-rose-100"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    )}
                  >
                    <div className="text-[14px] font-black text-slate-900 leading-none">Permanent</div>
                    <div className="mt-1 text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none">Until restored</div>
                  </button>
                </div>
              </div>

              {suspensionType === "TEMPORARY" && (
                <label className="block animate-in slide-in-from-top-2 duration-300">
                  <div className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 font-black">
                    Suspend Until
                  </div>
                  <div className="relative group">
                    <input
                      type="datetime-local"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="h-12 w-full rounded-[18px] border border-slate-200 bg-white px-4 text-[14px] font-bold text-slate-900 shadow-sm outline-none ring-sky-100 transition-all focus:border-sky-400 focus:ring-4 hover:border-slate-300"
                    />
                  </div>
                </label>
              )}
            </div>
          )}

          {modal.type === "clear" && (
            <TextareaField
              label="Clearance Reason"
              value={reason}
              onChange={setReason}
              placeholder="Explain why this flag is being cleared..."
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
              <div className="pt-2">
                <TextareaField
                  label="Internal Reason"
                  value={reason}
                  onChange={setReason}
                  placeholder="Document why this penalty is being applied..."
                />
              </div>
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="bg-slate-50/50 p-5 md:px-8 md:py-6 flex flex-col gap-3 md:flex-row">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-[16px] border-2 border-slate-100 bg-white py-3 text-[14px] font-black text-slate-500 transition-all hover:bg-slate-50 active:scale-[0.98] disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={() =>
              onConfirm({
                ...modal,
                meta: {
                  reason,
                  suspensionType,
                  date,
                  fraudReason,
                  penaltyType,
                  duration,
                  suspendUntil: suspensionType === "TEMPORARY" ? date : null
                },
              })
            }
            disabled={loading || (isSuspend && !reason)}
            className={cls(
              "flex-1 items-center justify-center gap-2 rounded-[16px] py-3 text-[14px] font-black text-white shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 inline-flex",
              isSuspend ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/25" : "bg-slate-900 hover:bg-slate-800 shadow-slate-900/25"
            )}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {isSuspend ? <Ban size={18} strokeWidth={2.5} /> : <CheckCircle2 size={18} strokeWidth={2.5} />}
                {isSuspend ? "Confirm Suspend" : "Confirm Action"}
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}