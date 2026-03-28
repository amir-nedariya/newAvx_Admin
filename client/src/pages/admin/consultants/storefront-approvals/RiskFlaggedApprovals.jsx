import React from "react";
import { ShieldAlert, AlertTriangle, Scale, Ban } from "lucide-react";
import { cls, riskBadge } from "./components/SharedComponents";

export default function RiskFlaggedApprovals({ rows }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full border-collapse">
          <thead className="border-b border-slate-200 bg-slate-50/50">
            <tr className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <th className="px-6 py-5 font-bold">Consultant Identity</th>
              <th className="px-5 py-5 font-bold">Threat Category</th>
              <th className="px-5 py-5 font-bold">Risk Magnitude</th>
              <th className="px-5 py-5 font-bold">Mitigation Status</th>
              <th className="px-6 py-5 text-right font-bold">Enforcement Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-5">
                   <div className="flex items-center gap-3">
                     <AlertTriangle size={18} className="text-rose-500 shrink-0" />
                     <span className="text-sm font-bold text-slate-900">{row.consultant}</span>
                   </div>
                </td>
                <td className="px-5 py-5">
                   <div className="text-[13px] font-bold text-slate-700">{row.claimType}</div>
                </td>
                <td className="px-5 py-5">
                  <span
                    className={cls(
                      "inline-flex rounded-lg border px-3 py-1 text-[10px] font-black uppercase shadow-sm",
                      riskBadge(row.severity)
                    )}
                  >
                    {row.severity}
                  </span>
                </td>
                <td className="px-5 py-5">
                   <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                      <Scale size={14} className="text-slate-400" />
                      {row.actionTaken}
                   </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="inline-flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-[12px] font-bold text-rose-700 hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-95"
                    >
                      <span className="inline-flex items-center gap-2 uppercase tracking-wide">
                        <Ban size={14} />
                        Suspend Account
                      </span>
                    </button>
                    <button
                      type="button"
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-bold text-slate-700 hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-95"
                    >
                      System Scrub
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
