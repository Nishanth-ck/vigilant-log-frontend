import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Auth from "./pages/Auth";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import SystemHealth from "./pages/SystemHealth";
import Analysis from "./pages/Analysis";
import InstallerGuide from "./pages/InstallerGuide";
import FileBackups from "./pages/FileBackups";
import AppCrashPage from "./pages/AppCrashPage.jsx";
import FileSettings from "./pages/FileSettings";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/system-health" element={<SystemHealth />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/file-backups" element={<FileBackups />} />
        <Route path="/file-settings" element={<FileSettings />} />
        <Route path="/analysis/app-crash" element={<AppCrashPage />} />
        <Route path="/analysis/bsod" element={<AppCrashPage />} />
        <Route path="/analysis/shutdown" element={<AppCrashPage />} />
        <Route path="/analysis/hang" element={<AppCrashPage />} />  
        <Route path="/installer" element={<InstallerGuide />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
