import Assignment from '../models/Assignment.js';
import Course from '../models/Course.js';
import Notification from '../models/Notification.js';

// Get assignments for a course
export const getAssignmentsByCourse = async (req, res) => {
  try {
    const courseId = req.params.id || req.params.courseId;
    console.log('getAssignmentsByCourse called with courseId:', courseId);
    const isInstructorOrAdmin = req.user?.role === 'admin' || req.user?.role === 'instructor';

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const isOwner = req.user?.role === 'admin' || course.instructor?.toString() === req.user?.id;
    if (isInstructorOrAdmin && !isOwner) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const filter = isOwner
      ? { course: courseId }
      : {
          course: courseId,
          $or: [{ isFreePreview: true }, { isPublished: true }],
        };


    const assignments = await Assignment.find(filter).populate('instructor', 'name email');



    res.status(200).json({ success: true, data: assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single assignment
export const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate('instructor', 'name email');

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    const isInstructorOrAdmin = req.user?.role === 'admin' || req.user?.role === 'instructor';
    if (!isInstructorOrAdmin) {
      if (!assignment.isPublished && !assignment.isFreePreview) {
        return res.status(403).json({ success: false, message: 'Assignment is locked' });
      }
    }

    res.status(200).json({ success: true, data: assignment });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create assignment (Instructor only)
export const createAssignment = async (req, res) => {
  try {
    const { title, description, courseId, dueDate, deadline, totalPoints, maxScore, resourceUrls, isFreePreview, isPublished } = req.body;


    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const assignment = await Assignment.create({
      title,
      description,
      course: courseId,
      instructor: req.user.id,
      dueDate: dueDate || deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      deadline: deadline || dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      totalPoints: totalPoints || maxScore || 100,
      maxScore: maxScore || totalPoints || 100,
      resourceUrls: Array.isArray(resourceUrls) ? resourceUrls : [],
      isFreePreview: !!isFreePreview,
      isPublished: isPublished !== false,
    });


    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update assignment (instructor/admin owns course)
export const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      dueDate,
      deadline,
      totalPoints,
      maxScore,
      isFreePreview,
      isPublished,
      resourceUrls,
    } = req.body;

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    const course = await Course.findById(assignment.course);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const isOwner = course.instructor?.toString() === req.user.id;
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (title !== undefined) assignment.title = title;
    if (description !== undefined) assignment.description = description;
    if (dueDate !== undefined) assignment.dueDate = dueDate;
    if (deadline !== undefined) assignment.deadline = deadline;
    if (totalPoints !== undefined) assignment.totalPoints = totalPoints;
    if (maxScore !== undefined) assignment.maxScore = maxScore;
    if (isFreePreview !== undefined) assignment.isFreePreview = !!isFreePreview;
    if (isPublished !== undefined) assignment.isPublished = !!isPublished;

    // If client sends resourceUrls in update, allow replacing them.
    if (resourceUrls !== undefined) {
      assignment.resourceUrls = Array.isArray(resourceUrls) ? resourceUrls : [];
    }

    await assignment.save();
    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Replace assignment resources (upload+replace)
export const replaceAssignmentResources = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    const course = await Course.findById(assignment.course);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const isOwner = course.instructor?.toString() === req.user.id;
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // The actual upload endpoint already returns urls.
    // This handler expects resourceUrls in body (URLs received from frontend upload).
    const { resourceUrls } = req.body;
    if (!Array.isArray(resourceUrls) || resourceUrls.length === 0) {
      return res.status(400).json({ success: false, message: 'resourceUrls must be a non-empty array' });
    }

    assignment.resourceUrls = resourceUrls;
    await assignment.save();

    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete assignment (instructor/admin owns course)
export const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    const course = await Course.findById(assignment.course);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const isOwner = course.instructor?.toString() === req.user.id;
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Assignment.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Submit assignment (accept uploaded file URL)
export const submitAssignment = async (req, res) => {
  try {
    const { fileUrl } = req.body;
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }


    // Security: students must not submit locked/unpublished assignments.
    if (req.user?.role !== 'instructor' && req.user?.role !== 'admin') {
      if (!assignment.isPublished && !assignment.isFreePreview) {
        return res.status(403).json({ success: false, message: 'Assignment is locked' });
      }
    }

    // Check if already submitted

    const existingSubmission = assignment.submissions.find((s) => s.student.toString() === req.user.id);

    if (existingSubmission) {
      return res.status(400).json({ success: false, message: 'Already submitted' });
    }

    const submission = {
      student: req.user.id,
      fileUrl,
      submittedAt: new Date(),
      status: 'submitted',
    };

    assignment.submissions.push(submission);
    await assignment.save();

    // Recalculate weighted progress after successful assignment submission.
    try {
      const Enrollment = (await import('../models/Enrollment.js')).default;
      const Course = (await import('../models/Course.js')).default;
      const course = await Course.findById(assignment.course);
      const enrollment = await Enrollment.findOne({ student: req.user.id, course: assignment.course });
      if (enrollment && course) {
        const enrollmentCtrl = await import('./enrollmentController.js');
        await enrollmentCtrl.recalculateEnrollmentProgress({ enrollment, course });
      }
    } catch (e) {
      console.error('Progress recalculation after assignment submit failed:', e);
    }

    res.status(200).json({ success: true, data: assignment });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Grade assignment submission
export const gradeSubmission = async (req, res) => {
  try {
    const { submissionId, score, feedback } = req.body;
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    if (assignment.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const submission = assignment.submissions.find((s) => s._id.toString() === submissionId);

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    submission.score = score;
    submission.feedback = feedback;
    submission.status = 'graded';
    submission.gradedAt = new Date();

    await assignment.save();

    // Recalculate weighted progress after grading (grading is mandatory per spec).
    try {
      const Enrollment = (await import('../models/Enrollment.js')).default;
      const Course = (await import('../models/Course.js')).default;
      const course = await Course.findById(assignment.course);
      const enrollment = await Enrollment.findOne({ student: submission.student, course: assignment.course });
      if (enrollment && course) {
        const enrollmentCtrl = await import('./enrollmentController.js');
        await enrollmentCtrl.recalculateEnrollmentProgress({ enrollment, course });
      }
    } catch (e) {
      console.error('Progress recalculation after assignment grading failed:', e);
    }

    // Create notification for student

    await Notification.create({
      recipient: submission.student,
      title: 'Assignment Graded',
      message: `Your assignment "${assignment.title}" has been graded. Score: ${score}/${assignment.totalPoints}`,
      type: 'grade',
      relatedAssignment: assignment._id,
    });

    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's submissions (student view) - unchanged API contract
export const getUserSubmissions = async (req, res) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId });
    const submissions = [];

    assignments.forEach((assignment) => {
      const submission = assignment.submissions.find((s) => s.student.toString() === req.user.id);
      if (submission) {
        submissions.push({
          assignmentId: assignment._id,
          title: assignment.title,
          ...submission.toObject(),
        });
      }
    });

    res.status(200).json({ success: true, data: submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Instructor/admin: get all submissions for a course (grouped client-side)
export const getAllCourseSubmissions = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Role-based access: instructor/admin only (enforced by middleware ideally, but keep safe here)
    const isInstructorOrAdmin = req.user?.role === 'instructor' || req.user?.role === 'admin';
    if (!isInstructorOrAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Ownership check: instructor must own the course
    // (admin can access all)
    if (req.user?.role !== 'admin') {
      const course = await Course.findById(courseId);
      if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
      const isOwner = course.instructor?.toString() === req.user.id;
      if (!isOwner) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
    }

    const assignments = await Assignment.find({ course: courseId }).populate('course instructor');

    const submissions = [];

    for (const assignment of assignments) {
      const subs = Array.isArray(assignment.submissions) ? assignment.submissions : [];
      for (const s of subs) {
        submissions.push({
          assignmentId: assignment._id,
          title: assignment.title,
          ...s.toObject(),
          student: s.student, // make sure client can access item.student?.name if populated elsewhere
          fileUrl: s.fileUrl,
        });
      }
    }

    res.status(200).json({ success: true, data: submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Instructor/admin: get submissions for a specific assignment
export const getAssignmentSubmissions = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findById(id).populate('course instructor').populate('submissions.student', 'name email');

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    // Role-based access: instructor/admin only
    const isInstructorOrAdmin = req.user?.role === 'instructor' || req.user?.role === 'admin';
    if (!isInstructorOrAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Ownership check: instructor must own the course
    if (req.user?.role !== 'admin') {
      const isOwner = assignment.course?.instructor?.toString() === req.user.id;
      if (!isOwner) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
    }

    const submissions = Array.isArray(assignment.submissions) ? assignment.submissions : [];

    res.status(200).json({ success: true, data: submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
