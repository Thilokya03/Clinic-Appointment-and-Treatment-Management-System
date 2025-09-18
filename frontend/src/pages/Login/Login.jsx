import { useState } from "react";
import "./Login.css";

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
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
  Button,
  Divider,
  Link,
  Snackbar,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
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

export default function Login() {
  const [role, setRole] = useState("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPw, setShowPw] = useState(false);

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

  const onSubmit = (e) => {
    e.preventDefault();

    // basic client validation
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return setToast({ open: true, message: "Enter a valid email.", severity: "error" });
    }
    if (password.length < 6) {
      return setToast({ open: true, message: "Min 6 characters for password.", severity: "error" });
    }

    // TODO: replace with your backend call
    // const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ role, email, password }) });
    // handle response + navigate by role

    setToast({
      open: true,
      message: `Signed in as ${role.toUpperCase()} (${email})`,
      severity: "success",
    });

    if (remember) {
      localStorage.setItem("catms_login_email", email);
      localStorage.setItem("catms_login_role", role);
    } else {
      localStorage.removeItem("catms_login_email");
      localStorage.removeItem("catms_login_role");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="login-bg">
        <Container maxWidth="sm">
          <Paper elevation={10} className="login-card">
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
              <Typography variant="h5" fontWeight={800} mt={1}>CATMS Login</Typography>
              <Typography variant="body2" color="text.secondary">
                Clinic Appointment & Treatment Management System
              </Typography>
            </Box>

            {/* Form */}
            <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
              <Typography variant="caption" color="text.secondary">Select Role</Typography>
              <ToggleButtonGroup
                value={role}
                exclusive
                onChange={(_, v) => v && setRole(v)}
                fullWidth
                sx={{ my: 1 }}
                color="primary"
              >
                <ToggleButton value="patient">Patient</ToggleButton>
                <ToggleButton value="staff">Staff</ToggleButton>    
              </ToggleButtonGroup>

              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth margin="normal" autoComplete="email" required
              />

              <TextField
                label="Password"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth margin="normal" autoComplete="current-password" required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPw((s) => !s)}
                        edge="end"
                        aria-label={showPw ? "Hide password" : "Show password"}
                      >
                        {showPw ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box mt={1} mb={2} display="flex" alignItems="center" justifyContent="space-between">
                <FormControlLabel
                  control={<Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)} />}
                  label="Remember me"
                />
                <Link href="#" underline="hover" onClick={(e) => e.preventDefault()}>
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth size="large" variant="contained"
                sx={{ py: 1.2, fontWeight: 700, background: "linear-gradient(90deg,#3b82f6 0%,#6366f1 100%)" }}
              >
                Sign In
              </Button>

              <Divider sx={{ my: 2 }}>
                <Typography variant="caption" color="text.secondary">If you don't have an account </Typography>
              </Divider>

            

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
