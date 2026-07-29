import { useEffect } from "react";
import { Activity } from "lucide-react";

import "./TaskReport.css";
import Spinner from "../../components/Spinner/Spinner";
import { useReportStore } from "../../context/ReportStore.js";

function formatReportDate(rawDate) {
  if (!rawDate) return "";
  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) return rawDate;
  return parsed.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function TaskReports({ taskId }) {
  const reports = useReportStore((state) => state.reports);
  const isLoading = useReportStore((state) => state.isLoading);

  useEffect(() => {
    if (!taskId) return;
    useReportStore.getState().getReports(taskId);
  }, [taskId]);

  return (
    <div className="tr-container">
      <p className="tr-count-line">
        {reports.length} {reports.length === 1 ? "entry" : "entries"}
      </p>

      {isLoading ? (
        <div className="tr-loading">
          <Spinner size={20} strokeWidth={3} />
        </div>
      ) : reports.length === 0 ? (
        <p className="tr-empty">No activity recorded yet.</p>
      ) : (
        <div className="tr-list">
          {reports.map((r) => (
            <div key={r.id} className="tr-item">
              <div className="tr-icon">
                <Activity size={14} />
              </div>
              <div className="tr-body">
                <p className="tr-description">{r.description}</p>
                <span className="tr-meta">
                  {r.performedBy?.username || "Unknown"} &middot;{" "}
                  {formatReportDate(r.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskReports;