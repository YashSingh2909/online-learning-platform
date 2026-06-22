import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

export default function CourseDetailLearnRedirect() {
  const { id } = useParams();
  return <Navigate to={`/course/${id}/learn`} replace />;
}

