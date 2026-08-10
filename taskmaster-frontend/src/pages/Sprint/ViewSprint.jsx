import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSprintStore } from "../../context/SprintStore.js";
import { PanelPage, PanelContainer } from "../../components/TRCOMPONENTS/TRPanelPage/TRPanelPage";
import Spinner from "../../components/Spinner/Spinner.jsx";
import navigateTo from "../../lib/navigate";
import "../../styles/pages/view-sprint.scss";

const ViewSprint = () => {
  const { sprints, isLoading, error, fetchSprints } = useSprintStore();
  const [expandedSprintId, setExpandedSprintId] = useState(null);

  useEffect(() => {
    fetchSprints();
  }, [fetchSprints]);

  const toggleSprint = (e, id) => {
    e.stopPropagation(); // Prevents triggering card navigation when toggling dropdown
    setExpandedSprintId((prev) => (prev === id ? null : id));
  };

  const handleSprintNavigation = (sprintId) => {
    if (sprintId) {
      navigateTo(`/sprint/view/${sprintId}`);
    }
  };

  const handleTaskClick = (e, taskId) => {
    e.stopPropagation(); // Prevents parent card navigation
    if (taskId) {
      navigateTo(`/tasks/view/${taskId}`);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <PanelPage
      titlePage="Sprints Overview"
      subTitle={`${sprints?.length || 0} Active Sprints`}
    >
      <Helmet>
        <title>Sprints | TaskMaster</title>
      </Helmet>

      <PanelContainer>
        {isLoading ? (
          <div className="sprints-loading-container">
            <Spinner />
          </div>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : sprints.length === 0 ? (
          <div className="sprints-empty-state">
            <h3>No Sprints Found</h3>
            <p>You currently don't have any active sprints available.</p>
          </div>
        ) : (
          <div className="sprints-grid">
            {sprints.map((sprint) => {
              const sprintId = sprint.id || sprint._id;
              const isExpanded = expandedSprintId === sprintId;
              const taskCount = sprint.sprintTasks?.length || 0;
              const openTasks =
                sprint.sprintTasks?.filter((t) => t.status === "OPEN").length || 0;
              const isFinished = sprint.finished === 1;

              return (
                <div key={sprintId} className={`sprint-card ${isExpanded ? "expanded" : ""}`}>
                  {/* Clicking header or title navigates to SprintDetails page */}
                  <div 
                    className="sprint-card-header" 
                    onClick={() => handleSprintNavigation(sprintId)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="sprint-title-area">
                      <h3>{sprint.sprintName}</h3>
                      <span className="project-badge">{sprint.projectId?.projectName}</span>
                    </div>

                    <div className="sprint-meta-summary">
                      <span className="task-count-badge">
                        {taskCount} {taskCount === 1 ? "Task" : "Tasks"}
                      </span>
                      
                      {/* Sprint State Indicator */}
                      <span className={`status-pill ${isFinished ? "status-pill--finished" : "status-pill--ongoing"}`}>
                        {isFinished ? "Finished" : "Ongoing"}
                      </span>
                      
                      {/* Navigates directly to the detail page */}
                      <button 
                        className="toggle-btn" 
                        type="button" 
                        onClick={() => handleSprintNavigation(sprintId)}
                      >
                        View Details
                      </button>

                      {/* Optional toggle for expanding task preview without page redirect */}
                      <button 
                        className="toggle-btn toggle-btn--subtle" 
                        type="button" 
                        onClick={(e) => toggleSprint(e, sprintId)}
                      >
                        {isExpanded ? "Collapse" : "Expand Tasks"}
                      </button>
                    </div>
                  </div>

                  <div className="sprint-card-body">
                    <div className="info-row">
                      <div>
                        <label>Initiated By:</label>
                        <span>@{sprint.initiatedBy?.username}</span>
                      </div>
                      <div>
                        <label>Created On:</label>
                        <span>{formatDate(sprint.createdAt)}</span>
                      </div>
                      <div>
                        <label>Deadline:</label>
                        <span>{sprint.deadline ? formatDate(sprint.deadline) : "No deadline"}</span>
                      </div>
                    </div>

                    <div className="members-section">
                      <label>Sprint Members ({sprint.sprintMembers?.length || 0}):</label>
                      <div className="member-tags">
                        {sprint.sprintMembers?.map((member) => (
                          <span key={member.id || member._id} className="member-tag">
                            {member.username}
                          </span>
                        ))}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="tasks-section">
                        <h4>
                          Sprint Tasks ({taskCount})
                          {taskCount > 0 && <small> — {openTasks} Open</small>}
                        </h4>
                        {taskCount === 0 ? (
                          <p className="no-tasks">No tasks assigned to this sprint.</p>
                        ) : (
                          <div className="task-list">
                            {sprint.sprintTasks?.map((task) => (
                              <div
                                key={task.id || task._id}
                                className="task-item task-item--clickable"
                                onClick={(e) => handleTaskClick(e, task.id || task._id)}
                              >
                                <div className="task-info">
                                  <span className="task-name">{task.taskName}</span>
                                  <span className="task-assignee">
                                    Assigned: @{task.assignee?.username || "Unassigned"}
                                  </span>
                                </div>
                                <div className="task-badges">
                                  <span
                                    className={`priority-tag priority-${task.priority?.toLowerCase()}`}
                                  >
                                    {task.priority}
                                  </span>
                                  <span
                                    className={`status-tag status-${task.status?.toLowerCase()}`}
                                  >
                                    {task.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </PanelContainer>
    </PanelPage>
  );
};

export default ViewSprint;