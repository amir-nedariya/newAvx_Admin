import { Search, SlidersHorizontal, RefreshCw } from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

export default function FlaggedConsultationsFilterBar({
    search,
    setSearch,
    setFiltersOpen,
    filtersOpen,
    onRefresh,
}) {
    return (
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative min-w-0 flex-1 max-w-2xl">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search consultant name, city, category..."
                    className="h-11 md:h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-[13px] md:text-[14px] font-medium text-slate-900 outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-100 placeholder:text-slate-400"
                />
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    className={cls(
                        "inline-flex h-11 md:h-12 items-center justify-center gap-2 rounded-2xl border px-4 text-[13px] font-bold transition-all active:scale-95",
                        filtersOpen
                            ? "border-sky-400 bg-sky-50 text-sky-700"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                    )}
                    type="button"
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                </button>

                <button
                    onClick={onRefresh}
                    className="inline-flex h-11 md:h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-[13px] font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
                    type="button"
                >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </button>
            </div>
        </div>
    );
}
