import React, { useEffect, useState } from 'react';
import { notificationAPI } from '../api/apiService';
import { useAuth } from '../context/AuthContext';

export default function Notifications() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await notificationAPI.getNotifications();
      setItems(res.data.data || []);
    } catch (e) {
      setError(e?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    load();
  }, [user]);

  return (
    <div className="dashboard-page">
      <div className="dashboard-bg">
        <div className="dashboard-orb dashboard-orb-1"></div>
        <div className="dashboard-orb dashboard-orb-2"></div>
      </div>

      <div className="dashboard-container">
        <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p className="dashboard-label">Notifications</p>
            <h1 className="dashboard-title">Stay Updated</h1>
          </div>
          <button
            className="btn-outline-alt"
            onClick={async () => {
              try {
                await notificationAPI.markAllAsRead();
                await load();
              } catch (e) {
                setError(e?.message || 'Failed to update notifications');
              }
            }}
          >
            Mark all as read
          </button>
        </div>

        {loading ? (
          <div className="dashboard-loading">
            <p className="loading-text">Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="dashboard-error">
            <p>{error}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="dashboard-empty">
            <h2 className="dashboard-empty-title">All caught up</h2>
            <p className="dashboard-empty-text">No notifications right now.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map((n) => (
              <div
                key={n._id}
                className={`notif-card ${!n.read ? 'unread' : ''}`}
              >
                <div className="notif-icon">
                  {n.type === 'success' ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18, color: '#22c55e' }}>
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                      <path d="M22 4L12 14.01l-3-3" />
                    </svg>
                  ) : n.type === 'warning' ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18, color: '#f59e0b' }}>
                      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      <path d="M12 9v4M12 17h.01" />
                    </svg>
                  ) : n.type === 'error' ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18, color: '#ef4444' }}>
                      <circle cx="12" cy="12" r="10" />
                      <path d="M15 9l-6 6M9 9l6 6" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18, color: '#06b6d4' }}>
                      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 01-3.46 0" />
                    </svg>
                  )}
                </div>
                <div className="notif-content">
                  <h3 className="notif-title">{n.title}</h3>
                  <p className="notif-text">{n.message}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                    <span className="course-card-badge" style={{ fontSize: '0.625rem' }}>{n.type}</span>
                    <span className="course-card-badge" style={{ background: 'var(--border)', fontSize: '0.625rem' }}>{n.read ? 'Read' : 'Unread'}</span>
                  </div>
                  <p className="notif-time">{n.createdAt ? new Date(n.createdAt).toLocaleString() : 'Just now'}</p>
                </div>
                <div>
                  <button
                    className="btn-outline-alt"
                    style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem' }}
                    onClick={async () => {
                      try {
                        await notificationAPI.markNotificationAsRead(n._id);
                        await load();
                      } catch (e) {
                        setError(e?.message || 'Failed to update');
                      }
                    }}
                    disabled={!!n.read}
                  >
                    {n.read ? '✓' : 'Mark read'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}