import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LoginPage = () => {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return toast.warning('Please enter both email and password.');
    }

    setLoading(true);

    try {
      const res = await login(formData.email, formData.password);
      toast.success('Login successful! Welcome back.');

      const role = res.data?.user?.role;
      if (role === 'ADMIN') {
        navigate('/admin');
      } else if (role === 'STAFF') {
        navigate('/staff');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh' }}>
      <Navbar />

      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 1.5rem 2rem',
        }}
      >
        <div
          className="glass-card fade-in"
          style={{
            background: 'white',
            width: '100%',
            maxWidth: '440px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', color: 'var(--dark)', marginBottom: '0.5rem' }}>Welcome Back</h1>
            <p className="text-muted">Enter your credentials to access your queue portal.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Campus Email
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="student@college.edu"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                  }}
                >
                  <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Authenticating...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Quick Demo Role Switcher for Presentations / Viva */}
          <div
            style={{
              marginTop: '1.75rem',
              padding: '1.25rem',
              background: 'var(--bg-main)',
              borderRadius: 'var(--radius)',
              border: '1px dashed var(--border)',
            }}
          >
            <p
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'var(--text-muted)',
                marginBottom: '0.75rem',
                textAlign: 'center',
              }}
            >
              ⚡ Quick Demo Logins (Presentation Mode)
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn"
                style={{
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  fontSize: '0.8rem',
                  padding: '0.5rem 0.25rem',
                  fontWeight: 600,
                }}
                onClick={() => {
                  setFormData({ email: 'student@queueless.com', password: 'student123' });
                  login('student@queueless.com', 'student123')
                    .then(() => {
                      toast.success('Logged in as Student!');
                      navigate('/dashboard');
                    })
                    .catch((err) => toast.error(err.message));
                }}
              >
                🎓 Student
              </button>

              <button
                type="button"
                className="btn"
                style={{
                  background: 'var(--warning-light)',
                  color: 'var(--warning)',
                  fontSize: '0.8rem',
                  padding: '0.5rem 0.25rem',
                  fontWeight: 600,
                }}
                onClick={() => {
                  setFormData({ email: 'staff@queueless.com', password: 'staff123' });
                  login('staff@queueless.com', 'staff123')
                    .then(() => {
                      toast.success('Logged in as Staff Operator!');
                      navigate('/staff');
                    })
                    .catch((err) => toast.error(err.message));
                }}
              >
                🎧 Staff
              </button>

              <button
                type="button"
                className="btn"
                style={{
                  background: 'var(--danger-light)',
                  color: 'var(--danger)',
                  fontSize: '0.8rem',
                  padding: '0.5rem 0.25rem',
                  fontWeight: 600,
                }}
                onClick={() => {
                  setFormData({ email: 'admin@queueless.com', password: 'admin123' });
                  login('admin@queueless.com', 'admin123')
                    .then(() => {
                      toast.success('Logged in as Admin!');
                      navigate('/admin');
                    })
                    .catch((err) => toast.error(err.message));
                }}
              >
                👑 Admin
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Don't have an account yet?{' '}
            <Link to="/register" style={{ fontWeight: 600 }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
