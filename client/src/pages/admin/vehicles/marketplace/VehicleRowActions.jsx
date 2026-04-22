import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MoreVertical,
  Eye,
  Ban,
  Flag,
  MessageSquareText,
  StickyNote,
} from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

export default function VehicleRowActions({
  vehicle,
  onAction,
  align = "right",
}) {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState("bottom");
  const wrapRef = useRef(null);
  const buttonRef = useRef(null);

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

  const handleToggle = (e) => {
    if (!buttonRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;

    // If less than 300px space below and more space above, open upward
    if (spaceBelow < 300 && spaceAbove > spaceBelow) {
      setMenuPosition("top");
    } else {
      setMenuPosition("bottom");
    }

    setOpen((s) => !s);
  };

  const actions = useMemo(
    () => [
      { key: "VIEW_DETAILS", label: "View Details", icon: Eye, iconBg: "bg-slate-100", iconColor: "text-slate-600" },
      { key: "SUSPEND_LISTING", label: "Suspend Listing", icon: Ban, iconBg: "bg-rose-50", iconColor: "text-rose-600" },
      { key: "FLAG_REVIEW", label: "Flag for Review", icon: Flag, iconBg: "bg-amber-50", iconColor: "text-amber-600" },
      { key: "VIEW_INQUIRIES", label: "View Inquiries", icon: MessageSquareText, iconBg: "bg-sky-50", iconColor: "text-sky-600" },
      { key: "ADD_NOTE", label: "Add Internal Note", icon: StickyNote, iconBg: "bg-slate-100", iconColor: "text-slate-600" },
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
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className={cls(
          "inline-flex h-9 w-9 items-center justify-center cursor-pointer rounded-lg",
          "bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
        )}
        title="Actions"
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div
            className={cls(
              "absolute z-20 w-64 rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden",
              menuPosition === "top" ? "bottom-full mb-2" : "top-full mt-2",
              align === "right" ? "right-0" : "left-0"
            )}
          >
            {actions.map((a) => (
              <button
                key={a.key}
                type="button"
                onClick={() => fire(a.key)}
                className="flex w-full items-center px-1 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <div className={cls("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg")}>
                  <a.icon className={cls("h-4 w-4", a.iconColor)} />
                </div>
                <span>{a.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}