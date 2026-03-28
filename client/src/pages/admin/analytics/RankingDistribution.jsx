import React, { useMemo, useState } from "react";
import {
  BarChart3,
  Layers,
  Zap,
  ShieldAlert,
  Edit3,
  BarChart,
  Search,
  SlidersHorizontal,
  RefreshCw,
  Download,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Activity,
  BadgeCheck,
  CircleDashed,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import {
  BarChart as RechartsBarChart,
  Bar as RechartsBar,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  CartesianGrid as RechartsCartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer as RechartsResponsiveContainer,
  Cell as RechartsCell,
  LineChart as RechartsLineChart,
  Line as RechartsLine,
  AreaChart as RechartsAreaChart,
  Area as RechartsArea,
} from "recharts";
import { motion } from "framer-motion";
import AnalyticsControls from "./components/AnalyticsControls";

const cls = (...a) => a.filter(Boolean).join(" ");

const RankingDistribution = () => {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [tier, setTier] = useState("All Tiers");
  const [city, setCity] = useState("All Cities");
  const [dateRange, setDateRange] = useState("Last 30 Days");

  const histogramData = [
    { name: "0-20", count: 420 },
    { name: "20-40", count: 850 },
    { name: "40-60", count: 1240 },
    { name: "60-80", count: 910 },
    { name: "80-100", count: 580 },
  ];

  const tierInfluenceData = [
    { tier: "Basic", score: 42 },
    { tier: "Pro", score: 68 },
    { tier: "Premium", score: 84 },
  ];

  const boostImpactData = [
    { name: "Day 1", before: 45, after: 78, sustained: 52 },
    { name: "Day 3", before: 45, after: 82, sustained: 55 },
    { name: "Day 7", before: 45, after: 85, sustained: 58 },
    { name: "Day 14", before: 45, after: 62, sustained: 48 },
  ];

  const overrideRows = useMemo(() => {
    const data = [
      {
        name: "Rajesh Auto",
        prev: 42,
        next: 85,
        by: "Admin_Aman",
        reason: "Gold Partner Promo",
        date: "24 Mar 2026",
        status: "Approved",
        risk: "Low",
      },
      {
        name: "Elite Motors",
        prev: 68,
        next: 92,
        by: "System_AI",
        reason: "Trust Verification",
        date: "23 Mar 2026",
        status: "Verified",
        risk: "Low",
      },
      {
        name: "Premium Car Hut",
        prev: 15,
        next: 0,
        by: "Admin_Vikram",
        reason: "Fraud Investigation",
        date: "22 Mar 2026",
        status: "Locked",
        risk: "High",
      },
      {
        name: "Metro Wheels",
        prev: 57,
        next: 74,
        by: "Admin_Neel",
        reason: "Quality Score Correction",
        date: "21 Mar 2026",
        status: "Adjusted",
        risk: "Moderate",
      },
    ];

    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        row.by.toLowerCase().includes(q) ||
        row.reason.toLowerCase().includes(q)
    );
  }, [search]);

  const kpis = [
    {
      title: "Avg Ranking Score",
      value: "61.8",
      trend: "+3.2%",
      icon: BarChart3,
      tone: "sky",
    },
    {
      title: "Manual Overrides",
      value: "148",
      trend: "+8.1%",
      icon: Edit3,
      tone: "indigo",
    },
    {
      title: "Fraud Locked Cases",
      value: "24",
      trend: "-6.4%",
      icon: ShieldAlert,
      tone: "rose",
    },
    {
      title: "Boosted Listings",
      value: "612",
      trend: "+11.9%",
      icon: Zap,
      tone: "amber",
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
                Ranking Engine Health
              </div>

              <h1 className="mt-3 text-[30px] font-black tracking-tight text-slate-900">
                Ranking Distribution
              </h1>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Fairness audits, tier influence, boost impact and manual override
                tracking in All Vehicles style premium admin UI.
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
                placeholder="Search consultant, override reason, modified by..."
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <SelectLike value={tier} />
              <SelectLike value={city} />
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
                  4
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
              <FilterInput label="Min Score" placeholder="40+" />
              <FilterInput label="Max Risk" placeholder="Low / Moderate / High" />
              <FilterInput label="Override Type" placeholder="Promo / Fraud / Audit" />
              <FilterInput label="Boost Window" placeholder="Day 1 / Day 7 / Day 14" />
            </motion.div>
          )}
        </section>

        {/* KPI Cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((item) => (
            <TopMetricCard key={item.title} {...item} />
          ))}
        </section>

        {/* Main content */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-6">
            <Panel
              title="Score Distribution"
              subtitle="Histogram of ranking score clustering"
              icon={BarChart}
              tone="sky"
            >
              <div className="h-[300px] w-full">
                <RechartsResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={histogramData}>
                    <RechartsCartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />
                    <RechartsXAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fontWeight: 700, fill: "#64748b" }}
                    />
                    <RechartsYAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fontWeight: 700, fill: "#64748b" }}
                    />
                    <RechartsTooltip
                      cursor={{ fill: "#f8fafc" }}
                      contentStyle={{
                        borderRadius: "18px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 14px 40px rgba(15,23,42,0.08)",
                      }}
                    />
                    <RechartsBar dataKey="count" radius={[10, 10, 4, 4]}>
                      {histogramData.map((entry, index) => (
                        <RechartsCell
                          key={`cell-${index}`}
                          fill={index === 2 ? "#0ea5e9" : "#cbd5e1"}
                        />
                      ))}
                    </RechartsBar>
                  </RechartsBarChart>
                </RechartsResponsiveContainer>
              </div>

              <div className="mt-5 flex items-center gap-4 rounded-[24px] border border-sky-100 bg-sky-50 px-4 py-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[12px] font-black uppercase tracking-[0.12em] text-sky-800">
                    Normal Clustering
                  </div>
                  <div className="mt-1 text-[12px] font-semibold text-sky-700/80">
                    60% of entities are grouped between 40–70. No major score skew detected.
                  </div>
                </div>
              </div>
            </Panel>
          </div>

          <div className="xl:col-span-6">
            <Panel
              title="Tier Influence"
              subtitle="Average ranking score by consultant tier"
              icon={Layers}
              tone="indigo"
            >
              <div className="space-y-7">
                {tierInfluenceData.map((t, i) => (
                  <div key={t.tier} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span
                          className={cls(
                            "h-7 w-1.5 rounded-full",
                            i === 0
                              ? "bg-slate-300"
                              : i === 1
                                ? "bg-sky-400"
                                : "bg-indigo-600"
                          )}
                        />
                        <span className="text-[15px] font-black tracking-tight text-slate-800">
                          {t.tier} Tier
                        </span>
                      </div>
                      <span className="text-[18px] font-black text-slate-900">
                        {t.score}/100
                      </span>
                    </div>

                    <div className="h-4 w-full overflow-hidden rounded-full bg-slate-100 shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${t.score}%` }}
                        transition={{ duration: 1, delay: i * 0.2 }}
                        className={cls(
                          "h-full rounded-full",
                          i === 0
                            ? "bg-slate-300"
                            : i === 1
                              ? "bg-sky-400"
                              : "bg-indigo-600"
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-4">
                <p className="text-[12px] font-semibold italic leading-relaxed text-slate-500">
                  Premium tier does not guarantee domination. Ranking combines activity,
                  reviews, tier weight and freshness to maintain fairness.
                </p>
              </div>
            </Panel>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-7">
            <Panel
              title="Boost Impact & Abuse"
              subtitle="Pre boost vs live boost vs sustained ranking score"
              icon={Zap}
              tone="amber"
            >
              <div className="h-[280px] w-full">
                <RechartsResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={boostImpactData}>
                    <RechartsCartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />
                    <RechartsXAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fontWeight: 700, fill: "#64748b" }}
                    />
                    <RechartsYAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fontWeight: 700, fill: "#64748b" }}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        borderRadius: "18px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 14px 40px rgba(15,23,42,0.08)",
                      }}
                    />
                    <RechartsLine
                      type="monotone"
                      dataKey="before"
                      stroke="#94a3b8"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                    <RechartsLine
                      type="monotone"
                      dataKey="after"
                      stroke="#f59e0b"
                      strokeWidth={4}
                      dot={{ r: 6, fill: "#f59e0b", strokeWidth: 3, stroke: "#fff" }}
                    />
                    <RechartsLine
                      type="monotone"
                      dataKey="sustained"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
                    />
                  </RechartsLineChart>
                </RechartsResponsiveContainer>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <MiniLegend label="Pre-Boost" colorClass="bg-slate-400" textClass="text-slate-500" />
                <MiniLegend label="During-Boost" colorClass="bg-amber-400" textClass="text-amber-600" />
                <MiniLegend label="Post-Boost" colorClass="bg-emerald-500" textClass="text-emerald-600" />
              </div>
            </Panel>
          </div>

          <div className="xl:col-span-5">
            <Panel
              title="Fraud Impact Audit"
              subtitle="Ranking adjustments for suspicious activity"
              icon={ShieldAlert}
              tone="rose"
            >
              <div className="grid grid-cols-2 gap-3">
                <FraudBox label="Locked Cases" count="24" color="rose" />
                <FraudBox label="Penalized Accounts" count="156" color="amber" />
                <FraudBox label="Suspended" count="42" color="slate" />
                <FraudBox label="Score Impact" count="-12.4" color="rose" />
              </div>

              <div className="mt-5 flex items-start gap-4 rounded-[24px] border border-rose-100 bg-rose-50 p-4">
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-rose-600 shadow-sm">
                  <AlertTriangle className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-black text-rose-800">
                    Anomaly Detected — Bangalore
                  </div>
                  <div className="mt-1 text-[12px] font-semibold leading-relaxed text-rose-700/80">
                    A cluster of 8 accounts showed artificial inquiry spikes. Ranking
                    has been frozen for investigation.
                  </div>
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
                Manual Ranking Overrides
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-500">
                All Vehicles style override table with cleaner row spacing, badges and actions
              </p>
            </div>

            <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
              <BadgeCheck className="h-4 w-4 text-sky-500" />
              Review Queue
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr className="text-left">
                  {[
                    "Consultant",
                    "Prev Score",
                    "New Score",
                    "Modified By",
                    "Reason",
                    "Date",
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
                {overrideRows.map((row) => (
                  <tr key={`${row.name}-${row.date}`} className="transition hover:bg-slate-50/80">
                    <td className="border-b border-slate-100 px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                          <BarChart3 className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{row.name}</div>
                          <div className="text-xs font-medium text-slate-400">Ranking entity</div>
                        </div>
                      </div>
                    </td>

                    <td className="border-b border-slate-100 px-5 py-4 text-center">
                      <span className="text-sm font-bold text-slate-400 line-through">
                        {row.prev}
                      </span>
                    </td>

                    <td className="border-b border-slate-100 px-5 py-4 text-center">
                      <span className="text-sm font-black text-sky-600">{row.next}</span>
                    </td>

                    <td className="border-b border-slate-100 px-5 py-4 text-sm font-semibold text-slate-700">
                      {row.by}
                    </td>

                    <td className="border-b border-slate-100 px-5 py-4">
                      <span className="inline-flex rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-600">
                        {row.reason}
                      </span>
                    </td>

                    <td className="border-b border-slate-100 px-5 py-4 text-sm font-semibold text-slate-500">
                      {row.date}
                    </td>

                    <td className="border-b border-slate-100 px-5 py-4">
                      <StatusBadge value={row.status} />
                    </td>

                    <td className="border-b border-slate-100 px-5 py-4">
                      <RiskBadge value={row.risk} />
                    </td>

                    <td className="border-b border-slate-100 px-5 py-4">
                      <button className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50">
                        View
                      </button>
                    </td>
                  </tr>
                ))}

                {overrideRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-5 py-14 text-center text-sm font-semibold text-slate-400"
                    >
                      No matching override data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 text-sm font-medium text-slate-500 md:flex-row md:items-center md:justify-between">
            <div>
              Showing <span className="font-bold text-slate-700">{overrideRows.length}</span> rows
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
    rose: "bg-rose-50 text-rose-600 border-rose-100",
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
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    slate: "bg-slate-50 text-slate-600 border-slate-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
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

function MiniLegend({ label, colorClass, textClass }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
      <div className={cls("h-1.5 w-5 rounded-full", colorClass)} />
      <span className={cls("text-[11px] font-black uppercase tracking-[0.14em]", textClass)}>
        {label}
      </span>
    </div>
  );
}

function FraudBox({ label, count, color }) {
  const styles = {
    rose: "bg-rose-50 border-rose-100 text-rose-600",
    amber: "bg-amber-50 border-amber-100 text-amber-600",
    slate: "bg-slate-50 border-slate-100 text-slate-600",
  };

  return (
    <div className={cls("rounded-[22px] border p-4", styles[color])}>
      <div className="mb-1 text-[11px] font-black uppercase tracking-[0.14em] opacity-70">
        {label}
      </div>
      <div className="text-[22px] font-black">{count}</div>
    </div>
  );
}

function StatusBadge({ value }) {
  const map = {
    Approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Verified: "bg-sky-50 text-sky-700 border-sky-100",
    Locked: "bg-rose-50 text-rose-700 border-rose-100",
    Adjusted: "bg-amber-50 text-amber-700 border-amber-100",
  };

  return (
    <span className={cls("inline-flex rounded-full border px-2.5 py-1 text-xs font-bold", map[value] || map.Adjusted)}>
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

export default RankingDistribution;