import React, { useMemo, useState } from "react";
import {
  Trophy,
  TrendingUp,
  Layers,
  ShieldAlert,
  User,
  Star,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Zap,
  Clock3,
  Search,
  SlidersHorizontal,
  RefreshCw,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  BadgeCheck,
  CircleDashed,
  IndianRupee,
  ShieldCheck,
  Activity,
  Eye,
  MoreHorizontal,
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
  Legend,
} from "recharts";
import AnalyticsControls from "./components/AnalyticsControls";

const cls = (...a) => a.filter(Boolean).join(" ");

const TopConsultants = () => {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [city, setCity] = useState("All Cities");
  const [tier, setTier] = useState("All Tiers");
  const [dateRange, setDateRange] = useState("Last 30 Days");

  const consultants = useMemo(
    () => [
      {
        rank: 1,
        name: "Elite Motors",
        city: "Mumbai",
        tier: "Premium",
        inquiries: 420,
        conv: 12.4,
        response: "8m",
        inspection: "92%",
        rating: 4.8,
        revenue: "₹8.2L",
        risk: "Low",
        status: "Healthy",
      },
      {
        rank: 2,
        name: "Prestige Cars",
        city: "Delhi",
        tier: "Premium",
        inquiries: 385,
        conv: 10.8,
        response: "12m",
        inspection: "88%",
        rating: 4.7,
        revenue: "₹6.5L",
        risk: "Low",
        status: "Healthy",
      },
      {
        rank: 3,
        name: "Auto World",
        city: "Bangalore",
        tier: "Pro",
        inquiries: 310,
        conv: 14.2,
        response: "6m",
        inspection: "90%",
        rating: 4.9,
        revenue: "₹5.1L",
        risk: "Moderate",
        status: "Watch",
      },
      {
        rank: 4,
        name: "Sahil Sales",
        city: "Pune",
        tier: "Premium",
        inquiries: 290,
        conv: 9.2,
        response: "15m",
        inspection: "84%",
        rating: 4.5,
        revenue: "₹4.8L",
        risk: "Low",
        status: "Healthy",
      },
      {
        rank: 5,
        name: "Super Ride",
        city: "Hyderabad",
        tier: "Basic",
        inquiries: 245,
        conv: 16.8,
        response: "4m",
        inspection: "95%",
        rating: 5.0,
        revenue: "₹3.2L",
        risk: "High",
        status: "At Risk",
      },
    ].filter((item) => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        item.tier.toLowerCase().includes(q)
      );
    }),
    [search]
  );

  const tierComparisonData = [
    { name: "Top 10 Basic", inquiries: 180, conversion: 8.2 },
    { name: "Top 10 Premium", inquiries: 420, conversion: 14.5 },
  ];

  const kpis = [
    {
      title: "Top Avg Inquiry Growth",
      value: "+24.2%",
      trend: "+4.1%",
      icon: MessageSquare,
      tone: "sky",
    },
    {
      title: "Avg Conversion Rate",
      value: "12.8%",
      trend: "+1.7%",
      icon: CheckCircle2,
      tone: "emerald",
    },
    {
      title: "Boost ROI",
      value: "4.2x",
      trend: "+0.8x",
      icon: Zap,
      tone: "amber",
    },
    {
      title: "SLA Breach Trend",
      value: "-15%",
      trend: "-3.2%",
      icon: Clock3,
      tone: "indigo",
    },
  ];

  const riskWatchlist = [
    { name: "Super Ride", flag: "Fraud Cluster Detected", type: "Fraud" },
    { name: "Auto World", flag: "SLA Breach > 12h", type: "SLA" },
    { name: "Elite Motors", flag: "Dispute Spike (3.2%)", type: "Dispute" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-0 py-0">
      <div className="space-y-6">
        {/* Header */}
        <section className="rounded-[28px] border border-slate-200 bg-white px-6 py-6 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-700">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                Consultant Leaderboard
              </div>

              <h1 className="mt-3 text-[30px] font-black tracking-tight text-slate-900">
                Top Performing Consultants
              </h1>
              <p className="mt-1 text-sm font-medium text-slate-500">
                All Vehicles style premium leaderboard with consultant performance,
                tier benchmark and risk monitoring.
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
                placeholder="Search consultant, city, tier..."
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <SelectLike value={city} setValue={setCity} />
              <SelectLike value={tier} setValue={setTier} />
              <SelectLike value={dateRange} setValue={setDateRange} />

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
              <FilterInput label="Min Inquiries" placeholder="100+" />
              <FilterInput label="Min Conversion %" placeholder="5%+" />
              <FilterInput label="Risk Level" placeholder="Low / Moderate / High" />
              <FilterInput label="Response SLA" placeholder="< 15 min" />
            </motion.div>
          )}
        </section>

        {/* KPI */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((item) => (
            <TopMetricCard key={item.title} {...item} />
          ))}
        </section>

        {/* Leaderboard Table */}
        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight text-slate-900">
                Consultant Leaderboard
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Exact All Vehicles style table shell with performance-first consultant ranking
              </p>
            </div>

            <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
              <Trophy className="h-4 w-4 text-amber-500" />
              View Top 10
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr className="text-left">
                  {[
                    "Rank",
                    "Consultant",
                    "Tier",
                    "Inquiries",
                    "Conv. %",
                    "Resp. Time",
                    "Inspection",
                    "Rating",
                    "Revenue",
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
                {consultants.map((c) => (
                  <tr key={c.rank} className="transition hover:bg-slate-50/80">
                    <td className="border-b border-slate-100 px-5 py-4">
                      <RankBadge rank={c.rank} />
                    </td>

                    <td className="border-b border-slate-100 px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                          <User className="h-5 w-5" />
                        </div>

                        <div>
                          <div className="text-sm font-bold text-slate-900">{c.name}</div>
                          <div className="text-xs font-medium text-slate-400">{c.city}</div>
                        </div>
                      </div>
                    </td>

                    <td className="border-b border-slate-100 px-5 py-4">
                      <TierBadge value={c.tier} />
                    </td>

                    <td className="border-b border-slate-100 px-5 py-4 text-sm font-semibold text-slate-700">
                      {c.inquiries}
                    </td>

                    <td className="border-b border-slate-100 px-5 py-4">
                      <ConversionBadge value={`${c.conv}%`} />
                    </td>

                    <td className="border-b border-slate-100 px-5 py-4">
                      <ResponseBadge value={c.response} />
                    </td>

                    <td className="border-b border-slate-100 px-5 py-4">
                      <InspectionBadge value={c.inspection} />
                    </td>

                    <td className="border-b border-slate-100 px-5 py-4">
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {c.rating}
                      </div>
                    </td>

                    <td className="border-b border-slate-100 px-5 py-4 text-sm font-black text-slate-900">
                      {c.revenue}
                    </td>

                    <td className="border-b border-slate-100 px-5 py-4">
                      <StatusBadge value={c.status} />
                    </td>

                    <td className="border-b border-slate-100 px-5 py-4">
                      <RiskBadge value={c.risk} />
                    </td>

                    <td className="border-b border-slate-100 px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {consultants.length === 0 && (
                  <tr>
                    <td
                      colSpan={12}
                      className="px-5 py-14 text-center text-sm font-semibold text-slate-400"
                    >
                      No matching consultants found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 text-sm font-medium text-slate-500 md:flex-row md:items-center md:justify-between">
            <div>
              Showing <span className="font-bold text-slate-700">{consultants.length}</span> rows
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

        {/* Lower cards */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-6">
            <Panel
              title="Performance Benchmark"
              subtitle="Growth and ROI across top consultants"
              icon={TrendingUp}
              tone="emerald"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <MiniStatCard label="Avg Inquiry Growth" value="+24.2%" icon={MessageSquare} positive />
                <MiniStatCard label="Avg Conv. Growth" value="+8.1%" icon={CheckCircle2} positive />
                <MiniStatCard label="Avg Boost ROI" value="4.2x" icon={Zap} positive />
                <MiniStatCard label="SLA Breach Trend" value="-15%" icon={Clock3} positive />
              </div>

              <div className="mt-6 rounded-[24px] border border-slate-100 bg-slate-50 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-[13px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Rank Velocity Trend
                  </h4>
                  <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                    Live
                  </span>
                </div>

                <div className="flex h-[210px] items-center justify-center rounded-[20px] border border-dashed border-slate-300 bg-white text-sm font-semibold text-slate-400">
                  Interactive chart zone
                </div>
              </div>
            </Panel>
          </div>

          <div className="xl:col-span-6 space-y-6">
            <Panel
              title="Tier ROI Comparison"
              subtitle="Basic vs Premium consultant performance"
              icon={Layers}
              tone="indigo"
            >
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tierComparisonData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fontWeight: 700, fill: "#64748b" }}
                    />
                    <YAxis
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
                    <Bar dataKey="inquiries" fill="#6366f1" radius={[8, 8, 0, 0]} name="Inquiry Vol" />
                    <Bar dataKey="conversion" fill="#fbbf24" radius={[8, 8, 0, 0]} name="Conv Rate" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel
              title="Risk Watchlist"
              subtitle="Even top performers can become risky"
              icon={ShieldAlert}
              tone="rose"
            >
              <div className="space-y-3">
                {riskWatchlist.map((r) => (
                  <div
                    key={r.name}
                    className="flex items-center gap-4 rounded-2xl border border-rose-100 bg-rose-50 p-4 transition hover:border-rose-200 hover:bg-white"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-rose-600 shadow-sm">
                      <AlertTriangle className="h-4.5 w-4.5" />
                    </div>

                    <div className="min-w-0">
                      <div className="text-sm font-black text-rose-900">{r.name}</div>
                      <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-rose-600/80">
                        {r.flag}
                      </div>
                    </div>

                    <button className="ml-auto rounded-xl p-2 text-rose-500 transition hover:bg-rose-100">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </Panel>
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

  const positive = trend.startsWith("+") || trend.startsWith("-");

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
            positive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
          )}
        >
          {trend.startsWith("+") ? (
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
    amber: "bg-amber-50 text-amber-600 border-amber-100",
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

function MiniStatCard({ label, value, icon: Icon, positive = false }) {
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
          <div className={cls("mt-1 text-[20px] font-black", positive ? "text-emerald-600" : "text-slate-900")}>
            {value}
          </div>
        </div>
      </div>
    </div>
  );
}

function RankBadge({ rank }) {
  const styles =
    rank === 1
      ? "bg-amber-50 text-amber-700 border-amber-100"
      : rank === 2
        ? "bg-slate-100 text-slate-700 border-slate-200"
        : rank === 3
          ? "bg-orange-50 text-orange-700 border-orange-100"
          : "bg-slate-50 text-slate-600 border-slate-200";

  return (
    <span className={cls("inline-flex h-9 w-9 items-center justify-center rounded-2xl border text-sm font-black", styles)}>
      {rank}
    </span>
  );
}

function TierBadge({ value }) {
  const map = {
    Premium: "bg-indigo-600 text-white border-indigo-600",
    Pro: "bg-sky-500 text-white border-sky-500",
    Basic: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <span className={cls("inline-flex rounded-full border px-2.5 py-1 text-xs font-bold", map[value] || map.Basic)}>
      {value}
    </span>
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

function ConversionBadge({ value }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
      <Activity className="h-3.5 w-3.5" />
      {value}
    </span>
  );
}

function ResponseBadge({ value }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-sky-100 bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-700">
      <Clock3 className="h-3.5 w-3.5" />
      {value}
    </span>
  );
}

function InspectionBadge({ value }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">
      <ShieldCheck className="h-3.5 w-3.5" />
      {value}
    </span>
  );
}

export default TopConsultants;