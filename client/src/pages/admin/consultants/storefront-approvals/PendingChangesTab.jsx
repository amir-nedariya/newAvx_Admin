import React from "react";
import { Eye } from "lucide-react";
import ActionMenu from "../ActionMenu";
import { cls, formatDate, riskBadge, tierBadge } from "../helpers";

const PendingChangesTab = ({
  rows,
  openPanel,
  openDecision,
}) => {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[1100px] w-full border-collapse">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
              <th className="px-6 py-4 font-semibold">Consultant</th>
              <th className="px-5 py-4 font-semibold">Tier</th>
              <th className="px-5 py-4 font-semibold">Change Type</th>
              <th className="px-5 py-4 font-semibold">Submitted On</th>
              <th className="px-5 py-4 font-semibold">Risk</th>
              <th className="px-5 py-4 font-semibold">Preview</th>
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
                        {row.consultantName}
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
                    {row.changeType}
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

                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => openPanel(row)}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <ActionMenu
                      item={row}
                      onView={openPanel}
                      onApprove={(i) => openDecision("approve", i)}
                      onReject={(i) => openDecision("reject", i)}
                      onSendBack={(i) => openDecision("revision", i)}
                      onAudit={(i) => openDecision("audit", i)}
                      compact
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-24 text-center">
                  <div className="text-lg font-bold text-slate-900">
                    No pending changes found
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

export default PendingChangesTab;