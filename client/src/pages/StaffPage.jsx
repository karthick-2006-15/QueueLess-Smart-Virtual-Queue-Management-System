import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useQueue } from '../context/QueueContext';

const StaffPage = () => {
  const { services, queueList, callNext, completeServing, skipCurrent } = useQueue();
  const [selectedServiceId, setSelectedServiceId] = useState(
    services[0]?._id || 'srv-cert-01'
  );

  const currentService = services.find((s) => s._id === selectedServiceId) || services[0];

  // Filter queues for this specific service
  const serviceQueues = queueList.filter((q) => q.serviceId === currentService?._id);

  const currentlyServing = serviceQueues.find(
    (q) => q.status === 'SERVING' || q.status === 'CALLED'
  );

  const waitingList = serviceQueues.filter((q) => q.status === 'WAITING');
  const completedTodayCount = serviceQueues.filter((q) => q.status === 'COMPLETED').length + 18;

  const upNext = waitingList[0];

  return (
    <>
      <Navbar />
      <div className="dashboard-layout" style={{ background: '#F1F5F9' }}>
        <Sidebar />

        <main className="main-content fade-in">
          {/* Header & Service Selector */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h1 style={{ fontSize: '1.85rem', color: 'var(--dark)', fontWeight: 800 }}>
                  Staff Counter Console
                </h1>
                <span className="badge" style={{ background: 'var(--dark)', color: 'white' }}>
                  OPERATOR
                </span>
              </div>
              <p className="text-muted">Manage the queue line, call tokens, and service students.</p>
            </div>

            {/* Service Counter Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <label style={{ fontWeight: 600, color: 'var(--dark)', fontSize: '0.9rem' }}>Active Desk:</label>
              <select
                className="form-control"
                style={{ width: 'auto', minWidth: '220px', fontWeight: 600 }}
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
              >
                {services.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.counterNumber})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) 360px',
              gap: '2rem',
            }}
          >
            {/* Left Column: Serving & Call Controls */}
            <div>
              <div
                className="glass-card"
                style={{
                  background: 'white',
                  border: '1px solid var(--border)',
                  marginBottom: '2rem',
                  textAlign: 'center',
                  padding: '3rem 2rem',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <h2
                  className="text-muted"
                  style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.95rem', marginBottom: '1rem' }}
                >
                  Currently Serving
                </h2>

                <h1
                  style={{
                    fontSize: '5rem',
                    color: 'var(--primary)',
                    fontWeight: 800,
                    lineHeight: 1,
                    marginBottom: '1.5rem',
                  }}
                >
                  {currentlyServing ? currentlyServing.tokenNumber : 'None'}
                </h1>

                {currentlyServing && (
                  <p className="text-muted" style={{ marginBottom: '2rem', fontSize: '1rem' }}>
                    <i className="fa-solid fa-user-graduate" style={{ marginRight: '0.4rem', color: 'var(--primary)' }}></i>
                    Student: <strong>{currentlyServing.studentName}</strong> ({currentlyServing.studentId})
                  </p>
                )}

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}
                    disabled={!currentlyServing}
                    onClick={() => completeServing(currentService?._id)}
                  >
                    <i className="fa-solid fa-check-double"></i> Mark Completed
                  </button>

                  <button
                    className="btn btn-outline btn-danger"
                    style={{
                      borderColor: 'var(--danger)',
                      color: 'var(--danger)',
                      padding: '0.85rem 2rem',
                      fontSize: '1.05rem',
                    }}
                    disabled={!currentlyServing}
                    onClick={() => skipCurrent(currentService?._id)}
                  >
                    <i className="fa-solid fa-user-xmark"></i> No Show (Skip)
                  </button>
                </div>
              </div>

              {/* Next in Line Callout Card */}
              <div
                className="glass-card"
                style={{
                  background: 'white',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1.5rem',
                  padding: '2rem',
                }}
              >
                <div>
                  <h3
                    className="text-muted"
                    style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px' }}
                  >
                    Up Next in Line
                  </h3>
                  <p style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--dark)', margin: '0.25rem 0' }}>
                    {upNext ? upNext.tokenNumber : '--'}
                  </p>
                  <p className="text-muted" style={{ fontSize: '0.9rem', margin: 0 }}>
                    {upNext ? `Student: ${upNext.studentName} (${upNext.studentId})` : 'No one waiting'}
                  </p>
                </div>

                <button
                  className="btn btn-primary"
                  style={{ padding: '1.25rem 2.5rem', fontSize: '1.2rem', boxShadow: 'var(--shadow-lg)' }}
                  onClick={() => callNext(currentService?._id)}
                >
                  <i className="fa-solid fa-bullhorn"></i> CALL NEXT TOKEN
                </button>
              </div>
            </div>

            {/* Right Column: Statistics & Live Waiting List */}
            <div>
              <div className="grid-2" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="glass-card" style={{ background: 'white', padding: '1.5rem', textAlign: 'center' }}>
                  <h3 className="text-muted" style={{ fontSize: '0.875rem' }}>Waiting</h3>
                  <p style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--warning)', margin: '0.25rem 0' }}>
                    {waitingList.length}
                  </p>
                </div>

                <div className="glass-card" style={{ background: 'white', padding: '1.5rem', textAlign: 'center' }}>
                  <h3 className="text-muted" style={{ fontSize: '0.875rem' }}>Served Today</h3>
                  <p style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--secondary)', margin: '0.25rem 0' }}>
                    {completedTodayCount}
                  </p>
                </div>
              </div>

              {/* Waiting List Queue Card */}
              <div className="glass-card" style={{ background: 'white', border: '1px solid var(--border)', padding: 0 }}>
                <div
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderBottom: '1px solid var(--border)',
                    background: '#F8FAFC',
                    borderRadius: 'var(--radius) var(--radius) 0 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <h3 style={{ color: 'var(--dark)', fontSize: '1.1rem', margin: 0 }}>Waiting Queue</h3>
                  <span className="badge badge-warning">{waitingList.length} In Line</span>
                </div>

                <div style={{ maxHeight: '450px', overflowY: 'auto' }}>
                  {waitingList.length > 0 ? (
                    waitingList.map((item, idx) => (
                      <div
                        key={item._id || idx}
                        style={{
                          padding: '1rem 1.5rem',
                          borderBottom: '1px solid var(--border)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <p style={{ fontWeight: 700, color: 'var(--dark)', margin: 0 }}>
                            {item.tokenNumber}
                          </p>
                          <p className="text-muted" style={{ fontSize: '0.75rem', margin: 0 }}>
                            {item.studentName} ({item.studentId})
                          </p>
                        </div>
                        {idx === 0 ? (
                          <span className="badge badge-warning">NEXT</span>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            #{idx + 1}
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
                      <i className="fa-solid fa-mug-hot" style={{ fontSize: '2rem', marginBottom: '0.75rem' }}></i>
                      <p style={{ margin: 0, fontWeight: 500 }}>All queues cleared!</p>
                      <span style={{ fontSize: '0.8rem' }}>No students currently waiting.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
};

export default StaffPage;
