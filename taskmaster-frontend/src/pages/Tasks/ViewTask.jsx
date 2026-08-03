import React from "react";
import { PanelPage, PanelContainer } from "../../components/TRCOMPONENTS/TRPanelPage/TRPanelPage";
import { InputRow } from "../../components/TRCOMPONENTS/TRInputForm/TRInputForm";
import { Label } from "../../components/TRCOMPONENTS/TRInputField/InputFIeld";
import Dropdown from "../../components/TRCOMPONENTS/TRDropDown/Dropdown";

import Spinner from "../../components/Spinner/Spinner";
import { useTaskStore } from "../../context/TaskStore.js";
import navigateTo from "../../lib/navigate";
import "./ViewTask.scss";
import TaskComments from "./TaskComment";
import TaskReports from "./TaskReport";
import { useCommentStore } from "../../context/CommentStore.js";
import { Toaster } from "react-hot-toast";

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
    <span className="view-task__user-hover">
      {children}
      <span className="view-task__user-tooltip">
        <span className="view-task__user-tooltip-avatar">
          {initialsOf(user.username)}
        </span>
        <span className="view-task__user-tooltip-email">
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
    const previousStatus = this.state.task.status;
    const { updateStatus } = useTaskStore.getState();

    // Optimistically update status UI
    this.setState((prev) => ({
      task: { ...prev.task, status: displayValue },
    }));

    const result = await updateStatus(this.state.task.id, displayValue);

    // Revert state + trigger toast on failure
    if (!result || result.success === false) {
      this.setState((prev) => ({
        task: { ...prev.task, status: previousStatus },
      }));

      // toast.error(result?.message, {
      //   position: "bottom-right",
      //   duration: 4000,
      // });
      return;
    }

    if (result.data) {
      this.setState({ task: result.data });
    }
    console.log("[ViewTask] status changed to:", displayValue);
  };

  handlePriorityChange = async (priorityValue) => {
    const previousPriority = this.state.task.priority;
    const { updateTask } = useTaskStore.getState();

    // Optimistically update priority UI
    this.setState((prev) => ({
      task: { ...prev.task, priority: priorityValue },
    }));

    const result = await updateTask({ priority: priorityValue }, this.state.task.id);

    // Revert state + trigger toast on failure
    if (!result || result.success === false) {
      this.setState((prev) => ({
        task: { ...prev.task, priority: previousPriority },
      }));

      // toast.error(result?.message, {
      //   position: "bottom-right",
      //   duration: 4000,
      // });
      return;
    }

    if (result.data || result) {
      this.setState({ task: result.data || result });
    }
    console.log("[ViewTask] priority changed to:", priorityValue);
  };

  addComment = async (comment) => {
    const taskId = this.state.task.id;
    const { postComment } = useCommentStore.getState();
    postComment(comment, taskId);
  };

  handleAssigneeEdit = async (value) => {
    if (!value) return;
    const previousAssignee = this.state.task.assignee;
    const { updateTask } = useTaskStore.getState();

    this.setState((prev) => ({
      task: { ...prev.task, assignee: value },
    }));

    const result = await updateTask({ assignee: value }, this.state.task.id);

    if (!result || result.success === false) {
      this.setState((prev) => ({
        task: { ...prev.task, assignee: previousAssignee },
      }));

      // toast.error(result?.message, {
      //   position: "bottom-right",
      //   duration: 4000,
      // });
      return;
    }

    if (result.data || result) {
      this.setState({ task: result.data || result });
    }
  };

  handleDescriptionEdit = async (value) => {
    const previousDescription = this.state.task.description;
    const { updateTask } = useTaskStore.getState();

    this.setState((prev) => ({
      task: { ...prev.task, description: value },
    }));

    const result = await updateTask({ description: value }, this.state.task.id);

    if (!result || result.success === false) {
      this.setState((prev) => ({
        task: { ...prev.task, description: previousDescription },
      }));
      
      return;
    }

    if (result.data || result) {
      this.setState({ task: result.data || result });
    }
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
        {/* Toast Container to display errors */}
        <Toaster />

        <PanelContainer title="Overview">
          <div className="view-task__overview-header">
            <h2 className="view-task__title">{task.taskName}</h2>
          </div>

          <Label
            className="view-task__description"
            label={task.description || "No description provided."}
            value={task.description || ""}
            placeholder="Add a description..."
            onClick={this.handleDescriptionEdit}
          />

          {/* Dropdowns now directly below the description */}
          <div className="view-task__header-dropdowns">
            <div className={`view-task__status-dropdown view-task__status-dropdown--${statusColorGroup(task.status)}`}>
              <Dropdown
                options={STATUS_OPTIONS}
                value={toDisplayStatus(task.status)}
                onChange={this.handleStatusChange}
              />
            </div>

            <div className={`view-task__priority-dropdown view-task__priority-dropdown--${priorityColorGroup(task.priority)}`}>
              <Dropdown
                options={PRIORITY_OPTIONS}
                value={(task.priority || "LOW").toUpperCase()}
                onChange={this.handlePriorityChange}
              />
            </div>
          </div>

          <InputRow gap={16}>
            <PanelContainer title="Details">
              <div className="view-task__details-grid">
                <div className="view-task__assignee-row">
                  <span className="view-task__assignee-key">Assignee</span>
                  <UserHoverCard user={task.assignee}>
                    <Label
                      label={`${task.assignee?.username || "Unassigned"}`}
                      value={task.assignee?.email || ""}
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
              <div className="view-task__details-grid">
                <span className="view-task__assignee-key">
                  Project Name: {project.projectName?.toUpperCase() || "NO PROJECT ASSIGNED"}
                </span>
                <Label label={`Status: ${project.status || "N/A"}`} />
                <Label label={`Members: ${members.length}`} />
              </div>

              {members.length > 0 && (
                <div className="view-task__member-chips">
                  {members.map((m) => (
                    <UserHoverCard key={m.id} user={m}>
                      <span className="view-task__member-chip">
                        {m.username || m.email}
                      </span>
                    </UserHoverCard>
                  ))}
                </div>
              )}

              {project.projectName && (
                <button
                  type="button"
                  className="view-task__view-project-link"
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