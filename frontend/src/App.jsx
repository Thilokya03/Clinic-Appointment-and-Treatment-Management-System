import { useState , useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Login from './pages/Login/Login'
import Home from './pages/Home/Home'
import Navibar from './compornent/NaviBar/Navibar'
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import BranchManagerDashboard from './pages/Dashboard/BranchManagerDashboard';
import DoctorDashboard from './pages/Dashboard/DoctorDashboard';
import NonMedicalStaffDashboard from './pages/Dashboard/NonMedicalStaffDashboard';
import PatientDashboard from './pages/Dashboard/PatientDashboard';


function App() {

  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
      localStorage.setItem("theam", theme);
      console.log(theme);
  }, [theme])

  return (
    <>
      
      <Router>
        <Navibar theme={theme} setTheme={setTheme}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Dashboard routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/branch-manager" element={<BranchManagerDashboard />} />
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/staff" element={<NonMedicalStaffDashboard />} />
          <Route path="/patient" element={<PatientDashboard />} />
        </Routes>
      </Router>

    </>
  )
}

export default App
