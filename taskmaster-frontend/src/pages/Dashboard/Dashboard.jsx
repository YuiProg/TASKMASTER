import React from 'react';
import { PanelContainer, PanelPage } from '../../components/TRCOMPONENTS/TRPanelPage/TRPanelPage';
import { Table } from '../../components/TRCOMPONENTS/TRTable/TrTable';
import Button from '../../components/TRCOMPONENTS/TRButton/Button';
import { useProjectStore } from '../../context/projectStore';
import './Dashboard.css';
import formatDate from '../../lib/formatDate';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: useProjectStore.getState().projects,
      isLoading: useProjectStore.getState().isLoading,
    };
  }

  componentDidMount() {
    this.unsubscribeProjects = useProjectStore.subscribe((state) => {
      this.setState({ projects: state.projects, isLoading: state.isLoading });
    });

    useProjectStore.getState().fetchProjects();
  }

  componentWillUnmount() {
    if (this.unsubscribeProjects) this.unsubscribeProjects();
  }

  goToNewProject = () => {
    window.location.href = '/projects/new';
  };

  render() {
    const { projects, isLoading } = this.state;

    const ongoingCount = projects.filter((p) => p.status === 'ONGOING').length;
    const memberCount = projects.reduce(
      (total, p) => total + (p.members?.length || 0),
      0
    );

    // Table headers are derived directly from these object keys, so keep
    // the keys human-readable — that's what shows up as column titles.
    const tableRows = projects.slice(0, 5).map((p) => ({
      'Project Name': p.projectName,
      Status: p.status,
      'Created By': p.createdBy?.username || 'unknown',
      'Created On': formatDate(p.createdAt),
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
          </div>
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
            data={tableRows}
            isLoading={isLoading}
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