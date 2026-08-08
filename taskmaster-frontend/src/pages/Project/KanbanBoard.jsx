import React from "react";
import "./KanbanBoard.scss";
import { useTaskStore } from "../../context/TaskStore.js";
import { Eye, AlertOctagon, AlertTriangle, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import navigateTo from "../../lib/navigate";
import { Toaster } from "react-hot-toast";

// Styling constants
const metaContainerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: "8px",
  width: "100%",
};

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
  border: "1px solid transparent",
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

/**
 * Extracts columns from the project payload, falls back to defaults.
 */
function getColumns(project) {
  const customCols = project?.data?.priorities || project?.priorities;
  if (Array.isArray(customCols) && customCols.length > 0) {
    return customCols;
  }
  return ["OPEN", "IN PROGRESS", "QA CHECK", "DEPLOYED", "CLOSED"];
}

/**
 * Groups tasks based on the dynamic columns provided.
 */
function buildColumnOrder(tasks = [], columns = []) {
  const order = {};
  
  columns.forEach((c) => {
    order[c] = [];
  });

  tasks.forEach((t) => {
    if (!t || !t.id) return;
    const taskStatus = (t.status || "").trim();
    
    // Case-insensitive match to find which column the task belongs in
    const matchedCol = columns.find(c => c.toLowerCase() === taskStatus.toLowerCase());
    
    if (matchedCol) {
      order[matchedCol].push(t.id);
    } else if (columns.length > 0) {
      // If task status doesn't match any column, push to the very first column
      order[columns[0]].push(t.id);
    }
  });

  return order;
}

function columnColorClass(index, totalColumns) {
  if (index === 0) return ""; 
  if (index === totalColumns - 1) return "kb-board__column--green";
  return "kb-board__column--blue";
}

function renderPriorityIcon(priority) {
  const normPriority = (priority || "LOW").toString().toUpperCase().trim();

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
        <span style={{ ...priorityContainerStyle, color: "#94a3b8" }}>
          <ArrowDown size={13} /> LOW
        </span>
      );
  }
}

class KanbanBoard extends React.Component {
  constructor(props) {
    super(props);
    const columns = getColumns(props.project);
    this.state = {
      draggingTaskId: null,
      dragOverColumn: null,
      columns: columns,
      columnOrder: buildColumnOrder(props.tasks || [], columns),
      updatingTaskId: null,
    };
    this.wasDragging = false;
  }

  componentDidMount() {
    this.unsubscribe = useTaskStore.subscribe((state) => {
      this.setState({ updatingTaskId: state.updatingTaskId });
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  componentDidUpdate(prevProps) {
    const prevCols = getColumns(prevProps.project).join(",");
    const currCols = getColumns(this.props.project).join(",");

    // Rebuild the board if tasks update OR if project priorities array changes
    if (prevProps.tasks !== this.props.tasks || prevCols !== currCols) {
      const columns = getColumns(this.props.project);
      this.setState({ 
        columns,
        columnOrder: buildColumnOrder(this.props.tasks || [], columns) 
      });
    }
  }

  findTaskColumn(taskId) {
    const { columnOrder, columns } = this.state;
    return columns.find((c) => columnOrder[c]?.includes(taskId)) || null;
  }

  handleDragStart = (task) => (e) => {
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

    const previousColumnOrder = this.state.columnOrder;
    const { columns } = this.state;

    // Dynamically rebuild the object based on current columns
    const nextColumnOrder = Object.fromEntries(
      columns.map((c) => [c, previousColumnOrder[c].filter((id) => id !== taskId)])
    );
    nextColumnOrder[column] = [...nextColumnOrder[column], taskId];

    this.setState({
      columnOrder: nextColumnOrder,
      draggingTaskId: null,
      dragOverColumn: null,
    });

    const { updateStatus } = useTaskStore.getState();
    const result = await updateStatus(taskId, column);

    if (!result || !result.success) {
      this.setState({ columnOrder: previousColumnOrder });
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
    const { draggingTaskId, dragOverColumn, updatingTaskId, columnOrder, columns } = this.state;
    const tasksById = Object.fromEntries(tasks.map((t) => [t.id, t]));

    return (
      <div className="kb-board">
        <Toaster />

        {columns.map((column, index) => {
          const columnTasks = (columnOrder[column] || [])
            .map((id) => tasksById[id])
            .filter(Boolean);

          return (
            <div
              key={column}
              className={`kb-board__column ${columnColorClass(index, columns.length)} ${
                dragOverColumn === column ? "kb-board__column--dragover" : ""
              }`}
              onDragOver={this.handleDragOver(column)}
              onDragLeave={this.handleDragLeave(column)}
              onDrop={this.handleDrop(column)}
            >
              <div className="kb-board__column-header">
                <span className="kb-board__column-title">{column.toUpperCase()}</span>
                <span className="kb-board__column-count">{columnTasks.length}</span>
              </div>

              <div className="kb-board__column-body">
                {columnTasks.length === 0 ? (
                  <p className="kb-board__empty">No tickets</p>
                ) : (
                  columnTasks.map((task) => {
                    const isUpdating = String(updatingTaskId) === String(task.id);

                    return (
                      <div
                        key={task.id}
                        className={`kb-board__card ${
                          draggingTaskId === task.id ? "kb-board__card--dragging" : ""
                        }`}
                        style={{ position: "relative" }}
                        draggable={!isUpdating}
                        onDragStart={this.handleDragStart(task)}
                        onDragEnd={this.handleDragEnd}
                        onClick={(e) => this.handleCardClick(task, e)}
                      >
                        {isUpdating && (
                          <div style={cardLoadingOverlayStyle}>
                            <Loader2 size={16} className="kb-board__spinner" />
                            <span>Updating...</span>
                          </div>
                        )}

                        <p className="kb-board__card-title">{task.taskName}</p>

                        <div className="kb-board__card-meta" style={metaContainerStyle}>
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
                            className="kb-board__view-btn"
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