import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="about-page">
      <div className="about-bg">
        <div className="about-orb about-orb-1" />
        <div className="about-orb about-orb-2" />
      </div>

      <div className="about-container">
        <section className="about-hero">
          <div className="about-hero-inner glass-card">
            <h1 className="about-title">About EduSphere</h1>
            <p className="about-subtitle">
              We’re building a learning platform that helps you move from curiosity to mastery
              with expert-led courses, practical learning paths, and verified certificates.
            </p>

            <div className="about-hero-actions">
              <Link to="/register" className="btn-action">
                Get Started Free
              </Link>
              <Link to="/help" className="btn-outline-alt">
                Visit Help Center
              </Link>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="section-header">
            <p className="section-label">Our Mission</p>
            <h2 className="section-heading">Learn smarter. Progress faster.</h2>
          </div>

          <div className="about-grid">
            <div className="feature-card">
              <div className="feature-icon">✓</div>
              <h3 className="feature-title">Guided Learning Paths</h3>
              <p className="feature-desc">
                Follow step-by-step tracks designed to build real skills (not just theory).
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">★</div>
              <h3 className="feature-title">Expert Instructors</h3>
              <p className="feature-desc">
                Learn from industry professionals who teach what employers actually need.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⏱</div>
              <h3 className="feature-title">Learn Anytime</h3>
              <p className="feature-desc">
                Flexible access so you can learn at your pace—day or night.
              </p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="section-header">
            <p className="section-label">Why learners choose us</p>
            <h2 className="section-heading">A premium experience end-to-end</h2>
          </div>

          <div className="about-two-col">
            <div className="glass-card about-panel">
              <h3 className="about-panel-title">What you get</h3>
              <ul className="about-list">
                <li>Curated course content across programming and business.</li>
                <li>Quizzes and assignments to reinforce your understanding.</li>
                <li>Certificates you can share after completing learning paths.</li>
              </ul>
            </div>

            <div className="glass-card about-panel">
              <h3 className="about-panel-title">How we improve</h3>
              <ul className="about-list">
                <li>New featured courses added regularly.</li>
                <li>Better pacing based on learner progress.</li>
                <li>Support for troubleshooting and learning guidance.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

