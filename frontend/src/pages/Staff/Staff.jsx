import { useMemo, useState } from "react";
import "./staff.css";
import {
  TextField,
  MenuItem,
  Box,
  InputAdornment,
  Container,
  Typography,
  Button,
  Chip,
} from "@mui/material";
import {
  Search,
  Person,
  LocationOn,
  Phone,
  Email,
  AccessTime,
  EventAvailable,
} from "@mui/icons-material";

const STAFF = [
  {
    id: "STF-1001",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=640",
    name: "Sarah Perera",
    role: "Senior Receptionist",
    department: "Front Desk",
    location: "Main Building",
    phone: "+94 71 234 5678",
    email: "sarah.p@clinic.lk",
    shift: "Morning",
    schedule: "Mon-Fri, 8:00 AM - 4:00 PM",
    specialization: ["Patient Registration", "Appointment Management"],
    experience: 5,
  },
  {
    id: "STF-1002",
    image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=640",
    name: "Kumar Rajapakse",
    role: "Lab Technician",
    department: "Laboratory",
    location: "Lab Complex",
    phone: "+94 77 345 6789",
    email: "kumar.r@clinic.lk",
    shift: "Rotating",
    schedule: "Variable Shifts",
    specialization: ["Blood Analysis", "Sample Collection"],
    experience: 7,
  },
  {
    id: "STF-1003",
    image: "https://images.unsplash.com/photo-1543486958-d783bfbf7f8e?w=640",
    name: "Anita Silva",
    role: "Pharmacy Assistant",
    department: "Pharmacy",
    location: "Ground Floor",
    phone: "+94 76 456 7890",
    email: "anita.s@clinic.lk",
    shift: "Evening",
    schedule: "Tue-Sat, 2:00 PM - 10:00 PM",
    specialization: ["Medication Dispensing", "Inventory Management"],
    experience: 3,
  },
  {
    id: "STF-1004",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=640",
    name: "Malik Fernando",
    role: "IT Support Specialist",
    department: "IT Department",
    location: "Admin Wing",
    phone: "+94 75 567 8901",
    email: "malik.f@clinic.lk",
    shift: "Day",
    schedule: "Mon-Fri, 9:00 AM - 5:00 PM",
    specialization: ["System Maintenance", "Technical Support"],
    experience: 4,
  },
];

export default function Staff() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const departments = useMemo(
    () => ["all", ...new Set(STAFF.map((staff) => staff.department))],
    []
  );

  const filteredStaff = useMemo(() => {
    return STAFF.filter((staff) => {
      const matchesSearch = staff.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesDepartment =
        departmentFilter === "all" ||
        staff.department.toLowerCase() === departmentFilter.toLowerCase();
      return matchesSearch && matchesDepartment;
    });
  }, [searchTerm, departmentFilter]);

  return (
    <main className="staff-container">
      <Container maxWidth="xl">
        <div className="staff-shell">
          <div>
            <Typography variant="h1" className="staff-title">
              Our Staff
            </Typography>
            <Typography className="staff-subtitle">
              Meet our dedicated non-medical staff members who keep our clinic running smoothly
            </Typography>
          </div>

          <Box className="staff-section">
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", md: "row" },
                mb: 4,
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search staff by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                select
                variant="outlined"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                sx={{ minWidth: { xs: "100%", md: 200 } }}
              >
                {departments.map((dept) => (
                  <MenuItem
                    key={dept}
                    value={dept}
                    sx={{ textTransform: "capitalize" }}
                  >
                    {dept === "all" ? "All Departments" : dept}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <div className="staff-grid">
              {filteredStaff.map((staff) => (
                <div key={staff.id} className="staff-card">
                  <div className="staff-card__header">
                    <img
                      src={staff.image}
                      alt={staff.name}
                      className="staff-card__avatar"
                    />
                    <div className="staff-card__info">
                      <h3 className="staff-card__name">{staff.name}</h3>
                      <p className="staff-card__role">{staff.role}</p>
                    </div>
                  </div>

                  <div className="staff-card__details">
                    <div className="staff-card__detail">
                      <Person fontSize="small" />
                      <span>{staff.department}</span>
                    </div>
                    <div className="staff-card__detail">
                      <LocationOn fontSize="small" />
                      <span>{staff.location}</span>
                    </div>
                    <div className="staff-card__detail">
                      <AccessTime fontSize="small" />
                      <span>{staff.schedule}</span>
                    </div>
                    <Box sx={{ mt: 1 }}>
                      {staff.specialization.map((spec) => (
                        <Chip
                          key={spec}
                          label={spec}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<EventAvailable />}
                      sx={{ mt: 1 }}
                      onClick={() => alert(`Contact ${staff.name}`)}
                    >
                      Contact
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Box>
        </div>
      </Container>
    </main>
  );
}