import { useState, useEffect, useRef } from "react";
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
    gender: "",
    nic: "",
    branch_id: ""
  });
  const [branches, setBranches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch branches on component mount
  useEffect(() => {
    fetchBranches();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch);
    setSearchTerm(branch.name);
    setFormData({ ...formData, branch_id: branch.branch_id });
    setShowDropdown(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
    if (!e.target.value) {
      setSelectedBranch(null);
      setFormData({ ...formData, branch_id: "" });
    }
  };

  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate phone number format (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Phone number must be exactly 10 digits');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('catms_token');
      
      // Prepare data for staff endpoint with category as 'Branch Manager'
      const staffData = {
        ...formData,
        phone_no: formData.phone,  // Map 'phone' to 'phone_no' for backend
        category: 'Branch Manager'
      };
      
      await axios.post('http://localhost:3000/api/staff/staff', staffData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard/branchmanagers');
      }, 1500);
    } catch (err) {
      console.error('Error adding branch manager:', err);
      setError(err.response?.data?.message || 'Failed to add branch manager');
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
            <label htmlFor="phone">Phone Number <span className="required">*</span></label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter 10-digit phone number (e.g., 0771234567)"
              pattern="[0-9]{10}"
              maxLength="10"
              title="Phone number must be exactly 10 digits"
            />
            <small style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              Must be exactly 10 digits
            </small>
          </div>

          <div className="form-group">
            <label>Gender <span className="required">*</span></label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === "Male"}
                  onChange={handleChange}
                  required
                />
                <span>Male</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === "Female"}
                  onChange={handleChange}
                  required
                />
                <span>Female</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="nic">NIC Number <span className="optional">(Optional)</span></label>
            <input
              type="text"
              id="nic"
              name="nic"
              value={formData.nic}
              onChange={handleChange}
              placeholder="Enter NIC number"
              maxLength="20"
            />
          </div>

          <div className="form-group" ref={dropdownRef}>
            <label htmlFor="branch_search">Branch <span className="required">*</span></label>
            <div className="search-dropdown">
              <input
                type="text"
                id="branch_search"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setShowDropdown(true)}
                required
                placeholder="Search branch by name..."
                autoComplete="off"
              />
              {showDropdown && filteredBranches.length > 0 && (
                <div className="dropdown-menu">
                  {filteredBranches.map((branch) => (
                    <div
                      key={branch.branch_id}
                      className="dropdown-item"
                      onClick={() => handleBranchSelect(branch)}
                    >
                      <div className="branch-info">
                        <span className="branch-name">{branch.name}</span>
                        <span className="branch-id">ID: {branch.branch_id}</span>
                      </div>
                      {branch.address && (
                        <span className="branch-address">{branch.address}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {showDropdown && searchTerm && filteredBranches.length === 0 && (
                <div className="dropdown-menu">
                  <div className="dropdown-item no-results">
                    No branches found
                  </div>
                </div>
              )}
            </div>
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
