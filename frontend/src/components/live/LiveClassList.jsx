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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Live Classes</h2>
        {isInstructor && (
          <button onClick={() => setShowForm(!showForm)} style={{ background: '#4F46E5', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Plus size={16} /> Schedule Class
          </button>
        )}
      </div>

      {showForm && isInstructor && (
        <form onSubmit={handleSubmit} style={{ background: '#F9FAFB', padding: '20px', borderRadius: '8px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="text" placeholder="Topic" value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} required />
          <div style={{ display: 'flex', gap: '15px' }}>
            <input type="datetime-local" placeholder="Start Time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd', flex: 1 }} required />
            <input type="number" placeholder="Duration (mins)" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd', flex: 1 }} required />
          </div>
          <input type="url" placeholder="Meeting Link (e.g. Zoom URL)" value={formData.meetingLink} onChange={e => setFormData({...formData, meetingLink: e.target.value})} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} required />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" style={{ background: '#4F46E5', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Schedule</button>
            <button type="button" onClick={() => setShowForm(false)} style={{ background: 'transparent', border: '1px solid #ddd', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {classes.length === 0 ? <p>No live classes scheduled.</p> : classes.map(c => (
          <div key={c._id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '20px', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}><Video color="#4F46E5" /> {c.topic}</h3>
                <p style={{ margin: '0 0 5px 0', color: '#666', display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} /> {new Date(c.startTime).toLocaleString()}</p>
                <p style={{ margin: '0', color: '#666', display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={14} /> {c.duration} mins</p>
              </div>
              <div>
                <span style={{ 
                  background: c.status === 'live' ? '#DC2626' : c.status === 'completed' ? '#10B981' : '#F59E0B',
                  color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold'
                }}>
                  {c.status.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
              {c.status !== 'completed' && (
                <a href={c.meetingLink} target="_blank" rel="noreferrer" style={{ display: 'inline-block', background: '#4F46E5', color: '#fff', textDecoration: 'none', padding: '8px 16px', borderRadius: '4px', fontSize: '14px' }}>
                  Join Meeting
                </a>
              )}
              
              {isInstructor && c.status === 'scheduled' && (
                <button onClick={() => updateStatus(c._id, 'live')} style={{ background: '#DC2626', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>Mark Live</button>
              )}
              {isInstructor && c.status === 'live' && (
                <button onClick={() => updateStatus(c._id, 'completed')} style={{ background: '#10B981', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>End Class</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveClassList;
