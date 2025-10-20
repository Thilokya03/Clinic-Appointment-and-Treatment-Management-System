import { useMemo, useState } from "react";
import "./patient.css";
import PatientCard from "../../compornent/PatientCard/PatientCard"; 
import {
  TextField,
  MenuItem,
  Box,
  InputAdornment,
  Container,
  Typography,
} from "@mui/material";
import { Search, Person, CalendarToday } from "@mui/icons-material";

const PATIENTS = [
  {
    id: "PAT-1001",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    name: "Samantha Perera",
    age: 28,
    gender: "Female",
    phone: "+94 77 123 4567",
    email: "samantha@example.com",
    lastVisit: "2025-10-01",
    upcomingAppointment: "2025-10-20",
    doctor: "Dr. Aisha Fernando",
    status: "Active",
    url: "/patientdetails?patient=PAT-1001",
  },
  {
    id: "PAT-1002",
    image: "https://randomuser.me/api/portraits/men/52.jpg",
    name: "Nuwan Silva",
    age: 35,
    gender: "Male",
    phone: "+94 77 234 5678",
    email: "nuwan@example.com",
    lastVisit: "2025-09-25",
    upcomingAppointment: "2025-10-22",
    doctor: "Dr. Kamal Silva",
    status: "Active",
    url: "/patientdetails?patient=PAT-1002",
  },
  // Add more patient objects here
];

export default function Patients() {
  const [searchType, setSearchType] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
    setSearchQuery("");
  };

  const filteredPatients = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return PATIENTS.filter((patient) => {
      if (!query) return true;
      if (searchType === "name") return patient.name.toLowerCase().includes(query);
      if (searchType === "doctor") return patient.doctor.toLowerCase().includes(query);
      return true;
    });
  }, [searchQuery, searchType]);

  return (
    <div className="patient-container">
      <Container maxWidth="xl" className="patient-shell">
        <header>
          <Typography variant="h3" component="h1" className="patient-title">
            Our Patients
          </Typography>
          <Typography variant="h6" component="p" className="patient-subtitle">
            Manage patient records and upcoming appointments.
          </Typography>
        </header>

        <Box className="search-section" component="section">
          <Box className="search-controls">
            <TextField
              select
              label="Search by"
              value={searchType}
              onChange={handleSearchTypeChange}
              size="medium"
            >
              <MenuItem value="name">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Person fontSize="small" />
                  Name
                </Box>
              </MenuItem>
              <MenuItem value="doctor">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarToday fontSize="small" />
                  Doctor
                </Box>
              </MenuItem>
            </TextField>

            <TextField
              fullWidth
              placeholder={searchType === "name" ? "Search by patient's name" : "Search by doctor"}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="search-input"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              size="medium"
            />
          </Box>
        </Box>

        <Typography variant="body1" className="results-count">
          Showing {filteredPatients.length} patient{filteredPatients.length !== 1 ? "s" : ""}
          {searchQuery && ` for "${searchQuery}"`}
        </Typography>

        <div className="patients-grid">
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))
          ) : (
            <Box className="no-results">
              <Typography variant="h6" color="text.primary">
                No patients found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search criteria.
              </Typography>
            </Box>
          )}
        </div>
      </Container>
    </div>
  );
}
