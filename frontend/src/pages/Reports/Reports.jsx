import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Assessment,
  CalendarToday,
  AttachMoney,
  Person,
  MedicalServices,
  AccountBalance,
  Refresh,
  Download,
  TrendingUp,
} from '@mui/icons-material';
import './Reports.css';

// Tab Panel Component
function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Reports() {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Report 1: Branch-wise appointment summary
  const [branchReport, setBranchReport] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Report 2: Doctor-wise revenue
  const [doctorRevenue, setDoctorRevenue] = useState([]);

  // Report 3: Outstanding balances
  const [outstandingBalances, setOutstandingBalances] = useState([]);

  // Report 4: Treatments per category
  const [treatmentStats, setTreatmentStats] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  // Report 5: Insurance vs Out-of-pocket
  const [insuranceReport, setInsuranceReport] = useState([]);

  const API_URL = 'http://localhost:3000/api';
  const getToken = () => localStorage.getItem('catms_token');

  useEffect(() => {
    // Set default start date to 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
  }, []);

  // Fetch Report 1: Branch-wise appointment summary
  const fetchBranchReport = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `${API_URL}/reports/branch-appointments?date=${selectedDate}`,
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
        `${API_URL}/reports/doctor-revenue`,
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
        `${API_URL}/reports/outstanding-balances`,
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

  // Fetch Report 4: Treatments per category
  const fetchTreatmentStats = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `${API_URL}/reports/treatment-stats?start_date=${startDate}&end_date=${endDate}`,
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

  // Fetch Report 5: Insurance vs Out-of-pocket
  const fetchInsuranceReport = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `${API_URL}/reports/insurance-comparison`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setInsuranceReport(response.data);
    } catch (err) {
      console.error('Error fetching insurance report:', err);
      setError(err.response?.data?.error || 'Error fetching insurance report');
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch when tab changes
  useEffect(() => {
    switch (tabValue) {
      case 0:
        fetchBranchReport();
        break;
      case 1:
        fetchDoctorRevenue();
        break;
      case 2:
        fetchOutstandingBalances();
        break;
      case 3:
        if (startDate && endDate) fetchTreatmentStats();
        break;
      case 4:
        fetchInsuranceReport();
        break;
      default:
        break;
    }
  }, [tabValue]);

  // Calculate totals for branch report
  const branchTotals = branchReport.reduce(
    (acc, row) => ({
      scheduled: acc.scheduled + (row.scheduled_count || 0),
      completed: acc.completed + (row.completed_count || 0),
      cancelled: acc.cancelled + (row.cancelled_count || 0),
    }),
    { scheduled: 0, completed: 0, cancelled: 0 }
  );

  // Calculate totals for doctor revenue
  const totalRevenue = doctorRevenue.reduce(
    (sum, doc) => sum + parseFloat(doc.total_revenue || 0),
    0
  );

  // Calculate totals for outstanding balances
  const totalOutstanding = outstandingBalances.reduce(
    (sum, patient) => sum + parseFloat(patient.Due_payment || 0),
    0
  );

  // Calculate totals for treatment stats
  const totalTreatments = treatmentStats.reduce(
    (sum, treatment) => sum + parseInt(treatment.treatment_count || 0),
    0
  );

  // Calculate totals for insurance
  const insuranceTotals = insuranceReport.reduce(
    (acc, row) => ({
      insurance: acc.insurance + parseFloat(row.total_insurance_paid || 0),
      patient: acc.patient + parseFloat(row.total_patient_paid || 0),
    }),
    { insurance: 0, patient: 0 }
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box className="reports-header" sx={{ mb: 4 }}>
        <Box className="reports-title" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Assessment sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
            Reports & Analytics
          </Typography>
        </Box>
        <Typography className="reports-subtitle" variant="h6" color="text.secondary">
          Comprehensive reports for clinic management and decision making
        </Typography>
      </Box>

      {/* Tabs */}
      <Paper className="reports-tabs" sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<CalendarToday />} label="Branch Appointments" />
          <Tab icon={<AttachMoney />} label="Doctor Revenue" />
          <Tab icon={<Person />} label="Outstanding Balances" />
          <Tab icon={<MedicalServices />} label="Treatment Statistics" />
          <Tab icon={<AccountBalance />} label="Insurance Analysis" />
        </Tabs>

        {/* Report 1: Branch-wise Appointment Summary */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Branch-wise Appointment Summary
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  label="Date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
                <Button
                  variant="contained"
                  startIcon={<Refresh />}
                  onClick={fetchBranchReport}
                  disabled={loading}
                >
                  Refresh
                </Button>
              </Box>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Summary Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                  <CardContent>
                    <Typography variant="h6">Scheduled</Typography>
                    <Typography variant="h3">{branchTotals.scheduled}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
                  <CardContent>
                    <Typography variant="h6">Completed</Typography>
                    <Typography variant="h3">{branchTotals.completed}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: 'error.light', color: 'error.contrastText' }}>
                  <CardContent>
                    <Typography variant="h6">Cancelled</Typography>
                    <Typography variant="h3">{branchTotals.cancelled}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {loading ? (
              <Box className="loading-container" sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer className="reports-table" component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.100' }}>
                      <TableCell><strong>Branch ID</strong></TableCell>
                      <TableCell><strong>Branch Name</strong></TableCell>
                      <TableCell align="center"><strong>Scheduled</strong></TableCell>
                      <TableCell align="center"><strong>Completed</strong></TableCell>
                      <TableCell align="center"><strong>Cancelled</strong></TableCell>
                      <TableCell align="center"><strong>Total</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {branchReport.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography color="text.secondary">
                            No appointment data for {selectedDate}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      branchReport.map((row) => (
                        <TableRow key={row.branch_id} hover>
                          <TableCell>{row.branch_id}</TableCell>
                          <TableCell>{row.branch_name}</TableCell>
                          <TableCell align="center">
                            <Chip label={row.scheduled_count || 0} color="primary" size="small" />
                          </TableCell>
                          <TableCell align="center">
                            <Chip label={row.completed_count || 0} color="success" size="small" />
                          </TableCell>
                          <TableCell align="center">
                            <Chip label={row.cancelled_count || 0} color="error" size="small" />
                          </TableCell>
                          <TableCell align="center">
                            <strong>
                              {(row.scheduled_count || 0) + (row.completed_count || 0) + (row.cancelled_count || 0)}
                            </strong>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </TabPanel>

        {/* Report 2: Doctor-wise Revenue */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Doctor-wise Revenue Report
              </Typography>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={fetchDoctorRevenue}
                disabled={loading}
              >
                Refresh
              </Button>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Total Revenue Card */}
            <Card sx={{ mb: 3, bgcolor: 'success.light', color: 'success.contrastText' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6">Total Revenue</Typography>
                    <Typography variant="h3">Rs. {totalRevenue.toFixed(2)}</Typography>
                  </Box>
                  <TrendingUp sx={{ fontSize: 60, opacity: 0.5 }} />
                </Box>
              </CardContent>
            </Card>

            {loading ? (
              <Box className="loading-container" sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer className="reports-table" component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.100' }}>
                      <TableCell><strong>Doctor ID</strong></TableCell>
                      <TableCell><strong>Doctor Name</strong></TableCell>
                      <TableCell align="right"><strong>Total Revenue (LKR)</strong></TableCell>
                      <TableCell align="center"><strong>Percentage</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {doctorRevenue.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography color="text.secondary">No revenue data available</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      doctorRevenue.map((doc) => {
                        const percentage = totalRevenue > 0 
                          ? ((parseFloat(doc.total_revenue) / totalRevenue) * 100).toFixed(1)
                          : 0;
                        return (
                          <TableRow key={doc.doctor_id} hover>
                            <TableCell>{doc.doctor_id}</TableCell>
                            <TableCell>{doc.doctor_name}</TableCell>
                            <TableCell align="right">
                              <Typography variant="h6" color="success.main">
                                Rs. {parseFloat(doc.total_revenue).toFixed(2)}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip label={`${percentage}%`} color="primary" />
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </TabPanel>

        {/* Report 3: Outstanding Balances */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Patients with Outstanding Balances
              </Typography>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={fetchOutstandingBalances}
                disabled={loading}
              >
                Refresh
              </Button>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Total Outstanding Card */}
            <Card sx={{ mb: 3, bgcolor: 'warning.light', color: 'warning.contrastText' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6">Total Outstanding</Typography>
                    <Typography variant="h3">Rs. {totalOutstanding.toFixed(2)}</Typography>
                    <Typography variant="body2">From {outstandingBalances.length} patients</Typography>
                  </Box>
                  <AttachMoney sx={{ fontSize: 60, opacity: 0.5 }} />
                </Box>
              </CardContent>
            </Card>

            {loading ? (
              <Box className="loading-container" sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer className="reports-table" component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.100' }}>
                      <TableCell><strong>Patient ID</strong></TableCell>
                      <TableCell><strong>Name</strong></TableCell>
                      <TableCell align="right"><strong>Total Amount</strong></TableCell>
                      <TableCell align="right"><strong>Patient Paid</strong></TableCell>
                      <TableCell align="right"><strong>Insurance Paid</strong></TableCell>
                      <TableCell align="right"><strong>Due Payment</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {outstandingBalances.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography color="text.secondary">
                            No outstanding balances found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      outstandingBalances.map((patient) => (
                        <TableRow key={patient.patient_id} hover>
                          <TableCell>{patient.patient_id}</TableCell>
                          <TableCell>{patient.name}</TableCell>
                          <TableCell align="right">Rs. {parseFloat(patient.total_amount || 0).toFixed(2)}</TableCell>
                          <TableCell align="right">Rs. {parseFloat(patient.patient_paid_amount || 0).toFixed(2)}</TableCell>
                          <TableCell align="right">Rs. {parseFloat(patient.insurance_paid_amount || 0).toFixed(2)}</TableCell>
                          <TableCell align="right">
                            <Typography variant="h6" color="error.main">
                              Rs. {parseFloat(patient.Due_payment).toFixed(2)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </TabPanel>

        {/* Report 4: Treatment Statistics */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Treatment Statistics by Category
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
                  startIcon={<Refresh />}
                  onClick={fetchTreatmentStats}
                  disabled={loading || !startDate || !endDate}
                >
                  Generate
                </Button>
              </Box>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Total Treatments Card */}
            <Card sx={{ mb: 3, bgcolor: 'info.light', color: 'info.contrastText' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6">Total Treatments</Typography>
                    <Typography variant="h3">{totalTreatments}</Typography>
                    <Typography variant="body2">
                      {startDate && endDate && `From ${startDate} to ${endDate}`}
                    </Typography>
                  </Box>
                  <MedicalServices sx={{ fontSize: 60, opacity: 0.5 }} />
                </Box>
              </CardContent>
            </Card>

            {loading ? (
              <Box className="loading-container" sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer className="reports-table" component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.100' }}>
                      <TableCell><strong>Treatment Name</strong></TableCell>
                      <TableCell align="center"><strong>Count</strong></TableCell>
                      <TableCell align="center"><strong>Percentage</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {treatmentStats.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          <Typography color="text.secondary">
                            No treatment data for selected period
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      treatmentStats.map((treatment) => {
                        const percentage = totalTreatments > 0
                          ? ((parseInt(treatment.treatment_count) / totalTreatments) * 100).toFixed(1)
                          : 0;
                        return (
                          <TableRow key={treatment.treatment_name} hover>
                            <TableCell>{treatment.treatment_name}</TableCell>
                            <TableCell align="center">
                              <Chip label={treatment.treatment_count} color="primary" />
                            </TableCell>
                            <TableCell align="center">
                              <Chip label={`${percentage}%`} color="secondary" />
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </TabPanel>

        {/* Report 5: Insurance vs Out-of-pocket */}
        <TabPanel value={tabValue} index={4}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Insurance Coverage vs Out-of-Pocket Payments
              </Typography>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={fetchInsuranceReport}
                disabled={loading}
              >
                Refresh
              </Button>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Summary Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                  <CardContent>
                    <Typography variant="h6">Insurance Paid</Typography>
                    <Typography variant="h3">Rs. {insuranceTotals.insurance.toFixed(2)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
                  <CardContent>
                    <Typography variant="h6">Patient Paid</Typography>
                    <Typography variant="h3">Rs. {insuranceTotals.patient.toFixed(2)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
                  <CardContent>
                    <Typography variant="h6">Total Payments</Typography>
                    <Typography variant="h3">
                      Rs. {(insuranceTotals.insurance + insuranceTotals.patient).toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {loading ? (
              <Box className="loading-container" sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer className="reports-table" component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.100' }}>
                      <TableCell><strong>Insurance Provider</strong></TableCell>
                      <TableCell align="right"><strong>Insurance Paid (LKR)</strong></TableCell>
                      <TableCell align="right"><strong>Patient Paid (LKR)</strong></TableCell>
                      <TableCell align="right"><strong>Total (LKR)</strong></TableCell>
                      <TableCell align="center"><strong>Insurance %</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {insuranceReport.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Typography color="text.secondary">
                            No insurance payment data available
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      insuranceReport.map((row) => {
                        const insuranceAmount = parseFloat(row.total_insurance_paid || 0);
                        const patientAmount = parseFloat(row.total_patient_paid || 0);
                        const total = insuranceAmount + patientAmount;
                        const insurancePercentage = total > 0
                          ? ((insuranceAmount / total) * 100).toFixed(1)
                          : 0;
                        
                        return (
                          <TableRow key={row.insurance_name || 'Unknown'} hover>
                            <TableCell>{row.insurance_name || 'No Insurance'}</TableCell>
                            <TableCell align="right">
                              <Typography color="primary.main">
                                Rs. {insuranceAmount.toFixed(2)}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography color="secondary.main">
                                Rs. {patientAmount.toFixed(2)}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <strong>Rs. {total.toFixed(2)}</strong>
                            </TableCell>
                            <TableCell align="center">
                              <Chip 
                                label={`${insurancePercentage}%`} 
                                color={insurancePercentage > 50 ? 'success' : 'warning'}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
}
