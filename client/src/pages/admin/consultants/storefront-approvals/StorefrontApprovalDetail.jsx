import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  RefreshCcw, 
  ShieldAlert, 
  FileImage, 
  FileText,
  Clock,
  ExternalLink
} from "lucide-react";
import { cls, formatDate, detectionBadge, riskBadge } from "./components/SharedComponents";
import DecisionModal from "./components/DecisionModal";

/* =========================================================
   DUMMY DATA (Replicated from StorefrontApprovals.jsx)
========================================================= */
const DUMMY_PENDING = [
  {
    id: "SF-1001",
    consultantId: "CONS-001",
    consultantName: "Adarsh Auto Consultants",
    city: "Ahmedabad",
    tier: "Premium",
    verified: true,
    changeType: "About",
    submittedOn: "2026-03-16T08:30:00Z",
    risk: "High",
    previewLabel: "About Section Update",
    oldValue: "We deal in used cars",
    newValue:
      "India’s #1 Certified Dealer\nEngine Warranty Guaranteed\nAVX Verified Partner",
    supportingMedia: [
      { name: "Banner.jpg", type: "image" },
      { name: "Award.png", type: "image" },
    ],
    reasonSubmitted: "Updated branding and trust statement",
    detections: [
      { label: "Use of AVX logo", severity: "warning" },
      { label: "Fake Certification claim", severity: "warning" },
      { label: "Phone number in banner", severity: "blocked" },
      { label: "Warranty claim", severity: "warning" },
    ],
    systemRisk: "High",
    systemReason: [
      "Unauthorized AVX usage",
      "Warranty claim detected",
      "Possible contact info in uploaded banner",
    ],
  },
  {
    id: "SF-1002",
    consultantId: "CONS-002",
    consultantName: "Metro Wheels",
    city: "Surat",
    tier: "Pro",
    verified: true,
    changeType: "Banner",
    submittedOn: "2026-03-15T11:15:00Z",
    risk: "Moderate",
    previewLabel: "Banner Upload",
    oldValue: "Old storefront banner",
    newValue: "New premium banner with dealership branding",
    supportingMedia: [{ name: "storefront-banner.jpg", type: "image" }],
    reasonSubmitted: "Seasonal branding refresh",
    detections: [
      { label: "Promotional statement", severity: "warning" },
      { label: "No blocked contact content found", severity: "safe" },
    ],
    systemRisk: "Moderate",
    systemReason: ["Promotional language requires manual review"],
  },
];

const StorefrontApprovalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [decisionMode, setDecisionMode] = useState("");
  const [decisionReason, setDecisionReason] = useState("");
  const [decisionComment, setDecisionComment] = useState("");

  const item = useMemo(() => {
    return DUMMY_PENDING.find(x => x.id === id);
  }, [id]);

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
           <ShieldAlert size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Request Not Found</h2>
        <p className="text-slate-500 mt-2">The approval request you are looking for does not exist or has been processed.</p>
        <button 
          onClick={() => navigate(-1)}
          className="mt-6 flex items-center gap-2 text-sky-600 font-bold hover:underline"
        >
          <ArrowLeft size={18} />
          Go Back
        </button>
      </div>
    );
  }

  const openDecision = (mode) => {
    setDecisionMode(mode);
    setDecisionReason("");
    setDecisionComment("");
  };

  const closeDecision = () => {
    setDecisionMode("");
    setDecisionReason("");
    setDecisionComment("");
  };

  const handleAction = () => {
    // In a real app, this would be an API call
    alert(`Action ${decisionMode} executed for ${item.id}`);
    closeDecision();
    navigate("/admin/consultants/storefront-approvals");
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="h-12 w-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-black text-slate-900">{item.consultantName}</h1>
              {item.verified && (
                <CheckCircle2 size={18} className="text-sky-500" fill="currentColor" />
              )}
            </div>
            <div className="flex items-center gap-4 text-sm font-bold text-slate-400">
               <span className="flex items-center gap-1.5"><Clock size={14} /> ID: {item.consultantId}</span>
               <span>•</span>
               <span className="uppercase tracking-widest text-sky-600">{item.tier} PARTNER</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <button className="h-11 px-5 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
              <ExternalLink size={16} /> View Storefront
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Content Review */}
        <div className="lg:col-span-2 space-y-8">
           {/* Modification Comparison */}
           <section className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
              <div className="bg-slate-50/50 border-b border-slate-200 px-8 py-5 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
                    <span className="text-sm font-black uppercase tracking-widest text-slate-900">{item.changeType} Review</span>
                 </div>
                 <span className="text-xs font-bold text-slate-400">SUBMITTED {formatDate(item.submittedOn)}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2">
                 <div className="p-8 border-b md:border-b-0 md:border-r border-slate-100">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Original Version</div>
                    <div className="p-6 rounded-2xl bg-slate-50/50 border border-dashed border-slate-200 text-sm leading-relaxed text-slate-500 italic">
                      {item.oldValue || "No previous content found"}
                    </div>
                 </div>
                 <div className="p-8 bg-sky-50/20">
                    <div className="text-[10px] font-black text-sky-500 uppercase tracking-[0.2em] mb-4">Proposed Version</div>
                    <div className="p-6 rounded-2xl bg-white border border-sky-100 text-sm font-medium leading-relaxed text-slate-800 shadow-sm shadow-sky-100/50">
                      {item.newValue || "No new content provided"}
                    </div>
                 </div>
              </div>
           </section>

           {/* Justification & Media */}
           <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                 Supporting Information
              </h3>
              
              <div className="space-y-6">
                 <div>
                    <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Consultant Note</div>
                    <p className="text-[15px] font-medium text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100 italic">
                       "{item.reasonSubmitted || "No justification provided."}"
                    </p>
                 </div>

                 <div>
                    <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Media Assets ({(item.supportingMedia || []).length})</div>
                    <div className="flex flex-wrap gap-4">
                       {(item.supportingMedia || []).map((file, i) => (
                          <div key={i} className="group relative flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 hover:border-sky-500 hover:shadow-xl hover:shadow-sky-500/5 transition-all cursor-pointer">
                             <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 group-hover:bg-sky-50 group-hover:text-sky-600 transition-colors">
                                {file.type === 'image' ? <FileImage size={20} /> : <FileText size={20} />}
                             </div>
                             <div>
                                <div className="text-[13px] font-bold text-slate-900">{file.name}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{file.type}</div>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           </section>
        </div>

        {/* Right Column: Risk & Actions */}
        <div className="space-y-8">
           {/* Risk Card */}
           <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-lg font-bold text-slate-900">Risk Profile</h3>
                 <span className={cls(
                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em]",
                    item.risk === 'High' ? "bg-rose-100 text-rose-600 border border-rose-200" : "bg-amber-100 text-amber-600 border border-amber-200"
                 )}>
                    {item.risk} SEVERITY
                 </span>
              </div>

              <div className="space-y-4">
                 {(item.detections || []).map((d, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                       <span className="text-[13px] font-bold text-slate-700">{d.label}</span>
                       <span className={cls(
                         "px-2.5 py-1 rounded-lg text-[9px] font-black border uppercase shadow-sm",
                         detectionBadge(d.severity)
                       )}>{d.severity}</span>
                    </div>
                 ))}
              </div>

              
              
           </section>

           {/* Action Panel */}
           <section className="rounded-3xl border border-slate-900 bg-slate-900 p-8 shadow-2xl shadow-slate-200">
              <h3 className="text-lg font-bold text-white mb-8">Take Action</h3>
              
              <div className="grid grid-cols-1 gap-4">
                 <button 
                  onClick={() => openDecision("approve")}
                  className="h-14 flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 text-white font-black text-sm hover:bg-emerald-600 transition-all active:scale-95 shadow-xl shadow-emerald-500/20"
                >
                    <CheckCircle2 size={18} /> APPROVE CHANGES
                 </button>

                 <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => openDecision("revision")}
                      className="h-14 flex flex-col items-center justify-center rounded-2xl bg-white/10 text-white font-black text-[10px] hover:bg-white/20 transition-all active:scale-95"
                    >
                       <RefreshCcw size={16} className="mb-1 text-sky-400" /> REVISION
                    </button>
                    <button 
                      onClick={() => openDecision("audit")}
                      className="h-14 flex flex-col items-center justify-center rounded-2xl bg-white/10 text-white font-black text-[10px] hover:bg-white/20 transition-all active:scale-95"
                    >
                       <ShieldAlert size={16} className="mb-1 text-amber-400" /> FLAG AUDIT
                    </button>
                 </div>

                 <button 
                  onClick={() => openDecision("reject")}
                  className="h-14 flex items-center justify-center gap-2 rounded-2xl bg-rose-600 text-white font-black text-sm hover:bg-rose-700 transition-all active:scale-95"
                >
                    <XCircle size={18} /> REJECT SUBMISSION
                 </button>
              </div>

              <p className="mt-8 text-center text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                 Actions are logged & tracked
              </p>
           </section>
        </div>
      </div>

      <DecisionModal
        open={!!decisionMode}
        mode={decisionMode}
        item={item}
        reason={decisionReason}
        comment={decisionComment}
        setReason={setDecisionReason}
        setComment={setDecisionComment}
        onClose={closeDecision}
        onConfirm={handleAction}
      />
    </div>
  );
};

export default StorefrontApprovalDetail;
