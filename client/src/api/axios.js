import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.0.188:8104/api",
  // baseURL: "http://10.201.29.2:8104/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
