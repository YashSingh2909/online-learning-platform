import express from 'express';
import { getLiveClasses, createLiveClass, updateLiveClassStatus } from '../controllers/liveClassController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(protect, getLiveClasses)
  .post(protect, authorize('instructor', 'admin'), createLiveClass);

router.route('/:id/status')
  .put(protect, authorize('instructor', 'admin'), updateLiveClassStatus);

export default router;
