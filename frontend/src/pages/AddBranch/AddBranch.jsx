import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddBranch.css';

const AddBranch = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    address_line1: '',
    address_line2: '',
    address_line3: '',
    phone_no: '',
    email: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name || !formData.address_line1) {
      setError('Please fill in all required fields (Name and Address Line 1)');
      setLoading(false);
      return;
    }

    // Validate email format
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    // Validate phone number (basic validation)
    if (formData.phone_no && !/^\d{10,15}$/.test(formData.phone_no.replace(/\s|-/g, ''))) {
      setError('Please enter a valid phone number (10-15 digits)');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('catms_token');
      
      // Combine address lines into single address string
      const addressParts = [
        formData.address_line1,
        formData.address_line2,
        formData.address_line3
      ].filter(part => part.trim() !== '');
      const fullAddress = addressParts.join(', ');

      const branchData = {
        name: formData.name,
        address: fullAddress,
        phone_no: formData.phone_no || null,
        email: formData.email || null
      };

      const response = await axios.post('http://localhost:3000/api/branch', branchData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess(`Branch added successfully! Branch ID: ${response.data.branch_id}. Redirecting...`);
      
      // Reset form
      setTimeout(() => {
        navigate('/dashboard'); // Or navigate to branch list page
      }, 2000);

    } catch (err) {
      console.error('Error adding branch:', err);
      setError(err.response?.data?.error || 'Error adding branch. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="add-branch-container">
      <div className="add-branch-card">
        <div className="add-branch-header">
          <h2>🏥 Add New Branch</h2>
          <p>Create a new clinic branch location</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <span className="alert-icon">✅</span>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="add-branch-form">
          {/* Branch Name */}
          <div className="form-group">
            <label htmlFor="name">
              Branch Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Main Branch - Colombo"
              required
              maxLength={100}
            />
            <small className="form-hint">Branch ID will be auto-generated</small>
          </div>

          {/* Address Section */}
          <div className="form-section">
            <h3>📍 Branch Address</h3>
            
            <div className="form-group">
              <label htmlFor="address_line1">
                Address Line 1 <span className="required">*</span>
              </label>
              <input
                type="text"
                id="address_line1"
                name="address_line1"
                value={formData.address_line1}
                onChange={handleChange}
                placeholder="e.g., 123 Main Street"
                required
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label htmlFor="address_line2">Address Line 2</label>
              <input
                type="text"
                id="address_line2"
                name="address_line2"
                value={formData.address_line2}
                onChange={handleChange}
                placeholder="e.g., Colombo 7"
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label htmlFor="address_line3">Address Line 3</label>
              <input
                type="text"
                id="address_line3"
                name="address_line3"
                value={formData.address_line3}
                onChange={handleChange}
                placeholder="e.g., Western Province"
                maxLength={100}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="form-section">
            <h3>📞 Contact Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone_no">Phone Number</label>
                <input
                  type="tel"
                  id="phone_no"
                  name="phone_no"
                  value={formData.phone_no}
                  onChange={handleChange}
                  placeholder="e.g., 0112345678"
                  maxLength={15}
                />
                <small className="form-hint">10-15 digits</small>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g., branch@clinic.com"
                  maxLength={100}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button 
              type="button" 
              onClick={handleCancel}
              className="btn btn-cancel"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Adding Branch...
                </>
              ) : (
                <>
                  <span>✅</span>
                  Add Branch
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBranch;
