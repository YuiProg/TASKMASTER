import React from "react";
import { useAuthStore } from "../../context/AuthStore";
import { Link } from "react-router-dom";
import MobileNavContext from "../../context/MobileNavContext";
import './Sidebar.scss';
import {
    LayoutDashboard, Folder, CheckSquare, Users,
    LogOut, Menu, X, ChevronDown, Settings,

    Rotate3D
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
            // Off-canvas drawer state for ≤749px — always starts closed,
            // regardless of the desktop collapsed/expanded state above.
            mobileNavOpen: false,
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

    isCollapsed = () => this.state.collapsed && !this.state.mobileNavOpen;

    toggleMobileNav = () => {
        this.setState(prev => ({ mobileNavOpen: !prev.mobileNavOpen }));
    }

    closeMobileNav = () => {
        this.setState({ mobileNavOpen: false });
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
        const collapsed = this.isCollapsed();
        return (
            <li className={`sidebar__row${expanded ? ' sidebar__row--expanded' : ''}${active ? ' sidebar__row--parent-active' : ''}`}>
                <a href={`#${key}`} onClick={this.toggleMenu(`${key}Expanded`)} className="sidebar__dropdown-trigger">
                    <div className="sidebar__trigger-left">
                        <span className="sidebar__icon-wrap">{icon}</span>
                        <span className="sidebar__title">{label}</span>
                    </div>
                    {!collapsed && (
                        <ChevronDown className={`sidebar__chevron${expanded ? ' sidebar__chevron--rotated' : ''}`} size={16} />
                    )}
                </a>
                {collapsed && <span className="sidebar__tooltip">{tooltip || label}</span>}
                <ul className="sidebar__submenu-list">
                    {items.map(({ path, title }) => {
                        const pathname = window.location.pathname;
                        return (
                            <li key={path} className={`sidebar__sub-row${pathname === path ? ' sidebar__sub-row--active' : ''}`}>
                                <Link to={path} onClick={this.closeMobileNav}>
                                    <span className="sidebar__sub-dot"></span>
                                    <span className="sidebar__sub-title">{title}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </li>
        );
    }

    renderSimpleItem({ path, icon, label, pathname }) {
        const collapsed = this.isCollapsed();
        return (
            <li className={`sidebar__row${pathname === path ? ' sidebar__row--active' : ''}`}>
                <Link to={path} onClick={this.closeMobileNav}>
                    <span className="sidebar__icon-wrap">{icon}</span>
                    <span className="sidebar__title">{label}</span>
                </Link>
                {collapsed && <span className="sidebar__tooltip">{label}</span>}
            </li>
        );
    }

    render() {
        const { mobileNavOpen, projectsExpanded, tasksExpanded, user } = this.state;
        const isCollapsed = this.isCollapsed();

        const pathname = window.location.pathname;

        const displayName = user?.username || '';
        const displayEmail = user?.email || '';

        const initials = user?.username
            ? user.username.slice(0, 2).toUpperCase()
            : '?';

        const isAnyProjectsActive = ["/projects", "/projects/new", "/projects/archived", '/projects/my-projects'].includes(pathname);
        const isAnyTasksActive = ["/tasks/my-tasks", "/tasks/backlog", '/tasks/open-tasks'].includes(pathname);

        return (
            <div className="sidebar">
                {/* Backdrop — only rendered/visible on mobile drawer mode */}
                <div
                    className={`sidebar__backdrop${mobileNavOpen ? ' sidebar__backdrop--visible' : ''}`}
                    onClick={this.closeMobileNav}
                    aria-hidden="true"
                />

                <aside className={`sidebar__aside${isCollapsed ? ' sidebar__aside--collapsed' : ''}${mobileNavOpen ? ' sidebar__aside--mobile-open' : ''}`}>

                    {/* Top Section */}
                    <div className="sidebar__top">
                        <div className="sidebar__logo-area">
                            {!isCollapsed && <span className="sidebar__logo-text">Task Master</span>}
                        </div>
                        <button className="sidebar__burger sidebar__burger--collapse" onClick={this.toggleSidebar} aria-label="Toggle sidebar">
                            <Menu size={20} />
                        </button>
                        <button className="sidebar__burger sidebar__burger--close" onClick={this.closeMobileNav} aria-label="Close menu">
                            <X size={20} />
                        </button>
                    </div>

                    <nav className="sidebar__nav">

                        {/* ── OVERVIEW ── */}
                        <div className="sidebar__section">
                            <p className="sidebar__section-label">Overview</p>
                            <ul className="sidebar__list">
                                {this.renderSimpleItem({ path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard', pathname })}
                            </ul>
                        </div>

                        {/* ── WORKSPACE ── */}
                        <div className="sidebar__section">
                            <p className="sidebar__section-label">Workspace</p>
                            <ul className="sidebar__list">
                                {this.renderAccordion({
                                    key: 'projects',
                                    expanded: projectsExpanded,
                                    active: isAnyProjectsActive,
                                    icon: <Folder size={20} />,
                                    label: 'Projects',
                                    items: [
                                        { path: '/projects', title: 'Assigned Projects' },
                                        { path: '/projects/my-projects', title: 'Your Projects' },
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
                                        { path: '/tasks/created-tasks', title: 'Filed Tasks' },
                                        { path: '/tasks/backlog', title: 'Backlog'}
                                    ],
                                })}
                                {this.renderSimpleItem({ path: '/sprint', icon: <Rotate3D size={20} />, label: 'Sprint', pathname })}
                            </ul>
                        </div>

                        {/* ── TEAM ── */}
                        <div className="sidebar__section">
                            <p className="sidebar__section-label">Team</p>
                            <ul className="sidebar__list">
                                {this.renderSimpleItem({ path: '/team', icon: <Users size={20} />, label: 'Members', pathname })}
                            </ul>
                        </div>

                        {/* ── SYSTEM ── */}
                        <div className="sidebar__section">
                            <p className="sidebar__section-label">System</p>
                            <ul className="sidebar__list">
                                {this.renderSimpleItem({ path: '/settings', icon: <Settings size={20} />, label: 'Settings', pathname })}
                            </ul>
                        </div>
                    </nav>

                    {/* Bottom User Profile Section */}
                    <div className="sidebar__user-panel">
                        <div className="sidebar__user-row">
                            {user ? (
                                <>
                                    <div className="sidebar__avatar">{initials}</div>
                                    {!isCollapsed && (
                                        <div className="sidebar__user-info">
                                            <p className="sidebar__user-name">{displayName}</p>
                                            <p className="sidebar__user-role">{displayEmail}</p>
                                            <a
                                                className="sidebar__change-password"
                                                onClick={() => this.setState({ showChangePasswordModal: true })}
                                            >
                                                Change password
                                            </a>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className="sidebar__skeleton sidebar__skeleton-avatar" />
                                    {!isCollapsed && (
                                        <div className="sidebar__user-info">
                                            <div className="sidebar__skeleton sidebar__skeleton-line sidebar__skeleton-line--name" />
                                            <div className="sidebar__skeleton sidebar__skeleton-line sidebar__skeleton-line--email" />
                                        </div>
                                    )}
                                </>
                            )}
                            {!isCollapsed && user && (
                                <button className="sidebar__logout-btn" onClick={this.handleLogout} aria-label="Log out">
                                    <LogOut size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                </aside>

                <MobileNavContext.Provider value={{ toggleMobileNav: this.toggleMobileNav }}>
                    <main className="sidebar__content">
                        {this.passProps()}
                    </main>
                </MobileNavContext.Provider>
            </div>
        );
    }
}

export default Sidebar;