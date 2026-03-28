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

function ChartPanel({ devices = [] }) {

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

  // ✅ EMPTY STATE (DARK)
  if (!hasData) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography sx={{ color: "gray" }}>
          No active device power data available
        </Typography>
      </Box>
    );
  }

  // 🎨 MODERN COLORS
  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "#22c55e",
          "#3b82f6",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
          "#14b8a6",
          "#e11d48",
          "#6366f1",
        ],
        borderWidth: 2,
        borderColor: "#020617", // 🔥 clean separation
        hoverOffset: 10 // 🔥 hover animation
      },
    ],
  };

  // 🔥 DARK + PREMIUM OPTIONS
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "white", // 🔥 dark mode text
          padding: 15
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