import express from 'express';
import {
  generateCourseCertificate,
  getCertificateStatus,
} from '../controllers/certificateController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate', protect, generateCourseCertificate);
router.get('/status/:courseId', protect, getCertificateStatus);

export default router;
