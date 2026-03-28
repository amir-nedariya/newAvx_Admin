import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  ShieldCheck,
  User,
  Clock,
  Car,
  Tag,
  MessageSquare,
  AlertTriangle,
  History,
  Info,
  ExternalLink,
  Ban,
  Slash,
  CheckCircle2,
  FileSearch,
  Zap,
  Phone,
  Scale,
  CalendarDays,
  Scan,
  MessageCircle,
  AlertCircle,
  Eye,
  TrendingDown,
  X,
  ChevronRight,
  Copy,
  Map
} from "lucide-react";

const cls = (...a) => a.filter(Boolean).join(" ");

export default function FlaggedListingsReviewDrawer({
  item,
  isOpen,
  onClose,
  onSuspend,
  onEscalate,
  onClear,
  onApplyPenalty
}) {
  if (!item) return null;

  const riskColor = (risk) => {
    if (risk === "High") return "text-rose-600 bg-rose-50 border-rose-100";
    if (risk === "Moderate") return "text-amber-600 bg-amber-50 border-amber-100";
    return "text-emerald-600 bg-emerald-50 border-emerald-100";
  };

  return (
    <div className="fixed inset-0 z-[120] flex justify-end">
      {/* OVERLAY */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose} 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
      />
      
      {/* DRAWER */}
      <motion.aside 
        initial={{ x: "100%" }} 
        animate={{ x: 0 }} 
        exit={{ x: "100%" }} 
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
        className="relative flex h-full w-full max-w-6xl flex-col bg-slate-50 shadow-2xl overflow-hidden"
      >
        {/* HEADER */}
        <header className="z-10 bg-white px-8 py-6 border-b border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <X size={20} />
              </button>
              <div className="h-6 w-px bg-slate-200" />
              <div className="flex items-center gap-2">
                <ShieldAlert size={18} className="text-rose-600" />
                <h2 className="text-xl font-black text-slate-900 tracking-tight">FLAG REVIEW DETAIL PAGE</h2>
              </div>
            </div>
            <div className="flex items-center gap-3">
               <HeaderActionBtn label="Suspend" icon={Ban} color="bg-rose-600" onClick={() => onSuspend?.(item)} />
               <HeaderActionBtn label="Escalate" icon={AlertTriangle} color="bg-amber-600" onClick={() => onEscalate?.(item)} />
               <HeaderActionBtn label="Clear Flag" icon={CheckCircle2} color="bg-emerald-600" onClick={() => onClear?.(item)} />
               <HeaderActionBtn label="Apply Penalty" icon={Scale} color="bg-slate-900" onClick={() => onApplyPenalty?.(item)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-end">
            <div className="space-y-2">
               <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Reference ID</div>
               <h1 className="text-3xl font-black tracking-tighter text-slate-900">{item.id}</h1>
               <div className="flex items-center gap-2">
                 <span className={cls("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider", riskColor(item.risk))}>
                   <AlertCircle size={10} /> {item.risk} Risk
                 </span>
                 <span className="inline-flex rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] font-black uppercase text-slate-600">
                   {item.status}
                 </span>
               </div>
            </div>

            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-sky-50 text-sky-600 shadow-sm border border-sky-100">
                    <User size={20} />
                  </div>
                  <div>
                     <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Consultant</div>
                     <div className="text-[14px] font-black text-slate-900 leading-tight">{item.consultant}</div>
                     <div className="text-[10px] font-black text-sky-500 uppercase tracking-tighter">{item.tier} Tier</div>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                     <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Inspection</div>
                     <div className="text-[13px] font-black text-slate-900">{item.inspectionStatus}</div>
                  </div>
               </div>
            </div>

            <div className="space-y-4">
               <div className="flex items-center gap-2">
                  <HeaderStatBox label="Inquiries" value={item.inquiries} />
                  <HeaderStatBox label="Complaints" value={item.totalComplaints} color="text-rose-600" />
               </div>
            </div>

            <div className="flex justify-end lg:pb-1">
               {item.boostActive && (
                 <div className="flex items-center gap-2 text-violet-600 font-extrabold text-[10px] uppercase bg-violet-50 px-4 py-2 rounded-2xl border border-violet-100 shadow-sm shadow-violet-100/50">
                    <Zap size={14} fill="currentColor" /> Boost Active
                 </div>
               )}
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-8 py-10 md:px-12 bg-slate-50/50 scroll-smooth">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              
              <div className="xl:col-span-8 space-y-8">
                {/* SECTION 1 — FLAG DETAILS */}
                <ContentSection title="SECTION 1 — FLAG DETAILS" icon={ShieldAlert}>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                      <MetaBit label="Flag Source" value={item.flagSource} />
                      <MetaBit label="Category" value={item.flagCategory} />
                      <MetaBit label="Reported On" value={item.dateFlagged} />
                      <MetaBit label="Reference" value={item.buyerId !== "-" ? `ID: ${item.buyerId}` : "System Analytics"} />
                   </div>
                   
                   <div className="group relative p-8 rounded-[36px] bg-slate-900 text-white shadow-2xl overflow-hidden transition-all hover:bg-slate-800">
                      <div className="absolute -top-6 -right-6 opacity-5 transition-transform duration-700 group-hover:scale-125 group-hover:-rotate-12"><MessageSquare size={160} /></div>
                      <div className="relative z-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Initial Flag Comment / Evidence</div>
                      <p className="relative z-10 text-xl font-bold leading-relaxed italic opacity-90 first-letter:text-3xl first-letter:font-black">
                         "{item.comment || item.flagReason}"
                      </p>
                      
                      {item.autoFlag !== "-" && (
                        <div className="mt-8 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 relative z-10">
                           <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                              <Scan size={18} className="text-violet-400" />
                              <div className="text-[11px] font-black uppercase tracking-wider text-violet-200">Auto-Detection: <span className="text-white">{item.autoFlag}</span></div>
                           </div>
                           <div className="flex items-center gap-3">
                              <div className="text-[11px] font-black uppercase tracking-wider text-sky-400">Match Found: {item.detectedListing}</div>
                              <button className="h-8 w-8 flex items-center justify-center bg-sky-500 rounded-lg text-white hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/20">
                                 <ExternalLink size={14} />
                              </button>
                           </div>
                        </div>
                      )}
                   </div>
                </ContentSection>

                {/* SECTION 2 — VEHICLE SNAPSHOT */}
                <ContentSection title="SECTION 2 — VEHICLE SNAPSHOT" icon={Car}>
                   <div className="flex flex-col md:flex-row gap-8">
                      <div className="w-full md:w-80 shrink-0">
                         <div className="relative aspect-[4/3] rounded-[40px] overflow-hidden border-4 border-white shadow-2xl group cursor-pointer">
                            <img src={item.thumb} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-bottom p-8 flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                               <button className="flex items-center justify-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-2xl text-[12px] font-black uppercase tracking-widest shadow-xl">
                                  <Eye size={16} /> Full Inspection
                               </button>
                            </div>
                            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black text-white border border-white/10 uppercase">
                               +14 Photos
                            </div>
                         </div>
                      </div>
                      <div className="flex-1 space-y-6 flex flex-col justify-center">
                         <div>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">{item.title}</h3>
                            <div className="flex items-center gap-3 mt-2">
                               <div className="text-3xl font-black text-sky-600 tracking-tighter">{item.price}</div>
                               <div className="h-4 w-px bg-slate-200" />
                               <div className="text-sm font-bold text-slate-400">Fair Price Match</div>
                            </div>
                         </div>
                         <div className="flex flex-wrap gap-2">
                           {item.specs.map(s => (
                             <div key={s} className="bg-slate-50 px-4 py-2.5 rounded-2xl text-[11px] font-black text-slate-500 border border-slate-100 flex items-center gap-2 uppercase tracking-tighter shadow-sm">
                               <div className="h-1.5 w-1.5 rounded-full bg-sky-500" /> {s}
                             </div>
                           ))}
                         </div>
                         <p className="text-sm font-medium text-slate-400 leading-relaxed line-clamp-3 italic">
                            {item.description}
                         </p>
                      </div>
                   </div>
                </ContentSection>

                {/* SECTION 4 — INQUIRY & CHAT REVIEW */}
                <ContentSection title="SECTION 4 — INQUIRY & CHAT REVIEW" icon={MessageCircle}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <ViolationCard 
                          title="Attempted phone number sharing" 
                          content="Hey, call me on nine eight two..." 
                          time="12 Feb, 3:45 PM" 
                          variant="violation" 
                       />
                       <ViolationCard 
                          title="Direct payment solicitation" 
                          content="If you pay token directly to my bank..." 
                          time="14 Feb, 10:20 AM" 
                          variant="risk" 
                       />
                    </div>
                </ContentSection>
              </div>

              <div className="xl:col-span-4 space-y-8">
                {/* SECTION 3 — SYSTEM ANALYSIS PANEL */}
                <div className="bg-white rounded-[48px] border border-slate-200 p-8 shadow-2xl shadow-slate-200/40 relative overflow-hidden group">
                   <div className="absolute -top-10 -right-10 opacity-5 text-slate-900 transition-transform duration-700 group-hover:scale-125"><Zap size={200} /></div>
                   <div className="flex items-center gap-4 mb-8 relative z-10">
                      <div className="h-14 w-14 flex items-center justify-center rounded-[24px] bg-slate-900 text-white shadow-xl shadow-slate-900/20">
                         <Zap size={28} />
                      </div>
                      <div>
                         <h3 className="text-lg font-black tracking-tighter text-slate-900 uppercase leading-none">SYSTEM ANALYSIS</h3>
                         <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Calculated Risks</div>
                      </div>
                   </div>
                   
                   <div className="space-y-3 relative z-10">
                      <AnalysisRowBit label="Price Deviation" value={item.priceDeviation} risk={Math.abs(parseInt(item.priceDeviation)) > 30} icon={TrendingDown} />
                      <AnalysisRowBit label="Duplicate Found" value={item.duplicateDetected} risk={item.duplicateDetected === "YES"} icon={Copy} />
                      <AnalysisRowBit label="IP Anomaly" value={item.ipAnomaly} risk={item.ipAnomaly === "YES"} icon={Map} />
                      <AnalysisRowBit label="Inspection Valid" value={item.inspectionValid === "YES" ? "VALID" : "INVALID"} risk={item.inspectionValid === "NO"} icon={ShieldCheck} />
                      <AnalysisRowBit label="Chat Violation" value={item.chatFlags ? "YES" : "NO"} risk={!!item.chatFlags} icon={MessageSquare} />
                      <AnalysisRowBit label="Complaint Count" value={item.complaintCount} risk={item.complaintCount > 2} icon={AlertTriangle} />
                   </div>
                </div>

                {/* SECTION 5 — CONSULTANT HISTORY */}
                <div className="bg-white rounded-[48px] border border-slate-200 p-8 shadow-2xl shadow-slate-200/40 relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 opacity-5 text-slate-900 transition-transform duration-700 group-hover:scale-125"><History size={200} /></div>
                    <div className="flex items-center gap-4 mb-8 relative z-10">
                      <div className="h-14 w-14 flex items-center justify-center rounded-[24px] bg-slate-100 text-slate-900 shadow-inner">
                         <History size={28} />
                      </div>
                      <div>
                         <h3 className="text-lg font-black tracking-tighter text-slate-900 uppercase leading-none">CONSULTANT HISTORY</h3>
                         <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Queue History</div>
                      </div>
                   </div>
                   
                   <div className="space-y-6 relative z-10 px-2">
                      <HistoryStatItem label="Total Disputes" value={item.consultantHistory.totalDisputes} />
                      <HistoryStatItem label="Previous Flags" value={item.consultantHistory.previousFlags} />
                      <HistoryStatItem label="Ranking Penalties" value={item.consultantHistory.rankingPenalties} />
                      <HistoryStatItem label="Tampering History" value={item.consultantHistory.tamperingHistory} color={item.consultantHistory.tamperingHistory === "Yes" ? "text-rose-600" : "text-emerald-500"} />
                   </div>
                   
                   <button className="mt-8 w-full group/btn relative overflow-hidden rounded-[24px] bg-slate-50 py-5 text-xs font-black uppercase tracking-[0.2em] text-slate-600 hover:text-sky-600 transition-all border border-slate-100">
                      <span className="relative z-10 flex items-center justify-center gap-2">View Full Profile <ChevronRight size={14} /></span>
                      <div className="absolute inset-0 bg-sky-50 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                   </button>
                </div>
              </div>

            </div>
        </div>
      </motion.aside>
    </div>
  );
}

function ContentSection({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-[48px] border border-slate-200 p-10 shadow-2xl shadow-slate-200/10">
       <div className="flex items-center gap-4 mb-10">
          <div className="h-12 w-12 flex items-center justify-center rounded-[20px] bg-slate-50 text-slate-400 shadow-inner">
             <Icon size={24} />
          </div>
          <h3 className="text-xl font-black tracking-tighter text-slate-900 uppercase">{title}</h3>
       </div>
       {children}
    </div>
  );
}

function HeaderStatBox({ label, value, color = "text-slate-900" }) {
  return (
    <div className="bg-slate-50 rounded-[24px] p-5 border border-slate-100 min-w-[120px] shadow-sm">
      <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5">{label}</div>
      <div className={cls("text-2xl font-black leading-none tracking-tighter", color)}>{value}</div>
    </div>
  );
}

function MetaBit({ label, value }) {
  return (
    <div>
      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">{label}</div>
      <div className="text-[15px] font-black text-slate-900 leading-tight">{value}</div>
    </div>
  );
}

function AnalysisRowBit({ label, value, risk, icon: Icon }) {
  return (
    <div className="flex items-center justify-between p-4.5 rounded-[20px] bg-slate-50/50 border border-slate-100 group hover:border-sky-100 hover:bg-white transition-all duration-300 px-5 py-4">
       <div className="flex items-center gap-4">
          <Icon size={18} className="text-slate-300 group-hover:text-sky-500 transition-colors" />
          <span className="text-[13px] font-bold text-slate-500 group-hover:text-slate-700">{label}</span>
       </div>
       <span className={cls("text-[14px] font-black uppercase tracking-wider", risk ? "text-rose-600" : "text-emerald-500")}>
          {value}
       </span>
    </div>
  );
}

function HistoryStatItem({ label, value, color = "text-slate-900" }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100/50 pb-4 last:border-0 last:pb-0">
       <span className="text-[14px] font-bold text-slate-500">{label}</span>
       <span className={cls("text-xl font-black tracking-tighter", color)}>{value}</span>
    </div>
  );
}

function ViolationCard({ title, content, time, variant }) {
  const isViolation = variant === "violation";
  return (
    <div className={cls("p-8 rounded-[40px] border transition-all duration-300 hover:shadow-xl", isViolation ? "bg-rose-50 border-rose-100 shadow-rose-100/30" : "bg-amber-50 border-amber-100 shadow-amber-100/30")}>
       <div className="flex items-center justify-between mb-6">
          <span className={cls("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border bg-white shadow-sm", isViolation ? "text-rose-600 border-rose-100" : "text-amber-600 border-amber-100")}>
            {isViolation ? "Violation Detected" : "Major deal risk"}
          </span>
          <span className="text-[11px] font-bold text-slate-400">{time}</span>
       </div>
       <div className="text-xl font-black text-slate-900 mb-3 tracking-tight">{title}</div>
       <p className="text-sm font-bold text-slate-500 italic opacity-80 border-l-2 pl-4 border-slate-200">"{content}"</p>
       <div className="mt-8 flex items-center gap-3">
          <button className="flex-1 py-3.5 rounded-[20px] bg-white text-[11px] font-black uppercase tracking-widest text-slate-700 hover:bg-slate-900 hover:text-white transition-all shadow-sm border border-slate-200/50">Send Warning</button>
          <button className={cls("flex-1 py-3.5 rounded-[20px] text-[11px] font-black uppercase tracking-widest transition-all shadow-lg", isViolation ? "bg-rose-600 text-white hover:bg-rose-700 shadow-rose-600/20" : "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/20")}>Freeze Chat</button>
       </div>
    </div>
  );
}

function HeaderActionBtn({ label, icon: Icon, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cls(
        "flex items-center gap-3 rounded-[20px] px-6 py-3.5 text-[12px] font-black uppercase tracking-widest text-white shadow-2xl transition-all hover:scale-[1.05] active:scale-[0.95] group",
        color
      )}
    >
      <Icon size={18} className="group-hover:rotate-12 transition-transform" />
      {label}
    </button>
  );
}