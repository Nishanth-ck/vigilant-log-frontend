import { useState } from "react";
import { Mail, User, GraduationCap, Github, Linkedin } from "lucide-react";
import "../styles/contact.css";

export default function ContactUs() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const teamMembers = [
    {
      name: "Mahesh",
      usn: "1BY22CS108",
      email: "1by22cs108@bmsit.in",
      role: "Team Member"
    },
    {
      name: "Nikhil R Yalawar",
      usn: "1BY22CS122",
      email: "1by22cs122@bmsit.in",
      role: "Team Member"
    },
    {
      name: "Nishanth CK",
      usn: "1BY22CS123",
      email: "1by22cs123@bmsit.in",
      role: "Team Member"
    },
    {
      name: "Pruthvi Avalekar",
      usn: "1BY22CS138",
      email: "1by22cs138@bmsit.in",
      role: "Team Member"
    }
  ];

  const guide = {
    name: "Dr. Usha",
    title: "Project Guide",
    department: "Computer Science Department"
  };

  return (
    <div className="contact-root">
      {/* Navigation */}
      <nav className="contact-nav">
        <div className="contact-nav-inner">
          <div className="contact-brand">
            <span className="brand-icon">⚡</span>
            <span className="brand-text">VigilantLog</span>
          </div>
          <div className="nav-links">
            <a href="/landing" className="nav-link">Home</a>
            <a href="/dashboard" className="nav-link-primary">Dashboard</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1 className="contact-hero-title">Get In Touch</h1>
          <p className="contact-hero-subtitle">
            Meet the team behind VigilantLog
          </p>
          <div className="hero-divider"></div>
        </div>
      </section>

      {/* Guide Section */}
      <section className="guide-section">
        <div className="guide-container">
          <div className="section-header">
            <GraduationCap className="section-icon" size={40} />
            <h2 className="section-title">Project Guide</h2>
          </div>
          <div className="guide-card">
            <div className="guide-avatar">
              <GraduationCap size={48} />
            </div>
            <div className="guide-info">
              <h3 className="guide-name">{guide.name}</h3>
              <p className="guide-title">{guide.title}</p>
              <p className="guide-dept">{guide.department}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="team-container">
          <div className="section-header">
            <User className="section-icon" size={40} />
            <h2 className="section-title">Our Team</h2>
            <p className="section-subtitle">
              Four passionate students working together to create a robust system monitoring solution
            </p>
          </div>
          
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div 
                key={index} 
                className={`team-card ${hoveredCard === index ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="team-card-header">
                  <div className="member-avatar">
                    <User size={40} />
                  </div>
                  <div className="member-badge">{member.role}</div>
                </div>
                
                <div className="team-card-body">
                  <h3 className="member-name">{member.name}</h3>
                  <p className="member-usn">{member.usn}</p>
                  
                  <div className="member-contact">
                    <Mail size={18} />
                    <a href={`mailto:${member.email}`} className="member-email">
                      {member.email}
                    </a>
                  </div>
                </div>

                <div className="team-card-footer">
                  <a href={`mailto:${member.email}`} className="contact-btn">
                    <Mail size={16} />
                    Send Email
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Info Section */}
      <section className="project-info-section">
        <div className="project-info-container">
          <div className="project-info-card">
            <h2 className="project-info-title">About VigilantLog</h2>
            <p className="project-info-text">
              VigilantLog is an AI-powered system monitoring and file protection solution developed as a major project.
              Our system provides real-time monitoring, predictive analysis for system failures, and automatic file backup capabilities.
            </p>
            <div className="project-features">
              <div className="feature-tag">Real-time Monitoring</div>
              <div className="feature-tag">AI Predictions</div>
              <div className="feature-tag">File Protection</div>
              <div className="feature-tag">Cloud Backup</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="contact-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="brand-icon">⚡</span>
            <span className="brand-text">VigilantLog</span>
          </div>
          <p className="footer-text">
            © {new Date().getFullYear()} VigilantLog. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

