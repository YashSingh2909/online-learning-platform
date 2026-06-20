import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Help() {
  const [active, setActive] = useState(null);

  const faqs = useMemo(
    () => [
      {
        q: 'How do I get started?',
        a: 'Go to Get Started Free, create your account, and start with featured courses. You can explore and track your progress anytime from the dashboard.'
      },
      {
        q: 'Do you offer certificates?',
        a: 'Yes. Completing a learning path and required quizzes/assignments can help you earn a certificate. Check the Certificates section in your dashboard.'
      },
      {
        q: 'Can I learn at my own pace?',
        a: 'Absolutely. Courses are available 24/7, and you can revisit content whenever you want.'
      },
      {
        q: 'I forgot my password—what should I do?',
        a: 'Use the login page and follow the reset flow (or contact support via Help Center). We’ll guide you through regaining access.'
      },
      {
        q: 'How do I contact support?',
        a: 'Use the Help Center. If you need assistance, send your message and details about what you’re facing so we can resolve it faster.'
      }
    ],
    []
  );

  return (
    <div className="help-page">
      <div className="help-bg">
        <div className="help-orb help-orb-1" />
        <div className="help-orb help-orb-2" />
      </div>

      <div className="help-container">
        <section className="help-hero">
          <div className="help-hero-inner glass-card">
            <h1 className="help-title">Help Center</h1>
            <p className="help-subtitle">
              Find answers fast. If you don’t see what you need, contact support and we’ll help you.
            </p>

            <div className="help-actions">
              <Link to="/register" className="btn-action">
                Start Learning
              </Link>
              <Link to="/" className="btn-outline-alt">
                Browse Courses
              </Link>
            </div>
          </div>
        </section>

        <section className="help-section">
          <div className="section-header">
            <p className="section-label">Popular questions</p>
            <h2 className="section-heading">Frequently asked</h2>
          </div>

          <div className="faq-list">
            {faqs.map((item, idx) => {
              const isOpen = active === idx;
              return (
                <button
                  type="button"
                  key={item.q}
                  className={`faq-item ${isOpen ? 'open' : ''}`}
                  onClick={() => setActive(isOpen ? null : idx)}
                >
                  <div className="faq-q">
                    <span className="faq-index">{String(idx + 1).padStart(2, '0')}</span>
                    <span>{item.q}</span>
                  </div>
                  <div className="faq-icon">{isOpen ? '−' : '+'}</div>

                  {isOpen && <div className="faq-a">{item.a}</div>}
                </button>
              );
            })}
          </div>
        </section>

        <section className="help-contact">
          <div className="help-contact-grid">
            <div className="glass-card help-panel">
              <h3 className="help-panel-title">Contact Support</h3>
              <p className="help-panel-desc">
                Send us a message with what you’re trying to do and where you’re stuck.
              </p>
              <a className="help-contact-link" href="mailto:support@edusphere.com">
                support@edusphere.com
              </a>
              <a className="help-contact-link" href="tel:+18001234567">
                +91 9998887774
              </a>
            </div>

            <div className="glass-card help-panel">
              <h3 className="help-panel-title">Quick Tips</h3>
              <ul className="about-list">
                <li>Include screenshots or error messages if available.</li>
                <li>Mention your course and device/browser.</li>
                <li>Try refreshing and logging out/in if progress doesn’t sync.</li>
              </ul>
              <p className="help-panel-desc" style={{ marginTop: '1rem' }}>
                Need to keep learning? Head back to your dashboard.
              </p>
              <Link to="/dashboard" className="btn-action" style={{ width: '100%' }}>
                Go to Dashboard
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

