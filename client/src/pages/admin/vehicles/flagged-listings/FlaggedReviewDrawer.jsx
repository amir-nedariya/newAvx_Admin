import React, { useEffect, useState } from "react";
import {
  X,
  ShieldAlert,
  Calendar,
  User,
  MapPin,
  CarFront,
  Phone,
  Mail,
  MoreHorizontal,
  BadgeCheck,
  Zap,
  Clock,
  ExternalLink,
  ChevronRight,
  Info,
  Loader2,
  AlertTriangle
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { getFlagReview } from "../../../../api/vehicle.api";

const cls = (...a) => a.filter(Boolean).join(" ");

export default function FlaggedReviewDrawer({ isOpen, onClose, flagId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && flagId) {
      loadData();
    }
  }, [isOpen, flagId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getFlagReview(flagId);
      setData(res.data);
    } catch (err) {
      console.error("Flag Review Fetch Error:", err);
      setError("Failed to load review details.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        {/* Drawer Panel */}
        <motion.aside
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
          className="relative flex h-full w-full max-w-[500px] flex-col border-l border-slate-200 bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/20">
                <ShieldAlert size={22} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-[20px] font-black tracking-tight text-slate-900 leading-none">Full Review Detail</h2>
                <p className="mt-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400">Moderation Investigation</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-all hover:bg-slate-900 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content Area */}
          <div className="custom-scrollbar flex-1 overflow-y-auto px-6 py-8">
            {loading ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 py-32">
                <Loader2 className="h-10 w-10 animate-spin text-slate-200" />
                <p className="text-sm font-bold text-slate-400">Fetching comprehensive records...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-rose-100 bg-rose-50/30 p-10 text-center">
                <AlertTriangle size={32} className="text-rose-500 mb-3" />
                <p className="text-sm font-black text-rose-600">{error}</p>
                <button onClick={loadData} className="mt-4 text-xs font-black uppercase tracking-widest text-rose-500 hover:underline">Retry Loading</button>
              </div>
            ) : data ? (
              <div className="space-y-8">
                {/* 1. SEVERITY & STATUS */}
                <div className="grid grid-cols-2 gap-3">
                   <StatusMetric 
                     label="Severity" 
                     value={data.severity} 
                     color={data.severity === "HIGH" ? "text-rose-600 bg-rose-50 ring-rose-100" : "text-amber-600 bg-amber-50 ring-amber-100"} 
                     icon={ShieldAlert}
                   />
                   <StatusMetric 
                     label="Resolution" 
                     value={data.isResolved ? "RESOLVED" : "UNDER REVIEW"} 
                     color={data.isResolved ? "text-emerald-600 bg-emerald-50 ring-emerald-100" : "text-sky-600 bg-sky-50 ring-sky-100"} 
                     icon={BadgeCheck}
                   />
                </div>

                {/* 2. INCIDENT NOTES */}
                <Section title="Incident Summary">
                   <div className="rounded-[24px] border border-slate-100 bg-slate-50/50 p-5">
                      <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">{data.flagCategory?.replace(/_/g, ' ')}</div>
                      <p className="text-[14px] font-bold leading-relaxed text-slate-800 italic">"{data.internalNotes}"</p>
                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                         <div className="flex items-center gap-2">
                            <Clock size={14} className="text-slate-400" />
                            <span className="text-[11px] font-bold text-slate-500">{new Date(data.flaggedAt).toLocaleString()}</span>
                         </div>
                      </div>
                   </div>
                </Section>

                {/* 3. VEHICLE PREVIEW */}
                <Section title="Vehicle Information">
                   <div className="flex items-center gap-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-slate-300">
                      <div className="h-20 w-28 shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-inner">
                         <img src={data.vehicleInfo?.thumbnailUrl} className="h-full w-full object-cover" alt="Vehicle" loading="lazy" />
                      </div>
                      <div className="flex-1 min-w-0">
                         <h4 className="truncate text-[15px] font-black tracking-tight text-slate-900">{data.vehicleInfo?.title}</h4>
                         <div className="mt-1 flex flex-wrap gap-2">
                             <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-600 uppercase tracking-tighter italic">ID: {data.vehicleInfo?.vehicleId?.slice(0, 8)}</span>
                             <span className="rounded-lg bg-indigo-50 px-2 py-0.5 text-[10px] font-black text-indigo-600 uppercase tracking-tighter italic">{data.vehicleInfo?.transmissionType}</span>
                             <span className="rounded-lg bg-amber-50 px-2 py-0.5 text-[10px] font-black text-amber-600 uppercase tracking-tighter italic">{data.vehicleInfo?.yearOfMfg}</span>
                         </div>
                         <p className="mt-2 text-[13px] font-black text-slate-900">₹{data.vehicleInfo?.price?.toLocaleString("en-IN")}</p>
                      </div>
                      <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
                         <ExternalLink size={18} />
                      </button>
                   </div>
                </Section>

                {/* 4. OWNER & CONSULTANT INFO */}
                <div className="grid grid-cols-1 gap-6">
                   <InfoCard 
                     label="Owner Information" 
                     title={data.ownerInfo?.fullName} 
                     sub={data.ownerInfo?.email} 
                     phone={data.ownerInfo?.phoneNumber} 
                     icon={User} 
                     badge={data.ownerInfo?.userRole}
                   />
                   <InfoCard 
                     label="Linked Consultant" 
                     title={data.consultantInfo?.consultationName} 
                     sub={data.consultantInfo?.tierPlanTitle} 
                     phone={data.consultantInfo?.phoneNumber} 
                     icon={Zap} 
                     badge={data.consultantInfo?.isActiveTier ? "Verified Partner" : "Inactive"}
                     badgeColor="bg-sky-50 text-sky-600"
                   />
                </div>

                {/* 5. LOCATION */}
                <Section title="Registration & Location">
                   <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                         <div className="flex items-center gap-3 text-slate-400">
                             <MapPin size={18} />
                             <span className="text-[13px] font-bold text-slate-900">{data.addressInfo?.address}, {data.addressInfo?.cityName}</span>
                         </div>
                         <div className="text-[11px] font-black uppercase tracking-widest text-slate-400">{data.addressInfo?.stateName}</div>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-50 pb-3 text-slate-400/50">
                          <div className="flex items-center gap-3">
                             <Info size={18} />
                             <span className="text-[13px] font-bold text-slate-500 uppercase tracking-widest leading-none">Registration Number</span>
                          </div>
                          <span className="text-[13px] font-black text-slate-900 leading-none">{data.vehicleInfo?.registrationNumber}</span>
                      </div>
                   </div>
                </Section>
                
                <div className="py-6" />
              </div>
            ) : null}
          </div>

          {/* Footer Actions */}
          <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-6 flex gap-3">
             <button
               onClick={onClose}
               className="flex-1 rounded-[24px] border-2 border-slate-100 bg-white py-4 text-xs font-black uppercase tracking-widest text-slate-400 transition-all hover:bg-slate-50"
             >
               Close Panels
             </button>
             <button
               className="flex-[2] rounded-[24px] bg-slate-900 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-slate-900/20 transition-all hover:bg-slate-800"
             >
               Print Safety Report
             </button>
          </div>
        </motion.aside>
      </div>
    </AnimatePresence>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
         <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">{title}</h3>
         <div className="h-[1px] flex-1 bg-slate-100" />
      </div>
      {children}
    </div>
  );
}

function StatusMetric({ label, value, color, icon: Icon }) {
  return (
    <div className={cls("flex flex-col rounded-3xl p-4 ring-1", color)}>
       <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-xl bg-white/60 shadow-sm">
          <Icon size={16} />
       </div>
       <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 leading-none">{label}</div>
       <div className="mt-1.5 text-[14px] font-black leading-none">{value}</div>
    </div>
  );
}

function InfoCard({ label, title, sub, phone, icon: Icon, badge, badgeColor }) {
  return (
    <div className="space-y-3">
       <div className="text-[11px] font-black uppercase tracking-widest text-slate-400">{label}</div>
       <div className="flex items-start gap-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
             <Icon size={24} />
          </div>
          <div className="flex-1 min-w-0">
             <div className="flex items-center justify-between gap-2">
                <h4 className="truncate text-sm font-black text-slate-900">{title}</h4>
                {badge && <span className={cls("rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-tighter", badgeColor || "bg-rose-50 text-rose-600")}>{badge}</span>}
             </div>
             <p className="mt-0.5 truncate text-[12px] font-bold text-slate-400">{sub}</p>
             <div className="mt-3 flex items-center gap-2 text-slate-900">
                <Phone size={14} className="text-slate-200" />
                <span className="text-xs font-black">{phone}</span>
             </div>
          </div>
       </div>
    </div>
  );
}
