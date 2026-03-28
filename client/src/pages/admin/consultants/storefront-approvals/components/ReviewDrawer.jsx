import React from "react";
import { X, FileImage, FileText, CheckCircle2, XCircle, RefreshCcw, ShieldAlert } from "lucide-react";
import { cls, formatDate, detectionBadge } from "./SharedComponents";

export default function ReviewDrawer({
  open,
  item,
  onClose,
  onApprove,
  onReject,
  onSendBack,
  onAudit,
}) {
  if (!open || !item) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-[760px] flex-col border-l border-slate-200 bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold tracking-tight text-slate-900">
                  {item.consultantName || item.consultant}
                </h3>
                {item.verified && (
                   <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-sky-500 text-white">
                     <CheckCircle2 size={12} fill="currentColor" className="text-sky-500" />
                   </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 uppercase text-[10px] tracking-widest">{item.tier}</span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <ShieldAlert size={14} className={item.systemRisk === 'High' ? 'text-rose-500' : 'text-amber-500'} />
                  Risk Score: {item.systemRisk || item.risk}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-6 bg-slate-50/50">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-sky-500" />
                  Change Type: {item.changeType || item.change}
                </div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Submitted {formatDate(item.submittedOn)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="border-b border-slate-200 p-6 md:border-b-0 md:border-r">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Old Version
                  </div>
                  <div className="h-px flex-1 mx-4 bg-slate-100" />
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 text-sm leading-7 text-slate-500 whitespace-pre-line italic">
                  {item.oldValue || "No previous value recorded"}
                </div>
              </div>

              <div className="p-6 bg-sky-50/30">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-sky-400">
                    New Version
                  </div>
                  <div className="h-px flex-1 mx-4 bg-sky-100" />
                </div>
                <div className="rounded-2xl border border-sky-100 bg-white p-5 text-sm font-medium leading-7 text-slate-800 shadow-sm shadow-sky-100/50 whitespace-pre-line">
                  {item.newValue || "No new value provided"}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div className="text-sm font-bold text-slate-900">
                Supporting Media & Assets
              </div>
              <div className="text-xs font-bold text-slate-400">{(item.supportingMedia || []).length} FILES</div>
            </div>
            <div className="flex flex-wrap gap-3">
              {(item.supportingMedia || []).map((file, i) => (
                <div
                  key={`${file.name}-${i}`}
                  className="group relative inline-flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-sky-200 hover:bg-white hover:shadow-md"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-100 text-slate-400 group-hover:text-sky-500 group-hover:border-sky-100 shadow-sm transition-colors">
                    {file.type === "image" ? (
                      <FileImage size={16} />
                    ) : (
                      <FileText size={16} />
                    )}
                  </div>
                  {file.name}
                </div>
              ))}
              {(!item.supportingMedia || item.supportingMedia.length === 0) && (
                <div className="w-full py-4 text-center text-sm font-medium text-slate-400 italic">
                  No supporting media uploaded for this change
                </div>
              )}
            </div>

            <div className="mt-8">
              <div className="mb-3 text-sm font-bold text-slate-900">
                Consultant Justification
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 text-sm leading-relaxed text-slate-600">
                {item.reasonSubmitted || "No justification provided by the consultant."}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <ShieldAlert className="h-5 w-5 text-amber-500" />
                AI Risk Assessment Panel
              </div>
              <div className={cls(
                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter",
                item.systemRisk === 'High' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
              )}>
                {item.systemRisk} RISK
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-100">
              <div className="grid grid-cols-[1fr_120px] bg-slate-50 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                <div className="px-5 py-4">Threat / Violation Type</div>
                <div className="px-5 py-4 text-right">Severity</div>
              </div>

              {(item.detections || []).map((d, idx) => (
                <div
                  key={`${d.label}-${idx}`}
                  className="grid grid-cols-[1fr_120px] items-center border-t border-slate-50 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="px-5 py-4 text-[13px] font-semibold text-slate-700">
                    {d.label}
                  </div>
                  <div className="px-5 py-4 text-right">
                    <span
                      className={cls(
                        "inline-flex rounded-full px-2.5 py-1 text-[10px] font-black border",
                        detectionBadge(d.severity)
                      )}
                    >
                      {String(d.severity).toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className={cls(
              "mt-6 rounded-2xl border p-5 shadow-sm",
              item.systemRisk === 'High' ? 'border-rose-100 bg-rose-50/30' : 'border-amber-100 bg-amber-50/30'
            )}>
              <div className={cls(
                "text-sm font-black uppercase tracking-widest mb-3 flex items-center gap-2",
                item.systemRisk === 'High' ? 'text-rose-600' : 'text-amber-600'
              )}>
                <ShieldAlert size={16} /> Key Risk Violations
              </div>
              <ul className="space-y-3">
                {(item.systemReason || []).map((r, idx) => (
                  <li key={`${r}-${idx}`} className="flex items-start gap-3">
                    <div className={cls(
                      "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                      item.systemRisk === 'High' ? 'bg-rose-400' : 'bg-amber-400'
                    )} />
                    <span className={cls(
                      "text-sm font-medium leading-relaxed",
                      item.systemRisk === 'High' ? 'text-rose-700' : 'text-amber-700'
                    )}>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-white px-8 py-5">
          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => onAudit(item)}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-5 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-100 transition-all active:scale-95"
            >
              <ShieldAlert className="h-4 w-4" />
              Flag for Audit
            </button>

            <button
              type="button"
              onClick={() => onSendBack(item)}
              className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition-all active:scale-95"
            >
              <RefreshCcw className="h-4 w-4" />
              Revision
            </button>

            <div className="h-8 w-px bg-slate-200 mx-2" />

            <button
              type="button"
              onClick={() => onReject(item)}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 transition-all active:scale-95 shadow-lg shadow-rose-100"
            >
              <XCircle className="h-4 w-4" />
              Reject
            </button>

            <button
              type="button"
              onClick={() => onApprove(item)}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-100"
            >
              <CheckCircle2 className="h-4 w-4" />
              Approve Now
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
