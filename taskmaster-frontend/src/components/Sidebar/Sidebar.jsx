import React from 'react';
import { 
  LayoutDashboard, 
  Folder, 
  CheckSquare, 
  GitBranch, 
  Users, 
  Settings, 
  ChevronDown, 
  LogOut, 
  Menu 
} from 'lucide-react';
import { useAuthStore } from '../../context/AuthStore';
import api from '../../lib/axios'; // Adjust path to your shared axios instance
import './Sidebar.css';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    // Grab the initial state from your Zustand store reactively
    const storeState = useAuthStore.getState();
    
    this.state = {
      activePath: window.location.pathname || '/dashboard',
      openMenus: { projects: false, tasks: false },
      user: storeState.user // Keeps the local profile rendering bound to Zustand data
    };
  }

  componentDidMount() {
    // Subscribe to global Zustand state changes so the profile syncs dynamically if updated
    this.unsubscribeStore = useAuthStore.subscribe(
      (state) => this.setState({ user: state.user })
    );
  }

  componentWillUnmount() {
    // Clean up our store subscription to prevent memory leaks when the component unmounts
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
    }
  }

  toggleMenu = (menuKey) => {
    this.setState(prevState => ({
      openMenus: { ...prevState.openMenus, [menuKey]: !prevState.openMenus[menuKey] }
    }));
  };

  handleNav = (path) => {
    this.setState({ activePath: path });
    if (window.location.pathname !== path) {
      window.location.pathname = path;
    }
  };

  handleLogout = async () => {
    try {
      // 1. Hit your accurate backend endpoint running on your core Spring Boot instance
      // Assuming your axios instance prefix handles '/api/v1', use '/logout'. Otherwise, use full URL:
      await api.post('/logout'); 
    } catch (err) {
      console.error("Backend logout session cleanup failed:", err);
    } finally {
      // 2. Trigger the Zustand action directly via the store instance API to wipe local credentials
      useAuthStore.getState().logout();
      
      // 3. Clear the window route context back to your full screen login view
      window.location.href = '/';
    }
  };

  render() {
    const { activePath, openMenus, user } = this.state;

    // Fallback names if your Zustand user payload hasn't loaded yet
    const displayName = user?.username || user?.name || 'admin';
    const displayRole = user?.role || 'Core Engineer';
    const avatarInitials = displayName.substring(0, 2).toUpperCase();

    return (
      <aside className="app-sidebar">
        <div className="sidebar-brand-zone">
          <span className="brand-text">TASKMASTER CORE</span>
          <button className="hamburger-btn"><Menu size={18} /></button>
        </div>

        <nav className="sidebar-scroller">
          <div className="menu-group-label">OVERVIEW</div>
          <button 
            className={`nav-row-btn ${activePath === '/dashboard' ? 'active' : ''}`}
            onClick={() => this.handleNav('/dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          <div className="menu-group-label">WORKSPACE MANAGEMENT</div>
          
          <div className="dropdown-wrapper">
            <button className="nav-row-btn" onClick={() => this.toggleMenu('projects')}>
              <Folder size={18} />
              <span>Projects</span>
              <ChevronDown size={14} className={`arrow-icon ${openMenus.projects ? 'rotated' : ''}`} />
            </button>
            {openMenus.projects && (
              <div className="sub-menu-box">
                <button onClick={() => this.handleNav('/projects/active')}>Active Track</button>
                <button onClick={() => this.handleNav('/projects/archived')}>Archived</button>
              </div>
            )}
          </div>

          <div className="dropdown-wrapper">
            <button className="nav-row-btn" onClick={() => this.toggleMenu('tasks')}>
              <CheckSquare size={18} />
              <span>Tasks</span>
              <ChevronDown size={14} className={`arrow-icon ${openMenus.tasks ? 'rotated' : ''}`} />
            </button>
            {openMenus.tasks && (
              <div className="sub-menu-box">
                <button onClick={() => this.handleNav('/tasks/my-tasks')}>Assigned to Me</button>
                <button onClick={() => this.handleNav('/tasks/backlog')}>Backlog Queue</button>
              </div>
            )}
          </div>

          <button 
            className={`nav-row-btn ${activePath === '/branches' ? 'active' : ''}`}
            onClick={() => this.handleNav('/branches')}
          >
            <GitBranch size={18} />
            <span>Branches</span>
          </button>

          <div className="menu-group-label">TEAM SPACE</div>
          <button 
            className={`nav-row-btn ${activePath === '/team' ? 'active' : ''}`}
            onClick={() => this.handleNav('/team')}
          >
            <Users size={18} />
            <span>Members</span>
          </button>

          <div className="menu-group-label">SYSTEM</div>
          <button 
            className={`nav-row-btn ${activePath === '/settings' ? 'active' : ''}`}
            onClick={() => this.handleNav('/settings')}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </nav>

        {/* User Account Bar Profile block bound to Zustand data */}
        <div className="sidebar-account-footer">
          <div className="avatar-circle">{avatarInitials}</div>
          <div className="account-meta">
            <span className="user-title">{displayName}</span>
            <span className="user-subtitle">{displayRole}</span>
            <button className="pwd-link-btn" onClick={() => this.handleNav('/profile')}>View profile</button>
          </div>
          <button className="logout-action-btn" onClick={this.handleLogout} title="Logout System">
            <LogOut size={16} />
          </button>
        </div>
      </aside>
    );
  }
}

export default Sidebar;