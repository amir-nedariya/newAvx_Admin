import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MoreVertical,
  Eye,
  Ban,
  Pencil,
  RotateCw,
  Sparkles,
  BadgePercent,
  Flag,
  MessageSquareText,
  ClipboardCheck,
  StickyNote,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const cls = (...a) => a.filter(Boolean).join(" ");

const menuAnim = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 8, scale: 0.98 },
};

export default function VehicleRowActions({
  vehicle,
  onAction,
  align = "right",
}) {
  const [open, setOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (open && wrapRef.current) {
      const rect = wrapRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = 350; // Approximate height of dropdown

      // If not enough space below, open upward
      setOpenUpward(spaceBelow < dropdownHeight);
    }
  }, [open]);

  useEffect(() => {
    const onDown = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };

    const onEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onEsc);

    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onEsc);
    };
  }, []);

  const actions = useMemo(
    () => [
      { key: "VIEW_DETAILS", label: "View Details", icon: Eye },
      { key: "SUSPEND_LISTING", label: "Suspend Listing", icon: Ban, tone: "danger" },
      // { key: "EDIT_OVERRIDE", label: "Edit (Admin Override)", icon: Pencil },
      // { key: "RECALC_RANK", label: "Force Recalculate Rank", icon: RotateCw },
      // { key: "FEATURE_TEMP", label: "Feature Temporarily", icon: Sparkles, tone: "brand" },
      // { key: "REMOVE_BOOST", label: "Remove Boost", icon: BadgePercent },
      { key: "FLAG_REVIEW", label: "Flag for Review", icon: Flag, tone: "warn" },
      { key: "VIEW_INQUIRIES", label: "View Inquiries", icon: MessageSquareText },
      // { key: "VIEW_INSPECTION", label: "View Inspection", icon: ClipboardCheck },
      { key: "ADD_NOTE", label: "Add Internal Note", icon: StickyNote },
    ],
    []
  );

  const fire = (key) => {
    setOpen(false);
    onAction?.(key, vehicle);
  };

  return (
    <div className="relative inline-flex" ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className={cls(
          "inline-flex h-9 w-9 items-center justify-center rounded-xl",
          "border border-slate-200 bg-white shadow-sm",
          "transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow",
          "active:scale-[0.97]",
          open && "border-sky-200 bg-sky-50 shadow-md ring-4 ring-sky-100"
        )}
        title="Actions"
      >
        <MoreVertical className="h-4 w-4 text-slate-700" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial="hidden"
            animate="show"
            exit="exit"
            variants={menuAnim}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className={cls(
              "absolute z-[100] w-[300px] overflow-hidden",
              openUpward ? "bottom-11" : "top-11",
              align === "right" ? "right-0" : "left-0",
              "rounded-2xl border border-slate-200 bg-white",
              "shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
            )}
          >
            {/* <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-4 py-3">
              <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Actions
              </div>
              <div className="mt-1 truncate text-[13px] font-semibold text-slate-800">
                {vehicle?.title ?? "Vehicle"}
              </div>
            </div> */}
            <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-4 py-3">
              <div className="flex flex-col items-start text-left">

                <div className="text-[11px] font-semibold tracking-widest text-slate-400">
                  ACTIONS
                </div>

                <div className="mt-1 w-full truncate text-[14px] font-semibold text-slate-800">
                  {vehicle?.title ?? "Vehicle"}
                </div>

              </div>
            </div>
            <div className="max-h-[420px] overflow-y-auto p-2">
              {actions.map((a) => (
                <MenuItem
                  key={a.key}
                  icon={a.icon}
                  label={a.label}
                  tone={a.tone}
                  onClick={() => fire(a.key)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItem({ icon: Icon, label, tone, onClick }) {
  const styles = {
    default: {
      row: "hover:bg-slate-50",
      iconWrap: "border-slate-200 bg-white",
      icon: "text-slate-700",
    },
    danger: {
      row: "hover:bg-rose-50",
      iconWrap: "border-rose-100 bg-rose-50",
      icon: "text-rose-600",
    },
    warn: {
      row: "hover:bg-amber-50",
      iconWrap: "border-amber-100 bg-amber-50",
      icon: "text-amber-600",
    },
    brand: {
      row: "hover:bg-indigo-50",
      iconWrap: "border-indigo-100 bg-indigo-50",
      icon: "text-indigo-600",
    },
  };

  const current =
    tone === "danger"
      ? styles.danger
      : tone === "warn"
        ? styles.warn
        : tone === "brand"
          ? styles.brand
          : styles.default;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cls(
        "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left",
        "transition-all duration-200",
        current.row
      )}
    >
      <span
        className={cls(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-sm transition-transform duration-200 group-hover:scale-105",
          current.iconWrap
        )}
      >
        <Icon className={cls("h-4 w-4", current.icon)} />
      </span>

      <span className="flex-1 text-[13px] font-semibold text-slate-800">
        {label}
      </span>
    </button>
  );
}