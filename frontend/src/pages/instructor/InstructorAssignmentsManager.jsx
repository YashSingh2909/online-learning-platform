import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import { assignmentAPI, uploadAPI } from '../../api/apiService';


export default function InstructorAssignmentsManager() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();


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
            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-8">
              <p className="text-slate-300">Loading assignments...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <h1 className="text-3xl sm:text-4xl font-semibold mt-2">Assignments Manager</h1>
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
                    <h2 className="text-xl font-semibold">Existing Assignments</h2>
                    <p className="text-sm text-slate-300 mt-1">Edit, upload, or delete.</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/instructor/course/${courseId}/assignments/grading`)}
                      disabled={loading}
                      className="inline-flex items-center justify-center px-3 py-2 rounded-xl border border-white/10 hover:border-cyan-400/40 bg-white/5 hover:bg-white/10 transition text-xs font-medium"
                    >
                      Grade Assignments
                    </button>
                    <button
                      onClick={resetForm}
                      className="inline-flex items-center justify-center px-3 py-2 rounded-xl border border-white/10 hover:border-cyan-400/40 bg-white/5 hover:bg-white/10 transition text-xs font-medium"
                      type="button"
                      disabled={loading}
                    >
                      + New Assignment
                    </button>
                  </div>
                </div>

                {assignments.length === 0 ? (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
                    <h2 className="text-lg font-semibold">No assignments yet</h2>
                    <p className="text-sm text-slate-300 mt-2">Create your first assignment.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {assignments.map((a) => (
                      <div key={a._id} className="rounded-xl bg-white/5 border border-white/10 p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-base font-semibold text-white">{a.title}</h3>
                            <p className="text-xs text-slate-300 mt-1">
                              {a.isPublished ? 'Published' : a.isFreePreview ? 'Free preview' : 'Draft/Locked'}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => startEdit(a)}
                              disabled={loading}
                              className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg border border-white/10 hover:border-cyan-400/40 bg-white/5 hover:bg-white/10 transition text-xs font-medium"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(a._id)}
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
                  <h2 className="text-xl font-semibold">{mode === 'create' ? 'Create Assignment' : 'Edit Assignment'}</h2>
                  <p className="text-sm text-slate-300 mt-1">Keep the same resourceUrls structure as Assignments.jsx.</p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                  }}
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-2">Title *</label>
                      <input
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition"
                        value={form.title}
                        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                        required
                        placeholder="Enter assignment title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-2">Description</label>
                      <textarea
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition resize-y"
                        rows={3}
                        value={form.description}
                        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                        placeholder="Enter assignment description"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2">Due date</label>
                        <input
                          type="date"
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition"
                          value={form.dueDate}
                          onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2">Total points</label>
                        <input
                          type="number"
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition"
                          value={form.totalPoints}
                          onChange={(e) => setForm((f) => ({ ...f, totalPoints: Number(e.target.value) }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2">Free preview</label>
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
                      <label className="block text-sm font-medium text-slate-200 mb-2">Upload resources (optional for edit)</label>
                      <input
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition"
                        type="file"
                        multiple
                        onChange={(e) => setResourceFiles(Array.from(e.target.files || []))}
                      />
                      <p className="mt-2 text-sm text-slate-400">Existing URLs: {(form.resourceUrls && form.resourceUrls.length) || 0}</p>
                    </div>
                  </div>

                  {mode === 'edit' ? (
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={handleReplaceResources}
                        disabled={loading}
                        className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-white/10 hover:border-cyan-400/40 bg-white/5 hover:bg-white/10 transition text-sm font-medium"
                      >
                        Replace resources (upload → replace)
                      </button>
                    </div>
                  ) : null}

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
                      {loading ? 'Saving...' : mode === 'create' ? 'Create Assignment' : 'Update Assignment'}
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


