// src/api/tierPlanApi.js
import api from "./axios";

export const getTierPlans = async () => {
  const res = await api.get("/tier-plan");
  return res.data;
};

// export const createTierPlan = async (payload) => {
//   const res = await api.post("/tier-plan", payload);
//   return res.data;
// };

/* ================= CREATE TIER PLAN =================
   NOTE:
   API expects multipart/form-data because badgeLogo is binary file
==================================================== */
export const createTierPlan = async (payload) => {
  const formData = new FormData();

  formData.append("title", payload.title || "");
  formData.append("description", payload.description || "");
  formData.append("yearly_price", String(payload.yearly_price || 0));
  formData.append("monthly_price", String(payload.monthly_price || 0));
  formData.append(
    "monthlyDurationInDays",
    String(payload.monthlyDurationInDays || 30)
  );
  formData.append(
    "yearlyDurationInDays",
    String(payload.yearlyDurationInDays || 365)
  );

  if (payload.badgeLogo) {
    formData.append("badgeLogo", payload.badgeLogo);
  }

  const res = await api.post("/tier-plan", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const getTierPlanById = async (id) => {
  const res = await api.get(`/tier-plan/${id}`);
  return res.data;
};

// ✅ alias (so old imports don't break)
export const getAllTierPlans = getTierPlans;