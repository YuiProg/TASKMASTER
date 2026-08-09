import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import './ForgotPassword.scss';
import { InputForm, TRInputFormPanel } from '../../components/TRCOMPONENTS/TRInputForm/TRInputForm';
import Button from '../../components/TRCOMPONENTS/TRButton/Button';
import { InputField } from '../../components/TRCOMPONENTS/TRInputField/InputFIeld';
import packageJson from '../../../package.json';

const PAGE_TRANSITION_MS = 220;
const STEP_EXIT_MS = 200;
const STEP_ENTER_MS = 300;

const STEPS = [
  { key: 'email', label: 'Email' },
  { key: 'code', label: 'Verify Code' },
  { key: 'password', label: 'New Password' },
];

const HEADERS = {
  1: { title: 'Reset your password', subtitle: "Enter the email linked to your account and we'll send you a code." },
  2: { title: 'Check your email', subtitle: 'Enter the 6-digit code we sent to your email.' },
  3: { title: 'Set a new password', subtitle: 'Choose a new password for your account.' },
};

const BUTTON_TEXT = {
  1: 'SEND CODE',
  2: 'VERIFY CODE',
  3: 'RESET PASSWORD',
};

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [stepTransition, setStepTransition] = useState(null);
  const [leavingTo, setLeavingTo] = useState(null);

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();
  const appVersion = packageJson.version || '0.0.0';

  const changeStep = (nextStep, direction) => {
    setStepTransition({ phase: 'leaving', direction });
    setTimeout(() => {
      setStep(nextStep);
      setStepTransition({ phase: 'entering', direction });
      setTimeout(() => setStepTransition(null), STEP_ENTER_MS);
    }, STEP_EXIT_MS);
  };

  const goToLogin = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (leavingTo) return;
    setLeavingTo('login');
    setTimeout(() => navigate('/', { state: { fromForgot: true } }), PAGE_TRANSITION_MS);
  };

  const goNextStep = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (step < STEPS.length) {
      changeStep(step + 1, 'forward');
    }
  };

  const goBackStep = () => {
    if (step === 1) return;
    changeStep(step - 1, 'backward');
  };

  const stepContentClass = stepTransition
    ? ` tr-forgot__step-content--${stepTransition.phase}-${stepTransition.direction}`
    : '';

  return (
    <div className={`tr-forgot${leavingTo ? ` tr-forgot--leaving-${leavingTo}` : ''}`}>
      <div className="tr-forgot__container">
        <div className="tr-forgot__brand">
          <div className="tr-forgot__brand-mark">
            <img src="/taskmaster.svg" alt="Task Master Logo" width="18" height="18" />
          </div>
          <span className="tr-forgot__brand-name">TASK MASTER</span>
        </div>

        <div className="tr-forgot__stepper">
          {STEPS.map((s, idx) => {
            const num = idx + 1;
            const state = num < step ? 'done' : num === step ? 'active' : 'upcoming';
            return (
              <div className="tr-forgot__step-group" key={s.key}>
                <div className="tr-forgot__step">
                  <div className={`tr-forgot__step-circle tr-forgot__step-circle--${state}`}>
                    {state === 'done' ? <Check size={16} /> : num}
                  </div>
                  <span className={`tr-forgot__step-label tr-forgot__step-label--${state}`}>{s.label}</span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`tr-forgot__step-line${num < step ? ' tr-forgot__step-line--filled' : ''}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="tr-forgot__card">
          <div className={`tr-forgot__step-content${stepContentClass}`}>
            <TRInputFormPanel
              header={HEADERS[step].title}
              subHeader={HEADERS[step].subtitle}
              onSubmit={goNextStep}
              noBtn
            >
              <InputForm noBtn>
                {step === 1 && (
                  <InputField
                    placeholder="Email address"
                    email
                    value={email}
                    onChange={setEmail}
                  />
                )}

                {step === 2 && (
                  <InputField
                    placeholder="Verification code"
                    number
                    maxLength={6}
                    value={code}
                    onChange={setCode}
                  />
                )}
                {step === 2 && (
                  <div className="tr-forgot__row">
                    <a className="tr-forgot__resend">Resend code</a>
                  </div>
                )}

                {step === 3 && (
                  <InputField
                    placeholder="New password"
                    password
                    value={password}
                    onChange={setPassword}
                  />
                )}
                {step === 3 && (
                  <InputField
                    placeholder="Confirm new password"
                    password
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                  />
                )}

                <Button
                  submit
                  maxWidth
                  text={BUTTON_TEXT[step]}
                  customBorder="none"
                  className="tr-forgot__btn"
                  onClick={goNextStep}
                />
              </InputForm>
            </TRInputFormPanel>

            {step > 1 && (
              <button type="button" className="tr-forgot__back-step" onClick={goBackStep}>
                &larr; Back
              </button>
            )}
          </div>
        </div>

        <p className="tr-forgot__signup-hint">
          Remembered your password? <Link to="/" onClick={goToLogin}>Log in</Link>
        </p>

        <p
          className="tr-forgot__version-tag"
          style={{
            color: '#8f8f8f',
            fontSize: '12px',
            textAlign: 'center',
            marginTop: '12px',
            fontWeight: 500,
          }}
        >
          v{appVersion}
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
