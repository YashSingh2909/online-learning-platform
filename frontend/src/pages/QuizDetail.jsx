import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { quizAPI } from '../api/apiService';
import LockedContent from '../components/LockedContent';

export default function QuizDetail() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setLoading(true);
      setError('');
      try {
        const res = await quizAPI.getQuizById(quizId);
        setQuiz(res.data.data);
      } catch (e) {
        const status = e?.status ?? e?.response?.status;
        if (status === 403) {
          setError('LOCKED');
        } else {
          setError(e?.message || 'Failed to load quiz');
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [quizId, user]);




  const selectAnswer = (questionId, optionIndex) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };


  const nextQ = () => {
    if (currentQ < (quiz?.questions?.length || 0) - 1) {
      setCurrentQ(currentQ + 1);
    }
  };

  const prevQ = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
    }
  };

  const submitQuiz = async () => {
    setLoading(true);
    try {
      const res = await quizAPI.submitQuiz(quizId, { answers });
      setResult(res.data.data);
      setSubmitted(true);
    } catch (e) {
      setError(e?.message || 'Failed to submit quiz');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !quiz) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-bg">
          <div className="dashboard-orb dashboard-orb-1"></div>
          <div className="dashboard-orb dashboard-orb-2"></div>
        </div>
        <div className="dashboard-container">
          <div className="dashboard-loading">
            <p className="loading-text">Loading quiz...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    if (error === 'LOCKED') {
      return (
        <LockedContent
          title="Quiz locked"
          description="Enroll to access this quiz."
          ctaLabel="Enroll to access"
          ctaTo="/courses"
        />
      );
    }

    return (
      <div className="dashboard-page">
        <div className="dashboard-bg">
          <div className="dashboard-orb dashboard-orb-1"></div>
          <div className="dashboard-orb dashboard-orb-2"></div>
        </div>
        <div className="dashboard-container">
          <div className="dashboard-error">
            <p>{error}</p>
          </div>
          <button onClick={() => navigate('/quizzes')} className="btn-outline-alt" style={{ marginTop: '1rem' }}>
            ← Back to Quizzes
          </button>
        </div>
      </div>
    );
  }


  if (!quiz) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-bg">
          <div className="dashboard-orb dashboard-orb-1"></div>
          <div className="dashboard-orb dashboard-orb-2"></div>
        </div>
        <div className="dashboard-container">
          <div className="dashboard-empty">
            <h2 className="dashboard-empty-title">Quiz not found</h2>
            <button onClick={() => navigate('/quizzes')} className="btn-action" style={{ marginTop: '1rem' }}>
              Back to Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show results
  if (submitted && result) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-bg">
          <div className="dashboard-orb dashboard-orb-1"></div>
          <div className="dashboard-orb dashboard-orb-2"></div>
        </div>
        <div className="dashboard-container">
          <div className="dashboard-header">
            <p className="dashboard-label">Quiz Complete</p>
            <h1 className="dashboard-title">{quiz.title}</h1>
          </div>

          <div className="cert-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div className="cert-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 28, height: 28 }}>
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <path d="M22 4L12 14.01l-3-3" />
              </svg>
            </div>
            <h3 className="cert-title">Quiz Completed!</h3>
            <p className="cert-course">Your Score</p>
            <p className="stat-value" style={{ fontSize: '3rem', marginTop: '0.5rem' }}>{result.score || 0}%</p>
            <p className="cert-date">
              {result.correct || 0} / {result.total || 0} correct
            </p>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={() => navigate('/quizzes')} className="btn-outline-alt">
                Back to Quizzes
              </button>
              <button onClick={() => window.location.reload()} className="btn-action">
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions?.[currentQ];
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="dashboard-page">
      <div className="dashboard-bg">
        <div className="dashboard-orb dashboard-orb-1"></div>
        <div className="dashboard-orb dashboard-orb-2"></div>
      </div>

      <div className="dashboard-container quiz-detail-container">
        <button onClick={() => navigate('/quizzes')} className="btn-outline-alt" style={{ marginBottom: '1.5rem' }}>
          ← Exit Quiz
        </button>

        <div className="dashboard-header">
          <p className="dashboard-label">{quiz.title}</p>
          <h1 className="dashboard-title">Question {currentQ + 1} of {quiz.questions?.length}</h1>
        </div>

        <div className="quiz-question">
          <p className="quiz-question-num">
            Question {currentQ + 1}
          </p>
          <p className="quiz-question-text">{question?.question}</p>

          <div className="quiz-options">
            {question?.options?.map((opt, idx) => (
              <div
                key={idx}
                className={`quiz-option ${answers[question._id] === idx ? 'selected' : ''}`}
                onClick={() => selectAnswer(question._id, idx)}
              >
                <div className="quiz-option-marker">{letters[idx]}</div>
                <span className="quiz-option-text">{opt}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="quiz-nav">
          <button onClick={prevQ} className="btn-outline-alt" disabled={currentQ === 0}>
            ← Previous
          </button>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {quiz.questions?.map((_, idx) => (
              <div
                key={idx}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: idx === currentQ ? 'var(--accent)' : (answers[quiz.questions[idx]?._id] !== undefined ? 'var(--border-hover)' : 'var(--border)'),
                  cursor: 'pointer',
                }}
                onClick={() => setCurrentQ(idx)}
              />
            ))}
          </div>
          {currentQ === quiz.questions?.length - 1 ? (
            <button onClick={submitQuiz} className="btn-action" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Quiz'}
            </button>
          ) : (
            <button onClick={nextQ} className="btn-outline-alt">
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}