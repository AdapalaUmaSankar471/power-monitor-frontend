import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  Chip,
  IconButton,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";

import Sidebar from "../components/Sidebar";

import {
  getDevices,
  toggleDevice,
  addDevice,
  deleteDevice,
} from "../services/api";

function Devices() {
  const [devices, setDevices] = useState([]);
  const [newDevice, setNewDevice] = useState({
    name: "",
    power: "",
  });

  // ============================
  // LOAD DEVICES
  // ============================
  const loadDevices = async () => {
    try {
      const res = await getDevices();
      setDevices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadDevices();
  }, []);

  // ============================
  // ADD DEVICE
  // ============================
  const handleAdd = async () => {
    if (!newDevice.name || !newDevice.power) return;

    await addDevice({
      ...newDevice,
      status: false,
    });

    setNewDevice({ name: "", power: "" });
    loadDevices();
  };

  // ============================
  // DELETE DEVICE
  // ============================
  const handleDelete = async (id) => {
    await deleteDevice(id);
    loadDevices();
  };

  // ============================
  // TOGGLE DEVICE
  // ============================
  const handleToggle = async (id) => {
    await toggleDevice(id);
    loadDevices();
  };

  // ============================
  // UI
  // ============================
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />

      <Box sx={mainContainer}>
        <Typography variant="h4" fontWeight="bold">
          ⚡ Devices
        </Typography>

        {/* ADD DEVICE */}
        <Paper sx={paperStyle}>
          <Typography variant="h6">Add Device</Typography>

          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Device Name"
                fullWidth
                value={newDevice.name}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, name: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Power (W)"
                type="number"
                fullWidth
                value={newDevice.power}
                onChange={(e) =>
                  setNewDevice({
                    ...newDevice,
                    power: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                fullWidth
                sx={{ height: "100%" }}
                onClick={handleAdd}
              >
                Add Device
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* DEVICE LIST */}
        <Paper sx={paperStyle}>
          <Typography variant="h6">All Devices</Typography>

          {devices.length === 0 ? (
            <Typography>No devices found</Typography>
          ) : (
            <Box sx={deviceGrid}>
              {devices.map((d) => (
                <Box key={d.id} sx={deviceCard}>
                  <Typography fontWeight="bold">
                    {d.name}
                  </Typography>

                  <Typography>{d.powerRating} W</Typography>

                  <Chip
                    label={d.status ? "ON" : "OFF"}
                    color={d.status ? "success" : "error"}
                    size="small"
                    sx={{ mt: 1 }}
                  />

                  <Box sx={actionButtons}>
                    <IconButton
                      color={d.status ? "error" : "success"}
                      onClick={() => handleToggle(d.id)}
                    >
                      <PowerSettingsNewIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => handleDelete(d.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}

export default Devices;

/////////////////////////////////////////////////////////
// STYLES (FIXED NO SIDEBAR GAP)
/////////////////////////////////////////////////////////

const mainContainer = {
  flexGrow: 1,
  p: 3,
  background: "#f3f4f6",
  minHeight: "100vh",
};

const paperStyle = {
  mt: 3,
  p: 3,
  borderRadius: "16px",
};

const deviceGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
  mt: 2,
};

const deviceCard = {
  background: "#fff",
  padding: "15px",
  borderRadius: "14px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  textAlign: "center",
  transition: "0.3s",
  "&:hover": {
    transform: "translateY(-5px)",
  },
};

const actionButtons = {
  display: "flex",
  justifyContent: "center",
  gap: "10px",
  mt: 1,
};