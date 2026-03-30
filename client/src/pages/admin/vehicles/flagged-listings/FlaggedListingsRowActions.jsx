import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  MoreVertical,
  Ban,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Lock,
  ZapOff,
  FileText,
  ChevronRight,
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
  const triggerRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  // Update position whenever menu opens
  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      // Position menu ABOVE the trigger button
      // Window.scrollY + rect.top gives absolute top in page
      setCoords({
        top: window.scrollY + rect.top, 
        left: window.scrollX + rect.left + rect.width,
      });
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (triggerRef.current && triggerRef.current.contains(e.target)) return;
      if (document.getElementById("moderation-portal-menu")?.contains(e.target)) return;
      setOpen(false);
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", () => setOpen(false), { passive: true });
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", () => setOpen(false));
    };
  }, [open]);

  return (
    <div className="flex items-center justify-end">
      <button
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        className={cls(
          "flex h-11 w-11 items-center justify-center rounded-[18px] border shadow-sm",
          open 
            ? "bg-slate-900 border-slate-900 text-white ring-4 ring-slate-900/10" 
            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
        )}
      >
        <MoreVertical size={20} strokeWidth={2.5} />
      </button>

      {open && createPortal(
        <div 
          id="moderation-portal-menu"
          style={{ 
            position: "absolute", 
            top: coords.top - 8, // Shift up slightly
            left: coords.left,
            transform: "translate(-100%, -100%)", // Upward and to the left
            zIndex: 9999
          }}
          className="w-64 origin-bottom-right rounded-[28px] border border-slate-200 bg-white p-2 shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-slate-900/5"
        >
          <div className="mb-1 px-3 py-2 border-b border-slate-50 flex items-center justify-between">
             <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Moderation Menu</div>
             <Settings2 size={12} className="text-slate-300" />
          </div>
          
          <div className="space-y-0.5">
            <MenuButton
              icon={Eye}
              label="Full Review Detail"
              onClick={() => { onReview?.(); setOpen(false); }}
              color="text-slate-900 hover:bg-sky-50"
              highlight={true}
            />
            
            <div className="my-1 border-t border-slate-50" />
            
            <MenuButton
              icon={Ban}
              label="Suspend"
              onClick={() => { onSuspend?.(); setOpen(false); }}
              color="text-rose-600 hover:bg-rose-50"
            />
            <MenuButton
              icon={CheckCircle2}
              label="Clear Flag"
              onClick={() => { onClear?.(); setOpen(false); }}
              color="text-emerald-600 hover:bg-emerald-50"
            />
            <MenuButton
              icon={AlertTriangle}
              label="Escalate"
              onClick={() => { onEscalate?.(); setOpen(false); }}
              color="text-amber-600 hover:bg-amber-50"
            />
            <MenuButton
              icon={Scale}
              label="Penalty"
              onClick={() => { onPenalty?.(); setOpen(false); }}
              color="text-slate-700 hover:bg-slate-50 border border-transparent hover:border-slate-100"
            />
            
            <div className="my-1 border-t border-slate-50" />
            
            <div className="grid grid-cols-4 gap-1 p-1">
               <QuickActionBtn icon={Phone} label="Call" onClick={() => { onContact?.(); setOpen(false); }} />
               <QuickActionBtn icon={Lock} label="Lock" onClick={() => { onLockRanking?.(); setOpen(false); }} />
               <QuickActionBtn icon={ZapOff} label="Off" onClick={() => { onRemoveBoost?.(); setOpen(false); }} />
               <QuickActionBtn icon={FileText} label="Note" onClick={() => { onAddNote?.(); setOpen(false); }} />
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

function MenuButton({ icon: Icon, label, onClick, color, highlight }) {
  return (
    <button
      onClick={onClick}
      className={cls(
        "flex w-full items-center justify-between rounded-2xl px-4 py-2.5 text-sm font-black transition-all",
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