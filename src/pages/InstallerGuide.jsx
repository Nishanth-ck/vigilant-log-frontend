import React from "react";
import "../styles/installer.css";

export default function InstallerGuide() {
  return (
    <div className="installer-root">
      <div className="installer-card">
        <h1>VigilantLog Installation Guide</h1>
        <p className="subtitle">
          Follow the steps below carefully to install and configure VigilantLog.
        </p>

        <ol className="install-steps">
          <li>
            <strong>Install Windows SDK Debugger</strong>
            Click the link below to visit Microsoft’s official site and download
            the Windows Debugger safely.
          </li>
          <li>
            <strong>Install VigilantLog</strong>
            After installing the debugger, click the second link below to
            download the VigilantLog installer.
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
            Download Windows SDK
          </a>

          <a
            href="https://drive.google.com/drive/folders/1VHmx-vxGkqxmQ0Q9zxHcxHTb_QqP7Hcg"
            target="_blank"
            rel="noopener noreferrer"
            className="download-btn secondary"
          >
            Download VigilantLog Installer
          </a>
        </div>
      </div>
    </div>
  );
}
