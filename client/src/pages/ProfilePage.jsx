import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useQueue } from '../context/QueueContext';
import { useToast } from '../context/ToastContext';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const { queueHistory } = useQueue();
  const toast = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    studentId: user?.studentId || '',
  });

  const handleSave = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, ...formData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsEditing(false);
    toast.success('Profile details updated successfully!');
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />

        <main className="main-content fade-in">
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.85rem', color: 'var(--dark)', fontWeight: 800 }}>
              User Profile & Account
            </h1>
            <p className="text-muted">Manage your personal credentials and campus identification details.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '2rem' }}>
            {/* Left: Profile Form / Details */}
            <div
              className="glass-card"
              style={{
                background: 'white',
                border: '1px solid var(--border)',
                padding: '2.5rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '2rem',
                  borderBottom: '1px solid var(--border)',
                  paddingBottom: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.name || 'User'
                    )}&background=EEF2FF&color=4F46E5&size=128&bold=true`}
                    alt="Avatar"
                    style={{ borderRadius: '50%', width: '64px', height: '64px' }}
                  />
                  <div>
                    <h2 style={{ color: 'var(--dark)', margin: 0, fontSize: '1.5rem' }}>{user?.name}</h2>
                    <span className="badge badge-success" style={{ marginTop: '0.35rem' }}>
                      {user?.role || 'STUDENT'}
                    </span>
                  </div>
                </div>

                {!isEditing && (
                  <button className="btn btn-outline" onClick={() => setIsEditing(true)}>
                    <i className="fa-solid fa-pen-to-square"></i> Edit Profile
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSave}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid-2" style={{ gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Student ID / Roll No</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.studentId}
                        onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Email:</span>
                    <span style={{ color: 'var(--dark)', fontWeight: 600 }}>{user?.email || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Student ID:</span>
                    <span style={{ color: 'var(--dark)', fontWeight: 600 }}>{user?.studentId || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Phone:</span>
                    <span style={{ color: 'var(--dark)', fontWeight: 600 }}>{user?.phone || 'Not provided'}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Account Status:</span>
                    <span style={{ color: 'var(--secondary)', fontWeight: 700 }}>Active & Verified</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Summary Card */}
            <div
              className="glass-card"
              style={{
                background: 'white',
                border: '1px solid var(--border)',
                height: 'fit-content',
                padding: '2rem',
              }}
            >
              <h3 style={{ color: 'var(--dark)', marginBottom: '1.25rem' }}>Activity Summary</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius)' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Queues Joined</span>
                  <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', margin: '0.25rem 0 0' }}>
                    {queueHistory.length + 2}
                  </p>
                </div>

                <div style={{ padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius)' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Completed Successfully</span>
                  <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--secondary)', margin: '0.25rem 0 0' }}>
                    {queueHistory.filter((h) => h.status === 'COMPLETED').length + 2}
                  </p>
                </div>

                <div style={{ padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius)' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Estimated Time Saved</span>
                  <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--dark)', margin: '0.25rem 0 0' }}>
                    ~45 mins
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ProfilePage;
