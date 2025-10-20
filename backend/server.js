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

app.listen(3000, () => {
    console.log("server running at http://localhost:3000");
});