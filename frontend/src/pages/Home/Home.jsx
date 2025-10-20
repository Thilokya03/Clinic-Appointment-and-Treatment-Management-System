import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="hospital-home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to City Central Hospital</h1>
            <p className="hero-subtitle">Excellence in Healthcare, Compassion in Service</p>
            <p className="hero-description">
              Providing world-class medical care with state-of-the-art facilities and experienced professionals
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => navigate("/register")}>
                Book Appointment
              </button>
              <button className="btn-secondary" onClick={() => navigate("/login")}>
                Patient Login
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">50+</div>
              <div className="stat-label">Expert Doctors</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">25,000+</div>
              <div className="stat-label">Happy Patients</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">15+</div>
              <div className="stat-label">Departments</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Emergency Care</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <h2 className="section-title">Our Medical Services</h2>
          <p className="section-subtitle">Comprehensive healthcare services for your well-being</p>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🏥</div>
              <h3>Emergency Care</h3>
              <p>24/7 emergency medical services with rapid response team</p>
            </div>
            <div className="service-card">
              <div className="service-icon">❤️</div>
              <h3>Cardiology</h3>
              <p>Advanced cardiac care and treatment facilities</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🧠</div>
              <h3>Neurology</h3>
              <p>Expert neurological diagnosis and treatment</p>
            </div>
            <div className="service-card">
              <div className="service-icon">👶</div>
              <h3>Pediatrics</h3>
              <p>Specialized care for infants and children</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🦴</div>
              <h3>Orthopedics</h3>
              <p>Bone and joint treatment with modern techniques</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🔬</div>
              <h3>Laboratory</h3>
              <p>State-of-the-art diagnostic laboratory services</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👨‍⚕️</div>
              <h3>Expert Physicians</h3>
              <p>Board-certified doctors with years of experience in their specialties</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏗️</div>
              <h3>Modern Facilities</h3>
              <p>Advanced medical equipment and comfortable patient rooms</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💊</div>
              <h3>Quality Treatment</h3>
              <p>Evidence-based medicine and personalized care plans</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Online Services</h3>
              <p>Easy appointment booking and digital health records access</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">Ready to Get Started?</h2>
          <p className="cta-text">Join thousands of satisfied patients who trust us with their health</p>
          <div className="cta-buttons">
            <button className="btn-cta-primary" onClick={() => navigate("/register")}>
              Register Now
            </button>
            <button className="btn-cta-secondary" onClick={() => navigate("/about")}>
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
