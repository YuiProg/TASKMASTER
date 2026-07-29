import React from 'react';
import { PanelContainer, PanelPage } from '../../components/TRCOMPONENTS/TRPanelPage/TRPanelPage';
import { useProjectStore } from '../../context/ProjectStore.js';
import { InputRow } from '../../components/TRCOMPONENTS/TRInputForm/TRInputForm';
import { Label } from '../../components/TRCOMPONENTS/TRInputField/InputFIeld';
import { Table } from '../../components/TRCOMPONENTS/TRTable/TrTable';
import Spinner from '../../components/Spinner/Spinner';
import Button from '../../components/TRCOMPONENTS/TRButton/Button';
import { Pencil, Plus } from 'lucide-react';
import navigateTo from '../../lib/navigate';

import './ViewProject.css';
import './KanbanBoard.jsx';
import KanbanBoard from './KanbanBoard.jsx';

class ViewProject extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            project: null,
            tasks: []
        };
    }

    componentDidMount() {
        this.initProjectData();
    }

    initProjectData = async () => {
        const { getProjectByName } = useProjectStore.getState();
        const currentPath = window.location.pathname;
        const newPath = currentPath.replace("/projects/", "");
        
        // Fetch the wrapper object containing { project, tasks } directly from the store
        const data = await getProjectByName(newPath);
        
        if (data) {
            this.setState({ 
                project: data.project, 
                tasks: data.tasks 
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

    render () {

        if (!this.state.project) {
            return (
                <PanelPage>
                    <Spinner size={30} strokeWidth={3} />
                </PanelPage>
            );
        }

        //const taskCount = this.state.tasks ? this.state.tasks.length : 0;
        const memberCount = this.state.project.members ? this.state.project.members.length : 0;

        return (
            <PanelPage titlePage={this.state.project.projectName.toUpperCase()} isLoading={false} subTitle={`Project ID: ${this.state.project.id}`}>
                <PanelContainer>
                    <div className="vp-action-row">
                        <Label label="Action"/>
                        <div className="vp-action-spacer"/>
                        <Button className="vp-action-btn" text={<span><Plus size={10}/> CREATE TASK</span>} onClick={this.goToCreateTask}/>
                        <Button className="vp-action-btn" text={<span><Pencil size={10}/> EDIT PROJECT</span>}/>
                    </div>
                </PanelContainer>
                <PanelContainer title="Project Details">
                    {this.topContainer()}
                    <InputRow gap={16}>
                    {/* <PanelContainer title="Tasks">
                        <Label label={`TASKS: ${taskCount}`} style={{marginTop: '10px', marginBottom: '20px'}}/>
                        {this.viewTasks()}
                    </PanelContainer> */}
                    <PanelContainer title="Project Members">
                        <Label label={`Members: ${memberCount}`} style={{marginTop: '10px', marginBottom: '20px'}}/>
                        {this.projectMembers()}
                    </PanelContainer>
                </InputRow>
                </PanelContainer>

                <PanelContainer title="Task Board">
                    <div style={{marginTop: '10px'}}/>
                    <KanbanBoard tasks={this.state.tasks}/>
                </PanelContainer>
            </PanelPage>
        );
    }
}

export default ViewProject;