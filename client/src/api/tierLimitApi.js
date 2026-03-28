// src/api/tierLimitApi.js
import api from "./axios";

/* ✅ GET: all limit names (enum list) */
export const getTierLimitNames = async () => {
  const res = await api.get("/tier-plan-limits/limit-names");
  return res.data; // {status, data:[...]}
};

/* ✅ POST: create limits for tier plan */
export const createTierLimits = async ({ tierPlanId, limits }) => {
  const res = await api.post("/tier-plan-limits", { tierPlanId, limits });
  return res.data;
};

/* ✅ GET: all tier limits */
export const getAllTierLimits = async () => {
  const res = await api.get("/tier-plan-limits");
  return res.data;
};

/* ✅ GET: single tier limit by id */
export const getTierLimitById = async (tierLimitID) => {
  const res = await api.get(`/tier-plan-limits/${tierLimitID}`);
  return res.data;
};

/* ✅ GET: all limits of tier plan */
export const getLimitsByTierPlanId = async (tierPlanID) => {
  const res = await api.get(`/tier-plan-limits/tier-plan/${tierPlanID}`);
  return res.data;
};

/* ✅ DELETE: tier limit by id */
export const deleteTierLimit = async (tierLimitID) => {
  const res = await api.delete(`/tier-plan-limits/${tierLimitID}`);
  return res.data;
};

/* ✅ UPDATE: placeholder (endpoint not provided yet)
   If backend gives PUT/PATCH route, update here quickly.
*/
// export const updateTierLimit = async (tierLimitID, payload) => {
//   const res = await api.put(`/tier-plan-limits/${tierLimitID}`, payload);
//   return res.data;
// };