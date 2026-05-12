import axios from "./axios";

/**
 * Create a new inspector
 * POST /api/inspector  (multipart/form-data)
 * @param {FormData} formData
 */
export const createInspector = async (formData) => {
  const response = await axios.post("/inspector", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

/**
 * Get inspector by ID
 * GET /api/inspector/:inspectorId
 */
export const getInspectorById = async (inspectorId) => {
  const response = await axios.get(`/inspector/${inspectorId}`);
  return response.data;
};

/**
 * Get all inspectors with pagination
 * GET /api/inspector?pageNo=1
 */
export const getAllInspectors = async (pageNo = 1) => {
  const response = await axios.get(`/inspector?pageNo=${pageNo}`);
  return response.data;
};

/**
 * Update an inspector
 * PUT /api/inspector/:inspectorId  (multipart/form-data)
 * @param {string} inspectorId
 * @param {FormData} formData
 */
export const updateInspector = async (formData) => {
  const response = await axios.put(`/inspector`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

/**
 * Delete an inspector
 * DELETE /api/inspector/:inspectorId
 */
export const deleteInspector = async (inspectorId) => {
  const response = await axios.delete(`/inspector/${inspectorId}`);
  return response.data;
};
