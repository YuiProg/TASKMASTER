import React from "react";
import { PanelPage, PanelContainer } from "../../components/TRCOMPONENTS/TRPanelPage/TRPanelPage";
import { InputRow } from "../../components/TRCOMPONENTS/TRInputForm/TRInputForm";
import { Label } from "../../components/TRCOMPONENTS/TRInputField/InputFIeld";
import Dropdown from "../../components/TRCOMPONENTS/TRDropDown/Dropdown";

import Spinner from "../../components/Spinner/Spinner";
import { useTaskStore } from "../../context/taskStore";
import navigateTo from "../../lib/navigate";
import "./ViewTask.css";
import TaskComments from "./TaskComment";
import TaskReports from "./TaskReport";
import { useCommentStore } from "../../context/commentStore";

// Options arrays
const STATUS_OPTIONS = ["OPEN", "IN PROGRESS", "QA CHECK", "DEPLOYED", "CLOSED"];
const PRIORITY_OPTIONS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

function toDisplayStatus(status) {
  if (!status) return "";
  return status.toUpperCase().replace(/[\s_-]+/g, " ").trim();
}

function statusColorGroup(status) {
  const normalized = (status || "").toUpperCase().replace(/[\s-]+/g, "_");

  switch (normalized) {
    case "IN_PROGRESS":
    case "QA_CHECK":
      return "blue";
    case "DEPLOYED":
    case "CLOSED":
      return "green";
    default:
      return "default";
  }
}

// Color group generator for Priority states
function priorityColorGroup(priority) {
  const normalized = (priority || "").toUpperCase();

  switch (normalized) {
    case "CRITICAL":
      return "red";
    case "HIGH":
      return "amber";
    case "MEDIUM":
      return "blue";
    case "LOW":
    default:
      return "gray";
  }
}

function formatDate(rawDate) {
  if (!rawDate) return "N/A";
  
  const timestamp = Number(rawDate);
  const dateInput = !Number.isNaN(timestamp) ? timestamp : rawDate;

  const parsed = new Date(dateInput);
  if (Number.isNaN(parsed.getTime())) return String(rawDate);

  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function initialsOf(name) {
  if (!name) return "?";
  return name.slice(0, 2).toUpperCase();
}

function UserHoverCard({ user, children }) {
  if (!user) return children;

  return (
    <span className="vt-user-hover">
      {children}
      <span className="vt-user-tooltip">
        <span className="vt-user-tooltip-avatar">
          {initialsOf(user.username)}
        </span>
        <span className="vt-user-tooltip-email">
          {user.email || "No email on file"}
        </span>
      </span>
    </span>
  );
}

class ViewTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      task: null,
    };
  }

  componentDidMount() {
    this.initData();
  }

  initData = async () => {
    const { fetchTaskById } = useTaskStore.getState();
    const currentPath = window.location.pathname;
    const taskId = currentPath.replace("/tasks/view/", "");
    const data = await fetchTaskById(taskId);
    if (data) {
      this.setState({
        task: data.data,
      });
    }
  };

  goToProject = (projectName) => {
    navigateTo(`/projects/${projectName}`);
  };

  handleStatusChange = async (displayValue) => {
    const { updateStatus } = useTaskStore.getState();
    this.setState((prev) => ({
      task: { ...prev.task, status: displayValue },
    }));
    await updateStatus(this.state.task.id, displayValue);
    console.log("[ViewTask] status changed to:", displayValue);
  };

  handlePriorityChange = async (priorityValue) => {
    const { updateTask } = useTaskStore.getState();
    this.setState((prev) => ({
      task: { ...prev.task, priority: priorityValue },
    }));
    const updatedTask = await updateTask({ priority: priorityValue }, this.state.task.id);
    if (updatedTask) {
      this.setState({ task: updatedTask });
    }
    console.log("[ViewTask] priority changed to:", priorityValue);
  };

  addComment = async (comment) => {
    const taskId = this.state.task.id;
    const { postComment } = useCommentStore.getState();
    postComment(comment, taskId);
  };

  handleAssigneeEdit = async (value) => {
    const { updateTask } = useTaskStore.getState();
    if (!value) return;
    this.setState((prev) => ({
      task: { ...prev.task, assignee: value },
    }));
    const task = await updateTask({ assignee: value }, this.state.task.id);
    this.setState({ task });
  };

  handleDescriptionEdit = async (value) => {
    const { updateTask } = useTaskStore.getState();
    this.setState((prev) => ({
      task: { ...prev.task, description: value },
    }));
    const task = await updateTask({ description: value }, this.state.task.id);
    this.setState({ task });
  };

  render() {
    if (!this.state.task)
      return (
        <PanelPage>
          <Spinner size={30} strokeWidth={3} />
        </PanelPage>
      );

    const { task } = this.state;
    const project = task.project || {};
    const members = project.members || [];

    return (
      <PanelPage
        titlePage={task.taskName.toUpperCase()}
        subTitle={`Task ID: ${task.id}`}
      >
        <PanelContainer title="Overview">
          <div className="vt-overview-header">
            <h2 className="vt-task-title">{task.taskName}</h2>
          </div>

          <Label
            className="vt-description"
            label={task.description || "No description provided."}
            value={task.description || ""}
            placeholder="Add a description..."
            onClick={this.handleDescriptionEdit}
          />

          {/* Dropdowns now directly below the description */}
          <div className="vt-header-dropdowns">
            <div className={`vt-status-dropdown vt-status-${statusColorGroup(task.status)}`}>
              <Dropdown
                options={STATUS_OPTIONS}
                value={toDisplayStatus(task.status)}
                onChange={this.handleStatusChange}
              />
            </div>

            <div className={`vt-priority-dropdown vt-priority-${priorityColorGroup(task.priority)}`}>
              <Dropdown
                options={PRIORITY_OPTIONS}
                value={(task.priority || "LOW").toUpperCase()}
                onChange={this.handlePriorityChange}
              />
            </div>
          </div>

          <InputRow gap={16}>
            <PanelContainer title="Details">
              <div className="vt-details-grid">
                <div className="vt-assignee-row">
                  <span className="vt-assignee-key">Assignee</span>
                  <UserHoverCard user={task.assignee}>
                    <Label
                      label={`${task.assignee?.username || "Unassigned"}`}
                      value={task.assignee?.username || ""}
                      onClick={(e) => this.handleAssigneeEdit(e)}
                      placeholder="Assignee"
                    />
                  </UserHoverCard>
                </div>

                <Label label={`Created By: ${task.createdBy?.username || "N/A"}`} />
                <Label label={`Created At: ${formatDate(task.createdAt)}`} />
                <Label label={`Updated By: ${task.updatedBy || "N/A"}`} />
              </div>
            </PanelContainer>

            <PanelContainer title="Project">
              <div className="vt-details-grid">
                <span className="vt-assignee-key">
                  Project Name: {project.projectName?.toUpperCase() || "NO PROJECT ASSIGNED"}
                </span>
                <Label label={`Status: ${project.status || "N/A"}`} />
                <Label label={`Members: ${members.length}`} />
              </div>

              {members.length > 0 && (
                <div className="vt-member-chips">
                  {members.map((m) => (
                    <UserHoverCard key={m.id} user={m}>
                      <span className="vt-member-chip">
                        {m.username || m.email}
                      </span>
                    </UserHoverCard>
                  ))}
                </div>
              )}

              {project.projectName && (
                <button
                  type="button"
                  className="vt-view-project-link"
                  onClick={() => this.goToProject(project.projectName)}
                >
                  View Project &rarr;
                </button>
              )}
            </PanelContainer>
          </InputRow>
        </PanelContainer>

        <PanelContainer title="Activity Log">
          <TaskReports taskId={task.id} />
        </PanelContainer>
        <PanelContainer title="Comments">
          <TaskComments taskId={task.id} onAddComment={(e) => this.addComment(e)} />
        </PanelContainer>
      </PanelPage>
    );
  }
}

export default ViewTask;