import axios from "axios";
import { API_BASE_URL } from "./config";

const BASE_URL = API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request interceptor — attach JWT ──────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("angaar_admin_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor — handle 401 ─────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is missing or expired — clear storage and redirect to login
      localStorage.removeItem("angaar_admin_token");
      localStorage.removeItem("angaar_admin_user");
      // Dispatch a custom event so AuthContext can react
      window.dispatchEvent(new Event("angaar_auth_expired"));
    }
    return Promise.reject(error);
  }
);

export default api;
