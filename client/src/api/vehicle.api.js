import api from "./axios";

/* ================= GET ALL VEHICLES (PAGINATED) ================= */
export const getVehicles = (pageNo = 1, verificationStatus) => {
  const params = { pageNo };

  if (verificationStatus && verificationStatus !== "ALL") {
    params.verificationStatus = verificationStatus;
  }

  return api.get("/vehicle", { params });
};

/* ================= GET VEHICLE BY ID ================= */
export const getVehicleById = (vehicleId) =>
  api.get(`/vehicle/${vehicleId}`);

/* ================= VERIFY VEHICLE (✅ FIXED) ================= */
export const verifyVehicle = (vehicleId, adminRemark) =>
  api.patch(`/vehicle/verify/${vehicleId}`, {
    verificationStatus: "VERIFIED",
    remarks: adminRemark, // ⚠️ backend expects `remarks`
  });

/* ================= GET VEHICLE ADDRESS ================= */
export const getVehicleAddress = (vehicleId) =>
  api.get(`/vehicle/address/${vehicleId}`);

/* ================= GET VEHICLE DOCUMENT ================= */
export const getVehicleDocument = (vehicleId) =>
  api.get(`/vehicle/document/${vehicleId}`);

/* ================= GET VEHICLE EXTRA DETAILS ================= */
export const getVehicleExtraDetails = (vehicleId) =>
  api.get(`/vehicle/extra-details/${vehicleId}`);

/* ================= GET VEHICLE STEP STATUS ================= */
export const getVehicleStepStatus = (vehicleId) =>
  api.get(`/vehicle/step-status/${vehicleId}`);

/* ================= GET VEHICLE IMAGES ================= */
export const getVehicleImages = (vehicleId) =>
  api.get(`/vehicle/image/${vehicleId}`);
