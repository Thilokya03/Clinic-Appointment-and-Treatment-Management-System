import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
} from '@mui/material';

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const appointments = [
    { id: 1, date: '2025-10-20', time: '10:00', description: 'Follow-up check' },
    { id: 2, date: '2025-10-21', time: '11:30', description: 'New patient consultation' },
    { id: 3, date: '2025-10-22', time: '14:15', description: 'Routine check-up' },
  ];

  const weeklySchedule = [
    { day: 'Monday', start: '09:00', end: '17:00', working: true },
    { day: 'Tuesday', start: '09:00', end: '17:00', working: true },
    { day: 'Wednesday', start: '09:00', end: '17:00', working: true },
    { day: 'Thursday', start: '09:00', end: '17:00', working: true },
    { day: 'Friday', start: '09:00', end: '17:00', working: true },
    { day: 'Saturday', start: '10:00', end: '14:00', working: true },
    { day: 'Sunday', start: '', end: '', working: false },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4, position: 'relative' }}>
      {/* Top row: Appointments (left) and Schedule (right) */}
      <Grid container spacing={2} alignItems="stretch">
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }} align="center">Appointments</Typography>
              <TableContainer>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Date</strong></TableCell>
                      <TableCell><strong>Time</strong></TableCell>
                      <TableCell><strong>Description</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {appointments.map(a => (
                      <TableRow key={a.id} hover>
                        <TableCell>{a.date}</TableCell>
                        <TableCell>{a.time}</TableCell>
                        <TableCell>{a.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Schedule</Typography>
              <Grid container spacing={1}>
                {weeklySchedule.map((d) => (
                  <Grid item xs={12} key={d.day}>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item xs={12} sm={4}>
                        <Typography sx={{ fontWeight: 600 }}>{d.day}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <TextField
                          fullWidth
                          size="small"
                          type="time"
                          label="Start"
                          InputLabelProps={{ shrink: true }}
                          value={d.start}
                          disabled
                        />
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <TextField
                          fullWidth
                          size="small"
                          type="time"
                          label="End"
                          InputLabelProps={{ shrink: true }}
                          value={d.end}
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <FormControlLabel control={<Checkbox checked={d.working} disabled />} label={d.working ? 'Working' : 'Not Working'} />
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Change Schedule button: below on small screens, fixed top-right on md+ */}
      <Box
        sx={{
          position: { xs: 'static', md: 'absolute' },
          top: { md: 40 },
          right: { md: 16 },
          display: 'flex',
          justifyContent: { xs: 'center', md: 'flex-end' },
          mt: { xs: 2, md: 0 },
        }}
      >
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ px: 3.5, py: 1.5, fontWeight: 700 }}
          onClick={() => navigate('/doctorchange')}
        >
          Change Schedule
        </Button>
      </Box>
    </Container>
  );
}
