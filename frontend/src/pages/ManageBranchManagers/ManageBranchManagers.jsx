import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ManageBranchManagers.css';

export default function ManageBranchManagers() {
  const navigate = useNavigate();
  const [managers, setManagers] = useState([]);
  const [selectedManagers, setSelectedManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('catms_token');
      const response = await axios.get('/api/branch/managers/list', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setManagers(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching branch managers:', err);
      setError('Failed to load branch managers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (managerId) => {
    setSelectedManagers(prev => {
      if (prev.includes(managerId)) {
        return prev.filter(id => id !== managerId);
      } else {
        return [...prev, managerId];
      }
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedManagers(managers.map(m => m.staff_id));
    } else {
      setSelectedManagers([]);
    }
  };

  const handleRemoveManagers = async () => {
    if (selectedManagers.length === 0) {
      alert('Please select at least one branch manager to remove.');
      return;
    }

    const confirmMessage = `Are you sure you want to delete ${selectedManagers.length} branch manager(s)?\n\nWARNING: This will permanently delete:\n- Branch Manager account\n- All associated data\n\nThis action cannot be undone!`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const token = localStorage.getItem('catms_token');
      const deletePromises = selectedManagers.map(managerId =>
        axios.delete(`/api/staff/${managerId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      );

      await Promise.all(deletePromises);
      
      setSuccessMessage(`Successfully deleted ${selectedManagers.length} branch manager(s).`);
      setSelectedManagers([]);
      fetchManagers();
      
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      console.error('Error deleting branch managers:', err);
      setError('Failed to delete branch managers. Please try again.');
      setTimeout(() => setError(null), 5000);
    }
  };

  return (
    <div className="manage-managers-container">
      <div className="manage-managers-header">
        <h1 className="manage-managers-title">Manage Branch Managers</h1>
        <p className="manage-managers-subtitle">View, manage, and delete branch managers</p>
      </div>

      <div className="manage-managers-actions">
        <button 
          className="btn-add-manager"
          onClick={() => navigate('/dashboard/addbranchmanager')}
        >
          ➕ Add Branch Manager
        </button>
        <button 
          className="btn-remove-manager"
          onClick={handleRemoveManagers}
          disabled={selectedManagers.length === 0}
        >
          🗑️ Remove Selected ({selectedManagers.length})
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
          <p>Loading branch managers...</p>
        </div>
      ) : managers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👔</div>
          <h3>No Branch Managers Found</h3>
          <p>Start by adding your first branch manager</p>
          <button 
            className="btn-add-manager"
            onClick={() => navigate('/dashboard/addbranchmanager')}
          >
            Add First Branch Manager
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="manager-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedManagers.length === managers.length && managers.length > 0}
                  />
                </th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Branch</th>
              </tr>
            </thead>
            <tbody>
              {managers.map((manager) => (
                <tr key={manager.staff_id} className={selectedManagers.includes(manager.staff_id) ? 'selected' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedManagers.includes(manager.staff_id)}
                      onChange={() => handleCheckboxChange(manager.staff_id)}
                    />
                  </td>
                  <td className="manager-name">{manager.name}</td>
                  <td>{manager.email}</td>
                  <td>{manager.phone_no || 'N/A'}</td>
                  <td>{manager.branch_name || 'Not Assigned'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
