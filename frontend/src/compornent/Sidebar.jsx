import React from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  ClipboardList,
  FileText,
  LogOut,
} from "lucide-react";

export default function Sidebar({ role }) {
  // Sidebar link items for each role
  const links = {
    admin: [
      { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={18} /> },
      { name: "Manage Doctors", path: "/admin/doctors", icon: <Users size={18} /> },
      { name: "Manage Staff", path: "/admin/staff", icon: <Users size={18} /> },
      { name: "Reports", path: "/admin/reports", icon: <FileText size={18} /> },
    ],

    doctor: [
      { name: "Dashboard", path: "/doctor", icon: <LayoutDashboard size={18} /> },
      { name: "My Appointments", path: "/doctor/appointments", icon: <CalendarCheck size={18} /> },
      { name: "Patient History", path: "/doctor/patients", icon: <ClipboardList size={18} /> },
    ],

    manager: [
      { name: "Dashboard", path: "/manager", icon: <LayoutDashboard size={18} /> },
      { name: "Branch Overview", path: "/manager/overview", icon: <FileText size={18} /> },
      { name: "Staff Performance", path: "/manager/staff", icon: <Users size={18} /> },
    ],

    staff: [
      { name: "Dashboard", path: "/staff", icon: <LayoutDashboard size={18} /> },
      { name: "Task List", path: "/staff/tasks", icon: <ClipboardList size={18} /> },
      { name: "Patients", path: "/staff/patients", icon: <Users size={18} /> },
    ],

    patient: [
      { name: "Dashboard", path: "/patient", icon: <LayoutDashboard size={18} /> },
      { name: "Book Appointment", path: "/patient/book", icon: <CalendarCheck size={18} /> },
      { name: "My Reports", path: "/patient/reports", icon: <FileText size={18} /> },
    ],
  };

  // Default to empty if role not found
  const roleLinks = links[role] || [];

  return (
    <div className="w-64 min-h-screen bg-pink-800 text-white flex flex-col">
      {/* Header */}
      <div className="p-4 font-bold text-xl text-center border-b border-pink-600">
        {role ? role.charAt(0).toUpperCase() + role.slice(1) : "User"} Panel
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2">
        {roleLinks.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            className="flex items-center space-x-2 p-2 rounded-md hover:bg-pink-700 transition-all duration-200"
          >
            {link.icon}
            <span>{link.name}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-pink-600">
        <button className="flex items-center space-x-2 w-full p-2 rounded-md hover:bg-pink-700 transition-all duration-200">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
