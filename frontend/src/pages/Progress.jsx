import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { enrollmentAPI } from '../api/apiService';

export default function Progress() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setLoading(true);
      setError('');
      try {
        const res = await enrollmentAPI.getUserEnrollments();
        setEnrollments(res.data.data || []);
      } catch (e) {
        setError(e?.message || 'Failed to load progress');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  return (
      <div className="bg-slate-950 text-slate-100 min-h-screen">
        <div className="container mx-auto px-6 py-10">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/70">Progress</p>
            <h1 className="text-3xl sm:text-4xl font-semibold mt-2">Your Learning Journey</h1>
            <p className="text-slate-300 mt-2">Track your enrollment status and completion percentage across your courses.</p>
          </div>


        {loading ? (
          <div className="dashboard-loading">
            <p className="loading-text">Loading your progress...</p>
          </div>
        ) : error ? (
          <div className="dashboard-error">
            <p>{error}</p>
          </div>
        ) : enrollments.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <h2 className="text-xl font-semibold">No progress yet</h2>
            <p className="text-slate-300 mt-2">Enroll in a course to start tracking your progress.</p>
            <Link to="/courses" className="inline-flex items-center justify-center mt-6 px-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition w-full sm:w-auto">
              Browse Courses
            </Link>
          </div>

        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
            {enrollments.map((enr) => (
              <div key={enr._id} className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 shadow-xl shadow-slate-950/10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{enr.course?.title || 'Course'}</h3>
                    <p className="text-sm text-slate-300 mt-1">Status: {enr.status}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-semibold text-white uppercase bg-gradient-to-r from-cyan-500/90 to-indigo-500/90">
                    {enr.status}
                  </span>
                </div>

                <div className="mt-5">
                  <div className="h-2 bg-slate-200/10 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-cyan-400 rounded-full transition-all"
                      style={{ width: `${Math.max(0, Math.min(100, enr.progress ?? 0))}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-slate-400">Completion</span>
                    <span className="text-sm font-semibold text-cyan-300">{enr.progress ?? 0}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        </div>
      </div>
    );
}
