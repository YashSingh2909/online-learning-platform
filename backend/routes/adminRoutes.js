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
} from '../controllers/adminController.js';

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

// Analytics
router.get('/analytics', getAdminAnalytics);

// Submissions overview
router.get('/submissions', getAdminAllSubmissions);

// User block/unblock
router.put('/users/:id/block', setUserBlocked);

// User role update
router.put('/users/:id/role', setUserRole);

export default router;


