import React, { useState } from 'react';
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
} from '@mui/material';
import {
  PersonAdd,
  Delete,
  Search,
  MedicalServices,
  Groups,
  Assessment,
} from '@mui/icons-material';
import './branchmanagers.css';

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
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('doctor');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteSearchQuery, setDeleteSearchQuery] = useState('');

  // Doctor State
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    specialty: '',
    dateOfBirth: '',
    doctorRefNumber: '',
    nic: ''
  });

  // Staff State
  const [staffForm, setStaffForm] = useState({
    name: '',
    position: '',
    dateOfBirth: '',
    nic: ''
  });

  // Mock Data
  const [doctors, setDoctors] = useState([
    {
      id: 1,
      name: 'Dr. Aisha Fernando',
      specialty: 'Cardiology',
      dateOfBirth: '1980-05-15',
      doctorRefNumber: 'DR001',
      nic: '801234567V'
    },
    {
      id: 2,
      name: 'Dr. Kamal Silva',
      specialty: 'Neurology',
      dateOfBirth: '1978-12-20',
      doctorRefNumber: 'DR002',
      nic: '781234568V'
    }
  ]);

  const [staff, setStaff] = useState([
    {
      id: 1,
      name: 'John Smith',
      position: 'Receptionist',
      dateOfBirth: '1990-03-10',
      nic: '901234567V'
    },
    {
      id: 2,
      name: 'Maria Garcia',
      position: 'Nurse',
      dateOfBirth: '1985-07-22',
      nic: '851234568V'
    }
  ]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSearchQuery('');
    setDeleteSearchQuery('');
  };

  const handleDoctorInputChange = (field) => (event) => {
    setDoctorForm(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleStaffInputChange = (field) => (event) => {
    setStaffForm(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const openAddDialog = (type) => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const addDoctor = () => {
    if (!doctorForm.name || !doctorForm.specialty || !doctorForm.doctorRefNumber || !doctorForm.nic) {
      setToast({ open: true, message: 'Please fill all required fields', severity: 'error' });
      return;
    }

    const newDoctor = {
      id: doctors.length + 1,
      ...doctorForm
    };

    setDoctors(prev => [...prev, newDoctor]);
    setDoctorForm({
      name: '',
      specialty: '',
      dateOfBirth: '',
      doctorRefNumber: '',
      nic: ''
    });
    setOpenDialog(false);
    setToast({ open: true, message: 'Doctor added successfully!', severity: 'success' });
  };

  const addStaff = () => {
    if (!staffForm.name || !staffForm.position || !staffForm.nic) {
      setToast({ open: true, message: 'Please fill all required fields', severity: 'error' });
      return;
    }

    const newStaff = {
      id: staff.length + 1,
      ...staffForm
    };

    setStaff(prev => [...prev, newStaff]);
    setStaffForm({
      name: '',
      position: '',
      dateOfBirth: '',
      nic: ''
    });
    setOpenDialog(false);
    setToast({ open: true, message: 'Staff member added successfully!', severity: 'success' });
  };

  const removeDoctor = () => {
    if (!deleteSearchQuery.trim()) {
      setToast({ open: true, message: 'Please enter search criteria', severity: 'error' });
      return;
    }

    const query = deleteSearchQuery.toLowerCase();
    const doctorToRemove = doctors.find(doctor =>
      doctor.name.toLowerCase().includes(query) ||
      doctor.doctorRefNumber.toLowerCase().includes(query) ||
      doctor.nic.toLowerCase().includes(query)
    );

    if (doctorToRemove) {
      setDoctors(prev => prev.filter(d => d.id !== doctorToRemove.id));
      setDeleteSearchQuery('');
      setToast({ open: true, message: 'Doctor removed successfully!', severity: 'success' });
    } else {
      setToast({ open: true, message: 'No doctor found with the given criteria', severity: 'error' });
    }
  };

  const removeStaff = () => {
    if (!deleteSearchQuery.trim()) {
      setToast({ open: true, message: 'Please enter search criteria', severity: 'error' });
      return;
    }

    const query = deleteSearchQuery.toLowerCase();
    const staffToRemove = staff.find(staffMember =>
      staffMember.name.toLowerCase().includes(query) ||
      staffMember.nic.toLowerCase().includes(query)
    );

    if (staffToRemove) {
      setStaff(prev => prev.filter(s => s.id !== staffToRemove.id));
      setDeleteSearchQuery('');
      setToast({ open: true, message: 'Staff member removed successfully!', severity: 'success' });
    } else {
      setToast({ open: true, message: 'No staff member found with the given criteria', severity: 'error' });
    }
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, open: false }));
  };

  const filteredDoctors = doctors.filter(doctor =>
    searchQuery === '' || 
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.doctorRefNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStaff = staff.filter(staffMember =>
    searchQuery === '' || 
    staffMember.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staffMember.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <Box className="tab-content">
              <Grid container spacing={4}>
                {/* Left Column - Action Cards */}
                <Grid item xs={12} md={4} lg={3}>
                  <Box className="actions-column">
                    {/* Add Doctor Card */}
                    <Card className="action-card">
                      <CardContent>
                        <Typography variant="h5" className="card-title">
                          Add New Doctor
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          Add a new doctor to the system
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<PersonAdd />}
                          onClick={() => openAddDialog('doctor')}
                          className="add-button"
                          fullWidth
                          size="large"
                        >
                          Add New Doctor
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Remove Doctor Card */}
                    <Card className="action-card">
                      <CardContent>
                        <Typography variant="h5" className="card-title">
                          Remove Doctor
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          Search and remove a doctor
                        </Typography>
                        <TextField
                          fullWidth
                          label="Search by Name, Ref Number, or NIC"
                          value={deleteSearchQuery}
                          onChange={(e) => setDeleteSearchQuery(e.target.value)}
                          className="search-field"
                          InputProps={{
                            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                          }}
                          sx={{ mb: 2 }}
                        />
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<Delete />}
                          onClick={removeDoctor}
                          className="remove-button"
                          fullWidth
                          size="large"
                        >
                          Remove Doctor
                        </Button>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>

                {/* Right Column - Current Doctors Card */}
                <Grid item xs={12} md={8} lg={9}>
                  <Box className="list-column">
                    <Card className="list-card">
                      <CardContent>
                        <Box className="list-header">
                          <Typography variant="h5" className="card-title">
                            Current Doctors ({doctors.length})
                          </Typography>
                          <TextField
                            size="small"
                            label="Search Doctors"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-field"
                            sx={{ minWidth: 250 }}
                            InputProps={{
                              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                          />
                        </Box>
                        
                        <TableContainer className="table-container">
                          <Table stickyHeader>
                            <TableHead>
                              <TableRow>
                                <TableCell><strong>Name</strong></TableCell>
                                <TableCell><strong>Specialty</strong></TableCell>
                                <TableCell><strong>Ref Number</strong></TableCell>
                                <TableCell><strong>NIC</strong></TableCell>
                                <TableCell><strong>Date of Birth</strong></TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {filteredDoctors.length > 0 ? (
                                filteredDoctors.map((doctor) => (
                                  <TableRow key={doctor.id} hover>
                                    <TableCell>{doctor.name}</TableCell>
                                    <TableCell>
                                      <Chip label={doctor.specialty} size="small" color="primary" />
                                    </TableCell>
                                    <TableCell>{doctor.doctorRefNumber}</TableCell>
                                    <TableCell>{doctor.nic}</TableCell>
                                    <TableCell>{doctor.dateOfBirth}</TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                    <Typography color="text.secondary">
                                      No doctors found
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>

          {/* Manage Staff Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box className="tab-content">
              <Grid container spacing={4}>
                {/* Left Column - Action Cards */}
                <Grid item xs={12} md={4} lg={3}>
                  <Box className="actions-column">
                    {/* Add Staff Card */}
                    <Card className="action-card">
                      <CardContent>
                        <Typography variant="h5" className="card-title">
                          Add New Staff
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          Add a new staff member to the system
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<PersonAdd />}
                          onClick={() => openAddDialog('staff')}
                          className="add-button"
                          fullWidth
                          size="large"
                        >
                          Add New Staff
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Remove Staff Card */}
                    <Card className="action-card">
                      <CardContent>
                        <Typography variant="h5" className="card-title">
                          Remove Staff
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          Search and remove a staff member
                        </Typography>
                        <TextField
                          fullWidth
                          label="Search by Name or NIC"
                          value={deleteSearchQuery}
                          onChange={(e) => setDeleteSearchQuery(e.target.value)}
                          className="search-field"
                          InputProps={{
                            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                          }}
                          sx={{ mb: 2 }}
                        />
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<Delete />}
                          onClick={removeStaff}
                          className="remove-button"
                          fullWidth
                          size="large"
                        >
                          Remove Staff
                        </Button>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>

                {/* Right Column - Current Staff Card */}
                <Grid item xs={12} md={8} lg={9}>
                  <Box className="list-column">
                    <Card className="list-card">
                      <CardContent>
                        <Box className="list-header">
                          <Typography variant="h5" className="card-title">
                            Current Staff ({staff.length})
                          </Typography>
                          <TextField
                            size="small"
                            label="Search Staff"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-field"
                            sx={{ minWidth: 250 }}
                            InputProps={{
                              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                          />
                        </Box>
                        
                        <TableContainer className="table-container">
                          <Table stickyHeader>
                            <TableHead>
                              <TableRow>
                                <TableCell><strong>Name</strong></TableCell>
                                <TableCell><strong>Position</strong></TableCell>
                                <TableCell><strong>NIC</strong></TableCell>
                                <TableCell><strong>Date of Birth</strong></TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {filteredStaff.length > 0 ? (
                                filteredStaff.map((staffMember) => (
                                  <TableRow key={staffMember.id} hover>
                                    <TableCell>{staffMember.name}</TableCell>
                                    <TableCell>
                                      <Chip label={staffMember.position} size="small" color="secondary" />
                                    </TableCell>
                                    <TableCell>{staffMember.nic}</TableCell>
                                    <TableCell>{staffMember.dateOfBirth}</TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                    <Typography color="text.secondary">
                                      No staff members found
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>

          {/* Generate Reports Tab */}
          <TabPanel value={tabValue} index={2}>
            <Card className="reports-card">
              <CardContent>
                <Typography variant="h4" className="card-title" align="center">
                  Reports Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 2 }}>
                  This section is under development. Reports generation features will be available soon.
                </Typography>
                <Box className="reports-placeholder">
                  <Assessment sx={{ fontSize: 80, color: '#cbd5e1' }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                    Reports Generation
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </TabPanel>
        </Paper>
      </Container>

      {/* Add Doctor/Staff Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogType === 'doctor' ? 'Add New Doctor' : 'Add New Staff Member'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {dialogType === 'doctor' ? (
              // Doctor Form
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name *"
                    value={doctorForm.name}
                    onChange={handleDoctorInputChange('name')}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Specialty *"
                    value={doctorForm.specialty}
                    onChange={handleDoctorInputChange('specialty')}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    type="date"
                    value={doctorForm.dateOfBirth}
                    onChange={handleDoctorInputChange('dateOfBirth')}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Doctor Reference Number *"
                    value={doctorForm.doctorRefNumber}
                    onChange={handleDoctorInputChange('doctorRefNumber')}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="NIC Number *"
                    value={doctorForm.nic}
                    onChange={handleDoctorInputChange('nic')}
                    required
                  />
                </Grid>
              </>
            ) : (
              // Staff Form
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name *"
                    value={staffForm.name}
                    onChange={handleStaffInputChange('name')}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Position *"
                    value={staffForm.position}
                    onChange={handleStaffInputChange('position')}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    type="date"
                    value={staffForm.dateOfBirth}
                    onChange={handleStaffInputChange('dateOfBirth')}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="NIC Number *"
                    value={staffForm.nic}
                    onChange={handleStaffInputChange('nic')}
                    required
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={dialogType === 'doctor' ? addDoctor : addStaff} 
            variant="contained"
          >
            {dialogType === 'doctor' ? 'Add Doctor' : 'Add Staff'}
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

export default BranchManagers;