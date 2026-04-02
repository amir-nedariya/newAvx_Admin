import { useState, useRef, useEffect } from "react";
import { MoreVertical, Eye, RotateCcw } from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

export default function SuspendedConsultantsRowActions({
    onViewDetails,
    onUnsuspend,
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
                                onViewDetails?.();
                                setOpen(false);
                            }}
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-semibold text-slate-700 transition-all hover:bg-sky-50 hover:text-sky-700"
                            type="button"
                        >
                            <Eye className="h-4 w-4" />
                            View Details
                        </button>

                        <button
                            onClick={() => {
                                onUnsuspend?.();
                                setOpen(false);
                            }}
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-semibold text-emerald-700 transition-all hover:bg-emerald-50"
                            type="button"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Unsuspend
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
