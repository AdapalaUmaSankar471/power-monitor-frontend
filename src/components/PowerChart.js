import React, { useEffect, useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import { Box, Typography } from "@mui/material";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

// Register ChartJS
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

function PowerChart({ load, logs = [] }) {
  const clientRef = useRef(null);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Power Load (W)",
        data: [],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  });

  // ============================
  // 1️⃣ Load History Data
  // ============================
  useEffect(() => {
    if (!logs || logs.length === 0) return;

    setChartData({
      labels: logs.map((l) =>
        new Date(l.timestamp).toLocaleTimeString()
      ),
      datasets: [
        {
          label: "Power Load (W)",
          data: logs.map((l) => Number(l.totalLoad)),
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    });
  }, [logs]);

  // ============================
  // 2️⃣ Prop-based Live Load
  // ============================
  useEffect(() => {
    if (load === undefined || load === null) return;

    const time = new Date().toLocaleTimeString();

    setChartData((prev) => ({
      labels: [...prev.labels, time].slice(-10),
      datasets: [
        {
          ...prev.datasets[0],
          data: [...prev.datasets[0].data, Number(load)].slice(-10),
        },
      ],
    }));
  }, [load]);

  // ============================
  // 3️⃣ WebSocket Real-Time
  // ============================
  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/power-monitor");

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,

      onConnect: () => {
        console.log("✅ WebSocket Connected");

        client.subscribe("/topic/power", (message) => {
          try {
            const data = JSON.parse(message.body);
            const wsLoad = data?.totalLoad;

            if (wsLoad === undefined) return;

            const time = new Date().toLocaleTimeString();

            setChartData((prev) => ({
              labels: [...prev.labels, time].slice(-10),
              datasets: [
                {
                  ...prev.datasets[0],
                  data: [...prev.datasets[0].data, Number(wsLoad)].slice(-10),
                },
              ],
            }));
          } catch (err) {
            console.error("❌ WebSocket error:", err);
          }
        });
      },

      onStompError: (frame) => {
        console.error("❌ STOMP error:", frame);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, []);

  // ============================
  // Chart Options
  // ============================
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // ============================
  // Empty State
  // ============================
  if (chartData.labels.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography color="text.secondary">
          Waiting for power data...
        </Typography>
      </Box>
    );
  }

  // ============================
  // Render
  // ============================
  return (
    <Box sx={{ height: 300 }}>
      <Line data={chartData} options={options} />
    </Box>
  );
}

export default PowerChart;