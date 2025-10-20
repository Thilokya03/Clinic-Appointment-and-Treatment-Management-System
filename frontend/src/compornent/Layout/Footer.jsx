// src/components/Footer/Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="hospital-footer">
      <div className="footer-main">
        <div className="footer-container">
          {/* About Section */}
          <div className="footer-section">
            <h3 className="footer-title">City Central Hospital</h3>
            <p className="footer-description">
              Providing excellence in healthcare with compassion and cutting-edge medical technology.
              Your health is our priority.
            </p>
            <div className="footer-emergency">
              <span className="emergency-icon">🚨</span>
              <div>
                <div className="emergency-label">24/7 Emergency</div>
                <div className="emergency-number">+1 (555) 123-4567</div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/doctors">Our Doctors</Link></li>
              <li><Link to="/register">Book Appointment</Link></li>
              <li><Link to="/login">Patient Login</Link></li>
            </ul>
          </div>

          {/* Departments */}
          <div className="footer-section">
            <h4 className="footer-heading">Departments</h4>
            <ul className="footer-links">
              <li><a href="#cardiology">Cardiology</a></li>
              <li><a href="#neurology">Neurology</a></li>
              <li><a href="#pediatrics">Pediatrics</a></li>
              <li><a href="#orthopedics">Orthopedics</a></li>
              <li><a href="#emergency">Emergency Care</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4 className="footer-heading">Contact Us</h4>
            <ul className="footer-contact">
              <li>
                <span className="contact-icon">📍</span>
                <span>123 Medical Center Dr,<br/>Healthcare City, HC 12345</span>
              </li>
              <li>
                <span className="contact-icon">📞</span>
                <span>+1 (555) 987-6543</span>
              </li>
              <li>
                <span className="contact-icon">📧</span>
                <span>info@citycentralhospital.com</span>
              </li>
              <li>
                <span className="contact-icon">🕐</span>
                <span>Mon - Fri: 8:00 AM - 8:00 PM<br/>Sat - Sun: 9:00 AM - 5:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              © {new Date().getFullYear()} City Central Hospital. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <a href="#privacy">Privacy Policy</a>
              <span className="divider">|</span>
              <a href="#terms">Terms of Service</a>
              <span className="divider">|</span>
              <a href="#accessibility">Accessibility</a>
            </div>
            <div className="footer-social">
              <a href="#facebook" className="social-link" aria-label="Facebook">📘</a>
              <a href="#twitter" className="social-link" aria-label="Twitter">🐦</a>
              <a href="#instagram" className="social-link" aria-label="Instagram">📷</a>
              <a href="#linkedin" className="social-link" aria-label="LinkedIn">💼</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
