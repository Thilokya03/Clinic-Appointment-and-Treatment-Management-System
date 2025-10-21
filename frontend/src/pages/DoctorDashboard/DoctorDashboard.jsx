import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Chip,
  IconButton,
  CircularProgress,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Schedule,
  Edit,
  Search,
  MedicalServices,
  EventAvailable,
  PersonSearch,
  Add,
  Delete,
  CalendarMonth,
} from '@mui/icons-material';

// Tab Panel Component
function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function DoctorDashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  
  // Data States
  const [appointments, setAppointments] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [searchedPatients, setSearchedPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientTreatments, setPatientTreatments] = useState([]);
  
  // Dialog States
  const [rescheduleDialog, setRescheduleDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rescheduleForm, setRescheduleForm] = useState({
    appointment_date: '',
    start_time: '',
    end_time: '',
    notes: ''
  });
  
  // Schedule Management States
  const [scheduleDialog, setScheduleDialog] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({
    date: '',
    start_time: '',
    end_time: '',
    max_patients: 20,
    fee: 1500.00,
    status: 'ACTIVE',
    notes: ''
  });

  const API_URL = 'http://localhost:3000/api';
  const getToken = () => localStorage.getItem('catms_token');
  const getDoctorId = () => {
    const user = JSON.parse(localStorage.getItem('catms_user') || '{}');
    return user.id;
  };

  useEffect(() => {
    console.log('🏥 Doctor Dashboard mounted');
    console.log('👨‍⚕️ Doctor ID:', getDoctorId());
    console.log('🔑 Token exists:', !!getToken());
    fetchDoctorAppointments();
    fetchDoctorSchedules();
  }, []);

  // Fetch doctor's appointments
  const fetchDoctorAppointments = async () => {
    console.log('📅 Fetching doctor appointments...');
    setLoading(true);
    try {
      const doctorId = getDoctorId();
      console.log('Doctor ID being used:', doctorId);
      const response = await axios.get(`${API_URL}/appointment/doctor/${doctorId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      console.log('✅ Appointments fetched:', response.data);
      console.log('📊 Number of appointments:', response.data.length);
      setAppointments(response.data);
    } catch (error) {
      console.error('❌ Error fetching appointments:', error);
      console.error('Error details:', error.response?.data);
      showToast('Error fetching appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch doctor's schedules
  const fetchDoctorSchedules = async () => {
    console.log('📅 Fetching doctor schedules...');
    try {
      const doctorId = getDoctorId();
      const response = await axios.get(`${API_URL}/doctor-schedule/doctor/${doctorId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      console.log('✅ Schedules fetched:', response.data);
      console.log('📊 Number of schedules:', response.data.length);
      setSchedules(response.data);
    } catch (error) {
      console.error('❌ Error fetching schedules:', error);
      console.error('Error details:', error.response?.data);
      showToast('Error fetching schedules', 'error');
    }
  };

  // Search patients
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

  // Fetch patient's past treatments
  const fetchPatientTreatments = async (patientId) => {
    setLoading(true);
    try {
      // First get all appointments for this patient
      const appointmentsResponse = await axios.get(`${API_URL}/appointment`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      
      const patientAppointments = appointmentsResponse.data.filter(
        apt => apt.patient_id === patientId
      );
      
      // Get treatments for each appointment
      const treatmentsPromises = patientAppointments.map(async (apt) => {
        try {
          const treatmentResponse = await axios.get(`${API_URL}/treatment/${apt.appointment_id}`, {
            headers: { Authorization: `Bearer ${getToken()}` }
          });
          return treatmentResponse.data.map(treatment => ({
            ...treatment,
            appointment_date: apt.appointment_date,
            appointment_time: apt.start_time
          }));
        } catch (error) {
          return [];
        }
      });
      
      const allTreatments = await Promise.all(treatmentsPromises);
      const flattenedTreatments = allTreatments.flat();
      
      setPatientTreatments(flattenedTreatments);
    } catch (error) {
      console.error('Error fetching patient treatments:', error);
      showToast('Error fetching patient treatments', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle patient selection
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setSearchedPatients([]);
    setPatientSearch(patient.name);
    fetchPatientTreatments(patient.patient_id);
  };

  // Open reschedule dialog
  const openRescheduleDialog = (appointment) => {
    setSelectedAppointment(appointment);
    setRescheduleForm({
      appointment_date: appointment.appointment_date.split('T')[0],
      start_time: appointment.start_time,
      end_time: appointment.end_time,
      notes: appointment.notes || ''
    });
    setRescheduleDialog(true);
  };

  // Reschedule appointment
  const rescheduleAppointment = async () => {
    if (!rescheduleForm.appointment_date || !rescheduleForm.start_time || !rescheduleForm.end_time) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    setLoading(true);
    try {
      await axios.put(
        `${API_URL}/appointment/${selectedAppointment.appointment_id}`,
        rescheduleForm,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      
      showToast('Appointment rescheduled successfully!', 'success');
      setRescheduleDialog(false);
      fetchDoctorAppointments();
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      showToast(error.response?.data?.error || 'Error rescheduling appointment', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, open: false }));
  };

  const handleRescheduleInputChange = (field) => (event) => {
    setRescheduleForm(prev => ({ ...prev, [field]: event.target.value }));
  };

  // Schedule Management Functions
  const openScheduleDialog = (schedule = null) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setScheduleForm({
        date: schedule.date.split('T')[0],
        start_time: schedule.start_time,
        end_time: schedule.end_time,
        max_patients: schedule.max_patients,
        fee: schedule.fee,
        status: schedule.status,
        notes: schedule.notes || ''
      });
    } else {
      setEditingSchedule(null);
      setScheduleForm({
        date: '',
        start_time: '09:00',
        end_time: '17:00',
        max_patients: 20,
        fee: 1500.00,
        status: 'ACTIVE',
        notes: ''
      });
    }
    setScheduleDialog(true);
  };

  const handleScheduleInputChange = (field) => (event) => {
    setScheduleForm(prev => ({ ...prev, [field]: event.target.value }));
  };

  const saveSchedule = async () => {
    if (!scheduleForm.date || !scheduleForm.start_time || !scheduleForm.end_time) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const doctorId = getDoctorId();
      
      // Get doctor's speciality
      const doctorResponse = await axios.get(`${API_URL}/staff/doctors/${doctorId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      
      const speciality = doctorResponse.data.speciality || 'General';

      const scheduleData = {
        staff_id: doctorId,
        schedule_date: scheduleForm.date,
        start_time: scheduleForm.start_time,
        end_time: scheduleForm.end_time,
        max_patients: parseInt(scheduleForm.max_patients),
        fee: parseFloat(scheduleForm.fee),
        notes: scheduleForm.notes
      };

      if (editingSchedule) {
        // Update existing schedule
        await axios.put(
          `${API_URL}/doctor-schedule/${editingSchedule.schedule_id}/reschedule`,
          scheduleData,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        showToast('Schedule updated successfully!', 'success');
      } else {
        // Create new schedule
        await axios.post(
          `${API_URL}/doctor-schedule`,
          scheduleData,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        showToast('Schedule created successfully!', 'success');
      }

      setScheduleDialog(false);
      fetchDoctorSchedules();
    } catch (error) {
      console.error('Error saving schedule:', error);
      showToast(error.response?.data?.error || 'Error saving schedule', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteSchedule = async (scheduleId) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) {
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`${API_URL}/doctor-schedule/${scheduleId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      showToast('Schedule deleted successfully!', 'success');
      fetchDoctorSchedules();
    } catch (error) {
      console.error('Error deleting schedule:', error);
      showToast(error.response?.data?.error || 'Error deleting schedule', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
          Doctor Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Manage your schedule, appointments, and patient records
        </Typography>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<EventAvailable />} label="My Appointments" />
          <Tab icon={<Schedule />} label="My Schedule" />
          <Tab icon={<CalendarMonth />} label="Manage Schedule" />
          <Tab icon={<PersonSearch />} label="Patient History" />
        </Tabs>

        {/* Tab 1: My Appointments */}
        <TabPanel value={tabValue} index={0}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">
                  My Appointments ({appointments.length})
                </Typography>
                <Button
                  variant="contained"
                  onClick={fetchDoctorAppointments}
                  disabled={loading}
                >
                  Refresh
                </Button>
              </Box>
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Appointment ID</strong></TableCell>
                        <TableCell><strong>Date</strong></TableCell>
                        <TableCell><strong>Time</strong></TableCell>
                        <TableCell><strong>Patient ID</strong></TableCell>
                        <TableCell><strong>Status</strong></TableCell>
                        <TableCell><strong>Notes</strong></TableCell>
                        <TableCell><strong>Actions</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {appointments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} align="center">
                            <Typography color="text.secondary">No appointments found</Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        appointments.map((apt) => (
                          <TableRow key={apt.appointment_id} hover>
                            <TableCell>{apt.appointment_id}</TableCell>
                            <TableCell>{new Date(apt.appointment_date).toLocaleDateString()}</TableCell>
                            <TableCell>{apt.start_time} - {apt.end_time}</TableCell>
                            <TableCell>{apt.patient_id}</TableCell>
                            <TableCell>
                              <Chip 
                                label={apt.status} 
                                color={
                                  apt.status === 'Completed' ? 'success' :
                                  apt.status === 'Cancelled' ? 'error' :
                                  'primary'
                                }
                                size="small"
                              />
                            </TableCell>
                            <TableCell>{apt.notes || '-'}</TableCell>
                            <TableCell>
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => openRescheduleDialog(apt)}
                                title="Reschedule"
                              >
                                <Edit />
                              </IconButton>
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
        </TabPanel>

        {/* Tab 2: My Schedule */}
        <TabPanel value={tabValue} index={1}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">
                  My Schedule ({schedules.length})
                </Typography>
                <Button
                  variant="outlined"
                  onClick={fetchDoctorSchedules}
                  disabled={loading}
                >
                  Refresh
                </Button>
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Date</strong></TableCell>
                        <TableCell><strong>Day</strong></TableCell>
                        <TableCell><strong>Time</strong></TableCell>
                        <TableCell><strong>Max Patients</strong></TableCell>
                        <TableCell><strong>Fee (LKR)</strong></TableCell>
                        <TableCell><strong>Status</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {schedules.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            <Typography color="text.secondary">No schedules found</Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        schedules.map((schedule) => (
                          <TableRow key={schedule.schedule_id} hover>
                            <TableCell>{new Date(schedule.date).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(schedule.date).toLocaleDateString('en-US', { weekday: 'long' })}</TableCell>
                            <TableCell>{schedule.start_time} - {schedule.end_time}</TableCell>
                            <TableCell>{schedule.max_patients}</TableCell>
                            <TableCell>Rs. {parseFloat(schedule.fee).toFixed(2)}</TableCell>
                            <TableCell>
                              <Chip 
                                label={schedule.status} 
                                color={schedule.status === 'ACTIVE' ? 'success' : 'default'}
                                size="small"
                              />
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
        </TabPanel>

        {/* Tab 3: Manage Schedule */}
        <TabPanel value={tabValue} index={2}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">
                  Manage My Schedule
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => openScheduleDialog()}
                  disabled={loading}
                >
                  Add New Schedule
                </Button>
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Schedule ID</strong></TableCell>
                        <TableCell><strong>Date</strong></TableCell>
                        <TableCell><strong>Time</strong></TableCell>
                        <TableCell><strong>Max Patients</strong></TableCell>
                        <TableCell><strong>Fee</strong></TableCell>
                        <TableCell><strong>Status</strong></TableCell>
                        <TableCell><strong>Actions</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {schedules.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} align="center">
                            <Box sx={{ py: 3 }}>
                              <Typography color="text.secondary" gutterBottom>
                                No schedules found
                              </Typography>
                              <Button
                                variant="outlined"
                                startIcon={<Add />}
                                onClick={() => openScheduleDialog()}
                                sx={{ mt: 2 }}
                              >
                                Create Your First Schedule
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ) : (
                        schedules.map((schedule) => (
                          <TableRow key={schedule.schedule_id} hover>
                            <TableCell>{schedule.schedule_id}</TableCell>
                            <TableCell>
                              {new Date(schedule.date).toLocaleDateString()}
                              <br />
                              <Typography variant="caption" color="text.secondary">
                                {new Date(schedule.date).toLocaleDateString('en-US', { weekday: 'long' })}
                              </Typography>
                            </TableCell>
                            <TableCell>{schedule.start_time} - {schedule.end_time}</TableCell>
                            <TableCell align="center">{schedule.max_patients}</TableCell>
                            <TableCell>Rs. {parseFloat(schedule.fee).toFixed(2)}</TableCell>
                            <TableCell>
                              <Chip 
                                label={schedule.status} 
                                color={schedule.status === 'ACTIVE' ? 'success' : 'error'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => openScheduleDialog(schedule)}
                                  title="Edit Schedule"
                                >
                                  <Edit />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => deleteSchedule(schedule.schedule_id)}
                                  title="Delete Schedule"
                                >
                                  <Delete />
                                </IconButton>
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
        </TabPanel>

        {/* Tab 4: Patient History */}
        <TabPanel value={tabValue} index={3}>
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 3 }}>
                Search Patient Treatment History
              </Typography>

              {/* Patient Search */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Search by Patient Name or NIC"
                  value={patientSearch}
                  onChange={(e) => {
                    setPatientSearch(e.target.value);
                    searchPatients(e.target.value);
                    if (!e.target.value) {
                      setSelectedPatient(null);
                      setPatientTreatments([]);
                    }
                  }}
                  placeholder="Type patient name or NIC..."
                  InputProps={{
                    endAdornment: <Search />
                  }}
                  helperText="Enter at least 2 characters to search"
                />

                {/* Search Results */}
                {searchedPatients.length > 0 && !selectedPatient && (
                  <Paper sx={{ mt: 2, maxHeight: 200, overflow: 'auto' }}>
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
                          NIC: {patient.nic} | Phone: {patient.phone_no} | ID: {patient.patient_id}
                        </Typography>
                      </Box>
                    ))}
                  </Paper>
                )}
              </Box>

              {/* Selected Patient Info */}
              {selectedPatient && (
                <Paper sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5' }}>
                  <Typography variant="h6" gutterBottom>Patient Information</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography><strong>Name:</strong> {selectedPatient.name}</Typography>
                      <Typography><strong>NIC:</strong> {selectedPatient.nic}</Typography>
                      <Typography><strong>Gender:</strong> {selectedPatient.gender}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography><strong>Phone:</strong> {selectedPatient.phone_no}</Typography>
                      <Typography><strong>Email:</strong> {selectedPatient.email}</Typography>
                      <Typography><strong>Age:</strong> {selectedPatient.age}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              )}

              {/* Patient Treatment History */}
              {selectedPatient && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Treatment History ({patientTreatments.length} treatments)
                  </Typography>

                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : patientTreatments.length === 0 ? (
                    <Alert severity="info">No treatment history found for this patient</Alert>
                  ) : (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell><strong>Treatment ID</strong></TableCell>
                            <TableCell><strong>Date</strong></TableCell>
                            <TableCell><strong>Treatment Name</strong></TableCell>
                            <TableCell><strong>Fee</strong></TableCell>
                            <TableCell><strong>Description</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {patientTreatments.map((treatment) => (
                            <TableRow key={treatment.treatment_id} hover>
                              <TableCell>{treatment.treatment_id}</TableCell>
                              <TableCell>
                                {new Date(treatment.appointment_date).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={treatment.treatment_name || 'N/A'} 
                                  color="primary" 
                                  size="small" 
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell>
                                {treatment.treatment_fee 
                                  ? `LKR ${parseFloat(treatment.treatment_fee).toFixed(2)}` 
                                  : '-'
                                }
                              </TableCell>
                              <TableCell>{treatment.description || '-'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabPanel>
      </Paper>

      {/* Reschedule Dialog */}
      <Dialog open={rescheduleDialog} onClose={() => setRescheduleDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reschedule Appointment</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Appointment ID: {selectedAppointment?.appointment_id}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Patient ID: {selectedAppointment?.patient_id}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={rescheduleForm.appointment_date}
                  onChange={handleRescheduleInputChange('appointment_date')}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Time"
                  type="time"
                  value={rescheduleForm.start_time}
                  onChange={handleRescheduleInputChange('start_time')}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="End Time"
                  type="time"
                  value={rescheduleForm.end_time}
                  onChange={handleRescheduleInputChange('end_time')}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={3}
                  value={rescheduleForm.notes}
                  onChange={handleRescheduleInputChange('notes')}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRescheduleDialog(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={rescheduleAppointment} 
            variant="contained" 
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Rescheduling...' : 'Reschedule'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Schedule Management Dialog */}
      <Dialog open={scheduleDialog} onClose={() => setScheduleDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={scheduleForm.date}
                  onChange={handleScheduleInputChange('date')}
                  InputLabelProps={{ shrink: true }}
                  required
                  helperText="Select the date for this schedule"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Time"
                  type="time"
                  value={scheduleForm.start_time}
                  onChange={handleScheduleInputChange('start_time')}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="End Time"
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
                  label="Maximum Patients"
                  type="number"
                  value={scheduleForm.max_patients}
                  onChange={handleScheduleInputChange('max_patients')}
                  required
                  inputProps={{ min: 1, max: 100 }}
                  helperText="Maximum number of patients for this session"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Consultation Fee (LKR)"
                  type="number"
                  value={scheduleForm.fee}
                  onChange={handleScheduleInputChange('fee')}
                  required
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={scheduleForm.status}
                    onChange={handleScheduleInputChange('status')}
                    label="Status"
                  >
                    <MenuItem value="ACTIVE">Active</MenuItem>
                    <MenuItem value="INACTIVE">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes (Optional)"
                  multiline
                  rows={3}
                  value={scheduleForm.notes}
                  onChange={handleScheduleInputChange('notes')}
                  helperText="Add any additional information about this schedule"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScheduleDialog(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={saveSchedule} 
            variant="contained" 
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Add />}
          >
            {loading ? 'Saving...' : (editingSchedule ? 'Update Schedule' : 'Create Schedule')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={closeToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={closeToast} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
