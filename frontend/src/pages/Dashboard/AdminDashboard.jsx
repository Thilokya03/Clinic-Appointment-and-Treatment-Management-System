import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBranches: 0,
    branchManagers: 0,
    totalDoctors: 0,
    totalPatients: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('catms_token');
      const response = await axios.get('/api/branch/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const dashboardCards = [
    {
      title: "Manage Branches",
      description: "Add, edit, and manage clinic branches",
      icon: "🏥",
      link: "/dashboard/branches",
      color: "#2563eb"
    },
    {
      title: "Manage Branch Managers",
      description: "Assign and manage branch managers",
      icon: "👔",
      link: "/dashboard/branchmanagers",
      color: "#9333ea"
    },
    {
      title: "Generate Reports",
      description: "View and generate system-wide reports",
      icon: "📊",
      link: "/dashboard/reports",
      color: "#f97316"
    },
    {
      title: "System Settings",
      description: "Configure system settings and preferences",
      icon: "⚙️",
      link: "/dashboard/settings",
      color: "#10b981"
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Administrator Dashboard</h1>
          <p className="dashboard-subtitle">
            Welcome back, {user?.name || user?.username}!
          </p>
        </div>
        <div className="user-badge admin-badge">
          <span className="role-icon">👨‍💼</span>
          <span>Administrator</span>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
            🏥
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{loading ? '...' : stats.totalBranches}</h3>
            <p className="stat-label">Total Branches</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}>
            👥
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{loading ? '...' : stats.branchManagers}</h3>
            <p className="stat-label">Branch Managers</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}>
            �‍⚕️
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{loading ? '...' : stats.totalDoctors}</h3>
            <p className="stat-label">Total Doctors</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" }}>
            📋
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{loading ? '...' : stats.totalPatients}</h3>
            <p className="stat-label">Total Patients</p>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

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
        <h2 className="section-title">Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">✅</div>
            <div className="activity-content">
              <p className="activity-text">New branch manager assigned to Downtown Branch</p>
              <span className="activity-time">2 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">📄</div>
            <div className="activity-content">
              <p className="activity-text">Monthly report generated successfully</p>
              <span className="activity-time">5 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">🏥</div>
            <div className="activity-content">
              <p className="activity-text">New branch "Colombo Central" added to system</p>
              <span className="activity-time">Yesterday</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
