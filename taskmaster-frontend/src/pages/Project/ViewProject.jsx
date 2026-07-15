import React from 'react';
import { PanelContainer, PanelPage } from '../../components/TRCOMPONENTS/TRPanelPage/TRPanelPage';
import {useProjectStore} from '../../context/projectStore';
import { InputRow } from '../../components/TRCOMPONENTS/TRInputForm/TRInputForm';
import InputField from '../../components/TRCOMPONENTS/TRInputField/InputFIeld';
import { Table } from '../../components/TRCOMPONENTS/TRTable/TrTable';

class ViewProject extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            project: null
        }
    }

    componentDidMount() {
        this.getProject();
    }

    getProject = async () => {
        const { getProjectByName } = useProjectStore.getState();
        const currentPath = window.location.pathname;
        const newPath = currentPath.replace("/projects/", "");
        const project = await getProjectByName(newPath);
        this.setState({ project });
    }

    //top container
    //GAWA LABEL COMPONENT
    topContainer = () => {
        return (
            <>
                <InputRow gap={16}>
                    <InputField text disabled placeholder="test"/>
                    <InputField text disabled/>
                </InputRow>
                <InputRow gap={16}>
                    <InputField text disabled/>
                    <InputField text disabled/>
                </InputRow>
            </>
        );
    }

    //project members
    projectMembers = () => {
        const members = this.state.project.members;
        const data = members.map(d => ({
                                    Username: d.username,
                                    Email: d.email,
                                    ["Branch Location"]: d.branchLocation.branchLocation
                                }));
        return (
            <Table data={data}/>
        );
    }

    render () {
        //GAWA LOADING COMPONENT
        if (!this.state.project) {
            return null;
        }

        return (
            <PanelPage titlePage={this.state.project.projectName} isLoading={false} subTitle="View project">
                <PanelContainer title="Project Details">
                    {this.topContainer()}
                </PanelContainer>
                <InputRow gap={16}>
                    <PanelContainer>

                    </PanelContainer>
                    <PanelContainer title="Project Members">
                        {/* TODO YUNG <p> */}
                        <p>Members: {this.state.project.members.length}</p>
                        <div style={{marginBottom: '20px'}}/>
                        {this.projectMembers()}
                    </PanelContainer>
                </InputRow>
            </PanelPage>
        );
    }
}

export default ViewProject;