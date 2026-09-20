import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';

const Sidebar = ({ isOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowLogoutModal(false);
    navigate('/login');
  };

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-menu">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <i className="fa-solid fa-house"></i>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/services"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <i className="fa-solid fa-building"></i>
            <span>Services</span>
          </NavLink>

          <NavLink
            to="/queue"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <i className="fa-solid fa-ticket"></i>
            <span>Live Queue</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <i className="fa-solid fa-user"></i>
            <span>Profile</span>
          </NavLink>

          {/* Staff & Admin specific links */}
          {(user?.role === 'STAFF' || user?.role === 'ADMIN') && (
            <NavLink
              to="/staff"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <i className="fa-solid fa-headset"></i>
              <span>Staff Counter</span>
            </NavLink>
          )}

          {user?.role === 'ADMIN' && (
            <NavLink
              to="/admin"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <i className="fa-solid fa-shield-halved"></i>
              <span>Admin Control</span>
            </NavLink>
          )}

          <button
            onClick={() => setShowLogoutModal(true)}
            className="sidebar-link"
            style={{ marginTop: 'auto', color: 'var(--danger)' }}
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        title="Confirm Logout"
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        confirmText="Logout"
        confirmClass="btn-danger"
      >
        <p style={{ color: 'var(--text-muted)' }}>
          Are you sure you want to sign out of QueueLess? You will need to log back in to manage your active tokens.
        </p>
      </Modal>
    </>
  );
};

export default Sidebar;
