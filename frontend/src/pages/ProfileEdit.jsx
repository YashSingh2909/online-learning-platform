import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/apiService';

export default function ProfileEdit() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await authAPI.updateProfile(formData);
      
      // Update user context with new data
      setUser(response.data.data);
      
      // Update localStorage
      localStorage.setItem('edusphereUser', JSON.stringify(response.data.data));
      
      setSuccess('Profile updated successfully!');
      
      // Navigate back to profile page after a short delay
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Profile update failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-bg">
        <div className="dashboard-orb dashboard-orb-1"></div>
        <div className="dashboard-orb dashboard-orb-2"></div>
      </div>

      <div className="dashboard-container">
        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <div>
              <h1 className="dashboard-section-title">Edit Profile</h1>
              <p className="dashboard-section-desc">Update your account information</p>
            </div>
          </div>

          <div className="quiz-card">
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

              {success && (
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
                  {success}
                </div>
              )}

              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
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
                  value={user?.email || ''}
                  className="form-input"
                  disabled
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                />
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  Email cannot be changed
                </small>
              </div>

              <div className="form-group">
                <label>Role</label>
                <input
                  type="text"
                  value={user?.role || ''}
                  className="form-input"
                  disabled
                  style={{ opacity: 0.6, cursor: 'not-allowed', textTransform: 'capitalize' }}
                />
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  Role is assigned by admin
                </small>
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Tell us about yourself..."
                  rows={4}
                  style={{ resize: 'vertical' }}
                />
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  Optional: A short description about yourself
                </small>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-outline"
                  disabled={loading}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ flex: 1 }}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}