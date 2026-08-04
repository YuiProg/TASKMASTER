import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import './Register.scss';
import { InputForm, TRInputFormPanel } from '../../components/TRCOMPONENTS/TRInputForm/TRInputForm';
import Button from '../../components/TRCOMPONENTS/TRButton/Button';
import { InputField } from '../../components/TRCOMPONENTS/TRInputField/InputFIeld';
import { useAuthStore } from '../../context/AuthStore';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { register, isLoading, error, clearError } = useAuthStore();

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    register(username, email, password, confirmPassword);
  };

  const registerContent = (
    <div className="tr-register">
      {/* Left Visual Hero Section */}
      <div className="tr-register__hero">
        <div className="tr-register__hero-overlay" />
        <div className="tr-register__hero-pattern" />

        <div className="tr-register__hero-content">
          <div className="tr-register__brand">
            <div className="tr-register__brand-mark">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="tr-register__brand-name">TASK MASTER</span>
          </div>

          <div className="tr-register__hero-text">
            <span className="tr-register__badge">🚀 GET STARTED IN SECONDS</span>
            <h2>Build momentum with structured task workflows.</h2>
            <p>Join thousands of teams streamlining project delivery, sprint tracking, and daily collaboration.</p>
          </div>

          <div className="tr-register__glass-card">
            <div className="tr-register__stat-number">100% Free Trial</div>
            <div className="tr-register__stat-label">Full access to all project management tools, zero setup fees.</div>
          </div>

          <div className="tr-register__hero-footer">
            <p>© {new Date().getFullYear()} Task Master Inc. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="tr-register__form-section">
        <div className="tr-register__form-wrapper">

          {/* Mobile Brand Header */}
          <div className="tr-register__brand tr-register__brand--mobile">
            <div className="tr-register__brand-mark">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="tr-register__brand-name">TASK MASTER</span>
          </div>

          <TRInputFormPanel
            header="Create an account"
            subHeader="Start organizing your tasks today."
            onSubmit={handleSubmit}
            noBtn
          >
            <InputForm noBtn className="tr-register__inner-form">
              {error && <p className="tr-register__form-error">{error}</p>}

              <InputField
                placeholder="Username"
                text
                value={username}
                onChange={setUsername}
                disabled={isLoading}
              />
              <InputField
                placeholder="Email address"
                email
                value={email}
                onChange={setEmail}
                disabled={isLoading}
              />
              <InputField
                placeholder="Password"
                password
                value={password}
                onChange={setPassword}
                disabled={isLoading}
              />
              <InputField
                placeholder="Confirm password"
                password
                value={confirmPassword}
                onChange={setConfirmPassword}
                disabled={isLoading}
              />

              <Button
                submit
                maxWidth
                text={isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                disabled={isLoading}
                customBorder="none"
                className="tr-register__btn"
                onClick={handleSubmit}
              />
            </InputForm>
          </TRInputFormPanel>

          <p className="tr-register__signup-hint">
            Already have an account? <Link to="/" onClick={clearError}>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(registerContent, document.body);
}

export default Register;