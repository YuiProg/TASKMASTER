import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PanelPage, PanelContainer } from "../../components/TRCOMPONENTS/TRPanelPage/TRPanelPage";
import Button from "../../components/TRCOMPONENTS/TRButton/Button";
import Spinner from "../../components/Spinner/Spinner.jsx";
import { useSprintStore } from "../../context/SprintStore.js";
import "../../styles/pages/sprint-details.scss";

const SprintDetails = ({ sprintId: propSprintId }) => {
  const { id: urlSprintId } = useParams();
  const navigate = useNavigate();
  const sprintId = propSprintId || urlSprintId;

  const [sprint, setSprint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!sprintId) {
        setIsLoading(false);
        setError("Invalid Sprint ID.");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const { getSprintById } = useSprintStore.getState();
        const res = await getSprintById(sprintId);
        const sprintData = res?.data || (res?.id ? res : null);

        if (sprintData) {
          setSprint(sprintData);
        } else {
          setError(res?.message || res?.error || "Sprint not found.");
        }
      } catch (err) {
        setError(err.message || "Failed to load sprint details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [sprintId]);

  const formatDate = (epochVal) => {
    if (!epochVal) return "N/A";
    const epochNum = Number(epochVal);
    if (isNaN(epochNum)) return "N/A";

    return new Date(epochNum).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleTaskClick = (taskId) => {
    if (taskId) navigate(`/tasks/view/${taskId}`);
  };

  const handleGoToProject = () => {
    const projectName = sprint?.projectId?.projectName || sprint?.project?.projectName;
    if (projectName) navigate(`/projects/${encodeURIComponent(projectName)}`);
  };

  const renderMembersList = (members = []) => {
    return (
      <div className="sprint-details__member-grid">
        {members.map((m, idx) => (
          <div className="sprint-details__member-card" key={m.id || idx}>
            <div className="sprint-details__member-info">
              <span className="sprint-details__member-name">{m.username || "N/A"}</span>
              <span className="sprint-details__member-email">{m.email || "N/A"}</span>
            </div>
            <div className="sprint-details__member-meta">
              <span className="sprint-details__member-role">{m.role || "MEMBER"}</span>
              <span className="sprint-details__member-branch">{m.branchLocation?.branchLocation || "N/A"}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTasksList = (tasks = []) => {
    return (
      <div className="sprint-details__task-list">
        {tasks.map((t, idx) => {
          const isCritical = ["HIGH", "CRITICAL", "URGENT"].includes(t.priority?.toUpperCase());
          const isOpen = t.status?.toUpperCase() === "OPEN" || t.status?.toUpperCase() === "TODO";

          return (
            <div
              key={t.id || idx}
              className="sprint-details__task-item"
              onClick={() => handleTaskClick(t.id)}
            >
              <div className="sprint-details__task-main">
                <span className="sprint-details__task-title">{t.taskName || "N/A"}</span>
                <p className="sprint-details__task-desc">{t.description || "No description provided."}</p>
                <div className="sprint-details__task-meta">
                  <span>Assignee: <strong>{t.assignee?.username || "Unassigned"}</strong></span>
                  <span>Created By: <strong>{t.createdBy?.username || "N/A"}</strong></span>
                </div>
              </div>

              <div className="sprint-details__task-badges">
                <span className={`priority-badge ${isCritical ? "priority-badge--critical" : "priority-badge--low"}`}>
                  {t.priority || "NORMAL"}
                </span>
                <span className={`status-pill ${isOpen ? "status-pill--open" : "status-pill--closed"}`}>
                  {t.status || "TODO"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

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
      <Helmet>
        <title>
          {sprint?.sprintName ? `${sprint.sprintName} | TaskMaster` : "Sprint Details | TaskMaster"}
        </title>
      </Helmet>

      <PanelContainer>
        {isLoading && (
          <div className="sprint-details__loading">
            <Spinner />
          </div>
        )}

        {error && !isLoading && (
          <div className="sprint-details__error">{error}</div>
        )}

        {!isLoading && !error && sprint && (
          <div className="sprint-details">
            {/* Overview Metadata Card */}
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
                <span className="value">
                  {initiatorName} ({sprint.initiatedBy?.email || "N/A"})
                </span>
              </div>

              <div className="sprint-details__meta-item">
                <span className="label">Created At</span>
                <span className="value">{formatDate(sprint.createdAt)}</span>
              </div>

              <div className="sprint-details__meta-item">
                <span className="label">Deadline</span>
                <span className="value">{formatDate(sprint.deadline)}</span>
              </div>

              <div className="sprint-details__meta-item sprint-details__meta-item--action">
                <Button
                  primary
                  type="button"
                  text="GO TO PROJECT"
                  onClick={handleGoToProject}
                />
              </div>
            </div>

            {/* Sprint Tasks Section */}
            <div className="sprint-details__section">
              <h3>Assigned Tasks ({taskList.length})</h3>
              {taskList.length === 0 ? (
                <div className="sprint-details__empty">No tasks assigned to this sprint.</div>
              ) : (
                renderTasksList(taskList)
              )}
            </div>

            {/* Sprint Members Section */}
            <div className="sprint-details__section">
              <h3>Sprint Members ({memberList.length})</h3>
              {memberList.length === 0 ? (
                <div className="sprint-details__empty">No members mapped to this sprint.</div>
              ) : (
                renderMembersList(memberList)
              )}
            </div>

            {/* Action Bar */}
            <div className="sprint-details__actions">
              <Button
                cancel
                type="button"
                text="BACK"
                onClick={() => navigate(-1)}
              />
            </div>
          </div>
        )}
      </PanelContainer>
    </PanelPage>
  );
};

export default SprintDetails;