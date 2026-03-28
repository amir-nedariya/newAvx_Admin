import React from "react";
import { Search, SlidersHorizontal, ChevronDown, X, RefreshCw, Calendar } from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

export default function PendingApprovalsFilterBar({
  search,
  setSearch,
  filters,
  setFilters,
  filtersOpen,
  setFiltersOpen,
  onRefresh,
  onClear,
  onApplyFilters,
  tierOptions = [],
}) {
  const activeFiltersCount = [
    filters.submissionType,
    filters.risk,
    filters.tier,
    filters.inspection,
    filters.city,
    filters.alertFilter,
    filters.submittedAfter,
    filters.submittedBefore,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex-1">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none transition-colors group-focus-within:text-sky-600">
              <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-current" />
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, Consultant, City, Reg No..."
              className="w-full rounded-2xl border border-zinc-200 bg-white py-4 pl-12 pr-5 text-[15px] font-medium text-zinc-900 shadow-sm transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setFiltersOpen((prev) => !prev)}
            className={`inline-flex h-[58px] items-center gap-3 rounded-2xl border px-6 text-[15px] font-semibold transition-all ${
              filtersOpen
                ? "border-sky-200 bg-sky-50 text-sky-700 shadow-sm shadow-sky-100"
                : "border-zinc-200 bg-white text-zinc-800 shadow-sm hover:bg-zinc-50"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Advanced Filters
            {activeFiltersCount > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-current px-1.5 text-[10px] font-bold text-white ring-2 ring-white">
                {activeFiltersCount}
              </span>
            )}
            <ChevronDown
              className={cls(
                "h-4 w-4 text-zinc-400 transition-transform duration-300",
                filtersOpen && "rotate-180"
              )}
            />
          </button>

          <button
            onClick={onRefresh}
            title="Refresh list"
            className="inline-flex h-[58px] w-[58px] items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-600 shadow-sm transition-all hover:bg-zinc-50 hover:text-zinc-900 active:scale-95"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {filtersOpen && (
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-200/40">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-zinc-100 pb-5">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-zinc-900">Filters</h3>
              <p className="text-sm text-zinc-500">Refine pending approval queue by specific criteria</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClear}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2.5 text-[13px] font-semibold text-zinc-700 transition-all hover:bg-zinc-50 hover:text-zinc-900"
              >
                <X className="h-4 w-4" />
                Reset
              </button>

              <button
                onClick={onApplyFilters}
                className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-[13px] font-semibold text-white transition-all hover:bg-zinc-800 active:scale-95 shadow-lg shadow-zinc-900/10"
              >
                Apply Filters
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 xl:grid-cols-6">
            <FilterSelect
              label="Submission Type"
              value={filters.submissionType}
              onChange={(v) => setFilters((p) => ({ ...p, submissionType: v }))}
              options={["", "NEW", "EDITED", "REACTIVATION"]}
            />

            <FilterSelect
              label="Risk Level"
              value={filters.risk}
              onChange={(v) => setFilters((p) => ({ ...p, risk: v }))}
              options={["", "LOW", "MODERATE", "HIGH"]}
            />

            <FilterSelect
              label="Tier Plan"
              value={filters.tier}
              onChange={(v) => setFilters((p) => ({ ...p, tier: v }))}
              options={tierOptions.map(t => t.value)}
              displayMap={tierOptions.reduce((acc, t) => ({ ...acc, [t.value]: t.label }), {})}
            />

            <FilterSelect
              label="Inspection"
              value={filters.inspection}
              onChange={(v) => setFilters((p) => ({ ...p, inspection: v }))}
              options={["", "AVX_INSPECTED", "AI_INSPECTED", "SELF_INSPECTED", "NOT_INSPECTED"]}
            />

            <div className="col-span-1 md:col-span-2 space-y-2">
              <div className="text-[13px] font-bold tracking-wide uppercase text-zinc-500">Submission Date Range</div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 group">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-sky-600" />
                  <input
                    type="date"
                    value={filters.submittedAfter}
                    onChange={(e) => setFilters((p) => ({ ...p, submittedAfter: e.target.value }))}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-3 text-[13px] font-medium outline-none focus:border-sky-500 focus:bg-white transition-all"
                  />
                </div>
                <span className="text-zinc-400 font-medium">to</span>
                <div className="relative flex-1 group">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-sky-600" />
                  <input
                    type="date"
                    value={filters.submittedBefore}
                    onChange={(e) => setFilters((p) => ({ ...p, submittedBefore: e.target.value }))}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-3 text-[13px] font-medium outline-none focus:border-sky-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>
            
            <FilterSelect
              label="City"
              value={filters.city}
              onChange={(v) => setFilters((p) => ({ ...p, city: v }))}
              options={["", "Delhi", "Mumbai", "Bangalore", "Hyderabad"]}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function FilterSelect({ label, value, onChange, options, displayMap = {} }) {
  return (
    <div className="space-y-2">
      <div className="text-[13px] font-bold tracking-wide uppercase text-zinc-500">
        {label}
      </div>
      <div className="relative group">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pl-4 pr-10 text-[13px] font-semibold text-zinc-900 outline-none transition-all focus:border-sky-500 focus:bg-white"
        >
          {options.map((o) => (
            <option key={o || "all"} value={o}>
              {o ? (displayMap[o] || o) : `All ${label}s`}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 group-focus-within:text-sky-600">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}