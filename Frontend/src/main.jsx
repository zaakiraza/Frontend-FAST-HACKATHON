// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import './index.css';
import App from './App.jsx';
<<<<<<< HEAD
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
=======
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
>>>>>>> 70f455bc589ab8d18791203d7b70203371692ab7

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AuthProvider>
  // </StrictMode>,
);
