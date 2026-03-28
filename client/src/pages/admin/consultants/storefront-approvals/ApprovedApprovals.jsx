import React from "react";
import { RotateCcw, Ban, CheckCircle2 } from "lucide-react";
import { formatDate } from "./components/SharedComponents";

export default function ApprovedApprovals({ rows }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full border-collapse">
          <thead className="border-b border-slate-200 bg-slate-50/50">
            <tr className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <th className="px-6 py-5 font-bold">Consultant</th>
              <th className="px-5 py-5 font-bold">Change Description</th>
              <th className="px-5 py-5 font-bold">Approval Date</th>
              <th className="px-5 py-5 font-bold">Approved By</th>
              <th className="px-6 py-5 text-right font-bold">Compliance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-5">
                   <div className="flex items-center gap-2">
                     <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                     <span className="text-sm font-bold text-slate-900">{row.consultant}</span>
                   </div>
                </td>
                <td className="px-5 py-5">
                   <span className="text-[13px] font-semibold text-slate-600 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">{row.change}</span>
                </td>
                <td className="px-5 py-5">
                   <div className="text-[13px] font-medium text-slate-500 font-mono">{formatDate(row.approvedOn)}</div>
                </td>
                <td className="px-5 py-5 text-sm font-bold text-slate-700">
                  {row.approvedBy}
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      type="button"
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-bold text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm active:scale-95"
                    >
                      <span className="inline-flex items-center gap-2">
                        <RotateCcw className="h-3.5 w-3.5" />
                        Rollback
                      </span>
                    </button>
                    <button
                      type="button"
                      className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-[12px] font-bold text-rose-700 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all shadow-sm active:scale-95"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Ban className="h-3.5 w-3.5" />
                        Revoke
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
