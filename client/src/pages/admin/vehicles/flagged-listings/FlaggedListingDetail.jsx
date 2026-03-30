import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
  User,
  Clock,
  Car,
  MapPin,
  IndianRupee,
  MessageSquare,
  AlertTriangle,
  FileText,
  History,
  Info,
  ExternalLink,
  Ban,
  CheckCircle2,
  Calendar,
  Building2,
  Phone,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Loader2,
  Zap,
  Mail,
  Scale,
  Activity,
  UserCheck,
  Eye,
  MoreHorizontal
} from "lucide-react";
import { toast } from "react-hot-toast";
import { getFlagReview, suspendVehicle, clearFlaggedVehicle } from "../../../../api/vehicle.api";
import FlaggedListingsConfirmModal from "./FlaggedListingsConfirmModal";

const cls = (...a) => a.filter(Boolean).join(" ");

export default function FlaggedListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getFlagReview(id);
      setData(res.data);
    } catch (err) {
      console.error("Flag Review Fetch Error:", err);
      setError("Failed to load investigation data.");
    } finally {
      setLoading(false);
    }
  };

  const handleActionConfirm = async (payload) => {
    if (!data) return;
    try {
      setActionLoading(true);
      const vehicleId = data.vehicleInfo?.vehicleId;
      const flagId = data.flagReviewId;

      if (payload.type === "suspend") {
        await suspendVehicle({
          vehicleId,
          reason: payload.meta?.reason || payload.reason,
          suspendType: (payload.meta?.suspensionType || "TEMPORARY").toUpperCase(),
          suspendUntil: payload.meta?.date
        });
        toast.success("Vehicle suspended successfully");
      } else if (payload.type === "clear") {
        const clearanceReason = payload.meta?.reason || "No violation found";
        await clearFlaggedVehicle({ flagId, reason: clearanceReason });
        toast.success("Flag cleared successfully");
      }
      
      setModal(null);
      loadData(); // REFRESH DATA
    } catch (err) {
      console.error("Moderation error:", err);
      toast.error(err?.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-slate-200" />
        <p className="text-sm font-black uppercase tracking-widest text-slate-400">Loading Investigation Suite...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center p-20 text-center">
        <AlertCircle size={64} className="mb-6 text-rose-500 opacity-20" />
        <h2 className="text-2xl font-black text-slate-900 mb-2">Missing Record</h2>
        <p className="text-slate-500 font-bold max-w-sm mb-8">{error || "This flag review record could not be retrieved from the central operations database."}</p>
        <button 
          onClick={() => navigate("/admin/vehicles/flagged-listings")} 
          className="rounded-2xl bg-slate-900 px-8 py-3.5 text-xs font-black uppercase tracking-widest text-white transition-all active:scale-95 shadow-lg shadow-slate-900/20"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] pb-24 font-sans text-slate-900">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
        * { font-family: 'Outfit', sans-serif; }
      `}</style>

      {/* STICKY TOP NAVIGATION BAR */}
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => navigate("/admin/vehicles/flagged-listings")} 
              className="group flex h-12 w-12 items-center justify-center rounded-[20px] bg-slate-50 border border-slate-200 text-slate-400 transition-all hover:bg-slate-900 hover:text-white hover:border-slate-900 translate-y-0 active:scale-90"
            >
              <ArrowLeft size={22} strokeWidth={2.5} />
            </button>
            <div>
              <div className="flex items-center gap-3 mb-1.5">
                <span className={cls(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border shadow-sm",
                  data.severity === "HIGH" ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-amber-50 text-amber-700 border-amber-100"
                )}>
                  {data.severity} Risk Warning
                </span>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest opacity-60">ID: {data.flagReviewId?.slice(0, 12)}</span>
              </div>
              <h1 className="text-[26px] font-black tracking-tight text-slate-900 leading-none">{data.vehicleInfo?.title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <ActionButton 
               icon={Ban} 
               label="Suspend Listing" 
               color="bg-rose-600 text-white shadow-rose-900/20" 
               onClick={() => setModal({ type: 'suspend', title: 'Suspend Vehicle Listing' })} 
             />
             <ActionButton 
               icon={CheckCircle2} 
               label="Clear All Flags" 
               color="bg-emerald-600 text-white shadow-emerald-900/20" 
               onClick={() => setModal({ type: 'clear', title: 'Clear Reporting Flags' })} 
             />
             <div className="w-[1px] h-10 bg-slate-200 ml-2 mr-2" />
             <button className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-white border border-slate-200 text-slate-500 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                <MoreHorizontal size={22} />
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 mt-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* MAIN COLUMN (LEFT 8) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* 1. INCIDENT REPORT CARD */}
            <div className="relative overflow-hidden rounded-[40px] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200/40">
               <div className="absolute top-0 right-0 p-8">
                  <Activity size={120} className="text-slate-50 opacity-10 rotate-12" />
               </div>
               
               <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-[24px] bg-slate-900 text-white shadow-xl shadow-slate-900/20">
                      <ShieldAlert size={28} />
                    </div>
                    <div>
                      <h2 className="text-[20px] font-black tracking-tight text-slate-900">Incident Intelligence</h2>
                      <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Detailed Violation Analysis</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    <SpecItem label="Policy Category" value={data.flagCategory?.replace(/_/g, ' ')} icon={Info} bold />
                    <SpecItem label="Risk Profile" value={`${data.severity} SEVERITY`} icon={ShieldAlert} highlight={data.severity === "HIGH"} />
                    <SpecItem label="Detection Node" value="AUTOMATED FRAUD MONITOR" icon={Zap} />
                    <SpecItem label="Incident Timestamp" value={new Date(data.flaggedAt).toLocaleString()} icon={Clock} />
                  </div>

                  <div className="rounded-[32px] border border-slate-100 bg-slate-50/50 p-8">
                     <div className="mb-4 flex items-center gap-3">
                        <FileText size={16} className="text-slate-400" />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Administrator / System Notes</span>
                     </div>
                     <p className="text-[17px] font-bold leading-[1.6] text-slate-800 italic">
                       "{data.internalNotes || "No specific investigator notes provided for this observation."}"
                     </p>
                  </div>
               </div>
            </div>

            {/* 2. VEHICLE SPECS GRID */}
            <div>
               <SectionHeader title="Vehicle Specifications" icon={Car} />
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <MetricCard label="Registration" value={data.vehicleInfo?.registrationNumber} icon={Info} />
                  <MetricCard label="Market Valuation" value={`₹${data.vehicleInfo?.price?.toLocaleString("en-IN")}`} icon={IndianRupee} color="text-indigo-600" />
                  <MetricCard label="Inspection Rating" value={data.vehicleInfo?.avxInspectionRating || "UNRATED"} icon={UserCheck} />
               </div>
               
               <div className="mt-6 flex items-center gap-5 rounded-[32px] border border-slate-200 bg-white p-6 transition-all hover:bg-slate-50 group">
                  <div className="h-28 w-44 shrink-0 overflow-hidden rounded-[24px] border-4 border-white bg-slate-100 shadow-xl shadow-slate-200/50">
                     <img src={data.vehicleInfo?.thumbnailUrl} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Preview" />
                  </div>
                  <div className="flex-1 min-w-0">
                     <div className="flex flex-wrap gap-2 mb-3">
                       <Pill label={data.vehicleInfo?.fuelType} color="bg-orange-50 text-orange-600" />
                       <Pill label={data.vehicleInfo?.transmissionType} color="bg-sky-50 text-sky-600" />
                       <Pill label={`${data.vehicleInfo?.kmDriven} KM`} color="bg-emerald-50 text-emerald-600" />
                     </div>
                     <h3 className="text-[18px] font-black tracking-tight text-slate-900 truncate">{data.vehicleInfo?.title}</h3>
                     <p className="mt-1 text-sm font-bold text-slate-400 flex items-center gap-2">
                        <MapPin size={14} /> {data.addressInfo?.address}, {data.addressInfo?.cityName}
                     </p>
                  </div>
                  <button className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[24px] bg-white border border-slate-200 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                     <ExternalLink size={22} />
                  </button>
               </div>
            </div>

            {/* 3. AUDIT TIMELINE */}
            <div>
               <SectionHeader title="Administrative Audit Timeline" icon={History} />
               <div className="rounded-[40px] border border-slate-200 bg-white p-8">
                  <div className="space-y-8 relative">
                     <div className="absolute left-[31px] top-6 bottom-6 w-[2px] bg-slate-100" />
                     <TimelineItem time="PRESENT" text="Current record under investigator review" status="pending" />
                     <TimelineItem time="12 Mins Ago" text="Compliance AI flagged behavioral anomaly" status="flag" />
                     <TimelineItem time="07 Mar 2026" text="Initial registration verification completed" status="check" />
                  </div>
               </div>
            </div>

          </div>

          {/* SIDEBAR (RIGHT 4) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* OWNER & PARTNER DOSSIER */}
            <div className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/20">
               <h3 className="mb-8 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">Compliance Dossier</h3>
               
               {/* OWNER */}
               <div className="mb-10 flex items-center gap-5">
                  <div className="flex h-16 w-16 items-center justify-center rounded-[28px] bg-slate-50 border border-slate-100 text-slate-400">
                     <User size={32} />
                  </div>
                  <div className="flex-1 min-w-0">
                     <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">LISTING OWNER</span>
                        <div className="h-[3px] w-[3px] rounded-full bg-slate-300" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">{data.ownerInfo?.userRole}</span>
                     </div>
                     <h4 className="truncate text-[16px] font-black text-slate-900 leading-none mb-2">{data.ownerInfo?.fullName}</h4>
                     <p className="truncate text-sm font-bold text-slate-400 mb-2">{data.ownerInfo?.email}</p>
                     <div className="flex items-center gap-2 text-slate-900">
                        <Phone size={14} className="text-slate-300" />
                        <span className="text-xs font-black">{data.ownerInfo?.phoneNumber}</span>
                     </div>
                  </div>
               </div>

               {/* CONSULTANT */}
               <div className="rounded-[32px] bg-slate-900 p-6 text-white shadow-2xl shadow-slate-900/40">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-white/10 text-white backdrop-blur-md">
                       <Zap size={24} />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-black truncate">{data.consultantInfo?.consultationName}</h4>
                      <div className="mt-1 flex items-center gap-2">
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">{data.consultantInfo?.tierPlanTitle}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 border-y border-white/10 py-5">
                     <SidebarMetric label="Risk Level" value="LOW" color="text-emerald-400" />
                     <SidebarMetric label="Past Flags" value="02" />
                     <SidebarMetric label="Storefront" value={data.consultantInfo?.isActiveTier ? "ACTIVE" : "INACTIVE"} />
                  </div>

                  <button className="mt-6 w-full rounded-[20px] bg-white py-4 text-[10px] font-black uppercase tracking-widest text-slate-900 transition-all hover:bg-slate-100 active:scale-95">
                     Investigate Consultant
                  </button>
               </div>
            </div>

            {/* LOCATION CARD */}
            <div className="rounded-[40px] border border-slate-200 bg-white p-8">
               <h3 className="mb-6 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">Geo Tracking</h3>
               <div className="flex items-center gap-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-sky-50 text-sky-600">
                     <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-black text-slate-900">{data.addressInfo?.cityName}</h4>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">{data.addressInfo?.stateName}, {data.addressInfo?.countryName}</p>
                  </div>
               </div>
               <div className="mt-6 border-t border-slate-100 pt-6">
                  <p className="text-[13px] font-bold text-slate-500 italic">"{data.addressInfo?.address}"</p>
               </div>
            </div>

          </div>

        </div>
      </div>

      {modal && (
        <FlaggedListingsConfirmModal
          modal={modal}
          loading={actionLoading}
          onClose={() => setModal(null)}
          onConfirm={handleActionConfirm}
        />
      )}
    </div>
  );
}

function SectionHeader({ title, icon: Icon }) {
  return (
    <div className="mb-6 flex items-center gap-4">
       <div className="h-[1px] flex-1 bg-slate-200/60" />
       <div className="flex items-center gap-3">
          <Icon size={18} className="text-slate-400" />
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">{title}</h3>
       </div>
       <div className="h-[1px] flex-1 bg-slate-200/60" />
    </div>
  );
}

function SpecItem({ label, value, icon: Icon, bold, highlight }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-slate-50 border border-slate-100 text-slate-400">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
        <p className={cls(
          "text-[15px] font-black tracking-tight",
          highlight ? "text-rose-600" : "text-slate-900"
        )}>{value}</p>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color }) {
  return (
    <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
       <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
          <Icon size={20} />
       </div>
       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
       <p className={cls("text-[18px] font-black tracking-tight", color || "text-slate-900")}>{value}</p>
    </div>
  );
}

function Pill({ label, color }) {
  return (
    <span className={cls("rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-tighter italic", color)}>
       {label}
    </span>
  );
}

function SidebarMetric({ label, value, color }) {
  return (
    <div className="flex items-center justify-between">
       <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
       <span className={cls("text-[14px] font-black tracking-widest", color || "text-white")}>{value}</span>
    </div>
  );
}

function TimelineItem({ time, text, status }) {
  const ico = {
    pending: <Clock size={16} />,
    flag: <ShieldAlert size={16} />,
    check: <ShieldCheck size={16} />
  }[status];

  const col = {
    pending: "bg-slate-50 text-slate-400",
    flag: "bg-rose-50 text-rose-500",
    check: "bg-emerald-50 text-emerald-500"
  }[status];

  return (
    <div className="flex gap-6 items-start relative z-10">
       <div className={cls("flex h-16 w-16 shrink-0 items-center justify-center rounded-[24px] border-4 border-white shadow-lg", col)}>
          {ico}
       </div>
       <div className="pt-2">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{time}</div>
          <p className="text-sm font-black text-slate-900">{text}</p>
       </div>
    </div>
  );
}

function ActionButton({ icon: Icon, label, color, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={cls(
        "flex h-12 items-center gap-3 rounded-[24px] px-6 text-xs font-black uppercase tracking-widest transition-all hover:scale-[1.03] active:scale-95 shadow-xl",
        color
      )}
    >
      <Icon size={18} />
      <span className="hidden md:inline">{label}</span>
    </button>
  );
}