import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ragAPI } from '../../api/apiService';
import { useAuth } from '../../context/AuthContext';

export default function InstructorAIAssistant() {
  const { courseId } = useParams();
  const { user } = useAuth();

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [answer, setAnswer] = useState('');

  const disabled = useMemo(() => !user || loading, [user, loading]);

  const send = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setAnswer('');

    try {
      const msg = prompt.trim();
      if (!msg) {
        setError('Enter a question for the AI assistant.');
        return;
      }

      // Backend endpoint: POST /rag/chat { courseId, message }
      const res = await ragAPI.chat(courseId, msg);
      setAnswer(res?.data?.answer || res?.data?.message || JSON.stringify(res?.data?.data || res?.data || {}));
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'AI chat failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setError('');
  }, [courseId]);

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <p className="dashboard-label">Instructor</p>
          <h1 className="dashboard-title">AI Assistant</h1>
          <p className="dashboard-desc">Ask questions about this course content.</p>
        </div>

        {error ? <div className="dashboard-error">{error}</div> : null}

        <div className="dashboard-section" style={{ marginTop: '1.25rem' }}>
          <div className="dashboard-section-header">
            <div>
              <h2 className="dashboard-section-title">Chat with your course</h2>
              <p className="dashboard-section-desc">Powered by RAG backend.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <form onSubmit={send}>
              <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Your question</label>
                <textarea
                  className="form-input"
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Create a quiz outline for this topic..."
                  disabled={disabled}
                />
              </div>

              <div className="form-actions" style={{ marginTop: '0.75rem' }}>
                <button className="btn-action" type="submit" disabled={disabled}>
                  {loading ? 'Thinking...' : 'Ask AI'}
                </button>
              </div>
            </form>

            {answer ? (
              <div className="quiz-card">
                <div className="quiz-card-desc" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                  {answer}
                </div>
              </div>
            ) : (
              <div className="dashboard-empty">
                <p className="dashboard-empty-text">No answer yet. Ask a question to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

