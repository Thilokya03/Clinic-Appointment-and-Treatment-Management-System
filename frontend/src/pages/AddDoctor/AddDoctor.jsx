import React, { useState, useEffect } from 'react';
import { Container, Box, Card, CardContent, Typography, Grid, TextField, Button, Snackbar, Alert, MenuItem } from '@mui/material';
import axios from 'axios';

export default function AddDoctor() {
  const [form, setForm] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    phone_no: '',
    gender: '',
    nic: '',
    branch_id: '',
    specialty: '',
  });
  const [branches, setBranches] = useState([]);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);

  // Fetch branches on mount
  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const token = localStorage.getItem('catms_token');
      const response = await axios.get('http://localhost:3000/api/branch/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBranches(response.data);
    } catch (error) {
      console.error('Error fetching branches:', error);
      setToast({ open: true, message: 'Error loading branches', severity: 'error' });
    }
  };

  const update = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const onSubmit = async () => {
    // Validation
    if (!form.username || !form.name || !form.email || !form.password || 
        !form.phone_no || !form.gender || !form.branch_id || 
        !form.specialty) {
      setToast({ open: true, message: 'Please fill all required fields', severity: 'error' });
      return;
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(form.phone_no)) {
      setToast({ open: true, message: 'Phone number must be exactly 10 digits', severity: 'error' });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setToast({ open: true, message: 'Please enter a valid email address', severity: 'error' });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('catms_token');

      // Step 1: Create staff record with category = 'Doctor'
      const staffResponse = await axios.post(
        'http://localhost:3000/api/staff/staff',
        {
          username: form.username,
          name: form.name,
          category: 'Doctor',
          phone_no: form.phone_no,
          gender: form.gender,
          nic: form.nic || null,
          email: form.email,
          password: form.password,
          branch_id: form.branch_id
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const newStaffId = staffResponse.data.staff_id;

      // Step 2: Create doctor record
      await axios.post(
        'http://localhost:3000/api/staff/doctor',
        {
          staff_id: newStaffId,
          speciality: form.specialty
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setToast({ 
        open: true, 
        message: `Doctor added successfully! Staff ID: ${newStaffId}`, 
        severity: 'success' 
      });

      // Reset form
      setForm({
        username: '',
        name: '',
        email: '',
        password: '',
        phone_no: '',
        gender: '',
        nic: '',
        branch_id: '',
        specialty: '',
      });

    } catch (error) {
      console.error('Error adding doctor:', error);
      const errorMsg = error.response?.data?.error || 'Error adding doctor. Please try again.';
      setToast({ open: true, message: errorMsg, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const closeToast = () => setToast(prev => ({ ...prev, open: false }));

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Add Doctor</Typography>
        <Typography color="text.secondary" align="center">Enter doctor details below</Typography>
      </Box>

      <Card>
        <CardContent>
          <Grid container spacing={2}>
            {/* Username & Email */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username *"
                value={form.username}
                onChange={update('username')}
                placeholder="e.g., dr.smith"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email *"
                type="email"
                value={form.email}
                onChange={update('email')}
                placeholder="doctor@example.com"
              />
            </Grid>

            {/* Full Name */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Doctor Full Name *"
                value={form.name}
                onChange={update('name')}
                placeholder="Dr. John Smith"
              />
            </Grid>

            {/* Password */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password *"
                type="password"
                value={form.password}
                onChange={update('password')}
              />
            </Grid>

            {/* Phone Number */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number *"
                value={form.phone_no}
                onChange={update('phone_no')}
                placeholder="0771234567"
                inputProps={{ maxLength: 10 }}
                helperText="Enter 10 digit phone number"
              />
            </Grid>

            {/* Gender */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Gender *"
                value={form.gender}
                onChange={update('gender')}
              >
                <MenuItem value="">Select Gender</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </TextField>
            </Grid>

            {/* NIC */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="NIC (Optional)"
                value={form.nic}
                onChange={update('nic')}
                placeholder="123456789V"
                inputProps={{ maxLength: 20 }}
              />
            </Grid>

            {/* Branch */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Branch *"
                value={form.branch_id}
                onChange={update('branch_id')}
              >
                <MenuItem value="">Select Branch</MenuItem>
                {branches.map((branch) => (
                  <MenuItem key={branch.branch_id} value={branch.branch_id}>
                    {branch.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Specialty */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Specialty *"
                value={form.specialty}
                onChange={update('specialty')}
                placeholder="e.g., Cardiology"
                helperText="Medical specialty area"
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button 
                  variant="contained" 
                  size="large" 
                  onClick={onSubmit}
                  disabled={loading}
                >
                  {loading ? 'Adding Doctor...' : 'Add Doctor'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={closeToast} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={closeToast} severity={toast.severity} variant="filled">{toast.message}</Alert>
      </Snackbar>
    </Container>
  );
}
