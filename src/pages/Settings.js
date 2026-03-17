import { Box, Typography, TextField, Button, Paper } from "@mui/material";

const Settings = () => {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Paper elevation={3} sx={{ p: 3, maxWidth: 500 }}>
        <Typography variant="h6" gutterBottom>
          Profile Settings
        </Typography>

        <TextField
          fullWidth
          label="Name"
          margin="normal"
        />

        <TextField
          fullWidth
          label="Email"
          margin="normal"
        />

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Save Changes
        </Button>
      </Paper>
    </Box>
  );
};

export default Settings;