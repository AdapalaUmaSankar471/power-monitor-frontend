import { Card, CardContent, Typography, Box } from "@mui/material";
import DevicesIcon from "@mui/icons-material/Devices";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import PowerIcon from "@mui/icons-material/Power";
import WarningIcon from "@mui/icons-material/Warning";

// Card Config (clean + reusable)
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
              background: card.dynamic
                ? isOverload
                  ? "#fee2e2"
                  : "#ecfdf5"
                : "#ffffff"
            }}
          >
            <CardContent>
              <Box
                sx={{
                  ...iconWrapper,
                  background: card.dynamic
                    ? isOverload
                      ? "#ef4444"
                      : "#22c55e"
                    : card.color
                }}
              >
                {card.icon}
              </Box>

              <Typography variant="body2" color="text.secondary">
                {card.title}
              </Typography>

              <Typography variant="h5" fontWeight="bold">
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
// STYLES (Clean + Modern)
/////////////////////////////////////////////////////////

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px"
};

const cardStyle = {
  borderRadius: "16px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  textAlign: "center",
  padding: "15px",
  transition: "0.3s",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 12px 25px rgba(0,0,0,0.15)"
  }
};

const iconWrapper = {
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 10px",
  color: "#fff",
  fontSize: "26px"
};