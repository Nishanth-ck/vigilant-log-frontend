import React, { useState } from "react";
import { Shield, Activity, Database, Cloud, Menu } from "lucide-react";
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
            <a href="#contact">Contact Us</a>
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
        <div className="hero-inner">
          <h1>VigilantLog</h1>
          <p className="lead">
            AI-powered Log Monitoring, Threat Detection, and File Recovery for
            Secure & Stable Systems.
          </p>
          <div className="hero-cta">
            <a href="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </a>
            <a href="/installer" className="btn btn-primary">
              Download Installer
            </a>
          </div>
        </div>
      </header>

      <section id="features" className="features">
        <div className="feature-card">
          <Activity className="ficon" />
          <h3>Real-time Monitoring</h3>
          <p>Continuously track system logs for anomalies and crashes.</p>
        </div>

        <div className="feature-card">
          <Shield className="ficon" />
          <h3>AI Threat Detection</h3>
          <p>Detect suspicious activities using ML-based anomaly detectors.</p>
        </div>

        <div className="feature-card">
          <Database className="ficon" />
          <h3>File Backup & Recovery</h3>
          <p>Automatic backups & easy restore after failures.</p>
        </div>

        <div className="feature-card">
          <Cloud className="ficon" />
          <h3>Cloud Integration</h3>
          <p>Manage logs and recovery from anywhere via secure cloud.</p>
        </div>
      </section>

      <footer className="footer">
        © {new Date().getFullYear()} VigilantLog. All rights reserved.
      </footer>
    </div>
  );
}
