import React from "react";
import { PanelPage, PanelContainer } from "../../components/TRCOMPONENTS/TRPanelPage/TRPanelPage";
import { Table } from "../../components/TRCOMPONENTS/TRTable/TrTable";
import Button from "../../components/TRCOMPONENTS/TRButton/Button";
import { InputField } from "../../components/TRCOMPONENTS/TRInputField/InputFIeld";
import { useTaskStore } from "../../context/TaskStore.js";
import "./MyTasks.scss";
import navigateTo from "../../lib/navigate";
import formatDate from "../../lib/formatDate";

class MyTasks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myTasks: useTaskStore.getState().myTasks,
      isLoading: useTaskStore.getState().isLoadingMyTasks,
      search: "",
    };
  }

  componentDidMount() {
    this.unsubscribeTasks = useTaskStore.subscribe((state) => {
      this.setState({ myTasks: state.myTasks, isLoading: state.isLoadingMyTasks });
    });

    useTaskStore.getState().fetchMyTasks();
  }

  componentWillUnmount() {
    if (this.unsubscribeTasks) this.unsubscribeTasks();
  }

  goToNewTask = () => {
    navigateTo("/tasks/new");
  };

  onRowSelect = (selectedRow) => {
    navigateTo(`/tasks/view/${selectedRow.id}`);
  };

  render() {
    const { myTasks, isLoading, search } = this.state;

    const tableRows = myTasks.map((t) => {
    const row = {
      "Task Name": t.taskName,
      Project: t.project?.projectName || "No project",
      Assignee: t.assignee?.username || "Unassigned",
      Status: t.status,
      Priority: t.priority || 'LOW',
      "REPORTER": t.createdBy?.username || "unknown",
      "Created On": formatDate(t.createdAt),
    };

      Object.defineProperty(row, "id", {
        value: t.id,
        enumerable: false,
        writable: false,
      });

      return row;
    });

    return (
      <PanelPage
        titlePage="My Tasks"
        subTitle="Tasks assigned to you."
      >
        <PanelContainer>
          <div className="tasks-page__header">
            <InputField
              placeholder="Search my tasks"
              isSearch
              value={search}
              onChange={(value) => this.setState({ search: value })}
            />
            <Button
              text="+ NEW TASK"
              customWidth={160}
              className="tasks-page__new-btn"
              onClick={this.goToNewTask}
            />
          </div>

          <Table
            data={tableRows}
            search={search}
            isLoading={isLoading}
            hasSelect={true}
            hasAction={true}
            noEdit
            noDataMessage="No tasks assigned to you yet."
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

export default MyTasks;