import React from "react";
import { PanelPage, PanelContainer } from "../../components/TRCOMPONENTS/TRPanelPage/TRPanelPage";
import { InputField } from "../../components/TRCOMPONENTS/TRInputField/InputFIeld";
import Button from "../../components/TRCOMPONENTS/TRButton/Button";
import { useProjectStore } from "../../context/ProjectStore.js";
import navigateTo from "../../lib/navigate";
import "./NewProject.scss";

class NewProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectName: "",
      description: "",
      members: [],
      memberInput: "",
      priorities: [],
      priorityInput: "",
      isCreating: useProjectStore.getState().isCreating,
      error: useProjectStore.getState().error,
      localError: null,
    };
  }

  componentDidMount() {
    this.unsubscribeProjects = useProjectStore.subscribe((state) => {
      this.setState({ isCreating: state.isCreating, error: state.error });
    });
  }

  componentWillUnmount() {
    if (this.unsubscribeProjects) this.unsubscribeProjects();
  }

  goBack = () => {
    navigateTo("/projects");
  };

  handleKeyDownBlockSubmit = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  handleAddMember = (e) => {
    if (e) {
      if (e.preventDefault) e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
    }
    const email = this.state.memberInput.trim();
    if (!email) return;
    if (this.state.members.includes(email)) {
      this.setState({ memberInput: "" });
      return;
    }
    this.setState((prev) => ({
      members: [...prev.members, email],
      memberInput: "",
    }));
  };

  handleRemoveMember = (email) => {
    this.setState((prev) => ({
      members: prev.members.filter((m) => m !== email),
    }));
  };

  handleAddPriority = (e) => {
    if (e) {
      if (e.preventDefault) e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
    }
    const priority = this.state.priorityInput.trim();
    if (!priority) return;

    if (this.state.priorities.length >= 8) {
      this.setState({ localError: "Maximum of 8 priorities allowed." });
      return;
    }

    if (this.state.priorities.includes(priority)) {
      this.setState({ priorityInput: "", localError: null });
      return;
    }

    this.setState((prev) => ({
      priorities: [...prev.priorities, priority],
      priorityInput: "",
      localError: null,
    }));
  };

  handleRemovePriority = (priority) => {
    this.setState((prev) => ({
      priorities: prev.priorities.filter((p) => p !== priority),
      localError: null,
    }));
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    if (!this.state.projectName.trim()) {
      this.setState({ localError: "Project name is required." });
      return;
    }

    if (!this.state.priorities || this.state.priorities.length < 5) {
      this.setState({ localError: "Please add at least 5 priorities to proceed." });
      return;
    }

    if (this.state.priorities.length > 8) {
      this.setState({ localError: "Maximum of 8 priorities allowed." });
      return;
    }

    this.setState({ localError: null });

    try {
      const success = await useProjectStore
        .getState()
        .createProject(
          this.state.projectName.trim(),
          this.state.description.trim(),
          this.state.members,
          this.state.priorities
        );

      if (success) {
        navigateTo("/projects");
      }
    } catch (err) {
      console.error("Unexpected error creating project:", err);
      this.setState({
        localError: "Something unexpected went wrong. Check the console.",
      });
    }
  };

  render() {
    const {
      projectName,
      description,
      members,
      memberInput,
      priorities,
      priorityInput,
      isCreating,
      error,
      localError,
    } = this.state;

    const isSubmitDisabled =
      isCreating ||
      !projectName.trim() ||
      priorities.length < 5 ||
      priorities.length > 9;

    return (
      <PanelPage
        titlePage="New Project"
        subTitle="Set up a new project for your team."
      >
        <PanelContainer>
          <form className="new-project-form" onSubmit={this.handleSubmit}>
            {(error || localError) && (
              <p className="new-project-form__error">{error || localError}</p>
            )}

            <div className="new-project-form__field">
              <label className="new-project-form__label">
                Project name<span className="new-project-form__required">*</span>
              </label>
              <InputField
                placeholder="e.g. Website Redesign"
                text
                value={projectName}
                onChange={(value) => this.setState({ projectName: value })}
              />
            </div>

            <div className="new-project-form__field">
              <label className="new-project-form__label">Description</label>
              <textarea
                className="new-project-form__textarea"
                placeholder="What's this project about?"
                value={description}
                onChange={(e) =>
                  this.setState({ description: e.target.value })
                }
                rows={4}
              />
            </div>

            <div className="new-project-form__field">
              <label className="new-project-form__label">
                Priorities<span className="new-project-form__required">*</span>
              </label>
              <span className="new-project-form__note">
                Add priorities (Min: 5, Max: 8 required to proceed).
              </span>

              <div 
                className="new-project-form__member-row" 
                onKeyDown={this.handleKeyDownBlockSubmit}
              >
                <InputField
                  placeholder="e.g. Low, High, Urgent"
                  text
                  value={priorityInput}
                  onChange={(value) => this.setState({ priorityInput: value })}
                  onEnterDown={this.handleAddPriority}
                />
                <Button
                  text="ADD"
                  customWidth={80}
                  type="button"
                  onClick={this.handleAddPriority}
                  cancel
                  disabled={priorities.length >= 8}
                />
              </div>

              {priorities.length > 0 && (
                <div className="new-project-form__member-chips">
                  {priorities.map((priority) => (
                    <span key={priority} className="new-project-form__chip">
                      {priority}
                      <button
                        type="button"
                        className="new-project-form__chip-remove"
                        onClick={() => this.handleRemovePriority(priority)}
                        aria-label={`Remove ${priority}`}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="new-project-form__field">
              <label className="new-project-form__label">Members</label>
              <span className="new-project-form__note">
                Added to the project when it's created.
              </span>

              <div 
                className="new-project-form__member-row" 
                onKeyDown={this.handleKeyDownBlockSubmit}
              >
                <InputField
                  placeholder="Add by email"
                  email
                  value={memberInput}
                  onChange={(value) => this.setState({ memberInput: value })}
                  onEnterDown={this.handleAddMember}
                />
                <Button
                  text="ADD"
                  customWidth={80}
                  type="button"
                  onClick={this.handleAddMember}
                  cancel
                />
              </div>

              {members.length > 0 && (
                <div className="new-project-form__member-chips">
                  {members.map((email) => (
                    <span key={email} className="new-project-form__chip">
                      {email}
                      <button
                        type="button"
                        className="new-project-form__chip-remove"
                        onClick={() => this.handleRemoveMember(email)}
                        aria-label={`Remove ${email}`}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="new-project-form__actions">
              <Button
                cancel
                type="button"
                text="CANCEL"
                onClick={this.goBack}
              />
              <Button
                submit
                text={isCreating ? "CREATING..." : "CREATE PROJECT"}
                disabled={isSubmitDisabled}
                className="new-project-form__submit-btn"
              />
            </div>
          </form>
        </PanelContainer>
      </PanelPage>
    );
  }
}

export default NewProject;