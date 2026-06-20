import express from 'express';
import {
  getAssignmentsByCourse,
  getAssignmentById,
  createAssignment,
  submitAssignment,
  gradeSubmission,
  getUserSubmissions,
  updateAssignment,
  deleteAssignment,
  replaceAssignmentResources,
} from '../controllers/assignmentController.js';

import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/course/:courseId', protect, getAssignmentsByCourse);
router.get('/:id', protect, getAssignmentById);
router.post('/', protect, authorize('instructor', 'admin'), createAssignment);

// Assignment CRUD (instructor/admin owns course)
router.put('/:id', protect, authorize('instructor', 'admin'), updateAssignment);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteAssignment);
router.post('/:id/resources/replace', protect, authorize('instructor', 'admin'), replaceAssignmentResources);


router.post('/:id/submit', protect, submitAssignment);
router.put('/:id/grade', protect, authorize('instructor', 'admin'), gradeSubmission);
router.get('/submissions/course/:courseId', protect, getUserSubmissions);

export default router;

