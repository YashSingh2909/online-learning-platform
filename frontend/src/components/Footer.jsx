import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1.5rem',
        }}
      >
        <div
          className="footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
            gap: '1.5rem',
            alignItems: 'start',
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div className="logo">
              <div className="logo-icon">E</div>
              <span className="logo-text">EduSphere</span>
            </div>
            <p
              style={{
                margin: '1rem 0',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                lineHeight: 1.6,
              }}
            >
              Build career-ready skills with modern courses, expert instructors, and a premium learning experience.
            </p>
            <div style={{ margin: '1.5rem 0' }}>
              <a
                href="mailto:support@edusphere.com"
                style={{
                  display: 'block',
                  color: '#888',
                  fontSize: '0.85rem',
                  marginBottom: '0.5rem',
                  textDecoration: 'none',
                }}
              >
                support@edusphere.com
              </a>
              <a
                href="tel:+18001234567"
                style={{ color: '#888', fontSize: '0.85rem', textDecoration: 'none' }}
              >
                +91 9998887774
              </a>
            </div>
          </div>

          {[
            {
              title: 'Explore',
              links: [
                { to: '/courses', label: 'Courses' },
                { to: '/', label: 'Learning Paths' },
                { to: '/', label: 'Live Workshops' },
                { to: '/', label: 'Contact' },
              ],
            },
            {
              title: 'Platform',
              links: [
                { to: '/courses', label: 'Browse Courses' },
                { to: '/register', label: 'Become an Instructor' },
                { to: '/', label: 'For Business' },
                { to: '/', label: 'Mobile App' },
              ],
            },
            {
              title: 'Company',
              links: [
                { to: '/', label: 'About Us' },
                { to: '/', label: 'Careers' },
                { to: '/', label: 'Blog' },
                { to: '/', label: 'Press' },
              ],
            },
            {
              title: 'Support',
              links: [
                { to: '/', label: 'Help Center' },
                { to: '/', label: 'Contact Us' },
                { to: '/', label: 'Terms of Service' },
                { to: '/', label: 'Privacy Policy' },
              ],
            },
          ].map((col) => (
            <div key={col.title} style={{ minWidth: 0 }}>
              <h4
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#fff',
                  marginBottom: '1rem',
                  borderBottom: '2px solid #06b6d4',
                  paddingBottom: '0.5rem',
                }}
              >
                {col.title}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {col.links.map((l) => (
                  <Link
                    key={l.label}
                    to={l.to}
                    style={{ color: '#888', fontSize: '0.875rem', textDecoration: 'none' }}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            borderTop: '1px solid #333',
            padding: '1.5rem 0',
            marginTop: '1.5rem',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '0.8125rem', color: '#666' }}>© 2026 EduSphere. All rights reserved.</p>
        </div>

        <style>
          {`
            /* Mobile: 1 column */
            @media (max-width: 479px) {
              footer .footer-grid {
                grid-template-columns: 1fr !important;
                gap: 1.5rem !important;
              }
            }

            /* Small Mobile/Tablet: 2 columns */
            @media (min-width: 480px) and (max-width: 767px) {
              footer .footer-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                gap: 1.75rem !important;
              }
            }

            /* Tablet: 3 columns */
            @media (min-width: 768px) and (max-width: 1023px) {
              footer .footer-grid {
                grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
                gap: 2rem !important;
              }
            }

            /* Small Desktop: 4 columns */
            @media (min-width: 1024px) and (max-width: 1279px) {
              footer .footer-grid {
                grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
              }
            }

            /* Large Desktop: 5 columns (default) */
            @media (min-width: 1280px) {
              footer .footer-grid {
                grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
              }
            }
          `}
        </style>
      </div>
    </footer>
  );
}