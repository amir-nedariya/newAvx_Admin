import React, { useMemo, useState } from "react";
import {
  TrendingUp,
  Users,
  Car,
  MessageSquare,
  ShieldCheck,
  AlertTriangle,
  Timer,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  CheckCircle2,
  FileSearch,
  IndianRupee,
  Map as MapIcon,
  Search,
  SlidersHorizontal,
  RefreshCw,
  Download,
  ChevronDown,
  CalendarDays,
  BadgeCheck,
  CircleDashed,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from "recharts";

const cls = (...a) => a.filter(Boolean).join(" ");

const MarketplaceMetrics = () => {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [city, setCity] = useState("All Cities");
  const [state, setState] = useState("All States");
  const [dateRange, setDateRange] = useState("Last 30 Days");

  const listingsGrowthData = [
    { name: "Mon", value: 40 },
    { name: "Tue", value: 55 },
    { name: "Wed", value: 48 },
    { name: "Thu", value: 70 },
    { name: "Fri", value: 85 },
    { name: "Sat", value: 65 },
    { name: "Sun", value: 92 },
  ];

  const tierDistributionData = [
    { name: "Basic", value: 400, color: "#94a3b8" },
    { name: "Pro", value: 300, color: "#38bdf8" },
    { name: "Premium", value: 150, color: "#6366f1" },
  ];

  const demandTrendData = [
    { name: "Week 1", search: 1200, inquiries: 400 },
    { name: "Week 2", search: 1500, inquiries: 450 },
    { name: "Week 3", search: 1100, inquiries: 380 },
    { name: "Week 4", search: 1800, inquiries: 600 },
  ];

  const kpis = [
    {
      title: "Total Active Listings",
      value: "1,248",
      trend: "+12%",
      icon: Car,
      tone: "sky",
    },
    {
      title: "Active Consultants",
      value: "342",
      trend: "+5%",
      icon: Users,
      tone: "indigo",
    },
    {
      title: "Active Buyers (30d)",
      value: "8,920",
      trend: "+24%",
      icon: TrendingUp,
      tone: "emerald",
    },
    {
      title: "Total Inquiries (30d)",
      value: "4,150",
      trend: "-2%",
      icon: MessageSquare,
      tone: "amber",
    },
  ];

  const tableRows = useMemo(
    () => [
      {
        city: "Mumbai",
        listings: 428,
        consultants: 84,
        inquiries: 892,
        inspectionRate: "74%",
        boost: "Yes",
        status: "Healthy",
        risk: "Low",
      },
      {
        city: "Delhi",
        listings: 391,
        consultants: 70,
        inquiries: 801,
        inspectionRate: "69%",
        boost: "Yes",
        status: "Healthy",
        risk: "Moderate",
      },
      {
        city: "Bangalore",
        listings: 318,
        consultants: 63,
        inquiries: 704,
        inspectionRate: "72%",
        boost: "No",
        status: "Watch",
        risk: "Moderate",
      },
      {
        city: "Pune",
        listings: 246,
        consultants: 41,
        inquiries: 488,
        inspectionRate: "67%",
        boost: "No",
        status: "Healthy",
        risk: "Low",
      },
      {
        city: "Hyderabad",
        listings: 229,
        consultants: 38,
        inquiries: 452,
        inspectionRate: "61%",
        boost: "Yes",
        status: "At Risk",
        risk: "High",
      },
    ].filter((row) =>
      row.city.toLowerCase().includes(search.trim().toLowerCase())
    ),
    [search]
  );

  return (
    <div className="min-h-screen bg-slate-50 px-0 py-0">
      <div className="space-y-6">
        {/* Header */}
        <section className="rounded-[28px] border border-slate-200 bg-white px-6 py-6 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Live System Health 98.4%
              </div>

              <h1 className="mt-3 text-[30px] font-black tracking-tight text-slate-900">
                Marketplace Metrics
              </h1>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Premium analytics dashboard with All Vehicles style cards,
                toolbar, charts and admin table feel.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>

              <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        </section>

        {/* Toolbar */}
        <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search city, metrics, marketplace signal..."
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <SelectLike value={state} setValue={setState} />
              <SelectLike value={city} setValue={setCity} />
              <SelectLike value={dateRange} setValue={setDateRange} icon={CalendarDays} />

              <button
                onClick={() => setShowFilters((p) => !p)}
                className={cls(
                  "inline-flex h-12 items-center gap-2 rounded-2xl border px-4 text-sm font-semibold shadow-sm transition",
                  showFilters
                    ? "border-sky-200 bg-sky-50 text-sky-700"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                )}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[11px] font-bold text-white">
                  4
                </span>
              </button>
            </div>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 md:grid-cols-2 xl:grid-cols-4"
            >
              <FilterInput label="Min Listings" placeholder="100" />
              <FilterInput label="Max Risk Threshold" placeholder="Moderate" />
              <FilterInput label="Boost Status" placeholder="Yes / No" />
              <FilterInput label="Inspection Rate %" placeholder="60+" />
            </motion.div>
          )}
        </section>

        {/* KPI Cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((item) => (
            <TopMetricCard key={item.title} {...item} />
          ))}
        </section>

        {/* Main Charts Row */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-7">
            <Panel
              title="Listings Growth Trend"
              subtitle="Supply health over the week"
              icon={Car}
              tone="sky"
            >
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={listingsGrowthData}>
                    <defs>
                      <linearGradient id="listingFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.16} />
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#64748b", fontWeight: 600 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#64748b", fontWeight: 600 }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 18,
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 14px 40px rgba(15,23,42,0.08)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#0ea5e9"
                      strokeWidth={3}
                      fill="url(#listingFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </div>

          <div className="xl:col-span-5">
            <Panel
              title="Tier Distribution"
              subtitle="Consultant mix by active tier"
              icon={BadgeCheck}
              tone="indigo"
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr] md:items-center">
                <div className="mx-auto h-[220px] w-full max-w-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={tierDistributionData}
                        dataKey="value"
                        innerRadius={58}
                        outerRadius={82}
                        paddingAngle={4}
                      >
                        {tierDistributionData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {tierDistributionData.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm font-bold text-slate-700">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-sm font-black text-slate-900">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>
          </div>
        </section>

        {/* Secondary Panels */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-6">
            <Panel
              title="Demand Trend"
              subtitle="Search vs inquiry behaviour"
              icon={TrendingUp}
              tone="emerald"
            >
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={demandTrendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#64748b", fontWeight: 600 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#64748b", fontWeight: 600 }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 18,
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 14px 40px rgba(15,23,42,0.08)",
                      }}
                    />
                    <Bar dataKey="search" fill="#34d399" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="inquiries" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <MiniStat title="Save Rate" value="14.2%" trend="+2.1%" />
                <MiniStat title="Compare Usage" value="2,840" trend="+15%" />
                <MiniStat title="Popular Budget" value="₹5L–₹12L" trend="+8%" />
              </div>
            </Panel>
          </div>

          <div className="xl:col-span-6">
            <Panel
              title="Trust & Quality"
              subtitle="Integrity and compliance signals"
              icon={ShieldCheck}
              tone="rose"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <SignalCard icon={FileSearch} label="Inspection Adoption" value="68.2%" trend="+4.5%" />
                <SignalCard icon={CheckCircle2} label="Report Approval Rate" value="94.1%" trend="+0.8%" />
                <SignalCard icon={AlertTriangle} label="Dispute Rate" value="1.2%" trend="-0.2%" />
                <SignalCard icon={Activity} label="Fraud Alerts" value="12" trend="-4" />
                <SignalCard icon={MessageSquare} label="Chat Violation Rate" value="0.8%" trend="-0.1%" />
                <SignalCard icon={Timer} label="SLA Compliance" value="89.5%" trend="+2.3%" />
              </div>
            </Panel>
          </div>
        </section>

        {/* Revenue + Geo */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-5">
            <Panel
              title="Revenue Snapshot"
              subtitle="Marketplace monetization health"
              icon={IndianRupee}
              tone="slate"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DarkRevenueCard label="MRR" value="₹24.8L" trend="+8.4%" />
                <DarkRevenueCard label="Boost Revenue" value="₹12.2L" trend="+12.1%" />
                <DarkRevenueCard label="Inspection Revenue" value="₹8.4L" trend="+4.2%" />
                <DarkRevenueCard label="Refund Rate" value="2.8%" trend="-0.5%" />
              </div>
            </Panel>
          </div>

          <div className="xl:col-span-7">
            <Panel
              title="City Distribution Analysis"
              subtitle="Geographical performance mapping"
              icon={MapIcon}
              tone="sky"
            >
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">
                <div className="flex min-h-[280px] items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                  <div>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-sm">
                      <MapIcon className="h-8 w-8 text-sky-500" />
                    </div>
                    <h3 className="mt-4 text-lg font-black text-slate-900">
                      Interactive Heatmap Zone
                    </h3>
                    <p className="mt-2 text-sm font-medium text-slate-500">
                      Listings density, inquiry clusters and conversion mapping.
                    </p>
                    <button className="mt-5 rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90">
                      Initialize Map
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad"].map((c, i) => (
                    <div
                      key={c}
                      className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[11px] font-black text-slate-500">
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{c}</p>
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            strong market
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-black text-emerald-600">
                        {(8 + i * 0.7).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>
          </div>
        </section>

        {/* Table */}
        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight text-slate-900">
                City Performance Table
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-500">
                All Vehicles style premium table view for marketplace signals
              </p>
            </div>

            <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
              <Zap className="h-4 w-4 text-amber-500" />
              Quick Action
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr className="text-left">
                  {[
                    "City",
                    "Listings",
                    "Consultants",
                    "Inquiries",
                    "Inspection",
                    "Boost",
                    "Status",
                    "Risk",
                    "Actions",
                  ].map((head) => (
                    <th
                      key={head}
                      className="whitespace-nowrap border-b border-slate-200 px-5 py-4 text-[12px] font-black uppercase tracking-[0.14em] text-slate-500"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {tableRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className="transition hover:bg-slate-50/80"
                  >
                    <td className="border-b border-slate-100 px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                          <MapIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{row.city}</div>
                          <div className="text-xs font-medium text-slate-400">Marketplace cluster</div>
                        </div>
                      </div>
                    </td>

                    <td className="border-b border-slate-100 px-5 py-4 text-sm font-semibold text-slate-700">
                      {row.listings}
                    </td>
                    <td className="border-b border-slate-100 px-5 py-4 text-sm font-semibold text-slate-700">
                      {row.consultants}
                    </td>
                    <td className="border-b border-slate-100 px-5 py-4 text-sm font-semibold text-slate-700">
                      {row.inquiries}
                    </td>
                    <td className="border-b border-slate-100 px-5 py-4">
                      <InspectionBadge value={row.inspectionRate} />
                    </td>
                    <td className="border-b border-slate-100 px-5 py-4">
                      <BoostBadge value={row.boost} />
                    </td>
                    <td className="border-b border-slate-100 px-5 py-4">
                      <StatusBadge value={row.status} />
                    </td>
                    <td className="border-b border-slate-100 px-5 py-4">
                      <RiskBadge value={row.risk} />
                    </td>
                    <td className="border-b border-slate-100 px-5 py-4">
                      <button className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}

                {tableRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-5 py-14 text-center text-sm font-semibold text-slate-400"
                    >
                      No matching city data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 text-sm font-medium text-slate-500 md:flex-row md:items-center md:justify-between">
            <div>
              Showing <span className="font-bold text-slate-700">{tableRows.length}</span> rows
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-xl border border-slate-200 px-3 py-2 hover:bg-slate-50">
                Prev
              </button>
              <button className="rounded-xl bg-slate-900 px-3 py-2 font-bold text-white">
                1
              </button>
              <button className="rounded-xl border border-slate-200 px-3 py-2 hover:bg-slate-50">
                2
              </button>
              <button className="rounded-xl border border-slate-200 px-3 py-2 hover:bg-slate-50">
                Next
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

/* helpers */

function SelectLike({ value, setValue, icon: Icon = ChevronDown }) {
  return (
    <button
      onClick={() => { }}
      className="inline-flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
    >
      <span>{value}</span>
      <Icon className="h-4 w-4 text-slate-400" />
    </button>
  );
}

function FilterInput({ label, placeholder }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </span>
      <input
        placeholder={placeholder}
        className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white"
      />
    </label>
  );
}

function TopMetricCard({ title, value, trend, icon: Icon, tone = "sky" }) {
  const toneMap = {
    sky: "bg-sky-50 text-sky-600 border-sky-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
  };

  const positive = trend.startsWith("+");

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
            {title}
          </p>
          <h3 className="mt-2 text-[28px] font-black tracking-tight text-slate-900">
            {value}
          </h3>
        </div>

        <div className={cls("flex h-11 w-11 items-center justify-center rounded-2xl border", toneMap[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <span
          className={cls(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-bold",
            positive
              ? "bg-emerald-50 text-emerald-700"
              : "bg-rose-50 text-rose-700"
          )}
        >
          {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {trend}
        </span>
        <span className="text-xs font-medium text-slate-400">vs previous cycle</span>
      </div>
    </motion.div>
  );
}

function Panel({ title, subtitle, icon: Icon, children, tone = "sky" }) {
  const toneMap = {
    sky: "bg-sky-50 text-sky-600 border-sky-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    slate: "bg-slate-50 text-slate-600 border-slate-100",
  };

  return (
    <section className="h-full overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div className="flex items-center gap-4">
          <div className={cls("flex h-12 w-12 items-center justify-center rounded-[18px] border", toneMap[tone])}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-[18px] font-black tracking-tight text-slate-900">
              {title}
            </h2>
            <p className="text-sm font-medium text-slate-400">{subtitle}</p>
          </div>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

function MiniStat({ title, value, trend }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
      <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
        {title}
      </p>
      <p className="mt-2 text-[18px] font-black text-slate-900">{value}</p>
      <p className="mt-1 text-xs font-bold text-emerald-600">{trend}</p>
    </div>
  );
}

function SignalCard({ icon: Icon, label, value, trend }) {
  const positive = trend.startsWith("+");

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-sky-200 hover:bg-white">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500">
          <Icon className="h-4.5 w-4.5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
            {label}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-[20px] font-black text-slate-900">{value}</span>
            <span
              className={cls(
                "text-xs font-bold",
                positive ? "text-emerald-600" : "text-rose-600"
              )}
            >
              {trend}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DarkRevenueCard({ label, value, trend }) {
  const positive = trend.startsWith("+");

  return (
    <div className="relative overflow-hidden rounded-[24px] bg-slate-900 p-5 shadow-sm">
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-white/5 blur-2xl" />
      <div className="relative z-10">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
          {label}
        </p>
        <h3 className="mt-2 text-[24px] font-black text-white">{value}</h3>
        <p className={cls("mt-2 text-xs font-bold", positive ? "text-emerald-400" : "text-rose-400")}>
          {trend}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ value }) {
  const map = {
    Healthy: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Watch: "bg-amber-50 text-amber-700 border-amber-100",
    "At Risk": "bg-rose-50 text-rose-700 border-rose-100",
  };

  return (
    <span className={cls("inline-flex rounded-full border px-2.5 py-1 text-xs font-bold", map[value] || map.Watch)}>
      {value}
    </span>
  );
}

function RiskBadge({ value }) {
  const map = {
    Low: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Moderate: "bg-amber-50 text-amber-700 border-amber-100",
    High: "bg-rose-50 text-rose-700 border-rose-100",
  };

  return (
    <span className={cls("inline-flex rounded-full border px-2.5 py-1 text-xs font-bold", map[value] || map.Moderate)}>
      {value}
    </span>
  );
}

function BoostBadge({ value }) {
  return value === "Yes" ? (
    <span className="inline-flex items-center gap-1 rounded-full border border-violet-100 bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-700">
      <Zap className="h-3.5 w-3.5" />
      Yes
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-600">
      <CircleDashed className="h-3.5 w-3.5" />
      No
    </span>
  );
}

function InspectionBadge({ value }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-sky-100 bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-700">
      <ShieldCheck className="h-3.5 w-3.5" />
      {value}
    </span>
  );
}

export default MarketplaceMetrics;