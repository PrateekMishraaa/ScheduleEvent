// 📁 src/main.jsx (COMPLETE WITH PROVIDERS)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import './index.css'; // Make sure you have this CSS file
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      {/* Toast notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '10px',
            padding: '16px',
          },
          success: {
            icon: '✅',
            style: {
              background: '#10b981',
            },
          },
          error: {
            icon: '❌',
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
      <App />
    </AuthProvider>
  </React.StrictMode>
);