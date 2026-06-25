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
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <p className="dashboard-label">Instructor</p>
          <h1 className="dashboard-title">Quizzes Manager</h1>
          <p className="dashboard-desc">Course: {courseId}</p>
        </div>

        {error ? (
          <div className="dashboard-error" style={{ marginTop: '1rem' }}>{error}</div>
        ) : null}

        <div className="dashboard-grid" style={{ gridTemplateColumns: '1.1fr 0.9fr', gap: '1.5rem' }}>
          <div>
            <div className="dashboard-section" style={{ marginTop: '0' }}>
              <div className="dashboard-section-header">
                <div>
                  <h2 className="dashboard-section-title">Existing Quizzes</h2>
                  <p className="dashboard-section-desc">Edit, publish, or delete.</p>
                </div>
                <button className="btn-outline-alt" onClick={resetForm} type="button" disabled={loading}>
                  + New Quiz
                </button>
              </div>

              {loading && quizzes.length === 0 ? (
                <div className="dashboard-loading"><p className="loading-text">Loading quizzes...</p></div>
              ) : quizzes.length === 0 ? (
                <div className="dashboard-empty" style={{ marginTop: '1rem' }}>
                  <h2 className="dashboard-empty-title">No quizzes yet</h2>
                  <p className="dashboard-empty-text">Create your first quiz.</p>
                </div>
              ) : (
                <div className="space-y-3" style={{ marginTop: '1rem' }}>
                  {quizzes.map((q) => (
                    <div key={q._id} className="quiz-card">
                      <div className="quiz-card-header" style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                        <div>
                          <h3 className="quiz-card-title">{q.title}</h3>
                          <p className="quiz-card-desc">{q.isPublished ? 'Published' : (q.isFreePreview ? 'Free preview' : 'Draft/Locked')}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <button className="btn-outline-alt" type="button" onClick={() => startEdit(q)} disabled={loading}>Edit</button>
                          <button className="btn-outline-alt" type="button" onClick={() => handleDelete(q._id)} disabled={loading}>Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="dashboard-section" style={{ marginTop: '0' }}>
              <div className="dashboard-section-header">
                <div>
                  <h2 className="dashboard-section-title">{mode === 'create' ? 'Create Quiz' : 'Edit Quiz'}</h2>
                  <p className="dashboard-section-desc">Build questions in the same format as QuizDetail.</p>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
                style={{ marginTop: '1rem' }}
              >
                <div className="form-grid">
                  <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Quiz Title *</label>
                    <input
                      className="form-input"
                      value={form.title}
                      onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label">Passing Score (%)</label>
                    <input
                      className="form-input"
                      type="number"
                      value={form.passingScore}
                      onChange={(e) => setForm((f) => ({ ...f, passingScore: Number(e.target.value) }))}
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label">Time Limit (mins)</label>
                    <input
                      className="form-input"
                      type="number"
                      value={form.timeLimit}
                      onChange={(e) => setForm((f) => ({ ...f, timeLimit: Number(e.target.value) }))}
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label">Free Preview</label>
                    <select
                      className="form-input"
                      value={form.isFreePreview ? 'yes' : 'no'}
                      onChange={(e) => setForm((f) => ({ ...f, isFreePreview: e.target.value === 'yes' }))}
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="form-label">Published</label>
                    <select
                      className="form-input"
                      value={form.isPublished ? 'yes' : 'no'}
                      onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.value === 'yes' }))}
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>

                  <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Questions</label>
                    <div className="space-y-4">
                      {form.questions.map((q, qIdx) => (
                        <div key={qIdx} className="quiz-card" style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                            <h3 className="quiz-card-title">Question {qIdx + 1}</h3>
                            <button
                              className="btn-outline-alt"
                              type="button"
                              onClick={() => removeQuestion(qIdx)}
                              disabled={form.questions.length <= 1}
                            >
                              Remove
                            </button>
                          </div>

                          <div className="form-grid" style={{ marginTop: '0.75rem' }}>
                            <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                              <label className="form-label">Question Text</label>
                              <input
                                className="form-input"
                                value={q.question}
                                onChange={(e) => updateQuestion(qIdx, { question: e.target.value })}
                              />
                            </div>

                            {[0, 1, 2, 3].map((optIdx) => (
                              <div key={optIdx} className="form-field">
                                <label className="form-label">Option {String.fromCharCode(65 + optIdx)}</label>
                                <input
                                  className="form-input"
                                  value={q.options[optIdx]}
                                  onChange={(e) => handleChangeOption(qIdx, optIdx, e.target.value)}
                                />
                                <div style={{ marginTop: '0.5rem' }}>
                                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                    <input
                                      type="radio"
                                      name={`correct-${qIdx}`}
                                      checked={q.correctAnswer === optIdx}
                                      onChange={() => handleSetCorrect(qIdx, optIdx)}
                                    />
                                    Correct
                                  </label>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      <button className="btn-outline-alt" type="button" onClick={addQuestion} disabled={loading}>
                        + Add Question
                      </button>
                    </div>
                  </div>
                </div>

                <div className="form-actions" style={{ marginTop: '1rem' }}>
                  <button className="btn-outline-alt" type="button" onClick={resetForm} disabled={loading}>
                    Cancel
                  </button>
                  <button className="btn-action" type="submit" disabled={loading}>
                    {loading ? 'Saving...' : (mode === 'create' ? 'Create Quiz' : 'Update Quiz')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


