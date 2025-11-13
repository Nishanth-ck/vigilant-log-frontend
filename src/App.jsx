import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Auth from "./pages/Auth";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import SystemHealth from "./pages/SystemHealth";
import Analysis from "./pages/Analysis";
import InstallerGuide from "./pages/InstallerGuide";
import FileBackups from "./pages/FileBackups";
import FileSettings from "./pages/FileSettings";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/system-health" element={<SystemHealth />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/file-backups" element={<FileBackups />} />
        <Route path="/file-settings" element={<FileSettings />} />
        <Route path="/installer" element={<InstallerGuide />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
}
