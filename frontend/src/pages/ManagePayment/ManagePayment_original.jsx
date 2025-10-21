// src/pages/ManagePayment/ManagePayment.jsx
import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Payment as PaymentIcon,
  ArrowBack,
  Save,
} from '@mui/icons-material';
import './ManagePayment.css';

const API_URL = 'http://localhost:3000/api';

function ManagePayment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
    discount_amount: '',
    status: 'Pending',
    appointment_id: '',
    patient_id: ''
  });

  // Get token from localStorage
  const getToken = () => localStorage.getItem('token');

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
    setPaymentForm(prev => ({ ...prev, [field]: event.target.value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
      
      // Reset form
      setPaymentForm({
        payment_id: '',
        insurance_paid_amount: '',
        patient_paid_amount: '',
        discount_amount: '',
        status: 'Pending',
        appointment_id: '',
        patient_id: ''
      });
      
      // Navigate back after success
      setTimeout(() => {
        navigate('/staff');
      }, 1500);
    } catch (error) {
      console.error('Error recording payment:', error);
      showToast(error.response?.data?.error || 'Error recording payment', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/staff');
  };

  return (
    <Box className="manage-payment-container">
      <Container maxWidth="md" className="payment-content">
        {/* Header */}
        <Box className="payment-header">
          <PaymentIcon sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h1">Record Payment</Typography>
          <Typography variant="body1">
            Record a new payment transaction for patient services
          </Typography>
        </Box>

        {/* Payment Form Card */}
        <Card className="payment-card">
          {loading ? (
            <Box className="loading-spinner">
              <CircularProgress size={60} />
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Payment Details Section */}
              <Box className="form-section">
                <Typography className="form-section-title">
                  Payment Details
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Payment ID"
                      value={paymentForm.payment_id}
                      onChange={handlePaymentInputChange('payment_id')}
                      required
                      helperText="Auto-generated (e.g., PM001)"
                      variant="outlined"
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
                        <MenuItem value="Completed">Completed</MenuItem>
                        <MenuItem value="Failed">Failed</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>

              {/* Appointment & Patient Section */}
              <Box className="form-section">
                <Typography className="form-section-title">
                  Appointment & Patient Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Appointment ID"
                      value={paymentForm.appointment_id}
                      onChange={handlePaymentInputChange('appointment_id')}
                      required
                      variant="outlined"
                      helperText="Enter the appointment ID"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Patient ID"
                      value={paymentForm.patient_id}
                      onChange={handlePaymentInputChange('patient_id')}
                      required
                      variant="outlined"
                      helperText="Enter the patient ID"
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Payment Amounts Section */}
              <Box className="form-section">
                <Typography className="form-section-title">
                  Payment Breakdown
                </Typography>
                <Grid container spacing={3}>
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
                      helperText="Amount paid by insurance"
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
                      helperText="Amount paid by patient"
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
                      helperText="Discount applied"
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
                  Record Payment
                </Button>
              </Box>
            </form>
          )}
        </Card>
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
