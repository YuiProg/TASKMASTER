import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import LoginView from './LoginView';
import RegisterView from './RegisterView';
import ForgotPasswordView from './ForgotPasswordView';
import '../../styles/pages/auth-flow.scss';

const PATH_TO_MODE = {
  '/': 'login',
  '/register': 'register',
  '/forgot-password': 'forgot',
};

const VIEWS = {
  login: LoginView,
  register: RegisterView,
  forgot: ForgotPasswordView,
};

const TITLES = {
  login: 'Log In | TaskMaster',
  register: 'Sign Up | TaskMaster',
  forgot: 'Reset Password | TaskMaster',
};

// Kept a little longer than the CSS animation duration so the exiting
// card never gets yanked out mid-motion.
const TRANSITION_MS = 460;

function enterDirection(enteringMode, exitingMode) {
  if (enteringMode === 'register') return 'right';
  if (enteringMode === 'forgot') return 'bottom';
  if (enteringMode === 'login' && exitingMode === 'register') return 'left';
  if (enteringMode === 'login' && exitingMode === 'forgot') return 'top';
  return 'right';
}

function AuthFlow() {
  const location = useLocation();
  const mode = PATH_TO_MODE[location.pathname] ?? 'login';

  const [renderMode, setRenderMode] = useState(mode);
  const [transition, setTransition] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (mode === renderMode) return;

    const outMode = renderMode;
    setTransition({ outMode, inMode: mode });
    setRenderMode(mode);

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setTransition(null), TRANSITION_MS);
  }, [mode, renderMode]);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const renderView = (m) => {
    const ViewComponent = VIEWS[m];
    return <ViewComponent />;
  };

  return (
    <div className="auth-flow">
      <Helmet>
        <title>{TITLES[renderMode]}</title>
      </Helmet>

      {transition && (
        <div key={`exit-${transition.outMode}`} className="auth-flow__card auth-flow__card--exiting">
          {renderView(transition.outMode)}
        </div>
      )}

      <div
        key={`enter-${renderMode}`}
        className={`auth-flow__card${
          transition ? ` auth-flow__card--entering auth-flow__card--from-${enterDirection(transition.inMode, transition.outMode)}` : ''
        }`}
      >
        {renderView(renderMode)}
      </div>
    </div>
  );
}

export default AuthFlow;
