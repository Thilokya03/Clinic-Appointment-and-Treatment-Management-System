// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";

import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Register from "./pages/Register/Register";
import Doctors from "./pages/Doctor/Doctors";
import Dashboard from "./pages/Dashboard/Dashboard";
import BookAppointment from "./pages/BookAppointment/BookAppointment";
import BranchManagers from "./pages/BranchManagers/BranchManagers";
import Staff from "./pages/Staff/Staff";
import AddDoctor from "./pages/AddDoctor/AddDoctor";
import AddStaff from "./pages/AddStaff/AddStaff";
import DoctorDashboard from "./pages/DoctorDashboard/DoctorDashboard";
import DoctorChangeShedule from "./pages/DoctorChangeShedule/DoctorChangeShedule";
// NOTE: keep your folder name exactly as in your project: compornent
import BaseLayout from "./compornent/Layout/BaseLayout";
import DashboardLayout from "./compornent/Layout/DashboardLayout";
import AuthLayout from "./compornent/Layout/AuthLayout";

const getInitialTheme = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("theme") || "light";
  }
  return "light";
};

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body?.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <Router>
      <Routes>
        {/* LOGIN (no nav, no footer) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* DASHBOARD (Sidebar + Navibar + Footer) */}
        <Route element={<DashboardLayout theme={theme} setTheme={setTheme} />}>
          <Route path="/dashboard">
            <Route index element={<Dashboard />} />
            <Route path="branchmanagers" element={<BranchManagers />} />
            <Route path="staff" element={<Staff />} />
            <Route path="adddoctor" element={<AddDoctor />} />
            <Route path="addstaff" element={<AddStaff />} />
            <Route path="doctordashboard" element={<DoctorDashboard />} />
            <Route path="doctorchange" element={<DoctorChangeShedule />} />
          </Route>
        </Route>

        {/* PUBLIC PAGES (Navibar + Footer) */}
        <Route element={<BaseLayout theme={theme} setTheme={setTheme} />}>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/appointmentsbook" element={<BookAppointment />} />
          {/* Redirect old path to new dashboard-scoped path */}
          <Route path="/branchmanagers" element={<Navigate to="/dashboard/branchmanagers" replace />} />
          <Route path="/staff" element={<Navigate to="/dashboard/staff" replace />} />
          <Route path="/adddoctor" element={<Navigate to="/dashboard/adddoctor" replace />} />
          <Route path="/addstaff" element={<Navigate to="/dashboard/addstaff" replace />} />
          <Route path="/doctordashboard" element={<Navigate to="/dashboard/doctordashboard" replace />} />
          <Route path="/doctorchange" element={<Navigate to="/dashboard/doctorchange" replace />} />

        </Route>
      </Routes>
    </Router>
  );
}