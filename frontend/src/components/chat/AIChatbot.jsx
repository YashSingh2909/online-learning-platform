import React, { useState, useRef, useEffect } from 'react';
import { ragAPI } from '../../api/apiService';
import { Send, Bot, User, Sparkles } from 'lucide-react';

const AIChatbot = ({ courseId, courseTitle }) => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: `Hello! I'm your AI Teaching Assistant for "${courseTitle}". Ask me anything about the course material! ✨` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await ragAPI.chat(courseId, userMsg);
      setMessages(prev => [...prev, { role: 'ai', content: res.data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '500px', background: 'var(--bg-card)', borderRadius: '1rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: 'linear-gradient(to bottom right, var(--accent), #a855f7)', color: '#fff' }}>
          <Sparkles size={18} />
        </div>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>AI Course Assistant</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>Powered by Gemini</p>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', gap: '1rem', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2rem', height: '2rem', borderRadius: '9999px', flexShrink: 0,
              background: msg.role === 'user' ? 'rgba(255,255,255,0.1)' : 'rgba(79, 70, 229, 0.1)',
              color: msg.role === 'user' ? 'var(--text-secondary)' : 'var(--accent)'
            }}>
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div style={{ 
              padding: '1rem', 
              borderRadius: '1rem', 
              borderTopRightRadius: msg.role === 'user' ? '0.25rem' : '1rem',
              borderTopLeftRadius: msg.role === 'ai' ? '0.25rem' : '1rem',
              maxWidth: '85%', 
              background: msg.role === 'user' ? 'var(--accent)' : 'rgba(255,255,255,0.05)', 
              color: msg.role === 'user' ? '#fff' : 'var(--text-primary)', 
              border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.1)',
              lineHeight: '1.5',
              fontSize: '0.9375rem',
              whiteSpace: 'pre-wrap'
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2rem', height: '2rem', borderRadius: '9999px', flexShrink: 0, background: 'rgba(79, 70, 229, 0.1)', color: 'var(--accent)' }}>
              <Bot size={14} />
            </div>
            <div style={{ padding: '1rem', borderRadius: '1rem', borderTopLeftRadius: '0.25rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center', height: '1.5rem' }}>
                <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} style={{ display: 'flex', padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Ask something about the course..." 
          disabled={loading}
          style={{ flex: 1, marginRight: '0.75rem', padding: '0.75rem 1.25rem', borderRadius: '2rem', background: 'var(--bg-primary)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', outline: 'none' }}
        />
        <button type="submit" disabled={loading || !input.trim()} className="btn-action" style={{ borderRadius: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', opacity: loading || !input.trim() ? 0.5 : 1 }}>
          <Send size={16} /> Ask
        </button>
      </form>
    </div>
  );
};

export default AIChatbot;
