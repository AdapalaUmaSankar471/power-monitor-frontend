import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import DevicesIcon from "@mui/icons-material/Devices";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PeopleIcon from "@mui/icons-material/People";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";

import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

const drawerWidth = 230;

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username") || "User";

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const activeStyle = {
    background: "#1f2937"
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          background: "#111827",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }
      }}
    >
      {/* ================= TOP ================= */}
      <div>
        {/* ✅ FIX 1: Reduced padding on heading */}
        <h2 style={{ textAlign: "center", padding: "16px 20px 10px 20px", margin: 0 }}>
          ⚡ Smart Power
        </h2>

        {/* ✅ FIX 2: disablePadding removes MUI List's default top/bottom gap */}
        <List disablePadding>

          {/* Dashboard */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() =>
                navigate(
                  role === "ADMIN"
                    ? "/admin"
                    : role === "OPERATOR"
                    ? "/operator"
                    : "/viewer"
                )
              }
              sx={
                isActive("/admin") ||
                isActive("/operator") ||
                isActive("/viewer")
                  ? activeStyle
                  : {}
              }
            >
              <ListItemIcon>
                <DashboardIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>

          {/* Devices */}
          {role !== "VIEWER" && (
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate("/devices")}
                sx={isActive("/devices") ? activeStyle : {}}
              >
                <ListItemIcon>
                  <DevicesIcon sx={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText primary="Devices" />
              </ListItemButton>
            </ListItem>
          )}

          {/* Reports */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate("/reports")}
              sx={isActive("/reports") ? activeStyle : {}}
            >
              <ListItemIcon>
                <AssessmentIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Energy Reports" />
            </ListItemButton>
          </ListItem>

          {/* Activity Logs */}
          {role === "ADMIN" && (
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate("/logs")}
                sx={isActive("/logs") ? activeStyle : {}}
              >
                <ListItemIcon>
                  <HistoryIcon sx={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText primary="Activity Logs" />
              </ListItemButton>
            </ListItem>
          )}

          {/* Users */}
          {role === "ADMIN" && (
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate("/users")}
                sx={isActive("/users") ? activeStyle : {}}
              >
                <ListItemIcon>
                  <PeopleIcon sx={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText primary="Users" />
              </ListItemButton>
            </ListItem>
          )}

        </List>
      </div>

      {/* ================= BOTTOM PROFILE ================= */}
      <div style={{ padding: "15px", borderTop: "1px solid #374151" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer"
          }}
          onClick={() => setOpen(!open)}
        >
          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%"
            }}
          />
          <span>{username}</span>
        </div>

        {open && (
          <div style={{ marginTop: "10px" }}>
            <Divider sx={{ background: "#374151", my: 1 }} />

            <div style={dropItem} onClick={() => navigate("/profile")}>
              <AccountCircleIcon fontSize="small" />
              Profile
            </div>

            <div style={dropItem} onClick={() => navigate("/settings")}>
              <SettingsIcon fontSize="small" />
              Settings
            </div>

            <div style={dropItem} onClick={logout}>
              <LogoutIcon fontSize="small" />
              Logout
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}

const dropItem = {
  padding: "8px",
  cursor: "pointer",
  borderRadius: "4px",
  display: "flex",
  alignItems: "center",
  gap: "8px"
};

export default Sidebar;