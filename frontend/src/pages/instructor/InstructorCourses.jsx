import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { courseAPI } from '../../api/apiService';

// Minimal instructor course list + navigation to publish/lessons/quizzes/assignments.
export default function InstructorCourses() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      if (user.role !== 'instructor' && user.role !== 'admin') {
        navigate('/');
        return;
      }
      setLoading(true);
      setError('');
      try {
        // If backend supports only instructor-specific listing, we'll rely on getAllCourses for now.
        const res = await courseAPI.getAllCourses();
        setCourses(res.data.data || []);
      } catch (e) {
        setError(e?.message || 'Failed to load courses');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, navigate]);

  if (loading) return (
    <div className="dashboard-page">
      <div className="dashboard-bg">
        <div className="dashboard-orb dashboard-orb-1"></div>
        <div className="dashboard-orb dashboard-orb-2"></div>
      </div>
      <div className="dashboard-container">
        <div className="dashboard-loading">
          <p className="loading-text">Loading courses...</p>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="dashboard-page">
      <div className="dashboard-bg">
        <div className="dashboard-orb dashboard-orb-1"></div>
        <div className="dashboard-orb dashboard-orb-2"></div>
      </div>
      <div className="dashboard-container">
        <div className="dashboard-error">
          <p>{error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-page">
      <div className="dashboard-bg">
        <div className="dashboard-orb dashboard-orb-1"></div>
        <div className="dashboard-orb dashboard-orb-2"></div>
      </div>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <p className="dashboard-label">Instructor</p>
          <h1 className="dashboard-title">Your Courses</h1>
          <p className="dashboard-desc">Manage publishing, lessons, quizzes and assignments.</p>
        </div>

        {courses.length === 0 ? (
          <div className="dashboard-empty">
            <h2 className="dashboard-empty-title">No courses yet</h2>
            <p className="dashboard-empty-text">Create a course to start managing content.</p>
            <button
              className="btn-action"
              onClick={() => navigate('/instructor/create-course')}
            >
              Create Course
            </button>
          </div>
        ) : (
          <div className="dashboard-grid">
            {courses.map((c) => (
              <div key={c._id} className="dashboard-section">
                <div className="dashboard-section-header">
                  <div>
                    <h2 className="dashboard-section-title">{c.title}</h2>
                    <p className="dashboard-section-desc">{c.isPublished ? 'Published' : 'Draft'}</p>
                  </div>
                  <span className={`badge ${c.isPublished ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {c.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>

                <div className="form-actions">
                  <button
                    className="btn-action"
                    onClick={() => navigate(`/instructor/${c._id}/publish`)}
                  >
                    Publish
                  </button>
                  <button
                    className="btn-outline-alt"
                    onClick={() => navigate(`/instructor/${c._id}/lessons`)}
                  >
                    Lessons
                  </button>
                  <button
                    className="btn-outline-alt"
                    onClick={() => navigate(`/instructor/${c._id}/quizzes`)}
                  >
                    Quizzes
                  </button>
                  <button
                    className="btn-outline-alt"
                    onClick={() => navigate(`/instructor/${c._id}/assignments`)}
                  >
                    Assignments
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}