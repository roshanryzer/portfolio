import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <>
            <App />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#020617',
                  color: '#e2e8f0',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(148, 163, 184, 0.4)',
                },
                success: {
                  iconTheme: {
                    primary: '#3ece90',
                    secondary: '#020617',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#f97373',
                    secondary: '#020617',
                  },
                },
              }}
            />
          </>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
