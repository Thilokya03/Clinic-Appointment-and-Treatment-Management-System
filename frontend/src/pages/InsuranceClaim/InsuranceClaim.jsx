import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  IconButton,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import './InsuranceClaim.css';

const InsuranceClaim = () => {
  const [claims, setClaims] = useState([]);
  const [payments, setPayments] = useState([]);
  const [insuranceCompanies, setInsuranceCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    claim_id: '',
    insurance_id: '',
    percentage: '',
    payment_id: ''
  });

  const getToken = () => localStorage.getItem('catms_token');

  // Fetch all claims
  const fetchClaims = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await axios.get('http://localhost:3000/api/claim/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClaims(response.data);
    } catch (err) {
      console.error('Error fetching claims:', err);
      setError(err.response?.data?.error || 'Failed to fetch claims');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all payments
  const fetchPayments = async () => {
    try {
      const token = getToken();
      const response = await axios.get('http://localhost:3000/api/payment/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments(response.data);
    } catch (err) {
      console.error('Error fetching payments:', err);
    }
  };

  // Fetch insurance companies
  const fetchInsuranceCompanies = async () => {
    try {
      const token = getToken();
      const response = await axios.get('http://localhost:3000/api/insurance', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInsuranceCompanies(response.data);
    } catch (err) {
      console.error('Error fetching insurance companies:', err);
    }
  };

  useEffect(() => {
    fetchClaims();
    fetchPayments();
    fetchInsuranceCompanies();
  }, []);

  // Generate claim ID
  const generateClaimId = () => {
    const timestamp = Date.now().toString().slice(-3);
    return `CL${timestamp}`;
  };

  // Handle add claim
  const handleAddClaim = async () => {
    setError('');
    setSuccess('');

    // Validation
    if (!formData.insurance_id || !formData.percentage || !formData.payment_id) {
      setError('Please fill all required fields');
      return;
    }

    const percentage = parseFloat(formData.percentage);
    if (percentage <= 0 || percentage > 100) {
      setError('Percentage must be between 0 and 100');
      return;
    }

    try {
      const token = getToken();
      const claimData = {
        claim_id: formData.claim_id || generateClaimId(),
        insurance_id: formData.insurance_id,
        percentage: percentage,
        payment_id: formData.payment_id
      };

      const response = await axios.post(
        'http://localhost:3000/api/claim',
        claimData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccess(`Claim submitted successfully! Claim Amount: LKR ${response.data.claim_amount.toFixed(2)}`);
      setAddDialogOpen(false);
      setFormData({ claim_id: '', insurance_id: '', percentage: '', payment_id: '' });
      fetchClaims();
      fetchPayments(); // Refresh payments to show updated amounts
    } catch (err) {
      console.error('Error adding claim:', err);
      setError(err.response?.data?.error || 'Failed to submit claim');
    }
  };

  // Handle edit claim
  const handleEditClaim = async () => {
    setError('');
    setSuccess('');

    const percentage = parseFloat(formData.percentage);
    if (percentage <= 0 || percentage > 100) {
      setError('Percentage must be between 0 and 100');
      return;
    }

    try {
      const token = getToken();
      const response = await axios.put(
        `http://localhost:3000/api/claim/${selectedClaim.claim_id}`,
        { percentage: percentage },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccess(`Claim updated! New amount: LKR ${response.data.new_amount.toFixed(2)}`);
      setEditDialogOpen(false);
      setSelectedClaim(null);
      fetchClaims();
      fetchPayments();
    } catch (err) {
      console.error('Error updating claim:', err);
      setError(err.response?.data?.error || 'Failed to update claim');
    }
  };

  // Handle delete claim
  const handleDeleteClaim = async (claimId) => {
    if (!window.confirm('Are you sure you want to delete this claim?')) {
      return;
    }

    try {
      const token = getToken();
      const response = await axios.delete(
        `http://localhost:3000/api/claim/${claimId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccess(`Claim deleted! Refunded: LKR ${response.data.refunded_amount.toFixed(2)}`);
      fetchClaims();
      fetchPayments();
    } catch (err) {
      console.error('Error deleting claim:', err);
      setError(err.response?.data?.error || 'Failed to delete claim');
    }
  };

  // Open edit dialog
  const openEditDialog = (claim) => {
    setSelectedClaim(claim);
    setFormData({
      claim_id: claim.claim_id,
      insurance_id: claim.insurance_id,
      percentage: claim.percentage,
      payment_id: claim.payment_id
    });
    setEditDialogOpen(true);
  };

  // Open add dialog
  const openAddDialog = () => {
    setFormData({ claim_id: generateClaimId(), insurance_id: '', percentage: '', payment_id: '' });
    setAddDialogOpen(true);
  };

  return (
    <Box className="insurance-claim-container" sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          <ReceiptLongIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Insurance Claims Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={openAddDialog}
        >
          Submit New Claim
        </Button>
      </Box>

      {/* Success/Error Alerts */}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Claims Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Claim ID</strong></TableCell>
                <TableCell><strong>Patient Name</strong></TableCell>
                <TableCell><strong>Patient ID</strong></TableCell>
                <TableCell><strong>Payment ID</strong></TableCell>
                <TableCell><strong>Insurance Company</strong></TableCell>
                <TableCell align="right"><strong>Total Amount</strong></TableCell>
                <TableCell align="right"><strong>Coverage %</strong></TableCell>
                <TableCell align="right"><strong>Claim Amount</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {claims.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography variant="body1" color="text.secondary" sx={{ py: 3 }}>
                      No insurance claims found. Click "Submit New Claim" to add one.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                claims.map((claim) => (
                  <TableRow key={claim.claim_id} hover>
                    <TableCell>{claim.claim_id}</TableCell>
                    <TableCell>{claim.patient_name}</TableCell>
                    <TableCell>{claim.patient_id}</TableCell>
                    <TableCell>{claim.payment_id}</TableCell>
                    <TableCell>{claim.company_name}</TableCell>
                    <TableCell align="right">LKR {parseFloat(claim.total_amount).toFixed(2)}</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={`${parseFloat(claim.percentage).toFixed(0)}%`}
                        color="primary"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <strong>LKR {parseFloat(claim.claim_amount).toFixed(2)}</strong>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => openEditDialog(claim)}
                        title="Edit Claim"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDeleteClaim(claim.claim_id)}
                        title="Delete Claim"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add Claim Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Submit New Insurance Claim</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Claim ID"
                value={formData.claim_id}
                onChange={(e) => setFormData({ ...formData, claim_id: e.target.value })}
                disabled
                helperText="Auto-generated"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Payment</InputLabel>
                <Select
                  value={formData.payment_id}
                  onChange={(e) => setFormData({ ...formData, payment_id: e.target.value })}
                  label="Payment"
                >
                  {payments.map((payment) => (
                    <MenuItem key={payment.payment_id} value={payment.payment_id}>
                      {payment.payment_id} - {payment.appointment_id} (LKR {parseFloat(payment.total_amount).toFixed(2)})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Insurance Company</InputLabel>
                <Select
                  value={formData.insurance_id}
                  onChange={(e) => setFormData({ ...formData, insurance_id: e.target.value })}
                  label="Insurance Company"
                >
                  {insuranceCompanies.map((company) => (
                    <MenuItem key={company.insurance_id} value={company.insurance_id}>
                      {company.company_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                type="number"
                label="Coverage Percentage"
                value={formData.percentage}
                onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                inputProps={{ min: 0, max: 100, step: 0.01 }}
                helperText="Enter percentage (0-100)"
              />
            </Grid>
            {formData.payment_id && formData.percentage && (
              <Grid item xs={12}>
                <Alert severity="info">
                  <strong>Estimated Claim Amount:</strong> LKR{' '}
                  {(
                    (parseFloat(payments.find(p => p.payment_id === formData.payment_id)?.total_amount || 0) *
                      parseFloat(formData.percentage || 0)) /
                    100
                  ).toFixed(2)}
                </Alert>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddClaim} variant="contained" color="primary">
            Submit Claim
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Claim Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Insurance Claim</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Claim ID"
                value={formData.claim_id}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Payment ID"
                value={formData.payment_id}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                type="number"
                label="Coverage Percentage"
                value={formData.percentage}
                onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                inputProps={{ min: 0, max: 100, step: 0.01 }}
                helperText="Update percentage (0-100)"
              />
            </Grid>
            {selectedClaim && formData.percentage && (
              <Grid item xs={12}>
                <Alert severity="info">
                  <strong>New Claim Amount:</strong> LKR{' '}
                  {(
                    (parseFloat(selectedClaim.total_amount) * parseFloat(formData.percentage)) /
                    100
                  ).toFixed(2)}
                  <br />
                  <strong>Current Claim Amount:</strong> LKR {parseFloat(selectedClaim.claim_amount).toFixed(2)}
                </Alert>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditClaim} variant="contained" color="primary">
            Update Claim
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InsuranceClaim;
