import React from "react";
import { PanelPage, PanelContainer } from "../../components/TRCOMPONENTS/TRPanelPage/TRPanelPage";
import { InputField } from "../../components/TRCOMPONENTS/TRInputField/InputFIeld";
import Button from "../../components/TRCOMPONENTS/TRButton/Button";
import { useProjectStore } from "../../context/projectStore";
import navigateTo from "../../lib/navigate";
import "./NewProject.css";

class NewProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectName: "",
      description: "",
      members: [],
      memberInput: "",
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

  handleAddMember = (e) => {
    e.preventDefault();
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

  handleSubmit = async (e) => {
    e.preventDefault();

    if (!this.state.projectName.trim()) {
      this.setState({ localError: 'Project name is required.' });
      return;
    }
    this.setState({ localError: null });

    try {
      const success = await useProjectStore
        .getState()
        .createProject(
          this.state.projectName.trim(),
          this.state.description.trim(),
          this.state.members
        );

      if (success) {
        navigateTo("/projects");
      }
    } catch (err) {
      // createProject already catches its own errors internally, so this
      // only fires if something unexpected blew up before/after that call.
      console.error('Unexpected error creating project:', err);
      this.setState({ localError: 'Something unexpected went wrong. Check the console.' });
    }
  };

  render() {
    const { projectName, description, members, memberInput, isCreating, error, localError } =
      this.state;

    return (
      <PanelPage
        titlePage="New Project"
        subTitle="Set up a new project for your team."
      >
        <PanelContainer>
          <form className="new-project-form" onSubmit={this.handleSubmit}>
            {(error || localError) && (
              <p className="new-project-error">{error || localError}</p>
            )}

            <div className="new-project-field">
              <label className="new-project-label">
                Project name<span className="new-project-required">*</span>
              </label>
              <InputField
                placeholder="e.g. Website Redesign"
                text
                value={projectName}
                onChange={(value) => this.setState({ projectName: value })}
              />
            </div>

            <div className="new-project-field">
              <label className="new-project-label">Description</label>
              <textarea
                className="new-project-textarea"
                placeholder="What's this project about?"
                value={description}
                onChange={(e) =>
                  this.setState({ description: e.target.value })
                }
                rows={4}
              />
            </div>

            <div className="new-project-field">
              <label className="new-project-label">Members</label>
              <span className="new-project-note">
                Added to the project when it's created.
              </span>

              <div className="new-project-member-input-row">
                <InputField
                  placeholder="Add by email"
                  email
                  value={memberInput}
                  onChange={(value) => this.setState({ memberInput: value })}
                  onEnterDown={() =>
                    this.handleAddMember({ preventDefault: () => {} })
                  }
                />
                <Button
                  text="ADD"
                  customWidth={80}
                  onClick={() =>
                    this.handleAddMember({ preventDefault: () => {} })
                  }
                  cancel
                />
              </div>

              {members.length > 0 && (
                <div className="new-project-member-chips">
                  {members.map((email) => (
                    <span key={email} className="new-project-chip">
                      {email}
                      <button
                        type="button"
                        className="new-project-chip-remove"
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

            <div className="new-project-actions">
              <Button
                cancel
                text="CANCEL"
                onClick={this.goBack}
              />
              <Button
                submit
                text={isCreating ? "CREATING..." : "CREATE PROJECT"}
                disabled={isCreating}
                className="new-project-submit-btn"
                onClick={() => {}}
              />
            </div>
          </form>
        </PanelContainer>
      </PanelPage>
    );
  }
}

export default NewProject;