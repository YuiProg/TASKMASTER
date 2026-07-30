import React from "react";
import "./KanbanBoard.css";
import { useTaskStore } from "../../context/TaskStore.js";
import { Eye, AlertOctagon, AlertTriangle, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import navigateTo from "../../lib/navigate";
import toast, { Toaster } from "react-hot-toast";

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

const cardLoadingOverlayStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(255, 255, 255, 0.85)",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 10,
  gap: "6px",
  fontSize: "0.75rem",
  fontWeight: "600",
  color: "#2563eb",
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

// Groups task ids by column, preserving the order they appear in `tasks`.
// This becomes the single source of truth for both which column a task
// is in AND where it sits within that column — plain array filtering
// alone can't guarantee a dropped card lands at the bottom, since it
// would just fall back to wherever it happened to sit in the original
// unsorted `tasks` array.
function buildColumnOrder(tasks) {
  const order = {};
  COLUMNS.forEach((c) => {
    order[c] = [];
  });

  tasks.forEach((t) => {
    const status = normalizeStatus(t.status);
    if (order[status]) {
      order[status].push(t.id);
    } else {
      // Unrecognized/legacy status value — default it into OPEN rather
      // than silently dropping the card from the board entirely.
      order.OPEN.push(t.id);
    }
  });

  return order;
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
      columnOrder: buildColumnOrder(props.tasks || []),
      updatingTaskId: null,
    };
    this.wasDragging = false;
  }

  componentDidMount() {
    // Subscribe to Zustand store changes for updatingTaskId
    this.unsubscribe = useTaskStore.subscribe((state) => {
      this.setState({ updatingTaskId: state.updatingTaskId });
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tasks !== this.props.tasks) {
      // Fresh data from the parent (e.g. after a real refetch) — rebuild
      // column order from scratch rather than trying to merge it with
      // whatever local drag state existed before.
      this.setState({ columnOrder: buildColumnOrder(this.props.tasks || []) });
    }
  }

  findTaskColumn(taskId) {
    const { columnOrder } = this.state;
    return COLUMNS.find((c) => columnOrder[c].includes(taskId)) || null;
  }

  handleDragStart = (task) => (e) => {
    // Prevent dragging if the task is currently updating
    if (String(this.state.updatingTaskId) === String(task.id)) {
      e.preventDefault();
      return;
    }
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

  handleDrop = (column) => async (e) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");

    if (!taskId) return;

    const currentColumn = this.findTaskColumn(taskId);

    if (currentColumn === column) {
      this.setState({ draggingTaskId: null, dragOverColumn: null });
      return;
    }

    // Snapshot so we can restore exact prior order if the API call fails.
    const previousColumnOrder = this.state.columnOrder;

    // Optimistically move the card to the END of the target column.
    const nextColumnOrder = Object.fromEntries(
      COLUMNS.map((c) => [c, previousColumnOrder[c].filter((id) => id !== taskId)])
    );
    nextColumnOrder[column] = [...nextColumnOrder[column], taskId];

    this.setState({
      columnOrder: nextColumnOrder,
      draggingTaskId: null,
      dragOverColumn: null,
    });

    // Trigger update in Zustand Store
    const { updateStatus } = useTaskStore.getState();
    const result = await updateStatus(taskId, column);

    // IF API Call Failed / Status ERROR: Revert card and show toast notification
    if (!result || !result.success) {
      this.setState({ columnOrder: previousColumnOrder });

      // Show toast error message
      toast.error(result?.message, {
        position: "bottom-right",
        duration: 4000,
      });
      this.wasDragging = false;
      return;
    }

    this.wasDragging = false;

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

  render() {
    const { tasks = [] } = this.props;
    const { draggingTaskId, dragOverColumn, updatingTaskId, columnOrder } = this.state;

    const tasksById = Object.fromEntries(tasks.map((t) => [t.id, t]));

    return (
      <div className="kb-board">
        {/* Toast Container to render toasts */}
        <Toaster />

        {COLUMNS.map((column) => {
          const columnTasks = columnOrder[column]
            .map((id) => tasksById[id])
            .filter(Boolean);

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
                  columnTasks.map((task) => {
                    const isUpdating = String(updatingTaskId) === String(task.id);

                    return (
                      <div
                        key={task.id}
                        className={`kb-card ${
                          draggingTaskId === task.id ? "kb-card-dragging" : ""
                        }`}
                        style={{ position: "relative" }}
                        draggable={!isUpdating}
                        onDragStart={this.handleDragStart(task)}
                        onDragEnd={this.handleDragEnd}
                        onClick={(e) => this.handleCardClick(task, e)}
                      >
                        {/* Task Loading Overlay */}
                        {isUpdating && (
                          <div style={cardLoadingOverlayStyle}>
                            <Loader2 size={16} className="kb-spinner" />
                            <span>Updating...</span>
                          </div>
                        )}

                        <p className="kb-card-title">{task.taskName}</p>

                        <div className="kb-card-meta" style={metaContainerStyle}>
                          <div style={infoStackStyle}>
                            <span style={assigneeTextStyle}>
                              Assignee: {task.assignee?.username || "Unassigned"}
                            </span>
                            <span style={assigneeTextStyle}>
                              Reporter: {task.createdBy?.username || "Unassigned"}
                            </span>
                            {renderPriorityIcon(task.priority)}
                          </div>

                          <button
                            type="button"
                            className="kb-view-btn"
                            title="View Ticket"
                            style={viewButtonStyle}
                            disabled={isUpdating}
                            onClick={(e) => {
                              e.stopPropagation();
                              this.handleCardClick(task, e);
                            }}
                          >
                            <Eye size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })
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