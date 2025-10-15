import React from "react";
import Sidebar from "../../compornent/Sidebar";

export default function NonMedicalStaffDashboard() {
  return (
    <div className="flex">
      <Sidebar role="staff" />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Staff Dashboard</h1>
        <p>Staff-specific tasks and patient assistance data appear here.</p>
      </div>
    </div>
  );
}
