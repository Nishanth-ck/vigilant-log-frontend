import "../styles/dashboard.css";

export default function ProgressBar({ label, value, color }) {
  // Parse percentage value (e.g., "97.39%" → 97.39)
  const percent =
    typeof value === "string"
      ? parseFloat(value.replace("%", "")) || 0
      : value || 0;

  return (
    <div className="progress-item">
      <div className="progress-label">
        {label} — {percent.toFixed(2)}%
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${percent}%`,
            background: color || "#0ea5a4",
          }}
        />
      </div>
    </div>
  );
}
