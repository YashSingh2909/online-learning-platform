import express from 'express';
import {
  enrollCourse,
  getUserEnrollments,
  getEnrollmentByCourse,
  completeLesson,
  getCourseEnrollments,
} from '../controllers/enrollmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/enroll', protect, enrollCourse);
router.get('/my-enrollments', protect, getUserEnrollments);
router.get('/:courseId', protect, getEnrollmentByCourse);
router.put('/complete-lesson', protect, completeLesson);
router.get('/course/:courseId/students', protect, authorize('instructor', 'admin'), getCourseEnrollments);

export default router;
