import React from 'react';
import { BrowserRouter as Router, Link, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/common/ProtectedRoute';

import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CourseDetail from './pages/CourseDetail';
import Progress from './pages/Progress';
import Quizzes from './pages/Quizzes';
import Assignments from './pages/Assignments';
import Notifications from './pages/Notifications';
import Certificate from './pages/Certificate';
import QuizDetail from './pages/QuizDetail';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Help from './pages/Help';
import Courses from './pages/Courses';

import InstructorDashboard from './components/instructor/InstructorDashboard';
import MyCourses from './components/instructor/MyCourses';
import CreateCourse from './components/instructor/CreateCourse';
import CourseManagement from './components/instructor/CourseManagement';
import LessonsManager from './components/instructor/LessonsManager';
import QuizzesManager from './components/instructor/QuizzesManager';
import AssignmentsManager from './components/instructor/AssignmentsManager';

const Page = ({ children }) => <Layout>{children}</Layout>;

const CourseAlias = () => {
  const { id } = useParams();
  return <Navigate to={`/courses/${id}`} replace />;
};

const LegacyInstructorCourseAlias = ({ section }) => {
  const { courseId } = useParams();
  return <Navigate to={`/instructor/course/${courseId}/${section}`} replace />;
};

const InstructorHome = () => (
  <>
    <div className="dashboard-header">
      <p className="dashboard-label">Instructor</p>
      <h1 className="dashboard-title">Dashboard</h1>
      <p className="dashboard-desc">Create courses, publish content, and manage student activities.</p>
    </div>

    <div className="dashboard-section">
      <div className="dashboard-section-header">
        <div>
          <h2 className="dashboard-section-title">Instructor tools</h2>
          <p className="dashboard-section-desc">Continue from the left navigation or jump straight into course management.</p>
        </div>
        <Link to="/instructor/create-course" className="btn-action">Create course</Link>
      </div>

      <div className="dashboard-grid">
        <Link to="/instructor/courses" className="course-card-alt">
          <div className="course-card-header">
            <div>
              <h3 className="course-card-title">My Courses</h3>
              <p className="course-card-meta">Publish, unpublish, edit, and open course content.</p>
            </div>
            <span className="course-card-badge">Courses</span>
          </div>
        </Link>
        <Link to="/instructor/create-course" className="course-card-alt">
          <div className="course-card-header">
            <div>
              <h3 className="course-card-title">Create Course</h3>
              <p className="course-card-meta">New courses default to published.</p>
            </div>
            <span className="course-card-badge">New</span>
          </div>
        </Link>
      </div>
    </div>
  </>
);

const Profile = () => {
  const { user } = useAuth();
  return (
    <Page>
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="dashboard-section">
            <div className="dashboard-section-header">
              <div>
                <h1 className="dashboard-section-title">Profile</h1>
                <p className="dashboard-section-desc">Your EduSphere account details.</p>
              </div>
            </div>
            <div className="quiz-card">
              <p className="quiz-card-desc"><strong>Name:</strong> {user?.name}</p>
              <p className="quiz-card-desc"><strong>Email:</strong> {user?.email}</p>
              <p className="quiz-card-desc"><strong>Role:</strong> {user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

const NotFound = () => (
  <Page>
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-empty">
          <h1 className="dashboard-empty-title">404 Page not found</h1>
          <p className="dashboard-empty-text">The page you opened does not exist.</p>
        </div>
      </div>
    </div>
  </Page>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Page><Home /></Page>} />
          <Route path="/about" element={<Page><About /></Page>} />
          <Route path="/help" element={<Page><Help /></Page>} />
          <Route path="/courses" element={<Page><Courses /></Page>} />
          <Route path="/courses/:id" element={<ProtectedRoute><Page><CourseDetail /></Page></ProtectedRoute>} />
          <Route path="/course/:id" element={<CourseAlias />} />

          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          <Route path="/dashboard" element={<ProtectedRoute><Page><Dashboard /></Page></ProtectedRoute>} />
          <Route path="/my-learning" element={<ProtectedRoute><Page><Dashboard /></Page></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute><Page><Progress /></Page></ProtectedRoute>} />
          <Route path="/quizzes" element={<ProtectedRoute><Page><Quizzes /></Page></ProtectedRoute>} />
          <Route path="/assignments" element={<ProtectedRoute><Page><Assignments /></Page></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Page><Notifications /></Page></ProtectedRoute>} />
          <Route path="/certificates" element={<ProtectedRoute><Page><Certificate /></Page></ProtectedRoute>} />
          <Route path="/quiz/:quizId" element={<ProtectedRoute><Page><QuizDetail /></Page></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><Page><AdminDashboard /></Page></ProtectedRoute>} />

          <Route
            path="/instructor"
            element={
              <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                <Page>
                  <InstructorDashboard />
                </Page>
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<InstructorHome />} />
            <Route path="courses" element={<MyCourses />} />
            <Route path="create-course" element={<CreateCourse />} />
            <Route path="course/:courseId" element={<CourseManagement />}>
              <Route index element={<Navigate to="lessons" replace />} />
              <Route path="lessons" element={<LessonsManager />} />
              <Route path="quizzes" element={<QuizzesManager />} />
              <Route path="assignments" element={<AssignmentsManager />} />
            </Route>
            <Route path=":courseId/publish" element={<LegacyInstructorCourseAlias section="lessons" />} />
            <Route path=":courseId/lessons" element={<LegacyInstructorCourseAlias section="lessons" />} />
            <Route path=":courseId/quizzes" element={<LegacyInstructorCourseAlias section="quizzes" />} />
            <Route path=":courseId/assignments" element={<LegacyInstructorCourseAlias section="assignments" />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
