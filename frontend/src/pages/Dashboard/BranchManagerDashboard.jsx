import React from "react";
import Sidebar from "../../compornent/Sidebar";

export default function BranchManagerDashboard() {
  return (
    <div className="flex">
      <Sidebar role="manager" />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Branch Manager Dashboard</h1>
        <p>Branch manager overview and staff performance reports appear here.</p>
      </div>
    </div>
  );
}
