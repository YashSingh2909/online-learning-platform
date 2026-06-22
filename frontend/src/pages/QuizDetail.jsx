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
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      <div className="container mx-auto px-6 py-10 quiz-detail-container">
        <button
          onClick={() => navigate('/quizzes')}
          className="inline-flex items-center px-4 py-2 rounded-xl border border-white/10 hover:border-cyan-400/40 bg-white/5 hover:bg-white/10 transition mb-6"
        >
          ← Exit Quiz
        </button>

        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/70">{quiz.title}</p>
          <h1 className="text-3xl font-semibold mt-2">Question {currentQ + 1} of {quiz.questions?.length}</h1>
        </div>

        <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 shadow-xl shadow-slate-950/10">
          <p className="text-sm uppercase tracking-[0.15em] text-cyan-200/70">Question {currentQ + 1}</p>
          <p className="text-xl font-medium mt-3">{question?.question}</p>

          <div className="mt-6 flex flex-col gap-3">
            {question?.options?.map((opt, idx) => {
              const qid = question._id;
              const selectedIdx = answers[qid];
              const isSelected = selectedIdx === idx;
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => selectAnswer(qid, idx)}
                  className={`w-full text-left rounded-xl border p-4 transition ${
                    isSelected
                      ? 'border-cyan-400/60 bg-cyan-500/10'
                      : 'border-white/10 bg-white/5 hover:border-cyan-400/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center border font-semibold transition ${
                      isSelected ? 'border-cyan-400/60 bg-cyan-500 text-slate-950' : 'border-white/10 bg-white/5'
                    }`}>
                      {letters[idx]}
                    </div>
                    <div className="text-slate-100">
                      <div className="text-[15px] font-medium">{opt}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={prevQ}
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-white/10 hover:border-cyan-400/40 bg-white/5 hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentQ === 0}
          >
            ← Previous
          </button>

          <div className="flex items-center justify-center gap-2">
            {quiz.questions?.map((_, idx) => {
              const isActive = idx === currentQ;
              const isAnswered = answers[quiz.questions[idx]?._id] !== undefined;
              return (
                <div
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full cursor-pointer transition ${
                    isActive ? 'bg-cyan-400' : isAnswered ? 'bg-slate-300/60' : 'bg-slate-500/30'
                  }`}
                  onClick={() => setCurrentQ(idx)}
                />
              );
            })}
          </div>

          {currentQ === quiz.questions?.length - 1 ? (
            <button
              onClick={submitQuiz}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Quiz'}
            </button>
          ) : (
            <button
              onClick={nextQ}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl border border-white/10 hover:border-cyan-400/40 bg-white/5 hover:bg-white/10 transition"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}