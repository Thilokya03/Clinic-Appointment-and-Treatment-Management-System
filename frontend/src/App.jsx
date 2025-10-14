// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
<<<<<<< HEAD
import { useState, useEffect } from "react";
import "./App.css";
=======
import './App.css'
import Login from './pages/Login/Login'
import Home from './pages/Home/Home'
import Navibar from './compornent/NaviBar/Navibar'
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import BranchManagerDashboard from './pages/Dashboard/BranchManagerDashboard';
import DoctorDashboard from './pages/Dashboard/DoctorDashboard';
import NonMedicalStaffDashboard from './pages/Dashboard/NonMedicalStaffDashboard';
import PatientDashboard from './pages/Dashboard/PatientDashboard';

>>>>>>> Sarjana

import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Register from "./pages/Register/Register";
import Doctors from "./pages/Doctor/Doctors";
import Dashboard from "./pages/Dashboard/Dashboard";
import BookAppointment from "./pages/BookAppointment/BookAppointment";
import SetAppointment from "./pages/SetAppointment/SetAppointment";

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
<<<<<<< HEAD
        </Route>
=======

          {/* Dashboard routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/branch-manager" element={<BranchManagerDashboard />} />
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/staff" element={<NonMedicalStaffDashboard />} />
          <Route path="/patient" element={<PatientDashboard />} />
        </Routes>
      </Router>
>>>>>>> Sarjana

        {/* DASHBOARD (Sidebar + Navibar + Footer) */}
        <Route element={<DashboardLayout theme={theme} setTheme={setTheme} />}>
          <Route path="/dashboard">
            <Route index element={<Dashboard />} />
            <Route path="appointments" element={<SetAppointment />} />
            <Route path="appointmentsbook" element={<BookAppointment />} />
          </Route>
        </Route>

        {/* PUBLIC PAGES (Navibar + Footer) */}
        <Route element={<BaseLayout theme={theme} setTheme={setTheme} />}>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/doctors" element={<Doctors />} />
        </Route>
      </Routes>
    </Router>
  );
}
