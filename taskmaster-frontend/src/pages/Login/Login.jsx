import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.scss';
import { InputForm, TRInputFormPanel } from '../../components/TRCOMPONENTS/TRInputForm/TRInputForm';
import Button from '../../components/TRCOMPONENTS/TRButton/Button';
import { useAuthStore } from '../../context/AuthStore';
import { InputField } from '../../components/TRCOMPONENTS/TRInputField/InputFIeld';
import packageJson from '../../../package.json'; // Adjust relative path if package.json is in a different parent folder

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const appVersion = packageJson.version || '0.0.0';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="tr-login">
      {/* Left Visual Hero Section */}
      <div className="tr-login__hero">
        <div className="tr-login__hero-overlay" />
        <div className="tr-login__hero-pattern" />
        
        <div className="tr-login__hero-content">
          <div className="tr-login__brand">
            <div className="tr-login__brand-mark">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="tr-login__brand-name">TASK MASTER</span>
          </div>

          <div className="tr-login__hero-text">
            <h2>Master your workflow with effortless precision.</h2>
            <p>Organize, track, and complete your team&apos;s tasks in one central workspace built for modern productivity.</p>
          </div>

          {/* Social Proof Glass Badge */}
          <div className="tr-login__glass-card">
            <div className="tr-login__stat-group">
              <div className="tr-login__stat-number">99.9%</div>
              <div className="tr-login__stat-label">Uptime across 10k+ active sprint boards.</div>
            </div>
          </div>

          <div className="tr-login__hero-footer">
            <p>© {new Date().getFullYear()} OPNEXUS Inc. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="tr-login__form-section">
        <div className="tr-login__form-wrapper">
          
          {/* Mobile-only Header */}
          <div className="tr-login__brand tr-login__brand--mobile">
            <div className="tr-login__brand-mark">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="tr-login__brand-name">TASK MASTER</span>
          </div>

          <TRInputFormPanel
            header="Welcome back"
            subHeader="Log in to access your dashboard & active tasks."
            onSubmit={handleSubmit}
            noBtn
          >
            <InputForm noBtn className="tr-login__inner-form">
              {error && <p className="tr-login__form-error">{error}</p>}

              <InputField
                placeholder="Email address"
                email
                value={email}
                onChange={setEmail}
              />
              <InputField
                placeholder="Password"
                password
                value={password}
                onChange={setPassword}
              />

              <div className="tr-login__row">
                <a href="#forgot" className="tr-login__forgot">Forgot password?</a>
              </div>

              <Button
                submit
                maxWidth
                text={isLoading ? 'LOGGING IN...' : 'LOG IN'}
                disabled={isLoading}
                customBorder="none"
                className="tr-login__btn"
              />
            </InputForm>
          </TRInputFormPanel>

          <p className="tr-login__signup-hint">
            Don&apos;t have an account? <Link to="/register">Sign up</Link>
          </p>

          {/* Version tag placed below sign-up hint with dark text styling */}
          <p 
            className="tr-login__version-tag" 
            style={{ 
              color: '#64748b', 
              fontSize: '12px', 
              textAlign: 'center', 
              marginTop: '12px',
              fontWeight: 500
            }}
          >
            v{appVersion}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;