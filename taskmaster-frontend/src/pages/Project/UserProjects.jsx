import React from "react";
import { Helmet } from "react-helmet-async";
import { PanelPage, PanelContainer } from "../../components/TRCOMPONENTS/TRPanelPage/TRPanelPage";
import { Table } from "../../components/TRCOMPONENTS/TRTable/TrTable";
import Button from "../../components/TRCOMPONENTS/TRButton/Button";
import { InputField } from "../../components/TRCOMPONENTS/TRInputField/InputFIeld";
import { useProjectStore } from "../../context/ProjectStore.js";
import "../../styles/pages/user-projects.scss";
import navigateTo from "../../lib/navigate";
import formatDate from "../../lib/formatDate";

class UserProjects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userProjects: useProjectStore.getState().userProjects || [],
      isLoading: useProjectStore.getState().isLoading,
      search: "",
    };
  }

  componentDidMount() {
    // Correctly subscribe to `userProjects` from ProjectStore
    this.unsubscribeProjects = useProjectStore.subscribe((state) => {
      this.setState({ 
        userProjects: state.userProjects || [], 
        isLoading: state.isLoading 
      });
    });

    // Fetch user-created projects on mount
    useProjectStore.getState().fetchUserCreatedProjects();
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
    const { userProjects, isLoading, search } = this.state;

    // Ensure userProjects is an array before mapping
    const projectsList = Array.isArray(userProjects) ? userProjects : [];

    const tableRows = projectsList.map((p) => ({
      "Project Name": p.projectName,
      Status: p.status,
      "Created By": p.createdBy?.username || "unknown",
      "Created On": formatDate(p.createdAt),
      Members: p.members?.length || 0,
    }));

    return (
      <PanelPage
        titlePage="Your Projects"
        subTitle="Every project you created."
      >
        <Helmet>
          <title>Your Projects | TaskMaster</title>
        </Helmet>

        <PanelContainer>
          <div className="user-projects-page__header">
            <InputField
              placeholder="Search projects"
              isSearch
              value={search}
              onChange={(value) => this.setState({ search: value })}
            />
            <Button
              text="+ NEW PROJECT"
              customWidth={160}
              className="user-projects-page__new-btn"
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

export default UserProjects;