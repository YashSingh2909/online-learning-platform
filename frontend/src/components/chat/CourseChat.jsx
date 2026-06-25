import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../context/SocketContext';
import { chatAPI } from '../../api/apiService';
import { useAuth } from '../../context/AuthContext';
import { Send } from 'lucide-react';

const CourseChat = ({ courseId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socket = useSocket();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!courseId) {
      console.warn('[CourseChat] fetchMessages skipped: courseId is falsy:', courseId);
      return;
    }

    const fetchMessages = async () => {
      try {
        console.log('[CourseChat] fetchMessages for courseId:', courseId);
        const res = await chatAPI.getCourseMessages(courseId);
        const data = res?.data?.data || [];
        console.log('[CourseChat] fetched messages count:', data.length);
        if (data[0]?._id) console.log('[CourseChat] first message id:', data[0]._id);
        setMessages(data);
      } catch (err) {
        console.error('[CourseChat] Error fetching chat history:', err);
      }
    };

    fetchMessages();
  }, [courseId]);





  useEffect(() => {
    if (!socket) return;

    // Always ensure we join and then refresh history once the socket is ready.
    socket.emit('join_course', courseId);

    const handleMessage = (message) => {
      setMessages((prev) => {
        // de-dupe by _id
        const exists = prev.some((m) => m._id && message?._id && String(m._id) === String(message._id));
        if (exists) return prev;
        return [...prev, message];
      });
    };

    socket.on('receive_message', handleMessage);

    // Re-fetch on mount/refresh so chat history always renders correctly.
    (async () => {
      try {
        const res = await chatAPI.getCourseMessages(courseId);
        setMessages(res.data.data || []);
      } catch (e) {
        console.error('Error fetching chat history on socket join:', e);
      }
    })();

    return () => {
      socket.off('receive_message', handleMessage);
    };
  }, [socket, courseId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;

    if (!socket.connected) {
      console.warn('Socket not connected yet; message not sent');
      return;
    }

    console.log('Emitting send_message', {
      courseId,
      senderId: user?._id || user?.id,
      content: input,
    });

    socket.emit('send_message', {
      courseId,
      senderId: user?._id || user?.id,
      content: input,
    });

    setInput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '500px', background: 'var(--bg-card)', borderRadius: '1rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map((msg, i) => {
          const isMe = msg.sender?._id === (user._id || user.id);
          return (
            <div key={msg._id || i} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', padding: '0 0.25rem' }}>{isMe ? 'You' : msg.sender?.name}</span>
              <div style={{ 
                padding: '0.75rem 1rem', 
                borderRadius: '1rem', 
                borderTopRightRadius: isMe ? '0.25rem' : '1rem',
                borderTopLeftRadius: !isMe ? '0.25rem' : '1rem',
                maxWidth: '75%', 
                background: isMe ? 'var(--accent)' : 'rgba(255,255,255,0.05)', 
                color: isMe ? '#fff' : 'var(--text-primary)', 
                border: isMe ? 'none' : '1px solid rgba(255,255,255,0.1)' 
              }}>
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} style={{ display: 'flex', padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Type your message..." 
          style={{ flex: 1, marginRight: '0.75rem', padding: '0.75rem 1.25rem', borderRadius: '2rem', background: 'var(--bg-primary)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', outline: 'none' }}
        />
        <button type="submit" className="btn-action" style={{ borderRadius: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}>
          <Send size={16} /> Send
        </button>
      </form>
    </div>
  );
};

export default CourseChat;
