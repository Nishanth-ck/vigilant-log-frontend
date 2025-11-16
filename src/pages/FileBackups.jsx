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

const FILE_MONITORING_API_URL =
  import.meta.env.VITE_FILE_MONITORING_API_URL || "https://vigilantlog-backend.onrender.com";

export default function FileBackups() {
  const [localFiles, setLocalFiles] = useState([]);
  const [cloudFiles, setCloudFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [statusType, setStatusType] = useState("info");

  const fetchBackups = async () => {
    setLoading(true);
    try {
      const deviceId = sessionStorage.getItem("deviceName") || "default";

      // Fetch local backups
      const localRes = await fetch(
        `${FILE_MONITORING_API_URL}/api/file-monitor/backups/local?deviceId=${deviceId}`
      );
      if (localRes.ok) {
        const localData = await localRes.json();
        setLocalFiles(localData.files || []);
      }

      // Fetch cloud backups
      const cloudRes = await fetch(`${FILE_MONITORING_API_URL}/api/file-monitor/backups/cloud`);
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

  const showStatus = (message, type = "info") => {
    setUploadStatus(message);
    setStatusType(type);
    setTimeout(() => setUploadStatus(""), 3000);
  };

  const uploadToCloud = async () => {
    showStatus("Uploading to cloud...", "info");
    try {
      const res = await fetch(`${FILE_MONITORING_API_URL}/api/file-monitor/upload`, {
        method: "POST",
      });
      if (res.ok) {
        showStatus("Upload completed successfully!", "success");
        fetchBackups();
      } else {
        showStatus("Upload failed", "error");
      }
    } catch (err) {
      showStatus("Upload error", "error");
    }
  };

  const downloadFile = (filename, isCloud = false) => {
    const url = isCloud
      ? `${FILE_MONITORING_API_URL}/api/file-monitor/backups/cloud/${filename}`
      : `${FILE_MONITORING_API_URL}/api/file-monitor/backups/local/${filename}`;
    window.open(url, "_blank");
  };

  const deleteFile = async (filename, isCloud = false) => {
    if (!window.confirm(`Delete ${filename}?`)) return;

    try {
      const url = isCloud
        ? `${FILE_MONITORING_API_URL}/api/file-monitor/backups/cloud/${filename}`
        : `${FILE_MONITORING_API_URL}/api/file-monitor/backups/local/${filename}`;

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
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const statusIcons = {
    success: <CheckCircle2 className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <RefreshCw className="w-5 h-5 animate-spin" />,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 shadow-sm z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            VigilantLog
          </h1>
          <span className="text-sm text-gray-400">|</span>
          <span className="text-sm font-medium text-gray-600">File Backups</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200">
            <HardDrive className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-semibold text-blue-700">
              {localFiles.length} Local
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200">
            <Cloud className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-semibold text-purple-700">
              {cloudFiles.length} Cloud
            </span>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            VigilantLog
          </h1>
        </div>
        <nav className="px-4 space-y-1">
          <a
            href="/dashboard"
            className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Dashboard
          </a>
          <a
            href="/system-health"
            className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            System Health
          </a>
          <a
            href="/analysis"
            className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Analysis
          </a>
          <a
            href="/file-backups"
            className="block px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-md"
          >
            File Backups
          </a>
          <a
            href="/file-settings"
            className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            File Settings
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 mt-16 p-8">
        {/* Quick Stats & Actions */}
        <div className="mb-6 flex items-center justify-between">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <HardDrive className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Local Backups</p>
                  <p className="text-2xl font-bold text-gray-900">{localFiles.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Cloud className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Cloud Backups</p>
                  <p className="text-2xl font-bold text-gray-900">{cloudFiles.length}</p>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={fetchBackups}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Status Alert */}
        {uploadStatus && (
          <div
            className={`mb-6 p-4 rounded-xl border ${statusColors[statusType]} flex items-start gap-3 animate-in slide-in-from-top duration-300`}
          >
            {statusIcons[statusType]}
            <p className="flex-1 font-medium">{uploadStatus}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Local Backups Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
            <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <HardDrive className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Local Backups
                    </h3>
                    <p className="text-sm text-gray-600">
                      {localFiles.length} file{localFiles.length !== 1 ? "s" : ""}{" "}
                      on your computer
                    </p>
                  </div>
                </div>
                <button
                  onClick={uploadToCloud}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all"
                >
                  <Upload className="w-5 h-5" />
                  Upload to Cloud
                </button>
              </div>
            </div>

            <div className="p-6">
              {localFiles.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                    <Folder className="w-8 h-8 text-blue-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    No local backups yet
                  </h4>
                  <p className="text-sm text-gray-600 max-w-md mx-auto mb-4">
                    Local backups are stored on your computer. They'll appear
                    here once monitoring is active and files are backed up.
                  </p>
                  <div className="inline-block px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700">
                      💡 Check backup folder path in{" "}
                      <a
                        href="/file-settings"
                        className="font-semibold underline hover:text-blue-800"
                      >
                        File Settings
                      </a>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-3">
                  {localFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <File className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                            <span>{formatSize(file.size)}</span>
                            <span>•</span>
                            <span>{formatDate(file.modified)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => downloadFile(file.name, false)}
                          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteFile(file.name, false)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cloud Backups Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
            <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Cloud className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Cloud Backups
                  </h3>
                  <p className="text-sm text-gray-600">
                    {cloudFiles.length} file{cloudFiles.length !== 1 ? "s" : ""}{" "}
                    in MongoDB
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {cloudFiles.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-50 rounded-full mb-4">
                    <Cloud className="w-8 h-8 text-purple-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    No cloud backups yet
                  </h4>
                  <p className="text-sm text-gray-600 max-w-md mx-auto">
                    Cloud backups are automatically uploaded from your local
                    backups. Start monitoring to begin backing up files.
                  </p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {cloudFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl border border-gray-200 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <File className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                            <span>{formatSize(file.size)}</span>
                            <span>•</span>
                            <span>{formatDate(file.uploaded)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => downloadFile(file.name, true)}
                          className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteFile(file.name, true)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
