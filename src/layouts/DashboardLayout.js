// import React from "react";
// import Sidebar from "../components/Sidebar";

// function DashboardLayout({ children }) {
//   return (
//     <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
//       <Sidebar />

//       <div
//         style={{
//           flex: 1,
//           padding: 0,          // ✅ removed blue padding
//           margin: 0,           // ✅ no extra margin
//           background: "#f4f6f8", // keep or remove as you like
//           overflowY: "auto",   // ✅ scroll inside content only
//           height: "100vh"
//         }}
//       >
//         {children}
//       </div>
//     </div>
//   );
// }

// export default DashboardLayout;

import React from "react";
import Sidebar from "../components/Sidebar";
import { Box } from "@mui/material";

function DashboardLayout({ children }) {
  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          background: "#020617", // 🔥 dark theme applied
          overflowY: "auto",
          height: "100vh",
          p: 2   // 🔥 small padding for clean spacing
        }}
      >
        {children}
      </Box>

    </Box>
  );
}

export default DashboardLayout;