// src/pages/FileSettings.jsx
import React, { useState, useEffect } from "react";
import {
  Play,
  StopCircle,
  FolderPlus,
  Trash2,
  Save,
  Folder,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";

const FILE_MONITORING_API_URL =
  import.meta.env.VITE_FILE_MONITORING_API_URL || "https://vigilantlog-backend.onrender.com";

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
  const [statusType, setStatusType] = useState("info");
  const [deviceName, setDeviceName] = useState("");

  const fetchState = async () => {
    try {
      const deviceId = sessionStorage.getItem("deviceName") || "default";
      const res = await fetch(
        `${FILE_MONITORING_API_URL}/api/file-monitor/state?deviceId=${deviceId}`
      );
      if (res.ok) {
        const data = await res.json();
        const fetchedState = data.state || {
          monitor_folders: [],
          backup_folder: "",
          startMonitoring: false,
        };
        setState(fetchedState);
        // Sync monitoring state from backend - use startMonitoring from state
        setMonitoring(fetchedState.startMonitoring || false);
        setBackupFolder(fetchedState.backup_folder || "");
      }
    } catch (err) {
      console.error("Failed to fetch state:", err);
    }
  };

  useEffect(() => {
    fetchState();
    const device = sessionStorage.getItem("deviceName") || "default";
    setDeviceName(device);
  }, []);

  const showStatus = (message, type = "info") => {
    setStatus(message);
    setStatusType(type);
    setTimeout(() => setStatus(""), 5000);
  };

  const saveConfig = async () => {
    showStatus("Saving configuration...", "info");
    try {
      const deviceId = sessionStorage.getItem("deviceName") || "default";
      const res = await fetch(`${FILE_MONITORING_API_URL}/api/file-monitor/state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          device_id: deviceId,
          monitor_folders: state.monitor_folders,
          backup_folder: backupFolder,
          // Use the current monitoring state, not state.startMonitoring
          startMonitoring: monitoring,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.state) {
          setState(data.state);
          setBackupFolder(data.state.backup_folder || "");
        }
        showStatus("Configuration saved successfully!", "success");
      } else {
        showStatus("Failed to save configuration", "error");
      }
    } catch (err) {
      console.error("Save error:", err);
      showStatus("Error saving configuration", "error");
    }
  };

  const addMonitorFolder = () => {
    if (!newFolder.trim()) return;
    if (state.monitor_folders.includes(newFolder)) {
      showStatus("Folder already in list", "error");
      return;
    }
    setState({
      ...state,
      monitor_folders: [...state.monitor_folders, newFolder],
    });
    setNewFolder("");
    showStatus("Folder added! Don't forget to save.", "success");
  };

  const removeMonitorFolder = (folder) => {
    setState({
      ...state,
      monitor_folders: state.monitor_folders.filter((f) => f !== folder),
    });
    showStatus("Folder removed! Don't forget to save.", "info");
  };

  const startMonitoring = async () => {
    showStatus("Starting monitoring...", "info");
    try {
      const deviceId = sessionStorage.getItem("deviceName") || "default";
      const res = await fetch(`${FILE_MONITORING_API_URL}/api/file-monitor/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_id: deviceId }),
      });
      if (res.ok) {
        setMonitoring(true);
        // Also update state so saveConfig will use the correct value
        setState({ ...state, startMonitoring: true });
        showStatus("Monitoring started! Agent will sync within 60 seconds.", "success");
      } else {
        showStatus("Failed to start monitoring", "error");
      }
    } catch (err) {
      showStatus("Error starting monitoring", "error");
    }
  };

  const stopMonitoring = async () => {
    showStatus("Stopping monitoring...", "info");
    try {
      const deviceId = sessionStorage.getItem("deviceName") || "default";
      const res = await fetch(`${FILE_MONITORING_API_URL}/api/file-monitor/stop`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_id: deviceId }),
      });
      if (res.ok) {
        setMonitoring(false);
        // Also update state so saveConfig will use the correct value
        setState({ ...state, startMonitoring: false });
        showStatus("Monitoring stopped! Agent will sync within 60 seconds.", "success");
      } else {
        showStatus("Failed to stop monitoring", "error");
      }
    } catch (err) {
      showStatus("Error stopping monitoring", "error");
    }
  };

  const statusColors = {
    success: { bg: "#ecfdf5", border: "#10b981", color: "#065f46" },
    error: { bg: "#fef2f2", border: "#ef4444", color: "#991b1b" },
    info: { bg: "#eff6ff", border: "#3b82f6", color: "#1e40af" },
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom right, #f9fafb, #dbeafe, #e0e7ff)" }}>
      {/* Top Navbar */}
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "64px",
        background: "white",
        borderBottom: "1px solid #e5e7eb",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "bold", background: "linear-gradient(to right, #2563eb, #4f46e5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>
            VigilantLog
          </h1>
          <span style={{ fontSize: "14px", color: "#9ca3af" }}>|</span>
          <span style={{ fontSize: "14px", fontWeight: 500, color: "#4b5563" }}>File Monitoring Settings</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 12px", borderRadius: "8px", background: "#f3f4f6" }}>
            <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: 500 }}>Device:</span>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#374151" }}>{deviceName}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 12px", borderRadius: "9999px", background: "white", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", border: "1px solid #e5e7eb" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: monitoring ? "#10b981" : "#9ca3af", animation: monitoring ? "pulse 2s infinite" : "none" }}></div>
            <span style={{ fontSize: "12px", fontWeight: 500, color: monitoring ? "#059669" : "#6b7280" }}>
              {monitoring ? "Active" : "Stopped"}
            </span>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside style={{
        position: "fixed",
        top: "64px",
        left: 0,
        height: "calc(100vh - 64px)",
        width: "256px",
        background: "white",
        borderRight: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
      }}>
        <div style={{ padding: "24px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", background: "linear-gradient(to right, #2563eb, #4f46e5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>
            VigilantLog
          </h1>
        </div>
        <nav style={{ padding: "0 16px" }}>
          <a href="/dashboard" style={{ display: "block", padding: "12px 16px", borderRadius: "8px", color: "#374151", textDecoration: "none", marginBottom: "4px" }}>Dashboard</a>
          <a href="/system-health" style={{ display: "block", padding: "12px 16px", borderRadius: "8px", color: "#374151", textDecoration: "none", marginBottom: "4px" }}>System Health</a>
          <a href="/analysis" style={{ display: "block", padding: "12px 16px", borderRadius: "8px", color: "#374151", textDecoration: "none", marginBottom: "4px" }}>Analysis</a>
          <a href="/file-backups" style={{ display: "block", padding: "12px 16px", borderRadius: "8px", color: "#374151", textDecoration: "none", marginBottom: "4px" }}>File Backups</a>
          <a href="/file-settings" style={{ display: "block", padding: "12px 16px", borderRadius: "8px", background: "linear-gradient(to right, #3b82f6, #6366f1)", color: "white", fontWeight: 500, boxShadow: "0 4px 6px rgba(0,0,0,0.1)", textDecoration: "none" }}>File Settings</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: "256px", marginTop: "64px", padding: "32px" }}>
        {/* Device Info Card */}
        <div style={{ marginBottom: "24px", background: "linear-gradient(to right, #eef2ff, #f5f3ff)", borderRadius: "16px", padding: "20px", border: "1px solid #c7d2fe", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ padding: "10px", background: "#dbeafe", borderRadius: "12px" }}>
                <HardDrive size={20} color="#2563eb" />
              </div>
              <div>
                <p style={{ fontSize: "12px", color: "#4b5563", fontWeight: 500, margin: "0 0 2px 0" }}>Connected Device</p>
                <p style={{ fontSize: "18px", fontWeight: "bold", color: "#111827", margin: 0 }}>{deviceName}</p>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 4px 0" }}>Status</p>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: monitoring ? "#10b981" : "#9ca3af" }}></div>
                <span style={{ fontSize: "14px", fontWeight: 600, color: monitoring ? "#059669" : "#6b7280" }}>
                  {monitoring ? "Monitoring Active" : "Monitoring Stopped"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Alert */}
        {status && (
          <div style={{
            marginBottom: "24px",
            padding: "16px",
            borderRadius: "12px",
            border: `1px solid ${statusColors[statusType].border}`,
            background: statusColors[statusType].bg,
            display: "flex",
            alignItems: "flex-start",
            gap: "12px"
          }}>
            {statusType === "success" && <CheckCircle2 size={20} color={statusColors[statusType].color} />}
            {statusType === "error" && <AlertCircle size={20} color={statusColors[statusType].color} />}
            {statusType === "info" && <Info size={20} color={statusColors[statusType].color} />}
            <p style={{ flex: 1, fontWeight: 500, color: statusColors[statusType].color, margin: 0 }}>{status}</p>
          </div>
        )}

        {/* Info Card */}
        <div style={{ marginBottom: "24px", background: "linear-gradient(to right, #dbeafe, #e0e7ff)", borderRadius: "16px", padding: "24px", border: "1px solid #93c5fd", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <div style={{ padding: "8px", background: "#dbeafe", borderRadius: "8px" }}>
              <Info size={20} color="#2563eb" />
            </div>
            <div>
              <h3 style={{ fontWeight: 600, color: "#111827", margin: "0 0 8px 0" }}>How It Works</h3>
              <ul style={{ margin: 0, paddingLeft: "20px", color: "#374151", fontSize: "14px", lineHeight: "1.6" }}>
                <li>Configure backup and monitor folders below</li>
                <li>Click "Save Configuration" to persist settings</li>
                <li>Start monitoring - agent syncs within 60 seconds</li>
                <li>Files backed up locally and uploaded to cloud</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Monitoring Control Card */}
        <div style={{ background: "white", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb", padding: "24px", marginBottom: "24px" }}>
          <h3 style={{ fontSize: "20px", fontWeight: 600, color: "#111827", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
            <Play size={24} color="#6366f1" />
            Monitoring Control
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            <button
              onClick={startMonitoring}
              disabled={monitoring}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                borderRadius: "12px",
                fontWeight: 500,
                border: "none",
                cursor: monitoring ? "not-allowed" : "pointer",
                background: monitoring ? "#f3f4f6" : "linear-gradient(to right, #10b981, #14b8a6)",
                color: monitoring ? "#9ca3af" : "white",
                boxShadow: monitoring ? "none" : "0 4px 6px rgba(0,0,0,0.1)",
                transition: "all 0.2s",
                fontSize: "14px"
              }}
            >
              <Play size={20} />
              Start Monitoring
            </button>
            <button
              onClick={stopMonitoring}
              disabled={!monitoring}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                borderRadius: "12px",
                fontWeight: 500,
                border: "none",
                cursor: !monitoring ? "not-allowed" : "pointer",
                background: !monitoring ? "#f3f4f6" : "linear-gradient(to right, #ef4444, #ec4899)",
                color: !monitoring ? "#9ca3af" : "white",
                boxShadow: !monitoring ? "none" : "0 4px 6px rgba(0,0,0,0.1)",
                transition: "all 0.2s",
                fontSize: "14px"
              }}
            >
              <StopCircle size={20} />
              Stop Monitoring
            </button>
          </div>
        </div>

        {/* Backup Folder Card */}
        <div style={{ background: "white", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb", padding: "24px", marginBottom: "24px" }}>
          <h3 style={{ fontSize: "20px", fontWeight: 600, color: "#111827", margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: "8px" }}>
            <HardDrive size={24} color="#6366f1" />
            Backup Folder
          </h3>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 16px 0" }}>Local folder where backup files will be saved</p>
          <div style={{ marginBottom: "16px", padding: "12px", background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: "8px" }}>
            <p style={{ margin: 0, fontSize: "14px", color: "#92400e" }}>
              💡 <strong>Tip:</strong> Use absolute path like <code style={{ background: "#fef3c7", padding: "2px 6px", borderRadius: "4px" }}>C:\Users\YourName\VigilantLog_Backups</code>
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <input
              type="text"
              value={backupFolder}
              onChange={(e) => setBackupFolder(e.target.value)}
              placeholder="e.g., C:\Users\YourName\Desktop\backups"
              style={{
                flex: 1,
                padding: "12px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "12px",
                fontSize: "14px",
                outline: "none"
              }}
            />
            <button
              onClick={saveConfig}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                background: "linear-gradient(to right, #2563eb, #4f46e5)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontWeight: 500,
                cursor: "pointer",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                fontSize: "14px"
              }}
            >
              <Save size={20} />
              Save
            </button>
          </div>
        </div>

        {/* Monitor Folders Card */}
        <div style={{ background: "white", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb", padding: "24px" }}>
          <h3 style={{ fontSize: "20px", fontWeight: 600, color: "#111827", margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: "8px" }}>
            <Folder size={24} color="#6366f1" />
            Folders to Monitor
          </h3>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 16px 0" }}>Add folders to watch for file changes</p>
          <div style={{ marginBottom: "16px", padding: "12px", background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: "8px" }}>
            <p style={{ margin: 0, fontSize: "14px", color: "#92400e" }}>
              💡 <strong>Tip:</strong> Use absolute paths like <code style={{ background: "#fef3c7", padding: "2px 6px", borderRadius: "4px" }}>C:\Users\YourName\Documents\Important</code>
            </p>
          </div>

          {/* Add Folder Input */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
            <input
              type="text"
              value={newFolder}
              onChange={(e) => setNewFolder(e.target.value)}
              placeholder="e.g., C:\Users\YourName\Documents"
              onKeyPress={(e) => e.key === "Enter" && addMonitorFolder()}
              style={{
                flex: 1,
                padding: "12px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "12px",
                fontSize: "14px",
                outline: "none"
              }}
            />
            <button
              onClick={addMonitorFolder}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                background: "linear-gradient(to right, #14b8a6, #06b6d4)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontWeight: 500,
                cursor: "pointer",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                fontSize: "14px"
              }}
            >
              <FolderPlus size={20} />
              Add Folder
            </button>
          </div>

          {/* Folder List */}
          <div style={{ display: "grid", gap: "12px" }}>
            {state.monitor_folders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af" }}>
                <Folder size={48} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
                <p style={{ fontSize: "14px", fontStyle: "italic", margin: 0 }}>No folders configured yet</p>
              </div>
            ) : (
              state.monitor_folders.map((folder, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px",
                    background: "linear-gradient(to right, #f9fafb, #dbeafe)",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
                    <Folder size={20} color="#14b8a6" />
                    <span style={{ fontSize: "14px", fontFamily: "monospace", color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {folder}
                    </span>
                  </div>
                  <button
                    onClick={() => removeMonitorFolder(folder)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 16px",
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: 500,
                      cursor: "pointer",
                      fontSize: "14px"
                    }}
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Save Button */}
          {state.monitor_folders.length > 0 && (
            <button
              onClick={saveConfig}
              style={{
                marginTop: "24px",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "12px 24px",
                background: "linear-gradient(to right, #2563eb, #4f46e5)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontWeight: 500,
                cursor: "pointer",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                fontSize: "14px"
              }}
            >
              <Save size={20} />
              Save Configuration
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
