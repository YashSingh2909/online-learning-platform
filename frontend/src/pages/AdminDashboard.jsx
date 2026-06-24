import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI, courseAPI } from '../api/apiService';

const defaultCourseThumbnail = 'https://via.placeholder.com/300x200.png?text=Course+Thumbnail';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      const res = await adminAPI.getStats();
      setStats(res.data.data);
      setUsers(res.data.data.recentUsers || []);
      setCourses(res.data.data.recentCourses || []);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <p style={{ color: '#888' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-bg">
        <div className="dashboard-orb dashboard-orb-1"></div>
        <div className="dashboard-orb dashboard-orb-2"></div>
      </div>

      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header-card">
          <div className="dashboard-header-content">
            <div>
              <p className="dashboard-label">Admin Panel</p>
              <h1 className="dashboard-title">Welcome, {user?.name}</h1>
              <p className="dashboard-desc">Manage users, courses, and platform settings.</p>
            </div>
            <div className="dashboard-role">
              <p className="dashboard-role-label">Role</p>
              <p className="dashboard-role-value" style={{ color: '#06b6d4' }}>Admin</p>
            </div>
          </div>
        </div>

        {/* Admin Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {['dashboard', 'users', 'courses', 'analytics', 'submissions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === tab ? '#06b6d4' : 'transparent',
                color: activeTab === tab ? '#fff' : '#888',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'all 0.2s',
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
          <button
            onClick={handleLogout}
            style={{
              marginLeft: 'auto',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: '1px solid #333',
              background: 'transparent',
              color: '#888',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>


        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-main-grid">
            <div className="dashboard-left">
              {/* Stats Cards */}
              <div className="dashboard-stats">
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20, color: '#fff' }}>
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                  </div>
                  <p className="stat-value">{stats?.stats?.totalUsers || 0}</p>
                  <p className="stat-label">Total Users</p>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20, color: '#fff' }}>
                      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <p className="stat-value">{stats?.stats?.students || 0}</p>
                  <p className="stat-label">Students</p>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20, color: '#fff' }}>
                      <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <p className="stat-value">{stats?.stats?.instructors || 0}</p>
                  <p className="stat-label">Instructors</p>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20, color: '#fff' }}>
                      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <p className="stat-value">{stats?.stats?.totalCourses || 0}</p>
                  <p className="stat-label">Courses</p>
                </div>
              </div>

              {/* Recent Users */}
              <div className="dashboard-section">
                <h2 className="dashboard-section-title">Recent Users</h2>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #333' }}>
                        <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Name</th>
                        <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Email</th>
                        <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id} style={{ borderBottom: '1px solid #222' }}>
                          <td style={{ padding: '0.75rem', color: '#fff' }}>{u.name}</td>
                          <td style={{ padding: '0.75rem', color: '#888' }}>{u.email}</td>
                          <td style={{ padding: '0.75rem' }}>
                            <span style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              background: u.role === 'admin' ? '#06b6d4' : u.role === 'instructor' ? '#8b5cf6' : '#333',
                              color: '#fff',
                            }}>
                              {u.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Courses */}
              <div className="dashboard-section">
                <h2 className="dashboard-section-title">Recent Courses</h2>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #333' }}>
                        <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Title</th>
                        <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Level</th>
                        <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((c) => (
                        <tr key={c._id} style={{ borderBottom: '1px solid #222' }}>
                          <td style={{ padding: '0.75rem', color: '#fff' }}>{c.title}</td>
                          <td style={{ padding: '0.75rem', color: '#888' }}>{c.level}</td>
                          <td style={{ padding: '0.75rem' }}>
                            <span style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              background: c.status === 'published' ? '#10b981' : '#f59e0b',
                              color: '#fff',
                            }}>
                              {c.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="dashboard-right">
              <div className="sidebar-card">
                <p className="sidebar-label">Platform Overview</p>
                <h3 className="sidebar-title">{stats?.stats?.enrollments || 0}</h3>
                <p className="sidebar-text">Total enrollments across all courses.</p>
              </div>
              <div className="sidebar-card">
                <p className="sidebar-label">Quick Actions</p>
                <div className="sidebar-actions">
                  <button onClick={() => setActiveTab('users')} className="sidebar-action">Manage Users</button>
                  <button onClick={() => setActiveTab('courses')} className="sidebar-action-outline">Manage Courses</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <UserManagement showForm={showUserForm} setShowForm={setShowUserForm} />
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <CourseManagement showForm={showCourseForm} setShowForm={setShowCourseForm} />
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && <AnalyticsPanel />}

        {/* Submissions Tab */}
        {activeTab === 'submissions' && <SubmissionsPanel />}
      </div>
    </div>
  );
}

function AnalyticsPanel() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await adminAPI.getAnalytics();
        if (!mounted) return;
        setData(res.data.data);
      } catch (e) {
        if (!mounted) return;
        setError(e?.response?.data?.message || e?.message || 'Failed to load analytics');
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };
    if (user?.role === 'admin') run();
    return () => {
      mounted = false;
    };
  }, [user]);

  if (loading) return <div className="dashboard-section">Loading analytics...</div>;
  if (error) return <div className="dashboard-section">{error}</div>;

  return (
    <div className="dashboard-section">
      <h2 className="dashboard-section-title">Analytics</h2>
      <p className="dashboard-section-desc">Platform-wide overview.</p>

      <div className="dashboard-stats" style={{ marginTop: '1rem' }}>
        <div className="stat-card">
          <p className="stat-label">Avg Progress</p>
          <p className="stat-value" style={{ fontSize: '2rem' }}>{data?.completion?.avgProgress ?? 0}%</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Users</p>
          <p className="stat-value" style={{ fontSize: '2rem' }}>{data?.totals?.students ?? 0}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Instructors</p>
          <p className="stat-value" style={{ fontSize: '2rem' }}>{data?.totals?.instructors ?? 0}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Courses</p>
          <p className="stat-value" style={{ fontSize: '2rem' }}>{data?.totals?.courses ?? 0}</p>
        </div>
      </div>

      <div style={{ marginTop: '1rem', color: '#888', fontSize: '0.9rem' }}>
        Quizzes: {data?.totals?.quizzes ?? 0} • Assignments: {data?.totals?.assignments ?? 0}
      </div>
    </div>
  );
}

function SubmissionsPanel() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await adminAPI.getSubmissions({ limit: 200 });
        if (!mounted) return;
        setItems(res.data.data || []);
      } catch (e) {
        if (!mounted) return;
        setError(e?.response?.data?.message || e?.message || 'Failed to load submissions');
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div className="dashboard-section">Loading submissions...</div>;
  if (error) return <div className="dashboard-section">{error}</div>;

  return (
    <div className="dashboard-section">
      <h2 className="dashboard-section-title">Submissions</h2>
      <p className="dashboard-section-desc">Latest assignment submissions (read-only).</p>

      <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Course</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Assignment</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Student</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Submitted</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it._id} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '0.75rem', color: '#fff' }}>{it.courseTitle || '—'}</td>
                <td style={{ padding: '0.75rem', color: '#888' }}>{it.assignmentTitle || '—'}</td>
                <td style={{ padding: '0.75rem', color: '#888' }}>{String(it.studentId || '')}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', background: it.status === 'graded' ? '#10b981' : '#333', color: '#fff' }}>
                    {it.status}
                  </span>
                </td>
                <td style={{ padding: '0.75rem', color: '#888' }}>{it.submittedAt ? new Date(it.submittedAt).toLocaleString() : '—'}</td>
                <td style={{ padding: '0.75rem', color: '#888' }}>{typeof it.score === 'number' ? it.score : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


function UserManagement({ showForm, setShowForm }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter]);

  const fetchUsers = async () => {
    try {
      const res = await adminAPI.getAllUsers({ search, role: roleFilter || undefined });
      setUsers(res.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminAPI.deleteUser(id);
      fetchUsers();
    } catch (error) {
      alert('Error deleting user');
    }
  };

  if (loading) return <p style={{ color: '#888' }}>Loading...</p>;

  return (
    <div className="dashboard-section">
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '1px solid #333',
            background: '#1a1a1a',
            color: '#fff',
            flex: 1,
          }}
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '1px solid #333',
            background: '#1a1a1a',
            color: '#fff',
          }}
        >
          <option value="">All Roles</option>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
          <option value="admin">Admin</option>
        </select>
        <button
          onClick={() => { setEditingUser(null); setShowForm(true); }}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: 'none',
            background: '#06b6d4',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          + Add User
        </button>
      </div>

      {showForm && (
        <UserForm
          user={editingUser}
          onClose={() => { setShowForm(false); setEditingUser(null); }}
          onSave={() => { setShowForm(false); setEditingUser(null); fetchUsers(); }}
        />
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Name</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Email</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Role</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '0.75rem', color: '#fff' }}>{u.name}</td>
                <td style={{ padding: '0.75rem', color: '#888' }}>{u.email}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    background: u.role === 'admin' ? '#06b6d4' : u.role === 'instructor' ? '#8b5cf6' : '#333',
                    color: '#fff',
                  }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => { setEditingUser(u); setShowForm(true); }}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        border: 'none',
                        background: '#f59e0b',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(u._id)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        border: 'none',
                        background: '#dc2626',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CourseManagement({ showForm, setShowForm }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, [search, statusFilter]);

  const fetchCourses = async () => {
    try {
      const res = await adminAPI.getAllCourses({ search, status: statusFilter || undefined });
      setCourses(res.data.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await adminAPI.deleteCourse(id);
      fetchCourses();
    } catch (error) {
      alert('Error deleting course');
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      await courseAPI.toggleFeatured(id);
      fetchCourses();
    } catch (error) {
      alert(error.response?.data?.message || 'Error toggling featured status');
    }
  };

  if (loading) return <p style={{ color: '#888' }}>Loading...</p>;

  return (
    <div className="dashboard-section">
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '1px solid #333',
            background: '#1a1a1a',
            color: '#fff',
            flex: 1,
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '1px solid #333',
            background: '#1a1a1a',
            color: '#fff',
          }}
        >
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <button
          onClick={() => { setEditingCourse(null); setShowForm(true); }}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: 'none',
            background: '#10b981',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          + Add Course
        </button>
      </div>

      {showForm && (
        <CourseForm
          course={editingCourse}
          onClose={() => { setShowForm(false); setEditingCourse(null); }}
          onSave={() => { setShowForm(false); setEditingCourse(null); fetchCourses(); }}
        />
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Title</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Instructor</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Level</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Featured</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c._id} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '0.75rem', color: '#fff' }}>{c.title}</td>
                <td style={{ padding: '0.75rem', color: '#888' }}>{c.instructor?.name || 'N/A'}</td>
                <td style={{ padding: '0.75rem', color: '#888' }}>{c.level}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    background: c.status === 'published' ? '#10b981' : '#f59e0b',
                    color: '#fff',
                  }}>
                    {c.status}
                  </span>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <button
                    onClick={() => handleToggleFeatured(c._id)}
                    style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '4px',
                      border: 'none',
                      background: c.isFeatured ? '#f59e0b' : '#333',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                    }}
                  >
                    {c.isFeatured ? '★ Featured' : '☆ Feature'}
                  </button>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => { setEditingCourse(c); setShowForm(true); }}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        border: 'none',
                        background: '#f59e0b',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        border: 'none',
                        background: '#dc2626',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// User Form Modal
function UserForm({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'student',
    password: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (user) {
        await adminAPI.updateUser(user._id, formData);
      } else {
        await adminAPI.createUser(formData);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving user');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: '#1a1a1a', padding: '2rem', borderRadius: '12px',
        width: '400px', maxWidth: '90%'
      }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#fff' }}>
          {user ? 'Edit User' : 'Create User'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem' }}>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              style={{
                width: '100%', padding: '0.75rem', borderRadius: '8px',
                border: '1px solid #333', background: '#0a0a0a', color: '#fff'
              }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem' }}>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              style={{
                width: '100%', padding: '0.75rem', borderRadius: '8px',
                border: '1px solid #333', background: '#0a0a0a', color: '#fff'
              }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem' }}>Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              style={{
                width: '100%', padding: '0.75rem', borderRadius: '8px',
                border: '1px solid #333', background: '#0a0a0a', color: '#fff'
              }}
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem' }}>
              Password {user && '(leave blank to keep current)'}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!user}
              style={{
                width: '100%', padding: '0.75rem', borderRadius: '8px',
                border: '1px solid #333', background: '#0a0a0a', color: '#fff'
              }}
            />
          </div>
          {error && <p style={{ color: '#dc2626', marginBottom: '1rem' }}>{error}</p>}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1, padding: '0.75rem', borderRadius: '8px',
                border: '1px solid #333', background: 'transparent', color: '#888', cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                flex: 1, padding: '0.75rem', borderRadius: '8px',
                border: 'none', background: '#06b6d4', color: '#fff', cursor: 'pointer'
              }}
            >
              {saving ? 'Saving...' : user ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Course Form Modal
function CourseForm({ course, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    level: course?.level || 'beginner',
    status: course?.status || 'draft',
    price: course?.price || 0,
    // Instructor can provide thumbnail as URL (backend supports `thumbnail`)
    thumbnail: course?.thumbnail || '',
    // Optional fields used by backend (safe defaults)
    category: course?.category || 'General',
    duration: course?.duration || '0 hours',
    lessons: course?.lessons || [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (course) {
        await adminAPI.updateCourse(course._id, formData);
      } else {
        await adminAPI.createCourse(formData);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving course');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: '#1a1a1a', padding: '2rem', borderRadius: '12px',
        width: '500px', maxWidth: '90%'
      }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#fff' }}>
          {course ? 'Edit Course' : 'Create Course'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem' }}>Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              style={{
                width: '100%', padding: '0.75rem', borderRadius: '8px',
                border: '1px solid #333', background: '#0a0a0a', color: '#fff'
              }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem' }}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              style={{
                width: '100%', padding: '0.75rem', borderRadius: '8px',
                border: '1px solid #333', background: '#0a0a0a', color: '#fff', resize: 'vertical'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem' }}>Level</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                style={{
                  width: '100%', padding: '0.75rem', borderRadius: '8px',
                  border: '1px solid #333', background: '#0a0a0a', color: '#fff'
                }}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem' }}>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                style={{
                  width: '100%', padding: '0.75rem', borderRadius: '8px',
                  border: '1px solid #333', background: '#0a0a0a', color: '#fff'
                }}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem' }}>Price ($)</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              min="0"
              step="0.01"
              style={{
                width: '100%', padding: '0.75rem', borderRadius: '8px',
                border: '1px solid #333', background: '#0a0a0a', color: '#fff'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem' }}>Thumbnail URL (optional)</label>
            <input
              type="text"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              placeholder="Paste image URL (recommended)"
              style={{
                width: '100%', padding: '0.75rem', borderRadius: '8px',
                border: '1px solid #333', background: '#0a0a0a', color: '#fff'
              }}
            />
          </div>
          {error && <p style={{ color: '#dc2626', marginBottom: '1rem' }}>{error}</p>}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1, padding: '0.75rem', borderRadius: '8px',
                border: '1px solid #333', background: 'transparent', color: '#888', cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                flex: 1, padding: '0.75rem', borderRadius: '8px',
                border: 'none', background: '#10b981', color: '#fff', cursor: 'pointer'
              }}
            >
              {saving ? 'Saving...' : course ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}