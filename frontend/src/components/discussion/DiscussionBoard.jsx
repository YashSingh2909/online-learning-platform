import React, { useState, useEffect } from 'react';
import { discussionAPI } from '../../api/apiService';
import { MessageSquare, Plus, CornerDownRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DiscussionBoard = ({ courseId }) => {
  const [discussions, setDiscussions] = useState([]);
  const [showNewPost, setShowNewPost] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [activeDiscussion, setActiveDiscussion] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyContent, setReplyContent] = useState('');

  const fetchDiscussions = async () => {
    try {
      const res = await discussionAPI.getDiscussions(courseId);
      setDiscussions(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, [courseId]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!title || !content) return;
    try {
      await discussionAPI.createDiscussion(courseId, { title, content });
      setTitle('');
      setContent('');
      setShowNewPost(false);
      fetchDiscussions();
    } catch (err) {
      console.error(err);
    }
  };

  const loadReplies = async (discussion) => {
    setActiveDiscussion(discussion);
    try {
      const res = await discussionAPI.getDiscussionReplies(courseId, discussion._id);
      setReplies(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddReply = async (e) => {
    e.preventDefault();
    if (!replyContent) return;
    try {
      await discussionAPI.addReply(courseId, activeDiscussion._id, { content: replyContent });
      setReplyContent('');
      loadReplies(activeDiscussion);
    } catch (err) {
      console.error(err);
    }
  };

  if (activeDiscussion) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <button onClick={() => setActiveDiscussion(null)} className="btn-action" style={{ alignSelf: 'flex-start', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)' }}>
          &larr; Back to discussions
        </button>
        <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h2 className="dashboard-section-title">{activeDiscussion.title}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Posted by {activeDiscussion.author?.name}</p>
          <p style={{ color: 'var(--text-primary)', marginTop: '1rem', lineHeight: '1.6' }}>{activeDiscussion.content}</p>
        </div>

        <h3 className="dashboard-section-title" style={{ marginTop: '1rem' }}>Replies</h3>
        {replies.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No replies yet.</p> : replies.map(r => (
          <div key={r._id} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <CornerDownRight color="var(--text-secondary)" size={20} />
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{r.author?.name}</p>
              <p style={{ color: 'var(--text-secondary)' }}>{r.content}</p>
            </div>
          </div>
        ))}

        <form onSubmit={handleAddReply} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <textarea 
            rows="3" 
            placeholder="Write a reply..." 
            value={replyContent} 
            onChange={(e) => setReplyContent(e.target.value)}
            style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', background: 'var(--bg-primary)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', outline: 'none' }}
          />
          <button type="submit" className="btn-action" style={{ alignSelf: 'flex-start' }}>Reply</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="dashboard-section-title">Course Discussions</h2>
        <button onClick={() => setShowNewPost(!showNewPost)} className="btn-action" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} /> New Post
        </button>
      </div>

      {showNewPost && (
        <form onSubmit={handleCreatePost} style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
          <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} style={{ padding: '1rem', borderRadius: '0.75rem', background: 'var(--bg-primary)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', outline: 'none' }} required />
          <textarea rows="4" placeholder="What do you want to discuss?" value={content} onChange={e => setContent(e.target.value)} style={{ padding: '1rem', borderRadius: '0.75rem', background: 'var(--bg-primary)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', outline: 'none' }} required />
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn-action">Post</button>
            <button type="button" onClick={() => setShowNewPost(false)} className="btn-action" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}>Cancel</button>
          </div>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {discussions.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No discussions yet. Be the first to post!</p> : discussions.map(d => (
          <div key={d._id} onClick={() => loadReplies(d)} style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '1rem', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.2s' }}>
            <MessageSquare color="var(--accent)" style={{ marginTop: '0.25rem' }} />
            <div>
              <h3 style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{d.title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>By {d.author?.name} • {new Date(d.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscussionBoard;
