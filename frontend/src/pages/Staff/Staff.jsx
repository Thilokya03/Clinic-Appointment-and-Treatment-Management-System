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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  PersonAdd,
  Payment,
  MedicalServices,
  Schedule,
  Business,
  LocalHospital,
  Add,
  Delete,
} from '@mui/icons-material';
import './staff.css';

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

const StaffPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // Form States
  const [patientForm, setPatientForm] = useState({
    fullName: '',
    nic: '',
    age: '',
    dob: ''
  });

  const [treatmentForm, setTreatmentForm] = useState({
    name: '',
    description: ''
  });

  const [insuranceForm, setInsuranceForm] = useState({
    companyName: '',
    percentage: '',
    description: ''
  });

  const [treatmentCatalogForm, setTreatmentCatalogForm] = useState({
    treatmentName: '',
    description: ''
  });

  const [paymentForm, setPaymentForm] = useState({
    patientId: '',
    amount: '',
    paymentMethod: '',
    description: ''
  });

  // Data States
  const [patients, setPatients] = useState([
    { id: 1, fullName: 'John Doe', nic: '901234567V', age: '32', dob: '1992-05-15' },
    { id: 2, fullName: 'Jane Smith', nic: '881234568V', age: '35', dob: '1989-08-22' }
  ]);

  const [treatments, setTreatments] = useState([
    { id: 1, name: 'Blood Test', description: 'Complete blood count test' },
    { id: 2, name: 'X-Ray', description: 'Chest X-ray examination' }
  ]);

  const [insuranceCompanies, setInsuranceCompanies] = useState([
    { id: 1, companyName: 'Ceylinco Life', percentage: '80%', description: 'Comprehensive health insurance' },
    { id: 2, companyName: 'AIA Insurance', percentage: '75%', description: 'Standard health coverage' }
  ]);

  const [treatmentCatalog, setTreatmentCatalog] = useState([
    { id: 1, treatmentName: 'Cardiac Surgery', description: 'Heart surgery procedures' },
    { id: 2, treatmentName: 'Physical Therapy', description: 'Rehabilitation exercises' }
  ]);

  const [payments, setPayments] = useState([
    { id: 1, patientId: 'P001', patientName: 'John Doe', amount: 'LKR 5,000', paymentMethod: 'Cash', date: '2024-01-15' },
    { id: 2, patientId: 'P002', patientName: 'Jane Smith', amount: 'LKR 3,500', paymentMethod: 'Card', date: '2024-01-16' }
  ]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const openAddDialog = (type) => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handlePatientInputChange = (field) => (event) => {
    setPatientForm(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleTreatmentInputChange = (field) => (event) => {
    setTreatmentForm(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleInsuranceInputChange = (field) => (event) => {
    setInsuranceForm(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleTreatmentCatalogInputChange = (field) => (event) => {
    setTreatmentCatalogForm(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handlePaymentInputChange = (field) => (event) => {
    setPaymentForm(prev => ({ ...prev, [field]: event.target.value }));
  };

  const addPatient = () => {
    if (!patientForm.fullName || !patientForm.nic || !patientForm.age) {
      setToast({ open: true, message: 'Please fill all required fields', severity: 'error' });
      return;
    }

    const newPatient = {
      id: patients.length + 1,
      ...patientForm
    };

    setPatients(prev => [...prev, newPatient]);
    setPatientForm({ fullName: '', nic: '', age: '', dob: '' });
    setOpenDialog(false);
    setToast({ open: true, message: 'Patient added successfully!', severity: 'success' });
  };

  const addTreatment = () => {
    if (!treatmentForm.name) {
      setToast({ open: true, message: 'Please enter treatment name', severity: 'error' });
      return;
    }

    const newTreatment = {
      id: treatments.length + 1,
      ...treatmentForm
    };

    setTreatments(prev => [...prev, newTreatment]);
    setTreatmentForm({ name: '', description: '' });
    setOpenDialog(false);
    setToast({ open: true, message: 'Treatment added successfully!', severity: 'success' });
  };

  const addInsuranceCompany = () => {
    if (!insuranceForm.companyName || !insuranceForm.percentage) {
      setToast({ open: true, message: 'Please fill all required fields', severity: 'error' });
      return;
    }

    const newInsurance = {
      id: insuranceCompanies.length + 1,
      ...insuranceForm
    };

    setInsuranceCompanies(prev => [...prev, newInsurance]);
    setInsuranceForm({ companyName: '', percentage: '', description: '' });
    setOpenDialog(false);
    setToast({ open: true, message: 'Insurance company added successfully!', severity: 'success' });
  };

  const addTreatmentCatalog = () => {
    if (!treatmentCatalogForm.treatmentName) {
      setToast({ open: true, message: 'Please enter treatment name', severity: 'error' });
      return;
    }

    const newCatalog = {
      id: treatmentCatalog.length + 1,
      ...treatmentCatalogForm
    };

    setTreatmentCatalog(prev => [...prev, newCatalog]);
    setTreatmentCatalogForm({ treatmentName: '', description: '' });
    setOpenDialog(false);
    setToast({ open: true, message: 'Treatment added to catalog successfully!', severity: 'success' });
  };

  const addPayment = () => {
    if (!paymentForm.patientId || !paymentForm.amount || !paymentForm.paymentMethod) {
      setToast({ open: true, message: 'Please fill all required fields', severity: 'error' });
      return;
    }

    const newPayment = {
      id: payments.length + 1,
      ...paymentForm,
      date: new Date().toISOString().split('T')[0]
    };

    setPayments(prev => [...prev, newPayment]);
    setPaymentForm({ patientId: '', amount: '', paymentMethod: '', description: '' });
    setOpenDialog(false);
    setToast({ open: true, message: 'Payment recorded successfully!', severity: 'success' });
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, open: false }));
  };

  return (
    <div className="staff-page-container">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box className="page-header">
          <Typography variant="h3" className="page-title">
            Staff Management Panel
          </Typography>
          <Typography variant="h6" className="page-subtitle">
            Manage patients, treatments, payments, and more
          </Typography>
        </Box>

        {/* Tabs */}
        <Paper className="tabs-paper">
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="staff management tabs"
            className="management-tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<PersonAdd />} label="Add Patient" />
            <Tab icon={<Payment />} label="Manage Payments" />
            <Tab icon={<MedicalServices />} label="Add Treatments" />
            <Tab icon={<Schedule />} label="Doctor Schedule" />
            <Tab icon={<Business />} label="Insurance Company" />
            <Tab icon={<LocalHospital />} label="Treatment Catalog" />
          </Tabs>
          {/* Add Patient Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box className="vertical-layout">
              {/* Simple Add Patient Box */}
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1, textAlign: 'left' }}>
                    Add New Patient
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'left' }}>
                    Register a new patient in the system by filling the form below
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      startIcon={<PersonAdd />}
                      onClick={() => openAddDialog('patient')}
                      size="large"
                    >
                      Add New Patient
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              {/* Registered Patients Card */}
              <Card className="list-card">
                <CardContent>
                  <Box className="card-header">
                    <Typography variant="h5" className="card-title">
                      Registered Patients ({patients.length})
                    </Typography>
                  </Box>
                  <TableContainer className="table-container">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Full Name</strong></TableCell>
                          <TableCell><strong>NIC</strong></TableCell>
                          <TableCell><strong>Age</strong></TableCell>
                          <TableCell><strong>Date of Birth</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {patients.map((patient) => (
                          <TableRow key={patient.id} hover>
                            <TableCell>{patient.fullName}</TableCell>
                            <TableCell>{patient.nic}</TableCell>
                            <TableCell>{patient.age}</TableCell>
                            <TableCell>{patient.dob}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Box>
          </TabPanel>

          {/* Manage Payments Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box className="vertical-layout">
              {/* Simple Record Payment Box */}
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1, textAlign: 'left' }}>
                    Record Payment
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'left' }}>
                    Record a new payment transaction for patient services
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      startIcon={<Payment />}
                      onClick={() => openAddDialog('payment')}
                      size="large"
                    >
                      Record Payment
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              {/* Payment History Card */}
              <Card className="list-card">
                <CardContent>
                  <Box className="card-header">
                    <Typography variant="h5" className="card-title">
                      Payment History ({payments.length})
                    </Typography>
                  </Box>
                  <TableContainer className="table-container">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Patient ID</strong></TableCell>
                          <TableCell><strong>Patient Name</strong></TableCell>
                          <TableCell><strong>Amount</strong></TableCell>
                          <TableCell><strong>Payment Method</strong></TableCell>
                          <TableCell><strong>Date</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {payments.map((payment) => (
                          <TableRow key={payment.id} hover>
                            <TableCell>{payment.patientId}</TableCell>
                            <TableCell>{payment.patientName}</TableCell>
                            <TableCell>{payment.amount}</TableCell>
                            <TableCell>
                              <Chip 
                                label={payment.paymentMethod} 
                                size="small" 
                                color={payment.paymentMethod === 'Cash' ? 'primary' : 'secondary'} 
                              />
                            </TableCell>
                            <TableCell>{payment.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Box>
          </TabPanel>

          {/* Add Treatments Tab */}
          <TabPanel value={tabValue} index={2}>
            <Box className="vertical-layout">
              {/* Simple Add Treatment Box */}
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1, textAlign: 'left' }}>
                    Add Treatment
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'left' }}>
                    Add a new treatment type to the system
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      startIcon={<MedicalServices />}
                      onClick={() => openAddDialog('treatment')}
                      size="large"
                    >
                      Add Treatment
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              {/* Available Treatments Card */}
              <Card className="list-card">
                <CardContent>
                  <Box className="card-header">
                    <Typography variant="h5" className="card-title">
                      Available Treatments ({treatments.length})
                    </Typography>
                  </Box>
                  <TableContainer className="table-container">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Treatment Name</strong></TableCell>
                          <TableCell><strong>Description</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {treatments.map((treatment) => (
                          <TableRow key={treatment.id} hover>
                            <TableCell>{treatment.name}</TableCell>
                            <TableCell>{treatment.description}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Box>
          </TabPanel>

          {/* Doctor Schedule Tab */}
          <TabPanel value={tabValue} index={3}>
            <Card className="placeholder-card">
              <CardContent>
                <Box className="card-header" sx={{ justifyContent: 'center', mb: 3 }}>
                  <Schedule className="card-icon" />
                  <Typography variant="h4" className="card-title">
                    Doctor Schedule Management
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
                  This feature is currently under development and will be available soon.
                </Typography>
                <Box className="placeholder-content">
                  <Schedule sx={{ fontSize: 80, color: '#cbd5e1' }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                    Coming Soon
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </TabPanel>

          {/* Insurance Company Tab */}
          <TabPanel value={tabValue} index={4}>
            <Box className="vertical-layout">
              {/* Simple Add Insurance Company Box */}
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1, textAlign: 'left' }}>
                    Add Insurance Company
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'left' }}>
                    Register a new insurance provider in the system
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      startIcon={<Business />}
                      onClick={() => openAddDialog('insurance')}
                      size="large"
                    >
                      Add Insurance Company
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              {/* Insurance Companies Card */}
              <Card className="list-card">
                <CardContent>
                  <Box className="card-header">
                    <Typography variant="h5" className="card-title">
                      Insurance Companies ({insuranceCompanies.length})
                    </Typography>
                  </Box>
                  <TableContainer className="table-container">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Company Name</strong></TableCell>
                          <TableCell><strong>Coverage %</strong></TableCell>
                          <TableCell><strong>Description</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {insuranceCompanies.map((company) => (
                          <TableRow key={company.id} hover>
                            <TableCell>{company.companyName}</TableCell>
                            <TableCell>
                              <Chip label={company.percentage} size="small" color="primary" />
                            </TableCell>
                            <TableCell>{company.description}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Box>
          </TabPanel>

          {/* Treatment Catalog Tab */}
          <TabPanel value={tabValue} index={5}>
            <Box className="vertical-layout">
              {/* Simple Add to Catalog Box */}
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1, textAlign: 'left' }}>
                    Add to Catalog
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'left' }}>
                    Add new treatment to the treatment catalog
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      startIcon={<LocalHospital />}
                      onClick={() => openAddDialog('treatmentCatalog')}
                      size="large"
                    >
                      Add to Catalog
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              {/* Treatment Catalog Card */}
              <Card className="list-card">
                <CardContent>
                  <Box className="card-header">
                    <Typography variant="h5" className="card-title">
                      Treatment Catalog ({treatmentCatalog.length})
                    </Typography>
                  </Box>
                  <TableContainer className="table-container">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Treatment Name</strong></TableCell>
                          <TableCell><strong>Description</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {treatmentCatalog.map((item) => (
                          <TableRow key={item.id} hover>
                            <TableCell>{item.treatmentName}</TableCell>
                            <TableCell>{item.description}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Box>
          </TabPanel>
        </Paper>
      </Container>

      {/* Add Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogType === 'patient' && 'Add New Patient'}
          {dialogType === 'payment' && 'Record Payment'}
          {dialogType === 'treatment' && 'Add Treatment'}
          {dialogType === 'insurance' && 'Add Insurance Company'}
          {dialogType === 'treatmentCatalog' && 'Add to Treatment Catalog'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* ... (Dialog form content remains the same as previous version) ... */}
            {dialogType === 'patient' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name *"
                    value={patientForm.fullName}
                    onChange={handlePatientInputChange('fullName')}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="NIC Number *"
                    value={patientForm.nic}
                    onChange={handlePatientInputChange('nic')}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Age *"
                    type="number"
                    value={patientForm.age}
                    onChange={handlePatientInputChange('age')}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    type="date"
                    value={patientForm.dob}
                    onChange={handlePatientInputChange('dob')}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </>
            )}

            {dialogType === 'payment' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Patient ID *"
                    value={paymentForm.patientId}
                    onChange={handlePaymentInputChange('patientId')}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Amount *"
                    value={paymentForm.amount}
                    onChange={handlePaymentInputChange('amount')}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      value={paymentForm.paymentMethod}
                      label="Payment Method"
                      onChange={handlePaymentInputChange('paymentMethod')}
                    >
                      <MenuItem value="Cash">Cash</MenuItem>
                      <MenuItem value="Card">Card</MenuItem>
                      <MenuItem value="Insurance">Insurance</MenuItem>
                      <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={3}
                    value={paymentForm.description}
                    onChange={handlePaymentInputChange('description')}
                  />
                </Grid>
              </>
            )}

            {dialogType === 'treatment' && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Treatment Name *"
                    value={treatmentForm.name}
                    onChange={handleTreatmentInputChange('name')}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={4}
                    value={treatmentForm.description}
                    onChange={handleTreatmentInputChange('description')}
                  />
                </Grid>
              </>
            )}

            {dialogType === 'insurance' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company Name *"
                    value={insuranceForm.companyName}
                    onChange={handleInsuranceInputChange('companyName')}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Coverage Percentage *"
                    value={insuranceForm.percentage}
                    onChange={handleInsuranceInputChange('percentage')}
                    placeholder="e.g., 80%"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={3}
                    value={insuranceForm.description}
                    onChange={handleInsuranceInputChange('description')}
                  />
                </Grid>
              </>
            )}

            {dialogType === 'treatmentCatalog' && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Treatment Name *"
                    value={treatmentCatalogForm.treatmentName}
                    onChange={handleTreatmentCatalogInputChange('treatmentName')}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={4}
                    value={treatmentCatalogForm.description}
                    onChange={handleTreatmentCatalogInputChange('description')}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={
              dialogType === 'patient' ? addPatient :
              dialogType === 'payment' ? addPayment :
              dialogType === 'treatment' ? addTreatment :
              dialogType === 'insurance' ? addInsuranceCompany :
              addTreatmentCatalog
            } 
            variant="contained"
          >
            {dialogType === 'patient' ? 'Add Patient' :
             dialogType === 'payment' ? 'Record Payment' :
             dialogType === 'treatment' ? 'Add Treatment' :
             dialogType === 'insurance' ? 'Add Company' :
             'Add to Catalog'}
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

export default StaffPage;