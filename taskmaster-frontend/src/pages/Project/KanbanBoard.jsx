import React from "react";
import "./Kanbanboard.css";
import { useTaskStore } from "../../context/taskStore";
import { Eye } from "lucide-react";
import navigateTo from "../../lib/navigate";

const COLUMNS = ["OPEN", "IN PROGRESS", "QA CHECK", "DEPLOYED", "CLOSED"];

const metaContainerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: "8px",
  width: "100%",
};

const assigneeTextStyle = {
  fontSize: "0.72rem",
  color: "#94a3b8",
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

class KanbanBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      draggingTaskId: null,
      dragOverColumn: null,
      localStatusOverrides: {},
    };
    this.wasDragging = false;
    this.dragResetTimeout = null;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tasks !== this.props.tasks) {
      this.setState({ localStatusOverrides: {} });
    }
  }

  componentWillUnmount() {
    if (this.dragResetTimeout) {
      clearTimeout(this.dragResetTimeout);
    }
  }

  logDroppedColumn = (taskId, column) => {
    const { updateStatus } = useTaskStore.getState();
    updateStatus(taskId, column);
  };

  handleDragStart = (task) => (e) => {
    this.wasDragging = true;
    e.dataTransfer.setData("text/plain", task.id);
    e.dataTransfer.effectAllowed = "move";
    this.setState({ draggingTaskId: task.id });
  };

  handleDragEnd = () => {
    this.setState({ draggingTaskId: null, dragOverColumn: null });
    this.resetDraggingFlag();
  };

  resetDraggingFlag = () => {
    if (this.dragResetTimeout) clearTimeout(this.dragResetTimeout);
    this.dragResetTimeout = setTimeout(() => {
      this.wasDragging = false;
    }, 100);
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
    const rawTaskId = e.dataTransfer.getData("text/plain");

    if (!rawTaskId) {
      this.resetDraggingFlag();
      return;
    }

    // Find task preserving original task.id type
    const task = this.props.tasks?.find((t) => String(t.id) === String(rawTaskId));
    const targetTaskId = task ? task.id : rawTaskId;

    const currentStatus = this.getTaskStatus(task) || (task ? normalizeStatus(task.status) : "");

    // Check if target column is identical
    if (currentStatus === column) {
      this.setState({
        draggingTaskId: null,
        dragOverColumn: null,
      });
      this.resetDraggingFlag();
      return;
    }

    console.log("Ticket dropped into new status:", {
      ticket: task,
      previousStatus: currentStatus,
      newStatus: column,
    });

    // Send original ID to store update
    this.logDroppedColumn(targetTaskId, column);

    this.setState((prevState) => ({
      localStatusOverrides: {
        ...prevState.localStatusOverrides,
        [targetTaskId]: column,
      },
      draggingTaskId: null,
      dragOverColumn: null,
    }));

    if (this.props.onStatusChange) {
      this.props.onStatusChange(targetTaskId, column);
    }

    // CRITICAL FIX: Explicitly reset wasDragging state on drop
    // because DOM node re-rendering prevents handleDragEnd from firing
    this.resetDraggingFlag();
  };

  handleCardClick = (task) => {
    if (this.wasDragging) return;

    const updatedTask = {
      ...task,
      status: this.getTaskStatus(task),
    };

    if (this.props.onViewTask) {
      this.props.onViewTask(updatedTask);
    } else {
      navigateTo(`/tasks/view/${updatedTask.id}`);
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
                        <span style={assigneeTextStyle}>
                          {task.assignee?.username || "Unassigned"}
                        </span>

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