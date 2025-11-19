import { useNavigate } from 'react-router-dom';
import './Unauthorized.css';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <div className="unauthorized-icon">🔒</div>
        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <p className="unauthorized-hint">
          Please contact your administrator if you believe this is a mistake.
        </p>
        <div className="unauthorized-actions">
          <button onClick={() => navigate(-1)} className="btn-back">
            Go Back
          </button>
          <button onClick={() => navigate('/')} className="btn-home">
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
