import React, { useState } from 'react'
import './doctors.css'
import DoctorCard from '../../compornent/DoctorCard/DoctorCard'
import {
  TextField,
  MenuItem,
  Box,
  InputAdornment,
  Container,
  Typography
} from '@mui/material'
import { Search, Person, MedicalServices } from '@mui/icons-material'

const Doctors = () => {
  const [searchType, setSearchType] = useState('name') // 'name' or 'specialty'
  const [searchQuery, setSearchQuery] = useState('')

  // Mock doctors data - replace with your actual data
  const doctors = [
    {
      id: 1,
      img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
      name: 'Dr. Aisha Fernando',
      specialty: 'Cardiology'
    },
    {
      id: 2,
      img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
      name: 'Dr. Kamal Silva',
      specialty: 'Neurology'
    },
    {
      id: 3,
      img: 'https://images.unsplash.com/photo-1591604021695-0c69b7c05981?w=400',
      name: 'Dr. Nimal Perera',
      specialty: 'Pediatrics'
    },
    {
      id: 4,
      img: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400',
      name: 'Dr. Sunil Rathnayake',
      specialty: 'Dermatology'
    },
    {
      id: 5,
      img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400',
      name: 'Dr. Priya Bandara',
      specialty: 'Cardiology'
    },
    {
      id: 6,
      img: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400',
      name: 'Dr. Rajitha Gunawardena',
      specialty: 'Orthopedics'
    }
  ]

  // Filter doctors based on search
  const filteredDoctors = doctors.filter(doctor => {
    if (!searchQuery.trim()) return true
    
    if (searchType === 'name') {
      return doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
    } else {
      return doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    }
  })

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value)
    setSearchQuery('') // Clear search when changing type
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
  }

  return (
    <div className='doctors-container'>
      <Container maxWidth="lg">
        {/* Header */}
        <Typography variant="h3" component="h1" className='doctors-title'>
          Our Doctors
        </Typography>
        <Typography variant="h6" component="p" className='doctors-subtitle'>
          Find and book appointments with our specialist doctors
        </Typography>

        {/* Search Section */}
        <Box className="search-section">
          <Box className="search-controls">
            <TextField
              select
              label="Search By"
              value={searchType}
              onChange={handleSearchTypeChange}
              className="search-type-select"
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="name">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person fontSize="small" />
                  Name
                </Box>
              </MenuItem>
              <MenuItem value="specialty">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MedicalServices fontSize="small" />
                  Specialty
                </Box>
              </MenuItem>
            </TextField>

            <TextField
              fullWidth
              placeholder={searchType === 'name' 
                ? "Search by doctor's name..." 
                : "Search by specialty..."
              }
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>

        {/* Results Count */}
        <Typography variant="body1" className='results-count'>
          Showing {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''}
          {searchQuery && ` for "${searchQuery}"`}
        </Typography>

        {/* Doctors Grid */}
        <div className='doctors-grid'>
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map(doctor => (
              <DoctorCard
                key={doctor.id}
                img={doctor.img}
                name={doctor.name}
                specialty={doctor.specialty}
                url={`/doctor/${doctor.id}`} // You can update this URL as needed
              />
            ))
          ) : (
            <Box className="no-results">
              <Typography variant="h6" color="text.secondary">
                No doctors found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search criteria
              </Typography>
            </Box>
          )}
        </div>
      </Container>
    </div>
  )
}

export default Doctors