// src/pages/Staff/Staff.jsx
import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Grid,
  TextField,
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
} from "@mui/material";
import "./staff.css";

function a11yProps(index) {
  return { id: `staff-tab-${index}`, "aria-controls": `staff-tabpanel-${index}` };
}

export default function Staff() {
  const [tab, setTab] = useState(0);

  // --- Patients ---
  const [patients, setPatients] = useState([
    { id: "PAT-1001", name: "Samantha Perera", dob: "1997-05-12", phone: "+94 77 123 4567", insurance: "None" },
  ]);
  const [patientForm, setPatientForm] = useState({ name: "", dob: "", phone: "", email: "", insurance: "" });

  // --- Treatments / Catalog ---
  const [treatments, setTreatments] = useState([
    { code: "T001", name: "General Consultation", price: 1500 },
    { code: "T002", name: "ECG", price: 2500 },
  ]);
  const [treatmentForm, setTreatmentForm] = useState({ code: "", name: "", price: "" });

  // --- Doctor Schedules ---
  const [schedules, setSchedules] = useState([
    { id: "S001", doctor: "Dr. Aisha Fernando", branch: "Colombo", day: "Mon", start: "09:00", end: "13:00" },
  ]);
  const [scheduleForm, setScheduleForm] = useState({ doctor: "", branch: "", day: "", start: "", end: "" });

  // --- Insurance Companies ---
  const [insurances, setInsurances] = useState([{ id: "INS-01", name: "Ceylon Health", contact: "0123456789" }]);
  const [insuranceForm, setInsuranceForm] = useState({ id: "", name: "", contact: "" });

  // --- Payments ---
  const [invoices, setInvoices] = useState([
    { id: "INV-1001", patientId: "PAT-1001", patientName: "Samantha Perera", amount: 1500, paid: 0, status: "Pending" },
  ]);
  const [paymentForm, setPaymentForm] = useState({ invoiceId: "", amount: "", method: "Cash" });

  // --- UI feedback ---
  const [snack, setSnack] = useState({ open: false, severity: "success", message: "" });

  const handleTabChange = (_, newVal) => setTab(newVal);

  // --- Patients handlers ---
  const addPatient = (e) => {
    e.preventDefault();
    if (!patientForm.name || !patientForm.dob || !patientForm.phone) {
      setSnack({ open: true, severity: "error", message: "Please fill required patient fields." });
      return;
    }
    const id = `PAT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPatient = { id, ...patientForm };
    setPatients((p) => [newPatient, ...p]);
    setPatientForm({ name: "", dob: "", phone: "", email: "", insurance: "" });
    setSnack({ open: true, severity: "success", message: "Patient added." });
  };

  // --- Treatments handlers ---
  const addTreatment = (e) => {
    e.preventDefault();
    if (!treatmentForm.code || !treatmentForm.name || !treatmentForm.price) {
      setSnack({ open: true, severity: "error", message: "Please fill treatment code, name and price." });
      return;
    }
    setTreatments((t) => [{ ...treatmentForm, price: Number(treatmentForm.price) }, ...t]);
    setTreatmentForm({ code: "", name: "", price: "" });
    setSnack({ open: true, severity: "success", message: "Treatment added to catalog." });
  };

  // --- Schedule handlers ---
  const addSchedule = (e) => {
    e.preventDefault();
    if (!scheduleForm.doctor || !scheduleForm.branch || !scheduleForm.day || !scheduleForm.start || !scheduleForm.end) {
      setSnack({ open: true, severity: "error", message: "Please complete the schedule form." });
      return;
    }
    const id = `SCH-${Math.floor(100 + Math.random() * 900)}`;
    setSchedules((s) => [{ id, ...scheduleForm }, ...s]);
    setScheduleForm({ doctor: "", branch: "", day: "", start: "", end: "" });
    setSnack({ open: true, severity: "success", message: "Doctor schedule added." });
  };

  // --- Insurance handlers ---
  const addInsurance = (e) => {
    e.preventDefault();
    if (!insuranceForm.id || !insuranceForm.name) {
      setSnack({ open: true, severity: "error", message: "Please fill insurance ID and name." });
      return;
    }
    setInsurances((ins) => [{ ...insuranceForm }, ...ins]);
    setInsuranceForm({ id: "", name: "", contact: "" });
    setSnack({ open: true, severity: "success", message: "Insurance company added." });
  };

  // --- Payments handlers ---
  const recordPayment = (e) => {
    e.preventDefault();
    const invoiceIdx = invoices.findIndex((inv) => inv.id === paymentForm.invoiceId);
    if (invoiceIdx === -1) {
      setSnack({ open: true, severity: "error", message: "Invoice not found." });
      return;
    }
    const paidAmount = Number(paymentForm.amount);
    if (paidAmount <= 0) {
      setSnack({ open: true, severity: "error", message: "Invalid amount." });
      return;
    }
    setInvoices((inv) => {
      const copy = [...inv];
      copy[invoiceIdx] = { ...copy[invoiceIdx], paid: copy[invoiceIdx].paid + paidAmount };
      const isPaid = copy[invoiceIdx].paid >= copy[invoiceIdx].amount;
      copy[invoiceIdx].status = isPaid ? "Paid" : "Partially Paid";
      return copy;
    });
    setPaymentForm({ invoiceId: "", amount: "", method: "Cash" });
    setSnack({ open: true, severity: "success", message: "Payment recorded." });
  };

  // --- Utilities ---
  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  return (
    <Container maxWidth="xl" className="staff-container">
      <Box className="staff-shell">
        <header>
          <Typography variant="h4" className="staff-title">Staff Console</Typography>
          <Typography variant="subtitle1" className="staff-subtitle">Add patients, manage payments, schedules and catalogs</Typography>
        </header>

        <Paper elevation={2} sx={{ mt: 3 }}>
          <Tabs value={tab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" variant="scrollable" scrollButtons="auto">
            <Tab label="Add Patient" {...a11yProps(0)} />
            <Tab label="Manage Payments" {...a11yProps(1)} />
            <Tab label="Add Treatment" {...a11yProps(2)} />
            <Tab label="Doctor Schedule" {...a11yProps(3)} />
            <Tab label="Insurance Company" {...a11yProps(4)} />
            <Tab label="Treatments Catalog" {...a11yProps(5)} />
          </Tabs>
        </Paper>

        {/* --- Add Patient --- */}
        {tab === 0 && (
          <Box className="tab-panel">
            <form onSubmit={addPatient}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField label="Full Name" value={patientForm.name} onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })} fullWidth required />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField label="DOB (YYYY-MM-DD)" value={patientForm.dob} onChange={(e) => setPatientForm({ ...patientForm, dob: e.target.value })} fullWidth required />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField label="Phone" value={patientForm.phone} onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })} fullWidth required />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField label="Email" value={patientForm.email} onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })} fullWidth />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Insurance</InputLabel>
                    <Select label="Insurance" value={patientForm.insurance} onChange={(e) => setPatientForm({ ...patientForm, insurance: e.target.value })}>
                      <MenuItem value="">None</MenuItem>
                      {insurances.map((ins) => (<MenuItem key={ins.id} value={ins.name}>{ins.name}</MenuItem>))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                  <Button type="submit" variant="contained">Add Patient</Button>
                </Grid>
              </Grid>
            </form>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6">Recent Patients</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>DOB</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Insurance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patients.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.id}</TableCell>
                      <TableCell>{p.name}</TableCell>
                      <TableCell>{p.dob}</TableCell>
                      <TableCell>{p.phone}</TableCell>
                      <TableCell>{p.insurance || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        )}

        {/* --- Manage Payments --- */}
        {tab === 1 && (
          <Box className="tab-panel">
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <form onSubmit={recordPayment}>
                  <Typography variant="h6">Record Payment</Typography>
                  <FormControl fullWidth sx={{ mt: 1 }}>
                    <InputLabel>Invoice</InputLabel>
                    <Select label="Invoice" value={paymentForm.invoiceId} onChange={(e) => setPaymentForm({ ...paymentForm, invoiceId: e.target.value })}>
                      {invoices.map((inv) => (<MenuItem key={inv.id} value={inv.id}>{inv.id} — {inv.patientName} — LKR {inv.amount}</MenuItem>))}
                    </Select>
                  </FormControl>
                  <TextField label="Amount" type="number" value={paymentForm.amount} onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })} fullWidth sx={{ mt: 2 }} required />
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel>Method</InputLabel>
                    <Select label="Method" value={paymentForm.method} onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}>
                      <MenuItem value="Cash">Cash</MenuItem>
                      <MenuItem value="Card">Card</MenuItem>
                      <MenuItem value="Insurance">Insurance</MenuItem>
                    </Select>
                  </FormControl>
                  <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                    <Button type="submit" variant="contained">Save Payment</Button>
                  </Box>
                </form>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6">Invoices</Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Invoice</TableCell>
                      <TableCell>Patient</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Paid</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoices.map((inv) => (
                      <TableRow key={inv.id}>
                        <TableCell>{inv.id}</TableCell>
                        <TableCell>{inv.patientName}</TableCell>
                        <TableCell>{inv.amount}</TableCell>
                        <TableCell>{inv.paid}</TableCell>
                        <TableCell>{inv.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* --- Add Treatment --- */}
        {tab === 2 && (
          <Box className="tab-panel">
            <form onSubmit={addTreatment}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <TextField label="Code" value={treatmentForm.code} onChange={(e) => setTreatmentForm({ ...treatmentForm, code: e.target.value })} fullWidth required />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Treatment Name" value={treatmentForm.name} onChange={(e) => setTreatmentForm({ ...treatmentForm, name: e.target.value })} fullWidth required />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField label="Price (LKR)" type="number" value={treatmentForm.price} onChange={(e) => setTreatmentForm({ ...treatmentForm, price: e.target.value })} fullWidth required />
                </Grid>
                <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button type="submit" variant="contained">Add Treatment</Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        )}

        {/* --- Doctor Schedule --- */}
        {tab === 3 && (
          <Box className="tab-panel">
            <form onSubmit={addSchedule}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField label="Doctor" value={scheduleForm.doctor} onChange={(e) => setScheduleForm({ ...scheduleForm, doctor: e.target.value })} fullWidth required />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField label="Branch" value={scheduleForm.branch} onChange={(e) => setScheduleForm({ ...scheduleForm, branch: e.target.value })} fullWidth required />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField label="Day" value={scheduleForm.day} onChange={(e) => setScheduleForm({ ...scheduleForm, day: e.target.value })} fullWidth required placeholder="Mon/Tue..." />
                </Grid>
                <Grid item xs={6} md={2}>
                  <TextField label="Start (HH:MM)" value={scheduleForm.start} onChange={(e) => setScheduleForm({ ...scheduleForm, start: e.target.value })} fullWidth required />
                </Grid>
                <Grid item xs={6} md={2}>
                  <TextField label="End (HH:MM)" value={scheduleForm.end} onChange={(e) => setScheduleForm({ ...scheduleForm, end: e.target.value })} fullWidth required />
                </Grid>

                <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button type="submit" variant="contained">Add Schedule</Button>
                </Grid>
              </Grid>
            </form>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6">Schedules</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Doctor</TableCell>
                    <TableCell>Branch</TableCell>
                    <TableCell>Day</TableCell>
                    <TableCell>Start</TableCell>
                    <TableCell>End</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {schedules.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.id}</TableCell>
                      <TableCell>{s.doctor}</TableCell>
                      <TableCell>{s.branch}</TableCell>
                      <TableCell>{s.day}</TableCell>
                      <TableCell>{s.start}</TableCell>
                      <TableCell>{s.end}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        )}

        {/* --- Insurance Company --- */}
        {tab === 4 && (
          <Box className="tab-panel">
            <form onSubmit={addInsurance}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <TextField label="Insurance ID" value={insuranceForm.id} onChange={(e) => setInsuranceForm({ ...insuranceForm, id: e.target.value })} fullWidth required />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Name" value={insuranceForm.name} onChange={(e) => setInsuranceForm({ ...insuranceForm, name: e.target.value })} fullWidth required />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField label="Contact" value={insuranceForm.contact} onChange={(e) => setInsuranceForm({ ...insuranceForm, contact: e.target.value })} fullWidth />
                </Grid>
                <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button type="submit" variant="contained">Add Insurance</Button>
                </Grid>
              </Grid>
            </form>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6">Insurances</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Contact</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {insurances.map((ins) => (
                    <TableRow key={ins.id}>
                      <TableCell>{ins.id}</TableCell>
                      <TableCell>{ins.name}</TableCell>
                      <TableCell>{ins.contact}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        )}

        {/* --- Treatments Catalog --- */}
        {tab === 5 && (
          <Box className="tab-panel">
            <Typography variant="h6">Treatments Catalog</Typography>
            <Table size="small" sx={{ mt: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Price (LKR)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {treatments.map((t) => (
                  <TableRow key={t.code}>
                    <TableCell>{t.code}</TableCell>
                    <TableCell>{t.name}</TableCell>
                    <TableCell>{t.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}

        <Snackbar open={snack.open} autoHideDuration={3000} onClose={closeSnack}>
          <Alert severity={snack.severity} onClose={closeSnack} sx={{ width: "100%" }}>{snack.message}</Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}
