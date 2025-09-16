import { useEffect, useMemo, useState } from "react";
import "./Home.css";

// MUI
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Grid,
  Paper,
  Box,
  Button,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Logout,
  Settings,
  CalendarMonth,
  EventAvailable,
  Assignment,
  ReceiptLong,
  AddCircleOutline,
  LocalHospital,
} from "@mui/icons-material";

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

export default function Home() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "", severity: "info" });
  const [role, setRole] = useState("patient");
  const [email, setEmail] = useState("");

  // Pull role/email saved by Login.jsx
  useEffect(() => {
    const r = localStorage.getItem("catms_login_role") || "patient";
    const e = localStorage.getItem("catms_login_email") || "";
    setRole(r);
    setEmail(e);
  }, []);

  const roleLabel = useMemo(
    () => (role === "staff" ? "Staff" : role === "doctor" ? "Doctor" : "Patient"),
    [role]
  );

  const openMenu = (e) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const go = (path, msg) => {
    // Hook to your router here if desired:
    // navigate(path)
    setToast({ open: true, message: msg || `Navigate → ${path}`, severity: "info" });
    // window.location.href = path; // uncomment if you want a hard navigation
  };

  const logout = () => {
    localStorage.removeItem("catms_login_email");
    localStorage.removeItem("catms_login_role");
    setToast({ open: true, message: "Logged out.", severity: "success" });
    // window.location.href = "/login";
  };

  const closeToast = (_, reason) => {
    if (reason === "clickaway") return;
    setToast((t) => ({ ...t, open: false }));
  };

  // Quick actions vary by role
  const quickActions = useMemo(() => {
    if (role === "staff") {
      return [
        { icon: <AddCircleOutline />, text: "Create Appointment", onClick: () => go("/appointments/new") },
        { icon: <EventAvailable />, text: "Today’s Schedule", onClick: () => go("/schedule/today") },
        { icon: <LocalHospital />, text: "Walk-in Check-in", onClick: () => go("/walkins") },
        { icon: <ReceiptLong />, text: "Billing & Payments", onClick: () => go("/billing") },
      ];
    }
    if (role === "doctor") {
      return [
        { icon: <CalendarMonth />, text: "My Appointments", onClick: () => go("/doctor/appointments") },
        { icon: <Assignment />, text: "Treatment Notes", onClick: () => go("/doctor/treatments") },
        { icon: <ReceiptLong />, text: "My Revenue", onClick: () => go("/reports/doctor-revenue") },
        { icon: <EventAvailable />, text: "On-Call / Today", onClick: () => go("/doctor/today") },
      ];
    }
    // patient
    return [
      { icon: <AddCircleOutline />, text: "Book Appointment", onClick: () => go("/appointments/book") },
      { icon: <CalendarMonth />, text: "My Appointments", onClick: () => go("/appointments/mine") },
      { icon: <Assignment />, text: "Prescriptions & Treatments", onClick: () => go("/treatments") },
      { icon: <ReceiptLong />, text: "Invoices & Payments", onClick: () => go("/invoices") },
    ];
  }, [role]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="home-bg">
        {/* Top App Bar */}
        <AppBar position="sticky" color="transparent" elevation={0} className="glass-bar">
          <Toolbar>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              CATMS
            </Typography>
            <Chip label={roleLabel} color="primary" variant="outlined" size="small" sx={{ ml: 2 }} />
            <Box sx={{ flexGrow: 1 }} />
            <Typography variant="body2" sx={{ mr: 1, opacity: 0.8 }}>
              {email || "user@clinic.com"}
            </Typography>
            <IconButton onClick={openMenu}>
              <Avatar sx={{ bgcolor: "#3b82f6" }}>{(email || "U").charAt(0).toUpperCase()}</Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
              <MenuItem onClick={() => { closeMenu(); go("/profile", "Profile"); }}>
                <Settings fontSize="small" style={{ marginRight: 8 }} /> Profile & Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => { closeMenu(); logout(); }}>
                <Logout fontSize="small" style={{ marginRight: 8 }} /> Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Content */}
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Welcome */}
          <Grid container spacing={2} alignItems="stretch">
            <Grid item xs={12} md={7}>
              <Paper className="hero-card" elevation={8}>
                <Typography variant="h5" fontWeight={800}>
                  Welcome back{email ? `, ${email.split("@")[0]}` : ""} 👋
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Manage appointments, treatments, and billing from one place.
                </Typography>
                <Box sx={{ display: "flex", gap: 1.5, mt: 2, flexWrap: "wrap" }}>
                  <Button
                    variant="contained"
                    onClick={() =>
                      go(
                        role === "patient" ? "/appointments/book" :
                        role === "staff"   ? "/appointments/new" :
                                             "/doctor/appointments",
                        "Quick Action"
                      )
                    }
                  >
                    Quick Action
                  </Button>
                  <Button variant="outlined" onClick={() => go("/reports")}>
                    View Reports
                  </Button>
                </Box>
              </Paper>
            </Grid>

            {/* Today snapshot */}
            <Grid item xs={12} md={5}>
              <Paper className="tiny-card" elevation={6}>
                <Typography variant="subtitle1" fontWeight={700}>Today</Typography>
                <Divider sx={{ my: 1.5 }} />
                <Box className="today-row">
                  <CalendarMonth /> <span>Appointments</span>
                  <strong className="push">8</strong>
                </Box>
                <Box className="today-row">
                  <EventAvailable /> <span>Completed</span>
                  <strong className="push">3</strong>
                </Box>
                <Box className="today-row">
                  <Assignment /> <span>Treatments</span>
                  <strong className="push">5</strong>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Quick Actions */}
          <Typography variant="subtitle1" fontWeight={800} sx={{ mt: 4, mb: 1 }}>
            Quick actions
          </Typography>
          <Grid container spacing={2}>
            {quickActions.map((qa, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Paper className="action-card" onClick={qa.onClick} elevation={4}>
                  <div className="action-icon">{qa.icon}</div>
                  <div className="action-text">{qa.text}</div>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Announcements / placeholder */}
          <Typography variant="subtitle1" fontWeight={800} sx={{ mt: 4, mb: 1 }}>
            Announcements
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper className="note-card" elevation={3}>
                <Typography variant="subtitle2" fontWeight={700}>System maintenance</Typography>
                <Typography variant="body2" color="text.secondary">
                  Scheduled on Sunday 2:00–3:00 AM. Expect brief downtime.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className="note-card" elevation={3}>
                <Typography variant="subtitle2" fontWeight={700}>New feature</Typography>
                <Typography variant="body2" color="text.secondary">
                  Insurance coverage report now includes per-treatment breakdowns.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </div>

      {/* Snackbar / Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
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
