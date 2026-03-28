import React, { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Search,
  Ban,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Lock,
  ZapOff,
  FileText,
  ChevronRight,
  ShieldAlert,
  Scale,
  Eye,
  Settings2
} from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

export default function FlaggedListingsRowActions({
  onReview,
  onSuspend,
  onClear,
  onEscalate,
  onPenalty,
  onContact,
  onLockRanking,
  onRemoveBoost,
  onAddNote,
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
               <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Moderation Menu</div>
               <Settings2 size={14} className="text-slate-300" />
            </div>
            
            <div className="space-y-1">
              {/* PRIMARY ACTION MOVED HERE */}
              <MenuButton
                icon={Eye}
                label="Full Review Detail"
                onClick={() => { onReview?.(); setOpen(false); }}
                color="text-slate-900 hover:bg-sky-50 hover:text-sky-700"
                highlight={true}
              />
              
              <div className="my-2 border-t border-slate-50" />
              
              <MenuButton
                icon={Ban}
                label="Suspend Listing"
                onClick={() => { onSuspend?.(); setOpen(false); }}
                color="text-rose-600 hover:bg-rose-50"
              />
              <MenuButton
                icon={CheckCircle2}
                label="Clear Flag"
                onClick={() => { onClear?.(); setOpen(false); }}
                color="text-emerald-600 hover:bg-emerald-50"
              />
              
              <div className="my-2 border-t border-slate-50" />
              
              <MenuButton
                icon={AlertTriangle}
                label="Escalate to Fraud"
                onClick={() => { onEscalate?.(); setOpen(false); }}
                color="text-amber-600 hover:bg-amber-50"
              />
              <MenuButton
                icon={Scale}
                label="Apply Penalty"
                onClick={() => { onPenalty?.(); setOpen(false); }}
                color="text-slate-900 hover:bg-slate-50"
              />
              
              <div className="my-2 border-t border-slate-50 opacity-50" />
              
              <div className="grid grid-cols-2 gap-1 p-1">
                 <QuickActionBtn icon={Phone} label="Contact" onClick={() => { onContact?.(); setOpen(false); }} />
                 <QuickActionBtn icon={Lock} label="Lock" onClick={() => { onLockRanking?.(); setOpen(false); }} />
                 <QuickActionBtn icon={ZapOff} label="Unboost" onClick={() => { onRemoveBoost?.(); setOpen(false); }} />
                 <QuickActionBtn icon={FileText} label="Note" onClick={() => { onAddNote?.(); setOpen(false); }} />
              </div>
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
        highlight && "bg-slate-50 ring-1 ring-slate-100"
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

function QuickActionBtn({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-slate-100 bg-slate-50/50 py-3 text-[10px] font-black uppercase text-slate-500 transition-all hover:bg-slate-900 hover:text-white group"
    >
      <Icon size={16} className="transition-transform group-active:scale-90" />
      {label}
    </button>
  );
}