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
 * Get all vehicle assigned inspection with filter + pagination
 * POST /api/vehicle/inspection/assigned
 * @param {Object} filter - { searchText, pageNo }
 */
export const getAllVehicleInspectionAssigned = async (filter = {}) => {
  const response = await axios.post("/vehicle/inspection/assigned", filter);
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

/**
 * Get vehicle inspection by id
 * GET /api/vehicle/inspection/{id}
 */
export const getVehicleInspectionById = async (id) => {
  const response = await axios.get(`/vehicle/inspection/${id}`);
  return response.data;
};

/**
 * Get assigned vehicle inspection by id
 * GET /api/vehicle/inspection/assigned/{id}
 */
export const getVehicleInspectionAssignmentById = async (id) => {
  const response = await axios.get(`/vehicle/inspection/assigned/${id}`);
  return response.data;
};
/**
 * Approve inspection report
 * PATCH /api/vehicle/inspection/approve
 * @param {Object} data - { assignmentId }
 */
export const approveInspection = async (data) => {
  const response = await axios.patch("/vehicle/inspection/approve", data);
  return response.data;
};

/**
 * Reject inspection report
 * PATCH /api/vehicle/inspection/reject
 * @param {Object} data - { assignmentId, remarks }
 */
export const rejectInspection = async (data) => {
  const response = await axios.patch("/vehicle/inspection/reject", data);
  return response.data;
};
