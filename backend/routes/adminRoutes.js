import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getDashboardStats,

  // enhanced admin controls
  setUserBlocked,
  setUserRole,
  setCourseInstructor,
  setCoursePublishState,
  getAdminAnalytics,
  getAdminAllSubmissions,
  getStudentDetails,
  getStudentProgress,
  getInstructorDetails,
  transferCourseOwnership,

  // certificate management
  getAllCertificates,
  getCertificateById,
  regenerateCertificate,
  reissueCertificate,
  deleteCertificate,

  // quiz control center
  getAllQuizzes,
  getQuizAttemptsAdmin,
  resetQuizAttempt,
  deleteQuizAdmin,

  // assignment control center
  getAllAssignments,
  overrideAssignmentGrade,
  deleteAssignmentAdmin,

  // enrollment management
  getAllEnrollments,
  manualEnrollStudent,
  removeEnrollment,
  resetStudentProgress,

  // course analytics
  getCourseAnalytics,

  // course deep management
  getCourseDetailsAdmin,

  // enhanced global analytics
  getEnhancedAnalytics,

  // certificate management
  issueCertificate,
  downloadCertificate,
} from '../controllers/adminController.js';

// Import instructor-capable controllers for course content management
import {
  getLessons,
  addLesson,
  updateLesson,
  deleteLesson,
  reorderLessons,
} from '../controllers/courseController.js';
import {
  getQuizzesByCourse,
  createQuiz,
  updateQuiz,
  getQuizById,
} from '../controllers/quizController.js';
import {
  getAssignmentsByCourse,
  createAssignment,
  updateAssignment,
  getAssignmentById,
  getAllCourseSubmissions,
  getAssignmentSubmissions,
  gradeSubmission,
} from '../controllers/assignmentController.js';

import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin role
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/stats', getDashboardStats);

// User Management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Student Details (comprehensive view)
router.get('/students/:id/details', getStudentDetails);
router.get('/students/:id/progress', getStudentProgress);

// Instructor Management
router.get('/instructors/:id/details', getInstructorDetails);
router.put('/courses/:courseId/transfer-ownership', transferCourseOwnership);

// Course Management
router.get('/courses', getAllCourses);
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

// Admin course instructor assignment
router.put('/courses/:id/instructor', setCourseInstructor);

// Admin publish/unpublish
router.put('/courses/:id/publish', setCoursePublishState);
router.put('/courses/:id/unpublish', setCoursePublishState);

// Course Content Management (Instructor capabilities for Admin)
// Lessons
router.get('/courses/:id/lessons', getLessons);
router.post('/courses/:id/lessons', addLesson);
router.put('/courses/:courseId/lessons/:lessonId', updateLesson);
router.delete('/courses/:courseId/lessons/:lessonId', deleteLesson);
router.put('/courses/:courseId/lessons/reorder', reorderLessons);

// Quizzes
router.get('/courses/:id/quizzes', getQuizzesByCourse);
router.post('/courses/:id/quizzes', createQuiz);
router.get('/quizzes/:quizId', getQuizById);
router.put('/quizzes/:quizId', updateQuiz);

// Assignments
router.get('/courses/:id/assignments', getAssignmentsByCourse);
router.post('/courses/:id/assignments', createAssignment);
router.get('/assignments/:id', getAssignmentById);
router.put('/assignments/:id', updateAssignment);
router.get('/courses/:courseId/submissions', getAllCourseSubmissions);
router.get('/assignments/:id/submissions', getAssignmentSubmissions);
router.put('/assignments/:id/grade', gradeSubmission);

// Analytics
router.get('/analytics', getAdminAnalytics);
router.get('/analytics/enhanced', getEnhancedAnalytics);

// Submissions overview
router.get('/submissions', getAdminAllSubmissions);

// User block/unblock
router.put('/users/:id/block', setUserBlocked);

// User role update
router.put('/users/:id/role', setUserRole);

// Certificate Management
router.get('/certificates', getAllCertificates);
router.get('/certificates/:id', getCertificateById);
router.post('/certificates/:id/regenerate', regenerateCertificate);
router.post('/certificates/reissue', reissueCertificate);
router.delete('/certificates/:id', deleteCertificate);
router.post('/certificates/issue', issueCertificate);
router.get('/certificates/download/:enrollmentId', downloadCertificate);

// Quiz Control Center
router.get('/quizzes', getAllQuizzes);
router.get('/quizzes/:quizId/attempts', getQuizAttemptsAdmin);
router.delete('/quizzes/:quizId/attempts/:attemptId', resetQuizAttempt);
router.delete('/quizzes/:quizId', deleteQuizAdmin);

// Assignment Control Center
router.get('/assignments', getAllAssignments);
router.put('/assignments/:assignmentId/submissions/:submissionId/override', overrideAssignmentGrade);
router.delete('/assignments/:assignmentId', deleteAssignmentAdmin);

// Enrollment Management
router.get('/enrollments', getAllEnrollments);
router.post('/enrollments/manual', manualEnrollStudent);
router.delete('/enrollments/:enrollmentId', removeEnrollment);
router.put('/enrollments/:enrollmentId/reset', resetStudentProgress);

// Course Analytics
router.get('/courses/:courseId/analytics', getCourseAnalytics);

// Course Deep Management
router.get('/courses/:courseId/details', getCourseDetailsAdmin);

export default router;


