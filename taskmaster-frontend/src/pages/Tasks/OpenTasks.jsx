import React from "react";
import { PanelPage, PanelContainer } from "../../components/TRCOMPONENTS/TRPanelPage/TRPanelPage";
import { Table } from "../../components/TRCOMPONENTS/TRTable/TrTable";
import Button from "../../components/TRCOMPONENTS/TRButton/Button";
import { InputField } from "../../components/TRCOMPONENTS/TRInputField/InputFIeld";
import { useTaskStore } from "../../context/taskStore";
import "./MyTasks.css";
import navigateTo from "../../lib/navigate";
import formatDate from "../../lib/formatDate";

class OpenTasks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openTasks: useTaskStore.getState().openTasks,
      isLoading: useTaskStore.getState().isLoadingMyTasks,
      search: "",
    };
  }

  componentDidMount() {
    this.unsubscribeTasks = useTaskStore.subscribe((state) => {
      this.setState({ openTasks: state.openTasks, isLoading: state.isLoadingMyTasks });
    });

    useTaskStore.getState().fetchOpenTask();
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
    const { openTasks, isLoading, search } = this.state;

    const tableRows = openTasks.map((t) => {
    const row = {
      "Task Name": t.taskName,
      Project: t.project?.projectName || "No project",
      Assignee: t.assignee?.username || "Unassigned",
      Status: t.status,
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
        titlePage="Open Tasks"
        subTitle="Open tasks."
      >
        <PanelContainer>
          <div className="tasks-page-header">
            <InputField
              placeholder="Search my tasks"
              isSearch
              value={search}
              onChange={(value) => this.setState({ search: value })}
            />
            <Button
              text="+ NEW TASK"
              customWidth={160}
              className="tasks-new-btn"
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

export default OpenTasks;