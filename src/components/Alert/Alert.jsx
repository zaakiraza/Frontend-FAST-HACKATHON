import { useEffect, useState } from 'react';
import './Alert.css';

const Alert = ({ 
  type = 'info', 
  message, 
  dismissible = false, 
  onDismiss,
  autoClose = 0 
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoClose > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, autoClose);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose]);

  const handleDismiss = () => {
    setVisible(false);
    if (onDismiss) {
      setTimeout(onDismiss, 300); // Wait for animation
    }
  };

  if (!visible) return null;

  const icons = {
    success: '✓',
    warning: '⚠',
    danger: '✕',
    info: 'ℹ'
  };

  return (
    <div className={`alert alert-${type} ${visible ? 'alert-show' : 'alert-hide'}`}>
      <div className="alert-content">
        <span className="alert-icon">{icons[type]}</span>
        <span className="alert-message">{message}</span>
      </div>
      {dismissible && (
        <button className="alert-close" onClick={handleDismiss} aria-label="Close">
          ✕
        </button>
      )}
    </div>
  );
};

export default Alert;
