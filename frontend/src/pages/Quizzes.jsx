import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { enrollmentAPI, quizAPI } from '../api/apiService';

export default function Quizzes() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [quizzesLoading, setQuizzesLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setLoading(true);
      setError('');
      try {
        const res = await enrollmentAPI.getUserEnrollments();
        setCourses(res.data.data || []);
      } catch (e) {
        setError(e?.message || 'Failed to load quizzes');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const loadQuizzes = async (courseId) => {
    setSelectedCourse(courseId);
    setQuizzesLoading(true);
    try {
      const res = await quizAPI.getQuizzesByCourse(courseId);
      setQuizzes(res.data.data || []);
    } catch (e) {
      setError(e?.message || 'Failed to load quizzes');
    } finally {
      setQuizzesLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-bg">
        <div className="dashboard-orb dashboard-orb-1"></div>
        <div className="dashboard-orb dashboard-orb-2"></div>
      </div>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <p className="dashboard-label">Quizzes</p>
          <h1 className="dashboard-title">Test Your Knowledge</h1>
          <p className="dashboard-desc">Select a course to view and take available quizzes.</p>
        </div>

        {loading ? (
          <div className="dashboard-loading">
            <p className="loading-text">Loading quizzes...</p>
          </div>
        ) : error ? (
          <div className="dashboard-error">
            <p>{error}</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="dashboard-empty">
            <h2 className="dashboard-empty-title">No enrolled courses</h2>
            <p className="dashboard-empty-text">Enroll in a course first to unlock quizzes.</p>
            <Link to="/courses" className="btn-action" style={{ marginTop: '1.5rem' }}>
              Browse Courses
            </Link>
          </div>
        ) : (
          <div>
            {!selectedCourse ? (
              <div className="dashboard-grid">
                {courses.map((enr) => (
                  <div
                    key={enr._id}
                    className="course-card-alt"
                    onClick={() => loadQuizzes(enr.course._id)}
                  >
                    <div className="course-card-header">
                      <div>
                        <h3 className="course-card-title">{enr.course?.title || 'Course'}</h3>
                        <p className="course-card-meta">Click to view quizzes</p>
                      </div>
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                      <button className="btn-action">
                        View Quizzes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <button onClick={() => setSelectedCourse(null)} className="btn-outline-alt" style={{ marginBottom: '1.5rem' }}>
                  ← Back to courses
                </button>

                {quizzesLoading ? (
                  <div className="dashboard-loading">
                    <p className="loading-text">Loading quizzes...</p>
                  </div>
                ) : quizzes.length === 0 ? (
                  <div className="dashboard-empty">
                    <h2 className="dashboard-empty-title">No quizzes available</h2>
                    <p className="dashboard-empty-text">This course doesn't have any quizzes yet.</p>
                  </div>
                ) : (
                  <div className="dashboard-grid">
                    {quizzes.map((quiz) => (
                      <Link key={quiz._id} to={`/quiz/${quiz._id}`} className="quiz-card">
                        <h3 className="quiz-card-title">{quiz.title}</h3>
                        <p className="quiz-card-desc">{quiz.description || 'Test your knowledge with this quiz.'}</p>
                        <div className="quiz-card-meta">
                          <div className="quiz-meta-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" />
                              <path d="M12 6v6l4 2" />
                            </svg>
                            {quiz.timeLimit ? `${quiz.timeLimit} min` : 'No limit'}
                          </div>
                          <div className="quiz-meta-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M9 11l3 3L22 4" />
                              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                            </svg>
                            {quiz.questions?.length || 0} questions
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}