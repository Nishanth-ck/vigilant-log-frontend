// src/pages/FileBackups.jsx
import React, { useState, useEffect } from "react";
import { Download, Trash2, Upload, RefreshCw } from "lucide-react";
import "../styles/dashboard.css";

// File Monitoring API URL - configure for your deployed backend
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function FileBackups() {
  const [localFiles, setLocalFiles] = useState([]);
  const [cloudFiles, setCloudFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  const fetchBackups = async () => {
    setLoading(true);
    try {
      // Fetch local backups
      const localRes = await fetch(`${API_URL}/api/file-monitor/backups/local`);
      if (localRes.ok) {
        const localData = await localRes.json();
        setLocalFiles(localData.files || []);
      }

      // Fetch cloud backups
      const cloudRes = await fetch(`${API_URL}/api/file-monitor/backups/cloud`);
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
    fetchBackups();
  }, []);

  const uploadToCloud = async () => {
    setUploadStatus("Uploading...");
    try {
      const res = await fetch(`${API_URL}/api/file-monitor/upload`, {
        method: "POST",
      });
      if (res.ok) {
        setUploadStatus("Upload completed!");
        setTimeout(() => setUploadStatus(""), 3000);
        fetchBackups();
      } else {
        setUploadStatus("Upload failed");
      }
    } catch (err) {
      setUploadStatus("Upload error");
    }
  };

  const downloadFile = (filename, isCloud = false) => {
    const url = isCloud
      ? `${API_URL}/api/file-monitor/backups/cloud/${filename}`
      : `${API_URL}/api/file-monitor/backups/local/${filename}`;
    window.open(url, "_blank");
  };

  const deleteFile = async (filename, isCloud = false) => {
    if (!window.confirm(`Delete ${filename}?`)) return;

    try {
      const url = isCloud
        ? `${API_URL}/api/file-monitor/backups/cloud/${filename}`
        : `${API_URL}/api/file-monitor/backups/local/${filename}`;
      
      const res = await fetch(url, { method: "DELETE" });
      if (res.ok) {
        fetchBackups();
      } else {
        alert("Failed to delete file");
      }
    } catch (err) {
      alert("Error deleting file");
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleString();
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
          <a className="nav-item active" href="/file-backups">
            File Backups
          </a>
          <a className="nav-item" href="/file-settings">
            File Settings
          </a>
        </nav>
      </aside>

      <main className="main">
        <header className="topbar">
          <h2>File Backups</h2>
          <div className="user">
            <button
              onClick={fetchBackups}
              style={{
                padding: "8px 16px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </header>

        {loading && <p style={{ padding: "20px" }}>Loading backups...</p>}

        {/* Local Backups Section */}
        <section style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3>Local Backups ({localFiles.length})</h3>
            <button
              onClick={uploadToCloud}
              style={{
                padding: "8px 16px",
                background: "#0ea5a4",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Upload size={16} />
              Upload to Cloud
            </button>
          </div>
          
          {uploadStatus && (
            <p style={{ color: "#0ea5a4", marginBottom: "12px" }}>{uploadStatus}</p>
          )}

          {localFiles.length === 0 ? (
            <div style={{ 
              padding: "20px", 
              background: "#f0f9ff", 
              borderRadius: "8px",
              border: "1px solid #7dd3fc" 
            }}>
              <p style={{ margin: "0 0 12px 0", color: "#0369a1", fontWeight: 600 }}>
                📁 Local backups are stored on your computer
              </p>
              <p style={{ margin: "0 0 8px 0", color: "#0c4a6e" }}>
                To view your local backup files:
              </p>
              <ol style={{ margin: 0, paddingLeft: "20px", color: "#0c4a6e" }}>
                <li>Open File Explorer (Windows) or Finder (Mac)</li>
                <li>Navigate to your configured backup folder</li>
                <li>Files will be named: <code style={{ background: "#e0f2fe", padding: "2px 6px", borderRadius: "3px" }}>OriginalName_BACKUP</code></li>
              </ol>
              <p style={{ margin: "12px 0 0 0", color: "#64748b", fontSize: "14px" }}>
                💡 Check the backup folder path in <a href="/file-settings" style={{ color: "#0ea5a4", fontWeight: 600 }}>File Settings</a>
              </p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  background: "white",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <thead>
                  <tr style={{ background: "#f3f4f6" }}>
                    <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>
                      Filename
                    </th>
                    <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>
                      Size
                    </th>
                    <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>
                      Modified
                    </th>
                    <th style={{ padding: "12px", textAlign: "center", fontWeight: 600 }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {localFiles.map((file, idx) => (
                    <tr key={idx} style={{ borderTop: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "12px" }}>{file.name}</td>
                      <td style={{ padding: "12px" }}>{formatSize(file.size)}</td>
                      <td style={{ padding: "12px" }}>{formatDate(file.modified)}</td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <button
                          onClick={() => downloadFile(file.name, false)}
                          style={{
                            padding: "6px 12px",
                            background: "#2563eb",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            marginRight: "8px",
                          }}
                          title="Download"
                        >
                          <Download size={16} />
                        </button>
                        <button
                          onClick={() => deleteFile(file.name, false)}
                          style={{
                            padding: "6px 12px",
                            background: "#ef4444",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Cloud Backups Section */}
        <section style={{ padding: "20px" }}>
          <h3 style={{ marginBottom: "16px" }}>Cloud Backups ({cloudFiles.length})</h3>
          
          {cloudFiles.length === 0 ? (
            <p style={{ color: "#999" }}>No cloud backups found</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  background: "white",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <thead>
                  <tr style={{ background: "#f3f4f6" }}>
                    <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>
                      Filename
                    </th>
                    <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>
                      Size
                    </th>
                    <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>
                      Uploaded
                    </th>
                    <th style={{ padding: "12px", textAlign: "center", fontWeight: 600 }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cloudFiles.map((file, idx) => (
                    <tr key={idx} style={{ borderTop: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "12px" }}>{file.name}</td>
                      <td style={{ padding: "12px" }}>{formatSize(file.size)}</td>
                      <td style={{ padding: "12px" }}>{formatDate(file.uploaded)}</td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <button
                          onClick={() => downloadFile(file.name, true)}
                          style={{
                            padding: "6px 12px",
                            background: "#2563eb",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            marginRight: "8px",
                          }}
                          title="Download"
                        >
                          <Download size={16} />
                        </button>
                        <button
                          onClick={() => deleteFile(file.name, true)}
                          style={{
                            padding: "6px 12px",
                            background: "#ef4444",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

