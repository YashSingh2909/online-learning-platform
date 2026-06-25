import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({ user_email: '', user_password: '' });
  const [error, setError] = useState('');

  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Avoid spamming console for UI state changes
  }, [error]);



  useEffect(() => {
    // Only reset form and show success message if coming from registration
    if (location?.state?.registrationSuccess) {
      setFormData({ user_email: '', user_password: '' });
      setSuccessMessage('Registration successful! Please log in with your credentials.');
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('=== FORM SUBMIT START ===');
    setError('');
    setLoading(true);

    try {
      if (import.meta?.env?.MODE !== 'production') {
        console.log('Attempting login...');
      }

      await login(formData.user_email, formData.user_password);
      if (import.meta?.env?.MODE !== 'production') {
        console.log('Login successful, navigating to dashboard');
      }

      // Reset form only on successful login
      setFormData({ user_email: '', user_password: '' });
      navigate('/dashboard');
    } catch (err) {
      console.log('=== LOGIN ERROR CAUGHT ===');
      console.log('Error object:', err);
      console.log('Error message:', err.message);
      console.log('Error response:', err.response);
      console.log('Error response data:', err.response?.data);
      console.log('Error status:', err.status);

      // Extract message from error object - handle different error structures
      let errorMessage = 'Login failed';
      if (err.response?.data?.message) {
        // Hide exact backend reason to provide a user-friendly message
        const backendMsg = String(err.response.data.message).toLowerCase();
        if (backendMsg.includes('invalid credentials') || backendMsg.includes('invalid')) {
          errorMessage = 'Please enter the correct email and password.';
        } else {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err.status === 0) {
        errorMessage = 'Unable to connect to server. Please check if the backend is running.';
      }


      console.log('Setting error message:', errorMessage);
      setError(errorMessage);
      console.log('Error state set, not navigating');
    } finally {
      console.log('=== FORM SUBMIT END ===');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1"></div>
        <div className="auth-orb auth-orb-2"></div>
      </div>

      <div className="auth-container">
        <Link to="/" className="logo">
          <div className="logo-icon">E</div>
          <span className="logo-text">EduSphere</span>
        </Link>

        <div className="auth-card">
          <div className="auth-header">
            <h1>Welcome back</h1>
            <p>Sign in to continue learning</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {successMessage && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '0.5rem',
                padding: '0.75rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#10b981'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                {successMessage}
              </div>
            )}

            {error && (
              <div
                className="error-msg"
                role="alert"
                aria-live="assertive"
                style={{
                  background: 'rgba(239, 68, 68, 0.10)',
                  border: '1px solid rgba(239, 68, 68, 0.30)',
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#ef4444',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span style={{ fontWeight: 600 }}>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="user_email"
                value={formData.user_email}
                onChange={handleChange}
                className="form-input"
                placeholder="you@example.com"
                required
                autoComplete="off"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="user_password"
                value={formData.user_password}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter password"
                required
                autoComplete="off"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register">Create one</Link></p>
          </div>

          <div className="demo-box">
            <p className="demo-title">Demo Credentials</p>
            <div className="demo-list">
              <p><span>Student:</span> john@example.com</p>
              <p><span>Instructor:</span> alice@example.com</p>
              <p><span>Password:</span> password123</p>
            </div>
          </div>
        </div>

        <Link to="/" className="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to home
        </Link>
      </div>
    </div>
  );
}