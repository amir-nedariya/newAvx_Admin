import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  MessageSquareWarning,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Image as ImageIcon,
  FileText,
  BadgeAlert,
  Search,
  Zap,
  Clock,
  TrendingDown,
  AlertCircle,
  CheckCircle
} from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

export default function PendingApprovalsReviewPanel({
  item,
  onClose,
  onApprove,
  onReject,
  onRequestChanges,
  onEscalate,
}) {
  return (
    <div className="flex h-full flex-col bg-slate-50">
      {/* HEADER */}
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white px-8 py-5 shadow-sm">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 overflow-hidden rounded-xl border border-slate-200 shadow-sm">
              <img src={item.thumb} alt="" className="h-full w-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{item.title}</h2>
                <span className={cls(
                  "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider",
                  item.submissionType === "NEW" ? "bg-emerald-100 text-emerald-700" :
                    item.submissionType === "REACTIVATION" ? "bg-amber-100 text-amber-700" :
                      "bg-blue-100 text-blue-700"
                )}>
                  {item.submissionType}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-500">
                Vehicle ID: <span className="text-slate-900">{item.id}</span> • Consultant: <span className="text-slate-900">{item.consultant}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onApprove(item)}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95"
            >
              <CheckCircle2 size={18} />
              Approve
            </button>
            <button
              onClick={() => onReject(item)}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 text-sm font-bold text-rose-700 transition-all hover:bg-rose-100 active:scale-95"
            >
              <XCircle size={18} />
              Reject
            </button>
            <button
              onClick={() => onRequestChanges(item)}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 active:scale-95"
            >
              <MessageSquareWarning size={18} />
              Changes
            </button>
            <button
              onClick={() => onEscalate(item)}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 text-sm font-bold text-amber-700 transition-all hover:bg-amber-100 active:scale-95"
            >
              <ShieldAlert size={18} />
              Escalate
            </button>
          </div>
        </div>

        {/* DETAILS STRIP */}
        <div className="mt-5 flex flex-wrap items-center gap-6 border-t border-slate-100 pt-4">
          <DetailItem label="Risk Score" value={item.risk} color={item.risk === "HIGH" ? "text-rose-600" : item.risk === "MODERATE" ? "text-amber-600" : "text-emerald-600"} />
          <DetailItem label="Inspection" value={item.inspection.replace(/_/g, " ")} color="text-slate-900" />
          <DetailItem label="Tier" value={item.tier} color="text-violet-600" />
          <DetailItem label="Boost Active" value={item.boost ? "Yes" : "No"} color={item.boost ? "text-violet-600" : "text-slate-500"} />
          <DetailItem label="SLA" value={`${item.submittedAtHours.toFixed(1)}h / ${item.slaHours}h`} color={item.submittedAtHours > item.slaHours ? "text-rose-600" : "text-emerald-600"} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-6xl space-y-6 pb-12">

          {/* ROW 1: SUBMISSION CONTENT & PRICE VALIDATION */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* SUBMISSION CONTENT */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50">
                  <FileText className="h-4 w-4 text-sky-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Submission Content</h3>
              </div>

              <div className="space-y-3">
                <InfoRow label="MAKE" value={item.__raw?.makerName || "-"} />
                <InfoRow label="MODEL" value={item.__raw?.modelName || "-"} />
                <InfoRow label="YEAR" value={item.__raw?.yearOfMfg || "-"} />
                <InfoRow label="CITY" value={item.city} />
                <InfoRow label="INSPECTION" value={item.inspection.replace(/_/g, " ")} />
              </div>
            </section>

            {/* PRICE VALIDATION */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
                  <TrendingDown className="h-4 w-4 text-amber-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Price Validation</h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Market Average</p>
                    <p className="mt-1.5 text-lg font-bold text-slate-900">₹4,80,000</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Listed Price</p>
                    <p className="mt-1.5 text-lg font-bold text-slate-900">₹{item.price?.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl border-2 border-rose-100 bg-rose-50 p-4">
                  <div>
                    <p className="text-xs font-bold text-slate-600">Deviation Detection</p>
                    <p className="mt-1 text-2xl font-black text-rose-600">-27%</p>
                  </div>
                  <div className="rounded-lg bg-rose-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                    High Deviation
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ROW 2: DUPLICATE DETECTION & MEDIA VALIDATION */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* DUPLICATE DETECTION */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50">
                  <Search className="h-4 w-4 text-rose-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Duplicate Detection</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-rose-900">Possible Duplicate Found</p>
                    <p className="mt-1 text-xs text-rose-700">
                      Vehicle <span className="font-bold">#8457</span> is already active with registration <span className="font-bold">DL 3C CC 1234</span>
                    </p>
                    <div className="mt-3 flex gap-2">
                      <button className="rounded-lg bg-rose-600 px-3 py-1.5 text-[11px] font-bold text-white transition-all hover:bg-rose-700 active:scale-95">
                        View Duplicate
                      </button>
                      <button className="rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-[11px] font-bold text-rose-700 transition-all hover:bg-rose-50 active:scale-95">
                        Escalate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* MEDIA VALIDATION */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50">
                  <ImageIcon className="h-4 w-4 text-violet-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Media Validation</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm font-medium text-slate-600">Total Photos</span>
                  <span className="text-sm font-bold text-slate-900">12 Photos</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-rose-500" />
                      <span className="text-sm font-bold text-rose-700">Blur Detected</span>
                    </div>
                    <span className="text-xs font-black text-rose-900">1 Media</span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-rose-500" />
                      <span className="text-sm font-bold text-rose-700">WhatsApp Number Visible</span>
                    </div>
                    <span className="text-xs font-black text-rose-900">2 Media</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ROW 3: CLAIMS & RISK SCAN */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
                <ShieldAlert className="h-4 w-4 text-indigo-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Claims & Risk Scan</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-sm font-bold text-amber-700">"100% Guarantee"</span>
                </div>
                <span className="rounded-lg bg-amber-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-tight text-amber-700">
                  Moderate
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-rose-500" />
                  <span className="text-sm font-bold text-rose-700">"No Accidents Ever"</span>
                </div>
                <span className="rounded-lg bg-rose-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-tight text-rose-700">
                  High Risk
                </span>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">AI Description Summary</p>
                <p className="mt-1 text-sm font-medium text-slate-700">Auto-scan passed with minor warnings</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value, color }) {
  return (
    <div className="flex items-center gap-2 border-r border-slate-100 pr-6 last:border-0">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
      <span className={cls("text-sm font-extrabold", color)}>{value}</span>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
      <span className="text-sm font-bold text-slate-900">{value || "-"}</span>
    </div>
  );
}
