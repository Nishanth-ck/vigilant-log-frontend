// src/pages/SystemHealth.jsx
import React, { useEffect, useState } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import "../styles/dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function SystemHealth() {
  const [systemMetrics, setSystemMetrics] = useState({
    cpuUsage: 42,
    ramUsed: 6.5,
    ramTotal: 16,
    diskUsed: 320,
    diskTotal: 512,
    temperature: 48,
    uptime: "4d 12h 35m",
    processes: 187,
  });

  const [cpuHistory, setCpuHistory] = useState([35, 38, 42, 40, 45, 42]);
  const [ramHistory, setRamHistory] = useState([38, 40, 42, 41, 40, 41]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics((prev) => ({
        ...prev,
        cpuUsage: Math.min(
          100,
          Math.max(0, prev.cpuUsage + (Math.random() - 0.5) * 10)
        ),
        ramUsed: Math.min(
          prev.ramTotal,
          Math.max(0, prev.ramUsed + (Math.random() - 0.5) * 0.5)
        ),
        temperature: Math.min(
          100,
          Math.max(30, prev.temperature + (Math.random() - 0.5) * 3)
        ),
      }));

      setCpuHistory((prev) => {
        const newHistory = [...prev.slice(1), systemMetrics.cpuUsage];
        return newHistory;
      });

      setRamHistory((prev) => {
        const ramPercent =
          (systemMetrics.ramUsed / systemMetrics.ramTotal) * 100;
        const newHistory = [...prev.slice(1), ramPercent];
        return newHistory;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [systemMetrics.cpuUsage, systemMetrics.ramUsed, systemMetrics.ramTotal]);

  const ramPercent = (
    (systemMetrics.ramUsed / systemMetrics.ramTotal) *
    100
  ).toFixed(1);
  const diskPercent = (
    (systemMetrics.diskUsed / systemMetrics.diskTotal) *
    100
  ).toFixed(1);

  const getStatusColor = (percent) => {
    if (percent < 50) return "#00D4BD";
    if (percent < 80) return "#FFA500";
    return "#FF4560";
  };

  const getStatusLabel = (percent) => {
    if (percent < 50) return "Healthy";
    if (percent < 80) return "Moderate";
    return "Critical";
  };

  return (
    <div className="dashboard-root">
      <Sidebar active="health" />
      <main className="main">
        <HealthHeader />
        <div className="content">
          <SystemOverview systemMetrics={systemMetrics} />
          <MetricsGrid
            systemMetrics={systemMetrics}
            ramPercent={ramPercent}
            diskPercent={diskPercent}
            getStatusColor={getStatusColor}
            getStatusLabel={getStatusLabel}
          />
          <ChartsGrid
            cpuHistory={cpuHistory}
            ramHistory={ramHistory}
            systemMetrics={systemMetrics}
            ramPercent={ramPercent}
            diskPercent={diskPercent}
          />
        </div>
      </main>
    </div>
  );
}

function Sidebar({ active }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊", href: "/dashboard" },
    {
      id: "health",
      label: "System Health",
      icon: "💚",
      href: "/system-health",
    },
    { id: "analysis", label: "Analysis", icon: "🔍", href: "/analysis" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-icon">⚡</span>
        <span className="brand-text">VigilantLog</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={`nav-item ${active === item.id ? "active" : ""}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}

function HealthHeader() {
  return (
    <header className="header">
      <div>
        <h1 className="header-title">System Health</h1>
        <p className="header-subtitle">Real-time performance monitoring</p>
      </div>
      <div className="header-right">
        <div className="status-badge">
          <span className="status-dot"></span>
          Monitoring
        </div>
      </div>
    </header>
  );
}

function SystemOverview({ systemMetrics }) {
  return (
    <div className="system-overview">
      <div className="overview-card">
        <span className="overview-icon">⏱️</span>
        <div className="overview-content">
          <div className="overview-label">Uptime</div>
          <div className="overview-value">{systemMetrics.uptime}</div>
        </div>
      </div>
      <div className="overview-card">
        <span className="overview-icon">⚙️</span>
        <div className="overview-content">
          <div className="overview-label">Active Processes</div>
          <div className="overview-value">{systemMetrics.processes}</div>
        </div>
      </div>
      <div className="overview-card">
        <span className="overview-icon">🌡️</span>
        <div className="overview-content">
          <div className="overview-label">Temperature</div>
          <div className="overview-value">{systemMetrics.temperature}°C</div>
        </div>
      </div>
    </div>
  );
}

function MetricsGrid({
  systemMetrics,
  ramPercent,
  diskPercent,
  getStatusColor,
  getStatusLabel,
}) {
  const metrics = [
    {
      title: "CPU Usage",
      value: `${systemMetrics.cpuUsage.toFixed(1)}%`,
      percent: systemMetrics.cpuUsage,
      icon: "🖥️",
    },
    {
      title: "Memory Usage",
      value: `${systemMetrics.ramUsed.toFixed(1)} / ${
        systemMetrics.ramTotal
      } GB`,
      percent: parseFloat(ramPercent),
      icon: "💾",
    },
    {
      title: "Disk Usage",
      value: `${systemMetrics.diskUsed} / ${systemMetrics.diskTotal} GB`,
      percent: parseFloat(diskPercent),
      icon: "💿",
    },
    {
      title: "System Temperature",
      value: `${systemMetrics.temperature.toFixed(0)}°C`,
      percent: (systemMetrics.temperature / 100) * 100,
      icon: "🌡️",
    },
  ];

  return (
    <div className="health-metrics-grid">
      {metrics.map((metric, idx) => (
        <MetricCard
          key={idx}
          metric={metric}
          color={getStatusColor(metric.percent)}
          status={getStatusLabel(metric.percent)}
        />
      ))}
    </div>
  );
}

function MetricCard({ metric, color, status }) {
  return (
    <div className="health-metric-card">
      <div className="health-metric-header">
        <span className="health-metric-icon">{metric.icon}</span>
        <span
          className="health-status-badge"
          style={{
            background: `${color}20`,
            color: color,
          }}
        >
          {status}
        </span>
      </div>
      <div className="health-metric-title">{metric.title}</div>
      <div className="health-metric-value" style={{ color }}>
        {metric.value}
      </div>
      <div className="health-progress-container">
        <div className="health-progress-bar">
          <div
            className="health-progress-fill"
            style={{
              width: `${metric.percent}%`,
              background: color,
            }}
          ></div>
        </div>
        <span className="health-progress-text">
          {metric.percent.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

function ChartsGrid({
  cpuHistory,
  ramHistory,
  systemMetrics,
  ramPercent,
  diskPercent,
}) {
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: "rgba(0,0,0,0.03)" },
        ticks: { color: "#64748B", font: { size: 12 } },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#64748B", font: { size: 12 } },
      },
    },
  };

  const cpuChartData = {
    labels: ["6m ago", "5m ago", "4m ago", "3m ago", "2m ago", "Now"],
    datasets: [
      {
        label: "CPU Usage",
        data: cpuHistory,
        borderColor: "#667eea",
        backgroundColor: "rgba(102, 126, 234, 0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: "#667eea",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const ramChartData = {
    labels: ["6m ago", "5m ago", "4m ago", "3m ago", "2m ago", "Now"],
    datasets: [
      {
        label: "RAM Usage",
        data: ramHistory,
        borderColor: "#00D4BD",
        backgroundColor: "rgba(0, 212, 189, 0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: "#00D4BD",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const storageChartData = {
    labels: ["Used", "Free"],
    datasets: [
      {
        data: [parseFloat(diskPercent), 100 - parseFloat(diskPercent)],
        backgroundColor: ["#FFA500", "#E5E7EB"],
        borderWidth: 0,
        cutout: "70%",
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 16,
          font: { size: 13, family: "Inter" },
          color: "#64748B",
        },
      },
    },
  };

  return (
    <div className="health-charts-grid">
      <div className="health-chart-card">
        <h3 className="chart-title">CPU Usage Over Time</h3>
        <div className="chart-container">
          <Line data={cpuChartData} options={lineChartOptions} />
        </div>
      </div>
      <div className="health-chart-card">
        <h3 className="chart-title">Memory Usage Over Time</h3>
        <div className="chart-container">
          <Line data={ramChartData} options={lineChartOptions} />
        </div>
      </div>
      <div className="health-chart-card">
        <h3 className="chart-title">Storage Distribution</h3>
        <div className="chart-container doughnut-chart">
          <Doughnut data={storageChartData} options={doughnutOptions} />
          <div className="doughnut-center">
            <div className="doughnut-value">{diskPercent}%</div>
            <div className="doughnut-label">Used</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// // src/pages/SystemHealth.jsx
// import "../styles/dashboard.css";

// export default function SystemHealth() {
//   const systemMetrics = {
//     cpuUsage: 42,
//     ramUsed: 6.5,
//     ramTotal: 16,
//     diskUsed: 320,
//     diskTotal: 512,
//     temperature: 48,
//   };

//   const ramPercent = (
//     (systemMetrics.ramUsed / systemMetrics.ramTotal) *
//     100
//   ).toFixed(1);
//   const diskPercent = (
//     (systemMetrics.diskUsed / systemMetrics.diskTotal) *
//     100
//   ).toFixed(1);

//   return (
//     <div className="dashboard-root">
//       <aside className="sidebar">
//         <div className="sidebar-brand">VigilantLog</div>
//         <nav className="sidebar-nav">
//           <a className="nav-item" href="/dashboard">
//             Dashboard
//           </a>
//           <a className="nav-item active" href="/system-health">
//             System Health
//           </a>
//           <a className="nav-item" href="/analysis">
//             Analysis
//           </a>
//         </nav>
//       </aside>

//       <main className="main">
//         <header className="topbar">
//           <h2>System Health</h2>
//           <div className="user">System performance metrics</div>
//         </header>

//         <section className="results-grid">
//           <div className="metric-card">
//             <div className="metric-title">CPU Usage</div>
//             <div className="metric-main" style={{ color: "#2563eb" }}>
//               {systemMetrics.cpuUsage}%
//             </div>
//             <div className="progress-bar">
//               <div
//                 className="progress-fill"
//                 style={{
//                   width: `${systemMetrics.cpuUsage}%`,
//                   background: "#2563eb",
//                 }}
//               ></div>
//             </div>
//           </div>

//           <div className="metric-card">
//             <div className="metric-title">Memory Usage</div>
//             <div className="metric-main" style={{ color: "#0ea5a4" }}>
//               {systemMetrics.ramUsed} GB / {systemMetrics.ramTotal} GB (
//               {ramPercent}%)
//             </div>
//             <div className="progress-bar">
//               <div
//                 className="progress-fill"
//                 style={{ width: `${ramPercent}%`, background: "#0ea5a4" }}
//               ></div>
//             </div>
//           </div>

//           <div className="metric-card">
//             <div className="metric-title">Disk Usage</div>
//             <div className="metric-main" style={{ color: "#f59e0b" }}>
//               {systemMetrics.diskUsed} GB / {systemMetrics.diskTotal} GB (
//               {diskPercent}%)
//             </div>
//             <div className="progress-bar">
//               <div
//                 className="progress-fill"
//                 style={{ width: `${diskPercent}%`, background: "#f59e0b" }}
//               ></div>
//             </div>
//           </div>

//           <div className="metric-card">
//             <div className="metric-title">System Temperature</div>
//             <div className="metric-main" style={{ color: "#ef4444" }}>
//               {systemMetrics.temperature}°C
//             </div>
//             <div className="progress-bar">
//               <div
//                 className="progress-fill"
//                 style={{
//                   width: `${(systemMetrics.temperature / 100) * 100}%`,
//                   background: "#ef4444",
//                 }}
//               ></div>
//             </div>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }
