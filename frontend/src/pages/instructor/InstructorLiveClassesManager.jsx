import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { liveClassAPI } from '../../api/apiService';
import { useAuth } from '../../context/AuthContext';

export default function InstructorLiveClassesManager() {
  const { courseId } = useParams();
  const { user } = useAuth();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [topic, setTopic] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('60');
  const [meetingLink, setMeetingLink] = useState('');

  const fetchClasses = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const res = await liveClassAPI.getLiveClasses(courseId);
      setClasses(res?.data?.data || []);
    } catch (e) {
      setError(e?.message || 'Could not load live classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, user]);

  const createClass = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await liveClassAPI.createLiveClass(courseId, {
        topic,
        startTime,
        duration: Number(duration) || 60,
        meetingLink,
      });
      setTopic('');
      setStartTime('');
      setDuration('60');
      setMeetingLink('');
      await fetchClasses();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Could not create live class');
    }
  };

  const updateStatus = async (classId, nextStatus) => {
    setError('');
    try {
      await liveClassAPI.updateLiveClassStatus(courseId, classId, { status: nextStatus });
      await fetchClasses();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Could not update status');
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <p className="dashboard-label">Instructor</p>
          <h1 className="dashboard-title">Live Classes</h1>
          <p className="dashboard-desc">Schedule and manage live classes for this course.</p>
        </div>

        {error ? <div className="dashboard-error">{error}</div> : null}

        <div className="dashboard-section" style={{ marginTop: '1.25rem' }}>
          <div className="dashboard-section-header">
            <div>
              <h2 className="dashboard-section-title">Create live class</h2>
              <p className="dashboard-section-desc">Add topic, time, duration and meeting link.</p>
            </div>
          </div>

          <form onSubmit={createClass}>
            <div className="form-grid">
              <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Topic *</label>
                <input className="form-input" value={topic} onChange={(e) => setTopic(e.target.value)} required />
              </div>
              <div className="form-field">
                <label className="form-label">Start time *</label>
                <input className="form-input" type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
              </div>
              <div className="form-field">
                <label className="form-label">Duration (minutes)</label>
                <input className="form-input" type="number" min={1} value={duration} onChange={(e) => setDuration(e.target.value)} />
              </div>
              <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Meeting link *</label>
                <input className="form-input" value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} required placeholder="https://..." />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-action" disabled={loading}>
                Create
              </button>
            </div>
          </form>
        </div>

        <div className="dashboard-section" style={{ marginTop: '1.5rem' }}>
          <div className="dashboard-section-header">
            <div>
              <h2 className="dashboard-section-title">Scheduled classes</h2>
              <p className="dashboard-section-desc">Update status as needed.</p>
            </div>
          </div>

          {loading ? (
            <div className="dashboard-loading"><p className="loading-text">Loading live classes...</p></div>
          ) : classes.length === 0 ? (
            <div className="dashboard-empty"><p className="dashboard-empty-text">No live classes yet.</p></div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {classes.map((c) => (
                <div key={c._id} className="quiz-card">
                  <div className="course-card-header" style={{ alignItems: 'center' }}>
                    <div>
                      <h3 className="course-card-title">{c.topic}</h3>
                      <p className="course-card-meta">
                        Starts: {c.startTime ? new Date(c.startTime).toLocaleString() : '—'} · Duration: {c.duration || 0} min
                      </p>
                      <p className="course-card-meta">Link: {c.meetingLink ? String(c.meetingLink).slice(0, 45) + (String(c.meetingLink).length > 45 ? '...' : '') : '—'}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                        Status: <span style={{ color: 'var(--accent)' }}>{c.status || 'scheduled'}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button className="btn-outline-alt" type="button" onClick={() => updateStatus(c._id, 'scheduled')}>
                          Scheduled
                        </button>
                        <button className="btn-outline-alt" type="button" onClick={() => updateStatus(c._id, 'live')}>
                          Live
                        </button>
                        <button className="btn-outline-alt" type="button" onClick={() => updateStatus(c._id, 'completed')}>
                          Completed
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

