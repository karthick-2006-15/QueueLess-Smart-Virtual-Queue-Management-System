import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQueue } from '../context/QueueContext';

const Navbar = ({ toggleSidebar }) => {
  const { user, isAuthenticated } = useAuth();
  const { activeQueue } = useQueue();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="container nav-container" style={{ maxWidth: '100%', padding: '0 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {toggleSidebar && (
            <button
              onClick={toggleSidebar}
              className="btn btn-outline"
              style={{
                padding: '0.4rem 0.6rem',
                display: 'none',
                cursor: 'pointer',
              }}
              id="sidebarToggleBtn"
            >
              <i className="fa-solid fa-bars"></i>
            </button>
          )}
          <Link to="/" className="logo">
            <i className="fa-solid fa-layer-group" style={{ color: 'var(--primary)' }}></i>
            Queue<span>Less</span>
          </Link>
        </div>

        <div className="nav-links">
          {isAuthenticated ? (
            <>
              {activeQueue && (
                <Link
                  to="/queue"
                  className="badge badge-warning"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    textDecoration: 'none',
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--warning)',
                    }}
                  ></span>
                  Active: {activeQueue.tokenNumber}
                </Link>
              )}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  borderLeft: '1px solid var(--border)',
                  paddingLeft: '1.5rem',
                  marginLeft: '0.5rem',
                  cursor: 'pointer',
                }}
                onClick={() => navigate('/profile')}
              >
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.name || 'User'
                  )}&background=EEF2FF&color=4F46E5&bold=true`}
                  alt="Profile"
                  style={{ borderRadius: '50%', width: '36px', height: '36px' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--dark)' }}>
                    {user?.name || 'Student'}
                  </span>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--primary)',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                    }}
                  >
                    {user?.role || 'STUDENT'}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Link to="/login" className="btn btn-outline" style={{ padding: '0.5rem 1.25rem' }}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
