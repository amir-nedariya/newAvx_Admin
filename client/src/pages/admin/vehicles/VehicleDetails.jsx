import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, FileText, CheckCircle, Image as ImageIcon, Edit3 } from "lucide-react";
import {
  getVehicleById,
  getVehicleAddress,
  getVehicleDocument,
  getVehicleExtraDetails,
  getVehicleStepStatus,
  getVehicleImages,
  verifyVehicle,
} from "../../../api/vehicle.api";

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [address, setAddress] = useState(null);
  const [document, setDocument] = useState(null);
  const [extraDetail, setExtraDetail] = useState(null);
  const [stepStatus, setStepStatus] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [verifying, setVerifying] = useState(false);
  const [adminRemark, setAdminRemark] = useState("");

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [vehRes, addrRes, docRes, extraRes, stepRes, imgRes] = await Promise.all([
          getVehicleById(id),
          getVehicleAddress(id),
          getVehicleDocument(id),
          getVehicleExtraDetails(id),
          getVehicleStepStatus(id),
          getVehicleImages(id),
        ]);
        setVehicle(vehRes?.data?.data);
        setAddress(addrRes?.data?.data || null);
        setDocument(docRes?.data?.data || null);
        setExtraDetail(extraRes?.data?.data || null);
        setStepStatus(stepRes?.data?.data || null);
        setImages(imgRes?.data?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  const handleVerify = async () => {
    if (!adminRemark.trim()) return alert("Enter admin remark");
    try {
      setVerifying(true);
      await verifyVehicle(id, { verificationStatus: "VERIFIED", adminRemark });
      setVehicle((prev) => ({ ...prev, verificationStatus: "VERIFIED" }));
      alert("Vehicle verified successfully!");
    } catch (err) {
      console.error(err);
      alert("Verification failed!");
    } finally {
      setVerifying(false);
    }
  };

  if (loading)
    return <p className="text-center text-gray-400 mt-20">Loading vehicle details...</p>;

  if (!vehicle)
    return <p className="text-center text-red-400 mt-20">Vehicle not found</p>;

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-[#070B14] text-white px-8 py-6 space-y-8">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-semibold">
            {vehicle.makerName} {vehicle.modelName}
          </h1>
          <p className="text-sm text-gray-400">
            {vehicle.variantName} • {vehicle.yearOfMfg}
          </p>
        </div>
        {vehicle.verificationStatus === "VERIFIED" && (
          <span className="ml-auto px-4 py-2 rounded-lg text-sm bg-emerald-900/50 text-emerald-400 font-medium shadow">
            ✔ Verified
          </span>
        )}
      </div>

      {/* OVERVIEW */}
      <Section title="Vehicle Overview">
        <div className="grid sm:grid-cols-12 gap-6">
          <div className="sm:col-span-4">
            <img
              src={vehicle.thumbnailUrl}
              alt="Vehicle"
              className="rounded-xl w-full h-56 object-cover"
            />
            <div className="flex gap-2 mt-4">
              <Badge label={vehicle.verificationStatus} />
              <Badge label={vehicle.inspectionStatus} />
            </div>
          </div>
          <div className="sm:col-span-8 grid grid-cols-2 gap-6">
            <Detail label="Owner" value={`${vehicle.userMaster.firstname} ${vehicle.userMaster.lastname}`} />
            <Detail label="Vehicle Type" value={vehicle.vehicleType} />
            <Detail label="Fuel" value={vehicle.fuelType} />
            <Detail label="Transmission" value={vehicle.transmissionType} />
            <Detail label="KM Driven" value={`${vehicle.kmDriven} km`} />
            <Detail label="Ownership" value={`${vehicle.ownership} Owner`} />
            <Detail label="Colour" value={vehicle.colour} />
            <Detail label="Price" value={`₹${vehicle.price.toLocaleString()}`} />
          </div>
        </div>
      </Section>

      {/* IMAGES */}
      <Section title="Vehicle Images" icon={<ImageIcon size={18} />}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.length ? (
            images.map((img) => (
              <div key={img.id} className="bg-white/5 rounded-2xl overflow-hidden shadow hover:scale-105 transform transition">
                <img src={img.imageUrl} alt={img.imageKey} className="w-full h-52 object-cover" />
                <div className="p-2 text-center text-sm text-gray-400">{img.imageKey}</div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No images available</p>
          )}
        </div>
      </Section>

      {/* ADDRESS */}
      {address && (
        <Section title="Vehicle Address" icon={<MapPin size={18} />}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Detail label="Address" value={address.address} />
            <Detail label="City" value={address.cityName} />
            <Detail label="State" value={address.stateName} />
            <Detail label="Country" value={address.countryName} />
            <Detail label="Latitude" value={address.latitude} />
            <Detail label="Longitude" value={address.longitude} />
          </div>
        </Section>
      )}

      {/* DOCUMENTS */}
      {document && (
        <Section title="Vehicle Documents" icon={<FileText size={18} />}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Detail label="Registration No" value={document.regNumber} />
            <Detail label="RTO Passing" value={document.rtoPassing} />
            <Detail label="Insurance" value={document.insurance ? "Yes" : "No"} />
            <Detail label="Insurance Type" value={document.typeOfInsurance} />
            <Detail label="Insurance Expiry" value={new Date(document.insuranceExpiryDate).toLocaleDateString()} />
            <Detail label="PUC Expiry" value={new Date(document.pucExpiryDate).toLocaleDateString()} />
          </div>
        </Section>
      )}

      {/* EXTRA DETAILS */}
      {extraDetail && (
        <Section title="Extra Details">
          <Detail label={extraDetail.detailKey} value={extraDetail.detailValue} />
        </Section>
      )}

      {/* STEP STATUS */}
      {stepStatus && (
        <Section title="Step Completion Status" icon={<CheckCircle size={18} />}>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Step label="Basic Details" status={stepStatus.basicDetailStatus} />
            <Step label="Documents" status={stepStatus.documentStatus} />
            <Step label="Images" status={stepStatus.basicImagesStatus} />
            <Step label="Address" status={stepStatus.addressStatus} />
            <Step label="Extra Details" status={stepStatus.extraDetailStatus} />
          </div>
        </Section>
      )}

      {/* ADMIN REMARK */}
      {vehicle.verificationStatus !== "VERIFIED" && (
        <Section title="Admin Remark" icon={<Edit3 size={18} />}>
          <textarea
            rows={5}
            value={adminRemark}
            onChange={(e) => setAdminRemark(e.target.value)}
            placeholder="Enter admin remark before verification..."
            className="w-full bg-[#0A0E1C] border border-white/20 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500 shadow-inner"
          />
          <button
            onClick={handleVerify}
            disabled={verifying}
            className={`mt-4 w-full py-3 rounded-2xl text-sm font-medium transition ${
              verifying ? "bg-gray-600 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 shadow-lg"
            }`}
          >
            {verifying ? "Verifying..." : "Verify Vehicle"}
          </button>
        </Section>
      )}

      {vehicle.verificationStatus === "VERIFIED" && (
        <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-2xl p-6 text-center text-emerald-300 font-semibold shadow-lg">
          ✅ Vehicle verified successfully
        </div>
      )}
    </div>
  );
};

/* ================= COMPONENTS ================= */
const Section = ({ title, icon, children }) => (
  <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6">
    <div className="flex items-center gap-2 mb-4 text-lg font-semibold">
      {icon}
      {title}
    </div>
    {children}
  </div>
);

const Detail = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-400 mb-1">{label}</p>
    <p className="font-medium">{value || "-"}</p>
  </div>
);

const Badge = ({ label }) => (
  <span className="px-3 py-1 text-xs rounded-full bg-blue-500/10 text-blue-300">{label}</span>
);

const Step = ({ label, status }) => (
  <div className="bg-white/5 rounded-2xl p-4 text-center shadow hover:shadow-lg transition">
    <p className="text-sm mb-2 font-medium">{label}</p>
    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
      <div
        className={`h-3 rounded-full transition-all ${
          status === "COMPLETED" ? "bg-emerald-400 w-full" : "bg-yellow-400 w-2/3"
        }`}
      ></div>
    </div>
    <p className="text-xs mt-1 font-semibold">{status || "-"}</p>
  </div>
);

export default VehicleDetails;
