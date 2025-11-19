import PieMetricChart from "./PieMetricChart";
import "../styles/dashboard.css";

export default function MetricCard({ title, entry }) {
  if (!entry) return null;

  const labels = Object.keys(entry.confidence);
  const values = Object.values(entry.confidence);

  const colors = [
    "rgba(59, 130, 246, 0.4)", // blue
    "rgba(16, 185, 129, 0.4)", // green
    "rgba(234, 179, 8, 0.4)", // yellow (only used if 3rd value exists)
    "rgba(239, 68, 68, 0.4)", // red (4th value)
  ].slice(0, values.length);

  return (
    <div className="metric-card-enhanced">
      <h3 className="metric-card-title">{title}</h3>

      <div className="metric-card-content">
        {/* Left: Prediction + summary + legend */}
        <div className="metric-card-left">
          {/* Prediction */}
          <div className="metric-prediction-section">
            <p className="metric-label">Prediction:</p>
            <p className="metric-prediction">{entry.prediction}</p>
          </div>

          {/* Summary */}
          <p className="metric-summary">{entry.analysis?.summary}</p>

          {/* Legend */}
          <div className="metric-legend">
            {labels.map((label, index) => (
              <div key={index} className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: colors[index] }}
                ></div>
                <span className="legend-label">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Chart */}
        <div className="metric-card-right">
          <PieMetricChart labels={labels} values={values} colors={colors} />
        </div>
      </div>
    </div>
  );
}
