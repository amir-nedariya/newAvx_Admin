// src/api/vehicle.api.js
import api from "./axios";

/* =========================================================
   POST FILTER LIST
========================================================= */
export const filterVehicles = async ({
  searchText = null,
  cityId = null,
  minPrice = null,
  maxPrice = null,
  fuelType = null,
  vehicleType = null,
  transmissionType = null,
  inspectionStatus = null,
  isTierBoostActive = null,
  marketplaceStatus = null,
  listedAfter = null,
  listedBefore = null,
  pageNo = 1,
  pageSize = 10,
  sortBy = "createdAt",
  sortDirection = "DESC",
} = {}) => {
  const payload = {
    searchText: searchText?.trim() ? searchText.trim() : null,
    cityId: cityId || null,
    minPrice:
      minPrice !== "" && minPrice !== null && minPrice !== undefined
        ? Number(minPrice)
        : null,
    maxPrice:
      maxPrice !== "" && maxPrice !== null && maxPrice !== undefined
        ? Number(maxPrice)
        : null,
    fuelType: fuelType || null,
    vehicleType: vehicleType || null,
    transmissionType: transmissionType || null,
    inspectionStatus: inspectionStatus || null,
    isTierBoostActive:
      isTierBoostActive === "" || isTierBoostActive === null || isTierBoostActive === undefined
        ? null
        : isTierBoostActive,
    marketplaceStatus: marketplaceStatus || null,
    listedAfter: listedAfter || null,
    listedBefore: listedBefore || null,
    pageNo,
    pageSize,
    sortBy: sortBy || "createdAt",
    sortDirection: sortDirection || "DESC",
  };

  const res = await api.post("/vehicle/filter", payload);
  return res.data;
};

export const normalizeVehicleListResponse = (payload) => {
  const list = Array.isArray(payload?.data) ? payload.data : [];
  const pr = payload?.pageResponse || {};

  return {
    list,
    totalPages: Number(pr?.totalPages || 1),
    totalElements: Number(pr?.totalElements || list.length || 0),
    currentPage: Number(pr?.currentPage || 1),
    currentElements: Number(pr?.currentElements || list.length || 0),
  };
};

/* =========================================================
   GET VEHICLE DETAILS BY ID
========================================================= */
export const getVehicleById = async (vehicleId) => {
  const res = await api.get(`/vehicle/${vehicleId}`);
  return res.data;
};

export const normalizeVehicleDetailResponse = (payload) => {
  return payload?.data || null;
};

/* =========================================================
   SUSPEND VEHICLE
========================================================= */
export const suspendVehicle = async ({
  vehicleId,
  reason,
  suspendType,
  suspendUntil,
}) => {
  const payload = {
    vehicleId,
    reason,
    suspendType, // TEMPORARY | PERMANENT
    suspendUntil: suspendType === "TEMPORARY" ? suspendUntil : null,
  };

  const res = await api.patch("/vehicle/suspend", payload);
  return res.data;
};

/* =========================================================
   FLAG VEHICLE FOR REVIEW
========================================================= */
export const flagVehicleForReview = async ({
  vehicleId,
  flagCategory,
  severity,
  internalNotes,
}) => {
  const payload = {
    vehicleId,
    flagCategory,
    severity,
    internalNotes,
  };

  const res = await api.patch("/vehicle/flag-review", payload);
  return res.data;
};

/* =========================================================
   ADD INTERNAL NOTE
========================================================= */
export const addVehicleInternalNote = async ({
  vehicleId,
  note,
  visibility,
  attachmentUrl,
}) => {
  const payload = {
    vehicleId,
    note,
    visibility, // INTERNAL_ONLY | COMPLIANCE_TEAM
    attachmentUrl: attachmentUrl || null,
  };

  const res = await api.post("/vehicle/internal-note", payload);
  return res.data;
};

// getVehicleKpi - to fetch vehicle related KPIs for the dashboard
export const getVehicleKpi = async () => {
  const res = await api.get("/vehicle/kpi");
  return res.data;
};
export const getVehicleInquiries = async (vehicleId) => {
  const res = await api.get(`/vehicle/inquiries/${vehicleId}`);
  return res.data;
};

/* =======================================================
   ✅ VEHICLE: GET SUSPENDED
======================================================= */
export const getSuspendedVehicles = async () => {
  const res = await api.get("/vehicle/suspended");
  return res.data;
};

/* =========================================================
   UNSUSPEND VEHICLE
========================================================= */
export const unsuspendVehicle = async ({ vehicleId, reason }) => {
  const payload = {
    vehicleId,
    reason: reason || null,
  };

  const res = await api.patch("/vehicle/unsuspend", payload);
  return res.data;
};

/* =======================================================
   ✅ VEHICLE: GET FLAGGED
======================================================= */
export const getFlaggedVehicles = async () => {
  const res = await api.get("/vehicle/flagged");
  return res.data;
};

/* =======================================================
   ✅ VEHICLE: GET FLAGGED KPI
======================================================= */
export const getFlaggedVehiclesKpi = async () => {
  const res = await api.get("/vehicle/flags/kpi");
  return res.data;
};

/* =========================================================
   ✅ CLEAR VEHICLE FLAG (PATCH)
   PATH: /vehicle/clear-flag
   BODY: { flagId, reason }
========================================================= */
export const clearFlaggedVehicle = async (payload) => {
  const res = await api.patch(`/vehicle/clear-flag`, payload);
  return res.data;
};

/* =========================================================
   ✅ GET FLAG REVIEW DETAILS
   PATH: /vehicle/flag-review/:flagId
========================================================= */
export const getFlagReview = async (flagId) => {
  const res = await api.get(`/vehicle/flag-review/${flagId}`);
  return res.data;
};