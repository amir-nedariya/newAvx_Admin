import api from "./axios";

/* ================= TIER PLAN ================= */
export const getTierPlans = () => api.get("/tier-plan");

export const getTierPlanById = (id) =>
  api.get(`/tier-plan/${id}`);

export const createTierPlan = (payload) =>
  api.post("/tier-plan", payload);
