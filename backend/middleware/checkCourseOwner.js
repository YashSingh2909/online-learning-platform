// middleware/checkCourseOwner.js
import Course from '../models/Course.js';

// Usage:
//  - for course routes that already have req.params.id
//  - for lesson routes that have req.params.courseId
//  - for quiz/assignment routes that can provide course ownership via related ids
//
// Options:
//  - courseParam: name of param that contains the Course _id. Default: 'id'
//
// This middleware enforces:
//  - admin can access everything
//  - instructors can only access their own courses
//  - students are blocked (ownership management only)
export const verifyCourseOwner = async (req, res, next) => {
  try {
    const courseParam = req?.route?.params?.courseParam;
    const paramName = courseParam || 'id';
    const courseId = req.params?.[paramName] || req.params?.id || req.params?.courseId;

    if (!courseId) {
      return res.status(400).json({ success: false, message: 'courseId is required' });
    }

    // role gate: only instructors/admins should call this middleware
    const role = req.user?.role;
    if (role !== 'admin' && role !== 'instructor') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (role !== 'admin' && course.instructor?.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    return next();
  } catch (e) {
    return res.status(500).json({ success: false, message: e?.message || 'Internal server error' });
  }
};

// Helper to reuse in places where you already loaded the course.
export const isCourseOwner = (course, user) => {
  if (!course || !user) return false;
  if (user.role === 'admin') return true;
  return course.instructor?.toString() === user.id;
};

