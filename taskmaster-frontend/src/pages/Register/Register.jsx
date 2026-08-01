import { useState, useEffect } from 'react';
import './Register.css';
import { InputForm, TRInputFormPanel } from '../../components/TRCOMPONENTS/TRInputForm/TRInputForm';
import Button from '../../components/TRCOMPONENTS/TRButton/Button';
import { InputField } from '../../components/TRCOMPONENTS/TRInputField/InputFIeld';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../context/AuthStore';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Extract store values reactively so component re-renders when they change
  const { register, isLoading, error, clearError } = useAuthStore();

  // Clear errors when leaving the page/mounting
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    register(username, email, password, confirmPassword);
  };

  return (
    <div className="tr-login-page">
      <div className="tr-login-shell">

        <div className="tr-brand">
          <div className="tr-brand-mark">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <span className="tr-brand-name">TASK MASTER</span>
        </div>

        <div className="tr-login-card">
          <TRInputFormPanel
            header="Create an account"
            subHeader="Start organizing your tasks today."
            onSubmit={handleSubmit}
            btnTXT="CREATE ACCOUNT"
            isRequired
            noBtn
          >
            <InputForm noBtn>
              {/* Display Error Banner if Error Exists */}
              {error && (
                <div style={{
                  backgroundColor: '#rgba(255, 0, 0, 0.1)',
                  color: '#ff4d4f',
                  border: '1px solid #ff4d4f',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  marginBottom: '16px',
                  fontSize: '14px',
                  textAlign: 'center'
                }}>
                  {error}
                </div>
              )}

              <InputField
                placeholder="Username"
                text
                onChange={setUsername}
                disabled={isLoading}
              />
              <InputField
                placeholder="Email address"
                email
                onChange={setEmail}
                disabled={isLoading}
              />
              <InputField
                placeholder="Password"
                password
                onChange={setPassword}
                disabled={isLoading}
              />
              <InputField
                placeholder="Confirm password"
                password
                onChange={setConfirmPassword}
                disabled={isLoading}
              />

              <Button
                submit
                maxWidth
                text={isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                disabled={isLoading}
                customBorder="none"
                className="tr-login-btn"
                onClick={handleSubmit}
              />
            </InputForm>
          </TRInputFormPanel>
        </div>

        <p className="tr-signup-hint">
          Already have an account? <Link to="/" onClick={clearError}>Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;