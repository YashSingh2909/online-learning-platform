import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { enrollmentAPI, assignmentAPI, uploadAPI } from '../api/apiService';

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
      const [assignRes, subsRes] = await Promise.all([
        assignmentAPI.getAssignmentsByCourse(courseId),
        assignmentAPI.getUserSubmissions(courseId),
      ]);

      const list = assignRes.data.data || [];
      const submissions = subsRes.data.data || [];

      const byAssignment = new Map();
      submissions.forEach((s) => {
        const aId = s.assignmentId || s.assignment?._id;
        if (!aId) return;
        byAssignment.set(aId, s);
      });

      const merged = list.map((a) => {
        const sub = byAssignment.get(a._id);
        return {
          ...a,
          __submission: sub || null,
        };
      });

      setAssignments(merged);
    } catch (e) {
      setError(e?.message || 'Failed to load assignments');
    } finally {
      setAssignmentsLoading(false);
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
          <p className="dashboard-label">Assignments</p>
          <h1 className="dashboard-title">Submit Your Work</h1>
          <p className="dashboard-desc">View assignments by course and submit when ready.</p>
        </div>

          {loading ? (
            <div className="dashboard-loading">
              <p className="loading-text">Loading assignments...</p>
            </div>
          ) : error ? (
            error === 'LOCKED' ? (
              <LockedContent
                title="Assignments locked"
                description="Enroll to access this course content."
                ctaLabel="Enroll to access"
                ctaTo="/courses"
              />
            ) : (
              <div className="dashboard-error">
                {error}
              </div>
            )
          ) : enrollments.length === 0 ? (
            <div className="dashboard-empty">
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 mb-6">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                  </svg>
                </div>
                <h2 className="dashboard-empty-title">No enrolled courses yet</h2>
                <p className="dashboard-empty-text">
                  Start your learning journey by enrolling in a course. Once enrolled, you'll be able to view and submit assignments here.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center" style={{ marginTop: '1rem' }}>
                  <Link
                    to="/courses"
                    className="btn-action"
                  >
                    Browse Courses
                  </Link>
                  <Link to="/dashboard" className="btn-action">
                    Go to Dashboard
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {!selectedCourse ? (
                <div className="dashboard-grid">
                  {enrollments.map((enr) => (
                    <div
                      key={enr._id}
                      className="dashboard-section cursor-pointer group"
                      style={{ 
                        background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(20,184,166,0.1))',
                        borderColor: 'rgba(255,255,255,0.1)'
                      }}
                      onClick={() => loadAssignments(enr.course._id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') loadAssignments(enr.course._id);
                      }}
                    >
                      <div className="dashboard-section-header">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 flex items-center justify-center">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
                                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                              </svg>
                            </div>
                            <h3 className="dashboard-section-title group-hover:text-emerald-300 transition-colors">{enr.course?.title || 'Course'}</h3>
                          </div>
                          <p className="dashboard-section-desc">Click to view assignments</p>
                        </div>
                        <span className="badge" style={{ 
                          background: 'linear-gradient(135deg, rgba(16,185,129,0.9), rgba(20,184,166,0.9))'
                        }}>
                          Assignments
                        </span>
                      </div>
                      <div style={{ marginTop: '1rem' }}>
                        <button className="btn-action w-full" type="button">
                          View Assignments
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
                    type="button"
                  >
                    ← Back to courses
                  </button>

                  {assignmentsLoading ? (
                    <div className="dashboard-loading">
                      <p className="loading-text">Loading assignments...</p>
                    </div>
                  ) : assignments.length === 0 ? (
                    <div className="dashboard-empty">
                      <div className="relative z-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 mb-6">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                          </svg>
                        </div>
                        <h2 className="dashboard-empty-title">No assignments available</h2>
                        <p className="dashboard-empty-text">
                          This course doesn't have any assignments yet. Check back later or contact your instructor for more information.
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
                      {assignments.map((assignment) => {
                        const sub = assignment.__submission;
                        const status = sub?.status;

                        return (
                          <div key={assignment._id} className="dashboard-section group" style={{ 
                            background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(20,184,166,0.1))',
                            borderColor: 'rgba(255,255,255,0.1)'
                          }}>
                            <div className="dashboard-section-header">
                              <div className="flex-1">
                                <h3 className="dashboard-section-title group-hover:text-emerald-300 transition-colors">{assignment.title}</h3>
                                <p className="dashboard-section-desc">{assignment.description || 'Complete this assignment.'}</p>
                              </div>
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 flex items-center justify-center flex-shrink-0">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
                                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                                </svg>
                              </div>
                            </div>

                            <div style={{ marginTop: '1rem' }} className="grid grid-cols-2 gap-3">
                              <div style={{ 
                                background: 'rgba(255,255,255,0.05)', 
                                border: '1px solid rgba(255,255,255,0.1)', 
                                borderRadius: '0.75rem', 
                                padding: '0.75rem' 
                              }}>
                                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                    <rect x="3" y="4" width="18" height="18" rx="2" />
                                    <path d="M16 2v4M8 2v4M3 10h18" />
                                  </svg>
                                  Due:{' '}
                                  {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No due date'}
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
                                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                                  </svg>
                                  {assignment.totalPoints || 100} points
                                </div>
                              </div>
                            </div>

                            {assignment.resourceUrls && assignment.resourceUrls.length > 0 && (
                              <div style={{ marginTop: '1rem' }}>
                                <div className="flex items-center gap-2 mb-2">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--accent-color)' }}>
                                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
                                  </svg>
                                  <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Assignment Resources</p>
                                </div>
                                <div style={{ 
                                  background: 'rgba(255,255,255,0.05)', 
                                  border: '1px solid rgba(255,255,255,0.1)', 
                                  borderRadius: '0.75rem', 
                                  padding: '0.75rem' 
                                }}>
                                  {assignment.resourceUrls.map((url, index) => (
                                    <a
                                      key={index}
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm"
                                      style={{ 
                                        color: 'var(--accent-color)',
                                        textDecoration: 'underline',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.5rem 0',
                                        transition: 'color 0.2s'
                                      }}
                                      onMouseEnter={(e) => e.target.style.color = 'var(--accent-hover)'}
                                      onMouseLeave={(e) => e.target.style.color = 'var(--accent-color)'}
                                    >
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                                        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
                                      </svg>
                                      {url.split('/').pop() || `Resource ${index + 1}`}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}

                            {status === 'submitted' && (
                              <div style={{ 
                                marginTop: '1rem',
                                borderRadius: '0.75rem',
                                border: '1px solid rgba(34,211,238,0.3)',
                                background: 'rgba(34,211,238,0.1)',
                                padding: '1rem'
                              }}>
                                <div className="flex items-center gap-2">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-400">
                                    <circle cx="12" cy="12" r="10"/>
                                    <path d="M12 6v6l4 2"/>
                                  </svg>
                                  <p className="text-sm font-semibold text-cyan-200">Submitted</p>
                                </div>
                                <p className="text-xs" style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Awaiting instructor grading.</p>
                                {sub?.fileUrl && (
                                  <div style={{ marginTop: '0.75rem' }}>
                                    <a
                                      href={sub.fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm"
                                      style={{ 
                                        color: 'var(--accent-color)',
                                        textDecoration: 'underline',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                      }}
                                    >
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                                        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
                                      </svg>
                                      View Submitted File
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}

                            {status === 'graded' && (
                              <div style={{ 
                                marginTop: '1rem',
                                borderRadius: '0.75rem',
                                border: '1px solid rgba(16,185,129,0.3)',
                                background: 'rgba(16,185,129,0.1)',
                                padding: '1rem'
                              }}>
                                <div className="flex items-center gap-2">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                  </svg>
                                  <p className="text-sm font-semibold text-emerald-200">Graded</p>
                                </div>
                                <p className="text-xs" style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Score: {sub?.score ?? 0}</p>
                                {sub?.feedback ? (
                                  <p className="text-sm" style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{sub.feedback}</p>
                                ) : null}
                                {sub?.gradedAt ? (
                                  <p className="text-xs" style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                    Graded on: {new Date(sub.gradedAt).toLocaleString()}
                                  </p>
                                ) : null}
                                {sub?.fileUrl && (
                                  <div style={{ marginTop: '0.75rem' }}>
                                    <a
                                      href={sub.fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm"
                                      style={{ 
                                        color: 'var(--accent-color)',
                                        textDecoration: 'underline',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                      }}
                                    >
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                                        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
                                      </svg>
                                      View Submitted File
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}

                            {status !== 'submitted' && status !== 'graded' && (
                              <button
                                className="btn-action w-full"
                                style={{ marginTop: '1rem' }}
                                type="button"
                                onClick={async () => {
                                  try {
                                    const input = document.createElement('input');
                                    input.type = 'file';
                                    input.accept =
                                      '.pdf,.doc,.docx,.ppt,.pptx,.zip,.png,.jpg,.jpeg,.webp';

                                    input.onchange = async () => {
                                      const file = input.files?.[0];
                                      if (!file) return;

                                      const uploadRes = await uploadAPI.uploadStudentAssignmentFile(file);
                                      const fileUrl = uploadRes?.data?.data?.url;
                                      if (!fileUrl) throw new Error('Upload failed: no file url returned');

                                      await assignmentAPI.submitAssignment(assignment._id, { fileUrl });
                                      alert('Assignment submitted successfully!');

                                      await loadAssignments(selectedCourse);
                                    };

                                    input.click();
                                  } catch (e) {
                                    alert(
                                      e?.response?.data?.message || e?.message || 'Failed to submit assignment'
                                    );
                                  }
                                }}
                              >
                                Submit Assignment
                              </button>
                            )}
                          </div>
                        );
                      })}
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

