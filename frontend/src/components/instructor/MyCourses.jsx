import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { courseAPI } from '../../api/apiService';

const getErrorMessage = (error, fallback) => error?.message || error?.response?.data?.message || fallback;

export default function MyCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadCourses = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await courseAPI.getInstructorCourses();
      setCourses(res?.data?.data || []);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load your courses.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const togglePublish = async (course) => {
    setMessage('');
    setError('');
    try {
      if (course.isPublished) {
        await courseAPI.unpublishCourse(course._id);
        setMessage('Course moved to draft.');
      } else {
        await courseAPI.publishCourse(course._id);
        setMessage('Course published.');
      }
      await loadCourses();
    } catch (err) {
      setError(getErrorMessage(err, 'Could not update publish status.'));
    }
  };

  const deleteCourse = async (courseId) => {
    if (!window.confirm('Delete this course and its content?')) return;
    setMessage('');
    setError('');
    try {
      await courseAPI.deleteCourse(courseId);
      setMessage('Course deleted.');
      await loadCourses();
    } catch (err) {
      setError(getErrorMessage(err, 'Could not delete course.'));
    }
  };

  const resetThumbnail = async (courseId) => {
    if (!window.confirm('Reset thumbnail to auto-generated? This will remove any custom thumbnail.')) return;
    setMessage('');
    setError('');
    try {
      await courseAPI.resetCourseThumbnail(courseId);
      setMessage('Thumbnail reset to auto-generated.');
      await loadCourses();
    } catch (err) {
      setError(getErrorMessage(err, 'Could not reset thumbnail.'));
    }
  };

  return (
    <>
      <div className="dashboard-header">
        <p className="dashboard-label">Instructor</p>
        <h1 className="dashboard-title">My Courses</h1>
        <p className="dashboard-desc">Manage publishing, lessons, quizzes and assignments for courses you created.</p>
      </div>

      {message && <div className="dashboard-section" style={{ borderColor: 'rgba(34, 211, 238, 0.35)', marginBottom: '1rem' }}>{message}</div>}
      {error && <div className="dashboard-error" style={{ marginBottom: '1rem' }}>{error}</div>}

      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <div>
            <h2 className="dashboard-section-title">Course Library</h2>
            <p className="dashboard-section-desc">Open a course to manage lessons, quizzes, and assignments.</p>
          </div>
          <Link to="/instructor/create-course" className="btn-action">Create course</Link>
        </div>

        {loading ? (
          <div className="dashboard-loading"><p className="loading-text">Loading courses...</p></div>
        ) : courses.length === 0 ? (
          <div className="dashboard-empty">
            <h2 className="dashboard-empty-title">No courses yet</h2>
            <p className="dashboard-empty-text">Create your first course and it will be published by default.</p>
            <button className="btn-action" style={{ marginTop: '1.5rem' }} onClick={() => navigate('/instructor/create-course')}>
              Create course
            </button>
          </div>
        ) : (
          <div className="dashboard-grid">
            {courses.map((course) => (
              <div key={course._id} className="course-card-alt">
                <div className="course-card-header">
                  <div>
                    <h3 className="course-card-title">{course.title}</h3>
                    <p className="course-card-meta">{course.category} - {course.level || 'Beginner'} - {course.lessons?.length || 0} lessons</p>
                    <p className="quiz-card-desc" style={{ marginTop: '0.5rem' }}>{course.description}</p>
                  </div>
                  <span className="course-card-badge">{course.isPublished ? 'Published' : 'Draft'}</span>
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button className="btn-action" type="button" onClick={() => navigate(`/instructor/course/${course._id}`)}>
                    Manage
                  </button>
                  <button className="btn-outline-alt" type="button" onClick={() => togglePublish(course)}>
                    {course.isPublished ? 'Unpublish' : 'Publish'}
                  </button>
                  <button className="btn-outline-alt" type="button" onClick={() => resetThumbnail(course._id)}>
                    Reset Thumbnail
                  </button>
                  <button className="btn-outline-alt" type="button" onClick={() => deleteCourse(course._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
