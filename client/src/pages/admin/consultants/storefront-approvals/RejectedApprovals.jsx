import React from "react";
import { XCircle, RefreshCw, Slash } from "lucide-react";
import { formatDate } from "./components/SharedComponents";

export default function RejectedApprovals({ rows }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full border-collapse">
          <thead className="border-b border-slate-200 bg-slate-50/50">
            <tr className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <th className="px-6 py-5 font-bold">Consultant</th>
              <th className="px-5 py-5 font-bold">Modification Requested</th>
              <th className="px-5 py-5 font-bold">Rejection Time</th>
              <th className="px-5 py-5 font-bold">Rejection Reason</th>
              <th className="px-6 py-5 text-right font-bold">Remediation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-5">
                   <div className="flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                     <XCircle size={14} className="text-rose-500 shrink-0" />
                     {row.consultant}
                   </div>
                </td>
                <td className="px-5 py-5">
                   <span className="text-[13px] font-semibold text-slate-600 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">{row.change}</span>
                </td>
                <td className="px-5 py-5 text-[13px] font-medium text-slate-500 font-mono">
                  {formatDate(row.rejectedOn)}
                </td>
                <td className="px-5 py-5 text-sm">
                   <span className="inline-flex py-1 px-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-700 font-bold text-[11px] uppercase tracking-wider">
                     {row.reason}
                   </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      type="button"
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-bold text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm active:scale-95"
                    >
                      <span className="inline-flex items-center gap-2">
                        <RefreshCw size={14} />
                        Re-review
                      </span>
                    </button>
                    <button
                      type="button"
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-bold text-slate-700 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all shadow-sm active:scale-95"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Slash size={14} />
                        Block Action
                      </span>
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
