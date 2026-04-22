import api from "./axios";

/* =========================================================
   FILTER CONSULTATION STORE THEMES
   ENDPOINT: /consultation/store-theme/filter
========================================================= */
export const filterConsultationStoreThemes = async (filterRequest) => {
  const res = await api.post(`/store-theme/filter`, filterRequest);
  return res.data;
};

/* =========================================================
   GET ALL CONSULTATION STORE THEMES (DEPRECATED - Use filter instead)
   ENDPOINT: /consultation/store-theme/filter
========================================================= */
export const getAllConsultationStoreThemes = async (pageNo = 1) => {
  // Use filter API with empty filters
  return filterConsultationStoreThemes({
    searchText: "",
    status: "",
    fromDate: null,
    toDate: null,
    tiers: [],
    pageNo: pageNo,
    pageSize: 10,
  });
};

/* =========================================================
   GET STORE THEME STATS
   ENDPOINT: /consultation/store-theme/stats
========================================================= */
export const getStoreThemeStats = async () => {
  const res = await api.get("/store-theme/stats");
  return res.data;
};

/* =========================================================
   CREATE CONSULTATION STORE THEME
   ENDPOINT: /consultation/store-theme
========================================================= */
export const createConsultationStoreTheme = async (formData) => {
  const res = await api.post("/store-theme", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

/* =========================================================
   SOFT DELETE STORE THEME
   ENDPOINT: /consultation/store-theme/{id}
========================================================= */
export const softDeleteStoreTheme = async (id) => {
  const res = await api.delete(`/store-theme/store-theme/${id}`);
  return res.data;
};

/* =========================================================
   GET STORE THEME BY ID
   ENDPOINT: /consultation/store-theme/{id}
========================================================= */
export const getStoreThemeById = async (id) => {
  const res = await api.get(`/store-theme/${id}`);
  return res.data;
};

/* =========================================================
   GET SOFT DELETED STORE THEME BY ID
   ENDPOINT: /consultation/store-theme/soft-deleted/{id}
========================================================= */
export const getSoftDeletedStoreThemeById = async (id) => {
  const res = await api.get(`/store-theme/store-theme/soft-deleted/${id}`);
  return res.data;
};

/* =========================================================
   UPDATE STORE THEME
   ENDPOINT: /consultation/store-theme/{id}
========================================================= */
export const updateStoreTheme = async (id, formData) => {
  const res = await api.put(`/store-theme/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

/* =========================================================
   DELETE STORE THEME (SOFT DELETE)
   ENDPOINT: /consultation/store-theme/soft-delete/{id}
========================================================= */
export const deleteStoreTheme = async (id) => {
  const res = await api.delete(`/store-theme/soft-delete/${id}`);
  return res.data;
};

/* =========================================================
   GET TIER PLANS
   ENDPOINT: /tier-plan
========================================================= */
export const getTierPlans = async () => {
  const res = await api.get("/tier-plan");
  return res.data;
};

/* =========================================================
   NORMALIZE PAGE RESPONSE
========================================================= */
export const normalizeStoreThemeResponse = (payload) => {
  const root = payload?.data ? payload : { data: [], pageResponse: {} };

  return {
    list: Array.isArray(root?.data) ? root.data : [],
    totalElements: Number(root?.pageResponse?.totalElements || 0),
    totalPages: Number(root?.pageResponse?.totalPages || 1),
    currentPage: Number(root?.pageResponse?.currentPage || 1),
    currentElements: Number(root?.pageResponse?.currentElements || 0),
  };
};

/* =========================================================
   ALIAS FOR BACKWARD COMPATIBILITY
========================================================= */
export const getStoreThemes = getAllConsultationStoreThemes;
export const createStoreTheme = createConsultationStoreTheme;
