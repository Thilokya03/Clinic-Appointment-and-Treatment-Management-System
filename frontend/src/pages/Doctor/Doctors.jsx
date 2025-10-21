import { useMemo, useState, useEffect } from "react";
import "./doctors.css";
import DoctorCard from "../../compornent/DoctorCard/DoctorCard";
import {
  TextField,
  MenuItem,
  Box,
  InputAdornment,
  Container,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Search, Person, MedicalServices } from "@mui/icons-material";
import axios from "axios";
import MALE_DOCTOR_ICON from "../../../public/male-doctor.png";
import FEMALE_DOCTOR_ICON from "../../../public/female-doctor.png";


export default function Doctors() {
  const [searchType, setSearchType] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch doctors from backend
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/staff/doctors');
      
      // Transform backend data to match frontend format
      const transformedDoctors = response.data.map((doctor) => ({
        id: doctor.staff_id,
        image: doctor.gender === 'Female' ? FEMALE_DOCTOR_ICON : MALE_DOCTOR_ICON,
        name: doctor.name,
        specialty: doctor.speciality,
        category: doctor.speciality,
        bio: `Expert ${doctor.speciality} specialist providing comprehensive care.`,
        location: doctor.branch_name || "Main Branch",
        services: [doctor.speciality, "Consultation"],
        phone: doctor.phone_no,
        email: doctor.email,
        gender: doctor.gender,
      }));

      setDoctors(transformedDoctors);
      setError(null);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to load doctors. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const specialtyOptions = useMemo(() => {
    const unique = new Set(doctors.map((doctor) => doctor.category));
    return ["all", ...Array.from(unique)];
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return doctors.filter((doctor) => {
      const matchesQuery = !query
        || (searchType === "name"
          ? doctor.name.toLowerCase().includes(query)
          : `${doctor.specialty} ${doctor.category}`.toLowerCase().includes(query));

      const matchesSpecialty = specialtyFilter === "all"
        || doctor.category === specialtyFilter;

      return matchesQuery && matchesSpecialty;
    });
  }, [searchQuery, searchType, specialtyFilter, doctors]);

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
    setSearchQuery("");
  };

  return (
    <div className="doctors-container">
      <Container maxWidth="xl" className="doctors-shell">
        <header>
          <Typography variant="h3" component="h1" className="doctors-title">
            Our Specialists
          </Typography>
          <Typography variant="h6" component="p" className="doctors-subtitle">
            Trusted doctors across various specialties providing expert care.
          </Typography>
        </header>

        <Box className="search-section" component="section">
          <Box className="search-controls">
            <TextField
              select
              label="Search by"
              value={searchType}
              onChange={handleSearchTypeChange}
              className="search-type-select"
              size="medium"
            >
              <MenuItem value="name">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Person fontSize="small" />
                  Name
                </Box>
              </MenuItem>
              <MenuItem value="specialty">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <MedicalServices fontSize="small" />
                  Specialty
                </Box>
              </MenuItem>
            </TextField>

            <TextField
              select
              label="Specialty"
              value={specialtyFilter}
              onChange={(event) => setSpecialtyFilter(event.target.value)}
              className="search-type-select"
              size="medium"
            >
              {specialtyOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option === "all" ? "All specialties" : option}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              placeholder={searchType === "name"
                ? "Search by doctor's name"
                : "Search by specialty or expertise"
              }
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

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress size={60} />
          </Box>
        ) : error ? (
          <Box className="no-results">
            <Typography variant="h6" color="error">
              {error}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Please check your connection and try again.
            </Typography>
          </Box>
        ) : (
          <>
            <Typography variant="body1" className="results-count">
              Showing {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? "s" : ""}
              {searchQuery && ` for "${searchQuery}"`}
              {specialtyFilter !== "all" && ` in ${specialtyFilter}`}
            </Typography>

            <div className="doctors-grid">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))
              ) : (
                <Box className="no-results">
                  <Typography variant="h6" color="text.primary">
                    No doctors found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your search criteria or choose another specialty.
                  </Typography>
                </Box>
              )}
            </div>
          </>
        )}
      </Container>
    </div>
  );
}

