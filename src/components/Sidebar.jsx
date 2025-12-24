import React from "react";
import "../styles/sidebar.css";
import logo from "../assets/logo.png";

export default function Sidebar({ active }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard" },
    { id: "analysis", label: "Analysis", href: "/analysis" },
    { id: "file-backups", label: "File Backups", href: "/file-backups" },
    { id: "file-settings", label: "File Settings", href: "/file-settings" },
  ];

  return (
    <aside className="app-sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="VigilantLog" className="sidebar-logo" />
        <span className="sidebar-brand-text">VigilantLog</span>
      </div>
      <nav className="sidebar-navigation">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={`sidebar-nav-item ${active === item.id ? "active" : ""}`}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}

