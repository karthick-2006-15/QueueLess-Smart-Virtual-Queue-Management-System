import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    warning: (msg) => addToast(msg, 'warning'),
    info: (msg) => addToast(msg, 'info'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            <i
              className={`fa-solid ${
                t.type === 'success'
                  ? 'fa-circle-check'
                  : t.type === 'error'
                  ? 'fa-circle-xmark'
                  : 'fa-circle-exclamation'
              }`}
              style={{
                color:
                  t.type === 'success'
                    ? 'var(--secondary)'
                    : t.type === 'error'
                    ? 'var(--danger)'
                    : 'var(--warning)',
                fontSize: '1.25rem',
              }}
            ></i>
            <span style={{ fontWeight: 500 }}>{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                marginLeft: 'auto',
                color: 'var(--text-muted)',
              }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
