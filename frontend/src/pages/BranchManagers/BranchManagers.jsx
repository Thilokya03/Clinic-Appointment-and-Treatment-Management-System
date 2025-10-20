import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import {
  MedicalServices,
  Groups,
  Assessment,
  Search,
  Delete,
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
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [removeSearch, setRemoveSearch] = useState('');
  const [doctors, setDoctors] = useState([
    { id: 1, name: 'Dr. Aisha Fernando', specialty: 'Cardiology', ref: 'DR001', nic: '801234567V', dob: '1980-05-15' },
    { id: 2, name: 'Dr. Kamal Silva', specialty: 'Neurology', ref: 'DR002', nic: '781234568V', dob: '1978-12-20' },
    { id: 3, name: 'Dr. Nimal Perera', specialty: 'Dermatology', ref: 'DR003', nic: '751112223V', dob: '1975-11-12' },
  ]);
  const [selectedIds, setSelectedIds] = useState([]);
  // Staff state (dummy)
  const [staffSearch, setStaffSearch] = useState('');
  const [staff, setStaff] = useState([
    { id: 1, name: 'John Smith', role: 'Receptionist', nic: '901234567V', dob: '1990-03-10' },
    { id: 2, name: 'Maria Garcia', role: 'Nurse', nic: '851234568V', dob: '1985-07-22' },
    { id: 3, name: 'Sunil Kumar', role: 'Pharmacist', nic: '801112223V', dob: '1980-11-12' },
  ]);
  const [selectedStaffIds, setSelectedStaffIds] = useState([]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredStaff = staff.filter(s => {
    if (!staffSearch.trim()) return true;
    const q = staffSearch.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.nic.toLowerCase().includes(q);
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

  const navigate = useNavigate();

  const closeToast = () => {
    setToast(prev => ({ ...prev, open: false }));
  };

  const filteredDoctors = doctors.filter(d => {
    if (!removeSearch.trim()) return true;
    const q = removeSearch.toLowerCase();
    return d.name.toLowerCase().includes(q) || d.nic.toLowerCase().includes(q);
  });

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const removeSelected = () => {
    if (selectedIds.length === 0) {
      setToast({ open: true, message: 'Select at least one doctor to remove', severity: 'error' });
      return;
    }
    setDoctors(prev => prev.filter(d => !selectedIds.includes(d.id)));
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
              <Button variant="contained" onClick={() => navigate('/adddoctor')}>
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

                    {/* Dummy results table */}
                    <TableContainer sx={{ mt: 3 }}>
                      <Table stickyHeader size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell padding="checkbox"></TableCell>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell><strong>Specialty</strong></TableCell>
                            <TableCell><strong>Ref</strong></TableCell>
                            <TableCell><strong>NIC</strong></TableCell>
                            <TableCell><strong>DOB</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredDoctors.length > 0 ? (
                            filteredDoctors.map((d) => (
                              <TableRow key={d.id} hover>
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    checked={selectedIds.includes(d.id)}
                                    onChange={() => toggleSelect(d.id)}
                                  />
                                </TableCell>
                                <TableCell>{d.name}</TableCell>
                                <TableCell>{d.specialty}</TableCell>
                                <TableCell>{d.ref}</TableCell>
                                <TableCell>{d.nic}</TableCell>
                                <TableCell>{d.dob}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} align="center">No matches found</TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
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
              <Button variant="contained" onClick={() => navigate('/addstaff')}>
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

                    {/* Dummy staff table */}
                    <TableContainer sx={{ mt: 3 }}>
                      <Table stickyHeader size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell padding="checkbox"></TableCell>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell><strong>Role</strong></TableCell>
                            <TableCell><strong>NIC</strong></TableCell>
                            <TableCell><strong>DOB</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredStaff.length > 0 ? (
                            filteredStaff.map((s) => (
                              <TableRow key={s.id} hover>
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    checked={selectedStaffIds.includes(s.id)}
                                    onChange={() => toggleStaffSelect(s.id)}
                                  />
                                </TableCell>
                                <TableCell>{s.name}</TableCell>
                                <TableCell>{s.role}</TableCell>
                                <TableCell>{s.nic}</TableCell>
                                <TableCell>{s.dob}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} align="center">No matches found</TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
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