import React, { useState } from "react";
import { 
  CalendarDays, 
  MapPin, 
  Layers, 
  Tags, 
  Download, 
  ChevronDown,
  Search,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const cls = (...a) => a.filter(Boolean).join(" ");

const AnalyticsControls = ({ onFilterChange }) => {
  const [dateRange, setDateRange] = useState("30d");
  const [city, setCity] = useState("All Cities");
  const [tier, setTier] = useState("All Tiers");
  const [category, setCategory] = useState("All Categories");

  const [openDropdown, setOpenDropdown] = useState(null);

  const dateOptions = [
    { id: "today", label: "Today" },
    { id: "7d", label: "Last 7 Days" },
    { id: "30d", label: "Last 30 Days" },
    { id: "custom", label: "Custom Range" },
  ];

  const tiers = ["All Tiers", "Basic", "Pro", "Premium"];
  const categories = ["All Categories", "Sedan", "SUV", "Hatchback", "Luxury"];

  const handleDropdownToggle = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  return (
    <div className="mb-8 flex flex-wrap items-center gap-3">
      {/* Date Range Selector */}
      <div className="relative">
        <button
          onClick={() => handleDropdownToggle("date")}
          className="flex h-12 items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-5 text-[14px] font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95 shadow-sm"
        >
          <CalendarDays className="h-4 w-4 text-sky-500" />
          <span>{dateOptions.find(d => d.id === dateRange)?.label}</span>
          <ChevronDown className={cls("h-4 w-4 text-slate-400 transition-transform", openDropdown === "date" && "rotate-180")} />
        </button>
        <AnimatePresence>
          {openDropdown === "date" && (
            <DropdownMenu 
              options={dateOptions.map(o => ({ id: o.id, label: o.label }))} 
              onSelect={(id) => { setDateRange(id); setOpenDropdown(null); }}
              onClose={() => setOpenDropdown(null)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* City Filter */}
      <div className="relative">
        <button
          onClick={() => handleDropdownToggle("city")}
          className="flex h-12 items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-5 text-[14px] font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95 shadow-sm"
        >
          <MapPin className="h-4 w-4 text-emerald-500" />
          <span>{city}</span>
          <ChevronDown className={cls("h-4 w-4 text-slate-400 transition-transform", openDropdown === "city" && "rotate-180")} />
        </button>
        <AnimatePresence>
          {openDropdown === "city" && (
            <DropdownMenu 
              options={["All Cities", "Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad"].map(c => ({ id: c, label: c }))} 
              onSelect={(id) => { setCity(id); setOpenDropdown(null); }}
              onClose={() => setOpenDropdown(null)}
              searchable
            />
          )}
        </AnimatePresence>
      </div>

      {/* Tier Filter */}
      <div className="relative">
        <button
          onClick={() => handleDropdownToggle("tier")}
          className="flex h-12 items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-5 text-[14px] font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95 shadow-sm"
        >
          <Layers className="h-4 w-4 text-indigo-500" />
          <span>{tier}</span>
          <ChevronDown className={cls("h-4 w-4 text-slate-400 transition-transform", openDropdown === "tier" && "rotate-180")} />
        </button>
        <AnimatePresence>
          {openDropdown === "tier" && (
            <DropdownMenu 
              options={tiers.map(t => ({ id: t, label: t }))} 
              onSelect={(id) => { setTier(id); setOpenDropdown(null); }}
              onClose={() => setOpenDropdown(null)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Category Filter */}
      <div className="relative">
        <button
          onClick={() => handleDropdownToggle("category")}
          className="flex h-12 items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-5 text-[14px] font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95 shadow-sm"
        >
          <Tags className="h-4 w-4 text-amber-500" />
          <span>{category}</span>
          <ChevronDown className={cls("h-4 w-4 text-slate-400 transition-transform", openDropdown === "category" && "rotate-180")} />
        </button>
        <AnimatePresence>
          {openDropdown === "category" && (
            <DropdownMenu 
              options={categories.map(c => ({ id: c, label: c }))} 
              onSelect={(id) => { setCategory(id); setOpenDropdown(null); }}
              onClose={() => setOpenDropdown(null)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Export Controls */}
      <div className="ml-auto flex items-center gap-2">
        <button className="flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-[13px] font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95 shadow-sm">
          <Download className="h-4 w-4" />
          CSV
        </button>
        <button className="flex h-12 items-center gap-2 rounded-2xl border border-slate-900 bg-slate-900 px-4 text-[13px] font-bold text-white transition-all hover:bg-slate-800 active:scale-95 shadow-md shadow-slate-200">
          <Download className="h-4 w-4" />
          PDF
        </button>
      </div>
    </div>
  );
};

const DropdownMenu = ({ options, onSelect, onClose, searchable = false }) => {
  const [search, setSearch] = useState("");
  const filteredOptions = searchable 
    ? options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  return (
    <>
      <div className="fixed inset-0 z-[60]" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        className="absolute left-0 top-[calc(100%+8px)] z-[70] min-w-[200px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_12px_40px_rgba(15,23,42,0.12)]"
      >
        {searchable && (
          <div className="relative mb-2 px-2 pt-1">
            <Search className="absolute left-5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="h-9 w-full rounded-xl border border-slate-100 bg-slate-50 pl-9 pr-3 text-[13px] font-medium text-slate-900 outline-none transition-all focus:border-sky-300 focus:ring-4 focus:ring-sky-50 placeholder:text-slate-400"
            />
          </div>
        )}
        <div className="max-h-[300px] overflow-y-auto premium-scroll">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onSelect(opt.id)}
                className="flex w-full items-center px-4 py-2.5 text-left text-[14px] font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-sky-600 rounded-xl"
              >
                {opt.label}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-center text-[13px] font-medium text-slate-400">
              No results
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default AnalyticsControls;
