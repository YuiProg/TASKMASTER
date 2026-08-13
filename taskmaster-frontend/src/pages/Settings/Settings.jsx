import React from 'react';
import { Helmet } from 'react-helmet-async';
import { PanelContainer, PanelPage } from '../../components/TRCOMPONENTS/TRPanelPage/TRPanelPage';
import Button from '../../components/TRCOMPONENTS/TRButton/Button';
import Spinner from '../../components/Spinner/Spinner.jsx';
import { useAuthStore } from '../../context/AuthStore.js';
import { useSettingsStore } from '../../context/SettingsStore.js';
import { 
  User, 
  Mail, 
  Bell, 
  Lock, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import '../../styles/pages/Settings.scss';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    
    const settingsState = useSettingsStore.getState();

    this.state = {
      activeTab: 'email',
      user: useAuthStore.getState().user,
      settings: settingsState.settings,
      isLoading: settingsState.isLoading,
      isSaving: settingsState.isSaving,
    };
  }

  componentDidMount() {
    this.unsubscribeAuth = useAuthStore.subscribe((state) => {
      this.setState({ user: state.user });
    });

    this.unsubscribeSettings = useSettingsStore.subscribe((state) => {
      this.setState({
        settings: state.settings,
        isLoading: state.isLoading,
        isSaving: state.isSaving,
      });
    });

    useSettingsStore.getState().fetchSettings();
  }

  componentWillUnmount() {
    if (this.unsubscribeAuth) this.unsubscribeAuth();
    if (this.unsubscribeSettings) this.unsubscribeSettings();
  }

  setActiveTab = (tab) => {
    this.setState({ activeTab: tab });
  };

  handleToggle = (key) => {
    this.setState((prevState) => {
      const updatedSettings = {
        ...prevState.settings,
        [key]: !prevState.settings[key],
      };
      
      useSettingsStore.getState().setSettings(updatedSettings);

      return { settings: updatedSettings };
    });
  };

  handleReset = () => {
    useSettingsStore.getState().fetchSettings();
  };

  handleApplyChanges = async (e) => {
    if (e) e.preventDefault();
    await useSettingsStore.getState().saveSettings();
  };

  handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      console.log("Delete account triggered");
    }
  };

  renderToggleItem = (key, title, description, icon) => {
    const { settings } = this.state;
    const isChecked = Boolean(settings[key]);

    return (
      <div className={`settings-card ${isChecked ? 'settings-card--active' : ''}`}>
        <div className="settings-card__icon-wrapper">
          {icon}
        </div>
        <div className="settings-card__content">
          <span className="settings-card__title">{title}</span>
          <span className="settings-card__desc">{description}</span>
        </div>
        <label className="switch">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => this.handleToggle(key)}
            disabled={key !== 'locked' && settings.locked}
          />
          <span className="slider round"></span>
        </label>
      </div>
    );
  };

  render() {
    const { activeTab, settings, isLoading, isSaving, user } = this.state;

    return (
      <PanelPage titlePage="Settings" subTitle="Manage your account preferences, privacy, and notifications.">
        <Helmet>
          <title>Settings | TaskMaster</title>
        </Helmet>

        <div className="settings-layout">
          {/* Sidebar Navigation */}
          <aside className="settings-sidebar">
            <div className="settings-sidebar__top">
              <div className="settings-user-card">
                <div className="settings-user-card__avatar">
                  {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="settings-user-card__info">
                  <span className="settings-user-card__name">{user?.username || 'User Account'}</span>
                  <span className="settings-user-card__email">{user?.email || 'user@taskmaster.io'}</span>
                </div>
              </div>

              <nav className="settings-nav">
                <button
                  type="button"
                  className={`settings-nav__item ${activeTab === 'email' ? 'settings-nav__item--active' : ''}`}
                  onClick={() => this.setActiveTab('email')}
                >
                  <div className="settings-nav__item-left">
                    <Mail size={18} />
                    <span>Email Preferences</span>
                  </div>
                  <ChevronRight size={16} className="settings-nav__arrow" />
                </button>

                <button
                  type="button"
                  className={`settings-nav__item ${activeTab === 'profile' ? 'settings-nav__item--active' : ''}`}
                  onClick={() => this.setActiveTab('profile')}
                >
                  <div className="settings-nav__item-left">
                    <User size={18} />
                    <span>Profile & Security</span>
                  </div>
                  <ChevronRight size={16} className="settings-nav__arrow" />
                </button>
              </nav>
            </div>

            <div className="settings-sidebar__footer">
              <Sparkles size={14} />
              <span>TaskMaster Pro Active</span>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="settings-content">
            <PanelContainer>
              {isLoading ? (
                <div className="settings-loading">
                  <Spinner size={32} strokeWidth={3} color="#22c55e" trackColor="rgba(255, 255, 255, 0.1)" />
                  <span>Loading preferences...</span>
                </div>
              ) : (
                <div className="settings-panel">
                  {/* Top Portion */}
                  <div className="settings-panel__body">
                    <div className="settings-panel__header">
                      <div>
                        <h2 className="settings-panel__title">
                          {activeTab === 'email' ? 'Email Notifications' : 'Profile & Security Settings'}
                        </h2>
                        <p className="settings-panel__subtitle">
                          {activeTab === 'email' 
                            ? 'Control when and how TaskMaster contacts you via email.' 
                            : 'Manage account access controls and critical actions.'}
                        </p>
                      </div>
                      {settings.locked && (
                        <span className="settings-badge settings-badge--locked">
                          <Lock size={12} /> Preferences Locked
                        </span>
                      )}
                    </div>

                    {/* Settings Item List */}
                    <div className="settings-grid">
                      {activeTab === 'email' && (
                        <>
                          {this.renderToggleItem(
                            'sendEmailUponProjectCreation',
                            'Project Creation',
                            'Receive instant updates when a new project workspace is provisioned.',
                            <Sparkles size={20} />
                          )}
                          {this.renderToggleItem(
                            'sendEmailUponTaskCreation',
                            'Task Creation',
                            'Get notified whenever a new task is created within your scope.',
                            <Bell size={20} />
                          )}
                          {this.renderToggleItem(
                            'sendEmailUponLogin',
                            'Security Logins',
                            'Receive security confirmation emails whenever your account logs in.',
                            <Lock size={20} />
                          )}
                          {this.renderToggleItem(
                            'sendEmailUponTaskUpdate',
                            'Task Status Updates',
                            'Stay informed on status shifts, assignments, and scope changes.',
                            <CheckCircle2 size={20} />
                          )}
                          {this.renderToggleItem(
                            'sendDailyEmailTaskUpdates',
                            'Daily Progress Digest',
                            'Receive a daily summary report of open tasks and impending deadlines.',
                            <Mail size={20} />
                          )}
                        </>
                      )}

                      {activeTab === 'profile' && (
                        <>
                          {this.renderToggleItem(
                            'locked',
                            'Lock Profile Preferences',
                            'Freeze all current configuration choices to prevent accidental modifications.',
                            <Lock size={20} />
                          )}

                          <div className="danger-zone">
                            <div className="danger-zone__content">
                              <div className="danger-zone__icon">
                                <ShieldAlert size={22} />
                              </div>
                              <div className="danger-zone__info">
                                <span className="danger-zone__title">Delete Account Workspace</span>
                                <span className="danger-zone__desc">
                                  Permanently purge your profile, ongoing tasks, and associated data. This action is non-reversible.
                                </span>
                              </div>
                            </div>
                            <Button
                              text="Delete Account"
                              customWidth={150}
                              className="btn--danger"
                              onClick={this.handleDeleteAccount}
                              disabled={isSaving || settings.locked}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Bottom Actions Footer */}
                  <div className="settings-actions">
                    <Button
                      text="Reset Changes"
                      customWidth={150}
                      className="btn--secondary"
                      onClick={this.handleReset}
                      disabled={isSaving}
                    />
                    <Button
                      text={isSaving ? 'Saving...' : 'Apply Changes'}
                      customWidth={160}
                      className="btn--primary"
                      onClick={this.handleApplyChanges}
                      disabled={isSaving}
                    />
                  </div>
                </div>
              )}
            </PanelContainer>
          </main>
        </div>
      </PanelPage>
    );
  }
}

export default Settings;