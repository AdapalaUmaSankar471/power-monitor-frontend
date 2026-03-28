import React, { useEffect, useState } from "react";
import {
  Box, Typography, Paper, Button, TextField,
  Switch, Chip, LinearProgress, Dialog,
  DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import { getDevices, toggleDevice, addDevice, updateDeviceBudget } from "../services/api";

function Devices() {
  const [devices, setDevices] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openBudget, setOpenBudget] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [budget, setBudget] = useState("");
  const [newDevice, setNewDevice] = useState({ name: "", power: "" });

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    const res = await getDevices();
    setDevices(res.data);
  };

  const handleToggle = async (id) => {
    await toggleDevice(id);
    loadDevices();
  };

  const handleAddDevice = async () => {
    await addDevice({ name: newDevice.name, power: parseInt(newDevice.power), status: false });
    setOpenAdd(false);
    setNewDevice({ name: "", power: "" });
    loadDevices();
  };

  const handleBudgetSave = async () => {
    await updateDeviceBudget(selectedDevice.id, parseFloat(budget));
    setOpenBudget(false);
    setBudget("");
    loadDevices();
  };

  const openBudgetDialog = (device) => {
    setSelectedDevice(device);
    setBudget(device.monthlyBudget || "");
    setOpenBudget(true);
  };

  const getAlertColor = (percent) => {
    if (percent >= 100) return "error";
    if (percent >= 75) return "warning";
    return "success";
  };

  const getProgressColor = (percent) => {
    if (percent >= 100) return "#dc2626";
    if (percent >= 75) return "#f59e0b";
    return "#16a34a";
  };

  return (
    <Box sx={main}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">🖥️ Devices</Typography>
        <Button variant="contained" onClick={() => setOpenAdd(true)}>+ Add Device</Button>
      </Box>

      <Box sx={grid}>
        {devices.map((device) => {
          const percent = device.budgetUsedPercent || 0;
          const actual = device.actualConsumption || 0;

          return (
            <Paper key={device.id} sx={card}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography fontWeight="bold" fontSize="16px">{device.name}</Typography>
                <Chip
                  label={device.status ? "ON" : "OFF"}
                  color={device.status ? "success" : "error"}
                  size="small"
                />
              </Box>

              <Typography color="text.secondary" fontSize="14px" mt={0.5}>
                ⚡ {device.power} W
              </Typography>

              {/* Budget Progress */}
              {device.monthlyBudget > 0 && (
                <Box mt={1.5}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography fontSize="12px" color="text.secondary">
                      Budget Used: {Math.round(percent)}%
                    </Typography>
                    <Typography fontSize="12px" color="text.secondary">
                      {actual.toFixed(1)} / {device.monthlyBudget} Wh
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(percent, 100)}
                    sx={{
                      mt: 0.5,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "#e5e7eb",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: getProgressColor(percent),
                      },
                    }}
                  />
                  {percent >= 100 && (
                    <Typography fontSize="12px" color="error" mt={0.5} fontWeight="bold">
                      ⚠️ Budget Exceeded!
                    </Typography>
                  )}
                  {percent >= 75 && percent < 100 && (
                    <Typography fontSize="12px" color="warning.main" mt={0.5} fontWeight="bold">
                      ⚠ 75% Budget Used — Warning!
                    </Typography>
                  )}
                </Box>
              )}

              <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                <Button
                  variant="contained"
                  size="small"
                  color={device.status ? "error" : "success"}
                  onClick={() => handleToggle(device.id)}
                  sx={{ flex: 1 }}
                >
                  {device.status ? "Turn OFF" : "Turn ON"}
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => openBudgetDialog(device)}
                  sx={{ flex: 1 }}
                >
                  Set Budget
                </Button>
              </Box>
            </Paper>
          );
        })}
      </Box>

      {/* Add Device Dialog */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <DialogTitle>Add New Device</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Device Name"
            value={newDevice.name}
            onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
          />
          <TextField
            label="Power Rating (W)"
            type="number"
            value={newDevice.power}
            onChange={(e) => setNewDevice({ ...newDevice, power: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddDevice}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Budget Dialog */}
      <Dialog open={openBudget} onClose={() => setOpenBudget(false)}>
        <DialogTitle>Set Monthly Budget — {selectedDevice?.name}</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <TextField
            label="Monthly Budget (Wh)"
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            fullWidth
            helperText="Example: Fan=500Wh, AC=3000Wh, Fridge=2000Wh"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBudget(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleBudgetSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

const main = { flexGrow: 1, p: 3, background: "#f3f4f6", minHeight: "100vh" };

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "20px",
  mt: 2,
};

const card = {
  p: 3,
  borderRadius: "16px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
  transition: "0.3s",
  "&:hover": { transform: "translateY(-4px)" },
};

export default Devices;