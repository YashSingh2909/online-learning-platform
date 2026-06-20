import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { assignmentAPI, uploadAPI } from '../../api/apiService';

export default function InstructorAssignmentsManager() {
  const { courseId } = useParams();
  const { user } = useAuth();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [mode, setMode] = useState('create'); // create | edit
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    totalPoints: 100,
    isFreePreview: false,
    isPublished: false,
    resourceUrls: [],
  });

  const [resourceFiles, setResourceFiles] = useState([]);

  const loadAssignments = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const res = await assignmentAPI.getAssignmentsByCourse(courseId);
      setAssignments(res.data.data || []);
    } catch (e) {
      setError(e?.message || 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, user]);

  const resetForm = () => {
    setMode('create');
    setEditingId(null);
    setForm({
      title: '',
      description: '',
      dueDate: '',
      totalPoints: 100,
      isFreePreview: false,
      isPublished: false,
      resourceUrls: [],
    });
    setResourceFiles([]);
  };

  const startEdit = (a) => {
    setMode('edit');
    setEditingId(a._id);
    setForm({
      title: a.title || '',
      description: a.description || '',
      dueDate: a.dueDate ? new Date(a.dueDate).toISOString().slice(0, 10) : '',
      totalPoints: a.totalPoints ?? 100,
      isFreePreview: !!a.isFreePreview,
      isPublished: !!a.isPublished,
      resourceUrls: Array.isArray(a.resourceUrls) ? a.resourceUrls : [],
    });
    setResourceFiles([]);
  };

  const uploadResourcesIfNeeded = async () => {
    if (!resourceFiles || resourceFiles.length === 0) return null;
    const up = await uploadAPI.uploadAssignmentResources(resourceFiles);
    const urls = up?.data?.data?.urls;
    if (!Array.isArray(urls)) {
      throw new Error('Upload failed: expected { urls } response');
    }
    return urls;
  };




  const handleSave = async () => {
    if (!user) return;
    if (!form.title.trim()) {
      setError('Assignment title is required');
      return;
    }

    setLoading(true);
    setError('');
    try {
      let resourceUrls = form.resourceUrls;
      const uploadedUrls = await uploadResourcesIfNeeded();
      if (uploadedUrls) resourceUrls = uploadedUrls;

      const payload = {
        title: form.title,
        description: form.description,
        courseId,
        dueDate: form.dueDate ? new Date(form.dueDate) : undefined,
        totalPoints: Number(form.totalPoints) || 100,
        resourceUrls,
        isFreePreview: !!form.isFreePreview,
        isPublished: !!form.isPublished,
      };

      if (mode === 'create') {
        await assignmentAPI.createAssignment(payload);
      } else {
        await assignmentAPI.updateAssignment(editingId, payload);
      }

      await loadAssignments();
      resetForm();
    } catch (e) {
      setError(e?.message || 'Failed to save assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this assignment?')) return;
    setLoading(true);
    setError('');
    try {
      await assignmentAPI.deleteAssignment(id);
      await loadAssignments();
      if (editingId === id) resetForm();
    } catch (e) {
      setError(e?.message || 'Failed to delete assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleReplaceResources = async () => {
    if (mode !== 'edit' || !editingId) return;
    const uploadedUrls = await uploadResourcesIfNeeded();
    if (!uploadedUrls || uploadedUrls.length === 0) {
      setError('Upload at least one resource file to replace');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await assignmentAPI.replaceAssignmentResources(editingId, uploadedUrls);
      await loadAssignments();
      resetForm();
    } catch (e) {
      setError(e?.message || 'Failed to replace resources');
    } finally {
      setLoading(false);
    }
  };

  if (loading && assignments.length === 0) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="dashboard-loading"><p className="loading-text">Loading assignments...</p></div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <p className="dashboard-label">Instructor</p>
          <h1 className="dashboard-title">Assignments Manager</h1>
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
                  <h2 className="dashboard-section-title">Existing Assignments</h2>
                  <p className="dashboard-section-desc">Edit, upload, or delete.</p>
                </div>
                <button className="btn-outline-alt" onClick={resetForm} type="button" disabled={loading}>
                  + New Assignment
                </button>

              </div>

              {assignments.length === 0 ? (
                <div className="dashboard-empty" style={{ marginTop: '1rem' }}>
                  <h2 className="dashboard-empty-title">No assignments yet</h2>
                  <p className="dashboard-empty-text">Create your first assignment.</p>
                </div>
              ) : (
                <div className="space-y-3" style={{ marginTop: '1rem' }}>
                  {assignments.map((a) => (
                    <div key={a._id} className="quiz-card">
                      <div className="quiz-card-header" style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                        <div>
                          <h3 className="quiz-card-title">{a.title}</h3>
                          <p className="quiz-card-desc">{a.isPublished ? 'Published' : (a.isFreePreview ? 'Free preview' : 'Draft/Locked')}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <button className="btn-outline-alt" type="button" onClick={() => startEdit(a)} disabled={loading}>Edit</button>
                          <button className="btn-outline-alt" type="button" onClick={() => handleDelete(a._id)} disabled={loading}>Delete</button>
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
                  <h2 className="dashboard-section-title">{mode === 'create' ? 'Create Assignment' : 'Edit Assignment'}</h2>
                  <p className="dashboard-section-desc">Keep the same resourceUrls structure as Assignments.jsx.</p>
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
                    <label className="form-label">Title *</label>
                    <input className="form-input" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
                  </div>

                  <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Description</label>
                    <textarea className="form-input" rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} style={{ resize: 'vertical' }} />
                  </div>

                  <div className="form-field">
                    <label className="form-label">Due date</label>
                    <input type="date" className="form-input" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} />
                  </div>

                  <div className="form-field">
                    <label className="form-label">Total points</label>
                    <input type="number" className="form-input" value={form.totalPoints} onChange={(e) => setForm((f) => ({ ...f, totalPoints: Number(e.target.value) }))} />
                  </div>

                  <div className="form-field">
                    <label className="form-label">Free preview</label>
                    <select className="form-input" value={form.isFreePreview ? 'yes' : 'no'} onChange={(e) => setForm((f) => ({ ...f, isFreePreview: e.target.value === 'yes' }))}>
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="form-label">Published</label>
                    <select className="form-input" value={form.isPublished ? 'yes' : 'no'} onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.value === 'yes' }))}>
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>

                  <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Upload resources (optional for edit)</label>
                    <input
                      className="form-input"
                      type="file"
                      multiple
                      onChange={(e) => setResourceFiles(Array.from(e.target.files || []))}
                    />
                    <p className="mt-1 text-sm text-slate-400">Existing URLs: {(form.resourceUrls && form.resourceUrls.length) || 0}</p>

                  </div>
                </div>

                {mode === 'edit' ? (
                  <div style={{ marginTop: '0.75rem' }}>
                    <button type="button" className="btn-outline-alt" onClick={handleReplaceResources} disabled={loading}>
                      Replace resources (upload → replace)
                    </button>
                  </div>
                ) : null}

                <div className="form-actions" style={{ marginTop: '1rem' }}>
                  <button className="btn-outline-alt" type="button" onClick={resetForm} disabled={loading}>
                    Cancel
                  </button>
                  <button className="btn-action" type="submit" disabled={loading}>
                    {loading ? 'Saving...' : (mode === 'create' ? 'Create Assignment' : 'Update Assignment')}
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


