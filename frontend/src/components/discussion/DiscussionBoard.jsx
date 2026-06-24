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
      <div>
        <button onClick={() => setActiveDiscussion(null)} style={{ background: 'none', border: 'none', color: '#4F46E5', cursor: 'pointer', marginBottom: '20px' }}>&larr; Back to discussions</button>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #eee', marginBottom: '20px' }}>
          <h2>{activeDiscussion.title}</h2>
          <p style={{ color: '#666', fontSize: '14px' }}>Posted by {activeDiscussion.author?.name}</p>
          <p style={{ marginTop: '15px' }}>{activeDiscussion.content}</p>
        </div>

        <h3>Replies</h3>
        {replies.length === 0 ? <p>No replies yet.</p> : replies.map(r => (
          <div key={r._id} style={{ display: 'flex', gap: '15px', marginBottom: '15px', background: '#F9FAFB', padding: '15px', borderRadius: '8px' }}>
            <CornerDownRight size={20} color="#9CA3AF" />
            <div>
              <p style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: 'bold' }}>{r.author?.name}</p>
              <p style={{ margin: 0 }}>{r.content}</p>
            </div>
          </div>
        ))}

        <form onSubmit={handleAddReply} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <textarea 
            rows="3" 
            placeholder="Write a reply..." 
            value={replyContent} 
            onChange={(e) => setReplyContent(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          <button type="submit" style={{ alignSelf: 'flex-start', background: '#4F46E5', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Reply</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Course Discussions</h2>
        <button onClick={() => setShowNewPost(!showNewPost)} style={{ background: '#4F46E5', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Plus size={16} /> New Post
        </button>
      </div>

      {showNewPost && (
        <form onSubmit={handleCreatePost} style={{ background: '#F9FAFB', padding: '20px', borderRadius: '8px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} required />
          <textarea rows="4" placeholder="What do you want to discuss?" value={content} onChange={e => setContent(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} required />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" style={{ background: '#4F46E5', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Post</button>
            <button type="button" onClick={() => setShowNewPost(false)} style={{ background: 'transparent', border: '1px solid #ddd', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {discussions.length === 0 ? <p>No discussions yet. Be the first to post!</p> : discussions.map(d => (
          <div key={d._id} onClick={() => loadReplies(d)} style={{ background: '#fff', border: '1px solid #eee', padding: '15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '15px', transition: 'all 0.2s' }}>
            <MessageSquare color="#4F46E5" />
            <div>
              <h3 style={{ margin: '0 0 5px 0' }}>{d.title}</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>By {d.author?.name} • {new Date(d.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscussionBoard;
