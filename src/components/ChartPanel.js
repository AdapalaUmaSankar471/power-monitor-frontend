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
  // ============================
  // Normalize Device Status
  // ============================
  const isDeviceOn = (status) => {
    return (
      status === true ||
      status === "ON" ||
      status === "on" ||
      status === 1
    );
  };

  // ============================
  // Extract Labels & Values
  // ============================
  const labels = [];
  const values = [];

  devices.forEach((d) => {
    if (isDeviceOn(d.status)) {
      const name = d.name || `Device ${d.id}`;

      const power =
        d.powerRating ??
        d.power ??
        d.watts ??
        0;

      labels.push(name);
      values.push(Number(power));
    }
  });

  const hasData =
    values.length > 0 && values.some((v) => v > 0);

  // ============================
  // Empty State
  // ============================
  if (!hasData) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography color="text.secondary">
          No active device power data available
        </Typography>
      </Box>
    );
  }

  // ============================
  // Chart Data
  // ============================
  const data = {
    labels,
    datasets: [
      {
        label: "Device Power Usage (W)",
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
        borderWidth: 1,
      },
    ],
  };

  // ============================
  // Chart Options (Improved UI)
  // ============================
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return `${context.label}: ${value} W`;
          },
        },
      },
    },
  };

  // ============================
  // Render
  // ============================
  return (
    <Box sx={{ height: 300 }}>
      <Pie data={data} options={options} />
    </Box>
  );
}

export default ChartPanel;