import { useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="error-code">404</div>
        <div className="error-icon">
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        <h1 className="error-title">Page Not Found</h1>
        <p className="error-message">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        
        <div className="error-actions">
          <button onClick={handleGoHome} className="btn-primary">
            <i className="fas fa-home"></i>
            Go to Dashboard
          </button>
          <button onClick={handleGoBack} className="btn-secondary">
            <i className="fas fa-arrow-left"></i>
            Go Back
          </button>
        </div>

        <div className="error-suggestions">
          <p>You might be interested in:</p>
          <ul>
            <li>
              <a href="/">
                <i className="fas fa-tachometer-alt"></i>
                Dashboard
              </a>
            </li>
            <li>
              <a href="/energy">
                <i className="fas fa-bolt"></i>
                Energy Management
              </a>
            </li>
            <li>
              <a href="/space">
                <i className="fas fa-building"></i>
                Space Management
              </a>
            </li>
            <li>
              <a href="/maintenance">
                <i className="fas fa-tools"></i>
                Maintenance
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
