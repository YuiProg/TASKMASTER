import React from "react";
import { Helmet } from "react-helmet-async";
import { PanelPage, PanelContainer } from "../../components/TRCOMPONENTS/TRPanelPage/TRPanelPage";
import Button from "../../components/TRCOMPONENTS/TRButton/Button";
import { InputField } from "../../components/TRCOMPONENTS/TRInputField/InputFIeld";
import Spinner from "../../components/Spinner/Spinner";
import { useProjectStore } from "../../context/ProjectStore.js";
import { Plus, Users, Clock, ChevronLeft, ChevronRight, Hash, Layers } from "lucide-react";
import "../../styles/pages/projects.scss";
import navigateTo from "../../lib/navigate";
import formatDate from "../../lib/formatDate";

class Projects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: useProjectStore.getState().projects,
      isLoading: useProjectStore.getState().isLoading,
      search: "",
      currentPage: 1,
      itemsPerPage: 6,
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

  onProjectSelect = (projectName) => {
    navigateTo(`/projects/${projectName}`);
  };

  handleSearchChange = (e) => {
    const value = e?.target ? e.target.value : e;
    this.setState({ search: value || "", currentPage: 1 });
  };

  handlePageChange = (newPage) => {
    this.setState({ currentPage: newPage });
  };

  getFilteredProjects = () => {
    const { projects, search } = this.state;
    const query = search.toLowerCase();

    return projects.filter((p) => {
      return (
        p.projectName?.toLowerCase().includes(query) ||
        p.createdBy?.username?.toLowerCase().includes(query) ||
        p.status?.toLowerCase().includes(query)
      );
    });
  };

  renderPagination = (totalItems) => {
    const { currentPage, itemsPerPage } = this.state;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) return null;

    return (
      <div className="projects-page__pagination">
        <div className="projects-page__pagination-info">
          Showing <span>{(currentPage - 1) * itemsPerPage + 1}</span> -{" "}
          <span>{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{" "}
          <span>{totalItems}</span>
        </div>

        <div className="projects-page__pagination-nav">
          <button
            className="projects-page__page-arrow"
            disabled={currentPage === 1}
            onClick={() => this.handlePageChange(currentPage - 1)}
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`projects-page__page-pill ${
                currentPage === page ? "is-active" : ""
              }`}
              onClick={() => this.handlePageChange(page)}
            >
              {page}
            </button>
          ))}

          <button
            className="projects-page__page-arrow"
            disabled={currentPage === totalPages}
            onClick={() => this.handlePageChange(currentPage + 1)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  renderGrid = () => {
    const { isLoading, search, currentPage, itemsPerPage } = this.state;

    if (isLoading) {
      return (
        <div className="projects-page__loading">
          <Spinner size={32} strokeWidth={3} />
        </div>
      );
    }

    const filteredProjects = this.getFilteredProjects();

    if (filteredProjects.length === 0) {
      return (
        <div className="projects-page__empty">
          <p>{search ? `No projects matching "${search}"` : "No projects found."}</p>
        </div>
      );
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

    return (
      <>
        <div className="projects-page__grid">
          {paginated.map((p) => {
            const memberCount = p.members?.length || 0;
            const status = (p.status || "Active").toLowerCase();
            const creator = p.createdBy?.username || "Unknown";

            return (
              <div
                key={p.id || p.projectName}
                className="projects-page__module"
                onClick={() => this.onProjectSelect(p.projectName)}
              >
                <div className="projects-page__module-header">
                  <div className="projects-page__module-icon">
                    <Layers size={18} />
                  </div>
                  <span className={`projects-page__tag projects-page__tag--${status}`}>
                    {p.status || "Active"}
                  </span>
                </div>

                <div className="projects-page__module-content">
                  <h3 className="projects-page__module-title">{p.projectName}</h3>
                  <p className="projects-page__module-desc">
                    {p.description || "No project overview available."}
                  </p>
                </div>

                <div className="projects-page__module-footer">
                  <div className="projects-page__author">
                    <Hash size={13} />
                    <span>{creator}</span>
                  </div>

                  <div className="projects-page__metrics">
                    <span className="projects-page__metric" title="Total Members">
                      <Users size={13} />
                      {memberCount}
                    </span>
                    <span className="projects-page__metric" title="Created Date">
                      <Clock size={13} />
                      {formatDate(p.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {this.renderPagination(filteredProjects.length)}
      </>
    );
  };

  render() {
    const { search } = this.state;

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
              placeholder="Filter projects..."
              isSearch
              value={search}
              onChange={this.handleSearchChange}
            />
            <Button
              text={
                <span>
                  <Plus size={14} style={{ marginRight: 6 }} /> NEW PROJECT
                </span>
              }
              customWidth={160}
              className="projects-page__new-btn"
              onClick={this.goToNewProject}
            />
          </div>

          {this.renderGrid()}
        </PanelContainer>
      </PanelPage>
    );
  }
}

export default Projects;