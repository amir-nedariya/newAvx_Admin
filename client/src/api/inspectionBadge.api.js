import api from "./axios";

/* ================= GET ALL BADGES ================= */
export const getInspectionBadges = () =>
  api.get("/inspection-badge");

/* ================= GET STATUS LIST ================= */
export const getInspectionStatusList = () =>
  api.get("/inspection-badge/inspection-status");

/* ================= CREATE BADGE ================= */
export const createInspectionBadge = (formData) =>
  api.post("/inspection-badge", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

/* ================= UPDATE BADGE ================= */
export const updateInspectionBadge = (id, formData) =>
  api.put(`/inspection-badge/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
