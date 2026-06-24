import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import bcrypt from 'bcryptjs';

import Quiz from '../models/Quiz.js';
import Assignment from '../models/Assignment.js';





// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const [userCount, instructorCount, courseCount, enrollmentCount] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'instructor' }),
      Course.countDocuments(),
      Enrollment.countDocuments()
    ]);

    const users = await User.find().select('name email role createdAt');
    const courses = await Course.find().select('title instructor level status createdAt');

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers: userCount + instructorCount + 1,
          students: userCount,
          instructors: instructorCount,
          totalCourses: courseCount,
          enrollments: enrollmentCount
        },
        recentUsers: users.slice(-5).reverse(),
        recentCourses: courses.slice(-5).reverse()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;

    let query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create user
export const createUser = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      role: role || 'student',
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      data: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { name, email, role, bio } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, bio },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    let query = {};
    if (status) query.status = status;
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Course.countDocuments(query);

    res.status(200).json({
      success: true,
      data: courses,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create course
export const createCourse = async (req, res) => {
  try {
    const { title, description, level, status, price, category } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const course = await Course.create({
      title,
      description: description || '',
      level: level || 'beginner',
      status: status || 'draft',
      price: price || 0,
      category: category || '',
      instructor: req.user.id,
      lessons: []
    });

    res.status(201).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update course
export const updateCourse = async (req, res) => {
  try {
    const { title, description, price, level, status, category } = req.body;

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { title, description, price, level, status, category },
      { new: true, runValidators: true }
    ).populate('instructor', 'name email');

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete course
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Also delete enrollments for this course
    await Enrollment.deleteMany({ course: req.params.id });

    res.status(200).json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================
// Admin: block/unblock user
// ==========================
export const setUserBlocked = async (req, res) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { isBlocked: !!isBlocked },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================
// Admin: change user role
// ==========================
export const setUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================
// Admin: assign/change instructor for a course
// ==========================
export const setCourseInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    const { instructorId } = req.body;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // ensure instructor exists and has role instructor/admin
    const instructor = await User.findById(instructorId);
    if (!instructor) {
      return res.status(404).json({ success: false, message: 'Instructor not found' });
    }
    if (instructor.role !== 'instructor' && instructor.role !== 'admin') {
      return res.status(400).json({ success: false, message: 'User is not an instructor' });
    }

    course.instructor = instructorId;
    await course.save();

    return res.status(200).json({ success: true, data: course });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================
// Admin: publish/unpublish course
// ==========================
export const setCoursePublishState = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // expected: 'published' | 'draft'

    const course = await Course.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    return res.status(200).json({ success: true, data: course });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================
// Admin: analytics (basic)
// ==========================
export const getAdminAnalytics = async (req, res) => {
  try {
    // Keep it simple and safe: reuse existing models; no heavy aggregation.
    const [quizCount, assignmentCount, instructorCount, studentCount, courseCount, enrollmentCount] = await Promise.all([
      Quiz.countDocuments(),
      Assignment.countDocuments(),
      User.countDocuments({ role: 'instructor' }),
      User.countDocuments({ role: 'student' }),
      Course.countDocuments(),
      Enrollment.countDocuments(),
    ]);

    // Average course progress (completion) across enrollments.
    const avgProgressAgg = await Enrollment.aggregate([
      { $group: { _id: null, avg: { $avg: '$progress' } } },
    ]);
    const avgProgress = avgProgressAgg?.[0]?.avg ?? 0;

    return res.status(200).json({
      success: true,
      data: {
        totals: {
          students: studentCount,
          instructors: instructorCount,
          courses: courseCount,
          enrollments: enrollmentCount,
          quizzes: quizCount,
          assignments: assignmentCount,
        },
        completion: {
          avgProgress: Math.round(avgProgress * 10) / 10,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================
// Admin: submissions overview (read-only)
// ==========================
export const getAdminAllSubmissions = async (req, res) => {
  try {
    const { limit = 200 } = req.query;
    const submissions = [];

    // Load assignments with course/instructor for context.
    const assignments = await Assignment.find()
      .populate('course instructor');

    for (const assignment of assignments) {
      const subs = Array.isArray(assignment.submissions) ? assignment.submissions : [];
      for (const s of subs) {
        // Only include submissions with student id.
        if (!s?.student) continue;
        submissions.push({
          _id: s._id,
          assignmentId: assignment._id,
          assignmentTitle: assignment.title,
          courseId: assignment.course?._id,
          courseTitle: assignment.course?.title,
          studentId: s.student,
          status: s.status,
          submittedAt: s.submittedAt,
          score: s.score,
          feedback: s.feedback,
          gradedAt: s.gradedAt,
        });
      }
    }

    // sort by submittedAt desc
    submissions.sort((a, b) => (b.submittedAt ? new Date(b.submittedAt) - new Date(a.submittedAt) : 0));

    return res.status(200).json({ success: true, data: submissions.slice(0, Number(limit)) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

