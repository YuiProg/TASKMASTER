import React from 'react';
import { PanelContainer, PanelPage } from '../../components/TRCOMPONENTS/TRPanelPage/TRPanelPage';
import { Table } from '../../components/TRCOMPONENTS/TRTable/TrTable';
import Button from '../../components/TRCOMPONENTS/TRButton/Button';
import { useProjectStore } from '../../context/projectStore';
import { useTaskStore } from '../../context/taskStore';
import './Dashboard.css';
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
    };
  }

  componentDidMount() {
    this.unsubscribeProjects = useProjectStore.subscribe((state) => {
      this.setState({ projects: state.projects, isLoadingProjects: state.isLoading });
    });
    this.unsubscribeTasks = useTaskStore.subscribe((state) => {
      this.setState({ tasks: state.tasks, isLoadingTasks: state.isLoading });
    });

    useProjectStore.getState().fetchProjects();
    useTaskStore.getState().fetchTasks();
  }

  componentWillUnmount() {
    if (this.unsubscribeProjects) this.unsubscribeProjects();
    if (this.unsubscribeTasks) this.unsubscribeTasks();
  }

  goToNewProject = () => {
    navigateTo('/projects/new');
  };

  goToNewTask = () => {
    navigateTo('/tasks/new');
  };

  render() {
    const { projects, isLoadingProjects, tasks, isLoadingTasks } = this.state;

    const ongoingCount = projects.filter((p) => p.status === 'ONGOING').length;
    const memberCount = projects.reduce(
      (total, p) => total + (p.members?.length || 0),
      0
    );
    const openTaskCount = tasks.filter((t) => t.status === 'OPEN').length;

    // Table headers are derived directly from these object keys, so keep
    // the keys human-readable — that's what shows up as column titles.
    const projectRows = projects.slice(0, 5).map((p) => ({
      'Project Name': p.projectName,
      Status: p.status,
      'Created By': p.createdBy?.username || 'unknown',
      'Created On': formatDate(p.createdAt),
    }));

    const taskRows = tasks.slice(0, 5).map((t) => ({
      'Task Name': t.taskName,
      Project: t.project?.projectName || 'No project',
      Assignee: t.assignee?.username || 'Unassigned',
      Status: t.status,
      'Created On': formatDate(t.createdAt),
    }));

    return (
      <PanelPage titlePage="Dashboard" subTitle="Welcome to TaskMaster!">
        <PanelContainer>
          <div className="dash-stats-row">
            <div className="dash-stat-card">
              <span className="dash-stat-label">Total Projects</span>
              <h2 className="dash-stat-value">{projects.length}</h2>
            </div>
            <div className="dash-stat-card">
              <span className="dash-stat-label">Ongoing</span>
              <h2 className="dash-stat-value dash-stat-accent">{ongoingCount}</h2>
            </div>
            <div className="dash-stat-card">
              <span className="dash-stat-label">Total Members</span>
              <h2 className="dash-stat-value">{memberCount}</h2>
            </div>
            <div className="dash-stat-card">
              <span className="dash-stat-label">Open Tasks</span>
              <h2 className="dash-stat-value dash-stat-accent">{openTaskCount}</h2>
            </div>
          </div>
        </PanelContainer>

        <PanelContainer title="Recent Open Tasks">
          <div className="dash-table-header">
            <p className="dash-table-hint">Recently assigned tasks.</p>
            <Button
              text="+ NEW TASK"
              customWidth={160}
              className="dash-new-task-btn"
              onClick={this.goToNewTask}
            />
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
            onRowSelect={() => {}}
          />
        </PanelContainer>

        <PanelContainer title="Recent Projects">
          <div className="dash-table-header">
            <p className="dash-table-hint">Your five most recently created projects.</p>
            <Button
              text="+ NEW PROJECT"
              customWidth={160}
              className="dash-new-project-btn"
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
            onRowSelect={() => {}}
          />
        </PanelContainer>
      </PanelPage>
    );
  }
}

export default Dashboard;