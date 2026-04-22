import axios from "./axios";

/**
 * Filter buyers with pagination
 * @param {Object} filterRequest - Filter criteria
 * @param {string} filterRequest.searchText - Search by user ID, name, mobile, email
 * @param {number} filterRequest.cityId - City ID
 * @param {string} filterRequest.status - ACTIVE, INACTIVE, SUSPENDED
 * @param {string} filterRequest.risk - Low, Moderate, High
 * @param {number} pageNo - Page number (0-indexed)
 * @returns {Promise} - API response with paginated buyer data
 */
export const filterBuyers = async (filterRequest, pageNo = 1) => {
  const response = await axios.post(
    `/buyer/filter?pageNo=${pageNo}`,
    filterRequest,
  );
  return response.data;
};

/**
 * Get buyer statistics
 * @returns {Promise} - API response with buyer stats
 */
export const getBuyerStats = async () => {
  const response = await axios.get("/buyer/stats");
  return response.data;
}; /**
 * Suspend a buyer
 * @param {string} userId - User ID
 * @param {Object} data - Suspension data
 * @returns {Promise} - API response
 */
export const suspendBuyer = async (userId, data) => {
  const response = await axios.post(`/buyer/${userId}/suspend`, data);
  return response.data;
};

/**
 * Reinstate a suspended buyer
 * @param {string} userId - User ID
 * @param {Object} data - Reinstate data
 * @returns {Promise} - API response
 */
export const reinstateBuyer = async (userId, data) => {
  const response = await axios.post(`/buyer/${userId}/reinstate`, data);
  return response.data;
};

/**
 * Limit buyer inquiries
 * @param {string} userId - User ID
 * @param {Object} data - Limit data
 * @returns {Promise} - API response
 */
export const limitBuyerInquiries = async (userId, data) => {
  const response = await axios.post(`/buyer/${userId}/limit-inquiries`, data);
  return response.data;
};

/**
 * Flag buyer for review
 * @param {string} userId - User ID
 * @param {Object} data - Flag data
 * @returns {Promise} - API response
 */
export const flagBuyerForReview = async (userId, data) => {
  const response = await axios.post(`/buyer/${userId}/flag`, data);
  return response.data;
};

/**
 * Add internal note for buyer
 * @param {string} userId - User ID
 * @param {Object} data - Note data
 * @returns {Promise} - API response
 */
export const addBuyerInternalNote = async (userId, data) => {
  const response = await axios.post(`/buyer/${userId}/internal-note`, data);
  return response.data;
};

/**
 * Get all cities for filter
 * @returns {Promise} - API response with cities
 */
export const getCities = async () => {
  const response = await axios.get("/address/cities");
  return response.data;
};
