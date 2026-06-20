import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import { generateCertificate } from '../utils/certificateUtils.js';
import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';

// Generate certificate for completed course
export const generateCourseCertificate = async (req, res) => {
  try {
    const { enrollmentId } = req.body;

    const enrollment = await Enrollment.findById(enrollmentId).populate('student').populate('course');

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    if (enrollment.student._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (enrollment.progress < 100) {
      return res.status(400).json({
        success: false,
        message: 'Course not completed yet',
      });
    }

    if (enrollment.certificateReceived) {
      return res.status(400).json({
        success: false,
        message: 'Certificate already generated',
      });
    }

    // Generate certificate ID
    const certificateId = randomUUID();
    const studentName = enrollment.student.name;
    const courseName = enrollment.course.title;

    // Generate PDF
    const filePath = await generateCertificate(studentName, courseName, new Date(), certificateId);

    // Update enrollment
    enrollment.certificateReceived = true;
    enrollment.certificateDate = new Date();
    await enrollment.save();

    // Return certificate file
    res.download(filePath, `certificate-${certificateId}.pdf`, (err) => {
      if (err) {
        console.error('Error sending certificate:', err);
      }
      // Clean up file after sending
      // fs.unlinkSync(filePath);
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get certificate status
export const getCertificateStatus = async (req, res) => {
  try {
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    }).populate('course');

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    res.status(200).json({
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
    res.status(500).json({ success: false, message: error.message });
  }
};
