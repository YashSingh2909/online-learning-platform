import express from 'express';
import { getCourseMessages } from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(protect, getCourseMessages);

export default router;
