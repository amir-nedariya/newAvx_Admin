import api from "./axios";

export const createStoreTheme = async (payload) => {
  const res = await api.post("/store-theme", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

/* ================= LIST ================= */
export const getStoreThemes = async (pageNo = 1) => {
  const res = await api.get("/store-theme", { params: { pageNo } });
  return res.data;
};

/* ================= GET ACTIVE BY ID ================= */
export const getStoreThemeById = async (id) => {
  const res = await api.get(`/store-theme/${id}`);
  return res.data;
};

/* ================= GET SOFT-DELETED BY ID ================= */
export const getSoftDeletedStoreThemeById = async (id) => {
  const res = await api.get(`/store-theme/soft-delete/${id}`);
  return res.data;
};

// /* ================= UPDATE ================= */
// export const updateStoreTheme = async (id, payload) => {
//   const res = await api.put(`/store-theme/${id}`, payload);
//   return res.data;
// };
/* ================= UPDATE ================= */
export const updateStoreTheme = async (id, payload) => {
  const res = await api.put(`/store-theme/${id}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};


/* ================= HARD DELETE ================= */
export const deleteStoreTheme = async (id) => {
  const res = await api.delete(`/store-theme/${id}`);
  return res.data;
};

/* ================= SOFT DELETE ================= */
export const softDeleteStoreTheme = async (id) => {
  const res = await api.delete(`/store-theme/soft-delete/${id}`);
  return res.data;
};

/* ================= TIERS ================= */
export const getTierPlans = async () => {
  const res = await api.get("/tier-plan");
  return res.data.data || [];
};
