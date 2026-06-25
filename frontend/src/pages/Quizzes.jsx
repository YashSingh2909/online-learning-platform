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
              {error}
            </div>
          ) : courses.length === 0 ? (
            <div className="dashboard-empty">
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-400/30 mb-6">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-400">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </div>
                <h2 className="dashboard-empty-title">No enrolled courses yet</h2>
                <p className="dashboard-empty-text">
                  Start your learning journey by enrolling in a course. Once enrolled, you'll be able to test your knowledge with quizzes.
                </p>
                <Link
                  to="/courses"
                  className="btn-action"
                  style={{ marginTop: '1rem' }}
                >
                  Browse Courses
                </Link>
              </div>
            </div>
          ) : (
            <div>
              {!selectedCourse ? (
                <div className="dashboard-grid">
                  {courses.map((enr) => (
                    <div
                      key={enr._id}
                      className="dashboard-section cursor-pointer group"
                      style={{ 
                        background: 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(6,182,212,0.1))',
                        borderColor: 'rgba(255,255,255,0.1)'
                      }}
                      onClick={() => loadQuizzes(enr.course._id)}
                    >
                      <div className="dashboard-section-header">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-400/30 flex items-center justify-center">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-400">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
                                <line x1="12" y1="17" x2="12.01" y2="17"/>
                              </svg>
                            </div>
                            <h3 className="dashboard-section-title group-hover:text-purple-300 transition-colors">{enr.course?.title || 'Course'}</h3>
                          </div>
                          <p className="dashboard-section-desc">Click to view quizzes</p>
                        </div>
                        <span className="badge" style={{ 
                          background: 'linear-gradient(135deg, rgba(168,85,247,0.9), rgba(6,182,212,0.9))'
                        }}>
                          Quizzes
                        </span>
                      </div>
                      <div style={{ marginTop: '1rem' }}>
                        <button className="btn-action w-full">
                          View Quizzes
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="btn-action"
                    style={{ marginBottom: '1.5rem' }}
                  >
                    ← Back to courses
                  </button>

                  {quizzesLoading ? (
                    <div className="dashboard-loading">
                      <p className="loading-text">Loading quizzes...</p>
                    </div>
                  ) : quizzes.length === 0 ? (
                    <div className="dashboard-empty">
                      <div className="relative z-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-400/30 mb-6">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-400">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                          </svg>
                        </div>
                        <h2 className="dashboard-empty-title">No quizzes available</h2>
                        <p className="dashboard-empty-text">
                          This course doesn't have any quizzes yet. Check back later or contact your instructor for more information.
                        </p>
                        <button
                          onClick={() => setSelectedCourse(null)}
                          className="btn-action"
                          style={{ marginTop: '1rem' }}
                        >
                          Browse Other Courses
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="dashboard-grid">
                      {quizzes.map((quiz) => (
                        <Link
                          key={quiz._id}
                          to={`/quiz/${quiz._id}`}
                          className="dashboard-section block group"
                          style={{ 
                            background: 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(6,182,212,0.1))',
                            borderColor: 'rgba(255,255,255,0.1)'
                          }}
                        >
                          <div className="dashboard-section-header">
                            <div className="flex-1">
                              <h3 className="dashboard-section-title group-hover:text-purple-300 transition-colors">{quiz.title}</h3>
                              <p className="dashboard-section-desc">
                                {quiz.description || 'Test your knowledge with this quiz.'}
                              </p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-400/30 flex items-center justify-center flex-shrink-0">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-400">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
                                <line x1="12" y1="17" x2="12.01" y2="17"/>
                              </svg>
                            </div>
                          </div>

                          <div style={{ marginTop: '1.25rem' }} className="grid grid-cols-2 gap-3">
                            <div style={{ 
                              background: 'rgba(255,255,255,0.05)', 
                              border: '1px solid rgba(255,255,255,0.1)', 
                              borderRadius: '0.75rem', 
                              padding: '0.75rem' 
                            }}>
                              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                  <circle cx="12" cy="12" r="10" />
                                  <path d="M12 6v6l4 2" />
                                </svg>
                                <span>{quiz.timeLimit ? `${quiz.timeLimit} min` : 'No limit'}</span>
                              </div>
                            </div>
                            <div style={{ 
                              background: 'rgba(255,255,255,0.05)', 
                              border: '1px solid rgba(255,255,255,0.1)', 
                              borderRadius: '0.75rem', 
                              padding: '0.75rem' 
                            }}>
                              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                  <path d="M9 11l3 3L22 4" />
                                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                                </svg>
                                <span>{quiz.questions?.length || 0} questions</span>
                              </div>
                            </div>
                          </div>
                          
                          <div style={{ marginTop: '1rem' }}>
                            <button className="btn-action w-full">
                              Start Quiz
                            </button>
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