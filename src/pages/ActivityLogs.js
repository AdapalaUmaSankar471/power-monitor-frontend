import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import { getSystemLogs } from "../services/api";
import { saveAs } from "file-saver";

function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all"); // all, today, last7

  // ============================
  // Load logs from API
  // ============================
  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const res = await getSystemLogs();
      const sorted = res.data.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      setLogs(sorted);
      setFilteredLogs(sorted);
    } catch (err) {
      console.error("Error loading logs:", err);
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // Apply Filters
  // ============================
  useEffect(() => {
    let filtered = [...logs];

    // Search by message
    if (search.trim() !== "") {
      filtered = filtered.filter((log) =>
        log.message.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Date filter
    const now = new Date();
    if (dateFilter === "today") {
      filtered = filtered.filter(
        (log) =>
          new Date(log.timestamp).toDateString() === now.toDateString()
      );
    } else if (dateFilter === "last7") {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      filtered = filtered.filter(
        (log) => new Date(log.timestamp) >= weekAgo
      );
    }

    setFilteredLogs(filtered);
  }, [search, dateFilter, logs]);

  // ============================
  // Download CSV
  // ============================
  const downloadCSV = () => {
    const headers = ["ID", "Timestamp", "Message"];
    const rows = filteredLogs.map((log) => [
      log.id,
      new Date(log.timestamp).toLocaleString(),
      log.message,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "activity_logs.csv");
  };

  // ============================
  // Render
  // ============================
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />

      <Box sx={main}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          📜 Activity Logs
        </Typography>

        {/* FILTERS + SEARCH + EXPORT */}
        <Box sx={filterBar}>
          <TextField
            select
            label="Date Filter"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            size="small"
            sx={{ mr: 2, minWidth: 140 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="last7">Last 7 days</MenuItem>
          </TextField>

          <TextField
            label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ mr: 2 }}
          />

          <Button variant="contained" color="primary" onClick={downloadCSV}>
            Download CSV
          </Button>
        </Box>

        {/* LOG TIMELINE */}
        <Paper sx={paper}>
          {loading ? (
            <Typography>Loading logs...</Typography>
          ) : filteredLogs.length === 0 ? (
            <Typography>No activity found</Typography>
          ) : (
            filteredLogs.map((log, i) => {
              const isOn = log.message.includes("ON");
              return (
                <Box key={i} sx={timelineItem}>
                  <Box sx={timelineLine} />
                  <Box
                    sx={{
                      ...dot,
                      background: isOn ? "#22c55e" : "#ef4444",
                    }}
                  />
                  <Box sx={content}>
                    <Typography fontWeight="bold">{log.message}</Typography>

                    <Chip
                      label={isOn ? "ON" : "OFF"}
                      size="small"
                      sx={{
                        mt: 1,
                        background: isOn ? "#dcfce7" : "#fee2e2",
                        color: isOn ? "#166534" : "#991b1b",
                      }}
                    />

                    <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              );
            })
          )}
        </Paper>
      </Box>
    </Box>
  );
}

export default ActivityLogs;

/////////////////////////////////////////////////////////
// STYLES
/////////////////////////////////////////////////////////
const main = {
  flexGrow: 1,
  p: 3,
  background: "#f3f4f6",
  minHeight: "100vh",
};

const paper = {
  mt: 3,
  p: 3,
  borderRadius: "16px",
};

const filterBar = {
  display: "flex",
  alignItems: "center",
  mb: 2,
};

const timelineItem = {
  display: "flex",
  position: "relative",
  marginBottom: "25px",
  paddingLeft: "40px",
};

const timelineLine = {
  position: "absolute",
  left: "18px",
  top: 0,
  bottom: 0,
  width: "2px",
  background: "#ddd",
};

const dot = {
  position: "absolute",
  left: "10px",
  top: "5px",
  width: "16px",
  height: "16px",
  borderRadius: "50%",
};

const content = {
  background: "#fff",
  padding: "12px 16px",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  width: "100%",
};