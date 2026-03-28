// import axios from "axios";


// const API = axios.create({
//   //baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080",
//   baseURL: process.env.REACT_APP_API_URL || "https://your-backend.onrender.com",
//   timeout: 10000,
// });

// API.interceptors.request.use(
//   (req) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       req.headers.Authorization = `Bearer ${token}`;
//     }
//     return req;
//   },
//   (error) => Promise.reject(error)
// );

// API.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response) {
//       const status = error.response.status;
//       if (status === 401) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("role");
//         localStorage.removeItem("username");
//         window.location.href = "/login";
//       }
//       if (status === 403) {
//         window.location.href = "/login";
//       }
//       if (status === 500) {
//         console.error("💥 Server Error");
//       }
//     } else {
//       console.error("🌐 Network Error - Backend unreachable");
//     }
//     return Promise.reject(error);
//   }
// );

// // AUTH
// export const loginUser = (data) => API.post("/auth/login", data);
// export const registerUser = (data) => API.post("/auth/register", data);

// // DEVICES
// export const getDevices = () => API.get("/devices");
// export const toggleDevice = (id) => API.put(`/devices/toggle/${id}`);
// export const addDevice = (device) => API.post("/devices/add", device);
// export const updateDevice = (id, device) => API.put(`/devices/update/${id}`, device);
// export const deleteDevice = (id) => API.delete(`/devices/delete/${id}`);
// export const updateDeviceBudget = (id, budget) => API.put(`/devices/budget/${id}?budget=${budget}`);

// // POWER LOGS
// export const getPowerLogs = () => API.get("/logs");

// // POWER USAGE
// export const getPowerUsage = () => API.get("/usage/all");

// // SYSTEM LOGS
// export const getSystemLogs = () => API.get("/devices/logs");

// // USER PROFILE
// export const getMyProfile = () => API.get("/users/me");

// // BUDGET ALERTS
// export const getBudgetStatus = () => API.get("/budget/status");

// export default API;

import axios from "axios";

/////////////////////////////////////////////////////////
// 🌐 BASE API CONFIG
/////////////////////////////////////////////////////////

const API = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    "https://power-monitor-backend-4lja.onrender.com", // ✅ your deployed backend

  timeout: 10000,
});

/////////////////////////////////////////////////////////
// 🔐 REQUEST INTERCEPTOR (ADD TOKEN)
/////////////////////////////////////////////////////////

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

/////////////////////////////////////////////////////////
// ⚠️ RESPONSE INTERCEPTOR (HANDLE ERRORS)
/////////////////////////////////////////////////////////

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        console.warn("🔒 Unauthorized - Logging out");

        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");

        window.location.href = "/login";
      }

      if (status === 403) {
        console.warn("⛔ Forbidden");
        window.location.href = "/login";
      }

      if (status === 404) {
        console.error("❌ API Not Found:", error.config.url);
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
// 🔐 AUTH (🔥 FINAL FIXED LOGIN)
/////////////////////////////////////////////////////////

export const loginUser = async ({ username, password }) => {
  // ✅ CLEAN INPUT (MOST IMPORTANT FIX)
  const cleanedData = {
    username: username?.trim().toLowerCase(),
    password: password?.trim(),
  };

  console.log("🔥 LOGIN REQUEST:", cleanedData);

  try {
    const response = await API.post("/auth/login", cleanedData);

    // ✅ SAVE DATA
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("role", response.data.role);
    localStorage.setItem("username", response.data.username);

    console.log("✅ LOGIN SUCCESS:", response.data);

    return response;
  } catch (error) {
    console.error("❌ LOGIN FAILED:", error.response?.data || error.message);
    throw error;
  }
};

export const registerUser = (data) => API.post("/auth/register", data);

/////////////////////////////////////////////////////////
// 🔌 DEVICES
/////////////////////////////////////////////////////////

export const getDevices = () => API.get("/devices/all");

export const toggleDevice = (id) => API.put(`/devices/toggle/${id}`);

export const addDevice = (device) => API.post("/devices/add", device);

export const updateDevice = (id, device) =>
  API.put(`/devices/update/${id}`, device);

export const deleteDevice = (id) =>
  API.delete(`/devices/delete/${id}`);

export const updateDeviceBudget = (id, budget) =>
  API.put(`/devices/budget/${id}?budget=${budget}`);

/////////////////////////////////////////////////////////
// 📊 LOGS
/////////////////////////////////////////////////////////

export const getSystemLogs = () => API.get("/devices/logs");
export const getPowerLogs = () => API.get("/logs");
export const getPowerUsage = () => API.get("/usage/all");

/////////////////////////////////////////////////////////
// 👤 USER
/////////////////////////////////////////////////////////

export const getMyProfile = () => API.get("/users/me");

/////////////////////////////////////////////////////////
// 💰 BUDGET
/////////////////////////////////////////////////////////

export const getBudgetStatus = () => API.get("/budget/status");

/////////////////////////////////////////////////////////

export default API;