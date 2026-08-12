import React from "react";
import { PanelPage, PanelContainer } from "../../components/TRCOMPONENTS/TRPanelPage/TRPanelPage";
import { InputField } from "../../components/TRCOMPONENTS/TRInputField/InputFIeld";
import Button from "../../components/TRCOMPONENTS/TRButton/Button";
import { useProjectStore } from "../../context/ProjectStore.js";
import { useSprintStore } from "../../context/SprintStore.js";
import navigateTo from "../../lib/navigate";
import "../../styles/pages/create-sprint.scss"; // Import SCSS

class CreateSprint extends React.Component {
  constructor(props) {
    super(props);
    
    const pathSegments = window.location.pathname.split("/").filter(Boolean);
    const projectId = pathSegments[pathSegments.length - 1];

    this.state = {
      sprintName: "",
      deadline: "",
      projectId: props.projectId || projectId,
      projectName: "",
      tasks: [],
      selectedTaskIds: [],
      isLoading: true,
      isSubmitting: false,
      error: null,
    };
  }

  componentDidMount() {
    this.loadProjectAndTasks();
  }

  loadProjectAndTasks = async () => {
    const { projectId } = this.state;
    if (!projectId) {
      this.setState({ isLoading: false, error: "Invalid Project ID." });
      return;
    }

    const { getProjectById } = useProjectStore.getState();
    const { project, tasks } = await getProjectById(projectId);

    this.setState({
      projectName: project?.projectName || "", 
      tasks: tasks || [],
      isLoading: false,
    });
  };

  goBack = () => {
    const { projectName } = this.state;
    if (projectName) {
      navigateTo(`/projects/${encodeURIComponent(projectName)}`);
    } else {
      window.history.back();
    }
  };

  handleTaskToggle = (taskId) => {
    this.setState((prevState) => {
      const exists = prevState.selectedTaskIds.includes(taskId);
      return {
        selectedTaskIds: exists
          ? prevState.selectedTaskIds.filter((id) => id !== taskId)
          : [...prevState.selectedTaskIds, taskId],
      };
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    if (!this.state.sprintName.trim()) {
      this.setState({ error: "Sprint name is required." });
      return;
    }

    this.setState({ isSubmitting: true, error: null });

    const deadlineTimestamp = this.state.deadline 
      ? new Date(this.state.deadline).getTime() 
      : null;

    const payload = {
      sprintName: this.state.sprintName.trim(),
      projectId: this.state.projectId,
      deadline: deadlineTimestamp,
      taskIds: this.state.selectedTaskIds,
    };

    try {
      const { createSprint } = useSprintStore.getState();

      if (typeof createSprint !== "function") {
        throw new Error("createSprint function is not defined on useSprintStore");
      }

      const res = await createSprint(payload);

      // Only redirect on success; stay on the page and display error if it fails
      if (res && res.success) {
        this.goBack();
      } else {
        this.setState({
          error: res?.error || "Failed to create sprint.",
          isSubmitting: false,
        });
      }
    } catch (err) {
      console.error("Error creating sprint:", err);
      this.setState({
        error: err.message || "Failed to create sprint. Please check store implementation.",
        isSubmitting: false,
      });
    }
  };

  render() {
    const { sprintName, deadline, projectName, projectId, tasks, selectedTaskIds, isLoading, isSubmitting, error } = this.state;
    const isSubmitDisabled = isSubmitting || !sprintName.trim();

    return (
      <PanelPage
        titlePage="Create Sprint"
        subTitle={projectName ? `Project: ${projectName}` : `Project ID: ${projectId}`}
      >
        <PanelContainer>
          {isLoading ? (
            <div className="create-sprint__loading">Loading project details and backlog...</div>
          ) : (
            <form className="create-sprint" onSubmit={this.handleSubmit}>
              {error && <div className="create-sprint__error">{error}</div>}

              {/* Sprint Name Input */}
              <div className="create-sprint__field">
                <label>
                  Sprint Name<span className="required">*</span>
                </label>
                <InputField
                  placeholder="e.g. Sprint 1 - Core Authentication"
                  text
                  value={sprintName}
                  onChange={(value) => this.setState({ sprintName: value })}
                />
              </div>

              {/* Deadline Input */}
              <div className="create-sprint__field">
                <label>Deadline</label>
                <input
                  type="date"
                  className="create-sprint__input-date"
                  value={deadline}
                  onChange={(e) => this.setState({ deadline: e.target.value })}
                />
              </div>

              {/* Select Tasks */}
              <div className="create-sprint__field">
                <label>Select Backlog Tasks</label>
                <span className="note">
                  Choose tasks from the current project backlog to assign to this sprint.
                </span>

                <div className="create-sprint__tasks-list">
                  {tasks.length === 0 ? (
                    <div className="create-sprint__empty-tasks">No backlog tasks available for this project.</div>
                  ) : (
                    tasks.map((task) => {
                      const taskId = task.id || task.taskId;
                      const taskTitle = task.title || task.taskName || task.name;
                      const priority = (task.priority || "").toLowerCase();
                      const isSelected = selectedTaskIds.includes(taskId);

                      return (
                        <div
                          key={taskId}
                          onClick={() => this.handleTaskToggle(taskId)}
                          className={`create-sprint__task-card ${isSelected ? "create-sprint__task-card--selected" : ""}`}
                        >
                          <div className="create-sprint__task-info">
                            <span className="title">{taskTitle}</span>
                            {task.priority && (
                              <span className={`priority priority--${priority}`}>
                                {task.priority}
                              </span>
                            )}
                          </div>
                          <input
                            type="checkbox"
                            className="create-sprint__checkbox"
                            checked={isSelected}
                            readOnly
                          />
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="create-sprint__actions">
                <Button
                  cancel
                  type="button"
                  text="CANCEL"
                  onClick={this.goBack}
                />
                <Button
                  submit
                  text={isSubmitting ? "CREATING..." : "CREATE SPRINT"}
                  disabled={isSubmitDisabled}
                />
              </div>
            </form>
          )}
        </PanelContainer>
      </PanelPage>
    );
  }
}

export default CreateSprint;