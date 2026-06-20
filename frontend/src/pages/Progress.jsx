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
            <p>{error}</p>
          </div>
        ) : enrollments.length === 0 ? (
          <div className="dashboard-empty">
            <h2 className="dashboard-empty-title">No progress yet</h2>
            <p className="dashboard-empty-text">Enroll in a course to start tracking your progress.</p>
            <Link to="/courses" className="btn-action" style={{ marginTop: '1.5rem' }}>
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="dashboard-grid">
            {enrollments.map((enr) => (
              <div key={enr._id} className="course-card-alt">
                <div className="course-card-header">
                  <div>
                    <h3 className="course-card-title">{enr.course?.title || 'Course'}</h3>
                    <p className="course-card-meta">Status: {enr.status}</p>
                  </div>
                  <span className="course-card-badge">{enr.status}</span>
                </div>

                <div className="course-card-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${Math.max(0, Math.min(100, enr.progress ?? 0))}%` }}
                    />
                  </div>
                  <div className="course-card-footer">
                    <span className="progress-text">Completion</span>
                    <span className="progress-percent">{enr.progress ?? 0}%</span>
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