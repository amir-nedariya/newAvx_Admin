import api from "./axios";

/* ================= GET ALL (PAGINATED) ================= */
export const getVehicleImageKeys = (pageNo = 1, vehicleType) =>
  api.get("/vehicle-image-key", {
    params: { pageNo, vehicleType },
  });

/* ================= GET VEHICLE TYPES ================= */
export const getVehicleTypes = () =>
  api.get("/vehicle-image-key/vehicle-types");

/* ================= CREATE ================= */
export const createVehicleImageKey = (payload) =>
  api.post("/vehicle-image-key", payload);

/* ================= UPDATE ================= */
export const updateVehicleImageKey = (id, payload) =>
  api.put(`/vehicle-image-key/${id}`, payload);

/* ================= DELETE ================= */
export const deleteVehicleImageKey = (id) =>
  api.delete(`/vehicle-image-key/${id}`);
