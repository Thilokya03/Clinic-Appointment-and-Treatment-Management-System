import React, { useState } from 'react';
import { Container, Box, Card, CardContent, Typography, Grid, TextField, Button, Snackbar, Alert } from '@mui/material';

export default function AddDoctor() {
  const [form, setForm] = useState({
    name: '',
    nic: '',
    ref: '',
    dob: '',
    specialty: '',
  });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const update = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const onSubmit = () => {
    if (!form.name || !form.nic || !form.ref || !form.specialty) {
      setToast({ open: true, message: 'Please fill all required fields', severity: 'error' });
      return;
    }
    // Dummy submit
    setToast({ open: true, message: 'Doctor added (demo). Implement API next.', severity: 'success' });
    setForm({ name: '', nic: '', ref: '', dob: '', specialty: '' });
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Doctor Full Name *"
                value={form.name}
                onChange={update('name')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="NIC *"
                value={form.nic}
                onChange={update('nic')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Doctor Reference Number *"
                value={form.ref}
                onChange={update('ref')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Date of Birth"
                InputLabelProps={{ shrink: true }}
                value={form.dob}
                onChange={update('dob')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Specialty *"
                value={form.specialty}
                onChange={update('specialty')}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button variant="contained" size="large" onClick={onSubmit}>Add</Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Snackbar open={toast.open} autoHideDuration={3000} onClose={closeToast} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={closeToast} severity={toast.severity} variant="filled">{toast.message}</Alert>
      </Snackbar>
    </Container>
  );
}
