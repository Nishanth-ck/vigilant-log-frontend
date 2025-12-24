import React, { useState } from "react";
import { Shield, Activity, Database, Cloud, Menu, ChevronRight, Zap, Lock, BarChart3, FileCheck } from "lucide-react";
import "../styles/landing.css";
import logo from "../assets/logo.png";

export default function LandingPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="landing-root">
      <nav className="nav">
        <div className="nav-inner">
          <div className="brand">
            <img src={logo} alt="VigilantLog" className="logo" />
            VigilantLog
          </div>

          <div className={`nav-links ${open ? "open" : ""}`}>
            <a href="/landing">Home</a>
            <a href="#features">Features</a>
            <a href="/contact">Contact Us</a>
            <a href="/dashboard" className="cta">
              Dashboard
            </a>
          </div>

          <button
            className="nav-toggle"
            onClick={() => setOpen((s) => !s)}
            aria-label="Toggle menu"
          >
            <Menu />
          </button>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-pattern"></div>
        <div className="hero-inner">
          <div className="hero-badge">
            <Zap size={16} />
            <span>AI-Powered System Monitoring</span>
          </div>
          <h1 className="hero-title">
            Monitor, Predict & Protect
            <span className="hero-highlight"> Your System</span>
          </h1>
          <p className="lead">
            AI-powered Log Monitoring, Threat Detection, and File Recovery for
            Secure & Stable Systems. Stay ahead of crashes, failures, and data loss.
          </p>
          <div className="hero-cta">
            <a href="/dashboard" className="btn btn-primary">
              <span>Go to Dashboard</span>
              <ChevronRight size={20} />
            </a>
            <a href="/installer" className="btn btn-primary">
              <span>Download Installer</span>
            </a>
          </div>
          
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">AI-Powered</div>
              <div className="stat-label">Predictions</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">Real-Time</div>
              <div className="stat-label">Monitoring</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">Secure</div>
              <div className="stat-label">Storage</div>
            </div>
          </div>
        </div>
      </header>

      <section id="features" className="features">
        <div className="features-header">
          <h2 className="features-title">Powerful Features</h2>
          <p className="features-subtitle">
            Everything you need to keep your system healthy and secure
          </p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card featured">
            <div className="feature-icon-wrapper primary">
          <Activity className="ficon" />
            </div>
          <h3>Real-time Monitoring</h3>
            <p>Track system logs for anomalies and crashes to help identify potential issues.</p>
            <div className="feature-badge">Core Feature</div>
        </div>

        <div className="feature-card">
            <div className="feature-icon-wrapper secondary">
          <Shield className="ficon" />
            </div>
          <h3>AI Threat Detection</h3>
            <p>Analyze suspicious activities using ML-based anomaly detection techniques.</p>
        </div>

        <div className="feature-card">
            <div className="feature-icon-wrapper tertiary">
          <Database className="ficon" />
            </div>
          <h3>File Backup & Recovery</h3>
            <p>Automatic file backups with restore capabilities after system failures.</p>
        </div>

        <div className="feature-card">
            <div className="feature-icon-wrapper quaternary">
          <Cloud className="ficon" />
            </div>
          <h3>Cloud Integration</h3>
            <p>Store logs and backups in the cloud for remote access and management.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper quinary">
              <BarChart3 className="ficon" />
            </div>
            <h3>Predictive Analysis</h3>
            <p>AI-based analysis to help identify potential BSOD, crashes, and shutdown patterns.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper senary">
              <Lock className="ficon" />
            </div>
            <h3>Encrypted Storage</h3>
            <p>Encrypted storage for your backups and system data.</p>
          </div>
        </div>
      </section>

      <section className="benefits-section">
        <div className="benefits-container">
          <div className="benefits-content">
            <div className="section-badge">
              <FileCheck size={16} />
              <span>Why Choose VigilantLog</span>
            </div>
            <h2 className="benefits-title">Stay Ahead of System Failures</h2>
            <p className="benefits-description">
              VigilantLog uses AI algorithms to help predict and monitor system failures. 
              Get real-time insights, automatic backups, and tools to help keep your 
              system protected.
            </p>
            <div className="benefits-list">
              <div className="benefit-item">
                <div className="benefit-icon">
                  <Shield size={20} />
                </div>
                <div className="benefit-text">
                  <h4>Proactive Monitoring</h4>
                  <p>Help identify issues early through continuous monitoring</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">
                  <Zap size={20} />
                </div>
                <div className="benefit-text">
                  <h4>Efficient Performance</h4>
                  <p>Designed to minimize system resource usage</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">
                  <Lock size={20} />
                </div>
                <div className="benefit-text">
                  <h4>Secure Storage</h4>
                  <p>Encryption for data protection</p>
                </div>
              </div>
            </div>
            <a href="/dashboard" className="benefits-cta">
              Get Started Now
              <ChevronRight size={20} />
            </a>
          </div>
          <div className="benefits-visual">
            <div className="floating-card-new card-1">
              <Shield size={32} />
              <div className="card-info">
                <span className="card-label">System Status</span>
                <span className="card-value">Protected</span>
              </div>
            </div>
            <div className="floating-card-new card-2">
              <Activity size={32} />
              <div className="card-info">
                <span className="card-label">Health Score</span>
                <span className="card-value">98/100</span>
              </div>
            </div>
            <div className="floating-card-new card-3">
              <Database size={32} />
              <div className="card-info">
                <span className="card-label">Backups</span>
                <span className="card-value">1.2K</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <img src={logo} alt="VigilantLog" className="footer-logo" />
            <span>VigilantLog</span>
          </div>
          <div className="footer-links">
            <a href="/landing">Home</a>
            <a href="#features">Features</a>
            <a href="/contact">Contact</a>
            <a href="/dashboard">Dashboard</a>
          </div>
          <p className="footer-text">
        © {new Date().getFullYear()} VigilantLog. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
