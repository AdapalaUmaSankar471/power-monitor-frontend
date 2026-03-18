import axios from "axios";

// ============================
// AXIOS INSTANCE
// ============================
const API = axios.create({
  baseURL:process.env.REACT_APP_API_URL || "http://localhost:8080",
  timeout: 10000,
});

// ============================
// REQUEST INTERCEPTOR (TOKEN)
// ============================
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

// ============================
// RESPONSE INTERCEPTOR
// ============================
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        console.warn("🔒 Unauthorized - Redirecting...");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      if (status === 500) {
        console.error("💥 Server Error");
      }
    }
    return Promise.reject(error);
  }
);

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
// ✅ USER PROFILE API
/////////////////////////////////////////////////////////
export const getMyProfile = () => API.get("/users/me");

export default API;