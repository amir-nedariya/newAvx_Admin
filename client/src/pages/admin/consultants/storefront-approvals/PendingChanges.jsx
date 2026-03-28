import React from "react";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cls, tierBadge, riskBadge, formatDate, ActionMenu } from "./components/SharedComponents";

export default function PendingChanges({ rows, openDecision }) {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="overflow-x-auto">
        <table className="min-w-[1100px] w-full border-collapse">
          <thead className="border-b border-slate-200 bg-slate-50/50">
            <tr className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <th className="px-6 py-5 font-bold">Consultant Profile</th>
              <th className="px-5 py-5 font-bold">Account Tier</th>
              <th className="px-5 py-5 font-bold">Mod Type</th>
              <th className="px-5 py-5 font-bold">Submission Time</th>
              <th className="px-5 py-5 font-bold">Threat Assessment</th>
              <th className="px-5 py-5 font-bold">Review</th>
              <th className="px-6 py-5 text-right font-bold">Quick Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.length ? (
              rows.map((row) => (
                <tr key={row.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-sky-50 text-sky-600 border border-sky-100 font-bold text-sm">
                        {row.consultantName?.charAt(0) || "C"}
                      </div>
                      <div>
                        <div className="text-[14px] font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                          {row.consultantName}
                        </div>
                        <div className="mt-1 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                          {row.consultantId} • {row.city}
                        </div>
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
                    <div className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                      {row.changeType}
                    </div>
                  </td>

                  <td className="px-5 py-5">
                    <div className="text-[13px] font-medium text-slate-500">
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

                  <td className="px-5 py-5">
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/consultants/storefront-approvals/${row.id}`)}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-bold text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm active:scale-95"
                    >
                      <Eye size={16} />
                      Analyze
                    </button>
                  </td>

                  <td className="px-6 py-5 text-right">
                    <ActionMenu
                      item={row}
                      onView={(i) => navigate(`/admin/consultants/storefront-approvals/${i.id}`)}
                      onApprove={(i) => openDecision("approve", i)}
                      onReject={(i) => openDecision("reject", i)}
                      onSendBack={(i) => openDecision("revision", i)}
                      onAudit={(i) => openDecision("audit", i)}
                      compact
                    />
                  </td>
                </tr>
              ) )
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-24 text-center">
                   <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300 border border-slate-200 mb-4">
                      <Eye size={32} />
                   </div>
                  <div className="text-xl font-bold text-slate-900">
                    Queue is Empty
                  </div>
                  <p className="mt-2 text-sm text-slate-400 font-medium">No pending changes require your attention at this moment.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
