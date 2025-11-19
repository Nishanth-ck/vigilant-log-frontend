import { useEffect, useState } from "react";
import axios from "axios";
import MetricCard from "../components/MetricCard";
import IndicatorsList from "../components/IndicatorsList";

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
      <div className="w-full h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white shadow-sm border-r border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-10 tracking-tight">
          VigilantLog
        </h1>

        <nav className="space-y-6 text-lg">
          <a href="/dashboard" className="text-blue-600 font-semibold block">
            Dashboard
          </a>
          <a
            href="/system-health"
            className="hover:text-blue-500 text-gray-700 block"
          >
            System Health
          </a>
          <a href="/analysis" className="hover:text-blue-500 text-gray-700 block">
            Analysis
          </a>
          <a href="/file-backups" className="hover:text-blue-500 text-gray-700 block">
            File Backups
          </a>
          <a href="/file-settings" className="hover:text-blue-500 text-gray-700 block">
            File Settings
          </a>
        </nav>
      </aside>

      <main className="flex-1 p-10 bg-gray-50">
        {/* Header */}
        <header className="mb-10">
          <h2 className="text-4xl font-bold text-gray-800 tracking-tight">
            Dashboard
          </h2>
          <p className="text-gray-500 mt-1 text-lg">
            System Prediction Overview
          </p>
        </header>

        {/* Metric Cards — cleaner spacing */}
        <section className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-2 gap-12">
          <MetricCard title="App Crash" entry={app} />
          <MetricCard title="BSOD" entry={bsod} />
          <MetricCard title="Unexpected Shutdown" entry={shutdown} />
          <MetricCard title="System Hang" entry={hang} />
        </section>

        {/* Divider */}
        <div className="my-12 border-t border-gray-200"></div>

        {/* Analysis Panels — full width + better spacing */}
        <section className="space-y-10">
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
            <h4 className="text-2xl font-semibold mb-4">BSOD Analysis</h4>
            <p className="text-gray-700 mb-6 leading-relaxed">
              {bsod?.analysis?.summary}
            </p>
            <IndicatorsList indicators={bsod?.analysis?.indicators} />
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
            <h4 className="text-2xl font-semibold mb-4">App Crash Analysis</h4>
            <p className="text-gray-700 mb-6 leading-relaxed">
              {app?.analysis?.summary}
            </p>
            <IndicatorsList indicators={app?.analysis?.indicators} />
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
            <h4 className="text-2xl font-semibold mb-4">
              Unexpected Shutdown Analysis
            </h4>
            <p className="text-gray-700 mb-6 leading-relaxed">
              {shutdown?.analysis?.summary}
            </p>
            <IndicatorsList indicators={shutdown?.analysis?.indicators} />
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
            <h4 className="text-2xl font-semibold mb-4">
              System Hang Analysis
            </h4>
            <p className="text-gray-700 mb-6 leading-relaxed">
              {hang?.analysis?.summary}
            </p>
            <IndicatorsList indicators={hang?.analysis?.indicators} />
          </div>
        </section>
      </main>
    </div>
  );
}
