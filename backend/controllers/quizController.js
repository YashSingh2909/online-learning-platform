import Quiz from '../models/Quiz.js';
import Course from '../models/Course.js';


// Get quizzes for a course
export const getQuizzesByCourse = async (req, res) => {
  try {
    // Note: existing UI currently fetches quizzes for enrolled courses.
    // We will not add enrollment-based filtering here yet; publish/free-preview are persisted.
    const { courseId } = req.params;
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

    const quizzes = await Quiz.find(filter).select('-questions');



    res.status(200).json({ success: true, data: quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get single quiz
export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    const course = await Course.findById(quiz.course);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const isInstructorOrAdmin = req.user?.role === 'admin' || req.user?.role === 'instructor';
    const isCourseOwnerInstructor = isInstructorOrAdmin && course.instructor?.toString() === req.user.id;

    if (!isCourseOwnerInstructor && course.isPublished !== true) {
      return res.status(403).json({ success: false, message: 'Course is not published' });
    }

    // Enforce quiz availability for non-owner users.
    if (!isCourseOwnerInstructor && !isInstructorOrAdmin) {
      if (!quiz.isPublished && !quiz.isFreePreview) {
        return res.status(403).json({ success: false, message: 'Quiz is locked' });
      }
    }

    // Hide correct answers for students who haven't attempted
    const userAttempt = quiz.attempts.find((a) => a.student.toString() === req.user.id);

    // For locked content we already returned 403 above.
    if (!userAttempt && req.user.role === 'student') {


      const quizCopy = quiz.toObject();
      quizCopy.questions = quizCopy.questions.map((q) => ({
        ...q,
        correctAnswer: undefined,
      }));
      return res.status(200).json({ success: true, data: quizCopy });
    }

    res.status(200).json({ success: true, data: quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create quiz (Instructor only)
export const createQuiz = async (req, res) => {
  try {
    const { title, description, courseId, questions, totalPoints, passingScore, timeLimit, isFreePreview, isPublished } = req.body;


    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const quiz = await Quiz.create({
      title,
      description: description || '',
      course: courseId,
      questions,
      totalPoints: totalPoints || questions.length * 10,
      passingScore: passingScore || 70,
      timeLimit: timeLimit || 0,
      isFreePreview: !!isFreePreview,
      isPublished: isPublished !== false,
    });


    res.status(201).json({ success: true, data: quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update quiz (instructor/admin owns course)
export const updateQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { title, description, questions, totalPoints, passingScore, timeLimit, isFreePreview, isPublished } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    const course = await Course.findById(quiz.course);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const isOwner = course.instructor?.toString() === req.user.id;
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (title !== undefined) quiz.title = title;
    if (description !== undefined) quiz.description = description;
    if (questions !== undefined) quiz.questions = questions;
    if (totalPoints !== undefined) quiz.totalPoints = totalPoints;
    if (passingScore !== undefined) quiz.passingScore = passingScore;
    if (timeLimit !== undefined) quiz.timeLimit = timeLimit;
    if (isFreePreview !== undefined) quiz.isFreePreview = !!isFreePreview;
    if (isPublished !== undefined) quiz.isPublished = !!isPublished;

    // Safety: if questions changed and totalPoints not provided, keep current totalPoints.
    await quiz.save();

    res.status(200).json({ success: true, data: quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete quiz (instructor/admin owns course)
export const deleteQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    const course = await Course.findById(quiz.course);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const isOwner = course.instructor?.toString() === req.user.id;
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Quiz.findByIdAndDelete(quizId);

    res.status(200).json({ success: true, message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Submit quiz
export const submitQuiz = async (req, res) => {
  try {
    const { answers, timeTaken } = req.body;
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    // Normalize/validate answers payload.
    // Frontend sends answers as an object keyed by questionId:
    //   { [questionId]: selectedOptionIndex }
    // Backend previously assumed an array.
    let normalizedAnswers;

    if (Array.isArray(answers)) {
      normalizedAnswers = answers;
    } else if (answers && typeof answers === 'object') {
      // Convert object => array in question order.
      normalizedAnswers = quiz.questions.map((q) => {
        const key = q._id?.toString();
        return key && Object.prototype.hasOwnProperty.call(answers, key)
          ? answers[key]
          : undefined;
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid quiz answers format' });
    }

    // Calculate score
    let score = 0;
    const perQuestionPoints = quiz.questions.length
      ? Math.round(quiz.totalPoints / quiz.questions.length)
      : 0;

    quiz.questions.forEach((q, index) => {
      const answer = normalizedAnswers?.[index];
      if (answer === undefined) return;
      if (String(answer) === String(q.correctAnswer)) {
        score += perQuestionPoints;
      }
    });

    // Create attempt record (store normalized array so future usage is consistent)
    const attempt = {
      student: req.user.id,
      score,
      answers: normalizedAnswers,
      attemptedAt: new Date(),
      timeTaken,
    };

    quiz.attempts.push(attempt);
    await quiz.save();

    // Recalculate weighted progress after successful quiz submission.
    // (progress is course-aware and dynamic; only published/free-preview quizzes count)
    try {
      // We need the student's enrollment for this quiz's course.
      // eslint-disable-next-line no-undef
      const Enrollment = (await import('../models/Enrollment.js')).default;
      const Course = (await import('../models/Course.js')).default;

      const course = await Course.findById(quiz.course);
      const enrollment = await Enrollment.findOne({ student: req.user.id, course: quiz.course });
      if (enrollment && course) {
        const enrollmentCtrl = await import('./enrollmentController.js');
        await enrollmentCtrl.recalculateEnrollmentProgress({ enrollment, course });
      }
    } catch (e) {
      // Progress recalculation should not break quiz submission.
      console.error('Progress recalculation after quiz submit failed:', e);
    }

    const isPassed = score >= quiz.passingScore;

    // Retakes are allowed.
    // Progress/cert eligibility are computed using student's HIGHEST quiz percentage,
    // so later failed attempts MUST NOT reduce progress.
    // NOTE: We do not store any "passed" flags here; enrollment + certificate logic uses highest attempt.

    // Build result contract expected by UI
    const totalQuestions = quiz.questions.length;


    const correctCount = normalizedAnswers.reduce((acc, ans, idx) => {
      if (ans === undefined) return acc;
      return String(ans) === String(quiz.questions[idx].correctAnswer) ? acc + 1 : acc;
    }, 0);

    const totalPoints = quiz.totalPoints;
    const percentage = totalPoints ? Math.round((score / totalPoints) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        // UI currently shows: result.score}% (treating as percentage)
        // So we provide percentage via `score` for backward compatibility.
        score: percentage,
        percentage,
        correct: correctCount,
        total: totalQuestions,
        totalPoints,
        isPassed,
        passingScore: quiz.passingScore,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get quiz attempts for student
export const getQuizAttempts = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    const attempts = quiz.attempts.filter((a) => a.student.toString() === req.user.id);

    res.status(200).json({ success: true, data: attempts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
