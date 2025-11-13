import ProgressBar from "./ProgressBar";
import "../styles/dashboard.css";

export default function MetricCard({ title, main, sub, color, confidences }) {
  return (
    <div className="metric-card">
      <div className="metric-top">
        <div className="metric-title">{title}</div>
        <div className="metric-main" style={{ color: color ?? "#0ea5a4" }}>
          {main}
        </div>
      </div>

      {sub && <div className="metric-sub muted">{sub}</div>}

      {/* Render confidence progress bars */}
      {confidences && (
        <div className="progress-group">
          {Object.entries(confidences).map(([key, val]) => (
            <ProgressBar
              key={key}
              label={key.replaceAll("_", " ")}
              value={val}
              color={color}
            />
          ))}
        </div>
      )}
    </div>
  );
}
