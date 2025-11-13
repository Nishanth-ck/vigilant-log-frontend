function parseDate(dateString) {
  if (!dateString || dateString === "N/A") return "N/A";

  // Handle /Date(1755580635000)/ format
  if (dateString.startsWith("/Date(")) {
    const timestamp = parseInt(dateString.replace(/[^0-9]/g, ""), 10);
    return new Date(timestamp).toLocaleString();
  }

  // Try ISO date
  const d = new Date(dateString);
  return isNaN(d.getTime()) ? dateString : d.toLocaleString();
}

export default function IndicatorsList({ indicators = [] }) {
  if (!indicators || indicators.length === 0) {
    return <p className="muted">No indicators found.</p>;
  }

  return (
    <ul className="indicators-list">
      {indicators.map((item, index) => (
        <li
          key={index}
          className={`indicator ${
            item.type?.toLowerCase().includes("critical") ? "critical" : ""
          }`}
        >
          <div className="ind-left">
            <div className="ind-type">{item.type}</div>
            <div className="ind-title">{item.title}</div>
            <div className="ind-desc">{item.description}</div>
          </div>
          <div className="ind-right">
            <div className="ind-date">{parseDate(item.date)}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
