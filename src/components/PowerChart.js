// import React, { useEffect, useState, useRef } from "react";
// import { Line } from "react-chartjs-2";
// import { Box, Typography } from "@mui/material";

// import {
//   Chart as ChartJS,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   Tooltip,
//   Legend,
// } from "chart.js";

// import SockJS from "sockjs-client";
// import { Client } from "@stomp/stompjs";

// // Register ChartJS
// ChartJS.register(
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   Tooltip,
//   Legend
// );

// function PowerChart({ load, logs = [] }) {
//   const clientRef = useRef(null);

//   const [chartData, setChartData] = useState({
//     labels: [],
//     datasets: [
//       {
//         label: "Power Load (W)",
//         data: [],
//         borderColor: "#2563eb",
//         backgroundColor: "rgba(37, 99, 235, 0.2)",
//         tension: 0.4,
//         fill: true,
//       },
//     ],
//   });

//   // ============================
//   // 1️⃣ Load History Data
//   // ============================
//   useEffect(() => {
//     if (!logs || logs.length === 0) return;

//     setChartData({
//       labels: logs.map((l) =>
//         new Date(l.timestamp).toLocaleTimeString()
//       ),
//       datasets: [
//         {
//           label: "Power Load (W)",
//           data: logs.map((l) => Number(l.totalLoad)),
//           borderColor: "#2563eb",
//           backgroundColor: "rgba(37, 99, 235, 0.2)",
//           tension: 0.4,
//           fill: true,
//         },
//       ],
//     });
//   }, [logs]);

//   // ============================
//   // 2️⃣ Prop-based Live Load
//   // ============================
//   useEffect(() => {
//     if (load === undefined || load === null) return;

//     const time = new Date().toLocaleTimeString();

//     setChartData((prev) => ({
//       labels: [...prev.labels, time].slice(-10),
//       datasets: [
//         {
//           ...prev.datasets[0],
//           data: [...prev.datasets[0].data, Number(load)].slice(-10),
//         },
//       ],
//     }));
//   }, [load]);

//   // ============================
//   // 3️⃣ WebSocket Real-Time
//   // ============================
//   useEffect(() => {
//     const wsUrl = (process.env.REACT_APP_API_URL || 'http://localhost:8080').replace('http://', 'https://');
//     const socket = new SockJS(wsUrl + '/power-monitor');

//     const client = new Client({
//       webSocketFactory: () => socket,
//       reconnectDelay: 5000,

//       onConnect: () => {
//         console.log("✅ WebSocket Connected");

//         client.subscribe("/topic/power", (message) => {
//           try {
//             const data = JSON.parse(message.body);
//             const wsLoad = data?.totalLoad;

//             if (wsLoad === undefined) return;

//             const time = new Date().toLocaleTimeString();

//             setChartData((prev) => ({
//               labels: [...prev.labels, time].slice(-10),
//               datasets: [
//                 {
//                   ...prev.datasets[0],
//                   data: [...prev.datasets[0].data, Number(wsLoad)].slice(-10),
//                 },
//               ],
//             }));
//           } catch (err) {
//             console.error("❌ WebSocket error:", err);
//           }
//         });
//       },

//       onStompError: (frame) => {
//         console.error("❌ STOMP error:", frame);
//       },
//     });

//     client.activate();
//     clientRef.current = client;

//     return () => {
//       if (clientRef.current) {
//         clientRef.current.deactivate();
//       }
//     };
//   }, []);

//   // ============================
//   // Chart Options
//   // ============================
//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: true,
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//     },
//   };

//   // ============================
//   // Empty State
//   // ============================
//   if (chartData.labels.length === 0) {
//     return (
//       <Box sx={{ textAlign: "center", py: 4 }}>
//         <Typography color="text.secondary">
//           Waiting for power data...
//         </Typography>
//       </Box>
//     );
//   }

//   // ============================
//   // Render
//   // ============================
//   return (
//     <Box sx={{ height: 300 }}>
//       <Line data={chartData} options={options} />
//     </Box>
//   );
// }

// export default PowerChart;

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

function PowerChart({ load, logs = [], darkMode }) {

  const clientRef = useRef(null);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Power Load (W)",
        data: [],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.3)",
        tension: 0.5,
        fill: true,
        pointRadius: 3,
        pointHoverRadius: 6
      },
    ],
  });

  // 1️⃣ Load History
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
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.3)",
          tension: 0.4,
          fill: true,
        },
      ],
    });
  }, [logs]);

  // 2️⃣ Prop-based Live Load
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

  // 3️⃣ WebSocket Real-Time
  useEffect(() => {
    const baseUrl = process.env.REACT_APP_API_URL || "https://your-backend.onrender.com";
    const socket = new SockJS(baseUrl + "/power-monitor");

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
      clientRef.current?.deactivate();
    };
  }, []);

  // ✅ DARK / LIGHT MODE COLORS
  const textColor = darkMode ? "white" : "#111827";
  const gridColor = darkMode
    ? "rgba(255,255,255,0.1)"
    : "rgba(0,0,0,0.1)";

  // 🔥 FIXED OPTIONS
  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        labels: {
          color: textColor
        },
      },
    },

    scales: {
      x: {
        ticks: {
          color: textColor
        },
        grid: {
          color: gridColor
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: textColor
        },
        grid: {
          color: gridColor
        },
      },
    },
  };

  if (chartData.labels.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography color={textColor}>
          Waiting for power data...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 300 }}>
      <Line data={chartData} options={options} />
    </Box>
  );
}

export default PowerChart;