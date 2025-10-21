import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  Divider,
  Avatar
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  LocalHospital as TreatmentIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  AccountBalance as BankIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import './PatientPaymentHistory.css';

const PatientPaymentHistory = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [payments, setPayments] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState({
    totalBilled: 0,
    totalPaid: 0,
    outstanding: 0
  });

  const getToken = () => localStorage.getItem('catms_token');

  useEffect(() => {
    fetchPatientData();
  }, []);

  const fetchPatientData = async () => {
    setLoading(true);
    setError('');

    try {
      const token = getToken();
      if (!token) {
        setError('Please log in to view your payment history');
        setLoading(false);
        return;
      }

      // Get current user info
      const userResponse = await axios.get('http://localhost:3000/api/patient/', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const patientId = userResponse.data.patient_id;

      // Fetch payments for this patient (backend uses authenticated user)
      const paymentsResponse = await axios.get(
        `http://localhost:3000/api/payment/`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setPayments(paymentsResponse.data || []);

      // Calculate summary
      const totalBilled = paymentsResponse.data.reduce((sum, p) => sum + parseFloat(p.total_amount || 0), 0);
      const totalPaid = paymentsResponse.data.reduce((sum, p) => 
        sum + parseFloat(p.patient_paid_amount || 0) + parseFloat(p.insurance_paid_amount || 0), 0);
      const outstanding = paymentsResponse.data.reduce((sum, p) => sum + parseFloat(p.Due_payment || 0), 0);

      setSummary({
        totalBilled,
        totalPaid,
        outstanding
      });

      // Fetch appointments to get treatments
      const appointmentsResponse = await axios.get(
        `http://localhost:3000/api/appointment/patient/${patientId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Fetch treatments for each appointment
      const allTreatments = [];
      for (const appointment of appointmentsResponse.data) {
        try {
          const treatmentResponse = await axios.get(
            `http://localhost:3000/api/treatment/${appointment.appointment_id}`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );

          const treatmentsWithDate = treatmentResponse.data.map(t => ({
            ...t,
            appointment_date: appointment.appointment_date,
            doctor_id: appointment.doctor_id
          }));

          allTreatments.push(...treatmentsWithDate);
        } catch (err) {
          console.error('Error fetching treatment:', err);
        }
      }

      setTreatments(allTreatments);

    } catch (err) {
      console.error('Error fetching patient data:', err);
      setError(err.response?.data?.error || 'Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'success';
      case 'partial':
        return 'warning';
      case 'pending':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box className="payment-history-container" sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <ReceiptIcon sx={{ mr: 1, fontSize: 40 }} />
        My Payment & Treatment History
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Billed
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
                    LKR {summary.totalBilled.toFixed(2)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <ReceiptIcon fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Paid
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
                    LKR {summary.totalPaid.toFixed(2)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <CheckIcon fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: summary.outstanding > 0 
              ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' 
              : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white' 
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Outstanding
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
                    LKR {summary.outstanding.toFixed(2)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  {summary.outstanding > 0 ? <WarningIcon fontSize="large" /> : <CheckIcon fontSize="large" />}
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab 
              icon={<MoneyIcon />} 
              label="Payment History" 
              iconPosition="start"
            />
            <Tab 
              icon={<TreatmentIcon />} 
              label="Treatment History" 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <CardContent>
          {/* Payment History Tab */}
          {activeTab === 0 && (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Payment Records ({payments.length})
              </Typography>

              {payments.length === 0 ? (
                <Alert severity="info">No payment records found</Alert>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableRow>
                        <TableCell><strong>Payment ID</strong></TableCell>
                        <TableCell><strong>Date</strong></TableCell>
                        <TableCell align="right"><strong>Total Amount</strong></TableCell>
                        <TableCell align="right"><strong>Paid by Me</strong></TableCell>
                        <TableCell align="right"><strong>Insurance Paid</strong></TableCell>
                        <TableCell align="right"><strong>Outstanding</strong></TableCell>
                        <TableCell align="center"><strong>Status</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment.payment_id} hover>
                          <TableCell>
                            <Chip 
                              label={payment.payment_id} 
                              size="small" 
                              icon={<ReceiptIcon />}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            {new Date(payment.payment_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </TableCell>
                          <TableCell align="right">
                            <strong>LKR {parseFloat(payment.total_amount || 0).toFixed(2)}</strong>
                          </TableCell>
                          <TableCell align="right">
                            LKR {parseFloat(payment.patient_paid_amount || 0).toFixed(2)}
                          </TableCell>
                          <TableCell align="right">
                            LKR {parseFloat(payment.insurance_paid_amount || 0).toFixed(2)}
                          </TableCell>
                          <TableCell align="right">
                            <Typography 
                              sx={{ 
                                color: parseFloat(payment.Due_payment) > 0 ? 'error.main' : 'success.main',
                                fontWeight: 'bold'
                              }}
                            >
                              LKR {parseFloat(payment.Due_payment || 0).toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={payment.payment_status || 'Unknown'}
                              color={getPaymentStatusColor(payment.payment_status)}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}

          {/* Treatment History Tab */}
          {activeTab === 1 && (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Treatment Records ({treatments.length})
              </Typography>

              {treatments.length === 0 ? (
                <Alert severity="info">No treatment records found</Alert>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableRow>
                        <TableCell><strong>Treatment ID</strong></TableCell>
                        <TableCell><strong>Date</strong></TableCell>
                        <TableCell><strong>Treatment Name</strong></TableCell>
                        <TableCell align="right"><strong>Fee</strong></TableCell>
                        <TableCell><strong>Description</strong></TableCell>
                        <TableCell><strong>Appointment ID</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {treatments.map((treatment) => (
                        <TableRow key={treatment.treatment_id} hover>
                          <TableCell>
                            <Chip 
                              label={treatment.treatment_id} 
                              size="small" 
                              icon={<TreatmentIcon />}
                              color="primary"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              {new Date(treatment.appointment_date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={treatment.treatment_name || 'N/A'} 
                              color="secondary" 
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography sx={{ fontWeight: 600, color: 'primary.main' }}>
                              {treatment.treatment_fee 
                                ? `LKR ${parseFloat(treatment.treatment_fee).toFixed(2)}` 
                                : '-'
                              }
                            </Typography>
                          </TableCell>
                          <TableCell>{treatment.description || '-'}</TableCell>
                          <TableCell>
                            <Chip 
                              label={treatment.appointment_id} 
                              size="small" 
                              variant="outlined"
                            />
                          </TableCell>
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
    </Box>
  );
};

export default PatientPaymentHistory;
