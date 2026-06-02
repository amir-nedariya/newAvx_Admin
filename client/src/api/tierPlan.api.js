// src/api/tierPlan.api.js
import api from "./axios";

export const getTierPlans = async () => {
  const res = await api.get("/tier-plan");
  return res.data;
};

/* ================= CREATE TIER PLAN =================
   NOTE:
   API expects multipart/form-data because badgeLogo is binary file
   and features are sent as JSON strings
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

  // Grace Periods
  formData.append("monthlyGracePeriodDays", String(payload.monthlyGracePeriodDays ?? 0));
  formData.append("yearlyGracePeriodDays", String(payload.yearlyGracePeriodDays ?? 0));

  // Monthly Limits
  formData.append("monthlyMaxVehicleOnMarketPlace", String(payload.monthlyMaxVehicleOnMarketPlace ?? 0));
  formData.append("monthlyMaxFreeInspection", String(payload.monthlyMaxFreeInspection ?? 0));
  formData.append("monthlyStoreImageCustomUpload", String(payload.monthlyStoreImageCustomUpload ?? false));
  formData.append("monthlyTwoWheelInspectionDiscount", String(payload.monthlyTwoWheelInspectionDiscount ?? 0));
  formData.append("monthlyFourWheelInspectionDiscount", String(payload.monthlyFourWheelInspectionDiscount ?? 0));

  // Yearly Limits
  formData.append("yearlyMaxVehicleOnMarketPlace", String(payload.yearlyMaxVehicleOnMarketPlace ?? 0));
  formData.append("yearlyMaxFreeInspection", String(payload.yearlyMaxFreeInspection ?? 0));
  formData.append("yearlyStoreImageCustomUpload", String(payload.yearlyStoreImageCustomUpload ?? false));
  formData.append("yearlyTwoWheelInspectionDiscount", String(payload.yearlyTwoWheelInspectionDiscount ?? 0));
  formData.append("yearlyFourWheelInspectionDiscount", String(payload.yearlyFourWheelInspectionDiscount ?? 0));

  // Features (JSON string)
  formData.append("monthlyFeatures", payload.monthlyFeatures || "[]");
  formData.append("yearlyFeatures", payload.yearlyFeatures || "[]");

  // Razorpay
  formData.append("monthlyRazorpayPlanId", payload.monthlyRazorpayPlanId || "");
  formData.append("yearlyRazorpayPlanId", payload.yearlyRazorpayPlanId || "");

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

/* ================= UPDATE TIER PLAN ================= */
export const updateTierPlan = async (id, payload) => {
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
  formData.append("status", payload.status || "ACTIVE");

  // Grace Periods
  formData.append("monthlyGracePeriodDays", String(payload.monthlyGracePeriodDays ?? 0));
  formData.append("yearlyGracePeriodDays", String(payload.yearlyGracePeriodDays ?? 0));

  // Monthly Limits
  formData.append("monthlyMaxVehicleOnMarketPlace", String(payload.monthlyMaxVehicleOnMarketPlace ?? 0));
  formData.append("monthlyMaxFreeInspection", String(payload.monthlyMaxFreeInspection ?? 0));
  formData.append("monthlyStoreImageCustomUpload", String(payload.monthlyStoreImageCustomUpload ?? false));
  formData.append("monthlyTwoWheelInspectionDiscount", String(payload.monthlyTwoWheelInspectionDiscount ?? 0));
  formData.append("monthlyFourWheelInspectionDiscount", String(payload.monthlyFourWheelInspectionDiscount ?? 0));

  // Yearly Limits
  formData.append("yearlyMaxVehicleOnMarketPlace", String(payload.yearlyMaxVehicleOnMarketPlace ?? 0));
  formData.append("yearlyMaxFreeInspection", String(payload.yearlyMaxFreeInspection ?? 0));
  formData.append("yearlyStoreImageCustomUpload", String(payload.yearlyStoreImageCustomUpload ?? false));
  formData.append("yearlyTwoWheelInspectionDiscount", String(payload.yearlyTwoWheelInspectionDiscount ?? 0));
  formData.append("yearlyFourWheelInspectionDiscount", String(payload.yearlyFourWheelInspectionDiscount ?? 0));

  // Features (JSON string)
  formData.append("monthlyFeatures", payload.monthlyFeatures || "[]");
  formData.append("yearlyFeatures", payload.yearlyFeatures || "[]");

  // Razorpay
  formData.append("monthlyRazorpayPlanId", payload.monthlyRazorpayPlanId || "");
  formData.append("yearlyRazorpayPlanId", payload.yearlyRazorpayPlanId || "");

  if (payload.badgeLogo) {
    formData.append("badgeLogo", payload.badgeLogo);
  }

  const res = await api.put(`/tier-plan/${id}`, formData, {
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