import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { enrollmentAPI } from '../api/apiService';

export default function Progress() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setLoading(true);
      setError('');
      try {
        const res = await enrollmentAPI.getUserEnrollments();
        setEnrollments(res.data.data || []);
      } catch (e) {
        setError(e?.message || 'Failed to load progress');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  return (
    <div className="dashboard-page">
      <div className="dashboard-bg">
        <div className="dashboard-orb dashboard-orb-1"></div>
        <div className="dashboard-orb dashboard-orb-2"></div>
      </div>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <p className="dashboard-label">Progress</p>
          <h1 className="dashboard-title">Your Learning Journey</h1>
          <p className="dashboard-desc">Track your enrollment status and completion percentage across your courses.</p>
        </div>

        {loading ? (
          <div className="dashboard-loading">
            <p className="loading-text">Loading your progress...</p>
          </div>
        ) : error ? (
          <div className="dashboard-error">
            {error}
          </div>
        ) : enrollments.length === 0 ? (
          <div className="dashboard-empty">
            <h2 className="dashboard-empty-title">No progress yet</h2>
            <p className="dashboard-empty-text">Enroll in a course to start tracking your progress.</p>
            <Link to="/courses" className="btn-action" style={{ marginTop: '1rem' }}>
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="dashboard-grid">
            {enrollments.map((enr) => (
              <div key={enr._id} className="dashboard-section">
                <div className="dashboard-section-header">
                  <div>
                    <h3 className="dashboard-section-title">{enr.course?.title || 'Course'}</h3>
                    <p className="dashboard-section-desc">Status: {enr.status}</p>
                  </div>
                  <span className="badge">{enr.status}</span>
                </div>

                <div style={{ marginTop: '1.25rem' }}>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div
                      style={{ height: '100%', background: 'var(--accent)', borderRadius: '9999px', transition: 'all 0.3s', width: `${Math.max(0, Math.min(100, enr.progress ?? 0))}%` }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Completion</span>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--accent)' }}>{enr.progress ?? 0}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
