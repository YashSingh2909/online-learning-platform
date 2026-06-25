import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({ user_name: '', user_email: '', user_password: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: '' });
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize form state only once on mount
    setFormData({ user_name: '', user_email: '', user_password: '', role: 'student' });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Calculate password strength when password changes
    if (e.target.name === 'user_password') {
      calculatePasswordStrength(e.target.value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let score = 0;
    let feedback = '';

    if (!password) {
      setPasswordStrength({ score: 0, feedback: '' });
      return;
    }

    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Complexity checks
    if (/[a-z]/.test(password)) score += 1; // lowercase
    if (/[A-Z]/.test(password)) score += 1; // uppercase
    if (/[0-9]/.test(password)) score += 1; // numbers
    if (/[^a-zA-Z0-9]/.test(password)) score += 1; // special characters

    // Cap the score at 5
    score = Math.min(score, 5);

    // Provide feedback based on score
    switch (score) {
      case 0:
        feedback = 'Very weak';
        break;
      case 1:
        feedback = 'Weak';
        break;
      case 2:
        feedback = 'Fair';
        break;
      case 3:
        feedback = 'Good';
        break;
      case 4:
        feedback = 'Strong';
        break;
      case 5:
        feedback = 'Very strong';
        break;
      default:
        feedback = '';
    }

    setPasswordStrength({ score, feedback });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData.user_name, formData.user_email, formData.user_password, formData.role);
      // Reset form only on successful registration
      setFormData({ user_name: '', user_email: '', user_password: '', role: 'student' });
      setPasswordStrength({ score: 0, feedback: '' });
      // Redirect to login page after successful registration
      navigate('/login', { state: { registrationSuccess: true } });
    } catch (err) {
      // Extract message from error object
      const errorMessage = err.message || err.data?.message || 'Registration failed';
      setError(errorMessage);
    } finally {
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
            <h1>Create account</h1>
            <p>Join learners today</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="error-msg">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                className="form-input"
                placeholder="John Doe"
                required
              />
            </div>

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
                placeholder="Create password"
                required
                autoComplete="off"
              />
              {formData.user_password && (
                <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{
                    display: 'flex',
                    gap: '4px',
                    marginBottom: '0.5rem'
                  }}>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        style={{
                          flex: 1,
                          height: '8px',
                          borderRadius: '4px',
                          backgroundColor: level <= passwordStrength.score 
                            ? passwordStrength.score <= 2 
                              ? '#ef4444' 
                              : passwordStrength.score <= 3 
                                ? '#f59e0b' 
                                : '#10b981'
                            : 'rgba(255, 255, 255, 0.2)',
                          transition: 'background-color 0.3s ease'
                        }}
                      />
                    ))}
                  </div>
                  <p style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: passwordStrength.score <= 2 
                      ? '#ef4444' 
                      : passwordStrength.score <= 3 
                        ? '#f59e0b' 
                        : '#10b981',
                    margin: '0'
                  }}>
                    Password strength: {passwordStrength.feedback}
                  </p>
                </div>
              )}
            </div>

            <div className="form-group">
              <label>I want to</label>
              <div className="role-selector">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'student' })}
                  className={`role-btn ${formData.role === 'student' ? 'active' : ''}`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                  </svg>
                  Learn
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'instructor' })}
                  className={`role-btn ${formData.role === 'instructor' ? 'active' : ''}`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                  Teach
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Sign in</Link></p>
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