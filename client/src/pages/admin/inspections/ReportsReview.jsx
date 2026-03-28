import React, { useMemo, useState } from "react";
import {
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  Flag,
  FileText,
  ShieldAlert,
  ClipboardCheck,
  Images,
  Star,
  X,
} from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

/* ======================================================
   DUMMY DATA
====================================================== */

const REPORTS = [
  {
    id: "REP-1021",
    vehicle: "Hyundai Creta 2021",
    inspector: "Rahul Shah",
    rating: 4.8,
    consultant: "Metro Auto Hub",
    city: "Ahmedabad",
    type: "Premium",
    submitted: "10 Mar 2026",
    status: "Submitted",
    risk: "Low",
    checklist: 92,
    media: 18,
  },
  {
    id: "REP-1022",
    vehicle: "Tata Nexon 2022",
    inspector: "Nisha Patel",
    rating: 4.6,
    consultant: "City Drive",
    city: "Surat",
    type: "Basic",
    submitted: "9 Mar 2026",
    status: "Under Review",
    risk: "Moderate",
    checklist: 84,
    media: 12,
  },
  {
    id: "REP-1023",
    vehicle: "Honda City",
    inspector: "Karan Vora",
    rating: 4.9,
    consultant: "Elite Motors",
    city: "Rajkot",
    type: "Video",
    submitted: "8 Mar 2026",
    status: "Approved",
    risk: "Low",
    checklist: 100,
    media: 26,
  },
];

/* ======================================================
   BADGES
====================================================== */

const statusBadge = (status) => {
  const map = {
    Submitted: "bg-sky-50 text-sky-700 border-sky-200",
    "Under Review": "bg-amber-50 text-amber-700 border-amber-200",
    Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Rejected: "bg-rose-50 text-rose-700 border-rose-200",
    Flagged: "bg-violet-50 text-violet-700 border-violet-200",
  };
  return map[status] || "bg-slate-100 text-slate-700 border-slate-200";
};

const riskBadge = (risk) => {
  if (risk === "High") return "bg-rose-50 text-rose-700 border-rose-200";
  if (risk === "Moderate") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-emerald-50 text-emerald-700 border-emerald-200";
};

const typeBadge = (type) => {
  const map = {
    Premium: "bg-violet-50 text-violet-700 border-violet-200",
    Basic: "bg-sky-50 text-sky-700 border-sky-200",
    Video: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };
  return map[type] || "bg-slate-100 text-slate-700 border-slate-200";
};

/* ======================================================
   SMALL COMPONENTS
====================================================== */

function TopCard({ title, value, icon: Icon }) {
  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-6 overflow-hidden group shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex items-end justify-between">
        <div>
          <div className="text-[12px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-2">
            {title}
          </div>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900">
            {value}
          </div>
        </div>

        <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 transition-colors duration-300">
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-slate-400">{label}</div>
      <div className="mt-1 text-[13px] font-medium text-slate-700">{value}</div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 flex flex-col justify-center">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 truncate">
            {label}
          </div>
          <div className="mt-0.5 text-[15px] font-bold text-slate-900 truncate">{value}</div>
        </div>
      </div>
    </div>
  );
}

/* ======================================================
   MAIN PAGE
====================================================== */

const ReportsReview = () => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return REPORTS;

    const q = search.toLowerCase();

    return REPORTS.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.vehicle.toLowerCase().includes(q) ||
        r.inspector.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        r.consultant.toLowerCase().includes(q)
    );
  }, [search]);

  const summary = useMemo(
    () => ({
      submitted: REPORTS.filter((r) => r.status === "Submitted").length,
      review: REPORTS.filter((r) => r.status === "Under Review").length,
      approved: REPORTS.filter((r) => r.status === "Approved").length,
      rejected: REPORTS.filter((r) => r.status === "Rejected").length,
      flagged: REPORTS.filter((r) => r.status === "Flagged").length,
    }),
    []
  );

  return (
    <div className="min-h-screen p-0">
      <style>{`
        .table-scroll::-webkit-scrollbar { height: 6px; }
        .table-scroll::-webkit-scrollbar-track { background: transparent; }
        .table-scroll::-webkit-scrollbar-thumb { background: rgba(148,163,184,0.35); border-radius: 6px; }
        .table-scroll::-webkit-scrollbar-thumb:hover { background: rgba(100,116,139,0.45); }
      `}</style>

      <div className="mx-auto space-y-6">
        {/* HEADER */}
        <section className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
              Reports Review
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-500">
              Validate submitted inspection reports, review quality, and ensure
              inspection accuracy before approval or escalation.
            </p>
          </div>
        </section>

        {/* SUMMARY */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <TopCard title="Submitted" value={summary.submitted} icon={FileText} />
          <TopCard title="Under Review" value={summary.review} icon={ShieldAlert} />
          <TopCard title="Approved" value={summary.approved} icon={CheckCircle2} />
          <TopCard title="Rejected" value={summary.rejected} icon={XCircle} />
          <TopCard title="Flagged" value={summary.flagged} icon={Flag} />
        </section>

        {/* SEARCH BAR */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-100 blur-[100px] pointer-events-none" />

          <div className="p-5 md:p-6 relative z-10 border-b border-slate-200">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="relative flex-1 max-w-2xl">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search report, vehicle, inspector, consultant..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-[14px] text-slate-900 outline-none transition-all focus:border-sky-400 placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="w-full overflow-x-auto table-scroll relative z-10 pb-4">
            <table className="min-w-[1300px] w-full border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Report ID</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Vehicle</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Inspector</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Type</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Submitted</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Status</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Risk</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Checklist %</th>
                  <th className="px-5 py-4 font-semibold whitespace-nowrap">Media</th>
                  <th className="px-6 py-4 text-right font-semibold whitespace-nowrap">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filtered.length ? (
                  filtered.map((r) => (
                    <tr
                      key={r.id}
                      className={cls(
                        "transition-colors duration-200 hover:bg-slate-50 group",
                        selected?.id === r.id && "bg-sky-50"
                      )}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-100 to-blue-100 border border-slate-200 flex items-center justify-center shrink-0">
                            <FileText className="h-4 w-4 text-sky-700" />
                          </div>
                          <div>
                            <div className="text-[14px] font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                              {r.id}
                            </div>
                            <div className="mt-0.5 text-[12px] text-slate-500">{r.city}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="min-w-[180px]">
                          <div className="text-[13px] font-medium text-slate-700">{r.vehicle}</div>
                          <div className="mt-1 text-[12px] text-slate-500">{r.consultant}</div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="min-w-[150px]">
                          <div className="text-[13px] font-medium text-slate-700">{r.inspector}</div>
                          <div className="mt-1 text-[12px] text-slate-500 flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            {r.rating}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={cls(
                            "inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap",
                            typeBadge(r.type)
                          )}
                        >
                          {r.type}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-[13px] font-medium text-slate-500 whitespace-nowrap">
                        {r.submitted}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={cls(
                            "inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap",
                            statusBadge(r.status)
                          )}
                        >
                          {r.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={cls(
                            "inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap",
                            riskBadge(r.risk)
                          )}
                        >
                          {r.risk}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-[13px] font-medium text-slate-500">
                        {r.checklist}%
                      </td>

                      <td className="px-5 py-4 text-[13px] font-medium text-slate-500">
                        {r.media}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelected(r)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 shadow-sm"
                          >
                            <Eye size={16} />
                          </button>

                          <button className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100">
                            <CheckCircle2 size={16} />
                          </button>

                          <button className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-700 transition hover:bg-rose-100">
                            <XCircle size={16} />
                          </button>

                          <button className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-700 transition hover:bg-amber-100">
                            <Flag size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="px-6 py-28 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-4">
                          <Search size={28} />
                        </div>
                        <div className="text-lg font-bold text-slate-900 tracking-tight">
                          No reports found
                        </div>
                        <div className="mt-1 text-[14px] text-slate-500 max-w-sm mx-auto">
                          Try adjusting your search query to see more results.
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* DRAWER */}
      {selected && (
        <>
          <div
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />

          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-[520px] border-l border-slate-200 bg-white shadow-2xl flex flex-col">
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 bg-slate-50">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{selected.id}</h3>
                <p className="mt-1 text-sm text-slate-500">{selected.vehicle}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span
                    className={cls(
                      "inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold border",
                      statusBadge(selected.status)
                    )}
                  >
                    {selected.status}
                  </span>

                  <span
                    className={cls(
                      "inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold border",
                      riskBadge(selected.risk)
                    )}
                  >
                    {selected.risk} Risk
                  </span>

                  <span
                    className={cls(
                      "inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold border",
                      typeBadge(selected.type)
                    )}
                  >
                    {selected.type}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 gap-3">
                <StatCard label="Checklist Score" value={`${selected.checklist}%`} icon={ClipboardCheck} />
                <StatCard label="Media Count" value={selected.media} icon={Images} />
                <StatCard label="Inspector Rating" value={selected.rating} icon={Star} />
                <StatCard label="Submitted On" value={selected.submitted} icon={CalendarDays} />
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
                <h4 className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
                  Report Details
                </h4>

                <div className="mt-4 space-y-4">
                  <InfoRow label="Vehicle" value={selected.vehicle} />
                  <InfoRow label="Inspector" value={selected.inspector} />
                  <InfoRow label="Consultant" value={selected.consultant} />
                  <InfoRow label="Inspection Type" value={selected.type} />
                  <InfoRow label="Inspection Date" value={selected.submitted} />
                  <InfoRow label="City" value={selected.city} />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-[13px] font-semibold text-white hover:bg-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Approve Report
                </button>

                <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-[13px] font-semibold text-white hover:bg-rose-700">
                  <XCircle className="h-4 w-4" />
                  Reject Report
                </button>

                <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] font-semibold text-amber-700 hover:bg-amber-100">
                  <Flag className="h-4 w-4" />
                  Flag for Audit
                </button>

                <button
                  onClick={() => setSelected(null)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportsReview;