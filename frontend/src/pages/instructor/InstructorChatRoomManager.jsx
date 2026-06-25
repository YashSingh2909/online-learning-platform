import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CourseChat from '../../components/chat/CourseChat';

export default function InstructorChatRoomManager() {
  const { courseId } = useParams();
  const { user } = useAuth();

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <p className="dashboard-label">Instructor</p>
          <h1 className="dashboard-title">Chat Room</h1>
          <p className="dashboard-desc">Conversation feed for this course.</p>
        </div>

        {user ? <CourseChat courseId={courseId} /> : null}
      </div>
    </div>
  );
}


