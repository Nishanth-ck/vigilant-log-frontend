import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/appCrash.css";

function AppCrashPage() {
  const location = useLocation();
  const [recovery, setRecovery] = useState("");
  const [loading, setLoading] = useState(true);
  const pathParts = location.pathname.split("/");
  const metric = pathParts[pathParts.length - 1];

  console.log(metric);

  useEffect(() => {
    const getRecovery = async () => {
      const typeMap = {
        "app-crash": "APP",
        bsod: "BSOD",
        hang: "HANG",
        shutdown: "SHUT",
      };
      const type = typeMap[metric] || "SHUT";

      try {
        const deviceName =
          sessionStorage.getItem("deviceName") || "NISHANTH_CK";
        const res = await fetch(
          `https://vigilant-log-cyberx.onrender.com/api/recovery/${type}?deviceName=${deviceName}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        setRecovery(data?.data?.analysis);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    getRecovery();
  }, [metric]);

  const parseMarkdown = (text) => {
    if (!text) return null;

    const sections = text.split(/(?=^#{1,3}\s)/m);

    return sections.map((section, idx) => {
      const lines = section.split("\n");
      const elements = [];
      let currentList = [];
      let listType = null;

      lines.forEach((line, lineIdx) => {
        // Headers
        if (line.startsWith("### ")) {
          if (currentList.length > 0) {
            elements.push(
              <ul key={`list-${lineIdx}`} className="recovery-list">
                {currentList.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            );
            currentList = [];
            listType = null;
          }
          elements.push(
            <h3 key={lineIdx} className="recovery-h3">
              {line.replace("### ", "")}
            </h3>
          );
        } else if (line.startsWith("## ")) {
          if (currentList.length > 0) {
            elements.push(
              <ul key={`list-${lineIdx}`} className="recovery-list">
                {currentList.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            );
            currentList = [];
            listType = null;
          }
          elements.push(
            <h2 key={lineIdx} className="recovery-h2">
              {line.replace("## ", "")}
            </h2>
          );
        } else if (line.startsWith("# ")) {
          if (currentList.length > 0) {
            elements.push(
              <ul key={`list-${lineIdx}`} className="recovery-list">
                {currentList.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            );
            currentList = [];
            listType = null;
          }
          elements.push(
            <h1 key={lineIdx} className="recovery-h1">
              {line.replace("# ", "")}
            </h1>
          );
        }
        // Bold text
        else if (line.includes("**")) {
          if (currentList.length > 0) {
            elements.push(
              <ul key={`list-${lineIdx}`} className="recovery-list">
                {currentList.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            );
            currentList = [];
            listType = null;
          }
          const parts = line.split(/\*\*(.*?)\*\*/g);
          elements.push(
            <p key={lineIdx} className="recovery-paragraph">
              {parts.map((part, i) =>
                i % 2 === 1 ? (
                  <strong key={i} className="recovery-bold">
                    {part}
                  </strong>
                ) : (
                  part
                )
              )}
            </p>
          );
        }
        // List items
        else if (line.trim().startsWith("- ") || /^\d+\./.test(line.trim())) {
          const isNumbered = /^\d+\./.test(line.trim());
          const content = line.replace(/^-\s+/, "").replace(/^\d+\.\s+/, "");

          if (listType && listType !== (isNumbered ? "ol" : "ul")) {
            elements.push(
              listType === "ol" ? (
                <ol key={`list-${lineIdx}`} className="recovery-ordered-list">
                  {currentList.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ol>
              ) : (
                <ul key={`list-${lineIdx}`} className="recovery-list">
                  {currentList.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )
            );
            currentList = [];
          }

          listType = isNumbered ? "ol" : "ul";
          currentList.push(content);
        }
        // Horizontal rule
        else if (line.trim() === "---") {
          if (currentList.length > 0) {
            elements.push(
              listType === "ol" ? (
                <ol key={`list-${lineIdx}`} className="recovery-ordered-list">
                  {currentList.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ol>
              ) : (
                <ul key={`list-${lineIdx}`} className="recovery-list">
                  {currentList.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )
            );
            currentList = [];
            listType = null;
          }
          elements.push(<hr key={lineIdx} className="recovery-hr" />);
        }
        // Regular text
        else if (line.trim()) {
          if (currentList.length > 0) {
            elements.push(
              listType === "ol" ? (
                <ol key={`list-${lineIdx}`} className="recovery-ordered-list">
                  {currentList.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ol>
              ) : (
                <ul key={`list-${lineIdx}`} className="recovery-list">
                  {currentList.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )
            );
            currentList = [];
            listType = null;
          }
          elements.push(
            <p key={lineIdx} className="recovery-paragraph">
              {line}
            </p>
          );
        }
      });

      if (currentList.length > 0) {
        elements.push(
          listType === "ol" ? (
            <ol key={`list-end`} className="recovery-ordered-list">
              {currentList.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ol>
          ) : (
            <ul key={`list-end`} className="recovery-list">
              {currentList.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )
        );
      }

      return (
        <div key={idx} className="recovery-section">
          {elements}
        </div>
      );
    });
  };

  const getMetricTitle = (metric) => {
    const titles = {
      appCrash: "Application Crash",
      bsod: "Blue Screen of Death",
      systemHang: "System Hang",
      unexpectedShutdown: "Unexpected Shutdown",
    };
    return titles[metric] || "System Analysis";
  };

  return (
    <div className="recovery-container">
      <div className="recovery-header">
        <div className="recovery-header-content">
          <h1 className="recovery-title">Recovery Analysis</h1>
          <div className="recovery-badge">{getMetricTitle(metric)}</div>
        </div>
      </div>

      <div className="recovery-content">
        {loading ? (
          <div className="recovery-loading-container">
            <div className="recovery-spinner"></div>
            <p className="recovery-loading-text">
              Analyzing system logs and generating recovery steps...
            </p>
          </div>
        ) : (
          <div className="recovery-analysis-container">
            {parseMarkdown(recovery)}
          </div>
        )}
      </div>
    </div>
  );
}

export default AppCrashPage;

// import { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";

// function AppCrashPage() {
//   const location = useLocation();
//   const [recovery, setRecovery] = useState("");
//   const pathParts = location.pathname.split("/");

//   const metric = pathParts[pathParts.length - 1];

//   useEffect(() => {
//     const getRecovery = async () => {
//       const typeMap = {
//         appCrash: "APP",
//         bsod: "BSOD",
//         systemHang: "HANG",
//         unexpectedShutdown: "SHUT",
//       };

//       const type = typeMap[metric] || "SHUT";

//       try {
//         const deviceName =
//           sessionStorage.getItem("deviceName") || "NISHANTH_CK";
//         const res = await fetch(
//           `https://vigilant-log-cyberx.onrender.com/api/recovery/${type}?deviceName=${deviceName}`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         const data = await res.json();
//         setRecovery(data?.data?.analysis);
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     getRecovery();
//   }, [metric]);

//   return (
//     <div>
//       <h1>Analysis Page</h1>
//       <p>Metric Type: {metric}</p>
//       {recovery ? recovery : "Loading recovery analysis..."}
//     </div>
//   );
// }

// export default AppCrashPage;
