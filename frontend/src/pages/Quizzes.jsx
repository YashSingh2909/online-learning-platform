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
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      <div className="container mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/70">Quizzes</p>
          <h1 className="text-3xl sm:text-4xl font-semibold mt-2">Test Your Knowledge</h1>
          <p className="text-slate-300 mt-2">Select a course to view and take available quizzes.</p>
        </div>


        {loading ? (
          <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-8">
            <p className="text-slate-300">Loading quizzes...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-6">
            <p className="text-red-200">{error}</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <h2 className="text-xl font-semibold">No enrolled courses</h2>
            <p className="text-slate-300 mt-2">Enroll in a course first to unlock quizzes.</p>
            <Link
              to="/courses"
              className="inline-flex items-center justify-center mt-6 px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition w-full sm:w-auto"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div>
            {!selectedCourse ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-5">
                {courses.map((enr) => (
                  <div
                    key={enr._id}
                    className="cursor-pointer rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 hover:ring-cyan-400/40 transition"
                    onClick={() => loadQuizzes(enr.course._id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{enr.course?.title || 'Course'}</h3>
                        <p className="text-sm text-slate-300 mt-1">Click to view quizzes</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-[11px] font-semibold text-white uppercase bg-gradient-to-r from-cyan-500/90 to-indigo-500/90">
                        Quizzes
                      </span>
                    </div>
                    <div className="mt-4">
                      <button className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition">
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
                  className="inline-flex items-center px-4 py-2 rounded-xl border border-white/10 hover:border-cyan-400/40 bg-white/5 hover:bg-white/10 transition mb-6"
                >
                  ← Back to courses
                </button>

                {quizzesLoading ? (
                  <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-8">
                    <p className="text-slate-300">Loading quizzes...</p>
                  </div>
                ) : quizzes.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
                    <h2 className="text-xl font-semibold">No quizzes available</h2>
                    <p className="text-slate-300 mt-2">This course doesn't have any quizzes yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {quizzes.map((quiz) => (
                      <Link
                        key={quiz._id}
                        to={`/quiz/${quiz._id}`}
                        className="block rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 hover:ring-cyan-400/40 transition"
                      >
                        <h3 className="text-lg font-semibold text-white">{quiz.title}</h3>
                        <p className="text-sm text-slate-300 mt-2">
                          {quiz.description || 'Test your knowledge with this quiz.'}
                        </p>

                        <div className="mt-5 grid grid-cols-2 gap-3">
                          <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                            <div className="flex items-center gap-2 text-xs text-slate-300">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 6v6l4 2" />
                              </svg>
                              <span>{quiz.timeLimit ? `${quiz.timeLimit} min` : 'No limit'}</span>
                            </div>
                          </div>
                          <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                            <div className="flex items-center gap-2 text-xs text-slate-300">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                <path d="M9 11l3 3L22 4" />
                                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                              </svg>
                              <span>{quiz.questions?.length || 0} questions</span>
                            </div>
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