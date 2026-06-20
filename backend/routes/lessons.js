import express from 'express';
import { addLesson, deleteLesson, getLessons, reorderLessons, updateLesson } from '../controllers/courseController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import { verifyCourseOwner } from '../middleware/checkCourseOwner.js';

const router = express.Router({ mergeParams: true });

router.get('/courses/:id/lessons', optionalAuth, getLessons);
router.post('/courses/:id/lessons', protect, authorize('instructor', 'admin'), verifyCourseOwner, addLesson);
router.put('/courses/:courseId/lessons/reorder', protect, authorize('instructor', 'admin'), verifyCourseOwner, reorderLessons);
router.put('/courses/:courseId/lessons/:lessonId', protect, authorize('instructor', 'admin'), verifyCourseOwner, updateLesson);
router.delete('/courses/:courseId/lessons/:lessonId', protect, authorize('instructor', 'admin'), verifyCourseOwner, deleteLesson);

export default router;
