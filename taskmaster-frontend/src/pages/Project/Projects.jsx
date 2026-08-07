import React from "react";
import { Helmet } from "react-helmet-async";
import { PanelPage, PanelContainer } from "../../components/TRCOMPONENTS/TRPanelPage/TRPanelPage";
import { Table } from "../../components/TRCOMPONENTS/TRTable/TrTable";
import Button from "../../components/TRCOMPONENTS/TRButton/Button";
import { InputField } from "../../components/TRCOMPONENTS/TRInputField/InputFIeld";
import { useProjectStore } from "../../context/ProjectStore.js";
import "./Projects.scss";
import navigateTo from "../../lib/navigate";
import formatDate from "../../lib/formatDate";

class Projects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: useProjectStore.getState().projects,
      isLoading: useProjectStore.getState().isLoading,
      search: "",
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
    navigateTo("/projects/new");
  };

  onRowSelect = (selectedRow) => {
    navigateTo(`/projects/${selectedRow["Project Name"]}`);
  };

  render() {
    const { projects, isLoading, search } = this.state;

    // Table headers are derived directly from these object keys, so keep
    // the keys human-readable — that's what shows up as column titles.
    const tableRows = projects.map((p) => ({
      "Project Name": p.projectName,
      Status: p.status,
      "Created By": p.createdBy?.username || "unknown",
      "Created On": formatDate(p.createdAt),
      Members: p.members?.length || 0,
    }));

    return (
      <PanelPage
        titlePage="Projects"
        subTitle="Every project your branch is currently tracking."
      >
        <Helmet>
          <title>Projects | TaskMaster</title>
        </Helmet>

        <PanelContainer>
          <div className="projects-page__header">
            <InputField
              placeholder="Search projects"
              isSearch
              value={search}
              onChange={(value) => this.setState({ search: value })}
            />
            <Button
              text="+ NEW PROJECT"
              customWidth={160}
              className="projects-page__new-btn"
              onClick={this.goToNewProject}
            />
          </div>

          <Table
            data={tableRows}
            search={search}
            isLoading={isLoading}
            hasSelect={true}
            hasAction={true}
            noEdit
            noDataMessage="No projects yet. Create your first one to get started."
            onDelete={() => {}}
            onEdit={() => {}}
            onView={() => {}}
            onRowSelect={(e) => this.onRowSelect(e)}
          />
        </PanelContainer>
      </PanelPage>
    );
  }
}

export default Projects;