// src/pages/ManagePayment/ManagePayment.jsx - Updated to handle auto-generated payments
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Autocomplete,
} from '@mui/material';
import {
  Payment as PaymentIcon,
  ArrowBack,
  Save,
  Edit,
  Search,
} from '@mui/icons-material';
import './ManagePayment.css';

const API_URL = 'http://localhost:3000/api';

function ManagePayment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    payment_id: '',
    insurance_paid_amount: '',
    patient_paid_amount: '',
    discount_amount: 0,
    status: 'Pending',
    appointment_id: '',
    patient_id: '',
    total_amount: '',
    Due_payment: ''
  });

  // Get token from localStorage
  const getToken = () => localStorage.getItem('token');

  // Fetch all payments
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/payment`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
      showToast('Error loading payments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Show toast notification
  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  // Handle toast close
  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  // Handle input change
  const handlePaymentInputChange = (field) => (event) => {
    const value = event.target.value;
    setPaymentForm(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate due payment
      if (field === 'insurance_paid_amount' || field === 'patient_paid_amount' || field === 'discount_amount') {
        const total = parseFloat(updated.total_amount) || 0;
        const insurancePaid = parseFloat(updated.insurance_paid_amount) || 0;
        const patientPaid = parseFloat(updated.patient_paid_amount) || 0;
        const discount = parseFloat(updated.discount_amount) || 0;
        
        updated.Due_payment = (total - insurancePaid - patientPaid - discount).toFixed(2);
        
        // Auto-update status
        if (updated.Due_payment <= 0) {
          updated.status = 'Paid';
        } else if (insurancePaid > 0 || patientPaid > 0) {
          updated.status = 'Partial';
        }
      }
      
      return updated;
    });
  };

  // Select payment for editing
  const handleSelectPayment = (payment) => {
    setSelectedPayment(payment);
    setPaymentForm({
      payment_id: payment.payment_id,
      insurance_paid_amount: payment.insurance_paid_amount || '',
      patient_paid_amount: payment.patient_paid_amount || '',
      discount_amount: payment.discount_amount || 0,
      status: payment.status,
      appointment_id: payment.appointment_id,
      patient_id: payment.patient_id,
      total_amount: payment.total_amount,
      Due_payment: payment.Due_payment
    });
  };

  // Handle form submit (update payment)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!paymentForm.payment_id) {
      showToast('Please select a payment to update', 'error');
      return;
    }

    setLoading(true);
    try {
      await axios.put(`${API_URL}/payment/${paymentForm.payment_id}`, {
        insurance_paid_amount: parseFloat(paymentForm.insurance_paid_amount) || 0,
        patient_paid_amount: parseFloat(paymentForm.patient_paid_amount) || 0,
        discount_amount: parseFloat(paymentForm.discount_amount) || 0,
        status: paymentForm.status,
        Due_payment: parseFloat(paymentForm.Due_payment)
      }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      
      showToast('Payment updated successfully!', 'success');
      fetchPayments();
      
      // Reset form
      setSelectedPayment(null);
      setPaymentForm({
        payment_id: '',
        insurance_paid_amount: '',
        patient_paid_amount: '',
        discount_amount: 0,
        status: 'Pending',
        appointment_id: '',
        patient_id: '',
        total_amount: '',
        Due_payment: ''
      });
    } catch (error) {
      console.error('Error updating payment:', error);
      showToast(error.response?.data?.error || 'Error updating payment', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (selectedPayment) {
      setSelectedPayment(null);
      setPaymentForm({
        payment_id: '',
        insurance_paid_amount: '',
        patient_paid_amount: '',
        discount_amount: 0,
        status: 'Pending',
        appointment_id: '',
        patient_id: '',
        total_amount: '',
        Due_payment: ''
      });
    } else {
      navigate('/dashboard/staff');
    }
  };

  // Filter payments based on search
  const filteredPayments = payments.filter(payment =>
    payment.payment_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.appointment_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.patient_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'success';
      case 'Partial': return 'warning';
      case 'Pending': return 'info';
      case 'Voided': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box className="manage-payment-container">
      <Container maxWidth="lg" className="payment-content">
        {/* Header */}
        <Box className="payment-header">
          <PaymentIcon sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h1">Manage Payments</Typography>
          <Typography variant="body1">
            {selectedPayment ? 'Update payment details' : 'View and manage payment records'}
          </Typography>
        </Box>

        {/* Payment List or Update Form */}
        {!selectedPayment ? (
          <Card className="payment-card">
            <Box sx={{ p: 2 }}>
              <TextField
                fullWidth
                placeholder="Search by Payment ID, Appointment ID, or Patient ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                sx={{ mb: 3 }}
              />

              {loading ? (
                <Box className="loading-spinner">
                  <CircularProgress size={60} />
                </Box>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Payment ID</strong></TableCell>
                        <TableCell><strong>Appointment ID</strong></TableCell>
                        <TableCell><strong>Patient ID</strong></TableCell>
                        <TableCell align="right"><strong>Total (LKR)</strong></TableCell>
                        <TableCell align="right"><strong>Due (LKR)</strong></TableCell>
                        <TableCell><strong>Status</strong></TableCell>
                        <TableCell><strong>Action</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredPayments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} align="center">
                            <Typography color="text.secondary">
                              No payments found. Payments are automatically created when appointments are made.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredPayments.map((payment) => (
                          <TableRow key={payment.payment_id} hover>
                            <TableCell>{payment.payment_id}</TableCell>
                            <TableCell>{payment.appointment_id}</TableCell>
                            <TableCell>{payment.patient_id}</TableCell>
                            <TableCell align="right">{parseFloat(payment.total_amount).toFixed(2)}</TableCell>
                            <TableCell align="right">{parseFloat(payment.Due_payment).toFixed(2)}</TableCell>
                            <TableCell>
                              <Chip 
                                label={payment.status} 
                                color={getStatusColor(payment.status)} 
                                size="small" 
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton 
                                color="primary" 
                                onClick={() => handleSelectPayment(payment)}
                                size="small"
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

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  onClick={() => navigate('/dashboard/staff')}
                >
                  Back to Staff Dashboard
                </Button>
              </Box>
            </Box>
          </Card>
        ) : (
          <Card className="payment-card">
            {loading ? (
              <Box className="loading-spinner">
                <CircularProgress size={60} />
              </Box>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Payment Information Section */}
                <Box className="form-section">
                  <Typography className="form-section-title">
                    Payment Information (Read-Only)
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Payment ID"
                        value={paymentForm.payment_id}
                        disabled
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Appointment ID"
                        value={paymentForm.appointment_id}
                        disabled
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Patient ID"
                        value={paymentForm.patient_id}
                        disabled
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Payment Amounts Section */}
                <Box className="form-section">
                  <Typography className="form-section-title">
                    Payment Details
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Total Amount"
                        value={paymentForm.total_amount}
                        disabled
                        variant="outlined"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">LKR</InputAdornment>
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required variant="outlined">
                        <InputLabel>Payment Status</InputLabel>
                        <Select
                          value={paymentForm.status}
                          label="Payment Status"
                          onChange={handlePaymentInputChange('status')}
                        >
                          <MenuItem value="Pending">Pending</MenuItem>
                          <MenuItem value="Partial">Partial</MenuItem>
                          <MenuItem value="Paid">Paid</MenuItem>
                          <MenuItem value="Voided">Voided</MenuItem>
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
                        variant="outlined"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">LKR</InputAdornment>
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Patient Paid Amount"
                        type="number"
                        value={paymentForm.patient_paid_amount}
                        onChange={handlePaymentInputChange('patient_paid_amount')}
                        variant="outlined"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">LKR</InputAdornment>
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Discount Amount"
                        type="number"
                        value={paymentForm.discount_amount}
                        onChange={handlePaymentInputChange('discount_amount')}
                        variant="outlined"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">LKR</InputAdornment>
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Due Payment"
                        value={paymentForm.Due_payment}
                        disabled
                        variant="outlined"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">LKR</InputAdornment>
                        }}
                        helperText="Automatically calculated: Total - Insurance - Patient Paid - Discount"
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Action Buttons */}
                <Box className="button-group">
                  <Button
                    type="button"
                    className="cancel-button"
                    startIcon={<ArrowBack />}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="submit-button"
                    startIcon={<Save />}
                    disabled={loading}
                  >
                    Update Payment
                  </Button>
                </Box>
              </form>
            )}
          </Card>
        )}
      </Container>

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ManagePayment;
