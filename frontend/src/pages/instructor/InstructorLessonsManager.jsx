import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { courseAPI, uploadAPI } from '../../api/apiService';

export default function InstructorLessonsManager() {
  const { courseId } = useParams();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const sortedLessons = useMemo(() => {
    const lessons = course?.lessons || [];
    return [...lessons].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [course]);

  const [mode, setMode] = useState('create'); // create | edit
  const [editingLessonId, setEditingLessonId] = useState(null);

  const [form, setForm] = useState({
    title: '',
    module: 'Module 1',
    duration: '0',
    isFreePreview: false,
    order: 1,
    videoUrl: '',
  });

  const [videoFile, setVideoFile] = useState(null);

  const loadCourse = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const res = await courseAPI.getCourseById(courseId);
      setCourse(res.data.data);
    } catch (e) {
      setError(e?.message || 'Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, user]);

  const resetForm = () => {
    setMode('create');
    setEditingLessonId(null);
    setForm({
      title: '',
      module: 'Module 1',
      duration: '0',
      isFreePreview: false,
      order: (sortedLessons?.length || 0) + 1,
      videoUrl: '',
    });
    setVideoFile(null);
  };

  useEffect(() => {
    if (!course) return;
    if (mode === 'create') {
      setForm((f) => ({ ...f, order: (course.lessons?.length || 0) + 1 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course]);

  const startEdit = (lesson) => {
    setMode('edit');
    setEditingLessonId(lesson._id);
    setForm({
      title: lesson.title || '',
      module: lesson.module || 'Module 1',
      duration: lesson.duration || '0',
      isFreePreview: !!lesson.isFreePreview,
      order: lesson.order || 1,
      videoUrl: lesson.videoUrl || '',
    });
    setVideoFile(null);
  };

  const handleSave = async () => {
    if (!user) return;
    if (!form.title.trim()) {
      setError('Lesson title is required');
      return;
    }

    setError('');
    setLoading(true);
    try {
      let videoUrl = form.videoUrl;
      if (videoFile) {
        const up = await uploadAPI.uploadLessonVideo(videoFile);
        videoUrl = up.data?.data?.url;
      }

      const payload = {
        title: form.title,
        module: form.module,
        duration: form.duration,
        order: Number(form.order) || 1,
        isFreePreview: !!form.isFreePreview,
        videoUrl,
      };

      if (mode === 'create') {
        // addLesson API uses /courses/:id/lessons and controller pushes with order support
        await courseAPI.addLesson(courseId, payload);
      } else {
        await courseAPI.updateLesson(courseId, editingLessonId, payload);
      }

      await loadCourse();
      resetForm();
    } catch (e) {
      setError(e?.message || 'Failed to save lesson');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (lessonId) => {
    if (!window.confirm('Delete this lesson?')) return;
    setError('');
    setLoading(true);
    try {
      await courseAPI.deleteLesson(courseId, lessonId);
      await loadCourse();
      resetForm();
    } catch (e) {
      setError(e?.message || 'Failed to delete lesson');
    } finally {
      setLoading(false);
    }
  };

  const moveLesson = async (lessonId, direction) => {
    // direction: -1 (up) or +1 (down)
    const list = sortedLessons;
    const idx = list.findIndex((l) => l._id === lessonId);
    if (idx < 0) return;
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= list.length) return;

    const reordered = [...list];
    const [picked] = reordered.splice(idx, 1);
    reordered.splice(newIdx, 0, picked);

    const orderedLessonIds = reordered.map((l) => String(l._id));

    setError('');
    setLoading(true);
    try {
      await courseAPI.reorderLessons(courseId, { orderedLessonIds });
      await loadCourse();
    } catch (e) {
      setError(e?.message || 'Failed to reorder lessons');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !course) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-bg">
          <div className="dashboard-orb dashboard-orb-1"></div>
          <div className="dashboard-orb dashboard-orb-2"></div>
        </div>
        <div className="dashboard-container">
          <div className="dashboard-loading"><p className="loading-text">Loading lessons...</p></div>
        </div>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-bg">
          <div className="dashboard-orb dashboard-orb-1"></div>
          <div className="dashboard-orb dashboard-orb-2"></div>
        </div>
        <div className="dashboard-container">
          <div className="dashboard-error"><p>{error}</p></div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-bg">
        <div className="dashboard-orb dashboard-orb-1"></div>
        <div className="dashboard-orb dashboard-orb-2"></div>
      </div>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <p className="dashboard-label">Instructor</p>
          <h1 className="dashboard-title">Lessons Manager</h1>
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
                  <h2 className="dashboard-section-title">Existing Lessons</h2>
                  <p className="dashboard-section-desc">Reorder, edit, or delete.</p>
                </div>
                <button className="btn-outline-alt" onClick={resetForm} type="button" disabled={loading}>
                  + New Lesson
                </button>
              </div>

              {sortedLessons.length === 0 ? (
                <div className="dashboard-empty" style={{ marginTop: '1rem' }}>
                  <h2 className="dashboard-empty-title">No lessons yet</h2>
                  <p className="dashboard-empty-text">Create your first lesson.</p>
                </div>
              ) : (
                <div className="space-y-3" style={{ marginTop: '1rem' }}>
                  {sortedLessons.map((l) => (
                    <div key={l._id} className="quiz-card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <h3 className="quiz-card-title">{l.order}. {l.title}</h3>
                        <p className="quiz-card-desc">Module: {l.module || 'Module 1'} · Duration: {l.duration || '0'}</p>
                        <p className="quiz-card-desc">{l.isFreePreview ? 'Free preview' : 'Locked preview'}</p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button className="btn-outline-alt" type="button" onClick={() => moveLesson(l._id, -1)} disabled={loading || sortedLessons[0]?._id === l._id}>
                          ↑
                        </button>
                        <button className="btn-outline-alt" type="button" onClick={() => moveLesson(l._id, 1)} disabled={loading || sortedLessons[sortedLessons.length - 1]?._id === l._id}>
                          ↓
                        </button>
                        <button className="btn-outline-alt" type="button" onClick={() => startEdit(l)} disabled={loading}>
                          Edit
                        </button>
                        <button className="btn-outline-alt" type="button" onClick={() => handleDelete(l._id)} disabled={loading}>
                          Delete
                        </button>
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
                  <h2 className="dashboard-section-title">{mode === 'create' ? 'Create Lesson' : 'Edit Lesson'}</h2>
                  <p className="dashboard-section-desc">Upload video + configure metadata.</p>
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
                  <div className="form-field">
                    <label className="form-label">Title *</label>
                    <input className="form-input" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  </div>

                  <div className="form-field">
                    <label className="form-label">Module</label>
                    <input className="form-input" value={form.module} onChange={(e) => setForm({ ...form, module: e.target.value })} />
                  </div>

                  <div className="form-field">
                    <label className="form-label">Order</label>
                    <input
                      className="form-input"
                      type="number"
                      value={form.order}
                      onChange={(e) => setForm({ ...form, order: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label">Duration</label>
                    <input className="form-input" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
                  </div>

                  <div className="form-field">
                    <label className="form-label">Free preview</label>
                    <select
                      className="form-input"
                      value={form.isFreePreview ? 'yes' : 'no'}
                      onChange={(e) => setForm({ ...form, isFreePreview: e.target.value === 'yes' })}
                    >
                      <option value="no">Locked</option>
                      <option value="yes">Free preview</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="form-label">Video file (upload)</label>
                    <input
                      className="form-input"
                      type="file"
                      accept="video/*"
                      onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                    />
                    {mode === 'edit' && form.videoUrl ? (
                      <p className="mt-1 text-sm text-slate-400">Current: {String(form.videoUrl).slice(0, 50)}...</p>
                    ) : null}
                  </div>
                </div>

                <div className="form-actions" style={{ marginTop: '1rem' }}>
                  <button className="btn-outline-alt" type="button" onClick={resetForm} disabled={loading}>
                    Cancel
                  </button>
                  <button className="btn-action" type="submit" disabled={loading}>
                    {loading ? 'Saving...' : (mode === 'create' ? 'Create Lesson' : 'Update Lesson')}
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


