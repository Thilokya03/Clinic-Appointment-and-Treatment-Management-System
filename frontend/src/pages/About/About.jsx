import React from 'react';
import './about.css';

export default function About() {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About Our Clinic Management System</h1>
        <p className="subtitle">Streamlining healthcare management for better patient care</p>
      </div>
      
      <div className="about-content">
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            We strive to simplify and enhance the healthcare experience by providing
            an efficient and user-friendly appointment and treatment management system.
            Our goal is to minimize administrative burden, reduce wait times, and improve
            the quality of care for both patients and healthcare providers.
          </p>
        </section>

        <section className="about-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Easy Appointment Scheduling</h3>
              <p>Book appointments online with real-time availability updates</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Patient Records Management</h3>
              <p>Securely store and access patient medical history</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💊</div>
              <h3>Treatment Tracking</h3>
              <p>Monitor ongoing treatments and patient progress</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile Notifications</h3>
              <p>Automated reminders for appointments and medications</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Our Story</h2>
          <p>
            Established in 2023, our clinic management system was developed by a team of healthcare 
            professionals and software engineers who recognized the need for a more efficient approach to 
            clinic administration. With extensive research and user feedback, we've created a 
            comprehensive solution that addresses the unique challenges faced by modern healthcare facilities.
          </p>
          <p>
            Today, our system is used by hundreds of clinics nationwide, helping healthcare providers 
            focus on what matters most - patient care.
          </p>
        </section>
      </div>
    </div>
  );
}
