import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courseAPI } from '../api/apiService';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Clear state first to ensure fresh fetch
    setCourses([]);
    setLoading(true);

    const fetchCourses = async () => {
      try {
        const response = await courseAPI.getAllCourses();
        // Sort by createdAt descending for consistent order
        const sortedCourses = (response.data.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setCourses(sortedCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleCourseClick = (courseId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/course/${courseId}/learn`);
  };

  return (
    <div className="home-page">
      <div className="home-bg">
        <div className="home-orb home-orb-1"></div>
        <div className="home-orb home-orb-2"></div>
      </div>

      <div className="home-container">
        {/* Hero Section */}
        <section className="hero-section">
          <Link to="/" className="hero-logo">
            <div className="logo-icon">E</div>
            <span className="logo-text">EduSphere</span>
          </Link>
          <span className="hero-badge">
            <span className="hero-badge-dot"></span>
            Trusted by 10,000+ learners
          </span>
          <h1 className="hero-heading">
            Master New Skills with{' '}
            <span className="hero-gradient">EduSphere</span>
          </h1>
          <p className="hero-text">
            Unlock your potential with expert-led courses in programming, design, business, and more.
            Learn at your own pace and earn certificates.
          </p>

          <div className="hero-stats">
            <div className="stat-item">
              <p className="stat-value">50+</p>
              <p className="stat-label">Courses</p>
            </div>
            <div className="stat-item">
              <p className="stat-value">10K+</p>
              <p className="stat-label">Students</p>
            </div>
            <div className="stat-item">
              <p className="stat-value">4.8</p>
              <p className="stat-label">Rating</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="section-header">
            <p className="section-label">Why Choose Us</p>
            <h2 className="section-heading">Everything you need to learn</h2>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
              <h3 className="feature-title">Expert Instructors</h3>
              <p className="feature-desc">Learn from industry professionals.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="feature-title">Certificates</h3>
              <p className="feature-desc">Earn verified certificates.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="feature-title">Learn Anytime</h3>
              <p className="feature-desc">Access courses 24/7.</p>
            </div>
          </div>
        </section>

        {/* Featured Courses */}
        <section className="courses-section">
          <div className="section-header">
            <p className="section-label">Popular</p>
            <h2 className="section-heading">Featured Courses</h2>
          </div>

          {loading ? (
            <div className="courses-loading">
              <div className="loading-spinner"></div>
            </div>
          ) : courses.length > 0 ? (
            <div className="courses-grid">
              {courses.slice(0, 6).map((course) => (
                  <div
                  key={course._id}
                  onClick={() => handleCourseClick(course._id)}
                  className="course-card"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleCourseClick(course._id);
                  }}
                >
                  <div className="course-thumbnail">
                    <img src={course.thumbnail} alt={course.title} />
                    <span className="course-category">{course.category}</span>
                  </div>
                  <div className="course-content">
                    <h3 className="course-title">{course.title}</h3>
                    <p className="course-desc">{course.description}</p>
                    <div className="course-meta">
                      <span className="course-price">₹{course.price}</span>
                      <div className="course-rating">
                        <span>★</span>
                        <span>{course.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="courses-empty">
              <p>No courses available.</p>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-card">
            <h2 className="cta-heading">Ready to start learning?</h2>
            <p className="cta-text">Join thousands of learners today.</p>
            <Link to={user ? "/dashboard" : "/register"} className="cta-btn">
              {user ? 'Go to Dashboard' : 'Get Started Free'}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
