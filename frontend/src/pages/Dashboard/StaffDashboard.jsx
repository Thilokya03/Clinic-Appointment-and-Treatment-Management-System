import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "./Dashboard.css";

export default function StaffDashboard() {
  const { user } = useAuth();

  const dashboardCards = [
    {
      title: "Add Patient",
      description: "Register new patients into the system",
      icon: "👤",
      link: "/dashboard/add-patient",
      color: "#2563eb"
    },
    {
      title: "Manage Payments",
      description: "Process and manage patient payments",
      icon: "💳",
      link: "/dashboard/payments",
      color: "#9333ea"
    },
    {
      title: "Add Treatments",
      description: "Record patient treatments and procedures",
      icon: "💊",
      link: "/dashboard/add-treatment",
      color: "#f97316"
    },
    {
      title: "Doctor Schedule",
      description: "Manage doctor appointment schedules",
      icon: "📅",
      link: "/dashboard/doctor-schedule",
      color: "#10b981"
    },
    {
      title: "Insurance Companies",
      description: "Add and manage insurance providers",
      icon: "🏢",
      link: "/dashboard/insurance",
      color: "#f59e0b"
    },
    {
      title: "Treatment Catalogs",
      description: "Manage treatment and service catalogs",
      icon: "📚",
      link: "/dashboard/treatment-catalog",
      color: "#8b5cf6"
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Staff Dashboard</h1>
          <p className="dashboard-subtitle">
            Welcome back, {user?.name || user?.username}!
          </p>
        </div>
        <div className="user-badge staff-badge">
          <span className="role-icon">👥</span>
          <span>Staff</span>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
            👤
          </div>
          <div className="stat-content">
            <h3 className="stat-value">12</h3>
            <p className="stat-label">New Patients Today</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}>
            💳
          </div>
          <div className="stat-content">
            <h3 className="stat-value">45</h3>
            <p className="stat-label">Payments Processed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}>
            📅
          </div>
          <div className="stat-content">
            <h3 className="stat-value">28</h3>
            <p className="stat-label">Appointments Scheduled</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" }}>
            💊
          </div>
          <div className="stat-content">
            <h3 className="stat-value">67</h3>
            <p className="stat-label">Treatments Recorded</p>
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
        <h2 className="section-title">Recent Tasks</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">✅</div>
            <div className="activity-content">
              <p className="activity-text">Patient registration completed - ID: P1234</p>
              <span className="activity-time">30 minutes ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">💳</div>
            <div className="activity-content">
              <p className="activity-text">Payment processed - Rs. 5,000</p>
              <span className="activity-time">1 hour ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">📅</div>
            <div className="activity-content">
              <p className="activity-text">Appointment scheduled for Dr. Silva</p>
              <span className="activity-time">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
