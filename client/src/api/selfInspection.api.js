import api from "./axios";

/**
 * Filter self-inspections with pagination + search
 * POST /api/vehicle/inspection/self
 * @param {Object} filter - { searchText, pageNo, verificationStatus }
 */
export const filterSelfInspections = async (filter = {}) => {
  const response = await api.post("/vehicle/inspection/self", {
    searchText: filter.searchText?.trim() || null,
    pageNo: filter.pageNo || 1,
    verificationStatus: filter.verificationStatus || null,
  });
  return response.data;
};

/**
 * Approve self-inspection request
 * PATCH /api/vehicle/inspection/self/approve
 * @param {Object} data - { id, remarks }
 */
export const approveSelfInspection = async (data) => {
  const response = await api.patch("/vehicle/inspection/self/approve", data);
  return response.data;
};

/**
 * Reject self-inspection request
 * PATCH /api/vehicle/inspection/self/reject
 * @param {Object} data - { id, remarks }
 */
export const rejectSelfInspection = async (data) => {
  const response = await api.patch("/vehicle/inspection/self/reject", data);
  return response.data;
};

/**
 * Request changes for self-inspection
 * PATCH /api/vehicle/inspection/self/request-changes
 * @param {Object} data - { id, remarks }
 */
export const requestChangesSelfInspection = async (data) => {
  const response = await api.patch("/vehicle/inspection/self/request-changes", data);
  return response.data;
};

/**
 * Get self-inspection report PDF URL
 * GET /api/vehicle/inspection/self/{id}/report
 * @param {string} id - Self inspection ID
 */
export const getSelfInspectionReport = async (id) => {
  const response = await api.get(`/vehicle/inspection/self/${id}/report`);
  return response.data;
};

/**
 * Get self-inspection stats
 * GET /api/vehicle/inspection/self/stats
 */
export const getSelfInspectionStats = async () => {
  const response = await api.get("/vehicle/inspection/self/stats");
  return response.data;
};
