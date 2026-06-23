import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courseAPI, enrollmentAPI, paymentAPI } from '../api/apiService';
import LockedContent from '../components/LockedContent';

export default function CourseLearn() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedLesson, setSelectedLesson] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockedMessage, setLockedMessage] = useState('');
  const [markingComplete, setMarkingComplete] = useState(false);

  const lessons = useMemo(() => {
    const arr = Array.isArray(course?.lessons) ? course.lessons : [];
    return arr;
  }, [course]);

  const safeSelectedIndex = useMemo(() => {
    if (!lessons.length) return 0;
    return Math.min(Math.max(selectedLesson, 0), lessons.length - 1);
  }, [lessons.length, selectedLesson]);

  const selected = lessons[safeSelectedIndex];

  const fetchCourseAndEnrollment = async () => {
    try {
      setLocked(false);
      setLockedMessage('');

      const courseRes = await courseAPI.getCourseById(id);
      setCourse(courseRes.data.data);

      if (user) {
        try {
          const enrollRes = await enrollmentAPI.getEnrollmentByCourse(id);
          setEnrollment(enrollRes.data.data);
        } catch {
          setEnrollment(null);
        }
      } else {
        setEnrollment(null);
      }
    } catch (error) {
      const status = error?.status ?? error?.response?.status;
      const message = error?.message || error?.response?.data?.message || 'Access restricted';
      if (status === 403) {
        setLocked(true);
        setLockedMessage(message);
      } else {
        setLocked(true);
        setLockedMessage(message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchCourseAndEnrollment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  // Keep the lesson selection valid when lessons load/change
  useEffect(() => {
    if (!lessons.length) {
      setSelectedLesson(0);
      return;
    }
    if (selectedLesson < 0 || selectedLesson >= lessons.length) {
      setSelectedLesson(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessons.length, course]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (course?.price > 0) {
        await paymentAPI.createPaymentOrder({ courseId: id });
        alert('Payment integration would be implemented here');
      } else {
        await enrollmentAPI.enrollCourse({ courseId: id });
        await fetchCourseAndEnrollment();
      }
    } catch (e) {
      alert('Error enrolling in course');
      console.error(e);
    }
  };

  const completionPercentage = enrollment?.progress ?? 0;

  const handleContinue = () => {
    // Continue Learning should always jump to the current selected lesson.
    // If no lesson exists, do nothing.
    if (!lessons.length) return;
    setSelectedLesson(safeSelectedIndex);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-100">
        Loading...
      </div>
    );
  }

  if (locked) {
    return (
      <LockedContent
        title="Course locked"
        description={lockedMessage || 'Enroll to access this course.'}
        ctaLabel="Enroll to access"
        ctaTo="/courses"
      />
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-100">
        Course not found
      </div>
    );
  }

  const isEnrolled = !!enrollment;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/80 px-5 py-2.5 text-sm text-slate-200 transition hover:border-cyan-500 hover:text-white"
          >
            ← Back
          </button>
          <div className="text-right">
            <p className="text-sm uppercase tracking-[0.15em] text-cyan-200/70">{course.category}</p>
            <h1 className="text-2xl font-semibold">{course.title}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[0.35fr_0.65fr] gap-6">
          {/* Left: lesson sidebar */}
          <aside className="rounded-2xl bg-white/5 ring-1 ring-white/10">
            <div className="p-4 border-b border-white/10">
              <h2 className="font-semibold">Course Content</h2>
              <p className="text-sm text-slate-300 mt-1">Pick a lesson to start learning.</p>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-3">
              {lessons.length === 0 ? (
                <div className="p-4 text-sm text-slate-300 bg-white/5 rounded-xl">
                  No preview lessons available.
                </div>
              ) : (
                <div className="space-y-2">
                  {lessons.map((lesson, index) => {
                    const active = index === safeSelectedIndex;
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedLesson(index)}
                        className={`w-full text-left px-4 py-3 rounded-xl border transition ${
                          active
                            ? 'border-cyan-400/60 bg-cyan-500/10'
                            : 'border-white/10 bg-white/5 hover:border-cyan-400/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className={`font-medium ${active ? 'text-cyan-100' : 'text-slate-100'}`}>{lesson.title}</p>
                            <p className="text-xs text-slate-300 mt-1">{lesson.duration || ''}</p>
                          </div>
                          {index < (enrollment?.completedLessons?.length ?? 0) && (
                            <span className="text-xs text-emerald-300">✓</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/10">
              {isEnrolled ? (
                <button
                  onClick={handleContinue}
                  className="w-full rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400 transition"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleEnroll}
                  className="w-full rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400 transition"
                >
                  {course.price > 0 ? 'Enroll Now' : 'Join for Free'}
                </button>
              )}
            </div>
          </aside>

          {/* Right: video + details + sticky progress */}
          <section className="space-y-4">
            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
              {/* Video player */}
              <div className="rounded-xl bg-slate-950/40 overflow-hidden">
                {selected?.videoUrl ? (
                  <video
                    key={safeSelectedIndex}
                    src={selected.videoUrl}
                    controls
                    className="w-full"
                    onEnded={async () => {
                      if (markingComplete) return;
                      if (!selected?.title) return;
                      try {
                        setMarkingComplete(true);
                        // Use stable lesson.order instead of sidebar index
                        await enrollmentAPI.completeLesson({
                          courseId: id,
                          lessonId: selected?.order ?? safeSelectedIndex,
                        });

                        const enrollRes = await enrollmentAPI.getEnrollmentByCourse(id);
                        setEnrollment(enrollRes.data.data);
                        // Refresh course to keep UI derived states consistent
                        await fetchCourseAndEnrollment();
                      } catch (e) {
                        console.error(e);
                      } finally {
                        setMarkingComplete(false);
                      }
                    }}
                  />
                ) : (
                  <div className="p-6 text-sm text-slate-300">
                    Video not available for this lesson.
                  </div>
                )}
              </div>

              {/* Below video: title + description */}
              <div className="mt-4">
                <h2 className="text-xl font-semibold">{selected?.title || 'Select a lesson'}</h2>
                <p className="text-slate-300 mt-2">{selected?.description || ' '}</p>
                {markingComplete && (
                  <p className="text-sm text-slate-300 mt-3">Updating completion…</p>
                )}
              </div>
            </div>

            {/* Sticky progress section */}
            <div className="lg:sticky lg:top-24 rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.15em] text-cyan-200/70">Progress</p>
                  <p className="text-3xl font-semibold mt-1">{Math.max(0, Math.min(100, completionPercentage))}%</p>
                  <p className="text-sm text-slate-300 mt-1">Completion over this course</p>
                </div>
                <div className="text-right">
                  {isEnrolled ? (
                    <button
                      onClick={handleContinue}
                      className="rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-400 transition"
                      disabled={!lessons.length}
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      className="rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-400 transition"
                    >
                      Enroll
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-cyan-400"
                  style={{ width: `${Math.max(0, Math.min(100, completionPercentage))}%` }}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

