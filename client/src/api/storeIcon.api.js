import api from "./axios";

const BASE = "/consultation/store-icon";

/* ================= LIST ALL ICONS ================= */
export const getAllStoreIcons = () => {
  return api.get(`${BASE}`);
};

/* ================= CREATE ICON ================= */
export const createStoreIcon = (request) => {
  return api.post(BASE, request);
};

/* ================= UPDATE ICON ================= */
export const updateStoreIcon = (id, request) => {
  return api.put(`${BASE}/${id}`, request);
};

/* ================= SOFT DELETE ICON ================= */
export const softDeleteStoreIcon = (id) => {
  return api.delete(`${BASE}/${id}`);
};
