import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ background: 'linear-gradient(135deg, var(--bg-main) 0%, #E0E7FF 100%)', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero Section */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          paddingTop: '80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' }}>
          
          {/* Left Text */}
          <div style={{ flex: '1 1 500px', zIndex: 10 }}>
            <span className="badge badge-success mb-3" style={{ fontSize: '0.95rem' }}>
              <i className="fa-solid fa-bolt" style={{ marginRight: '0.4rem' }}></i> Next-Gen Virtual Queue System
            </span>
            <h1 style={{ fontSize: '3.75rem', fontWeight: 800, color: 'var(--dark)', lineHeight: 1.15, marginBottom: '1.5rem' }}>
              Wait Where You Want, <span style={{ color: 'var(--primary)' }}>Not in Line.</span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '540px' }}>
              QueueLess eliminates physical queues in campus offices. Join virtually from your phone or laptop, track live progress, and show up only when your token is called.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                  Go to Dashboard <i className="fa-solid fa-arrow-right"></i>
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                    Get Started Free <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                  <Link to="/login" className="btn btn-outline" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                    Student Login
                  </Link>
                </>
              )}
            </div>

            <div style={{ display: 'flex', gap: '2.5rem', marginTop: '3rem' }}>
              <div>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>0</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Physical Lines</p>
              </div>
              <div>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)' }}>~75%</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Time Saved</p>
              </div>
              <div>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--dark)' }}>100%</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Live Transparency</p>
              </div>
            </div>
          </div>

          {/* Right Visual / Mockup */}
          <div style={{ flex: '1 1 420px', position: 'relative', zIndex: 10 }}>
            <div
              className="glass-card fade-in"
              style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                border: '1px solid var(--border)',
                boxShadow: '0 25px 50px -12px rgba(79, 70, 229, 0.15)',
                padding: '2.5rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <span className="badge badge-warning">LIVE TOKEN DEMO</span>
                  <h3 style={{ marginTop: '0.5rem', color: 'var(--dark)', fontSize: '1.3rem' }}>Certificate Office</h3>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Estimated Wait</span>
                  <p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem' }}>12 mins</p>
                </div>
              </div>

              <div
                style={{
                  background: 'var(--bg-main)',
                  borderRadius: '16px',
                  padding: '2rem 1.5rem',
                  textAlign: 'center',
                  marginBottom: '1.5rem',
                  border: '1px solid var(--border)',
                }}
              >
                <span style={{ fontSize: '0.85rem', letterSpacing: '2px', color: 'var(--text-muted)', fontWeight: 600 }}>
                  YOUR TOKEN
                </span>
                <h1 style={{ fontSize: '3.5rem', color: 'var(--primary)', fontWeight: 800, margin: '0.5rem 0' }}>
                  CERT-042
                </h1>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'white',
                    padding: '0.4rem 1rem',
                    borderRadius: '99px',
                    boxShadow: 'var(--shadow-sm)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                  }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--secondary)' }}></span>
                  Status: WAITING
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Now Serving</span>
                  <p style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--dark)' }}>CERT-035</p>
                </div>
                <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>People Ahead</span>
                  <p style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--warning)' }}>6 Students</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default LandingPage;
