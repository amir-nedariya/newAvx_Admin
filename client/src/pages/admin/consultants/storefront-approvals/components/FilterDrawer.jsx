import React from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { SelectField } from "./SharedComponents";

export default function FilterDrawer({
  open,
  onClose,
  tier,
  setTier,
  changeType,
  setChangeType,
  riskLevel,
  setRiskLevel,
  submissionDate,
  setSubmissionDate,
  onReset,
}) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <aside className="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-[420px] flex-col border-l border-slate-200 bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <SlidersHorizontal size={18} className="text-sky-500" />
                <h3 className="text-xl font-bold tracking-tight text-slate-900">
                  Filters
                </h3>
              </div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Refine storefront approval queue
              </p>
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
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <SelectField
              label="Tier"
              value={tier}
              onChange={setTier}
              options={[
                { label: "All Tiers", value: "" },
                { label: "Basic", value: "Basic" },
                { label: "Pro", value: "Pro" },
                { label: "Premium", value: "Premium" },
              ]}
            />

            <SelectField
              label="Change Type"
              value={changeType}
              onChange={setChangeType}
              options={[
                { label: "All Changes", value: "" },
                { label: "About", value: "About" },
                { label: "Banner", value: "Banner" },
                { label: "Badge", value: "Badge" },
                { label: "Testimonial", value: "Testimonial" },
                { label: "Media", value: "Media" },
              ]}
            />
          </div>

          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <SelectField
              label="Risk Level"
              value={riskLevel}
              onChange={setRiskLevel}
              options={[
                { label: "All Risks", value: "" },
                { label: "Low", value: "Low" },
                { label: "Moderate", value: "Moderate" },
                { label: "High", value: "High" },
              ]}
            />

            <SelectField
              label="Submission Date"
              value={submissionDate}
              onChange={setSubmissionDate}
              options={[
                { label: "Anytime", value: "" },
                { label: "Today", value: "today" },
                { label: "Last 7 days", value: "7days" },
                { label: "Custom", value: "custom" },
              ]}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-6 py-5">
          <button
            type="button"
            onClick={onReset}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all active:scale-95"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
          >
            Apply Filters
          </button>
        </div>
      </aside>
    </>
  );
}
