import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courseAPI, enrollmentAPI, paymentAPI } from '../api/apiService';
import LockedContent from '../components/LockedContent';
import MockPaymentModal from '../components/payment/MockPaymentModal';
import CourseChat from '../components/chat/CourseChat';
import DiscussionBoard from '../components/discussion/DiscussionBoard';
import LiveClassList from '../components/live/LiveClassList';
import AIChatbot from '../components/chat/AIChatbot';

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
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('lessons');

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

    if (course?.price > 0) {
      setIsPaymentModalOpen(true);
    } else {
      try {
        await enrollmentAPI.enrollCourse({ courseId: id });
        await fetchCourseAndEnrollment();
      } catch (e) {
        alert('Error enrolling in course');
        console.error(e);
      }
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      // For mock payment, we need to create order first, then verify it
      const orderRes = await paymentAPI.createPaymentOrder({ courseId: id });
      await paymentAPI.verifyPayment({
        orderId: orderRes.data.data.orderId,
        razorpayPaymentId: 'pay_mock_' + Date.now(),
        razorpaySignature: 'mock_signature'
      });
      setIsPaymentModalOpen(false);
      await fetchCourseAndEnrollment();
    } catch (error) {
      alert('Error during checkout');
      console.error(error);
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
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <p className="loading-text">Loading...</p>
        </div>
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
      <div className="dashboard-page">
        <div className="dashboard-empty">
          <h2 className="dashboard-empty-title">Course not found</h2>
        </div>
      </div>
    );
  }

  const isEnrolled = !!enrollment;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="course-learn-header">
          <button
            onClick={() => navigate(-1)}
            className="btn-back"
          >
            ← Back
          </button>
          <div className="course-learn-header-info">
            <p className="dashboard-label">{course.category}</p>
            <h1 className="dashboard-title" style={{ fontSize: '1.5rem' }}>{course.title}</h1>
          </div>
        </div>

        <div className="course-learn-grid">
          {/* Left: lesson sidebar */}
          <aside className="course-learn-sidebar">
            <div className="course-learn-sidebar-header">
              {isEnrolled && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <button onClick={() => setActiveTab('lessons')} className="btn-action" style={{ background: activeTab === 'lessons' ? 'var(--accent)' : 'transparent', color: activeTab === 'lessons' ? '#fff' : 'var(--text-secondary)', border: activeTab === 'lessons' ? 'none' : '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Lessons</button>
                    <button onClick={() => setActiveTab('live')} className="btn-action" style={{ background: activeTab === 'live' ? 'var(--accent)' : 'transparent', color: activeTab === 'live' ? '#fff' : 'var(--text-secondary)', border: activeTab === 'live' ? 'none' : '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Live Classes</button>
                    <button onClick={() => setActiveTab('discussions')} className="btn-action" style={{ background: activeTab === 'discussions' ? 'var(--accent)' : 'transparent', color: activeTab === 'discussions' ? '#fff' : 'var(--text-secondary)', border: activeTab === 'discussions' ? 'none' : '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Discussions</button>
                    <button onClick={() => setActiveTab('chat')} className="btn-action" style={{ background: activeTab === 'chat' ? 'var(--accent)' : 'transparent', color: activeTab === 'chat' ? '#fff' : 'var(--text-secondary)', border: activeTab === 'chat' ? 'none' : '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Chat Room</button>
                    <button onClick={() => setActiveTab('ai-assistant')} className="btn-action" style={{ background: activeTab === 'ai-assistant' ? 'var(--accent)' : 'transparent', color: activeTab === 'ai-assistant' ? '#fff' : 'var(--text-secondary)', border: activeTab === 'ai-assistant' ? 'none' : '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>AI Assistant ✨</button>
                  </div>
                </div>
              )}
              {!isEnrolled && (
                <>
                  <h2 className="dashboard-section-title">Course Content</h2>
                  <p className="dashboard-section-desc">Pick a lesson to start learning.</p>
                </>
              )}
            </div>

            <div className="course-learn-sidebar-content">
              {!isEnrolled ? (
                <>
                  {lessons.length === 0 ? (
                    <div className="course-learn-empty">
                      No preview lessons available.
                    </div>
                  ) : (
                    <div className="course-learn-lessons">
                      {lessons.map((lesson, index) => {
                        const active = index === safeSelectedIndex;
                        return (
                          <button
                            key={index}
                            onClick={() => setSelectedLesson(index)}
                            className={`course-learn-lesson ${active ? 'course-learn-lesson-active' : ''}`}
                          >
                            <div className="course-learn-lesson-content">
                              <div>
                                <p className="course-learn-lesson-title">{lesson.title}</p>
                                <p className="course-learn-lesson-duration">{lesson.duration || ''}</p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {activeTab === 'lessons' && (
                    <>
                      {lessons.length === 0 ? (
                        <div className="course-learn-empty">
                          No lessons available.
                        </div>
                      ) : (
                        <div className="course-learn-lessons">
                          {lessons.map((lesson, index) => {
                            const active = index === safeSelectedIndex;
                            return (
                              <button
                                key={index}
                                onClick={() => setSelectedLesson(index)}
                                className={`course-learn-lesson ${active ? 'course-learn-lesson-active' : ''}`}
                              >
                                <div className="course-learn-lesson-content">
                                  <div>
                                    <p className="course-learn-lesson-title">{lesson.title}</p>
                                    <p className="course-learn-lesson-duration">{lesson.duration || ''}</p>
                                  </div>
                                  {index < (enrollment?.completedLessons?.length ?? 0) && (
                                    <span className="course-learn-lesson-complete">✓</span>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}
                  {activeTab !== 'lessons' && (
                    <div className="course-learn-empty">
                      Select the Lessons tab to view course content.
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="course-learn-sidebar-footer">
              {!isEnrolled ? (
                <button
                  onClick={handleEnroll}
                  className="btn-action"
                  style={{ width: '100%' }}
                >
                  {course.price > 0 ? 'Enroll Now' : 'Join for Free'}
                </button>
              ) : (
                activeTab === 'lessons' && lessons.length > 0 && (
                  <button
                    onClick={handleContinue}
                    className="btn-action"
                    style={{ width: '100%' }}
                  >
                    Continue
                  </button>
                )
              )}
            </div>
          </aside>

          {/* Right: video + details + sticky progress */}
          <section className="course-learn-content">
            {!isEnrolled ? (
              <>
                <div className="course-learn-video-section">
                  {/* Video player - preview mode */}
                  <div className="course-learn-video-wrapper">
                    {selected?.videoUrl ? (
                      <video
                        key={safeSelectedIndex}
                        src={selected.videoUrl}
                        controls
                        className="course-learn-video"
                      />
                    ) : (
                      <div className="course-learn-video-empty">
                        Video not available for this lesson.
                      </div>
                    )}
                  </div>

                  {/* Below video: title + description */}
                  <div className="course-learn-video-info">
                    <h2 className="dashboard-section-title" style={{ fontSize: '1.25rem' }}>{selected?.title || 'Select a lesson'}</h2>
                    <p className="dashboard-section-desc">{selected?.description || ' '}</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                {activeTab === 'lessons' ? (
                  <>
                    <div className="course-learn-video-section">
                      {/* Video player */}
                      <div className="course-learn-video-wrapper">
                        {selected?.videoUrl ? (
                          <video
                            key={safeSelectedIndex}
                            src={selected.videoUrl}
                            controls
                            className="course-learn-video"
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
                          <div className="course-learn-video-empty">
                            Video not available for this lesson.
                          </div>
                        )}
                      </div>

                      {/* Below video: title + description */}
                      <div className="course-learn-video-info">
                        <h2 className="dashboard-section-title" style={{ fontSize: '1.25rem' }}>{selected?.title || 'Select a lesson'}</h2>
                        <p className="dashboard-section-desc">{selected?.description || ' '}</p>
                        {markingComplete && (
                          <p className="dashboard-section-desc" style={{ marginTop: '0.75rem' }}>Updating completion…</p>
                        )}
                      </div>
                    </div>

                    {/* Sticky progress section */}
                    <div className="course-learn-progress">
                      <div className="course-learn-progress-header">
                        <div>
                          <p className="dashboard-label">Progress</p>
                          <p className="course-learn-progress-value">{Math.max(0, Math.min(100, completionPercentage))}%</p>
                          <p className="dashboard-section-desc">Completion over this course</p>
                        </div>
                        <div>
                          <button
                            onClick={handleContinue}
                            className="btn-action"
                            disabled={!lessons.length}
                          >
                            Continue
                          </button>
                        </div>
                      </div>

                      <div className="course-learn-progress-bar">
                        <div
                          className="course-learn-progress-fill"
                          style={{ width: `${Math.max(0, Math.min(100, completionPercentage))}%` }}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {activeTab === 'discussions' && (
                      <div className="course-learn-video-section">
                        <DiscussionBoard courseId={course._id} />
                      </div>
                    )}
                    {activeTab === 'chat' && (
                      <div className="course-learn-video-section">
                        <CourseChat courseId={course._id} />
                      </div>
                    )}
                    {activeTab === 'ai-assistant' && (
                      <div className="course-learn-video-section">
                        <AIChatbot courseId={course._id} courseTitle={course.title} />
                      </div>
                    )}
                    {activeTab === 'live' && (
                      <div className="course-learn-video-section">
                        <LiveClassList courseId={course._id} />
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </section>
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

