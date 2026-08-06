import React from "react";
import { PanelPage, PanelContainer } from "../../components/TRCOMPONENTS/TRPanelPage/TRPanelPage";
import Button from "../../components/TRCOMPONENTS/TRButton/Button";
import { Table } from "../../components/TRCOMPONENTS/TRTable/TrTable";
import { useSprintStore } from "../../context/SprintStore.js";
import navigateTo from "../../lib/navigate";
import "./SprintDetails.scss";

class SprintDetails extends React.Component {
  constructor(props) {
    super(props);

    const pathSegments = window.location.pathname.split("/").filter(Boolean);
    const sprintId = props.sprintId || pathSegments[pathSegments.length - 1];

    this.state = {
      sprintId,
      sprint: null,
      isLoading: true,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchDetails();
  }

  fetchDetails = async () => {
    const { sprintId } = this.state;
    if (!sprintId) {
      this.setState({ isLoading: false, error: "Invalid Sprint ID." });
      return;
    }

    try {
      this.setState({ isLoading: true, error: null });

      const { getSprintById } = useSprintStore.getState();
      const res = await getSprintById(sprintId);

      const sprintData = res?.data || (res?.id ? res : null);

      if (sprintData) {
        this.setState({ sprint: sprintData, isLoading: false });
      } else {
        this.setState({
          isLoading: false,
          error: res?.message || res?.error || "Sprint not found.",
        });
      }
    } catch (err) {
      this.setState({
        isLoading: false,
        error: err.message || "Failed to load sprint details.",
      });
    }
  };

  formatDate = (epochVal) => {
    if (!epochVal) return "N/A";
    const epochNum = Number(epochVal);
    if (isNaN(epochNum)) return "N/A";

    return new Date(epochNum).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  handleTaskClick = (taskId) => {
    if (taskId) {
      navigateTo(`/tasks/view/${taskId}`);
    }
  };

  handleGoToProject = () => {
    const { sprint } = this.state;
    const projectName = sprint?.projectId?.projectName || sprint?.project?.projectName;

    if (projectName) {
      navigateTo(`/projects/${encodeURIComponent(projectName)}`);
    }
  };

  renderMembersTable = (members = []) => {
    const data = members.map((m) => ({
      Username: m.username || "N/A",
      Email: m.email || "N/A",
      Role: m.role || "MEMBER",
      Branch: m.branchLocation?.branchLocation || "N/A"
    }));

    return <Table data={data} limit={5} />;
  };

  renderTasksTable = (tasks = []) => {
    const data = tasks.map((t) => {
      const row = {
        Task: t.taskName || "N/A",
        Priority: t.priority || "NORMAL",
        Status: t.status || "TODO",
        Assignee: t.assignee?.username || "Unassigned",
        CreatedBy: t.createdBy?.username || "N/A",
        Description: t.description || "N/A"
      };

      Object.defineProperty(row, "id", {
        value: t.id,
        enumerable: false,
        writable: false
      });

      return row;
    });

    return (
      <Table 
        data={data} 
        limit={10} 
        onRowSelect={(e) => this.handleTaskClick(e.id)} 
      />
    );
  };

  render() {
    const { sprint, isLoading, error } = this.state;

    const taskList = sprint?.sprintTasks || sprint?.tasks || [];
    const memberList = sprint?.sprintMembers || sprint?.projectId?.members || [];
    const projectName = sprint?.projectId?.projectName || "N/A";
    const initiatorName = sprint?.initiatedBy?.username || sprint?.updatedBy || "N/A";
    const isFinished = sprint?.finished === 1;

    return (
      <PanelPage
        titlePage={sprint ? `SPRINT: ${sprint.sprintName?.toUpperCase()}` : "Sprint Details"}
        subTitle={sprint ? `Sprint ID: ${sprint.id}` : ""}
      >
        <PanelContainer>
          {isLoading && (
            <div className="sprint-details__loading">Loading sprint details...</div>
          )}

          {error && !isLoading && (
            <div className="sprint-details__error">{error}</div>
          )}

          {!isLoading && !error && sprint && (
            <div className="sprint-details">
              
              {/* Top Overview Metadata */}
              <div className="sprint-details__overview">
                <div className="sprint-details__meta-item">
                  <span className="label">Project Name</span>
                  <span className="value font-bold">{projectName}</span>
                </div>

                <div className="sprint-details__meta-item">
                  <span className="label">Status</span>
                  <span className={`status-badge ${isFinished ? "status-badge--completed" : "status-badge--active"}`}>
                    {isFinished ? "FINISHED" : "ONGOING"}
                  </span>
                </div>

                <div className="sprint-details__meta-item">
                  <span className="label">Initiated By</span>
                  <span className="value">{initiatorName} ({sprint.initiatedBy?.email || "N/A"})</span>
                </div>

                <div className="sprint-details__meta-item">
                  <span className="label">Created At</span>
                  <span className="value">{this.formatDate(sprint.createdAt)}</span>
                </div>

                <div className="sprint-details__meta-item">
                  <span className="label">Deadline</span>
                  <span className="value">{this.formatDate(sprint.deadline)}</span>
                </div>

                <div className="sprint-details__meta-item sprint-details__meta-item--action">
                  <Button
                    primary
                    type="button"
                    text="GO TO PROJECT"
                    onClick={this.handleGoToProject}
                  />
                </div>
              </div>

              {/* Sprint Tasks Table */}
              <div className="sprint-details__section">
                <h3>Assigned Tasks ({taskList.length})</h3>
                {taskList.length === 0 ? (
                  <div className="sprint-details__empty">No tasks assigned to this sprint.</div>
                ) : (
                  this.renderTasksTable(taskList)
                )}
              </div>

              {/* Sprint Members Table */}
              <div className="sprint-details__section">
                <h3>Sprint Members ({memberList.length})</h3>
                {memberList.length === 0 ? (
                  <div className="sprint-details__empty">No members mapped to this sprint.</div>
                ) : (
                  this.renderMembersTable(memberList)
                )}
              </div>

              {/* Action Buttons */}
              <div className="sprint-details__actions">
                <Button
                  cancel
                  type="button"
                  text="BACK"
                  onClick={() => window.history.back()}
                />
              </div>

            </div>
          )}
        </PanelContainer>
      </PanelPage>
    );
  }
}

export default SprintDetails;