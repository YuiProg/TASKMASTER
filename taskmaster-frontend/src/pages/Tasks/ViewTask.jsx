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

// Display labels shown in the dropdown. Backend enum is assumed to be
// underscore-separated (e.g. IN_PROGRESS, QA_CHECK) — adjust the
// toBackendStatus/toDisplayStatus helpers below if the real values differ.
const STATUS_OPTIONS = ["OPEN", "IN PROGRESS", "QA CHECK", "DEPLOYED", "CLOSED"];

function toDisplayStatus(status) {
  if (!status) return "";
  return status.toUpperCase().replace(/[\s_-]+/g, " ").trim();
}


// OPEN stays the dropdown's normal/neutral color. IN_PROGRESS and QA_CHECK
// use blue, DEPLOYED and CLOSED use green — matching the blue/green already
// used elsewhere in the app (e.g. the Dashboard's donut legend).
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

function formatDate(rawDate) {
  if (!rawDate) return "N/A";
  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) return rawDate;
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

// Wraps a badge/chip so hovering it shows a small popover with an
// initials avatar + the user's email. Falls back to rendering the
// children plain (no hover card) if there's no user data to show.
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

  addComment = async (comment) => {
    const taskId = this.state.task.id;
    const { postComment } = useCommentStore.getState();
    postComment(comment, taskId);
  }

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
            <div className={`vt-status-dropdown vt-status-${statusColorGroup(task.status)}`}>
              <Dropdown
                options={STATUS_OPTIONS}
                value={toDisplayStatus(task.status)}
                onChange={this.handleStatusChange}
              />
            </div>
          </div>
          <p className="vt-description">
            {task.description || "No description provided."}
          </p>

        <InputRow gap={16}>
          <PanelContainer title="Details">
            <div className="vt-details-grid">
              <div className="vt-assignee-row">
                <span className="vt-assignee-key">Assignee</span>
                <UserHoverCard user={task.assignee}>
                  <span className="vt-assignee-badge">
                    {task.assignee?.username || "Unassigned"}
                  </span>
                </UserHoverCard>
              </div>
              <Label label={`Created By: ${task.createdBy?.username || "N/A"}`} />
              <Label label={`Created At: ${formatDate(task.createdAt)}`} />
              <Label label={`Updated By: ${task.updatedBy || "N/A"}`} />
            </div>
          </PanelContainer>

          <PanelContainer title="Project">
            <div className="vt-details-grid">
              <span className="vt-assignee-key">Project Name: {project.projectName.toUpperCase()}</span>
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

            <button
              type="button"
              className="vt-view-project-link"
              onClick={() => this.goToProject(project.projectName)}
            >
              View Project &rarr;
            </button>
          </PanelContainer>
        </InputRow>        
      </PanelContainer>

        <PanelContainer title="Activity Log">
          <TaskReports taskId={task.id} />
        </PanelContainer>
        <PanelContainer title="Comments">
          <TaskComments taskId={task.id} onAddComment={(e) => this.addComment(e)}/>
        </PanelContainer>

      </PanelPage>
      
    );
  }
}

export default ViewTask;