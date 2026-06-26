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
      <div className="bg-slate-950 text-slate-100 min-h-screen">
        <div className="relative overflow-hidden">
          <div
            className="absolute -top-24 -right-24 w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] rounded-full blur-3xl opacity-40"
            style={{ background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))' }}
          />
          <div
            className="absolute bottom-[-20px] -left-24 w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] rounded-full blur-3xl opacity-30"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.35), rgba(6,182,212,0.25))' }}
          />
          <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10">
            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 sm:p-8">
              <p className="text-slate-300 text-sm sm:text-base">Loading quiz...</p>
            </div>
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
      <div className="bg-slate-950 text-slate-100 min-h-screen">
        <div className="relative overflow-hidden">
          <div
            className="absolute -top-24 -right-24 w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] rounded-full blur-3xl opacity-40"
            style={{ background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))' }}
          />
          <div
            className="absolute bottom-[-20px] -left-24 w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] rounded-full blur-3xl opacity-30"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.35), rgba(6,182,212,0.25))' }}
          />
          <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10">
            <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4 sm:p-6">
              <p className="text-red-200 text-sm sm:text-base">{error}</p>
            </div>
            <button
              onClick={() => navigate('/quizzes')}
              className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 rounded-xl border border-white/10 hover:border-cyan-400/40 bg-white/5 hover:bg-white/10 transition mt-4 sm:mt-6 text-sm sm:text-base"
            >
              ← Back to Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }


  if (!quiz) {
    return (
      <div className="bg-slate-950 text-slate-100 min-h-screen">
        <div className="relative overflow-hidden">
          <div
            className="absolute -top-24 -right-24 w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] rounded-full blur-3xl opacity-40"
            style={{ background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))' }}
          />
          <div
            className="absolute bottom-[-20px] -left-24 w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] rounded-full blur-3xl opacity-30"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.35), rgba(6,182,212,0.25))' }}
          />
          <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 text-center">
              <h2 className="text-lg sm:text-xl font-semibold">Quiz not found</h2>
              <button
                onClick={() => navigate('/quizzes')}
                className="inline-flex items-center justify-center px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition mt-4 sm:mt-6 text-sm sm:text-base"
              >
                Back to Quizzes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show results
  if (submitted && result) {
    return (
      <div className="bg-slate-950 text-slate-100 min-h-screen">
        <div className="relative overflow-hidden">
          <div
            className="absolute -top-24 -right-24 w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] rounded-full blur-3xl opacity-40"
            style={{ background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))' }}
          />
          <div
            className="absolute bottom-[-20px] -left-24 w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] rounded-full blur-3xl opacity-30"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.35), rgba(6,182,212,0.25))' }}
          />
          <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10">
            <div className="mb-6 sm:mb-8">
              <p className="text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] text-cyan-200/70">Quiz Complete</p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mt-1 sm:mt-2">{quiz.title}</h1>
            </div>

            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 sm:p-8 shadow-xl shadow-slate-950/10 max-w-md mx-auto">
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <path d="M22 4L12 14.01l-3-3" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-center mb-2">Quiz Completed!</h3>
              <p className="text-slate-300 text-center mb-3 sm:mb-4 text-sm sm:text-base">Your Score</p>
              <p className="text-4xl sm:text-5xl font-bold text-center text-cyan-400 mb-3 sm:mb-4">{result.percentage ?? result.score ?? 0}%</p>
              <p className="text-slate-300 text-center text-sm sm:text-base">
                {result.correct ?? 0} / {result.total ?? 0} correct
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8 justify-center">
                <button
                  onClick={() => navigate('/quizzes')}
                  className="inline-flex items-center justify-center px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl border border-white/10 hover:border-cyan-400/40 bg-white/5 hover:bg-white/10 transition font-medium text-sm sm:text-base"
                >
                  Back to Quizzes
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center justify-center px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition text-sm sm:text-base"
                >
                  Try Again
                </button>
              </div>
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
      <div className="relative overflow-hidden">
        <div
          className="absolute -top-24 -right-24 w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] rounded-full blur-3xl opacity-40"
          style={{ background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))' }}
        />
        <div
          className="absolute bottom-[-20px] -left-24 w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] rounded-full blur-3xl opacity-30"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.35), rgba(6,182,212,0.25))' }}
        />

        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10">
          <button
            onClick={() => navigate('/quizzes')}
            className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-white/10 hover:border-cyan-400/40 bg-white/5 hover:bg-white/10 transition mb-4 sm:mb-6 text-sm sm:text-base"
          >
            ← Exit Quiz
          </button>

          <div className="mb-4 sm:mb-6">
            <p className="text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] text-cyan-200/70">{quiz.title}</p>
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-semibold mt-1 sm:mt-2">Question {currentQ + 1} of {quiz.questions?.length}</h1>
          </div>

          <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 sm:p-6 shadow-xl shadow-slate-950/10">
            <p className="text-xs sm:text-sm uppercase tracking-[0.1em] sm:tracking-[0.15em] text-cyan-200/70">Question {currentQ + 1}</p>
            <p className="text-base sm:text-lg lg:text-xl font-medium mt-2 sm:mt-3">{question?.question}</p>

            <div className="mt-4 sm:mt-6 flex flex-col gap-2 sm:gap-3">
              {question?.options?.map((opt, idx) => {
                const qid = question._id;
                const selectedIdx = answers[qid];
                const isSelected = selectedIdx === idx;
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => selectAnswer(qid, idx)}
                    className={`w-full text-left rounded-xl border p-3 sm:p-4 transition ${
                      isSelected
                        ? 'border-cyan-400/60 bg-cyan-500/10'
                        : 'border-white/10 bg-white/5 hover:border-cyan-400/30'
                    }`}
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border font-semibold transition text-xs sm:text-sm ${
                        isSelected ? 'border-cyan-400/60 bg-cyan-500 text-slate-950' : 'border-white/10 bg-white/5'
                      }`}>
                        {letters[idx]}
                      </div>
                      <div className="text-slate-100 flex-1">
                        <div className="text-sm sm:text-[15px] font-medium leading-relaxed">{opt}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 sm:mt-6 flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <button
                onClick={prevQ}
                className="inline-flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2 rounded-xl border border-white/10 hover:border-cyan-400/40 bg-white/5 hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base order-2 sm:order-1"
                disabled={currentQ === 0}
              >
                ← Previous
              </button>

              {currentQ === quiz.questions?.length - 1 ? (
                <button
                  onClick={submitQuiz}
                  className="inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition disabled:opacity-60 text-sm sm:text-base order-1 sm:order-2 w-full sm:w-auto"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Quiz'}
                </button>
              ) : (
                <button
                  onClick={nextQ}
                  className="inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl border border-white/10 hover:border-cyan-400/40 bg-white/5 hover:bg-white/10 transition text-sm sm:text-base order-1 sm:order-2 w-full sm:w-auto"
                >
                  Next →
                </button>
              )}
            </div>

            <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
              {quiz.questions?.map((_, idx) => {
                const isActive = idx === currentQ;
                const isAnswered = answers[quiz.questions[idx]?._id] !== undefined;
                return (
                  <div
                    key={idx}
                    className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full cursor-pointer transition ${
                      isActive ? 'bg-cyan-400' : isAnswered ? 'bg-slate-300/60' : 'bg-slate-500/30'
                    }`}
                    onClick={() => setCurrentQ(idx)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}