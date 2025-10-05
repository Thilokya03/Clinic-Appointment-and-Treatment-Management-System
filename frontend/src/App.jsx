// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";

import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Register from "./pages/Register/Register";
import Doctors from "./pages/Doctor/Doctors";
import Dashboard from "./pages/Dashboard/Dashboard";

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