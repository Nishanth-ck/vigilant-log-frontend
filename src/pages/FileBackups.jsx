// src/pages/FileBackups.jsx
import React, { useState, useEffect } from "react";
import {
  Download,
  Trash2,
  Upload,
  RefreshCw,
  HardDrive,
  Cloud,
  File,
  AlertCircle,
  CheckCircle2,
  Folder,
} from "lucide-react";
import { 
  getLoggedInUsername, 
  getDeviceId, 
  isHostnameConfigured 
} from "../utils/userMapping";

const FILE_MONITORING_API_URL =
  import.meta.env.VITE_FILE_MONITORING_API_URL || "https://vigilantlog-backend.onrender.com";

export default function FileBackups() {
  const [localFiles, setLocalFiles] = useState([]);
  const [cloudFiles, setCloudFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [statusType, setStatusType] = useState("info");
  const [username, setUsername] = useState("");
  const [hostnameConfigured, setHostnameConfigured] = useState(false);
  const [hostname, setHostname] = useState("");

  const fetchBackups = async () => {
    const deviceId = getDeviceId();
    
    // Don't fetch if no hostname configured
    if (!deviceId) {
      return;
    }
    
    setLoading(true);
    try {
      const localRes = await fetch(
        `${FILE_MONITORING_API_URL}/api/file-monitor/backups/local?deviceId=${deviceId}`
      );
      if (localRes.ok) {
        const localData = await localRes.json();
        setLocalFiles(localData.files || []);
      }

      // Also pass deviceId to cloud backups for proper filtering
      const cloudRes = await fetch(
        `${FILE_MONITORING_API_URL}/api/file-monitor/backups/cloud?deviceId=${deviceId}`
      );
      if (cloudRes.ok) {
        const cloudData = await cloudRes.json();
        setCloudFiles(cloudData.files || []);
      }
    } catch (err) {
      console.error("Failed to fetch backups:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get logged-in username
    const loggedInUsername = getLoggedInUsername();
    setUsername(loggedInUsername || "");
    
    // Check if hostname is configured
    const isConfigured = isHostnameConfigured();
    setHostnameConfigured(isConfigured);
    
    // Get hostname if configured
    if (isConfigured) {
      const currentHostname = getDeviceId();
      setHostname(currentHostname || "");
      fetchBackups();
    }
  }, []);

  const showStatus = (message, type = "info") => {
    setUploadStatus(message);
    setStatusType(type);
        setTimeout(() => setUploadStatus(""), 3000);
  };

  // Note: Cloud uploads are handled automatically by the desktop agent
  // The agent periodically uploads local backups to cloud when monitoring is active

  const downloadFile = (filename, isCloud = false) => {
    const deviceId = getDeviceId();
    const url = isCloud
      ? `${FILE_MONITORING_API_URL}/api/file-monitor/backups/cloud/${filename}?deviceId=${deviceId}`
      : `${FILE_MONITORING_API_URL}/api/file-monitor/backups/local/${filename}?deviceId=${deviceId}`;
    window.open(url, "_blank");
  };

  const deleteFile = async (filename, isCloud = false) => {
    if (!window.confirm(`Delete ${filename}?`)) return;

    try {
      const deviceId = getDeviceId();
      const url = isCloud
        ? `${FILE_MONITORING_API_URL}/api/file-monitor/backups/cloud/${filename}?deviceId=${deviceId}`
        : `${FILE_MONITORING_API_URL}/api/file-monitor/backups/local/${filename}?deviceId=${deviceId}`;
      
      const res = await fetch(url, { method: "DELETE" });
      if (res.ok) {
        showStatus(`Deleted ${filename}`, "success");
        fetchBackups();
      } else {
        showStatus("Failed to delete file", "error");
      }
    } catch (err) {
      showStatus("Error deleting file", "error");
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  const statusColors = {
    success: { bg: "#ecfdf5", border: "#10b981", color: "#065f46" },
    error: { bg: "#fef2f2", border: "#ef4444", color: "#991b1b" },
    info: { bg: "#eff6ff", border: "#3b82f6", color: "#1e40af" },
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom right, #f9fafb, #fce7f3, #f3e8ff)" }}>
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
          <h1 style={{ fontSize: "20px", fontWeight: "bold", background: "linear-gradient(to right, #a855f7, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>
            VigilantLog
          </h1>
          <span style={{ fontSize: "14px", color: "#9ca3af" }}>|</span>
          <span style={{ fontSize: "14px", fontWeight: 500, color: "#4b5563" }}>File Backups</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 12px", borderRadius: "8px", background: "#dbeafe", border: "1px solid #93c5fd" }}>
            <HardDrive size={16} color="#2563eb" />
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#1e40af" }}>
              {localFiles.length} Local
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 12px", borderRadius: "8px", background: "#f3e8ff", border: "1px solid #d8b4fe" }}>
            <Cloud size={16} color="#a855f7" />
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#7e22ce" }}>
              {cloudFiles.length} Cloud
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
          <h1 style={{ fontSize: "24px", fontWeight: "bold", background: "linear-gradient(to right, #a855f7, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>
            VigilantLog
          </h1>
        </div>
        <nav style={{ padding: "0 16px" }}>
          <a href="/dashboard" style={{ display: "block", padding: "12px 16px", borderRadius: "8px", color: "#374151", textDecoration: "none", marginBottom: "4px" }}>Dashboard</a>
          <a href="/system-health" style={{ display: "block", padding: "12px 16px", borderRadius: "8px", color: "#374151", textDecoration: "none", marginBottom: "4px" }}>System Health</a>
          <a href="/analysis" style={{ display: "block", padding: "12px 16px", borderRadius: "8px", color: "#374151", textDecoration: "none", marginBottom: "4px" }}>Analysis</a>
          <a href="/file-backups" style={{ display: "block", padding: "12px 16px", borderRadius: "8px", background: "linear-gradient(to right, #a855f7, #ec4899)", color: "white", fontWeight: 500, boxShadow: "0 4px 6px rgba(0,0,0,0.1)", textDecoration: "none" }}>File Backups</a>
          <a href="/file-settings" style={{ display: "block", padding: "12px 16px", borderRadius: "8px", color: "#374151", textDecoration: "none" }}>File Settings</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: "256px", marginTop: "64px", padding: "32px" }}>
        
        {/* Empty State - Hostname Not Configured */}
        {!hostnameConfigured && (
          <div style={{ 
            maxWidth: "600px", 
            margin: "100px auto", 
            textAlign: "center",
            background: "white",
            borderRadius: "16px",
            padding: "48px 32px",
            border: "2px dashed #fbbf24",
            boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
          }}>
            <div style={{ 
              width: "80px", 
              height: "80px", 
              background: "#fef3c7", 
              borderRadius: "50%", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              margin: "0 auto 24px"
            }}>
              <AlertCircle size={40} color="#f59e0b" />
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#111827", marginBottom: "12px" }}>
              Hostname Not Configured
            </h2>
            <p style={{ fontSize: "16px", color: "#6b7280", marginBottom: "24px", lineHeight: "1.6" }}>
              {username ? `Hi ${username}, ` : ""}Please configure your hostname in File Settings to view and manage your backups.
            </p>
            <a 
              href="/file-settings"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                background: "linear-gradient(to right, #2563eb, #4f46e5)",
                color: "white",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "14px",
                boxShadow: "0 2px 4px rgba(37,99,235,0.2)",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => e.target.style.transform = "translateY(-1px)"}
              onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
            >
              Go to File Settings
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z"/>
              </svg>
            </a>
          </div>
        )}
        
        {/* Show content only if hostname is configured */}
        {hostnameConfigured && (
          <>
        {/* Quick Stats & Actions */}
        <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
            <div style={{ background: "white", borderRadius: "12px", padding: "16px", border: "1px solid #e5e7eb", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ padding: "8px", background: "#dbeafe", borderRadius: "8px" }}>
                  <HardDrive size={20} color="#2563eb" />
                </div>
                <div>
                  <p style={{ fontSize: "12px", color: "#6b7280", fontWeight: 500, margin: 0 }}>Local Backups</p>
                  <p style={{ fontSize: "24px", fontWeight: "bold", color: "#111827", margin: 0 }}>{localFiles.length}</p>
                </div>
              </div>
            </div>
            <div style={{ background: "white", borderRadius: "12px", padding: "16px", border: "1px solid #e5e7eb", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ padding: "8px", background: "#f3e8ff", borderRadius: "8px" }}>
                  <Cloud size={20} color="#a855f7" />
                </div>
                <div>
                  <p style={{ fontSize: "12px", color: "#6b7280", fontWeight: 500, margin: 0 }}>Cloud Backups</p>
                  <p style={{ fontSize: "24px", fontWeight: "bold", color: "#111827", margin: 0 }}>{cloudFiles.length}</p>
                </div>
              </div>
            </div>
          </div>
            <button
              onClick={fetchBackups}
            disabled={loading}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              padding: "12px 24px",
              background: "linear-gradient(to right, #a855f7, #ec4899)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              opacity: loading ? 0.5 : 1,
              fontSize: "14px"
              }}
            >
            <RefreshCw size={20} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
              Refresh
            </button>
          </div>

        {/* Info Banner */}
        <div style={{
          marginBottom: "24px",
          padding: "16px 20px",
          borderRadius: "12px",
          border: "1px solid #93c5fd",
          background: "linear-gradient(to right, #dbeafe, #e0e7ff)",
                display: "flex",
          alignItems: "flex-start",
          gap: "12px"
        }}>
          <Upload size={20} color="#2563eb" style={{ marginTop: "2px", flexShrink: 0 }} />
          <div>
            <p style={{ fontWeight: 600, color: "#1e3a8a", margin: "0 0 4px 0", fontSize: "14px" }}>
              Automatic Cloud Sync
            </p>
            <p style={{ color: "#1e40af", margin: 0, fontSize: "13px", lineHeight: "1.5" }}>
              Local backups are automatically uploaded to the cloud when monitoring is active. 
              The desktop agent syncs every 60 seconds.
            </p>
          </div>
          </div>
          
        {/* Status Alert */}
          {uploadStatus && (
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
            {statusType === "info" && <RefreshCw size={20} color={statusColors[statusType].color} style={{ animation: "spin 1s linear infinite" }} />}
            <p style={{ flex: 1, fontWeight: 500, color: statusColors[statusType].color, margin: 0 }}>{uploadStatus}</p>
          </div>
        )}

        {/* Local Backups Card */}
        <div style={{ background: "white", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb", overflow: "hidden", marginBottom: "24px" }}>
          <div style={{ padding: "24px", background: "linear-gradient(to right, #dbeafe, #bfdbfe)", borderBottom: "1px solid #e5e7eb" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ padding: "12px", background: "#dbeafe", borderRadius: "12px" }}>
                  <HardDrive size={24} color="#2563eb" />
                </div>
                <div>
                  <h3 style={{ fontSize: "20px", fontWeight: 600, color: "#111827", margin: 0 }}>
                    Local Backups
                  </h3>
                  <p style={{ fontSize: "14px", color: "#4b5563", margin: 0 }}>
                    {localFiles.length} file{localFiles.length !== 1 ? "s" : ""} on your computer
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", background: "#dbeafe", borderRadius: "8px", border: "1px solid #93c5fd" }}>
                <Upload size={18} color="#2563eb" />
                <span style={{ fontSize: "13px", fontWeight: 500, color: "#1e40af" }}>
                  Auto-synced to cloud
                </span>
              </div>
            </div>
          </div>

          <div style={{ padding: "24px" }}>
          {localFiles.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 0" }}>
                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "64px", height: "64px", background: "#dbeafe", borderRadius: "50%", marginBottom: "16px" }}>
                  <Folder size={32} color="#60a5fa" />
                </div>
                <h4 style={{ fontSize: "18px", fontWeight: 600, color: "#111827", margin: "0 0 8px 0" }}>
                  No local backups yet
                </h4>
                <p style={{ fontSize: "14px", color: "#6b7280", maxWidth: "400px", margin: "0 auto 16px" }}>
                  Local backups are stored on your computer. They'll appear here once monitoring is active and files are backed up.
                </p>
                <div style={{ display: "inline-block", padding: "16px", background: "#dbeafe", borderRadius: "8px", border: "1px solid #93c5fd" }}>
                  <p style={{ fontSize: "14px", color: "#1e40af", margin: 0 }}>
                    💡 Check backup folder path in{" "}
                    <a href="/file-settings" style={{ fontWeight: 600, textDecoration: "underline", color: "#1e40af" }}>
                      File Settings
                    </a>
              </p>
                </div>
            </div>
          ) : (
              <div style={{ display: "grid", gap: "12px" }}>
                {localFiles.map((file, idx) => (
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
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1, minWidth: 0 }}>
                      <div style={{ padding: "8px", background: "#dbeafe", borderRadius: "8px" }}>
                        <File size={20} color="#2563eb" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 500, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: "0 0 4px 0" }}>
                          {file.name}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "12px", color: "#6b7280" }}>
                          <span>{formatSize(file.size)}</span>
                          <span>•</span>
                          <span>{formatDate(file.modified)}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <button
                          onClick={() => downloadFile(file.name, false)}
                        style={{ padding: "8px", background: "#3b82f6", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}
                          title="Download"
                        >
                          <Download size={16} />
                        </button>
                        <button
                          onClick={() => deleteFile(file.name, false)}
                        style={{ padding: "8px", background: "#ef4444", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                    </div>
                  </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Cloud Backups Card */}
        <div style={{ background: "white", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb", overflow: "hidden" }}>
          <div style={{ padding: "24px", background: "linear-gradient(to right, #f3e8ff, #e9d5ff)", borderBottom: "1px solid #e5e7eb" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ padding: "12px", background: "#f3e8ff", borderRadius: "12px" }}>
                <Cloud size={24} color="#a855f7" />
              </div>
              <div>
                <h3 style={{ fontSize: "20px", fontWeight: 600, color: "#111827", margin: 0 }}>
                  Cloud Backups
                </h3>
                <p style={{ fontSize: "14px", color: "#4b5563", margin: 0 }}>
                  {cloudFiles.length} file{cloudFiles.length !== 1 ? "s" : ""} in MongoDB
                </p>
              </div>
            </div>
          </div>

          <div style={{ padding: "24px" }}>
          {cloudFiles.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 0" }}>
                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "64px", height: "64px", background: "#f3e8ff", borderRadius: "50%", marginBottom: "16px" }}>
                  <Cloud size={32} color="#c084fc" />
                </div>
                <h4 style={{ fontSize: "18px", fontWeight: 600, color: "#111827", margin: "0 0 8px 0" }}>
                  No cloud backups yet
                </h4>
                <p style={{ fontSize: "14px", color: "#6b7280", maxWidth: "400px", margin: "0 auto" }}>
                  Cloud backups are automatically uploaded from your local backups. Start monitoring to begin backing up files.
                </p>
              </div>
          ) : (
              <div style={{ display: "grid", gap: "12px" }}>
                {cloudFiles.map((file, idx) => (
                  <div
                    key={idx}
                style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px",
                      background: "linear-gradient(to right, #f9fafb, #f3e8ff)",
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1, minWidth: 0 }}>
                      <div style={{ padding: "8px", background: "#f3e8ff", borderRadius: "8px" }}>
                        <File size={20} color="#a855f7" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 500, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: "0 0 4px 0" }}>
                          {file.name}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "12px", color: "#6b7280" }}>
                          <span>{formatSize(file.size)}</span>
                          <span>•</span>
                          <span>{formatDate(file.uploaded)}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <button
                          onClick={() => downloadFile(file.name, true)}
                        style={{ padding: "8px", background: "#a855f7", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}
                          title="Download"
                        >
                          <Download size={16} />
                        </button>
                        <button
                          onClick={() => deleteFile(file.name, true)}
                        style={{ padding: "8px", background: "#ef4444", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                    </div>
                  </div>
                  ))}
            </div>
          )}
          </div>
        </div>
        </>
        )}
      </main>
    </div>
  );
}
