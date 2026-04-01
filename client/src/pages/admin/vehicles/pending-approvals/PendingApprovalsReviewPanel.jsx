import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  MessageSquareWarning,
  ShieldAlert,
  User,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Clock3,
  ShieldCheck,
  Sparkles,
  FileText,
  Camera,
  MessageSquare,
  Activity,
  Loader2,
  Info,
  CarFront,
  Flag,
  AlertTriangle,
  History,
} from "lucide-react";
import { getVehicleDetailsEnhanced } from "../../../../api/vehicle.api";

const cls = (...a) => a.filter(Boolean).join(" ");

const TABS = [
  "Overview",
  "Inspection",
  "Inquiries",
  "Flags & Fraud Signals",
  "Activity Log",
];

const safeText = (value, fallback = "-") => {
  if (value === null || value === undefined || value === "") return fallback;
  return value;
};

const safeNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const formatDateTime = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-IN", { dateStyle: "medium" });
};

const formatCurrency = (value) => {
  const n = safeNumber(value, 0);
  return `₹${n.toLocaleString("en-IN")}`;
};

const formatEnumLabel = (value) => {
  if (!value) return "-";
  return String(value).replace(/_/g, " ");
};

const inspectionBadge = (status) => {
  const map = {
    NOT_INSPECTED: "bg-zinc-100 text-zinc-700 ring-zinc-200",
    IN_PROGRESS: "bg-amber-50 text-amber-700 ring-amber-100",
    SELF_INSPECTED: "bg-slate-50 text-slate-700 ring-slate-200",
    AI_INSPECTED: "bg-indigo-50 text-indigo-700 ring-indigo-100",
    AVX_INSPECTED: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  };
  return map[status] || "bg-zinc-100 text-zinc-700 ring-zinc-200";
};

const statusBadge = (status, sold = false) => {
  if (sold) return "bg-purple-50 text-purple-700 ring-purple-100";

  const map = {
    ACTIVE: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    INACTIVE: "bg-zinc-100 text-zinc-700 ring-zinc-200",
    SOLD: "bg-purple-50 text-purple-700 ring-purple-100",
    DELETED: "bg-rose-50 text-rose-700 ring-rose-100",
    VERIFIED: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    REQUESTED: "bg-amber-50 text-amber-700 ring-amber-100",
    REQUEST_CHANGES: "bg-orange-50 text-orange-700 ring-orange-100",
    REJECTED: "bg-rose-50 text-rose-700 ring-rose-100",
  };
  return map[status] || "bg-zinc-100 text-zinc-700 ring-zinc-200";
};

const riskBadge = (risk) => {
  if (risk === "High" || risk === "HIGH") return "bg-red-50 text-red-700 ring-red-100";
  if (risk === "Moderate" || risk === "MODERATE") return "bg-yellow-50 text-yellow-800 ring-yellow-100";
  return "bg-emerald-50 text-emerald-700 ring-emerald-100";
};

const mapVehicleDetails = (data) => {
  const userRole = data?.ownerInfo?.userRole || "";
  const isConsultation = userRole === "CONSULTATION";

  const displayInfo = isConsultation ? {
    name: data?.consultantInfo?.consultationName || "-",
    email: data?.consultantInfo?.companyEmail || "-",
    phone: "-",
    role: "CONSULTATION",
    status: data?.consultantInfo?.isActiveTier ? "ACTIVE" : "INACTIVE",
    username: data?.consultantInfo?.username || "-",
    logoUrl: data?.consultantInfo?.logoUrl || "",
    bannerUrl: data?.consultantInfo?.bannerUrl || "",
    establishmentYear: data?.consultantInfo?.establishmentYear || "-",
    tierPlanTitle: data?.consultantInfo?.tierPlanTitle || "-",
  } : {
    name: data?.ownerInfo?.fullName ||
      `${data?.ownerInfo?.firstname || ""} ${data?.ownerInfo?.lastname || ""}`.trim() || "-",
    email: data?.ownerInfo?.email || "-",
    phone: `${data?.ownerInfo?.countryCode || ""} ${data?.ownerInfo?.phoneNumber || ""}`.trim() || "-",
    role: data?.ownerInfo?.userRole || "-",
    status: data?.ownerInfo?.status || "-",
  };

  const title =
    [data?.makerName, data?.modelName, data?.variantName, data?.yearOfMfg]
      .filter(Boolean)
      .join(" • ") || "Vehicle";

  return {
    id: safeText(data?.id),
    title,
    thumb: safeText(data?.thumbnailUrl, ""),
    isConsultation,
    displayInfo,
    ownerInfo: data?.ownerInfo,
    consultantInfo: data?.consultantInfo,
    city: safeText(data?.city),
    inquiries: safeNumber(data?.inquiries, 0),
    vehicleType: safeText(data?.vehicleType),
    vehicleSubType: safeText(data?.vehicleSubType),
    makerId: safeText(data?.makerId),
    makerName: safeText(data?.makerName),
    modelId: safeText(data?.modelId),
    modelName: safeText(data?.modelName),
    variantId: safeText(data?.variantId),
    variantName: safeText(data?.variantName),
    yearOfMfg: safeText(data?.yearOfMfg),
    fuelType: safeText(data?.fuelType),
    isCngFitted: Boolean(data?.isCngFitted),
    cngType: safeText(data?.cngType),
    ownership: data?.ownership ?? "-",
    hasChallan: Boolean(data?.hasChallan),
    transmissionType: safeText(data?.transmissionType),
    colour: safeText(data?.colour),
    spareKey: Boolean(data?.spareKey),
    spareWheel: Boolean(data?.spareWheel),
    lastServiceDate: safeText(data?.lastServiceDate),
    testDriveAvl: Boolean(data?.testDriveAvl),
    kmDriven: data?.kmDriven ?? "-",
    price: safeNumber(data?.price, 0),
    closingPrice:
      data?.closingPrice === null || data?.closingPrice === undefined
        ? "-"
        : formatCurrency(data?.closingPrice),
    verificationStatus: safeText(data?.verificationStatus),
    inspectionStatus: safeText(data?.inspectionStatus),
    isVehicleSold: Boolean(data?.isVehicleSold),
    verifiedAt: safeText(data?.verifiedAt),
    adminRemark: safeText(data?.adminRemark),
    status: safeText(data?.status),
    createdAt: safeText(data?.createdAt),
    updatedAt: safeText(data?.updatedAt),
    ownerName: safeText(data?.ownerName),
    rankScore: safeNumber(data?.rankScore, 0),
    risk: safeText(data?.risk, "Low"),
    boost: Boolean(data?.isTierBoostActive ?? false),
    registrationNumber: safeText(data?.registrationNumber),
    chassisNumber: safeText(data?.chassisNumber),
    listingSource: safeText(data?.listingSource),
    location: safeText(data?.location),
    description: safeText(data?.description),
    insuranceValidTill: safeText(data?.insuranceValidTill),
    rcStatus: safeText(data?.rcStatus),
    galleryImages: Array.isArray(data?.vehicleImages)
      ? data.vehicleImages
        .filter((img) => img.status === "ACTIVE")
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
        .map((img) => ({
          id: img.imageId,
          url: img.isVideo ? img.videoThumbnailUrl : img.imageUrl,
          videoUrl: img.isVideo ? img.imageUrl : null,
          isVideo: img.isVideo,
          imageKey: img.imageKey,
          displayOrder: img.displayOrder,
        }))
      : data?.thumbnailUrl
        ? [{ id: "thumb", url: data.thumbnailUrl, isVideo: false }]
        : [],
    vehicleDocument: data?.vehicleDocument || null,
    inquiriesList: data?.inquiries || [],
    activityLogsList: data?.activityLogs || [],
    flagReviewsList: data?.flagReviews || [],
    raw: data,
  };
};

export default function PendingApprovalsReviewPanel({
  item,
  onApprove,
  onReject,
  onRequestChanges,
  onEscalate,
}) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [vehicle, setVehicle] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");

  const fetchVehicleDetails = async () => {
    try {
      if (!item.id) {
        throw new Error("Vehicle ID missing");
      }

      setLoading(true);
      setError("");
      setVehicle(null);

      const payload = await getVehicleDetailsEnhanced(item.id);
      const detail = payload?.data || null;

      if (!detail) {
        throw new Error("Vehicle details not found");
      }

      const mapped = mapVehicleDetails(detail);
      setVehicle(mapped);
      setSelectedImage(mapped.galleryImages?.[0] || null);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to load vehicle details");
      setVehicle(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicleDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 text-sm font-semibold text-zinc-800">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading vehicle details...
          </div>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
        <div className="rounded-[32px] border border-rose-200 bg-rose-50 px-6 py-14 text-center shadow-sm max-w-md">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-rose-600" />
          <div className="text-lg font-semibold text-rose-800">
            {error || "Vehicle details not found"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-[1450px] px-4 py-6 md:px-6">
        <div className="overflow-hidden rounded-[34px] border border-zinc-200 bg-white shadow-[0_18px_45px_rgba(0,0,0,0.06)]">
          <div className="border-b border-zinc-100 bg-white px-5 py-5 md:px-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-sm">
                    <img
                      src={vehicle.thumb || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=60"}
                      alt={vehicle.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-xl font-bold tracking-tight text-zinc-900 md:text-2xl">
                      {vehicle.title}
                    </h1>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className={cls("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1", riskBadge(vehicle.risk))}>
                        <ShieldAlert className="h-3 w-3" />
                        Risk: {vehicle.risk}
                      </span>

                      <span
                        className={cls(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                          vehicle.boost
                            ? "bg-purple-50 text-purple-700 ring-purple-100"
                            : "bg-zinc-100 text-zinc-700 ring-zinc-200"
                        )}
                      >
                        <Sparkles className="h-3 w-3" />
                        {vehicle.boost ? "Boost Active" : "No Boost"}
                      </span>

                      <span className={cls("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1", inspectionBadge(vehicle.inspectionStatus))}>
                        <ShieldCheck className="h-3 w-3" />
                        {vehicle.inspectionStatus?.replace(/_/g, " ") || "-"}
                      </span>

                      <span className={cls("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1", statusBadge(vehicle.status, vehicle.isVehicleSold))}>
                        <CheckCircle2 className="h-3 w-3" />
                        {vehicle.isVehicleSold ? "SOLD" : vehicle.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onApprove(item)}
                    className="inline-flex cursor-pointer h-10 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95"
                  >
                    <CheckCircle2 size={18} />
                    Approve
                  </button>
                  <button
                    onClick={() => onReject(item)}
                    className="inline-flex cursor-pointer h-10 items-center gap-2 rounded-xl bg-rose-600 px-4 text-sm font-bold text-white shadow-lg shadow-rose-600/20 transition-all hover:bg-rose-700 active:scale-95"
                  >
                    <XCircle size={18} />
                    Reject
                  </button>
                  <button
                    onClick={() => onRequestChanges(item)}
                    className="inline-flex cursor-pointer h-10 items-center gap-2 rounded-xl bg-amber-600 px-4 text-sm font-bold text-white shadow-lg shadow-amber-600/20 transition-all hover:bg-amber-700 active:scale-95"
                  >
                    <MessageSquareWarning size={18} />
                    Changes
                  </button>
                  <button
                    // onClick={() => onEscalate(item)}
                    className="inline-flex cursor-not-allowed h-10 items-center gap-2 rounded-xl bg-slate-600 px-4 text-sm font-bold text-white shadow-lg shadow-slate-600/20 transition-all hover:bg-slate-700 active:scale-95"
                  >
                    <ShieldAlert size={18} />
                    Escalate
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-zinc-100 pt-4 md:grid-cols-4">
                <StatItem label="Rank Score" value={`${vehicle.rankScore}/100`} />
                <StatItem label="City" value={vehicle.city} />
                <StatItem label="Price" value={formatCurrency(vehicle.price)} />
                <StatItem label="Inquiries" value={vehicle.inquiries} />
              </div>
            </div>
          </div>

          <div className="border-b border-zinc-100 bg-white px-3 py-3 md:px-4">
            <div className="flex gap-2 overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cls(
                    "whitespace-nowrap rounded-2xl px-4 py-2.5 text-sm font-semibold transition",
                    activeTab === tab
                      ? "bg-zinc-900 text-white shadow-sm"
                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          {activeTab === "Overview" && <OverviewTab vehicle={vehicle} selectedImage={selectedImage} setSelectedImage={setSelectedImage} />}
          {activeTab === "Inspection" && <InspectionTab vehicle={vehicle} />}
          {activeTab === "Inquiries" && <InquiriesTab vehicle={vehicle} />}
          {activeTab === "Flags & Fraud Signals" && <FlagsTab vehicle={vehicle} />}
          {activeTab === "Activity Log" && <ActivityLogTab vehicle={vehicle} />}
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{label}</div>
      <div className="mt-1 text-lg font-bold text-zinc-900">{value}</div>
    </div>
  );
}

function SectionCard({ title, subtitle, children }) {
  return (
    <div className="rounded-[28px] border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-100 px-5 py-4">
        <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
        {subtitle ? <p className="text-sm text-zinc-500">{subtitle}</p> : null}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function InfoItem({ label, value, full = false }) {
  return (
    <div className={cls(full ? "col-span-2" : "")}>
      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-zinc-900 break-words">{value || "-"}</div>
    </div>
  );
}

function InfoLine({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3">
      <div className="mt-0.5 text-zinc-500">{icon}</div>
      <div className="min-w-0">
        <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</div>
        <div className="mt-1 text-sm font-semibold text-zinc-900 break-words">{value || "-"}</div>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="rounded-[28px] border border-dashed border-zinc-300 bg-zinc-50 px-6 py-12 text-center">
      <div className="mx-auto mb-3 inline-flex rounded-2xl bg-white p-3 text-zinc-700 shadow-sm">
        {icon}
      </div>
      <div className="text-base font-semibold text-zinc-900">{title}</div>
      <div className="mt-1 text-sm text-zinc-500">{subtitle}</div>
    </div>
  );
}

function OverviewTab({ vehicle, selectedImage, setSelectedImage }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="Vehicle Overview" subtitle="Specifications and listing metadata">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <InfoItem label="Maker" value={vehicle.makerName} />
            <InfoItem label="Model" value={vehicle.modelName} />
            <InfoItem label="Variant" value={vehicle.variantName} />
            <InfoItem label="Vehicle Type" value={formatEnumLabel(vehicle.vehicleType)} />
            <InfoItem label="Vehicle Sub Type" value={vehicle.vehicleSubType} />
            <InfoItem label="Registration Number" value={vehicle.registrationNumber} />
            <InfoItem label="Year Of Mfg" value={vehicle.yearOfMfg} />
            <InfoItem label="Fuel Type" value={vehicle.fuelType} />
            <InfoItem label="Transmission Type" value={vehicle.transmissionType} />
            <InfoItem label="Ownership" value={vehicle.ownership} />
            <InfoItem label="Color" value={vehicle.colour} />
            <InfoItem label="KM Driven" value={vehicle.kmDriven} />
            <InfoItem label="Price" value={formatCurrency(vehicle.price)} />
            <InfoItem label="Closing Price" value={vehicle.closingPrice} />
            <InfoItem label="Inspection Status" value={formatEnumLabel(vehicle.inspectionStatus)} />
            <InfoItem label="Verification Status" value={formatEnumLabel(vehicle.verificationStatus)} />
            <InfoItem label="Has Challan" value={vehicle.hasChallan ? "Yes" : "No"} />
            <InfoItem label="Spare Key" value={vehicle.spareKey ? "Yes" : "No"} />
            <InfoItem label="Spare Wheel" value={vehicle.spareWheel ? "Yes" : "No"} />
            <InfoItem label="CNG Fitted" value={vehicle.isCngFitted ? "Yes" : "No"} />
            <InfoItem label="CNG Type" value={vehicle.cngType} />
            <InfoItem label="Test Drive Available" value={vehicle.testDriveAvl ? "Yes" : "No"} />
            <InfoItem label="Last Service Date" value={formatDateTime(vehicle.lastServiceDate)} />
            <InfoItem label="Verified At" value={formatDateTime(vehicle.verifiedAt)} />
            <InfoItem label="Created At" value={formatDateTime(vehicle.createdAt)} />
            <InfoItem label="Updated At" value={formatDateTime(vehicle.updatedAt)} />
            <InfoItem label="Chassis Number" value={vehicle.chassisNumber} />
            <InfoItem label="City" value={vehicle.city} />
            <InfoItem label="Location" value={vehicle.location} />
            <InfoItem label="Listing Source" value={vehicle.listingSource} />
            <InfoItem label="Insurance Valid Till" value={vehicle.insuranceValidTill} />
            <InfoItem label="RC Status" value={vehicle.rcStatus} />
            <InfoItem label="Admin Remark" value={vehicle.adminRemark} full />
            <InfoItem label="Description" value={vehicle.description} full />
          </div>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title="Vehicle Media" subtitle={`${vehicle.galleryImages?.length || 0} images/videos`}>
            {vehicle.galleryImages?.length ? (
              <div className="space-y-4">
                <div className="overflow-hidden rounded-[28px] border border-zinc-200 bg-zinc-100">
                  {selectedImage?.isVideo ? (
                    <video
                      src={selectedImage.videoUrl}
                      controls
                      className="h-[320px] w-full object-cover"
                    />
                  ) : (
                    <img
                      src={selectedImage?.url || vehicle.galleryImages[0]?.url}
                      alt="vehicle"
                      className="h-[320px] w-full object-cover"
                    />
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {vehicle.galleryImages.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(img)}
                      className={cls(
                        "relative cursor-pointer overflow-hidden rounded-2xl border p-1 transition",
                        selectedImage?.id === img.id
                          ? "border-zinc-900 ring-2 ring-zinc-900/10"
                          : "border-zinc-200 hover:border-zinc-400"
                      )}
                    >
                      <img
                        src={img.url}
                        alt={img.imageKey}
                        className="h-20 w-full rounded-xl object-cover"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                      {img.isVideo && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="rounded-full bg-white/95 p-2 shadow-lg">
                            <svg className="h-5 w-5 text-zinc-900" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2 rounded-md bg-black/80 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-sm">
                        {img.imageKey?.replace(/_/g, " ")}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState
                icon={<Camera className="h-5 w-5" />}
                title="No gallery images available"
                subtitle="No images or videos have been uploaded for this vehicle."
              />
            )}
          </SectionCard>

          <SectionCard title="Vehicle Documents" subtitle="Registration and compliance documents">
            {vehicle.vehicleDocument ? (
              <div className="space-y-4">
                <InfoLine
                  icon={<FileText className="h-4 w-4" />}
                  label="Registration Number"
                  value={vehicle.vehicleDocument.regNumber}
                />
                <InfoLine
                  icon={<MapPin className="h-4 w-4" />}
                  label="RTO Passing"
                  value={vehicle.vehicleDocument.rtoPassing}
                />
                <InfoLine
                  icon={<MapPin className="h-4 w-4" />}
                  label="Registration State"
                  value={vehicle.vehicleDocument.regState}
                />
                <InfoLine
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="Registration Date"
                  value={formatDate(vehicle.vehicleDocument.regDate)}
                />

                <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Insurance</p>
                    <span className={cls(
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ring-1",
                      vehicle.vehicleDocument.insurance
                        ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                        : "bg-rose-50 text-rose-700 ring-rose-100"
                    )}>
                      {vehicle.vehicleDocument.insurance ? "✓ Active" : "✗ Not Active"}
                    </span>
                  </div>
                  {vehicle.vehicleDocument.insurance && (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Type:</span>
                        <span className="font-semibold text-zinc-900">{vehicle.vehicleDocument.typeOfInsurance || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Expiry:</span>
                        <span className="font-semibold text-zinc-900">{formatDate(vehicle.vehicleDocument.insuranceExpiryDate)}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">PUC (Pollution)</p>
                    <span className={cls(
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ring-1",
                      vehicle.vehicleDocument.puc
                        ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                        : "bg-rose-50 text-rose-700 ring-rose-100"
                    )}>
                      {vehicle.vehicleDocument.puc ? "✓ Valid" : "✗ Not Valid"}
                    </span>
                  </div>
                  {vehicle.vehicleDocument.puc && (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Expiry:</span>
                        <span className="font-semibold text-zinc-900">{formatDate(vehicle.vehicleDocument.pucExpiryDate)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {vehicle.vehicleDocument.rcFrontUrl && (
                  <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">RC Front Image</p>
                    <img
                      src={vehicle.vehicleDocument.rcFrontUrl}
                      alt="RC Front"
                      className="h-48 w-full rounded-xl object-cover border border-zinc-200"
                    />
                  </div>
                )}
              </div>
            ) : (
              <EmptyState
                icon={<FileText className="h-5 w-5" />}
                title="No documents available"
                subtitle="Vehicle documents have not been uploaded yet."
              />
            )}
          </SectionCard>
        </div>
      </div>

      <SectionCard
        title={vehicle.isConsultation ? "Consultant Details" : "Seller Details"}
        subtitle={vehicle.isConsultation ? "Consultation information" : "Seller information"}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vehicle.isConsultation ? (
            <>
              <InfoLine icon={<User className="h-4 w-4" />} label="Consultation Name" value={vehicle.displayInfo.name} />
              <InfoLine icon={<User className="h-4 w-4" />} label="Username" value={vehicle.displayInfo.username} />
              <InfoLine icon={<Mail className="h-4 w-4" />} label="Company Email" value={vehicle.displayInfo.email} />
              <InfoLine icon={<ShieldCheck className="h-4 w-4" />} label="Tier Plan" value={vehicle.displayInfo.tierPlanTitle} />
              <InfoLine icon={<CalendarDays className="h-4 w-4" />} label="Establishment Year" value={vehicle.displayInfo.establishmentYear} />
              <InfoLine icon={<ShieldCheck className="h-4 w-4" />} label="Status" value={vehicle.displayInfo.status} />
              {vehicle.consultantInfo?.logoUrl && (
                <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-2">Logo</p>
                  <img src={vehicle.consultantInfo.logoUrl} alt="Logo" className="h-16 w-16 rounded-xl object-cover border border-zinc-200" />
                </div>
              )}
              {vehicle.consultantInfo?.bannerUrl && (
                <div className="col-span-full rounded-2xl border border-zinc-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-2">Banner</p>
                  <img src={vehicle.consultantInfo.bannerUrl} alt="Banner" className="h-32 w-full rounded-xl object-cover border border-zinc-200" />
                </div>
              )}
            </>
          ) : (
            <>
              <InfoLine icon={<User className="h-4 w-4" />} label="Owner Name" value={vehicle.displayInfo.name} />
              <InfoLine icon={<Mail className="h-4 w-4" />} label="Email" value={vehicle.displayInfo.email} />
              <InfoLine icon={<Phone className="h-4 w-4" />} label="Phone" value={vehicle.displayInfo.phone} />
              <InfoLine icon={<ShieldCheck className="h-4 w-4" />} label="Role" value={vehicle.displayInfo.role} />
              <InfoLine icon={<ShieldCheck className="h-4 w-4" />} label="Status" value={vehicle.displayInfo.status} />
              <InfoLine icon={<MapPin className="h-4 w-4" />} label="City" value={vehicle.city} />
            </>
          )}
        </div>
      </SectionCard>
    </div>
  );
}

function InspectionTab({ vehicle }) {
  return (
    <SectionCard title="Inspection Summary" subtitle="Available from current API">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <InfoItem label="Inspection Status" value={formatEnumLabel(vehicle.inspectionStatus)} />
        <InfoItem label="Verification Status" value={formatEnumLabel(vehicle.verificationStatus)} />
        <InfoItem label="Verified At" value={formatDateTime(vehicle.verifiedAt)} />
        <InfoItem label="Inspection Report PDF" value={safeText(vehicle.raw?.reportPdfUrl)} />
        <InfoItem label="Inspection Video" value={safeText(vehicle.raw?.videoUrl)} />
        <InfoItem label="Inspector ID" value={safeText(vehicle.raw?.inspectorId)} />
      </div>
    </SectionCard>
  );
}

function InquiriesTab({ vehicle }) {
  return (
    <SectionCard title="Inquiry Monitoring" subtitle={`${vehicle.inquiriesList?.length || 0} inquiries found`}>
      {vehicle.inquiriesList && vehicle.inquiriesList.length > 0 ? (
        <div className="space-y-4">
          {vehicle.inquiriesList.map((inquiry) => (
            <div
              key={inquiry.inquiryId}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/20">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-zinc-900">{inquiry.buyerName}</h4>
                    <div className="mt-1 flex items-center gap-3 text-sm text-zinc-500">
                      <div className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{inquiry.buyerPhone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        <span>{formatDateTime(inquiry.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cls(
                      "inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ring-1",
                      inquiry.inquiryStatus === "APPROVED"
                        ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                        : inquiry.inquiryStatus === "REJECTED"
                          ? "bg-rose-50 text-rose-700 ring-rose-100"
                          : "bg-amber-50 text-amber-700 ring-amber-100"
                    )}
                  >
                    {inquiry.inquiryStatus}
                  </span>
                  {inquiry.chatInitiated && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700 ring-1 ring-sky-100">
                      <MessageSquare className="h-3 w-3" />
                      Chat Active
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-xl bg-zinc-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Inquiry Title</p>
                  <p className="mt-1 text-sm font-semibold text-zinc-900">{inquiry.inquiryTitle}</p>
                </div>
                <div className="rounded-xl bg-zinc-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Description</p>
                  <p className="mt-1 text-sm text-zinc-700">{inquiry.inquiryDescription}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<MessageSquare className="h-5 w-5" />}
          title="No inquiries found"
          subtitle="This vehicle hasn't received any inquiries yet."
        />
      )}
    </SectionCard>
  );
}

function FlagsTab({ vehicle }) {
  return (
    <SectionCard title="Fraud Signals" subtitle={`${vehicle.flagReviewsList?.length || 0} flags found`}>
      {vehicle.flagReviewsList && vehicle.flagReviewsList.length > 0 ? (
        <div className="space-y-4">
          {vehicle.flagReviewsList.map((flag) => (
            <div
              key={flag.flagReviewId}
              className={cls(
                "rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md",
                flag.isDeleted
                  ? "border-emerald-200 bg-emerald-50/30"
                  : "border-zinc-200 bg-white"
              )}
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={cls(
                    "flex h-12 w-12 items-center justify-center rounded-xl shadow-lg",
                    flag.isDeleted
                      ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-emerald-500/20"
                      : flag.severity === "HIGH"
                        ? "bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-rose-500/20"
                        : flag.severity === "MODERATE"
                          ? "bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-amber-500/20"
                          : "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-emerald-500/20"
                  )}>
                    <Flag className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-zinc-900">{flag.flagCategory?.replace(/_/g, " ")}</h4>
                      {flag.isDeleted && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                          <CheckCircle2 className="h-3 w-3" />
                          CLEARED
                        </span>
                      )}
                      {!flag.isDeleted && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 ring-1 ring-rose-200">
                          <ShieldAlert className="h-3 w-3" />
                          RAISED
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-sm text-zinc-500">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        <span>Flagged: {formatDateTime(flag.flaggedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cls(
                      "inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ring-1",
                      flag.severity === "HIGH"
                        ? "bg-rose-50 text-rose-700 ring-rose-100"
                        : flag.severity === "MODERATE"
                          ? "bg-amber-50 text-amber-700 ring-amber-100"
                          : "bg-emerald-50 text-emerald-700 ring-emerald-100"
                    )}
                  >
                    {flag.severity}
                  </span>
                  <span
                    className={cls(
                      "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ring-1",
                      flag.isResolved
                        ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                        : "bg-amber-50 text-amber-700 ring-amber-100"
                    )}
                  >
                    {flag.isResolved ? (
                      <>
                        <CheckCircle2 className="h-3 w-3" />
                        Resolved
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="h-3 w-3" />
                        Pending
                      </>
                    )}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className={cls(
                  "rounded-xl p-4",
                  flag.isDeleted ? "bg-emerald-50/50" : "bg-zinc-50"
                )}>
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Flag ID</p>
                  <p className="mt-1 text-sm font-mono text-zinc-900">{flag.flagReviewId}</p>
                </div>
                {flag.internalNotes && (
                  <div className={cls(
                    "rounded-xl p-4",
                    flag.isDeleted ? "bg-emerald-50/50" : "bg-zinc-50"
                  )}>
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Internal Notes</p>
                    <p className="mt-1 text-sm text-zinc-700">{flag.internalNotes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Flag className="h-5 w-5" />}
          title="No fraud signals found"
          subtitle="This vehicle has no flagged reviews or fraud signals."
        />
      )}
    </SectionCard>
  );
}

function ActivityLogTab({ vehicle }) {
  return (
    <SectionCard title="Audit Trail" subtitle={`${vehicle.activityLogsList?.length || 0} activity logs found`}>
      {vehicle.activityLogsList && vehicle.activityLogsList.length > 0 ? (
        <div className="space-y-4">
          {vehicle.activityLogsList.map((log, index) => (
            <div
              key={log.activityId}
              className="relative rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
            >
              {index !== vehicle.activityLogsList.length - 1 && (
                <div className="absolute left-[38px] top-[72px] h-[calc(100%+16px)] w-0.5 bg-zinc-200" />
              )}

              <div className="flex items-start gap-4">
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/20">
                  <Activity className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="mb-2 flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-base font-bold text-zinc-900">{log.action}</h4>
                      <p className="mt-1 text-sm text-zinc-600">{log.description}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="flex items-center gap-1 text-xs font-semibold text-zinc-400">
                        <Clock3 className="h-3.5 w-3.5" />
                        {formatDateTime(log.performedAt)}
                      </div>
                      <p className="mt-1 text-xs font-semibold text-zinc-600">by {log.adminName}</p>
                    </div>
                  </div>

                  {log.remarks && (
                    <div className="mt-3 rounded-xl bg-zinc-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Additional Details</p>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-semibold text-zinc-500">Admin:</span>
                          <span className="text-xs text-zinc-700">{log.adminName}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-semibold text-zinc-500">Action:</span>
                          <span className="text-xs text-zinc-700">{log.action}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-semibold text-zinc-500">Description:</span>
                          <span className="text-xs text-zinc-700">{log.description}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-semibold text-zinc-500">Remarks:</span>
                          <span className="text-xs text-zinc-700">{log.remarks}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-semibold text-zinc-500">Performed At:</span>
                          <span className="text-xs text-zinc-700">{formatDateTime(log.performedAt)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Activity className="h-5 w-5" />}
          title="No activity logs found"
          subtitle="No administrative actions have been recorded for this vehicle."
        />
      )}
    </SectionCard>
  );
}
