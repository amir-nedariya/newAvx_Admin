import axios from "axios";

const api = axios.create({
  // baseURL: "http://10.61.237.174:8104/api",
  baseURL: "http://192.168.0.187:8104/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
