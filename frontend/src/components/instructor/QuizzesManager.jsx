import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { quizAPI } from '../../api/apiService';

const blankQuestion = { questionText: '', options: ['', '', '', ''], correctAnswer: '0' };

export default function QuizzesManager() {
  const { courseId } = useParams();
  const [quizzes, setQuizzes] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', passingScore: 70, isPublished: true, questions: [blankQuestion] });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const loadQuizzes = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await quizAPI.getCourseQuizzes(courseId);
      setQuizzes(res?.data?.data || []);
    } catch (err) {
      setError(err?.message || 'Could not load quizzes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, [courseId]);

  const setQuestion = (index, patch) => {
    setForm((current) => ({
      ...current,
      questions: current.questions.map((question, i) => (i === index ? { ...question, ...patch } : question)),
    }));
  };

  const submitQuiz = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');

    try {
      const questions = form.questions.map((question) => ({
        questionText: question.questionText,
        question: question.questionText,
        questionType: 'mcq',
        options: question.options.filter(Boolean),
        correctAnswer: String(question.correctAnswer),
      }));

      const payload = {
        title: form.title,
        description: form.description,
        courseId,
        questions,
        totalPoints: questions.length * 10,
        passingScore: Number(form.passingScore),
        isPublished: !!form.isPublished,
      };

      if (editingId) {
        await quizAPI.updateQuiz(editingId, payload);
        setNotice('Quiz updated.');
      } else {
        await quizAPI.createCourseQuiz(courseId, payload);
        setNotice('Quiz created.');
      }

      setEditingId(null);
      setForm({ title: '', description: '', passingScore: 70, isPublished: true, questions: [blankQuestion] });
      await loadQuizzes();
    } catch (err) {
      setError(err?.message || 'Could not save quiz.');
    } finally {
      setSaving(false);
    }
  };

  const editQuiz = async (quizId) => {
    setError('');
    try {
      const res = await quizAPI.getQuizById(quizId);
      const quiz = res?.data?.data;
      setEditingId(quiz._id);
      setForm({
        title: quiz.title || '',
        description: quiz.description || '',
        passingScore: quiz.passingScore || 70,
        isPublished: quiz.isPublished !== false,
        questions: (quiz.questions || []).map((question) => ({
          questionText: question.questionText || question.question || '',
          options: question.options?.length ? question.options : ['', '', '', ''],
          correctAnswer: String(question.correctAnswer ?? '0'),
        })),
      });
    } catch (err) {
      setError(err?.message || 'Could not open quiz.');
    }
  };

  const deleteQuiz = async (quizId) => {
    if (!window.confirm('Delete this quiz?')) return;
    try {
      await quizAPI.deleteQuiz(quizId);
      setNotice('Quiz deleted.');
      await loadQuizzes();
    } catch (err) {
      setError(err?.message || 'Could not delete quiz.');
    }
  };

  return (
    <div className="dashboard-grid instructor-two-column">
      <div className="dashboard-section" style={{ marginTop: 0 }}>
        <div className="dashboard-section-header">
          <div>
            <h2 className="dashboard-section-title">{editingId ? 'Edit Quiz' : 'Create Quiz'}</h2>
            <p className="dashboard-section-desc">Multiple choice questions with auto-grading.</p>
          </div>
        </div>

        <form onSubmit={submitQuiz}>
          <div className="form-grid">
            <div className="form-field" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Quiz title *</label>
              <input required className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="form-field" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Description</label>
              <textarea rows={3} className="form-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="form-field">
              <label className="form-label">Passing score (%)</label>
              <input type="number" min="0" max="100" className="form-input" value={form.passingScore} onChange={(e) => setForm({ ...form, passingScore: e.target.value })} />
            </div>
            <div className="form-field">
              <label className="form-label">Published</label>
              <select className="form-input" value={form.isPublished ? 'yes' : 'no'} onChange={(e) => setForm({ ...form, isPublished: e.target.value === 'yes' })}>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
            {form.questions.map((question, index) => (
              <div key={index} className="quiz-card">
                <h3 className="quiz-card-title">Question {index + 1}</h3>
                <div className="form-grid" style={{ marginTop: '0.75rem' }}>
                  <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Question</label>
                    <input required className="form-input" value={question.questionText} onChange={(e) => setQuestion(index, { questionText: e.target.value })} />
                  </div>
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="form-field">
                      <label className="form-label">Option {optionIndex + 1}</label>
                      <input
                        required
                        className="form-input"
                        value={option}
                        onChange={(e) => {
                          const options = [...question.options];
                          options[optionIndex] = e.target.value;
                          setQuestion(index, { options });
                        }}
                      />
                    </div>
                  ))}
                  <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Correct answer</label>
                    <select className="form-input" value={question.correctAnswer} onChange={(e) => setQuestion(index, { correctAnswer: e.target.value })}>
                      {question.options.map((_, optionIndex) => (
                        <option key={optionIndex} value={String(optionIndex)}>Option {optionIndex + 1}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-outline-alt" onClick={() => setForm({ ...form, questions: [...form.questions, blankQuestion] })}>
              Add question
            </button>
            <button type="submit" className="btn-action" disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update Quiz' : 'Create Quiz'}
            </button>
          </div>
        </form>
      </div>

      <div className="dashboard-section" style={{ marginTop: 0 }}>
        <div className="dashboard-section-header">
          <div>
            <h2 className="dashboard-section-title">Quizzes</h2>
            <p className="dashboard-section-desc">Edit or delete course quizzes.</p>
          </div>
        </div>

        {notice && <div className="dashboard-section" style={{ borderColor: 'rgba(34, 211, 238, 0.35)', marginBottom: '1rem' }}>{notice}</div>}
        {error && <div className="dashboard-error" style={{ marginBottom: '1rem' }}>{error}</div>}

        {loading ? (
          <div className="dashboard-loading"><p className="loading-text">Loading quizzes...</p></div>
        ) : quizzes.length === 0 ? (
          <div className="dashboard-empty"><p className="dashboard-empty-text">No quizzes yet.</p></div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="quiz-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <div>
                    <h3 className="quiz-card-title">{quiz.title}</h3>
                    <p className="quiz-card-desc">Passing score: {quiz.passingScore}%</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button type="button" className="btn-outline-alt" onClick={() => editQuiz(quiz._id)}>Edit</button>
                    <button type="button" className="btn-outline-alt" onClick={() => deleteQuiz(quiz._id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
