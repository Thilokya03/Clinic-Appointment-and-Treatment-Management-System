import { useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";

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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#3b82f6" },   // blue-500
    secondary: { main: "#6366f1" }, // indigo-500
  },
  shape: { borderRadius: 14 },
  components: {
    MuiPaper: { styleOverrides: { root: { borderRadius: 18 } } },
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

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
  
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();

     if (name.trim().length < 2) {
      return setToast({ open: true, message: "Enter a valid name.", severity: "error" });
    }
    if (!dobDay || !dobMonth || !dobYear) { // ✅ fixed
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
    return setToast({ open: true,  message: "Please select your gender.", severity: "error"});
    }

    const dob = `${dobYear}-${dobMonth}-${dobDay}`;

// TODO: Send registration data to backend


    setToast({
      open: true,
      message: `Patient registered successfully (${name}) from (${email})! Please login.`,
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
          <Paper elevation={10} className="Register-card">
            {/* Brand */}
            <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
              <Box
                sx={{
                  width: 60, height: 60, borderRadius: 3,
                  display: "grid", placeItems: "center", color: "white", fontSize: 26, boxShadow: 3,
                  background: "linear-gradient(135deg, #3b82f6 0%, #22c55e 100%)",
                }}
              >
                🩺
              </Box>
              <Typography variant="h5" fontWeight={800} mt={1}>CATMS Register</Typography>
              <Typography variant="body2" color="text.secondary">
                Clinic Appointment & Treatment Management System
              </Typography>
            </Box>

            {/* Form */}
            <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
              <TextField
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth margin="normal" required
              />

              <TextField
                label="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                fullWidth margin="normal" required
              />

              <div style={{ display: "flex", alignItems: "center", gap: "50px", marginTop: "18px", marginBottom: "10px"}}>
                  <span>Gender :</span>
                  <label>
                      <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={gender === "male"}
                      onChange={(e) => setGender(e.target.value)}
                      /> Male
                  </label>
                  <label>
                      <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={gender === "female"}
                      onChange={(e) => setGender(e.target.value)}
                      /> Female
                  </label>
              </div>


              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth margin="normal" required
              />

              <TextField
                label="Contact Number"
                value={contactNo}
                onChange={(e) => setContactNo(e.target.value)}
                fullWidth margin="normal" required
              />

              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "10px", marginBottom: "10px" }}>
                <span>Date of Birth :</span>
                <Box display="flex" gap={2} mt={2} >
                    <TextField
                    select label="Day" value={dobDay}
                    onChange={(e) => setDobDay(e.target.value)}
                    sx={{ flex: 1, minWidth: 90, minHeight: 50}}
                    SelectProps={{ native: true }}
                    >
                    <option value=""></option>
                    {days.map((d) => <option key={d} value={d}>{d}</option>)}
                    </TextField>

                    <TextField
                    select label="Month" value={dobMonth}
                    onChange={(e) => setDobMonth(e.target.value)}
                    sx={{ flex: 1, minWidth: 90 }}
                    SelectProps={{ native: true }}
                    >
                    <option value=""></option>
                    {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                    </TextField>

                    <TextField
                    select label="Year" value={dobYear}
                    onChange={(e) => setDobYear(e.target.value)}
                    sx={{ flex: 1, minWidth: 90 }}
                    SelectProps={{ native: true }}
                    >
                    <option value=""></option>
                    {years.map((y) => <option key={y} value={y}>{y}</option>)}
                    </TextField>
                </Box>
              </div>

              <TextField
                label="Emergency Contact Name"
                value={emergencyContactName}
                onChange={(e) => setEmergencyContactName(e.target.value)}
                fullWidth margin="normal" required
              />

              <TextField
                label="Emergency Contact Number"
                value={emergencyContactNo}
                onChange={(e) => setEmergencyContactNo(e.target.value)}
                fullWidth margin="normal" required
              />

              <TextField
                label="Password"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth margin="normal" required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPw((s) => !s)}
                        edge="end"
                      >
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
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth margin="normal" required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPw((s) => !s)}
                        edge="end"
                      >
                        {showConfirmPw ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button type="submit" fullWidth size="large" variant="contained"
                sx={{ py: 1.2, fontWeight: 700, background: "linear-gradient(90deg,#3b82f6 0%,#6366f1 100%)" }}
              > Register </Button>
              <Typography variant="caption" color="text.secondary" display="block" align="center" mt={3}>
                © {new Date().getFullYear()} MedSync • Security · Privacy · Terms
              </Typography>
            </Box>
          </Paper>
        </Container>
      </div>

      {/* Modern toast */}
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
