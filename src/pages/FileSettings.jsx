// src/pages/FileSettings.jsx
import React, { useState, useEffect } from "react";
import { Play, StopCircle, FolderPlus, Trash2, Save } from "lucide-react";
import "../styles/dashboard.css";

// File Monitoring API URL - configure for your deployed backend
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function FileSettings() {
  const [state, setState] = useState({
    monitor_folders: [],
    backup_folder: "",
    startMonitoring: false,
  });
  const [monitoring, setMonitoring] = useState(false);
  const [newFolder, setNewFolder] = useState("");
  const [backupFolder, setBackupFolder] = useState("");
  const [status, setStatus] = useState("");

  const fetchState = async () => {
    try {
      const deviceId = sessionStorage.getItem("deviceName") || "default";
      const res = await fetch(`${API_URL}/api/file-monitor/state?deviceId=${deviceId}`);
      if (res.ok) {
        const data = await res.json();
        setState(data.state || { monitor_folders: [], backup_folder: "", startMonitoring: false });
        setMonitoring(data.monitoring_active || false);
        setBackupFolder(data.state?.backup_folder || "");
      }
    } catch (err) {
      console.error("Failed to fetch state:", err);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  const saveConfig = async () => {
    setStatus("Saving...");
    try {
      const deviceId = sessionStorage.getItem("deviceName") || "default";
      const res = await fetch(`${API_URL}/api/file-monitor/state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          device_id: deviceId,
          monitor_folders: state.monitor_folders,
          backup_folder: backupFolder,
          startMonitoring: state.startMonitoring,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setStatus("Configuration saved!");
        // Update local state with saved data to keep UI in sync
        if (data.state) {
          setState(data.state);
          setBackupFolder(data.state.backup_folder || "");
        }
        setTimeout(() => setStatus(""), 3000);
      } else {
        setStatus("Failed to save");
      }
    } catch (err) {
      console.error("Save error:", err);
      setStatus("Error saving");
    }
  };

  const addMonitorFolder = () => {
    if (!newFolder.trim()) return;
    if (state.monitor_folders.includes(newFolder)) {
      alert("Folder already in list");
      return;
    }
    setState({
      ...state,
      monitor_folders: [...state.monitor_folders, newFolder],
    });
    setNewFolder("");
  };

  const removeMonitorFolder = (folder) => {
    setState({
      ...state,
      monitor_folders: state.monitor_folders.filter((f) => f !== folder),
    });
  };

  const startMonitoring = async () => {
    setStatus("Starting monitoring...");
    try {
      const deviceId = sessionStorage.getItem("deviceName") || "default";
      const res = await fetch(`${API_URL}/api/file-monitor/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_id: deviceId }),
      });
      if (res.ok) {
        setStatus("Signal sent! Desktop agent will start monitoring within 60 seconds.");
        setMonitoring(true);
        setTimeout(() => setStatus(""), 5000);
      } else {
        setStatus("Failed to start");
      }
    } catch (err) {
      setStatus("Error starting monitoring");
    }
  };

  const stopMonitoring = async () => {
    setStatus("Stopping monitoring...");
    try {
      const deviceId = sessionStorage.getItem("deviceName") || "default";
      const res = await fetch(`${API_URL}/api/file-monitor/stop`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_id: deviceId }),
      });
      if (res.ok) {
        setStatus("Signal sent! Desktop agent will stop monitoring within 60 seconds.");
        setMonitoring(false);
        setTimeout(() => setStatus(""), 5000);
      } else {
        setStatus("Failed to stop");
      }
    } catch (err) {
      setStatus("Error stopping monitoring");
    }
  };

  return (
    <div className="dashboard-root">
      <aside className="sidebar">
        <div className="sidebar-brand">VigilantLog</div>
        <nav className="sidebar-nav">
          <a className="nav-item" href="/dashboard">
            Dashboard
          </a>
          <a className="nav-item" href="/system-health">
            System Health
          </a>
          <a className="nav-item" href="/analysis">
            Analysis
          </a>
          <a className="nav-item" href="/file-backups">
            File Backups
          </a>
          <a className="nav-item active" href="/file-settings">
            File Settings
          </a>
        </nav>
      </aside>

      <main className="main">
        <header className="topbar">
          <h2>File Monitoring Settings</h2>
          <div className="user">
            {monitoring ? (
              <span style={{ color: "#0ea5a4", fontWeight: 600 }}>
                ● Monitoring Active
              </span>
            ) : (
              <span style={{ color: "#999", fontWeight: 600 }}>
                ○ Monitoring Stopped
              </span>
            )}
          </div>
        </header>

        {status && (
          <div
            style={{
              margin: "20px",
              padding: "12px 20px",
              background: "#e0f2fe",
              color: "#0369a1",
              borderRadius: "8px",
              fontWeight: 500,
            }}
          >
            {status}
          </div>
        )}

        {/* Info Box */}
        <div
          style={{
            margin: "20px",
            padding: "16px",
            background: "#f0f9ff",
            border: "1px solid #7dd3fc",
            borderRadius: "8px",
          }}
        >
          <h4 style={{ margin: "0 0 8px 0", color: "#0369a1" }}>
            📋 How It Works
          </h4>
          <ul style={{ margin: 0, paddingLeft: "20px", color: "#0c4a6e" }}>
            <li>Configure backup and monitor folders below</li>
            <li>Click "Save Configuration" to persist your settings</li>
            <li>Start monitoring - your desktop agent will sync settings within 60 seconds</li>
            <li>Files will be backed up locally to your backup folder</li>
            <li>View local backups by opening the backup folder on your computer</li>
          </ul>
        </div>

        {/* Monitoring Control */}
        <section className="panel" style={{ margin: "20px" }}>
          <h3>Monitoring Control</h3>
          <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
            <button
              onClick={startMonitoring}
              disabled={monitoring}
              style={{
                padding: "10px 20px",
                background: monitoring ? "#d1d5db" : "#0ea5a4",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: monitoring ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontWeight: 500,
              }}
            >
              <Play size={18} />
              Start Monitoring
            </button>
            <button
              onClick={stopMonitoring}
              disabled={!monitoring}
              style={{
                padding: "10px 20px",
                background: !monitoring ? "#d1d5db" : "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: !monitoring ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontWeight: 500,
              }}
            >
              <StopCircle size={18} />
              Stop Monitoring
            </button>
          </div>
        </section>

        {/* Backup Folder */}
        <section className="panel" style={{ margin: "20px" }}>
          <h3>Backup Folder</h3>
          <p style={{ color: "#666", marginBottom: "12px" }}>
            Where backup files will be saved on your computer (local storage)
          </p>
          <div style={{ 
            background: "#fffbeb", 
            border: "1px solid #fcd34d", 
            borderRadius: "6px", 
            padding: "12px", 
            marginBottom: "12px" 
          }}>
            <p style={{ margin: 0, fontSize: "14px", color: "#92400e" }}>
              💡 <strong>Tip:</strong> Use an absolute path like <code>C:\Users\YourName\VigilantLog_Backups</code>
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
            <input
              type="text"
              value={backupFolder}
              onChange={(e) => setBackupFolder(e.target.value)}
              placeholder="e.g., C:\Users\YourName\Desktop\backups"
              style={{
                flex: 1,
                padding: "10px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
              }}
            />
            <button
              onClick={saveConfig}
              style={{
                padding: "10px 20px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontWeight: 500,
              }}
            >
              <Save size={18} />
              Save
            </button>
          </div>
        </section>

        {/* Monitor Folders */}
        <section className="panel" style={{ margin: "20px" }}>
          <h3>Folders to Monitor</h3>
          <p style={{ color: "#666", marginBottom: "12px" }}>
            Add folders to watch for file changes
          </p>
          <div style={{ 
            background: "#fffbeb", 
            border: "1px solid #fcd34d", 
            borderRadius: "6px", 
            padding: "12px", 
            marginBottom: "12px" 
          }}>
            <p style={{ margin: 0, fontSize: "14px", color: "#92400e" }}>
              💡 <strong>Tip:</strong> Use absolute paths like <code>C:\Users\YourName\Documents\Important</code>
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
            <input
              type="text"
              value={newFolder}
              onChange={(e) => setNewFolder(e.target.value)}
              placeholder="e.g., C:\Users\YourName\Documents"
              style={{
                flex: 1,
                padding: "10px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
              }}
              onKeyPress={(e) => e.key === "Enter" && addMonitorFolder()}
            />
            <button
              onClick={addMonitorFolder}
              style={{
                padding: "10px 20px",
                background: "#0ea5a4",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontWeight: 500,
              }}
            >
              <FolderPlus size={18} />
              Add Folder
            </button>
          </div>

          {/* Folder List */}
          <div style={{ marginTop: "20px" }}>
            {state.monitor_folders.length === 0 ? (
              <p style={{ color: "#999", fontStyle: "italic" }}>
                No folders configured yet
              </p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {state.monitor_folders.map((folder, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px",
                      background: "#f9fafb",
                      borderRadius: "6px",
                      marginBottom: "8px",
                    }}
                  >
                    <span style={{ fontFamily: "monospace", fontSize: "14px" }}>
                      {folder}
                    </span>
                    <button
                      onClick={() => removeMonitorFolder(folder)}
                      style={{
                        padding: "6px 12px",
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={saveConfig}
            style={{
              marginTop: "16px",
              padding: "10px 20px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: 500,
            }}
          >
            <Save size={18} />
            Save Configuration
          </button>
        </section>
      </main>
    </div>
  );
}


