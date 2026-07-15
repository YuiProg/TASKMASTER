import React from "react";
import { useAuthStore } from "../../context/AuthStore";
import { Link } from "react-router-dom";
import './Sidebar.css';
import {
    LayoutDashboard, Folder, CheckSquare, GitBranch, Users,
    LogOut, Menu, ChevronDown
} from 'lucide-react';

// Hardcoded for now so the sidebar always renders regardless of
// what's (or isn't) in useAuthStore. Swap this back to real store
// data once the black-screen / rehydration issue is sorted.
const HARDCODED_USER = {
    username: 'admin',
    role: 'admin',
};

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            projectsExpanded: false,
            tasksExpanded: false,
            showChangePasswordModal: false,
            user: HARDCODED_USER,
        };
    }

    componentDidMount() {
        this.unsubscribeAuth = useAuthStore.subscribe((state) => {
            if (state.user) this.setState({ user: state.user });
        });

        const pathname = window.location.pathname;

        if (["/projects", "/projects/new", "/projects/archived"].includes(pathname)) {
            this.setState({ projectsExpanded: true });
        }
        if (["/tasks/my-tasks", "/tasks/backlog"].includes(pathname)) {
            this.setState({ tasksExpanded: true });
        }
    }

    componentWillUnmount() {
        if (this.unsubscribeAuth) this.unsubscribeAuth();
    }

    handleLogout = async () => {
        // Hits /logout via the shared axios instance, then clears local state
        // regardless of whether the backend call succeeds.
        await useAuthStore.getState().logout();
        window.location.href = '/';
    }

    toggleSidebar = () => {
        this.setState(prev => ({ collapsed: !prev.collapsed }));
    }

    toggleMenu = (key) => (e) => {
        e.preventDefault();
        this.setState(prev => ({
            [key]: !prev[key],
            collapsed: prev.collapsed ? false : prev.collapsed,
        }));
    }

    passProps = () => {
        const { user } = this.state;
        return React.Children.map(this.props.children, (child) => {
            if (!child) return;
            return React.cloneElement(child, { user });
        });
    }

    renderAccordion({ key, expanded, active, icon, label, tooltip, items }) {
        const { collapsed } = this.state;
        return (
            <li className={`sb-row sb-dropdown-wrapper ${expanded ? 'is-expanded' : ''} ${active ? 'parent-active' : ''}`}>
                <a href={`#${key}`} onClick={this.toggleMenu(`${key}Expanded`)} className="sb-dropdown-trigger">
                    <div className="sb-trigger-left">
                        <span className="sb-icon-wrap">{icon}</span>
                        <span className="sb-title">{label}</span>
                    </div>
                    {!collapsed && (
                        <ChevronDown className={`sb-chevron ${expanded ? 'rotated' : ''}`} size={16} />
                    )}
                </a>
                {collapsed && <span className="sb-tooltip">{tooltip || label}</span>}
                <ul className="sb-submenu-list">
                    {items.map(({ path, title }) => {
                        const pathname = window.location.pathname;
                        return (
                            <li key={path} className={`sb-sub-row${pathname === path ? ' sub-active' : ''}`}>
                                <Link to={path}>
                                    <span className="sb-sub-dot"></span>
                                    <span className="sb-sub-title">{title}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </li>
        );
    }

    renderSimpleItem({ path, icon, label, pathname }) {
        const { collapsed } = this.state;
        return (
            <li className={`sb-row${pathname === path ? ' active' : ''}`}>
                <Link to={path}>
                    <span className="sb-icon-wrap">{icon}</span>
                    <span className="sb-title">{label}</span>
                </Link>
                {collapsed && <span className="sb-tooltip">{label}</span>}
            </li>
        );
    }

    render() {
        const { collapsed, projectsExpanded, tasksExpanded, user } = this.state;

        const pathname = window.location.pathname;

        const initials = user.username
            ? user.username.slice(0, 2).toUpperCase()
            : (user.role || '?').slice(0, 2).toUpperCase();

        const isAnyProjectsActive = ["/projects", "/projects/new", "/projects/archived"].includes(pathname);
        const isAnyTasksActive = ["/tasks/my-tasks", "/tasks/backlog"].includes(pathname);

        return (
            <div className="sidebar-container">
                <aside className={`sidebar-aside${collapsed ? ' collapsed' : ''}`}>

                    {/* Top Section */}
                    <div className="sb-top">
                        <div className="sb-logo-area">
                            {!collapsed && <span className="sb-logo-text">Task Master</span>}
                        </div>
                        <button className="sb-burger" onClick={this.toggleSidebar} aria-label="Toggle sidebar">
                            <Menu size={20} />
                        </button>
                    </div>

                    <nav className="sb-nav">

                        {/* ── OVERVIEW ── */}
                        <div className="sb-section">
                            <p className="sb-section-label">Overview</p>
                            <ul className="sidebar-list">
                                {this.renderSimpleItem({ path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard', pathname })}
                            </ul>
                        </div>

                        {/* ── WORKSPACE ── */}
                        <div className="sb-section">
                            <p className="sb-section-label">Workspace</p>
                            <ul className="sidebar-list">
                                {this.renderAccordion({
                                    key: 'projects',
                                    expanded: projectsExpanded,
                                    active: isAnyProjectsActive,
                                    icon: <Folder size={20} />,
                                    label: 'Projects',
                                    items: [
                                        { path: '/projects', title: 'All Projects' },
                                        { path: '/projects/new', title: 'New Project' },
                                        { path: '/projects/archived', title: 'Archived' },
                                    ],
                                })}
                                {this.renderAccordion({
                                    key: 'tasks',
                                    expanded: tasksExpanded,
                                    active: isAnyTasksActive,
                                    icon: <CheckSquare size={20} />,
                                    label: 'Tasks',
                                    items: [
                                        { path: '/tasks/my-tasks', title: 'Assigned to Me' },
                                        { path: '/tasks/backlog', title: 'Backlog' },
                                    ],
                                })}
                                {this.renderSimpleItem({ path: '/branches', icon: <GitBranch size={20} />, label: 'Branches', pathname })}
                            </ul>
                        </div>

                        {/* ── TEAM ── */}
                        <div className="sb-section">
                            <p className="sb-section-label">Team</p>
                            <ul className="sidebar-list">
                                {this.renderSimpleItem({ path: '/team', icon: <Users size={20} />, label: 'Members', pathname })}
                            </ul>
                        </div>
                    </nav>

                    {/* Bottom User Profile Section */}
                    <div className="user-panel">
                        <div className="user-row">
                            <div className="sb-avatar">{initials}</div>
                            {!collapsed && (
                                <div className="user-info">
                                    <p className="userName">{user.username}</p>
                                    <p className="userRole">{user.role || 'No role assigned'}</p>
                                    <a
                                        className="change-password"
                                        onClick={() => this.setState({ showChangePasswordModal: true })}
                                    >
                                        Change password
                                    </a>
                                </div>
                            )}
                            {!collapsed && (
                                <button className="sb-logout-btn" onClick={this.handleLogout} aria-label="Log out">
                                    <LogOut size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                </aside>

                <main className="children">
                    {this.passProps()}
                </main>
            </div>
        );
    }
}

export default Sidebar;