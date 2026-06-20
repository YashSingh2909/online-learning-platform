import express from 'express';
import {
  createPaymentOrder,
  verifyPayment,
  getPaymentHistory,
  getAllPayments,
} from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-order', protect, createPaymentOrder);
router.post('/verify', protect, verifyPayment);
router.get('/history', protect, getPaymentHistory);
router.get('/', protect, authorize('admin'), getAllPayments);

export default router;
