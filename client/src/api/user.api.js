import api from "./axios"; // make sure api.js exists

/* ================= GET USERS (PAGINATED) ================= */
export const getUsers = async (pageNo = 1) => {
  try {
    const res = await api.get("/user", { params: { pageNo } });
    return res.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

/* ================= GET PENDING USER SELLERS (PAGINATED) ================= */
export const getPendingUserSellers = async (pageNo = 1) => {
  try {
    const res = await api.get("/user/pending", { params: { pageNo } });
    return res.data;
  } catch (error) {
    console.error("Error fetching pending user sellers:", error);
    throw error;
  }
};

/* ================= GET USER SELLER STATS ================= */
export const getUserSellerStats = async () => {
  try {
    const res = await api.get("/user/stats");
    return res.data;
  } catch (error) {
    console.error("Error fetching user seller stats:", error);
    throw error;
  }
};

/* ================= GET USER BY ID ================= */
export const getUserById = async (userId) => {
  try {
    const res = await api.get(`/user/${userId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

/* ================= PATCH USER STATUS ================= */
export const updateUserStatus = async (userId, status) => {
  try {
    const res = await api.patch(`/user/${userId}`, { status });
    return res.data;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
};

/* ================= GET USER META-DATA ================= */
export const getUserMetaData = async (userId) => {
  try {
    const res = await api.get(`/user/meta-data/${userId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching user meta-data:", error);
    return { error: true };
  }
};

/* ================= SUSPEND USER SELLER ================= */
export const suspendUserSeller = async (data) => {
  try {
    const res = await api.patch("/user/suspend", data);
    return res.data;
  } catch (error) {
    console.error("Error suspending user seller:", error);
    throw error;
  }
};

/* ================= FLAG USER SELLER FOR REVIEW ================= */
export const flagUserSellerForReview = async (data) => {
  try {
    const res = await api.patch("/user/flag-review", data);
    return res.data;
  } catch (error) {
    console.error("Error flagging user seller for review:", error);
    throw error;
  }
};

/* ================= UNSUSPEND USER SELLER ================= */
export const unsuspendUserSeller = async (data) => {
  try {
    const res = await api.patch("/user/unsuspend", data);
    return res.data;
  } catch (error) {
    console.error("Error unsuspending user seller:", error);
    throw error;
  }
};

/* ================= CLEAR USER SELLER FLAG ================= */
export const clearUserSellerFlag = async (data) => {
  try {
    const res = await api.patch("/user/clear-flag", data);
    return res.data;
  } catch (error) {
    console.error("Error clearing user seller flag:", error);
    throw error;
  }
};

/* ================= GET SUSPENDED USER SELLERS ================= */
export const getSuspendedUserSellers = async () => {
  try {
    const res = await api.get("/user/suspended");
    return res.data;
  } catch (error) {
    console.error("Error fetching suspended user sellers:", error);
    throw error;
  }
};

/* ================= GET FLAGGED USER SELLERS ================= */
export const getFlaggedUserSellers = async () => {
  try {
    const res = await api.get("/user/flagged");
    return res.data;
  } catch (error) {
    console.error("Error fetching flagged user sellers:", error);
    throw error;
  }
};

/* ================= APPROVE USER SELLER KYC ================= */
export const approveUserSellerKYC = async (data) => {
  try {
    const res = await api.patch("/user/kyc/approve", data);
    return res.data;
  } catch (error) {
    console.error("Error approving user seller KYC:", error);
    throw error;
  }
};

/* ================= REJECT USER SELLER KYC ================= */
export const rejectUserSellerKYC = async (data) => {
  try {
    const res = await api.patch("/user/kyc/reject", data);
    return res.data;
  } catch (error) {
    console.error("Error rejecting user seller KYC:", error);
    throw error;
  }
};

/* ================= REQUEST CHANGES USER SELLER KYC ================= */
export const requestChangesUserSellerKYC = async (data) => {
  try {
    const res = await api.patch("/user/kyc/request-changes", data);
    return res.data;
  } catch (error) {
    console.error("Error requesting changes for user seller KYC:", error);
    throw error;
  }
};
