// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import "../styles/dashboard.css";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [bsodEntry, setBsodEntry] = useState(null);
  const [appEntry, setAppEntry] = useState(null);
  const [unexpectedEntry, setUnexpectedEntry] = useState(null);
  const [hangEntry, setHangEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const CACHE_KEY = "vigilant_log_cache";
    const CACHE_DURATION = 7 * 60 * 1000; // 7 minutes

    const getData = async (forceRefresh = false) => {
      try {
        if (!forceRefresh) {
          const cachedData = localStorage.getItem(CACHE_KEY);
          if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData);
            const now = Date.now();

            if (now - timestamp < CACHE_DURATION) {
              setBsodEntry(data.bsod);
              setAppEntry(data.app);
              setUnexpectedEntry(data.shutdown);
              setHangEntry(data.hang);
              setLoading(false);
              return;
            }
          }
        }

        setLoading(true);
        const deviceName = sessionStorage.getItem("deviceName") || "GOAT";

        const [bsodData, appData, shutdownData, hangData] = await Promise.all([
          axios.post(
            "https://vigilant-log-cyberx.onrender.com/api/prediction/bsod",
            { deviceName }
          ),
          axios.post(
            "https://vigilant-log-cyberx.onrender.com/api/prediction/app-crash",
            { deviceName }
          ),
          axios.post(
            "https://vigilant-log-cyberx.onrender.com/api/prediction/shutdown",
            { deviceName }
          ),
          axios.post(
            "https://vigilant-log-cyberx.onrender.com/api/prediction/hang",
            { deviceName }
          ),
        ]);

        const freshData = {
          bsod: bsodData?.data?.data,
          app: appData?.data?.data,
          shutdown: shutdownData?.data?.data,
          hang: hangData?.data?.data,
        };

        setBsodEntry(freshData.bsod);
        setAppEntry(freshData.app);
        setUnexpectedEntry(freshData.shutdown);
        setHangEntry(freshData.hang);

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data: freshData,
            timestamp: Date.now(),
          })
        );
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getData();

    const interval = setInterval(() => {
      getData(true);
    }, CACHE_DURATION);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="dashboard-root">
        <Sidebar active="dashboard" />
        <main className="main">
          <Header />
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">Loading system data...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-root">
        <Sidebar active="dashboard" />
        <main className="main">
          <Header />
          <div className="error-container">
            <span className="error-icon">⚠️</span>
            <p className="error-text">Error loading data: {error}</p>
          </div>
        </main>
      </div>
    );
  }

  const predictions = [
    {
      title: "App Crash",
      prediction: appEntry?.prediction || "No Data",
      confidence: appEntry?.confidence,
      isRisk: appEntry?.prediction?.includes("Crash"),
      color: appEntry?.prediction?.includes("Crash") ? "#FF4560" : "#00D4BD",
    },
    {
      title: "BSOD",
      prediction: bsodEntry?.prediction || "No Data",
      confidence: bsodEntry?.confidence,
      isRisk: bsodEntry?.prediction?.includes("BSOD"),
      color: bsodEntry?.prediction?.includes("BSOD") ? "#FF4560" : "#00D4BD",
    },
    {
      title: "Unexpected Shutdown",
      prediction: unexpectedEntry?.prediction || "No Data",
      confidence: unexpectedEntry?.confidence,
      isRisk: unexpectedEntry?.prediction?.includes("Shutdown"),
      color: unexpectedEntry?.prediction?.includes("Shutdown")
        ? "#FF4560"
        : "#00D4BD",
    },
    {
      title: "System Hang",
      prediction: hangEntry?.prediction || "No Data",
      confidence: hangEntry?.confidence,
      isRisk: hangEntry?.prediction?.includes("Hang"),
      color: hangEntry?.prediction?.includes("Hang") ? "#FF4560" : "#00D4BD",
    },
  ];

  const analyses = [
    {
      title: "BSOD Analysis",
      summary: bsodEntry?.analysis?.summary,
      indicators: bsodEntry?.analysis?.indicators || [],
    },
    {
      title: "App Crash Analysis",
      summary: appEntry?.analysis?.summary,
      indicators: appEntry?.analysis?.indicators || [],
    },
    {
      title: "Unexpected Shutdown Analysis",
      summary: unexpectedEntry?.analysis?.summary,
      indicators: unexpectedEntry?.analysis?.indicators || [],
    },
    {
      title: "System Hang Analysis",
      summary: hangEntry?.analysis?.summary,
      indicators: hangEntry?.analysis?.indicators || [],
    },
  ];

  return (
    <div className="dashboard-root">
      <Sidebar active="dashboard" />
      <main className="main">
        <Header />
        <div className="content">
          <StatsGrid predictions={predictions} />
          <ChartsSection predictions={predictions} />
          <AnalysisSection analyses={analyses} />
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

function Header() {
  return (
    <header className="header">
      <div>
        <h1 className="header-title">System Overview</h1>
        <p className="header-subtitle">Real-time prediction analytics</p>
      </div>
      <div className="header-right">
        <div className="status-badge">
          <span className="status-dot"></span>
          Live
        </div>
      </div>
    </header>
  );
}

function StatsGrid({ predictions }) {
  return (
    <div className="stats-grid">
      {predictions.map((pred, idx) => (
        <StatCard key={idx} prediction={pred} />
      ))}
    </div>
  );
}

function StatCard({ prediction }) {
  const getConfidenceValue = () => {
    if (!prediction.confidence) return 0;
    const values = Object.values(prediction.confidence);
    return Math.max(...values.map((v) => parseFloat(v) || 0));
  };

  const confidenceValue = getConfidenceValue();

  return (
    <div
      className="stat-card"
      style={{ borderLeft: `4px solid ${prediction.color}` }}
    >
      <div className="stat-header">
        <span className="stat-type">{prediction.title}</span>
        <span
          className="stat-badge"
          style={{
            background: prediction.isRisk ? "#FFE8EC" : "#E0FFF9",
            color: prediction.color,
          }}
        >
          {prediction.isRisk ? "Risk Detected" : "Nominal"}
        </span>
      </div>
      <div className="stat-prediction">{prediction.prediction}</div>
      <div className="stat-confidence">
        Confidence: {confidenceValue.toFixed(1)}%
      </div>
      <div className="stat-bar">
        <div
          className="stat-bar-fill"
          style={{
            width: `${confidenceValue}%`,
            background: prediction.color,
          }}
        ></div>
      </div>
    </div>
  );
}

function ChartsSection({ predictions }) {
  const riskCount = predictions.filter((p) => p.isRisk).length;
  const safeCount = predictions.length - riskCount;

  const doughnutData = {
    labels: ["Risk Detected", "Nominal"],
    datasets: [
      {
        data: [riskCount, safeCount],
        backgroundColor: ["#FF4560", "#00D4BD"],
        borderWidth: 0,
        cutout: "75%",
      },
    ],
  };

  const barData = {
    labels: predictions.map((p) => p.title),
    datasets: [
      {
        label: "Confidence Level",
        data: predictions.map((p) => {
          if (!p.confidence) return 0;
          const values = Object.values(p.confidence);
          return Math.max(...values.map((v) => parseFloat(v) || 0));
        }),
        backgroundColor: predictions.map((p) =>
          p.isRisk ? "rgba(255, 69, 96, 0.8)" : "rgba(0, 212, 189, 0.8)"
        ),
        borderRadius: 8,
        barThickness: 40,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          padding: 20,
          font: { size: 13, family: "Inter" },
          color: "#64748B",
        },
      },
    },
  };

  const barOptions = {
    ...chartOptions,
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

  return (
    <div className="charts-section">
      <div className="chart-card">
        <h3 className="chart-title">System Risk Overview</h3>
        <div className="chart-container doughnut-chart">
          <Doughnut data={doughnutData} options={chartOptions} />
          <div className="doughnut-center">
            <div className="doughnut-value">{riskCount}</div>
            <div className="doughnut-label">Risks</div>
          </div>
        </div>
      </div>
      <div className="chart-card">
        <h3 className="chart-title">Confidence Levels</h3>
        <div className="chart-container bar-chart">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
}

function AnalysisSection({ analyses }) {
  return (
    <div className="analysis-section">
      <h3 className="section-title">System Analysis</h3>
      <div className="analysis-grid">
        {analyses.map((analysis, idx) => (
          <AnalysisCard key={idx} analysis={analysis} />
        ))}
      </div>
    </div>
  );
}

function AnalysisCard({ analysis }) {
  return (
    <div className="analysis-card">
      <h4 className="analysis-title">{analysis.title}</h4>
      <p className="analysis-summary">
        {analysis.summary || "No analysis available"}
      </p>
      {analysis.indicators && analysis.indicators.length > 0 && (
        <div className="indicators-preview">
          <span className="indicators-count">
            {analysis.indicators.length} indicators found
          </span>
        </div>
      )}
    </div>
  );
}

//below this is final
// src/pages/Dashboard.jsx
// import { useEffect, useState } from "react";
// import MetricCard from "../components/MetricCard";
// import IndicatorsList from "../components/IndicatorsList";
// import "../styles/dashboard.css";
// import axios from "axios";

// export default function Dashboard() {
//   const [bsodEntry, setBsodEntry] = useState(null);
//   const [appEntry, setAppEntry] = useState(null);
//   const [unexpectedEntry, setUnexpectedEntry] = useState(null);
//   const [hangEntry, setHangEntry] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const CACHE_KEY = "vigilant_log_cache";
//     const CACHE_DURATION = 7 * 60 * 1000; // 7 minutes in milliseconds

//     const getData = async (forceRefresh = false) => {
//       try {
//         // Check cache first
//         if (!forceRefresh) {
//           const cachedData = localStorage.getItem(CACHE_KEY);
//           if (cachedData) {
//             const { data, timestamp } = JSON.parse(cachedData);
//             const now = Date.now();

//             // If cache is still valid (less than 7 minutes old)
//             if (now - timestamp < CACHE_DURATION) {
//               setBsodEntry(data.bsod);
//               setAppEntry(data.app);
//               setUnexpectedEntry(data.shutdown);
//               setHangEntry(data.hang);
//               setLoading(false);
//               return;
//             }
//           }
//         }

//         // Fetch fresh data
//         setLoading(true);
//         const deviceName = sessionStorage.getItem("deviceName") || "MAHESH";

//         const [bsodData, appData, shutdownData, hangData] = await Promise.all([
//           axios.post(
//             "https://vigilant-log-cyberx.onrender.com/api/prediction/bsod",
//             { deviceName }
//           ),
//           axios.post(
//             "https://vigilant-log-cyberx.onrender.com/api/prediction/app-crash",
//             { deviceName }
//           ),
//           axios.post(
//             "https://vigilant-log-cyberx.onrender.com/api/prediction/shutdown",
//             { deviceName }
//           ),
//           axios.post(
//             "https://vigilant-log-cyberx.onrender.com/api/prediction/hang",
//             { deviceName }
//           ),
//         ]);

//         const freshData = {
//           bsod: bsodData?.data?.data,
//           app: appData?.data?.data,
//           shutdown: shutdownData?.data?.data,
//           hang: hangData?.data?.data,
//         };

//         // Update state
//         setBsodEntry(freshData.bsod);
//         setAppEntry(freshData.app);
//         setUnexpectedEntry(freshData.shutdown);
//         setHangEntry(freshData.hang);

//         // Cache the data with timestamp
//         localStorage.setItem(
//           CACHE_KEY,
//           JSON.stringify({
//             data: freshData,
//             timestamp: Date.now(),
//           })
//         );
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     getData();

//     // Set up interval to refresh data every 7 minutes
//     const interval = setInterval(() => {
//       getData(true);
//     }, CACHE_DURATION);

//     // Cleanup interval on unmount
//     return () => clearInterval(interval);
//   }, []);

//   if (loading) {
//     return (
//       <div className="dashboard-root">
//         <aside className="sidebar">
//           <div className="sidebar-brand">VigilantLog</div>
//           <nav className="sidebar-nav">
//             <a className="nav-item active" href="/dashboard">
//               Dashboard
//             </a>
//             <a className="nav-item" href="/system-health">
//               System Health
//             </a>
//             <a className="nav-item" href="/analysis">
//               Analysis
//             </a>
//           </nav>
//         </aside>
//         <main className="main">
//           <header className="topbar">
//             <h2>Dashboard</h2>
//             <div className="user">System Prediction Overview</div>
//           </header>
//           <div style={{ padding: "2rem", textAlign: "center" }}>
//             Loading data...
//           </div>
//         </main>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="dashboard-root">
//         <aside className="sidebar">
//           <div className="sidebar-brand">VigilantLog</div>
//           <nav className="sidebar-nav">
//             <a className="nav-item active" href="/dashboard">
//               Dashboard
//             </a>
//             <a className="nav-item" href="/system-health">
//               System Health
//             </a>
//             <a className="nav-item" href="/analysis">
//               Analysis
//             </a>
//           </nav>
//         </aside>
//         <main className="main">
//           <header className="topbar">
//             <h2>Dashboard</h2>
//             <div className="user">System Prediction Overview</div>
//           </header>
//           <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
//             Error loading data: {error}
//           </div>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-root">
//       <aside className="sidebar">
//         <div className="sidebar-brand">VigilantLog</div>
//         <nav className="sidebar-nav">
//           <a className="nav-item active" href="/dashboard">
//             Dashboard
//           </a>
//           <a className="nav-item" href="/system-health">
//             System Health
//           </a>
//           <a className="nav-item" href="/analysis">
//             Analysis
//           </a>
//         </nav>
//       </aside>

//       <main className="main">
//         <header className="topbar">
//           <h2>Dashboard</h2>
//           <div className="user">System Prediction Overview</div>
//         </header>

//         {/* --- PREDICTION CARDS --- */}
//         <section className="results-grid">
//           <MetricCard
//             title="App Crash"
//             main={appEntry?.prediction || "No Data"}
//             sub={
//               appEntry?.confidence
//                 ? `No Crash: ${appEntry.confidence.no_crash}% | App Crash: ${appEntry.confidence.app_crash}%`
//                 : "No confidence data"
//             }
//             color={
//               appEntry?.prediction?.includes("Crash") ? "#ef4444" : "#0ea5a4"
//             }
//             confidences={appEntry?.confidence}
//           />

//           <MetricCard
//             title="BSOD"
//             main={bsodEntry?.prediction || "No Data"}
//             sub={
//               bsodEntry?.confidence
//                 ? `No BSOD: ${bsodEntry.confidence.no_bsod}% | BSOD: ${bsodEntry.confidence.bsod}%`
//                 : "No confidence data"
//             }
//             color={
//               bsodEntry?.prediction?.includes("BSOD") ? "#ef4444" : "#2563eb"
//             }
//             confidences={bsodEntry?.confidence}
//           />

//           <MetricCard
//             title="Unexpected Shutdown"
//             main={unexpectedEntry?.prediction || "No Data"}
//             sub={
//               unexpectedEntry?.confidence
//                 ? `Nominal: ${unexpectedEntry.confidence.nominal_operation}% | Shutdown: ${unexpectedEntry.confidence.unexpected_shutdown}%`
//                 : "No confidence data"
//             }
//             color={
//               unexpectedEntry?.prediction?.includes("Shutdown")
//                 ? "#ef4444"
//                 : "#0ea5a4"
//             }
//             confidences={unexpectedEntry?.confidence}
//           />

//           <MetricCard
//             title="System Hang"
//             main={hangEntry?.prediction || "No Data"}
//             sub={
//               hangEntry?.confidence
//                 ? `Nominal: ${hangEntry.confidence.nominal_operation}% | Hang Risk: ${hangEntry.confidence.system_hang_risk}%`
//                 : "No confidence data"
//             }
//             color={
//               hangEntry?.prediction?.includes("Hang") ? "#ef4444" : "#f59e0b"
//             }
//             confidences={hangEntry?.confidence}
//           />
//         </section>

//         {/* --- ANALYSIS PANELS --- */}
//         <section className="panels">
//           <div className="panel">
//             <h4>BSOD Analysis</h4>
//             <p>{bsodEntry?.analysis?.summary || "No analysis available"}</p>
//             <IndicatorsList
//               indicators={bsodEntry?.analysis?.indicators || []}
//             />
//           </div>

//           <div className="panel">
//             <h4>App Crash Analysis</h4>
//             <p>{appEntry?.analysis?.summary || "No analysis available"}</p>
//             <IndicatorsList indicators={appEntry?.analysis?.indicators || []} />
//           </div>

//           <div className="panel">
//             <h4>Unexpected Shutdown Analysis</h4>
//             <p>
//               {unexpectedEntry?.analysis?.summary || "No analysis available"}
//             </p>
//             <IndicatorsList
//               indicators={unexpectedEntry?.analysis?.indicators || []}
//             />
//           </div>

//           <div className="panel">
//             <h4>System Hang Analysis</h4>
//             <p>{hangEntry?.analysis?.summary || "No analysis available"}</p>
//             <IndicatorsList
//               indicators={hangEntry?.analysis?.indicators || []}
//             />
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }

// above this is final

// // src/pages/Dashboard.jsx
// import React, { useEffect, useState } from "react";
// import MetricCard from "../components/MetricCard";
// import IndicatorsList from "../components/IndicatorsList";
// import "../styles/dashboard.css";
// import axios from "axios";

// export default function Dashboard() {
//   const [bsodEntry, setBsodEntry] = useState(null);
//   const [appEntry, setAppEntry] = useState(null);
//   const [unexpectedEntry, setUnexpectedEntry] = useState(null);
//   const [hangEntry, setHangEntry] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const getData = async () => {
//       try {
//         setLoading(true);
//         const deviceName = sessionStorage.getItem("deviceName") || "MAHESH";

//         const [bsodData, appData, shutdownData, hangData] = await Promise.all([
//           axios.post(
//             "https://vigilant-log-cyberx.onrender.com/api/prediction/bsod",
//             { deviceName }
//           ),
//           axios.post(
//             "https://vigilant-log-cyberx.onrender.com/api/prediction/app-crash",
//             { deviceName }
//           ),
//           axios.post(
//             "https://vigilant-log-cyberx.onrender.com/api/prediction/shutdown",
//             { deviceName }
//           ),
//           axios.post(
//             "https://vigilant-log-cyberx.onrender.com/api/prediction/hang",
//             { deviceName }
//           ),
//         ]);

//         setBsodEntry(bsodData?.data?.data);
//         setAppEntry(appData?.data?.data);
//         setUnexpectedEntry(shutdownData?.data?.data);
//         setHangEntry(hangData?.data?.data);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     getData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="dashboard-root">
//         <aside className="sidebar">
//           <div className="sidebar-brand">VigilantLog</div>
//           <nav className="sidebar-nav">
//             <a className="nav-item active" href="/dashboard">
//               Dashboard
//             </a>
//             <a className="nav-item" href="/system-health">
//               System Health
//             </a>
//             <a className="nav-item" href="/analysis">
//               Analysis
//             </a>
//           </nav>
//         </aside>
//         <main className="main">
//           <header className="topbar">
//             <h2>Dashboard</h2>
//             <div className="user">System Prediction Overview</div>
//           </header>
//           <div style={{ padding: "2rem", textAlign: "center" }}>
//             Loading data...
//           </div>
//         </main>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="dashboard-root">
//         <aside className="sidebar">
//           <div className="sidebar-brand">VigilantLog</div>
//           <nav className="sidebar-nav">
//             <a className="nav-item active" href="/dashboard">
//               Dashboard
//             </a>
//             <a className="nav-item" href="/system-health">
//               System Health
//             </a>
//             <a className="nav-item" href="/analysis">
//               Analysis
//             </a>
//           </nav>
//         </aside>
//         <main className="main">
//           <header className="topbar">
//             <h2>Dashboard</h2>
//             <div className="user">System Prediction Overview</div>
//           </header>
//           <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
//             Error loading data: {error}
//           </div>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-root">
//       <aside className="sidebar">
//         <div className="sidebar-brand">VigilantLog</div>
//         <nav className="sidebar-nav">
//           <a className="nav-item active" href="/dashboard">
//             Dashboard
//           </a>
//           <a className="nav-item" href="/system-health">
//             System Health
//           </a>
//           <a className="nav-item" href="/analysis">
//             Analysis
//           </a>
//         </nav>
//       </aside>

//       <main className="main">
//         <header className="topbar">
//           <h2>Dashboard</h2>
//           <div className="user">System Prediction Overview</div>
//         </header>

//         {/* --- PREDICTION CARDS --- */}
//         <section className="results-grid">
//           <MetricCard
//             title="App Crash"
//             main={appEntry?.prediction || "No Data"}
//             sub={
//               appEntry?.confidence
//                 ? `No Crash: ${appEntry.confidence.no_crash}% | App Crash: ${appEntry.confidence.app_crash}%`
//                 : "No confidence data"
//             }
//             color={
//               appEntry?.prediction?.includes("Crash") ? "#ef4444" : "#0ea5a4"
//             }
//             confidences={appEntry?.confidence}
//           />

//           <MetricCard
//             title="BSOD"
//             main={bsodEntry?.prediction || "No Data"}
//             sub={
//               bsodEntry?.confidence
//                 ? `No BSOD: ${bsodEntry.confidence.no_bsod}% | BSOD: ${bsodEntry.confidence.bsod}%`
//                 : "No confidence data"
//             }
//             color={
//               bsodEntry?.prediction?.includes("BSOD") ? "#ef4444" : "#2563eb"
//             }
//             confidences={bsodEntry?.confidence}
//           />

//           <MetricCard
//             title="Unexpected Shutdown"
//             main={unexpectedEntry?.prediction || "No Data"}
//             sub={
//               unexpectedEntry?.confidence
//                 ? `Nominal: ${unexpectedEntry.confidence.nominal_operation}% | Shutdown: ${unexpectedEntry.confidence.unexpected_shutdown}%`
//                 : "No confidence data"
//             }
//             color={
//               unexpectedEntry?.prediction?.includes("Shutdown")
//                 ? "#ef4444"
//                 : "#0ea5a4"
//             }
//             confidences={unexpectedEntry?.confidence}
//           />

//           <MetricCard
//             title="System Hang"
//             main={hangEntry?.prediction || "No Data"}
//             sub={
//               hangEntry?.confidence
//                 ? `Nominal: ${hangEntry.confidence.nominal_operation}% | Hang Risk: ${hangEntry.confidence.system_hang_risk}%`
//                 : "No confidence data"
//             }
//             color={
//               hangEntry?.prediction?.includes("Hang") ? "#ef4444" : "#f59e0b"
//             }
//             confidences={hangEntry?.confidence}
//           />
//         </section>

//         {/* --- ANALYSIS PANELS --- */}
//         <section className="panels">
//           <div className="panel">
//             <h4>BSOD Analysis</h4>
//             <p>{bsodEntry?.analysis?.summary || "No analysis available"}</p>
//             <IndicatorsList
//               indicators={bsodEntry?.analysis?.indicators || []}
//             />
//           </div>

//           <div className="panel">
//             <h4>App Crash Analysis</h4>
//             <p>{appEntry?.analysis?.summary || "No analysis available"}</p>
//             <IndicatorsList indicators={appEntry?.analysis?.indicators || []} />
//           </div>

//           <div className="panel">
//             <h4>Unexpected Shutdown Analysis</h4>
//             <p>
//               {unexpectedEntry?.analysis?.summary || "No analysis available"}
//             </p>
//             <IndicatorsList
//               indicators={unexpectedEntry?.analysis?.indicators || []}
//             />
//           </div>

//           <div className="panel">
//             <h4>System Hang Analysis</h4>
//             <p>{hangEntry?.analysis?.summary || "No analysis available"}</p>
//             <IndicatorsList
//               indicators={hangEntry?.analysis?.indicators || []}
//             />
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }

// // // src/pages/Dashboard.jsx
// // import React, { useEffect } from "react";
// // import MetricCard from "../components/MetricCard";
// // import IndicatorsList from "../components/IndicatorsList";
// // import "../styles/dashboard.css";
// // import axios from "axios";

// // // Import local JSON result files
// // // import appCrashData from "../results/app_crash_result.json";
// // // import bsodData from "../results/bsod_result.json";
// // // import unexpectedData from "../results/unexpected_result.json";
// // // import hangData from "../results/hang_result.json";

// // export default function Dashboard() {
// //   // const appEntry = Array.isArray(appCrashData) ? appCrashData[0] : appCrashData;
// //   // const bsodEntry = bsodData;
// //   let bsodEntry;
// //   let appEntry;
// //   let unexpectedEntry;
// //   let hangEntry;
// //   // const unexpectedEntry = unexpectedData;
// //   // const hangEntry = Array.isArray(hangData) ? hangData[0] : hangData;

// //   useEffect(() => {
// //     const getData = async () => {
// //       try {
// //         // const deviceName = sessionStorage.getItem("deviceName");
// //         const deviceName = "MAHESH";
// //         const bsodData = await axios.post(
// //           "https://vigilant-log-cyberx.onrender.com/api/prediction/bsod",
// //           { deviceName: deviceName }
// //         );
// //         const appData = await axios.post(
// //           "https://vigilant-log-cyberx.onrender.com/api/prediction/app",
// //           { deviceName: deviceName }
// //         );
// //         const shutdownData = await axios.post(
// //           "https://vigilant-log-cyberx.onrender.com/api/prediction/shutdown",
// //           { deviceName: deviceName }
// //         );
// //         const hangData = await axios.post(
// //           "https://vigilant-log-cyberx.onrender.com/api/prediction/hang",
// //           { deviceName: deviceName }
// //         );

// //         bsodEntry = bsodData?.data?.data;
// //         appEntry = appData?.data?.data;
// //         unexpectedEntry = shutdownData?.data?.data;
// //         hangEntry = hangData?.data?.data;
// //       } catch (err) {
// //         console.log(err);
// //       }
// //     };

// //     getData();
// //   }, []);

// //   return (
// //     <div className="dashboard-root">
// //       <aside className="sidebar">
// //         <div className="sidebar-brand">VigilantLog</div>
// //         <nav className="sidebar-nav">
// //           <a className="nav-item active" href="/dashboard">
// //             Dashboard
// //           </a>
// //           <a className="nav-item" href="/system-health">
// //             System Health
// //           </a>
// //           <a className="nav-item" href="/analysis">
// //             Analysis
// //           </a>
// //         </nav>
// //       </aside>

// //       <main className="main">
// //         <header className="topbar">
// //           <h2>Dashboard</h2>
// //           <div className="user">System Prediction Overview</div>
// //         </header>

// //         {/* --- PREDICTION CARDS --- */}
// //         <section className="results-grid">
// //           <MetricCard
// //             title="App Crash"
// //             main={appEntry?.prediction}
// //             sub={`No Crash: ${appEntry?.confidence?.no_crash} | App Crash: ${appEntry?.confidence?.app_crash}`}
// //             color={
// //               appEntry?.prediction?.includes("Crash") ? "#ef4444" : "#0ea5a4"
// //             }
// //             confidences={appEntry?.confidence}
// //           />

// //           <MetricCard
// //             title="BSOD"
// //             main={bsodEntry?.prediction}
// //             sub={`No BSOD: ${bsodEntry?.confidence?.no_bsod} | BSOD: ${bsodEntry?.confidence?.bsod}`}
// //             color={
// //               bsodEntry?.prediction?.includes("BSOD") ? "#ef4444" : "#2563eb"
// //             }
// //             confidences={bsodEntry?.confidence}
// //           />

// //           <MetricCard
// //             title="Unexpected Shutdown"
// //             main={unexpectedEntry?.prediction}
// //             sub={`Nominal: ${unexpectedEntry?.confidence?.nominal_operation} | Shutdown: ${unexpectedEntry?.confidence?.unexpected_shutdown}`}
// //             color={
// //               unexpectedEntry?.prediction?.includes("Shutdown")
// //                 ? "#ef4444"
// //                 : "#0ea5a4"
// //             }
// //             confidences={unexpectedEntry?.confidence}
// //           />

// //           <MetricCard
// //             title="System Hang"
// //             main={hangEntry?.prediction}
// //             sub={`Nominal: ${hangEntry?.confidence?.nominal_operation} | Hang Risk: ${hangEntry?.confidence?.system_hang_risk}`}
// //             color={
// //               hangEntry?.prediction?.includes("Hang") ? "#ef4444" : "#f59e0b"
// //             }
// //             confidences={hangEntry?.confidence}
// //           />
// //         </section>

// //         {/* --- ANALYSIS PANELS --- */}
// //         <section className="panels">
// //           <div className="panel">
// //             <h4>BSOD Analysis</h4>
// //             <p>{bsodEntry?.analysis?.summary}</p>
// //             <IndicatorsList indicators={bsodEntry?.analysis?.indicators} />
// //           </div>

// //           <div className="panel">
// //             <h4>App Crash Analysis</h4>
// //             <p>{appEntry?.analysis?.summary}</p>
// //             <IndicatorsList indicators={appEntry?.analysis?.indicators} />
// //           </div>

// //           <div className="panel">
// //             <h4>Unexpected Shutdown Analysis</h4>
// //             <p>{unexpectedEntry?.analysis?.summary}</p>
// //             <IndicatorsList
// //               indicators={unexpectedEntry?.analysis?.indicators}
// //             />
// //           </div>

// //           <div className="panel">
// //             <h4>System Hang Analysis</h4>
// //             <p>{hangEntry?.analysis?.summary}</p>
// //             <IndicatorsList indicators={hangEntry?.analysis?.indicators} />
// //           </div>
// //         </section>
// //       </main>
// //     </div>
// //   );
// // }
