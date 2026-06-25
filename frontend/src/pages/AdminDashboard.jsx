import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI, courseAPI, quizAPI, assignmentAPI, uploadAPI } from '../api/apiService';

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
          {['dashboard', 'users', 'courses', 'course-deep', 'enrollments', 'students', 'quizzes', 'assignments', 'certificates', 'analytics', 'submissions'].map((tab) => (
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
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left p-3 text-xs text-slate-400">Name</th>
                        <th className="text-left p-3 text-xs text-slate-400">Email</th>
                        <th className="text-left p-3 text-xs text-slate-400">Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id} className="border-b border-white/5">
                          <td className="p-3 text-white">{u.name}</td>
                          <td className="p-3 text-slate-400">{u.email}</td>
                          <td className="p-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                              u.role === 'admin' 
                                ? 'bg-cyan-500/20 text-cyan-200' 
                                : u.role === 'instructor' 
                                  ? 'bg-violet-500/20 text-violet-200' 
                                  : 'bg-white/10 text-slate-400'
                            }`}>
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
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left p-3 text-xs text-slate-400">Title</th>
                        <th className="text-left p-3 text-xs text-slate-400">Level</th>
                        <th className="text-left p-3 text-xs text-slate-400">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((c) => (
                        <tr key={c._id} className="border-b border-white/5">
                          <td className="p-3 text-white">{c.title}</td>
                          <td className="p-3 text-slate-400">{c.level}</td>
                          <td className="p-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                              c.status === 'published' 
                                ? 'bg-emerald-500/20 text-emerald-200' 
                                : 'bg-amber-500/20 text-amber-200'
                            }`}>
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

        {/* Course Deep Management Tab */}
        {activeTab === 'course-deep' && <CourseDeepManagement />}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && <AnalyticsPanel />}

        {/* Submissions Tab */}
        {activeTab === 'submissions' && <SubmissionsPanel />}

        {/* Enrollments Tab */}
        {activeTab === 'enrollments' && <EnrollmentManagement />}

        {/* Students Tab */}
        {activeTab === 'students' && <StudentProgressCenter />}

        {/* Quizzes Tab */}
        {activeTab === 'quizzes' && <QuizControlCenter />}

        {/* Assignments Tab */}
        {activeTab === 'assignments' && <AssignmentControlCenter />}

        {/* Certificates Tab */}
        {activeTab === 'certificates' && <CertificateManagement />}
      </div>
    </div>
  );
}

function AnalyticsPanel() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [useEnhanced, setUseEnhanced] = useState(false);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setLoading(true);
        setError('');
        const res = useEnhanced 
          ? await adminAPI.getEnhancedAnalytics({ timeRange })
          : await adminAPI.getAnalytics();
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
  }, [user, useEnhanced, timeRange]);

  if (loading) return <div className="dashboard-section">Loading analytics...</div>;
  if (error) return <div className="dashboard-section">{error}</div>;

  return (
    <div className="dashboard-section">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="dashboard-section-title">Analytics</h2>
          <p className="dashboard-section-desc">Platform-wide overview.</p>
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setUseEnhanced(!useEnhanced)}
            className={`inline-flex items-center px-4 py-2 rounded-xl border border-white/10 transition text-sm ${
              useEnhanced 
                ? 'bg-cyan-500 text-slate-950 border-cyan-500' 
                : 'bg-white/5 hover:bg-white/10 text-white'
            }`}
          >
            {useEnhanced ? 'Enhanced' : 'Basic'}
          </button>
          {useEnhanced && (
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:border-cyan-400/40"
            >
              <option value="7">7 Days</option>
              <option value="30">30 Days</option>
              <option value="90">90 Days</option>
            </select>
          )}
        </div>
      </div>

      {!useEnhanced ? (
        <>
          <div className="dashboard-stats mt-4">
            <div className="stat-card">
              <p className="stat-label">Avg Progress</p>
              <p className="stat-value text-5xl">{data?.completion?.avgProgress ?? 0}%</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Users</p>
              <p className="stat-value text-5xl">{data?.totals?.students ?? 0}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Instructors</p>
              <p className="stat-value text-5xl">{data?.totals?.instructors ?? 0}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Courses</p>
              <p className="stat-value text-5xl">{data?.totals?.courses ?? 0}</p>
            </div>
          </div>

          <div className="mt-4 text-slate-400 text-sm">
            Quizzes: {data?.totals?.quizzes ?? 0} • Assignments: {data?.totals?.assignments ?? 0}
          </div>
        </>
      ) : (
        <EnhancedAnalyticsView data={data} />
      )}
    </div>
  );
}

function EnhancedAnalyticsView({ data }) {
  return (
    <div className="grid gap-6">
      {/* Totals */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <p className="stat-label">Total Users</p>
          <p className="stat-value">{data?.totals?.users ?? 0}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Students</p>
          <p className="stat-value">{data?.totals?.students ?? 0}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Instructors</p>
          <p className="stat-value">{data?.totals?.instructors ?? 0}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Courses</p>
          <p className="stat-value">{data?.totals?.courses ?? 0}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Enrollments</p>
          <p className="stat-value">{data?.totals?.enrollments ?? 0}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Certificates</p>
          <p className="stat-value">{data?.totals?.certificates ?? 0}</p>
        </div>
      </div>

      {/* Course Completion Rates */}
      <div className="bg-white/5 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-4">Course Completion Rates</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-3 text-xs text-slate-400">Course</th>
                <th className="text-left p-3 text-xs text-slate-400">Enrollments</th>
                <th className="text-left p-3 text-xs text-slate-400">Completed</th>
                <th className="text-left p-3 text-xs text-slate-400">Rate</th>
              </tr>
            </thead>
            <tbody>
              {data?.courseMetrics?.completionRates?.map((course, idx) => (
                <tr key={idx} className="border-b border-white/5">
                  <td className="p-3 text-white">{course.title}</td>
                  <td className="p-3 text-slate-400">{course.totalEnrollments}</td>
                  <td className="p-3 text-slate-400">{course.completedEnrollments}</td>
                  <td className="p-3 text-slate-400">{Math.round(course.completionRate)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quiz Stats */}
      <div className="bg-white/5 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-4">Quiz Performance by Course</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-3 text-xs text-slate-400">Course</th>
                <th className="text-left p-3 text-xs text-slate-400">Attempts</th>
                <th className="text-left p-3 text-xs text-slate-400">Avg Score</th>
              </tr>
            </thead>
            <tbody>
              {data?.courseMetrics?.quizStats?.map((stat, idx) => (
                <tr key={idx} className="border-b border-white/5">
                  <td className="p-3 text-white">{stat.courseTitle}</td>
                  <td className="p-3 text-slate-400">{stat.totalAttempts}</td>
                  <td className="p-3 text-slate-400">{Math.round(stat.avgScore)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SubmissionsPanel() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [error, setError] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [studentFilter, setStudentFilter] = useState('');

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await adminAPI.getSubmissions({ limit: 200 });
        if (!mounted) return;
        setItems(res.data.data || []);
        setFilteredItems(res.data.data || []);
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

  useEffect(() => {
    let filtered = items;

    if (courseFilter) {
      filtered = filtered.filter(item => 
        item.courseTitle?.toLowerCase().includes(courseFilter.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(item => 
        item.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (studentFilter) {
      filtered = filtered.filter(item => 
        String(item.studentId)?.toLowerCase().includes(studentFilter.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [courseFilter, statusFilter, studentFilter, items]);

  if (loading) return <div className="dashboard-section">Loading submissions...</div>;
  if (error) return <div className="dashboard-section">{error}</div>;

  return (
    <div className="dashboard-section">
      <h2 className="dashboard-section-title">Submissions</h2>
      <p className="dashboard-section-desc">Latest assignment submissions (read-only).</p>

      <div className="flex gap-4 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Filter by course..."
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="form-input flex-1 min-w-[200px]"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:border-cyan-400/40"
        >
          <option value="">All Status</option>
          <option value="submitted">Submitted</option>
          <option value="graded">Graded</option>
        </select>
        <input
          type="text"
          placeholder="Filter by student ID..."
          value={studentFilter}
          onChange={(e) => setStudentFilter(e.target.value)}
          className="form-input flex-1 min-w-[200px]"
        />
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-3 text-xs text-slate-400">Course</th>
              <th className="text-left p-3 text-xs text-slate-400">Assignment</th>
              <th className="text-left p-3 text-xs text-slate-400">Student</th>
              <th className="text-left p-3 text-xs text-slate-400">Status</th>
              <th className="text-left p-3 text-xs text-slate-400">Submitted</th>
              <th className="text-left p-3 text-xs text-slate-400">Score</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((it) => (
              <tr key={it._id} className="border-b border-white/5">
                <td className="p-3 text-white">{it.courseTitle || '—'}</td>
                <td className="p-3 text-slate-400">{it.assignmentTitle || '—'}</td>
                <td className="p-3 text-slate-400">{String(it.studentId || '')}</td>
                <td className="p-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    it.status === 'graded' 
                      ? 'bg-emerald-500/20 text-emerald-200' 
                      : 'bg-white/10 text-slate-400'
                  }`}>
                    {it.status}
                  </span>
                </td>
                <td className="p-3 text-slate-400">{it.submittedAt ? new Date(it.submittedAt).toLocaleString() : '—'}</td>
                <td className="p-3 text-slate-400">{typeof it.score === 'number' ? it.score : '—'}</td>
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

  const handleToggleBlock = async (id, currentStatus) => {
    try {
      await adminAPI.blockUser(id, !currentStatus);
      fetchUsers();
    } catch (error) {
      alert('Error updating user block status');
    }
  };

  const handleChangeRole = async (id, newRole) => {
    try {
      await adminAPI.setUserRole(id, newRole);
      fetchUsers();
    } catch (error) {
      alert('Error changing user role');
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
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '0.75rem', color: '#fff' }}>{u.name}</td>
                <td style={{ padding: '0.75rem', color: '#888' }}>{u.email}</td>
                <td style={{ padding: '0.75rem' }}>
                  <select
                    value={u.role}
                    onChange={(e) => handleChangeRole(u._id, e.target.value)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      background: u.role === 'admin' ? '#06b6d4' : u.role === 'instructor' ? '#8b5cf6' : '#333',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    background: u.isBlocked ? '#dc2626' : '#10b981',
                    color: '#fff',
                  }}>
                    {u.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
                      onClick={() => handleToggleBlock(u._id, u.isBlocked)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        border: 'none',
                        background: u.isBlocked ? '#10b981' : '#dc2626',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                      }}
                    >
                      {u.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                    <button
                      onClick={() => handleDelete(u._id)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        border: 'none',
                        background: '#6b7280',
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
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
    fetchInstructors();
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

  const fetchInstructors = async () => {
    try {
      const res = await adminAPI.getAllUsers({ role: 'instructor' });
      setInstructors(res.data.data);
    } catch (error) {
      console.error('Error fetching instructors:', error);
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

  const handleAssignInstructor = async (courseId, instructorId) => {
    try {
      await adminAPI.setCourseInstructor(courseId, instructorId);
      fetchCourses();
    } catch (error) {
      alert('Error assigning instructor');
    }
  };

  const handleTogglePublish = async (courseId, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      await adminAPI.publishCourse(courseId, newStatus);
      fetchCourses();
    } catch (error) {
      alert('Error updating course publish status');
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
                <td style={{ padding: '0.75rem' }}>
                  <select
                    value={c.instructor?._id || ''}
                    onChange={(e) => handleAssignInstructor(c._id, e.target.value)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      background: '#1a1a1a',
                      color: '#fff',
                      border: '1px solid #333',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="">Select Instructor</option>
                    {instructors.map((inst) => (
                      <option key={inst._id} value={inst._id}>{inst.name}</option>
                    ))}
                  </select>
                </td>
                <td style={{ padding: '0.75rem', color: '#888' }}>{c.level}</td>
                <td style={{ padding: '0.75rem' }}>
                  <button
                    onClick={() => handleTogglePublish(c._id, c.status)}
                    style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '4px',
                      border: 'none',
                      background: c.status === 'published' ? '#10b981' : '#f59e0b',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                    }}
                  >
                    {c.status === 'published' ? 'Published' : 'Draft'}
                  </button>
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
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
                        background: '#6b7280',
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
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      let thumbnail = formData.thumbnail;
      if (thumbnailFile) {
        const upload = await uploadAPI.uploadCourseThumbnail(thumbnailFile);
        thumbnail = upload?.data?.data?.url || thumbnail;
      }

      const payload = {
        ...formData,
        thumbnail,
      };

      if (course) {
        await adminAPI.updateCourse(course._id, payload);
      } else {
        await adminAPI.createCourse(payload);
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
            <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem' }}>Price (₹)</label>
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
            <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem' }}>Course Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
              style={{
                width: '100%', padding: '0.75rem', borderRadius: '8px',
                border: '1px solid #333', background: '#0a0a0a', color: '#fff'
              }}
            />
            {formData.thumbnail && !thumbnailFile && (
              <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>
                Current: {formData.thumbnail}
              </p>
            )}
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

// Enrollment Management Component
function EnrollmentManagement() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseFilter, setCourseFilter] = useState('');
  const [studentFilter, setStudentFilter] = useState('');
  const [showManualEnroll, setShowManualEnroll] = useState(false);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchEnrollments();
    fetchCourses();
    fetchStudents();
  }, [courseFilter, studentFilter]);

  const fetchEnrollments = async () => {
    try {
      const res = await adminAPI.getAllEnrollments({ courseId: courseFilter || undefined, studentId: studentFilter || undefined });
      setEnrollments(res.data.data);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await adminAPI.getAllCourses();
      setCourses(res.data.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await adminAPI.getAllUsers({ role: 'student' });
      setStudents(res.data.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleRemoveEnrollment = async (enrollmentId) => {
    if (!confirm('Are you sure you want to remove this enrollment?')) return;
    try {
      await adminAPI.removeEnrollment(enrollmentId);
      fetchEnrollments();
    } catch (error) {
      alert('Error removing enrollment');
    }
  };

  const handleResetProgress = async (enrollmentId) => {
    if (!confirm('Are you sure you want to reset this student\'s progress?')) return;
    try {
      await adminAPI.resetStudentProgress(enrollmentId);
      fetchEnrollments();
    } catch (error) {
      alert('Error resetting progress');
    }
  };

  if (loading) return <div className="dashboard-section">Loading enrollments...</div>;

  return (
    <div className="dashboard-section">
      <h2 className="dashboard-section-title">Enrollment Management</h2>
      <p className="dashboard-section-desc">Manage student enrollments and progress.</p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Filter by course ID..."
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '1px solid #333',
            background: '#1a1a1a',
            color: '#fff',
            flex: 1,
            minWidth: '200px',
          }}
        />
        <input
          type="text"
          placeholder="Filter by student ID..."
          value={studentFilter}
          onChange={(e) => setStudentFilter(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '1px solid #333',
            background: '#1a1a1a',
            color: '#fff',
            flex: 1,
            minWidth: '200px',
          }}
        />
        <button
          onClick={() => setShowManualEnroll(true)}
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
          + Manual Enroll
        </button>
      </div>

      {showManualEnroll && (
        <ManualEnrollForm
          courses={courses}
          students={students}
          onClose={() => setShowManualEnroll(false)}
          onSuccess={() => {
            setShowManualEnroll(false);
            fetchEnrollments();
          }}
        />
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Student</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Course</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Progress</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Enrolled</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((e) => (
              <tr key={e._id} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '0.75rem', color: '#fff' }}>{e.student?.name || '—'}</td>
                <td style={{ padding: '0.75rem', color: '#888' }}>{e.course?.title || '—'}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    background: e.status === 'completed' ? '#10b981' : '#333',
                    color: '#fff',
                  }}>
                    {e.status}
                  </span>
                </td>
                <td style={{ padding: '0.75rem', color: '#888' }}>{e.progress || 0}%</td>
                <td style={{ padding: '0.75rem', color: '#888' }}>{e.enrolledAt ? new Date(e.enrolledAt).toLocaleDateString() : '—'}</td>
                <td style={{ padding: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handleResetProgress(e._id)}
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
                      Reset Progress
                    </button>
                    <button
                      onClick={() => handleRemoveEnrollment(e._id)}
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
                      Remove
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

// Manual Enrollment Form Component
function ManualEnrollForm({ courses, students, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    courseId: '',
    studentId: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await adminAPI.manualEnrollStudent(formData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Error enrolling student');
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
        <h2 style={{ marginBottom: '1.5rem', color: '#fff' }}>Manual Enrollment</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem' }}>Course</label>
            <select
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              required
              style={{
                width: '100%', padding: '0.75rem', borderRadius: '8px',
                border: '1px solid #333', background: '#0a0a0a', color: '#fff'
              }}
            >
              <option value="">Select Course</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>{c.title}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem' }}>Student</label>
            <select
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              required
              style={{
                width: '100%', padding: '0.75rem', borderRadius: '8px',
                border: '1px solid #333', background: '#0a0a0a', color: '#fff'
              }}
            >
              <option value="">Select Student</option>
              {students.map((s) => (
                <option key={s._id} value={s._id}>{s.name} ({s.email})</option>
              ))}
            </select>
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
              {saving ? 'Enrolling...' : 'Enroll'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Student Progress Center Component
function StudentProgressCenter() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await adminAPI.getAllUsers({ role: 'student' });
      setStudents(res.data.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (studentId) => {
    try {
      const res = await adminAPI.getStudentDetails(studentId);
      setStudentDetails(res.data.data);
      setSelectedStudent(studentId);
      setShowDetails(true);
    } catch (error) {
      alert('Error fetching student details');
    }
  };

  if (loading) return <div className="dashboard-section">Loading students...</div>;

  return (
    <div className="dashboard-section">
      <h2 className="dashboard-section-title">Student Progress Center</h2>
      <p className="dashboard-section-desc">View detailed student progress and activity.</p>

      {!showDetails ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '0.75rem', color: '#fff' }}>{s.name}</td>
                  <td style={{ padding: '0.75rem', color: '#888' }}>{s.email}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      background: s.isBlocked ? '#dc2626' : '#10b981',
                      color: '#fff',
                    }}>
                      {s.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <button
                      onClick={() => handleViewDetails(s._id)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        border: 'none',
                        background: '#06b6d4',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                      }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <button
            onClick={() => { setShowDetails(false); setStudentDetails(null); }}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: '1px solid #333',
              background: 'transparent',
              color: '#888',
              cursor: 'pointer',
              marginBottom: '1rem',
            }}
          >
            ← Back to Students
          </button>

          {studentDetails && (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px' }}>
                <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Student Information</h3>
                <p style={{ color: '#888' }}>Name: {studentDetails.user?.name}</p>
                <p style={{ color: '#888' }}>Email: {studentDetails.user?.email}</p>
                <p style={{ color: '#888' }}>Status: {studentDetails.user?.isBlocked ? 'Blocked' : 'Active'}</p>
              </div>

              <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px' }}>
                <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Enrollments ({studentDetails.enrollments?.length || 0})</h3>
                {studentDetails.enrollments?.map((e) => (
                  <div key={e._id} style={{ padding: '0.75rem', borderBottom: '1px solid #333' }}>
                    <p style={{ color: '#fff' }}>{e.course?.title}</p>
                    <p style={{ color: '#888', fontSize: '0.875rem' }}>Progress: {e.progress}% | Status: {e.status}</p>
                  </div>
                ))}
              </div>

              <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px' }}>
                <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Quiz Attempts ({studentDetails.quizAttempts?.length || 0})</h3>
                {studentDetails.quizAttempts?.map((attempt, idx) => (
                  <div key={idx} style={{ padding: '0.75rem', borderBottom: '1px solid #333' }}>
                    <p style={{ color: '#fff' }}>{attempt.quizTitle}</p>
                    <p style={{ color: '#888', fontSize: '0.875rem' }}>Score: {attempt.score}% | Time: {attempt.timeTaken}s</p>
                  </div>
                ))}
              </div>

              <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px' }}>
                <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Assignment Submissions ({studentDetails.assignmentSubmissions?.length || 0})</h3>
                {studentDetails.assignmentSubmissions?.map((sub, idx) => (
                  <div key={idx} style={{ padding: '0.75rem', borderBottom: '1px solid #333' }}>
                    <p style={{ color: '#fff' }}>{sub.assignmentTitle}</p>
                    <p style={{ color: '#888', fontSize: '0.875rem' }}>Status: {sub.status} | Score: {sub.score || '—'}</p>
                  </div>
                ))}
              </div>

              <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px' }}>
                <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Certificates ({studentDetails.certificates?.length || 0})</h3>
                {studentDetails.certificates?.map((cert, idx) => (
                  <div key={idx} style={{ padding: '0.75rem', borderBottom: '1px solid #333' }}>
                    <p style={{ color: '#fff' }}>{cert.course?.title}</p>
                    <p style={{ color: '#888', fontSize: '0.875rem' }}>Issued: {cert.completionDate ? new Date(cert.completionDate).toLocaleDateString() : '—'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Quiz Control Center Component
function QuizControlCenter() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [showAttempts, setShowAttempts] = useState(false);
  const [courseFilter, setCourseFilter] = useState('');

  useEffect(() => {
    fetchQuizzes();
  }, [courseFilter]);

  const fetchQuizzes = async () => {
    try {
      const res = await adminAPI.getAllQuizzes({ courseId: courseFilter || undefined });
      setQuizzes(res.data.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAttempts = async (quizId) => {
    try {
      const res = await adminAPI.getQuizAttempts(quizId);
      setQuizAttempts(res.data.data);
      setSelectedQuiz(quizId);
      setShowAttempts(true);
    } catch (error) {
      alert('Error fetching quiz attempts');
    }
  };

  const handleResetAttempt = async (quizId, attemptId) => {
    if (!confirm('Are you sure you want to reset this attempt?')) return;
    try {
      await adminAPI.resetQuizAttempt(quizId, attemptId);
      handleViewAttempts(quizId);
    } catch (error) {
      alert('Error resetting attempt');
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) return;
    try {
      await adminAPI.deleteQuiz(quizId);
      fetchQuizzes();
    } catch (error) {
      alert('Error deleting quiz');
    }
  };

  if (loading) return <div className="dashboard-section">Loading quizzes...</div>;

  return (
    <div className="dashboard-section">
      <h2 className="dashboard-section-title">Quiz Control Center</h2>
      <p className="dashboard-section-desc">Monitor and manage quiz attempts across all courses.</p>

      {!showAttempts ? (
        <>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Filter by course ID..."
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid #333',
                background: '#1a1a1a',
                color: '#fff',
                width: '300px',
              }}
            />
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Title</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Course</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Attempts</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Pass Rate</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Avg Score</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map((q) => (
                  <tr key={q._id} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '0.75rem', color: '#fff' }}>{q.title}</td>
                    <td style={{ padding: '0.75rem', color: '#888' }}>{q.course?.title || '—'}</td>
                    <td style={{ padding: '0.75rem', color: '#888' }}>{q.statistics?.totalAttempts || 0}</td>
                    <td style={{ padding: '0.75rem', color: '#888' }}>
                      {q.statistics?.totalAttempts > 0 
                        ? Math.round((q.statistics.passedCount / q.statistics.totalAttempts) * 100) + '%'
                        : '—'}
                    </td>
                    <td style={{ padding: '0.75rem', color: '#888' }}>{q.statistics?.avgScore || 0}%</td>
                    <td style={{ padding: '0.75rem' }}>
                      <button
                        onClick={() => handleViewAttempts(q._id)}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '4px',
                          border: 'none',
                          background: '#06b6d4',
                          color: '#fff',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          marginRight: '0.5rem',
                        }}
                      >
                        View Attempts
                      </button>
                      <button
                        onClick={() => handleDeleteQuiz(q._id)}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '4px',
                          border: 'none',
                          background: '#ef4444',
                          color: '#fff',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div>
          <button
            onClick={() => { setShowAttempts(false); setQuizAttempts([]); }}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: '1px solid #333',
              background: 'transparent',
              color: '#888',
              cursor: 'pointer',
              marginBottom: '1.5rem',
            }}
          >
            ← Back to Quizzes
          </button>

          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#fff', marginBottom: '1rem' }}>Quiz Attempts</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Student</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Score</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Attempted</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {quizAttempts.map((attempt) => (
                  <tr key={attempt._id} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '0.75rem', color: '#fff' }}>{attempt.student?.name || '—'}</td>
                    <td style={{ padding: '0.75rem', color: '#888' }}>{attempt.score || 0}%</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        background: attempt.score >= attempt.passingScore ? '#10b981' : '#ef4444',
                        color: '#fff',
                      }}>
                        {attempt.score >= attempt.passingScore ? 'Passed' : 'Failed'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', color: '#888' }}>{attempt.attemptedAt ? new Date(attempt.attemptedAt).toLocaleString() : '—'}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <button
                        onClick={() => handleResetAttempt(selectedQuiz, attempt._id)}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '4px',
                          border: 'none',
                          background: '#ef4444',
                          color: '#fff',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                        }}
                      >
                        Reset
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Assignment Control Center Component
function AssignmentControlCenter() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    fetchAssignments();
  }, [searchFilter]);

  const fetchAssignments = async () => {
    try {
      const res = await adminAPI.getAllAssignments({ search: searchFilter || undefined });
      setAssignments(res.data.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!confirm('Are you sure you want to delete this assignment? This action cannot be undone.')) return;
    try {
      await adminAPI.deleteAssignment(assignmentId);
      fetchAssignments();
    } catch (error) {
      alert('Error deleting assignment');
    }
  };

  if (loading) return <div className="dashboard-section">Loading assignments...</div>;

  return (
    <div className="dashboard-section">
      <h2 className="dashboard-section-title">Assignment Control Center</h2>
      <p className="dashboard-section-desc">Monitor assignment submissions and grading status.</p>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Filter by course title or ID..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '1px solid #333',
            background: '#1a1a1a',
            color: '#fff',
            width: '300px',
          }}
        />
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Title</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Course</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Submissions</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Graded</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Pending</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Avg Score</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a) => (
              <tr key={a._id} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '0.75rem', color: '#fff' }}>{a.title}</td>
                <td style={{ padding: '0.75rem', color: '#888' }}>{a.course?.title || '—'}</td>
                <td style={{ padding: '0.75rem', color: '#888' }}>{a.statistics?.totalSubmissions || 0}</td>
                <td style={{ padding: '0.75rem', color: '#888' }}>{a.statistics?.gradedCount || 0}</td>
                <td style={{ padding: '0.75rem', color: '#888' }}>{a.statistics?.pendingCount || 0}</td>
                <td style={{ padding: '0.75rem', color: '#888' }}>{a.statistics?.avgScore || 0}%</td>
                <td style={{ padding: '0.75rem' }}>
                  <button
                    onClick={() => handleDeleteAssignment(a._id)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      border: 'none',
                      background: '#ef4444',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Course Enrollments Management Component
function CourseEnrollmentsManagement({ selectedCourse }) {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [studentDetails, setStudentDetails] = useState(null);

  useEffect(() => {
    if (selectedCourse) {
      loadEnrollments();
    }
  }, [selectedCourse]);

  const loadEnrollments = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminAPI.getAllEnrollments({ courseId: selectedCourse });
      // Handle different response structures
      const enrollmentsData = res.data.data || res.data || [];
      setEnrollments(Array.isArray(enrollmentsData) ? enrollmentsData : []);
    } catch (err) {
      console.error('Error loading enrollments:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to load enrollments');
    } finally {
      setLoading(false);
    }
  };

  const handleViewStudentDetails = async (studentId) => {
    try {
      const res = await adminAPI.getStudentDetails(studentId);
      setStudentDetails(res.data.data);
      setSelectedStudent(studentId);
      setShowStudentModal(true);
    } catch (err) {
      alert('Error loading student details');
    }
  };

  const handleResetProgress = async (enrollmentId) => {
    if (!confirm('Reset student progress? This will clear all lesson, quiz, and assignment progress.')) return;
    try {
      await adminAPI.resetStudentProgress(enrollmentId);
      loadEnrollments();
    } catch (err) {
      alert('Error resetting progress');
    }
  };

  const handleRemoveEnrollment = async (enrollmentId) => {
    if (!confirm('Remove student enrollment? This action cannot be undone.')) return;
    try {
      await adminAPI.removeEnrollment(enrollmentId);
      loadEnrollments();
    } catch (err) {
      alert('Error removing enrollment');
    }
  };

  const handleMarkComplete = async (enrollmentId) => {
    if (!confirm('Mark this enrollment as completed? This will issue a certificate if not already issued.')) return;
    try {
      // Note: This would need a backend endpoint to manually mark complete
      // For now, we'll show a message
      alert('Manual completion marking would require backend endpoint implementation');
    } catch (err) {
      alert('Error marking as complete');
    }
  };

  const handleIssueCertificate = async (enrollmentId) => {
    try {
      // Check if certificate already exists
      const enrollment = enrollments.find(e => e._id === enrollmentId);
      if (enrollment && enrollment.certificateId) {
        // Download existing certificate
        const response = await adminAPI.downloadCertificate(enrollmentId);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `certificate-${enrollmentId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        // Issue new certificate
        if (!confirm('Issue certificate for this enrollment?')) return;
        await adminAPI.issueCertificate({ enrollmentId });
        loadEnrollments();
      }
    } catch (err) {
      alert('Error: ' + (err?.response?.data?.message || err?.message || 'Failed to handle certificate'));
    }
  };

  if (loading) return <div className="dashboard-section">Loading enrollments...</div>;
  if (error) return <div className="dashboard-section">{error}</div>;
  if (!selectedCourse) return <div className="dashboard-section">Course not found or not selected</div>;

  return (
    <div className="bg-white/5 p-6 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white m-0">Enrolled Students ({enrollments.length})</h3>
        <div className="flex gap-2">
          <button
            onClick={loadEnrollments}
            className="inline-flex items-center px-4 py-2 rounded-xl border border-white/10 hover:border-cyan-400/40 bg-white/5 hover:bg-white/10 transition text-sm"
          >
            Refresh
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-3 text-xs text-slate-400">Student</th>
              <th className="text-left p-3 text-xs text-slate-400">Email</th>
              <th className="text-left p-3 text-xs text-slate-400">Enrolled</th>
              <th className="text-left p-3 text-xs text-slate-400">Last Activity</th>
              <th className="text-left p-3 text-xs text-slate-400">Progress</th>
              <th className="text-left p-3 text-xs text-slate-400">Completed</th>
              <th className="text-left p-3 text-xs text-slate-400">Certificate</th>
              <th className="text-left p-3 text-xs text-slate-400">Status</th>
              <th className="text-left p-3 text-xs text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((e) => (
              <tr key={e._id} className="border-b border-white/5">
                <td className="p-3 text-white">{e.student?.name || '—'}</td>
                <td className="p-3 text-slate-400">{e.student?.email || '—'}</td>
                <td className="p-3 text-slate-400">
                  {e.enrolledAt ? new Date(e.enrolledAt).toLocaleDateString() : '—'}
                </td>
                <td className="p-3 text-slate-400">
                  {e.lastActivity ? new Date(e.lastActivity).toLocaleDateString() : '—'}
                </td>
                <td className="p-3 text-white">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full min-w-[60px] max-w-[100px]">
                      <div 
                        className={`h-full rounded-full ${
                          e.progress >= 100 ? 'bg-emerald-500' : 'bg-cyan-500'
                        }`}
                        style={{ width: `${e.progress || 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400">{e.progress || 0}%</span>
                  </div>
                </td>
                <td className="p-3 text-slate-400">
                  {e.completedAt ? new Date(e.completedAt).toLocaleDateString() : '—'}
                </td>
                <td className="p-3">
                  {e.certificateId ? (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-emerald-500/20 text-emerald-200">
                      ✓ Issued
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white/10 text-slate-400">
                      —
                    </span>
                  )}
                </td>
                <td className="p-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    e.status === 'completed' 
                      ? 'bg-emerald-500/20 text-emerald-200' 
                      : e.status === 'active' 
                        ? 'bg-cyan-500/20 text-cyan-200' 
                        : 'bg-white/10 text-slate-400'
                  }`}>
                    {e.status}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleViewStudentDetails(e.student?._id)}
                      className="inline-flex items-center justify-center px-2 py-1 rounded-lg bg-cyan-500 text-slate-950 font-medium hover:bg-cyan-400 transition text-xs"
                      title="View student details"
                    >
                      Details
                    </button>
                    {e.status === 'completed' && (
                      <button
                        onClick={() => handleIssueCertificate(e._id)}
                        className={`inline-flex items-center justify-center px-2 py-1 rounded-lg font-medium hover:opacity-80 transition text-xs ${
                          e.certificateId 
                            ? 'bg-emerald-500 text-slate-950' 
                            : 'bg-violet-500 text-white'
                        }`}
                        title={e.certificateId ? "Download certificate" : "Issue certificate"}
                      >
                        {e.certificateId ? 'Download' : 'Cert'}
                      </button>
                    )}
                    {e.status !== 'completed' && (
                      <button
                        onClick={() => handleMarkComplete(e._id)}
                        className="inline-flex items-center justify-center px-2 py-1 rounded-lg bg-emerald-500 text-slate-950 font-medium hover:bg-emerald-400 transition text-xs"
                        title="Mark as complete"
                      >
                        Complete
                      </button>
                    )}
                    <button
                      onClick={() => handleResetProgress(e._id)}
                      className="inline-flex items-center justify-center px-2 py-1 rounded-lg bg-amber-500 text-slate-950 font-medium hover:bg-amber-400 transition text-xs"
                      title="Reset progress"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => handleRemoveEnrollment(e._id)}
                      className="inline-flex items-center justify-center px-2 py-1 rounded-lg bg-red-500/20 text-red-200 font-medium hover:bg-red-500/30 transition text-xs"
                      title="Remove enrollment"
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Student Details Modal */}
      {showStudentModal && studentDetails && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: '#1a1a1a',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#fff', margin: 0 }}>Student Details</h3>
              <button
                onClick={() => { setShowStudentModal(false); setStudentDetails(null); }}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  border: '1px solid #333',
                  background: 'transparent',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ background: '#222', padding: '1rem', borderRadius: '4px' }}>
                <h4 style={{ color: '#06b6d4', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Student Information</h4>
                <p style={{ color: '#888', margin: '0.25rem 0' }}>Name: {studentDetails.user?.name || '—'}</p>
                <p style={{ color: '#888', margin: '0.25rem 0' }}>Email: {studentDetails.user?.email || '—'}</p>
                <p style={{ color: '#888', margin: '0.25rem 0' }}>Role: {studentDetails.user?.role || '—'}</p>
                <p style={{ color: '#888', margin: '0.25rem 0' }}>Status: {studentDetails.user?.isBlocked ? 'Blocked' : 'Active'}</p>
              </div>

              <div style={{ background: '#222', padding: '1rem', borderRadius: '4px' }}>
                <h4 style={{ color: '#06b6d4', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Course Enrollments ({studentDetails.enrollments?.length || 0})</h4>
                {studentDetails.enrollments?.length > 0 ? (
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    {studentDetails.enrollments.map((enrollment) => (
                      <div key={enrollment._id} style={{ 
                        background: '#333', 
                        padding: '0.75rem', 
                        borderRadius: '4px',
                        fontSize: '0.875rem'
                      }}>
                        <p style={{ color: '#fff', margin: '0.25rem 0' }}>
                          {enrollment.courseId?.title || 'Unknown Course'}
                        </p>
                        <p style={{ color: '#888', margin: '0.25rem 0' }}>
                          Progress: {enrollment.progress || 0}% | Status: {enrollment.status}
                        </p>
                        <p style={{ color: '#888', margin: '0.25rem 0' }}>
                          Enrolled: {enrollment.enrolledAt ? new Date(enrollment.enrolledAt).toLocaleDateString() : '—'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#888', margin: '0.5rem 0' }}>No enrollments found</p>
                )}
              </div>

              <div style={{ background: '#222', padding: '1rem', borderRadius: '4px' }}>
                <h4 style={{ color: '#06b6d4', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Quiz Attempts ({studentDetails.quizAttempts?.length || 0})</h4>
                {studentDetails.quizAttempts?.length > 0 ? (
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    {studentDetails.quizAttempts.slice(0, 5).map((attempt) => (
                      <div key={attempt._id} style={{ 
                        background: '#333', 
                        padding: '0.75rem', 
                        borderRadius: '4px',
                        fontSize: '0.875rem'
                      }}>
                        <p style={{ color: '#fff', margin: '0.25rem 0' }}>
                          {attempt.quizId?.title || 'Unknown Quiz'}
                        </p>
                        <p style={{ color: '#888', margin: '0.25rem 0' }}>
                          Score: {attempt.score || 0}% | Passed: {attempt.passed ? 'Yes' : 'No'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#888', margin: '0.5rem 0' }}>No quiz attempts found</p>
                )}
              </div>

              <div style={{ background: '#222', padding: '1rem', borderRadius: '4px' }}>
                <h4 style={{ color: '#06b6d4', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Certificates ({studentDetails.certificates?.length || 0})</h4>
                {studentDetails.certificates?.length > 0 ? (
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    {studentDetails.certificates.map((cert) => (
                      <div key={cert._id} style={{ 
                        background: '#333', 
                        padding: '0.75rem', 
                        borderRadius: '4px',
                        fontSize: '0.875rem'
                      }}>
                        <p style={{ color: '#fff', margin: '0.25rem 0' }}>
                          {cert.courseId?.title || 'Unknown Course'}
                        </p>
                        <p style={{ color: '#888', margin: '0.25rem 0' }}>
                          Certificate ID: {cert.certificateId || '—'}
                        </p>
                        <p style={{ color: '#888', margin: '0.25rem 0' }}>
                          Issued: {cert.completionDate ? new Date(cert.completionDate).toLocaleDateString() : '—'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#888', margin: '0.5rem 0' }}>No certificates found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Course Analytics Management Component
function CourseAnalyticsManagement({ selectedCourse }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedCourse) {
      loadAnalytics();
    }
  }, [selectedCourse]);

  const loadAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminAPI.getCourseAnalytics(selectedCourse);
      setAnalytics(res.data.data);
    } catch (err) {
      setError(err?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="dashboard-section">Loading analytics...</div>;
  if (error) return <div className="dashboard-section">{error}</div>;
  if (!selectedCourse) return <div className="dashboard-section">Course not found or not selected</div>;

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {/* Overview Cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <p className="stat-label">Total Enrollments</p>
          <p className="stat-value">{analytics?.totalEnrollments || 0}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Avg Progress</p>
          <p className="stat-value">{analytics?.avgProgress ? Math.round(analytics.avgProgress) : 0}%</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Completion Rate</p>
          <p className="stat-value">{analytics?.completionRate ? Math.round(analytics.completionRate) : 0}%</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Active Students</p>
          <p className="stat-value">{analytics?.activeStudents || 0}</p>
        </div>
      </div>

      {/* Quiz Performance */}
      {analytics?.quizStats && analytics.quizStats.length > 0 && (
        <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Quiz Performance</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Quiz</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Attempts</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Avg Score</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Pass Rate</th>
                </tr>
              </thead>
              <tbody>
                {analytics.quizStats.map((stat, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '0.75rem', color: '#fff' }}>{stat.quizTitle || '—'}</td>
                    <td style={{ padding: '0.75rem', color: '#888' }}>{stat.totalAttempts || 0}</td>
                    <td style={{ padding: '0.75rem', color: '#888' }}>{stat.avgScore ? Math.round(stat.avgScore) : 0}%</td>
                    <td style={{ padding: '0.75rem', color: '#888' }}>{stat.passRate ? Math.round(stat.passRate) : 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assignment Performance */}
      {analytics?.assignmentStats && analytics.assignmentStats.length > 0 && (
        <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Assignment Performance</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Assignment</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Submissions</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Avg Score</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Completion Rate</th>
                </tr>
              </thead>
              <tbody>
                {analytics.assignmentStats.map((stat, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '0.75rem', color: '#fff' }}>{stat.assignmentTitle || '—'}</td>
                    <td style={{ padding: '0.75rem', color: '#888' }}>{stat.totalSubmissions || 0}</td>
                    <td style={{ padding: '0.75rem', color: '#888' }}>{stat.avgScore ? Math.round(stat.avgScore) : 0}%</td>
                    <td style={{ padding: '0.75rem', color: '#888' }}>{stat.completionRate ? Math.round(stat.completionRate) : 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lesson Completion */}
      {analytics?.lessonStats && analytics.lessonStats.length > 0 && (
        <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Lesson Completion</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Lesson</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Completed</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Completion Rate</th>
                </tr>
              </thead>
              <tbody>
                {analytics.lessonStats.map((stat, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '0.75rem', color: '#fff' }}>{stat.lessonTitle || '—'}</td>
                    <td style={{ padding: '0.75rem', color: '#888' }}>{stat.completedCount || 0}</td>
                    <td style={{ padding: '0.75rem', color: '#888' }}>{stat.completionRate ? Math.round(stat.completionRate) : 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!analytics || (
        <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px' }}>
          <p style={{ color: '#888' }}>No analytics data available for this course.</p>
        </div>
      )}
    </div>
  );
}

// Course Content Management Component
function CourseContentManagement({ selectedCourse }) {
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeContentTab, setActiveContentTab] = useState('lessons');
  const [mode, setMode] = useState('view'); // view | create | edit
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [editingAssignmentId, setEditingAssignmentId] = useState(null);
  const [formData, setFormData] = useState({});
  const [videoFile, setVideoFile] = useState(null);
  const [assignmentResourceFiles, setAssignmentResourceFiles] = useState([]);
  const [showQuizAttempts, setShowQuizAttempts] = useState(false);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [selectedQuizForAttempts, setSelectedQuizForAttempts] = useState(null);
  const [showAssignmentSubmissions, setShowAssignmentSubmissions] = useState(false);
  const [assignmentSubmissions, setAssignmentSubmissions] = useState([]);
  const [selectedAssignmentForSubmissions, setSelectedAssignmentForSubmissions] = useState(null);
  const [gradingData, setGradingData] = useState({}); // { [submissionId]: { score, feedback } }
  const [submittingGrade, setSubmittingGrade] = useState(false);
  const [editingSubmission, setEditingSubmission] = useState(null); // Track which submission is being edited

  // Quiz-specific state
  const [quizFormData, setQuizFormData] = useState({
    title: '',
    description: '',
    passingScore: 70,
    timeLimit: 0,
    isFreePreview: false,
    isPublished: false,
    questions: [],
  });

  const makeEmptyQuestion = () => ({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
  });

  const resetForm = () => {
    setMode('view');
    setEditingLessonId(null);
    setEditingQuizId(null);
    setEditingAssignmentId(null);
    setFormData({});
    setVideoFile(null);
    setAssignmentResourceFiles([]);
    setQuizFormData({
      title: '',
      description: '',
      passingScore: 70,
      timeLimit: 0,
      isFreePreview: false,
      isPublished: false,
      questions: [makeEmptyQuestion()],
    });
  };

  const resetFormData = () => {
    setEditingLessonId(null);
    setEditingQuizId(null);
    setEditingAssignmentId(null);
    setFormData({});
    setVideoFile(null);
    setAssignmentResourceFiles([]);
    setQuizFormData({
      title: '',
      description: '',
      passingScore: 70,
      timeLimit: 0,
      isFreePreview: false,
      isPublished: false,
      questions: [makeEmptyQuestion()],
    });
  };

  useEffect(() => {
    console.log('CourseContentManagement - selectedCourse:', selectedCourse);
    console.log('CourseContentManagement - selectedCourse type:', typeof selectedCourse);
    if (selectedCourse) {
      loadContent();
    } else {
      setLoading(false);
      setError('No course selected');
    }
  }, [selectedCourse]);

  useEffect(() => {
    setMode('view');
    setEditingLessonId(null);
    setEditingQuizId(null);
    setEditingAssignmentId(null);
    setFormData({});
    setVideoFile(null);
    setAssignmentResourceFiles([]);
    setQuizFormData({
      title: '',
      description: '',
      passingScore: 70,
      timeLimit: 0,
      isFreePreview: false,
      isPublished: false,
      questions: [makeEmptyQuestion()],
    });
  }, [activeContentTab]);

  const loadContent = async () => {
    if (!selectedCourse) {
      console.error('No selectedCourse provided to loadContent');
      setError('Course not found or not selected');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      console.log('Loading content for course:', selectedCourse);
      console.log('Course ID type:', typeof selectedCourse);
      
      const [lessonsRes, quizzesRes, assignmentsRes] = await Promise.all([
        adminAPI.getCourseLessons(selectedCourse),
        adminAPI.getCourseQuizzes(selectedCourse),
        adminAPI.getCourseAssignments(selectedCourse),
      ]);
      
      console.log('Lessons response:', lessonsRes);
      console.log('Quizzes response:', quizzesRes);
      console.log('Assignments response:', assignmentsRes);
      
      setLessons(lessonsRes.data.data || lessonsRes.data || []);
      setQuizzes(quizzesRes.data.data || quizzesRes.data || []);
      setAssignments(assignmentsRes.data.data || assignmentsRes.data || []);
      
      console.log('Content loaded successfully');
    } catch (err) {
      console.error('Error loading content:', err);
      console.error('Error status:', err?.response?.status);
      console.error('Error data:', err?.response?.data);
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to load content';
      if (err?.response?.status === 404) {
        setError('Course not found');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!confirm('Delete this lesson?')) return;
    try {
      await adminAPI.deleteCourseLesson(selectedCourse, lessonId);
      loadContent();
    } catch (err) {
      alert('Error deleting lesson');
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!confirm('Delete this quiz?')) return;
    try {
      await adminAPI.deleteQuiz(quizId);
      loadContent();
    } catch (err) {
      alert('Error deleting quiz');
    }
  };

  const handleEditQuiz = (quiz) => {
    setMode('edit');
    setEditingQuizId(quiz._id);
    const questions = (quiz.questions || []).map((q) => ({
      question: q.questionText || q.question || '',
      options: (q.options && q.options.length ? q.options : ['', '', '', '']).slice(0, 4),
      correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : parseInt(q.correctAnswer) || 0,
    }));
    setQuizFormData({
      title: quiz.title || '',
      description: quiz.description || '',
      passingScore: quiz.passingScore || 70,
      timeLimit: quiz.timeLimit || 0,
      isFreePreview: !!quiz.isFreePreview,
      isPublished: !!quiz.isPublished,
      questions,
    });
  };

  const handleUpdateQuiz = async (e) => {
    e.preventDefault();
    try {
      const questions = quizFormData.questions.map((q) => ({
        questionText: q.question,
        question: q.question,
        options: q.options.filter(Boolean),
        correctAnswer: String(q.correctAnswer || 0),
      }));

      const quizData = {
        title: quizFormData.title,
        description: quizFormData.description || '',
        course: selectedCourse,
        questions,
        totalPoints: questions.length * 10,
        passingScore: quizFormData.passingScore || 70,
        timeLimit: quizFormData.timeLimit || 0,
        isFreePreview: quizFormData.isFreePreview || false,
        isPublished: quizFormData.isPublished || false,
      };
      await adminAPI.updateQuiz(editingQuizId, quizData);
      resetForm();
      loadContent();
    } catch (err) {
      alert('Error updating quiz: ' + (err?.response?.data?.message || err?.message));
    }
  };

  const setQuizQuestion = (index, patch) => {
    setQuizFormData((current) => ({
      ...current,
      questions: current.questions.map((question, i) => (i === index ? { ...question, ...patch } : question)),
    }));
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!confirm('Delete this assignment?')) return;
    try {
      await adminAPI.deleteAssignment(assignmentId);
      loadContent();
    } catch (err) {
      alert('Error deleting assignment');
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    try {
      let videoUrl = formData.videoUrl || '';
      if (videoFile) {
        const upload = await uploadAPI.uploadLessonVideo(videoFile);
        videoUrl = upload?.data?.data?.url || videoUrl;
      }

      const lessonData = {
        title: formData.title,
        description: formData.description || '',
        videoUrl,
        duration: formData.duration || '0 minutes',
        order: lessons.length + 1,
        module: formData.module || 'Module 1',
        isFreePreview: formData.isFreePreview || false,
      };
      await adminAPI.addCourseLesson(selectedCourse, lessonData);
      resetForm();
      loadContent();
    } catch (err) {
      alert('Error adding lesson: ' + (err?.response?.data?.message || err?.message));
    }
  };

  const handleEditLesson = (lesson) => {
    setMode('edit');
    setEditingLessonId(lesson._id);
    setFormData({
      title: lesson.title || '',
      description: lesson.description || '',
      videoUrl: lesson.videoUrl || '',
      duration: lesson.duration || '',
      order: lesson.order || 1,
      module: lesson.module || 'Module 1',
      isFreePreview: !!lesson.isFreePreview,
    });
  };

  const handleUpdateLesson = async (e) => {
    e.preventDefault();
    try {
      let videoUrl = formData.videoUrl;
      if (videoFile) {
        const upload = await uploadAPI.uploadLessonVideo(videoFile);
        videoUrl = upload?.data?.data?.url;
      }

      const lessonData = {
        title: formData.title,
        description: formData.description || '',
        videoUrl,
        duration: formData.duration || '0 minutes',
        order: Number(formData.order) || 1,
        module: formData.module || 'Module 1',
        isFreePreview: !!formData.isFreePreview,
      };
      await adminAPI.updateCourseLesson(selectedCourse, editingLessonId, lessonData);
      resetForm();
      loadContent();
    } catch (err) {
      alert('Error updating lesson: ' + (err?.response?.data?.message || err?.message));
    }
  };

  const handleAddQuiz = async (e) => {
    e.preventDefault();
    try {
      const questions = quizFormData.questions.map((q) => ({
        questionText: q.question,
        question: q.question,
        options: q.options.filter(Boolean),
        correctAnswer: String(q.correctAnswer || 0),
      }));

      const quizData = {
        title: quizFormData.title,
        description: quizFormData.description || '',
        course: selectedCourse,
        questions,
        totalPoints: questions.length * 10,
        passingScore: quizFormData.passingScore || 70,
        timeLimit: quizFormData.timeLimit || 0,
        isFreePreview: quizFormData.isFreePreview || false,
        isPublished: quizFormData.isPublished || false,
      };
      await adminAPI.createCourseQuiz(selectedCourse, quizData);
      resetForm();
      loadContent();
    } catch (err) {
      alert('Error adding quiz: ' + (err?.response?.data?.message || err?.message));
    }
  };

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    try {
      let resourceUrls = formData.resourceUrls || [];
      if (assignmentResourceFiles.length > 0) {
        const upload = await uploadAPI.uploadAssignmentResources(assignmentResourceFiles);
        resourceUrls = upload?.data?.data?.urls || resourceUrls;
      }

      const assignmentData = {
        title: formData.title,
        description: formData.description || '',
        course: selectedCourse,
        instructor: user?.id,
        dueDate: formData.dueDate || null,
        totalPoints: formData.totalPoints || 100,
        maxScore: formData.totalPoints || 100,
        instructions: formData.instructions || '',
        resourceUrls,
        isPublished: formData.isPublished !== false,
      };
      await adminAPI.createCourseAssignment(selectedCourse, assignmentData);
      resetForm();
      loadContent();
    } catch (err) {
      alert('Error adding assignment: ' + (err?.response?.data?.message || err?.message));
    }
  };

  const handleEditAssignment = (assignment) => {
    setMode('edit');
    setEditingAssignmentId(assignment._id);
    setFormData({
      title: assignment.title || '',
      description: assignment.description || '',
      dueDate: assignment.dueDate ? assignment.dueDate.slice(0, 10) : '',
      totalPoints: assignment.totalPoints || assignment.maxScore || 100,
      instructions: assignment.instructions || '',
      resourceUrls: assignment.resourceUrls || [],
      isPublished: assignment.isPublished !== false,
    });
  };

  const handleUpdateAssignment = async (e) => {
    e.preventDefault();
    try {
      let resourceUrls = formData.resourceUrls || [];
      if (assignmentResourceFiles.length > 0) {
        const upload = await uploadAPI.uploadAssignmentResources(assignmentResourceFiles);
        resourceUrls = upload?.data?.data?.urls || resourceUrls;
      }

      const assignmentData = {
        title: formData.title,
        description: formData.description || '',
        course: selectedCourse,
        instructor: user?.id,
        dueDate: formData.dueDate || null,
        totalPoints: formData.totalPoints || 100,
        maxScore: formData.totalPoints || 100,
        instructions: formData.instructions || '',
        resourceUrls,
        isPublished: formData.isPublished !== false,
      };
      await adminAPI.updateAssignment(editingAssignmentId, assignmentData);
      resetForm();
      loadContent();
    } catch (err) {
      alert('Error updating assignment: ' + (err?.response?.data?.message || err?.message));
    }
  };

  const handleViewQuizAttempts = async (quizId) => {
    try {
      const res = await adminAPI.getQuizAttempts(quizId);
      setQuizAttempts(res.data.data);
      setSelectedQuizForAttempts(quizId);
      setShowQuizAttempts(true);
    } catch (error) {
      alert('Error fetching quiz attempts');
    }
  };

  const handleResetQuizAttempt = async (quizId, attemptId) => {
    if (!confirm('Are you sure you want to reset this attempt?')) return;
    try {
      await adminAPI.resetQuizAttempt(quizId, attemptId);
      handleViewQuizAttempts(quizId);
    } catch (error) {
      alert('Error resetting attempt');
    }
  };

  const handleViewAssignmentSubmissions = async (assignmentId) => {
    try {
      const res = await adminAPI.getAssignmentSubmissions(assignmentId);
      setAssignmentSubmissions(res.data.data);
      setSelectedAssignmentForSubmissions(assignmentId);
      setShowAssignmentSubmissions(true);
      setGradingData({}); // Reset grading data when opening new submissions
      setEditingSubmission(null); // Reset editing state
    } catch (error) {
      console.error('Error fetching assignment submissions:', error);
      alert('Error fetching assignment submissions: ' + (error?.response?.data?.message || error?.message));
    }
  };

  const handleGradeSubmission = async (submissionId) => {
    const submission = gradingData[submissionId] || { score: '', feedback: '' };
    const scoreNum = submission.score === '' || submission.score === null ? undefined : Number(submission.score);

    setSubmittingGrade(true);
    try {
      await adminAPI.gradeSubmission(selectedAssignmentForSubmissions, {
        submissionId,
        score: scoreNum,
        feedback: submission.feedback,
      });
      // Refresh submissions after grading
      const res = await adminAPI.getAssignmentSubmissions(selectedAssignmentForSubmissions);
      setAssignmentSubmissions(res.data.data);
      setGradingData({}); // Clear grading data after successful grading
      setEditingSubmission(null); // Clear editing state
      alert('Assignment graded successfully!');
    } catch (error) {
      console.error('Error grading submission:', error);
      alert('Error grading submission: ' + (error?.response?.data?.message || error?.message));
    } finally {
      setSubmittingGrade(false);
    }
  };

  const handleStartEditing = (submission) => {
    setEditingSubmission(submission._id);
    setGradingData({
      ...gradingData,
      [submission._id]: {
        score: submission.score || '',
        feedback: submission.feedback || '',
      },
    });
  };

  const handleCancelEditing = () => {
    setEditingSubmission(null);
    setGradingData({});
  };

  if (loading) return <div className="dashboard-section">Loading content...</div>;
  if (error) return <div className="dashboard-section">{error}</div>;
  if (!selectedCourse) return <div className="dashboard-section">Course not found or not selected</div>;

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {['lessons', 'quizzes', 'assignments'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveContentTab(tab)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: 'none',
              background: activeContentTab === tab ? '#06b6d4' : 'transparent',
              color: activeContentTab === tab ? '#fff' : '#888',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeContentTab === 'lessons' && (
        <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: '#fff', margin: 0 }}>Lessons ({lessons.length})</h3>
            <button
              onClick={() => { setMode('create'); resetFormData(); }}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                border: 'none',
                background: '#06b6d4',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              + New Lesson
            </button>
          </div>

          {mode === 'create' || mode === 'edit' ? (
            <form onSubmit={mode === 'create' ? handleAddLesson : handleUpdateLesson} style={{ marginBottom: '1.5rem', padding: '1rem', background: '#2a2a2a', borderRadius: '6px' }}>
              <h4 style={{ color: '#fff', marginBottom: '1rem' }}>{mode === 'create' ? 'Create Lesson' : 'Edit Lesson'}</h4>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label style={{ color: '#888', fontSize: '0.875rem', marginBottom: '0.25rem', display: 'block' }}>Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      border: '1px solid #333',
                      background: '#1a1a1a',
                      color: '#fff',
                    }}
                  />
                </div>
                <div>
                  <label style={{ color: '#888', fontSize: '0.875rem', marginBottom: '0.25rem', display: 'block' }}>Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      border: '1px solid #333',
                      background: '#1a1a1a',
                      color: '#fff',
                      minHeight: '80px',
                    }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ color: '#888', fontSize: '0.875rem', marginBottom: '0.25rem', display: 'block' }}>Video URL</label>
                    <input
                      type="url"
                      value={formData.videoUrl || ''}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #333',
                        background: '#1a1a1a',
                        color: '#fff',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ color: '#888', fontSize: '0.875rem', marginBottom: '0.25rem', display: 'block' }}>Duration</label>
                    <input
                      type="text"
                      value={formData.duration || ''}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g., 10 minutes"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #333',
                        background: '#1a1a1a',
                        color: '#fff',
                      }}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ color: '#888', fontSize: '0.875rem', marginBottom: '0.25rem', display: 'block' }}>Module</label>
                    <input
                      type="text"
                      value={formData.module || ''}
                      onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                      placeholder="Module 1"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #333',
                        background: '#1a1a1a',
                        color: '#fff',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ color: '#888', fontSize: '0.875rem', marginBottom: '0.25rem', display: 'block' }}>Order</label>
                    <input
                      type="number"
                      value={formData.order || 1}
                      onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #333',
                        background: '#1a1a1a',
                        color: '#fff',
                      }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    id="isFreePreview"
                    checked={formData.isFreePreview || false}
                    onChange={(e) => setFormData({ ...formData, isFreePreview: e.target.checked })}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <label htmlFor="isFreePreview" style={{ color: '#fff', fontSize: '0.875rem' }}>Free Preview</label>
                </div>
                <div>
                  <label style={{ color: '#888', fontSize: '0.875rem', marginBottom: '0.25rem', display: 'block' }}>Video File (Upload)</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      border: '1px solid #333',
                      background: '#1a1a1a',
                      color: '#fff',
                    }}
                  />
                  {mode === 'edit' && formData.videoUrl && (
                    <p style={{ color: '#888', fontSize: '0.75rem', marginTop: '0.25rem' }}>Current: {String(formData.videoUrl).slice(0, 50)}...</p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="submit"
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      border: 'none',
                      background: '#06b6d4',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                    }}
                  >
                    {mode === 'create' ? 'Add Lesson' : 'Update Lesson'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      border: '1px solid #333',
                      background: 'transparent',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          ) : null}

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Title</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Order</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Video/File</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Duration</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson) => (
                  <tr key={lesson._id} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '0.75rem', color: '#fff' }}>{lesson.title}</td>
                    <td style={{ padding: '0.75rem', color: '#888' }}>{lesson.order || '—'}</td>
                    <td style={{ padding: '0.75rem', color: '#888' }}>
                      {lesson.videoUrl ? (
                        <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#06b6d4' }}>
                          Video
                        </a>
                      ) : '—'}
                    </td>
                    <td style={{ padding: '0.75rem', color: '#888' }}>{lesson.duration || '—'}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleEditLesson(lesson)}
                          style={{
                            padding: '0.25rem 0.5rem',
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
                          onClick={() => handleDeleteLesson(lesson._id)}
                          style={{
                            padding: '0.25rem 0.5rem',
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
      )}

      {activeContentTab === 'quizzes' && (
        <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: '#fff', margin: 0 }}>Quizzes ({quizzes.length})</h3>
            <button
              onClick={() => { setMode('create'); resetFormData(); }}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                border: 'none',
                background: '#06b6d4',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              + New Quiz
            </button>
          </div>

          {mode === 'create' || mode === 'edit' ? (
            <form onSubmit={mode === 'create' ? handleAddQuiz : handleUpdateQuiz} className="quiz-card" style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ color: '#fff', marginBottom: '1rem' }}>{mode === 'create' ? 'Create Quiz' : 'Edit Quiz'}</h4>
              <div className="form-grid">
                <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Quiz Title *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={quizFormData.title || ''}
                    onChange={(e) => setQuizFormData({ ...quizFormData, title: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Passing Score (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="form-input"
                    value={quizFormData.passingScore || 70}
                    onChange={(e) => setQuizFormData({ ...quizFormData, passingScore: parseInt(e.target.value) })}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Time Limit (mins)</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={quizFormData.timeLimit || 0}
                    onChange={(e) => setQuizFormData({ ...quizFormData, timeLimit: parseInt(e.target.value) })}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Free Preview</label>
                  <select
                    className="form-input"
                    value={quizFormData.isFreePreview ? 'yes' : 'no'}
                    onChange={(e) => setQuizFormData({ ...quizFormData, isFreePreview: e.target.value === 'yes' })}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label">Published</label>
                  <select
                    className="form-input"
                    value={quizFormData.isPublished ? 'yes' : 'no'}
                    onChange={(e) => setQuizFormData({ ...quizFormData, isPublished: e.target.value === 'yes' })}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                
                <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Questions</label>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {quizFormData.questions.map((question, index) => (
                      <div key={index} className="quiz-card" style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                          <h5 style={{ color: '#fff', margin: 0 }}>Question {index + 1}</h5>
                          {quizFormData.questions.length > 1 && (
                            <button
                              type="button"
                              className="btn-outline-alt"
                              onClick={() => {
                                const questions = quizFormData.questions.filter((_, i) => i !== index);
                                setQuizFormData({ ...quizFormData, questions: questions.length ? questions : [makeEmptyQuestion()] });
                              }}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="form-grid" style={{ marginTop: '0.75rem' }}>
                          <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                            <label className="form-label">Question Text</label>
                            <input
                              type="text"
                              required
                              className="form-input"
                              value={question.question}
                              onChange={(e) => setQuizQuestion(index, { question: e.target.value })}
                            />
                          </div>
                          {[0, 1, 2, 3].map((optIdx) => (
                            <div key={optIdx} className="form-field">
                              <label className="form-label">Option {String.fromCharCode(65 + optIdx)}</label>
                              <input
                                className="form-input"
                                value={question.options[optIdx]}
                                onChange={(e) => {
                                  const options = [...question.options];
                                  options[optIdx] = e.target.value;
                                  setQuizQuestion(index, { options });
                                }}
                              />
                              <div style={{ marginTop: '0.5rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                  <input
                                    type="radio"
                                    name={`correct-add-${index}`}
                                    checked={question.correctAnswer === optIdx}
                                    onChange={() => setQuizQuestion(index, { correctAnswer: optIdx })}
                                  />
                                  Correct
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn-outline-alt"
                      onClick={() => setQuizFormData({ ...quizFormData, questions: [...quizFormData.questions, makeEmptyQuestion()] })}
                    >
                      + Add Question
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="form-actions" style={{ marginTop: '1rem' }}>
                <button
                  type="button"
                  className="btn-outline-alt"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-action"
                >
                  {mode === 'create' ? 'Create Quiz' : 'Update Quiz'}
                </button>
              </div>
            </form>
          ) : null}

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Title</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Questions</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Passing Score</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map((quiz) => (
                  <tr key={quiz._id} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '0.75rem', color: '#fff' }}>{quiz.title}</td>
                    <td style={{ padding: '0.75rem', color: '#888' }}>{quiz.questions?.length || 0}</td>
                    <td style={{ padding: '0.75rem', color: '#888' }}>{quiz.passingScore || 0}%</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        background: quiz.isPublished ? '#10b981' : '#f59e0b',
                        color: '#fff',
                      }}>
                        {quiz.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleEditQuiz(quiz)}
                          style={{
                            padding: '0.25rem 0.5rem',
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
                          onClick={() => handleViewQuizAttempts(quiz._id)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            border: 'none',
                            background: '#8b5cf6',
                            color: '#fff',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                          }}
                        >
                          Attempts
                        </button>
                        <button
                          onClick={() => handleDeleteQuiz(quiz._id)}
                          style={{
                            padding: '0.25rem 0.5rem',
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

          {showQuizAttempts && (
            <div style={{ marginTop: '1.5rem', background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ color: '#fff', margin: 0 }}>Quiz Attempts</h3>
                <button
                  onClick={() => { setShowQuizAttempts(false); setQuizAttempts([]); setSelectedQuizForAttempts(null); }}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    border: '1px solid #333',
                    background: 'transparent',
                    color: '#888',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                  }}
                >
                  ← Back to Quizzes
                </button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #333' }}>
                      <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Student</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Score</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Status</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Attempted</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizAttempts.map((attempt) => (
                      <tr key={attempt._id} style={{ borderBottom: '1px solid #222' }}>
                        <td style={{ padding: '0.75rem', color: '#fff' }}>{attempt.student?.name || '—'}</td>
                        <td style={{ padding: '0.75rem', color: '#888' }}>{attempt.score || 0}%</td>
                        <td style={{ padding: '0.75rem' }}>
                          <span style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            background: attempt.score >= attempt.passingScore ? '#10b981' : '#dc2626',
                            color: '#fff',
                          }}>
                            {attempt.score >= attempt.passingScore ? 'Passed' : 'Failed'}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem', color: '#888' }}>{attempt.attemptedAt ? new Date(attempt.attemptedAt).toLocaleString() : '—'}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <button
                            onClick={() => handleResetQuizAttempt(selectedQuizForAttempts, attempt._id)}
                            style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                              border: 'none',
                              background: '#dc2626',
                              color: '#fff',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                            }}
                          >
                            Reset
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {activeContentTab === 'assignments' && (
        <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: '#fff', margin: 0 }}>Assignments ({assignments.length})</h3>
            <button
              onClick={() => { setMode('create'); resetFormData(); }}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                border: 'none',
                background: '#06b6d4',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              + Add Assignment
            </button>
          </div>

          {mode === 'create' || mode === 'edit' ? (
            <form onSubmit={mode === 'create' ? handleAddAssignment : handleUpdateAssignment} className="quiz-card" style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ color: '#fff', marginBottom: '1rem' }}>{mode === 'create' ? 'Add New Assignment' : 'Edit Assignment'}</h4>
              <div className="form-grid">
                <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Assignment Title *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Instructions *</label>
                  <textarea
                    required
                    rows={4}
                    className="form-input"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Deadline</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.dueDate || ''}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Max Score</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={formData.totalPoints || 100}
                    onChange={(e) => setFormData({ ...formData, totalPoints: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Published</label>
                  <select
                    className="form-input"
                    value={formData.isPublished ? 'yes' : 'no'}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.value === 'yes' })}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Resource Files</label>
                  <input
                    type="file"
                    multiple
                    className="form-input"
                    onChange={(e) => setAssignmentResourceFiles(Array.from(e.target.files || []))}
                  />
                </div>
              </div>
              <div className="form-actions" style={{ marginTop: '1rem' }}>
                <button
                  type="button"
                  className="btn-outline-alt"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-action">
                  {mode === 'create' ? 'Create Assignment' : 'Update Assignment'}
                </button>
              </div>
            </form>
          ) : null}

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Title</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Deadline</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Points</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Submissions</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment) => (
                  <tr key={assignment._id} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '0.75rem', color: '#fff' }}>{assignment.title}</td>
                    <td style={{ padding: '0.75rem', color: '#888' }}>
                      {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : '—'}
                    </td>
                    <td style={{ padding: '0.75rem', color: '#888' }}>{assignment.totalPoints || 0}</td>
                    <td style={{ padding: '0.75rem', color: '#888' }}>{assignment.submissions?.length || 0}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        background: assignment.isPublished ? '#10b981' : '#f59e0b',
                        color: '#fff',
                      }}>
                        {assignment.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleEditAssignment(assignment)}
                          style={{
                            padding: '0.25rem 0.5rem',
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
                          onClick={() => handleViewAssignmentSubmissions(assignment._id)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            border: 'none',
                            background: '#8b5cf6',
                            color: '#fff',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                          }}
                        >
                          Submissions
                        </button>
                        <button
                          onClick={() => handleDeleteAssignment(assignment._id)}
                          style={{
                            padding: '0.25rem 0.5rem',
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
      )}

      {/* Assignment Submissions Modal */}
      {showAssignmentSubmissions && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: '#1a1a1a',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '800px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#fff', margin: 0 }}>Assignment Submissions</h3>
              <button
                onClick={() => setShowAssignmentSubmissions(false)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  border: 'none',
                  background: '#dc2626',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>

            {assignmentSubmissions.length === 0 ? (
              <p style={{ color: '#888' }}>No submissions yet.</p>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {assignmentSubmissions.map((submission) => (
                  <div key={submission._id} style={{
                    background: '#2a2a2a',
                    padding: '1rem',
                    borderRadius: '4px',
                    border: '1px solid #333',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div>
                        <p style={{ color: '#fff', margin: 0 }}>
                          Student: {submission.student?.name || submission.student?.email || 'Unknown'}
                        </p>
                        <p style={{ color: '#888', fontSize: '0.875rem', margin: '0.25rem 0' }}>
                          Submitted: {new Date(submission.submittedAt).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          background: submission.status === 'graded' ? '#10b981' : '#f59e0b',
                          color: '#fff',
                        }}>
                          {submission.status || 'submitted'}
                        </span>
                      </div>
                    </div>

                    {submission.fileUrl && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <a
                          href={submission.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#06b6d4', textDecoration: 'none' }}
                        >
                          View Submission File
                        </a>
                      </div>
                    )}

                    {submission.status === 'graded' && editingSubmission !== submission._id ? (
                      <div style={{ marginTop: '0.5rem' }}>
                        <p style={{ color: '#10b981', margin: 0 }}>
                          Score: {submission.score}
                        </p>
                        {submission.feedback && (
                          <p style={{ color: '#888', marginTop: '0.25rem', margin: 0 }}>
                            Feedback: {submission.feedback}
                          </p>
                        )}
                        {submission.gradedAt && (
                          <p style={{ color: '#888', fontSize: '0.75rem', marginTop: '0.25rem', margin: 0 }}>
                            Graded: {new Date(submission.gradedAt).toLocaleString()}
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={() => handleStartEditing(submission)}
                          style={{
                            marginTop: '0.5rem',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #06b6d4',
                            background: 'transparent',
                            color: '#06b6d4',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                          }}
                        >
                          Edit Grade
                        </button>
                      </div>
                    ) : (
                      <>
                        <div style={{ marginTop: '1rem', padding: '1rem', background: '#1a1a1a', borderRadius: '4px', border: '1px solid #333' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <h4 style={{ color: '#fff', margin: 0, fontSize: '0.875rem' }}>
                              {submission.status === 'graded' ? 'Edit Grade' : 'Grade Submission'}
                            </h4>
                            {submission.status === 'graded' && (
                              <button
                                type="button"
                                onClick={handleCancelEditing}
                                style={{
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '4px',
                                  border: '1px solid #dc2626',
                                  background: 'transparent',
                                  color: '#dc2626',
                                  cursor: 'pointer',
                                  fontSize: '0.75rem',
                                }}
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                          <div>
                            <label style={{ color: '#888', fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>
                              Score
                            </label>
                            <input
                              type="number"
                              style={{
                                width: '100%',
                                padding: '0.5rem',
                                borderRadius: '4px',
                                border: '1px solid #333',
                                background: '#0a0a0a',
                                color: '#fff',
                              }}
                              value={gradingData[submission._id]?.score || ''}
                              onChange={(e) => setGradingData({
                                ...gradingData,
                                [submission._id]: {
                                  ...(gradingData[submission._id] || { score: '', feedback: '' }),
                                  score: e.target.value,
                                },
                              })}
                              placeholder="Enter score"
                            />
                          </div>
                          <div>
                            <label style={{ color: '#888', fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>
                              Feedback (optional)
                            </label>
                            <textarea
                              style={{
                                width: '100%',
                                padding: '0.5rem',
                                borderRadius: '4px',
                                border: '1px solid #333',
                                background: '#0a0a0a',
                                color: '#fff',
                                minHeight: '60px',
                              }}
                              value={gradingData[submission._id]?.feedback || ''}
                              onChange={(e) => setGradingData({
                                ...gradingData,
                                [submission._id]: {
                                  ...(gradingData[submission._id] || { score: '', feedback: '' }),
                                  feedback: e.target.value,
                                },
                              })}
                              placeholder="Enter feedback"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleGradeSubmission(submission._id)}
                            disabled={submittingGrade}
                            style={{
                              padding: '0.5rem 1rem',
                              borderRadius: '4px',
                              border: 'none',
                              background: '#06b6d4',
                              color: '#fff',
                              cursor: submittingGrade ? 'not-allowed' : 'pointer',
                              opacity: submittingGrade ? 0.6 : 1,
                            }}
                          >
                            {submittingGrade ? 'Saving...' : (submission.status === 'graded' ? 'Update Grade' : 'Submit Grade')}
                          </button>
                        </div>
                      </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Course Deep Management Component
function CourseDeepManagement() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('overview');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await adminAPI.getAllCourses();
      console.log('Courses response:', res);
      console.log('Courses data:', res.data.data);
      setCourses(res.data.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCourseDetails = async (courseId) => {
    try {
      console.log('Fetching course details for ID:', courseId);
      console.log('Course ID type:', typeof courseId);
      
      const res = await adminAPI.getCourseDetails(courseId);
      console.log('API response:', res);
      console.log('API response data:', res.data);
      
      if (!res.data || !res.data.data) {
        console.error('Invalid response structure:', res);
        alert('Invalid response from server');
        return;
      }
      
      setCourseDetails(res.data.data);
      setSelectedCourse(courseId);
      setShowDetails(true);
      setActiveSubTab('overview');
      
      console.log('Course details loaded:', res.data.data);
      console.log('Selected course ID:', courseId);
      console.log('Selected course ID type:', typeof courseId);
      console.log('Selected course ID value:', courseId);
    } catch (error) {
      console.error('Error fetching course details:', error);
      console.error('Error response:', error?.response);
      alert(`Error fetching course details: ${error?.response?.data?.message || error?.message}`);
    }
  };

  if (loading) return <div className="dashboard-section">Loading courses...</div>;

  return (
    <div className="dashboard-section">
      <h2 className="dashboard-section-title">Course Deep Management</h2>
      <p className="dashboard-section-desc">Comprehensive course management with content, enrollment, and analytics.</p>

      {!showDetails ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Title</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Instructor</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Students</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c._id} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '0.75rem', color: '#fff' }}>{c.title}</td>
                  <td style={{ padding: '0.75rem', color: '#888' }}>{c.instructor?.name || '—'}</td>
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
                  <td style={{ padding: '0.75rem', color: '#888' }}>{c.students || 0}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <button
                      onClick={() => handleViewCourseDetails(c._id)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        border: 'none',
                        background: '#06b6d4',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                      }}
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <button
            onClick={() => { setShowDetails(false); setCourseDetails(null); }}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: '1px solid #333',
              background: 'transparent',
              color: '#888',
              cursor: 'pointer',
              marginBottom: '1rem',
            }}
          >
            ← Back to Courses
          </button>

          {courseDetails ? (
            <div>
              {/* Sub-tabs */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                {['overview', 'content', 'enrollments', 'analytics'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveSubTab(tab)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      border: 'none',
                      background: activeSubTab === tab ? '#06b6d4' : 'transparent',
                      color: activeSubTab === tab ? '#fff' : '#888',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                    }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Overview Tab */}
              {activeSubTab === 'overview' && (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px' }}>
                    <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Course Information</h3>
                    <p style={{ color: '#888' }}>Title: {courseDetails.course?.title}</p>
                    <p style={{ color: '#888' }}>Description: {courseDetails.course?.description || '—'}</p>
                    <p style={{ color: '#888' }}>Level: {courseDetails.course?.level}</p>
                    <p style={{ color: '#888' }}>Status: {courseDetails.course?.status}</p>
                    <p style={{ color: '#888' }}>Instructor: {courseDetails.course?.instructor?.name}</p>
                  </div>

                  {/* Quick Actions */}
                  <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px' }}>
                    <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Quick Actions</h3>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setActiveSubTab('content')}
                        style={{
                          padding: '0.75rem 1.5rem',
                          borderRadius: '6px',
                          border: '1px solid #06b6d4',
                          background: 'transparent',
                          color: '#06b6d4',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          transition: 'all 0.2s',
                        }}
                        onMouseOver={(e) => { e.target.style.background = '#06b6d4'; e.target.style.color = '#fff'; }}
                        onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#06b6d4'; }}
                      >
                        📚 Manage Content
                      </button>
                      <button
                        onClick={() => setActiveSubTab('enrollments')}
                        style={{
                          padding: '0.75rem 1.5rem',
                          borderRadius: '6px',
                          border: '1px solid #10b981',
                          background: 'transparent',
                          color: '#10b981',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          transition: 'all 0.2s',
                        }}
                        onMouseOver={(e) => { e.target.style.background = '#10b981'; e.target.style.color = '#fff'; }}
                        onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#10b981'; }}
                      >
                        👥 View Enrollments
                      </button>
                      <button
                        onClick={() => setActiveSubTab('analytics')}
                        style={{
                          padding: '0.75rem 1.5rem',
                          borderRadius: '6px',
                          border: '1px solid #8b5cf6',
                          background: 'transparent',
                          color: '#8b5cf6',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          transition: 'all 0.2s',
                        }}
                        onMouseOver={(e) => { e.target.style.background = '#8b5cf6'; e.target.style.color = '#fff'; }}
                        onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#8b5cf6'; }}
                      >
                        📊 View Analytics
                      </button>
                    </div>
                  </div>

                  <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px' }}>
                    <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Enrollment Summary</h3>
                    <p style={{ color: '#fff' }}>Total Students: {courseDetails.enrollments?.total || 0}</p>
                    <p style={{ color: '#888' }}>Average Progress: {courseDetails.enrollments?.avgProgress || 0}%</p>
                  </div>

                  <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px' }}>
                    <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Content Summary</h3>
                    <p style={{ color: '#fff' }}>Lessons: {courseDetails.content?.lessons?.length || 0}</p>
                    <p style={{ color: '#fff' }}>Quizzes: {courseDetails.content?.quizzes?.length || 0}</p>
                    <p style={{ color: '#fff' }}>Assignments: {courseDetails.content?.assignments?.length || 0}</p>
                  </div>
                </div>
              )}

              {/* Content Tab */}
              {activeSubTab === 'content' && (
                <CourseContentManagement selectedCourse={selectedCourse} />
              )}

              {/* Enrollments Tab */}
              {activeSubTab === 'enrollments' && (
                <CourseEnrollmentsManagement selectedCourse={selectedCourse} />
              )}

              {/* Analytics Tab */}
              {activeSubTab === 'analytics' && (
                <CourseAnalyticsManagement selectedCourse={selectedCourse} />
              )}
            </div>
          ) : (
            <div className="dashboard-section">Course not found</div>
          )}
        </div>
      )}
    </div>
  );
}

// Certificate Management Component
function CertificateManagement() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentFilter, setStudentFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');

  useEffect(() => {
    fetchCertificates();
  }, [studentFilter, courseFilter]);

  const fetchCertificates = async () => {
    try {
      const res = await adminAPI.getAllCertificates({ studentId: studentFilter || undefined, courseId: courseFilter || undefined });
      setCertificates(res.data.data);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCertificate = async (certificateId) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    try {
      await adminAPI.deleteCertificate(certificateId);
      fetchCertificates();
    } catch (error) {
      alert('Error deleting certificate');
    }
  };

  const handleRegenerate = async (certificateId) => {
    if (!confirm('Are you sure you want to regenerate this certificate?')) return;
    try {
      await adminAPI.regenerateCertificate(certificateId);
      alert('Certificate regenerated successfully');
      fetchCertificates();
    } catch (error) {
      alert('Error regenerating certificate');
    }
  };

  const handleDownloadCertificate = async (enrollmentId) => {
    // Handle case where enrollmentId might be populated object or just ID
    const enrollmentIdValue = typeof enrollmentId === 'object' ? enrollmentId._id : enrollmentId;
    
    if (!enrollmentIdValue) {
      alert('Enrollment ID not found for this certificate');
      return;
    }
    try {
      const response = await adminAPI.downloadCertificate(enrollmentIdValue);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${enrollmentIdValue}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('Error downloading certificate');
    }
  };

  if (loading) return <div className="dashboard-section">Loading certificates...</div>;

  return (
    <div className="dashboard-section">
      <h2 className="dashboard-section-title">Certificate Management</h2>
      <p className="dashboard-section-desc">View, regenerate, and manage issued certificates.</p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Filter by student ID..."
          value={studentFilter}
          onChange={(e) => setStudentFilter(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '1px solid #333',
            background: '#1a1a1a',
            color: '#fff',
            flex: 1,
            minWidth: '200px',
          }}
        />
        <input
          type="text"
          placeholder="Filter by course ID..."
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '1px solid #333',
            background: '#1a1a1a',
            color: '#fff',
            flex: 1,
            minWidth: '200px',
          }}
        />
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Student</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Course</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Certificate ID</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Issued</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Regenerated</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888', fontSize: '0.75rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((cert) => (
              <tr key={cert._id} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '0.75rem', color: '#fff' }}>{cert.userId?.name || '—'}</td>
                <td style={{ padding: '0.75rem', color: '#888' }}>{cert.courseId?.title || '—'}</td>
                <td style={{ padding: '0.75rem', color: '#888' }}>{cert.certificateId || '—'}</td>
                <td style={{ padding: '0.75rem', color: '#888' }}>{cert.completionDate ? new Date(cert.completionDate).toLocaleDateString() : '—'}</td>
                <td style={{ padding: '0.75rem', color: '#888' }}>{cert.regeneratedCount || 0} times</td>
                <td style={{ padding: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handleDownloadCertificate(cert.enrollmentId)}
                      disabled={!cert.enrollmentId}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        border: 'none',
                        background: cert.enrollmentId ? '#06b6d4' : '#666',
                        color: '#fff',
                        cursor: cert.enrollmentId ? 'pointer' : 'not-allowed',
                        fontSize: '0.75rem',
                        opacity: cert.enrollmentId ? 1 : 0.5,
                      }}
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleRegenerate(cert._id)}
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
                      Regenerate
                    </button>
                    <button
                      onClick={() => handleDeleteCertificate(cert._id)}
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