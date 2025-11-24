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

export default function IndicatorsList({
  indicators = [],
  title = "Analysis",
}) {
  if (!indicators || indicators.length === 0) {
    return (
      <div className="indicators-empty">
        <svg
          className="indicators-empty-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <p className="indicators-empty-text">No indicators found.</p>
      </div>
    );
  }

  const getSeverityInfo = (type) => {
    const typeStr = type?.toLowerCase() || "";
    if (typeStr.includes("critical") || typeStr.includes("error")) {
      return { class: "critical", label: "Critical", icon: "⚠" };
    } else if (typeStr.includes("warning")) {
      return { class: "warning", label: "Warning", icon: "⚡" };
    } else if (typeStr.includes("hardware")) {
      return { class: "hardware", label: "Hardware", icon: "⚙" };
    }
    return { class: "info", label: "Info", icon: "ℹ" };
  };

  return (
    <div className="indicators-container">
      <div className="indicators-header">
        <h2 className="indicators-title">{title}</h2>
        <span className="indicators-count">
          {indicators.length} {indicators.length === 1 ? "Event" : "Events"}
        </span>
      </div>

      <div className="indicators-list">
        {indicators.map((item, index) => {
          const severity = getSeverityInfo(item.type);
          return (
            <div key={index} className={`indicator-card ${severity.class}`}>
              <div className="indicator-main">
                <div className="indicator-header-row">
                  <span className={`indicator-badge ${severity.class}`}>
                    {severity.label}
                  </span>
                  <span className="indicator-date">{parseDate(item.date)}</span>
                </div>

                <h3 className="indicator-type">{item.type}</h3>

                {item.title && item.title !== "N/A" && (
                  <div className="indicator-title">{item.title}</div>
                )}

                {item.description && item.description !== "N/A" && (
                  <div className="indicator-description">
                    {item.description}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// function parseDate(dateString) {
//   if (!dateString || dateString === "N/A") return "N/A";

//   // Handle /Date(1755580635000)/ format
//   if (dateString.startsWith("/Date(")) {
//     const timestamp = parseInt(dateString.replace(/[^0-9]/g, ""), 10);
//     return new Date(timestamp).toLocaleString();
//   }

//   // Try ISO date
//   const d = new Date(dateString);
//   return isNaN(d.getTime()) ? dateString : d.toLocaleString();
// }

// export default function IndicatorsList({ indicators = [] }) {
//   if (!indicators || indicators.length === 0) {
//     return <p className="muted">No indicators found.</p>;
//   }

//   return (
//     <ul className="indicators-list">
//       {indicators.map((item, index) => (
//         <li
//           key={index}
//           className={`indicator ${
//             item.type?.toLowerCase().includes("critical") ? "critical" : ""
//           }`}
//         >
//           <div className="ind-left">
//             <div className="ind-type">{item.type}</div>
//             <div className="ind-title">{item.title}</div>
//             <div className="ind-desc">{item.description}</div>
//           </div>
//           <div className="ind-right">
//             <div className="ind-date">{parseDate(item.date)}</div>
//           </div>
//         </li>
//       ))}
//     </ul>
//   );
// }
