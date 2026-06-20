import React from 'react';
import { Link } from 'react-router-dom';

export default function LockedContent({
  title = 'Locked content',
  description = 'This content is not available yet.',
  ctaLabel = 'Enroll to access',
  ctaTo = '/courses',
  showDetails = false,
  details = null,
}) {
  return (
    <div className="dashboard-page">
      <div className="dashboard-bg">
        <div className="dashboard-orb dashboard-orb-1"></div>
        <div className="dashboard-orb dashboard-orb-2"></div>
      </div>

      <div className="dashboard-container">
        <div className="dashboard-empty">
          <h2 className="dashboard-empty-title">{title}</h2>
          <p className="dashboard-empty-text">{description}</p>

          <div style={{ marginTop: '1.75rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={ctaTo} className="btn-action" style={{ minWidth: 220 }}>
              {ctaLabel}
            </Link>
            <Link to="/courses" className="btn-outline-alt" style={{ minWidth: 220 }}>
              Browse courses
            </Link>
          </div>

          {showDetails && details && (
            <div style={{ marginTop: '1rem', color: 'var(--text-secondary)', textAlign: 'left', maxWidth: 720, marginLeft: 'auto', marginRight: 'auto' }}>
              {details}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

