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
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      <div className="relative overflow-hidden">
        <div
          className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full blur-3xl opacity-40"
          style={{ background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))' }}
        />
        <div
          className="absolute bottom-[-20px] -left-24 w-[320px] h-[320px] rounded-full blur-3xl opacity-30"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.35), rgba(6,182,212,0.25))' }}
        />

        <div className="container mx-auto px-6 py-10 relative z-10">
          {/* Welcome Card */}
          <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 md:p-8 shadow-xl shadow-slate-950/10">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/70">Learning Platform</p>
                <h1 className="text-3xl sm:text-4xl font-semibold mt-2">Welcome back, {user?.name}</h1>
                <p className="text-slate-300 mt-2">Access courses, monitor progress, and keep learning.</p>
              </div>

              <div className="rounded-2xl bg-cyan-500/10 ring-1 ring-cyan-400/20 px-6 py-4 text-center">
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-200/80">Role</p>
                <p className="text-2xl font-semibold mt-2 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_0.9fr]">
            {/* Left */}
            <div className="flex flex-col gap-8">
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500/90 to-indigo-500/80 flex items-center justify-center text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}>
                      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <p className="text-3xl font-semibold mt-4">{enrollments.length}</p>
                  <p className="text-sm text-slate-300 mt-1">Courses Enrolled</p>
                </div>

                <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500/90 to-indigo-500/80 flex items-center justify-center text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}>
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                    </svg>
                  </div>
                  <p className="text-3xl font-semibold mt-4">{totalStudents}</p>
                  <p className="text-sm text-slate-300 mt-1">Active Students</p>
                </div>
              </div>

              {/* My Learning */}
              <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h2 className="text-xl font-semibold">My Learning</h2>
                    <p className="text-sm text-slate-300 mt-1">Continue where you left off.</p>
                  </div>
                </div>

                {loading ? (
                  <div className="mt-6 rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">
                    <p className="text-slate-300">Loading...</p>
                  </div>
                ) : enrollments.length > 0 ? (
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-5">
                    {enrollments.slice(0, 4).map((enr) => (
                      <Link
                        key={enr._id}
                        to={`/course/${enr.course?._id}/learn`}
                        className="block rounded-2xl bg-white/5 ring-1 ring-white/10 p-5 transition hover:ring-cyan-400/40"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold">{enr.course?.title || 'Course'}</h3>
                            <p className="text-sm text-slate-300 mt-1">{enr.status}</p>
                          </div>
                          <span className="px-3 py-1 rounded-full text-[11px] font-semibold text-white uppercase bg-gradient-to-r from-cyan-500/90 to-indigo-500/90">
                            {enr.status}
                          </span>
                        </div>

                        <div className="mt-4 h-2 bg-slate-200/10 rounded-full overflow-hidden">
                          <div
                            className="h-2 bg-cyan-400 rounded-full transition-all"
                            style={{ width: `${Math.max(0, Math.min(100, enr.progress ?? 0))}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-slate-400">Completion</span>
                          <span className="text-sm font-semibold text-cyan-300">{enr.progress ?? 0}%</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                    <h3 className="text-xl font-semibold">No courses yet</h3>
                    <p className="text-slate-300 mt-2">Enroll in a course to start learning.</p>
                    <Link
                      to="/courses"
                      className="inline-flex items-center justify-center mt-5 px-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition w-full sm:w-auto"
                    >
                      Browse Courses
                    </Link>
                  </div>
                )}
              </div>

              {/* Featured */}
              <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h2 className="text-xl font-semibold">Featured Courses</h2>
                    <p className="text-sm text-slate-300 mt-1">Handpicked courses for career-ready skills.</p>
                  </div>

                  {user?.role === 'instructor' && (
                    <button
                      className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition"
                      type="button"
                      onClick={() => navigate('/instructor/create-course')}
                    >
                      + Create Course
                    </button>
                  )}
                </div>

                {loading ? (
                  <div className="mt-6 rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">
                    <p className="text-slate-300">Loading courses...</p>
                  </div>
                ) : courses.length > 0 ? (
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {courses.slice(0, 6).map((course) => (
                      <Link
                        key={course._id}
                        to={`/course/${course._id}`}
                        className="block rounded-2xl bg-white/5 ring-1 ring-white/10 overflow-hidden hover:ring-cyan-400/40 transition"
                      >
                        <div className="h-28 relative overflow-hidden">
                          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover opacity-90" />
                          <span className="absolute bottom-0 left-0 right-0 p-2 text-[10px] font-semibold text-white uppercase bg-gradient-to-t from-black/70 to-transparent text-center">
                            {course.category}
                          </span>
                        </div>
                        <div className="p-5">
                          <h3 className="text-lg font-semibold">{course.title}</h3>
                          <p className="text-sm text-slate-300 mt-2 line-clamp-2">{course.description}</p>
                          <div className="flex items-center justify-between mt-4">
                            <span className="text-sm font-semibold text-cyan-300">₹{course.price}</span>
                            <span className="text-sm text-slate-300">★ {course.rating}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="mt-6 text-center text-slate-300">No courses available.</div>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="flex flex-col gap-6">
              <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Current Plan</p>
                <h3 className="text-xl font-semibold mt-3">Essential</h3>
                <p className="text-sm text-slate-300 mt-2">A flexible learning hub for students and instructors.</p>
              </div>

              <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Quick Actions</p>
                <div className="mt-4 flex flex-col gap-3">
                  <Link to="/courses" className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition">
                    Browse Courses
                  </Link>
                  <Link to="/progress" className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-white/10 hover:border-cyan-400/40 bg-white/5 hover:bg-white/10 transition">
                    View Progress
                  </Link>
                  <Link to="/certificates" className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-white/10 hover:border-cyan-400/40 bg-white/5 hover:bg-white/10 transition">
                    Certificates
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

