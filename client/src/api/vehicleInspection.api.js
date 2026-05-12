import axios from "./axios";

/**
 * Get all vehicle inspection requests with filter + pagination
 * POST /api/vehicle/inspection
 * @param {Object} filter - { searchText, pageNo }
 */
export const getAllVehicleInspections = async (filter = {}) => {
  const response = await axios.post("/vehicle/inspection", filter);
  return response.data;
};

/**
 * Assign inspector to a request
 * PATCH /api/vehicle/inspection/assign-inspector
 * @param {Object} data - { inspectionRequestId, inspectorId, scheduleDate }
 */
export const assignInspector = async (data) => {
  const response = await axios.patch("/vehicle/inspection/assign-inspector", data);
  return response.data;
};
