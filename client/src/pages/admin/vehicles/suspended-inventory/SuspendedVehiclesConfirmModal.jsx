import React, { useState } from "react";
import { X, ShieldCheck, AlertTriangle } from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

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
        className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 shadow-sm outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all focus:border-emerald-400"
      />
    </label>
  );
}

export default function SuspendedVehiclesConfirmModal({
  modal,
  onClose,
  onConfirm,
}) {
  const [reason, setReason] = useState("");

  // Reset reason when modal changes (opens for a new vehicle)
  React.useEffect(() => {
    if (modal) {
      setReason("");
    }
  }, [modal]);

  if (!modal) return null;

  const getIcon = () => {
    if (modal.type === "unsuspend")
      return <ShieldCheck className="text-emerald-600" />;
    return <AlertTriangle className="text-amber-600" />;
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="fixed left-1/2 top-1/2 z-[110] w-[92%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-[40px] border border-slate-200 bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 shadow-inner ring-1 ring-emerald-100">
              {getIcon()}
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight text-slate-900">
                {modal.title}
              </h3>
              <p className="mt-0.5 text-sm font-bold text-slate-400">
                Vehicle ID: {modal.item?.vehicleId}
              </p>
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
          <TextareaField
            label="Reason for Unsuspension"
            value={reason}
            onChange={setReason}
            placeholder="Document why this vehicle is being unsuspended (optional)..."
          />
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
                reason,
              })
            }
            className="flex-1 rounded-2xl bg-emerald-600 py-4 text-sm font-black text-white shadow-xl shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98]"
          >
            Confirm Restore
          </button>
        </div>
      </div>
    </>
  );
}
