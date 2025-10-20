const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

//-----Import routes-------
const staffRoutes = require("./Routes/staffRoutes");
const patientRoutes = require("./Routes/patientRoutes");
const branchRoutes = require("./Routes/branchRoutes")
const appointmentRoutes = require("./Routes/appointmentRoutes");
const paymentRoutes = require("./Routes/paymentRoutes");
const treatmentRoutes = require("./Routes/treatmentRoutes");
//-------------------------

//-----Use routes ---------
app.use("/api/staff", staffRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/branch", branchRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/treatment", treatmentRoutes);
//-------------------------


// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
});

const PORT = process.env.SERVER_PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Database: ${process.env.DB_NAME}`);
    console.log(`Host: ${process.env.DB_HOST}`);
    
}).on('error', (err) => {
    console.error('❌ Server failed to start:', err.message);
    process.exit(1);
});