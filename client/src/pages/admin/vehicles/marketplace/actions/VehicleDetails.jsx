import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Clock3,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  FileText,
  Camera,
  MessageSquare,
  Activity,
  RefreshCw,
  Flag,
  Loader2,
  ChevronRight,
  Info,
  CheckCircle2,
  CarFront,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getVehicleById,
  normalizeVehicleDetailResponse,
} from "../../../../../api/vehicle.api";

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
  if (risk === "High") return "bg-red-50 text-red-700 ring-red-100";
  if (risk === "Moderate") return "bg-yellow-50 text-yellow-800 ring-yellow-100";
  return "bg-emerald-50 text-emerald-700 ring-emerald-100";
};

const mapVehicleDetails = (data) => {
  const consultantName =
    `${data?.userMaster?.firstname || ""} ${data?.userMaster?.lastname || ""}`.trim() ||
    data?.userName ||
    "-";

  const title =
    [data?.makerName, data?.modelName, data?.variantName, data?.yearOfMfg]
      .filter(Boolean)
      .join(" • ") || "Vehicle";

  return {
    id: safeText(data?.id),
    title,
    thumb: safeText(data?.thumbnailUrl, ""),
    consultantName,
    consultantEmail: safeText(data?.userMaster?.email),
    consultantPhone:
      `${data?.userMaster?.countryCode || ""} ${data?.userMaster?.phoneNumber || ""}`.trim() || "-",
    consultantId: safeText(data?.userMaster?.id),
    consultantRole: safeText(data?.userMaster?.userRole),
    consultantStatus: safeText(data?.userMaster?.status),

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

    // missing in current api
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

    galleryImages: Array.isArray(data?.galleryImages)
      ? data.galleryImages
      : data?.thumbnailUrl
        ? [data.thumbnailUrl]
        : [],
    raw: data,
  };
};

const VehicleDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const resolvedVehicleId = params.id || params.vehicleId || "";

  const [activeTab, setActiveTab] = useState("Overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [vehicle, setVehicle] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");

  const fetchVehicleDetails = async () => {
    try {
      if (!resolvedVehicleId) {
        throw new Error("Vehicle ID missing in route");
      }

      setLoading(true);
      setError("");
      setVehicle(null);

      const payload = await getVehicleById(resolvedVehicleId);
      const detail = normalizeVehicleDetailResponse(payload);

      if (!detail) {
        throw new Error("Vehicle details not found");
      }

      const mapped = mapVehicleDetails(detail);
      setVehicle(mapped);
      setSelectedImage(mapped.galleryImages?.[0] || "");
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
  }, [resolvedVehicleId]);

  const missingFields = useMemo(() => {
    if (!vehicle) return [];

    const checks = [
      ["City", vehicle.city],
      ["Owner Name", vehicle.ownerName],
      ["Registration Number", vehicle.registrationNumber],
      ["Chassis Number", vehicle.chassisNumber],
      ["Rank Score", vehicle.rankScore > 0 ? vehicle.rankScore : ""],
      ["Boost Status", vehicle.boost ? "Yes" : ""],
      ["Listing Source", vehicle.listingSource],
      ["Location", vehicle.location],
      ["Description", vehicle.description],
      ["Insurance Valid Till", vehicle.insuranceValidTill],
      ["RC Status", vehicle.rcStatus],
      ["Gallery Images", vehicle.galleryImages?.length > 1 ? "Yes" : ""],
      ["Inspection Report PDF", vehicle.raw?.reportPdfUrl],
      ["Inspection Video", vehicle.raw?.videoUrl],
      ["Inspector ID", vehicle.raw?.inspectorId],
      ["Inquiry List", Array.isArray(vehicle.raw?.inquiryList) && vehicle.raw.inquiryList.length ? "Yes" : ""],
      ["Fraud Signals", vehicle.raw?.fraudSignals],
      ["Activity Logs", Array.isArray(vehicle.raw?.activityLogs) && vehicle.raw.activityLogs.length ? "Yes" : ""],
    ];

    return checks.filter(([, v]) => !v || v === "-").map(([label]) => label);
  }, [vehicle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <div className="mx-auto max-w-[1450px] px-4 py-8 md:px-6">
          <div className="rounded-[32px] border border-zinc-200 bg-white px-6 py-20 text-center shadow-sm">
            <div className="inline-flex items-center gap-3 text-sm font-semibold text-zinc-800">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading vehicle details...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <div className="mx-auto max-w-[1450px] px-4 py-8 md:px-6">
          <div className="mb-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm hover:bg-zinc-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          </div>

          <div className="rounded-[32px] border border-rose-200 bg-rose-50 px-6 py-14 text-center shadow-sm">
            <div className="text-lg font-semibold text-rose-800">
              {error || "Vehicle details not found"}
            </div>
            <button
              onClick={fetchVehicleDetails}
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-[1450px] px-4 py-6 md:px-6">
        <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 font-semibold text-zinc-800 shadow-sm hover:bg-zinc-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <ChevronRight className="h-4 w-4" />
          <span>Marketplace</span>
          <ChevronRight className="h-4 w-4" />
          <span>All Vehicles</span>
          <ChevronRight className="h-4 w-4" />
          <span className="font-semibold text-zinc-900">Vehicle Details</span>
        </div>

        <div className="overflow-hidden rounded-[34px] border border-zinc-200 bg-white shadow-[0_18px_45px_rgba(0,0,0,0.06)]">
          <div className="border-b border-zinc-100 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 px-5 py-6 text-white md:px-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className={cls("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1", riskBadge(vehicle.risk))}>
                    <ShieldAlert className="h-3.5 w-3.5" />
                    Risk: {vehicle.risk}
                  </span>

                  <span
                    className={cls(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1",
                      vehicle.boost
                        ? "bg-purple-50 text-purple-700 ring-purple-100"
                        : "bg-zinc-100 text-zinc-700 ring-zinc-200"
                    )}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {vehicle.boost ? "Boost Active" : "No Boost"}
                  </span>

                  <span className={cls("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1", inspectionBadge(vehicle.inspectionStatus))}>
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {vehicle.inspectionStatus?.replace(/_/g, " ") || "-"}
                  </span>

                  <span className={cls("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1", statusBadge(vehicle.status, vehicle.isVehicleSold))}>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {vehicle.isVehicleSold ? "SOLD" : vehicle.status}
                  </span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                  {vehicle.title}
                </h1>
                <p className="mt-2 text-sm text-zinc-300">
                  Vehicle ID: <span className="font-semibold text-white">{vehicle.id}</span>
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                  <TopStat label="Rank Score" value={`${vehicle.rankScore}/100`} />
                  <TopStat label="City" value={vehicle.city} />
                  <TopStat label="Price" value={formatCurrency(vehicle.price)} />
                  <TopStat label="Inquiries" value={vehicle.inquiries} />
                </div>
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
          {activeTab === "Overview" && (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <SectionCard title="Vehicle Overview" subtitle="Specifications and listing metadata">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <InfoItem label="Vehicle ID" value={vehicle.id} />
                  <InfoItem label="Maker" value={vehicle.makerName} />
                  <InfoItem label="Model" value={vehicle.modelName} />
                  <InfoItem label="Variant" value={vehicle.variantName} />
                  <InfoItem label="Vehicle Type" value={vehicle.vehicleType} />
                  <InfoItem label="Vehicle Sub Type" value={vehicle.vehicleSubType} />
                  <InfoItem label="Year Of Mfg" value={vehicle.yearOfMfg} />
                  <InfoItem label="Fuel Type" value={vehicle.fuelType} />
                  <InfoItem label="Transmission Type" value={vehicle.transmissionType} />
                  <InfoItem label="Ownership" value={vehicle.ownership} />
                  <InfoItem label="Color" value={vehicle.colour} />
                  <InfoItem label="KM Driven" value={vehicle.kmDriven} />
                  <InfoItem label="Price" value={formatCurrency(vehicle.price)} />
                  <InfoItem label="Closing Price" value={vehicle.closingPrice} />
                  <InfoItem label="Inspection Status" value={vehicle.inspectionStatus} />
                  <InfoItem label="Verification Status" value={vehicle.verificationStatus} />
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
                  <InfoItem label="Registration Number" value={vehicle.registrationNumber} />
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
                <SectionCard title="Vehicle Media" subtitle="Current API media support">
                  {vehicle.galleryImages?.length ? (
                    <div className="space-y-4">
                      <div className="overflow-hidden rounded-[28px] border border-zinc-200 bg-zinc-100">
                        <img
                          src={selectedImage || vehicle.galleryImages[0]}
                          alt="vehicle"
                          className="h-[320px] w-full object-cover"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {vehicle.galleryImages.map((img, idx) => (
                          <button
                            key={`${img}-${idx}`}
                            onClick={() => setSelectedImage(img)}
                            className={cls(
                              "overflow-hidden rounded-3xl border p-1 transition",
                              selectedImage === img
                                ? "border-zinc-900 ring-2 ring-zinc-900/10"
                                : "border-zinc-200 hover:border-zinc-400"
                            )}
                          >
                            <img src={img} alt="" className="h-24 w-full rounded-[20px] object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <EmptyState
                      icon={<Camera className="h-5 w-5" />}
                      title="No gallery images available"
                      subtitle="Current API provides only thumbnail or no media list."
                    />
                  )}
                </SectionCard>

                <SectionCard title="Consultant Details" subtitle="Mapped from userMaster">
                  <div className="space-y-4">
                    <InfoLine icon={<User className="h-4 w-4" />} label="Consultant Name" value={vehicle.consultantName} />
                    <InfoLine icon={<Mail className="h-4 w-4" />} label="Email" value={vehicle.consultantEmail} />
                    <InfoLine icon={<Phone className="h-4 w-4" />} label="Phone" value={vehicle.consultantPhone} />
                    <InfoLine icon={<ShieldCheck className="h-4 w-4" />} label="Role" value={vehicle.consultantRole} />
                    <InfoLine icon={<ShieldCheck className="h-4 w-4" />} label="Status" value={vehicle.consultantStatus} />
                    <InfoLine icon={<MapPin className="h-4 w-4" />} label="City" value={vehicle.city} />
                  </div>
                </SectionCard>
              </div>
            </div>
          )}

          {activeTab === "Inspection" && (
            <SectionCard title="Inspection Summary" subtitle="Available from current API">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <InfoItem label="Inspection Status" value={vehicle.inspectionStatus} />
                <InfoItem label="Verification Status" value={vehicle.verificationStatus} />
                <InfoItem label="Verified At" value={formatDateTime(vehicle.verifiedAt)} />
                <InfoItem label="Inspection Report PDF" value={safeText(vehicle.raw?.reportPdfUrl)} />
                <InfoItem label="Inspection Video" value={safeText(vehicle.raw?.videoUrl)} />
                <InfoItem label="Inspector ID" value={safeText(vehicle.raw?.inspectorId)} />
              </div>
            </SectionCard>
          )}

          {activeTab === "Inquiries" && (
            <SectionCard title="Inquiry Monitoring" subtitle="Current API has no inquiry list">
              <EmptyState
                icon={<MessageSquare className="h-5 w-5" />}
                title="No inquiry list available"
                subtitle="Current detail API only provides inquiry count/null."
              />
            </SectionCard>
          )}

          {activeTab === "Flags & Fraud Signals" && (
            <SectionCard title="Fraud Signals" subtitle="Current API has no fraud payload">
              <EmptyState
                icon={<Flag className="h-5 w-5" />}
                title="No fraud signals available"
                subtitle="Current detail API does not provide fraud signal details."
              />
            </SectionCard>
          )}

          {activeTab === "Activity Log" && (
            <SectionCard title="Audit Trail" subtitle="Current API has no activity log">
              <EmptyState
                icon={<Activity className="h-5 w-5" />}
                title="No activity logs available"
                subtitle="Current detail API does not return audit trail entries."
              />
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
};

function TopStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="text-xs uppercase tracking-wide text-zinc-300">{label}</div>
      <div className="mt-1 text-xl font-bold">{value}</div>
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

function RankRow({ label, value, color, negative = false }) {
  const width = Math.max(0, Math.min(Number(value) || 0, 100));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-semibold text-zinc-800">{label}</span>
        <span className={cls("font-bold", negative ? "text-rose-600" : "text-zinc-900")}>
          {negative ? `-${width}` : `${width}`}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-zinc-100">
        <div className={cls("h-full rounded-full", color)} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

export default VehicleDetails;