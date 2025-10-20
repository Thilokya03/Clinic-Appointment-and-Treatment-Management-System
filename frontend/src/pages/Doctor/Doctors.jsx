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
      const transformedDoctors = response.data.map((doctor, index) => ({
        id: doctor.staff_id,
        image: `https://images.unsplash.com/photo-${getRandomDoctorImage(index)}?w=640`,
        name: doctor.name,
        specialty: doctor.speciality,
        category: doctor.speciality,
        bio: `Expert ${doctor.speciality} specialist providing comprehensive care.`,
        rating: (4.5 + Math.random() * 0.4).toFixed(1),
        reviews: Math.floor(100 + Math.random() * 150),
        experience: Math.floor(5 + Math.random() * 15),
        languages: ["English", "Sinhala"],
        location: doctor.branch_name || "Main Branch",
        nextAvailable: getRandomAvailability(),
        consultationFee: `LKR ${(2500 + Math.floor(Math.random() * 2000)).toLocaleString()}`,
        patientsServed: Math.floor(1000 + Math.random() * 4000),
        services: [doctor.speciality, "Consultation"],
        acceptingNewPatients: Math.random() > 0.3,
        url: `/appointmentsbook?doctor=${doctor.staff_id}`,
        phone: doctor.phone_no,
        email: doctor.email,
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

  // Helper function to get random doctor images
  const getRandomDoctorImage = (index) => {
    const imageIds = [
      '1612349317150-e413f6a5b16d',
      '1559839734-2b71ea197ec2',
      '1591604021695-0c69b7c05981',
      '1582750433449-648ed127bb54',
      '1537368910025-700350fe46c7',
      '1551601651-2a8555f1a136',
    ];
    return imageIds[index % imageIds.length];
  };

  // Helper function to generate random availability
  const getRandomAvailability = () => {
    const days = ['Today', 'Tomorrow', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const randomDay = days[Math.floor(Math.random() * days.length)];
    const hours = Math.floor(Math.random() * 12) + 1;
    const minutes = ['00', '15', '30', '45'][Math.floor(Math.random() * 4)];
    const period = Math.random() > 0.5 ? 'AM' : 'PM';
    return `${randomDay} - ${hours}:${minutes} ${period}`;
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

