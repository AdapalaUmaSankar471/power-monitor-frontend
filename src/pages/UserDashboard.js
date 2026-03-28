import React, { useEffect, useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { getPowerUsage, getDevices } from "../services/api";
import PowerChart from "../components/PowerChart";
import ChartPanel from "../components/ChartPanel";

function UserDashboard() {
  const [usageData, setUsageData] = useState([]);
  const [devices, setDevices] = useState([]);

  // 🔄 Fetch live data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const usageRes = await getPowerUsage();
      const deviceRes = await getDevices();

      setUsageData(usageRes.data || []);
      setDevices(deviceRes.data || []);
    } catch (err) {
      console.log("Error loading user dashboard:", err);
    }
  };
  

  return (
    <Box sx={container}>

      <Typography variant="h4" fontWeight="bold" mb={2}>
        ⚡ User Dashboard
      </Typography>

      {/* 📊 POWER USAGE CHART */}
      <Paper sx={card}>
        <Typography variant="h6">Power Usage</Typography>
        <PowerChart data={usageData} />
      </Paper>

      {/* 🍩 DEVICE DISTRIBUTION */}
      <Paper sx={card}>
        <Typography variant="h6">Device Distribution</Typography>
        <Box sx={{ width: "400px", margin: "auto" }}>
          <ChartPanel devices={devices} />
        </Box>
      </Paper>

    </Box>
  );
}


export default UserDashboard;

// STYLES
const container = {
  p: 3,
  background: "#f3f4f6",
  minHeight: "100vh"
};

const card = {
  mt: 3,
  p: 3,
  borderRadius: "16px"
};

return <h1>USER DASHBOARD WORKING ✅</h1>;