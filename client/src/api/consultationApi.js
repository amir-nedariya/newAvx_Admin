import api from "./axios";



/* ================= LIST ================= */

// export const getConsultantsByStatus = (status = "REQUESTED", pageNo = 1) =>
//   api.get("/consultation/verification-status", {
//     params: { verificationStatus: status, pageNo },
//   });

  /* ================= LIST ================= */

// If status is "ALL" or undefined, call API without verificationStatus
// export const getConsultantsByStatus = (status = "REQUESTED", pageNo = 1) =>
//   // api.get("/consultation/verification-status", {
// api.get("/consultation/filter", {
//     params:
//       !status || status === "ALL"
//         ? { pageNo } // ALL: no verificationStatus param
//         : { verificationStatus: status, pageNo }, // Specific status
//   });

export const getConsultantsByStatus = (
  status = "REQUESTED",
  pageNo = 1,
  searchText = ""
) =>
  api.get("/consultation/filter", {
    params: {
      pageNo,
      ...(status && status !== "ALL" && {
        verificationStatus: status,
      }),
      ...(searchText && {
        searchText,
      }),
    },
  });

/* ================= CHANGE STATUS ================= */
export const changeConsultantStatus = (id, currentActive) => {
  const newStatus = currentActive ? "INACTIVE" : "ACTIVE";
  return api.patch(`/consultation/change-status/${id}`, { status: newStatus });
};

/* ================= ACTIONS ================= */

export const suspendConsultantApi = (id, reason) =>
  api.post(`/consultation/suspend/${id}`, { reason });

/* ================= SINGLE ================= */

export const getConsultationById = (id) =>
  api.get(`/consultation/${id}`);

export const getConsultationAddress = (id) =>
  api.get(`/consultation/address/${id}`);

export const getConsultationDocuments = (id) =>
  api.get(`/consultation/document/${id}`);

/* ================= VERIFY (PATCH ONLY) ================= */

export const verifyConsultation = (id, payload) =>
  api.patch(`/consultation/verify/${id}`, payload);
