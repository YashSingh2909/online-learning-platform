import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { enrollmentAPI, assignmentAPI } from '../api/apiService';
import LockedContent from '../components/LockedContent';

export default function Assignments() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrollments, setEnrollments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setLoading(true);
      setError('');
      try {
        const res = await enrollmentAPI.getUserEnrollments();
        setEnrollments(res.data.data || []);
      } catch (e) {
        const status = e?.status ?? e?.response?.status;
        if (status === 403) {
          setError('LOCKED');
        } else {
          setError(e?.message || 'Failed to load assignments');
        }
      } finally {
        setLoading(false);
      }

    };
    load();
  }, [user]);

  const loadAssignments = async (courseId) => {
    setSelectedCourse(courseId);
    setAssignmentsLoading(true);
    try {
      const res = await assignmentAPI.getAssignmentsByCourse(courseId);
      setAssignments(res.data.data || []);
    } catch (e) {
      setError(e?.message || 'Failed to load assignments');
    } finally {
      setAssignmentsLoading(false);
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      <div className="container mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/70">Assignments</p>
          <h1 className="text-3xl sm:text-4xl font-semibold mt-2">Submit Your Work</h1>
          <p className="text-slate-300 mt-2">View assignments by course and submit when ready.</p>
        </div>


        {loading ? (
          <div className="dashboard-loading">
            <p className="loading-text">Loading assignments...</p>
          </div>
        ) : error ? (
          error ? (
            <LockedContent
              title={error === 'LOCKED' ? 'Assignments locked' : 'Access restricted'}
              description={error === 'LOCKED' ? 'Enroll to access this course content.' : error}
              ctaLabel="Enroll to access"
              ctaTo="/courses"
            />
          ) : (
            <div className="dashboard-error">
              <p>Failed to load assignments</p>
            </div>
          )

        ) : enrollments.length === 0 ? (
          <div className="dashboard-empty">
            <h2 className="dashboard-empty-title">No enrolled courses</h2>
            <p className="dashboard-empty-text">Enroll in a course first to unlock assignments.</p>
            <Link to="/courses" className="btn-action" style={{ marginTop: '1.5rem' }}>
              Browse Courses
            </Link>
          </div>
        ) : (
          <div>
            {!selectedCourse ? (
              <div className="dashboard-grid">
                {enrollments.map((enr) => (
                  <div
                    key={enr._id}
                    className="course-card-alt"
                    onClick={() => loadAssignments(enr.course._id)}
                  >
                    <div className="course-card-header">
                      <div>
                        <h3 className="course-card-title">{enr.course?.title || 'Course'}</h3>
                        <p className="course-card-meta">Click to view assignments</p>
                      </div>
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                      <button className="btn-action">
                        View Assignments
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

                {assignmentsLoading ? (
                  <div className="dashboard-loading">
                    <p className="loading-text">Loading assignments...</p>
                  </div>
                ) : assignments.length === 0 ? (
                  <div className="dashboard-empty">
                    <h2 className="dashboard-empty-title">No assignments available</h2>
                    <p className="dashboard-empty-text">This course doesn't have any assignments yet.</p>
                  </div>
                ) : (
                  <div className="dashboard-grid">
                    {assignments.map((assignment) => (
                      <div key={assignment._id} className="quiz-card">
                        <h3 className="quiz-card-title">{assignment.title}</h3>
                        <p className="quiz-card-desc">{assignment.description || 'Complete this assignment.'}</p>
                        <div className="quiz-card-meta">
                          <div className="quiz-meta-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" />
                              <path d="M16 2v4M8 2v4M3 10h18" />
                            </svg>
                            Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No due date'}
                          </div>
                          <div className="quiz-meta-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                            </svg>
                            {assignment.totalPoints || 100} points
                          </div>
                        </div>

                        <button
                          className="btn-action"
                          style={{ marginTop: '1rem', width: '100%' }}
                          onClick={async () => {
                            try {
                              const fileUrl = window.prompt('Enter file URL for submission (fileUrl):');
                              if (!fileUrl) return;
                              await assignmentAPI.submitAssignment(assignment._id, { fileUrl });
                              alert('Assignment submitted successfully!');
                            } catch (e) {
                              alert(
                                e?.response?.data?.message ||
                                  e?.message ||
                                  'Failed to submit assignment'
                              );
                            }
                          }}
                        >
                          Submit Assignment
                        </button>
                      </div>
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