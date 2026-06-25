import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';



import { useAuth } from '../context/AuthContext';
import { courseAPI, enrollmentAPI, paymentAPI } from '../api/apiService';
import LockedContent from '../components/LockedContent';
import CourseChat from '../components/chat/CourseChat';
import DiscussionBoard from '../components/discussion/DiscussionBoard';
import LiveClassList from '../components/live/LiveClassList';
import MockPaymentModal from '../components/payment/MockPaymentModal';
import AIChatbot from '../components/chat/AIChatbot';

export default function CourseDetail() {

  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState(0);
  const [activeTab, setActiveTab] = useState('lessons');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

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

    if (course.price > 0) {
      setIsPaymentModalOpen(true);
    } else {
      try {
        await enrollmentAPI.enrollCourse({ courseId: id });
        await fetchCourseAndEnrollment();
      } catch (error) {
        alert('Error enrolling in course');
        console.error(error);
      }
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      await paymentAPI.createPaymentOrder({ courseId: id });
      await enrollmentAPI.enrollCourse({ courseId: id });
      setIsPaymentModalOpen(false);
      await fetchCourseAndEnrollment();
    } catch (error) {
      alert('Error during checkout');
      console.error(error);
    }
  };

  if (loading) return <div className="dashboard-page flex items-center justify-center text-slate-100">Loading...</div>;

  if (locked) {
    return (
      <div className="dashboard-page">
        <LockedContent
          title="Course locked"
          description={lockedMessage || 'Enroll to access this course.'}
          ctaLabel="Enroll to access"
          ctaTo="/courses"
        />
      </div>
    );
  }

  if (!course) return <div className="dashboard-page flex items-center justify-center text-slate-100">Course not found</div>;


  const isEnrolled = !!enrollment;

  return (
    <div className="dashboard-page">
      <div className="dashboard-bg">
        <div className="dashboard-orb dashboard-orb-1"></div>
        <div className="dashboard-orb dashboard-orb-2"></div>
      </div>

      <div className="dashboard-container">
        <button
          onClick={() => navigate(-1)}
          className="btn-action"
          style={{ marginBottom: '2rem' }}
        >
          ← Back to courses
        </button>

        <div className="dashboard-main-grid">
          <div className="dashboard-left">
            <section className="dashboard-section" style={{ padding: '0', overflow: 'hidden' }}>
              <div className="relative overflow-hidden bg-slate-950 text-slate-100 shadow-xl">
                <img src={course.thumbnail} alt={course.title} className="h-96 w-full object-cover opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <span className="badge-pill" style={{ background: 'var(--accent)', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>{course.category}</span>
                  <h1 className="mt-4 text-4xl font-semibold text-white" style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>{course.title}</h1>
                  <p className="mt-3 max-w-2xl text-slate-300">{course.description}</p>
                </div>
              </div>

              <div style={{ padding: '2rem' }}>
                <div className="dashboard-stats" style={{ marginBottom: '2rem' }}>
                  <div className="stat-card">
                    <p className="stat-label">Rating</p>
                    <p className="stat-value" style={{ fontSize: '1.5rem' }}>★ {course.rating}</p>
                    <p className="stat-label" style={{ marginTop: '0.5rem' }}>{course.students} students enrolled</p>
                  </div>
                  <div className="stat-card">
                    <p className="stat-label">Duration</p>
                    <p className="stat-value" style={{ fontSize: '1.5rem' }}>{course.duration}</p>
                    <p className="stat-label" style={{ marginTop: '0.5rem' }}>Complete at your own pace</p>
                  </div>
                  <div className="stat-card">
                    <p className="stat-label">Price</p>
                    <p className="stat-value" style={{ fontSize: '1.5rem' }}>₹{course.price}</p>
                    <p className="stat-label" style={{ marginTop: '0.5rem' }}>Secure payment ready</p>
                  </div>
                </div>

                {isEnrolled && (
                  <div style={{ marginTop: '2rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1.5rem', overflowX: 'auto' }}>
                      <button onClick={() => setActiveTab('lessons')} className="btn-action" style={{ background: activeTab === 'lessons' ? 'var(--accent)' : 'transparent', color: activeTab === 'lessons' ? '#fff' : 'var(--text-secondary)', border: activeTab === 'lessons' ? 'none' : '1px solid rgba(255,255,255,0.2)' }}>Lessons</button>
                      <button onClick={() => setActiveTab('live')} className="btn-action" style={{ background: activeTab === 'live' ? 'var(--accent)' : 'transparent', color: activeTab === 'live' ? '#fff' : 'var(--text-secondary)', border: activeTab === 'live' ? 'none' : '1px solid rgba(255,255,255,0.2)' }}>Live Classes</button>
                      <button onClick={() => setActiveTab('discussions')} className="btn-action" style={{ background: activeTab === 'discussions' ? 'var(--accent)' : 'transparent', color: activeTab === 'discussions' ? '#fff' : 'var(--text-secondary)', border: activeTab === 'discussions' ? 'none' : '1px solid rgba(255,255,255,0.2)' }}>Discussions</button>
                      <button onClick={() => setActiveTab('chat')} className="btn-action" style={{ background: activeTab === 'chat' ? 'var(--accent)' : 'transparent', color: activeTab === 'chat' ? '#fff' : 'var(--text-secondary)', border: activeTab === 'chat' ? 'none' : '1px solid rgba(255,255,255,0.2)' }}>Chat Room</button>
                      <button onClick={() => setActiveTab('ai-assistant')} className="btn-action" style={{ background: activeTab === 'ai-assistant' ? 'var(--accent)' : 'transparent', color: activeTab === 'ai-assistant' ? '#fff' : 'var(--text-secondary)', border: activeTab === 'ai-assistant' ? 'none' : '1px solid rgba(255,255,255,0.2)' }}>AI Assistant ✨</button>
                    </div>

                    {activeTab === 'lessons' && (
                      <div>
                        <h3 className="dashboard-section-title">Course Content</h3>
                        <p className="dashboard-section-desc">Select a lesson to continue your learning.</p>
                        
                        {(() => {
                          const lessons = Array.isArray(course?.lessons) ? course.lessons : [];
                          if (!lessons.length) {
                            return (
                              <div style={{ marginTop: '1.5rem' }}>
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
                            <div style={{ marginTop: '1.5rem' }}>
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

                              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {course.lessons.map((lesson, index) => (
                                  <button
                                    key={index}
                                    onClick={() => setSelectedLesson(index)}
                                    style={{
                                      width: '100%', borderRadius: '1rem', padding: '1rem 1.5rem', textAlign: 'left',
                                      background: selectedLesson === index ? 'rgba(79, 70, 229, 0.1)' : 'var(--bg-card)',
                                      border: `1px solid ${selectedLesson === index ? 'var(--accent)' : 'rgba(255,255,255,0.05)'}`,
                                      transition: 'all 0.2s', cursor: 'pointer'
                                    }}
                                  >
                                    <p style={{ fontWeight: '600', color: selectedLesson === index ? 'var(--accent)' : 'var(--text-primary)' }}>{lesson.title}</p>
                                    <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{lesson.duration}</p>
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                    
                    {activeTab === 'live' && <LiveClassList courseId={course._id} />}
                    {activeTab === 'discussions' && <DiscussionBoard courseId={course._id} />}
                    {activeTab === 'chat' && <CourseChat courseId={course._id} />}
                    {activeTab === 'ai-assistant' && <AIChatbot courseId={course._id} courseTitle={course.title} />}
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="dashboard-right">
            <div className="sidebar-card">
              <p className="sidebar-label">Instructor</p>
              <h3 className="sidebar-title">{course.instructor?.name}</h3>
              <p className="sidebar-text">{course.instructor?.email}</p>
              
              <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <p className="sidebar-label">Ready to learn?</p>
                <p className="sidebar-text" style={{ marginBottom: '1.5rem', color: '#fff' }}>{isEnrolled ? 'Continue your progress' : 'Enroll now and start today'}</p>

                {isEnrolled ? (
                  <div>
                    <button
                      onClick={() => {
                        const firstLesson = course?.lessons?.[0];
                        if (!firstLesson) return;
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="btn-action"
                      style={{ width: '100%' }}
                    >
                      Continue Learning
                    </button>
                    <p className="sidebar-text" style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.8rem' }}>
                      Select a lesson from the course content section above.
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleEnroll}
                    className="btn-action"
                    style={{ width: '100%' }}
                  >
                    {course.price > 0 ? 'Enroll Now' : 'Join for Free'}
                  </button>
                )}
                <p className="sidebar-text" style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.8rem' }}>Secure checkout and course enrollment with trusted support.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <MockPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
        courseTitle={course.title}
        amount={course.price}
      />
    </div>
  );
}
