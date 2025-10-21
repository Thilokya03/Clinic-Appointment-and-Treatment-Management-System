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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
  Alert,
  Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptIcon from '@mui/icons-material/Receipt';
import EventIcon from '@mui/icons-material/Event';
import './PatientBalance.css';

const PatientBalance = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [balanceDetails, setBalanceDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const getToken = () => localStorage.getItem('catms_token');

  // Search patients with balance
  const handleSearch = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = getToken();
      console.log('🔍 Searching patients with token:', token ? 'Token exists' : 'No token');
      console.log('🌐 Making request to:', `http://localhost:3000/api/patient/search?search=${searchTerm}`);
      
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
      
      console.log('✅ Search response:', response.data);
      setPatients(response.data);
      
      if (response.data.length === 0) {
        setError('No patients found matching your search.');
      }
    } catch (err) {
      console.error('❌ Error searching patients:', err);
      console.error('❌ Error response:', err.response);
      
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

  // Get detailed balance for a patient
  const handleViewDetails = async (patientId) => {
    setLoadingDetails(true);
    setDetailsOpen(true);
    
    try {
      const token = getToken();
      const response = await axios.get(
        `http://localhost:3000/api/patient/balance/${patientId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setBalanceDetails(response.data);
      setSelectedPatient(response.data.patient);
    } catch (err) {
      console.error('Error fetching balance details:', err);
      setError(err.response?.data?.error || 'Failed to fetch balance details');
      setDetailsOpen(false);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setBalanceDetails(null);
    setSelectedPatient(null);
  };

  // Navigate to appointment booking page with patient ID
  const handleBookAppointment = (patient) => {
    console.log('📅 Booking appointment for patient:', patient.patient_id);
    // Navigate to SetAppointment page with patient data in state
    navigate('/dashboard/setappointment', { 
      state: { 
        patientId: patient.patient_id,
        patientName: patient.name,
        patientPhone: patient.phone_no,
        preSelected: true
      } 
    });
  };

  const getBalanceColor = (outstanding) => {
    const amount = parseFloat(outstanding);
    if (amount === 0) return 'success';
    if (amount > 0) return 'error';
    return 'warning';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'success';
      case 'Partial':
        return 'warning';
      case 'Pending':
        return 'error';
      case 'Voided':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Box className="patient-balance-container" sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Patient Balance Search
      </Typography>

      {/* Search Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Search Patient"
                placeholder="Enter patient ID, name, phone, or NIC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={4}>
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

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Results Table */}
      {patients.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Patient ID</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Phone</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell align="right"><strong>Total Billed</strong></TableCell>
                <TableCell align="right"><strong>Total Paid</strong></TableCell>
                <TableCell align="right"><strong>Outstanding</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((patient) => (
                <TableRow 
                  key={patient.patient_id}
                  hover
                >
                  <TableCell>{patient.patient_id}</TableCell>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.phone_no}</TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell align="right">
                    LKR {parseFloat(patient.total_billed || 0).toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    LKR {parseFloat(patient.total_paid || 0).toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={`LKR ${parseFloat(patient.total_outstanding || 0).toFixed(2)}`}
                      color={getBalanceColor(patient.total_outstanding)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Tooltip title="View payment details and history">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleViewDetails(patient.patient_id)}
                        >
                          View Details
                        </Button>
                      </Tooltip>
                      <Tooltip title="Book an appointment for this patient">
                        <Button
                          variant="contained"
                          size="small"
                          color="success"
                          startIcon={<EventIcon />}
                          onClick={() => handleBookAppointment(patient)}
                        >
                          Book Appointment
                        </Button>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Balance Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5">
            <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Patient Balance Details
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {loadingDetails ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : balanceDetails ? (
            <>
              {/* Patient Info */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Patient Information</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" color="text.secondary">Patient ID</Typography>
                      <Typography variant="body1"><strong>{balanceDetails.patient.patient_id}</strong></Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" color="text.secondary">Name</Typography>
                      <Typography variant="body1"><strong>{balanceDetails.patient.name}</strong></Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" color="text.secondary">Phone</Typography>
                      <Typography variant="body1">{balanceDetails.patient.phone_no}</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" color="text.secondary">Email</Typography>
                      <Typography variant="body1">{balanceDetails.patient.email}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Summary */}
              <Card sx={{ mb: 3, bgcolor: 'primary.light', color: 'white' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Financial Summary</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <AttachMoneyIcon fontSize="large" />
                        <Typography variant="h6">LKR {balanceDetails.summary.total_billed}</Typography>
                        <Typography variant="body2">Total Billed</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <ReceiptIcon fontSize="large" />
                        <Typography variant="h6">LKR {balanceDetails.summary.total_paid}</Typography>
                        <Typography variant="body2">Total Paid</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <AttachMoneyIcon fontSize="large" />
                        <Typography variant="h6" sx={{ color: parseFloat(balanceDetails.summary.total_outstanding) > 0 ? 'error.light' : 'success.light' }}>
                          LKR {balanceDetails.summary.total_outstanding}
                        </Typography>
                        <Typography variant="body2">Outstanding</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <ReceiptIcon fontSize="large" />
                        <Typography variant="h6">{balanceDetails.summary.number_of_payments}</Typography>
                        <Typography variant="body2">Total Payments</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Payment History */}
              <Typography variant="h6" gutterBottom>Payment History</Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Payment ID</strong></TableCell>
                      <TableCell><strong>Appointment ID</strong></TableCell>
                      <TableCell><strong>Date</strong></TableCell>
                      <TableCell align="right"><strong>Total</strong></TableCell>
                      <TableCell align="right"><strong>Insurance</strong></TableCell>
                      <TableCell align="right"><strong>Patient</strong></TableCell>
                      <TableCell align="right"><strong>Discount</strong></TableCell>
                      <TableCell align="right"><strong>Due</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell><strong>Invoice</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {balanceDetails.payments.map((payment) => (
                      <TableRow key={payment.payment_id}>
                        <TableCell>{payment.payment_id}</TableCell>
                        <TableCell>{payment.appointment_id}</TableCell>
                        <TableCell>{new Date(payment.appointment_date).toLocaleDateString()}</TableCell>
                        <TableCell align="right">LKR {parseFloat(payment.total_amount).toFixed(2)}</TableCell>
                        <TableCell align="right">LKR {parseFloat(payment.insurance_paid_amount || 0).toFixed(2)}</TableCell>
                        <TableCell align="right">LKR {parseFloat(payment.patient_paid_amount || 0).toFixed(2)}</TableCell>
                        <TableCell align="right">LKR {parseFloat(payment.discount_amount || 0).toFixed(2)}</TableCell>
                        <TableCell align="right">
                          <strong>LKR {parseFloat(payment.Due_payment || 0).toFixed(2)}</strong>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={payment.status}
                            color={getStatusColor(payment.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {payment.invoice_id ? (
                            <Chip
                              label={`${payment.invoice_id} (LKR ${parseFloat(payment.invoice_amount).toFixed(2)})`}
                              color="primary"
                              size="small"
                              variant="outlined"
                            />
                          ) : (
                            <Typography variant="body2" color="text.secondary">-</Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientBalance;
