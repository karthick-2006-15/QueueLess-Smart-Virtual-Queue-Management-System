import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import { useQueue } from '../context/QueueContext';

const DashboardPage = () => {
  const { user } = useAuth();
  const { activeQueue, queueHistory, services, getQueueMetrics } = useQueue();

  const metrics = getQueueMetrics(activeQueue);
  const openServicesCount = services.filter((s) => s.status === 'OPEN').length;

  return (
    <>
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />

        <main className="main-content fade-in">
          <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.85rem', color: 'var(--dark)', fontWeight: 800 }}>
                Welcome back, {user?.name || 'Student'}! 👋
              </h1>
              <p className="text-muted">Here is the real-time status of your virtual queues and campus services.</p>
            </div>
            <Link to="/services" className="btn btn-primary">
              <i className="fa-solid fa-plus"></i> Join New Queue
            </Link>
          </div>

          {/* Active Queue Alert Banner (If waiting or called) */}
          {activeQueue ? (
            <div
              className="glass-card mb-4"
              style={{
                borderLeft: '5px solid var(--primary)',
                background: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.5rem',
              }}
            >
              <div>
                <span
                  className={`badge ${
                    activeQueue.status === 'CALLED' ? 'badge-danger' : 'badge-warning'
                  } mb-2`}
                >
                  {activeQueue.status}
                </span>
                <h2 style={{ fontSize: '1.5rem', margin: '0.25rem 0', color: 'var(--dark)' }}>
                  {activeQueue.serviceName}
                </h2>
                <p className="text-muted" style={{ fontSize: '0.95rem' }}>
                  <i className="fa-solid fa-location-dot" style={{ color: 'var(--primary)', marginRight: '0.4rem' }}></i>
                  {activeQueue.counterNumber}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Your Token</span>
                  <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
                    {activeQueue.tokenNumber}
                  </p>
                </div>
                <Link to="/queue" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                  Live Tracking <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          ) : (
            <div
              className="glass-card mb-4"
              style={{
                background: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <h3 style={{ color: 'var(--dark)', marginBottom: '0.25rem' }}>No Active Queue</h3>
                <p className="text-muted" style={{ margin: 0 }}>
                  You are not waiting in any campus line right now. Join a queue anytime from your device.
                </p>
              </div>
              <Link to="/services" className="btn btn-outline">
                Browse Campus Services
              </Link>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid-cards mb-4">
            <StatCard
              icon="fa-ticket"
              color="blue"
              label="Active Token"
              value={activeQueue ? activeQueue.tokenNumber : 'None'}
              subtext={activeQueue ? `Status: ${activeQueue.status}` : 'Ready to join'}
            />
            <StatCard
              icon="fa-users"
              color="yellow"
              label="People Ahead"
              value={activeQueue ? metrics?.peopleAhead ?? 0 : '--'}
              subtext={activeQueue ? `Serving: ${metrics?.currentServingToken}` : 'No active queue'}
            />
            <StatCard
              icon="fa-clock"
              color="red"
              label="Estimated Wait"
              value={activeQueue ? `~${metrics?.estimatedWait ?? 0}m` : '--'}
              subtext="Dynamic real-time estimate"
            />
            <StatCard
              icon="fa-building-circle-check"
              color="green"
              label="Open Services"
              value={openServicesCount}
              subtext="Campus counters active today"
            />
          </div>

          {/* Recent Queue History */}
          <div className="mb-4">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ color: 'var(--dark)', fontWeight: 700 }}>Recent Queue History</h3>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Service</th>
                    <th>Date / Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {queueHistory.length > 0 ? (
                    queueHistory.map((item, index) => (
                      <tr key={item._id || index}>
                        <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{item.tokenNumber}</td>
                        <td>{item.serviceName}</td>
                        <td className="text-muted">{item.date || 'Recently'}</td>
                        <td>
                          <span
                            className={`badge ${
                              item.status === 'COMPLETED'
                                ? 'badge-success'
                                : item.status === 'CANCELLED'
                                ? 'badge-danger'
                                : 'badge-warning'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        No past queues recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default DashboardPage;
