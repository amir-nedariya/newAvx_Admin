import api from "./axios";

const BASE = "/consultation/store-template";

/* ================= LIST WITH FILTERS ================= */
export const getAllStoreTemplates = (params = {}) => {
  const {
    status,
    tierPlanId,
    orderBy = "updatedAt",
    orderDirection = "desc",
    page = 1,
    size = 10,
  } = params;

  const queryParams = {
    page,
    size,
    orderBy,
    orderDirection,
  };

  if (status) queryParams.status = status;
  if (tierPlanId) queryParams.tierPlanId = tierPlanId;

  return api.get(`${BASE}`, { params: queryParams });
};

/* ================= LIST (Legacy) ================= */
export const getStoreTemplates = (pageNo = 1) =>
  api.get(`${BASE}`, { params: { pageNo } });

/* ================= GET BY ID ================= */
export const getStoreTemplateById = (id) => api.get(`${BASE}/${id}`);

/* ================= GET IMAGE TYPES ================= */
export const getStoreImageTypes = () => api.get(`${BASE}/image-types`);

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
export const softDeleteStoreTemplate = (id) => api.delete(`${BASE}/soft/${id}`);

/* ================= HARD DELETE ================= */
export const deleteStoreTemplate = (id) => api.delete(`${BASE}/${id}`);
