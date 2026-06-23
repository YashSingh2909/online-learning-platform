import express from 'express';
import {
  generateCourseCertificate,
  getCertificateStatus,
} from '../controllers/certificateController.js';
import { protect } from '../middleware/auth.js';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import Certificate from '../models/Certificate.js';

const router = express.Router();

// ==========================
// GENERATE CERTIFICATE
// ==========================
router.post('/generate', protect, (req, res, next) => {
  console.log('[CERT] GENERATE HIT');
  return generateCourseCertificate(req, res, next);
});

// ==========================
// STATUS
// ==========================
router.get('/status/:courseId', protect, getCertificateStatus);

// ==========================
// META (SAFE)
// ==========================
router.get('/meta/:enrollmentId', protect, async (req, res) => {
  try {
    const cert = await Certificate.findOne({
      enrollmentId: req.params.enrollmentId,
      userId: req.user.id,
    });

    if (!cert) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found',
      });
    }

    return res.json({
      success: true,
      data: cert,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ==========================
// DOWNLOAD CERTIFICATE (FIXED)
// ==========================
router.get('/download/:enrollmentId', protect, async (req, res) => {
  try {
    const { enrollmentId } = req.params;

    console.log('[CERT DOWNLOAD HIT]', {
      enrollmentId,
      userId: req.user.id,
    });

    // ✅ SAFE CHECK (NO CRASH IF BAD ID)
    const cert = await Certificate.findOne({
      enrollmentId: enrollmentId,
      userId: req.user.id,
    });

    if (!cert) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found',
      });
    }

    if (!cert.pdfUrl) {
      return res.status(404).json({
        success: false,
        message: 'PDF not generated yet',
      });
    }

    const filename = path.basename(cert.pdfUrl);

    // ✅ FIXED ABSOLUTE PATH (NO double backend issue)
    // Resolve file path relative to repo-root to match certificateUtils output
    const repoRoot = path.resolve(process.cwd(), '..');
    const filePath = path.join(repoRoot, 'certificates', filename);

    console.log('[CERT FILE PATH]', { filePath, repoRoot, filename });


    if (!fs.existsSync(filePath)) {
      console.log('[CERT FILE MISSING ON DISK]');
      return res.status(404).json({
        success: false,
        message: 'PDF file missing on server',
      });
    }

    return res.download(filePath, filename);

  } catch (err) {
    console.error('[CERT DOWNLOAD ERROR]', err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;