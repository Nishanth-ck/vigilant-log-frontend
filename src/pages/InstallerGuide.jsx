import React from "react";
import "../styles/installer.css";

export default function InstallerGuide() {
  return (
    <div className="installer-root">
      <div className="installer-card">
        <h1>VigilantLog Installation Guide</h1>
        <p className="subtitle">
          Choose the installer that matches your needs. Both provide different monitoring capabilities.
        </p>

        {/* Installer 1: System Analytics & Predictions */}
        <section style={{ marginBottom: "40px", padding: "20px", background: "#f8fafc", borderRadius: "12px" }}>
          <h2 style={{ color: "#2563eb", marginBottom: "16px" }}>
            System Analytics Monitor (Windows SDK Required)
          </h2>
          <p style={{ marginBottom: "16px", color: "#475569" }}>
            <strong>Features:</strong> BSOD prediction, app crash detection, system health monitoring, and analytics dashboard.
          </p>

          <ol className="install-steps">
            <li>
              <strong>Install Windows SDK Debugger (Required First)</strong>
              <br />
              Visit Microsoft's official site and download the Windows Debugger.
            </li>
            <li>
              <strong>Install VigilantLog Analytics</strong>
              <br />
              After installing the debugger, download the VigilantLog installer.
            </li>
            <li>
              During installation, choose{" "}
              <b>Install for all users (recommended)</b>.
            </li>
            <li>
              When selecting the installation directory:
              <ul>
                <li>
                  If your <b>C drive</b> has <code>Program Files (x86)</code>,
                  choose that folder.
                </li>
                <li>
                  Otherwise, select <code>Program Files</code>.
                </li>
              </ul>
            </li>
            <li>
              Click <b>Next</b> and complete the installation.
            </li>
            <li>
              If prompted, restart your system — or manually restart once the
              installation finishes.
            </li>
            <li>
              After 15–20 minutes, visit the VigilantLog Dashboard to view your
              system health and metrics.
            </li>
          </ol>

          <div className="button-group">
            <a
              href="https://developer.microsoft.com/en-us/windows/downloads/windows-sdk/?utm_source=chatgpt.com"
              target="_blank"
              rel="noopener noreferrer"
              className="download-btn"
            >
              1. Download Windows SDK
            </a>

            <a
              href="https://drive.google.com/drive/folders/1VHmx-vxGkqxmQ0Q9zxHcxHTb_QqP7Hcg"
              target="_blank"
              rel="noopener noreferrer"
              className="download-btn secondary"
            >
              2. Download Analytics Installer
            </a>
          </div>
        </section>

        {/* Installer 2: File Monitoring & Recovery */}
        <section style={{ marginBottom: "20px", padding: "20px", background: "#f0fdf4", borderRadius: "12px" }}>
          <h2 style={{ color: "#059669", marginBottom: "16px" }}>
            📁 File Monitoring & Backup Agent (Standalone)
          </h2>
          <p style={{ marginBottom: "16px", color: "#475569" }}>
            <strong>Features:</strong> Automatic file backup, cloud sync, file recovery, and real-time file monitoring.
          </p>

          <ol className="install-steps">
            <li>
              <strong>Download the File Monitor Installer</strong>
              <br />
              Click the button below to download from GitHub Releases.
            </li>
            <li>
              <strong>Run the installer as Administrator</strong>
              <br />
              Right-click the downloaded file → "Run as administrator"
            </li>
            <li>
              The agent will start in your <strong>system tray</strong> (near the clock)
            </li>
            <li>
              Configure monitoring folders via <strong>File Settings</strong> page on the website
            </li>
            <li>
              Click "Start Monitoring" on the website
            </li>
            <li>
              The desktop agent will automatically sync and start monitoring (within 60 seconds)
            </li>
            <li>
              View and manage backups via the <strong>File Backups</strong> page
            </li>
          </ol>

          <div className="button-group">
            <a
              href="https://github.com/Nishanth-ck/vigilant-log-frontend/releases/tag/FIleMonitoring"
              target="_blank"
              rel="noopener noreferrer"
              className="download-btn"
              style={{ background: "#059669" }}
            >
              Download File Monitor Installer
            </a>
          </div>

          <div style={{ marginTop: "20px", padding: "12px", background: "#dcfce7", borderRadius: "8px", fontSize: "14px" }}>
            <strong>💡 Tip:</strong> After installation, the agent runs in the background. 
            Look for the VigilantLog icon in your system tray. Right-click it to access options.
          </div>
        </section>

        <div style={{ marginTop: "30px", padding: "16px", background: "#fef3c7", borderRadius: "8px", fontSize: "14px" }}>
          <strong>⚠️ Note:</strong> You can install BOTH agents if you want complete system monitoring + file backup capabilities.
        </div>
      </div>
    </div>
  );
}
