import express from 'express';
import multer from 'multer';

import { protect } from '../middleware/auth.js';
import { cloudinaryUploadStream } from '../config/cloudinary.js';

const router = express.Router();

const uploadResources = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'application/zip',
      'application/x-zip-compressed',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-powerpoint',
      /^image\//,
    ];

    const mime = file.mimetype;
    const ok = allowedMimes.some((t) => (typeof t === 'string' ? t === mime : t.test(mime)));

    if (!ok) return cb(new Error('Unsupported file type'));
    cb(null, true);
  },
  limits: { fileSize: 100 * 1024 * 1024 },
});

const uploadUrl = async (file, folder, resourceType = 'auto') => {
  const result = await cloudinaryUploadStream({
    buffer: file.buffer,
    mimetype: file.mimetype,
    folder,
    resourceType,
  });

  if (!result?.secure_url) {
    throw new Error('Cloudinary upload failed');
  }

  return result.secure_url;
};

// Student uploads (assignment submission file)
router.post('/student-assignment-file', protect, (req, res, next) => {
  // Only students allowed to use this endpoint
  if (req.user?.role !== 'student' && req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Only students can upload assignment files' });
  }
  next();
}, uploadResources.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'file is required' });

    const url = await uploadUrl(req.file, 'edusphere/student-assignments', 'auto');
    return res.status(200).json({ success: true, data: { url } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Upload failed' });
  }
});

export default router;


