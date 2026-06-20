import express from 'express';
import {
  getQuizzesByCourse,
  getQuizById,
  createQuiz,
  submitQuiz,
  getQuizAttempts,
  updateQuiz,
  deleteQuiz,
} from '../controllers/quizController.js';

import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/course/:courseId', protect, getQuizzesByCourse);
router.get('/:quizId', protect, getQuizById);
router.post('/', protect, authorize('instructor', 'admin'), createQuiz);

// Quiz CRUD (instructor/admin owns the quiz's course)
router.put('/:quizId', protect, authorize('instructor', 'admin'), updateQuiz);
router.delete('/:quizId', protect, authorize('instructor', 'admin'), deleteQuiz);


router.post('/:quizId/submit', protect, submitQuiz);
router.get('/:quizId/attempts', protect, getQuizAttempts);

export default router;

