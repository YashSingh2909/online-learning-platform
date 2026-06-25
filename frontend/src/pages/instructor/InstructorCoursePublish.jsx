import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { courseAPI } from '../../api/apiService';

const InstructorCoursePublish = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadCourse = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await courseAPI.getCourseById(courseId);
      setCourse(res.data.data);
    } catch (e) {
      setError(e?.message || 'Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    if (user.role !== 'instructor' && user.role !== 'admin') {
      navigate('/');
      return;
    }
    loadCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, user]);

  const onPublish = async () => {
    setSaving(true);
    setError('');
    try {
      // Existing endpoint only supports publish=true.
      await courseAPI.publishCourse(courseId);
      await loadCourse();
    } catch (e) {
      setError(e?.message || 'Publish failed');
    } finally {
      setSaving(false);
    }
  };

  const onUnpublish = async () => {
    setSaving(true);
    setError('');
    try {
      // No explicit unpublish endpoint exists; use updateCourse.
      await courseAPI.updateCourse(courseId, { isPublished: false });
      await loadCourse();
    } catch (e) {
      setError(e?.message || 'Unpublish failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-bg">
          <div className="dashboard-orb dashboard-orb-1"></div>
          <div className="dashboard-orb dashboard-orb-2"></div>
        </div>
        <div className="dashboard-container">
          <div className="dashboard-loading">
            <p className="loading-text">Loading course...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-bg">
          <div className="dashboard-orb dashboard-orb-1"></div>
          <div className="dashboard-orb dashboard-orb-2"></div>
        </div>
        <div className="dashboard-container">
          <div className="dashboard-error">
            <p>{error}</p>
            <button onClick={() => navigate('/instructor/courses')} className="btn-outline-alt" style={{ marginTop: '1rem' }}>← Back</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-bg">
        <div className="dashboard-orb dashboard-orb-1"></div>
        <div className="dashboard-orb dashboard-orb-2"></div>
      </div>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <p className="dashboard-label">Course Publishing</p>
          <h1 className="dashboard-title">{course?.title || 'Course'}</h1>
          <p className="dashboard-desc">Control visibility for students.</p>
        </div>

        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <div>
              <h2 className="dashboard-section-title">Current Status</h2>
              <p className="dashboard-section-desc">{course?.isPublished ? 'Published' : 'Draft'}</p>
            </div>
            <button onClick={() => navigate('/instructor/courses')} className="btn-outline-alt">← Back</button>
          </div>

          <div className="form-actions">
            <button className="btn-action" disabled={saving || course?.isPublished} onClick={onPublish}>
              {saving ? 'Saving...' : 'Publish'}
            </button>
            <button className="btn-outline-alt" disabled={saving || !course?.isPublished} onClick={onUnpublish}>
              {saving ? 'Saving...' : 'Unpublish'}
            </button>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', lineHeight: '1.5' }}>
              Note: quizzes/assignments/lessons marked as free preview may still appear for students even when the course is published.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorCoursePublish;

