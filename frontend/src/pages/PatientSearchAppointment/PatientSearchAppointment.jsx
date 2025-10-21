import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Grid,
  Alert,
  Tooltip,
  Avatar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import './PatientSearchAppointment.css';

const PatientSearchAppointment = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getToken = () => localStorage.getItem('catms_token');

  // Search patients
  const handleSearch = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const token = getToken();
      console.log('🔍 Searching patients for appointment booking...');
      
      if (!token) {
        setError('Authentication required. Please log in again.');
        setLoading(false);
        return;
      }
      
      const response = await axios.get(
        `http://localhost:3000/api/patient/search?search=${searchTerm}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      console.log('✅ Found patients:', response.data.length);
      setPatients(response.data);
      
      if (response.data.length === 0) {
        setError('No patients found matching your search. Try searching by ID, name, phone, or NIC.');
      } else {
        setSuccess(`Found ${response.data.length} patient${response.data.length > 1 ? 's' : ''}. Click "Book Appointment" to schedule.`);
      }
    } catch (err) {
      console.error('❌ Error searching patients:', err);
      
      if (err.response?.status === 404) {
        setError('Search endpoint not found. Please ensure the backend server is running.');
      } else if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else if (err.response?.status === 403) {
        setError('Access denied. You do not have permission to access this feature.');
      } else {
        setError(err.response?.data?.error || 'Failed to search patients. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Load all patients on mount
  useEffect(() => {
    handleSearch();
  }, []);

  // Navigate to appointment booking with pre-filled patient data
  const handleBookAppointment = (patient) => {
    console.log('📅 Redirecting to appointment booking for patient:', patient.patient_id);
    
    navigate('/dashboard/setappointment', { 
      state: { 
        patientId: patient.patient_id,
        patientName: patient.name,
        patientPhone: patient.phone_no,
        patientEmail: patient.email,
        preSelected: true
      } 
    });
  };

  const getGenderColor = (gender) => {
    if (gender?.toLowerCase() === 'male') return '#1976d2';
    if (gender?.toLowerCase() === 'female') return '#d32f2f';
    return '#757575';
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Box className="patient-search-appointment-container" sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <EventIcon sx={{ mr: 1, fontSize: 40 }} />
        Search Patient for Appointment
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Search for a patient by ID, name, phone number, or NIC to book an appointment.
      </Typography>

      {/* Search Section */}
      <Card sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={9}>
              <TextField
                fullWidth
                label="Search Patient"
                placeholder="Enter patient ID, name, phone number, or NIC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                variant="outlined"
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSearch}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                sx={{ height: 56 }}
              >
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Success Alert */}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Results Table */}
      {patients.length > 0 && (
        <Card sx={{ boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Search Results ({patients.length} patient{patients.length > 1 ? 's' : ''})
            </Typography>
            
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><strong>Patient</strong></TableCell>
                    <TableCell><strong>Patient ID</strong></TableCell>
                    <TableCell><strong>Contact</strong></TableCell>
                    <TableCell><strong>Gender</strong></TableCell>
                    <TableCell><strong>Age</strong></TableCell>
                    <TableCell align="center"><strong>Action</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow 
                      key={patient.patient_id}
                      hover
                      sx={{ 
                        '&:hover': { backgroundColor: '#f0f7ff' },
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: getGenderColor(patient.gender),
                              width: 45,
                              height: 45,
                              fontWeight: 'bold'
                            }}
                          >
                            {getInitials(patient.name)}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {patient.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {patient.nic || 'NIC not provided'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          icon={<BadgeIcon />}
                          label={patient.patient_id} 
                          size="small" 
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            {patient.phone_no}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <EmailIcon sx={{ fontSize: 14 }} />
                            {patient.email || 'No email'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={patient.gender || 'N/A'} 
                          size="small"
                          sx={{ 
                            backgroundColor: getGenderColor(patient.gender) + '20',
                            color: getGenderColor(patient.gender),
                            fontWeight: 600
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {patient.age ? `${patient.age} years` : 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title={`Book appointment for ${patient.name}`}>
                          <Button
                            variant="contained"
                            size="medium"
                            color="success"
                            startIcon={<EventIcon />}
                            onClick={() => handleBookAppointment(patient)}
                            sx={{ 
                              fontWeight: 600,
                              boxShadow: 2,
                              '&:hover': {
                                boxShadow: 4,
                                transform: 'translateY(-2px)',
                                transition: 'all 0.2s'
                              }
                            }}
                          >
                            Book Appointment
                          </Button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* No Results Message */}
      {!loading && patients.length === 0 && !error && (
        <Card sx={{ textAlign: 'center', py: 8, boxShadow: 1 }}>
          <CardContent>
            <PersonIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Patients Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try searching with a different term or view all patients by clicking Search without entering anything.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default PatientSearchAppointment;
