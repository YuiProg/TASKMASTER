import React from "react";
import { Helmet } from "react-helmet-async";
import { PanelPage, PanelContainer } from "../../components/TRCOMPONENTS/TRPanelPage/TRPanelPage";
import Button from "../../components/TRCOMPONENTS/TRButton/Button";
import { InputField } from "../../components/TRCOMPONENTS/TRInputField/InputFIeld";
import Spinner from "../../components/Spinner/Spinner";
import { useTaskStore } from "../../context/TaskStore.js";
import {
  Plus,
  Clock,
  Folder,
  User,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  Bookmark,
} from "lucide-react";
import "../../styles/pages/my-tasks.scss";
import navigateTo from "../../lib/navigate";
import formatDate from "../../lib/formatDate";

class OpenTasks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openTasks: useTaskStore.getState().openTasks || [],
      isLoading: useTaskStore.getState().isLoadingMyTasks,
      search: "",
      currentPage: 1,
      itemsPerPage: 6,
    };
  }

  componentDidMount() {
    this.unsubscribeTasks = useTaskStore.subscribe((state) => {
      this.setState({
        openTasks: state.openTasks || [],
        isLoading: state.isLoadingMyTasks,
      });
    });

    useTaskStore.getState().fetchOpenTask();
  }

  componentWillUnmount() {
    if (this.unsubscribeTasks) this.unsubscribeTasks();
  }

  goToNewTask = () => {
    navigateTo("/tasks/new");
  };

  onTaskSelect = (taskId) => {
    navigateTo(`/tasks/view/${taskId}`);
  };

  handleSearchChange = (e) => {
    const value = e?.target ? e.target.value : e;
    this.setState({ search: value || "", currentPage: 1 });
  };

  handlePageChange = (newPage) => {
    this.setState({ currentPage: newPage });
  };

  getFilteredTasks = () => {
    const { openTasks, search } = this.state;
    const tasks = Array.isArray(openTasks) ? openTasks : [];
    const query = search.toLowerCase();

    return tasks.filter((t) => {
      return (
        t.taskName?.toLowerCase().includes(query) ||
        t.project?.projectName?.toLowerCase().includes(query) ||
        t.priority?.toLowerCase().includes(query) ||
        t.status?.toLowerCase().includes(query) ||
        t.assignee?.username?.toLowerCase().includes(query)
      );
    });
  };

  renderPriorityIcon = (priority) => {
    const level = (priority || "LOW").toUpperCase();
    if (level === "HIGH" || level === "URGENT") return <ShieldAlert size={13} className="icon-urgent" />;
    if (level === "MEDIUM") return <AlertTriangle size={13} className="icon-medium" />;
    return <CheckCircle2 size={13} className="icon-green" />;
  };

  renderPagination = (totalItems) => {
    const { currentPage, itemsPerPage } = this.state;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) return null;

    return (
      <div className="tasks-grid__pagination">
        <div className="tasks-grid__pagination-info">
          Showing <span>{(currentPage - 1) * itemsPerPage + 1}</span> -{" "}
          <span>{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{" "}
          <span>{totalItems}</span>
        </div>

        <div className="tasks-grid__pagination-nav">
          <button
            className="tasks-grid__page-arrow"
            disabled={currentPage === 1}
            onClick={() => this.handlePageChange(currentPage - 1)}
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`tasks-grid__page-pill ${currentPage === page ? "is-active" : ""}`}
              onClick={() => this.handlePageChange(page)}
            >
              {page}
            </button>
          ))}

          <button
            className="tasks-grid__page-arrow"
            disabled={currentPage === totalPages}
            onClick={() => this.handlePageChange(currentPage + 1)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  renderCards = () => {
    const { isLoading, search, currentPage, itemsPerPage } = this.state;

    if (isLoading) {
      return (
        <div className="tasks-grid__loading">
          <Spinner size={32} strokeWidth={3} />
        </div>
      );
    }

    const filtered = this.getFilteredTasks();

    if (filtered.length === 0) {
      return (
        <div className="tasks-grid__empty">
          <p>{search ? `No open tasks matching "${search}"` : "No open tasks available."}</p>
        </div>
      );
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

    return (
      <>
        <div className="tasks-grid__matrix">
          {paginated.map((t) => {
            const priority = (t.priority || "LOW").toLowerCase();
            const status = t.status || "Pending";
            const isDone = status.toUpperCase() === "DONE" || status.toUpperCase() === "COMPLETED";

            return (
              <div
                key={t.id}
                className={`tasks-grid__card border-priority--${priority} ${isDone ? "is-done" : ""}`}
                onClick={() => this.onTaskSelect(t.id)}
              >
                <div className="tasks-grid__card-top">
                  <span className="tasks-grid__project-tag">
                    <Folder size={12} />
                    {t.project?.projectName || "No project"}
                  </span>

                  <span className="tasks-grid__status-tag">
                    <Bookmark size={11} />
                    {status}
                  </span>
                </div>

                <div className="tasks-grid__card-body">
                  <h3 className="tasks-grid__title">{t.taskName}</h3>
                  <ArrowUpRight size={16} className="tasks-grid__hover-arrow" />
                </div>

                <div className="tasks-grid__card-footer">
                  <div className="tasks-grid__priority-indicator">
                    {this.renderPriorityIcon(t.priority)}
                    <span>{t.priority || "LOW"}</span>
                  </div>

                  <div className="tasks-grid__meta-group">
                    <span className="tasks-grid__meta" title="Assignee / Reporter">
                      <User size={12} />
                      {t.assignee?.username || t.createdBy?.username || "Unassigned"}
                    </span>
                    <span className="tasks-grid__meta" title="Created Date">
                      <Clock size={12} />
                      {formatDate(t.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {this.renderPagination(filtered.length)}
      </>
    );
  };

  render() {
    const { search } = this.state;

    return (
      <PanelPage titlePage="Open Tasks" subTitle="Open and Unassigned tasks.">
        <Helmet>
          <title>Open Tasks | TaskMaster</title>
        </Helmet>

        <PanelContainer>
          <div className="tasks-grid__header">
            <InputField
              placeholder="Search open tasks..."
              isSearch
              value={search}
              onChange={this.handleSearchChange}
            />

            <Button
              text={
                <span>
                  <Plus size={14} style={{ marginRight: 6 }} /> NEW TASK
                </span>
              }
              customWidth={150}
              className="tasks-grid__new-btn"
              onClick={this.goToNewTask}
            />
          </div>

          {this.renderCards()}
        </PanelContainer>
      </PanelPage>
    );
  }
}

export default OpenTasks;