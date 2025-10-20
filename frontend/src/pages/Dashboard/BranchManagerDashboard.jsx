import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

export default function BranchManagerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalStaff: 0,
    todayAppointments: 0,
    branchRating: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('catms_token');
      
      // Fetch doctors count
      const doctorsRes = await axios.get('/api/staff/by-category/Doctor', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Fetch all staff count
      const staffRes = await axios.get('/api/staff/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setStats({
        totalDoctors: doctorsRes.data.length,
        totalStaff: staffRes.data.filter(s => s.category !== 'Doctor' && s.category !== 'Admin').length,
        todayAppointments: 0, // TODO: Implement appointments endpoint
        branchRating: 4.8
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const dashboardCards = [
    {
      title: "Manage Doctors",
      description: "Add, edit, and manage doctors in your branch",
      icon: "👨‍⚕️",
      link: "/dashboard/doctors",
      color: "#2563eb"
    },
    {
      title: "Manage Staff",
      description: "Oversee and manage branch staff members",
      icon: "👥",
      link: "/dashboard/staff",
      color: "#9333ea"
    },
    {
      title: "Generate Reports",
      description: "View and generate branch performance reports",
      icon: "📊",
      link: "/dashboard/reports",
      color: "#f97316"
    },
    {
      title: "Branch Settings",
      description: "Configure branch-specific settings",
      icon: "⚙️",
      link: "/dashboard/branch-settings",
      color: "#10b981"
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Branch Manager Dashboard</h1>
          <p className="dashboard-subtitle">
            Welcome back, {user?.name || user?.username}!
          </p>
        </div>
        <div className="user-badge manager-badge">
          <span className="role-icon">👔</span>
          <span>Branch Manager</span>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
            👨‍⚕️
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{loading ? '...' : stats.totalDoctors}</h3>
            <p className="stat-label">Total Doctors</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}>
            👥
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{loading ? '...' : stats.totalStaff}</h3>
            <p className="stat-label">Staff Members</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}>
            📅
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{loading ? '...' : stats.todayAppointments}</h3>
            <p className="stat-label">Appointments Today</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" }}>
            ⭐
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{loading ? '...' : stats.branchRating}</h3>
            <p className="stat-label">Branch Rating</p>
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
        <h2 className="section-title">Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">👨‍⚕️</div>
            <div className="activity-content">
              <p className="activity-text">Dr. Silva joined the branch</p>
              <span className="activity-time">1 hour ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">📊</div>
            <div className="activity-content">
              <p className="activity-text">Weekly performance report submitted</p>
              <span className="activity-time">3 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">✅</div>
            <div className="activity-content">
              <p className="activity-text">Staff training session completed</p>
              <span className="activity-time">Yesterday</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
