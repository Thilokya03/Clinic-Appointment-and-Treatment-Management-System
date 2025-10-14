import React from "react";
import Sidebar from "../../compornent/Sidebar";

export default function AdminDashboard() {
  return (
    <div className="flex">
      <Sidebar role="admin" />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p>Admin-specific tools and reports are displayed here.</p>
      </div>
    </div>
  );
}
