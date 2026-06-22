import React from 'react';
import { useParams } from 'react-router-dom';

import { Navigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { courseAPI, enrollmentAPI, paymentAPI } from '../api/apiService';
import LockedContent from '../components/LockedContent';


export default function CourseDetail() {

  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState(0);

  // Keep the lesson selection valid when course.lessons arrives.
  useEffect(() => {
    if (!course?.lessons?.length) return;
    if (selectedLesson < 0 || selectedLesson >= course.lessons.length) {
      setSelectedLesson(0);
    }
  }, [course, selectedLesson]);
  const [locked, setLocked] = useState(false);
  const [lockedMessage, setLockedMessage] = useState('');

  const [markingComplete, setMarkingComplete] = useState(false);

  useEffect(() => {

    fetchCourseAndEnrollment();
  }, [id, user]);


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
        } catch (error) {
          // Not enrolled
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
      }
    } finally {
      setLoading(false);
    }
  };



  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (course.price > 0) {
        await paymentAPI.createPaymentOrder({ courseId: id });
        alert('Payment integration would be implemented here');
      } else {
        await enrollmentAPI.enrollCourse({ courseId: id });
        await fetchCourseAndEnrollment();
      }
    } catch (error) {
      alert('Error enrolling in course');
      console.error(error);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-100">Loading...</div>;

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

  if (!course) return <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">Course not found</div>;


  const isEnrolled = !!enrollment;

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      <div className="container mx-auto px-6 py-8">

        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex rounded-full border border-slate-700 bg-slate-900/80 px-5 py-3 text-sm text-slate-200 transition hover:border-cyan-500 hover:text-white"
        >
          ← Back to courses
        </button>

        <div className="grid gap-8 lg:grid-cols-[1.6fr_0.9fr]">
          <section className="rounded-[2rem] bg-white/95 p-8 shadow-2xl shadow-slate-950/10 ring-1 ring-slate-900/5">
            <div className="relative overflow-hidden rounded-[1.75rem] bg-slate-950 text-slate-100 shadow-xl">
              <img src={course.thumbnail} alt={course.title} className="h-96 w-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="badge-pill">{course.category}</span>
                <h1 className="mt-4 text-4xl font-semibold text-white">{course.title}</h1>
                <p className="mt-3 max-w-2xl text-slate-300">{course.description}</p>
              </div>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              <div className="rounded-[1.5rem] bg-slate-950/95 p-6 text-slate-100 shadow-lg shadow-slate-950/10">
                <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Rating</p>
                <p className="mt-4 text-3xl font-semibold">★ {course.rating}</p>
                <p className="mt-2 text-slate-400">{course.students} students enrolled</p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-950/95 p-6 text-slate-100 shadow-lg shadow-slate-950/10">
                <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Duration</p>
                <p className="mt-4 text-3xl font-semibold">{course.duration}</p>
                <p className="mt-2 text-slate-400">Complete at your own pace</p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-950/95 p-6 text-slate-100 shadow-lg shadow-slate-950/10">
                <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Price</p>
                <p className="mt-4 text-3xl font-semibold">₹{course.price}</p>
                <p className="mt-2 text-slate-400">Secure payment ready</p>
              </div>
            </div>

            {isEnrolled && (
              <div className="mt-10 rounded-[1.75rem] border border-slate-200/60 bg-slate-100 p-6 text-slate-950 shadow-sm">
                <h3 className="text-2xl font-semibold">Course Content</h3>
                <p className="mt-3 text-sm text-slate-600">Select a lesson to continue your learning.</p>

                {(() => {
                  const lessons = Array.isArray(course?.lessons) ? course.lessons : [];
                  if (!lessons.length) {
                    return (
                      <div className="mt-6">
                        <div className="rounded-[1.25rem] border border-slate-200/70 bg-white p-4">
                          <p className="font-semibold">No preview lessons available</p>
                          <p className="mt-1 text-sm text-slate-600">Ask your instructor to enable lesson preview.</p>
                        </div>
                      </div>
                    );
                  }

                  const safeSelectedIndex = Math.min(Math.max(selectedLesson, 0), lessons.length - 1);
                  const selected = lessons[safeSelectedIndex];
                  const canPlay = !!selected?.videoUrl;
                  return (
                    <div className="mt-6">
                      <div className="rounded-[1.25rem] border border-slate-200/70 bg-white p-4">
                        <p className="font-semibold">Now playing</p>
                        <p className="mt-1 text-sm text-slate-600">{selected?.title || 'Select a lesson'}</p>

                        <div className="mt-4">
                          {canPlay ? (
                            <video
                              key={selectedLesson}
                              src={selected.videoUrl}
                              controls
                              className="w-full rounded-[0.75rem]"
                              onEnded={async () => {
                                // Completion tracking: mark lesson complete when video ends.
                                if (markingComplete) return;
                                if (!selected?.title) return;

                                try {
                                  setMarkingComplete(true);
                                  // Backend expects lessonId; lessons are embedded -> we treat index as lessonId.
                                  await enrollmentAPI.completeLesson({ courseId: id, lessonId: selectedLesson });
                                  const enrollRes = await enrollmentAPI.getEnrollmentByCourse(id);
                                  setEnrollment(enrollRes.data.data);
                                  // Re-fetch course to keep any derived UI consistent.
                                  await fetchCourseAndEnrollment();
                                } catch (e) {

                                  // Keep UX non-blocking; completion failing should not break playback.
                                  console.error(e);
                                } finally {
                                  setMarkingComplete(false);
                                }
                              }}
                              onTimeUpdate={(e) => {
                                // Soft completion: do not auto-mark here to avoid false progress.
                              }}
                            />
                          ) : (
                            <div className="rounded-[0.75rem] border border-slate-200 bg-slate-50 p-4">
                              <p className="text-sm text-slate-600">Video not available for this lesson.</p>
                            </div>
                          )}
                        </div>

                        {markingComplete && (
                          <p className="mt-3 text-sm text-slate-600">Updating completion…</p>
                        )}
                      </div>
                    </div>
                  );
                })()}

                <div className="mt-6 space-y-3">
                  {course.lessons.map((lesson, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedLesson(index)}
                      className={`w-full rounded-3xl border px-5 py-4 text-left transition ${selectedLesson === index ? 'border-cyan-500 bg-cyan-50' : 'border-slate-200 bg-white hover:border-cyan-300'}`}
                    >
                      <p className="font-semibold">{lesson.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{lesson.duration}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </section>

          <aside className="space-y-6">
            <div className="rounded-[2rem] bg-white/95 p-8 shadow-2xl shadow-slate-950/10 ring-1 ring-slate-900/5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Instructor</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950">{course.instructor?.name}</h2>
              <p className="mt-2 text-slate-600">{course.instructor?.email}</p>
              <div className="mt-6 rounded-3xl bg-slate-950 px-5 py-6 text-slate-100">
                <p className="text-sm text-cyan-200 uppercase tracking-[0.2em]">Ready to learn?</p>
                <p className="mt-3 text-lg font-semibold">{isEnrolled ? 'Continue your progress' : 'Enroll now and start today'}</p>
              </div>
            </div>

            <div className="rounded-[2rem] bg-slate-900/95 p-8 text-slate-100 shadow-2xl shadow-slate-950/15 ring-1 ring-white/10">
              {isEnrolled ? (
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      // Lesson selection happens in this page.
                      const firstLesson = course?.lessons?.[0];
                      if (!firstLesson) return;
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="primary-btn w-full"
                  >
                    Continue Learning
                  </button>
                  <p className="text-sm text-slate-400">
                    Select a lesson from the course content section above.
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  className="primary-btn w-full"
                >
                  {course.price > 0 ? 'Enroll Now' : 'Join for Free'}
                </button>
              )}
              <p className="mt-4 text-sm text-slate-400">Secure checkout and course enrollment with trusted support.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
