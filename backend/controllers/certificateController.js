import Enrollment from '../models/Enrollment.js';
import Certificate from '../models/Certificate.js';
import { generateCertificate } from '../utils/certificateUtils.js';
import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';

// ==========================
// GENERATE CERTIFICATE
// ==========================
export const generateCourseCertificate = async (req, res) => {
  try {
    const { enrollmentId } = req.body;

    console.log('[CERT] generateCourseCertificate HIT:', enrollmentId);
    console.log('[CERT] NEW CERTIFICATE TEMPLATE LOADED]');

    const startTime = new Date().toISOString();
    console.log('[CERT] generation start time:', startTime);

    const enrollment = await Enrollment.findById(enrollmentId)
      .populate('student')
      .populate('course');


    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
      });
    }

    if (
      enrollment.student._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // Certificate eligibility must depend on all required course components:
    // 1) all lessons completed
    // 2) required quizzes passed
    // 3) required assignments graded
    //
    // To minimize model/schema changes, we enforce the same requirement checks used by progress computation,
    // but here we make it strict and non-weighted.

    const lessons = Array.isArray(enrollment.course?.lessons) ? enrollment.course.lessons : [];
    const totalLessons = lessons.length;
    const completedLessonsCount = (enrollment.completedLessons || []).length;

    // Load required published/free-preview quizzes and assignments.
    const Quiz = (await import('../models/Quiz.js')).default;
    const Assignment = (await import('../models/Assignment.js')).default;

    const quizzes = await Quiz.find({
      course: enrollment.course._id,
      $or: [{ isPublished: true }, { isFreePreview: true }],
    }).select('passingScore totalPoints');

    const quizCount = quizzes.length;
    let passedQuizzes = 0;

    // Find highest score % for each quiz by scanning attempts.
    for (const quiz of quizzes) {
      const quizDoc = await Quiz.findById(quiz._id).select('attempts passingScore totalPoints');
      const attempts = Array.isArray(quizDoc.attempts) ? quizDoc.attempts : [];
      const studentAttempts = attempts.filter((a) => a.student?.toString() === enrollment.student._id.toString());
      if (studentAttempts.length === 0) continue;

      const highest = studentAttempts.reduce((max, a) => {
        const cur = typeof a.score === 'number' ? a.score : 0;
        const best = typeof max.score === 'number' ? max.score : 0;
        return cur > best ? a : max;
      }, studentAttempts[0]);

      const totalPoints = typeof quizDoc.totalPoints === 'number' && quizDoc.totalPoints > 0 ? quizDoc.totalPoints : 0;
      const highestPct = totalPoints > 0 ? (highest.score / totalPoints) * 100 : 0;
      if (highestPct >= quizDoc.passingScore) passedQuizzes += 1;
    }

    const assignments = await Assignment.find({
      course: enrollment.course._id,
      $or: [{ isPublished: true }, { isFreePreview: true }],
    }).select('submissions');

    const assignmentCount = assignments.length;
    let gradedAssignments = 0;
    for (const a of assignments) {
      const subs = Array.isArray(a.submissions) ? a.submissions : [];
      const sub = subs.find((s) => s.student?.toString() === enrollment.student._id.toString());
      if (sub?.status === 'graded') gradedAssignments += 1;
    }

    const hasAllLessons = totalLessons === 0 ? true : completedLessonsCount === totalLessons;
    const hasAllQuizzesPassed = quizCount === 0 ? true : passedQuizzes === quizCount;
    const hasAllAssignmentsGraded = assignmentCount === 0 ? true : gradedAssignments === assignmentCount;

    if (!hasAllLessons || !hasAllQuizzesPassed || !hasAllAssignmentsGraded) {
      return res.status(400).json({
        success: false,
        message: 'Course requirements not completed yet',
      });
    }




    console.log('[CERT] enrollment.certificateReceived:', enrollment.certificateReceived);
    if (enrollment.certificateReceived) {
      return res.status(400).json({
        success: false,
        message: 'Certificate already generated',
      });
    }


    // ==========================
    // CERT DATA
    // ==========================
    const certificateId = randomUUID();
    const studentName = enrollment.student.name;
    const courseName = enrollment.course.title;

    console.log('[CERT] BEFORE PDF GENERATION');

    // ==========================
    // FIX: FORCE ABSOLUTE SAFE PATH
    // ==========================
    const filePath = await generateCertificate(
      studentName,
      courseName,
      new Date(),
      certificateId
    );

    console.log('[CERT] PDF PATH RETURNED:', filePath);
    console.log('[CERT] generated certificateId:', certificateId);
    console.log('[CERT] generation end time:', new Date().toISOString());


    // 🔥 FIX: check properly
    if (!filePath) {
      return res.status(500).json({
        success: false,
        message: 'PDF path not returned from generator',
      });
    }

    // 🔥 FIX: ensure file exists
    // Some environments may return before stream flush; re-check and also verify directory exists.
    if (!fs.existsSync(filePath)) {
      const dir = path.dirname(filePath);
      const base = path.basename(filePath);
      console.error('[CERT] FILE NOT FOUND:', {
        filePath,
        dirExists: fs.existsSync(dir),
        dir,
        base,
        dirFiles: fs.existsSync(dir) ? fs.readdirSync(dir).slice(0, 50) : [],
      });

      return res.status(500).json({
        success: false,
        message: 'PDF was not created on disk',
      });
    }

    const pdfUrl = `/certificates/${path.basename(filePath)}`;




    // ==========================
    // SAVE DB
    // ==========================
    const certificate = await Certificate.create({
      userId: req.user.id,
      enrollmentId: enrollment._id,
      courseId: enrollment.course._id,
      certificateId,
      pdfUrl,
      studentName,
      courseTitle: courseName,
      completionDate: new Date(),
      status: 'generated',
    });

    enrollment.certificateReceived = true;
    enrollment.certificateDate = new Date();
    await enrollment.save();

    console.log('[CERT] CREATED SUCCESS:', certificate._id);

    return res.status(201).json({
      success: true,
      message: 'Certificate generated successfully',
      data: {
        certificateId,
        pdfUrl,
      },
    });

  } catch (error) {
    console.error('[CERT ERROR]', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// GET STATUS
// ==========================
export const getCertificateStatus = async (req, res) => {
  try {
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        courseId,
        progress: enrollment.progress,
        isCompleted: enrollment.status === 'completed',
        certificateReceived: enrollment.certificateReceived,
        certificateDate: enrollment.certificateDate,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};