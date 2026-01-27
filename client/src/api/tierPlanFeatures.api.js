import api from "./axios";

/* ================= LIST ================= */
export const getAllFeatures = () => api.get("/tier-plan-features");
export const getFeaturesByTier = (tierPlanId) =>
  api.get(`/tier-plan-features/tier-plan/${tierPlanId}`);

/* ================= CREATE ================= */
export const createTierFeatures = (payload) =>
  api.post("/tier-plan-features", payload);

/* ================= UPDATE / DELETE ================= */
export const updateFeature = (id, payload) =>
  api.put(`/tier-plan-features/${id}`, payload);

export const deleteFeature = (id) =>
  api.delete(`/tier-plan-features/${id}`);
