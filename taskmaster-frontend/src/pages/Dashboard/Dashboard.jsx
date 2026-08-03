import React from 'react';
import { PanelContainer, PanelPage } from '../../components/TRCOMPONENTS/TRPanelPage/TRPanelPage';
import { Table } from '../../components/TRCOMPONENTS/TRTable/TrTable';
import Button from '../../components/TRCOMPONENTS/TRButton/Button';
import { useProjectStore } from '../../context/ProjectStore.js';
import { useTaskStore } from '../../context/TaskStore.js';
import { useAuthStore } from '../../context/AuthStore.js';
import './Dashboard.scss';
import formatDate from '../../lib/formatDate';
import navigateTo from '../../lib/navigate';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: useProjectStore.getState().projects,
      isLoadingProjects: useProjectStore.getState().isLoading,
      tasks: useTaskStore.getState().tasks,
      isLoadingTasks: useTaskStore.getState().isLoading,
      myTasks: useTaskStore.getState().myTasks,
      isLoadingMyTasks: useTaskStore.getState().isLoadingMyTasks,
      user: useAuthStore.getState().user,
    };
  }

  componentDidMount() {
    this.unsubscribeProjects = useProjectStore.subscribe((state) => {
      this.setState({ projects: state.projects, isLoadingProjects: state.isLoading });
    });
    this.unsubscribeTasks = useTaskStore.subscribe((state) => {
      this.setState({
        tasks: state.tasks,
        isLoadingTasks: state.isLoading,
        myTasks: state.myTasks,
        isLoadingMyTasks: state.isLoadingMyTasks,
      });
    });
    this.unsubscribeAuth = useAuthStore.subscribe((state) => {
      this.setState({ user: state.user });
    });

    // Fetch store endpoints
    useProjectStore.getState().fetchProjects();
    useTaskStore.getState().fetchTasks();
    useTaskStore.getState().fetchMyTasks();
  }

  componentWillUnmount() {
    if (this.unsubscribeProjects) this.unsubscribeProjects();
    if (this.unsubscribeTasks) this.unsubscribeTasks();
    if (this.unsubscribeAuth) this.unsubscribeAuth();
  }

  goToNewProject = () => {
    navigateTo('/projects/new');
  };

  goToNewTask = () => {
    navigateTo('/tasks/new');
  };

  goToMyTasks = () => {
    navigateTo('/tasks/my-tasks');
  };

  goToProject = (selected) => {
    navigateTo(`/projects/${selected["Project Name"]}`);
  };

  goToTask = (selected) => {
    navigateTo(`/tasks/view/${selected.id}`);
  };

  // Helper to format task object into a table row format
  formatTaskRow = (t) => {
    const row = {
      'Task Name': t.taskName,
      Project: t.project?.projectName || 'No project',
      Assignee: t.assignee?.username || 'Unassigned',
      Status: t.status,
      Priority: t.priority || 'LOW',
      'Created On': formatDate(t.createdAt),
    };

    Object.defineProperty(row, 'id', {
      value: t.id,
      enumerable: false,
      writable: false,
    });

    return row;
  };

  render() {
    const {
      projects,
      isLoadingProjects,
      tasks,
      isLoadingTasks,
      myTasks,
      isLoadingMyTasks,
      user,
    } = this.state;

    const ongoingCount = projects.filter((p) => p.status === 'ONGOING').length;
    const openTaskCount = tasks.filter((t) => t.status === 'OPEN').length;

    // Display ALL assigned tasks (no slicing)
    const myTaskRows = myTasks.map(this.formatTaskRow);

    const projectRows = projects.slice(0, 5).map((p) => {
      const row = {
        'Project Name': p.projectName,
        Status: p.status,
        'Created By': p.createdBy?.username || 'unknown',
        'Created On': formatDate(p.createdAt),
      };

      Object.defineProperty(row, 'id', {
        value: p.id,
        enumerable: false,
        writable: false,
      });
      return row;
    });

    const taskRows = tasks.slice(0, 5).map(this.formatTaskRow);

    return (
      <PanelPage titlePage="Dashboard" subTitle="Welcome to TaskMaster!">
        {/* Stats Row */}
        <PanelContainer>
          <div className="dashboard__stats-row">
            <div className="dashboard__stat-card">
              <span className="dashboard__stat-label">Total Projects</span>
              <h2 className="dashboard__stat-value">{projects.length}</h2>
            </div>
            <div className="dashboard__stat-card">
              <span className="dashboard__stat-label">Ongoing Projects</span>
              <h2 className="dashboard__stat-value dashboard__stat-value--accent">{ongoingCount}</h2>
            </div>

            {/* Clickable Assigned To Me Box */}
            <div
              className="dashboard__stat-card"
              onClick={this.goToMyTasks}
              style={{ cursor: 'pointer' }}
              title="Click to view all assigned tasks"
            >
              <span className="dashboard__stat-label">Assigned To Me</span>
              <h2 className="dashboard__stat-value dashboard__stat-value--accent">{myTasks.length}</h2>
            </div>

            <div className="dashboard__stat-card">
              <span className="dashboard__stat-label">Total Open Tasks</span>
              <h2 className="dashboard__stat-value">{openTaskCount}</h2>
            </div>
          </div>
        </PanelContainer>

        {/* My Assigned Tasks Container (Shows ALL tasks) */}
        <PanelContainer title="My Assigned Tasks">
          <div className="dashboard__table-header">
            <p className="dashboard__table-hint">
              Tasks assigned directly to {user?.username || 'you'} ({myTasks.length} total assigned).
            </p>
            <Button
              text="+ NEW TASK"
              customWidth={160}
              className="dashboard__new-task-btn"
              onClick={this.goToNewTask}
            />
          </div>

          <Table
            data={myTaskRows}
            isLoading={isLoadingMyTasks}
            hasSelect={false}
            hasAction={false}
            noEdit
            noDataMessage="No tasks currently assigned to you."
            onDelete={() => {}}
            onEdit={() => {}}
            onView={() => {}}
            onRowSelect={(e) => this.goToTask(e)}
          />
        </PanelContainer>

        {/* All Recent Open Tasks */}
        <PanelContainer title="Recent Open Tasks">
          <div className="dashboard__table-header">
            <p className="dashboard__table-hint">Recently created tasks across all projects.</p>
          </div>

          <Table
            data={taskRows}
            isLoading={isLoadingTasks}
            hasSelect={false}
            hasAction={false}
            noEdit
            noDataMessage="No open tasks. Create one to get started."
            onDelete={() => {}}
            onEdit={() => {}}
            onView={() => {}}
            onRowSelect={(e) => this.goToTask(e)}
          />
        </PanelContainer>

        {/* Recent Projects */}
        <PanelContainer title="Recent Projects">
          <div className="dashboard__table-header">
            <p className="dashboard__table-hint">Your five most recently created projects.</p>
            <Button
              text="+ NEW PROJECT"
              customWidth={160}
              className="dashboard__new-project-btn"
              onClick={this.goToNewProject}
            />
          </div>

          <Table
            data={projectRows}
            isLoading={isLoadingProjects}
            hasSelect={false}
            hasAction={false}
            noEdit
            noDataMessage="No projects yet. Create your first one to get started."
            onDelete={() => {}}
            onEdit={() => {}}
            onView={() => {}}
            onRowSelect={(e) => this.goToProject(e)}
          />
        </PanelContainer>
      </PanelPage>
    );
  }
}

export default Dashboard;