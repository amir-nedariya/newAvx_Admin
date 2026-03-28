// src/api/tierFeatureApi.js
import api from "./axios";

export const addTierPlanFeatures = async (payload) => {
  const res = await api.post("/tier-plan-features", payload);
  return res.data;
};

export const getAllTierPlanFeatures = async () => {
  const res = await api.get("/tier-plan-features");
  return res.data;
};

export const getTierFeatureById = async (tierFeatureId) => {
  const res = await api.get(`/tier-plan-features/${tierFeatureId}`);
  return res.data;
};

export const getFeaturesByTierPlanId = async (tierPlanId) => {
  const res = await api.get(`/tier-plan-features/tier-plan/${tierPlanId}`);
  return res.data;
};

/* ✅ UPDATE FEATURE BY FEATURE ID */
export const updateTierFeatureById = async (tierFeaturesID, payload) => {
  // payload: { featureName, featureDescription, status }
  const res = await api.put(`/tier-plan-features/${tierFeaturesID}`, payload);
  return res.data;
};

/* ✅ DELETE FEATURE BY FEATURE ID */
export const deleteTierFeatureById = async (tierFeaturesID) => {
  const res = await api.delete(`/tier-plan-features/${tierFeaturesID}`);
  return res.data;
};