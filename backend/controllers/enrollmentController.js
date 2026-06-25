import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import Quiz from '../models/Quiz.js';
import Assignment from '../models/Assignment.js';

// Enroll in a course
export const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      student: req.user.id,
      course: courseId,
    });

    // Add course to user's enrolled courses
    await User.findByIdAndUpdate(req.user.id, {
      $push: { enrolledCourses: courseId },
    });

    // Increment course students count
    course.students += 1;
    await course.save();

    // Create notification
    const notification = await Notification.create({
      recipient: req.user.id,
      title: 'Course Enrollment Successful',
      message: `You have successfully enrolled in ${course.title}`,
      type: 'enrollment',
      relatedCourse: courseId,
    });

    const io = req.app.get('io');
    if (io) {
      io.to(`user_${req.user.id}`).emit('new_notification', notification);
    }

    res.status(201).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user enrollments
export const getUserEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate('course')
      .populate('student', 'name email');

    res.status(200).json({ success: true, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get enrollment by course
export const getEnrollmentByCourse = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: req.params.courseId,
    }).populate('course');

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    res.status(200).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Centralized: recompute weighted progress based on existing course requirements.
const recalculateEnrollmentProgressLegacy = async ({ enrollment, course }) => {

  // Lessons component
  const lessons = Array.isArray(course?.lessons) ? course.lessons : [];
  const totalLessons = lessons.length;
  const completedLessonsCount = (enrollment.completedLessons || []).length;

  const lessonsRatio = totalLessons > 0 ? Math.min(1, completedLessonsCount / totalLessons) : 1;

  // Quizzes component
  const quizzes = await Quiz.find({
    course: course._id,
    // instructors see all; students rely on isPublished/isFreePreview elsewhere,
    // but progress should not count locked quizzes for non-owners. We'll count only published or free preview.
    $or: [{ isPublished: true }, { isFreePreview: true }],
  }).select('passingScore');

  const quizCount = quizzes.length;
  let quizRatio = 1;
  if (quizCount > 0) {
    // Determine if student passed each quiz (or at least submitted) - best match: pass using passingScore.
    // Using quiz.attempts to find a successful submission by this student.
    const attemptsByQuizId = await Promise.all(
      quizzes.map(async (q) => {
        const attempt = (q.attempts || []).find((a) => a.student?.toString() === enrollment.student.toString());
        return attempt;
      })
    );

    // Determine passed quizzes based on attempt.score.

    // quizController stores `attempt.score` as points.
    // But quizController also defines pass/fail using the quiz's passingScore.
    // So we use the same comparison here.
    let passed = 0;
    for (let i = 0; i < quizzes.length; i++) {
      const q = quizzes[i];
      const attempt = attemptsByQuizId[i];
      if (!attempt) continue;
      if (attempt.score >= q.passingScore) passed += 1;
    }

    quizRatio = passed / quizCount;
  }


  // Assignments component
  const assignments = await Assignment.find({
    course: course._id,
    $or: [{ isPublished: true }, { isFreePreview: true }],
  }).select('totalPoints');

  const assignmentCount = assignments.length;
  let assignmentRatio = 1;
  if (assignmentCount > 0) {
    // Count graded submissions only (most strict). If feedback says grading mandatory, this matches requirement.
    // If grading is optional, we'd count submitted. Your ask: "If grading is mandatory: count only after grading".
    // We count graded = submissions with status==='graded'.
    let gradedCount = 0;
    for (const a of assignments) {
      const sub = (a.submissions || []).find((s) => s.student?.toString() === enrollment.student.toString());
      if (!sub) continue;
      if (sub.status === 'graded') gradedCount += 1;
    }
    assignmentRatio = gradedCount / assignmentCount;
  }

  // Dynamic weights: only include components that exist in the course.
  const hasQuizzes = quizCount > 0;
  const hasAssignments = assignmentCount > 0;
  const hasLessons = totalLessons > 0;

  // Base weights: lessons 60, quizzes 20, assignments 20.
  // Re-normalize among existing components so a course with only lessons yields 100%.
  let weights = [];
  if (hasLessons) weights.push({ key: 'lessons', w: 60, ratio: lessonsRatio });
  if (hasQuizzes) weights.push({ key: 'quizzes', w: 20, ratio: quizRatio });
  if (hasAssignments) weights.push({ key: 'assignments', w: 20, ratio: assignmentRatio });

  if (weights.length === 0) {
    enrollment.progress = 0;
    enrollment.status = 'active';
    await enrollment.save();
    return enrollment;
  }

  const totalW = weights.reduce((acc, x) => acc + x.w, 0);
  const progress = weights.reduce((acc, x) => acc + x.ratio * (x.w / totalW), 0) * 100;

  enrollment.progress = Math.round(Math.max(0, Math.min(100, progress)));
  enrollment.status = enrollment.progress === 100 ? 'completed' : 'active';
  await enrollment.save();
  return enrollment;
};

// Recalculate weighted progress based on lessons + quizzes + assignments
export const recalculateEnrollmentProgress = async ({ enrollment, course }) => {
  // Lessons component
  const lessons = Array.isArray(course?.lessons) ? course.lessons : [];
  const totalLessons = lessons.length;
  const completedLessonsCount = (enrollment.completedLessons || []).length;

  const lessonsRatio = totalLessons > 0 ? Math.min(1, completedLessonsCount / totalLessons) : 1;

  // Quizzes component
  // IMPORTANT: quiz attempt `score` is stored as POINTS (not percentage).
  // But `passingScore` is configured as a percentage threshold.
  // So we must convert highest attempt score -> percentage using quiz.totalPoints.
  const quizzes = await Quiz.find({
    course: course._id,
    $or: [{ isPublished: true }, { isFreePreview: true }],
  }).select('passingScore totalPoints attempts questions');

  const quizCount = quizzes.length;
  let quizRatio = 1;

  if (quizCount > 0) {
    let passed = 0;

    for (const quiz of quizzes) {
      const attempts = Array.isArray(quiz.attempts) ? quiz.attempts : [];
      const studentAttempts = attempts.filter(
        (a) => a.student?.toString() === enrollment.student.toString()
      );

      if (studentAttempts.length === 0) continue;

      // highest achieved points for this quiz
      const highestAttempt = studentAttempts.reduce((max, a) => {
        const pts = typeof a.score === 'number' ? a.score : 0;
        const cur = typeof max.score === 'number' ? max.score : 0;
        return pts > cur ? a : max;
      }, studentAttempts[0]);

      const highestPoints = typeof highestAttempt.score === 'number' ? highestAttempt.score : 0;
      const totalPoints = typeof quiz.totalPoints === 'number' && quiz.totalPoints > 0 ? quiz.totalPoints : 0;
      const highestPercentage = totalPoints > 0 ? (highestPoints / totalPoints) * 100 : 0;

      if (highestPercentage >= quiz.passingScore) passed += 1;
    }

    quizRatio = passed / quizCount;
  }

  // Assignments component (grading is mandatory per spec)
  const assignments = await Assignment.find({
    course: course._id,
    $or: [{ isPublished: true }, { isFreePreview: true }],
  }).select('totalPoints submissions');

  const assignmentCount = assignments.length;
  let assignmentRatio = 1;

  if (assignmentCount > 0) {
    let gradedCount = 0;
    for (const a of assignments) {
      const subs = Array.isArray(a.submissions) ? a.submissions : [];
      const sub = subs.find((s) => s.student?.toString() === enrollment.student.toString());
      if (!sub) continue;
      if (sub.status === 'graded') gradedCount += 1;
    }
    assignmentRatio = gradedCount / assignmentCount;
  }

  // Dynamic weights: only include components that exist in the course.
  const hasQuizzes = quizCount > 0;
  const hasAssignments = assignmentCount > 0;
  const hasLessons = totalLessons > 0;

  let weights = [];
  if (hasLessons) weights.push({ key: 'lessons', w: 60, ratio: lessonsRatio });
  if (hasQuizzes) weights.push({ key: 'quizzes', w: 20, ratio: quizRatio });
  if (hasAssignments) weights.push({ key: 'assignments', w: 20, ratio: assignmentRatio });

  if (weights.length === 0) {
    enrollment.progress = 0;
    enrollment.status = 'active';
    await enrollment.save();
    return enrollment;
  }

  const totalW = weights.reduce((acc, x) => acc + x.w, 0);
  const progress = weights.reduce((acc, x) => acc + x.ratio * (x.w / totalW), 0) * 100;

  enrollment.progress = Math.round(Math.max(0, Math.min(100, progress)));
  enrollment.status = enrollment.progress === 100 ? 'completed' : 'active';
  await enrollment.save();
  return enrollment;
};

// Mark lesson as complete
export const completeLesson = async (req, res) => {
  try {
    const { courseId, lessonId } = req.body;

    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    // Add lesson to completed lessons if not already
    const alreadyCompleted = enrollment.completedLessons?.includes(lessonId);
    if (!alreadyCompleted) {
      enrollment.completedLessons.push(lessonId);
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    await recalculateEnrollmentProgress({ enrollment, course });

    return res.status(200).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get course enrollments (for instructor)
export const getCourseEnrollments = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const enrollments = await Enrollment.find({ course: req.params.courseId })
      .populate('student', 'name email profileImage')
      .select('student progress status enrolledAt completedLessons');

    res.status(200).json({ success: true, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
