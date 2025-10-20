const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

// CORS configuration - Allow any localhost origin
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Allow any localhost origin
        if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
            return callback(null, true);
        }
        
        callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

//-----Import routes-------
console.log('Loading routes...');
const staffRoutes = require("./Routes/staffRoutes");
console.log('✓ staffRoutes loaded');
const patientRoutes = require("./Routes/patientRoutes");
console.log('✓ patientRoutes loaded');
const branchRoutes = require("./Routes/branchRoutes")
console.log('✓ branchRoutes loaded');
const appointmentRoutes = require("./Routes/appointmentRoutes");
console.log('✓ appointmentRoutes loaded');
const paymentRoutes = require("./Routes/paymentRoutes");
console.log('✓ paymentRoutes loaded');
const treatmentRoutes = require("./Routes/treatmentRoutes");
const forgotPasswordRoutes = require('./Routes/forgotpasswordRoutes');
console.log('✓ treatmentRoutes loaded');
const insuranceRoutes = require("./Routes/insuranceRoutes");
console.log('✓ insuranceRoutes loaded');
const treatmentCatalogRoutes = require("./Routes/treatmentCatalogRoutes");
console.log('✓ treatmentCatalogRoutes loaded');
const doctorScheduleRoutes = require("./Routes/doctorScheduleRoutes");
console.log('✓ doctorScheduleRoutes loaded');
//-------------------------



//-----Use routes ---------
app.use("/api/staff", staffRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/branch", branchRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/treatment", treatmentRoutes);
app.use('/api/auth', forgotPasswordRoutes);
app.use("/api/insurance", insuranceRoutes);
app.use("/api/treatment-catalog", treatmentCatalogRoutes);
app.use("/api/doctor-schedule", doctorScheduleRoutes);
//-------------------------

const PORT = 3000;
const server = app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
    console.error('Server error:', error);
    process.exit(1);
});