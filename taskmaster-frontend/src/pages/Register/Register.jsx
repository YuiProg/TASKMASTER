import { useState } from 'react';
import './Register.css';
import { InputForm, TRInputFormPanel } from '../../components/TRCOMPONENTS/TRInputForm/TRInputForm';
import Button from '../../components/TRCOMPONENTS/TRButton/Button';
import InputField from '../../components/TRCOMPONENTS/TRInputField/InputFIeld';
import { Link } from 'react-router-dom';

function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ fullName, email, password, confirmPassword });
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
              <InputField
                placeholder="Full name"
                text
                onChange={setFullName}
              />
              <InputField
                placeholder="Email address"
                email
                onChange={setEmail}
              />
              <InputField
                placeholder="Password"
                password
                onChange={setPassword}
              />
              <InputField
                placeholder="Confirm password"
                password
                onChange={setConfirmPassword}
              />

              <Button
                submit
                maxWidth
                text="CREATE ACCOUNT"
                customBorder="none"
                className="tr-login-btn"
                onClick={handleSubmit}
              />
            </InputForm>
          </TRInputFormPanel>
        </div>

        <p className="tr-signup-hint">
          Already have an account? <Link to="/">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;