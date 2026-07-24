import React from "react";
import { PanelPage, PanelContainer } from "../../components/TRCOMPONENTS/TRPanelPage/TRPanelPage";
import { InputField } from "../../components/TRCOMPONENTS/TRInputField/InputFIeld";
import Dropdown from "../../components/TRCOMPONENTS/TRDropDown/Dropdown";
import Button from "../../components/TRCOMPONENTS/TRButton/Button";
import { useTaskStore } from "../../context/taskStore";
import navigateTo from "../../lib/navigate";
import "./NewTask.css";

// Same status list used on ViewTask's dropdown, for consistency.
const STATUS_OPTIONS = ["OPEN", "IN PROGRESS", "QA CHECK", "DEPLOYED", "CLOSED"];

class NewTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskName: "",
      assignee: "",
      description: "",
      project: "",
      status: "OPEN",
      cameFromProject: false,
      isCreating: useTaskStore.getState().isCreating,
      error: useTaskStore.getState().error,
      localError: null,
    };
  }

  componentDidMount() {
    this.unsubscribeTasks = useTaskStore.subscribe((state) => {
      this.setState({ isCreating: state.isCreating, error: state.error });
    });

    // Pre-fill the project field if we arrived here via a
    // "Create Task" link from a specific project's page.
    const params = new URLSearchParams(window.location.search);
    const projectFromQuery = params.get("project");
    if (projectFromQuery) {
      this.setState({ project: projectFromQuery, cameFromProject: true });
    }
  }

  componentWillUnmount() {
    if (this.unsubscribeTasks) this.unsubscribeTasks();
  }

  goBack = () => {
    navigateTo("/tasks/my-tasks");
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    if (!this.state.taskName.trim()) {
      this.setState({ localError: "Task name is required." });
      return;
    }
    this.setState({ localError: null });

    const payload = {
      taskName: this.state.taskName.trim(),
      assignee: this.state.assignee.trim(),
      description: this.state.description.trim(),
      project: this.state.project.trim(),
      status: this.state.status,
    };

    const newTask = await useTaskStore.getState().createTask(payload);
    if (newTask) {
      if (this.state.cameFromProject && payload.project) {
        navigateTo(`/projects/${encodeURIComponent(payload.project)}`);
      } else {
        navigateTo("/tasks/my-tasks");
      }
    }
  };

  render() {
    const {
      taskName,
      assignee,
      description,
      project,
      status,
      isCreating,
      error,
      localError,
    } = this.state;

    return (
      <PanelPage
        titlePage="New Task"
        subTitle="Create a task and assign it to someone."
      >
        <PanelContainer>
          <form className="new-task-form" onSubmit={this.handleSubmit}>
            {(error || localError) && (
              <p className="new-task-error">{error || localError}</p>
            )}

            <div className="new-task-field">
              <label className="new-task-label">
                Task name<span className="new-task-required">*</span>
              </label>
              <InputField
                placeholder="e.g. Fix login redirect bug"
                text
                value={taskName}
                onChange={(value) => this.setState({ taskName: value })}
              />
            </div>

            <div className="new-task-field">
              <label className="new-task-label">Assignee</label>
              <InputField
                placeholder="Assignee's email"
                email
                value={assignee}
                onChange={(value) => this.setState({ assignee: value })}
              />
            </div>

            <div className="new-task-field">
              <label className="new-task-label">Project</label>
              <InputField
                placeholder="Project name"
                text
                value={project}
                onChange={(value) => this.setState({ project: value })}
              />
            </div>

            <div className="new-task-field">
              <label className="new-task-label">Status</label>
              <div className="new-task-status-dropdown">
                <Dropdown
                  options={STATUS_OPTIONS}
                  value={status}
                  onChange={(value) => this.setState({ status: value })}
                />
              </div>
            </div>

            <div className="new-task-field">
              <label className="new-task-label">Description</label>
              <textarea
                className="new-task-textarea"
                placeholder="What needs to be done?"
                value={description}
                onChange={(e) =>
                  this.setState({ description: e.target.value })
                }
                rows={4}
              />
            </div>

            <div className="new-task-actions">
              <Button cancel text="CANCEL" onClick={this.goBack} />
              <Button
                submit
                text={isCreating ? "CREATING..." : "CREATE TASK"}
                disabled={isCreating}
                className="new-task-submit-btn"
                onClick={() => {}}
              />
            </div>
          </form>
        </PanelContainer>
      </PanelPage>
    );
  }
}

export default NewTask;