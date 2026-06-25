import React, { useState, useEffect } from 'react';
import { liveClassAPI } from '../../api/apiService';
import { useAuth } from '../../context/AuthContext';
import { Video, Calendar, Clock, Plus } from 'lucide-react';

const LiveClassList = ({ courseId }) => {
  const [classes, setClasses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    topic: '', startTime: '', duration: '', meetingLink: ''
  });

  const fetchClasses = async () => {
    try {
      const res = await liveClassAPI.getLiveClasses(courseId);
      setClasses(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await liveClassAPI.createLiveClass(courseId, formData);
      setShowForm(false);
      setFormData({ topic: '', startTime: '', duration: '', meetingLink: '' });
      fetchClasses();
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await liveClassAPI.updateLiveClassStatus(courseId, id, { status });
      fetchClasses();
    } catch (err) {
      console.error(err);
    }
  };

  const isInstructor = user?.role === 'instructor' || user?.role === 'admin';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="dashboard-section-title">Live Classes</h2>
        {isInstructor && (
          <button onClick={() => setShowForm(!showForm)} className="btn-action" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={16} /> Schedule Class
          </button>
        )}
      </div>

      {showForm && isInstructor && (
        <form onSubmit={handleSubmit} style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
          <input type="text" placeholder="Topic" value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})} style={{ padding: '1rem', borderRadius: '0.75rem', background: 'var(--bg-primary)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', outline: 'none' }} required />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <input type="datetime-local" placeholder="Start Time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} style={{ padding: '1rem', borderRadius: '0.75rem', background: 'var(--bg-primary)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', outline: 'none', flex: 1, minWidth: '200px' }} required />
            <input type="number" placeholder="Duration (mins)" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} style={{ padding: '1rem', borderRadius: '0.75rem', background: 'var(--bg-primary)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', outline: 'none', flex: 1, minWidth: '200px' }} required />
          </div>
          <input type="url" placeholder="Meeting Link (e.g. Zoom URL)" value={formData.meetingLink} onChange={e => setFormData({...formData, meetingLink: e.target.value})} style={{ padding: '1rem', borderRadius: '0.75rem', background: 'var(--bg-primary)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', outline: 'none' }} required />
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn-action">Schedule</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-action" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}>Cancel</button>
          </div>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {classes.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No live classes scheduled.</p> : classes.map(c => (
          <div key={c._id} style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)', borderLeft: '4px solid var(--accent)', transition: 'all 0.2s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 className="dashboard-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><Video color="var(--accent)" size={20} /> {c.topic}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}><Calendar size={14} /> {new Date(c.startTime).toLocaleString()}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={14} /> {c.duration} mins</p>
              </div>
              <div>
                <span style={{ 
                  background: c.status === 'live' ? 'rgba(239, 68, 68, 0.2)' : c.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                  color: c.status === 'live' ? '#ef4444' : c.status === 'completed' ? '#10b981' : '#f59e0b',
                  border: `1px solid ${c.status === 'live' ? 'rgba(239, 68, 68, 0.3)' : c.status === 'completed' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                  padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase'
                }}>
                  {c.status}
                </span>
              </div>
            </div>
            
            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {c.status !== 'completed' && (
                <a href={c.meetingLink} target="_blank" rel="noreferrer" className="btn-action" style={{ textDecoration: 'none' }}>
                  Join Meeting
                </a>
              )}
              
              {isInstructor && c.status === 'scheduled' && (
                <button onClick={() => updateStatus(c._id, 'live')} className="btn-action" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}>Mark Live</button>
              )}
              {isInstructor && c.status === 'live' && (
                <button onClick={() => updateStatus(c._id, 'completed')} className="btn-action" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>End Class</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveClassList;
