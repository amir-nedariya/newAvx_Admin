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
