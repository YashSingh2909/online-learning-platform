import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { courseAPI } from '../api/apiService';
import { useAuth } from '../context/AuthContext';

const defaultCourseThumbnail = 'https://placehold.co/300x200?text=Course+Thumbnail';

// Always have a thumbnail to render, even if a course document doesn't include `thumbnail`.


export default function Courses() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await courseAPI.getAllCourses();
        const data = res?.data?.data || [];

        // Ensure consistent order
        const sorted = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setCourses(sorted);
      } catch (e) {
        console.error(e);
        setError('Could not load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const gridCourses = useMemo(() => courses || [], [courses]);

  const handleViewCourse = (courseId) => {
    // CourseDetailLearn is protected, so redirect to login if not authenticated
    if (!user) {
      navigate('/login');
      return;
    }

    navigate(`/course/${courseId}/learn`);
  };

  return (
    <div className="courses-page">
      <div className="courses-page-container">
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
          <p className="section-label">Courses</p>
          <h2 className="section-heading" style={{ marginTop: '0.5rem' }}>All available courses</h2>
          <p className="section-subtitle" style={{ maxWidth: 720, margin: '0.75rem 0 0' }}>
            Browse and open any course to start learning.
          </p>
        </div>

        {loading && (
          <div className="courses-loading">
            <div className="loading-spinner" />
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading courses...</p>
          </div>
        )}

        {error && (
          <div className="dashboard-error" style={{ marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}

        {!loading && !error && gridCourses.length === 0 && (
          <div className="courses-empty">
            <p>No courses available.</p>
          </div>
        )}

        {!loading && !error && gridCourses.length > 0 && (
          <div className="courses-grid">
            {gridCourses.map((course) => (
              <div
                key={course._id}
                className="course-card"
                onClick={() => handleViewCourse(course._id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleViewCourse(course._id);
                }}
              >
                <div className="course-thumbnail">
                  <img
                    src={course.thumbnail || defaultCourseThumbnail}
                    alt={course.title}
                  />
                  <span className="course-category">{course.category}</span>
                </div>
                <div className="course-content">
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-desc">{course.description}</p>
                  <div className="course-meta">
                    <span className="course-price">₹{course.price}</span>
                    <div className="course-rating">
                      <span>★</span>
                      <span>{course.rating}</span>
                    </div>
                  </div>

                  <div style={{ marginTop: '0.75rem' }}>
                    <button
                      type="button"
                      className="btn-action"
                      style={{ width: '100%' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewCourse(course._id);
                      }}
                    >
                      {user ? 'View Course' : 'Login to View'}
                    </button>
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

