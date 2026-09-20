import React, { useEffect } from 'react';

const Modal = ({
  isOpen,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmClass = 'btn-primary',
  showFooter = true,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '1rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="glass-card fade-in"
        style={{
          background: '#FFFFFF',
          width: '100%',
          maxWidth: '480px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            borderBottom: '1px solid var(--border)',
            paddingBottom: '0.75rem',
          }}
        >
          <h3 style={{ margin: 0, color: 'var(--dark)', fontSize: '1.25rem', fontWeight: 700 }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.25rem',
              color: 'var(--text-muted)',
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>
          {children}
        </div>

        {showFooter && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button className="btn btn-outline" onClick={onClose}>
              {cancelText}
            </button>
            {onConfirm && (
              <button className={`btn ${confirmClass}`} onClick={onConfirm}>
                {confirmText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
