import React from 'react';
import { PanelContainer, PanelPage } from '../../components/TRCOMPONENTS/TRPanelPage/TRPanelPage';
import { useProjectStore } from '../../context/ProjectStore.js';
import { InputRow } from '../../components/TRCOMPONENTS/TRInputForm/TRInputForm';
import { Label, InputField } from '../../components/TRCOMPONENTS/TRInputField/InputFIeld';
import { Table } from '../../components/TRCOMPONENTS/TRTable/TrTable';
import Spinner from '../../components/Spinner/Spinner';
import Button from '../../components/TRCOMPONENTS/TRButton/Button';
import { Plus, Zap, Eye } from 'lucide-react';
import navigateTo from '../../lib/navigate';

import './ViewProject.scss';
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
            // Extract the project object correctly from response structure
            const projectObj = data.project || data.data || data;
            const tasksList = data.tasks || projectObj?.tasks || [];

            this.setState({ 
                project: projectObj, 
                tasks: tasksList 
            });
        }
    }

    // Top details section
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

    // Project members table mapping
    projectMembers = () => {
        const members = this.state.project.members || [];
        const data = members.map(d => ({
            Username: d.username,
            Email: d.email,
            ["Branch Location"]: d.branchLocation?.branchLocation || 'N/A'
        }));
        return (
            <Table data={data}/>
        );
    }

    handleAddMember = async () => {
        const email = this.state.newMemberEmail.trim();
        if (!email) return;

        this.setState({ isAddingMember: true, addMemberError: null });

        const { addProjectMembers } = useProjectStore.getState();
        const success = await addProjectMembers(this.state.project.id, [email]);

        if (success) {
            this.setState({ newMemberEmail: '', isAddingMember: false });
            // Re-fetch so the members table/count reflect the real
            // backend state rather than patching it in locally.
            await this.initProjectData();
        } else {
            const { error } = useProjectStore.getState();
            this.setState({
                isAddingMember: false,
                addMemberError: error || 'Could not add that member.',
            });
        }
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
            }

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
                    <Spinner size={30} strokeWidth={3} />
                </PanelPage>
            );
        }

        const memberCount = this.state.project.members ? this.state.project.members.length : 0;
        const { newMemberEmail, isAddingMember, addMemberError, project } = this.state;
        const hasActiveSprint = project?.inSprint === 1 && Boolean(project?.sprintId);

        return (
            <PanelPage titlePage={this.state.project.projectName.toUpperCase()} isLoading={false} subTitle={`Project ID: ${this.state.project.id}`}>
                <PanelContainer>
                    <div className="view-project__action-row">
                        <Label label="Action"/>
                        <div className="view-project__action-spacer"/>
                        
                        {/* Show VIEW SPRINT if active sprint exists, otherwise show CREATE SPRINT */}
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
                                placeholder="Add member by email"
                                email
                                value={newMemberEmail}
                                onChange={(value) => this.setState({ newMemberEmail: value })}
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