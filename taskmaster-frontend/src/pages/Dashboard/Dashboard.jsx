import React from 'react';
import { Users, CheckCircle, Activity, ClipboardList, TrendingUp, AlertCircle } from 'lucide-react';
import './Dashboard.css';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskPerformanceData: [
        { id: '01', name: 'Implement Auth Pipeline Token Refactoring', progress: 100, status: 'Completed', color: '#22c55e' },
        { id: '02', name: 'Configure Docker Multi-Stage Container Setup', progress: 85, status: 'In Review', color: '#3b82f6' },
        { id: '03', name: 'Refactor Mongoose Schema Static Validations', progress: 60, status: 'In Progress', color: '#f59e0b' },
        { id: '04', name: 'Fix Socket.io Intermittent Disconnection Bugs', progress: 40, status: 'In Progress', color: '#a855f7' },
        { id: '05', name: 'Write Integration Mock MVC Verification Tests', progress: 10, status: 'Backlog', color: '#ef4444' },
        { id: '06', name: 'Document API Endpoints Markdown Blueprint Sheets', progress: 0, status: 'Backlog', color: '#757575' }
      ]
    };
  }

  render() {
    return (
      <div className="dashboard-grid-canvas">
        
        {/* ROW 1: SPRINT SNAPSHOT BANNER */}
        <div className="metrics-row-grid">
          
          <div className="metric-card shadow-dark">
            <div className="card-inner flex-between">
              <div>
                <span className="metric-tag">ACTIVE DEVELOPERS</span>
                <h2 className="metric-value-large">4</h2>
              </div>
              <div className="metric-icon-box grey-box">
                <Users size={24} />
              </div>
            </div>
          </div>

          <div className="metric-card shadow-dark">
            <div className="card-inner flex-between">
              <div>
                <span className="metric-tag">COMPLETED TASKS (THIS SPRINT)</span>
                <h2 className="metric-value-large green-txt">142</h2>
              </div>
              <div className="metric-icon-box green-box">
                <CheckCircle size={24} />
              </div>
            </div>
          </div>

          <div className="system-feed-card shadow-dark">
            <div className="feed-inner flex-between">
              <div>
                <span className="metric-tag">AUTOMATED CI/CD SYSTEM FEED</span>
                <h4 className="feed-highlight-title">Build Action Status</h4>
                <p className="feed-status-placeholder">Pipeline execution succeeded. Staging deployment green.</p>
              </div>
              <div className="feed-icon-badge">
                <Activity size={20} />
              </div>
            </div>
          </div>

        </div>

        {/* ROW 2: VELOCITY ANALYSIS AND SHORT TERM MEMOS */}
        <div className="mid-section-layout-grid">
          
          {/* Sprint Velocity Statistics */}
          <div className="analytics-card display-panel shadow-dark">
            <span className="section-small-label">VELOCITY PERFORMANCE METRICS</span>
            <h3 className="section-main-heading">Task Resolution Velocity</h3>
            
            <div className="graph-legend-indicator">
              <span className="legend-dot color-sales"></span>
              <span className="legend-label-txt">Tasks Resolved</span>
            </div>

            <div className="bar-chart-mockup-frame">
              <div className="y-axis-labels">
                <span>200 Tasks</span>
                <span>100 Tasks</span>
                <span>0 Tasks</span>
              </div>
              <div className="x-axis-bars">
                {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].map((month) => (
                  <div key={month} className="bar-column-node">
                    <div className="bar-track-back">
                      {month === 'APR' && <div className="bar-fill-indicator" style={{ height: '45%' }}></div>}
                      {month === 'MAY' && <div className="bar-fill-indicator" style={{ height: '62%' }}></div>}
                      {month === 'JUN' && <div className="bar-fill-indicator" style={{ height: '85%' }}></div>}
                    </div>
                    <span className="bar-axis-title">{month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Core Ticket Breakdown Donut */}
          <div className="analytics-card breakdown-panel shadow-dark">
            <div className="flex-between">
              <div>
                <span className="section-small-label">TICKET DISTRIBUTION BREAKDOWN</span>
                <h3 className="section-main-heading">Backlog Breakdown</h3>
              </div>
              <span className="badge-tag-monthly">Q3 Tracking</span>
            </div>

            <div className="donut-chart-mockup-wrapper">
              <svg viewBox="0 0 36 36" className="circular-donut-svg">
                <path className="donut-ring-track" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="donut-segment-green" strokeDasharray="50, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="donut-segment-red" strokeDasharray="50, 100" strokeDashoffset="-50" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
            </div>

            <div className="donut-legend-grid-layout">
              <div className="legend-row"><span className="indicator-dot green-dot"></span> <div><p className="leg-num">48</p><p className="leg-name">Features</p></div></div>
              <div className="legend-row"><span className="indicator-dot red-dot"></span> <div><p className="leg-num">12</p><p className="leg-name">Bug Fixes</p></div></div>
              <div className="legend-row"><span className="indicator-dot blue-dot"></span> <div><p className="leg-num">15</p><p className="leg-name">Refactors</p></div></div>
              <div className="legend-row"><span className="indicator-dot yellow-dot"></span> <div><p className="leg-num">8</p><p className="leg-name">Hotfixes</p></div></div>
            </div>
          </div>

          {/* Yellow Scratchpad / Sprint Retrospective Block */}
          <div className="sticky-notes-pad shadow-dark">
            <h4 className="sticky-pad-header">Sprint Retrospective:</h4>
            <textarea className="sticky-text-area-input" placeholder="Type core sprint blockers or deployment notes here..."></textarea>
          </div>

        </div>

        {/* ROW 3: REPOSITORIES SUMMARY AND DETAILED TASK OVERVIEW */}
        <div className="bottom-row-split-grid">
          
          {/* Project Aggregates Status */}
          <div className="analytics-card summary-card-panel shadow-dark">
            <span className="section-small-label">REPOSITORY MANAGEMENT OVERVIEW</span>
            <h3 className="section-main-heading">Today's Core Summary</h3>

            <div className="accent-boxes-flex-row">
              <div className="accent-box-node crimson-accent-node">
                <div className="accent-icon-circle"><TrendingUp size={16} /></div>
                <h3 className="accent-value-title">89.4%</h3>
                <span className="accent-sub-title-label">Sprint Completion</span>
              </div>
              
              <div className="accent-box-node blue-accent-node">
                <div className="accent-icon-circle"><ClipboardList size={16} /></div>
                <h3 className="accent-value-title">18</h3>
                <span className="accent-sub-title-label">Active Deployments</span>
              </div>

              <div className="accent-box-node orange-accent-node">
                <div className="accent-icon-circle"><AlertCircle size={16} /></div>
                <h3 className="accent-value-title">2</h3>
                <span className="accent-sub-title-label">Blockers Flagged</span>
              </div>
            </div>
          </div>

          {/* High Priority Item Progress Table tracker */}
          <div className="analytics-card item-tracking-table-panel shadow-dark">
            <span className="section-small-label">PIPELINE MONITORING MATRIX</span>
            <h3 className="section-main-heading">High Priority Work Items</h3>

            <div className="custom-table-scroll-box">
              <table className="custom-dashboard-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>TASK DESCRIPTION NAME</th>
                    <th>COMPLETION RATE</th>
                    <th className="text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.taskPerformanceData.map((task) => (
                    <tr key={task.id}>
                      <td className="dim-table-cell">{task.id}</td>
                      <td className="bold-table-cell-name">{task.name}</td>
                      <td>
                        <div className="popularity-bar-track-rail">
                          <div 
                            className="popularity-bar-progress-fill" 
                            style={{ width: `${task.progress}%`, backgroundColor: task.color }}
                          ></div>
                        </div>
                      </td>
                      <td className="text-right table-sales-metric-txt" style={{ color: task.color }}>{task.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    );
  }
}

export default Dashboard;