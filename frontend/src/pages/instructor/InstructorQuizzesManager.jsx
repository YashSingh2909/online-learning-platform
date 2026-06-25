import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { quizAPI, courseAPI } from '../../api/apiService';

function makeEmptyQuestion() {
  return {
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
  };
}

export default function InstructorQuizzesManager() {
  const { courseId } = useParams();
  const { user } = useAuth();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [mode, setMode] = useState('create'); // create | edit
  const [editingQuizId, setEditingQuizId] = useState(null);

  const [form, setForm] = useState({
    title: '',
    questions: [makeEmptyQuestion()],
    totalPoints: 0,
    passingScore: 60,
    timeLimit: 0,
    isFreePreview: false,
    isPublished: false,
  });

  const recomputeTotalPoints = (questions) => {
    const qCount = (questions || []).length;
    return qCount * 10;
  };

  const loadQuizzes = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const res = await quizAPI.getQuizzesByCourse(courseId);
      setQuizzes(res.data.data || []);
    } catch (e) {
      setError(e?.message || 'Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuizzes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, user]);

  const resetForm = () => {
    setMode('create');
    setEditingQuizId(null);
    const questions = [makeEmptyQuestion()];
    setForm({
      title: '',
      questions,
      totalPoints: recomputeTotalPoints(questions),
      passingScore: 60,
      timeLimit: 0,
      isFreePreview: false,
      isPublished: false,
    });
  };

  const startEdit = (quiz) => {
    setMode('edit');
    setEditingQuizId(quiz._id);

    // Keep question structure compatible with QuizDetail.jsx
    const questions = (quiz.questions || []).map((q) => ({
      question: q.questionText || q.question || '',
      options: (q.options && q.options.length ? q.options : ['', '', '', '']).slice(0, 4),
      correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : parseInt(q.correctAnswer) || 0,
    }));

    setForm({
      title: quiz.title || '',
      questions,
      totalPoints: quiz.totalPoints ?? recomputeTotalPoints(questions),
      passingScore: quiz.passingScore ?? 60,
      timeLimit: quiz.timeLimit ?? 0,
      isFreePreview: !!quiz.isFreePreview,
      isPublished: !!quiz.isPublished,
    });
  };

  const updateQuestion = (idx, patch) => {
    setForm((f) => {
      const next = [...f.questions];
      next[idx] = { ...next[idx], ...patch };
      return {
        ...f,
        questions: next,
        totalPoints: f.totalPoints ? f.totalPoints : recomputeTotalPoints(next),
      };
    });
  };

  const handleChangeOption = (qIdx, optIdx, val) => {
    setForm((f) => {
      const next = [...f.questions];
      const options = [...(next[qIdx].options || ['', '', '', ''])];
      options[optIdx] = val;
      next[qIdx] = { ...next[qIdx], options };
      return {
        ...f,
        questions: next,
      };
    });
  };

  const handleSetCorrect = (qIdx, optIdx) => {
    updateQuestion(qIdx, { correctAnswer: optIdx });
  };

  const addQuestion = () => {
    setForm((f) => {
      const next = [...f.questions, makeEmptyQuestion()];
      return { ...f, questions: next, totalPoints: recomputeTotalPoints(next) };
    });
  };

  const removeQuestion = (qIdx) => {
    setForm((f) => {
      const next = f.questions.filter((_, i) => i !== qIdx);
      const safe = next.length ? next : [makeEmptyQuestion()];
      return { ...f, questions: safe, totalPoints: recomputeTotalPoints(safe) };
    });
  };

  const handleSave = async () => {
    if (!user) return;
    if (!form.title.trim()) {
      setError('Quiz title is required');
      return;
    }

    // Basic validation
    const questions = form.questions || [];
    if (questions.length === 0) {
      setError('At least 1 question is required');
      return;
    }

    for (const [i, q] of questions.entries()) {
      if (!q.question?.trim()) {
        setError(`Question ${i + 1} text is required`);
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        title: form.title,
        courseId,
        questions: questions.map((q) => ({
          questionText: q.question,
          question: q.question,
          options: (q.options || []).slice(0, 4),
          correctAnswer: String(q.correctAnswer || 0),
        })),
        totalPoints: form.totalPoints || recomputeTotalPoints(questions),
        passingScore: form.passingScore ?? 60,
        timeLimit: form.timeLimit ?? 0,
        isFreePreview: !!form.isFreePreview,
        isPublished: !!form.isPublished,
      };

      if (mode === 'create') {
        await quizAPI.createQuiz(payload);
      } else {
        await quizAPI.updateQuiz(editingQuizId, payload);
      }

      await loadQuizzes();
      resetForm();
    } catch (e) {
      setError(e?.message || 'Failed to save quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (quizId) => {
    if (!window.confirm('Delete this quiz?')) return;
    setLoading(true);
    setError('');
    try {
      await quizAPI.deleteQuiz(quizId);
      await loadQuizzes();
      if (editingQuizId === quizId) resetForm();
    } catch (e) {
      setError(e?.message || 'Failed to delete quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      <div className="relative overflow-hidden">
        <div
          className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full blur-3xl opacity-40"
          style={{ background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))' }}
        />
        <div
          className="absolute bottom-[-20px] -left-24 w-[320px] h-[320px] rounded-full blur-3xl opacity-30"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.35), rgba(6,182,212,0.25))' }}
        />

        <div className="container mx-auto px-6 py-10 relative z-10">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/70">Instructor</p>
            <h1 className="text-3xl sm:text-4xl font-semibold mt-2">Quizzes Manager</h1>
            <p className="text-slate-300 mt-2">Course: {courseId}</p>
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-6 mb-6">
              <p className="text-red-200">{error}</p>
            </div>
          ) : null}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 shadow-xl shadow-slate-950/10">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">Existing Quizzes</h2>
                    <p className="text-sm text-slate-300 mt-1">Edit, publish, or delete.</p>
                  </div>
                  <button
                    onClick={resetForm}
                    className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-white/10 hover:border-cyan-400/40 bg-white/5 hover:bg-white/10 transition text-sm font-medium"
                    type="button"
                    disabled={loading}
                  >
                    + New Quiz
                  </button>
                </div>

                {loading && quizzes.length === 0 ? (
                  <div className="rounded-xl bg-white/5 border border-white/10 p-6">
                    <p className="text-slate-300">Loading quizzes...</p>
                  </div>
                ) : quizzes.length === 0 ? (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
                    <h2 className="text-lg font-semibold">No quizzes yet</h2>
                    <p className="text-sm text-slate-300 mt-2">Create your first quiz.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {quizzes.map((q) => (
                      <div key={q._id} className="rounded-xl bg-white/5 border border-white/10 p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-base font-semibold text-white">{q.title}</h3>
                            <p className="text-xs text-slate-300 mt-1">
                              {q.isPublished ? 'Published' : q.isFreePreview ? 'Free preview' : 'Draft/Locked'}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => startEdit(q)}
                              disabled={loading}
                              className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg border border-white/10 hover:border-cyan-400/40 bg-white/5 hover:bg-white/10 transition text-xs font-medium"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(q._id)}
                              disabled={loading}
                              className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg border border-red-400/30 hover:border-red-400/50 bg-red-500/10 hover:bg-red-500/20 transition text-xs font-medium text-red-200"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 shadow-xl shadow-slate-950/10">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold">{mode === 'create' ? 'Create Quiz' : 'Edit Quiz'}</h2>
                  <p className="text-sm text-slate-300 mt-1">Build questions in the same format as QuizDetail.</p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                  }}
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-2">Quiz Title *</label>
                      <input
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition"
                        value={form.title}
                        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                        required
                        placeholder="Enter quiz title"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2">Passing Score (%)</label>
                        <input
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition"
                          type="number"
                          value={form.passingScore}
                          onChange={(e) => setForm((f) => ({ ...f, passingScore: Number(e.target.value) }))}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2">Time Limit (mins)</label>
                        <input
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition"
                          type="number"
                          value={form.timeLimit}
                          onChange={(e) => setForm((f) => ({ ...f, timeLimit: Number(e.target.value) }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2">Free Preview</label>
                        <select
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition"
                          value={form.isFreePreview ? 'yes' : 'no'}
                          onChange={(e) => setForm((f) => ({ ...f, isFreePreview: e.target.value === 'yes' }))}
                        >
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2">Published</label>
                        <select
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition"
                          value={form.isPublished ? 'yes' : 'no'}
                          onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.value === 'yes' }))}
                        >
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-2">Questions</label>
                      <div className="space-y-4">
                        {form.questions.map((q, qIdx) => (
                          <div key={qIdx} className="rounded-xl bg-white/5 border border-white/10 p-4">
                            <div className="flex items-center justify-between gap-4 mb-4">
                              <h3 className="text-base font-semibold">Question {qIdx + 1}</h3>
                              <button
                                type="button"
                                onClick={() => removeQuestion(qIdx)}
                                disabled={form.questions.length <= 1}
                                className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg border border-red-400/30 hover:border-red-400/50 bg-red-500/10 hover:bg-red-500/20 transition text-xs font-medium text-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Remove
                              </button>
                            </div>

                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-slate-200 mb-2">Question Text</label>
                                <input
                                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition"
                                  value={q.question}
                                  onChange={(e) => updateQuestion(qIdx, { question: e.target.value })}
                                  placeholder="Enter question"
                                />
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[0, 1, 2, 3].map((optIdx) => (
                                  <div key={optIdx}>
                                    <label className="block text-sm font-medium text-slate-200 mb-2">Option {String.fromCharCode(65 + optIdx)}</label>
                                    <input
                                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition"
                                      value={q.options[optIdx]}
                                      onChange={(e) => handleChangeOption(qIdx, optIdx, e.target.value)}
                                      placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                                    />
                                    <div className="mt-2">
                                      <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                                        <input
                                          type="radio"
                                          name={`correct-${qIdx}`}
                                          checked={q.correctAnswer === optIdx}
                                          onChange={() => handleSetCorrect(qIdx, optIdx)}
                                          className="w-4 h-4 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-500/50"
                                        />
                                        Correct answer
                                      </label>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={addQuestion}
                          disabled={loading}
                          className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-white/10 hover:border-cyan-400/40 bg-white/5 hover:bg-white/10 transition text-sm font-medium"
                        >
                          + Add Question
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={resetForm}
                      disabled={loading}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-white/10 hover:border-cyan-400/40 bg-white/5 hover:bg-white/10 transition text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition text-sm disabled:opacity-60"
                    >
                      {loading ? 'Saving...' : mode === 'create' ? 'Create Quiz' : 'Update Quiz'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


