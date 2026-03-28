/* =========================================================
   ✅ FILE: src/api/tierPlanLimits.api.js
========================================================= */

import api from "./axios";

/* ================= LIMIT NAMES ================= */
export const getTierLimitNames = () => api.get("/tier-plan-limits/limit-names");

/* ================= LIST ================= */
export const getAllTierLimits = () => api.get("/tier-plan-limits");

export const getTierLimitsByTierPlanId = (tierPlanId) =>
  api.get(`/tier-plan-limits/tier-plan/${tierPlanId}`);

/* ================= CREATE ================= */
export const createTierLimits = (payload) =>
  api.post("/tier-plan-limits", payload);

/* ================= UPDATE ================= */
export const updateTierLimitById = (id, payload) =>
  api.put(`/tier-plan-limits/${id}`, payload);

/* ================= DELETE ================= */
export const deleteTierLimitById = (id) =>
  api.delete(`/tier-plan-limits/${id}`);

/* ================= ALIASES  (old imports fix) ================= */
export const getLimitNames = getTierLimitNames;
export const getLimitsByTier = getTierLimitsByTierPlanId;

export const updateLimit = updateTierLimitById;
export const deleteLimit = deleteTierLimitById;