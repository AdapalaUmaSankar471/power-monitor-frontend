import { Card, CardContent, Typography, Box } from "@mui/material";
import DevicesIcon from "@mui/icons-material/Devices";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import PowerIcon from "@mui/icons-material/Power";
import WarningIcon from "@mui/icons-material/Warning";

const cardData = [
  {
    title: "Total Devices",
    key: "devices",
    icon: <DevicesIcon />,
    color: "#3b82f6"
  },
  {
    title: "Active Devices",
    key: "activeDevices",
    icon: <PowerIcon />,
    color: "#22c55e"
  },
  {
    title: "Power Load",
    key: "load",
    icon: <FlashOnIcon />,
    color: "#f59e0b",
    suffix: " W"
  },
  {
    title: "Status",
    key: "status",
    icon: <WarningIcon />,
    dynamic: true
  }
];

function DashboardCards(props) {

  const { darkMode } = props;

  // ✅ TEXT COLORS BASED ON MODE
  const textColor = darkMode ? "white" : "#111827";
  const subTextColor = darkMode ? "rgba(255,255,255,0.6)" : "#6b7280";

  return (
    <Box sx={gridStyle}>
      {cardData.map((card, index) => {
        const value = props[card.key];
        const isOverload = value === "OVERLOAD";

        return (
          <Card
            key={index}
            sx={{
              ...cardStyle,
              background: darkMode
                ? "rgba(255,255,255,0.05)"
                : "#ffffff",
              border: darkMode
                ? "1px solid rgba(255,255,255,0.1)"
                : "1px solid #e5e7eb"
            }}
          >
            <CardContent>

              {/* ICON */}
              <Box
                sx={{
                  ...iconWrapper,
                  background: card.dynamic
                    ? isOverload
                      ? "#ef4444"
                      : "#22c55e"
                    : card.color,
                  boxShadow: "0 0 20px rgba(0,0,0,0.5)"
                }}
              >
                {card.icon}
              </Box>

              {/* TITLE */}
              <Typography
                variant="body2"
                sx={{ color: subTextColor }}
              >
                {card.title}
              </Typography>

              {/* VALUE */}
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{
                  color: card.dynamic
                    ? isOverload
                      ? "#ef4444"
                      : "#22c55e"
                    : textColor
                }}
              >
                {value}
                {card.suffix || ""}
              </Typography>

            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}

export default DashboardCards;

/////////////////////////////////////////////////////////
// 🔥 STYLES
/////////////////////////////////////////////////////////

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px"
};

const cardStyle = {
  borderRadius: "16px",
  textAlign: "center",
  padding: "15px",
  transition: "0.3s",
  cursor: "pointer",
  backdropFilter: "blur(10px)",
  boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
  "&:hover": {
    transform: "translateY(-6px)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.5)"
  }
};

const iconWrapper = {
  width: "55px",
  height: "55px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 12px",
  color: "#fff",
  fontSize: "26px"
};