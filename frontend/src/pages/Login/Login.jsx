import { useState } from "react";
import "./Login.css";
import { Link as RouterLink } from "react-router-dom";

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

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return setToast({ open: true, message: "Enter a valid email.", severity: "error" });
    }
    if (password.length < 6) {
      return setToast({ open: true, message: "Min 6 characters for password.", severity: "error" });
    }

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
          <Paper elevation={0} className="login-card">
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
                CATMS Login
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Clinic Appointment and Treatment Management System
              </Typography>
            </Box>

            <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Select role
              </Typography>
              <ToggleButtonGroup
                value={role}
                exclusive
                onChange={(_, value) => value && setRole(value)}
                fullWidth
                sx={{ my: 1, border: "1px solid rgba(148, 163, 184, 0.28)" }}
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
                fullWidth
                margin="normal"
                autoComplete="email"
                required
              />

              <TextField
                label="Password"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
                autoComplete="current-password"
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPw((prev) => !prev)}
                        edge="end"
                        aria-label={showPw ? "Hide password" : "Show password"}
                      >
                        {showPw ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box mt={1.5} mb={2} display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
                <FormControlLabel
                  control={<Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)} />}
                  label="Remember me"
                />
                <Link href="#" underline="hover" onClick={(event) => event.preventDefault()}>
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                size="large"
                variant="contained"
                sx={{
                  py: 1.2,
                  fontWeight: 700,
                  background: "linear-gradient(110deg,#2563eb 0%,#9333ea 55%,#f97316 115%)",
                  boxShadow: "0 22px 44px -22px rgba(37, 99, 235, 0.75)",
                  "&:hover": {
                    background: "linear-gradient(110deg,#1d4ed8 0%,#7c3aed 55%,#ea580c 115%)",
                  },
                }}
              >
                Sign In
              </Button>

              <Divider sx={{ my: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  Need an account?
                </Typography>
              </Divider>

              <Typography variant="body2" color="text.secondary" align="center">
                <Link component={RouterLink} to="/register" underline="hover">
                  Register for CATMS
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
