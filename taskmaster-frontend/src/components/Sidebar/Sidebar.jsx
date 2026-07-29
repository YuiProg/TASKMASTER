import React from "react";
import { useAuthStore } from "../../context/AuthStore";
import { Link } from "react-router-dom";
import './Sidebar.css';
import {
    LayoutDashboard, Folder, CheckSquare, GitBranch, Users,
    LogOut, Menu, ChevronDown
} from 'lucide-react';

// Safe localStorage helpers — guard against SSR (no `window`) and
// malformed/missing values so this never throws.
const storage = {
    get(key) {
        if (typeof window === 'undefined') return null;
        try {
            const raw = window.localStorage.getItem(key);
            return raw !== null ? JSON.parse(raw) : null;
        } catch (e) {
            console.log(e);
            return null;
        }
    },
    set(key, value) {
        if (typeof window === 'undefined') return;
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.log(e);
            // ignore (e.g. storage disabled/full)
        }
    },
    has(key) {
        if (typeof window === 'undefined') return false;
        try {
            return window.localStorage.getItem(key) !== null;
        } catch (e) {
            console.log(e);
            return false;
        }
    },
};

class Sidebar extends React.Component {
    constructor(props) {
        super(props);

        const savedCollapsed = storage.get('sidebar_collapsed');
        const savedProjectsExpanded = storage.get('sidebar_projectsExpanded');
        const savedTasksExpanded = storage.get('sidebar_tasksExpanded');

        this.state = {
            collapsed: savedCollapsed !== null ? savedCollapsed : false,
            projectsExpanded: savedProjectsExpanded !== null ? savedProjectsExpanded : false,
            tasksExpanded: savedTasksExpanded !== null ? savedTasksExpanded : false,
            showChangePasswordModal: false,
            // No hardcoded fallback anymore — starts null until
            // fetchCurrentUser resolves (or login() has already run).
            user: useAuthStore.getState().user,
        };
    }

    componentDidMount() {
        this.unsubscribeAuth = useAuthStore.subscribe((state) => {
            this.setState({ user: state.user });
        });

        // Actively rehydrate the user rather than only passively waiting
        // on the subscription — otherwise a fresh page load/refresh with
        // no login() call this session leaves `user` stuck at null.
        if (!this.state.user) {
            useAuthStore.getState().fetchCurrentUser();
        }

        const pathname = window.location.pathname;

        const hasSavedProjects = storage.has('sidebar_projectsExpanded');
        const hasSavedTasks = storage.has('sidebar_tasksExpanded');

        if (!hasSavedProjects && ["/projects", "/projects/new", "/projects/archived"].includes(pathname)) {
            this.setState({ projectsExpanded: true });
        }
        if (!hasSavedTasks && ["/tasks/my-tasks", "/tasks/backlog"].includes(pathname)) {
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
        this.setState(prev => {
            const collapsed = !prev.collapsed;
            storage.set('sidebar_collapsed', collapsed);
            return { collapsed };
        });
    }

    toggleMenu = (key) => (e) => {
        e.preventDefault();
        this.setState(prev => {
            const expanded = !prev[key];
            const collapsed = prev.collapsed ? false : prev.collapsed;

            storage.set(`sidebar_${key}`, expanded);
            if (collapsed !== prev.collapsed) {
                storage.set('sidebar_collapsed', collapsed);
            }

            return { [key]: expanded, collapsed };
        });
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

        const displayName = user?.username || '';
        const displayEmail = user?.email || '';

        const initials = user?.username
            ? user.username.slice(0, 2).toUpperCase()
            : '?';

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
                                        { path: '/projects', title: 'Assigned Projects' },
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
                                        { path: '/tasks/open-tasks', title: 'Open Tasks' },
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
                            {user ? (
                                <>
                                    <div className="sb-avatar">{initials}</div>
                                    {!collapsed && (
                                        <div className="user-info">
                                            <p className="userName">{displayName}</p>
                                            <p className="userRole">{displayEmail}</p>
                                            <a
                                                className="change-password"
                                                onClick={() => this.setState({ showChangePasswordModal: true })}
                                            >
                                                Change password
                                            </a>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className="sb-skeleton sb-skeleton-avatar" />
                                    {!collapsed && (
                                        <div className="user-info">
                                            <div className="sb-skeleton sb-skeleton-line sb-skeleton-line-name" />
                                            <div className="sb-skeleton sb-skeleton-line sb-skeleton-line-email" />
                                        </div>
                                    )}
                                </>
                            )}
                            {!collapsed && user && (
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