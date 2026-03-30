import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  AlertTriangle,
  ShieldAlert,
  User,
  MapPin,
  Phone,
  Mail,
  Car,
  FileText,
  CheckCircle2,
  Clock,
  BadgeCheck,
  CreditCard,
  Shield,
  Zap,
  Ban,
  Scale,
  X,
  ChevronDown,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getFlagReview } from "../../../../api/vehicle.api";
import { addPenalty } from "../../../../api/consultationApi";
import { suspendVehicle, clearFlaggedVehicle } from "../../../../api/vehicle.api";

const cls = (...a) => a.filter(Boolean).join(" ");

const severityBadge = (severity) => {
  const map = {
    HIGH: "border-rose-200 bg-rose-50 text-rose-700",
    MODERATE: "border-amber-200 bg-amber-50 text-amber-700",
    LOW: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };
  return map[severity] || "border-slate-200 bg-slate-100 text-slate-700";
};

const statusBadge = (status) => {
  const map = {
    ACTIVE: "border-emerald-200 bg-emerald-50 text-emerald-700",
    INACTIVE: "border-slate-200 bg-slate-100 text-slate-700",
    SOLD: "border-violet-200 bg-violet-50 text-violet-700",
    DELETED: "border-rose-200 bg-rose-50 text-rose-700",
  };
  return map[status] || "border-slate-200 bg-slate-100 text-slate-700";
};

const formatEnumLabel = (str) => {
  if (!str || typeof str !== "string") return "-";
  return str.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function FlaggedListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [penaltyModal, setPenaltyModal] = useState(false);
  const [penaltyData, setPenaltyData] = useState({ points: "", reason: "" });
  const [penaltyLoading, setPenaltyLoading] = useState(false);

  const [suspendModal, setSuspendModal] = useState(false);
  const [suspendData, setSuspendData] = useState({
    reason: "",
    suspensionType: "TEMPORARY",
    date: ""
  });
  const [suspendLoading, setSuspendLoading] = useState(false);

  const [clearModal, setClearModal] = useState(false);
  const [clearReason, setClearReason] = useState("");
  const [clearLoading, setClearLoading] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await getFlagReview(id);
        setData(res?.data || null);
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to load flag details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetail();
    }
  }, [id]);

  const handleApplyPenalty = async () => {
    if (!penaltyData.points || !penaltyData.reason) {
      toast.error("Please fill all fields");
      return;
    }

    if (!data?.consultantInfo?.consultationId) {
      toast.error("Consultant ID not found");
      return;
    }

    try {
      setPenaltyLoading(true);
      await addPenalty({
        consultId: data.consultantInfo.consultationId,
        deductionCount: Number(penaltyData.points),
        reason: penaltyData.reason,
      });
      toast.success("Penalty applied successfully");
      setPenaltyModal(false);
      setPenaltyData({ points: "", reason: "" });
    } catch (err) {
      console.error("Penalty error:", err);
      toast.error(err?.response?.data?.message || "Failed to apply penalty");
    } finally {
      setPenaltyLoading(false);
    }
  };

  const handleSuspend = async () => {
    if (!suspendData.reason) {
      toast.error("Please provide a reason for suspension");
      return;
    }

    if (suspendData.suspensionType === "TEMPORARY" && !suspendData.date) {
      toast.error("Please select a date for temporary suspension");
      return;
    }

    if (!data?.vehicleInfo?.vehicleId) {
      toast.error("Vehicle ID not found");
      return;
    }

    try {
      setSuspendLoading(true);
      await suspendVehicle({
        vehicleId: data.vehicleInfo.vehicleId,
        reason: suspendData.reason,
        suspendType: suspendData.suspensionType,
        suspendUntil: suspendData.suspensionType === "TEMPORARY" ? suspendData.date : null,
      });
      toast.success("Vehicle suspended successfully");
      setSuspendModal(false);
      setSuspendData({ reason: "", suspensionType: "TEMPORARY", date: "" });
      navigate("/admin/vehicles/flagged-listings");
    } catch (err) {
      console.error("Suspend error:", err);
      toast.error(err?.response?.data?.message || "Failed to suspend vehicle");
    } finally {
      setSuspendLoading(false);
    }
  };

  const handleClearFlag = async () => {
    if (!clearReason.trim()) {
      toast.error("Please provide a reason for clearing the flag");
      return;
    }

    if (!data?.flagReviewId) {
      toast.error("Flag ID not found");
      return;
    }

    try {
      setClearLoading(true);
      await clearFlaggedVehicle({
        flagId: data.flagReviewId,
        reason: clearReason,
      });
      toast.success("Flag cleared successfully");
      setClearModal(false);
      setClearReason("");
      navigate("/admin/vehicles/flagged-listings");
    } catch (err) {
      console.error("Clear flag error:", err);
      toast.error(err?.response?.data?.message || "Failed to clear flag");
    } finally {
      setClearLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full border-4 border-sky-200 border-t-sky-600 animate-spin" />
          <div className="text-sm font-semibold text-slate-600">Loading flag details...</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-4 h-16 w-16 text-slate-400" />
          <div className="text-lg font-bold text-slate-900">Flag not found</div>
          <button
            onClick={() => navigate("/admin/vehicles/flagged-listings")}
            className="mt-4 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Back to Flagged Listings
          </button>
        </div>
      </div>
    );
  }

  const { vehicleInfo, ownerInfo, consultantInfo, addressInfo } = data;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <Toaster position="top-right" />

      <div className="mx-auto max-w-7xl space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/admin/vehicles/flagged-listings")}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition-colors hover:text-slate-900 cursor-pointer"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </div>
            <span>Back to Flagged Listings</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSuspendModal(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-5 py-2.5 text-sm font-bold text-rose-700 hover:bg-rose-100 transition-colors"
            >
              <Ban className="h-4 w-4" />
              Suspend Listing
            </button>
            <button
              onClick={() => setClearModal(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-2.5 text-sm font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
            >
              <CheckCircle2 className="h-4 w-4" />
              Clear All Flags
            </button>
          </div>
        </div>

        {/* TITLE & SEVERITY */}
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <span
                  className={cls(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-black uppercase tracking-wider",
                    severityBadge(data.severity)
                  )}
                >
                  <ShieldAlert className="h-4 w-4" />
                  {data.severity} SEVERITY
                </span>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">
                {vehicleInfo?.title || "Vehicle Details"}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Flagged on {formatDateTime(data.flaggedAt)}
              </p>
            </div>

            <div className="text-right">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Status
              </div>
              <div className="mt-1">
                {data.isResolved ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    Resolved
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700">
                    <Clock className="h-4 w-4" />
                    Under Review
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* LEFT COLUMN - INCIDENT DETAILS */}
          <div className="lg:col-span-2 space-y-6">
            {/* INCIDENT INTELLIGENCE */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Incident Intelligence</h2>
                  <p className="text-sm text-slate-500">Detailed violation analysis</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InfoCard
                  icon={FileText}
                  label="Policy Category"
                  value={formatEnumLabel(data.flagCategory)}
                  color="text-slate-900"
                />
                <InfoCard
                  icon={AlertTriangle}
                  label="Risk Profile"
                  value={data.severity}
                  color="text-rose-600"
                />
              </div>

              <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Administrator / System Notes
                </div>
                <p className="text-sm italic leading-relaxed text-slate-700">
                  "{data.internalNotes || "No notes provided"}"
                </p>
              </div>
            </div>

            {/* VEHICLE SPECIFICATIONS */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                  <Car className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Vehicle Specifications</h2>
                  <p className="text-sm text-slate-500">Complete vehicle information</p>
                </div>
              </div>

              <div className="mb-6">
                <img
                  src={vehicleInfo?.thumbnailUrl || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600"}
                  alt={vehicleInfo?.title}
                  className="h-64 w-full rounded-2xl object-cover"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <SpecCard
                  icon={Car}
                  label="Registration"
                  value={vehicleInfo?.registrationNumber || "-"}
                />
                <SpecCard
                  icon={CreditCard}
                  label="Market Valuation"
                  value={`₹${(vehicleInfo?.price || 0).toLocaleString("en-IN")}`}
                />
                <SpecCard
                  icon={BadgeCheck}
                  label="Inspection Rating"
                  value={vehicleInfo?.avxInspectionRating || "Unrated"}
                />
                <SpecCard
                  icon={Shield}
                  label="Verification Status"
                  value={formatEnumLabel(vehicleInfo?.verificationStatus)}
                />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <Badge
                  label="Fuel"
                  value={formatEnumLabel(vehicleInfo?.fuelType)}
                  color="bg-orange-50 text-orange-700 border-orange-200"
                />
                <Badge
                  label="Transmission"
                  value={formatEnumLabel(vehicleInfo?.transmissionType)}
                  color="bg-blue-50 text-blue-700 border-blue-200"
                />
                <Badge
                  label="KM Driven"
                  value={`${(vehicleInfo?.kmDriven || 0).toLocaleString()} KM`}
                  color="bg-emerald-50 text-emerald-700 border-emerald-200"
                />
              </div>

              <div className="mt-4">
                <span
                  className={cls(
                    "inline-flex rounded-full border px-3 py-1.5 text-xs font-bold uppercase",
                    statusBadge(vehicleInfo?.vehicleStatus)
                  )}
                >
                  {formatEnumLabel(vehicleInfo?.vehicleStatus)}
                </span>
              </div>
            </div>

            {/* GEO TRACKING */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Geo Tracking</h2>
                  <p className="text-sm text-slate-500">Location information</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <span className="text-sm font-semibold text-slate-500">City</span>
                  <span className="text-sm font-bold text-slate-900">{addressInfo?.cityName || "-"}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <span className="text-sm font-semibold text-slate-500">State</span>
                  <span className="text-sm font-bold text-slate-900">{addressInfo?.stateName || "-"}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <span className="text-sm font-semibold text-slate-500">Address</span>
                  <span className="text-sm font-bold text-slate-900">{addressInfo?.address || "-"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - COMPLIANCE DOSSIER */}
          <div className="space-y-6">
            {/* COMBINED OWNER & CONSULTANT INFO */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                {consultantInfo ? "Consultant Profile" : "Listing Owner"}
              </div>

              <div className="mb-4 flex items-center gap-3">
                <div className={cls(
                  "flex h-12 w-12 items-center justify-center rounded-full",
                  consultantInfo ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
                )}>
                  {consultantInfo ? <Zap className="h-6 w-6" /> : <User className="h-6 w-6" />}
                </div>
                <div>
                  <div className="text-base font-bold text-slate-900">
                    {consultantInfo?.consultationName || ownerInfo?.fullName || "-"}
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {consultantInfo?.tierPlanTitle || formatEnumLabel(ownerInfo?.userRole)}
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <ContactItem icon={Mail} value={ownerInfo?.email} />
                <ContactItem icon={Phone} value={ownerInfo?.phoneNumber} />
              </div>

              {/* Consultant-specific details */}
              {consultantInfo && (
                <>
                  <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Risk Level
                      </span>
                      <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                        LOW
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Past Flags
                      </span>
                      <span className="text-sm font-bold text-slate-900">02</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Storefront
                      </span>
                      <span className={cls(
                        "rounded-full px-3 py-1 text-xs font-bold",
                        consultantInfo?.isActiveTier
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      )}>
                        {consultantInfo?.isActiveTier ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setPenaltyModal(true)}
                    className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Scale className="h-4 w-4" />
                    Apply Penalty
                  </button>
                </>
              )}
            </div>

            {/* TIMESTAMPS */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                Timeline
              </div>

              <div className="space-y-3">
                <TimelineItem
                  label="Flagged At"
                  value={formatDateTime(data.flaggedAt)}
                  icon={AlertTriangle}
                  color="text-rose-600"
                />
                <TimelineItem
                  label="Last Updated"
                  value={formatDateTime(data.updatedAt)}
                  icon={Clock}
                  color="text-slate-600"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* APPLY PENALTY MODAL */}
      {penaltyModal && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => !penaltyLoading && setPenaltyModal(false)}
          />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Apply Ranking Penalty</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Deduct points from consultant's ranking score
                </p>
              </div>
              <button
                onClick={() => !penaltyLoading && setPenaltyModal(false)}
                className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
                disabled={penaltyLoading}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Deduction Amount (Points)
                </label>
                <input
                  type="number"
                  value={penaltyData.points}
                  onChange={(e) => setPenaltyData(prev => ({ ...prev, points: e.target.value }))}
                  placeholder="e.g. 10"
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-900 outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  disabled={penaltyLoading}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Reason for Penalty
                </label>
                <textarea
                  value={penaltyData.reason}
                  onChange={(e) => setPenaltyData(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Enter reason for this penalty..."
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-100 resize-none"
                  disabled={penaltyLoading}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setPenaltyModal(false)}
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                disabled={penaltyLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleApplyPenalty}
                className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={penaltyLoading}
              >
                {penaltyLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Applying...
                  </>
                ) : (
                  "Apply Penalty"
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {/* SUSPEND LISTING MODAL */}
      {suspendModal && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => !suspendLoading && setSuspendModal(false)}
          />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-slate-200 bg-white overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-rose-50/50 to-white p-6 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] bg-rose-100 text-rose-600 shadow-inner ring-1 ring-rose-200">
                  <Ban size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight text-slate-900">Suspend Listing</h3>
                  <p className="mt-1 text-xs font-bold text-slate-500">
                    {vehicleInfo?.title || "Vehicle"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => !suspendLoading && setSuspendModal(false)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-slate-900"
                disabled={suspendLoading}
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Reason for Suspension
                </label>
                <div className="relative">
                  <select
                    value={suspendData.reason}
                    onChange={(e) => setSuspendData(prev => ({ ...prev, reason: e.target.value }))}
                    className="h-12 w-full appearance-none rounded-[18px] border border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-rose-400 focus:ring-4 focus:ring-rose-100 hover:border-slate-300"
                    disabled={suspendLoading}
                  >
                    <option value="">Select reason</option>
                    <option value="Fake photos">Fake photos</option>
                    <option value="Fraud suspicion">Fraud suspicion</option>
                    <option value="Price manipulation">Price manipulation</option>
                    <option value="Duplicate listing">Duplicate listing</option>
                    <option value="Policy violation">Policy violation</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Suspension Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSuspendData(prev => ({ ...prev, suspensionType: "TEMPORARY" }))}
                    className={cls(
                      "rounded-[18px] border px-4 py-4 text-left transition-all",
                      suspendData.suspensionType === "TEMPORARY"
                        ? "border-sky-300 bg-sky-50 ring-4 ring-sky-100"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    )}
                    disabled={suspendLoading}
                  >
                    <div className="text-sm font-black text-slate-900">Temporary</div>
                    <div className="mt-1 text-[10px] text-slate-500 font-bold uppercase tracking-wider">Limited time</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSuspendData(prev => ({ ...prev, suspensionType: "PERMANENT" }))}
                    className={cls(
                      "rounded-[18px] border px-4 py-4 text-left transition-all",
                      suspendData.suspensionType === "PERMANENT"
                        ? "border-rose-300 bg-rose-50 ring-4 ring-rose-100"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    )}
                    disabled={suspendLoading}
                  >
                    <div className="text-sm font-black text-slate-900">Permanent</div>
                    <div className="mt-1 text-[10px] text-slate-500 font-bold uppercase tracking-wider">Until restored</div>
                  </button>
                </div>
              </div>

              {suspendData.suspensionType === "TEMPORARY" && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Suspend Until
                  </label>
                  <input
                    type="datetime-local"
                    value={suspendData.date}
                    onChange={(e) => setSuspendData(prev => ({ ...prev, date: e.target.value }))}
                    min={new Date().toISOString().slice(0, 16)}
                    className="h-12 w-full rounded-[18px] border border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-100 hover:border-slate-300"
                    disabled={suspendLoading}
                  />
                  <p className="mt-2 text-xs text-slate-400 font-medium">
                    Select a future date and time for suspension end
                  </p>
                </div>
              )}
            </div>

            <div className="bg-slate-50/50 p-6 flex gap-3">
              <button
                onClick={() => setSuspendModal(false)}
                className="flex-1 rounded-[16px] border-2 border-slate-100 bg-white py-3 text-sm font-black text-slate-500 hover:bg-slate-50 disabled:opacity-50"
                disabled={suspendLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSuspend}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-[16px] bg-rose-600 py-3 text-sm font-black text-white shadow-2xl shadow-rose-600/25 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={suspendLoading || !suspendData.reason}
              >
                {suspendLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Suspending...
                  </>
                ) : (
                  <>
                    <Ban size={18} strokeWidth={2.5} />
                    Confirm Suspend
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {/* CLEAR FLAG MODAL */}
      {clearModal && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => !clearLoading && setClearModal(false)}
          />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-slate-200 bg-white overflow-hidden shadow-2xl">
            <div className="p-6 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] bg-emerald-100 text-emerald-600 shadow-inner ring-1 ring-emerald-200">
                  <CheckCircle2 size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight text-slate-900">Clear All Flags</h3>
                  <p className="mt-1 text-xs font-bold text-slate-500">
                    {vehicleInfo?.title || "Vehicle"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => !clearLoading && setClearModal(false)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-slate-900"
                disabled={clearLoading}
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 pb-6">
              <label className="block">
                <div className="mb-2 text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Clearance Reason
                </div>
                <textarea
                  rows={4}
                  value={clearReason}
                  onChange={(e) => setClearReason(e.target.value)}
                  placeholder="Explain why this flag is being cleared..."
                  className="w-full resize-none rounded-[22px] border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 hover:border-slate-300"
                  disabled={clearLoading}
                />
              </label>
            </div>

            <div className="bg-slate-50/50 p-6 flex gap-3">
              <button
                onClick={() => setClearModal(false)}
                className="flex-1 rounded-[16px] border-2 border-slate-100 bg-white py-3 text-sm font-black text-slate-500 hover:bg-slate-50 disabled:opacity-50"
                disabled={clearLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleClearFlag}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-[16px] bg-emerald-600 py-3 text-sm font-black text-white shadow-2xl shadow-emerald-600/25 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={clearLoading || !clearReason.trim()}
              >
                {clearLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Clearing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} strokeWidth={2.5} />
                    Confirm Clear
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function InfoCard({ icon: Icon, label, value, color }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <div className={cls("text-base font-bold", color)}>{value}</div>
    </div>
  );
}

function SpecCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 text-slate-400" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</span>
      </div>
      <div className="text-sm font-bold text-slate-900">{value}</div>
    </div>
  );
}

function Badge({ label, value, color }) {
  return (
    <div className={cls("rounded-xl border px-3 py-2 text-center", color)}>
      <div className="text-[10px] font-bold uppercase tracking-wider opacity-70">{label}</div>
      <div className="mt-0.5 text-xs font-black">{value}</div>
    </div>
  );
}

function ContactItem({ icon: Icon, value }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="h-4 w-4 text-slate-400" />
      <span className="font-medium text-slate-600">{value || "-"}</span>
    </div>
  );
}

function TimelineItem({ label, value, icon: Icon, color }) {
  return (
    <div className="flex items-center gap-3">
      <div className={cls("flex h-8 w-8 items-center justify-center rounded-full bg-slate-100", color)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <div className="text-xs font-semibold text-slate-400">{label}</div>
        <div className="text-sm font-bold text-slate-900">{value}</div>
      </div>
    </div>
  );
}
