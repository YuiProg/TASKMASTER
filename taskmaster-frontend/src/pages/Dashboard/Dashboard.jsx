import React from 'react';
import { Helmet } from 'react-helmet-async';

import {
  PanelContainer,
  PanelPage
} from '../../components/TRCOMPONENTS/TRPanelPage/TRPanelPage';

import Button from '../../components/TRCOMPONENTS/TRButton/Button';
import Spinner from '../../components/Spinner/Spinner';

import { useProjectStore } from '../../context/ProjectStore.js';
import { useTaskStore } from '../../context/TaskStore.js';
import { useAuthStore } from '../../context/AuthStore.js';

import {
  UserCheck,
  UserX,
  FolderDot,
  CalendarDays,
  Activity,
  ChevronRight,
  Flag,
  ListTodo
} from 'lucide-react';

import '../../styles/pages/dashboard.scss';

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

      user: useAuthStore.getState().user
    };
  }


  /* =======================================================
     LIFECYCLE
     ======================================================= */

  componentDidMount() {

    this.unsubscribeProjects = useProjectStore.subscribe((state) => {
      this.setState({
        projects: state.projects,
        isLoadingProjects: state.isLoading
      });
    });


    this.unsubscribeTasks = useTaskStore.subscribe((state) => {
      this.setState({
        tasks: state.tasks,
        isLoadingTasks: state.isLoading,
        myTasks: state.myTasks,
        isLoadingMyTasks: state.isLoadingMyTasks
      });
    });


    this.unsubscribeAuth = useAuthStore.subscribe((state) => {
      this.setState({
        user: state.user
      });
    });


    useProjectStore.getState().fetchProjects();
    useTaskStore.getState().fetchTasks();
    useTaskStore.getState().fetchMyTasks();
  }


  componentWillUnmount() {

    if (this.unsubscribeProjects) {
      this.unsubscribeProjects();
    }

    if (this.unsubscribeTasks) {
      this.unsubscribeTasks();
    }

    if (this.unsubscribeAuth) {
      this.unsubscribeAuth();
    }
  }


  /* =======================================================
     NAVIGATION
     ======================================================= */

  goToProjects = () => {
    navigateTo('/projects');
  };


  goToNewProject = () => {
    navigateTo('/projects/new');
  };


  goToNewTask = () => {
    navigateTo('/tasks/new');
  };


  goToMyTasks = () => {
    navigateTo('/tasks/my-tasks');
  };


  goToOpenTasks = () => {
    navigateTo('/tasks/open-tasks');
  };


  goToProjectDetail = (projectName) => {
    navigateTo(`/projects/${projectName}`);
  };


  goToTask = (taskId) => {
    navigateTo(`/tasks/view/${taskId}`);
  };


  /* =======================================================
     ASSIGNEE
     ======================================================= */

  renderAssigneePill = (assigneeName) => {

    if (assigneeName) {
      return (
        <div className="dash-list-card__assignee dash-list-card__assignee--active">
          <UserCheck size={15} />

          <span>
            {assigneeName}
          </span>
        </div>
      );
    }


    return (
      <div className="dash-list-card__assignee dash-list-card__assignee--unassigned">
        <UserX size={15} />

        <span>
          Unassigned
        </span>
      </div>
    );
  };


  /* =======================================================
     TASK ROWS
     ======================================================= */

  renderTaskRowCards = (taskList, isLoading, emptyMessage) => {

    if (isLoading) {
      return (
        <div className="dash-loading">
          <Spinner
            size={28}
            strokeWidth={3}
          />
        </div>
      );
    }


    if (!taskList || taskList.length === 0) {
      return (
        <div className="dash-empty">
          {emptyMessage}
        </div>
      );
    }


    return (
      <div className="dash-list">

        {taskList.map((t) => (

          <div
            key={t.id}
            className="dash-list-card"
            onClick={() => this.goToTask(t.id)}
          >

            {/* Accent */}
            <div className="dash-list-card__accent-bar"></div>


            {/* Icon */}
            <div className="dash-list-card__icon">
              <ListTodo size={30} />
            </div>


            {/* Main Content */}
            <div className="dash-list-card__content">

              <div className="dash-list-card__header">

                <h4 className="dash-list-card__title">
                  {t.taskName}
                </h4>

                <span className="dash-list-card__status">
                  {t.status || 'OPEN'}
                </span>

              </div>


              <div className="dash-list-card__meta">

                <div className="dash-list-card__info-group">
                  <FolderDot size={15} />

                  <span>
                    {t.project?.projectName || 'No Project'}
                  </span>
                </div>


                <span className="dash-list-card__meta-divider">
                  •
                </span>


                <div className="dash-list-card__info-group">
                  <Flag size={15} />

                  <span>
                    {t.priority || 'LOW'}
                  </span>
                </div>


                <span className="dash-list-card__meta-divider">
                  •
                </span>


                <div className="dash-list-card__info-group">
                  <CalendarDays size={15} />

                  <span>
                    {formatDate(t.createdAt)}
                  </span>
                </div>

              </div>

            </div>


            {/* Actions */}
            <div className="dash-list-card__actions">

              {this.renderAssigneePill(
                t.assignee?.username
              )}

              <ChevronRight
                size={20}
                className="dash-list-card__arrow"
              />

            </div>

          </div>

        ))}

      </div>
    );
  };


  /* =======================================================
     PROJECT ROWS
     ======================================================= */

  renderProjectRowCards = () => {

    const {
      projects,
      isLoadingProjects
    } = this.state;


    if (isLoadingProjects) {
      return (
        <div className="dash-loading">
          <Spinner
            size={28}
            strokeWidth={3}
          />
        </div>
      );
    }


    const recentProjects = projects.slice(0, 5);


    if (recentProjects.length === 0) {
      return (
        <div className="dash-empty">
          No projects yet. Create your first one to get started.
        </div>
      );
    }


    return (
      <div className="dash-list">

        {recentProjects.map((p) => (

          <div
            key={p.id}
            className="dash-list-card"
            onClick={() =>
              this.goToProjectDetail(p.projectName)
            }
          >

            {/* Accent */}
            <div className="dash-list-card__accent-bar"></div>


            {/* Project Icon */}
            <div className="dash-list-card__icon">
              <FolderDot size={32} />
            </div>


            {/* Project Content */}
            <div className="dash-list-card__content">

              <div className="dash-list-card__header">

                <h4 className="dash-list-card__title">
                  {p.projectName}
                </h4>

                <span className="dash-list-card__status">
                  {p.status || 'ONGOING'}
                </span>

              </div>


              <div className="dash-list-card__meta">

                <div className="dash-list-card__info-group">

                  <UserCheck size={15} />

                  <span>
                    Created by{' '}
                    {p.createdBy?.username || 'unknown'}
                  </span>

                </div>


                <span className="dash-list-card__meta-divider">
                  •
                </span>


                <div className="dash-list-card__info-group">

                  <CalendarDays size={15} />

                  <span>
                    {formatDate(p.createdAt)}
                  </span>

                </div>

              </div>

            </div>


            {/* Arrow */}
            <div className="dash-list-card__actions">

              <ChevronRight
                size={22}
                className="dash-list-card__arrow"
              />

            </div>

          </div>

        ))}

      </div>
    );
  };


  /* =======================================================
     RENDER
     ======================================================= */

  render() {

    const {
      projects,
      tasks,
      myTasks,
      isLoadingMyTasks,
      isLoadingTasks,
      user
    } = this.state;


    const ongoingCount =
      projects.filter(
        (p) => p.status === 'ONGOING'
      ).length;


    const openTaskCount =
      tasks.filter(
        (t) => t.status === 'OPEN'
      ).length;


    return (

      <PanelPage
        titlePage="Dashboard"
        subTitle="Welcome to TaskMaster!"
      >

        <Helmet>
          <title>
            Dashboard | TaskMaster
          </title>
        </Helmet>


        {/* =================================================
            STATS
            ================================================= */}

        <PanelContainer>

          <div className="dash-stats">


            {/* Total Projects */}

            <div
              className="dash-stat-card dash-stat-card--interactive dash-stat-card--highlight"
              onClick={this.goToProjects}
              title="Click to view all projects"
            >

              <div className="dash-stat-card__icon">
                <FolderDot size={20} />
              </div>

              <div className="dash-stat-card__data">

                <span className="dash-stat-card__label">
                  Total Projects
                </span>

                <h2 className="dash-stat-card__value">
                  {projects.length}
                </h2>

              </div>

            </div>


            {/* Ongoing Projects */}

            <div
              className="dash-stat-card dash-stat-card--interactive dash-stat-card--highlight"
              onClick={this.goToProjects}
              title="Click to view ongoing projects"
            >

              <div className="dash-stat-card__icon">
                <Activity size={20} />
              </div>

              <div className="dash-stat-card__data">

                <span className="dash-stat-card__label">
                  Ongoing Projects
                </span>

                <h2 className="dash-stat-card__value">
                  {ongoingCount}
                </h2>

              </div>

            </div>


            {/* Assigned To Me */}

            <div
              className="dash-stat-card dash-stat-card--interactive dash-stat-card--highlight"
              onClick={this.goToMyTasks}
              title="Click to view my tasks"
            >

              <div className="dash-stat-card__icon">
                <UserCheck size={20} />
              </div>

              <div className="dash-stat-card__data">

                <span className="dash-stat-card__label">
                  Assigned To Me
                </span>

                <h2 className="dash-stat-card__value">
                  {myTasks.length}
                </h2>

              </div>

            </div>


            {/* Open Tasks */}

            <div
              className="dash-stat-card dash-stat-card--interactive dash-stat-card--highlight"
              onClick={this.goToOpenTasks}
              title="Click to view all open tasks"
            >

              <div className="dash-stat-card__icon">
                <Flag size={20} />
              </div>

              <div className="dash-stat-card__data">

                <span className="dash-stat-card__label">
                  Total Open Tasks
                </span>

                <h2 className="dash-stat-card__value">
                  {openTaskCount}
                </h2>

              </div>

            </div>

          </div>

        </PanelContainer>


        {/* =================================================
            MY ASSIGNED TASKS
            ================================================= */}

        <PanelContainer title="My Assigned Tasks">

          <div className="dash-section-header">

            <p className="dash-section-hint">
              Tasks assigned directly to{' '}
              {user?.username || 'you'}{' '}
              ({myTasks.length} total).
            </p>


            <Button
              text="+ NEW TASK"
              customWidth={140}
              className="dash-btn"
              onClick={this.goToNewTask}
            />

          </div>


          {this.renderTaskRowCards(
            myTasks,
            isLoadingMyTasks,
            "No tasks currently assigned to you."
          )}

        </PanelContainer>


        {/* =================================================
            RECENT OPEN TASKS
            ================================================= */}

        <PanelContainer title="Recent Open Tasks">

          <div className="dash-section-header">

            <p className="dash-section-hint">
              Five most recently created tasks across all projects.
            </p>


            <Button
              text="VIEW ALL OPEN"
              customWidth={150}
              className="dash-btn"
              onClick={this.goToOpenTasks}
            />

          </div>


          {this.renderTaskRowCards(
            tasks.slice(0, 5),
            isLoadingTasks,
            "No open tasks available."
          )}

        </PanelContainer>


        {/* =================================================
            RECENT PROJECTS
            ================================================= */}

        <PanelContainer title="Recent Projects">

          <div className="dash-section-header">

            <p className="dash-section-hint">
              Your most recently created projects.
            </p>


            <div className="dash-section-actions">

              <Button
                text="ALL PROJECTS"
                customWidth={140}
                className="dash-btn"
                onClick={this.goToProjects}
              />

              <Button
                text="+ NEW PROJECT"
                customWidth={150}
                className="dash-btn"
                onClick={this.goToNewProject}
              />

            </div>

          </div>


          {this.renderProjectRowCards()}

        </PanelContainer>

      </PanelPage>
    );
  }
}


export default Dashboard;