import { useState } from "react";
import "./Register.css";
import { useNavigate, Link as RouterLink } from "react-router-dom";

// MUI
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Divider,
  Snackbar,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
  Link,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#2563eb" },
    secondary: { main: "#9333ea" },
  },
  shape: { borderRadius: 18 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 28,
          backgroundColor: "rgba(255,255,255,0.92)",
          boxShadow: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 999,
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 999,
          borderColor: "rgba(148, 163, 184, 0.28)",
          paddingInline: 20,
          "&.Mui-selected": {
            color: "#0f172a",
            backgroundColor: "rgba(37, 99, 235, 0.16)",
            borderColor: "rgba(37, 99, 235, 0.45)",
          },
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.6)",
          borderRadius: 999,
          borderColor: "rgba(148, 163, 184, 0.28)",
          gap: 2,
        },
      },
    },
  },
});

export default function Register() {
  const [name, setName] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [gender, setGender] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactNo, setEmergencyContactNo] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // Toast
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success", // 'error' | 'warning' | 'info' | 'success'
  });
  const closeToast = (_, reason) => {
    if (reason === "clickaway") return;
    setToast((t) => ({ ...t, open: false }));
  };

  const days = Array.from({ length: 31 }, (_, index) => index + 1);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const years = Array.from({ length: 100 }, (_, index) => new Date().getFullYear() - index);

  const navigate = useNavigate();

  const onSubmit = (event) => {
    event.preventDefault();

    if (name.trim().length < 2) {
      return setToast({ open: true, message: "Enter a valid name.", severity: "error" });
    }
    if (!dobDay || !dobMonth || !dobYear) {
      return setToast({ open: true, message: "Select your date of birth.", severity: "error" });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return setToast({ open: true, message: "Enter a valid email.", severity: "error" });
    }
    if (address.trim().length < 5) {
      return setToast({ open: true, message: "Enter a valid address.", severity: "error" });
    }
    if (!/^[0-9]{10}$/.test(contactNo)) {
      return setToast({ open: true, message: "Enter a valid 10-digit contact number.", severity: "error" });
    }
    if (emergencyContactName.trim().length < 2) {
      return setToast({ open: true, message: "Enter a valid emergency contact name.", severity: "error" });
    }
    if (!/^[0-9]{10}$/.test(emergencyContactNo)) {
      return setToast({ open: true, message: "Enter a valid 10-digit emergency number.", severity: "error" });
    }
    if (password.length < 6) {
      return setToast({ open: true, message: "Password must be at least 6 characters.", severity: "error" });
    }
    if (password !== confirmPassword) {
      return setToast({ open: true, message: "Passwords do not match.", severity: "error" });
    }
    if (!gender) {
      return setToast({ open: true, message: "Please select your gender.", severity: "error" });
    }

    const dob = `${dobYear}-${dobMonth}-${dobDay}`;

    // TODO: Send registration data to backend

    setToast({
      open: true,
      message: `Patient registered successfully (${name}) | ${email} | ${dob}. Please login.`,
      severity: "success",
    });

    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="Register-bg">
        <Container maxWidth="sm">
          <Paper elevation={0} className="Register-card">
            <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 3,
                  display: "grid",
                  placeItems: "center",
                  color: "#ffffff",
                  fontWeight: 800,
                  letterSpacing: 1,
                  fontSize: 24,
                  background: "linear-gradient(115deg, #2563eb 0%, #9333ea 65%, #f97316 120%)",
                  boxShadow: "0 20px 38px -18px rgba(37, 99, 235, 0.6)",
                }}
              >
                CAT
              </Box>
              <Typography variant="h5" fontWeight={800} mt={2} textAlign="center">
                CATMS Registration
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Clinic Appointment and Treatment Management System
              </Typography>
            </Box>

            <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
              <TextField
                label="Full Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                fullWidth
                margin="normal"
                required
              />

              <TextField
                label="Address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                fullWidth
                margin="normal"
                required
              />

              <Box mt={2}>
                <Typography variant="caption" color="text.secondary">
                  Gender
                </Typography>
                <ToggleButtonGroup
                  value={gender}
                  exclusive
                  onChange={(_, value) => value && setGender(value)}
                  fullWidth
                  sx={{ my: 1, border: "1px solid rgba(148, 163, 184, 0.28)" }}
                  color="primary"
                >
                  <ToggleButton value="male">Male</ToggleButton>
                  <ToggleButton value="female">Female</ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                fullWidth
                margin="normal"
                required
              />

              <TextField
                label="Contact Number"
                value={contactNo}
                onChange={(event) => setContactNo(event.target.value)}
                fullWidth
                margin="normal"
                required
              />

              <Box mt={2}>
                <Typography variant="caption" color="text.secondary">
                  Date of birth
                </Typography>
                <Box display="flex" gap={2} flexWrap="wrap" mt={1}>
                  <TextField
                    select
                    label="Day"
                    value={dobDay}
                    onChange={(event) => setDobDay(event.target.value)}
                    sx={{ flex: 1, minWidth: 100 }}
                    SelectProps={{ native: true }}
                  >
                    <option value=""></option>
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </TextField>

                  <TextField
                    select
                    label="Month"
                    value={dobMonth}
                    onChange={(event) => setDobMonth(event.target.value)}
                    sx={{ flex: 1, minWidth: 120 }}
                    SelectProps={{ native: true }}
                  >
                    <option value=""></option>
                    {months.map((month, index) => (
                      <option key={month} value={index + 1}>
                        {month}
                      </option>
                    ))}
                  </TextField>

                  <TextField
                    select
                    label="Year"
                    value={dobYear}
                    onChange={(event) => setDobYear(event.target.value)}
                    sx={{ flex: 1, minWidth: 120 }}
                    SelectProps={{ native: true }}
                  >
                    <option value=""></option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </TextField>
                </Box>
              </Box>

              <TextField
                label="Emergency Contact Name"
                value={emergencyContactName}
                onChange={(event) => setEmergencyContactName(event.target.value)}
                fullWidth
                margin="normal"
                required
              />

              <TextField
                label="Emergency Contact Number"
                value={emergencyContactNo}
                onChange={(event) => setEmergencyContactNo(event.target.value)}
                fullWidth
                margin="normal"
                required
              />

              <TextField
                label="Password"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                fullWidth
                margin="normal"
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPw((prev) => !prev)} edge="end">
                        {showPw ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Confirm Password"
                type={showConfirmPw ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                fullWidth
                margin="normal"
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPw((prev) => !prev)} edge="end">
                        {showConfirmPw ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                size="large"
                variant="contained"
                sx={{
                  mt: 1,
                  py: 1.2,
                  fontWeight: 700,
                  background: "linear-gradient(110deg,#2563eb 0%,#9333ea 55%,#f97316 115%)",
                  boxShadow: "0 22px 44px -22px rgba(37, 99, 235, 0.75)",
                  "&:hover": {
                    background: "linear-gradient(110deg,#1d4ed8 0%,#7c3aed 55%,#ea580c 115%)",
                  },
                }}
              >
                Register
              </Button>

              <Divider sx={{ my: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  Already registered?
                </Typography>
              </Divider>

              <Typography variant="body2" color="text.secondary" align="center">
                <Link component={RouterLink} to="/login" underline="hover">
                  Sign in to your account
                </Link>
              </Typography>

              <Typography variant="caption" color="text.secondary" display="block" align="center" mt={3}>
                (c) {new Date().getFullYear()} MedSync | Security | Privacy | Terms
              </Typography>
            </Box>
          </Paper>
        </Container>
      </div>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={closeToast}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={closeToast} severity={toast.severity} variant="filled" elevation={3} sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
