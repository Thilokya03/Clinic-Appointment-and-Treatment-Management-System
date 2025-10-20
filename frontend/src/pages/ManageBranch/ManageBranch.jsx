import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ManageBranch.css';

export default function ManageBranch() {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('catms_token');
      const response = await axios.get('/api/branch', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBranches(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching branches:', err);
      setError('Failed to load branches. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (branchId) => {
    setSelectedBranches(prev => {
      if (prev.includes(branchId)) {
        return prev.filter(id => id !== branchId);
      } else {
        return [...prev, branchId];
      }
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedBranches(branches.map(b => b.branch_id));
    } else {
      setSelectedBranches([]);
    }
  };

  const handleRemoveBranches = async () => {
    if (selectedBranches.length === 0) {
      alert('Please select at least one branch to remove.');
      return;
    }

    const confirmMessage = `Are you sure you want to delete ${selectedBranches.length} branch(es)?\n\nWARNING: This will permanently delete all associated data including:\n- Doctors\n- Staff\n- Branch Managers\n- Patients\n- Appointments\n- Treatments\n\nThis action cannot be undone!`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const token = localStorage.getItem('catms_token');
      const deletePromises = selectedBranches.map(branchId =>
        axios.delete(`/api/branch/${branchId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      );

      await Promise.all(deletePromises);
      
      setSuccessMessage(`Successfully deleted ${selectedBranches.length} branch(es).`);
      setSelectedBranches([]);
      fetchBranches();
      
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      console.error('Error deleting branches:', err);
      if (err.response?.status === 500) {
        setError('Cannot delete branch. Please remove all associated staff, doctors, and managers first.');
      } else {
        setError('Failed to delete branches. Please try again.');
      }
      setTimeout(() => setError(null), 5000);
    }
  };

  return (
    <div className="manage-branch-container">
      <div className="manage-branch-header">
        <h1 className="manage-branch-title">Manage Branches</h1>
        <p className="manage-branch-subtitle">View, manage, and delete clinic branches</p>
      </div>

      <div className="manage-branch-actions">
        <button 
          className="btn-add-branch"
          onClick={() => navigate('/dashboard/addbranch')}
        >
          ➕ Add New Branch
        </button>
        <button 
          className="btn-remove-branch"
          onClick={handleRemoveBranches}
          disabled={selectedBranches.length === 0}
        >
          🗑️ Remove Selected ({selectedBranches.length})
        </button>
      </div>

      {error && (
        <div className="message-box error-box">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="message-box success-box">
          {successMessage}
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading branches...</p>
        </div>
      ) : branches.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏥</div>
          <h3>No Branches Found</h3>
          <p>Start by adding your first clinic branch</p>
          <button 
            className="btn-add-branch"
            onClick={() => navigate('/dashboard/addbranch')}
          >
            Add First Branch
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="branch-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedBranches.length === branches.length && branches.length > 0}
                  />
                </th>
                <th>Branch ID</th>
                <th>Branch Name</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Manager</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((branch) => (
                <tr key={branch.branch_id} className={selectedBranches.includes(branch.branch_id) ? 'selected' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedBranches.includes(branch.branch_id)}
                      onChange={() => handleCheckboxChange(branch.branch_id)}
                    />
                  </td>
                  <td>{branch.branch_id}</td>
                  <td className="branch-name">{branch.name}</td>
                  <td>{branch.address}</td>
                  <td>{branch.phone_no || 'N/A'}</td>
                  <td>{branch.email || 'N/A'}</td>
                  <td>{branch.manager_name || 'Not Assigned'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
