import React from "react";
import { cls, formatDate, riskBadge, tierBadge } from "../helpers";

const PendingApprovalsTab = ({ rows }) => {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[1000px] w-full border-collapse">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
              <th className="px-6 py-4 font-semibold">Consultant</th>
              <th className="px-5 py-4 font-semibold">Tier</th>
              <th className="px-5 py-4 font-semibold">Change</th>
              <th className="px-5 py-4 font-semibold">Submitted On</th>
              <th className="px-5 py-4 font-semibold">Risk</th>
              <th className="px-6 py-4 text-right font-semibold">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.length ? (
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-[14px] font-bold text-slate-900">
                        {row.consultant}
                      </div>
                      <div className="mt-1 text-[12px] text-slate-500">
                        {row.consultantId} • {row.city}
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={cls(
                        "inline-flex rounded-md border px-2.5 py-1 text-[11px] font-bold",
                        tierBadge(row.tier)
                      )}
                    >
                      {row.tier}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-[13px] font-medium text-slate-700">
                    {row.change}
                  </td>

                  <td className="px-5 py-4 text-[13px] text-slate-600">
                    {formatDate(row.submittedOn)}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={cls(
                        "inline-flex rounded-md border px-2.5 py-1 text-[11px] font-bold",
                        riskBadge(row.risk)
                      )}
                    >
                      {row.risk}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        type="button"
                        className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-24 text-center">
                  <div className="text-lg font-bold text-slate-900">
                    No pending approvals found
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default PendingApprovalsTab;