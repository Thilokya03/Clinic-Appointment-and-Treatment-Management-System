import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "./Dashboard.css";

export default function PatientDashboard() {
  const { user } = useAuth();

  const dashboardCards = [
    {
      title: "Book Appointment",
      description: "Schedule a new appointment with a doctor",
      icon: "📅",
      link: "/dashboard/book-appointment",
      color: "#9333ea"
    },
    {
      title: "Payment History",
      description: "View and manage your payment history",
      icon: "💳",
      link: "/dashboard/my-payments",
      color: "#f97316"
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Patient Dashboard</h1>
          <p className="dashboard-subtitle">
            Welcome back, {user?.name || user?.username}!
          </p>
        </div>
        <div className="user-badge patient-badge">
          <span className="role-icon">👤</span>
          <span>Patient</span>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
            📅
          </div>
          <div className="stat-content">
            <h3 className="stat-value">2</h3>
            <p className="stat-label">Upcoming Appointments</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}>
            💊
          </div>
          <div className="stat-content">
            <h3 className="stat-value">3</h3>
            <p className="stat-label">Active Prescriptions</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}>
            📋
          </div>
          <div className="stat-content">
            <h3 className="stat-value">12</h3>
            <p className="stat-label">Medical Records</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" }}>
            ✅
          </div>
          <div className="stat-content">
            <h3 className="stat-value">28</h3>
            <p className="stat-label">Completed Visits</p>
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
        <h2 className="section-title">Upcoming Appointments</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">👨‍⚕️</div>
            <div className="activity-content">
              <p className="activity-text"><strong>Dr. Silva</strong> - General Checkup</p>
              <span className="activity-time">Tomorrow, 10:00 AM</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">👨‍⚕️</div>
            <div className="activity-content">
              <p className="activity-text"><strong>Dr. Fernando</strong> - Follow-up</p>
              <span className="activity-time">Friday, 2:00 PM</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2 className="section-title">Recent Medical Records</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">📄</div>
            <div className="activity-content">
              <p className="activity-text">Blood Test Results</p>
              <span className="activity-time">2 days ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">📄</div>
            <div className="activity-content">
              <p className="activity-text">X-Ray Report</p>
              <span className="activity-time">1 week ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
