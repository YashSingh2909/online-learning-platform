import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';
import { courseAPI } from '../../api/apiService';

export default function CourseManagement() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);
  const [error, setError] = useState('');

  const loadCourse = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await courseAPI.getCourseById(courseId);
      setCourse(res?.data?.data);
    } catch (err) {
      setError(err?.message || 'Failed to load course.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const togglePublish = async () => {
    setSavingStatus(true);
    setError('');
    try {
      if (course?.isPublished) {
        await courseAPI.unpublishCourse(courseId);
      } else {
        await courseAPI.publishCourse(courseId);
      }
      await loadCourse();
    } catch (err) {
      setError(err?.message || 'Could not update publish status.');
    } finally {
      setSavingStatus(false);
    }
  };

  const tabs = [
    { to: `/instructor/course/${courseId}/lessons`, label: 'Lessons' },
    { to: `/instructor/course/${courseId}/quizzes`, label: 'Quizzes' },
    { to: `/instructor/course/${courseId}/assignments`, label: 'Assignments' },
  ];

  if (loading) {
    return <div className="dashboard-loading"><p className="loading-text">Loading course...</p></div>;
  }

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  return (
    <>
      <div className="dashboard-header">
        <p className="dashboard-label">Course Management</p>
        <h1 className="dashboard-title">{course?.title || 'Course'}</h1>
        <p className="dashboard-desc">{course?.description}</p>
      </div>

      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <div>
            <h2 className="dashboard-section-title">Content Studio</h2>
            <p className="dashboard-section-desc">
              {course?.isPublished ? 'Published' : 'Draft'} - Manage lessons, quizzes, and assignments.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button type="button" className="btn-action" onClick={togglePublish} disabled={savingStatus}>
              {savingStatus ? 'Saving...' : course?.isPublished ? 'Unpublish' : 'Publish'}
            </button>
            <button type="button" className="btn-outline-alt" onClick={() => navigate('/instructor/courses')}>
              Back to courses
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) => (isActive ? 'btn-action' : 'btn-outline-alt')}
            >
              {tab.label}
            </NavLink>
          ))}
        </div>

        <Outlet context={{ course }} />
      </div>
    </>
  );
}
