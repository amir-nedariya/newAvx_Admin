import React, { useMemo, useState } from "react";
import {
  Filter,
  Users,
  Search,
  Car,
  MessageSquare,
  CalendarCheck,
  CheckCircle2,
  Target,
  AlertCircle,
  TrendingDown,
  Info,
  ChevronDown,
  RefreshCw,
  SlidersHorizontal,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  ShieldCheck,
  CircleDashed,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import AnalyticsControls from "./components/AnalyticsControls";

const cls = (...a) => a.filter(Boolean).join(" ");

const ConversionFunnel = () => {
  const [searchText, setSearchText] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [city, setCity] = useState("All Cities");
  const [tier, setTier] = useState("All Tiers");
  const [dateRange, setDateRange] = useState("Last 30 Days");

  const funnelData = [
    { stage: "Visitors", count: 120000, color: "#0f172a", icon: Users },
    { stage: "Search", count: 85000, color: "#1e293b", icon: Search },
    { stage: "Vehicle View", count: 42000, color: "#334155", icon: Car },
    { stage: "Inquiry", count: 18000, color: "#475569", icon: MessageSquare },
    { stage: "Chat Started", count: 9000, color: "#64748b", icon: MessageSquare },
    { stage: "Inspection Booked", count: 1200, color: "#94a3b8", icon: CalendarCheck },
    { stage: "Converted (Sold)", count: 450, color: "#10b981", icon: CheckCircle2 },
  ];

  const tierComparison = [
    {
      name: "Basic",
      Visitors: 80000,
      Search: 60000,
      View: 30000,
      Inquiry: 12000,
      Chat: 6000,
      Inspection: 800,
      Sold: 300,
    },
    {
      name: "Pro",
      Visitors: 25000,
      Search: 18000,
      View: 9000,
      Inquiry: 4500,
      Chat: 2200,
      Inspection: 300,
      Sold: 120,
    },
    {
      name: "Premium",
      Visitors: 15000,
      Search: 7000,
      View: 3000,
      Inquiry: 1500,
      Chat: 800,
      Inspection: 100,
      Sold: 30,
    },
  ];

  const boostData = [
    { name: "Boost Active", rate: 8.4, conv: 12.2, resp: "4m" },
    { name: "Regular", rate: 3.2, conv: 4.1, resp: "18m" },
  ];

  const cityRows = useMemo(() => {
    const rows = [
      { city: "Pune", views: 12400, inquiry: 184, rate: 1.4, status: "Critical", risk: "High" },
      { city: "Delhi", views: 45000, inquiry: 920, rate: 2.0, status: "Warning", risk: "Moderate" },
      { city: "Ahmedabad", views: 8900, inquiry: 112, rate: 1.2, status: "Critical", risk: "High" },
      { city: "Mumbai", views: 52000, inquiry: 1480, rate: 2.8, status: "Healthy", risk: "Low" },
      { city: "Bangalore", views: 30200, inquiry: 860, rate: 2.9, status: "Healthy", risk: "Low" },
    ];

    const q = searchText.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => r.city.toLowerCase().includes(q));
  }, [searchText]);

  const kpis = [
    {
      title: "Total Visitors",
      value: "1.20L",
      trend: "+14.2%",
      icon: Users,
      tone: "sky",
    },
    {
      title: "Total Inquiries",
      value: "18,000",
      trend: "+6.8%",
      icon: MessageSquare,
      tone: "indigo",
    },
    {
      title: "Inspection Bookings",
      value: "1,200",
      trend: "-1.3%",
      icon: CalendarCheck,
      tone: "amber",
    },
    {
      title: "Total Sold",
      value: "450",
      trend: "+3.4%",
      icon: CheckCircle2,
      tone: "emerald",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-0 py-0">
      <div className="space-y-6">
        {/* Header */}
        <section className="rounded-[28px] border border-slate-200 bg-white px-6 py-6 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-sky-700">
                <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
                Funnel Analytics
              </div>

              <h1 className="mt-3 text-[30px] font-black tracking-tight text-slate-900">
                Conversion Funnel
              </h1>
              <p className="mt-1 text-sm font-medium text-slate-500">
                All Vehicles style premium analytics dashboard for buyer journey,
                bottlenecks, city drop-offs and monetization signals.
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

        {/* Controls */}
        <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search city, funnel stage, conversion signal..."
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <SelectLike value={city} />
              <SelectLike value={tier} />
              <SelectLike value={dateRange} />

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
                  3
                </span>
              </button>
            </div>
          </div>

          <div className="mt-4">
            <AnalyticsControls />
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 md:grid-cols-2 xl:grid-cols-4"
            >
              <FilterInput label="Min Inquiry Rate" placeholder="1.5%" />
              <FilterInput label="City Risk" placeholder="Low / Moderate / High" />
              <FilterInput label="Boost Type" placeholder="Boost / Regular" />
              <FilterInput label="Drop-off Stage" placeholder="Chat → Inspection" />
            </motion.div>
          )}
        </section>

        {/* KPI */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((item) => (
            <TopMetricCard key={item.title} {...item} />
          ))}
        </section>

        {/* Main row */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-8">
            <Panel
              title="Overall User Funnel"
              subtitle="Journey from visitor to sold"
              icon={Filter}
              tone="slate"
            >
              <div className="space-y-4">
                {funnelData.map((stage, i) => {
                  const prevCount = i > 0 ? funnelData[i - 1].count : stage.count;
                  const convPercent = ((stage.count / funnelData[0].count) * 100).toFixed(1);
                  const dropPercent =
                    i > 0
                      ? (((prevCount - stage.count) / prevCount) * 100).toFixed(1)
                      : 0;
                  const StageIcon = stage.icon;

                  return (
                    <div key={stage.stage} className="relative">
                      <div className="flex items-center gap-5 rounded-[24px] border border-slate-100 bg-slate-50 px-4 py-4">
                        <div className="flex w-28 shrink-0 justify-center">
                          <div
                            className="flex h-12 items-center justify-center rounded-2xl border border-slate-200 text-white shadow-sm"
                            style={{
                              backgroundColor: stage.color,
                              width: `${Math.max(52, 100 - i * 8)}%`,
                            }}
                          >
                            <StageIcon className="h-5 w-5" />
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <h4 className="truncate text-sm font-bold text-slate-800">
                              {stage.stage}
                            </h4>
                            <div className="text-sm font-black text-slate-900">
                              {stage.count.toLocaleString()}
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                              <div
                                className="h-full rounded-full bg-sky-500"
                                style={{ width: `${convPercent}%` }}
                              />
                            </div>
                            <span className="min-w-[46px] text-right text-[12px] font-bold text-sky-600">
                              {convPercent}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {i < funnelData.length - 1 && (
                        <div className="ml-12 my-2 flex items-center gap-3">
                          <div className="h-8 w-px border-l border-dashed border-slate-300" />
                          <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-rose-600">
                            <TrendingDown className="h-3.5 w-3.5" />
                            <span className="text-[11px] font-black uppercase tracking-wide">
                              {dropPercent}% Drop-off
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Panel>
          </div>

          <div className="xl:col-span-4">
            <Panel
              title="Drop-off Diagnostics"
              subtitle="AI insights and anomaly hints"
              icon={AlertCircle}
              tone="rose"
            >
              <div className="space-y-4">
                <div className="overflow-hidden rounded-[24px] border border-rose-100 bg-rose-50 p-4">
                  <h4 className="text-[14px] font-black text-rose-800">
                    Critical Drop-off Detected
                  </h4>
                  <p className="mt-1 text-[12px] font-semibold leading-relaxed text-rose-700/80">
                    High drop at Chat → Inspection stage. This may be affecting
                    final sold conversion sharply.
                  </p>

                  <div className="mt-4 space-y-2 border-t border-rose-100 pt-4">
                    <div className="flex items-center gap-2">
                      <Info className="h-3.5 w-3.5 text-rose-400" />
                      <span className="text-[11px] font-bold italic text-rose-700/80">
                        Possible: inspection cost too high
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Info className="h-3.5 w-3.5 text-rose-400" />
                      <span className="text-[11px] font-bold italic text-rose-700/80">
                        Possible: trust issue in reports
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Info className="h-3.5 w-3.5 text-rose-400" />
                      <span className="text-[11px] font-bold italic text-rose-700/80">
                        Possible: slow consultant response
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Abandonment Rate
                  </p>
                  <div className="mt-2 flex items-end gap-2">
                    <span className="text-[30px] font-black leading-none text-slate-900">
                      64.2
                    </span>
                    <span className="mb-1 text-[16px] font-black text-slate-400">
                      %
                    </span>
                    <span className="mb-1 ml-auto rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-700">
                      -2.4% vs PW
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <SignalCard
                    icon={Activity}
                    label="SLA Compliance"
                    value="89.5%"
                    trend="+2.1%"
                  />
                  <SignalCard
                    icon={ShieldCheck}
                    label="Trust Signal"
                    value="High"
                    trend="+0.8%"
                  />
                </div>
              </div>
            </Panel>
          </div>
        </section>

        {/* Mid row */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-6">
            <Panel
              title="Funnel by Tier"
              subtitle="Comparison of engagement levels"
              icon={Target}
              tone="indigo"
            >
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tierComparison} layout="vertical">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                      stroke="#e2e8f0"
                    />
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fontWeight: 700, fill: "#64748b" }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 18,
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 14px 40px rgba(15,23,42,0.08)",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="Visitors" fill="#94a3b8" radius={[0, 8, 8, 0]} />
                    <Bar dataKey="Inquiry" fill="#38bdf8" radius={[0, 8, 8, 0]} />
                    <Bar dataKey="Sold" fill="#10b981" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </div>

          <div className="xl:col-span-6">
            <Panel
              title="Monetization Health"
              subtitle="Boost vs regular performance"
              icon={Zap}
              tone="emerald"
            >
              <div className="space-y-4">
                {boostData.map((d, i) => (
                  <div
                    key={d.name}
                    className={cls(
                      "rounded-[24px] border p-5 transition-all",
                      i === 0
                        ? "border-emerald-200 bg-emerald-50 shadow-sm"
                        : "border-slate-200 bg-slate-50"
                    )}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h4
                        className={cls(
                          "text-[15px] font-black",
                          i === 0 ? "text-emerald-800" : "text-slate-800"
                        )}
                      >
                        {d.name}
                      </h4>
                      {i === 0 && (
                        <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white">
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <MiniStatBox label="Inquiry Rate" value={`${d.rate}%`} />
                      <MiniStatBox label="Sales Conv." value={`${d.conv}%`} />
                      <div className="col-span-2">
                        <MiniStatBox label="Avg Response" value={d.resp} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </section>

        {/* City table */}
        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight text-slate-900">
                City Bottleneck Table
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-500">
                All Vehicles style table for city conversion warnings and funnel health
              </p>
            </div>

            <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              Analyze Drop-offs
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr className="text-left">
                  {[
                    "City",
                    "Views",
                    "Inquiry",
                    "Conv. Rate",
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
                {cityRows.map((row) => (
                  <tr key={row.city} className="transition hover:bg-slate-50/80">
                    <td className="border-b border-slate-100 px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                          <Search className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{row.city}</div>
                          <div className="text-xs font-medium text-slate-400">
                            Funnel watch zone
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="border-b border-slate-100 px-5 py-4 text-sm font-semibold text-slate-700">
                      {row.views.toLocaleString()}
                    </td>

                    <td className="border-b border-slate-100 px-5 py-4 text-sm font-semibold text-slate-700">
                      {row.inquiry.toLocaleString()}
                    </td>

                    <td className="border-b border-slate-100 px-5 py-4">
                      <ConversionBadge value={`${row.rate}%`} />
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

                {cityRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
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
              Showing <span className="font-bold text-slate-700">{cityRows.length}</span> rows
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

function SelectLike({ value }) {
  return (
    <button className="inline-flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
      <span>{value}</span>
      <ChevronDown className="h-4 w-4 text-slate-400" />
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

        <div
          className={cls(
            "flex h-11 w-11 items-center justify-center rounded-2xl border",
            toneMap[tone]
          )}
        >
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
          {positive ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" />
          )}
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
    amber: "bg-amber-50 text-amber-600 border-amber-100",
  };

  return (
    <section className="h-full overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div className="flex items-center gap-4">
          <div
            className={cls(
              "flex h-12 w-12 items-center justify-center rounded-[18px] border",
              toneMap[tone]
            )}
          >
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

function MiniStatBox({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white px-4 py-4">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-[20px] font-black text-slate-900">{value}</p>
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

function StatusBadge({ value }) {
  const map = {
    Healthy: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Warning: "bg-amber-50 text-amber-700 border-amber-100",
    Critical: "bg-rose-50 text-rose-700 border-rose-100",
  };

  return (
    <span
      className={cls(
        "inline-flex rounded-full border px-2.5 py-1 text-xs font-bold",
        map[value] || map.Warning
      )}
    >
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
    <span
      className={cls(
        "inline-flex rounded-full border px-2.5 py-1 text-xs font-bold",
        map[value] || map.Moderate
      )}
    >
      {value}
    </span>
  );
}

function ConversionBadge({ value }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-sky-100 bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-700">
      <Activity className="h-3.5 w-3.5" />
      {value}
    </span>
  );
}

export default ConversionFunnel;