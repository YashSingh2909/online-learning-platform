import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { courseAPI, uploadAPI } from '../../api/apiService';

const emptyLesson = { title: '', description: '', duration: '', videoUrl: '', order: 0, isFreePreview: false };

export default function LessonsManager() {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [form, setForm] = useState(emptyLesson);
  const [videoFile, setVideoFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadLessons = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await courseAPI.getLessons(courseId);
      setLessons((res?.data?.data || []).sort((a, b) => (a.order || 0) - (b.order || 0)));
    } catch (err) {
      setError(err?.message || 'Could not load lessons.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLessons();
  }, [courseId]);

  const resetForm = () => {
    setForm(emptyLesson);
    setVideoFile(null);
    setEditingId(null);
  };

  const submitLesson = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      let videoUrl = form.videoUrl || '';
      if (videoFile) {
        const upload = await uploadAPI.uploadLessonVideo(videoFile);
        videoUrl = upload?.data?.data?.url || videoUrl;
      }

      const payload = {
        ...form,
        videoUrl,
        order: editingId ? Number(form.order) || 1 : lessons.length + 1,
      };

      if (editingId) {
        await courseAPI.updateLesson(courseId, editingId, payload);
        setMessage('Lesson updated.');
      } else {
        await courseAPI.addLesson(courseId, payload);
        setMessage('Lesson added.');
      }

      resetForm();
      await loadLessons();
    } catch (err) {
      setError(err?.message || 'Could not save lesson.');
    } finally {
      setSaving(false);
    }
  };

  const editLesson = (lesson) => {
    setEditingId(lesson._id);
    setForm({
      title: lesson.title || '',
      description: lesson.description || '',
      duration: lesson.duration || '',
      videoUrl: lesson.videoUrl || '',
      order: lesson.order || 1,
      isFreePreview: !!(lesson.isFreePreview || lesson.isFree),
    });
  };

  const deleteLesson = async (lessonId) => {
    if (!window.confirm('Delete this lesson?')) return;
    setError('');
    try {
      await courseAPI.deleteLesson(courseId, lessonId);
      setMessage('Lesson deleted.');
      await loadLessons();
    } catch (err) {
      setError(err?.message || 'Could not delete lesson.');
    }
  };

  const moveLesson = async (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= lessons.length) return;
    const nextLessons = [...lessons];
    [nextLessons[index], nextLessons[nextIndex]] = [nextLessons[nextIndex], nextLessons[index]];
    setLessons(nextLessons);
    try {
      await courseAPI.reorderLessons(courseId, nextLessons.map((lesson) => lesson._id));
      setMessage('Lesson order saved.');
      await loadLessons();
    } catch (err) {
      setError(err?.message || 'Could not reorder lessons.');
      await loadLessons();
    }
  };

  return (
    <div className="dashboard-grid instructor-two-column">
      <div className="dashboard-section" style={{ marginTop: 0 }}>
        <div className="dashboard-section-header">
          <div>
            <h2 className="dashboard-section-title">{editingId ? 'Edit Lesson' : 'Add Lesson'}</h2>
            <p className="dashboard-section-desc">Upload video and lesson metadata.</p>
          </div>
        </div>

        <form onSubmit={submitLesson}>
          <div className="form-grid">
            <div className="form-field" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Lesson title *</label>
              <input required className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="form-field" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Description</label>
              <textarea rows={3} className="form-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="form-field">
              <label className="form-label">Duration</label>
              <input className="form-input" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
            </div>
            {editingId && (
              <div className="form-field">
                <label className="form-label">Order</label>
                <input type="number" className="form-input" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
              </div>
            )}
            <div className="form-field" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Video file</label>
              <input type="file" accept="video/*" className="form-input" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />
            </div>
            {form.videoUrl && (
              <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Video URL</label>
                <input className="form-input" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} />
              </div>
            )}
            <div className="form-field">
              <label className="form-label">Free preview</label>
              <select className="form-input" value={form.isFreePreview ? 'yes' : 'no'} onChange={(e) => setForm({ ...form, isFreePreview: e.target.value === 'yes' })}>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            {editingId && <button type="button" className="btn-outline-alt" onClick={resetForm}>Cancel</button>}
            <button type="submit" className="btn-action" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update Lesson' : 'Add Lesson'}</button>
          </div>
        </form>
      </div>

      <div className="dashboard-section" style={{ marginTop: 0 }}>
        <div className="dashboard-section-header">
          <div>
            <h2 className="dashboard-section-title">Lessons</h2>
            <p className="dashboard-section-desc">Reorder, edit, or delete lessons.</p>
          </div>
        </div>

        {message && <div className="dashboard-section" style={{ borderColor: 'rgba(34, 211, 238, 0.35)', marginBottom: '1rem' }}>{message}</div>}
        {error && <div className="dashboard-error" style={{ marginBottom: '1rem' }}>{error}</div>}

        {loading ? (
          <div className="dashboard-loading"><p className="loading-text">Loading lessons...</p></div>
        ) : lessons.length === 0 ? (
          <div className="dashboard-empty"><p className="dashboard-empty-text">No lessons yet.</p></div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {lessons.map((lesson, index) => (
              <div key={lesson._id} className="quiz-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <div>
                    <h3 className="quiz-card-title">{index + 1}. {lesson.title}</h3>
                    <p className="quiz-card-desc">{lesson.duration || 'No duration'} {lesson.isFreePreview ? '- Free preview' : ''}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button type="button" className="btn-outline-alt" onClick={() => moveLesson(index, -1)} disabled={index === 0}>Up</button>
                    <button type="button" className="btn-outline-alt" onClick={() => moveLesson(index, 1)} disabled={index === lessons.length - 1}>Down</button>
                    <button type="button" className="btn-outline-alt" onClick={() => editLesson(lesson)}>Edit</button>
                    <button type="button" className="btn-outline-alt" onClick={() => deleteLesson(lesson._id)}>Delete</button>
                  </div>
                </div>
                {lesson.videoUrl && <video controls src={lesson.videoUrl} style={{ marginTop: '1rem', width: '100%', maxHeight: 300, borderRadius: 12, background: '#000' }} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
