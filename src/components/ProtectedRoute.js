import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080",
  timeout: 10000,
});

API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        console.warn("🔒 Unauthorized - Clearing session...");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        window.location.href = "/login";
      }
      if (status === 403) {
        console.warn("⛔ Forbidden - Access Denied");
        window.location.href = "/login";
      }
      if (status === 500) {
        console.error("💥 Server Error");
      }
    } else {
      console.error("🌐 Network Error - Backend unreachable");
    }
    return Promise.reject(error);
  }
);

/////////////////////////////////////////////////////////
// AUTH APIs
/////////////////////////////////////////////////////////
export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);

/////////////////////////////////////////////////////////
// DEVICE APIs
/////////////////////////////////////////////////////////
export const getDevices = () => API.get("/devices/all");
export const toggleDevice = (id) => API.put(`/devices/toggle/${id}`);
export const addDevice = (device) => API.post("/devices/add", device);
export const updateDevice = (id, device) => API.put(`/devices/update/${id}`, device);
export const deleteDevice = (id) => API.delete(`/devices/delete/${id}`);

/////////////////////////////////////////////////////////
// POWER LOG APIs
/////////////////////////////////////////////////////////
export const getPowerLogs = () => API.get("/logs");

/////////////////////////////////////////////////////////
// POWER USAGE
/////////////////////////////////////////////////////////
export const getPowerUsage = () => API.get("/usage/all");

/////////////////////////////////////////////////////////
// SYSTEM LOGS
/////////////////////////////////////////////////////////
export const getSystemLogs = () => API.get("/devices/logs");

/////////////////////////////////////////////////////////
// USER PROFILE API
/////////////////////////////////////////////////////////
export const getMyProfile = () => API.get("/users/me");

export default API;