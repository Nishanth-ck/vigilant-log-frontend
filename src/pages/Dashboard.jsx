import { useEffect, useState } from "react";
import axios from "axios";
import MetricCard from "../components/MetricCard";
import IndicatorsList from "../components/IndicatorsList";
import "../styles/IndicatorList.css";
import "../styles/dashboard.css";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [bsod, setBsod] = useState(null);
  const [app, setApp] = useState(null);
  const [shutdown, setShutdown] = useState(null);
  const [hang, setHang] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const deviceName = sessionStorage.getItem("deviceName") || "MAHESH";

        const [b, a, s, h] = await Promise.all([
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

        // console.log(b, a, s, h);

        setBsod(b.data.data);
        setApp(a.data.data);
        setShutdown(s.data.data);
        setHang(h.data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading)
    return (
      <div className="dashboard-root">
        <Sidebar active="dashboard" />
        <main className="main">
          <Header />
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">Loading dashboard data...</p>
          </div>
        </main>
      </div>
    );

  return (
    <div className="dashboard-root">
      <Sidebar active="dashboard" />
      <main className="main">
        <Header />
        <div className="content">
          {/* Metric Cards */}
          {/* <section className="metric-cards-grid">
            <MetricCard title="App Crash" entry={app} />
            <MetricCard title="BSOD" entry={bsod} />
            <MetricCard title="Unexpected Shutdown" entry={shutdown} />
            <MetricCard title="System Hang" entry={hang} />
          </section> */}

          <section className="metric-cards-grid">
            <Link to="/analysis/app-crash">
              <MetricCard title="App Crash" entry={app} />
            </Link>
            <Link to="/analysis/bsod">
              <MetricCard title="BSOD" entry={bsod} />
            </Link>
            <Link to="/analysis/shutdown">
              <MetricCard title="Unexpected Shutdown" entry={shutdown} />
            </Link>
            <Link to="/analysis/hang">
              <MetricCard title="System Hang" entry={hang} />
            </Link>
          </section>

          {/* Analysis Panels */}
          <section className="analysis-panels">
            <div className="analysis-panel">
              <h4 className="analysis-panel-title">BSOD Analysis</h4>
              <p className="analysis-panel-summary">
                {bsod?.analysis?.summary || "No analysis available"}
              </p>
              <IndicatorsList indicators={bsod?.analysis?.indicators || []} />
            </div>

            <div className="analysis-panel">
              <h4 className="analysis-panel-title">App Crash Analysis</h4>
              <p className="analysis-panel-summary">
                {app?.analysis?.summary || "No analysis available"}
              </p>
              <IndicatorsList indicators={app?.analysis?.indicators || []} />
            </div>

            <div className="analysis-panel">
              <h4 className="analysis-panel-title">
                Unexpected Shutdown Analysis
              </h4>
              <p className="analysis-panel-summary">
                {shutdown?.analysis?.summary || "No analysis available"}
              </p>
              <IndicatorsList
                indicators={shutdown?.analysis?.indicators || []}
              />
            </div>

            <div className="analysis-panel">
              <h4 className="analysis-panel-title">System Hang Analysis</h4>
              <p className="analysis-panel-summary">
                {hang?.analysis?.summary || "No analysis available"}
              </p>
              <IndicatorsList indicators={hang?.analysis?.indicators || []} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function Sidebar({ active }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "", href: "/dashboard" },
    // {
    //   id: "health",
    //   label: "System Health",
    //   icon: "💚",
    //   href: "/system-health",
    // },
    { id: "analysis", label: "Analysis", icon: "", href: "/analysis" },
    {
      id: "file-backups",
      label: "File Backups",
      icon: "",
      href: "/file-backups",
    },
    {
      id: "file-settings",
      label: "File Settings",
      icon: "",
      href: "/file-settings",
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        {/* <span className="brand-icon">⚡</span> */}
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
        <h1 className="header-title">Dashboard</h1>
        <p className="header-subtitle">System Prediction Overview</p>
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
