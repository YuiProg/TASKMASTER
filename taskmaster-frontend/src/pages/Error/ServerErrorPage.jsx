import './ServerErrorPage.scss';

export default function ServerErrorPage({ error, reset }) {
  return (
    <div className="server-error">
      <div className="server-error__card">
        {/* <span className="server-error__badge">500 ERROR</span> */}

        <h1 className="server-error__title">Internal Server Error</h1>
        <p className="server-error__desc">
          Something went wrong on our end. We've been notified and are actively working to resolve the issue.
        </p>

        {error && (
          <div className="server-error__details">
            <p className="server-error__details-text">
              <strong>Error:</strong> {error.message || 'An unexpected error occurred.'}
            </p>
          </div>
        )}

        <div className="server-error__actions">
          {reset && (
            <button className="server-error__btn server-error__btn--primary" onClick={reset}>
              Try Again
            </button>
          )}
          <a href="/" className="server-error__btn server-error__btn--ghost">
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}