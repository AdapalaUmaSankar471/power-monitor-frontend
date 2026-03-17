import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { getMyProfile } from "../services/api";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);

  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    username: "",
  });

  // ============================
  // FETCH LOGGED IN USER
  // ============================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMyProfile();
        const data = res.data;
        setUser({
          name: data.name || data.username || "",
          email: data.email || "",
          role: data.role || "",
          username: data.username || "",
        });
      } catch (err) {
        console.log("Error fetching profile:", err);
        // ✅ Fallback to localStorage
        setUser({
          name: localStorage.getItem("username") || "User",
          email: localStorage.getItem("email") || "",
          role: localStorage.getItem("role") || "",
          username: localStorage.getItem("username") || "",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Updated User Data:", user);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={mainContainer}>
      <Paper sx={paperStyle}>

        {/* TITLE */}
        <Typography variant="h5" fontWeight="bold" mb={1}>
          👤{" "}
          {user.role === "ADMIN"
            ? "Admin"
            : user.role === "OPERATOR"
            ? "Operator"
            : "User"}{" "}
          Profile
        </Typography>

        {/* PROFILE IMAGE */}
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Avatar
            src={image || `https://i.pravatar.cc/100?u=${user.username}`}
            sx={{ width: 100, height: 100, margin: "auto" }}
          />
          {isEditing && (
            <Button variant="outlined" component="label" sx={{ mt: 1 }}>
              Upload Photo
              <input type="file" hidden onChange={handleImageChange} />
            </Button>
          )}
        </Box>

        {/* USERNAME */}
        <TextField
          label="Username"
          value={user.username}
          fullWidth
          margin="normal"
          disabled
        />

        {/* NAME */}
        <TextField
          label="Name"
          name="name"
          value={user.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={!isEditing}
        />

        {/* EMAIL */}
        <TextField
          label="Email"
          name="email"
          value={user.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={!isEditing}
        />

        {/* ROLE — always disabled */}
        <TextField
          label="Role"
          value={user.role}
          fullWidth
          margin="normal"
          disabled
        />

        {/* BUTTONS */}
        <Box sx={{ mt: 2 }}>
          {isEditing ? (
            <Button
              variant="contained"
              color="success"
              onClick={handleSave}
            >
              Save
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </Box>

      </Paper>
    </Box>
  );
}

export default Profile;

// STYLES
const mainContainer = {
  flexGrow: 1,
  p: 3,
  background: "#f3f4f6",
  minHeight: "100vh",
};

const paperStyle = {
  p: 3,
  borderRadius: "16px",
  maxWidth: "500px",
  margin: "auto",
};