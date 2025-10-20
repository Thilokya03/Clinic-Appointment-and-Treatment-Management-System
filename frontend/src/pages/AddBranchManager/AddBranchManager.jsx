import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./addbranchmanager.css";

export default function AddBranchManager() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    phone: "",
    branch_id: ""
  });
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const token = localStorage.getItem('catms_token');
      const response = await axios.get('http://localhost:3000/api/branch', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBranches(response.data);
    } catch (err) {
      console.error('Error fetching branches:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('catms_token');
      await axios.post('http://localhost:3000/api/branch/managers', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard/branchmanagers');
      }, 1500);
    } catch (err) {
      console.error('Error adding branch manager:', err);
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to add branch manager');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-branch-manager-container">
      <div className="add-branch-manager-header">
        <h1>Add Branch Manager</h1>
        <button onClick={() => navigate('/dashboard/branchmanagers')} className="back-button">
          ← Back to Branch Managers
        </button>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="branch-manager-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter email address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter phone number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="branch_id">Branch</label>
            <select
              id="branch_id"
              name="branch_id"
              value={formData.branch_id}
              onChange={handleChange}
              required
            >
              <option value="">Select a branch</option>
              {branches.map((branch) => (
                <option key={branch.branch_id} value={branch.branch_id}>
                  {branch.name} ({branch.branch_id})
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              Branch manager added successfully! Redirecting...
            </div>
          )}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Adding...' : 'Add Branch Manager'}
          </button>
        </form>
      </div>
    </div>
  );
}
