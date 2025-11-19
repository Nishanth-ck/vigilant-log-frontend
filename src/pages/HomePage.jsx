import { useNavigate } from "react-router-dom";
import { 
  Shield, 
  Eye, 
  Activity, 
  Bell, 
  Lock, 
  Server,
  ArrowRight,
  CheckCircle,
  Zap,
  Cloud,
  FileText
} from "lucide-react";
import "../styles/homepage.css";

export default function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Activity size={32} />,
      title: "Real-time Monitoring",
      description: "Track system health and performance metrics in real-time with advanced analytics."
    },
    {
      icon: <Shield size={32} />,
      title: "Predictive Analysis",
      description: "AI-powered predictions for BSOD, crashes, and unexpected shutdowns before they happen."
    },
    {
      icon: <FileText size={32} />,
      title: "File Protection",
      description: "Automatic backup and cloud sync for your critical files with version control."
    },
    {
      icon: <Bell size={32} />,
      title: "Instant Alerts",
      description: "Get notified immediately when potential system issues are detected."
    },
    {
      icon: <Cloud size={32} />,
      title: "Cloud Storage",
      description: "Securely store your backups in the cloud with encrypted data transmission."
    },
    {
      icon: <Zap size={32} />,
      title: "Lightning Fast",
      description: "Optimized performance with minimal system resource usage."
    }
  ];

  return (
    <div className="homepage-root">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <img src="/logo.png" alt="VigilantLog" className="navbar-logo" />
            <span className="navbar-title">VigilantLog</span>
          </div>
          <div className="navbar-links">
            <button className="nav-link" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="nav-btn-primary" onClick={() => navigate("/register")}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Zap size={16} />
              <span>AI-Powered System Protection</span>
            </div>
            <h1 className="hero-title">
              Keep Your System
              <span className="hero-gradient"> Safe & Monitored</span>
            </h1>
            <p className="hero-description">
              Advanced real-time system monitoring with AI-powered predictions. 
              Detect issues before they happen and protect your critical files automatically.
            </p>
            <div className="hero-buttons">
              <button className="btn-hero-primary" onClick={() => navigate("/register")}>
                Start Free Trial
                <ArrowRight size={20} />
              </button>
              <button className="btn-hero-secondary" onClick={() => navigate("/login")}>
                <Eye size={20} />
                View Demo
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <CheckCircle size={20} className="stat-icon" />
                <span>99.9% Uptime</span>
              </div>
              <div className="stat-item">
                <Server size={20} className="stat-icon" />
                <span>24/7 Monitoring</span>
              </div>
              <div className="stat-item">
                <Lock size={20} className="stat-icon" />
                <span>Encrypted</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-card card-1">
              <Shield size={40} className="card-icon" />
              <div className="card-content">
                <span className="card-title">System Protected</span>
                <span className="card-value">100%</span>
              </div>
            </div>
            <div className="floating-card card-2">
              <Activity size={40} className="card-icon" />
              <div className="card-content">
                <span className="card-title">Health Score</span>
                <span className="card-value">98/100</span>
              </div>
            </div>
            <div className="floating-card card-3">
              <Bell size={40} className="card-icon" />
              <div className="card-content">
                <span className="card-title">Active Alerts</span>
                <span className="card-value">0</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Powerful Features</h2>
            <p className="section-subtitle">
              Everything you need to keep your system healthy and secure
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Protect Your System?</h2>
            <p className="cta-description">
              Join the users who trust VigilantLog to keep their systems safe
            </p>
            <button className="cta-button" onClick={() => navigate("/register")}>
              Get Started Now
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <img src="/logo.png" alt="VigilantLog" className="footer-logo" />
            <span className="footer-title">VigilantLog</span>
          </div>
          <p className="footer-text">
            © 2025 VigilantLog. Keeping your system safe, one prediction at a time.
          </p>
        </div>
      </footer>
    </div>
  );
}

