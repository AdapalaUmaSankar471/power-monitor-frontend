import React, { useEffect, useState, useRef, useCallback } from "react";
import { Box, Typography, Paper, Chip } from "@mui/material";

import DashboardCards from "../components/DashboardCards";
import PowerChart from "../components/PowerChart";
import ChartPanel from "../components/ChartPanel";
import { getDevices } from "../services/api";

import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

function ViewerDashboard() {
  const [devices, setDevices] = useState([]);
  const [load, setLoad] = useState(0);

  const overloadRef = useRef(false);

  // ============================
  // Load Devices
  // ============================
  const loadDevices = async () => {
    try {
      const res = await getDevices();
      setDevices(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log("Error loading devices:", err);
      setDevices([]);
    }
  };

  // ============================
  // Helpers
  // ============================
  const isDeviceOn = (status) =>
    status === true || status === "ON" || status === "on" || status === 1;

  const getDevicePower = (d) =>
    Number(d.powerRating || d.power || d.watts || 0);

  const calculateLoadFromDevices = useCallback((deviceList) => {
    return deviceList.reduce((sum, d) => {
      return sum + (isDeviceOn(d.status) ? getDevicePower(d) : 0);
    }, 0);
  }, []);

  // ============================
  // Initial Load
  // ============================
  useEffect(() => {
    loadDevices();
  }, []);

  // ============================
  // Load Calculation
  // ============================
  useEffect(() => {
    const calculatedLoad = calculateLoadFromDevices(devices);
    setLoad(calculatedLoad);
  }, [devices, calculateLoadFromDevices]);

  // ============================
  // WebSocket
  // ============================
  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/power-monitor");

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,

      onConnect: () => {
        client.subscribe("/topic/power", (message) => {
          const data = JSON.parse(message.body);
          const totalLoad = Number(data.totalLoad || 0);
          setLoad(totalLoad);

          if (totalLoad > 3000) {
            overloadRef.current = true;
          } else {
            overloadRef.current = false;
          }
        });
      },
    });

    client.activate();
    return () => client.deactivate();
  }, []);

  return (
    <Box sx={mainContainer}>

      {/* ===== HEADER ===== */}
      <Box sx={headerStyle}>
        <Typography variant="h4" fontWeight="bold">
          ⚡ Smart Power Monitoring
        </Typography>
        <Chip
          label="👁 Viewer Mode — Read Only"
          sx={{ background: "#3b82f6", color: "white", fontWeight: "bold" }}
        />
      </Box>

      {/* ===== OVERLOAD ALERT ===== */}
      {load > 3000 && (
        <Box sx={alertStyle}>
          ⚠ Power Overload Detected! Current Load: {load} W
        </Box>
      )}

      {/* ===== STATUS CARDS ===== */}
      <DashboardCards
        devices={devices.length}
        activeDevices={devices.filter((d) => isDeviceOn(d.status)).length}
        load={load}
        status={load > 3000 ? "OVERLOAD" : "NORMAL"}
      />

      {/* ===== POWER USAGE CHART ===== */}
      <Paper sx={paperStyle}>
        <Typography variant="h6" mb={1}>📈 Power Usage</Typography>
        <PowerChart load={load} />
      </Paper>

      {/* ===== PIE CHART ===== */}
      <Paper sx={paperStyle}>
        <Typography variant="h6" mb={1}>🥧 Device Power Distribution</Typography>
        <Box sx={{ width: "400px", margin: "auto" }}>
          <ChartPanel devices={devices} />
        </Box>
      </Paper>

      {/* ===== DEVICE LIST (READ ONLY) ===== */}
      <Paper sx={paperStyle}>
        <Typography variant="h6" mb={2}>📋 Devices (View Only)</Typography>

        <Box sx={deviceGrid}>
          {devices.map((device) => (
            <Box key={device.id} sx={deviceCard}>

              {/* Device Name */}
              <Typography fontWeight="bold" fontSize="16px">
                {device.name}
              </Typography>

              {/* Power Rating */}
              <Typography color="gray" fontSize="14px" mt={0.5}>
                {getDevicePower(device)} W
              </Typography>

              {/* ON/OFF Status — NO Toggle Button */}
              <Chip
                label={isDeviceOn(device.status) ? "🟢 ON" : "🔴 OFF"}
                color={isDeviceOn(device.status) ? "success" : "error"}
                size="small"
                sx={{ mt: 1 }}
              />

              {/* ✅ NO Toggle Button for Viewer */}

            </Box>
          ))}
        </Box>

        {devices.length === 0 && (
          <Typography color="gray" textAlign="center" mt={2}>
            No devices found.
          </Typography>
        )}
      </Paper>

    </Box>
  );
}

export default ViewerDashboard;

/////////////////////////////////////////////////////////
// STYLES
/////////////////////////////////////////////////////////

const mainContainer = {
  flexGrow: 1,
  p: 3,
  background: "#f3f4f6",
  minHeight: "100vh"
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: 3
};

const alertStyle = {
  background: "#ef4444",
  color: "white",
  padding: "12px",
  borderRadius: "8px",
  mb: 2,
  fontWeight: "bold",
  textAlign: "center"
};

const paperStyle = {
  mt: 3,
  p: 3,
  borderRadius: "16px"
};

const deviceGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px",
  mt: 2
};

const deviceCard = {
  background: "#fff",
  padding: "15px",
  borderRadius: "12px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  textAlign: "center"
};