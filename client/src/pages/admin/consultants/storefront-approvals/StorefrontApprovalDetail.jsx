import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
   ArrowLeft,
   CheckCircle2,
   XCircle,
   RefreshCcw,
   ShieldAlert,
   Loader2,
   MapPin,
   Mail,
   Phone,
   BadgeCheck,
   User,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getStorefrontApprovalDetails } from "../../../../api/pendingApprovals.api";
import { getThemeComponent } from "./themes/ThemeRegistry";
import mapStorefrontData from "./utils/storefrontDataMapper";

const cls = (...a) => a.filter(Boolean).join(" ");

const safeText = (value, fallback = "-") => {
   if (value === null || value === undefined || value === "") return fallback;
   return value;
};

const verificationBadge = (status) => {
   const map = {
      VERIFIED: "border-emerald-200 bg-emerald-50 text-emerald-700",
      REQUESTED: "border-amber-200 bg-amber-50 text-amber-700",
      REJECTED: "border-rose-200 bg-rose-50 text-rose-700",
      PENDING: "border-slate-200 bg-slate-100 text-slate-700",
   };
   return map[status] || map.PENDING;
};

const tierBadge = (tier) => {
   if (tier === "PREMIUM") return "border-emerald-200 bg-emerald-50 text-emerald-700";
   if (tier === "PRO") return "border-blue-200 bg-blue-50 text-blue-700";
   return "border-slate-200 bg-slate-100 text-slate-700";
};

const StorefrontApprovalDetail = () => {
   const { id } = useParams();
   const navigate = useNavigate();

   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");
   const [data, setData] = useState(null);
   const [activeTab, setActiveTab] = useState("about");

   useEffect(() => {
      const fetchDetails = async () => {
         setLoading(true);
         setError("");

         try {
            const res = await getStorefrontApprovalDetails(id);
            const responseData = res?.data || res;
            setData(responseData);
         } catch (err) {
            console.error("Failed to fetch storefront details:", err);
            setError(
               err?.response?.data?.message ||
               err?.message ||
               "Failed to load storefront details"
            );
            toast.error("Failed to load storefront details");
         } finally {
            setLoading(false);
         }
      };

      if (id) {
         fetchDetails();
      }
   }, [id]);

   const handleApprove = () => {
      toast.success("Storefront approved");
      navigate("/admin/consultants/storefront-approvals");
   };

   const handleReject = () => {
      toast.error("Storefront rejected");
      navigate("/admin/consultants/storefront-approvals");
   };

   const handleRequestChanges = () => {
      toast.success("Changes requested");
      navigate("/admin/consultants/storefront-approvals");
   };

   if (loading) {
      return (
         <div className="flex h-screen items-center justify-center">
            <div className="flex flex-col items-center gap-4">
               <Loader2 className="h-12 w-12 animate-spin text-sky-500" />
               <p className="text-sm font-semibold text-slate-600">
                  Loading storefront details...
               </p>
            </div>
         </div>
      );
   }

   if (error || !data) {
      return (
         <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
            <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
               <ShieldAlert size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Request Not Found</h2>
            <p className="text-slate-500 mt-2 max-w-md">
               {error || "The approval request you are looking for does not exist or has been processed."}
            </p>
            <button
               onClick={() => navigate("/admin/consultants/storefront-approvals")}
               className="mt-6 flex items-center gap-2 text-sky-600 font-bold hover:underline"
            >
               <ArrowLeft size={18} />
               Back to Approvals
            </button>
         </div>
      );
   }

   // Extract consultant and storefront data
   const consultant = data.consultation || {};
   const storefrontDraft = data.storefrontDraft || {};
   const themeType = storefrontDraft.theme?.type || "about_us_theme_basic_1";

   // Map backend data to theme format
   const mappedData = mapStorefrontData(storefrontDraft);

   // Get theme components
   const AboutThemeComponent = getThemeComponent(themeType);
   const WhyBuyThemeComponent = getThemeComponent("why_buy_theme_basic_1");

   return (
      <div className="h-screen flex flex-col overflow-hidden p-0">
         <Toaster
            position="top-right"
            toastOptions={{
               duration: 3000,
               style: {
                  borderRadius: "14px",
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  color: "#0f172a",
                  boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
                  fontSize: "13px",
                  fontWeight: 600,
               },
            }}
         />

         <div className="flex-1 overflow-y-auto">
            <div className="max-w-[1400px] mx-auto p-6 space-y-6">
               {/* Header with Back Button */}
               <div className="flex items-center gap-4">
                  <button
                     onClick={() => navigate("/admin/consultants/storefront-approvals")}
                     className="h-12 w-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
                  >
                     <ArrowLeft size={20} />
                  </button>
                  <div>
                     <h1 className="text-2xl font-black text-slate-900">
                        Storefront Approval Review
                     </h1>
                     <p className="text-sm text-slate-500 font-medium">
                        Review and approve storefront changes
                     </p>
                  </div>
               </div>

               {/* Consultant Info Card */}
               <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                  <div className="flex flex-col lg:flex-row gap-8">
                     {/* Logo */}
                     <div className="shrink-0">
                        <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-md">
                           {consultant.logoUrl ? (
                              <img
                                 src={consultant.logoUrl}
                                 alt={consultant.consultationName}
                                 className="h-full w-full object-cover"
                              />
                           ) : (
                              <div className="h-full w-full flex items-center justify-center text-2xl font-bold text-slate-400">
                                 {(consultant.consultationName || "C").charAt(0)}
                              </div>
                           )}
                        </div>
                     </div>

                     {/* Info Grid */}
                     <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                           <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                              Consultant Name
                           </div>
                           <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-slate-400" />
                              <span className="text-[15px] font-bold text-slate-900">
                                 {safeText(consultant.consultationName)}
                              </span>
                           </div>
                        </div>

                        <div>
                           <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                              Username
                           </div>
                           <div className="text-[15px] font-semibold text-slate-700">
                              {safeText(consultant.username)}
                           </div>
                        </div>

                        <div>
                           <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                              City
                           </div>
                           <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-slate-400" />
                              <span className="text-[15px] font-semibold text-slate-700">
                                 {safeText(consultant.cityName)}
                              </span>
                           </div>
                        </div>

                        <div>
                           <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                              Email
                           </div>
                           <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-slate-400" />
                              <span className="text-[13px] font-medium text-slate-700 truncate">
                                 {safeText(consultant.companyEmail)}
                              </span>
                           </div>
                        </div>

                        <div>
                           <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                              Phone
                           </div>
                           <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-slate-400" />
                              <span className="text-[15px] font-semibold text-slate-700">
                                 {safeText(consultant.phoneNumber)}
                              </span>
                           </div>
                        </div>

                        <div>
                           <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                              Tier Plan
                           </div>
                           <span
                              className={cls(
                                 "inline-flex rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.03em]",
                                 tierBadge(consultant.tierPlanTitle)
                              )}
                           >
                              {safeText(consultant.tierPlanTitle)}
                           </span>
                        </div>

                        <div>
                           <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                              Verification Status
                           </div>
                           <span
                              className={cls(
                                 "inline-flex rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.03em]",
                                 verificationBadge(consultant.verificationStatus)
                              )}
                           >
                              {safeText(consultant.verificationStatus)}
                           </span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Tabs */}
               <div className="flex items-center gap-2 border-b border-slate-200">
                  <button
                     onClick={() => setActiveTab("about")}
                     className={cls(
                        "px-6 py-3 text-sm font-bold transition-all border-b-2",
                        activeTab === "about"
                           ? "border-sky-500 text-sky-600"
                           : "border-transparent text-slate-500 hover:text-slate-700"
                     )}
                  >
                     About Us
                  </button>
                  <button
                     onClick={() => setActiveTab("whybuy")}
                     className={cls(
                        "px-6 py-3 text-sm font-bold transition-all border-b-2",
                        activeTab === "whybuy"
                           ? "border-sky-500 text-sky-600"
                           : "border-transparent text-slate-500 hover:text-slate-700"
                     )}
                  >
                     Why Buy Here
                  </button>
               </div>

               {/* Theme Content */}
               <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm min-h-[600px]">
                  {activeTab === "about" && AboutThemeComponent && (
                     <AboutThemeComponent data={mappedData.aboutUs} />
                  )}
                  {activeTab === "whybuy" && WhyBuyThemeComponent && (
                     <WhyBuyThemeComponent data={mappedData.whyBuy} />
                  )}
                  {activeTab === "about" && !AboutThemeComponent && (
                     <div className="flex flex-col items-center justify-center py-20 text-center">
                        <ShieldAlert className="h-16 w-16 text-slate-300 mb-4" />
                        <p className="text-slate-500 font-medium">
                           Theme not available for this storefront
                        </p>
                     </div>
                  )}
               </div>

               {/* Action Buttons */}
               <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
                  <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                     <div className="text-sm text-slate-500">
                        Review the storefront changes and take action
                     </div>

                     <div className="flex items-center gap-3">
                        <button
                           onClick={handleRequestChanges}
                           className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-amber-200 bg-amber-50 px-6 text-sm font-bold text-amber-700 transition-all hover:bg-amber-100 active:scale-95"
                        >
                           <RefreshCcw size={16} />
                           Request Changes
                        </button>

                        <button
                           onClick={handleReject}
                           className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-rose-200 bg-rose-50 px-6 text-sm font-bold text-rose-700 transition-all hover:bg-rose-100 active:scale-95"
                        >
                           <XCircle size={16} />
                           Reject
                        </button>

                        <button
                           onClick={handleApprove}
                           className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95"
                        >
                           <CheckCircle2 size={16} />
                           Approve
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default StorefrontApprovalDetail;
