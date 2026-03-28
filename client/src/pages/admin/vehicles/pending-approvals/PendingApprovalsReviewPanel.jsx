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
  Clock
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
  const [activeTab, setActiveTab] = useState("comparison");

  // Mock data for demonstration - in real app, this would come from the item or an additional API call
  const comparisonData = item.submissionType === "EDITED" ? {
    old: {
      price: "₹5,00,000",
      fuel: "Petrol",
      description: "Clean Car",
      photos: 8,
    },
    new: {
      price: "₹3,50,000",
      fuel: "Diesel",
      description: "Accident Free, 100% Engine Guarantee",
      photos: 12,
    },
    changes: ["price", "fuel", "description", "photos"]
  } : null;

  const priceVal = {
    marketAvg: "₹4,80,000",
    listedPrice: "₹3,50,000",
    deviation: -27,
    status: "HIGH_DEVIATION"
  };

  const duplicates = [
    { id: "#8457", status: "Active", regNo: "DL 3C CC 1234" }
  ];

  const mediaFlags = [
    { type: "Blur Detected", count: 1 },
    { type: "WhatsApp Number Visible", count: 2 }
  ];

  const contentFlags = [
    { phrase: "100% Guarantee", risk: "MODERATE" },
    { phrase: "No Accidents Ever", risk: "HIGH" }
  ];

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
                  item.submissionType === "NEW" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
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
          <DetailItem label="Risk Score" value={item.risk} color={item.risk === "HIGH" ? "text-rose-600" : "text-emerald-600"} />
          <DetailItem label="Inspection" value={item.inspection} color="text-slate-900" />
          <DetailItem label="Previous Status" value="Pending" color="text-slate-500" />
          <DetailItem label="Boost Active" value={item.boost ? "Yes" : "No"} color={item.boost ? "text-violet-600" : "text-slate-500"} />
          <DetailItem label="SLA Remaining" value="2.4h" color="text-amber-600" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-5xl space-y-8 pb-12">
          
          {/* SECTION 1: COMPARISON */}
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-slate-900">
              <ArrowRight className="h-5 w-5 text-sky-600" />
              {item.submissionType === "EDITED" ? "Side-by-Side Comparison" : "Submission Content"}
            </h3>
            
            {item.submissionType === "EDITED" && comparisonData ? (
              <div className="grid grid-cols-2 gap-12">
                <div>
                  <div className="mb-4 inline-flex rounded-lg bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase text-slate-500">Old Version</div>
                  <div className="space-y-4">
                    {Object.entries(comparisonData.old).map(([key, val]) => (
                      <ComparisonRow key={key} label={key} value={val} />
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-4 inline-flex rounded-lg bg-sky-100 px-3 py-1 text-[11px] font-bold uppercase text-sky-600">New Version</div>
                  <div className="space-y-4">
                    {Object.entries(comparisonData.new).map(([key, val]) => (
                      <ComparisonRow 
                        key={key} 
                        label={key} 
                        value={val} 
                        isChanged={comparisonData.changes.includes(key)} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-8">
                 <ComparisonRow label="Price" value={`₹${item.price?.toLocaleString()}`} />
                 <ComparisonRow label="Registration" value={item.registrationNo} />
                 <ComparisonRow label="City" value={item.city} />
                 <ComparisonRow label="Inspection" value={item.inspection} />
              </div>
            )}
          </section>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* SECTION 2: PRICE VALIDATION */}
            <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-slate-900">
                <BadgetAlert className="h-5 w-5 text-amber-500" />
                Price Validation
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-[11px] font-bold uppercase text-slate-400">Market Average</p>
                    <p className="mt-1 text-lg font-bold text-slate-900">{priceVal.marketAvg}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-[11px] font-bold uppercase text-slate-400">Listed Price</p>
                    <p className="mt-1 text-lg font-bold text-slate-900">{priceVal.listedPrice}</p>
                  </div>
                </div>
                
                <div className={cls(
                  "flex items-center justify-between rounded-2xl p-5 border-2",
                  priceVal.deviation < -20 ? "border-rose-100 bg-rose-50" : "border-emerald-100 bg-emerald-50"
                )}>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Deviation Detection</p>
                    <p className={cls(
                      "mt-1 text-2xl font-black",
                      priceVal.deviation < 0 ? "text-rose-600" : "text-emerald-600"
                    )}>
                      {priceVal.deviation}%
                    </p>
                  </div>
                  <div className={cls(
                    "rounded-xl px-4 py-2 text-xs font-bold uppercase",
                    priceVal.deviation < -20 ? "bg-rose-600 text-white" : "bg-emerald-600 text-white"
                  )}>
                    {priceVal.deviation < -20 ? "High Deviation" : "Healthy Range"}
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 3: DUPLICATE DETECTION */}
            <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-slate-900">
                <Search className="h-5 w-5 text-sky-600" />
                Duplicate Detection
              </h3>
              {duplicates.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-4 rounded-2xl border border-rose-200 bg-rose-50 p-4">
                    <AlertTriangle className="mt-1 h-5 w-5 text-rose-500" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-rose-900">Possible Duplicate Found</p>
                      <p className="mt-1 text-xs text-rose-700">Vehicle {duplicates[0].id} is already active with registration {duplicates[0].regNo}</p>
                      <div className="mt-4 flex gap-2">
                        <button className="rounded-lg bg-rose-600 px-3 py-1.5 text-[11px] font-bold text-white transition-opacity hover:opacity-90">View Duplicate</button>
                        <button className="rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-[11px] font-bold text-rose-700 transition-colors hover:bg-rose-50">Escalate</button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-12 text-slate-400">
                  <ShieldCheck className="mb-2 h-10 w-10 text-emerald-400" />
                  <p className="text-sm font-medium text-slate-500">No duplicates detected</p>
                </div>
              )}
            </section>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
             {/* SECTION 4: MEDIA VALIDATION */}
             <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-slate-900">
                <ImageIcon className="h-5 w-5 text-violet-600" />
                Media Validation
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                  <span className="text-sm font-medium text-slate-600">Total Photos</span>
                  <span className="text-sm font-bold text-slate-900">12 Photos</span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {mediaFlags.map((flag, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50/50 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-rose-500" />
                        <span className="text-sm font-bold text-rose-700">{flag.type}</span>
                      </div>
                      <span className="text-[11px] font-black text-rose-900">{flag.count} Case(s)</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 5: CONTENT SCAN */}
            <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-slate-900">
                <FileText className="h-5 w-5 text-indigo-600" />
                Claims & Risk Scan
              </h3>
              <div className="space-y-4">
                {contentFlags.map((flag, idx) => (
                  <div key={idx} className="group relative flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 transition-all hover:border-amber-200 hover:bg-amber-50">
                    <div className="flex items-center gap-3">
                      <div className={cls(
                        "h-2 w-2 rounded-full",
                        flag.risk === "HIGH" ? "bg-rose-500" : "bg-amber-500"
                      )} />
                      <span className="text-sm font-bold text-slate-700">“{flag.phrase}”</span>
                    </div>
                    <span className={cls(
                      "rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-tight",
                      flag.risk === "HIGH" ? "bg-rose-100 text-rose-700 shadow-sm shadow-rose-200/50" : "bg-amber-100 text-amber-700"
                    )}>
                      {flag.risk} RISK
                    </span>
                  </div>
                ))}
                <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-center">
                  <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest">Description Summary</p>
                  <p className="mt-1 text-sm text-emerald-900 font-medium">Auto-scan passed with minor warnings</p>
                </div>
              </div>
            </section>
          </div>

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

function ComparisonRow({ label, value, isChanged }) {
  return (
    <div className={cls(
      "flex items-center justify-between rounded-xl px-4 py-3 transition-colors",
      isChanged ? "bg-amber-50 ring-1 ring-amber-200 shadow-sm shadow-amber-100" : "bg-slate-50"
    )}>
      <span className="text-[12px] font-bold uppercase tracking-tight text-slate-500">{label}</span>
      <span className={cls("text-sm font-bold", isChanged ? "text-amber-700" : "text-slate-900")}>
        {value}
      </span>
    </div>
  );
}

function BadgetAlert(props) {
  return <BadgeAlert {...props} />;
}
