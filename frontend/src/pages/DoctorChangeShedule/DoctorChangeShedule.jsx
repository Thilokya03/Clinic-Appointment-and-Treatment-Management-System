import React, { useState } from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
} from '@mui/material';

export default function DoctorChangeShedule() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [schedule, setSchedule] = useState(
    days.map(() => ({ enabled: false, start: '', end: '' }))
  );
  const [reason, setReason] = useState('');

  const setField = (idx, field, value) => {
    setSchedule(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Change Schedule</Typography>
      </Box>

      {/* Top centered big box with 7 days */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Card sx={{ width: '100%', maxWidth: 900 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }} align="center">Weekly Working Schedule</Typography>
            <Grid container spacing={2}>
              {days.map((day, idx) => (
                <Grid item xs={12} key={day}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <Typography sx={{ fontWeight: 600 }}>{day}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <TextField
                        fullWidth
                        label="Start Time"
                        type="time"
                        InputLabelProps={{ shrink: true }}
                        value={schedule[idx].start}
                        onChange={(e) => setField(idx, 'start', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <TextField
                        fullWidth
                        label="End Time"
                        type="time"
                        InputLabelProps={{ shrink: true }}
                        value={schedule[idx].end}
                        onChange={(e) => setField(idx, 'end', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={schedule[idx].enabled}
                            onChange={(e) => setField(idx, 'enabled', e.target.checked)}
                          />
                        }
                        label="Working"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* Second box with description */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Card sx={{ width: '100%', maxWidth: 900 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }} align="center">Reason for Change</Typography>
            <TextField
              fullWidth
              multiline
              minRows={4}
              placeholder="Describe the reason for changing the schedule"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="contained">Submit</Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
