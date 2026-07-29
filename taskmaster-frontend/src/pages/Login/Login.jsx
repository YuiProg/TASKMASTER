import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { InputForm, TRInputFormPanel } from '../../components/TRCOMPONENTS/TRInputForm/TRInputForm';
import Button from '../../components/TRCOMPONENTS/TRButton/Button';
import { useAuthStore } from '../../context/AuthStore';
import { InputField } from '../../components/TRCOMPONENTS/TRInputField/InputFIeld';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="tr-login-page">
      <div className="tr-login-shell">

        {/* Brand Logo Header */}
        <div className="tr-brand">
          <div className="tr-brand-mark">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span className="tr-brand-name">TASK MASTER</span>
        </div>

        {/* Login Card */}
        <div className="tr-login-card">
          <TRInputFormPanel
            header="Welcome back"
            subHeader="Log in to keep your tasks on track."
            onSubmit={handleSubmit}
            noBtn
          >
            <InputForm noBtn className="tr-login-inner-form">
              {error && <p className="tr-form-error">{error}</p>}

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

              <div className="tr-login-row">
                <a href="#forgot" className="tr-forgot">Forgot password?</a>
              </div>

              <Button
                submit
                maxWidth
                text={isLoading ? 'LOGGING IN...' : 'LOG IN'}
                disabled={isLoading}
                customBorder="none"
                className="tr-login-btn"
              />
            </InputForm>
          </TRInputFormPanel>
        </div>

        <p className="tr-signup-hint">
          Don&apos;t have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;