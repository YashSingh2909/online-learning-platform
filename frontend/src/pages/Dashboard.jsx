import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courseAPI, enrollmentAPI } from '../api/apiService';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, enrollmentsRes] = await Promise.all([
          courseAPI.getFeaturedCourses(),
          enrollmentAPI.getUserEnrollments(),
        ]);
        setCourses(coursesRes.data.data || []);
        setEnrollments(enrollmentsRes.data.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalStudents = courses.reduce((sum, course) => sum + (course.students || 0), 0);

  return (
    <div className="dashboard-page">
      <div className="dashboard-bg">
        <div className="dashboard-orb dashboard-orb-1"></div>
        <div className="dashboard-orb dashboard-orb-2"></div>
      </div>

      <div className="dashboard-container">
        {/* Welcome Card */}
        <div className="dashboard-section">
          <div className="dashboard-header-card">
            <div className="dashboard-header-content">
              <div>
                <p className="dashboard-label">Learning Platform</p>
                <h1 className="dashboard-title">Welcome back, {user?.name}</h1>
                <p className="dashboard-desc">Access courses, monitor progress, and keep learning.</p>
              </div>

              <div className="dashboard-role">
                <p className="dashboard-role-label">Role</p>
                <p className="dashboard-role-value capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="dashboard-main-grid">
          {/* Left */}
          <div className="dashboard-left">
            {/* Stats */}
            <div className="dashboard-stats">
              <div className="dashboard-section">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500/90 to-indigo-500/80 flex items-center justify-center text-white">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}>
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <p className="stat-value">{enrollments.length}</p>
                <p className="stat-label">Courses Enrolled</p>
              </div>

              <div className="dashboard-section">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500/90 to-indigo-500/80 flex items-center justify-center text-white">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}>
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                  </svg>
                </div>
                <p className="stat-value">{totalStudents}</p>
                <p className="stat-label">Active Students</p>
              </div>
            </div>

            {/* My Learning */}
            <div className="dashboard-section">
              <div className="dashboard-section-header">
                <div>
                  <h2 className="dashboard-section-title">My Learning</h2>
                  <p className="dashboard-section-desc">Continue where you left off.</p>
                </div>
              </div>

              {loading ? (
                <div className="dashboard-loading">
                  <p className="loading-text">Loading...</p>
                </div>
              ) : enrollments.length > 0 ? (
                <div className="dashboard-grid">
                  {enrollments.slice(0, 4).map((enr) => (
                    <Link
                      key={enr._id}
                      to={`/course/${enr.course?._id}/learn`}
                      className="dashboard-section"
                      style={{ textDecoration: 'none' }}
                    >
                      <div className="dashboard-section-header">
                        <div>
                          <h3 className="dashboard-section-title">{enr.course?.title || 'Course'}</h3>
                          <p className="dashboard-section-desc">{enr.status}</p>
                        </div>
                        <span className="badge">{enr.status}</span>
                      </div>

                      <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '9999px', overflow: 'hidden', marginTop: '1rem' }}>
                        <div
                          style={{ height: '100%', background: 'var(--accent)', borderRadius: '9999px', transition: 'all 0.3s', width: `${Math.max(0, Math.min(100, enr.progress ?? 0))}%` }}
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Completion</span>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--accent)' }}>{enr.progress ?? 0}%</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="dashboard-empty">
                  <h2 className="dashboard-empty-title">No courses yet</h2>
                  <p className="dashboard-empty-text">Enroll in a course to start learning.</p>
                  <Link to="/courses" className="btn-action" style={{ marginTop: '1rem' }}>
                    Browse Courses
                  </Link>
                </div>
              )}
            </div>

            {/* Featured */}
            <div className="dashboard-section">
              <div className="dashboard-section-header">
                <div>
                  <h2 className="dashboard-section-title">Featured Courses</h2>
                  <p className="dashboard-section-desc">Handpicked courses for career-ready skills.</p>
                </div>

                {user?.role === 'instructor' && (
                  <button
                    className="btn-action"
                    type="button"
                    onClick={() => navigate('/instructor/create-course')}
                  >
                    + Create Course
                  </button>
                )}
              </div>

              {loading ? (
                <div className="dashboard-loading">
                  <p className="loading-text">Loading courses...</p>
                </div>
              ) : courses.length > 0 ? (
                <div className="dashboard-grid">
                  {courses.slice(0, 6).map((course) => (
                    <Link
                      key={course._id}
                      to={`/course/${course._id}/learn`}
                      className="course-card-mini"
                      style={{ textDecoration: 'none' }}
                    >
                      <div className="course-card-mini-img">
                        <img src={course.thumbnail} alt={course.title} />
                        <span className="course-card-mini-badge">{course.category}</span>
                      </div>
                      <div className="course-card-mini-content">
                        <h3 className="course-card-mini-title">{course.title}</h3>
                        <p className="course-card-mini-desc">{course.description}</p>
                        <div className="course-card-mini-meta">
                          <span>₹{course.price}</span>
                          <span>★ {course.rating}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="dashboard-empty">
                  <p>No courses available.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="dashboard-right">
            <div className="dashboard-section">
              <p className="dashboard-label">Current Plan</p>
              <h3 className="dashboard-section-title" style={{ marginTop: '0.75rem' }}>Essential</h3>
              <p className="dashboard-section-desc">A flexible learning hub for students and instructors.</p>
            </div>

            <div className="dashboard-section">
              <p className="dashboard-label">Quick Actions</p>
              <div className="sidebar-actions">
                <Link to="/courses" className="sidebar-action">
                  Browse Courses
                </Link>
                <Link to="/progress" className="sidebar-action-outline">
                  View Progress
                </Link>
                <Link to="/certificates" className="sidebar-action-outline">
                  Certificates
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

