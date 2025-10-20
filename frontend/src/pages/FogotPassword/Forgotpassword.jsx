import { useState } from "react";
import "../Login/Login.css";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Link,
  Snackbar,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import axios from "axios";

const theme = createTheme({
  palette: { mode: "light", primary: { main: "#2563eb" }, secondary: { main: "#9333ea" } },
  shape: { borderRadius: 18 },
  components: {
    MuiPaper: { styleOverrides: { root: { borderRadius: 28, backgroundColor: "rgba(255,255,255,0.92)", boxShadow: "none" } } },
    MuiButton: { styleOverrides: { root: { textTransform: "none", borderRadius: 999 } } },
  },
});

const BASE_URL = "http://localhost:3000";

export default function Forgotpassword() {
  const [method, setMethod] = useState("username");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ username: "", nic: "", email: "" });
  const [role, setRole] = useState("");
  const [otp, setOtp] = useState("");
  const [passwords, setPasswords] = useState({ pass: "", pass2: "" });
  const [toast, setToast] = useState({ open: false, message: "", severity: "info" });

  const closeToast = (_, reason) => { if (reason === "clickaway") return; setToast(t => ({ ...t, open: false })); };
  const showToast = (message, severity = "info") => setToast({ open: true, message, severity });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const requestReset = async (e) => {
    e.preventDefault();
    if (!role) return showToast("Please select a role", "error");
    try {
      const payload = method === "username"
        ? { method, username: form.username, email: form.email, role }
        : { method, nic: form.nic, email: form.email, role };

      const { data } = await axios.post(`${BASE_URL}/api/auth/request-reset`, payload);
      showToast(data.message, "success");
      setStep(2);
    } catch (err) { showToast(err?.response?.data?.message || "Failed to send OTP", "error"); }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${BASE_URL}/api/auth/verify-otp`, { email: form.email, otp });
      showToast(data.message, "success");
      setStep(3);
    } catch (err) { showToast(err?.response?.data?.message || "Invalid OTP", "error"); }
  };

 const resetPassword = async (e) => {
  e.preventDefault();
  if (passwords.pass.length < 8) return showToast("Password must be at least 8 characters", "error");
  if (passwords.pass !== passwords.pass2) return showToast("Passwords do not match", "error");

  try {
    const { data } = await axios.post(`${BASE_URL}/api/auth/reset-password`, {
      role,           // role selected earlier
      email: form.email,
      otp,            // the OTP entered by user
      newPassword: passwords.pass
    });
    showToast(data.message, "success");
    setStep(4);
  } catch (err) {
    showToast(err?.response?.data?.error || "Reset failed", "error");
  }
};

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="login-bg">
        <Container maxWidth="sm">
          <Paper elevation={0} className="login-card">
            <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
              <Box sx={{ width: 64, height: 64, borderRadius: 3, display: "grid", placeItems: "center", color: "#fff", fontWeight: 800, letterSpacing: 1, fontSize: 24, background: "linear-gradient(115deg, #2563eb 0%, #9333ea 65%, #f97316 120%)" }}>CAT</Box>
              <Typography variant="h5" fontWeight={800} mt={2}>Forgot Password</Typography>
              <Typography variant="body2" color="text.secondary">Reset your CATMS account password</Typography>
            </Box>

            {/* Step 1 */}
            {step === 1 && (
              <Box component="form" onSubmit={requestReset}>
                <ToggleButtonGroup value={method} exclusive onChange={(_, v) => v && setMethod(v)} fullWidth color="primary" sx={{ my: 1 }}>
                  <ToggleButton value="username">Username + Email</ToggleButton>
                  <ToggleButton value="nic">NIC + Email</ToggleButton>
                </ToggleButtonGroup>

                {method === "username" ? (
                  <TextField label="Username" name="username" value={form.username} onChange={handleChange} fullWidth margin="normal" required />
                ) : (
                  <TextField label="NIC" name="nic" value={form.nic} onChange={handleChange} fullWidth margin="normal" required />
                )}

                <TextField label="Email" name="email" value={form.email} onChange={handleChange} type="email" fullWidth margin="normal" required />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Role</InputLabel>
                  <Select value={role} onChange={(e) => setRole(e.target.value)} label="Role">
                    <MenuItem value="staff">Staff</MenuItem>
                    <MenuItem value="patient">Patient</MenuItem>
                  </Select>
                </FormControl>

                <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, py: 1.2, fontWeight: 700, background: "linear-gradient(110deg,#2563eb 0%,#9333ea 55%,#f97316 115%)" }}>Send Verification</Button>
              </Box>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <Box component="form" onSubmit={verifyOtp}>
                <TextField label="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} fullWidth margin="normal" required />
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, py: 1.2, fontWeight: 700, background: "linear-gradient(110deg,#2563eb 0%,#9333ea 55%,#f97316 115%)" }}>Verify OTP</Button>
              </Box>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <Box component="form" onSubmit={resetPassword}>
                <TextField label="New Password" type="password" value={passwords.pass} onChange={(e) => setPasswords({ ...passwords, pass: e.target.value })} fullWidth margin="normal" required />
                <TextField label="Confirm Password" type="password" value={passwords.pass2} onChange={(e) => setPasswords({ ...passwords, pass2: e.target.value })} fullWidth margin="normal" required />
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, py: 1.2, fontWeight: 700, background: "linear-gradient(110deg,#2563eb 0%,#9333ea 55%,#f97316 115%)" }}>Change Password</Button>
              </Box>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <Box textAlign="center" mt={3}>
                <Typography variant="h6" color="success.main" gutterBottom>✅ Password Changed Successfully!</Typography>
                <Link href="/login" underline="hover">Return to Login</Link>
              </Box>
            )}
          </Paper>
        </Container>
      </div>

      <Snackbar open={toast.open} autoHideDuration={3000} onClose={closeToast} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={closeToast} severity={toast.severity} variant="filled" sx={{ width: "100%" }}>{toast.message}</Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
