import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { Box, Typography } from "@mui/material";

ChartJS.register(ArcElement, Tooltip, Legend);

function ChartPanel({ devices = [], darkMode }) {

  const isDeviceOn = (status) => {
    return (
      status === true ||
      status === "ON" ||
      status === "on" ||
      status === 1
    );
  };

  const labels = [];
  const values = [];

  devices.forEach((d) => {
    if (isDeviceOn(d.status)) {
      const name = d.name || `Device ${d.id}`;
      const power = d.powerRating ?? d.power ?? d.watts ?? 0;

      labels.push(name);
      values.push(Number(power));
    }
  });

  const hasData =
    values.length > 0 && values.some((v) => v > 0);

  // ✅ EMPTY STATE
  if (!hasData) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography
          sx={{ color: darkMode ? "gray" : "#6b7280" }}
        >
          No active device power data available
        </Typography>
      </Box>
    );
  }

  // 🎨 IMPROVED COLORS
  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "#22c55e", // green
          "#3b82f6", // blue
          "#f59e0b", // orange
          "#ef4444", // red
          "#8b5cf6", // purple
          "#14b8a6", // teal
          "#e11d48", // pink
          "#6366f1", // indigo
        ],
        borderWidth: 2,
        borderColor: darkMode ? "#020617" : "#ffffff", // 🔥 fix
        hoverOffset: 10
      },
    ],
  };

  // ✅ DARK / LIGHT MODE TEXT
  const textColor = darkMode ? "white" : "#111827";

  // 🔥 FIXED OPTIONS
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: textColor, // ✅ FIX
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.label}: ${context.raw} W`;
          },
        },
      },
    },
  };

  return (
    <Box sx={{ height: 320 }}>
      <Pie data={data} options={options} />
    </Box>
  );
}

export default ChartPanel;