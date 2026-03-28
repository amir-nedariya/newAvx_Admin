import React from "react";
import { cls, riskBadge } from "../helpers";

const FlaggedTab = ({ rows }) => {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full border-collapse">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
              <th className="px-6 py-4 font-semibold">Consultant</th>
              <th className="px-5 py-4 font-semibold">Claim Type</th>
              <th className="px-5 py-4 font-semibold">Severity</th>
              <th className="px-5 py-4 font-semibold">Action Taken</th>
              <th className="px-6 py-4 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm font-bold text-slate-900">
                  {row.consultant}
                </td>
                <td className="px-5 py-4 text-sm text-slate-700">
                  {row.claimType}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={cls(
                      "inline-flex rounded-md border px-2.5 py-1 text-[11px] font-bold",
                      riskBadge(row.severity)
                    )}
                  >
                    {row.severity}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">
                  {row.actionTaken}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="inline-flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
                    >
                      Suspend Storefront
                    </button>
                    <button
                      type="button"
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Disable Theme
                    </button>
                    <button
                      type="button"
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Remove Banner
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
};

export default FlaggedTab;