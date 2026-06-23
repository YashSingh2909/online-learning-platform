import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosConfig';
import { enrollmentAPI } from '../api/apiService';

export default function Certificate() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrollments, setEnrollments] = useState([]);
  const [generating, setGenerating] = useState(null);

  // ========================
  // LOAD ENROLLMENTS
  // ========================
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

  // ========================
  // GENERATE CERTIFICATE
  // ========================
  const generateCert = async (enrollmentId) => {
    setGenerating(enrollmentId);
    setError('');

    try {
      await axiosInstance.post('/certificates/generate', { enrollmentId });

      // refresh enrollments AFTER generation
      const res = await enrollmentAPI.getUserEnrollments();
      setEnrollments(res.data.data || []);
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        'Failed to generate certificate';

      // Backend may return "Certificate already generated".
      setError(msg);
    } finally {
      setGenerating(null);
    }
  };

  // ========================
  // DOWNLOAD CERTIFICATE
  // ========================
  const downloadCert = async (enrollmentId) => {
    setGenerating(enrollmentId);
    setError('');

    try {
      const pdfRes = await axiosInstance.get(`/certificates/download/${enrollmentId}`, {
        responseType: 'blob',
      });

      if (!pdfRes?.data) throw new Error('Certificate download failed');

      const blob = new Blob([pdfRes.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${enrollmentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Failed to download certificate');
    } finally {
      setGenerating(null);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <p className="dashboard-label">Certificates</p>
          <h1 className="dashboard-title">Your Achievements</h1>
          <p className="dashboard-desc">Certificates are generated after 100% course completion.</p>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : enrollments.length === 0 ? (
          <div>
            <h3>No enrollments found</h3>
            <Link to="/courses">Go to Courses</Link>
          </div>
        ) : (
          <div className="dashboard-grid">
            {enrollments.map((enr) => {
              const isComplete = enr.progress >= 100;
              const isGenerated = enr.certificateReceived === true;

              return (
                <div key={enr._id} className="cert-card">
                  <h3>{enr.course?.title}</h3>
                  <p>Progress: {enr.progress ?? 0}%</p>
                  <p>Status: {enr.status}</p>

                  {!isComplete ? (
                    <button disabled className="btn-action">
                      Complete course first
                    </button>
                  ) : isGenerated ? (
                    <button
                      className="btn-action"
                      disabled={generating === enr._id}
                      onClick={() => downloadCert(enr._id)}
                    >
                      {generating === enr._id ? 'Downloading...' : 'Download Certificate'}
                    </button>
                  ) : (
                    <button
                      className="btn-action"
                      disabled={generating === enr._id}
                      onClick={() => generateCert(enr._id)}
                    >
                      {generating === enr._id ? 'Generating...' : 'Generate Certificate'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

