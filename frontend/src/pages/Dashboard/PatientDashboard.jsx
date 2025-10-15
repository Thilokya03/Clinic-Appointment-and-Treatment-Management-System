import React from "react";
import Sidebar from "../../compornent/Sidebar";

export default function PatientDashboard() {
  return (
    <div className="flex">
      <Sidebar role="patient" />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Patient Dashboard</h1>
        <p>Patient-related details, appointments, and reports are shown here.</p>
      </div>
    </div>
  );
}
