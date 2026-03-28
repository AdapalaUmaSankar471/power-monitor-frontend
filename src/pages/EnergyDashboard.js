import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  Box, Typography, Paper, MenuItem, Select,
  Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, LinearProgress,
} from "@mui/material";

import PowerChart from "../components/PowerChart";
import { getPowerLogs, getDevices, getBudgetStatus } from "../services/api";

function EnergyReports() {
  const [logs, setLogs] = useState([]);
  const [devices, setDevices] = useState([]);
  const [budgetStatus, setBudgetStatus] = useState([]);
  const [filter, setFilter] = useState("today");

  useEffect(() => {
    loadLogs();
    loadDevices();
    loadBudget();
  }, []);

  const loadLogs = async () => {
    try {
      const res = await getPowerLogs();
      setLogs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadDevices = async () => {
    try {
      const res = await getDevices();
      setDevices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadBudget = async () => {
    try {
      const res = await getBudgetStatus();
      setBudgetStatus(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredLogs = logs.filter((l) => {
    const logTime = new Date(l.timestamp);
    const now = new Date();
    if (filter === "today") return logTime.toDateString() === now.toDateString();
    if (filter === "week") return (now - logTime) / (1000 * 60 * 60 * 24) <= 7;
    return true;
  });

  const totalLoad = filteredLogs.reduce((sum, l) => sum + l.totalLoad, 0);
  const avgLoad = filteredLogs.length ? totalLoad / filteredLogs.length : 0;
  const peakLoad = filteredLogs.length ? Math.max(...filteredLogs.map((l) => l.totalLoad)) : 0;
  const activeDevices = devices.filter((d) => d.status).length;

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Energy Report", 14, 20);
    doc.setFontSize(12);
    doc.text(`Filter: ${filter === "today" ? "Today" : filter === "week" ? "Last 7 Days" : "All Time"}`, 14, 32);
    doc.text(`Total Load: ${totalLoad.toFixed(2)} W`, 14, 40);
    doc.text(`Average Load: ${avgLoad.toFixed(2)} W`, 14, 48);
    doc.text(`Peak Load: ${peakLoad} W`, 14, 56);
    doc.text(`Active Devices: ${activeDevices}`, 14, 64);
    autoTable(doc, {
      startY: 75,
      head: [["#", "Time", "Total Load (W)", "Status"]],
      body: filteredLogs.map((l, i) => [
        i + 1,
        new Date(l.timestamp).toLocaleString(),
        `${l.totalLoad} W`,
        l.totalLoad > 3000 ? "OVERLOAD" : "NORMAL",
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [17, 24, 39] },
    });
    doc.save("energy-report.pdf");
  };

  const downloadCSV = () => {
    const headers = ["#", "Time", "Total Load (W)", "Status"];
    const rows = filteredLogs.map((l, i) => [
      i + 1,
      new Date(l.timestamp).toLocaleString(),
      l.totalLoad,
      l.totalLoad > 3000 ? "OVERLOAD" : "NORMAL",
    ]);
    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "energy-report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getProgressColor = (level) => {
    if (level === "EXCEEDED") return "#dc2626";
    if (level === "WARNING") return "#f59e0b";
    return "#16a34a";
  };

  return (
    <Box sx={main}>
      <Typography variant="h4" fontWeight="bold" mb={2}>📊 Energy Reports</Typography>

      <Select value={filter} onChange={(e) => setFilter(e.target.value)} sx={{ mt: 1, mb: 2 }}>
        <MenuItem value="today">Today</MenuItem>
        <MenuItem value="week">Last 7 Days</MenuItem>
        <MenuItem value="all">All Time</MenuItem>
      </Select>

      {/* SUMMARY CARDS */}
      <Box sx={cardGrid}>
        <Card title="Total Load" value={`${totalLoad.toFixed(2)} W`} />
        <Card title="Average Load" value={`${avgLoad.toFixed(2)} W`} />
        <Card title="Peak Load" value={`${peakLoad} W`} />
        <Card title="Active Devices" value={activeDevices} />
      </Box>

      {/* POWER CHART */}
      <Paper sx={paper}>
        <Typography variant="h6" mb={1}>📈 Power Usage Trend</Typography>
        <PowerChart logs={filteredLogs} />
      </Paper>

      {/* BUDGET STATUS */}
      {budgetStatus.length > 0 && (
        <Paper sx={paper}>
          <Typography variant="h6" mb={2}>💰 Monthly Budget Status</Typography>
          {budgetStatus.map((b) => (
            <Box key={b.deviceId} mb={2.5}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography fontWeight="bold">{b.deviceName}</Typography>
                <Typography fontSize="13px" fontWeight="bold" color={
                  b.alertLevel === "EXCEEDED" ? "error" :
                  b.alertLevel === "WARNING" ? "warning.main" : "success.main"
                }>
                  {b.alertLevel === "EXCEEDED" ? "⚠️ EXCEEDED" :
                   b.alertLevel === "WARNING" ? "⚠ WARNING" : "✅ NORMAL"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography fontSize="12px" color="text.secondary">
                  Used: {b.actualConsumption.toFixed(1)} Wh / {b.monthlyBudget} Wh
                </Typography>
                <Typography fontSize="12px" color="text.secondary">
                  Est. Month End: {b.estimatedMonthEnd.toFixed(1)} Wh
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min(b.budgetUsedPercent, 100)}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: "#e5e7eb",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: getProgressColor(b.alertLevel),
                  },
                }}
              />
              <Typography fontSize="11px" color="text.secondary" mt={0.3}>
                {b.budgetUsedPercent}% used
              </Typography>
            </Box>
          ))}
        </Paper>
      )}

      {/* REPORT TABLE */}
      <Paper sx={paper}>
        <Typography variant="h6" mb={2}>📋 Report Table</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ background: "#111827" }}>
                <TableCell sx={{ color: "white" }}>#</TableCell>
                <TableCell sx={{ color: "white" }}>Time</TableCell>
                <TableCell sx={{ color: "white" }}>Total Load (W)</TableCell>
                <TableCell sx={{ color: "white" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">No data found</TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((l, i) => (
                  <TableRow key={i} sx={{ background: l.totalLoad > 3000 ? "#fee2e2" : "white" }}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{new Date(l.timestamp).toLocaleString()}</TableCell>
                    <TableCell>{l.totalLoad} W</TableCell>
                    <TableCell>
                      {l.totalLoad > 3000 ? (
                        <span style={{ color: "#dc2626", fontWeight: "bold" }}>⚠ OVERLOAD</span>
                      ) : (
                        <span style={{ color: "#16a34a", fontWeight: "bold" }}>✅ NORMAL</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* OVERLOAD ALERTS */}
      <Paper sx={paper}>
        <Typography variant="h6" mb={1}>🚨 Overload Alerts</Typography>
        {filteredLogs.filter((l) => l.totalLoad > 3000).length === 0 ? (
          <Typography color="green">✅ No overload alerts</Typography>
        ) : (
          filteredLogs.filter((l) => l.totalLoad > 3000).map((l, i) => (
            <Box key={i} sx={alertStyle}>
              ⚠ Overload at {new Date(l.timestamp).toLocaleTimeString()} — {l.totalLoad} W
            </Box>
          ))
        )}
      </Paper>

      {/* DOWNLOAD BUTTONS */}
      <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
        <Button variant="contained" color="error" onClick={downloadPDF} sx={{ borderRadius: "8px" }}>
          📄 Download PDF
        </Button>
        <Button variant="contained" color="success" onClick={downloadCSV} sx={{ borderRadius: "8px" }}>
          📊 Download CSV / Excel
        </Button>
      </Box>
    </Box>
  );
}

function Card({ title, value }) {
  return (
    <Paper sx={{
      p: 2, borderRadius: "12px", textAlign: "center",
      boxShadow: "0 5px 15px rgba(0,0,0,0.08)", transition: "0.3s",
      "&:hover": { transform: "translateY(-4px)" }
    }}>
      <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
      <Typography variant="h6" fontWeight="bold">{value}</Typography>
    </Paper>
  );
}

const main = { flexGrow: 1, p: 3, background: "#f3f4f6", minHeight: "100vh" };
const cardGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: "20px", mt: 2 };
const paper = { mt: 3, p: 3, borderRadius: "16px" };
const alertStyle = { background: "#fee2e2", padding: "10px", borderRadius: "8px", marginTop: "5px", color: "#991b1b", fontWeight: "500" };

export default EnergyReports;