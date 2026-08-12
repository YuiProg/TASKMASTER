import React from 'react';
import { Helmet } from 'react-helmet-async';
import { PanelContainer, PanelPage } from '../../components/TRCOMPONENTS/TRPanelPage/TRPanelPage';
import Button from '../../components/TRCOMPONENTS/TRButton/Button';
import { useAuthStore } from '../../context/AuthStore.js';
import { useSettingsStore } from '../../context/SettingsStore.js';
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
    // Subscribe to Auth Store
    this.unsubscribeAuth = useAuthStore.subscribe((state) => {
      this.setState({ user: state.user });
    });

    // Subscribe to Settings Store
    this.unsubscribeSettings = useSettingsStore.subscribe((state) => {
      this.setState({
        settings: state.settings,
        isLoading: state.isLoading,
        isSaving: state.isSaving,
      });
    });

    // Fetch user settings from API
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
    // Update local component state immediately so the checkbox UI changes instantly
    this.setState((prevState) => {
      const updatedSettings = {
        ...prevState.settings,
        [key]: !prevState.settings[key],
      };
      
      // Sync immediately to the Zustand store
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

  render() {
    const { activeTab, settings, isLoading, isSaving } = this.state;

    return (
      <PanelPage titlePage="Settings" subTitle="Manage your account settings and preferences.">
        <Helmet>
          <title>Settings | TaskMaster</title>
        </Helmet>

        <div className="settings-page__content">
          {/* Glassmorphic Sidebar Navigation Box */}
          <aside className="settings-nav-box">
            <nav className="settings-nav">
              <button
                type="button"
                className={`settings-nav__item ${activeTab === 'profile' ? 'settings-nav__item--active' : ''}`}
                onClick={() => this.setActiveTab('profile')}
              >
                Profile Settings
              </button>
              <button
                type="button"
                className={`settings-nav__item ${activeTab === 'email' ? 'settings-nav__item--active' : ''}`}
                onClick={() => this.setActiveTab('email')}
              >
                Email Settings
              </button>
            </nav>
          </aside>

          {/* Main Content Area */}
          <div className="settings-panel-wrapper">
            {activeTab === 'email' && (
              <PanelContainer title="Email Settings">
                {isLoading ? (
                  <p className="settings-panel__placeholder">Loading settings...</p>
                ) : (
                  <>
                    <div className="toggle-group">
                      <div className="toggle-item">
                        <div className="toggle-item__info">
                          <span className="toggle-item__label">Project Creation Emails</span>
                          <span className="toggle-item__desc">Send email when a new project is created</span>
                        </div>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={Boolean(settings.sendEmailUponProjectCreation)}
                            onChange={() => this.handleToggle('sendEmailUponProjectCreation')}
                            disabled={settings.locked}
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>

                      <div className="toggle-item">
                        <div className="toggle-item__info">
                          <span className="toggle-item__label">Task Creation Emails</span>
                          <span className="toggle-item__desc">Send email when a new task is created</span>
                        </div>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={Boolean(settings.sendEmailUponTaskCreation)}
                            onChange={() => this.handleToggle('sendEmailUponTaskCreation')}
                            disabled={settings.locked}
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>

                      <div className="toggle-item">
                        <div className="toggle-item__info">
                          <span className="toggle-item__label">Login Notifications</span>
                          <span className="toggle-item__desc">Send email notification upon successful login</span>
                        </div>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={Boolean(settings.sendEmailUponLogin)}
                            onChange={() => this.handleToggle('sendEmailUponLogin')}
                            disabled={settings.locked}
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>

                      <div className="toggle-item">
                        <div className="toggle-item__info">
                          <span className="toggle-item__label">Task Update Emails</span>
                          <span className="toggle-item__desc">Send email when task statuses or details update</span>
                        </div>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={Boolean(settings.sendEmailUponTaskUpdate)}
                            onChange={() => this.handleToggle('sendEmailUponTaskUpdate')}
                            disabled={settings.locked}
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>

                      <div className="toggle-item">
                        <div className="toggle-item__info">
                          <span className="toggle-item__label">Daily Task Digest</span>
                          <span className="toggle-item__desc">Send daily email updates regarding ongoing tasks</span>
                        </div>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={Boolean(settings.sendDailyEmailTaskUpdates)}
                            onChange={() => this.handleToggle('sendDailyEmailTaskUpdates')}
                            disabled={settings.locked}
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>
                    </div>

                    <div className="settings-panel__actions">
                      <Button
                        text="Reset Changes"
                        customWidth={160}
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
                  </>
                )}
              </PanelContainer>
            )}

            {activeTab === 'profile' && (
              <PanelContainer title="Profile Settings">
                {isLoading ? (
                  <p className="settings-panel__placeholder">Loading settings...</p>
                ) : (
                  <>
                    <div className="toggle-group">
                      <div className="toggle-item">
                        <div className="toggle-item__info">
                          <span className="toggle-item__label">Lock Profile Preferences</span>
                          <span className="toggle-item__desc">Prevent further modifications to your account settings</span>
                        </div>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={Boolean(settings.locked)}
                            onChange={() => this.handleToggle('locked')}
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>
                    </div>

                    <div className="danger-zone">
                      <div className="danger-zone__info">
                        <span className="danger-zone__title">Delete Account</span>
                        <span className="danger-zone__desc">
                          Permanently delete your account and remove all associated data.
                        </span>
                      </div>
                      <Button
                        text="Delete Account"
                        customWidth={160}
                        className="btn--danger"
                        onClick={this.handleDeleteAccount}
                        disabled={isSaving || settings.locked}
                      />
                    </div>

                    <div className="settings-panel__actions">
                      <Button
                        text="Reset Changes"
                        customWidth={160}
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
                  </>
                )}
              </PanelContainer>
            )}
          </div>
        </div>
      </PanelPage>
    );
  }
}

export default Settings;