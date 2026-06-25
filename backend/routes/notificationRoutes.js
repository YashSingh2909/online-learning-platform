import express from 'express';
import {
  getNotifications,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getNotifications);
router.get('/unread-count', protect, getUnreadCount);
router.put('/mark-all/read', protect, markAllAsRead); // Must come before /:id/read
router.put('/:id/read', protect, markNotificationAsRead);
router.delete('/:id', protect, deleteNotification);

export default router;
