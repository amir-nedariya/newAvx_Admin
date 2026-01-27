import api from "./axios";

const BASE = "/consultation/store-template";

/* ================= LIST ================= */
export const getStoreTemplates = (pageNo = 1) =>
  api.get(`${BASE}`, { params: { pageNo } });

/* ================= GET BY ID ================= */
export const getStoreTemplateById = (id) =>
  api.get(`${BASE}/${id}`);

/* ================= CREATE ================= */
export const createStoreTemplate = (formData) =>
  api.post(BASE, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/* ================= UPDATE ================= */
export const updateStoreTemplate = (id, formData) =>
  api.put(`${BASE}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/* ================= SOFT DELETE ================= */
export const softDeleteStoreTemplate = (id) =>
  api.delete(`${BASE}/soft/${id}`);

/* ================= HARD DELETE ================= */
export const deleteStoreTemplate = (id) =>
  api.delete(`${BASE}/${id}`);
