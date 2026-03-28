import React from "react";
import {
  Search,
  SlidersHorizontal,
  RefreshCw,
} from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

export default function FlaggedListingsFilterBar({
  search,
  setSearch,
  setFiltersOpen,
  filtersOpen,
  onRefresh,
}) {
  return (
    <div className="flex items-center gap-2.5 md:gap-4 lg:justify-between">
      {/* Search Input */}
      <div className="relative min-w-0 flex-1 max-w-2xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Vehicle ID, Registration, Consultant or City..."
          className="h-11 md:h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-[13px] md:text-[14px] font-medium text-slate-900 outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-100 placeholder:text-slate-400"
        />
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2 md:gap-3">
        {/* Advanced Filters Button */}
        <button
          onClick={() => setFiltersOpen(true)}
          className={cls(
            "inline-flex h-11 md:h-12 items-center gap-2 rounded-2xl border px-3 md:px-5 text-[13px] font-bold transition-all active:scale-95",
            filtersOpen
              ? "border-sky-200 bg-sky-50 text-sky-700 shadow-sm shadow-sky-100"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300"
          )}
          type="button"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden md:inline">Advanced Filters</span>
          {filtersOpen && <div className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse ml-0.5" />}
        </button>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          className="flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95 shadow-sm"
          title="Refresh List"
          type="button"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}