import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  MenuItem,
  Select,
  CircularProgress,
} from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import API from "../services/api";

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  // ============================
  // FETCH REAL DATA
  // ============================
  useEffect(() => {
    API.get("/reports/daily")
      .then((res) => {
        console.log("REPORT DATA:", res.data);
        setReports(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load reports");
        setLoading(false);
      });
  }, []);

  // ============================
  // FILTER LOGS
  // ============================
  const filteredReports = reports.filter((r) => {
    if (filter === "all") return true;
    const logTime = new Date(r.timestamp);
    const now = new Date();
    if (filter === "today") {
      return logTime.toDateString() === now.toDateString();
    }
    if (filter === "week") {
      const diff = (now - logTime) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    }
    return true;
  });

  // ============================
  // CALCULATIONS
  // ============================
  const totalLoad = filteredReports.reduce(
    (sum, r) => sum + Number(r.totalLoad || 0), 0
  );
  const avgLoad = filteredReports.length
    ? totalLoad / filteredReports.length
    : 0;
  const peakLoad = filteredReports.length
    ? Math.max(...filteredReports.map((r) => Number(r.totalLoad || 0)))
    : 0;

  // ============================
  // FORMAT TIME
  // ============================
  const formatTime = (t) => {
    if (!t) return "N/A";
    try {
      return new Date(t).toLocaleString();
    } catch {
      return t;
    }
  };

  // ============================
  // ✅ PDF DOWNLOAD
  // ============================
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("⚡ Energy Report", 14, 20);

    doc.setFontSize(12);
    doc.text(`Filter: ${filter === "today" ? "Today" : filter === "week" ? "Last 7 Days" : "All Time"}`, 14, 32);
    doc.text(`Total Load: ${totalLoad.toFixed(2)} W`, 14, 40);
    doc.text(`Average Load: ${avgLoad.toFixed(2)} W`, 14, 48);
    doc.text(`Peak Load: ${peakLoad} W`, 14, 56);

    autoTable(doc, {
      startY: 65,
      head: [["#", "Time", "Total Load (W)", "Status"]],
      body: filteredReports.map((r, i) => [
        i + 1,
        formatTime(r.timestamp),
        `${r.totalLoad} W`,
        r.totalLoad > 3000 ? "⚠ OVERLOAD" : "✅ NORMAL",
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [17, 24, 39] },
    });

    doc.save("energy-report.pdf");
  };

  // ============================
  // ✅ CSV DOWNLOAD
  // ============================
  const downloadCSV = () => {
    const headers = ["#", "Time", "Total Load (W)", "Status"];
    const rows = filteredReports.map((r, i) => [
      i + 1,
      formatTime(r.timestamp),
      r.totalLoad,
      r.totalLoad > 3000 ? "OVERLOAD" : "NORMAL",
    ]);

    const csvContent =
      [headers, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "energy-report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ============================
  // UI
  // ============================
  return (
    <Box sx={mainContainer}>

      {/* HEADER */}
      <Typography variant="h4" fontWeight="bold" mb={2}>
        📊 Energy Reports
      </Typography>

      {/* FILTER */}
      <Select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        size="small"
        sx={{ mb: 2 }}
      >
        <MenuItem value="all">All Time</MenuItem>
        <MenuItem value="today">Today</MenuItem>
        <MenuItem value="week">Last 7 Days</MenuItem>
      </Select>

      {/* SUMMARY CARDS */}
      <Box sx={cardGrid}>
        <SummaryCard title="Total Records" value={filteredReports.length} />
        <SummaryCard title="Total Load" value={`${totalLoad.toFixed(2)} W`} />
        <SummaryCard title="Average Load" value={`${avgLoad.toFixed(2)} W`} />
        <SummaryCard title="Peak Load" value={`${peakLoad} W`} />
      </Box>

      {/* TABLE */}
      <Paper sx={paperStyle}>
        <Typography variant="h6" mb={2}>
          📋 Report Table
        </Typography>

        {/* LOADING */}
        {loading && (
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {/* ERROR */}
        {error && (
          <Typography color="error">{error}</Typography>
        )}

        {/* DATA TABLE */}
        {!loading && !error && (
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
                {filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map((r, i) => (
                    <TableRow
                      key={r.id || i}
                      sx={{
                        background:
                          r.totalLoad > 3000 ? "#fee2e2" : "white",
                        "&:hover": { background: "#f1f5f9" },
                      }}
                    >
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{formatTime(r.timestamp)}</TableCell>
                      <TableCell>{r.totalLoad} W</TableCell>
                      <TableCell>
                        {r.totalLoad > 3000 ? (
                          <span style={{ color: "#dc2626", fontWeight: "bold" }}>
                            ⚠ OVERLOAD
                          </span>
                        ) : (
                          <span style={{ color: "#16a34a", fontWeight: "bold" }}>
                            ✅ NORMAL
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* OVERLOAD ALERTS */}
      <Paper sx={paperStyle}>
        <Typography variant="h6" mb={1}>
          🚨 Overload Alerts
        </Typography>
        {filteredReports.filter((r) => r.totalLoad > 3000).length === 0 ? (
          <Typography color="green">✅ No overload alerts</Typography>
        ) : (
          filteredReports
            .filter((r) => r.totalLoad > 3000)
            .map((r, i) => (
              <Box key={i} sx={alertStyle}>
                ⚠ Overload at {formatTime(r.timestamp)} — {r.totalLoad} W
              </Box>
            ))
        )}
      </Paper>

      {/* ✅ DOWNLOAD BUTTONS */}
      <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          color="error"
          onClick={downloadPDF}
          sx={{ borderRadius: "8px" }}
        >
          📄 Download PDF
        </Button>

        <Button
          variant="contained"
          color="success"
          onClick={downloadCSV}
          sx={{ borderRadius: "8px" }}
        >
          📊 Download CSV / Excel
        </Button>
      </Box>

    </Box>
  );
}

// ============================
// SUMMARY CARD COMPONENT
// ============================
function SummaryCard({ title, value }) {
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: "12px",
        textAlign: "center",
        boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
        transition: "0.3s",
        "&:hover": { transform: "translateY(-4px)" },
      }}
    >
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h6" fontWeight="bold">
        {value}
      </Typography>
    </Paper>
  );
}

// ============================
// STYLES
// ============================
const mainContainer = {
  flexGrow: 1,
  p: 3,
  background: "#f3f4f6",
  minHeight: "100vh",
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px",
  mt: 2,
  mb: 1,
};

const paperStyle = {
  mt: 3,
  p: 3,
  borderRadius: "16px",
};

const alertStyle = {
  background: "#fee2e2",
  padding: "10px",
  borderRadius: "8px",
  marginTop: "5px",
  color: "#991b1b",
  fontWeight: "500",
};

export default Reports;