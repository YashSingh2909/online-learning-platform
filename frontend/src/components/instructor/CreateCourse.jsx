import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseAPI, uploadAPI } from '../../api/apiService';

const initialForm = {
  title: '',
  description: '',
  category: 'Programming',
  level: 'Beginner',
  status: 'published',
  price: 0,
  duration: '0 hours',
  thumbnail: '', // Empty string - backend will auto-generate
};

export default function CreateCourse() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      let thumbnail = formData.thumbnail;
      if (thumbnailFile) {
        const upload = await uploadAPI.uploadCourseThumbnail(thumbnailFile);
        thumbnail = upload?.data?.data?.url || thumbnail;
      }

      const payload = {
        ...formData,
        thumbnail,
        isPublished: formData.status === 'published',
      };

      const res = await courseAPI.createCourse(payload);
      navigate(`/instructor/course/${res?.data?.data?._id}`);
    } catch (err) {
      setError(err?.message || err?.response?.data?.message || 'Failed to create course.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="dashboard-header">
        <p className="dashboard-label">Create Course</p>
        <h1 className="dashboard-title">Instructor Panel</h1>
        <p className="dashboard-desc">Add a course to EduSphere. Courses are published by default.</p>
      </div>

      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <div>
            <h2 className="dashboard-section-title">Course Details</h2>
            <p className="dashboard-section-desc">Title, description, status, pricing, and thumbnail.</p>
          </div>
          <button type="button" className="btn-outline-alt" onClick={() => navigate('/instructor/courses')}>
            Back to courses
          </button>
        </div>

        {error && <div className="dashboard-error" style={{ marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Title *</label>
              <input
                required
                className="form-input"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="e.g. React for Beginners"
              />
            </div>

            <div className="form-field" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Description *</label>
              <textarea
                required
                rows={4}
                className="form-input"
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Write a short course description"
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="form-field">
              <label className="form-label">Category</label>
              <select className="form-input" value={formData.category} onChange={(e) => updateField('category', e.target.value)}>
                {['Programming', 'Design', 'Business', 'Marketing', 'Science', 'Language', 'Other'].map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Level</label>
              <select className="form-input" value={formData.level} onChange={(e) => updateField('level', e.target.value)}>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Status</label>
              <select className="form-input" value={formData.status} onChange={(e) => updateField('status', e.target.value)}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
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
                onChange={(e) => updateField('price', Number(e.target.value))}
              />
            </div>

            <div className="form-field">
              <label className="form-label">Duration</label>
              <input className="form-input" value={formData.duration} onChange={(e) => updateField('duration', e.target.value)} />
            </div>

            <div className="form-field">
              <label className="form-label">Course Thumbnail</label>
              <input className="form-input" type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Leave empty to auto-generate based on category and level
              </p>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-outline-alt" onClick={() => navigate('/instructor/courses')} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn-action" disabled={saving}>
              {saving ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
