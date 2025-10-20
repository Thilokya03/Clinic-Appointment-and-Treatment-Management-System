import { Card, CardContent, Typography, Avatar, Box, Button } from "@mui/material";

export default function PatientCard({ patient }) {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Avatar src={patient.image} alt={patient.name} sx={{ width: 56, height: 56 }} />
          <Box>
            <Typography variant="h6">{patient.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              Age: {patient.age} | Gender: {patient.gender}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2">
          Doctor: {patient.doctor}
        </Typography>
        <Typography variant="body2">
          Last Visit: {patient.lastVisit}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Upcoming Appointment: {patient.upcomingAppointment}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          href={patient.url}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
