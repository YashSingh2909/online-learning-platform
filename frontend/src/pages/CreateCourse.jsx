import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { courseAPI } from '../api/apiService';

export default function CreateCourse() {


  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Programming',
    level: 'beginner',
    status: 'published',
    price: 0,
    // Default placeholder used if user doesn't upload a thumbnail file.
    thumbnail: 'https://via.placeholder.com/300x200?text=Course+Thumbnail',
    duration: '0 hours',
    lessons: [],
  });


  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const uploadThumbnailIfNeeded = async () => {
    if (!thumbnailFile) return null;

    const fd = new FormData();
    fd.append('thumbnail', thumbnailFile);

    // Backend route is mounted at: /api/uploads, but server serves the static files at /uploads.
    // uploadRoutes returns { url: <baseUrl>/uploads/<filename> }
    const res = await axiosInstance.post('/uploads/course-thumbnail', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return res?.data?.data?.url;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSaving(true);
    setError('');


    try {
      if (!user) {
        navigate('/login');
        return;
      }

      const uploadedThumbnailUrl = await uploadThumbnailIfNeeded();

      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: formData.price,
        duration: formData.duration,
        lessons: formData.lessons,
        thumbnail: uploadedThumbnailUrl || formData.thumbnail,

        // Map UI status -> backend field
        isPublished: formData.status === 'published',

        // Keep extra fields from breaking backend validation (backend ignores them anyway)
        level: formData.level,
        status: formData.status,
      };

      await courseAPI.createCourse(payload);
      navigate('/dashboard');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to create course';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-bg">
        <div className="dashboard-orb dashboard-orb-1"></div>
        <div className="dashboard-orb dashboard-orb-2"></div>
      </div>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <p className="dashboard-label">Create Course</p>
          <h1 className="dashboard-title">Instructor Panel</h1>
          <p className="dashboard-desc">Instructors can post new courses here.</p>
        </div>

            <div className="dashboard-section">

          <div className="dashboard-section-header">
            <div>
              <h2 className="dashboard-section-title">Create Course</h2>
              <p className="dashboard-section-desc">Instructor panel</p>
            </div>
            <button
              type="button"
              className="btn-outline-alt"
              onClick={() => navigate('/dashboard')}
            >
              ← Back
            </button>
          </div>

          {error && <div className="dashboard-error" style={{ marginTop: '1rem' }}>{error}</div>}

          <form onSubmit={onSubmit} style={{ marginTop: '1.25rem' }}>
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">Title *</label>
                <input
                  required
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. React for Beginners"
                />
              </div>

              <div className="form-field">
                <label className="form-label">Description *</label>
                <textarea
                  required
                  rows={4}
                  className="form-input"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Write a short course description"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="form-field">
                <label className="form-label">Category</label>
                <input
                  className="form-input"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label className="form-label">Level</label>
                <select
                  className="form-input"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="form-field">
                <label className="form-label">Status</label>
                <select
                  className="form-input"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div className="form-field">
                <label className="form-label">Price (₹)</label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  className="form-input"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                />
              </div>

              <div className="form-field">
                <label className="form-label">Duration</label>
                <input
                  className="form-input"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label className="form-label">Course Thumbnail</label>
                <input
                  className="form-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setThumbnailFile(file || null);
                    if (!file) return;
                  }}
                />
                <p className="mt-1 text-sm text-slate-400">Upload an image. (Optional: if you don't upload, placeholder will be used.)</p>
              </div>

            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-outline-alt"
                onClick={() => navigate('/dashboard')}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn-action"
                disabled={saving}
              >
                {saving ? 'Creating...' : 'Create Course'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

