import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Container,
  Typography,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  CircularProgress,
} from '@mui/material';
import {
  MedicalServices,
  Groups,
  Assessment,
  Search,
  Delete,
} from '@mui/icons-material';
import './BranchManagers.css';

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

const BranchManagers = () => {
  const [tabValue, setTabValue] = useState(0);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [removeSearch, setRemoveSearch] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Staff state
  const [staffSearch, setStaffSearch] = useState('');
  const [staff, setStaff] = useState([]);
  const [selectedStaffIds, setSelectedStaffIds] = useState([]);

  const navigate = useNavigate();

  // Fetch doctors from backend
  useEffect(() => {
    if (tabValue === 0) {
      fetchDoctors();
    }
  }, [tabValue]);

  // Fetch staff from backend
  useEffect(() => {
    if (tabValue === 1) {
      fetchStaff();
    }
  }, [tabValue]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('catms_token');
      const response = await axios.get('http://localhost:3000/api/staff/doctors', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setToast({ open: true, message: 'Error loading doctors', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('catms_token');
      const response = await axios.get('http://localhost:3000/api/staff/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Filter out doctors from staff list
      const nonDoctorStaff = response.data.filter(s => s.category !== 'Doctor');
      setStaff(nonDoctorStaff);
    } catch (error) {
      console.error('Error fetching staff:', error);
      setToast({ open: true, message: 'Error loading staff', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredStaff = staff.filter(s => {
    if (!staffSearch.trim()) return true;
    const q = staffSearch.toLowerCase();
    return s.name.toLowerCase().includes(q) || (s.nic && s.nic.toLowerCase().includes(q));
  });

  const toggleStaffSelect = (id) => {
    setSelectedStaffIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const removeSelectedStaff = () => {
    if (selectedStaffIds.length === 0) {
      setToast({ open: true, message: 'Select at least one staff member to remove', severity: 'error' });
      return;
    }
    setStaff(prev => prev.filter(s => !selectedStaffIds.includes(s.id)));
    setSelectedStaffIds([]);
    setToast({ open: true, message: 'Selected staff removed (dummy)', severity: 'success' });
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, open: false }));
  };

  const filteredDoctors = doctors.filter(d => {
    if (!removeSearch.trim()) return true;
    const q = removeSearch.toLowerCase();
    return d.name.toLowerCase().includes(q) || (d.nic && d.nic.toLowerCase().includes(q));
  });

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const removeSelected = () => {
    if (selectedIds.length === 0) {
      setToast({ open: true, message: 'Select at least one doctor to remove', severity: 'error' });
      return;
    }
    setDoctors(prev => prev.filter(d => !selectedIds.includes(d.staff_id)));
    setSelectedIds([]);
    setToast({ open: true, message: 'Selected doctor(s) removed (dummy)', severity: 'success' });
  };

  return (
    <div className="branch-managers-container">
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box className="page-header">
          <Typography variant="h3" className="page-title">
            Branch Management
          </Typography>
          <Typography variant="h6" className="page-subtitle">
            Manage doctors, staff, and generate reports
          </Typography>
        </Box>

        {/* Tabs */}
        <Paper className="tabs-paper">
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="branch management tabs"
            className="management-tabs"
          >
            <Tab
              icon={<MedicalServices />}
              label="Manage Doctors"
              iconPosition="start"
            />
            <Tab
              icon={<Groups />}
              label="Manage Staff"
              iconPosition="start"
            />
            <Tab
              icon={<Assessment />}
              label="Generate Reports"
              iconPosition="start"
            />
          </Tabs>

          {/* Manage Doctors Tab */}
          <TabPanel value={tabValue} index={0}>
            {/* Centered Add Doctor CTA */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 4 }}>
              <Typography variant="h5" align="center">Add a new Doctor</Typography>
              <Button variant="contained" onClick={() => navigate('/dashboard/adddoctor')}>
                Add Doctor
              </Button>
            </Box>

            {/* Remove Doctor Card below */}
            <Grid container justifyContent="center">
              <Grid item xs={12} md={8} lg={6}>
                <Card className="placeholder-card">
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>Remove doctor by searching name or NIC</Typography>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={8}>
                        <TextField
                          fullWidth
                          label="Search by Name or NIC"
                          value={removeSearch}
                          onChange={(e) => setRemoveSearch(e.target.value)}
                          InputProps={{
                            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Button
                          fullWidth
                          variant="contained"
                          color="error"
                          startIcon={<Delete />}
                          onClick={removeSelected}
                        >
                          Remove Doctor
                        </Button>
                      </Grid>
                    </Grid>

                    {/* Doctor results table */}
                    {loading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <CircularProgress />
                      </Box>
                    ) : (
                      <TableContainer sx={{ mt: 3 }}>
                        <Table stickyHeader size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell padding="checkbox"></TableCell>
                              <TableCell><strong>Staff ID</strong></TableCell>
                              <TableCell><strong>Name</strong></TableCell>
                              <TableCell><strong>Specialty</strong></TableCell>
                              <TableCell><strong>NIC</strong></TableCell>
                              <TableCell><strong>Branch</strong></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {filteredDoctors.length > 0 ? (
                              filteredDoctors.map((d) => (
                                <TableRow key={d.staff_id} hover>
                                  <TableCell padding="checkbox">
                                    <Checkbox
                                      checked={selectedIds.includes(d.staff_id)}
                                      onChange={() => toggleSelect(d.staff_id)}
                                    />
                                  </TableCell>
                                  <TableCell>{d.staff_id}</TableCell>
                                  <TableCell>{d.name}</TableCell>
                                  <TableCell>{d.speciality}</TableCell>
                                  <TableCell>{d.nic || 'N/A'}</TableCell>
                                  <TableCell>{d.branch_name || 'N/A'}</TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={6} align="center">No doctors found</TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Manage Staff Tab */}
          <TabPanel value={tabValue} index={1}>
            {/* Centered Add Staff CTA */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 4 }}>
              <Typography variant="h5" align="center">Add a new Staff</Typography>
              <Button variant="contained" onClick={() => navigate('/dashboard/addstaff')}>
                Add Staff
              </Button>
            </Box>

            {/* Remove Staff Card below */}
            <Grid container justifyContent="center">
              <Grid item xs={12} md={8} lg={6}>
                <Card className="placeholder-card">
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>Remove staff by searching name or NIC</Typography>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={8}>
                        <TextField
                          fullWidth
                          label="Search by Name or NIC"
                          value={staffSearch}
                          onChange={(e) => setStaffSearch(e.target.value)}
                          InputProps={{
                            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Button
                          fullWidth
                          variant="contained"
                          color="error"
                          startIcon={<Delete />}
                          onClick={removeSelectedStaff}
                        >
                          Remove Staff
                        </Button>
                      </Grid>
                    </Grid>

                    {/* Staff table */}
                    {loading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <CircularProgress />
                      </Box>
                    ) : (
                      <TableContainer sx={{ mt: 3 }}>
                        <Table stickyHeader size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell padding="checkbox"></TableCell>
                              <TableCell><strong>Staff ID</strong></TableCell>
                              <TableCell><strong>Name</strong></TableCell>
                              <TableCell><strong>Category</strong></TableCell>
                              <TableCell><strong>NIC</strong></TableCell>
                              <TableCell><strong>Phone</strong></TableCell>
                              <TableCell><strong>Email</strong></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {filteredStaff.length > 0 ? (
                              filteredStaff.map((s) => (
                                <TableRow key={s.staff_id} hover>
                                  <TableCell padding="checkbox">
                                    <Checkbox
                                      checked={selectedStaffIds.includes(s.staff_id)}
                                      onChange={() => toggleStaffSelect(s.staff_id)}
                                    />
                                  </TableCell>
                                  <TableCell>{s.staff_id}</TableCell>
                                  <TableCell>{s.name}</TableCell>
                                  <TableCell>{s.category}</TableCell>
                                  <TableCell>{s.nic || 'N/A'}</TableCell>
                                  <TableCell>{s.phone_no}</TableCell>
                                  <TableCell>{s.email}</TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={7} align="center">No staff found</TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Generate Reports Tab */}
          <TabPanel value={tabValue} index={2}>
            <Card className="placeholder-card">
              <CardContent>
                <Box className="card-header" sx={{ justifyContent: 'center', mb: 3 }}>
                  <Assessment className="card-icon" />
                  <Typography variant="h4" className="card-title">
                    Generate Reports
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
                  Reports generation features are currently under development.
                </Typography>
                <Box className="placeholder-content">
                  <Assessment sx={{ fontSize: 80, color: '#cbd5e1' }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                    Coming Soon
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </TabPanel>
        </Paper>
      </Container>

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

export default BranchManagers;