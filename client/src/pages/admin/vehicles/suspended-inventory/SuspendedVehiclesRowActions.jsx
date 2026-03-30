import React, { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  ShieldCheck,
  ChevronRight,
  Settings2,
} from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

export default function SuspendedVehiclesRowActions({
  onUnsuspend,
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-end" ref={menuRef}>
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className={cls(
            "flex h-11 w-11 items-center justify-center rounded-[18px] border transition-all duration-300 active:scale-90 shadow-sm",
            open
              ? "bg-slate-900 border-slate-900 text-white ring-4 ring-slate-900/10"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
          )}
        >
          <MoreVertical size={20} strokeWidth={2.5} />
        </button>

        {open && (
          <div className="absolute right-0 top-14 z-[60] w-72 origin-top-right rounded-[32px] border border-slate-200 bg-white p-2.5 shadow-2xl animate-in zoom-in-95 duration-200 ring-1 ring-slate-900/5">
            <div className="mb-2 px-4 py-3 border-b border-slate-50 flex items-center justify-between">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Suspension Menu
              </div>
              <Settings2 size={14} className="text-slate-300" />
            </div>

            <div className="space-y-1">
              <MenuButton
                icon={ShieldCheck}
                label="Unsuspend Vehicle"
                onClick={() => {
                  onUnsuspend?.();
                  setOpen(false);
                }}
                color="text-emerald-600 hover:bg-emerald-50"
                highlight={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MenuButton({ icon: Icon, label, onClick, color, highlight }) {
  return (
    <button
      onClick={onClick}
      className={cls(
        "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-black transition-all",
        color,
        highlight && "bg-emerald-50/50 ring-1 ring-emerald-100/50"
      )}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} />
        {label}
      </div>
      <ChevronRight size={14} className="opacity-30" />
    </button>
  );
}
