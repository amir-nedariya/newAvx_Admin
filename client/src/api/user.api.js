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