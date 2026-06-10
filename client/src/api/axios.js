import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://192.168.0.181:8104/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;