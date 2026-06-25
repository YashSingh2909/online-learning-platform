import React from 'react';
import { useParams } from 'react-router-dom';

import DiscussionBoard from '../../components/discussion/DiscussionBoard';

export default function InstructorDiscussionsManager() {
  const { courseId } = useParams();

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <p className="dashboard-label">Instructor</p>
          <h1 className="dashboard-title">Discussions</h1>
          <p className="dashboard-desc">Course discussions and replies.</p>
        </div>

        <DiscussionBoard courseId={courseId} />
      </div>
    </div>
  );
}


