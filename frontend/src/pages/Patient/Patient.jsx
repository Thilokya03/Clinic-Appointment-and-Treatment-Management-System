import { useMemo, useState } from "react";
import "./patient.css";
import {
  Container,
  Typography,
  Box,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  CalendarMonth,
  LocalHospital,
  Assignment,
  MedicalInformation,
  EventAvailable,
  AccessTime,
  AccountCircle,
  LocalPharmacy,
  Payment,
  Message,
} from "@mui/icons-material";

const UPCOMING_APPOINTMENTS = [
  {
    id: "APT-1001",
    doctor: "Dr. Aisha Fernando",
    specialty: "Cardiologist",
    date: "Today",
    time: "4:30 PM",
    status: "Confirmed",
    type: "Regular Checkup",
  },
  {
    id: "APT-1002",
    doctor: "Dr. Kamal Silva",
    specialty: "Neurologist",
    date: "Tomorrow",
    time: "10:00 AM",
    status: "Pending",
    type: "Follow-up",
  },
];

const MEDICAL_RECORDS = [
  {
    id: "REC-1001",
    type: "Lab Results",
    date: "Oct 12, 2025",
    doctor: "Dr. Aisha Fernando",
    description: "Blood work results",
  },
  {
    id: "REC-1002",
    type: "Prescription",
    date: "Oct 5, 2025",
    doctor: "Dr. Kamal Silva",
    description: "Monthly medication",
  },
  {
    id: "REC-1003",
    type: "Treatment Notes",
    date: "Sep 28, 2025",
    doctor: "Dr. Nimal Perera",
    description: "Regular checkup notes",
  },
];

export default function Patient() {
  return (
    <main className="patient-container">
      <Container maxWidth="xl">
        <div className="patient-shell">
          <div>
            <Typography variant="h1" className="patient-title">
              Patient Dashboard
            </Typography>
            <Typography className="patient-subtitle">
              Manage your appointments, view medical records, and access quick services
            </Typography>
          </div>

          <div className="patient-dashboard">
            {/* Upcoming Appointments */}
            <div className="dashboard-card">
              <div className="dashboard-card__header">
                <h2 className="dashboard-card__title">Upcoming Appointments</h2>
                <div className="dashboard-card__icon">
                  <CalendarMonth />
                </div>
              </div>
              <div className="appointment-list">
                {UPCOMING_APPOINTMENTS.map((apt) => (
                  <div key={apt.id} className="appointment-item">
                    <Box
                      sx={{
                        color: apt.status === "Confirmed" ? "success.main" : "warning.main",
                      }}
                    >
                      <EventAvailable />
                    </Box>
                    <div className="appointment-item__info">
                      <h3 className="appointment-item__title">{apt.doctor}</h3>
                      <p className="appointment-item__details">
                        {apt.specialty} • {apt.date} at {apt.time}
                      </p>
                      <p className="appointment-item__details">{apt.type}</p>
                    </div>
                    <IconButton size="small">
                      <Message fontSize="small" />
                    </IconButton>
                  </div>
                ))}
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<EventAvailable />}
                  sx={{ mt: 2 }}
                  onClick={() => alert("Book new appointment")}
                >
                  Book New Appointment
                </Button>
              </div>
            </div>

            {/* Medical Records */}
            <div className="dashboard-card">
              <div className="dashboard-card__header">
                <h2 className="dashboard-card__title">Recent Medical Records</h2>
                <div className="dashboard-card__icon">
                  <Assignment />
                </div>
              </div>
              {MEDICAL_RECORDS.map((record) => (
                <div key={record.id} className="medical-record">
                  <div className="medical-record__icon">
                    <MedicalInformation />
                  </div>
                  <div className="medical-record__info">
                    <h3 className="medical-record__title">{record.type}</h3>
                    <p className="medical-record__date">
                      {record.date} • {record.doctor}
                    </p>
                  </div>
                  <Tooltip title="View details">
                    <IconButton size="small">
                      <Assignment fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </div>
              ))}
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Assignment />}
                sx={{ mt: 2 }}
                onClick={() => alert("View all records")}
              >
                View All Records
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="dashboard-card">
              <div className="dashboard-card__header">
                <h2 className="dashboard-card__title">Quick Actions</h2>
                <div className="dashboard-card__icon">
                  <AccessTime />
                </div>
              </div>
              <div className="quick-actions">
                <button className="quick-action-btn">
                  <LocalPharmacy className="quick-action-btn__icon" />
                  <span className="quick-action-btn__label">Prescriptions</span>
                </button>
                <button className="quick-action-btn">
                  <Payment className="quick-action-btn__icon" />
                  <span className="quick-action-btn__label">Pay Bills</span>
                </button>
                <button className="quick-action-btn">
                  <Message className="quick-action-btn__icon" />
                  <span className="quick-action-btn__label">Messages</span>
                </button>
                <button className="quick-action-btn">
                  <AccountCircle className="quick-action-btn__icon" />
                  <span className="quick-action-btn__label">Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}