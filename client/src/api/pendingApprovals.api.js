import api from "./axios";

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