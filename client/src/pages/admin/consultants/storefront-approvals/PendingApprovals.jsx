import React from "react";
import { BadgeCheck, Clock, CheckCircle2, XCircle } from "lucide-react";
import { cls, tierBadge, riskBadge, formatDate } from "./components/SharedComponents";

export default function PendingApprovals({ rows }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="overflow-x-auto">
        <table className="min-w-[1000px] w-full border-collapse">
          <thead className="border-b border-slate-200 bg-slate-50/50">
            <tr className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <th className="px-6 py-5 font-bold">Consultant Account</th>
              <th className="px-5 py-5 font-bold">Tier Level</th>
              <th className="px-5 py-5 font-bold">Modification Requested</th>
              <th className="px-5 py-5 font-bold">Request Time</th>
              <th className="px-5 py-5 font-bold">Risk Level</th>
              <th className="px-6 py-5 text-right font-bold">Immediate Response</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.length ? (
              rows.map((row) => (
                <tr key={row.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div>
                      <div className="text-[14px] font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                        {row.consultant}
                      </div>
                      <div className="mt-1 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                        {row.consultantId} • {row.city}
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-5">
                    <span
                      className={cls(
                        "inline-flex rounded-lg border px-3 py-1 text-[10px] font-black uppercase shadow-sm",
                        tierBadge(row.tier)
                      )}
                    >
                      {row.tier}
                    </span>
                  </td>

                  <td className="px-5 py-5">
                     <span className="text-[13px] font-bold text-slate-700 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg">{row.change}</span>
                  </td>

                  <td className="px-5 py-5">
                    <div className="text-[13px] font-medium text-slate-500 font-mono flex items-center gap-2">
                       <Clock size={14} className="text-slate-400" />
                       {formatDate(row.submittedOn)}
                    </div>
                  </td>

                  <td className="px-5 py-5">
                    <span
                      className={cls(
                        "inline-flex rounded-lg border px-3 py-1 text-[10px] font-black uppercase shadow-sm",
                        riskBadge(row.risk)
                      )}
                    >
                      {row.risk}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        type="button"
                        className="group/btn relative rounded-xl border border-emerald-500 bg-white px-4 py-2 overflow-hidden transition-all hover:bg-emerald-600 active:scale-95 shadow-sm"
                      >
                         <span className="relative z-10 flex items-center gap-2 text-[12px] font-bold text-emerald-600 group-hover/btn:text-white transition-colors">
                           <CheckCircle2 size={16} />
                           APPROVE
                         </span>
                      </button>
                      
                      <button
                        type="button"
                        className="group/btn relative rounded-xl border border-rose-500 bg-white px-4 py-2 overflow-hidden transition-all hover:bg-rose-600 active:scale-95 shadow-sm"
                      >
                         <span className="relative z-10 flex items-center gap-2 text-[12px] font-bold text-rose-600 group-hover/btn:text-white transition-colors">
                           <XCircle size={16} />
                           REJECT
                         </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-24 text-center">
                   <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300 border border-slate-200 mb-4">
                      <BadgeCheck size={32} />
                   </div>
                  <div className="text-xl font-bold text-slate-900">
                    No Pending Approvals
                  </div>
                  <p className="mt-2 text-sm text-slate-400 font-medium">All current requests have been processed successfully.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
