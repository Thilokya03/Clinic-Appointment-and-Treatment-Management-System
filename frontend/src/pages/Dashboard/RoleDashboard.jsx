import { useAuth } from "../../context/AuthContext";
import AdminDashboard from "./AdminDashboard";
import BranchManagerDashboard from "./BranchManagerDashboard";
import DoctorDashboard from "./DoctorDashboard";
import StaffDashboard from "./StaffDashboard";
import PatientDashboard from "./PatientDashboard";
import { Navigate } from "react-router-dom";

export default function RoleDashboard() {
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        fontSize: "1.2rem",
        color: "#64748b"
      }}>
        Loading dashboard...
      </div>
    );
  }

  // Render dashboard based on role
  switch (role) {
    case "admin":
    case "administrator":
      return <AdminDashboard />;
    
    case "branch_manager":
    case "manager":
      return <BranchManagerDashboard />;
    
    case "doctor":
      return <DoctorDashboard />;
    
    case "staff":
    case "non_medical_staff":
      return <StaffDashboard />;
    
    case "patient":
      return <PatientDashboard />;
    
    default:
      return <Navigate to="/login" replace />;
  }
}
