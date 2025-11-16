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
        setState(
          data.state || {
            monitor_folders: [],
            backup_folder: "",
            startMonitoring: false,
          }
        );
        setMonitoring(data.monitoring_active || false);
        setBackupFolder(data.state?.backup_folder || "");
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
          startMonitoring: state.startMonitoring,
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
        showStatus(
          "Monitoring started! Agent will sync within 60 seconds.",
          "success"
        );
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
        showStatus(
          "Monitoring stopped! Agent will sync within 60 seconds.",
          "success"
        );
      } else {
        showStatus("Failed to stop monitoring", "error");
      }
    } catch (err) {
      showStatus("Error stopping monitoring", "error");
    }
  };

  const statusColors = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const statusIcons = {
    success: <CheckCircle2 className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 shadow-sm z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            VigilantLog
          </h1>
          <span className="text-sm text-gray-400">|</span>
          <span className="text-sm font-medium text-gray-600">File Monitoring Settings</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100">
            <span className="text-xs text-gray-500 font-medium">Device:</span>
            <span className="text-sm font-semibold text-gray-700">{deviceName}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-sm border border-gray-200">
            <div
              className={`w-2 h-2 rounded-full ${
                monitoring ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
              }`}
            ></div>
            <span
              className={`text-xs font-medium ${
                monitoring ? "text-emerald-700" : "text-gray-500"
              }`}
            >
              {monitoring ? "Active" : "Stopped"}
            </span>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
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
            className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            File Backups
          </a>
          <a
            href="/file-settings"
            className="block px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium shadow-md"
          >
            File Settings
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 mt-16 p-8">
        {/* Device Info Card */}
        <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-100 rounded-xl">
                <HardDrive className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium mb-0.5">Connected Device</p>
                <p className="text-lg font-bold text-gray-900">{deviceName}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">Status</p>
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${monitoring ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`}></div>
                <span className={`text-sm font-semibold ${monitoring ? "text-emerald-700" : "text-gray-500"}`}>
                  {monitoring ? "Monitoring Active" : "Monitoring Stopped"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Alert */}
        {status && (
          <div
            className={`mb-6 p-4 rounded-xl border ${statusColors[statusType]} flex items-start gap-3 animate-in slide-in-from-top duration-300`}
          >
            {statusIcons[statusType]}
            <p className="flex-1 font-medium">{status}</p>
          </div>
        )}

        {/* Info Card */}
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How It Works</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Configure backup and monitor folders below
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Click "Save Configuration" to persist settings
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Start monitoring - agent syncs within 60 seconds
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Files backed up locally and uploaded to cloud
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Monitoring Control Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Play className="w-6 h-6 text-indigo-600" />
              Monitoring Control
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={startMonitoring}
                disabled={monitoring}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  monitoring
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:scale-105"
                }`}
              >
                <Play className="w-5 h-5" />
                Start Monitoring
              </button>
              <button
                onClick={stopMonitoring}
                disabled={!monitoring}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  !monitoring
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-lg hover:scale-105"
                }`}
              >
                <StopCircle className="w-5 h-5" />
                Stop Monitoring
              </button>
            </div>
          </div>

          {/* Backup Folder Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <HardDrive className="w-6 h-6 text-indigo-600" />
              Backup Folder
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Local folder where backup files will be saved
            </p>
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                💡 <strong>Tip:</strong> Use absolute path like{" "}
                <code className="bg-amber-100 px-2 py-0.5 rounded">
                  C:\Users\YourName\VigilantLog_Backups
                </code>
              </p>
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                value={backupFolder}
                onChange={(e) => setBackupFolder(e.target.value)}
                placeholder="e.g., C:\Users\YourName\Desktop\backups"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              <button
                onClick={saveConfig}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all"
              >
                <Save className="w-5 h-5" />
                Save
              </button>
            </div>
          </div>

          {/* Monitor Folders Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Folder className="w-6 h-6 text-indigo-600" />
              Folders to Monitor
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Add folders to watch for file changes
            </p>
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                💡 <strong>Tip:</strong> Use absolute paths like{" "}
                <code className="bg-amber-100 px-2 py-0.5 rounded">
                  C:\Users\YourName\Documents\Important
                </code>
              </p>
            </div>

            {/* Add Folder Input */}
            <div className="flex gap-3 mb-6">
              <input
                type="text"
                value={newFolder}
                onChange={(e) => setNewFolder(e.target.value)}
                placeholder="e.g., C:\Users\YourName\Documents"
                onKeyPress={(e) => e.key === "Enter" && addMonitorFolder()}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
              />
              <button
                onClick={addMonitorFolder}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all"
              >
                <FolderPlus className="w-5 h-5" />
                Add Folder
              </button>
            </div>

            {/* Folder List */}
            <div className="space-y-3">
              {state.monitor_folders.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Folder className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm italic">No folders configured yet</p>
                </div>
              ) : (
                state.monitor_folders.map((folder, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Folder className="w-5 h-5 text-teal-600 flex-shrink-0" />
                      <span className="text-sm font-mono text-gray-700 truncate">
                        {folder}
                      </span>
                    </div>
                    <button
                      onClick={() => removeMonitorFolder(folder)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
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
                className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all"
              >
                <Save className="w-5 h-5" />
                Save Configuration
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
