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
    e.stopPropagation();
    setExpandedSprintId((prev) => (prev === id ? null : id));
  };

  const handleSprintNavigation = (sprintId) => {
    if (sprintId) {
      navigateTo(`/sprint/view/${sprintId}`);
    }
  };

  const handleTaskClick = (e, taskId) => {
    e.stopPropagation();
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
          <div className="view-sprint__loading">
            <Spinner />
          </div>
        ) : error ? (
          <p className="view-sprint__error">{error}</p>
        ) : sprints?.length === 0 ? (
          <div className="view-sprint__empty">
            <h3>No Sprints Found</h3>
            <p>You currently don't have any active sprints available.</p>
          </div>
        ) : (
          <div className="view-sprint__grid">
            {sprints.map((sprint) => {
              const sprintId = sprint.id || sprint._id;
              const isExpanded = expandedSprintId === sprintId;
              const taskCount = sprint.sprintTasks?.length || 0;
              const openTasks =
                sprint.sprintTasks?.filter((t) => t.status === "OPEN").length || 0;
              const isFinished = sprint.finished === 1;

              return (
                <div
                  key={sprintId}
                  className={`view-sprint__card ${
                    isFinished ? "is-finished" : "is-ongoing"
                  } ${isExpanded ? "is-expanded" : ""}`}
                >
                  {/* Header Area */}
                  <div
                    className="view-sprint__card-header"
                    onClick={() => handleSprintNavigation(sprintId)}
                  >
                    <div className="view-sprint__title-group">
                      <h3 className="view-sprint__card-title">
                        {sprint.sprintName}
                      </h3>
                      {sprint.projectId?.projectName && (
                        <span className="view-sprint__project-tag">
                          {sprint.projectId.projectName}
                        </span>
                      )}
                    </div>

                    <div className="view-sprint__meta-summary">
                      <span className="view-sprint__task-count">
                        {taskCount} {taskCount === 1 ? "Task" : "Tasks"}
                      </span>

                      <span
                        className={`view-sprint__status-pill ${
                          isFinished
                            ? "view-sprint__status-pill--finished"
                            : "view-sprint__status-pill--ongoing"
                        }`}
                      >
                        {isFinished ? "Finished" : "Ongoing"}
                      </span>

                      <div className="view-sprint__actions">
                        <button
                          className="view-sprint__btn view-sprint__btn--primary"
                          type="button"
                          onClick={() => handleSprintNavigation(sprintId)}
                        >
                          View Details
                        </button>

                        <button
                          className="view-sprint__btn view-sprint__btn--ghost"
                          type="button"
                          onClick={(e) => toggleSprint(e, sprintId)}
                        >
                          {isExpanded ? "Collapse" : "Expand Tasks"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Body Area */}
                  <div className="view-sprint__card-body">
                    <div className="view-sprint__info-row">
                      <div className="view-sprint__info-item">
                        <label>Initiated By</label>
                        <span>@{sprint.initiatedBy?.username || "unknown"}</span>
                      </div>
                      <div className="view-sprint__info-item">
                        <label>Created On</label>
                        <span>{formatDate(sprint.createdAt)}</span>
                      </div>
                      <div className="view-sprint__info-item">
                        <label>Deadline</label>
                        <span>
                          {sprint.deadline
                            ? formatDate(sprint.deadline)
                            : "No deadline"}
                        </span>
                      </div>
                    </div>

                    {sprint.sprintMembers?.length > 0 && (
                      <div className="view-sprint__members-section">
                        <label>
                          Sprint Members ({sprint.sprintMembers.length}):
                        </label>
                        <div className="view-sprint__member-tags">
                          {sprint.sprintMembers.map((member) => (
                            <span
                              key={member.id || member._id}
                              className="view-sprint__member-tag"
                            >
                              @{member.username}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Expandable Task Section */}
                    {isExpanded && (
                      <div className="view-sprint__tasks-section">
                        <h4 className="view-sprint__tasks-heading">
                          Sprint Tasks ({taskCount})
                          {taskCount > 0 && <span> — {openTasks} Open</span>}
                        </h4>

                        {taskCount === 0 ? (
                          <p className="view-sprint__no-tasks">
                            No tasks assigned to this sprint.
                          </p>
                        ) : (
                          <div className="view-sprint__task-list">
                            {sprint.sprintTasks?.map((task) => {
                              const taskId = task.id || task._id;
                              const priorityClass = task.priority
                                ? `priority--${task.priority.toLowerCase()}`
                                : "";
                              const statusClass = task.status
                                ? `status--${task.status.toLowerCase()}`
                                : "";

                              return (
                                <div
                                  key={taskId}
                                  className="view-sprint__task-item"
                                  onClick={(e) => handleTaskClick(e, taskId)}
                                >
                                  <div className="view-sprint__task-info">
                                    <span className="view-sprint__task-name">
                                      {task.taskName}
                                    </span>
                                    <span className="view-sprint__task-assignee">
                                      Assigned: @
                                      {task.assignee?.username || "Unassigned"}
                                    </span>
                                  </div>

                                  <div className="view-sprint__task-badges">
                                    {task.priority && (
                                      <span
                                        className={`view-sprint__badge ${priorityClass}`}
                                      >
                                        {task.priority}
                                      </span>
                                    )}
                                    {task.status && (
                                      <span
                                        className={`view-sprint__badge ${statusClass}`}
                                      >
                                        {task.status}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
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