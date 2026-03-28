import React from "react";
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
  PhoneCall,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { DUMMY_FLAGGED_LISTINGS } from "./flaggedListingsData";

export default function FlaggedListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = DUMMY_FLAGGED_LISTINGS.find(r => r.id === id);

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-slate-500">
        <AlertCircle size={48} className="mb-4 text-rose-500" />
        <h2 className="text-xl font-bold">Listing Not Found</h2>
        <button onClick={() => navigate(-1)} className="mt-4 text-indigo-600 font-bold underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* HEADER */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  item.risk === "High" ? "bg-rose-100 text-rose-700" : 
                  item.risk === "Moderate" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                }`}>
                  {item.risk} Risk
                </span>
                <span className="text-[11px] font-medium text-slate-400 font-mono">ID: {item.id}</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900">{item.title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-rose-700 transition-colors">
              <Ban size={16} /> Suspend
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
              <AlertTriangle size={16} /> Escalate
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-emerald-700 transition-colors">
              <CheckCircle2 size={16} /> Clear Flag
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* FLAG DETAILS */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-4">
                <ShieldAlert size={20} className="text-rose-500" />
                <h2 className="text-lg font-bold text-slate-900">Incident Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <InfoItem label="Flag Category" value={item.flagCategory} icon={Info} />
                <InfoItem label="Flag Source" value={item.flagSource} icon={Activity} />
                <InfoItem label="Reporter ID" value={item.buyerId !== "-" ? item.buyerId : "N/A (System Detected)"} icon={User} />
                <InfoItem label="Date Flagged" value={item.dateFlagged} icon={Clock} />
              </div>
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Flag Reason / Comment</p>
                <p className="text-slate-700 font-medium leading-relaxed italic">"{item.comment || item.flagReason}"</p>
              </div>
              {item.autoFlag !== "-" && (
                <div className="mt-6 flex items-center gap-4 p-4 bg-rose-50 border border-rose-100 rounded-lg text-rose-700">
                  <ShieldAlert size={20} className="shrink-0" />
                  <div className="text-sm">
                    <span className="font-bold">System Warning:</span> Potential {item.autoFlag} detected. Automated verification score failed.
                  </div>
                </div>
              )}
            </div>

            {/* VEHICLE PREVIEW */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="flex items-center gap-2 p-6 border-b border-slate-100">
                <Car size={20} className="text-slate-400" />
                <h2 className="text-lg font-bold text-slate-900">Listing Snapshot</h2>
              </div>
              <div className="flex flex-col md:flex-row overflow-hidden">
                <div className="w-full md:w-1/3 h-48 md:h-auto">
                  <img src={item.thumb} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                    <span className="text-xl font-black text-indigo-600">{item.price}</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-500 text-sm mb-6">
                    <span className="flex items-center gap-1"><MapPin size={14} /> {item.city}</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {item.daysOpen} days active</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.specs.map(s => (
                      <span key={s} className="px-3 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold uppercase tracking-wider">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* MESSAGE AUDIT */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                <MessageSquare size={20} className="text-slate-400" />
                <h2 className="text-lg font-bold text-slate-900">Communication Audit</h2>
              </div>
              <div className="space-y-6">
                <ChatRow user="Buyer" msg="Can we talk on WhatsApp? Give me your number." time="10:42 AM" flagged />
                <ChatRow user={item.consultant} msg="Sure, call me at 98XX-XXX-XXX." time="10:45 AM" flagged />
                <ChatRow user="Buyer" msg="I want to negotiate the price in person." time="10:50 AM" />
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            
            {/* CONSULTANT DOOSIER */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xl">
                  {item.consultant[0]}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{item.consultant}</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{item.tier} Partner</p>
                </div>
              </div>
              <div className="space-y-4 mb-6 border-y border-slate-100 py-4">
                <SidebarInfo label="Lifetime Flags" value={item.consultantHistory.previousFlags} />
                <SidebarInfo label="Penalties" value={item.consultantHistory.rankingPenalties} />
                <SidebarInfo label="Total Inquiries" value={item.inquiries} />
                <SidebarInfo label="IP Anomaly" value={item.ipAnomaly === "YES" ? "Detected" : "None"} color={item.ipAnomaly === "YES" ? "text-rose-600" : "text-emerald-600"} />
              </div>
              <button className="w-full py-3 bg-slate-50 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors">
                View Partner Profile
              </button>
            </div>

            {/* QUICK ACTIONS / LOGS */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-widest">
                <History size={16} className="text-slate-400" /> Audit Logs
              </h3>
              <div className="space-y-4">
                <AuditLog time="Just Now" text="Admin viewed case" />
                <AuditLog time="2h ago" text="System flagged message" />
                <AuditLog time="1d ago" text="Listing created" />
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value, icon: Icon }) {
  return (
    <div className="flex gap-4">
      <div className="p-2 rounded-lg bg-slate-50 text-slate-400 h-fit">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function SidebarInfo({ label, value, color = "text-slate-900" }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500 font-medium">{label}</span>
      <span className={`font-bold ${color}`}>{value}</span>
    </div>
  );
}

function ChatRow({ user, msg, time, flagged }) {
  return (
    <div className={`p-4 rounded-xl border ${flagged ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-100'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{user}</span>
        <span className="text-[10px] text-slate-400 font-medium">{time}</span>
      </div>
      <p className="text-sm text-slate-700 font-medium leading-relaxed">"{msg}"</p>
      {flagged && <div className="mt-2 text-[9px] font-black text-rose-600 uppercase tracking-widest">Potential Policy Violation</div>}
    </div>
  );
}

function AuditLog({ time, text }) {
  return (
    <div className="flex gap-3 text-sm">
      <span className="text-[10px] font-bold text-slate-400 w-12 pt-1">{time}</span>
      <p className="text-slate-700 font-medium">{text}</p>
    </div>
  );
}

function Activity(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
  );
}