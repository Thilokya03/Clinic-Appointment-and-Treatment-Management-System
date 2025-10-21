import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import {
  Container,
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Divider,
  Chip,
} from '@mui/material';
import {
  Assessment,
  CalendarToday,
  AttachMoney,
  Person,
  MedicalServices,
  Refresh,
  Download,
  TrendingUp,
  Business,
} from '@mui/icons-material';

// Tab Panel Component
function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function BranchManagerReports() {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Summary stats
  const [summary, setSummary] = useState(null);

  // Report 1: Branch appointment summary
  const [branchReport, setBranchReport] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Report 2: Doctor-wise revenue
  const [doctorRevenue, setDoctorRevenue] = useState([]);

  // Report 3: Outstanding balances
  const [outstandingBalances, setOutstandingBalances] = useState([]);

  // Report 4: Treatments per category
  const [treatmentStats, setTreatmentStats] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const API_URL = 'http://localhost:3000/api';
  const getToken = () => localStorage.getItem('catms_token');

  useEffect(() => {
    // Set default start date to 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
    
    // Fetch summary on load
    fetchSummary();
  }, []);

  // Fetch Summary
  const fetchSummary = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `${API_URL}/reports/my-branch-summary`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setSummary(response.data);
    } catch (err) {
      console.error('Error fetching summary:', err);
      setError(err.response?.data?.error || 'Error fetching summary');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Report 1: Branch appointment summary
  const fetchBranchReport = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `${API_URL}/reports/my-branch-appointments?date=${selectedDate}`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setBranchReport(response.data);
    } catch (err) {
      console.error('Error fetching branch report:', err);
      setError(err.response?.data?.error || 'Error fetching branch appointments report');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Report 2: Doctor-wise revenue
  const fetchDoctorRevenue = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `${API_URL}/reports/my-branch-doctor-revenue`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setDoctorRevenue(response.data);
    } catch (err) {
      console.error('Error fetching doctor revenue:', err);
      setError(err.response?.data?.error || 'Error fetching doctor revenue report');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Report 3: Outstanding balances
  const fetchOutstandingBalances = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `${API_URL}/reports/my-branch-outstanding-balances`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setOutstandingBalances(response.data);
    } catch (err) {
      console.error('Error fetching outstanding balances:', err);
      setError(err.response?.data?.error || 'Error fetching outstanding balances');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Report 4: Treatment statistics
  const fetchTreatmentStats = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `${API_URL}/reports/my-branch-treatment-stats?start_date=${startDate}&end_date=${endDate}`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setTreatmentStats(response.data);
    } catch (err) {
      console.error('Error fetching treatment stats:', err);
      setError(err.response?.data?.error || 'Error fetching treatment statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Business color="primary" sx={{ fontSize: 40 }} />
          Branch Reports & Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {summary?.branch?.name || 'Loading branch information...'} - Comprehensive reports for branch management
        </Typography>
      </Box>

      {/* Summary Cards */}
      {summary && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <CalendarToday sx={{ fontSize: 40, color: 'white' }} />
                  <Typography variant="h4" fontWeight="bold" color="white">
                    {summary.total_appointments}
                  </Typography>
                </Box>
                <Typography variant="h6" color="white">Total Appointments</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <AttachMoney sx={{ fontSize: 40, color: 'white' }} />
                  <Typography variant="h4" fontWeight="bold" color="white">
                    {formatCurrency(summary.total_revenue)}
                  </Typography>
                </Box>
                <Typography variant="h6" color="white">Total Revenue</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <TrendingUp sx={{ fontSize: 40, color: 'white' }} />
                  <Typography variant="h4" fontWeight="bold" color="white">
                    {formatCurrency(summary.outstanding_balance)}
                  </Typography>
                </Box>
                <Typography variant="h6" color="white">Outstanding Balance</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Person color="primary" sx={{ fontSize: 40 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {summary.total_patients}
                  </Typography>
                </Box>
                <Typography variant="h6" color="text.secondary">Total Patients</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <MedicalServices color="primary" sx={{ fontSize: 40 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {summary.total_doctors}
                  </Typography>
                </Box>
                <Typography variant="h6" color="text.secondary">Total Doctors</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Person color="primary" sx={{ fontSize: 40 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {summary.total_staff}
                  </Typography>
                </Box>
                <Typography variant="h6" color="text.secondary">Total Staff Members</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Reports Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<CalendarToday />} label="Appointments" />
          <Tab icon={<AttachMoney />} label="Doctor Revenue" />
          <Tab icon={<Person />} label="Outstanding Balances" />
          <Tab icon={<MedicalServices />} label="Treatment Statistics" />
        </Tabs>

        {error && (
          <Alert severity="error" onClose={() => setError('')} sx={{ m: 2 }}>
            {error}
          </Alert>
        )}

        {/* Tab 1: Branch Appointments */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Branch Appointment Summary
            </Typography>
            <Box display="flex" gap={2} alignItems="center" mb={3}>
              <TextField
                label="Select Date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <Refresh />}
                onClick={fetchBranchReport}
                disabled={loading}
              >
                Generate Report
              </Button>
            </Box>

            {branchReport && (
              <Card sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {branchReport.branch_name}
                  </Typography>
                  {branchReport.address && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Address: {branchReport.address}
                    </Typography>
                  )}
                  {branchReport.branch_phone && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Phone: {branchReport.branch_phone}
                    </Typography>
                  )}
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                      <Box textAlign="center" p={2} bgcolor="#e3f2fd" borderRadius={2}>
                        <Typography variant="h4" color="primary">
                          {branchReport.scheduled_count || 0}
                        </Typography>
                        <Typography variant="body2">Scheduled</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Box textAlign="center" p={2} bgcolor="#e8f5e9" borderRadius={2}>
                        <Typography variant="h4" color="success.main">
                          {branchReport.completed_count || 0}
                        </Typography>
                        <Typography variant="body2">Completed</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Box textAlign="center" p={2} bgcolor="#ffebee" borderRadius={2}>
                        <Typography variant="h4" color="error">
                          {branchReport.cancelled_count || 0}
                        </Typography>
                        <Typography variant="body2">Cancelled</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Box textAlign="center" p={2} bgcolor="#f3e5f5" borderRadius={2}>
                        <Typography variant="h4" color="secondary">
                          {branchReport.total_doctors || 0}
                        </Typography>
                        <Typography variant="body2">Active Doctors</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}
          </Box>
        </TabPanel>

        {/* Tab 2: Doctor Revenue */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6">Doctor-wise Revenue Report</Typography>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <Refresh />}
                onClick={fetchDoctorRevenue}
                disabled={loading}
              >
                Generate Report
              </Button>
            </Box>

            {loading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : doctorRevenue.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Doctor ID</TableCell>
                      <TableCell>Doctor Name</TableCell>
                      <TableCell>Speciality</TableCell>
                      <TableCell align="right">Appointments</TableCell>
                      <TableCell align="right">Total Revenue</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {doctorRevenue.map((doctor, index) => (
                      <TableRow key={index}>
                        <TableCell>{doctor.doctor_id}</TableCell>
                        <TableCell>{doctor.doctor_name}</TableCell>
                        <TableCell>
                          <Chip label={doctor.speciality} color="primary" size="small" />
                        </TableCell>
                        <TableCell align="right">{doctor.total_appointments}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                          {formatCurrency(doctor.total_revenue)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                      <TableCell colSpan={3} sx={{ fontWeight: 'bold' }}>
                        Total
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        {doctorRevenue.reduce((sum, d) => sum + d.total_appointments, 0)}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                        {formatCurrency(doctorRevenue.reduce((sum, d) => sum + parseFloat(d.total_revenue), 0))}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info">No doctor revenue data available. Click "Generate Report" to fetch data.</Alert>
            )}
          </Box>
        </TabPanel>

        {/* Tab 3: Outstanding Balances */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6">Patients with Outstanding Balances</Typography>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <Refresh />}
                onClick={fetchOutstandingBalances}
                disabled={loading}
              >
                Generate Report
              </Button>
            </Box>

            {loading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : outstandingBalances.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Patient ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell align="right">Appointments</TableCell>
                      <TableCell align="right">Total Billed</TableCell>
                      <TableCell align="right">Total Paid</TableCell>
                      <TableCell align="right">Outstanding</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {outstandingBalances.map((patient, index) => (
                      <TableRow key={index}>
                        <TableCell>{patient.patient_id}</TableCell>
                        <TableCell>{patient.name}</TableCell>
                        <TableCell>
                          <Typography variant="body2">{patient.phone_no}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {patient.email}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">{patient.total_appointments}</TableCell>
                        <TableCell align="right">{formatCurrency(patient.total_amount)}</TableCell>
                        <TableCell align="right" sx={{ color: 'success.main' }}>
                          {formatCurrency(parseFloat(patient.patient_paid_amount) + parseFloat(patient.insurance_paid_amount))}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                          {formatCurrency(patient.Due_payment)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                      <TableCell colSpan={4} sx={{ fontWeight: 'bold' }}>
                        Total Outstanding
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(outstandingBalances.reduce((sum, p) => sum + parseFloat(p.total_amount), 0))}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                        {formatCurrency(outstandingBalances.reduce((sum, p) => sum + parseFloat(p.patient_paid_amount) + parseFloat(p.insurance_paid_amount), 0))}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                        {formatCurrency(outstandingBalances.reduce((sum, p) => sum + parseFloat(p.Due_payment), 0))}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="success">No outstanding balances! All payments are up to date.</Alert>
            )}
          </Box>
        </TabPanel>

        {/* Tab 4: Treatment Statistics */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Treatment Statistics by Category
            </Typography>
            <Box display="flex" gap={2} alignItems="center" mb={3} flexWrap="wrap">
              <TextField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
              <TextField
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <Refresh />}
                onClick={fetchTreatmentStats}
                disabled={loading}
              >
                Generate Report
              </Button>
            </Box>

            {loading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : treatmentStats.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Treatment Name</TableCell>
                      <TableCell align="right">Unit Cost</TableCell>
                      <TableCell align="right">Number of Treatments</TableCell>
                      <TableCell align="right">Total Revenue</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {treatmentStats.map((treatment, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Chip label={treatment.treatment_name} color="secondary" size="small" />
                        </TableCell>
                        <TableCell align="right">{formatCurrency(treatment.treatment_cost)}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          {treatment.treatment_count}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                          {formatCurrency(treatment.total_revenue)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                      <TableCell />
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        {treatmentStats.reduce((sum, t) => sum + t.treatment_count, 0)}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                        {formatCurrency(treatmentStats.reduce((sum, t) => sum + parseFloat(t.total_revenue), 0))}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info">
                No treatment data available for the selected period. Click "Generate Report" to fetch data.
              </Alert>
            )}
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
}
