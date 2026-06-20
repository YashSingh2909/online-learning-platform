import Payment from '../models/Payment.js';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import crypto from 'crypto';

// Create payment order
export const createPaymentOrder = async (req, res) => {
  try {
    const { courseId } = req.body;

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

    // Create payment record
    const payment = await Payment.create({
      student: req.user.id,
      course: courseId,
      amount: course.price * 100, // Convert to paise for Razorpay
      status: 'pending',
    });

    // For demo purposes, return payment details
    res.status(201).json({
      success: true,
      data: {
        orderId: payment._id,
        amount: course.price,
        currency: 'INR',
        courseName: course.title,
        studentEmail: req.user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify payment
export const verifyPayment = async (req, res) => {
  try {
    const { orderId, razorpayPaymentId, razorpaySignature } = req.body;

    const payment = await Payment.findById(orderId);

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    // Verify signature (simplified for demo)
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    payment.status = 'success';
    payment.paidAt = new Date();

    await payment.save();

    // Create enrollment
    await Enrollment.create({
      student: payment.student,
      course: payment.course,
    });

    // Add to user's enrolled courses
    await User.findByIdAndUpdate(payment.student, {
      $push: { enrolledCourses: payment.course },
    });

    // Increment course students
    await Course.findByIdAndUpdate(payment.course, {
      $inc: { students: 1 },
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: payment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get payment history
export const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ student: req.user.id })
      .populate('course', 'title price')
      .select('-razorpaySignature');

    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all payments (Admin only)
export const getAllPayments = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const payments = await Payment.find()
      .populate('student', 'name email')
      .populate('course', 'title price')
      .select('-razorpaySignature');

    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
