import React from "react";
import Sidebar from "../../compornent/Sidebar";

export default function DoctorDashboard() {
  return (
    <div className="flex">
      <Sidebar role="doctor" />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Doctor Dashboard</h1>
        <p>Doctor-specific content goes here.</p>
      </div>
    </div>
  );
}
