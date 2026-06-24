import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { assignmentAPI } from '../../api/apiService';

const guessFileKind = (url) => {
  const lower = (url || '').toLowerCase();
  if (lower.includes('.pdf')) return 'pdf';
  if (lower.match(/\.(png|jpg|jpeg|webp|gif)$/)) return 'image';
  if (lower.match(/\.(doc|docx)$/)) return 'doc';
  if (lower.match(/\.(ppt|pptx)$/)) return 'ppt';
  if (lower.includes('.zip')) return 'zip';
  return 'file';
};

const FilePreview = ({ url, title }) => {
  const kind = guessFileKind(url);

  if (!url) return <div className="text-sm text-slate-400">No file</div>;

  if (kind === 'image') {
    return (
      <div>
        <img
          src={url}
          alt={title || 'Uploaded file'}
          className="max-h-64 w-auto rounded-xl border border-white/10"
        />
        <div className="mt-2">
          <a className="btn-outline-alt" href={url} target="_blank" rel="noreferrer">
            Open
          </a>
        </div>
      </div>
    );
  }

  if (kind === 'pdf') {
    return (
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <iframe
          src={url}
          title={title || 'PDF preview'}
          className="w-full"
          style={{ height: 420 }}
        />
        <div className="p-3 border-t border-white/10">
          <a className="btn-outline-alt" href={url} target="_blank" rel="noreferrer">
            Open PDF
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <a className="btn-outline-alt" href={url} target="_blank" rel="noreferrer">
        Download / Open
      </a>
    </div>
  );
};

export default function InstructorAssignmentGrading() {
  const { courseId } = useParams();
  const { user } = useAuth();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // grading state per submission
  const [grading, setGrading] = useState({}); // { [submissionId]: { score, feedback } }
  const [submittingGrade, setSubmittingGrade] = useState(false);

  const refresh = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      // instructor grading: fetch all student submissions for the course
      const res = await assignmentAPI.getInstructorCourseSubmissions(courseId);
      setSubmissions(res.data.data || []);
    } catch (e) {
      setError(e?.message || 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, user]);

  const grouped = useMemo(() => {
    const map = new Map();
    for (const item of submissions) {
      const key = item.assignmentId || item.assignment?._id || item.assignment?._id;
      if (!key) continue;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(item);
    }
    return Array.from(map.entries()).map(([assignmentId, items]) => ({
      assignmentId,
      items,
      title: items[0]?.title,
    }));
  }, [submissions]);

  const getGradeState = (submissionId) => {
    return grading[submissionId] || { score: '', feedback: '' };
  };

  const handleGrade = async (assignmentId, submissionId) => {
    const gs = getGradeState(submissionId);
    const scoreNum = gs.score === '' || gs.score === null ? undefined : Number(gs.score);

    setSubmittingGrade(true);
    setError('');
    try {
      await assignmentAPI.gradeSubmission(assignmentId, {
        submissionId,
        score: scoreNum,
        feedback: gs.feedback,
      });
      await refresh();
    } catch (e) {
      setError(e?.message || 'Failed to grade submission');
    } finally {
      setSubmittingGrade(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="dashboard-loading">
            <p className="loading-text">
              Loading submissions... (courseId: {courseId})
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="dashboard-error">
            <p>{error}</p>
          </div>
          <button
            className="btn-outline-alt"
            onClick={refresh}
            style={{ marginTop: '1rem' }}
            type="button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <p className="dashboard-label">Instructor</p>
          <h1 className="dashboard-title">Grade Assignments</h1>
          <p className="dashboard-desc">Course: {courseId}</p>
        </div>

        <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr', gap: '1.25rem' }}>
          {grouped.length === 0 ? (
            <div className="dashboard-empty">
              <h2 className="dashboard-empty-title">No submissions yet</h2>
              <p className="dashboard-empty-text">Students must submit assignments before you can grade.</p>
            </div>
          ) : (
            grouped.map((grp) => (
              <div key={grp.assignmentId} className="dashboard-section" style={{ marginTop: 0 }}>
                <div className="dashboard-section-header">
                  <div>
                    <h2 className="dashboard-section-title">{grp.title}</h2>
                    <p className="dashboard-section-desc">Assignment ID: {grp.assignmentId}</p>
                  </div>
                  <button
                    className="btn-outline-alt"
                    type="button"
                    onClick={refresh}
                    disabled={submittingGrade}
                  >
                    Refresh
                  </button>
                </div>

                <div className="space-y-3">
                  {grp.items.map((item) => {
                    const submissionId = item._id || item.submissionId || item.submission?._id;
                    const status = item.status;
                    const fileUrl = item.fileUrl || item.submission?.fileUrl || item.resourceUrl || item.url;

                    return (
                      <div key={submissionId || item.submittedAt} className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm text-slate-300">
                              Student: {item.student?.name || item.student?.email || '—'}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">Submitted: {item.submittedAt ? new Date(item.submittedAt).toLocaleString() : '—'}</p>
                            <p className={`text-xs mt-2 ${status === 'graded' ? 'text-emerald-300' : 'text-slate-400'}`}>
                              Status: {status}
                            </p>
                            {status === 'graded' ? (
                              <>
                                <p className="text-sm text-emerald-200 mt-1">Score: {item.score ?? 0}</p>
                                {item.feedback ? <p className="text-sm text-slate-300 mt-2">{item.feedback}</p> : null}
                                {item.gradedAt ? (
                                  <p className="text-xs text-slate-400 mt-2">Graded on: {new Date(item.gradedAt).toLocaleString()}</p>
                                ) : null}
                              </>
                            ) : null}
                          </div>
                        </div>

                        <div className="mt-4">
                          <FilePreview url={fileUrl} title={grp.title} />
                        </div>

                        {status !== 'graded' ? (
                          <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/20 p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs text-slate-400">Score / Marks</label>
                                <input
                                  type="number"
                                  value={getGradeState(submissionId).score}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setGrading((prev) => ({
                                      ...prev,
                                      [submissionId]: {
                                        ...(prev[submissionId] || { score: '', feedback: '' }),
                                        score: val,
                                      },
                                    }));
                                  }}
                                  className="form-input"
                                  placeholder="e.g. 90"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-slate-400">Feedback</label>
                                <textarea
                                  value={getGradeState(submissionId).feedback}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setGrading((prev) => ({
                                      ...prev,
                                      [submissionId]: {
                                        ...(prev[submissionId] || { score: '', feedback: '' }),
                                        feedback: val,
                                      },
                                    }));
                                  }}
                                  className="form-input"
                                  placeholder="Optional comments"
                                  rows={3}
                                />
                              </div>
                            </div>

                            <div className="mt-3">
                              <button
                                className="primary-btn w-full"
                                type="button"
                                disabled={submittingGrade}
                                onClick={() => handleGrade(grp.assignmentId, submissionId)}
                              >
                                {submittingGrade ? 'Grading…' : 'Grade submission'}
                              </button>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

