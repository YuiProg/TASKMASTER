import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.scss';
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
    <div className="tr-login">
      <div className="tr-login__shell">

        {/* Brand Logo Header */}
        <div className="tr-login__brand">
          <div className="tr-login__brand-mark">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span className="tr-login__brand-name">TASK MASTER</span>
        </div>

        {/* Login Card */}
        <div className="tr-login__card">
          <TRInputFormPanel
            header="Welcome back"
            subHeader="Log in to keep your tasks on track."
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
        </div>

        <p className="tr-login__signup-hint">
          Don&apos;t have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
