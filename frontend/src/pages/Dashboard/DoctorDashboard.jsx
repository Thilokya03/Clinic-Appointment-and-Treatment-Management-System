import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "./Dashboard.css";

export default function DoctorDashboard() {
  const { user } = useAuth();

  const dashboardCards = [
    {
      title: "Manage Schedule",
      description: "Add, reschedule, or cancel appointments",
      icon: "📅",
      link: "/dashboard/doctorchange",
      color: "#2563eb"
    },
    {
      title: "Patient History",
      description: "View patient medical records and history",
      icon: "📋",
      link: "/dashboard/patient-history",
      color: "#9333ea"
    },
    {
      title: "My Schedule",
      description: "View your upcoming appointments",
      icon: "🗓️",
      link: "/dashboard/my-schedule",
      color: "#f97316"
    },
    {
      title: "Prescriptions",
      description: "Manage patient prescriptions",
      icon: "💊",
      link: "/dashboard/prescriptions",
      color: "#10b981"
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Doctor Dashboard</h1>
          <p className="dashboard-subtitle">
            Welcome back, Dr. {user?.name || user?.username}!
          </p>
        </div>
        <div className="user-badge doctor-badge">
          <span className="role-icon">👨‍⚕️</span>
          <span>Doctor</span>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
            👥
          </div>
          <div className="stat-content">
            <h3 className="stat-value">24</h3>
            <p className="stat-label">Patients Today</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}>
            ⏰
          </div>
          <div className="stat-content">
            <h3 className="stat-value">8</h3>
            <p className="stat-label">Pending Appointments</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}>
            ✅
          </div>
          <div className="stat-content">
            <h3 className="stat-value">16</h3>
            <p className="stat-label">Completed Today</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" }}>
            ⭐
          </div>
          <div className="stat-content">
            <h3 className="stat-value">4.9</h3>
            <p className="stat-label">Patient Rating</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {dashboardCards.map((card, index) => (
          <Link to={card.link} key={index} className="dashboard-card" style={{ "--card-color": card.color }}>
            <div className="card-icon">{card.icon}</div>
            <h3 className="card-title">{card.title}</h3>
            <p className="card-description">{card.description}</p>
            <div className="card-arrow">→</div>
          </Link>
        ))}
      </div>

      <div className="dashboard-section">
        <h2 className="section-title">Today's Schedule</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">👤</div>
            <div className="activity-content">
              <p className="activity-text"><strong>John Doe</strong> - General Checkup</p>
              <span className="activity-time">10:00 AM</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">👤</div>
            <div className="activity-content">
              <p className="activity-text"><strong>Mary Silva</strong> - Follow-up</p>
              <span className="activity-time">11:30 AM</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">👤</div>
            <div className="activity-content">
              <p className="activity-text"><strong>Peter Fernando</strong> - Consultation</p>
              <span className="activity-time">2:00 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
