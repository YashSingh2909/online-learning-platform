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
    const fetchMessages = async () => {
      try {
        const res = await chatAPI.getCourseMessages(courseId);
        setMessages(res.data.data);
      } catch (err) {
        console.error('Error fetching chat history:', err);
      }
    };
    fetchMessages();
  }, [courseId]);

  useEffect(() => {
    if (!socket) return;
    
    socket.emit('join_course', courseId);
    
    const handleMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };
    
    socket.on('receive_message', handleMessage);
    
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
    
    socket.emit('send_message', {
      courseId,
      senderId: user._id || user.id,
      content: input
    });
    
    setInput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '500px', border: '1px solid #ddd', borderRadius: '8px', background: '#fff' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {messages.map((msg, i) => {
          const isMe = msg.sender?._id === (user._id || user.id);
          return (
            <div key={msg._id || i} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', marginBottom: '15px' }}>
              <span style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>{isMe ? 'You' : msg.sender?.name}</span>
              <div style={{ background: isMe ? '#4F46E5' : '#F3F4F6', color: isMe ? '#fff' : '#111827', padding: '10px 15px', borderRadius: '8px', maxWidth: '70%' }}>
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} style={{ display: 'flex', padding: '15px', borderTop: '1px solid #ddd' }}>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Type your message..." 
          style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ddd', marginRight: '10px' }}
        />
        <button type="submit" style={{ background: '#4F46E5', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Send size={16} /> Send
        </button>
      </form>
    </div>
  );
};

export default CourseChat;
