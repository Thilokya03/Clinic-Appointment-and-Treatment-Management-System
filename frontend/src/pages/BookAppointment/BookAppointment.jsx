import React, { useState, useEffect } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
  Box,
  Divider,
  Alert,
  Snackbar,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
} from "@mui/material";
import {
  ArrowBack,
  CalendarToday,
  Schedule,
  Person,
  Payment,
  CheckCircle,
} from "@mui/icons-material";
import "./bookappointment.css";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#3b82f6" },
    secondary: { main: "#6366f1" },
  },
  shape: { borderRadius: 12 },
});

// Mock doctors data - in real app, this would come from API
const ALL_DOCTORS = [
  { id: 1, name: "Dr. Smith Perera", specialization: "Cardiologist" },
  { id: 2, name: "Dr. Kamal Silva", specialization: "Neurologist" },
  { id: 3, name: "Dr. Nimal Fernando", specialization: "Pediatrician" },
  { id: 4, name: "Dr. Sunil Rathnayake", specialization: "Dermatologist" },
  { id: 5, name: "Dr. Anusha Jayasuriya", specialization: "Gynecologist" },
];

const APPOINTMENT_FEE = 300;

export default function BookAppointment() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    patientId: "",
    appointmentDate: "",
    startTime: "",
    endTime: "",
    selectedDoctor: "",
  });
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [toast, setToast] = useState({ open: false, message: "", severity: "info" });

  // Time slots
  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00"
  ];

  const steps = ["Patient Details", "Select Date & Time", "Choose Doctor", "Confirm & Pay"];

  // Filter available doctors based on date and time
  useEffect(() => {
    if (formData.appointmentDate && formData.startTime && formData.endTime) {
      // Mock availability check - in real app, this would be an API call
      const available = ALL_DOCTORS.filter(doctor =>
        // Simulate some doctors being unavailable
        Math.random() > 0.3
      );
      setAvailableDoctors(available);
    }
  }, [formData.appointmentDate, formData.startTime, formData.endTime]);

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        return formData.patientId.length >= 3;
      case 1:
        return formData.appointmentDate && formData.startTime && formData.endTime;
      case 2:
        return formData.selectedDoctor;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    } else {
      setToast({
        open: true,
        message: "Please fill all required fields",
        severity: "error"
      });
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    // In real app, this would submit to backend
    setToast({
      open: true,
      message: "Appointment booked successfully!",
      severity: "success"
    });

    // Reset form after successful submission
    setTimeout(() => {
      setFormData({
        patientId: "",
        appointmentDate: "",
        startTime: "",
        endTime: "",
        selectedDoctor: "",
      });
      setActiveStep(0);
    }, 2000);
  };

  const goToHome = () => {
    window.location.href = "/";
  };

  const closeToast = (_, reason) => {
    if (reason === "clickaway") return;
    setToast((t) => ({ ...t, open: false }));
  };

  const getSelectedDoctor = () => {
    return ALL_DOCTORS.find(doc => doc.id === parseInt(formData.selectedDoctor));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="book-appointment-bg">
        <Container maxWidth="md" sx={{ py: 4 }}>
          {/* Header with Back Button */}
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={goToHome}
              sx={{ mb: 2 }}
              className="back-button"
            >
              Back to Home
            </Button>
            <Typography variant="h4" fontWeight={800} className="page-title">
              Book Appointment
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Schedule your medical appointment in few easy steps
            </Typography>
          </Box>

          {/* Stepper */}
          <Paper elevation={2} className="stepper-paper">
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>

          {/* Form Content */}
          <Paper elevation={4} className="form-paper">
            {/* Step 1: Patient Details */}
            {activeStep === 0 && (
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                  <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Patient Information
                </Typography>
                <TextField
                  fullWidth
                  label="Patient ID"
                  value={formData.patientId}
                  onChange={handleInputChange('patientId')}
                  placeholder="Enter your patient ID"
                  required
                  sx={{ mb: 3 }}
                  helperText="Enter your unique patient identification number"
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="contained" onClick={handleNext}>
                    Continue to Date & Time
                  </Button>
                </Box>
              </Box>
            )}

            {/* Step 2: Date & Time */}
            {activeStep === 1 && (
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                  <CalendarToday sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Select Date & Time
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Appointment Date"
                      value={formData.appointmentDate}
                      onChange={handleInputChange('appointmentDate')}
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Start Time"
                      value={formData.startTime}
                      onChange={handleInputChange('startTime')}
                      required
                    >
                      {timeSlots.map((time) => (
                        <MenuItem key={time} value={time}>
                          {time}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="End Time"
                      value={formData.endTime}
                      onChange={handleInputChange('endTime')}
                      required
                    >
                      {timeSlots
                        .filter(time => formData.startTime && time > formData.startTime)
                        .map((time) => (
                          <MenuItem key={time} value={time}>
                            {time}
                          </MenuItem>
                        ))}
                    </TextField>
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button onClick={handleBack}>Back</Button>
                  <Button variant="contained" onClick={handleNext}>
                    Continue to Choose Doctor
                  </Button>
                </Box>
              </Box>
            )}

            {/* Step 3: Choose Doctor */}
            {activeStep === 2 && (
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                  <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Select Doctor
                </Typography>

                {availableDoctors.length === 0 ? (
                  <Alert severity="info" sx={{ mb: 3 }}>
                    Please select date and time first to see available doctors.
                  </Alert>
                ) : (
                  <>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Available doctors for {formData.appointmentDate} from {formData.startTime} to {formData.endTime}
                    </Typography>
                    <TextField
                      fullWidth
                      select
                      label="Choose Doctor"
                      value={formData.selectedDoctor}
                      onChange={handleInputChange('selectedDoctor')}
                      required
                      sx={{ mb: 3 }}
                    >
                      {availableDoctors.map((doctor) => (
                        <MenuItem key={doctor.id} value={doctor.id}>
                          <Box>
                            <Typography variant="body1" fontWeight={600}>
                              {doctor.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {doctor.specialization}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </TextField>
                  </>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button onClick={handleBack}>Back</Button>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={!formData.selectedDoctor}
                  >
                    Continue to Payment
                  </Button>
                </Box>
              </Box>
            )}

            {/* Step 4: Confirm & Pay */}
            {activeStep === 3 && (
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                  <Payment sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Confirm Appointment & Pay
                </Typography>

                <Card elevation={2} className="summary-card">
                  <CardContent>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                      Appointment Summary
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Patient ID:</Typography>
                        <Typography variant="body1" fontWeight={600}>{formData.patientId}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Date:</Typography>
                        <Typography variant="body1" fontWeight={600}>{formData.appointmentDate}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Time:</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {formData.startTime} - {formData.endTime}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Doctor:</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {getSelectedDoctor()?.name}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    <Box className="fee-section">
                      <Typography variant="body2" color="text.secondary">Appointment Fee:</Typography>
                      <Typography variant="h6" color="primary" fontWeight={800}>
                        LKR {APPOINTMENT_FEE}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button onClick={handleBack}>Back</Button>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<CheckCircle />}
                    onClick={handleSubmit}
                    className="pay-button"
                  >
                    Pay & Confirm Appointment
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Container>

        {/* Snackbar for notifications */}
        <Snackbar
          open={toast.open}
          autoHideDuration={4000}
          onClose={closeToast}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={closeToast} severity={toast.severity} variant="filled">
            {toast.message}
          </Alert>
        </Snackbar>
      </div>
    </ThemeProvider>
  );
}