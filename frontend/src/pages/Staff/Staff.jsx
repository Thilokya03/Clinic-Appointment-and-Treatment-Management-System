// src/pages/Staff/Staff.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  PersonAdd,
  Payment,
  MedicalServices,
  Schedule,
  Business,
  LocalHospital,
  Add,
  Delete,
} from '@mui/icons-material';
import './staff.css';

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const StaffPage = () => {
  const theme = useTheme();
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);

  // Form States
  const [patientForm, setPatientForm] = useState({
    username: '',
    name: '',
    phone_no: '',
    gender: '',
    age: '',
    nic: '',
    email: '',
    password: ''
  });

  const [treatmentForm, setTreatmentForm] = useState({
    treatment_id: '',
    catalog_id: '',
    appointment_id: '',
    description: ''
  });

  const [insuranceForm, setInsuranceForm] = useState({
    name: '',
    coverage_type: '',
    phone_no: ''
  });

  const [treatmentCatalogForm, setTreatmentCatalogForm] = useState({
    treatment_name: '',
    treatment_fee: ''
  });

  const [paymentForm, setPaymentForm] = useState({
    payment_id: '',
    insurance_paid_amount: '',
    patient_paid_amount: '',
    discount_amount: '',
    status: 'Pending',
    appointment_id: '',
    patient_id: ''
  });

  const [scheduleForm, setScheduleForm] = useState({
    staff_id: '',
    branch_id: '',
    schedule_date: '',
    start_time: '',
    end_time: '',
    max_patients: '10',
    fee: '0.00',
    notes: ''
  });

  // Data States
  const [patients, setPatients] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [insuranceCompanies, setInsuranceCompanies] = useState([]);
  const [treatmentCatalog, setTreatmentCatalog] = useState([]);
  const [payments, setPayments] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [branches, setBranches] = useState([]);
  
  // Treatment workflow states
  const [patientSearch, setPatientSearch] = useState('');
  const [searchedPatients, setSearchedPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientAppointments, setPatientAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [filteredCatalog, setFilteredCatalog] = useState([]);

  // API Base URL
  const API_URL = 'http://localhost:3000/api';

  // Get token from localStorage
  const getToken = () => localStorage.getItem('catms_token');

  // Fetch data on component mount
  useEffect(() => {
    fetchInsuranceCompanies();
    fetchTreatmentCatalog();
    fetchDoctorSchedules();
    fetchDoctors();
    fetchBranches();
  }, []);

  // Fetch Insurance Companies
  const fetchInsuranceCompanies = async () => {
    try {
      const response = await axios.get(`${API_URL}/insurance`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setInsuranceCompanies(response.data);
    } catch (error) {
      console.error('Error fetching insurance companies:', error);
      showToast('Error fetching insurance companies', 'error');
    }
  };

  // Fetch Treatment Catalog
  const fetchTreatmentCatalog = async () => {
    try {
      const response = await axios.get(`${API_URL}/treatment-catalog`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setTreatmentCatalog(response.data);
    } catch (error) {
      console.error('Error fetching treatment catalog:', error);
      showToast('Error fetching treatment catalog', 'error');
    }
  };

  // Fetch Doctor Schedules
  const fetchDoctorSchedules = async () => {
    try {
      const response = await axios.get(`${API_URL}/doctor-schedule`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setSchedules(response.data);
    } catch (error) {
      console.error('Error fetching doctor schedules:', error);
      showToast('Error fetching doctor schedules', 'error');
    }
  };

  // Fetch Doctors
  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`${API_URL}/staff/doctors`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      showToast('Error fetching doctors', 'error');
    }
  };

  // Fetch Branches
  const fetchBranches = async () => {
    try {
      const response = await axios.get(`${API_URL}/branch`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setBranches(response.data);
    } catch (error) {
      console.error('Error fetching branches:', error);
      showToast('Error fetching branches', 'error');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const openAddDialog = (type) => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const handlePatientInputChange = (field) => (event) => {
    setPatientForm(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleTreatmentInputChange = (field) => (event) => {
    setTreatmentForm(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleInsuranceInputChange = (field) => (event) => {
    setInsuranceForm(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleTreatmentCatalogInputChange = (field) => (event) => {
    setTreatmentCatalogForm(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handlePaymentInputChange = (field) => (event) => {
    setPaymentForm(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleScheduleInputChange = (field) => (event) => {
    const value = event.target.value;
    
    // Auto-populate branch_id when doctor (staff_id) is selected
    if (field === 'staff_id') {
      const selectedDoctor = doctors.find(doc => doc.staff_id === value);
      setScheduleForm(prev => ({ 
        ...prev, 
        staff_id: value,
        branch_id: selectedDoctor?.branch_id || '' 
      }));
    } else {
      setScheduleForm(prev => ({ ...prev, [field]: value }));
    }
  };

  // Add Patient
  const addPatient = async () => {
    if (!patientForm.username || !patientForm.name || !patientForm.email || !patientForm.password) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/patient/signup`, patientForm);
      showToast('Patient added successfully!', 'success');
      setPatientForm({
        username: '',
        name: '',
        phone_no: '',
        gender: '',
        age: '',
        nic: '',
        email: '',
        password: ''
      });
      setOpenDialog(false);
    } catch (error) {
      console.error('Error adding patient:', error);
      showToast(error.response?.data?.error || 'Error adding patient', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Add Treatment
  const addTreatment = async () => {
    if (!selectedAppointment || !treatmentForm.catalog_id) {
      showToast('Please select an appointment and a treatment', 'error');
      return;
    }

    setLoading(true);
    try {
      const treatmentData = {
        treatment_id: treatmentForm.treatment_id || `T${Date.now()}`,
        catalog_id: treatmentForm.catalog_id,
        appointment_id: selectedAppointment.appointment_id,
        description: treatmentForm.description
      };
      
      await axios.post(`${API_URL}/treatment`, treatmentData, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      showToast('Treatment added successfully!', 'success');
      
      // Reset all treatment workflow states
      setTreatmentForm({
        treatment_id: '',
        catalog_id: '',
        appointment_id: '',
        description: ''
      });
      setPatientSearch('');
      setSearchedPatients([]);
      setSelectedPatient(null);
      setPatientAppointments([]);
      setSelectedAppointment(null);
      setCatalogSearch('');
      setFilteredCatalog([]);
      setOpenDialog(false);
    } catch (error) {
      console.error('Error adding treatment:', error);
      showToast(error.response?.data?.error || 'Error adding treatment', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Search patients by name or NIC
  const searchPatients = async (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) {
      setSearchedPatients([]);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/patient/all`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      
      const filtered = response.data.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.nic.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setSearchedPatients(filtered);
    } catch (error) {
      console.error('Error searching patients:', error);
      showToast('Error searching patients', 'error');
    }
  };

  // Fetch appointments for selected patient
  const fetchPatientAppointments = async (patientId) => {
    try {
      const response = await axios.get(`${API_URL}/appointment`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      
      const filtered = response.data.filter(apt => apt.patient_id === patientId);
      setPatientAppointments(filtered);
      
      if (filtered.length === 0) {
        showToast('No appointments found for this patient', 'info');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      showToast('Error fetching appointments', 'error');
    }
  };

  // Handle patient selection
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setSearchedPatients([]);
    setPatientSearch(patient.name);
    fetchPatientAppointments(patient.patient_id);
  };

  // Handle appointment selection
  const handleAppointmentSelect = (appointment) => {
    setSelectedAppointment(appointment);
    setFilteredCatalog(treatmentCatalog); // Show all catalog items
  };

  // Filter treatment catalog
  const filterTreatmentCatalog = (searchTerm) => {
    if (!searchTerm) {
      setFilteredCatalog(treatmentCatalog);
      return;
    }
    
    const filtered = treatmentCatalog.filter(item =>
      item.treatment_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCatalog(filtered);
  };

  // Add Insurance Company
  const addInsuranceCompany = async () => {
    if (!insuranceForm.name || !insuranceForm.coverage_type) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/insurance`, insuranceForm, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      showToast('Insurance company added successfully!', 'success');
      setInsuranceForm({ name: '', coverage_type: '', phone_no: '' });
      setOpenDialog(false);
      fetchInsuranceCompanies(); // Refresh list
    } catch (error) {
      console.error('Error adding insurance company:', error);
      showToast(error.response?.data?.error || 'Error adding insurance company', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Add Treatment to Catalog
  const addTreatmentCatalog = async () => {
    if (!treatmentCatalogForm.treatment_name) {
      showToast('Please enter treatment name', 'error');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/treatment-catalog`, treatmentCatalogForm, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      showToast('Treatment added to catalog successfully!', 'success');
      setTreatmentCatalogForm({ treatment_name: '', treatment_fee: '' });
      setOpenDialog(false);
      fetchTreatmentCatalog(); // Refresh list
    } catch (error) {
      console.error('Error adding treatment to catalog:', error);
      showToast(error.response?.data?.error || 'Error adding treatment to catalog', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Add Payment
  const addPayment = async () => {
    if (!paymentForm.payment_id || !paymentForm.appointment_id || !paymentForm.patient_id) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/payment`, paymentForm, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      showToast('Payment recorded successfully!', 'success');
      setPaymentForm({
        payment_id: '',
        insurance_paid_amount: '',
        patient_paid_amount: '',
        discount_amount: '',
        status: 'Pending',
        appointment_id: '',
        patient_id: ''
      });
      setOpenDialog(false);
    } catch (error) {
      console.error('Error recording payment:', error);
      showToast(error.response?.data?.error || 'Error recording payment', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Add Doctor Schedule
  const addDoctorSchedule = async () => {
    if (!scheduleForm.staff_id || !scheduleForm.branch_id || !scheduleForm.schedule_date || !scheduleForm.start_time || !scheduleForm.end_time) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/doctor-schedule`, scheduleForm, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      showToast('Doctor schedule added successfully!', 'success');
      setScheduleForm({
        staff_id: '',
        branch_id: '',
        schedule_date: '',
        start_time: '',
        end_time: '',
        max_patients: '10',
        fee: '0.00',
        notes: ''
      });
      setOpenDialog(false);
      fetchDoctorSchedules(); // Refresh list
    } catch (error) {
      console.error('Error adding doctor schedule:', error);
      showToast(error.response?.data?.error || 'Error adding doctor schedule', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Update Schedule Status
  const updateScheduleStatus = async (scheduleId, newStatus) => {
    setLoading(true);
    try {
      await axios.put(`${API_URL}/doctor-schedule/${scheduleId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      showToast(`Schedule ${newStatus.toLowerCase()} successfully!`, 'success');
      fetchDoctorSchedules(); // Refresh list
    } catch (error) {
      console.error('Error updating schedule status:', error);
      showToast(error.response?.data?.error || 'Error updating schedule status', 'error');
    } finally {
      setLoading(false);
    }
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, open: false }));
  };

  return (
    <div className={`staff-page-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box className="page-header">
          <Typography variant="h3" className="page-title">
            Staff Management Panel
          </Typography>
          <Typography variant="h6" className="page-subtitle">
            Manage patients, treatments, payments, and more
          </Typography>
        </Box>

        {/* Tabs */}
        <Paper className="tabs-paper">
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="staff management tabs"
            className="management-tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<PersonAdd />} label="Add Patient" />
            <Tab icon={<Payment />} label="Manage Payments" />
            <Tab icon={<MedicalServices />} label="Add Treatments" />
            <Tab icon={<Schedule />} label="Doctor Schedule" />
            <Tab icon={<Business />} label="Insurance Company" />
            <Tab icon={<LocalHospital />} label="Treatment Catalog" />
          </Tabs>

          {/* Add Patient Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box className="vertical-layout">
              {/* Simple Add Patient Box */}
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1, textAlign: 'left' }}>
                    Add New Patient
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'left' }}>
                    Register a new patient in the system by filling the form below
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      startIcon={<PersonAdd />}
                      onClick={() => openAddDialog('patient')}
                      size="large"
                    >
                      Add New Patient
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              {/* Info Message */}
              <Card className="list-card">
                <CardContent>
                  <Alert severity="info">
                    Patients are registered through the signup page. Use the form above to add patients directly from the staff panel.
                  </Alert>
                </CardContent>
              </Card>
            </Box>
          </TabPanel>

          {/* Manage Payments Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box className="vertical-layout">
              {/* Simple Record Payment Box */}
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1, textAlign: 'left' }}>
                    Record Payment
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'left' }}>
                    Record a new payment transaction for patient services
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      startIcon={<Payment />}
                      onClick={() => openAddDialog('payment')}
                      size="large"
                    >
                      Record Payment
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </TabPanel>

          {/* Add Treatments Tab */}
          <TabPanel value={tabValue} index={2}>
            <Box className="vertical-layout">
              {/* Simple Add Treatment Box */}
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1, textAlign: 'left' }}>
                    Add Treatment to Appointment
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'left' }}>
                    Link a treatment from the catalog to an existing appointment
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      startIcon={<MedicalServices />}
                      onClick={() => openAddDialog('treatment')}
                      size="large"
                    >
                      Add Treatment
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </TabPanel>

          {/* Doctor Schedule Tab */}
          <TabPanel value={tabValue} index={3}>
            <Box className="vertical-layout">
              {/* Add Schedule Card */}
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1, textAlign: 'left' }}>
                    Add Doctor Schedule
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'left' }}>
                    Schedule doctor availability for patient appointments
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      startIcon={<Schedule />}
                      onClick={() => openAddDialog('schedule')}
                      size="large"
                    >
                      Add Schedule
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              {/* Doctor Schedules List */}
              <Card className="list-card">
                <CardContent>
                  <Box className="card-header">
                    <Typography variant="h5" className="card-title">
                      Doctor Schedules ({schedules.length})
                    </Typography>
                  </Box>
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <TableContainer className="table-container">
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell><strong>Schedule ID</strong></TableCell>
                            <TableCell><strong>Doctor</strong></TableCell>
                            <TableCell><strong>Speciality</strong></TableCell>
                            <TableCell><strong>Branch</strong></TableCell>
                            <TableCell><strong>Date</strong></TableCell>
                            <TableCell><strong>Time</strong></TableCell>
                            <TableCell><strong>Fee (LKR)</strong></TableCell>
                            <TableCell><strong>Patients</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell><strong>Actions</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {schedules.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={10} align="center">
                                <Typography color="text.secondary">No schedules found</Typography>
                              </TableCell>
                            </TableRow>
                          ) : (
                            schedules.map((schedule) => (
                              <TableRow key={schedule.schedule_id} hover>
                                <TableCell>{schedule.schedule_id}</TableCell>
                                <TableCell>{schedule.doctor_name}</TableCell>
                                <TableCell>{schedule.speciality}</TableCell>
                                <TableCell>{schedule.branch_name}</TableCell>
                                <TableCell>{new Date(schedule.schedule_date).toLocaleDateString()}</TableCell>
                                <TableCell>
                                  {schedule.start_time} - {schedule.end_time}
                                </TableCell>
                                <TableCell>
                                  Rs. {parseFloat(schedule.fee || 0).toFixed(2)}
                                </TableCell>
                                <TableCell>
                                  {schedule.booked_patients} / {schedule.max_patients}
                                </TableCell>
                                <TableCell>
                                  <Chip 
                                    label={schedule.status} 
                                    size="small" 
                                    color={
                                      schedule.status === 'Available' ? 'success' : 
                                      schedule.status === 'Completed' ? 'primary' : 
                                      'default'
                                    }
                                  />
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', gap: 1 }}>
                                    {schedule.status === 'Available' && (
                                      <>
                                        <Button 
                                          size="small" 
                                          variant="outlined" 
                                          color="error"
                                          onClick={() => updateScheduleStatus(schedule.schedule_id, 'Cancelled')}
                                        >
                                          Cancel
                                        </Button>
                                        <Button 
                                          size="small" 
                                          variant="outlined" 
                                          color="success"
                                          onClick={() => updateScheduleStatus(schedule.schedule_id, 'Completed')}
                                        >
                                          Complete
                                        </Button>
                                      </>
                                    )}
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </CardContent>
              </Card>
            </Box>
          </TabPanel>

          {/* Insurance Company Tab */}
          <TabPanel value={tabValue} index={4}>
            <Box className="vertical-layout">
              {/* Simple Add Insurance Company Box */}
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1, textAlign: 'left' }}>
                    Add Insurance Company
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'left' }}>
                    Register a new insurance provider in the system
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      startIcon={<Business />}
                      onClick={() => openAddDialog('insurance')}
                      size="large"
                    >
                      Add Insurance Company
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              {/* Insurance Companies Card */}
              <Card className="list-card">
                <CardContent>
                  <Box className="card-header">
                    <Typography variant="h5" className="card-title">
                      Insurance Companies ({insuranceCompanies.length})
                    </Typography>
                  </Box>
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <TableContainer className="table-container">
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell><strong>Company ID</strong></TableCell>
                            <TableCell><strong>Company Name</strong></TableCell>
                            <TableCell><strong>Coverage Type</strong></TableCell>
                            <TableCell><strong>Phone</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {insuranceCompanies.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4} align="center">
                                <Typography color="text.secondary">No insurance companies found</Typography>
                              </TableCell>
                            </TableRow>
                          ) : (
                            insuranceCompanies.map((company) => (
                              <TableRow key={company.insurance_id} hover>
                                <TableCell>{company.insurance_id}</TableCell>
                                <TableCell>{company.name}</TableCell>
                                <TableCell>
                                  <Chip label={company.coverage_type} size="small" color="primary" />
                                </TableCell>
                                <TableCell>{company.phone_no || 'N/A'}</TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </CardContent>
              </Card>
            </Box>
          </TabPanel>

          {/* Treatment Catalog Tab */}
          <TabPanel value={tabValue} index={5}>
            <Box className="vertical-layout">
              {/* Simple Add to Catalog Box */}
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1, textAlign: 'left' }}>
                    Add to Catalog
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'left' }}>
                    Add new treatment to the treatment catalog
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      startIcon={<LocalHospital />}
                      onClick={() => openAddDialog('treatmentCatalog')}
                      size="large"
                    >
                      Add to Catalog
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              {/* Treatment Catalog Card */}
              <Card className="list-card">
                <CardContent>
                  <Box className="card-header">
                    <Typography variant="h5" className="card-title">
                      Treatment Catalog ({treatmentCatalog.length})
                    </Typography>
                  </Box>
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <TableContainer className="table-container">
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell><strong>Catalog ID</strong></TableCell>
                            <TableCell><strong>Treatment Name</strong></TableCell>
                            <TableCell><strong>Treatment Fee (LKR)</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {treatmentCatalog.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={3} align="center">
                                <Typography color="text.secondary">No treatments in catalog</Typography>
                              </TableCell>
                            </TableRow>
                          ) : (
                            treatmentCatalog.map((item) => (
                              <TableRow key={item.catalog_id} hover>
                                <TableCell>{item.catalog_id}</TableCell>
                                <TableCell>{item.treatment_name}</TableCell>
                                <TableCell>{parseFloat(item.treatment_fee).toFixed(2)}</TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </CardContent>
              </Card>
            </Box>
          </TabPanel>
        </Paper>
      </Container>

      {/* Add Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => {
          setOpenDialog(false);
          // Reset treatment workflow states
          if (dialogType === 'treatment') {
            setPatientSearch('');
            setSearchedPatients([]);
            setSelectedPatient(null);
            setPatientAppointments([]);
            setSelectedAppointment(null);
            setCatalogSearch('');
            setFilteredCatalog([]);
          }
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogType === 'patient' && 'Add New Patient'}
          {dialogType === 'payment' && 'Record Payment'}
          {dialogType === 'treatment' && 'Add Treatment'}
          {dialogType === 'insurance' && 'Add Insurance Company'}
          {dialogType === 'treatmentCatalog' && 'Add to Treatment Catalog'}
          {dialogType === 'schedule' && 'Add Doctor Schedule'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {dialogType === 'patient' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Username *"
                    value={patientForm.username}
                    onChange={handlePatientInputChange('username')}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name *"
                    value={patientForm.name}
                    onChange={handlePatientInputChange('name')}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email *"
                    type="email"
                    value={patientForm.email}
                    onChange={handlePatientInputChange('email')}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Password *"
                    type="password"
                    value={patientForm.password}
                    onChange={handlePatientInputChange('password')}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number *"
                    value={patientForm.phone_no}
                    onChange={handlePatientInputChange('phone_no')}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={patientForm.gender}
                      label="Gender"
                      onChange={handlePatientInputChange('gender')}
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Age *"
                    type="number"
                    value={patientForm.age}
                    onChange={handlePatientInputChange('age')}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="NIC Number"
                    value={patientForm.nic}
                    onChange={handlePatientInputChange('nic')}
                  />
                </Grid>
              </>
            )}

            {dialogType === 'payment' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Payment ID *"
                    value={paymentForm.payment_id}
                    onChange={handlePaymentInputChange('payment_id')}
                    required
                    helperText="Auto-generated (e.g., PM001)"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Appointment ID *"
                    value={paymentForm.appointment_id}
                    onChange={handlePaymentInputChange('appointment_id')}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Patient ID *"
                    value={paymentForm.patient_id}
                    onChange={handlePaymentInputChange('patient_id')}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Payment Status</InputLabel>
                    <Select
                      value={paymentForm.status}
                      label="Payment Status"
                      onChange={handlePaymentInputChange('status')}
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                      <MenuItem value="Failed">Failed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Insurance Paid Amount"
                    type="number"
                    value={paymentForm.insurance_paid_amount}
                    onChange={handlePaymentInputChange('insurance_paid_amount')}
                    InputProps={{ startAdornment: '$' }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Patient Paid Amount"
                    type="number"
                    value={paymentForm.patient_paid_amount}
                    onChange={handlePaymentInputChange('patient_paid_amount')}
                    InputProps={{ startAdornment: '$' }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Discount Amount"
                    type="number"
                    value={paymentForm.discount_amount}
                    onChange={handlePaymentInputChange('discount_amount')}
                    InputProps={{ startAdornment: '$' }}
                  />
                </Grid>
              </>
            )}

            {dialogType === 'treatment' && (
              <>
                {/* Step 1: Search Patient */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Step 1: Search Patient
                  </Typography>
                  <TextField
                    fullWidth
                    label="Search by Patient Name or NIC"
                    value={patientSearch}
                    onChange={(e) => {
                      setPatientSearch(e.target.value);
                      searchPatients(e.target.value);
                    }}
                    placeholder="Type patient name or NIC..."
                    helperText="Enter at least 2 characters to search"
                  />
                  
                  {/* Patient Search Results */}
                  {searchedPatients.length > 0 && !selectedPatient && (
                    <Box sx={{ mt: 2, maxHeight: 200, overflow: 'auto', border: '1px solid #ddd', borderRadius: 1 }}>
                      {searchedPatients.map((patient) => (
                        <Box
                          key={patient.patient_id}
                          onClick={() => handlePatientSelect(patient)}
                          sx={{
                            p: 2,
                            cursor: 'pointer',
                            borderBottom: '1px solid #eee',
                            '&:hover': { bgcolor: '#f5f5f5' }
                          }}
                        >
                          <Typography variant="body1"><strong>{patient.name}</strong></Typography>
                          <Typography variant="body2" color="text.secondary">
                            NIC: {patient.nic} | Phone: {patient.phone_no}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Grid>

                {/* Step 2: Select Appointment */}
                {selectedPatient && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ mb: 1, mt: 2, fontWeight: 'bold' }}>
                      Step 2: Select Appointment for {selectedPatient.name}
                    </Typography>
                    
                    {patientAppointments.length === 0 ? (
                      <Typography color="text.secondary" sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                        No appointments found for this patient
                      </Typography>
                    ) : (
                      <Box sx={{ maxHeight: 250, overflow: 'auto', border: '1px solid #ddd', borderRadius: 1 }}>
                        {patientAppointments.map((apt) => (
                          <Box
                            key={apt.appointment_id}
                            onClick={() => handleAppointmentSelect(apt)}
                            sx={{
                              p: 2,
                              cursor: 'pointer',
                              borderBottom: '1px solid #eee',
                              bgcolor: selectedAppointment?.appointment_id === apt.appointment_id ? '#e3f2fd' : 'transparent',
                              '&:hover': { bgcolor: selectedAppointment?.appointment_id === apt.appointment_id ? '#e3f2fd' : '#f5f5f5' }
                            }}
                          >
                            <Typography variant="body1">
                              <strong>Appointment ID:</strong> {apt.appointment_id}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Date:</strong> {new Date(apt.appointment_date).toLocaleDateString()} | 
                              <strong> Time:</strong> {apt.appointment_time} | 
                              <strong> Status:</strong> {apt.status}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Grid>
                )}

                {/* Step 3: Search and Select Treatment */}
                {selectedAppointment && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" sx={{ mb: 1, mt: 2, fontWeight: 'bold' }}>
                        Step 3: Select Treatment from Catalog
                      </Typography>
                      <TextField
                        fullWidth
                        label="Search Treatment Catalog"
                        value={catalogSearch}
                        onChange={(e) => {
                          setCatalogSearch(e.target.value);
                          filterTreatmentCatalog(e.target.value);
                        }}
                        placeholder="Type to search treatments..."
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <FormControl fullWidth required>
                        <InputLabel>Select Treatment</InputLabel>
                        <Select
                          value={treatmentForm.catalog_id}
                          label="Select Treatment"
                          onChange={handleTreatmentInputChange('catalog_id')}
                        >
                          {(filteredCatalog.length > 0 ? filteredCatalog : treatmentCatalog).map((item) => (
                            <MenuItem key={item.catalog_id} value={item.catalog_id}>
                              {item.treatment_name} - Rs. {parseFloat(item.treatment_fee).toFixed(2)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Treatment Description / Notes"
                        multiline
                        rows={4}
                        value={treatmentForm.description}
                        onChange={handleTreatmentInputChange('description')}
                        placeholder="Add any additional notes about the treatment..."
                      />
                    </Grid>

                    {/* Summary */}
                    <Grid item xs={12}>
                      <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                        <Typography variant="subtitle2" gutterBottom><strong>Summary:</strong></Typography>
                        <Typography variant="body2">Patient: {selectedPatient.name}</Typography>
                        <Typography variant="body2">NIC: {selectedPatient.nic}</Typography>
                        <Typography variant="body2">Appointment: {selectedAppointment.appointment_id}</Typography>
                        <Typography variant="body2">
                          Date: {new Date(selectedAppointment.appointment_date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Grid>
                  </>
                )}
              </>
            )}

            {dialogType === 'insurance' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company Name *"
                    value={insuranceForm.name}
                    onChange={handleInsuranceInputChange('name')}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Coverage Type *"
                    value={insuranceForm.coverage_type}
                    onChange={handleInsuranceInputChange('coverage_type')}
                    placeholder="e.g., Full Coverage, Partial Coverage"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={insuranceForm.phone_no}
                    onChange={handleInsuranceInputChange('phone_no')}
                  />
                </Grid>
              </>
            )}

            {dialogType === 'treatmentCatalog' && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Treatment Name *"
                    value={treatmentCatalogForm.treatment_name}
                    onChange={handleTreatmentCatalogInputChange('treatment_name')}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Treatment Fee (LKR)"
                    type="number"
                    value={treatmentCatalogForm.treatment_fee}
                    onChange={handleTreatmentCatalogInputChange('treatment_fee')}
                    placeholder="0.00"
                  />
                </Grid>
              </>
            )}

            {dialogType === 'schedule' && (
              <>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Select Doctor</InputLabel>
                    <Select
                      value={scheduleForm.staff_id}
                      label="Select Doctor"
                      onChange={handleScheduleInputChange('staff_id')}
                      disabled={doctors.length === 0}
                    >
                      {doctors.length === 0 ? (
                        <MenuItem disabled>No doctors available - Please add doctors first</MenuItem>
                      ) : (
                        doctors.map((doctor) => (
                          <MenuItem key={doctor.staff_id} value={doctor.staff_id}>
                            {doctor.name} - {doctor.speciality}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Branch (Auto-filled from Doctor)"
                    value={
                      scheduleForm.branch_id 
                        ? branches.find(b => b.branch_id === scheduleForm.branch_id)?.name || scheduleForm.branch_id
                        : 'Select a doctor first'
                    }
                    disabled
                    required
                    helperText="Branch is automatically set based on the selected doctor"
                    className="auto-filled-field"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Schedule Date *"
                    type="date"
                    value={scheduleForm.schedule_date}
                    onChange={handleScheduleInputChange('schedule_date')}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Start Time *"
                    type="time"
                    value={scheduleForm.start_time}
                    onChange={handleScheduleInputChange('start_time')}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="End Time *"
                    type="time"
                    value={scheduleForm.end_time}
                    onChange={handleScheduleInputChange('end_time')}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Max Patients *"
                    type="number"
                    value={scheduleForm.max_patients}
                    onChange={handleScheduleInputChange('max_patients')}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Consultation Fee (LKR) *"
                    type="number"
                    value={scheduleForm.fee}
                    onChange={handleScheduleInputChange('fee')}
                    InputProps={{
                      startAdornment: <span style={{marginRight: '8px'}}>Rs.</span>,
                    }}
                    helperText="Doctor's consultation fee for this schedule"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    multiline
                    rows={3}
                    value={scheduleForm.notes}
                    onChange={handleScheduleInputChange('notes')}
                    placeholder="Any special notes about this schedule..."
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setOpenDialog(false);
              // Reset treatment workflow states
              if (dialogType === 'treatment') {
                setPatientSearch('');
                setSearchedPatients([]);
                setSelectedPatient(null);
                setPatientAppointments([]);
                setSelectedAppointment(null);
                setCatalogSearch('');
                setFilteredCatalog([]);
              }
            }} 
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={
              dialogType === 'patient' ? addPatient :
              dialogType === 'payment' ? addPayment :
              dialogType === 'treatment' ? addTreatment :
              dialogType === 'insurance' ? addInsuranceCompany :
              dialogType === 'schedule' ? addDoctorSchedule :
              addTreatmentCatalog
            } 
            variant="contained"
            disabled={
              loading || 
              (dialogType === 'treatment' && (!selectedAppointment || !treatmentForm.catalog_id))
            }
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Processing...' : (
              dialogType === 'patient' ? 'Add Patient' :
              dialogType === 'payment' ? 'Record Payment' :
              dialogType === 'treatment' ? 'Add Treatment' :
              dialogType === 'insurance' ? 'Add Company' :
              dialogType === 'schedule' ? 'Add Schedule' :
              'Add to Catalog'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={closeToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={closeToast} severity={toast.severity} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default StaffPage;