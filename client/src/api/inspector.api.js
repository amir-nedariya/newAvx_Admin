import axios from "./axios";

/**
 * Create a new inspector
 * POST /api/inspector
 * @param {Object} request - { inspectorUsername, inspectorPassword }
 */
export const createInspector = async (request) => {
  const response = await axios.post("/inspector", request);
  return response.data;
};

/**
 * Get inspector by ID
 * GET /api/inspector/:inspectorId
 * @param {string} inspectorId
 */
export const getInspectorById = async (inspectorId) => {
  const response = await axios.get(`/inspector/${inspectorId}`);
  return response.data;
};

/**
 * Get all inspectors with pagination
 * GET /api/inspector?pageNo=1
 * @param {number} pageNo - Page number (default 1)
 */
export const getAllInspectors = async (pageNo = 1) => {
  const response = await axios.get(`/inspector?pageNo=${pageNo}`);
  return response.data;
};

/**
 * Update an inspector
 * PUT /api/inspector/:inspectorId
 * @param {string} inspectorId
 * @param {Object} request - { inspectorId, inspectorUsername, inspectorPassword }
 */
export const updateInspector = async (inspectorId, request) => {
  const response = await axios.put(`/inspector/${inspectorId}`, request);
  return response.data;
};

/**
 * Delete an inspector
 * DELETE /api/inspector/:inspectorId
 * @param {string} inspectorId
 */
export const deleteInspector = async (inspectorId) => {
  const response = await axios.delete(`/inspector/${inspectorId}`);
  return response.data;
};
