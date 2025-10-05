const express = require('express');
const app = express();

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
app.use("/appointment", appointmentRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/treatment", treatmentRoutes);
//-------------------------

app.listen(3000, () => {
    console.log("server running at http://localhost:3000");
});