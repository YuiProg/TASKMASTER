import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import { ChevronDown } from 'lucide-react';
import './DashboardLayout.css';

class DashboardLayout extends React.Component {
  render() {
    return (
      <div className="app-shell-container">
        <Sidebar />

        <div className="workspace-view-container">
          <header className="workspace-header-bar">
            <div className="header-left-title">
              <h1>Taskmaster Workspace</h1>
              <span className="header-subtitle">Overview of team tracking metrics, tasks, and agile pipeline analytics.</span>
            </div>
            
            <div className="header-right-controls">
              <span className="branch-label-txt">ORGANIZATION BRANCH</span>
              <div className="branch-selector-dropdown">
                <span className="selected-branch-name">Main Branch</span>
                <ChevronDown size={14} />
              </div>
            </div>
          </header>

          <main className="workspace-content-pane">
            <Outlet />
          </main>
        </div>
      </div>
    );
  }
}

export default DashboardLayout;