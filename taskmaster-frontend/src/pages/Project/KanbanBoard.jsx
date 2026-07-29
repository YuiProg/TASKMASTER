import React from "react";
import "./Kanbanboard.css";
import { useTaskStore } from "../../context/taskStore";
import { Eye, AlertOctagon, AlertTriangle, ArrowUp, ArrowDown } from "lucide-react";
import navigateTo from "../../lib/navigate";

const COLUMNS = ["OPEN", "IN PROGRESS", "QA CHECK", "DEPLOYED", "CLOSED"];

// Main container for meta info + view button (row layout)
const metaContainerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: "8px",
  width: "100%",
};

// Container that stacks Assignee and Priority vertically
const infoStackStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "2px",
};

const assigneeTextStyle = {
  fontSize: "0.72rem",
  color: "#94a3b8",
};

const priorityContainerStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  fontSize: "0.72rem",
  fontWeight: "600",
};

const viewButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "transparent",
  border: "1px solid #e2e8f0",
  borderRadius: "6px",
  padding: "4px 6px",
  color: "#64748b",
  cursor: "pointer",
  outline: "none",
  lineHeight: 1,
  margin: 0,
};

function normalizeStatus(status) {
  if (!status) return "";
  return status.toUpperCase().replace(/[\s_-]+/g, " ").trim();
}

function columnColorClass(column) {
  switch (column) {
    case "IN PROGRESS":
    case "QA CHECK":
      return "kb-column-blue";
    case "DEPLOYED":
    case "CLOSED":
      return "kb-column-green";
    default:
      return "";
  }
}

// Helper to render priority icon & color dynamically
function renderPriorityIcon(priority = "LOW") {
  const normPriority = (priority || "LOW").toUpperCase();

  switch (normPriority) {
    case "CRITICAL":
      return (
        <span style={{ ...priorityContainerStyle, color: "#ef4444" }}>
          <AlertOctagon size={13} /> CRITICAL
        </span>
      );
    case "HIGH":
      return (
        <span style={{ ...priorityContainerStyle, color: "#f59e0b" }}>
          <AlertTriangle size={13} /> HIGH
        </span>
      );
    case "MEDIUM":
      return (
        <span style={{ ...priorityContainerStyle, color: "#3b82f6" }}>
          <ArrowUp size={13} /> MEDIUM
        </span>
      );
    case "LOW":
    default:
      return (
        <span style={{ ...priorityContainerStyle, color: "#64748b" }}>
          <ArrowDown size={13} /> LOW
        </span>
      );
  }
}

class KanbanBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      draggingTaskId: null,
      dragOverColumn: null,
      localStatusOverrides: {},
    };
    this.wasDragging = false;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tasks !== this.props.tasks) {
      this.setState({ localStatusOverrides: {} });
    }
  }

  logDroppedColumn = (taskId, column) => {
    const { updateStatus } = useTaskStore.getState();
    updateStatus(taskId, column);
    this.wasDragging = false;
  };

  handleDragStart = (task) => (e) => {
    this.wasDragging = true;
    e.dataTransfer.setData("text/plain", task.id);
    e.dataTransfer.effectAllowed = "move";
    this.setState({ draggingTaskId: task.id });
  };

  handleDragEnd = () => {
    this.setState({ draggingTaskId: null, dragOverColumn: null });
    setTimeout(() => {
      this.wasDragging = false;
    }, 50);
  };

  handleDragOver = (column) => (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (this.state.dragOverColumn !== column) {
      this.setState({ dragOverColumn: column });
    }
  };

  handleDragLeave = (column) => () => {
    if (this.state.dragOverColumn === column) {
      this.setState({ dragOverColumn: null });
    }
  };

  handleDrop = (column) => (e) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");

    if (!taskId) return;

    const task = this.props.tasks?.find((t) => String(t.id) === String(taskId));
    const currentStatus = this.getTaskStatus(task) || (task ? normalizeStatus(task.status) : "");

    if (currentStatus === column) {
      this.setState({
        draggingTaskId: null,
        dragOverColumn: null,
      });
      return;
    }

    console.log("Ticket dropped into new status:", {
      ticket: task,
      previousStatus: currentStatus,
      newStatus: column,
    });

    this.logDroppedColumn(taskId, column);

    this.setState((prevState) => ({
      localStatusOverrides: {
        ...prevState.localStatusOverrides,
        [taskId]: column,
      },
      draggingTaskId: null,
      dragOverColumn: null,
    }));

    if (this.props.onStatusChange) {
      this.props.onStatusChange(taskId, column);
    }
  };

  handleCardClick = (task) => {
    if (this.wasDragging) return;

    if (this.props.onViewTask) {
      this.props.onViewTask(task);
    } else {
      navigateTo(`/tasks/view/${task.id}`);
    }
  };

  getTaskStatus(task) {
    if (!task) return "";
    return (
      this.state.localStatusOverrides[task.id] || normalizeStatus(task.status)
    );
  }

  render() {
    const { tasks = [] } = this.props;
    const { draggingTaskId, dragOverColumn } = this.state;

    return (
      <div className="kb-board">
        {COLUMNS.map((column) => {
          const columnTasks = tasks.filter(
            (t) => this.getTaskStatus(t) === column
          );

          return (
            <div
              key={column}
              className={`kb-column ${columnColorClass(column)} ${
                dragOverColumn === column ? "kb-column-dragover" : ""
              }`}
              onDragOver={this.handleDragOver(column)}
              onDragLeave={this.handleDragLeave(column)}
              onDrop={this.handleDrop(column)}
            >
              <div className="kb-column-header">
                <span className="kb-column-title">{column}</span>
                <span className="kb-column-count">{columnTasks.length}</span>
              </div>

              <div className="kb-column-body">
                {columnTasks.length === 0 ? (
                  <p className="kb-empty">No tickets</p>
                ) : (
                  columnTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`kb-card ${
                        draggingTaskId === task.id ? "kb-card-dragging" : ""
                      }`}
                      draggable
                      onDragStart={this.handleDragStart(task)}
                      onDragEnd={this.handleDragEnd}
                      onClick={(e) => this.handleCardClick(task, e)}
                    >
                      <p className="kb-card-title">{task.taskName}</p>

                      <div className="kb-card-meta" style={metaContainerStyle}>
                        {/* Stacked Assignee & Dynamic Priority with Icon */}
                        <div style={infoStackStyle}>
                          <span style={assigneeTextStyle}>
                            Assignee: {task.assignee?.username || "Unassigned"}
                          </span>
                          {renderPriorityIcon(task.priority)}
                        </div>

                        {/* Action Eye Button */}
                        <button
                          type="button"
                          className="kb-view-btn"
                          title="View Ticket"
                          style={viewButtonStyle}
                          onClick={(e) => {
                            e.stopPropagation();
                            this.handleCardClick(task, e);
                          }}
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default KanbanBoard;