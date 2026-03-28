// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { Box, Typography, Paper, IconButton, Button, Chip } from "@mui/material";
// import NotificationsIcon from "@mui/icons-material/Notifications";

// import DashboardCards from "../components/DashboardCards";
// import PowerChart from "../components/PowerChart";
// import ChartPanel from "../components/ChartPanel";
// import { getDevices, toggleDevice as toggleDeviceApi } from "../services/api";

// import SockJS from "sockjs-client";
// import { Client } from "@stomp/stompjs";

// function AdminDashboard() {
//   const [devices, setDevices] = useState([]);
//   const [load, setLoad] = useState(0);
//   const [notifications, setNotifications] = useState([]);
//   const [showNotifications, setShowNotifications] = useState(false);

//   const overloadRef = useRef(false);

//   const loadDevices = async () => {
//     try {
//       const res = await getDevices();
//       console.log("Devices API response:", res.data);
//       setDevices(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       console.log("Error loading devices:", err);
//       setDevices([]);
//     }
//   };

//   const isDeviceOn = (status) => {
//     return (
//       status === true ||
//       status === "ON" ||
//       status === "on" ||
//       status === 1
//     );
//   };

//   const getDevicePower = (d) => {
//     return Number(d.powerRating || d.power || d.watts || 0);
//   };

//   const calculateLoadFromDevices = useCallback((deviceList) => {
//     return deviceList.reduce((sum, d) => {
//       return sum + (isDeviceOn(d.status) ? getDevicePower(d) : 0);
//     }, 0);
//   }, []);

//   const toggleDevice = async (id) => {
//     try {
//       await toggleDeviceApi(id);
//       await loadDevices();
//     } catch (err) {
//       console.log("Error toggling device:", err);
//     }
//   };

//   useEffect(() => {
//     loadDevices();
//   }, []);

//   useEffect(() => {
//     const calculatedLoad = calculateLoadFromDevices(devices);
//     setLoad(calculatedLoad);
//   }, [devices, calculateLoadFromDevices]);

//   useEffect(() => {
//     const wsUrl = (process.env.REACT_APP_API_URL || 'http://localhost:8080').replace('http://', 'https://');
//     const socket = new SockJS(wsUrl + '/power-monitor');

//     const client = new Client({
//       webSocketFactory: () => socket,
//       reconnectDelay: 5000,

//       onConnect: () => {
//         console.log("WebSocket connected");

//         client.subscribe("/topic/power", (message) => {
//           const data = JSON.parse(message.body);
//           console.log("WebSocket data:", data);

//           const totalLoad = Number(data.totalLoad || 0);
//           setLoad(totalLoad);

//           const time = new Date().toLocaleTimeString();

//           if (totalLoad > 3000 && !overloadRef.current) {
//             overloadRef.current = true;

//             setNotifications((prev) => [
//               {
//                 message: "⚠ Power overload detected!",
//                 time,
//               },
//               ...prev,
//             ]);
//           }

//           if (totalLoad <= 3000) {
//             overloadRef.current = false;
//           }
//         });
//       },
//     });

//     client.activate();
//     return () => client.deactivate();
//   }, []);

//   return (
//     // ✅ NO Sidebar here — DashboardLayout already has it
//     // ✅ NO ml:"230px" — DashboardLayout handles positioning
//     <Box sx={mainContainer}>

//       {/* HEADER */}
//       <Box sx={headerStyle}>
//         <Typography variant="h4" fontWeight="bold">
//           ⚡ Smart Power Monitoring
//         </Typography>

//         <Box sx={{ position: "relative" }}>
//           <IconButton onClick={() => setShowNotifications(!showNotifications)}>
//             <NotificationsIcon />
//           </IconButton>

//           {showNotifications && (
//             <Box sx={notificationPanel}>
//               <Typography variant="subtitle1">Notifications</Typography>

//               {notifications.length === 0 ? (
//                 <Typography>No alerts</Typography>
//               ) : (
//                 notifications.map((n, i) => (
//                   <Box key={i} sx={notificationItem}>
//                     {n.message}
//                     <br />
//                     <small>{n.time}</small>
//                   </Box>
//                 ))
//               )}
//             </Box>
//           )}
//         </Box>
//       </Box>

//       {/* ALERT */}
//       {load > 3000 && (
//         <Box sx={alertStyle}>⚠ Power overload detected!</Box>
//       )}

//       {/* CARDS */}
//       <DashboardCards
//         devices={devices.length}
//         activeDevices={devices.filter((d) => isDeviceOn(d.status)).length}
//         load={load}
//         status={load > 3000 ? "OVERLOAD" : "NORMAL"}
//       />

//       {/* LINE CHART */}
//       <Paper sx={paperStyle}>
//         <Typography variant="h6">Power Usage</Typography>
//         <PowerChart load={load} />
//       </Paper>

//       {/* PIE CHART */}
//       <Paper sx={paperStyle}>
//         <Typography variant="h6">Device Power Distribution</Typography>
//         <Box sx={{ width: "400px", margin: "auto" }}>
//           <ChartPanel devices={devices} />
//         </Box>
//       </Paper>

//       {/* DEVICES */}
//       <Paper sx={paperStyle}>
//         <Typography variant="h6">Devices</Typography>
//         <Box sx={deviceGrid}>
//           {devices.map((device) => (
//             <Box key={device.id} sx={deviceCard}>
//               <Typography fontWeight="bold">{device.name}</Typography>
//               <Typography>{getDevicePower(device)} W</Typography>
//               <Chip
//                 label={isDeviceOn(device.status) ? "ON" : "OFF"}
//                 color={isDeviceOn(device.status) ? "success" : "error"}
//                 size="small"
//                 sx={{ mt: 1 }}
//               />
//               <Button
//                 variant="contained"
//                 size="small"
//                 sx={{ mt: 2 }}
//                 onClick={() => toggleDevice(device.id)}
//               >
//                 Toggle
//               </Button>
//             </Box>
//           ))}
//         </Box>
//       </Paper>

//     </Box>
//   );
// }

// export default AdminDashboard;

// /////////////////////////////////////////////////////////
// // STYLES
// /////////////////////////////////////////////////////////

// const mainContainer = {
//   // ✅ REMOVED: ml: "230px"  → was causing orange space
//   // ✅ REMOVED: display:"flex" + Sidebar → was duplicating sidebar
//   flexGrow: 1,
//   p: 3,                      // ✅ padding inside content only
//   background: "#f3f4f6",
//   minHeight: "100vh"
// };

// const headerStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   mb: 3
// };

// const alertStyle = {
//   background: "#ef4444",
//   color: "white",
//   padding: "12px",
//   borderRadius: "8px",
//   mb: 2,
//   fontWeight: "bold"
// };

// const paperStyle = {
//   mt: 3,
//   p: 3,
//   borderRadius: "16px"
// };

// const deviceGrid = {
//   display: "grid",
//   gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
//   gap: "20px",
//   mt: 2
// };

// const deviceCard = {
//   background: "#fff",
//   padding: "15px",
//   borderRadius: "12px",
//   boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
//   textAlign: "center"
// };

// const notificationPanel = {
//   position: "absolute",
//   top: "40px",
//   right: 0,
//   width: "260px",
//   background: "#fff",
//   borderRadius: "10px",
//   boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
//   padding: "10px",
//   zIndex: 100
// };

// const notificationItem = {
//   borderBottom: "1px solid #eee",
//   padding: "8px 0"
// };
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
  Chip
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

import DashboardCards from "../components/DashboardCards";
import PowerChart from "../components/PowerChart";
import ChartPanel from "../components/ChartPanel";
import { getDevices, toggleDevice as toggleDeviceApi } from "../services/api";

import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

function AdminDashboard() {

  // 🔥 DARK MODE STATE
  const [darkMode, setDarkMode] = useState(true);

  const [devices, setDevices] = useState([]);
  const [load, setLoad] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const overloadRef = useRef(false);

  const loadDevices = async () => {
    try {
      const res = await getDevices();
      setDevices(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log("Error loading devices:", err);
      setDevices([]);
    }
  };

  const isDeviceOn = (status) => {
    return status === true || status === "ON" || status === "on" || status === 1;
  };

  const getDevicePower = (d) => {
    return Number(d.powerRating || d.power || d.watts || 0);
  };

  const calculateLoadFromDevices = useCallback((deviceList) => {
    return deviceList.reduce((sum, d) => {
      return sum + (isDeviceOn(d.status) ? getDevicePower(d) : 0);
    }, 0);
  }, []);

  const toggleDevice = async (id) => {
    try {
      await toggleDeviceApi(id);
      await loadDevices();
    } catch (err) {
      console.log("Error toggling device:", err);
    }
  };

  useEffect(() => {
    loadDevices();
  }, []);

  useEffect(() => {
    const calculatedLoad = calculateLoadFromDevices(devices);
    setLoad(calculatedLoad);
  }, [devices, calculateLoadFromDevices]);

  useEffect(() => {
    const wsUrl = (process.env.REACT_APP_API_URL || "http://localhost:8080")
      .replace("http://", "https://");

    const socket = new SockJS(wsUrl + "/power-monitor");

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,

      onConnect: () => {
        client.subscribe("/topic/power", (message) => {
          const data = JSON.parse(message.body);
          const totalLoad = Number(data.totalLoad || 0);
          setLoad(totalLoad);

          const time = new Date().toLocaleTimeString();

          if (totalLoad > 3000 && !overloadRef.current) {
            overloadRef.current = true;
            setNotifications((prev) => [
              { message: "⚠ Power overload detected!", time },
              ...prev
            ]);
          }

          if (totalLoad <= 3000) {
            overloadRef.current = false;
          }
        });
      }
    });

    client.activate();
    return () => client.deactivate();
  }, []);

  return (
    <Box sx={darkMode ? darkStyles.mainContainer : lightStyles.mainContainer}>

      {/* HEADER */}
      <Box sx={headerStyle}>
        <Typography variant="h4" fontWeight="bold">
          ⚡ Admin Power Dashboard
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

          {/* 🔥 TOGGLE BUTTON */}
          <Button
            variant="outlined"
            size="small"
            sx={{ color: darkMode ? "white" : "black", borderColor: darkMode ? "white" : "black" }}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </Button>

          <Box sx={{ position: "relative" }}>
            <IconButton
              sx={{ color: darkMode ? "white" : "black" }}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <NotificationsIcon />
            </IconButton>

            {showNotifications && (
              <Box sx={notificationPanel}>
                <Typography variant="subtitle1">Notifications</Typography>

                {notifications.length === 0 ? (
                  <Typography>No alerts</Typography>
                ) : (
                  notifications.map((n, i) => (
                    <Box key={i} sx={notificationItem}>
                      {n.message}
                      <br />
                      <small>{n.time}</small>
                    </Box>
                  ))
                )}
              </Box>
            )}
          </Box>

        </Box>
      </Box>

      {/* ALERT */}
      {load > 3000 && (
        <Box sx={alertStyle}>⚠ Power overload detected!</Box>
      )}

      {/* CARDS */}
      <DashboardCards
        devices={devices?.length || 0}
        activeDevices={
          devices?.filter((d) => isDeviceOn(d.status)).length || 0
        }
        load={load}
        status={load > 3000 ? "OVERLOAD" : "NORMAL"}
      />

      {/* LIVE CHART */}
      <Box sx={{ mt: 2 }}>
        <Box sx={chartBox}>
          <Typography sx={{ mb: 1 }}>
            Live Power Load
          </Typography>
          <PowerChart load={load} />
        </Box>
      </Box>

      {/* PIE CHART */}
      <Paper sx={paperStyle}>
        <Typography variant="h6">📊 Device Distribution</Typography>
        <Box sx={{ width: "400px", margin: "auto" }}>
          <ChartPanel devices={devices} />
        </Box>
      </Paper>

      {/* DEVICES */}
      <Paper sx={paperStyle}>
        <Typography variant="h6">🔌 Devices</Typography>

        <Box sx={deviceGrid}>
          {devices.map((device) => (
            <Box key={device.id} sx={deviceCard}>
              <Typography fontWeight="bold">{device.name}</Typography>
              <Typography>{getDevicePower(device)} W</Typography>

              <Chip
                label={isDeviceOn(device.status) ? "ON" : "OFF"}
                color={isDeviceOn(device.status) ? "success" : "error"}
                size="small"
                sx={{ mt: 1 }}
              />

              <Button
                variant="contained"
                size="small"
                sx={{ mt: 2 }}
                onClick={() => toggleDevice(device.id)}
              >
                Toggle
              </Button>
            </Box>
          ))}
        </Box>
      </Paper>

    </Box>
  );
}

export default AdminDashboard;

/////////////////////////////////////////////////////////
// 🌗 DARK & LIGHT STYLES
/////////////////////////////////////////////////////////

const darkStyles = {
  mainContainer: {
    flexGrow: 1,
    p: 3,
    background: "linear-gradient(135deg, #020617, #0f172a)",
    minHeight: "100vh",
    color: "white"
  }
};

const lightStyles = {
  mainContainer: {
    flexGrow: 1,
    p: 3,
    background: "#f3f4f6",
    minHeight: "100vh",
    color: "black"
  }
};

/////////////////////////////////////////////////////////
// OTHER STYLES (SAME)
/////////////////////////////////////////////////////////

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: 3,
  padding: "12px 16px",
  borderRadius: "12px",
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(10px)"
};

const alertStyle = {
  background: "linear-gradient(90deg, #ef4444, #dc2626)",
  padding: "12px",
  borderRadius: "10px",
  textAlign: "center",
  fontWeight: "bold"
};

const paperStyle = {
  mt: 3,
  p: 3,
  borderRadius: "16px",
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(10px)",
  color: "white"
};

const chartBox = {
  background: "rgba(255,255,255,0.05)",
  padding: "20px",
  borderRadius: "16px",
  height: "300px"
};

const deviceGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
  mt: 2
};

const deviceCard = {
  background: "rgba(255,255,255,0.05)",
  padding: "15px",
  borderRadius: "12px",
  textAlign: "center"
};

const notificationPanel = {
  position: "absolute",
  top: "45px",
  right: 0,
  width: "260px",
  background: "#0f172a",
  borderRadius: "12px",
  padding: "12px"
};

const notificationItem = {
  borderBottom: "1px solid rgba(255,255,255,0.1)",
  padding: "8px 0"
};