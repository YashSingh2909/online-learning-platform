import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ width: '280px', verticalAlign: 'top', padding: '0 2rem 2rem 0' }}>
                <div className="logo">
                  <div className="logo-icon">E</div>
                  <span className="logo-text">EduSphere</span>
                </div>
                <p style={{ margin: '1rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Build career-ready skills with modern courses, expert instructors, and a premium learning experience.
                </p>
                <div style={{ margin: '1.5rem 0' }}>
                  <a href="mailto:support@edusphere.com" style={{ display: 'block', color: '#888', fontSize: '0.85rem', marginBottom: '0.5rem', textDecoration: 'none' }}>support@edusphere.com</a>
                  <a href="tel:+18001234567" style={{ color: '#888', fontSize: '0.85rem', textDecoration: 'none' }}>+91 9998887774</a>
                </div>
              </td>
              <td style={{ width: '25%', verticalAlign: 'top', padding: '0 1rem' }}>
                <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff', marginBottom: '1rem', borderBottom: '2px solid #06b6d4', paddingBottom: '0.5rem' }}>Explore</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Link to="/courses" style={{ color: '#888', fontSize: '0.875rem', textDecoration: 'none' }}>Courses</Link>
                  <Link to="/" style={{ color: '#888', fontSize: '0.875rem', textDecoration: 'none' }}>Learning Paths</Link>
                  <Link to="/" style={{ color: '#888', fontSize: '0.875rem', textDecoration: 'none' }}>Live Workshops</Link>
                  <Link to="/" style={{ color: '#888', fontSize: '0.875rem', textDecoration: 'none' }}>Contact</Link>
                </div>
              </td>
              <td style={{ width: '25%', verticalAlign: 'top', padding: '0 1rem' }}>
                <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff', marginBottom: '1rem', borderBottom: '2px solid #06b6d4', paddingBottom: '0.5rem' }}>Platform</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Link to="/courses" style={{ color: '#888', fontSize: '0.875rem', textDecoration: 'none' }}>Browse Courses</Link>
                  <Link to="/register" style={{ color: '#888', fontSize: '0.875rem', textDecoration: 'none' }}>Become an Instructor</Link>
                  <Link to="/" style={{ color: '#888', fontSize: '0.875rem', textDecoration: 'none' }}>For Business</Link>
                  <Link to="/" style={{ color: '#888', fontSize: '0.875rem', textDecoration: 'none' }}>Mobile App</Link>
                </div>
              </td>
              <td style={{ width: '25%', verticalAlign: 'top', padding: '0 1rem' }}>
                <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff', marginBottom: '1rem', borderBottom: '2px solid #06b6d4', paddingBottom: '0.5rem' }}>Company</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Link to="/" style={{ color: '#888', fontSize: '0.875rem', textDecoration: 'none' }}>About Us</Link>
                  <Link to="/" style={{ color: '#888', fontSize: '0.875rem', textDecoration: 'none' }}>Careers</Link>
                  <Link to="/" style={{ color: '#888', fontSize: '0.875rem', textDecoration: 'none' }}>Blog</Link>
                  <Link to="/" style={{ color: '#888', fontSize: '0.875rem', textDecoration: 'none' }}>Press</Link>
                </div>
              </td>
              <td style={{ width: '25%', verticalAlign: 'top', padding: '0 1rem' }}>
                <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff', marginBottom: '1rem', borderBottom: '2px solid #06b6d4', paddingBottom: '0.5rem' }}>Support</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Link to="/" style={{ color: '#888', fontSize: '0.875rem', textDecoration: 'none' }}>Help Center</Link>
                  <Link to="/" style={{ color: '#888', fontSize: '0.875rem', textDecoration: 'none' }}>Contact Us</Link>
                  <Link to="/" style={{ color: '#888', fontSize: '0.875rem', textDecoration: 'none' }}>Terms of Service</Link>
                  <Link to="/" style={{ color: '#888', fontSize: '0.875rem', textDecoration: 'none' }}>Privacy Policy</Link>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ borderTop: '1px solid #333', padding: '1.5rem 0', marginTop: '1rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8125rem', color: '#666' }}>© 2026 EduSphere. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}