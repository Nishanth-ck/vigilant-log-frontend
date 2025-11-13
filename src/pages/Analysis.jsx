// src/pages/Analysis.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/dashboard.css";

function parseDate(dateString) {
  if (!dateString || dateString === "N/A") return "N/A";
  if (dateString.startsWith("/Date(")) {
    const timestamp = parseInt(dateString.replace(/[^0-9]/g, ""), 10);
    return new Date(timestamp).toLocaleString();
  }
  const d = new Date(dateString);
  return isNaN(d.getTime()) ? dateString : d.toLocaleString();
}

export default function Analysis() {
  const [bsodEntry, setBsodEntry] = useState(null);
  const [appEntry, setAppEntry] = useState(null);
  const [unexpectedEntry, setUnexpectedEntry] = useState(null);
  const [hangEntry, setHangEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const CACHE_KEY = "vigilant_log_cache";
    const CACHE_DURATION = 7 * 60 * 1000;

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
        const deviceName = sessionStorage.getItem("deviceName") || "MAHESH";

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
        <Sidebar active="analysis" />
        <main className="main">
          <AnalysisHeader />
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">Loading analysis data...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-root">
        <Sidebar active="analysis" />
        <main className="main">
          <AnalysisHeader />
          <div className="error-container">
            <span className="error-icon">⚠️</span>
            <p className="error-text">Error loading data: {error}</p>
          </div>
        </main>
      </div>
    );
  }

  const analyses = [
    {
      title: "BSOD Analysis",
      summary: bsodEntry?.analysis?.summary,
      indicators: bsodEntry?.analysis?.indicators || [],
      color: "#FF4560",
    },
    {
      title: "App Crash Analysis",
      summary: appEntry?.analysis?.summary,
      indicators: appEntry?.analysis?.indicators || [],
      color: "#00D4BD",
    },
    {
      title: "Unexpected Shutdown Analysis",
      summary: unexpectedEntry?.analysis?.summary,
      indicators: unexpectedEntry?.analysis?.indicators || [],
      color: "#FFA500",
    },
    {
      title: "System Hang Analysis",
      summary: hangEntry?.analysis?.summary,
      indicators: hangEntry?.analysis?.indicators || [],
      color: "#764BA2",
    },
  ];

  return (
    <div className="dashboard-root">
      <Sidebar active="analysis" />
      <main className="main">
        <AnalysisHeader />
        <div className="content">
          {analyses.map((analysis, idx) => (
            <DetailedAnalysisSection key={idx} analysis={analysis} />
          ))}
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

function AnalysisHeader() {
  return (
    <header className="header">
      <div>
        <h1 className="header-title">Detailed Analysis</h1>
        <p className="header-subtitle">Event logs and system indicators</p>
      </div>
    </header>
  );
}

function DetailedAnalysisSection({ analysis }) {
  return (
    <div className="detailed-analysis-section">
      <div
        className="analysis-header"
        style={{ borderLeft: `4px solid ${analysis.color}` }}
      >
        <h3 className="analysis-header-title">{analysis.title}</h3>
        <span className="analysis-indicator-count">
          {analysis.indicators.length} events
        </span>
      </div>
      <div className="analysis-summary-box">
        <p className="analysis-summary-text">
          {analysis.summary || "No analysis available"}
        </p>
      </div>
      {analysis.indicators && analysis.indicators.length > 0 ? (
        <div className="indicators-timeline">
          {analysis.indicators.map((indicator, idx) => (
            <IndicatorCard
              key={idx}
              indicator={indicator}
              color={analysis.color}
            />
          ))}
        </div>
      ) : (
        <div className="no-indicators">
          <span className="no-indicators-icon">✓</span>
          <p className="no-indicators-text">
            No indicators found - System is stable
          </p>
        </div>
      )}
    </div>
  );
}

function IndicatorCard({ indicator, color }) {
  const isCritical = indicator.type?.toLowerCase().includes("critical");
  const isWarning = indicator.type?.toLowerCase().includes("warning");

  const getIcon = () => {
    if (isCritical) return "⚠️";
    if (isWarning) return "⚡";
    return "🔧";
  };

  const getIconBg = () => {
    if (isCritical) return "#FFE8EC";
    if (isWarning) return "#FFF4E6";
    return "#F0F0F0";
  };

  return (
    <div className="indicator-card">
      <div className="indicator-icon-box" style={{ background: getIconBg() }}>
        <span className="indicator-icon">{getIcon()}</span>
      </div>
      <div className="indicator-content">
        <div className="indicator-header">
          <span className="indicator-type">
            {indicator.type || "System Event"}
          </span>
          <span className="indicator-date">{parseDate(indicator.date)}</span>
        </div>
        <div className="indicator-title">{indicator.title || "No title"}</div>
        <div className="indicator-description">
          {indicator.description || "No description available"}
        </div>
      </div>
    </div>
  );
}

//below this is final
// src/pages/Analysis.jsx
// import React, { useEffect, useState } from "react";
// import IndicatorsList from "../components/IndicatorsList";
// import "../styles/dashboard.css";
// import axios from "axios";

// export default function Analysis() {
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
//             <a className="nav-item" href="/dashboard">
//               Dashboard
//             </a>
//             <a className="nav-item" href="/system-health">
//               System Health
//             </a>
//             <a className="nav-item active" href="/analysis">
//               Analysis
//             </a>
//           </nav>
//         </aside>
//         <main className="main">
//           <header className="topbar">
//             <h2>Analysis</h2>
//             <div className="user">Detailed event and log-based insights</div>
//           </header>
//           <div style={{ padding: "2rem", textAlign: "center" }}>
//             Loading analysis data...
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
//             <a className="nav-item" href="/dashboard">
//               Dashboard
//             </a>
//             <a className="nav-item" href="/system-health">
//               System Health
//             </a>
//             <a className="nav-item active" href="/analysis">
//               Analysis
//             </a>
//           </nav>
//         </aside>
//         <main className="main">
//           <header className="topbar">
//             <h2>Analysis</h2>
//             <div className="user">Detailed event and log-based insights</div>
//           </header>
//           <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
//             Error loading analysis data: {error}
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
//           <a className="nav-item" href="/dashboard">
//             Dashboard
//           </a>
//           <a className="nav-item" href="/system-health">
//             System Health
//           </a>
//           <a className="nav-item active" href="/analysis">
//             Analysis
//           </a>
//         </nav>
//       </aside>

//       <main className="main">
//         <header className="topbar">
//           <h2>Analysis</h2>
//           <div className="user">Detailed event and log-based insights</div>
//         </header>

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

//above is final

// // src/pages/Analysis.jsx
// import React, { useEffect, useState } from "react";
// import IndicatorsList from "../components/IndicatorsList";
// import "../styles/dashboard.css";
// import axios from "axios";

// export default function Analysis() {
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
//             <a className="nav-item" href="/dashboard">
//               Dashboard
//             </a>
//             <a className="nav-item" href="/system-health">
//               System Health
//             </a>
//             <a className="nav-item active" href="/analysis">
//               Analysis
//             </a>
//           </nav>
//         </aside>
//         <main className="main">
//           <header className="topbar">
//             <h2>Analysis</h2>
//             <div className="user">Detailed event and log-based insights</div>
//           </header>
//           <div style={{ padding: "2rem", textAlign: "center" }}>
//             Loading analysis data...
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
//             <a className="nav-item" href="/dashboard">
//               Dashboard
//             </a>
//             <a className="nav-item" href="/system-health">
//               System Health
//             </a>
//             <a className="nav-item active" href="/analysis">
//               Analysis
//             </a>
//           </nav>
//         </aside>
//         <main className="main">
//           <header className="topbar">
//             <h2>Analysis</h2>
//             <div className="user">Detailed event and log-based insights</div>
//           </header>
//           <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
//             Error loading analysis data: {error}
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
//           <a className="nav-item" href="/dashboard">
//             Dashboard
//           </a>
//           <a className="nav-item" href="/system-health">
//             System Health
//           </a>
//           <a className="nav-item active" href="/analysis">
//             Analysis
//           </a>
//         </nav>
//       </aside>

//       <main className="main">
//         <header className="topbar">
//           <h2>Analysis</h2>
//           <div className="user">Detailed event and log-based insights</div>
//         </header>

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

// // // src/pages/Analysis.jsx
// // import IndicatorsList from "../components/IndicatorsList";
// // import "../styles/dashboard.css";

// // // Import result data
// // import appCrashData from "../results/app_crash_result.json";
// // import bsodData from "../results/bsod_result.json";
// // import unexpectedData from "../results/unexpected_result.json";
// // import hangData from "../results/hang_result.json";

// // export default function Analysis() {
// //   const appEntry = Array.isArray(appCrashData) ? appCrashData[0] : appCrashData;
// //   const bsodEntry = bsodData;
// //   const unexpectedEntry = unexpectedData;
// //   const hangEntry = Array.isArray(hangData) ? hangData[0] : hangData;

// //   return (
// //     <div className="dashboard-root">
// //       <aside className="sidebar">
// //         <div className="sidebar-brand">VigilantLog</div>
// //         <nav className="sidebar-nav">
// //           <a className="nav-item" href="/dashboard">
// //             Dashboard
// //           </a>
// //           <a className="nav-item" href="/system-health">
// //             System Health
// //           </a>
// //           <a className="nav-item active" href="/analysis">
// //             Analysis
// //           </a>
// //         </nav>
// //       </aside>

// //       <main className="main">
// //         <header className="topbar">
// //           <h2>Analysis</h2>
// //           <div className="user">Detailed event and log-based insights</div>
// //         </header>

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
