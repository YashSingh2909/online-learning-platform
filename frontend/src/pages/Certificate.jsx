import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { enrollmentAPI, certificateAPI } from '../api/apiService';

export default function Certificate() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrollments, setEnrollments] = useState([]);
  const [generating, setGenerating] = useState(null);


  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setLoading(true);
      setError('');
      try {
        const res = await enrollmentAPI.getUserEnrollments();
        setEnrollments(res.data.data || []);
      } catch (e) {
        setError(e?.message || 'Failed to load certificates');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const generateCert = async (enrollmentId) => {
    setGenerating(enrollmentId);
    try {
      const pdfRes = await certificateAPI.generateCertificate({ enrollmentId });
      if (pdfRes?.data) {
        alert('Certificate generated! Check your downloads.');
      } else {
        alert('Certificate generated');
      }
    } catch (e) {
      alert(e?.message || 'Failed to generate certificate');
    } finally {
      setGenerating(null);
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
          <p className="dashboard-label">Certificates</p>
          <h1 className="dashboard-title">Your Achievements</h1>
          <p className="dashboard-desc">Certificates are generated when course completion reaches 100%.</p>
        </div>

        {loading ? (
          <div className="dashboard-loading">
            <p className="loading-text">Loading certificates...</p>
          </div>
        ) : error ? (
          <div className="dashboard-error">
            <p>{error}</p>
          </div>
        ) : enrollments.length === 0 ? (
          <div className="dashboard-empty">
            <h2 className="dashboard-empty-title">No enrollments</h2>
            <p className="dashboard-empty-text">Enroll in a course to unlock certificates.</p>
            <Link to="/courses" className="btn-action" style={{ marginTop: '1.5rem' }}>
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="dashboard-grid">
            {enrollments.map((enr) => {
              const isComplete = enr.progress >= 100;
              return (
                <div key={enr._id} className="cert-card">
                  <div className="cert-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 28, height: 28 }}>
                      <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h3 className="cert-title">{enr.course?.title || 'Course'}</h3>
                  <p className="cert-course">Completion: {enr.progress ?? 0}%</p>
                  <p className="cert-date">Status: {enr.status}</p>
                  <div className="cert-download">
                    <button
                      className="btn-action"
                      disabled={!isComplete || generating === enr._id}
                      onClick={() => generateCert(enr._id)}
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      {generating === enr._id ? (
                        <>
                          <span className="spinner"></span>
                          Generating...
                        </>
                      ) : isComplete ? (
                        'Generate Certificate'
                      ) : (
                        'Complete course to unlock'
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}