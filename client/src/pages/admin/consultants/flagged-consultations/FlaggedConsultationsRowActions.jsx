import { useState, useRef, useEffect } from "react";
import { MoreVertical, Eye, Ban, CheckCircle2, AlertTriangle, TrendingDown } from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

export default function FlaggedConsultationsRowActions({
    onReview,
    onSuspend,
    onClear,
    onEscalate,
    onPenalty,
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block" ref={ref}>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 active:scale-95"
                type="button"
            >
                <MoreVertical className="h-4 w-4" />
            </button>

            {open && (
                <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                    <div className="p-2">
                        <button
                            onClick={() => {
                                onReview?.();
                                setOpen(false);
                            }}
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-semibold text-slate-700 transition-all hover:bg-sky-50 hover:text-sky-700"
                            type="button"
                        >
                            <Eye className="h-4 w-4" />
                            Review Details
                        </button>

                        <button
                            onClick={() => {
                                onSuspend?.();
                                setOpen(false);
                            }}
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-semibold text-rose-700 transition-all hover:bg-rose-50"
                            type="button"
                        >
                            <Ban className="h-4 w-4" />
                            Suspend Consultant
                        </button>

                        <button
                            onClick={() => {
                                onClear?.();
                                setOpen(false);
                            }}
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-semibold text-emerald-700 transition-all hover:bg-emerald-50"
                            type="button"
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            Clear Flag
                        </button>

                        <button
                            onClick={() => {
                                onPenalty?.();
                                setOpen(false);
                            }}
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-semibold text-amber-700 transition-all hover:bg-amber-50"
                            type="button"
                        >
                            <TrendingDown className="h-4 w-4" />
                            Apply Penalty
                        </button>

                        <button
                            onClick={() => {
                                onEscalate?.();
                                setOpen(false);
                            }}
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-semibold text-indigo-700 transition-all hover:bg-indigo-50"
                            type="button"
                        >
                            <AlertTriangle className="h-4 w-4" />
                            Escalate
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
