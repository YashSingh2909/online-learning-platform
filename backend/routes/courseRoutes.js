import express from 'express';
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getLessons,
  addLesson,
  updateLesson,
  deleteLesson,
  reorderLessons,
  publishCourse,
  unpublishCourse,
  toggleFeatured,
  getFeaturedCourses,
  getInstructorCourses,
  resetCourseThumbnail,
} from '../controllers/courseController.js';
import { getQuizzesByCourse, createQuiz } from '../controllers/quizController.js';
import { getAssignmentsByCourse, createAssignment } from '../controllers/assignmentController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import { verifyCourseOwner } from '../middleware/checkCourseOwner.js';

const router = express.Router();

const attachCourseId = (req, _res, next) => {
  req.body.courseId = req.params.id;
  req.params.courseId = req.params.id;
  next();
};

router.get('/featured', getFeaturedCourses);
router.get('/instructor', protect, authorize('instructor', 'admin'), getInstructorCourses);
router.get('/instructor/courses', protect, authorize('instructor', 'admin'), getInstructorCourses);

router.get('/', getAllCourses);
router.post('/', protect, authorize('instructor', 'admin'), createCourse);

router.get('/:id/lessons', optionalAuth, getLessons);
router.post('/:id/lessons', protect, authorize('instructor', 'admin'), verifyCourseOwner, addLesson);
router.put('/:courseId/lessons/reorder', protect, authorize('instructor', 'admin'), verifyCourseOwner, reorderLessons);
router.put('/:courseId/lessons/:lessonId', protect, authorize('instructor', 'admin'), verifyCourseOwner, updateLesson);
router.delete('/:courseId/lessons/:lessonId', protect, authorize('instructor', 'admin'), verifyCourseOwner, deleteLesson);

router.get('/:id/quizzes', protect, attachCourseId, getQuizzesByCourse);
router.post('/:id/quizzes', protect, authorize('instructor', 'admin'), verifyCourseOwner, attachCourseId, createQuiz);

router.get('/:id/assignments', protect, attachCourseId, getAssignmentsByCourse);
router.post('/:id/assignments', protect, authorize('instructor', 'admin'), verifyCourseOwner, attachCourseId, createAssignment);

router.put('/:id/publish', protect, authorize('instructor', 'admin'), verifyCourseOwner, publishCourse);
router.put('/:id/unpublish', protect, authorize('instructor', 'admin'), verifyCourseOwner, unpublishCourse);
router.put('/:id/featured', protect, authorize('admin'), toggleFeatured);
router.put('/:id/reset-thumbnail', protect, authorize('instructor', 'admin'), verifyCourseOwner, resetCourseThumbnail);

router.get('/:id', optionalAuth, getCourseById);
router.put('/:id', protect, authorize('instructor', 'admin'), verifyCourseOwner, updateCourse);
router.delete('/:id', protect, authorize('instructor', 'admin'), verifyCourseOwner, deleteCourse);

export default router;
