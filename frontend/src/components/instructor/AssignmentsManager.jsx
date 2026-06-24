import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assignmentAPI, uploadAPI } from '../../api/apiService';

const initialForm = {
  title: '',
  description: '',
  dueDate: '',
  totalPoints: 100,
  isPublished: true,
  resourceUrls: [],
};

export default function AssignmentsManager() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [resourceFiles, setResourceFiles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const loadAssignments = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await assignmentAPI.getCourseAssignments(courseId);
      setAssignments(res?.data?.data || []);
    } catch (err) {
      setError(err?.message || 'Could not load assignments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, [courseId]);

  const resetForm = () => {
    setForm(initialForm);
    setResourceFiles([]);
    setEditingId(null);
  };

  const submitAssignment = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');

    try {
      let resourceUrls = form.resourceUrls || [];
      if (resourceFiles.length > 0) {
        const upload = await uploadAPI.uploadAssignmentResources(resourceFiles);
        resourceUrls = upload?.data?.data?.urls || resourceUrls;
      }

      const payload = {
        title: form.title,
        description: form.description,
        courseId,
        dueDate: form.dueDate,
        totalPoints: Number(form.totalPoints),
        maxScore: Number(form.totalPoints),
        resourceUrls,
        isPublished: !!form.isPublished,
      };

      if (editingId) {
        await assignmentAPI.updateAssignment(editingId, payload);
        setNotice('Assignment updated.');
      } else {
        await assignmentAPI.createCourseAssignment(courseId, payload);
        setNotice('Assignment created.');
      }

      resetForm();
      await loadAssignments();
    } catch (err) {
      setError(err?.message || 'Could not save assignment.');
    } finally {
      setSaving(false);
    }
  };

  const editAssignment = (assignment) => {
    setEditingId(assignment._id);
    setForm({
      title: assignment.title || '',
      description: assignment.description || '',
      dueDate: assignment.dueDate ? assignment.dueDate.slice(0, 10) : '',
      totalPoints: assignment.totalPoints || assignment.maxScore || 100,
      isPublished: assignment.isPublished !== false,
      resourceUrls: assignment.resourceUrls || [],
    });
  };

  const deleteAssignment = async (assignmentId) => {
    if (!window.confirm('Delete this assignment?')) return;
    try {
      await assignmentAPI.deleteAssignment(assignmentId);
      setNotice('Assignment deleted.');
      await loadAssignments();
    } catch (err) {
      setError(err?.message || 'Could not delete assignment.');
    }
  };

  return (
    <div className="dashboard-grid instructor-two-column">
        <div className="dashboard-section" style={{ marginTop: 0 }}>
        <div className="dashboard-section-header">
          <div>
            <h2 className="dashboard-section-title">{editingId ? 'Edit Assignment' : 'Create Assignment'}</h2>

            <p className="dashboard-section-desc">Set deadline, max score, and optional resource files.</p>
          </div>
        </div>

        <form onSubmit={submitAssignment}>
          <div className="form-grid">
            <div className="form-field" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Assignment title *</label>
              <input required className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="form-field" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Instructions *</label>
              <textarea required rows={4} className="form-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="form-field">
              <label className="form-label">Deadline</label>
              <input type="date" className="form-input" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </div>
            <div className="form-field">
              <label className="form-label">Max score</label>
              <input type="number" min="0" className="form-input" value={form.totalPoints} onChange={(e) => setForm({ ...form, totalPoints: e.target.value })} />
            </div>
            <div className="form-field">
              <label className="form-label">Published</label>
              <select className="form-input" value={form.isPublished ? 'yes' : 'no'} onChange={(e) => setForm({ ...form, isPublished: e.target.value === 'yes' })}>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="form-field" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Resource files</label>
              <input type="file" multiple className="form-input" onChange={(e) => setResourceFiles(Array.from(e.target.files || []))} />
            </div>
          </div>

          <div className="form-actions">
            {editingId && <button type="button" className="btn-outline-alt" onClick={resetForm}>Cancel</button>}
            <button type="submit" className="btn-action" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update Assignment' : 'Create Assignment'}</button>
          </div>
        </form>
      </div>

        <div className="dashboard-section" style={{ marginTop: 0 }}>
        <div className="dashboard-section-header">
          <div>
            <h2 className="dashboard-section-title">Assignments</h2>
            <p className="dashboard-section-desc">Review submissions count, manage assignment details, and grade.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn-outline-alt"
              onClick={() => navigate(`/instructor/course/${courseId}/assignments/grading`)}
              disabled={loading}
            >
              Grade Assignments
            </button>
          </div>
        </div>

        {notice && <div className="dashboard-section" style={{ borderColor: 'rgba(34, 211, 238, 0.35)', marginBottom: '1rem' }}>{notice}</div>}
        {error && <div className="dashboard-error" style={{ marginBottom: '1rem' }}>{error}</div>}

        {loading ? (
          <div className="dashboard-loading"><p className="loading-text">Loading assignments...</p></div>
        ) : assignments.length === 0 ? (
          <div className="dashboard-empty"><p className="dashboard-empty-text">No assignments yet.</p></div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {assignments.map((assignment) => (
              <div key={assignment._id} className="quiz-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <div>
                    <h3 className="quiz-card-title">{assignment.title}</h3>
                    <p className="quiz-card-desc">Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No deadline'}</p>
                    <p className="quiz-card-desc">Submissions: {assignment.submissions?.length || 0}</p>
                    {assignment.resourceUrls?.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                        {assignment.resourceUrls.map((url, index) => (
                          <a key={url} href={url} target="_blank" rel="noreferrer" className="sidebar-action-outline" style={{ width: 'auto' }}>Resource {index + 1}</a>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button type="button" className="btn-outline-alt" onClick={() => editAssignment(assignment)}>Edit</button>
                    <button type="button" className="btn-outline-alt" onClick={() => deleteAssignment(assignment._id)}>Delete</button>
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
