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
  FormControl, InputLabel, Select, MenuItem 
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
  const [role, setRole] = useState(""); 
  const [username, setUserName] = useState("");
  const [specialties, setSpecialties] = useState([]);
  const [branch, setBranch] = useState("");
  const [name, setName] = useState("");
  const [age , setAge ] = useState("");
  const [dob , setDob ] = useState(""); 
  const [nic , setNIC ] = useState(""); 
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

  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();

      // Check role
    if (!role) {
      return setToast({ open: true, message: "Please select a role.", severity: "error", });
    }
    if (name.trim().length < 2) {
      return setToast({ open: true, message: "Enter a valid name.", severity: "error" });
    }
    if (username.trim().length < 2) {
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
    if (!dob) {
    return setToast({ open: true,  message: "Please select your Date od birth.", severity: "error"});
    }

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
              {/* role Select */}
              <FormControl fullWidth margin="normal" required sx={{ backgroundColor: "#ffffffff", borderRadius: 1 }}>
                <InputLabel id="role-label" sx={{ color: "#555555" }}>Select Role</InputLabel>
                <Select
                  labelId="role-label"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  slotProps={{
                    select: { sx: { color: "#000000", backgroundColor: "#f8f7f3ff" } },
                  }}
                >
                  <MenuItem value="patient">Patient</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="nurse">Nurse</MenuItem>
                  <MenuItem value="doctor">Doctor</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth margin="normal" required
              />
              <TextField
                label="User Name"
                value={name}
                onChange={(e) => setUserName(e.target.value)}
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
                label="Contact Number"
                value={contactNo}
                onChange={(e) => setContactNo(e.target.value)}
                fullWidth margin="normal" required
              />
              <TextField
                label="NIC"
                value={nic}
                onChange={(e) => setNIC(e.target.value)}
                fullWidth margin="normal" required
              />          
              <TextField
                label="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                fullWidth margin="normal" required
              />
              <TextField
                label="Date of Birth"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                fullWidth
                margin="normal"
                required 
              InputLabelProps={{ shrink: true }}
              slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: {
                    style: { color: "#555555"},
                  },
                }}
              sx={{
                // Target the native calendar picker icon
                "& input::-webkit-calendar-picker-indicator": {
                  filter: "invert(50%)",  
                  opacity: 100,
                  display: "block",
                  cursor: "pointer",
                },
              }}
              />
              {role === "patient" && (
                <TextField
                  label="Emergency Contact Name"
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                  fullWidth margin="normal" required
                />
              )}
              {role === "patient" && (
                <TextField
                  label="Emergency Contact Number"
                  value={emergencyContactNo}
                  onChange={(e) => setEmergencyContactNo(e.target.value)}
                  fullWidth margin="normal" required
                />
              )}

              {role !== "patient"  && (
                <>
                  {/* Branch Selection */}
                  <FormControl fullWidth margin="normal" required>
                    <InputLabel id="branch-label">Branch</InputLabel>
                    <Select
                      labelId="branch-label"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                    >
                      <MenuItem value="colombo">Colombo</MenuItem>
                      <MenuItem value="galle">Galle</MenuItem>
                      <MenuItem value="kandy">Kandy</MenuItem>
                      {/* Add more branches dynamically from backend if needed */}
                    </Select>
                  </FormControl>
                </>
              )}
              {role === "doctor" && (
              <>
                  {/* Specialties Multi-Select */}
                  <FormControl fullWidth margin="normal" required>
                    <InputLabel id="specialty-label">Specialties</InputLabel>
                    <Select
                      labelId="specialty-label"
                      multiple
                      value={specialties}
                      onChange={(e) => setSpecialties(e.target.value)}
                      renderValue={(selected) => selected.join(", ")}
                    >
                      <MenuItem value="cardiology">Cardiology</MenuItem>
                      <MenuItem value="orthopedics">Orthopedics</MenuItem>
                      <MenuItem value="neurology">Neurology</MenuItem>
                      <MenuItem value="pediatrics">Pediatrics</MenuItem>
                      {/* Add more specialties as needed */}
                    </Select>
                  </FormControl>
                  </>
              )}


              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
