import { useMemo, useState } from "react";
import "./doctors.css";
import DoctorCard from "../../compornent/DoctorCard/DoctorCard";
import {
  TextField,
  MenuItem,
  Box,
  InputAdornment,
  Container,
  Typography,
} from "@mui/material";
import { Search, Person, MedicalServices } from "@mui/icons-material";

const DOCTORS = [
  {
    id: "DOC-1001",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=640",
    name: "Dr. Aisha Fernando",
    specialty: "Consultant Cardiologist",
    category: "Cardiology",
    bio: "Heart health specialist focused on preventive cardiology and minimally invasive care.",
    rating: 4.9,
    reviews: 178,
    experience: 14,
    languages: ["English", "Sinhala"],
    location: "National Hospital, Colombo",
    nextAvailable: "Today - 04:30 PM",
    consultationFee: "LKR 3,500",
    patientsServed: 3200,
    services: ["ECG review", "Heart screening"],
    acceptingNewPatients: true,
    url: "/appointmentsbook?doctor=DOC-1001",
  },
  {
    id: "DOC-1002",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=640",
    name: "Dr. Kamal Silva",
    specialty: "Consultant Neurologist",
    category: "Neurology",
    bio: "Expert in neurodegenerative disorders, stroke rehabilitation and long-term support.",
    rating: 4.8,
    reviews: 142,
    experience: 12,
    languages: ["English", "Sinhala", "Tamil"],
    location: "Asiri Central Hospital, Colombo",
    nextAvailable: "Tomorrow - 09:15 AM",
    consultationFee: "LKR 4,200",
    patientsServed: 2700,
    services: ["EEG assessment", "Stroke clinic"],
    acceptingNewPatients: true,
    url: "/appointmentsbook?doctor=DOC-1002",
  },
  {
    id: "DOC-1003",
    image: "https://images.unsplash.com/photo-1591604021695-0c69b7c05981?w=640",
    name: "Dr. Nimal Perera",
    specialty: "Senior Consultant Pediatrician",
    category: "Pediatrics",
    bio: "Trusted child specialist offering compassionate care for newborns to teenagers.",
    rating: 4.7,
    reviews: 201,
    experience: 18,
    languages: ["English", "Sinhala"],
    location: "Lady Ridgeway Hospital, Colombo",
    nextAvailable: "Tomorrow - 11:00 AM",
    consultationFee: "LKR 2,900",
    patientsServed: 5100,
    services: ["Well-baby clinic", "Immunisation"],
    acceptingNewPatients: false,
    url: "/appointmentsbook?doctor=DOC-1003",
  },
  {
    id: "DOC-1004",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=640",
    name: "Dr. Sunil Rathnayake",
    specialty: "Consultant Dermatologist",
    category: "Dermatology",
    bio: "Advanced dermatology and laser therapist specialising in chronic skin conditions.",
    rating: 4.9,
    reviews: 156,
    experience: 11,
    languages: ["English", "Sinhala"],
    location: "Nawaloka Hospital, Colombo",
    nextAvailable: "Fri - 02:45 PM",
    consultationFee: "LKR 3,200",
    patientsServed: 2200,
    services: ["Skin screening", "Laser therapy"],
    acceptingNewPatients: true,
    url: "/appointmentsbook?doctor=DOC-1004",
  },
  {
    id: "DOC-1005",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=640",
    name: "Dr. Priya Bandara",
    specialty: "Consultant Obstetrician & Gynecologist",
    category: "Gynecology",
    bio: "Holistic women's health consultant with focus on high-risk pregnancies.",
    rating: 4.8,
    reviews: 189,
    experience: 15,
    languages: ["English", "Sinhala"],
    location: "Ninewells Hospital, Colombo",
    nextAvailable: "Sat - 09:30 AM",
    consultationFee: "LKR 3,800",
    patientsServed: 3400,
    services: ["Prenatal care", "Fertility clinic"],
    acceptingNewPatients: true,
    url: "/appointmentsbook?doctor=DOC-1005",
  },
  {
    id: "DOC-1006",
    image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=640",
    name: "Dr. Rajitha Gunawardena",
    specialty: "Consultant Orthopedic Surgeon",
    category: "Orthopedics",
    bio: "Specialises in sports injuries, joint replacements and minimally invasive surgery.",
    rating: 4.6,
    reviews: 134,
    experience: 13,
    languages: ["English", "Sinhala"],
    location: "Lanka Hospitals, Colombo",
    nextAvailable: "Mon - 08:45 AM",
    consultationFee: "LKR 4,000",
    patientsServed: 2950,
    services: ["Sports clinic", "Joint replacement"],
    acceptingNewPatients: false,
    url: "/appointmentsbook?doctor=DOC-1006",
  },
];

export default function Doctors() {
  const [searchType, setSearchType] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");

  const specialtyOptions = useMemo(() => {
    const unique = new Set(DOCTORS.map((doctor) => doctor.category));
    return ["all", ...Array.from(unique)];
  }, []);

  const filteredDoctors = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return DOCTORS.filter((doctor) => {
      const matchesQuery = !query
        || (searchType === "name"
          ? doctor.name.toLowerCase().includes(query)
          : `${doctor.specialty} ${doctor.category}`.toLowerCase().includes(query));

      const matchesSpecialty = specialtyFilter === "all"
        || doctor.category === specialtyFilter;

      return matchesQuery && matchesSpecialty;
    });
  }, [searchQuery, searchType, specialtyFilter]);

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
            Trusted doctors across cardiology, neurology, pediatrics, dermatology and more.
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
      </Container>
    </div>
  );
}

