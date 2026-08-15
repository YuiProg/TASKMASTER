import React from 'react';
import { Helmet } from 'react-helmet-async';
import { PanelContainer, PanelPage } from '../../components/TRCOMPONENTS/TRPanelPage/TRPanelPage';
import { useProjectStore } from '../../context/ProjectStore.js';
import { InputRow } from '../../components/TRCOMPONENTS/TRInputForm/TRInputForm';
import { Label, InputField } from '../../components/TRCOMPONENTS/TRInputField/InputFIeld';
import { Table } from '../../components/TRCOMPONENTS/TRTable/TrTable';
import Spinner from '../../components/Spinner/Spinner';
import Button from '../../components/TRCOMPONENTS/TRButton/Button';
import { Plus, Zap, Eye, MapPin } from 'lucide-react';
import navigateTo from '../../lib/navigate';

import '../../styles/pages/view-project.scss';
import KanbanBoard from './KanbanBoard.jsx';

class ViewProject extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            project: null,
            tasks: [],
            newMemberEmail: '',
            isAddingMember: false,
            addMemberError: null
        };
    }

    componentDidMount() {
        this.initProjectData();
    }

    initProjectData = async () => {
        const { getProjectByName } = useProjectStore.getState();
        const currentPath = window.location.pathname;
        const newPath = currentPath.replace("/projects/", "");
        
        const data = await getProjectByName(newPath);
        
        if (data) {
            const projectObj = data.project || data.data || data;
            const tasksList = data.tasks || projectObj?.tasks || [];

            this.setState({ 
                project: projectObj, 
                tasks: tasksList 
            });
        }
    }

    topContainer = () => {
        const { project, tasks } = this.state;
        const taskCount = tasks ? tasks.length : 0;

        return (
            <>
                <Label label={`PROJECT NAME: ${project.projectName}`} style={{marginTop: '10px'}}/>
                <Label label={`CREATED BY: ${project.createdBy?.username || 'N/A'}`} style={{marginTop: '10px'}}/>
                <Label label={`DESCRIPTION: ${project.description || ''}`} style={{marginTop: '10px'}}/>
                <Label label={`TASKS: ${taskCount}`} style={{marginTop: '10px'}}/>
            </>
        );
    }

    projectMembers = () => {
        const members = this.state.project.members || [];

        if (members.length === 0) {
            return <p className="view-project__no-members">No members assigned to this project yet.</p>;
        }

        return (
            <div className="view-project__members-grid">
                {members.map((member, index) => {
                    const avatarUrl =
                        member.profilePicture ||
                        member.avatarUrl ||
                        member.image ||
                        null;

                    const initials = member.username
                        ? member.username.substring(0, 2).toUpperCase()
                        : 'U';

                    return (
                        <div key={member.id || index} className="view-project__member-card">
                            <div className="view-project__member-avatar">
                                {avatarUrl ? (
                                    <img
                                        src={avatarUrl}
                                        alt={member.username || "Member Avatar"}
                                        className="view-project__member-avatar-img"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                ) : (
                                    initials
                                )}
                            </div>
                            <div className="view-project__member-info">
                                <span className="view-project__member-name">{member.username}</span>
                                <span className="view-project__member-email">{member.email}</span>
                                <span className="view-project__member-branch">
                                    <MapPin size={12} className="view-project__member-branch-icon" />
                                    {member.branchLocation?.branchLocation || 'N/A'}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    handleAddMember = async () => {
        const rawInput = this.state.newMemberEmail.trim();
        if (!rawInput) return;

        const emailsList = rawInput
            .split(/[\s,]+/)
            .map(e => e.trim())
            .filter(e => e.length > 0);

        if (emailsList.length === 0) return;

        this.setState({ isAddingMember: true, addMemberError: null });

        const { addProjectMembers } = useProjectStore.getState();
        
        const success = await addProjectMembers(this.state.project.id, emailsList);

        if (success) {
            this.setState({ newMemberEmail: '', isAddingMember: false });
            await this.initProjectData();
        } else {
            const { error } = useProjectStore.getState();
            this.setState({
                isAddingMember: false,
                addMemberError: error || 'Could not add member(s).',
            });
        }
    };

    handleInputChange = (e) => {
        const value = e?.target ? e.target.value : e;
        this.setState({ newMemberEmail: value, addMemberError: null });
    };

    viewTasks = () => {
        const tasks = this.state.tasks;
        const data = tasks.map(t => {
            const row = {
                Title: t.taskName || 'N/A',
                Status: t.status || 'N/A',
                ["Due Date"]: t.dueDate || 'N/A',
                Assignee: t.assignee?.username || 'N/A',
                Reporter: t.createdBy?.username || 'N/A',
            };

            Object.defineProperty(row, "id", {
                value: t.id,
                enumerable: false,
                writable: false
            });

            return row;
        });

        return (
            <Table data={data} limit={6} onRowSelect={e => this.navigateToTask(e.id)}/>
        );
    }

    navigateToTask = (id) => {
        navigateTo(`/tasks/view/${id}`);
    }

    goToCreateTask = () => {
        const projectName = this.state.project?.projectName || '';
        navigateTo(`/tasks/new?project=${encodeURIComponent(projectName)}`);
    }

    goToCreateSprint = () => {
        const projectId = this.state.project?.id;
        if (projectId) {
            navigateTo(`/sprint/create/${projectId}`);
        }
    }

    goToViewSprint = () => {
        const sprintId = this.state.project?.sprintId;
        if (sprintId) {
            navigateTo(`/sprint/view/${sprintId}`);
        }
    }

    render () {

        if (!this.state.project) {
            return (
                <PanelPage>
                    <Helmet>
                        <title>Loading Project... | TaskMaster</title>
                    </Helmet>
                    <Spinner size={30} strokeWidth={3} />
                </PanelPage>
            );
        }

        const memberCount = this.state.project.members ? this.state.project.members.length : 0;
        const { newMemberEmail, isAddingMember, addMemberError, project } = this.state;
        const hasActiveSprint = project?.inSprint === 1 && Boolean(project?.sprintId);
        const pageTitle = project?.projectName ? `${project.projectName} | TaskMaster` : 'Project Details | TaskMaster';

        return (
            <PanelPage titlePage={this.state.project.projectName.toUpperCase()} isLoading={false} subTitle={`Project ID: ${this.state.project.id}`}>
                <Helmet>
                    <title>{pageTitle}</title>
                </Helmet>

                <PanelContainer>
                    <div className="view-project__action-row">
                        <Label label="Action"/>
                        <div className="view-project__action-spacer"/>
                        
                        {hasActiveSprint ? (
                            <Button 
                                className="view-project__action-btn" 
                                text={<span><Eye size={12}/> VIEW SPRINT</span>} 
                                onClick={this.goToViewSprint}
                            />
                        ) : (
                            <Button 
                                disabled={this.state.project?.archived === 1} 
                                className="view-project__action-btn" 
                                text={<span><Zap size={12}/> CREATE SPRINT</span>} 
                                onClick={this.goToCreateSprint}
                            />
                        )}

                        <Button 
                            disabled={this.state.project?.archived === 1} 
                            className="view-project__action-btn" 
                            text={<span><Plus size={10}/> CREATE TASK</span>} 
                            onClick={this.goToCreateTask}
                        />
                    </div>
                </PanelContainer>
                
                <PanelContainer title="Project Details">
                    {this.topContainer()}
                    <InputRow gap={16}>
                    </InputRow>
                </PanelContainer>

                <PanelContainer title="Task Board">
                    <div style={{marginTop: '10px'}}/>
                    <KanbanBoard tasks={this.state.tasks} project={this.state.project} />
                </PanelContainer>
                
                <PanelContainer title="Project Members">
                    <Label label={`Members: ${memberCount}`} style={{marginTop: '10px', marginBottom: '20px'}}/>

                    <div className="view-project__add-member-row">
                        <InputField
                            placeholder="Add member by email (or comma separated)"
                            email
                            value={newMemberEmail}
                            onChange={this.handleInputChange}
                            onEnterDown={this.handleAddMember}
                        />
                        <Button
                            className="view-project__action-btn"
                            text={isAddingMember ? "ADDING..." : "ADD"}
                            disabled={isAddingMember || this.state.project?.archived === 1}
                            customWidth={90}
                            onClick={this.handleAddMember}
                        />
                    </div>
                    {addMemberError && (
                        <p className="view-project__add-member-error">{addMemberError}</p>
                    )}

                    {this.projectMembers()}
                </PanelContainer>
            </PanelPage>
        );
    }
}

export default ViewProject;