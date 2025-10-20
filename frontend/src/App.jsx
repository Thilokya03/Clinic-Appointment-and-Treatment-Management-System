// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";

import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Register from "./pages/Register/Register";
import Doctors from "./pages/Doctor/Doctors";
import Patient from "./pages/Patient/Patient";
import Dashboard from "./pages/Dashboard/Dashboard";
import BranchManagers from "./pages/BranchManagers/BranchManagers";
import Staff from "./pages/Staff/Staff";
import AddDoctor from "./pages/AddDoctor/AddDoctor";
import AddStaff from "./pages/AddStaff/AddStaff";
import DoctorDashboard from "./pages/DoctorDashboard/DoctorDashboard";
import DoctorChangeShedule from "./pages/DoctorChangeShedule/DoctorChangeShedule";

// Import Auth Context and Protected Route
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleDashboard from "./pages/Dashboard/RoleDashboard";

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
      <AuthProvider>
        <Routes>
          {/* LOGIN (no nav, no footer) */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* DASHBOARD (Protected Routes with Role-Based Access) */}
          <Route element={<DashboardLayout theme={theme} setTheme={setTheme} />}>
            <Route path="/dashboard">
              {/* Main Role-Based Dashboard - All authenticated users */}
              <Route index element={
                <ProtectedRoute>
                  <RoleDashboard />
                </ProtectedRoute>
              } />

              {/* Admin & Branch Manager Routes */}
              <Route path="branchmanagers" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <BranchManagers />
                </ProtectedRoute>
              } />

              <Route path="staff" element={
                <ProtectedRoute allowedRoles={['admin', 'branch_manager']}>
                  <Staff />
                </ProtectedRoute>
              } />

              <Route path="adddoctor" element={
                <ProtectedRoute allowedRoles={['admin', 'branch_manager']}>
                  <AddDoctor />
                </ProtectedRoute>
              } />

              <Route path="addstaff" element={
                <ProtectedRoute allowedRoles={['admin', 'branch_manager']}>
                  <AddStaff />
                </ProtectedRoute>
              } />

              {/* Doctor Routes */}
              <Route path="doctordashboard" element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <DoctorDashboard />
                </ProtectedRoute>
              } />

              <Route path="doctorchange" element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <DoctorChangeShedule />
                </ProtectedRoute>
              } />
            </Route>
          </Route>

          {/* PUBLIC PAGES (Navibar + Footer) */}
          <Route element={<BaseLayout theme={theme} setTheme={setTheme} />}>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/doctors" element={<Doctors />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}