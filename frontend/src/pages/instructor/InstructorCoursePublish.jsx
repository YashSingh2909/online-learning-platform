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
    return <div className="dashboard-page"><div className="dashboard-loading"><p className="loading-text">Loading course...</p></div></div>;
  }

  if (error) {
    return <div className="dashboard-page"><div className="dashboard-error"><p>{error}</p><button onClick={() => navigate('/instructor/courses')} className="btn-outline-alt" style={{ marginTop: '1rem' }}>← Back</button></div></div>;
  }

  return (
    <div className="dashboard-page">
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

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
            <button className="btn-action" disabled={saving || course?.isPublished} onClick={onPublish}>
              {saving ? 'Saving...' : 'Publish'}
            </button>
            <button className="btn-outline-alt" disabled={saving || !course?.isPublished} onClick={onUnpublish}>
              {saving ? 'Saving...' : 'Unpublish'}
            </button>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <p className="text-slate-400" style={{ color: 'var(--text-secondary)' }}>
              Note: quizzes/assignments/lessons marked as free preview may still appear for students even when the course is published.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorCoursePublish;

