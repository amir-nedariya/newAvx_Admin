import React, { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  ArrowLeft,
  Ban,
  RotateCcw,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getConsultationById,
  unsuspendConsultation,
  approveKYCConsultation,
  rejectKYCConsultation,
  requestUploadKYCConsultation,
} from "../../../../api/consultationApi";

const cls = (...a) => a.filter(Boolean).join(" ");

/* ================= FORMATTERS ================= */
const safe = (v) => (v === null || v === undefined || v === "" ? "—" : v);

const fmtInt = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(n) : 0;
};

const fmtPct = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return "0%";
  return `${Number(n).toFixed(1).replace(".0", "")}%`;
};

const fmtResponse = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return "N/A";

  if (n > 3600) {
    const hours = n / 3600;
    return `${hours.toFixed(1).replace(".0", "")}h`;
  }

  if (n <= 24) return `${n.toFixed(1).replace(".0", "")}h`;

  const h = n / 60;
  return `${h.toFixed(1).replace(".0", "")}h`;
};

const getErrorMessage = (e, fallback = "Something went wrong") => {
  return (
    e?.response?.data?.message ||
    e?.response?.data?.error ||
    e?.message ||
    fallback
  );
};

/* ================= SMALL UI PARTS ================= */
const Pill = ({ tone = "slate", children }) => {
  const map = {
    slate: "bg-slate-50 text-slate-700 border-slate-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    red: "bg-rose-50 text-rose-700 border-rose-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };

  return (
    <span
      className={cls(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold",
        map[tone] || map.slate
      )}
    >
      {children}
    </span>
  );
};

const Stat = ({ label, value, highlight = false }) => (
  <div className="min-w-[160px] flex-1 py-3">
    <p className="text-[11px] uppercase tracking-wide text-slate-500">
      {label}
    </p>
    <p
      className={cls(
        "mt-1 text-lg font-extrabold",
        highlight ? "text-emerald-700" : "text-slate-900"
      )}
    >
      {value}
    </p>
  </div>
);

const InfoItem = ({ icon: Icon, children }) => (
  <span className="inline-flex items-center gap-2 text-sm text-slate-600">
    <Icon size={16} className="text-slate-400" />
    <span className="font-semibold">{children}</span>
  </span>
);

const CardField = ({ label, value }) => (
  <div className="py-3">
    <p className="text-[11px] uppercase tracking-wide text-slate-500">
      {label}
    </p>
    <p className="mt-1 text-sm font-semibold text-slate-900">{safe(value)}</p>
  </div>
);

const DocChip = ({ ok, text, onClick, clickable = false }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={!clickable}
    className={cls(
      "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold transition",
      ok
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-slate-200 bg-slate-50 text-slate-700",
      clickable
        ? "cursor-pointer hover:scale-[1.02] hover:shadow-sm"
        : "cursor-default"
    )}
  >
    {ok ? (
      <CheckCircle2 size={14} />
    ) : (
      <AlertTriangle size={14} className="text-amber-500" />
    )}
    {text}
  </button>
);

/* ================= IMAGE MODAL ================= */
function DocumentImageModal({ open, onClose, title, imageUrl }) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-slate-900/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed left-1/2 top-1/2 z-[101] w-[95%] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              {title}
            </h3>
            <p className="mt-1 text-xs text-slate-500">Document preview</p>
          </div>

          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex max-h-[80vh] min-h-[320px] items-center justify-center bg-slate-100 p-4">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="max-h-[72vh] w-auto max-w-full rounded-xl border border-slate-200 bg-white object-contain shadow-sm"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400">
              <ImageIcon size={34} />
              <p className="mt-2 text-sm font-semibold">No image available</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ================= ACTION MODAL ================= */
function ActionRemarkModal({
  open,
  title,
  label,
  value,
  setValue,
  confirmText,
  loading,
  onClose,
  onConfirm,
  placeholder,
}) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed left-1/2 top-1/2 z-[111] w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              {title}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Please enter the required note before continuing.
            </p>
          </div>

          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5">
          <label className="mb-2 block text-sm font-bold text-slate-700">
            {label}
          </label>

          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={5}
            placeholder={placeholder}
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
          />

          <div className="mt-5 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={loading || !value.trim()}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Processing..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ================= MAIN ================= */
const ConsultantProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [kycActionLoading, setKycActionLoading] = useState("");
  const [activeTab, setActiveTab] = useState("Overview");

  const [docModal, setDocModal] = useState({
    open: false,
    title: "",
    imageUrl: "",
  });

  const [actionModal, setActionModal] = useState({
    open: false,
    type: "",
  });

  const [reasonText, setReasonText] = useState("");
  const [remarkText, setRemarkText] = useState("");

  const profile = useMemo(() => {
    const d = data?.data ? data.data : data;
    if (!d) return null;

    const tierTitle = d?.tierTitle || "—";
    const status = String(d?.status || "").toUpperCase() || "—";

    const verification =
      (d?.verificationStatus
        ? String(d.verificationStatus).toUpperCase()
        : null) ||
      (d?.addressVerifiedStatus
        ? String(d.addressVerifiedStatus).toUpperCase()
        : null) ||
      "PENDING";

    const risk = d?.risk ? String(d.risk) : "Low";

    const name =
      d?.consultationName || d?.consultName || d?.ownerName || "Consultant";
    const username = d?.username || "—";

    const city = d?.cityName || "—";
    const state = d?.stateName || "—";
    const location =
      city !== "—" && state !== "—"
        ? `${city}, ${state}`
        : city !== "—"
        ? city
        : state;

    const tierTone = tierTitle.toLowerCase().includes("premium")
      ? "green"
      : tierTitle.toLowerCase().includes("pro")
      ? "blue"
      : "slate";

    const verifiedTone =
      verification === "VERIFIED"
        ? "green"
        : verification === "REJECTED"
        ? "red"
        : verification === "REQUEST_CHANGES"
        ? "amber"
        : verification === "REQUESTED"
        ? "blue"
        : "slate";

    const statusTone =
      status === "ACTIVE"
        ? "green"
        : status === "INACTIVE"
        ? "slate"
        : status === "DELETED"
        ? "red"
        : "slate";

    const kycLabel =
      verification === "VERIFIED"
        ? "KYC: Approved"
        : verification === "REJECTED"
        ? "KYC: Rejected"
        : verification === "REQUEST_CHANGES"
        ? "KYC: Changes Requested"
        : verification === "REQUESTED"
        ? "KYC: Requested"
        : "KYC: Pending";

    const riskLabel = risk?.trim() ? risk : "Low";

    return {
      raw: d,
      consultId: d?.consultId || d?.id || id,
      name,
      username,
      ownerName: d?.ownerName || "—",

      tierId: d?.tierId || null,
      tierTitle,
      tierTone,

      status,
      statusTone,

      verification,
      verifiedTone,
      kycLabel,

      risk: riskLabel,

      location: location || "—",
      email: d?.companyEmail || "—",
      phone: d?.phoneNumber || "—",

      bannerUrl: d?.bannerUrl || null,
      logoUrl: d?.logoUrl || d?.logoURL || null,

      totalVehicles: fmtInt(d?.totalVehicles),
      totalActiveVehicles: fmtInt(d?.totalActiveVehicles),
      totalSoldVehicles: fmtInt(d?.totalSoldVehicles),
      conversions: fmtPct(d?.conversions),
      totalInquiries: fmtInt(d?.totalInquiries),
      responseTime: fmtResponse(d?.responseTime),
      avgRating: d?.avgRating ?? 0,

      gstNumber: d?.gstNumber || "—",
      panCardNumber: d?.panCardNumber || "—",
      gstCertificateUrl: d?.gstCertificateUrl || null,
      panCardFrontUrl: d?.panCardFrontUrl || null,
      addressVerifiedStatus: d?.addressVerifiedStatus || null,
    };
  }, [data, id]);

  const fetchProfile = async ({ silent = false } = {}) => {
    try {
      if (!silent) setLoading(true);
      setError("");
      const res = await getConsultationById(id);
      setData(res);
    } catch (e) {
      const msg = getErrorMessage(e, "Failed to load consultant profile");
      setError(msg);
      toast.error(msg);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const getConsultId = () => {
    const consultId = profile?.consultId || id;
    if (!consultId) {
      toast.error("consultId not found");
      return null;
    }
    return consultId;
  };

  const openDocModal = (title, imageUrl) => {
    if (!imageUrl) {
      toast.error("Document image not available");
      return;
    }

    setDocModal({
      open: true,
      title,
      imageUrl,
    });
  };

  const closeDocModal = () => {
    setDocModal({
      open: false,
      title: "",
      imageUrl: "",
    });
  };

  const openUnsuspendModal = () => {
    setReasonText("");
    setActionModal({
      open: true,
      type: "unsuspend",
    });
  };

  const openKycModal = (type) => {
    setRemarkText("");
    setActionModal({
      open: true,
      type,
    });
  };

  const closeActionModal = () => {
    setActionModal({
      open: false,
      type: "",
    });
    setReasonText("");
    setRemarkText("");
  };

  const handleUnsuspend = async () => {
    try {
      const consultId = getConsultId();
      if (!consultId) return;

      if (!reasonText.trim()) {
        toast.error("Reason is required");
        return;
      }

      setActionLoading(true);

      await unsuspendConsultation({
        consultId,
        reason: reasonText.trim(),
      });

      toast.success("Consultant unsuspended successfully");
      closeActionModal();
      await fetchProfile({ silent: true });
    } catch (e) {
      toast.error(getErrorMessage(e, "Failed to unsuspend consultant"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveKYC = async () => {
    try {
      const consultId = getConsultId();
      if (!consultId) return;

      if (!remarkText.trim()) {
        toast.error("Remark is required");
        return;
      }

      setKycActionLoading("approve");

      await approveKYCConsultation({
        consultId,
        remark: remarkText.trim(),
      });

      toast.success("KYC approved successfully");
      closeActionModal();
      await fetchProfile({ silent: true });
    } catch (e) {
      toast.error(getErrorMessage(e, "Failed to approve KYC"));
    } finally {
      setKycActionLoading("");
    }
  };

  const handleRejectKYC = async () => {
    try {
      const consultId = getConsultId();
      if (!consultId) return;

      if (!remarkText.trim()) {
        toast.error("Remark is required");
        return;
      }

      setKycActionLoading("reject");

      await rejectKYCConsultation({
        consultId,
        remark: remarkText.trim(),
      });

      toast.success("KYC rejected successfully");
      closeActionModal();
      await fetchProfile({ silent: true });
    } catch (e) {
      toast.error(getErrorMessage(e, "Failed to reject KYC"));
    } finally {
      setKycActionLoading("");
    }
  };

  const handleRequestUploadKYC = async () => {
    try {
      const consultId = getConsultId();
      if (!consultId) return;

      if (!remarkText.trim()) {
        toast.error("Remark is required");
        return;
      }

      setKycActionLoading("request");

      await requestUploadKYCConsultation({
        consultId,
        remark: remarkText.trim(),
      });

      toast.success("KYC re-upload requested successfully");
      closeActionModal();
      await fetchProfile({ silent: true });
    } catch (e) {
      toast.error(getErrorMessage(e, "Failed to request KYC re-upload"));
    } finally {
      setKycActionLoading("");
    }
  };

  const bannerStyle = profile?.bannerUrl
    ? { backgroundImage: `url(${profile.bannerUrl})` }
    : null;

  const initial = String(profile?.name || "C")
    .trim()
    .slice(0, 1)
    .toUpperCase();

  const isInactive = profile?.status === "INACTIVE";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
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

      <div className="px-5 pt-6 md:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold md:text-3xl">
              {loading ? "Loading..." : profile?.name || "Consultant"}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              ID: <span className="font-semibold text-slate-700">{id}</span>
              {profile?.location && profile.location !== "—" ? (
                <>
                  {" "}
                  ·{" "}
                  <span className="font-semibold text-slate-700">
                    {profile.location}
                  </span>
                </>
              ) : null}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Back to All Consultants
            </button>

            {isInactive ? (
              <button
                onClick={openUnsuspendModal}
                disabled={actionLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60 hover:bg-emerald-700"
              >
                <RotateCcw size={16} />
                {actionLoading ? "Unsuspending..." : "Unsuspend"}
              </button>
            ) : (
              <button
                onClick={() => navigate(`/admin/consultants/suspend/${id}`)}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-rose-700"
              >
                <Ban size={16} />
                Suspend
              </button>
            )}
          </div>
        </div>

        {error ? (
          <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 font-semibold text-rose-800">
            {error}
          </div>
        ) : null}
      </div>

      <div className="px-5 pb-8 md:px-8">
        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div
            className={cls(
              "h-36 bg-cover bg-center md:h-44",
              !bannerStyle
                ? "bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900"
                : ""
            )}
            style={bannerStyle || undefined}
          >
            {!bannerStyle ? (
              <div className="h-full w-full bg-black/20" />
            ) : (
              <div className="h-full w-full bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
            )}
          </div>

          <div className="p-5 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                  {profile?.logoUrl ? (
                    <img
                      src={profile.logoUrl}
                      alt={profile.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="text-xl font-black text-slate-700">
                      {initial}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-lg font-extrabold">
                      {profile?.name || "—"}
                    </h2>

                    <Pill tone={profile?.tierTone || "slate"}>
                      {profile?.tierTitle || "—"}
                    </Pill>

                    <Pill tone={profile?.verifiedTone || "slate"}>
                      <CheckCircle2 size={14} />
                      {profile?.verification === "VERIFIED"
                        ? "Verified"
                        : safe(profile?.verification)}
                    </Pill>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
                    <InfoItem icon={MapPin}>
                      {profile?.location || "—"}
                    </InfoItem>
                    <InfoItem icon={ShieldCheck}>
                      {profile?.kycLabel || "KYC: Pending"}
                    </InfoItem>
                    <InfoItem icon={AlertTriangle}>
                      Risk: {profile?.risk || "Low"}
                    </InfoItem>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 md:ml-auto">
                <Pill tone={profile?.statusTone || "slate"}>
                  {profile?.status || "—"}
                </Pill>
                <Pill tone="slate">@{profile?.username || "—"}</Pill>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-4">
              <div className="flex flex-wrap justify-between gap-4">
                <Stat
                  label="Total Vehicles"
                  value={safe(profile?.totalVehicles)}
                />
                <Stat
                  label="Active Vehicles"
                  value={safe(profile?.totalActiveVehicles)}
                  highlight
                />
                <Stat
                  label="Total Sold"
                  value={safe(profile?.totalSoldVehicles)}
                />
                <Stat
                  label="30d Conversion"
                  value={safe(profile?.conversions)}
                />
                <Stat
                  label="30d Inquiries"
                  value={safe(profile?.totalInquiries)}
                />
                <Stat
                  label="Avg Response"
                  value={safe(profile?.responseTime)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-4 md:px-6">
            <div className="flex flex-wrap gap-2">
              {[
                "Overview",
                "Inventory",
                "Ranking Breakdown",
                "Financial",
                "Complaints",
                "Activity Logs",
              ].map((t) => {
                const active = activeTab === t;
                return (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={cls(
                      "border-b-2 px-3 py-4 text-sm font-bold transition",
                      active
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-slate-500 hover:text-slate-900"
                    )}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-5 md:p-6">
            {loading ? (
              <div className="py-10 text-center font-semibold text-slate-400">
                Loading...
              </div>
            ) : !profile ? null : activeTab !== "Overview" ? (
              <div className="py-10 text-center font-semibold text-slate-400">
                {activeTab} (UI ready) — API later coming soon!
              </div>
            ) : (
              <div className="space-y-10">
                <section>
                  <h3 className="mb-4 text-sm font-extrabold text-slate-900">
                    Business Details
                  </h3>
                  <div className="grid gap-x-10 gap-y-2 md:grid-cols-2">
                    <CardField label="Business Name" value={profile.name} />
                    <CardField label="GST Number" value={profile.gstNumber} />
                    <CardField label="PAN Number" value={profile.panCardNumber} />
                    <CardField label="Contact Number" value={profile.phone} />
                    <CardField label="Email" value={profile.email} />
                    <CardField label="Owner Name" value={profile.ownerName} />
                  </div>
                </section>

                <section>
                  <h3 className="mb-3 text-sm font-extrabold text-slate-900">
                    KYC Documents
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    <DocChip
                      ok={!!profile.gstCertificateUrl}
                      clickable={!!profile.gstCertificateUrl}
                      onClick={() =>
                        openDocModal("GST Certificate", profile.gstCertificateUrl)
                      }
                      text={`GST Certificate • ${
                        profile.gstCertificateUrl ? "Click to View" : "Missing"
                      }`}
                    />

                    <DocChip
                      ok={!!profile.panCardFrontUrl}
                      clickable={!!profile.panCardFrontUrl}
                      onClick={() =>
                        openDocModal("PAN Card", profile.panCardFrontUrl)
                      }
                      text={`PAN Card • ${
                        profile.panCardFrontUrl ? "Click to View" : "Missing"
                      }`}
                    />

                    <DocChip
                      ok={!!profile.addressVerifiedStatus}
                      text={`Address Proof • ${
                        profile.addressVerifiedStatus ? "Verified" : "Pending"
                      }`}
                    />
                  </div>
                </section>

                <section>
                  <h3 className="mb-3 text-sm font-extrabold text-slate-900">
                    Admin Actions
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => openKycModal("approve")}
                      disabled={kycActionLoading === "approve"}
                      className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                    >
                      {kycActionLoading === "approve"
                        ? "Approving..."
                        : "Approve KYC"}
                    </button>

                    <button
                      onClick={() => openKycModal("reject")}
                      disabled={kycActionLoading === "reject"}
                      className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-rose-700 disabled:opacity-60"
                    >
                      {kycActionLoading === "reject"
                        ? "Rejecting..."
                        : "Reject KYC"}
                    </button>

                    <button
                      onClick={() => openKycModal("request")}
                      disabled={kycActionLoading === "request"}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-extrabold text-slate-900 transition hover:bg-slate-50 disabled:opacity-60"
                    >
                      {kycActionLoading === "request"
                        ? "Requesting..."
                        : "Request Re-upload"}
                    </button>

                    {isInactive && (
                      <button
                        onClick={openUnsuspendModal}
                        disabled={actionLoading}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-blue-700 disabled:opacity-60"
                      >
                        <RotateCcw size={16} />
                        {actionLoading
                          ? "Unsuspending..."
                          : "Unsuspend Consultant"}
                      </button>
                    )}
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>

      <DocumentImageModal
        open={docModal.open}
        onClose={closeDocModal}
        title={docModal.title}
        imageUrl={docModal.imageUrl}
      />

      <ActionRemarkModal
        open={actionModal.open && actionModal.type === "unsuspend"}
        title="Unsuspend Consultant"
        label="Reason"
        value={reasonText}
        setValue={setReasonText}
        confirmText="Confirm Unsuspend"
        loading={actionLoading}
        onClose={closeActionModal}
        onConfirm={handleUnsuspend}
        placeholder="Enter reason for unsuspending this consultant..."
      />

      <ActionRemarkModal
        open={actionModal.open && actionModal.type === "approve"}
        title="Approve KYC"
        label="Remark"
        value={remarkText}
        setValue={setRemarkText}
        confirmText="Approve KYC"
        loading={kycActionLoading === "approve"}
        onClose={closeActionModal}
        onConfirm={handleApproveKYC}
        placeholder="Enter remark for approving KYC..."
      />

      <ActionRemarkModal
        open={actionModal.open && actionModal.type === "reject"}
        title="Reject KYC"
        label="Remark"
        value={remarkText}
        setValue={setRemarkText}
        confirmText="Reject KYC"
        loading={kycActionLoading === "reject"}
        onClose={closeActionModal}
        onConfirm={handleRejectKYC}
        placeholder="Enter remark for rejecting KYC..."
      />

      <ActionRemarkModal
        open={actionModal.open && actionModal.type === "request"}
        title="Request KYC Re-upload"
        label="Remark"
        value={remarkText}
        setValue={setRemarkText}
        confirmText="Request Re-upload"
        loading={kycActionLoading === "request"}
        onClose={closeActionModal}
        onConfirm={handleRequestUploadKYC}
        placeholder="Enter remark for requesting re-upload..."
      />
    </div>
  );
};

export default ConsultantProfile;