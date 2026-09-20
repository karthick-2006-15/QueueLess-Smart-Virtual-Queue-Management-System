import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import { useQueue } from '../context/QueueContext';

const QueueTrackPage = () => {
  const { activeQueue, cancelQueue, getQueueMetrics } = useQueue();
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const metrics = getQueueMetrics(activeQueue);

  const handleConfirmCancel = async () => {
    await cancelQueue();
    setShowCancelModal(false);
    navigate('/services');
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />

        <main
          className="main-content fade-in"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingTop: '2rem',
          }}
        >
          {activeQueue ? (
            <div
              className="glass-card"
              style={{
                width: '100%',
                maxWidth: '620px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                background: 'white',
                border: '1px solid var(--border)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              }}
            >
              {/* Top animated tracking bar */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '6px',
                  background:
                    activeQueue.status === 'CALLED' ? 'var(--danger)' : 'var(--warning)',
                }}
                className="tracking-pulse"
              ></div>

              <div style={{ marginBottom: '1.5rem', marginTop: '0.5rem' }}>
                <span
                  className={`badge ${
                    activeQueue.status === 'CALLED' ? 'badge-danger' : 'badge-warning'
                  } mb-2`}
                  style={{ fontSize: '0.95rem', padding: '0.4rem 1.25rem' }}
                >
                  {activeQueue.status === 'CALLED' ? '🔔 TOKEN CALLED!' : 'LIVE QUEUE TRACKING'}
                </span>
                <h1 style={{ color: 'var(--dark)', fontSize: '2.25rem', marginTop: '0.5rem' }}>
                  {activeQueue.serviceName}
                </h1>
                <p className="text-muted" style={{ fontSize: '1rem' }}>
                  <i className="fa-solid fa-location-dot" style={{ color: 'var(--primary)', marginRight: '0.4rem' }}></i>
                  {activeQueue.counterNumber}
                </p>
              </div>

              {/* Central Token Box */}
              <div
                className="queue-display"
                style={{
                  background: 'var(--bg-main)',
                  borderRadius: 'var(--radius-lg)',
                  marginBottom: '2rem',
                  border: '1px solid var(--border)',
                  padding: '2.5rem 1.5rem',
                }}
              >
                <p
                  className="text-muted"
                  style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}
                >
                  Your Assigned Token
                </p>
                <h1 style={{ fontSize: '4.5rem', fontWeight: 800, margin: '0.5rem 0', color: 'var(--primary)' }}>
                  {activeQueue.tokenNumber}
                </h1>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    background: 'white',
                    padding: '0.5rem 1.25rem',
                    borderRadius: '99px',
                    boxShadow: 'var(--shadow-sm)',
                    fontWeight: 700,
                    color: 'var(--dark)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      background:
                        activeQueue.status === 'CALLED' ? 'var(--danger)' : 'var(--secondary)',
                      borderRadius: '50%',
                    }}
                  ></div>
                  Status: {activeQueue.status}
                </div>
              </div>

              {/* Status Grid */}
              <div className="grid-2 mb-4" style={{ gap: '1rem' }}>
                <div
                  style={{
                    padding: '1.5rem',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    background: 'white',
                  }}
                >
                  <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    Currently Serving
                  </p>
                  <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--dark)' }}>
                    {metrics?.currentServingToken || '--'}
                  </p>
                </div>

                <div
                  style={{
                    padding: '1.5rem',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    background: 'white',
                  }}
                >
                  <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    Students Ahead
                  </p>
                  <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--warning)' }}>
                    {metrics?.peopleAhead ?? 0}
                  </p>
                </div>
              </div>

              {/* Estimated Wait Card */}
              <div
                style={{
                  padding: '1.5rem',
                  background: 'var(--primary-light)',
                  borderRadius: 'var(--radius)',
                  marginBottom: '2rem',
                  textAlign: 'left',
                  display: 'flex',
                  gap: '1.25rem',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>
                  <i className="fa-solid fa-clock-rotate-left"></i>
                </div>
                <div>
                  <p style={{ color: 'var(--primary-hover)', fontWeight: 600, fontSize: '0.95rem' }}>
                    Estimated Wait Time
                  </p>
                  <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1.1 }}>
                    ~{metrics?.estimatedWait ?? 0} Minutes
                  </p>
                </div>
              </div>

              {/* Cancel Button */}
              <button
                className="btn btn-outline btn-danger"
                style={{
                  width: '100%',
                  borderColor: 'var(--danger)',
                  color: 'var(--danger)',
                  padding: '0.85rem',
                }}
                onClick={() => setShowCancelModal(true)}
              >
                <i className="fa-solid fa-person-walking-arrow-right"></i> Leave Queue (Cancel Token)
              </button>
            </div>
          ) : (
            <div
              className="glass-card text-center"
              style={{
                maxWidth: '520px',
                width: '100%',
                background: 'white',
                padding: '3.5rem 2rem',
                border: '1px solid var(--border)',
              }}
            >
              <i
                className="fa-solid fa-ticket"
                style={{ fontSize: '3.5rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}
              ></i>
              <h2 style={{ color: 'var(--dark)', marginBottom: '0.5rem' }}>No Active Queue</h2>
              <p className="text-muted" style={{ marginBottom: '2rem' }}>
                You have not joined any campus queue yet. Browse the available services to take a virtual token.
              </p>
              <Link to="/services" className="btn btn-primary" style={{ padding: '0.85rem 2rem' }}>
                View Available Services <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          )}
        </main>
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={showCancelModal}
        title="Cancel Queue Request"
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        confirmText="Leave Queue"
        confirmClass="btn-danger"
      >
        <p style={{ color: 'var(--text-muted)' }}>
          Are you sure you want to cancel token{' '}
          <strong style={{ color: 'var(--dark)' }}>{activeQueue?.tokenNumber}</strong>? Your position in line
          will be released, and you will need to take a new ticket if you change your mind.
        </p>
      </Modal>
    </>
  );
};

export default QueueTrackPage;
