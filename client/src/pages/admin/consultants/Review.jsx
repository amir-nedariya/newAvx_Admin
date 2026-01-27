import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  BadgeCheck,
  FileText,
  MapPin,
  ArrowLeft,
  MessageSquare,
  X,
  RefreshCcw,
} from "lucide-react";

import {
  getConsultationById,
  getConsultationAddress,
  getConsultationDocuments,
  verifyConsultation,
} from "../../../api/consultationApi";

/* ---------------- FORMATTER ---------------- */
const formatLabel = (text = "") =>
  text
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

/* ---------------- TABS ---------------- */
const tabs = [
  { label: "Business Info", icon: <BadgeCheck size={16} /> },
  { label: "Address", icon: <MapPin size={16} /> },
  { label: "KYC Documents", icon: <FileText size={16} /> },
  { label: "Admin Remark", icon: <MessageSquare size={16} /> },
];

/* ---------------- ACTION MAP ---------------- */
const actionMap = {
  APPROVE: "VERIFIED",
  REJECT: "REJECTED",
  REQUEST_CHANGE: "REQUEST_CHANGES",
};

/* ---------------- COMPONENT ---------------- */
const ReviewConsultant = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [consultant, setConsultant] = useState(null);
  const [address, setAddress] = useState(null);
  const [documents, setDocuments] = useState(null);
  const [activeTab, setActiveTab] = useState("Business Info");
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // BUSINESS INFO
        if (activeTab === "Business Info" && !consultant) {
          const res = await getConsultationById(id);
          const c = res.data?.data;

          if (!c) return;

          setConsultant({
            id: c.id,
            name: c.consultationName || "-",
            ownerName: c.ownerName || "-",
            email: c.companyEmail || "-",
            estYear: c.establishmentYear || "-",
            vehicleTypes: c.vehicleTypes || [],
            services: c.services || [],
            status: c.status,
            verificationStatus: c.verificationStatus,
            verifiedAt: c.verifiedAt,
            logoUrl: c.logoUrl || null,
            bannerUrl: c.bannerUrl || null,
          });

          setRemark(c.adminRemark || "");
        }

        // ADDRESS
        if (activeTab === "Address" && !address) {
          const res = await getConsultationAddress(id);
          setAddress(res.data?.data);
        }

        // DOCUMENTS
        if (activeTab === "KYC Documents" && !documents) {
          const res = await getConsultationDocuments(id);
          setDocuments(res.data?.data);
        }
      } catch (err) {
        console.error(err);
        // alert("Failed to load data for this tab");
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, id, consultant, address, documents]);

  /* ---------------- VERIFY / ACTION ---------------- */
  const handleAction = async (type, status) => {
    if (!remark.trim()) {
      alert("Admin remark is required");
      return;
    }

    setActionLoading(true);
    try {
      const payload = {
        verificationStatus: status || actionMap[type],
        adminRemark: remark,
      };
      const res = await verifyConsultation(id, payload);
      alert(res.data?.message || "Action completed successfully");
      navigate(-1);
    } catch (err) {
      alert(err?.response?.data?.message || "Verification failed");
    } finally {
      setActionLoading(false);
      setStatusModalOpen(false);
    }
  };

  const isReadOnly =
    consultant?.verificationStatus === "VERIFIED" ||
    consultant?.verificationStatus === "REJECTED";

  const openModal = (img) => {
    setModalImg(img);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalImg(null);
    setModalOpen(false);
  };

  const openStatusModal = () => {
    setNewStatus(consultant.verificationStatus);
    setStatusModalOpen(true);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-[#070B14] text-gray-200">
      {/* HEADER */}
      <div className="sticky top-0 bg-[#070B14] border-b border-white/10 px-8 py-5 flex justify-between items-center z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <h1 className="text-2xl font-semibold">{consultant?.name || "-"}</h1>
      </div>

      <div className="p-8 space-y-8">
        {/* TABS */}
        <div className="flex gap-3 border-b border-white/10 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.label}
              onClick={() => setActiveTab(t.label)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-md ${
                activeTab === t.label
                  ? "bg-blue-900/30 text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0B0F1A] border border-white/10 p-6 rounded-xl"
        >
          {/* BUSINESS INFO */}
          {activeTab === "Business Info" && consultant && (
            <div className="space-y-6">
              {/* Banner + Logo */}
              <div className="relative rounded-xl overflow-hidden border border-white/10">
                <div className="h-40 bg-white/5">
                  {consultant.bannerUrl ? (
                    <img
                      src={consultant.bannerUrl}
                      alt="Banner"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No Banner
                    </div>
                  )}
                </div>

                <div className="flex items-end gap-6 px-6 pb-6 -mt-12">
                  <div className="w-24 h-24 rounded-full bg-[#070B14] border border-white/10 overflow-hidden">
                    {consultant.logoUrl ? (
                      <img
                        src={consultant.logoUrl}
                        alt="Logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-xs text-gray-500">
                        No Logo
                      </div>
                    )}
                  </div>
              </div>

              {/* Details */}
              <div className="grid sm:grid-cols-2 gap-6 text-sm">
                <InfoBox label="Owner Name" value={consultant.ownerName} />
                <InfoBox label="Email" value={consultant.email} />
                <InfoBox label="Establishment Year" value={consultant.estYear} />
                <InfoBox
                  label="Vehicle Types"
                  value={consultant.vehicleTypes.map(formatLabel).join(", ")}
                />
                <InfoBox
                  label="Services"
                  value={consultant.services.map(formatLabel).join(", ")}
                />
                <InfoBox label="Status" value={formatLabel(consultant.status)} />
                <InfoBox
                  label="Verified At"
                  value={
                    consultant.verifiedAt
                      ? new Date(consultant.verifiedAt).toLocaleString()
                      : "-"
                  }
                />
              </div>
              </div>
            </div>
          )}

          {/* ADDRESS */}
          {activeTab === "Address" && (
            <div className="grid sm:grid-cols-2 gap-6 text-sm">
              {address ? (
                <>
                  <InfoBox label="Address" value={address.address} />
                  <InfoBox label="City" value={address.city} />
                  <InfoBox label="State" value={address.state} />
                  <InfoBox label="Country" value={address.country} />
                  <InfoBox label="Latitude" value={address.latitude} />
                  <InfoBox label="Longitude" value={address.longitude} />
                  <InfoBox
                    label="Status"
                    value={formatLabel(address.status)}
                  />
                </>
              ) : (
                <p>No address available</p>
              )}
            </div>
          )}

          {/* KYC DOCUMENTS */}
          {activeTab === "KYC Documents" && (
            <div className="grid sm:grid-cols-2 gap-6 text-sm">
              {documents ? (
                <>
                  <InfoBox label="GST" value={documents.gstNumber} />
                  <InfoBox label="PAN" value={documents.panCardNumber} />
                  <DocModal
                    label="PAN Front"
                    url={documents.panCardFrontUrl}
                    openModal={openModal}
                  />
                  <InfoBox label="Aadhar" value={documents.aadharCardNumber} />
                  <DocModal
                    label="Aadhar Front"
                    url={documents.aadharCardFrontUrl}
                    openModal={openModal}
                  />
                  <DocModal
                    label="Aadhar Back"
                    url={documents.aadharCardBackUrl}
                    openModal={openModal}
                  />
                  <InfoBox label="Status" value={formatLabel(documents.status)} />
                </>
              ) : (
                <p>No documents available</p>
              )}
            </div>
          )}

          {/* ADMIN REMARK */}
          {activeTab === "Admin Remark" && (
            <div className="space-y-6">
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                disabled={isReadOnly && consultant?.verificationStatus !== "REQUEST_CHANGES"}
                placeholder="Enter admin remark"
                className={`w-full h-40 rounded-lg p-4 text-sm font-medium border ${
                  consultant?.verificationStatus === "VERIFIED"
                    ? "bg-cyan-900/20 text-cyan-400 border-cyan-500/40 cursor-not-allowed"
                    : consultant?.verificationStatus === "REJECTED"
                    ? "bg-red-900/20 text-red-400 border-red-500/40 cursor-not-allowed"
                    : consultant?.verificationStatus === "REQUEST_CHANGES"
                    ? "bg-yellow-900/20 text-yellow-400 border-yellow-500/40"
                    : "bg-[#070B14] text-gray-200 border-white/10"
                }`}
              />

              {!isReadOnly && (
                <div className="flex justify-end gap-3">
                  <ActionBtn
                    label="Approve"
                    color="emerald"
                    disabled={actionLoading}
                    onClick={() => handleAction("APPROVE")}
                  />
                  <ActionBtn
                    label="Reject"
                    color="red"
                    disabled={actionLoading}
                    onClick={() => handleAction("REJECT")}
                  />
                  <ActionBtn
                    label="Request Changes"
                    color="yellow"
                    disabled={actionLoading}
                    onClick={() => handleAction("REQUEST_CHANGE")}
                  />
                </div>
              )}

              {(consultant?.verificationStatus === "VERIFIED" ||
                consultant?.verificationStatus === "REJECTED") && (
                <div className="flex justify-end mt-3">
                  {/* <ActionBtn
                    label="🔄 Change Status"
                    color="purple"
                    disabled={actionLoading}
                    onClick={openStatusModal}
                  /> */}
                  <ActionBtn
                     label={
                 <span className="flex items-center gap-2">
                    <RefreshCcw size={16} />
                      Change Status
                       </span>
                          }
                       color="neutral"
                       disabled={actionLoading}
                       onClick={openStatusModal}
                       />

                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* IMAGE MODAL */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="relative bg-[#0B0F1A] p-4 rounded-xl max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <img
              src={modalImg}
              alt="Document"
              className="max-h-[80vh] w-full object-contain"
            />
          </div>
        </div>
      )}

      {/* STATUS MODAL */}
      {statusModalOpen && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setStatusModalOpen(false)}
        >
          <div
            className="relative bg-[#0B0F1A] p-6 rounded-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Update Status & Remark</h2>
            <textarea
              className="w-full h-32 p-3 rounded-md bg-[#070B14] border border-white/10 text-gray-200 mb-4"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Enter admin remark"
            />
            <label className="text-sm text-gray-400 mb-2 block">Verification Status</label>
            <select
              className="w-full p-2 rounded-md bg-[#070B14] border border-white/10 text-gray-200 mb-4"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="VERIFIED">Verified</option>
              <option value="REJECTED">Rejected</option>
              <option value="REQUEST_CHANGES">Request Changes</option>
            </select>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setStatusModalOpen(false)}
                className="px-4 py-2 rounded-md bg-white/10 text-gray-400 hover:bg-white/20"
              >
                Cancel
              </button>
              <button
              onClick={() => handleAction("CHANGE_STATUS", newStatus)}
             className="px-4 py-2 rounded-md bg-[#50A2FF] text-white hover:bg-[#3A8FE6] transition-colors"
              >
             Update
            </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------------- UI COMPONENTS ---------------- */
const InfoBox = ({ label, value }) => (
  <div className="bg-white/5 p-4 rounded-lg">
    <p className="text-xs text-gray-400">{label}</p>
    <p className="font-semibold mt-1">{value || "-"}</p>
  </div>
);

const Badge = ({ label }) => (
  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs whitespace-nowrap inline-flex">
    {label}
  </span>
);

const DocModal = ({ label, url, openModal }) => (
  <InfoBox
    label={label}
    value={
      url ? (
        <button
          onClick={() => openModal(url)}
          className="text-blue-400 underline"
        >
          View
        </button>
      ) : (
        "-"
      )
    }
  />
);

const ActionBtn = ({ label, color, disabled, onClick }) => {
  const map = {
    emerald: "bg-emerald-500/10 text-emerald-400",
    red: "bg-red-500/10 text-red-400",
    yellow: "bg-yellow-500/10 text-yellow-400",
        neutral:
        "bg-[#50A2FF]/10 text-[#50A2FF] hover:bg-[#50A2FF]/20 border border-[#50A2FF]/40",

  };
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`px-6 py-2 rounded-md text-sm font-medium transition ${
        disabled ? "bg-white/5 text-gray-500 cursor-not-allowed" : map[color]
      }`}
    >
      {label}
    </button>
  );
};

export default ReviewConsultant;
