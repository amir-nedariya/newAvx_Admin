import api from "./axios";

/* =========================================================
   GET STOREFRONT DRAFT DETAILS
   ENDPOINT: /consultation/storefront/draft/{storeDraftId}
========================================================= */
export const getStorefrontApprovalDetails = async (storeDraftId) => {
  const res = await api.get(`/consultation/storefront/draft/${storeDraftId}`);
  return res.data;
};

/* =========================================================
   POST FILTER STOREFRONT APPROVALS
   ENDPOINT: /consultation/storefront/approvals/filter
========================================================= */
export const filterStorefrontApprovals = async ({
  searchText = null,
  tierPlanId = null,
  cityId = null,
  pageNo = 1,
  pageSize = 10,
} = {}) => {
  const payload = {
    searchText: searchText?.trim() ? searchText.trim() : null,
    tierPlanId: tierPlanId || null,
    cityId: cityId || null,
    pageNo,
    pageSize,
  };

  const res = await api.post(
    "/consultation/storefront/approvals/filter",
    payload,
  );
  return res.data;
};

/* =========================================================
   POST FILTER PENDING APPROVALS
   ENDPOINT: /vehicle/pending-approvals/filter
========================================================= */
export const filterPendingApprovals = async ({
  searchText = null,
  submissionType = null,
  riskLevel = null,
  tierPlanId = null,
  inspectionStatus = null,
  cityId = null,
  submittedAfter = null,
  submittedBefore = null,
  pageNo = 1,
  pageSize = 10,
} = {}) => {
  const payload = {
    searchText: searchText?.trim() ? searchText.trim() : null,
    submissionType: submissionType || null,
    riskLevel: riskLevel || null,
    tierPlanId: tierPlanId || null,
    inspectionStatus: inspectionStatus || null,
    cityId: cityId || null,
    submittedAfter: submittedAfter || null,
    submittedBefore: submittedBefore || null,
    pageNo,
    pageSize,
  };

  const res = await api.post("/vehicle/pending-approvals/filter", payload);
  return res.data;
};

/* =========================================================
   NORMALIZE RESPONSE
========================================================= */
export const normalizePendingApprovalsResponse = (payload) => {
  const root = payload?.data ? payload : { data: [], pageResponse: {} };

  return {
    list: Array.isArray(root?.data) ? root.data : [],
    totalElements: Number(root?.pageResponse?.totalElements || 0),
    totalPages: Number(root?.pageResponse?.totalPages || 1),
    currentPage: Number(root?.pageResponse?.currentPage || 1),
    currentElements: Number(root?.pageResponse?.currentElements || 0),
  };
};

/* =========================================================
   GET PENDING APPROVAL DETAILS BY VEHICLE ID
   ENDPOINT: /vehicle/pending-approvals/{vehicleId}
========================================================= */
export const getPendingApprovalDetails = async (vehicleId) => {
  const res = await api.get(`/vehicle/pending-approvals/${vehicleId}`);
  return res.data;
};

export const normalizePendingApprovalDetailsResponse = (payload) => {
  return payload?.data || null;
};

/* =========================================================
   APPROVE PENDING VEHICLE
   ENDPOINT: /vehicle/pending-approvals/approve
========================================================= */
export const approvePendingVehicle = async (vehicleId, remarks = null) => {
  const payload = {
    vehicleId,
    remarks,
  };
  const res = await api.patch("/vehicle/pending-approvals/approve", payload);
  return res.data;
};

/* =========================================================
   REJECT PENDING VEHICLE
   ENDPOINT: /vehicle/pending-approvals/reject
========================================================= */
export const rejectPendingVehicle = async (vehicleId, reason) => {
  const payload = {
    vehicleId,
    reason,
  };
  const res = await api.patch("/vehicle/pending-approvals/reject", payload);
  return res.data;
};

/* =========================================================
   REQUEST CHANGES FOR PENDING VEHICLE
   ENDPOINT: /vehicle/pending-approvals/request-changes
========================================================= */
export const requestChangesPendingVehicle = async (vehicleId, reason) => {
  const payload = {
    vehicleId,
    reason,
  };
  const res = await api.patch(
    "/vehicle/pending-approvals/request-changes",
    payload,
  );
  return res.data;
};
