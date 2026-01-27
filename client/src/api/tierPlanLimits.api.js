import api from "./axios";

/* ================= LIMIT NAMES ================= */
export const getLimitNames = () => api.get("/tier-plan-limits/limit-names");

/* ================= LIST ================= */
export const getAllLimits = () => api.get("/tier-plan-limits");
export const getLimitsByTier = (tierPlanId) =>
  api.get(`/tier-plan-limits/tier-plan/${tierPlanId}`);

/* ================= CREATE ================= */
export const createTierLimits = (payload) =>
  api.post("/tier-plan-limits", payload);

/* ================= UPDATE / DELETE ================= */
export const updateLimit = (id, payload) =>
  api.put(`/tier-plan-limits/${id}`, payload);

export const deleteLimit = (id) => api.delete(`/tier-plan-limits/${id}`);
